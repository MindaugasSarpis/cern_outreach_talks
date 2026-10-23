<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { fillShare } from './grains.js'

// <FillClock name="th1" :to="4" unit="diena,dienos,dienų" />: how long the data
// on the plot took to collect, ticking as its grains land. The share of the
// histogram `name` landed so far, times `to`, with the Lithuanian form of the
// unit for that number (1, 21: diena; 2–9, 22–29: dienos; 0, 10–20, 30: dienų).
// <FillClock name="oc" :years="[[0, 2011], [0.3, 2012], [0.91, 2015]]" />: the
// year of the data landing now, from the share at which each year's data begin.
// Without WebGL the plot is not built: the clock runs on its own from the
// slide's arrival (or from click `at`), `delay` s later, over `fill` s, as the
// plate's fill does. Printed, in the overview and under reduced motion: the end.
const props = defineProps({
  name: { type: String, required: true },
  to: { type: Number, default: 0 },
  unit: { type: String, default: '' },
  years: { type: Array, default: null },
  at: { type: Number, default: 0 },
  delay: { type: Number, default: 4.8 },
  fill: { type: Number, default: 7 },
  curve: { type: Number, default: 1 },
})
const { $renderContext, $clicks } = useSlideContext()
const { isPrintMode } = useNav()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !isPrintMode.value)
const share = ref(1)
let raf = 0, t0 = 0
const run = () => {
  cancelAnimationFrame(raf)
  if (!live.value || matchMedia('(prefers-reduced-motion: reduce)').matches) { share.value = 1; return }
  t0 = performance.now()
  share.value = 0
  const tick = (now) => {
    // only forward within one run: a plot that empties as the next one comes in (slide 10's
    // second click) keeps its clock at its end while the label fades
    const s = fillShare(props.name) ?? Math.pow(Math.min(Math.max((now - t0) / 1000 - props.delay, 0) / props.fill, 1), 1 / props.curve)
    share.value = Math.max(share.value, s)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onSlideEnter(() => { if (!props.at || $clicks.value >= props.at) run() })
watch($clicks, (c, was) => { if (props.at && c >= props.at && was < props.at) run() })
onSlideLeave(() => cancelAnimationFrame(raf))
onUnmounted(() => cancelAnimationFrame(raf))
const form = (n) => {
  const [one, few, many] = props.unit.split(',')
  if (!few) return one || ''
  if (n % 10 === 1 && n % 100 !== 11) return one
  if (n % 10 >= 2 && (n % 100 < 10 || n % 100 > 20)) return few
  return many
}
const text = computed(() => {
  if (props.years) {
    let y = props.years[0][1]
    for (const [s, year] of props.years) if (share.value >= s) y = year
    return `${y} m.`
  }
  const n = Math.round(share.value * props.to)
  return `${n} ${form(n)}`
})
</script>

<template><span class="fill-clock">{{ text }}</span></template>
