// Part III's world (owner, 21 Oct, in place of the `kt` station's gold seed and
// shells: "Europe map: CERN → Lithuania"): Europe as a faint map of grains, CERN
// at Geneva a bright point, threads of grains flowing from CERN out to points in
// the Member and Associate Member States (where firms supply it), Lithuania lit.
// The threads are a picture of flow, not data: their ends are drawn at random
// inside each state (public/data/europe.json, `ends`).
//
//   { type: europe, name: 'eu', pos, src: 'data/europe.json', scale?: 250 (km a unit),
//     spacing?: 4.5 (km between grains on a line), size?: 1, alpha?: 0.75 (the map), threadAlpha?: 0.6, threads?: 480 grains each,
//     lift?: 0.28, color?: '#b4ceff', hot?: '#dfe8ff', lit?: '#ffffff' }
//
// The map lies in the station's x–z plane, north toward −z, its origin at CERN.
// Data: Natural Earth 1:50m (public domain) coastlines and international land
// boundaries, cropped to 13° W–46° E, 29–72° N (and `far`: the coastlines beyond, to the
// frames' edges, hero/europe_map.py), in a Lambert azimuthal equal-area
// projection centred at 15° E 52° N, in km (made once from the GeoJSON of v5.1.2).
//
// Steps from <Grains :set="{ eu: k }" /> (setup/Grains.vue, the bus in detector.js):
//   0  hidden (a 1 s fade)
//   1  the map gathers outward from CERN, CERN lit („O kaip komercializuoti?“)
//   2  threads begin: one to each Member State, nearest first („700+ sutarčių“)
//   3  many threads (every end), Lithuania's two land last and it lights („613 mln. CHF“)
//   4  the threads slow and spread out into a steady glow („+14 % apyvartos“)
// The form fades with the camera's distance (gone beyond ~110 units), so slides far
// away never see it; it is built once the cover is behind (afterCover.js).
import { BufferGeometry, BufferAttribute, Points, Group, Color, Vector3 } from 'three'
import { PLACE, listen, state, material } from './detector.js'
import { places } from './afterCover.js'

const K = { coast: 0, border: 1, ltLine: 2, ltFill: 3, cern: 4, core: 5, thread: 6, end: 7 }
const LIT_AT = 3.8    // s after step 3: Lithuania's threads land, and it lights
const GROW = 1.4      // s for a thread's front to reach its end

const VERT = PLACE + /* glsl */ `
attribute float aKind, aSeed, aStart, aFall;
attribute vec3 aOff, aCtl, aEnd;
uniform float uShow, uShowT, uW2, uW3, uT2, uT3, uLt, uSteady, uPhase, uFar, uAlpha, uThreadA, uSize;
uniform vec3 uColor, uHot, uLit;
vec3 bez(vec3 a, vec3 c, vec3 b, float s) { return mix(mix(a, c, s), mix(c, b, s), s); }
void main() {
  if (uShowT > 1e8 || uShow * uFar < 0.002) { hide(); return; }
  float k = aKind, vis = uShow * uFar;
  if (k < 3.5) {
    // the map: each grain drifts down into place, the wave running out from CERN
    float e = ease((uTime - uShowT - aStart) / 1.6);
    vec3 p = position + aOff * (1.0 - e);
    float a = uAlpha * aFall * e;
    vec3 col = uColor;
    if (k > 0.5 && k < 1.5) a *= 0.55;                       // borders fainter than coasts
    if (k > 1.5 && k < 2.5) { a = mix(a * 0.16, 1.1 * e, uLt); /* ~3.7x denser than a border: as faint as one until lit */ col = mix(uColor, uLit, uLt); }
    if (k > 2.5) { if (uLt < 0.002) { hide(); return; } a = 0.3 * uLt * aFall; col = mix(uColor, uLit, 0.6); }
    place(p, uSize * (k > 1.5 ? mix(0.85, 1.15, uLt) : 0.85) * (0.75 + 0.5 * hash(aSeed * 7.0)), a * vis, col, aSeed);
    return;
  }
  if (k < 5.5) {
    // CERN: a slow knot of grains and one bright core
    float e = smoothstep(0.0, 0.9, uTime - uShowT);
    if (k > 4.5) { place(position, uSize * 3.2, 0.7 * e * vis, uLit, aSeed); return; }
    float w = uTime * (0.25 + 0.3 * hash(aSeed * 3.0));
    vec3 o = aOff;
    vec3 p = position + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    place(p, uSize * 1.3, 0.75 * e * vis, mix(uHot, uLit, hash(aSeed * 5.0)), aSeed);
    return;
  }
  // a thread (6) or its landing (7): wave 2 or 3, from its own start
  bool w3 = aFall > 2.5;
  float T = w3 ? uT3 : uT2, W = w3 ? uW3 : uW2;
  if (T > 1e8 || W < 0.002) { hide(); return; }
  float f = clamp((uTime - T - aStart) / ${GROW.toFixed(2)}, 0.0, 1.0);
  bool lt = aOff.y > 0.5;
  if (k > 6.5) {
    float e = smoothstep(0.0, 0.8, uTime - T - aStart - ${GROW.toFixed(2)});
    if (e <= 0.0) { hide(); return; }
    float w = uTime * (0.3 + 0.4 * hash(aSeed * 9.0));
    vec3 o = aCtl;
    vec3 p = aEnd + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    place(p, uSize * (lt ? 1.5 : 1.15), (lt ? 0.95 : 0.6) * e * W * vis, lt ? uLit : uHot, aSeed);
    return;
  }
  if (f <= 0.0) { hide(); return; }
  // packets of grains flowing out along the arc; at step 4 they spread out evenly and slow
  float s = fract(mix(aOff.x, aSeed, uSteady) + uPhase * aOff.z);
  if (s > f) { hide(); return; }
  vec3 p = bez(position, aCtl, aEnd, s);
  float j = sin(s * 3.14159) * 0.035;
  p += vec3(hash(aSeed * 11.0) - 0.5, hash(aSeed * 13.0) - 0.5, hash(aSeed * 17.0) - 0.5) * j * 2.0;
  float head = smoothstep(f - 0.12, f, s) * (1.0 - step(1.0, f));          // the growing front glows
  float pk = 0.45 + 0.55 * hash(aSeed * 19.0);
  float a = mix(pk, 0.5, uSteady) * smoothstep(0.0, 0.05, s) * (1.0 - smoothstep(0.93, 1.0, s));
  a = (a + head * 0.6) * (lt ? 1.25 : 1.0);
  vec3 col = mix(uColor, lt ? uLit : uHot, 0.35 + 0.4 * head + 0.25 * hash(aSeed * 23.0));
  place(p, uSize * (1.0 + 0.5 * head) * (0.8 + 0.4 * hash(aSeed * 29.0)), uThreadA * a * W * vis, col, aSeed);
}`

const lin = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }

function makeGrains(d, o, f) {
  const S = o.scale ?? 250, [cx, cy] = d.cern
  const at = (x, y) => [(x - cx) / S, 0, -(y - cy) / S]
  // the crop's edges fade out (no hard border where the projection was cut)
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
  for (const l of d.coast.concat(d.far || [])) for (let i = 0; i < l.length; i += 2) { x0 = Math.min(x0, l[i]); x1 = Math.max(x1, l[i]); y0 = Math.min(y0, l[i + 1]); y1 = Math.max(y1, l[i + 1]) }
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  const fall = (x, y) => { const r = Math.max(Math.abs(x - mx) / hx, Math.abs(y - my) / hy); return 1 - Math.min(1, Math.max(0, (r - 0.82) / 0.18)) ** 2 }
  const reach = Math.hypot(hx, hy) / S

  const out = { pos: [], kind: [], seed: [], start: [], fall: [], off: [], ctl: [], end: [] }
  const push = (p, kind, start, fl, off = [0, 0, 0], ctl = [0, 0, 0], end = [0, 0, 0]) => {
    out.pos.push(...p); out.kind.push(kind); out.seed.push(Math.random()); out.start.push(start); out.fall.push(fl)
    out.off.push(...off); out.ctl.push(...ctl); out.end.push(...end)
  }
  const scatter = () => [(Math.random() - 0.5) * 1.6, 0.6 + Math.random() * 2.2, (Math.random() - 0.5) * 1.6]
  const gatherDelay = (p) => 0.9 * Math.hypot(p[0], p[2]) / reach + Math.random() * 0.45
  const spacing = (o.spacing ?? 4.5) / f
  const line = (l, kind, sp) => {
    for (let i = 2; i < l.length; i += 2) {
      const ax = l[i - 2], ay = l[i - 1], bx = l[i], by = l[i + 1], L = Math.hypot(bx - ax, by - ay)
      let n = L / sp; n = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0)
      for (let k = 0; k < n; k++) {
        const t = Math.random(), j = (Math.random() - 0.5) * 2.4
        const x = ax + (bx - ax) * t - (by - ay) / (L || 1) * j, y = ay + (by - ay) * t + (bx - ax) / (L || 1) * j
        const p = at(x, y)
        push(p, kind, gatherDelay(p), fall(x, y), scatter())
      }
    }
  }
  for (const l of d.coast) line(l, K.coast, spacing)
  for (const l of d.border) line(l, K.border, spacing * 1.3)
  // the rest of the world to the frame's edges (the Americas, Africa, Asia): sparse, as faint as a border
  for (const l of d.far || []) line(l, K.border, spacing * 3)
  const lt = d.lt.concat(d.lt.slice(0, 2))
  line(lt, K.ltLine, spacing * 0.35)
  // Lithuania's land, shown as it lights
  let lx0 = 1e9, lx1 = -1e9, ly0 = 1e9, ly1 = -1e9
  for (let i = 0; i < d.lt.length; i += 2) { lx0 = Math.min(lx0, d.lt[i]); lx1 = Math.max(lx1, d.lt[i]); ly0 = Math.min(ly0, d.lt[i + 1]); ly1 = Math.max(ly1, d.lt[i + 1]) }
  const inLt = (x, y) => { let c = false; for (let i = 0, j = d.lt.length - 2; i < d.lt.length; j = i, i += 2) { const xi = d.lt[i], yi = d.lt[i + 1], xj = d.lt[j], yj = d.lt[j + 1]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c } return c }
  for (let n = 0, tries = 0; n < Math.round(1800 * f) && tries < 40000; tries++) {
    const x = lx0 + Math.random() * (lx1 - lx0), y = ly0 + Math.random() * (ly1 - ly0)
    if (!inLt(x, y)) continue
    push(at(x, y), K.ltFill, 0, 0.5 + 0.5 * Math.random()); n++
  }
  // CERN
  for (let n = 0; n < Math.round(420 * f); n++) {
    const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = 0.16 * Math.cbrt(Math.random())
    push([0, 0.02, 0], K.cern, 0, 1, [r * q * Math.cos(ph), Math.abs(r * z) * 0.6, r * q * Math.sin(ph)])
  }
  push([0, 0.03, 0], K.core, 0, 1)
  // threads: wave 2 one to each Member State (its first end), nearest first; wave 3 every
  // other end, nearest first, Lithuania's two landing last, at LIT_AT
  const ends = d.ends.map((e) => { const p = at(...e.p); return { ...e, w: at(...e.p), len: Math.hypot(p[0], p[2]) } })
  const seen = new Set(), w2 = [], w3 = []
  for (const e of [...ends].sort((a, b) => a.len - b.len)) {
    if (e.c === 'LTU') continue
    if (e.m && !seen.has(e.c)) { seen.add(e.c); w2.push(e) } else w3.push(e)
  }
  w2.forEach((e, i) => { e.wave = 2; e.start = 0.15 + 2.2 * i / Math.max(1, w2.length - 1) })
  w3.forEach((e, i) => { e.wave = 3; e.start = 0.1 + 2.1 * i / Math.max(1, w3.length - 1) })
  for (const e of ends) if (e.c === 'LTU') { e.wave = 3; e.start = LIT_AT - GROW - 0.15 * Math.random(); e.lt = 1 }
  const per = Math.round((o.threads ?? 480) * f), lift = o.lift ?? 0.28
  for (const e of ends) {
    const B = e.w, ctl = [B[0] / 2, lift * e.len + 0.25, B[2] / 2]
    const speed = 1.6 / (e.len + 2.5)            // cycles a phase unit: long threads not much faster on screen
    const packets = Math.max(3, Math.round(e.len * 0.9))
    for (let k = 0; k < per; k++) {
      const pk = (Math.floor(Math.random() * packets) + 0.4 * Math.random()) / packets
      push([0, 0.02, 0], K.thread, e.start, e.wave, [pk, e.lt ? 1 : 0, speed], ctl, B)
    }
    for (let k = 0; k < Math.round(36 * f); k++) {
      const ph = Math.random() * Math.PI * 2, r = (e.lt ? 0.16 : 0.09) * Math.sqrt(Math.random())
      push([0, 0.02, 0], K.end, e.start, e.wave, [0, e.lt ? 1 : 0, 0], [r * Math.cos(ph), 0.02 * Math.random(), r * Math.sin(ph)], B)
    }
  }
  const busy = {
    1: 2.6,
    2: Math.max(...w2.map((e) => e.start)) + GROW + 1,
    3: LIT_AT + 2,
  }
  return { out, busy }
}

function buildEurope(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const name = o.name || 'eu'
  // material() makes its own uniforms object (with uTime, uPixelRatio): steer that one
  const mat = material(VERT, {
    uShow: { value: 0 }, uShowT: { value: 1e9 }, uW2: { value: 0 }, uW3: { value: 0 }, uT2: { value: 1e9 }, uT3: { value: 1e9 },
    uLt: { value: 0 }, uSteady: { value: 0 }, uPhase: { value: 0 }, uFar: { value: 1 },
    uAlpha: { value: o.alpha ?? 0.75 }, uThreadA: { value: o.threadAlpha ?? 0.6 }, uSize: { value: o.size ?? 1 },
    uColor: { value: lin(o.color || '#b4ceff') }, uHot: { value: lin(o.hot || '#dfe8ff') }, uLit: { value: lin(o.lit || '#ffffff') },
  })
  const u = mat.uniforms
  let pts = null, busyFor = { 1: 2.6, 2: 4, 3: LIT_AT + 2 }, loaded = false, alive = true, warm = 0
  // a lower tier (a phone) draws fewer grains: the budget is 300k at tier 0, 30k at 3
  const f = [1, 0.8, 0.55, 0.4][Math.min(3, ctx.tier ?? 0)] ?? 1
  const offLatch = places.when(() => {
    fetch(ctx.asset('/' + String(o.src || 'data/europe.json').replace(/^\//, '')))
      .then((r) => { if (!r.ok) throw new Error(r.status + ' ' + o.src); return r.json() })
      .then((d) => {
        if (!alive) return
        const { out, busy } = makeGrains(d, o, f)
        busyFor = busy
        const geo = new BufferGeometry()
        const F = (a) => new Float32Array(a)
        geo.setAttribute('position', new BufferAttribute(F(out.pos), 3))
        for (const [k, a, n] of [['aKind', out.kind, 1], ['aSeed', out.seed, 1], ['aStart', out.start, 1], ['aFall', out.fall, 1], ['aOff', out.off, 3], ['aCtl', out.ctl, 3], ['aEnd', out.end, 3]]) geo.setAttribute(k, new BufferAttribute(F(a), n))
        pts = new Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 10
        g.add(pts)
        warm = 3   // drawn a few frames (all hidden in the shader) to compile and upload ahead
        loaded = true
      })
      .catch((e) => { loaded = true; console.warn('stage: europe failed', e) })
  })

  let now = 0, last = null, step = state.get(name) ?? 0, fresh = state.has(name), busyUntil = 0, ltAt = 1e9
  const off = listen(name, (k) => { step = k; fresh = true })
  const wp = new Vector3()
  const apply = () => {
    if (step >= 1 && (u.uShowT.value > 1e8 || u.uShow.value < 0.5)) { if (u.uShowT.value > 1e8) u.uShowT.value = now; busyUntil = Math.max(busyUntil, now + busyFor[1]) }
    if (step >= 2 && u.uT2.value > 1e8) { u.uT2.value = now; busyUntil = Math.max(busyUntil, now + busyFor[2]) }
    if (step >= 3 && u.uT3.value > 1e8) { u.uT3.value = now; ltAt = now + LIT_AT; busyUntil = Math.max(busyUntil, now + busyFor[3]) }
    busyUntil = Math.max(busyUntil, now + 2.6)   // a fade, the steady glow's settling
  }
  const ease = (v, goal, dt, up, down) => v + Math.sign(goal - v) * Math.min(Math.abs(goal - v), dt / (goal > v ? up : down))
  return {
    group: g, labels: [], frameScale: mat.uniforms.uPixelRatio,
    api: { busy: () => (step > 0 && !loaded) || now < busyUntil },
    update(t, cam) {
      const dt = last == null ? 0 : Math.max(0, t - last); last = t; now = t
      u.uTime.value = t
      if (fresh && loaded) { fresh = false; apply() }
      if (!loaded) return
      u.uShow.value = ease(u.uShow.value, step >= 1 ? 1 : 0, dt, 0.3, 1)
      if (step < 1 && u.uShow.value <= 0) u.uShowT.value = 1e9
      u.uW2.value = ease(u.uW2.value, step >= 2 ? 1 : 0, dt, 0.2, 0.8)
      if (step < 2 && u.uW2.value <= 0) u.uT2.value = 1e9
      u.uW3.value = ease(u.uW3.value, step >= 3 ? 1 : 0, dt, 0.2, 0.8)
      if (step < 3 && u.uW3.value <= 0) { u.uT3.value = 1e9; ltAt = 1e9 }
      u.uLt.value = ease(u.uLt.value, step >= 3 && t >= ltAt ? 1 : 0, dt, 1.6, 1)
      u.uSteady.value = ease(u.uSteady.value, step >= 4 ? 1 : 0, dt, 2.5, 1.5)
      // the flow's phase, integrated: at step 4 it slows to a fifth (no jump when the speed changes)
      u.uPhase.value += dt * (1 - 0.8 * u.uSteady.value)
      if (cam) { g.getWorldPosition(wp); const dd = wp.distanceTo(cam); u.uFar.value = 1 - Math.min(1, Math.max(0, (dd - 60) / 50)) }
      if (warm > 0) warm--
      if (pts) pts.visible = u.uShowT.value < 1e8 || warm > 0
    },
    dispose() { alive = false; offLatch(); off() },
  }
}

export function installEurope(registerBuilder) {
  registerBuilder('europe', buildEurope, { fields: ['pos', 'name'] })
}
