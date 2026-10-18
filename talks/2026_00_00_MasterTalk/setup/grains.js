// The MasterTalk's forms of grains. `histogram` and the grain helpers are
// copied from Užsikrauk karjerai's setup/grains.js (18 Oct 2026); move them to
// the shared components/ once that talk is delivered (26 Oct), rather than
// keeping two copies. Added here: `focus`, the out-of-focus peak the talk
// opens on and the sharp one it closes on (the same object, one frame).
import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3,
  LinearMipmapLinearFilter,
} from 'three'


const BUS = 'master:grains'
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
function pointsGroup(geo, mat, pos) {
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(pos?.[0] || 0, pos?.[1] || 0, pos?.[2] || 0)
  return g
}

// ---- histogram ----------------------------------------------------------------------
//   { type: histogram, name, pos, src: 'data/….json' ({ counts: [...] }, or another `key`) or counts: [...],
//     width?: 24, height?: 10, max?: (tallest bin), unit?: 1 (entries per grain),
//     steps?: [0, 1] (the share of entries shown at each step), fill?: 20 (s for the whole set),
//     fall?: 1.1 (s a grain takes to drop), size?: 1, alpha?: 0.35, color?, axis?: true,
//     curve?: 1 (>1: the first entries drop faster, the last slower), marks?: [[lo, hi], …],
//     tickSize?, tickAlpha? (the ticks over the marks; default size × 1,3 and 0,55),
//     focus?: [blur per step] (0 sharp, 1 fully out of focus; eased over `focusTime`, 4 s),
//     spread?: 1.2 (how far a grain spreads when fully out of focus) }
// A measured distribution building up entry by entry: each grain is one
// entry (one candidate) dropping into its bin in a random order, so the
// shape grows the way the data came in. A step's share is reached at a
// constant rate (`fill` seconds for all of it); going back shows the share
// at once. Arrival from elsewhere (or `c`) refills from nothing to the
// current share, unless a fill started under 5 s ago.
const HIST_VERT = /* glsl */ `
attribute vec3 aEnd;
attribute float aRank, aSeed, aMark;
uniform float uFrom, uTo, uT0, uDur, uFall, uTop, uSize, uAlpha, uCurve, uMarkT, uBlur, uSpread;
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
  // out of focus (the MasterTalk's open): each grain spreads into a wider, fainter disc
  p += uBlur * uSpread * (vec3(hash(aSeed * 13.0), hash(aSeed * 17.0), hash(aSeed * 19.0)) - 0.5);
  // once filled, the marked bins (the peaks) brighten and the rest step back
  float m = clamp((uTime - uMarkT) / 1.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  // the peaks keep their light and warm slightly; the rest steps back (brightening a dense
  // additive column only burns it white under the bloom, a flash)
  vec3 color = mix(uColor, uHot, clamp(0.8 * glow + 0.3 * m * aMark, 0.0, 1.0));
  float alpha = uAlpha * (k < 1.0 ? 0.6 + 0.4 * k : 1.0 + 0.8 * glow) * (1.0 - 0.55 * m * (1.0 - aMark)) / (1.0 + 4.0 * uBlur);
  float size = uSize * (0.85 + 0.3 * hash(aSeed * 11.0)) * (1.0 + 0.5 * glow) * (1.0 + 3.0 * uBlur);
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
uniform float uBlur;
void main() { place(position, uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha * (1.0 - uBlur), uColor, aSeed); }`
function buildHistogram(o, ctx) {
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const W = o.width ?? 24, H = o.height ?? 10, unitN = o.unit ?? 1
  const steps = o.steps || [0, 1]
  const mat = material(HIST_VERT, {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT0: { value: 0 }, uDur: { value: 1 }, uFall: { value: o.fall ?? 1.1 },
    uTop: { value: H * 1.25 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.35 },
    uCurve: { value: o.curve ?? 1 }, uMarkT: { value: 1e9 },
    uBlur: { value: 0 }, uSpread: { value: o.spread ?? 1.2 },
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
      const tm = material(TICK_VERT, { uSize: { value: o.tickSize ?? (o.size ?? 1) * 1.3 }, uAlpha: { value: o.tickAlpha ?? 0.55 }, uColor: { value: new Color(...rgb(o.hot || '#fff4dc')) } })
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
      am.uniforms.uTime = u.uTime; am.uniforms.uPixelRatio = u.uPixelRatio; am.uniforms.uBlur = u.uBlur
      const ax = new Points(ag, am); ax.frustumCulled = false
      g.add(ax)
    }
  }
  if (o.counts) build(o.counts)
  else fetch(ctx.asset('/' + String(o.src).replace(/^\//, ''))).then((r) => r.json()).then((d) => build(d[o.key || 'counts'], d))
    .catch(() => console.warn('stage: histogram data failed', o.src))
  let now = 0, played = -100, share = 0, step = 0
  const focusOf = (k) => (o.focus ? o.focus[Math.max(0, Math.min(o.focus.length - 1, k))] : 0)
  let blur = focusOf(state.get(o.name) ?? 0), lastT = 0
  u.uBlur.value = blur
  const at = (k) => steps[Math.max(0, Math.min(steps.length - 1, k))]
  // the marked peaks light once the set is full and the step has reached `markStep`
  // (default 1; a later step lets a click light them)
  const marksOn = (to) => !!o.marks && to >= 1 && step >= (o.markStep ?? 1)
  const shown = () => {
    const x = Math.min(Math.max((now - u.uT0.value) / Math.max(u.uDur.value, 0.01), 0), 1)
    return u.uFrom.value + (u.uTo.value - u.uFrom.value) * Math.pow(x, 1 / u.uCurve.value)
  }
  const fill = (from, to, delay = 0.6) => {
    u.uFrom.value = from; u.uTo.value = to; u.uT0.value = now + delay
    u.uDur.value = Math.max((to - from) * (o.fill ?? 20), 0.01); played = now
    u.uMarkT.value = marksOn(to) ? u.uT0.value + u.uDur.value + u.uFall.value + 0.6 : 1e9
  }
  const go = (k, { instant = false } = {}) => {
    step = k
    const to = at(k)
    share = to
    const cur = shown()
    if (instant || to <= cur) {
      const lit = u.uMarkT.value < 1e8
      u.uFrom.value = to; u.uTo.value = to; u.uT0.value = now - 100; u.uDur.value = 0.01
      // marks switched on with the set already full fade in now; switched off, they go at once
      u.uMarkT.value = !marksOn(to) ? 1e9 : instant ? now - 100 : lit ? u.uMarkT.value : now + 0.2
      return
    }
    // the same share already filling (a click that only adds the marks, before the fill
    // has ended): let the fill run on, and light the marks when it ends
    if (to === u.uTo.value && u.uTo.value > u.uFrom.value) {
      u.uMarkT.value = marksOn(to) ? u.uT0.value + u.uDur.value + u.uFall.value + 0.6 : 1e9
      return
    }
    fill(cur, to)
  }
  // While the camera flies here (armed), a requested step only records its share and the
  // fill starts on arrival, so it is seen from the first grain. A fill started by the same
  // slide change just before the flight is held back the same way. Arming never wipes a fill
  // that is already under way, and if no arrival follows within 6 s the fill starts anyway.
  let armed = false, armT = 0
  const hold = () => { u.uFrom.value = 0; u.uTo.value = 0; u.uT0.value = now - 100; u.uDur.value = 0.01; u.uMarkT.value = 1e9 }
  const request = (k) => {
    if (!armed) return go(k)
    step = k; share = at(k)
    hold()
  }
  const arrive = () => {
    const was = armed; armed = false
    if (share <= 0) return
    if (was) { if (u.uTo.value < share) fill(0, share, 0.3) } else if (now - played > 5) fill(0, share, 0.3)
  }
  const off = listen(o.name, request)
  mat.addEventListener('dispose', off)
  // a step set before the build is kept, but the set stays hidden until the station's first
  // assembly fills it (a reload on a plot slide: no full plot flashing before the fill)
  if (state.has(o.name)) { step = state.get(o.name); share = at(step) }
  const api = {
    arm() { armed = true; armT = now; if (now - played < 1.5) hold() },
    assemble(t, onDone) { now = t; arrive(); onDone?.() },
    // waiting for its arrival, still filling, or its marks still lighting
    busy: () => armed
      || (u.uTo.value > u.uFrom.value && now < u.uT0.value + u.uDur.value + u.uFall.value)
      || (u.uMarkT.value < 1e8 && now < u.uMarkT.value + 2.4),
  }
  return {
    group: g, labels: [], api, frameScale: u.uPixelRatio,
    update(t) {
      const dt = Math.min(Math.max(t - lastT, 0), 0.1); lastT = t
      now = t; u.uTime.value = t; if (armed && now - armT > 6) arrive()
      // ease toward the step's focus, slowly: a focus pull, not a jump
      const want = focusOf(step), k = 1 - Math.exp(-dt * 3 / (o.focusTime ?? 4))
      blur += (want - blur) * k; u.uBlur.value = blur
    },
    dispose: off,
  }
}


export function installGrains(registerBuilder) {
  registerBuilder('histogram', buildHistogram, { fields: ['pos', 'name'] })
}
