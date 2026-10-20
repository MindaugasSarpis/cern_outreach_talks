// The close's two emblems (owner, 20 Oct: "show lhcb logo and Lithuanian flag besides
// in 3d space"): LHCb's logo and the Lithuanian flag as grains, side by side in front of
// the detector once the camera stands at eye level. They gather out of the dust on their
// step and the flag waves a little. Drawn last and not added on (normal blending), so
// the blue detector behind them does not wash their colours out.
//
//   { type: emblem, name, pos, width?: 4, yaw?: 0 (degrees), pitch?: 0,
//     flag?: 'lt' | src?: 'figures/lhcb_logo_grains.png', mode?: 'alpha' (the image's own
//     alpha marks its grains and its colours are theirs), grains?: 26000, size?: 1.2, alpha?: 0.85,
//     wave?: 0 (units: the flag's flutter), scrim?: 0 (a soft dark ground behind it, its
//     strength: over the detector's grains it keeps the emblem legible), keep?: 0.25 (an image pixel's darkness-or-colour
//     to become a grain), tint?: { '#rrggbb': '#rrggbb' } (an image colour shown as another) }
// Steps from <Grains> or setGrains(name, k): 1 gathers it (2.6 s), 0 lets it fade; `of`
// follows another name's steps instead (the person beside LHCb: the detector's).
// Also a person for scale: { type: emblem, src: 'figures/person_grains.png', mode: alpha, of: det }
import { BufferGeometry, BufferAttribute, Points, Group, Color, NormalBlending, AdditiveBlending, ShaderMaterial, Mesh, PlaneGeometry, MeshBasicMaterial, CanvasTexture } from 'three'
import { PLACE, listen, state, material as materialOf } from './detector.js'
import { places } from './afterCover.js'

// the Lithuanian flag, top to bottom (#FDB913, #006A44, #C1272D)
// (the yellow given as #FFC800: the frame's vignette and the finish's top end dulled
// #FDB913 to a mustard there; measured 20 Oct)
const LT = ['#FFC800', '#006A44', '#C1272D'].map((h) => new Color(h))
LT[0].multiplyScalar(1.05)   // and lifted a little more (in display values; the finish brings it down to about #FDB913)

const VERT = PLACE + /* glsl */ `
attribute vec3 aStart, aColor;
attribute float aSeed, aU;
uniform float uT0, uHide, uDur, uSize, uAlpha, uWave, uWidth;
void main() {
  if (uT0 > 1e8) { hide(); return; }
  float k = clamp((uTime - uT0) / uDur * 1.35 - aSeed * 0.35, 0.0, 1.0);
  float e = ease(k);
  vec3 p = mix(aStart, position, e);
  // the flag's cloth: a travelling wave, pinned at its hoist (aU = 0)
  vec3 col = aColor;
  if (uWave > 0.0) {
    p.z += uWave * aU * sin(aU * 7.0 - uTime * 2.2) * e;
    col *= 1.02 + 0.07 * cos(aU * 7.0 - uTime * 2.2) * aU;   // the folds catch the light, a little
  }
  float fade = uHide > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.0, uTime - uHide);
  place(p, uSize * (0.7 + 0.6 * aSeed), uAlpha * smoothstep(0.0, 0.25, k) * fade, col, aSeed);
}`
// a soft round grain, its own colour, laid over what is behind it
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.18, 0.5, d)) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(pow(vColor, vec3(2.2)), a);
}`

const ADD_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor, vec3(2.2)) * a, 1.0);
}`

function gauss() { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }

// grains on the flag's 5:3 rectangle, in the flag's colours
function flagGrains(n, w) {
  const h = w * 3 / 5, out = { home: new Float32Array(n * 3), col: new Float32Array(n * 3), u: new Float32Array(n) }
  for (let i = 0; i < n; i++) {
    const u = Math.random(), v = Math.random(), c = LT[Math.min(2, Math.floor(v * 3))]
    out.home.set([(u - 0.5) * w, (0.5 - v) * h, (Math.random() - 0.5) * 0.02 * w], i * 3)
    out.col.set([c.r, c.g, c.b].map((x) => Math.pow(x, 1 / 2.2)), i * 3)   // back to display values: the shader takes them to linear
    out.u[i] = u
  }
  return out
}

// grains where an image has its marks (dark or coloured on a light ground, or lit on a
// transparent one), each with its pixel's colour, or a tint for it
async function imageGrains(url, n, w, o) {
  const img = new Image()
  img.src = url
  await img.decode()
  const W = 480, H = Math.round(480 * img.naturalHeight / img.naturalWidth)
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })
  g.drawImage(img, 0, 0, W, H)
  const px = g.getImageData(0, 0, W, H).data
  const tints = Object.entries(o.tint || {}).map(([a, b]) => [new Color(a), new Color(b)])
  const keep = o.keep ?? 0.25
  const cdf = new Float64Array(W * H)
  let acc = 0
  for (let i = 0; i < W * H; i++) {
    const r = px[i * 4] / 255, gg = px[i * 4 + 1] / 255, b = px[i * 4 + 2] / 255, a = px[i * 4 + 3] / 255
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b)
    // a mark: opaque, and either dark against the light ground or strongly coloured
    const mark = o.mode === 'alpha' ? a : a * Math.max(1 - (0.2126 * r + 0.7152 * gg + 0.0722 * b) / 0.85, mx > 0 ? (mx - mn) / mx : 0)
    acc += mark > keep ? 1 : 0
    cdf[i] = acc
  }
  const h = w * H / W, out = { home: new Float32Array(n * 3), col: new Float32Array(n * 3), u: new Float32Array(n) }
  for (let k = 0; k < n; k++) {
    const t = Math.random() * acc
    let lo = 0, hi = W * H - 1
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < t) lo = mid + 1; else hi = mid }
    const x = lo % W, y = (lo / W) | 0
    const u = (x + Math.random()) / W, v = (y + Math.random()) / H
    out.home.set([(u - 0.5) * w, (0.5 - v) * h, (Math.random() - 0.5) * 0.02 * w], k * 3)
    let col = new Color(px[lo * 4] / 255, px[lo * 4 + 1] / 255, px[lo * 4 + 2] / 255)
    // the nearest tint, if this pixel is close to one of the tinted colours
    let best = null, bd = 0.12
    for (const [a, b] of tints) { const d = Math.hypot(col.r - a.r, col.g - a.g, col.b - a.b); if (d < bd) { bd = d; best = b } }
    if (best) col = best
    out.col.set([col.r, col.g, col.b], k * 3)
    out.u[k] = u
  }
  return out
}

function buildEmblem(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  g.rotation.set((o.pitch || 0) * Math.PI / 180, (o.yaw || 0) * Math.PI / 180, 0, 'YXZ')
  const w = o.width ?? 4, n = Math.round((o.grains ?? 26000) * Math.min(1, (ctx.budget || 300000) / 300000) ** 0.5)
  const mat = new ShaderMaterial({
    // `blend: 'add'` adds the grains on as the world's are (the person: light among the grains)
    vertexShader: VERT, fragmentShader: o.blend === 'add' ? ADD_FRAG : FRAG, transparent: true, depthWrite: false, depthTest: false,
    blending: o.blend === 'add' ? AdditiveBlending : NormalBlending,
    uniforms: {
      uTime: { value: 0 }, uPixelRatio: { value: 1 }, uT0: { value: 1e9 }, uHide: { value: 1e9 }, uDur: { value: o.dur ?? 2.6 },
      uSize: { value: o.size ?? 1.2 }, uAlpha: { value: o.alpha ?? 0.85 }, uWave: { value: o.wave ?? 0 }, uWidth: { value: w },
    },
  })
  const u = mat.uniforms
  // the soft dark ground behind it, drawn just before its grains
  let scrim = null
  if (o.scrim > 0) {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 8, 64, 64, 64)
    gr.addColorStop(0, 'rgba(0,1,3,1)'); gr.addColorStop(0.6, 'rgba(0,1,3,0.85)'); gr.addColorStop(1, 'rgba(0,1,3,0)')
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128)
    const h = o.src ? w * 0.75 : w * 3 / 5
    scrim = new Mesh(new PlaneGeometry(w * 1.7, h * 2.0), new MeshBasicMaterial({ map: new CanvasTexture(c), transparent: true, opacity: 0, depthTest: false, depthWrite: false }))
    scrim.position.z = -0.05; scrim.renderOrder = 19
    g.add(scrim)
  }
  let alive = true
  const make = (d) => {
    if (!alive) return
    const geo = new BufferGeometry()
    const start = new Float32Array(n * 3), seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      // scattered in the dust around where it will hang, up to a couple of widths out
      start.set([d.home[i * 3] * 2.2 + gauss() * w * 0.8, d.home[i * 3 + 1] * 2.2 + gauss() * w * 0.6, gauss() * w * 0.9], i * 3)
      seed[i] = Math.random()
    }
    geo.setAttribute('position', new BufferAttribute(d.home, 3))
    geo.setAttribute('aStart', new BufferAttribute(start, 3))
    geo.setAttribute('aColor', new BufferAttribute(d.col, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
    geo.setAttribute('aU', new BufferAttribute(d.u, 1))
    const pts = new Points(geo, mat)
    pts.frustumCulled = false
    pts.renderOrder = 20   // after the detector's grains and the collision: laid over them
    g.add(pts)
  }
  // built once the cover is behind (afterCover.js): sampled at the world's boot, it fell in
  // the cover's fly-in
  const offLatch = places.when(() => {
    if (o.flag === 'lt') make(flagGrains(n, w))
    else if (o.src) imageGrains(ctx.asset('/' + String(o.src).replace(/^\//, '')), n, w, o).then(make).catch((e) => console.warn('stage: emblem failed', o.src, e))
  })
  let warm = 0
  const onWarm = () => { warm = 3 }
  addEventListener('innoday:prewarm', onWarm)
  const key = o.of || o.name
  let now = 0, step = state.get(key) ?? 0, fresh = state.has(key)
  const off = listen(key, (k) => { step = k; fresh = true })
  const apply = () => {
    if (step > 0) { if (u.uT0.value > 1e8 || u.uHide.value < 1e8) { u.uT0.value = now; u.uHide.value = 1e9 } }
    else if (u.uT0.value < 1e8 && u.uHide.value > 1e8) u.uHide.value = now
  }
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => u.uT0.value < 1e8 && u.uHide.value > 1e8 && now - u.uT0.value < u.uDur.value * 1.4 },
    update(t) {
      now = t; u.uTime.value = t
      if (fresh) { fresh = false; apply() }
      if (u.uHide.value < 1e8 && t - u.uHide.value > 1.1) { u.uT0.value = 1e9; u.uHide.value = 1e9 }
      if (scrim) {
        const on = u.uT0.value > 1e8 ? 0 : Math.min(1, (t - u.uT0.value) / u.uDur.value)
        const off = u.uHide.value > 1e8 ? 1 : Math.max(0, 1 - (t - u.uHide.value))
        scrim.material.opacity = o.scrim * on * off
      }
      if (warm > 0) warm--
      g.visible = u.uT0.value < 1e8 || warm > 0   // a few frames drawn hidden first (innoday:prewarm): upload and compile ahead
    },
    dispose() { alive = false; offLatch(); off(); removeEventListener('innoday:prewarm', onWarm) },
  }
}

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

export function installEmblems(registerBuilder) {
  registerBuilder('supports', buildSupports, { fields: ['name', 'parts'] })
  registerBuilder('emblem', buildEmblem, { fields: ['pos', 'name'] })
  registerBuilder('floor', buildFloor, { fields: ['pos', 'name'] })
}
