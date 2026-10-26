<script setup>
import { onUnmounted } from 'vue'
import { onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'

// <Regather :at="35" />: the finale's loop back to the cover (2026-10-26). `at` seconds of
// the world's clock after the slide opens, the forms at the station the camera stands at
// assemble again, as `c` replays them: on the hero, the five quarks fly in as on the cover.
// Timed off the engine's own clock (`canvas.__space.elapsed`), so slidev-stage-record's take
// lands it on the same frame each time; the music's accent is then tied to that clip by
// Soundtrack's `drop`, never to this clock live (Užsikrauk karjerai, 26 Oct: world and audio
// time drift). Only the audience's slide runs it.
const props = defineProps({ at: { type: Number, required: true } })
const { $renderContext } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
let raf = 0
const stop = () => { cancelAnimationFrame(raf); raf = 0 }
onSlideEnter(() => {
  stop()
  if (!live()) return
  const root = document.querySelector('.stage')
  const h = root?.querySelector('canvas')?.__space
  if (!root?.__space || !h) return
  const t0 = h.elapsed
  const tick = () => {
    if (h.elapsed - t0 >= props.at) { raf = 0; root.__space.assemble(); return }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})
onSlideLeave(stop)
onUnmounted(stop)
</script>

<template><span style="display: none" /></template>
