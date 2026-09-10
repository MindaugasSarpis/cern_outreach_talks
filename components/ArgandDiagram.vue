<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'

// A Breit–Wigner resonance read three ways at once: the lineshape |A|² the
// experiment histograms, the phase δ(m) it does not see directly, and the
// Argand plane where the amplitude A = sin δ · e^{iδ} walks a circle. One
// marker sweeps the mass across the peak and the three views move together —
// the point of the slide is that the peak is the moment the phase passes 90°.
// Six hollow markers on the circle stand for the six free complex amplitudes
// the 2015 LHCb fit floated for the Pc(4450)⁺ in bins of m(J/ψ p).
// Sweeps only while the slide is live; static under reduced motion.

const props = defineProps({
  width: { type: Number, default: 1.0 },   // m0 − m range in units of Γ each side (× 4)
})

const active = useIsSlideActive()
const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const u = ref(reduced ? 0.62 : 0)   // sweep parameter 0..1 → m from m0 − 4Γ to m0 + 4Γ
let raf = 0, t0 = 0
const PERIOD = 9000

function frame(now) {
  raf = requestAnimationFrame(frame)
  if (!t0) t0 = now
  const s = ((now - t0) % PERIOD) / PERIOD
  // ease in and out of the ends so the marker lingers at the wings and moves through the peak evenly
  u.value = 0.5 - 0.5 * Math.cos(Math.PI * s)
}
function start() { if (!raf && !reduced) raf = requestAnimationFrame(frame) }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0 }
watch(active, (a) => (a ? start() : stop()), { immediate: true })
onMounted(() => { if (active.value) start() })
onUnmounted(stop)

// --- geometry (viewBox units) --------------------------------------------
const W = 900, H = 236
const L = { x: 40, y: 22, w: 300, h: 168 }      // |A|² panel
const P = { x: 385, y: 22, w: 200, h: 168 }     // phase panel
const A = { x: 650, y: 22, w: 210, h: 168 }     // Argand panel

const X = (i, n = 200) => -4 + 8 * i / n       // x = (m − m0)/Γ
const bw2 = (x) => 0.25 / (x * x + 0.25)        // |A|² with A = (Γ/2)/(m0 − m − iΓ/2)
const delta = (x) => Math.atan2(0.5, -x)        // phase in (0, π)
const lx = (x) => L.x + (x + 4) / 8 * L.w
const ly = (v) => L.y + L.h - v * (L.h - 14)
const px = (x) => P.x + (x + 4) / 8 * P.w
const py = (d) => P.y + P.h - d / Math.PI * (P.h - 14)
const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 + 6 }, ar = 70   // Argand circle: centre, radius (|A| ≤ 1 → unit circle radius 2·ar… we plot A directly with unit = 2·ar)
const ax = (re) => ac.x + re * 2 * ar - ar          // shift so the circle (centre 1/2) sits centred
const ay = (im) => ac.y + ar - im * 2 * ar          // im up

const N = 240
const curveL = computed(() => Array.from({ length: N + 1 }, (_, i) => `${lx(X(i, N)).toFixed(1)},${ly(bw2(X(i, N))).toFixed(1)}`).join(' '))
const curveP = computed(() => Array.from({ length: N + 1 }, (_, i) => `${px(X(i, N)).toFixed(1)},${py(delta(X(i, N))).toFixed(1)}`).join(' '))

const xm = computed(() => -4 + 8 * u.value)
const mark = computed(() => {
  const x = xm.value, d = delta(x)
  const re = Math.sin(d) * Math.cos(d), im = Math.sin(d) * Math.sin(d)
  return { x, d, deg: Math.round(d * 180 / Math.PI), lx: lx(x), ly: ly(bw2(x)), px: px(x), py: py(d), ax: ax(re), ay: ay(im) }
})
// the arc already walked: from δ = 0 (x = −∞) to the marker, counter-clockwise on the circle
const walked = computed(() => {
  const d = mark.value.d
  const pts = []
  for (let i = 0; i <= 60; i++) {
    const dd = d * i / 60
    pts.push(`${ax(Math.sin(dd) * Math.cos(dd)).toFixed(1)},${ay(Math.sin(dd) * Math.sin(dd)).toFixed(1)}`)
  }
  return pts.join(' ')
})
// six bins across the peak, as in the 2015 fit: hollow markers on the circle
const bins = [-1.7, -1.0, -0.4, 0.4, 1.0, 1.7].map((x) => {
  const d = delta(x)
  return { x: ax(Math.sin(d) * Math.cos(d)), y: ay(Math.sin(d) * Math.sin(d)) }
})
</script>

<template>
  <svg class="argand" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Breit–Wigner lineshape, phase and Argand diagram, linked">
    <defs>
      <radialGradient id="argand-glow"><stop offset="0" stop-color="#7dd3fc" stop-opacity="0.9" /><stop offset="1" stop-color="#7dd3fc" stop-opacity="0" /></radialGradient>
    </defs>

    <!-- |A|² -->
    <g class="panel">
      <text class="kick" :x="L.x" :y="L.y - 8">lineshape · what the histogram shows</text>
      <line class="axis" :x1="L.x" :y1="L.y + L.h" :x2="L.x + L.w" :y2="L.y + L.h" />
      <line class="axis" :x1="L.x" :y1="L.y" :x2="L.x" :y2="L.y + L.h" />
      <line class="tick" :x1="lx(0)" :y1="L.y + L.h" :x2="lx(0)" :y2="L.y + L.h + 5" />
      <text class="lab" :x="lx(0)" :y="L.y + L.h + 17" text-anchor="middle">m₀</text>
      <line class="tick" :x1="lx(-0.5)" :y1="ly(0.5)" :x2="lx(0.5)" :y2="ly(0.5)" />
      <text class="lab" :x="lx(0.5) + 5" :y="ly(0.5) + 4">Γ</text>
      <text class="lab" :x="L.x + L.w" :y="L.y + L.h + 17" text-anchor="end">m</text>
      <text class="lab" :x="L.x - 6" :y="L.y + 10" text-anchor="end">|A|²</text>
      <polyline class="curve" :points="curveL" />
      <line class="cursor" :x1="mark.lx" :y1="L.y + L.h" :x2="mark.lx" :y2="mark.ly" />
      <circle class="dot" :cx="mark.lx" :cy="mark.ly" r="4.5" />
    </g>

    <!-- phase -->
    <g class="panel">
      <text class="kick" :x="P.x" :y="P.y - 8">phase δ(m) · what it hides</text>
      <line class="axis" :x1="P.x" :y1="P.y + P.h" :x2="P.x + P.w" :y2="P.y + P.h" />
      <line class="axis" :x1="P.x" :y1="P.y" :x2="P.x" :y2="P.y + P.h" />
      <line class="grid" :x1="P.x" :y1="py(Math.PI / 2)" :x2="P.x + P.w" :y2="py(Math.PI / 2)" />
      <text class="lab" :x="P.x - 6" :y="py(Math.PI / 2) + 4" text-anchor="end">90°</text>
      <text class="lab" :x="P.x - 6" :y="py(Math.PI) + 4" text-anchor="end">180°</text>
      <text class="lab" :x="P.x - 6" :y="py(0) + 4" text-anchor="end">0°</text>
      <text class="lab" :x="px(0)" :y="P.y + P.h + 17" text-anchor="middle">m₀</text>
      <polyline class="curve" :points="curveP" />
      <line class="cursor" :x1="mark.px" :y1="P.y + P.h" :x2="mark.px" :y2="mark.py" />
      <circle class="dot" :cx="mark.px" :cy="mark.py" r="4.5" />
    </g>

    <!-- Argand -->
    <g class="panel">
      <text class="kick" :x="A.x" :y="A.y - 8">Argand plane · Im A vs Re A</text>
      <line class="axis" :x1="ax(-0.15)" :y1="ay(0)" :x2="ax(1.15)" :y2="ay(0)" />
      <line class="axis" :x1="ax(0)" :y1="ay(-0.08)" :x2="ax(0)" :y2="ay(1.1)" />
      <text class="lab" :x="ax(1.15)" :y="ay(0) + 14" text-anchor="end">Re A</text>
      <text class="lab" :x="ax(0) - 6" :y="ay(1.08)" text-anchor="end">Im A</text>
      <circle class="unit" :cx="ax(0.5)" :cy="ay(0.5)" :r="ar" />
      <circle v-for="(b, i) in bins" :key="i" class="bin" :cx="b.x" :cy="b.y" r="4" />
      <polyline class="walk" :points="walked" />
      <line class="vec" :x1="ax(0)" :y1="ay(0)" :x2="mark.ax" :y2="mark.ay" />
      <circle class="halo" :cx="mark.ax" :cy="mark.ay" r="14" fill="url(#argand-glow)" />
      <circle class="dot" :cx="mark.ax" :cy="mark.ay" r="4.5" />
      <text class="lab" :x="ax(0.5)" :y="ay(-0.2)" text-anchor="middle">○ six free amplitudes, 2015 fit</text>
    </g>

    <!-- readout -->
    <g class="readout">
      <text :x="W / 2" :y="H - 10" text-anchor="middle">
        m − m₀ = <tspan class="num">{{ (mark.x >= 0 ? '+' : '−') + Math.abs(mark.x).toFixed(1) }} Γ</tspan>
        <tspan dx="18">δ = </tspan><tspan class="num">{{ mark.deg }}°</tspan>
        <tspan dx="18">|A|² = </tspan><tspan class="num">{{ bw2(mark.x).toFixed(2) }}</tspan>
      </text>
    </g>
  </svg>
</template>

<style scoped>
.argand { width: 100%; height: auto; display: block; font-family: 'Space Grotesk', system-ui, sans-serif; overflow: visible; }
.kick { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; fill: #7dd3fc; font-weight: 500; }
.lab { font-size: 13px; fill: #a9b6c4; letter-spacing: 0.03em; }
.axis { stroke: rgba(139, 151, 166, 0.55); stroke-width: 1; }
.tick { stroke: rgba(139, 151, 166, 0.7); stroke-width: 1; }
.grid { stroke: rgba(139, 151, 166, 0.25); stroke-width: 1; stroke-dasharray: 3 4; }
.curve { fill: none; stroke: #dbe3ec; stroke-width: 1.8; }
.unit { fill: none; stroke: rgba(219, 227, 236, 0.35); stroke-width: 1.2; stroke-dasharray: 2 5; }
.walk { fill: none; stroke: #7dd3fc; stroke-width: 2.4; stroke-linecap: round; }
.vec { stroke: rgba(125, 211, 252, 0.6); stroke-width: 1.2; }
.cursor { stroke: rgba(125, 211, 252, 0.45); stroke-width: 1; }
.dot { fill: #f2f5f9; stroke: #7dd3fc; stroke-width: 1.5; }
.bin { fill: none; stroke: #f2f5f9; stroke-width: 1.3; opacity: 0.8; }
.readout text { font-size: 14px; fill: #a9b6c4; letter-spacing: 0.05em; }
.readout .num { fill: #f2f5f9; font-weight: 500; font-variant-numeric: tabular-nums; }
</style>
