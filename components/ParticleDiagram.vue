<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  speed?: number
}>(), {
  speed: 1,
})

type Phase = 'ballistic' | 'random'

const trail = ref<{ x: number; y: number }[]>([])
const pos = ref({ x: 100, y: 800 })
const phase = ref<Phase>('ballistic')
let phaseTick = 0
let raf: number | null = null

// ~6 s per phase at 60 fps. Slow enough that the eye can follow the dot.
const BALLISTIC_FRAMES = 360
const RANDOM_FRAMES = 360

// Brownian state held outside Vue's reactive system; only pos.value is published.
let bx = 960
let by = 540
let bvx = 0
let bvy = 0

function resetBallistic() {
  trail.value = []
  pos.value = { x: 100, y: 800 }
  phase.value = 'ballistic'
  phaseTick = 0
}

function resetRandom() {
  trail.value = []
  bx = 960
  by = 540
  bvx = (Math.random() - 0.5) * 8
  bvy = (Math.random() - 0.5) * 8
  pos.value = { x: bx, y: by }
  phase.value = 'random'
  phaseTick = 0
}

function step() {
  phaseTick += 1
  if (phase.value === 'ballistic') {
    const t = (phaseTick / BALLISTIC_FRAMES) * props.speed
    const x = 100 + 1700 * t
    const y = 800 - 1100 * t + 600 * t * t
    pos.value = { x, y }
    trail.value.push({ x, y })
    if (phaseTick >= BALLISTIC_FRAMES || x > 1900) {
      resetRandom()
    }
  } else {
    bvx += (Math.random() - 0.5) * 2.5
    bvy += (Math.random() - 0.5) * 2.5
    bvx *= 0.95
    bvy *= 0.95
    bx += bvx * props.speed
    by += bvy * props.speed
    if (bx < 60) { bx = 60; bvx = -bvx }
    if (bx > 1860) { bx = 1860; bvx = -bvx }
    if (by < 60) { by = 60; bvy = -bvy }
    if (by > 1020) { by = 1020; bvy = -bvy }
    pos.value = { x: bx, y: by }
    trail.value.push({ x: bx, y: by })
    if (phaseTick >= RANDOM_FRAMES) {
      resetBallistic()
    }
  }
  if (trail.value.length > 300) trail.value.shift()
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
    <line
      x1="0"
      y1="950"
      x2="1920"
      y2="950"
      stroke="white"
      stroke-width="2"
      stroke-opacity="0.15"
    />
    <polyline
      :points="trail.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')"
      fill="none"
      stroke="white"
      stroke-width="3"
      stroke-dasharray="6 8"
      stroke-opacity="0.5"
    />
    <circle :cx="pos.x" :cy="pos.y" r="18" fill="white" />
  </svg>
</template>
