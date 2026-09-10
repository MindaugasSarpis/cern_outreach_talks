<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

// Hazy particle borders. One 2D canvas over the slide (mount from the deck's
// global-top.vue); each frame it finds every `.card` / `.halo` on the live
// slide and every `.space-panel` (HadronSpace HUD) and draws a fine dust
// along its outline — sub-pixel grains drifting, breathing, accent-tinted —
// instead of a drawn edge. Grains are seeded per element (WeakMap) so they
// persist between frames; a new element fades in over 0.9 s. Pointer-transparent.

const root = ref(null)
const canvas = ref(null)
const nav = useNav()

const MAX_DOTS = 520     // grain count scales with the element's perimeter
const MIN_DOTS = 160
const SPREAD = 15        // px at the 980-wide canvas scale
const ACCENT = '125, 211, 252'
const seeds = new WeakMap()
let raf = 0

// Fine dust, not beads: most grains are sub-pixel at the 980 canvas and faint;
// a few are a touch larger and brighter so the edge reads at a distance. They
// drift slowly along the perimeter and breathe in and out of the edge — the
// same grain as the ambient field behind the slide.
function seedFor(el, perimeter) {
  let s = seeds.get(el)
  if (s) return s
  // Big panels would otherwise be sparse and small cards a solid band.
  const n = Math.round(Math.min(MAX_DOTS, Math.max(MIN_DOTS, perimeter / 5)))
  const dots = []
  for (let i = 0; i < n; i++) {
    const big = Math.random() < 0.08
    dots.push({
      t: Math.random(),                          // position along the perimeter (0..1)
      off: (Math.random() * 2 - 1) * SPREAD,     // signed offset from the edge
      r: big ? 0.85 + Math.random() * 0.5 : 0.28 + Math.random() * 0.42,
      a: big ? 0.5 + Math.random() * 0.35 : 0.24 + Math.random() * 0.46,
      ph: Math.random() * Math.PI * 2,
      sp: 0.3 + Math.random() * 0.8,
      dir: Math.random() < 0.5 ? -1 : 1,
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
  const els = document.querySelectorAll(stop ? '.space-panel' : `.slidev-page[data-slidev-no="${no}"] .card, .slidev-page[data-slidev-no="${no}"] .halo, .space-panel`)
  if (!els.length) return
  const scale = rr.width / 980            // slide px → screen px
  const k = dpr                            // screen px → canvas px
  const u = scale * k                      // slide px → canvas px
  ctx.globalCompositeOperation = 'lighter'
  const time = now / 1000
  // Canvas-space boxes of every haloed element, so a grain that falls inside a
  // neighbour is dropped: two abutting cards get no speckled band between them.
  const boxes = []
  for (const el of els) {
    const er = el.getBoundingClientRect()
    if (er.width < 4 || er.height < 4) continue
    boxes.push({ el, x: (er.left - rr.left) * k, y: (er.top - rr.top) * k, w: er.width * k, h: er.height * k })
  }
  const pad = (SPREAD + 3) * u
  for (const box of boxes) {
    const { el, x, y, w, h } = box
    const seed = seedFor(el, 2 * (w + h) / u)   // perimeter in slide px
    const fade = Math.min((now - seed.born) / 900, 1)
    for (const d of seed.dots) {
      const t = (d.t + d.dir * time * 0.0022 * d.sp + 1) % 1
      perimeterPoint(x, y, w, h, t, pt)
      // breathe: the grain wanders across the edge, densest right on it
      const off = (d.off + 4 * Math.sin(time * 0.35 * d.sp + d.ph)) * u
      const wob = 0.8 * Math.cos(time * 0.5 + d.ph) * u
      const px = pt.x + pt.nx * off + pt.ny * wob
      const py = pt.y + pt.ny * off - pt.nx * wob
      let hidden = false
      for (const o of boxes) {
        if (o.el === el) continue
        if (px > o.x - pad && px < o.x + o.w + pad && py > o.y - pad && py < o.y + o.h + pad) { hidden = true; break }
      }
      if (hidden) continue
      const tw = 0.55 + 0.45 * Math.sin(time * (0.8 + d.sp) + d.ph)
      const near = 1 - Math.min(Math.abs(off) / (SPREAD * 1.3 * u), 1)
      const alpha = d.a * tw * fade * (0.25 + 0.75 * near)
      if (alpha < 0.02) continue
      ctx.beginPath()
      ctx.fillStyle = `rgba(${ACCENT}, ${alpha.toFixed(3)})`
      ctx.arc(px, py, Math.max(d.r * u, 0.5), 0, Math.PI * 2)
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
