<script setup>
// <PanCanvas src="figures/vilnius_group.jpg" />: a photograph with a slow push in and drift (the owner, 12 Nov:
// "group photo should have a slight pan / zoom effect so it's more dynamic"), drawn on a canvas that fills its
// parent, here a <StagePhoto>'s slot over the same photo standing still. Two earlier ways failed: a window on the
// picture (`object-view-box`) moved in whole pixels ("stepping pixels rearraning"), and a scaled <img> is an
// element running off the slide, which the layout check refuses. A canvas keeps its box and draws between pixels.
// Cover fit, about `focus`. It rests `delay` s, then moves for `seconds`; again from the start each time the slide
// is shown. Off the live slide it draws the photo at rest.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  src: { type: String, required: true },
  from: { type: Number, default: 1 },                  // the zoom at the start (over `to`: the picture draws back)
  to: { type: Number, default: 1.11 },                 // the zoom at the end
  drift: { type: Array, default: () => [-1.6, -0.6] }, // the picture's shift at the end, per cent of the frame
  focus: { type: Array, default: () => [50, 55] },     // the point the push goes to, per cent
  delay: { type: Number, default: 1.5 },
  seconds: { type: Number, default: 44 },
})
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : import.meta.env.BASE_URL + p
const cv = ref(null)
const W = 1920, H = 1080
let img = null, raf = 0, t0 = 0
function draw(u) {
  const c = cv.value; if (!c || !img?.naturalWidth) return
  const g = c.getContext('2d')
  const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2          // ease in and out
  const z = props.from + (props.to - props.from) * e
  // cover fit at zoom z about the focus, shifted by the drift
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * z
  const w = img.naturalWidth * s, h = img.naturalHeight * s
  const fx = props.focus[0] / 100, fy = props.focus[1] / 100
  const x = (W - w) * fx + props.drift[0] / 100 * W * e, y = (H - h) * fy + props.drift[1] / 100 * H * e
  g.imageSmoothingQuality = 'high'
  g.drawImage(img, Math.min(0, Math.max(W - w, x)), Math.min(0, Math.max(H - h, y)), w, h)
}
function frame(now) {
  const u = Math.min(1, Math.max(0, ((now - t0) / 1000 - props.delay) / props.seconds))
  draw(u)
  if (u < 1) raf = requestAnimationFrame(frame)
}
function stop() { cancelAnimationFrame(raf); raf = 0 }
function start() { stop(); t0 = performance.now(); raf = requestAnimationFrame(frame) }
watch([active, live], ([a, l]) => { if (a && l) start(); else { stop(); draw(0) } })
onMounted(() => {
  img = new Image(); img.decoding = 'async'
  img.onload = () => { draw(0); if (active.value && live.value) start() }
  img.src = url(props.src)
})
onBeforeUnmount(stop)
</script>

<template><canvas ref="cv" class="pan-canvas" width="1920" height="1080" aria-hidden="true" /></template>

<style>
.slidev-layout .pan-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
</style>
