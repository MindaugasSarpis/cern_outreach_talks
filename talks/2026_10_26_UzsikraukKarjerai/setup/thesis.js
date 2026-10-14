import { Group, Points, BufferGeometry, BufferAttribute, Color, Vector3 } from 'three'
import { mulberry32 } from './ring.js'
import { state, listen, tick, waiting, material, PLACE } from './grains.js'

// Dominykas's thesis histogram with the rise (slide 14, station `thesis`),
// copied from OpenData's setup/grains.js (its `histogram`) and registered here
// as `peakhist`, so this talk's own `histogram` (th1, th2, jp, jx: bins from
// `src` files) keeps its name. Its local hide() is gone: this talk's PLACE
// defines one (the same body). The bins come inline in space.json (the
// `peak` object); they sum to 16 398, and `count: 16407` (the thesis's
// N_sig) is what <StageCount for="peak"> counts to.

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }

// ---- peakhist -----------------------------------------------------------------------
//   { type: peakhist, name, pos, bins: [counts…], lo?, bin? (the data's units, for marks),
//     width?: 24, height?: 10, depth?: (a bin's width), max?: (tallest bin), unit?: 1 (entries
//     per grain; default: as the device's budget allows), steps?: [0, 1], fill?: 20 (s for the
//     whole set), fall?: 1.1, curve?: 1 (>1: the first entries come faster), size?, alpha?,
//     color?, hot?, axis?: true, marks?: [[lo, hi], …], markStep?: 1, back?: 0.55 (how far the
//     unmarked bins step back once the marks light),
//     from?: [x, y, z] (the grains come from there, a stream's end, instead of from above),
//     count?: (the number a counter shows when full), rise?: [x, y, z] (after the marks light,
//     grains rise out of the marked peak and gather there: the peak becomes what it shows) }
// A measured distribution building up entry by entry (Užsikrauk karjerai's animation, its
// `histogram`): each grain is one entry dropping into its bin in a random order, so the
// shape grows the way the data came in, fast at first and slower as it fills; each lands
// with a short warm glow. Once full the marked bins (a peak) brighten while the rest steps
// back, a tick of grains rises over each, and with `rise` grains lift out of the peak into
// what it is. A step's share is reached at a constant pace; going back shows it at once.
// Arrival from elsewhere (or `c`) refills from nothing. api.value() is the count landed so
// far, for a <StageCount for="name">.
const HIST_VERT = /* glsl */ `
attribute vec3 aEnd;
attribute float aRank, aSeed, aMark;
uniform float uFrom, uTo, uT0, uDur, uFall, uTop, uSize, uAlpha, uCurve, uMarkT, uUseSrc, uBack;
uniform vec3 uColor, uHot, uSrc;
${PLACE}
void main() {
  float span = uTo - uFrom;
  float land;
  if (aRank < min(uFrom, uTo)) land = -1e6;
  else if (span <= 0.0 || aRank >= uTo) { hide(); return; }
  else land = uT0 + pow((aRank - uFrom) / span, uCurve) * uDur;
  float k = (uTime - land) / uFall + 1.0;      // 0 on release, 1 on landing
  if (k < 0.0) { hide(); return; }
  vec3 p = aEnd;
  float glow = 0.0;
  if (k < 1.0) {
    if (uUseSrc > 0.5) {
      // from the stream's end, on an arc into its bin
      float f = k * k * (3.0 - 2.0 * k);
      vec3 mid = mix(uSrc, aEnd, 0.5) + vec3(0.0, 0.25 * length(aEnd - uSrc) * (0.6 + 0.8 * hash(aSeed * 3.0)), 0.0);
      p = mix(mix(uSrc, mid, f), mix(mid, aEnd, f), f);
    } else {
      p.y = mix(uTop + 2.0 * hash(aSeed * 3.0), aEnd.y, k * k);
      p.x += 0.15 * (1.0 - k) * (hash(aSeed * 5.0) - 0.5);
    }
  } else glow = exp(-(k - 1.0) * uFall * 3.0);
  float m = clamp((uTime - uMarkT) / 1.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 color = mix(uColor, uHot, clamp(0.8 * glow + 0.3 * m * aMark, 0.0, 1.0));
  float alpha = uAlpha * (k < 1.0 ? 0.6 + 0.4 * k : 1.0 + 0.8 * glow) * (1.0 - uBack * m * (1.0 - aMark));
  float size = uSize * (0.85 + 0.3 * hash(aSeed * 11.0)) * (1.0 + 0.5 * glow);
  place(p, size, alpha, color, aSeed);
}`
// a short upright tick of grains over a marked peak, once the fill is complete
const HTICK_VERT = /* glsl */ `
attribute float aSeed;
uniform float uSize, uAlpha, uMarkT;
uniform vec3 uColor;
${PLACE}
void main() {
  float m = clamp((uTime - uMarkT - aSeed * 0.5) / 1.2, 0.0, 1.0);
  if (m <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vAlpha = 0.0; vColor = vec3(0.0); return; }
  place(position + vec3(0.0, 0.6 * (1.0 - m), 0.0), uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha * m * m, uColor, aSeed);
}`
const HAXIS_VERT = /* glsl */ `
attribute float aSeed;
uniform float uSize, uAlpha;
uniform vec3 uColor;
${PLACE}
void main() { place(position, uSize * (0.8 + 0.4 * hash(aSeed * 7.0)), uAlpha, uColor, aSeed); }`
// the peak becoming what it shows: grains leave the tops of the marked bins, spiral up and
// gather at `rise`, brightening as they arrive, and stay there as a soft glow
const HRISE_VERT = /* glsl */ `
attribute float aSeed;
attribute vec3 aDir;
uniform float uSize, uAlpha, uRiseT;
uniform vec3 uColor, uHot, uRise;
${PLACE}
void main() {
  float u = (uTime - uRiseT - aSeed * 1.4) / 2.4;
  if (u <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vAlpha = 0.0; vColor = vec3(0.0); return; }
  float f = ease(u);
  vec3 a = position, b = uRise + aDir * 0.35;
  float h = length(b - a);
  float turn = (1.0 - f) * 5.0 * (hash(aSeed * 3.0) - 0.5);
  vec3 side = vec3(cos(turn), 0.0, sin(turn)) * 0.25 * h * sin(3.14159 * f);
  vec3 mid = mix(a, b, 0.5) + vec3(0.0, 0.15 * h, 0.0);
  vec3 p = mix(mix(a, mid, f), mix(mid, b, f), f) + side;
  float alpha = uAlpha * (0.4 + 0.6 * f) * (u > 1.0 ? 0.7 : 1.0);
  place(p, uSize * (0.9 + 0.5 * f), alpha, mix(uColor, uHot, f), aSeed);
}`
function buildPeakHist(o, ctx) {
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const counts = (o.bins || o.counts || []).map((v) => Math.max(0, Math.round(v)))
  const nb = counts.length, W = o.width ?? 24, H = o.height ?? 10
  const total = counts.reduce((a, b) => a + b, 0)
  const budget = ctx.budget ?? 300000
  const unitN = o.unit ?? Math.max(1, Math.ceil(total / Math.min(budget * 0.4, 120000)))
  const steps = o.steps || [0, 1]
  const src = o.from || [0, 0, 0]
  const mat = material(HIST_VERT, {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT0: { value: 0 }, uDur: { value: 1 }, uFall: { value: o.fall ?? 1.1 },
    uTop: { value: H * 1.25 }, uSize: { value: o.size ?? (unitN > 1 ? 0.55 : 0.45) }, uAlpha: { value: o.alpha ?? 0.35 },
    uCurve: { value: o.curve ?? 1 }, uMarkT: { value: 1e9 }, uUseSrc: { value: o.from ? 1 : 0 }, uBack: { value: o.back ?? 0.55 },
    uSrc: { value: new Vector3(src[0], src[1], src[2]) },
    uColor: { value: new Color(...rgb(o.color || '#ffc05a')) }, uHot: { value: new Color(...rgb(o.hot || '#fff4dc')) },
  })
  const u = mat.uniforms
  const bw = W / Math.max(1, nb), D = o.depth ?? bw
  // marks: [[lo, hi], …] in the data's units (o.lo, o.bin): the bins to light once filled
  const marked = new Uint8Array(nb)
  for (const [a, b] of o.marks || []) for (let i = 0; i < nb; i++) {
    const c = (o.lo ?? 0) + (i + 0.5) * (o.bin ?? 1)
    if (c >= a && c <= b) marked[i] = 1
  }
  const per = counts.map((c) => Math.round(c / unitN))
  const N = per.reduce((a, b) => a + b, 0)
  const max = (o.max ?? Math.max(1, ...counts)) / unitN
  const rnd = mulberry32(o.seed ?? 2015)
  const ranks = new Float32Array(N); for (let i = 0; i < N; i++) ranks[i] = rnd()
  const end = new Float32Array(N * 3), rank = new Float32Array(N), seed = new Float32Array(N), mark = new Float32Array(N)
  let n = 0
  const tops = []                                 // the marked bins' tops, where the rise starts
  for (let b = 0; b < nb; b++) {
    // lower in the column, earlier in: the column grows from the bottom
    const rs = Array.from(ranks.subarray(n, n + per[b])).sort((x, y) => x - y)
    for (let j = 0; j < per[b]; j++, n++) {
      const x = -W / 2 + (b + 0.15 + 0.7 * rnd()) * bw
      const y = (j + 0.5) / max * H
      end.set([x, y, (rnd() - 0.5) * D], n * 3); rank[n] = rs[j]; seed[n] = rnd(); mark[n] = marked[b]
    }
    if (marked[b]) tops.push([-W / 2 + (b + 0.5) * bw, per[b] / max * H])
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
  geo.setAttribute('aEnd', new BufferAttribute(end, 3))
  geo.setAttribute('aRank', new BufferAttribute(rank, 1))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  geo.setAttribute('aMark', new BufferAttribute(mark, 1))
  const pts = new Points(geo, mat); pts.frustumCulled = false
  g.add(pts)
  const share = (m) => { m.uniforms.uTime = u.uTime; m.uniforms.uPixelRatio = u.uPixelRatio; return m }
  if (o.marks && o.lo != null) {
    // one tick per mark, over its tallest bin
    const T = 160, tp = [], ts = []
    for (const [a, b] of o.marks) {
      let best = -1
      for (let i = 0; i < nb; i++) { const c = o.lo + (i + 0.5) * o.bin; if (c >= a && c <= b && (best < 0 || counts[i] > counts[best])) best = i }
      if (best < 0) continue
      const x = -W / 2 + (best + 0.5) * bw, y0 = counts[best] / unitN / max * H + 0.06 * H
      for (let i = 0; i < T; i++) { tp.push(x + (rnd() - 0.5) * 0.006 * W, y0 + 0.19 * H * i / (T - 1), 0); ts.push(rnd()) }
    }
    const tg = new BufferGeometry()
    tg.setAttribute('position', new BufferAttribute(new Float32Array(tp), 3)); tg.setAttribute('aSeed', new BufferAttribute(new Float32Array(ts), 1))
    const tm = share(material(HTICK_VERT, { uSize: { value: u.uSize.value * 1.3 }, uAlpha: { value: 0.55 }, uColor: { value: new Color(...rgb(o.hot || '#fff4dc')) } }))
    tm.uniforms.uMarkT = u.uMarkT
    const tk = new Points(tg, tm); tk.frustumCulled = false
    g.add(tk)
  }
  // the rise: grains lift out of the marked peak into what it shows
  let riseU = null
  if (o.rise && tops.length) {
    const R = Math.round(Math.min(o.riseGrains ?? 2400, Math.max(300, (ctx.budget ?? 300000) / 120)))
    const rp = new Float32Array(R * 3), rd = new Float32Array(R * 3), rs = new Float32Array(R)
    for (let i = 0; i < R; i++) {
      const [x, y] = tops[Math.floor(rnd() * tops.length)]
      rp.set([x + (rnd() - 0.5) * bw, y * (0.55 + 0.45 * rnd()), (rnd() - 0.5) * D], i * 3)
      const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.cbrt(rnd())
      rd.set([q * Math.cos(ph) * r, z * r, q * Math.sin(ph) * r], i * 3); rs[i] = rnd()
    }
    const rg = new BufferGeometry()
    rg.setAttribute('position', new BufferAttribute(rp, 3)); rg.setAttribute('aDir', new BufferAttribute(rd, 3)); rg.setAttribute('aSeed', new BufferAttribute(rs, 1))
    const rm = share(material(HRISE_VERT, {
      uSize: { value: u.uSize.value * 1.4 }, uAlpha: { value: 0.75 }, uRiseT: { value: 1e9 },
      uRise: { value: new Vector3(...o.rise) }, uColor: { value: u.uColor.value.clone() }, uHot: { value: new Color(...rgb(o.hot || '#fff4dc')) },
    }))
    riseU = rm.uniforms
    const rk = new Points(rg, rm); rk.frustumCulled = false
    g.add(rk)
  }
  // the axis stands only while the histogram is shown (step > 0): seen from the slides
  // around it, a lone line of grains read as a stray scratch
  let axU = null
  const AXIS = 0.5
  if (o.axis !== false) {
    const A = 900, ap = new Float32Array(A * 3), as = new Float32Array(A)
    for (let i = 0; i < A; i++) { ap.set([-W / 2 - 0.012 * W + (W * 1.024) * i / (A - 1), -0.012 * H, 0], i * 3); as[i] = rnd() }
    const ag = new BufferGeometry()
    ag.setAttribute('position', new BufferAttribute(ap, 3)); ag.setAttribute('aSeed', new BufferAttribute(as, 1))
    const am = share(material(HAXIS_VERT, { uSize: { value: u.uSize.value * 0.9 }, uAlpha: { value: 0 }, uColor: { value: new Color(...rgb(o.axisColor || '#cfd6ff')) } }))
    const ax = new Points(ag, am); ax.frustumCulled = false
    g.add(ax); axU = am.uniforms
  }
  let now = 0, played = -100, want = 0, step = 0
  const at = (k) => steps[Math.max(0, Math.min(steps.length - 1, k))]
  const marksOn = (to) => !!o.marks && to >= 1 && step >= (o.markStep ?? 1)
  // the share released by now (landed: `fall` later)
  const shown = (t = now) => {
    const x = Math.min(Math.max((t - u.uT0.value) / Math.max(u.uDur.value, 0.01), 0), 1)
    return u.uFrom.value + (u.uTo.value - u.uFrom.value) * Math.pow(x, 1 / u.uCurve.value)
  }
  const setRise = () => { if (riseU) riseU.uRiseT.value = u.uMarkT.value < 1e8 ? u.uMarkT.value + 1.4 : 1e9 }
  const fill = (from, to, delay = 0.6) => {
    u.uFrom.value = from; u.uTo.value = to; u.uT0.value = now + delay
    u.uDur.value = Math.max((to - from) * (o.fill ?? 20), 0.01); played = now
    u.uMarkT.value = marksOn(to) ? u.uT0.value + u.uDur.value + u.uFall.value + 0.6 : 1e9
    setRise()
  }
  const go = (k, { instant = false } = {}) => {
    step = k
    const to = at(k)
    want = to
    const cur = shown()
    if (instant || to <= cur) {
      const lit = u.uMarkT.value < 1e8
      u.uFrom.value = to; u.uTo.value = to; u.uT0.value = now - 100; u.uDur.value = 0.01
      u.uMarkT.value = !marksOn(to) ? 1e9 : instant ? now - 100 : lit ? u.uMarkT.value : now + 0.2
      setRise()
      return
    }
    fill(cur, to)
  }
  let armed = false, armT = 0
  const hold = () => { u.uFrom.value = 0; u.uTo.value = 0; u.uT0.value = now - 100; u.uDur.value = 0.01; u.uMarkT.value = 1e9; setRise() }
  const request = (k) => {
    if (!armed) return go(k)
    step = k; want = at(k)
    hold()
  }
  const arrive = () => {
    const was = armed; armed = false
    if (want <= 0) return
    if (was) { if (u.uTo.value < want) fill(0, want, 0.3) } else if (now - played > 5) fill(0, want, 0.3)
  }
  const off = listen(o.name, request)
  mat.addEventListener('dispose', off)
  if (state.has(o.name)) { step = state.get(o.name); want = at(step) }
  const axisWant = () => (step > 0 ? AXIS : 0)
  if (axU) axU.uAlpha.value = axisWant()
  const count = o.count ?? total
  const api = {
    arm() { armed = true; armT = now; if (now - played < 1.5) hold() },
    assemble(t, onDone) { now = t; arrive(); onDone?.() },
    value: () => Math.round(count * Math.min(1, Math.max(0, shown(now - u.uFall.value)))),
    busy: () => armed || waiting(o.name)
      || (u.uTo.value > u.uFrom.value && now < u.uT0.value + u.uDur.value + u.uFall.value)
      || (u.uMarkT.value < 1e8 && now < u.uMarkT.value + (riseU ? 6.5 : 2.4))
      || (!!axU && Math.abs(axU.uAlpha.value - axisWant()) > 0.01),
  }
  return {
    group: g, labels: [], api, frameScale: u.uPixelRatio,
    update(t) {
      tick(t); now = t; u.uTime.value = t; if (armed && now - armT > 6) arrive()
      if (axU) { const a = axU.uAlpha.value, w = axisWant(); axU.uAlpha.value = Math.abs(w - a) < 0.005 ? w : a + (w - a) * 0.06 }
    },
    dispose: off,
  }
}

export function installThesis(registerBuilder) {
  registerBuilder('peakhist', buildPeakHist, { fields: ['pos', 'name'] })
}
