// The opening's collision drawn from a CMS crossing: the same run as LHCb's
// (collision.js: two bunches run in along the beam pipe and light it, they cross,
// the world nearly stops, the debris flies out), but the particles go to every side.
// CMS's solenoid wraps the collision: each track curls on its own helix round the
// field along the beam, out through the tracker to the calorimeters, where its
// energy shows in the cells that took it, and the muons run on through the muon
// system and out. It is truly round: from any side it is the same sphere of curls.
//
//   { type: lhc-collision, event: cms, name, pos?, approach?: 3.32, bunch?: 8,
//     light?: 1.6 (units/s), scale?: 1 (units per metre), pipe?: 26, pipeR?: 0.05,
//     grain?: 1.8 (px at 900 rows), flash?: 0.012, calo?: ['EB', 'EE', 'HB', 'HE', 'HO'],
//     tone?, muonTone?, ecalTone?, hcalTone?, bunchColor?, seed? }
//
// Sharp at every distance. LHCb's drawing sizes a grain by perspective (72 / depth)
// with a soft sprite: with the camera two units from the vertex a track's grain is
// a 7–20 px blur, a head grows with its speed, and only the last pull-back makes
// them small (and so many large sprites cost a laptop enough fill for the engine's
// frame-rate guard to drop the resolution, for good). Here a grain is a hard disc
// of about two pixels at 900 rows (at most 1.35× that when close, a little smaller
// far off), its edge one pixel wide; trails are lines of such grains, dense near
// the vertex, where the camera stands close in the freeze, sparser outward, where
// by then it has pulled back (the slide's path keeps it off them, and whatever comes
// within a metre of the lens fades). Heads are brighter, not bigger, and a
// calorimeter's deposit is a thin spike.
//
// The event loads on its own (`load`, a dynamic import: a talk that keeps LHCb's
// event never fetches it); until it is in, the form says it is busy.
import { BufferGeometry, BufferAttribute, Points, Group, ShaderMaterial, AdditiveBlending } from 'three';
import { cmsPaths } from './cms.js';
import { collisionRun, mulberry32, gauss, lin } from './collision.js';

const KIND = { bunchA: 0, bunchB: 1, pipe: 2, flash: 3, track: 4, muon: 5, ecal: 6, hcal: 7 };

const VERT = /* glsl */ `
attribute float aKind, aSeed, aS, aE, aW;
attribute vec3 aOff;
uniform float uTime, uFrame, uStart, uTc, uHide, uVB, uVT, uTail, uFlashR, uGrain, uNear, uTailLen, uDist;
uniform vec3 uBunch, uTrack, uMuon, uEcal, uHcal;
varying vec3 vColor; varying float vAlpha, vPx;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vAlpha = 0.0; vColor = vec3(0.0); vPx = 1.0; }
float bunchX(float side) { return side * uVB * (uTime - uTc); }
void main() {
  if (uStart < 0.0) { off_(); return; }
  float te = uTime - uTc;                         // engine-s since the crossing (negative before)
  float fade = uHide < 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.6, uTime - uHide);
  float on = smoothstep(0.0, 0.5, uTime - uStart) * fade;
  vec3 p; float a = 0.0; float size = 1.0; vec3 col;
  float k = aKind;
  if (k < 1.5) {
    // a bunch: a needle of light along the beam, streaked by its speed; past the
    // crossing it flies on and dissolves within the freeze
    float side = k < 0.5 ? 1.0 : -1.0;
    float cx = bunchX(side);
    float streak = 1.0 + uTail * 0.6;
    p = vec3(cx + aOff.x * streak, aOff.y, aOff.z);
    float after = te > 0.0 ? 1.0 - smoothstep(0.0, 0.15, te) : 1.0;
    float far = 1.0 - smoothstep(18.0, 30.0, abs(cx));
    float overlap = 1.0 - 0.6 * exp(-cx * cx / 0.5);
    a = 0.5 * on * after * far * overlap * (0.6 + 0.4 * hash(aSeed * 7.0));
    size = 0.9 + 0.4 * aE;
    col = mix(uBunch, vec3(1.0), 0.45 * aE);
  } else if (k < 2.5) {
    // the beam pipe's wall, seen only where something lights it: the bunches as they
    // pass, then the crossing's flash
    p = position;
    float la = 0.0;
    for (int s = 0; s < 2; s++) {
      float cx = bunchX(s == 0 ? 1.0 : -1.0);
      float bright = te > 0.0 ? 1.0 - smoothstep(0.0, 0.15, te) : 1.0;
      float d = abs(p.x - cx);
      la += bright * 0.6 / (1.0 + d * d * 1.6);
    }
    float flash = te > 0.0 ? exp(-te * 1.2) * smoothstep(0.0, 0.08, te) : 0.0;
    la += flash * 0.45 / (1.0 + p.x * p.x * 4.0);
    a = on * (0.03 + 0.5 * la) * (0.5 + 0.5 * hash(aSeed * 3.0));
    size = 0.8;
    col = mix(uBunch, vec3(1.0, 0.86, 0.6), clamp(flash * 1.5, 0.0, 1.0));
  } else if (k < 3.5) {
    // the flash at each of the crossing's collisions (position: its vertex; aE: how
    // many tracks it made): a core that blooms and dies, a thin shell running out
    if (te < 0.0) { off_(); return; }
    float core = aS < 0.5 ? 1.0 : 0.0;
    if (core > 0.5) p = position + aOff * uFlashR * (0.3 + 0.7 * ease(te / 0.25));
    else p = position + normalize(aOff + vec3(1e-4)) * uFlashR * 7.0 * ease(te / 1.4) * (0.9 + 0.1 * hash(aSeed * 3.0));
    a = core > 0.5 ? 0.32 * exp(-te * 2.2) * smoothstep(0.0, 0.03, te) : 0.14 * (1.0 - smoothstep(0.2, 1.4, te)) * smoothstep(0.0, 0.05, te);
    a *= fade * aE;
    size = core > 0.5 ? 1.3 : 0.9;
    col = mix(vec3(1.0, 0.95, 0.85), uTrack, 0.25 * hash(aSeed * 5.0));
  } else if (k < 5.5) {
    // a particle's trail: a grain lights when the particle reaches it (aS: its path
    // from the vertex, in units) and dims behind it to what stays (aW: how much of it
    // the detector saw)
    float head = uVT * te;
    float d = head - aS;
    if (te < 0.0 || d < 0.0) { off_(); return; }
    float tail = uTailLen * (0.4 + 0.6 * uTail);
    float glow = exp(-d / tail);
    float tip = exp(-d / 0.025);                   // the head: the last few grains
    float stays = (k > 4.5 ? 0.62 : 0.42) * (1.0 - 0.2 * smoothstep(3.0, 9.0, te));
    p = position;
    // two hundred and ninety trails leave one line of vertices: their first grains
    // are dimmed so the sparks leaving it stay apart
    float near = mix(0.06, 1.0, smoothstep(0.0, uNear, aS));
    // in the freeze a head is a still, sharp spark; at speed, a brighter one
    float motion = mix(0.55, 1.0, smoothstep(0.08, 0.7, uTail));
    a = (stays + (0.75 - stays) * glow * motion) * fade * aW * near;
    size = (k > 4.5 ? 1.25 : 1.0) * (1.0 + 0.35 * tip);
    col = mix(k > 4.5 ? uMuon : uTrack, vec3(1.0), 0.75 * tip + 0.35 * glow * motion + 0.1 * hash(aSeed * 11.0));
  } else {
    // a calorimeter cell taking its energy: lit when light from the crossing gets
    // there, the deposit grows out of the cell's front along it, flares and settles
    float u = te - aS / uVT;
    if (u < 0.0) { off_(); return; }
    p = position + aOff * ease(u / 0.45);
    a = (0.7 * exp(-u * 1.1) * smoothstep(0.0, 0.04, u) + 0.8 * smoothstep(0.0, 0.3, u) * (1.0 - 0.15 * smoothstep(4.0, 9.0, te))) * fade * aW;
    a *= 1.0 - 0.6 * aE;                          // a shower is brightest where it starts (aE: how far along it)
    size = 1.0;
    col = mix(k < 6.5 ? uEcal : uHcal, vec3(1.0), 0.55 * exp(-u * 2.5));
  }
  if (a <= 0.002) { off_(); return; }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  if (k < 2.5) a *= smoothstep(0.3, 1.4, -mv.z);
  // nothing lit draws right at the lens: its grains are spaced for the distance the
  // shot keeps (a metre and a half in the freeze, more after), and closer they part
  // into beads
  else if (k > 3.5) a *= smoothstep(0.5, 1.1, -mv.z);
  // a spike seen end on piles its grains onto one spot, which blooms: dim it there
  if (k > 5.5) a *= 1.0 - 0.75 * pow(abs(dot(normalize(mat3(modelViewMatrix) * aOff + vec3(1e-5)), normalize(mv.xyz))), 6.0);
  gl_Position = projectionMatrix * mv;
  // a grain is a few pixels at any distance: a little larger close, a little
  // smaller far off, never a blur
  float px = uFrame * uGrain * size * clamp(sqrt(uDist / max(-mv.z, 0.05)), 0.85, 1.35);
  gl_PointSize = max(1.0, px);
  vPx = gl_PointSize;
  float tw = 0.85 + 0.15 * sin(uTime * (1.3 + aSeed * 2.1) + aSeed * 37.0);
  vColor = col;
  vAlpha = a * tw * min(1.0, px * px);            // under a pixel: fainter, not larger
}`;

// a hard grain: full to its edge, the edge one pixel wide
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha, vPx;
void main() {
  float r = length(gl_PointCoord - 0.5) * vPx;
  float a = clamp(0.5 * vPx - r + 0.5, 0.0, 1.0) * vAlpha;
  gl_FragColor = vec4(pow(max(vColor * a, vec3(1e-6)), vec3(2.2)), 1.0);
}`;

export function buildCmsCollision(o, ctx, bus, load) {
  const rnd = mulberry32(o.seed ?? 20120527);
  const S = o.scale ?? 1;
  const vB = o.bunch ?? 8, vT = o.light ?? 1.6, approach = o.approach ?? 3.32;
  const pipeL = o.pipe ?? 26, pipeR = o.pipeR ?? 0.05;
  // the grain budget for this device's tier (the engine's, else a guess from the pointer)
  const budget = ctx.budget ?? (globalThis.matchMedia?.('(pointer: coarse)').matches ? 60000 : 300000);
  const f = Math.max(0.12, Math.min(1, budget / 300000));
  // CMS's frame to the world's: its beam (z) along x, where the bunches run, y up, and
  // x turned to -z, a rotation (not a mirror), so every curl keeps its hand
  const W = (p) => [p[2] * S, p[1] * S, -p[0] * S];

  const uni = {
    uTime: { value: 0 }, uFrame: { value: 1 }, uStart: { value: -1 }, uTc: { value: 0 }, uHide: { value: -1 },
    uVB: { value: vB }, uVT: { value: vT }, uTail: { value: 1 }, uFlashR: { value: (o.flash ?? 0.012) * S },
    uGrain: { value: o.grain ?? 1.8 }, uNear: { value: 0.25 * S }, uTailLen: { value: 0.18 * S }, uDist: { value: 4 * S },
    uBunch: { value: lin(o.bunchColor || '#7fb6ff') }, uTrack: { value: lin(o.tone || '#ffc05a') },
    uMuon: { value: lin(o.muonTone || '#ffe2a8') }, uEcal: { value: lin(o.ecalTone || '#ffd9a0') }, uHcal: { value: lin(o.hcalTone || '#9cc4ff') },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uni, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
  const geo = new BufferGeometry();
  const pts = new Points(geo, mat); pts.frustumCulled = false; pts.visible = false;
  const g = new Group(); g.add(pts);
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);

  let settleAfter = 0, ready = false;
  const fill = (ev) => {
    const { pvs, tracks, deposits } = cmsPaths(ev, { calo: o.calo });
    const pvW = pvs.map((v) => W(v.at));
    // grains along a path, a gap apart: fine near the vertex, where the camera stands
    // close in the freeze, wider out where it has pulled back by the time they light
    // (by the time a trail is two metres out, the camera stands five from the vertex),
    // so a trail reads as one unbroken line at every distance it is seen from
    const gap = (s, k = 1) => k * (0.0025 + 0.003 * Math.min(s / S, 2)) * S / f;
    const grainsAlong = (L, k) => { let n = 0; for (let s = 0; s < L; s += gap(s, k)) n++; return n; };
    for (const t of tracks) {
      t.P = t.pts.map(W);
      t.cum = [0];
      for (let i = 1; i < t.P.length; i++) t.cum.push(t.cum[i - 1] + Math.hypot(t.P[i][0] - t.P[i - 1][0], t.P[i][1] - t.P[i - 1][1], t.P[i][2] - t.P[i - 1][2]));
      t.k = t.muon ? 0.7 : 1;
      t.n = grainsAlong(t.cum[t.cum.length - 1], t.k);
    }
    // a deposit's length along its cell grows with its energy, as event displays draw
    // towers; as its square root, so the many small ones still show beside the few large
    const reachOf = (d) => Math.hypot(...W(d.at).map((v, i) => v - (pvW[0] || [0, 0, 0])[i]));
    const towerOf = (d) => (d.kind[0] === 'E' ? Math.min(0.5, 0.12 * Math.sqrt(d.E)) : Math.min(1.0, 0.2 * Math.sqrt(d.E))) * S;
    const splashPer = (d) => Math.max(6, Math.min(Math.round(240 * f), Math.round(towerOf(d) / (0.008 * S) * f)));
    const nFlash = pvs.reduce((a, v) => a + Math.round((40 + 8 * v.n) * f), 0);
    const N = { bunch: Math.round(6000 * f), pipe: Math.round(9000 * f) };
    const total = 2 * N.bunch + N.pipe + nFlash + tracks.reduce((a, t) => a + t.n, 0) + deposits.reduce((a, d) => a + splashPer(d), 0);

    const pos = new Float32Array(total * 3), off = new Float32Array(total * 3);
    const kind = new Float32Array(total), seed = new Float32Array(total), sA = new Float32Array(total), eA = new Float32Array(total), wA = new Float32Array(total);
    let n = 0;
    const put = (k, p, o3, s, e, w = 1) => {
      pos[n * 3] = p[0]; pos[n * 3 + 1] = p[1]; pos[n * 3 + 2] = p[2];
      off[n * 3] = o3[0]; off[n * 3 + 1] = o3[1]; off[n * 3 + 2] = o3[2];
      kind[n] = k; seed[n] = rnd(); sA[n] = s; eA[n] = e; wA[n] = w; n++;
    };
    // bunches: gaussian needles, 0.6 long and 0.016 wide (σ), a brighter core
    for (const k of [KIND.bunchA, KIND.bunchB]) {
      for (let i = 0; i < N.bunch; i++) {
        const gx = gauss(rnd), gy = gauss(rnd), gz = gauss(rnd);
        const core = Math.exp(-(gx * gx + gy * gy + gz * gz) / 2);
        put(k, [0, 0, 0], [gx * 0.6, gy * 0.016, gz * 0.016], 0, core);
      }
    }
    // the beam pipe: grains on its wall, denser near the vertex
    for (let i = 0; i < N.pipe; i++) {
      const u = rnd() * 2 - 1, x = Math.sign(u) * Math.pow(Math.abs(u), 1.6) * pipeL, ph = rnd() * Math.PI * 2;
      put(KIND.pipe, [x, Math.cos(ph) * pipeR, Math.sin(ph) * pipeR], [0, 0, 0], 0, 0);
    }
    // the flash: every collision of the crossing, its core (an eighth) and its shell,
    // brighter for more tracks
    const most = Math.max(1, ...pvs.map((v) => v.n));
    pvs.forEach((v, j) => {
      const m = Math.round((40 + 8 * v.n) * f), w = 0.35 + 0.65 * Math.sqrt(v.n / most);
      for (let i = 0; i < m; i++) {
        const core = rnd() < 0.12;
        const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z);
        const r = core ? Math.cbrt(rnd()) * 0.5 : 1;
        put(KIND.flash, pvW[j], [q * Math.cos(ph) * r, z * r, q * Math.sin(ph) * r], core ? 0 : 1, w);
      }
    });
    // the trails: grains a gap apart along each path, each nudged a little along it;
    // aS the path from the vertex (where the flash is); the Higgs candidate's two
    // electrons a little brighter (its muons are drawn as muons)
    let lastStop = 0;
    for (const t of tracks) {
      const pv = pvW[t.pv] || pvW[0] || [0, 0, 0], P = t.P, cum = t.cum, L = cum[cum.length - 1];
      const start = Math.hypot(P[0][0] - pv[0], P[0][1] - pv[1], P[0][2] - pv[2]);
      let j = 0, s = 0;
      for (let i = 0; i < t.n; i++) {
        const at = Math.min(L, s + (rnd() - 0.5) * 0.4 * gap(s, t.k));
        while (j < cum.length - 2 && cum[j + 1] < at) j++;
        const w = (at - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
        const jit = 0.0006 * S;
        const p = [0, 1, 2].map((c) => P[j][c] + (P[j + 1][c] - P[j][c]) * w + (rnd() - 0.5) * jit);
        const seen = t.seen[j] + (t.seen[j + 1] - t.seen[j]) * w;
        put(t.muon ? KIND.muon : KIND.track, p, [0, 0, 0], start + at, 0, seen * (t.electron ? 1.4 : 1));
        s += gap(s, t.k);
      }
      lastStop = Math.max(lastStop, start + L);
    }
    // the calorimeters' cells: a spike of grains from the cell's front along it (a
    // tower as wide as the cell, 2–30 cm, was a haze of sparse grains), lit when
    // light from the crossing reaches it
    for (const d of deposits) {
      const at = W(d.at), dir = W(d.dir).map((v) => v / S), m = splashPer(d), L = towerOf(d), wide = Math.min(0.012, 0.15 * d.wide) * S;
      // two directions across the cell
      const a = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = [dir[1] * a[2] - dir[2] * a[1], dir[2] * a[0] - dir[0] * a[2], dir[0] * a[1] - dir[1] * a[0]];
      const l1 = Math.hypot(...e1); for (let c = 0; c < 3; c++) e1[c] /= l1;
      const e2 = [dir[1] * e1[2] - dir[2] * e1[1], dir[2] * e1[0] - dir[0] * e1[2], dir[0] * e1[1] - dir[1] * e1[0]];
      const reach = reachOf(d), ecal = d.kind[0] === 'E';
      for (let i = 0; i < m; i++) {
        const t = (i + rnd()) / m * L, x = (rnd() - 0.5) * wide, y = (rnd() - 0.5) * wide;
        put(ecal ? KIND.ecal : KIND.hcal, at, [0, 1, 2].map((c) => dir[c] * t + e1[c] * x + e2[c] * y), reach, t / L, ecal ? 0.85 : 0.8);
      }
      lastStop = Math.max(lastStop, reach);
    }
    for (const [key, arr, sz] of [['position', pos, 3], ['aOff', off, 3], ['aKind', kind, 1], ['aSeed', seed, 1], ['aS', sA, 1], ['aE', eA, 1], ['aW', wA, 1]]) geo.setAttribute(key, new BufferAttribute(arr.subarray(0, n * sz), sz));
    // when the last particle stops (engine-s after the crossing), and its splash fades
    settleAfter = lastStop / vT + 2.5;
    pts.visible = true; ready = true;
  };
  load().then((m) => fill(m.default ?? m), (e) => { console.warn('lhc-collision: the CMS event did not load', e); ready = true; });

  const run = collisionRun(o, ctx, bus, uni, approach, () => settleAfter);
  mat.addEventListener('dispose', run.dispose);
  return { group: g, labels: [], api: { busy: () => !ready || run.busy() }, frameScale: uni.uFrame, update: run.update, dispose: run.dispose };
}
