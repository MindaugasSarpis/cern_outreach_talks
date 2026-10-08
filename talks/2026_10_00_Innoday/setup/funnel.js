import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color,
} from 'three'

// Innoday's opening form, on the engine's stage (slidev-addon-stage):
//
//   funnel   the history of the Universe as a bell of grains, the way the
//            classic WMAP figure draws it: the Big Bang a point of light at the
//            narrow end, inflation flaring out of it, the cosmic microwave
//            background (CMB) a glowing cap across the funnel 380 000 years
//            later, the dark ages, the first stars, then galaxies ever more of
//            them towards the mouth, which widens faster at the end
//            (accelerating expansion). The camera comes in at the mouth from our
//            galaxy and flies back down the funnel, back in time, to the CMB.
//
// The CMB cap carries the Planck temperature map: public/figures/cmb_planck.png
// is the Planck 2018 SMICA map (ESA and the Planck Collaboration), inpainted,
// reprojected to longitude/latitude and coloured on a Planck-style scale; the
// cap shows one hemisphere of it. Until the image has loaded the cap is pale.
//
//   { type: funnel, pos, axis: 'z-' | 'z+' | 'x+' | 'x-', length: 26, mouth: 9,
//     neck: 1.4, cmbAt: 1.6, cmb: 'figures/cmb_planck.png', rings: 15, lines: 12,
//     galaxies: 420, grains (per galaxy): 46, alpha: 0.55, size: 1 }
//
// The axis runs from the Big Bang (pos) to the mouth (pos + length along axis).

const hash = (n) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s) }

const VERT = /* glsl */ `
attribute vec3 aColor; attribute float aSize, aSeed, aTw;
uniform float uTime, uPixelRatio, uSize, uAlpha;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 1.0 - aTw * (0.5 - 0.5 * sin(uTime * (0.7 + aSeed * 1.9) + aSeed * 40.0));
  gl_PointSize = uPixelRatio * uSize * aSize * tw * (72.0 / max(-mv.z, 0.1));
  vColor = aColor; vAlpha = uAlpha * tw;
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

// Radius of the funnel at distance s from the Big Bang (0..L): a fast flare
// (inflation) to `neck`, slow growth through the middle, faster again at the mouth.
function radius(s, L, neck, mouth) {
  const inflation = neck * (1 - Math.exp(-s / 0.35))
  const t = Math.max(0, s - 0.6) / (L - 0.6)
  return 0.12 + inflation + (mouth - neck) * (0.55 * t + 0.45 * Math.pow(t, 3.2))
}

function buildFunnel(o, ctx) {
  const L = o.length ?? 26, mouth = o.mouth ?? 9, neck = o.neck ?? 1.4, cmbAt = o.cmbAt ?? 1.6
  const R = (s) => radius(s, L, neck, mouth)
  const pts = []   // [s, y, z (cross-section), r, g, b, size, twinkle, kind]; kind 1 = CMB cap
  const add = (s, a, b, col, size = 1, tw = 0.25, kind = 0) => pts.push([s, a, b, col[0], col[1], col[2], size, tw, kind])
  const pale = [0.72, 0.8, 0.95], warm = [1, 0.92, 0.78], white = [1, 1, 1]

  // the wall: rings and lines of fine grains, the wireframe of the figure
  const rings = o.rings ?? 15, lines = o.lines ?? 12
  for (let k = 0; k < rings; k++) {
    const s = cmbAt + (L - cmbAt) * (k / (rings - 1)) ** 1.15, r = R(s), n = Math.round(160 + 40 * r)
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; add(s, r * Math.cos(t), r * Math.sin(t), pale, 0.8, 0.15) }
  }
  for (let k = 0; k < lines; k++) {
    const t = (k / lines) * Math.PI * 2
    for (let i = 0; i < 420; i++) { const s = cmbAt + (L - cmbAt) * (i / 419); const r = R(s); add(s, r * Math.cos(t), r * Math.sin(t), pale, 0.75, 0.15) }
  }
  // the Big Bang: a dense knot of white light, and inflation flaring from it
  for (let i = 0; i < 1100; i++) {
    const s = Math.pow(hash(i * 1.7), 2.2) * cmbAt * 0.85, r = R(s) * Math.sqrt(hash(i * 3.1)), t = hash(i * 5.3) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), s < 0.2 ? [0.9, 0.9, 0.85] : [0.55, 0.5, 0.42], s < 0.2 ? 1.1 : 0.8, 0.4)
  }
  // the CMB: a cap across the funnel, bulging towards the mouth; colours come from the Planck map
  const capN = 120, capFirst = pts.length
  for (let i = 0; i < capN; i++) for (let j = 0; j < capN; j++) {
    const u = (i + 0.5) / capN * 2 - 1, v = (j + 0.5) / capN * 2 - 1, q = u * u + v * v
    if (q > 1) continue
    const r = R(cmbAt) * 0.98
    add(cmbAt + 0.35 * (1 - q), u * r, v * r, [0.95, 0.9, 0.8], 1.05, 0.08, 1)
  }
  const capLast = pts.length
  // the dark ages: few, dim grains
  for (let i = 0; i < 900; i++) {
    const s = cmbAt + 0.6 + hash(i * 7.7) * 3.4, r = R(s) * 0.9 * Math.sqrt(hash(i * 2.9)), t = hash(i * 4.1) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), [0.35, 0.38, 0.55], 0.6, 0.1)
  }
  // the first stars: scattered bright points
  for (let i = 0; i < 260; i++) {
    const s = cmbAt + 4 + hash(i * 9.1) * 3, r = R(s) * 0.85 * Math.sqrt(hash(i * 6.3)), t = hash(i * 8.7) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), hash(i) > 0.5 ? [0.75, 0.85, 1] : warm, 1.6, 0.6)
  }
  // galaxies: small clusters, more of them towards the mouth
  const G = o.galaxies ?? 420, per = o.grains ?? 46
  for (let g = 0; g < G; g++) {
    const s = cmbAt + 6.5 + (L - cmbAt - 6.8) * Math.pow(hash(g * 1.13), 0.7)
    const r = R(s) * 0.82 * Math.sqrt(hash(g * 2.71)), t = hash(g * 3.33) * Math.PI * 2
    const cy = r * Math.cos(t), cz = r * Math.sin(t)
    const h = hash(g * 4.4), col = h < 0.45 ? [0.75, 0.82, 1] : h < 0.8 ? [1, 0.95, 0.88] : [1, 0.78, 0.55]
    const big = 0.12 + 0.28 * hash(g * 5.5), tilt = hash(g * 6.6) * Math.PI
    for (let k = 0; k < per; k++) {
      // a small disc with a bright core
      const a = hash(g * 31 + k * 7.1) * Math.PI * 2, rr = big * Math.pow(hash(g * 17 + k * 3.7), 1.6)
      const dx = rr * Math.cos(a), dy = rr * Math.sin(a) * Math.cos(tilt), dz = rr * Math.sin(a) * Math.sin(tilt)
      add(s + dx, cy + dy, cz + dz, col, k < 4 ? 1.6 : 0.7, 0.3)
    }
  }

  // into world space along the axis
  const N = pts.length, pos = new Float32Array(N * 3), color = new Float32Array(N * 3), size = new Float32Array(N), seed = new Float32Array(N), tw = new Float32Array(N)
  const axis = o.axis || 'z-'
  const place = (s, a, b) => axis === 'z-' ? [a, b, -s] : axis === 'z+' ? [a, b, s] : axis === 'x-' ? [-s, a, b] : [s, a, b]
  pts.forEach((p, i) => {
    pos.set(place(p[0], p[1], p[2]), i * 3); color.set([p[3], p[4], p[5]], i * 3); size[i] = p[6]; tw[i] = p[7]; seed[i] = hash(i * 0.731)
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  const colAttr = new BufferAttribute(color, 3)
  geo.setAttribute('aColor', colAttr); geo.setAttribute('aSize', new BufferAttribute(size, 1))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1)); geo.setAttribute('aTw', new BufferAttribute(tw, 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 } },
  })
  const points = new Points(geo, mat); points.frustumCulled = false
  const g = new Group(); g.add(points)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  // the cap's colours from the Planck map: the hemisphere seen from inside,
  // azimuthal equal-area (the cap's centre is a pole of the map)
  let alive = true
  const img = new Image()
  img.onload = () => {
    if (!alive) return
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
    const x2 = c.getContext('2d'); x2.drawImage(img, 0, 0)
    const data = x2.getImageData(0, 0, c.width, c.height).data
    for (let i = capFirst; i < capLast; i++) {
      const u = pts[i][1] / (R(cmbAt) * 0.98), v = pts[i][2] / (R(cmbAt) * 0.98)
      const rho = Math.min(1, Math.hypot(u, v)) * Math.SQRT2, ang = 2 * Math.asin(rho / 2)
      const lat = Math.PI / 2 - ang, lon = Math.atan2(v, u)
      const px = Math.min(c.width - 1, Math.floor(((lon + Math.PI) / (2 * Math.PI)) * c.width))
      const py = Math.min(c.height - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * c.height))
      const k = (py * c.width + px) * 4
      color.set([data[k] / 255, data[k + 1] / 255, data[k + 2] / 255], i * 3)
    }
    colAttr.needsUpdate = true
  }
  img.src = `${import.meta.env.BASE_URL}${(o.cmb || 'figures/cmb_planck.png').replace(/^\//, '')}`

  return {
    group: g, labels: [], pixelRatio: mat.uniforms.uPixelRatio,
    update(t) { mat.uniforms.uTime.value = t },
    dispose() { alive = false; geo.dispose(); mat.dispose() },
  }
}

export function installFunnel(registerBuilder) {
  registerBuilder('funnel', buildFunnel, { fields: ['pos'] })
}
