d3 = function() {
    function n(n) { return null != n && !isNaN(n) }

    function t(n) { return n.length }

    function e(n) { for (var t = 1; n * t % 1;) t *= 10; return t }

    function r(n, t) { try { for (var e in t) Object.defineProperty(n.prototype, e, { value: t[e], enumerable: !1 }) } catch (r) { n.prototype = t } }

    function u() {}

    function i() {}

    function a(n, t, e) { return function() { var r = e.apply(t, arguments); return r === t ? n : r } }

    function o() {}

    function c(n) {
        function t() { for (var t, r = e, u = -1, i = r.length; ++u < i;)(t = r[u].on) && t.apply(this, arguments); return n } var e = [],
            r = new u; return t.on = function(t, u) { var i, a = r.get(t); return arguments.length < 2 ? a && a.on : (a && (a.on = null, e = e.slice(0, i = e.indexOf(a)).concat(e.slice(i + 1)), r.remove(t)), u && e.push(r.set(t, { on: u })), n) }, t }

    function l() { ca.event.stopPropagation(), ca.event.preventDefault() }

    function f() { for (var n, t = ca.event; n = t.sourceEvent;) t = n; return t }

    function s(n, t) {
        function e() { n.on(t, null) } n.on(t, function() { l(), e() }, !0), setTimeout(e, 0) }

    function h(n) { for (var t = new o, e = 0, r = arguments.length; ++e < r;) t[arguments[e]] = c(t); return t.of = function(e, r) { return function(u) { try { var i = u.sourceEvent = ca.event;
                    u.target = n, ca.event = u, t[u.type].apply(e, r) } finally { ca.event = i } } }, t }

    function g(n, t) { var e = n.ownerSVGElement || n; if (e.createSVGPoint) { var r = e.createSVGPoint(); if (0 > va && (fa.scrollX || fa.scrollY)) { e = ca.select(la.body).append("svg").style("position", "absolute").style("top", 0).style("left", 0); var u = e[0][0].getScreenCTM();
                va = !(u.f || u.e), e.remove() } return va ? (r.x = t.pageX, r.y = t.pageY) : (r.x = t.clientX, r.y = t.clientY), r = r.matrixTransform(n.getScreenCTM().inverse()), [r.x, r.y] } var i = n.getBoundingClientRect(); return [t.clientX - i.left - n.clientLeft, t.clientY - i.top - n.clientTop] }

    function p(n) { for (var t = -1, e = n.length, r = []; ++t < e;) r.push(n[t]); return r }

    function d(n) { return Array.prototype.slice.call(n) }

    function m(n) { return xa(n, ka), n }

    function v(n) { return function() { return ba(n, this) } }

    function y(n) { return function() { return _a(n, this) } }

    function M(n, t) {
        function e() { this.removeAttribute(n) }

        function r() { this.removeAttributeNS(n.space, n.local) }

        function u() { this.setAttribute(n, t) }

        function i() { this.setAttributeNS(n.space, n.local, t) }

        function a() { var e = t.apply(this, arguments);
            null == e ? this.removeAttribute(n) : this.setAttribute(n, e) }

        function o() { var e = t.apply(this, arguments);
            null == e ? this.removeAttributeNS(n.space, n.local) : this.setAttributeNS(n.space, n.local, e) } return n = ca.ns.qualify(n), null == t ? n.local ? r : e : "function" == typeof t ? n.local ? o : a : n.local ? i : u }

    function x(n) { return n.trim().replace(/\s+/g, " ") }

    function _(n) { return RegExp("(?:^|\\s+)" + ca.requote(n) + "(?:\\s+|$)", "g") }

    function w(n, t) {
        function e() { for (var e = -1; ++e < u;) n[e](this, t) }

        function r() { for (var e = -1, r = t.apply(this, arguments); ++e < u;) n[e](this, r) } n = n.trim().split(/\s+/).map(S); var u = n.length; return "function" == typeof t ? r : e }

    function S(n) { var t = _(n); return function(e, r) { if (u = e.classList) return r ? u.add(n) : u.remove(n); var u = e.getAttribute("class") || "";
            r ? (t.lastIndex = 0, t.test(u) || e.setAttribute("class", x(u + " " + n))) : e.setAttribute("class", x(u.replace(t, " "))) } }

    function E(n, t, e) {
        function r() { this.style.removeProperty(n) }

        function u() { this.style.setProperty(n, t, e) }

        function i() { var r = t.apply(this, arguments);
            null == r ? this.style.removeProperty(n) : this.style.setProperty(n, r, e) } return null == t ? r : "function" == typeof t ? i : u }

    function k(n, t) {
        function e() { delete this[n] }

        function r() { this[n] = t }

        function u() { var e = t.apply(this, arguments);
            null == e ? delete this[n] : this[n] = e } return null == t ? e : "function" == typeof t ? u : r }

    function A(n) { return { __data__: n } }

    function q(n) { return function() { return Ea(this, n) } }

    function N(n) { return arguments.length || (n = ca.ascending),
            function(t, e) { return !t - !e || n(t.__data__, e.__data__) } }

    function T() {}

    function C(n, t, e) {
        function r() { var t = this[a];
            t && (this.removeEventListener(n, t, t.$), delete this[a]) }

        function u() { var u = c(t, ya(arguments));
            r.call(this), this.addEventListener(n, this[a] = u, u.$ = e), u._ = t }

        function i() { var t, e = RegExp("^__on([^.]+)" + ca.requote(n) + "$"); for (var r in this)
                if (t = r.match(e)) { var u = this[r];
                    this.removeEventListener(t[1], u, u.$), delete this[r] } } var a = "__on" + n,
            o = n.indexOf("."),
            c = z;
        o > 0 && (n = n.substring(0, o)); var l = Na.get(n); return l && (n = l, c = D), o ? t ? u : r : t ? T : i }

    function z(n, t) { return function(e) { var r = ca.event;
            ca.event = e, t[0] = this.__data__; try { n.apply(this, t) } finally { ca.event = r } } }

    function D(n, t) { var e = z(n, t); return function(n) { var t = this,
                r = n.relatedTarget;
            r && (r === t || r.compareDocumentPosition(t) & 8) || e.call(t, n) } }

    function j(n, t) { for (var e = 0, r = n.length; r > e; e++)
            for (var u, i = n[e], a = 0, o = i.length; o > a; a++)(u = i[a]) && t(u, a, e); return n }

    function L(n) { return xa(n, Ta), n }

    function F() {}

    function H(n, t, e) { return new P(n, t, e) }

    function P(n, t, e) { this.h = n, this.s = t, this.l = e }

    function R(n, t, e) {
        function r(n) { return n > 360 ? n -= 360 : 0 > n && (n += 360), 60 > n ? i + (a - i) * n / 60 : 180 > n ? a : 240 > n ? i + (a - i) * (240 - n) / 60 : i }

        function u(n) { return Math.round(r(n) * 255) } var i, a; return n %= 360, 0 > n && (n += 360), t = 0 > t ? 0 : t > 1 ? 1 : t, e = 0 > e ? 0 : e > 1 ? 1 : e, a = .5 >= e ? e * (1 + t) : e + t - e * t, i = 2 * e - a, et(u(n + 120), u(n), u(n - 120)) }

    function O(n) { return n > 0 ? 1 : 0 > n ? -1 : 0 }

    function Y(n) { return Math.acos(Math.max(-1, Math.min(1, n))) }

    function U(n) { return n > 1 ? Fa / 2 : -1 > n ? -Fa / 2 : Math.asin(n) }

    function I(n) { return (Math.exp(n) - Math.exp(-n)) / 2 }

    function V(n) { return (Math.exp(n) + Math.exp(-n)) / 2 }

    function X(n) { return (n = Math.sin(n / 2)) * n }

    function Z(n, t, e) { return new B(n, t, e) }

    function B(n, t, e) { this.h = n, this.c = t, this.l = e }

    function $(n, t, e) { return J(e, Math.cos(n *= Pa) * t, Math.sin(n) * t) }

    function J(n, t, e) { return new G(n, t, e) }

    function G(n, t, e) { this.l = n, this.a = t, this.b = e }

    function K(n, t, e) { var r = (n + 16) / 116,
            u = r + t / 500,
            i = r - e / 200; return u = Q(u) * Ua, r = Q(r) * Ia, i = Q(i) * Va, et(tt(3.2404542 * u - 1.5371385 * r - .4985314 * i), tt(-.969266 * u + 1.8760108 * r + .041556 * i), tt(.0556434 * u - .2040259 * r + 1.0572252 * i)) }

    function W(n, t, e) { return Z(Math.atan2(e, t) * Ra, Math.sqrt(t * t + e * e), n) }

    function Q(n) { return n > .206893034 ? n * n * n : (n - 4 / 29) / 7.787037 }

    function nt(n) { return n > .008856 ? Math.pow(n, 1 / 3) : 7.787037 * n + 4 / 29 }

    function tt(n) { return Math.round(255 * (.00304 >= n ? 12.92 * n : 1.055 * Math.pow(n, 1 / 2.4) - .055)) }

    function et(n, t, e) { return new rt(n, t, e) }

    function rt(n, t, e) { this.r = n, this.g = t, this.b = e }

    function ut(n) { return 16 > n ? "0" + Math.max(0, n).toString(16) : Math.min(255, n).toString(16) }

    function it(n, t, e) { var r, u, i, a = 0,
            o = 0,
            c = 0; if (r = /([a-z]+)\((.*)\)/i.exec(n)) switch (u = r[2].split(","), r[1]) {
            case "hsl":
                return e(parseFloat(u[0]), parseFloat(u[1]) / 100, parseFloat(u[2]) / 100);
            case "rgb":
                return t(lt(u[0]), lt(u[1]), lt(u[2])) }
        return (i = Ba.get(n)) ? t(i.r, i.g, i.b) : (null != n && n.charAt(0) === "#" && (n.length === 4 ? (a = n.charAt(1), a += a, o = n.charAt(2), o += o, c = n.charAt(3), c += c) : n.length === 7 && (a = n.substring(1, 3), o = n.substring(3, 5), c = n.substring(5, 7)), a = parseInt(a, 16), o = parseInt(o, 16), c = parseInt(c, 16)), t(a, o, c)) }

    function at(n, t, e) { var r, u, i = Math.min(n /= 255, t /= 255, e /= 255),
            a = Math.max(n, t, e),
            o = a - i,
            c = (a + i) / 2; return o ? (u = .5 > c ? o / (a + i) : o / (2 - a - i), r = n == a ? (t - e) / o + (e > t ? 6 : 0) : t == a ? (e - n) / o + 2 : (n - t) / o + 4, r *= 60) : u = r = 0, H(r, u, c) }

    function ot(n, t, e) { n = ct(n), t = ct(t), e = ct(e); var r = nt((.4124564 * n + .3575761 * t + .1804375 * e) / Ua),
            u = nt((.2126729 * n + .7151522 * t + .072175 * e) / Ia),
            i = nt((.0193339 * n + .119192 * t + .9503041 * e) / Va); return J(116 * u - 16, 500 * (r - u), 200 * (u - i)) }

    function ct(n) { return (n /= 255) <= .04045 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4) }

    function lt(n) { var t = parseFloat(n); return n.charAt(n.length - 1) === "%" ? Math.round(2.55 * t) : t }

    function ft(n) { return "function" == typeof n ? n : function() { return n } }

    function st(n) { return n }

    function ht(n) { return n.length === 1 ? function(t, e) { n(null == t ? e : null) } : n }

    function gt(n, t) {
        function e(n, e, i) { arguments.length < 3 && (i = e, e = null); var a = ca.xhr(n, t, i); return a.row = function(n) { return arguments.length ? a.response((e = n) == null ? r : u(n)) : e }, a.row(e) }

        function r(n) { return e.parse(n.responseText) }

        function u(n) { return function(t) { return e.parse(t.responseText, n) } }

        function a(t) { return t.map(o).join(n) }

        function o(n) { return c.test(n) ? '"' + n.replace(/\"/g, '""') + '"' : n } var c = RegExp('["' + n + "\n]"),
            l = n.charCodeAt(0); return e.parse = function(n, t) { var r; return e.parseRows(n, function(n, e) { if (r) return r(n, e - 1); var u = Function("d", "return {" + n.map(function(n, t) { return JSON.stringify(n) + ": d[" + t + "]" }).join(",") + "}");
                r = t ? function(n, e) { return t(u(n), e) } : u }) }, e.parseRows = function(n, t) {
            function e() { if (f >= c) return a; if (u) return u = !1, i; var t = f; if (n.charCodeAt(t) === 34) { for (var e = t; e++ < c;)
                        if (n.charCodeAt(e) === 34) { if (n.charCodeAt(e + 1) !== 34) break;++e } f = e + 2; var r = n.charCodeAt(e + 1); return 13 === r ? (u = !0, n.charCodeAt(e + 2) === 10 && ++f) : 10 === r && (u = !0), n.substring(t + 1, e).replace(/""/g, '"') } for (; c > f;) { var r = n.charCodeAt(f++),
                        o = 1; if (10 === r) u = !0;
                    else if (13 === r) u = !0, n.charCodeAt(f) === 10 && (++f, ++o);
                    else if (r !== l) continue; return n.substring(t, f - o) } return n.substring(t) } for (var r, u, i = {}, a = {}, o = [], c = n.length, f = 0, s = 0;
                (r = e()) !== a;) { for (var h = []; r !== i && r !== a;) h.push(r), r = e();
                (!t || (h = t(h, s++))) && o.push(h) } return o }, e.format = function(t) { if (Array.isArray(t[0])) return e.formatRows(t); var r = new i,
                u = []; return t.forEach(function(n) { for (var t in n) r.has(t) || u.push(r.add(t)) }), [u.map(o).join(n)].concat(t.map(function(t) { return u.map(function(n) { return o(t[n]) }).join(n) })).join("\n") }, e.formatRows = function(n) { return n.map(a).join("\n") }, e }

    function pt() { for (var n, t = Date.now(), e = Wa; e;) n = t - e.then, n >= e.delay && (e.flush = e.callback(n)), e = e.next; var r = dt() - t;
        r > 24 ? (isFinite(r) && (clearTimeout(Ja), Ja = setTimeout(pt, r)), $a = 0) : ($a = 1, Qa(pt)) }

    function dt() { for (var n = null, t = Wa, e = 1 / 0; t;) t.flush ? (delete Ka[t.callback.id], t = n ? n.next = t.next : Wa = t.next) : (e = Math.min(e, t.then + t.delay), t = (n = t).next); return e }

    function mt(n, t) { var e = Math.pow(10, Math.abs(8 - t) * 3); return { scale: t > 8 ? function(n) { return n / e } : function(n) { return n * e }, symbol: n } }

    function vt(n, t) { return t - (n ? Math.ceil(Math.log(n) / Math.LN10) : 1) }

    function yt(n) { return n + "" }

    function Mt(n, t) { n && lo.hasOwnProperty(n.type) && lo[n.type](n, t) }

    function xt(n, t, e) { var r, u = -1,
            i = n.length - e; for (t.lineStart(); ++u < i;) r = n[u], t.point(r[0], r[1]);
        t.lineEnd() }

    function bt(n, t) { var e = -1,
            r = n.length; for (t.polygonStart(); ++e < r;) xt(n[e], t, 1);
        t.polygonEnd() }

    function _t() {
        function n(n, t) { n *= Pa, t = t * Pa / 2 + Fa / 4; var e = n - r,
                a = Math.cos(t),
                o = Math.sin(t),
                c = i * o,
                l = so,
                f = ho,
                s = u * a + c * Math.cos(e),
                h = c * Math.sin(e);
            so = l * s - f * h, ho = f * s + l * h, r = n, u = a, i = o } var t, e, r, u, i;
        go.point = function(a, o) { go.point = n, r = (t = a) * Pa, u = Math.cos(o = (e = o) * Pa / 2 + Fa / 4), i = Math.sin(o) }, go.lineEnd = function() { n(t, e) } }

    function wt(n) {
        function t(n, t) { r > n && (r = n), n > i && (i = n), u > t && (u = t), t > a && (a = t) }

        function e() { o.point = o.lineEnd = T } var r, u, i, a, o = { point: t, lineStart: T, lineEnd: T, polygonStart: function() { o.lineEnd = e }, polygonEnd: function() { o.point = t } }; return function(t) { return a = i = -(r = u = 1 / 0), ca.geo.stream(t, n(o)), [
                [r, u],
                [i, a]
            ] } }

    function St(n, t) { if (!po) {++mo, n *= Pa; var e = Math.cos(t *= Pa);
            vo += (e * Math.cos(n) - vo) / mo, yo += (e * Math.sin(n) - yo) / mo, Mo += (Math.sin(t) - Mo) / mo } }

    function Et() { var n, t;
        po = 1, kt(), po = 2; var e = xo.point;
        xo.point = function(r, u) { e(n = r, t = u) }, xo.lineEnd = function() { xo.point(n, t), At(), xo.lineEnd = At } }

    function kt() {
        function n(n, u) { n *= Pa; var i = Math.cos(u *= Pa),
                a = i * Math.cos(n),
                o = i * Math.sin(n),
                c = Math.sin(u),
                l = Math.atan2(Math.sqrt((l = e * c - r * o) * l + (l = r * a - t * c) * l + (l = t * o - e * a) * l), t * a + e * o + r * c);
            mo += l, vo += l * (t + (t = a)), yo += l * (e + (e = o)), Mo += l * (r + (r = c)) } var t, e, r;
        po > 1 || (1 > po && (po = 1, mo = vo = yo = Mo = 0), xo.point = function(u, i) { u *= Pa; var a = Math.cos(i *= Pa);
            t = a * Math.cos(u), e = a * Math.sin(u), r = Math.sin(i), xo.point = n }) }

    function At() { xo.point = St }

    function qt(n) { var t = n[0],
            e = n[1],
            r = Math.cos(e); return [r * Math.cos(t), r * Math.sin(t), Math.sin(e)] }

    function Nt(n, t) { return n[0] * t[0] + n[1] * t[1] + n[2] * t[2] }

    function Tt(n, t) { return [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]] }

    function Ct(n, t) { n[0] += t[0], n[1] += t[1], n[2] += t[2] }

    function zt(n, t) { return [n[0] * t, n[1] * t, n[2] * t] }

    function Dt(n) { var t = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
        n[0] /= t, n[1] /= t, n[2] /= t }

    function jt() { return !0 }

    function Lt(n) { return [Math.atan2(n[1], n[0]), Math.asin(Math.max(-1, Math.min(1, n[2])))] }

    function Ft(n, t) { return Math.abs(n[0] - t[0]) < Ha && Math.abs(n[1] - t[1]) < Ha }

    function Ht(n, t, e, r, u) { var i = [],
            a = []; if (n.forEach(function(n) { if (!((t = n.length - 1) <= 0)) { var t, e = n[0],
                        r = n[t]; if (Ft(e, r)) { u.lineStart(); for (var o = 0; t > o; ++o) u.point((e = n[o])[0], e[1]); return u.lineEnd(), void 0 } var c = { point: e, points: n, other: null, visited: !1, entry: !0, subject: !0 },
                        l = { point: e, points: [e], other: c, visited: !1, entry: !1, subject: !1 };
                    c.other = l, i.push(c), a.push(l), c = { point: r, points: [r], other: null, visited: !1, entry: !1, subject: !0 }, l = { point: r, points: [r], other: c, visited: !1, entry: !0, subject: !1 }, c.other = l, i.push(c), a.push(l) } }), a.sort(t), Pt(i), Pt(a), i.length) { if (e)
                for (var o = 1, c = !e(a[0].point), l = a.length; l > o; ++o) a[o].entry = c = !c; for (var f, s, h, g = i[0];;) { for (f = g; f.visited;)
                    if ((f = f.next) === g) return;
                s = f.points, u.lineStart();
                do { if (f.visited = f.other.visited = !0, f.entry) { if (f.subject)
                            for (var o = 0; o < s.length; o++) u.point((h = s[o])[0], h[1]);
                        else r(f.point, f.next.point, 1, u);
                        f = f.next } else { if (f.subject) { s = f.prev.points; for (var o = s.length; --o >= 0;) u.point((h = s[o])[0], h[1]) } else r(f.point, f.prev.point, -1, u);
                        f = f.prev } f = f.other, s = f.points } while (!f.visited);
                u.lineEnd() } } }

    function Pt(n) { if (t = n.length) { for (var t, e, r = 0, u = n[0]; ++r < t;) u.next = e = n[r], e.prev = u, u = e;
            u.next = e = n[0], e.prev = u } }

    function Rt(n, t, e) { return function(r) {
            function u(t, e) { n(t, e) && r.point(t, e) }

            function i(n, t) { m.point(n, t) }

            function a() { v.point = i, m.lineStart() }

            function o() { v.point = u, m.lineEnd() }

            function c(n, t) { M.point(n, t), d.push([n, t]) }

            function l() { M.lineStart(), d = [] }

            function f() { c(d[0][0], d[0][1]), M.lineEnd(); var n, t = M.clean(),
                    e = y.buffer(),
                    u = e.length; if (!u) return p = !0, g += Ut(d, -1), d = null, void 0; if (d = null, 1 & t) { n = e[0], h += Ut(n, 1); var i, u = n.length - 1,
                        a = -1; for (r.lineStart(); ++a < u;) r.point((i = n[a])[0], i[1]); return r.lineEnd(), void 0 } u > 1 && 2 & t && e.push(e.pop().concat(e.shift())), s.push(e.filter(Ot)) } var s, h, g, p, d, m = t(r),
                v = { point: u, lineStart: a, lineEnd: o, polygonStart: function() { v.point = c, v.lineStart = l, v.lineEnd = f, p = !1, g = h = 0, s = [], r.polygonStart() }, polygonEnd: function() { v.point = u, v.lineStart = a, v.lineEnd = o, s = ca.merge(s), s.length ? Ht(s, It, null, e, r) : (-Ha > h || p && -Ha > g) && (r.lineStart(), e(null, null, 1, r), r.lineEnd()), r.polygonEnd(), s = null }, sphere: function() { r.polygonStart(), r.lineStart(), e(null, null, 1, r), r.lineEnd(), r.polygonEnd() } },
                y = Yt(),
                M = t(y); return v } }

    function Ot(n) { return n.length > 1 }

    function Yt() { var n, t = []; return { lineStart: function() { t.push(n = []) }, point: function(t, e) { n.push([t, e]) }, lineEnd: T, buffer: function() { var e = t; return t = [], n = null, e }, rejoin: function() { t.length > 1 && t.push(t.pop().concat(t.shift())) } } }

    function Ut(n, t) { if (!(e = n.length)) return 0; for (var e, r, u, i = 0, a = 0, o = n[0], c = o[0], l = o[1], f = Math.cos(l), s = Math.atan2(t * Math.sin(c) * f, Math.sin(l)), h = 1 - t * Math.cos(c) * f, g = s; ++i < e;) o = n[i], f = Math.cos(l = o[1]), r = Math.atan2(t * Math.sin(c = o[0]) * f, Math.sin(l)), u = 1 - t * Math.cos(c) * f, Math.abs(h - 2) < Ha && Math.abs(u - 2) < Ha || (Math.abs(u) < Ha || Math.abs(h) < Ha || (Math.abs(Math.abs(r - s) - Fa) < Ha ? u + h > 2 && (a += 4 * (r - s)) : a += Math.abs(h - 2) < Ha ? 4 * (r - g) : ((3 * Fa + r - s) % (2 * Fa) - Fa) * (h + u)), g = s, s = r, h = u); return a }

    function It(n, t) { return ((n = n.point)[0] < 0 ? n[1] - Fa / 2 - Ha : Fa / 2 - n[1]) - ((t = t.point)[0] < 0 ? t[1] - Fa / 2 - Ha : Fa / 2 - t[1]) }

    function Vt(n) { var t, e = 0 / 0,
            r = 0 / 0,
            u = 0 / 0; return { lineStart: function() { n.lineStart(), t = 1 }, point: function(i, a) { var o = i > 0 ? Fa : -Fa,
                    c = Math.abs(i - e);
                Math.abs(c - Fa) < Ha ? (n.point(e, r = (r + a) / 2 > 0 ? Fa / 2 : -Fa / 2), n.point(u, r), n.lineEnd(), n.lineStart(), n.point(o, r), n.point(i, r), t = 0) : u !== o && c >= Fa && (Math.abs(e - u) < Ha && (e -= u * Ha), Math.abs(i - o) < Ha && (i -= o * Ha), r = Xt(e, r, i, a), n.point(u, r), n.lineEnd(), n.lineStart(), n.point(o, r), t = 0), n.point(e = i, r = a), u = o }, lineEnd: function() { n.lineEnd(), e = r = 0 / 0 }, clean: function() { return 2 - t } } }

    function Xt(n, t, e, r) { var u, i, a = Math.sin(n - e); return Math.abs(a) > Ha ? Math.atan((Math.sin(t) * (i = Math.cos(r)) * Math.sin(e) - Math.sin(r) * (u = Math.cos(t)) * Math.sin(n)) / (u * i * a)) : (t + r) / 2 }

    function Zt(n, t, e, r) { var u; if (null == n) u = e * Fa / 2, r.point(-Fa, u), r.point(0, u), r.point(Fa, u), r.point(Fa, 0), r.point(Fa, -u), r.point(0, -u), r.point(-Fa, -u), r.point(-Fa, 0), r.point(-Fa, u);
        else if (Math.abs(n[0] - t[0]) > Ha) { var i = (n[0] < t[0] ? 1 : -1) * Fa;
            u = e * i / 2, r.point(-i, u), r.point(0, u), r.point(i, u) } else r.point(t[0], t[1]) }

    function Bt(n) {
        function t(n, t) { return Math.cos(n) * Math.cos(t) > i }

        function e(n) { var e, i, c, l, f; return { lineStart: function() { l = c = !1, f = 1 }, point: function(s, h) { var g, p = [s, h],
                        d = t(s, h),
                        m = a ? d ? 0 : u(s, h) : d ? u(s + (0 > s ? Fa : -Fa), h) : 0; if (!e && (l = c = d) && n.lineStart(), d !== c && (g = r(e, p), (Ft(e, g) || Ft(p, g)) && (p[0] += Ha, p[1] += Ha, d = t(p[0], p[1]))), d !== c) f = 0, d ? (n.lineStart(), g = r(p, e), n.point(g[0], g[1])) : (g = r(e, p), n.point(g[0], g[1]), n.lineEnd()), e = g;
                    else if (o && e && a ^ d) { var v;
                        m & i || !(v = r(p, e, !0)) || (f = 0, a ? (n.lineStart(), n.point(v[0][0], v[0][1]), n.point(v[1][0], v[1][1]), n.lineEnd()) : (n.point(v[1][0], v[1][1]), n.lineEnd(), n.lineStart(), n.point(v[0][0], v[0][1]))) }!d || e && Ft(e, p) || n.point(p[0], p[1]), e = p, c = d, i = m }, lineEnd: function() { c && n.lineEnd(), e = null }, clean: function() { return f | (l && c) << 1 } } }

        function r(n, t, e) { var r = qt(n),
                u = qt(t),
                a = [1, 0, 0],
                o = Tt(r, u),
                c = Nt(o, o),
                l = o[0],
                f = c - l * l; if (!f) return !e && n; var s = i * c / f,
                h = -i * l / f,
                g = Tt(a, o),
                p = zt(a, s),
                d = zt(o, h);
            Ct(p, d); var m = g,
                v = Nt(p, m),
                y = Nt(m, m),
                M = v * v - y * (Nt(p, p) - 1); if (!(0 > M)) { var x = Math.sqrt(M),
                    b = zt(m, (-v - x) / y); if (Ct(b, p), b = Lt(b), !e) return b; var _, w = n[0],
                    S = t[0],
                    E = n[1],
                    k = t[1];
                w > S && (_ = w, w = S, S = _); var A = S - w,
                    q = Math.abs(A - Fa) < Ha,
                    N = q || Ha > A; if (!q && E > k && (_ = E, E = k, k = _), N ? q ? E + k > 0 ^ b[1] < (Math.abs(b[0] - w) < Ha ? E : k) : E <= b[1] && b[1] <= k : A > Fa ^ (w <= b[0] && b[0] <= S)) { var T = zt(m, (-v + x) / y); return Ct(T, p), [b, Lt(T)] } } }

        function u(t, e) { var r = a ? n : Fa - n,
                u = 0; return -r > t ? u |= 1 : t > r && (u |= 2), -r > e ? u |= 4 : e > r && (u |= 8), u } var i = Math.cos(n),
            a = i > 0,
            o = Math.abs(i) > Ha,
            c = ae(n, 6 * Pa); return Rt(t, e, c) }

    function $t(n, t, e, r) {
        function u(r, u) { return Math.abs(r[0] - n) < Ha ? u > 0 ? 0 : 3 : Math.abs(r[0] - e) < Ha ? u > 0 ? 2 : 1 : Math.abs(r[1] - t) < Ha ? u > 0 ? 1 : 0 : u > 0 ? 3 : 2 }

        function i(n, t) { return a(n.point, t.point) }

        function a(n, t) { var e = u(n, 1),
                r = u(t, 1); return e !== r ? e - r : 0 === e ? t[1] - n[1] : 1 === e ? n[0] - t[0] : 2 === e ? n[1] - t[1] : t[0] - n[0] }

        function o(u, i) { var a = i[0] - u[0],
                o = i[1] - u[1],
                c = [0, 1]; return Math.abs(a) < Ha && Math.abs(o) < Ha ? n <= u[0] && u[0] <= e && t <= u[1] && u[1] <= r : Jt(n - u[0], a, c) && Jt(u[0] - e, -a, c) && Jt(t - u[1], o, c) && Jt(u[1] - r, -o, c) ? (c[1] < 1 && (i[0] = u[0] + c[1] * a, i[1] = u[1] + c[1] * o), c[0] > 0 && (u[0] += c[0] * a, u[1] += c[0] * o), !0) : !1 } return function(c) {
            function l(i) { var a = u(i, -1),
                    o = f([0 === a || 3 === a ? n : e, a > 1 ? r : t]); return o }

            function f(n) { for (var t = 0, e = M.length, r = n[1], u = 0; e > u; ++u)
                    for (var i = 1, a = M[u], o = a.length, c = a[0]; o > i; ++i) b = a[i], c[1] <= r ? b[1] > r && s(c, b, n) > 0 && ++t : b[1] <= r && s(c, b, n) < 0 && --t, c = b; return 0 !== t }

            function s(n, t, e) { return (t[0] - n[0]) * (e[1] - n[1]) - (e[0] - n[0]) * (t[1] - n[1]) }

            function h(i, o, c, l) { var f = 0,
                    s = 0; if (null == i || (f = u(i, c)) !== (s = u(o, c)) || a(i, o) < 0 ^ c > 0) { do l.point(0 === f || 3 === f ? n : e, f > 1 ? r : t); while ((f = (f + c + 4) % 4) !== s) } else l.point(o[0], o[1]) }

            function g(u, i) { return u >= n && e >= u && i >= t && r >= i }

            function p(n, t) { g(n, t) && c.point(n, t) }

            function d() { C.point = v, M && M.push(x = []), q = !0, A = !1, E = k = 0 / 0 }

            function m() { y && (v(_, w), S && A && T.rejoin(), y.push(T.buffer())), C.point = p, A && c.lineEnd() }

            function v(n, t) { n = Math.max(-_o, Math.min(_o, n)), t = Math.max(-_o, Math.min(_o, t)); var e = g(n, t); if (M && x.push([n, t]), q) _ = n, w = t, S = e, q = !1, e && (c.lineStart(), c.point(n, t));
                else if (e && A) c.point(n, t);
                else { var r = [E, k],
                        u = [n, t];
                    o(r, u) ? (A || (c.lineStart(), c.point(r[0], r[1])), c.point(u[0], u[1]), e || c.lineEnd()) : (c.lineStart(), c.point(n, t)) } E = n, k = t, A = e } var y, M, x, _, w, S, E, k, A, q, N = c,
                T = Yt(),
                C = { point: p, lineStart: d, lineEnd: m, polygonStart: function() { c = T, y = [], M = [] }, polygonEnd: function() { c = N, (y = ca.merge(y)).length ? (c.polygonStart(), Ht(y, i, l, h, c), c.polygonEnd()) : f([n, t]) && (c.polygonStart(), c.lineStart(), h(null, null, 1, c), c.lineEnd(), c.polygonEnd()), y = M = x = null } }; return C } }

    function Jt(n, t, e) { if (Math.abs(t) < Ha) return 0 >= n; var r = n / t; if (t > 0) { if (r > e[1]) return !1;
            r > e[0] && (e[0] = r) } else { if (r < e[0]) return !1;
            r < e[1] && (e[1] = r) } return !0 }

    function Gt(n, t) {
        function e(e, r) { return e = n(e, r), t(e[0], e[1]) } return n.invert && t.invert && (e.invert = function(e, r) { return e = t.invert(e, r), e && n.invert(e[0], e[1]) }), e }

    function Kt(n) {
        function t(t) {
            function r(e, r) { e = n(e, r), t.point(e[0], e[1]) }

            function i() { f = 0 / 0, d.point = a, t.lineStart() }

            function a(r, i) { var a = qt([r, i]),
                    o = n(r, i);
                e(f, s, l, h, g, p, f = o[0], s = o[1], l = r, h = a[0], g = a[1], p = a[2], u, t), t.point(f, s) }

            function o() { d.point = r, t.lineEnd() }

            function c() { var n, r, c, m, v, y, M;
                i(), d.point = function(t, e) { a(n = t, r = e), c = f, m = s, v = h, y = g, M = p, d.point = a }, d.lineEnd = function() { e(f, s, l, h, g, p, c, m, n, v, y, M, u, t), d.lineEnd = o, o() } } var l, f, s, h, g, p, d = { point: r, lineStart: i, lineEnd: o, polygonStart: function() { t.polygonStart(), d.lineStart = c }, polygonEnd: function() { t.polygonEnd(), d.lineStart = i } }; return d }

        function e(t, u, i, a, o, c, l, f, s, h, g, p, d, m) { var v = l - t,
                y = f - u,
                M = v * v + y * y; if (M > 4 * r && d--) { var x = a + h,
                    b = o + g,
                    _ = c + p,
                    w = Math.sqrt(x * x + b * b + _ * _),
                    S = Math.asin(_ /= w),
                    E = Math.abs(Math.abs(_) - 1) < Ha ? (i + s) / 2 : Math.atan2(b, x),
                    k = n(E, S),
                    A = k[0],
                    q = k[1],
                    N = A - t,
                    T = q - u,
                    C = y * N - v * T;
                (C * C / M > r || Math.abs((v * N + y * T) / M - .5) > .3) && (e(t, u, i, a, o, c, A, q, E, x /= w, b /= w, _, d, m), m.point(A, q), e(A, q, E, x, b, _, l, f, s, h, g, p, d, m)) } } var r = .5,
            u = 16; return t.precision = function(n) { return arguments.length ? (u = (r = n * n) > 0 && 16, t) : Math.sqrt(r) }, t }

    function Wt(n) { return Qt(function() { return n })() }

    function Qt(n) {
        function t(n) { return n = a(n[0] * Pa, n[1] * Pa), [n[0] * f + o, c - n[1] * f] }

        function e(n) { return n = a.invert((n[0] - o) / f, (c - n[1]) / f), n && [n[0] * Ra, n[1] * Ra] }

        function r() { a = Gt(i = ee(d, m, v), u); var n = u(g, p); return o = s - n[0] * f, c = h + n[1] * f, t } var u, i, a, o, c, l = Kt(function(n, t) { return n = u(n, t), [n[0] * f + o, c - n[1] * f] }),
            f = 150,
            s = 480,
            h = 250,
            g = 0,
            p = 0,
            d = 0,
            m = 0,
            v = 0,
            y = bo,
            M = st,
            x = null,
            b = null; return t.stream = function(n) { return ne(i, y(l(M(n)))) }, t.clipAngle = function(n) { return arguments.length ? (y = null == n ? (x = n, bo) : Bt((x = +n) * Pa), t) : x }, t.clipExtent = function(n) { return arguments.length ? (b = n, M = null == n ? st : $t(n[0][0], n[0][1], n[1][0], n[1][1]), t) : b }, t.scale = function(n) { return arguments.length ? (f = +n, r()) : f }, t.translate = function(n) { return arguments.length ? (s = +n[0], h = +n[1], r()) : [s, h] }, t.center = function(n) { return arguments.length ? (g = n[0] % 360 * Pa, p = n[1] % 360 * Pa, r()) : [g * Ra, p * Ra] }, t.rotate = function(n) { return arguments.length ? (d = n[0] % 360 * Pa, m = n[1] % 360 * Pa, v = n.length > 2 ? n[2] % 360 * Pa : 0, r()) : [d * Ra, m * Ra, v * Ra] }, ca.rebind(t, l, "precision"),
            function() { return u = n.apply(this, arguments), t.invert = u.invert && e, r() } }

    function ne(n, t) { return { point: function(e, r) { r = n(e * Pa, r * Pa), e = r[0], t.point(e > Fa ? e - 2 * Fa : -Fa > e ? e + 2 * Fa : e, r[1]) }, sphere: function() { t.sphere() }, lineStart: function() { t.lineStart() }, lineEnd: function() { t.lineEnd() }, polygonStart: function() { t.polygonStart() }, polygonEnd: function() { t.polygonEnd() } } }

    function te(n, t) { return [n, t] }

    function ee(n, t, e) { return n ? t || e ? Gt(ue(n), ie(t, e)) : ue(n) : t || e ? ie(t, e) : te }

    function re(n) { return function(t, e) { return t += n, [t > Fa ? t - 2 * Fa : -Fa > t ? t + 2 * Fa : t, e] } }

    function ue(n) { var t = re(n); return t.invert = re(-n), t }

    function ie(n, t) {
        function e(n, t) { var e = Math.cos(t),
                o = Math.cos(n) * e,
                c = Math.sin(n) * e,
                l = Math.sin(t),
                f = l * r + o * u; return [Math.atan2(c * i - f * a, o * r - l * u), Math.asin(Math.max(-1, Math.min(1, f * i + c * a)))] } var r = Math.cos(n),
            u = Math.sin(n),
            i = Math.cos(t),
            a = Math.sin(t); return e.invert = function(n, t) { var e = Math.cos(t),
                o = Math.cos(n) * e,
                c = Math.sin(n) * e,
                l = Math.sin(t),
                f = l * i - c * a; return [Math.atan2(c * i + l * a, o * r + f * u), Math.asin(Math.max(-1, Math.min(1, f * r - o * u)))] }, e }

    function ae(n, t) { var e = Math.cos(n),
            r = Math.sin(n); return function(u, i, a, o) { null != u ? (u = oe(e, u), i = oe(e, i), (a > 0 ? i > u : u > i) && (u += 2 * a * Fa)) : (u = n + 2 * a * Fa, i = n); for (var c, l = a * t, f = u; a > 0 ? f > i : i > f; f -= l) o.point((c = Lt([e, -r * Math.cos(f), -r * Math.sin(f)]))[0], c[1]) } }

    function oe(n, t) { var e = qt(t);
        e[0] -= n, Dt(e); var r = Y(-e[1]); return ((-e[2] < 0 ? -r : r) + 2 * Math.PI - Ha) % (2 * Math.PI) }

    function ce(n, t, e) { var r = ca.range(n, t - Ha, e).concat(t); return function(n) { return r.map(function(t) { return [n, t] }) } }

    function le(n, t, e) { var r = ca.range(n, t - Ha, e).concat(t); return function(n) { return r.map(function(t) { return [t, n] }) } }

    function fe(n) { return n.source }

    function se(n) { return n.target }

    function he(n, t, e, r) { var u = Math.cos(t),
            i = Math.sin(t),
            a = Math.cos(r),
            o = Math.sin(r),
            c = u * Math.cos(n),
            l = u * Math.sin(n),
            f = a * Math.cos(e),
            s = a * Math.sin(e),
            h = 2 * Math.asin(Math.sqrt(X(r - t) + u * a * X(e - n))),
            g = 1 / Math.sin(h),
            p = h ? function(n) { var t = Math.sin(n *= h) * g,
                    e = Math.sin(h - n) * g,
                    r = e * c + t * f,
                    u = e * l + t * s,
                    a = e * i + t * o; return [Math.atan2(u, r) * Ra, Math.atan2(a, Math.sqrt(r * r + u * u)) * Ra] } : function() { return [n * Ra, t * Ra] }; return p.distance = h, p }

    function ge() {
        function n(n, u) { var i = Math.sin(u *= Pa),
                a = Math.cos(u),
                o = Math.abs((n *= Pa) - t),
                c = Math.cos(o);
            wo += Math.atan2(Math.sqrt((o = a * Math.sin(o)) * o + (o = r * i - e * a * c) * o), e * i + r * a * c), t = n, e = i, r = a } var t, e, r;
        So.point = function(u, i) { t = u * Pa, e = Math.sin(i *= Pa), r = Math.cos(i), So.point = n }, So.lineEnd = function() { So.point = So.lineEnd = T } }

    function pe(n) { var t = 0,
            e = Fa / 3,
            r = Qt(n),
            u = r(t, e); return u.parallels = function(n) { return arguments.length ? r(t = n[0] * Fa / 180, e = n[1] * Fa / 180) : [180 * (t / Fa), 180 * (e / Fa)] }, u }

    function de(n, t) {
        function e(n, t) { var e = Math.sqrt(i - 2 * u * Math.sin(t)) / u; return [e * Math.sin(n *= u), a - e * Math.cos(n)] } var r = Math.sin(n),
            u = (r + Math.sin(t)) / 2,
            i = 1 + r * (2 * u - r),
            a = Math.sqrt(i) / u; return e.invert = function(n, t) { var e = a - t; return [Math.atan2(n, e) / u, Math.asin((i - (n * n + e * e) * u * u) / (2 * u))] }, e }

    function me(n, t) { var e = n(t[0]),
            r = n([.5 * (t[0][0] + t[1][0]), t[0][1]]),
            u = n([t[1][0], t[0][1]]),
            i = n(t[1]),
            a = r[1] - e[1],
            o = r[0] - e[0],
            c = u[1] - r[1],
            l = u[0] - r[0],
            f = a / o,
            s = c / l,
            h = .5 * (f * s * (e[1] - u[1]) + s * (e[0] + r[0]) - f * (r[0] + u[0])) / (s - f),
            g = (.5 * (e[0] + r[0]) - h) / f + .5 * (e[1] + r[1]),
            p = i[0] - h,
            d = i[1] - g,
            m = e[0] - h,
            v = e[1] - g,
            y = p * p + d * d,
            M = m * m + v * v,
            x = Math.atan2(d, p),
            b = Math.atan2(v, m); return function(t) { var e = t[0] - h,
                r = t[1] - g,
                u = e * e + r * r,
                i = Math.atan2(r, e); return u > y && M > u && i > x && b > i ? n.invert(t) : void 0 } }

    function ve() {
        function n(n, t) { ko += u * n - r * t, r = n, u = t } var t, e, r, u;
        Ao.point = function(i, a) { Ao.point = n, t = r = i, e = u = a }, Ao.lineEnd = function() { n(t, e) } }

    function ye() {
        function n(n, t) { a.push("M", n, ",", t, i) }

        function t(n, t) { a.push("M", n, ",", t), o.point = e }

        function e(n, t) { a.push("L", n, ",", t) }

        function r() { o.point = n }

        function u() { a.push("Z") } var i = Se(4.5),
            a = [],
            o = { point: n, lineStart: function() { o.point = t }, lineEnd: r, polygonStart: function() { o.lineEnd = u }, polygonEnd: function() { o.lineEnd = r, o.point = n }, pointRadius: function(n) { return i = Se(n), o }, result: function() { if (a.length) { var n = a.join(""); return a = [], n } } }; return o }

    function Me(n, t) { po || (vo += n, yo += t, ++Mo) }

    function xe() {
        function n(n, r) { var u = n - t,
                i = r - e,
                a = Math.sqrt(u * u + i * i);
            vo += a * (t + n) / 2, yo += a * (e + r) / 2, Mo += a, t = n, e = r } var t, e; if (1 !== po) { if (!(1 > po)) return;
            po = 1, vo = yo = Mo = 0 } qo.point = function(r, u) { qo.point = n, t = r, e = u } }

    function be() { qo.point = Me }

    function _e() {
        function n(n, t) { var e = u * n - r * t;
            vo += e * (r + n), yo += e * (u + t), Mo += 3 * e, r = n, u = t } var t, e, r, u;
        2 > po && (po = 2, vo = yo = Mo = 0), qo.point = function(i, a) { qo.point = n, t = r = i, e = u = a }, qo.lineEnd = function() { n(t, e) } }

    function we(n) {
        function t(t, e) { n.moveTo(t, e), n.arc(t, e, a, 0, 2 * Fa) }

        function e(t, e) { n.moveTo(t, e), o.point = r }

        function r(t, e) { n.lineTo(t, e) }

        function u() { o.point = t }

        function i() { n.closePath() } var a = 4.5,
            o = { point: t, lineStart: function() { o.point = e }, lineEnd: u, polygonStart: function() { o.lineEnd = i }, polygonEnd: function() { o.lineEnd = u, o.point = t }, pointRadius: function(n) { return a = n, o }, result: T }; return o }

    function Se(n) { return "m0," + n + "a" + n + "," + n + " 0 1,1 0," + -2 * n + "a" + n + "," + n + " 0 1,1 0," + 2 * n + "z" }

    function Ee(n) { var t = Kt(function(t, e) { return n([t * Ra, e * Ra]) }); return function(n) { return n = t(n), { point: function(t, e) { n.point(t * Pa, e * Pa) }, sphere: function() { n.sphere() }, lineStart: function() { n.lineStart() }, lineEnd: function() { n.lineEnd() }, polygonStart: function() { n.polygonStart() }, polygonEnd: function() { n.polygonEnd() } } } }

    function ke(n, t) {
        function e(t, e) { var r = Math.cos(t),
                u = Math.cos(e),
                i = n(r * u); return [i * u * Math.sin(t), i * Math.sin(e)] } return e.invert = function(n, e) { var r = Math.sqrt(n * n + e * e),
                u = t(r),
                i = Math.sin(u),
                a = Math.cos(u); return [Math.atan2(n * i, r * a), Math.asin(r && e * i / r)] }, e }

    function Ae(n, t) {
        function e(n, t) { var e = Math.abs(Math.abs(t) - Fa / 2) < Ha ? 0 : a / Math.pow(u(t), i); return [e * Math.sin(i * n), a - e * Math.cos(i * n)] } var r = Math.cos(n),
            u = function(n) { return Math.tan(Fa / 4 + n / 2) },
            i = n === t ? Math.sin(n) : Math.log(r / Math.cos(t)) / Math.log(u(t) / u(n)),
            a = r * Math.pow(u(n), i) / i; return i ? (e.invert = function(n, t) { var e = a - t,
                r = O(i) * Math.sqrt(n * n + e * e); return [Math.atan2(n, e) / i, 2 * Math.atan(Math.pow(a / r, 1 / i)) - Fa / 2] }, e) : Ne }

    function qe(n, t) {
        function e(n, t) { var e = i - t; return [e * Math.sin(u * n), i - e * Math.cos(u * n)] } var r = Math.cos(n),
            u = n === t ? Math.sin(n) : (r - Math.cos(t)) / (t - n),
            i = r / u + n; return Math.abs(u) < Ha ? te : (e.invert = function(n, t) { var e = i - t; return [Math.atan2(n, e) / u, i - O(u) * Math.sqrt(n * n + e * e)] }, e) }

    function Ne(n, t) { return [n, Math.log(Math.tan(Fa / 4 + t / 2))] }

    function Te(n) { var t, e = Wt(n),
            r = e.scale,
            u = e.translate,
            i = e.clipExtent; return e.scale = function() { var n = r.apply(e, arguments); return n === e ? t ? e.clipExtent(null) : e : n }, e.translate = function() { var n = u.apply(e, arguments); return n === e ? t ? e.clipExtent(null) : e : n }, e.clipExtent = function(n) { var a = i.apply(e, arguments); if (a === e) { if (t = null == n) { var o = Fa * r(),
                        c = u();
                    i([
                        [c[0] - o, c[1] - o],
                        [c[0] + o, c[1] + o]
                    ]) } } else t && (a = null); return a }, e.clipExtent(null) }

    function Ce(n, t) { var e = Math.cos(t) * Math.sin(n); return [Math.log((1 + e) / (1 - e)) / 2, Math.atan2(Math.tan(t), Math.cos(n))] }

    function ze(n) {
        function t(t) {
            function a() { l.push("M", i(n(f), o)) } for (var c, l = [], f = [], s = -1, h = t.length, g = ft(e), p = ft(r); ++s < h;) u.call(this, c = t[s], s) ? f.push([+g.call(this, c, s), +p.call(this, c, s)]) : f.length && (a(), f = []); return f.length && a(), l.length ? l.join("") : null } var e = De,
            r = je,
            u = jt,
            i = Le,
            a = i.key,
            o = .7; return t.x = function(n) { return arguments.length ? (e = n, t) : e }, t.y = function(n) { return arguments.length ? (r = n, t) : r }, t.defined = function(n) { return arguments.length ? (u = n, t) : u }, t.interpolate = function(n) { return arguments.length ? (a = "function" == typeof n ? i = n : (i = jo.get(n) || Le).key, t) : a }, t.tension = function(n) { return arguments.length ? (o = n, t) : o }, t }

    function De(n) { return n[0] }

    function je(n) { return n[1] }

    function Le(n) { return n.join("L") }

    function Fe(n) { return Le(n) + "Z" }

    function He(n) { for (var t = 0, e = n.length, r = n[0], u = [r[0], ",", r[1]]; ++t < e;) u.push("V", (r = n[t])[1], "H", r[0]); return u.join("") }

    function Pe(n) { for (var t = 0, e = n.length, r = n[0], u = [r[0], ",", r[1]]; ++t < e;) u.push("H", (r = n[t])[0], "V", r[1]); return u.join("") }

    function Re(n, t) { return n.length < 4 ? Le(n) : n[1] + Ue(n.slice(1, n.length - 1), Ie(n, t)) }

    function Oe(n, t) { return n.length < 3 ? Le(n) : n[0] + Ue((n.push(n[0]), n), Ie([n[n.length - 2]].concat(n, [n[1]]), t)) }

    function Ye(n, t) { return n.length < 3 ? Le(n) : n[0] + Ue(n, Ie(n, t)) }

    function Ue(n, t) { if (t.length < 1 || n.length != t.length && n.length != t.length + 2) return Le(n); var e = n.length != t.length,
            r = "",
            u = n[0],
            i = n[1],
            a = t[0],
            o = a,
            c = 1; if (e && (r += "Q" + (i[0] - a[0] * 2 / 3) + "," + (i[1] - a[1] * 2 / 3) + "," + i[0] + "," + i[1], u = n[1], c = 2), t.length > 1) { o = t[1], i = n[c], c++, r += "C" + (u[0] + a[0]) + "," + (u[1] + a[1]) + "," + (i[0] - o[0]) + "," + (i[1] - o[1]) + "," + i[0] + "," + i[1]; for (var l = 2; l < t.length; l++, c++) i = n[c], o = t[l], r += "S" + (i[0] - o[0]) + "," + (i[1] - o[1]) + "," + i[0] + "," + i[1] } if (e) { var f = n[c];
            r += "Q" + (i[0] + o[0] * 2 / 3) + "," + (i[1] + o[1] * 2 / 3) + "," + f[0] + "," + f[1] } return r }

    function Ie(n, t) { for (var e, r = [], u = (1 - t) / 2, i = n[0], a = n[1], o = 1, c = n.length; ++o < c;) e = i, i = a, a = n[o], r.push([u * (a[0] - e[0]), u * (a[1] - e[1])]); return r }

    function Ve(n) { if (n.length < 3) return Le(n); var t = 1,
            e = n.length,
            r = n[0],
            u = r[0],
            i = r[1],
            a = [u, u, u, (r = n[1])[0]],
            o = [i, i, i, r[1]],
            c = [u, ",", i]; for (Je(c, a, o); ++t < e;) r = n[t], a.shift(), a.push(r[0]), o.shift(), o.push(r[1]), Je(c, a, o); for (t = -1; ++t < 2;) a.shift(), a.push(r[0]), o.shift(), o.push(r[1]), Je(c, a, o); return c.join("") }

    function Xe(n) { if (n.length < 4) return Le(n); for (var t, e = [], r = -1, u = n.length, i = [0], a = [0]; ++r < 3;) t = n[r], i.push(t[0]), a.push(t[1]); for (e.push($e(Ho, i) + "," + $e(Ho, a)), --r; ++r < u;) t = n[r], i.shift(), i.push(t[0]), a.shift(), a.push(t[1]), Je(e, i, a); return e.join("") }

    function Ze(n) { for (var t, e, r = -1, u = n.length, i = u + 4, a = [], o = []; ++r < 4;) e = n[r % u], a.push(e[0]), o.push(e[1]); for (t = [$e(Ho, a), ",", $e(Ho, o)], --r; ++r < i;) e = n[r % u], a.shift(), a.push(e[0]), o.shift(), o.push(e[1]), Je(t, a, o); return t.join("") }

    function Be(n, t) { var e = n.length - 1; if (e)
            for (var r, u, i = n[0][0], a = n[0][1], o = n[e][0] - i, c = n[e][1] - a, l = -1; ++l <= e;) r = n[l], u = l / e, r[0] = t * r[0] + (1 - t) * (i + u * o), r[1] = t * r[1] + (1 - t) * (a + u * c); return Ve(n) }

    function $e(n, t) { return n[0] * t[0] + n[1] * t[1] + n[2] * t[2] + n[3] * t[3] }

    function Je(n, t, e) { n.push("C", $e(Lo, t), ",", $e(Lo, e), ",", $e(Fo, t), ",", $e(Fo, e), ",", $e(Ho, t), ",", $e(Ho, e)) }

    function Ge(n, t) { return (t[1] - n[1]) / (t[0] - n[0]) }

    function Ke(n) { for (var t = 0, e = n.length - 1, r = [], u = n[0], i = n[1], a = r[0] = Ge(u, i); ++t < e;) r[t] = (a + (a = Ge(u = i, i = n[t + 1]))) / 2; return r[t] = a, r }

    function We(n) { for (var t, e, r, u, i = [], a = Ke(n), o = -1, c = n.length - 1; ++o < c;) t = Ge(n[o], n[o + 1]), Math.abs(t) < 1e-6 ? a[o] = a[o + 1] = 0 : (e = a[o] / t, r = a[o + 1] / t, u = e * e + r * r, u > 9 && (u = 3 * t / Math.sqrt(u), a[o] = u * e, a[o + 1] = u * r)); for (o = -1; ++o <= c;) u = (n[Math.min(c, o + 1)][0] - n[Math.max(0, o - 1)][0]) / (6 * (1 + a[o] * a[o])), i.push([u || 0, a[o] * u || 0]); return i }

    function Qe(n) { return n.length < 3 ? Le(n) : n[0] + Ue(n, We(n)) }

    function nr(n, t, e, r) { var u, i, a, o, c, l, f; return u = r[n], i = u[0], a = u[1], u = r[t], o = u[0], c = u[1], u = r[e], l = u[0], f = u[1], (f - a) * (o - i) - (c - a) * (l - i) > 0 }

    function tr(n, t, e) { return (e[0] - t[0]) * (n[1] - t[1]) < (e[1] - t[1]) * (n[0] - t[0]) }

    function er(n, t, e, r) {
        var u = n[0],
            i = e[0],
            a = t[0] - u,
            o = r[0] - i,
            c = n[1],
            l = e[1],
            f = t[1] - c,
            s = r[1] - l,
            h = (o * (c - l) - s * (u - i)) / (s * a - o * f);
        return [u + h * a, c + h * f]
    }

    function rr(n, t) { var e = { list: n.map(function(n, t) { return { index: t, x: n[0], y: n[1] } }).sort(function(n, t) { return n.y < t.y ? -1 : n.y > t.y ? 1 : n.x < t.x ? -1 : n.x > t.x ? 1 : 0 }), bottomSite: null },
            r = { list: [], leftEnd: null, rightEnd: null, init: function() { r.leftEnd = r.createHalfEdge(null, "l"), r.rightEnd = r.createHalfEdge(null, "l"), r.leftEnd.r = r.rightEnd, r.rightEnd.l = r.leftEnd, r.list.unshift(r.leftEnd, r.rightEnd) }, createHalfEdge: function(n, t) { return { edge: n, side: t, vertex: null, l: null, r: null } }, insert: function(n, t) { t.l = n, t.r = n.r, n.r.l = t, n.r = t }, leftBound: function(n) { var t = r.leftEnd;
                    do t = t.r; while (t != r.rightEnd && u.rightOf(t, n)); return t = t.l }, del: function(n) { n.l.r = n.r, n.r.l = n.l, n.edge = null }, right: function(n) { return n.r }, left: function(n) { return n.l }, leftRegion: function(n) { return n.edge == null ? e.bottomSite : n.edge.region[n.side] }, rightRegion: function(n) { return n.edge == null ? e.bottomSite : n.edge.region[Po[n.side]] } },
            u = { bisect: function(n, t) { var e = { region: { l: n, r: t }, ep: { l: null, r: null } },
                        r = t.x - n.x,
                        u = t.y - n.y,
                        i = r > 0 ? r : -r,
                        a = u > 0 ? u : -u; return e.c = n.x * r + n.y * u + .5 * (r * r + u * u), i > a ? (e.a = 1, e.b = u / r, e.c /= r) : (e.b = 1, e.a = r / u, e.c /= u), e }, intersect: function(n, t) { var e = n.edge,
                        r = t.edge; if (!e || !r || e.region.r == r.region.r) return null; var u = e.a * r.b - e.b * r.a; if (Math.abs(u) < 1e-10) return null; var i, a, o = (e.c * r.b - r.c * e.b) / u,
                        c = (r.c * e.a - e.c * r.a) / u,
                        l = e.region.r,
                        f = r.region.r;
                    l.y < f.y || l.y == f.y && l.x < f.x ? (i = n, a = e) : (i = t, a = r); var s = o >= a.region.r.x; return s && i.side === "l" || !s && i.side === "r" ? null : { x: o, y: c } }, rightOf: function(n, t) { var e = n.edge,
                        r = e.region.r,
                        u = t.x > r.x; if (u && n.side === "l") return 1; if (!u && n.side === "r") return 0; if (e.a === 1) { var i = t.y - r.y,
                            a = t.x - r.x,
                            o = 0,
                            c = 0; if (!u && e.b < 0 || u && e.b >= 0 ? c = o = i >= e.b * a : (c = t.x + t.y * e.b > e.c, e.b < 0 && (c = !c), c || (o = 1)), !o) { var l = r.x - e.region.l.x;
                            c = e.b * (a * a - i * i) < l * i * (1 + 2 * a / l + e.b * e.b), e.b < 0 && (c = !c) } } else { var f = e.c - e.a * t.x,
                            s = t.y - f,
                            h = t.x - r.x,
                            g = f - r.y;
                        c = s * s > h * h + g * g } return n.side === "l" ? c : !c }, endPoint: function(n, e, r) { n.ep[e] = r, n.ep[Po[e]] && t(n) }, distance: function(n, t) { var e = n.x - t.x,
                        r = n.y - t.y; return Math.sqrt(e * e + r * r) } },
            i = { list: [], insert: function(n, t, e) { n.vertex = t, n.ystar = t.y + e; for (var r = 0, u = i.list, a = u.length; a > r; r++) { var o = u[r]; if (!(n.ystar > o.ystar || n.ystar == o.ystar && t.x > o.vertex.x)) break } u.splice(r, 0, n) }, del: function(n) { for (var t = 0, e = i.list, r = e.length; r > t && e[t] != n; ++t);
                    e.splice(t, 1) }, empty: function() { return i.list.length === 0 }, nextEvent: function(n) { for (var t = 0, e = i.list, r = e.length; r > t; ++t)
                        if (e[t] == n) return e[t + 1]; return null }, min: function() { var n = i.list[0]; return { x: n.vertex.x, y: n.ystar } }, extractMin: function() { return i.list.shift() } };
        r.init(), e.bottomSite = e.list.shift(); for (var a, o, c, l, f, s, h, g, p, d, m, v, y, M = e.list.shift();;)
            if (i.empty() || (a = i.min()), M && (i.empty() || M.y < a.y || M.y == a.y && M.x < a.x)) o = r.leftBound(M), c = r.right(o), h = r.rightRegion(o), v = u.bisect(h, M), s = r.createHalfEdge(v, "l"), r.insert(o, s), d = u.intersect(o, s), d && (i.del(o), i.insert(o, d, u.distance(d, M))), o = s, s = r.createHalfEdge(v, "r"), r.insert(o, s), d = u.intersect(s, c), d && i.insert(s, d, u.distance(d, M)), M = e.list.shift();
            else { if (i.empty()) break;
                o = i.extractMin(), l = r.left(o), c = r.right(o), f = r.right(c), h = r.leftRegion(o), g = r.rightRegion(c), m = o.vertex, u.endPoint(o.edge, o.side, m), u.endPoint(c.edge, c.side, m), r.del(o), i.del(c), r.del(c), y = "l", h.y > g.y && (p = h, h = g, g = p, y = "r"), v = u.bisect(h, g), s = r.createHalfEdge(v, y), r.insert(l, s), u.endPoint(v, Po[y], m), d = u.intersect(l, s), d && (i.del(l), i.insert(l, d, u.distance(d, h))), d = u.intersect(s, f), d && i.insert(s, d, u.distance(d, h)) } for (o = r.right(r.leftEnd); o != r.rightEnd; o = r.right(o)) t(o.edge) }

    function ur(n) { return n.x }

    function ir(n) { return n.y }

    function ar() { return { leaf: !0, nodes: [], point: null, x: null, y: null } }

    function or(n, t, e, r, u, i) { if (!n(t, e, r, u, i)) { var a = .5 * (e + u),
                o = .5 * (r + i),
                c = t.nodes;
            c[0] && or(n, c[0], e, r, a, o), c[1] && or(n, c[1], a, r, u, o), c[2] && or(n, c[2], e, o, a, i), c[3] && or(n, c[3], a, o, u, i) } }

    function cr(n, t) { n = ca.rgb(n), t = ca.rgb(t); var e = n.r,
            r = n.g,
            u = n.b,
            i = t.r - e,
            a = t.g - r,
            o = t.b - u; return function(n) { return "#" + ut(Math.round(e + i * n)) + ut(Math.round(r + a * n)) + ut(Math.round(u + o * n)) } }

    function lr(n) { var t = [n.a, n.b],
            e = [n.c, n.d],
            r = sr(t),
            u = fr(t, e),
            i = sr(hr(e, t, -u)) || 0;
        t[0] * e[1] < e[0] * t[1] && (t[0] *= -1, t[1] *= -1, r *= -1, u *= -1), this.rotate = (r ? Math.atan2(t[1], t[0]) : Math.atan2(-e[0], e[1])) * Ra, this.translate = [n.e, n.f], this.scale = [r, i], this.skew = i ? Math.atan2(u, i) * Ra : 0 }

    function fr(n, t) { return n[0] * t[0] + n[1] * t[1] }

    function sr(n) { var t = Math.sqrt(fr(n, n)); return t && (n[0] /= t, n[1] /= t), t }

    function hr(n, t, e) { return n[0] += e * t[0], n[1] += e * t[1], n }

    function gr(n, t) { return t -= n = +n,
            function(e) { return n + t * e } }

    function pr(n, t) { var e, r = [],
            u = [],
            i = ca.transform(n),
            a = ca.transform(t),
            o = i.translate,
            c = a.translate,
            l = i.rotate,
            f = a.rotate,
            s = i.skew,
            h = a.skew,
            g = i.scale,
            p = a.scale; return o[0] != c[0] || o[1] != c[1] ? (r.push("translate(", null, ",", null, ")"), u.push({ i: 1, x: gr(o[0], c[0]) }, { i: 3, x: gr(o[1], c[1]) })) : c[0] || c[1] ? r.push("translate(" + c + ")") : r.push(""), l != f ? (l - f > 180 ? f += 360 : f - l > 180 && (l += 360), u.push({ i: r.push(r.pop() + "rotate(", null, ")") - 2, x: gr(l, f) })) : f && r.push(r.pop() + "rotate(" + f + ")"), s != h ? u.push({ i: r.push(r.pop() + "skewX(", null, ")") - 2, x: gr(s, h) }) : h && r.push(r.pop() + "skewX(" + h + ")"), g[0] != p[0] || g[1] != p[1] ? (e = r.push(r.pop() + "scale(", null, ",", null, ")"), u.push({ i: e - 4, x: gr(g[0], p[0]) }, { i: e - 2, x: gr(g[1], p[1]) })) : (p[0] != 1 || p[1] != 1) && r.push(r.pop() + "scale(" + p + ")"), e = u.length,
            function(n) { for (var t, i = -1; ++i < e;) r[(t = u[i]).i] = t.x(n); return r.join("") } }

    function dr(n, t) { var e, r = {},
            u = {}; for (e in n) e in t ? r[e] = yr(e)(n[e], t[e]) : u[e] = n[e]; for (e in t) e in n || (u[e] = t[e]); return function(n) { for (e in r) u[e] = r[e](n); return u } }

    function mr(n, t) { var e, r, u, i, a, o = 0,
            c = 0,
            l = [],
            f = []; for (n += "", t += "", Oo.lastIndex = 0, r = 0; e = Oo.exec(t); ++r) e.index && l.push(t.substring(o, c = e.index)), f.push({ i: l.length, x: e[0] }), l.push(null), o = Oo.lastIndex; for (o < t.length && l.push(t.substring(o)), r = 0, i = f.length;
            (e = Oo.exec(n)) && i > r; ++r)
            if (a = f[r], a.x == e[0]) { if (a.i)
                    if (l[a.i + 1] == null)
                        for (l[a.i - 1] += a.x, l.splice(a.i, 1), u = r + 1; i > u; ++u) f[u].i--;
                    else
                        for (l[a.i - 1] += a.x + l[a.i + 1], l.splice(a.i, 2), u = r + 1; i > u; ++u) f[u].i -= 2;
                else if (l[a.i + 1] == null) l[a.i] = a.x;
                else
                    for (l[a.i] = a.x + l[a.i + 1], l.splice(a.i + 1, 1), u = r + 1; i > u; ++u) f[u].i--;
                f.splice(r, 1), i--, r-- } else a.x = gr(parseFloat(e[0]), parseFloat(a.x)); for (; i > r;) a = f.pop(), l[a.i + 1] == null ? l[a.i] = a.x : (l[a.i] = a.x + l[a.i + 1], l.splice(a.i + 1, 1)), i--; return l.length === 1 ? l[0] == null ? f[0].x : function() { return t } : function(n) { for (r = 0; i > r; ++r) l[(a = f[r]).i] = a.x(n); return l.join("") } }

    function vr(n, t) { for (var e, r = ca.interpolators.length; --r >= 0 && !(e = ca.interpolators[r](n, t));); return e }

    function yr(n) { return "transform" == n ? pr : vr }

    function Mr(n, t) { var e, r = [],
            u = [],
            i = n.length,
            a = t.length,
            o = Math.min(n.length, t.length); for (e = 0; o > e; ++e) r.push(vr(n[e], t[e])); for (; i > e; ++e) u[e] = n[e]; for (; a > e; ++e) u[e] = t[e]; return function(n) { for (e = 0; o > e; ++e) u[e] = r[e](n); return u } }

    function xr(n) { return function(t) { return 0 >= t ? 0 : t >= 1 ? 1 : n(t) } }

    function br(n) { return function(t) { return 1 - n(1 - t) } }

    function _r(n) { return function(t) { return .5 * (.5 > t ? n(2 * t) : 2 - n(2 - 2 * t)) } }

    function wr(n) { return n * n }

    function Sr(n) { return n * n * n }

    function Er(n) { if (0 >= n) return 0; if (n >= 1) return 1; var t = n * n,
            e = t * n; return 4 * (.5 > n ? e : 3 * (n - t) + e - .75) }

    function kr(n) { return function(t) { return Math.pow(t, n) } }

    function Ar(n) { return 1 - Math.cos(n * Fa / 2) }

    function qr(n) { return Math.pow(2, 10 * (n - 1)) }

    function Nr(n) { return 1 - Math.sqrt(1 - n * n) }

    function Tr(n, t) { var e; return arguments.length < 2 && (t = .45), arguments.length ? e = t / (2 * Fa) * Math.asin(1 / n) : (n = 1, e = t / 4),
            function(r) { return 1 + n * Math.pow(2, 10 * -r) * Math.sin(2 * (r - e) * Fa / t) } }

    function Cr(n) { return n || (n = 1.70158),
            function(t) { return t * t * ((n + 1) * t - n) } }

    function zr(n) { return 1 / 2.75 > n ? 7.5625 * n * n : 2 / 2.75 > n ? 7.5625 * (n -= 1.5 / 2.75) * n + .75 : 2.5 / 2.75 > n ? 7.5625 * (n -= 2.25 / 2.75) * n + .9375 : 7.5625 * (n -= 2.625 / 2.75) * n + .984375 }

    function Dr(n, t) { n = ca.hcl(n), t = ca.hcl(t); var e = n.h,
            r = n.c,
            u = n.l,
            i = t.h - e,
            a = t.c - r,
            o = t.l - u; return i > 180 ? i -= 360 : -180 > i && (i += 360),
            function(n) { return $(e + i * n, r + a * n, u + o * n) + "" } }

    function jr(n, t) { n = ca.hsl(n), t = ca.hsl(t); var e = n.h,
            r = n.s,
            u = n.l,
            i = t.h - e,
            a = t.s - r,
            o = t.l - u; return i > 180 ? i -= 360 : -180 > i && (i += 360),
            function(n) { return R(e + i * n, r + a * n, u + o * n) + "" } }

    function Lr(n, t) { n = ca.lab(n), t = ca.lab(t); var e = n.l,
            r = n.a,
            u = n.b,
            i = t.l - e,
            a = t.a - r,
            o = t.b - u; return function(n) { return K(e + i * n, r + a * n, u + o * n) + "" } }

    function Fr(n, t) { return t -= n,
            function(e) { return Math.round(n + t * e) } }

    function Hr(n, t) { return t = t - (n = +n) ? 1 / (t - n) : 0,
            function(e) { return (e - n) * t } }

    function Pr(n, t) { return t = t - (n = +n) ? 1 / (t - n) : 0,
            function(e) { return Math.max(0, Math.min(1, (e - n) * t)) } }

    function Rr(n) { for (var t = n.source, e = n.target, r = Yr(t, e), u = [t]; t !== r;) t = t.parent, u.push(t); for (var i = u.length; e !== r;) u.splice(i, 0, e), e = e.parent; return u }

    function Or(n) { for (var t = [], e = n.parent; null != e;) t.push(n), n = e, e = e.parent; return t.push(n), t }

    function Yr(n, t) { if (n === t) return n; for (var e = Or(n), r = Or(t), u = e.pop(), i = r.pop(), a = null; u === i;) a = u, u = e.pop(), i = r.pop(); return a }

    function Ur(n) { n.fixed |= 2 }

    function Ir(n) { n.fixed &= -7 }

    function Vr(n) { n.fixed |= 4, n.px = n.x, n.py = n.y }

    function Xr(n) { n.fixed &= -5 }

    function Zr(n, t, e) { var r = 0,
            u = 0; if (n.charge = 0, !n.leaf)
            for (var i, a = n.nodes, o = a.length, c = -1; ++c < o;) i = a[c], null != i && (Zr(i, t, e), n.charge += i.charge, r += i.charge * i.cx, u += i.charge * i.cy); if (n.point) { n.leaf || (n.point.x += Math.random() - .5, n.point.y += Math.random() - .5); var l = t * e[n.point.index];
            n.charge += n.pointCharge = l, r += l * n.point.x, u += l * n.point.y } n.cx = r / n.charge, n.cy = u / n.charge }

    function Br(n, t) { return ca.rebind(n, t, "sort", "children", "value"), n.nodes = n, n.links = Kr, n }

    function $r(n) { return n.children }

    function Jr(n) { return n.value }

    function Gr(n, t) { return t.value - n.value }

    function Kr(n) { return ca.merge(n.map(function(n) { return (n.children || []).map(function(t) { return { source: n, target: t } }) })) }

    function Wr(n) { return n.x }

    function Qr(n) { return n.y }

    function nu(n, t, e) { n.y0 = t, n.y = e }

    function tu(n) { return ca.range(n.length) }

    function eu(n) { for (var t = -1, e = n[0].length, r = []; ++t < e;) r[t] = 0; return r }

    function ru(n) { for (var t, e = 1, r = 0, u = n[0][1], i = n.length; i > e; ++e)(t = n[e][1]) > u && (r = e, u = t); return r }

    function uu(n) { return n.reduce(iu, 0) }

    function iu(n, t) { return n + t[1] }

    function au(n, t) { return ou(n, Math.ceil(Math.log(t.length) / Math.LN2 + 1)) }

    function ou(n, t) { for (var e = -1, r = +n[0], u = (n[1] - r) / t, i = []; ++e <= t;) i[e] = u * e + r; return i }

    function cu(n) { return [ca.min(n), ca.max(n)] }

    function lu(n, t) { return n.parent == t.parent ? 1 : 2 }

    function fu(n) { var t = n.children; return t && t.length ? t[0] : n._tree.thread }

    function su(n) { var t, e = n.children; return e && (t = e.length) ? e[t - 1] : n._tree.thread }

    function hu(n, t) { var e = n.children; if (e && (u = e.length))
            for (var r, u, i = -1; ++i < u;) t(r = hu(e[i], t), n) > 0 && (n = r); return n }

    function gu(n, t) { return n.x - t.x }

    function pu(n, t) { return t.x - n.x }

    function du(n, t) { return n.depth - t.depth }

    function mu(n, t) {
        function e(n, r) { var u = n.children; if (u && (a = u.length))
                for (var i, a, o = null, c = -1; ++c < a;) i = u[c], e(i, o), o = i;
            t(n, r) } e(n, null) }

    function vu(n) { for (var t, e = 0, r = 0, u = n.children, i = u.length; --i >= 0;) t = u[i]._tree, t.prelim += e, t.mod += e, e += t.shift + (r += t.change) }

    function yu(n, t, e) { n = n._tree, t = t._tree; var r = e / (t.number - n.number);
        n.change += r, t.change -= r, t.shift += e, t.prelim += e, t.mod += e }

    function Mu(n, t, e) { return n._tree.ancestor.parent == t.parent ? n._tree.ancestor : e }

    function xu(n, t) { return n.value - t.value }

    function bu(n, t) { var e = n._pack_next;
        n._pack_next = t, t._pack_prev = n, t._pack_next = e, e._pack_prev = t }

    function _u(n, t) { n._pack_next = t, t._pack_prev = n }

    function wu(n, t) { var e = t.x - n.x,
            r = t.y - n.y,
            u = n.r + t.r; return u * u - e * e - r * r > .001 }

    function Su(n) {
        function t(n) { f = Math.min(n.x - n.r, f), s = Math.max(n.x + n.r, s), h = Math.min(n.y - n.r, h), g = Math.max(n.y + n.r, g) } if ((e = n.children) && (l = e.length)) { var e, r, u, i, a, o, c, l, f = 1 / 0,
                s = -1 / 0,
                h = 1 / 0,
                g = -1 / 0; if (e.forEach(Eu), r = e[0], r.x = -r.r, r.y = 0, t(r), l > 1 && (u = e[1], u.x = u.r, u.y = 0, t(u), l > 2))
                for (i = e[2], qu(r, u, i), t(i), bu(r, i), r._pack_prev = i, bu(i, u), u = r._pack_next, a = 3; l > a; a++) { qu(r, u, i = e[a]); var p = 0,
                        d = 1,
                        m = 1; for (o = u._pack_next; o !== u; o = o._pack_next, d++)
                        if (wu(o, i)) { p = 1; break } if (1 == p)
                        for (c = r._pack_prev; c !== o._pack_prev && !wu(c, i); c = c._pack_prev, m++);
                    p ? (m > d || d == m && u.r < r.r ? _u(r, u = o) : _u(r = c, u), a--) : (bu(r, i), u = i, t(i)) }
            var v = (f + s) / 2,
                y = (h + g) / 2,
                M = 0; for (a = 0; l > a; a++) i = e[a], i.x -= v, i.y -= y, M = Math.max(M, i.r + Math.sqrt(i.x * i.x + i.y * i.y));
            n.r = M, e.forEach(ku) } }

    function Eu(n) { n._pack_next = n._pack_prev = n }

    function ku(n) { delete n._pack_next, delete n._pack_prev }

    function Au(n, t, e, r) { var u = n.children; if (n.x = t += r * n.x, n.y = e += r * n.y, n.r *= r, u)
            for (var i = -1, a = u.length; ++i < a;) Au(u[i], t, e, r) }

    function qu(n, t, e) { var r = n.r + e.r,
            u = t.x - n.x,
            i = t.y - n.y; if (r && (u || i)) { var a = t.r + e.r,
                o = u * u + i * i;
            a *= a, r *= r; var c = .5 + (r - a) / (2 * o),
                l = Math.sqrt(Math.max(0, 2 * a * (r + o) - (r -= o) * r - a * a)) / (2 * o);
            e.x = n.x + c * u + l * i, e.y = n.y + c * i - l * u } else e.x = n.x + r, e.y = n.y }

    function Nu(n) { return 1 + ca.max(n, function(n) { return n.y }) }

    function Tu(n) { return n.reduce(function(n, t) { return n + t.x }, 0) / n.length }

    function Cu(n) { var t = n.children; return t && t.length ? Cu(t[0]) : n }

    function zu(n) { var t, e = n.children; return e && (t = e.length) ? zu(e[t - 1]) : n }

    function Du(n) { return { x: n.x, y: n.y, dx: n.dx, dy: n.dy } }

    function ju(n, t) { var e = n.x + t[3],
            r = n.y + t[0],
            u = n.dx - t[1] - t[3],
            i = n.dy - t[0] - t[2]; return 0 > u && (e += u / 2, u = 0), 0 > i && (r += i / 2, i = 0), { x: e, y: r, dx: u, dy: i } }

    function Lu(n) { var t = n[0],
            e = n[n.length - 1]; return e > t ? [t, e] : [e, t] }

    function Fu(n) { return n.rangeExtent ? n.rangeExtent() : Lu(n.range()) }

    function Hu(n, t, e, r) { var u = e(n[0], n[1]),
            i = r(t[0], t[1]); return function(n) { return i(u(n)) } }

    function Pu(n, t) { var e, r = 0,
            u = n.length - 1,
            i = n[r],
            a = n[u]; return i > a && (e = r, r = u, u = e, e = i, i = a, a = e), (t = t(a - i)) && (n[r] = t.floor(i), n[u] = t.ceil(a)), n }

    function Ru(n, t, e, r) { var u = [],
            i = [],
            a = 0,
            o = Math.min(n.length, t.length) - 1; for (n[o] < n[0] && (n = n.slice().reverse(), t = t.slice().reverse()); ++a <= o;) u.push(e(n[a - 1], n[a])), i.push(r(t[a - 1], t[a])); return function(t) { var e = ca.bisect(n, t, 1, o) - 1; return i[e](u[e](t)) } }

    function Ou(n, t, e, r) {
        function u() { var u = Math.min(n.length, t.length) > 2 ? Ru : Hu,
                c = r ? Pr : Hr; return a = u(n, t, c, e), o = u(t, n, c, vr), i }

        function i(n) { return a(n) } var a, o; return i.invert = function(n) { return o(n) }, i.domain = function(t) { return arguments.length ? (n = t.map(Number), u()) : n }, i.range = function(n) { return arguments.length ? (t = n, u()) : t }, i.rangeRound = function(n) { return i.range(n).interpolate(Fr) }, i.clamp = function(n) { return arguments.length ? (r = n, u()) : r }, i.interpolate = function(n) { return arguments.length ? (e = n, u()) : e }, i.ticks = function(t) { return Vu(n, t) }, i.tickFormat = function(t, e) { return Xu(n, t, e) }, i.nice = function() { return Pu(n, Uu), u() }, i.copy = function() { return Ou(n, t, e, r) }, u() }

    function Yu(n, t) { return ca.rebind(n, t, "range", "rangeRound", "interpolate", "clamp") }

    function Uu(n) { return n = Math.pow(10, Math.round(Math.log(n) / Math.LN10) - 1), n && { floor: function(t) { return Math.floor(t / n) * n }, ceil: function(t) { return Math.ceil(t / n) * n } } }

    function Iu(n, t) { var e = Lu(n),
            r = e[1] - e[0],
            u = Math.pow(10, Math.floor(Math.log(r / t) / Math.LN10)),
            i = t / r * u; return .15 >= i ? u *= 10 : .35 >= i ? u *= 5 : .75 >= i && (u *= 2), e[0] = Math.ceil(e[0] / u) * u, e[1] = Math.floor(e[1] / u) * u + .5 * u, e[2] = u, e }

    function Vu(n, t) { return ca.range.apply(ca, Iu(n, t)) }

    function Xu(n, t, e) { var r = -Math.floor(Math.log(Iu(n, t)[2]) / Math.LN10 + .01); return ca.format(e ? e.replace(uo, function(n, t, e, u, i, a, o, c, l, f) { return [t, e, u, i, a, o, c, l || "." + (r - 2 * ("%" === f)), f].join("") }) : ",." + r + "f") }

    function Zu(n, t, e, r) {
        function u(t) { return n(e(t)) } return u.invert = function(t) { return r(n.invert(t)) }, u.domain = function(t) { return arguments.length ? (t[0] < 0 ? (e = Ju, r = Gu) : (e = Bu, r = $u), n.domain(t.map(e)), u) : n.domain().map(r) }, u.base = function(n) { return arguments.length ? (t = +n, u) : t }, u.nice = function() { return n.domain(Pu(n.domain(), Ku(t))), u }, u.ticks = function() { var u = Lu(n.domain()),
                i = []; if (u.every(isFinite)) { var a = Math.log(t),
                    o = Math.floor(u[0] / a),
                    c = Math.ceil(u[1] / a),
                    l = r(u[0]),
                    f = r(u[1]),
                    s = t % 1 ? 2 : t; if (e === Ju)
                    for (i.push(-Math.pow(t, -o)); o++ < c;)
                        for (var h = s - 1; h > 0; h--) i.push(-Math.pow(t, -o) * h);
                else { for (; c > o; o++)
                        for (var h = 1; s > h; h++) i.push(Math.pow(t, o) * h);
                    i.push(Math.pow(t, o)) } for (o = 0; i[o] < l; o++); for (c = i.length; i[c - 1] > f; c--);
                i = i.slice(o, c) } return i }, u.tickFormat = function(n, i) { if (arguments.length < 2 && (i = Jo), !arguments.length) return i; var a, o = Math.log(t),
                c = Math.max(.1, n / u.ticks().length),
                l = e === Ju ? (a = -1e-12, Math.floor) : (a = 1e-12, Math.ceil); return function(n) { return n / r(o * l(e(n) / o + a)) <= c ? i(n) : "" } }, u.copy = function() { return Zu(n.copy(), t, e, r) }, Yu(u, n) }

    function Bu(n) { return Math.log(0 > n ? 0 : n) }

    function $u(n) { return Math.exp(n) }

    function Ju(n) { return -Math.log(n > 0 ? 0 : -n) }

    function Gu(n) { return -Math.exp(-n) }

    function Ku(n) { n = Math.log(n); var t = { floor: function(t) { return Math.floor(t / n) * n }, ceil: function(t) { return Math.ceil(t / n) * n } }; return function() { return t } }

    function Wu(n, t) {
        function e(t) { return n(r(t)) } var r = Qu(t),
            u = Qu(1 / t); return e.invert = function(t) { return u(n.invert(t)) }, e.domain = function(t) { return arguments.length ? (n.domain(t.map(r)), e) : n.domain().map(u) }, e.ticks = function(n) { return Vu(e.domain(), n) }, e.tickFormat = function(n, t) { return Xu(e.domain(), n, t) }, e.nice = function() { return e.domain(Pu(e.domain(), Uu)) }, e.exponent = function(n) { if (!arguments.length) return t; var i = e.domain(); return r = Qu(t = n), u = Qu(1 / t), e.domain(i) }, e.copy = function() { return Wu(n.copy(), t) }, Yu(e, n) }

    function Qu(n) { return function(t) { return 0 > t ? -Math.pow(-t, n) : Math.pow(t, n) } }

    function ni(n, t) {
        function e(t) { return a[((i.get(t) || i.set(t, n.push(t))) - 1) % a.length] }

        function r(t, e) { return ca.range(n.length).map(function(n) { return t + e * n }) } var i, a, o; return e.domain = function(r) { if (!arguments.length) return n;
            n = [], i = new u; for (var a, o = -1, c = r.length; ++o < c;) i.has(a = r[o]) || i.set(a, n.push(a)); return e[t.t].apply(e, t.a) }, e.range = function(n) { return arguments.length ? (a = n, o = 0, t = { t: "range", a: arguments }, e) : a }, e.rangePoints = function(u, i) { arguments.length < 2 && (i = 0); var c = u[0],
                l = u[1],
                f = (l - c) / (Math.max(1, n.length - 1) + i); return a = r(n.length < 2 ? (c + l) / 2 : c + f * i / 2, f), o = 0, t = { t: "rangePoints", a: arguments }, e }, e.rangeBands = function(u, i, c) { arguments.length < 2 && (i = 0), arguments.length < 3 && (c = i); var l = u[1] < u[0],
                f = u[l - 0],
                s = u[1 - l],
                h = (s - f) / (n.length - i + 2 * c); return a = r(f + h * c, h), l && a.reverse(), o = h * (1 - i), t = { t: "rangeBands", a: arguments }, e }, e.rangeRoundBands = function(u, i, c) { arguments.length < 2 && (i = 0), arguments.length < 3 && (c = i); var l = u[1] < u[0],
                f = u[l - 0],
                s = u[1 - l],
                h = Math.floor((s - f) / (n.length - i + 2 * c)),
                g = s - f - (n.length - i) * h; return a = r(f + Math.round(g / 2), h), l && a.reverse(), o = Math.round(h * (1 - i)), t = { t: "rangeRoundBands", a: arguments }, e }, e.rangeBand = function() { return o }, e.rangeExtent = function() { return Lu(t.a[0]) }, e.copy = function() { return ni(n, t) }, e.domain(n) }

    function ti(n, t) {
        function e() { var e = 0,
                i = t.length; for (u = []; ++e < i;) u[e - 1] = ca.quantile(n, e / i); return r }

        function r(n) { return isNaN(n = +n) ? 0 / 0 : t[ca.bisect(u, n)] } var u; return r.domain = function(t) { return arguments.length ? (n = t.filter(function(n) { return !isNaN(n) }).sort(ca.ascending), e()) : n }, r.range = function(n) { return arguments.length ? (t = n, e()) : t }, r.quantiles = function() { return u }, r.copy = function() { return ti(n, t) }, e() }

    function ei(n, t, e) {
        function r(t) { return e[Math.max(0, Math.min(a, Math.floor(i * (t - n))))] }

        function u() { return i = e.length / (t - n), a = e.length - 1, r } var i, a; return r.domain = function(e) { return arguments.length ? (n = +e[0], t = +e[e.length - 1], u()) : [n, t] }, r.range = function(n) { return arguments.length ? (e = n, u()) : e }, r.copy = function() { return ei(n, t, e) }, u() }

    function ri(n, t) {
        function e(e) { return t[ca.bisect(n, e)] } return e.domain = function(t) { return arguments.length ? (n = t, e) : n }, e.range = function(n) { return arguments.length ? (t = n, e) : t }, e.copy = function() { return ri(n, t) }, e }

    function ui(n) {
        function t(n) { return +n } return t.invert = t, t.domain = t.range = function(e) { return arguments.length ? (n = e.map(t), t) : n }, t.ticks = function(t) { return Vu(n, t) }, t.tickFormat = function(t, e) { return Xu(n, t, e) }, t.copy = function() { return ui(n) }, t }

    function ii(n) { return n.innerRadius }

    function ai(n) { return n.outerRadius }

    function oi(n) { return n.startAngle }

    function ci(n) { return n.endAngle }

    function li(n) { for (var t, e, r, u = -1, i = n.length; ++u < i;) t = n[u], e = t[0], r = t[1] + nc, t[0] = e * Math.cos(r), t[1] = e * Math.sin(r); return n }

    function fi(n) {
        function t(t) {
            function c() { d.push("M", o(n(v), s), f, l(n(m.reverse()), s), "Z") } for (var h, g, p, d = [], m = [], v = [], y = -1, M = t.length, x = ft(e), b = ft(u), _ = e === r ? function() { return g } : ft(r), w = u === i ? function() { return p } : ft(i); ++y < M;) a.call(this, h = t[y], y) ? (m.push([g = +x.call(this, h, y), p = +b.call(this, h, y)]), v.push([+_.call(this, h, y), +w.call(this, h, y)])) : m.length && (c(), m = [], v = []); return m.length && c(), d.length ? d.join("") : null } var e = De,
            r = De,
            u = 0,
            i = je,
            a = jt,
            o = Le,
            c = o.key,
            l = o,
            f = "L",
            s = .7; return t.x = function(n) { return arguments.length ? (e = r = n, t) : r }, t.x0 = function(n) { return arguments.length ? (e = n, t) : e }, t.x1 = function(n) { return arguments.length ? (r = n, t) : r }, t.y = function(n) { return arguments.length ? (u = i = n, t) : i }, t.y0 = function(n) { return arguments.length ? (u = n, t) : u }, t.y1 = function(n) { return arguments.length ? (i = n, t) : i }, t.defined = function(n) { return arguments.length ? (a = n, t) : a }, t.interpolate = function(n) { return arguments.length ? (c = "function" == typeof n ? o = n : (o = jo.get(n) || Le).key, l = o.reverse || o, f = o.closed ? "M" : "L", t) : c }, t.tension = function(n) { return arguments.length ? (s = n, t) : s }, t }

    function si(n) { return n.radius }

    function hi(n) { return [n.x, n.y] }

    function gi(n) { return function() { var t = n.apply(this, arguments),
                e = t[0],
                r = t[1] + nc; return [e * Math.cos(r), e * Math.sin(r)] } }

    function pi() { return 64 }

    function di() { return "circle" }

    function mi(n) { var t = Math.sqrt(n / Fa); return "M0," + t + "A" + t + "," + t + " 0 1,1 0," + -t + "A" + t + "," + t + " 0 1,1 0," + t + "Z" }

    function vi(n, t) { return xa(n, ac), n.id = t, n }

    function yi(n, t, e, r) { var u = n.id; return j(n, "function" == typeof e ? function(n, i, a) { n.__transition__[u].tween.set(t, r(e.call(n, n.__data__, i, a))) } : (e = r(e), function(n) { n.__transition__[u].tween.set(t, e) })) }

    function Mi(n) { return null == n && (n = ""),
            function() { this.textContent = n } }

    function xi(n, t, e, r) { var i = n.__transition__ || (n.__transition__ = { active: 0, count: 0 }),
            a = i[e]; if (!a) { var o = r.time; return a = i[e] = { tween: new u, event: ca.dispatch("start", "end"), time: o, ease: r.ease, delay: r.delay, duration: r.duration }, ++i.count, ca.timer(function(r) {
                function u(r) { return i.active > e ? l() : (i.active = e, h.start.call(n, f, t), a.tween.forEach(function(e, r) {
                        (r = r.call(n, f, t)) && d.push(r) }), c(r) || ca.timer(c, 0, o), 1) }

                function c(r) { if (i.active !== e) return l(); for (var u = (r - g) / p, a = s(u), o = d.length; o > 0;) d[--o].call(n, a); return u >= 1 ? (l(), h.end.call(n, f, t), 1) : void 0 }

                function l() { return --i.count ? delete i[e] : delete n.__transition__, 1 } var f = n.__data__,
                    s = a.ease,
                    h = a.event,
                    g = a.delay,
                    p = a.duration,
                    d = []; return r >= g ? u(r) : ca.timer(u, g, o), 1 }, 0, o), a } }

    function bi(n, t) { n.attr("transform", function(n) { return "translate(" + t(n) + ",0)" }) }

    function _i(n, t) { n.attr("transform", function(n) { return "translate(0," + t(n) + ")" }) }

    function wi(n, t, e) { if (r = [], e && t.length > 1) { for (var r, u, i, a = Lu(n.domain()), o = -1, c = t.length, l = (t[1] - t[0]) / ++e; ++o < c;)
                for (u = e; --u > 0;)(i = +t[o] - u * l) >= a[0] && r.push(i); for (--o, u = 0; ++u < e && (i = +t[o] + u * l) < a[1];) r.push(i) } return r }

    function Si() { this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]) }

    function Ei(n, t, e) {
        function r(t) { var e = n(t),
                r = i(e, 1); return r - t > t - e ? e : r }

        function u(e) { return t(e = n(new gc(e - 1)), 1), e }

        function i(n, e) { return t(n = new gc(+n), e), n }

        function a(n, r, i) { var a = u(n),
                o = []; if (i > 1)
                for (; r > a;) e(a) % i || o.push(new Date(+a)), t(a, 1);
            else
                for (; r > a;) o.push(new Date(+a)), t(a, 1); return o }

        function o(n, t, e) { try { gc = Si; var r = new Si; return r._ = n, a(r, t, e) } finally { gc = Date } } n.floor = n, n.round = r, n.ceil = u, n.offset = i, n.range = a; var c = n.utc = ki(n); return c.floor = c, c.round = ki(r), c.ceil = ki(u), c.offset = ki(i), c.range = o, n }

    function ki(n) { return function(t, e) { try { gc = Si; var r = new Si; return r._ = t, n(r, e)._ } finally { gc = Date } } }

    function Ai(n, t, e, r) { for (var u, i, a = 0, o = t.length, c = e.length; o > a;) { if (r >= c) return -1; if (u = t.charCodeAt(a++), 37 === u) { if (i = Cc[t.charAt(a++)], !i || (r = i(n, e, r)) < 0) return -1 } else if (u != e.charCodeAt(r++)) return -1 } return r }

    function qi(n) { return RegExp("^(?:" + n.map(ca.requote).join("|") + ")", "i") }

    function Ni(n) { for (var t = new u, e = -1, r = n.length; ++e < r;) t.set(n[e].toLowerCase(), e); return t }

    function Ti(n, t, e) { n += ""; var r = n.length; return e > r ? Array(e - r + 1).join(t) + n : n }

    function Ci(n, t, e) { Sc.lastIndex = 0; var r = Sc.exec(t.substring(e)); return r ? e += r[0].length : -1 }

    function zi(n, t, e) { wc.lastIndex = 0; var r = wc.exec(t.substring(e)); return r ? e += r[0].length : -1 }

    function Di(n, t, e) { Ac.lastIndex = 0; var r = Ac.exec(t.substring(e)); return r ? (n.m = qc.get(r[0].toLowerCase()), e += r[0].length) : -1 }

    function ji(n, t, e) { Ec.lastIndex = 0; var r = Ec.exec(t.substring(e)); return r ? (n.m = kc.get(r[0].toLowerCase()), e += r[0].length) : -1 }

    function Li(n, t, e) { return Ai(n, "" + Tc.c, t, e) }

    function Fi(n, t, e) { return Ai(n, "" + Tc.x, t, e) }

    function Hi(n, t, e) { return Ai(n, "" + Tc.X, t, e) }

    function Pi(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 4)); return r ? (n.y = +r[0], e += r[0].length) : -1 }

    function Ri(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.y = Oi(+r[0]), e += r[0].length) : -1 }

    function Oi(n) { return n + (n > 68 ? 1900 : 2e3) }

    function Yi(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.m = r[0] - 1, e += r[0].length) : -1 }

    function Ui(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.d = +r[0], e += r[0].length) : -1 }

    function Ii(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.H = +r[0], e += r[0].length) : -1 }

    function Vi(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.M = +r[0], e += r[0].length) : -1 }

    function Xi(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 2)); return r ? (n.S = +r[0], e += r[0].length) : -1 }

    function Zi(n, t, e) { zc.lastIndex = 0; var r = zc.exec(t.substring(e, e + 3)); return r ? (n.L = +r[0], e += r[0].length) : -1 }

    function Bi(n, t, e) { var r = Dc.get(t.substring(e, e += 2).toLowerCase()); return null == r ? -1 : (n.p = r, e) }

    function $i(n) { var t = n.getTimezoneOffset(),
            e = t > 0 ? "-" : "+",
            r = ~~(Math.abs(t) / 60),
            u = Math.abs(t) % 60; return e + Ti(r, "0", 2) + Ti(u, "0", 2) }

    function Ji(n) { return n.toISOString() }

    function Gi(n, t, e) {
        function r(t) { return n(t) } return r.invert = function(t) { return Wi(n.invert(t)) }, r.domain = function(t) { return arguments.length ? (n.domain(t), r) : n.domain().map(Wi) }, r.nice = function(n) { return r.domain(Pu(r.domain(), function() { return n })) }, r.ticks = function(e, u) { var i = Ki(r.domain()); if ("function" != typeof e) { var a = i[1] - i[0],
                    o = a / e,
                    c = ca.bisect(Lc, o); if (c == Lc.length) return t.year(i, e); if (!c) return n.ticks(e).map(Wi);
                Math.log(o / Lc[c - 1]) < Math.log(Lc[c] / o) && --c, e = t[c], u = e[1], e = e[0].range } return e(i[0], new Date(+i[1] + 1), u) }, r.tickFormat = function() { return e }, r.copy = function() { return Gi(n.copy(), t, e) }, ca.rebind(r, n, "range", "rangeRound", "interpolate", "clamp") }

    function Ki(n) { var t = n[0],
            e = n[n.length - 1]; return e > t ? [t, e] : [e, t] }

    function Wi(n) { return new Date(n) }

    function Qi(n) { return function(t) { for (var e = n.length - 1, r = n[e]; !r[1](t);) r = n[--e]; return r[0](t) } }

    function na(n) { var t = new Date(n, 0, 1); return t.setFullYear(n), t }

    function ta(n) { var t = n.getFullYear(),
            e = na(t),
            r = na(t + 1); return t + (n - e) / (r - e) }

    function ea(n) { var t = new Date(Date.UTC(n, 0, 1)); return t.setUTCFullYear(n), t }

    function ra(n) { var t = n.getUTCFullYear(),
            e = ea(t),
            r = ea(t + 1); return t + (n - e) / (r - e) }

    function ua(n) { return n.responseText }

    function ia(n) { return JSON.parse(n.responseText) }

    function aa(n) { var t = la.createRange(); return t.selectNode(la.body), t.createContextualFragment(n.responseText) }

    function oa(n) { return n.responseXML }
    var ca = { version: "3.1.5" };
    Date.now || (Date.now = function() { return +new Date });
    var la = document,
        fa = window;
    try { la.createElement("div").style.setProperty("opacity", 0, "") } catch (sa) { var ha = fa.CSSStyleDeclaration.prototype,
            ga = ha.setProperty;
        ha.setProperty = function(n, t, e) { ga.call(this, n, t + "", e) } } ca.ascending = function(n, t) { return t > n ? -1 : n > t ? 1 : n >= t ? 0 : 0 / 0 }, ca.descending = function(n, t) { return n > t ? -1 : t > n ? 1 : t >= n ? 0 : 0 / 0 }, ca.min = function(n, t) { var e, r, u = -1,
            i = n.length; if (arguments.length === 1) { for (; ++u < i && ((e = n[u]) == null || e != e);) e = void 0; for (; ++u < i;)(r = n[u]) != null && e > r && (e = r) } else { for (; ++u < i && ((e = t.call(n, n[u], u)) == null || e != e);) e = void 0; for (; ++u < i;)(r = t.call(n, n[u], u)) != null && e > r && (e = r) } return e }, ca.max = function(n, t) { var e, r, u = -1,
            i = n.length; if (arguments.length === 1) { for (; ++u < i && ((e = n[u]) == null || e != e);) e = void 0; for (; ++u < i;)(r = n[u]) != null && r > e && (e = r) } else { for (; ++u < i && ((e = t.call(n, n[u], u)) == null || e != e);) e = void 0; for (; ++u < i;)(r = t.call(n, n[u], u)) != null && r > e && (e = r) } return e }, ca.extent = function(n, t) { var e, r, u, i = -1,
            a = n.length; if (arguments.length === 1) { for (; ++i < a && ((e = u = n[i]) == null || e != e);) e = u = void 0; for (; ++i < a;)(r = n[i]) != null && (e > r && (e = r), r > u && (u = r)) } else { for (; ++i < a && ((e = u = t.call(n, n[i], i)) == null || e != e);) e = void 0; for (; ++i < a;)(r = t.call(n, n[i], i)) != null && (e > r && (e = r), r > u && (u = r)) } return [e, u] }, ca.sum = function(n, t) { var e, r = 0,
            u = n.length,
            i = -1; if (arguments.length === 1)
            for (; ++i < u;) isNaN(e = +n[i]) || (r += e);
        else
            for (; ++i < u;) isNaN(e = +t.call(n, n[i], i)) || (r += e); return r }, ca.mean = function(t, e) { var r, u = t.length,
            i = 0,
            a = -1,
            o = 0; if (arguments.length === 1)
            for (; ++a < u;) n(r = t[a]) && (i += (r - i) / ++o);
        else
            for (; ++a < u;) n(r = e.call(t, t[a], a)) && (i += (r - i) / ++o); return o ? i : void 0 }, ca.quantile = function(n, t) { var e = (n.length - 1) * t + 1,
            r = Math.floor(e),
            u = +n[r - 1],
            i = e - r; return i ? u + i * (n[r] - u) : u }, ca.median = function(t, e) { return arguments.length > 1 && (t = t.map(e)), t = t.filter(n), t.length ? ca.quantile(t.sort(ca.ascending), .5) : void 0 }, ca.bisector = function(n) { return { left: function(t, e, r, u) { for (arguments.length < 3 && (r = 0), arguments.length < 4 && (u = t.length); u > r;) { var i = r + u >>> 1;
                    n.call(t, t[i], i) < e ? r = i + 1 : u = i } return r }, right: function(t, e, r, u) { for (arguments.length < 3 && (r = 0), arguments.length < 4 && (u = t.length); u > r;) { var i = r + u >>> 1;
                    e < n.call(t, t[i], i) ? u = i : r = i + 1 } return r } } };
    var pa = ca.bisector(function(n) { return n });
    ca.bisectLeft = pa.left, ca.bisect = ca.bisectRight = pa.right, ca.shuffle = function(n) { for (var t, e, r = n.length; r;) e = Math.random() * r-- | 0, t = n[r], n[r] = n[e], n[e] = t; return n }, ca.permute = function(n, t) { for (var e = [], r = -1, u = t.length; ++r < u;) e[r] = n[t[r]]; return e }, ca.zip = function() { if (!(u = arguments.length)) return []; for (var n = -1, e = ca.min(arguments, t), r = Array(e); ++n < e;)
            for (var u, i = -1, a = r[n] = Array(u); ++i < u;) a[i] = arguments[i][n]; return r }, ca.transpose = function(n) { return ca.zip.apply(ca, n) }, ca.keys = function(n) { var t = []; for (var e in n) t.push(e); return t }, ca.values = function(n) { var t = []; for (var e in n) t.push(n[e]); return t }, ca.entries = function(n) { var t = []; for (var e in n) t.push({ key: e, value: n[e] }); return t }, ca.merge = function(n) { return Array.prototype.concat.apply([], n) }, ca.range = function(n, t, r) { if (arguments.length < 3 && (r = 1, arguments.length < 2 && (t = n, n = 0)), 1 / 0 === (t - n) / r) throw Error("infinite range"); var u, i = [],
            a = e(Math.abs(r)),
            o = -1; if (n *= a, t *= a, r *= a, 0 > r)
            for (;
                (u = n + r * ++o) > t;) i.push(u / a);
        else
            for (;
                (u = n + r * ++o) < t;) i.push(u / a); return i }, ca.map = function(n) { var t = new u; for (var e in n) t.set(e, n[e]); return t }, r(u, { has: function(n) { return da + n in this }, get: function(n) { return this[da + n] }, set: function(n, t) { return this[da + n] = t }, remove: function(n) { return n = da + n, n in this && delete this[n] }, keys: function() { var n = []; return this.forEach(function(t) { n.push(t) }), n }, values: function() { var n = []; return this.forEach(function(t, e) { n.push(e) }), n }, entries: function() { var n = []; return this.forEach(function(t, e) { n.push({ key: t, value: e }) }), n }, forEach: function(n) { for (var t in this) t.charCodeAt(0) === ma && n.call(this, t.substring(1), this[t]) } });
    var da = "\0",
        ma = da.charCodeAt(0);
    ca.nest = function() {
        function n(t, o, c) { if (c >= a.length) return r ? r.call(i, o) : e ? o.sort(e) : o; for (var l, f, s, h, g = -1, p = o.length, d = a[c++], m = new u; ++g < p;)(h = m.get(l = d(f = o[g]))) ? h.push(f) : m.set(l, [f]); return t ? (f = t(), s = function(e, r) { f.set(e, n(t, r, c)) }) : (f = {}, s = function(e, r) { f[e] = n(t, r, c) }), m.forEach(s), f }

        function t(n, e) { if (e >= a.length) return n; var r = [],
                u = o[e++]; return n.forEach(function(n, u) { r.push({ key: n, values: t(u, e) }) }), u ? r.sort(function(n, t) { return u(n.key, t.key) }) : r } var e, r, i = {},
            a = [],
            o = []; return i.map = function(t, e) { return n(e, t, 0) }, i.entries = function(e) { return t(n(ca.map, e, 0), 0) }, i.key = function(n) { return a.push(n), i }, i.sortKeys = function(n) { return o[a.length - 1] = n, i }, i.sortValues = function(n) { return e = n, i }, i.rollup = function(n) { return r = n, i }, i }, ca.set = function(n) { var t = new i; if (n)
            for (var e = 0; e < n.length; e++) t.add(n[e]); return t }, r(i, { has: function(n) { return da + n in this }, add: function(n) { return this[da + n] = !0, n }, remove: function(n) { return n = da + n, n in this && delete this[n] }, values: function() { var n = []; return this.forEach(function(t) { n.push(t) }), n }, forEach: function(n) { for (var t in this) t.charCodeAt(0) === ma && n.call(this, t.substring(1)) } }), ca.behavior = {}, ca.rebind = function(n, t) { for (var e, r = 1, u = arguments.length; ++r < u;) n[e = arguments[r]] = a(n, t, t[e]); return n }, ca.dispatch = function() { for (var n = new o, t = -1, e = arguments.length; ++t < e;) n[arguments[t]] = c(n); return n }, o.prototype.on = function(n, t) { var e = n.indexOf("."),
            r = ""; if (e >= 0 && (r = n.substring(e + 1), n = n.substring(0, e)), n) return arguments.length < 2 ? this[n].on(r) : this[n].on(r, t); if (arguments.length === 2) { if (null == t)
                for (n in this) this.hasOwnProperty(n) && this[n].on(r, null); return this } }, ca.event = null, ca.mouse = function(n) { return g(n, f()) };
    var va = /WebKit/.test(fa.navigator.userAgent) ? -1 : 0,
        ya = d;
    try { ya(la.documentElement.childNodes)[0].nodeType } catch (Ma) { ya = p }
    var xa = [].__proto__ ? function(n, t) { n.__proto__ = t } : function(n, t) { for (var e in t) n[e] = t[e] };
    ca.touches = function(n, t) { return arguments.length < 2 && (t = f().touches), t ? ya(t).map(function(t) { var e = g(n, t); return e.identifier = t.identifier, e }) : [] }, ca.behavior.drag = function() {
        function n() { this.on("mousedown.drag", t).on("touchstart.drag", t) }

        function t() {
            function n() { var n = a.parentNode; return null != f ? ca.touches(n).filter(function(n) { return n.identifier === f })[0] : ca.mouse(n) }

            function t() { if (!a.parentNode) return u(); var t = n(),
                    e = t[0] - h[0],
                    r = t[1] - h[1];
                g |= e | r, h = t, l(), o({ type: "drag", x: t[0] + i[0], y: t[1] + i[1], dx: e, dy: r }) }

            function u() { o({ type: "dragend" }), g && (l(), ca.event.target === c && s(p, "click")), p.on(null != f ? "touchmove.drag-" + f : "mousemove.drag", null).on(null != f ? "touchend.drag-" + f : "mouseup.drag", null) } var i, a = this,
                o = e.of(a, arguments),
                c = ca.event.target,
                f = ca.event.touches ? ca.event.changedTouches[0].identifier : null,
                h = n(),
                g = 0,
                p = ca.select(fa).on(null != f ? "touchmove.drag-" + f : "mousemove.drag", t).on(null != f ? "touchend.drag-" + f : "mouseup.drag", u, !0);
            r ? (i = r.apply(a, arguments), i = [i.x - h[0], i.y - h[1]]) : i = [0, 0], null == f && l(), o({ type: "dragstart" }) } var e = h(n, "drag", "dragstart", "dragend"),
            r = null; return n.origin = function(t) { return arguments.length ? (r = t, n) : r }, ca.rebind(n, e, "on") };
    var ba = function(n, t) { return t.querySelector(n) },
        _a = function(n, t) { return t.querySelectorAll(n) },
        wa = la.documentElement,
        Sa = wa.matchesSelector || wa.webkitMatchesSelector || wa.mozMatchesSelector || wa.msMatchesSelector || wa.oMatchesSelector,
        Ea = function(n, t) { return Sa.call(n, t) };
    "function" == typeof Sizzle && (ba = function(n, t) { return Sizzle(n, t)[0] || null }, _a = function(n, t) { return Sizzle.uniqueSort(Sizzle(n, t)) }, Ea = Sizzle.matchesSelector);
    var ka = [];
    ca.selection = function() { return Ca }, ca.selection.prototype = ka, ka.select = function(n) { var t, e, r, u, i = []; "function" != typeof n && (n = v(n)); for (var a = -1, o = this.length; ++a < o;) { i.push(t = []), t.parentNode = (r = this[a]).parentNode; for (var c = -1, l = r.length; ++c < l;)(u = r[c]) ? (t.push(e = n.call(u, u.__data__, c)), e && "__data__" in u && (e.__data__ = u.__data__)) : t.push(null) } return m(i) }, ka.selectAll = function(n) { var t, e, r = []; "function" != typeof n && (n = y(n)); for (var u = -1, i = this.length; ++u < i;)
            for (var a = this[u], o = -1, c = a.length; ++o < c;)(e = a[o]) && (r.push(t = ya(n.call(e, e.__data__, o))), t.parentNode = e); return m(r) };
    var Aa = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/" };
    ca.ns = { prefix: Aa, qualify: function(n) { var t = n.indexOf(":"),
                e = n; return t >= 0 && (e = n.substring(0, t), n = n.substring(t + 1)), Aa.hasOwnProperty(e) ? { space: Aa[e], local: n } : n } }, ka.attr = function(n, t) { if (arguments.length < 2) { if ("string" == typeof n) { var e = this.node(); return n = ca.ns.qualify(n), n.local ? e.getAttributeNS(n.space, n.local) : e.getAttribute(n) } for (t in n) this.each(M(t, n[t])); return this } return this.each(M(n, t)) }, ca.requote = function(n) { return n.replace(qa, "\\$&") };
    var qa = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
    ka.classed = function(n, t) { if (arguments.length < 2) { if ("string" == typeof n) { var e = this.node(),
                    r = (n = n.trim().split(/^|\s+/g)).length,
                    u = -1; if (t = e.classList) { for (; ++u < r;)
                        if (!t.contains(n[u])) return !1 } else
                    for (t = e.getAttribute("class"); ++u < r;)
                        if (!_(n[u]).test(t)) return !1; return !0 } for (t in n) this.each(w(t, n[t])); return this } return this.each(w(n, t)) }, ka.style = function(n, t, e) { var r = arguments.length; if (3 > r) { if ("string" != typeof n) { 2 > r && (t = ""); for (e in n) this.each(E(e, n[e], t)); return this } if (2 > r) return fa.getComputedStyle(this.node(), null).getPropertyValue(n);
            e = "" } return this.each(E(n, t, e)) }, ka.property = function(n, t) { if (arguments.length < 2) { if ("string" == typeof n) return this.node()[n]; for (t in n) this.each(k(t, n[t])); return this } return this.each(k(n, t)) }, ka.text = function(n) { return arguments.length ? this.each("function" == typeof n ? function() { var t = n.apply(this, arguments);
            this.textContent = null == t ? "" : t } : null == n ? function() { this.textContent = "" } : function() { this.textContent = n }) : this.node().textContent }, ka.html = function(n) { return arguments.length ? this.each("function" == typeof n ? function() { var t = n.apply(this, arguments);
            this.innerHTML = null == t ? "" : t } : null == n ? function() { this.innerHTML = "" } : function() { this.innerHTML = n }) : this.node().innerHTML }, ka.append = function(n) {
        function t() { return this.appendChild(la.createElementNS(this.namespaceURI, n)) }

        function e() { return this.appendChild(la.createElementNS(n.space, n.local)) } return n = ca.ns.qualify(n), this.select(n.local ? e : t) }, ka.insert = function(n, t) {
        function e(e, r) { return this.insertBefore(la.createElementNS(this.namespaceURI, n), t.call(this, e, r)) }

        function r(e, r) { return this.insertBefore(la.createElementNS(n.space, n.local), t.call(this, e, r)) } return n = ca.ns.qualify(n), "function" != typeof t && (t = v(t)), this.select(n.local ? r : e) }, ka.remove = function() { return this.each(function() { var n = this.parentNode;
            n && n.removeChild(this) }) }, ka.data = function(n, t) {
        function e(n, e) { var r, i, a, o = n.length,
                s = e.length,
                h = Math.min(o, s),
                g = Array(s),
                p = Array(s),
                d = Array(o); if (t) { var m, v = new u,
                    y = new u,
                    M = []; for (r = -1; ++r < o;) m = t.call(i = n[r], i.__data__, r), v.has(m) ? d[r] = i : v.set(m, i), M.push(m); for (r = -1; ++r < s;) m = t.call(e, a = e[r], r), (i = v.get(m)) ? (g[r] = i, i.__data__ = a) : y.has(m) || (p[r] = A(a)), y.set(m, a), v.remove(m); for (r = -1; ++r < o;) v.has(M[r]) && (d[r] = n[r]) } else { for (r = -1; ++r < h;) i = n[r], a = e[r], i ? (i.__data__ = a, g[r] = i) : p[r] = A(a); for (; s > r; ++r) p[r] = A(e[r]); for (; o > r; ++r) d[r] = n[r] } p.update = g, p.parentNode = g.parentNode = d.parentNode = n.parentNode, c.push(p), l.push(g), f.push(d) } var r, i, a = -1,
            o = this.length; if (!arguments.length) { for (n = Array(o = (r = this[0]).length); ++a < o;)(i = r[a]) && (n[a] = i.__data__); return n } var c = L([]),
            l = m([]),
            f = m([]); if ("function" == typeof n)
            for (; ++a < o;) e(r = this[a], n.call(r, r.parentNode.__data__, a));
        else
            for (; ++a < o;) e(r = this[a], n); return l.enter = function() { return c }, l.exit = function() { return f }, l }, ka.datum = function(n) { return arguments.length ? this.property("__data__", n) : this.property("__data__") }, ka.filter = function(n) { var t, e, r, u = []; "function" != typeof n && (n = q(n)); for (var i = 0, a = this.length; a > i; i++) { u.push(t = []), t.parentNode = (e = this[i]).parentNode; for (var o = 0, c = e.length; c > o; o++)(r = e[o]) && n.call(r, r.__data__, o) && t.push(r) } return m(u) }, ka.order = function() { for (var n = -1, t = this.length; ++n < t;)
            for (var e, r = this[n], u = r.length - 1, i = r[u]; --u >= 0;)(e = r[u]) && (i && i !== e.nextSibling && i.parentNode.insertBefore(e, i), i = e); return this }, ka.sort = function(n) { n = N.apply(this, arguments); for (var t = -1, e = this.length; ++t < e;) this[t].sort(n); return this.order() }, ka.on = function(n, t, e) { var r = arguments.length; if (3 > r) { if ("string" != typeof n) { 2 > r && (t = !1); for (e in n) this.each(C(e, n[e], t)); return this } if (2 > r) return (r = this.node()["__on" + n]) && r._;
            e = !1 } return this.each(C(n, t, e)) };
    var Na = ca.map({ mouseenter: "mouseover", mouseleave: "mouseout" });
    Na.forEach(function(n) { "on" + n in la && Na.remove(n) }), ka.each = function(n) { return j(this, function(t, e, r) { n.call(t, t.__data__, e, r) }) }, ka.call = function(n) { var t = ya(arguments); return n.apply(t[0] = this, t), this }, ka.empty = function() { return !this.node() }, ka.node = function() { for (var n = 0, t = this.length; t > n; n++)
            for (var e = this[n], r = 0, u = e.length; u > r; r++) { var i = e[r]; if (i) return i }
        return null };
    var Ta = [];
    ca.selection.enter = L, ca.selection.enter.prototype = Ta, Ta.append = ka.append, Ta.insert = ka.insert, Ta.empty = ka.empty, Ta.node = ka.node, Ta.select = function(n) { for (var t, e, r, u, i, a = [], o = -1, c = this.length; ++o < c;) { r = (u = this[o]).update, a.push(t = []), t.parentNode = u.parentNode; for (var l = -1, f = u.length; ++l < f;)(i = u[l]) ? (t.push(r[l] = e = n.call(u.parentNode, i.__data__, l)), e.__data__ = i.__data__) : t.push(null) } return m(a) }, ka.transition = function() { var n, t, e = rc || ++oc,
            r = [],
            u = Object.create(cc);
        u.time = Date.now(); for (var i = -1, a = this.length; ++i < a;) { r.push(n = []); for (var o = this[i], c = -1, l = o.length; ++c < l;)(t = o[c]) && xi(t, c, e, u), n.push(t) } return vi(r, e) };
    var Ca = m([
        [la]
    ]);
    Ca[0].parentNode = wa, ca.select = function(n) { return "string" == typeof n ? Ca.select(n) : m([
            [n]
        ]) }, ca.selectAll = function(n) { return "string" == typeof n ? Ca.selectAll(n) : m([ya(n)]) }, ca.behavior.zoom = function() {
        function n() { this.on("mousedown.zoom", o).on("mousemove.zoom", f).on(ja + ".zoom", c).on("dblclick.zoom", g).on("touchstart.zoom", p).on("touchmove.zoom", d).on("touchend.zoom", p) }

        function t(n) { return [(n[0] - w[0]) / S, (n[1] - w[1]) / S] }

        function e(n) { return [n[0] * S + w[0], n[1] * S + w[1]] }

        function r(n) { S = Math.max(E[0], Math.min(E[1], n)) }

        function u(n, t) { t = e(t), w[0] += n[0] - t[0], w[1] += n[1] - t[1] }

        function i() { M && M.domain(y.range().map(function(n) { return (n - w[0]) / S }).map(y.invert)), b && b.domain(x.range().map(function(n) { return (n - w[1]) / S }).map(x.invert)) }

        function a(n) { i(), ca.event.preventDefault(), n({ type: "zoom", scale: S, translate: w }) }

        function o() {
            function n() { c = 1, u(ca.mouse(r), h), a(i) }

            function e() { c && l(), f.on("mousemove.zoom", null).on("mouseup.zoom", null), c && ca.event.target === o && s(f, "click.zoom") } var r = this,
                i = k.of(r, arguments),
                o = ca.event.target,
                c = 0,
                f = ca.select(fa).on("mousemove.zoom", n).on("mouseup.zoom", e),
                h = t(ca.mouse(r));
            fa.focus(), l() }

        function c() { m || (m = t(ca.mouse(this))), r(Math.pow(2, za() * .002) * S), u(ca.mouse(this), m), a(k.of(this, arguments)) }

        function f() { m = null }

        function g() { var n = ca.mouse(this),
                e = t(n),
                i = Math.log(S) / Math.LN2;
            r(Math.pow(2, ca.event.shiftKey ? Math.ceil(i) - 1 : Math.floor(i) + 1)), u(n, e), a(k.of(this, arguments)) }

        function p() { var n = ca.touches(this),
                e = Date.now(); if (v = S, m = {}, n.forEach(function(n) { m[n.identifier] = t(n) }), l(), n.length === 1) { if (500 > e - _) { var i = n[0],
                        o = t(n[0]);
                    r(2 * S), u(i, o), a(k.of(this, arguments)) } _ = e } }

        function d() { var n = ca.touches(this),
                t = n[0],
                e = m[t.identifier]; if (i = n[1]) { var i, o = m[i.identifier];
                t = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2], e = [(e[0] + o[0]) / 2, (e[1] + o[1]) / 2], r(ca.event.scale * v) } u(t, e), _ = null, a(k.of(this, arguments)) } var m, v, y, M, x, b, _, w = [0, 0],
            S = 1,
            E = Da,
            k = h(n, "zoom"); return n.translate = function(t) { return arguments.length ? (w = t.map(Number), i(), n) : w }, n.scale = function(t) { return arguments.length ? (S = +t, i(), n) : S }, n.scaleExtent = function(t) { return arguments.length ? (E = null == t ? Da : t.map(Number), n) : E }, n.x = function(t) { return arguments.length ? (M = t, y = t.copy(), w = [0, 0], S = 1, n) : M }, n.y = function(t) { return arguments.length ? (b = t, x = t.copy(), w = [0, 0], S = 1, n) : b }, ca.rebind(n, k, "on") };
    var za, Da = [0, 1 / 0],
        ja = "onwheel" in la ? (za = function() { return -ca.event.deltaY * (ca.event.deltaMode ? 120 : 1) }, "wheel") : "onmousewheel" in la ? (za = function() { return ca.event.wheelDelta }, "mousewheel") : (za = function() { return -ca.event.detail }, "MozMousePixelScroll");
    F.prototype.toString = function() { return this.rgb() + "" }, ca.hsl = function(n, t, e) { return arguments.length === 1 ? n instanceof P ? H(n.h, n.s, n.l) : it("" + n, at, H) : H(+n, +t, +e) };
    var La = P.prototype = new F;
    La.brighter = function(n) { return n = Math.pow(.7, arguments.length ? n : 1), H(this.h, this.s, this.l / n) }, La.darker = function(n) { return n = Math.pow(.7, arguments.length ? n : 1), H(this.h, this.s, n * this.l) }, La.rgb = function() { return R(this.h, this.s, this.l) };
    var Fa = Math.PI,
        Ha = 1e-6,
        Pa = Fa / 180,
        Ra = 180 / Fa;
    ca.hcl = function(n, t, e) { return arguments.length === 1 ? n instanceof B ? Z(n.h, n.c, n.l) : n instanceof G ? W(n.l, n.a, n.b) : W((n = ot((n = ca.rgb(n)).r, n.g, n.b)).l, n.a, n.b) : Z(+n, +t, +e) };
    var Oa = B.prototype = new F;
    Oa.brighter = function(n) { return Z(this.h, this.c, Math.min(100, this.l + Ya * (arguments.length ? n : 1))) }, Oa.darker = function(n) { return Z(this.h, this.c, Math.max(0, this.l - Ya * (arguments.length ? n : 1))) }, Oa.rgb = function() { return $(this.h, this.c, this.l).rgb() }, ca.lab = function(n, t, e) { return arguments.length === 1 ? n instanceof G ? J(n.l, n.a, n.b) : n instanceof B ? $(n.l, n.c, n.h) : ot((n = ca.rgb(n)).r, n.g, n.b) : J(+n, +t, +e) };
    var Ya = 18,
        Ua = .95047,
        Ia = 1,
        Va = 1.08883,
        Xa = G.prototype = new F;
    Xa.brighter = function(n) { return J(Math.min(100, this.l + Ya * (arguments.length ? n : 1)), this.a, this.b) }, Xa.darker = function(n) { return J(Math.max(0, this.l - Ya * (arguments.length ? n : 1)), this.a, this.b) }, Xa.rgb = function() { return K(this.l, this.a, this.b) }, ca.rgb = function(n, t, e) { return arguments.length === 1 ? n instanceof rt ? et(n.r, n.g, n.b) : it("" + n, et, R) : et(~~n, ~~t, ~~e) };
    var Za = rt.prototype = new F;
    Za.brighter = function(n) { n = Math.pow(.7, arguments.length ? n : 1); var t = this.r,
            e = this.g,
            r = this.b,
            u = 30; return t || e || r ? (t && u > t && (t = u), e && u > e && (e = u), r && u > r && (r = u), et(Math.min(255, Math.floor(t / n)), Math.min(255, Math.floor(e / n)), Math.min(255, Math.floor(r / n)))) : et(u, u, u) }, Za.darker = function(n) { return n = Math.pow(.7, arguments.length ? n : 1), et(Math.floor(n * this.r), Math.floor(n * this.g), Math.floor(n * this.b)) }, Za.hsl = function() { return at(this.r, this.g, this.b) }, Za.toString = function() { return "#" + ut(this.r) + ut(this.g) + ut(this.b) };
    var Ba = ca.map({ aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32" });
    Ba.forEach(function(n, t) { Ba.set(n, it(t, et, R)) }), ca.functor = ft, ca.xhr = function(n, t, e) {
        function r() { var n = c.status;!n && c.responseText || n >= 200 && 300 > n || 304 === n ? i.load.call(u, o.call(u, c)) : i.error.call(u, c) } var u = {},
            i = ca.dispatch("progress", "load", "error"),
            a = {},
            o = st,
            c = new(fa.XDomainRequest && /^(http(s)?:)?\/\//.test(n) ? XDomainRequest : XMLHttpRequest); return "onload" in c ? c.onload = c.onerror = r : c.onreadystatechange = function() { c.readyState > 3 && r() }, c.onprogress = function(n) { var t = ca.event;
            ca.event = n; try { i.progress.call(u, c) } finally { ca.event = t } }, u.header = function(n, t) { return n = (n + "").toLowerCase(), arguments.length < 2 ? a[n] : (null == t ? delete a[n] : a[n] = t + "", u) }, u.mimeType = function(n) { return arguments.length ? (t = null == n ? null : n + "", u) : t }, u.response = function(n) { return o = n, u }, ["get", "post"].forEach(function(n) { u[n] = function() { return u.send.apply(u, [n].concat(ya(arguments))) } }), u.send = function(e, r, i) { if (arguments.length === 2 && "function" == typeof r && (i = r, r = null), c.open(e, n, !0), null == t || "accept" in a || (a.accept = t + ",*/*"), c.setRequestHeader)
                for (var o in a) c.setRequestHeader(o, a[o]); return null != t && c.overrideMimeType && c.overrideMimeType(t), null != i && u.on("error", i).on("load", function(n) { i(null, n) }), c.send(null == r ? null : r), u }, u.abort = function() { return c.abort(), u }, ca.rebind(u, i, "on"), arguments.length === 2 && "function" == typeof t && (e = t, t = null), null == e ? u : u.get(ht(e)) }, ca.csv = gt(",", "text/csv"), ca.tsv = gt("	", "text/tab-separated-values");
    var $a, Ja, Ga = 0,
        Ka = {},
        Wa = null;
    ca.timer = function(n, t, e) { if (arguments.length < 3) { if (arguments.length < 2) t = 0;
            else if (!isFinite(t)) return;
            e = Date.now() } var r = Ka[n.id];
        r && r.callback === n ? (r.then = e, r.delay = t) : Ka[n.id = ++Ga] = Wa = { callback: n, then: e, delay: t, next: Wa }, $a || (Ja = clearTimeout(Ja), $a = 1, Qa(pt)) }, ca.timer.flush = function() { for (var n, t = Date.now(), e = Wa; e;) n = t - e.then, e.delay || (e.flush = e.callback(n)), e = e.next;
        dt() };
    var Qa = fa.requestAnimationFrame || fa.webkitRequestAnimationFrame || fa.mozRequestAnimationFrame || fa.oRequestAnimationFrame || fa.msRequestAnimationFrame || function(n) { setTimeout(n, 17) },
        no = ".",
        to = ",",
        eo = [3, 3],
        ro = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(mt);
    ca.formatPrefix = function(n, t) { var e = 0; return n && (0 > n && (n *= -1), t && (n = ca.round(n, vt(n, t))), e = 1 + Math.floor(1e-12 + Math.log(n) / Math.LN10), e = Math.max(-24, Math.min(24, Math.floor((0 >= e ? e + 1 : e - 1) / 3) * 3))), ro[8 + e / 3] }, ca.round = function(n, t) { return t ? Math.round(n * (t = Math.pow(10, t))) / t : Math.round(n) }, ca.format = function(n) { var t = uo.exec(n),
            e = t[1] || " ",
            r = t[2] || ">",
            u = t[3] || "",
            i = t[4] || "",
            a = t[5],
            o = +t[6],
            c = t[7],
            l = t[8],
            f = t[9],
            s = 1,
            h = "",
            g = !1; switch (l && (l = +l.substring(1)), (a || "0" === e && "=" === r) && (a = e = "0", r = "=", c && (o -= Math.floor((o - 1) / 4))), f) {
            case "n":
                c = !0, f = "g"; break;
            case "%":
                s = 100, h = "%", f = "f"; break;
            case "p":
                s = 100, h = "%", f = "r"; break;
            case "b":
            case "o":
            case "x":
            case "X":
                i && (i = "0" + f.toLowerCase());
            case "c":
            case "d":
                g = !0, l = 0; break;
            case "s":
                s = -1, f = "r" } "#" === i && (i = ""), "r" != f || l || (f = "g"), null != l && ("g" == f ? l = Math.max(1, Math.min(21, l)) : ("e" == f || "f" == f) && (l = Math.max(0, Math.min(20, l)))), f = io.get(f) || yt; var p = a && c; return function(n) { if (g && n % 1) return ""; var t = 0 > n || 0 === n && 0 > 1 / n ? (n = -n, "-") : u; if (0 > s) { var d = ca.formatPrefix(n, l);
                n = d.scale(n), h = d.symbol } else n *= s;
            n = f(n, l), !a && c && (n = ao(n)); var m = i.length + n.length + (p ? 0 : t.length),
                v = o > m ? Array(m = o - m + 1).join(e) : ""; return p && (n = ao(v + n)), no && n.replace(".", no), t += i, ("<" === r ? t + n + v : ">" === r ? v + t + n : "^" === r ? v.substring(0, m >>= 1) + t + n + v.substring(m) : t + (p ? n : v + n)) + h } };
    var uo = /(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,
        io = ca.map({ b: function(n) { return n.toString(2) }, c: function(n) { return String.fromCharCode(n) }, o: function(n) { return n.toString(8) }, x: function(n) { return n.toString(16) }, X: function(n) { return n.toString(16).toUpperCase() }, g: function(n, t) { return n.toPrecision(t) }, e: function(n, t) { return n.toExponential(t) }, f: function(n, t) { return n.toFixed(t) }, r: function(n, t) { return (n = ca.round(n, vt(n, t))).toFixed(Math.max(0, Math.min(20, vt(n * (1 + 1e-15), t)))) } }),
        ao = st;
    if (eo) { var oo = eo.length;
        ao = function(n) { for (var t = n.lastIndexOf("."), e = t >= 0 ? "." + n.substring(t + 1) : (t = n.length, ""), r = [], u = 0, i = eo[0]; t > 0 && i > 0;) r.push(n.substring(t -= i, t + i)), i = eo[u = (u + 1) % oo]; return r.reverse().join(to || "") + e } } ca.geo = {}, ca.geo.stream = function(n, t) { n && co.hasOwnProperty(n.type) ? co[n.type](n, t) : Mt(n, t) };
    var co = { Feature: function(n, t) { Mt(n.geometry, t) }, FeatureCollection: function(n, t) { for (var e = n.features, r = -1, u = e.length; ++r < u;) Mt(e[r].geometry, t) } },
        lo = { Sphere: function(n, t) { t.sphere() }, Point: function(n, t) { var e = n.coordinates;
                t.point(e[0], e[1]) }, MultiPoint: function(n, t) { for (var e, r = n.coordinates, u = -1, i = r.length; ++u < i;) e = r[u], t.point(e[0], e[1]) }, LineString: function(n, t) { xt(n.coordinates, t, 0) }, MultiLineString: function(n, t) { for (var e = n.coordinates, r = -1, u = e.length; ++r < u;) xt(e[r], t, 0) }, Polygon: function(n, t) { bt(n.coordinates, t) }, MultiPolygon: function(n, t) { for (var e = n.coordinates, r = -1, u = e.length; ++r < u;) bt(e[r], t) }, GeometryCollection: function(n, t) { for (var e = n.geometries, r = -1, u = e.length; ++r < u;) Mt(e[r], t) } };
    ca.geo.area = function(n) { return fo = 0, ca.geo.stream(n, go), fo };
    var fo, so, ho, go = { sphere: function() { fo += 4 * Fa }, point: T, lineStart: T, lineEnd: T, polygonStart: function() { so = 1, ho = 0, go.lineStart = _t }, polygonEnd: function() { var n = 2 * Math.atan2(ho, so);
            fo += 0 > n ? 4 * Fa + n : n, go.lineStart = go.lineEnd = go.point = T } };
    ca.geo.bounds = wt(st), ca.geo.centroid = function(n) { po = mo = vo = yo = Mo = 0, ca.geo.stream(n, xo); var t; return mo && Math.abs(t = Math.sqrt(vo * vo + yo * yo + Mo * Mo)) > Ha ? [Math.atan2(yo, vo) * Ra, Math.asin(Math.max(-1, Math.min(1, Mo / t))) * Ra] : void 0 };
    var po, mo, vo, yo, Mo, xo = { sphere: function() { 2 > po && (po = 2, mo = vo = yo = Mo = 0) }, point: St, lineStart: kt, lineEnd: At, polygonStart: function() { 2 > po && (po = 2, mo = vo = yo = Mo = 0), xo.lineStart = Et }, polygonEnd: function() { xo.lineStart = kt } },
        bo = Rt(jt, Vt, Zt),
        _o = 1e9;
    ca.geo.projection = Wt, ca.geo.projectionMutator = Qt, (ca.geo.equirectangular = function() { return Wt(te) }).raw = te.invert = te, ca.geo.rotation = function(n) {
        function t(t) { return t = n(t[0] * Pa, t[1] * Pa), t[0] *= Ra, t[1] *= Ra, t } return n = ee(n[0] % 360 * Pa, n[1] * Pa, n.length > 2 ? n[2] * Pa : 0), t.invert = function(t) { return t = n.invert(t[0] * Pa, t[1] * Pa), t[0] *= Ra, t[1] *= Ra, t }, t }, ca.geo.circle = function() {
        function n() { var n = "function" == typeof r ? r.apply(this, arguments) : r,
                t = ee(-n[0] * Pa, -n[1] * Pa, 0).invert,
                u = []; return e(null, null, 1, { point: function(n, e) { u.push(n = t(n, e)), n[0] *= Ra, n[1] *= Ra } }), { type: "Polygon", coordinates: [u] } } var t, e, r = [0, 0],
            u = 6; return n.origin = function(t) { return arguments.length ? (r = t, n) : r }, n.angle = function(r) { return arguments.length ? (e = ae((t = +r) * Pa, u * Pa), n) : t }, n.precision = function(r) { return arguments.length ? (e = ae(t * Pa, (u = +r) * Pa), n) : u }, n.angle(90) }, ca.geo.distance = function(n, t) { var e, r = (t[0] - n[0]) * Pa,
            u = n[1] * Pa,
            i = t[1] * Pa,
            a = Math.sin(r),
            o = Math.cos(r),
            c = Math.sin(u),
            l = Math.cos(u),
            f = Math.sin(i),
            s = Math.cos(i); return Math.atan2(Math.sqrt((e = s * a) * e + (e = l * f - c * s * o) * e), c * f + l * s * o) }, ca.geo.graticule = function() {
        function n() { return { type: "MultiLineString", coordinates: t() } }

        function t() { return ca.range(Math.ceil(i / m) * m, u, m).map(h).concat(ca.range(Math.ceil(l / v) * v, c, v).map(g)).concat(ca.range(Math.ceil(r / p) * p, e, p).filter(function(n) { return Math.abs(n % m) > Ha }).map(f)).concat(ca.range(Math.ceil(o / d) * d, a, d).filter(function(n) { return Math.abs(n % v) > Ha }).map(s)) } var e, r, u, i, a, o, c, l, f, s, h, g, p = 10,
            d = p,
            m = 90,
            v = 360,
            y = 2.5; return n.lines = function() { return t().map(function(n) { return { type: "LineString", coordinates: n } }) }, n.outline = function() { return { type: "Polygon", coordinates: [h(i).concat(g(c).slice(1), h(u).reverse().slice(1), g(l).reverse().slice(1))] } }, n.extent = function(t) { return arguments.length ? n.majorExtent(t).minorExtent(t) : n.minorExtent() }, n.majorExtent = function(t) { return arguments.length ? (i = +t[0][0], u = +t[1][0], l = +t[0][1], c = +t[1][1], i > u && (t = i, i = u, u = t), l > c && (t = l, l = c, c = t), n.precision(y)) : [
                [i, l],
                [u, c]
            ] }, n.minorExtent = function(t) { return arguments.length ? (r = +t[0][0], e = +t[1][0], o = +t[0][1], a = +t[1][1], r > e && (t = r, r = e, e = t), o > a && (t = o, o = a, a = t), n.precision(y)) : [
                [r, o],
                [e, a]
            ] }, n.step = function(t) { return arguments.length ? n.majorStep(t).minorStep(t) : n.minorStep() }, n.majorStep = function(t) { return arguments.length ? (m = +t[0], v = +t[1], n) : [m, v] }, n.minorStep = function(t) { return arguments.length ? (p = +t[0], d = +t[1], n) : [p, d] }, n.precision = function(t) { return arguments.length ? (y = +t, f = ce(o, a, 90), s = le(r, e, y), h = ce(l, c, 90), g = le(i, u, y), n) : y }, n.majorExtent([
            [-180, -90 + Ha],
            [180, 90 - Ha]
        ]).minorExtent([
            [-180, -80 - Ha],
            [180, 80 + Ha]
        ]) }, ca.geo.greatArc = function() {
        function n() { return { type: "LineString", coordinates: [t || r.apply(this, arguments), e || u.apply(this, arguments)] } } var t, e, r = fe,
            u = se; return n.distance = function() { return ca.geo.distance(t || r.apply(this, arguments), e || u.apply(this, arguments)) }, n.source = function(e) { return arguments.length ? (r = e, t = "function" == typeof e ? null : e, n) : r }, n.target = function(t) { return arguments.length ? (u = t, e = "function" == typeof t ? null : t, n) : u }, n.precision = function() { return arguments.length ? n : 0 }, n }, ca.geo.interpolate = function(n, t) { return he(n[0] * Pa, n[1] * Pa, t[0] * Pa, t[1] * Pa) }, ca.geo.length = function(n) { return wo = 0, ca.geo.stream(n, So), wo };
    var wo, So = { sphere: T, point: T, lineStart: ge, lineEnd: T, polygonStart: T, polygonEnd: T };
    (ca.geo.conicEqualArea = function() { return pe(de) }).raw = de, ca.geo.albersUsa = function() {
        function n(n) { return t(n)(n) }

        function t(n) { var t = n[0],
                e = n[1]; return e > 50 ? a : -140 > t ? o : 21 > e ? c : i } var e, r, u, i = ca.geo.conicEqualArea().rotate([98, 0]).center([0, 38]).parallels([29.5, 45.5]),
            a = ca.geo.conicEqualArea().rotate([160, 0]).center([0, 60]).parallels([55, 65]),
            o = ca.geo.conicEqualArea().rotate([160, 0]).center([0, 20]).parallels([8, 18]),
            c = ca.geo.conicEqualArea().rotate([60, 0]).center([0, 10]).parallels([8, 18]); return n.invert = function(n) { return e(n) || r(n) || u(n) || i.invert(n) }, n.scale = function(t) { return arguments.length ? (i.scale(t), a.scale(.6 * t), o.scale(t), c.scale(1.5 * t), n.translate(i.translate())) : i.scale() }, n.translate = function(t) { if (!arguments.length) return i.translate(); var l = i.scale(),
                f = t[0],
                s = t[1]; return i.translate(t), a.translate([f - .4 * l, s + .17 * l]), o.translate([f - .19 * l, s + .2 * l]), c.translate([f + .58 * l, s + .43 * l]), e = me(a, [
                [-180, 50],
                [-130, 72]
            ]), r = me(o, [
                [-164, 18],
                [-154, 24]
            ]), u = me(c, [
                [-67.5, 17.5],
                [-65, 19]
            ]), n }, n.scale(1e3) };
    var Eo, ko, Ao = { point: T, lineStart: T, lineEnd: T, polygonStart: function() { ko = 0, Ao.lineStart = ve }, polygonEnd: function() { Ao.lineStart = Ao.lineEnd = Ao.point = T, Eo += Math.abs(ko / 2) } },
        qo = { point: Me, lineStart: xe, lineEnd: be, polygonStart: function() { qo.lineStart = _e }, polygonEnd: function() { qo.point = Me, qo.lineStart = xe, qo.lineEnd = be } };
    ca.geo.path = function() {
        function n(n) { return n && ca.geo.stream(n, r(u.pointRadius("function" == typeof i ? +i.apply(this, arguments) : i))), u.result() } var t, e, r, u, i = 4.5; return n.area = function(n) { return Eo = 0, ca.geo.stream(n, r(Ao)), Eo }, n.centroid = function(n) { return po = vo = yo = Mo = 0, ca.geo.stream(n, r(qo)), Mo ? [vo / Mo, yo / Mo] : void 0 }, n.bounds = function(n) { return wt(r)(n) }, n.projection = function(e) { return arguments.length ? (r = (t = e) ? e.stream || Ee(e) : st, n) : t }, n.context = function(t) { return arguments.length ? (u = (e = t) == null ? new ye : new we(t), n) : e }, n.pointRadius = function(t) { return arguments.length ? (i = "function" == typeof t ? t : +t, n) : i }, n.projection(ca.geo.albersUsa()).context(null) }, ca.geo.albers = function() { return ca.geo.conicEqualArea().parallels([29.5, 45.5]).rotate([98, 0]).center([0, 38]).scale(1e3) };
    var No = ke(function(n) { return Math.sqrt(2 / (1 + n)) }, function(n) { return 2 * Math.asin(n / 2) });
    (ca.geo.azimuthalEqualArea = function() { return Wt(No) }).raw = No;
    var To = ke(function(n) { var t = Math.acos(n); return t && t / Math.sin(t) }, st);
    (ca.geo.azimuthalEquidistant = function() { return Wt(To) }).raw = To, (ca.geo.conicConformal = function() { return pe(Ae) }).raw = Ae, (ca.geo.conicEquidistant = function() { return pe(qe) }).raw = qe;
    var Co = ke(function(n) { return 1 / n }, Math.atan);
    (ca.geo.gnomonic = function() { return Wt(Co) }).raw = Co, Ne.invert = function(n, t) { return [n, 2 * Math.atan(Math.exp(t)) - Fa / 2] }, (ca.geo.mercator = function() { return Te(Ne) }).raw = Ne;
    var zo = ke(function() { return 1 }, Math.asin);
    (ca.geo.orthographic = function() { return Wt(zo) }).raw = zo;
    var Do = ke(function(n) { return 1 / (1 + n) }, function(n) { return 2 * Math.atan(n) });
    (ca.geo.stereographic = function() { return Wt(Do) }).raw = Do, Ce.invert = function(n, t) { return [Math.atan2(I(n), Math.cos(t)), U(Math.sin(t) / V(n))] }, (ca.geo.transverseMercator = function() { return Te(Ce) }).raw = Ce, ca.geom = {}, ca.svg = {}, ca.svg.line = function() { return ze(st) };
    var jo = ca.map({ linear: Le, "linear-closed": Fe, "step-before": He, "step-after": Pe, basis: Ve, "basis-open": Xe, "basis-closed": Ze, bundle: Be, cardinal: Ye, "cardinal-open": Re, "cardinal-closed": Oe, monotone: Qe });
    jo.forEach(function(n, t) { t.key = n, t.closed = /-closed$/.test(n) });
    var Lo = [0, 2 / 3, 1 / 3, 0],
        Fo = [0, 1 / 3, 2 / 3, 0],
        Ho = [0, 1 / 6, 2 / 3, 1 / 6];
    ca.geom.hull = function(n) {
        function t(n) { if (n.length < 3) return []; var t, u, i, a, o, c, l, f, s, h, g, p, d = ft(e),
                m = ft(r),
                v = n.length,
                y = v - 1,
                M = [],
                x = [],
                b = 0; if (d === De && r === je) t = n;
            else
                for (i = 0, t = []; v > i; ++i) t.push([+d.call(this, u = n[i], i), +m.call(this, u, i)]); for (i = 1; v > i; ++i) t[i][1] < t[b][1] ? b = i : t[i][1] == t[b][1] && (b = t[i][0] < t[b][0] ? i : b); for (i = 0; v > i; ++i) i !== b && (c = t[i][1] - t[b][1], o = t[i][0] - t[b][0], M.push({ angle: Math.atan2(c, o), index: i })); for (M.sort(function(n, t) { return n.angle - t.angle }), g = M[0].angle, h = M[0].index, s = 0, i = 1; y > i; ++i) a = M[i].index, g == M[i].angle ? (o = t[h][0] - t[b][0], c = t[h][1] - t[b][1], l = t[a][0] - t[b][0], f = t[a][1] - t[b][1], o * o + c * c >= l * l + f * f ? M[i].index = -1 : (M[s].index = -1, g = M[i].angle, s = i, h = a)) : (g = M[i].angle, s = i, h = a); for (x.push(b), i = 0, a = 0; 2 > i; ++a) M[a].index !== -1 && (x.push(M[a].index), i++); for (p = x.length; y > a; ++a)
                if (M[a].index !== -1) { for (; !nr(x[p - 2], x[p - 1], M[a].index, t);) --p;
                    x[p++] = M[a].index } var _ = []; for (i = 0; p > i; ++i) _.push(n[x[i]]); return _ } var e = De,
            r = je; return arguments.length ? t(n) : (t.x = function(n) { return arguments.length ? (e = n, t) : e }, t.y = function(n) { return arguments.length ? (r = n, t) : r }, t) }, ca.geom.polygon = function(n) { return n.area = function() { for (var t = 0, e = n.length, r = n[e - 1][1] * n[0][0] - n[e - 1][0] * n[0][1]; ++t < e;) r += n[t - 1][1] * n[t][0] - n[t - 1][0] * n[t][1]; return .5 * r }, n.centroid = function(t) { var e, r, u = -1,
                i = n.length,
                a = 0,
                o = 0,
                c = n[i - 1]; for (arguments.length || (t = -1 / (6 * n.area())); ++u < i;) e = c, c = n[u], r = e[0] * c[1] - c[0] * e[1], a += (e[0] + c[0]) * r, o += (e[1] + c[1]) * r; return [a * t, o * t] }, n.clip = function(t) { for (var e, r, u, i, a, o, c = -1, l = n.length, f = n[l - 1]; ++c < l;) { for (e = t.slice(), t.length = 0, i = n[c], a = e[(u = e.length) - 1], r = -1; ++r < u;) o = e[r], tr(o, f, i) ? (tr(a, f, i) || t.push(er(a, o, f, i)), t.push(o)) : tr(a, f, i) && t.push(er(a, o, f, i)), a = o;
                f = i } return t }, n }, ca.geom.delaunay = function(n) { var t = n.map(function() { return [] }),
            e = []; return rr(n, function(e) { t[e.region.l.index].push(n[e.region.r.index]) }), t.forEach(function(t, r) { var u = n[r],
                i = u[0],
                a = u[1];
            t.forEach(function(n) { n.angle = Math.atan2(n[0] - i, n[1] - a) }), t.sort(function(n, t) { return n.angle - t.angle }); for (var o = 0, c = t.length - 1; c > o; o++) e.push([u, t[o], t[o + 1]]) }), e }, ca.geom.voronoi = function(n) {
        function t(n) { var t, r, a, o = n.map(function() { return [] }),
                c = ft(u),
                l = ft(i),
                f = n.length,
                s = 1e6; if (c === De && l === je) t = n;
            else
                for (t = [], a = 0; f > a; ++a) t.push([+c.call(this, r = n[a], a), +l.call(this, r, a)]); if (rr(t, function(n) { var t, e, r, u, i, a;
                    n.a === 1 && n.b >= 0 ? (t = n.ep.r, e = n.ep.l) : (t = n.ep.l, e = n.ep.r), n.a === 1 ? (i = t ? t.y : -s, r = n.c - n.b * i, a = e ? e.y : s, u = n.c - n.b * a) : (r = t ? t.x : -s, i = n.c - n.a * r, u = e ? e.x : s, a = n.c - n.a * u); var c = [r, i],
                        l = [u, a];
                    o[n.region.l.index].push(c, l), o[n.region.r.index].push(c, l) }), o = o.map(function(n, e) { var r = t[e][0],
                        u = t[e][1],
                        i = n.map(function(n) { return Math.atan2(n[0] - r, n[1] - u) }),
                        a = ca.range(n.length).sort(function(n, t) { return i[n] - i[t] }); return a.filter(function(n, t) { return !t || i[n] - i[a[t - 1]] > Ha }).map(function(t) { return n[t] }) }), o.forEach(function(n, e) { var r = n.length; if (!r) return n.push([-s, -s], [-s, s], [s, s], [s, -s]); if (!(r > 2)) { var u = t[e],
                            i = n[0],
                            a = n[1],
                            o = u[0],
                            c = u[1],
                            l = i[0],
                            f = i[1],
                            h = a[0],
                            g = a[1],
                            p = Math.abs(h - l),
                            d = g - f; if (Math.abs(d) < Ha) { var m = f > c ? -s : s;
                            n.push([-s, m], [s, m]) } else if (Ha > p) { var v = l > o ? -s : s;
                            n.push([v, -s], [v, s]) } else { var m = (l - o) * (g - f) > (h - l) * (f - c) ? s : -s,
                                y = Math.abs(d) - p;
                            Math.abs(y) < Ha ? n.push([0 > d ? m : -m, m]) : (y > 0 && (m *= -1), n.push([-s, m], [s, m])) } } }), e)
                for (a = 0; f > a; ++a) e(o[a]); for (a = 0; f > a; ++a) o[a].point = n[a]; return o } var e, r = null,
            u = De,
            i = je; return arguments.length ? t(n) : (t.x = function(n) { return arguments.length ? (u = n, t) : u }, t.y = function(n) { return arguments.length ? (i = n, t) : i }, t.size = function(n) { return arguments.length ? (null == n ? e = null : (r = [+n[0], +n[1]], e = ca.geom.polygon([
                [0, 0],
                [0, r[1]], r, [r[0], 0]
            ]).clip), t) : r }, t.links = function(n) { var t, e, r, a = n.map(function() { return [] }),
                o = [],
                c = ft(u),
                l = ft(i),
                f = n.length; if (c === De && l === je) t = n;
            else
                for (r = 0; f > r; ++r) t.push([+c.call(this, e = n[r], r), +l.call(this, e, r)]); return rr(t, function(t) { var e = t.region.l.index,
                    r = t.region.r.index;
                a[e][r] || (a[e][r] = a[r][e] = !0, o.push({ source: n[e], target: n[r] })) }), o }, t.triangles = function(n) { if (u === De && i === je) return ca.geom.delaunay(n); var t, e, r, a, o, c = ft(u),
                l = ft(i); for (a = 0, t = [], o = n.length; o > a; ++a) e = [+c.call(this, r = n[a], a), +l.call(this, r, a)], e.data = r, t.push(e); return ca.geom.delaunay(t).map(function(n) { return n.map(function(n) { return n.data }) }) }, t) };
    var Po = { l: "r", r: "l" };
    ca.geom.quadtree = function(n, t, e, r, u) {
        function i(n) {
            function i(n, t, e, r, u, i, a, o) {
                if (!isNaN(e) && !isNaN(r))
                    if (n.leaf) {
                        var c = n.x,
                            f = n.y;
                        if (null != c)
                            if (Math.abs(c - e) + Math.abs(f - r) < .01) l(n, t, e, r, u, i, a, o);
                            else {
                                var s = n.point;
                                n.x = n.y = n.point = null, l(n, s, c, f, u, i, a, o), l(n, t, e, r, u, i, a, o)
                            }
                        else n.x = e, n.y = r, n.point = t
                    } else l(n, t, e, r, u, i, a, o)
            }

            function l(n, t, e, r, u, a, o, c) { var l = .5 * (u + o),
                    f = .5 * (a + c),
                    s = e >= l,
                    h = r >= f,
                    g = (h << 1) + s;
                n.leaf = !1, n = n.nodes[g] || (n.nodes[g] = ar()), s ? u = l : o = l, h ? a = f : c = f, i(n, t, e, r, u, a, o, c) }
            var f, s, h, g, p, d, m, v, y, M = ft(o),
                x = ft(c);
            if (null != t) d = t, m = e, v = r, y = u;
            else if (v = y = -(d = m = 1 / 0), s = [], h = [], p = n.length, a)
                for (g = 0; p > g; ++g) f = n[g], f.x < d && (d = f.x), f.y < m && (m = f.y), f.x > v && (v = f.x), f.y > y && (y = f.y), s.push(f.x), h.push(f.y);
            else
                for (g = 0; p > g; ++g) { var b = +M(f = n[g], g),
                        _ = +x(f, g);
                    d > b && (d = b), m > _ && (m = _), b > v && (v = b), _ > y && (y = _), s.push(b), h.push(_) }
            var w = v - d,
                S = y - m;
            w > S ? y = m + w : v = d + S;
            var E = ar();
            if (E.add = function(n) { i(E, n, +M(n, ++g), +x(n, g), d, m, v, y) }, E.visit = function(n) { or(n, E, d, m, v, y) }, g = -1, null == t) { for (; ++g < p;) i(E, n[g], s[g], h[g], d, m, v, y);--g } else n.forEach(E.add);
            return s = h = n = f = null, E
        }
        var a, o = De,
            c = je;
        return (a = arguments.length) ? (o = ur, c = ir, 3 === a && (u = e, r = t, e = t = 0), i(n)) : (i.x = function(n) { return arguments.length ? (o = n, i) : o }, i.y = function(n) { return arguments.length ? (c = n, i) : c }, i.size = function(n) { return arguments.length ? (null == n ? t = e = r = u = null : (t = e = 0, r = +n[0], u = +n[1]), i) : null == t ? null : [r, u] }, i)
    }, ca.interpolateRgb = cr, ca.transform = function(n) { var t = la.createElementNS(ca.ns.prefix.svg, "g"); return (ca.transform = function(n) { t.setAttribute("transform", n); var e = t.transform.baseVal.consolidate(); return new lr(e ? e.matrix : Ro) })(n) }, lr.prototype.toString = function() { return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")" };
    var Ro = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    ca.interpolateNumber = gr, ca.interpolateTransform = pr, ca.interpolateObject = dr, ca.interpolateString = mr;
    var Oo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
    ca.interpolate = vr, ca.interpolators = [function(n, t) { var e = typeof t; return ("string" === e || e !== typeof n ? Ba.has(t) || /^(#|rgb\(|hsl\()/.test(t) ? cr : mr : t instanceof F ? cr : "object" === e ? Array.isArray(t) ? Mr : dr : gr)(n, t) }], ca.interpolateArray = Mr;
    var Yo = function() { return st },
        Uo = ca.map({ linear: Yo, poly: kr, quad: function() { return wr }, cubic: function() { return Sr }, sin: function() { return Ar }, exp: function() { return qr }, circle: function() { return Nr }, elastic: Tr, back: Cr, bounce: function() { return zr } }),
        Io = ca.map({ "in": st, out: br, "in-out": _r, "out-in": function(n) { return _r(br(n)) } });
    ca.ease = function(n) { var t = n.indexOf("-"),
            e = t >= 0 ? n.substring(0, t) : n,
            r = t >= 0 ? n.substring(t + 1) : "in"; return e = Uo.get(e) || Yo, r = Io.get(r) || st, xr(r(e.apply(null, Array.prototype.slice.call(arguments, 1)))) }, ca.interpolateHcl = Dr, ca.interpolateHsl = jr, ca.interpolateLab = Lr, ca.interpolateRound = Fr, ca.layout = {}, ca.layout.bundle = function() { return function(n) { for (var t = [], e = -1, r = n.length; ++e < r;) t.push(Rr(n[e])); return t } }, ca.layout.chord = function() {
        function n() { var n, l, s, h, g, p = {},
                d = [],
                m = ca.range(i),
                v = []; for (e = [], r = [], n = 0, h = -1; ++h < i;) { for (l = 0, g = -1; ++g < i;) l += u[h][g];
                d.push(l), v.push(ca.range(i)), n += l } for (a && m.sort(function(n, t) { return a(d[n], d[t]) }), o && v.forEach(function(n, t) { n.sort(function(n, e) { return o(u[t][n], u[t][e]) }) }), n = (2 * Fa - f * i) / n, l = 0, h = -1; ++h < i;) { for (s = l, g = -1; ++g < i;) { var y = m[h],
                        M = v[y][g],
                        x = u[y][M],
                        b = l,
                        _ = l += x * n;
                    p[y + "-" + M] = { index: y, subindex: M, startAngle: b, endAngle: _, value: x } } r[y] = { index: y, startAngle: s, endAngle: l, value: (l - s) / n }, l += f } for (h = -1; ++h < i;)
                for (g = h - 1; ++g < i;) { var w = p[h + "-" + g],
                        S = p[g + "-" + h];
                    (w.value || S.value) && e.push(w.value < S.value ? { source: S, target: w } : { source: w, target: S }) } c && t() }

        function t() { e.sort(function(n, t) { return c((n.source.value + n.target.value) / 2, (t.source.value + t.target.value) / 2) }) } var e, r, u, i, a, o, c, l = {},
            f = 0; return l.matrix = function(n) { return arguments.length ? (i = (u = n) && u.length, e = r = null, l) : u }, l.padding = function(n) { return arguments.length ? (f = n, e = r = null, l) : f }, l.sortGroups = function(n) { return arguments.length ? (a = n, e = r = null, l) : a }, l.sortSubgroups = function(n) { return arguments.length ? (o = n, e = null, l) : o }, l.sortChords = function(n) { return arguments.length ? (c = n, e && t(), l) : c }, l.chords = function() { return e || n(), e }, l.groups = function() { return r || n(), r }, l }, ca.layout.force = function() {
        function n(n) { return function(t, e, r, u) { if (t.point !== n) { var i = t.cx - n.x,
                        a = t.cy - n.y,
                        o = 1 / Math.sqrt(i * i + a * a); if (d > (u - e) * o) { var c = t.charge * o * o; return n.px -= i * c, n.py -= a * c, !0 } if (t.point && isFinite(o)) { var c = t.pointCharge * o * o;
                        n.px -= i * c, n.py -= a * c } } return !t.charge } }

        function t(n) { n.px = ca.event.x, n.py = ca.event.y, o.resume() } var e, r, u, i, a, o = {},
            c = ca.dispatch("start", "tick", "end"),
            l = [1, 1],
            f = .9,
            s = Vo,
            h = Xo,
            g = -30,
            p = .1,
            d = .8,
            m = [],
            v = []; return o.tick = function() { if ((r *= .99) < .005) return c.end({ type: "end", alpha: r = 0 }), !0; var t, e, o, s, h, d, y, M, x, b = m.length,
                _ = v.length; for (e = 0; _ > e; ++e) o = v[e], s = o.source, h = o.target, M = h.x - s.x, x = h.y - s.y, (d = M * M + x * x) && (d = r * i[e] * ((d = Math.sqrt(d)) - u[e]) / d, M *= d, x *= d, h.x -= M * (y = s.weight / (h.weight + s.weight)), h.y -= x * y, s.x += M * (y = 1 - y), s.y += x * y); if ((y = r * p) && (M = l[0] / 2, x = l[1] / 2, e = -1, y))
                for (; ++e < b;) o = m[e], o.x += (M - o.x) * y, o.y += (x - o.y) * y; if (g)
                for (Zr(t = ca.geom.quadtree(m), r, a), e = -1; ++e < b;)(o = m[e]).fixed || t.visit(n(o)); for (e = -1; ++e < b;) o = m[e], o.fixed ? (o.x = o.px, o.y = o.py) : (o.x -= (o.px - (o.px = o.x)) * f, o.y -= (o.py - (o.py = o.y)) * f);
            c.tick({ type: "tick", alpha: r }) }, o.nodes = function(n) { return arguments.length ? (m = n, o) : m }, o.links = function(n) { return arguments.length ? (v = n, o) : v }, o.size = function(n) { return arguments.length ? (l = n, o) : l }, o.linkDistance = function(n) { return arguments.length ? (s = "function" == typeof n ? n : +n, o) : s }, o.distance = o.linkDistance, o.linkStrength = function(n) { return arguments.length ? (h = "function" == typeof n ? n : +n, o) : h }, o.friction = function(n) { return arguments.length ? (f = +n, o) : f }, o.charge = function(n) { return arguments.length ? (g = "function" == typeof n ? n : +n, o) : g }, o.gravity = function(n) { return arguments.length ? (p = +n, o) : p }, o.theta = function(n) { return arguments.length ? (d = +n, o) : d }, o.alpha = function(n) { return arguments.length ? (n = +n, r ? r = n > 0 ? n : 0 : n > 0 && (c.start({ type: "start", alpha: r = n }), ca.timer(o.tick)), o) : r }, o.start = function() {
            function n(n, r) { for (var u, i = t(e), a = -1, o = i.length; ++a < o;)
                    if (!isNaN(u = i[a][n])) return u; return Math.random() * r }

            function t() { if (!c) { for (c = [], r = 0; p > r; ++r) c[r] = []; for (r = 0; d > r; ++r) { var n = v[r];
                        c[n.source.index].push(n.target), c[n.target.index].push(n.source) } } return c[e] } var e, r, c, f, p = m.length,
                d = v.length,
                y = l[0],
                M = l[1]; for (e = 0; p > e; ++e)(f = m[e]).index = e, f.weight = 0; for (e = 0; d > e; ++e) f = v[e], typeof f.source == "number" && (f.source = m[f.source]), typeof f.target == "number" && (f.target = m[f.target]), ++f.source.weight, ++f.target.weight; for (e = 0; p > e; ++e) f = m[e], isNaN(f.x) && (f.x = n("x", y)), isNaN(f.y) && (f.y = n("y", M)), isNaN(f.px) && (f.px = f.x), isNaN(f.py) && (f.py = f.y); if (u = [], "function" == typeof s)
                for (e = 0; d > e; ++e) u[e] = +s.call(this, v[e], e);
            else
                for (e = 0; d > e; ++e) u[e] = s; if (i = [], "function" == typeof h)
                for (e = 0; d > e; ++e) i[e] = +h.call(this, v[e], e);
            else
                for (e = 0; d > e; ++e) i[e] = h; if (a = [], "function" == typeof g)
                for (e = 0; p > e; ++e) a[e] = +g.call(this, m[e], e);
            else
                for (e = 0; p > e; ++e) a[e] = g; return o.resume() }, o.resume = function() { return o.alpha(.1) }, o.stop = function() { return o.alpha(0) }, o.drag = function() { return e || (e = ca.behavior.drag().origin(st).on("dragstart.force", Ur).on("drag.force", t).on("dragend.force", Ir)), arguments.length ? (this.on("mouseover.force", Vr).on("mouseout.force", Xr).call(e), void 0) : e }, ca.rebind(o, c, "on") };
    var Vo = 20,
        Xo = 1;
    ca.layout.hierarchy = function() {
        function n(t, a, o) { var c = u.call(e, t, a); if (t.depth = a, o.push(t), c && (l = c.length)) { for (var l, f, s = -1, h = t.children = [], g = 0, p = a + 1; ++s < l;) f = n(c[s], p, o), f.parent = t, h.push(f), g += f.value;
                r && h.sort(r), i && (t.value = g) } else i && (t.value = +i.call(e, t, a) || 0); return t }

        function t(n, r) { var u = n.children,
                a = 0; if (u && (o = u.length))
                for (var o, c = -1, l = r + 1; ++c < o;) a += t(u[c], l);
            else i && (a = +i.call(e, n, r) || 0); return i && (n.value = a), a }

        function e(t) { var e = []; return n(t, 0, e), e } var r = Gr,
            u = $r,
            i = Jr; return e.sort = function(n) { return arguments.length ? (r = n, e) : r }, e.children = function(n) { return arguments.length ? (u = n, e) : u }, e.value = function(n) { return arguments.length ? (i = n, e) : i }, e.revalue = function(n) { return t(n, 0), n }, e }, ca.layout.partition = function() {
        function n(t, e, r, u) { var i = t.children; if (t.x = e, t.y = t.depth * u, t.dx = r, t.dy = u, i && (a = i.length)) { var a, o, c, l = -1; for (r = t.value ? r / t.value : 0; ++l < a;) n(o = i[l], e, c = o.value * r, u), e += c } }

        function t(n) { var e = n.children,
                r = 0; if (e && (u = e.length))
                for (var u, i = -1; ++i < u;) r = Math.max(r, t(e[i])); return 1 + r }

        function e(e, i) { var a = r.call(this, e, i); return n(a[0], 0, u[0], u[1] / t(a[0])), a } var r = ca.layout.hierarchy(),
            u = [1, 1]; return e.size = function(n) { return arguments.length ? (u = n, e) : u }, Br(e, r) }, ca.layout.pie = function() {
        function n(i) { var a = i.map(function(e, r) { return +t.call(n, e, r) }),
                o = +("function" == typeof r ? r.apply(this, arguments) : r),
                c = (("function" == typeof u ? u.apply(this, arguments) : u) - o) / ca.sum(a),
                l = ca.range(i.length);
            null != e && l.sort(e === Zo ? function(n, t) { return a[t] - a[n] } : function(n, t) { return e(i[n], i[t]) }); var f = []; return l.forEach(function(n) { var t;
                f[n] = { data: i[n], value: t = a[n], startAngle: o, endAngle: o += t * c } }), f } var t = Number,
            e = Zo,
            r = 0,
            u = 2 * Fa; return n.value = function(e) { return arguments.length ? (t = e, n) : t }, n.sort = function(t) { return arguments.length ? (e = t, n) : e }, n.startAngle = function(t) { return arguments.length ? (r = t, n) : r }, n.endAngle = function(t) { return arguments.length ? (u = t, n) : u }, n };
    var Zo = {};
    ca.layout.stack = function() {
        function n(o, c) { var l = o.map(function(e, r) { return t.call(n, e, r) }),
                f = l.map(function(t) { return t.map(function(t, e) { return [i.call(n, t, e), a.call(n, t, e)] }) }),
                s = e.call(n, f, c);
            l = ca.permute(l, s), f = ca.permute(f, s); var h, g, p, d = r.call(n, f, c),
                m = l.length,
                v = l[0].length; for (g = 0; v > g; ++g)
                for (u.call(n, l[0][g], p = d[g], f[0][g][1]), h = 1; m > h; ++h) u.call(n, l[h][g], p += f[h - 1][g][1], f[h][g][1]); return o } var t = st,
            e = tu,
            r = eu,
            u = nu,
            i = Wr,
            a = Qr; return n.values = function(e) { return arguments.length ? (t = e, n) : t }, n.order = function(t) { return arguments.length ? (e = "function" == typeof t ? t : Bo.get(t) || tu, n) : e }, n.offset = function(t) { return arguments.length ? (r = "function" == typeof t ? t : $o.get(t) || eu, n) : r }, n.x = function(t) { return arguments.length ? (i = t, n) : i }, n.y = function(t) { return arguments.length ? (a = t, n) : a }, n.out = function(t) { return arguments.length ? (u = t, n) : u }, n };
    var Bo = ca.map({ "inside-out": function(n) { var t, e, r = n.length,
                    u = n.map(ru),
                    i = n.map(uu),
                    a = ca.range(r).sort(function(n, t) { return u[n] - u[t] }),
                    o = 0,
                    c = 0,
                    l = [],
                    f = []; for (t = 0; r > t; ++t) e = a[t], c > o ? (o += i[e], l.push(e)) : (c += i[e], f.push(e)); return f.reverse().concat(l) }, reverse: function(n) { return ca.range(n.length).reverse() }, "default": tu }),
        $o = ca.map({ silhouette: function(n) { var t, e, r, u = n.length,
                    i = n[0].length,
                    a = [],
                    o = 0,
                    c = []; for (e = 0; i > e; ++e) { for (t = 0, r = 0; u > t; t++) r += n[t][e][1];
                    r > o && (o = r), a.push(r) } for (e = 0; i > e; ++e) c[e] = (o - a[e]) / 2; return c }, wiggle: function(n) { var t, e, r, u, i, a, o, c, l, f = n.length,
                    s = n[0],
                    h = s.length,
                    g = []; for (g[0] = c = l = 0, e = 1; h > e; ++e) { for (t = 0, u = 0; f > t; ++t) u += n[t][e][1]; for (t = 0, i = 0, o = s[e][0] - s[e - 1][0]; f > t; ++t) { for (r = 0, a = (n[t][e][1] - n[t][e - 1][1]) / (2 * o); t > r; ++r) a += (n[r][e][1] - n[r][e - 1][1]) / o;
                        i += a * n[t][e][1] } g[e] = c -= u ? i / u * o : 0, l > c && (l = c) } for (e = 0; h > e; ++e) g[e] -= l; return g }, expand: function(n) { var t, e, r, u = n.length,
                    i = n[0].length,
                    a = 1 / u,
                    o = []; for (e = 0; i > e; ++e) { for (t = 0, r = 0; u > t; t++) r += n[t][e][1]; if (r)
                        for (t = 0; u > t; t++) n[t][e][1] /= r;
                    else
                        for (t = 0; u > t; t++) n[t][e][1] = a } for (e = 0; i > e; ++e) o[e] = 0; return o }, zero: eu });
    ca.layout.histogram = function() {
        function n(n, i) { for (var a, o, c = [], l = n.map(e, this), f = r.call(this, l, i), s = u.call(this, f, l, i), i = -1, h = l.length, g = s.length - 1, p = t ? 1 : 1 / h; ++i < g;) a = c[i] = [], a.dx = s[i + 1] - (a.x = s[i]), a.y = 0; if (g > 0)
                for (i = -1; ++i < h;) o = l[i], o >= f[0] && o <= f[1] && (a = c[ca.bisect(s, o, 1, g) - 1], a.y += p, a.push(n[i])); return c } var t = !0,
            e = Number,
            r = cu,
            u = au; return n.value = function(t) { return arguments.length ? (e = t, n) : e }, n.range = function(t) { return arguments.length ? (r = ft(t), n) : r }, n.bins = function(t) { return arguments.length ? (u = "number" == typeof t ? function(n) { return ou(n, t) } : ft(t), n) : u }, n.frequency = function(e) { return arguments.length ? (t = !!e, n) : t }, n }, ca.layout.tree = function() {
        function n(n, u) {
            function i(n, t) { var r = n.children,
                    u = n._tree; if (r && (a = r.length)) { for (var a, c, l, f = r[0], s = f, h = -1; ++h < a;) l = r[h], i(l, c), s = o(l, c, s), c = l;
                    vu(n); var g = .5 * (f._tree.prelim + l._tree.prelim);
                    t ? (u.prelim = t._tree.prelim + e(n, t), u.mod = u.prelim - g) : u.prelim = g } else t && (u.prelim = t._tree.prelim + e(n, t)) }

            function a(n, t) { n.x = n._tree.prelim + t; var e = n.children; if (e && (r = e.length)) { var r, u = -1; for (t += n._tree.mod; ++u < r;) a(e[u], t) } }

            function o(n, t, r) { if (t) { for (var u, i = n, a = n, o = t, c = n.parent.children[0], l = i._tree.mod, f = a._tree.mod, s = o._tree.mod, h = c._tree.mod; o = su(o), i = fu(i), o && i;) c = fu(c), a = su(a), a._tree.ancestor = n, u = o._tree.prelim + s - i._tree.prelim - l + e(o, i), u > 0 && (yu(Mu(o, n, r), n, u), l += u, f += u), s += o._tree.mod, l += i._tree.mod, h += c._tree.mod, f += a._tree.mod;
                    o && !su(a) && (a._tree.thread = o, a._tree.mod += s - f), i && !fu(c) && (c._tree.thread = i, c._tree.mod += l - h, r = n) } return r } var c = t.call(this, n, u),
                l = c[0];
            mu(l, function(n, t) { n._tree = { ancestor: n, prelim: 0, mod: 0, change: 0, shift: 0, number: t ? t._tree.number + 1 : 0 } }), i(l), a(l, -l._tree.prelim); var f = hu(l, pu),
                s = hu(l, gu),
                h = hu(l, du),
                g = f.x - e(f, s) / 2,
                p = s.x + e(s, f) / 2,
                d = h.depth || 1; return mu(l, function(n) { n.x = (n.x - g) / (p - g) * r[0], n.y = n.depth / d * r[1], delete n._tree }), c } var t = ca.layout.hierarchy().sort(null).value(null),
            e = lu,
            r = [1, 1]; return n.separation = function(t) { return arguments.length ? (e = t, n) : e }, n.size = function(t) { return arguments.length ? (r = t, n) : r }, Br(n, t) }, ca.layout.pack = function() {
        function n(n, u) { var i = t.call(this, n, u),
                a = i[0];
            a.x = 0, a.y = 0, mu(a, function(n) { n.r = Math.sqrt(n.value) }), mu(a, Su); var o = r[0],
                c = r[1],
                l = Math.max(2 * a.r / o, 2 * a.r / c); if (e > 0) { var f = e * l / 2;
                mu(a, function(n) { n.r += f }), mu(a, Su), mu(a, function(n) { n.r -= f }), l = Math.max(2 * a.r / o, 2 * a.r / c) } return Au(a, o / 2, c / 2, 1 / l), i } var t = ca.layout.hierarchy().sort(xu),
            e = 0,
            r = [1, 1]; return n.size = function(t) { return arguments.length ? (r = t, n) : r }, n.padding = function(t) { return arguments.length ? (e = +t, n) : e }, Br(n, t) }, ca.layout.cluster = function() {
        function n(n, u) { var i, a = t.call(this, n, u),
                o = a[0],
                c = 0;
            mu(o, function(n) { var t = n.children;
                t && t.length ? (n.x = Tu(t), n.y = Nu(t)) : (n.x = i ? c += e(n, i) : 0, n.y = 0, i = n) }); var l = Cu(o),
                f = zu(o),
                s = l.x - e(l, f) / 2,
                h = f.x + e(f, l) / 2; return mu(o, function(n) { n.x = (n.x - s) / (h - s) * r[0], n.y = (1 - (o.y ? n.y / o.y : 1)) * r[1] }), a } var t = ca.layout.hierarchy().sort(null).value(null),
            e = lu,
            r = [1, 1]; return n.separation = function(t) { return arguments.length ? (e = t, n) : e }, n.size = function(t) { return arguments.length ? (r = t, n) : r }, Br(n, t) }, ca.layout.treemap = function() {
        function n(n, t) { for (var e, r, u = -1, i = n.length; ++u < i;) r = (e = n[u]).value * (0 > t ? 0 : t), e.area = isNaN(r) || 0 >= r ? 0 : r }

        function t(e) { var i = e.children; if (i && i.length) { var a, o, c, l = s(e),
                    f = [],
                    h = i.slice(),
                    p = 1 / 0,
                    d = "slice" === g ? l.dx : "dice" === g ? l.dy : "slice-dice" === g ? e.depth & 1 ? l.dy : l.dx : Math.min(l.dx, l.dy); for (n(h, l.dx * l.dy / e.value), f.area = 0;
                    (c = h.length) > 0;) f.push(a = h[c - 1]), f.area += a.area, "squarify" !== g || (o = r(f, d)) <= p ? (h.pop(), p = o) : (f.area -= f.pop().area, u(f, d, l, !1), d = Math.min(l.dx, l.dy), f.length = f.area = 0, p = 1 / 0);
                f.length && (u(f, d, l, !0), f.length = f.area = 0), i.forEach(t) } }

        function e(t) { var r = t.children; if (r && r.length) { var i, a = s(t),
                    o = r.slice(),
                    c = []; for (n(o, a.dx * a.dy / t.value), c.area = 0; i = o.pop();) c.push(i), c.area += i.area, i.z != null && (u(c, i.z ? a.dx : a.dy, a, !o.length), c.length = c.area = 0);
                r.forEach(e) } }

        function r(n, t) { for (var e, r = n.area, u = 0, i = 1 / 0, a = -1, o = n.length; ++a < o;)(e = n[a].area) && (i > e && (i = e), e > u && (u = e)); return r *= r, t *= t, r ? Math.max(t * u * p / r, r / (t * i * p)) : 1 / 0 }

        function u(n, t, e, r) { var u, i = -1,
                a = n.length,
                o = e.x,
                l = e.y,
                f = t ? c(n.area / t) : 0; if (t == e.dx) { for ((r || f > e.dy) && (f = e.dy); ++i < a;) u = n[i], u.x = o, u.y = l, u.dy = f, o += u.dx = Math.min(e.x + e.dx - o, f ? c(u.area / f) : 0);
                u.z = !0, u.dx += e.x + e.dx - o, e.y += f, e.dy -= f } else { for ((r || f > e.dx) && (f = e.dx); ++i < a;) u = n[i], u.x = o, u.y = l, u.dx = f, l += u.dy = Math.min(e.y + e.dy - l, f ? c(u.area / f) : 0);
                u.z = !1, u.dy += e.y + e.dy - l, e.x += f, e.dx -= f } }

        function i(r) { var u = a || o(r),
                i = u[0]; return i.x = 0, i.y = 0, i.dx = l[0], i.dy = l[1], a && o.revalue(i), n([i], i.dx * i.dy / i.value), (a ? e : t)(i), h && (a = u), u } var a, o = ca.layout.hierarchy(),
            c = Math.round,
            l = [1, 1],
            f = null,
            s = Du,
            h = !1,
            g = "squarify",
            p = .5 * (1 + Math.sqrt(5)); return i.size = function(n) { return arguments.length ? (l = n, i) : l }, i.padding = function(n) {
            function t(t) { var e = n.call(i, t, t.depth); return null == e ? Du(t) : ju(t, "number" == typeof e ? [e, e, e, e] : e) }

            function e(t) { return ju(t, n) } if (!arguments.length) return f; var r; return s = (f = n) == null ? Du : (r = typeof n) == "function" ? t : "number" === r ? (n = [n, n, n, n], e) : e, i }, i.round = function(n) { return arguments.length ? (c = n ? Math.round : Number, i) : c != Number }, i.sticky = function(n) { return arguments.length ? (h = n, a = null, i) : h }, i.ratio = function(n) { return arguments.length ? (p = n, i) : p }, i.mode = function(n) { return arguments.length ? (g = n + "", i) : g }, Br(i, o) }, ca.random = { normal: function(n, t) { var e = arguments.length; return 2 > e && (t = 1), 1 > e && (n = 0),
                function() { var e, r, u;
                    do e = Math.random() * 2 - 1, r = Math.random() * 2 - 1, u = e * e + r * r; while (!u || u > 1); return n + t * e * Math.sqrt(-2 * Math.log(u) / u) } }, logNormal: function() { var n = ca.random.normal.apply(ca, arguments); return function() { return Math.exp(n()) } }, irwinHall: function(n) { return function() { for (var t = 0, e = 0; n > e; e++) t += Math.random(); return t / n } } }, ca.scale = {}, ca.scale.linear = function() { return Ou([0, 1], [0, 1], vr, !1) }, ca.scale.log = function() { return Zu(ca.scale.linear().domain([0, Math.LN10]), 10, Bu, $u) };
    var Jo = ca.format(".0e");
    ca.scale.pow = function() { return Wu(ca.scale.linear(), 1) }, ca.scale.sqrt = function() { return ca.scale.pow().exponent(.5) }, ca.scale.ordinal = function() { return ni([], { t: "range", a: [
                []
            ] }) }, ca.scale.category10 = function() { return ca.scale.ordinal().range(Go) }, ca.scale.category20 = function() { return ca.scale.ordinal().range(Ko) }, ca.scale.category20b = function() { return ca.scale.ordinal().range(Wo) }, ca.scale.category20c = function() { return ca.scale.ordinal().range(Qo) };
    var Go = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        Ko = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
        Wo = ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"],
        Qo = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
    ca.scale.quantile = function() { return ti([], []) }, ca.scale.quantize = function() { return ei(0, 1, [0, 1]) }, ca.scale.threshold = function() { return ri([.5], [0, 1]) }, ca.scale.identity = function() { return ui([0, 1]) }, ca.svg.arc = function() {
        function n() { var n = t.apply(this, arguments),
                i = e.apply(this, arguments),
                a = r.apply(this, arguments) + nc,
                o = u.apply(this, arguments) + nc,
                c = (a > o && (c = a, a = o, o = c), o - a),
                l = Fa > c ? "0" : "1",
                f = Math.cos(a),
                s = Math.sin(a),
                h = Math.cos(o),
                g = Math.sin(o); return c >= tc ? n ? "M0," + i + "A" + i + "," + i + " 0 1,1 0," + -i + "A" + i + "," + i + " 0 1,1 0," + i + "M0," + n + "A" + n + "," + n + " 0 1,0 0," + -n + "A" + n + "," + n + " 0 1,0 0," + n + "Z" : "M0," + i + "A" + i + "," + i + " 0 1,1 0," + -i + "A" + i + "," + i + " 0 1,1 0," + i + "Z" : n ? "M" + i * f + "," + i * s + "A" + i + "," + i + " 0 " + l + ",1 " + i * h + "," + i * g + "L" + n * h + "," + n * g + "A" + n + "," + n + " 0 " + l + ",0 " + n * f + "," + n * s + "Z" : "M" + i * f + "," + i * s + "A" + i + "," + i + " 0 " + l + ",1 " + i * h + "," + i * g + "L0,0" + "Z" } var t = ii,
            e = ai,
            r = oi,
            u = ci; return n.innerRadius = function(e) { return arguments.length ? (t = ft(e), n) : t }, n.outerRadius = function(t) { return arguments.length ? (e = ft(t), n) : e }, n.startAngle = function(t) { return arguments.length ? (r = ft(t), n) : r }, n.endAngle = function(t) { return arguments.length ? (u = ft(t), n) : u }, n.centroid = function() { var n = (t.apply(this, arguments) + e.apply(this, arguments)) / 2,
                i = (r.apply(this, arguments) + u.apply(this, arguments)) / 2 + nc; return [Math.cos(i) * n, Math.sin(i) * n] }, n };
    var nc = -Fa / 2,
        tc = 2 * Fa - 1e-6;
    ca.svg.line.radial = function() { var n = ze(li); return n.radius = n.x, delete n.x, n.angle = n.y, delete n.y, n }, He.reverse = Pe, Pe.reverse = He, ca.svg.area = function() { return fi(st) }, ca.svg.area.radial = function() { var n = fi(li); return n.radius = n.x, delete n.x, n.innerRadius = n.x0, delete n.x0, n.outerRadius = n.x1, delete n.x1, n.angle = n.y, delete n.y, n.startAngle = n.y0, delete n.y0, n.endAngle = n.y1, delete n.y1, n }, ca.svg.chord = function() {
        function n(n, o) { var c = t(this, i, n, o),
                l = t(this, a, n, o); return "M" + c.p0 + r(c.r, c.p1, c.a1 - c.a0) + (e(c, l) ? u(c.r, c.p1, c.r, c.p0) : u(c.r, c.p1, l.r, l.p0) + r(l.r, l.p1, l.a1 - l.a0) + u(l.r, l.p1, c.r, c.p0)) + "Z" }

        function t(n, t, e, r) { var u = t.call(n, e, r),
                i = o.call(n, u, r),
                a = c.call(n, u, r) + nc,
                f = l.call(n, u, r) + nc; return { r: i, a0: a, a1: f, p0: [i * Math.cos(a), i * Math.sin(a)], p1: [i * Math.cos(f), i * Math.sin(f)] } }

        function e(n, t) { return n.a0 == t.a0 && n.a1 == t.a1 }

        function r(n, t, e) { return "A" + n + "," + n + " 0 " + +(e > Fa) + ",1 " + t }

        function u(n, t, e, r) { return "Q 0,0 " + r } var i = fe,
            a = se,
            o = si,
            c = oi,
            l = ci; return n.radius = function(t) { return arguments.length ? (o = ft(t), n) : o }, n.source = function(t) { return arguments.length ? (i = ft(t), n) : i }, n.target = function(t) { return arguments.length ? (a = ft(t), n) : a }, n.startAngle = function(t) { return arguments.length ? (c = ft(t), n) : c }, n.endAngle = function(t) { return arguments.length ? (l = ft(t), n) : l }, n }, ca.svg.diagonal = function() {
        function n(n, u) { var i = t.call(this, n, u),
                a = e.call(this, n, u),
                o = (i.y + a.y) / 2,
                c = [i, { x: i.x, y: o }, { x: a.x, y: o }, a]; return c = c.map(r), "M" + c[0] + "C" + c[1] + " " + c[2] + " " + c[3] } var t = fe,
            e = se,
            r = hi; return n.source = function(e) { return arguments.length ? (t = ft(e), n) : t }, n.target = function(t) { return arguments.length ? (e = ft(t), n) : e }, n.projection = function(t) { return arguments.length ? (r = t, n) : r }, n }, ca.svg.diagonal.radial = function() { var n = ca.svg.diagonal(),
            t = hi,
            e = n.projection; return n.projection = function(n) { return arguments.length ? e(gi(t = n)) : t }, n }, ca.svg.symbol = function() {
        function n(n, r) { return (ec.get(t.call(this, n, r)) || mi)(e.call(this, n, r)) } var t = di,
            e = pi; return n.type = function(e) { return arguments.length ? (t = ft(e), n) : t }, n.size = function(t) { return arguments.length ? (e = ft(t), n) : e }, n };
    var ec = ca.map({ circle: mi, cross: function(n) { var t = Math.sqrt(n / 5) / 2; return "M" + -3 * t + "," + -t + "H" + -t + "V" + -3 * t + "H" + t + "V" + -t + "H" + 3 * t + "V" + t + "H" + t + "V" + 3 * t + "H" + -t + "V" + t + "H" + -3 * t + "Z" }, diamond: function(n) { var t = Math.sqrt(n / (2 * ic)),
                e = t * ic; return "M0," + -t + "L" + e + ",0" + " 0," + t + " " + -e + ",0" + "Z" }, square: function(n) { var t = Math.sqrt(n) / 2; return "M" + -t + "," + -t + "L" + t + "," + -t + " " + t + "," + t + " " + -t + "," + t + "Z" }, "triangle-down": function(n) { var t = Math.sqrt(n / uc),
                e = t * uc / 2; return "M0," + e + "L" + t + "," + -e + " " + -t + "," + -e + "Z" }, "triangle-up": function(n) { var t = Math.sqrt(n / uc),
                e = t * uc / 2; return "M0," + -e + "L" + t + "," + e + " " + -t + "," + e + "Z" } });
    ca.svg.symbolTypes = ec.keys();
    var rc, uc = Math.sqrt(3),
        ic = Math.tan(30 * Pa),
        ac = [],
        oc = 0,
        cc = { ease: Er, delay: 0, duration: 250 };
    ac.call = ka.call, ac.empty = ka.empty, ac.node = ka.node, ca.transition = function(n) { return arguments.length ? rc ? n.transition() : n : Ca.transition() }, ca.transition.prototype = ac, ac.select = function(n) { var t, e, r, u = this.id,
            i = []; "function" != typeof n && (n = v(n)); for (var a = -1, o = this.length; ++a < o;) { i.push(t = []); for (var c = this[a], l = -1, f = c.length; ++l < f;)(r = c[l]) && (e = n.call(r, r.__data__, l)) ? ("__data__" in r && (e.__data__ = r.__data__), xi(e, l, u, r.__transition__[u]), t.push(e)) : t.push(null) } return vi(i, u) }, ac.selectAll = function(n) { var t, e, r, u, i, a = this.id,
            o = []; "function" != typeof n && (n = y(n)); for (var c = -1, l = this.length; ++c < l;)
            for (var f = this[c], s = -1, h = f.length; ++s < h;)
                if (r = f[s]) { i = r.__transition__[a], e = n.call(r, r.__data__, s), o.push(t = []); for (var g = -1, p = e.length; ++g < p;) xi(u = e[g], g, a, i), t.push(u) } return vi(o, a) }, ac.filter = function(n) { var t, e, r, u = []; "function" != typeof n && (n = q(n)); for (var i = 0, a = this.length; a > i; i++) { u.push(t = []); for (var e = this[i], o = 0, c = e.length; c > o; o++)(r = e[o]) && n.call(r, r.__data__, o) && t.push(r) } return vi(u, this.id, this.time).ease(this.ease()) }, ac.tween = function(n, t) { var e = this.id; return arguments.length < 2 ? this.node().__transition__[e].tween.get(n) : j(this, null == t ? function(t) { t.__transition__[e].tween.remove(n) } : function(r) { r.__transition__[e].tween.set(n, t) }) }, ac.attr = function(n, t) {
        function e() { this.removeAttribute(i) }

        function r() { this.removeAttributeNS(i.space, i.local) } if (arguments.length < 2) { for (t in n) this.attr(t, n[t]); return this } var u = yr(n),
            i = ca.ns.qualify(n); return yi(this, "attr." + n, t, function(n) {
            function t() { var t, e = this.getAttribute(i); return e !== n && (t = u(e, n), function(n) { this.setAttribute(i, t(n)) }) }

            function a() { var t, e = this.getAttributeNS(i.space, i.local); return e !== n && (t = u(e, n), function(n) { this.setAttributeNS(i.space, i.local, t(n)) }) } return null == n ? i.local ? r : e : (n += "", i.local ? a : t) }) }, ac.attrTween = function(n, t) {
        function e(n, e) { var r = t.call(this, n, e, this.getAttribute(u)); return r && function(n) { this.setAttribute(u, r(n)) } }

        function r(n, e) { var r = t.call(this, n, e, this.getAttributeNS(u.space, u.local)); return r && function(n) { this.setAttributeNS(u.space, u.local, r(n)) } } var u = ca.ns.qualify(n); return this.tween("attr." + n, u.local ? r : e) }, ac.style = function(n, t, e) {
        function r() { this.style.removeProperty(n) } var u = arguments.length; if (3 > u) { if ("string" != typeof n) { 2 > u && (t = ""); for (e in n) this.style(e, n[e], t); return this } e = "" } var i = yr(n); return yi(this, "style." + n, t, function(t) {
            function u() { var r, u = fa.getComputedStyle(this, null).getPropertyValue(n); return u !== t && (r = i(u, t), function(t) { this.style.setProperty(n, r(t), e) }) } return null == t ? r : (t += "", u) }) }, ac.styleTween = function(n, t, e) { return arguments.length < 3 && (e = ""), this.tween("style." + n, function(r, u) { var i = t.call(this, r, u, fa.getComputedStyle(this, null).getPropertyValue(n)); return i && function(t) { this.style.setProperty(n, i(t), e) } }) }, ac.text = function(n) { return yi(this, "text", n, Mi) }, ac.remove = function() { return this.each("end.transition", function() { var n;!this.__transition__ && (n = this.parentNode) && n.removeChild(this) }) }, ac.ease = function(n) { var t = this.id; return arguments.length < 1 ? this.node().__transition__[t].ease : ("function" != typeof n && (n = ca.ease.apply(ca, arguments)), j(this, function(e) { e.__transition__[t].ease = n })) }, ac.delay = function(n) { var t = this.id; return j(this, "function" == typeof n ? function(e, r, u) { e.__transition__[t].delay = n.call(e, e.__data__, r, u) | 0 } : (n |= 0, function(e) { e.__transition__[t].delay = n })) }, ac.duration = function(n) { var t = this.id; return j(this, "function" == typeof n ? function(e, r, u) { e.__transition__[t].duration = Math.max(1, n.call(e, e.__data__, r, u) | 0) } : (n = Math.max(1, 0 | n), function(e) { e.__transition__[t].duration = n })) }, ac.each = function(n, t) { var e = this.id; if (arguments.length < 2) { var r = cc,
                u = rc;
            rc = e, j(this, function(t, r, u) { cc = t.__transition__[e], n.call(t, t.__data__, r, u) }), cc = r, rc = u } else j(this, function(r) { r.__transition__[e].event.on(n, t) }); return this }, ac.transition = function() { for (var n, t, e, r, u = this.id, i = ++oc, a = [], o = 0, c = this.length; c > o; o++) { a.push(n = []); for (var t = this[o], l = 0, f = t.length; f > l; l++)(e = t[l]) && (r = Object.create(e.__transition__[u]), r.delay += r.duration, xi(e, l, i, r)), n.push(e) } return vi(a, i) }, ca.svg.axis = function() {
        function n(n) { n.each(function() { var n, s = ca.select(this),
                    h = null == l ? e.ticks ? e.ticks.apply(e, c) : e.domain() : l,
                    g = null == t ? e.tickFormat ? e.tickFormat.apply(e, c) : String : t,
                    p = wi(e, h, f),
                    d = s.selectAll(".tick.minor").data(p, String),
                    m = d.enter().insert("line", ".tick").attr("class", "tick minor").style("opacity", 1e-6),
                    v = ca.transition(d.exit()).style("opacity", 1e-6).remove(),
                    y = ca.transition(d).style("opacity", 1),
                    M = s.selectAll(".tick.major").data(h, String),
                    x = M.enter().insert("g", "path").attr("class", "tick major").style("opacity", 1e-6),
                    b = ca.transition(M.exit()).style("opacity", 1e-6).remove(),
                    _ = ca.transition(M).style("opacity", 1),
                    w = Fu(e),
                    S = s.selectAll(".domain").data([0]),
                    E = (S.enter().append("path").attr("class", "domain"), ca.transition(S)),
                    k = e.copy(),
                    A = this.__chart__ || k;
                this.__chart__ = k, x.append("line"), x.append("text"); var q = x.select("line"),
                    N = _.select("line"),
                    T = M.select("text").text(g),
                    C = x.select("text"),
                    z = _.select("text"); switch (r) {
                    case "bottom":
                        n = bi, m.attr("y2", i), y.attr("x2", 0).attr("y2", i), q.attr("y2", u), C.attr("y", Math.max(u, 0) + o), N.attr("x2", 0).attr("y2", u), z.attr("x", 0).attr("y", Math.max(u, 0) + o), T.attr("dy", ".71em").style("text-anchor", "middle"), E.attr("d", "M" + w[0] + "," + a + "V0H" + w[1] + "V" + a); break;
                    case "top":
                        n = bi, m.attr("y2", -i), y.attr("x2", 0).attr("y2", -i), q.attr("y2", -u), C.attr("y", -(Math.max(u, 0) + o)), N.attr("x2", 0).attr("y2", -u), z.attr("x", 0).attr("y", -(Math.max(u, 0) + o)), T.attr("dy", "0em").style("text-anchor", "middle"), E.attr("d", "M" + w[0] + "," + -a + "V0H" + w[1] + "V" + -a); break;
                    case "left":
                        n = _i, m.attr("x2", -i), y.attr("x2", -i).attr("y2", 0), q.attr("x2", -u), C.attr("x", -(Math.max(u, 0) + o)), N.attr("x2", -u).attr("y2", 0), z.attr("x", -(Math.max(u, 0) + o)).attr("y", 0), T.attr("dy", ".32em").style("text-anchor", "end"), E.attr("d", "M" + -a + "," + w[0] + "H0V" + w[1] + "H" + -a); break;
                    case "right":
                        n = _i, m.attr("x2", i), y.attr("x2", i).attr("y2", 0), q.attr("x2", u), C.attr("x", Math.max(u, 0) + o), N.attr("x2", u).attr("y2", 0), z.attr("x", Math.max(u, 0) + o).attr("y", 0), T.attr("dy", ".32em").style("text-anchor", "start"), E.attr("d", "M" + a + "," + w[0] + "H0V" + w[1] + "H" + a) } if (e.ticks) x.call(n, A), _.call(n, k), b.call(n, k), m.call(n, A), y.call(n, k), v.call(n, k);
                else { var D = k.rangeBand() / 2,
                        j = function(n) { return k(n) + D };
                    x.call(n, j), _.call(n, j) } }) } var t, e = ca.scale.linear(),
            r = lc,
            u = 6,
            i = 6,
            a = 6,
            o = 3,
            c = [10],
            l = null,
            f = 0; return n.scale = function(t) { return arguments.length ? (e = t, n) : e }, n.orient = function(t) { return arguments.length ? (r = t in fc ? t + "" : lc, n) : r }, n.ticks = function() { return arguments.length ? (c = arguments, n) : c }, n.tickValues = function(t) { return arguments.length ? (l = t, n) : l }, n.tickFormat = function(e) { return arguments.length ? (t = e, n) : t }, n.tickSize = function(t, e) { if (!arguments.length) return u; var r = arguments.length - 1; return u = +t, i = r > 1 ? +e : u, a = r > 0 ? +arguments[r] : u, n }, n.tickPadding = function(t) { return arguments.length ? (o = +t, n) : o }, n.tickSubdivide = function(t) { return arguments.length ? (f = +t, n) : f }, n };
    var lc = "bottom",
        fc = { top: 1, right: 1, bottom: 1, left: 1 };
    ca.svg.brush = function() {
        function n(i) { i.each(function() { var i, a = ca.select(this),
                    l = a.selectAll(".background").data([0]),
                    s = a.selectAll(".extent").data([0]),
                    h = a.selectAll(".resize").data(f, String);
                a.style("pointer-events", "all").on("mousedown.brush", u).on("touchstart.brush", u), l.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair"), s.enter().append("rect").attr("class", "extent").style("cursor", "move"), h.enter().append("g").attr("class", function(n) { return "resize " + n }).style("cursor", function(n) { return sc[n] }).append("rect").attr("x", function(n) { return /[ew]$/.test(n) ? -3 : null }).attr("y", function(n) { return /^[ns]/.test(n) ? -3 : null }).attr("width", 6).attr("height", 6).style("visibility", "hidden"), h.style("display", n.empty() ? "none" : null), h.exit().remove(), o && (i = Fu(o), l.attr("x", i[0]).attr("width", i[1] - i[0]), e(a)), c && (i = Fu(c), l.attr("y", i[0]).attr("height", i[1] - i[0]), r(a)), t(a) }) }

        function t(n) { n.selectAll(".resize").attr("transform", function(n) { return "translate(" + s[+/e$/.test(n)][0] + "," + s[+/^s/.test(n)][1] + ")" }) }

        function e(n) { n.select(".extent").attr("x", s[0][0]), n.selectAll(".extent,.n>rect,.s>rect").attr("width", s[1][0] - s[0][0]) }

        function r(n) { n.select(".extent").attr("y", s[0][1]), n.selectAll(".extent,.e>rect,.w>rect").attr("height", s[1][1] - s[0][1]) }

        function u() {
            function u() { var n = ca.event.changedTouches; return n ? ca.touches(y, n)[0] : ca.mouse(y) }

            function f() { ca.event.keyCode == 32 && (E || (m = null, k[0] -= s[1][0], k[1] -= s[1][1], E = 2), l()) }

            function h() { ca.event.keyCode == 32 && 2 == E && (k[0] += s[1][0], k[1] += s[1][1], E = 0, l()) }

            function g() { var n = u(),
                    i = !1;
                v && (n[0] += v[0], n[1] += v[1]), E || (ca.event.altKey ? (m || (m = [(s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2]), k[0] = s[+(n[0] < m[0])][0], k[1] = s[+(n[1] < m[1])][1]) : m = null), w && p(n, o, 0) && (e(b), i = !0), S && p(n, c, 1) && (r(b), i = !0), i && (t(b), x({ type: "brush", mode: E ? "move" : "resize" })) }

            function p(n, t, e) { var r, u, a = Fu(t),
                    o = a[0],
                    c = a[1],
                    l = k[e],
                    f = s[1][e] - s[0][e]; return E && (o -= l, c -= f + l), r = Math.max(o, Math.min(c, n[e])), E ? u = (r += l) + f : (m && (l = Math.max(o, Math.min(c, 2 * m[e] - r))), r > l ? (u = r, r = l) : u = l), s[0][e] !== r || s[1][e] !== u ? (i = null, s[0][e] = r, s[1][e] = u, !0) : void 0 }

            function d() { g(), b.style("pointer-events", "all").selectAll(".resize").style("display", n.empty() ? "none" : null), ca.select("body").style("cursor", null), A.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null), x({ type: "brushend" }), l() } var m, v, y = this,
                M = ca.select(ca.event.target),
                x = a.of(y, arguments),
                b = ca.select(y),
                _ = M.datum(),
                w = !/^(n|s)$/.test(_) && o,
                S = !/^(e|w)$/.test(_) && c,
                E = M.classed("extent"),
                k = u(),
                A = ca.select(fa).on("mousemove.brush", g).on("mouseup.brush", d).on("touchmove.brush", g).on("touchend.brush", d).on("keydown.brush", f).on("keyup.brush", h); if (E) k[0] = s[0][0] - k[0], k[1] = s[0][1] - k[1];
            else if (_) { var q = +/w$/.test(_),
                    N = +/^n/.test(_);
                v = [s[1 - q][0] - k[0], s[1 - N][1] - k[1]], k[0] = s[q][0], k[1] = s[N][1] } else ca.event.altKey && (m = k.slice());
            b.style("pointer-events", "none").selectAll(".resize").style("display", null), ca.select("body").style("cursor", M.style("cursor")), x({ type: "brushstart" }), g(), l() }
        var i, a = h(n, "brushstart", "brush", "brushend"),
            o = null,
            c = null,
            f = hc[0],
            s = [
                [0, 0],
                [0, 0]
            ];
        return n.x = function(t) {
            return arguments.length ? (o = t, f = hc[!o << 1 | !c], n) : o
        }, n.y = function(t) { return arguments.length ? (c = t, f = hc[!o << 1 | !c], n) : c }, n.extent = function(t) { var e, r, u, a, l; return arguments.length ? (i = [
                [0, 0],
                [0, 0]
            ], o && (e = t[0], r = t[1], c && (e = e[0], r = r[0]), i[0][0] = e, i[1][0] = r, o.invert && (e = o(e), r = o(r)), e > r && (l = e, e = r, r = l), s[0][0] = 0 | e, s[1][0] = 0 | r), c && (u = t[0], a = t[1], o && (u = u[1], a = a[1]), i[0][1] = u, i[1][1] = a, c.invert && (u = c(u), a = c(a)), u > a && (l = u, u = a, a = l), s[0][1] = 0 | u, s[1][1] = 0 | a), n) : (t = i || s, o && (e = t[0][0], r = t[1][0], i || (e = s[0][0], r = s[1][0], o.invert && (e = o.invert(e), r = o.invert(r)), e > r && (l = e, e = r, r = l))), c && (u = t[0][1], a = t[1][1], i || (u = s[0][1], a = s[1][1], c.invert && (u = c.invert(u), a = c.invert(a)), u > a && (l = u, u = a, a = l))), o && c ? [
                [e, u],
                [r, a]
            ] : o ? [e, r] : c && [u, a]) }, n.clear = function() { return i = null, s[0][0] = s[0][1] = s[1][0] = s[1][1] = 0, n }, n.empty = function() { return o && s[0][0] === s[1][0] || c && s[0][1] === s[1][1] }, ca.rebind(n, a, "on")
    };
    var sc = { n: "ns-resize", e: "ew-resize", s: "ns-resize", w: "ew-resize", nw: "nwse-resize", ne: "nesw-resize", se: "nwse-resize", sw: "nesw-resize" },
        hc = [
            ["n", "e", "s", "w", "nw", "ne", "se", "sw"],
            ["e", "w"],
            ["n", "s"],
            []
        ];
    ca.time = {};
    var gc = Date,
        pc = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    Si.prototype = { getDate: function() { return this._.getUTCDate() }, getDay: function() { return this._.getUTCDay() }, getFullYear: function() { return this._.getUTCFullYear() }, getHours: function() { return this._.getUTCHours() }, getMilliseconds: function() { return this._.getUTCMilliseconds() }, getMinutes: function() { return this._.getUTCMinutes() }, getMonth: function() { return this._.getUTCMonth() }, getSeconds: function() { return this._.getUTCSeconds() }, getTime: function() { return this._.getTime() }, getTimezoneOffset: function() { return 0 }, valueOf: function() { return this._.valueOf() }, setDate: function() { dc.setUTCDate.apply(this._, arguments) }, setDay: function() { dc.setUTCDay.apply(this._, arguments) }, setFullYear: function() { dc.setUTCFullYear.apply(this._, arguments) }, setHours: function() { dc.setUTCHours.apply(this._, arguments) }, setMilliseconds: function() { dc.setUTCMilliseconds.apply(this._, arguments) }, setMinutes: function() { dc.setUTCMinutes.apply(this._, arguments) }, setMonth: function() { dc.setUTCMonth.apply(this._, arguments) }, setSeconds: function() { dc.setUTCSeconds.apply(this._, arguments) }, setTime: function() { dc.setTime.apply(this._, arguments) } };
    var dc = Date.prototype,
        mc = "%a %b %e %X %Y",
        vc = "%m/%d/%Y",
        yc = "%H:%M:%S",
        Mc = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        xc = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        bc = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        _c = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    ca.time.year = Ei(function(n) { return n = ca.time.day(n), n.setMonth(0, 1), n }, function(n, t) { n.setFullYear(n.getFullYear() + t) }, function(n) { return n.getFullYear() }), ca.time.years = ca.time.year.range, ca.time.years.utc = ca.time.year.utc.range, ca.time.day = Ei(function(n) { var t = new gc(1970, 0); return t.setFullYear(n.getFullYear(), n.getMonth(), n.getDate()), t }, function(n, t) { n.setDate(n.getDate() + t) }, function(n) { return n.getDate() - 1 }), ca.time.days = ca.time.day.range, ca.time.days.utc = ca.time.day.utc.range, ca.time.dayOfYear = function(n) { var t = ca.time.year(n); return Math.floor((n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * 6e4) / 864e5) }, pc.forEach(function(n, t) { n = n.toLowerCase(), t = 7 - t; var e = ca.time[n] = Ei(function(n) { return (n = ca.time.day(n)).setDate(n.getDate() - (n.getDay() + t) % 7), n }, function(n, t) { n.setDate(n.getDate() + Math.floor(t) * 7) }, function(n) { var e = ca.time.year(n).getDay(); return Math.floor((ca.time.dayOfYear(n) + (e + t) % 7) / 7) - (e !== t) });
        ca.time[n + "s"] = e.range, ca.time[n + "s"].utc = e.utc.range, ca.time[n + "OfYear"] = function(n) { var e = ca.time.year(n).getDay(); return Math.floor((ca.time.dayOfYear(n) + (e + t) % 7) / 7) } }), ca.time.week = ca.time.sunday, ca.time.weeks = ca.time.sunday.range, ca.time.weeks.utc = ca.time.sunday.utc.range, ca.time.weekOfYear = ca.time.sundayOfYear, ca.time.format = function(n) {
        function t(t) { for (var r, u, i, a = [], o = -1, c = 0; ++o < e;) n.charCodeAt(o) === 37 && (a.push(n.substring(c, o)), (u = Nc[r = n.charAt(++o)]) != null && (r = n.charAt(++o)), (i = Tc[r]) && (r = i(t, null == u ? "e" === r ? " " : "0" : u)), a.push(r), c = o + 1); return a.push(n.substring(c, o)), a.join("") } var e = n.length; return t.parse = function(t) { var e = { y: 1900, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 },
                r = Ai(e, n, t, 0); if (r != t.length) return null; "p" in e && (e.H = e.H % 12 + e.p * 12); var u = new gc; return u.setFullYear(e.y, e.m, e.d), u.setHours(e.H, e.M, e.S, e.L), u }, t.toString = function() { return n }, t };
    var wc = qi(Mc),
        Sc = qi(xc),
        Ec = qi(bc),
        kc = Ni(bc),
        Ac = qi(_c),
        qc = Ni(_c),
        Nc = { "-": "", _: " ", 0: "0" },
        Tc = { a: function(n) { return xc[n.getDay()] }, A: function(n) { return Mc[n.getDay()] }, b: function(n) { return _c[n.getMonth()] }, B: function(n) { return bc[n.getMonth()] }, c: ca.time.format(mc), d: function(n, t) { return Ti(n.getDate(), t, 2) }, e: function(n, t) { return Ti(n.getDate(), t, 2) }, H: function(n, t) { return Ti(n.getHours(), t, 2) }, I: function(n, t) { return Ti(n.getHours() % 12 || 12, t, 2) }, j: function(n, t) { return Ti(1 + ca.time.dayOfYear(n), t, 3) }, L: function(n, t) { return Ti(n.getMilliseconds(), t, 3) }, m: function(n, t) { return Ti(n.getMonth() + 1, t, 2) }, M: function(n, t) { return Ti(n.getMinutes(), t, 2) }, p: function(n) { return n.getHours() >= 12 ? "PM" : "AM" }, S: function(n, t) { return Ti(n.getSeconds(), t, 2) }, U: function(n, t) { return Ti(ca.time.sundayOfYear(n), t, 2) }, w: function(n) { return n.getDay() }, W: function(n, t) { return Ti(ca.time.mondayOfYear(n), t, 2) }, x: ca.time.format(vc), X: ca.time.format(yc), y: function(n, t) { return Ti(n.getFullYear() % 100, t, 2) }, Y: function(n, t) { return Ti(n.getFullYear() % 1e4, t, 4) }, Z: $i, "%": function() { return "%" } },
        Cc = { a: Ci, A: zi, b: Di, B: ji, c: Li, d: Ui, e: Ui, H: Ii, I: Ii, L: Zi, m: Yi, M: Vi, p: Bi, S: Xi, x: Fi, X: Hi, y: Ri, Y: Pi },
        zc = /^\s*\d+/,
        Dc = ca.map({ am: 0, pm: 1 });
    ca.time.format.utc = function(n) {
        function t(n) { try { gc = Si; var t = new gc; return t._ = n, e(t) } finally { gc = Date } } var e = ca.time.format(n); return t.parse = function(n) { try { gc = Si; var t = e.parse(n); return t && t._ } finally { gc = Date } }, t.toString = e.toString, t };
    var jc = ca.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
    ca.time.format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? Ji : jc, Ji.parse = function(n) { var t = new Date(n); return isNaN(t) ? null : t }, Ji.toString = jc.toString, ca.time.second = Ei(function(n) { return new gc(Math.floor(n / 1e3) * 1e3) }, function(n, t) { n.setTime(n.getTime() + Math.floor(t) * 1e3) }, function(n) { return n.getSeconds() }), ca.time.seconds = ca.time.second.range, ca.time.seconds.utc = ca.time.second.utc.range, ca.time.minute = Ei(function(n) { return new gc(Math.floor(n / 6e4) * 6e4) }, function(n, t) { n.setTime(n.getTime() + Math.floor(t) * 6e4) }, function(n) { return n.getMinutes() }), ca.time.minutes = ca.time.minute.range, ca.time.minutes.utc = ca.time.minute.utc.range, ca.time.hour = Ei(function(n) { var t = n.getTimezoneOffset() / 60; return new gc((Math.floor(n / 36e5 - t) + t) * 36e5) }, function(n, t) { n.setTime(n.getTime() + Math.floor(t) * 36e5) }, function(n) { return n.getHours() }), ca.time.hours = ca.time.hour.range, ca.time.hours.utc = ca.time.hour.utc.range, ca.time.month = Ei(function(n) { return n = ca.time.day(n), n.setDate(1), n }, function(n, t) { n.setMonth(n.getMonth() + t) }, function(n) { return n.getMonth() }), ca.time.months = ca.time.month.range, ca.time.months.utc = ca.time.month.utc.range;
    var Lc = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6],
        Fc = [
            [ca.time.second, 1],
            [ca.time.second, 5],
            [ca.time.second, 15],
            [ca.time.second, 30],
            [ca.time.minute, 1],
            [ca.time.minute, 5],
            [ca.time.minute, 15],
            [ca.time.minute, 30],
            [ca.time.hour, 1],
            [ca.time.hour, 3],
            [ca.time.hour, 6],
            [ca.time.hour, 12],
            [ca.time.day, 1],
            [ca.time.day, 2],
            [ca.time.week, 1],
            [ca.time.month, 1],
            [ca.time.month, 3],
            [ca.time.year, 1]
        ],
        Hc = [
            [ca.time.format("%Y"), jt],
            [ca.time.format("%B"), function(n) { return n.getMonth() }],
            [ca.time.format("%b %d"), function(n) { return n.getDate() != 1 }],
            [ca.time.format("%a %d"), function(n) { return n.getDay() && n.getDate() != 1 }],
            [ca.time.format("%I %p"), function(n) { return n.getHours() }],
            [ca.time.format("%I:%M"), function(n) { return n.getMinutes() }],
            [ca.time.format(":%S"), function(n) { return n.getSeconds() }],
            [ca.time.format(".%L"), function(n) { return n.getMilliseconds() }]
        ],
        Pc = ca.scale.linear(),
        Rc = Qi(Hc);
    Fc.year = function(n, t) { return Pc.domain(n.map(ta)).ticks(t).map(na) }, ca.time.scale = function() { return Gi(ca.scale.linear(), Fc, Rc) };
    var Oc = Fc.map(function(n) { return [n[0].utc, n[1]] }),
        Yc = [
            [ca.time.format.utc("%Y"), jt],
            [ca.time.format.utc("%B"), function(n) { return n.getUTCMonth() }],
            [ca.time.format.utc("%b %d"), function(n) { return n.getUTCDate() != 1 }],
            [ca.time.format.utc("%a %d"), function(n) { return n.getUTCDay() && n.getUTCDate() != 1 }],
            [ca.time.format.utc("%I %p"), function(n) { return n.getUTCHours() }],
            [ca.time.format.utc("%I:%M"), function(n) { return n.getUTCMinutes() }],
            [ca.time.format.utc(":%S"), function(n) { return n.getUTCSeconds() }],
            [ca.time.format.utc(".%L"), function(n) { return n.getUTCMilliseconds() }]
        ],
        Uc = Qi(Yc);
    return Oc.year = function(n, t) { return Pc.domain(n.map(ra)).ticks(t).map(ea) }, ca.time.scale.utc = function() { return Gi(ca.scale.linear(), Oc, Uc) }, ca.text = function() { return ca.xhr.apply(ca, arguments).response(ua) }, ca.json = function(n, t) { return ca.xhr(n, "application/json", t).response(ia) }, ca.html = function(n, t) { return ca.xhr(n, "text/html", t).response(aa) }, ca.xml = function() { return ca.xhr.apply(ca, arguments).response(oa) }, ca
}();