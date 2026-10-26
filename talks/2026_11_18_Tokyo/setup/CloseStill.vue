<script setup>
import { onSlideEnter, onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { onUnmounted } from 'vue'

// <CloseStill src="figures/close_end.jpg" />: the recorded close's last frame (slide 30's
// close.mp4) as a picture filling the slide, and the world resting under it (owner, 22 Oct:
// "MacPro M2 can't quite handle the final slide"; the credits page drew the whole complex
// live). It tells the stage what a clip would: `slidev-videos:cover` on arrival, so the
// renderer stops, and its release on leaving.
const props = defineProps({ src: { type: String, required: true } })
const { $renderContext } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : import.meta.env.BASE_URL + p
const cover = (covered) => window.dispatchEvent(new CustomEvent('slidev-videos:cover', { detail: { covered, src: props.src, fit: 'cover' } }))
let shown = false
onSlideEnter(() => { if (live()) { shown = true; cover(true) } })
onSlideLeave(() => { if (shown) { shown = false; cover(false) } })
onUnmounted(() => { if (shown) { shown = false; cover(false) } })
</script>

<template><img class="close-still" :src="url(src)" alt="" aria-hidden="true"></template>

<style>
.close-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; pointer-events: none; }
</style>
