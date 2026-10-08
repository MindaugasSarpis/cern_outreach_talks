<script setup>
import { onSlideEnter, useNav } from '@slidev/client'
import { setGrains } from './grains.js'

// <Grains :set="{ open: 2, run3: -1 }" />: when its slide becomes the
// current one, each named form in the world goes to that step. Not in print:
// there every page is "current", and the last page would win.
const props = defineProps({ set: { type: Object, default: () => ({}) } })
const { isPrintMode } = useNav()
onSlideEnter(() => {
  if (isPrintMode.value) return
  for (const [name, step] of Object.entries(props.set)) setGrains(name, step)
})
</script>

<template><span class="grains-step" aria-hidden="true" /></template>
