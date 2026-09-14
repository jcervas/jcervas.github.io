---
layout: subpage
title: "Who counts in 2030"
description: "The Census Bureau has proposed counting only citizens and green-card holders for apportionment. Three seats would move between six states — and Texas is one of the states that loses."
permalink: /maps/citizen-apportionment/
breadcrumb: "Proposed census rule"
wide: true
order: 0
---

<link rel="stylesheet" href="{{ '/maps/apportionment-2020-2030/cartogram.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/maps/citizen-apportionment/doc.css' | relative_url }}">

<div class="cg" id="ap" data-src="{{ '/maps/citizen-apportionment/apportionment-proposed-rule-2030.json' | relative_url }}">
  <div class="cg-head">
    <h2 id="ap-title">Apportionment under the proposed residence rule</h2>
    <div class="cg-sub" id="ap-sub"></div>
  </div>

  <div class="cg-bar">
    <div class="cg-legend" id="ap-legend"></div>
    <span style="flex:1"></span>
    <span class="cg-status" id="ap-status"></span>
    <button id="ap-reset" type="button" class="cg-ghost-btn" hidden>Zoom out &#9099;</button>
  </div>

  <svg class="cg-map" id="ap-map" role="img" aria-label="Cartogram of the change in
       U.S. House apportionment under the proposed census residence rule, with each
       state sized to its seat count"></svg>

  <div class="cg-chips" id="ap-chips"></div>

  <div class="cg-foot">
    Both columns are projections to 2030 — one under the rules in force now, one
    under the rule as proposed. Neither is a result. Each state is carved into
    equal-area cells, so every cell in the country is the same size. Click a state
    to zoom. <strong>Which</strong> cell is marked is presentational: a seat is
    apportioned to a state, not to a place inside it.
  </div>

  <div class="cg-tip" id="ap-tip"></div>
</div>

<script src="{{ '/maps/apportionment-2020-2030/apportionment.js' | relative_url }}" defer></script>

<div class="cgdoc" markdown="1">

On September 10, 2026, the Census Bureau proposed changing who gets counted for
congressional apportionment. Under proposed section 60.4, foreign citizens are counted
only if they are "either citizens or lawful permanent residents of the United States."
Everyone else — people on student and work visas, people awaiting asylum decisions,
people here illegally — would be, in the rule's words, "[n]ot counted for
apportionment."

The comment period closes **October 13, 2026**.

## This is not a citizen-only census

That distinction gets lost in most of the coverage, and it matters more than anything
else on this page. Green-card holders still count. So the population removed from the
apportionment base is not the roughly 23 million non-citizens living in the United
States — it is the 11 million or so who are not lawful permanent residents. About
half the non-citizen population still counts.

Get that wrong and you roughly double the estimated effect.

## Three seats move

| State | 2020 | 2030, current rules | 2030, proposed rule | Change from the rule |
|---|---:|---:|---:|---:|
| California | 52 | 48 (−4) | 47 | −1 |
| Texas | 38 | 42 (+4) | 41 | −1 |
| Illinois | 17 | 16 (−1) | 15 | −1 |
| Michigan | 13 | 12 (−1) | 13 | +1 |
| Tennessee | 9 | 9 (—) | 10 | +1 |
| Wisconsin | 8 | 7 (−1) | 8 | +1 |
| Florida | 28 | 31 (+3) | 31 | — |
| New York | 26 | 25 (−1) | 25 | — |
| Pennsylvania | 17 | 16 (−1) | 16 | — |
| Georgia | 14 | 15 (+1) | 15 | — |
| North Carolina | 14 | 15 (+1) | 15 | — |
| Arizona | 9 | 10 (+1) | 10 | — |
| Minnesota | 8 | 7 (−1) | 7 | — |
| Oregon | 6 | 5 (−1) | 5 | — |
| Utah | 4 | 5 (+1) | 5 | — |
| Idaho | 2 | 3 (+1) | 3 | — |
| Rhode Island | 2 | 1 (−1) | 1 | — |

The middle column is the story most people already know: on current trends, twelve
seats move between sixteen states between 2020 and 2030, with Texas up four and
Florida up three. The right-hand column is what the proposed rule would do *on top of
that* — and it is a much smaller change. Three seats, six states.

## Texas loses

The obvious reading of this rule is that it helps Republicans. The arithmetic is not
that clean.

Texas is projected to gain four seats by 2030 under current rules — the largest gain in
the country. Under the proposed rule it gains three. Texas grew the way it did partly
through immigration, and a rule that stops counting part of that growth takes back some
of what it gave.

The seats do land in states Trump carried in 2024 — Michigan, Tennessee, and Wisconsin
— so the net is two seats toward Trump-won states and two away from Harris-won ones.
But a net of two, at the cost of a Texas seat, is a narrow return on a change this
disruptive.

## How solid is this

Reasonable people will estimate the excluded population differently, so it is worth
asking how much the answer depends on that choice. Bounding it from both sides:

| Scenario | Excluded population | Seats moved |
|---|---:|---:|
| Unauthorized immigrants only | 12.7 million | 3 |
| **Citizens and green-card holders counted (the rule)** | **11.1 million** | **3** |
| Citizens only | 23.4 million | 6 |

The first two rows come from genuinely independent sources — one from DHS estimates of
the lawful permanent resident population, the other from Pew's estimates of the
unauthorized population — and they land within 1.6 million of each other and give the
same answer. The third row is the citizen-only count that is *not* what was proposed;
it is here as the ceiling, and note that even at that ceiling only six seats move.

Across all three scenarios the same states move the same way: Illinois and Texas lose,
Michigan, Tennessee, and Wisconsin gain. That much is solid.

How solid is a harder question than it looks, because the last few seats are always
decided by very little. A seat is worth about 784,000 people in 2030. Under the
proposed rule, Wisconsin holds its eighth seat by roughly 49,000 of them and Tennessee
its tenth by 71,000 — under a tenth of a seat either way. Illinois, one of the three
states that loses, holds the seat it *keeps* by about 35,000.

And the closest call on the whole map belongs to a state that does not appear in the
table at all: South Carolina finishes some 16,000 people short of an eighth seat, a
quarter of one percent of its population. Any of these could land the other way on a
different set of assumptions, or on the actual count.

## Inside the states

Apportionment decides how many seats a state gets. Districting decides where the lines
fall, and there the rule bites differently. Districts must hold equal population, so a
district that loses part of its count has to reach further out to get back to the line
— absorbing neighboring territory, and with it neighboring voters.

Running the districts actually in force for the 2026 election — the ten states that
redrew mid-decade included — against a citizens-and-green-card-holders base:

| District | Non-citizen share | Shortfall | vs. ideal | Presidential lean |
|---|---:|---:|---:|---|
| Florida 27 | 28% | −64,500 | −8.8% | R +15 |
| Texas 33 | 24% | −59,100 | −8.2% | D +33 |
| New Jersey 8 | 27% | −57,600 | −7.8% | D +45 \* |
| Texas 7 | 23% | −54,300 | −7.6% | D +24 |
| Florida 26 | 25% | −53,700 | −7.3% | R +19 |

<small>Lean is the two-party margin in the 2024 presidential race, except
<span markdown="1">\*</span> New Jersey, where 2020 is the most recent result
published at block level.</small>

Across all 429 districts in multi-district states the tilt is consistent but modest:
Democratic-leaning districts sit 0.7% below their state's new ideal on average,
Republican-leaning ones 0.7% above. Of the fifty most underpopulated districts, forty
lean Democratic; of the fifty most overpopulated, thirty-eight lean Republican. So
map-drawers in most states would be moving people out of Republican districts and into
Democratic ones — which is exactly the raw material for a favorable redraw.

But the hardest-hit districts are not the ones that story predicts. The single worst,
and another in the same top five, are Miami-Dade seats that voted for Trump in 2024.
Heavily Hispanic South Florida is among the most non-citizen places in the country, and
a rule that stops counting non-citizens takes the most from it regardless of how it
votes. The average points one way; the extremes do not.

## What this does not capture

Two other parts of the proposal are harder to model and could matter as much as the
population base. Proposed section 60.2 would require that a person's residence be
where they "lawfully spent the greatest number of days," evidenced by tax records, and
would compress the enumeration period to January 3 through April 1. Both narrow the
count further in ways no population estimate here accounts for.

Nor does any of this address the constitutional question. The Fourteenth Amendment
directs that representatives be apportioned "counting the whole number of persons in
each State." In *Department of Commerce v. New York* (2019) the Court rejected the
last administration's stated rationale for a citizenship question as "contrived," and
in *Evenwel v. Abbott* (2016) it upheld total population as a districting base without
requiring it. Whether "persons" can be read to exclude lawfully present people on
visas is a question for the courts, and it will get there.

## Method

Apportionment is calculated by the method of equal proportions (Huntington–Hill), 435
seats, one seat to each state first — the method in use since 1941.

Population comes from Census Bureau vintage 2025 state estimates, projected to 2030.
The composition of each state's population — citizen, non-citizen, lawful permanent
resident — comes from the American Community Survey's one-year estimates for 2005
through 2024, with LPR counts from the Department of Homeland Security and unauthorized
estimates from the Pew Research Center. Each source is used for what it measures well:
the Bureau's estimates for how many people, the survey for who they are.

Projections weight recent years more heavily than older ones, because the 2020–21
population base is distorted by the pandemic and tells us less about 2030 than 2023–24
does. That choice matters, and it is why the middle column here moves twelve seats
where the [2020-to-2030 map]({{ '/maps/apportionment-2020-2030/' | relative_url }})
on this site moves thirteen: that map is fitted without the weighting. The states
involved are the same apart from Michigan, Tennessee, and a second seat each in
Illinois and New York. The *rate* of down-weighting, on the other hand, changes
nothing at all — every decay constant from 0.15 to 1.0 gives the same answer.

The district figures are present-day, not projected: 2020 census population by block,
citizenship from the ACS five-year estimates, both joined to the block assignment files
for the plan each state will actually use in 2026. Blocks nest inside districts exactly,
so nothing is interpolated — every state's districts sum to its census population to the
person. Ten states redrew mid-decade; Missouri's new map was blocked in court, so
Missouri is counted on its 2022 lines. Block data carries citizenship only for the
voting-age population, so each district's non-citizen count is scaled to all ages by its
state's ratio from the ACS — which assumes non-citizens have a similar age profile from
district to district within a state.

A projection is not a census. Small differences in state population can decide the last
few seats, and the 2020 census itself [missed people in fourteen
states](https://www.census.gov/library/stories/2022/05/2020-census-undercount-overcount-rates-by-state.html).
The direction and rough size of these shifts are more trustworthy than any single
state's seat count.

Code and data: [github.com/jcervas](https://github.com/jcervas).

</div>
