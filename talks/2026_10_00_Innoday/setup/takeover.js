import { Points, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Vector3 } from 'three'

// The opener's last frame becomes the world. Every bright pixel of the frame
// is a grain; each grain is placed along its own pixel's line of sight from
// the camera as it stands at that moment, at a depth that varies smoothly
// across the picture. Seen from where it was made, the grain cloud is the
// picture; as soon as the camera moves, the picture has depth.

// ---- sampling: the frame → grains (screen uv, colour) -------------------------
// Grains fall where the frame is bright (probability ~ luminance^gamma), so the
// filaments and knots carry the picture and the voids stay empty.
export function sampleFrame(img, { n = 140000, w = 960, h = 540, gamma = 1.7, floor = 0.035, seed = 1 } = {}) {
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
    const r = px[lo * 4] / 255, gg = px[lo * 4 + 1] / 255, b = px[lo * 4 + 2] / 255
    // the grain carries the pixel's hue; the density of grains carries its brightness
    const m = Math.max(r, gg, b, 1e-3), k2 = 0.55
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
export function placeAlongRays(s, camera, rect, view, { near = 14, far = 46, relief = 0.85, jitter = 0.12, seed = 2 } = {}) {
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
    const d = clamp01(0.5 + relief * (fbm(u * 2.2, w * 2.2 * (rect.height / rect.width) * 1.78) - 0.5) + jitter * (rnd() - 0.5) - 0.18 * s.lum[k])
    const z = near + (far - near) * d
    v.set(nx * tanH * aspect * z, ny * tanH * z, -z).applyMatrix4(m)
    pos[k * 3] = v.x; pos[k * 3 + 1] = v.y; pos[k * 3 + 2] = v.z
  }
  return pos
}

// ---- drawing: grains of light, of a piece with the world's forms --------------
const VERT = /* glsl */ `
attribute vec3 aColor;
attribute float aSize, aSeed;
uniform float uTime, uReveal, uPixelRatio, uGain;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.78 + 0.22 * sin(uTime * (0.8 + aSeed * 1.9) + aSeed * 40.0);
  // each grain lights at its own moment while the picture lets go of it
  float r = clamp(uReveal * 1.35 - aSeed * 0.35, 0.0, 1.0);
  gl_PointSize = uPixelRatio * aSize * (72.0 / max(-mv.z, 0.1));
  vColor = aColor * uGain;
  vAlpha = r * tw;
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

export function makeGrains(s, { size = 0.5, gain = 1.25 } = {}) {
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(s.n * 3), 3))
  geo.setAttribute('aColor', new BufferAttribute(s.col, 3))
  const sz = new Float32Array(s.n), sd = new Float32Array(s.n)
  const rnd = mulberry(3)
  for (let k = 0; k < s.n; k++) { sd[k] = rnd(); sz[k] = size * (0.6 + 0.8 * rnd()) * (0.8 + 0.6 * s.lum[k]) }
  geo.setAttribute('aSize', new BufferAttribute(sz, 1))
  geo.setAttribute('aSeed', new BufferAttribute(sd, 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uPixelRatio: { value: 1 }, uGain: { value: gain } },
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  })
  const pts = new Points(geo, mat)
  pts.frustumCulled = false
  pts.name = 'takeover-web'
  const t0 = performance.now()
  pts.onBeforeRender = () => { mat.uniforms.uTime.value = (performance.now() - t0) / 1000 }
  return pts
}

export function setPositions(pts, pos) {
  const a = pts.geometry.getAttribute('position')
  a.array.set(pos); a.needsUpdate = true
  pts.geometry.computeBoundingSphere()
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
