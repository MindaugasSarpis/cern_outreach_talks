<script setup>
import { ref, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'

// <PeakRise :x="0.42" :y="0.14" />, laid over a plot (absolute, inset 0): when
// the slide opens, grains of gold leave the plot at (x, y), the peak, as a
// fraction of the box, rise and gather into five clusters held together, a
// pentaquark, above it. Under reduced motion, printed or in the overview the
// pentaquark stands there already.
const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  delay: { type: Number, default: 1.2 },   // s after the slide opens
  rise: { type: Number, default: 0.2 },    // how far above the peak it gathers, a fraction of the box height
  size: { type: Number, default: 0.075 },  // the pentaquark's radius, a fraction of the box height
})
const canvas = ref(null)
const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
let raf = 0, t0 = 0

const N = 900, NODES = 5
const grains = Array.from({ length: N }, (_, i) => ({
  node: i % NODES, a: Math.random() * Math.PI * 2, r: Math.sqrt(Math.random()), lag: Math.random() * 0.9,
  sx: (Math.random() - 0.5) * 0.04, sp: 0.6 + Math.random() * 0.8, tw: Math.random() * 6.28,
}))
const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10) }

function draw(now) {
  const c = canvas.value
  if (!c) return
  const box = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
  if (c.width !== Math.round(box.width * dpr)) { c.width = Math.round(box.width * dpr); c.height = Math.round(box.height * dpr) }
  const g = c.getContext('2d'), W = c.width, H = c.height
  g.clearRect(0, 0, W, H)
  const t = (now - t0) / 1000 - props.delay
  const still = t0 < 0
  const px = props.x * W, py = props.y * H
  const cx = px, cy = py - props.rise * H, R = props.size * H
  g.globalCompositeOperation = 'lighter'
  for (const p of grains) {
    // the five quarks sit on a slowly turning pentagon, each a small cloud
    const spin = (still ? 0 : t) * 0.25
    const na = (p.node / NODES) * Math.PI * 2 + spin, nx = cx + Math.cos(na) * R, ny = cy + Math.sin(na) * R * 0.8
    const hx = nx + Math.cos(p.a + (still ? 0 : t) * p.sp) * p.r * R * 0.32, hy = ny + Math.sin(p.a + (still ? 0 : t) * p.sp) * p.r * R * 0.32
    const f = still ? 1 : ease((t - p.lag) / 1.8)
    if (f <= 0) continue
    // out of the peak: up from the top of the data, then in to its quark
    const lx = px + p.sx * W, ly = py
    const x = lx + (hx - lx) * f, y = ly + (hy - ly) * f - Math.sin(Math.PI * f) * R * 0.6
    const a = Math.min(1, f * 3) * (0.55 + 0.45 * Math.sin((still ? 0 : t) * 2 + p.tw))
    const s = (1.1 + 1.3 * p.r) * dpr
    g.fillStyle = `rgba(255, ${190 + 50 * p.r | 0}, ${110 + 80 * p.r | 0}, ${0.55 * a})`
    g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill()
  }
  // a faint boundary once it holds
  const hold = still ? 1 : ease((t - 1.6) / 1.2)
  if (hold > 0) {
    g.globalCompositeOperation = 'source-over'
    g.strokeStyle = `rgba(255, 220, 160, ${0.22 * hold})`; g.lineWidth = 1.2 * dpr
    g.beginPath(); g.ellipse(cx, cy, R * 1.45, R * 1.25, 0, 0, Math.PI * 2); g.stroke()
  }
  if (!still) raf = requestAnimationFrame(draw)
}
onSlideEnter(() => {
  cancelAnimationFrame(raf)
  const live = ['slide', 'presenter'].includes($renderContext?.value) && !isPrintMode.value
  if (!live || matchMedia('(prefers-reduced-motion: reduce)').matches) { t0 = -1; requestAnimationFrame(draw); return }
  t0 = performance.now(); raf = requestAnimationFrame(draw)
})
onSlideLeave(() => cancelAnimationFrame(raf))
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template><canvas ref="canvas" class="peak-rise" aria-hidden="true" /></template>

<style scoped>
.peak-rise { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
