<script setup>
import { useSlideContext, useNav } from '@slidev/client'
import { places } from './afterCover.js'

// <AfterCover>…</AfterCover>: what it wraps mounts only once the cover is behind
// (afterCover.js, the `places` latch): the photo places, whose builds decode
// their photos on the main thread and stalled the cover's fly-in. Always in the
// overview, the presenter's previews and print.
const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
const due = places.on
</script>

<template><slot v-if="due || $renderContext !== 'slide' || isPrintMode" /></template>
