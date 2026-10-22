<script setup>
// A discreet "PPTX" download at the cover's bottom right: the deck as a PowerPoint of the stage's
// takes, one autoplaying video per slide (`pnpm talk pptx NAME`, docs/authoring.md "The stage").
//
//   <PptxButton />                         on the cover slide, after the byline
//   <PptxButton href="https://…" file="x.pptx" />   another asset
//
// The link comes from the talk's videos/pptx.json (written by `talk pptx` with the upload, and
// committed): the Vite root is the talk's directory, so the glob finds it there; without it the
// button renders nothing. Shown only on the slide itself: not in the presenter view, the overview
// or print and export, and never to a browser driven by a tool (navigator.webdriver: the
// recorder, shots, safe, check, export and the pages check; window.__rec and window.__shots,
// which the recorder and shots install before any page script), so no take or shot shows it.
// It sits inside the slide, so the stage's plates, which hide .slidev-layout, leave it out too.
import { computed, onMounted, ref } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  href: { type: String, default: '' },
  file: { type: String, default: '' },
})

const found = import.meta.glob('/videos/pptx.json', { eager: true, import: 'default' })
const meta = Object.values(found)[0] || null

const { $renderContext } = useSlideContext()
const { isPrintMode } = useNav()
const automated = ref(true)          // until mounted: a tool's first frame never has it
const printing = ref(false)

onMounted(() => {
  automated.value = !!(navigator.webdriver || window.__rec || window.__shots)
  // the print and export pages, and ?print (the hash router keeps both after the #; print.vue marks
  // <html> only after this mounts, so its class is not enough)
  const where = location.pathname + location.search + location.hash
  printing.value = /[?&]print\b/.test(where) || /\/(print|export)(\/|\?|$)/.test(where)
    || document.documentElement.classList.contains('print')
})

const url = computed(() => props.href || (meta && typeof meta.url === 'string' ? meta.url : ''))
const name = computed(() => props.file || (meta && typeof meta.asset === 'string' ? meta.asset : ''))
const show = computed(() => !!url.value && $renderContext.value === 'slide' && !isPrintMode?.value
  && !printing.value && !automated.value)
</script>

<template>
  <a v-if="show" class="pptx-button" :href="url" :download="name || true" title="PowerPoint: one video per slide">PPTX</a>
</template>

<style scoped>
.pptx-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 10;
  padding: 0.25rem 0.6rem;
  border: 1px solid currentColor;
  border-radius: 0.3rem;
  color: inherit;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.pptx-button:hover,
.pptx-button:focus-visible {
  opacity: 1;
}
@media print {
  .pptx-button { display: none !important; }
}
</style>
