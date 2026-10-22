// Slide 11's world (owner, 21 Oct: "Slide 11 is a bit of a step back"; the main session took
// "Photo → globe of institutes"): the collaboration photo dissolves into its grains, which fly
// onto a slowly turning globe of grains, Earth's coastlines faint, LHCb's institutes bright
// points, Vilnius a little brighter (no text). <CollabGlobe> (setup/CollabGlobe.vue) shows the
// photo, dissolves its copy and hands this builder the grains; the globe stands whole on any
// other arrival, and turns on the world's clock.
//
//   { type: collab-globe, name: 'globe', pos, src?: 'data/globe.json', radius?: 3.8,
//     tilt?: 26 (deg, north toward the camera), roll?: -8, lon?: 30 (the centre's longitude when
//     the globe has formed), spin?: 1.5 (deg/s, west: the land moves right, as Earth turns),
//     size?: 0.5, coast?: 1, land?: 0.24, ocean?: 0.06, color?: '#9cc4ff', hot?: '#dfe8ff',
//     lit?: '#ffffff' }
//
// Data (public/data/globe.json; the converter's parameters in its `about`): Natural Earth
// 1:50m coastlines and points on its 1:110m land (public domain), and the institutes' cities.
import { BufferGeometry, BufferAttribute, Points, Group, Color, Vector3, Matrix3, Matrix4, ShaderMaterial, AdditiveBlending } from 'three'
import { POINT_GLSL, viewScale } from './view.js'
import { places } from './afterCover.js'

// the sequence, world seconds from start(): the photo holds, dissolves, its grains fly
export const T = {
  hold: 1.2,       // the still photo (after the ~1 s it takes to stand the grains up behind it)
  dissolve: 2.6,   // its copy lets go, the grains light
  morph: 1.4,      // after the hold: the grains set out …
  fly: 3.6,        // … over this long (the last lands at hold + morph + fly)
  globe: 3.6,      // after the hold: the globe's own grains come in (1.2 s)
  inst: 4.2,       // … its institutes light, one after another (over 2 s, each 0.8 s)
  fade: 4.8,       // … the photo's grains hand over (1.2 s)
  nums: 4.6,       // … the numbers (CollabGlobe.vue)
  end: 7.4,        // after the hold: settled
}

// the live builder, for <CollabGlobe>; `pending` keeps the world busy from the slide's arrival
// until the component has started the sequence (or given up)
export const collab = { inst: null, pending: false }

const lin = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const D2R = Math.PI / 180
const dir = (lon, lat) => { const a = lon * D2R, b = lat * D2R; return [Math.cos(b) * Math.sin(a), Math.sin(b), Math.cos(b) * Math.cos(a)] }

const COMMON = /* glsl */ `
uniform float uTime;
${POINT_GLSL}
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.05, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

// ---- the globe ---------------------------------------------------------------------
// kind 0 coast, 1 land, 2 ocean (the sphere's body, its rim brighter), 3 an institute's knot,
// 4 its core (aW: institutes there; aV: 1 Vilnius)
const GLOBE_VERT = COMMON + /* glsl */ `
attribute float aKind, aSeed, aStart, aW, aV;
attribute vec3 aOff;
uniform mat3 uRot;
uniform float uR, uShow, uInstT, uFar, uSize, uCoast, uLand, uOcean;
uniform vec3 uColor, uHot, uLit;
varying vec3 vColor; varying float vAlpha;
void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
void main() {
  if (uFar < 0.002) { hide(); return; }
  vec3 n = uRot * position;
  vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float f = dot(n, normalize(cameraPosition - c));
  float front = mix(0.07, 1.0, smoothstep(-0.18, 0.12, f));
  float k = aKind, a = 0.0, s = uSize;
  vec3 p = n * uR, col = uColor;
  if (k < 0.5) { a = uCoast * uShow * front; p *= 1.003; }
  else if (k < 1.5) { a = uLand * uShow * front * (0.6 + 0.8 * hash(aSeed * 3.0)); s *= 0.9; }
  else if (k < 2.5) {
    float rim = pow(1.0 - abs(f), 3.0);
    a = uOcean * uShow * (0.3 + 2.2 * rim) * (f > 0.0 ? 1.0 : 0.35); p *= 0.996; s *= 0.8;
    col = mix(uColor, uHot, 0.3);
  } else {
    float e = smoothstep(aStart, aStart + 0.8, uInstT);
    if (e <= 0.0) { hide(); return; }
    float vil = aV;
    if (k < 3.5) {
      p = n * uR * 1.008 + uRot * aOff * uR;
      a = (0.6 + 0.3 * vil) * e * front; s *= 0.95 + 0.35 * vil;
      col = mix(uHot, uLit, 0.4 + 0.6 * vil);
    } else {
      p = n * uR * 1.012;
      a = (0.85 + 0.15 * vil) * e * front; s *= (2.8 + 0.4 * sqrt(aW)) * (1.0 + 0.6 * vil);
      col = uLit;
    }
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.86 + 0.14 * sin(uTime * (0.6 + aSeed * 1.2) + aSeed * 40.0);
  float ps = uView * s * tw * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 14.0);
  vColor = col;
  vAlpha = a * uFar * coverage(ps) * smoothstep(1.5, 4.0, -mv.z);
}`

// ---- the photo's grains: from the picture to the globe -------------------------------
const PHOTO_VERT = COMMON + /* glsl */ `
attribute vec3 aColor, aDir;
attribute float aSize, aSeed, aOrder, aInst;
uniform mat3 uRot;
uniform float uR, uReveal, uMorph, uFade, uGain, uDense;
uniform vec3 uColor, uLit;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec3 tgt = uRot * aDir * uR * (1.006 + 0.01 * aInst);
  float k = clamp((uMorph - 0.45 * aOrder - 0.1 * aSeed) / 0.45, 0.0, 1.0);
  k = k * k * (3.0 - 2.0 * k);
  // an arc out round the globe: the bend away from its middle, a little up
  vec3 mid = 0.5 * (position + tgt);
  float L = length(position - tgt);
  vec3 ctl = mid + normalize(mid + vec3(0.0, 0.35 * uR, 0.0)) * L * 0.28;
  vec3 p = mix(mix(position, ctl, k), mix(ctl, tgt, k), k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.8 + 0.2 * sin(uTime * (0.8 + aSeed * 1.9) + aSeed * 40.0);
  float r = clamp(uReveal * 1.35 - aSeed * 0.35, 0.0, 1.0);
  // landed, a grain on the far side dims as the globe's own grains do
  vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float f = dot(normalize(uRot * aDir), normalize(cameraPosition - c));
  float back = mix(1.0, mix(0.07, 1.0, smoothstep(-0.18, 0.12, f)), k);
  float ps = uView * aSize * mix(1.0, 0.75, k) * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 14.0);   // capped small: the grains nearest the camera are the fill-rate
  vColor = mix(aColor * uGain, aInst > 0.5 ? uLit : uColor, smoothstep(0.25, 1.0, k));
  vAlpha = r * tw * coverage(ps) * smoothstep(0.5, 2.0, -mv.z) * uFade * mix(1.0, uDense * (1.0 - 0.6 * aInst), k) * back;
}`

function buildGlobe(o, ctx) {
  const g = new Group()
  const P = o.pos || [0, 0, 0]
  g.position.set(P[0] || 0, P[1] || 0, P[2] || 0)
  const R = o.radius ?? 3.8
  const tier = Math.min(3, ctx.tier ?? 0)
  const f = [1, 0.8, 0.55, 0.4][tier]
  const uRot = { value: new Matrix3() }
  const common = { uTime: { value: 0 }, uView: { value: 1 }, uRot, uR: { value: R } }
  const color = lin(o.color || '#9cc4ff'), hot = lin(o.hot || '#dfe8ff'), litc = lin(o.lit || '#ffffff')
  const mat = new ShaderMaterial({
    vertexShader: GLOBE_VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: {
      ...common, uShow: { value: 1 }, uInstT: { value: 1e4 }, uFar: { value: 1 }, uSize: { value: o.size ?? 0.5 },
      uCoast: { value: o.coast ?? 1.0 }, uLand: { value: o.land ?? 0.24 }, uOcean: { value: o.ocean ?? 0.06 },
      uColor: { value: new Vector3(...color) }, uHot: { value: new Vector3(...hot) }, uLit: { value: new Vector3(...litc) },
    },
  })
  const u = mat.uniforms
  let pts = null, photo = null, alive = true, loaded = false, data = null, targets = null, inst = []
  let resolveReady
  const ready = new Promise((r) => { resolveReady = r })

  // the turn: the centre's longitude C(t) = lon - spin (t - tRef), tRef the moment the globe has
  // formed (or its first frame, when nothing started it)
  const tilt = (o.tilt ?? 26) * D2R, roll = (o.roll ?? -8) * D2R, lon0 = o.lon ?? 30, spin = o.spin ?? 1.5
  const m4 = new Matrix4(), mA = new Matrix4(), mB = new Matrix4()
  const rotAt = (C, out) => {
    m4.makeRotationZ(roll).multiply(mA.makeRotationX(tilt)).multiply(mB.makeRotationY(-C * D2R))
    return out.setFromMatrix4(m4)
  }

  const offLatch = places.when(() => {
    fetch(ctx.asset('/' + String(o.src || 'data/globe.json').replace(/^\//, '')))
      .then((r) => { if (!r.ok) throw new Error(r.status + ' ' + o.src); return r.json() })
      .then((d) => {
        if (!alive) return
        data = d
        const out = { pos: [], kind: [], seed: [], start: [], w: [], v: [], off: [] }
        const push = (p, kind, start = 0, w = 0, v = 0, off = [0, 0, 0]) => {
          out.pos.push(...p); out.kind.push(kind); out.seed.push(Math.random()); out.start.push(start); out.w.push(w); out.v.push(v); out.off.push(...off)
        }
        targets = []
        // coastlines: grains along each line, about every `spacing` degrees of arc
        const sp = (o.spacing ?? 0.3) / f
        for (const l of d.coast) {
          for (let i = 2; i < l.length; i += 2) {
            const a = dir(l[i - 2] / 10, l[i - 1] / 10), b = dir(l[i] / 10, l[i + 1] / 10)
            const ang = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])) / D2R
            let n = ang / sp; n = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0)
            for (let k = 0; k < n; k++) {
              const t = Math.random(), j = 0.0025
              const q = [a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * j, a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * j, a[2] + (b[2] - a[2]) * t + (Math.random() - 0.5) * j]
              const L = Math.hypot(...q); q[0] /= L; q[1] /= L; q[2] /= L
              push(q, 0); targets.push(q)
            }
          }
        }
        // the land's faint fill
        const per = Math.max(1, Math.round(2 * f))
        for (let i = 0; i < d.land.length; i += 2) {
          for (let k = 0; k < per; k++) {
            const q = dir(d.land[i] / 10 + (Math.random() - 0.5) * 1.6, d.land[i + 1] / 10 + (Math.random() - 0.5) * 1.6)
            push(q, 1); if (k === 0 && Math.random() < 0.5) targets.push(q)
          }
        }
        // the sphere's body: a Fibonacci lattice
        const NO = Math.round(6000 * f), ga = Math.PI * (3 - Math.sqrt(5))
        for (let i = 0; i < NO; i++) {
          const y = 1 - (2 * (i + 0.5)) / NO, r = Math.sqrt(1 - y * y), th = ga * i
          push([r * Math.sin(th), y, r * Math.cos(th)], 2)
        }
        // the institutes: Vilnius last; the others in a random order over 2 s
        inst = d.inst.map((p) => ({ d: dir(p.p[0] / 100, p.p[1] / 100), n: p.n || 1, v: p.v ? 1 : 0 }))
        const order = inst.map((_, i) => i).sort(() => Math.random() - 0.5)
        order.forEach((i, k) => { inst[i].start = inst[i].v ? 2.0 : 1.8 * k / Math.max(1, order.length - 1) })
        const KN = Math.round(48 * f)
        for (const p of inst) {
          const rr = 0.012 * Math.sqrt(p.n) * (p.v ? 1.6 : 1)
          for (let k = 0; k < KN; k++) {
            const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = rr * Math.cbrt(Math.random())
            push(p.d, 3, p.start, p.n, p.v, [r * q * Math.cos(ph), r * z, r * q * Math.sin(ph)])
          }
          push(p.d, 4, p.start, p.n, p.v)
        }
        const geo = new BufferGeometry()
        const F = (a) => new Float32Array(a)
        geo.setAttribute('position', new BufferAttribute(F(out.pos), 3))
        for (const [k, a, n] of [['aKind', out.kind, 1], ['aSeed', out.seed, 1], ['aStart', out.start, 1], ['aW', out.w, 1], ['aV', out.v, 1], ['aOff', out.off, 3]]) geo.setAttribute(k, new BufferAttribute(F(a), n))
        pts = new Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 10
        pts.onBeforeRender = (r) => { u.uView.value = viewScale(r) }
        g.add(pts)
        loaded = true
        resolveReady(true)
      })
      .catch((e) => { loaded = true; resolveReady(false); console.warn('stage: globe failed', e) })
  })

  // ---- the sequence ----------------------------------------------------------------
  let now = 0, last = null, t0 = null, startReq = false, tRef = null, done = true
  const el = () => (t0 == null ? -1 : now - t0)
  const wp = new Vector3()
  const self = {
    ready, R,
    center: () => g.getWorldPosition(new Vector3()),
    elapsed: () => (startReq ? 0 : el()),
    // the photo's grains: `s` the sample (uv, col, lum, n), `pos` their world places along their
    // pixels' rays, `cam` the camera's world position (the globe's facing side at landing)
    prime(s, pos, cam, { gain = 1.25, size = 0.5, dense = 0.5, share = 0.22 } = {}) {
      if (!loaded || !targets) return false
      const c = self.center()
      const n = s.n
      const local = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) { local[i * 3] = pos[i * 3] - c.x; local[i * 3 + 1] = pos[i * 3 + 1] - c.y; local[i * 3 + 2] = pos[i * 3 + 2] - c.z }
      // targets on the side that faces the camera when the grains land
      const M = rotAt(lon0 - spin * (T.morph + T.fly * 0.75 - (T.globe + 1.2)), new Matrix3())
      const toCam = new Vector3().subVectors(cam, c).normalize()
      const v = new Vector3()
      const facing = (q) => v.set(q[0], q[1], q[2]).applyMatrix3(M).dot(toCam)
      const front = targets.filter((q) => facing(q) > 0.15)
      const frontInst = inst.filter((p) => facing(p.d) > 0.05)
      const wsum = frontInst.reduce((a, p) => a + Math.sqrt(p.n), 0)
      const pickInst = () => { let r = Math.random() * wsum; for (const p of frontInst) { r -= Math.sqrt(p.n); if (r <= 0) return p } return frontInst[frontInst.length - 1] }
      const dirs = new Float32Array(n * 3), isInst = new Float32Array(n), ord = new Float32Array(n), sz = new Float32Array(n), sd = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        let q
        if (frontInst.length && Math.random() < share) {
          const p = pickInst(); isInst[i] = 1
          const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, qq = Math.sqrt(1 - z * z), r = 0.02 * Math.sqrt(p.n) * Math.cbrt(Math.random())
          q = [p.d[0] + r * qq * Math.cos(ph), p.d[1] + r * z, p.d[2] + r * qq * Math.sin(ph)]
        } else q = front.length ? front[(Math.random() * front.length) | 0] : targets[(Math.random() * targets.length) | 0]
        dirs[i * 3] = q[0]; dirs[i * 3 + 1] = q[1]; dirs[i * 3 + 2] = q[2]
        // the picture's lower half (the people) sets out first, from the middle out
        const ux = s.uv[i * 2] - 0.5, uy = s.uv[i * 2 + 1]
        ord[i] = Math.min(1, Math.max(0, 0.55 * (1 - uy) + 0.45 * Math.abs(ux) * 2 + 0.1 * Math.random()))
        sd[i] = Math.random()
        sz[i] = size * (0.6 + 0.8 * Math.random()) * (0.8 + 0.6 * s.lum[i])
      }
      if (photo && photo.geometry.getAttribute('position').count !== n) { g.remove(photo); photo.geometry.dispose(); photo.material.dispose(); photo = null }
      if (!photo) {
        const geo = new BufferGeometry()
        geo.setAttribute('position', new BufferAttribute(local, 3))
        geo.setAttribute('aColor', new BufferAttribute(s.col, 3))
        for (const [k, a, m] of [['aDir', dirs, 3], ['aInst', isInst, 1], ['aOrder', ord, 1], ['aSize', sz, 1], ['aSeed', sd, 1]]) geo.setAttribute(k, new BufferAttribute(a, m))
        const pm = new ShaderMaterial({
          vertexShader: PHOTO_VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
          uniforms: {
            ...common, uReveal: { value: 0 }, uMorph: { value: 0 }, uFade: { value: 1 }, uGain: { value: gain }, uDense: { value: dense },
            uColor: { value: new Vector3(...color) }, uLit: { value: new Vector3(...litc) },
          },
        })
        photo = new Points(geo, pm); photo.frustumCulled = false; photo.renderOrder = 11
        photo.onBeforeRender = (r) => { u.uView.value = viewScale(r) }
        g.add(photo)
      } else {
        const ga = photo.geometry
        for (const [k, a] of [['position', local], ['aColor', s.col], ['aDir', dirs], ['aInst', isInst], ['aOrder', ord], ['aSize', sz], ['aSeed', sd]]) { const at = ga.getAttribute(k); at.array.set(a); at.needsUpdate = true }
      }
      const pu = photo.material.uniforms
      pu.uReveal.value = 0; pu.uMorph.value = 0; pu.uFade.value = 1
      photo.visible = true
      // the globe stands hidden until the grains make it
      u.uShow.value = 0; u.uInstT.value = -1
      done = false
      return true
    },
    start() { startReq = true; done = false },
    // left mid-way, or nothing to dissolve: the globe whole at once
    finish() {
      startReq = false
      if (t0 != null && !done) tRef = now - (el() - (T.hold + T.globe + 1.2))
      t0 = null; done = true
      u.uShow.value = 1; u.uInstT.value = 1e4
      if (photo) photo.visible = false
    },
  }
  collab.inst = self

  return {
    group: g, labels: [],
    api: { busy: () => collab.pending || startReq || (!done && t0 != null && el() < T.hold + T.end) || (collab.pending && !loaded) },
    update(t, cam) {
      const dt = last == null ? 0 : Math.max(0, t - last); last = t; now = t
      u.uTime.value = t
      if (tRef == null) tRef = t
      if (startReq) { startReq = false; t0 = t; tRef = t + T.hold + T.globe + 1.2 }
      rotAt(lon0 - spin * (t - tRef), uRot.value)
      if (cam) { g.getWorldPosition(wp); const dd = wp.distanceTo(cam); u.uFar.value = 1 - Math.min(1, Math.max(0, (dd - 40) / 25)) }
      if (pts) pts.visible = u.uFar.value > 0.002
      if (!done && t0 != null) {
        const e = el(), H = T.hold
        const sm = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k) }
        u.uShow.value = sm(H + T.globe, H + T.globe + 1.2, e)
        u.uInstT.value = e - (H + T.inst)
        if (photo) {
          const pu = photo.material.uniforms
          pu.uReveal.value = Math.min(1, Math.max(0, (e - H) / T.dissolve) * 1.3)
          pu.uMorph.value = Math.min(1, Math.max(0, (e - H - T.morph) / T.fly))
          pu.uFade.value = 1 - sm(H + T.fade, H + T.fade + 1.2, e)
          photo.visible = pu.uFade.value > 0
        }
        if (e >= H + T.end) { done = true; t0 = null; u.uShow.value = 1; u.uInstT.value = 1e4; if (photo) photo.visible = false }
      }
      void dt
    },
    dispose() { alive = false; offLatch(); if (collab.inst === self) collab.inst = null },
  }
}

export function installGlobe(registerBuilder) {
  registerBuilder('collab-globe', buildGlobe, { fields: ['pos'] })
}

// ---- the picture → grains (from takeover.js, copied: that file is the opener's) -------------
export function sampleFrame(img, { n = 140000, w = 960, h = 540, gamma = 1.0, floor = 0.035, sat = 1.25, seed = 1, norm = 0.55 } = {}) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d', { willReadFrequently: true })
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s
  g.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  const px = g.getImageData(0, 0, w, h).data
  const cdf = new Float64Array(w * h)
  let acc = 0
  for (let i = 0; i < w * h; i++) {
    const l = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
    acc += l > floor ? Math.pow(l - floor, gamma) : 0
    cdf[i] = acc
  }
  const rnd = mulberry(seed)
  const uv = new Float32Array(n * 2), col = new Float32Array(n * 3), lum = new Float32Array(n)
  for (let k = 0; k < n; k++) {
    const t = rnd() * acc
    let lo = 0, hi = w * h - 1
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < t) lo = mid + 1; else hi = mid }
    const x = lo % w, y = (lo / w) | 0
    uv[k * 2] = (x + rnd()) / w
    uv[k * 2 + 1] = (y + rnd()) / h
    const r0 = px[lo * 4] / 255, g0 = px[lo * 4 + 1] / 255, b0 = px[lo * 4 + 2] / 255
    const l0 = 0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0
    const r = clamp01(l0 + (r0 - l0) * sat), gg = clamp01(l0 + (g0 - l0) * sat), b = clamp01(l0 + (b0 - l0) * sat)
    const m = Math.max(r, gg, b, 1e-3)
    col[k * 3] = r * (1 - norm) + (r / m) * norm
    col[k * 3 + 1] = gg * (1 - norm) + (gg / m) * norm
    col[k * 3 + 2] = b * (1 - norm) + (b / m) * norm
    lum[k] = 0.2126 * r + 0.7152 * gg + 0.0722 * b
  }
  return { n, uv, col, lum }
}

// each grain on its pixel's line of sight from the camera, `near`–`far` units deep (a smooth
// noise over the picture), so from the camera the cloud is the picture
export function placeAlongRays(s, camera, rect, view, { near = 8, far = 22, relief = 0.85, jitter = 0.03, lift = 0.05, seed = 2 } = {}) {
  camera.updateMatrixWorld()
  const m = camera.matrixWorld
  const tanH = Math.tan((camera.fov * Math.PI) / 360), aspect = camera.aspect
  const rnd = mulberry(seed)
  const pos = new Float32Array(s.n * 3)
  const v = new Vector3()
  for (let k = 0; k < s.n; k++) {
    const u = s.uv[k * 2], w = s.uv[k * 2 + 1]
    const sx = rect.left + u * rect.width, sy = rect.top + w * rect.height
    const nx = ((sx - view.left) / view.width) * 2 - 1
    const ny = 1 - ((sy - view.top) / view.height) * 2
    const d = clamp01(0.5 + relief * (fbm(u * 2.2, w * 2.2 * (rect.height / rect.width) * 1.78) - 0.5) + jitter * (rnd() - 0.5) - lift * s.lum[k])
    const z = near + (far - near) * d
    v.set(nx * tanH * aspect * z, ny * tanH * z, -z).applyMatrix4(m)
    pos[k * 3] = v.x; pos[k * 3 + 1] = v.y; pos[k * 3 + 2] = v.z
  }
  return pos
}

const clamp01 = (x) => Math.min(1, Math.max(0, x))
function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
function hash2(x, y) { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h) }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
function fbm(x, y) { return 0.55 * vnoise(x, y) + 0.3 * vnoise(x * 2.1 + 5.2, y * 2.1 + 1.3) + 0.15 * vnoise(x * 4.3 + 9.7, y * 4.3 + 3.1) }
