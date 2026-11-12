<script setup>
// <ClipLoop src="finale_loop.mp4" />: when the slide's clip ends, a looping clip takes over, so the picture goes
// on moving (the owner, 12 Nov: "Slide 17 should continue playing"). The loop is cut to begin on the frame
// after the clip's last one (videos/finale/segments.sh), so the hand-over is not seen. It plays from where the
// player found the clip: the loop's address is the clip's own with the file's name changed (the release, the
// local encode or the venue copy, whichever the player's chain settled on). Silent; hidden and reset when the
// slide is left. Off the live slide it does nothing.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  src: { type: String, required: true },
  lead: { type: Number, default: 0.12 },   // s before the clip's end at which the loop starts
})
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const root = ref(null), loop = ref(null)
const on = ref(false)
let main = null, timer = null, armed = ''

function tick() {
  if (!main) {
    const page = root.value?.closest('.slidev-page') || root.value?.parentElement
    main = page?.querySelector('.video-player video') || null
    if (!main) return
  }
  const at = main.currentSrc
  if (at && armed !== at && loop.value) {
    // the loop from beside the clip, loaded while the clip plays
    armed = at
    loop.value.src = at.replace(/[^/?#]+(?=($|[?#]))/, props.src)
    loop.value.load()
  }
  const d = main.duration
  if (!on.value && armed && (main.ended || (Number.isFinite(d) && d > 0 && main.currentTime >= d - props.lead))) {
    const v = loop.value
    try { v.currentTime = 0 } catch { /* not loaded yet */ }
    v.play().then(() => { on.value = true }).catch(() => {})
  }
}
function stop() {
  clearInterval(timer); timer = null
  on.value = false; main = null
  const v = loop.value
  if (v) { try { v.pause(); v.currentTime = 0 } catch { /* gone */ } }
}
watch([active, live], ([a, l]) => {
  stop()
  if (a && l) timer = setInterval(tick, 40)
}, { immediate: true, flush: 'post' })
onBeforeUnmount(stop)
</script>

<template>
  <div ref="root" class="clip-loop" :class="{ on }" aria-hidden="true">
    <video ref="loop" muted loop playsinline webkit-playsinline preload="auto" />
  </div>
</template>

<style>
.slidev-layout .clip-loop { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; }
.slidev-layout .clip-loop.on { opacity: 1; transition: opacity 0.25s linear; }
.slidev-layout .clip-loop video { display: block; width: 100%; height: 100%; object-fit: cover; }
</style>
