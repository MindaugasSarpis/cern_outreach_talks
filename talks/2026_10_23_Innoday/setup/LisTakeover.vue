<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { Vector3 } from 'three'
import { sampleFrame } from './takeover.js'
import { placeInDepth, loadDepth, makeLisGrains, scaleLaw } from './lisGrains.js'
import { setGrains } from './detector.js'
import { bus } from '../components/lhc-opening/bus.js'
import META from './data/lis.json'

// <LisTakeover />, on „Ačiū“, the slide after the light injection clip. It opens on
// the clip's last frame, the flag on the cold box, so nothing changes when the clip
// goes; under it the frame is already grains, each where its surface is in depth, at
// the cold box's place on a SciFi module of LHCb (lisGrains.js). The still fades
// into them, and the slide's path pulls the camera back out of the module end to
// the whole detector while the grains shrink to a mark; the detector lights up
// behind them (det: 1), then LHCb's collision in it (the `lhc-collision` named
// `collision`) and the slot (the word), each when the camera has come that far out,
// not on a timer: on a slow machine the world's clock runs behind the wall's.
// The slide's path[0] is the clip camera's view (hero/lis_pose.py prints it
// from lis.json, the anchor and d0). Printed, in the overview and without the
// world it is the still frame.
const props = defineProps({
  src: { type: String, default: 'figures/lis_last.jpg' },
  depth: { type: String, default: 'figures/lis_last.depth.png' },
  anchor: { type: Array, default: () => [3.975, -476.94, 0.96] },   // the flag's place: LHCb (0.8, 2.55, 7.95) m
  d0: { type: Number, default: 2.4 },      // the camera's start distance from the flag, stage units (path[0])
  sEnd: { type: Number, default: 2.5 },    // stage units a metre at the path's last key (the detector's own: 1.2 across)
  sFlag: { type: Number, default: 9 },     // … and the flag's, so it stays a mark (~0.4 units: about 20 px)
  grains: { type: Number, default: 160000 },
  hold: { type: Number, default: 400 },    // ms of still before the fade
  fade: { type: Number, default: 1400 },   // ms
  collision: { type: String, default: 'thanks' },
  detAt: { type: Number, default: 3.2 },   // the camera this far from the flag (units): the detector lights up
  colAt: { type: Number, default: 13 },    // … LHCb's collision starts in it
  wordAfter: { type: Number, default: 1.2 },   // s after the camera has stopped: the word
})
const { $renderContext, $page, $frontmatter } = useSlideContext()
const nav = useNav()
const base = import.meta.env.BASE_URL
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : base + p
const live = computed(() => $renderContext?.value === 'slide')
const still = ref(true)
const fading = ref(false)
const word = ref(false)

let sample = null, placed = null, run = 0, timers = [], watcher = 0
const ready = typeof Image === 'undefined' ? Promise.resolve(null) : (async () => {
  try {
    const img = new Image()
    img.src = url(props.src)
    await img.decode()
    const depth = await loadDepth(url(props.depth), META)
    return { img, depth }
  } catch (e) { console.warn('LisTakeover:', e); return null }
})()

function stage() {
  const rootEl = document.querySelector('.stage')
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera }
}
async function waitStage(id) {
  for (let i = 0; i < 80; i++) {
    const s = stage()
    if (s || id !== run) return s
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}
const later = (ms, fn) => timers.push(setTimeout(fn, ms))
const clear = () => { timers.forEach(clearTimeout); timers = []; clearInterval(watcher); watcher = 0 }

const A = new Vector3(...props.anchor)
const s0 = props.d0 / META.flagDist
// where the camera stands at the path's last key (the stage's pose: at + dist·(sin yaw cos
// pitch, sin pitch, cos yaw cos pitch)), for the scale law's end
function endOfPath() {
  const sp = $frontmatter?.value?.space ?? $frontmatter?.space
  const k = sp?.path?.[sp.path.length - 1]?.[1]
  if (!k || !Array.isArray(k.at)) return new Vector3(-3.7, -474.3, 18.6)
  const r = Math.PI / 180, y = (k.yaw ?? 0) * r, p = (k.pitch ?? 0) * r, d = k.dist ?? 20
  return new Vector3(k.at[0] + d * Math.sin(y) * Math.cos(p), k.at[1] + d * Math.sin(p), k.at[2] + d * Math.cos(y) * Math.cos(p))
}
const law = scaleLaw({ s0, d0: props.d0, sEnd: props.sEnd, dEnd: endOfPath().distanceTo(A) })

async function takeOver() {
  const id = ++run
  clear()
  still.value = true; fading.value = false; word.value = false
  setGrains('det', 0)
  const s = await waitStage(id)
  const got = await ready
  if (id !== run || !s || !got || !live.value) return
  // the dim metal around the flag (under ~30 of 255) gives no grains: it read as static
  sample ||= sampleFrame(got.img, { n: props.grains, gamma: 1.15, floor: 0.12, sat: 1.15 })
  placed ||= placeInDepth(sample, got.depth, META)
  let pts = s.h.scene.getObjectByName('lis-grains')
  if (!pts) { pts = makeLisGrains(sample, placed, { s0 }); s.h.scene.add(pts) }
  const u = pts.material.uniforms
  u.uAnchor.value.copy(A); u.uScale.value = s0; u.uReveal.value = 0; u.uFade.value = 1
  pts.visible = true
  // the form follows the camera every frame: its scale from the camera's distance
  pts.userData.scale = (cam, un) => {
    const sc = law(cam.position.distanceTo(A))
    un.uScale.value = sc
    un.uScaleFlag.value = Math.max(sc, props.sFlag)
    un.uRest.value = Math.min(1, Math.max(0, (sc - props.sFlag * 0.5) / (props.sFlag * 1.2)))
  }
  later(props.hold, () => {
    if (id !== run) return
    fading.value = true
    const t0 = performance.now()
    const step = (now) => {
      if (id !== run) return
      const k = Math.min(1, (now - t0) / props.fade)
      u.uReveal.value = k
      if (k < 1) requestAnimationFrame(step)
      else still.value = false
    }
    requestAnimationFrame(step)
  })
  // the detector, the collision and the word follow the camera out
  let det = false, col = false, stopped = -1
  watcher = setInterval(() => {
    if (id !== run) return
    const d = s.camera.position.distanceTo(A)
    if (!det && d > props.detAt) { det = true; setGrains('det', 1) }
    if (!col && d > props.colAt) { col = true; bus.set(props.collision, 1) }
    if (col && stopped < 0 && !s.api.flying) stopped = performance.now()
    if (stopped >= 0 && performance.now() - stopped > props.wordAfter * 1000) { word.value = true; clearInterval(watcher); watcher = 0 }
  }, 100)
}

onSlideEnter(() => { if (live.value) takeOver() })
onSlideLeave(() => {
  run++; clear(); still.value = true; fading.value = false; word.value = false
  bus.set(props.collision, 0); bus.emit('stop', { name: props.collision })
})
const onRebuilt = () => { if (live.value && nav.currentSlideNo?.value === ($page?.value ?? $page)) takeOver() }
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  // opened at this slide (a reload, or the deck started here): no slide-enter comes
  if (live.value && nav.currentSlideNo?.value === ($page?.value ?? $page)) takeOver()
})
onUnmounted(() => { window.removeEventListener('slidev-stage:rebuilt', onRebuilt); run++; clear() })
// the grains are drawn here and on the credits page after it, hidden everywhere else
watch(() => nav.currentSlideNo?.value, (n) => {
  const at = $page?.value ?? $page
  const p = stage()?.h.scene.getObjectByName('lis-grains')
  if (p && (live.value || n !== at)) p.visible = n === at || n === at + 1
}, { immediate: true })
</script>

<template>
  <div class="lis-takeover">
    <img v-if="still" class="lis-still" :class="{ fading }" :src="url(src)" :style="{ transitionDuration: fade + 'ms' }"
      alt="Šviesos įvedimo sistema SciFi modulio gale; ant šaltosios dėžės išgraviruota Lietuvos vėliava" />
  </div>
  <div class="lis-word" :class="{ on: word || !live }"><slot /></div>
</template>

<style>
.lis-takeover { position: absolute; inset: 0; pointer-events: none; }
.lis-takeover .lis-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; transition-property: opacity; transition-timing-function: ease-in; }
.lis-takeover .lis-still.fading { opacity: 0; }
html.print .lis-takeover .lis-still { opacity: 1; }
.lis-word { opacity: 0; transition: opacity 0.8s ease; }
.lis-word.on, html.print .lis-word { opacity: 1; }
</style>
