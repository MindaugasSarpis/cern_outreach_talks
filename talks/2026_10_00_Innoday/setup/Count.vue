<script setup>
import { ref, computed } from 'vue'
import { onSlideEnter, useSlideContext } from '@slidev/client'

// <Count :to="1954" :from="1900" :ms="2400" />: the number counts when its
// slide becomes the current one. Written the Lithuanian way: groups of three
// set apart by a thin no-break space (unless `plain`, for years), a decimal
// comma (`decimals`). Printed, in the overview and under reduced motion it
// shows `to`.
const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, required: true },
  ms: { type: Number, default: 2600 },
  delay: { type: Number, default: 350 },
  decimals: { type: Number, default: 0 },
  plain: { type: Boolean, default: false },
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
    const e = 1 - Math.pow(1 - u, 3)
    value.value = props.from + (props.to - props.from) * e
    if (u < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})
const text = computed(() => {
  const s = value.value.toFixed(props.decimals)
  const [int, dec] = s.split('.')
  const grouped = props.plain ? int : int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return dec ? `${grouped},${dec}` : grouped
})
</script>

<template><span class="count">{{ text }}</span></template>
