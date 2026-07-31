---
layout: subpage
title: "Solving it in the browser"
description: "The numerical half of the pipeline ported to JavaScript, so the cartogram can be re-solved live with different padding, state sizes and seat counts."
permalink: /maps/cartogram-method/browser/
---

<link rel="stylesheet" href="{{ '/maps/cartogram-method/doc.css' | relative_url }}?v=f1e3b02b">

<div class="cgdoc" markdown="1">

<nav class="docnav"><a href="{{ '/maps/cartogram-method/' | relative_url }}">Overview</a>
  <a href="{{ '/maps/cartogram-method/placement/' | relative_url }}">Placing the states</a>
  <a href="{{ '/maps/cartogram-method/cells/' | relative_url }}">Carving equal-area cells</a>
  <a href="{{ '/maps/cartogram-method/matching/' | relative_url }}">Matching cells to districts</a>
  <a href="{{ '/maps/cartogram-method/browser/' | relative_url }}" aria-current="page">Solving it in the browser</a>
  <a href="https://github.com/jcervas/cartograms">Source on GitHub</a></nav>

The pipeline in [placement]({{ '/maps/cartogram-method/placement/' | relative_url }}), [carving]({{ '/maps/cartogram-method/cells/' | relative_url }}) and
[matching]({{ '/maps/cartogram-method/matching/' | relative_url }}) runs in R and produces a finished JSON file. That is
the right shape for publishing one map, and the wrong shape for asking *what
if* — what if the states were bigger, what if the padding were wider, what if
the seats came from the 2030 projection instead of 2022.

So the numerical half is also ported to JavaScript, in `web/solver.js`, and
driven by a page that re-solves live:
[the studio](https://jonathancervas.com/maps/cartogram-studio/). It takes your
own seat counts, and your own geography — the method is not really about the
United States, and nothing downstream assumes 435 seats or fifty regions.

> **Where this sits in the build**
>
> census boundaries → project + simplify → [scale to seats]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [place in slots]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [push apart]({{ '/maps/cartogram-method/placement/' | relative_url }}) → [carve into cells]({{ '/maps/cartogram-method/cells/' | relative_url }}) → [match cells to districts]({{ '/maps/cartogram-method/matching/' | relative_url }}) → JSON
>
> mapshaper owns anything topological — projection, simplification,
> dissolve, polygon intersection. Base R owns everything numerical, with no
> packages beyond what ships with R.
>
> **This page is that same numerical half, ported to run client-side.**

---

## What moved, and what did not

Only the numerical stages are ported. The topological ones stay where they are:

| Stage | Where it runs in the browser build |
|---|---|
| Project, simplify, dissolve | Not ported — mapshaper does it once, and the result ships as the page's data |
| Scale to seats | JS |
| Place in slots, push apart | JS (`relaxDiscs`, `boundaryDiscs`) |
| Sample, cluster, balance | JS (`samplePoints`, `kmeans`, `balance`) |
| Build cells | JS (`powerCells`, `clipBisector`) |
| **Clip cells to the state** | **Not ported — the browser does it at paint time** |
| Match cells to districts | JS (`hungarian`) |

That clipping row is the reason this needs no polygon-clipping library at all.
The R build asks mapshaper to intersect each convex cell with the state outline.
A browser can instead draw all of a state's cells inside an SVG `<clipPath>` that
*is* the state outline, and let the renderer do it:

```html
<g transform="translate(tx,ty) scale(k)">
  <path d="STATE"/>
  <g clip-path="url(#clip-NJ)"> ...raw convex cells... </g>
</g>
```

Because the clip path sits inside the state's own transformed group, its
coordinates are the state's unscaled ones — the same path data as the outline,
reused.

The trade-off is worth stating plainly: the cells the browser holds are the raw
convex polygons, running past the border. They only *look* clipped. Exact areas
and exported geometry still come from the R build.

## Two things that make it feel live

**Cells do not depend on placement.** Carving happens in each state's own
unscaled frame; placement only translates and scales the finished group. So
changing the padding or the state size never invalidates the cells. The worker
caches them on `(seats, cell mode, sample size, seed)` alone, which is why the
padding slider re-solves in tens of milliseconds while a change of seat counts
takes about a second.

**A spatial grid for the relaxation.** Disc spacing is half the padding, so
halving the padding doubles the discs and quadruples a naive pair scan. Each
state's discs are indexed into a uniform grid, in the state's own frame so it
survives the state moving; the cell size is the padding, which means the nearest
disc within range is always in one of the nine cells around the query point.
Measured pair by pair against a brute-force scan: identical answers, and the
50-state relaxation drops from ~690 ms to ~17 ms.

The same idea fixed sampling. Rejection sampling makes hundreds of thousands of
point-in-polygon calls against outlines totalling 42,000 vertices; bucketing the
edges by *y* so a query only tests its own row took that stage from 376 ms to
25 ms, with zero disagreements over 150,000 test points.

## It will not reproduce the R build exactly

It cannot, and this is worth understanding rather than treating as a bug.

The relaxation is a Gauss–Seidel iteration: each pair's correction is applied
immediately, so later pairs in the same sweep see it. That makes it converge
fast and makes it **chaotic**. The grid computes the same contacts as a brute
force scan, but sums them in a different floating-point order. After one sweep
the two differ by about 10⁻¹³ pixels. After ten, 10⁻⁶. After a hundred, a few
pixels.

Bisecting it iteration by iteration:

```
after  1 iter: max diff 5.70e-13 px
after  2 iter: max diff 5.49e-12 px
after  3 iter: max diff 8.01e-11 px
after  5 iter: max diff 8.14e-10 px
after 10 iter: max diff 4.19e-06 px
```

Sampling adds a second, larger source: R's RNG cannot be reproduced in
JavaScript, so the point clouds differ and so do the cells.

What survives all of that is the **invariant**, which is the thing actually worth
guaranteeing: no two states end up closer than the padding, and the assignment is
optimal. Both are checked, not assumed — see below.

## How the port is checked

`sh/12_test_solver.js` runs against the R build's own output on every build. It
does not compare geometry, because it cannot; it compares properties.

```
geometry primitives, against the R build's own numbers
  ok    state areas match R within 0.081% (1dp coordinates)
  ok    state bounding boxes match R within 0.000 px
  ok    432/435 district centroids land inside their state

Hungarian assignment
  ok    matches brute force on 40 random cases -- the same check R runs
  ok    New Jersey: JS cost 1807 <= R's 1807 px2 (same optimum)
  ok    recovers R's exact pairing when given R's own cells

carving cells
  ok    NJ (12 seats): largest cell / smallest = 1.03
  ok    FL (28 seats): largest cell / smallest = 1.09
  ...
  ok    Florida unbalanced 2.87 vs balanced 1.14 -- balancing earns its keep

disc relaxation
  ok    accepts R's finished layout unchanged -- both solvers agree it is legal
  ok    perturbed layout starts 1.9 px short of 2 px padding
  ok    relaxation closes it to 0.029 px in 26 iterations
  ok    worst state ends 16.2 px from where R put it -- the spring holds
  ok    New England moves as one body
```

Two of those are worth calling out. *Recovers R's exact pairing when given R's
own cells* means the ported Hungarian, handed the R build's cells and districts,
returns the identity assignment at the identical cost — the strongest statement
available without matching floating point. And *accepts R's finished layout
unchanged* means the JS relaxation, started from the layout R shipped, finds
nothing to move: the two implementations agree on what "legal" means.

## What the controls actually change

| Control | Re-runs | Notes |
|---|---|---|
| Geography | everything | The built-in U.S. states, or any GeoJSON polygon file you load |
| Seats per region | everything | 2022 districts, the 2000/2010/2020 apportionments, the 2030 projection, or your own numbers |
| State size | placement only | The area divisor. The build uses 2.90 |
| Padding | placement only | Zero skips relaxation entirely and leaves states in their raw slots |
| Hand nudges | placement only | The [New England, WV and LA corrections]({{ '/maps/cartogram-method/placement/' | relative_url }}#the-hand-corrections) |
| New England as one body | placement only | Off lets the six states shear apart |
| Cells | carving | Balanced, plain k-means, or none |
| Sample points per seat | carving | The build uses 600; the page defaults to 200 for speed |
| Seed | carving | The sampling is the only randomness |

Two settings are worth trying deliberately.

**Cells → plain k-means.** This is the comparison that motivates the whole
balancing step. On the 2000 seat counts it leaves Florida's largest cell **10.6×**
its smallest; balanced, the worst state in the country is 1.31×.

**State size → 1.8 with padding 7.** The relaxation cannot converge, and the page
says why rather than quietly returning a broken layout: states are pinned against
the cap on how far they may drift from their hand-drawn slots, so there is
nowhere left to push.

That cap is one deliberate difference from R. The R build hard-codes 40 px
because it only ever runs at one state size. Here the size is a control, so the
cap scales with it — every state's linear scale goes as `1/√divisor`, so the cap
does too. Otherwise turning the states up would make the map infeasible for a
reason about the cap rather than about the geometry.

## Your own seats

Choosing **Custom** turns the seat counts into an editable table, one number per
region. Nothing downstream assumes 435, or any particular total: a region's scale
is

```
scale = sqrt( totalArea * (seats / allSeats) / area / areaDivisor )
```

so what matters is each region's *share* of the total, whatever that total is.
Nine regions sharing 78 seats behaves exactly as fifty sharing 435. The cell
cache keys on the table, so editing one number re-carves only because the seat
counts changed, not because anything else did.

## Your own geography

The **Geography** control loads any GeoJSON polygon `FeatureCollection` (or a
bare `Polygon`/`MultiPolygon`, or a `GeometryCollection`).

**Projection.** Coordinates that all fall inside ±180 by ±90 are taken as
longitude/latitude and projected with an Albers equal-area conic fitted to the
data — centre at the middle of the bounding box, standard parallels at 1/6 and
5/6 of the latitude span. Anything else is assumed to be already projected and is
only fitted to the frame with a single uniform scale, which preserves relative
areas.

Equal-area is a requirement rather than a preference. The whole construction
scales each region so drawn area is proportional to seat count, which only says
anything if the source areas were proportional to ground area. Hand a Mercator
file to a cartogram and it will dutifully compute nonsense, because Greenland
arrives fourteen times too large. The test suite checks this property directly
rather than trusting the formula: 64 graticule cells of equal spherical area
project to planar areas within 0.0000% of each other.

This is *not* mapshaper's `albersusa`, which the built-in map uses. That one cuts
Alaska and Hawaii out and insets them — an editorial decision about the United
States, not a projection. A loaded file is drawn where it actually is.

**Properties.** Seat counts are read from `seats`, `SEATS`, `districts`,
`DISTRICTS`, `n_seats` or `nseats`; names from `st`, `STUSPS`, `STATE_ABBR`,
`abbr`, `code`, `GEOID`, `id`, `name`, `NAME` or `NAMELSAD`, with duplicates
suffixed. No seat property means every region starts at 1, to be edited by hand.

**What switches off.** Three controls describe the built-in map specifically and
are disabled for a file: colouring by the 2022 winner, the hand-drawn slots and
their nudges, and the "vs. the R build" comparison. A loaded region has no slot,
so it is seeded at its own centroid and grown or shrunk in place — which is what
the hand-drawn slots are an artist's refinement *of*, so the fallback degrades
gracefully rather than differently.

**What it will not take.** TopoJSON — convert first, with
`mapshaper in.topojson -o format=geojson`. Files over 40 MB — simplify first,
with `mapshaper in.geojson -simplify 5% -o out.geojson`. Anything with no polygon
features. Each of those reports what is wrong and leaves the built-in map in
place rather than half-loading.

## Cost

Measured in-browser on the full 50 states, 435 seats:

| Stage | Time |
|---|---|
| Placement (relaxation) | ~75 ms |
| Carving, 200 points/seat | ~1.1 s |
| Matching (435 districts) | ~20 ms |

The solving runs in a Web Worker, so none of it blocks the page. That is also why
there is no single-file standalone build the way the other viewers have one: a
worker cannot be loaded from a `file://` document, so a double-clickable HTML
file would silently do nothing. Serve `out/` over HTTP instead —
`npx serve out`, then open `/studio.html`.

## Where the code lives

| File | Role |
|---|---|
| `web/solver.js` | The whole port: geometry, sampling, k-means, balancing, cells, relaxation, Hungarian |
| `sh/12_test_solver.js` | Checks it against the R build; runs on every build |
| `sh/13_build_studio_payload.js` | Outlines, seat counts and Figma slots, extracted from the build |
| `sh/14_build_studio.js` | Assembles the page |
| `viewer/studio.worker.js` | Drives the solvers off the main thread, caches cells |
| `viewer/studio.js` | Controls and SVG rendering |

Back to the [documentation index]({{ '/maps/cartogram-method/' | relative_url }}), or the stages themselves:
[placement]({{ '/maps/cartogram-method/placement/' | relative_url }}), [carving cells]({{ '/maps/cartogram-method/cells/' | relative_url }}),
[matching]({{ '/maps/cartogram-method/matching/' | relative_url }}).

</div>
