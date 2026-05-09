<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Iconic quantum demonstration: particles fired one at a time at a barrier
// with two slits land at random positions on the screen behind, but their
// distribution builds up an interference pattern. Clicking the SVG (when
// `interactive`) clears the accumulated hits and restarts.
//
// We don't show the particle going through one slit or the other — that
// would lie about the physics. Particles fade as they reach the barrier
// and reappear as hits at a position sampled from cos²(α·y) × Gaussian.
const props = withDefaults(defineProps<{
  // Frames between successive launches (60 fps). Smaller = more particles.
  launchInterval?: number
  // Maximum hits retained on screen before the oldest get reused (rolling).
  maxHits?: number
  // Number of bright fringes within the Gaussian envelope.
  fringes?: number
  // Click to clear & restart.
  interactive?: boolean
  // Show the analytical envelope as a faint curve behind the dots.
  showEnvelope?: boolean
}>(), {
  launchInterval: 5,
  maxHits: 1200,
  fringes: 6,
  interactive: true,
  showEnvelope: true,
})

const W = 1920
const H = 1080
const SOURCE_X = 220
const BARRIER_X = 760
const SCREEN_X = 1700
const CY = 540
const SLIT_HALF = 22
const SLIT_SEP = 90    // half-distance between slit centers
const ENV_SIGMA = 230  // Gaussian envelope on the screen
const FRINGE_SPACING = computed(() => (2 * ENV_SIGMA) / (props.fringes - 0.5))

interface Particle {
  startTick: number
  yOffset: number   // small jitter so particles don't all sit on the axis
}

interface Hit {
  y: number
  age: number       // frames since landing — used for fade-in
}

const tickN = ref(0)
const flying = ref<Particle[]>([])
const hits = ref<Hit[]>([])
let raf: number | null = null

// Sample y from |ψ|² ∝ cos²(π·y / s) · exp(-y²/(2σ²)) via rejection sampling.
function sampleHitY(): number {
  const s = FRINGE_SPACING.value
  for (let i = 0; i < 200; i++) {
    const y = (Math.random() - 0.5) * 2 * (3 * ENV_SIGMA)
    const env = Math.exp(-(y * y) / (2 * ENV_SIGMA * ENV_SIGMA))
    const fringe = Math.cos((Math.PI * y) / s) ** 2
    const p = env * fringe
    if (Math.random() < p) return CY + y
  }
  // Fallback: pure envelope.
  return CY + (Math.random() - 0.5) * 2 * ENV_SIGMA
}

function step() {
  tickN.value += 1

  if (tickN.value % props.launchInterval === 0) {
    flying.value.push({
      startTick: tickN.value,
      yOffset: (Math.random() - 0.5) * 16,
    })
  }

  // Move flying particles. Source → barrier (~30 frames) → screen (~50 frames).
  const travelFrames = 60
  const remaining: Particle[] = []
  for (const p of flying.value) {
    const age = tickN.value - p.startTick
    if (age >= travelFrames) {
      hits.value.push({ y: sampleHitY(), age: 0 })
      if (hits.value.length > props.maxHits) hits.value.shift()
    } else {
      remaining.push(p)
    }
  }
  flying.value = remaining

  for (const h of hits.value) h.age += 1

  raf = requestAnimationFrame(step)
}

const flyingDots = computed(() =>
  flying.value.map((p) => {
    const age = tickN.value - p.startTick
    const t = Math.min(1, age / 60)
    // Linear from source to a point near the barrier at t=0.5, then fade out
    // as it "diffracts" through both slits.
    const x = SOURCE_X + (BARRIER_X + 60 - SOURCE_X) * Math.min(1, t * 1.4)
    const y = CY + p.yOffset
    const opacity = t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3)
    return { x, y, opacity }
  })
)

const envelopePath = computed(() => {
  if (!props.showEnvelope) return ''
  const s = FRINGE_SPACING.value
  const pts: string[] = []
  const baseline = 1020
  const peakHeight = 220
  for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += 4) {
    const env = Math.exp(-(dy * dy) / (2 * ENV_SIGMA * ENV_SIGMA))
    const fringe = Math.cos((Math.PI * dy) / s) ** 2
    const intensity = env * fringe
    const y = CY + dy
    const x = SCREEN_X + 30 + intensity * peakHeight
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return `M ${pts[0]} L ${pts.slice(1).join(' L ')}`
    + ` L ${SCREEN_X + 30},${CY + 3 * ENV_SIGMA} L ${SCREEN_X + 30},${CY - 3 * ENV_SIGMA} Z`
})

function reset() {
  if (!props.interactive) return
  hits.value = []
  flying.value = []
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
    <!-- Optical-bench baseline -->
    <line :x1="0" :y1="CY" :x2="W" :y2="CY"
          stroke="white" stroke-width="2" stroke-opacity="0.10" stroke-dasharray="4 12" />

    <!-- Source -->
    <circle :cx="SOURCE_X" :cy="CY" r="14" fill="white" />
    <circle :cx="SOURCE_X" :cy="CY" r="26" fill="white" fill-opacity="0.15" />

    <!-- Barrier with two slits -->
    <g>
      <rect :x="BARRIER_X - 14" :y="0" width="28"
            :height="CY - SLIT_SEP - SLIT_HALF"
            fill="white" fill-opacity="0.85" />
      <rect :x="BARRIER_X - 14"
            :y="CY - SLIT_SEP + SLIT_HALF"
            width="28"
            :height="2 * (SLIT_SEP - SLIT_HALF)"
            fill="white" fill-opacity="0.85" />
      <rect :x="BARRIER_X - 14"
            :y="CY + SLIT_SEP + SLIT_HALF"
            width="28"
            :height="H - (CY + SLIT_SEP + SLIT_HALF)"
            fill="white" fill-opacity="0.85" />
    </g>

    <!-- Detector screen -->
    <line :x1="SCREEN_X" :y1="80" :x2="SCREEN_X" :y2="H - 80"
          stroke="white" stroke-width="3" stroke-opacity="0.4" />

    <!-- Analytical envelope (thin reference curve) -->
    <path v-if="props.showEnvelope" :d="envelopePath"
          fill="white" fill-opacity="0.06" stroke="white"
          stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Flying particles approaching the barrier -->
    <circle v-for="(d, i) in flyingDots" :key="`f-${i}`"
            :cx="d.x" :cy="d.y" r="6" fill="white" :opacity="d.opacity" />

    <!-- Accumulated hits on the screen -->
    <circle v-for="(h, i) in hits" :key="`h-${i}`"
            :cx="SCREEN_X" :cy="h.y" r="4"
            fill="white"
            :opacity="Math.min(1, h.age / 6)" />

    <!-- Labels -->
    <text :x="SOURCE_X" :y="CY + 80" text-anchor="middle"
          fill="white" fill-opacity="0.7" font-size="32">Šaltinis</text>
    <text :x="BARRIER_X" :y="CY - SLIT_SEP - 30" text-anchor="middle"
          fill="white" fill-opacity="0.7" font-size="28">Du plyšiai</text>
    <text :x="SCREEN_X" :y="CY - 3 * ENV_SIGMA - 30" text-anchor="middle"
          fill="white" fill-opacity="0.7" font-size="28">Detektorius</text>
  </svg>
</template>
