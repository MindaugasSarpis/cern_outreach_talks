<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { onSlideEnter, useSlideContext, useNav } from '@slidev/client'

// <Soundtrack src="audio/starfire_close.m4a" :level="0.3" start />, on each of the close's
// slides (owner, 20 Oct: "Will need some crazy inspirational soundtrack for the last
// three slides spanning - maybe scott buckley"): one track across them, Scott Buckley's
// „Starfire“ (CC BY 4.0, credited on the page after „Ačiū“), cut from 0:30 to 2:25 of the
// track with its fade baked in (public/audio, -16 LUFS). `start` (the hall photo) starts
// it from its top if it is not playing; `level` is its volume on the slide (low under
// the speech, full on „Ačiū“); `resync` (s in the cut): on arriving, a cut still before
// it cross-fades to it, so the music's arrival (the cut's 67 s, the track's 1:37) lands
// on the eye-level view, about 18 s into „Ačiū“. Going to a slide without a
// <Soundtrack> lets it fade out. Only the audience's window plays it (not the
// presenter's previews, the overview or print). A press unlocks audio long before.
const props = defineProps({
  src: { type: String, default: 'audio/starfire_close.m4a' },
  level: { type: Number, default: 0.9 },
  start: { type: Boolean, default: false },
  resync: { type: Number, default: -1 },
})
const { $renderContext, $page } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : import.meta.env.BASE_URL + p

// one player for the whole deck: two elements of the track, both loading from the start,
// so a resync can cross-fade from one to the other
const G = (globalThis.__innodaySound ||= { els: [], cur: null, pages: new Set(), ramps: new Map() })
function pair(src) {
  while (G.els.filter((x) => x.dataset.src === src).length < 2) {
    const e = new Audio(url(src)); e.dataset.src = src; e.preload = 'auto'; e.load(); G.els.push(e)
  }
  return G.els.filter((x) => x.dataset.src === src)
}
// a position set before the file's metadata is in does not hold: wait for it
function seek(e, t) {
  if (e.readyState >= 1) e.currentTime = t
  else e.addEventListener('loadedmetadata', () => { e.currentTime = t }, { once: true })
}
function ramp(e, to, ms, then) {
  cancelAnimationFrame(G.ramps.get(e) || 0)
  const from = e.volume, t0 = performance.now()
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms)
    // equal power: a cross-fade keeps its loudness
    e.volume = Math.max(0, Math.min(1, from + (to - from) * Math.sin(k * Math.PI / 2)))
    if (k < 1) G.ramps.set(e, requestAnimationFrame(step))
    else { G.ramps.delete(e); then?.() }
  }
  G.ramps.set(e, requestAnimationFrame(step))
}
const playing = () => G.cur && !G.cur.paused && !G.cur.ended
function arrive() {
  if (!live()) return
  if (props.start && !playing()) {
    const [a] = pair(props.src)
    const e = G.cur && G.cur.dataset.src === props.src ? G.cur : a
    G.cur = e; seek(e, 0); e.volume = 0
    e.play().catch((err) => console.warn('Soundtrack:', err?.message))
    ramp(e, props.level, 2000)
    return
  }
  if (!playing()) return
  if (props.resync >= 0 && G.cur.currentTime < props.resync) {
    const old = G.cur, next = pair(props.src).find((x) => x !== old)
    seek(next, props.resync); next.volume = 0
    next.play().catch((err) => console.warn('Soundtrack:', err?.message))
    G.cur = next
    ramp(old, 0, 1500, () => old.pause())
    ramp(next, props.level, 1500)
    return
  }
  ramp(G.cur, props.level, 1200)
}
onSlideEnter(arrive)
onMounted(() => { if ($renderContext?.value === 'slide') G.pages.add($page?.value ?? $page) })
onUnmounted(() => G.pages.delete($page?.value ?? $page))
// leaving the close's slides: the music fades out (only the first mounted instance watches)
let watcher = null
onMounted(() => {
  if ($renderContext?.value !== 'slide' || G.watching) return
  G.watching = true
  watcher = watch(() => nav.currentSlideNo?.value, (n) => {
    if (!G.pages.has(n) && playing()) { const e = G.cur; ramp(e, 0, 1500, () => e.pause()) }
  })
})
onUnmounted(() => { if (watcher) { watcher(); G.watching = false } })
</script>

<template><span class="soundtrack" aria-hidden="true" /></template>
