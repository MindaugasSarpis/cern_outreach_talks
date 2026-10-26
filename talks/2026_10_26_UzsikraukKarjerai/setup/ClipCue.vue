<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'

// <ClipCue :from="40" :path="[[40, 620, 120], [46, 640, 110]]">mano greitintuvas</ClipCue>,
// beside a slide's <VideoPlayer>: what it wraps fades in at `from` s of the clip's own clock
// (not the slide's: the clip starts after it arrives) and stands at `path`'s point for that
// second, canvas px of its top-left, eased between the keys and holding at the last, so a
// label can follow a thing the clip's camera is still settling on. Slide 19 (owner, 23 Oct:
// "mano appearing where LHC is and when FCC is in view - jūsų greitintuvas"): the close's two
// rings. With `end` set it shows `end` s before the clip's end instead (the credits). Printed,
// in the overview and without the clip it stands at its last point. After Innoday's ClipEnd.
const props = defineProps({
  from: { type: Number, default: 0 },
  end: { type: Number, default: null },
  path: { type: Array, default: () => [] },
})
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const root = ref(null)
const still = () => !!isPrintMode.value || $renderContext?.value !== 'slide'
const on = ref(still())
const t = ref(Infinity)
let video = null, raf = 0

const at = computed(() => {
  const p = props.path
  if (!p.length) return null
  if (t.value <= p[0][0]) return p[0]
  for (let i = 1; i < p.length; i++) {
    if (t.value <= p[i][0]) {
      const [t0, x0, y0] = p[i - 1], [t1, x1, y1] = p[i]
      let a = (t.value - t0) / (t1 - t0); a = a * a * (3 - 2 * a)
      return [t.value, x0 + (x1 - x0) * a, y0 + (y1 - y0) * a]
    }
  }
  return p[p.length - 1]
})
const style = computed(() => at.value ? { left: `${at.value[1]}px`, top: `${at.value[2]}px` } : {})

const findVideo = () => root.value?.closest('.slidev-page')?.querySelector('.video-player video') || null
function watchClip() {
  cancelAnimationFrame(raf)
  const tick = () => {
    video ||= findVideo()
    if (video) {
      const d = video.duration
      t.value = video.ended && d > 0 ? d : video.currentTime
      on.value = props.end != null ? (video.ended || (d > 0 && video.currentTime >= d - props.end)) : t.value >= props.from
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onSlideEnter(() => { if (still()) return; on.value = false; t.value = props.from; watchClip() })
onSlideLeave(() => { cancelAnimationFrame(raf); if (!still()) on.value = false })
onMounted(() => { video = findVideo() })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template><div ref="root" class="clip-cue" :class="{ on, placed: !!at }" :style="style"><slot /></div></template>

<style>
.clip-cue { position: absolute; z-index: 35; pointer-events: none; opacity: 0; transition: opacity 1s ease; }
.clip-cue.on, html.print .clip-cue { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .clip-cue { transition: none; } }
</style>
