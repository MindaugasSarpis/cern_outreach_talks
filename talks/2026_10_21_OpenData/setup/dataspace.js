import { Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color } from 'three'
import { mulberry32 } from './ring.js'
import { listen, waiting, tick, steps } from './grains.js'

// ---- dataspace ----------------------------------------------------------------------
//   { type: dataspace, name, pos, seed?: 11, knots?: 90, centre?: [0, 6, -10], extent?: [200, 100, 200],
//     clear: [[ax, ay, az, bx, by, bz, r], …], hold?: [[…], …], density?: 10 (grains a unit of
//     filament), alpha?: 1, color?, hot?, flow?: 0.45, run?: 1.4, wave?: 2.2,
//     feed?: { name, delay?: 4, piles: [{ ball, at, r, view, lines?: 3, color? }, …] } }
// The space the data lives in, behind the piles: a web of thin filaments of grains,
// each a bundle of a few fibres twisted round one another, meeting in knots, with
// packets of brighter grains running along them, most of them toward the store. It
// is drawn the way matter lies in the universe at its largest scale, or light runs
// in a bundle of optical fibre: abstract, of the same grains as the rest of the world.
// The knots stand round the scene in a box of half-sides `extent` about `centre`,
// never in the `clear` space (capsules from a to b of radius r: the camera's poses,
// its flights between them and its lines of sight to the piles) or in the `hold`
// space (the piles themselves), so the web is the wall of a void seen from inside:
// the piles float in the void, and the web passes at its own depth as the camera flies.
// With `feed`, a few filaments run from the web into each pile while it stands (while
// the `name` form's step shows its ball, read as the lineup reads it), `delay` s after
// it is asked for, carrying packets of the pile's colour into it: the data gathering
// in the store. Each comes from behind its pile as seen from `view`, so it reads as
// running into it, not across it.
// Step 1 fades it in (2.5 s), 0 out (1.2 s). It stays faint in the bottom-left of the
// frame, where the slides' number and caption stand.

const MAXF = 8

// a few vectors as plain arrays: the web is woven once, on the CPU
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const len = (a) => Math.hypot(a[0], a[1], a[2])
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a) => scale(a, 1 / (len(a) || 1))
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dist = (a, b) => len(sub(a, b))
function segDist(p, a, b) {
  const ab = sub(b, a), ap = sub(p, a), l2 = dot(ab, ab)
  const u = l2 > 0 ? Math.min(1, Math.max(0, dot(ap, ab) / l2)) : 0
  return len(sub(ap, scale(ab, u)))
}
// a cubic Bézier through four points, and its direction
function bez(P, s) {
  const r = 1 - s, a = r * r * r, b = 3 * r * r * s, c = 3 * r * s * s, d = s * s * s
  return [0, 1, 2].map((i) => a * P[0][i] + b * P[1][i] + c * P[2][i] + d * P[3][i])
}
function tangent(P, s) {
  const r = 1 - s, a = -3 * r * r, b = 3 * r * r - 6 * r * s, c = 6 * r * s - 3 * s * s, d = 3 * s * s
  return norm([0, 1, 2].map((i) => a * P[0][i] + b * P[1][i] + c * P[2][i] + d * P[3][i]))
}

// The web's shape, from the object and a seeded random source: the knots, the
// filaments between them (with their feeders into the piles), each as four Bézier
// points. Pure, so the same seed weaves the same web on every machine.
function weave(o, rnd) {
  const C = o.centre || [0, 6, -10], E = o.extent || [200, 100, 200]
  const caps = (list) => (list || []).map((c) => ({ a: c.slice(0, 3), b: c.slice(3, 6), r: c[6] }))
  const clear = caps(o.clear), hold = caps(o.hold)
  // how far p stands outside the given capsules (negative: inside one)
  const room = (p, list) => list.reduce((m, c) => Math.min(m, segDist(p, c.a, c.b) - c.r), Infinity)
  const free = (p, m) => room(p, clear) > m && room(p, hold) > m

  // knots: spread through the box, further apart the further out (a near knot shows
  // its parallax, a far one only fills the sky), the near shells a little favoured
  const want = o.knots ?? 90, knots = []
  for (let tries = 0; knots.length < want && tries < want * 80; tries++) {
    const z = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - z * z), rr = 0.08 + 0.92 * Math.pow(rnd(), 0.7)
    const p = [C[0] + E[0] * rr * q * Math.cos(ph), C[1] + E[1] * rr * z, C[2] + E[2] * rr * q * Math.sin(ph)]
    if (!free(p, 8)) continue
    const far = dist(p, C)
    if (knots.some((k) => dist(k.p, p) < 14 + 0.2 * Math.max(far, k.far))) continue
    knots.push({ p, far, deg: 0, dirs: [] })
  }

  // a gentle bow: the middle points pushed sideways, a little, the same way or not quite;
  // `straight`: only the first, so the curve comes in to b along the line (a feeder into its pile)
  const bowed = (a, b, k = 0.12, straight = false) => {
    const ch = sub(b, a), L = len(ch), u = norm(ch)
    const side = () => { const r = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]; return norm(sub(r, scale(u, dot(r, u)))) }
    const s1 = scale(side(), L * k * (0.4 + 0.6 * rnd())), s2 = scale(side(), L * k * 0.5 * rnd())
    const m1 = [a[0] + ch[0] / 3 + s1[0], a[1] + ch[1] / 3 + s1[1], a[2] + ch[2] / 3 + s1[2]]
    const t = straight ? 0 : 1
    const m2 = [a[0] + ch[0] * 2 / 3 + t * (s1[0] * 0.7 + s2[0]), a[1] + ch[1] * 2 / 3 + t * (s1[1] * 0.7 + s2[1]), a[2] + ch[2] * 2 / 3 + t * (s1[2] * 0.7 + s2[2])]
    return [a, m1, m2, b]
  }

  // filaments: the shortest links first, each knot taking at most four, never two
  // leaving a knot side by side, and none through the clear or held space: a web
  // with open cells rather than a tangle
  const cand = []
  knots.forEach((k, i) => {
    const near = knots.map((m, j) => [dist(k.p, m.p), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 5)
    for (const [d, j] of near) cand.push([d, Math.min(i, j), Math.max(i, j)])
  })
  cand.sort((x, y) => x[0] - y[0])
  const seen = new Set(), fils = []
  const spread = (k, u) => k.dirs.every((v) => dot(v, u) < 0.85)   // ~32° apart at least
  for (const [d, i, j] of cand) {
    const key = i * 4096 + j
    if (seen.has(key)) continue
    seen.add(key)
    const A = knots[i], B = knots[j]
    if (A.deg >= 4 || B.deg >= 4 || d > 34 + 0.42 * (A.far + B.far) / 2) continue
    const u = norm(sub(B.p, A.p))
    if (!spread(A, u) || !spread(B, scale(u, -1))) continue
    const P = bowed(A.p, B.p)
    let ok = true
    for (let s = 1; s < 16 && ok; s++) ok = free(bez(P, s / 16), 3)
    if (!ok) continue
    A.deg++; B.deg++; A.dirs.push(u); B.dirs.push(scale(u, -1))
    // each runs toward the store: its far end first, so its light and most of its packets go inward
    fils.push({ P: dist(P[0], C) < dist(P[3], C) ? [P[3], P[2], P[1], P[0]] : P, L: d, group: -1 })
  }

  // feeders: from the nearest knots behind each pile as its view sees it (not right
  // behind it, where the pile would hide the whole run), fanned apart, into its middle;
  // from above or the side, never from below (a line from below holds a pile up like a string)
  const feeds = []
  ;(o.feed?.piles || []).slice(0, MAXF).forEach((pile, g) => {
    const at = pile.at, v = norm(sub(at, pile.view || [0, 0, 60]))
    const opts = knots.filter((k) => k.deg > 0).map((k) => {
      const d = sub(k.p, at), l = len(d)
      return { k, l, u: scale(d, 1 / l), c: dot(d, v) / l }
    }).filter((x) => x.c > 0.45 && x.c < 0.92 && x.u[1] > -0.05).sort((x, y) => x.l - y.l)
    const chosen = []
    for (const x of opts) {
      if (chosen.length >= (pile.lines ?? 3)) break
      if (chosen.some((y) => dot(y.u, x.u) > 0.8)) continue
      const P = bowed(x.k.p, at, 0.1, true)
      // clear of the camera until it is in its pile, and never through another pile
      let ok = true
      for (let s = 1; s < 24 && ok; s++) {
        const p = bez(P, s / 24)
        if (dist(p, at) < (pile.r ?? 1) + 8) break
        ok = room(p, clear) > 2 && o.feed.piles.every((q) => q === pile || dist(p, q.at) > (q.r ?? 1) + 1.5)
      }
      if (!ok) continue
      chosen.push(x); x.k.deg++
      feeds.push({ P, L: x.l, group: g, color: pile.color, r: pile.r ?? 1 })
    }
  })
  return { knots: knots.filter((k) => k.deg > 0), fils, feeds, C }
}

// The shared part of the three shaders: where a grain is drawn, how big and how
// bright. A grain of the web is fine at every depth (its light falls off with
// distance, its size hardly does: under a pixel it is drawn a pixel wide with its
// share of light), a little bluer and dimmer far off, never close to the lens (a
// flight passes through the web's outskirts), and faint in the bottom-left of the
// frame, where every slide here has its number and caption.
const PUT = /* glsl */ `
uniform float uTime, uScale, uVis;
uniform float uFeed[${MAXF}];
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float shown(float g) { return g < -0.5 ? 1.0 : uFeed[int(g + 0.5)]; }
void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
void put(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.1);
  float px = uScale * min(size * 2.4 * pow(60.0 / d, 0.55), 2.6);   // a near grain swells a little, never into a blot
  vec2 q = gl_Position.xy / max(gl_Position.w, 1e-3);
  float text = (1.0 - smoothstep(-0.2, 0.35, q.x)) * (1.0 - smoothstep(-0.15, 0.35, q.y));
  float tw = 0.75 + 0.25 * sin(uTime * (0.7 + 1.9 * seed) + seed * 40.0);
  float far = smoothstep(70.0, 320.0, d);
  vAlpha = alpha * tw * min(1.0, px * px) * smoothstep(4.0, 14.0, d) * mix(1.0, 0.5, far) * (1.0 - 0.88 * text) * uVis;
  vColor = mix(color, color * vec3(0.55, 0.7, 1.0), 0.6 * far);
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
  put(position + aTan * (u - 0.5) * uRun, aSize, a * shown(aGroup), aCol, aSeed);
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
// the packets: a bright head and a fading tail along a filament's curve, again and
// again, with a pause between passes
const PACKET_VERT = /* glsl */ `
attribute vec3 aP0, aP1, aP2, aP3, aOff, aCol;
attribute float aSeed, aLag, aSpeed, aPhase, aB, aSize, aGroup;
${PUT}
void main() {
  float s = fract(aPhase + uTime * aSpeed) * 1.25 - aLag;
  if (s < 0.0 || s > 1.0) { hide(); return; }
  float r = 1.0 - s;
  vec3 p = r * r * r * aP0 + 3.0 * r * r * s * aP1 + 3.0 * r * s * s * aP2 + s * s * s * aP3 + aOff * sin(3.14159 * s);
  float ends = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(0.9, 1.0, s));
  put(p, aSize, aB * ends * shown(aGroup), aCol, aSeed);
}`

// a fade's next value: up by `up` or down by `down`, never past where it is going
const toward = (x, to, up, down) => (to > x ? Math.min(to, x + up) : Math.max(to, x - down))

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
  const { knots, fils, feeds, C } = weave(o, rnd)
  // a weaker device draws fewer grains, each a little brighter
  const k = Math.min(1, Math.max(0.2, (ctx.budget ?? 300000) / 300000)), gain = (o.alpha ?? 1) / Math.sqrt(k)
  const base = new Color(o.color || '#5b8cf0'), hot = new Color(o.hot || '#c8dcff'), white = new Color('#ffffff'), tmp = new Color()
  const colour = (c, h, g) => { tmp.copy(c).lerp(h, Math.min(1, Math.max(0, g))); return [tmp.r, tmp.g, tmp.b] }
  const feedCol = (f) => new Color(f.color || o.hot || '#c8dcff')

  // ---- the fibres
  const dens = (o.density ?? 10) * k
  const F = { position: [], aTan: [], aCol: [], aSeed: [], aB: [], aSize: [], aGroup: [], aArc: [] }
  for (const f of [...fils, ...feeds]) {
    const { P, L } = f, feed = f.group >= 0
    const u = norm(sub(P[3], P[0]))
    const n1 = norm(cross(u, Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), n2 = cross(u, n1)
    // a bundle of two or three fibres twisted round one another, wider in the middle, pinched at its ends
    // (a feeder is a thread: seen from close by, a bundle frays)
    const nStr = rnd() < 0.7 ? 2 : 3, w = (0.12 + 0.25 * rnd()) * (0.6 + L / 70) * (feed ? 0.3 : 1)
    const turns = (1 + 2 * rnd()) * (rnd() < 0.5 ? -1 : 1), ph = rnd() * 6.283
    const fc = feed ? feedCol(f) : null
    // a feeder is seen from close by, where its pile is: many more grains, each fainter
    const n = Math.round(L * dens * (feed ? 4 : 1))
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
      F.aCol.push(...(feed ? colour(fc, hot, 0.25 * rnd() + 0.3 * s) : colour(base, hot, 0.25 * rnd() + 0.45 * near)))
      F.aSeed.push(rnd())
      F.aB.push(gain * (halo ? 1.45 : 2.75) * (0.75 + 0.45 * near) * (feed ? 0.4 : 1))
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
  // more, all into its pile
  const Pk = { aP0: [], aP1: [], aP2: [], aP3: [], aOff: [], aCol: [], aSeed: [], aLag: [], aSpeed: [], aPhase: [], aB: [], aSize: [], aGroup: [] }
  const TAIL = 12
  for (const f of [...fils, ...feeds]) {
    const feed = f.group >= 0
    let P = f.P
    if (!feed && rnd() >= 0.8) P = [P[3], P[2], P[1], P[0]]   // a fifth of them run outward
    const count = feed ? 2 + Math.floor(f.L / 14) : Math.floor(f.L / 26 + rnd())
    const fc = feed ? feedCol(f) : null
    for (let j = 0; j < count; j++) {
      const v = (feed ? 7 : 4) + 4 * rnd(), phase = rnd(), off = [gauss() * 0.25, gauss() * 0.25, gauss() * 0.25]
      for (let i = 0; i < TAIL; i++) {
        Pk.aP0.push(...P[0]); Pk.aP1.push(...P[1]); Pk.aP2.push(...P[2]); Pk.aP3.push(...P[3])
        Pk.aOff.push(...off)
        const h = i / (TAIL - 1)
        Pk.aCol.push(...(feed ? colour(fc, white, 0.45 * (1 - h)) : colour(hot, white, 0.6 * (1 - h))))
        Pk.aSeed.push(rnd()); Pk.aLag.push((i * 0.34) / f.L); Pk.aSpeed.push(v / f.L / 1.25); Pk.aPhase.push(phase)
        Pk.aB.push(gain * 1.9 * Math.pow(1 - h, 1.3)); Pk.aSize.push(1.5 * (1 - 0.45 * h)); Pk.aGroup.push(f.group)
      }
    }
  }

  const f32 = (a) => new Float32Array(a)
  const uni = {
    uTime: { value: 0 }, uScale: { value: 1 }, uVis: { value: 0 },
    uFeed: { value: new Array(MAXF).fill(0) },
  }
  const share = (extra = {}) => ({ uTime: uni.uTime, uScale: uni.uScale, uVis: uni.uVis, uFeed: uni.uFeed, ...extra })
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

  // the step: the whole web fades in or out on the world's clock
  let now = 0, last = null, vis = 0
  let want = steps.has(o.name) && steps.get(o.name) ? 1 : 0
  const off = listen(o.name, (s) => { want = s ? 1 : 0 })
  // the feeders follow the form whose piles they run into: on `delay` s after their ball is asked for
  const feed = o.feed || null, piles = (feed?.piles || []).slice(0, MAXF)
  const fOn = piles.map(() => false), fAt = piles.map(() => 0), fVis = piles.map(() => 0)
  const asks = (step, b) => (Array.isArray(step) ? step.includes(b) : typeof step === 'number' && b <= step)
  const follow = (step, instant = false) => piles.forEach((p, i) => {
    const on = asks(step, p.ball)
    if (on && !fOn[i]) fAt[i] = instant ? -1e9 : now + (feed.delay ?? 4)
    fOn[i] = on
  })
  const offF = feed ? listen(feed.name, (s) => follow(s)) : () => {}
  if (feed && steps.has(feed.name)) follow(steps.get(feed.name), true)
  let moving = false
  const busy = () => waiting(o.name) || moving
  const dispose = () => { off(); offF() }
  fibres.material.addEventListener('dispose', dispose)   // the engine disposes materials, never calls a builder's dispose
  return {
    group: g, labels: [], api: { busy }, frameScale: uni.uScale,
    update(t) {
      tick(t)
      const dt = last == null ? 0 : Math.min(Math.max(t - last, 0), 0.25)
      last = t; now = t; uni.uTime.value = t
      vis = toward(vis, want, dt / 2.5, dt / 1.2)
      uni.uVis.value = vis * vis * (3 - 2 * vis)
      moving = vis !== want
      piles.forEach((p, i) => {
        const to = fOn[i] && t >= fAt[i] ? 1 : 0
        fVis[i] = toward(fVis[i], to, dt / 3, dt)
        uni.uFeed.value[i] = fVis[i] * fVis[i] * (3 - 2 * fVis[i])
        if (vis > 0 && (fVis[i] !== to || (fOn[i] && t < fAt[i]))) moving = true
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

