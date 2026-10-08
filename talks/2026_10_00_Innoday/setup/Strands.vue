<script setup>
import { onSlideEnter, useNav } from '@slidev/client'
import { setStrands } from './strands.js'

// <Strands :on="true" />: when its slide becomes the current one, the strands
// from the ring's parts to the inventions fade in (or out). Not in print.
const props = defineProps({ on: { type: Boolean, default: true } })
const { isPrintMode } = useNav()
onSlideEnter(() => { if (!isPrintMode.value) setStrands(props.on) })
</script>

<template><span class="strands-step" aria-hidden="true" /></template>
