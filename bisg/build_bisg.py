"""Build static data files for the BISG teaching tool (jonathancervas.com/bisg/).

Usage:  python3 build_bisg.py <output dir, e.g. bisg/data> <download dir> [--names-only]

Inputs in <download dir> (2020 Census name files; see
https://www.census.gov/topics/population/genealogy/data/2020_names.html):
  Names2020_LastNames_RaceHispanic.xlsx
      https://www2.census.gov/topics/genealogy/2020surnames/Names2020_LastNames_RaceHispanic.xlsx
  Names2020_FirstNames_RaceHispanic.xlsx
      https://www2.census.gov/topics/genealogy/2020surnames/Names2020_FirstNames_RaceHispanic.xlsx
Geography is fetched from the Census API (2020 DHC) using CENSUS_API_KEY in ~/.Renviron;
the key is never written to the output. --names-only skips the geography step.

Outputs (under OUT):
  surnames/<prefix>.json    {NAME: [rank, count, w, b, api, aian, multi, hisp]}  (2020 counts)
  firstnames/<prefix>.json  same layout, 2020 first names
  meta.json                 "All other names" rows and national totals for each list
  geo/states.json, geo/counties.json, geo/tract/<st>.json, geo/bg/<st>.json
      2020 Census DHC race-by-sex counts (table P12 iterations H-O)

Race order everywhere: white, black, api, aian, multi (2+), hispanic (all but hispanic are non-Hispanic).
Geo arrays: [w_m, w_f, b_m, b_f, api_m, api_f, aian_m, aian_f, multi_m, multi_f, hisp_m, hisp_f]
"""
import json, os, re, shutil, sys, time, urllib.request, urllib.parse
from collections import defaultdict
import openpyxl

OUT, DL = sys.argv[1], sys.argv[2]
NAMES_ONLY = "--names-only" in sys.argv
os.makedirs(OUT, exist_ok=True)

def dump(path, obj):
    p = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as f:
        json.dump(obj, f, separators=(",", ":"))

# ---------- 2020 Census name files ----------
# Source column order: W, B, AIAN, API, 2+, Hispanic  ->  internal: W, B, API, AIAN, 2+, Hispanic
REORDER = [0, 1, 3, 2, 4, 5]

def build_names(xlsx, outdir):
    ws = openpyxl.load_workbook(os.path.join(DL, xlsx), read_only=True).worksheets[0]
    rows = ws.iter_rows(values_only=True)
    for row in rows:
        if row and row[0] in ("LAST NAME", "FIRST NAME"):
            break
    shards, allother, n = defaultdict(dict), None, 0
    totals = [0] * 6
    for row in rows:
        if not row or not row[0]:
            continue
        name, rank, count = str(row[0]).strip().upper(), row[1], int(row[2])
        grp = [int(row[5 + i]) for i in REORDER]
        assert all(g >= 0 for g in grp) and sum(grp) == count, name
        totals = [t + g for t, g in zip(totals, grp)]
        if name == "ALL OTHER NAMES":
            allother = {"count": count, "counts": grp}
            continue
        name = re.sub(r"[^A-Z]", "", name)
        if not name:
            continue
        shards[(name[:2] + "_")[:2]][name] = [int(rank), count] + grp
        n += 1
    shutil.rmtree(os.path.join(OUT, outdir), ignore_errors=True)
    for p, d in shards.items():
        dump(f"{outdir}/{p}.json", d)
    print(xlsx, "names:", n, "shards:", len(shards), "total people:", sum(totals))
    return {"allother": allother, "totals": totals, "n": n}

sur = build_names("Names2020_LastNames_RaceHispanic.xlsx", "surnames")
fst = build_names("Names2020_FirstNames_RaceHispanic.xlsx", "firstnames")
dump("meta.json", {"surname": sur, "first": fst, "built": time.strftime("%Y-%m-%d")})

if NAMES_ONLY:
    sys.exit(0)

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
print("done")
