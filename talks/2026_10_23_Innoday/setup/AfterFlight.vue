<script setup>
import { ref, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'

// <AfterFlight :delay="4.6">…</AfterFlight>: what it wraps shows only after the
// slide's flight has landed, so a point lands after the motion, never during
// it. Timed from the slide's arrival (a CSS delay would run from the slide's
// mount, and Slidev mounts every slide 3 s after load). Always shown in print.
const props = defineProps({ delay: { type: Number, default: 4.6 } })
const { isPrintMode } = useNav()
const on = ref(!!isPrintMode.value)
let timer = 0
onSlideEnter(() => { if (isPrintMode.value) return; on.value = false; clearTimeout(timer); timer = setTimeout(() => { on.value = true }, props.delay * 1000) })
onSlideLeave(() => { clearTimeout(timer); if (!isPrintMode.value) on.value = false })
onUnmounted(() => clearTimeout(timer))
</script>

<template><div class="after-flight-wrap" :class="{ on }"><slot /></div></template>

<style>
.after-flight-wrap { opacity: 0; transition: opacity 0.6s ease; }
.after-flight-wrap.on { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .after-flight-wrap { opacity: 1; transition: none; } }
html.print .after-flight-wrap { opacity: 1; }
</style>
