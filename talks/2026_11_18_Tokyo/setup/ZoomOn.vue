<script setup>
// <ZoomOn :at="[71.3, 58.2]" :to="1.6" :delay="5" :seconds="90" />: once the slide's clip has ended, its picture goes
// on in towards a point (`at`, per cent of the frame), slowly, to `to` times (the owner, 12 Nov: "on slide 15 keep
// zooming int to japan"). The clip's <video> is scaled about that point (the Web Animations API, a transform: the
// compositor moves it between pixels; an `object-view-box` window moved in whole pixels and crawled in steps). The
// player's box cuts it at the slide's edge. Undone when the slide is left.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  at: { type: Array, default: () => [50, 50] },
  to: { type: Number, default: 1.5 },
  from: { type: Number, default: null },     // the clip's second at which it starts; none: the clip's end
  delay: { type: Number, default: 4 },       // s after that
  seconds: { type: Number, default: 60 },
})
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const root = ref(null)
let video = null, timer = null, anim = null
function check() {
  if (!video) { video = (root.value?.closest('.slidev-page') || root.value?.parentElement)?.querySelector('.video-player video') || null; if (!video) return }
  if (anim || !(video.ended || (props.from != null && video.currentTime >= props.from))) return
  clearInterval(timer); timer = null
  video.style.transformOrigin = `${props.at[0]}% ${props.at[1]}%`
  video.parentElement.style.overflow = 'hidden'
  try { anim = video.animate([{ transform: 'scale(1)' }, { transform: `scale(${props.to})` }], { duration: props.seconds * 1000, delay: props.delay * 1000, easing: 'cubic-bezier(0.3, 0, 1, 1)', fill: 'forwards' })   // a soft start, then one steady pace to the end: it never slows to a stop } catch { anim = null }
}
function stop() { clearInterval(timer); timer = null; try { anim?.cancel() } catch { /* gone */ } anim = null; video = null }
watch([active, live], ([a, l]) => { stop(); if (a && l) timer = setInterval(check, 200) }, { immediate: true })
onBeforeUnmount(stop)
</script>

<template><span ref="root" class="zoom-on" aria-hidden="true" /></template>
