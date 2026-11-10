<script setup>
// <AtClipEnd :lead="0.8"> … </AtClipEnd>: what it wraps comes in only as the slide's clip ends
// (the owner, 10 Nov, slide 2: "2018 Lithuania… appears immediately of slide click. Should only
// appear at the end of the slide"). It watches the slide's own <video>: shown once the clip is
// within `lead` seconds of its end, or has ended. Hidden again when the slide is left, so a
// visit back plays the same order. Off the live slide (overview, print, the presenter's next
// preview) it shows at once, so the still and the PDF carry it.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  lead: { type: Number, default: 0.8 },   // s before the clip's end
})
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !isPrintMode?.value)
const root = ref(null)
const at = ref(false)
let video = null, timer = null

function check() {
  if (!video) {
    const page = root.value?.closest('.slidev-page') || root.value?.parentElement
    video = page?.querySelector('video') || null
    if (!video) return
  }
  const d = video.duration
  if (video.ended || (Number.isFinite(d) && d > 0 && video.currentTime >= d - props.lead)) at.value = true
}
function stop() { clearInterval(timer); timer = null }
watch([active, live], ([on, isLive]) => {
  stop()
  if (!isLive) return
  at.value = false
  video = null
  if (on) timer = setInterval(check, 100)
}, { immediate: true })
onBeforeUnmount(stop)

const shown = computed(() => !live.value || at.value)
</script>

<template>
  <div ref="root" class="at-clip-end" :class="{ on: shown }"><slot /></div>
</template>

<style>
.slidev-layout .at-clip-end { position: absolute; inset: 0; pointer-events: none; z-index: 26; opacity: 0; transition: opacity 1.2s ease; }
.slidev-layout .at-clip-end.on { opacity: 1; }
</style>
