import {
  Group, Points, Mesh, SphereGeometry, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Vector4, Matrix4, Euler,
} from 'three'
import { state, listen, tick, waiting, smooth } from './kgrains.js'

// OpenData's piles of data (its setup/grains.js on feat/opendata-talk 1e52d06, the
// `lineup` and `floor` forms, unchanged but for their imports), for slides 15–17
// (the owner, 18 Oct: "Show something about open data, and masterclass"): one
// sphere a terabyte, the open data in gold, LHCb's whole 100 PB in blue. They
// take the steps, the clock and `smooth` from this talk's bus (setup/grains.js).
// The space of data behind them is setup/dataspace.js, the sun of plots round the
// gold pile setup/sun.js, both OpenData's too.

const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }

// ---- lineup -------------------------------------------------------------------------
//   { type: lineup, name, pos, balls: [{ n, color, label?, above?, at?: [x,y,z] }, …], unit?: 0.1, anchor?: 0,
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
  room += vec3(0.035, 0.034, 0.033) * exp(-abs(d.y - 0.05) * 4.0);
  vec3 kd = normalize(vec3(-6.0, 9.0, 7.0));
  vec3 kx = normalize(cross(vec3(0.0, 1.0, 0.0), kd));
  vec3 ky = cross(kd, kx);
  float kz = dot(d, kd);
  vec2 kp = vec2(dot(d, kx), dot(d, ky)) / max(kz, 0.05);
  float key = step(0.0, kz) * (1.0 - smoothstep(0.05, 0.42, length(kp * vec2(1.0, 0.8))));
  vec2 h = normalize(d.xz + 1e-5);
  float rim = smoothstep(0.9965, 0.9985, dot(h, normalize(vec2(7.0, -6.0)))) * smoothstep(-0.35, -0.15, d.y) * (1.0 - smoothstep(0.55, 0.75, d.y));
  return room + vec3(1.0, 0.97, 0.92) * key * 2.6 + vec3(0.85, 0.9, 1.0) * rim * 1.6;
}
vec3 metalHard(vec3 nW, vec3 vW, vec3 F0) {
  // a unit dot can pass 1 by rounding, and pow() of a negative base is NaN; a base of exactly 0
  // can be NaN too where pow is exp2(y * log2(x)) (seen as black specks under SwiftShader)
  float ndv = clamp(dot(nW, vW), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studioHard(reflect(-vW, nW)) * F + F0 * 0.02;
}
// nW, vW: world-space normal and direction toward the eye; F0: the metal's colour
vec3 metal(vec3 nW, vec3 vW, vec3 F0) {
  // a unit dot can pass 1 by rounding, and pow() of a negative base is NaN; a base of exactly 0
  // can be NaN too where pow is exp2(y * log2(x)) (seen as black specks under SwiftShader)
  float ndv = clamp(dot(nW, vW), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studio(reflect(-vW, nW)) * F + F0 * 0.035;
}`

const LINEUP_VERT = /* glsl */ `
attribute float aSeed, aK, aBall;    // rank in its pile (0 the centre … 1 the rim), which pile
attribute vec3 aFrom, aFromDir;       // a merging pile: where this sphere stands in its copy, and its outward direction there
uniform float uMerge[${MAXB}];
uniform vec3 uFromColor[${MAXB}];
uniform float uMergeAt;
uniform float uTime, uGrow, uReach, uRad, uViewH, uMaxPt, uShell;
uniform float uGs[${MAXB}];          // a pile's grain scale: each sphere stands for grain spheres, cbrt(grain) times as wide
uniform float uShowT[${MAXB}];
uniform float uHideT[${MAXB}];
uniform float uR[${MAXB}];
uniform vec3 uCenter[${MAXB}];
uniform vec3 uColor[${MAXB}];
uniform vec3 uLight;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF; varying float vRad;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vCv = vec3(0.0); vShade = 0.0; vPx = 1.0; vOut = vec3(0.0, 1.0, 0.0); vF = 0.0; vRad = 0.0; }
void main() {
  int b = int(aBall + 0.5);
  float st = uShowT[b], ht = uHideT[b];
  bool merging = uMerge[b] > 0.5 && ht < 0.0;
  // the inner spheres set out first; each takes 1.6 s to arrive (a merging pile: all at once)
  float start = merging ? st : st + uGrow * (0.78 * pow(max(aK, 1e-6), 0.8) + 0.22 * aSeed);
  float f = merging ? ease((uTime - st - uMergeAt - 0.5 * aSeed) / 2.2) : ease((uTime - start) / 1.6);
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
  float gs = uGs[b];
  if (f >= 1.0 && ht < 0.0 && (r < uR[b] - uShell * gs || facingS < -0.3)) { off_(); return; }
  vec3 side = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 1e-4);
  // adrift: out along its own direction, well beyond the pile, swirling in as it comes
  float reach = (uReach + uR[b]) * (0.8 + 1.4 * hash(aSeed * 91.0));
  vec3 far = dir * (r + reach) + side * reach * 0.6 * (hash(aSeed * 17.0) - 0.5) + vec3(0.0, reach * 0.5 * (hash(aSeed * 53.0) - 0.5), 0.0);
  float a = (1.0 - f) * 2.2;
  far = vec3(cos(a) * far.x - sin(a) * far.z, far.y, sin(a) * far.x + cos(a) * far.z);
  vec3 placed = c + mix(far, off, f);
  vec3 outw = dir;
  if (merging) {
    // first the copies of the smaller pile gather side by side (1.3 s) and hold, so they
    // can be counted; then every sphere flies from its copy into the larger pile
    float a1 = ease((uTime - st - 0.25 * aSeed) / 1.3);
    vec3 scat = (vec3(hash(aSeed * 3.0), hash(aSeed * 5.0), hash(aSeed * 9.0)) - 0.5) * 7.0;
    placed = mix(aFrom + scat * (1.0 - a1), position, f);
    outw = normalize(mix(aFromDir, dir, f) + 1e-4);
  }
  vec4 mv = modelViewMatrix * vec4(placed, 1.0);
  gl_Position = projectionMatrix * mv;
  // a sphere of radius uRad at this depth, in pixels of the target being drawn; a
  // standing sphere under 8 px is drawn a little larger, so the thin skin stays closed
  vRad = uRad * gs;
  float px = vRad * projectionMatrix[1][1] * uViewH / max(-mv.z, 1e-3);
  float grow = f >= 1.0 ? mix(2.4, 1.0, smoothstep(2.0, 8.0, px)) : 1.0;
  // a merging pile's spheres grow in over half a second, staggered, not all at once on the cut (23 Oct)
  float pop = merging ? smoothstep(0.0, 0.5, uTime - st - 0.25 * aSeed) : 1.0;
  gl_PointSize = clamp(px * grow * pop, 1.0, min(uMaxPt, 0.2 * uViewH));
  vPx = px;
  vCv = mv.xyz;
  // the pile read as one ball: its side toward the key light brighter, its far side
  // in shadow, and a thin bright rim where its surface turns away from the eye
  float lit = 0.5 + 0.62 * max(dot(dir, normalize(uLight)), 0.0) + 0.25 * pow(1.0 - clamp(facingS, 0.0, 1.0 - 1e-6), 3.0);
  vShade = mix(1.0, lit, f);
  if (merging) { lit = 0.5 + 0.62 * max(dot(outw, normalize(uLight)), 0.0) + 0.2; vShade = mix(lit, mix(1.0, lit, f), f); }
  vOut = outw; vF = merging ? max(f, 0.999 * step(1.3, uTime - st)) : f;
  vColor = (merging ? mix(uFromColor[b], uColor[b], f) : uColor[b]) * (0.9 + 0.2 * hash(aSeed * 7.0));
}`
// A heap of small polished balls, seen as one body, is satin, not a mirror:
// every ball facing the light carries its own small highlight, so the lit side
// is bright with a soft edge and there is no single hot oval.
const HEAP = /* glsl */ `
vec3 studioRough(vec3 d) {
  vec3 sky = mix(vec3(0.006, 0.006, 0.008), vec3(0.06, 0.064, 0.075), smoothstep(-0.3, 0.9, d.y));
  float key = pow(max(dot(d, normalize(vec3(-6.0, 9.0, 7.0))), 1e-6), 6.0);
  float rim = pow(max(dot(d, normalize(vec3(7.0, 3.0, -6.0))), 1e-6), 10.0);
  return sky + vec3(1.0, 0.96, 0.9) * key * 1.1 + vec3(0.55, 0.72, 1.0) * rim * 0.35;
}
vec3 heap(vec3 N, vec3 V, vec3 F0) {
  float ndv = clamp(dot(N, V), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0) * 0.4;
  // a pale pile (all channels high, as the 100 000 TB one since 23 Oct) keeps some of its own colour on its
  // shadow side, so it reads as pale metal on the lifted ground; the gold piles are untouched
  return mix(studioRough(N), studioRough(reflect(-V, N)), 0.55) * F + F0 * 0.35 * smoothstep(0.6, 0.72, min(F0.r, min(F0.g, F0.b)));
}`
const LINEUP_FRAG = /* glsl */ `
uniform mat4 projectionMatrix;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF; varying float vRad;
${METAL}
${HEAP}
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0; q.y = -q.y;
  float r2 = dot(q, q);
  // a standing sphere a few pixels across is drawn whole, as its square: cut
  // round, a sprite of 2 px keeps one pixel or none, and the pile shows pinholes
  // vF is a varying: a settled sphere's 1.0 can arrive as 0.99999, so "settled" is a
  // threshold (an exact 1.0 test left settled spheres cut round and half-mirror: the specks)
  float fly = vF > 0.995 ? 0.0 : 1.0 - vF;
  bool tiny = vPx < 3.0 && fly == 0.0;
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
  vec4 clip = projectionMatrix * vec4(vCv + nV * vRad, 1.0);
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
  vec3 col = own * mix(ao, 1.0, fly) * vShade;
  float pileL = dot(pile, vec3(0.3, 0.55, 0.15));
  vec3 near = col * (0.55 + 0.9 * min(pileL, 1.4));
  col = mix(pile * vShade, mix(near, col, smoothstep(14.0, 40.0, vPx)), smoothstep(3.0, 11.0, vPx));
  // flyers: just themselves, once they are big enough to show their own reflection; a
  // smaller one shows the pile, else its mirror catches the dark floor as a black speck
  gl_FragColor = vec4(mix(col, own, fly * smoothstep(3.0, 11.0, vPx)), 1.0);
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
  gl_PointSize = (uViewH / 1080.0) * 14.0;
}`
const GLINT_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = (exp(-d * d * 9.0) + 0.3 * exp(-d * d * 2.5)) * vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a * 2.2, 1.0);
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
  // a ball's `grain` (default 1): each drawn sphere stands for that many, cbrt(grain) times
  // as wide, so a pile of millions keeps its true size with a fraction of the points (seen
  // from afar its spheres are far under a pixel, and the pile is shaded as one satin ball)
  const balls = (o.balls || []).slice(0, MAXB).map((x) => {
    const n = Math.max(1, Math.round(x.n || 1)), grain = Math.max(1, x.grain || 1)
    return { ...x, n, pts: Math.max(1, Math.round(n / grain)), gs: Math.cbrt(grain) }
  })
  const NB = balls.length
  const lat = fccShells(Math.max(...balls.map((x) => x.pts)))
  const R = balls.map(({ pts, gs }) => { const j = (pts - 1) * 3; return (Math.hypot(lat[j], lat[j + 1], lat[j + 2]) * s + unit) * gs })
  // side by side along x, ball `anchor` at the origin
  const gaps = o.gaps || [], A = Math.min(Math.max(0, o.anchor ?? 0), NB - 1), cx = new Array(NB).fill(0)
  for (let b = A + 1; b < NB; b++) cx[b] = cx[b - 1] + R[b - 1] + (gaps[b - 1] ?? 2) + R[b]
  for (let b = A - 1; b >= 0; b--) cx[b] = cx[b + 1] - R[b + 1] - (gaps[b] ?? 2) - R[b]
  // each pile's centre: side by side along x, unless a ball says where it stands (`at`)
  const C = balls.map((x, b) => (Array.isArray(x.at) ? x.at.slice(0, 3) : [cx[b], 0, 0]))

  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  // a ball of one: the marble
  const marbles = []
  balls.forEach((x, b) => {
    if (x.n !== 1) return
    const m = new Mesh(new SphereGeometry(rad, 96, 64), new ShaderMaterial({
      vertexShader: UNIT_VERT, fragmentShader: UNIT_FRAG, uniforms: { uColor: { value: new Color(x.color || ctx.palette.accent) } },
    }))
    m.position.set(C[b][0], C[b][1], C[b][2]); m.scale.setScalar(0); m.visible = false
    const gu = { uRad: { value: rad }, uViewH: { value: 1080 }, uShow: { value: 0 }, uColor: { value: new Color(x.color || ctx.palette.accent) } }
    const gg = new BufferGeometry(); gg.setAttribute('position', new BufferAttribute(new Float32Array(C[b]), 3))
    const glint = new Points(gg, new ShaderMaterial({ vertexShader: GLINT_VERT, fragmentShader: GLINT_FRAG, uniforms: gu, transparent: true, depthWrite: false, blending: AdditiveBlending }))
    glint.frustumCulled = false
    const gvp = new Vector4()
    glint.onBeforeRender = (renderer) => { renderer.getCurrentViewport(gvp); gu.uViewH.value = gvp.w || 1080 }
    g.add(m); g.add(glint); marbles.push({ b, m, gu })
  })

  // the piles: one point per sphere, pile after pile
  const piles = balls.map((x, b) => b).filter((b) => balls[b].n > 1)
  const total = piles.reduce((acc, b) => acc + balls[b].pts, 0)
  const pos = new Float32Array(total * 3), seed = new Float32Array(total), rank = new Float32Array(total), which = new Float32Array(total)
  const end = new Array(NB).fill(0)
  const TILT = new Matrix4().makeRotationFromEuler(new Euler(0.37, 0.61, 0.23)), tv = new Vector3()
  let q = 0
  for (const b of piles) {
    // a pile of thousands is jittered more, so its rows do not beat against the pixel
    // grid; the lattice is turned once, so no row of it points at a camera
    const n = balls[b].pts, gs = balls[b].gs, jit = unit * gs * Math.min(0.24, 0.12 + 0.05 * Math.max(0, Math.log10(n / 800)))
    for (let j = 0; j < n; j++, q++) {
      tv.set(lat[j * 3], lat[j * 3 + 1], lat[j * 3 + 2]).multiplyScalar(s * gs).applyMatrix4(TILT)
      pos[q * 3] = C[b][0] + tv.x + gauss() * jit
      pos[q * 3 + 1] = C[b][1] + tv.y + gauss() * jit
      pos[q * 3 + 2] = C[b][2] + tv.z + gauss() * jit
      seed[q] = Math.random(); rank[q] = j / n; which[q] = b
    }
    end[b] = q
  }
  // a pile that `merges` starts as copies of a smaller pile, `copies` of ball `from`,
  // laid out at `copiesAt` (centres); sphere j of the large pile is sphere floor(j / N)
  // of copy j mod N, so the copies are whole piles of the smaller kind
  const fromPos = new Float32Array(total * 3), fromDir = new Float32Array(total * 3)
  {
    let q0 = 0
    for (const b of piles) {
      const m = balls[b].merge, n = balls[b].pts, gs = balls[b].gs
      if (m && Array.isArray(m.copiesAt) && m.copiesAt.length) {
        const N = m.copiesAt.length
        for (let j = 0; j < n; j++) {
          const k = j % N, i = Math.floor(j / N), cc = m.copiesAt[k]
          tv.set(lat[i * 3], lat[i * 3 + 1], lat[i * 3 + 2]).multiplyScalar(s * gs).applyMatrix4(TILT)
          const q = q0 + j
          fromPos[q * 3] = cc[0] + tv.x; fromPos[q * 3 + 1] = cc[1] + tv.y; fromPos[q * 3 + 2] = cc[2] + tv.z
          const l = tv.length() || 1
          fromDir[q * 3] = tv.x / l; fromDir[q * 3 + 1] = tv.y / l; fromDir[q * 3 + 2] = tv.z / l
        }
      }
      q0 += n
    }
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aFrom', new BufferAttribute(fromPos, 3))
  geo.setAttribute('aFromDir', new BufferAttribute(fromDir, 3))
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
      uGs: { value: pad(balls.map((x) => x.gs), () => 1) },
      uCenter: { value: pad(C.map((c) => new Vector3(c[0], c[1], c[2])), () => new Vector3()) },
      uColor: { value: pad(balls.map((x) => new Color(x.color || ctx.palette.accent)), () => new Color()) },
      uMerge: { value: pad(balls.map((x) => (x.merge ? 1 : 0)), () => 0) },
      uFromColor: { value: pad(balls.map((x) => new Color(x.merge ? balls[x.merge.from].color : (x.color || '#ffffff'))), () => new Color()) },
      uMergeAt: { value: o.mergeAt ?? 2.4 },
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
      const l = smooth(makeLabel(x.label, { px: 64, weight: 500, color: '#d4dcea', worldH: o.labelH ?? 0.036, letterSpacing: 0.14 }))
      l.material.sizeAttenuation = false; l.material.opacity = 0
      // under its pile; the single sphere's above it, clear of the next pile's label when both are small
      const above = x.above ?? x.n === 1
      l.center.set(0.5, above ? -0.6 : 1.6)
      l.position.set(C[b][0], C[b][1] + (above ? R[b] : -R[b]), C[b][2])
      l.userData.vis = 0; l.userData.ball = b
      g.add(l); labels.push(l)
    })
  }
  if (document.fonts?.load) document.fonts.load('500 64px "Space Grotesk"').catch(() => {}).finally(makeLabels)
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

  // busy (v0.7) while a pile gathers or breaks up on a step of its own (an arrival is the
  // engine's assembly), a label fades, or a step for later is still to come
  const settles = () => Math.max(GROW(), mat.uniforms.uMergeAt.value + 2.8)
  let labelsMoving = false
  const busy = () => labelsMoving || waiting(o.name) || waiting(`${o.name}:labels`)
    || showT.some((s, b) => s >= 0 && (hideT[b] >= 0 || now - s < settles()))
  const api = o.assemble === false ? { busy } : {
    busy,
    // a flight toward the station: what stands flies apart, and stays out until the arrival
    arm() { armed = true; armedAt = now; for (let b = 0; b < NB; b++) hide(b, now) },
    // the arrival (and `c`): every pile up to the step gathers again
    assemble(t, onDone) {
      now = t; armed = false
      for (let b = 0; b < NB; b++) { if (wants(b)) { if (!shown(b)) show(b, t) } else hide(b, t) }   // a pile already up stays (a path's arrival comes at its end)
      if (onDone) doneCbs.push(onDone)
      doneAt = t + GROW()                             // engine clock; never sooner than a full growth
    },
  }
  return {
    group: g, labels: [], api,
    update(t) {
      tick(t)
      now = t; mat.uniforms.uTime.value = t
      if (armed && t - armedAt > (o.armWait ?? 6)) { armed = false; for (let b = 0; b < NB; b++) if (wants(b)) show(b, t) }   // the flight was turned away, or a path holds the camera here before its end (`armWait`)
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
      labelsMoving = false
      for (const l of labels) {
        const b = l.userData.ball
        const want = labelsOn && shown(b) && t - showT[b] > 1.2 ? 1 : 0
        l.userData.vis += (want - l.userData.vis) * 0.08
        if (Math.abs(want - l.userData.vis) > 0.01) labelsMoving = true
        l.material.opacity = 0.85 * l.userData.vis
        l.visible = l.userData.vis > 0.01
      }
    },
  }
}


// ---- floor --------------------------------------------------------------------------
//   { type: floor, pos, radius?: 52, spacing?: 0.9, color?, alpha?: 0.32, size?: 1.1 }
// A ground of fine grains on y = 0, on a jittered grid, fading out toward its
// rim: the piles stand on it, and its rows running off to a horizon show the
// depth the camera moves through. Drawn behind the piles (depth tested).
const FLOOR_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime, uPixelRatio, uAlpha, uSize, uRadius;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float r = length(position.xz) / uRadius;
  float tw = 0.8 + 0.2 * sin(uTime * (0.6 + aSeed * 1.3) + aSeed * 40.0);
  // seen at a grazing angle the floor would close into a bright seam across the frame,
  // and far off into a horizon line: both fade
  vec3 wp = (modelMatrix * vec4(position, 1.0)).xyz;
  float graze = abs(cameraPosition.y - wp.y) / max(length(cameraPosition - wp), 1e-3);
  vA = uAlpha * tw * (1.0 - smoothstep(0.55, 1.0, r)) * smoothstep(0.4, 3.0, -mv.z)
     * smoothstep(0.05, 0.16, graze) * (1.0 - smoothstep(55.0, 95.0, -mv.z));
  gl_PointSize = max(1.0, uPixelRatio * uSize * (36.0 / max(-mv.z, 0.5)));
}`
const FLOOR_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.1, 0.5, d)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uColor * a, 1.0);
}`

function buildFloor(o) {
  const R = o.radius ?? 52, sp = o.spacing ?? 0.9
  const pts = []
  for (let x = -R; x <= R; x += sp) for (let z = -R; z <= R; z += sp) {
    if (x * x + z * z > R * R) continue
    pts.push(x + (Math.random() - 0.5) * sp * 0.5, 0, z + (Math.random() - 0.5) * sp * 0.5)
  }
  const n = pts.length / 3
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3))
  geo.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: n }, () => Math.random()), 1))
  const c = new Color(o.color || '#8fa6d6').convertSRGBToLinear()
  const mat = new ShaderMaterial({
    vertexShader: FLOOR_VERT, fragmentShader: FLOOR_FRAG, transparent: true, depthWrite: false, depthTest: true, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) }, uAlpha: { value: o.alpha ?? 0.32 },
      uSize: { value: o.size ?? 1.1 }, uRadius: { value: R }, uColor: { value: c } },
  })
  const p = new Points(geo, mat); p.frustumCulled = false
  const g = new Group(); g.add(p)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  return { group: g, labels: [], frameScale: mat.uniforms.uPixelRatio, update(t) { tick(t); mat.uniforms.uTime.value = t } }
}

export function installPiles(registerBuilder) {
  registerBuilder('lineup', buildLineup, { fields: ['pos', 'name', 'balls'] })
  registerBuilder('floor', buildFloor, { fields: ['pos'], enterable: true })
}
