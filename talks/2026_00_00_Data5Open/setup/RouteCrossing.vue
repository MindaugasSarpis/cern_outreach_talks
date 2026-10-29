<script setup>
// <RouteCrossing name="crossing" :later="[['s2', 2, 21.5], ['trg', 0, 33]]" />: on the close.
// When the slide is entered the shared collision (components/lhc-opening, the object's
// `approach` engine-seconds from the start to the crossing) starts its run, so the crossing
// falls where the slide's `rate` keys bring the world nearly to a stop; leaving the slide
// lets it fade. `later`: [form, step, seconds] set that long after the slide is entered, in
// world time (setStepLater; the world runs at rate 1 until the bullet time), so one slide
// lifts our grain out of the heap, glides it to the crossing and turns the lane off before
// the landing. Pending ones are cancelled on leave. Not in print, where every page is
// current. Talk-owned until the kit lifts T1's Crossing.vue (notes/kit-requests.md 1).
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { setStepLater } from 'slidev-addon-stage'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({
  name: { type: String, default: 'crossing' },
  later: { type: Array, default: () => [] },
})
const { isPrintMode } = useNav()
let cancels = []
const cancelAll = () => { cancels.forEach((c) => c()); cancels = [] }

onSlideEnter(() => {
  if (isPrintMode.value) return
  bus.set(props.name, 1)
  cancelAll()
  cancels = props.later.map(([form, step, s]) => setStepLater(form, step, s))
})
onSlideLeave(() => {
  bus.set(props.name, 0)
  cancelAll()
})
</script>

<template><span class="route-crossing" aria-hidden="true" /></template>
