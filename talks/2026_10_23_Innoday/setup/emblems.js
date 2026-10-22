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
//     to become a grain), tint?: { '#rrggbb': '#rrggbb' } (an image colour shown as another),
//     reflect?: [v, gain] (an image's mirrored reflection from v of its height down: dimmed),
//     far?: { screen: [x, y], depth, width, pos, yaw, pitch, scrim? } (where it rides to over the
//     close's pull-out to the ring, `zoom.b` of the `ring` object: across the screen, from where
//     its place over the detector is seen to `screen` in the last frame (x, y from -1 to 1),
//     `depth` units from the camera, turning to face it, so it never leaves the frame; its
//     grains grow with it, so they keep their size on screen. `pos`, `yaw`, `pitch`: the same
//     place in the world, used without a camera) }
// Steps from <Grains> or setGrains(name, k): 1 gathers it (2.6 s), 0 lets it fade; `of`
// follows another name's steps instead (the person beside LHCb: the detector's).
// Also a person for scale: { type: emblem, src: 'figures/person_grains.png', mode: alpha, of: det }
// `text: 'Ačiū'` draws a word in the deck's heading type instead of an image; `burst: { at:
// [0, 0, 0], curl?: 0.7, out?: 0.5, hot?: '#ffffff' }` gathers it out of a collision at `at`
// (owner, 22 Oct: "aciu should appear out of particle collision now it's a bit flat"; "Also
// Lithuanian flag should appear with aciu"): the grains leave that point white-hot on
// curling tracks and cool to their colours as they land (`dur` s, 2.6 by default).
import { BufferGeometry, BufferAttribute, Points, Group, Color, NormalBlending, AdditiveBlending, ShaderMaterial, Mesh, PlaneGeometry, MeshBasicMaterial, CanvasTexture, Vector3 } from 'three'
import { PLACE, listen, state, material as materialOf } from './detector.js'
import { places } from './afterCover.js'

// the Lithuanian flag, top to bottom (#FDB913, #006A44, #C1272D)
// (the yellow given as #FFC800: the frame's vignette and the finish's top end dulled
// #FDB913 to a mustard there; measured 20 Oct)
const LT = ['#FFC800', '#006A44', '#C1272D'].map((h) => new Color(h))
LT[0].multiplyScalar(1.05)   // and lifted a little more (in display values; the finish brings it down to about #FDB913)

const VERT = PLACE + /* glsl */ `
attribute vec3 aStart, aColor, aBend;
attribute float aSeed, aU;
uniform float uT0, uHide, uDur, uSize, uAlpha, uWave, uWidth, uHot;
uniform vec3 uHotColor;
void main() {
  if (uT0 > 1e8) { hide(); return; }
  float k = clamp((uTime - uT0) / uDur * 1.35 - aSeed * 0.35, 0.0, 1.0);
  float e = ease(k);
  // a burst (aBend not zero): out of the collision on a curling track, then into place
  vec3 p = mix(aStart, position, e) + aBend * sin(3.14159 * e) * (1.0 - 0.5 * e);
  // the flag's cloth: a travelling wave, pinned at its hoist (aU = 0)
  vec3 col = aColor;
  if (uWave > 0.0) {
    p.z += uWave * aU * sin(aU * 7.0 - uTime * 2.2) * e;
    col *= 1.02 + 0.07 * cos(aU * 7.0 - uTime * 2.2) * aU;   // the folds catch the light, a little
  }
  // a burst's grains leave the collision white-hot and cool to their colour as they land
  col = mix(col, uHotColor, uHot * (1.0 - smoothstep(0.35, 1.0, k)));
  float fade = uHide > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.0, uTime - uHide);
  // (a burst's grains in flight at a third of their light: 60 000 leaving one point read as a white blob)
  float fly = uHot > 0.0 ? smoothstep(0.0, 0.12, k) * mix(0.3, 1.0, smoothstep(0.55, 1.0, k)) : smoothstep(0.0, 0.25, k);
  place(p, uSize * (0.7 + 0.6 * aSeed), uAlpha * fly * fade, col, aSeed);
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
  let img = url
  if (typeof url === 'string') { img = new Image(); img.src = url; await img.decode() }
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height
  const W = 480, H = Math.round(480 * ih / iw)
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
    // the logo's mirrored reflection, below `reflect[0]` of the height, fading from
    // reflect[1] of the letters' light (at full strength it read as a second, upside-down logo)
    if (o.reflect && v > o.reflect[0]) col.multiplyScalar((o.reflect[1] ?? 0.35) * Math.max(0, 1 - (v - o.reflect[0]) / (1 - o.reflect[0])) ** 1.5)
    out.col.set([col.r, col.g, col.b], k * 3)
    out.u[k] = u
  }
  return out
}

// a word as a picture for imageGrains (`text`): white on transparent, in the deck's heading
// type (the slide's own h1, once the fonts are in)
async function textCanvas(o) {
  await document.fonts?.ready
  const h1 = document.querySelector('.thanks-lhcb h1') || document.querySelector('h1')
  const cs = h1 ? getComputedStyle(h1) : null
  const font = `${cs?.fontWeight || 700} 220px ${cs?.fontFamily || 'sans-serif'}`
  const c = document.createElement('canvas'), x = c.getContext('2d')
  x.font = font
  const m = x.measureText(o.text)
  c.width = Math.ceil(m.width + 40); c.height = 300
  x.font = font; x.fillStyle = o.color || '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'
  x.fillText(o.text, c.width / 2, 150)
  return c
}

// the stage's camera (its canvas's handle), for the emblems' ride over the ring's pull-out
let camRef = null, camCanvas = null
function cameraOf() {
  if (!camCanvas?.isConnected) { camCanvas = document.querySelector('.stage canvas'); camRef = null }
  return (camRef ||= camCanvas?.__space?.composer?.passes?.[0]?.camera || null)
}
const vn = new Vector3(), fwd = new Vector3()

function buildEmblem(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  g.rotation.set((o.pitch || 0) * Math.PI / 180, (o.yaw || 0) * Math.PI / 180, 0, 'YXZ')
  if (o.far || o.fixed) g.userData.travel = true   // the ring's zoom moves it (`far`) or leaves it be (`fixed`: at its place over the ring), never shrinks it
  const w = o.width ?? 4, n = Math.round((o.grains ?? 26000) * Math.min(1, (ctx.budget || 300000) / 300000) ** 0.5)
  const mat = new ShaderMaterial({
    // `blend: 'add'` adds the grains on as the world's are (the person: light among the grains)
    vertexShader: VERT, fragmentShader: o.blend === 'add' ? ADD_FRAG : FRAG, transparent: true, depthWrite: false, depthTest: false,
    blending: o.blend === 'add' ? AdditiveBlending : NormalBlending,
    uniforms: {
      uTime: { value: 0 }, uPixelRatio: { value: 1 }, uT0: { value: 1e9 }, uHide: { value: 1e9 }, uDur: { value: o.dur ?? 2.6 },
      uSize: { value: o.size ?? 1.2 }, uAlpha: { value: o.alpha ?? 0.85 }, uWave: { value: o.wave ?? 0 }, uWidth: { value: w },
      uHot: { value: o.burst ? 1 : 0 }, uHotColor: { value: new Color(o.burst?.hot || '#ffffff') },
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
    const start = new Float32Array(n * 3), seed = new Float32Array(n), bend = new Float32Array(n * 3)
    const B = o.burst, at = B?.at || [0, 0, 0]
    for (let i = 0; i < n; i++) {
      seed[i] = Math.random()
      if (B) {
        // out of the collision at `at` (the group's frame): each grain's track bows to one side
        // or the other of the straight line to its place (a charge in a field), and overshoots
        const hx = d.home[i * 3] - at[0], hy = d.home[i * 3 + 1] - at[1], L = Math.hypot(hx, hy) || 1
        const side = (Math.random() < 0.5 ? -1 : 1) * (B.curl ?? 0.7) * (0.4 + Math.random()), out = (B.out ?? 0.5) * Math.random()
        start.set([at[0] + gauss() * 0.3, at[1] + gauss() * 0.3, at[2]], i * 3)
        bend.set([(-hy * side + hx * out), (hx * side + hy * out), gauss() * L * 0.1], i * 3)
        continue
      }
      // scattered a little around where it will hang (a wide scatter read as a firework
      // raining into the detector below)
      start.set([d.home[i * 3] * 1.3 + gauss() * w * 0.3, d.home[i * 3 + 1] * 1.3 + gauss() * w * 0.2, gauss() * w * 0.35], i * 3)
    }
    geo.setAttribute('position', new BufferAttribute(d.home, 3))
    geo.setAttribute('aStart', new BufferAttribute(start, 3))
    geo.setAttribute('aBend', new BufferAttribute(bend, 3))
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
    else if (o.text) textCanvas(o).then((c) => imageGrains(c, n, w, { mode: 'alpha', ...o })).then(make).catch((e) => console.warn('stage: emblem failed', o.text, e))
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
      if (o.far) {
        // ride from its place over the detector to its place over the ring, in the camera's
        // view: its place on screen, its depth and its size on screen each go from what the
        // one would show to what the other will (a straight line in the world took it out
        // of the top of the frame as the camera rose)
        const b = zoom.b, e = b * b * b * (b * (b * 6 - 15) + 10), F = o.far, lp = (a, c) => a + (c - a) * e
        const fp = F.pos || P, fw = F.width ?? w
        let sc = lp(1, fw / w)
        g.position.set(lp(P[0] || 0, fp[0]), lp(P[1] || 0, fp[1]), lp(P[2] || 0, fp[2]))
        g.rotation.set(lp(o.pitch || 0, F.pitch ?? o.pitch ?? 0) * Math.PI / 180, lp(o.yaw || 0, F.yaw ?? o.yaw ?? 0) * Math.PI / 180, 0, 'YXZ')
        const cam = b > 0 && F.screen && g.parent ? cameraOf() : null
        if (cam) {
          // F.screen: its middle's place in the last frame (x, y from -1 to 1), F.depth: its
          // distance there; facing the camera (parallel to the frame) by the end
          const base = g.parent.position
          vn.set(P[0] || 0, P[1] || 0, P[2] || 0).add(base).applyMatrix4(cam.matrixWorldInverse)
          const zn = -vn.z, zf = F.depth ?? 110, th = Math.tan(cam.fov * Math.PI / 360)
          if (zn > 0.5) {
            const z = Math.exp(lp(Math.log(zn), Math.log(zf)))
            const x = lp(vn.x / zn, F.screen[0] * th * cam.aspect), y = lp(vn.y / zn, F.screen[1] * th)
            g.position.set(x * z, y * z, -z).applyMatrix4(cam.matrixWorld).sub(base)
            sc = Math.exp(lp(Math.log(w / zn), Math.log(fw / zf))) * z / w
            fwd.set(0, 0, -1).transformDirection(cam.matrixWorld)
            const facePitch = -Math.asin(-fwd.y) * 180 / Math.PI, faceYaw = Math.atan2(-fwd.x, -fwd.z) * 180 / Math.PI
            g.rotation.set(lp(o.pitch || 0, facePitch) * Math.PI / 180, lp(o.yaw || 0, faceYaw) * Math.PI / 180, 0, 'YXZ')
          }
        }
        g.scale.setScalar(sc)
        u.uSize.value = (o.size ?? 1.2) * sc
        if (scrim && F.scrim != null) scrim.material.opacity *= lp(1, F.scrim / (o.scrim || 1))
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
uniform float uShowT, uAlpha, uSize, uDim;
uniform vec3 uColor;
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float a = uAlpha * smoothstep(0.0, 2.0, uTime - uShowT) * aFall * (0.6 + 0.4 * hash(aSeed * 7.0));
  cover = 1.0;
  place(position, uSize, a * uDim, uColor, aSeed);
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
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uDim: { value: 1 }, uAlpha: { value: o.alpha ?? 0.9 }, uSize: { value: o.size ?? 1.4 }, uColor: { value: new Color(o.color || '#7f9fd8') } })
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
  const mat = materialOf(FLOOR_VERT, { uShowT: { value: 1e9 }, uDim: { value: 1 }, uAlpha: { value: o.alpha ?? 0.6 }, uSize: { value: o.size ?? 1.2 }, uColor: { value: new Color(o.color || '#6fa4ff') } })
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

// `ring`: the accelerator complex round LHCb for the close's last seconds (owner, 21 Oct: "can
// show the accelerator as well, so this doesn't look isolated, it's a part of huge
// infrastructure. Maybe panning out at the very last second to full accelerator and then ačiū
// appears"; then "still want to see LHC, FCC, and 2 beams circulating"; "So the full
// accelerator complex (much like slide 27)"). The LHC as a ring through `pos` (the vertex:
// Point 8), tangent to the beam (x) there, its centre `radius` away along z (`side`: -1, LHCb's
// -x), with its two beams going round it both ways in trains (light blue and white), a bright
// mark at Point 8, and the rest of the complex in true proportion from a map (`map`: km east
// and north of the LHC's centre, turned by `rot` degrees so Point 8's bearing, `p8`, falls on
// the vertex): `rings` (the SPS, the PS, the FCC; `dash` for a proposed one) and `lines` (the
// transfer lines, a lake's shores), all still grains. Not at true scale against LHCb (27 km
// against its 21 m would put the ring past the stage's far plane): a scale cross-fade. As the
// camera goes from `near` to `far` units from Point 8 (the slide's pull-out), the station's
// other objects shrink toward it (to `shrink` of their size) and fade (to `dimTo`), the
// complex and the mark fade in, and emblems with `far` ride to their place in the last frame
// (`zoom.b`, 0 → 1 in log distance). Shown with the detector (`of`: 'det'); off, everything
// is as it was. An object marked `userData.travel` is left be (an emblem's `far` or `fixed`, a
// collision's `fixed`: setup/main.ts).
//   { type: ring, name, of?: 'det', pos: [0, 0, 0], radius?: 20, side?: -1, near?: 52, far?: 180,
//     shrink?: 0.05, dimTo?: 0.2, grains?: 40000, size?: 4, alpha?: 0.8, colors?: ['#9cc4ff', '#ffffff'],
//     lap?: 12 (s a beam takes round), trains?: 18, bunch?: 0.35, width?: 0.3, gap?: 0.3 (between the beams),
//     mark?: { grains: 600, size: 8, radius: 1.0, alpha: 0.6, color },
//     map?: 'data/ring_map.json' (hero/ring_map.py) | { km: 4.243 (the LHC's radius), p8: -55.7
//       (Point 8's bearing from the centre, degrees from east), rings: [{ c: [x, y], r, grains,
//       alpha, color, width?, dash? }], lines: [{ pts: [[x, y], …], grains, alpha, color, width?,
//       dash? }], fills: [{ pts (a polygon), grains, alpha, color, box?: [x0, y0, x1, y1] }] } }
// (owner, 22 Oct, with CERN's FCC map: "For the last one, can you use something like this? Now
// the SPS is weirdly connected to lhc": the map is the tunnels' own lines from OpenStreetMap,
// the FCC on its eight sites, Lake Geneva, the border, the Rhône and the ridges; seen from
// straight above, north up)
export const zoom = { b: 0, k: 1, at: new Vector3() }   // at: Point 8 in the world (what shrinks, shrinks toward it)
const RING_VERT = PLACE + /* glsl */ `
attribute vec4 aRing;   // a beam grain: angle, radial offset, height, direction (+1 / -1); else its place and its light
attribute vec3 aCol;
attribute float aSeed, aKind;   // 0 a beam, 1 the mark, 2 the complex's still grains
uniform float uShow, uMark, uAlpha, uSize, uR, uSide, uSpeed;
void main() {
  if (uShow <= 0.001 && uMark <= 0.001) { hide(); return; }
  vec3 p; float a, size;
  if (aKind > 1.5) {
    p = aRing.xyz; size = uSize * (0.7 + 0.6 * aSeed); a = uShow * aRing.w * (0.6 + 0.4 * hash(aSeed * 7.0));
  } else if (aKind > 0.5) {
    p = aRing.xyz; size = uSize * 1.8 * (0.6 + 0.8 * aSeed); a = uMark * (0.5 + 0.5 * aSeed);
  } else {
    float ang = aRing.x + aRing.w * uSpeed * uTime;
    float r = uR + aRing.y;
    // angle 0 is Point 8 (pos), the ring's centre at (0, 0, uSide·uR)
    p = vec3(r * sin(ang), aRing.z, uSide * (uR - r * cos(ang)));
    size = uSize * (0.7 + 0.6 * aSeed); a = uShow * uAlpha * (0.45 + 0.55 * hash(aSeed * 13.0));
  }
  cover = 1.0;
  place(p, size, a, aCol, aSeed);
}`
function buildRing(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  g.userData.travel = true   // never shrunk itself
  const R = o.radius ?? 20, side = o.side ?? -1, thin = Math.min(1, (ctx.budget || 300000) / 300000) ** 0.5
  const recs = []   // [x, y, z, w, kind, r, g, b]
  // the LHC's two beams: trains of grains (most of them) and a faint stream between
  const cols = (o.colors || ['#9cc4ff', '#ffffff']).map((h) => new Color(h))
  const nb = Math.round((o.grains ?? 40000) * thin), trains = o.trains ?? 18, gap = o.gap ?? 0.3, wd = o.width ?? 0.3
  for (let i = 0; i < nb; i++) {
    const beam = i % 2, dir = beam ? -1 : 1, c = cols[beam]
    const t = Math.floor(Math.random() * trains)
    // a share of the grains in trains (`bunch`), the rest an even stream: the trains show the beams going round
    const ang = Math.random() < (o.bunch ?? 0.35) ? (t + 0.5 + gauss() * 0.12) / trains * Math.PI * 2 : Math.random() * Math.PI * 2
    recs.push([ang, (beam ? -gap : gap) / 2 + gauss() * wd * 0.5, gauss() * wd * 0.5, dir, 0, c.r, c.g, c.b])
  }
  // the mark at Point 8
  const mk = o.mark || {}, mc = new Color(mk.color || '#ffffff'), mr = mk.radius ?? 1.0
  for (let i = 0; i < (mk.grains ?? 600); i++) recs.push([gauss() * mr, gauss() * mr, gauss() * mr, 1, 1, mc.r, mc.g, mc.b])
  // the complex, from the map: km east and north of the LHC's centre → the ring's frame
  // (`map` inline, or the path of a JSON file of the same: hero/ring_map.py writes one)
  const complex = (M) => {
    const out = [], u = R / (M.km ?? 4.243), rot = ((M.p8 ?? -55.7) * -1) * Math.PI / 180
    const at = (x, y) => {
      const X = x * Math.cos(rot) - y * Math.sin(rot), Y = x * Math.sin(rot) + y * Math.cos(rot)
      return [Y * u, 0, side * (R - X * u)]   // east (after the turn) → toward Point 8; north → +x
    }
    for (const r of M.rings || []) {
      const n = Math.round((r.grains ?? 6000) * thin), c = new Color(r.color || '#9cc4ff'), dash = r.dash || 0
      for (let i = 0; i < n; i++) {
        let t = Math.random()
        if (dash) t = (Math.floor(t * dash) + Math.random() * 0.55) / dash   // a proposed ring: dashed
        const a = t * Math.PI * 2, rr = r.r + gauss() * (r.width ?? 0.04)
        const p = at(r.c[0] + rr * Math.cos(a), r.c[1] + rr * Math.sin(a))
        out.push([p[0], gauss() * 0.15, p[2], r.alpha ?? 0.5, 2, c.r, c.g, c.b])
      }
    }
    // lines (tunnels, shores, a border, ridges): grains along them, `dash` pieces with gaps
    for (const l of M.lines || []) {
      const seg = [], n = Math.round((l.grains ?? 1500) * thin), c = new Color(l.color || '#9cc4ff'), dash = l.dash || 0
      let total = 0
      for (let j = 1; j < l.pts.length; j++) { const d = Math.hypot(l.pts[j][0] - l.pts[j - 1][0], l.pts[j][1] - l.pts[j - 1][1]); seg.push(d); total += d }
      if (!total) continue
      for (let i = 0; i < n; i++) {
        let f = Math.random()
        if (dash) f = (Math.floor(f * dash) + Math.random() * 0.5) / dash
        let s = f * total, j = 0
        while (j < seg.length - 1 && s > seg[j]) { s -= seg[j]; j++ }
        const k = seg[j] ? s / seg[j] : 0, A = l.pts[j], B = l.pts[j + 1]
        const p = at(A[0] + (B[0] - A[0]) * k + gauss() * (l.width ?? 0.03), A[1] + (B[1] - A[1]) * k + gauss() * (l.width ?? 0.03))
        out.push([p[0], gauss() * 0.1, p[2], l.alpha ?? 0.4, 2, c.r, c.g, c.b])
      }
    }
    // fills (a lake): grains spread inside a polygon, within `box` (km: x0, y0, x1, y1)
    for (const f of M.fills || []) {
      const P = f.pts, c = new Color(f.color || '#3f78d0'), n = Math.round((f.grains ?? 4000) * thin)
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [x, y] of P) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
      if (f.box) { x0 = Math.max(x0, f.box[0]); y0 = Math.max(y0, f.box[1]); x1 = Math.min(x1, f.box[2]); y1 = Math.min(y1, f.box[3]) }
      const inside = (x, y) => {
        let o = false
        for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
          if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) o = !o
        }
        return o
      }
      for (let i = 0, tries = 0; i < n && tries < n * 40; tries++) {
        const x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0)
        if (!inside(x, y)) continue
        const p = at(x, y)
        out.push([p[0], gauss() * 0.1, p[2], f.alpha ?? 0.2, 2, c.r, c.g, c.b]); i++
      }
    }
    return out
  }
  const toGeo = (rs) => {
    const N = rs.length
    const ring = new Float32Array(N * 4), col = new Float32Array(N * 3), seed = new Float32Array(N), kind = new Float32Array(N)
    rs.forEach((r, i) => { ring.set(r.slice(0, 4), i * 4); kind[i] = r[4]; col.set(r.slice(5, 8), i * 3); seed[i] = Math.random() })
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
    geo.setAttribute('aRing', new BufferAttribute(ring, 4))
    geo.setAttribute('aCol', new BufferAttribute(col, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
    geo.setAttribute('aKind', new BufferAttribute(kind, 1))
    return geo
  }
  const M = o.map || {}
  if (typeof M !== 'string') recs.push(...complex(M))
  const geo = toGeo(recs)
  const mat = materialOf(RING_VERT, {
    uShow: { value: 0 }, uMark: { value: 0 }, uAlpha: { value: o.alpha ?? 0.8 }, uSize: { value: o.size ?? 4 },
    uR: { value: R }, uSide: { value: side }, uSpeed: { value: Math.PI * 2 / (o.lap ?? 12) },
  })
  let alive = true
  if (typeof M === 'string') {
    fetch(ctx.asset('/' + M.replace(/^\//, ''))).then((r) => r.json()).then((m) => {
      if (!alive) return
      const pts = new Points(toGeo(complex(m)), mat); pts.frustumCulled = false; g.add(pts)
    }).catch((e) => console.warn('stage: ring map failed', M, e))
  }
  const markAlpha = mk.alpha ?? 0.6
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts)
  const un = mat.uniforms, of = o.of || 'det'
  const near = o.near ?? 52, far = o.far ?? 180, shrink = o.shrink ?? 0.05, dimTo = o.dimTo ?? 0.2
  let step0 = state.get(of) ?? 0, last = -1, warm = 0
  const off = listen(of, (k) => { step0 = k })
  const onWarm = () => { warm = 3 }   // drawn (hidden) a few frames on arrival: compiled and uploaded ahead
  addEventListener('innoday:prewarm', onWarm)
  const v = new Vector3(), here = new Vector3()
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
  // the station's other objects, scaled about Point 8 and faded
  const apply = (par, k, m) => {
    for (const c of par.children) {
      if (c === g || c.userData.travel) continue
      const z = (c.userData.zoom0 ||= { p: c.position.clone(), s: c.scale.x })
      c.position.copy(z.p).sub(here).multiplyScalar(k).add(here)
      c.scale.setScalar(z.s * k)
      c.traverse((x) => { const uu = x.material?.uniforms; if (uu?.uDim) uu.uDim.value = m })
    }
  }
  return {
    group: g, labels: [], frameScale: un.uPixelRatio,
    api: { busy: () => false },
    update(t, camPos) {
      un.uTime.value = t
      const par = g.parent
      if (!par) return
      here.copy(g.position)
      zoom.at.copy(here).add(par.position)
      let b = 0
      if (step0 > 0 && camPos) {
        v.copy(here).add(par.position)
        b = Math.min(1, Math.max(0, Math.log(Math.max(camPos.distanceTo(v), 1e-3) / near) / Math.log(far / near)))
      }
      zoom.b = b; zoom.k = Math.pow(shrink, b)
      un.uShow.value = smooth(0.08, 0.55, b)
      un.uMark.value = markAlpha * smooth(0.3, 0.8, b)
      if (warm > 0) warm--
      g.visible = b > 0 || warm > 0
      if (b !== last) { apply(par, zoom.k, 1 - (1 - dimTo) * smooth(0.15, 0.9, b)); last = b }
    },
    dispose() { alive = false; off(); removeEventListener('innoday:prewarm', onWarm); zoom.b = 0; zoom.k = 1 },
  }
}

export function installEmblems(registerBuilder) {
  registerBuilder('ring', buildRing, { fields: ['pos', 'name'] })
  registerBuilder('supports', buildSupports, { fields: ['name', 'parts'] })
  registerBuilder('emblem', buildEmblem, { fields: ['pos', 'name'] })
  registerBuilder('floor', buildFloor, { fields: ['pos', 'name'] })
}
