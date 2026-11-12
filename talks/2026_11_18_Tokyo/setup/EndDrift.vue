<script setup>
// <EndDrift :at="[52, 46]" :zoom="1.14" :sway="2.6" :seconds="90" />: once the slide's clip has ended, the picture and
// everything laid over it (the clip, its loop, the labels that came at its end) go on moving together: a slow zoom in
// towards `at` (per cent of the frame) and a gentle turn to and fro about the upright axis, as a camera drifting round
// a flat thing (the owner, 13 Nov, of the data slide's histogram: "histogram stays dynamic, slowly zooming in … orbiting").
// One transform, the same on each layer (the clip's <video>, <ClipLoop>'s, each <AtClipEnd>), so the labels stay on the
// peaks they name. Undone when the slide is left.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  at: { type: Array, default: () => [50, 50] },
  zoom: { type: Number, default: 1.12 },
  sway: { type: Number, default: 2.5 },      // degrees each way
  period: { type: Number, default: 24 },     // s for one to and fro
  seconds: { type: Number, default: 90 },
  delay: { type: Number, default: 1.5 },     // s after the clip's end
})
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const root = ref(null)
let timer = null, anims = []
function frames() {
  const n = Math.round(props.seconds / 2), out = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * props.seconds, k = i / n
    const z = 1 + (props.zoom - 1) * (1 - Math.pow(1 - k, 1.6)), a = props.sway * Math.sin(2 * Math.PI * t / props.period) * Math.min(1, t / 6)
    out.push({ transform: `perspective(1800px) rotateY(${a.toFixed(3)}deg) scale(${z.toFixed(4)})` })
  }
  return out
}
function check() {
  const page = root.value?.closest('.slidev-page') || root.value?.parentElement
  const video = page?.querySelector('.video-player video')
  if (!video?.ended || anims.length) return
  clearInterval(timer); timer = null
  const kf = frames()
  for (const el of [video, ...page.querySelectorAll('.clip-loop, .at-clip-end')]) {
    el.style.transformOrigin = `${props.at[0]}% ${props.at[1]}%`
    try { anims.push(el.animate(kf, { duration: props.seconds * 1000, delay: props.delay * 1000, easing: 'linear', fill: 'forwards' })) } catch { /* no Web Animations */ }
  }
  if (video.parentElement) video.parentElement.style.overflow = 'hidden'
}
function stop() { clearInterval(timer); timer = null; for (const a of anims) { try { a.cancel() } catch { /* gone */ } } anims = [] }
watch([active, live], ([a, l]) => { stop(); if (a && l) timer = setInterval(check, 200) }, { immediate: true })
onBeforeUnmount(stop)
</script>

<template><span ref="root" class="end-drift" aria-hidden="true" /></template>
