<script setup>
import { ref, computed } from 'vue'
import { onSlideEnter, useSlideContext } from '@slidev/client'

// <Count :from="800" :to="55000" :ms="4200" />: the number counts up (or
// down) when its slide becomes the current one, at the pace the grains of
// the matching step take to arrive. Groups of three are set apart by a thin
// space. Printed, in the overview and under reduced motion it shows `to`.
const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, required: true },
  ms: { type: Number, default: 4200 },
  delay: { type: Number, default: 300 },
})
const { $renderContext } = useSlideContext()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value))
const value = ref(props.to)
let raf = 0
onSlideEnter(() => {
  if (!live.value || matchMedia('(prefers-reduced-motion: reduce)').matches) { value.value = props.to; return }
  cancelAnimationFrame(raf)
  value.value = props.from
  const t0 = performance.now() + props.delay
  const tick = (now) => {
    const u = Math.min(Math.max((now - t0) / props.ms, 0), 1)
    // the grains arrive inner first and slow at the rim: ease out
    const e = 1 - Math.pow(1 - u, 3)
    value.value = Math.round(props.from + (props.to - props.from) * e)
    if (u < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})
const text = computed(() => String(value.value).replace(/\B(?=(\d{3})+(?!\d))/g, ' '))
</script>

<template><span class="count">{{ text }}</span></template>
