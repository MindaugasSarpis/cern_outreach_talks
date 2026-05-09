<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Side-by-side detectors fed by a central source emitting entangled pairs.
// Each individual detector's record is random (~50/50). Each PAIR is
// anti-correlated: whichever spin shows up on the left, the right shows
// the opposite. Visual makes "individually random, jointly correlated"
// obvious — the two history strips are exact mirrors.
//
// The slide text/cards still need to make the no-FTL argument explicitly:
// the correlation is only visible after the two records are compared,
// and that comparison itself travels at the speed of light.
const props = withDefaults(defineProps<{
  // Frames between successive pair emissions (60 fps = ~1s default).
  pairInterval?: number
  // Number of recent pairs visible in each history strip.
  visiblePairs?: number
  // Click to clear and restart.
  interactive?: boolean
  // Anti-correlated (singlet) vs correlated (triplet); both demonstrate
  // the point. Singlet (default) feels iconic for popular talks.
  correlation?: 'anti' | 'same'
}>(), {
  pairInterval: 60,
  visiblePairs: 12,
  interactive: true,
  correlation: 'anti',
})

const W = 1920
const H = 1080
const CX = W / 2
const SOURCE_Y = 360
const STRIP_Y = 720
const STRIP_HEIGHT = 110
const STRIP_GAP = 40
const STRIP_PAD_X = 200      // horizontal padding from canvas edge

const cellWidth = computed(
  () => (W - 2 * STRIP_PAD_X) / props.visiblePairs
)

interface PairRecord {
  l: 1 | -1   // ↑ = +1, ↓ = -1
  r: 1 | -1
  bornTick: number
}

interface FlyingPair {
  startTick: number
  result: PairRecord
}

const tickN = ref(0)
const flying = ref<FlyingPair[]>([])
const history = ref<PairRecord[]>([])
const sourcePulse = ref(0)
let raf: number | null = null

const TRAVEL_FRAMES = 38
const MEASUREMENT_FLASH = 14

function makePair(): PairRecord {
  const l: 1 | -1 = Math.random() < 0.5 ? 1 : -1
  const r: 1 | -1 = props.correlation === 'anti' ? (-l as 1 | -1) : l
  return { l, r, bornTick: tickN.value }
}

function step() {
  tickN.value += 1

  if (tickN.value % props.pairInterval === 0) {
    flying.value.push({ startTick: tickN.value, result: makePair() })
    sourcePulse.value = 1
  }
  sourcePulse.value = Math.max(0, sourcePulse.value - 0.04)

  // Land arriving pairs into history.
  const remaining: FlyingPair[] = []
  for (const p of flying.value) {
    const age = tickN.value - p.startTick
    if (age >= TRAVEL_FRAMES) {
      history.value.unshift(p.result)
      if (history.value.length > props.visiblePairs) history.value.pop()
    } else {
      remaining.push(p)
    }
  }
  flying.value = remaining

  raf = requestAnimationFrame(step)
}

const flyingDots = computed(() => {
  // Each in-flight pair is two dots traveling outward from the source.
  return flying.value.flatMap((p) => {
    const t = (tickN.value - p.startTick) / TRAVEL_FRAMES
    const distance = (CX - STRIP_PAD_X - 60) * t
    return [
      { x: CX - distance, y: SOURCE_Y, color: '#94a3b8' },
      { x: CX + distance, y: SOURCE_Y, color: '#94a3b8' },
    ]
  })
})

// Detectors flash when a measurement just landed (last frame of travel).
const detectorFlash = computed(() => {
  let leftFlash = 0
  let rightFlash = 0
  let leftRecent: 1 | -1 | null = null
  let rightRecent: 1 | -1 | null = null
  if (history.value.length > 0) {
    const newest = history.value[0]
    const age = tickN.value - newest.bornTick - TRAVEL_FRAMES
    if (age >= 0 && age < MEASUREMENT_FLASH) {
      const intensity = 1 - age / MEASUREMENT_FLASH
      leftFlash = intensity
      rightFlash = intensity
      leftRecent = newest.l
      rightRecent = newest.r
    }
  }
  return { leftFlash, rightFlash, leftRecent, rightRecent }
})

const COLOR_UP = '#3b82f6'
const COLOR_DN = '#ef4444'
const colorFor = (s: 1 | -1) => (s === 1 ? COLOR_UP : COLOR_DN)
const arrowFor = (s: 1 | -1) => (s === 1 ? '↑' : '↓')

function reset() {
  if (!props.interactive) return
  flying.value = []
  history.value = []
}

onMounted(() => { raf = requestAnimationFrame(step) })
onUnmounted(() => { if (raf !== null) cancelAnimationFrame(raf) })
</script>

<template>
  <svg
    viewBox="0 0 1920 1080"
    class="absolute inset-0 w-full h-full"
    :class="{ 'cursor-pointer': props.interactive }"
    preserveAspectRatio="xMidYMid meet"
    @click.stop="reset"
    @mousedown.stop
    @mouseup.stop
    @pointerdown.stop
    @pointerup.stop
    @wheel.stop
    @touchstart.stop
    @touchend.stop
  >
    <!-- Beam line between detectors -->
    <line :x1="STRIP_PAD_X" :y1="SOURCE_Y" :x2="W - STRIP_PAD_X" :y2="SOURCE_Y"
          stroke="white" stroke-width="2" stroke-opacity="0.12" stroke-dasharray="4 12" />

    <!-- Left detector -->
    <g>
      <circle :cx="STRIP_PAD_X" :cy="SOURCE_Y" r="60"
              fill="white" :fill-opacity="0.08 + 0.55 * detectorFlash.leftFlash"
              stroke="white" stroke-width="3" stroke-opacity="0.6" />
      <text v-if="detectorFlash.leftRecent !== null"
            :x="STRIP_PAD_X" :y="SOURCE_Y + 24"
            text-anchor="middle" font-size="76" font-weight="700"
            :fill="colorFor(detectorFlash.leftRecent)"
            :opacity="detectorFlash.leftFlash">
        {{ arrowFor(detectorFlash.leftRecent) }}
      </text>
      <text :x="STRIP_PAD_X" :y="SOURCE_Y - 100" text-anchor="middle"
            fill="white" fill-opacity="0.75" font-size="32">A</text>
    </g>

    <!-- Source -->
    <circle :cx="CX" :cy="SOURCE_Y" :r="20 + 16 * sourcePulse"
            fill="white" :fill-opacity="0.4 + 0.6 * sourcePulse" />
    <circle :cx="CX" :cy="SOURCE_Y" r="48"
            fill="none" stroke="white"
            :stroke-opacity="0.2 + 0.5 * sourcePulse" stroke-width="2" />
    <text :x="CX" :y="SOURCE_Y - 100" text-anchor="middle"
          fill="white" fill-opacity="0.75" font-size="32">Susietos poros</text>

    <!-- Right detector -->
    <g>
      <circle :cx="W - STRIP_PAD_X" :cy="SOURCE_Y" r="60"
              fill="white" :fill-opacity="0.08 + 0.55 * detectorFlash.rightFlash"
              stroke="white" stroke-width="3" stroke-opacity="0.6" />
      <text v-if="detectorFlash.rightRecent !== null"
            :x="W - STRIP_PAD_X" :y="SOURCE_Y + 24"
            text-anchor="middle" font-size="76" font-weight="700"
            :fill="colorFor(detectorFlash.rightRecent)"
            :opacity="detectorFlash.rightFlash">
        {{ arrowFor(detectorFlash.rightRecent) }}
      </text>
      <text :x="W - STRIP_PAD_X" :y="SOURCE_Y - 100" text-anchor="middle"
            fill="white" fill-opacity="0.75" font-size="32">B</text>
    </g>

    <!-- In-flight particle dots -->
    <circle v-for="(d, i) in flyingDots" :key="`fly-${i}`"
            :cx="d.x" :cy="d.y" r="9" :fill="d.color" />

    <!-- History strips: A (left detector) on top, B (right) on bottom -->
    <g :transform="`translate(${STRIP_PAD_X}, ${STRIP_Y})`">
      <text :x="0" :y="-20" fill="white" fill-opacity="0.7" font-size="28">
        Detektoriaus A istorija
      </text>
      <rect v-for="(p, i) in history" :key="`a-${i}`"
            :x="i * cellWidth + 4" :y="0"
            :width="cellWidth - 8" :height="STRIP_HEIGHT"
            :fill="colorFor(p.l)" fill-opacity="0.9" rx="6" ry="6" />
      <text v-for="(p, i) in history" :key="`a-t-${i}`"
            :x="i * cellWidth + cellWidth / 2"
            :y="STRIP_HEIGHT / 2 + 22"
            text-anchor="middle" font-size="58" font-weight="700"
            fill="white">
        {{ arrowFor(p.l) }}
      </text>
    </g>

    <g :transform="`translate(${STRIP_PAD_X}, ${STRIP_Y + STRIP_HEIGHT + STRIP_GAP})`">
      <text :x="0" :y="-20" fill="white" fill-opacity="0.7" font-size="28">
        Detektoriaus B istorija
      </text>
      <rect v-for="(p, i) in history" :key="`b-${i}`"
            :x="i * cellWidth + 4" :y="0"
            :width="cellWidth - 8" :height="STRIP_HEIGHT"
            :fill="colorFor(p.r)" fill-opacity="0.9" rx="6" ry="6" />
      <text v-for="(p, i) in history" :key="`b-t-${i}`"
            :x="i * cellWidth + cellWidth / 2"
            :y="STRIP_HEIGHT / 2 + 22"
            text-anchor="middle" font-size="58" font-weight="700"
            fill="white">
        {{ arrowFor(p.r) }}
      </text>
    </g>

    <!-- Pair-correlation hint: faint vertical lines linking the two strips
         remind the viewer that columns = the same pair. -->
    <g v-for="(p, i) in history" :key="`link-${i}`" stroke="white" stroke-opacity="0.18">
      <line :x1="STRIP_PAD_X + i * cellWidth + cellWidth / 2"
            :y1="STRIP_Y + STRIP_HEIGHT"
            :x2="STRIP_PAD_X + i * cellWidth + cellWidth / 2"
            :y2="STRIP_Y + STRIP_HEIGHT + STRIP_GAP"
            stroke-width="2" />
    </g>
  </svg>
</template>
