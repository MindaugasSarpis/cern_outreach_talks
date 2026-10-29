// dk-ground: the series floor (bible §3: "one floor"). A ground of fine dim grains on
// the plane y = FLOOR_Y, on a jittered grid, fading out toward its rim, so every heap,
// pile and histogram of the series stands on the same plane, and the rows running off
// to a horizon show the depth the camera moves through.
//
// Lifted from Užsikrauk karjerai's setup/piles.js:497-552 `floor` (OpenData's before
// it). It is renamed, because the lhcb plugin has a `floor`. It is recoloured to the
// palette's dim, the axis colour: the floor is the plane the axes lie in, never the
// crowd's light blue. It is seeded, and drawn on GRAIN_GLSL, so it obeys `steady` and
// the near fade.
//
//   { "type": "dk-ground", "pos": [0, 0, 0], "grains": 12000, "radius": 40 }
//
// Fields: radius (40), spacing (default: about `grains` points fill the disc), alpha
// (1.0: the dim colour is dark once the fragment's (c·a)^2.2 is applied), size (0.7,
// finer than a candidate's grain), tone ('axis', or 'crowd'), seed.
// With a `name` it steps (0 hidden, ≥ 1 shown, 1.2 s fades). Without one it is always
// there. `alpha` may be a list by step ([0, 1, 1, 2.4]: step k takes entry k, the last
// for any step past the list; entry 0 is ignored, the floor is hidden there): a floor that
// must read from close on one slide (T1 slide 13) without changing another slide's frame.
import { Group, Color } from 'three';
import { FLOOR_Y, SEED, roles } from './style.js';
import { mulberry32 } from './rng.js';

export const TYPE = 'dk-ground';
export const FIELDS = ['pos', 'grains'];
export const OWNER = 't1';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildGround(o, ctx, stage, kit), { fields: FIELDS, enterable: true });
}

let VERT = null;
const vert = (stage) => (VERT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed;
uniform float uShow, uAlpha, uSize, uRadius;
uniform vec3 uColor;
void main() {
  if (uShow <= 0.001) { hide(); return; }
  float r = length(position.xz) / uRadius;
  place(position, uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha * uShow, uColor, aSeed);
  // seen at a grazing angle the floor closes into a bright seam across the frame, and
  // far off into a horizon line: both fade (KJ's floor). The rim fades, so no edge shows.
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 wp = (modelMatrix * vec4(position, 1.0)).xyz;
  float graze = abs(cameraPosition.y - wp.y) / max(length(cameraPosition - wp), 1e-3);
  vAlpha *= (1.0 - smoothstep(0.55, 1.0, r)) * smoothstep(0.05, 0.16, graze) * (1.0 - smoothstep(55.0, 95.0, -mv.z));
}`);

function buildGround(o, ctx, stage) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, (o.pos?.[1] || 0) + FLOOR_Y, o.pos?.[2] || 0);
  const R = Number(o.radius ?? 40);
  const want = Math.max(500, Math.min(Number(o.grains ?? 12000), ctx.budget ?? 300000));
  const sp = Number(o.spacing ?? Math.sqrt((Math.PI * R * R) / want));
  const rnd = mulberry32((o.seed ?? SEED) * 31 + 7);
  const pts = [];
  for (let x = -R; x <= R; x += sp) for (let z = -R; z <= R; z += sp) {
    const jx = x + (rnd() - 0.5) * sp * 0.5, jz = z + (rnd() - 0.5) * sp * 0.5;
    if (jx * jx + jz * jz > R * R) continue;
    pts.push(jx, 0, jz);
  }
  const n = Math.min(pts.length / 3, want);
  const pos = new Float32Array(pts.slice(0, n * 3));
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i++) seed[i] = rnd();
  const tone = o.tone === 'crowd' ? P.crowd : P.axis;
  const alphas = Array.isArray(o.alpha) ? o.alpha.map(Number) : null;
  const alphaAt = (k) => (alphas ? alphas[Math.max(1, Math.min(alphas.length - 1, k || 1))] ?? 1 : Number(o.alpha ?? 1.0));
  const st0 = 1;
  const frameScale = { value: 1 };
  const mat = stage.grainMaterial(vert(stage), {
    uPixelRatio: frameScale,
    uShow: { value: o.name ? 0 : 1 }, uAlpha: { value: alphaAt(st0) }, uSize: { value: Number(o.size ?? 0.7) },
    uRadius: { value: R }, uColor: { value: new Color(tone) },
  });
  const geo = stage.grainGeometry(n, { position: pos, aSeed: [seed, 1] });
  g.add(stage.grainPoints(geo, mat));
  const u = mat.uniforms;
  const st = o.name ? stage.stepper(String(o.name)) : null;
  let from = u.uShow.value, to = from, t0 = -1, aFrom = u.uAlpha.value, aTo = aFrom, aT0 = -1;
  const FADE = 1.2;
  return {
    group: g, labels: [], frameScale,
    api: { busy: () => t0 >= 0 || aT0 >= 0, value: () => n },
    update(t) {
      u.uTime.value = t;
      if (st?.fresh) {
        st.fresh = false; from = u.uShow.value; to = st.step > 0 ? 1 : 0; t0 = from === to ? -1 : t;
        // the step's alpha: at once while the floor is hidden, else eased with the fade
        const a = alphaAt(st.step);
        if (from < 0.01) { u.uAlpha.value = a; aFrom = aTo = a; aT0 = -1; }
        else if (to > 0 && a !== aTo) { aFrom = u.uAlpha.value; aTo = a; aT0 = t; }
      }
      if (t0 >= 0) {
        const k = Math.min(1, (t - t0) / FADE);
        u.uShow.value = from + (to - from) * k * k * (3 - 2 * k);
        if (k >= 1) t0 = -1;
      }
      if (aT0 >= 0) {
        const k = Math.min(1, (t - aT0) / FADE);
        u.uAlpha.value = aFrom + (aTo - aFrom) * k * k * (3 - 2 * k);
        if (k >= 1) aT0 = -1;
      }
      g.visible = u.uShow.value > 0.001;
    },
    dispose() { st?.off(); geo.dispose(); mat.dispose(); },
  };
}
