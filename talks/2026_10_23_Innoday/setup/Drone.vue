<script setup>
import { onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { soundLevel, onSoundLevel } from './soundLevel.js'

// <Drone :level="0.22" :swell="14" />: a deep, slowly moving hum under a slide (owner, 21 Oct,
// slide 27: "needs some deep cool hum sounds or something"). Synthesised here, nothing to
// licence: a low E (41, 82, 123, 165 Hz; the lowest for a hall's subwoofer, the rest for
// projector speakers), one steady oscillator a partial, through a fixed low-pass, and a little
// filtered noise for air (a 20 s bed, so no loop is heard). Constant (owner, 22 Oct: "a bit
// weird, repeating / pulsating.. can we just have more constant one": the detuned pairs' beat,
// the breathing filter and the swell are gone). It fades in over `fadeIn` s and out over
// `fadeOut` s when the slide is left; `swell` (s, 0: none) raises it by a third once.
// Only the audience's window sounds (the presenter's views mount the slide too); a page
// without a press yet stays silent (the browser's rule) and starts on the next arrival.
// `+` / `-` scale it (setup/soundLevel.js), through one gain after every voice.
const props = defineProps({
  level: { type: Number, default: 0.22 },
  fadeIn: { type: Number, default: 3 },
  fadeOut: { type: Number, default: 1.5 },
  swell: { type: Number, default: 0 },
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
  if (props.swell > 0) {
    out.gain.setValueAtTime(props.level, t + Math.max(props.fadeIn, props.swell))
    out.gain.linearRampToValueAtTime(props.level * 1.33, t + Math.max(props.fadeIn, props.swell) + 3)
  }
  out.connect(master(ctx))
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 0.7
  lp.connect(out)
  const nodes = []
  for (const [f, g, type] of [[41.2, 0.5, 'sine'], [82.4, 0.32, 'triangle'], [123.5, 0.12, 'triangle'], [164.8, 0.06, 'sine']]) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = f
    const v = ctx.createGain(); v.gain.value = g
    o.connect(v); v.connect(lp); nodes.push(o)
  }
  // air: pink-ish noise through a narrow band round 220 Hz, very low
  const n = ctx.createBuffer(1, ctx.sampleRate * 20, ctx.sampleRate), d = n.getChannelData(0)
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
