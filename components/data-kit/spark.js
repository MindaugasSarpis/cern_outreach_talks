// dk-spark: our grain (record 401 row 1) as the series marks it in every talk: a core of
// size 2.5 and a soft halo ring of fine grains round it, the core in the colour the
// grammar gives it on that slide (white while it is kept, light blue once it is
// background-like; bible §3). The marker is the ring, never a colour of its own.
//
// Lifted from MasterTalk's setup/route.js:271-330 `spark` (one dot, a place per step,
// gliding; `from` replays its move), ported to the kit: GRAIN_GLSL place() (the
// series' twinkle, size cap and near fade, `steady` respected), seeded, palette roles
// only, the size from style.js (OURS 2.5, the review's "a 4-5 px speck does not show
// one white dot"), and the halo ring added. The ring keeps one share of the frame
// whatever the camera's distance (like a tick label), so it marks the grain in a
// dense column as clearly from 30 units as from 5.
//
//   { "type": "dk-spark", "name": "ours", "pos": [0, 0, 0], "grains": 121,
//     "steps": [null, { "at": [0, 4, 0] }, { "on": "h", "color": "crowd" },
//               { "at": [3, 1, 0], "from": [0, 9, 0], "glide": 2 }] }
//
// A step is { at | on, from, glide, color, core, halo } (null or 0: hidden):
// - `at`: a place in the station's frame; `from`: where its move starts (a step with
//   `from` always plays its move, however the slide was reached); `glide` seconds.
// - `on`: a dk form's name (or a list: the first that shows our grain wins). The
//   spark follows that form's grain of our row each frame: dk-hist `api.ours()`,
//   dk-vertex `api.ours()`, dk-heap `api.posOf(row)`. Those forms draw the core
//   themselves at size 2.5, so a followed spark draws the halo only (`core: true`
//   draws a core over it as well).
// - `color`: 'sel' (white, the default) or 'crowd' (light blue): a role, never a hex.
//   A change of colour on a step eases over `colorTime` (0.8 s) after `colorAfter` (0 s):
//   T2's white core turning the crowd's light blue on T3's weights click, timed to the
//   whitening sweep reaching our grain. 'follow': the core takes the followed grain's own
//   colour each frame (dk-hist `api.whiteOf(row)`: 0.144 white after `{weights}`).
// - `ringColor` (object or step): the ring's role colour, 'sel' (white) by default whatever
//   the core's colour (bible §3: our grain's ring stays white, only the core changes);
//   'follow' makes the ring take the core's colour (the look before 29 Oct).
// - `halo`: false hides the ring on that step; an object { r, alpha } eases the ring's
//   radius (share of the frame's height, 0.028) and alpha (1.35) to those on that step
//   (a smaller ring where our grain sits on the axis next to a tick number).
// - `haloIn` (object or step, s, 0.5): how long the ring takes to come in; `haloGather`
//   (object or step): the ring's grains gather in from outside (from 2.4 × its radius)
//   instead of fading in place.
// - `delay` (s): a step that shows the spark from hidden waits that long (the ring comes
//   with the grains it marks, not on an empty axis).
// - `from` as a form's name (e.g. a dk-heap): the move starts at that form's grain of our
//   row now, and the spark draws its own core; with a dk-heap (`take`, default true) our
//   row leaves the pile as the spark lifts it (api.claim), and comes back on a step back.
import { Group, Vector3, Color, Matrix4 } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, roles } from './style.js';
import { mulberry32, gauss } from './rng.js';

export const TYPE = 'dk-spark';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't2';
export const files = () => [];

// the ring: radius as a share of the frame's height, grains in it, their size (× GRAIN)
// `ref`: the distance (units) at which a ring grain is drawn at `size`; further off it is
// drawn larger by d/ref, so the ring keeps its look (grain px, not only its radius) from
// any distance: a ring seen from 27 units is as solid as one seen from 13.
export const RING = { r: 0.028, n: 220, size: 0.95, ref: 13 };

let VERT = null;
const vert = (stage) => (VERT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aKind, aAng, aRad, aSeed;
uniform vec3 uAt, uColor, uRing;
uniform float uShow, uCore, uHalo, uSize, uHaloSize, uR, uCoreA, uHaloA, uGlow, uRef, uGather;
void main() {
  if (uShow <= 0.001) { hide(); return; }
  if (aKind < 0.5) {
    if (uCore <= 0.001) { hide(); return; }
    place(uAt, uSize * (1.0 + 0.6 * uGlow), uCoreA * uShow * uCore * (1.0 + uGlow), uColor, 0.37);
    return;
  }
  if (uHalo <= 0.001) { hide(); return; }
  // the camera's right and up in the form's frame (rows of the model-view rotation):
  // the ring faces the camera, its radius a fixed share of the frame's height
  vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
  vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
  vec4 c = modelViewMatrix * vec4(uAt, 1.0);
  float d = max(-c.z, 0.2);
  float breathe = 1.0 + 0.04 * uTwinkle * sin(uTime * 1.3 + aSeed * 3.0);
  float r = uR * 2.0 * d / projectionMatrix[1][1] * (1.0 + 0.09 * aRad) * breathe * mix(1.0, 1.6, uGlow) * (1.0 + 1.4 * uGather);
  float a = aAng + 0.12 * uTime;
  vec3 p = uAt + (cos(a) * right + sin(a) * up) * r;
  float soft = exp(-0.5 * aRad * aRad);
  place(p, uHaloSize * max(1.0, d / uRef), uHaloA * soft * uShow * uHalo, uRing, aSeed);
}`);

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildSpark(o, ctx, stage, kit), { fields: FIELDS });
}

function buildSpark(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const halo = { ...RING, ...(o.halo && typeof o.halo === 'object' ? o.halo : {}) };
  const nH = Math.max(12, Math.round(halo.n));
  const n = 1 + nH;
  const rnd = mulberry32((o.seed ?? SEED) * 17 + 3);
  const kind = new Float32Array(n), ang = new Float32Array(n), rad = new Float32Array(n), seed = new Float32Array(n);
  for (let i = 1; i < n; i++) {
    kind[i] = 1;
    ang[i] = ((i - 1 + 0.6 * (rnd() - 0.5)) / nH) * Math.PI * 2;
    rad[i] = Math.max(-2.5, Math.min(2.5, gauss(rnd)));
    seed[i] = rnd();
  }
  const colorOf = (c) => new Color(c === 'crowd' ? P.crowd : P.sel);
  const mat = stage.grainMaterial(vert(stage), {
    uAt: { value: new Vector3() }, uColor: { value: colorOf(o.color) }, uRing: { value: colorOf(o.ringColor === 'follow' ? o.color : o.ringColor ?? 'sel') },
    uShow: { value: 0 }, uCore: { value: 1 }, uHalo: { value: 1 }, uGlow: { value: 0 }, uGather: { value: 0 },
    uSize: { value: Number(o.size ?? OURS) }, uHaloSize: { value: Number(halo.size) * GRAIN },
    uR: { value: Number(halo.r) }, uRef: { value: Math.max(1, Number(halo.ref)) }, uCoreA: { value: Number(o.alpha ?? 1.0) }, uHaloA: { value: Number(o.haloAlpha ?? 1.35) },
  });
  const u = mat.uniforms;
  const geo = stage.grainGeometry(n, { aKind: [kind, 1], aAng: [ang, 1], aRad: [rad, 1], aSeed: [seed, 1] });
  g.add(stage.grainPoints(geo, mat));

  const steps = Array.isArray(o.steps) && o.steps.length ? o.steps : [null, { at: [0, 0, 0] }];
  const stepAt = (k) => { const s = steps[Math.max(0, Math.min(steps.length - 1, k))]; return s && typeof s === 'object' ? s : null; };
  const st = stage.stepper(name);
  const v = new Vector3(), from = new Vector3(NaN, NaN, NaN), to = new Vector3(), inv = new Matrix4();
  let now = 0, want = st.step ?? 0, lastK = 0, armed = false, armT = 0;
  let cur = null, t0 = -1e9, glide = 0.01, show = 0, showTo = 0, coreTo = 1, haloTo = 1, core = 1, haloV = 1;
  let following = false, found = true, colorA = colorOf(o.color), colorB = colorOf(o.color), colT0 = -1e9, colDur = 0.8;
  let followColor = o.color === 'follow', followW = null, ringOwn = o.ringColor !== 'follow';
  let ringA = colorOf(o.ringColor === 'follow' ? o.color : o.ringColor ?? 'sel'), ringB = ringA.clone(), ringT0 = -1e9;
  // the ring's radius and alpha per step ({ halo: { r, alpha } }), eased over 0.6 s
  const R0 = Number(halo.r), A0 = Number(o.haloAlpha ?? 1.35);
  let rFrom = R0, rTo = R0, aFrom = A0, aTo = A0, hT0 = -1e9;
  let haloIn = Number(o.haloIn ?? 0.5), gatherOn = !!o.haloGather, showAt = -1e9;
  let taken = null;       // a form our row was lifted out of ({ from: '<heap>' }): released on the next step
  const crowdC = new Color(P.crowd), selC = new Color(P.sel), tmpC = new Color();

  // where the followed form shows our grain now (station frame), or null
  const followed = (s, out) => {
    const names = Array.isArray(s.on) ? s.on : [s.on];
    const row = s.row ?? OURS_ROW;
    for (const nm of names) {
      const f = kit.form(nm);
      if (!f) continue;
      const a = f.api;
      const p = (a.ours && a.ours(v)) || (a.posOf && a.posOf(row, v)) || (a.pointOf && a.pointOf(row, v));
      if (p) {
        // the grain's own whiteness, for color 'follow' (a form without whiteOf: its tone)
        const wv = a.whiteOf ? a.whiteOf(row) : null;
        followW = wv == null ? followW : wv;
        g.updateWorldMatrix(true, false); inv.copy(g.matrixWorld).invert(); return out.copy(p).applyMatrix4(inv);
      }
    }
    return null;
  };

  function apply(k, kind) {
    const s = stepAt(k);
    lastK = k;
    cur = s;
    const wasShown = show > 0.05;
    showTo = s ? 1 : 0;
    if (taken && !(s && typeof s.from === 'string' && s.from === taken.name)) { taken.api.release?.(name); taken = null; }
    if (!s) return;
    const instant = kind === 'back' || (kind === 'arrive' && !s.from);
    following = s.on != null;
    const fromForm = typeof s.from === 'string' ? kit.form(s.from) : null;
    coreTo = s.core != null ? (s.core ? 1 : 0) : following ? 0 : 1;
    haloTo = s.halo === false ? 0 : 1;
    haloIn = Math.max(0.05, Number(s.haloIn ?? o.haloIn ?? 0.5));
    gatherOn = !!(s.haloGather ?? o.haloGather);
    showAt = !wasShown && !instant && s.delay ? now + Math.max(0, Number(s.delay)) : -1e9;
    // from hidden, the ring comes in over `haloIn` (with the core's fade, or gathering)
    if (!wasShown && haloTo > 0) haloV = 0;
    {
      const hc = s.halo && typeof s.halo === 'object' ? s.halo : {};
      const r = Number(hc.r ?? R0), a = Number(hc.alpha ?? A0);
      if (r !== rTo || a !== aTo) {
        rFrom = instant ? r : u.uR.value; aFrom = instant ? a : u.uHaloA.value; rTo = r; aTo = a; hT0 = instant ? -1e9 : now;
      }
    }
    const cw = s.color ?? o.color;
    followColor = cw === 'follow';
    if (!followColor) {
      const c = colorOf(cw);
      if (!c.equals(colorB)) {
        colorA = u.uColor.value.clone(); colorB = c;
        colT0 = instant ? -1e9 : now + Math.max(0, Number(s.colorAfter ?? 0)); colDur = Math.max(0.05, Number(s.colorTime ?? 0.8));
      }
    } else colorB = u.uColor.value.clone();
    const rw = s.ringColor ?? o.ringColor ?? 'sel';
    ringOwn = rw !== 'follow';
    if (ringOwn) { const c = colorOf(rw); if (!c.equals(ringB)) { ringA = u.uRing.value.clone(); ringB = c; ringT0 = instant ? -1e9 : now; } }
    if (fromForm) {
      // from a form's grain of our row (where it is now), lifted out of it
      const p = (fromForm.api.ours && fromForm.api.ours(v)) || (fromForm.api.posOf && fromForm.api.posOf(s.row ?? OURS_ROW, v));
      if (p) { g.updateWorldMatrix(true, false); inv.copy(g.matrixWorld).invert(); from.copy(p).applyMatrix4(inv); }
      else from.set(NaN, NaN, NaN);
      if (s.take !== false && fromForm.api.claim && !instant) {
        const row = Number(s.row ?? OURS_ROW), gone = new Float32Array(row + 1).fill(1e9);
        gone[row] = now; fromForm.api.claim(gone, name); taken = { name: s.from, api: fromForm.api };
      }
      if (s.core == null) coreTo = 1;
    } else if (Array.isArray(s.from)) from.set(...s.from);
    else if (show > 0.05 && !instant) from.copy(u.uAt.value);
    else from.set(NaN, NaN, NaN);
    if (!following) to.set(...(s.at || [0, 0, 0]));
    // a step with `from` always plays its move; one without glides on from where it stands
    glide = s.from ? Number(s.glide ?? 2.5) : Number.isNaN(from.x) ? 0.01 : Number(s.glide ?? (following ? 1.0 : 2.5));
    t0 = now;
  }
  const request = (k) => { want = k; if (!armed) apply(k, k < lastK ? 'back' : 'fwd'); };

  const api = {
    arm() { armed = true; armT = now; show = 0; u.uShow.value = 0; },
    assemble(t, onDone) { now = t; armed = false; show = 0; apply(want, 'arrive'); onDone?.(); },
    busy: () => armed || now - t0 < glide || now < showAt || Math.abs(show - showTo * (found ? 1 : 0)) > 0.01 || (!followColor && now < colT0 + colDur) || now < hT0 + 0.6 || (showTo * (found ? 1 : 0) > 0 && Math.abs(haloV - haloTo) > 0.01),
    value: () => 0,
    ready: () => true,
    // where the marker is now (world), or null while hidden
    ours(out = new Vector3()) {
      if (show < 0.05) return null;
      g.updateWorldMatrix(true, false);
      return out.copy(u.uAt.value).applyMatrix4(g.matrixWorld);
    },
  };
  kit.register(name, { type: TYPE, api });

  return {
    group: g, api, frameScale: u.uPixelRatio,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      u.uTime.value = t;
      if (st.fresh) { st.fresh = false; request(st.step); }
      if (armed && now - armT > 6) { armed = false; apply(want, 'arrive'); }
      // where: a fixed place, or the followed grain; a glide eases from `from` to it
      let target = to;
      found = true;
      if (cur && following) {
        const p = followed(cur, v);
        found = !!p;
        if (p) target = p;
      }
      const f = Math.min(1, Math.max(0, (t - t0) / glide)), e = f * f * (3 - 2 * f);
      if (cur && found) {
        if (Number.isNaN(from.x) || f >= 1) u.uAt.value.copy(target);
        else u.uAt.value.lerpVectors(from, target, e);
      }
      // show: fades with the step, and while a followed grain is not drawn
      const visible = armed || t < showAt ? 0 : showTo * (found ? 1 : 0);
      show += Math.sign(visible - show) * Math.min(Math.abs(visible - show), dt / 0.5);
      u.uShow.value = show;
      core += Math.sign(coreTo - core) * Math.min(Math.abs(coreTo - core), dt / 0.4);
      // the ring's own fade: over `haloIn` (it starts once the spark shows), gathering in
      // from outside with `haloGather` (its grains whole from the start, the radius closing)
      const hv = visible > 0 ? haloTo : haloV;
      haloV += Math.sign(hv - haloV) * Math.min(Math.abs(hv - haloV), dt / haloIn);
      const ee = haloV * haloV * (3 - 2 * haloV);
      u.uCore.value = core; u.uHalo.value = gatherOn ? Math.min(1, 0.3 + 0.7 * ee) * (haloTo > 0 || haloV > 0 ? 1 : 0) * Math.min(1, haloV * 4) : haloV;
      u.uGather.value = gatherOn ? Math.pow(1 - ee, 2) : 0;
      {
        const kh = Math.min(1, Math.max(0, (t - hT0) / 0.6)), eh = kh * kh * (3 - 2 * kh);
        u.uR.value = rFrom + (rTo - rFrom) * eh; u.uHaloA.value = aFrom + (aTo - aFrom) * eh;
      }
      if (followColor && followW != null) {
        // the followed grain's own colour, eased so a recolour sweep reads as one change
        tmpC.copy(crowdC).lerp(selC, followW);
        u.uColor.value.lerp(tmpC, Math.min(1, dt * 8));
      } else if (!followColor) {
        const kc = Math.min(1, Math.max(0, (t - colT0) / colDur));
        u.uColor.value.copy(colorA).lerp(colorB, kc * kc * (3 - 2 * kc));
      }
      if (ringOwn) {
        const kr = Math.min(1, Math.max(0, (t - ringT0) / 0.8));
        u.uRing.value.copy(ringA).lerp(ringB, kr * kr * (3 - 2 * kr));
      } else u.uRing.value.copy(u.uColor.value);
      // a short glow as a move ends (the grain arriving)
      const since = t - (t0 + glide);
      u.uGlow.value = glide > 0.05 && since >= 0 && since < 1.2 ? Math.exp(-since * 4) : 0;
    },
    dispose() { st.off(); taken?.api.release?.(name); kit.unregister(name); geo.dispose(); mat.dispose(); },
  };
}
