import {
  Group, Points, Mesh, SphereGeometry, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Vector4, Matrix4, Euler,
} from 'three'

// This talk's own forms, on the engine's stage (slidev-addon-stage):
//
//   lineup   piles of one and the same sphere side by side, one sphere a
//            terabyte: 1, 800, 55 000, 600 000. Each pile gathers out of the
//            dust in its step and keeps its size, so the camera pulling back
//            shows what came before shrinking into the new scale.
//   streams  grains running from one point to others along arcs, each arc
//            ending in a small cluster that gathers when its stream starts:
//            data leaving the open store for the people who use it. Drawn the
//            way the engine draws its galaxy and collider: points of light,
//            added together.
//
// The slides drive both through `setGrains(name, step)` (the <Grains> slide
// component calls it when its slide becomes the current one). The last step
// of every name is kept, so a form built after the call still starts right.

const BUS = 'opendata:grains'
const state = new Map()

export function setGrains(name, step) {
  if (state.get(name) === step) return
  state.set(name, step)
  window.dispatchEvent(new CustomEvent(BUS, { detail: { name, step } }))
}
function listen(name, fn) {
  const h = (e) => { if (e.detail?.name === name) fn(e.detail.step) }
  window.addEventListener(BUS, h)
  return () => window.removeEventListener(BUS, h)
}

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }

// A grain's twinkle, size from distance, and the engine's linear-light point.
const PLACE = /* glsl */ `
uniform float uTime, uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void place(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.72 + 0.28 * sin(uTime * (1.1 + seed * 2.3) + seed * 40.0);
  gl_PointSize = uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1));
  vColor = color;
  vAlpha = alpha * tw;
}
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

function material(vertexShader, uniforms) {
  return new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) }, ...uniforms },
  })
}

// ---- lineup -------------------------------------------------------------------------
//   { type: lineup, name, pos, balls: [{ n, color, label? }, …], unit?: 0.1, anchor?: 0,
//     gaps?: [between ball 0 and 1, 1 and 2, …], grow?: 3.2, reach?: 3, glow?: 0.35, labelH?: 0.024 }
// Piles of one and the same sphere, side by side along x. One sphere is one
// terabyte, and every pile is built of those same spheres, so the single
// sphere stands beside the pile of 800, the pile of 800 beside the pile of
// 55 000, and all of them keep their size when the camera pulls back for the
// next: what came before is seen shrinking into the new scale.
// The spheres sit on a face-centred cubic lattice taken shell by shell from
// the centre, so the first n of them always make a ball. Ball `anchor` stands
// at the object's origin, the others beside it with `gaps` between neighbours.
// A ball of one is a lit marble (the engine's); the piles are sphere
// impostors, each a point sprite shaded as a ball that writes its own depth,
// so 600 000 of them cost about what the dust does.
//
// Step k shows balls 0..k, a step [i, j, …] exactly those. A ball that appears gathers out of the dust, inner
// spheres first; going back, the piles past the step fly apart. The steps of
// `${name}:labels` (0 or 1) show a line of type under each pile, at a fixed
// size on screen so it can still name the single sphere from far away.

// The first n points of the face-centred cubic lattice (integer coordinates
// with an even sum, neighbours √2 apart), nearest the origin first; the points
// of one shell in random order, so a pile grows evenly.
function fccShells(n) {
  const rho = Math.cbrt((3 * n) / (2 * Math.PI)) + 2
  const m = Math.ceil(rho), max = Math.ceil(rho * rho)
  const first = new Uint32Array(max + 2)
  for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) for (let z = -m; z <= m; z++) {
    if ((x + y + z) & 1) continue
    const r2 = x * x + y * y + z * z
    if (r2 <= max) first[r2 + 1]++
  }
  for (let i = 1; i < first.length; i++) first[i] += first[i - 1]
  const total = first[max + 1], xyz = new Int16Array(total * 3), fill = first.slice()
  for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) for (let z = -m; z <= m; z++) {
    if ((x + y + z) & 1) continue
    const r2 = x * x + y * y + z * z
    if (r2 > max) continue
    const k = fill[r2]++
    xyz[k * 3] = x; xyz[k * 3 + 1] = y; xyz[k * 3 + 2] = z
  }
  for (let r2 = 0; r2 <= max; r2++) {
    const lo = first[r2], hi = first[r2 + 1]
    for (let i = hi - 1; i > lo; i--) {
      const j = lo + Math.floor(Math.random() * (i - lo + 1))
      for (let c = 0; c < 3; c++) { const t = xyz[i * 3 + c]; xyz[i * 3 + c] = xyz[j * 3 + c]; xyz[j * 3 + c] = t }
    }
  }
  return xyz.subarray(0, Math.min(n, total) * 3)
}

const MAXB = 8
// Metal under a studio light, for the spheres: what a polished sphere shows is
// the room it reflects, so the room is drawn here (a dark floor, a deep blue
// sky, a large soft key light from the upper left front, a thin cool rim
// light from behind right) and each sphere reflects it with its colour as the
// reflectance (Schlick's Fresnel lifts the edges toward white). Shared by the
// impostor piles and the single sphere's mesh, so both are the same metal.
const METAL = /* glsl */ `
vec3 studio(vec3 d) {
  vec3 sky = mix(vec3(0.012, 0.012, 0.014), vec3(0.08, 0.085, 0.095), smoothstep(-0.25, 0.9, d.y));
  float key = smoothstep(0.84, 0.975, dot(d, normalize(vec3(-6.0, 9.0, 7.0))));
  float fill = smoothstep(0.55, 0.95, dot(d, normalize(vec3(5.0, 1.0, 8.0))));
  float rim = smoothstep(0.93, 0.995, dot(d, normalize(vec3(7.0, 3.0, -6.0))));
  return sky + vec3(1.0, 0.96, 0.9) * key * 3.2 + vec3(0.9, 0.92, 1.0) * fill * 0.22 + vec3(0.55, 0.72, 1.0) * rim * 1.6;
}
// Up close a polished sphere shows its light's edges: a rectangular softbox
// with crisp sides and a thin rim light, over a near-black room with a faint
// horizon. For the single sphere, the one seen large.
vec3 studioHard(vec3 d) {
  vec3 room = mix(vec3(0.004, 0.004, 0.005), vec3(0.05, 0.052, 0.06), smoothstep(-0.05, 0.85, d.y));
  room += vec3(0.07, 0.068, 0.065) * exp(-abs(d.y - 0.05) * 7.0);
  vec3 kd = normalize(vec3(-6.0, 9.0, 7.0));
  vec3 kx = normalize(cross(vec3(0.0, 1.0, 0.0), kd));
  vec3 ky = cross(kd, kx);
  float kz = dot(d, kd);
  vec2 kp = vec2(dot(d, kx), dot(d, ky)) / max(kz, 0.05);
  float key = step(0.0, kz) * (1.0 - smoothstep(0.25, 0.28, abs(kp.x))) * (1.0 - smoothstep(0.34, 0.37, abs(kp.y)));
  vec2 h = normalize(d.xz + 1e-5);
  float rim = smoothstep(0.9965, 0.9985, dot(h, normalize(vec2(7.0, -6.0)))) * smoothstep(-0.35, -0.15, d.y) * (1.0 - smoothstep(0.55, 0.75, d.y));
  return room + vec3(1.0, 0.97, 0.92) * key * 4.0 + vec3(0.85, 0.9, 1.0) * rim * 2.2;
}
vec3 metalHard(vec3 nW, vec3 vW, vec3 F0) {
  float ndv = max(dot(nW, vW), 0.0);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studioHard(reflect(-vW, nW)) * F + F0 * 0.02;
}
// nW, vW: world-space normal and direction toward the eye; F0: the metal's colour
vec3 metal(vec3 nW, vec3 vW, vec3 F0) {
  float ndv = max(dot(nW, vW), 0.0);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studio(reflect(-vW, nW)) * F + F0 * 0.035;
}`

const LINEUP_VERT = /* glsl */ `
attribute float aSeed, aK, aBall;    // rank in its pile (0 the centre … 1 the rim), which pile
uniform float uTime, uGrow, uReach, uRad, uViewH, uMaxPt, uShell;
uniform float uShowT[${MAXB}];
uniform float uHideT[${MAXB}];
uniform float uR[${MAXB}];
uniform vec3 uCenter[${MAXB}];
uniform vec3 uColor[${MAXB}];
uniform vec3 uLight;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vCv = vec3(0.0); vShade = 0.0; vPx = 1.0; vOut = vec3(0.0, 1.0, 0.0); vF = 0.0; }
void main() {
  int b = int(aBall + 0.5);
  float st = uShowT[b], ht = uHideT[b];
  // the inner spheres set out first; each takes 1.6 s to arrive
  float start = st + uGrow * (0.78 * pow(aK, 0.8) + 0.22 * aSeed);
  float f = ease((uTime - start) / 1.6);
  bool on = st >= 0.0 && uTime >= start;
  if (ht >= 0.0) { float g = 1.0 - ease((uTime - ht) / 1.1); f = min(f, g); on = on && g > 0.0; }
  if (!on) { off_(); return; }
  vec3 c = uCenter[b];
  vec3 off = position - c;
  float r = length(off);
  vec3 dir = r > 1e-4 ? off / r : normalize(vec3(hash(aSeed * 3.0), hash(aSeed * 5.0), hash(aSeed * 9.0)) - 0.5 + 1e-4);
  vec3 wp = (modelMatrix * vec4(c + off, 1.0)).xyz;
  float facingS = dot(dir, normalize(cameraPosition - wp));
  // a pile that stands is seen only by its skin: the buried spheres and its far
  // side are never drawn (without this, ~80 hidden spheres under each visible pixel).
  // The skin is 10 units deep: at 6, about one sight line in ten passed between
  // the spheres to the black behind, and the steel pile showed pinholes
  if (f >= 1.0 && ht < 0.0 && (r < uR[b] - uShell || facingS < -0.3)) { off_(); return; }
  vec3 side = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 1e-4);
  // adrift: out along its own direction, well beyond the pile, swirling in as it comes
  float reach = (uReach + uR[b]) * (0.8 + 1.4 * hash(aSeed * 91.0));
  vec3 far = dir * (r + reach) + side * reach * 0.6 * (hash(aSeed * 17.0) - 0.5) + vec3(0.0, reach * 0.5 * (hash(aSeed * 53.0) - 0.5), 0.0);
  float a = (1.0 - f) * 2.2;
  far = vec3(cos(a) * far.x - sin(a) * far.z, far.y, sin(a) * far.x + cos(a) * far.z);
  vec4 mv = modelViewMatrix * vec4(c + mix(far, off, f), 1.0);
  gl_Position = projectionMatrix * mv;
  // a sphere of radius uRad at this depth, in pixels of the target being drawn; a
  // standing sphere under 8 px is drawn a little larger, so the thin skin stays closed
  float px = uRad * projectionMatrix[1][1] * uViewH / max(-mv.z, 1e-3);
  float grow = f >= 1.0 ? mix(2.4, 1.0, smoothstep(2.0, 8.0, px)) : 1.0;
  gl_PointSize = clamp(px * grow, 1.0, min(uMaxPt, 0.2 * uViewH));
  vPx = px;
  vCv = mv.xyz;
  // the pile read as one ball: its side toward the key light brighter, its far side
  // in shadow, and a thin bright rim where its surface turns away from the eye
  float lit = 0.5 + 0.62 * max(dot(dir, normalize(uLight)), 0.0) + 0.25 * pow(1.0 - max(facingS, 0.0), 3.0);
  vShade = mix(1.0, lit, f);
  vOut = dir; vF = f;
  vColor = uColor[b] * (0.9 + 0.2 * hash(aSeed * 7.0));
}`
// A heap of small polished balls, seen as one body, is satin, not a mirror:
// every ball facing the light carries its own small highlight, so the lit side
// is bright with a soft edge and there is no single hot oval.
const HEAP = /* glsl */ `
vec3 studioRough(vec3 d) {
  vec3 sky = mix(vec3(0.006, 0.006, 0.008), vec3(0.06, 0.064, 0.075), smoothstep(-0.3, 0.9, d.y));
  float key = pow(max(dot(d, normalize(vec3(-6.0, 9.0, 7.0))), 0.0), 6.0);
  float rim = pow(max(dot(d, normalize(vec3(7.0, 3.0, -6.0))), 0.0), 10.0);
  return sky + vec3(1.0, 0.96, 0.9) * key * 1.1 + vec3(0.55, 0.72, 1.0) * rim * 0.35;
}
vec3 heap(vec3 N, vec3 V, vec3 F0) {
  float ndv = max(dot(N, V), 0.0);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0) * 0.4;
  return mix(studioRough(N), studioRough(reflect(-V, N)), 0.55) * F;
}`
const LINEUP_FRAG = /* glsl */ `
uniform mat4 projectionMatrix;
uniform float uRad;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF;
${METAL}
${HEAP}
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0; q.y = -q.y;
  float r2 = dot(q, q);
  // a standing sphere a few pixels across is drawn whole, as its square: cut
  // round, a sprite of 2 px keeps one pixel or none, and the pile shows pinholes
  bool tiny = vPx < 3.0 && vF >= 1.0;
  if (r2 > 1.0 && !tiny) discard;
  r2 = min(r2, 1.0);
  // the sphere's frame is built round the ray to it, not the view axis, so a
  // sphere off to the side has no false bright crescent
  vec3 fV = normalize(-vCv);
  vec3 xV = normalize(cross(vec3(0.0, 1.0, 0.0), fV));
  vec3 yV = cross(fV, xV);
  float nz = sqrt(1.0 - r2);
  vec3 nV = q.x * xV + q.y * yV + nz * fV;
  // the sphere's own surface depth, so neighbours and flyers cut each other right
  vec4 clip = projectionMatrix * vec4(vCv + nV * uRad, 1.0);
  gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
  vec3 vW = fV * mat3(viewMatrix);
  vec3 nW = nV * mat3(viewMatrix);
  vec3 pile = heap(vOut, vW, vColor);
  // a standing sphere a few pixels across shows the pile, not a highlight that would only shimmer
  if (tiny) { gl_FragColor = vec4(pile * vShade + vColor * 0.02, 1.0); return; }
  vec3 own = metal(nW, vW, vColor);
  // contact shadow: the side of a sphere that faces into its pile is in the
  // dark between its neighbours, and so is its edge where they touch
  float ao = mix(0.28, 1.0, smoothstep(-0.45, 0.75, dot(nW, vOut))) * mix(0.5, 1.0, smoothstep(0.0, 0.55, nz));
  vec3 col = own * mix(1.0, ao, vF) * vShade;
  float pileL = dot(pile, vec3(0.3, 0.55, 0.15));
  vec3 near = col * (0.55 + 0.9 * min(pileL, 1.4));
  col = mix(pile * vShade, mix(near, col, smoothstep(14.0, 40.0, vPx)), smoothstep(3.0, 11.0, vPx));
  gl_FragColor = vec4(mix(col, own, 1.0 - vF), 1.0);   // flyers: just themselves
}`

// A glint for a single sphere seen from far: a soft point a few pixels wide,
// in its colour, fading in as the sphere itself drops under ~4 px across.
const GLINT_VERT = /* glsl */ `
uniform float uRad, uViewH, uShow;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = 2.0 * uRad * projectionMatrix[1][1] * 0.5 * uViewH / max(-mv.z, 1e-3);   // the sphere's diameter on screen
  vA = uShow * (1.0 - smoothstep(2.0, 5.0, px));
  gl_PointSize = (uViewH / 1080.0) * 9.0;
}`
const GLINT_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = exp(-d * d * 4.0) * vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a * 1.6, 1.0);
}`

// The single sphere: a real sphere mesh in the same metal (no halo).
const UNIT_VERT = /* glsl */ `
varying vec3 vNW; varying vec3 vPW;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPW = wp.xyz; vNW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`
const UNIT_FRAG = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNW; varying vec3 vPW;
${METAL}
void main() { gl_FragColor = vec4(metalHard(normalize(vNW), normalize(cameraPosition - vPW), uColor), 1.0); }`

function buildLineup(o, ctx) {
  const { makeLabel } = ctx.helpers
  const unit = o.unit ?? 0.1, s = Math.SQRT2 * unit, rad = 0.9 * unit
  const balls = (o.balls || []).slice(0, MAXB).map((x) => ({ ...x, n: Math.max(1, Math.round(x.n || 1)) }))
  const NB = balls.length
  const lat = fccShells(Math.max(...balls.map((x) => x.n)))
  const R = balls.map(({ n }) => { const j = (n - 1) * 3; return Math.hypot(lat[j], lat[j + 1], lat[j + 2]) * s + unit })
  // side by side along x, ball `anchor` at the origin
  const gaps = o.gaps || [], A = Math.min(Math.max(0, o.anchor ?? 0), NB - 1), cx = new Array(NB).fill(0)
  for (let b = A + 1; b < NB; b++) cx[b] = cx[b - 1] + R[b - 1] + (gaps[b - 1] ?? 2) + R[b]
  for (let b = A - 1; b >= 0; b--) cx[b] = cx[b + 1] - R[b + 1] - (gaps[b] ?? 2) - R[b]

  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  // a ball of one: the marble
  const marbles = []
  balls.forEach((x, b) => {
    if (x.n !== 1) return
    const m = new Mesh(new SphereGeometry(rad, 96, 64), new ShaderMaterial({
      vertexShader: UNIT_VERT, fragmentShader: UNIT_FRAG, uniforms: { uColor: { value: new Color(x.color || ctx.palette.accent) } },
    }))
    m.position.set(cx[b], 0, 0); m.scale.setScalar(0); m.visible = false
    const gu = { uRad: { value: rad }, uViewH: { value: 1080 }, uShow: { value: 0 }, uColor: { value: new Color(x.color || ctx.palette.accent) } }
    const gg = new BufferGeometry(); gg.setAttribute('position', new BufferAttribute(new Float32Array([cx[b], 0, 0]), 3))
    const glint = new Points(gg, new ShaderMaterial({ vertexShader: GLINT_VERT, fragmentShader: GLINT_FRAG, uniforms: gu, transparent: true, depthWrite: false, blending: AdditiveBlending }))
    glint.frustumCulled = false
    const gvp = new Vector4()
    glint.onBeforeRender = (renderer) => { renderer.getCurrentViewport(gvp); gu.uViewH.value = gvp.w || 1080 }
    g.add(m); g.add(glint); marbles.push({ b, m, gu })
  })

  // the piles: one point per sphere, pile after pile
  const piles = balls.map((x, b) => b).filter((b) => balls[b].n > 1)
  const total = piles.reduce((acc, b) => acc + balls[b].n, 0)
  const pos = new Float32Array(total * 3), seed = new Float32Array(total), rank = new Float32Array(total), which = new Float32Array(total)
  const end = new Array(NB).fill(0)
  const TILT = new Matrix4().makeRotationFromEuler(new Euler(0.37, 0.61, 0.23)), tv = new Vector3()
  let q = 0
  for (const b of piles) {
    // a pile of thousands is jittered more, so its rows do not beat against the pixel
    // grid; the lattice is turned once, so no row of it points at a camera
    const n = balls[b].n, jit = unit * Math.min(0.24, 0.12 + 0.05 * Math.max(0, Math.log10(n / 800)))
    for (let j = 0; j < n; j++, q++) {
      tv.set(lat[j * 3], lat[j * 3 + 1], lat[j * 3 + 2]).multiplyScalar(s).applyMatrix4(TILT)
      pos[q * 3] = cx[b] + tv.x + gauss() * jit
      pos[q * 3 + 1] = tv.y + gauss() * jit
      pos[q * 3 + 2] = tv.z + gauss() * jit
      seed[q] = Math.random(); rank[q] = j / n; which[q] = b
    }
    end[b] = q
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  geo.setAttribute('aK', new BufferAttribute(rank, 1))
  geo.setAttribute('aBall', new BufferAttribute(which, 1))
  geo.setDrawRange(0, 0)
  const showT = new Array(MAXB).fill(-1), hideT = new Array(MAXB).fill(-1)
  const pad = (arr, f) => Array.from({ length: MAXB }, (_, i) => (i < arr.length ? arr[i] : f()))
  const mat = new ShaderMaterial({
    vertexShader: LINEUP_VERT, fragmentShader: LINEUP_FRAG, depthTest: true, depthWrite: true,
    uniforms: {
      uTime: { value: 0 }, uGrow: { value: o.grow ?? 3.2 }, uReach: { value: o.reach ?? 3 }, uRad: { value: rad },
      uViewH: { value: 1080 }, uMaxPt: { value: 256 }, uShell: { value: 10 * unit },
      uShowT: { value: showT }, uHideT: { value: hideT },
      uR: { value: pad(R, () => 0) },
      uCenter: { value: pad(cx.map((x) => new Vector3(x, 0, 0)), () => new Vector3()) },
      uColor: { value: pad(balls.map((x) => new Color(x.color || ctx.palette.accent)), () => new Color()) },
      uLight: { value: new Vector3(-6, 9, 7).normalize() },   // the engine's key light
    },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const vp = new Vector4()
  let maxPt = 0
  pts.onBeforeRender = (renderer) => {
    renderer.getCurrentViewport(vp); mat.uniforms.uViewH.value = vp.w || 1080
    if (!maxPt) { const gl = renderer.getContext(); const r = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE); maxPt = (r && r[1]) || 64; mat.uniforms.uMaxPt.value = maxPt }
  }
  g.add(pts)

  // labels: a fixed size on screen, hung under each pile
  const labels = []
  let labelsOn = !!state.get(`${o.name}:labels`)
  const makeLabels = () => {
    balls.forEach((x, b) => {
      if (!x.label) return
      const l = makeLabel(x.label, { px: 30, weight: 500, color: '#d4dcea', worldH: o.labelH ?? 0.036, letterSpacing: 0.14 })
      l.material.sizeAttenuation = false; l.material.opacity = 0
      // under its pile; the single sphere's above it, clear of the next pile's label when both are small
      const above = x.n === 1
      l.center.set(0.5, above ? -0.6 : 1.6)
      l.position.set(cx[b], above ? R[b] : -R[b], 0)
      l.userData.vis = 0; l.userData.ball = b
      g.add(l); labels.push(l)
    })
  }
  if (document.fonts?.load) document.fonts.load('500 30px "Space Grotesk"').catch(() => {}).finally(makeLabels)
  else makeLabels()

  let now = 0, step = -1
  let armed = false, armedAt = 0       // the engine armed us: a flight is bringing the camera here
  let doneAt = -1, doneCbs = []        // onDone of every assembly asked for, called when the growth ends
  const GROW = () => mat.uniforms.uGrow.value + 1.6
  const shown = (b) => showT[b] >= 0 && hideT[b] < 0
  const show = (b, t) => { showT[b] = t; hideT[b] = -1 }
  const hide = (b, t) => { if (shown(b)) hideT[b] = t }
  // a step: k shows piles 0..k, [i, j, …] shows exactly those
  const wants = (b) => (Array.isArray(step) ? step.includes(b) : b <= step)
  const go = (k, { instant = false } = {}) => {
    step = k
    if (armed) return                                 // the arrival builds it (assemble)
    for (let b = 0; b < NB; b++) {
      if (wants(b) && !shown(b)) show(b, instant ? now - 60 : now)
      else if (!wants(b) && shown(b)) { if (instant) showT[b] = -1; else hide(b, now) }
    }
  }
  const off = listen(o.name, (k) => go(k))
  const offL = listen(`${o.name}:labels`, (v) => { labelsOn = !!v })
  mat.addEventListener('dispose', () => { off(); offL() })   // the engine disposes materials, never calls a builder's dispose
  // opened mid-talk: the step is known; the piles build when the engine assembles the opening station, else at 1 s
  if (state.has(o.name)) { step = state.get(o.name); armed = true; armedAt = -5 }

  const api = o.assemble === false ? undefined : {
    // a flight toward the station: what stands flies apart, and stays out until the arrival
    arm() { armed = true; armedAt = now; for (let b = 0; b < NB; b++) hide(b, now) },
    // the arrival (and `c`): every pile up to the step gathers again
    assemble(t, onDone) {
      now = t; armed = false
      for (let b = 0; b < NB; b++) { if (wants(b)) show(b, t); else hide(b, t) }
      if (onDone) doneCbs.push(onDone)
      doneAt = t + GROW()                             // engine clock; never sooner than a full growth
    },
  }
  return {
    group: g, labels: [], api,
    update(t) {
      now = t; mat.uniforms.uTime.value = t
      if (armed && t - armedAt > 6) { armed = false; for (let b = 0; b < NB; b++) if (wants(b)) show(b, t) }   // the flight was turned away
      if (doneCbs.length && t >= doneAt) { const cbs = doneCbs; doneCbs = []; for (const cb of cbs) cb() }
      let count = 0
      for (let b = 0; b < NB; b++) {
        if (hideT[b] >= 0 && t - hideT[b] > 1.2) { showT[b] = -1; hideT[b] = -1 }   // gone
        if (showT[b] >= 0) count = Math.max(count, end[b])
      }
      geo.setDrawRange(0, count)                      // piles not shown are never drawn
      for (const { b, m, gu } of marbles) {
        const k = showT[b] < 0 ? 0 : hideT[b] >= 0 ? 1 - Math.min(1, (t - hideT[b]) / 0.6) : Math.min(1, Math.max(0, (t - showT[b]) / 0.9))
        const e = k * k * (3 - 2 * k)
        m.scale.setScalar(Math.max(e, 1e-4)); m.visible = e > 0.001
        gu.uShow.value = e
      }
      for (const l of labels) {
        const b = l.userData.ball
        const want = labelsOn && shown(b) && t - showT[b] > 1.2 ? 1 : 0
        l.userData.vis += (want - l.userData.vis) * 0.08
        l.material.opacity = 0.85 * l.userData.vis
        l.visible = l.userData.vis > 0.01
      }
    },
  }
}

// ---- streams ------------------------------------------------------------------------
//   { type: streams, name, pos, from: [x,y,z], to: [{ pos, lift?, node?: false }, …],
//     grains?: 2200 per stream, node?: 900 grains per end cluster, nodeRadius?: 0.45,
//     speed?: 0.11 (laps a second), color?, spread?: 0.08 }
// Step k shows the first k streams; a stream that starts gathers its end
// cluster over two seconds while its first grains are on the way.
const MAXS = 12
const STREAMS_VERT = /* glsl */ `
attribute float aSeed, aIdx, aKind;   // stream index; 0 a grain on the way, 1 a grain of the end cluster
attribute vec3 aEnd, aCtl, aOff;
uniform vec3 uFrom;
uniform float uShowT[${MAXS}];
uniform float uHideT[${MAXS}];
uniform float uBackT[${MAXS}];
uniform float uSpeed, uSize, uAlpha, uNodeR;
uniform vec3 uColor, uWhite;
${PLACE}
void main() {
  int i = int(aIdx + 0.5);
  float t0 = uShowT[i];
  float since = t0 == -1.0 ? -1.0 : uTime - t0;   // -1 is off; an instant start sits before t = 0
  // a stream that is stopped fades out over 1.2 s, its grains still running
  float h = uHideT[i];
  float on = (since < 0.0 ? 0.0 : 1.0) * (h < 0.0 ? smoothstep(0.0, 1.2, uTime - uBackT[i]) : 1.0 - smoothstep(0.0, 1.2, uTime - h));
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    // along a quadratic arc; a grain leaves only once its stream has started
    float s = fract(aSeed * 7.31 + uSpeed * uTime);
    float lead = since * uSpeed;                 // only grains that have left since the stream started
    float started = step(s, lead) + step(1.0, lead);
    vec3 a = mix(uFrom, aCtl, s), b = mix(aCtl, aEnd, s);
    p = mix(a, b, s) + aOff * (0.4 + sin(s * 3.14159));
    float ends = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(0.9, 1.0, s));
    alpha = uAlpha * ends * on * min(started, 1.0);
    size = uSize * (0.7 + 0.7 * hash(aSeed * 13.0));
  } else {
    // the end cluster: grains gather from around the end over two seconds and keep orbiting
    float f = ease(since / 2.2);
    float w = uTime * (0.25 + 0.4 * hash(aSeed * 5.0));
    vec3 o = aOff * uNodeR;
    vec3 home = aEnd + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    vec3 far = aEnd + normalize(aOff + 1e-4) * uNodeR * (5.0 + 6.0 * hash(aSeed * 3.0));
    p = mix(far, home, f);
    alpha = uAlpha * 1.3 * on * mix(0.2, 1.0, f);
    size = uSize * (0.9 + 0.9 * hash(aSeed * 29.0));
  }
  vec3 color = mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.25 : 0.0));
  if (alpha <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; return; }
  place(p, size, alpha, color, aSeed);
}`

function buildStreams(o, ctx) {
  const to = (o.to || []).slice(0, MAXS)
  const per = Math.round(o.grains ?? 2200), node = Math.round(o.node ?? 900)
  const nodeOf = (d) => (d.node === false ? 0 : node)
  const N = to.reduce((a, d) => a + per + nodeOf(d), 0)
  const from = o.from || [0, 0, 0]
  const seed = new Float32Array(N), idx = new Float32Array(N), kind = new Float32Array(N)
  const end = new Float32Array(N * 3), ctl = new Float32Array(N * 3), off = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  const spread = o.spread ?? 0.08
  let n = 0
  to.forEach((d, i) => {
    const e = d.pos || [0, 0, 0]
    const mid = [(from[0] + e[0]) / 2, (from[1] + e[1]) / 2, (from[2] + e[2]) / 2]
    const len = Math.hypot(e[0] - from[0], e[1] - from[1], e[2] - from[2])
    const c = [mid[0], mid[1] + (d.lift ?? 0.32) * len, mid[2]]
    for (let k = 0; k < per + nodeOf(d); k++, n++) {
      seed[n] = Math.random(); idx[n] = i; kind[n] = k < per ? 0 : 1
      end.set(e, n * 3); ctl.set(c, n * 3); pos.set(e, n * 3)
      if (k < per) off.set([gauss() * spread * len * 0.1, gauss() * spread * len * 0.1, gauss() * spread * len * 0.1], n * 3)
      else {
        const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.cbrt(Math.random())
        off.set([r * q * Math.cos(ph), r * z * 0.8, r * q * Math.sin(ph)], n * 3)
      }
    }
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aSeed', seed, 1], ['aIdx', idx, 1], ['aKind', kind, 1], ['aEnd', end, 3], ['aCtl', ctl, 3], ['aOff', off, 3]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const showT = new Array(MAXS).fill(-1), hideT = new Array(MAXS).fill(-1), backT = new Array(MAXS).fill(-100)
  const mat = material(STREAMS_VERT, {
    uFrom: { value: new Vector3(from[0], from[1], from[2]) }, uShowT: { value: showT }, uHideT: { value: hideT }, uBackT: { value: backT },
    uSpeed: { value: o.speed ?? 0.11 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 },
    uNodeR: { value: o.nodeRadius ?? 0.45 },
    uColor: { value: new Color(o.color || ctx.palette.accent).convertLinearToSRGB() }, uWhite: { value: new Color(1, 0.97, 0.9) },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  let now = 0
  // step k: the first k streams run; those starting now leave a quarter second
  // apart, those stopping fade out (and start afresh if asked for again)
  const go = (k, { instant = false } = {}) => {
    let fresh = 0
    const isOn = (i) => showT[i] !== -1
    for (let i = 0; i < MAXS; i++) {
      const running = isOn(i) && hideT[i] < 0
      const fading = isOn(i) && hideT[i] >= 0 && now - hideT[i] < 1.2
      if (i < k && !running) {
        // still on its way out: take it back, fading in from the brightness it has now
        // (1 - S(x) = S(1.2 - x) for this smoothstep, so the fade-in starts where the fade-out was)
        if (fading && !instant) { backT[i] = 2 * now - hideT[i] - 1.2; hideT[i] = -1 }
        else { showT[i] = instant ? now - 60 : now + 0.25 * fresh++; hideT[i] = -1; backT[i] = -100 }
      } else if (i >= k && running) {
        if (instant || showT[i] > now) showT[i] = -1      // not started yet: nothing to fade
        else hideT[i] = now
      }
    }
  }
  const off2 = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off2)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  return {
    group: g, labels: [], pixelRatio: mat.uniforms.uPixelRatio,
    update(t) { now = t; mat.uniforms.uTime.value = t },
    dispose: off2,
  }
}

export function installGrains(registerBuilder) {
  registerBuilder('lineup', buildLineup, { fields: ['pos', 'name', 'balls'] })
  registerBuilder('streams', buildStreams, { fields: ['pos', 'name', 'from', 'to'] })
}
