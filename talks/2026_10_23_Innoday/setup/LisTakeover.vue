<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { Vector3 } from 'three'
import { sampleFrame } from './takeover.js'
import { placeInDepth, loadDepth, makeLisGrains, scaleLaw } from './lisGrains.js'
import { setGrains } from './detector.js'
import { zoom } from './emblems.js'
import { places } from './afterCover.js'
import { bus } from '../components/lhc-opening/bus.js'
import META from './data/lis.json'

// <LisTakeover><h1>Ačiū</h1></LisTakeover>, on „Ačiū“, the slide after the light
// injection clip. It opens on the clip's last frame, the flag on the cold box, so
// nothing changes when the clip goes; under it the frame is already grains, each
// where its surface is in depth, at the cold box's place on a SciFi module of LHCb
// (lisGrains.js). The still fades into them, and the slide's path pulls the camera
// back out of the module end to the whole detector while the grains shrink to a
// mark; the detector lights up behind them (det: 1), then LHCb's collision in it
// (the `lhc-collision` named `collision`) while the camera comes down to eye level on
// the cavern floor (owner, 20 Oct: "see the huge scale of lhcb, maybe then go to first
// person view at eye level lhcb filling the screen, show lhcb logo and Lithuanian flag
// besides in 3d space"); the bunches cross as it lands, and the debris runs through the
// stations while it lingers there (owner: "don't need to rush to zoom out"); on the
// slow dolly back the two emblems gather (`emblems`, setup/emblems.js), and the slot
// (the word) shows when the camera stops: each when the camera has come that far, not
// on a timer (on a slow machine the world's clock runs behind the wall's). The slide's path[0] is the clip camera's view
// (hero/lis_pose.py prints it from lis.json, the anchor and d0).
// Without a running world (reduced motion, no WebGL, a lost context, a boot slower
// than 8 s) the still stays and the word shows over it; printed, in the overview and
// the presenter's previews it is the still and the word. A step on to the next page
// (the credits) leaves the close running; that page opened directly shows the flag's
// mark at once. Nothing loads before the cover is behind (afterCover.js).
const props = defineProps({
  src: { type: String, default: 'figures/lis_last.jpg' },
  depth: { type: String, default: 'figures/lis_last.depth.png' },
  anchor: { type: Array, default: () => [9.54, -483.06, 0.96] },   // the flag's place: the lower cold box, LHCb (0.8, -2.55, 7.95) m at 1,2 units a metre (true proportions)
  d0: { type: Number, default: 2.4 },      // the camera's start distance from the flag, stage units (path[0])
  sEnd: { type: Number, default: 1.2 },    // stage units a metre at the end of the scale law: the detector's own (owner, 21 Oct: the flag on its mat "moves to a position where scifi is. and reduces in size accordingly (because it's far away)")
  grains: { type: Number, default: 320000 },   // at tier 0; fewer on a lower tier (owner, 20 Oct: "more solid")
  gain: { type: Number, default: 0.92 },   // the grains' light: the stripes at the still's colours
  hold: { type: Number, default: 400 },    // ms of still before the fade
  fade: { type: Number, default: 1400 },   // ms
  collision: { type: String, default: 'thanks' },
  detAt: { type: Number, default: 3.2 },   // the camera this far from the flag (units): the detector lights up
  colAt: { type: Number, default: 15.6 },  // … LHCb's collision starts in it (12,6 s on the path, hero/close_path.py --probe; the bunches cross 5 s later, `approach` 2.5 at the slide's rate 0.5: as the camera lands at eye level, on the music's arrival, 17-19 s)
  freeze: { type: Array, default: () => [[0, 0.5], [0.25, 0.15], [0.8, 0.15], [1.6, 0.6]] },   // the world's rate from the crossing (17,5 s): slow while the flash lights, then the debris bursts out (~19 s, still in the music's peak; at 0.08 for 1,8 s the burst came at 21 s)
  embAt: { type: Number, default: 34 },    // … the emblems gather, on the pull-back (38,5 s: whole by the music's second climax, 42-44 s; the camera is never this far before)
  dEnd: { type: Number, default: 19 },     // the camera's distance from the flag where the picture reaches true scale (~15 s, coming down to eye level; the walk never comes nearer than 19,6)
  wordTop: { type: String, default: '42.5%' },   // the word's middle once the world has run: inside the FCC's ring (the still and print keep it low)
  emblems: { type: Array, default: () => ['lhcbLogo'] },
  wordAfter: { type: Number, default: 0.6 },   // s after the camera has stopped (48 s): the word
  wordBy: { type: Number, default: 62 },   // s: the word shows by then whatever the world does
  // the word out of a collision (owner, 22 Oct: "aciu should appear out of particle collision now
  // it's a bit flat"; "Also Lithuanian flag should appear with aciu"): where the world runs, the
  // `lhc-collision` named `bang` (a CMS crossing in the middle of the FCC's ring) starts as the
  // camera stops, and on its crossing the word and the flag (`words`: emblems with `burst`)
  // gather out of it; the collision lets go after `bangFor` ms. The slot's word is then hidden
  // (the plate has the world's). Without the world or its plate, the slot's word as before.
  bang: { type: String, default: 'aciuCol' },
  words: { type: Array, default: () => ['aciu', 'ltAciu'] },
  bangFor: { type: Number, default: 5000 },
  gatherAfter: { type: Number, default: 900 },   // ms from the crossing: the word gathers
})
const { $renderContext, $page, $frontmatter } = useSlideContext()
const nav = useNav()
const base = import.meta.env.BASE_URL
const url = (p) => (p.startsWith('/') || /^https?:/.test(p)) ? p : base + p
const live = computed(() => $renderContext?.value === 'slide')
const page = () => $page?.value ?? $page
const still = ref(true)
const fading = ref(false)
const word = ref(false)
const high = ref(false)   // the word in the ring (the world or its plate ran to the end), not low over the still
const grained = ref(false)   // the world (or its plate) draws the word: the slot's is hidden

// the frame and its depth, fetched once, by the live slide only, once the cover is behind
let loading = null
const load = () => (loading ||= new Promise((resolve) => places.when(resolve)).then(async () => {
  try {
    const img = new Image()
    img.src = url(props.src)
    await img.decode()
    const depth = await loadDepth(url(props.depth), META)
    return { img, depth }
  } catch (e) { console.warn('LisTakeover:', e); return null }
}))

function stage() {
  const rootEl = document.querySelector('.stage')
  if (rootEl?.dataset.stageFallback) return null   // the static ground: no world to take over
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera }
}
let run = 0, timers = [], watcher = 0, offCross = null
async function waitStage(id) {
  for (let i = 0; i < 80; i++) {
    const s = stage()
    if (s || id !== run) return s
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}
const later = (ms, fn) => timers.push(setTimeout(fn, ms))
// v0.8.2's plate layer (html[data-stage-layer="plate"], set with the `slidev-stage:fallback`
// event): no world, but this slide's recorded plate plays under it, its first seconds this
// still turning to grains. The still fades as it does over the world, and the word comes when
// the plate's camera stops (the path's last key + wordAfter, on the wall clock: cameraRate 1).
// Under the `living` and `still` layers (no plate) the still stays, with the word. Older
// stages never set the attribute.
const plated = () => document.documentElement.dataset.stageLayer === 'plate'
// … and only once the plate shows (html[data-stage-plate]: loading | playing | paused | held |
// none): a still faded over a plate still loading is a black gap. Resolves 'playing', 'held'
// (a back-step or a jump: the plate's settled last frame), 'none' (the layer is not, or no
// longer, a plate: e.g. `living` when the plate cannot be fetched) or null (left). Looked at
// two frames after the arrival, so the previous slide's plate state is not read as this one's.
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
function pathEnd() {
  const sp = $frontmatter?.value?.space ?? $frontmatter?.space
  return Math.max(0, ...(sp?.path || []).map(([t]) => Number(t) || 0))
}
const clear = () => { timers.forEach(clearTimeout); timers = []; clearInterval(watcher); watcher = 0; offCross?.(); offCross = null; offBang?.(); offBang = null }
let offBang = null
const words = (k) => props.words.forEach((n) => setGrains(n, k))
const stopBang = () => { bus.set(props.bang, 0); bus.emit('stop', { name: props.bang }) }
// the collision in the ring, and the word and the flag out of it on its crossing (or a little
// later, if the crossing never comes)
function bang(id) {
  grained.value = true
  let out = false
  const gather = () => { if (out || id !== run) return; out = true; words(1); later(props.bangFor, () => { if (id === run) bus.set(props.bang, 0) }) }
  offBang = bus.on('cross', (e) => { if (e.name === props.bang) later(props.gatherAfter, gather) })   // the tracks fly out first
  bus.set(props.bang, 1)
  later(5000, gather)
}

const A = new Vector3(...props.anchor)
const s0 = props.d0 / META.flagDist
// the farthest the slide's path takes the camera from the flag (the stage's pose: at +
// dist·(sin yaw cos pitch, sin pitch, cos yaw cos pitch)): the scale law's end
function farthest() {
  const sp = $frontmatter?.value?.space ?? $frontmatter?.space
  let far = 0
  for (const [, k] of sp?.path || []) {
    if (!k || !Array.isArray(k.at)) continue
    const r = Math.PI / 180, y = (k.yaw ?? 0) * r, p = (k.pitch ?? 0) * r, d = k.dist ?? 20
    far = Math.max(far, new Vector3(k.at[0] + d * Math.sin(y) * Math.cos(p), k.at[1] + d * Math.sin(p), k.at[2] + d * Math.cos(y) * Math.cos(p)).distanceTo(A))
  }
  return far || 22
}
const law = scaleLaw({ s0, d0: props.d0, sEnd: props.sEnd, dEnd: props.dEnd || farthest() })
const emblems = (k) => props.emblems.forEach((n) => setGrains(n, k))

// the grains, made once per tier (a rebuilt world comes back a tier lower): fewer on a
// lower tier, each a little larger so the picture keeps its light
const SHARE = [1, 0.7, 0.4, 0.25]
let made = null
function grains(s, got) {
  const tier = s.h.tier ?? 0
  if (!made || made.tier !== tier) {
    const k = SHARE[Math.min(SHARE.length - 1, tier)]
    // the grains add up to the frame's own colours: weighed by each pixel's brightest
    // channel, each grain its pixel's full hue, density ~ max^1.2 (the stage's finish
    // turns density d into about d^1.85 of light: measured on the flag's stripes, 20 Oct;
    // weighed by luminance, the red and green came out a third to a fifth of the
    // yellow). The near-black (under 15 of 255) gives none
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
  // the form follows the camera every frame: its scale from the camera's distance
  // (owner, 21 Oct: the engraved flag and its mat go "to a position where scifi is. and reduces
  // in size accordingly"): the whole picture, flag and mat alike, in the module's own
  // orientation, shrinks to the detector's true scale and stays there as a tiny mark; in the
  // pull-out to the accelerator complex it shrinks toward Point 8 with the detector (`zoom`)
  const hu = holeOf(s.h.scene)
  pts.userData.scale = (cam, un) => {
    const s1 = law(cam.position.distanceTo(A)), sc = s1 * zoom.k
    // the detector's clearing round the flag closes as the picture comes down to true scale
    if (hu) hu.value.w = HOLE * Math.min(1, Math.max(0, (s1 - props.sEnd) / (s0 - props.sEnd)))
    un.uScale.value = sc
    un.uScaleFlag.value = sc
    un.uRest.value = 1
    un.uAnchor.value.copy(A)
    if (zoom.k < 1) un.uAnchor.value.sub(zoom.at).multiplyScalar(zoom.k).add(zoom.at)
  }
  pts.material.uniforms.uAnchor.value.copy(A)
  return pts
}
// the detector's clearing round the flag's mark (space.json `hole` on `det`): reset on arrival
const HOLE = 0.1
// (the grains' material: with `mesh` the group also holds the surfaces, and with `grains:
// false` no grains at all)
const holeOf = (scene) => scene?.getObjectByName('detector:det')?.children.find((c) => c.material?.uniforms?.uHole)?.material.uniforms.uHole
const s0Hole = () => holeOf(stage()?.h.scene)
const stopCollision = () => { bus.set(props.collision, 0); bus.emit('stop', { name: props.collision }) }

async function takeOver() {
  const id = ++run
  clear()
  still.value = true; fading.value = false; word.value = false; high.value = false; grained.value = false
  setGrains('det', 0); emblems(0); words(0); stopBang()
  const hole = s0Hole()
  if (hole) hole.value.w = HOLE
  stopCollision()   // a rebuilt world must not replay a kept step at once
  // the detector, the floor, the cradles and the emblems drawn hidden for a few frames
  // behind the still: their buffers upload and programs compile now, not mid pull-back
  dispatchEvent(new Event('innoday:prewarm'))
  later(props.wordBy * 1000, () => { if (id === run) word.value = true })
  if (plated()) {
    const st = await untilPlate(id)
    if (id !== run) return
    if (st === 'none') { word.value = true; return }   // no plate after all: the still and the word
    high.value = true
    grained.value = true   // the plate holds the world's word and flag
    if (st === 'held') { still.value = false; word.value = true; return }   // the close as it ended
    later(props.hold, () => { if (id === run) fading.value = true })
    later(props.hold + props.fade, () => { if (id === run) still.value = false })
    later((pathEnd() + props.wordAfter) * 1000, () => { if (id === run) word.value = true })
    return
  }
  const s = await waitStage(id)
  const got = s ? await load() : null
  if (id !== run || !live.value) return
  // no world, or nothing to show: the still stays, with the word over it
  if (!s || !got) { word.value = true; return }
  high.value = true
  const pts = grains(s, got)
  const u = pts.material.uniforms
  u.uReveal.value = 0; u.uFade.value = 1
  pts.visible = true; pts.userData.gone = false
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
  // the world slows almost to a stop as the bunches cross, from the crossing itself (keyed to
  // the slide's clock, a trigger a few tenths late moved the crossing seconds deeper into the
  // slow stretch); the camera keeps its own pace
  offCross = bus.on('cross', (e) => { if (e.name === props.collision && id === run) s.api.setRate(props.freeze, { camera: 1 }) })
  // the detector, the collision, the emblems and the word follow the camera
  let det = false, col = false, emb = false, stopped = -1
  watcher = setInterval(() => {
    if (id !== run) return
    const d = s.camera.position.distanceTo(A)
    if (!det && d > props.detAt) { det = true; setGrains('det', 1) }
    if (!col && d > props.colAt) { col = true; bus.set(props.collision, 1) }
    if (col && stopped < 0 && !s.api.flying) stopped = performance.now()
    if (col && !emb && (d > props.embAt || stopped >= 0)) {
      emb = true; emblems(1)
      // the logo takes over: the collision's glow fades (it washed the logo out)
      bus.set(props.collision, 0)
    }
    if (emb && stopped >= 0 && performance.now() - stopped > props.wordAfter * 1000) { word.value = true; clearInterval(watcher); watcher = 0; bang(id) }
  }, 100)
}

// the close as it ends: the module's picture and its mark gone, the clearing closed, the
// collision let go, the emblems up (the credits page sets them too)
function endState(s, pts) {
  if (pts) { pts.material.uniforms.uFade.value = 0; pts.visible = false; pts.userData.gone = true }
  const hole = holeOf(s?.h.scene)
  if (hole) hole.value.w = 0
  bus.set(props.collision, 0)
  emblems(1)
  bus.set(props.bang, 0); words(1); grained.value = true
}
// the next page (the credits) opened directly, a reload or `g`: the close as it ends
async function showEnd() {
  const id = ++run
  const s = await waitStage(id)
  if (id !== run || !s || nav.currentSlideNo?.value !== page() + 1) return
  endState(s, s.h.scene.getObjectByName('lis-grains'))
}

onSlideEnter(() => { if (live.value) takeOver() })
onSlideLeave(() => {
  if (!live.value) return
  run++; clear()
  // the still is left as it is (shown again here, it would stand over the world as the
  // slide fades out); a leave before the fade ended leaves the grains whole
  const p = stage()?.h.scene.getObjectByName('lis-grains')
  if (p) p.material.uniforms.uReveal.value = 1
  // on to the credits the close goes to its end (a press before the stop skips ahead);
  // anywhere else the collision stops and the emblems go
  if (nav.currentSlideNo?.value === page() + 1) endState(stage(), p)
  else { stopCollision(); emblems(0); stopBang(); words(0) }
})
// the plate layer can come after the slide's arrival (the stage decides its fallback late)
const onFallback = () => { if (live.value && plated() && nav.currentSlideNo?.value === page()) takeOver() }
const onRebuilt = () => {
  if (!live.value) return
  const n = nav.currentSlideNo?.value
  made = null
  if (n === page()) takeOver()
  else if (n === page() + 1) showEnd()
}
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  window.addEventListener('slidev-stage:fallback', onFallback)
  // opened at this slide (a reload, or the deck started here): no slide-enter comes
  if (live.value && nav.currentSlideNo?.value === page()) takeOver()
})
onUnmounted(() => { window.removeEventListener('slidev-stage:rebuilt', onRebuilt); window.removeEventListener('slidev-stage:fallback', onFallback); run++; clear() })
// the grains are drawn here and on the credits page after it, hidden everywhere else
watch(() => nav.currentSlideNo?.value, (n) => {
  if (!live.value) return
  const p = stage()?.h.scene.getObjectByName('lis-grains')
  if (p) p.visible = n === page() && !p.userData.gone
  if (n === page() + 1 && (!p || !p.userData.gone)) showEnd()
}, { immediate: true })
</script>

<template>
  <div class="lis-takeover">
    <img v-if="still" class="lis-still" :class="{ fading }" :src="url(src)" :style="{ transitionDuration: fade + 'ms' }"
      alt="Šviesos įvedimo sistema SciFi modulio gale; ant šaltosios dėžės išgraviruota Lietuvos vėliava" />
  </div>
  <div class="lis-word" :class="{ on: word || !live || nav.isPrintMode?.value, high: high && live && !nav.isPrintMode?.value, grained: grained && live && !nav.isPrintMode?.value }" :style="{ '--lis-word-top': wordTop }"><slot /></div>
</template>

<style>
.lis-takeover { position: absolute; inset: 0; pointer-events: none; }
.lis-takeover .lis-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; transition-property: opacity; transition-timing-function: ease-in; }
.lis-takeover .lis-still.fading { opacity: 0; }
html.print .lis-takeover .lis-still { opacity: 1; }
.lis-word { opacity: 0; transition: opacity 0.8s ease; }
/* a soft dark ground under the word, so it never sits on the detector's grains */
.lis-word h1::before { content: ''; position: absolute; z-index: -1; left: 50%; top: 50%; width: 15em; height: 3.6em; transform: translate(-50%, -50%); background: radial-gradient(closest-side, rgba(0, 1, 3, 0.75), rgba(0, 1, 3, 0)); pointer-events: none; }
.lis-word.on, html.print .lis-word { opacity: 1; }
.lis-word.grained { opacity: 0 !important; }
/* the world's close ends on the LHC ring from above: the word sits inside it */
html[data-stage] .slidev-layout.statement.thanks-lhcb .lis-word.high h1 { top: var(--lis-word-top, 45%); bottom: auto; transform: translateY(-50%); }
@media (prefers-reduced-motion: reduce) { .lis-word { opacity: 1; transition: none; } }
</style>
