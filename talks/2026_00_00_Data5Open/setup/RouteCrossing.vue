<script setup>
// <RouteCrossing name="crossing" />: on the close. When the slide is entered the shared
// collision (components/lhc-opening, the object's `approach` engine-seconds from the
// start to the crossing) starts its run, so the crossing falls where the slide's `rate`
// keys bring the world nearly to a stop; leaving the slide lets it fade. Not in print,
// where every page is current. Talk-owned until the kit lifts T1's Crossing.vue
// (notes/kit-requests.md).
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({ name: { type: String, default: 'crossing' } })
const { isPrintMode } = useNav()

onSlideEnter(() => { if (!isPrintMode.value) bus.set(props.name, 1) })
onSlideLeave(() => { bus.set(props.name, 0) })
</script>

<template><span class="route-crossing" aria-hidden="true" /></template>
