<script setup>
// <PrintStill src="stills/04.jpg" />: a slide whose picture is the live world
// exports blank (print, PDF, the overview: no WebGL there). This puts a
// still of the slide, shot from a real render, over it in print only; on
// screen it is not drawn at all. The still carries the slide's own text, so
// the PDF page looks like the room saw it.
const props = defineProps({ src: { type: String, required: true } })
const url = `${import.meta.env.BASE_URL}figures/${props.src}`
</script>

<template><img class="print-still" :src="url" alt="" aria-hidden="true" /></template>
