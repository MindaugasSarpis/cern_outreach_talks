<script setup>
import { watch } from 'vue'
import { onSlideEnter, useIsSlideActive, useSlideContext } from '@slidev/client'
import { setGrains } from './grains.js'

// <Grains :set="{ open: 2, run3: -1 }" />: when its slide becomes the
// current one, each named form in the world goes to that step.
// :clicks="{ 1: { jp: 2 } }": from that click on, these steps instead. A
// slide entered at a later click (stepping back into it) starts there too.
const props = defineProps({
  set: { type: Object, default: () => ({}) },
  clicks: { type: Object, default: () => ({}) },
})
const { $clicks } = useSlideContext()
const active = useIsSlideActive()
const apply = () => {
  const steps = { ...props.set }
  for (const [at, part] of Object.entries(props.clicks)) if ($clicks.value >= Number(at)) Object.assign(steps, part)
  for (const [name, step] of Object.entries(steps)) setGrains(name, step)
}
onSlideEnter(apply)
watch($clicks, () => { if (active.value) apply() })
</script>

<template><span class="grains-step" aria-hidden="true" /></template>
