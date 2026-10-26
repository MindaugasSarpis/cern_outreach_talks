import { Points, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Vector3 } from 'three'
import { POINT_GLSL, viewScale } from './view.js'

// The opener's last frame becomes the world. Every bright pixel of the frame
// is a grain; each grain is placed along its own pixel's line of sight from
// the camera as it stands at that moment, at a depth that varies smoothly
// across the picture. Seen from where it was made, the grain cloud is the
// picture; as soon as the camera moves, the picture has depth.

// ---- sampling: the frame → grains (screen uv, colour) -------------------------
// Grains fall where the frame is bright (probability ~ luminance^gamma), so the
// filaments and knots carry the picture and the voids stay empty. `weight: 'max'`
// weighs a pixel by its brightest channel instead, and `norm` sets how far a grain's
// colour is its pixel's hue at full strength (1: all of it): with 'max', gamma 2.2
// and norm 1 the grains add up to the frame's own linear light, saturated reds and
// greens included (the close's takeover, LisTakeover; the web's keeps the defaults).
export function sampleFrame(img, { n = 140000, w = 960, h = 540, gamma = 1.7, floor = 0.035, sat = 1.35, seed = 1, weight = 'lum', norm = 0.55 } = {}) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d', { willReadFrequently: true })
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)   // cover, as the player shows it
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s
  g.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  const px = g.getImageData(0, 0, w, h).data
  const cdf = new Float64Array(w * h)
  let acc = 0
  for (let i = 0; i < w * h; i++) {
    const l = weight === 'max' ? Math.max(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) / 255
      : (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
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
    // the tone mapper greys what adds up, so the grain starts a little more saturated than its pixel
    const r0 = px[lo * 4] / 255, g0 = px[lo * 4 + 1] / 255, b0 = px[lo * 4 + 2] / 255
    const l0 = 0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0
    const r = clamp01(l0 + (r0 - l0) * sat), gg = clamp01(l0 + (g0 - l0) * sat), b = clamp01(l0 + (b0 - l0) * sat)
    // the grain carries the pixel's hue; the density of grains carries its brightness
    const m = Math.max(r, gg, b, 1e-3), k2 = norm
    col[k * 3] = r * (1 - k2) + (r / m) * k2
    col[k * 3 + 1] = gg * (1 - k2) + (gg / m) * k2
    col[k * 3 + 2] = b * (1 - k2) + (b / m) * k2
    lum[k] = 0.2126 * r + 0.7152 * gg + 0.0722 * b
  }
  return { n, uv, col, lum }
}

// ---- placing: along each pixel's ray from the live camera ---------------------
// `rect` is where the picture is on screen, `view` the canvas the world is drawn
// in (both client rects). Depth runs from `near` to `far` (camera units), set by
// a smooth noise over the picture so a filament stays one curve in space.
// `jitter` and `lift` (bright grains a little nearer) stay small: more of
// either and a filament seen from the side is a smear, not a strand.
export function placeAlongRays(s, camera, rect, view, { near = 14, far = 46, relief = 0.85, jitter = 0.03, lift = 0.05, seed = 2 } = {}) {
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

// ---- the web in depth (owner, 21 Oct: "rotate, fly through this point cloud universe") ----
// The frame is a node of the cosmic web seen head-on: a bright knot a little above the
// middle with filaments running out of it in every direction. Each grain keeps its pixel's
// line of sight (seen from where it was made, the cloud is the picture), and its depth
// says which way its filament runs: depth = the knot's depth + the distance from the knot
// × a slope that turns smoothly with the angle round it (+ a gentle noise). So every
// filament leaving the knot is one strand in space, toward the camera or away from it, and
// the knot is a knot from any side; a tangential filament bends smoothly with the angle.
// Faint grains (the haze between the strands) get a little depth of their own, so the gas
// is a volume; the bright ones none, so a strand stays a strand. Returns the positions,
// each grain's distance from the camera over `zref` (its size: makeGrains draws every grain
// the same size on screen from where it was made) and the knot in the world.
export const HUB = { u: 0.51, v: 0.475 }
export function placeWeb(s, camera, rect, view, { near = 12, far = 56, slope = 0.42, noise = 0.2, haze = 0.07, crisp = 0.012, zref = 27, seed = 2 } = {}) {
  camera.updateMatrixWorld()
  const m = camera.matrixWorld
  const tanH = Math.tan((camera.fov * Math.PI) / 360), aspect = camera.aspect
  const ar = rect.width / Math.max(1, rect.height)
  const rnd = mulberry(seed)
  const pos = new Float32Array(s.n * 3), dk = new Float32Array(s.n)
  const v = new Vector3()
  const ray = (u, w, z) => {
    const sx = rect.left + u * rect.width, sy = rect.top + w * rect.height
    const nx = ((sx - view.left) / view.width) * 2 - 1
    const ny = 1 - ((sy - view.top) / view.height) * 2
    return v.set(nx * tanH * aspect * z, ny * tanH * z, -z).applyMatrix4(m)
  }
  for (let k = 0; k < s.n; k++) {
    const u = s.uv[k * 2], w = s.uv[k * 2 + 1]
    const d = webDepth(u, w, ar, slope, noise) + (crisp + haze * (1 - Math.min(1, s.lum[k] * 2.2))) * gaussR(rnd)
    const z = near + (far - near) * softClamp(d)
    ray(u, w, z)
    pos[k * 3] = v.x; pos[k * 3 + 1] = v.y; pos[k * 3 + 2] = v.z
    dk[k] = z / zref
  }
  const hub = ray(HUB.u, HUB.v, near + (far - near) * softClamp(webDepth(HUB.u, HUB.v, ar, slope, noise))).clone()
  return { pos, depth: dk, hub }
}
// the depth (0 near … 1 far) of a point of the picture, uv in 0–1, y down
function webDepth(u, w, ar, slope, noise) {
  const x = (u - HUB.u) * ar, y = HUB.v - w
  const rho = Math.hypot(x, y) / 0.9, th = Math.atan2(y, x)
  const turn = (0.55 * Math.sin(th + 1.3) + 0.35 * Math.sin(2 * th + 0.4) + 0.25 * Math.sin(3 * th + 2.2) + 0.15 * Math.sin(5 * th + 0.9)) / 1.05
  const near0 = Math.min(1, rho / 0.25)
  return 0.5 + slope * Math.pow(rho, 0.9) * turn + noise * (fbm(u * 2.6, w * 2.6 / ar * 1.78) - 0.5) * near0 * near0 * (3 - 2 * near0)
}
const softClamp = (d) => 0.5 + 0.5 * Math.tanh((d - 0.5) * 2.2) / Math.tanh(1.1)

// ---- the cosmos round the frame: a procedural cosmic web in the frame's colours ------
// The frame shows one node of the web; the flight needs the web all round it. Clusters
// (nodes) stand at random in a box round the frame, their masses from a steep power law
// (a few rich, most small), the frame's own knot one of the richest; each is joined to its
// nearest neighbours by filaments, the rich ones to more. A filament is a bowed, slightly
// wavy strand, denser toward the clusters at its ends, as rich as its two clusters, inside a
// faint sheath of gas; the clusters are bright cuspy knots; warm clumps of gas sit along the
// strands, as the frame's orange does. Colours are the frame's own grains': the cool ones
// for the strands and the knots (the brightest for the cores), the warm ones for the gas.
// Built in the camera's frame at the takeover's pose (x right, y up, the camera at the
// origin looking down −z), in camera units; makeCosmos places it in the world.
export function buildCosmos(s, { n = 300000, hub = [0.5, 0.8, -34], box = [[-110, 90], [-62, 62], [-190, 30]], spacing = 24, seed = 7 } = {}) {
  const rnd = mulberry(seed)
  // the frame's colours: cool (blue to white) and warm (orange to brown), by brightness
  const cool = [], warm = []
  for (let k = 0; k < Math.min(s.n, 40000); k++) {
    const r = s.col[k * 3], g = s.col[k * 3 + 1], b = s.col[k * 3 + 2]
    ;(r > b * 1.05 ? warm : cool).push([s.lum[k], r, g, b])
  }
  cool.sort((a, b) => a[0] - b[0]); warm.sort((a, b) => a[0] - b[0])
  if (!cool.length) cool.push([1, 0.7, 0.8, 1])
  if (!warm.length) warm.push(...cool)
  const pick = (list, lo, hi) => list[Math.min(list.length - 1, Math.floor((lo + (hi - lo) * rnd()) * list.length))]
  const gvec = (sg) => [gaussR(rnd) * sg, gaussR(rnd) * sg, gaussR(rnd) * sg]
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  // denser toward the frame's knot; inside the frame's own slab (the picture's grains are
  // there) thinner, so the frame keeps its look from the side
  const tanH = Math.tan(25 * Math.PI / 180)
  const richness = (q) => {
    const d = Math.hypot(q[0] - hub[0], q[1] - hub[1], q[2] - hub[2])
    let w = 0.25 + 0.75 * Math.exp(-d / 60)
    const z = -q[2]
    if (z > 10 && z < 58 && Math.abs(q[0]) < tanH * 1.78 * z && Math.abs(q[1]) < tanH * z) w *= 0.45
    return w
  }
  // the clusters
  const vol = box.reduce((v, [a, b]) => v * (b - a), 1), nn = Math.round(vol / spacing ** 3)
  const nodes = [{ p: hub.slice(), m: 12, hub: true }]
  for (let i = 0; i < nn; i++) {
    const p = box.map(([a, b]) => a + rnd() * (b - a))
    if (Math.hypot(p[0] - hub[0], p[1] - hub[1], p[2] - hub[2]) < spacing * 0.6) continue
    nodes.push({ p, m: Math.min(25, Math.pow(1 - rnd(), -1 / 1.2)) })
  }
  // the filaments: each cluster to its 2–4 nearest (more for the rich), no doubles
  const edges = [], seen = new Set()
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i], k = a.hub ? 7 : a.m > 6 ? 4 : a.m > 2 ? 3 : 2
    const near = []
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue
      const b = nodes[j], d = Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1], a.p[2] - b.p[2])
      if (d < spacing * 2.2) near.push([d, j])
    }
    near.sort((x, y) => x[0] - y[0])
    for (const [d, j] of near.slice(0, k)) {
      const key = i < j ? i * 100000 + j : j * 100000 + i
      if (seen.has(key)) continue
      seen.add(key)
      const b = nodes[j], un = [0, 1, 2].map((q) => (b.p[q] - a.p[q]) / d)
      let b1 = cross(un, [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]); const l1 = Math.hypot(...b1) || 1; b1 = b1.map((x) => x / l1)
      edges.push({ a, b, d, un, b1, b2: cross(un, b1), bow: (0.05 + 0.12 * rnd()) * d, wav: 0.035 * d * rnd(), ph: rnd() * 6.283, st: Math.sqrt(a.m * b.m) })
    }
  }
  const chooser = (items, wt) => {
    const cum = new Float64Array(items.length + 1)
    items.forEach((it, i) => { cum[i + 1] = cum[i] + Math.max(0, wt(it)) })
    return () => {
      const t = rnd() * cum[items.length]; let lo = 0, hi = items.length - 1
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid + 1] < t) lo = mid + 1; else hi = mid }
      return items[lo]
    }
  }
  const at = (e, f) => {
    const sn = Math.sin(Math.PI * f), bw = e.bow * sn, wv = e.wav * Math.sin(2 * Math.PI * f + e.ph)
    return [0, 1, 2].map((i) => e.a.p[i] + e.un[i] * e.d * f + e.b1[i] * bw + e.b2[i] * wv)
  }
  const mid = (e) => at(e, 0.5)
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), sd = new Float32Array(n)
  let m = 0
  const put = (q, c, sz) => {
    if (m >= n) return
    pos[m * 3] = q[0]; pos[m * 3 + 1] = q[1]; pos[m * 3 + 2] = q[2]
    col[m * 3] = c[1]; col[m * 3 + 1] = c[2]; col[m * 3 + 2] = c[3]
    size[m] = sz; sd[m] = rnd(); m++
  }
  const want = { fil: Math.round(n * 0.52), node: Math.round(n * 0.18), haze: Math.round(n * 0.2) }
  // strands: by length and richness; along each, denser toward the end with the richer cluster
  const strandW = (e) => e.d * Math.pow(e.st, 1.3) * richness(mid(e))
  const pickE = chooser(edges, strandW)
  const filAt = []
  for (let got = 0; got < want.fil && edges.length; got++) {
    const e = pickE(), u = rnd(), wa = e.a.m / (e.a.m + e.b.m)
    // toward the ends: a, with a's share of the mass, else b
    const f = rnd() < wa ? 0.5 * Math.pow(u, 1.6) : 1 - 0.5 * Math.pow(u, 1.6)
    const sn = Math.sin(Math.PI * f)
    const o = gvec((0.08 + 0.05 * Math.min(4, e.st)) * (1.3 - 0.6 * sn))
    const q = at(e, f), r = [q[0] + o[0], q[1] + o[1], q[2] + o[2]]
    const hot = Math.min(1, e.st / 8)
    put(r, pick(cool, 0.45 + 0.35 * hot, 0.8 + 0.2 * hot), 0.9 * (0.7 + 0.6 * rnd()))
    if ((got & 7) === 0) filAt.push(r)
  }
  // the clusters: cuspy knots, by mass (the frame's knot is the frame's own)
  const knots = nodes.filter((x) => !x.hub)
  const pickN = chooser(knots, (x) => Math.pow(x.m, 1.15) * richness(x.p))
  for (let got = 0; got < want.node && knots.length; got++) {
    const x = pickN(), sg = 0.35 * Math.pow(x.m, 0.45) * Math.pow(rnd(), 1.5)
    const o = gvec(sg)
    put([x.p[0] + o[0], x.p[1] + o[1], x.p[2] + o[2]], pick(cool, 0.7 + 0.1 * Math.min(1, x.m / 10), 1), 0.9 * (0.7 + 0.6 * rnd()))
  }
  // a faint sheath of gas round the strands (the frame's violet haze)
  for (let got = 0; got < want.haze && edges.length; got++) {
    const e = pickE(), f = rnd(), o = gvec(0.8 + 0.12 * e.d * rnd())
    const q = at(e, f)
    put([q[0] + o[0], q[1] + o[1], q[2] + o[2]], pick(cool, 0.02, 0.45), 1.3 * (0.7 + 0.6 * rnd()))
  }
  // warm clumps of gas along the strands, as in the frame
  while (m < n && filAt.length) {
    const c0 = filAt[Math.floor(rnd() * filAt.length)], R = 0.5 + 1.3 * rnd() * rnd(), k = 30 + Math.floor(80 * rnd())
    const tint = pick(warm, 0.15, 0.95)
    for (let j = 0; j < k && m < n; j++) {
      const o = gvec(R * 0.55)
      put([c0[0] + o[0], c0[1] + o[1], c0[2] + o[2]], rnd() < 0.8 ? tint : pick(warm, 0.1, 0.9), 1.0 * (0.7 + 0.6 * rnd()))
    }
  }
  return { n: m, pos: pos.subarray(0, m * 3), col: col.subarray(0, m * 3), size: size.subarray(0, m), seed: sd.subarray(0, m) }
}

// ---- drawing: grains of light, of a piece with the world's forms --------------
// The CMB disk check (as funnel.js's own grains): drawn without a depth test, the grains
// that land behind the funnel's CMB disk (the Big Bang knot) showed through its middle as
// a white mark while the disk resolved; a grain behind the disk's plane whose line of
// sight crosses the disk is dropped, as far as the disk stands (uOcc: diskCheck).
const DISK_GLSL = /* glsl */ `
uniform vec3 uDiskO, uDiskN; uniform float uDiskR, uOcc;
float diskOcc(vec3 wp) {
  if (uOcc <= 0.0) return 1.0;
  float sc = dot(cameraPosition - uDiskO, uDiskN), sp = dot(wp - uDiskO, uDiskN);
  if (sc <= 0.0 || sp >= 0.0) return 1.0;
  vec3 h = cameraPosition + (sc / (sc - sp)) * (wp - cameraPosition);
  return mix(1.0, smoothstep(uDiskR * 0.97, uDiskR * 1.03, length(h - uDiskO)), uOcc);
}`
const VERT = /* glsl */ `
attribute vec3 aColor, aTarget, aTcol;
attribute float aSize, aSeed, aOrder, aDepth, aEdge;
uniform float uTime, uReveal, uGain, uMorph, uFade, uSwirl, uDense, uAway;
uniform vec3 uAxisO, uAxisD;
varying vec3 vColor; varying float vAlpha;
${POINT_GLSL}
${DISK_GLSL}
void main() {
  // the prologue (setup/funnel.js funnelSeq): each grain flies to its place in the
  // funnel, the middle of the picture first, turning a little round the funnel's axis
  // on the way, and takes on the colour of where it lands
  vec3 p = position; vec3 col = aColor; float k = 0.0;
  if (uMorph > 0.0) {
    k = clamp((uMorph - 0.45 * aOrder - 0.05 * aSeed) / 0.5, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    p = mix(position, aTarget, k);
    vec3 o = p - uAxisO; float ang = uSwirl * sin(3.14159 * k);
    p = uAxisO + o * cos(ang) + cross(uAxisD, o) * sin(ang) + uAxisD * dot(uAxisD, o) * (1.0 - cos(ang));
    col = mix(aColor, aTcol, smoothstep(0.3, 1.0, k));
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.78 + 0.22 * sin(uTime * (0.8 + aSeed * 1.9) + aSeed * 40.0);
  // each grain lights at its own moment while the picture lets go of it
  float r = clamp(uReveal * 1.35 - aSeed * 0.35, 0.0, 1.0);
  // sized to the frame (setup/view.js), capped: aDepth (its distance from the camera that
  // made it, over the reference) draws every grain the same size on screen from there, so
  // the near ones do not blur the picture; in the funnel they are all one size again
  float ps = uView * aSize * mix(aDepth, 1.0, k) * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 40.0);
  vColor = col * uGain;
  // gathered into the funnel the grains crowd a smaller part of the frame: uDense keeps
  // its light near the web's; uFade hands over to the funnel's own grains. The flight
  // passes through the strands: a grain fades within a few units of the camera, the
  // bigger the sooner, so no sprite flares across the frame
  float near = smoothstep(0.4, 1.2 + 4.0 * aSize * aDepth, -mv.z);
  // away from the frame's viewpoint (uAway) the picture's border thins out, so the frame's
  // grains are not a block with straight edges seen from the side; back in full as they fly
  float edge = mix(1.0, mix(smoothstep(0.0, 0.16, aEdge), 1.0, k), uAway);
  vAlpha = r * tw * coverage(ps) * near * edge * uFade * mix(1.0, uDense, k) * diskOcc((modelMatrix * vec4(p, 1.0)).xyz);
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.05, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

export function makeGrains(s, { size = 0.5, gain = 1.25, swirl = 0.9, dense = 0.55 } = {}) {
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(s.n * 3), 3))
  geo.setAttribute('aColor', new BufferAttribute(s.col, 3))
  const sz = new Float32Array(s.n), sd = new Float32Array(s.n)
  const rnd = mulberry(3)
  for (let k = 0; k < s.n; k++) { sd[k] = rnd(); sz[k] = size * (0.6 + 0.8 * rnd()) * (0.8 + 0.6 * s.lum[k]) }
  geo.setAttribute('aSize', new BufferAttribute(sz, 1))
  geo.setAttribute('aSeed', new BufferAttribute(sd, 1))
  geo.setAttribute('aDepth', new BufferAttribute(new Float32Array(s.n).fill(1), 1))
  // how far each grain is from the picture's border (the picture's height as the unit)
  const ed = new Float32Array(s.n)
  for (let k = 0; k < s.n; k++) { const u = s.uv[k * 2], w = s.uv[k * 2 + 1]; ed[k] = Math.min(Math.min(u, 1 - u) * 1.78, w, 1 - w) }
  geo.setAttribute('aEdge', new BufferAttribute(ed, 1))
  // where each grain goes in the funnel (setTargets), its colour there and its turn
  geo.setAttribute('aTarget', new BufferAttribute(new Float32Array(s.n * 3), 3))
  geo.setAttribute('aTcol', new BufferAttribute(new Uint8Array(s.n * 3), 3, true))
  geo.setAttribute('aOrder', new BufferAttribute(new Float32Array(s.n), 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 }, uReveal: { value: 0 }, uView: { value: 1 }, uGain: { value: gain },
      uMorph: { value: 0 }, uFade: { value: 1 }, uSwirl: { value: swirl }, uDense: { value: dense }, uAway: { value: 0 },
      uAxisO: { value: new Vector3() }, uAxisD: { value: new Vector3(0, 0, 1) },
      uDiskO: { value: new Vector3() }, uDiskN: { value: new Vector3(0, 0, 1) }, uDiskR: { value: 1 }, uOcc: { value: 0 },
    },
    // additive and order-free, like the funnel's grains: no depth test, so the CMB disk fading in
    // (it writes depth) does not cut off the grains of the Big Bang knot behind it
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
  })
  const pts = new Points(geo, mat)
  pts.frustumCulled = false
  pts.name = 'takeover-web'
  const t0 = performance.now()
  // the twinkle's clock and the frame's size, every frame (the frame-rate guard changes the buffer)
  pts.onBeforeRender = (r, scene, camera) => {
    mat.uniforms.uTime.value = (performance.now() - t0) / 1000; mat.uniforms.uView.value = viewScale(r)
    pts.userData.frame?.(r, camera)
  }
  return pts
}

// The cosmos's grains (buildCosmos), placed in the world by the takeover camera's matrix.
// A child of the web's grains: shown and hidden with them. It comes in as the camera leaves
// the pose the frame was made from (uAway, set by the takeover each frame: seen from there
// the picture stays the picture) and goes as the web's grains fly into the funnel (uFade).
const CVERT = /* glsl */ `
attribute vec3 aColor; attribute float aSize, aSeed;
uniform float uTime, uGain, uAway, uFade;
varying vec3 vColor; varying float vAlpha;
${POINT_GLSL}
void main() {
  float on = clamp(uAway * 1.4 - aSeed * 0.4, 0.0, 1.0) * uFade;
  if (on < 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vAlpha = 0.0; vColor = vec3(0.0); return; }
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.8 + 0.2 * sin(uTime * (0.6 + aSeed * 1.7) + aSeed * 50.0);
  float ps = uView * aSize * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 40.0);
  float near = smoothstep(0.6, 1.5 + 5.0 * aSize, -mv.z);
  vColor = aColor * uGain;
  vAlpha = on * tw * coverage(ps) * near;
}`
export function makeCosmos(c, matrix, { gain = 1.3, size = 1 } = {}) {
  const geo = new BufferGeometry()
  const pos = new Float32Array(c.n * 3), v = new Vector3()
  for (let k = 0; k < c.n; k++) { v.fromArray(c.pos, k * 3).applyMatrix4(matrix); v.toArray(pos, k * 3) }
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aColor', new BufferAttribute(c.col, 3))
  geo.setAttribute('aSize', new BufferAttribute(size === 1 ? c.size : c.size.map((x) => x * size), 1))
  geo.setAttribute('aSeed', new BufferAttribute(c.seed, 1))
  const mat = new ShaderMaterial({
    vertexShader: CVERT, fragmentShader: FRAG,
    uniforms: { uTime: { value: 0 }, uView: { value: 1 }, uGain: { value: gain }, uAway: { value: 0 }, uFade: { value: 1 } },
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
  })
  const pts = new Points(geo, mat)
  pts.frustumCulled = false
  pts.name = 'takeover-cosmos'
  const t0 = performance.now()
  // (userData.frame: the takeover's per-frame state, run by whichever of the two draws first:
  // the headless tools draw only the settled frame, and the cosmos may draw before its parent)
  pts.onBeforeRender = (r, scene, camera) => {
    mat.uniforms.uTime.value = (performance.now() - t0) / 1000; mat.uniforms.uView.value = viewScale(r)
    pts.userData.frame?.(r, camera)
  }
  return pts
}

// the funnel's places for the grains (funnelSeq.targets), once per picture
export function setTargets(pts, tg) {
  const g = pts.geometry
  for (const [name, arr] of [['aTarget', tg.pos], ['aTcol', tg.col], ['aOrder', tg.order]]) { const a = g.getAttribute(name); a.array.set(arr); a.needsUpdate = true }
  pts.material.uniforms.uAxisO.value.copy(tg.axisO); pts.material.uniforms.uAxisD.value.copy(tg.axisD)
  pts.userData.targets = true
}

export function setPositions(pts, pos, depth) {
  const a = pts.geometry.getAttribute('position')
  a.array.set(pos); a.needsUpdate = true
  if (depth) { const d = pts.geometry.getAttribute('aDepth'); d.array.set(depth); d.needsUpdate = true }
  pts.geometry.computeBoundingSphere()
}

// the CMB disk (funnel.js's parts.disk) for the grains' disk check, every frame
const _o = new Vector3(), _n = new Vector3()
export function diskCheck(pts, parts) {
  const u = pts.material.uniforms, d = parts?.disk
  if (!d || !d.parent) { u.uOcc.value = 0; return }
  d.updateWorldMatrix(true, false)
  d.getWorldPosition(_o)
  _n.set(0, 0, 1).transformDirection(d.matrixWorld)
  u.uDiskO.value.copy(_o); u.uDiskN.value.copy(_n)
  u.uDiskR.value = parts.geom?.r0 ?? 1
  // the disk as far as it is shown, and before it the web's own grains that make it: they
  // land on the disk's plane early in the morph (funnelSeq.targets), and the Big Bang knot
  // behind them showed through their middle
  const k = Math.min(1, Math.max(0, (u.uMorph.value - 0.35) / 0.35))
  u.uOcc.value = Math.max(d.visible ? Math.min(1, d.material?.opacity ?? 1) : 0, k * k * (3 - 2 * k))
}

// ---- small helpers ------------------------------------------------------------
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
// a standard normal from a uniform source (Box–Muller)
function gaussR(rnd) { const u = Math.max(1e-9, rnd()), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }
