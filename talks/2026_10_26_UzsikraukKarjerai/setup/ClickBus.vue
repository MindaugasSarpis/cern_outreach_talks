<script setup>
import { watch, onUnmounted } from 'vue'
import { onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { bus } from '../components/lhc-opening/bus.js'

// <ClickBus name="bang" :click="1" />: from this click a named collision (components/lhc-opening) starts,
// back below it it stops (the close, 24 Oct: „Ačiū už dėmesį“ out of a collision on the press). Leaving
// the slide stops it. Only the audience's and the presenter's live slide; never in print.
const props = defineProps({ name: { type: String, required: true }, click: { type: Number, default: 1 } })
const { $renderContext, $page, $clicks } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
const page = () => $page?.value ?? $page
const stop = () => { bus.set(props.name, 0); bus.emit('stop', { name: props.name }) }
watch($clicks, (c, was) => {
  if (!live() || nav.currentSlideNo?.value !== page()) return
  if (c >= props.click && was < props.click) bus.set(props.name, 1)
  else if (c < props.click && was >= props.click) stop()
})
onSlideLeave(() => { if (live()) stop() })
onUnmounted(() => { if (live()) stop() })
</script>

<template><span class="click-bus" aria-hidden="true" /></template>
