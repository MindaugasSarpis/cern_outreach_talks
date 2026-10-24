<script setup>
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { onUnmounted, watch } from 'vue'
import { bus } from '../components/lhc-opening/bus.js'
import { fillShare } from './grains.js'
import { soundLevel } from './soundLevel.js'

// <DataSfx />, the data slide's sound (the owner, 24 Oct: "can have some audio effects on slide
// 10"), synthesised with Web Audio over Starfire's bed (no files). The collision's own approach,
// thump and drone are the shared opening's (space.json `inside`, its `sound` on since 24 Oct);
// this adds what follows it:
//   the crossings  from the detector's cascade on (its `after`, 7 world-s past the crossing; here
//                  5,4 s after the fly-out), soft low pulses on the detector's side (left), coming
//                  as the cascade's fronts do, 0,35 e^(0,28 t) a second, until they merge into a
//                  quiet band of noise: the 40 MHz glow; it lets go on the click;
//   the data       each grain landing in its bin a tiny high click, panned toward the plot
//                  (right) and timed `fall` after its release (the plot's fill share, polled
//                  every frame), so the patter is fast at first and thins as the shape fills;
//   the click      the five peaks' ticks as five glassy notes of B minor pentatonic (Starfire is in
//                  B minor), low to high, and as the Ωc⁰ gathers, a soft swell on B1 rising to F#2.
// Levels sit under the bed; `+` / `-` scale them with the music. Only the audience's window plays.
const props = defineProps({
  plot: { type: String, default: 'oc' },
  collision: { type: String, default: 'inside' },
  fall: { type: Number, default: 1.8 },        // the plot's `fall`: release to landing
  grains: { type: Number, default: 700 },      // clicks over a whole fill (a sample of the grains)
  level: { type: Number, default: 0.5 },
  cascadeAfter: { type: Number, default: 5.4 }, // s after the fly-out
  marks: { type: Number, default: 1 },         // the click that marks the peaks
})
const { $renderContext, $page, $clicks } = useSlideContext()
const nav = useNav()
const page = () => $page?.value ?? $page
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value && !/presenter/.test(location.hash + location.pathname)

let ac = null, out = null, noiseBuf = null
function audio() {
  const G = globalThis.__innodaySound
  if (!ac) {
    ac = G?.ctx || (() => { try { return new (globalThis.AudioContext || globalThis.webkitAudioContext)() } catch { return null } })()
    if (!ac) return null
    const n = ac.sampleRate, b = ac.createBuffer(1, n, n), d = b.getChannelData(0)
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1
    noiseBuf = b
  }
  if (ac.state === 'suspended') ac.resume().catch(() => {})
  return ac
}
function bus0() {
  const a = audio(); if (!a) return null
  out = a.createGain(); out.gain.value = props.level * soundLevel()
  const comp = a.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3
  out.connect(comp).connect(a.destination)
  return out
}
const pan = (a, x) => { const p = a.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, x)); return p }
function click(t, { f = 4000, q = 1.2, dur = 0.012, gain = 0.12, x = 0 } = {}) {
  if (!out) return
  const s = ac.createBufferSource(); s.buffer = noiseBuf
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  s.connect(bp).connect(g).connect(pan(ac, x)).connect(out)
  s.start(t, Math.random() * 0.9); s.stop(t + dur + 0.02)
}
function pulse(t, x) {
  // a low, soft pulse: a short sine drop with a touch of noise
  const o = ac.createOscillator(); o.type = 'sine'
  o.frequency.setValueAtTime(180 + 60 * Math.random(), t); o.frequency.exponentialRampToValueAtTime(70, t + 0.12)
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
  o.connect(g).connect(pan(ac, x)).connect(out); o.start(t); o.stop(t + 0.2)
  click(t, { f: 900, q: 0.9, dur: 0.03, gain: 0.05, x })
}
function bell(t, f, x, gain = 0.09) {
  for (const [m, k] of [[1, 1], [2.76, 0.25], [5.4, 0.08]]) {
    const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f * m
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain * k, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6 / m)
    o.connect(g).connect(pan(ac, x)).connect(out); o.start(t); o.stop(t + 1.7)
  }
}
function swell(t) {
  const o = ac.createOscillator(); o.type = 'sine'
  o.frequency.setValueAtTime(61.74, t); o.frequency.exponentialRampToValueAtTime(92.5, t + 1.6)
  const o2 = ac.createOscillator(); o2.type = 'triangle'
  o2.frequency.setValueAtTime(123.5, t); o2.frequency.exponentialRampToValueAtTime(185, t + 1.6)
  const g2 = ac.createGain(); g2.gain.value = 0.25
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
  o.connect(g); o2.connect(g2).connect(g); g.connect(pan(ac, 0.45)).connect(out)
  o.start(t); o2.start(t); o.stop(t + 3.3); o2.stop(t + 3.3)
}

let raf = 0, timers = [], offs = [], hiss = null, lastShare = null, owed = 0
function stopAll(fade = 0.8) {
  cancelAnimationFrame(raf); raf = 0
  for (const t of timers) clearTimeout(t); timers = []
  for (const f of offs) f(); offs = []
  if (out && ac) {
    const o = out, t = ac.currentTime
    o.gain.cancelScheduledValues(t); o.gain.setValueAtTime(o.gain.value, t); o.gain.linearRampToValueAtTime(0.0001, t + fade)
    setTimeout(() => { try { o.disconnect() } catch {} }, (fade + 0.3) * 1000)
  }
  out = null; hiss = null; lastShare = null; owed = 0
}
function cascade() {
  if (!out) return
  // the fronts: f(t) = 0.35 e^(0.28 t) a second, pulses until 30 a second, then the glow's band
  const t0 = ac.currentTime + 0.05
  let N = 0, t = 0
  const rate = (s) => 0.35 * Math.exp(0.28 * s)
  while (rate(t) < 30 && t < 30) {
    N += 1
    t = Math.log(1 + N * 0.28 / 0.35) / 0.28            // the N-th front's time
    pulse(t0 + t + (Math.random() - 0.5) * 0.04, -0.75 + 0.35 * Math.random())
  }
  const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.8
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.setValueAtTime(0.0001, t0 + t - 4); g.gain.exponentialRampToValueAtTime(0.07, t0 + t + 1.5)
  s.connect(bp).connect(lp).connect(g).connect(pan(ac, -0.55)).connect(out)
  s.start(t0)
  hiss = { s, g }
}
function letGo() {
  if (!hiss || !ac) return
  const t = ac.currentTime, { s, g } = hiss; hiss = null
  g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5)
  s.stop(t + 2.6)
}
function poll() {
  const me = page()
  const step = () => {
    if (nav.currentSlideNo?.value !== me || !out) return
    const sh = fillShare(props.plot)
    if (sh != null) {
      if (lastShare != null && sh > lastShare) {
        owed += (sh - lastShare) * props.grains
        const now = ac.currentTime
        while (owed >= 1) {
          owed -= 1
          // a landing: high, short, toward the plot; a bin's place is not known here, so spread
          click(now + props.fall + Math.random() * 0.04, { f: 2600 + Math.random() * 3200, q: 2.5, dur: 0.009, gain: 0.05 + 0.05 * Math.random(), x: 0.25 + 0.65 * Math.random() })
        }
      }
      lastShare = sh
    }
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}
function start() {
  stopAll(0.1)
  if (!live() || !bus0()) return
  offs.push(bus.on('flyout', (e) => { if (e.name === props.collision) timers.push(setTimeout(cascade, props.cascadeAfter * 1000)) }))
  poll()
}
watch($clicks, (c, was) => {
  if (!live() || nav.currentSlideNo?.value !== page() || !out) return
  if (c >= props.marks && was < props.marks) {
    letGo()
    const t = ac.currentTime
    // the ticks light 0,2 s after the click; B5 D6 E6 F#6 A6, low mass to high, left to right on the plot
    ;[987.8, 1174.7, 1318.5, 1480, 1760].forEach((f, i) => bell(t + 0.35 + i * 0.16, f, 0.1 + i * 0.18))
    swell(t + 2.4)
  } else if (c < props.marks && was >= props.marks) start()
})
onSlideEnter(() => start())
onSlideLeave(() => stopAll(1.2))
onUnmounted(() => stopAll(0.1))
</script>

<template><span class="data-sfx" aria-hidden="true" /></template>
