<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { soundLevel, onSoundLevel, musicKeys } from './soundLevel.js'

// Innoday's component (23 Oct): here the music of the owner's SpaceEngine zoom (public/audio/zoom_music.m4a, the
// edit's own track, -16 LUFS) across the histogram slides, 11 and 12 (owner, 23 Oct: "Need this soundtrack spanning
// the histogram slides"): `start` on 11, low under the speech. Innoday's notes follow.
// <Soundtrack :level="0.3" start />, on each of the close's slides (owner, 20 Oct: "Will
// need some crazy inspirational soundtrack for the last three slides spanning - maybe
// scott buckley"): one piece across them, Scott Buckley's „Starfire“ (CC BY 4.0, credited
// on the page after „Ačiū“), in two files cut from the same master at the same gain
// (public/audio, -0,5 dB from the master): the track's 0:30 to its end, 5:41 (`src`), and its
// 1:19 to its end (`tail`, the cut's 49 s on): the music goes on under the questions for
// about four minutes and ends with the track (owner, 21 Oct: "sountrack has to continue"). `start` (the hall photo) starts `src` from its top on a forward arrival;
// `level` is its volume on the slide (low under the speech, full on „Ačiū“); `resync`
// (on „Ačiū“): while `src` is still before the cut's 49 s, it cross-fades to `tail` from
// its top, so the music's arrival (the track's 1:37) lands on the eye-level view about
// 18 s in; opened there with nothing playing (a reload, a jump) it starts `tail`. Two
// files, not a seek: a server without byte ranges (the venue zip's python http.server)
// cannot seek, and a seek there restarts the piece. Levels and fades go through Web
// Audio gain where it exists (iOS ignores an element's volume). Going to a slide without
// a <Soundtrack> fades it out. Only the audience's window plays it. `+` / `-` scale every
// level (setup/soundLevel.js).
// `drop` (the recorded close; owner, 22 Oct, "Go ahead and do it": the word on Starfire's
// peak, the music falling away for a moment before it): { at, file, hit, duck, quiet }, timed
// off the slide's clip. At `duck` s of the clip the music falls to `quiet` of its level; `file`
// (the track from `hit` s before its peak, the 2:54,85 downbeat after the drum fill) starts
// that quiet so its peak lands at `at` s of the clip (the „Ačiū“ collision's crossing), the
// clip's rate nudged (at most ±10 %) to stay on the music meanwhile; on the peak the level
// opens again, on the music's own clock. A third file, not a seek (see `resync`).
const props = defineProps({
  src: { type: String, default: 'audio/zoom_music.m4a' },
  tail: { type: String, default: 'audio/zoom_music.m4a' },
  tailAt: { type: Number, default: 49 },
  level: { type: Number, default: 0.9 },
  start: { type: Boolean, default: false },
  resync: { type: Boolean, default: false },
  keys: { type: Boolean, default: false },   // + and - are the music's here, even over a clip (soundLevel.js)
  drop: { type: Object, default: null },
})
const { $renderContext, $page } = useSlideContext()
const nav = useNav()
const page = () => $page?.value ?? $page
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : import.meta.env.BASE_URL + p
if (props.keys) musicKeys(page())

// one player for the deck (a window): the elements by source, each with its gain
const G = (globalThis.__innodaySound ||= { tracks: new Map(), cur: null, pages: new Map(), prev: null, ctx: null, pending: null })
function track(src) {
  let t = G.tracks.get(src)
  if (!t) {
    const e = new Audio(url(src)); e.preload = 'auto'; e.load()
    t = { e, gain: null, level: 1, raf: 0 }
    G.tracks.set(src, t)
  }
  // through Web Audio once there is a context (made on the first arrival, after a press)
  if (!t.gain && G.ctx) {
    try { const g = G.ctx.createGain(); G.ctx.createMediaElementSource(t.e).connect(g); g.connect(G.ctx.destination); t.gain = g; t.e.volume = 1 } catch {}
  }
  return t
}
// `level` as written; what sounds is it times the presenter's `+` / `-` (soundLevel)
const set = (t, v) => { t.level = v; const w = v * soundLevel(); if (t.gain) t.gain.gain.value = w; else t.e.volume = Math.max(0, Math.min(1, w)) }
function ramp(t, to, ms, then) {
  cancelAnimationFrame(t.raf)
  const from = t.level, t0 = performance.now()
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms)
    set(t, from + (to - from) * Math.sin(k * Math.PI / 2))   // equal power: a cross-fade keeps its loudness
    if (k < 1) t.raf = requestAnimationFrame(step)
    else { t.raf = 0; then?.() }
  }
  t.raf = requestAnimationFrame(step)
}
const playing = () => G.cur && !G.cur.e.paused && !G.cur.e.ended
function play(t) {
  t.e.play().catch((err) => {
    // no press yet in this window: try again on the next one
    console.warn('Soundtrack:', err?.message)
    G.pending = () => t.e.play().catch(() => {})
  })
}
function begin(src, level) {
  const t = track(src)
  if (G.cur && G.cur !== t) { const old = G.cur; ramp(old, 0, 1500, () => old.e.pause()) }
  G.cur = t; t.e.currentTime = 0; set(t, 0); play(t); ramp(t, level, 2000)
}
function arrive() {
  if (!live()) return
  if (!G.ctx && (globalThis.AudioContext || globalThis.webkitAudioContext)) {
    try { G.ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)() } catch {}
  }
  G.ctx?.state === 'suspended' && G.ctx.resume().catch(() => {})
  const forward = G.prev == null || G.prev < page()
  if (props.start && !playing() && forward) return begin(props.src, props.level)
  if (props.resync) {
    if (!playing()) return begin(props.tail, props.level)               // opened here: the build onward
    if (G.cur === track(props.src) && G.cur.e.currentTime < props.tailAt) {
      const old = G.cur, t = track(props.tail)
      G.cur = t; t.e.currentTime = 0; set(t, 0); play(t)
      ramp(old, 0, 1500, () => old.e.pause()); ramp(t, props.level, 1500)
      return
    }
  }
  if (playing()) ramp(G.cur, props.level, 1200)
}
onSlideEnter(() => { arrive(); if (props.drop && live()) startDrop() })

// the drop: watched each frame from the clip's time (see `drop`)
const root = ref(null)
let dropRaf = 0, dropVideo = null
function endDrop() {
  cancelAnimationFrame(dropRaf); dropRaf = 0
  if (dropVideo) { try { dropVideo.playbackRate = 1 } catch {} }
  dropVideo = null
}
function startDrop() {
  endDrop()
  const d = props.drop, me = page()
  const peak = track(d.file)
  let phase = 0
  const tick = () => {
    if (nav.currentSlideNo?.value !== me) return endDrop()
    dropVideo ||= root.value?.closest('.slidev-page')?.querySelector('.video-player video') || null
    const v = dropVideo
    if (v && !v.paused) {
      const V = v.currentTime
      if (phase === 0 && V >= d.duck && V < d.at) { if (G.cur) ramp(G.cur, props.level * d.quiet, 1000); phase = 1 }
      if (phase <= 1 && V >= d.at - d.hit && V < d.at) {
        const old = G.cur
        G.cur = peak; peak.e.currentTime = 0; cancelAnimationFrame(peak.raf); peak.raf = 0; set(peak, props.level * d.quiet); play(peak)
        if (old && old !== peak) { cancelAnimationFrame(old.raf); ramp(old, 0, 250, () => old.e.pause()) }
        phase = 2
      }
      if (phase === 2 && !peak.e.paused && peak.e.currentTime > 0) {
        const a = peak.e.currentTime, left = d.hit - a
        // the clip where the music is: ahead, it slows; behind, it hurries
        const err = V - (d.at - d.hit + a)
        v.playbackRate = Math.min(1.1, Math.max(0.9, 1 - err * 1.5))
        if (left < 0.25) {
          const g = peak.gain?.gain
          if (g && G.ctx) {
            const now = G.ctx.currentTime
            g.cancelScheduledValues(now); g.setValueAtTime(g.value, now)
            g.setValueAtTime(props.level * soundLevel(), now + Math.max(0, left))
            peak.level = props.level
          } else setTimeout(() => set(peak, props.level), Math.max(0, left) * 1000)
          v.playbackRate = 1
          phase = 3
        }
      }
    }
    if (phase < 3) dropRaf = requestAnimationFrame(tick)
    else dropVideo = null
  }
  dropRaf = requestAnimationFrame(tick)
}
onSlideLeave(() => endDrop())
onUnmounted(() => endDrop())
// a `+` / `-` (this window's or the presenter's): every track at its level times the new one
if (!G.level) G.level = onSoundLevel(() => { for (const t of G.tracks.values()) if (!t.raf) set(t, t.level) })
// the pages that have a live <Soundtrack>, counted (the overview's copies never count)
let mine = null
onMounted(() => {
  if ($renderContext?.value !== 'slide') return
  mine = page(); G.pages.set(mine, (G.pages.get(mine) || 0) + 1)
})
onUnmounted(() => {
  if (mine == null) return
  const c = (G.pages.get(mine) || 1) - 1
  if (c > 0) G.pages.set(mine, c); else G.pages.delete(mine)
})
// leaving the close's slides fades the music out; the first live instance watches
let stop = null
onMounted(() => {
  if ($renderContext?.value !== 'slide' || G.watching) return
  G.watching = true
  const onPress = () => { const p = G.pending; G.pending = null; p?.() }
  window.addEventListener('keydown', onPress); window.addEventListener('pointerdown', onPress)
  const off = watch(() => nav.currentSlideNo?.value, (n, old) => {
    G.prev = old ?? null
    if (!G.pages.has(n) && playing()) { const t = G.cur; ramp(t, 0, 1500, () => t.e.pause()) }
  })
  stop = () => { off(); window.removeEventListener('keydown', onPress); window.removeEventListener('pointerdown', onPress); G.watching = false }
})
onUnmounted(() => stop?.())
</script>

<template><span ref="root" class="soundtrack" aria-hidden="true" /></template>
