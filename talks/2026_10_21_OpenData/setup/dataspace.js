import { Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Vector4 } from 'three'
import { mulberry32 } from './ring.js'
import { listen, waiting, tick, stepOf } from './grains.js'
import { weave, bez, tangent, sub, norm, cross, dist } from './weave.js'

// ---- dataspace ----------------------------------------------------------------------
//   { type: dataspace, name, pos, lineup?: 'scale', seed?: 11, knots?: 90, centre?: [0, 6, -10],
//     extent?: [200, 100, 200], clear: [[ax, ay, az, bx, by, bz, r], …], hold?: [[…], …],
//     piles?: [{ ball, at, r, view, look, lines?: 0, color?, delay? }, …], delay?: 4,
//     front?: { ball?: 0, after?: 0.8, speed?: 75 }, density?: 10 (grains a unit of filament),
//     alpha?: 1, color?, hot?, flow?: 0.45, run?: 1.4, wave?: 2.2 }
// The space the data lives in, behind the piles: a web of thin filaments of grains,
// each a bundle of a few fibres twisted round one another, meeting in knots, with
// packets of bits running along them, most of them toward the store. It is drawn the
// way matter lies in the universe at its largest scale, or light runs in a bundle of
// optical fibre: abstract, of the same grains as the rest of the world.
// The knots stand round the scene in a box of half-sides `extent` about `centre`,
// never in the `clear` space (capsules from a to b of radius r: the camera's poses,
// its flights between them and its lines of sight to the piles) or in the `hold`
// space (the piles themselves), so the web is the wall of a void seen from inside:
// the piles float in the void, and the web passes at its own depth as the camera
// flies (setup/weave.js weaves it).
// `piles` are the `lineup` form's piles, by its ball numbers: where each stands, its
// radius, and where the camera stands and looks on the slide it is the newest on
// (`view`, `look`). While the lineup shows a pile, no grain of the web is drawn
// against its edge, from wherever the camera sees it. A pile with `lines` gets that
// many feeders, threads from the web toward it, `delay` s after the lineup asks for it
// (its own, or the object's) and while it is the newest pile shown, carrying packets
// of bits in: the data gathering in the store, before the next slide sends it out. A
// pile that others merge into waits for the merge.
// Step 1 fades it in (2.5 s), 0 out (1.2 s). With `front`, the web comes in behind a
// front of light from the `ball` pile, once that pile forms (`after` s after the lineup
// asks for it and the camera has landed): the first terabyte lights up the space round
// it. It stays faint in the bottom-left of the frame, where the slides' number and
// caption stand. setup/dataspace.check.mjs holds the woven web against the deck's poses.

const MAXF = 8

// The shared part of the three shaders: where a grain is drawn, how big and how
// bright. A grain of the web is fine at every depth (its light falls off with
// distance, its size hardly does: under a pixel it is drawn a pixel wide with its
// share of light), a little bluer and dimmer far off, never close to the lens (a
// flight passes through the web's outskirts), faint in the bottom-left of the frame,
// where every slide here has its number and caption (as far right as the long
// numbers reach), not yet there outside the front, and never against a pile's edge.
const PUT = /* glsl */ `
uniform float uTime, uScale, uVis, uFront, uEdge, uFlash;
uniform vec3 uFrom;
uniform float uFeed[${MAXF}], uHalo[${MAXF}];
uniform vec4 uPile[${MAXF}];
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float shown(float g) { return g < -0.5 ? 1.0 : uFeed[int(g + 0.5)]; }
void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
// A feeder runs from deep in the web to a pile near the camera: where it runs away from
// the camera, or far behind its pile, its grains crowd onto a few pixels and add up to
// a glare. Its light is thinned there, so it is drawn with the same ink all along. (The
// root: a grain's light goes into the frame raised to 2.2.)
float even(vec3 p, vec3 t, float g) {
  if (g < -0.5) return 1.0;
  vec3 v = (modelViewMatrix * vec4(p, 1.0)).xyz;
  float across = length(cross(normalize((modelViewMatrix * vec4(t, 0.0)).xyz), normalize(v)));
  float d = length((modelViewMatrix * vec4(uPile[int(g + 0.5)].xyz, 1.0)).xyz);
  return pow(clamp(across, 0.08, 1.0) * clamp(d / length(v), 0.2, 1.0), 0.4545);
}
void put(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.1);
  float px = uScale * min(size * 2.4 * pow(60.0 / d, 0.55), 2.6);   // a near grain swells a little, never into a blot
  vec2 q = gl_Position.xy / max(gl_Position.w, 1e-3);
  float text = (1.0 - smoothstep(0.1, 0.45, q.x)) * (1.0 - smoothstep(-0.15, 0.35, q.y));
  float tw = 0.75 + 0.25 * sin(uTime * (0.7 + 1.9 * seed) + seed * 40.0);
  float far = smoothstep(70.0, 320.0, d);
  // the front: there inside it, a little brighter and whiter as it passes
  float df = length(p - uFrom);
  float x = (df - uFront + 0.5 * uEdge) / (0.25 * uEdge);   // squared by hand: pow() of a negative base is NaN
  float flash = uFlash * exp(-x * x);
  float lit = 1.0 - smoothstep(uFront - uEdge, uFront, df);
  // round each pile standing, the web keeps off its edge, before it or behind it: a thread
  // that touches a silhouette reads as a string the pile hangs from
  vec3 ray = normalize(mv.xyz);
  for (int i = 0; i < ${MAXF}; i++) {
    if (uHalo[i] < 0.001) continue;
    vec3 c = (modelViewMatrix * vec4(uPile[i].xyz, 1.0)).xyz;
    float miss = length(c - max(dot(c, ray), 0.0) * ray);   // how near the pile's middle this grain's line of sight runs
    lit *= 1.0 - uHalo[i] * (1.0 - smoothstep(1.1 * uPile[i].w, 1.5 * uPile[i].w, miss));
  }
  vAlpha = alpha * tw * min(1.0, px * px) * smoothstep(4.0, 14.0, d) * mix(1.0, 0.5, far) * (1.0 - 0.88 * text) * uVis * lit * (1.0 + 0.6 * flash);
  vColor = mix(mix(color, color * vec3(0.55, 0.7, 1.0), 0.6 * far), vec3(1.0), 0.5 * flash);
  gl_PointSize = max(px, 1.0);
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(max(vColor * a, vec3(1e-6)), vec3(2.2)), 1.0);
}`

// the fibres: each grain runs a short way along its fibre (`run`, at `flow` a second) and
// fades at the end of its run while the next one comes in, so the fibre streams without
// going anywhere; and a slow swell of light runs along it toward its end (`wave` a
// second), as through glass
const FIBRE_VERT = /* glsl */ `
attribute vec3 aTan, aCol;
attribute float aSeed, aB, aSize, aGroup, aArc;
uniform float uFlow, uRun, uWave, uLambda;
${PUT}
void main() {
  float u = fract(aSeed * 13.7 + uTime * uFlow / uRun);
  float w = 0.5 + 0.5 * sin(6.2832 * (aArc - uTime * uWave) / uLambda + aGroup);
  float a = aB * smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.88, 1.0, u)) * (0.55 + 0.45 * w * w);
  vec3 p = position + aTan * (u - 0.5) * uRun;
  put(p, aSize, a * shown(aGroup) * even(p, aTan, aGroup), aCol, aSeed);
}`
// the knots: grains held round a centre, each on its own slow orbit
const KNOT_VERT = /* glsl */ `
attribute vec3 aOff, aAxis, aCol;
attribute float aSeed, aB, aSize;
${PUT}
vec3 turn(vec3 v, vec3 k, float a) { return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a)); }
void main() {
  float a = uTime * (0.04 + 0.08 * hash(aSeed * 3.0)) / (0.4 + length(aOff));
  put(position + turn(aOff, aAxis, a), aSize, aB, aCol, aSeed);
}`
// the packets: a string of bits along a filament's curve behind a brighter head, again
// and again, with a pause between passes. Each grain is a bit, on or off, and every pass
// carries other bits: data, not a comet. A feeder's packets fade out with its thread,
// short of the pile, and are no brighter than the web's: the thread carries them.
const PACKET_VERT = /* glsl */ `
attribute vec3 aP0, aP1, aP2, aP3, aOff, aCol;
attribute float aSeed, aLag, aSpeed, aPhase, aB, aSize, aGroup;
${PUT}
void main() {
  float lap = aPhase + uTime * aSpeed;
  float s = fract(lap) * 1.25 - aLag;
  if (s < 0.0 || s > 1.0) { hide(); return; }
  float head = 1.0 - step(1e-6, aLag);
  float on = max(step(0.4, hash(aSeed * 57.3 + floor(lap) * 1.37)), head);
  float r = 1.0 - s;
  vec3 p = r * r * r * aP0 + 3.0 * r * r * s * aP1 + 3.0 * r * s * s * aP2 + s * s * s * aP3 + aOff * sin(3.14159 * s);
  float ends = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(aGroup < -0.5 ? 0.9 : 0.75, 1.0, s));
  vec3 t = 3.0 * r * r * (aP1 - aP0) + 6.0 * r * s * (aP2 - aP1) + 3.0 * s * s * (aP3 - aP2);
  put(p, aSize, aB * mix(0.1, 1.0, on) * ends * shown(aGroup) * even(p, t, aGroup), aCol, aSeed);
}`

// a fade's next value: up by `up` or down by `down`, never past where it is going
const toward = (x, to, up, down) => (to > x ? Math.min(to, x + up) : Math.max(to, x - down))
const smooth = (x) => x * x * (3 - 2 * x)

function points(vertexShader, attrs, uniforms) {
  const geo = new BufferGeometry()
  for (const [name, [arr, k]] of Object.entries(attrs)) geo.setAttribute(name, new BufferAttribute(arr, k))
  const mat = new ShaderMaterial({ vertexShader, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, depthTest: true, blending: AdditiveBlending })
  const p = new Points(geo, mat); p.frustumCulled = false
  return p
}

function buildDataspace(o, ctx) {
  const rnd = mulberry32(o.seed ?? 11)
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577 }
  const piles = (o.piles || []).slice(0, MAXF)
  const { knots, fils, feeds } = weave({ ...o, piles }, rnd)
  // a weaker device draws fewer grains, each a little brighter
  const k = Math.min(1, Math.max(0.2, (ctx.budget ?? 300000) / 300000)), gain = (o.alpha ?? 1) / Math.sqrt(k)
  const base = new Color(o.color || '#5b8cf0'), hot = new Color(o.hot || '#c8dcff'), white = new Color('#ffffff'), tmp = new Color()
  const colour = (c, h, g) => { tmp.copy(c).lerp(h, Math.min(1, Math.max(0, g))); return [tmp.r, tmp.g, tmp.b] }
  // a feeder is white with a tint of its pile's colour: it reads on the blue web whatever
  // the pile's colour, and the packets in it are the brightest thing in the web
  const feedCol = (f) => new Color('#ffffff').lerp(new Color(f.color || o.hot || '#c8dcff'), 0.35)

  // ---- the fibres
  const dens = (o.density ?? 10) * k
  const F = { position: [], aTan: [], aCol: [], aSeed: [], aB: [], aSize: [], aGroup: [], aArc: [] }
  for (const f of [...fils, ...feeds]) {
    const { P, L } = f, feed = f.group >= 0
    const u = norm(sub(P[3], P[0]))
    const n1 = norm(cross(u, Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), n2 = cross(u, n1)
    // a bundle of two or three fibres twisted round one another, wider in the middle, pinched
    // at its ends; a feeder is one fine strand (seen from close by, where its pile is, a bundle frays)
    const nStr = feed ? 1 : rnd() < 0.7 ? 2 : 3, w = feed ? 0.03 + 0.02 * rnd() : (0.12 + 0.25 * rnd()) * (0.6 + L / 70)
    const turns = (1 + 2 * rnd()) * (rnd() < 0.5 ? -1 : 1), ph = rnd() * 6.283
    const fc = feed ? feedCol(f) : null
    // a feeder is seen from close by: more grains, each fainter; its light comes up as it
    // leaves the web and fades out over its last quarter, short of the pile
    const n = Math.round(L * dens * (feed ? 3 : 1))
    for (let i = 0; i < n; i++) {
      const s = (i + rnd()) / n, c = bez(P, s), tg = tangent(P, s)
      const swell = 0.3 + 0.7 * Math.sin(Math.PI * s), halo = rnd() < 0.2
      let a, b
      if (halo) { a = gauss() * w * 2.5 * swell; b = gauss() * w * 2.5 * swell }
      else {
        const th = 6.283 * (Math.floor(rnd() * nStr) / nStr + turns * s) + ph, rr = w * swell
        a = rr * Math.cos(th) + gauss() * 0.05 * w; b = rr * Math.sin(th) + gauss() * 0.05 * w
      }
      F.position.push(c[0] + n1[0] * a + n2[0] * b, c[1] + n1[1] * a + n2[1] * b, c[2] + n1[2] * a + n2[2] * b)
      F.aTan.push(...tg)
      // brighter toward its knots, where the fibres gather
      const near = Math.max(Math.pow(1 - s, 5), Math.pow(s, 5))
      F.aCol.push(...(feed ? colour(fc, white, 0.3 * rnd()) : colour(base, hot, 0.25 * rnd() + 0.45 * near)))
      F.aSeed.push(rnd())
      F.aB.push(gain * (halo ? 1.45 : 2.75) * (feed ? 0.9 * smooth(Math.min(1, s / 0.1)) * (1 - smooth(Math.max(0, (s - 0.75) / 0.25))) : 0.75 + 0.45 * near))
      F.aSize.push(halo ? 0.8 : 0.65 + 0.3 * rnd())
      F.aGroup.push(f.group); F.aArc.push(s * L)
    }
  }

  // ---- the knots: a soft ball of grains (a Plummer sphere) round a few bright core grains,
  // larger where more filaments meet
  const K = { position: [], aOff: [], aAxis: [], aCol: [], aSeed: [], aB: [], aSize: [] }
  for (const kn of knots) {
    const m = Math.round((30 + 45 * kn.deg) * k), a0 = 0.35 + 0.28 * kn.deg
    const axis = norm([rnd() - 0.5, 1.5, rnd() - 0.5])
    for (let i = 0; i < m; i++) {
      const core = i < 3
      const r = core ? 0.15 * a0 * rnd() : Math.min(4 * a0, a0 / Math.sqrt(Math.pow(Math.max(rnd(), 1e-3), -2 / 3) - 1 + 1e-3))
      const z = 2 * rnd() - 1, ph = 6.283 * rnd(), q = Math.sqrt(1 - z * z)
      K.position.push(...kn.p)
      K.aOff.push(r * q * Math.cos(ph), r * z, r * q * Math.sin(ph))
      K.aAxis.push(...axis)
      K.aCol.push(...colour(base, hot, core ? 1 : 0.55 + 0.4 * rnd() - 0.2 * r / a0))
      K.aSeed.push(rnd())
      K.aB.push(gain * (core ? 2.0 : 1.25))
      K.aSize.push(core ? 1.5 + 0.2 * kn.deg : 0.7 + 0.3 * rnd())
    }
  }

  // ---- the packets: on a web filament a few, most running toward the store; on a feeder
  // more, and brighter, all into its pile. Each a string of TAIL bits behind its head.
  const Pk = { aP0: [], aP1: [], aP2: [], aP3: [], aOff: [], aCol: [], aSeed: [], aLag: [], aSpeed: [], aPhase: [], aB: [], aSize: [], aGroup: [] }
  const TAIL = 12
  for (const f of [...fils, ...feeds]) {
    const feed = f.group >= 0
    let P = f.P
    if (!feed && rnd() >= 0.8) P = [P[3], P[2], P[1], P[0]]   // a fifth of them run outward
    const count = feed ? 2 + Math.floor(f.L / 12) : Math.floor(f.L / 26 + rnd())
    const fc = feed ? feedCol(f) : null
    for (let j = 0; j < count; j++) {
      const v = (feed ? 7 : 4) + 4 * rnd(), phase = rnd(), off = feed ? [0, 0, 0] : [gauss() * 0.25, gauss() * 0.25, gauss() * 0.25]
      for (let i = 0; i < TAIL; i++) {
        Pk.aP0.push(...P[0]); Pk.aP1.push(...P[1]); Pk.aP2.push(...P[2]); Pk.aP3.push(...P[3])
        Pk.aOff.push(...off)
        const h = i / (TAIL - 1)
        Pk.aCol.push(...(feed ? colour(fc, white, 0.5 * (1 - h)) : colour(hot, white, 0.6 * (1 - h))))
        Pk.aSeed.push(rnd()); Pk.aLag.push((i * 0.34) / f.L); Pk.aSpeed.push(v / f.L / 1.25); Pk.aPhase.push(phase)
        // its bits a little fainter toward its end, its head brighter
        Pk.aB.push(gain * ((feed ? 1.5 : 1.7) * (0.35 + 0.65 * (1 - h)) + (i === 0 ? (feed ? 0.3 : 0.6) : 0)))
        Pk.aSize.push(1.5 * (1 - 0.35 * h)); Pk.aGroup.push(f.group)
      }
    }
  }

  const f32 = (a) => new Float32Array(a)
  // the front sets out from its pile (in the group's frame), and is past the last grain at `reach`
  const fr = o.front || null, src = fr ? piles.find((p) => p.ball === (fr.ball ?? 0)) : null
  const from = src ? sub(src.at, o.pos || [0, 0, 0]) : [0, 0, 0]
  const EDGE = 24
  const reach = EDGE + Math.max(0, ...knots.map((kn) => dist(kn.p, from) + 4), ...[...fils, ...feeds].flatMap((f) => f.P.map((p) => dist(p, from))))
  const uni = {
    uTime: { value: 0 }, uScale: { value: 1 }, uVis: { value: 0 },
    uFeed: { value: new Array(MAXF).fill(0) },
    uFront: { value: 1e6 }, uEdge: { value: EDGE }, uFlash: { value: 0 }, uFrom: { value: new Vector3(...from) },
    uPile: { value: Array.from({ length: MAXF }, (_, i) => (piles[i] ? new Vector4(...sub(piles[i].at, o.pos || [0, 0, 0]), piles[i].r ?? 1) : new Vector4())) },
    uHalo: { value: new Array(MAXF).fill(0) },
  }
  const share = (extra = {}) => ({ ...uni, ...extra })   // one set of uniforms: the same objects in all three
  const fibres = points(FIBRE_VERT, {
    position: [f32(F.position), 3], aTan: [f32(F.aTan), 3], aCol: [f32(F.aCol), 3], aSeed: [f32(F.aSeed), 1],
    aB: [f32(F.aB), 1], aSize: [f32(F.aSize), 1], aGroup: [f32(F.aGroup), 1], aArc: [f32(F.aArc), 1],
  }, share({ uFlow: { value: o.flow ?? 0.45 }, uRun: { value: o.run ?? 1.4 }, uWave: { value: o.wave ?? 2.2 }, uLambda: { value: 9 } }))
  const knotPts = points(KNOT_VERT, {
    position: [f32(K.position), 3], aOff: [f32(K.aOff), 3], aAxis: [f32(K.aAxis), 3], aCol: [f32(K.aCol), 3],
    aSeed: [f32(K.aSeed), 1], aB: [f32(K.aB), 1], aSize: [f32(K.aSize), 1],
  }, share())
  const nP = Pk.aSeed.length
  const packets = points(PACKET_VERT, {
    position: [new Float32Array(nP * 3), 3],
    ...Object.fromEntries(['aP0', 'aP1', 'aP2', 'aP3', 'aOff', 'aCol'].map((n) => [n, [f32(Pk[n]), 3]])),
    ...Object.fromEntries(['aSeed', 'aLag', 'aSpeed', 'aPhase', 'aB', 'aSize', 'aGroup'].map((n) => [n, [f32(Pk[n]), 1]])),
  }, share())

  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  g.add(fibres, knotPts, packets)
  g.visible = false

  // the lineup's step, read as the lineup reads it: k shows piles 0..k, [i, j, …] exactly those
  const lineup = o.lineup || 'scale'
  const asks = (step, b) => (Array.isArray(step) ? step.includes(b) : typeof step === 'number' && b <= step)
  const newest = (step) => (Array.isArray(step) ? (step.length ? Math.max(...step) : -1) : typeof step === 'number' ? step : -1)

  // the step: the whole web fades in or out on the world's clock. Turned on while dark, it
  // waits for its front ('wait'), which then runs out through the web ('run') until it
  // stands lit ('lit')
  let now = 0, last = null, vis = 0
  let want = stepOf(o.name) ? 1 : 0
  let front = fr && want ? 'wait' : 'lit', frontAt = 0, waitFrom = null
  const off = listen(o.name, (s) => {
    const w = s ? 1 : 0
    if (w && !want && fr && vis < 0.05) { front = 'wait'; waitFrom = null }
    want = w
  })
  // the front's pile is there once the lineup asks for it and the camera has landed: a
  // flight to the station holds the lineup's piles back until it lands, and the engine
  // arms us with them (arm, then assemble on landing)
  let asked = false, armed = false, armedAt = 0
  // the feeders follow the lineup: on `delay` s after their pile is asked for, while it is the newest
  // and each pile shown keeps the web off its edge (its halo, eased over a second)
  const fOn = piles.map(() => false), fAt = piles.map(() => 0), fVis = piles.map(() => 0)
  const hOn = piles.map(() => false), hVis = piles.map(() => 0)
  const follow = (step, instant = false) => {
    asked = asks(step, fr?.ball ?? 0)
    const top = newest(step)
    piles.forEach((p, i) => {
      const on = (p.lines ?? 0) > 0 && p.ball === top
      if (on && !fOn[i]) fAt[i] = instant ? -1e9 : now + (p.delay ?? o.delay ?? 4)
      fOn[i] = on
      hOn[i] = asks(step, p.ball)
      if (instant) hVis[i] = hOn[i] ? 1 : 0
    })
  }
  const offF = listen(lineup, (s) => follow(s))
  follow(stepOf(lineup), true)
  let moving = false
  const busy = () => waiting(o.name) || moving
  const dispose = () => { off(); offF() }
  fibres.material.addEventListener('dispose', dispose)   // the engine disposes materials, never calls a builder's dispose
  return {
    group: g, labels: [], frameScale: uni.uScale,
    api: {
      busy,
      // nothing here builds itself on arrival: these only tell when the camera sets out for the station and lands
      arm() { armed = true; armedAt = now },
      assemble(t, onDone) { armed = false; onDone?.() },
    },
    update(t) {
      tick(t)
      const dt = last == null ? 0 : Math.min(Math.max(t - last, 0), 0.25)
      last = t; now = t; uni.uTime.value = t
      if (armed && t - armedAt > 6) armed = false   // the flight was turned away
      vis = toward(vis, want, dt / 2.5, dt / 1.2)
      uni.uVis.value = smooth(vis)
      moving = vis !== want
      // the front: away `after` s once its pile forms (or 10 s on without it), done past the last grain
      if (front === 'wait' && want) {
        if (waitFrom == null) waitFrom = t
        if ((asked && !armed) || t - waitFrom > 10) { front = 'run'; frontAt = t + (fr.after ?? 0.8) }
      }
      const f = front === 'wait' ? 0 : front === 'run' ? Math.max(0, (t - frontAt) * (fr.speed ?? 75)) : 1e6
      if (front === 'run' && f > reach) front = 'lit'
      uni.uFront.value = front === 'lit' ? 1e6 : f
      uni.uFlash.value = front === 'run' ? 1 : 0
      if (want && front !== 'lit') moving = true
      piles.forEach((p, i) => {
        const to = fOn[i] && t >= fAt[i] ? 1 : 0
        fVis[i] = toward(fVis[i], to, dt / 3, dt / 0.6)
        uni.uFeed.value[i] = smooth(fVis[i])
        hVis[i] = toward(hVis[i], hOn[i] ? 1 : 0, dt, dt)
        uni.uHalo.value[i] = smooth(hVis[i])
        if (vis > 0 && (fVis[i] !== to || (fOn[i] && t < fAt[i]) || hVis[i] !== (hOn[i] ? 1 : 0))) moving = true
      })
      g.visible = vis > 0.001
    },
    dispose,
  }
}

export function installDataspace(registerBuilder) {
  // enterable: the camera stands inside the web (in its void) on every pose that shows it
  registerBuilder('dataspace', buildDataspace, { fields: ['pos', 'name'], enterable: true })
}
