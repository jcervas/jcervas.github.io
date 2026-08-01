/* studio.worker.js -- runs the solvers off the main thread.
 *
 * A full re-solve is 0.5-2 s depending on the sample size, which would freeze a
 * slider drag. The worker keeps the payload and a cell cache, so the two halves
 * of the problem can be re-run independently:
 *
 *   carving  depends on seat counts, sample size, seed, balancing
 *   placing  depends on the area divisor, padding, nudges, grouping
 *
 * Cells are computed in each state's own unscaled frame, so changing the scale
 * or the padding never invalidates them. That is what makes the padding slider
 * feel immediate.
 */

importScripts("solver.f512dbfc.js");
const S = self.CartogramSolver;

let payload = null;
let cellCache = { key: null, value: null };

const toGeom = (g) =>
  g.type === "Polygon" ? [g.coordinates] : g.coordinates;

/* `custom` is a map of region id -> seat count, edited in the panel. It wins
 * whenever the seat source is "custom", which is also the only source available
 * for an uploaded geography -- a file has no apportionment history. */
function seatsFor(state, key, custom) {
  if (key === "custom") {
    const v = custom && custom[state.st];
    return Number.isFinite(v) && v >= 1 ? Math.round(v) : 1;
  }
  if (key === "districts") return state.districts.length;
  const v = state.seats && state.seats[key];
  return Number.isFinite(v) && v >= 1 ? v : 1;
}

/* ------------------------------------------------------------- carving ---- */

function carveAll(p, post) {
  const key = JSON.stringify([p.seatKey, p.cellMode, p.pointsPerSeat, p.seed, p.balanceIters,
    p.seatKey === "custom" ? p.customSeats : null, payload.geographyId || null]);
  if (cellCache.key === key) return cellCache.value;

  const t0 = performance.now();
  const out = [];
  let worstRatio = 0, worstSt = "";

  payload.states.forEach((s, i) => {
    const k = seatsFor(s, p.seatKey, p.customSeats);
    const geom = toGeom(s.outline);
    const r = S.carve(geom, k, {
      seed: p.seed + i,
      points: Math.max(600, p.pointsPerSeat * k),
      balance: p.cellMode === "balanced",
      balanceIters: p.balanceIters,
    });

    // the ratio the balancer is actually optimising, measured the same way
    let ratio = 1;
    if (k > 1) {
      const lab = new Int32Array(r.pts.length / 2);
      S.powerAssign(r.pts, r.cx, r.cy, r.w, lab);
      const cnt = new Array(k).fill(0);
      for (const l of lab) cnt[l]++;
      ratio = Math.max(...cnt) / Math.max(1, Math.min(...cnt));
    }
    if (ratio > worstRatio) { worstRatio = ratio; worstSt = s.st; }

    out.push({ st: s.st, k, cells: r.cells, sites: { cx: Array.from(r.cx), cy: Array.from(r.cy) } });
    if (i % 6 === 0) post(Math.round((i / payload.states.length) * 100), "carving " + s.st);
  });

  cellCache = {
    key,
    value: { states: out, ms: Math.round(performance.now() - t0), worstRatio, worstSt },
  };
  return cellCache.value;
}

/* ------------------------------------------------------------- placing ---- */

function place(p) {
  const t0 = performance.now();
  const total = payload.totalArea;
  const allSeats = payload.states.reduce((a, s) => a + seatsFor(s, p.seatKey, p.customSeats), 0);
  const dw = payload.design.w, dh = payload.design.h;
  const W = payload.design.width, H = payload.design.height;
  // the tweaks are authored in design units on a 0.65 aspect; same conversion R uses
  const yScale = dh / (dw * 0.65);
  const uploaded = !!payload.uploaded;

  // centre of the source arrangement, for expanding an uploaded map about
  let mx = 0, my = 0;
  if (uploaded) {
    for (const s of payload.states) { mx += s.centroid[0]; my += s.centroid[1]; }
    mx /= payload.states.length; my /= payload.states.length;
  }

  /* Two ways to seed a region's position.
   *
   * The built-in map has a hand-drawn slot per state -- Karim's Figma layout --
   * and the slot is the top-left corner the scaled bounding box moves to.
   *
   * An uploaded file has none, so a region is pinned at its own centroid and the
   * arrangement AS A WHOLE is expanded by `expand` to make room. Pinning at
   * centroids alone does not work on a real map: seats per unit area vary by an
   * order of magnitude -- across the U.S. states, region scales run 0.16x to
   * 1.87x -- so the dense corners overlap far too deeply for the relaxation to
   * untangle, and it plateaus with pairs still touching however long it runs.
   * Expanding the arrangement first gives it a solvable start. */
  function makeBodies(expand) {
    return payload.states.map((s) => {
      const k = seatsFor(s, p.seatKey, p.customSeats);
      const scale = Math.sqrt((total * (k / allSeats)) / s.area / p.areaDivisor);
      const geom = toGeom(s.outline).map((part) =>
        part.map((ring) => ring.map((c) => [c[0] * scale, c[1] * scale])));

      let x, y;
      if (s.slot) {
        let sx = (s.slot[0] / dw) * W, sy = (s.slot[1] / dh) * H;
        if (p.tweaks && s.tweak) {
          sx += (s.tweak[0] / dw) * W;
          sy += (s.tweak[1] / dh) * H * yScale;
        }
        x = sx - s.bbox[0] * scale;
        y = sy - s.bbox[1] * scale;
      } else {
        const cx = mx + (s.centroid[0] - mx) * expand;
        const cy = my + (s.centroid[1] - my) * expand;
        x = cx - s.centroid[0] * scale;
        y = cy - s.centroid[1] * scale;
      }

      return {
        st: s.st, geom, scale, x, y,
        group: p.groupNE && payload.newEngland && payload.newEngland.includes(s.st) ? 1 : null,
      };
    });
  }

  /* The displacement cap keeps a state recognisably near the slot it was drawn
   * in. R hard-codes 40 px because it only ever runs at one state size; here the
   * size is a control, so the cap has to travel with it -- every state's linear
   * scale goes as 1/sqrt(areaDivisor), so the cap does too. Otherwise turning the
   * states up makes the map infeasible for a reason about the cap rather than
   * about the geometry.
   *
   * An uploaded map has no authored positions to stay faithful to, so neither the
   * cap nor the spring back to the seed has anything to protect. Both come off. */
  const baseShift = 40 * Math.sqrt(payload.defaults.areaDivisor / p.areaDivisor);
  const relaxOpts = uploaded
    ? { maxIter: 600, maxShift: 1e6, spring: 0 }
    : { maxIter: p.maxIter || 300, maxShift: baseShift };

  const runRelax = (bodies, padding) =>
    padding > 0
      ? S.relaxDiscs(bodies, padding, relaxOpts)
      : { pos: bodies.map((b) => [b.x, b.y]), iterations: 0, unmet: 0, converged: true,
          discCount: 0, spacing: 0, coarsened: false };

  let bodies, res, expand = 1, tries = 0;

  if (!uploaded) {
    bodies = makeBodies(1);
    res = runRelax(bodies, p.padding);
  } else {
    /* Escalate the expansion until it solves. The first guess is the largest
     * region growth, since that is what has to be made room for; each retry is a
     * few milliseconds because a roomier start converges faster, not slower. */
    const probe = makeBodies(1);
    expand = Math.max(1, ...probe.map((b) => b.scale));
    for (tries = 1; tries <= 5; tries++) {
      bodies = makeBodies(expand);
      res = runRelax(bodies, p.padding);
      if (res.converged) break;
      expand *= 1.3;
    }
  }

  const seeded = bodies.map((b) => ({ st: b.st, x: b.x, y: b.y }));
  let out = bodies.map((b, i) => ({
    st: b.st, scale: b.scale, tx: res.pos[i][0], ty: res.pos[i][1],
    seedTx: seeded[i].x, seedTy: seeded[i].y,
  }));

  /* An expanded layout is larger than the frame by construction, so fit it back.
   * A body is drawn as p*scale + t, so a global u -> g*u + d composes exactly:
   * scale becomes scale*g and t becomes g*t + d. Nothing is re-solved, and
   * relative areas -- the only thing the cartogram claims -- are untouched. */
  let fit = 1;
  if (uploaded) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    bodies.forEach((b, i) => {
      const bb = S.bbox(b.geom);
      x0 = Math.min(x0, bb[0] + res.pos[i][0]); y0 = Math.min(y0, bb[1] + res.pos[i][1]);
      x1 = Math.max(x1, bb[2] + res.pos[i][0]); y1 = Math.max(y1, bb[3] + res.pos[i][1]);
    });
    const pad = 10;
    fit = Math.min((W - 2 * pad) / (x1 - x0 || 1), (H - 2 * pad) / (y1 - y0 || 1));
    const dx = (W - (x1 - x0) * fit) / 2 - x0 * fit;
    const dy = (H - (y1 - y0) * fit) / 2 - y0 * fit;
    out = out.map((b) => ({
      st: b.st, scale: b.scale * fit,
      tx: b.tx * fit + dx, ty: b.ty * fit + dy,
      seedTx: b.seedTx * fit + dx, seedTy: b.seedTy * fit + dy,
    }));
  }

  return {
    bodies: out,
    stats: {
      ms: Math.round(performance.now() - t0),
      iterations: res.iterations, unmet: res.unmet, converged: res.converged,
      discCount: res.discCount, spacing: res.spacing, coarsened: res.coarsened,
      maxShift: relaxOpts.maxShift,
      expand: uploaded ? expand : null,
      tries: uploaded ? tries : null,
      // the gap actually drawn: padding is enforced before the fit-to-frame
      effectivePadding: p.padding * fit,
      moved: res.pos.reduce((a, q, i) =>
        Math.max(a, Math.hypot(q[0] - seeded[i].x, q[1] - seeded[i].y)), 0),
      // how many states are pinned against the cap -- the usual reason a layout
      // cannot be reached is that they have run out of room to travel
      atCap: res.pos.reduce((a, q, i) =>
        a + (Math.hypot(q[0] - seeded[i].x, q[1] - seeded[i].y) > relaxOpts.maxShift * 0.98 ? 1 : 0), 0),
    },
  };
}

/* ---------------------------------------------------------- assignment ---- */

/* Match this run's cells to the 2022 districts by minimum total squared
 * distance, so the map can be coloured by who actually won. Only meaningful
 * when the cell count is the district count. */
function assign(carved) {
  const t0 = performance.now();
  let cost = 0;
  const out = {};
  for (const s of payload.states) {
    const c = carved.states.find((q) => q.st === s.st);
    const n = s.districts.length, m = c.k;
    if (n !== m) { out[s.st] = null; continue; }
    const M = new Float64Array(n * m);
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const dx = s.districts[i].c[0] - c.sites.cx[j];
      const dy = s.districts[i].c[1] - c.sites.cy[j];
      M[i * m + j] = dx * dx + dy * dy;
    }
    const a = S.hungarian(M, n, m);
    const byCell = new Array(m).fill(null);
    for (let i = 0; i < n; i++) { byCell[a[i]] = s.districts[i]; cost += M[i * m + a[i]]; }
    out[s.st] = byCell;
  }
  return { byState: out, cost, ms: Math.round(performance.now() - t0) };
}

/* --------------------------------------------------------------- driver ---- */

self.onmessage = (e) => {
  const msg = e.data;

  if (msg.type === "init") {
    payload = msg.payload;
    self.postMessage({ type: "ready", states: payload.states.length });
    return;
  }

  if (msg.type === "solve") {
    const p = msg.params;
    const post = (pct, label) =>
      self.postMessage({ type: "progress", id: msg.id, pct, label });

    try {
      let carved = null, matched = null;
      if (p.cellMode !== "none") {
        carved = carveAll(p, post);
        post(100, "matching");
        if (p.colourBy === "party" && p.seatKey === "districts") matched = assign(carved);
      }
      post(100, "placing");
      const placed = place(p);

      self.postMessage({
        type: "done",
        id: msg.id,
        result: {
          bodies: placed.bodies,
          place: placed.stats,
          cells: carved
            ? { states: carved.states.map((c) => ({ st: c.st, k: c.k, cells: c.cells })),
                ms: carved.ms, worstRatio: carved.worstRatio, worstSt: carved.worstSt,
                cached: cellCache.key !== null && carved === cellCache.value }
            : null,
          match: matched
            ? { byState: matched.byState, cost: matched.cost, ms: matched.ms }
            : null,
        },
      });
    } catch (err) {
      self.postMessage({ type: "error", id: msg.id, message: String(err && err.message || err) });
    }
  }
};
