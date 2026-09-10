<script setup>
// Six ways a peak can appear in an invariant-mass spectrum, drawn from the
// formulas rather than sketched: an isolated Breit–Wigner pole; a pole pinned
// under a threshold (Flatté); a threshold cusp with no pole; a triangle
// singularity; the same Breit–Wigner interfering with a coherent background at
// three phases; and a Λ* reflection — a narrow Λ(1520) → pK⁻ projected onto
// m(J/ψ p) with the real Λb⁰ → J/ψ p K⁻ kinematics. Each panel carries a small
// Argand inset where the phase is the point: the marker sits where |A|² peaks.
// Static; computed once at setup.

const N = 240
const range = (a, b, n = N) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n)
const C = {
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  inv: (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d] },
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  abs2: (a) => a[0] * a[0] + a[1] * a[1],
  arg: (a) => Math.atan2(a[1], a[0]),
}
// k(E): momentum above a threshold at E = 0, imaginary below (analytic continuation)
const kOf = (E) => (E > 0 ? [Math.sqrt(E), 0] : [0, Math.sqrt(-E)])

// 1 · Breit–Wigner  A = (Γ/2) / (m0 − m − iΓ/2), x = (m − m0)/Γ
const bw = (x) => C.inv([-x, -0.5]).map((v) => v * 0.5)
// 2 · Flatté  A = 1 / (E0 − E − i(g1 + g2 ρ(E)))  ρ = √E above threshold, i√(−E) below
const flatte = (E, E0 = -0.15, g1 = 0.1, g2 = 0.6) => {
  const k = kOf(E)
  return C.inv([E0 - E + g2 * k[1], -(g1 + g2 * k[0])])
}
// 3 · Cusp  A = 1 / (1/a − i k(E)) — a scattering length, no pole nearby
const cusp = (E, a = 2.0) => { const k = kOf(E); return C.inv([1 / a + k[1], -k[0]]) }
// 4 · Triangle  |A|² ∝ |ln(1 + w / (E_T − E − iε))|² — logarithmic branch points, no pole
const tri = (E, w = 0.35, eps = 0.06) => {
  const z = C.add([1, 0], C.mul([w, 0], C.inv([-E, -eps])))
  return [Math.log(Math.hypot(z[0], z[1])), Math.atan2(z[1], z[0])]
}

function panel(xs, amp, opts = {}) {
  const A = xs.map(amp)
  const I = A.map(C.abs2)
  const max = Math.max(...I)
  const iPeak = I.indexOf(max)
  return {
    xs, I: I.map((v) => v / max), A, iPeak,
    phase: A.map(C.arg),
    ...opts,
  }
}

// 6 · Λ* reflection: Λb⁰ → J/ψ Λ(1520), Λ(1520) → p K⁻, isotropic; project onto m(J/ψ p)
function reflection() {
  const mLb = 5619.6, mJ = 3096.9, mp = 938.27, mK = 493.68, M0 = 1519.5, G = 15.6
  const lo = 4000, hi = 5150, nb = 115
  const h = new Float64Array(nb)
  for (let j = -60; j <= 60; j++) {
    const M = M0 + G * j / 20               // ±3Γ
    const w = 1 / ((M - M0) ** 2 + (G / 2) ** 2)
    const Ep = (M * M + mp * mp - mK * mK) / (2 * M), pp = Math.sqrt(Math.max(Ep * Ep - mp * mp, 0))
    const EJ = (mLb * mLb - M * M - mJ * mJ) / (2 * M), pJ = Math.sqrt(Math.max(EJ * EJ - mJ * mJ, 0))
    const s0 = mJ * mJ + mp * mp + 2 * EJ * Ep, ds = 2 * pJ * pp
    const sMin = s0 - ds, sMax = s0 + ds       // m²(J/ψ p) uniform in [sMin, sMax] for an isotropic decay
    for (let b = 0; b < nb; b++) {
      const m1 = lo + (hi - lo) * b / nb, m2 = lo + (hi - lo) * (b + 1) / nb
      const a = Math.max(m1 * m1, sMin), c = Math.min(m2 * m2, sMax)
      if (c > a) h[b] += w * (c - a) / (sMax - sMin)
    }
  }
  const max = Math.max(...h)
  return { lo, hi, nb, h: Array.from(h, (v) => v / max) }
}

const P = [
  { key: 'bw', title: 'Breit–Wigner', sub: 'an isolated pole', ...panel(range(-4, 4), bw), x0: 0, xlab: 'm − m₀ (Γ)', note: 'symmetric; phase 90° at the peak; full circle' },
  { key: 'flatte', title: 'Flatté', sub: 'a pole under a threshold', ...panel(range(-1.5, 1.5), (E) => flatte(E)), x0: 0, thr: 0, xlab: 'E − E_thr', note: 'pinned just below threshold; a kink where the channel opens' },
  { key: 'cusp', title: 'Threshold cusp', sub: 'no pole at all', ...panel(range(-2, 2), (E) => cusp(E)), x0: 0, thr: 0, xlab: 'E − E_thr', note: 'peaks exactly at threshold; phase 0° at the peak' },
  { key: 'tri', title: 'Triangle singularity', sub: 'three particles on shell', ...panel(range(-2, 2), (E) => tri(E)), x0: 0, xlab: 'E − E_T', noArgand: true, note: 'a log branch point, no pole; moves with the production process' },
]
// 5 · interference: the same BW plus a coherent background b·e^{iφ}
const xsI = range(-4, 4)
const bwI = xsI.map(bw)
const interf = [0, Math.PI / 2, Math.PI].map((phi) => {
  const b = [0.55 * Math.cos(phi), 0.55 * Math.sin(phi)]
  const I = bwI.map((a) => C.abs2(C.add(a, b)))
  return I
})
const iMax = Math.max(...interf.flat())
const interfN = interf.map((I) => I.map((v) => v / iMax))
const refl = reflection()

// --- drawing ---------------------------------------------------------------
const W = 300, H = 118, pad = { l: 12, r: 86, t: 10, b: 20 }
const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b
const sx = (xs, x) => pad.l + (x - xs[0]) / (xs[xs.length - 1] - xs[0]) * pw
const sy = (v) => pad.t + ph - v * ph
const poly = (xs, ys) => xs.map((x, i) => `${sx(xs, x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(' ')
// Argand inset: unit = 2r so the Breit–Wigner circle (centre ½, radius ½) fits
const ins = { cx: W - 40, cy: 46, r: 24 }
const ix = (re) => ins.cx + (re - 0.5) * 2 * ins.r
const iy = (im) => ins.cy - (im - 0.5) * 2 * ins.r
// scale each panel's Argand path so its largest |A| touches the unit circle
const argand = (A) => {
  const s = 1 / Math.sqrt(Math.max(...A.map(C.abs2)))
  return A.map((a) => `${ix(a[0] * s).toFixed(1)},${iy(a[1] * s).toFixed(1)}`).join(' ')
}
const argandPt = (A, i) => {
  const s = 1 / Math.sqrt(Math.max(...A.map(C.abs2)))
  return { x: ix(A[i][0] * s), y: iy(A[i][1] * s) }
}
const rx = (m) => pad.l + (m - refl.lo) / (refl.hi - refl.lo) * (W - pad.l - 12)
const reflPoly = refl.h.map((v, b) => `${rx(refl.lo + (refl.hi - refl.lo) * (b + 0.5) / refl.nb).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')
const PC = [4312, 4440, 4457]
</script>

<template>
  <div class="gallery">
    <figure v-for="p in P" :key="p.key" class="panel">
      <svg :viewBox="`0 0 ${W} ${H}`">
        <line class="axis" :x1="pad.l" :y1="pad.t + ph" :x2="pad.l + pw" :y2="pad.t + ph" />
        <line v-if="p.thr != null" class="thr" :x1="sx(p.xs, p.thr)" :y1="pad.t" :x2="sx(p.xs, p.thr)" :y2="pad.t + ph" />
        <text v-if="p.thr != null" class="lab" :x="sx(p.xs, p.thr) + 4" :y="pad.t + 9">threshold</text>
        <polyline class="curve" :points="poly(p.xs, p.I)" />
        <line class="peak" :x1="sx(p.xs, p.xs[p.iPeak])" :y1="sy(p.I[p.iPeak])" :x2="sx(p.xs, p.xs[p.iPeak])" :y2="pad.t + ph" />
        <circle class="dot" :cx="sx(p.xs, p.xs[p.iPeak])" :cy="sy(p.I[p.iPeak])" r="3" />
        <text class="lab" :x="pad.l + pw" :y="H - 8" text-anchor="end">{{ p.xlab }}</text>
        <text class="lab" :x="pad.l" :y="H - 8">|A|²</text>
        <!-- Argand inset: where on the circle the peak sits -->
        <g v-if="!p.noArgand">
          <circle class="unit" :cx="ix(0.5)" :cy="iy(0.5)" :r="ins.r" />
          <line class="axis" :x1="ix(-0.1)" :y1="iy(0)" :x2="ix(1.1)" :y2="iy(0)" />
          <line class="axis" :x1="ix(0)" :y1="iy(-0.05)" :x2="ix(0)" :y2="iy(1.08)" />
          <polyline class="walk" :points="argand(p.A)" />
          <circle class="dot" :cx="argandPt(p.A, p.iPeak).x" :cy="argandPt(p.A, p.iPeak).y" r="3" />
          <text class="lab tiny" :x="ins.cx" :y="ins.cy + ins.r + 13" text-anchor="middle">δ at peak {{ Math.round(p.phase[p.iPeak] * 180 / Math.PI) }}°</text>
        </g>
      </svg>
      <figcaption><b>{{ p.title }}</b> <span>{{ p.sub }}</span><br /><em>{{ p.note }}</em></figcaption>
    </figure>

    <figure class="panel">
      <svg :viewBox="`0 0 ${W} ${H}`">
        <line class="axis" :x1="pad.l" :y1="pad.t + ph" :x2="W - 12" :y2="pad.t + ph" />
        <polyline class="curve dim" :points="xsI.map((x, i) => `${(pad.l + (x + 4) / 8 * (W - pad.l - 12)).toFixed(1)},${sy(bwI.map(C.abs2)[i] / iMax).toFixed(1)}`).join(' ')" />
        <polyline v-for="(I, k) in interfN" :key="k" :class="['curve', 'phi' + k]" :points="xsI.map((x, i) => `${(pad.l + (x + 4) / 8 * (W - pad.l - 12)).toFixed(1)},${sy(I[i]).toFixed(1)}`).join(' ')" />
        <text class="lab" :x="W - 12" :y="H - 8" text-anchor="end">m − m₀ (Γ)</text>
        <text class="lab phi0" :x="pad.l + 4" :y="pad.t + 10">φ = 0 · peak</text>
        <text class="lab phi1" :x="pad.l + 4" :y="pad.t + 22">φ = 90° · asymmetric</text>
        <text class="lab phi2" :x="pad.l + 4" :y="pad.t + 34">φ = 180° · dip</text>
        <text class="lab dim" :x="pad.l + 4" :y="pad.t + 46">alone</text>
      </svg>
      <figcaption><b>Interference</b> <span>one pole, a coherent background</span><br /><em>the histogram shows <span style="white-space: nowrap">|A + b·e<sup>iφ</sup>|², not |A|²</span></em></figcaption>
    </figure>

    <figure class="panel">
      <svg :viewBox="`0 0 ${W} ${H}`">
        <line class="axis" :x1="pad.l" :y1="pad.t + ph" :x2="W - 12" :y2="pad.t + ph" />
        <polyline class="curve refl" :points="reflPoly" />
        <g v-for="m in PC" :key="m">
          <line class="pc" :x1="rx(m)" :y1="pad.t + ph" :x2="rx(m)" :y2="pad.t + ph - 22" />
        </g>
        <text class="lab pcl" :x="rx(4312) - 3" :y="pad.t + ph - 26" text-anchor="end">4312</text>
        <text class="lab pcl" :x="rx(4457) + 3" :y="pad.t + ph - 26">4440 · 4457</text>
        <text v-for="m in [4200, 4600]" :key="m" class="lab" :x="rx(m)" :y="H - 8" text-anchor="middle">{{ (m / 1000).toFixed(1) }}</text>
        <text class="lab" :x="W - 12" :y="H - 8" text-anchor="end">m(J/ψ p) GeV</text>
      </svg>
      <figcaption><b>Λ* reflection</b> <span>Λ(1520) → pK⁻, projected</span><br /><em>16 MeV wide in m(pK), 500 MeV wide in m(J/ψ p)</em></figcaption>
    </figure>
  </div>
</template>

<style scoped>
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 12px; margin-top: -4px; }
.panel { margin: 0; padding: 5px 8px 6px; border-radius: 10px; background: rgba(5, 5, 7, 0.5); backdrop-filter: blur(6px); }
.panel svg { width: 100%; height: auto; display: block; font-family: 'Space Grotesk', system-ui, sans-serif; overflow: visible; }
figcaption { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 12.5px; line-height: 1.28; color: #a9b6c4; margin-top: 3px; letter-spacing: 0.01em; }
figcaption b { color: #f2f5f9; font-weight: 600; font-size: 15px; }
figcaption span { color: #7dd3fc; }
figcaption em { font-style: normal; color: #a9b6c4; }
.axis { stroke: rgba(139, 151, 166, 0.5); stroke-width: 1; }
.thr { stroke: rgba(245, 196, 107, 0.7); stroke-width: 1; stroke-dasharray: 3 3; }
.curve { fill: none; stroke: #dbe3ec; stroke-width: 1.7; }
.curve.dim { stroke: rgba(219, 227, 236, 0.35); stroke-dasharray: 3 3; stroke-width: 1.2; }
.curve.phi0 { stroke: #7dd3fc; }
.curve.phi1 { stroke: #f2f5f9; }
.curve.phi2 { stroke: #f5c46b; }
.curve.refl { stroke: #f5c46b; }
.pc { stroke: #7dd3fc; stroke-width: 1.2; }
.peak { stroke: rgba(125, 211, 252, 0.45); stroke-width: 1; stroke-dasharray: 2 3; }
.unit { fill: none; stroke: rgba(219, 227, 236, 0.3); stroke-width: 1; stroke-dasharray: 2 4; }
.walk { fill: none; stroke: #7dd3fc; stroke-width: 1.6; }
.dot { fill: #f2f5f9; stroke: #7dd3fc; stroke-width: 1.2; }
.lab { font-size: 11px; fill: #a9b6c4; letter-spacing: 0.03em; }
.lab.tiny { font-size: 10px; }
.lab.phi0 { fill: #7dd3fc; } .lab.phi1 { fill: #f2f5f9; } .lab.phi2 { fill: #f5c46b; } .lab.dim { fill: rgba(219, 227, 236, 0.5); }
.lab.pcl { fill: #7dd3fc; font-size: 10px; }
</style>
