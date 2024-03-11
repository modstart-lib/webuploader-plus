/**
 * Browser Image Compression
 * v2.0.2
 * by Donald <donaldcwl@gmail.com>
 * https://github.com/Donaldcwl/browser-image-compression
 */
define([
    '../base',
    './blob'
], function (Base, Blob) {

    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var _a;
    function _mergeNamespaces(e, t) {
        return t.forEach((function (t) {
            t && "string" != typeof t && !Array.isArray(t) && Object.keys(t).forEach((function (r) {
                if ("default" !== r && !(r in e)) {
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    Object.defineProperty(e, r, i.get ? i : {
                        enumerable: !0, get: function () {
                            return t[r];
                        }
                    });
                }
            }));
        })), Object.freeze(e);
    }
    function copyExifWithoutOrientation(e, t) {
        return new Promise((function (r, i) {
            var o;
            return getApp1Segment(e).then((function (e) {
                try {
                    return o = e, r(new Blob([t.slice(0, 2), o, t.slice(2)], { type: "image/jpeg" }));
                }
                catch (e) {
                    return i(e);
                }
            }), i);
        }));
    }
    var getApp1Segment = function (e) { return new Promise((function (t, r) {
        var i = new FileReader;
        i.addEventListener("load", (function (_a) {
            var e = _a.target.result;
            var i = new DataView(e);
            var o = 0;
            if (65496 !== i.getUint16(o))
                return r("not a valid JPEG");
            for (o += 2;;) {
                var a_1 = i.getUint16(o);
                if (65498 === a_1)
                    break;
                var s_1 = i.getUint16(o + 2);
                if (65505 === a_1 && 1165519206 === i.getUint32(o + 4)) {
                    var a_2 = o + 10;
                    var f_1 = void 0;
                    switch (i.getUint16(a_2)) {
                        case 18761:
                            f_1 = !0;
                            break;
                        case 19789:
                            f_1 = !1;
                            break;
                        default:
                            return r("TIFF header contains invalid endian");
                    }
                    if (42 !== i.getUint16(a_2 + 2, f_1))
                        return r("TIFF header contains invalid version");
                    var l_1 = i.getUint32(a_2 + 4, f_1), c = a_2 + l_1 + 2 + 12 * i.getUint16(a_2 + l_1, f_1);
                    for (var e_1 = a_2 + l_1 + 2; e_1 < c; e_1 += 12) {
                        if (274 == i.getUint16(e_1, f_1)) {
                            if (3 !== i.getUint16(e_1 + 2, f_1))
                                return r("Orientation data type is invalid");
                            if (1 !== i.getUint32(e_1 + 4, f_1))
                                return r("Orientation data count is invalid");
                            i.setUint16(e_1 + 8, 1, f_1);
                            break;
                        }
                    }
                    return t(e.slice(o, o + 2 + s_1));
                }
                o += 2 + s_1;
            }
            return t(new Blob);
        })), i.readAsArrayBuffer(e);
    })); };
    var e = {};
    !function (e) {
        var t, r, UZIP = {};
        e.exports = UZIP, UZIP.parse = function (e, t) {
            for (var r = UZIP.bin.readUshort, i = UZIP.bin.readUint, o = 0, a = {}, s = new Uint8Array(e), f = s.length - 4; 101010256 != i(s, f);)
                f--;
            o = f;
            o += 4;
            var l = r(s, o += 4);
            r(s, o += 2);
            var c = i(s, o += 2), u = i(s, o += 4);
            o += 4, o = u;
            for (var h = 0; h < l; h++) {
                i(s, o), o += 4, o += 4, o += 4, i(s, o += 4);
                c = i(s, o += 4);
                var d = i(s, o += 4), A = r(s, o += 4), g = r(s, o + 2), p = r(s, o + 4);
                o += 6;
                var m = i(s, o += 8);
                o += 4, o += A + g + p, UZIP._readLocal(s, m, a, c, d, t);
            }
            return a;
        }, UZIP._readLocal = function (e, t, r, i, o, a) {
            var s = UZIP.bin.readUshort, f = UZIP.bin.readUint;
            f(e, t), s(e, t += 4), s(e, t += 2);
            var l = s(e, t += 2);
            f(e, t += 2), f(e, t += 4), t += 4;
            var c = s(e, t += 8), u = s(e, t += 2);
            t += 2;
            var h = UZIP.bin.readUTF8(e, t, c);
            if (t += c, t += u, a)
                r[h] = { size: o, csize: i };
            else {
                var d = new Uint8Array(e.buffer, t);
                if (0 == l)
                    r[h] = new Uint8Array(d.buffer.slice(t, t + i));
                else {
                    if (8 != l)
                        throw "unknown compression method: " + l;
                    var A = new Uint8Array(o);
                    UZIP.inflateRaw(d, A), r[h] = A;
                }
            }
        }, UZIP.inflateRaw = function (e, t) {
            return UZIP.F.inflate(e, t);
        }, UZIP.inflate = function (e, t) {
            return e[0], e[1], UZIP.inflateRaw(new Uint8Array(e.buffer, e.byteOffset + 2, e.length - 6), t);
        }, UZIP.deflate = function (e, t) {
            null == t && (t = { level: 6 });
            var r = 0, i = new Uint8Array(50 + Math.floor(1.1 * e.length));
            i[r] = 120, i[r + 1] = 156, r += 2, r = UZIP.F.deflateRaw(e, i, r, t.level);
            var o = UZIP.adler(e, 0, e.length);
            return i[r + 0] = o >>> 24 & 255, i[r + 1] = o >>> 16 & 255, i[r + 2] = o >>> 8 & 255, i[r + 3] = o >>> 0 & 255, new Uint8Array(i.buffer, 0, r + 4);
        }, UZIP.deflateRaw = function (e, t) {
            null == t && (t = { level: 6 });
            var r = new Uint8Array(50 + Math.floor(1.1 * e.length)), i = UZIP.F.deflateRaw(e, r, i, t.level);
            return new Uint8Array(r.buffer, 0, i);
        }, UZIP.encode = function (e, t) {
            null == t && (t = !1);
            var r = 0, i = UZIP.bin.writeUint, o = UZIP.bin.writeUshort, a = {};
            for (var s in e) {
                var f = !UZIP._noNeed(s) && !t, l = e[s], c = UZIP.crc.crc(l, 0, l.length);
                a[s] = { cpr: f, usize: l.length, crc: c, file: f ? UZIP.deflateRaw(l) : l };
            }
            for (var s in a)
                r += a[s].file.length + 30 + 46 + 2 * UZIP.bin.sizeUTF8(s);
            r += 22;
            var u = new Uint8Array(r), h = 0, d = [];
            for (var s in a) {
                var A = a[s];
                d.push(h), h = UZIP._writeHeader(u, h, s, A, 0);
            }
            var g = 0, p = h;
            for (var s in a) {
                A = a[s];
                d.push(h), h = UZIP._writeHeader(u, h, s, A, 1, d[g++]);
            }
            var m = h - p;
            return i(u, h, 101010256), h += 4, o(u, h += 4, g), o(u, h += 2, g), i(u, h += 2, m), i(u, h += 4, p), h += 4, h += 2, u.buffer;
        }, UZIP._noNeed = function (e) {
            var t = e.split(".").pop().toLowerCase();
            return -1 != "png,jpg,jpeg,zip".indexOf(t);
        }, UZIP._writeHeader = function (e, t, r, i, o, a) {
            var s = UZIP.bin.writeUint, f = UZIP.bin.writeUshort, l = i.file;
            return s(e, t, 0 == o ? 67324752 : 33639248), t += 4, 1 == o && (t += 2), f(e, t, 20), f(e, t += 2, 0), f(e, t += 2, i.cpr ? 8 : 0), s(e, t += 2, 0), s(e, t += 4, i.crc), s(e, t += 4, l.length), s(e, t += 4, i.usize), f(e, t += 4, UZIP.bin.sizeUTF8(r)), f(e, t += 2, 0), t += 2, 1 == o && (t += 2, t += 2, s(e, t += 6, a), t += 4), t += UZIP.bin.writeUTF8(e, t, r), 0 == o && (e.set(l, t), t += l.length), t;
        }, UZIP.crc = {
            table: function () {
                for (var e = new Uint32Array(256), t = 0; t < 256; t++) {
                    for (var r = t, i = 0; i < 8; i++)
                        1 & r ? r = 3988292384 ^ r >>> 1 : r >>>= 1;
                    e[t] = r;
                }
                return e;
            }(), update: function (e, t, r, i) {
                for (var o = 0; o < i; o++)
                    e = UZIP.crc.table[255 & (e ^ t[r + o])] ^ e >>> 8;
                return e;
            }, crc: function (e, t, r) {
                return 4294967295 ^ UZIP.crc.update(4294967295, e, t, r);
            }
        }, UZIP.adler = function (e, t, r) {
            for (var i = 1, o = 0, a = t, s = t + r; a < s;) {
                for (var f = Math.min(a + 5552, s); a < f;)
                    o += i += e[a++];
                i %= 65521, o %= 65521;
            }
            return o << 16 | i;
        }, UZIP.bin = {
            readUshort: function (e, t) {
                return e[t] | e[t + 1] << 8;
            }, writeUshort: function (e, t, r) {
                e[t] = 255 & r, e[t + 1] = r >> 8 & 255;
            }, readUint: function (e, t) {
                return 16777216 * e[t + 3] + (e[t + 2] << 16 | e[t + 1] << 8 | e[t]);
            }, writeUint: function (e, t, r) {
                e[t] = 255 & r, e[t + 1] = r >> 8 & 255, e[t + 2] = r >> 16 & 255, e[t + 3] = r >> 24 & 255;
            }, readASCII: function (e, t, r) {
                for (var i = "", o = 0; o < r; o++)
                    i += String.fromCharCode(e[t + o]);
                return i;
            }, writeASCII: function (e, t, r) {
                for (var i = 0; i < r.length; i++)
                    e[t + i] = r.charCodeAt(i);
            }, pad: function (e) {
                return e.length < 2 ? "0" + e : e;
            }, readUTF8: function (e, t, r) {
                for (var i, o = "", a = 0; a < r; a++)
                    o += "%" + UZIP.bin.pad(e[t + a].toString(16));
                try {
                    i = decodeURIComponent(o);
                }
                catch (i) {
                    return UZIP.bin.readASCII(e, t, r);
                }
                return i;
            }, writeUTF8: function (e, t, r) {
                for (var i = r.length, o = 0, a = 0; a < i; a++) {
                    var s = r.charCodeAt(a);
                    if (0 == (4294967168 & s))
                        e[t + o] = s, o++;
                    else if (0 == (4294965248 & s))
                        e[t + o] = 192 | s >> 6, e[t + o + 1] = 128 | s >> 0 & 63, o += 2;
                    else if (0 == (4294901760 & s))
                        e[t + o] = 224 | s >> 12, e[t + o + 1] = 128 | s >> 6 & 63, e[t + o + 2] = 128 | s >> 0 & 63, o += 3;
                    else {
                        if (0 != (4292870144 & s))
                            throw "e";
                        e[t + o] = 240 | s >> 18, e[t + o + 1] = 128 | s >> 12 & 63, e[t + o + 2] = 128 | s >> 6 & 63, e[t + o + 3] = 128 | s >> 0 & 63, o += 4;
                    }
                }
                return o;
            }, sizeUTF8: function (e) {
                for (var t = e.length, r = 0, i = 0; i < t; i++) {
                    var o = e.charCodeAt(i);
                    if (0 == (4294967168 & o))
                        r++;
                    else if (0 == (4294965248 & o))
                        r += 2;
                    else if (0 == (4294901760 & o))
                        r += 3;
                    else {
                        if (0 != (4292870144 & o))
                            throw "e";
                        r += 4;
                    }
                }
                return r;
            }
        }, UZIP.F = {}, UZIP.F.deflateRaw = function (e, t, r, i) {
            var o = [[0, 0, 0, 0, 0], [4, 4, 8, 4, 0], [4, 5, 16, 8, 0], [4, 6, 16, 16, 0], [4, 10, 16, 32, 0], [8, 16, 32, 32, 0], [8, 16, 128, 128, 0], [8, 32, 128, 256, 0], [32, 128, 258, 1024, 1], [32, 258, 258, 4096, 1]][i], a = UZIP.F.U, s = UZIP.F._goodIndex;
            UZIP.F._hash;
            var f = UZIP.F._putsE, l = 0, c = r << 3, u = 0, h = e.length;
            if (0 == i) {
                for (; l < h;) {
                    f(t, c, l + (_ = Math.min(65535, h - l)) == h ? 1 : 0), c = UZIP.F._copyExact(e, l, _, t, c + 8), l += _;
                }
                return c >>> 3;
            }
            var d = a.lits, A = a.strt, g = a.prev, p = 0, m = 0, w = 0, v = 0, b = 0, y = 0;
            for (h > 2 && (A[y = UZIP.F._hash(e, 0)] = 0), l = 0; l < h; l++) {
                if (b = y, l + 1 < h - 2) {
                    y = UZIP.F._hash(e, l + 1);
                    var E = l + 1 & 32767;
                    g[E] = A[y], A[y] = E;
                }
                if (u <= l) {
                    (p > 14e3 || m > 26697) && h - l > 100 && (u < l && (d[p] = l - u, p += 2, u = l), c = UZIP.F._writeBlock(l == h - 1 || u == h ? 1 : 0, d, p, v, e, w, l - w, t, c), p = m = v = 0, w = l);
                    var F = 0;
                    l < h - 2 && (F = UZIP.F._bestMatch(e, l, g, b, Math.min(o[2], h - l), o[3]));
                    var _ = F >>> 16, B = 65535 & F;
                    if (0 != F) {
                        B = 65535 & F;
                        var U = s(_ = F >>> 16, a.of0);
                        a.lhst[257 + U]++;
                        var C = s(B, a.df0);
                        a.dhst[C]++, v += a.exb[U] + a.dxb[C], d[p] = _ << 23 | l - u, d[p + 1] = B << 16 | U << 8 | C, p += 2, u = l + _;
                    }
                    else
                        a.lhst[e[l]]++;
                    m++;
                }
            }
            for (w == l && 0 != e.length || (u < l && (d[p] = l - u, p += 2, u = l), c = UZIP.F._writeBlock(1, d, p, v, e, w, l - w, t, c), p = 0, m = 0, p = m = v = 0, w = l); 0 != (7 & c);)
                c++;
            return c >>> 3;
        }, UZIP.F._bestMatch = function (e, t, r, i, o, a) {
            var s = 32767 & t, f = r[s], l = s - f + 32768 & 32767;
            if (f == s || i != UZIP.F._hash(e, t - l))
                return 0;
            for (var c = 0, u = 0, h = Math.min(32767, t); l <= h && 0 != --a && f != s;) {
                if (0 == c || e[t + c] == e[t + c - l]) {
                    var d = UZIP.F._howLong(e, t, l);
                    if (d > c) {
                        if (u = l, (c = d) >= o)
                            break;
                        l + 2 < d && (d = l + 2);
                        for (var A = 0, g = 0; g < d - 2; g++) {
                            var p = t - l + g + 32768 & 32767, m = p - r[p] + 32768 & 32767;
                            m > A && (A = m, f = p);
                        }
                    }
                }
                l += (s = f) - (f = r[s]) + 32768 & 32767;
            }
            return c << 16 | u;
        }, UZIP.F._howLong = function (e, t, r) {
            if (e[t] != e[t - r] || e[t + 1] != e[t + 1 - r] || e[t + 2] != e[t + 2 - r])
                return 0;
            var i = t, o = Math.min(e.length, t + 258);
            for (t += 3; t < o && e[t] == e[t - r];)
                t++;
            return t - i;
        }, UZIP.F._hash = function (e, t) {
            return (e[t] << 8 | e[t + 1]) + (e[t + 2] << 4) & 65535;
        }, UZIP.saved = 0, UZIP.F._writeBlock = function (e, t, r, i, o, a, s, f, l) {
            var c, u, h, d, A, g, p, m, w, v = UZIP.F.U, b = UZIP.F._putsF, y = UZIP.F._putsE;
            v.lhst[256]++, u = (c = UZIP.F.getTrees())[0], h = c[1], d = c[2], A = c[3], g = c[4], p = c[5], m = c[6], w = c[7];
            var E = 32 + (0 == (l + 3 & 7) ? 0 : 8 - (l + 3 & 7)) + (s << 3), F = i + UZIP.F.contSize(v.fltree, v.lhst) + UZIP.F.contSize(v.fdtree, v.dhst), _ = i + UZIP.F.contSize(v.ltree, v.lhst) + UZIP.F.contSize(v.dtree, v.dhst);
            _ += 14 + 3 * p + UZIP.F.contSize(v.itree, v.ihst) + (2 * v.ihst[16] + 3 * v.ihst[17] + 7 * v.ihst[18]);
            for (var B = 0; B < 286; B++)
                v.lhst[B] = 0;
            for (B = 0; B < 30; B++)
                v.dhst[B] = 0;
            for (B = 0; B < 19; B++)
                v.ihst[B] = 0;
            var U = E < F && E < _ ? 0 : F < _ ? 1 : 2;
            if (b(f, l, e), b(f, l + 1, U), l += 3, 0 == U) {
                for (; 0 != (7 & l);)
                    l++;
                l = UZIP.F._copyExact(o, a, s, f, l);
            }
            else {
                var C, I;
                if (1 == U && (C = v.fltree, I = v.fdtree), 2 == U) {
                    UZIP.F.makeCodes(v.ltree, u), UZIP.F.revCodes(v.ltree, u), UZIP.F.makeCodes(v.dtree, h), UZIP.F.revCodes(v.dtree, h), UZIP.F.makeCodes(v.itree, d), UZIP.F.revCodes(v.itree, d), C = v.ltree, I = v.dtree, y(f, l, A - 257), y(f, l += 5, g - 1), y(f, l += 5, p - 4), l += 4;
                    for (var Q = 0; Q < p; Q++)
                        y(f, l + 3 * Q, v.itree[1 + (v.ordr[Q] << 1)]);
                    l += 3 * p, l = UZIP.F._codeTiny(m, v.itree, f, l), l = UZIP.F._codeTiny(w, v.itree, f, l);
                }
                for (var M = a, x = 0; x < r; x += 2) {
                    for (var T = t[x], S = T >>> 23, R = M + (8388607 & T); M < R;)
                        l = UZIP.F._writeLit(o[M++], C, f, l);
                    if (0 != S) {
                        var O = t[x + 1], P = O >> 16, H = O >> 8 & 255, L = 255 & O;
                        y(f, l = UZIP.F._writeLit(257 + H, C, f, l), S - v.of0[H]), l += v.exb[H], b(f, l = UZIP.F._writeLit(L, I, f, l), P - v.df0[L]), l += v.dxb[L], M += S;
                    }
                }
                l = UZIP.F._writeLit(256, C, f, l);
            }
            return l;
        }, UZIP.F._copyExact = function (e, t, r, i, o) {
            var a = o >>> 3;
            return i[a] = r, i[a + 1] = r >>> 8, i[a + 2] = 255 - i[a], i[a + 3] = 255 - i[a + 1], a += 4, i.set(new Uint8Array(e.buffer, t, r), a), o + (r + 4 << 3);
        }, UZIP.F.getTrees = function () {
            for (var e = UZIP.F.U, t = UZIP.F._hufTree(e.lhst, e.ltree, 15), r = UZIP.F._hufTree(e.dhst, e.dtree, 15), i = [], o = UZIP.F._lenCodes(e.ltree, i), a = [], s = UZIP.F._lenCodes(e.dtree, a), f = 0; f < i.length; f += 2)
                e.ihst[i[f]]++;
            for (f = 0; f < a.length; f += 2)
                e.ihst[a[f]]++;
            for (var l = UZIP.F._hufTree(e.ihst, e.itree, 7), c = 19; c > 4 && 0 == e.itree[1 + (e.ordr[c - 1] << 1)];)
                c--;
            return [t, r, l, o, s, c, i, a];
        }, UZIP.F.getSecond = function (e) {
            for (var t = [], r = 0; r < e.length; r += 2)
                t.push(e[r + 1]);
            return t;
        }, UZIP.F.nonZero = function (e) {
            for (var t = "", r = 0; r < e.length; r += 2)
                0 != e[r + 1] && (t += (r >> 1) + ",");
            return t;
        }, UZIP.F.contSize = function (e, t) {
            for (var r = 0, i = 0; i < t.length; i++)
                r += t[i] * e[1 + (i << 1)];
            return r;
        }, UZIP.F._codeTiny = function (e, t, r, i) {
            for (var o = 0; o < e.length; o += 2) {
                var a = e[o], s = e[o + 1];
                i = UZIP.F._writeLit(a, t, r, i);
                var f = 16 == a ? 2 : 17 == a ? 3 : 7;
                a > 15 && (UZIP.F._putsE(r, i, s, f), i += f);
            }
            return i;
        }, UZIP.F._lenCodes = function (e, t) {
            for (var r = e.length; 2 != r && 0 == e[r - 1];)
                r -= 2;
            for (var i = 0; i < r; i += 2) {
                var o = e[i + 1], a = i + 3 < r ? e[i + 3] : -1, s = i + 5 < r ? e[i + 5] : -1, f = 0 == i ? -1 : e[i - 1];
                if (0 == o && a == o && s == o) {
                    for (var l = i + 5; l + 2 < r && e[l + 2] == o;)
                        l += 2;
                    (c = Math.min(l + 1 - i >>> 1, 138)) < 11 ? t.push(17, c - 3) : t.push(18, c - 11), i += 2 * c - 2;
                }
                else if (o == f && a == o && s == o) {
                    for (l = i + 5; l + 2 < r && e[l + 2] == o;)
                        l += 2;
                    var c = Math.min(l + 1 - i >>> 1, 6);
                    t.push(16, c - 3), i += 2 * c - 2;
                }
                else
                    t.push(o, 0);
            }
            return r >>> 1;
        }, UZIP.F._hufTree = function (e, t, r) {
            var i = [], o = e.length, a = t.length, s = 0;
            for (s = 0; s < a; s += 2)
                t[s] = 0, t[s + 1] = 0;
            for (s = 0; s < o; s++)
                0 != e[s] && i.push({ lit: s, f: e[s] });
            var f = i.length, l = i.slice(0);
            if (0 == f)
                return 0;
            if (1 == f) {
                var c = i[0].lit;
                l = 0 == c ? 1 : 0;
                return t[1 + (c << 1)] = 1, t[1 + (l << 1)] = 1, 1;
            }
            i.sort((function (e, t) {
                return e.f - t.f;
            }));
            var u = i[0], h = i[1], d = 0, A = 1, g = 2;
            for (i[0] = {
                lit: -1,
                f: u.f + h.f,
                l: u,
                r: h,
                d: 0
            }; A != f - 1;)
                u = d != A && (g == f || i[d].f < i[g].f) ? i[d++] : i[g++], h = d != A && (g == f || i[d].f < i[g].f) ? i[d++] : i[g++], i[A++] = {
                    lit: -1,
                    f: u.f + h.f,
                    l: u,
                    r: h
                };
            var p = UZIP.F.setDepth(i[A - 1], 0);
            for (p > r && (UZIP.F.restrictDepth(l, r, p), p = r), s = 0; s < f; s++)
                t[1 + (l[s].lit << 1)] = l[s].d;
            return p;
        }, UZIP.F.setDepth = function (e, t) {
            return -1 != e.lit ? (e.d = t, t) : Math.max(UZIP.F.setDepth(e.l, t + 1), UZIP.F.setDepth(e.r, t + 1));
        }, UZIP.F.restrictDepth = function (e, t, r) {
            var i = 0, o = 1 << r - t, a = 0;
            for (e.sort((function (e, t) {
                return t.d == e.d ? e.f - t.f : t.d - e.d;
            })), i = 0; i < e.length && e[i].d > t; i++) {
                var s = e[i].d;
                e[i].d = t, a += o - (1 << r - s);
            }
            for (a >>>= r - t; a > 0;) {
                (s = e[i].d) < t ? (e[i].d++, a -= 1 << t - s - 1) : i++;
            }
            for (; i >= 0; i--)
                e[i].d == t && a < 0 && (e[i].d--, a++);
            0 != a && console.log("debt left");
        }, UZIP.F._goodIndex = function (e, t) {
            var r = 0;
            return t[16 | r] <= e && (r |= 16), t[8 | r] <= e && (r |= 8), t[4 | r] <= e && (r |= 4), t[2 | r] <= e && (r |= 2), t[1 | r] <= e && (r |= 1), r;
        }, UZIP.F._writeLit = function (e, t, r, i) {
            return UZIP.F._putsF(r, i, t[e << 1]), i + t[1 + (e << 1)];
        }, UZIP.F.inflate = function (e, t) {
            var r = Uint8Array;
            if (3 == e[0] && 0 == e[1])
                return t || new r(0);
            var i = UZIP.F, o = i._bitsF, a = i._bitsE, s = i._decodeTiny, f = i.makeCodes, l = i.codes2map, c = i._get17, u = i.U, h = null == t;
            h && (t = new r(e.length >>> 2 << 3));
            for (var d, A, g = 0, p = 0, m = 0, w = 0, v = 0, b = 0, y = 0, E = 0, F = 0; 0 == g;)
                if (g = o(e, F, 1), p = o(e, F + 1, 2), F += 3, 0 != p) {
                    if (h && (t = UZIP.F._check(t, E + (1 << 17))), 1 == p && (d = u.flmap, A = u.fdmap, b = 511, y = 31), 2 == p) {
                        m = a(e, F, 5) + 257, w = a(e, F + 5, 5) + 1, v = a(e, F + 10, 4) + 4, F += 14;
                        for (var _ = 0; _ < 38; _ += 2)
                            u.itree[_] = 0, u.itree[_ + 1] = 0;
                        var B = 1;
                        for (_ = 0; _ < v; _++) {
                            var U = a(e, F + 3 * _, 3);
                            u.itree[1 + (u.ordr[_] << 1)] = U, U > B && (B = U);
                        }
                        F += 3 * v, f(u.itree, B), l(u.itree, B, u.imap), d = u.lmap, A = u.dmap, F = s(u.imap, (1 << B) - 1, m + w, e, F, u.ttree);
                        var C = i._copyOut(u.ttree, 0, m, u.ltree);
                        b = (1 << C) - 1;
                        var I = i._copyOut(u.ttree, m, w, u.dtree);
                        y = (1 << I) - 1, f(u.ltree, C), l(u.ltree, C, d), f(u.dtree, I), l(u.dtree, I, A);
                    }
                    for (;;) {
                        var Q = d[c(e, F) & b];
                        F += 15 & Q;
                        var M = Q >>> 4;
                        if (M >>> 8 == 0)
                            t[E++] = M;
                        else {
                            if (256 == M)
                                break;
                            var x = E + M - 254;
                            if (M > 264) {
                                var T = u.ldef[M - 257];
                                x = E + (T >>> 3) + a(e, F, 7 & T), F += 7 & T;
                            }
                            var S = A[c(e, F) & y];
                            F += 15 & S;
                            var R = S >>> 4, O = u.ddef[R], P = (O >>> 4) + o(e, F, 15 & O);
                            for (F += 15 & O, h && (t = UZIP.F._check(t, E + (1 << 17))); E < x;)
                                t[E] = t[E++ - P], t[E] = t[E++ - P], t[E] = t[E++ - P], t[E] = t[E++ - P];
                            E = x;
                        }
                    }
                }
                else {
                    0 != (7 & F) && (F += 8 - (7 & F));
                    var H = 4 + (F >>> 3), L = e[H - 4] | e[H - 3] << 8;
                    h && (t = UZIP.F._check(t, E + L)), t.set(new r(e.buffer, e.byteOffset + H, L), E), F = H + L << 3, E += L;
                }
            return t.length == E ? t : t.slice(0, E);
        }, UZIP.F._check = function (e, t) {
            var r = e.length;
            if (t <= r)
                return e;
            var i = new Uint8Array(Math.max(r << 1, t));
            return i.set(e, 0), i;
        }, UZIP.F._decodeTiny = function (e, t, r, i, o, a) {
            for (var s = UZIP.F._bitsE, f = UZIP.F._get17, l = 0; l < r;) {
                var c = e[f(i, o) & t];
                o += 15 & c;
                var u = c >>> 4;
                if (u <= 15)
                    a[l] = u, l++;
                else {
                    var h = 0, d = 0;
                    16 == u ? (d = 3 + s(i, o, 2), o += 2, h = a[l - 1]) : 17 == u ? (d = 3 + s(i, o, 3), o += 3) : 18 == u && (d = 11 + s(i, o, 7), o += 7);
                    for (var A = l + d; l < A;)
                        a[l] = h, l++;
                }
            }
            return o;
        }, UZIP.F._copyOut = function (e, t, r, i) {
            for (var o = 0, a = 0, s = i.length >>> 1; a < r;) {
                var f = e[a + t];
                i[a << 1] = 0, i[1 + (a << 1)] = f, f > o && (o = f), a++;
            }
            for (; a < s;)
                i[a << 1] = 0, i[1 + (a << 1)] = 0, a++;
            return o;
        }, UZIP.F.makeCodes = function (e, t) {
            for (var r, i, o, a, s = UZIP.F.U, f = e.length, l = s.bl_count, c = 0; c <= t; c++)
                l[c] = 0;
            for (c = 1; c < f; c += 2)
                l[e[c]]++;
            var u = s.next_code;
            for (r = 0, l[0] = 0, i = 1; i <= t; i++)
                r = r + l[i - 1] << 1, u[i] = r;
            for (o = 0; o < f; o += 2)
                0 != (a = e[o + 1]) && (e[o] = u[a], u[a]++);
        }, UZIP.F.codes2map = function (e, t, r) {
            for (var i = e.length, o = UZIP.F.U.rev15, a = 0; a < i; a += 2)
                if (0 != e[a + 1])
                    for (var s = a >> 1, f = e[a + 1], l = s << 4 | f, c = t - f, u = e[a] << c, h = u + (1 << c); u != h;) {
                        r[o[u] >>> 15 - t] = l, u++;
                    }
        }, UZIP.F.revCodes = function (e, t) {
            for (var r = UZIP.F.U.rev15, i = 15 - t, o = 0; o < e.length; o += 2) {
                var a = e[o] << t - e[o + 1];
                e[o] = r[a] >>> i;
            }
        }, UZIP.F._putsE = function (e, t, r) {
            r <<= 7 & t;
            var i = t >>> 3;
            e[i] |= r, e[i + 1] |= r >>> 8;
        }, UZIP.F._putsF = function (e, t, r) {
            r <<= 7 & t;
            var i = t >>> 3;
            e[i] |= r, e[i + 1] |= r >>> 8, e[i + 2] |= r >>> 16;
        }, UZIP.F._bitsE = function (e, t, r) {
            return (e[t >>> 3] | e[1 + (t >>> 3)] << 8) >>> (7 & t) & (1 << r) - 1;
        }, UZIP.F._bitsF = function (e, t, r) {
            return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t) & (1 << r) - 1;
        }, UZIP.F._get17 = function (e, t) {
            return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t);
        }, UZIP.F._get25 = function (e, t) {
            return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16 | e[3 + (t >>> 3)] << 24) >>> (7 & t);
        }, UZIP.F.U = (t = Uint16Array, r = Uint32Array, {
            next_code: new t(16),
            bl_count: new t(16),
            ordr: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
            of0: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999],
            exb: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0],
            ldef: new t(32),
            df0: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535],
            dxb: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0],
            ddef: new r(32),
            flmap: new t(512),
            fltree: [],
            fdmap: new t(32),
            fdtree: [],
            lmap: new t(32768),
            ltree: [],
            ttree: [],
            dmap: new t(32768),
            dtree: [],
            imap: new t(512),
            itree: [],
            rev15: new t(32768),
            lhst: new r(286),
            dhst: new r(30),
            ihst: new r(19),
            lits: new r(15e3),
            strt: new t(65536),
            prev: new t(32768)
        }), function () {
            for (var e = UZIP.F.U, t = 0; t < 32768; t++) {
                var r = t;
                r = (4278255360 & (r = (4042322160 & (r = (3435973836 & (r = (2863311530 & r) >>> 1 | (1431655765 & r) << 1)) >>> 2 | (858993459 & r) << 2)) >>> 4 | (252645135 & r) << 4)) >>> 8 | (16711935 & r) << 8, e.rev15[t] = (r >>> 16 | r << 16) >>> 17;
            }
            function pushV(e, t, r) {
                for (; 0 != t--;)
                    e.push(0, r);
            }
            for (t = 0; t < 32; t++)
                e.ldef[t] = e.of0[t] << 3 | e.exb[t], e.ddef[t] = e.df0[t] << 4 | e.dxb[t];
            pushV(e.fltree, 144, 8), pushV(e.fltree, 112, 9), pushV(e.fltree, 24, 7), pushV(e.fltree, 8, 8), UZIP.F.makeCodes(e.fltree, 9), UZIP.F.codes2map(e.fltree, 9, e.flmap), UZIP.F.revCodes(e.fltree, 9), pushV(e.fdtree, 32, 5), UZIP.F.makeCodes(e.fdtree, 5), UZIP.F.codes2map(e.fdtree, 5, e.fdmap), UZIP.F.revCodes(e.fdtree, 5), pushV(e.itree, 19, 0), pushV(e.ltree, 286, 0), pushV(e.dtree, 30, 0), pushV(e.ttree, 320, 0);
        }();
    }({
        get exports() {
            return e;
        }, set exports(t) {
            e = t;
        }
    });
    var UZIP = _mergeNamespaces({ __proto__: null, default: e }, [e]);
    var UPNG = function () {
        var e = {
            nextZero: function (e, t) {
                for (; 0 != e[t];)
                    t++;
                return t;
            },
            readUshort: function (e, t) { return e[t] << 8 | e[t + 1]; },
            writeUshort: function (e, t, r) {
                e[t] = r >> 8 & 255, e[t + 1] = 255 & r;
            },
            readUint: function (e, t) { return 16777216 * e[t] + (e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]); },
            writeUint: function (e, t, r) {
                e[t] = r >> 24 & 255, e[t + 1] = r >> 16 & 255, e[t + 2] = r >> 8 & 255, e[t + 3] = 255 & r;
            },
            readASCII: function (e, t, r) {
                var i = "";
                for (var o_1 = 0; o_1 < r; o_1++)
                    i += String.fromCharCode(e[t + o_1]);
                return i;
            },
            writeASCII: function (e, t, r) {
                for (var i_1 = 0; i_1 < r.length; i_1++)
                    e[t + i_1] = r.charCodeAt(i_1);
            },
            readBytes: function (e, t, r) {
                var i = [];
                for (var o_2 = 0; o_2 < r; o_2++)
                    i.push(e[t + o_2]);
                return i;
            },
            pad: function (e) { return e.length < 2 ? "0".concat(e) : e; },
            readUTF8: function (t, r, i) {
                var o, a = "";
                for (var o_3 = 0; o_3 < i; o_3++)
                    a += "%".concat(e.pad(t[r + o_3].toString(16)));
                try {
                    o = decodeURIComponent(a);
                }
                catch (o) {
                    return e.readASCII(t, r, i);
                }
                return o;
            }
        };
        function decodeImage(t, r, i, o) {
            var a = r * i, s = _getBPP(o), f = Math.ceil(r * s / 8), l = new Uint8Array(4 * a), c = new Uint32Array(l.buffer), u = o.ctype, h = o.depth, d = e.readUshort;
            if (6 == u) {
                var e_2 = a << 2;
                if (8 == h)
                    for (var A = 0; A < e_2; A += 4)
                        l[A] = t[A], l[A + 1] = t[A + 1], l[A + 2] = t[A + 2], l[A + 3] = t[A + 3];
                if (16 == h)
                    for (A = 0; A < e_2; A++)
                        l[A] = t[A << 1];
            }
            else if (2 == u) {
                var e_3 = o.tabs.tRNS;
                if (null == e_3) {
                    if (8 == h)
                        for (A = 0; A < a; A++) {
                            var g = 3 * A;
                            c[A] = 255 << 24 | t[g + 2] << 16 | t[g + 1] << 8 | t[g];
                        }
                    if (16 == h)
                        for (A = 0; A < a; A++) {
                            g = 6 * A;
                            c[A] = 255 << 24 | t[g + 4] << 16 | t[g + 2] << 8 | t[g];
                        }
                }
                else {
                    var p = e_3[0];
                    var r_1 = e_3[1], i_2 = e_3[2];
                    if (8 == h)
                        for (A = 0; A < a; A++) {
                            var m = A << 2;
                            g = 3 * A;
                            c[A] = 255 << 24 | t[g + 2] << 16 | t[g + 1] << 8 | t[g], t[g] == p && t[g + 1] == r_1 && t[g + 2] == i_2 && (l[m + 3] = 0);
                        }
                    if (16 == h)
                        for (A = 0; A < a; A++) {
                            m = A << 2, g = 6 * A;
                            c[A] = 255 << 24 | t[g + 4] << 16 | t[g + 2] << 8 | t[g], d(t, g) == p && d(t, g + 2) == r_1 && d(t, g + 4) == i_2 && (l[m + 3] = 0);
                        }
                }
            }
            else if (3 == u) {
                var e_4 = o.tabs.PLTE, s_2 = o.tabs.tRNS, c_1 = s_2 ? s_2.length : 0;
                if (1 == h)
                    for (var w = 0; w < i; w++) {
                        var v = w * f, b = w * r;
                        for (A = 0; A < r; A++) {
                            m = b + A << 2;
                            var y = 3 * (E = t[v + (A >> 3)] >> 7 - ((7 & A) << 0) & 1);
                            l[m] = e_4[y], l[m + 1] = e_4[y + 1], l[m + 2] = e_4[y + 2], l[m + 3] = E < c_1 ? s_2[E] : 255;
                        }
                    }
                if (2 == h)
                    for (w = 0; w < i; w++)
                        for (v = w * f, b = w * r, A = 0; A < r; A++) {
                            m = b + A << 2, y = 3 * (E = t[v + (A >> 2)] >> 6 - ((3 & A) << 1) & 3);
                            l[m] = e_4[y], l[m + 1] = e_4[y + 1], l[m + 2] = e_4[y + 2], l[m + 3] = E < c_1 ? s_2[E] : 255;
                        }
                if (4 == h)
                    for (w = 0; w < i; w++)
                        for (v = w * f, b = w * r, A = 0; A < r; A++) {
                            m = b + A << 2, y = 3 * (E = t[v + (A >> 1)] >> 4 - ((1 & A) << 2) & 15);
                            l[m] = e_4[y], l[m + 1] = e_4[y + 1], l[m + 2] = e_4[y + 2], l[m + 3] = E < c_1 ? s_2[E] : 255;
                        }
                if (8 == h)
                    for (A = 0; A < a; A++) {
                        var E;
                        m = A << 2, y = 3 * (E = t[A]);
                        l[m] = e_4[y], l[m + 1] = e_4[y + 1], l[m + 2] = e_4[y + 2], l[m + 3] = E < c_1 ? s_2[E] : 255;
                    }
            }
            else if (4 == u) {
                if (8 == h)
                    for (A = 0; A < a; A++) {
                        m = A << 2;
                        var F = t[_ = A << 1];
                        l[m] = F, l[m + 1] = F, l[m + 2] = F, l[m + 3] = t[_ + 1];
                    }
                if (16 == h)
                    for (A = 0; A < a; A++) {
                        var _;
                        m = A << 2, F = t[_ = A << 2];
                        l[m] = F, l[m + 1] = F, l[m + 2] = F, l[m + 3] = t[_ + 2];
                    }
            }
            else if (0 == u)
                for (p = o.tabs.tRNS ? o.tabs.tRNS : -1, w = 0; w < i; w++) {
                    var e_5 = w * f, i_3 = w * r;
                    if (1 == h)
                        for (var B = 0; B < r; B++) {
                            var U = (F = 255 * (t[e_5 + (B >>> 3)] >>> 7 - (7 & B) & 1)) == 255 * p ? 0 : 255;
                            c[i_3 + B] = U << 24 | F << 16 | F << 8 | F;
                        }
                    else if (2 == h)
                        for (B = 0; B < r; B++) {
                            U = (F = 85 * (t[e_5 + (B >>> 2)] >>> 6 - ((3 & B) << 1) & 3)) == 85 * p ? 0 : 255;
                            c[i_3 + B] = U << 24 | F << 16 | F << 8 | F;
                        }
                    else if (4 == h)
                        for (B = 0; B < r; B++) {
                            U = (F = 17 * (t[e_5 + (B >>> 1)] >>> 4 - ((1 & B) << 2) & 15)) == 17 * p ? 0 : 255;
                            c[i_3 + B] = U << 24 | F << 16 | F << 8 | F;
                        }
                    else if (8 == h)
                        for (B = 0; B < r; B++) {
                            U = (F = t[e_5 + B]) == p ? 0 : 255;
                            c[i_3 + B] = U << 24 | F << 16 | F << 8 | F;
                        }
                    else if (16 == h)
                        for (B = 0; B < r; B++) {
                            F = t[e_5 + (B << 1)], U = d(t, e_5 + (B << 1)) == p ? 0 : 255;
                            c[i_3 + B] = U << 24 | F << 16 | F << 8 | F;
                        }
                }
            return l;
        }
        function _decompress(e, r, i, o) {
            var a = _getBPP(e), s = Math.ceil(i * a / 8), f = new Uint8Array((s + 1 + e.interlace) * o);
            return r = e.tabs.CgBI ? t(r, f) : _inflate(r, f), 0 == e.interlace ? r = _filterZero(r, e, 0, i, o) : 1 == e.interlace && (r = function _readInterlace(e, t) {
                var r = t.width, i = t.height, o = _getBPP(t), a = o >> 3, s = Math.ceil(r * o / 8), f = new Uint8Array(i * s);
                var l = 0;
                var c = [0, 0, 4, 0, 2, 0, 1], u = [0, 4, 0, 2, 0, 1, 0], h = [8, 8, 8, 4, 4, 2, 2], d = [8, 8, 4, 4, 2, 2, 1];
                var A = 0;
                for (; A < 7;) {
                    var p = h[A], m = d[A];
                    var w = 0, v = 0, b = c[A];
                    for (; b < i;)
                        b += p, v++;
                    var y = u[A];
                    for (; y < r;)
                        y += m, w++;
                    var E = Math.ceil(w * o / 8);
                    _filterZero(e, t, l, w, v);
                    var F = 0, _ = c[A];
                    for (; _ < i;) {
                        var t_1 = u[A], i_4 = l + F * E << 3;
                        for (; t_1 < r;) {
                            var g;
                            if (1 == o)
                                g = (g = e[i_4 >> 3]) >> 7 - (7 & i_4) & 1, f[_ * s + (t_1 >> 3)] |= g << 7 - ((7 & t_1) << 0);
                            if (2 == o)
                                g = (g = e[i_4 >> 3]) >> 6 - (7 & i_4) & 3, f[_ * s + (t_1 >> 2)] |= g << 6 - ((3 & t_1) << 1);
                            if (4 == o)
                                g = (g = e[i_4 >> 3]) >> 4 - (7 & i_4) & 15, f[_ * s + (t_1 >> 1)] |= g << 4 - ((1 & t_1) << 2);
                            if (o >= 8) {
                                var r_2 = _ * s + t_1 * a;
                                for (var t_2 = 0; t_2 < a; t_2++)
                                    f[r_2 + t_2] = e[(i_4 >> 3) + t_2];
                            }
                            i_4 += o, t_1 += m;
                        }
                        F++, _ += p;
                    }
                    w * v != 0 && (l += v * (1 + E)), A += 1;
                }
                return f;
            }(r, e)), r;
        }
        function _inflate(e, r) {
            return t(new Uint8Array(e.buffer, 2, e.length - 6), r);
        }
        var t = function () {
            var e = { H: {} };
            return e.H.N = function (t, r) {
                var i = Uint8Array;
                var o, a, s = 0, f = 0, l = 0, c = 0, u = 0, h = 0, d = 0, A = 0, g = 0;
                if (3 == t[0] && 0 == t[1])
                    return r || new i(0);
                var p = e.H, m = p.b, w = p.e, v = p.R, b = p.n, y = p.A, E = p.Z, F = p.m, _ = null == r;
                for (_ && (r = new i(t.length >>> 2 << 5)); 0 == s;)
                    if (s = m(t, g, 1), f = m(t, g + 1, 2), g += 3, 0 != f) {
                        if (_ && (r = e.H.W(r, A + (1 << 17))), 1 == f && (o = F.J, a = F.h, h = 511, d = 31), 2 == f) {
                            l = w(t, g, 5) + 257, c = w(t, g + 5, 5) + 1, u = w(t, g + 10, 4) + 4, g += 14;
                            var e_6 = 1;
                            for (var B = 0; B < 38; B += 2)
                                F.Q[B] = 0, F.Q[B + 1] = 0;
                            for (B = 0; B < u; B++) {
                                var r_3 = w(t, g + 3 * B, 3);
                                F.Q[1 + (F.X[B] << 1)] = r_3, r_3 > e_6 && (e_6 = r_3);
                            }
                            g += 3 * u, b(F.Q, e_6), y(F.Q, e_6, F.u), o = F.w, a = F.d, g = v(F.u, (1 << e_6) - 1, l + c, t, g, F.v);
                            var r_4 = p.V(F.v, 0, l, F.C);
                            h = (1 << r_4) - 1;
                            var i_5 = p.V(F.v, l, c, F.D);
                            d = (1 << i_5) - 1, b(F.C, r_4), y(F.C, r_4, o), b(F.D, i_5), y(F.D, i_5, a);
                        }
                        for (;;) {
                            var e_7 = o[E(t, g) & h];
                            g += 15 & e_7;
                            var i_6 = e_7 >>> 4;
                            if (i_6 >>> 8 == 0)
                                r[A++] = i_6;
                            else {
                                if (256 == i_6)
                                    break;
                                {
                                    var e_8 = A + i_6 - 254;
                                    if (i_6 > 264) {
                                        var r_5 = F.q[i_6 - 257];
                                        e_8 = A + (r_5 >>> 3) + w(t, g, 7 & r_5), g += 7 & r_5;
                                    }
                                    var o_4 = a[E(t, g) & d];
                                    g += 15 & o_4;
                                    var s_3 = o_4 >>> 4, f_2 = F.c[s_3], l_2 = (f_2 >>> 4) + m(t, g, 15 & f_2);
                                    for (g += 15 & f_2; A < e_8;)
                                        r[A] = r[A++ - l_2], r[A] = r[A++ - l_2], r[A] = r[A++ - l_2], r[A] = r[A++ - l_2];
                                    A = e_8;
                                }
                            }
                        }
                    }
                    else {
                        0 != (7 & g) && (g += 8 - (7 & g));
                        var o_5 = 4 + (g >>> 3), a_3 = t[o_5 - 4] | t[o_5 - 3] << 8;
                        _ && (r = e.H.W(r, A + a_3)), r.set(new i(t.buffer, t.byteOffset + o_5, a_3), A), g = o_5 + a_3 << 3, A += a_3;
                    }
                return r.length == A ? r : r.slice(0, A);
            }, e.H.W = function (e, t) {
                var r = e.length;
                if (t <= r)
                    return e;
                var i = new Uint8Array(r << 1);
                return i.set(e, 0), i;
            }, e.H.R = function (t, r, i, o, a, s) {
                var f = e.H.e, l = e.H.Z;
                var c = 0;
                for (; c < i;) {
                    var e_9 = t[l(o, a) & r];
                    a += 15 & e_9;
                    var i_7 = e_9 >>> 4;
                    if (i_7 <= 15)
                        s[c] = i_7, c++;
                    else {
                        var e_10 = 0, t_3 = 0;
                        16 == i_7 ? (t_3 = 3 + f(o, a, 2), a += 2, e_10 = s[c - 1]) : 17 == i_7 ? (t_3 = 3 + f(o, a, 3), a += 3) : 18 == i_7 && (t_3 = 11 + f(o, a, 7), a += 7);
                        var r_6 = c + t_3;
                        for (; c < r_6;)
                            s[c] = e_10, c++;
                    }
                }
                return a;
            }, e.H.V = function (e, t, r, i) {
                var o = 0, a = 0;
                var s = i.length >>> 1;
                for (; a < r;) {
                    var r_7 = e[a + t];
                    i[a << 1] = 0, i[1 + (a << 1)] = r_7, r_7 > o && (o = r_7), a++;
                }
                for (; a < s;)
                    i[a << 1] = 0, i[1 + (a << 1)] = 0, a++;
                return o;
            }, e.H.n = function (t, r) {
                var i = e.H.m, o = t.length;
                var a, s, f;
                var l;
                var c = i.j;
                for (var u = 0; u <= r; u++)
                    c[u] = 0;
                for (u = 1; u < o; u += 2)
                    c[t[u]]++;
                var h = i.K;
                for (a = 0, c[0] = 0, s = 1; s <= r; s++)
                    a = a + c[s - 1] << 1, h[s] = a;
                for (f = 0; f < o; f += 2)
                    l = t[f + 1], 0 != l && (t[f] = h[l], h[l]++);
            }, e.H.A = function (t, r, i) {
                var o = t.length, a = e.H.m.r;
                for (var e_11 = 0; e_11 < o; e_11 += 2)
                    if (0 != t[e_11 + 1]) {
                        var o_6 = e_11 >> 1, s_4 = t[e_11 + 1], f_3 = o_6 << 4 | s_4, l_3 = r - s_4;
                        var c = t[e_11] << l_3;
                        var u = c + (1 << l_3);
                        for (; c != u;) {
                            i[a[c] >>> 15 - r] = f_3, c++;
                        }
                    }
            }, e.H.l = function (t, r) {
                var i = e.H.m.r, o = 15 - r;
                for (var e_12 = 0; e_12 < t.length; e_12 += 2) {
                    var a_4 = t[e_12] << r - t[e_12 + 1];
                    t[e_12] = i[a_4] >>> o;
                }
            }, e.H.M = function (e, t, r) {
                r <<= 7 & t;
                var i = t >>> 3;
                e[i] |= r, e[i + 1] |= r >>> 8;
            }, e.H.I = function (e, t, r) {
                r <<= 7 & t;
                var i = t >>> 3;
                e[i] |= r, e[i + 1] |= r >>> 8, e[i + 2] |= r >>> 16;
            }, e.H.e = function (e, t, r) {
                return (e[t >>> 3] | e[1 + (t >>> 3)] << 8) >>> (7 & t) & (1 << r) - 1;
            }, e.H.b = function (e, t, r) {
                return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t) & (1 << r) - 1;
            }, e.H.Z = function (e, t) {
                return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16) >>> (7 & t);
            }, e.H.i = function (e, t) {
                return (e[t >>> 3] | e[1 + (t >>> 3)] << 8 | e[2 + (t >>> 3)] << 16 | e[3 + (t >>> 3)] << 24) >>> (7 & t);
            }, e.H.m = function () {
                var e = Uint16Array, t = Uint32Array;
                return {
                    K: new e(16),
                    j: new e(16),
                    X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                    S: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999],
                    T: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0],
                    q: new e(32),
                    p: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535],
                    z: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0],
                    c: new t(32),
                    J: new e(512),
                    _: [],
                    h: new e(32),
                    $: [],
                    w: new e(32768),
                    C: [],
                    v: [],
                    d: new e(32768),
                    D: [],
                    u: new e(512),
                    Q: [],
                    r: new e(32768),
                    s: new t(286),
                    Y: new t(30),
                    a: new t(19),
                    t: new t(15e3),
                    k: new e(65536),
                    g: new e(32768)
                };
            }(), function () {
                var t = e.H.m;
                for (var r = 0; r < 32768; r++) {
                    var e_13 = r;
                    e_13 = (2863311530 & e_13) >>> 1 | (1431655765 & e_13) << 1, e_13 = (3435973836 & e_13) >>> 2 | (858993459 & e_13) << 2, e_13 = (4042322160 & e_13) >>> 4 | (252645135 & e_13) << 4, e_13 = (4278255360 & e_13) >>> 8 | (16711935 & e_13) << 8, t.r[r] = (e_13 >>> 16 | e_13 << 16) >>> 17;
                }
                function n(e, t, r) {
                    for (; 0 != t--;)
                        e.push(0, r);
                }
                for (r = 0; r < 32; r++)
                    t.q[r] = t.S[r] << 3 | t.T[r], t.c[r] = t.p[r] << 4 | t.z[r];
                n(t._, 144, 8), n(t._, 112, 9), n(t._, 24, 7), n(t._, 8, 8), e.H.n(t._, 9), e.H.A(t._, 9, t.J), e.H.l(t._, 9), n(t.$, 32, 5), e.H.n(t.$, 5), e.H.A(t.$, 5, t.h), e.H.l(t.$, 5), n(t.Q, 19, 0), n(t.C, 286, 0), n(t.D, 30, 0), n(t.v, 320, 0);
            }(), e.H.N;
        }();
        function _getBPP(e) {
            return [1, null, 3, 1, 2, null, 4][e.ctype] * e.depth;
        }
        function _filterZero(e, t, r, i, o) {
            var a = _getBPP(t);
            var s = Math.ceil(i * a / 8);
            var f, l;
            a = Math.ceil(a / 8);
            var c = e[r], u = 0;
            if (c > 1 && (e[r] = [0, 0, 1][c - 2]), 3 == c)
                for (u = a; u < s; u++)
                    e[u + 1] = e[u + 1] + (e[u + 1 - a] >>> 1) & 255;
            for (var t_4 = 0; t_4 < o; t_4++)
                if (f = r + t_4 * s, l = f + t_4 + 1, c = e[l - 1], u = 0, 0 == c)
                    for (; u < s; u++)
                        e[f + u] = e[l + u];
                else if (1 == c) {
                    for (; u < a; u++)
                        e[f + u] = e[l + u];
                    for (; u < s; u++)
                        e[f + u] = e[l + u] + e[f + u - a];
                }
                else if (2 == c)
                    for (; u < s; u++)
                        e[f + u] = e[l + u] + e[f + u - s];
                else if (3 == c) {
                    for (; u < a; u++)
                        e[f + u] = e[l + u] + (e[f + u - s] >>> 1);
                    for (; u < s; u++)
                        e[f + u] = e[l + u] + (e[f + u - s] + e[f + u - a] >>> 1);
                }
                else {
                    for (; u < a; u++)
                        e[f + u] = e[l + u] + _paeth(0, e[f + u - s], 0);
                    for (; u < s; u++)
                        e[f + u] = e[l + u] + _paeth(e[f + u - a], e[f + u - s], e[f + u - a - s]);
                }
            return e;
        }
        function _paeth(e, t, r) {
            var i = e + t - r, o = i - e, a = i - t, s = i - r;
            return o * o <= a * a && o * o <= s * s ? e : a * a <= s * s ? t : r;
        }
        function _IHDR(t, r, i) {
            i.width = e.readUint(t, r), r += 4, i.height = e.readUint(t, r), r += 4, i.depth = t[r], r++, i.ctype = t[r], r++, i.compress = t[r], r++, i.filter = t[r], r++, i.interlace = t[r], r++;
        }
        function _copyTile(e, t, r, i, o, a, s, f, l) {
            var c = Math.min(t, o), u = Math.min(r, a);
            var h = 0, d = 0;
            for (var r_8 = 0; r_8 < u; r_8++)
                for (var a_5 = 0; a_5 < c; a_5++)
                    if (s >= 0 && f >= 0 ? (h = r_8 * t + a_5 << 2, d = (f + r_8) * o + s + a_5 << 2) : (h = (-f + r_8) * t - s + a_5 << 2, d = r_8 * o + a_5 << 2), 0 == l)
                        i[d] = e[h], i[d + 1] = e[h + 1], i[d + 2] = e[h + 2], i[d + 3] = e[h + 3];
                    else if (1 == l) {
                        var A = e[h + 3] * (1 / 255), g = e[h] * A, p = e[h + 1] * A, m = e[h + 2] * A, w = i[d + 3] * (1 / 255), v = i[d] * w, b = i[d + 1] * w, y = i[d + 2] * w;
                        var t_5 = 1 - A, r_9 = A + w * t_5, o_7 = 0 == r_9 ? 0 : 1 / r_9;
                        i[d + 3] = 255 * r_9, i[d + 0] = (g + v * t_5) * o_7, i[d + 1] = (p + b * t_5) * o_7, i[d + 2] = (m + y * t_5) * o_7;
                    }
                    else if (2 == l) {
                        A = e[h + 3], g = e[h], p = e[h + 1], m = e[h + 2], w = i[d + 3], v = i[d], b = i[d + 1], y = i[d + 2];
                        A == w && g == v && p == b && m == y ? (i[d] = 0, i[d + 1] = 0, i[d + 2] = 0, i[d + 3] = 0) : (i[d] = g, i[d + 1] = p, i[d + 2] = m, i[d + 3] = A);
                    }
                    else if (3 == l) {
                        A = e[h + 3], g = e[h], p = e[h + 1], m = e[h + 2], w = i[d + 3], v = i[d], b = i[d + 1], y = i[d + 2];
                        if (A == w && g == v && p == b && m == y)
                            continue;
                        if (A < 220 && w > 20)
                            return !1;
                    }
            return !0;
        }
        return {
            decode: function decode(r) {
                var i = new Uint8Array(r);
                var o = 8;
                var a = e, s = a.readUshort, f = a.readUint, l = { tabs: {}, frames: [] }, c = new Uint8Array(i.length);
                var u, h = 0, d = 0;
                var A = [137, 80, 78, 71, 13, 10, 26, 10];
                for (var g = 0; g < 8; g++)
                    if (i[g] != A[g])
                        throw "The input is not a PNG file!";
                for (; o < i.length;) {
                    var e_14 = a.readUint(i, o);
                    o += 4;
                    var r_10 = a.readASCII(i, o, 4);
                    if (o += 4, "IHDR" == r_10)
                        _IHDR(i, o, l);
                    else if ("iCCP" == r_10) {
                        for (var p = o; 0 != i[p];)
                            p++;
                        a.readASCII(i, o, p - o), i[p + 1];
                        var s_5 = i.slice(p + 2, o + e_14);
                        var f_4 = null;
                        try {
                            f_4 = _inflate(s_5);
                        }
                        catch (e) {
                            f_4 = t(s_5);
                        }
                        l.tabs[r_10] = f_4;
                    }
                    else if ("CgBI" == r_10)
                        l.tabs[r_10] = i.slice(o, o + 4);
                    else if ("IDAT" == r_10) {
                        for (g = 0; g < e_14; g++)
                            c[h + g] = i[o + g];
                        h += e_14;
                    }
                    else if ("acTL" == r_10)
                        l.tabs[r_10] = {
                            num_frames: f(i, o),
                            num_plays: f(i, o + 4)
                        }, u = new Uint8Array(i.length);
                    else if ("fcTL" == r_10) {
                        if (0 != d)
                            (E = l.frames[l.frames.length - 1]).data = _decompress(l, u.slice(0, d), E.rect.width, E.rect.height), d = 0;
                        var e_15 = { x: f(i, o + 12), y: f(i, o + 16), width: f(i, o + 4), height: f(i, o + 8) };
                        var t_6 = s(i, o + 22);
                        t_6 = s(i, o + 20) / (0 == t_6 ? 100 : t_6);
                        var r_11 = { rect: e_15, delay: Math.round(1e3 * t_6), dispose: i[o + 24], blend: i[o + 25] };
                        l.frames.push(r_11);
                    }
                    else if ("fdAT" == r_10) {
                        for (g = 0; g < e_14 - 4; g++)
                            u[d + g] = i[o + g + 4];
                        d += e_14 - 4;
                    }
                    else if ("pHYs" == r_10)
                        l.tabs[r_10] = [a.readUint(i, o), a.readUint(i, o + 4), i[o + 8]];
                    else if ("cHRM" == r_10) {
                        l.tabs[r_10] = [];
                        for (g = 0; g < 8; g++)
                            l.tabs[r_10].push(a.readUint(i, o + 4 * g));
                    }
                    else if ("tEXt" == r_10 || "zTXt" == r_10) {
                        null == l.tabs[r_10] && (l.tabs[r_10] = {});
                        var m = a.nextZero(i, o), w = a.readASCII(i, o, m - o), v = o + e_14 - m - 1;
                        if ("tEXt" == r_10)
                            y = a.readASCII(i, m + 1, v);
                        else {
                            var b = _inflate(i.slice(m + 2, m + 2 + v));
                            y = a.readUTF8(b, 0, b.length);
                        }
                        l.tabs[r_10][w] = y;
                    }
                    else if ("iTXt" == r_10) {
                        null == l.tabs[r_10] && (l.tabs[r_10] = {});
                        m = 0, p = o;
                        m = a.nextZero(i, p);
                        w = a.readASCII(i, p, m - p);
                        var t_7 = i[p = m + 1];
                        var y;
                        i[p + 1], p += 2, m = a.nextZero(i, p), a.readASCII(i, p, m - p), p = m + 1, m = a.nextZero(i, p), a.readUTF8(i, p, m - p);
                        v = e_14 - ((p = m + 1) - o);
                        if (0 == t_7)
                            y = a.readUTF8(i, p, v);
                        else {
                            b = _inflate(i.slice(p, p + v));
                            y = a.readUTF8(b, 0, b.length);
                        }
                        l.tabs[r_10][w] = y;
                    }
                    else if ("PLTE" == r_10)
                        l.tabs[r_10] = a.readBytes(i, o, e_14);
                    else if ("hIST" == r_10) {
                        var e_16 = l.tabs.PLTE.length / 3;
                        l.tabs[r_10] = [];
                        for (g = 0; g < e_16; g++)
                            l.tabs[r_10].push(s(i, o + 2 * g));
                    }
                    else if ("tRNS" == r_10)
                        3 == l.ctype ? l.tabs[r_10] = a.readBytes(i, o, e_14) : 0 == l.ctype ? l.tabs[r_10] = s(i, o) : 2 == l.ctype && (l.tabs[r_10] = [s(i, o), s(i, o + 2), s(i, o + 4)]);
                    else if ("gAMA" == r_10)
                        l.tabs[r_10] = a.readUint(i, o) / 1e5;
                    else if ("sRGB" == r_10)
                        l.tabs[r_10] = i[o];
                    else if ("bKGD" == r_10)
                        0 == l.ctype || 4 == l.ctype ? l.tabs[r_10] = [s(i, o)] : 2 == l.ctype || 6 == l.ctype ? l.tabs[r_10] = [s(i, o), s(i, o + 2), s(i, o + 4)] : 3 == l.ctype && (l.tabs[r_10] = i[o]);
                    else if ("IEND" == r_10)
                        break;
                    o += e_14, a.readUint(i, o), o += 4;
                }
                var E;
                return 0 != d && ((E = l.frames[l.frames.length - 1]).data = _decompress(l, u.slice(0, d), E.rect.width, E.rect.height)), l.data = _decompress(l, c, l.width, l.height), delete l.compress, delete l.interlace, delete l.filter, l;
            }, toRGBA8: function toRGBA8(e) {
                var t = e.width, r = e.height;
                if (null == e.tabs.acTL)
                    return [decodeImage(e.data, t, r, e).buffer];
                var i = [];
                null == e.frames[0].data && (e.frames[0].data = e.data);
                var o = t * r * 4, a = new Uint8Array(o), s = new Uint8Array(o), f = new Uint8Array(o);
                for (var c = 0; c < e.frames.length; c++) {
                    var u = e.frames[c], h = u.rect.x, d = u.rect.y, A = u.rect.width, g = u.rect.height, p = decodeImage(u.data, A, g, e);
                    if (0 != c)
                        for (var l = 0; l < o; l++)
                            f[l] = a[l];
                    if (0 == u.blend ? _copyTile(p, A, g, a, t, r, h, d, 0) : 1 == u.blend && _copyTile(p, A, g, a, t, r, h, d, 1), i.push(a.buffer.slice(0)), 0 == u.dispose)
                        ;
                    else if (1 == u.dispose)
                        _copyTile(s, A, g, a, t, r, h, d, 0);
                    else if (2 == u.dispose)
                        for (l = 0; l < o; l++)
                            a[l] = f[l];
                }
                return i;
            }, _paeth: _paeth, _copyTile: _copyTile, _bin: e
        };
    }();
    !function () {
        var e = UPNG._copyTile, t = UPNG._bin, r = UPNG._paeth;
        var i = {
            table: function () {
                var e = new Uint32Array(256);
                for (var t_8 = 0; t_8 < 256; t_8++) {
                    var r_12 = t_8;
                    for (var e_17 = 0; e_17 < 8; e_17++)
                        1 & r_12 ? r_12 = 3988292384 ^ r_12 >>> 1 : r_12 >>>= 1;
                    e[t_8] = r_12;
                }
                return e;
            }(),
            update: function (e, t, r, o) {
                for (var a_6 = 0; a_6 < o; a_6++)
                    e = i.table[255 & (e ^ t[r + a_6])] ^ e >>> 8;
                return e;
            },
            crc: function (e, t, r) { return 4294967295 ^ i.update(4294967295, e, t, r); }
        };
        function addErr(e, t, r, i) {
            t[r] += e[0] * i >> 4, t[r + 1] += e[1] * i >> 4, t[r + 2] += e[2] * i >> 4, t[r + 3] += e[3] * i >> 4;
        }
        function N(e) {
            return Math.max(0, Math.min(255, e));
        }
        function D(e, t) {
            var r = e[0] - t[0], i = e[1] - t[1], o = e[2] - t[2], a = e[3] - t[3];
            return r * r + i * i + o * o + a * a;
        }
        function dither(e, t, r, i, o, a, s) {
            null == s && (s = 1);
            var f = i.length, l = [];
            for (var c = 0; c < f; c++) {
                var e_18 = i[c];
                l.push([e_18 >>> 0 & 255, e_18 >>> 8 & 255, e_18 >>> 16 & 255, e_18 >>> 24 & 255]);
            }
            for (c = 0; c < f; c++) {
                var e_19 = 4294967295;
                for (var u = 0, h = 0; h < f; h++) {
                    var d = D(l[c], l[h]);
                    h != c && d < e_19 && (e_19 = d, u = h);
                }
            }
            var A = new Uint32Array(o.buffer), g = new Int16Array(t * r * 4), p = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
            for (c = 0; c < p.length; c++)
                p[c] = 255 * ((p[c] + .5) / 16 - .5);
            for (var o_8 = 0; o_8 < r; o_8++)
                for (var w = 0; w < t; w++) {
                    var m;
                    c = 4 * (o_8 * t + w);
                    if (2 != s)
                        m = [N(e[c] + g[c]), N(e[c + 1] + g[c + 1]), N(e[c + 2] + g[c + 2]), N(e[c + 3] + g[c + 3])];
                    else {
                        d = p[4 * (3 & o_8) + (3 & w)];
                        m = [N(e[c] + d), N(e[c + 1] + d), N(e[c + 2] + d), N(e[c + 3] + d)];
                    }
                    u = 0;
                    var v = 16777215;
                    for (h = 0; h < f; h++) {
                        var e_20 = D(m, l[h]);
                        e_20 < v && (v = e_20, u = h);
                    }
                    var b = l[u], y = [m[0] - b[0], m[1] - b[1], m[2] - b[2], m[3] - b[3]];
                    1 == s && (w != t - 1 && addErr(y, g, c + 4, 7), o_8 != r - 1 && (0 != w && addErr(y, g, c + 4 * t - 4, 3), addErr(y, g, c + 4 * t, 5), w != t - 1 && addErr(y, g, c + 4 * t + 4, 1))), a[c >> 2] = u, A[c >> 2] = i[u];
                }
        }
        function _main(e, r, o, a, s) {
            null == s && (s = {});
            var f = i.crc, l = t.writeUint, c = t.writeUshort, u = t.writeASCII;
            var h = 8;
            var d = e.frames.length > 1;
            var A, g = !1, p = 33 + (d ? 20 : 0);
            if (null != s.sRGB && (p += 13), null != s.pHYs && (p += 21), null != s.iCCP && (A = pako.deflate(s.iCCP), p += 21 + A.length + 4), 3 == e.ctype) {
                for (var m = e.plte.length, w = 0; w < m; w++)
                    e.plte[w] >>> 24 != 255 && (g = !0);
                p += 8 + 3 * m + 4 + (g ? 8 + 1 * m + 4 : 0);
            }
            for (var v = 0; v < e.frames.length; v++) {
                d && (p += 38), p += (F = e.frames[v]).cimg.length + 12, 0 != v && (p += 4);
            }
            p += 12;
            var b = new Uint8Array(p), y = [137, 80, 78, 71, 13, 10, 26, 10];
            for (w = 0; w < 8; w++)
                b[w] = y[w];
            if (l(b, h, 13), h += 4, u(b, h, "IHDR"), h += 4, l(b, h, r), h += 4, l(b, h, o), h += 4, b[h] = e.depth, h++, b[h] = e.ctype, h++, b[h] = 0, h++, b[h] = 0, h++, b[h] = 0, h++, l(b, h, f(b, h - 17, 17)), h += 4, null != s.sRGB && (l(b, h, 1), h += 4, u(b, h, "sRGB"), h += 4, b[h] = s.sRGB, h++, l(b, h, f(b, h - 5, 5)), h += 4), null != s.iCCP) {
                var e_21 = 13 + A.length;
                l(b, h, e_21), h += 4, u(b, h, "iCCP"), h += 4, u(b, h, "ICC profile"), h += 11, h += 2, b.set(A, h), h += A.length, l(b, h, f(b, h - (e_21 + 4), e_21 + 4)), h += 4;
            }
            if (null != s.pHYs && (l(b, h, 9), h += 4, u(b, h, "pHYs"), h += 4, l(b, h, s.pHYs[0]), h += 4, l(b, h, s.pHYs[1]), h += 4, b[h] = s.pHYs[2], h++, l(b, h, f(b, h - 13, 13)), h += 4), d && (l(b, h, 8), h += 4, u(b, h, "acTL"), h += 4, l(b, h, e.frames.length), h += 4, l(b, h, null != s.loop ? s.loop : 0), h += 4, l(b, h, f(b, h - 12, 12)), h += 4), 3 == e.ctype) {
                l(b, h, 3 * (m = e.plte.length)), h += 4, u(b, h, "PLTE"), h += 4;
                for (w = 0; w < m; w++) {
                    var t_9 = 3 * w, r_13 = e.plte[w], i_8 = 255 & r_13, o_9 = r_13 >>> 8 & 255, a_7 = r_13 >>> 16 & 255;
                    b[h + t_9 + 0] = i_8, b[h + t_9 + 1] = o_9, b[h + t_9 + 2] = a_7;
                }
                if (h += 3 * m, l(b, h, f(b, h - 3 * m - 4, 3 * m + 4)), h += 4, g) {
                    l(b, h, m), h += 4, u(b, h, "tRNS"), h += 4;
                    for (w = 0; w < m; w++)
                        b[h + w] = e.plte[w] >>> 24 & 255;
                    h += m, l(b, h, f(b, h - m - 4, m + 4)), h += 4;
                }
            }
            var E = 0;
            for (v = 0; v < e.frames.length; v++) {
                var F = e.frames[v];
                d && (l(b, h, 26), h += 4, u(b, h, "fcTL"), h += 4, l(b, h, E++), h += 4, l(b, h, F.rect.width), h += 4, l(b, h, F.rect.height), h += 4, l(b, h, F.rect.x), h += 4, l(b, h, F.rect.y), h += 4, c(b, h, a[v]), h += 2, c(b, h, 1e3), h += 2, b[h] = F.dispose, h++, b[h] = F.blend, h++, l(b, h, f(b, h - 30, 30)), h += 4);
                var t_10 = F.cimg;
                l(b, h, (m = t_10.length) + (0 == v ? 0 : 4)), h += 4;
                var r_14 = h;
                u(b, h, 0 == v ? "IDAT" : "fdAT"), h += 4, 0 != v && (l(b, h, E++), h += 4), b.set(t_10, h), h += m, l(b, h, f(b, r_14, h - r_14)), h += 4;
            }
            return l(b, h, 0), h += 4, u(b, h, "IEND"), h += 4, l(b, h, f(b, h - 4, 4)), h += 4, b.buffer;
        }
        function compressPNG(e, t, r) {
            for (var i_9 = 0; i_9 < e.frames.length; i_9++) {
                var o_10 = e.frames[i_9];
                o_10.rect.width;
                var a_8 = o_10.rect.height, s_6 = new Uint8Array(a_8 * o_10.bpl + a_8);
                o_10.cimg = _filterZero(o_10.img, a_8, o_10.bpp, o_10.bpl, s_6, t, r);
            }
        }
        function compress(t, r, i, o, a) {
            var s = a[0], f = a[1], l = a[2], c = a[3], u = a[4], h = a[5];
            var d = 6, A = 8, g = 255;
            for (var p = 0; p < t.length; p++) {
                var e_22 = new Uint8Array(t[p]);
                for (var m = e_22.length, w = 0; w < m; w += 4)
                    g &= e_22[w + 3];
            }
            var v = 255 != g, b = function framize(t, r, i, o, a, s) {
                var f = [];
                for (var l = 0; l < t.length; l++) {
                    var h_1 = new Uint8Array(t[l]), A_1 = new Uint32Array(h_1.buffer);
                    var c;
                    var g_1 = 0, p_1 = 0, m_1 = r, w_1 = i, v_1 = o ? 1 : 0;
                    if (0 != l) {
                        var b_1 = s || o || 1 == l || 0 != f[l - 2].dispose ? 1 : 2;
                        var y_1 = 0, E_1 = 1e9;
                        for (var e_23 = 0; e_23 < b_1; e_23++) {
                            var u = new Uint8Array(t[l - 1 - e_23]);
                            var o_11 = new Uint32Array(t[l - 1 - e_23]);
                            var s_7 = r, f_5 = i, c_2 = -1, h_2 = -1;
                            for (var e_24 = 0; e_24 < i; e_24++)
                                for (var t_11 = 0; t_11 < r; t_11++) {
                                    A_1[d = e_24 * r + t_11] != o_11[d] && (t_11 < s_7 && (s_7 = t_11), t_11 > c_2 && (c_2 = t_11), e_24 < f_5 && (f_5 = e_24), e_24 > h_2 && (h_2 = e_24));
                                }
                            -1 == c_2 && (s_7 = f_5 = c_2 = h_2 = 0), a && (1 == (1 & s_7) && s_7--, 1 == (1 & f_5) && f_5--);
                            var v_2 = (c_2 - s_7 + 1) * (h_2 - f_5 + 1);
                            v_2 < E_1 && (E_1 = v_2, y_1 = e_23, g_1 = s_7, p_1 = f_5, m_1 = c_2 - s_7 + 1, w_1 = h_2 - f_5 + 1);
                        }
                        u = new Uint8Array(t[l - 1 - y_1]);
                        1 == y_1 && (f[l - 1].dispose = 2), c = new Uint8Array(m_1 * w_1 * 4), e(u, r, i, c, m_1, w_1, -g_1, -p_1, 0), v_1 = e(h_1, r, i, c, m_1, w_1, -g_1, -p_1, 3) ? 1 : 0, 1 == v_1 ? _prepareDiff(h_1, r, i, c, {
                            x: g_1,
                            y: p_1,
                            width: m_1,
                            height: w_1
                        }) : e(h_1, r, i, c, m_1, w_1, -g_1, -p_1, 0);
                    }
                    else
                        c = h_1.slice(0);
                    f.push({ rect: { x: g_1, y: p_1, width: m_1, height: w_1 }, img: c, blend: v_1, dispose: 0 });
                }
                if (o)
                    for (l = 0; l < f.length; l++) {
                        if (1 == (A = f[l]).blend)
                            continue;
                        var e_25 = A.rect, o_12 = f[l - 1].rect, s_8 = Math.min(e_25.x, o_12.x), c_3 = Math.min(e_25.y, o_12.y), u_1 = {
                            x: s_8,
                            y: c_3,
                            width: Math.max(e_25.x + e_25.width, o_12.x + o_12.width) - s_8,
                            height: Math.max(e_25.y + e_25.height, o_12.y + o_12.height) - c_3
                        };
                        f[l - 1].dispose = 1, l - 1 != 0 && _updateFrame(t, r, i, f, l - 1, u_1, a), _updateFrame(t, r, i, f, l, u_1, a);
                    }
                var h = 0;
                if (1 != t.length)
                    for (var d = 0; d < f.length; d++) {
                        var A;
                        h += (A = f[d]).rect.width * A.rect.height;
                    }
                return f;
            }(t, r, i, s, f, l), y = {}, E = [], F = [];
            if (0 != o) {
                var e_26 = [];
                for (w = 0; w < b.length; w++)
                    e_26.push(b[w].img.buffer);
                var t_12 = function concatRGBA(e) {
                    var t = 0;
                    for (var r = 0; r < e.length; r++)
                        t += e[r].byteLength;
                    var i = new Uint8Array(t);
                    var o = 0;
                    for (r = 0; r < e.length; r++) {
                        var t_13 = new Uint8Array(e[r]), a_9 = t_13.length;
                        for (var e_27 = 0; e_27 < a_9; e_27 += 4) {
                            var r_15 = t_13[e_27], a_10 = t_13[e_27 + 1], s_9 = t_13[e_27 + 2];
                            var f_6 = t_13[e_27 + 3];
                            0 == f_6 && (r_15 = a_10 = s_9 = 0), i[o + e_27] = r_15, i[o + e_27 + 1] = a_10, i[o + e_27 + 2] = s_9, i[o + e_27 + 3] = f_6;
                        }
                        o += a_9;
                    }
                    return i.buffer;
                }(e_26), r_16 = quantize(t_12, o);
                for (w = 0; w < r_16.plte.length; w++)
                    E.push(r_16.plte[w].est.rgba);
                var i_10 = 0;
                for (w = 0; w < b.length; w++) {
                    var e_28 = (B = b[w]).img.length;
                    var _ = new Uint8Array(r_16.inds.buffer, i_10 >> 2, e_28 >> 2);
                    F.push(_);
                    var t_14 = new Uint8Array(r_16.abuf, i_10, e_28);
                    h && dither(B.img, B.rect.width, B.rect.height, E, t_14, _), B.img.set(t_14), i_10 += e_28;
                }
            }
            else
                for (p = 0; p < b.length; p++) {
                    var B = b[p];
                    var e_29 = new Uint32Array(B.img.buffer);
                    var U = B.rect.width;
                    m = e_29.length, _ = new Uint8Array(m);
                    F.push(_);
                    for (w = 0; w < m; w++) {
                        var t_15 = e_29[w];
                        if (0 != w && t_15 == e_29[w - 1])
                            _[w] = _[w - 1];
                        else if (w > U && t_15 == e_29[w - U])
                            _[w] = _[w - U];
                        else {
                            var e_30 = y[t_15];
                            if (null == e_30 && (y[t_15] = e_30 = E.length, E.push(t_15), E.length >= 300))
                                break;
                            _[w] = e_30;
                        }
                    }
                }
            var C = E.length;
            C <= 256 && 0 == u && (A = C <= 2 ? 1 : C <= 4 ? 2 : C <= 16 ? 4 : 8, A = Math.max(A, c));
            for (p = 0; p < b.length; p++) {
                (B = b[p]).rect.x, B.rect.y;
                U = B.rect.width;
                var e_31 = B.rect.height;
                var t_16 = B.img;
                new Uint32Array(t_16.buffer);
                var r_17 = 4 * U, i_11 = 4;
                if (C <= 256 && 0 == u) {
                    r_17 = Math.ceil(A * U / 8);
                    var I = new Uint8Array(r_17 * e_31);
                    var o_13 = F[p];
                    for (var t_17 = 0; t_17 < e_31; t_17++) {
                        w = t_17 * r_17;
                        var e_32 = t_17 * U;
                        if (8 == A)
                            for (var Q = 0; Q < U; Q++)
                                I[w + Q] = o_13[e_32 + Q];
                        else if (4 == A)
                            for (Q = 0; Q < U; Q++)
                                I[w + (Q >> 1)] |= o_13[e_32 + Q] << 4 - 4 * (1 & Q);
                        else if (2 == A)
                            for (Q = 0; Q < U; Q++)
                                I[w + (Q >> 2)] |= o_13[e_32 + Q] << 6 - 2 * (3 & Q);
                        else if (1 == A)
                            for (Q = 0; Q < U; Q++)
                                I[w + (Q >> 3)] |= o_13[e_32 + Q] << 7 - 1 * (7 & Q);
                    }
                    t_16 = I, d = 3, i_11 = 1;
                }
                else if (0 == v && 1 == b.length) {
                    I = new Uint8Array(U * e_31 * 3);
                    var o_14 = U * e_31;
                    for (w = 0; w < o_14; w++) {
                        var e_33 = 3 * w, r_18 = 4 * w;
                        I[e_33] = t_16[r_18], I[e_33 + 1] = t_16[r_18 + 1], I[e_33 + 2] = t_16[r_18 + 2];
                    }
                    t_16 = I, d = 2, i_11 = 3, r_17 = 3 * U;
                }
                B.img = t_16, B.bpl = r_17, B.bpp = i_11;
            }
            return { ctype: d, depth: A, plte: E, frames: b };
        }
        function _updateFrame(t, r, i, o, a, s, f) {
            var l = Uint8Array, c = Uint32Array, u = new l(t[a - 1]), h = new c(t[a - 1]), d = a + 1 < t.length ? new l(t[a + 1]) : null, A = new l(t[a]), g = new c(A.buffer);
            var p = r, m = i, w = -1, v = -1;
            for (var e_34 = 0; e_34 < s.height; e_34++)
                for (var t_18 = 0; t_18 < s.width; t_18++) {
                    var i_12 = s.x + t_18, f_7 = s.y + e_34, l_4 = f_7 * r + i_12, c_4 = g[l_4];
                    0 == c_4 || 0 == o[a - 1].dispose && h[l_4] == c_4 && (null == d || 0 != d[4 * l_4 + 3]) || (i_12 < p && (p = i_12), i_12 > w && (w = i_12), f_7 < m && (m = f_7), f_7 > v && (v = f_7));
                }
            -1 == w && (p = m = w = v = 0), f && (1 == (1 & p) && p--, 1 == (1 & m) && m--), s = {
                x: p,
                y: m,
                width: w - p + 1,
                height: v - m + 1
            };
            var b = o[a];
            b.rect = s, b.blend = 1, b.img = new Uint8Array(s.width * s.height * 4), 0 == o[a - 1].dispose ? (e(u, r, i, b.img, s.width, s.height, -s.x, -s.y, 0), _prepareDiff(A, r, i, b.img, s)) : e(A, r, i, b.img, s.width, s.height, -s.x, -s.y, 0);
        }
        function _prepareDiff(t, r, i, o, a) {
            e(t, r, i, o, a.width, a.height, -a.x, -a.y, 2);
        }
        function _filterZero(e, t, r, i, o, a, s) {
            var f = [];
            var l, c = [0, 1, 2, 3, 4];
            -1 != a ? c = [a] : (t * i > 5e5 || 1 == r) && (c = [0]), s && (l = { level: 0 });
            var u = UZIP;
            for (var h = 0; h < c.length; h++) {
                for (var a_11 = 0; a_11 < t; a_11++)
                    _filterLine(o, e, a_11, i, r, c[h]);
                f.push(u.deflate(o, l));
            }
            var d, A = 1e9;
            for (h = 0; h < f.length; h++)
                f[h].length < A && (d = h, A = f[h].length);
            return f[d];
        }
        function _filterLine(e, t, i, o, a, s) {
            var f = i * o;
            var l = f + i;
            if (e[l] = s, l++, 0 == s)
                if (o < 500)
                    for (var c = 0; c < o; c++)
                        e[l + c] = t[f + c];
                else
                    e.set(new Uint8Array(t.buffer, f, o), l);
            else if (1 == s) {
                for (c = 0; c < a; c++)
                    e[l + c] = t[f + c];
                for (c = a; c < o; c++)
                    e[l + c] = t[f + c] - t[f + c - a] + 256 & 255;
            }
            else if (0 == i) {
                for (c = 0; c < a; c++)
                    e[l + c] = t[f + c];
                if (2 == s)
                    for (c = a; c < o; c++)
                        e[l + c] = t[f + c];
                if (3 == s)
                    for (c = a; c < o; c++)
                        e[l + c] = t[f + c] - (t[f + c - a] >> 1) + 256 & 255;
                if (4 == s)
                    for (c = a; c < o; c++)
                        e[l + c] = t[f + c] - r(t[f + c - a], 0, 0) + 256 & 255;
            }
            else {
                if (2 == s)
                    for (c = 0; c < o; c++)
                        e[l + c] = t[f + c] + 256 - t[f + c - o] & 255;
                if (3 == s) {
                    for (c = 0; c < a; c++)
                        e[l + c] = t[f + c] + 256 - (t[f + c - o] >> 1) & 255;
                    for (c = a; c < o; c++)
                        e[l + c] = t[f + c] + 256 - (t[f + c - o] + t[f + c - a] >> 1) & 255;
                }
                if (4 == s) {
                    for (c = 0; c < a; c++)
                        e[l + c] = t[f + c] + 256 - r(0, t[f + c - o], 0) & 255;
                    for (c = a; c < o; c++)
                        e[l + c] = t[f + c] + 256 - r(t[f + c - a], t[f + c - o], t[f + c - a - o]) & 255;
                }
            }
        }
        function quantize(e, t) {
            var r = new Uint8Array(e), i = r.slice(0), o = new Uint32Array(i.buffer), a = getKDtree(i, t), s = a[0], f = a[1], l = r.length, c = new Uint8Array(l >> 2);
            var u;
            if (r.length < 2e7)
                for (var h = 0; h < l; h += 4) {
                    u = getNearest(s, d = r[h] * (1 / 255), A = r[h + 1] * (1 / 255), g = r[h + 2] * (1 / 255), p = r[h + 3] * (1 / 255)), c[h >> 2] = u.ind, o[h >> 2] = u.est.rgba;
                }
            else
                for (h = 0; h < l; h += 4) {
                    var d = r[h] * (1 / 255), A = r[h + 1] * (1 / 255), g = r[h + 2] * (1 / 255), p = r[h + 3] * (1 / 255);
                    for (u = s; u.left;)
                        u = planeDst(u.est, d, A, g, p) <= 0 ? u.left : u.right;
                    c[h >> 2] = u.ind, o[h >> 2] = u.est.rgba;
                }
            return { abuf: i.buffer, inds: c, plte: f };
        }
        function getKDtree(e, t, r) {
            null == r && (r = 1e-4);
            var i = new Uint32Array(e.buffer), o = { i0: 0, i1: e.length, bst: null, est: null, tdst: 0, left: null, right: null };
            o.bst = stats(e, o.i0, o.i1), o.est = estats(o.bst);
            var a = [o];
            for (; a.length < t;) {
                var t_19 = 0, o_15 = 0;
                for (var s = 0; s < a.length; s++)
                    a[s].est.L > t_19 && (t_19 = a[s].est.L, o_15 = s);
                if (t_19 < r)
                    break;
                var f_8 = a[o_15], l_5 = splitPixels(e, i, f_8.i0, f_8.i1, f_8.est.e, f_8.est.eMq255);
                if (f_8.i0 >= l_5 || f_8.i1 <= l_5) {
                    f_8.est.L = 0;
                    continue;
                }
                var c = { i0: f_8.i0, i1: l_5, bst: null, est: null, tdst: 0, left: null, right: null };
                c.bst = stats(e, c.i0, c.i1), c.est = estats(c.bst);
                var u = { i0: l_5, i1: f_8.i1, bst: null, est: null, tdst: 0, left: null, right: null };
                u.bst = { R: [], m: [], N: f_8.bst.N - c.bst.N };
                for (s = 0; s < 16; s++)
                    u.bst.R[s] = f_8.bst.R[s] - c.bst.R[s];
                for (s = 0; s < 4; s++)
                    u.bst.m[s] = f_8.bst.m[s] - c.bst.m[s];
                u.est = estats(u.bst), f_8.left = c, f_8.right = u, a[o_15] = c, a.push(u);
            }
            a.sort((function (e, t) { return t.bst.N - e.bst.N; }));
            for (s = 0; s < a.length; s++)
                a[s].ind = s;
            return [o, a];
        }
        function getNearest(e, t, r, i, o) {
            if (null == e.left)
                return e.tdst = function dist(e, t, r, i, o) {
                    var a = t - e[0], s = r - e[1], f = i - e[2], l = o - e[3];
                    return a * a + s * s + f * f + l * l;
                }(e.est.q, t, r, i, o), e;
            var a = planeDst(e.est, t, r, i, o);
            var s = e.left, f = e.right;
            a > 0 && (s = e.right, f = e.left);
            var l = getNearest(s, t, r, i, o);
            if (l.tdst <= a * a)
                return l;
            var c = getNearest(f, t, r, i, o);
            return c.tdst < l.tdst ? c : l;
        }
        function planeDst(e, t, r, i, o) {
            var a = e.e;
            return a[0] * t + a[1] * r + a[2] * i + a[3] * o - e.eMq;
        }
        function splitPixels(e, t, r, i, o, a) {
            for (i -= 4; r < i;) {
                for (; vecDot(e, r, o) <= a;)
                    r += 4;
                for (; vecDot(e, i, o) > a;)
                    i -= 4;
                if (r >= i)
                    break;
                var s_10 = t[r >> 2];
                t[r >> 2] = t[i >> 2], t[i >> 2] = s_10, r += 4, i -= 4;
            }
            for (; vecDot(e, r, o) > a;)
                r -= 4;
            return r + 4;
        }
        function vecDot(e, t, r) {
            return e[t] * r[0] + e[t + 1] * r[1] + e[t + 2] * r[2] + e[t + 3] * r[3];
        }
        function stats(e, t, r) {
            var i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], o = [0, 0, 0, 0], a = r - t >> 2;
            for (var a_12 = t; a_12 < r; a_12 += 4) {
                var t_20 = e[a_12] * (1 / 255), r_19 = e[a_12 + 1] * (1 / 255), s_11 = e[a_12 + 2] * (1 / 255), f_9 = e[a_12 + 3] * (1 / 255);
                o[0] += t_20, o[1] += r_19, o[2] += s_11, o[3] += f_9, i[0] += t_20 * t_20, i[1] += t_20 * r_19, i[2] += t_20 * s_11, i[3] += t_20 * f_9, i[5] += r_19 * r_19, i[6] += r_19 * s_11, i[7] += r_19 * f_9, i[10] += s_11 * s_11, i[11] += s_11 * f_9, i[15] += f_9 * f_9;
            }
            return i[4] = i[1], i[8] = i[2], i[9] = i[6], i[12] = i[3], i[13] = i[7], i[14] = i[11], {
                R: i,
                m: o,
                N: a
            };
        }
        function estats(e) {
            var t = e.R, r = e.m, i = e.N, a = r[0], s = r[1], f = r[2], l = r[3], c = 0 == i ? 0 : 1 / i, u = [t[0] - a * a * c, t[1] - a * s * c, t[2] - a * f * c, t[3] - a * l * c, t[4] - s * a * c, t[5] - s * s * c, t[6] - s * f * c, t[7] - s * l * c, t[8] - f * a * c, t[9] - f * s * c, t[10] - f * f * c, t[11] - f * l * c, t[12] - l * a * c, t[13] - l * s * c, t[14] - l * f * c, t[15] - l * l * c], h = u, d = o;
            var A = [Math.random(), Math.random(), Math.random(), Math.random()], g = 0, p = 0;
            if (0 != i)
                for (var e_35 = 0; e_35 < 16 && (A = d.multVec(h, A), p = Math.sqrt(d.dot(A, A)), A = d.sml(1 / p, A), !(0 != e_35 && Math.abs(p - g) < 1e-9)); e_35++)
                    g = p;
            var m = [a * c, s * c, f * c, l * c];
            return {
                Cov: u,
                q: m,
                e: A,
                L: g,
                eMq255: d.dot(d.sml(255, m), A),
                eMq: d.dot(A, m),
                rgba: (Math.round(255 * m[3]) << 24 | Math.round(255 * m[2]) << 16 | Math.round(255 * m[1]) << 8 | Math.round(255 * m[0]) << 0) >>> 0
            };
        }
        var o = {
            multVec: function (e, t) { return [e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3], e[4] * t[0] + e[5] * t[1] + e[6] * t[2] + e[7] * t[3], e[8] * t[0] + e[9] * t[1] + e[10] * t[2] + e[11] * t[3], e[12] * t[0] + e[13] * t[1] + e[14] * t[2] + e[15] * t[3]]; },
            dot: function (e, t) { return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3]; },
            sml: function (e, t) { return [e * t[0], e * t[1], e * t[2], e * t[3]]; }
        };
        UPNG.encode = function encode(e, t, r, i, o, a, s) {
            null == i && (i = 0), null == s && (s = !1);
            var f = compress(e, t, r, i, [!1, !1, !1, 0, s, !1]);
            return compressPNG(f, -1), _main(f, t, r, o, a);
        }, UPNG.encodeLL = function encodeLL(e, t, r, i, o, a, s, f) {
            var l = { ctype: 0 + (1 == i ? 0 : 2) + (0 == o ? 0 : 4), depth: a, frames: [] }, c = (i + o) * a, u = c * t;
            for (var i_13 = 0; i_13 < e.length; i_13++)
                l.frames.push({
                    rect: { x: 0, y: 0, width: t, height: r },
                    img: new Uint8Array(e[i_13]),
                    blend: 0,
                    dispose: 1,
                    bpp: Math.ceil(c / 8),
                    bpl: Math.ceil(u / 8)
                });
            return compressPNG(l, 0, !0), _main(l, t, r, s, f);
        }, UPNG.encode.compress = compress, UPNG.encode.dither = dither, UPNG.quantize = quantize, UPNG.quantize.getKDtree = getKDtree, UPNG.quantize.getNearest = getNearest;
    }();
    var t = {
        toArrayBuffer: function (e, r) {
            var i = e.width, o = e.height, a = i << 2, s = e.getContext("2d").getImageData(0, 0, i, o), f = new Uint32Array(s.data.buffer), l = (32 * i + 31) / 32 << 2, c = l * o, u = 122 + c, h = new ArrayBuffer(u), d = new DataView(h), A = 1 << 20;
            var g, p, m, w, v = A, b = 0, y = 0, E = 0;
            function set16(e) {
                d.setUint16(y, e, !0), y += 2;
            }
            function set32(e) {
                d.setUint32(y, e, !0), y += 4;
            }
            function seek(e) {
                y += e;
            }
            set16(19778), set32(u), seek(4), set32(122), set32(108), set32(i), set32(-o >>> 0), set16(1), set16(32), set32(3), set32(c), set32(2835), set32(2835), seek(8), set32(16711680), set32(65280), set32(255), set32(4278190080), set32(1466527264), function convert() {
                for (; b < o && v > 0;) {
                    for (w = 122 + b * l, g = 0; g < a;)
                        v--, p = f[E++], m = p >>> 24, d.setUint32(w + g, p << 8 | m), g += 4;
                    b++;
                }
                E < f.length ? (v = A, setTimeout(convert, t._dly)) : r(h);
            }();
        },
        toBlob: function (e, t) {
            this.toArrayBuffer(e, (function (e) {
                t(new Blob([e], { type: "image/bmp" }));
            }));
        },
        _dly: 9
    };
    var r = {
        CHROME: "CHROME",
        FIREFOX: "FIREFOX",
        DESKTOP_SAFARI: "DESKTOP_SAFARI",
        IE: "IE",
        IOS: "IOS",
        ETC: "ETC"
    }, i = (_a = {},
        _a[r.CHROME] = 16384,
        _a[r.FIREFOX] = 11180,
        _a[r.DESKTOP_SAFARI] = 16384,
        _a[r.IE] = 8192,
        _a[r.IOS] = 4096,
        _a[r.ETC] = 8192,
        _a);
    var o = "undefined" != typeof window, a = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope, s = o && window.cordova && window.cordova.require && window.cordova.require("cordova/modulemapper"), CustomFile = (o || a) && (s && s.getOriginalSymbol(window, "File") || "undefined" != typeof File && File), CustomFileReader = (o || a) && (s && s.getOriginalSymbol(window, "FileReader") || "undefined" != typeof FileReader && FileReader);
    function getFilefromDataUrl(e, t, r) {
        if (r === void 0) { r = Date.now(); }
        return new Promise((function (i) {
            var o = e.split(","), a = o[0].match(/:(.*?);/)[1], s = globalThis.atob(o[1]);
            var f = s.length;
            var l = new Uint8Array(f);
            for (; f--;)
                l[f] = s.charCodeAt(f);
            var c = new Blob([l], { type: a });
            c.name = t, c.lastModified = r, i(c);
        }));
    }
    function getDataUrlFromFile(e) {
        return new Promise((function (t, r) {
            var i = new CustomFileReader;
            i.onload = function () { return t(i.result); }, i.onerror = function (e) { return r(e); }, i.readAsDataURL(e);
        }));
    }
    function loadImage(e) {
        return new Promise((function (t, r) {
            var i = new Image;
            i.onload = function () { return t(i); }, i.onerror = function (e) { return r(e); }, i.src = e;
        }));
    }
    function getBrowserName() {
        if (void 0 !== getBrowserName.cachedResult)
            return getBrowserName.cachedResult;
        var e = r.ETC;
        var t = navigator.userAgent;
        return /Chrom(e|ium)/i.test(t) ? e = r.CHROME : /iP(ad|od|hone)/i.test(t) && /WebKit/i.test(t) ? e = r.IOS : /Safari/i.test(t) ? e = r.DESKTOP_SAFARI : /Firefox/i.test(t) ? e = r.FIREFOX : (/MSIE/i.test(t) || !0 == !!document.documentMode) && (e = r.IE), getBrowserName.cachedResult = e, getBrowserName.cachedResult;
    }
    function approximateBelowMaximumCanvasSizeOfBrowser(e, t) {
        var r = getBrowserName(), o = i[r];
        var a = e, s = t, f = a * s;
        var l = a > s ? s / a : a / s;
        for (; f > o * o;) {
            var e_36 = (o + a) / 2, t_21 = (o + s) / 2;
            e_36 < t_21 ? (s = t_21, a = t_21 * l) : (s = e_36 * l, a = e_36), f = a * s;
        }
        return { width: a, height: s };
    }
    function getNewCanvasAndCtx(e, t) {
        var r, i;
        try {
            if (r = new OffscreenCanvas(e, t), i = r.getContext("2d"), null === i)
                throw new Error("getContext of OffscreenCanvas returns null");
        }
        catch (e) {
            r = document.createElement("canvas"), i = r.getContext("2d");
        }
        return r.width = e, r.height = t, [r, i];
    }
    function drawImageInCanvas(e, t) {
        var _a = approximateBelowMaximumCanvasSizeOfBrowser(e.width, e.height), r = _a.width, i = _a.height, _b = getNewCanvasAndCtx(r, i), o = _b[0], a = _b[1];
        return t && /jpe?g/.test(t) && (a.fillStyle = "white", a.fillRect(0, 0, o.width, o.height)), a.drawImage(e, 0, 0, o.width, o.height), o;
    }
    function isIOS() {
        return void 0 !== isIOS.cachedResult || (isIOS.cachedResult = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "undefined" != typeof document && "ontouchend" in document), isIOS.cachedResult;
    }
    function drawFileInCanvas(e, t) {
        if (t === void 0) { t = {}; }
        return new Promise((function (i, o) {
            var a, s;
            var $Try_2_Post = function () {
                try {
                    return s = drawImageInCanvas(a, t.fileType || e.type), i([a, s]);
                }
                catch (e) {
                    return o(e);
                }
            }, $Try_2_Catch = function (t) {
                try {
                    0;
                    var $Try_3_Catch = function (e) {
                        try {
                            throw e;
                        }
                        catch (e) {
                            return o(e);
                        }
                    };
                    try {
                        var t_22;
                        return getDataUrlFromFile(e).then((function (e) {
                            try {
                                return t_22 = e, loadImage(t_22).then((function (e) {
                                    try {
                                        return a = e, function () {
                                            try {
                                                return $Try_2_Post();
                                            }
                                            catch (e) {
                                                return o(e);
                                            }
                                        }();
                                    }
                                    catch (e) {
                                        return $Try_3_Catch(e);
                                    }
                                }), $Try_3_Catch);
                            }
                            catch (e) {
                                return $Try_3_Catch(e);
                            }
                        }), $Try_3_Catch);
                    }
                    catch (e) {
                        $Try_3_Catch(e);
                    }
                }
                catch (e) {
                    return o(e);
                }
            };
            try {
                if (isIOS() || [r.DESKTOP_SAFARI, r.MOBILE_SAFARI].includes(getBrowserName()))
                    throw new Error("Skip createImageBitmap on IOS and Safari");
                return createImageBitmap(e).then((function (e) {
                    try {
                        return a = e, $Try_2_Post();
                    }
                    catch (e) {
                        return $Try_2_Catch();
                    }
                }), $Try_2_Catch);
            }
            catch (e) {
                $Try_2_Catch();
            }
        }));
    }
    function canvasToFile(e, r, i, o, a) {
        if (a === void 0) { a = 1; }
        return new Promise((function (s, f) {
            var l;
            if ("image/png" === r) {
                var c = void 0, u = void 0, h = void 0;
                return c = e.getContext("2d"), (u = c.getImageData(0, 0, e.width, e.height).data), h = UPNG.encode([u.buffer], e.width, e.height, 4096 * a), l = new Blob([h], { type: r }), l.name = i, l.lastModified = o, $If_4.call(this);
            }
            {
                if ("image/bmp" === r)
                    return new Promise((function (r) { return t.toBlob(e, r); })).then(function (e) {
                        try {
                            return l = e, l.name = i, l.lastModified = o, $If_5.call(this);
                        }
                        catch (e) {
                            return f(e);
                        }
                    }.bind(this), f);
                {
                    if ("function" == typeof OffscreenCanvas && e instanceof OffscreenCanvas)
                        return e.convertToBlob({
                            type: r,
                            quality: a
                        }).then(function (e) {
                            try {
                                return l = e, l.name = i, l.lastModified = o, $If_6.call(this);
                            }
                            catch (e) {
                                return f(e);
                            }
                        }.bind(this), f);
                    {
                        var d = void 0;
                        return d = e.toDataURL(r, a), getFilefromDataUrl(d, i, o).then(function (e) {
                            try {
                                return l = e, $If_6.call(this);
                            }
                            catch (e) {
                                return f(e);
                            }
                        }.bind(this), f);
                    }
                    function $If_6() {
                        return $If_5.call(this);
                    }
                }
                function $If_5() {
                    return $If_4.call(this);
                }
            }
            function $If_4() {
                return s(l);
            }
        }));
    }
    function cleanupCanvasMemory(e) {
        e.width = 0, e.height = 0;
    }
    function isAutoOrientationInBrowser() {
        return new Promise((function (e, t) {
            var r, i, o, a, s;
            return void 0 !== isAutoOrientationInBrowser.cachedResult ? e(isAutoOrientationInBrowser.cachedResult) : (r = "data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", getFilefromDataUrl("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", "test.jpg", Date.now()).then((function (r) {
                try {
                    return i = r, drawFileInCanvas(i).then((function (r) {
                        try {
                            return o = r[1], canvasToFile(o, i.type, i.name, i.lastModified).then((function (r) {
                                try {
                                    return a = r, cleanupCanvasMemory(o), drawFileInCanvas(a).then((function (r) {
                                        try {
                                            return s = r[0], isAutoOrientationInBrowser.cachedResult = 1 === s.width && 2 === s.height, e(isAutoOrientationInBrowser.cachedResult);
                                        }
                                        catch (e) {
                                            return t(e);
                                        }
                                    }), t);
                                }
                                catch (e) {
                                    return t(e);
                                }
                            }), t);
                        }
                        catch (e) {
                            return t(e);
                        }
                    }), t);
                }
                catch (e) {
                    return t(e);
                }
            }), t));
        }));
    }
    function getExifOrientation(e) {
        return new Promise((function (t, r) {
            var i = new CustomFileReader;
            i.onload = function (e) {
                var r = new DataView(e.target.result);
                if (65496 != r.getUint16(0, !1))
                    return t(-2);
                var i = r.byteLength;
                var o = 2;
                for (; o < i;) {
                    if (r.getUint16(o + 2, !1) <= 8)
                        return t(-1);
                    var e_37 = r.getUint16(o, !1);
                    if (o += 2, 65505 == e_37) {
                        if (1165519206 != r.getUint32(o += 2, !1))
                            return t(-1);
                        var e_38 = 18761 == r.getUint16(o += 6, !1);
                        o += r.getUint32(o + 4, e_38);
                        var i_14 = r.getUint16(o, e_38);
                        o += 2;
                        for (var a_13 = 0; a_13 < i_14; a_13++)
                            if (274 == r.getUint16(o + 12 * a_13, e_38))
                                return t(r.getUint16(o + 12 * a_13 + 8, e_38));
                    }
                    else {
                        if (65280 != (65280 & e_37))
                            break;
                        o += r.getUint16(o, !1);
                    }
                }
                return t(-1);
            }, i.onerror = function (e) { return r(e); }, i.readAsArrayBuffer(e);
        }));
    }
    function handleMaxWidthOrHeight(e, t) {
        var _a;
        var r = e.width, i = e.height, o = t.maxWidthOrHeight;
        var a, s = e;
        return isFinite(o) && (r > o || i > o) && (_a = getNewCanvasAndCtx(r, i), s = _a[0], a = _a[1], r > i ? (s.width = o, s.height = i / r * o) : (s.width = r / i * o, s.height = o), a.drawImage(e, 0, 0, s.width, s.height), cleanupCanvasMemory(e)), s;
    }
    function followExifOrientation(e, t) {
        var r = e.width, i = e.height, _a = getNewCanvasAndCtx(r, i), o = _a[0], a = _a[1];
        switch (t > 4 && t < 9 ? (o.width = i, o.height = r) : (o.width = r, o.height = i), t) {
            case 2:
                a.transform(-1, 0, 0, 1, r, 0);
                break;
            case 3:
                a.transform(-1, 0, 0, -1, r, i);
                break;
            case 4:
                a.transform(1, 0, 0, -1, 0, i);
                break;
            case 5:
                a.transform(0, 1, 1, 0, 0, 0);
                break;
            case 6:
                a.transform(0, 1, -1, 0, i, 0);
                break;
            case 7:
                a.transform(0, -1, -1, 0, i, r);
                break;
            case 8:
                a.transform(0, -1, 1, 0, 0, r);
        }
        return a.drawImage(e, 0, 0, r, i), cleanupCanvasMemory(e), o;
    }
    function compress(e, t, r) {
        if (r === void 0) { r = 0; }
        return new Promise((function (i, o) {
            var a, s, f, l, c, u, h, d, A, g, p, m, w, v, b, y, E, F, _, B;
            function incProgress(e) {
                if (e === void 0) { e = 5; }
                if (t.signal && t.signal.aborted)
                    throw t.signal.reason;
                a += e, t.onProgress(Math.min(a, 100));
            }
            function setProgress(e) {
                if (t.signal && t.signal.aborted)
                    throw t.signal.reason;
                a = Math.min(Math.max(e, a), 100), t.onProgress(a);
            }
            return a = r, s = t.maxIteration || 10, f = 1024 * t.maxSizeMB * 1024, incProgress(), drawFileInCanvas(e, t).then(function (r) {
                try {
                    return l = r[1], incProgress(), c = handleMaxWidthOrHeight(l, t), incProgress(), new Promise((function (r, i) {
                        var o;
                        if (!(o = t.exifOrientation))
                            return getExifOrientation(e).then(function (e) {
                                try {
                                    return o = e, $If_2.call(this);
                                }
                                catch (e) {
                                    return i(e);
                                }
                            }.bind(this), i);
                        function $If_2() {
                            return r(o);
                        }
                        return $If_2.call(this);
                    })).then(function (r) {
                        try {
                            return u = r, incProgress(), isAutoOrientationInBrowser().then(function (r) {
                                try {
                                    return h = r ? c : followExifOrientation(c, u), incProgress(), d = t.initialQuality || 1, A = t.fileType || e.type, canvasToFile(h, A, e.name, e.lastModified, d).then(function (r) {
                                        try {
                                            {
                                                if (g = r, incProgress(), p = g.size > f, m = g.size > e.size, !p && !m)
                                                    return setProgress(100), i(g);
                                                var a;
                                                function $Loop_3() {
                                                    var _a;
                                                    if (s-- && (b > f || b > w)) {
                                                        var t_23, r_20;
                                                        return t_23 = B ? .95 * _.width : _.width, r_20 = B ? .95 * _.height : _.height, _a = getNewCanvasAndCtx(t_23, r_20), E = _a[0], F = _a[1], F.drawImage(_, 0, 0, t_23, r_20), d *= "image/png" === A ? .85 : .95, canvasToFile(E, A, e.name, e.lastModified, d).then((function (e) {
                                                            try {
                                                                return y = e, cleanupCanvasMemory(_), _ = E, b = y.size, setProgress(Math.min(99, Math.floor((v - b) / (v - f) * 100))), $Loop_3;
                                                            }
                                                            catch (e) {
                                                                return o(e);
                                                            }
                                                        }), o);
                                                    }
                                                    return [1];
                                                }
                                                return w = e.size, v = g.size, b = v, _ = h, B = !t.alwaysKeepResolution && p, (a = function (e) {
                                                    for (; e;) {
                                                        if (e.then)
                                                            return void e.then(a, o);
                                                        try {
                                                            if (e.pop) {
                                                                if (e.length)
                                                                    return e.pop() ? $Loop_3_exit.call(this) : e;
                                                                e = $Loop_3;
                                                            }
                                                            else
                                                                e = e.call(this);
                                                        }
                                                        catch (e) {
                                                            return o(e);
                                                        }
                                                    }
                                                }.bind(this))($Loop_3);
                                                function $Loop_3_exit() {
                                                    return cleanupCanvasMemory(_), cleanupCanvasMemory(E), cleanupCanvasMemory(c), cleanupCanvasMemory(h), cleanupCanvasMemory(l), setProgress(100), i(y);
                                                }
                                            }
                                        }
                                        catch (u) {
                                            return o(u);
                                        }
                                    }.bind(this), o);
                                }
                                catch (e) {
                                    return o(e);
                                }
                            }.bind(this), o);
                        }
                        catch (e) {
                            return o(e);
                        }
                    }.bind(this), o);
                }
                catch (e) {
                    return o(e);
                }
            }.bind(this), o);
        }));
    }
    var f = "\nlet scriptImported = false\nself.addEventListener('message', async (e) => {\n  const { file, id, imageCompressionLibUrl, options } = e.data\n  options.onProgress = (progress) => self.postMessage({ progress, id })\n  try {\n    if (!scriptImported) {\n      // console.log('[worker] importScripts', imageCompressionLibUrl)\n      self.importScripts(imageCompressionLibUrl)\n      scriptImported = true\n    }\n    // console.log('[worker] self', self)\n    const compressedFile = await imageCompression(file, options)\n    self.postMessage({ file: compressedFile, id })\n  } catch (e) {\n    // console.error('[worker] error', e)\n    self.postMessage({ error: e.message + '\\n' + e.stack, id })\n  }\n})\n";
    var l;
    function compressOnWebWorker(e, t) {
        return new Promise((function (r, i) {
            l || (l = function createWorkerScriptURL(e) {
                var t = [];
                return "function" == typeof e ? t.push("(".concat(e, ")()")) : t.push(e), URL.createObjectURL(new Blob(t));
            }(f));
            var o = new Worker(l);
            o.addEventListener("message", (function handler(e) {
                if (t.signal && t.signal.aborted)
                    o.terminate();
                else if (void 0 === e.data.progress) {
                    if (e.data.error)
                        return i(new Error(e.data.error)), void o.terminate();
                    r(e.data.file), o.terminate();
                }
                else
                    t.onProgress(e.data.progress);
            })), o.addEventListener("error", i), t.signal && t.signal.addEventListener("abort", (function () {
                i(t.signal.reason), o.terminate();
            })), o.postMessage({
                file: e,
                imageCompressionLibUrl: t.libURL,
                options: __assign(__assign({}, t), { onProgress: void 0, signal: void 0 })
            });
        }));
    }
    function imageCompression(e, t) {
        return new Promise((function (r, i) {
            var o, a, s, f, l, c;
            if (o = __assign({}, t), s = 0, (f = o.onProgress), o.maxSizeMB = o.maxSizeMB || Number.POSITIVE_INFINITY, l = "boolean" != typeof o.useWebWorker || o.useWebWorker, delete o.useWebWorker, o.onProgress = function (e) {
                s = e, "function" == typeof f && f(s);
            }, !(e instanceof Blob || e instanceof CustomFile))
                return i(new Error("The file given is not an instance of Blob or File"));
            if (!/^image/.test(e.type))
                return i(new Error("The file given is not an image"));
            if (c = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope, !l || "function" != typeof Worker || c)
                return compress(e, o).then(function (e) {
                    try {
                        return a = e, $If_4.call(this);
                    }
                    catch (e) {
                        return i(e);
                    }
                }.bind(this), i);
            var u = function () {
                try {
                    return $If_4.call(this);
                }
                catch (e) {
                    return i(e);
                }
            }.bind(this), $Try_1_Catch = function (t) {
                try {
                    return compress(e, o).then((function (e) {
                        try {
                            return a = e, u();
                        }
                        catch (e) {
                            return i(e);
                        }
                    }), i);
                }
                catch (e) {
                    return i(e);
                }
            };
            try {
                return o.libURL = o.libURL || "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js", compressOnWebWorker(e, o).then((function (e) {
                    try {
                        return a = e, u();
                    }
                    catch (e) {
                        return $Try_1_Catch();
                    }
                }), $Try_1_Catch);
            }
            catch (e) {
                $Try_1_Catch();
            }
            function $If_4() {
                try {
                    a.name = e.name, a.lastModified = e.lastModified;
                }
                catch (e) {
                }
                try {
                    o.preserveExif && "image/jpeg" === e.type && (!o.fileType || o.fileType && o.fileType === e.type) && (a = copyExifWithoutOrientation(e, a));
                }
                catch (e) {
                }
                return r(a);
            }
        }));
    }
    return imageCompression.getDataUrlFromFile = getDataUrlFromFile, imageCompression.getFilefromDataUrl = getFilefromDataUrl, imageCompression.loadImage = loadImage, imageCompression.drawImageInCanvas = drawImageInCanvas, imageCompression.drawFileInCanvas = drawFileInCanvas, imageCompression.canvasToFile = canvasToFile, imageCompression.getExifOrientation = getExifOrientation, imageCompression.handleMaxWidthOrHeight = handleMaxWidthOrHeight, imageCompression.followExifOrientation = followExifOrientation, imageCompression.cleanupCanvasMemory = cleanupCanvasMemory, imageCompression.isAutoOrientationInBrowser = isAutoOrientationInBrowser, imageCompression.approximateBelowMaximumCanvasSizeOfBrowser = approximateBelowMaximumCanvasSizeOfBrowser, imageCompression.copyExifWithoutOrientation = copyExifWithoutOrientation, imageCompression.getBrowserName = getBrowserName, imageCompression.version = "2.0.2", imageCompression;
});
