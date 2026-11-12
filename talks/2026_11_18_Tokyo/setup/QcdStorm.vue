<script setup>
// <QcdStorm> … </QcdStorm>: QCD's equations and diagrams coming at the viewer out of the depth, without end (the
// owner, 12 Nov: "slide 6 should be reimagined, just floating QCD lagrangians, equations, diagrams to show how
// complicated it is, full screen of all sorts of diagrams / equations floating at different depts appearing"; then,
// that night: "more dynamic, remains dynamic, they should appear and dissapears, pass through, more of them appear
// far away, appear close make it dynamic"). The equations are the slide's own markdown (`$$ … $$` blocks in the
// slot, set by Slidev's KaTeX); the diagrams are drawn here.
//
// A flight through them: each item is born far away (small, dim, near the middle), comes on along its own line
// from the vanishing point, growing all the way and gathering speed, passes the viewer and is gone; then it is born again far away
// on another line. The 50 (each equation and diagram twice) are spread evenly along the way, so at any moment some are just appearing in the depth,
// some are mid-way and some are passing close. An item fades out before its box reaches the frame's edge: nothing
// is ever drawn (or laid out) outside the slide. Driven by one requestAnimationFrame loop while the slide is the
// live one; off it (overview, print, the presenter's preview) the same picture stands still.
import { cloneVNode, computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)

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

// ---- the flight -----------------------------------------------------------------------------------------------
const slots = useSlots()
const eqs = computed(() => (slots.default?.() || []).filter((n) => typeof n.type !== 'symbol' || (Array.isArray(n.children) && n.children.length)))
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const list = computed(() => {
  // equations and diagrams mixed: a diagram after every second equation
  const E = eqs.value.map((n) => ({ kind: 'eq', node: n })), G = D.map((d) => ({ kind: 'dg', d })), mixed = []
  while (E.length || G.length) { if (E.length) mixed.push(E.shift()); if (E.length) mixed.push(E.shift()); if (G.length) mixed.push(G.shift()) }
  // each twice (50 in flight), the second copies half a cycle behind the first
  return [...mixed, ...mixed.map((it) => (it.kind === 'eq' ? { ...it, node: cloneVNode(it.node) } : it))].map((it, i) => ({ ...it, i }))
})
const Eq = (p) => p.node

const W = 980, H = 551.25, CX = W / 2, CY = H * 0.47
const PERIOD = 20            // s from birth to passing
const S0 = 0.2, GROW = Math.log(3.4 / 0.2)   // size along the way: S0 e^(GROW p), 0.2 far to 3.4 passing: the same
                                              // time for each doubling, so as many are mid-way and readable as are far
const els = ref([])
const r = rng(20261118)
let st = [], raf = 0, last = 0, t = 0
// a line out of the vanishing point: where the item stands at size 1 (slide units from the middle); never the
// middle itself, where it would come straight at the viewer and cover the rest
function line() { const a = r() * Math.PI * 2, d = 55 + 330 * Math.sqrt(r()); return [Math.cos(a) * d * 1.5, Math.sin(a) * d * 0.85] }
function setup() {
  const n = list.value.length
  // spread along the way in a shuffled order, so neighbours in the list are not neighbours in depth
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
  st = list.value.map((it, i) => { const el = els.value[i]; return { p: order[i] / n, off: line(), w: el?.offsetWidth || 300, h: el?.offsetHeight || 60, rot: (r() - 0.5) * 4 } })
}
function draw(fadeIn = 1) {
  st.forEach((o, i) => {
    const el = els.value[i]; if (!el) return
    const s = S0 * Math.exp(GROW * o.p), x = CX + o.off[0] * s, y = CY + o.off[1] * s
    const hw = o.w * s / 2, hh = o.h * s / 2
    // how far its box is from the frame's edge: it is gone by the time it would touch it
    const d = Math.min(x - hw, W - (x + hw), y - hh, H - (y + hh))
    const op = Math.min(1, o.p / 0.06) * Math.max(0, Math.min(1, (d - 4) / 46)) * (0.4 + 0.6 * Math.min(1, (s - S0) / 0.45)) * fadeIn
    if (op <= 0.003) { el.style.display = 'none'; return }
    el.style.display = ''
    el.style.opacity = op.toFixed(3)
    el.style.zIndex = String(Math.round(s * 10))
    el.style.transform = `translate(${(x - o.w / 2).toFixed(2)}px, ${(y - o.h / 2).toFixed(2)}px) scale(${s.toFixed(4)}) rotate(${o.rot.toFixed(2)}deg)`
  })
}
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt
  for (const o of st) { o.p += dt / PERIOD; if (o.p >= 1) { o.p -= 1; o.off = line(); o.rot = (r() - 0.5) * 4 } }
  draw(Math.min(1, t / 1.8))
  raf = requestAnimationFrame(frame)
}
function stop() { cancelAnimationFrame(raf); raf = 0 }
function start() { stop(); if (!st.length) setup(); t = 0; last = performance.now(); raf = requestAnimationFrame(frame) }
onMounted(() => {
  // the sizes are read once the equations are set (the fonts in); then the still picture, or the flight
  const go = () => { setup(); draw(1); if (live.value && active.value) start() }
  if (document.fonts?.ready) document.fonts.ready.then(() => requestAnimationFrame(go)); else requestAnimationFrame(go)
})
watch([active, live], ([a, l]) => { if (a && l) start(); else { stop(); if (st.length) draw(1) } })
onBeforeUnmount(stop)
</script>

<template>
  <div class="qcds" aria-label="Equations and diagrams of quantum chromodynamics">
    <div v-for="it in list" :key="it.i" :ref="(el) => { els[it.i] = el }" class="it" :class="it.kind">
      <Eq v-if="it.kind === 'eq'" :node="it.node" />
      <svg v-else viewBox="0 0 120 80" width="150" height="100">
        <path v-for="(q, k) in it.d.q" :key="'l' + k" class="ql" :d="q.line" /><path v-for="(q, k) in it.d.q" :key="'h' + k" class="qh" :d="q.head" />
        <circle v-if="it.d.loop" class="ql" :cx="it.d.loop[0]" :cy="it.d.loop[1]" :r="it.d.loop[2]" />
        <path v-for="(g, k) in it.d.g" :key="'g' + k" class="gl" :d="g" />
        <circle v-for="(p, k) in it.d.dots" :key="'d' + k" class="vx" :cx="p[0]" :cy="p[1]" r="2.2" />
      </svg>
    </div>
  </div>
</template>

<style>
.slidev-layout .qcds { position: absolute; inset: 0; overflow: hidden; pointer-events: none; text-transform: none; }
.slidev-layout .qcds .it { position: absolute; left: 0; top: 0; transform-origin: 50% 50%; opacity: 0; color: #dcefff; white-space: nowrap; }
.slidev-layout .qcds .it .katex-display { margin: 0; }
.slidev-layout .qcds .it .katex { font-size: 17px; color: inherit; }
.slidev-layout .qcds .it p { margin: 0; }
.slidev-layout .qcds .it svg { display: block; }
.slidev-layout .qcds .ql { fill: none; stroke: #dcefff; stroke-width: 1.4; }
.slidev-layout .qcds .qh { fill: #dcefff; stroke: none; }
.slidev-layout .qcds .gl { fill: none; stroke: #8fc6ff; stroke-width: 1.1; stroke-linejoin: round; }
.slidev-layout .qcds .vx { fill: #ffffff; }
</style>
