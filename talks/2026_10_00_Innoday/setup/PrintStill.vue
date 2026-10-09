<script setup>
// <PrintStill src="figures/stills/04.jpg" />: a slide whose picture is the live world
// exports blank (print, PDF, the overview: no WebGL there). This puts a
// still of the slide, shot from a real render, over it in print only; on
// screen it is not drawn at all. The still carries the slide's own text, so
// the PDF page looks like the room saw it.
const props = defineProps({ src: { type: String, required: true } })
// src is relative to the deck's base (figures/stills/NN.jpg), so Slidev's image preloader
// and the page resolve the same file under any base (/, or the Pages /<repo>/<talk>/)
const url = `${import.meta.env.BASE_URL}${props.src.replace(/^\//, '')}`
</script>

<template><img class="print-still" :src="url" alt="" aria-hidden="true" /></template>
