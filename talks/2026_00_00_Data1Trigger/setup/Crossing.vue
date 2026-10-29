<script setup>
// <Crossing />: on the cover. When the slide becomes the current one the shared
// collision (components/lhc-opening, `lhc-collision` named `crossing`) starts from
// its run-in, the bunches meeting `approach` engine-seconds later (space.json:
// 8.3 s, as the cover's camera path lands); leaving the slide lets it fade
// (1.6 s), so no later slide carries the cover's tracks. Every visit plays it
// again. Not in print, where every page is "current": the still shows it.
// MasterTalk's Crossing.vue (bible §4), without its slideNav and Clock.
import { useIsSlideActive, useNav, onSlideLeave } from '@slidev/client'
import { whenEntered } from 'slidev-addon-stage'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({ name: { type: String, default: 'crossing' } })
const { isPrintMode } = useNav()

whenEntered(useIsSlideActive(), () => {
  if (isPrintMode.value) return
  bus.set(props.name, 1)
})
onSlideLeave(() => {
  bus.set(props.name, 0)
  bus.emit('stop', { name: props.name })
})
</script>

<template><span class="crossing-step" aria-hidden="true" /></template>
