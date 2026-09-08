<script setup>
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'

// Full-bleed audience quiz card in the hero's visual language (dark gradient,
// grain, Space Grotesk uppercase). One question, three answer tiles; the
// room votes by hand, the presenter reveals.
//
//   <QuizCard
//     n="1" total="8"
//     q="How fast do LHC protons travel?"
//     :options="['99 % of the speed of light', '99.9999991 % of the speed of light', 'Half the speed of light']"
//     :answer="1"
//     fact="At 6.5 TeV a proton is 0.00000009 % short of c — about 3 m/s slower than light." />
//
// Keys while the slide is active: `1`–`3` highlight a tile (point at the
// show of hands), `Enter` or a click reveals (correct tile lights up, the
// rest dim, the fact fades in, a particle burst fires from the tile), `r`
// resets. Nothing here is bound to Slidev's navigation keys.
//
// Like VideoPlayer it is position:absolute; inset:0 — give the slide no h1.

const props = defineProps({
  q:       { type: String, required: true },
  options: { type: Array, required: true },
  answer:  { type: Number, required: true },
  fact:    { type: String, default: '' },
  n:       { type: [String, Number], default: '' },
  total:   { type: [String, Number], default: '' },
  kicker:  { type: String, default: 'Quiz' },
})

const root = ref(null)
const canvas = ref(null)
const tiles = ref([])
const isActive = useIsSlideActive()
const { $renderContext } = useSlideContext()
const isLive = computed(() => $renderContext.value === 'slide' || $renderContext.value === 'presenter')
const picked = ref(-1)
const revealed = ref(false)
const shown = ref(false)
const letters = ['A', 'B', 'C', 'D']

function reveal() {
  if (revealed.value) return
  revealed.value = true
  burstFrom(tiles.value[props.answer])
}
function reset() { revealed.value = false; picked.value = -1 }
function onTile(i) {
  if (!revealed.value) picked.value = i
  reveal()
}
function onKey(e) {
  if (!isActive.value || !isLive.value) return
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  const k = e.key
  if (k >= '1' && k <= String(props.options.length)) { if (!revealed.value) picked.value = Number(k) - 1; return }
  if (k === 'Enter') { reveal(); return }
  if (k === 'r' || k === 'R') reset()
}

// --- reveal burst: a cheap 2D-canvas spray from the correct tile ---------
let ctx = null, raf = 0, parts = []
function burstFrom(el) {
  if (!canvas.value || !el || !root.value) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rr = root.value.getBoundingClientRect(), tr = el.getBoundingClientRect()
  const W = canvas.value.width = Math.round(rr.width), H = canvas.value.height = Math.round(rr.height)
  const cx = (tr.left + tr.width / 2 - rr.left) / rr.width * W
  const cy = (tr.top + tr.height / 2 - rr.top) / rr.height * H
  ctx = canvas.value.getContext('2d')
  parts = []
  const n = 160
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (0.25 + Math.random() * 0.9) * W * 0.0045
    parts.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, r: 1 + Math.random() * 2.2 })
  }
  cancelAnimationFrame(raf)
  let last = performance.now()
  const step = (t) => {
    const dt = Math.min((t - last) / 1000, 1 / 30); last = t
    ctx.clearRect(0, 0, W, H)
    ctx.globalCompositeOperation = 'lighter'
    let alive = 0
    for (const p of parts) {
      if (p.life <= 0) continue
      alive++
      p.x += p.vx * dt * 60; p.y += p.vy * dt * 60
      p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.05
      p.life -= dt * 0.7
      ctx.beginPath()
      ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(p.life, 0) * 0.9})`
      ctx.arc(p.x, p.y, p.r * (0.6 + p.life), 0, Math.PI * 2)
      ctx.fill()
    }
    if (alive) raf = requestAnimationFrame(step)
    else ctx.clearRect(0, 0, W, H)
  }
  raf = requestAnimationFrame(step)
}

watch(isActive, (a) => { if (a) shown.value = true })
onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (isActive.value || !isLive.value) shown.value = true
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="quiz" :class="{ in: shown, revealed }">
    <canvas ref="canvas" class="burst" aria-hidden="true"></canvas>
    <div class="grain" aria-hidden="true"></div>
    <div v-if="n" class="corner corner-tr" aria-hidden="true">{{ kicker }} · {{ n }}<span v-if="total"> / {{ total }}</span></div>
    <div class="corner corner-br" aria-hidden="true">{{ revealed ? 'r — reset' : '1 · 2 · 3 point · enter reveals' }}</div>
    <div class="body">
      <p class="kicker">{{ kicker }}</p>
      <h1 class="q">{{ q }}</h1>
      <div class="tiles">
        <button
          v-for="(o, i) in options" :key="i"
          :ref="(el) => { tiles[i] = el }"
          class="tile"
          :class="{ picked: picked === i && !revealed, correct: revealed && i === answer, wrong: revealed && i !== answer }"
          :style="{ '--i': i }"
          type="button"
          @click.stop="onTile(i)"
        >
          <span class="letter">{{ letters[i] }}</span>
          <span class="label">{{ o }}</span>
        </button>
      </div>
      <p class="fact" :class="{ show: revealed }">{{ fact }}</p>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  --bg: #050507;
  --fg: #f2f5f9;
  --dim: #8b97a6;
  --accent: #7dd3fc;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: absolute; inset: 0; overflow: hidden;
  color: var(--fg);
  font-family: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  background:
    radial-gradient(1100px 700px at 78% -8%, rgba(125, 211, 252, 0.07), transparent 62%),
    radial-gradient(900px 600px at -12% 108%, rgba(125, 211, 252, 0.05), transparent 60%),
    var(--bg);
}
.burst { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
.grain {
  position: absolute; inset: 0; z-index: 10; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.corner {
  position: absolute; right: 34px; z-index: 1; color: var(--dim);
  font-size: 10.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
}
.corner-tr { top: 30px; }
.corner-br { bottom: 30px; }

.body {
  position: absolute; inset: 0; z-index: 1;
  display: flex; flex-direction: column; justify-content: center;
  padding: 0 11%;
}
.kicker {
  font-size: 12.5px; color: var(--accent); margin: 0 0 18px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.12em;
  opacity: 0; transform: translateY(10px); transition: all 0.7s var(--ease) 0.1s;
}
.q {
  margin: 0 0 34px; font-weight: 700; text-transform: uppercase;
  font-size: 40px; line-height: 1.05; letter-spacing: -0.015em; max-width: 24ch;
  opacity: 0; transform: translateY(14px); transition: all 0.8s var(--ease) 0.2s;
}
.in .kicker, .in .q { opacity: 1; transform: none; }

.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tile {
  appearance: none; border: 1px solid rgba(139, 151, 166, 0.28); border-radius: 10px;
  background: rgba(242, 245, 249, 0.03);
  color: var(--fg); text-align: left; cursor: pointer;
  padding: 20px 20px 22px; min-height: 118px;
  display: flex; flex-direction: column; gap: 12px;
  font: inherit; font-size: 16px; line-height: 1.35;
  transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, opacity 0.5s ease, transform 0.5s var(--ease);
  opacity: 0; transform: translateY(16px);
}
.in .tile { opacity: 1; transform: none; transition-delay: calc(0.32s + var(--i) * 0.09s); }
.tile:hover { border-color: rgba(125, 211, 252, 0.55); background: rgba(125, 211, 252, 0.06); }
.letter {
  font-size: 11px; font-weight: 700; letter-spacing: 0.16em; color: var(--accent);
  text-transform: uppercase;
}
.tile.picked { border-color: var(--accent); background: rgba(125, 211, 252, 0.10); }
.tile.correct {
  border-color: var(--accent); background: rgba(125, 211, 252, 0.16); color: #fff;
  box-shadow: 0 0 0 1px rgba(125, 211, 252, 0.6), 0 0 48px rgba(125, 211, 252, 0.28);
  animation: tile-pop 0.6s var(--ease);
  transition-delay: 0s !important;
}
.tile.wrong { opacity: 0.28; transition-delay: 0s !important; }
.tile.correct .letter { color: #fff; }
@keyframes tile-pop { 0% { transform: scale(1.04); } 100% { transform: scale(1); } }
.fact {
  margin: 26px 0 0; min-height: 1.9em; max-width: 70ch;
  color: var(--dim); font-size: 13px; letter-spacing: 0.04em; line-height: 1.75;
  opacity: 0; transform: translateY(8px); transition: all 0.7s var(--ease) 0.25s;
}
.fact.show { opacity: 1; transform: none; }
</style>
