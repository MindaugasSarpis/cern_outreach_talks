<script setup>
// <QcdStorm> … </QcdStorm>: the slide filled with QCD's equations and diagrams, floating at different depths and
// coming in one after another (the owner, 12 Nov: "slide 6 should be reimagined, just floating QCD lagrangians,
// equations, diagrams to show how complicated it is, full screen of all sorts of diagrams / equations floating at
// different depts appearing"). The equations are the slide's own markdown (`$$ … $$` blocks in the slot, set by
// Slidev's KaTeX); the diagrams are drawn here. Each item has a place, a depth (far: small, dim, soft; near: large,
// bright), a moment to appear and a slow drift; the places are a jittered grid from a fixed seed, so every run and
// every screen shows the same picture. Off the live slide (overview, print, the presenter's preview) all of it
// stands at once, still.
import { computed, h, useSlots } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const run = computed(() => live.value && active.value)

// ---- the diagrams (each in a 120 × 80 box) ------------------------------------------------------------------
// a gluon: a coil along the curve c(t) → [x, y], t in 0..1, `n` turns of radius r (a prolate cycloid along it)
function coil(c, n, r = 4.2) {
  const pts = [], N = Math.max(24, n * 14)
  for (let i = 0; i <= N; i++) {
    const t = i / N, [x, y] = c(t), [x2, y2] = c(Math.min(1, t + 1e-3)), [x1, y1] = c(Math.max(0, t - 1e-3))
    let tx = x2 - x1, ty = y2 - y1; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L
    const ph = 2 * Math.PI * n * t
    const along = r * 0.9 * Math.sin(ph), across = r * (1 - Math.cos(ph)) - r
    pts.push(`${(x + tx * along - ty * across).toFixed(2)} ${(y + ty * along + tx * across).toFixed(2)}`)
  }
  return 'M' + pts.join(' L')
}
const seg = (x1, y1, x2, y2) => (t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]
const arc = (cx, cy, R, a0, a1) => (t) => { const a = (a0 + (a1 - a0) * t) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)] }
// a quark line with its arrow at the middle
function quark(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, a = Math.atan2(y2 - y1, x2 - x1), s = 4
  const p = (d, w) => `${(mx + d * Math.cos(a) - w * Math.sin(a)).toFixed(1)} ${(my + d * Math.sin(a) + w * Math.cos(a)).toFixed(1)}`
  return { line: `M${x1} ${y1} L${x2} ${y2}`, head: `M${p(s, 0)} L${p(-s, s * 0.7)} L${p(-s, -s * 0.7)} Z` }
}
const D = [
  // quark-gluon vertex
  { q: [quark(8, 16, 60, 40), quark(60, 40, 112, 16)], g: [coil(seg(60, 40, 60, 76), 5)], dots: [[60, 40]] },
  // three-gluon vertex
  { q: [], g: [coil(seg(10, 12, 60, 40), 6), coil(seg(110, 12, 60, 40), 6), coil(seg(60, 40, 60, 78), 5)], dots: [[60, 40]] },
  // four-gluon vertex
  { q: [], g: [coil(seg(12, 8, 60, 40), 6), coil(seg(108, 8, 60, 40), 6), coil(seg(12, 72, 60, 40), 6), coil(seg(108, 72, 60, 40), 6)], dots: [[60, 40]] },
  // one-gluon exchange
  { q: [quark(8, 14, 60, 14), quark(60, 14, 112, 14), quark(8, 66, 60, 66), quark(60, 66, 112, 66)], g: [coil(seg(60, 14, 60, 66), 7)], dots: [[60, 14], [60, 66]] },
  // quark self-energy
  { q: [quark(6, 58, 34, 58), quark(34, 58, 86, 58), quark(86, 58, 114, 58)], g: [coil(arc(60, 58, 26, 180, 360), 9)], dots: [[34, 58], [86, 58]] },
  // gluon self-energy: a quark loop
  { q: [], g: [coil(seg(4, 40, 40, 40), 5), coil(seg(80, 40, 116, 40), 5)], loop: [60, 40, 20], dots: [[40, 40], [80, 40]] },
  // gluon self-energy: a gluon loop
  { q: [], g: [coil(seg(4, 40, 38, 40), 5), coil(seg(82, 40, 116, 40), 5), coil(arc(60, 40, 22, 180, 540), 16, 3.4)], dots: [[38, 40], [82, 40]] },
  // two-gluon exchange (a ladder)
  { q: [quark(6, 14, 40, 14), quark(40, 14, 80, 14), quark(80, 14, 114, 14), quark(6, 66, 40, 66), quark(40, 66, 80, 66), quark(80, 66, 114, 66)], g: [coil(seg(40, 14, 40, 66), 7), coil(seg(80, 14, 80, 66), 7)], dots: [[40, 14], [80, 14], [40, 66], [80, 66]] },
  // a vertex correction
  { q: [quark(10, 8, 38, 28), quark(38, 28, 60, 44), quark(60, 44, 82, 28), quark(82, 28, 110, 8)], g: [coil(seg(38, 28, 82, 28), 6), coil(seg(60, 44, 60, 78), 5)], dots: [[38, 28], [82, 28], [60, 44]] },
]

// ---- the places -----------------------------------------------------------------------------------------------
const slots = useSlots()
const eqs = computed(() => (slots.default?.() || []).filter((n) => typeof n.type !== 'symbol' || (Array.isArray(n.children) && n.children.length)))
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const items = computed(() => {
  const r = rng(20261118)
  const list = [...eqs.value.map((n) => ({ kind: 'eq', node: n })), ...D.map((d) => ({ kind: 'dg', d }))]
  // equations and diagrams mixed: a diagram after every second equation, the rest at the end
  const mixed = []; const E = list.filter((i) => i.kind === 'eq'), G = list.filter((i) => i.kind === 'dg')
  while (E.length || G.length) { if (E.length) mixed.push(E.shift()); if (E.length) mixed.push(E.shift()); if (G.length) mixed.push(G.shift()) }
  // a depth for each (0 far … 1 near), then a place: the near ones first, each tried at random until its box
  // (estimated: an equation 330 × 64 at scale 1, a diagram 150 × 100) is inside the frame, clear of the caption
  // and of every item near its own depth; a far one may pass behind a near one
  const W = 980, H = 551.25
  const its = mixed.map((it, i) => { const depth = r(); return { ...it, i, depth, sc: 0.55 + 0.75 * depth * depth } })
  const placed = []
  for (const it of [...its].sort((a, b) => b.depth - a.depth)) {
    const w = (it.kind === 'eq' ? 330 : 150) * it.sc, hh = (it.kind === 'eq' ? 64 : 100) * it.sc
    let best = null
    for (let k = 0; k < 400; k++) {
      const x = 12 + w / 2 + r() * (W - w - 24), y = 10 + hh / 2 + r() * (H - hh - 20)
      if (x - w / 2 < 470 && y + hh / 2 > 470) continue                       // the caption's corner
      const gap = k < 250 ? 0.4 : 0.2                                         // how near in depth counts as a clash
      const clash = placed.some((p) => Math.abs(p.depth - it.depth) < gap && Math.abs(p.x - x) < (p.w + w) / 2 + 8 && Math.abs(p.y - y) < (p.h + hh) / 2 + 6)
      best = { x, y }
      if (!clash) break
    }
    Object.assign(it, best, { w, h: hh }); placed.push(it)
  }
  return its.map((it, i) => ({
    ...it,
    x: (it.x / W) * 100, y: (it.y / H) * 100,
    op: 0.42 + 0.58 * it.depth, blur: it.depth < 0.3 ? 1.1 : it.depth < 0.55 ? 0.4 : 0, z: Math.round(it.depth * 20),
    delay: 0.5 + i * 0.42, dur: 16 + r() * 14, dx: (r() - 0.5) * 22 * it.sc, dy: (r() - 0.5) * 14 * it.sc, rot: (r() - 0.5) * 4,
  }))
})
const Eq = (p) => p.node
</script>

<template>
  <div class="qcds" :class="{ run, done: !live }" aria-label="Equations and diagrams of quantum chromodynamics">
    <div v-for="it in items" :key="it.i" class="it" :class="it.kind"
      :style="{ left: it.x + '%', top: it.y + '%', zIndex: it.z, '--sc': it.sc, '--op': it.op, '--blur': it.blur + 'px', '--delay': it.delay + 's', '--dur': it.dur + 's', '--dx': it.dx + 'px', '--dy': it.dy + 'px', '--rot': it.rot + 'deg' }">
      <div class="drift">
        <Eq v-if="it.kind === 'eq'" :node="it.node" />
        <svg v-else viewBox="0 0 120 80" width="150" height="100">
          <path v-for="(q, k) in it.d.q" :key="'l' + k" class="ql" :d="q.line" /><path v-for="(q, k) in it.d.q" :key="'h' + k" class="qh" :d="q.head" />
          <circle v-if="it.d.loop" class="ql" :cx="it.d.loop[0]" :cy="it.d.loop[1]" :r="it.d.loop[2]" />
          <path v-for="(g, k) in it.d.g" :key="'g' + k" class="gl" :d="g" />
          <circle v-for="(p, k) in it.d.dots" :key="'d' + k" class="vx" :cx="p[0]" :cy="p[1]" r="2.2" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout .qcds { position: absolute; inset: 0; overflow: hidden; pointer-events: none; text-transform: none; }
.slidev-layout .qcds .it { position: absolute; transform: translate(-50%, -50%) scale(var(--sc)) rotate(var(--rot)); opacity: var(--op); filter: blur(var(--blur)); color: #dcefff; white-space: nowrap; }
.slidev-layout .qcds .it .katex-display { margin: 0; }
.slidev-layout .qcds .it .katex { font-size: 17px; color: inherit; }
.slidev-layout .qcds .it p { margin: 0; }
.slidev-layout .qcds .ql { fill: none; stroke: #dcefff; stroke-width: 1.4; }
.slidev-layout .qcds .qh { fill: #dcefff; stroke: none; }
.slidev-layout .qcds .gl { fill: none; stroke: #8fc6ff; stroke-width: 1.1; stroke-linejoin: round; }
.slidev-layout .qcds .vx { fill: #ffffff; }
/* live: each comes in at its moment, a little smaller and growing, then drifts */
.slidev-layout .qcds:not(.done) .it { opacity: 0; }
.slidev-layout .qcds.run .it { animation: qcds-in 1.6s ease-out var(--delay) forwards; }
.slidev-layout .qcds.run .drift { animation: qcds-drift var(--dur) ease-in-out var(--delay) infinite alternate; }
@keyframes qcds-in { from { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--sc) * 0.82)) rotate(var(--rot)); } to { opacity: var(--op); transform: translate(-50%, -50%) scale(var(--sc)) rotate(var(--rot)); } }
@keyframes qcds-drift { from { transform: translate(0, 0); } to { transform: translate(var(--dx), var(--dy)); } }
@media print { .slidev-layout .qcds .it { opacity: var(--op) !important; animation: none !important; } }
</style>
