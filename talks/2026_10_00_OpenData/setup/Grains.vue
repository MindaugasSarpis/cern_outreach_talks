<script setup>
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { setGrains } from './grains.js'

// <Grains :set="{ open: 2, run3: -1 }" />: when its slide becomes the
// current one, each named form in the world goes to that step. Not in print:
// there every page is "current", and the last page would win.
// `later` sets steps after a delay, once a motion has run its course:
// :later="{ scale: [[0], 2.8] }" shows the single sphere 2.8 s after the slide
// opens. Leaving the slide first cancels it.
const props = defineProps({
  set: { type: Object, default: () => ({}) },
  later: { type: Object, default: () => ({}) },
})
const { isPrintMode } = useNav()
let timers = []
onSlideEnter(() => {
  if (isPrintMode.value) return
  for (const [name, step] of Object.entries(props.set)) setGrains(name, step)
  for (const [name, [step, s]] of Object.entries(props.later)) timers.push(setTimeout(() => setGrains(name, step), s * 1000))
})
onSlideLeave(() => { for (const t of timers) clearTimeout(t); timers = [] })
</script>

<template><span class="grains-step" aria-hidden="true" /></template>
