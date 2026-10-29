// dk-landscape: a χ² (or loss) surface as a height field of grains, from a bake's
// grid (bible §3: "a surface is a height field of grains"; §4: gather beneath the
// tilted plot, a ball rolling the logged minimiser path, the Δ = 1 ring, a 1D slice
// whose Δ = 1 width is the error). The builder only draws: the grid, the path, the
// rings and the slice come from the bake (d0-chi2.json; train-perceptron.json's
// lossGrid for T4's loss valley).
//
//   { "type": "dk-landscape", "name": "bowl", "pos": [0, 0, 0], "grains": 60000,
//     "src": "d0-chi2.json", "under": "h", "steps": [0, {}, { "roll": true }, { "ring": true }, { "slice": true }] }
//   { "type": "dk-landscape", "name": "slice", "pos": [60, 0, 0], "grains": 4000, "dims": 1, "src": "d0-chi2.json" }
//
// dims 2 (default): the bowl, the x of the grid (μ) to the right, its y (width) toward
// the camera, Δ up. With `under` it sits in front of that dk-hist's axis line, dug into
// the floor, its minimum under the hist's x of the same value (when the grid's x is the
// hist's axis), and the plot can tilt back over it ({tilt} on the hist).
// dims 1: the slice alone, a parabola of grains standing upright.
import { Group } from 'three';
import { GRAIN, OURS, LABEL, roles, fmt } from './style.js';
import { mulberry32, gauss } from './rng.js';
import { stateAt } from './hist.js';
import { createMorph, MOTION } from './morph.js';
import { niceTicks, shade } from './label.js';
import { dotGrains, getPath, fader, ease, arcTable, newTable, ARC_M } from './curve.js';

export const TYPE = 'dk-landscape';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't3';
export const files = (o) => [o.src ?? 'd0-chi2.json'];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildLandscape(o, ctx, stage, kit), { fields: FIELDS });
}

// marching squares: the segments where D crosses `level`, in grid coordinates
function contourSegments(D, nx, ny, level) {
  const segs = [];
  const cut = (i0, j0, v0, i1, j1, v1, out) => {
    if ((v0 < level) === (v1 < level)) return;
    const f = (level - v0) / (v1 - v0);
    out.push([i0 + (i1 - i0) * f, j0 + (j1 - j0) * f]);
  };
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = D[j * nx + i], b = D[j * nx + i + 1], c = D[(j + 1) * nx + i + 1], d = D[(j + 1) * nx + i];
    const pts = [];
    cut(i, j, a, i + 1, j, b, pts); cut(i + 1, j, b, i + 1, j + 1, c, pts);
    cut(i + 1, j + 1, c, i, j + 1, d, pts); cut(i, j + 1, d, i, j, a, pts);
    if (pts.length >= 2) segs.push([pts[0], pts[1]]);
    if (pts.length === 4) segs.push([pts[2], pts[3]]);
  }
  return segs;
}

function buildLandscape(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const body = new Group();             // moves under a dk-hist's base with `under`
  g.add(body);
  const name = o.name != null ? String(o.name) : null;
  const sel = stage.stepper(name ?? `dk-landscape-${o.src}`);
  const frameScale = { value: 1 };
  const labels = [];
  const dims = Number(o.dims ?? 2) === 1 ? 1 : 2;
  const [SX, SZ] = Array.isArray(o.size) ? o.size : dims === 1 ? [14, 0] : [14, 10];
  const HT = Number(o.height ?? (dims === 1 ? 7 : 5));
  const seed = o.seed ?? 401;
  const rnd = mulberry32(seed * 13 + 5);
  const slc = o.slice && typeof o.slice === 'object' ? o.slice : {};
  const ballCfg = o.ball && typeof o.ball === 'object' ? o.ball : {};
  const rollCfg = o.roll && typeof o.roll === 'object' ? o.roll : {};

  // ---- grains: the surface (a morph, so it gathers), and the small sets ----------------
  const total = Math.max(2000, Math.min(ctx.budget ?? 300000, Number(o.grains) || (dims === 1 ? 4000 : 60000)));
  const nBall = Math.round(ballCfg.grains ?? 360);
  const nTrail = dims === 2 ? 600 : 300;
  const nRing = dims === 2 ? 1500 : 0;
  const nSlice = Math.round(slc.grains ?? 1600);
  const nExtra = 900;
  const nSurf = dims === 2 ? Math.max(0, total - nBall - nTrail - nRing - nSlice - nExtra) : 0;
  const share = { uTime: { value: 0 }, uPixelRatio: frameScale };
  const surf = nSurf ? createMorph(stage, nSurf, { crowd: P.crowd, sel: P.sel, seed, uniforms: { uPixelRatio: frameScale, uTime: share.uTime } }) : null;
  if (surf) { surf.u.uAlpha.value = Number(o.alpha ?? 0.62); surf.u.uSelGain.value = 1; body.add(surf.points); }
  const mk = (n, alpha, s = seed) => { const d = dotGrains(stage, n, { crowd: P.crowd, sel: P.sel, axis: P.axis, alpha, seed: s, share }); body.add(d.points); return d; };
  const ring = nRing ? mk(nRing, 0.95, seed + 1) : null;
  const slice = mk(nSlice, 0.95, seed + 2);
  const extra = mk(nExtra, 0.9, seed + 3);
  const trail = mk(nTrail, 0.55, seed + 4);
  const ballG = new Group();
  body.add(ballG);
  const ball = dotGrains(stage, nBall, { crowd: P.crowd, sel: P.sel, axis: P.axis, alpha: 1, seed: seed + 5, share });
  ballG.add(ball.points);

  let now = 0, ready = false, failed = false, armed = false, armT = 0;
  let want = sel.step ?? 0, cur = 0, shown = null;
  // the grid and its mapping
  let x0, x1, nx, y0, y1, ny, D, minX, minY, zmax, path = [], below = false, chi2min = 0;
  let wx, wz, wy, Dat, cropped = false;
  // the slice: data points, its shown range, crossings
  let SXd = [], SDd = [], sliceZ = 9, xa = 0, xb = 1, cross = null, sliceTab = null;
  // timing
  const surfF = fader(0), ballF = fader(0), ringF = fader(0), sliceF = fader(0), riseF = fader(0), extraF = fader(0);
  let rollT0 = 1e9, legs = 0, legT = 0.6, legPts = [], drawT0 = -1e9;
  const drawDur = 1.2;
  let attached = !o.under, hist = null;

  // ---- data ---------------------------------------------------------------------------
  async function load() {
    const d = await kit.loadJSON(ctx, o.src ?? 'd0-chi2.json');
    const gd = o.key ? getPath(d, o.key) : d;
    [x0, x1, nx] = gd.x; [y0, y1, ny] = gd.y;
    let Z = gd.z;
    // `range`: show part of the grid, [[xlo, xhi], [ylo, yhi]], or [hx, hy] half-widths
    // round the minimum (so a Δ = 1 ring is a ring one reads, not a glow round the ball)
    if (Array.isArray(o.range) && o.range.length === 2) {
      const gm = Array.isArray(gd.min) ? gd.min : null;
      const r = o.range.map((v, k) => (Array.isArray(v) ? v.map(Number) : gm ? [gm[k] - Number(v), gm[k] + Number(v)] : null));
      if (r[0] && r[1]) {
        const ix = (x) => ((x - x0) / (x1 - x0)) * (nx - 1), iy = (y) => ((y - y0) / (y1 - y0)) * (ny - 1);
        const i0 = Math.max(0, Math.floor(ix(r[0][0]) + 1e-6)), i1 = Math.min(nx - 1, Math.ceil(ix(r[0][1]) - 1e-6));
        const j0 = Math.max(0, Math.floor(iy(r[1][0]) + 1e-6)), j1 = Math.min(ny - 1, Math.ceil(iy(r[1][1]) - 1e-6));
        if (i1 - i0 >= 2 && j1 - j0 >= 2) {
          const mx = i1 - i0 + 1, my = j1 - j0 + 1, Zc = new Array(mx * my);
          for (let j = 0; j < my; j++) for (let i = 0; i < mx; i++) Zc[j * mx + i] = Z[(j0 + j) * nx + i0 + i];
          const nxv = (i) => x0 + (i / (nx - 1)) * (x1 - x0), nyv = (j) => y0 + (j / (ny - 1)) * (y1 - y0);
          [x0, x1, y0, y1] = [nxv(i0), nxv(i1), nyv(j0), nyv(j1)];
          nx = mx; ny = my; Z = Zc; cropped = true;
        }
      }
    }
    let zm = Infinity, im = 0;
    for (let k = 0; k < Z.length; k++) if (Z[k] < zm) { zm = Z[k]; im = k; }
    D = new Float32Array(Z.length);
    let dmax = 0;
    for (let k = 0; k < Z.length; k++) { D[k] = Z[k] - zm; if (D[k] > dmax) dmax = D[k]; }
    chi2min = Number(gd.chi2min ?? zm);
    [minX, minY] = Array.isArray(gd.min) ? gd.min : [x0 + ((im % nx) / (nx - 1)) * (x1 - x0), y0 + (Math.floor(im / nx) / (ny - 1)) * (y1 - y0)];
    Dat = (x, y) => {
      const fi = Math.max(0, Math.min(nx - 1.0001, ((x - x0) / (x1 - x0)) * (nx - 1)));
      const fj = Math.max(0, Math.min(ny - 1.0001, ((y - y0) / (y1 - y0)) * (ny - 1)));
      const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j;
      const a = D[j * nx + i], b = D[j * nx + i + 1], c = D[(j + 1) * nx + i + 1], e = D[(j + 1) * nx + i];
      return (1 - v) * ((1 - u) * a + u * b) + v * ((1 - u) * e + u * c);
    };
    path = clipPath((gd.path || []).map((p) => [Number(p[0]), Number(p[1])]));
    const dPathMax = path.reduce((m, p) => Math.max(m, Dat(p[0], p[1])), 0);
    zmax = Number(o.zmax ?? (dPathMax > 0 ? Math.min(dmax, Math.max(1.12 * dPathMax, 4)) : dmax));
    below = o.below ?? !!o.under;
    const base = below ? -HT : 0;
    wx = (x) => ((x - x0) / (x1 - x0) - 0.5) * SX;
    wz = (y) => ((y - y0) / (y1 - y0) - 0.5) * SZ * (o.flip ? -1 : 1);
    wy = (v) => base + (HT * Math.min(v, zmax)) / zmax;
    // the slice: the bake's (profiled) one, or a cut along x through the minimum
    if (gd.slice?.x && gd.slice?.z) { SXd = gd.slice.x.map(Number); SDd = gd.slice.z.map(Number); cross = gd.slice.cross ?? null; }
    else {
      const j = Math.round(((minY - y0) / (y1 - y0)) * (ny - 1));
      for (let i = 0; i < nx; i++) { SXd.push(x0 + (i / (nx - 1)) * (x1 - x0)); SDd.push(D[j * nx + i]); }
    }
    const level = Number((Array.isArray(o.levels) ? o.levels[0] : null) ?? 1);
    if (!cross) {
      const c = [];
      for (let k = 1; k < SXd.length; k++) if ((SDd[k - 1] < level) !== (SDd[k] < level)) c.push(SXd[k - 1] + ((level - SDd[k - 1]) / (SDd[k] - SDd[k - 1])) * (SXd[k] - SXd[k - 1]));
      cross = c.length >= 2 ? [c[0], c[c.length - 1]] : null;
    }
    sliceZ = Number(slc.zmax ?? 4);
    // the slice's shown range: where it stays under sliceZ (a little past it)
    let ka = 0, kb = SXd.length - 1;
    while (ka < SXd.length - 1 && SDd[ka] > sliceZ * 1.02) ka++;
    while (kb > 0 && SDd[kb] > sliceZ * 1.02) kb--;
    xa = SXd[ka]; xb = SXd[kb];
    if (!(xb > xa)) { xa = SXd[0]; xb = SXd[SXd.length - 1]; }
    placeSurface();
    placeRing();
    placeSlice();
    placePath();
    placeBall();
    placeLabels();
    ready = true;
  }
  // a cropped grid: the path starts where it first enters the shown range (the ball
  // rolls in over the rim); points before that are dropped
  function clipPath(pts) {
    if (!cropped || pts.length < 2) return pts;
    const inside = (p) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
    const k = pts.findIndex(inside);
    if (k <= 0) return k < 0 ? [] : pts;
    const a = pts[k - 1], b = pts[k];
    let lo = 0, hi = 1;
    for (let it = 0; it < 40; it++) { const m = (lo + hi) / 2; if (inside([a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m])) hi = m; else lo = m; }
    return [[a[0] + (b[0] - a[0]) * hi, a[1] + (b[1] - a[1]) * hi], ...pts.slice(k)];
  }
  const Dslice = (x) => {
    if (x <= SXd[0]) return SDd[0];
    for (let k = 1; k < SXd.length; k++) if (x <= SXd[k]) { const f = (x - SXd[k - 1]) / (SXd[k] - SXd[k - 1]); return SDd[k - 1] + f * (SDd[k] - SDd[k - 1]); }
    return SDd[SDd.length - 1];
  };

  // ---- the surface: grains on mesh lines and in between, shaded by depth ---------------
  let surfTgt = null, surfStart = null;
  function placeSurface() {
    if (!surf) return;
    const pos = new Float32Array(nSurf * 3), vis = new Float32Array(nSurf), white = new Float32Array(nSurf);
    const start = new Float32Array(nSurf * 3), delay = new Float32Array(nSurf);
    const mesh = Number(o.mesh ?? 26), lineShare = Number(o.lines ?? 0.6);
    for (let i = 0; i < nSurf; i++) {
      let u = 0, v = 0, dv = Infinity;
      for (let k = 0; k < 24 && dv > zmax; k++) {
        if (i < nSurf * lineShare) {
          const l = (Math.floor(rnd() * mesh) + 0.5) / mesh, a = rnd();
          if (i & 1) { u = l; v = a; } else { u = a; v = l; }
        } else { u = rnd(); v = rnd(); }
        dv = Dat(x0 + u * (x1 - x0), y0 + v * (y1 - y0));
      }
      const x = x0 + u * (x1 - x0), y = y0 + v * (y1 - y0);
      pos[3 * i] = wx(x) + 0.006 * gauss(rnd); pos[3 * i + 1] = wy(dv); pos[3 * i + 2] = wz(y) + 0.006 * gauss(rnd);
      const h = Math.min(1, dv / zmax);
      vis[i] = dv <= zmax ? 0.45 + 0.55 * Math.pow(1 - h, 1.3) : 0;
      // gathering: from a loose cloud under and round the bowl, the rim first
      start[3 * i] = pos[3 * i] + 2.2 * gauss(rnd); start[3 * i + 1] = pos[3 * i + 1] - 1.5 - 2.5 * rnd(); start[3 * i + 2] = pos[3 * i + 2] + 2.2 * gauss(rnd);
      delay[i] = 0.15 + 0.7 * (1 - h) * 0.6 + 0.55 * rnd();
    }
    surfTgt = { pos, vis, white };
    surfStart = { start, delay };
  }
  function surfGo(kind) {
    if (!surf) return 0;
    const t = now;
    if (kind === 'hide' || kind === 'off') {
      const tgt = { pos: surfTgt.pos, vis: new Float32Array(nSurf), white: surfTgt.white };
      if (kind === 'off') { surf.jump(t, tgt); return 0; }
      return surf.go(t, tgt, (m) => { for (let i = 0; i < nSurf; i++) { m.T[2 * i + 1] = 0.5; } }) - t;
    }
    if (kind === 'instant') { surf.go(t, surfTgt, (m) => { for (let i = 0; i < nSurf; i++) m.T[2 * i + 1] = 0.35; }); return 0.35; }
    // gather from the cloud
    const end = surf.go(t, surfTgt, (m) => {
      const { A, V, T, M: Mo } = m;
      for (let i = 0; i < nSurf; i++) {
        if (V[2 * i] < 0.01) { A[3 * i] = surfStart.start[3 * i]; A[3 * i + 1] = surfStart.start[3 * i + 1]; A[3 * i + 2] = surfStart.start[3 * i + 2]; V[2 * i] = 0; }
        Mo[i] = MOTION.GLIDE; T[2 * i] = surfStart.delay[i]; T[2 * i + 1] = 1.5;
      }
    });
    return end - t;
  }

  // ---- the rings: Δ = level contours on the surface ------------------------------------
  function placeRing() {
    if (!ring) return;
    const levels = Array.isArray(o.levels) ? o.levels.map(Number) : [1];
    // each level's segments in world coordinates
    const segsW = [];
    levels.forEach((lv, li) => {
      const segs = contourSegments(D, nx, ny, lv).map(([p, q]) => [p, q].map(([i, j]) => [x0 + (i / (nx - 1)) * (x1 - x0), y0 + (j / (ny - 1)) * (y1 - y0)]));
      for (const [p, q] of segs) {
        const a = [wx(p[0]), wy(lv) + 0.035, wz(p[1])], b = [wx(q[0]), wy(lv) + 0.035, wz(q[1])];
        segsW.push({ a, b, L: Math.hypot(b[0] - a[0], b[2] - a[2]), li });
      }
    });
    // grains per level: the first level (Δ = 1) gets most and is white; others light blue
    const per = levels.map((_, li) => (li === 0 ? (levels.length > 1 ? 0.6 : 1) : 0.4 / (levels.length - 1)));
    let i = 0;
    levels.forEach((_, li) => {
      const ss = segsW.filter((s) => s.li === li);
      const Ltot = ss.reduce((a, s) => a + s.L, 0) || 1;
      const n = li === levels.length - 1 ? nRing - i : Math.round(nRing * per[li]);
      let acc = 0, k = 0;
      for (let q = 0; q < n && i < nRing; q++, i++) {
        const s = ((q + rnd()) / n) * Ltot;
        while (k < ss.length - 1 && acc + ss[k].L < s) { acc += ss[k].L; k++; }
        const sg = ss[k];
        if (!sg) { ring.vis[i] = 0; continue; }
        const f = Math.max(0, Math.min(1, (s - acc) / (sg.L || 1)));
        ring.pos[3 * i] = sg.a[0] + (sg.b[0] - sg.a[0]) * f + 0.01 * gauss(rnd);
        ring.pos[3 * i + 1] = sg.a[1] + (sg.b[1] - sg.a[1]) * f;
        ring.pos[3 * i + 2] = sg.a[2] + (sg.b[2] - sg.a[2]) * f + 0.01 * gauss(rnd);
        ring.vis[i] = li === 0 ? 1 : 0.7;
        ring.col[i] = li === 0 ? 1 : 0;
      }
    });
    for (; i < nRing; i++) ring.vis[i] = 0;
    ring.touch(); ring.paint();
  }

  // ---- the slice: placed per frame (it rises), its extras: baseline, Δ = 1 line, ticks --
  let sliceU = null, sliceJ = null;
  let sBase = 0, sH = 1, sMag = 1, sZ = 0, xcW = 0;
  const X1d = (x) => ((x - xa) / (xb - xa) - 0.5) * SX;
  function sliceFinal(x, v) {
    // the risen (dims 2) or standing (dims 1) slice: x right, Δ up to sliceZ
    if (dims === 1) return [X1d(x), (HT * Math.min(v, sliceZ)) / sliceZ, 0];
    return [xcW + (wx(x) - xcW) * sMag, sBase + (sH * Math.min(v, sliceZ)) / sliceZ, sZ];
  }
  function placeSlice() {
    xcW = dims === 2 ? wx(minX) : 0;
    sZ = dims === 2 ? wz(minY) : 0;
    // dims 2: the cut through the minimum stands up inside the bowl's own height (from its
    // bottom to its rim, in the plane of the minimum's y), magnified about the minimum, so it
    // never crosses the plot above the floor
    sBase = dims === 2 ? (below ? -HT : 0) + Number(slc.lift ?? 0) : 0;
    sH = Number(slc.height ?? HT);
    sMag = dims === 2 ? Number(slc.zoom ?? Math.min(4, (0.55 * SX) / Math.max(1e-9, wx(xb) - wx(xa)))) : 1;
    // the final polyline, by arc length
    const K = 241, XS = new Float32Array(K), YS = new Float32Array(K);
    for (let k = 0; k < K; k++) { const x = xa + ((xb - xa) * k) / (K - 1); const [X, Y] = sliceFinal(x, Dslice(x)); XS[k] = X; YS[k] = Y; }
    sliceTab = arcTable(XS, YS, newTable(K));
    sliceU = new Float32Array(nSlice); sliceJ = new Float32Array(nSlice);
    for (let i = 0; i < nSlice; i++) { sliceU[i] = rnd(); sliceJ[i] = Math.max(-2, Math.min(2, gauss(rnd))); slice.col[i] = 1; }
    slice.paint();
    // extras (the textbook picture, no box): the Δ = 1 level line (dim), the error bar
    // along it between the two crossings (white), and a dim drop line from each crossing
    // down to Δ = 0, where its value hangs. No baseline: with the drop lines it would close
    // a box under the minimum.
    const lvl = Number((Array.isArray(o.levels) ? o.levels[0] : null) ?? 1);
    const [XA, YB0] = sliceFinal(xa, 0), [XB] = sliceFinal(xb, 0);
    const [, YL] = sliceFinal(xa, lvl);
    const z = dims === 2 ? sZ : 0;
    let i = 0;
    const put = (n, f, col, vis) => { for (let q = 0; q < n && i < nExtra; q++, i++) { const [x, y] = f((q + 0.5) / n, q); extra.pos[3 * i] = x; extra.pos[3 * i + 1] = y; extra.pos[3 * i + 2] = z; extra.col[i] = col; extra.vis[i] = vis; } };
    put(300, (u, q) => [XA + (XB - XA) * u, YL], -1, 0.75);                                // Δ = 1 level
    if (cross) {
      const [C0] = sliceFinal(cross[0], lvl), [C1] = sliceFinal(cross[1], lvl);
      put(60, (u) => [C0, YB0 + (YL - YB0) * u], -1, 0.85);                                // the two drop lines
      put(60, (u) => [C1, YB0 + (YL - YB0) * u], -1, 0.85);
      put(380, (u) => [C0 + (C1 - C0) * u, YL + 0.022 * Math.max(-2, Math.min(2, gauss(rnd)))], 1, 1); // the error bar on the level
    }
    for (; i < nExtra; i++) extra.vis[i] = 0;
    extra.touch(); extra.paint();
    extra.u.uShow.value = 0;
  }

  // ---- the minimiser's path and the ball -------------------------------------------------
  const R = Number(ballCfg.r ?? (dims === 2 ? 0.17 : 0.16));
  function surfPoint(x, y, lift, out) {
    if (dims === 1) {
      const xc = Math.max(xa, Math.min(xb, x));
      const [X, Y] = sliceFinal(xc, Dslice(xc));
      out[0] = X; out[1] = Y + lift; out[2] = 0;
    } else { out[0] = wx(x); out[1] = wy(Dat(x, y)) + lift; out[2] = wz(y); }
    return out;
  }
  function placePath() {
    // at most `legs` legs: a long log (a training run) is taken at even steps
    const maxLegs = Number(rollCfg.legs ?? 24);
    let pts = path;
    if (pts.length - 1 > maxLegs) { const out = []; for (let k = 0; k <= maxLegs; k++) out.push(pts[Math.round((k * (pts.length - 1)) / maxLegs)]); pts = out; }
    legPts = pts;
    legs = Math.max(0, pts.length - 1);
    legT = Number(rollCfg.leg ?? Math.min(0.6, 8 / Math.max(1, legs)));
    // the trail: grains along the path on the surface, in order (revealed as the ball passes)
    const tmp = [0, 0, 0];
    const seg = [];
    let Ltot = 0;
    for (let k = 0; k < legs; k++) {
      const a = surfPoint(pts[k][0], pts[k][1], 0.04, [0, 0, 0]), b = surfPoint(pts[k + 1][0], pts[k + 1][1], 0.04, [0, 0, 0]);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      seg.push({ k, L }); Ltot += L;
    }
    for (let i = 0; i < nTrail; i++) {
      const s = ((i + 0.5) / nTrail) * Ltot;
      let acc = 0, k = 0;
      while (k < seg.length - 1 && acc + seg[k].L < s) { acc += seg[k].L; k++; }
      const f = seg.length ? Math.max(0, Math.min(1, (s - acc) / (seg[k].L || 1))) : 0;
      const p = legs ? pts[k] : [minX, minY], q = legs ? pts[k + 1] : [minX, minY];
      surfPoint(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, 0.04, tmp);
      trail.pos[3 * i] = tmp[0]; trail.pos[3 * i + 1] = tmp[1]; trail.pos[3 * i + 2] = tmp[2];
      trail.col[i] = 1; trail.vis[i] = 0;
      trail.U ??= new Float32Array(nTrail); trail.U[i] = legs ? k + f : 0;
    }
    trail.touch(); trail.paint();
  }
  function placeBall() {
    for (let i = 0; i < nBall; i++) {
      const r = R * Math.cbrt(rnd()), th = Math.acos(2 * rnd() - 1), ph = 2 * Math.PI * rnd();
      ball.pos[3 * i] = r * Math.sin(th) * Math.cos(ph); ball.pos[3 * i + 1] = r * Math.cos(th); ball.pos[3 * i + 2] = r * Math.sin(th) * Math.sin(ph);
      ball.vis[i] = 0.55 + 0.45 * (1 - r / R); ball.col[i] = 1;
    }
    ball.touch(); ball.paint();
  }
  // where the ball is along the path at progress q (legs), eased within each leg
  const bp = [0, 0, 0];
  function ballAt(q) {
    if (!legs) return surfPoint(minX, minY, R, bp);
    const k = Math.max(0, Math.min(legs - 1, Math.floor(q))), f = q >= legs ? 1 : ease(q - k);
    const p = legPts[k], r = legPts[k + 1];
    return surfPoint(p[0] + (r[0] - p[0]) * f, p[1] + (r[1] - p[1]) * f, R, bp);
  }
  const ballData = (q) => {
    if (!legs) return [minX, minY];
    const k = Math.max(0, Math.min(legs - 1, Math.floor(q))), f = q >= legs ? 1 : ease(q - k);
    const p = legPts[k], r = legPts[k + 1];
    return [p[0] + (r[0] - p[0]) * f, p[1] + (r[1] - p[1]) * f];
  };

  // ---- labels: the bowl's x ticks on its front edge; the slice's crossings and level ----
  const surfLabels = [], sliceLabels = [];
  function placeLabels() {
    const px = Number(o.tickPx ?? LABEL.px);
    const lab = (text, x, y, z, list, align = 'center', hang = 0.5, color = P.tick) => {
      const l = kit.label.make(text, { px, color, align, hang });
      l.position.set(x, y, z); body.add(l); labels.push(l); list.push(l);
    };
    // a tick's decimals are the ones it is written with (1 864.5, 7.65)
    const dec = (v) => { const m = String(v).split('.')[1]; return m ? m.length : 0; };
    const inX = (v) => v >= x0 - 1e-9 && v <= x1 + 1e-9, inY = (v) => v >= y0 - 1e-9 && v <= y1 + 1e-9;
    // the rim's height along an edge (a surface above zmax is not drawn: its rim is zmax)
    const rimY = (x, y) => wy(Dat(x, y));
    if (dims === 2 && o.ticks !== false) {
      // x (μ) under the bowl's front edge, at the edge's own height (a ruler along its lip)
      const yEdge = o.flip ? y0 : y1, front = wz(yEdge) + (o.flip ? -1 : 1) * 0.35;
      for (const v of (Array.isArray(o.ticks) ? o.ticks : niceTicks(x0, x1, 3))) if (inX(v)) lab(fmt(v, dec(v)), wx(v), rimY(v, yEdge) - 0.15, front, surfLabels, 'center', 0.9);
    }
    if (dims === 2 && Array.isArray(o.yticks)) {
      // y (width) beside the bowl's right edge, at that edge's height
      for (const v of o.yticks) if (inY(v)) lab(fmt(v, dec(v)), wx(x1) + 0.45, rimY(x1, v) - 0.15, wz(v), surfLabels, 'left', 0.5);
    }
    const sdec = Number(slc.decimals ?? 2);
    const [, YB0] = sliceFinal(xa, 0);
    // each crossing's value at the foot of its drop line
    if (cross) for (const c of cross) { const [X] = sliceFinal(c, 1); lab(fmt(c, sdec), X, YB0 - 0.2, dims === 2 ? sZ : 0, sliceLabels, 'center', 0.9); }
    // the level's number at the left end of its line, and the one caption above it, both
    // right-aligned on the same edge with a gap (a y axis without a drawn axis)
    const lvl = Number((Array.isArray(o.levels) ? o.levels[0] : null) ?? 1);
    const [XA, YL] = sliceFinal(xa, lvl);
    lab(fmt(lvl, 0), XA - 0.35, YL, dims === 2 ? sZ : 0, sliceLabels, 'right', 0);
    if (o.word) { const [, YW] = sliceFinal(xa, sliceZ); lab(String(o.word), XA - 0.35, YW + 0.5, dims === 2 ? sZ : 0, sliceLabels, 'right', 0, P.name); }
  }

  // ---- stepping -------------------------------------------------------------------------
  const stepsList = Array.isArray(o.steps) && o.steps.length ? o.steps
    : [0, {}, { roll: true }, { ring: true }];   // dims 2's {slice} is opt-in: give the error its own dims-1 slide
  const stateOf = (k) => stateAt(stepsList, k);
  const after = (f, t0) => { f.t0 = t0; };
  function apply(k, kind) {
    const s = stateOf(k);
    const prev = shown;
    const t = now;
    const instant = kind === 'back';
    const fresh = !prev || kind === 'arrive';
    if (!s) {
      const dur = kind === 'hide' ? 0.5 : 0.35;
      surfGo('hide'); for (const f of [surfF, ballF, ringF, sliceF, riseF, extraF]) f.set(t, 0, dur);
      rollT0 = 1e9; shown = null; cur = 0; return;
    }
    let at = t;
    // the surface (dims 2) or the standing slice (dims 1)
    const wantSurf = dims === 2 && s.surface !== false;
    const hadSurf = !!(prev && dims === 2 && prev.surface !== false) && !fresh;
    // the surface's tick labels come in as its gather ends, not before it (lab 3 slides 4, 9:
    // the ticks stood alone in the black while the grains were still far out)
    if (wantSurf && !hadSurf) { at += instant ? surfGo('instant') : surfGo('gather') + 0.1; surfF.set(t, 1, instant ? 0.35 : 0.5); if (!instant) after(surfF, Math.max(t, at - 0.4)); }
    else if (wantSurf && instant) { surfGo('instant'); surfF.set(t, 1, 0.35); }
    else if (!wantSurf && surf) { surfGo(fresh ? 'off' : 'hide'); surfF.set(t, 0, 0.5); }
    if (dims === 1) {
      sliceF.set(t, 1, 0.35);
      if (fresh || !prev) { drawT0 = t; at = t + drawDur + 0.1; } else if (instant) drawT0 = t - 10;
    }
    // the roll
    if (s.roll) {
      if (instant) { rollT0 = t - 1e4; ballF.set(t, 1, 0.35); }
      else if (fresh || !prev.roll) { rollT0 = at + 0.3; ballF.set(t, 1, 0.4); after(ballF, at); at = rollT0 + legs * legT + 0.3; }
      else ballF.set(t, 1, 0.35);
    } else { rollT0 = 1e9; ballF.set(t, 0, 0.35); }
    // the ring (dims 2: the Δ = 1 contour; dims 1: the level line, the crossings, the bar)
    const ringOn = !!s.ring;
    if (ringOn && (fresh || !prev.ring) && !instant) { ringF.set(t, 1, 0.9); after(ringF, at); at += 1.0; }
    else ringF.set(t, ringOn ? 1 : 0, 0.35);
    // the slice rising out of the bowl (dims 2)
    if (dims === 2) {
      const sl = !!s.slice;
      if (sl && (fresh || !prev.slice) && !instant) { sliceF.set(t, 1, 0.5); after(sliceF, at); riseF.set(t, 1, 1.6); after(riseF, at + 0.3); at += 2.0; }
      else { sliceF.set(t, sl ? 1 : 0, 0.35); riseF.set(t, sl ? 1 : 0, 0.35); }
      const ex = sl;
      if (ex && (fresh || !prev.slice) && !instant) { extraF.set(t, 1, 0.8); after(extraF, at); }
      else extraF.set(t, ex ? 1 : 0, 0.35);
    } else {
      if (ringOn && (fresh || !prev.ring) && !instant) { extraF.set(t, 1, 0.8); after(extraF, ringF.t0); }
      else extraF.set(t, ringOn ? 1 : 0, 0.35);
    }
    shown = s; cur = k;
  }
  const request = (k) => {
    want = k;
    if (!ready || armed || !attached) return;
    apply(k, k < cur ? (k === 0 ? 'hide' : 'back') : 'fwd');
  };
  const arrive = () => {
    armed = false;
    if (!ready || !attached) return;
    shown = null; cur = 0;
    surfGo('off');
    for (const f of [surfF, ballF, ringF, sliceF, riseF, extraF]) f.jump(0);
    rollT0 = 1e9;
    if (want > 0) apply(want, 'arrive');
  };

  function attach() {
    if (attached) return true;
    hist = kit.form(o.under);
    const fr = hist?.api?.frame?.();
    if (!fr || !fr.group?.parent) return false;
    const base = fr.group.parent;
    base.add(body);
    // its minimum under the hist's x of the same value, in front of the axis line
    const dx = minX >= fr.lo && minX <= fr.hi ? fr.x(minX) - wx(minX) : 0;
    const at = Array.isArray(o.at) ? o.at : [dx, 0, SZ / 2 + 1.2];
    body.position.set(at[0], at[1], at[2]);
    attached = true;
    return true;
  }

  // ---- api ------------------------------------------------------------------------------
  const progress = () => (rollT0 >= 1e8 ? 0 : Math.max(0, Math.min(legs, (now - rollT0) / legT)));
  const readout = () => {
    const key = o.readout ?? 'x';
    if (!ready) return 0;
    // a roll still to come (an arrival before its apply): the path's start, never the answer
    const pending = rollT0 >= 1e8 && legs && !!stateOf(want)?.roll;
    const [x, y] = rollT0 >= 1e8 ? (pending ? ballData(0) : [minX, minY]) : ballData(progress());
    if (key === 'y') return y;
    if (key === 'd') return Dat(x, y);
    if (key === 'chi2') return chi2min + Dat(x, y);
    return x;
  };
  const anyMoving = () => [surfF, ballF, ringF, sliceF, riseF, extraF].some((f) => f.moving(now));
  const api = {
    arm() { armed = true; armT = now; if (ready) { surfGo('off'); for (const f of [surfF, ballF, ringF, sliceF, riseF, extraF]) f.jump(0); rollT0 = 1e9; shown = null; cur = 0; } },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    busy: () => (!ready && !failed && want > 0) || armed || (want > 0 && ready && !attached)
      || (surf && now < surf.end + 0.2) || anyMoving()
      || (rollT0 < 1e8 && now < rollT0 + legs * legT + 0.1)
      || (dims === 1 && now < drawT0 + drawDur),
    value: readout,
    values: () => ({ x: readout(), d: ready ? Dat(...(rollT0 >= 1e8 ? [minX, minY] : ballData(progress()))) : null, min: ready ? [minX, minY] : null, cross, step: cur }),
    ready: () => ready,
  };
  if (name) kit.register(name, { type: TYPE, api });
  load().then(() => { if (!armed && want > 0 && attach()) apply(want, 'arrive'); })
    .catch((e) => { failed = true; console.warn(`dk-landscape ${name}: data failed`, e); });

  return {
    group: g, labels, api, frameScale,
    update(t) {
      now = t;
      share.uTime.value = t;
      if (sel.fresh) { sel.fresh = false; request(sel.step); }
      if (!ready) return;
      if (!attached) { if (attach() && !armed && want > 0) apply(want, 'arrive'); else return; }
      if (armed && t - armT > 8) arrive();
      // surface
      if (surf) {
        surf.u.uShow.value = Math.max(0.0001, surfF.at(t) > 0 || surf.end > t ? 1 : 0);
        // the bowl steps back while the slice stands in it
        surf.u.uAlpha.value = Number(o.alpha ?? 0.62) * (1 - Number(slc.dim ?? 0.6) * riseF.at(t));
      }
      // ring
      if (ring) { ring.u.uShow.value = ringF.at(t); ring.points.visible = ring.u.uShow.value > 0.002; }
      // the slice: (dims 1) drawn on from the left; (dims 2) lifted from the bowl's cut
      const sv = sliceF.at(t);
      slice.points.visible = sv > 0.002;
      if (slice.points.visible) {
        const r = dims === 2 ? riseF.at(t) : 1;
        const rev = dims === 1 ? Math.min(1.05, (t - drawT0) / drawDur) : 1.05;
        const tb = sliceTab, L = tb.L, phase = (0.2 * t) / L;
        const XA = tb.x[0], span = Math.max(1e-6, tb.x[ARC_M] - XA);
        for (let i = 0; i < nSlice; i++) {
          let s = sliceU[i] + phase; s -= Math.floor(s);
          const fj = s * ARC_M, j = Math.min(ARC_M - 1, Math.floor(fj)), f = fj - j;
          const X = tb.x[j] + (tb.x[j + 1] - tb.x[j]) * f, Y = tb.y[j] + (tb.y[j + 1] - tb.y[j]) * f;
          let px = X + tb.nx[j] * sliceJ[i] * 0.02, py = Y + tb.ny[j] * sliceJ[i] * 0.02, pz = dims === 2 ? sZ : 0;
          if (dims === 2 && r < 1) {
            // the same point of the slice down in the bowl
            const x = minX + (X - xcW) / sMag / (SX / (x1 - x0));
            const by = wy(Dslice(x));
            px = px + (wx(x) - px) * (1 - r); py = py + (by - py) * (1 - r);
          }
          slice.pos[3 * i] = px; slice.pos[3 * i + 1] = py; slice.pos[3 * i + 2] = pz;
          slice.vis[i] = Math.max(0, Math.min(1, (rev - (X - XA) / span) / 0.04));
        }
        slice.u.uShow.value = sv;
        slice.touch();
      }
      extra.u.uShow.value = extraF.at(t);
      extra.points.visible = extra.u.uShow.value > 0.002;
      // the ball and its trail
      // the ball and the ring step back while the slice stands (dims 2): its crossings read
      const back = dims === 2 ? 1 - 0.75 * riseF.at(t) : 1;
      if (ring) ring.u.uShow.value *= back;
      const bv = ballF.at(t) * back;
      ball.points.visible = bv > 0.002;
      if (ball.points.visible) {
        const q = progress();
        ballAt(q);
        ballG.position.set(bp[0], bp[1], bp[2]);
        ball.u.uShow.value = bv;
        for (let i = 0; i < nTrail; i++) trail.vis[i] = trail.U[i] <= q ? 1 : 0;
        trail.touch();
      }
      trail.points.visible = ball.points.visible;
      trail.u.uShow.value = bv;
      // labels
      // the bowl's ticks go while the slice stands in it: never two μ scales at once
      for (const l of surfLabels) l.userData.show = surfF.at(t) * (1 - riseF.at(t));
      for (const l of sliceLabels) l.userData.show = extraF.at(t);
      shade(labels, 1);
    },
    dispose() {
      sel.off(); if (name) kit.unregister(name);
      body.parent?.remove(body);
      surf?.dispose(); ring?.dispose(); slice.dispose(); extra.dispose(); trail.dispose(); ball.dispose();
      for (const l of labels) { l.material?.map?.dispose?.(); l.material?.dispose?.(); }
    },
  };
}
