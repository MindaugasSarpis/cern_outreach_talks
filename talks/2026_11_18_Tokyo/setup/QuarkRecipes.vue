<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'

// <QuarkRecipes />: the six quarks in the Standard Model's frame, then the recipes one after
// another (owner, 5 Nov 2026: "a frame of all SM quarks, and then how they form baryons and
// mesons, with different combinations (like an active slide, many of them)"). Each hadron's
// quarks fly out of their cells in the frame into its ring, which then takes its name. Mesons
// (a quark and an antiquark), baryons (three), and last five: a pentaquark. Top stays dim:
// it decays before it can bind ("just t quark doesn't hadronize"). Flat 2D, so it is sharp on
// a 1280 × 800 projector and costs a slow laptop nothing. It runs once on entering the slide and
// holds; in print and in the previews it shows its last state.

const FLAV = {
  u: { name: 'up', col: '#9fd8ff', cell: [0, 0] },
  c: { name: 'charm', col: '#5fe0c0', cell: [1, 0] },
  t: { name: 'top', col: '#8c96a3', cell: [2, 0] },
  d: { name: 'down', col: '#7aa2ff', cell: [0, 1] },
  s: { name: 'strange', col: '#ff8f7a', cell: [1, 1] },
  b: { name: 'bottom', col: '#c3a2ff', cell: [2, 1] },
}
// the frame: cells 92 px, 10 px apart, from (56, 128)
const CX = 56, CY = 128, CELL = 92, GAP = 10
const cellCentre = (q) => { const [i, j] = FLAV[q].cell; return [CX + i * (CELL + GAP) + CELL / 2, CY + j * (CELL + GAP) + 38] }

// quark content: a lower-case letter, '~' before it for the antiquark
const MESONS = [
  ['π<sup>+</sup>', 'u ~d'], ['K<sup>+</sup>', 'u ~s'], ['D<sup>0</sup>', 'c ~u'],
  ['J/ψ', 'c ~c'], ['B<sup>+</sup>', 'u ~b'], ['Υ', 'b ~b'],
]
const BARYONS = [
  ['p', 'u u d'], ['n', 'u d d'], ['Λ', 'u d s'], ['Ω<sup>−</sup>', 's s s'],
  ['Λ<sub>c</sub><sup>+</sup>', 'u d c'], ['Ξ<sub>cc</sub><sup>++</sup>', 'u c c'], ['Λ<sub>b</sub><sup>0</sup>', 'u d b'],
]
const PENTA = [['P<sub>c</sub><sup>+</sup>', 'u u d c ~c']]

const BAND_X = 384, STEP = 80
// the pentaquark's label stands left of its ring, the others above their row
const PENTA_LABEL_X = BAND_X + 3 * STEP + STEP / 2 - 200
const BANDS = [
  { key: 'mesons', label: 'mesons', y: 20, list: MESONS, r: 34 },
  { key: 'baryons', label: 'baryons', y: 185, list: BARYONS, r: 36 },
  { key: 'penta', label: 'pentaquark', y: 352, list: PENTA, r: 50 },
]
const offsets = (n, r) => {
  if (n === 2) return [[-r * 0.42, 0], [r * 0.42, 0]]
  const k = n === 3 ? 0.42 : 0.56
  return Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [Math.cos(a) * r * k, Math.sin(a) * r * k] })
}

const hadrons = []
for (const band of BANDS) {
  band.list.forEach(([name, content], i) => {
    const qs = content.split(' ').map((s) => ({ q: s.replace('~', ''), anti: s.startsWith('~') }))
    const x = band.key === 'penta' ? BAND_X + 3 * STEP + STEP / 2 : BAND_X + i * STEP + STEP / 2
    const y = band.y + 62
    const off = offsets(qs.length, band.r)
    hadrons.push(reactive({
      band: band.key, name, r: band.r, x, y, stage: 0,   // 0 hidden, 1 quarks flying, 2 formed
      label: qs.map((o) => (o.anti ? `<span class="bar">${o.q}</span>` : o.q)).join(''),
      quarks: qs.map((o, k) => ({ ...o, col: FLAV[o.q].col, from: cellCentre(o.q), to: [x + off[k][0], y + off[k][1]] })),
    }))
  })
}

const { $renderContext } = useSlideContext()
const nav = useNav()
const live = () => $renderContext?.value === 'slide' && !nav.isPrintMode?.value
const still = computed(() => $renderContext?.value !== 'slide' || !!nav.isPrintMode?.value)

const frameIn = ref(0)        // cells shown
const topDim = ref(false)
const bandsIn = reactive({ mesons: false, baryons: false, penta: false })
const phase = ref('Six quarks')

let timers = []
const at = (ms, fn) => timers.push(setTimeout(fn, ms))
function reset() {
  timers.forEach(clearTimeout); timers = []
  frameIn.value = 0; topDim.value = false; phase.value = 'Six quarks'
  for (const k in bandsIn) bandsIn[k] = false
  for (const h of hadrons) h.stage = 0
}
function finish() {
  frameIn.value = 6; topDim.value = true
  for (const k in bandsIn) bandsIn[k] = true
  for (const h of hadrons) h.stage = 2
  phase.value = '…and five quarks: a pentaquark'
}
function run() {
  reset()
  for (let i = 1; i <= 6; i++) at(300 + i * 160, () => { frameIn.value = i })
  at(2600, () => { topDim.value = true })
  let t = 3600
  for (const band of BANDS) {
    const b = band.key
    at(t, () => {
      bandsIn[b] = true
      phase.value = b === 'mesons' ? 'Mesons: a quark and an antiquark' : b === 'baryons' ? 'Baryons: three quarks' : '…and five quarks: a pentaquark'
    })
    t += 700
    for (const h of hadrons.filter((x) => x.band === b)) {
      at(t, () => { h.stage = 1 })              // the quarks leave their cells
      at(t + 950, () => { h.stage = 2 })        // they have arrived: the ring and the name
      t += b === 'penta' ? 1400 : 1250
    }
    t += 900
  }
}

if (still.value) finish()
onSlideEnter(() => { if (live()) run(); else finish() })
onSlideLeave(() => { timers.forEach(clearTimeout); timers = [] })
onUnmounted(() => timers.forEach(clearTimeout))

const ballStyle = (h, q) => {
  const [x, y] = h.stage === 0 ? q.from : q.to
  return { transform: `translate(${x}px, ${y}px)`, opacity: h.stage === 0 ? 0 : 1, '--col': q.col }
}
</script>

<template>
  <div class="qr" :class="{ still }">
    <!-- the frame: up, charm, top over down, strange, bottom -->
    <div class="qr-frame" :style="{ left: CX - 12 + 'px', top: CY - 12 + 'px', width: 3 * CELL + 2 * GAP + 24 + 'px', height: 2 * CELL + GAP + 24 + 'px' }" />
    <template v-for="(f, q, n) in FLAV" :key="q">
      <div class="qr-cell" :class="{ on: frameIn > n, dim: q === 't' && topDim }"
        :style="{ left: CX + f.cell[0] * (CELL + GAP) + 'px', top: CY + f.cell[1] * (CELL + GAP) + 'px', width: CELL + 'px', height: CELL + 'px', '--col': f.col }">
        <span class="sym">{{ q }}</span><span class="nm">{{ f.name }}</span>
      </div>
    </template>
    <div class="qr-topnote" :class="{ on: topDim }" :style="{ left: CX + 'px', top: CY + 2 * CELL + GAP + 22 + 'px' }">top decays before it can bind</div>

    <!-- the bands -->
    <div v-for="b in BANDS" :key="b.key" class="qr-band" :class="{ on: bandsIn[b.key] }" :style="{ left: (b.key === 'penta' ? PENTA_LABEL_X : BAND_X) + 'px', top: (b.key === 'penta' ? b.y + 48 : b.y) + 'px' }">{{ b.label }}</div>
    <template v-for="(h, i) in hadrons" :key="i">
      <div class="qr-ring" :class="{ on: h.stage === 2, penta: h.band === 'penta' }"
        :style="{ left: h.x - h.r + 'px', top: h.y - h.r + 'px', width: 2 * h.r + 'px', height: 2 * h.r + 'px' }" />
      <div v-for="(q, k) in h.quarks" :key="k" class="qr-ball" :class="{ anti: q.anti, flying: h.stage === 1 }" :style="ballStyle(h, q)">
        <span :class="{ bar: q.anti }">{{ q.q }}</span>
      </div>
      <div class="qr-name" :class="{ on: h.stage === 2 }" :style="{ left: h.x - 60 + 'px', top: h.y + h.r + 6 + 'px' }">
        <span class="n" v-html="h.name" /><span class="c" v-html="h.label" />
      </div>
    </template>

    <div class="cap qr-cap">{{ phase }}</div>
  </div>
</template>

<style scoped>
.qr { position: absolute; inset: 0; pointer-events: none; font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; }
.qr-frame { position: absolute; border: 1px solid rgba(159, 216, 255, 0.35); border-radius: 12px; background: rgba(3, 5, 12, 0.55); }
.qr-cell {
  position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0; transform: scale(0.85); transition: opacity 0.5s ease, transform 0.5s ease, filter 0.8s ease;
}
.qr-cell.on { opacity: 1; transform: none; }
.qr-cell.dim { opacity: 0.32; filter: grayscale(1); }
.qr-cell .sym { font-size: 40px; font-weight: 600; line-height: 1; color: var(--col); text-shadow: 0 0 14px color-mix(in srgb, var(--col) 55%, transparent); }
.qr-cell .nm { font-size: 18px; color: #cfe6ff; letter-spacing: 0.03em; }
.qr-topnote { position: absolute; font-size: 18px; color: #9fb4c8; opacity: 0; transition: opacity 0.8s ease; }
.qr-topnote.on { opacity: 1; }
.qr-band { position: absolute; font-size: 20px; color: #9fd8ff; letter-spacing: 0.03em; opacity: 0; transition: opacity 0.6s ease; white-space: nowrap; }
.qr-band.on { opacity: 1; }
.qr-ring {
  position: absolute; border-radius: 50%; border: 1.5px solid rgba(159, 216, 255, 0.55);
  background: radial-gradient(circle, rgba(125, 211, 252, 0.10), rgba(125, 211, 252, 0) 70%);
  opacity: 0; transform: scale(1.35); transition: opacity 0.5s ease, transform 0.5s ease;
}
.qr-ring.on { opacity: 1; transform: none; }
.qr-ring.penta.on { border-color: rgba(232, 246, 255, 0.85); box-shadow: 0 0 28px rgba(125, 211, 252, 0.45); }
.qr-ball {
  position: absolute; left: -15px; top: -15px; width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--col); color: #03050c; font-size: 18px; font-weight: 700;
  box-shadow: 0 0 12px color-mix(in srgb, var(--col) 70%, transparent);
  transition: transform 0.95s cubic-bezier(0.45, 0, 0.2, 1), opacity 0.3s ease;
}
.qr-ball.anti { background: #03050c; color: var(--col); border: 2.5px solid var(--col); }
.qr-name { position: absolute; width: 120px; display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 0.5s ease 0.15s; }
.qr-name.on { opacity: 1; }
.qr-name .n { font-size: 22px; font-weight: 600; color: #e8f6ff; line-height: 1.15; }
.qr-name .c { margin-top: 10px; font-size: 18px; line-height: 1.3; color: #9fd8ff; letter-spacing: 0.06em; }
.qr-name :deep(.bar) { text-decoration: overline; text-decoration-thickness: 2px; }
/* the antiquark's bar over its letter in the ball, drawn (an overline at this size sat on the ball's edge) */
.qr-ball .bar { position: relative; }
.qr-ball .bar::before { content: ''; position: absolute; left: -1px; right: -1px; top: 1px; height: 2px; background: currentColor; }
.qr-cap { max-width: 330px; }
.still * { transition: none !important; }
</style>
