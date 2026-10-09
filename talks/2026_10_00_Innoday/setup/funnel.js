import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Vector3,
  Mesh, MeshBasicMaterial, CircleGeometry, TextureLoader, SRGBColorSpace, Color, DoubleSide,
} from 'three'
import { POINT_GLSL, viewScale } from './view.js'

// Innoday's opening form, on the engine's stage (slidev-addon-stage):
//
//   funnel   the history of the Universe as the NASA/WMAP "timeline of the
//            universe" figure draws it, in grains: a bell lying on its side,
//            a white-blue Big Bang flare at the narrow end, inflation flaring
//            the neck fast, the CMB as a disk across the narrow end in a
//            WMAP-like palette, a pale blue afterglow, the dark ages, the first
//            stars, then galaxies (blue, white, gold, violet, some spirals)
//            ever denser and brighter toward the mouth, which widens a little
//            faster at the end (accelerating expansion). A clean wireframe of
//            rings and lines, and a faint perspective floor grid below.
//
// The CMB disk is the Planck 2018 SMICA-noSZ map (ESA and the Planck
// Collaboration): with `cmbDisk`, a picture (public/figures/cmb_disk.jpg,
// rendered straight from the HEALPix map: the northern Galactic hemisphere,
// azimuthal equal-area, smoothed to 1°, WMAP-like colours); without it, grains
// coloured from public/figures/cmb_wmap.png. Either way one hemisphere.
//
//   { type: funnel, pos, axis: 'z+' | 'z-' | 'x+' | 'x-', length: 26, mouth: 6.3,
//     neck: 3.4, cmb: 'figures/cmb_wmap.png', rings: 15, lines: 16,
//     galaxies: 520, floor: true, alpha: 0.6, size: 1 }
//
// s runs along the axis from the CMB disk (s = 0, at pos) to the mouth
// (s = length); the inflation neck and the Big Bang lie just before it (s < 0).

const hash = (n) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s) }
const gauss = (n) => { let v = 0; for (let k = 0; k < 4; k++) v += hash(n * 7.31 + k * 1.37); return (v - 2) / 1.15 }

const VERT = /* glsl */ `
attribute vec3 aColor; attribute float aSize, aSeed, aTw, aAlpha, aFlare, aDisk;
uniform float uTime, uSize, uAlpha, uFlare, uDisk;
varying vec3 vColor; varying float vAlpha;
${POINT_GLSL}
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 1.0 - aTw * (0.5 - 0.5 * sin(uTime * (0.7 + aSeed * 1.9) + aSeed * 40.0));
  // sized to the frame (setup/view.js), capped, fading out within a unit of the camera (the camera flies through)
  float ps = uView * uSize * aSize * tw * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 48.0);
  vColor = aColor; vAlpha = uAlpha * aAlpha * tw * coverage(ps) * smoothstep(0.25, 1.0, -mv.z) * mix(1.0, uFlare, aFlare) * mix(1.0, uDisk, aDisk);
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

// The bell: s = 0 is the CMB disk. Before it a short neck flares fast out of
// the Big Bang (inflation); after it the funnel widens almost linearly, and a
// little faster over the last stretch (accelerating expansion).
function radius(s, L, neck, mouth) {
  if (s < 0) return Math.max(0.05, neck * Math.exp(s * 2.4))       // the inflation neck, s in [-1.3, 0]
  const t = s / L
  return neck + (mouth - neck) * (0.82 * t + 0.18 * Math.pow(t, 4))
}

function buildFunnel(o, ctx) {
  const L = o.length ?? 26, mouth = o.mouth ?? 6.3, neck = o.neck ?? 3.4
  const R = (s) => radius(s, L, neck, mouth)
  // point: [s, a, b, r, g, b, size, twinkle, alpha, kind]; kind 1 = CMB disk
  const pts = []
  let flare = 0
  const add = (s, a, b, c, size = 1, tw = 0.2, al = 1, kind = 0) => pts.push([s, a, b, c[0], c[1], c[2], size, tw, al, kind, flare])
  const W = [1, 1, 1], ICE = [0.78, 0.88, 1]

  // the wireframe: rings and lines as dense lines of fine white grains
  const rings = o.rings ?? 15, lines = o.lines ?? 16
  for (let k = 0; k < rings; k++) {
    const s = L * (k / (rings - 1)), r = R(s), n = Math.round(2 * Math.PI * r / 0.035)
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; add(s, r * Math.cos(t), r * Math.sin(t), W, 1.05, 0.03, 1) }
  }
  for (let k = 0; k < lines; k++) {
    const t = (k / lines) * Math.PI * 2, n = Math.round(L / 0.035)
    for (let i = 0; i <= n; i++) { const s = L * (i / n), r = R(s); add(s, r * Math.cos(t), r * Math.sin(t), W, 1.05, 0.03, 1) }
  }
  // the inflation neck: a faint flaring sheath from the flare to the disk
  for (let i = 0; i < 1600; i++) {
    const s = -1.3 * hash(i * 1.9), t = hash(i * 3.7) * Math.PI * 2, r = R(s)
    add(s, r * Math.cos(t), r * Math.sin(t), ICE, 0.55, 0.3, 0.45)
  }
  // the Big Bang: a white-blue flare with a soft glow and spikes, just before the neck
  const bb = -2.6
  flare = 1
  for (let i = 0; i < 900; i++) {   // the core
    const r = 0.6 * Math.abs(gauss(i)), t = hash(i * 2.3) * Math.PI * 2, u = hash(i * 4.1) * 2 - 1
    add(bb + r * u, r * Math.sqrt(1 - u * u) * Math.cos(t), r * Math.sqrt(1 - u * u) * Math.sin(t), W, 4.5, 0.1, 1)
  }
  for (let i = 0; i < 2600; i++) {   // the glow: big, soft
    const r = 4.2 * Math.abs(gauss(i + 900)), t = hash(i * 5.9) * Math.PI * 2, u = hash(i * 6.7) * 2 - 1
    add(bb + r * u * 0.6, r * Math.sqrt(1 - u * u) * Math.cos(t), r * Math.sqrt(1 - u * u) * Math.sin(t), [0.72, 0.86, 1], 14, 0.06, 0.4)
  }
  for (let k = 0; k < 10; k++) {    // spikes, as a lens draws a bright light
    const t = (k / 10) * Math.PI * 2 + 0.2, len = 4 + 3 * hash(k * 3.3)
    for (let i = 0; i < 160; i++) { const d = (i / 160) * len; add(bb - d * 0.15, d * Math.cos(t), d * Math.sin(t), [0.85, 0.92, 1], 1.4, 0.2, 0.8 * (1 - i / 160)) }
  }
  flare = 0
  // the CMB: a disk across the narrow end; colours come from the map
  // (with `cmbDisk` the disk is a picture instead: see below)
  const capN = o.cmbDisk ? 0 : 150, capFirst = pts.length
  for (let i = 0; i < capN; i++) for (let j = 0; j < capN; j++) {
    const u = (i + 0.5) / capN * 2 - 1, v = (j + 0.5) / capN * 2 - 1
    if (u * u + v * v > 1) continue
    const r = R(0) * 0.985
    add(0.02, u * r, v * r, [0.6, 0.85, 0.5], 1.15, 0.05, 1, 1)
  }
  const capLast = pts.length
  // the afterglow: a bright pale-blue ring at the wall just after the disk
  for (let i = 0; i < 5200; i++) {
    const s = 0.3 + 0.45 * Math.pow(hash(i * 6.1), 1.2), r = R(s) * (0.94 + 0.06 * hash(i * 3.9)), t = hash(i * 7.3) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), [0.7, 0.85, 1], 1.5, 0.1, 1.2 * (1 - (s - 0.3) / 0.45))
  }
  // and a faint pale-blue sheet across it (`cmbSheet` scales it: in front of the picture
  // disk it would pale the map, so there it is thinner)
  const sheetK = o.cmbSheet ?? 1
  for (let i = 0; i < (sheetK > 0 ? 2600 : 0); i++) {
    const s = 0.15 + 1.2 * Math.pow(hash(i * 8.3), 1.5), r = R(s) * 0.97 * Math.sqrt(hash(i * 2.2)), t = hash(i * 9.1) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), [0.66, 0.82, 1], 3.0, 0.12, sheetK * (1 - (s - 0.15) / 1.2))
  }
  // the dark ages: few, dim grains
  for (let i = 0; i < 500; i++) {
    const s = 1.4 + hash(i * 7.7) * 3.6, r = R(s) * 0.92 * Math.sqrt(hash(i * 2.9)), t = hash(i * 4.1) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), [0.35, 0.4, 0.6], 0.6, 0.1, 0.5)
  }
  // the first stars: scattered bright points
  for (let i = 0; i < 320; i++) {
    const s = 5 + hash(i * 9.1) * 3, r = R(s) * 0.88 * Math.sqrt(hash(i * 6.3)), t = hash(i * 8.7) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), hash(i) > 0.5 ? [0.75, 0.88, 1] : [1, 0.95, 0.85], 2.2, 0.6, 1)
  }
  // the body: a faint blue-violet haze of fine grains inside the bell, thicker toward the mouth
  for (let i = 0; i < 16000; i++) {
    const q = Math.pow(hash(i * 2.17), 0.75), s = 5 + (L - 5.2) * q
    const r = R(s) * 0.95 * Math.sqrt(hash(i * 5.31)), t = hash(i * 8.17) * Math.PI * 2
    const c = hash(i * 1.71) < 0.55 ? [0.38, 0.45, 0.95] : [0.6, 0.4, 0.9]
    add(s, r * Math.cos(t), r * Math.sin(t), c, 2.6, 0.05, 0.24 + 0.32 * q)
  }
  // galaxies: colourful clusters, some larger spirals, denser and brighter toward the mouth
  const G = o.galaxies ?? 2000
  const palette = [[0.55, 0.72, 1], [1, 1, 1], [1, 0.82, 0.45], [0.78, 0.6, 1], [0.6, 0.9, 1], [1, 0.65, 0.5]]
  for (let g = 0; g < G; g++) {
    const q = Math.pow(hash(g * 1.13), 0.6)                 // more of them toward the mouth
    const s = 8 + (L - 8.3) * q
    const r = R(s) * 0.86 * Math.sqrt(hash(g * 2.71)), t = hash(g * 3.33) * Math.PI * 2
    const cy = r * Math.cos(t), cz = r * Math.sin(t)
    const col = palette[Math.floor(hash(g * 4.4) * palette.length)]
    const bright = 0.55 + 0.4 * q
    const spiral = hash(g * 7.7) < 0.18, big = spiral ? 0.45 + 0.55 * hash(g * 5.5) : 0.08 + 0.18 * hash(g * 5.5)
    const tilt = hash(g * 6.6) * Math.PI, turn = hash(g * 8.8) * Math.PI * 2
    const per = spiral ? 220 : 26
    for (let k = 0; k < per; k++) {
      let dx, dy
      if (spiral) {   // two arms
        const arm = k % 2, f = Math.pow(hash(g * 31 + k * 7.1), 0.8), ang = turn + arm * Math.PI + f * 4.2
        const rr = big * f + 0.03 * gauss(g * 11 + k)
        dx = rr * Math.cos(ang); dy = rr * Math.sin(ang)
      } else {
        const a = hash(g * 31 + k * 7.1) * Math.PI * 2, rr = big * Math.pow(hash(g * 17 + k * 3.7), 1.6)
        dx = rr * Math.cos(a); dy = rr * Math.sin(a)
      }
      add(s + dx, cy + dy * Math.cos(tilt), cz + dy * Math.sin(tilt), col, k < 3 ? 3.0 : 0.85, 0.3, bright)
    }
  }
  // the floor: a faint perspective grid below the funnel
  const floorFirst = pts.length
  if (o.floor !== false) {
    const y = -(mouth + 1.2), x0 = -8, x1 = L + 10, z0 = -18, z1 = 18, step = 2
    for (let x = x0; x <= x1; x += step) for (let i = 0; i <= 500; i++) add(x, y, z0 + (z1 - z0) * i / 500, [0.5, 0.6, 0.9], 1.3, 0.02, 0.9)
    for (let z = z0; z <= z1; z += step) for (let i = 0; i <= 700; i++) add(x0 + (x1 - x0) * i / 700, y, z, [0.5, 0.6, 0.9], 1.3, 0.02, 0.9)
  }

  // into world space along the axis
  const N = pts.length, pos = new Float32Array(N * 3), color = new Float32Array(N * 3)
  const size = new Float32Array(N), seed = new Float32Array(N), tw = new Float32Array(N), al = new Float32Array(N), fl = new Float32Array(N), dk = new Float32Array(N)
  const axis = o.axis || 'z+'
  // (s, a, b) → world: a is up (y) for the floor to lie flat; b runs across
  const place = (s, a, b) => axis === 'z-' ? [b, a, -s] : axis === 'z+' ? [b, a, s] : axis === 'x-' ? [-s, a, b] : [s, a, b]
  pts.forEach((p, i) => {
    pos.set(place(p[0], p[1], p[2]), i * 3); color.set([p[3], p[4], p[5]], i * 3)
    size[i] = p[6]; tw[i] = p[7]; al[i] = p[8]; fl[i] = p[10]; dk[i] = p[9] === 1 ? 1 : 0; seed[i] = hash(i * 0.731)
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  const colAttr = new BufferAttribute(color, 3)
  geo.setAttribute('aColor', colAttr); geo.setAttribute('aSize', new BufferAttribute(size, 1))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1)); geo.setAttribute('aTw', new BufferAttribute(tw, 1))
  geo.setAttribute('aAlpha', new BufferAttribute(al, 1)); geo.setAttribute('aFlare', new BufferAttribute(fl, 1)); geo.setAttribute('aDisk', new BufferAttribute(dk, 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uView: { value: 1 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.6 }, uFlare: { value: 1 }, uDisk: { value: 1 } },
  })
  const points = new Points(geo, mat); points.frustumCulled = false
  const g = new Group(); g.add(points)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  // The Big Bang flare lies on the axis just behind the CMB disk. Seen from
  // outside (the figure's three-quarter view) it blazes beside the disk; looking
  // down the axis from the mouth side it would shine through the disk's middle,
  // so there it fades: by the camera's offset from the axis against its distance along it.
  const cam = new Vector3()
  const along = (v) => axis === 'z-' ? -v.z : axis === 'z+' ? v.z : axis === 'x-' ? -v.x : v.x
  const across = (v) => axis === 'z-' || axis === 'z+' ? Math.hypot(v.x, v.y) : Math.hypot(v.y, v.z)
  points.onBeforeRender = (r, scene, camera) => {
    mat.uniforms.uView.value = viewScale(r)
    g.worldToLocal(cam.copy(camera.position))
    const sAx = along(cam), off = across(cam)
    const k = sAx <= 0 ? 1 : Math.min(1, Math.max(0, (off / sAx - 0.6) / 0.3))
    mat.uniforms.uFlare.value = 0.06 + 0.94 * k * k * (3 - 2 * k)
    // the CMB disk seen at an angle: its grains overlap in projection and add up
    // toward white, so it dims with the angle and keeps its colours
    const face = Math.abs(sAx) / Math.max(Math.hypot(sAx, off), 1e-3)
    mat.uniforms.uDisk.value = 0.6 + 0.4 * face
  }

  // The CMB as a picture (owner, 9 Oct: "a real image of cmb at that plane
  // exactly"): a disk in the old grain disk's plane, textured with the Planck map
  // projected the same way (the northern Galactic hemisphere, azimuthal
  // equal-area, l = 0 up, l = 90° right as seen from the mouth). Drawn opaque, so
  // nothing adds up toward white on a small screen. `cmbDisk`: the image (a
  // square, the disk inscribed; `cmbDiskSmall` for touch devices); `cmbTint`:
  // its brightness (0–1).
  let alive = true, diskTex = null
  const r0d = R(0) * 0.985
  const diskMat = new MeshBasicMaterial({ color: new Color().setScalar(o.cmbTint ?? 0.85), side: DoubleSide })
  const disk = new Mesh(new CircleGeometry(r0d, 192), diskMat)
  disk.visible = false
  if (o.cmbDisk && axis === 'z+') {
    // the circle faces +z (the mouth); its u runs with world x (b, right), v with world y (a, up)
    disk.position.set(0, 0, 0.02)
    g.add(disk)
    // a phone or tablet (coarse pointer) takes the smaller image: a quarter of the GPU memory
    let small = false
    try { small = !!o.cmbDiskSmall && matchMedia('(pointer: coarse)').matches } catch {}
    const src = small ? o.cmbDiskSmall : o.cmbDisk
    new TextureLoader().load(`${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`, (tex) => {
      if (!alive) { tex.dispose(); return }
      tex.colorSpace = SRGBColorSpace; tex.anisotropy = ctx?.anisotropy || 1
      diskMat.map = tex; diskMat.needsUpdate = true; diskTex = tex; disk.visible = true
    })
  }

  // the grain disk's colours from the map: the hemisphere seen from the mouth,
  // azimuthal equal-area (the disk's centre is a pole of the map)
  const img = new Image()
  img.onload = () => {
    if (!alive) return
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
    const x2 = c.getContext('2d'); x2.drawImage(img, 0, 0)
    const data = x2.getImageData(0, 0, c.width, c.height).data
    const r0 = R(0) * 0.985
    for (let i = capFirst; i < capLast; i++) {
      const u = pts[i][1] / r0, v = pts[i][2] / r0
      const rho = Math.min(1, Math.hypot(u, v)) * Math.SQRT2, ang = 2 * Math.asin(rho / 2)
      const lat = Math.PI / 2 - ang, lon = Math.atan2(v, u)
      const px = Math.min(c.width - 1, Math.floor(((lon + Math.PI) / (2 * Math.PI)) * c.width))
      const py = Math.min(c.height - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * c.height))
      const k = (py * c.width + px) * 4
      // saturate and lift: the additive gamma greys mid colours from far away
      const rr = data[k] / 255, gg = data[k + 1] / 255, bl = data[k + 2] / 255, m = (rr + gg + bl) / 3, sat = 1.5, lift = 1.0
      color.set([Math.min(1, (m + (rr - m) * sat) * lift), Math.min(1, (m + (gg - m) * sat) * lift), Math.min(1, (m + (bl - m) * sat) * lift)], i * 3)
    }
    colAttr.needsUpdate = true
  }
  if (capN) img.src = `${import.meta.env.BASE_URL}${(o.cmb || 'figures/cmb_wmap.png').replace(/^\//, '')}`
  void floorFirst

  return {
    group: g, labels: [],
    update(t) { mat.uniforms.uTime.value = t },
    dispose() { alive = false; geo.dispose(); mat.dispose(); disk.geometry.dispose(); diskMat.dispose(); diskTex?.dispose() },
  }
}

export function installFunnel(registerBuilder) {
  registerBuilder('funnel', buildFunnel, { fields: ['pos'] })
}
