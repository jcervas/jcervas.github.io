/* apportionment.js -- render the change-in-apportionment cartogram.
 *
 * No morph here, so no flubber: the geometry is static and the only animation is
 * the viewBox when zooming. What moves instead is *presence*. Each state holds
 * max(seatsFrom, seatsTo) cells, and the year switch decides which of them
 * existed:
 *
 *   from-year   retained + lost      solid   (= seatsFrom)
 *   to-year     retained + gained    solid   (= seatsTo)
 *
 * Cells that did not exist in the selected year are drawn as a dashed outline
 * rather than removed, so toggling shows exactly where the change is while the
 * state's shape and every other cell hold still.
 *
 * Data arrives either as window.APPORTIONMENT_DATA (standalone build) or by
 * fetch from the container's data-src.
 */
(function () {
  "use strict";

  var root = document.getElementById("ap");
  var $ = function (id) { return document.getElementById(id); };

  function boot(DATA) {
    var W = DATA.meta.width;
    var H = DATA.meta.height;
    var ASPECT = W / H;

    var ZOOM_MS = 620;
    var SW_CELL = W * 0.0006;
    var SW_STATE_OUTER = W * 0.0026;
    var SW_STATE_INNER = W * 0.0013;
    var FS_CELL = W * 0.0105;
    var FS_STATE = W * 0.0108;
    var ZOOM_PAD = 0.05;
    var MIN_VB = 55;

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -------------------------------------------------------------- geometry --

    function ringToPath(r) {
      var s = "M" + r[0][0] + "," + r[0][1];
      for (var i = 1; i < r.length - 1; i++) s += "L" + r[i][0] + "," + r[i][1];
      return s + "Z";
    }
    function pathOf(g) {
      var polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      return polys.map(function (p) { return ringToPath(p[0]); }).join(" ");
    }

    // ----------------------------------------------------------------- build --

    var svg = $("ap-map");
    var NS = "http://www.w3.org/2000/svg";
    function el(name, attrs) {
      var n = document.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    var gStates = el("g", {});
    svg.appendChild(gStates);

    var states = [];
    var flat = [];

    DATA.states.forEach(function (s, si) {
      var g = el("g", { class: "cg-state" });
      var gc = el("g", { class: "cg-cells" });
      var rec = {
        st: s.st, data: s, node: g, cells: gc, index: si,
        scale: s.cartogram.scale, tx: s.cartogram.tx, ty: s.cartogram.ty,
        bbox: s.bbox, paths: [], status: [], labels: []
      };

      s.cellList.forEach(function (c) {
        var p = el("path", {
          class: "cg-cell", d: pathOf(c.cell), fill: c.color, "data-i": flat.length
        });
        gc.appendChild(p);
        rec.paths.push(p);
        rec.status.push(c.status);
        flat.push({ c: c, state: s, si: si });
      });
      g.appendChild(gc);

      var outline = pathOf(s.outline);
      rec.outer = el("path", { class: "cg-outer", d: outline });
      rec.inner = el("path", { class: "cg-inner", d: outline });
      g.appendChild(rec.outer);
      g.appendChild(rec.inner);

      // +1 / -1, only on the cells that moved
      s.cellList.forEach(function (c) {
        if (!c.label) return;
        var t = el("text", { class: "cg-clabel", x: c.centroid[0], y: c.centroid[1] });
        t.textContent = c.label;
        g.appendChild(t);
        rec.labels.push(t);
      });

      gStates.appendChild(g);
      states.push(rec);
    });

    var gLabels = el("g", { class: "cg-slabels" });
    DATA.states.forEach(function (s) {
      var t = el("text", { x: s.layout.labelX, y: s.layout.labelY });
      t.textContent = s.st;
      gLabels.appendChild(t);
    });
    svg.appendChild(gLabels);

    // ---------------------------------------------------------------- render --

    var year = DATA.meta.to;     // which apportionment is shown
    var focus = -1;
    var vb = [0, 0, W, H];
    var zoomK = 1;

    function setViewBox(b) {
      vb = b;
      zoomK = b[2] / W;
      svg.setAttribute("viewBox", b[0] + " " + b[1] + " " + b[2] + " " + b[3]);
      applyScales();
    }

    /* Strokes and type are in viewBox units, so they would balloon as the
     * viewBox tightens and shrink as a state scales up. Divide both out. */
    function applyScales() {
      for (var i = 0; i < states.length; i++) {
        var s = states[i], f = zoomK / s.scale;
        s.cells.setAttribute("stroke-width", SW_CELL * f);
        s.outer.setAttribute("stroke-width", SW_STATE_OUTER * f);
        s.inner.setAttribute("stroke-width", SW_STATE_INNER * f);
        for (var j = 0; j < s.labels.length; j++) {
          s.labels[j].setAttribute("font-size", FS_CELL * f);
          s.labels[j].setAttribute("stroke-width", FS_CELL * f * 0.1);
        }
      }
      gLabels.setAttribute("font-size", FS_STATE * zoomK);
    }

    /* Does a cell exist in the shown year? A lost cell existed in the from-year
     * and not the to-year; a gained cell the other way round. Either view shows
     * every change -- one side solid, the other dashed -- so there is nothing a
     * "show both" mode would add. */
    function present(status) {
      if (status === "retained") return true;
      if (status === "lost") return year === DATA.meta.from;
      return year === DATA.meta.to;                       // gained
    }

    function draw() {
      for (var i = 0; i < states.length; i++) {
        var s = states[i];
        s.node.setAttribute(
          "transform", "translate(" + s.tx + "," + s.ty + ") scale(" + s.scale + ")");
        for (var j = 0; j < s.paths.length; j++) {
          var absent = !present(s.status[j]);
          s.paths[j].classList.toggle("cg-absent", absent);
          /* Inline, so it beats the stylesheet rule that paints every cell's
           * stroke in the page background. Without this an absent cell is drawn
           * white on white in light mode. */
          s.paths[j].style.stroke = absent ? s.paths[j].getAttribute("fill") : "";
        }
      }
      applyScales();
      updateYearButtons();
    }

    // ---------------------------------------------------------------- zooming --

    function stateBox(i) {
      var s = states[i], b = s.bbox, k = s.scale;
      return [b[0] * k + s.tx, b[1] * k + s.ty, b[2] * k + s.tx, b[3] * k + s.ty];
    }

    /* Pad, then expand to the frame's aspect ratio: the SVG is width:100% /
     * height:auto, so a differently shaped viewBox would resize the element and
     * shove the rest of the page around. */
    function fitBox(b) {
      var w = b[2] - b[0], h = b[3] - b[1];
      var pad = Math.max(w, h) * ZOOM_PAD;
      var x0 = b[0] - pad, y0 = b[1] - pad;
      w += 2 * pad; h += 2 * pad;
      if (w < MIN_VB) { x0 -= (MIN_VB - w) / 2; w = MIN_VB; }
      if (h < MIN_VB / ASPECT) { y0 -= (MIN_VB / ASPECT - h) / 2; h = MIN_VB / ASPECT; }
      if (w / h < ASPECT) { var nw = h * ASPECT; x0 -= (nw - w) / 2; w = nw; }
      else { var nh = w / ASPECT; y0 -= (nh - h) / 2; h = nh; }
      return [x0, y0, w, h];
    }

    var targetBox = function () {
      return focus < 0 ? [0, 0, W, H] : fitBox(stateBox(focus));
    };

    var zoomAnim = null;
    var ease = function (u) {
      return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    };

    function animateZoom(target) {
      if (zoomAnim) cancelAnimationFrame(zoomAnim);
      if (reduceMotion) { setViewBox(target); return; }
      var from = vb.slice(), t0 = performance.now();
      (function step(now) {
        var u = Math.min(1, (now - t0) / ZOOM_MS), e = ease(u);
        if (u >= 1) { zoomAnim = null; setViewBox(target); return; }
        setViewBox([
          from[0] + (target[0] - from[0]) * e,
          from[1] + (target[1] - from[1]) * e,
          from[2] + (target[2] - from[2]) * e,
          from[3] + (target[3] - from[3]) * e
        ]);
        zoomAnim = requestAnimationFrame(step);
      })(t0);
    }

    var reset = $("ap-reset");

    function setFocus(i) {
      if (i === focus) return;
      focus = i;
      for (var n = 0; n < states.length; n++)
        states[n].node.classList.toggle("cg-dim", focus >= 0 && n !== focus);
      reset.hidden = focus < 0;
      var chips = $("ap-chips").children;
      for (var c = 0; c < chips.length; c++)
        chips[c].classList.toggle("is-active",
          focus >= 0 && chips[c].getAttribute("data-si") === String(focus));
      gLabels.style.opacity = focus < 0 ? 1 : 0;
      animateZoom(targetBox());
      writeHash();
    }

    svg.addEventListener("click", function (e) {
      var i = e.target.getAttribute && e.target.getAttribute("data-i");
      if (i == null) { setFocus(-1); return; }
      var si = flat[+i].si;
      setFocus(si === focus ? -1 : si);
    });
    reset.addEventListener("click", function () { setFocus(-1); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && focus >= 0) setFocus(-1);
    });

    // ------------------------------------------------------------- deep links --

    var hashLock = false;

    function writeHash() {
      var parts = [];
      if (year !== DATA.meta.to) parts.push(String(year));
      if (focus >= 0) parts.push(states[focus].st);
      var h = parts.length ? "#" + parts.join("-") : "";
      if (h === location.hash || (!h && !location.hash)) return;
      hashLock = true;
      try {
        history.replaceState(null, "", location.pathname + location.search + h);
      } catch (err) { location.hash = h; }
      hashLock = false;
    }

    function applyHash() {
      var h = (location.hash || "").replace(/^#/, "").trim();
      var toks = h ? h.split("-") : [];
      var y = DATA.meta.to, st = -1;
      toks.forEach(function (t) {
        if (/^\d{4}$/.test(t)) {
          var n = +t;
          if (n === DATA.meta.from || n === DATA.meta.to) y = n;
        } else {
          var code = t.toUpperCase();
          for (var i = 0; i < states.length; i++) if (states[i].st === code) st = i;
        }
      });
      year = y;
      draw();
      focus = -2;              // force setFocus to run even for -1
      setFocus(st);
    }

    window.addEventListener("hashchange", function () { if (!hashLock) applyHash(); });

    // -------------------------------------------------------------- controls --

    var seg = $("ap-years");
    [DATA.meta.from, DATA.meta.to].forEach(function (y) {
      var b = document.createElement("button");
      b.type = "button";
      // never let a projected year read as a settled result
      b.textContent = String(y) +
        " &middot; the year switch shows which seats existed then; the others are dashed" +
      (DATA.meta.projected && y === DATA.meta.to ? " (proj.)" : "");
      b.setAttribute("data-year", y);
      b.addEventListener("click", function () {
        year = y;
        draw();
        writeHash();
      });
      seg.appendChild(b);
    });

    function updateYearButtons() {
      var bs = seg.children;
      for (var i = 0; i < bs.length; i++) {
        bs[i].setAttribute("aria-pressed",
          +bs[i].getAttribute("data-year") === year ? "true" : "false");
      }
    }

    // --------------------------------------------------------------- tooltip --

    var tip = $("ap-tip");
    var sign = function (n) { return (n > 0 ? "+" : "") + n; };

    svg.addEventListener("mousemove", function (e) {
      var i = e.target.getAttribute && e.target.getAttribute("data-i");
      if (i == null) { tip.style.display = "none"; return; }
      var r = flat[+i], s = r.state, c = r.c;
      var note = c.status === "retained"
        ? "seat held through both apportionments"
        : c.status === "gained"
          ? "one of " + Math.abs(s.change) + " seat" + (Math.abs(s.change) > 1 ? "s" : "") + " gained"
          : "one of " + Math.abs(s.change) + " seat" + (Math.abs(s.change) > 1 ? "s" : "") + " lost";
      tip.innerHTML =
        "<b>" + s.name + "</b><br>" +
        DATA.meta.from + ": " + s.seatsFrom + " seats &rarr; " +
        DATA.meta.to + ": " + s.seatsTo + " seats" +
        (s.change ? " (<b>" + sign(s.change) + "</b>)" : " (no change)") + "<br>" +
        '<span class="cg-sw" style="background:' + c.color + '"></span>' + note +
        (c.district ? "<br>current district " + c.district : "");
      tip.style.display = "block";
      var pad = 14, x = e.clientX + pad, y = e.clientY + pad;
      var b = tip.getBoundingClientRect();
      if (x + b.width > window.innerWidth) x = e.clientX - b.width - pad;
      if (y + b.height > window.innerHeight) y = e.clientY - b.height - pad;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    });
    svg.addEventListener("mouseleave", function () { tip.style.display = "none"; });

    // ------------------------------------------------------------------ boot --

    $("ap-title").textContent = DATA.meta.title;
    /* When the comparison does not end at the apportionment the boundary file was
     * drawn under, no cell carries a district id -- say so rather than leaving a
     * reader to assume the cells line up with districts of that era. */
    $("ap-sub").innerHTML = DATA.meta.subtitle +
      " &middot; state outlines from the createMaps pipeline, cells built with mapshaper and base R" +
      (DATA.meta.districtsAttached === false
        ? " &middot; cells are not matched to district lines for this pair"
        : "") +
      " &middot; the year switch shows which seats existed then; the others are dashed" +
      (DATA.meta.projected
        ? '<br><b>' + DATA.meta.to + " is a projection, not a result.</b> " +
          (DATA.meta.projection ? DATA.meta.projection.note.replace(/^The \d+ column is a projection, not a result\. /, "") : "")
        : "");

    /* The swatch carries a +1 / -1 glyph as well as a colour, matching the label
     * drawn on the cell itself, so the encoding never rests on colour alone. */
    $("ap-legend").innerHTML = [
      ["gained", "+1", "gained a seat"],
      ["lost", "\u22121", "lost a seat"],
      ["retained", "", "held"]
    ].map(function (p) {
      return '<span class="cg-key"><span class="cg-sw" style="background:' +
        DATA.palette[p[0]] + '">' + p[1] + "</span>" + p[2] + "</span>";
    }).join("");

    /* One chip per state that changed, biggest movers first, each a shortcut to
     * that state's zoom. */
    var chips = $("ap-chips");
    DATA.states
      .map(function (s, i) { return { s: s, i: i }; })
      .filter(function (o) { return o.s.change !== 0; })
      .sort(function (a, b) {
        return Math.abs(b.s.change) - Math.abs(a.s.change) ||
               b.s.change - a.s.change ||
               (a.s.st < b.s.st ? -1 : 1);
      })
      .forEach(function (o) {
        var d = document.createElement("span");
        d.className = "cg-chip";
        d.setAttribute("data-si", o.i);
        d.innerHTML = '<span class="cg-sw" style="background:' +
          DATA.palette[o.s.change > 0 ? "gained" : "lost"] + '"></span>' +
          o.s.st + " <b>" + sign(o.s.change) + "</b>";
        d.title = o.s.name + ": " + o.s.seatsFrom + " → " + o.s.seatsTo;
        d.addEventListener("click", function () {
          setFocus(o.i === focus ? -1 : o.i);
        });
        chips.appendChild(d);
      });

    $("ap-status").textContent =
      DATA.totals.cells + " cells across " + DATA.states.length + " states";

    setViewBox([0, 0, W, H]);
    applyHash();
  }

  // ------------------------------------------------------------ data loading --

  function fail(msg) {
    var d = document.createElement("div");
    d.className = "cg-err";
    d.textContent = msg;
    root.appendChild(d);
  }

  if (window.APPORTIONMENT_DATA) {
    boot(window.APPORTIONMENT_DATA);
  } else {
    var src = root.getAttribute("data-src");
    fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + " " + r.statusText);
        return r.json();
      })
      .then(boot)
      .catch(function (e) {
        fail("Could not load " + src + " (" + e.message + "). This page needs to " +
             "be served over http:// -- browsers block file:// requests. Use " +
             "the standalone out/apportionment-<from>-<to>-viewer.html instead.");
      });
  }
})();
