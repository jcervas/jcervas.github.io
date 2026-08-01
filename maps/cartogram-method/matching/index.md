---
layout: subpage
title: "Matching cells to districts"
description: "Pairing every real district with one equal-area cell by minimum-cost assignment, so the two maps can morph into each other."
permalink: /maps/cartogram-method/matching/
---

<link rel="stylesheet" href="{{ '/maps/cartogram-method/doc.css' | relative_url }}?v=f1e3b02b">

<div class="cgdoc" markdown="1">

<nav class="docnav"><a href="{{ '/maps/cartogram-method/' | relative_url }}">Overview</a>
  <a href="{{ '/maps/cartogram-method/placement/' | relative_url }}">Placing the states</a>
  <a href="{{ '/maps/cartogram-method/cells/' | relative_url }}">Carving equal-area cells</a>
  <a href="{{ '/maps/cartogram-method/matching/' | relative_url }}" aria-current="page">Matching cells to districts</a>
  <a href="{{ '/maps/cartogram-method/browser/' | relative_url }}">Solving it in the browser</a>
  <a href="https://github.com/jcervas/cartograms">Source on GitHub</a></nav>

[Carving a state]({{ '/maps/cartogram-method/cells/' | relative_url }}) produces the right *number* of equal-area cells, but
nothing about which cell belongs to which district. Cell 7 is not district 7 — it
is just the seventh polygon the algorithm happened to emit.

Something has to pair them, and the pairing matters: it is what the morph
animates along, and what makes the transition read as districts *moving* rather
than shapes dissolving into unrelated shapes.

![Districts and cells, matched]({{ '/maps/cartogram-method/figures/16-assignment.png' | relative_url }})

Matched pairs share a colour. The small dense districts in the north-east map to
cells the same size as the large southern ones — which is the whole point of the
cartogram, made visible.

> **Where this sits in the build**
>
> census boundaries → project + simplify → [scale to seats]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [place in slots]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [push apart]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [carve into cells]({{ '/maps/cartogram-method/cells/' | relative_url }}) → **match cells to districts** → JSON
>
> mapshaper owns anything topological — projection, simplification,
> dissolve, polygon intersection. Base R owns everything numerical, with no
> packages beyond what ships with R.
>
> The numerical half is also [ported to JavaScript]({{ '/maps/cartogram-method/browser/' | relative_url }}), so the whole
> thing can be re-solved live in a browser.

---

## The rule

Pair each district with exactly one cell so that the **total squared distance**
between their centres is as small as possible.

That is a linear assignment problem. It is tempting to solve it greedily — take
the closest pair, remove both, repeat — but greedy is not optimal and the failure
is visible: one district gets stranded and has to cross the state to reach the
last free cell. The optimum is found exactly by the Hungarian algorithm, in
`R/lib_assign.R`.

For New Jersey the optimal total is about 1,810 px², and the mean district centre
moves 12 px.

## Why squared distance

Squaring penalises one long journey more than several short ones, so the
optimum spreads the displacement around rather than accepting a single state-
crossing move. It is also what the original notebook used, via `munkres-js`.

## The implementation

`hungarian(cost)` is the O(n³) shortest-augmenting-path form (Jonker–Volgenant),
with dual potentials and a virtual start column. About sixty lines of base R, no
packages.

It self-tests on **every build**: `test_hungarian()` runs it against brute force
on 40 random cost matrices and stops the build on any mismatch or invalid
assignment. That check costs milliseconds and means a subtle indexing error in a
hand-rolled solver cannot reach the output silently.

```
[assign] hungarian() matches brute force on 40 random cases
```

The matrix is small — at most 52×52, for California — so the solve is
instantaneous. The whole 435-district assignment takes a few milliseconds.

## Rectangular cases

The apportionment maps break the square assumption. A state that lost a seat has
more cells than it has current districts, because cells are carved at
`max(seatsFrom, seatsTo)`. `hungarian()` handles a rectangular cost matrix
directly when there are more columns than rows, and transposes when there are
more rows than columns.

The cells left unmatched are exactly the seats that moved, which is how the
apportionment map knows which cells to mark. Those carry no district id in the
output, so nothing downstream can mistake them for real districts.

One consequence worth stating: for a comparison that does *not* end at the
apportionment the boundary file was drawn under — 2000 → 2010 against 2022
lines — the districts correspond to neither endpoint, so no assignment is run at
all and `meta.districtsAttached` is false.

## What the output carries

Each district in the JSON gets both shapes and both anchors:

```jsonc
{
  "id": "NJ-01",
  "centroid": [x, y],   // its true geographic centre
  "target":   [x, y],   // the seed point of the cell it was matched to
  "geo":  { "type": "Polygon", ... },   // true geography
  "cell": { "type": "Polygon", ... }    // its equal-area counterpart
}
```

A renderer interpolates `geo → cell` and has everything it needs. Multipolygon
parts are ordered largest-first so a morph library pairing an n-part shape with
an m-part shape matches them sensibly.

## Where the code lives

| File | Role |
|---|---|
| `R/lib_assign.R` | The Hungarian algorithm and its brute-force self-test |
| `R/20_assemble.R` | Builds the cost matrix, solves, writes the election JSON |
| `R/25_assemble_apportionment.R` | The rectangular case, for the apportionment maps |
| `R/41_method_figures.R` | Regenerates the figure on this page |

Back to [placement]({{ '/maps/cartogram-method/placement/' | relative_url }}), or [carving cells]({{ '/maps/cartogram-method/cells/' | relative_url }}).

---

*Updated 30 July 2026.*

</div>
