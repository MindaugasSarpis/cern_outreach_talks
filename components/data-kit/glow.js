// dk-glow: bunch crossings as fronts running down the kit's LHCb detector, coming
// faster and faster until they merge into one steady glow (bible §5 Talk 1, "Forty
// million a second": a crossing every 25 ns, the whole detector read out at each).
//
// Ported from Užsikrauk karjerai's setup/detector.js `cascade` (the f(t) = f0·e^(rate·t)
// fronts, the merge, the sparkle of other collisions' hits). The kit detector's shader
// is the engine's and cannot take KJ's uniforms, so dk-glow is an overlay. It draws its
// own grains at the detector's grains (every k-th of the same geometry file, in the same
// frame) and adds only the fronts' light on top of the detector's own. Its event times
// go through eventLatch, so a step back or a later slide finds no front, glow or
// sparkle left over from it (KJ's Lessons 1: its slide 16 blinked).
//
//   { "type": "dk-glow", "name": "glow", "pos": [0, 0, 0], "of": "det", "src": "lhcb",
//     "grains": 46500, "f0": 0.6, "rate": 0.55, "speed": 6 }
//
// Fields:
// - of: the lhcb detector's name. When given, the overlay follows that detector's
//   world transform, so `pos` may stay [0, 0, 0].
// - src ('lhcb'): the geometry file, as the detector names it. The deck must name the
//   same src on its detector, so the build serves the file at stage-data/.
// - scale (0.5), stretch (2.4): the detector's frame, W(x, y, z) = [z·S, y·S·T, x·S·T].
// - f0 (0.6): fronts a second at step 1. One front is in the detector at a time.
// - rate (0.55): the e-folding rate of the frequency from step 2 on. The fronts merge
//   at about 2.2 a second, roughly 2.4 s after the step.
// - speed (6): the fronts' speed down the beam, in units a second (1.6 s to cross).
// - after (0): seconds from step 1 to the first front (a collision's debris first).
// - sharp (16): the front's thinness (the pulse's power).
// - alpha (0.9), size (1.2), seed. sparkle ('crowd'): the sparkle of hits in the crowd's
//   light blue; 'sel' whitens it (the look before 29 Oct).
//
// Colours: the fronts, the merged glow and its sparkle are the crowd (light blue): they
// stand for every crossing, and white is "ours / kept". The detector under it should be in the palette too, not the
// engine's lhcb PART_COLORS (royal and navy blues at the pipe, magnet, RICH and HCAL).
// In classic, give the detector object
//   "parts": { "preset": "lhcb", "velo": { "alpha": 0.25 }, "pipe": { "alpha": 0 },
//     "magnet": { "color": "#7dd3fc", "alpha": 0.25 }, "rich1": { "color": "#7dd3fc" },
//     "rich2": { "color": "#7dd3fc" }, "hcal": { "color": "#7dd3fc" } }
// (#7dd3fc is classic's accent: write the deck palette's accent in another palette).
//
// Steps: 0 off (fades out in 0.4 s) · 1 fronts at f0 · 2 the frequency grows until the
// fronts merge into a glow with a fine sparkle. A step back from 2 to 1 returns to
// single fronts at once. A slide opened directly at step 2 shows the glow at once.
// Never more than about 2.2 distinct flares a second on any grain, and the merged glow
// does not flicker (the broadcast flash rule).
// api.value(): the number of fronts sent so far, the crossings drawn. busy while the
// fronts are merging or the overlay fades. A steady train of fronts is a loop, not
// busy.
import { Group, Color, Matrix4 } from 'three';
import { SEED, roles } from './style.js';
import { mulberry32 } from './rng.js';

export const TYPE = 'dk-glow';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't1';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildGlow(o, ctx, stage, kit), { fields: FIELDS, enterable: true });
}

const DATA = { lhcb: 'stage-data/lhcb-grains.bin', 'lhcb-dense': 'stage-data/lhcb-grains-dense.bin' };
const OFF = 1e9;

let VERT = null;
const vert = (stage) => (VERT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aX, aSeed, aW;
uniform float uT0, uHideT, uT2, uF0, uR, uV, uAlpha, uSize, uSharp;
uniform vec3 uCrowd, uSel;
uniform float uSparkSel;
void main() {
  if (uT0 > 1e8 || aW <= 0.0) { hide(); return; }
  // a hide is quick (0.4 s), so the glow has gone before a camera leaving on the slide change is far
  float fade = uHideT > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 0.4, uTime - uHideT);
  // world-seconds since the first front reached this grain
  float tau = uTime - uT0 - aX / uV;
  if (tau < 0.0 || fade <= 0.0) { hide(); return; }
  // the crossings' phase: f0 a second until step 2, then f0·e^(r·t)
  float d2 = uT2 > 1e8 ? -1.0 : uTime - uT2 - aX / uV;
  float f = uF0, ph = uF0 * tau;
  if (d2 > 0.0) {
    float g = exp(min(uR * d2, 12.0));
    f = uF0 * g;
    ph = uF0 * (tau - d2) + uF0 * (g - 1.0) / uR;
  }
  float merged = smoothstep(1.0, 2.2, f);
  // the dense head (VELO, RICH1 round x = 0) lights all at once as a front starts: its
  // rise is softer (about 5 frames, not 2) and its weight lower, so the front starts as a
  // ramp, not a strobe at the vertex, and then runs down the detector at full strength
  float head = 1.0 - smoothstep(0.8, 3.5, aX);
  float rising = step(0.5, fract(ph - 0.25));
  float sh = uSharp * mix(1.0, mix(1.0, 0.3, head), rising);
  // a quarter period behind, so a grain's first front ramps up from dark (at tau = 0 the
  // phase was at a peak: every grain switched on at full pulse in one frame)
  float pulse = pow(0.5 + 0.5 * cos(6.2831853 * (ph - 0.25)), sh) * (1.0 - merged);
  // a different few grains each moment: hits of other crossings, fine, so no flash
  float spark = merged * step(0.992, hash(aSeed * 57.0 + floor(uTime * 6.0)));
  // a front is every crossing, the crowd: it stays light blue and is lifted by its
  // alpha, never whitened (white is the selected in the series grammar). Only the
  // sparse sparkle of hits stays the crowd's colour too (sparkle: 'sel' whitens it, the
  // old look): it stands for every crossing's hits, and white is "ours / kept".
  vec3 col = mix(uCrowd, uSel, clamp(0.25 * pulse + 0.1 * merged + spark * uSparkSel, 0.0, 1.0));
  // the merged glow is at least as bright as one front: forty million crossings, one glow
  float a = uAlpha * aW * mix(1.0, 0.55, head) * (1.4 * pulse + 0.95 * merged + 0.9 * spark) * fade;
  if (a <= 0.002) { hide(); return; }
  place(position, uSize * (1.0 + 0.25 * pulse), a, col, aSeed);
}`);

function buildGlow(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const S = Number(o.scale ?? 0.5), T = Number(o.stretch ?? 2.4);
  const frameScale = { value: 1 };
  const mat = stage.grainMaterial(vert(stage), {
    uPixelRatio: frameScale,
    uT0: { value: OFF }, uHideT: { value: OFF }, uT2: { value: OFF },
    uF0: { value: Number(o.f0 ?? 0.6) }, uR: { value: Number(o.rate ?? 0.55) }, uV: { value: Number(o.speed ?? 6) },
    uAlpha: { value: Number(o.alpha ?? 0.9) }, uSize: { value: Number(o.size ?? 1.2) }, uSharp: { value: Number(o.sharp ?? 16) },
    uCrowd: { value: new Color(P.crowd) }, uSel: { value: new Color(P.sel) }, uSparkSel: { value: o.sparkle === 'sel' ? 1 : 0 },
  });
  const u = mat.uniforms;
  let alive = true, geo = null, drawn = 0;
  const want = Math.max(1000, Math.min(Number(o.grains ?? 46500), ctx.budget ?? 300000));
  const build = (buf) => {
    if (!alive) return;
    const all = new Int16Array(buf);
    const total = all.length / 4;
    const k = Math.max(1, Math.ceil(total / want));
    const n = Math.floor(total / k);
    const pos = new Float32Array(n * 3), ax = new Float32Array(n), seed = new Float32Array(n), w = new Float32Array(n);
    const rnd = mulberry32((o.seed ?? SEED) * 7 + 3);
    for (let i = 0; i < n; i++) {
      const j = i * k * 4;
      const x = all[j] / 1000, y = all[j + 1] / 1000, z = all[j + 2] / 1000, part = all[j + 3];
      pos[3 * i] = z * S; pos[3 * i + 1] = y * S * T; pos[3 * i + 2] = x * S * T;
      ax[i] = z * S; seed[i] = rnd();
      // KJ's part weights: the beam pipe (1) not drawn (a stick when lit); the VELO (0),
      // packed round the vertex, dimmed (else a white-hot blob); the calorimeters and
      // muon walls (7-9), spread over the widest walls, a little stronger
      w[i] = part === 1 ? 0 : part === 0 ? 0.25 : part >= 7 ? 1.2 : 1;
    }
    geo = stage.grainGeometry(n, { position: pos, aX: [ax, 1], aSeed: [seed, 1], aW: [w, 1] });
    g.add(stage.grainPoints(geo, mat));
    drawn = n;
  };
  const src = DATA[o.src ?? 'lhcb'] || String(o.src);
  const url = ctx.asset ? ctx.asset('/' + src.replace(/^\//, '')) : '/' + src;
  fetch(url).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
    .then(build).catch((e) => console.warn(`dk-glow: ${url} failed (name src: lhcb on the deck's detector so the build serves it)`, e));

  // follow the detector's transform (the lhcb plugin names its group 'detector:<name>')
  let det = null, lookT = -1;
  const inv = new Matrix4();
  const follow = (t) => {
    if (!o.of) return;
    if (!det && t - lookT > 0.5) {
      lookT = t;
      let root = g;
      while (root.parent) root = root.parent;
      det = root.getObjectByName('detector:' + o.of) || null;
    }
    if (det && g.parent) {
      det.updateWorldMatrix(true, false);
      inv.copy(g.parent.matrixWorld).invert().multiply(det.matrixWorld);
      inv.decompose(g.position, g.quaternion, g.scale);
    }
  };

  const ev = stage.eventLatch(u, { start: 'uT0', hide: 'uHideT', also: ['uT2'], fade: 0.5 });
  const st = stage.stepper(name);
  let now = 0;
  const after = Number(o.after ?? 0);
  // seconds from step 2 until the fronts have merged everywhere: f reaches 2.2, plus a crossing
  const mergeIn = () => Math.log(2.2 / Math.max(1e-3, u.uF0.value)) / Math.max(1e-3, u.uR.value) + 10 * S / u.uV.value;
  const apply = () => {
    const k = st.step, prev = st.prev;
    if (k <= 0) { ev.stop(now); return; }
    const direct = prev <= 0 || !ev.on;
    if (k === 1) {
      if (direct) { u.uT2.value = OFF; ev.start(now, now + after); }
      else u.uT2.value = OFF;   // back from the glow: single fronts at once
      return;
    }
    // k ≥ 2: the glow
    if (direct) { ev.start(now, now - 100); u.uT2.value = now - 100; }
    else if (u.uT2.value > 1e8) u.uT2.value = now;
  };
  const api = {
    busy: () => (u.uHideT.value < 1e8) || (u.uT2.value < 1e8 && now - u.uT2.value < mergeIn()),
    // fronts sent so far (at the vertex)
    value() {
      const t0 = u.uT0.value;
      if (t0 > 1e8 || now < t0) return 0;
      const tau = now - t0, d2 = u.uT2.value > 1e8 ? -1 : now - u.uT2.value, f0 = u.uF0.value, r = u.uR.value;
      return Math.floor(d2 > 0 ? f0 * (tau - d2) + (f0 * (Math.exp(Math.min(r * d2, 12)) - 1)) / r : f0 * tau) + 1;
    },
    ready: () => drawn > 0,
  };
  kit.register(name, { type: TYPE, api });
  return {
    group: g, labels: [], frameScale, api,
    update(t) {
      now = t; u.uTime.value = t;
      if (st.fresh) { st.fresh = false; apply(); }
      ev.tick(t);
      follow(t);
      g.visible = u.uT0.value < 1e8 && drawn > 0;
    },
    dispose() { alive = false; st.off(); kit.unregister(name); geo?.dispose(); mat.dispose(); },
  };
}
