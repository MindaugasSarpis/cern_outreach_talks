// The cavern round LHCb on slide 8: its floor as a faint grid of grains and the cradles
// the sub-detectors stand on, both shown with the detector (step name `of`: 'det').
// Copied on 21 Oct 2026 from Innoday (main 404f3a7, setup/emblems.js `floor` and
// `supports`, unchanged); `floor` is registered here as `cavern-floor`, since this
// talk's `floor` is OpenData's (setup/piles.js).
import { BufferGeometry, BufferAttribute, Points, Group, Color } from 'three'
import { PLACE, listen, state, material as materialOf } from './detector.js'

// `floor`: the cavern's floor as a faint grid of grains, for the eye-level view's scale
// (owner, 20 Oct: "first person view at eye level"); shown with the detector (its
// step name, `of`: 'det').
//   { type: floor, name, of?: 'det', pos, area?: [32, 28], step?: 2, grains?: 18000, size?: 1.4, color?, alpha?: 0.9 }
const FLOOR_VERT = PLACE + /* glsl */ `
attribute float aSeed, aFall;
uniform float uShowT, uAlpha, uSize;
uniform vec3 uColor;
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float a = uAlpha * smoothstep(0.0, 2.0, uTime - uShowT) * aFall * (0.6 + 0.4 * hash(aSeed * 7.0));
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
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.9 }, uSize: { value: o.size ?? 1.4 }, uColor: { value: new Color(o.color || '#7f9fd8') } })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms, of = o.of || 'det'
  let now = 0, step0 = state.get(of) ?? 0, fresh = true
  const off = listen(of, (k) => { step0 = k; fresh = true })
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },   // fading in
    update(t) {
      now = t; u.uTime.value = t
      if (fresh) { fresh = false; if (step0 > 0) { if (u.uShowT.value > 1e8) u.uShowT.value = t } else u.uShowT.value = 1e9 }
      g.visible = u.uShowT.value < 1e8
    },
    dispose: off,
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
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uAlpha: { value: o.alpha ?? 0.6 }, uSize: { value: o.size ?? 1.2 }, uColor: { value: new Color(o.color || '#6fa4ff') } })
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const u = mat.uniforms, of = o.of || 'det'
  let now = 0, step0 = state.get(of) ?? 0, fresh = true
  const off = listen(of, (k) => { step0 = k; fresh = true })
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uShowT.value < 1e8 && now - u.uShowT.value < 2.2 },
    update(t) {
      now = t; u.uTime.value = t
      if (fresh) { fresh = false; if (step0 > 0) { if (u.uShowT.value > 1e8) u.uShowT.value = t } else u.uShowT.value = 1e9 }
      g.visible = u.uShowT.value < 1e8
    },
    dispose: off,
  }
}

export function installCavern(registerBuilder) {
  registerBuilder('cavern-floor', buildFloor, { fields: ['pos', 'name'] })
  registerBuilder('supports', buildSupports, { fields: ['name', 'parts'] })
}
