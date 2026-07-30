---
layout: subpage
title: "How the cartogram is built"
description: "The method behind the House cartograms: placing states, carving them into equal-area district cells, and matching those cells to real districts."
permalink: /maps/cartogram-method/
---

<link rel="stylesheet" href="{{ '/maps/cartogram-method/doc.css' | relative_url }}?v=f1e3b02b">

<div class="cgdoc" markdown="1">

<nav class="docnav"><a href="{{ '/maps/cartogram-method/' | relative_url }}" aria-current="page">Overview</a>
  <a href="{{ '/maps/cartogram-method/placement/' | relative_url }}">Placing the states</a>
  <a href="{{ '/maps/cartogram-method/cells/' | relative_url }}">Carving equal-area cells</a>
  <a href="{{ '/maps/cartogram-method/matching/' | relative_url }}">Matching cells to districts</a>
  <a href="https://github.com/jcervas/cartograms">Source on GitHub</a></nav>

How the pipeline works, in the order it runs. Every figure is generated from the
build artefacts by `R/40_doc_figures.R` and `R/41_method_figures.R`, so the
documentation cannot drift from the code: if the pipeline changes, re-running
them changes the pictures.

| | |
|---|---|
| **[Placement]({{ '/maps/cartogram-method/placement/' | relative_url }})** | Sizing each state to its seat count, fitting it to the hand-drawn layout, and pushing the country apart until nothing overlaps. Also available as an [interactive walkthrough](https://jonathancervas.com/maps/cartogram-placement/). |
| **[Carving cells]({{ '/maps/cartogram-method/cells/' | relative_url }})** | Subdividing each state into equal-area cells, one per seat: sample, cluster, power diagram, clip. |
| **[Matching]({{ '/maps/cartogram-method/matching/' | relative_url }})** | Pairing each real district with one cell, so the morph between them reads. |

The stages either side of these are thin enough to live in the
[README](https://github.com/jcervas/cartograms#readme): getting and projecting the boundaries at the front, and
writing the JSON at the back.

```
census boundaries -> project + simplify -> scale to seats -> place in slots
   -> push apart -> carve into cells -> match cells to districts -> JSON
```

</div>
