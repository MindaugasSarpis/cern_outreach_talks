<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// A three-slide pedagogical story (set `mode`):
//
// 1. classical-no-barrier — balls fly straight from source to detector and
//    pile up in a single tight Gaussian. Establishes "balls go where you aim."
// 2. classical-slits — balls visibly take ONE of two slits each, accumulating
//    into two distinct bands behind the slits. Classical expectation.
// 3. quantum (default) — a plane wave is emitted from the source; when it hits
//    the barrier, two new circular wavefronts emerge from the slits and
//    interfere. No visible flying particles between source and barrier — the
//    wave does the travelling. Dots accumulate on the detector at sampled
//    positions, building up the cos²·Gaussian fringe pattern one at a time.
//
// The launch cadence ramps from one-per-second to a spray, so the audience
// sees individual events first and then watches the pattern fill in.
//
// Clicking the SVG (when `interactive`) clears accumulated hits and restarts.
const props = withDefaults(defineProps<{
  mode?: 'classical-no-barrier' | 'classical-slits' | 'quantum'
  // Steady-state frames between launches (60 fps). Smaller = faster spray.
  launchInterval?: number
  // Launches at the slow opening pace before the ramp begins.
  slowStartCount?: number
  // Frames between launches during the slow opening (default ~0.83 s).
  slowStartInterval?: number
  // How many launches the slow→fast ramp lasts.
  rampLaunches?: number
  // Maximum hits retained on screen before the oldest get reused (rolling).
  maxHits?: number
  // Click to clear & restart.
  interactive?: boolean
  // Show the analytical envelope as a faint curve behind the dots.
  showEnvelope?: boolean
  // In quantum mode, draw the plane wave and slit wavefronts.
  showWaves?: boolean
}>(), {
  mode: 'quantum',
  launchInterval: 30,
  slowStartCount: 5,
  slowStartInterval: 90,
  rampLaunches: 25,
  maxHits: 1200,
  interactive: true,
  showEnvelope: true,
  showWaves: true,
})

const W = 1920
const H = 1080
const SOURCE_X = 220
const BARRIER_X = 760
const SCREEN_X = 1700
const CY = 540
const SLIT_HALF = 22
const SLIT_SEP = 120   // half-distance between slit centers
const ENV_SIGMA = 230  // Gaussian envelope on the screen (quantum)

// Classical spreads — chosen for visible distinct cluster(s) on the screen.
const CLASSICAL_NO_BARRIER_SIGMA = 70   // single tight Gaussian at center
const CLASSICAL_SLIT_BAND_SIGMA = 30    // band width behind each slit

// Fraction of classical-slits balls that hit the barrier instead of a slit.
// Audience needs to see "most balls bounce off the wall, only the lucky ones
// make it through" — with this many slow particles, ~half-and-half reads well.
const BLOCKED_FRACTION = 0.5

const TRAVEL_FRAMES = 60
const PRE_BARRIER_DIST = BARRIER_X - SOURCE_X  // 540
const POST_BARRIER_FADE = 1300  // distance over which post-barrier rings fade

// Blocked-particle timing (classical-slits): how long until impact, then
// how many frames the splat lingers and fades.
const TIME_TO_BARRIER = Math.round(
  TRAVEL_FRAMES * (BARRIER_X - SOURCE_X) / (SCREEN_X - SOURCE_X),
)
const BLOCKED_LINGER = 18
const BLOCKED_LIFETIME = TIME_TO_BARRIER + BLOCKED_LINGER

// Wavefront animation parameters (quantum mode).
// Many concurrent wavefronts at slow speed make the interference pattern
// readable: rings cross at the constructive-interference angles, brightening
// via mix-blend-mode: screen.
const WAVE_INTERVAL = 32   // frames between successive wavefronts
const WAVE_SPEED = 2       // px/frame — much slower propagation
const WAVELENGTH = WAVE_SPEED * WAVE_INTERVAL

// Bright-fringe spacing on the detector derived from the actual wave geometry,
// so the dot pattern peaks line up with the visible wave-ring crossings.
// (s = λ · L / d for two slits separated by d, screen at distance L.)
const FRINGE_SPACING = (WAVELENGTH * (SCREEN_X - BARRIER_X)) / (2 * SLIT_SEP)

interface Particle {
  startTick: number
  yOffset: number      // small jitter so particles don't all sit on the axis
  aimedHitY?: number   // mode=classical-no-barrier
  slit?: -1 | 1        // mode=classical-slits (top=-1, bottom=+1)
  finalHitY?: number   // mode=classical-slits
  blocked?: boolean    // mode=classical-slits — stopped at the barrier
  blockedY?: number    // mode=classical-slits — y on the barrier where it died
}

interface Hit {
  y: number
  age: number          // frames since landing — used for fade-in
}

interface Wavefront {
  startTick: number
}

const tickN = ref(0)
const flying = ref<Particle[]>([])
const hits = ref<Hit[]>([])
const wavefronts = ref<Wavefront[]>([])
const launchedCount = ref(0)
const lastLaunchTick = ref(-Infinity)
const lastWaveTick = ref(-Infinity)
let raf: number | null = null

// Unique-per-instance suffix for SVG `id` attributes — three of these diagrams
// live in the deck and shared IDs would make `clip-path="url(#…)"` resolve to
// whichever instance Slidev renders first, breaking the LHS/RHS clipping.
const uid = Math.random().toString(36).slice(2, 9)
const preClipId = `pre-barrier-clip-${uid}`
const postClipId = `post-barrier-clip-${uid}`

// Box-Muller standard normal sample.
function gaussian(): number {
  const u = Math.random() || 1e-9
  const v = Math.random() || 1e-9
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// Pick a y on the barrier that lies BETWEEN/OUTSIDE the slits, so the
// particle visibly aims at the wall and is stopped.
function sampleBarrierMissY(): number {
  const upperSlitTop = CY - SLIT_SEP - SLIT_HALF
  const upperSlitBottom = CY - SLIT_SEP + SLIT_HALF
  const lowerSlitTop = CY + SLIT_SEP - SLIT_HALF
  const lowerSlitBottom = CY + SLIT_SEP + SLIT_HALF
  for (let i = 0; i < 50; i++) {
    const y = CY + gaussian() * 130
    if (y < 80 || y > H - 80) continue
    if (y >= upperSlitTop && y <= upperSlitBottom) continue
    if (y >= lowerSlitTop && y <= lowerSlitBottom) continue
    return y
  }
  return CY  // fallback: dead-center between the slits
}

// Sample y from |ψ|² ∝ cos²(π·y / s) · exp(-y²/(2σ²)) via rejection sampling.
function sampleQuantumHitY(): number {
  const s = FRINGE_SPACING
  for (let i = 0; i < 200; i++) {
    const y = (Math.random() - 0.5) * 2 * (3 * ENV_SIGMA)
    const env = Math.exp(-(y * y) / (2 * ENV_SIGMA * ENV_SIGMA))
    const fringe = Math.cos((Math.PI * y) / s) ** 2
    const p = env * fringe
    if (Math.random() < p) return CY + y
  }
  return CY + (Math.random() - 0.5) * 2 * ENV_SIGMA
}

function createParticle(): Particle {
  const base: Particle = {
    startTick: tickN.value,
    yOffset: (Math.random() - 0.5) * 16,
  }
  if (props.mode === 'classical-no-barrier') {
    base.aimedHitY = CY + gaussian() * CLASSICAL_NO_BARRIER_SIGMA
  } else if (props.mode === 'classical-slits') {
    if (Math.random() < BLOCKED_FRACTION) {
      base.blocked = true
      base.blockedY = sampleBarrierMissY()
    } else {
      base.slit = (Math.random() < 0.5 ? -1 : 1) as -1 | 1
      base.finalHitY = CY + base.slit * SLIT_SEP + gaussian() * CLASSICAL_SLIT_BAND_SIGMA
    }
  }
  return base
}

// Adaptive interval: slow opening, then a smooth ramp into the steady spray.
function currentInterval(): number {
  const n = launchedCount.value
  const slow = props.slowStartInterval
  const fast = props.launchInterval
  if (n < props.slowStartCount) return slow
  const k = n - props.slowStartCount
  if (k < props.rampLaunches) {
    const t = k / props.rampLaunches
    return Math.max(fast, Math.round(slow + (fast - slow) * t))
  }
  return fast
}

function step() {
  tickN.value += 1

  if (tickN.value - lastLaunchTick.value >= currentInterval()) {
    flying.value.push(createParticle())
    lastLaunchTick.value = tickN.value
    launchedCount.value += 1
  }

  // Move flying particles. Source → screen takes TRAVEL_FRAMES; blocked
  // particles die at the barrier without registering a detector hit.
  const remaining: Particle[] = []
  for (const p of flying.value) {
    const age = tickN.value - p.startTick
    if (p.blocked) {
      if (age < BLOCKED_LIFETIME) remaining.push(p)
      continue
    }
    if (age >= TRAVEL_FRAMES) {
      let hitY: number
      if (props.mode === 'classical-no-barrier') hitY = p.aimedHitY!
      else if (props.mode === 'classical-slits') hitY = p.finalHitY!
      else hitY = sampleQuantumHitY()
      hits.value.push({ y: hitY, age: 0 })
      if (hits.value.length > props.maxHits) hits.value.shift()
    } else {
      remaining.push(p)
    }
  }
  flying.value = remaining

  for (const h of hits.value) h.age += 1

  // Wavefronts (quantum-only): one slow wave at a time. Use a tracked-last-tick
  // (rather than a modulo) so the first wave appears immediately on mount.
  if (props.mode === 'quantum' && props.showWaves) {
    if (tickN.value - lastWaveTick.value >= WAVE_INTERVAL) {
      wavefronts.value.push({ startTick: tickN.value })
      lastWaveTick.value = tickN.value
    }
    wavefronts.value = wavefronts.value.filter((w) => {
      const age = tickN.value - w.startTick
      const r = age * WAVE_SPEED - PRE_BARRIER_DIST
      return r < POST_BARRIER_FADE
    })
  } else if (wavefronts.value.length > 0) {
    wavefronts.value = []
  }

  raf = requestAnimationFrame(step)
}

const flyingDots = computed(() => {
  // Quantum mode shows the wave instead of bouncing balls between source and barrier.
  if (props.mode === 'quantum') return []
  return flying.value.map((p) => {
    const age = tickN.value - p.startTick
    const y0 = CY + p.yOffset

    if (props.mode === 'classical-no-barrier') {
      const t = Math.min(1, age / TRAVEL_FRAMES)
      const x = SOURCE_X + (SCREEN_X - SOURCE_X) * t
      const y = y0 + (p.aimedHitY! - y0) * t
      return { x, y, opacity: 1, radius: 6 }
    }

    // Blocked particle: fly straight to a non-slit point on the barrier,
    // then linger as a fading splat so the audience reads "stopped here".
    if (p.blocked) {
      if (age <= TIME_TO_BARRIER) {
        const tt = age / TIME_TO_BARRIER
        const x = SOURCE_X + (BARRIER_X - SOURCE_X) * tt
        const y = y0 + (p.blockedY! - y0) * tt
        return { x, y, opacity: 1, radius: 6 }
      }
      const fadeT = (age - TIME_TO_BARRIER) / BLOCKED_LINGER
      return {
        x: BARRIER_X,
        y: p.blockedY!,
        opacity: Math.max(0, 1 - fadeT),
        radius: 8,
      }
    }

    // classical-slits through-slit: two-segment trajectory through the chosen slit.
    const t = Math.min(1, age / TRAVEL_FRAMES)
    const slitY = CY + (p.slit ?? 1) * SLIT_SEP
    if (t < 0.5) {
      const tt = t / 0.5
      const x = SOURCE_X + (BARRIER_X - SOURCE_X) * tt
      const y = y0 + (slitY - y0) * tt
      return { x, y, opacity: 1, radius: 6 }
    }
    const tt = (t - 0.5) / 0.5
    const x = BARRIER_X + (SCREEN_X - BARRIER_X) * tt
    const y = slitY + ((p.finalHitY ?? slitY) - slitY) * tt
    return { x, y, opacity: 1, radius: 6 }
  })
})

interface PlaneWavefront { x: number; opacity: number }
interface CircularWavefront { r: number; opacity: number }

const visibleWaves = computed<{ plane: PlaneWavefront[]; circular: CircularWavefront[] }>(() => {
  if (props.mode !== 'quantum' || !props.showWaves) return { plane: [], circular: [] }
  const plane: PlaneWavefront[] = []
  const circular: CircularWavefront[] = []
  for (const w of wavefronts.value) {
    const age = tickN.value - w.startTick
    const advance = age * WAVE_SPEED
    if (advance < PRE_BARRIER_DIST) {
      // Pre-barrier plane wave moving rightward. Fade in slightly off the source.
      const x = SOURCE_X + advance
      const fadeIn = Math.min(1, advance / 50)
      plane.push({ x, opacity: 0.5 * fadeIn })
    } else {
      const r = advance - PRE_BARRIER_DIST
      if (r > 0) {
        const fade = Math.max(0, 1 - r / POST_BARRIER_FADE)
        circular.push({ r, opacity: 0.55 * fade })
      }
    }
  }
  return { plane, circular }
})

const showBarrier = computed(() => props.mode !== 'classical-no-barrier')

// Detector geometry. Classical-slits mode shows two separate columns matching
// the two bands so the gap between bands is read by the audience as "balls
// can only land where there's a detector behind a slit."
const detectorSegments = computed(() => {
  if (props.mode === 'classical-slits') {
    const upperEnd = CY - SLIT_SEP + 3 * CLASSICAL_SLIT_BAND_SIGMA
    const lowerStart = CY + SLIT_SEP - 3 * CLASSICAL_SLIT_BAND_SIGMA
    return [
      { y1: 80, y2: upperEnd },
      { y1: lowerStart, y2: H - 80 },
    ]
  }
  return [{ y1: 80, y2: H - 80 }]
})

// Envelope sits to the LEFT of the detector line (peaks growing leftward),
// so it stays inside the 1920-wide canvas regardless of mode.
const ENV_BASELINE = SCREEN_X - 10
const ENV_PEAK = 220

// Envelope grows as hits accumulate — it starts as a flat line at the baseline
// and inflates to the full curve over the first ~25 detector hits, so the
// curve visibly fills in alongside the dot pattern.
const envelopeGrowth = computed(() => Math.min(1, hits.value.length / 25))

const envelopePath = computed(() => {
  if (!props.showEnvelope) return ''
  const peak = ENV_PEAK * envelopeGrowth.value
  if (peak < 1) return ''
  const pts: string[] = []

  if (props.mode === 'classical-no-barrier') {
    for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += 4) {
      const intensity = Math.exp(
        -(dy * dy) / (2 * CLASSICAL_NO_BARRIER_SIGMA * CLASSICAL_NO_BARRIER_SIGMA),
      )
      pts.push(`${(ENV_BASELINE - intensity * peak).toFixed(1)},${(CY + dy).toFixed(1)}`)
    }
  } else if (props.mode === 'classical-slits') {
    const sigma2 = CLASSICAL_SLIT_BAND_SIGMA * CLASSICAL_SLIT_BAND_SIGMA
    for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += 4) {
      const top = Math.exp(-((dy + SLIT_SEP) ** 2) / (2 * sigma2))
      const bot = Math.exp(-((dy - SLIT_SEP) ** 2) / (2 * sigma2))
      const intensity = Math.max(top, bot)
      pts.push(`${(ENV_BASELINE - intensity * peak).toFixed(1)},${(CY + dy).toFixed(1)}`)
    }
  } else {
    const s = FRINGE_SPACING
    for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += 4) {
      const env = Math.exp(-(dy * dy) / (2 * ENV_SIGMA * ENV_SIGMA))
      const fringe = Math.cos((Math.PI * dy) / s) ** 2
      const intensity = env * fringe
      pts.push(`${(ENV_BASELINE - intensity * peak).toFixed(1)},${(CY + dy).toFixed(1)}`)
    }
  }

  return (
    `M ${pts[0]} L ${pts.slice(1).join(' L ')}` +
    ` L ${ENV_BASELINE},${CY + 3 * ENV_SIGMA} L ${ENV_BASELINE},${CY - 3 * ENV_SIGMA} Z`
  )
})

function reset() {
  if (!props.interactive) return
  hits.value = []
  flying.value = []
  wavefronts.value = []
  launchedCount.value = 0
  lastLaunchTick.value = -Infinity
  lastWaveTick.value = -Infinity
}

onMounted(() => {
  raf = requestAnimationFrame(step)
})
onUnmounted(() => {
  if (raf !== null) cancelAnimationFrame(raf)
})
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
    <defs>
      <clipPath :id="postClipId">
        <rect :x="BARRIER_X" :y="0" :width="W - BARRIER_X" :height="H" />
      </clipPath>
      <clipPath :id="preClipId">
        <rect :x="0" :y="0" :width="BARRIER_X" :height="H" />
      </clipPath>
    </defs>

    <!-- Optical-bench baseline -->
    <line :x1="0" :y1="CY" :x2="W" :y2="CY"
          stroke="white" stroke-width="2" stroke-opacity="0.10" stroke-dasharray="4 12" />

    <!-- Source -->
    <circle :cx="SOURCE_X" :cy="CY" r="14" fill="white" />
    <circle :cx="SOURCE_X" :cy="CY" r="26" fill="white" fill-opacity="0.15" />

    <!-- Plane wave (quantum + showWaves): kept deliberately quieter than the
         RHS interference — a soft glow + thin core, no bright halo. The
         busy/glowing visual is reserved for the interfering rings on the RHS. -->
    <g v-if="visibleWaves.plane.length > 0"
       :clip-path="`url(#${preClipId})`"
       style="mix-blend-mode: screen">
      <template v-for="(w, i) in visibleWaves.plane" :key="`pw-${i}`">
        <line :x1="w.x" :y1="60" :x2="w.x" :y2="H - 60"
              stroke="#38bdf8" :stroke-opacity="w.opacity * 0.45" stroke-width="5" />
        <line :x1="w.x" :y1="60" :x2="w.x" :y2="H - 60"
              stroke="#bae6fd" :stroke-opacity="w.opacity * 1.1" stroke-width="1.6" />
      </template>
    </g>

    <!-- Slit wavefronts: expanding rings from each slit, post-barrier only.
         Same three-layer halo/glow/core treatment so crossings glow brightly. -->
    <g v-if="visibleWaves.circular.length > 0"
       :clip-path="`url(#${postClipId})`"
       style="mix-blend-mode: screen">
      <template v-for="(w, i) in visibleWaves.circular" :key="`sw-${i}`">
        <circle :cx="BARRIER_X" :cy="CY - SLIT_SEP" :r="w.r" fill="none"
                stroke="#0ea5e9" :stroke-opacity="w.opacity * 0.45" stroke-width="14" />
        <circle :cx="BARRIER_X" :cy="CY - SLIT_SEP" :r="w.r" fill="none"
                stroke="#38bdf8" :stroke-opacity="w.opacity * 0.85" stroke-width="6" />
        <circle :cx="BARRIER_X" :cy="CY - SLIT_SEP" :r="w.r" fill="none"
                stroke="#dbeafe" :stroke-opacity="Math.min(1, w.opacity * 1.7)" stroke-width="2" />
        <circle :cx="BARRIER_X" :cy="CY + SLIT_SEP" :r="w.r" fill="none"
                stroke="#0ea5e9" :stroke-opacity="w.opacity * 0.45" stroke-width="14" />
        <circle :cx="BARRIER_X" :cy="CY + SLIT_SEP" :r="w.r" fill="none"
                stroke="#38bdf8" :stroke-opacity="w.opacity * 0.85" stroke-width="6" />
        <circle :cx="BARRIER_X" :cy="CY + SLIT_SEP" :r="w.r" fill="none"
                stroke="#dbeafe" :stroke-opacity="Math.min(1, w.opacity * 1.7)" stroke-width="2" />
      </template>
    </g>

    <!-- Barrier with two slits (suppressed in classical-no-barrier mode). -->
    <g v-if="showBarrier">
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

    <!-- Detector screen (one column by default; two with a gap in classical-slits) -->
    <line v-for="(seg, i) in detectorSegments" :key="`det-${i}`"
          :x1="SCREEN_X" :y1="seg.y1" :x2="SCREEN_X" :y2="seg.y2"
          stroke="white" stroke-width="3" stroke-opacity="0.4" />

    <!-- Analytical envelope: grows in opacity along with peak height as hits fill in. -->
    <path v-if="envelopePath" :d="envelopePath"
          fill="white" :fill-opacity="0.07 * envelopeGrowth"
          stroke="white"
          stroke-width="1.5" :stroke-opacity="0.45 * envelopeGrowth" />

    <!-- Flying particles (classical modes only). -->
    <circle v-for="(d, i) in flyingDots" :key="`f-${i}`"
            :cx="d.x" :cy="d.y" :r="d.radius" fill="white" :opacity="d.opacity" />

    <!-- Accumulated hits on the screen — flat white for crispness with many dots. -->
    <circle v-for="(h, i) in hits" :key="`h-${i}`"
            :cx="SCREEN_X" :cy="h.y" r="4"
            fill="white"
            :opacity="Math.min(1, h.age / 6)" />
  </svg>
</template>
