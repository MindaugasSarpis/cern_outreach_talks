<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'
import { Vector3, Matrix4, Quaternion } from 'three'
import { sampleFrame } from './takeover.js'
import { placeInDepth, loadDepth, makeLisGrains, scaleLaw } from './lisGrains.js'
import { disk as places } from './afterCover.js'
import { setGrains } from './grains.js'
import META from './data/lis.json'

// <LisFlag />, the close (slide 16), after the light injection clip (the owner, 25 Oct: "the detector
// in slide 15 should move into LHCb as in innoday, with lithuanian flag"). Innoday's <LisTakeover> at
// 22efcef cut to the hand-over: the slide opens on the clip's last frame (figures/lis_last.jpg, the
// flag on the cold box), so nothing changes when the clip goes; under it the frame is already grains,
// each where its surface is in depth, at the cold box's place on a SciFi module of LHCb (lisGrains.js).
// The still fades into them, and the slide's path pulls the camera back out of the module end to the
// whole detector while the grains shrink to the detector's true scale: the flag stays a small mark
// where the module stands. The detector, its collision and the music stay <InsideLhcb>'s; at `fadeAt`
// (world s, the detector let go) the mark goes with it. The slide's path[0] is the clip camera's view
// (Innoday's hero/lis_pose.py; LHCb here stands 1000 units further along x).
// Without a running world (no WebGL, a lost context) the still stays a moment and fades to the
// ground; with v0.8.2's plate layer it fades once the plate plays (the plate begins on the same
// frame). Printed and in the previews: nothing (the slide's map).
const props = defineProps({
  src: { type: String, default: 'figures/lis_last.jpg' },
  depth: { type: String, default: 'figures/lis_last.depth.png' },
  anchor: { type: Array, default: () => [1009.54, -482.40, 0.96] },   // the cold box in the SciFi's lower end: LHCb (0.8, -2.00, 7.95) m at 1,2 units a metre, the `cavern` station at x 1000
  d0: { type: Number, default: 2.4 },      // the camera's start distance from the flag (path[0])
  sEnd: { type: Number, default: 1.2 },    // stage units a metre at the end: the detector's own
  dEnd: { type: Number, default: 16 },     // the camera's distance from the flag where the picture reaches true scale
  flagMark: { type: Number, default: 16 }, // the flag's own grains keep this many times true scale (about the clip's own: the engraving is ~5 cm wide, so at true scale it is a few pixels), a mark of about a metre on its module; the rest of the picture shrinks and fades
  room: { type: String, default: 'cavp' },   // the step that brings the close's floor, roof, shaft and beams, once the camera is out of the module
  roomAt: { type: Number, default: 6 },      // … this far from the flag (units)
  grains: { type: Number, default: 320000 },
  gain: { type: Number, default: 0.92 },
  hold: { type: Number, default: 400 },    // ms of still before the fade
  fade: { type: Number, default: 1400 },   // ms
  fadeAt: { type: Number, default: 38.5 }, // world s: the mark goes with the detector (<InsideLhcb :fade-at>)
  det: { type: String, default: 'detp' },  // the detector whose grains make way round the mark (its `hole`)
})
const { $renderContext, $page } = useSlideContext()
const nav = useNav()
const base = import.meta.env.BASE_URL
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : base + p
const live = computed(() => $renderContext?.value === 'slide' && !nav.isPrintMode?.value)
const page = () => $page?.value ?? $page
const still = ref(false)
const fading = ref(false)

// the frame and its depth, fetched once, once the cover is behind
let loading = null
const load = () => (loading ||= new Promise((resolve) => places.when(resolve)).then(async () => {
  try {
    const img = new Image()
    img.src = url(props.src)
    await img.decode()
    const depth = await loadDepth(url(props.depth), META)
    return { img, depth }
  } catch (e) { console.warn('LisFlag:', e); return null }
}))

function stage() {
  const rootEl = document.querySelector('.stage')
  if (rootEl?.dataset.stageFallback) return null
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera }
}
const elapsed = () => globalThis.__stage?.state?.()?.elapsed
let run = 0, timers = [], watcher = 0
const later = (ms, fn) => timers.push(setTimeout(fn, ms))
const clear = () => { timers.forEach(clearTimeout); timers = []; clearInterval(watcher); watcher = 0 }
async function waitStage(id) {
  for (let i = 0; i < 80; i++) {
    const s = stage()
    if (s || id !== run) return s
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}
// v0.8.2's plate layer: the still fades once the plate shows ('playing' or 'held'), or at once
// when the layer is not a plate after all
const plated = () => document.documentElement.dataset.stageLayer === 'plate'
function untilPlate(id) {
  return new Promise((resolve) => {
    const html = document.documentElement
    let mo = null
    const done = (v) => { mo?.disconnect(); mo = null; resolve(v) }
    const check = () => {
      if (id !== run) return done(null)
      if (html.dataset.stageLayer !== 'plate') return done('none')
      const st = html.dataset.stagePlate
      if (st === 'playing' || st === 'held') done(st)
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (id !== run) return done(null)
      mo = new MutationObserver(check)
      mo.observe(html, { attributes: true, attributeFilter: ['data-stage-layer', 'data-stage-plate'] })
      check()
    }))
  })
}

const A = new Vector3(...props.anchor)
const s0 = props.d0 / META.flagDist
const law = scaleLaw({ s0, d0: props.d0, sEnd: props.sEnd, dEnd: props.dEnd })
// the turn that shows the picture to a camera on the cavern's +z side as the clip's camera saw it
// (right → x, up → y, forward → −z): seen from the eye-level poses the flag's face lay edge-on, a line.
// It turns as the picture shrinks to its mark, so at the start nothing moves
const FACE = (() => {
  const V = (a) => new Vector3(...a)
  const src = new Matrix4().makeBasis(V(META.right), V(META.up), V(META.forward))
  const dst = new Matrix4().makeBasis(new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, -1))
  return new Quaternion().setFromRotationMatrix(dst.multiply(src.transpose()))
})()
const ID = new Quaternion(), q = new Quaternion(), m4 = new Matrix4()
// the detector's clearing round the mark: its station's grains, added on, washed the flag's colours out
const HOLE = 0.1
const holeOf = (scene) => scene?.getObjectByName('detector:' + props.det)?.children.find((c) => c.material?.uniforms?.uHole)?.material.uniforms.uHole

// the grains, made once per tier (a rebuilt world comes back a tier lower)
const SHARE = [1, 0.7, 0.4, 0.25]
let made = null
function grains(s, got) {
  const tier = s.h.tier ?? 0
  if (!made || made.tier !== tier) {
    const k = SHARE[Math.min(SHARE.length - 1, tier)]
    // weighed by each pixel's brightest channel, so the flag's red and green keep their light (Innoday, 20 Oct)
    const sample = sampleFrame(got.img, { n: Math.round(props.grains * k), gamma: 1.2, floor: 0.06, sat: 1.0, weight: 'max', norm: 1 })
    made = { tier, sample, placed: placeInDepth(sample, got.depth, META), size: 0.06 / Math.sqrt(k) }
  }
  let pts = s.h.scene.getObjectByName('lis-grains')
  if (pts && pts.userData.tier !== tier) { s.h.scene.remove(pts); pts.geometry.dispose(); pts.material.dispose(); pts = null }
  if (!pts) {
    pts = makeLisGrains(made.sample, made.placed, { s0, size: made.size, gain: props.gain })
    pts.userData.tier = tier
    s.h.scene.add(pts)
  }
  const hu = holeOf(s.h.scene)
  // the scale from the camera's distance, every frame: flag and mat alike shrink to the detector's scale
  pts.userData.scale = (cam, un) => {
    const s1 = law(cam.position.distanceTo(A))
    const mark = props.sEnd * props.flagMark, k = Math.min(1, Math.max(0, (s1 - props.sEnd) / (s0 - props.sEnd)))
    const d = cam.position.distanceTo(A)
    if (hu) hu.value.set(A.x - 1000, A.y + 480, A.z, Math.max(0.035, HOLE * Math.min(1, Math.max(0, (s1 - props.sEnd) / (s0 - props.sEnd)))))
    un.uScale.value = s1
    un.uScaleFlag.value = Math.min(s0, Math.max(s1, mark))
    un.uRest.value = 0.2 + 0.8 * k
    // the turn eases in as the camera pulls out of the module (3 to 12 units from the flag)
    const turn = Math.min(1, Math.max(0, (d - 3) / 9))
    q.slerpQuaternions(ID, FACE, turn * turn * (3 - 2 * turn))
    un.uRot.value.setFromMatrix4(m4.makeRotationFromQuaternion(q))
    un.uAnchor.value.copy(A)
  }
  pts.material.uniforms.uAnchor.value.copy(A)
  return pts
}
const hide = () => {
  const s = stage(), p = s?.h.scene.getObjectByName('lis-grains')
  if (p) { p.visible = false; p.material.uniforms.uFade.value = 0 }
  const hu = holeOf(s?.h.scene)
  if (hu) hu.value.w = 0
}

async function takeOver() {
  const id = ++run
  clear()
  setGrains(props.room, 0)
  fading.value = false
  still.value = true
  if (plated()) {
    const st = await untilPlate(id)
    if (id !== run) return
    if (st === 'held') { still.value = false; return }
    later(st === 'none' ? 0 : props.hold, () => { if (id === run) fading.value = true })
    later((st === 'none' ? 0 : props.hold) + props.fade, () => { if (id === run) still.value = false })
    return
  }
  const s = await waitStage(id)
  const got = s ? await load() : null
  if (id !== run || !live.value) return
  // no world: the still fades to the ground
  if (!s || !got) { fading.value = true; later(props.fade, () => { if (id === run) still.value = false }); return }
  const pts = grains(s, got)
  const u = pts.material.uniforms
  u.uReveal.value = 0; u.uFade.value = 1
  pts.visible = true
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
  // the mark goes with the detector, on the world's clock (the camera's path runs on it)
  const e0 = elapsed()
  let gone = -1, room = false
  watcher = setInterval(() => {
    if (id !== run) return
    const e = e0 != null ? (elapsed() ?? e0) - e0 : 0
    if (!room && gone < 0 && s.camera.position.distanceTo(A) > props.roomAt) { room = true; setGrains(props.room, 1) }
    if (gone < 0 && e >= props.fadeAt) { gone = e; setGrains(props.room, 0) }
    if (gone >= 0) {
      const k = Math.max(0, 1 - (e - gone) / 1.2)
      u.uFade.value = k
      if (k <= 0) { hide(); clearInterval(watcher); watcher = 0 }
    }
  }, 50)
}

// the slide before (the clip): fetch the frame and build the grains, hidden, so the arrival
// costs a frame, not the sampling; the detector's programs compile behind the clip
async function prepare() {
  const s = stage()
  const got = s ? await load() : null
  if (!s || !got || nav.currentSlideNo?.value !== page() - 1) return
  const pts = grains(s, got)
  pts.visible = false
  dispatchEvent(new Event('karjera:prewarm'))
}

// one start a visit: Slidev runs onSlideEnter again on a click within the slide (25 Oct: the close
// restarted under the map on its click)
let visiting = false
onSlideEnter(() => {
  if (!live.value || (visiting && nav.currentSlideNo?.value === page())) return
  visiting = true
  takeOver()
})
onSlideLeave(() => {
  if (!live.value || nav.currentSlideNo?.value === page()) return
  visiting = false
  run++; clear(); hide(); setGrains(props.room, 0)
  still.value = false; fading.value = false
})
watch(() => nav.currentSlideNo?.value, (n) => {
  if (!live.value) return
  if (n !== page()) { if (visiting) { visiting = false; run++; clear(); hide(); still.value = false; fading.value = false } }
  if (n === page() - 1) prepare()
})
const onRebuilt = () => { made = null; if (live.value && nav.currentSlideNo?.value === page()) { hide() } }
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  // opened at this slide (a reload, or the deck started here): no slide-enter comes
  if (live.value && nav.currentSlideNo?.value === page()) { visiting = true; takeOver() }
  else if (live.value && nav.currentSlideNo?.value === page() - 1) prepare()
})
onUnmounted(() => { window.removeEventListener('slidev-stage:rebuilt', onRebuilt); run++; clear() })
</script>

<template>
  <div class="lis-flag" aria-hidden="true">
    <img v-if="still && live" class="lis-still" :class="{ fading }" :src="url(src)" :style="{ transitionDuration: fade + 'ms' }" alt="" />
  </div>
</template>

<style>
.lis-flag { position: absolute; inset: 0; pointer-events: none; }
.lis-flag .lis-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; transition-property: opacity; transition-timing-function: ease-in; }
.lis-flag .lis-still.fading { opacity: 0; }
</style>
