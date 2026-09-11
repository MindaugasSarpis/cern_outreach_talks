<script setup>
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { createSpace } from './hadron-space/space.js'
import SpacePanel from './SpacePanel.vue'
import { subscriptHtml } from './hadron-space/particles.js'
import { warmAudio } from './particle-hero/sound.js'
import { playAssembly, playLanding } from './hadron-space/sound.js'

// The persistent 3D hadron space under a whole deck. Mount ONCE from the
// deck's global-bottom.vue. Each slide steers the camera through its
// frontmatter:
//
//   space:
//     at: states          # station id (paper | theta | decay | states | interiors | neutrals | future)
//                         # | state id (Pc(4312) …) | wide | origin | [x, y, z]
//     dist: 7  yaw: -25  pitch: 8
//     stops: [Pc(4312), Pc(4440), Pc(4457)]   # click k flies to stops[k-1]
//     asof: 2015          # optional: tell the story as of this year (see below)
//     dim: 0.6            # optional: how far the world is dimmed, 0..1
//   clicks: 3                                  # = stops.length
//
// A slide without `space` keeps the previous pose. While a stop is active
// the state's record is shown on the left and its paper figure (from
// data.figures) on the right, both as SpacePanels. Data: public/data/
// hadrons.json (scripts/hadrons.py). Without WebGL2 float render targets,
// or under reduced motion, only the static gradient is drawn.
//
// `asof` keeps a stop's record in the year the slide is telling: a record
// whose `status_year` is later than `asof` shows `status_before` instead
// (so the 2015 slide does not announce the 2019 split), and a `note` whose
// `note_year` is later is dropped. Default 9999 = tell it as it stands now.
//
// `dim` is the opacity of the scrim between the world and the slide, so
// body copy keeps its contrast over a busy pose. Without the key: 0 while a
// stop is active (world + HUD own the screen), 0.15 on cover / section /
// statement / fact / quote layouts, 0.6 on content slides.

const props = defineProps({
  src: { type: String, default: 'data/hadrons.json' },
  // the opening sound: a low swell while the quarks fly in, a thump as the last lands
  sound: { type: Boolean, default: true },
})

const root = ref(null)
const canvas = ref(null)
const nav = useNav()
const data = ref(null)
const staticBg = ref(false)
const ready = ref(false)
const stopId = ref(null)
const arrived = ref(true)   // HUD waits for the camera to land
let space = null

function webgl2Ok() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    const ok = !!gl && (gl.getExtension('EXT_color_buffer_float') !== null
      || gl.getExtension('EXT_color_buffer_half_float') !== null)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch { return false }
}

const frontmatterSpace = computed(() => nav.currentSlideRoute.value?.meta?.slide?.frontmatter?.space || null)
const clicks = computed(() => nav.clicks.value || 0)

function apply(immediate = false) {
  if (!space) return
  const sp = frontmatterSpace.value
  if (!sp) { stopId.value = null; space.setStop(null); return }
  const stops = Array.isArray(sp.stops) ? sp.stops : null
  const k = clicks.value
  if (stops && stops.length && k >= 1) {
    const id = stops[Math.min(k, stops.length) - 1]
    stopId.value = id
    space.setStop(id)
    space.setPose({ ...sp, at: id }, { immediate })
    arrived.value = immediate || space.arrived
  } else {
    stopId.value = null
    space.setStop(null)
    space.setPose(sp, { immediate })
  }
}

watch([frontmatterSpace, clicks], () => apply(false))
// While a stop is active the slide's own cards fade (deck CSS keys on this),
// so the state, its record and its figure have the screen.
watch(stopId, (id) => {
  if (id) document.documentElement.dataset.spaceStop = '1'
  else delete document.documentElement.dataset.spaceStop
})

const stopState = computed(() => (stopId.value && space) ? space.state(stopId.value) : null)
const stopFigure = computed(() => (stopId.value && data.value?.figures) ? data.value.figures[stopId.value] || null : null)

// The year the current slide is telling the story in (frontmatter `asof`).
const asof = computed(() => Number(frontmatterSpace.value?.asof) || 9999)
// The record as it stood in that year: later status changes and later notes
// are held back.
const shown = computed(() => {
  const s = stopState.value
  if (!s) return null
  const out = { ...s }
  if (Number(s.status_year) > asof.value) out.status = s.status_before || 'observed'
  if (Number(s.note_year) > asof.value) out.note = ''
  return out
})

// The scrim's opacity: explicit frontmatter wins, then a stop (none), then
// the slide's layout — display layouts stay open, content slides get a calm
// dark ground behind the type.
const LAYOUT_DIM = { cover: 0.15, section: 0.15, statement: 0.15, fact: 0.15, quote: 0.15 }
const dim = computed(() => {
  const fm = frontmatterSpace.value?.dim
  if (fm != null && Number.isFinite(Number(fm))) return Math.min(1, Math.max(0, Number(fm)))
  if (stopId.value) return 0
  const layout = nav.currentSlideRoute.value?.meta?.slide?.frontmatter?.layout
  return LAYOUT_DIM[layout] ?? 0.6
})
// The scene fades its labels and drop lines with the scrim (see setDim).
watch(dim, (d) => space?.setDim(d))

const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
const fmtMass = (s) => {
  if (!s || s.mass == null) return ''
  const m = s.mass >= 100 ? s.mass.toFixed(1) : String(s.mass)
  return s.mass_err != null ? `${m} ± ${s.mass_err} MeV` : `${m} MeV`
}

async function boot() {
  if (space || staticBg.value || !canvas.value) return
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !webgl2Ok()) { staticBg.value = true; assembled(true); return }
  try {
    const base = import.meta.env.BASE_URL || '/'
    const url = (p) => base.replace(/\/?$/, '/') + p
    const [r1, r2] = await Promise.all([fetch(url(props.src)), fetch(url('data/space.json'))])
    data.value = await r1.json()
    const spaceDef = await r2.json()
    space = createSpace(canvas.value, root.value, {
      data: data.value, space: spaceDef,
      onArrive: () => { arrived.value = true },
      // the hero's pentaquark assembles on arrival; the cover's title waits for it (deck CSS keys on html[data-space-assembled])
      onEvent: (e) => {
        if (e === 'assembling') { assembled(false); if (props.sound) playAssembly(3.0) }
        else if (e === 'assembled') { assembled(true); if (props.sound) playLanding() }
      },
    })
  } catch {
    space = null
  }
  if (!space) { staticBg.value = true; assembled(true); return }
  ready.value = true
  space.setDim(dim.value)
  apply(true)
}

// html[data-space-assembled]: set while no assembly runs (and always without WebGL), so the cover's title shows
function assembled(on) {
  if (on) document.documentElement.dataset.spaceAssembled = '1'
  else delete document.documentElement.dataset.spaceAssembled
}
// `c` replays the assembly while the hero pose is current (the cover and the close)
const onKey = (e) => {
  if (e.key !== 'c' || e.metaKey || e.ctrlKey || e.altKey) return
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  if (space && space.activeStation === 'hero') space.assemble()
}
// the first key press or pointer down unlocks audio (autoplay policy); the
// assembly on first load is silent, every later one sounds
const onGesture = () => { if (props.sound) warmAudio() }
const onVisibility = () => space?.setPaused(document.hidden)
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('keydown', onKey)
  window.addEventListener('keydown', onGesture, { once: true })
  window.addEventListener('pointerdown', onGesture, { once: true })
  boot()
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('keydown', onGesture)
  window.removeEventListener('pointerdown', onGesture)
  assembled(true)
  space?.dispose()
  space = null
})
</script>

<template>
  <div ref="root" class="hadron-space" :class="{ 'static-bg': staticBg, ready }">
    <canvas ref="canvas" class="field" aria-hidden="true"></canvas>
    <div class="scrim" aria-hidden="true" :style="{ opacity: dim }"></div>
    <div class="grain" aria-hidden="true"></div>
    <Transition name="hud">
      <div v-if="shown && arrived" class="hud" :key="shown.id">
        <SpacePanel kicker="state" class="hud-card">
          <div class="hud-name" v-html="shown.label_html || shown.label || shown.name"></div>
          <dl class="hud-rows">
            <dt>date</dt><dd>{{ shown.date_text || fmtDate(shown.date) }}</dd>
            <dt>mass</dt><dd>{{ shown.mass_text ? shown.mass_text + ' MeV' : fmtMass(shown) }}</dd>
            <template v-if="shown.width_text"><dt>width</dt><dd>{{ shown.width_text }} MeV</dd></template>
            <template v-if="shown.significance"><dt>significance</dt><dd>{{ shown.significance }}</dd></template>
            <template v-if="shown.channel"><dt>channel</dt><dd v-html="subscriptHtml(shown.channel)"></dd></template>
            <dt>quarks</dt><dd class="hud-tex">{{ (shown.quarks || '').replace(/\\bar\{(\w)\}/g, '$1̄').replace(/[${}]/g, '') }}</dd>
            <dt>status</dt><dd>{{ shown.status }}<span v-if="shown.note" class="hud-note" v-html="subscriptHtml(shown.note)"></span></dd>
            <dt>reference</dt><dd>{{ shown.experiment ? shown.experiment + ', ' + shown.ref : shown.ref }}</dd>
          </dl>
        </SpacePanel>
        <SpacePanel v-if="stopFigure" class="hud-figure" :kicker="subscriptHtml(stopFigure.caption)" plain>
          <img class="space-figure" :src="stopFigure.src" :alt="stopFigure.alt || stopFigure.caption" />
          <p v-if="stopFigure.see" class="hud-see" v-html="subscriptHtml(stopFigure.see)"></p>
        </SpacePanel>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hadron-space {
  --bg: #050507; --fg: #f2f5f9; --dim: #8b97a6; --accent: #7dd3fc;
  position: absolute; inset: 0; overflow: hidden;
  font-family: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--fg);
  background:
    radial-gradient(1100px 700px at 78% -8%, rgba(125, 211, 252, 0.07), transparent 62%),
    radial-gradient(900px 600px at -12% 108%, rgba(125, 211, 252, 0.05), transparent 60%),
    var(--bg);
}
.field { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 1.2s ease; }
.ready .field { opacity: 1; }
.static-bg .field { display: none; }
/* Scrim between the world and the slide: keeps body copy legible over a busy
   pose. Opacity comes from `dim` (frontmatter `space.dim`, else the layout). */
.scrim {
  position: absolute; inset: 0; pointer-events: none;
  transition: opacity 0.6s ease;
  background: linear-gradient(180deg, rgba(5, 5, 7, 0.96) 0%, rgba(5, 5, 7, 0.88) 62%, rgba(5, 5, 7, 0.45) 100%);
}
.grain {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* stop HUD: record left, figure right; sizes in px against the 980-wide canvas */
.hud { position: absolute; inset: 0; display: grid; grid-template-columns: 340px 1fr; gap: 24px; padding: 60px 44px 48px; align-items: start; pointer-events: none; }
.hud-card { align-self: end; }
.hud-name { font-size: 36px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.05; margin: 2px 0 12px; }
.hud-rows { display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; margin: 0; font-size: 15px; line-height: 1.4; }
.hud-rows dt { color: var(--dim); text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; padding-top: 3px; }
.hud-rows dd { margin: 0; color: var(--fg); }
.hud-note { display: block; color: var(--dim); }
.hud-figure { justify-self: end; align-self: start; max-width: 560px; background: rgba(5, 5, 7, 0.78); }
/* Figure height budget: the grid row is 551 − 60 − 48 = 443 px; kicker (20)
   + image + `see` (two lines, 50) + panel padding (38) must fit, or the row
   grows past the frame and clips both the `see` line and the record's last
   row (seen 2026-09-09 at 420 px). */
.space-figure { display: block; max-width: 100%; max-height: 320px; border-radius: 6px; background: #fff; opacity: 0.94; }
.hud-see { margin: 10px 0 0; font-size: 14px; line-height: 1.4; color: var(--fg); max-width: 100%; }
.hud-enter-active, .hud-leave-active { transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.hud-enter-from, .hud-leave-to { opacity: 0; transform: translateY(8px); }
</style>
