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
//            WMAP-like palette, a pale blue afterglow, then (owner, 12 Oct) the
//            dark ages with no stars, the first light (a crowd of small, hot,
//            blue-white proto-galaxies at `dawn`, densest at `peak`), and from
//            there ever fewer, cooler, dimmer galaxies, their groups drifting
//            apart, to a cold dark mouth (today), which widens a little faster
//            at the end (accelerating expansion). A clean wireframe of rings
//            and lines, and a faint perspective floor grid below.
//
// The CMB disk is the Planck 2018 SMICA-noSZ map (ESA and the Planck
// Collaboration): with `cmbDisk`, a picture (public/figures/cmb_disk.jpg,
// rendered straight from the HEALPix map: the northern Galactic hemisphere,
// azimuthal equal-area, smoothed to 1°, WMAP-like colours); without it, grains
// coloured from public/figures/cmb_wmap.png. Either way one hemisphere.
//
//   { type: funnel, pos, axis: 'z+' | 'z-' | 'x+' | 'x-', length: 26, mouth: 6.3,
//     neck: 3.4, cmb: 'figures/cmb_wmap.png', rings: 15, lines: 16,
//     galaxies: 2400, group: 6, spirals: 0.22, haze: 12000, sparks: 1200, dawn: 0.32,
//     peak: 0.37, thin: 0.11, rest: 0.05, spread: [0.12, 1.0], floor: true, alpha: 0.6, size: 1 }
//
// s runs along the axis from the CMB disk (s = 0, at pos) to the mouth
// (s = length); the inflation neck and the Big Bang lie just before it (s < 0).
// The epochs are fractions of the length, t = s / length: the dark ages run
// to `dawn` (keep dawn * length past the slide-4 camera, which stands 7.5 in
// front of the disk: nothing hot between it and the CMB); the galaxies per
// unit of length rise over 0.05 to 1 at `peak`, then fall as
// exp(-(t - peak) / thin) to `rest` of it; `spread` is how far a group's
// members stand from its centre at the dawn and at the mouth. A grown galaxy
// carries about five times a proto-galaxy's light, so `thin` stays short: with
// a slower fall the grown ones just past the peak outshine the crowd at the
// dawn in the side view (slide 3).

const hash = (n) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s) }
const gauss = (n) => { let v = 0; for (let k = 0; k < 4; k++) v += hash(n * 7.31 + k * 1.37); return (v - 2) / 1.15 }
const sstep = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k) }
const mix3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
// a colour ramp: [t, [r, g, b]] stops → the colour at t, linear between them
const ramp = (stops, t) => {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) return mix3(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]))
  return stops[stops.length - 1][1]
}
// a density along t in [0, 1] → a sampler: u in [0, 1) → t, by its tabulated
// cumulative sum (deterministic: u comes from hash, so every build is the same)
function sampler(f, n = 1024) {
  const c = new Float64Array(n + 1)
  for (let i = 0; i < n; i++) c[i + 1] = c[i] + Math.max(0, f((i + 0.5) / n))
  return (u) => {
    const x = u * c[n]; let lo = 0, hi = n
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= x) lo = m; else hi = m }
    return (lo + (x - c[lo]) / Math.max(c[lo + 1] - c[lo], 1e-12)) / n
  }
}
// the galaxies' colour by epoch: hot blue-white at the first light, white, warm
// white, orange, a dim red at the mouth (the brightness falls with it: `glow`)
const HEAT = [[0.30, [0.62, 0.78, 1]], [0.40, [0.86, 0.93, 1]], [0.52, [1, 0.95, 0.86]], [0.68, [1, 0.8, 0.56]], [0.85, [0.95, 0.6, 0.44]], [1, [0.74, 0.44, 0.4]]]
// the haze between them: blue-white hot gas at the dawn, violet, then a cold grey-violet
const HAZE = [[0.30, [0.55, 0.66, 1]], [0.5, [0.55, 0.45, 0.95]], [1, [0.36, 0.32, 0.46]]]

const VERT = /* glsl */ `
attribute vec3 aColor; attribute float aSize, aSeed, aTw, aAlpha, aFlare, aDisk, aLay, aKey;
uniform float uTime, uSize, uAlpha, uFlare, uDisk, uBody, uMesh;
varying vec3 vColor; varying float vAlpha;
${POINT_GLSL}
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 1.0 - aTw * (0.5 - 0.5 * sin(uTime * (0.7 + aSeed * 1.9) + aSeed * 40.0));
  // sized to the frame (setup/view.js), capped, fading out within a unit of the camera (the camera flies through)
  float ps = uView * uSize * aSize * tw * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 48.0);
  // the prologue (funnelSeq below): the body resolves as a whole; the mesh (aLay 1) comes
  // in along its key, the wireframe from the CMB end to the mouth, the floor from under
  // the funnel outward
  float shown = aLay < 0.5 ? uBody : smoothstep(aKey * 0.8, aKey * 0.8 + 0.2, uMesh);
  if (shown < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; }   // not yet: off the frame, nothing to fill
  vColor = aColor; vAlpha = uAlpha * aAlpha * tw * coverage(ps) * smoothstep(0.25, 1.0, -mv.z) * mix(1.0, uFlare, aFlare) * mix(1.0, uDisk, aDisk) * shown;
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
  let flare = 0, mesh = 0
  const add = (s, a, b, c, size = 1, tw = 0.2, al = 1, kind = 0) => pts.push([s, a, b, c[0], c[1], c[2], size, tw, al, kind, flare, mesh])
  const W = [1, 1, 1], ICE = [0.78, 0.88, 1]

  // the wireframe: rings and lines as dense lines of fine white grains
  mesh = 1
  const rings = o.rings ?? 15, lines = o.lines ?? 16
  for (let k = 0; k < rings; k++) {
    const s = L * (k / (rings - 1)), r = R(s), n = Math.round(2 * Math.PI * r / 0.035)
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; add(s, r * Math.cos(t), r * Math.sin(t), W, 1.05, 0.03, 1) }
  }
  for (let k = 0; k < lines; k++) {
    const t = (k / lines) * Math.PI * 2, n = Math.round(L / 0.035)
    for (let i = 0; i <= n; i++) { const s = L * (i / n), r = R(s); add(s, r * Math.cos(t), r * Math.sin(t), W, 1.05, 0.03, 1) }
  }
  mesh = 0
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
  // the epochs (fractions of L; see the header)
  const dawn = o.dawn ?? 0.32, peak = o.peak ?? 0.37, thin = o.thin ?? 0.11, rest = o.rest ?? 0.05
  const sDawn = dawn * L
  const fall = (t, k) => Math.exp(-Math.max(0, t - peak) / k)
  // galaxies per unit of length: none before the dawn, up over 0.05, then thinning out
  const dens = (t) => sstep(dawn, dawn + 0.05, t) * (rest + (1 - rest) * fall(t, thin))
  // a galaxy's brightness: full at the peak, about half at the mouth
  const glow = (t) => 0.5 + 0.5 * fall(t, 0.25)
  // the dark ages: no stars, only a few dim neutral grains of cooling gas
  for (let i = 0; i < 300; i++) {
    const s = 1.4 + hash(i * 7.7) * (sDawn - 1.9), r = R(s) * 0.92 * Math.sqrt(hash(i * 2.9)), t = hash(i * 4.1) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), [0.34, 0.31, 0.33], 0.6, 0.1, 0.35)
  }
  // the first light: hot blue-white sparks crowding in just at the dawn
  for (let i = 0; i < (o.sparks ?? 1200); i++) {
    const s = sDawn + L * 0.07 * Math.pow(hash(i * 9.1), 1.6), r = R(s) * 0.88 * Math.sqrt(hash(i * 6.3)), t = hash(i * 8.7) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), hash(i) > 0.35 ? [0.75, 0.88, 1] : [1, 0.97, 0.9], 2.0, 0.6, 0.9)
  }
  // the body: a haze of fine grains inside the bell, thickest and hottest at the dawn, thin and cold at the mouth
  const hazeAt = sampler((t) => sstep(dawn - 0.01, dawn + 0.06, t) * (0.06 + 0.94 * fall(t, 0.16)))
  for (let i = 0, n = o.haze ?? 12000; i < n; i++) {
    const q = hazeAt(hash(i * 2.17)), s = Math.min(L - 0.2, q * L)
    const r = R(s) * 0.95 * Math.sqrt(hash(i * 5.31)), t = hash(i * 8.17) * Math.PI * 2
    add(s, r * Math.cos(t), r * Math.sin(t), ramp(HAZE, q + 0.05 * (hash(i * 1.71) - 0.5)), 2.6, 0.05, 0.14 + 0.36 * fall(q, 0.22))
  }
  // galaxies, in groups: each group's centre drawn by `dens`; its members stand
  // `spread` apart, from tight at the dawn to loose at the mouth. Small, hot,
  // flickering proto-galaxies first; grown ones (some spirals) after the peak,
  // cooler and dimmer toward the mouth.
  const G = o.galaxies ?? 2400, per0 = o.group ?? 6, sp = o.spread ?? [0.12, 1.0]
  const centreAt = sampler(dens)
  for (let g = 0; g < G; g++) {
    const c = Math.floor(g / per0)
    const tc = centreAt(hash(c * 1.13 + 0.37)), sc = tc * L
    const rc = R(sc) * 0.82 * Math.sqrt(hash(c * 2.71)), ac = hash(c * 3.33) * Math.PI * 2
    const spread = sp[0] + (sp[1] - sp[0]) * sstep(dawn, 1, tc)
    const s = Math.min(L - 0.3, Math.max(sDawn + 0.1, sc + spread * gauss(g * 3.17)))
    let cy = rc * Math.cos(ac) + spread * gauss(g * 4.31), cz = rc * Math.sin(ac) + spread * gauss(g * 5.77)
    const rmax = R(s) * 0.86, rr0 = Math.hypot(cy, cz)
    if (rr0 > rmax) { cy *= rmax / rr0; cz *= rmax / rr0 }
    const t = s / L
    const grown = hash(g * 9.9) < sstep(peak, peak + 0.22, t)     // a proto-galaxy until it has grown
    const spiral = grown && hash(g * 7.7) < (o.spirals ?? 0.22)
    let col = ramp(HEAT, t + 0.08 * (hash(g * 4.4) - 0.5))
    if (spiral) col = mix3(col, [0.72, 0.82, 1], 0.25)            // a spiral still makes stars: a little bluer
    const bright = glow(t)
    const big = spiral ? 0.4 + 0.6 * hash(g * 5.5) : grown ? 0.1 + 0.18 * hash(g * 5.5) : 0.05 + 0.1 * hash(g * 5.5)
    const tilt = hash(g * 6.6) * Math.PI, turn = hash(g * 8.8) * Math.PI * 2
    const per = spiral ? 220 : grown ? 26 : 12, cores = grown ? 3 : 2
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
      add(s + dx, cy + dy * Math.cos(tilt), cz + dy * Math.sin(tilt), col, k < cores ? (grown ? 3.0 : 2.2) : grown ? 0.85 : 0.7, grown ? 0.3 : 0.5, bright)
    }
  }
  // the floor: a faint perspective grid below the funnel
  const floorFirst = pts.length
  mesh = 1
  if (o.floor !== false) {
    const y = -(mouth + 1.2), x0 = -8, x1 = L + 10, z0 = -18, z1 = 18, step = 2
    for (let x = x0; x <= x1; x += step) for (let i = 0; i <= 500; i++) add(x, y, z0 + (z1 - z0) * i / 500, [0.5, 0.6, 0.9], 1.3, 0.02, 0.9)
    for (let z = z0; z <= z1; z += step) for (let i = 0; i <= 700; i++) add(x0 + (x1 - x0) * i / 700, y, z, [0.5, 0.6, 0.9], 1.3, 0.02, 0.9)
  }
  mesh = 0

  // into world space along the axis
  const N = pts.length, pos = new Float32Array(N * 3), color = new Float32Array(N * 3)
  const size = new Float32Array(N), seed = new Float32Array(N), tw = new Float32Array(N), al = new Float32Array(N), fl = new Float32Array(N), dk = new Float32Array(N)
  const lay = new Float32Array(N), key = new Float32Array(N)
  const axis = o.axis || 'z+'
  // (s, a, b) → world: a is up (y) for the floor to lie flat; b runs across
  const place = (s, a, b) => axis === 'z-' ? [b, a, -s] : axis === 'z+' ? [b, a, s] : axis === 'x-' ? [-s, a, b] : [s, a, b]
  pts.forEach((p, i) => {
    pos.set(place(p[0], p[1], p[2]), i * 3); color.set([p[3], p[4], p[5]], i * 3)
    size[i] = p[6]; tw[i] = p[7]; al[i] = p[8]; fl[i] = p[10]; dk[i] = p[9] === 1 ? 1 : 0; seed[i] = hash(i * 0.731)
    // the mesh's key: where it comes in, the wireframe by s (CMB end first), the floor by
    // its distance from under the funnel's middle
    lay[i] = p[11]; key[i] = !p[11] ? 0 : i < floorFirst ? Math.min(1, Math.max(0, p[0] / L)) : Math.min(1, Math.hypot(p[0] - 0.45 * L, p[2]) / 30)
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  const colAttr = new BufferAttribute(color, 3)
  geo.setAttribute('aColor', colAttr); geo.setAttribute('aSize', new BufferAttribute(size, 1))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1)); geo.setAttribute('aTw', new BufferAttribute(tw, 1))
  geo.setAttribute('aAlpha', new BufferAttribute(al, 1)); geo.setAttribute('aFlare', new BufferAttribute(fl, 1)); geo.setAttribute('aDisk', new BufferAttribute(dk, 1))
  geo.setAttribute('aLay', new BufferAttribute(lay, 1)); geo.setAttribute('aKey', new BufferAttribute(key, 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uView: { value: 1 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.6 }, uFlare: { value: 1 }, uDisk: { value: 1 }, uBody: { value: 1 }, uMesh: { value: 1 } },
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
    // the CMB picture goes to the GPU as soon as it has loaded (on the cover, while the
    // deck is idle), not on the frame that first shows it: a 2048² upload with its
    // mipmaps stalled the arrival at slide 4 (seconds on a software renderer)
    if (diskTex && !diskUp) { r.initTexture(diskTex); diskUp = true }
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
  // its brightness (0–1). Transparent only so the prologue can fade it in
  // (funnelSeq); drawn first of the transparent things, it covers what lies
  // behind it as the opaque disk did.
  let alive = true, diskTex = null, diskUp = false
  const r0d = R(0) * 0.985
  const diskMat = new MeshBasicMaterial({ color: new Color().setScalar(o.cmbTint ?? 0.85), side: DoubleSide, transparent: true })
  const disk = new Mesh(new CircleGeometry(r0d, 192), diskMat)
  disk.visible = false; disk.renderOrder = -1
  const parts = { mat, diskMat, disk, diskReady: false, diskPx: null, group: g, geom: { L, R, place, bb: -2.6, dawn: o.dawn ?? 0.32, r0: r0d } }
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
      diskMat.map = tex; diskMat.needsUpdate = true; diskTex = tex
      parts.diskReady = true; disk.visible = diskMat.opacity > 0.002
      // the map's colours for the web's grains that land on the disk (funnelSeq.targets)
      try {
        const c = document.createElement('canvas'); c.width = c.height = 128
        const x2 = c.getContext('2d', { willReadFrequently: true }); x2.drawImage(tex.image, 0, 0, 128, 128)
        parts.diskPx = x2.getImageData(0, 0, 128, 128).data
      } catch {}
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

  funnelSeq.attach(parts)
  return {
    group: g, labels: [],
    // busy while the prologue plays: the headless shots and stills wait for its end
    api: { busy: () => funnelSeq.busy },
    update(t) { mat.uniforms.uTime.value = t; funnelSeq.step(t) },
    dispose() { alive = false; funnelSeq.detach(parts); geo.dispose(); mat.dispose(); disk.geometry.dispose(); diskMat.dispose(); diskTex?.dispose() },
  }
}

// ---- the prologue: the web's grains become the funnel (owner, 13 Oct) -----------
// On the step from the takeover (slide 3) to the funnel's side view (slide 4) the
// cosmic web's grains fly into the funnel's shape, the middle of the picture first:
// the takeover's camera looks down the funnel's axis, so the middle of its picture
// becomes the Big Bang, then the CMB disk, then the bell out to the mouth. Then the
// funnel's own grains resolve in their place, and last its mesh (the rings, the
// lines, the floor) comes in under them. <WebTakeover> hides the funnel on every
// slide up to the web's and plays this on that step; every other arrival after it
// finds the funnel whole (`show`). It runs on the world's clock (update(t)), so it keeps time with
// the flight on a slow device, and is `busy` while it plays, so the headless shots
// wait for its end. (One funnel in the world: the controller is the module's.)
// (the grains' funnel stands a moment before the funnel's own grains take over)
const STEPS = { morph: [0, 4.4], body: [4.8, 6.6], fade: [5.0, 6.8], mesh: [6.4, 8.0] }
const lin = ([a, b], x) => Math.min(1, Math.max(0, (x - a) / (b - a)))
export const funnelSeq = {
  mode: 'hidden', t0: null, skip: 0, web: null, parts: null,
  // the takeover's slide (WebTakeover sets it; 3 until it mounts) and how many live
  // WebTakeovers drive this window
  at: 3, drivers: 0,
  get busy() { return this.mode === 'playing' },
  // a new world (the first boot, or a rebuild after a lost WebGL context) never holds the
  // web's grains: it starts with the funnel whole if the deck stands past the takeover,
  // hidden before it (owner, 13 Oct: the funnel must not float on the cover)
  attach(parts) {
    this.parts = parts
    const n = Number((/^#\/(?:presenter\/)?(\d+)/.exec(globalThis.location?.hash || '') || [])[1] || 1)
    if (n > this.at) this.show(); else this.hide()
  },
  detach(parts) { if (this.parts === parts) this.parts = null },
  hide() { this.mode = 'hidden'; this.web = null; this.apply(0) },
  show() { if (this.web) this.web.visible = false; this.mode = 'shown'; this.web = null; this.apply(0) },
  // `web`: the takeover's grains, their targets set (takeover.js setTargets); without
  // them the funnel only resolves and its mesh comes in
  play(web) { this.mode = 'playing'; this.t0 = null; this.web = web || null; this.skip = web ? 0 : STEPS.body[0] - 0.3; this.apply(this.skip) },
  step(t) {
    if (this.mode !== 'playing') return
    if (this.t0 === null || t < this.t0) this.t0 = t   // a new world's clock starts again at 0
    const e = t - this.t0 + this.skip
    this.apply(e)
    if (e >= STEPS.mesh[1]) this.show()
  },
  apply(e) {
    const v = this.mode === 'hidden' ? { morph: 0, body: 0, fade: 1, mesh: 0 }
      : this.mode === 'shown' ? { morph: 1, body: 1, fade: 0, mesh: 1 }
      : { morph: lin(STEPS.morph, e), body: sstep(STEPS.body[0], STEPS.body[1], e), fade: 1 - sstep(STEPS.fade[0], STEPS.fade[1], e), mesh: lin(STEPS.mesh, e) }
    const p = this.parts
    if (p) {
      p.mat.uniforms.uBody.value = v.body; p.mat.uniforms.uMesh.value = v.mesh
      p.diskMat.opacity = v.body; p.disk.visible = p.diskReady && v.body > 0.002
    }
    const w = this.web?.material.uniforms
    if (w) { w.uMorph.value = v.morph; w.uFade.value = v.fade }
  },
  // Where each of the web's grains lands. `uv`: its place in the takeover's picture
  // (0–1, y down), `aspect` the picture's width over height. The nearer the middle,
  // the earlier in the history it lands; its angle round the middle is kept, evened
  // out so that the bell is covered all round. Both go by rank (histograms, O(n)),
  // so neighbours in the picture stay neighbours in the funnel and no paths cross.
  // → world positions, colours (0–255), each grain's order (0 first, 1 last) and
  // the funnel's axis in the world (origin, unit direction).
  targets(uv, n, aspect) {
    const p = this.parts
    if (!p) return null
    const { L, R, place, bb, dawn, r0 } = p.geom
    const rho = new Float32Array(n), th = new Float32Array(n)
    let rmax = 1e-6
    for (let k = 0; k < n; k++) {
      const x = (uv[k * 2] - 0.5) * aspect, y = 0.5 - uv[k * 2 + 1]
      rho[k] = Math.hypot(x, y); th[k] = Math.atan2(y, x); if (rho[k] > rmax) rmax = rho[k]
    }
    const q = rank(rho, n, 0, rmax * 1.0001, 8192)
    // the angle, evened out within bands of equal count
    const BANDS = 48, TB = 720, cnt = new Uint32Array(BANDS * TB), tot = new Uint32Array(BANDS)
    const bandOf = (k) => Math.min(BANDS - 1, Math.floor(q[k] * BANDS))
    const tpos = (k) => ((th[k] + Math.PI) / (2 * Math.PI)) * TB
    for (let k = 0; k < n; k++) cnt[bandOf(k) * TB + Math.min(TB - 1, Math.floor(tpos(k)))]++
    const cum = new Uint32Array(BANDS * TB)
    for (let b = 0; b < BANDS; b++) { let acc = 0; for (let i = 0; i < TB; i++) { cum[b * TB + i] = acc; acc += cnt[b * TB + i] } tot[b] = acc }
    // along the bell: by its wall's area, more where the first galaxies crowd
    const along = sampler((t) => R(t * L) * (1 + 0.8 * sstep(dawn - 0.02, dawn + 0.06, t) * Math.exp(-Math.max(0, t - dawn - 0.06) / 0.25)))
    const QB = 0.02, QN = 0.04, QD = 0.15
    p.group.updateWorldMatrix(true, false)
    const m = p.group.matrixWorld
    const pos = new Float32Array(n * 3), col = new Uint8Array(n * 3), order = new Float32Array(n)
    const v = new Vector3(), px = p.diskPx
    for (let k = 0; k < n; k++) {
      const b0 = bandOf(k), tp = tpos(k), ti = Math.min(TB - 1, Math.floor(tp)), j = b0 * TB + ti
      const ang = -Math.PI + 2 * Math.PI * (cum[j] + (tp - ti) * cnt[j]) / Math.max(1, tot[b0])
      const qk = q[k]
      let s, r, c, a, bx
      if (qk < QB) {            // the Big Bang: a small bright knot
        const rr = 0.6 * Math.abs(gauss(k * 1.31)), t = hash(k * 2.3) * Math.PI * 2, u = hash(k * 4.1) * 2 - 1
        s = bb + rr * u * 0.6; a = rr * Math.sqrt(1 - u * u) * Math.sin(t); bx = rr * Math.sqrt(1 - u * u) * Math.cos(t); c = [0.86, 0.93, 1]
      } else {
        if (qk < QN) { s = -1.3 * (1 - (qk - QB) / (QN - QB)); r = R(s); c = [0.78, 0.88, 1] }
        else if (qk < QD) {     // the CMB disk, filled from its middle out, in the map's colours
          s = 0.04; r = r0 * 0.99 * Math.sqrt((qk - QN) / (QD - QN)); c = [0.5, 0.7, 0.9]
        } else {
          const t = along(Math.min(0.9999, (qk - QD) / (1 - QD)))
          s = Math.max(0.4, t * L)
          if (hash(k * 3.77) < 0.6) { r = R(s) * (0.97 + 0.03 * hash(k * 5.1)); c = [0.8, 0.88, 1] }   // the wall
          else { r = R(s) * 0.9 * Math.sqrt(hash(k * 6.3)); c = t < dawn ? [0.36, 0.34, 0.42] : ramp(HEAT, t) }
        }
        a = r * Math.sin(ang); bx = r * Math.cos(ang)
        if (qk >= QN && qk < QD && px) {
          const ix = Math.min(127, Math.max(0, Math.floor((bx / r0 + 1) * 64))), iy = Math.min(127, Math.max(0, Math.floor((1 - (a / r0 + 1) / 2) * 128)))
          const o = (iy * 128 + ix) * 4, rr = px[o] / 255, gg = px[o + 1] / 255, bl = px[o + 2] / 255, mm = (rr + gg + bl) / 3
          c = [mm + (rr - mm) * 1.4, mm + (gg - mm) * 1.4, mm + (bl - mm) * 1.4]
        }
      }
      v.fromArray(place(s, a, bx)).applyMatrix4(m)
      pos[k * 3] = v.x; pos[k * 3 + 1] = v.y; pos[k * 3 + 2] = v.z
      for (let i = 0; i < 3; i++) col[k * 3 + i] = Math.round(255 * Math.min(1, Math.max(0, c[i])))
      order[k] = qk
    }
    const O = new Vector3().fromArray(place(0, 0, 0)).applyMatrix4(m)
    const D = new Vector3().fromArray(place(1, 0, 0)).applyMatrix4(m).sub(O).normalize()
    return { pos, col, order, axisO: O, axisD: D }
  },
}
// each value's rank among them, 0–1, from a histogram of `bins` over [lo, hi),
// linear within a bin
function rank(val, n, lo, hi, bins) {
  const cnt = new Uint32Array(bins), cum = new Uint32Array(bins), w = (hi - lo) / bins
  const at = (x) => Math.min(bins - 1, Math.max(0, Math.floor((x - lo) / w)))
  for (let k = 0; k < n; k++) cnt[at(val[k])]++
  for (let i = 0, acc = 0; i < bins; i++) { cum[i] = acc; acc += cnt[i] }
  const out = new Float32Array(n)
  for (let k = 0; k < n; k++) { const i = at(val[k]), f = (val[k] - lo) / w - i; out[k] = (cum[i] + Math.min(1, Math.max(0, f)) * cnt[i]) / n }
  return out
}

export function installFunnel(registerBuilder) {
  registerBuilder('funnel', buildFunnel, { fields: ['pos'] })
}
