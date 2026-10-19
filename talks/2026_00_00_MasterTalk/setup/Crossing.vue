<script setup>
// <Crossing name="crossing" start />: starts the collision when this slide
// opens (from its run-in); <Crossing name="crossing" /> on the slides after
// it lets the same run go on; <Crossing name="crossing" stop /> lets it fade.
// The shared opening's own <LhcOpening> carries Lithuanian captions; the
// MasterTalk shows its numbers on the slides instead. Not in print.
import { onSlideEnter } from '@slidev/client'
import { useNav } from '@slidev/client'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({
  name: { type: String, default: 'crossing' },
  start: { type: Boolean, default: false },
  stop: { type: Boolean, default: false },
})
const { isPrintMode } = useNav()
onSlideEnter(() => {
  if (isPrintMode.value) return
  if (props.start) bus.set(props.name, 1)
  if (props.stop) { bus.set(props.name, 0); bus.emit('stop', { name: props.name }) }
})
</script>

<template><span class="crossing-step" aria-hidden="true" /></template>
