"""Build anes2024-partisans.json for the thermometer template: one paired
chart, Democrats on the left thermometer and Republicans on the right.

Input is the ANES Time Series Cumulative Data File (CSV), or any slice of it
that keeps VCF0004 (year), VCF0009z (weight) and VCF0301 (7-point party ID).
Several files may be given; each thermometer is read from the first file
that has it, which is fine because every file holds the same 2024
respondents and only means are taken. The microdata are not committed here
(ANES asks users to get them from electionstudies.org).

Run:  python3 _build/anes2024.py path/to/anes_timeseries_cdf_csv.csv [more.csv]

Partisans include leaners: Democrats are 1-3 on VCF0301, Republicans 5-7.
Means are weighted by VCF0009z (full-sample weight). The cumulative file tops
out at 97 ("97-100 degrees"), and 98/99 (don't know, refused) are dropped.
Any thermometer below that has no 2024 data is skipped, so running this on
the full file picks up every group the 2024 study asked about.
"""
import csv
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
YEAR = "2024"

GROUPS = {
    "VCF0218": "Democratic Party", "VCF0224": "Republican Party",
    "VCF0201": "Democrats", "VCF0202": "Republicans",
    "VCF0211": "Liberals", "VCF0212": "Conservatives",
    "VCF0203": "Protestants", "VCF0204": "Catholics", "VCF0205": "Jews",
    "VCF0206": "Black people", "VCF0207": "White people", "VCF0217": "Hispanics",
    "VCF0227": "Asian Americans", "VCF0209": "Big business", "VCF0210": "Labor unions",
    "VCF0213": "The military", "VCF0214": "Police", "VCF0219": "Middle-class people",
    "VCF0220": "People on welfare", "VCF0223": "Poor people", "VCF0228": "Congress",
    "VCF0229": "Environmentalists", "VCF0231": "Federal government",
    "VCF0232": "Gay men and lesbians", "VCF0233": "Illegal immigrants",
    "VCF0234": "Christian fundamentalists", "VCF0253": "Feminists",
}
PARTIES = {"democrats": ("Democrats", {"1", "2", "3"}), "republicans": ("Republicans", {"5", "6", "7"})}


def means(paths):
    sums = {p: {} for p in PARTIES}
    for path in paths:
        rows = [r for r in csv.DictReader(open(path, newline="")) if r["VCF0004"].strip() == YEAR]
        for var in GROUPS:
            if var not in rows[0] or var in sums["democrats"]:
                continue
            for party, (_, codes) in PARTIES.items():
                tot = wt = 0.0
                for r in rows:
                    v, w = r[var].strip(), r["VCF0009z"].strip()
                    if r["VCF0301"].strip() in codes and v and w and float(v) <= 97:
                        tot += float(v) * float(w)
                        wt += float(w)
                if wt:
                    sums[party][var] = tot / wt
    return sums


def config(sums):
    dem, rep = sums["democrats"], sums["republicans"]
    rows = sorted((v for v in dem if v in rep), key=lambda v: -dem[v])
    return {
        "title": "How do Democrats and Republicans feel about groups in American politics?",
        "subtitle": "Average rating on a feeling thermometer, 2024",
        "series": [PARTIES["democrats"][0], PARTIES["republicans"][0]],
        "data": [{"label": GROUPS[v], "values": [round(dem[v]), round(rep[v])]} for v in rows],
        "note": "Democrats and Republicans include independents who lean toward each party. "
                "Ratings run from 0 (cold, unfavorable) to 100 (warm, favorable); 50 is "
                "neither. Weighted means.",
        "source": "American National Election Studies, 2024 Time Series Study "
                  "(cumulative data file).",
        "byline": "Jonathan Cervas | Carnegie Mellon University",
        "warm": "Warmer",
        "cold": "Colder",
        "domain": [0, 100],
        "groupBreak": 5,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sums = means(sys.argv[1:])
    path = os.path.join(OUT, "anes2024-partisans.json")
    with open(path, "w") as f:
        json.dump(config(sums), f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(path)
    for v in sorted(sums["democrats"], key=lambda v: -sums["democrats"][v]):
        print(f"  {sums['democrats'][v]:5.1f}  {sums['republicans'].get(v, float('nan')):5.1f}  {GROUPS[v]}")
