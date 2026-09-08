<script setup>
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import { createField } from './particle-hero/sim.js'
import { warmAudio, playCollision } from './particle-hero/sound.js'

// Full-bleed hero slide: the CERN-lessons landing hero (live three.js
// particle scene, Space Grotesk uppercase title) ported to Slidev, in three
// MODES (particle-hero/core.js):
//
//   proton   — the particle sphere being probed: beam pulses arrive along the
//              fibers and collision sprays erupt from inside (the landing).
//   galaxy   — a slowly spinning spiral disc.
//   collider — a ring with two counter-rotating bunches; an eruption fires at
//              the interaction point every time they cross.
//
//   <ParticleHero mode="galaxy" kicker="Act I" title="From the|Cosmos" />
//   <ParticleHero mode="proton" sound counter
//     kicker="World of Particles" title="Ačiū"
//     sub="Questions?|Press C — or click — to collide" />
//
// Interaction while the slide is active: pointer stirs the field, a click
// shoves it and fires a collision (proton: a beam pulse that erupts on
// arrival), the `c` key fires one immediately. `counter` shows a running
// collision tally; `sound` plays a synthesised thump for the collisions the
// presenter triggers (auto ones stay silent). '|' in title/sub breaks lines.
//
// Like VideoPlayer it is position:absolute; inset:0 — give the slide no h1.
// The scene runs only while the slide is active (paused otherwise, disposed
// on unmount) and only in the live slide / presenter views: the overview
// grid and next-slide preview get the static gradient card, so a deck with
// several hero slides never boots several WebGL scenes at once. Without
// WebGL2 + float render targets (or under reduced motion) the slide keeps
// the landing's static gradient backdrop too.

const props = defineProps({
  kicker:   { type: String, default: '' },
  title:    { type: String, required: true },
  sub:      { type: String, default: '' },
  cornerTr: { type: String, default: '' },
  cornerBr: { type: String, default: '' },
  mode:     { type: String, default: 'proton' },   // proton | galaxy | collider
  sound:    { type: Boolean, default: false },
  counter:  { type: Boolean, default: false },
})

const VARIANT = { proton: 'sphere', galaxy: 'galaxy', collider: 'ring' }

const split = (t) => t.split('|').map((l) => l.trim()).filter(Boolean)
const lines = computed(() => split(props.title))
const subLines = computed(() => split(props.sub))

const root = ref(null)
const canvas = ref(null)
const isActive = useIsSlideActive()
const { $renderContext } = useSlideContext()
const isLive = computed(() => $renderContext.value === 'slide' || $renderContext.value === 'presenter')
const staticBg = ref(false)
const shown = ref(false) // title lines animate in on first activation
const events = ref(0)
const flash = ref(0)     // counter pulse key
let field = null

function webgl2Ok() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    const ok = !!gl && (gl.getExtension('EXT_color_buffer_float') !== null
      || gl.getExtension('EXT_color_buffer_half_float') !== null)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch { return false }
}

function onEvent(count, manual) {
  events.value = count
  flash.value++
  if (manual && props.sound) playCollision()
}

function boot() {
  if (field || staticBg.value) return
  if (!isLive.value) { staticBg.value = true; return }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !webgl2Ok()) { staticBg.value = true; return }
  try {
    field = createField(canvas.value, root.value, { variant: VARIANT[props.mode] || 'sphere', onEvent })
  } catch {
    field = null
  }
  if (!field) staticBg.value = true
}

function onPointer(e) {
  if (!field) return
  const r = root.value.getBoundingClientRect()
  field.onPointer(e.clientX - r.left, e.clientY - r.top)
}
function onClick(e) {
  if (props.sound) warmAudio()
  if (!field) return
  const r = root.value.getBoundingClientRect()
  field.onImpulse(e.clientX - r.left, e.clientY - r.top)
}
function onKey(e) {
  if (!isActive.value || !isLive.value) return
  if (e.key !== 'c' && e.key !== 'C') return
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  if (props.sound) warmAudio()
  field?.collide()
}

// Refs are bound only after mount, so the activation watcher must not boot
// before then (a pre-mount createField(null) throws and we'd fall back to the
// static gradient for good).
let mounted = false
function activate() {
  shown.value = true
  boot()
  field?.setPaused(false)
}
watch(isActive, (active) => {
  if (!mounted) return
  if (active) activate()
  else field?.setPaused(true)
})

const onVisibility = () => field?.setPaused(document.hidden || !isActive.value)
onMounted(() => {
  mounted = true
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('keydown', onKey)
  if (isActive.value) activate()
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('keydown', onKey)
  field?.dispose()
  field = null
})

const tally = computed(() => String(events.value).padStart(3, '0'))
</script>

<template>
  <div
    ref="root"
    class="particle-hero"
    :class="{ 'static-bg': staticBg, in: shown || !isLive }"
    @pointermove="onPointer"
    @click="onClick"
  >
    <canvas ref="canvas" class="field" aria-hidden="true"></canvas>
    <div class="grain" aria-hidden="true"></div>
    <div class="hero">
      <div v-if="cornerTr" class="corner corner-tr" aria-hidden="true">{{ cornerTr }}</div>
      <div v-if="cornerBr" class="corner corner-br" aria-hidden="true">{{ cornerBr }}</div>
      <p v-if="kicker" class="kicker">{{ kicker }}</p>
      <h1 class="title">
        <span v-for="(l, i) in lines" :key="i" class="line-wrap">
          <span class="line" :style="{ '--i': i }">{{ l }}</span>
        </span>
      </h1>
      <p v-if="sub" class="sub">
        <span v-for="(l, i) in subLines" :key="i" class="sub-line">{{ l }}</span>
      </p>
      <div v-if="counter" class="tally" aria-live="polite">
        <span class="tally-label">Collisions</span>
        <span :key="flash" class="tally-n">{{ tally }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Palette + type mirror the landing (landing/src/style.css). Sizes are in px
   against Slidev's 980-wide canvas; Slidev scales the slide to the venue. */
.particle-hero {
  --bg: #050507;
  --fg: #f2f5f9;
  --dim: #8b97a6;
  --accent: #7dd3fc;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute;
  inset: 0;
  overflow: hidden;
  color: var(--fg);
  font-family: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  cursor: default;
  /* Ambient gradient is ALWAYS present: it is the static backdrop, and the
     additive particle canvas draws over it. */
  background:
    radial-gradient(1100px 700px at 78% -8%, rgba(125, 211, 252, 0.07), transparent 62%),
    radial-gradient(900px 600px at -12% 108%, rgba(125, 211, 252, 0.05), transparent 60%),
    var(--bg);
}
/* Layers: canvas 0 → hero 1 → grain 10. */
.field {
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
  opacity: 0; transition: opacity 1.2s ease;
}
.in .field { opacity: 1; }
.static-bg .field { display: none; }
.grain {
  position: absolute; inset: 0; z-index: 10; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.hero {
  position: absolute; inset: 0; z-index: 1;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 0 0 11%;
  pointer-events: none;
}
.kicker, .sub, .corner, .tally {
  text-transform: uppercase; letter-spacing: 0.12em;
}
.kicker {
  font-size: 12.5px; color: var(--accent); margin: 0 0 22px; font-weight: 500;
}
.title {
  margin: 0; font-weight: 700; text-transform: uppercase;
  font-size: 78px; line-height: 0.98; letter-spacing: -0.02em;
  color: var(--fg);
}
.line-wrap { display: block; overflow: hidden; }
.line { display: block; transform: translateY(112%); }
.in .line {
  animation: line-in 0.9s var(--ease) forwards;
  animation-delay: calc(0.15s + var(--i) * 0.11s);
}
@keyframes line-in { to { transform: translateY(0); } }
.sub {
  color: var(--dim); font-size: 12px; letter-spacing: 0.1em;
  max-width: 62ch; margin: 28px 0 0; line-height: 1.9;
}
.sub-line { display: block; }
.corner {
  position: absolute; right: 34px; color: var(--dim);
  font-size: 10.5px; font-weight: 500; letter-spacing: 0.14em;
}
.corner-tr { top: 30px; }
.corner-br { bottom: 30px; }

/* live collision tally, bottom-left, in the corner type */
.tally {
  position: absolute; left: 11%; bottom: 30px;
  display: flex; align-items: baseline; gap: 14px;
  color: var(--dim); font-size: 10.5px; font-weight: 500; letter-spacing: 0.14em;
}
.tally-n {
  font-size: 26px; font-weight: 700; letter-spacing: 0.04em; color: var(--fg);
  font-variant-numeric: tabular-nums;
  animation: tally-pop 0.5s var(--ease);
}
@keyframes tally-pop {
  0% { color: var(--accent); transform: scale(1.18); }
  100% { color: var(--fg); transform: scale(1); }
}
</style>
