<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// A wave packet (cat-as-superposition) is bombarded by environmental
// "particles" — air molecules, photons. Each interaction collapses a bit
// of the wave's coherence; the envelope contracts toward a single
// localized peak. After full collapse, the diagram briefly pauses and
// resets so the loop is self-contained for the slide.
//
// Click to manually reset (interactive=true).
const props = withDefaults(defineProps<{
  // Frames between successive environmental hits (60 fps).
  hitInterval?: number
  // Initial Gaussian envelope width.
  startSigma?: number
  // Sigma at which we declare full collapse and pause.
  collapsedSigma?: number
  // Frames spent in the "collapsed" state before auto-resetting.
  pauseFrames?: number
  // Click to reset.
  interactive?: boolean
}>(), {
  hitInterval: 18,
  startSigma: 280,
  collapsedSigma: 14,
  pauseFrames: 110,
  interactive: true,
})

const W = 1920
const H = 1080
const CX = W / 2
const CY = 540

interface EnvParticle {
  x: number
  y: number
  vx: number
  vy: number
  bornTick: number
  hitAtTick: number | null
  hitX: number
}

interface Flash {
  x: number
  bornTick: number
}

const tickN = ref(0)
const sigma = ref(props.startSigma)
const phase = ref<'spreading' | 'collapsing' | 'collapsed'>('spreading')
const collapsedAt = ref(0)
const env = ref<EnvParticle[]>([])
const flashes = ref<Flash[]>([])
let raf: number | null = null

function spawnEnvParticle() {
  // Particle enters from a random edge, heading toward a random point on
  // the wave (around the central x ± startSigma). Linear motion until it
  // crosses the wave's vertical band, where it "hits".
  const targetX = CX + (Math.random() - 0.5) * 2 * props.startSigma
  const targetY = CY
  const fromTop = Math.random() < 0.5
  const x = Math.random() * W
  const y = fromTop ? -40 : H + 40
  const dx = targetX - x
  const dy = targetY - y
  const dist = Math.hypot(dx, dy)
  const speed = 8 + Math.random() * 4
  return {
    x, y,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    bornTick: tickN.value,
    hitAtTick: null,
    hitX: targetX,
  }
}

function step() {
  tickN.value += 1

  // Hit cadence (only while the wave still has coherence to lose).
  if (phase.value !== 'collapsed' && tickN.value % props.hitInterval === 0) {
    env.value.push(spawnEnvParticle())
  }

  // Move env particles; register hit when they cross the central band.
  const remaining: EnvParticle[] = []
  for (const p of env.value) {
    if (p.hitAtTick === null) {
      p.x += p.vx
      p.y += p.vy
      const inBand = Math.abs(p.y - CY) < 20
      const arrived = inBand && Math.abs(p.x - p.hitX) < Math.abs(p.vx) + 1
      if (arrived) {
        p.hitAtTick = tickN.value
        flashes.value.push({ x: p.x, bornTick: tickN.value })
        // Each hit shrinks sigma by a fraction; later hits matter less
        // (asymptotic toward collapsedSigma).
        const target = props.collapsedSigma
        sigma.value = sigma.value * 0.78 + target * 0.22
        if (sigma.value <= target * 1.05) {
          sigma.value = target
          phase.value = 'collapsed'
          collapsedAt.value = tickN.value
        } else {
          phase.value = 'collapsing'
        }
        continue   // drop the particle once it has hit
      }
      // Cull off-screen.
      if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) continue
      remaining.push(p)
    }
  }
  env.value = remaining

  // Age flashes; remove old ones.
  flashes.value = flashes.value.filter(f => tickN.value - f.bornTick < 18)

  // Auto-reset after a pause in the collapsed state.
  if (phase.value === 'collapsed' && tickN.value - collapsedAt.value > props.pauseFrames) {
    reset(true)
  }

  raf = requestAnimationFrame(step)
}

function reset(_auto = false) {
  sigma.value = props.startSigma
  phase.value = 'spreading'
  env.value = []
  flashes.value = []
  collapsedAt.value = 0
}

function handleClick() {
  if (!props.interactive) return
  reset(false)
}

const hitsCount = computed(() => {
  // Crude proxy: how many hits since the last reset, derived from sigma decay.
  const ratio = Math.log(sigma.value / props.startSigma) /
                Math.log(props.collapsedSigma / props.startSigma)
  return Math.max(0, Math.round(ratio * 10))
})

const wavePath = computed(() => {
  const A = 280
  const k = 0.045
  const omega = 0.18
  const xc = CX
  const sig = sigma.value
  const pts: string[] = []
  for (let x = 0; x <= W; x += 3) {
    const envel = Math.exp(-((x - xc) ** 2) / (2 * sig * sig))
    const carrier = Math.cos(k * (x - xc) - omega * tickN.value)
    const y = CY + A * envel * carrier
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M ${pts.join(' L ')}`
})

const dotOpacity = computed(() =>
  phase.value === 'collapsed' ? 1 :
  phase.value === 'collapsing' ?
    Math.max(0, 1 - (sigma.value - props.collapsedSigma) /
                    (props.startSigma - props.collapsedSigma)) :
    0
)

const wavePathOpacity = computed(() => 1 - dotOpacity.value)
</script>

<template>
  <svg
    viewBox="0 0 1920 1080"
    class="absolute inset-0 w-full h-full"
    :class="{ 'cursor-pointer': props.interactive }"
    preserveAspectRatio="xMidYMid meet"
    @click.stop="handleClick"
    @mousedown.stop
    @mouseup.stop
    @pointerdown.stop
    @pointerup.stop
    @wheel.stop
    @touchstart.stop
    @touchend.stop
  >
    <line :x1="0" :y1="CY" :x2="W" :y2="CY"
          stroke="white" stroke-width="2" stroke-opacity="0.12" />

    <!-- Wave (superposition envelope) -->
    <path :d="wavePath"
          stroke="white" stroke-width="6" fill="none" stroke-linecap="round"
          :style="{ opacity: wavePathOpacity }" />

    <!-- Localized dot once collapsed -->
    <circle :cx="CX" :cy="CY" r="20" fill="white"
            :style="{ opacity: dotOpacity }" />

    <!-- Flashes at hit points -->
    <g v-for="f in flashes" :key="`fl-${f.bornTick}-${f.x}`">
      <circle :cx="f.x" :cy="CY" :r="36 - (tickN - f.bornTick) * 1.6"
              fill="none" stroke="white" stroke-width="3"
              :stroke-opacity="Math.max(0, 1 - (tickN - f.bornTick) / 18)" />
    </g>

    <!-- Environmental particles (small dots with short trail) -->
    <g>
      <circle v-for="(p, i) in env" :key="`env-${i}`"
              :cx="p.x" :cy="p.y" r="5"
              fill="white" fill-opacity="0.7" />
    </g>

    <!-- Status readout -->
    <g transform="translate(120, 120)">
      <text fill="white" fill-opacity="0.65" font-size="32">
        Aplinkos sąveikos: {{ hitsCount }}
      </text>
      <text :y="48" fill="white" fill-opacity="0.55" font-size="26">
        τ<tspan font-size="20" baseline-shift="sub">decoh.</tspan>
        ≈ 10⁻²⁰ s
      </text>
    </g>
    <g transform="translate(1800, 120)" v-if="phase === 'collapsed'">
      <text text-anchor="end" fill="white" fill-opacity="0.85" font-size="36">
        Lokalizuota
      </text>
    </g>
  </svg>
</template>
