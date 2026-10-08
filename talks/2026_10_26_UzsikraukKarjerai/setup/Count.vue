<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { onSlideEnter, useSlideContext, useNav } from '@slidev/client'

// <Count name="open" :from="800" :to="55000" />: the number counts up (or
// down) when its slide becomes the current one, at the pace the grains of
// the matching step arrive (a smoothstep from 1.0 s to 3.9 s: grow 3.2 s,
// 1.6 s a grain). Re-entered, it starts from what the form named `name` last
// showed, so going back counts down with the scattering grains (1.1 s) and
// an unchanged ball shows its number at once. Groups of three are set apart
// by a thin space. Printed, in the overview and under reduced motion it
// shows `to`.
const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, required: true },
  ms: { type: Number, default: 2900 },
  delay: { type: Number, default: 1000 },
  name: { type: String, default: '' },
  // Lithuanian typography: a narrow space between thousands from five digits
  // up (1844, but 55 000); years never (`:group="false"`); decimals take a comma
  group: { type: [Boolean, String], default: 'auto' },
  decimals: { type: Number, default: 0 },
})
const last = Count_last
const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
// print renders slides with the default render context, 'slide': ask the router as well
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !isPrintMode.value)
const value = ref(props.to)
let raf = 0
onSlideEnter(() => {
  cancelAnimationFrame(raf)
  if (!live.value || matchMedia('(prefers-reduced-motion: reduce)').matches) { value.value = props.to; return }
  const from = props.name && last.has(props.name) ? last.get(props.name) : props.from
  if (props.name) last.set(props.name, props.to)
  if (from === props.to) { value.value = props.to; return }
  const down = props.to < from
  const ms = down ? 1100 : props.ms
  const t0 = performance.now() + (down ? 0 : props.delay)
  value.value = from
  const tick = (now) => {
    const u = Math.min(Math.max((now - t0) / ms, 0), 1)
    const e = down ? 1 - Math.pow(1 - u, 3) : u * u * (3 - 2 * u)
    const k = 10 ** props.decimals
    value.value = Math.round((from + (props.to - from) * e) * k) / k
    if (u < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => cancelAnimationFrame(raf))
const text = computed(() => {
  const [int, frac] = value.value.toFixed(props.decimals).split('.')
  const group = props.group === 'auto' ? Math.abs(props.to) >= 10000 : props.group
  const i = group ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : int
  return frac ? `${i},${frac}` : i
})
</script>

<script>
// what each named count last showed, across its slides (live windows only)
const Count_last = new Map()
</script>

<template><span class="count">{{ text }}</span></template>
