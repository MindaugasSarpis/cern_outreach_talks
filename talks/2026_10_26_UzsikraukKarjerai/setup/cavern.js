// The cavern round LHCb on slide 9: its floor as a faint grid of grains and the cradles
// the sub-detectors stand on, both shown with the detector (step name `of`: 'det').
// Copied on 21 Oct 2026 from Innoday (main 404f3a7, setup/emblems.js `floor` and
// `supports`, unchanged); `floor` is registered here as `cavern-floor`, since this
// talk's `floor` is OpenData's (setup/piles.js).
import { BufferGeometry, BufferAttribute, Points, Group, Color } from 'three'
import { PLACE, listen, state, material as materialOf } from './detector.js'

// shown while any of its step names (`of`: a name or a list, default 'det') is on; it fades in
// over 2 s and out over 1,2 s (until 25 Oct it went at once)
function shown(o, u, clock) {
  const names = [].concat(o.of || 'det')
  const on = () => names.some((n) => (state.get(n) ?? 0) > 0)
  let fresh = true
  const offs = names.map((n) => listen(n, () => { fresh = true }))
  return {
    update(t) {
      if (fresh) {
        fresh = false
        if (on()) { if (u.uShowT.value > 1e8 || u.uHideT.value < 1e8) u.uShowT.value = u.uHideT.value < 1e8 ? t - 2 : t; u.uHideT.value = 1e9 }
        else if (u.uShowT.value < 1e8 && u.uHideT.value > 1e8) u.uHideT.value = t
      }
      if (u.uHideT.value < 1e8 && t - u.uHideT.value > 1.3) { u.uShowT.value = 1e9; u.uHideT.value = 1e9 }
    },
    off: () => offs.forEach((f) => f()),
  }
}

// `floor`: the cavern's floor as a faint grid of grains, for the eye-level view's scale
// (owner, 20 Oct: "first person view at eye level"); shown with the detector (its
// step name, `of`: 'det').
//   { type: floor, name, of?: 'det' (or a list), pos, area?: [32, 28], step?: 2, grains?: 18000, size?: 1.4, color?, alpha?: 0.9 }
const FLOOR_VERT = PLACE + /* glsl */ `
attribute float aSeed, aFall;
uniform float uShowT, uHideT, uAlpha, uSize;
uniform vec3 uColor;
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float a = uAlpha * smoothstep(0.0, 2.0, uTime - uShowT) * aFall * (0.6 + 0.4 * hash(aSeed * 7.0));
  if (uHideT < 1e8) a *= 1.0 - smoothstep(0.0, 1.2, uTime - uHideT);   // fades out with the detector (the close's climb)
  place(position, uSize, a, uColor, aSeed);
}`
function buildFloor(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const [sx, sz] = o.area || [32, 28], step = o.step ?? 2, n = o.grains ?? 18000
  const pos = new Float32Array(n * 3), seed = new Float32Array(n), fall = new Float32Array(n)
  const lines = Math.floor(sx / step) + Math.floor(sz / step) + 2
  for (let i = 0; i < n; i++) {
    let x, z
    if (i % 5 === 4) { x = (Math.random() - 0.5) * sx; z = (Math.random() - 0.5) * sz }   // a little dust between the lines
    else {
      const l = Math.floor(Math.random() * lines), nx = Math.floor(sx / step) + 1
      if (l < nx) { x = -sx / 2 + l * step; z = (Math.random() - 0.5) * sz }
      else { z = -sz / 2 + (l - nx) * step; x = (Math.random() - 0.5) * sx }
      x += (Math.random() - 0.5) * 0.04; z += (Math.random() - 0.5) * 0.04
    }
    pos.set([x, 0, z], i * 3)
    seed[i] = Math.random()
    // the floor fades out toward its edges: no border shows
    const r = Math.max(Math.abs(x) / (sx / 2), Math.abs(z) / (sz / 2))
    fall[i] = (1 - Math.min(1, r) ** 3) * (i % 5 === 4 ? 0.35 : 1)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  geo.setAttribute('aFall', new BufferAttribute(fall, 1))
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.9 }, uSize: { value: o.size ?? 1.4 }, uColor: { value: new Color(o.color || '#7f9fd8') } })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms
  let now = 0
  const sh = shown(o, u, () => now)
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },   // fading in
    update(t) { now = t; u.uTime.value = t; sh.update(t); g.visible = u.uShowT.value < 1e8 },
    dispose: sh.off,
  }
}

// `supports`: the cradles the sub-detectors stand on, as grains: for each, four legs
// from its underside down to the floor and two rails along it (LHCb's parts stand on
// carriages; drawn, the detector stands on the cavern's floor instead of hovering)
//   { type: supports, name, of?: 'det', floor: -6.72, parts: [[x0, x1, zHalf, yBottom], …],
//     grains?: 16000, color?, alpha?: 0.6, size?: 1.2 }
function buildSupports(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const parts = o.parts || [], n = o.grains ?? 16000, fl = o.floor ?? -6.72
  const segs = []
  for (const [x0, x1, zh, yb] of parts) {
    for (const x of [x0, x1]) for (const z of [-zh, zh]) segs.push([[x, fl, z], [x, yb, z]])   // legs
    for (const z of [-zh, zh]) segs.push([[x0, fl, z], [x1, fl, z]])   // foot rails
    if (o.frame !== 'legs') {   // the full cradle: top rails and cross-beams too (in true proportions they read as crates)
      for (const z of [-zh, zh]) segs.push([[x0, yb, z], [x1, yb, z]])
      segs.push([[x0, yb, -zh], [x0, yb, zh]], [[x1, yb, -zh], [x1, yb, zh]])
    }
  }
  const len = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])), total = len.reduce((s, l) => s + l, 0)
  const pos = new Float32Array(n * 3), seed = new Float32Array(n), fall = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    let t = Math.random() * total, j = 0
    while (j < segs.length - 1 && t > len[j]) { t -= len[j]; j++ }
    const [a, b] = segs[j], k = len[j] ? t / len[j] : 0
    pos.set([a[0] + (b[0] - a[0]) * k + (Math.random() - 0.5) * 0.12, a[1] + (b[1] - a[1]) * k + (Math.random() - 0.5) * 0.12, a[2] + (b[2] - a[2]) * k + (Math.random() - 0.5) * 0.12], i * 3)
    seed[i] = Math.random(); fall[i] = 1
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  geo.setAttribute('aFall', new BufferAttribute(fall, 1))
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.6 }, uSize: { value: o.size ?? 1.2 }, uColor: { value: new Color(o.color || '#6fa4ff') } })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms
  let now = 0
  const sh = shown(o, u, () => now)
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },
    update(t) { now = t; u.uTime.value = t; sh.update(t); g.visible = u.uShowT.value < 1e8 },
    dispose: sh.off,
  }
}

// `shaft`: the access shaft from the cavern's roof up to the surface, as grains on its wall (the
// owner, 25 Oct: "Maybe for the finale give lhcb a floor and indicate the schaft"): rings and
// lines down its length, a brighter rim at its foot. On the close it stands at Point 8, where the
// accelerator map's own shaft meets the surface, so the camera's climb goes up it.
//   { type: shaft, name, of?: 'det', pos: [x, yFoot, z], height?: 70, radius?: 5, grains?: 26000,
//     ring?: 6 (units between rings), lines?: 16, color?, alpha?: 0.5, size?: 1.3 }
function buildShaft(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const H = o.height ?? 70, R = o.radius ?? 5, n = o.grains ?? 26000, ring = o.ring ?? 6, lines = o.lines ?? 16
  const pos = new Float32Array(n * 3), seed = new Float32Array(n), fall = new Float32Array(n)
  const rings = Math.floor(H / ring) + 1
  for (let i = 0; i < n; i++) {
    let a, y, f = 1
    const kind = i % 6
    if (kind < 1) { a = Math.random() * Math.PI * 2; y = Math.floor(Math.random() * rings) * ring }   // the rings
    else if (kind < 4) { a = (Math.floor(Math.random() * lines) / lines) * Math.PI * 2; y = Math.random() * H }   // the lines (half the grains: the wall reads as going up)
    else if (kind === 4) { a = Math.random() * Math.PI * 2; y = Math.random() * 0.4; f = 1.6 }   // the rim at its foot
    else { a = Math.random() * Math.PI * 2; y = Math.random() * H; f = 0.35 }   // a little dust on the wall
    const r = R + (Math.random() - 0.5) * 0.08
    pos.set([r * Math.cos(a), y + (Math.random() - 0.5) * 0.06, r * Math.sin(a)], i * 3)
    seed[i] = Math.random()
    // fainter toward the top, so it reads as going up and away
    fall[i] = f * (1 - 0.3 * (y / H))
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  geo.setAttribute('aFall', new BufferAttribute(fall, 1))
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.5 }, uSize: { value: o.size ?? 1.3 }, uColor: { value: new Color(o.color || '#7f9fd8') } })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms
  let now = 0
  const sh = shown(o, u, () => now)
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },
    update(t) { now = t; u.uTime.value = t; sh.update(t); g.visible = u.uShowT.value < 1e8 },
    dispose: sh.off,
  }
}

// `beamline`: the LHC's two beams through the detector and out of the cavern both ways into the tunnel
// (the owner, 25 Oct: "could also indicate that LHCb is connected to lhc somehow"): a faint line along the
// beam axis (the station's x) and grains flowing along it, one beam each way, fading toward its ends; on
// the map that follows, the same two beams go round the LHC ring.
//   { type: beamline, name, of?: 'det', pos, from?: -90, to?: 110 (units along x), grains?: 9000,
//     speed?: 9 (units a second), color?: '#9cc4ff', color2?: '#ffffff', alpha?: 0.7, size?: 1.4 }
const BEAM_VERT = PLACE + /* glsl */ `
attribute float aSeed, aFall, aDir, aU;
uniform float uShowT, uHideT, uAlpha, uSize, uFrom, uLen, uSpeed;
uniform vec3 uColor, uColor2;
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float u = aDir == 0.0 ? aU : fract(aU + aDir * uSpeed * uTime / uLen);   // 0: the line itself, ±1: a beam
  vec3 p = vec3(uFrom + u * uLen, position.y, position.z);
  float ends = smoothstep(0.0, 0.25, u) * smoothstep(1.0, 0.75, u);   // into the dark of the tunnel both ways
  float a = uAlpha * smoothstep(0.0, 2.0, uTime - uShowT) * aFall * ends * (0.6 + 0.4 * hash(aSeed * 7.0));
  if (uHideT < 1e8) a *= 1.0 - smoothstep(0.0, 1.2, uTime - uHideT);
  place(p, uSize, a, aDir > 0.0 ? uColor2 : uColor, aSeed);
}`
function buildBeamline(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const n = o.grains ?? 9000, from = o.from ?? -90, len = (o.to ?? 110) - from
  const pos = new Float32Array(n * 3), seed = new Float32Array(n), fall = new Float32Array(n), dir = new Float32Array(n), uu = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const kind = i % 3   // the line, then a beam each way, side by side (as the map's two beams)
    const off = kind === 0 ? 0 : (kind === 1 ? 0.09 : -0.09)
    uu[i] = Math.random()
    // a beam comes in bunches: grains gathered round evenly spaced places along it
    if (kind > 0) { const b = 46; uu[i] = (Math.floor(Math.random() * b) + 0.5 + (Math.random() - 0.5) * 0.35) / b }
    pos.set([0, off + (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05], i * 3)
    dir[i] = kind === 0 ? 0 : (kind === 1 ? 1 : -1)
    seed[i] = Math.random(); fall[i] = kind === 0 ? 0.45 : 1
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, v] of [['aSeed', seed], ['aFall', fall], ['aDir', dir], ['aU', uu]]) geo.setAttribute(k, new BufferAttribute(v, 1))
  const mat = materialOf(BEAM_VERT, {
    uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.7 }, uSize: { value: o.size ?? 1.4 },
    uFrom: { value: from }, uLen: { value: len }, uSpeed: { value: o.speed ?? 9 },
    uColor: { value: new Color(o.color || '#9cc4ff') }, uColor2: { value: new Color(o.color2 || '#ffffff') },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms
  let now = 0
  const sh = shown(o, u, () => now)
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },
    update(t) { now = t; u.uTime.value = t; sh.update(t); g.visible = u.uShowT.value < 1e8 },
    dispose: sh.off,
  }
}

export function installCavern(registerBuilder) {
  registerBuilder('cavern-floor', buildFloor, { fields: ['pos', 'name'] })
  registerBuilder('supports', buildSupports, { fields: ['name', 'parts'] })
  registerBuilder('shaft', buildShaft, { fields: ['pos', 'name'] })
  registerBuilder('beamline', buildBeamline, { fields: ['pos', 'name'] })
}
