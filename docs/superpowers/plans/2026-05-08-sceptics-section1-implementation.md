# Sceptics talk — Section 1 visuals + Sections 2 & 4 content — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert the missing pedagogical bridge into Section 1 (3 Vue/SVG components + 2 videos), reuse one component on Myth #4, add a decoherence card on Myth #2, and fill Sections 2 & 4 with concrete slide-by-slide content.

**Architecture:** Three new full-bleed Vue components live at the repo root (`components/`) so they're auto-symlinked into every talk. Two new videos go through the standard manifest → sync → encode pipeline. All other work is `deck.md` edits using the existing scienced theme's `card` / `grid-2` / `grid-3` classes — no new layouts, no new theme work. The deck must continue to build at every checkpoint.

**Tech Stack:** Slidev 52 + Vue 3 (`<script setup lang="ts">`) + SVG `requestAnimationFrame` animations; Manim Community for the double-slit preface; ffmpeg via the existing `scripts/videos.py` pipeline; pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-05-08-sceptics-section1-visuals-and-content-design.md` (commit 07c51bb).

**Verification model.** This Slidev deck repo has no test framework — adding Vitest just for three visual SVG components is YAGNI infrastructure. Per the user's recorded preference, **the user verifies UI by eye in their own dev server**; the plan's automated gates are `pnpm build` (no Vite errors) and `pnpm videos:check` (manifest consistency). Each task ends with a concrete "user-driven dev-server check" step that names the slide number and the visual property to confirm. **Do not** prescribe Playwright runs — the user has rejected that as a default for deck/UI work.

**Prefer pull over re-encode.** Per recorded preference, before encoding any video that may already exist on the GH Release, attempt `pnpm videos:pull` first and only fall through to `videos:encode` if pull comes up empty. Tasks that touch encoding embed this check explicitly.

**Click-handler isolation.** Slidev's slide-level handlers swallow clicks/wheels — the existing iframe slide blocks them with `@click.stop @mousedown.stop @wheel.stop` etc. The interactive `WavePacketDiagram` must do the same, or clicking it will advance the deck instead of collapsing the packet.

---

## File structure

**Create:**
- `components/WaveDiagram.vue` — repo-root, auto-symlinked into every talk
- `components/ParticleDiagram.vue`
- `components/WavePacketDiagram.vue`
- `talks/2026_05_11_Sceptics/scripts/manim/double_slit_preface.py`
- `talks/2026_05_11_Sceptics/public/figures/cern/` (sourced CC-BY images + `attribution.txt`)

**Modify:**
- `talks/2026_05_11_Sceptics/deck.md` — Section 1 (insert 5 slides), Myth #2 (decoherence card), Myth #4 (Heisenberg WavePacket reuse), Section 2 (3 slides), Section 4 (5 slides)
- `talks/2026_05_11_Sceptics/videos/manifest.toml` — 2 new `[[videos]]` entries
- `env.yaml` — add Manim under a `pip:` block

**Build artifacts (gitignored):**
- `talks/2026_05_11_Sceptics/videos/raw/double_slit_{classical_vs_quantum,hitachi}.mp4`
- `talks/2026_05_11_Sceptics/public/videos/double_slit_{classical_vs_quantum,hitachi}.mp4`

**Boundaries.** Each Vue component owns one diagram and is self-contained — no shared state between components, no new utility module. The Manim script is talk-local (`talks/<name>/scripts/manim/`) per the convention already used for `screenshot.py`. The CERN figures live under the talk's `public/figures/cern/` so they ship with the bundle, never as URLs (so the portable bundle works offline).

---

## Phase 1 — Vue components

Goal: three reusable, full-bleed SVG components committed and visible on smoke-test slides at the end of the deck (then removed when wired into Section 1 in Phase 2). After this phase the user can `pnpm dev` and visually verify each animation.

### Task 1: `WaveDiagram.vue`

**Files:**
- Create: `components/WaveDiagram.vue`
- Modify (temporary smoke-test): `talks/2026_05_11_Sceptics/deck.md` — append a smoke-test slide at the end (will be removed in Phase 2)

**Behaviour.** Full-bleed SVG sine wave traveling left → right at constant phase velocity. Props: `speed?: number = 1`, `wavelength?: number = 120`, `amplitude?: number = 80`, `color?: string = 'currentColor'`. Render: faint horizontal axis, the wave path, and a `λ` bracket annotating one wavelength near the upper-left.

- [ ] **Step 1: Create the component**

```vue
<!-- components/WaveDiagram.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  speed?: number
  wavelength?: number
  amplitude?: number
  color?: string
}>(), {
  speed: 1,
  wavelength: 240,
  amplitude: 140,
  color: 'currentColor',
})

const t = ref(0)
let raf: number | null = null

const tick = () => {
  t.value += 1
  raf = requestAnimationFrame(tick)
}

onMounted(() => { raf = requestAnimationFrame(tick) })
onUnmounted(() => { if (raf !== null) cancelAnimationFrame(raf) })

const path = computed(() => {
  const w = 1920
  const h = 1080
  const cy = h / 2
  const k = (2 * Math.PI) / props.wavelength
  const phase = t.value * 2 * props.speed
  const pts: string[] = []
  for (let x = 0; x <= w; x += 4) {
    const y = cy + props.amplitude * Math.sin(k * (x + phase))
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M ${pts.join(' L ')}`
})
</script>

<template>
  <svg
    viewBox="0 0 1920 1080"
    class="absolute inset-0 w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <line x1="0" y1="540" x2="1920" y2="540" stroke="currentColor" stroke-width="1" stroke-opacity="0.15" />
    <path :d="path" :stroke="props.color" stroke-width="6" fill="none" stroke-linecap="round" />
    <g transform="translate(200, 320)" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7">
      <line x1="0" y1="0" :x2="props.wavelength" y2="0" />
      <line x1="0" y1="-12" x2="0" y2="12" />
      <line :x1="props.wavelength" y1="-12" :x2="props.wavelength" y2="12" />
    </g>
    <text
      :x="200 + props.wavelength / 2"
      y="290"
      text-anchor="middle"
      fill="currentColor"
      font-size="48"
      font-style="italic"
      opacity="0.9"
    >λ</text>
  </svg>
</template>
```

- [ ] **Step 2: Add a temporary smoke-test slide at the end of `deck.md`**

Append after the closing `Ačiū` slide (`talks/2026_05_11_Sceptics/deck.md`):

```markdown

---

# SMOKE — WaveDiagram

<WaveDiagram />
```

- [ ] **Step 3: Build to verify the component compiles**

Run from `talks/2026_05_11_Sceptics/`:

```
pnpm build
```

Expected: build completes without errors. Vite resolves `WaveDiagram` via the symlinked `components/` dir.

- [ ] **Step 4: User-driven dev-server check**

Run `pnpm dev`, navigate to the SMOKE slide. Expected: a smooth sine wave traveling steadily left → right, faint horizontal axis, λ bracket annotated near upper-left. No console errors.

- [ ] **Step 5: Commit**

```bash
git add components/WaveDiagram.vue talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(components): add WaveDiagram for Sceptics Section 1

Full-bleed SVG sine wave with configurable wavelength, amplitude, and speed.
Lives at repo root so the components/ symlink picks it up in every talk.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `ParticleDiagram.vue`

**Files:**
- Create: `components/ParticleDiagram.vue`
- Modify (temporary smoke-test): `talks/2026_05_11_Sceptics/deck.md`

**Behaviour.** A single dot moves along a ballistic (parabolic) or linear trajectory; a faint dotted trail marks the past path. Props: `speed?: number = 1`, `trajectory?: 'ballistic' | 'linear' = 'ballistic'`. Reset when the dot exits the viewBox.

- [ ] **Step 1: Create the component**

```vue
<!-- components/ParticleDiagram.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  speed?: number
  trajectory?: 'ballistic' | 'linear'
}>(), {
  speed: 1,
  trajectory: 'ballistic',
})

const trail = ref<{ x: number; y: number }[]>([])
const pos = ref({ x: 100, y: 800 })
const tick = ref(0)
let raf: number | null = null

const reset = () => {
  trail.value = []
  pos.value = { x: 100, y: 800 }
  tick.value = 0
}

const step = () => {
  tick.value += 1
  const t = tick.value * 0.012 * props.speed
  const x = 100 + 1700 * t
  const y = props.trajectory === 'ballistic'
    ? 800 - 1100 * t + 600 * t * t
    : 800 - 300 * t
  pos.value = { x, y }
  trail.value.push({ x, y })
  if (x > 1900 || y > 1080 || y < 0) reset()
  raf = requestAnimationFrame(step)
}

onMounted(() => { raf = requestAnimationFrame(step) })
onUnmounted(() => { if (raf !== null) cancelAnimationFrame(raf) })
</script>

<template>
  <svg
    viewBox="0 0 1920 1080"
    class="absolute inset-0 w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <line x1="0" y1="950" x2="1920" y2="950" stroke="currentColor" stroke-width="1" stroke-opacity="0.15" />
    <polyline
      :points="trail.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-dasharray="6 8"
      stroke-opacity="0.45"
    />
    <circle :cx="pos.x" :cy="pos.y" r="18" fill="currentColor" />
  </svg>
</template>
```

- [ ] **Step 2: Replace the smoke-test slide content**

In `talks/2026_05_11_Sceptics/deck.md`, change the SMOKE slide from `<WaveDiagram />` to:

```markdown
# SMOKE — ParticleDiagram

<ParticleDiagram />
```

- [ ] **Step 3: Build**

```
pnpm build
```

Expected: clean build.

- [ ] **Step 4: User-driven dev-server check**

`pnpm dev` → SMOKE slide. Expected: a dot launches from lower-left, arcs up-right then back down (ballistic), dotted trail behind it; resets when it exits the right edge or the bottom.

- [ ] **Step 5: Commit**

```bash
git add components/ParticleDiagram.vue talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(components): add ParticleDiagram for Sceptics Section 1

Ballistic/linear trajectory with a fading dotted trail. Resets at viewBox edges.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `WavePacketDiagram.vue`

**Files:**
- Create: `components/WavePacketDiagram.vue`
- Modify (temporary smoke-test): `talks/2026_05_11_Sceptics/deck.md`

**Behaviour.** A traveling Gaussian envelope `exp(-(x-x₀)²/2σ²)` modulating a carrier `cos(k(x-x₀) - ωt)`. Click → packet collapses to a particle dot over ~400 ms; click again → re-spreads. Props: `speed?: number = 1`, `sigma?: number = 200`, `k?: number = 0.06`, `interactive?: boolean = true`. State machine `idle → collapsing → collapsed → spreading → idle`. Critical: the wrapper element must `@click.stop` (and pointer/wheel/touch counterparts) — without that, clicks bubble to Slidev and advance the deck.

- [ ] **Step 1: Create the component**

```vue
<!-- components/WavePacketDiagram.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type State = 'idle' | 'collapsing' | 'collapsed' | 'spreading'

const props = withDefaults(defineProps<{
  speed?: number
  sigma?: number
  k?: number
  interactive?: boolean
}>(), {
  speed: 1,
  sigma: 200,
  k: 0.06,
  interactive: true,
})

const state = ref<State>('idle')
const tickN = ref(0)
const transition = ref(0) // 0 → 1 over the collapse / spread animation
let raf: number | null = null

const COLLAPSE_FRAMES = 24 // ~400 ms at 60 fps

const step = () => {
  tickN.value += 1
  if (state.value === 'collapsing' || state.value === 'spreading') {
    transition.value = Math.min(1, transition.value + 1 / COLLAPSE_FRAMES)
    if (transition.value >= 1) {
      state.value = state.value === 'collapsing' ? 'collapsed' : 'idle'
      transition.value = 0
    }
  }
  raf = requestAnimationFrame(step)
}

const handleClick = () => {
  if (!props.interactive) return
  if (state.value === 'idle') { state.value = 'collapsing'; transition.value = 0 }
  else if (state.value === 'collapsed') { state.value = 'spreading'; transition.value = 0 }
}

onMounted(() => { raf = requestAnimationFrame(step) })
onUnmounted(() => { if (raf !== null) cancelAnimationFrame(raf) })

const x0 = computed(() => 240 + ((tickN.value * 4 * props.speed) % 1440))

const effectiveSigma = computed(() => {
  const COLLAPSED = 6
  if (state.value === 'idle') return props.sigma
  if (state.value === 'collapsed') return COLLAPSED
  const blend = transition.value
  if (state.value === 'collapsing') return props.sigma * (1 - blend) + COLLAPSED * blend
  return COLLAPSED * (1 - blend) + props.sigma * blend
})

const dotOpacity = computed(() => {
  if (state.value === 'collapsed') return 1
  if (state.value === 'collapsing') return transition.value
  if (state.value === 'spreading') return 1 - transition.value
  return 0
})

const path = computed(() => {
  const w = 1920
  const cy = 540
  const A = 320
  const sigma = effectiveSigma.value
  const xc = x0.value
  const omega = 0.18 * props.speed
  const pts: string[] = []
  for (let x = 0; x <= w; x += 3) {
    const env = Math.exp(-((x - xc) ** 2) / (2 * sigma * sigma))
    const carrier = Math.cos(props.k * (x - xc) - omega * tickN.value)
    const y = cy + A * env * carrier
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M ${pts.join(' L ')}`
})
</script>

<template>
  <div
    class="absolute inset-0"
    :class="{ 'cursor-pointer': props.interactive }"
    @click.stop="handleClick"
    @mousedown.stop
    @mouseup.stop
    @pointerdown.stop
    @pointerup.stop
    @wheel.stop
    @touchstart.stop
    @touchend.stop
  >
    <svg
      viewBox="0 0 1920 1080"
      class="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <line x1="0" y1="540" x2="1920" y2="540" stroke="currentColor" stroke-width="1" stroke-opacity="0.15" />
      <path
        :d="path"
        stroke="currentColor"
        stroke-width="6"
        fill="none"
        stroke-linecap="round"
        :opacity="1 - dotOpacity"
      />
      <circle
        :cx="x0"
        cy="540"
        r="18"
        fill="currentColor"
        :opacity="dotOpacity"
      />
    </svg>
  </div>
</template>
```

- [ ] **Step 2: Replace the smoke-test slide content**

```markdown
# SMOKE — WavePacketDiagram

<WavePacketDiagram />
```

- [ ] **Step 3: Build**

```
pnpm build
```

Expected: clean build.

- [ ] **Step 4: User-driven dev-server check**

`pnpm dev` → SMOKE slide. Expected:
1. A localized wave packet drifts steadily left → right.
2. **Click on the slide.** The packet collapses into a single dot at the peak position over ~400 ms.
3. Click again. The dot fades back into the spreading wave packet.
4. **Critical:** clicking does NOT advance the deck. (If it does, `@click.stop` is missing.)

- [ ] **Step 5: Commit**

```bash
git add components/WavePacketDiagram.vue talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(components): add interactive WavePacketDiagram

Gaussian-envelope carrier with click-to-collapse state machine.
Pointer/wheel/touch events are .stop'd so clicks don't bubble to Slidev
and advance the deck.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Section 1 component slides

Goal: replace the SMOKE slide with three properly captioned slides, inserted between the existing "Klasikinė intuicija" card slide and the atomic-orbital iframe.

### Task 4: Insert WaveDiagram, ParticleDiagram, WavePacketDiagram slides

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

**Insertion point.** Between the existing slide ending at `Tai ne filosofija. Tai išmatuota.` (currently around line 108) and the atomic-orbital iframe slide (currently around line 110) — i.e., immediately after the `</div>` block that closes the *Klasikinė intuicija vs. tikrovė* slide. The insertion is **before** the `---` slide separator that opens the iframe slide.

**Slide caption pattern.** Each diagram slide is full-bleed; a small `card pad-tight` overlay sits at the bottom-left with a title + caption. This avoids competing with the SVG and matches the iframe slide's full-bleed feel.

- [ ] **Step 1: Remove the SMOKE slide added in Phase 1**

Delete the trailing `# SMOKE — WavePacketDiagram` slide and its `---` separator at the end of `deck.md`.

- [ ] **Step 2: Insert the three component slides**

Insert the following after the *Klasikinė intuicija vs. tikrovė* slide and before the atomic-orbital iframe slide. The insertion goes between two existing `---` separators — make sure the new content is sandwiched by `---` markers exactly as shown:

```markdown
---

<WaveDiagram />

<div class="absolute bottom-8 left-8 right-8 max-w-[60%]">
  <div class="card card-info pad-tight">

  ## 🌊 **Banga**

  Vandens paviršiuje, garse, šviesoje. Užima erdvę, neša energiją, gali interferuoti.

  </div>
</div>

---

<ParticleDiagram />

<div class="absolute bottom-8 left-8 right-8 max-w-[60%]">
  <div class="card card-warning pad-tight">

  ## ⚪ **Taškinė dalelė**

  Biliardo rutuliukas. Tiksli padėtis, tikslus greitis, lokalus poveikis.

  </div>
</div>

---

<WavePacketDiagram />

<div class="absolute bottom-8 left-8 right-8 max-w-[60%]">
  <div class="card card-primary pad-tight">

  ## ⚛️ **Bangos paketas**

  Kvantinis objektas — nei viena, nei kita. Lokalizuota banga. Padėtis ir greitis vienu metu — neapibrėžti.

  <div class="opacity-70 mt-1 text-sm">Spausk ant skaidrės — paketas „kolapsuoja" į dalelę.</div>

  </div>
</div>
```

- [ ] **Step 3: Build**

```
pnpm build
```

Expected: clean build.

- [ ] **Step 4: User-driven dev-server check**

`pnpm dev` → navigate through Section 1. Expected:
1. After *Klasikinė intuicija* card slide, a Banga slide with the moving sine wave + caption card lower-left.
2. Then Taškinė dalelė with the moving dot + caption.
3. Then Bangos paketas with the wave packet + interactive collapse + caption that mentions clicking.
4. Then the existing atomic-orbital iframe slide.
5. Click on Bangos paketas slide collapses the packet — does NOT advance to the iframe slide.

- [ ] **Step 5: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): wire WaveDiagram/ParticleDiagram/WavePacketDiagram into Section 1

Three new slides between the classical-vs-reality card and the atomic-orbital
iframe, each with a bottom-left caption card explaining what the audience is
seeing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Manim preface

Goal: render `double_slit_classical_vs_quantum.mp4` (~12 s, three scenes) into `videos/raw/`, then the standard manifest pipeline produces `public/videos/`.

### Task 5: Add Manim to the conda environment

**Files:**
- Modify: `env.yaml`

- [ ] **Step 1: Edit `env.yaml`**

Add a `pip:` block to the dependencies list. The full file should read:

```yaml
# Full environment for the outreach-talks monorepo.
#   conda env create -f env.yaml
#   conda activate outreach_talks
#   pnpm install                      # installs all talks' deps
#   cd talks/<name> && pnpm dev       # start the dev server for a talk
name: outreach_talks
channels:
  - conda-forge
dependencies:
  - python>=3.11   # tomllib requires 3.11+
  - ffmpeg         # encode / remux
  - rclone         # videos:sync from gdrive
  - gh             # videos:publish to GitHub Releases
  - nodejs>=20     # runtime for slidev
  - pnpm           # package manager; installs @slidev/cli per-project
  - cairo          # Manim render backend
  - pango          # Manim text rendering
  - pip
  - pip:
      - manim>=0.18  # Community edition, double-slit preface render
```

- [ ] **Step 2: User runs the env update**

This is a user step — the agent does not run conda commands without confirmation. Tell the user:

> Run `conda env update -f env.yaml --prune` (in your `outreach_talks` env). Confirm `which manim` returns a path inside the env after activation.

- [ ] **Step 3: Verify Manim is callable**

```
manim --version
```

Expected: prints a Manim Community version ≥ 0.18.

- [ ] **Step 4: Commit**

```bash
git add env.yaml
git commit -m "$(cat <<'EOF'
build(env): add Manim Community for Sceptics double-slit preface render

Manim isn't on conda-forge; install via pip with cairo/pango pulled in via
conda for the native deps.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Write and render the Manim preface

**Files:**
- Create: `talks/2026_05_11_Sceptics/scripts/manim/double_slit_preface.py`
- Output: `talks/2026_05_11_Sceptics/videos/raw/double_slit_classical_vs_quantum.mp4`

**Three scenes (~4 s each):** classical balls (two bumps, no interference) → classical waves (interference fringes) → electrons (single hits, accumulate to interference). Lithuanian captions. 3840×2160 @ 60 fps; Manim's `-qk` ("4k_quality") preset.

- [ ] **Step 1: Create the Manim script**

```python
# talks/2026_05_11_Sceptics/scripts/manim/double_slit_preface.py
"""Double-slit preface: classical balls -> classical waves -> electrons.

Render: manim -qk -o double_slit_classical_vs_quantum.mp4 \
    scripts/manim/double_slit_preface.py DoubleSlitPreface

Output is appended to: talks/2026_05_11_Sceptics/media/videos/...
After render, move to videos/raw/ for the standard encode pipeline.
"""

from manim import (
    BLUE,
    DOWN,
    GREEN,
    LEFT,
    RIGHT,
    UP,
    WHITE,
    YELLOW,
    Axes,
    Circle,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Group,
    Line,
    Rectangle,
    Scene,
    Text,
    VGroup,
    Write,
    smooth,
)
import numpy as np


SLIT_X = 0.0
SLIT_Y_TOP = 0.6
SLIT_Y_BOT = -0.6
SCREEN_X = 4.5


def make_apparatus():
    """Two-slit barrier + screen, returned as a VGroup."""
    barrier_top = Line([SLIT_X, 3.5, 0], [SLIT_X, SLIT_Y_TOP + 0.3, 0], stroke_width=8)
    barrier_mid = Line([SLIT_X, SLIT_Y_TOP - 0.3, 0], [SLIT_X, SLIT_Y_BOT + 0.3, 0], stroke_width=8)
    barrier_bot = Line([SLIT_X, SLIT_Y_BOT - 0.3, 0], [SLIT_X, -3.5, 0], stroke_width=8)
    screen = Line([SCREEN_X, -3.5, 0], [SCREEN_X, 3.5, 0], stroke_width=4, color=WHITE)
    return VGroup(barrier_top, barrier_mid, barrier_bot, screen)


class DoubleSlitPreface(Scene):
    def construct(self):
        # Scene 1: classical balls
        apparatus = make_apparatus()
        self.play(Create(apparatus), run_time=0.6)

        caption1 = Text('Klasikinis kūnas: dvi juostos.', font_size=36).to_edge(DOWN)
        self.play(FadeIn(caption1), run_time=0.3)

        rng = np.random.default_rng(1)
        ball_hits_top = []
        ball_hits_bot = []
        for _ in range(40):
            slit_y = SLIT_Y_TOP if rng.random() < 0.5 else SLIT_Y_BOT
            angle = rng.normal(0, 0.05)
            launch_y = rng.uniform(-2.5, 2.5)
            start = np.array([-5.0, launch_y, 0])
            mid = np.array([SLIT_X, slit_y, 0])
            end = np.array([SCREEN_X, slit_y + (SCREEN_X - SLIT_X) * np.tan(angle), 0])
            (ball_hits_top if slit_y > 0 else ball_hits_bot).append(end)

            ball = Dot(point=start, radius=0.06, color=YELLOW)
            self.add(ball)
            self.play(ball.animate.move_to(mid), run_time=0.04, rate_func=smooth)
            self.play(ball.animate.move_to(end), run_time=0.04, rate_func=smooth)
            self.add(Dot(point=end, radius=0.05, color=YELLOW))
            self.remove(ball)

        self.wait(0.4)
        self.play(FadeOut(caption1), run_time=0.3)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not apparatus], run_time=0.4)

        # Scene 2: classical waves with interference
        caption2 = Text('Klasikinė banga: interferencija.', font_size=36).to_edge(DOWN)
        self.play(FadeIn(caption2), run_time=0.3)

        wave_axes = Axes(
            x_range=[SCREEN_X - 0.3, SCREEN_X + 0.3, 0.1],
            y_range=[-3, 3, 1],
            x_length=0.5,
            y_length=6,
            tips=False,
        ).move_to([SCREEN_X + 0.6, 0, 0])
        intensity = wave_axes.plot(
            lambda y: 1.5 * (np.cos(3 * y) ** 2) * np.exp(-0.05 * y * y),
            color=BLUE,
        )
        self.play(Create(intensity), run_time=1.5)
        self.wait(1.5)
        self.play(FadeOut(caption2), FadeOut(intensity), FadeOut(wave_axes), run_time=0.4)

        # Scene 3: electrons (the surprise)
        caption3 = Text('Elektronas: ir vienas, ir banga.', font_size=36, color=GREEN).to_edge(DOWN)
        self.play(FadeIn(caption3), run_time=0.3)

        rng = np.random.default_rng(7)
        for _ in range(60):
            # Sample from interference distribution: (cos(3y))^2 * gaussian envelope.
            while True:
                y = rng.uniform(-3, 3)
                p = (np.cos(3 * y) ** 2) * np.exp(-0.05 * y * y)
                if rng.random() < p:
                    break
            slit_y = SLIT_Y_TOP if rng.random() < 0.5 else SLIT_Y_BOT
            start = np.array([-5.0, rng.uniform(-1, 1), 0])
            mid = np.array([SLIT_X, slit_y, 0])
            end = np.array([SCREEN_X, y, 0])
            ball = Dot(point=start, radius=0.05, color=GREEN)
            self.add(ball)
            self.play(ball.animate.move_to(mid), run_time=0.025, rate_func=smooth)
            self.play(ball.animate.move_to(end), run_time=0.025, rate_func=smooth)
            self.add(Dot(point=end, radius=0.04, color=GREEN))
            self.remove(ball)

        self.wait(0.6)
```

- [ ] **Step 2: Render at 4K**

Run from `talks/2026_05_11_Sceptics/`:

```
manim -qk --media_dir media -o double_slit_classical_vs_quantum.mp4 \
    scripts/manim/double_slit_preface.py DoubleSlitPreface
```

Manim writes to `media/videos/double_slit_preface/2160p60/double_slit_classical_vs_quantum.mp4`.

- [ ] **Step 3: Move the render to `videos/raw/`**

```
mkdir -p videos/raw
mv media/videos/double_slit_preface/2160p60/double_slit_classical_vs_quantum.mp4 \
    videos/raw/double_slit_classical_vs_quantum.mp4
```

- [ ] **Step 4: Spot-check the render**

Open `videos/raw/double_slit_classical_vs_quantum.mp4` in a player. Expected: three scenes in sequence with the captions above; total length ~10–14 s. If a scene runs too long or the dot count looks wrong, tweak the `range()` counts and re-render.

- [ ] **Step 5: Add `media/` to `.gitignore` if not already**

Check `talks/2026_05_11_Sceptics/.gitignore` (or repo-root `.gitignore`) — Manim's `media/` output dir should be ignored. Add the line `media/` if missing.

- [ ] **Step 6: Commit (script + .gitignore only — raw video stays gitignored)**

```bash
git add talks/2026_05_11_Sceptics/scripts/manim/double_slit_preface.py
# Add the .gitignore change too if you made one:
git add talks/2026_05_11_Sceptics/.gitignore 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(sceptics): add Manim double-slit preface script

Three-scene render (classical balls -> waves -> electrons) for the
Section 1 bridge. Output goes to videos/raw/ and is encoded by the
standard pipeline.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Hitachi footage + manifest

### Task 7: Source the Hitachi raw

**Files:**
- Inputs: `gdrive:Work/Outreach/Resources/Videos/released/double_slit_hitachi.mp4` (user-sourced)

**Licensing.** The 1989 Tonomura/Hitachi single-electron buildup footage is widely circulated but per spec risk note F, **the licensing is not always clean**. Two acceptable paths:

- **Path A (preferred):** locate a Hitachi-published version with explicit redistribution permission (Hitachi's own channels sometimes publish educational mirrors), trim to ~30 s of the buildup, place at `gdrive:Work/Outreach/Resources/Videos/released/double_slit_hitachi.mp4`. Already H.264, will use `profile = "remux"`.
- **Path B (fallback):** if a clean source can't be confirmed, **skip this slide** and instead extend the Manim preface (Task 6) with a fourth scene that mimics the dot-by-dot buildup at higher fidelity. In that case, do not add the `double_slit_hitachi.mp4` manifest entry in Task 8.

- [ ] **Step 1: Decide the path**

User confirms which path. Record the choice in the commit message of Task 8.

- [ ] **Step 2 (Path A only): Place the raw on gdrive**

User uploads the trimmed clip to `gdrive:Work/Outreach/Resources/Videos/released/double_slit_hitachi.mp4` and notes the original source for the attribution slide.

- [ ] **Step 3 (Path A only): Sync**

From `talks/2026_05_11_Sceptics/`:

```
pnpm videos:sync
```

Expected: `videos/raw/double_slit_hitachi.mp4` appears.

---

### Task 8: Add manifest entries and encode

**Files:**
- Modify: `talks/2026_05_11_Sceptics/videos/manifest.toml`

- [ ] **Step 1: Add the manifest entries**

Append to `videos/manifest.toml`:

```toml
[[videos]]
name    = "double_slit_classical_vs_quantum.mp4"
profile = "high-motion"
used_in = ["deck"]
notes   = "Manim preface, ~12 s. Three scenes: classical balls (no interference), classical waves (interference), electrons (interference, surprise reveal). Source script: scripts/manim/double_slit_preface.py."

[[videos]]
name    = "double_slit_hitachi.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Tonomura / Hitachi 1989 single-electron buildup. Already web-friendly H.264; remux only. Skip this entry if Path B (Manim fallback) was chosen in Task 7."
```

(If Task 7 went down Path B, omit the second `[[videos]]` block.)

- [ ] **Step 2: Try pull first (per recorded preference)**

```
pnpm videos:pull
```

Expected on a fresh build: nothing to pull (these are new videos). On a re-run after publish: the encoded files are downloaded directly.

- [ ] **Step 3: Encode any missing files**

```
pnpm videos:encode
```

Expected: produces `public/videos/double_slit_classical_vs_quantum.mp4` (and `double_slit_hitachi.mp4` on Path A) within the configured `max_size_mb` cap.

- [ ] **Step 4: Verify manifest consistency**

```
pnpm videos:check
```

Expected: ✅ all three checks pass (manifest ↔ raw ↔ public ↔ deck references). Slide references aren't added yet, so `videos:check` will warn that the deck doesn't reference these files — that's expected at this point and resolves in Task 9.

- [ ] **Step 5: Commit**

```bash
git add talks/2026_05_11_Sceptics/videos/manifest.toml
git commit -m "$(cat <<'EOF'
feat(sceptics): add manifest entries for double-slit videos

Manim preface goes through high-motion profile; Hitachi buildup uses
remux since the source is already web-friendly H.264.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Section 1 video slides

### Task 9: Insert the Manim + Hitachi slides

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

**Insertion point.** Immediately after the *Bangos paketas* slide (added in Task 4) and before the atomic-orbital iframe slide. Each video slide is full-bleed; **no h1** on a video slide (per CLAUDE.md — `VideoPlayer` is `position: absolute; inset: 0` and would obscure the title). Captions go on a small overlay card.

- [ ] **Step 1: Insert the two video slides**

Insert the following between the WavePacketDiagram slide and the atomic-orbital iframe slide:

```markdown
---

<VideoPlayer src="double_slit_classical_vs_quantum.mp4" muted />

<div class="absolute bottom-8 left-8 right-8 max-w-[60%]">
  <div class="card card-secondary pad-tight">

  ## 🎯 **Klasikinis ar kvantinis?**

  Trys scenos: klasikiniai rutuliukai → klasikinė banga → elektronai. Žiūrėk paskutinę.

  </div>
</div>

---

<VideoPlayer src="double_slit_hitachi.mp4" muted />

<div class="absolute bottom-8 left-8 right-8 max-w-[60%]">
  <div class="card card-info pad-tight">

  ## 📷 **Tonomura, Hitachi, 1989**

  Vienas elektronas po kito. Kiekvienas trenkėsi į **vieną tašką** — vis dėlto sklaida sako, kad jis ėjo per **abu** plyšius.

  <div class="opacity-70 mt-1 text-sm">Tai ne animacija — tai duomenys.</div>

  </div>
</div>
```

If Task 7 went down Path B (no Hitachi clip), **omit the second slide entirely** — the Manim preface is the section's anchor.

- [ ] **Step 2: Build**

```
pnpm build
```

Expected: clean build, `videos:check` happy.

- [ ] **Step 3: Re-run the manifest check**

```
pnpm videos:check
```

Expected: all checks pass with no warnings about unreferenced manifest entries.

- [ ] **Step 4: User-driven dev-server check**

`pnpm dev` → walk through Section 1 in full. Expected sequence:
1. Section divider — *Kai fizika sulūžo*
2. Card — *Klasikinė intuicija vs. tikrovė*
3. Banga
4. Taškinė dalelė
5. Bangos paketas (interactive)
6. Klasikinis ar kvantinis? (Manim preface autoplays)
7. Tonomura/Hitachi (autoplays — or skip if Path B)
8. Atomic-orbital iframe
9. Card — *Superpozicija*

Each video should autoplay (autoplay is `VideoPlayer`'s default), the caption card should be readable against the video, and no slide should advance unexpectedly when the user pauses or scrubs the video.

- [ ] **Step 5: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): wire double-slit Manim preface and Hitachi footage

Two video slides between the WavePacket diagram and the atomic-orbital
iframe; full Section 1 bridge is now in place.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Bonus visuals

### Task 10: Heisenberg — reuse `WavePacketDiagram` on Myth #4

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md` — *Mitas Nr. 4 — „Neapibrėžtumas = bloga įranga"* slide (currently around line 332)

**Goal.** Replace the *Ką sako fizika* card body with **two side-by-side WavePacketDiagram instances**: σ small (narrow position → wide momentum) and σ large (wide position → narrow momentum), both non-interactive, with one-sentence captions under each.

The current Myth #4 slide layout is `grid-2`, with the *Ką teigia mitas* card on the left and *Ką sako fizika* on the right. The right card needs the body replaced — keep the heading.

- [ ] **Step 1: Replace the Myth #4 *Ką sako fizika* card body**

Find the slide whose heading is `# 🚫 **Mitas Nr. 4 — „Neapibrėžtumas = bloga įranga"**`. The right-hand card currently looks like:

```markdown
<div class="card card-success pad-tight">

### Ką sako fizika

Neapibrėžtumas — **sistemos savybė**, ne matavimo trūkumas.

Dalelė su tiksliai apibrėžta padėtimi **neturi** apibrėžto impulso. Ne „nežinome“ — **jo nėra**.

</div>
```

Replace it with:

```markdown
<div class="card card-success pad-tight">

### Ką sako fizika

Neapibrėžtumas — **sistemos savybė**, ne matavimo trūkumas.

<div class="grid-2 mt-2">
  <div class="relative h-32 overflow-hidden rounded">
    <WavePacketDiagram :sigma="40" :interactive="false" />
  </div>
  <div class="relative h-32 overflow-hidden rounded">
    <WavePacketDiagram :sigma="320" :interactive="false" />
  </div>
</div>

<div class="grid-2 mt-1 text-sm opacity-80">
  <div>Tiksli padėtis → neapibrėžtas impulsas.</div>
  <div>Tikslus impulsas → neapibrėžta padėtis.</div>
</div>

</div>
```

The `relative h-32 overflow-hidden` wrapper constrains the absolutely-positioned `WavePacketDiagram` to a fixed-height card-internal frame (the component's `inset-0` is anchored to the nearest positioned ancestor).

- [ ] **Step 2: Build**

```
pnpm build
```

- [ ] **Step 3: User-driven dev-server check**

`pnpm dev` → Myth #4 slide. Expected:
1. The right-hand card now contains two side-by-side WavePacket animations.
2. Left: a sharp, narrow packet (concentrated position).
3. Right: a wide, gentle packet (spread position).
4. Below each, a one-line caption.
5. **Clicking on the WavePacket areas does not collapse them** (because `interactive="false"`).
6. **Clicking on the slide elsewhere does advance the deck normally** (because the non-interactive wrapper still passes events through).

- [ ] **Step 4: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): reuse WavePacketDiagram on Myth #4 (Heisenberg)

Two non-interactive instances side-by-side show the position-momentum
trade-off visually inside the existing 'Ka sako fizika' card.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Decoherence card on Myth #2

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md` — *Mitas Nr. 2 — „Schrödingerio katė tikrai gyva ir mirusi"* slide

**Goal.** Add a small `card-accent pad-tight` strip below the existing two-card `grid-2` that visually emphasises the 19-orders-of-magnitude gap between human reaction time and cat decoherence time.

- [ ] **Step 1: Add the comparison card after the existing grid**

Find the Myth #2 slide. After the closing `</div>` of the outer `grid-2 mt-md`, insert a comparison strip:

```markdown
<div class="mt-md flex justify-center">
  <div class="card card-accent pad-tight max-w-[80%]">

  <div class="grid-2 items-center text-center">
    <div>
      <div class="opacity-70 text-sm">Žmogaus reakcija</div>
      <div class="text-3xl font-mono">~10⁻¹ s</div>
    </div>
    <div>
      <div class="opacity-70 text-sm">Katės dekoherencija</div>
      <div class="text-3xl font-mono">~10⁻²⁰ s</div>
    </div>
  </div>

  <div class="text-center mt-2 opacity-90">Skirtumas — **19 eilių didesnis**.</div>

  </div>
</div>
```

- [ ] **Step 2: Build**

```
pnpm build
```

- [ ] **Step 3: User-driven dev-server check**

`pnpm dev` → Myth #2 slide. Expected: the existing two cards remain unchanged; below them, a centered accent card showing `~10⁻¹ s` vs `~10⁻²⁰ s` with the "19 eilių didesnis" line. The card should fit on the slide without overflowing — if it does, reduce the existing card padding to `pad-snug`.

- [ ] **Step 4: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add decoherence comparison card to Myth #2

Visual emphasis on the 19-order gap between human reaction time and
cat decoherence — turns the abstract '10^-20 s' into a comparable scale.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — Section 2 content

Goal: replace the empty Section 2 divider with three slides — *Be QM nebūtų...* (everyday tech), *Pažangos riba 2026* (quantum computers, honest), *Kvantinis jutimas + tinklai* (deployed today).

### Task 12: Slide *Be QM nebūtų...* (4-card grid)

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after the Section 2 divider**

Find the existing `# 2 dalis — Kur QM yra šiandien` section divider slide. Insert the new slide immediately after it:

```markdown
---

# 🔌 **Be QM nebūtų...**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 📱 **Tranzistorius**

Telefonai, kompiuteriai, automobiliai. Pusės XX a. revoliucija stovi ant juostinės teorijos — gryno QM.

</div>

<div class="card card-secondary pad-tight">

## 🔬 **Lazeris**

Stimuliuota emisija (Einstein, 1917). Šiandien — pluošto internetas, parduotuvės, akių chirurgija.

</div>

<div class="card card-info pad-tight">

## 🧲 **MRT**

Branduolinio sukinio rezonansas. Be Pauli ir Diraco — nėra MRT skenerių.

</div>

<div class="card card-accent pad-tight">

## 🛰️ **GPS**

Atominiai laikrodžiai (cezio kvantinis perėjimas) + reliatyvistinė pataisa. Be jų — ±11 km per dieną.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Jeigu QM klystų 12 ženklų po kablelio — jūsų telefonas neįsijungtų.
</div>
```

- [ ] **Step 2: Build + dev check**

```
pnpm build
```

`pnpm dev` → confirm the new slide renders as a 2×2 grid; footer line is readable; no overflow at 16:9 4K.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Be QM nebutu...' four-card slide for Section 2

Tranzistorius, lazeris, MRT, GPS — concrete everyday tech that quantum
mechanics underpins. Disarms the 'this is just abstract physics' frame.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Slide *Pažangos riba 2026 — kvantiniai kompiuteriai*

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after the previous Section 2 slide**

```markdown
---

# 🧮 **Pažangos riba 2026 — kvantiniai kompiuteriai**

<div class="grid-2 mt-md">

<div class="card card-info pad-tight">

### Kur jie tikrai yra (2026)

Triukšmingi, ~1000 fizinių kubitų, klaidų korekcija — ankstyvieji demonstracijos eksperimentai.

Nė vienas dar nepralenkė klasikinio kompiuterio realioje užduotyje, kuri **nebūtų sukonstruota tam, kad QC laimėtų**.

</div>

<div class="card card-warning pad-tight">

### Ko greitai NE**padarys

- Nepalauš RSA ryt.
- Nesukurs DI.
- Neišgydys ligų magija.

</div>

</div>

<div class="card card-success pad-tight mt-md">

### Ko greičiausiai pasieks per 5–10 metų

Kvantinė chemija (vaistai, baterijos), kombinatorinis optimizavimas, kvantinė kriptografija (post-kvantinė — **jau diegiama**).

</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → slide should render with two top cards (Kur jie yra / Ko nepadarys) and a wider success card below. Confirm vertical fit at 16:9.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add quantum computers honest-framing slide for Section 2

Where they are (noisy ~1000 qubits, no real-task supremacy yet), what
they won't do soon (RSA / AI / disease cures), what they likely will
(chemistry, optimisation, post-quantum crypto — already deployed).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Slide *Kvantinis jutimas + tinklai (jau dabar)*

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after the previous Section 2 slide**

```markdown
---

# 📡 **Kvantinis jutimas + tinklai (jau dabar)**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

### Kvantinis jutimas

- **Atominiai gravitometrai** — požeminių struktūrų vaizdinimas.
- **Magnetometrai** — smegenų magnetoencefalografija be šaldymo.
- **Atominiai laikrodžiai** — 10⁻¹⁹ tikslumu.

</div>

<div class="card card-accent pad-tight">

### Kvantiniai tinklai

- **Mičio palydovas** (Kinija, 2017+) — kvantinis raktų pasiskirstymas iš orbitos.
- **EuroQCI** — ES kvantinis ryšio tinklas.
- **BB84** komerciniuose duomenų centruose.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Tai ne ateitis. Tai šiandiena, tik mažiau garsi nei „kvantinis kompiuteris".
</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → confirm clean 2-column layout, footer fits.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add quantum sensing + networks slide for Section 2

The deployed-today story (gravitometers, magnetometers, atomic clocks,
Mozi/EuroQCI/BB84) — counterweight to the QC hype slide.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8 — Section 4 content

Goal: replace the empty Section 4 divider with five slides framing CERN as a *testing* organisation.

**CERN media sourcing (one-time, before Tasks 15–19).** Create `talks/2026_05_11_Sceptics/public/figures/cern/` with the following CC-BY images sourced from `cds.cern.ch` (CERN Document Server) and an `attribution.txt` listing each:

- `aerial.jpg` — CERN Meyrin aerial. e.g. CDS image search "CERN aerial Meyrin" — pick a CC-BY-licensed press image.
- `higgs_event.png` — ATLAS or CMS Higgs event display, July 2012 candidate.
- `alpha_antihydrogen.png` — ALPHA experiment apparatus or spectrum.
- `cms_w_mass.png` — CMS 2024 W mass measurement chart.
- `lhcb_event.png` — LHCb event display (used in Task 19).

**This sourcing is a user step.** The agent should not attempt to fetch CERN images automatically. Each task below assumes the corresponding figure file exists; if it doesn't, the slide still builds with a placeholder background and the user replaces the image later.

- [ ] **Step 0 (one-time): User sources CERN images**

User downloads the five images above from CDS, places them in `talks/2026_05_11_Sceptics/public/figures/cern/`, and creates `attribution.txt` listing source URL + license + photographer for each. Commit the figures + attribution file as a single commit:

```bash
git add talks/2026_05_11_Sceptics/public/figures/cern/
git commit -m "$(cat <<'EOF'
assets(sceptics): source CC-BY CERN images for Section 4

Aerial, Higgs event, ALPHA, CMS W mass, LHCb event display. All from
cds.cern.ch with attribution.txt listing source + license + photographer
per image.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If sourcing slips, Tasks 15–19 still wire the slides — the missing image will simply 404 in dev until the file is added.

---

### Task 15: Slide D.1 — *Kas yra CERN*

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after the existing Section 4 divider**

Find the existing `# 4 dalis — CERN` section divider. Insert immediately after it:

```markdown
---
layout: statement
background: /figures/cern/aerial.jpg
---

# Kas yra CERN

<div class="card card-primary pad-tight max-w-[60%] mx-auto mt-md">

- **23 valstybės narės**, 110+ šalys dalyvauja
- Įkurtas **1954**, atviras (publikacijos viešos), recenzuojamas
- **17 000+** tyrėjų, viešas finansavimas
- Vienas LHC eksperimentas → **tūkstančiai autorių vienoje publikacijoje**

</div>

<div class="mt-md opacity-80 text-center text-lg">
Jei tai būtų sąmokslas — jis būtų prasčiausiai paslėptas pasaulio sąmokslas.
</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → slide should render with the aerial as background, the stat card centered, sceptic-disarming footer below. If the aerial file is missing, the background shows the theme default — that's acceptable until the image is sourced.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Kas yra CERN' slide D.1

Statement layout with aerial background, stat card, and sceptic-disarming
footer line.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Slide D.2 — *Ką CERN patvirtino*

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after D.1**

```markdown
---

# ✅ **Ką CERN patvirtino**

<div class="grid-3 mt-md">

<div class="card card-primary pad-tight">

## 🎯 **Higgsas (2012)**

<img src="/figures/cern/higgs_event.png" class="w-full rounded my-1" />

Paskutinis trūkstamas Standartinio modelio elementas. ATLAS + CMS, ~5σ, dvi nepriklausomos grupės.

</div>

<div class="card card-secondary pad-tight">

## ⚛️ **Antimaterija (ALPHA)**

<img src="/figures/cern/alpha_antihydrogen.png" class="w-full rounded my-1" />

Antivandenilio spektrai 2017–2020. Tokie patys kaip vandenilio ribose paklaidų.

</div>

<div class="card card-info pad-tight">

## ⚖️ **W bozono masė**

<img src="/figures/cern/cms_w_mass.png" class="w-full rounded my-1" />

Sub-promilė tikslumu, sutampa su Standartiniu modeliu (CMS 2024 pataisė ankstesnį Tevatron neatitikimą).

</div>

</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → 3-column grid with image + caption per card. Confirm images don't push card text off-slide; if they do, change `w-full` to `max-h-32 mx-auto`.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Ka CERN patvirtino' slide D.2

Three concrete confirmed results — Higgs (2012), ALPHA antihydrogen
spectroscopy, CMS 2024 W mass — each with a thumbnail and one-line
context.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Slide D.3 — *Ką CERN paneigė* (the sceptical hook)

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after D.2**

```markdown
---
layout: statement
---

# ❌ **Ką CERN paneigė**

<div class="card card-warning pad-tight max-w-[70%] mx-auto mt-md">

> *Mes ieškojome supersimetrijos. Pigios versijos — neradome. Tai irgi mokslas.*

</div>

<div class="grid-2 mt-md max-w-[80%] mx-auto">

<div class="card card-info pad-tight">

- Lengvosios SUSY versijos — **atmestos** LHC duomenimis 2010–2024.
- Kai kurie tamsiosios materijos kandidatai (WIMP > 1 TeV, kai kurie sub-GeV) — **atmesti**.

</div>

<div class="card card-info pad-tight">

- Dauguma „naujosios fizikos" prognozių iš 2000-ųjų — **neišlaikė bandymo**.
- Tas pats LHC, kuris rado Higgsą, **atmetė** dešimtis kitų hipotezių.

</div>

</div>

<div class="mt-md opacity-80 text-center text-lg">
Falsifikacija veikia. Hipotezė, kuri negali pralošti — ne mokslas.
</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → slide should feel like the rhetorical pivot of the section: the quote card at the top, two parallel finding cards below, the "falsifikacija veikia" footer. Confirm the footer doesn't clip.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Ka CERN paneige' slide D.3 — the sceptical hook

Falsification-as-a-feature framing: SUSY light versions ruled out, WIMP
windows narrowed, 2000s 'new physics' predictions tested and discarded.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 18: Slide D.4 — *Ką CERN klausia dabar*

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

- [ ] **Step 1: Insert after D.3**

```markdown
---

# ❓ **Ką CERN klausia dabar**

<div class="grid-3 mt-md">

<div class="card card-primary pad-tight">

## 🌑 **Tamsioji materija**

Kas tai yra? LHC + tiesioginiai detektoriai (LZ, XENONnT) + dangaus stebėjimai.

</div>

<div class="card card-secondary pad-tight">

## ⚖️ **Materijos / antimaterijos asimetrija**

Kodėl Visata yra, o ne išnyko? LHCb, ALPHA, neutrinų eksperimentai.

</div>

<div class="card card-info pad-tight">

## 🌫️ **Neutrinų masė**

KATRIN, JUNO, DUNE; CERN tiekia pluoštus, infrastruktūrą.

</div>

</div>
```

- [ ] **Step 2: Build + dev check**

`pnpm dev` → 3 cards in a row, balanced text length. Confirm no overflow.

- [ ] **Step 3: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Ka CERN klausia dabar' slide D.4

Three open questions: dark matter, matter-antimatter asymmetry,
neutrino mass — concrete experiments named for each.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Slide D.5 — *Mano dalis* (LHCb personal hook)

**Files:**
- Modify: `talks/2026_05_11_Sceptics/deck.md`

**Decision point.** The spec offers three content options. **Default for execution: Option A** — it's the most generic and needs no speaker-specific authoring. The implementing agent inserts Option A as-is; the speaker can later swap to Option B (recent result) or Option C (personal tooling) by editing this slide. The closing slide already references `LHCb_Aciu.mov`, so LHCb is the implicit affiliation.

- **Option A — Detector + role *(default, no speaker-fill required to ship)*.** LHCb event display + role placeholder the speaker can fine-tune.
- **Option B — Recent result.** A single recent LHCb result (CP violation in charm, $B \to K\ell\ell$, lepton-universality) — speaker authors the three lines.
- **Option C — Personal tooling.** Something the speaker built — speaker authors the three lines.

- [ ] **Step 1: Confirm option (default A)**

If the user has not specified, proceed with Option A. Otherwise use the user's choice.

- [ ] **Step 2: Insert the slide for the chosen option**

**Option A:**

```markdown
---

# 🔬 **Mano dalis — LHCb**

<div class="grid-2 mt-md">

<img src="/figures/cern/lhcb_event.png" class="w-full rounded" />

<div class="card card-primary pad-tight">

### Ką aš matau

LHCb — vienas iš keturių didžiųjų LHC eksperimentų. Specializuojasi b ir c kvarkų skilimuose: vieta, kur ieškoma **smulkių neatitikimų** tarp materijos ir antimaterijos.

Mano vaidmuo — *(speaker fills in: 1 sakinys apie konkrečią užduotį / posistemę)*.

</div>

</div>

<div class="mt-md opacity-80 text-center">
Štai kur „kvantinė mechanika" virsta darbo užduotimi.
</div>
```

**Option B (template — speaker picks one result):**

```markdown
---

# 🔬 **Mano dalis — LHCb, *(rezultato pavadinimas)***

<div class="grid-2 mt-md">

<img src="/figures/cern/lhcb_event.png" class="w-full rounded" />

<div class="card card-primary pad-tight">

### Ką išmatavome

*(1–2 sakiniai: kas matuojama, kokia paklaida)*

### Ką tai reiškia

*(1 sakinys: ar sutampa su Standartiniu modeliu, kas buvo atvira anksčiau)*

### Kas dar atvira

*(1 sakinys: kokia hipotezė vis dar gyva, ko reikia kitam matavimui)*

</div>

</div>

<div class="mt-md opacity-80 text-center">
Štai kur „kvantinė mechanika" virsta darbo užduotimi.
</div>
```

**Option C:**

```markdown
---

# 🔬 **Mano dalis — *(įrankis / posistemė)***

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

### Problema

*(2 sakiniai: ką reikėjo išspręsti)*

### Ką padariau

*(2 sakiniai: kas buvo pastatyta, kuriai daliai LHCb to reikia)*

### Kuo tai svarbu

*(1 sakinys: kuriame matavime / analizėje šis įrankis dabar veikia)*

</div>

<img src="/figures/cern/lhcb_event.png" class="w-full rounded" />

</div>

<div class="mt-md opacity-80 text-center">
Štai kur „kvantinė mechanika" virsta darbo užduotimi.
</div>
```

- [ ] **Step 3: Build + dev check**

`pnpm dev` → confirm the chosen option renders, image is sized appropriately, the closing line is readable as the bridge to Section 5.

- [ ] **Step 4: Commit**

```bash
git add talks/2026_05_11_Sceptics/deck.md
git commit -m "$(cat <<'EOF'
feat(sceptics): add 'Mano dalis' personal slide D.5 (LHCb, option <A/B/C>)

Personal hook closing Section 4 — earned-credibility transition into the
myths section. Speaker chose option <A/B/C>: <one-line summary>.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9 — Full deck dry-run

### Task 20: Build, click-through, time, and (optionally) portable bundle

**Files:** none (verification only)

- [ ] **Step 1: Full build**

```
pnpm build
```

Expected: clean Vite build, no warnings beyond pre-existing ones (the g-2 manifest already has TODO notes; those are not introduced by this plan).

- [ ] **Step 2: Manifest sanity**

```
pnpm videos:check
```

Expected: all checks pass.

- [ ] **Step 3: Repo-root cross-talk check**

From the repo root:

```
pnpm videos:check-all
```

Expected: 2026_04_28_editAI's manifest is unchanged and still passes; 2026_05_11_Sceptics passes with two new entries.

- [ ] **Step 4: User-driven full-deck dry-run**

`pnpm dev` → walk the entire deck top-to-bottom. Time it. Expected sequence:

1. Cover → Feynman quote → Šiandien intro
2. Section 1: divider → intuition card → **Banga → Taškinė dalelė → Bangos paketas** → **Manim preface → Hitachi (or skip)** → atomic-orbital iframe → Superpozicija
3. Section 2 divider → **Be QM nebūtų... → Pažangos riba 2026 → Kvantinis jutimas + tinklai**
4. Section 3 (g-2) — unchanged
5. Section 4 divider → **D.1 → D.2 → D.3 → D.4 → D.5** (CERN testing org)
6. Section 5 (myths + flags) — Myth #2 has decoherence card, Myth #4 has WavePacket reuse
7. Closing quote + Ačiū

Target: ~40 minutes total. Adjust per-slide pacing if a section runs long. Note any visual glitches for follow-up.

- [ ] **Step 5: Optional — portable bundle for the venue**

If the talk is in <2 weeks, build the portable bundle as a venue backup:

```
pnpm build:portable
cd dist-portable && python3 -m http.server 8000
```

Verify in a private browser window (`http://localhost:8000`) that all videos play offline. Zip and upload `dist-portable/` to gdrive.

- [ ] **Step 6: Final commit (if any cleanup happened)**

```bash
git status
# If anything was tweaked during the dry-run:
git add -- <specific files>
git commit -m "fix(sceptics): post-dry-run polish"
```

---

## Out of scope (do not implement)

- Restructuring Sections 3 or 5.
- Bell-test diagram, tunneling visual, energy-levels visual (offered, not selected).
- Solar / blue-LED tech examples (offered, not selected).
- New Slidev layouts or theme work.
- Vitest / component tests (no test framework exists in this Slidev deck repo and the user verifies UI by eye — adding it for three visual SVG components is YAGNI).

## Risks recorded for execution

- **Hitachi licensing.** Confirm a clean source before encoding. Path B (extend the Manim preface) is a real fallback, not a placeholder.
- **CERN media licensing.** Each `cds.cern.ch` image needs a per-image license check. Plan a 30-min sourcing pass at Phase 8 Step 0.
- **Aspect-ratio sanity.** All new components use `viewBox="0 0 1920 1080"` and `inset-0`. Eyeball them on the actual 4K projector before the talk. If anything feels squashed, adjust the viewBox aspect to `1920 1080` is already 16:9 — no change needed unless the venue swaps.
- **LHCb specifics for D.5.** Speaker picks option A/B/C and fills the placeholder italics in Task 19 Step 2.
