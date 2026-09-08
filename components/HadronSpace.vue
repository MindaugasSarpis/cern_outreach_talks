<script setup>
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { createSpace } from './hadron-space/space.js'
import SpacePanel from './SpacePanel.vue'

// The persistent 3D hadron space under a whole deck. Mount ONCE from the
// deck's global-bottom.vue. Each slide steers the camera through its
// frontmatter:
//
//   space:
//     at: Pc(4312)        # hadron id | wide | origin | future | [x, y, z]
//     dist: 7  yaw: -25  pitch: 8
//     stops: [Pc(4312), Pc(4440), Pc(4457)]   # click k flies to stops[k-1]
//   clicks: 3                                  # = stops.length
//
// A slide without `space` keeps the previous pose. While a stop is active
// the state's record is shown on the left and its paper figure (from
// data.figures) on the right, both as SpacePanels. Data: public/data/
// hadrons.json (scripts/hadrons.py). Without WebGL2 float render targets,
// or under reduced motion, only the static gradient is drawn.

const props = defineProps({
  src: { type: String, default: 'data/hadrons.json' },
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
  if (reduced || !webgl2Ok()) { staticBg.value = true; return }
  try {
    const base = import.meta.env.BASE_URL || '/'
    const r = await fetch(base.replace(/\/?$/, '/') + props.src)
    data.value = await r.json()
    space = createSpace(canvas.value, root.value, { data: data.value, onArrive: () => { arrived.value = true } })
  } catch {
    space = null
  }
  if (!space) { staticBg.value = true; return }
  ready.value = true
  apply(true)
}

const onVisibility = () => space?.setPaused(document.hidden)
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility)
  boot()
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  space?.dispose()
  space = null
})
</script>

<template>
  <div ref="root" class="hadron-space" :class="{ 'static-bg': staticBg, ready }">
    <canvas ref="canvas" class="field" aria-hidden="true"></canvas>
    <div class="grain" aria-hidden="true"></div>
    <Transition name="hud">
      <div v-if="stopState && arrived" class="hud" :key="stopState.id">
        <SpacePanel kicker="state" class="hud-card">
          <div class="hud-name">{{ stopState.label || stopState.name }}</div>
          <dl class="hud-rows">
            <dt>date</dt><dd>{{ fmtDate(stopState.date) }}</dd>
            <dt>mass</dt><dd>{{ fmtMass(stopState) }}</dd>
            <dt>quarks</dt><dd class="hud-tex">{{ stopState.quarks.replace(/\\bar\{(\w)\}/g, '$1̄').replace(/[${}]/g, '') }}</dd>
            <dt>experiment</dt><dd>{{ stopState.experiment }}</dd>
            <dt>status</dt><dd>{{ stopState.status }}<span v-if="stopState.note"> · {{ stopState.note }}</span></dd>
            <dt>reference</dt><dd>{{ stopState.ref }}</dd>
          </dl>
        </SpacePanel>
        <SpacePanel v-if="stopFigure" class="hud-figure" :kicker="stopFigure.caption">
          <img class="space-figure" :src="stopFigure.src" :alt="stopFigure.alt || stopFigure.caption" />
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
.grain {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* stop HUD: record left, figure right; sizes in px against the 980-wide canvas */
.hud { position: absolute; inset: 0; display: grid; grid-template-columns: 290px 1fr; gap: 24px; padding: 60px 44px 48px; align-items: start; pointer-events: none; }
.hud-card { align-self: end; }
.hud-name { font-size: 30px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.05; margin: 2px 0 12px; }
.hud-rows { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; margin: 0; font-size: 11px; line-height: 1.5; }
.hud-rows dt { color: var(--dim); text-transform: uppercase; letter-spacing: 0.12em; font-size: 9.5px; padding-top: 2px; }
.hud-rows dd { margin: 0; color: var(--fg); }
.hud-figure { justify-self: end; align-self: start; max-width: 460px; }
.space-figure { display: block; max-width: 100%; max-height: 360px; border-radius: 6px; background: #fff; }
.hud-enter-active, .hud-leave-active { transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.hud-enter-from, .hud-leave-to { opacity: 0; transform: translateY(8px); }
</style>
