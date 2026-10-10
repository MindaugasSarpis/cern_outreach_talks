<script setup>
// <LhcOpening name="opening" />: on the opening's collision slide. When the slide
// becomes the current one the collision starts from its run-in (every visit plays
// it again); leaving the slide lets it fade. Not in print, where every page is
// "current": the still shows it.
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { bus } from './bus.js'

const props = defineProps({ name: { type: String, default: 'opening' } })
const { isPrintMode } = useNav()
onSlideEnter(() => { if (!isPrintMode.value) bus.set(props.name, 1) })
onSlideLeave(() => { bus.set(props.name, 0); bus.emit('stop', { name: props.name }) })
</script>

<template><span class="lhc-opening" aria-hidden="true" /></template>
