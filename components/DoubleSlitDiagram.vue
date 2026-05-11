<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// A five-slide pedagogical story (set `mode`):
//
// 1. classical-no-barrier — balls fly straight from source to detector and
//    pile up in a single tight Gaussian. Establishes "balls go where you aim."
// 2. classical-slits — balls visibly take ONE of two slits each, accumulating
//    into two distinct bands behind the slits. Classical expectation.
// 3. quantum (default) — a plane wave is emitted from the source; when it hits
//    the barrier, two new circular wavefronts emerge from the slits and
//    interfere. No visible flying particles between source and barrier — the
//    wave does the travelling. The detector shows the cos²·Gaussian intensity
//    as a continuous envelope (no dots) — pure wave picture, no particle
//    counting. The envelope fades in as the first wavefronts reach the screen.
// 4. quantum-electrons-dots — the experimental puzzle: visible single e⁻
//    fly source → barrier one at a time, vanish at the barrier, then a
//    single DOT lands on the detector at a position sampled from
//    cos²·Gaussian (de Broglie λ fixed). NO wave is drawn — that is the
//    point. After many electrons the dots organise into the interference
//    fringe pattern, and the audience has to wonder how particles ended
//    up there. The wave explanation arrives on the NEXT slide.
// 5. quantum-electrons — the wave-picture explanation of the same experiment:
//    same single-e⁻ launches and per-electron wavelets, but NO dot is
//    registered — instead each electron's arrival fades up a bright
//    cos²·Gaussian intensity envelope, the pure wave description.
//
// The launch cadence ramps from one-per-second to a spray, so the audience
// sees individual events first and then watches the pattern fill in.
//
// Simulation time advances in fixed virtual ticks at SIM_HZ regardless of
// the monitor's refresh rate, so the animation looks identical on a 60 Hz
// phone, 120 Hz laptop, and 240 Hz venue display. RAF still drives the
// render loop — we just integrate with `dt`.
//
// Interactive controls (when `interactive`): reset, pause, speed slider,
// flux slider. Clicking on empty SVG area also resets.
const props = withDefaults(defineProps<{
  mode?: 'classical-no-barrier' | 'classical-slits' | 'classical-electrons' | 'quantum' | 'quantum-electrons' | 'quantum-electrons-dots'
  // Steady-state ticks between launches (60 ticks/s). Smaller = faster spray.
  launchInterval?: number
  // Launches at the slow opening pace before the ramp begins.
  slowStartCount?: number
  // Ticks between launches during the slow opening (default ~0.83 s).
  slowStartInterval?: number
  // How many launches the slow→fast ramp lasts.
  rampLaunches?: number
  // Maximum hits retained on screen before the oldest get reused (rolling).
  maxHits?: number
  // Click to clear & restart, plus show the controls overlay.
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
const WAVE_INTERVAL = 32   // baseline ticks between successive wavefronts
const WAVE_SPEED = 2       // px/tick — propagation speed (held constant)

// Wavelength = c · T, so when flux raises the emission frequency the spatial
// gap between successive wavefronts shrinks AND the detector fringe spacing
// shrinks (s = λ · L / d). Both are computed off the current flux-driven
// emission interval so the visible wave spacing, the cos² sampling, and the
// envelope curve all stay in physical agreement as the user sweeps the slider.
function currentWavelength(): number {
  return WAVE_SPEED * waveInterval()
}
function currentFringeSpacing(): number {
  return (currentWavelength() * (SCREEN_X - BARRIER_X)) / (2 * SLIT_SEP)
}

// Electron de Broglie wavelength is fixed (flux means "electrons per second"
// here, not wavelength), so the fringe pattern stays put on the
// quantum-electrons / quantum-electrons-dots slides. Decoupled from the
// wave-mode wavelength so we can dial it tight: a lot of narrow stripes
// reads unmistakably as wave interference, where a handful of wide fringes
// could be mistaken for "just two smeared spots".
const ELECTRON_FRINGE_SPACING = 60

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
  hitY?: number          // pre-sampled cos² landing position (quantum mode)
  hitDeposited?: boolean // set once the dot lands so we don't deposit twice
}

// Fixed virtual simulation rate. RAF dt is integrated into `tickN` (a float)
// so all the existing tick-based math is screen-refresh independent.
const SIM_HZ = 60

const tickN = ref(0)
const flying = ref<Particle[]>([])
const hits = ref<Hit[]>([])
const wavefronts = ref<Wavefront[]>([])
const launchedCount = ref(0)
const lastLaunchTick = ref(-Infinity)
const lastWaveTick = ref(-Infinity)
// Quantum (wave) mode: count of wavefronts that have reached the screen.
// Drives the intensity envelope's fade-in — no particle dots are deposited.
const waveArrivals = ref(0)
let raf: number | null = null
let lastTimestamp: number | null = null

// Reactive UI controls (visible only when `interactive`).
const paused = ref(false)
const speedMul = ref(1)        // 0.25× – 4× — multiplies dt
const fluxMul = ref(1)         // 0.25× – 4× — divides launch intervals

// Unique-per-instance suffix for SVG `id` attributes — three of these diagrams
// live in the deck and shared IDs would make `clip-path="url(#…)"` resolve to
// whichever instance Slidev renders first, breaking the LHS/RHS clipping.
const uid = Math.random().toString(36).slice(2, 9)
const preClipId = `pre-barrier-clip-${uid}`
const postClipId = `post-barrier-clip-${uid}`
const ballGradId = `ball-grad-${uid}`
const ballSpecId = `ball-spec-${uid}`
const ballRimId = `ball-rim-${uid}`
const electronGradId = `electron-grad-${uid}`
const electronRimId = `electron-rim-${uid}`
const electronGlowId = `electron-glow-${uid}`
const shadowFilterId = `particle-shadow-${uid}`

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
// `s` defaults to the live (flux-driven) fringe spacing so wave-mode dots
// follow whatever wavelength the user just dialed in. Callers can override
// to fix the spacing (e.g., quantum-electrons holds wavelength constant).
function sampleQuantumHitY(s: number = currentFringeSpacing()): number {
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
  } else if (props.mode === 'classical-slits' || props.mode === 'classical-electrons') {
    if (Math.random() < BLOCKED_FRACTION) {
      base.blocked = true
      base.blockedY = sampleBarrierMissY()
    } else {
      base.slit = (Math.random() < 0.5 ? -1 : 1) as -1 | 1
      base.finalHitY = CY + base.slit * SLIT_SEP + gaussian() * CLASSICAL_SLIT_BAND_SIGMA
    }
  } else if (props.mode === 'quantum-electrons-dots') {
    // Each electron lands as a single dot drawn from cos²·Gaussian. Fixed
    // de Broglie wavelength → ELECTRON_FRINGE_SPACING (independent of flux).
    base.finalHitY = sampleQuantumHitY(ELECTRON_FRINGE_SPACING)
  }
  // quantum-electrons: no per-particle landing y is sampled — the wave
  // picture shows continuous intensity, not discrete hits.
  return base
}

// Adaptive interval: slow opening, then a smooth ramp into the steady spray.
// `fluxMul` (UI slider) divides the interval — higher = more particles/sec.
function currentInterval(): number {
  const n = launchedCount.value
  const slow = props.slowStartInterval
  const fast = props.launchInterval
  let raw: number
  if (n < props.slowStartCount) raw = slow
  else {
    const k = n - props.slowStartCount
    if (k < props.rampLaunches) {
      const t = k / props.rampLaunches
      raw = slow + (fast - slow) * t
    } else {
      raw = fast
    }
  }
  return Math.max(2, raw / Math.max(0.01, fluxMul.value))
}

// Quantum-mode wavefront emission cadence. Mapped non-linearly off the flux
// slider: LOW end gives an isolated-pulse demo, HIGH end packs the screen
// with tightly-spaced fringes (λ = c·T, so shortening T shrinks both the
// wavelength and the fringe spacing s = λ·L/d). Exponent and floor are tuned
// so the full slider range produces visible change — earlier values clamped
// at f ≈ 1.74 and the top ~57% of the slider was a no-op.
//   f = 0.25 → 512 ticks  (slow pulse demo, envelope-only fringes)
//   f = 1.0  → 32 ticks   (default, ~5 wide fringes)
//   f = 4.0  → 2 ticks    (busy interference, ~40 narrow fringes)
function waveInterval(): number {
  const f = Math.max(0.01, fluxMul.value)
  return Math.max(2, WAVE_INTERVAL / Math.pow(f, 2))
}

function frame(timestamp: number) {
  if (lastTimestamp === null) lastTimestamp = timestamp
  // Cap dt so a tab switch doesn't dump a giant burst when we resume.
  const realDt = Math.min(0.1, (timestamp - lastTimestamp) / 1000)
  lastTimestamp = timestamp

  if (!paused.value) {
    const tickDelta = realDt * SIM_HZ * speedMul.value
    tickN.value += tickDelta

    // Particle launches happen in every mode EXCEPT continuous-wave quantum,
    // where dots are deposited by wavefronts arriving at the screen instead.
    if (props.mode !== 'quantum') {
      if (tickN.value - lastLaunchTick.value >= currentInterval()) {
        flying.value.push(createParticle())
        lastLaunchTick.value = tickN.value
        launchedCount.value += 1
      }
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
        if (props.mode === 'quantum-electrons') {
          // Wave picture: each electron's arrival fades the intensity
          // envelope up a notch — no point is deposited.
          waveArrivals.value += 1
        } else {
          let hitY: number
          if (props.mode === 'classical-no-barrier') hitY = p.aimedHitY!
          // classical-slits / classical-electrons / quantum-electrons-dots
          else hitY = p.finalHitY!
          hits.value.push({ y: hitY, age: 0 })
          if (hits.value.length > props.maxHits) hits.value.shift()
        }
      } else {
        remaining.push(p)
      }
    }
    flying.value = remaining

    for (const h of hits.value) h.age += tickDelta

    // Continuous-wave quantum mode: flux controls wave emission rate. No dots
    // are deposited — the wave picture shows the continuous cos²·Gaussian
    // intensity on the screen (the envelope), not particle counts. Each
    // wavefront that reaches the screen ticks the arrival counter so the
    // envelope fades in as the first wavefronts arrive.
    if (props.mode === 'quantum') {
      if (tickN.value - lastWaveTick.value >= waveInterval()) {
        wavefronts.value.push({
          startTick: tickN.value,
          hitDeposited: false,
        })
        lastWaveTick.value = tickN.value
      }
      const screenDist = SCREEN_X - BARRIER_X
      for (const w of wavefronts.value) {
        if (w.hitDeposited) continue
        const age = tickN.value - w.startTick
        const r = age * WAVE_SPEED - PRE_BARRIER_DIST
        if (r >= screenDist) {
          waveArrivals.value += 1
          w.hitDeposited = true
        }
      }
      // Drop dissipated wavefronts.
      wavefronts.value = wavefronts.value.filter((w) => {
        const age = tickN.value - w.startTick
        const r = age * WAVE_SPEED - PRE_BARRIER_DIST
        return r < POST_BARRIER_FADE
      })
    } else if (wavefronts.value.length > 0) {
      wavefronts.value = []
    }
  }

  raf = requestAnimationFrame(frame)
}

interface FlyingDot {
  x: number
  y: number
  opacity: number
  radius: number
  isElectron?: boolean
}

const flyingDots = computed<FlyingDot[]>(() => {
  // Quantum (continuous wave) mode shows the wave instead of bouncing balls.
  if (props.mode === 'quantum') return []
  const out: FlyingDot[] = []
  for (const p of flying.value) {
    const age = tickN.value - p.startTick
    const y0 = CY + p.yOffset

    if (props.mode === 'classical-no-barrier') {
      const t = Math.min(1, age / TRAVEL_FRAMES)
      const x = SOURCE_X + (SCREEN_X - SOURCE_X) * t
      const y = y0 + (p.aimedHitY! - y0) * t
      out.push({ x, y, opacity: 1, radius: 6 })
      continue
    }

    const isElectron = props.mode === 'classical-electrons'

    if (props.mode === 'quantum-electrons' || props.mode === 'quantum-electrons-dots') {
      // Visible e⁻ flies source → barrier on the optical axis (we deliberately
      // don't aim at a slit — the punchline is "the electron didn't pick").
      // After it reaches the barrier it disappears; the per-electron wavelet
      // (drawn separately in `electronWavelets`) carries the amplitude through
      // both slits, and a single dot lands at the pre-sampled hit position
      // when age == TRAVEL_FRAMES.
      if (age <= TIME_TO_BARRIER) {
        const tt = age / TIME_TO_BARRIER
        const x = SOURCE_X + (BARRIER_X - SOURCE_X) * tt
        const y = y0
        const fadeOut = Math.max(0, 1 - Math.max(0, tt - 0.85) / 0.15)
        out.push({ x, y, opacity: fadeOut, radius: 14, isElectron: true })
      }
      continue
    }

    // Blocked particle: fly straight to a non-slit point on the barrier,
    // then linger as a fading splat so the audience reads "stopped here".
    if (p.blocked) {
      const splatRadius = isElectron ? 14 : 6
      if (age <= TIME_TO_BARRIER) {
        const tt = age / TIME_TO_BARRIER
        const x = SOURCE_X + (BARRIER_X - SOURCE_X) * tt
        const y = y0 + (p.blockedY! - y0) * tt
        out.push({ x, y, opacity: 1, radius: splatRadius, isElectron })
        continue
      }
      const fadeT = (age - TIME_TO_BARRIER) / BLOCKED_LINGER
      out.push({
        x: BARRIER_X,
        y: p.blockedY!,
        opacity: Math.max(0, 1 - fadeT),
        radius: isElectron ? splatRadius : 8,
        isElectron,
      })
      continue
    }

    // classical-slits / classical-electrons through-slit: two-segment trajectory.
    const t = Math.min(1, age / TRAVEL_FRAMES)
    const slitY = CY + (p.slit ?? 1) * SLIT_SEP
    const radius = isElectron ? 14 : 6
    if (t < 0.5) {
      const tt = t / 0.5
      const x = SOURCE_X + (BARRIER_X - SOURCE_X) * tt
      const y = y0 + (slitY - y0) * tt
      out.push({ x, y, opacity: 1, radius, isElectron })
      continue
    }
    const tt = (t - 0.5) / 0.5
    const x = BARRIER_X + (SCREEN_X - BARRIER_X) * tt
    const y = slitY + ((p.finalHitY ?? slitY) - slitY) * tt
    out.push({ x, y, opacity: 1, radius, isElectron })
  }
  return out
})

// Per-electron post-barrier wavelet: a single expanding ring from each slit,
// tied to one electron. Lives only between the moment the e⁻ reaches the
// barrier and the moment its detector hit registers (TIME_TO_BARRIER → TRAVEL_FRAMES).
// This is what makes the "single electron interferes with itself" point read.
interface ElectronWavelet { r: number; opacity: number }
const electronWavelets = computed<ElectronWavelet[]>(() => {
  // Only the wave-picture mode shows wavelets. The quantum-electrons-dots
  // slide is the "puzzle" beat: particles fly in, vanish, dots eventually
  // organise into fringes — no wave hint is visible, so the audience has
  // to ask the question "how?" before the wave answer arrives next slide.
  if (props.mode !== 'quantum-electrons') return []
  const out: ElectronWavelet[] = []
  const span = TRAVEL_FRAMES - TIME_TO_BARRIER
  for (const p of flying.value) {
    const age = tickN.value - p.startTick
    if (age <= TIME_TO_BARRIER || age >= TRAVEL_FRAMES) continue
    const t = (age - TIME_TO_BARRIER) / span
    const r = t * (SCREEN_X - BARRIER_X)
    // Bright at birth, fading to zero as the wavelet reaches the screen.
    const opacity = Math.min(1, (1 - t) * 1.2) * Math.min(1, t * 4)
    out.push({ r, opacity })
  }
  return out
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
  if (props.mode === 'classical-slits' || props.mode === 'classical-electrons') {
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

// Envelope grows from a flat line at the baseline into the full curve.
// Classical / quantum-electrons modes: filled in by accumulating detector hits
// (curve visibly emerges alongside the dot pattern).
// Quantum (wave) mode: no dots — the curve fades in as the first wavefronts
// reach the screen, since the envelope IS the visible intensity pattern.
const envelopeGrowth = computed(() => {
  if (props.mode === 'quantum') return Math.min(1, waveArrivals.value / 6)
  // quantum-electrons fires at a slower cadence (one electron per ~1 s of
  // real time during the slow opening), so a smaller denominator gives a
  // build-up that's visible while the speaker is narrating the punchline.
  if (props.mode === 'quantum-electrons') return Math.min(1, waveArrivals.value / 8)
  return Math.min(1, hits.value.length / 25)
})

// In the wave-picture modes the envelope is the main visual (no dots competing
// for attention), so render it brighter. Other modes keep the faint
// reference-curve look so the dots remain the focus.
const envelopeStyle = computed(() => {
  if (props.mode === 'quantum' || props.mode === 'quantum-electrons') {
    return { fill: 0.22, stroke: 0.95 }
  }
  return { fill: 0.07, stroke: 0.45 }
})

const envelopePath = computed(() => {
  if (!props.showEnvelope) return ''
  // Puzzle slide: the whole point is the audience watching dots organise into
  // fringes. Drawing the analytical cos²·Gaussian curve would telegraph every
  // peak at half-opacity before any dot has landed there — giving the answer
  // away. The dots have to do the talking on their own.
  if (props.mode === 'quantum-electrons-dots') return ''
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
  } else if (props.mode === 'classical-slits' || props.mode === 'classical-electrons') {
    const sigma2 = CLASSICAL_SLIT_BAND_SIGMA * CLASSICAL_SLIT_BAND_SIGMA
    for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += 4) {
      const top = Math.exp(-((dy + SLIT_SEP) ** 2) / (2 * sigma2))
      const bot = Math.exp(-((dy - SLIT_SEP) ** 2) / (2 * sigma2))
      const intensity = Math.max(top, bot)
      pts.push(`${(ENV_BASELINE - intensity * peak).toFixed(1)},${(CY + dy).toFixed(1)}`)
    }
  } else {
    // quantum: live spacing (flux moves the peaks).
    // quantum-electrons / quantum-electrons-dots: fixed spacing (de Broglie λ is constant).
    const s = (props.mode === 'quantum-electrons' || props.mode === 'quantum-electrons-dots')
      ? ELECTRON_FRINGE_SPACING
      : currentFringeSpacing()
    // Step finer when fringes get tight, otherwise the polyline aliases and
    // the curve looks like noise instead of well-resolved peaks.
    const stride = Math.max(1, Math.min(4, Math.round(s / 16)))
    for (let dy = -3 * ENV_SIGMA; dy <= 3 * ENV_SIGMA; dy += stride) {
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
  waveArrivals.value = 0
  lastLaunchTick.value = -Infinity
  lastWaveTick.value = -Infinity
  lastTimestamp = null
}

function togglePause() {
  paused.value = !paused.value
  // Drop the saved timestamp so the resume frame doesn't integrate the pause
  // duration as a giant burst (and would-be lost-tab dt is already capped).
  lastTimestamp = null
}

// Quantum (wave) mode: changing flux changes the wavelength, so the existing
// in-flight wavefronts and the rendered envelope are at the OLD spacing.
// Wipe them on slider change — the new pattern then fades in only as new
// wavefronts (at the new spacing) reach the screen, which is what the
// audience expects to see.
watch(fluxMul, () => {
  if (props.mode !== 'quantum') return
  wavefronts.value = []
  waveArrivals.value = 0
  lastWaveTick.value = tickN.value
})

onMounted(() => {
  raf = requestAnimationFrame(frame)
})
onUnmounted(() => {
  if (raf !== null) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="absolute inset-0">
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

      <!-- Volumetric shading. Body uses an off-center radial gradient (highlight
           upper-left → mid body → terminator → core shadow). A second radial
           layered on top is a soft specular highlight. A faint rim/bounce
           gradient lifts the dark side off the background. The result reads
           as a smooth 3D sphere at any size. -->
      <radialGradient :id="ballGradId" cx="0.5" cy="0.5" r="0.62" fx="0.34" fy="0.30">
        <stop offset="0%"   stop-color="#ffffff" />
        <stop offset="22%"  stop-color="#f8fafc" />
        <stop offset="55%"  stop-color="#cbd5e1" />
        <stop offset="82%"  stop-color="#64748b" />
        <stop offset="100%" stop-color="#0f172a" />
      </radialGradient>
      <radialGradient :id="ballSpecId" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="40%"  stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="ballRimId" cx="0.5" cy="0.5" r="0.55" fx="0.62" fy="0.78">
        <stop offset="0%"   stop-color="#cbd5e1" stop-opacity="0" />
        <stop offset="78%"  stop-color="#cbd5e1" stop-opacity="0" />
        <stop offset="92%"  stop-color="#dbeafe" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#bae6fd" stop-opacity="0" />
      </radialGradient>

      <radialGradient :id="electronGradId" cx="0.5" cy="0.5" r="0.66" fx="0.34" fy="0.28">
        <stop offset="0%"   stop-color="#f0f9ff" />
        <stop offset="22%"  stop-color="#bae6fd" />
        <stop offset="55%"  stop-color="#38bdf8" />
        <stop offset="82%"  stop-color="#075985" />
        <stop offset="100%" stop-color="#031b30" />
      </radialGradient>
      <radialGradient :id="electronRimId" cx="0.5" cy="0.5" r="0.55" fx="0.62" fy="0.78">
        <stop offset="0%"   stop-color="#0ea5e9" stop-opacity="0" />
        <stop offset="78%"  stop-color="#0ea5e9" stop-opacity="0" />
        <stop offset="92%"  stop-color="#7dd3fc" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#bae6fd" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="electronGlowId" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%"   stop-color="#7dd3fc" stop-opacity="0.55" />
        <stop offset="55%"  stop-color="#38bdf8" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
      </radialGradient>

      <!-- Soft drop-shadow under in-flight particles for depth cue. Two-stop
           blur with a slight downward offset for grounded weight. -->
      <filter :id="shadowFilterId" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" />
        <feOffset dx="0" dy="4" result="shadowBlur" />
        <feComponentTransfer in="shadowBlur" result="shadow">
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
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

    <!-- Per-electron wavelets (quantum-electrons mode): one expanding ring per
         in-flight e⁻ from EACH slit, alive only between barrier-arrival and
         the corresponding detector hit. Visually says "this single electron's
         amplitude went through both slits". -->
    <g v-if="electronWavelets.length > 0"
       :clip-path="`url(#${postClipId})`"
       style="mix-blend-mode: screen">
      <template v-for="(w, i) in electronWavelets" :key="`ew-${i}`">
        <circle :cx="BARRIER_X" :cy="CY - SLIT_SEP" :r="w.r" fill="none"
                stroke="#38bdf8" :stroke-opacity="w.opacity * 0.55" stroke-width="6" />
        <circle :cx="BARRIER_X" :cy="CY - SLIT_SEP" :r="w.r" fill="none"
                stroke="#dbeafe" :stroke-opacity="w.opacity * 1.0" stroke-width="1.6" />
        <circle :cx="BARRIER_X" :cy="CY + SLIT_SEP" :r="w.r" fill="none"
                stroke="#38bdf8" :stroke-opacity="w.opacity * 0.55" stroke-width="6" />
        <circle :cx="BARRIER_X" :cy="CY + SLIT_SEP" :r="w.r" fill="none"
                stroke="#dbeafe" :stroke-opacity="w.opacity * 1.0" stroke-width="1.6" />
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

    <!-- Analytical envelope: grows in opacity along with peak height as the
         pattern fills in. Bolder in quantum (wave) mode where it stands alone
         as the intensity visualisation; faint elsewhere where dots dominate. -->
    <path v-if="envelopePath" :d="envelopePath"
          fill="white" :fill-opacity="envelopeStyle.fill * envelopeGrowth"
          stroke="white"
          stroke-width="1.5" :stroke-opacity="envelopeStyle.stroke * envelopeGrowth" />

    <!-- Flying particles (classical + quantum-electrons modes).
         Sphere stack, painted bottom-up:
           1. body radial gradient (highlight → mid → terminator → core shadow)
           2. faint rim/bounce light along the lower-right edge
           3. broad soft specular wash (placed up-and-left of center)
           4. tiny pinpoint catch-light at the specular's hot spot
         Wrapped in a soft drop-shadow filter so the disc looks grounded. -->
    <template v-for="(d, i) in flyingDots" :key="`f-${i}`">
      <g v-if="d.isElectron" :opacity="d.opacity" :filter="`url(#${shadowFilterId})`">
        <!-- Atmospheric glow first, OUTSIDE the sphere stack so it doesn't
             wash out the rim. -->
        <circle :cx="d.x" :cy="d.y" :r="d.radius * 2.0"
                :fill="`url(#${electronGlowId})`" />
        <!-- Sphere body. -->
        <circle :cx="d.x" :cy="d.y" :r="d.radius" :fill="`url(#${electronGradId})`" />
        <!-- Rim/bounce light on the dark side. -->
        <circle :cx="d.x" :cy="d.y" :r="d.radius" :fill="`url(#${electronRimId})`" />
        <!-- Charge label, sits low so the specular sits clear of the glyph. -->
        <text :x="d.x" :y="d.y + d.radius * 0.55" text-anchor="middle"
              font-family="ui-sans-serif, system-ui, sans-serif"
              :font-size="d.radius * 1.05" font-weight="800" fill="#031b30"
              fill-opacity="0.92" style="paint-order: stroke; stroke: rgba(255,255,255,0.18); stroke-width: 0.4;">e⁻</text>
        <!-- Broad soft specular wash, upper-left. -->
        <circle :cx="d.x - d.radius * 0.32" :cy="d.y - d.radius * 0.36"
                :r="d.radius * 0.55" :fill="`url(#${ballSpecId})`" />
        <!-- Pinpoint catch-light. -->
        <circle :cx="d.x - d.radius * 0.36" :cy="d.y - d.radius * 0.42"
                :r="d.radius * 0.10" fill="#ffffff" fill-opacity="0.95" />
      </g>
      <g v-else :opacity="d.opacity" :filter="`url(#${shadowFilterId})`">
        <circle :cx="d.x" :cy="d.y" :r="d.radius" :fill="`url(#${ballGradId})`" />
        <circle :cx="d.x" :cy="d.y" :r="d.radius" :fill="`url(#${ballRimId})`" />
        <circle :cx="d.x - d.radius * 0.32" :cy="d.y - d.radius * 0.36"
                :r="d.radius * 0.55" :fill="`url(#${ballSpecId})`" />
        <circle :cx="d.x - d.radius * 0.36" :cy="d.y - d.radius * 0.42"
                :r="d.radius * 0.12" fill="#ffffff" fill-opacity="0.95" />
      </g>
    </template>

    <!-- Accumulated hits on the screen — flat white for crispness with many dots. -->
    <circle v-for="(h, i) in hits" :key="`h-${i}`"
            :cx="SCREEN_X" :cy="h.y" r="4"
            fill="white"
            :opacity="Math.min(1, h.age / 6)" />
  </svg>

  <!-- Controls overlay: only when interactive. Sits in the bottom-right of
       the slide so it stays out of the optical-bench composition. -->
  <div v-if="props.interactive"
       class="ds-controls"
       @click.stop @mousedown.stop @pointerdown.stop @touchstart.stop @wheel.stop>
    <button type="button" class="ds-btn" :title="paused ? 'Play' : 'Pause'" @click="togglePause">
      <span v-if="paused" aria-hidden="true">▶</span>
      <span v-else aria-hidden="true">⏸</span>
    </button>
    <button type="button" class="ds-btn" title="Reset" @click="reset">↻</button>
    <label class="ds-slider">
      <span class="ds-label">Speed</span>
      <input type="range" min="0.25" max="4" step="0.05" v-model.number="speedMul" />
      <span class="ds-value">{{ speedMul.toFixed(2) }}×</span>
    </label>
    <label class="ds-slider">
      <span class="ds-label">Flux</span>
      <input type="range" min="0.25" max="4" step="0.05" v-model.number="fluxMul" />
      <span class="ds-value">{{ fluxMul.toFixed(2) }}×</span>
    </label>
  </div>
  </div>
</template>

<style scoped>
.ds-controls {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.6rem;
  backdrop-filter: blur(6px);
  color: #fff;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  user-select: none;
  z-index: 5;
}
.ds-btn {
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.4rem;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1;
  padding: 0;
  transition: background 120ms ease;
}
.ds-btn:hover { background: rgba(255, 255, 255, 0.18); }
.ds-slider {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.ds-label { opacity: 0.75; }
.ds-value {
  font-variant-numeric: tabular-nums;
  width: 2.7rem;
  text-align: right;
  opacity: 0.85;
}
.ds-slider input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 7rem;
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.ds-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 0;
  cursor: pointer;
}
.ds-slider input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 0;
  cursor: pointer;
}
</style>
