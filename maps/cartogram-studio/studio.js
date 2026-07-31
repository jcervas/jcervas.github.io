/* studio.js -- controls, worker plumbing, and SVG rendering.
 *
 * The solving happens in studio.worker.js. This file collects parameters,
 * debounces them, and paints the result.
 *
 * The rendering trick worth knowing: cells are the raw convex polygons, and the
 * state outline is used as an SVG <clipPath> around them. So the browser does
 * the clipping mapshaper does in the R build, at paint time, and no polygon
 * library is needed. Because the clip path lives inside the state's transformed
 * group, its coordinates are the state's own unscaled ones -- the same path data
 * as the outline.
 */
(function () {
  "use strict";

  const root = document.getElementById("cs-root");
  if (!root) return;

  const $ = (id) => document.getElementById(id);
  const map = $("cs-map");
  const SVG = "http://www.w3.org/2000/svg";

  const el = {
    seats: $("cs-seats"), divisor: $("cs-divisor"), divisorOut: $("cs-divisor-out"),
    padding: $("cs-padding"), paddingOut: $("cs-padding-out"),
    tweaks: $("cs-tweaks"), groupNE: $("cs-group-ne"), ghost: $("cs-ghost"),
    cells: $("cs-cells"), colour: $("cs-colour"),
    points: $("cs-points"), pointsOut: $("cs-points-out"),
    seed: $("cs-seed"), reroll: $("cs-reroll"),
    solve: $("cs-solve"), auto: $("cs-auto"), reset: $("cs-reset"),
    progress: $("cs-progress"), fill: $("cs-progress-fill"), plabel: $("cs-progress-label"),
    statPlace: $("cs-stat-place"), statCells: $("cs-stat-cells"),
    statMatch: $("cs-stat-match"), statRef: $("cs-stat-ref"),
    warn: $("cs-warn"),
  };

  let payload = null, worker = null, seq = 0, pending = null, busy = false;

  const DEFAULTS = {
    seats: "districts", divisor: 2.9, padding: 2, tweaks: true, groupNE: true,
    cells: "balanced", colour: true, points: 200, seed: 20221108, ghost: false,
  };

  /* ------------------------------------------------------------ params ---- */

  function params() {
    return {
      seatKey: el.seats.value,
      areaDivisor: +el.divisor.value,
      padding: +el.padding.value,
      tweaks: el.tweaks.checked,
      groupNE: el.groupNE.checked,
      cellMode: el.cells.value,
      colourBy: el.colour.checked ? "party" : "none",
      pointsPerSeat: +el.points.value,
      seed: +el.seed.value | 0,
      balanceIters: payload ? payload.defaults.balanceIters : 40,
    };
  }

  function syncOutputs() {
    el.divisorOut.textContent = (+el.divisor.value).toFixed(2);
    el.paddingOut.textContent = (+el.padding.value).toFixed(1) + " px";
    el.pointsOut.textContent = el.points.value;
    // colouring by winner only means anything when the cells ARE the districts
    const canColour = el.seats.value === "districts" && el.cells.value !== "none";
    el.colour.disabled = !canColour;
    el.colour.parentElement.style.opacity = canColour ? "" : "0.5";
  }

  /* ------------------------------------------------------------ worker ---- */

  function start(data) {
    payload = data;
    worker = new Worker(root.dataset.worker);
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === "ready") { solve(); return; }
      if (m.type === "progress") {
        el.fill.style.width = m.pct + "%";
        el.plabel.textContent = m.label;
        return;
      }
      if (m.type === "error") {
        busy = false;
        showOverlay(false);
        el.solve.disabled = false;
        warn("The solver failed: " + m.message);
        return;
      }
      if (m.type === "done") {
        busy = false;
        showOverlay(false);
        el.solve.disabled = false;
        render(m.result);
        if (pending) { const p = pending; pending = null; dispatch(p); }
      }
    };
    worker.onerror = (e) => {
      busy = false;
      showOverlay(false);
      el.solve.disabled = false;
      warn("The solver could not start: " + (e.message || "worker error"));
    };
    worker.postMessage({ type: "init", payload: data });
  }

  /* Placement alone re-solves in well under a tenth of a second, so showing the
   * overlay immediately would make dragging a slider strobe. Hold it back a
   * moment: a re-place never shows it, a re-carve always does. */
  let overlayTimer = null;
  function showOverlay(on) {
    clearTimeout(overlayTimer);
    if (on) overlayTimer = setTimeout(() => { el.progress.hidden = false; }, 250);
    else el.progress.hidden = true;
  }

  function dispatch(p) {
    busy = true;
    el.solve.disabled = true;
    el.fill.style.width = "0%";
    el.plabel.textContent = "solving…";
    showOverlay(true);
    worker.postMessage({ type: "solve", id: ++seq, params: p });
  }

  function solve() {
    if (!worker) return;
    const p = params();
    if (busy) { pending = p; return; }   // coalesce: only the latest matters
    dispatch(p);
  }

  let timer = null;
  const schedule = (ms) => {
    syncOutputs();
    if (!el.auto.checked) return;
    clearTimeout(timer);
    timer = setTimeout(solve, ms);
  };

  /* ------------------------------------------------------------ render ---- */

  const path = (rings) => {
    let d = "";
    for (const ring of rings) {
      if (!ring || ring.length < 3) continue;
      d += "M" + ring.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
    }
    return d;
  };
  const geomPath = (g) =>
    path(g.type === "Polygon" ? g.coordinates : g.coordinates.flat());

  function render(res) {
    const frag = document.createDocumentFragment();
    const defs = document.createElementNS(SVG, "defs");
    const byState = {};
    for (const s of payload.states) byState[s.st] = s;
    const cellsBySt = {};
    if (res.cells) for (const c of res.cells.states) cellsBySt[c.st] = c;
    const palette = payload.palette;

    // ghost of the R build, underneath
    if (el.ghost.checked) {
      const g = document.createElementNS(SVG, "g");
      for (const s of payload.states) {
        const p = document.createElementNS(SVG, "path");
        p.setAttribute("class", "cs-ghost-path");
        p.setAttribute("d", geomPath(s.outline));
        p.setAttribute("transform",
          `translate(${s.ref.tx.toFixed(2)},${s.ref.ty.toFixed(2)}) scale(${s.ref.scale.toFixed(5)})`);
        g.appendChild(p);
      }
      frag.appendChild(g);
    }

    for (const b of res.bodies) {
      const s = byState[b.st];
      const d = geomPath(s.outline);
      const g = document.createElementNS(SVG, "g");
      g.setAttribute("transform",
        `translate(${b.tx.toFixed(2)},${b.ty.toFixed(2)}) scale(${b.scale.toFixed(5)})`);

      const carved = cellsBySt[b.st];
      if (carved) {
        g.setAttribute("class", "cs-has-cells");

        // the browser does mapshaper's job: clip the cells with the outline
        const cp = document.createElementNS(SVG, "clipPath");
        cp.setAttribute("id", "cs-clip-" + b.st);
        const cpp = document.createElementNS(SVG, "path");
        cpp.setAttribute("d", d);
        cp.appendChild(cpp);
        defs.appendChild(cp);

        const inner = document.createElementNS(SVG, "g");
        inner.setAttribute("clip-path", "url(#cs-clip-" + b.st + ")");
        const match = res.match && res.match.byState[b.st];
        carved.cells.forEach((cell, i) => {
          if (!cell || cell.length < 3) return;
          const p = document.createElementNS(SVG, "path");
          p.setAttribute("class", "cs-cell");
          p.setAttribute("d", path([cell]));
          const dist = match && match[i];
          p.setAttribute("fill", dist ? (palette[dist.p] || palette.Other) : "var(--cs-state)");
          if (dist) {
            const t = document.createElementNS(SVG, "title");
            t.textContent = dist.id + " — " + dist.p;
            p.appendChild(t);
          }
          inner.appendChild(p);
        });
        g.appendChild(inner);

        // the outline again on top, so the border reads crisply over the cells
        const hull = document.createElementNS(SVG, "path");
        hull.setAttribute("class", "cs-hull");
        hull.setAttribute("d", d);
        g.appendChild(hull);
      } else {
        const p = document.createElementNS(SVG, "path");
        p.setAttribute("class", "cs-outline-path");
        p.setAttribute("d", d);
        g.appendChild(p);
      }

      frag.appendChild(g);
    }

    // state labels, in frame coordinates
    const labels = document.createElementNS(SVG, "g");
    const dw = payload.design.w, dh = payload.design.h;
    const W = payload.design.width, H = payload.design.height;
    for (const b of res.bodies) {
      const s = byState[b.st];
      const t = document.createElementNS(SVG, "text");
      t.setAttribute("class", "cs-lab");
      // the label rides with however far the state actually moved
      t.setAttribute("x", ((s.label[0] / dw) * W + (b.tx - b.seedTx)).toFixed(1));
      t.setAttribute("y", ((s.label[1] / dh) * H + (b.ty - b.seedTy)).toFixed(1));
      t.textContent = s.st;
      labels.appendChild(t);
    }
    frag.appendChild(labels);

    map.textContent = "";
    map.appendChild(defs);
    map.appendChild(frag);

    stats(res);
  }

  function stats(res) {
    const p = res.place;
    el.statPlace.textContent = p.iterations === 0
      ? "no relaxation (padding 0)"
      : `${p.iterations} iterations, ${p.ms} ms · ` +
        `${p.discCount.toLocaleString()} discs · worst state moved ${p.moved.toFixed(1)} px`;

    if (res.cells) {
      const c = res.cells;
      const n = c.states.reduce((a, s) => a + s.k, 0);
      el.statCells.textContent =
        `${n} cells, ${c.ms} ms · worst area ratio ${c.worstRatio.toFixed(2)} (${c.worstSt})`;
    } else {
      el.statCells.textContent = "off";
    }

    el.statMatch.textContent = res.match
      ? `${res.match.ms} ms · total cost ${Math.round(res.match.cost).toLocaleString()} px²`
      : "—";

    // how far this solve sits from the layout R shipped
    let worst = 0, worstSt = "", mean = 0;
    for (const b of res.bodies) {
      const s = payload.states.find((q) => q.st === b.st);
      const d = Math.hypot(b.tx - s.ref.tx, b.ty - s.ref.ty);
      mean += d;
      if (d > worst) { worst = d; worstSt = b.st; }
    }
    mean /= res.bodies.length;
    el.statRef.textContent =
      `mean ${mean.toFixed(1)} px, worst ${worst.toFixed(1)} px (${worstSt})`;

    const msgs = [];
    if (!p.converged && p.iterations > 0) {
      msgs.push(
        `The relaxation stopped ${p.unmet.toFixed(2)} px short of the ${(+el.padding.value).toFixed(1)} px ` +
        `padding after ${p.iterations} iterations.`);
      msgs.push(p.atCap > 0
        ? `${p.atCap} state${p.atCap === 1 ? " is" : "s are"} pinned against the ` +
          `${p.maxShift.toFixed(0)} px cap on how far a state may drift from its hand-drawn slot, ` +
          `so there is nowhere left to push. Raise the state size number or lower the padding.`
        : `At this state size there may be no layout that fits. Raise the state size number or lower the padding.`);
    }
    if (p.coarsened)
      msgs.push(
        `Disc spacing was backed off to ${p.spacing.toFixed(2)} px to stay inside the ` +
        `${(40000).toLocaleString()}-disc budget, so contacts are resolved slightly more coarsely than ` +
        `padding/2 would give.`);
    warn(msgs.join(" "));
  }

  function warn(text) {
    el.warn.hidden = !text;
    el.warn.textContent = text || "";
  }

  /* ------------------------------------------------------------- wiring ---- */

  for (const c of [el.divisor, el.padding, el.points]) c.addEventListener("input", () => schedule(220));
  for (const c of [el.seats, el.cells, el.seed]) c.addEventListener("change", () => schedule(0));
  for (const c of [el.tweaks, el.groupNE, el.colour]) c.addEventListener("change", () => schedule(0));
  el.ghost.addEventListener("change", () => schedule(0));

  el.reroll.addEventListener("click", () => {
    el.seed.value = Math.floor(Math.random() * 1e8);
    schedule(0);
  });
  el.solve.addEventListener("click", solve);
  el.reset.addEventListener("click", () => {
    el.seats.value = DEFAULTS.seats;
    el.divisor.value = DEFAULTS.divisor;
    el.padding.value = DEFAULTS.padding;
    el.tweaks.checked = DEFAULTS.tweaks;
    el.groupNE.checked = DEFAULTS.groupNE;
    el.cells.value = DEFAULTS.cells;
    el.colour.checked = DEFAULTS.colour;
    el.points.value = DEFAULTS.points;
    el.seed.value = DEFAULTS.seed;
    el.ghost.checked = DEFAULTS.ghost;
    syncOutputs();
    solve();
  });

  syncOutputs();

  /* --------------------------------------------------------------- boot ---- */

  if (window.STUDIO_DATA) {
    start(window.STUDIO_DATA);
  } else {
    fetch(root.dataset.src)
      .then((r) => {
        if (!r.ok) throw new Error(r.status + " " + r.statusText);
        return r.json();
      })
      .then(start)
      .catch((e) => warn("Could not load the geometry: " + e.message));
  }
})();
