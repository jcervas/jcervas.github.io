/* Mid-decade redistricting map.
   Data-driven: everything on the map (fills, hatching, value tiles, key, legend totals,
   annotation arrows) comes from data.csv. Edit the CSV to update the map.

   Label declutter borrows the Daily District approach: each value tile is anchored
   at its state's guaranteed-inside point (innerX/innerY baked into states.topojson),
   then a d3 force simulation (forceX/forceY toward the anchor + forceCollide) is run
   synchronously so tiles settle before first paint; displaced tiles get connector
   arrows back to their state. */

(function () {
  'use strict';

  const W = 975, H = 610;

  const fmtExp = v => {
    const s = Number.isInteger(v) ? String(v) : v.toFixed(2);
    return (v > 0 ? '+' : v < 0 ? '−' : '') + (v < 0 ? s.slice(1) : s);
  };
  const fmtInt = v => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');

  Promise.all([
    fetch('states.topojson').then(r => { if (!r.ok) throw new Error('states ' + r.status); return r.json(); }),
    fetch('data.csv').then(r => {
      if (!r.ok) throw new Error('data ' + r.status);
      const mod = r.headers.get('last-modified');
      return r.text().then(text => ({ text, mod }));
    }),
    // Optional: the map still draws if the per-election detail is missing
    fetch('elections.csv').then(r => (r.ok ? r.text() : '')).catch(() => ''),
  ]).then(([topo, csv, electionsText]) => {
    // "Updated" line from the data file's HTTP timestamp (works on GitHub Pages)
    if (csv.mod) {
      const d = new Date(csv.mod);
      if (!isNaN(d)) {
        document.getElementById('updated-date').textContent =
          d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('updated').hidden = false;
      }
    }

    const rows = d3.csvParse(csv.text, r => ({
      abbr: r.abbr.trim(),
      name: r.name,
      party: r.party || null,                    // dem | gop
      midDecade: r.mid_decade || null,           // partisan | court | possible
      status: r.status || null,                  // enacted | blocked | proposed
      exp: r.exp === '' ? null : +r.exp,
      lo: r.lo === '' ? null : +r.lo,
      hi: r.hi === '' ? null : +r.hi,
      callais: r.callais === '1',
      dx: r.dx === '' ? 0 : +r.dx,
      dy: r.dy === '' ? 0 : +r.dy,
    }));
    const byAbbr = new Map(rows.map(r => [r.abbr, r]));

    // One row per statewide election, per state: seats under the old plan and
    // under the new one. Leading #-comments in the file are documentation.
    const elections = d3.csvParse(
      electionsText.split('\n').filter(l => !l.startsWith('#')).join('\n'),
      r => ({
        abbr: r.abbr.trim(),
        code: r.code,                            // column name in data/<ST>_map_*.csv
        label: r.label,
        year: +r.year,
        demOld: +r.dem_old, repOld: +r.rep_old,
        demNew: +r.dem_new, repNew: +r.rep_new,
        gain: +r.rep_new - +r.rep_old,          // positive = Republican gain
      })
    );
    const electionsBy = d3.group(elections, e => e.abbr);

    const statesFC = topojson.feature(topo, topo.objects.states);
    // Leave a right margin clear of the map for the annotation and legend
    const projection = d3.geoAlbersUsa().fitExtent([[6, 6], [W - 185, H - 6]], statesFC);
    const path = d3.geoPath(projection);

    const svg = d3.select('#map').append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // ----- defs: hatch patterns + arrowhead -----
    const defs = svg.append('defs');

    const blocked = defs.append('pattern')
      .attr('id', 'hatch-blocked').attr('width', 5).attr('height', 5)
      .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)');
    blocked.append('rect').attr('class', 'hatch-b').attr('width', 5).attr('height', 5);
    blocked.append('rect').attr('class', 'hatch-a').attr('width', 5).attr('height', 2.5);

    // Sparser and mirrored, so proposed reads as distinct from blocked even when
    // the two are scattered across the map rather than side by side in the key
    const proposed = defs.append('pattern')
      .attr('id', 'hatch-proposed').attr('width', 9).attr('height', 9)
      .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(135)');
    proposed.append('rect').attr('class', 'hatch-b').attr('width', 9).attr('height', 9);
    proposed.append('rect').attr('class', 'hatch-a').attr('width', 9).attr('height', 2);

    defs.append('marker')
      .attr('id', 'arrowhead').attr('viewBox', '0 0 10 10')
      .attr('refX', 8).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('class', 'arrowhead-path')
      .attr('fill', 'context-stroke');

    // ----- state fills -----
    const gStates = svg.append('g').attr('class', 'layer-states');
    gStates.selectAll('path')
      .data(statesFC.features)
      .join('path')
      .attr('d', path)
      .attr('class', f => {
        const r = byAbbr.get(f.properties.state);
        let cls = 'state';
        if (r) {
          cls += ' has-data';
          if (r.status === 'blocked') cls += ' st-blocked';
          else if (r.status === 'proposed') cls += ' st-proposed';
          else if (r.party) cls += ' st-' + r.party;
        }
        return cls;
      });

    // ----- borders: interior mesh, national outline, party outlines on top -----
    svg.append('path')
      .attr('class', 'borders')
      .attr('d', path(topojson.mesh(topo, topo.objects.states, (a, b) => a !== b)));
    svg.append('path')
      .attr('class', 'us-outline')
      .attr('d', path(topojson.mesh(topo, topo.objects.states, (a, b) => a === b)));

    svg.append('g').selectAll('path')
      .data(statesFC.features.filter(f => {
        const r = byAbbr.get(f.properties.state);
        return r && r.party;
      }))
      .join('path')
      .attr('d', path)
      .attr('class', f => {
        const r = byAbbr.get(f.properties.state);
        return 'state-outline st-' + r.party + (r.status === 'proposed' ? ' st-proposed' : '');
      });

    // ----- anchors (guaranteed-inside points from the topojson) -----
    const anchorOf = f => {
      const p = f.properties;
      const pt = (isFinite(p.innerX) && isFinite(p.innerY))
        ? projection([p.innerX, p.innerY]) : null;
      return pt && isFinite(pt[0]) ? pt : path.centroid(f);
    };
    const anchors = new Map(statesFC.features.map(f => [f.properties.state, anchorOf(f)]));

    // ----- value tiles with force-collision declutter -----
    const gConnect = svg.append('g').attr('class', 'layer-connectors');
    const gTiles = svg.append('g').attr('class', 'layer-tiles');

    // Tiles only for states with seat values; the name is added only where a new
    // map is actually in place for 2026 (proposed/blocked states stay unlabeled)
    const nodes = rows.filter(r => r.exp != null && anchors.has(r.abbr)).map(r => {
      const [ax, ay] = anchors.get(r.abbr);
      const ox = ax + r.dx, oy = ay + r.dy;
      return { r, ax, ay, ox, oy, x: ox, y: oy };
    });

    const tileEls = nodes.map(d => {
      const excluded = d.r.status === 'blocked';
      const g = gTiles.append('g')
        .attr('class', 'tile' + (excluded ? ' excluded' : ''));
      const size = Math.max(15, Math.min(30, 13 + d.r.exp * 2.8));
      if (d.r.status === 'enacted') g.append('text')
        .attr('class', 'tile-name')
        .attr('text-anchor', 'middle')
        .attr('font-size', '9.5px')
        .attr('y', -size * 0.9 - 2)
        .text(d.r.name.toUpperCase());
      const value = g.append('text')
        .attr('class', 'tile-value st-' + d.r.party)
        .attr('text-anchor', 'middle')
        .attr('font-size', size + 'px')
        .attr('y', 0)
        .text(fmtExp(d.r.exp));
      let range = null;
      if (d.r.lo != null && d.r.hi != null && !(d.r.lo === d.r.exp && d.r.hi === d.r.exp)) {
        range = g.append('text')
          .attr('class', 'tile-range')
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('y', 13)
          .text(`(${fmtInt(d.r.lo)}–${fmtInt(d.r.hi)})`);
      }
      // Manual strike lines over both texts for blocked maps (SVG text-decoration
      // support is inconsistent across browsers)
      if (excluded) {
        [value, range].filter(Boolean).forEach(t => {
          const bb = t.node().getBBox();
          const y = bb.y + bb.height / 2 + (t === value ? 2 : 1);
          g.append('line').attr('class', 'strike')
            .attr('stroke-width', t === value ? 2.2 : 1.4)
            .attr('x1', bb.x - 1).attr('x2', bb.x + bb.width + 1)
            .attr('y1', y).attr('y2', y);
        });
      }
      // Collision radius from the rendered bbox; vertically center the group.
      // Wide-but-short name labels get a sub-half-width radius so they don't
      // push neighbors further than they visually need.
      const bb = g.node().getBBox();
      d.shiftY = -(bb.y + bb.height / 2);
      d.collide = Math.max(bb.height * 0.62, bb.width * 0.38) + 3;
      return g;
    });

    function applyTilePositions() {
      nodes.forEach((d, i) => {
        tileEls[i].attr('transform', `translate(${d.x},${d.y + d.shiftY})`);
      });
    }

    // Run the simulation synchronously so tiles are settled on first paint
    // (same pattern as Daily District's district tiles)
    const sim = d3.forceSimulation(nodes)
      .alphaDecay(0.12).alphaMin(0.01)
      .force('collide', d3.forceCollide(d => d.collide))
      .force('x', d3.forceX(d => d.ox).strength(0.7))
      .force('y', d3.forceY(d => d.oy).strength(0.7))
      .stop();
    sim.tick(Math.ceil(Math.log(sim.alphaMin() / sim.alpha()) / Math.log(1 - sim.alphaDecay())));
    applyTilePositions();

    // Connector arrows for tiles that ended up away from their state's anchor
    nodes.forEach(d => {
      const distA = Math.hypot(d.x - d.ax, d.y - d.ay);
      if (distA < 26) return;
      // Start just outside the tile, curve gently toward the anchor
      const angle = Math.atan2(d.ay - d.y, d.ax - d.x);
      const sx = d.x + Math.cos(angle) * (d.collide * 0.7);
      const sy = d.y + Math.sin(angle) * (d.collide * 0.55);
      const ex = d.ax - Math.cos(angle) * 6;
      const ey = d.ay - Math.sin(angle) * 6;
      const mx = (sx + ex) / 2 - (ey - sy) * 0.25;
      const my = (sy + ey) / 2 + (ex - sx) * 0.25;
      gConnect.append('path')
        .attr('class', 'connector')
        .attr('d', `M${sx},${sy} Q${mx},${my} ${ex},${ey}`)
        .attr('marker-end', 'url(#arrowhead)');
    });

    // ----- legend (totals computed from the data) -----
    const counted = rows.filter(r => r.exp != null && r.status === 'enacted');
    const demTotal = d3.sum(counted.filter(r => r.party === 'dem'), r => r.exp);
    const gopTotal = d3.sum(counted.filter(r => r.party === 'gop'), r => r.exp);
    const net = Math.abs(gopTotal - demTotal);
    const netParty = gopTotal >= demTotal ? 'gop' : 'dem';

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${W - 242}, ${H - 128})`);
    legend.append('text').attr('class', 'legend-title')
      .attr('x', 0).attr('y', -24).text('Expected gain from enacted maps');
    const legendRows = [
      { label: 'Democrat', value: demTotal, party: 'dem' },
      { label: 'Republican', value: gopTotal, party: 'gop' },
      { label: 'Net gain', value: net, party: netParty, net: true },
    ];
    legendRows.forEach((row, i) => {
      const y = i * 34 + (row.net ? 12 : 0);
      if (row.net) {
        legend.append('line').attr('class', 'legend-rule')
          .attr('x1', 0).attr('x2', 230).attr('y1', y - 20).attr('y2', y - 20);
      }
      legend.append('text').attr('class', 'legend-label').attr('x', 0).attr('y', y).text(row.label);
      legend.append('text').attr('class', 'legend-value st-' + row.party)
        .attr('x', 230).attr('y', y).attr('text-anchor', 'end')
        .text('+' + row.value.toFixed(2));
    });

    // ----- key: what the shading means (built from the statuses in the data) -----
    const present = fn => rows.some(fn);
    const keyItems = [
      { swatch: 'st-gop', label: 'New map enacted, R gain',
        show: present(r => r.status === 'enacted' && r.party === 'gop') },
      { swatch: 'st-dem', label: 'New map enacted, D gain',
        show: present(r => r.status === 'enacted' && r.party === 'dem') },
      { swatch: 'st-blocked', label: 'Blocked or overturned', br: true,
        show: present(r => r.status === 'blocked') },
      { swatch: 'st-proposed', label: 'Proposed',
        show: present(r => r.status === 'proposed') },
      { strike: true, label: 'not counted in the totals',
        show: present(r => r.status === 'blocked' && r.exp != null) },
    ].filter(d => d.show);

    if (keyItems.length) {
      const gKey = svg.append('g').attr('class', 'key');
      const SW = 20, SH = 14, GAP = 7, ITEM_GAP = 26, ROW_H = 22;
      const maxW = W - 260;             // stop short of the totals block
      let x = 0, row = 0;
      keyItems.forEach(item => {
        const g = gKey.append('g');
        let markW = SW;
        if (item.strike) {
          // Sample of a struck-through value, drawn the same way the tiles are
          const t = g.append('text').attr('class', 'key-sample').attr('x', 0).attr('y', 0).text('+0.9');
          const bb = t.node().getBBox();
          markW = bb.width;
          g.append('line').attr('class', 'strike')
            .attr('x1', bb.x - 1).attr('x2', bb.x + bb.width + 1)
            .attr('y1', bb.y + bb.height / 2 + 1).attr('y2', bb.y + bb.height / 2 + 1);
        } else {
          g.append('rect').attr('class', 'key-swatch ' + item.swatch)
            .attr('x', 0).attr('y', -SH + 3).attr('width', SW).attr('height', SH);
        }
        const label = g.append('text').attr('class', 'key-label')
          .attr('x', markW + GAP).attr('y', 0).text(item.label);
        const itemW = markW + GAP + label.node().getComputedTextLength();
        // Break for a new line where asked, or when the row would overflow
        if (x > 0 && (item.br || x + itemW > maxW)) { row++; x = 0; }
        g.attr('transform', `translate(${x},${row * ROW_H})`);
        x += itemW + ITEM_GAP;
      });
      // Bottom-align the block, however many rows it needed
      gKey.attr('transform', `translate(6, ${H - 12 - row * ROW_H})`);
    }

    // ----- annotation: states taking steps after Callais -----
    const callaisStates = rows.filter(r => r.callais && anchors.has(r.abbr));
    if (callaisStates.length) {
      const ann = svg.append('g').attr('class', 'annotation');
      const ax = W - 218, ay = H * 0.58;
      const lines = ['Several states have taken', 'steps to change their maps', 'after Callais'];
      lines.forEach((line, i) => {
        const t = ann.append('text').attr('x', ax).attr('y', ay + i * 19);
        if (i === lines.length - 1) {
          t.text('after ');
          t.append('tspan').attr('class', 'em').text('Callais');
        } else t.text(line);
      });
      // One arrow to the nearest flagged state keeps the map uncluttered
      const target = callaisStates
        .map(r => ({ r, pt: anchors.get(r.abbr) }))
        .sort((a, b) => Math.hypot(a.pt[0] - ax, a.pt[1] - ay) - Math.hypot(b.pt[0] - ax, b.pt[1] - ay))[0];
      const [tx, ty] = target.pt;
      // Start below the text block and bow the curve away from the map (to the
      // south-east) so it doesn't cross the value tiles north of the target
      const sx = ax + 24, sy = ay + lines.length * 19 - 6;
      const mx = (sx + tx) / 2 + (ty - sy) * 0.45;
      const my = (sy + ty) / 2 - (tx - sx) * 0.45;
      ann.append('path')
        .attr('class', 'connector')
        .attr('d', `M${sx},${sy} Q${mx},${my} ${tx + 22},${ty + 14}`)
        .attr('marker-end', 'url(#arrowhead)');
    }

    // ----- tooltip -----
    const tooltip = document.getElementById('tooltip');
    const figure = document.querySelector('.map-figure');
    const statusText = r => {
      if (r.status === 'blocked') return 'New map blocked';
      if (r.status === 'proposed') return 'New map proposed';
      if (r.midDecade === 'court') return 'New map enacted after court ruling';
      return 'New map enacted';
    };
    gStates.selectAll('path.has-data')
      .on('mousemove', function (event, f) {
        const r = byAbbr.get(f.properties.state);
        if (!r) return;
        let html = `<div class="tt-name">${r.name}</div><div class="tt-status">${statusText(r)}</div>`;
        if (r.exp != null) {
          const partyName = r.party === 'dem' ? 'D' : 'R';
          html += `<div class="tt-exp st-${r.party}">${fmtExp(r.exp)} ${partyName} expected`
            + (r.lo != null ? ` (${fmtInt(r.lo)}–${fmtInt(r.hi)})` : '') + '</div>';
        }
        tooltip.innerHTML = html;
        tooltip.hidden = false;
        const rect = figure.getBoundingClientRect();
        const x = Math.min(event.clientX - rect.left + 14, rect.width - tooltip.offsetWidth - 6);
        const y = event.clientY - rect.top + 14;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      })
      .on('mouseleave', () => { tooltip.hidden = true; });

    // ----- detail table: one row per election for the selected state -----
    const detail = document.getElementById('detail');
    const featureOf = new Map(statesFC.features.map(f => [f.properties.state, f]));
    // Selection outline lives above every other layer so it is never covered
    const selectOutline = svg.append('g').attr('class', 'layer-select')
      .append('path').attr('class', 'select-outline');

    const esc = v => String(v).replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const gainLabel = g => (g > 0 ? 'R +' + g : g < 0 ? 'D +' + -g : 'even');
    const gainParty = g => (g > 0 ? 'gop' : g < 0 ? 'dem' : null);

    // Diverging bar: Republican gains grow right of the centre line, Democratic
    // gains left, scaled against the state's largest swing
    const changeCell = (g, max) => {
      const w = max ? Math.abs(g) / max * 100 : 0;
      const party = gainParty(g);
      const bar = party
        ? `<span class="bar st-${party}" style="width:${w.toFixed(1)}%"></span>` : '';
      return `<td class="c-change">
          <span class="bar-wrap">
            <span class="bar-half left">${g < 0 ? bar : ''}</span>
            <span class="bar-half right">${g > 0 ? bar : ''}</span>
          </span>
          <span class="change-label${party ? ' st-' + party : ''}">${gainLabel(g)}</span>
        </td>`;
    };

    const seatCell = (d, r) =>
      `<td class="c-seats"><span class="st-dem">${d}</span>` +
      `<span class="dash">&ndash;</span><span class="st-gop">${r}</span></td>`;

    // ----- uniform swing: what the same elections do under a shifted vote -----
    // data/<ST>_map_{old,new}.csv hold each district's Democratic share of the
    // two-party vote, one column per election (named by elections.csv's code).
    // Shifting every district by the same amount and recounting gives each plan's
    // seats at any swing; at zero swing that reproduces elections.csv exactly.
    const SWING_MAX = 20;                          // points either way
    const swingGrid = d3.range(-SWING_MAX * 10, SWING_MAX * 10 + 1).map(i => i / 10);
    const swingIndex = s => Math.round((s + SWING_MAX) * 10);
    let swing = 0;                                 // + toward Republicans, − toward Democrats
    let redrawSwing = null;

    const partyNoun = p => (p === 'dem' ? 'Democrats' : 'Republicans');
    const fmtSwing = s => (s > 0 ? 'R +' : s < 0 ? 'D +' : '') + (s ? Math.abs(s).toFixed(1) : '0');
    const swingPhrase = s => (s
      ? `a swing of ${Math.abs(s).toFixed(1)} points toward ${partyNoun(s > 0 ? 'gop' : 'dem')}`
      : 'the actual results');

    const districtCache = new Map();
    function loadDistricts(abbr) {
      if (!districtCache.has(abbr)) {
        const get = which => fetch(`data/${abbr}_map_${which}.csv`)
          .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
          .then(t => d3.csvParse(t));
        districtCache.set(abbr, Promise.all([get('old'), get('new')]).catch(() => null));
      }
      return districtCache.get(abbr);
    }

    function swingModel(r, rows, [oldCsv, newCsv]) {
      const shares = (csv, code) => csv.map(d => +d[code]);
      const elecs = rows.map(e => ({ e, old: shares(oldCsv, e.code), nu: shares(newCsv, e.code) }));
      if (!r.party || elecs.some(x => x.old.concat(x.nu).some(v => !isFinite(v)))) return null;
      const dem = (vs, s) => vs.reduce((n, v) => n + (v - s / 100 > 0.5), 0);
      const at = s => elecs.map(({ e, old, nu }) => {
        const demOld = dem(old, s), demNew = dem(nu, s);
        const repOld = old.length - demOld, repNew = nu.length - demNew;
        return { label: e.label, year: e.year, demOld, repOld, demNew, repNew, gain: repNew - repOld };
      });
      // The chart follows the drawing party: its average seat gain from the new map
      const orient = r.party === 'dem' ? -1 : 1;
      const curve = swingGrid.map(s => {
        const pts = at(s);
        return { s, gain: orient * d3.mean(pts, p => p.gain), maxAbs: d3.max(pts, p => Math.abs(p.gain)) };
      });
      // The dummymander point: the smallest swing against the drawing party at
      // which the old map would, on average, have served it better
      const against = r.party === 'dem' ? 1 : -1;
      const firstLoss = dir => curve
        .filter(c => c.s * dir > 0)
        .sort((a, b) => Math.abs(a.s) - Math.abs(b.s))
        .find(c => c.gain < 0);
      const flip = firstLoss(against);
      // A map can also fall behind in the drawing party's own wave (Utah's does)
      const flipToward = firstLoss(-against);
      return {
        at, curve, flip: flip ? flip.s : null, flipToward: flipToward ? flipToward.s : null,
        max: d3.max(curve, c => c.maxAbs) || 1,
      };
    }

    function drawSwingChart(el, r, model, onPick) {
      el.innerHTML = '';
      const width = Math.max(280, el.clientWidth || 640);
      const height = width < 520 ? 190 : 220;
      const m = { t: 22, r: 12, b: 26, l: 36 };
      const x = d3.scaleLinear([-SWING_MAX, SWING_MAX], [m.l, width - m.r]);
      const [lo, hi] = d3.extent(model.curve, c => c.gain);
      const y = d3.scaleLinear([Math.min(0, lo), Math.max(0, hi)], [height - m.b, m.t]).nice(5);
      const fmtTick = v => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');

      const svg = d3.select(el).append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', width).attr('height', height)
        .attr('role', 'img')
        .attr('aria-label', `${partyNoun(r.party)}' average seat gain from the new map `
          + `under a uniform swing of up to ${SWING_MAX} points either way`
          + (model.flip != null ? `; it falls below zero at ${swingPhrase(model.flip)}.` : '.'));

      y.ticks(5).forEach(v => {
        svg.append('line').attr('class', v === 0 ? 'swing-zero' : 'swing-grid')
          .attr('x1', m.l).attr('x2', width - m.r).attr('y1', y(v)).attr('y2', y(v));
        svg.append('text').attr('class', 'swing-tick').attr('x', m.l - 6).attr('y', y(v))
          .attr('dy', '0.32em').attr('text-anchor', 'end').text(fmtTick(v));
      });
      [-20, -10, 0, 10, 20].forEach(s => {
        svg.append('text').attr('class', 'swing-tick')
          .attr('x', x(s)).attr('y', height - m.b + 17)
          .attr('text-anchor', s === -SWING_MAX ? 'start' : s === SWING_MAX ? 'end' : 'middle')
          .text(s ? (s > 0 ? 'R +' : 'D +') + Math.abs(s) : 'Actual');
      });
      svg.append('line').attr('class', 'swing-actual')
        .attr('x1', x(0)).attr('x2', x(0)).attr('y1', m.t).attr('y2', height - m.b);

      // Dummymander zone: wherever the average gain is below zero
      svg.append('path').attr('class', 'swing-zone st-' + r.party)
        .attr('d', d3.area().x(c => x(c.s)).y0(y(0)).y1(c => y(Math.min(0, c.gain)))(model.curve));
      svg.append('path').attr('class', 'swing-line st-' + r.party)
        .attr('d', d3.line().x(c => x(c.s)).y(c => y(c.gain))(model.curve));

      if (model.flip != null) {
        const fx = x(model.flip);
        svg.append('line').attr('class', 'swing-flip')
          .attr('x1', fx).attr('x2', fx).attr('y1', m.t - 8).attr('y2', height - m.b);
        svg.append('text').attr('class', 'swing-flip-label')
          .attr('x', fx + (model.flip < 0 ? -5 : 5)).attr('y', m.t - 10)
          .attr('text-anchor', model.flip < 0 ? 'end' : 'start')
          .text(`Backfires past ${fmtSwing(model.flip)}`);
      }

      // Hover guide (where the pointer is) and marker (the swing in force)
      const guide = svg.append('g').attr('class', 'swing-guide').style('display', 'none');
      guide.append('line').attr('y1', m.t).attr('y2', height - m.b);
      const guideText = guide.append('text').attr('y', height - m.b - 6);
      const marker = svg.append('g').attr('class', 'swing-marker');
      marker.append('line').attr('y1', m.t).attr('y2', height - m.b);
      marker.append('circle').attr('r', 5);

      const gainText = g => (g > 0.005 ? '+' + g.toFixed(2) : g < -0.005 ? '−' + (-g).toFixed(2) : '0');
      const place = (sel, s) => {
        const c = model.curve[swingIndex(s)];
        sel.attr('transform', `translate(${x(s)},0)`);
        return c;
      };
      const update = s => {
        const c = place(marker, s);
        marker.select('circle').attr('cy', y(c.gain)).attr('class', 'st-' + r.party);
      };

      const pick = event => {
        const [px] = d3.pointer(event, svg.node());
        return Math.round(Math.max(-SWING_MAX, Math.min(SWING_MAX, x.invert(px))) * 10) / 10;
      };
      svg.append('rect').attr('class', 'swing-hit')
        .attr('x', m.l).attr('y', 0).attr('width', width - m.l - m.r).attr('height', height)
        .on('pointerdown', function (event) {
          this.setPointerCapture(event.pointerId);
          onPick(pick(event));
        })
        .on('pointermove', function (event) {
          const s = pick(event);
          if (this.hasPointerCapture(event.pointerId)) onPick(s);
          const c = place(guide.style('display', null), s);
          const right = x(s) > width - 110;
          guideText.attr('x', right ? -6 : 6).attr('text-anchor', right ? 'end' : 'start')
            .text(`${fmtSwing(s)}: ${gainText(c.gain)}`);
        })
        .on('pointerleave', () => guide.style('display', 'none'));

      update(swing);
      return update;
    }

    const subText = (r, pts, s) => {
      let sub = statusText(r);
      if (!pts.length) return sub;
      const gains = pts.map(e => e.gain);
      sub += ` &middot; ${gainLabel(+d3.mean(gains).toFixed(2))} on average across `
        + `${pts.length} statewide elections (${gainLabel(d3.min(gains))} to `
        + `${gainLabel(d3.max(gains))})`;
      if (s) sub += `, after ${swingPhrase(s)} in every district`;
      return sub;
    };

    function mountSwing(el, r, model, fillTable) {
      const party = partyNoun(r.party);
      el.innerHTML = `
        <h3 class="swing-title">When does the new map backfire?</h3>
        <p class="swing-flip-text">${model.flip != null
          ? `On average, the new map becomes a <strong>dummymander</strong> &mdash; ${party} `
            + `would do better under the old map &mdash; after ${swingPhrase(model.flip)}.`
          : `No swing toward ${partyNoun(r.party === 'dem' ? 'gop' : 'dem')} of up to ${SWING_MAX} `
            + `points makes the old map better for ${party}`
            + (model.flipToward != null
              ? `, but ${swingPhrase(model.flipToward)} would: the old lines then hand ${party} more seats.`
              : '.')}</p>
        <div class="swing-legend">
          <span><i class="sw-line st-${r.party}"></i>${party}&rsquo; average seat gain from the new map</span>
          <span><i class="sw-zone st-${r.party}"></i>Dummymander: the old map would do better</span>
        </div>
        <div class="swing-chart"></div>
        <div class="swing-control">
          <input type="range" class="swing-input" min="${-SWING_MAX}" max="${SWING_MAX}" step="0.1"
            aria-label="Uniform swing, in points of the two-party vote">
          <div class="swing-scale">
            <span>&larr; Toward Democrats</span>
            <button type="button" class="swing-reset">Actual results</button>
            <span>Toward Republicans &rarr;</span>
          </div>
        </div>
        <p class="swing-readout"></p>`;

      const chartEl = el.querySelector('.swing-chart');
      const input = el.querySelector('.swing-input');
      const readout = el.querySelector('.swing-readout');
      const reset = el.querySelector('.swing-reset');
      let updateChart = () => {};

      const set = s => {
        swing = s;
        input.value = s;
        input.setAttribute('aria-valuetext', s ? fmtSwing(s) + ' points' : 'Actual results');
        reset.disabled = !s;
        updateChart(s);
        fillTable(s);
        const g = model.curve[swingIndex(s)].gain;
        const at = swingPhrase(s);
        readout.innerHTML = (g > 0.005
          ? `With ${at}, the new map gains ${party} ${g.toFixed(2)} seats on average`
          : g < -0.005
            ? `With ${at}, the map is a dummymander: ${party} would win ${(-g).toFixed(2)} `
              + `more seats on average under the old one`
            : `With ${at}, the new map gains ${party} nothing over the old one`)
          + '. The table below shows each election.';
      };

      const draw = () => { updateChart = drawSwingChart(chartEl, r, model, set); };
      input.addEventListener('input', () => set(+input.value));
      reset.addEventListener('click', () => set(0));
      draw();
      redrawSwing = draw;
      set(swing);
    }

    let resizeFrame = null;
    window.addEventListener('resize', () => {
      if (!redrawSwing || resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => { resizeFrame = null; if (redrawSwing) redrawSwing(); });
    });

    function renderDetail(abbr) {
      const r = byAbbr.get(abbr);
      if (!r) return;
      const rows = (electionsBy.get(abbr) || []).slice()
        .sort((a, b) => a.year - b.year || d3.ascending(a.label, b.label));

      let html = `<div class="detail-head">
          <h2 class="detail-name">${esc(r.name)}</h2>
          <button type="button" class="detail-clear">Clear</button>
        </div>
        <p class="detail-sub">${subText(r, rows, 0)}</p>`;

      if (!rows.length) {
        html += `<p class="detail-empty">No election-by-election detail for `
          + `${esc(r.name)} yet.</p>`;
      } else {
        html += `<div class="swing" hidden></div>
          <div class="detail-scroll"><table class="detail-table">
            <thead><tr>
              <th scope="col">Election</th>
              <th scope="col">Old<span class="wide"> map</span> <span class="dr">D&ndash;R</span></th>
              <th scope="col">New<span class="wide"> map</span> <span class="dr">D&ndash;R</span></th>
              <th scope="col">Change</th>
            </tr></thead>
            <tbody></tbody>
            <tfoot></tfoot>
          </table></div>`;
      }
      detail.innerHTML = html;
      detail.querySelector('.detail-clear').addEventListener('click', () => select(null));
      if (!rows.length) return;

      const sub = detail.querySelector('.detail-sub');
      const tbody = detail.querySelector('tbody');
      const tfoot = detail.querySelector('tfoot');
      const fill = (pts, max, s) => {
        tbody.innerHTML = pts.map(e =>
          `<tr><th scope="row">${esc(e.label)} ${e.year}</th>`
          + seatCell(e.demOld, e.repOld) + seatCell(e.demNew, e.repNew)
          + changeCell(e.gain, max) + '</tr>').join('');
        const mean = +d3.mean(pts, e => e.gain).toFixed(2);
        tfoot.innerHTML = `<tr><th scope="row">Average</th><td></td><td></td>
          ${changeCell(mean, max)}</tr>`;
        sub.innerHTML = subText(r, pts, s);
      };
      fill(rows, d3.max(rows, e => Math.abs(e.gain)) || 1, 0);

      loadDistricts(abbr).then(csvs => {
        if (selected !== abbr || !csvs) return;
        const model = swingModel(r, rows, csvs);
        if (!model) return;
        const el = detail.querySelector('.swing');
        el.hidden = false;
        // Bars keep one scale across the whole swing range, so dragging
        // doesn't rescale them
        mountSwing(el, r, model, s => fill(model.at(s), model.max, s));
      });
    }

    let selected = null;
    function select(abbr) {
      selected = abbr === selected ? null : abbr;
      selectOutline.attr('d', selected ? path(featureOf.get(selected)) : null);
      gStates.selectAll('path.has-data')
        .classed('is-selected', f => f.properties.state === selected)
        .attr('aria-pressed', f => String(f.properties.state === selected));
      redrawSwing = null;
      if (selected) renderDetail(selected);
      else detail.innerHTML =
        '<p class="detail-hint">Select a shaded state for its election-by-election detail.</p>';
    }

    gStates.selectAll('path.has-data')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-pressed', 'false')
      .attr('aria-label', f => {
        const r = byAbbr.get(f.properties.state);
        return `${r.name}: ${statusText(r).toLowerCase()}`;
      })
      .on('click', (event, f) => select(f.properties.state))
      .on('keydown', (event, f) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(f.properties.state);
        }
      });
  }).catch(err => {
    console.error(err);
    document.getElementById('map').innerHTML =
      '<p style="color:var(--text-muted)">Could not load map data (' + err.message + ').</p>';
  });
})();
