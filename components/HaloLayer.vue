<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

// Hazy particle borders. One 2D canvas over the slide (mount from the deck's
// global-top.vue); each frame it finds every `.card` on the live slide and
// every `.space-panel` (HadronSpace HUD) and draws a loose halo of small
// dots around its outline — drifting, twinkling, accent-tinted — instead of
// a drawn edge. Dots are seeded per element (WeakMap) so they persist
// between frames; a new element fades in over 0.6 s. Pointer-transparent.

const root = ref(null)
const canvas = ref(null)
const nav = useNav()

const MAX_DOTS = 190     // dot count scales with the element's perimeter
const MIN_DOTS = 60
const SPREAD = 11        // px at the 980-wide canvas scale
const ACCENT = '125, 211, 252'
const seeds = new WeakMap()
let raf = 0

function seedFor(el, perimeter) {
  let s = seeds.get(el)
  if (s) return s
  // Big panels would otherwise be sparse and small cards a solid band.
  const n = Math.round(Math.min(MAX_DOTS, Math.max(MIN_DOTS, perimeter / 14)))
  const dots = []
  for (let i = 0; i < n; i++) {
    dots.push({
      t: Math.random(),                          // position along the perimeter (0..1)
      off: (Math.random() * 2 - 1) * SPREAD,     // signed offset from the edge
      r: 0.7 + Math.random() * 1.6,
      a: 0.35 + Math.random() * 0.6,
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.9,
    })
  }
  s = { dots, born: performance.now() }
  seeds.set(el, s)
  return s
}

// Point on a rectangle's perimeter at fraction t, plus the outward normal.
function perimeterPoint(x, y, w, h, t, out) {
  const P = 2 * (w + h)
  let d = t * P
  if (d < w) { out.x = x + d; out.y = y; out.nx = 0; out.ny = -1; return out }
  d -= w
  if (d < h) { out.x = x + w; out.y = y + d; out.nx = 1; out.ny = 0; return out }
  d -= h
  if (d < w) { out.x = x + w - d; out.y = y + h; out.nx = 0; out.ny = 1; return out }
  d -= w
  out.x = x; out.y = y + h - d; out.nx = -1; out.ny = 0; return out
}

const pt = { x: 0, y: 0, nx: 0, ny: 0 }
function frame(now) {
  raf = requestAnimationFrame(frame)
  const c = canvas.value, r = root.value
  if (!c || !r) return
  const rr = r.getBoundingClientRect()
  if (rr.width < 2) return
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const W = Math.round(rr.width * dpr), H = Math.round(rr.height * dpr)
  if (c.width !== W || c.height !== H) { c.width = W; c.height = H }
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, W, H)
  const no = nav.currentSlideNo.value
  // during a stop the slide's cards are faded out — halo only the HUD panels then
  const stop = document.documentElement.dataset.spaceStop === '1'
  const els = document.querySelectorAll(stop ? '.space-panel' : `.slidev-page[data-slidev-no="${no}"] .card, .space-panel`)
  if (!els.length) return
  const scale = rr.width / 980            // slide px → screen px
  const k = dpr                            // screen px → canvas px
  ctx.globalCompositeOperation = 'lighter'
  const time = now / 1000
  // Canvas-space boxes of every haloed element, so a dot that falls inside a
  // neighbour is dropped: two abutting cards get no speckled band between them.
  const boxes = []
  for (const el of els) {
    const er = el.getBoundingClientRect()
    if (er.width < 4 || er.height < 4) continue
    boxes.push({ el, x: (er.left - rr.left) * k, y: (er.top - rr.top) * k, w: er.width * k, h: er.height * k })
  }
  const pad = (SPREAD + 3) * scale * k
  for (const box of boxes) {
    const { el, x, y, w, h } = box
    const seed = seedFor(el, 2 * (w + h) / (k * scale))   // perimeter in slide px
    const fade = Math.min((now - seed.born) / 600, 1)
    for (const d of seed.dots) {
      const t = (d.t + time * 0.004 * d.sp) % 1
      perimeterPoint(x, y, w, h, t, pt)
      const off = (d.off + 2.5 * Math.sin(time * d.sp + d.ph)) * scale * k
      const px = pt.x + pt.nx * off + pt.ny * 0.6 * Math.cos(time * 0.7 + d.ph) * scale * k
      const py = pt.y + pt.ny * off - pt.nx * 0.6 * Math.cos(time * 0.7 + d.ph) * scale * k
      let hidden = false
      for (const o of boxes) {
        if (o.el === el) continue
        if (px > o.x - pad && px < o.x + o.w + pad && py > o.y - pad && py < o.y + o.h + pad) { hidden = true; break }
      }
      if (hidden) continue
      const tw = 0.6 + 0.4 * Math.sin(time * (1.1 + d.sp) + d.ph)
      const alpha = d.a * tw * fade * (1 - Math.min(Math.abs(off) / (SPREAD * 1.4 * scale * k), 1) * 0.55)
      ctx.beginPath()
      ctx.fillStyle = `rgba(${ACCENT}, ${alpha.toFixed(3)})`
      ctx.arc(px, py, d.r * scale * k, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

onMounted(() => { raf = requestAnimationFrame(frame) })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <div ref="root" class="halo-layer" aria-hidden="true">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.halo-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.halo-layer canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
