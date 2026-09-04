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

    function renderDetail(abbr) {
      const r = byAbbr.get(abbr);
      if (!r) return;
      const rows = (electionsBy.get(abbr) || []).slice()
        .sort((a, b) => a.year - b.year || d3.ascending(a.label, b.label));

      let sub = statusText(r);
      if (rows.length) {
        const gains = rows.map(e => e.gain);
        const mean = d3.mean(gains);
        sub += ` &middot; ${gainLabel(+mean.toFixed(2))} on average across `
          + `${rows.length} statewide elections (${gainLabel(d3.min(gains))} to `
          + `${gainLabel(d3.max(gains))})`;
      }

      let html = `<div class="detail-head">
          <h2 class="detail-name">${esc(r.name)}</h2>
          <button type="button" class="detail-clear">Clear</button>
        </div>
        <p class="detail-sub">${sub}</p>`;

      if (!rows.length) {
        html += `<p class="detail-empty">No election-by-election detail for `
          + `${esc(r.name)} yet.</p>`;
      } else {
        const max = d3.max(rows, e => Math.abs(e.gain)) || 1;
        const body = rows.map(e =>
          `<tr><th scope="row">${esc(e.label)} ${e.year}</th>`
          + seatCell(e.demOld, e.repOld) + seatCell(e.demNew, e.repNew)
          + changeCell(e.gain, max) + '</tr>').join('');
        const mean = +d3.mean(rows, e => e.gain).toFixed(2);
        html += `<div class="detail-scroll"><table class="detail-table">
            <thead><tr>
              <th scope="col">Election</th>
              <th scope="col">Old<span class="wide"> map</span> <span class="dr">D&ndash;R</span></th>
              <th scope="col">New<span class="wide"> map</span> <span class="dr">D&ndash;R</span></th>
              <th scope="col">Change</th>
            </tr></thead>
            <tbody>${body}</tbody>
            <tfoot><tr><th scope="row">Average</th><td></td><td></td>
              ${changeCell(mean, max)}</tr></tfoot>
          </table></div>`;
      }
      detail.innerHTML = html;
      detail.querySelector('.detail-clear').addEventListener('click', () => select(null));
    }

    let selected = null;
    function select(abbr) {
      selected = abbr === selected ? null : abbr;
      selectOutline.attr('d', selected ? path(featureOf.get(selected)) : null);
      gStates.selectAll('path.has-data')
        .classed('is-selected', f => f.properties.state === selected)
        .attr('aria-pressed', f => String(f.properties.state === selected));
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
