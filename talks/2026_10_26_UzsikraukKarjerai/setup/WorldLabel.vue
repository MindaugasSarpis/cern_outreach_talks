<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSlideContext, useNav } from '@slidev/client'

// <WorldLabel :at="[x, y, z]" :above="-440" :delay="0" align="left">text</WorldLabel>: a slide label on a
// point in the world (absolute world units), projected every frame through the stage's camera, so it
// rides with an orbiting camera (the close, 24 Oct). It shows (a fade) while the camera stands higher
// than `above` (world y) and, if given, from `delay` world seconds after the slide opened; it is kept
// inside the broadcast safe box (canvas px 49–931 × 55–408). `align`: which side of the point the text
// runs to (left: it ends at the point, right: it starts there). In print and the overview: hidden.
const props = defineProps({
  at: { type: Array, required: true },
  above: { type: Number, default: -1e9 },
  delay: { type: Number, default: 0 },
  align: { type: String, default: 'right' },
  dx: { type: Number, default: 14 },
  dy: { type: Number, default: 0 },
})
const { $renderContext, $page } = useSlideContext()
const nav = useNav()
const el = ref(null)
const W = 980, H = 551.25
let raf = 0, t0 = null, sx = null, sy = null   // the smoothed place: the projected point moves with every frame's camera; whole-pixel left/top made it jump (the owner, 25 Oct)
function stage() {
  const rootEl = document.querySelector('.stage')
  const canvas = rootEl?.querySelector('canvas')
  const h = canvas?.__space
  return h?.composer?.passes?.[0]?.camera || null
}
function tick() {
  raf = requestAnimationFrame(tick)
  const e = el.value, cam = stage()
  if (!e) return
  const me = $page?.value ?? $page
  if (!cam || nav.currentSlideNo?.value !== me) { e.style.opacity = '0'; return }
  const now = globalThis.__stage?.state?.()?.elapsed
  if (t0 === null && now != null) t0 = now
  const late = props.delay > 0 && now != null && t0 != null && now - t0 < props.delay
  cam.updateMatrixWorld()
  const v = { x: props.at[0], y: props.at[1], z: props.at[2] }
  // project by hand (no three import here): view, then projection
  const m = cam.matrixWorldInverse.elements, p = cam.projectionMatrix.elements
  const vx = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12], vy = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13], vz = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14]
  const cx = p[0] * vx + p[4] * vy + p[8] * vz + p[12], cy = p[1] * vx + p[5] * vy + p[9] * vz + p[13], cw = p[3] * vx + p[7] * vy + p[11] * vz + p[15]
  const behind = cw <= 0
  let x = ((cx / cw) + 1) / 2 * W + props.dx * (props.align === 'left' ? -1 : 1), y = (1 - (cy / cw)) / 2 * H + props.dy
  const w = e.offsetWidth, hgt = e.offsetHeight
  let left = props.align === 'left' ? x - w : x
  left = Math.min(Math.max(left, 49), 931 - w); y = Math.min(Math.max(y - hgt / 2, 55), 408 - hgt)
  if (sx === null || e.style.opacity === '0') { sx = left; sy = y } else { sx += (left - sx) * 0.12; sy += (y - sy) * 0.12 }
  e.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`
  e.style.opacity = !behind && !late && cam.position.y > props.above ? '1' : '0'
}
onMounted(() => { if ($renderContext?.value === 'slide') raf = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template><div ref="el" class="world-label" :class="align" style="opacity: 0"><slot /></div></template>

<style>
html[data-stage] .world-label {
  position: absolute; left: 0; top: 0; will-change: transform; z-index: 3; font-size: 34px; font-weight: 500; line-height: 1.05; color: #eef1ff;
  text-shadow: var(--kk-shadow); white-space: nowrap; transition: opacity 1.2s ease; pointer-events: none;
}
html[data-stage] .world-label.left { text-align: right; }
@media print { html[data-stage] .world-label { display: none; } }
</style>
