<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { setGrains } from './grains.js'
import { bus } from '../components/lhc-opening/bus.js'

// <InsideLhcb />, slide 9: LHCb 100 m down, after its clip. Innoday's „Ačiū“ cut to what
// this talk needs (its <LisTakeover> without the light injection still and the emblems):
// on arrival the detector's model comes in with its floor and cradles (`det`: 1), while the
// slide's path cranes the camera down from above to the cavern floor, eye level beside the
// 1,83 m person; once the camera has come down, LHCb's own 2012 collision (`inside`, the
// shared lhc-opening's LHCb event) starts in it, the world nearly stops as the bunches
// cross, the debris lights each part it reaches, and the crossings that follow merge into
// the 40 MHz glow (the detector's `cascade`). The collision waits for the camera, not a
// timer: on a slow machine the world's clock runs behind the wall's. Without a world, in
// print and in the previews nothing runs; the readouts stay.
// Since 24 Oct the data slide's too (the owner: "the detector besides showing we are taking
// data and a single histogram with peaks built up"): the camera is already there, so
// `land-y` above it starts the collision at once (the plot beside it waits for the crossing
// with its `lead`, setup/grains.js). `until` (a click): from it the collision is let go and
// the detector fades (the camera moves on to the plot); back below it, it all starts again.
const props = defineProps({
  collision: { type: String, default: 'inside' },
  landY: { type: Number, default: -482 },   // the camera below this (world y): it has come down, the collision starts
  freeze: { type: Array, default: () => [[0, 0.4], [0.25, 0.15], [0.8, 0.15], [1.6, 1]] },   // the world's rate from the crossing: slow while the flash lights, then the debris bursts out
  until: { type: Number, default: 0 },   // from this click: the collision let go, the detector gone (0: never)
})
const { $renderContext, $page, $clicks } = useSlideContext()
const nav = useNav()
const live = computed(() => $renderContext?.value === 'slide' && !nav.isPrintMode?.value)
const page = () => $page?.value ?? $page

function stage() {
  const rootEl = document.querySelector('.stage')
  if (rootEl?.dataset.stageFallback) return null
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera }
}
let run = 0, watcher = 0, offCross = null
const clear = () => { clearInterval(watcher); watcher = 0; offCross?.(); offCross = null }
const stopCollision = () => { bus.set(props.collision, 0); bus.emit('stop', { name: props.collision }) }

async function start() {
  const id = ++run
  clear()
  stopCollision()   // a rebuilt world must not replay a kept step at once
  setGrains('det', 1)
  let s = null
  for (let i = 0; i < 80 && id === run && !(s = stage()); i++) await new Promise((r) => setTimeout(r, 100))
  if (!s || id !== run) return
  offCross = bus.on('cross', (e) => { if (e.name === props.collision && id === run) s.api.setRate(props.freeze, { camera: 1 }) })
  let col = false
  watcher = setInterval(() => {
    if (id !== run || col) return
    if (s.camera.position.y < props.landY) { col = true; bus.set(props.collision, 1); clearInterval(watcher); watcher = 0 }
  }, 100)
}

const over = () => props.until > 0 && $clicks.value >= props.until
function letGo() { run++; clear(); stopCollision(); setGrains('det', 0) }
onSlideEnter(() => { if (live.value) (over() ? letGo() : start()) })
watch($clicks, (c, was) => {
  if (!live.value || nav.currentSlideNo?.value !== page() || !props.until) return
  if (c >= props.until && was < props.until) letGo()
  else if (c < props.until && was >= props.until) start()
})
onSlideLeave(() => {
  if (!live.value) return
  run++; clear(); stopCollision(); setGrains('det', 0)
})
const onRebuilt = () => { if (live.value && nav.currentSlideNo?.value === page() && !over()) start() }
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  // opened at this slide (a reload, or the deck started here): no slide-enter comes
  if (live.value && nav.currentSlideNo?.value === page() && !over()) start()
})
onUnmounted(() => { window.removeEventListener('slidev-stage:rebuilt', onRebuilt); run++; clear() })
</script>

<template><span class="inside-lhcb" aria-hidden="true" /></template>
