// The kit's grain engine: N grains, each moving from where it is now to where the
// next state wants it, on the world clock. Every kit form that sorts, fills, cuts or
// gathers grains (dk-hist, dk-heap, and any form that wants it) draws through this.
//
// A state is a target per grain: { pos (3n), vis (n, 0 hidden … 1 shown), white
// (n, 0 crowd … 1 selected) }. go(t, target, plan) snapshots every grain where it
// is at world time t (mid-flight too), sets the target, and lets `plan(m)` choose per
// grain how it travels: m.M[i] the motion, m.T[2i] its delay and m.T[2i+1] its
// duration, m.C[3i] a bow (offset of the Bézier control point from the midpoint),
// and m.A[3i] its start (to start somewhere else: a heap, a detector, above its bin).
//
// Motions (m.M): 0 glide (ease in-out; fades in place when appearing/leaving),
// 1 drop (accelerating; arrives with a short glow, toward white by uGlowTint: 1 here,
// 0.3 in dk-hist), 2 leap (a bowed arc; glow on
// landing), 3 dust (lifts, flares once and fades), 4 annihilate (meets its partner at
// B, flashes and is gone). A grain's colour is the palette's crowd → selected by white.
//
// Everything is on the world clock (uTime = t, uT0): stepping back and forth leaves
// no state but the arrays the last go() wrote, which describe a finished state.
import { Color, Vector3 } from 'three';
import { GRAIN, SEED } from './style.js';
import { mulberry32 } from './rng.js';

export const OFF = 1e9;
export const MOTION = { GLIDE: 0, DROP: 1, LEAP: 2, DUST: 3, ANNIHILATE: 4 };

let VERT = null;
function vert(stage) {
  if (VERT) return VERT;
  VERT = stage.GRAIN_GLSL + /* glsl */ `
attribute vec3 aA, aC;
attribute vec2 aVis, aWhite, aTime;
attribute float aMode, aSeed, aSize, aGone;
uniform float uT0, uAlpha, uSize, uBlur, uSpread, uShow, uSpin, uRotA, uRotB, uBig, uSelGain, uGlowTint;
uniform vec3 uCrowd, uSel, uSpinC;
vec3 spun(vec3 p) { return uSpinC + turnY(p - uSpinC, uSpin * uTime); }
float easeOf(float m, float k) {
  if (m < 0.5) return ease(k);
  if (m < 1.5) return k * k;
  if (m < 2.5) return k * k * (1.6 - 0.6 * k);
  if (m < 3.5) return 1.0 - (1.0 - k) * (1.0 - k);
  return ease(k);
}
void main() {
  if (uShow <= 0.001 || uTime >= aGone) { hide(); return; }
  float s0 = uT0 + aTime.x;
  float before = uTime < s0 ? 1.0 : 0.0;
  float k = clamp((uTime - s0) / max(aTime.y, 1e-3), 0.0, 1.0);
  float e = easeOf(aMode, k);
  vec3 a = uRotA > 0.5 ? spun(aA) : aA;
  vec3 b = uRotB > 0.5 ? spun(position) : position;
  vec3 c = 0.5 * (a + b) + aC;
  vec3 p = (1.0 - e) * (1.0 - e) * a + 2.0 * (1.0 - e) * e * c + e * e * b;
  float v0 = aVis.x, v1 = aVis.y, vis, glow = 0.0;
  if (aMode < 0.5) vis = mix(v0, v1, k);
  else if (aMode < 2.5) {
    if (v1 > v0) {
      vis = before > 0.5 ? v0 : v1 * (aMode < 1.5 ? 0.6 + 0.4 * k : smoothstep(0.0, 0.12, k) * (0.7 + 0.3 * k));
      if (k >= 1.0) glow = exp(-(uTime - s0 - aTime.y) * 3.0);
    } else vis = mix(v0, v1, k);
  } else if (aMode < 3.5) {
    vis = before > 0.5 ? v0 : v0 * pow(1.0 - k, 1.5);
    glow = before > 0.5 ? 0.0 : 0.5 * exp(-k * 7.0);
  } else {
    vis = before > 0.5 ? v0 : v0 * (1.0 - smoothstep(0.7, 1.0, k));
    glow = before > 0.5 ? 0.0 : exp(-abs(k - 0.72) * 9.0);
  }
  if (vis <= 0.002) { hide(); return; }
  float w = mix(aWhite.x, aWhite.y, ease(k));
  vec3 col = mix(uCrowd, uSel, clamp(w + 0.7 * glow * uGlowTint, 0.0, 1.0));
  float alpha = uAlpha * vis * (1.0 + 0.8 * glow) * uShow * mix(1.0, uSelGain, clamp(w, 0.0, 1.0));
  float big = step(1.5, aSize);
  alpha = mix(alpha, max(alpha, uBig * vis * uShow), big);
  float size = uSize * aSize * (0.85 + 0.3 * hash(aSeed * 11.0)) * (1.0 + 0.5 * glow);
  p += uBlur * uSpread * (vec3(hash(aSeed * 13.0), hash(aSeed * 17.0), hash(aSeed * 19.0)) - 0.5);
  alpha /= (1.0 + 2.0 * uBlur);
  size *= (1.0 + 2.0 * uBlur);
  place(p, size, alpha, col, aSeed);
}`;
  return VERT;
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeQ = (x) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
function easeOf(m, k) {
  if (m < 0.5) return easeQ(k);
  if (m < 1.5) return k * k;
  if (m < 2.5) return k * k * (1.6 - 0.6 * k);
  if (m < 3.5) return 1 - (1 - k) * (1 - k);
  return easeQ(k);
}
function visOf(m, k, before, v0, v1) {
  if (m < 0.5) return v0 + (v1 - v0) * k;
  if (m < 2.5) {
    if (v1 > v0) {
      if (before) return v0;
      const s = Math.min(1, k / 0.12);
      return v1 * (m < 1.5 ? 0.6 + 0.4 * k : s * s * (3 - 2 * s) * (0.7 + 0.3 * k));
    }
    return v0 + (v1 - v0) * k;
  }
  if (before) return v0;
  if (m < 3.5) return v0 * Math.pow(1 - k, 1.5);
  const s = clamp01((k - 0.7) / 0.3);
  return v0 * (1 - s * s * (3 - 2 * s));
}

// createMorph(stage, n, { crowd, sel, seed, uniforms }) → the engine; add m.points to a group
export function createMorph(stage, n, { crowd, sel, seed = SEED, uniforms = {}, spread = 1.2 } = {}) {
  const A = new Float32Array(n * 3), B = new Float32Array(n * 3), C = new Float32Array(n * 3);
  const V = new Float32Array(n * 2), W = new Float32Array(n * 2), T = new Float32Array(n * 2);
  const M = new Float32Array(n), S = new Float32Array(n), Z = new Float32Array(n).fill(1), G = new Float32Array(n).fill(OFF);
  const rnd = mulberry32(seed ^ 0x5bd1e995);
  for (let i = 0; i < n; i++) { S[i] = rnd(); T[2 * i + 1] = 1e-3; }
  const geo = stage.grainGeometry(n, { position: B, aA: [A, 3], aC: [C, 3], aVis: [V, 2], aWhite: [W, 2], aTime: [T, 2], aMode: [M, 1], aSeed: [S, 1], aSize: [Z, 1], aGone: [G, 1] });
  const mat = stage.grainMaterial(vert(stage), {
    uT0: { value: -OFF }, uAlpha: { value: 0.5 }, uSize: { value: GRAIN }, uBlur: { value: 0 }, uSpread: { value: spread },
    uShow: { value: 1 }, uSpin: { value: 0 }, uRotA: { value: 0 }, uRotB: { value: 0 }, uBig: { value: 0.95 }, uSelGain: { value: 1.3 }, uGlowTint: { value: 1 },
    uCrowd: { value: new Color(crowd) }, uSel: { value: new Color(sel) }, uSpinC: { value: new Vector3() },
    ...uniforms,
  });
  const points = stage.grainPoints(geo, mat);
  const u = mat.uniforms;
  let t0 = -OFF, end = -OFF, rotA = 0, rotB = 0;
  const spin = (x, y, z, t, out) => {
    const c = u.uSpinC.value, a = u.uSpin.value * t, ca = Math.cos(a), sa = Math.sin(a);
    const px = x - c.x, pz = z - c.z;
    out[0] = c.x + ca * px - sa * pz; out[1] = y; out[2] = c.z + sa * px + ca * pz;
  };
  const ta = [0, 0, 0], tb = [0, 0, 0];
  const m = {
    n, A, B, C, V, W, T, M, S, Z, G, geo, mat, points, u,
    get t0() { return t0; },
    get end() { return end; },
    // grain i at world time t → out = [x, y, z, vis, white]
    sample(i, t, out) {
      const i3 = 3 * i, i2 = 2 * i;
      if (t >= end) {
        if (rotB) spin(B[i3], B[i3 + 1], B[i3 + 2], t, out); else { out[0] = B[i3]; out[1] = B[i3 + 1]; out[2] = B[i3 + 2]; }
        out[3] = V[i2 + 1]; out[4] = W[i2 + 1];
        return out;
      }
      const s0 = t0 + T[i2], before = t < s0;
      const k = clamp01((t - s0) / Math.max(T[i2 + 1], 1e-3));
      const e = easeOf(M[i], k);
      if (rotA) spin(A[i3], A[i3 + 1], A[i3 + 2], t, ta); else { ta[0] = A[i3]; ta[1] = A[i3 + 1]; ta[2] = A[i3 + 2]; }
      if (rotB) spin(B[i3], B[i3 + 1], B[i3 + 2], t, tb); else { tb[0] = B[i3]; tb[1] = B[i3 + 1]; tb[2] = B[i3 + 2]; }
      const w0 = (1 - e) * (1 - e), w1 = 2 * (1 - e) * e, w2 = e * e;
      for (let j = 0; j < 3; j++) out[j] = w0 * ta[j] + w1 * (0.5 * (ta[j] + tb[j]) + C[i3 + j]) + w2 * tb[j];
      out[3] = visOf(M[i], k, before, V[i2], V[i2 + 1]);
      out[4] = W[i2] + (W[i2 + 1] - W[i2]) * easeQ(k);
      return out;
    },
    // a transition from wherever every grain is at t to `tgt`; plan(m) picks the motions.
    // { rotB: 1 } when the target spins (a ball): B turns about uSpinC at uSpin rad/s.
    go(t, tgt, plan, { rotB: spinB = 0 } = {}) {
      const cur = [0, 0, 0, 0, 0];
      for (let i = 0; i < n; i++) {
        m.sample(i, t, cur);
        const i3 = 3 * i, i2 = 2 * i;
        A[i3] = cur[0]; A[i3 + 1] = cur[1]; A[i3 + 2] = cur[2];
        V[i2] = cur[3] < 0.002 ? 0 : cur[3]; W[i2] = cur[4];
        B[i3] = tgt.pos[i3]; B[i3 + 1] = tgt.pos[i3 + 1]; B[i3 + 2] = tgt.pos[i3 + 2];
        V[i2 + 1] = tgt.vis[i]; W[i2 + 1] = tgt.white[i];
        C[i3] = 0; C[i3 + 1] = 0; C[i3 + 2] = 0;
        M[i] = 0; T[i2] = 0; T[i2 + 1] = 1e-3;
      }
      rotA = 0; rotB = spinB ? 1 : 0;
      plan?.(m);
      let last = 0;
      for (let i = 0; i < n; i++) { const d = T[2 * i] + T[2 * i + 1]; if (d > last) last = d; }
      t0 = t; end = t + last;
      u.uT0.value = t; u.uRotA.value = rotA; u.uRotB.value = rotB;
      for (const k of ['position', 'aA', 'aC', 'aVis', 'aWhite', 'aTime', 'aMode']) geo.attributes[k].needsUpdate = true;
      return end;
    },
    // everything to its target at once (no motion)
    jump(t, tgt, opts) { return m.go(t, tgt, null, opts); },
    sizes() { geo.attributes.aSize.needsUpdate = true; },
    gone() { geo.attributes.aGone.needsUpdate = true; },
    dispose() { geo.dispose(); mat.dispose(); },
  };
  return m;
}

// A plain line or set of grains that only fades (axes, ticks, whiskers): position +
// aSeed, uniforms uShow, uAlpha, uColor, uSize. Share uTime/uPixelRatio with a morph.
let STATIC = null;
export function staticGrains(stage, n, { color, alpha = 0.5, size = GRAIN, share = null } = {}) {
  STATIC ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed;
uniform float uShow, uAlpha, uSize;
uniform vec3 uColor;
void main() {
  if (uShow <= 0.001) { hide(); return; }
  place(position, uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha * uShow, uColor, aSeed);
}`;
  const pos = new Float32Array(n * 3), seed = new Float32Array(n);
  const rnd = mulberry32(n * 7919 + 17);
  for (let i = 0; i < n; i++) seed[i] = rnd();
  const geo = stage.grainGeometry(n, { position: pos, aSeed: [seed, 1] });
  const mat = stage.grainMaterial(STATIC, { uShow: { value: 0 }, uAlpha: { value: alpha }, uSize: { value: size }, uColor: { value: new Color(color) } });
  if (share) { mat.uniforms.uTime = share.uTime; mat.uniforms.uPixelRatio = share.uPixelRatio; }
  const points = stage.grainPoints(geo, mat);
  return { points, geo, mat, pos, u: mat.uniforms, touch() { geo.attributes.position.needsUpdate = true; }, count(k) { geo.setDrawRange(0, Math.max(0, Math.min(n, k))); } };
}
