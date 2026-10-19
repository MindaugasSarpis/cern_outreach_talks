<script setup>
// <CoverCollision />: the cover's CMS crossing, the `cover` lhc-collision at the opening
// station (space.json; `sound: false`, so the cover stays silent, and no captions:
// slide 4's own run, `opening`, keeps its sound and its numbers). When the cover
// becomes the current slide the crossing runs again from its run-in, fast, then
// holds; leaving the slide lets it fade. Only the slide itself drives it: the
// overview's thumbnails and the presenter's next-slide preview mount the cover too,
// and would start the run again at the held rate. Not in print, where every page is
// "current": the still (public/stills/01.jpg) shows it.
import { onSlideEnter, onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({ name: { type: String, default: 'cover' } })
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const live = () => ['slide', 'presenter'].includes($renderContext?.value)
onSlideEnter(() => { if (live() && !isPrintMode.value) bus.set(props.name, 1) })
onSlideLeave(() => { if (live()) bus.set(props.name, 0) })
</script>

<template><span class="cover-collision" aria-hidden="true" /></template>
