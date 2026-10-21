<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav, useSlideContext } from '@slidev/client'

// <ClipEnd :lead="1.5">…</ClipEnd>, beside a slide's <VideoPlayer>: what it wraps fades in
// as the clip ends (`lead` s before its end), over the clip's last frame, which holds
// (no clip moves on by itself). Slide 27 (owner, 21 Oct: "At the end of slide 27 text
// appears"): the FCC map's last frame, then the question. Timed from the clip itself, not
// the slide's arrival (the clip starts after its dust arrives). Printed, it shows.
const props = defineProps({ lead: { type: Number, default: 1.5 } })
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const root = ref(null)
const on = ref(!!isPrintMode.value || $renderContext?.value !== 'slide')
let video = null, raf = 0

const findVideo = () => root.value?.closest('.slidev-page')?.querySelector('.video-player video') || null
function watchClip() {
  cancelAnimationFrame(raf)
  const tick = () => {
    video ||= findVideo()
    const d = video?.duration
    if (video && (video.ended || (d > 0 && video.currentTime >= d - props.lead))) { on.value = true; return }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onSlideEnter(() => { if (isPrintMode.value || $renderContext?.value !== 'slide') return; on.value = false; watchClip() })
onSlideLeave(() => { cancelAnimationFrame(raf); if (!isPrintMode.value && $renderContext?.value === 'slide') on.value = false })
onMounted(() => { video = findVideo() })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template><div ref="root" class="clip-end" :class="{ on }"><slot /></div></template>

<style>
.clip-end { position: absolute; inset: 0; z-index: 35; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; transition: opacity 1.2s ease; }
.clip-end.on, html.print .clip-end { opacity: 1; }
.clip-end .question { position: relative; font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 44px; font-weight: 600; color: #fff; text-align: center; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.8); }
/* a soft dark ground, so the words never sit on the map's labels */
.clip-end .question::before { content: ''; position: absolute; z-index: -1; left: 50%; top: 50%; width: 130%; height: 3.4em; transform: translate(-50%, -50%); background: radial-gradient(closest-side, rgba(0, 1, 3, 0.7), rgba(0, 1, 3, 0)); }
@media (prefers-reduced-motion: reduce) { .clip-end { transition: none; } }
</style>
