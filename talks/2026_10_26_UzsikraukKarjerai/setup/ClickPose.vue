<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { useIsSlideActive, useSlideContext, useNav } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'

// <ClickPose :poses="{ 1: { at: 'thesis', flight: 2.5 } }" />: from that click on, the
// camera takes this pose instead of the slide's own `space` (the stage's `stops` take
// only a ring's or an orb's anchor, and light a shell there). The stage applies the
// slide's pose on every click and on its boot, and marks where it went on its root
// (data-space-at): whenever that is not this click's pose, it is set again, so the
// two never fight for more than a frame. Click 0, and a slide without the world
// (printed, the overview, the plates' fallback), keep the slide's own pose.
// Slide 18 (23 Oct): the closer sun of plots, then Dominykas's plot at `thesis`.
const props = defineProps({ poses: { type: Object, default: () => ({}) } })
const { $clicks, $renderContext } = useSlideContext()
const active = useIsSlideActive()
const nav = useNav()

const want = () => {
  let p = null
  for (const [at, pose] of Object.entries(props.poses)) if ($clicks.value >= Number(at)) p = pose
  return p
}
const root = () => document.querySelector('[data-space-at]')
function sync() {
  if (!active.value || !['slide', 'presenter'].includes($renderContext?.value)) return
  const p = want(), el = root()
  const api = document.querySelector('.stage')?.__space
  if (!p || !el || !api?.setPose) return
  if (el.dataset.spaceAt === String(p.at)) return
  api.setPose(p, { key: nav.currentSlideNo.value })
}
const later = () => setTimeout(sync, 0)
let mo = null
onMounted(() => {
  const el = root()
  if (el && typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(later)
    mo.observe(el, { attributes: true, attributeFilter: ['data-space-at'] })
  }
})
onUnmounted(() => mo?.disconnect())
onSlideEnter(later)
watch($clicks, () => { if (active.value) later() })
</script>

<template><span class="click-pose" aria-hidden="true" /></template>
