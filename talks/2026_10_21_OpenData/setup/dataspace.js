import { Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector2, Vector3, Vector4, Matrix3, Matrix4, Euler } from 'three'
import { mulberry32 } from './ring.js'
import { tick, listen, waiting, stepOf } from './grains.js'

// ---- dataspace ----------------------------------------------------------------------
//   { type: dataspace, name, pos?, cells?: 40, spacing?: 4, tilt?: [0.035, 0.09, 0.025] (rad), drift?: [0.1, 0.015, 0.06]
//     (units/s), rows?: 0.09, speed?: 1.4 (cells/s), tail?: 2.6 (cells), grains?: 26 (per pulse), wave?: 0.5,
//     color?, lit?, alpha?: 1.4, bit?: 0.7, size?: 1.4, far?: 140, from?: [x, y, z], calm?: [0.25, -0.15], seed? }
// The space the data lives in, behind the piles of the scale slides: a lattice of faint
// points with no end, a crystal of bits. Each point is a bit, bright or dim (`bit`: how
// dim); along some of its rows a packet of light runs, a short string of bits, and every
// point it passes is written again (its bit drawn anew); now and then a broad wave sweeps
// through the whole of it, as a read does. The rows are what makes it read as a lattice: seen nearly along one of
// them, the camera finds them running off to a vanishing point, as a room's edges do, so
// the lattice is turned only a few degrees off the world's axes; enough that no plane of
// it lies flat in the frame. It drifts slowly, so a standing slide still moves: near
// points slide past, far ones hardly at all.
//
// It has no end because it wraps round the camera: one period of it, a whole number of
// cells on a side, is drawn, and each point stands at whichever of its copies is nearest
// the camera; a point that wraps lands on another point of the lattice, and its bit and
// its rows are the same there too. Two layers of it: the near one, cells `spacing` wide,
// out to ~70 units, and a coarse one, every third point of the same lattice, from there
// out to `far`; where one fades out the other fades in, and their shared points keep
// their light. Each layer's fog ends inside half its period, so no wrap is ever seen. At
// a lower tier the near layer has fewer, wider cells.
//
// Step 1 fades it in: a front of light runs out from `from` and leaves the lattice behind
// it. Step 0 fades it out in a second and a half, and from then on nothing of it is drawn.
// The bottom-left of the frame (`calm`: the corner up to these NDC x, y) is kept dim and
// still, for the number and its caption there.

const VERT = /* glsl */ `
attribute vec3 aCell;    // a point: its cell, 0 … N-1 on each axis; a pulse grain: its row's cell at 0 along the row
attribute vec3 aRow;     // a point: the pulse on its row along x, y, z (its phase in cells, +N when it runs backwards; -1: none);
                         // a pulse grain: its row's in x
attribute float aSeed, aKind, aAxis, aTail;   // aKind 1: a pulse grain, on the row along aAxis, aTail of the way down its tail
uniform float uTime, uPixelRatio, uN, uS, uSpeed, uTail, uGlow, uAlpha, uSize, uVis, uFront, uFlash, uWave, uFar, uBit;
uniform vec4 uFog;       // this layer: in from x to y, out from z to w (units from the camera)
uniform vec2 uCalm;
uniform vec3 uCamC, uCamL, uFrom, uColor, uLit, uWaveDir;
uniform mat3 uRot;
varying vec3 vColor; varying float vAlpha; varying float vPx;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
// a pulse on one of a point's rows: its light here (the head arriving, then a fading
// trail), and a count of the times it has passed, which draws the point's bit anew
void row(float ph, float u, float salt, inout float lit, inout float gen) {
  if (ph < 0.0) return;
  float dir = ph >= uN ? -1.0 : 1.0;
  float since = uSpeed * uTime + mod(ph, uN) - dir * u;   // cells since the head passed this point, unwrapped
  float behind = mod(since, uN);
  lit += exp(-behind / uGlow) + exp(-(uN - behind) / 0.15);
  gen += floor(since / uN) * salt;
}
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; vPx = 1.0; }
void main() {
  vec3 c = aCell;
  float lit = 0.0, b;
  vec3 col;
  if (aKind < 0.5) {
    float gen = 0.0;
    row(aRow.x, c.x, 1.0, lit, gen);
    row(aRow.y, c.y, 17.0, lit, gen);
    row(aRow.z, c.z, 289.0, lit, gen);
    lit = min(lit, 1.4);
    float bit = step(0.55, hash(aSeed * 91.7 + gen * 0.137));
    float tw = 0.88 + 0.12 * sin(uTime * (0.4 + aSeed * 0.9) + aSeed * 40.0);
    b = mix(uBit, 1.0, bit) * tw + 2.2 * lit;
    col = mix(uColor, uLit, clamp(0.25 * bit + lit, 0.0, 1.0));
  } else {
    // along its row, behind the head
    float dir = aRow.x >= uN ? -1.0 : 1.0;
    float u = dir * (uSpeed * uTime + mod(aRow.x, uN) - aTail * uTail);
    if (aAxis < 0.5) c.x = u; else if (aAxis < 1.5) c.y = u; else c.z = u;
    // a packet of bits, not a comet: its grains are bright or dark (each its own, for the
    // whole run), fading only a little toward the end, behind a brighter head
    float k = 1.0 - aTail, on = step(0.3, hash(aSeed * 57.3));
    lit = k * k;
    b = 1.9 * (0.3 + 0.7 * k) * mix(0.1, 1.0, on) + 1.2 * exp(-aTail * 30.0);
    col = mix(uColor, uLit, 0.45 + 0.55 * k);
  }
  // the copy of this point nearest the camera
  vec3 rel = c - uCamC;
  rel -= uN * floor(rel / uN + 0.5);
  vec3 off = uRot * (rel * uS);
  float d = length(off);
  vec3 p = uCamL + off;
  // the slow wave: a broad sheet of light sweeping through, 70 units apart
  float w = mod(dot(uCamC + rel, uWaveDir) * uS - 7.0 * uTime, 70.0) - 35.0;
  b += uWave * exp(-w * w / 18.0) * (aKind < 0.5 ? 1.0 : 0.0);
  // this layer's share of the fog, fainter far off, and none at the eye
  float a = uAlpha * uVis * smoothstep(uFog.x, uFog.y, d) * (1.0 - smoothstep(uFog.z, uFog.w, d)) * mix(1.0, 0.22, smoothstep(8.0, uFar, d));
  // inside the front, which flashes as it passes
  float df = length(p - uFrom);
  a *= 1.0 - smoothstep(uFront - 6.0, uFront, df);
  float x = (df - uFront + 4.0) / 4.0;   // squared by hand: pow() of a negative base is NaN
  float flash = uFlash * exp(-x * x);
  b += 2.0 * flash; col = mix(col, uLit, min(flash, 1.0));
  if (a * b < 0.003) { off_(); return; }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // the calm corner: dim, a packet there no brighter than a point
  vec2 ndc = gl_Position.xy / max(gl_Position.w, 1e-4);
  float calm = (1.0 - smoothstep(uCalm.x - 0.4, uCalm.x + 0.1, ndc.x)) * (1.0 - smoothstep(uCalm.y - 0.2, uCalm.y + 0.15, ndc.y));
  b = mix(b, min(b, 1.0) * 0.25, calm);
  // a point of light its size at this depth; a near one drawn wide is as faint as it is
  // wide, and a far one is never under a pixel and a half (its light kept, not its size)
  float px = uPixelRatio * uSize * (aKind > 0.5 ? 0.8 : 1.0 + 0.4 * lit) * 72.0 / max(d, 0.1);
  a *= clamp((aKind > 0.5 ? 3.5 : 6.0) * uPixelRatio / px, 0.25, 1.0);
  float lo = 1.5 * uPixelRatio;
  if (px < lo) { a *= (px / lo) * (px / lo); px = lo; }
  px = min(px, 16.0 * uPixelRatio);
  gl_PointSize = px;
  vColor = col; vAlpha = a * b; vPx = px;
}`
// a point a pixel or two across is drawn whole (a soft edge would leave it a fraction of its light)
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha; varying float vPx;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = mix(1.0, 1.0 - smoothstep(0.06, 0.5, d), smoothstep(1.5, 4.0, vPx)) * vAlpha;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vColor * a, 1.0);
}`

const FADE_IN = 2.2, FADE_OUT = 1.5, FRONT = 26   // s, s, units/s

// one layer: N³ points, `share` of its rows along each axis carrying a pulse of G grains
function lattice(N, share, G, rand) {
  // the rows carrying a pulse, along each axis: a phase in cells, + N when it runs the other way
  const rowsOf = () => Float32Array.from({ length: N * N }, () => (rand() < share ? rand() * N + (rand() < 0.5 ? N : 0) : -1))
  const rx = rowsOf(), ry = rowsOf(), rz = rowsOf()
  const pulses = G ? [...rx, ...ry, ...rz].filter((p) => p >= 0).length : 0
  const total = N * N * N + pulses * G
  const cell = new Float32Array(total * 3), rowA = new Float32Array(total * 3).fill(-1)
  const seed = new Float32Array(total), kind = new Float32Array(total), axis = new Float32Array(total), tail = new Float32Array(total)
  let q = 0
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++, q++) {
    cell[q * 3] = i; cell[q * 3 + 1] = j; cell[q * 3 + 2] = k
    if (G) { rowA[q * 3] = rx[j * N + k]; rowA[q * 3 + 1] = ry[i * N + k]; rowA[q * 3 + 2] = rz[i * N + j] }
    seed[q] = rand()
  }
  // each pulse a short string of grains along its row
  if (G) [rx, ry, rz].forEach((rows, a) => rows.forEach((ph, r) => {
    if (ph < 0) return
    const m = Math.floor(r / N), n = r % N
    const at = a === 0 ? [0, m, n] : a === 1 ? [m, 0, n] : [m, n, 0]
    for (let g = 0; g < G; g++, q++) {
      cell.set(at, q * 3); rowA[q * 3] = ph
      seed[q] = rand(); kind[q] = 1; axis[q] = a; tail[q] = g / (G - 1)
    }
  }))
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(total * 3), 3))   // placed in the shader
  for (const [k, arr, n] of [['aCell', cell, 3], ['aRow', rowA, 3], ['aSeed', seed, 1], ['aKind', kind, 1], ['aAxis', axis, 1], ['aTail', tail, 1]]) geo.setAttribute(k, new BufferAttribute(arr, n))
  return geo
}

export function buildDataspace(o, ctx) {
  const rand = mulberry32(o.seed ?? 7)
  // the near layer: the same reach at every tier, with fewer, wider cells where the budget is smaller
  const reach = (o.cells ?? 40) * (o.spacing ?? 4)
  const N = Math.max(12, Math.round((o.cells ?? 40) * Math.cbrt(Math.min(1, (ctx.budget ?? 300000) / 300000))))
  const S = reach / N
  const far = o.far ?? 140, inner = [0.55 * reach / 2, 0.9 * reach / 2]   // where the near layer hands over to the coarse
  // the coarse layer: every third point of the same lattice, enough of them to reach `far`
  const Nc = Math.ceil((2 * far + 8) / (3 * S))

  const t3 = o.tilt || [0.035, 0.09, 0.025]
  const R = new Matrix3().setFromMatrix4(new Matrix4().makeRotationFromEuler(new Euler(t3[0], t3[1], t3[2]))), Rt = R.clone().transpose()
  const lin = (hex) => new Color(hex).convertSRGBToLinear()
  const wd = o.waveDir || [0.75, 0.3, 0.6]
  // what both layers share
  const u = {
    uTime: { value: 0 }, uPixelRatio: { value: 1 },
    uSpeed: { value: o.speed ?? 1.4 }, uTail: { value: o.tail ?? 2.6 }, uGlow: { value: 0.6 },
    uAlpha: { value: o.alpha ?? 1.4 }, uBit: { value: o.bit ?? 0.7 }, uSize: { value: o.size ?? 1.4 }, uVis: { value: 0 }, uFront: { value: 1e6 }, uFlash: { value: 0 },
    uWave: { value: o.wave ?? 0.5 }, uWaveDir: { value: new Vector3(...wd).normalize() }, uFar: { value: far },
    uCalm: { value: new Vector2(...(o.calm || [0.25, -0.15])) },
    uCamL: { value: new Vector3() }, uFrom: { value: new Vector3(...(o.from || [0, 0, 0])) },
    uColor: { value: lin(o.color || '#7f98c8') }, uLit: { value: lin(o.lit || '#d6e6ff') },
    uRot: { value: R },
  }
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const share = o.rows ?? 0.09, G = Math.round(o.grains ?? 26)
  const layers = [
    { N, S, fog: [1.2, 5, inner[0], inner[1]], geo: lattice(N, share, G, rand) },
    { N: Nc, S: 3 * S, fog: [inner[0], inner[1], far - 30, far], geo: lattice(Nc, share * 0.6, G, rand) },
  ].map((l) => {
    const mat = new ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: { ...u, uN: { value: l.N }, uS: { value: l.S }, uFog: { value: new Vector4(...l.fog) }, uCamC: { value: new Vector3() } },
      transparent: true, depthWrite: false, depthTest: true, blending: AdditiveBlending,   // the piles stand in front of it
    })
    const pts = new Points(l.geo, mat); pts.frustumCulled = false
    g.add(pts)
    return { ...l, mat, pts }
  })

  // the camera, in the group's frame and in cells of each drifting layer, just before the draw
  const drift = o.drift || [0.1, 0.015, 0.06], cam = new Vector3(), dv = new Vector3()
  layers[0].pts.onBeforeRender = (r, s, camera) => {
    cam.setFromMatrixPosition(camera.matrixWorld); g.worldToLocal(cam)
    u.uCamL.value.copy(cam)
    dv.set(drift[0], drift[1], drift[2]).multiplyScalar(u.uTime.value)
    for (const l of layers) l.mat.uniforms.uCamC.value.copy(cam).sub(dv).applyMatrix3(Rt).divideScalar(l.S)
  }

  // step 1: in, behind a front of light; 0: out
  let now = 0, last = -1, want = stepOf(o.name) ? 1 : 0, vis = 0, frontAt = want ? -2 : -1
  const go = (k) => {
    const w = k ? 1 : 0
    if (w && !want) frontAt = vis > 0.5 ? -1 : -2   // -2: set off with the next frame; back while still lit: no front
    want = w
  }
  const off = listen(o.name, go)
  layers[0].mat.addEventListener('dispose', off)
  const done = far + 90   // the front is past every point the camera can see from any scale slide
  const front = () => (frontAt < 0 ? 1e6 : (now - frontAt) * FRONT)
  const busy = () => waiting(o.name) || (want ? vis < 1 || front() < done : vis > 0)
  return {
    group: g, labels: [], api: { busy }, frameScale: u.uPixelRatio,
    update(t) {
      tick(t)
      const dt = last < 0 ? 0 : Math.max(0, t - last); last = t; now = t
      if (frontAt === -2 && want) frontAt = t
      vis = want ? Math.min(1, vis + dt / FADE_IN) : Math.max(0, vis - dt / FADE_OUT)
      const f = front()
      if (f >= done) frontAt = -1
      u.uTime.value = t; u.uVis.value = vis * vis * (3 - 2 * vis)
      u.uFront.value = frontAt < 0 ? 1e6 : f
      u.uFlash.value = frontAt < 0 ? 0 : 1 - Math.min(1, f / done)
      g.visible = vis > 0
    },
    dispose: off,
  }
}

export function installDataspace(registerBuilder) {
  registerBuilder('dataspace', buildDataspace, { fields: ['pos', 'name'], enterable: true })
}
