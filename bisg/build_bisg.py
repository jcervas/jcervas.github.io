"""Build static data files for the BISG teaching tool (jonathancervas.com/bisg/).

Usage:  python3 build_bisg.py <output dir, e.g. bisg/data>
Inputs, placed under <scratch>/dl/ where <scratch> is the parent of this script's folder:
  dl/surnames/Names_2010Census.csv  https://www2.census.gov/topics/genealogy/2010surnames/names.zip
  dl/first/firstnames.tab           https://dataverse.harvard.edu/api/access/datafile/7084375 (Tzioumis 2018, CC0)
Geography is fetched from the Census API using CENSUS_API_KEY in ~/.Renviron (never written to output).

Outputs (under OUT):
  surnames/<prefix>.json  Census 2010 surnames, sharded by first two letters
  firstnames.json         Tzioumis (2018) first-name race distributions
  geo/states.json, geo/counties.json, geo/tract/<st>.json, geo/bg/<st>.json
      2020 Census DHC race-by-sex counts (table P12 iterations H-O)

Race order everywhere: white, black, api, aian, multi (2+), hispanic
Geo arrays: [w_m, w_f, b_m, b_f, api_m, api_f, aian_m, aian_f, multi_m, multi_f, hisp_m, hisp_f]
"""
import csv, json, os, re, sys, time, urllib.request, urllib.parse
from collections import defaultdict

S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

def dump(path, obj):
    p = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as f:
        json.dump(obj, f, separators=(",", ":"))

# ---------- Surnames ----------
def num(x):
    return float(x)

shards = defaultdict(dict)
with open(os.path.join(S, "dl/surnames/Names_2010Census.csv"), newline="") as f:
    r = csv.DictReader(f)
    cols = ["pctwhite", "pctblack", "pctapi", "pctaian", "pct2prace", "pcthispanic"]
    allother = None
    nsupp = 0
    for row in r:
        vals = [row[c] for c in cols]
        sup = [v == "(S)" for v in vals]
        known = sum(num(v) for v, s in zip(vals, sup) if not s)
        k = sum(sup)
        fill = max(0.0, 100.0 - known) / k if k else 0
        pct = [round(fill if s else num(v), 2) for v, s in zip(vals, sup)]
        if k:
            nsupp += 1
        name = row["name"]
        if name == "ALL OTHER NAMES":
            allother = {"count": int(row["count"]), "pct": pct}
            continue
        rec = [int(row["rank"]), int(row["count"])] + pct + ([1] if k else [])
        prefix = (name[:2] + "_")[:2]
        shards[prefix][name] = rec
for p, d in shards.items():
    dump(f"surnames/{p}.json", d)
print("surname shards:", len(shards), "names:", sum(len(d) for d in shards.values()), "with suppression:", nsupp)

# ---------- First names ----------
fn = {}
with open(os.path.join(S, "dl/first/firstnames.tab"), encoding="utf-8-sig") as f:
    r = csv.DictReader(f, delimiter="\t")
    for row in r:
        name = row["firstname"].strip('"').upper()
        fn[name] = [int(row["obs"])] + [round(float(row[c]), 2) for c in
                    ["pctwhite", "pctblack", "pctapi", "pctaian", "pct2prace", "pcthispanic"]]
print("first names:", len(fn))

# ---------- Geography (2020 DHC) ----------
key = None
for line in open(os.path.expanduser("~/.Renviron")):
    m = re.match(r"\s*CENSUS_API_KEY\s*=\s*['\"]?([^'\"\s]+)", line)
    if m:
        key = m.group(1)
assert key, "no CENSUS_API_KEY"

ITER = ["I", "J", "L", "M", "K", "O", "H"]  # white, black, asian, nhpi, aian, 2+, hispanic (all NH except H)
VARS = []
for it in ITER:
    VARS += [f"P12{it}_002N", f"P12{it}_026N"]

def fetch(geo_for, geo_in=None):
    q = {"get": "NAME," + ",".join(VARS), "for": geo_for, "key": key}
    url = "https://api.census.gov/data/2020/dec/dhc?" + urllib.parse.urlencode(q)
    if geo_in:
        url += "".join("&in=" + urllib.parse.quote(g) for g in geo_in)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                return json.loads(resp.read())
        except Exception as e:
            print("  retry", geo_for, geo_in, type(e).__name__)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("failed " + geo_for)

def collapse(row, hdr):
    v = [int(row[hdr.index(x)]) for x in VARS]
    w, b, a, nh, ai, mu, hi = [v[i:i + 2] for i in range(0, 14, 2)]
    return w + b + [a[0] + nh[0], a[1] + nh[1]] + ai + mu + hi

STATES = [f"{i:02d}" for i in [1,2,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56]]

d = fetch("state:*")
hdr = d[0]
states, names = {}, {}
for row in d[1:]:
    st = row[hdr.index("state")]
    if st in STATES:
        states[st] = collapse(row, hdr)
        names[st] = row[0]
us = [sum(v[i] for v in states.values()) for i in range(12)]
dump("geo/states.json", {"us": us, "data": states, "names": names})
print("states:", len(states), "US total (excl. SOR):", sum(us))

d = fetch("county:*")
hdr = d[0]
counties, cnames = {}, {}
for row in d[1:]:
    st = row[hdr.index("state")]
    if st in STATES:
        g = st + row[hdr.index("county")]
        counties[g] = collapse(row, hdr)
        cnames[g] = row[0].split(",")[0]
dump("geo/counties.json", {"data": counties, "names": cnames})
print("counties:", len(counties))

ntr = nbg = 0
for st in STATES:
    d = fetch("tract:*", [f"state:{st}"])
    hdr = d[0]
    tr = {row[hdr.index("county")] + row[hdr.index("tract")]: collapse(row, hdr) for row in d[1:]}
    dump(f"geo/tract/{st}.json", tr)
    d = fetch("block group:*", [f"state:{st}", "county:*", "tract:*"])
    hdr = d[0]
    bg = {row[hdr.index("county")] + row[hdr.index("tract")] + row[hdr.index("block group")]: collapse(row, hdr) for row in d[1:]}
    dump(f"geo/bg/{st}.json", bg)
    ntr += len(tr); nbg += len(bg)
    print(st, len(tr), len(bg), flush=True)
print("tracts:", ntr, "block groups:", nbg)

dump("firstnames.json", fn)
dump("meta.json", {"surname_allother": allother, "built": time.strftime("%Y-%m-%d")})
print("done")
