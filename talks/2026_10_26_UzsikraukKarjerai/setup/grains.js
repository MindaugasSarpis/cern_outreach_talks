import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3,
} from 'three'

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

const BUS = 'karjera:grains'
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
const unit = () => {
  const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z)
  return [q * Math.cos(ph), z, q * Math.sin(ph)]
}

// A grain's twinkle, size from distance, and the engine's linear-light point.
const PLACE = /* glsl */ `
uniform float uTime, uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void place(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.86 + 0.14 * sin(uTime * (0.6 + seed * 1.2) + seed * 40.0);   // a slow, shallow twinkle: a stream encoder smears fast sparkle
  gl_PointSize = uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1));
  vColor = color;
  vAlpha = alpha * tw;
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

function material(vertexShader, uniforms) {
  return new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) }, ...uniforms },
  })
}
function pointsGroup(geo, mat, pos) {
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(pos?.[0] || 0, pos?.[1] || 0, pos?.[2] || 0)
  return g
}

// ---- pairs --------------------------------------------------------------------------
//   { type: pairs, name, pos, pairs?: 24000, radius?: 7, survivors?: 60,
//     matter?: '#ffc05a', anti?: '#6f9dff', light?: '#fff4dc', size?: 1.2, alpha?: 0.6,
//     spread?: 7 (seconds over which the pairs meet), gather?: 2.2 (radius the survivors gather into) }
// Steps: 0 nothing; 1 the hot cloud forms (grains fly in from far, 2.5 s);
// 2 the pairs meet and go out as light, over `spread` seconds, the inner
// pairs last; 3 the survivors gather into a small turning knot.
// Going back to a step shows it settled at once (a fade of half a second).
const PAIRS_VERT = /* glsl */ `
attribute vec3 aMeet, aDir;
attribute float aKind, aRank, aSeed;   // kind 0 matter, 1 antimatter, 2 matter with no partner
uniform float uStep, uT1, uT2, uT3, uTs, uSpread, uR, uGather, uSize, uAlpha;
uniform vec3 uMatter, uAnti, uLight;
${PLACE}
void main() {
  if (uStep < 0.5) { hide(); return; }
  // the cloud turns, the inside faster
  float r0 = length(aMeet);
  float w = uTime * (0.05 + 0.10 / (1.0 + r0 / (0.3 * uR)));
  float sgn = aKind > 0.5 && aKind < 1.5 ? -1.0 : 1.0;
  vec3 jitter = 0.18 * vec3(sin(uTime * 1.7 + aSeed * 50.0), cos(uTime * 1.3 + aSeed * 31.0), sin(uTime * 1.9 + aSeed * 17.0));
  vec3 home = turnY(aMeet + sgn * aDir + jitter, w);
  // forming: in from far, each grain at its own moment
  float f = ease((uTime - uT1 - aSeed * 1.1) / 1.6);
  vec3 far = turnY(aMeet * 3.2 + aDir * 6.0, w - 1.6 * (1.0 - f));
  vec3 p = mix(far, home, f);
  vec3 color = aKind > 0.5 && aKind < 1.5 ? uAnti : uMatter;
  color = mix(color, vec3(1.0), 0.18 * hash(aSeed * 7.0));
  float alpha = uAlpha * mix(0.2, 1.0, f);
  float size = uSize * (0.7 + 0.7 * hash(aSeed * 31.0)) * (1.0 + 1.5 * (1.0 - f));
  // the meeting: the two grains of a pair close in, flash, and leave as two grains of light, back to back
  if (uStep > 1.5 && aKind < 1.5) {
    float ta = uT2 + uSpread * aRank;
    float k = uTime - ta;
    vec3 meet = turnY(aMeet, w);
    if (k > -0.7) p = mix(p, meet, ease((k + 0.7) / 0.7));
    if (k > 0.0) {
      vec3 d = normalize(sgn * aDir + 0.25 * vec3(hash(aSeed * 3.0) - 0.5, hash(aSeed * 5.0) - 0.5, hash(aSeed * 9.0) - 0.5));
      p = meet + d * k * uR * 0.9;
      float flash = exp(-k * 9.0);
      alpha = uAlpha * (1.6 * flash + 0.55 * exp(-k * 1.4));
      size = uSize * (1.0 + 2.2 * flash) * (0.6 + 0.5 * hash(aSeed * 13.0));
      color = mix(uLight, vec3(1.0), flash);
      if (k > 3.5) { hide(); return; }
    }
  }
  // the remainder: brighter as the rest goes out, and gathering on the last step
  if (aKind > 1.5) {
    float lone = uStep > 1.5 ? ease((uTime - uT2 - 0.4 * uSpread) / (0.6 * uSpread)) : 0.0;
    alpha = uAlpha * (1.0 + 1.6 * lone);
    size = uSize * (1.0 + 1.3 * lone) * (0.9 + 0.5 * hash(aSeed * 11.0));
    color = mix(uMatter, vec3(1.0, 0.97, 0.88), 0.35 * lone);
    if (uStep > 2.5) {
      float g = ease((uTime - uT3 - aSeed * 0.8) / 2.6);
      vec3 knot = turnY(normalize(aDir) * uGather * (0.35 + 0.65 * hash(aSeed * 17.0)) * vec3(1.0, 0.45, 1.0), uTime * (0.25 + 0.15 * hash(aSeed * 23.0)));
      p = mix(p, knot, g);
      // gathered, they share the light: a dense knot must not burn to a white disc under the bloom
      size *= 1.0 + 0.2 * g;
      alpha *= 1.0 - 0.55 * g;
    }
  }
  // a step shown settled fades in over half a second
  alpha *= clamp((uTime - uTs) / 0.5, 0.0, 1.0);
  if (alpha <= 0.002) { hide(); return; }
  place(p, size, alpha, color, aSeed);
}`

function buildPairs(o, ctx) {
  const P = Math.max(100, Math.min(80000, Math.round(o.pairs ?? 24000)))
  const S = Math.max(0, Math.round(o.survivors ?? 60))
  const R = o.radius ?? 7
  const N = 2 * P + S
  const meet = new Float32Array(N * 3), dir = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  const kind = new Float32Array(N), rank = new Float32Array(N), seed = new Float32Array(N)
  let n = 0
  const put = (m, d, k, rk) => {
    meet.set(m, n * 3); dir.set(d, n * 3); pos.set(m, n * 3)
    kind[n] = k; rank[n] = rk; seed[n] = Math.random(); n++
  }
  for (let i = 0; i < P; i++) {
    const u = unit(), r = R * Math.cbrt(Math.random()) * (0.85 + 0.15 * Math.random())
    const m = [u[0] * r, u[1] * r * 0.8, u[2] * r]
    const dd = unit(), len = 0.25 + 0.55 * Math.random()
    const d = [dd[0] * len, dd[1] * len, dd[2] * len]
    // the outer pairs meet first, the core last, with a scatter so it is not a shell
    const rk = Math.min(1, Math.max(0, 1 - r / R + 0.35 * gauss() * 0.5))
    put(m, d, 0, rk); put(m, d, 1, rk)
  }
  for (let i = 0; i < S; i++) {
    const u = unit(), r = R * Math.cbrt(Math.random())
    put([u[0] * r, u[1] * r * 0.8, u[2] * r], unit(), 2, 0)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aMeet', meet, 3], ['aDir', dir, 3], ['aKind', kind, 1], ['aRank', rank, 1], ['aSeed', seed, 1]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const mat = material(PAIRS_VERT, {
    uStep: { value: 0 }, uT1: { value: -100 }, uT2: { value: -100 }, uT3: { value: -100 }, uTs: { value: -100 },
    uSpread: { value: o.spread ?? 7 }, uR: { value: R }, uGather: { value: o.gather ?? 2.2 },
    uSize: { value: o.size ?? 1.2 }, uAlpha: { value: o.alpha ?? 0.6 },
    uMatter: { value: new Color(...rgb(o.matter || '#ffc05a')) }, uAnti: { value: new Color(...rgb(o.anti || '#6f9dff')) },
    uLight: { value: new Color(...rgb(o.light || '#fff4dc')) },
  })
  const g = pointsGroup(geo, mat, o.pos)
  const u = mat.uniforms
  let now = 0, step = 0, played = -100
  // forward one step: play it; anything else: show the step settled (every moment far in the past)
  const go = (k, { play = true } = {}) => {
    const prev = step
    step = k
    u.uStep.value = k
    if (play && k === prev + 1) {
      played = now
      if (k === 1) { u.uT1.value = now; u.uTs.value = -100 }
      if (k === 2) u.uT2.value = now + 0.4
      if (k === 3) u.uT3.value = now + 0.2
    } else {
      u.uT1.value = -100; u.uT2.value = -100; u.uT3.value = -100; u.uTs.value = now
    }
  }
  const off = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off)
  if (state.has(o.name)) go(state.get(o.name), { play: false })
  // an arrival from elsewhere, or `c`: the cloud plays again from its first
  // step up to the current one (not when a step has only just started playing)
  const api = {
    arm() {},
    assemble(t, onDone) {
      now = t
      if (step >= 1 && now - played > 5) {
        played = now
        u.uT1.value = now; u.uTs.value = -100
        u.uT2.value = step >= 2 ? now + 2.8 : -100
        u.uT3.value = step >= 3 ? now + 2.8 + u.uSpread.value + 0.6 : -100
      }
      onDone?.()
    },
  }
  return { group: g, labels: [], api, pixelRatio: u.uPixelRatio, update(t) { now = t; u.uTime.value = t }, dispose: off }
}

// ---- path ---------------------------------------------------------------------------
//   { type: path, name, pos, points: [[x,y,z], …] (2–16), colors?: ['#…', …] per point,
//     color?, grains?: 14000, node?: 700, nodeRadius?: 0.55, width?: 0.1, speed?: 0.35,
//     size?: 1, alpha?: 0.55, delay?: 0.8, draw?: 2.8 (seconds to draw one leg),
//     arc?: 0 (each leg rises off the ground between its places, by this times 0.12 of its length) }
// Step k (0 … points-1) draws the trail on to point k; -1 hides it. The head
// travels there over `draw` seconds per leg, after `delay`; each point's
// cluster gathers as the head reaches it. The cluster at the head burns
// brightest, the ones behind settle to a steady glow.
const MAXP = 16
const PATH_VERT = /* glsl */ `
attribute float aS, aKind, aNode, aSeed;   // aS: place along the whole path (0 … 1); kind 0 trail, 1 cluster
attribute vec3 aOff;
uniform vec3 uP[${MAXP}];
uniform vec3 uC[${MAXP}];
uniform float uAlias[${MAXP}];   // the first point at the same place: a return lights the cluster already there
uniform float uN, uFrom, uTo, uT0, uDur, uSpeed, uSize, uAlpha, uNodeR, uWidth, uArc;
uniform vec3 uColor;
${PLACE}
vec3 pt(int i) { return uP[clamp(i, 0, int(uN) - 1)]; }
vec3 curve(float u) {
  float m = uN - 1.0;
  u = clamp(u, 0.0, m);
  int i = int(min(floor(u), m - 1.0));
  float t = u - float(i);
  vec3 p0 = pt(i - 1), p1 = pt(i), p2 = pt(i + 1), p3 = pt(i + 2);
  if (i == 0) p0 = 2.0 * p1 - p2;
  if (i + 2 > int(m)) p3 = 2.0 * p2 - p1;
  float t2 = t * t, t3 = t2 * t;
  vec3 c = 0.5 * ((2.0 * p1) + (-p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3);
  // arc: each leg rises off the ground between its two places, by its length
  c.y += uArc * 4.0 * t * (1.0 - t) * length(p2 - p1) * 0.12;
  return c;
}
void main() {
  float m = uN - 1.0;
  if (uTo < -0.5) { hide(); return; }
  float head = mix(uFrom, uTo, ease((uTime - uT0) / max(uDur, 0.01)));
  vec3 p; float alpha, size; vec3 color;
  if (aKind < 0.5) {
    // the trail: every grain flows from the start toward the end; only those behind the head are lit
    float u = mod(aS * m + uSpeed * uTime * (0.8 + 0.4 * hash(aSeed * 3.0)), m);
    if (u > head) { hide(); return; }
    float tip = 1.0 - smoothstep(0.0, 0.5, head - u);          // the last half-leg before the head
    float fromStart = smoothstep(0.0, 0.25, u);
    vec3 wob = aOff * uWidth * (1.0 + 0.6 * sin(uTime * 0.7 + aSeed * 30.0));
    p = curve(u) + wob;
    int ni = int(floor(u + 0.5));
    color = mix(uColor, uC[clamp(ni, 0, int(m))], 0.35);
    color = mix(color, vec3(1.0, 0.98, 0.92), 0.25 * hash(aSeed * 7.0) + 0.5 * tip);
    alpha = uAlpha * fromStart * (0.6 + 0.9 * tip);
    size = uSize * (0.65 + 0.6 * hash(aSeed * 13.0)) * (1.0 + 0.9 * tip);
  } else {
    // a place on the path: gathers as the head comes to it, then keeps turning
    float i = aNode;
    float f = ease((head - (i - 0.55)) / 0.55);
    if (f <= 0.0) { hide(); return; }
    // the place the head is at burns brightest, also when the path comes back to it
    float at = 0.0;
    for (int j = 0; j < ${MAXP}; j++) {
      if (float(j) > m) break;
      if (abs(uAlias[j] - i) < 0.5) at = max(at, exp(-abs(head - float(j)) * 3.0) * step(float(j) - 0.55, head));
    }
    float w = uTime * (0.3 + 0.35 * hash(aSeed * 5.0));
    vec3 o = turnY(aOff * uNodeR, w);
    vec3 c = uP[int(i)];
    vec3 far = c + normalize(aOff + 1e-4) * uNodeR * (4.0 + 5.0 * hash(aSeed * 19.0));
    p = mix(far, c + o, f);
    color = mix(uC[int(i)], vec3(1.0), 0.2 * hash(aSeed * 29.0) + 0.3 * at);
    alpha = uAlpha * mix(0.25, 1.0, f) * (0.7 + 0.5 * at);
    size = uSize * (0.8 + 0.8 * hash(aSeed * 23.0)) * (1.0 + 0.3 * at);
  }
  place(p, size, alpha, color, aSeed);
}`

function buildPath(o, ctx) {
  const pts = (o.points || []).slice(0, MAXP)
  if (pts.length < 2) throw new Error('path: needs at least two points')
  const np = pts.length
  const T = Math.round(o.grains ?? 14000), K = Math.round(o.node ?? 700)
  const nOwn = pts.filter((p, j) => pts.findIndex((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.05) === j).length
  const N = T + nOwn * K
  const aS = new Float32Array(N), aKind = new Float32Array(N), aNode = new Float32Array(N), aSeed = new Float32Array(N)
  const aOff = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  let n = 0
  for (let i = 0; i < T; i++, n++) {
    aS[n] = Math.random(); aKind[n] = 0; aSeed[n] = Math.random()
    aOff.set([gauss(), gauss(), gauss()], n * 3)
    pos.set(pts[0], n * 3)
  }
  // a point at the same place as an earlier one has no cluster of its own
  const alias = pts.map((p, j) => pts.findIndex((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.05))
  const own = alias.map((a, j) => a === j)
  for (let j = 0; j < np; j++) for (let i = 0; i < (own[j] ? K : 0); i++, n++) {
    aKind[n] = 1; aNode[n] = j; aSeed[n] = Math.random()
    const u = unit(), r = Math.pow(Math.random(), 0.6)
    aOff.set([u[0] * r, u[1] * r * 0.85, u[2] * r], n * 3)
    pos.set(pts[j], n * 3)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aS', aS, 1], ['aKind', aKind, 1], ['aNode', aNode, 1], ['aSeed', aSeed, 1], ['aOff', aOff, 3]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const P = Array.from({ length: MAXP }, (_, i) => new Vector3(...(pts[Math.min(i, np - 1)])))
  const base = o.color || ctx.palette.accent
  const C = Array.from({ length: MAXP }, (_, i) => new Color(...rgb((o.colors && o.colors[Math.min(i, np - 1)]) || base)))
  const mat = material(PATH_VERT, {
    uP: { value: P }, uC: { value: C }, uN: { value: np },
    uAlias: { value: Array.from({ length: MAXP }, (_, i) => (i < np ? alias[i] : -10)) },
    uFrom: { value: -1 }, uTo: { value: -1 }, uT0: { value: 0 }, uDur: { value: 1 },
    uSpeed: { value: o.speed ?? 0.35 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 },
    uNodeR: { value: o.nodeRadius ?? 0.55 }, uWidth: { value: o.width ?? 0.1 }, uArc: { value: o.arc ?? 0 },
    uColor: { value: new Color(...rgb(base)) },
  })
  const g = pointsGroup(geo, mat, o.pos)
  const u = mat.uniforms
  let now = 0, played = -100
  const headNow = () => {
    if (u.uTo.value < -0.5) return -1
    const x = Math.min(Math.max((now - u.uT0.value) / Math.max(u.uDur.value, 0.01), 0), 1)
    const e = x * x * x * (x * (x * 6 - 15) + 10)
    return u.uFrom.value + (u.uTo.value - u.uFrom.value) * e
  }
  const legTime = (legs) => Math.max(0.6, (o.draw ?? 2.8) * Math.sqrt(Math.max(legs, 0.3)))
  const go = (k, { instant = false } = {}) => {
    const to = Math.max(-1, Math.min(np - 1, k))
    const cur = headNow()
    if (instant || to < 0 || to < cur) { u.uFrom.value = to; u.uTo.value = to; u.uT0.value = now - 100; return }   // back: at once
    const from = cur < 0 ? -0.55 : cur                 // from nothing: the first place gathers too
    u.uFrom.value = from; u.uTo.value = to
    u.uT0.value = now + (o.delay ?? 0.8)
    u.uDur.value = legTime(to - from)
    played = now
  }
  const off = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  // an arrival from elsewhere, or `c`: the whole path is drawn again, quicker, from the start to where it stands
  const api = {
    arm() {},
    assemble(t, onDone) {
      now = t
      const to = u.uTo.value
      if (to >= 0 && now - played > 5) {
        played = now
        u.uFrom.value = -0.55; u.uTo.value = to; u.uT0.value = now + 0.2; u.uDur.value = legTime(to + 0.55) * 0.6
      }
      onDone?.()
    },
  }
  return { group: g, labels: [], api, pixelRatio: u.uPixelRatio, update(t) { now = t; u.uTime.value = t }, dispose: off }
}

// ---- streams ------------------------------------------------------------------------
//   { type: streams, name, pos, from?: [x,y,z], to: [{ from?, pos, lift?, node?: false }, …],
//     grains?: 2200 per stream, node?: 900 grains per end cluster, nodeRadius?: 0.45,
//     speed?: 0.11 (laps a second), color?, spread?: 0.08, stagger?: 0.25 }
// Step k shows the first k streams; a stream that starts gathers its end
// cluster over two seconds while its first grains are on the way. A stream
// may set its own `from`, so many places can send to one.
const MAXS = 12
const STREAMS_VERT = /* glsl */ `
attribute float aIdx, aKind, aSeed;   // stream index; kind 0 a grain on the way, 1 a grain of the end cluster
attribute vec3 aFrom, aEnd, aCtl, aOff;
uniform float uShowT[${MAXS}];
uniform float uHideT[${MAXS}];
uniform float uSpeed, uSize, uAlpha, uNodeR;
uniform vec3 uColor, uWhite;
${PLACE}
void main() {
  int i = int(aIdx + 0.5);
  float t0 = uShowT[i];
  float since = t0 < 0.0 ? -1.0 : uTime - t0;
  float h = uHideT[i];
  float on = (since < 0.0 ? 0.0 : 1.0) * (h < 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.2, uTime - h));
  if (on <= 0.0) { hide(); return; }
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    float s = fract(aSeed * 7.31 + uSpeed * uTime);
    float lead = since * uSpeed;
    float started = step(s, lead) + step(1.0, lead);
    vec3 a = mix(aFrom, aCtl, s), b = mix(aCtl, aEnd, s);
    p = mix(a, b, s) + aOff * (0.4 + sin(s * 3.14159));
    float ends = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(0.9, 1.0, s));
    alpha = uAlpha * ends * on * min(started, 1.0);
    size = uSize * (0.7 + 0.7 * hash(aSeed * 13.0));
  } else {
    float f = ease(since / 2.2);
    float w = uTime * (0.25 + 0.4 * hash(aSeed * 5.0));
    vec3 o = turnY(aOff * uNodeR, w);
    vec3 far = aEnd + normalize(aOff + 1e-4) * uNodeR * (5.0 + 6.0 * hash(aSeed * 3.0));
    p = mix(far, aEnd + o, f);
    alpha = uAlpha * 1.3 * on * mix(0.2, 1.0, f);
    size = uSize * (0.9 + 0.9 * hash(aSeed * 29.0));
  }
  vec3 color = mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.25 : 0.0));
  if (alpha <= 0.0) { hide(); return; }
  place(p, size, alpha, color, aSeed);
}`

function buildStreams(o, ctx) {
  const to = (o.to || []).slice(0, MAXS)
  const per = Math.round(o.grains ?? 2200), node = Math.round(o.node ?? 900)
  const nodeOf = (d) => (d.node === false ? 0 : node)
  const N = to.reduce((a, d) => a + per + nodeOf(d), 0)
  const seed = new Float32Array(N), idx = new Float32Array(N), kind = new Float32Array(N)
  const fromA = new Float32Array(N * 3), end = new Float32Array(N * 3), ctl = new Float32Array(N * 3), off = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  const spread = o.spread ?? 0.08
  let n = 0
  to.forEach((d, i) => {
    const f = d.from || o.from || [0, 0, 0]
    const e = d.pos || [0, 0, 0]
    const mid = [(f[0] + e[0]) / 2, (f[1] + e[1]) / 2, (f[2] + e[2]) / 2]
    const len = Math.hypot(e[0] - f[0], e[1] - f[1], e[2] - f[2])
    const c = [mid[0], mid[1] + (d.lift ?? 0.32) * len, mid[2]]
    for (let k = 0; k < per + nodeOf(d); k++, n++) {
      seed[n] = Math.random(); idx[n] = i; kind[n] = k < per ? 0 : 1
      fromA.set(f, n * 3); end.set(e, n * 3); ctl.set(c, n * 3); pos.set(e, n * 3)
      if (k < per) off.set([gauss() * spread * len * 0.1, gauss() * spread * len * 0.1, gauss() * spread * len * 0.1], n * 3)
      else { const u = unit(), r = Math.cbrt(Math.random()); off.set([u[0] * r, u[1] * r * 0.8, u[2] * r], n * 3) }
    }
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aSeed', seed, 1], ['aIdx', idx, 1], ['aKind', kind, 1], ['aFrom', fromA, 3], ['aEnd', end, 3], ['aCtl', ctl, 3], ['aOff', off, 3]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const showT = new Array(MAXS).fill(-1), hideT = new Array(MAXS).fill(-1)
  const mat = material(STREAMS_VERT, {
    uShowT: { value: showT }, uHideT: { value: hideT },
    uSpeed: { value: o.speed ?? 0.11 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 },
    uNodeR: { value: o.nodeRadius ?? 0.45 },
    uColor: { value: new Color(...rgb(o.color || ctx.palette.accent)) }, uWhite: { value: new Color(1, 0.97, 0.9) },
  })
  const g = pointsGroup(geo, mat, o.pos)
  let now = 0
  const stagger = o.stagger ?? 0.25
  const go = (k, { instant = false } = {}) => {
    let fresh = 0
    for (let i = 0; i < MAXS; i++) {
      const running = showT[i] >= 0 && hideT[i] < 0
      const fading = showT[i] >= 0 && hideT[i] >= 0 && now - hideT[i] < 1.2
      if (i < k && !running) {
        if (fading && !instant) hideT[i] = -1
        else { showT[i] = instant ? now - 60 : now + (o.delay ?? 0) + stagger * fresh++; hideT[i] = -1 }
      } else if (i >= k && running) {
        if (instant || showT[i] > now) showT[i] = -1
        else hideT[i] = now
      }
    }
  }
  const off2 = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off2)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  return { group: g, labels: [], pixelRatio: mat.uniforms.uPixelRatio, update(t) { now = t; mat.uniforms.uTime.value = t }, dispose: off2 }
}

// ---- ghost --------------------------------------------------------------------------
//   { type: ghost, name?, pos, radius?: 2.4, nodes?: 5, grains?: 700 per node, colors?: ['#…', …],
//     size?: 1, alpha?: 0.4, period?: 6 (seconds of one breath), spread?: 0.55 (cluster radius),
//     hay?: 0 (grains of a wide faint cloud round it), hayRadius?: 9, hayAlpha?: 0.22, hayColor? }
// With a `name`, step 0 hides the clusters (the cloud stays) and step 1 lets
// them appear: the needle looked for in the haystack, and found not to be there.
// Faint clusters that keep coming together and drifting apart, each on its
// own breath, never holding: a particle that was looked for and is not
// there. Born scattered; gathers into its breathing on arrival (`c` again).
const MAXG = 8
const GHOST_VERT = /* glsl */ `
attribute vec3 aDir, aOff;
attribute float aNode, aSeed, aPhase;
uniform float uForm, uR, uPeriod, uSize, uAlpha, uSpread, uHayR, uHayAlpha, uGhost;
uniform vec3 uG[${MAXG}];
uniform vec3 uHay;
${PLACE}
void main() {
  float f = ease(uForm * 1.4 - aSeed * 0.4);
  if (aNode < -0.5) {
    // the haystack: a wide, faint, slowly turning cloud the ghost is somewhere in
    vec3 hp = turnY(aOff * uHayR, uTime * (0.015 + 0.02 * hash(aSeed * 3.0)) + aSeed * 6.0);
    vec3 hf = aOff * uHayR * 2.2 + aDir * uHayR;
    float ha = uHayAlpha * mix(0.3, 1.0, f) * (0.7 + 0.3 * hash(aSeed * 11.0));
    place(mix(hf, hp, f), uSize * (0.7 + 0.6 * hash(aSeed * 17.0)), ha, mix(uHay, vec3(1.0), 0.15 * hash(aSeed * 19.0)), aSeed);
    return;
  }
  // each cluster breathes on its own: close in (never touching), then out again
  float b = 0.5 + 0.5 * sin(6.2831853 * uTime / uPeriod + aPhase);
  float reach = uR * mix(0.42, 1.25, b * b);
  vec3 c = turnY(aDir * reach, uTime * 0.12 + aPhase * 0.3)
         + 0.25 * vec3(sin(uTime * 0.7 + aPhase), cos(uTime * 0.5 + aPhase * 2.0), sin(uTime * 0.6 + aPhase * 3.0));
  float w = uTime * (0.35 + 0.4 * hash(aSeed * 5.0));
  vec3 home = c + turnY(aOff * uSpread * (0.8 + 0.5 * b), w);
  vec3 far = aDir * uR * 4.0 + aOff * uR * 2.5;
  vec3 p = mix(far, home, f);
  // faintest when they come closest: they never hold
  float alpha = uAlpha * uGhost * mix(0.3, 1.0, f) * (0.55 + 0.45 * b);
  float size = uSize * (0.7 + 0.8 * hash(aSeed * 31.0)) * (1.0 + 1.2 * (1.0 - f));
  vec3 color = mix(uG[int(aNode + 0.5)], vec3(1.0), 0.25 * hash(aSeed * 7.0));
  if (alpha <= 0.002) { hide(); return; }
  place(p, size, alpha, color, aSeed);
}`
function buildGhost(o, ctx) {
  const K = Math.max(2, Math.min(MAXG, Math.round(o.nodes ?? 5)))
  const per = Math.round(o.grains ?? 700), H = Math.round(o.hay ?? 0)
  const N = K * per + H
  const dirs = [[0.9, 0.55, 0.2], [0.3, -0.95, -0.5], [1.0, -0.2, -0.8], [-0.6, 0.85, -0.7], [-0.9, -0.4, 0.5], [0.1, 0.2, 1.0], [-0.2, 0.9, 0.7], [0.7, 0.1, 0.9]]
  const aDir = new Float32Array(N * 3), aOff = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  const aNode = new Float32Array(N), aSeed = new Float32Array(N), aPhase = new Float32Array(N)
  let n = 0
  for (let k = 0; k < K; k++) {
    const d = dirs[k], L = Math.hypot(...d)
    const phase = 0.77 * (k / K) * Math.PI * 2 + 0.4 * k
    for (let i = 0; i < per; i++, n++) {
      aDir.set([d[0] / L, d[1] / L, d[2] / L], n * 3)
      const u = unit(), r = Math.pow(Math.random(), 0.7)
      aOff.set([u[0] * r, u[1] * r * 0.85, u[2] * r], n * 3)
      aNode[n] = k; aSeed[n] = Math.random(); aPhase[n] = phase
    }
  }
  for (let i = 0; i < H; i++, n++) {
    const u = unit(), r = Math.cbrt(Math.random()), d = unit()
    aOff.set([u[0] * r, u[1] * r * 0.8, u[2] * r], n * 3); aDir.set(d, n * 3)
    aNode[n] = -1; aSeed[n] = Math.random(); aPhase[n] = 0
  }
  const cols = o.colors || ['#9fb8ff', '#b8c8ff', '#8fa8f0', '#c4d2ff', '#a8bcff']
  const G = Array.from({ length: MAXG }, (_, k) => new Color(...rgb(cols[k % cols.length])))
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, arr, sz] of [['aDir', aDir, 3], ['aOff', aOff, 3], ['aNode', aNode, 1], ['aSeed', aSeed, 1], ['aPhase', aPhase, 1]]) geo.setAttribute(k, new BufferAttribute(arr, sz))
  const mat = material(GHOST_VERT, {
    uForm: { value: o.assemble === false ? 1 : 0 }, uR: { value: o.radius ?? 2.4 }, uPeriod: { value: o.period ?? 6 },
    uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.4 }, uSpread: { value: o.spread ?? 0.55 }, uG: { value: G },
    uHayR: { value: o.hayRadius ?? 9 }, uHayAlpha: { value: o.hayAlpha ?? 0.22 }, uHay: { value: new Color(...rgb(o.hayColor || '#c8b27a')) },
    uGhost: { value: o.name ? 0 : 1 },
  })
  const g = pointsGroup(geo, mat, o.pos)
  const u = mat.uniforms
  let t0 = -1, done = null, now = 0, show = o.name ? 0 : 1, showT0 = -100, showFrom = show
  // named: step 0 hides the ghost (the haystack stays), step 1 lets it appear over 2.5 s
  const off = o.name ? listen(o.name, (k) => { showFrom = u.uGhost.value; show = k > 0 ? 1 : 0; showT0 = now + 0.4 }) : () => {}
  if (o.name && state.has(o.name)) { show = state.get(o.name) > 0 ? 1 : 0; showFrom = show; u.uGhost.value = show }
  mat.addEventListener('dispose', off)
  const api = o.assemble === false ? undefined : {
    arm() { u.uForm.value = 0; t0 = -1 },
    assemble(t, onDone) { t0 = t; u.uForm.value = 0; done = onDone || null },
  }
  return {
    group: g, labels: [], api, pixelRatio: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t
      if (t0 >= 0) { const x = Math.min((t - t0) / 3.2, 1); u.uForm.value = x; if (x >= 1) { t0 = -1; const cb = done; done = null; cb?.() } }
      const x = Math.min(Math.max((t - showT0) / 2.5, 0), 1); u.uGhost.value = showFrom + (show - showFrom) * x * x * (3 - 2 * x)
    },
    dispose: off,
  }
}

// ---- map ----------------------------------------------------------------------------
//   { type: map, src: 'data/europe.json', pos, scale?: 1, color?, border?: '#…', size?: 1,
//     alpha?: 0.5, borderAlpha?: 0.18, lift?: 0 }
// A coastline drawn in grains on the ground plane (y = 0): the points of
// `coast` and `borders` in the file are x, z pairs, one unit a degree of
// latitude (scripts/make_europe.py, from Natural Earth 1:50m). Born scattered
// in the dust; condenses on arrival (`c` again). No names, no fills: the
// shape alone says where we are.
const MAP_VERT = /* glsl */ `
attribute vec3 aScatter;
attribute float aSeed, aKind;   // 0 coast, 1 border
uniform float uForm, uSize, uAlpha, uBorderAlpha;
uniform vec3 uColor, uBorder;
${PLACE}
void main() {
  float f = ease(uForm * 1.5 - aSeed * 0.5);
  vec3 p = mix(aScatter + 0.4 * vec3(sin(uTime * 0.4 + aSeed * 40.0), cos(uTime * 0.3 + aSeed * 20.0), sin(uTime * 0.35 + aSeed * 60.0)), position, f);
  float a = (aKind < 0.5 ? uAlpha : uBorderAlpha) * mix(0.25, 1.0, f);
  vec3 c = aKind < 0.5 ? uColor : uBorder;
  float size = uSize * (aKind < 0.5 ? 1.0 : 0.8) * (0.8 + 0.4 * hash(aSeed * 13.0)) * (1.0 + 1.5 * (1.0 - f));
  place(p, size, a, c, aSeed);
}`
function buildMap(o, ctx) {
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const mat = material(MAP_VERT, {
    uForm: { value: o.assemble === false ? 1 : 0 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.5 },
    uBorderAlpha: { value: o.borderAlpha ?? 0.18 },
    uColor: { value: new Color(...rgb(o.color || ctx.palette.dustBright || '#cfe0ff')) }, uBorder: { value: new Color(...rgb(o.border || ctx.palette.accent)) },
  })
  const S = o.scale ?? 1, lift = o.lift ?? 0
  fetch(ctx.asset('/' + String(o.src || 'data/europe.json').replace(/^\//, ''))).then((r) => r.json()).then((d) => {
    const sets = [[d.coast || [], 0], [d.borders || [], 1]]
    const N = sets.reduce((a, [arr]) => a + arr.length / 2, 0)
    const pos = new Float32Array(N * 3), scat = new Float32Array(N * 3), seed = new Float32Array(N), kind = new Float32Array(N)
    let n = 0
    for (const [arr, k] of sets) for (let i = 0; i < arr.length; i += 2, n++) {
      const x = arr[i] * S, z = arr[i + 1] * S
      pos.set([x, lift, z], n * 3)
      const r = (6 + 10 * Math.random()) * S
      scat.set([x + gauss() * r * 0.6, lift + gauss() * r * 0.5 + 2 * S, z + gauss() * r * 0.6], n * 3)
      seed[n] = Math.random(); kind[n] = k
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(pos, 3))
    geo.setAttribute('aScatter', new BufferAttribute(scat, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
    geo.setAttribute('aKind', new BufferAttribute(kind, 1))
    const pts = new Points(geo, mat); pts.frustumCulled = false
    g.add(pts)
  }).catch(() => console.warn('stage: map points failed', o.src))
  const u = mat.uniforms
  let t0 = -1, done = null
  const api = o.assemble === false ? undefined : {
    arm() { u.uForm.value = 0; t0 = -1 },
    assemble(t, onDone) { t0 = t; u.uForm.value = 0; done = onDone || null },
  }
  return {
    group: g, labels: [], api, pixelRatio: u.uPixelRatio,
    update(t) {
      u.uTime.value = t
      if (t0 >= 0) { const x = Math.min((t - t0) / 3.6, 1); u.uForm.value = x; if (x >= 1) { t0 = -1; const cb = done; done = null; cb?.() } }
    },
  }
}

// ---- quintet ------------------------------------------------------------------------
//   { type: quintet, name, pos, radius?: 2.2, nodes?: [[x,y,z] × 5], colors?: ['#…' × 5],
//     grains?: 900 per cluster, string?: 700 per string, size?: 1.1, alpha?: 0.6,
//     steps?: [{ hold, light }, …] }
// Five clusters of grains joined by strings of flowing grains: a particle
// made of five quarks. How firmly it holds and how bright it burns are set
// per step, so one form can tell a history: an idea (scattered, faint), a
// claimed find (half-held, dim), a retraction (scattered again, fading), the
// discovery (held, bright). Default steps:
//   0 scattered and faint · 1 half-held, dim · 2 scattered, fading · 3 held, bright
// Each change eases over 2.4 s. Born scattered; on arrival it plays from
// scattered to the current step.
const QUINTET_VERT = /* glsl */ `
attribute vec3 aOff;
attribute float aSeed, aKind, aA, aB;   // kind 0 cluster grain of node aA; 1 string grain from node aA to aB
uniform vec3 uN[5];
uniform vec3 uCol[5];
uniform float uHold, uLight, uR, uSize, uAlpha;
${PLACE}
void main() {
  float hold = clamp(uHold, 0.0, 1.0);
  // each node breathes toward its place; held, they stay; loose, they wander far
  float w = uTime * 0.18;
  int ia = int(aA + 0.5), ib = int(aB + 0.5);
  vec3 na = turnY(uN[ia], w), nb = turnY(uN[ib], w);
  vec3 driftA = turnY(normalize(uN[ia] + 1e-3) * uR * (3.0 + 1.5 * sin(uTime * 0.3 + aA)), w * 0.6 + aA);
  vec3 driftB = turnY(normalize(uN[ib] + 1e-3) * uR * (3.0 + 1.5 * sin(uTime * 0.3 + aB)), w * 0.6 + aB);
  vec3 pa = mix(driftA, na, hold), pb = mix(driftB, nb, hold);
  vec3 p; float alpha, size; vec3 color;
  if (aKind < 0.5) {
    float sw = uTime * (0.4 + 0.5 * hash(aSeed * 5.0));
    p = pa + turnY(aOff * uR * 0.26 * (1.0 + 0.8 * (1.0 - hold)), sw);
    color = mix(uCol[ia], vec3(1.0), 0.25 * hash(aSeed * 7.0) + 0.25 * uLight);
    alpha = uAlpha * (0.25 + 0.9 * uLight) * (0.6 + 0.4 * hold);
    size = uSize * (0.8 + 0.7 * hash(aSeed * 23.0)) * (0.9 + 0.4 * uLight);
  } else {
    // a string: grains flowing from one node to the next, only while they hold
    float s = fract(aSeed * 3.7 + uTime * 0.22);
    p = mix(pa, pb, s) + aOff * 0.06 * uR * sin(s * 3.14159);
    color = mix(mix(uCol[ia], uCol[ib], s), vec3(1.0), 0.35);
    alpha = uAlpha * 0.7 * hold * hold * (0.3 + 0.8 * uLight) * smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.9, 1.0, s));
    size = uSize * 0.7 * (0.8 + 0.4 * hash(aSeed * 13.0));
  }
  if (alpha <= 0.002) { hide(); return; }
  place(p, size, alpha, color, aSeed);
}`
function buildQuintet(o, ctx) {
  const R = o.radius ?? 2.2
  const nodes = o.nodes || [[0.95, 0.7, 0.25], [0.35, -1.2, -0.7], [1.15, -0.25, -0.95], [-0.7, 1.0, -0.8], [-1.0, -0.45, 0.5]]
  const cols = o.colors || ['#ffc05a', '#ffd88a', '#ffb54a', '#ffe3a8', '#ff9f3a']
  const steps = o.steps || [{ hold: 0, light: 0.15 }, { hold: 0.6, light: 0.4 }, { hold: 0, light: 0.1 }, { hold: 1, light: 1 }]
  const per = Math.round(o.grains ?? 900), str = Math.round(o.string ?? 700)
  const pairs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]]
  const N = 5 * per + pairs.length * str
  const aOff = new Float32Array(N * 3), pos = new Float32Array(N * 3), aSeed = new Float32Array(N), aKind = new Float32Array(N), aA = new Float32Array(N), aB = new Float32Array(N)
  let n = 0
  for (let k = 0; k < 5; k++) for (let i = 0; i < per; i++, n++) {
    const u = unit(), r = Math.pow(Math.random(), 0.65)
    aOff.set([u[0] * r, u[1] * r, u[2] * r], n * 3); aSeed[n] = Math.random(); aKind[n] = 0; aA[n] = k; aB[n] = k
  }
  for (const [a, b] of pairs) for (let i = 0; i < str; i++, n++) {
    aOff.set([gauss(), gauss(), gauss()], n * 3); aSeed[n] = Math.random(); aKind[n] = 1; aA[n] = a; aB[n] = b
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, arr, sz] of [['aOff', aOff, 3], ['aSeed', aSeed, 1], ['aKind', aKind, 1], ['aA', aA, 1], ['aB', aB, 1]]) geo.setAttribute(k, new BufferAttribute(arr, sz))
  const mat = material(QUINTET_VERT, {
    uN: { value: nodes.map((p) => new Vector3(p[0] * R / 1.6, p[1] * R / 1.6, p[2] * R / 1.6)) },
    uCol: { value: cols.map((c) => new Color(...rgb(c))) },
    uHold: { value: 0 }, uLight: { value: 0.15 }, uR: { value: R }, uSize: { value: o.size ?? 1.1 }, uAlpha: { value: o.alpha ?? 0.6 },
  })
  const g = pointsGroup(geo, mat, o.pos)
  const u = mat.uniforms
  let now = 0, step = 0, played = -100
  const anim = { from: { hold: 0, light: 0.15 }, to: { hold: 0, light: 0.15 }, t0: -100, dur: 2.4 }
  const cur = () => {
    const x = Math.min(Math.max((now - anim.t0) / anim.dur, 0), 1), e = x * x * (3 - 2 * x)
    return { hold: anim.from.hold + (anim.to.hold - anim.from.hold) * e, light: anim.from.light + (anim.to.light - anim.from.light) * e }
  }
  const goTo = (target, { instant = false, from } = {}) => {
    anim.from = from || cur(); anim.to = target; anim.t0 = instant ? now - 100 : now + 0.3
  }
  const go = (k, opts = {}) => { step = k; goTo(steps[Math.max(0, Math.min(steps.length - 1, k))], opts); played = now }
  const off = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  const api = {
    arm() {},
    assemble(t, onDone) {
      now = t
      if (now - played > 5) { played = now; goTo(steps[Math.max(0, Math.min(steps.length - 1, step))], { from: { hold: 0, light: 0.1 } }) }
      onDone?.()
    },
  }
  return {
    group: g, labels: [], api, pixelRatio: u.uPixelRatio,
    update(t) { now = t; u.uTime.value = t; const c = cur(); u.uHold.value = c.hold; u.uLight.value = c.light },
    dispose: off,
  }
}

// ---- histogram ----------------------------------------------------------------------
//   { type: histogram, name, pos, src: 'data/….json' ({ counts: [...] }, or another `key`) or counts: [...],
//     width?: 24, height?: 10, max?: (tallest bin), unit?: 1 (entries per grain),
//     steps?: [0, 1] (the share of entries shown at each step), fill?: 20 (s for the whole set),
//     fall?: 1.1 (s a grain takes to drop), size?: 1, alpha?: 0.35, color?, axis?: true,
//     curve?: 1 (>1: the first entries drop faster, the last slower), marks?: [[lo, hi], …] }
// A measured distribution building up entry by entry: each grain is one
// entry (one candidate) dropping into its bin in a random order, so the
// shape grows the way the data came in. A step's share is reached at a
// constant rate (`fill` seconds for all of it); going back shows the share
// at once. Arrival from elsewhere (or `c`) refills from nothing to the
// current share, unless a fill started under 5 s ago.
const HIST_VERT = /* glsl */ `
attribute vec3 aEnd;
attribute float aRank, aSeed, aMark;
uniform float uFrom, uTo, uT0, uDur, uFall, uTop, uSize, uAlpha, uCurve, uMarkT;
uniform vec3 uColor, uHot;
${PLACE}
void main() {
  float span = uTo - uFrom;
  float land;                                  // when this grain lands
  if (aRank < min(uFrom, uTo)) land = -1e6;    // already in
  else if (span <= 0.0 || aRank >= uTo) { hide(); return; }
  else land = uT0 + pow((aRank - uFrom) / span, uCurve) * uDur;   // fast at first, slower as the shape fills in
  float k = (uTime - land) / uFall + 1.0;      // 0 at release, 1 on landing
  if (k < 0.0) { hide(); return; }
  vec3 p = aEnd;
  float glow = 0.0;
  if (k < 1.0) {
    p.y = mix(uTop + 2.0 * hash(aSeed * 3.0), aEnd.y, k * k);
    p.x += 0.15 * (1.0 - k) * (hash(aSeed * 5.0) - 0.5);
  } else glow = exp(-(k - 1.0) * uFall * 3.0);  // a short warm glow as it lands
  // once filled, the marked bins (the peaks) brighten and the rest step back
  float m = clamp((uTime - uMarkT) / 1.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 color = mix(uColor, uHot, clamp(0.8 * glow + 0.85 * m * aMark, 0.0, 1.0));
  float alpha = uAlpha * (k < 1.0 ? 0.6 + 0.4 * k : 1.0 + 0.8 * glow) * (1.0 + m * (1.8 * aMark - 0.55 * (1.0 - aMark)));
  float size = uSize * (0.85 + 0.3 * hash(aSeed * 11.0)) * (1.0 + 0.5 * glow);
  place(p, size, alpha, color, aSeed);
}`
// a short upright tick of grains over a marked peak, shown once the fill is complete
const TICK_VERT = /* glsl */ `
attribute float aSeed;
uniform float uSize, uAlpha, uMarkT;
uniform vec3 uColor;
${PLACE}
void main() {
  float m = clamp((uTime - uMarkT - aSeed * 0.5) / 1.2, 0.0, 1.0);
  if (m <= 0.0) { hide(); return; }
  place(position + vec3(0.0, 0.6 * (1.0 - m), 0.0), uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha * m * m, uColor, aSeed);
}`
const AXIS_VERT = /* glsl */ `
attribute float aSeed;
uniform float uSize, uAlpha;
uniform vec3 uColor;
${PLACE}
void main() { place(position, uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha, uColor, aSeed); }`
function buildHistogram(o, ctx) {
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const W = o.width ?? 24, H = o.height ?? 10, unitN = o.unit ?? 1
  const steps = o.steps || [0, 1]
  const mat = material(HIST_VERT, {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT0: { value: 0 }, uDur: { value: 1 }, uFall: { value: o.fall ?? 1.1 },
    uTop: { value: H * 1.25 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.35 },
    uCurve: { value: o.curve ?? 1 }, uMarkT: { value: 1e9 },
    uColor: { value: new Color(...rgb(o.color || '#ffc05a')) }, uHot: { value: new Color(...rgb(o.hot || '#fff4dc')) },
  })
  const u = mat.uniforms
  const build = (counts, d = {}) => {
    const nb = counts.length, bw = W / nb
    // marks: [[lo, hi], …] in the data's units (needs d.lo and d.bin): the bins to light once filled
    const marked = new Uint8Array(nb)
    for (const [a, b] of o.marks || []) for (let i = 0; i < nb; i++) {
      const c = (d.lo ?? 0) + (i + 0.5) * (d.bin ?? 1)
      if (c >= a && c <= b) marked[i] = 1
    }
    const per = counts.map((c) => Math.round(c / unitN))
    const N = per.reduce((a, b) => a + b, 0)
    const max = (o.max ?? Math.max(...counts)) / unitN
    const ranks = new Float32Array(N); for (let i = 0; i < N; i++) ranks[i] = Math.random()
    const end = new Float32Array(N * 3), rank = new Float32Array(N), seed = new Float32Array(N), mark = new Float32Array(N)
    let n = 0
    for (let b = 0; b < nb; b++) {
      // lower in the column, earlier in: the column grows from the bottom
      const rs = Array.from(ranks.subarray(n, n + per[b])).sort((x, y) => x - y)
      for (let j = 0; j < per[b]; j++, n++) {
        const x = -W / 2 + (b + 0.15 + 0.7 * Math.random()) * bw
        const y = (j + 0.5) / max * H
        end.set([x, y, (Math.random() - 0.5) * bw], n * 3); rank[n] = rs[j]; seed[n] = Math.random(); mark[n] = marked[b]
      }
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
    geo.setAttribute('aEnd', new BufferAttribute(end, 3))
    geo.setAttribute('aRank', new BufferAttribute(rank, 1))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
    geo.setAttribute('aMark', new BufferAttribute(mark, 1))
    const pts = new Points(geo, mat); pts.frustumCulled = false
    g.add(pts)
    if (o.marks && d.lo != null) {
      // one tick per mark, over its tallest bin
      const T = 160, tp = [], ts = []
      for (const [a, b] of o.marks) {
        let best = -1
        for (let i = 0; i < nb; i++) { const c = d.lo + (i + 0.5) * d.bin; if (c >= a && c <= b && (best < 0 || counts[i] > counts[best])) best = i }
        if (best < 0) continue
        const x = -W / 2 + (best + 0.5) * bw, y0 = counts[best] / unitN / max * H + 0.6
        for (let i = 0; i < T; i++) { tp.push(x + (Math.random() - 0.5) * 0.06, y0 + 1.9 * i / (T - 1), 0); ts.push(Math.random()) }
      }
      const tg = new BufferGeometry()
      tg.setAttribute('position', new BufferAttribute(new Float32Array(tp), 3)); tg.setAttribute('aSeed', new BufferAttribute(new Float32Array(ts), 1))
      const tm = material(TICK_VERT, { uSize: { value: (o.size ?? 1) * 1.6 }, uAlpha: { value: 1.0 }, uColor: { value: new Color(...rgb(o.hot || '#fff4dc')) } })
      tm.uniforms.uTime = u.uTime; tm.uniforms.uPixelRatio = u.uPixelRatio; tm.uniforms.uMarkT = u.uMarkT
      const tk = new Points(tg, tm); tk.frustumCulled = false
      g.add(tk)
    }
    if (o.axis !== false) {
      const A = 900, ap = new Float32Array(A * 3), as = new Float32Array(A)
      for (let i = 0; i < A; i++) { ap.set([-W / 2 - 0.3 + (W + 0.6) * i / (A - 1), -0.12, 0], i * 3); as[i] = Math.random() }
      const ag = new BufferGeometry()
      ag.setAttribute('position', new BufferAttribute(ap, 3)); ag.setAttribute('aSeed', new BufferAttribute(as, 1))
      const am = material(AXIS_VERT, { uSize: { value: (o.size ?? 1) * 0.9 }, uAlpha: { value: 0.5 }, uColor: { value: new Color(...rgb(o.axisColor || '#cfd6ff')) } })
      am.uniforms.uTime = u.uTime; am.uniforms.uPixelRatio = u.uPixelRatio
      const ax = new Points(ag, am); ax.frustumCulled = false
      g.add(ax)
    }
  }
  if (o.counts) build(o.counts)
  else fetch(ctx.asset('/' + String(o.src).replace(/^\//, ''))).then((r) => r.json()).then((d) => build(d[o.key || 'counts'], d))
    .catch(() => console.warn('stage: histogram data failed', o.src))
  let now = 0, played = -100, share = 0
  const shown = () => {
    const x = Math.min(Math.max((now - u.uT0.value) / Math.max(u.uDur.value, 0.01), 0), 1)
    return u.uFrom.value + (u.uTo.value - u.uFrom.value) * Math.pow(x, 1 / u.uCurve.value)
  }
  const fill = (from, to, delay = 0.6) => {
    u.uFrom.value = from; u.uTo.value = to; u.uT0.value = now + delay
    u.uDur.value = Math.max((to - from) * (o.fill ?? 20), 0.01); played = now
    u.uMarkT.value = to >= 1 && o.marks ? u.uT0.value + u.uDur.value + u.uFall.value + 0.6 : 1e9
  }
  const go = (k, { instant = false } = {}) => {
    const to = steps[Math.max(0, Math.min(steps.length - 1, k))]
    share = to
    const cur = shown()
    if (instant || to <= cur) { u.uFrom.value = to; u.uTo.value = to; u.uT0.value = now - 100; u.uDur.value = 0.01; u.uMarkT.value = to >= 1 && o.marks ? now - 100 : 1e9; return }
    fill(cur, to)
  }
  const off = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  const api = {
    arm() {},
    assemble(t, onDone) { now = t; if (share > 0 && now - played > 5) fill(0, share, 0.3); onDone?.() },
  }
  return { group: g, labels: [], api, pixelRatio: u.uPixelRatio, update(t) { now = t; u.uTime.value = t }, dispose: off }
}

export function installGrains(registerBuilder) {
  registerBuilder('histogram', buildHistogram, { fields: ['pos', 'name'] })
  registerBuilder('pairs', buildPairs, { fields: ['pos', 'name'] })
  registerBuilder('path', buildPath, { fields: ['pos', 'name', 'points'] })
  registerBuilder('streams', buildStreams, { fields: ['pos', 'name', 'to'] })
  registerBuilder('ghost', buildGhost, { fields: ['pos'] })
  registerBuilder('map', buildMap, { fields: ['pos', 'src'] })
  registerBuilder('quintet', buildQuintet, { fields: ['pos', 'name'] })
}
