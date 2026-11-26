<script setup lang="ts">
// The group as a honeycomb, year by year: <HexTeam :year="2026" />.
//
// Every tile has a fixed place (setup/team.ts). A tile whose year has not come
// waits far off the board, turned and transparent; when the year arrives it
// flies to its place. The board is tilted in 3D and sways slowly. In print and
// PDF export nothing moves: each page shows the year's board at rest.
//
//   <HexTeam :year="2026" :until="2026" settled :focus="['ruta', 'sarunas']" />
//
// `focus` picks who a slide is about: those tiles come forward, the others step
// back and fade. `until` is the last year the deck shows, so the board is only
// as wide as the columns in use by then. `settled` puts the tiles in place at
// once (a slide that is about some of the people, not about the group arriving).
import { computed, ref, onMounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import HexTile from './HexTile.vue'
import { members, openSlots, openFrom } from './team'

const props = withDefaults(defineProps<{
  year: number
  size?: number
  gap?: number
  focus?: string[] | null
  until?: number
  settled?: boolean
}>(), { size: 100, gap: 7 })

const { isPrintMode } = useNav()
const printing = computed(() => !!isPrintMode?.value
  || (typeof document !== 'undefined' && document.documentElement.classList.contains('print'))
  || (typeof location !== 'undefined' && /[?&]print\b/.test(location.search)))

// `on` is false until the slide is entered, so the first year's tiles fly in too
const on = ref(props.settled)
onMounted(() => { if (printing.value) on.value = true })
onSlideEnter(() => { requestAnimationFrame(() => requestAnimationFrame(() => { on.value = true })) })
onSlideLeave(() => { if (!printing.value && !props.settled) on.value = false })

const W = computed(() => props.size)
const H = computed(() => props.size * 0.866)
const dx = computed(() => W.value * 0.75 + props.gap)
const dy = computed(() => H.value + props.gap)

// the columns in use by `until` (every column when it is not given)
const cols = computed(() => {
  const last = props.until ?? Infinity
  const used = [
    ...members.filter(m => m.from <= last).map(m => m.slot[0]),
    ...(openFrom <= last ? openSlots.map(s => s[0]) : []),
  ]
  return { min: Math.min(...used), max: Math.max(...used) }
})

function place([c, r]: [number, number]) {
  return { x: (c - cols.value.min) * dx.value, y: r * dy.value + (c % 2 ? dy.value / 2 : 0) }
}
// a repeatable starting point for tile i: a ring around the board's middle, deep behind it and
// turned. It stays inside the slide's frame, so the waiting tiles never count as overflow.
function away(i: number) {
  const a = (i * 137.5 * Math.PI) / 180
  const z = -520 - (i % 5) * 70
  return {
    x: boardW.value / 2 - W.value / 2 + Math.cos(a) * boardW.value * 0.42,
    // the plane is tipped back, so depth alone would carry a tile down the screen: lift it by as much
    y: boardH.value / 2 - H.value / 2 + Math.sin(a) * boardH.value * 0.3 + z * 0.42,
    z,
    rot: (i % 2 ? 1 : -1) * (50 + (i * 23) % 80),
  }
}

const boardW = computed(() => (cols.value.max - cols.value.min) * dx.value + W.value)
const boardH = computed(() => 3 * dy.value + H.value)

const tiles = computed(() => [
  ...members.map((m, i) => ({
    key: m.id, who: m.id, open: false, i,
    here: on.value && m.from <= props.year,
    dim: !!m.left && m.left <= props.year,
    // with a focus set: 1 in it, -1 out of it; 0 when the slide is about everybody
    lit: props.focus?.length ? (props.focus.includes(m.id) ? 1 : -1) : 0,
    slot: place(m.slot),
  })),
  ...openSlots.map((s, k) => ({
    key: `open-${k}`, who: undefined, open: true, i: members.length + k,
    here: on.value && openFrom <= props.year,
    dim: false,
    lit: props.focus?.length ? -1 : 0,
    slot: place(s),
  })),
])

function style(t: (typeof tiles.value)[number]) {
  if (t.here) {
    // a small lift only: on the tilted plane depth becomes a sideways shift, and a tile lifted far
    // covers its neighbours' names
    const z = t.lit > 0 ? 10 : t.lit < 0 ? -6 : t.dim ? -14 : 0
    const k = t.lit > 0 ? 1.04 : t.lit < 0 ? 0.88 : t.dim ? 0.86 : 1
    return {
      transform: `translate3d(${t.slot.x}px, ${t.slot.y}px, ${z}px) scale(${k})`,
      opacity: t.lit < 0 ? (t.dim ? 0.24 : 0.4) : t.dim ? 0.55 : 1,
      zIndex: t.lit > 0 ? 1 : 0,
      transitionDelay: props.focus?.length ? '0ms' : `${(t.i % 9) * 45}ms`,
    }
  }
  const a = away(t.i)
  return {
    transform: `translate3d(${a.x}px, ${a.y}px, ${a.z}px) rotateZ(${a.rot}deg) rotateY(${a.rot}deg) scale(0.5)`,
    opacity: 0,
    visibility: 'hidden' as const,
    transitionDelay: '0ms',
  }
}
</script>

<template>
  <div class="hexboard" :class="{ still: printing }" :style="{ width: `${boardW}px`, height: `${boardH}px` }">
    <div class="hexplane">
      <div v-for="t in tiles" :key="t.key" class="hexslot" :style="style(t)">
        <HexTile :who="t.who" :open="t.open" :dim="t.dim" :back="t.lit < 0" :size="size" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hexboard {
  position: relative;
  perspective: 1300px;
  perspective-origin: 50% 40%;
}
.hexplane {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(24deg) rotateY(-16deg);
  animation: hex-sway 13s ease-in-out infinite alternate;
}
.hexslot {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  /* visibility flips at once on the way in and after the fade on the way out */
  transition:
    transform 1.25s cubic-bezier(0.18, 0.84, 0.24, 1),
    opacity 0.9s ease,
    visibility 0s linear 0s;
  will-change: transform, opacity;
}
.hexslot:hover { z-index: 2; }

@keyframes hex-sway {
  from { transform: rotateX(26deg) rotateY(-18deg); }
  to   { transform: rotateX(18deg) rotateY(-6deg); }
}

/* print, PDF export and reduced motion: the board at rest */
.still .hexplane { animation: none; }
.still .hexslot { transition: none; }
@media (prefers-reduced-motion: reduce) {
  .hexplane { animation: none; }
  .hexslot { transition: opacity 0.3s ease; }
}
</style>
