<script setup>
import { onSlideEnter, useSlideContext } from '@slidev/client'
import { setClock } from './clock.js'

// <Clock :from="-25" :to="0" unit="ns" :run="20" />, <Clock :keys="[[0, -25], [1.5, 0]]" unit="ns" />,
// or <Clock off />:
// sets the talk's one running clock when this slide becomes the current one.
// Only the live slide (and the presenter view) steers it; the overview and
// the previews render every slide at once.
const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, default: undefined },
  unit: { type: String, default: 'ns' },
  run: { type: Number, default: 0 },
  digits: { type: Number, default: 0 },
  off: { type: Boolean, default: false },
  keys: { type: Array, default: null },
})
const { $renderContext } = useSlideContext()
onSlideEnter(() => {
  if (!['slide', 'presenter'].includes($renderContext?.value)) return
  setClock({ ...props, to: props.to ?? props.from })
})
</script>

<template><span class="clock-step" aria-hidden="true" /></template>
