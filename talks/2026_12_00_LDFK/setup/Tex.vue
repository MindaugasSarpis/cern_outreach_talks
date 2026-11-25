<script setup lang="ts">
// Inline maths inside the slides' HTML blocks, where Markdown's $…$ is not read:
// <Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" />
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{ v: string }>()
const html = computed(() => katex.renderToString(props.v, { throwOnError: false, output: 'html' }))
</script>

<template>
  <span class="tex" v-html="html" />
</template>
