// dk-curve: a model drawn as a line of slowly flowing grains in a dk-hist's frame
// (bible §3: "a curve is a line of slowly flowing grains"; §4: gauss+poly1, exp and
// decay forms, signal and background parts, a pull row). Steps move the curve
// through parameter sets read from a committed bake file (d0-fit.json's logged
// iterations, d0-tau.json's lifetime fit), never typed into a deck.
//
//   { "type": "dk-curve", "name": "fit", "of": "h", "pos": [0, 0, 0], "grains": 9000,
//     "src": "d0-fit.json", "steps": [0, { "set": 0 }, { "set": 1 }, { "set": 5, "parts": true, "pull": true }] }
//
// The grains live in the hist's plot group (api.frame().group), so the curve tilts
// with the plot. Positions are worked out on the CPU from the world clock t each
// frame (a few thousand grains): the line is resampled by arc length, so a steep
// flank is as dense as the flat background, and each grain drifts along it.
import { Group, Color } from 'three';
import { GRAIN, roles } from './style.js';
import { mulberry32, gauss } from './rng.js';
import { stateAt } from './hist.js';

export const TYPE = 'dk-curve';
export const FIELDS = ['pos', 'name', 'grains', 'of'];
export const OWNER = 't3';
export const files = (o) => [o.src ?? 'd0-fit.json'];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildCurve(o, ctx, stage, kit), { fields: FIELDS });
}

// ---- a grain set whose every grain has its own place, alpha and colour ----------------
// (dk-landscape uses it too). aVis is the grain's alpha share (0 hides it); aCol its
// colour: 0 crowd … 1 selected, and −1 the axis colour (dim); aSz its size factor.
let DOT = null;
export function dotGrains(stage, n, { crowd, sel, axis, size = GRAIN, alpha = 0.8, seed = 1, frameScale = null, share = null } = {}) {
  DOT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed, aVis, aCol, aSz;
uniform float uShow, uAlpha, uSize;
uniform vec3 uCrowd, uSel, uAxis;
void main() {
  float v = aVis * uShow;
  if (v <= 0.002) { hide(); return; }
  vec3 c = aCol < -0.5 ? uAxis : mix(uCrowd, uSel, aCol);
  place(position, uSize * aSz * (0.85 + 0.3 * hash(aSeed * 11.0)), uAlpha * v, c, aSeed);
}`;
  const pos = new Float32Array(n * 3), sd = new Float32Array(n), vis = new Float32Array(n), col = new Float32Array(n), sz = new Float32Array(n).fill(1);
  const rnd = mulberry32((seed * 2654435761 + n) >>> 0);
  for (let i = 0; i < n; i++) sd[i] = rnd();
  const geo = stage.grainGeometry(n, { position: pos, aSeed: [sd, 1], aVis: [vis, 1], aCol: [col, 1], aSz: [sz, 1] });
  const mat = stage.grainMaterial(DOT, {
    uShow: { value: 1 }, uAlpha: { value: alpha }, uSize: { value: size },
    uCrowd: { value: new Color(crowd) }, uSel: { value: new Color(sel) }, uAxis: { value: new Color(axis ?? crowd) },
    ...(frameScale ? { uPixelRatio: frameScale } : {}),
  });
  if (share) { mat.uniforms.uTime = share.uTime; mat.uniforms.uPixelRatio = share.uPixelRatio; }
  const points = stage.grainPoints(geo, mat);
  return {
    n, pos, vis, col, sz, geo, mat, points, u: mat.uniforms,
    touch() { geo.attributes.position.needsUpdate = true; geo.attributes.aVis.needsUpdate = true; },
    paint() { geo.attributes.aCol.needsUpdate = true; geo.attributes.aSz.needsUpdate = true; },
    dispose() { points.parent?.remove(points); geo.dispose(); mat.dispose(); },
  };
}

// ---- reading parameter sets out of a bake file ---------------------------------------
export function getPath(d, path) {
  if (path == null || path === '') return d;
  let v = d;
  for (const k of String(path).split('.')) { if (v == null) return undefined; v = v[/^\d+$/.test(k) ? Number(k) : k]; }
  return v;
}
// A set is an array in the model's parameter order, { p: [...] } (a logged
// iteration), or an object of named values; a string value '@path' is read from the
// same file (so a deck composes a set out of bake numbers without typing one).
function toParams(x, names, d) {
  if (x == null) return null;
  let p;
  if (Array.isArray(x)) p = Object.fromEntries((names || []).map((k, i) => [k, x[i]]));
  else if (Array.isArray(x.p)) p = { ...Object.fromEntries((names || []).map((k, i) => [k, x.p[i]])), chi2: x.chi2, iter: x.iter };
  else if (typeof x === 'object') p = { ...x };
  else return null;
  for (const [k, v] of Object.entries(p)) if (typeof v === 'string' && v.startsWith('@')) p[k] = Number(getPath(d, v.slice(1)));
  if (p.n == null && p.nNet != null) p.n = p.nNet;
  return p;
}
function resolveSets(d, o) {
  const names = o.names ?? d?.model?.params ?? null;
  const spec = o.sets ?? (d.iterations ? 'iterations' : d.params ? 'params' : d.fit ? 'fit' : null);
  let list = [];
  if (typeof spec === 'string') {
    const v = getPath(d, spec);
    list = Array.isArray(v) && v.length && (typeof v[0] === 'object') ? v : [v];
  } else if (Array.isArray(spec)) list = spec.map((s) => (typeof s === 'string' ? getPath(d, s) : s));
  return list.map((x) => toParams(x, names, d)).filter(Boolean);
}

// ---- the model forms: a density (entries per unit of x), as [signal, background] ----
// gauss: nSig mu width · poly1: a b (per `bin`, about `pivot`) · flat: a · exp: a slope
// (or tau) · decay: n tau t0 t1 (the normalised exponential on [t0, t1]).
const SQ2PI = Math.sqrt(2 * Math.PI);
export function modelOf(f, { pivot = 0, bin = 1 } = {}) {
  const terms = String(f || 'gauss+poly1').split('+').map((s) => s.trim());
  return (p, x) => {
    let sig = 0, bkg = 0;
    const pv = p.pivot ?? pivot, mb = p.bin ?? bin;
    for (const term of terms) {
      if (term === 'gauss') { const z = (x - p.mu) / p.width; sig += (p.nSig * Math.exp(-0.5 * z * z)) / (p.width * SQ2PI); }
      else if (term === 'poly1') bkg += (p.a + (p.b ?? 0) * (x - pv)) / mb;
      else if (term === 'flat') bkg += p.a / mb;
      else if (term === 'exp') bkg += (p.a * (p.tau ? Math.exp(-(x - pv) / p.tau) : Math.exp((p.slope ?? 0) * (x - pv)))) / mb;
      else if (term === 'decay') {
        const t0 = p.t0 ?? 0, t1 = p.t1 ?? Infinity;
        if (x >= t0 - 1e-9 && x <= t1 + 1e-9) sig += (p.n * Math.exp(-x / p.tau)) / (p.tau * (Math.exp(-t0 / p.tau) - (Number.isFinite(t1) ? Math.exp(-t1 / p.tau) : 0)));
      }
    }
    return [sig, bkg];
  };
}
// the entries a model expects in [a, b] (Simpson, 8 intervals)
function integral(F, p, a, b) {
  const k = 8, h = (b - a) / k;
  let s = 0;
  for (let i = 0; i <= k; i++) { const [u, v] = F(p, a + i * h); s += (u + v) * (i === 0 || i === k ? 1 : i % 2 ? 4 : 2); }
  return (s * h) / 3;
}
function lerpParams(a, b, k) {
  if (!a) return { ...b };
  const out = { ...b };
  for (const [key, v] of Object.entries(b)) if (typeof v === 'number' && typeof a[key] === 'number') out[key] = a[key] + (v - a[key]) * k;
  return out;
}

export const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
// a value that eases from → to over dur seconds of world time
export const fader = (v = 0) => ({
  from: v, to: v, t0: -1e9, dur: 0.6,
  at(t) { return this.from + (this.to - this.from) * ease((t - this.t0) / this.dur); },
  set(t, to, dur) { const now = this.at(t); if (to === this.to && Math.abs(now - to) < 1e-6) return; this.from = now; this.to = to; this.t0 = t; this.dur = dur; },
  jump(v) { this.from = this.to = v; this.t0 = -1e9; },
  moving(t) { return t < this.t0 + this.dur && this.from !== this.to; },
});

// an arc-length table of a polyline: M+1 points at equal arc steps, with normals
const M = 512;
export function arcTable(X, Y, out) {
  const K = X.length;
  let L = 0;
  const cum = out.cum;
  cum[0] = 0;
  for (let k = 1; k < K; k++) { L += Math.hypot(X[k] - X[k - 1], Y[k] - Y[k - 1]); cum[k] = L; }
  let k = 1;
  for (let j = 0; j <= M; j++) {
    const s = (j / M) * L;
    while (k < K - 1 && cum[k] < s) k++;
    const seg = cum[k] - cum[k - 1] || 1, f = Math.max(0, Math.min(1, (s - cum[k - 1]) / seg));
    out.x[j] = X[k - 1] + (X[k] - X[k - 1]) * f;
    out.y[j] = Y[k - 1] + (Y[k] - Y[k - 1]) * f;
    const tx = X[k] - X[k - 1], ty = Y[k] - Y[k - 1], tl = Math.hypot(tx, ty) || 1;
    out.nx[j] = -ty / tl; out.ny[j] = tx / tl;
  }
  out.L = L || 1;
  return out;
}
export const newTable = (K) => ({ x: new Float32Array(M + 1), y: new Float32Array(M + 1), nx: new Float32Array(M + 1), ny: new Float32Array(M + 1), cum: new Float32Array(K), L: 1 });
export const ARC_M = M;

function buildCurve(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = o.name != null ? String(o.name) : null;
  const sel = stage.stepper(name ?? `dk-curve-${o.of}`);
  const frameScale = { value: 1 };
  const seed = o.seed ?? 401;
  const rnd = mulberry32(seed * 7 + 3);

  // grains: the total line, the two parts (dashed), the pull row and its zero line
  const total = Math.max(600, Math.min(ctx.budget ?? 300000, Number(o.grains) || 9000));
  // the shares follow what the steps use: no parts, no pull → every grain on the line
  const stepObjs = (Array.isArray(o.steps) ? o.steps : []).filter((s) => s && typeof s === 'object');
  // parts: true (both), 'sig' or 'bkg' (one of them)
  const partsOf = (v) => (v === 'sig' ? [1, 0] : v === 'bkg' ? [0, 1] : v ? [1, 1] : [0, 0]);
  const hasSig = stepObjs.some((s) => partsOf(s.parts)[0]), hasBkg = stepObjs.some((s) => partsOf(s.parts)[1]);
  const hasPull = o.pull !== false && stepObjs.some((s) => s.pull);
  const share = { line: 0.42, sig: hasSig ? 0.15 : 0, bkg: hasBkg ? 0.15 : 0, zero: hasPull ? 0.03 : 0, ...(o.split || {}) };
  if (!hasPull) share.line = 1 - share.sig - share.bkg;
  const nLine = Math.round(total * share.line), nSig = Math.round(total * share.sig), nBkg = Math.round(total * share.bkg);
  const nZero = Math.round(total * share.zero), nPull = total - nLine - nSig - nBkg - nZero;
  const N = total;
  const o1 = nLine, o2 = o1 + nSig, o3 = o2 + nBkg, o4 = o3 + nPull;
  const dots = dotGrains(stage, N, { crowd: P.crowd, sel: P.sel, axis: P.axis, size: GRAIN, alpha: Number(o.alpha ?? 1), seed, frameScale });
  // per grain: its place along its line (0..1), its offset across it
  const U = new Float32Array(N), J = new Float32Array(N), Jz = new Float32Array(N);
  for (let i = 0; i < N; i++) { U[i] = rnd(); J[i] = Math.max(-2.2, Math.min(2.2, gauss(rnd))); Jz[i] = rnd() - 0.5; }
  // colours: the model, its signal part and the pulls white (the selected: what the
  // curve says), the background part light blue (the crowd), the pulls' zero line dim
  for (let i = 0; i < N; i++) dots.col[i] = i < o2 ? 1 : i < o3 ? 0 : i < o4 ? 1 : -1;
  for (let i = o4; i < N; i++) dots.sz[i] = 0.85;
  dots.paint();

  const flow = Number(o.flow ?? 0.25);       // world units a second along the line
  const thick = Number(o.thick ?? 0.02);     // world units across the line (1 sd)
  const dashLen = Number(o.dash ?? 0.5);     // the parts are dashed, this long a period

  let now = 0, ready = false, failed = false, armed = false, armT = 0;
  let d = null, sets = [], F = null, domain = null, pullData = null;
  let fr = null, hist = null, attached = false;
  let want = sel.step ?? 0, cur = 0, shown = null;
  let pFrom = null, pTo = null, pT0 = -1e9, pDur = 1.4, pNow = null;
  let pPath = null, pSeg = 1.4;                       // {through}: the logged sets between, one segment each
  let yScale = 0, drawT0 = -1e9, waitDraw = false, waitT = 0;
  const drawDur = Number(o.draw ?? 1.2);
  const show = fader(0), parts = fader(0), partB = fader(0), pull = fader(0);
  const K = 321;
  const tabs = [newTable(K), newTable(K), newTable(K)];
  const XS = new Float32Array(K), YT = new Float32Array(K), YS = new Float32Array(K), YB = new Float32Array(K);
  let pulls = null, chi2Now = null, centre = true;
  const pc = o.pull && typeof o.pull === 'object' ? o.pull : {};

  async function load() {
    d = await kit.loadJSON(ctx, o.src ?? 'd0-fit.json');
    sets = resolveSets(d, o);
    if (!sets.length) throw new Error('no parameter sets');
    const f = o.f ?? d?.model?.f ?? (d?.fit ? 'decay' : 'gauss+poly1');
    F = modelOf(f, { pivot: o.pivot ?? d?.model?.pivot ?? 0, bin: o.bin ?? d?.model?.bin ?? 1 });
    domain = o.range ?? d?.range ?? (String(f).includes('decay') ? [sets[0].t0 ?? 0, sets[0].t1 ?? 1e9] : null);
    // the pull row's data: { x | edges, counts | net, err } (d0-fit.json's bins45 by default)
    const src = o.pull === false ? null : getPath(d, pc.data ?? (d.bins45 ? 'bins45' : null));
    if (src && typeof src === 'object') {
      const cnt = src[pc.counts ?? (src.counts ? 'counts' : 'net')];
      let edges = src.edges;
      if (!edges && src.x) { const b = o.bin ?? d?.model?.bin ?? (src.x[1] - src.x[0]); edges = [...src.x.map((x) => x - b / 2), src.x[src.x.length - 1] + b / 2]; }
      if (cnt && edges) {
        const err = src[pc.err ?? 'err'] ?? cnt.map((c) => Math.sqrt(Math.max(1, Math.abs(c))));
        const keep = [];
        for (let b = 0; b < cnt.length; b++) {
          const c = 0.5 * (edges[b] + edges[b + 1]);
          if (domain && (c < domain[0] || c > domain[1])) continue;
          if (!(err[b] > 0)) continue;
          keep.push({ a: edges[b], b: edges[b + 1], c, n: cnt[b], e: err[b] });
        }
        if (keep.length) { pullData = keep; pulls = new Float32Array(keep.length); }
        centre = (pc.eval ?? (d.model ? 'centre' : 'integral')) === 'centre';
      }
    }
    ready = true;
  }

  const setOf = (s) => {
    if (!s) return null;
    let k = s.set ?? 0;
    if (k === 'last' || k < 0) k = sets.length - 1;
    return sets[Math.max(0, Math.min(sets.length - 1, Number(k) || 0))];
  };
  const setIdx = (s) => {
    if (!s) return -1;
    let k = s.set ?? 0;
    if (k === 'last' || k < 0) k = sets.length - 1;
    return Math.max(0, Math.min(sets.length - 1, Number(k) || 0));
  };
  const stepsList = Array.isArray(o.steps) && o.steps.length ? o.steps : null;
  // without `steps`, step k shows set k − 1
  const stateOf = (k) => (stepsList ? stateAt(stepsList, k) : k > 0 ? { set: k - 1 } : null);

  // ---- stepping -------------------------------------------------------------------
  function apply(k, kind) {
    const s = stateOf(k);
    const t = now;
    if (!s) { show.set(t, 0, kind === 'hide' ? 0.5 : 0.35); parts.set(t, 0, 0.35); partB.set(t, 0, 0.35); pull.set(t, 0, 0.35); shown = null; cur = 0; return; }
    const p = setOf(s);
    const instant = kind === 'back';
    const fresh = !shown || kind === 'arrive' || show.to === 0;
    if (fresh) {
      // draws on from the left once the hist has settled (an arrival replays its fill first)
      pFrom = null; pTo = p; pT0 = -1e9; pNow = p; pPath = null;
      show.jump(1); waitDraw = true; waitT = t; drawT0 = 1e9;
      parts.jump(0); partB.jump(0); pull.jump(0);
    } else {
      // a step's own `ease` (s a segment) and `after` (s before it starts: a camera move
      // first); `through: true` steps through every logged set between the two, one
      // segment each, so a fit is seen iterating (lab 3 slide 2), not leaping to the end
      const a = setIdx(shown), b = setIdx(s);
      const thr = !instant && (s.through ?? o.through) && b > a + 1 && a >= 0;
      pSeg = instant ? 0.35 : Number(s.ease ?? o.ease ?? (thr ? 0.8 : 1.4));
      pPath = thr ? [pNow, ...sets.slice(a + 1, b + 1)] : null;
      pFrom = pNow; pTo = p; pT0 = t + (instant ? 0 : Math.max(0, Number(s.after ?? 0)));
      pDur = pPath ? pSeg * (pPath.length - 1) : pSeg;
      show.set(t, 1, 0.35);
    }
    const dur = instant ? 0.35 : 0.8;
    const [ps, pb] = partsOf(s.parts);
    parts.set(t, ps, dur); partB.set(t, pb, dur);
    pull.set(t, s.pull ? 1 : 0, dur);
    shown = s; cur = k;
  }
  const request = (k) => {
    want = k;
    if (!ready || armed) return;
    apply(k, k < cur ? (k === 0 ? 'hide' : 'back') : 'fwd');
  };
  const arrive = () => {
    armed = false;
    if (!ready) return;
    shown = null; cur = 0;
    if (want > 0) apply(want, 'arrive'); else show.jump(0);
  };

  function attach() {
    if (attached) return true;
    hist = kit.form(o.of);
    fr = hist?.api?.frame?.();
    if (!fr) return false;
    fr.group.add(dots.points);
    attached = true;
    yScale = fr.y(1);
    return true;
  }
  const histBusy = () => { const b = hist?.api?.busy; return typeof b === 'function' ? b() : !!b; };

  // ---- drawing -------------------------------------------------------------------------
  function curvesAt(p) {
    // the model on K points over the domain, in the plot's local frame
    const lo = Math.max(fr.lo, domain ? domain[0] : fr.lo), hi = Math.min(fr.hi, domain ? domain[1] : fr.hi);
    const top = fr.height * 1.12, c = fr.bin * yScale;
    for (let k = 0; k < K; k++) {
      const x = lo + ((hi - lo) * k) / (K - 1);
      const [sg, bg] = F(p, x);
      XS[k] = fr.x(x);
      YT[k] = Math.min(top, Math.max(0, (sg + bg) * c));
      YS[k] = Math.min(top, Math.max(0, sg * c));
      YB[k] = Math.min(top, Math.max(0, bg * c));
    }
    arcTable(XS, YT, tabs[0]); arcTable(XS, YS, tabs[1]); arcTable(XS, YB, tabs[2]);
    if (pullData) {
      let c2 = 0;
      pullData.forEach((b, j) => {
        // a binned fit's model is its density at the bin centre × the bin (as the bake's χ²
        // has it: d0-fit.json); an unbinned fit's is its integral over the bin
        let e;
        if (centre) { const [u, v] = F(p, b.c); e = (u + v) * (b.b - b.a); } else e = integral(F, p, b.a, b.b);
        const q = (b.n - e) / b.e; pulls[j] = q; c2 += q * q;
      });
      chi2Now = c2;
    }
  }

  function place(t) {
    const X0 = tabs[0].x[0], X1 = tabs[0].x[M], span = Math.max(1e-6, X1 - X0);
    const rev = waitDraw ? 0 : Math.min(1.05, (t - drawT0) / drawDur);
    const sAll = show.at(t), sPart = parts.at(t), sPartB = partB.at(t), sPull = pull.at(t);
    const pos = dots.pos, vis = dots.vis;
    // the line runs along the columns' near face (a dense column's grains fill
    // z ∈ ±depth/2), so a close fit touches the column tops it fits instead of riding
    // above them in perspective; the background part is light blue over light-blue
    // columns, so it stands a little in front of them and brighter
    const zLine = Number(o.z ?? (fr.width / Math.max(1, fr.bins)) / 2) + 0.02;
    const lines = [[0, o1, tabs[0], 1, false, zLine], [o1, o2, tabs[1], 0.9 * sPart, true, zLine], [o2, o3, tabs[2], 1.6 * sPartB, true, zLine + 0.3]];
    for (const [a, b, tb, alpha, dashed, zl] of lines) {
      const L = tb.L, phase = (flow * t) / L;
      for (let i = a; i < b; i++) {
        let s = U[i] + phase; s -= Math.floor(s);
        const fj = s * M, j = Math.min(M - 1, Math.floor(fj)), f = fj - j;
        const x = tb.x[j] + (tb.x[j + 1] - tb.x[j]) * f, y = tb.y[j] + (tb.y[j + 1] - tb.y[j]) * f;
        const off = J[i] * thick;
        pos[3 * i] = x + tb.nx[j] * off; pos[3 * i + 1] = y + tb.ny[j] * off; pos[3 * i + 2] = Jz[i] * 0.06 + zl;
        let v = alpha * sAll * Math.max(0, Math.min(1, (rev - (x - X0) / span) / 0.04));
        if (dashed && (((s * L) / dashLen) % 1) > 0.55) v = 0;
        vis[i] = v;
      }
    }
    // the pull row: a white bar of grains per bin from its zero line, up or down by the
    // pull, well below the tick numbers and the caption (y and height as shares of H;
    // `height` is the bar of a pull of 3, `max` the pull a bar stops at)
    const H = fr.height;
    const base = Number(pc.y ?? -0.38) * H, scale = (Number(pc.height ?? 0.17) * H) / 3, pmax = Number(pc.max ?? 3.5);
    if (pullData) {
      const nb = pullData.length, across = 4, per = Math.max(1, Math.floor(nPull / (nb * across)));
      const sp = Math.max(0.03, (pmax * scale) / per);
      const bw = Math.abs(fr.x(pullData[0].b) - fr.x(pullData[0].a));
      let i = o3;
      for (let b = 0; b < nb; b++) {
        const q = Math.max(-pmax, Math.min(pmax, pulls[b])), h = q * scale, cnt = Math.min(per, Math.round(Math.abs(h) / sp));
        const xc = fr.x(pullData[b].c);
        const rv = Math.max(0, Math.min(1, (rev - (xc - X0) / span) / 0.04));
        for (let c = 0; c < across; c++) for (let k = 0; k < per; k++, i++) {
          pos[3 * i] = xc + (c - 1.5) * Math.min(0.075, 0.16 * bw) + 0.008 * J[i];
          pos[3 * i + 1] = base + (h < 0 ? -1 : 1) * (k + 0.5) * sp;
          pos[3 * i + 2] = 0.02 * Jz[i] + zLine;
          vis[i] = k < cnt ? 1.35 * sPull * sAll * rv : 0;   // dotted bars: a little over 1 to read white
        }
      }
      for (; i < o4; i++) vis[i] = 0;
      const za = fr.x(pullData[0].a), zb = fr.x(pullData[nb - 1].b);
      for (let j = o4; j < N; j++) {
        const u = (j - o4 + 0.5) / Math.max(1, N - o4);
        pos[3 * j] = za + (zb - za) * u; pos[3 * j + 1] = base; pos[3 * j + 2] = zLine;
        vis[j] = 0.7 * sPull * sAll;
      }
    } else for (let i = o3; i < N; i++) vis[i] = 0;
    dots.touch();
  }

  // ---- api ---------------------------------------------------------------------------
  // value(): `readout` names what <StageCount for> shows: 'chi2' (default; Σ pull² of the
  // curve as drawn now, over the pull data), or any parameter ('mu', 'width', 'tau' …),
  // gliding with the curve
  const readout = () => {
    const key = o.readout ?? 'chi2';
    if (key === 'chi2' && chi2Now != null) return chi2Now;
    return pNow ? Number(pNow[key] ?? 0) : 0;
  };
  const api = {
    arm() { armed = true; armT = now; show.jump(0); waitDraw = false; },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    busy: () => (!ready && !failed && want > 0) || armed
      || (want > 0 && ready && !attached)
      || waitDraw || now < drawT0 + drawDur
      || now < pT0 + pDur || show.moving(now) || parts.moving(now) || partB.moving(now) || pull.moving(now),
    value: readout,
    values: () => ({ params: pNow && { ...pNow }, chi2: chi2Now, set: shown ? sets.indexOf(setOf(shown)) : -1, step: cur }),
    params: () => (pNow ? { ...pNow } : null),
    sets: () => sets.map((s) => ({ ...s })),
    pulls: () => (pulls ? Array.from(pulls) : null),
    ready: () => ready,
  };
  if (name) kit.register(name, { type: TYPE, api });
  load().then(() => { if (!armed && want > 0) apply(want, 'arrive'); })
    .catch((e) => { failed = true; console.warn(`dk-curve ${name}: data failed`, e); });

  let lastKey = '';
  return {
    group: g, api, frameScale,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      dots.u.uTime.value = t;
      if (sel.fresh) { sel.fresh = false; request(sel.step); }
      if (!ready || !attach()) return;
      if (armed && t - armT > 8) arrive();
      fr = hist.api.frame() || fr;
      // the plot's scale glides when the hist rescales
      const ys = fr.y(1);
      yScale += (ys - yScale) * (1 - Math.exp(-dt * 4));
      if (Math.abs(ys - yScale) <= 1e-4 * Math.abs(ys)) yScale = ys;
      if (waitDraw && (!histBusy() || t - waitT > 12)) { waitDraw = false; drawT0 = t; }
      if (pTo) {
        if (!pFrom || t >= pT0 + pDur) pNow = pTo;
        else if (t <= pT0) pNow = pFrom;
        else if (pPath) {
          const uu = (t - pT0) / pSeg, i = Math.min(pPath.length - 2, Math.floor(uu));
          pNow = lerpParams(pPath[i], pPath[i + 1], ease(uu - i));
        } else pNow = lerpParams(pFrom, pTo, ease((t - pT0) / pDur));
      }
      const key = pNow ? `${Object.values(pNow).join(',')}|${yScale}|${fr.lo},${fr.hi}` : '';
      if (pNow && key !== lastKey) { curvesAt(pNow); lastKey = key; }
      const sAll = show.at(t);
      dots.points.visible = sAll > 0.002 && !!pNow;
      if (dots.points.visible) place(t);
    },
    dispose() { sel.off(); if (name) kit.unregister(name); dots.dispose(); },
  };
}
