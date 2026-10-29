// dk-bell: the normal distribution as 300 000 grains (T2 "How rare"). Each grain is one
// draw of N(0, 1), placed by seeded inverse-CDF sampling: grain i takes
// u_i = (i + r_i) / n (one jittered draw in each of n equal strata, r_i from mulberry32),
// so x_i = Φ⁻¹(u_i) and the counts beyond each line match n·(1 − Φ(k)) to within a grain.
// Its height is uniform under the curve, so the grains fill the bell evenly: it reads
// as a histogram with very fine bins, one grain per entry (bible §3).
//
// With 300 000 grains: beyond 1 σ 47 597, beyond 3 σ 405, beyond 5 σ none (the expected
// count is 0.086; the last grain sits at Φ⁻¹(1 − 1.7·10⁻⁶) ≈ 4.6). That is the point
// of the slide. api.value() is the count beyond the lit line, from all n draws (also
// when a lower tier draws fewer grains).
//
//   { "type": "dk-bell", "name": "z", "pos": [0, 0, 0], "grains": 300000,
//     "sigmas": 6, "width": 24, "height": 8, "word": "σ",
//     "steps": [0, {}, { "lit": 1 }, { "lit": 3 }, { "lit": 5 }, { "zoom": { "from": 3 } }] }
//
// Steps merge as dk-hist's do (step k = steps 1..k; `key: null` drops one; 0 hidden):
// - `lit: k`: a front sweeps to k σ (from the far tail on the first lighting); the
//   grains beyond it turn white. A white mark stands on the axis at the front.
// - `zoom: true | { from, gain, keep, after }`: the tail beyond `from` σ (default 3) is redrawn
//   `gain` times taller (default: so the curve at `from` reaches 0.6 of the height; a
//   magnified scale, to be said in the notes), the rest of the bell fades, and a line
//   of flowing grains traces the curve on out to `sigmas`, over an empty tail. The
//   magnified tail is white (the lit tail of {lit: 3}, continuous with it), and the axis
//   left of `from` (its line and tick marks) fades with the bell.
//
//   `keep` (0.45): the share of the bell (grains, axis, ticks left of `from`) that stays as the
//   reference while the tail grows (0: gone, the look before 30 Oct); `after` (s): the dive
//   waits that long (for the camera).
// Fill: the bell gathers up from its axis, low grains first (`fillFrom: 'drop'`: each grain
// settles in place, the old fade). `frontGlow` (0.6): the front's glow in the sparse tail.
// An arm keeps a standing bell (`arrival: 'replay'` fills it again).
// Look: `size` (0.65 × GRAIN: at 300 000 the grains read as sand, a speckled light blue,
// not a flat fill), `alphaGain` (1.5), `selGain` (1.7: the white gain of lit grains in
// the dense body), `litSize` (1.9: lit grains past 2.5 σ, lone grains, are drawn this
// much larger, so the 405 beyond 3 σ show as a speckled white tail on the axis).
import { Group, Color } from 'three';
import { GRAIN, SEED, LABEL, roles } from './style.js';
import { mulberry32 } from './rng.js';
import { fixedLabel, shade } from './label.js';
import { staticGrains } from './morph.js';
import { stateAt } from './hist.js';

export const TYPE = 'dk-bell';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't2';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildBell(o, ctx, stage, kit), { fields: FIELDS });
}

// Φ⁻¹(p): Acklam's rational approximation (relative error < 1.2·10⁻⁹)
const A = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
const B = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
const C = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
const D = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
export function probit(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  }
  if (p > 1 - pl) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  }
  const q = p - 0.5, r = q * q;
  return (((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q / (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1);
}

// n draws of N(0,1), one per stratum, ascending (pure: the same n and seed give the same draws)
export function bellDraws(n, seed = SEED) {
  const rnd = mulberry32(seed * 2654435761 + 97);
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = probit((i + rnd()) / n);
  return x;
}
// how many of the ascending draws lie beyond k
export function beyond(x, k) {
  let lo = 0, hi = x.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (x[m] <= k) lo = m + 1; else hi = m; }
  return x.length - lo;
}

let VERT = null;
const vert = (stage) => (VERT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed, aA0, aA1;
uniform float uShow, uShowT0, uFront, uLit, uSweep, uZoom, uZFrom, uZGain, uUnit, uSelGain, uSize, uFill, uLitSize, uHB, uRise, uKeep, uFrontGlow;
uniform vec3 uCrowd, uSel;
void main() {
  if (uShow <= 0.001) { hide(); return; }
  float z = position.x / uUnit;
  float tail = step(uZFrom, z);
  float zt = uZoom * tail;
  vec3 p = vec3(position.x, position.y * mix(1.0, uZGain, zt), position.z);
  // in a zoom the body stays as a faint reference (zoom.keep, 0.45: about a sixth of its light), not gone to black
  float a = mix(aA0, aA1, zt) * mix(1.0, 1.0 - uZoom * (1.0 - uKeep), 1.0 - tail);
  // the fill on arrival. uRise (default): the bell gathers up from its axis, each grain rising
  // from the axis line to its place, the low grains first (a histogram filling, not a shape
  // fading in whole: T2 slide 8). 0: each grain settles a little way down into place, in a
  // seeded order (the look before 30 Oct)
  float hz = uHB * exp(-0.5 * z * z);
  float share = clamp(position.y / max(hz, 1e-4), 0.0, 1.0);
  float dl = uRise > 0.5 ? uFill * (0.75 * share + 0.25 * aSeed) : uFill * aSeed;
  float k = clamp((uTime - uShowT0 - dl) / 0.7, 0.0, 1.0);
  float e = k * k * (3.0 - 2.0 * k);
  if (uRise > 0.5) { p.y *= mix(0.0, 1.0, e); a *= smoothstep(0.0, 0.25, k); }
  else { p.y += (1.0 - e) * 0.6; a *= e; }
  if (a <= 0.002) { hide(); return; }
  float w = uLit * step(uFront, z);
  // the front's glow: full in the sparse tail, a quarter in the dense body (at 1 sigma a
  // full glow over thousands of stacked grains bloomed into a white halo, lab 2 slide 16)
  // frontGlow (0.6) in the sparse tail: a lone tail grain lighting at full glow flashed as a
  // stray speck (T2 slide 8, 2.8 s)
  float glow = uLit * uSweep * exp(-abs(z - uFront) * 7.0) * mix(0.25, uFrontGlow, smoothstep(1.6, 2.6, z));
  // the zoomed tail stays white (it is the lit tail of {lit: 3}, magnified)
  float wz = max(w, zt);
  vec3 col = mix(uCrowd, uSel, clamp(wz + 0.6 * glow, 0.0, 1.0));
  // lit grains in the dense body take the white gain; the sparse tail past 2.5 sigma
  // (lone grains, alpha near 1 already) is drawn bigger instead, so 405 grains show
  float sparse = smoothstep(2.4, 3.0, z);
  a *= mix(1.0, uSelGain, w * (1.0 - sparse) * (1.0 - zt)) * (1.0 + glow);
  float sz = uSize * mix(1.0, uLitSize, wz * sparse);
  place(p, sz, a * uShow, col, aSeed);
}`);

// the expected curve, a line of grains flowing slowly outward (zoom only)
let CURVE = null;
const curveVert = (stage) => (CURVE ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed, aS;
uniform float uShow, uZFrom, uSig, uUnit, uH, uSize, uAlpha, uFlow;
uniform vec3 uColor;
void main() {
  if (uShow <= 0.001) { hide(); return; }
  float s = fract(aS + uFlow * uTime);
  float z = uZFrom + s * (uSig - uZFrom);
  float y = uH * exp(-0.5 * (z * z - uZFrom * uZFrom));
  place(vec3(z * uUnit, y, 0.0), uSize, uAlpha * uShow * (0.6 + 0.4 * hash(aSeed * 9.0)), uColor, aSeed);
}`);

function buildBell(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const steps = Array.isArray(o.steps) && o.steps.length ? o.steps : [0, {}];
  const seed = o.seed ?? SEED;
  const sig = Number(o.sigmas ?? 6);
  const W = Number(o.width ?? 24), H = Number(o.height ?? 8);
  const unit = W / (2 * sig);                         // world units per σ
  const nAll = Math.max(1000, Math.round(Number(o.n ?? 300000)));
  const nDraw = Math.max(1000, Math.min(nAll, ctx.budget ?? 300000, Number(o.grains ?? nAll)));
  const x = bellDraws(nAll, seed);
  const every = nAll / nDraw;
  const labels = [];

  // ---- the grains -------------------------------------------------------------------------
  const pos = new Float32Array(nDraw * 3), sd = new Float32Array(nDraw), a0 = new Float32Array(nDraw), a1 = new Float32Array(nDraw);
  const rnd = mulberry32(seed * 31 + 5);
  // brightness: the grains overlap about ρ·d²·min(1, h/d) deep (ρ grains per unit², d a
  // grain's width, h the bell's height there); each grain's alpha is set so the bell
  // reads as an even light blue, and a lone grain in the tail is whole
  const size = Number(o.size ?? 0.65) * GRAIN;     // a fine grain: 300 000 of them read as sand, not as a fill
  const d = 0.0746 * size;
  const area = H * Math.sqrt(2 * Math.PI) * unit;
  const rho = nDraw / area;
  const gain0 = Number(o.alphaGain ?? 1.5);
  const zf0 = 3;
  const alphaOf = (h, r) => {
    // over^-0.42 (not the even-fill -0.45): a deeper stack keeps a little more light and
    // its count's own scatter, so the body is a speckled light blue, not a flat colour
    const over = Math.max(0.5, r * d * Math.min(d, h));
    return Math.max(0.05, Math.min(1, gain0 * Math.pow(over, -0.42)));
  };
  for (let j = 0; j < nDraw; j++) {
    const xi = x[Math.min(nAll - 1, Math.floor((j + 0.5) * every))];
    const h = H * Math.exp(-0.5 * xi * xi);
    pos[3 * j] = xi * unit;
    pos[3 * j + 1] = rnd() * h;
    pos[3 * j + 2] = (rnd() - 0.5) * 0.4;
    sd[j] = rnd();
    a0[j] = alphaOf(h, rho);
    a1[j] = a0[j];                                     // set when a zoom is known (below)
  }
  const geo = stage.grainGeometry(nDraw, { position: pos, aSeed: [sd, 1], aA0: [a0, 1], aA1: [a1, 1] });
  const mat = stage.grainMaterial(vert(stage), {
    uShow: { value: 0 }, uShowT0: { value: -1e9 }, uFront: { value: 1e3 }, uLit: { value: 0 }, uSweep: { value: 0 },
    uZoom: { value: 0 }, uZFrom: { value: 1e3 }, uZGain: { value: 1 }, uUnit: { value: unit },
    uSelGain: { value: Number(o.selGain ?? 1.7) }, uSize: { value: size }, uFill: { value: Number(o.fill ?? 1.6) },
    uLitSize: { value: Number(o.litSize ?? 1.9) },
    uHB: { value: H }, uRise: { value: o.fillFrom === 'drop' ? 0 : 1 }, uKeep: { value: 0.45 }, uFrontGlow: { value: Number(o.frontGlow ?? 0.6) },
    uCrowd: { value: new Color(P.crowd) }, uSel: { value: new Color(P.sel) },
  });
  const u = mat.uniforms;
  g.add(stage.grainPoints(geo, mat));
  // a zoom's alphas: in the stretched tail the grains no longer overlap
  let zoomKey = '';
  function setZoom(z) {
    const from = Number(z?.from ?? zf0);
    u.uKeep.value = Math.max(0, Math.min(1, Number(z?.keep ?? 0.45)));
    const gainZ = Number(z?.gain ?? Math.round(0.6 * Math.exp(0.5 * from * from)));
    const key = `${from}:${gainZ}`;
    u.uZFrom.value = from; u.uZGain.value = gainZ;
    if (key === zoomKey) return;
    zoomKey = key;
    const rz = rho / gainZ;
    for (let j = 0; j < nDraw; j++) {
      const xi = pos[3 * j] / unit;
      a1[j] = xi >= from ? alphaOf(H * Math.exp(-0.5 * xi * xi) * gainZ, rz) : a0[j];
    }
    geo.attributes.aA1.needsUpdate = true;
    curve.u.uZFrom.value = from;
    curve.u.uH.value = Math.min(H, H * Math.exp(-0.5 * from * from) * gainZ);
  }

  // ---- the axis, its ticks, the caption, the lit mark, the curve ------------------------------
  // A zoom crops the axis: the part left of the magnified tail (and its tick marks) fades
  // with the bell, so no unlabelled marks or bare line are left under the numbers.
  const zStep = steps.find((s) => s && typeof s === 'object' && s.zoom);
  const zFrom = zStep ? Number(typeof zStep.zoom === 'object' && zStep.zoom.from != null ? zStep.zoom.from : zf0) : Infinity;
  const cropX = Math.max(-W / 2, Math.min(W / 2, (zFrom - 0.15) * unit));
  const axisN = Math.round(Math.min(1400, Math.max(300, W / 0.03)));
  const nL = Math.round((axisN * (cropX + W / 2)) / W), nR = axisN - nL;
  const axisL = staticGrains(stage, Math.max(1, nL), { color: P.axis, alpha: 0.9, size: GRAIN, share: u });
  const axis = staticGrains(stage, Math.max(1, nR), { color: P.axis, alpha: 0.9, size: GRAIN, share: u });
  const ay = -0.012 * H;
  for (let i = 0; i < nL; i++) axisL.pos.set([-W / 2 + ((cropX + W / 2) * i) / Math.max(1, nL), ay, 0], i * 3);
  for (let i = 0; i < nR; i++) axis.pos.set([cropX + ((W / 2 - cropX) * i) / Math.max(1, nR - 1), ay, 0], i * 3);
  axisL.count(nL); axis.count(nR);
  axisL.touch(); axis.touch(); g.add(axisL.points); g.add(axis.points);
  let tv = o.ticks;
  if (!Array.isArray(tv)) { tv = []; for (let k = -Math.floor(sig - 1); k <= Math.floor(sig); k++) tv.push(k); }
  const ticks = tv.map((t) => (Array.isArray(t) ? { v: t[0], text: String(t[1]) } : { v: t, text: t < 0 ? `−${-t}` : String(t) }));
  const TM = 12;
  const ticksL = ticks.filter((t) => t.v < zFrom - 1e-6), ticksR = ticks.filter((t) => t.v >= zFrom - 1e-6);
  const marksL = staticGrains(stage, Math.max(1, ticksL.length * TM), { color: P.axis, alpha: 0.9, size: GRAIN, share: u });
  const marks = staticGrains(stage, Math.max(1, ticksR.length * TM), { color: P.axis, alpha: 0.9, size: GRAIN, share: u });
  marksL.count(ticksL.length * TM); marks.count(ticksR.length * TM);
  const tickLabels = [];
  ticksL.forEach((t, k) => { for (let j = 0; j < TM; j++) marksL.pos.set([t.v * unit, ay - (0.03 * H * j) / (TM - 1), 0], (k * TM + j) * 3); });
  ticksR.forEach((t, k) => { for (let j = 0; j < TM; j++) marks.pos.set([t.v * unit, ay - (0.03 * H * j) / (TM - 1), 0], (k * TM + j) * 3); });
  ticks.forEach((t) => {
    const l = fixedLabel(stage, t.text, { px: o.tickPx ?? LABEL.px, color: P.tick, align: 'center', hang: 0.5 });
    l.position.set(t.v * unit, ay - 0.045 * H, 0);
    l.userData.v = t.v;
    g.add(l); labels.push(l); tickLabels.push(l);
  });
  marks.touch(); g.add(marks.points); marksL.touch(); g.add(marksL.points);
  if (o.word) {
    const l = fixedLabel(stage, o.word, { px: LABEL.captionPx, color: P.name, align: 'right', hang: 1.75 });
    l.position.set(W / 2, ay - 0.045 * H, 0);
    g.add(l); labels.push(l);
  }
  const MK = 40;
  const mark = staticGrains(stage, MK, { color: P.sel, alpha: 0.95, size: GRAIN, share: u });
  g.add(mark.points);
  const CN = 260;
  const curve = (() => {
    const cpos = new Float32Array(CN * 3), cs = new Float32Array(CN), csd = new Float32Array(CN);
    const r2 = mulberry32(seed + 77);
    for (let i = 0; i < CN; i++) { cs[i] = i / CN; csd[i] = r2(); }
    const cgeo = stage.grainGeometry(CN, { position: cpos, aS: [cs, 1], aSeed: [csd, 1] });
    const cmat = stage.grainMaterial(curveVert(stage), {
      uShow: { value: 0 }, uZFrom: { value: zf0 }, uSig: { value: sig }, uUnit: { value: unit }, uH: { value: H },
      uSize: { value: 0.8 * GRAIN }, uAlpha: { value: 0.7 }, uFlow: { value: 0.012 }, uColor: { value: new Color(P.crowd) },
    });
    cmat.uniforms.uTime = u.uTime; cmat.uniforms.uPixelRatio = u.uPixelRatio;
    const pts = stage.grainPoints(cgeo, cmat);
    g.add(pts);
    return { u: cmat.uniforms, geo: cgeo, mat: cmat };
  })();
  setZoom(null);

  // ---- steps ------------------------------------------------------------------------------
  const st = stage.stepper(name);
  let now = 0, want = st.step ?? 0, cur = 0, armed = false, armT = 0;
  let show = 0, showTo = 0, kept = false;
  let litOn = 0, frontFrom = sig + 0.5, frontTo = sig + 0.5, frontT0 = -1e9, frontDur = 1.3;
  let zoomFrom = 0, zoomTo = 0, zoomT0 = -1e9;
  const ZD = 1.8;
  const ease = (v) => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
  const frontNow = () => frontFrom + (frontTo - frontFrom) * ease((now - frontT0) / frontDur);
  const zoomNow = () => zoomFrom + (zoomTo - zoomFrom) * ease((now - zoomT0) / ZD);

  function go(k, kind) {
    const s = stateAt(steps, k);
    const instant = kind === 'back' || kind === 'hide';
    const fresh = kind === 'arrive' || cur === 0;
    cur = s ? k : 0;
    showTo = s ? 1 : 0;
    if (!s) return;
    // a fresh arrival fills the bell first; a lit front waits for the fill
    const filling = fresh && show < 0.05;
    if (filling) { u.uShowT0.value = now; show = 1; }
    else if (fresh) u.uShowT0.value = -1e9;
    // the lit front
    const lit = s.lit != null ? Number(s.lit) : null;
    const f0 = fresh || !litOn ? sig + 0.5 : frontNow();
    if (lit == null) { litOn = 0; frontFrom = frontTo = sig + 0.5; }
    else {
      litOn = 1;
      frontFrom = instant ? lit : f0; frontTo = lit;
      frontT0 = filling ? now + Number(o.fill ?? 1.6) + 0.5 : now;
      frontDur = 1.3;
    }
    // the zoom
    const z = s.zoom ? (typeof s.zoom === 'object' ? s.zoom : {}) : null;
    if (z) setZoom(z);
    const zt = z ? 1 : 0;
    zoomFrom = instant ? zt : fresh ? 0 : zoomNow(); zoomTo = zt;
    // zoom.after (s): the dive waits for the camera (a slide that moves in on the tail)
    zoomT0 = (fresh ? now + 0.4 : now) + (z && !instant ? Math.max(0, Number(z.after ?? 0)) : 0);
  }
  const request = (k) => { want = k; if (!armed) go(k, k < cur ? (k === 0 ? 'hide' : 'back') : 'fwd'); };

  const api = {
    // a bell that stands when its station is armed stays (`arrival: 'replay'` fills it again)
    arm() {
      if (o.arrival !== 'replay' && cur > 0 && show > 0.5) { kept = true; return; }
      armed = true; armT = now; show = 0; u.uShow.value = 0; cur = 0;
    },
    assemble(t, onDone) {
      now = t;
      if (kept) { kept = false; if (want !== cur) go(want, want < cur ? (want === 0 ? 'hide' : 'back') : 'fwd'); onDone?.(); return; }
      armed = false; show = 0; cur = 0; if (want > 0) go(want, 'arrive'); onDone?.();
    },
    busy: () => armed || Math.abs(show - showTo) > 0.01
      || (cur > 0 && now < u.uShowT0.value + Number(o.fill ?? 1.6) + 0.8)
      || (litOn && now < frontT0 + frontDur + 0.4) || now < zoomT0 + ZD,
    // the count beyond the lit front, from all n draws (0 when nothing is lit)
    value: () => (cur > 0 && litOn ? beyond(x, frontNow()) : 0),
    values: () => ({ n: nAll, drawn: nDraw, lit: litOn ? frontTo : null, count: litOn ? beyond(x, frontTo) : 0, max: x[nAll - 1], gain: u.uZGain.value, zoom: zoomTo }),
    ready: () => true,
  };
  kit.register(name, { type: TYPE, api });

  return {
    group: g, labels, api, frameScale: u.uPixelRatio,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      u.uTime.value = t;
      if (st.fresh) { st.fresh = false; request(st.step); }
      if (armed && now - armT > 6) { armed = false; if (want > 0) go(want, 'arrive'); }
      if (showTo < show) show = Math.max(0, show - dt / 0.35);
      else if (showTo > show) show = Math.min(1, show + dt / 0.35);
      if (armed) show = 0;
      u.uShow.value = show;
      const f = frontNow(), z = zoomNow();
      u.uFront.value = litOn ? f : 1e3;
      u.uLit.value = litOn;
      // the sweep's glow eases in over 0.3 s and out over 0.4 s once the front stands (it
      // switched in one frame: a white blink as the front stopped, and on the next slide's first frame)
      {
        const sm = (a, b, x) => { const q = Math.max(0, Math.min(1, (x - a) / (b - a))); return q * q * (3 - 2 * q); };
        u.uSweep.value = litOn ? sm(frontT0, frontT0 + 0.3, now) * (1 - sm(frontT0 + frontDur, frontT0 + frontDur + 0.4, now)) : 0;
      }
      u.uZoom.value = z;
      axis.u.uShow.value = show; marks.u.uShow.value = show;
      // the lit line: a short white mark standing on the axis at the front
      if (litOn && f < sig + 0.01) {
        const xm = f * unit, top = Math.max(0.05 * H, Math.min(H, H * Math.exp(-0.5 * f * f) * (1 + (u.uZGain.value - 1) * (f >= u.uZFrom.value ? z : 0))));
        for (let j = 0; j < MK; j++) mark.pos.set([xm, ay + (Math.min(top, 0.18 * H) * j) / (MK - 1), 0.25], j * 3);
        mark.touch();
        mark.u.uShow.value = show * Math.min(1, Math.max(0, (now - frontT0 + 0.2) / 0.4));
      } else mark.u.uShow.value = 0;
      curve.u.uShow.value = show * z;
      const kz = 1 - z * (1 - u.uKeep.value);
      axisL.u.uShow.value = show * kz; marksL.u.uShow.value = show * kz;
      // tick labels: in the zoom, the ones left of the magnified tail fade with the bell (to
      // its `keep` share: the reference stays)
      for (const l of tickLabels) l.userData.show = l.userData.v >= u.uZFrom.value - 1e-6 ? 1 : kz;
      shade(labels, show);
    },
    dispose() {
      st.off(); kit.unregister(name);
      geo.dispose(); mat.dispose(); curve.geo.dispose(); curve.mat.dispose();
      axis.geo.dispose(); axis.mat.dispose(); marks.geo.dispose(); marks.mat.dispose();
      axisL.geo.dispose(); axisL.mat.dispose(); marksL.geo.dispose(); marksL.mat.dispose(); mark.geo.dispose(); mark.mat.dispose();
    },
  };
}
