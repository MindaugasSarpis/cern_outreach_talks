<script setup>
// <Spectrum2019 />: LHCb's 2019 J/ψ p mass spectrum, the whole curve (the owner, 10 Nov: "show only the 2019 full
// curve (can be recreated, but with axes now it's just empty with not annotations at all)"). Drawn from HEPData
// ins1728691 Table 1 (all Λb⁰ → J/ψ p K⁻ candidates, 2 MeV bins, 4034–5126 MeV; public/data/jpsip-2019-all.json,
// bake/hepdata_2019.py) as an SVG, so it is sharp on any screen: the axes and their names, the histogram drawn in
// from the left, then the three narrow peaks named, and an inset that opens on 4250–4600 MeV, where they stand.
// Runs once on entering and holds; off the live slide it shows its end.
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import SPEC from '../public/data/jpsip-2019-all.json'

const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)

// the main plot's box on the 980 × 551 slide
const L = 118, R = 930, T = 58, B = 400
const X0 = 4000, X1 = 5150, Y1 = 1450
const sx = (m) => L + (m - X0) / (X1 - X0) * (R - L)
const sy = (n) => B - n / Y1 * (B - T)
const step = (lo, bin, counts, fx, fy, from = -Infinity, to = Infinity) => {
  let d = ''
  counts.forEach((n, i) => {
    const a = lo + i * bin, b = a + bin
    if (b <= from || a >= to) return
    const x0 = fx(Math.max(a, from)), x1 = fx(Math.min(b, to)), y = fy(n)
    d += d ? `L${x0.toFixed(1)},${y.toFixed(1)}L${x1.toFixed(1)},${y.toFixed(1)}` : `M${x0.toFixed(1)},${fy(0).toFixed(1)}L${x0.toFixed(1)},${y.toFixed(1)}L${x1.toFixed(1)},${y.toFixed(1)}`
  })
  return d
}
const line = step(SPEC.lo, SPEC.bin, SPEC.counts, sx, sy)
const area = `${line}L${sx(SPEC.hi).toFixed(1)},${sy(0).toFixed(1)}Z`
const xticks = [4100, 4300, 4500, 4700, 4900, 5100]
const yticks = [0, 200, 400, 600, 800, 1000, 1200, 1400]

// the inset: 4250–4600 MeV, 400–1050 candidates, upper right
const IL = 616, IR = 918, IT = 62, IB = 212
const ZX0 = 4250, ZX1 = 4600, ZY0 = 380, ZY1 = 1060
const ix = (m) => IL + (m - ZX0) / (ZX1 - ZX0) * (IR - IL)
const iy = (n) => IB - (Math.max(n, ZY0) - ZY0) / (ZY1 - ZY0) * (IB - IT)
const inset = step(SPEC.lo, SPEC.bin, SPEC.counts, ix, iy, ZX0, ZX1)
const peaks = [
  { m: 4312, name: 'P<tspan baseline-shift="sub" font-size="0.7em">c</tspan>(4312)<tspan baseline-shift="super" font-size="0.7em">+</tspan>', dx: -8, anchor: 'end', y: 0 },
  { m: 4440, name: 'P<tspan baseline-shift="sub" font-size="0.7em">c</tspan>(4440)<tspan baseline-shift="super" font-size="0.7em">+</tspan>', dx: -8, anchor: 'end', y: -24 },
  { m: 4457, name: 'P<tspan baseline-shift="sub" font-size="0.7em">c</tspan>(4457)<tspan baseline-shift="super" font-size="0.7em">+</tspan>', dx: 8, anchor: 'start', y: 0 },
]
const peakTop = (m) => Math.max(...SPEC.counts.slice(Math.round((m - 6 - SPEC.lo) / SPEC.bin), Math.round((m + 6 - SPEC.lo) / SPEC.bin)))

const stage = ref(0)   // 0 axes, 1 drawn, 2 inset, 3 named
let timers = []
const later = (s, fn) => timers.push(setTimeout(fn, s * 1000))
function run() {
  timers.forEach(clearTimeout); timers = []
  stage.value = 0
  later(0.5, () => { stage.value = 1 })
  later(5.0, () => { stage.value = 2 })
  later(6.6, () => { stage.value = 3 })
}
watch([active, live], ([on, isLive]) => {
  if (!isLive) { stage.value = 3; return }
  if (on) run(); else { timers.forEach(clearTimeout); timers = [] }
}, { immediate: true })
onBeforeUnmount(() => timers.forEach(clearTimeout))
const still = computed(() => !live.value)
</script>

<template>
  <svg class="spec" :class="[`s${stage}`, { still }]" viewBox="0 0 980 551.25" aria-label="LHCb 2019: the J/ψ p mass spectrum in Λb⁰ → J/ψ p K⁻ decays, with the three narrow pentaquarks">
    <defs>
      <linearGradient id="spec-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7dd3fc" stop-opacity="0.38" />
        <stop offset="1" stop-color="#7dd3fc" stop-opacity="0.04" />
      </linearGradient>
      <clipPath id="spec-draw"><rect class="draw" :x="L" :y="T - 10" :width="R - L" :height="B - T + 12" /></clipPath>
    </defs>
    <!-- the ground under the plot, so the world does not show through the curve -->
    <rect :x="L - 92" :y="T - 30" :width="R - L + 112" :height="B - T + 92" rx="10" class="ground" />
    <!-- axes -->
    <g class="axes">
      <line :x1="L" :y1="B" :x2="R" :y2="B" /><line :x1="L" :y1="B" :x2="L" :y2="T" />
      <g v-for="m in xticks" :key="m"><line :x1="sx(m)" :y1="B" :x2="sx(m)" :y2="B + 6" /><text :x="sx(m)" :y="B + 26" text-anchor="middle">{{ m }}</text></g>
      <g v-for="n in yticks" :key="n"><line :x1="L - 6" :y1="sy(n)" :x2="L" :y2="sy(n)" /><text :x="L - 12" :y="sy(n) + 6" text-anchor="end">{{ n }}</text></g>
      <text class="title" :x="(L + R) / 2" :y="B + 54" text-anchor="middle">mass of J/ψ p (MeV)</text>
      <text class="title" :transform="`translate(${L - 70}, ${(T + B) / 2}) rotate(-90)`" text-anchor="middle">candidates / 2 MeV</text>
    </g>
    <!-- the data, drawn in from the left -->
    <g clip-path="url(#spec-draw)">
      <path :d="area" class="area" />
      <path :d="line" class="line" />
    </g>
    <!-- the inset on the peaks -->
    <g class="zoom">
      <rect :x="sx(ZX0)" :y="sy(ZY1)" :width="sx(ZX1) - sx(ZX0)" :height="sy(ZY0) - sy(ZY1)" class="zbox" />
      <line :x1="sx(ZX1)" :y1="sy(ZY1)" :x2="IL" :y2="IB" class="zlink" />
      <rect :x="IL - 8" :y="IT - 30" :width="IR - IL + 16" :height="IB - IT + 62" rx="6" class="iground" />
      <path :d="inset" class="iline" />
      <line :x1="IL" :y1="IB" :x2="IR" :y2="IB" class="iaxis" />
      <g v-for="m in [4300, 4400, 4500]" :key="m"><line :x1="ix(m)" :y1="IB" :x2="ix(m)" :y2="IB + 5" class="iaxis" /><text :x="ix(m)" :y="IB + 20" text-anchor="middle" class="itick">{{ m }}</text></g>
    </g>
    <!-- the three narrow peaks, named in the inset -->
    <g class="names">
      <g v-for="(p, k) in peaks" :key="p.m" :style="{ transitionDelay: `${k * 0.45}s` }" class="peak">
        <line :x1="ix(p.m)" :y1="iy(peakTop(p.m)) - 4" :x2="ix(p.m)" :y2="IT - 6 + p.y + 12" />
        <text :x="ix(p.m) + p.dx" :y="IT - 10 + p.y + 12" :text-anchor="p.anchor" v-html="p.name" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.spec { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; }
.ground { fill: rgba(3, 5, 12, 0.72); stroke: rgba(159, 216, 255, 0.16); }
.axes line { stroke: #9fb8d0; stroke-width: 1.4; }
.axes text { fill: #c9dcf0; font-size: 17px; }
.axes .title { fill: #e8f6ff; font-size: 20px; font-weight: 500; }
.area { fill: url(#spec-fill); }
.line { fill: none; stroke: #9fe2ff; stroke-width: 1.6; stroke-linejoin: round; filter: drop-shadow(0 0 3px rgba(125, 211, 252, 0.55)); }
.draw { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform 4.2s cubic-bezier(0.4, 0, 0.3, 1); }
.s1 .draw, .s2 .draw, .s3 .draw { transform: scaleX(1); }
.zoom { opacity: 0; transition: opacity 0.9s ease; }
.s2 .zoom, .s3 .zoom { opacity: 1; }
.zbox { fill: rgba(232, 246, 255, 0.05); stroke: #e8f6ff; stroke-width: 1.2; stroke-dasharray: 4 3; }
.zlink { stroke: rgba(232, 246, 255, 0.5); stroke-width: 1; stroke-dasharray: 4 3; }
.iground { fill: rgba(3, 5, 12, 0.92); stroke: rgba(232, 246, 255, 0.45); }
.iline { fill: none; stroke: #ffffff; stroke-width: 1.6; stroke-linejoin: round; filter: drop-shadow(0 0 3px rgba(125, 211, 252, 0.7)); }
.iaxis { stroke: #9fb8d0; stroke-width: 1.2; }
.itick { fill: #c9dcf0; font-size: 14px; }
.peak { opacity: 0; transition: opacity 0.7s ease; }
.s3 .peak { opacity: 1; }
.peak line { stroke: #e8f6ff; stroke-width: 1.3; stroke-dasharray: 3 2; }
.peak text { fill: #ffffff; font-size: 17px; font-weight: 600; }
.still .draw, .still .zoom, .still .peak { transition: none !important; }
</style>
