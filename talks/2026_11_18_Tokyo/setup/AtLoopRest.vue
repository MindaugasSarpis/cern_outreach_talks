<script setup>
// <AtLoopRest :lead="4" :rest="5.5" :again="35.2"> … </AtLoopRest>: what it wraps is shown while the picture under it
// stands where it was drawn for: from `lead` s before the slide's clip ends, and then, once <ClipLoop>'s loop has taken
// over, only in the loop's first `rest` seconds and from its `again`th second on (the globe: its cities' names sit on
// the lights of the clip's last view; in the loop the globe turns away from that view and comes back to it, and the
// names go and come with it). Off the live slide it shows at once.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  lead: { type: Number, default: 4 },
  rest: { type: Number, default: 5 },
  again: { type: Number, default: 1e9 },
})
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !isPrintMode?.value)
const root = ref(null)
const on = ref(false)
let timer = null
function check() {
  const page = root.value?.closest('.slidev-page') || root.value?.parentElement
  const v = page?.querySelector('.video-player video'), box = page?.querySelector('.clip-loop'), l = box?.querySelector('video')
  if (!v) return
  const d = v.duration
  const ended = v.ended || (Number.isFinite(d) && d > 0 && v.currentTime >= d - props.lead)
  const looping = box?.classList.contains('on') && l && !l.paused
  on.value = ended && (!looping || l.currentTime < props.rest || l.currentTime >= props.again)
}
function stop() { clearInterval(timer); timer = null }
watch([active, live], ([a, l]) => { stop(); on.value = false; if (a && l) timer = setInterval(check, 120) }, { immediate: true })
onBeforeUnmount(stop)
const shown = computed(() => !live.value || on.value)
</script>

<template>
  <div ref="root" class="at-clip-end at-loop-rest" :class="{ on: shown }"><slot /></div>
</template>
