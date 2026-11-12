<script setup>
// <BehindFlags :at="22.5" />: the flags of Lithuania (left) and Japan (right), one cloth joined in the middle, waving
// behind the finale's pentaquark (the owner, 12 Nov: "for the finale we want japanese and lithuanian flags appearing
// in the background joined in the middle behind the pentaquark"; then: "flags more in focus, wawing, the pentaquark
// can become more blurry"). A canvas over the clip, added to it as light (`mix-blend-mode: screen`), so the
// pentaquark's own light stays in front; as the flags come up the clip under them goes soft (the slide's layout
// takes the class `flags-up`, styles below). The cloth: the two flags drawn once, then each frame laid down in
// 2 px columns, every column moved up or down by two travelling sines and shaded by the fold's slope. `at`: the
// clip's second from which it comes up (omitted: at once, the last page). It stays while the loop plays; gone when
// the slide is left. Lithuania: yellow #FDB913, green #006A44, red #C1272D, three equal bands. Japan: white with a
// red disc #BC002D, three fifths of the height across.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({ at: { type: Number, default: null } })
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const root = ref(null), cv = ref(null)
const up = ref(false)
let video = null, timer = null, raf = 0, cloth = null

const W = 1960, H = 1104, OVER = 52   // 13 Nov (the owner: "18 flags better resolved"): twice the pixels each way   // the canvas; the cloth is OVER px taller at top and bottom, for the wave
function makeCloth() {
  const c = document.createElement('canvas'); c.width = W; c.height = H + 2 * OVER
  const g = c.getContext('2d'), h = c.height
  // Lithuania across the left, fading out between 40 and 60 per cent of the width
  const lt = document.createElement('canvas'); lt.width = W; lt.height = h
  const a = lt.getContext('2d')
  a.fillStyle = '#FDB913'; a.fillRect(0, 0, W, h / 3); a.fillStyle = '#006A44'; a.fillRect(0, h / 3, W, h / 3); a.fillStyle = '#C1272D'; a.fillRect(0, 2 * h / 3, W, h / 3 + 1)
  let m = a.createLinearGradient(0, 0, W, 0); m.addColorStop(0.4, '#000'); m.addColorStop(0.6, 'rgba(0,0,0,0)')
  a.globalCompositeOperation = 'destination-in'; a.fillStyle = m; a.fillRect(0, 0, W, h)
  // Japan across the right, fading in over the same stretch
  const jp = document.createElement('canvas'); jp.width = W; jp.height = h
  const b = jp.getContext('2d')
  b.fillStyle = 'rgba(255,255,255,0.62)'; b.fillRect(0, 0, W, h); b.fillStyle = '#BC002D'; b.beginPath(); b.arc(W * 0.75, h / 2, 0.3 * H, 0, Math.PI * 2); b.fill()
  m = b.createLinearGradient(0, 0, W, 0); m.addColorStop(0.4, 'rgba(0,0,0,0)'); m.addColorStop(0.6, '#000')
  b.globalCompositeOperation = 'destination-in'; b.fillStyle = m; b.fillRect(0, 0, W, h)
  g.drawImage(lt, 0, 0); g.drawImage(jp, 0, 0)
  return c
}
function draw(t) {
  const c = cv.value; if (!c) return
  cloth ||= makeCloth()
  const g = c.getContext('2d')
  g.clearRect(0, 0, W, H)
  for (let x = 0; x < W; x += 2) {
    const ph = x * 0.00625 - t * 1.5, ph2 = x * 0.0155 - t * 2.3 + 1.0
    const y = 18 * Math.sin(ph) + 8 * Math.sin(ph2), slope = Math.cos(ph) + 0.6 * Math.cos(ph2)
    g.drawImage(cloth, x, 0, 2, H + 2 * OVER, x, y - OVER, 2, H + 2 * OVER)
    // the fold: its far side in shade, its near side lit
    if (slope < 0) { g.fillStyle = `rgba(0,0,0,${(-0.2 * slope).toFixed(3)})`; g.fillRect(x, 0, 2, H) } else { g.fillStyle = `rgba(255,255,255,${(0.07 * slope).toFixed(3)})`; g.fillRect(x, 0, 2, H) }
  }
}
let t0 = 0
function frame(now) { draw((now - t0) / 1000); raf = requestAnimationFrame(frame) }
function wave(on) { cancelAnimationFrame(raf); raf = 0; if (on) { t0 ||= performance.now(); raf = requestAnimationFrame(frame) } }
const layout = () => root.value?.closest('.slidev-layout')
function check() {
  if (!video) { video = (root.value?.closest('.slidev-page') || root.value?.parentElement)?.querySelector('.video-player video') || null; if (!video) return }
  if (video.ended || video.currentTime >= props.at) up.value = true
}
function stop() { clearInterval(timer); clearTimeout(timer); timer = null }
watch([active, live], ([a, l]) => {
  stop()
  if (!l) return
  up.value = false; video = null
  if (!a) return
  if (props.at == null) timer = setTimeout(() => { up.value = true }, 300)
  else timer = setInterval(check, 100)
}, { immediate: true })
const shown = computed(() => !live.value || up.value)
watch([shown, active, live], ([s, a, l]) => {
  wave(s && a && l)
  layout()?.classList.toggle('flags-up', !!(s && a && l))
}, { flush: 'post' })
onMounted(() => { draw(0); if (shown.value && active.value && live.value) { wave(true); layout()?.classList.add('flags-up') } })
onBeforeUnmount(() => { stop(); wave(false) })
</script>

<template>
  <div ref="root" class="flags-behind" :class="{ on: shown }" aria-hidden="true"><canvas ref="cv" width="1960" height="1104" /></div>
</template>

<style>
.slidev-layout .flags-behind { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity 3s ease; mix-blend-mode: screen;
  /* 13 Nov (the owner: "this we have to rethink... maybe don't blur the pentaquark"): the pentaquark stays sharp and the
     cloth is held back where it stands (a third of its light in the middle), full only round it, soft at the frame's edge */
  -webkit-mask-image: radial-gradient(ellipse 78% 82% at 50% 47%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.62) 24%, #000 46%, #000 80%, transparent 100%); mask-image: radial-gradient(ellipse 84% 88% at 50% 47%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.62) 24%, #000 46%, #000 80%, transparent 100%); }
.slidev-layout .flags-behind.on { opacity: 0.46; }
.slidev-layout .flags-behind canvas { display: block; width: 100%; height: 100%; }
@media print { .slidev-layout .flags-behind { opacity: 0.46; } }
</style>
