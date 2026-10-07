<script setup>
import { onSlideEnter } from '@slidev/client'
import { setGrains } from './grains.js'

// <Grains :set="{ open: 2, run3: -1 }" />: when its slide becomes the
// current one, each named form in the world goes to that step.
const props = defineProps({ set: { type: Object, default: () => ({}) } })
onSlideEnter(() => { for (const [name, step] of Object.entries(props.set)) setGrains(name, step) })
</script>

<template><span class="grains-step" aria-hidden="true" /></template>
