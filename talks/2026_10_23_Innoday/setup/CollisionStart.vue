<script setup>
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { bus } from '../components/lhc-opening/bus.js'

// <CollisionStart name="thanks" />: starts a collision of the shared LHC opening
// (components/lhc-opening, the `lhc-collision` object of that name in
// space.json) when its slide opens, without <LhcOpening>'s fixed captions. On
// „Ačiū“ (owner, 12 Oct: "a slow developing particle collision filling the
// entire screen"); the slowness is the object's own options (`light`,
// `approach`) and the slide's `rate`, never the module's defaults, which
// OpenData's and Užsikrauk karjerai's openings share. Not in print: the still
// shows it.
const props = defineProps({ name: { type: String, required: true } })
const { isPrintMode } = useNav()
onSlideEnter(() => { if (!isPrintMode.value) bus.set(props.name, 1) })
onSlideLeave(() => { bus.set(props.name, 0); bus.emit('stop', { name: props.name }) })
</script>

<template><span class="collision-start" aria-hidden="true" /></template>
