// Copied 10 Nov 2026 from Užsikrauk karjerai (setup/grains.js, lines 1-123): only the steps' bus, the clock for
// later steps and the grains' drawing, which the cover's pentaquark (setup/pentaquark.js) and <CoverCollision> use.
import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3,
  LinearMipmapLinearFilter,
} from 'three'

// a label sprite from the engine, mipmapped: drawn far smaller than its canvas, it aliased
// into dither (OpenData's; the ported portraits take it for their names)
export function smooth(l) {
  const t = l.material.map
  if (t) { t.generateMipmaps = true; t.minFilter = LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true }
  return l
}

// This talk's own forms of grains, drawn the way the engine draws its galaxy
// and collider (slidev-addon-stage, stage/forms.js): points of light, added
// together, no surfaces, no labels.
//
//   pairs    matter and antimatter: a hot cloud of gold and blue grains. On
//            the next step they meet in pairs and go out as light, two
//            grains of light flying apart from every meeting; the few gold
//            grains that had no partner stay, and on the step after that
//            they gather. Everything that exists is made of that remainder.
//   path     a life as a trail of grains through waypoints (a Catmull-Rom
//            curve): step k draws it on to waypoint k, and the place it
//            reaches gathers into a small cluster. The grains keep flowing
//            from the start toward the head, so the trail is always moving
//            forward.
//   streams  grains running from a point (each stream its own `from`) to
//            another along an arc, the end gathering as its stream starts:
//            here, every place on the path sending something to the last.
//   ghost    faint clusters that keep coming together and drifting apart,
//            never holding: a particle that was looked for and is not there.
//   map      a coastline in grains on the ground plane (Europe, from Natural
//            Earth), condensing out of the dust: where the path runs.
//   quintet  five clusters joined by flowing strings, a five-quark particle,
//            whose hold and light are set per step: idea, claim, retraction,
//            discovery.
//
// The slides drive them through `setGrains(name, step)` (<Grains> calls it
// when its slide becomes the current one). The last step of every name is
// kept, so a form built after the call still starts right.

//
// One bus for every form of the talk, including the ones ported from OpenData
// (setup/team.js, setup/thesis.js), which take the steps, the clock and the
// grains' drawing from here. A step for later (`setGrainsLater`) runs on the
// world's clock, as the motion it waits for does: every ported form's update
// moves that clock on (tick), and a step still to come keeps its form busy.

const BUS = 'tokyo:grains'
export const state = new Map()

export function setGrains(name, step) {
  if (state.get(name) === step) return
  state.set(name, step)
  window.dispatchEvent(new CustomEvent(BUS, { detail: { name, step } }))
}
let clock = 0
const pending = new Set()
export function setGrainsLater(name, step, s) {
  const p = { name, step, at: clock + s }
  pending.add(p)
  return () => pending.delete(p)
}
export function tick(t) {
  clock = t
  for (const p of pending) if (t >= p.at) { pending.delete(p); setGrains(p.name, p.step) }
}
export const waiting = (name) => [...pending].some((p) => p.name === name)
export function listen(name, fn) {
  const h = (e) => { if (e.detail?.name === name) fn(e.detail.step) }
  window.addEventListener(BUS, h)
  return () => window.removeEventListener(BUS, h)
}
// a name's last step, for the forms kept in files of their own
export const stepOf = (name) => state.get(name)
// a histogram's share of entries landed so far (0 to 1), for <FillClock>; null while the
// plot is not built (no WebGL: the clock then keeps its own time)
const fills = new Map()
export const fillShare = (name) => fills.get(name)?.() ?? null

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }
const unit = () => {
  const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z)
  return [q * Math.cos(ph), z, q * Math.sin(ph)]
}

// A grain's twinkle, size from distance, and the engine's linear-light point.
export const PLACE = /* glsl */ `
uniform float uTime, uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void place(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.86 + 0.14 * sin(uTime * (0.6 + seed * 1.2) + seed * 40.0);   // a slow, shallow twinkle: a stream encoder smears fast sparkle
  // capped, and faded out within a few units of the camera: a flight that passes through a
  // scattered form must not fill the frame with huge additive sprites (a flash, and a fill-rate spike)
  gl_PointSize = min(uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1)), 48.0 * uPixelRatio);
  vColor = color;
  vAlpha = alpha * tw * smoothstep(1.5, 5.0, -mv.z);
}
void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec3 turnY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z); }
`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

export function material(vertexShader, uniforms) {
  return new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    // uPixelRatio carries the frame scale (the buffer's height / 900; each builder returns it as
    // `frameScale`), so a grain is the same share of the picture at 1600×900 and on a phone
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, ...uniforms },
  })
}
