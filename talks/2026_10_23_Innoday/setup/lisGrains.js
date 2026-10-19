import { Points, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Vector3 } from 'three'
import { POINT_GLSL, viewScale } from './view.js'

// The close (owner, 19 Oct: "photorealistic 3D rendering of SciFi light injection
// system, then "laser" inscribe Lithuanian flag on it and then position it in a 3D
// LHCb CAD (maybe as pointcloud)"). The clip (hero/lis_scene.py) ends on the module's
// end with the flag; its last frame becomes grains, each where its pixel's surface is
// in depth (the render's depth, by ray casts), seen from where the clip's camera
// stood. The grains stand at the cold box's place on a SciFi module in LHCb's
// geometry (`detector`, setup/detector.js), at `s` stage units a metre: large at
// first, so the camera starts a few units away as the clip's did a few centimetres
// away, and shrinking as the camera pulls back, faster than it recedes ("powers of
// ten"), to a little over the detector's own scale, so the flag stays a mark.

// ---- the grains' places from the frame's samples and the depth --------------------------
// `s` from takeover.js's sampleFrame (uv in the frame, v down); `depth` the decoded depth
// (Float32Array w*h, metres, 0 where nothing was hit); `meta` the clip's camera at its
// last frame (lis.json): origin, right, up, forward and the flag, in the stage's frame,
// in metres from the flag. Returns positions in metres from the flag.
export function placeInDepth(s, depth, meta) {
  const { w, h } = meta.depth
  const t = Math.tan((meta.vfov * Math.PI) / 360), a = meta.aspect
  const [O, R, U, F] = [meta.origin, meta.right, meta.up, meta.forward]
  const pos = new Float32Array(s.n * 3), keep = new Float32Array(s.n), flag = new Float32Array(s.n), edge = new Float32Array(s.n)
  const quad = meta.flagUV || []
  for (let k = 0; k < s.n; k++) {
    const u = s.uv[k * 2], v = s.uv[k * 2 + 1]
    const i = Math.min(w - 1, (u * w) | 0), j = Math.min(h - 1, (v * h) | 0)
    let z = depth[j * w + i]
    keep[k] = z > 0 ? 1 : 0                     // a grain off every surface (the black) is dropped
    flag[k] = inside(quad, u, v) ? 1 : 0        // the flag's own grains: they stay as the mark
    edge[k] = Math.min(1, Math.min(u, 1 - u, v, 1 - v) / 0.06)   // the picture's border, feathered
    if (!(z > 0)) z = meta.depth.far
    const x = (2 * u - 1) * t * a * z, y = (1 - 2 * v) * t * z
    for (let c = 0; c < 3; c++) pos[k * 3 + c] = O[c] + R[c] * x + U[c] * y + F[c] * z
  }
  return { pos, keep, flag, edge }
}
function inside(q, x, y) {
  let c = false
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) {
    const [xi, yi] = q[i], [xj, yj] = q[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

// the depth PNG: 16 bits in red (high) and green (low); 0 = nothing hit
export async function loadDepth(url, meta) {
  const img = new Image()
  img.src = url
  await img.decode()
  const { w, h, near, far } = meta.depth
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d', { willReadFrequently: true })
  g.drawImage(img, 0, 0, w, h)
  const px = g.getImageData(0, 0, w, h).data
  const out = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const q = px[i * 4] * 256 + px[i * 4 + 1]
    out[i] = q === 0 ? 0 : near + ((q - 1) / 65533) * (far - near)
  }
  return out
}

// ---- drawing ---------------------------------------------------------------------------
const VERT = /* glsl */ `
attribute vec3 aColor;
attribute float aSize, aSeed, aKeep, aFlag, aEdge;
uniform float uTime, uReveal, uGain, uScale, uScaleFlag, uS0, uFade, uRest;
uniform vec3 uAnchor;
varying vec3 vColor; varying float vAlpha;
${POINT_GLSL}
void main() {
  // the flag's grains keep a larger scale at the end, so the flag stays a mark the room can
  // see where the module stands; the rest of the module's picture fades as it shrinks
  float sc = aFlag > 0.5 ? uScaleFlag : uScale;
  vec3 p = uAnchor + position * sc;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.85 + 0.15 * sin(uTime * (0.8 + aSeed * 1.9) + aSeed * 40.0);
  float r = clamp(uReveal * 1.35 - aSeed * 0.35, 0.0, 1.0);
  // a grain is a piece of the form, so its size goes with the form's scale: about a pixel
  // of the picture at the start (the camera a few units away; a grain sized as the world's
  // far forms are would cover dozens of pixels and the frame would add up to white)
  float ps = uView * aSize * (72.0 / max(-mv.z, 0.05)) * (sc / uS0);
  gl_PointSize = pointSize(ps, 6.0);
  vColor = aColor * uGain;
  vAlpha = aKeep * r * tw * coverage(ps) * smoothstep(0.05, 0.4, -mv.z) * uFade * aEdge * (aFlag > 0.5 ? 1.0 : uRest);
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  // the alpha outside the power: a grain under a pixel gives its share of light, so the
  // picture keeps its brightness as it shrinks (inside, a quarter-pixel grain gave a 20th)
  float a = (1.0 - smoothstep(0.05, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor, vec3(2.2)) * a, 1.0);
}`

export function makeLisGrains(s, placed, { size = 0.07, gain = 1.25, s0 = 18 } = {}) {
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(placed.pos, 3))
  geo.setAttribute('aColor', new BufferAttribute(s.col, 3))
  geo.setAttribute('aKeep', new BufferAttribute(placed.keep, 1))
  geo.setAttribute('aFlag', new BufferAttribute(placed.flag, 1))
  geo.setAttribute('aEdge', new BufferAttribute(placed.edge, 1))
  const sz = new Float32Array(s.n), sd = new Float32Array(s.n)
  let a = 7
  const rnd = () => { a = (a * 16807) % 2147483647; return a / 2147483647 }
  for (let k = 0; k < s.n; k++) { sd[k] = rnd(); sz[k] = size * (0.6 + 0.8 * rnd()) * (0.8 + 0.6 * s.lum[k]) }
  geo.setAttribute('aSize', new BufferAttribute(sz, 1))
  geo.setAttribute('aSeed', new BufferAttribute(sd, 1))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 }, uReveal: { value: 0 }, uView: { value: 1 }, uGain: { value: gain },
      uScale: { value: s0 }, uScaleFlag: { value: s0 }, uS0: { value: s0 }, uFade: { value: 1 }, uRest: { value: 1 },
      uAnchor: { value: new Vector3() },
    },
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
  })
  const pts = new Points(geo, mat)
  pts.frustumCulled = false
  pts.name = 'lis-grains'
  const t0 = performance.now()
  // the twinkle's clock, the frame's size and the form's scale (userData.scale(camera), set by
  // LisTakeover from the camera's distance), every frame
  pts.onBeforeRender = (r, _s, cam) => {
    mat.uniforms.uTime.value = (performance.now() - t0) / 1000; mat.uniforms.uView.value = viewScale(r)
    pts.userData.scale?.(cam, mat.uniforms)
  }
  return pts
}

// ---- the pull-back's scale ----------------------------------------------------------------
// s(d), d the camera's distance from the anchor: s0 at the start pose's distance d0, sEnd
// at the last pose's dEnd, a power law between (the picture recedes faster than the camera
// does); a jump past either end holds the end's value.
export function scaleLaw({ s0, d0, sEnd, dEnd }) {
  const k = Math.log(sEnd / s0) / Math.log(dEnd / d0)
  return (d) => Math.min(s0, Math.max(sEnd, s0 * Math.pow(Math.max(d, 1e-3) / d0, k)))
}

// a stage pose ({ at, dist, yaw, pitch }) for a camera at `cam` looking at `target`
// (slidev-addon-stage: position = target + dist·(sin yaw cos pitch, sin pitch, cos yaw cos pitch))
export function poseOf(cam, target) {
  const d = new Vector3().subVectors(cam, target), dist = d.length()
  return { at: [target.x, target.y, target.z], dist, yaw: Math.atan2(d.x, d.z) * 180 / Math.PI, pitch: Math.asin(d.y / dist) * 180 / Math.PI }
}
