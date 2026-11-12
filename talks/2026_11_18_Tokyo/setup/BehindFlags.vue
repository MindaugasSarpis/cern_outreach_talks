<script setup>
// <BehindFlags :at="22.5" />: the flags of Lithuania (left) and Japan (right) come up behind the finale's pentaquark,
// run into each other in the middle (the owner, 12 Nov: "for the finale we want japanese and lithuanian flags
// appearing in the background joined in the middle behind the pentaquark"). A layer over the clip, added to it as
// light (`mix-blend-mode: screen`), so the pentaquark's own light stays in front of it; dim, soft at the frame's
// edges. `at`: the clip's second from which it comes up (omitted: at once, the last page). It stays while the
// loop plays; hidden again when the slide is left. Lithuania: yellow #FDB913, green #006A44, red #C1272D, three
// equal bands. Japan: white with a red disc #BC002D, three fifths of the height across.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({ at: { type: Number, default: null } })
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const root = ref(null)
const up = ref(false)
let video = null, timer = null
function check() {
  if (!video) { video = (root.value?.closest('.slidev-page') || root.value?.parentElement)?.querySelector('.video-player video') || null; if (!video) return }
  if (video.ended || video.currentTime >= props.at) up.value = true
}
function stop() { clearInterval(timer); timer = null }
watch([active, live], ([a, l]) => {
  stop()
  if (!l) return
  up.value = false; video = null
  if (!a) return
  if (props.at == null) timer = setTimeout(() => { up.value = true }, 300)
  else timer = setInterval(check, 100)
}, { immediate: true })
onBeforeUnmount(stop)
const shown = computed(() => !live.value || up.value)
// the masks' ids, one set per instance: two slides carry the layer, and an id found first in a hidden slide's
// SVG does not paint
const id = 'fb' + (globalThis.__behindFlags = (globalThis.__behindFlags || 0) + 1)
</script>

<template>
  <div ref="root" class="flags-behind" :class="{ on: shown }" aria-hidden="true">
    <svg viewBox="0 0 980 551.25" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="id + 'a'" x1="0" x2="1" y1="0" y2="0"><stop offset="0.38" stop-color="#fff" /><stop offset="0.62" stop-color="#000" /></linearGradient>
        <mask :id="id + 'lt'"><rect width="980" height="551.25" :fill="`url(#${id}a)`" /></mask>
        <linearGradient :id="id + 'b'" x1="0" x2="1" y1="0" y2="0"><stop offset="0.38" stop-color="#000" /><stop offset="0.62" stop-color="#fff" /></linearGradient>
        <mask :id="id + 'jp'"><rect width="980" height="551.25" :fill="`url(#${id}b)`" /></mask>
        <!-- soft at the frame's edges, and held back in the middle, where the pentaquark is -->
        <radialGradient :id="id + 'e'" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stop-color="#555" /><stop offset="0.3" stop-color="#bbb" /><stop offset="0.5" stop-color="#fff" /><stop offset="1" stop-color="#000" /></radialGradient>
        <mask :id="id + 'all'"><rect width="980" height="551.25" :fill="`url(#${id}e)`" /></mask>
      </defs>
      <g :mask="`url(#${id}all)`">
        <g :mask="`url(#${id}lt)`">
          <rect x="0" y="0" width="620" height="183.75" fill="#FDB913" /><rect x="0" y="183.75" width="620" height="183.75" fill="#006A44" /><rect x="0" y="367.5" width="620" height="183.75" fill="#C1272D" />
        </g>
        <g :mask="`url(#${id}jp)`">
          <rect x="360" y="0" width="620" height="551.25" fill="#ffffff" fill-opacity="0.5" /><circle cx="735" cy="275.6" r="150" fill="#BC002D" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style>
.slidev-layout .flags-behind { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity 3s ease; mix-blend-mode: screen; }
.slidev-layout .flags-behind.on { opacity: 0.26; }
.slidev-layout .flags-behind svg { display: block; width: 100%; height: 100%; filter: blur(7px); }
@media print { .slidev-layout .flags-behind { opacity: 0.26; } }
</style>
