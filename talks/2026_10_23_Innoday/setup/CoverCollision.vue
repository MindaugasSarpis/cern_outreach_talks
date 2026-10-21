<script setup>
// <CoverCollision />: the cover's slow CMS loop (`cover-collision`, setup/coverCollision.js;
// the `cover` object at the hero station in space.json). While the cover is the current
// slide the rounds run (bunches meet, the tracks fan out, the burst holds, fades, again);
// leaving it (the first press goes to the opener clip) lets the burst fade and starts no
// new round. Silent, no captions: slide 9's run (`opening`) keeps its sound and numbers.
// Only the slide itself drives it: the overview's thumbnails and the presenter's
// next-slide preview mount the cover too. Not in print, where every page is "current":
// the still (public/stills/01.jpg) shows it. After OpenData's CoverCollision.vue.
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
