// The data slide's histogram (10 Nov), copied from Užsikrauk karjerai (setup/grains.js, its `histogram`, lines
// 851-1091) for Tokyo's slide 10 (the owner: "building up the histogram could be a bit more substantial, maybe like
// in uzsikrauk karjerai, something like that (even involving the detector)"; "we want to have a peak from the fit").
// Tokyo's own: `fit` (from the data file's `fit`, bake/fit_2019.py), drawn once the set has filled: the fitted curve
// traced from the left in white grains, then each fitted peak, the area between the background and background +
// that peak, lit in grains; `base` (data units) under which nothing is drawn, so the bins start from it.
import { BufferGeometry, BufferAttribute, Points, Group, Color, Vector3 } from 'three'
import { state, listen, material, PLACE, fills } from '../grains.js'

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }

// ---- histogram ----------------------------------------------------------------------
//   { type: histogram, name, pos, src: 'data/….json' ({ counts: [...] }, or another `key`) or counts: [...],
//     width?: 24, height?: 10, max?: (tallest bin), unit?: 1 (entries per grain),
//     steps?: [0, 1] (the share of entries shown at each step), fill?: 20 (s for the whole set),
//     fall?: 1.1 (s a grain takes to drop), size?: 1, alpha?: 0.35, color?, axis?: true,
//     curve?: 1 (>1: the first entries drop faster, the last slower), marks?: [[lo, hi], …],
//     tickSize?, tickAlpha? (the ticks over the marks; default size × 1,3 and 0,55),
//     from?: [x, y, z] (in the station's frame: where the grains come from, instead of falling
//     from above the plot), fromSpread?: [x, y, z] (the box round it they leave from),
//     arc?: 4 (how high over the higher end their flight bows), flyColor? (their colour in flight),
//     lead?: 0.6 (s from the step to the first grain, when it fills from empty) }
// A measured distribution building up entry by entry: each grain is one
// entry (one candidate) dropping into its bin in a random order, so the
// shape grows the way the data came in. A step's share is reached at a
// constant rate (`fill` seconds for all of it); going back shows the share
// at once. Arrival from elsewhere (or `c`) refills from nothing to the
// current share, unless a fill started under 5 s ago.
// With `from` (24 Oct, the owner: "the detector besides showing we are taking data and a
// single histogram with peaks built up"), each grain leaves from a point in that box (the
// detector beside the plot) and flies on a bowed arc into its bin, `fall` seconds, so the
// plot fills out of the detector. `lead` holds a fill from empty back until the collision
// beside it has crossed (on the world's clock, so the recorder and the shots wait for it).
const HIST_VERT = /* glsl */ `
attribute vec3 aEnd;
attribute float aRank, aSeed, aMark;
uniform float uFrom, uTo, uT0, uDur, uFall, uTop, uSize, uAlpha, uCurve, uMarkT, uSrcOn, uArc, uMarkDim;
uniform vec3 uColor, uHot, uSrc, uSrcSpread, uFly;
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
  float fly = 0.0;
  if (k < 1.0 && uSrcOn > 0.5) {
    // out of the source's box, on a bowed arc (a quadratic Bézier) into the bin, slow to leave
    // and quick to land, as a drop
    vec3 s = uSrc + uSrcSpread * (vec3(hash(aSeed * 3.0), hash(aSeed * 17.0), hash(aSeed * 29.0)) - 0.5);
    vec3 c = vec3(mix(s.x, aEnd.x, 0.55), max(s.y, aEnd.y) + uArc * (0.55 + 0.9 * hash(aSeed * 37.0)), mix(s.z, aEnd.z, 0.5));
    float e = k * k * (1.6 - 0.6 * k);
    p = (1.0 - e) * (1.0 - e) * s + 2.0 * (1.0 - e) * e * c + e * e * aEnd;
    fly = 1.0 - smoothstep(0.75, 1.0, k);
  } else if (k < 1.0) {
    p.y = mix(uTop + 2.0 * hash(aSeed * 3.0), aEnd.y, k * k);
    p.x += 0.15 * (1.0 - k) * (hash(aSeed * 5.0) - 0.5);
  } else glow = exp(-(k - 1.0) * uFall * 3.0);  // a short warm glow as it lands
  // once filled, the marked bins (the peaks) brighten and the rest step back
  float m = clamp((uTime - uMarkT) / 1.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  // the peaks keep their light and warm slightly; the rest steps back (brightening a dense
  // additive column only burns it white under the bloom, a flash)
  vec3 color = mix(mix(uColor, uFly, fly), uHot, clamp(0.8 * glow + 0.3 * m * aMark, 0.0, 1.0));
  float alpha = uAlpha * (k < 1.0 ? (uSrcOn > 0.5 ? smoothstep(0.0, 0.12, k) * (0.7 + 0.3 * k) : 0.6 + 0.4 * k) : 1.0 + 0.8 * glow) * (1.0 - uMarkDim * m * (1.0 - aMark));
  float size = uSize * (0.85 + 0.3 * hash(aSeed * 11.0)) * (1.0 + 0.5 * glow) * (1.0 + 0.45 * fly);
  place(p, size, alpha * (1.0 + 0.5 * fly), color, aSeed);
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
// Tokyo: the fit. aKind 0 the curve (traced from the left over 1.8 s from uFitT), 1-3 a fitted peak's area (lit
// one after another from uFitT + 1.6, 0.45 s apart), its grains settling into place from a little above
const FIT_VERT = /* glsl */ `
attribute float aSeed, aT, aKind;
uniform float uSize, uAlpha, uFitT;
uniform vec3 uColor, uPeak;
${PLACE}
void main() {
  float e = uTime - uFitT;
  if (aKind < 0.5) {
    float d = e / 1.8 - aT;
    if (d < 0.0) { hide(); return; }
    float head = exp(-d * 12.0);
    place(position, uSize * (1.0 + 0.8 * head), uAlpha * (0.9 + 1.2 * head), mix(uColor, vec3(1.0), head), aSeed);
  } else {
    float m = clamp((e - 1.6 - 0.45 * (aKind - 1.0) - 0.35 * aSeed) / 0.9, 0.0, 1.0);
    if (m <= 0.0) { hide(); return; }
    m = m * m * (3.0 - 2.0 * m);
    place(position + vec3(0.0, 0.8 * (1.0 - m), 0.0), uSize * 0.9 * (0.8 + 0.4 * hash(aSeed * 13.0)), uAlpha * 0.7 * m, uPeak, aSeed);
  }
}`
function buildHistogram(o, ctx) {
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const W = o.width ?? 24, H = o.height ?? 10, unitN = o.unit ?? 1
  const steps = o.steps || [0, 1]
  // the axis comes in with the first grains that land and goes with the set (the owner, 24 Oct:
  // "in switching to slide 9 I see the axis of a histogram which is then later filled in": it
  // stood at 0,5 from the build, seen under the reel's dust and before the data slide's fill)
  let axU = null, fitU = null
  const AXIS = 0.5
  const mat = material(HIST_VERT, {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT0: { value: 0 }, uDur: { value: 1 }, uFall: { value: o.fall ?? 1.1 },
    uTop: { value: H * 1.25 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.35 },
    uCurve: { value: o.curve ?? 1 }, uMarkT: { value: 1e9 }, uMarkDim: { value: o.markDim ?? 0.55 },
    uColor: { value: new Color(...rgb(o.color || '#ffc05a')) }, uHot: { value: new Color(...rgb(o.hot || '#fff4dc')) },
    // `from` is in the station's frame, the grains in the plot's: the plot's own `pos` off it
    uSrcOn: { value: o.from ? 1 : 0 }, uArc: { value: o.arc ?? 4 },
    uSrc: { value: new Vector3(...(o.from || [0, 0, 0])).sub(new Vector3(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)) },
    uSrcSpread: { value: new Vector3(...(o.fromSpread || [0, 0, 0])) },
    uFly: { value: new Color(...rgb(o.flyColor || o.color || '#ffc05a')) },
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
    const base = o.base ?? 0
    counts = counts.map((c) => Math.max(0, c - base))
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
        end.set([x, y, (Math.random() - 0.5) * bw], n * 3); rank[n] = rs[j]; seed[n] = Math.random(); mark[n] = o.markBins === false ? 0 : marked[b]
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
    if (d.fit && d.lo != null) {
      // the fitted curve and its peaks, in the plot's frame: x from the mass, y as the bins' (above `base`)
      const F = d.fit, X = (mm) => -W / 2 + (mm - d.lo) / (nb * d.bin) * W, Y = (v) => (v - base) / unitN / max * H
      const at = (arr, i) => arr[Math.max(0, Math.min(arr.length - 1, i))]
      const fp = [], ft = [], fk = [], fs = []
      const n = F.total.length, mLo = F.x0, mHi = F.x0 + (n - 1) * F.dx
      // the curve: a dense line of grains (every 0.04 units along it)
      for (let i = 1; i < n; i++) {
        const xa = X(mLo + (i - 1) * F.dx), xb = X(mLo + i * F.dx), ya = Y(F.total[i - 1]), yb = Y(F.total[i])
        const L = Math.hypot(xb - xa, yb - ya), k = Math.max(1, Math.ceil(L / 0.035))
        for (let j = 0; j < k; j++) {
          const t = (j + Math.random()) / k
          fp.push(xa + (xb - xa) * t, ya + (yb - ya) * t + (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.08)
          ft.push(((i - 1 + t) / (n - 1))); fk.push(0); fs.push(Math.random())
        }
      }
      // each peak: grains spread over the area between the background and the background plus the peak
      F.peaks.forEach((pk, kk) => {
        const area = pk.reduce((a, v) => a + v, 0) * F.dx
        const N = Math.round((o.fitGrains ?? 2.2) * area / unitN)
        const peakMax = Math.max(...pk)
        for (let c = 0; c < N; c++) {
          let i, v
          do { i = Math.floor(Math.random() * n); v = Math.random() * peakMax } while (v > pk[i])
          const mm = mLo + (i + Math.random() - 0.5) * F.dx, bg = at(F.background, i)
          fp.push(X(mm), Y(bg + v), (Math.random() - 0.5) * bw * 0.8)
          ft.push((mm - mLo) / (mHi - mLo)); fk.push(kk + 1); fs.push(Math.random())
        }
      })
      const fg = new BufferGeometry()
      fg.setAttribute('position', new BufferAttribute(new Float32Array(fp), 3))
      fg.setAttribute('aT', new BufferAttribute(new Float32Array(ft), 1))
      fg.setAttribute('aKind', new BufferAttribute(new Float32Array(fk), 1))
      fg.setAttribute('aSeed', new BufferAttribute(new Float32Array(fs), 1))
      const fm = material(FIT_VERT, {
        uSize: { value: o.fitSize ?? (o.size ?? 1) * 0.95 }, uAlpha: { value: o.fitAlpha ?? 0.9 }, uFitT: { value: 1e9 },
        uColor: { value: new Color(...rgb(o.fitColor || '#ffffff')) }, uPeak: { value: new Color(...rgb(o.peakColor || '#bfe6ff')) },
      })
      fm.uniforms.uTime = u.uTime; fm.uniforms.uPixelRatio = u.uPixelRatio
      fitU = fm.uniforms
      const fpts = new Points(fg, fm); fpts.frustumCulled = false
      g.add(fpts)
    }
    if (o.axis !== false) {
      const A = 900, ap = new Float32Array(A * 3), as = new Float32Array(A)
      for (let i = 0; i < A; i++) { ap.set([-W / 2 - 0.3 + (W + 0.6) * i / (A - 1), -0.12, 0], i * 3); as[i] = Math.random() }
      const ag = new BufferGeometry()
      ag.setAttribute('position', new BufferAttribute(ap, 3)); ag.setAttribute('aSeed', new BufferAttribute(as, 1))
      const am = material(AXIS_VERT, { uSize: { value: (o.size ?? 1) * 0.9 }, uAlpha: { value: 0 }, uColor: { value: new Color(...rgb(o.axisColor || '#cfd6ff')) } })
      am.uniforms.uTime = u.uTime; am.uniforms.uPixelRatio = u.uPixelRatio
      const ax = new Points(ag, am); ax.frustumCulled = false
      g.add(ax); axU = am.uniforms
    }
  }
  if (o.counts) build(o.counts)
  else fetch(ctx.asset('/' + String(o.src).replace(/^\//, ''))).then((r) => r.json())
    .then((d) => build(d.data ? d.data.map((r) => r[1]) : d[o.key || 'counts'], d))   // Tokyo: rows [centre, value, error]
    .catch(() => console.warn('stage: histogram data failed', o.src))
  let now = 0, played = -100, share = 0, step = 0
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
    fill(cur, to, cur <= 0 ? (o.lead ?? 0.6) : 0.6)
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
  // the share landed so far (a grain lands at its time in the fill, released `fall` before)
  fills.set(o.name, shown)
  mat.addEventListener('dispose', () => fills.delete(o.name))
  // a step set before the build is kept, but the set stays hidden until the station's first
  // assembly fills it (a reload on a plot slide: no full plot flashing before the fill)
  if (state.has(o.name)) { step = state.get(o.name); share = at(step) }
  const api = {
    arm() { armed = true; armT = now; if (now - played < 1.5) hold() },
    assemble(t, onDone) { now = t; arrive(); onDone?.() },
    // waiting for its arrival, still filling, or its marks still lighting
    busy: () => armed
      || (u.uTo.value > u.uFrom.value && now < u.uT0.value + u.uDur.value + u.uFall.value)
      || (u.uMarkT.value < 1e8 && now < u.uMarkT.value + 2.4)
      || (!!axU && Math.abs(axU.uAlpha.value - axisWant()) > 0.01)
      || (!!fitU && u.uMarkT.value < 1e8 && now < u.uMarkT.value + 5),
  }
  // landed: the share released `fall` ago (the first grains are down)
  const axisWant = () => (u.uTo.value > 0 && now >= u.uT0.value + u.uFall.value ? AXIS : 0)
  return {
    group: g, labels: [], api, frameScale: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t; if (armed && now - armT > 6) arrive()
      if (fitU) fitU.uFitT.value = u.uMarkT.value < 1e8 ? u.uMarkT.value + (o.fitAfter ?? 0.3) : 1e9
      if (axU) { const a = axU.uAlpha.value, w = axisWant(); axU.uAlpha.value = Math.abs(w - a) < 0.005 ? w : a + (w - a) * 0.08 }
    },
    dispose: off,
  }
}


export function installHistogram(registerBuilder) {
  registerBuilder('histogram', buildHistogram, { fields: ['pos', 'name'] })
}
