// The opening's collision: one real LHCb crossing, drawn as grains in the black.
//
//   { type: lhc-collision, name, pos?, event (the compact event, see event.js),
//     approach?: 3.32 (engine-s from the start to the crossing), bunch?: 8 (units/s),
//     light?: 5.5 (units/s: how fast the debris runs out), scale?: 0.5 (units per metre
//     along the beam), stretch?: 2.4 (transverse, as event displays draw LHCb's tracks),
//     pipe?: 26 (half length of the drawn beam pipe), tone?: track colour }
//
// Step 1 starts it: two bunches of protons, needles of blue light (a bunch is
// centimetres long and a few hundredths of a millimetre wide), run in along the
// beam pipe from both ends and light its wall as they pass. They cross at the
// object's origin; each primary vertex of the event flashes, the bunches fly on
// through each other (almost every proton misses), and the event's tracks grow
// out of their vertices at the speed of light: a bright head and a comet's tail
// for each particle, leaving a trail that stays, bending where LHCb's magnet bends
// it, until it stops in the calorimeter (a splash of the energy it carried) or,
// a muon, runs on through the muon stations. Step 0 lets it fade.
//
// Everything is a function of the engine clock t: slow the world (space.rate)
// and the bunches, the flash and every particle slow with it. The tails grow
// with the rate, so a speed-up streaks. api.busy is true from the start until the
// last particle has stopped and the flash has faded.
import { BufferGeometry, BufferAttribute, Points, Group, ShaderMaterial, AdditiveBlending, Color, Vector3 } from 'three';
import { trajectories } from './event.js';

const KIND = { bunchA: 0, bunchB: 1, pipe: 2, flash: 3, track: 4, muon: 5, splash: 6 };

const VERT = /* glsl */ `
attribute float aKind, aSeed, aS, aE, aW;
attribute vec3 aOff;
uniform float uTime, uPixelRatio, uStart, uTc, uHide, uVB, uVT, uTail, uPipeR, uFlashR;
uniform vec3 uPV[4];
uniform float uNPV;
uniform vec3 uBunch, uTrack, uMuon, uSplash;
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vAlpha = 0.0; vColor = vec3(0.0); }
// where the two bunches' centres are along x (A comes in from -x, B from +x)
float bunchX(float side) { return side * uVB * (uTime - uTc); }
void main() {
  if (uStart < 0.0) { off_(); return; }
  float te = uTime - uTc;                         // engine-s since the crossing (negative before)
  float fade = uHide < 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.6, uTime - uHide);
  float on = smoothstep(0.0, 0.5, uTime - uStart) * fade;
  vec3 p; float a = 0.0; float size = 1.0; vec3 col;
  float k = aKind;
  if (k < 1.5) {
    // a bunch: a needle of light along the beam, streaked by its speed; after the
    // crossing it flies on and fades
    float side = k < 0.5 ? 1.0 : -1.0;
    float cx = bunchX(side);
    float streak = 1.0 + uTail * 0.6;
    p = vec3(cx + aOff.x * streak, aOff.y, aOff.z);
    // past the crossing they dissolve within the freeze, as the first particles leave
    // (flying on through each other close to the camera they bloomed into two blots)
    float after = te > 0.0 ? 1.0 - smoothstep(0.0, 0.15, te) : 1.0;
    float far = 1.0 - smoothstep(18.0, 30.0, abs(cx));
    float overlap = 1.0 - 0.6 * exp(-cx * cx / 0.5);
    a = 0.11 * on * after * far * overlap * (0.6 + 0.4 * hash(aSeed * 7.0));
    size = 0.4 + 0.3 * aE;
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
    la += flash * 0.45 / (1.0 + p.x * p.x * 0.5);
    a = on * (0.012 + 0.3 * la) * (0.5 + 0.5 * hash(aSeed * 3.0));
    size = 0.5;
    col = mix(uBunch, vec3(1.0, 0.86, 0.6), clamp(flash * 1.5, 0.0, 1.0));
  } else if (k < 3.5) {
    // the flash at each primary vertex: a core that blooms and dies, with a thin
    // shell of light running out from it
    int i = int(aE + 0.5);
    vec3 pv = uPV[0];
    if (i == 1) pv = uPV[1]; else if (i == 2) pv = uPV[2]; else if (i == 3) pv = uPV[3];
    if (te < 0.0 || float(i) >= uNPV) { off_(); return; }
    float core = aS < 0.5 ? 1.0 : 0.0;           // aS 0: the core; 1: the shell
    if (core > 0.5) p = pv + aOff * uFlashR * (0.3 + 0.7 * ease(te / 0.25));
    else p = pv + normalize(aOff + vec3(1e-4)) * uFlashR * 7.0 * ease(te / 1.4) * (0.9 + 0.1 * hash(aSeed * 3.0));
    a = core > 0.5 ? 0.15 * exp(-te * 2.2) * smoothstep(0.0, 0.03, te) : 0.08 * (1.0 - smoothstep(0.2, 1.4, te)) * smoothstep(0.0, 0.05, te);
    a *= fade;
    size = core > 0.5 ? 0.9 : 0.45;
    col = mix(vec3(1.0, 0.95, 0.85), uTrack, 0.25 * hash(aSeed * 5.0));
  } else if (k < 5.5) {
    // a particle's trail: a grain lights when the particle reaches it (aS: its path
    // length from the vertex, in units) and dims behind it to what stays
    float head = uVT * te;
    float d = head - aS;
    if (te < 0.0 || d < 0.0) { off_(); return; }
    float stopAt = aE;                             // where the trail ends (it is drawn to there)
    float tail = 0.35 + 0.8 * uTail;
    float glow = exp(-d / tail);
    float stays = (k > 4.5 ? 0.5 : 0.32) * (1.0 - 0.25 * smoothstep(3.0, 9.0, te));
    p = position;
    // every path starts at a vertex: there two hundred trails share a point, and their
    // first grains are dimmed so the first sparks leaving it stay apart
    float near = mix(0.12, 1.0, smoothstep(0.0, 0.8, aS));
    // a head is a streak of light at speed and a faint sharp point when the world
    // stands still: in the freeze every head is on one shell round the vertex, and the
    // forward cone's hundred and fifty, bright, bloomed into one blot
    float motion = mix(0.2, 1.0, smoothstep(0.08, 0.7, uTail));
    a = (stays + (0.75 - stays) * glow * motion) * fade * aW * near;
    size = (k > 4.5 ? 0.85 : 0.6) * (1.0 + 0.8 * exp(-d / 0.12) * near * motion);
    col = mix(k > 4.5 ? uMuon : uTrack, vec3(1.0), 0.6 * exp(-d / 0.3) + 0.15 * hash(aSeed * 11.0));
  } else {
    // a splash where a particle stopped: the energy it carried, spread out
    float arrive = aS / uVT;
    float u = te - arrive;
    if (u < 0.0) { off_(); return; }
    float r = ease(u / 0.45) * aE;
    p = position + aOff * r;
    a = (0.8 * exp(-u * 0.9) * smoothstep(0.0, 0.04, u) + 0.1 * smoothstep(0.0, 0.3, u) * (1.0 - 0.5 * smoothstep(4.0, 9.0, te))) * fade * aW;
    size = 0.7;
    col = mix(uSplash, vec3(1.0), 0.5 * exp(-u * 2.5));
  }
  if (a <= 0.002) { off_(); return; }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  if (k < 2.5) a *= smoothstep(0.3, 1.4, -mv.z);
  gl_Position = projectionMatrix * mv;
  float tw = 0.8 + 0.2 * sin(uTime * (1.3 + aSeed * 2.1) + aSeed * 37.0);
  gl_PointSize = max(1.0, uPixelRatio * size * (72.0 / max(-mv.z, 0.1)));
  vColor = col;
  vAlpha = a * tw;
}`;

const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(max(vColor * a, vec3(1e-6)), vec3(2.2)), 1.0);
}`;

export const gauss = (rnd) => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577 / 2; };
export function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const lin = (hex) => new Color(hex).convertLinearToSRGB();

export function buildLhcCollision(o, ctx, bus) {
  const rnd = mulberry32(o.seed ?? 20121201);
  const S = o.scale ?? 0.5, T = o.stretch ?? 2.4;
  const vB = o.bunch ?? 8, vT = o.light ?? 5.5, approach = o.approach ?? 3.32;
  const pipeL = o.pipe ?? 26, pipeR = o.pipeR ?? 0.22;
  // the grain budget for this device's tier (the engine's, else a guess from the pointer)
  const budget = ctx.budget ?? (globalThis.matchMedia?.('(pointer: coarse)').matches ? 60000 : 300000);
  const f = Math.max(0.12, Math.min(1, budget / 300000));

  // the event: world positions along each particle's path (LHCb's z is our x, its y
  // is up, its x is our z; transverse distances stretched by T)
  const W = (x, y, z) => [z * S, y * S * T, x * S * T];
  const ev = o.event;
  const { tracks, pvs, deposits } = trajectories(ev, { step: 0.04 });
  const pvW = pvs.map((v) => W(v[0], v[1], v[2]));

  const N = { bunch: Math.round(9000 * f), pipe: Math.round(14000 * f), flash: Math.round(2500 * f) };
  const perUnit = 70 * f;                          // trail grains per unit of path
  let nTrail = 0;
  for (const t of tracks) {
    let len = 0;
    for (let i = 1; i < t.pts.length; i++) len += Math.hypot(...W(...t.pts[i]).map((v, j) => v - W(...t.pts[i - 1])[j]));
    t.lenW = len; t.n = Math.max(8, Math.round(len * perUnit * (t.muon ? 1.6 : 1)));
    nTrail += t.n;
  }
  const splashPer = (E) => Math.max(6, Math.min(Math.round(700 * f), Math.round(Math.sqrt(E / 1000) * 70 * f)));
  const nSplash = deposits.reduce((a, d) => a + splashPer(d.E), 0);
  const total = 2 * N.bunch + N.pipe + N.flash + nTrail + nSplash;

  const pos = new Float32Array(total * 3), off = new Float32Array(total * 3);
  const kind = new Float32Array(total), seed = new Float32Array(total), sA = new Float32Array(total), eA = new Float32Array(total), wA = new Float32Array(total);
  let n = 0;
  const put = (k, p, o3, s, e, w = 1) => {
    pos[n * 3] = p[0]; pos[n * 3 + 1] = p[1]; pos[n * 3 + 2] = p[2];
    off[n * 3] = o3[0]; off[n * 3 + 1] = o3[1]; off[n * 3 + 2] = o3[2];
    kind[n] = k; seed[n] = rnd(); sA[n] = s; eA[n] = e; wA[n] = w; n++;
  };
  // bunches: gaussian needles, 0.6 long and 0.035 wide (σ), a brighter core
  for (const k of [KIND.bunchA, KIND.bunchB]) {
    for (let i = 0; i < N.bunch; i++) {
      const gx = gauss(rnd), gy = gauss(rnd), gz = gauss(rnd);
      const core = Math.exp(-(gx * gx + gy * gy + gz * gz) / 2);
      put(k, [0, 0, 0], [gx * 0.6, gy * 0.035, gz * 0.035], 0, core);
    }
  }
  // the beam pipe: grains on its wall, denser near the vertex
  for (let i = 0; i < N.pipe; i++) {
    const u = rnd() * 2 - 1, x = Math.sign(u) * Math.pow(Math.abs(u), 1.6) * pipeL, ph = rnd() * Math.PI * 2;
    put(KIND.pipe, [x, Math.cos(ph) * pipeR, Math.sin(ph) * pipeR], [0, 0, 0], 0, 0);
  }
  // the flash: per vertex a core (a third) and a shell
  const nPV = Math.min(4, Math.max(1, pvW.length));
  for (let i = 0; i < N.flash; i++) {
    const pv = i % nPV, core = rnd() < 0.12;
    const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z);
    const r = core ? Math.cbrt(rnd()) * 0.5 : 1;
    put(KIND.flash, [0, 0, 0], [q * Math.cos(ph) * r, z * r, q * Math.sin(ph) * r], core ? 0 : 1, pv);
  }
  // the trails: grains spread along each path; aS the path length from the vertex
  // (a track that starts downstream, a V0's daughter, lights when light from its
  // vertex would get there); aE where the path ends
  for (const t of tracks) {
    const P = t.pts.map((q) => W(...q));
    const pv = pvW[t.pv] || pvW[0] || [0, 0, 0];
    const start = Math.hypot(P[0][0] - pv[0], P[0][1] - pv[1], P[0][2] - pv[2]);
    const cum = [0];
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], P[i][2] - P[i - 1][2]));
    const L = cum[cum.length - 1];
    let j = 0;
    for (let i = 0; i < t.n; i++) {
      const s = (i + rnd()) / t.n * L;
      while (j < cum.length - 2 && cum[j + 1] < s) j++;
      const w = (s - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
      const jit = 0.004 * (1 + s * 0.4);
      const p = [0, 1, 2].map((c) => P[j][c] + (P[j + 1][c] - P[j][c]) * w + (rnd() - 0.5) * jit);
      const seen = t.seen[j] + (t.seen[j + 1] - t.seen[j]) * w;
      put(t.muon ? KIND.muon : KIND.track, p, [0, 0, 0], start + s, start + L, seen);
    }
    t.endS = start + L; t.endW = P[P.length - 1];
  }
  // splashes: the calorimeters' deposits (the event's ECAL clusters, and the HCAL
  // energy along its charged tracks), lit when light from the crossing reaches them;
  // a shower is short along the beam and wide across it, the hadronic one wider
  for (const d of deposits) {
    const c = W(d.x, d.y, d.z), m = splashPer(d.E);
    const reach = Math.hypot(...c);
    const hcal = d.kind === 'hcal';
    const size = Math.min(hcal ? 1.0 : 0.7, (hcal ? 0.1 : 0.06) + (hcal ? 0.11 : 0.09) * Math.cbrt(d.E / 1000));
    for (let i = 0; i < m; i++) {
      const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.pow(rnd(), 0.7);
      put(KIND.splash, c, [z * r * (hcal ? 0.5 : 0.3), q * Math.cos(ph) * r, q * Math.sin(ph) * r], reach, size, hcal ? 0.7 : 1);
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  for (const [key, arr, sz] of [['aOff', off, 3], ['aKind', kind, 1], ['aSeed', seed, 1], ['aS', sA, 1], ['aE', eA, 1], ['aW', wA, 1]]) geo.setAttribute(key, new BufferAttribute(arr, sz));
  const pvU = [0, 1, 2, 3].map((i) => new Vector3(...(pvW[i] || [0, 0, 0])));
  const uni = {
    uTime: { value: 0 }, uPixelRatio: { value: 1 }, uStart: { value: -1 }, uTc: { value: 0 }, uHide: { value: -1 },
    uVB: { value: vB }, uVT: { value: vT }, uTail: { value: 1 }, uPipeR: { value: pipeR }, uFlashR: { value: o.flash ?? 0.09 },
    uPV: { value: pvU }, uNPV: { value: nPV },
    uBunch: { value: lin(o.bunchColor || '#7fb6ff') }, uTrack: { value: lin(o.tone || '#ffc05a') },
    uMuon: { value: lin(o.muonTone || '#ffb347') }, uSplash: { value: lin(o.splashTone || '#ffd9a0') },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uni, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
  const pts = new Points(geo, mat); pts.frustumCulled = false;
  const g = new Group(); g.add(pts);
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);

  // when the last particle stops (engine-s after the crossing), and the splashes fade
  const lastStop = Math.max(0, ...tracks.map((t) => t.endS), ...deposits.map((d) => Math.hypot(...W(d.x, d.y, d.z)))) / vT;
  const settleAfter = lastStop + 2.5;

  const run = collisionRun(o, ctx, bus, uni, approach, () => settleAfter);
  mat.addEventListener('dispose', run.dispose);
  return { group: g, labels: [], api: { busy: run.busy }, frameScale: uni.uPixelRatio, update: run.update, dispose: run.dispose };
}

// The run every collision shares, on its uniforms uTime, uStart, uTc, uHide and uTail:
// step 1 starts it (the run-in, the crossing `approach` engine-s later), step 0 lets
// it fade; the crossing and the fly-out (the world running again after it) are said
// on the bus, for the sound and the captions. settle(): engine-s from the crossing
// until the last particle has stopped and its splash has faded.
export function collisionRun(o, ctx, bus, uni, approach, settle) {
  let now = 0, crossedHeard = false, flewHeard = false, heardRate = 1;
  const go = (k) => {
    if (k) {
      uni.uStart.value = now; uni.uTc.value = now + approach; uni.uHide.value = -1; crossedHeard = false; flewHeard = false;
      bus.emit('start', { name: o.name, at: now, cross: now + approach, settle: now + approach + settle() });
    } else if (uni.uStart.value >= 0 && uni.uHide.value < 0) uni.uHide.value = now;
  };
  const off = bus.listen(o.name, go);
  if (bus.state.has(o.name)) queueMicrotask(() => go(bus.state.get(o.name)));

  const busy = () => {
    const s = uni.uStart.value;
    if (s < 0) return false;
    if (uni.uHide.value >= 0) return now - uni.uHide.value < 1.7;
    return now - uni.uTc.value < settle();
  };
  return {
    busy,
    update(t) {
      now = t; uni.uTime.value = t;
      const rate = ctx.rate ? ctx.rate() : 1;
      uni.uTail.value += (Math.min(3, rate) - uni.uTail.value) * 0.1;
      if (Math.abs(rate - heardRate) > 0.05) { heardRate = rate; bus.emit('rate', { name: o.name, rate }); }
      if (!crossedHeard && uni.uStart.value >= 0 && uni.uHide.value < 0 && t >= uni.uTc.value) {
        crossedHeard = true; bus.emit('cross', { name: o.name, at: t });
      }
      // the fly-out: the world running again after the crossing (at once, with no rate)
      if (crossedHeard && !flewHeard && uni.uHide.value < 0 && rate > 0.6) { flewHeard = true; bus.emit('flyout', { name: o.name, at: t }); }
    },
    dispose: off,
  };
}
