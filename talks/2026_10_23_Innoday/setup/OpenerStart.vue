<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

// <OpenerStart poster="video-frames/<clip>.poster.jpg" />, beside the
// <VideoPlayer> of the deck's first slide. The deck has no cover (owner,
// 2026-10-10): it opens on the zoom-out. A browser plays sound only after a key
// press or a click on the page, and Chrome pauses a clip that a script unmutes
// before one ("Unmuting failed…"), so opened cold the opener stopped on its
// first frame and the first → skipped it. From a cold open, until the first
// press: the clip's first frame stands here at once (the poster, while the clip
// buffers), the clip is held at 0, and the first press (→, space, PageDown,
// ↓, p or a click) plays it with sound instead of moving on. The stage's audio
// unlock still hears that press. Reached later, or in print, it does nothing.
const props = defineProps({ poster: { type: String, required: true } })
const { $page, $renderContext } = useSlideContext()
const { currentPage, isPrintMode } = useNav()
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : import.meta.env.BASE_URL + p

const START_KEYS = new Set([' ', 'ArrowRight', 'ArrowDown', 'PageDown', 'p', 'P'])
const root = ref(null)
const posterOn = ref(false)
let armed = false
let video = null

const findVideo = () => video || (video = root.value?.closest('.slidev-page')?.querySelector('.video-player video') || null)

// before the first press the clip may start muted on its own: hold it at 0
// (a task later, so the player's own play() settles first)
function hold() {
  if (!armed) { posterOn.value = false; return }
  setTimeout(() => { if (armed && video) { video.pause(); try { video.currentTime = 0 } catch {} } }, 0)
}

function start() {
  armed = false
  removeGate()
  const v = findVideo()
  if (!v) { posterOn.value = false; return }
  try { if (v.currentTime > 0.01) v.currentTime = 0 } catch {}
  v.muted = false
  v.play().catch(() => {})
}

function onKey(e) {
  if (!armed || e.metaKey || e.ctrlKey || e.altKey || !START_KEYS.has(e.key)) return
  if ($page.value !== currentPage.value) return
  // the press starts the clip; Slidev and the player's own `p` never see it
  e.preventDefault()
  e.stopImmediatePropagation()
  start()
  // the stage unlocks its audio on the first key or pointer press: this one
  // was taken, so it hears a pointer press instead (still inside the gesture)
  window.dispatchEvent(new Event('pointerdown'))
}
function onPointer() {
  if (armed && $page.value === currentPage.value) start()
}
function removeGate() {
  window.removeEventListener('keydown', onKey, true)
  window.removeEventListener('pointerdown', onPointer, true)
}

onMounted(() => {
  if ($renderContext.value !== 'slide' || isPrintMode.value || $page.value !== currentPage.value) return
  armed = true
  posterOn.value = true
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('pointerdown', onPointer, true)
  // the player's <video> is a sibling: look for it until it is there
  let tries = 0
  const watchVideo = () => {
    const v = findVideo()
    if (v) { v.addEventListener('playing', hold); if (!v.paused) hold(); return }
    if (armed && ++tries < 120) requestAnimationFrame(watchVideo)
  }
  watchVideo()
})
onUnmounted(() => {
  removeGate()
  video?.removeEventListener('playing', hold)
})
</script>

<template>
  <div ref="root" class="opener-start">
    <img v-if="posterOn" class="opener-poster" :src="url(props.poster)" alt="" decoding="async" fetchpriority="high" />
  </div>
</template>

<style>
.opener-start { position: absolute; inset: 0; pointer-events: none; }
.opener-poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
