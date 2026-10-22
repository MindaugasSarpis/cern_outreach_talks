<script setup>
import { onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { soundLevel, onSoundLevel } from './soundLevel.js'

// <Drone :level="0.22" :swell="14" />: a deep, slowly moving hum under a slide (owner, 21 Oct,
// slide 27: "needs some deep cool hum sounds or something"). Synthesised here, nothing to
// licence: a low E (41, 82, 123, 165 Hz; the lowest for a hall's subwoofer, the rest for
// projector speakers), each partial a pair of slightly detuned oscillators, so it beats
// slowly, through a low-pass whose cut-off breathes (an 11 s cycle), and a little filtered
// noise for air. It fades in over `fadeIn` s, swells by a third from `swell` s (the FCC
// clip's end, under the question), and fades out over `fadeOut` s when the slide is left.
// Only the audience's window sounds (the presenter's views mount the slide too); a page
// without a press yet stays silent (the browser's rule) and starts on the next arrival.
// `+` / `-` scale it (setup/soundLevel.js), through one gain after every voice.
const props = defineProps({
  level: { type: Number, default: 0.22 },
  fadeIn: { type: Number, default: 3 },
  fadeOut: { type: Number, default: 1.5 },
  swell: { type: Number, default: 14 },
})
const { $renderContext } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value

const D = (globalThis.__innodayDrone ||= { ctx: null, master: null })
function master(ctx) {
  if (!D.master) {
    D.master = ctx.createGain(); D.master.gain.value = soundLevel(); D.master.connect(ctx.destination)
    onSoundLevel((v) => D.master.gain.setTargetAtTime(v, ctx.currentTime, 0.05))
  }
  return D.master
}
let voice = null

function start() {
  try { D.ctx ||= new (window.AudioContext || window.webkitAudioContext)() } catch { return }
  const ctx = D.ctx
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  stop(0.05)
  const t = ctx.currentTime
  const out = ctx.createGain(); out.gain.setValueAtTime(0, t)
  out.gain.linearRampToValueAtTime(props.level, t + props.fadeIn)
  out.gain.setValueAtTime(props.level, t + props.swell)
  out.gain.linearRampToValueAtTime(props.level * 1.33, t + props.swell + 3)
  out.connect(master(ctx))
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 0.7
  lp.connect(out)
  const lfo = ctx.createOscillator(); lfo.frequency.value = 1 / 11
  const depth = ctx.createGain(); depth.gain.value = 160
  lfo.connect(depth); depth.connect(lp.frequency)
  const nodes = [lfo]
  for (const [f, g, type] of [[41.2, 0.5, 'sine'], [82.4, 0.32, 'triangle'], [123.5, 0.12, 'triangle'], [164.8, 0.06, 'sine']]) {
    for (const det of [-0.35, 0.35]) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f + det   // ±0,35 Hz: a slow 0,7 Hz beat
      const v = ctx.createGain(); v.gain.value = g / 2
      o.connect(v); v.connect(lp); nodes.push(o)
    }
  }
  // air: pink-ish noise through a narrow band round 220 Hz, very low
  const n = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), d = n.getChannelData(0)
  let b = 0
  for (let i = 0; i < d.length; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 4 }
  const src = ctx.createBufferSource(); src.buffer = n; src.loop = true
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 220; bp.Q.value = 1.2
  const ng = ctx.createGain(); ng.gain.value = 0.05
  src.connect(bp); bp.connect(ng); ng.connect(lp); nodes.push(src)
  for (const o of nodes) o.start(t)
  voice = { out, nodes }
}
function stop(s = props.fadeOut) {
  const v = voice; voice = null
  if (!v || !D.ctx) return
  const t = D.ctx.currentTime
  v.out.gain.cancelScheduledValues(t)
  v.out.gain.setValueAtTime(v.out.gain.value, t)
  v.out.gain.linearRampToValueAtTime(0, t + s)
  for (const o of v.nodes) { try { o.stop(t + s + 0.1) } catch {} }
  setTimeout(() => { try { v.out.disconnect() } catch {} }, (s + 0.3) * 1000)
}
onSlideEnter(() => { if (live()) start() })
onSlideLeave(() => { if (live()) stop() })
onUnmounted(() => stop(0.2))
</script>

<template><span class="drone" aria-hidden="true" /></template>
