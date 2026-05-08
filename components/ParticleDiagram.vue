<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  mode?: 'ballistic' | 'random'
  speed?: number
}>(), {
  mode: 'ballistic',
  speed: 1,
})

const trail = ref<{ x: number; y: number }[]>([])
const pos = ref({ x: 100, y: 950 })
let phaseTick = 0
let raf: number | null = null

// ~30 s per cycle at 60 fps. Each slide shows one mode.
const FRAMES_PER_CYCLE = 1800

let bx = 960
let by = 540
let bvx = 0
let bvy = 0
let bInit = false

function resetBallistic() {
  trail.value = []
  pos.value = { x: 100, y: 950 }
  phaseTick = 0
}

function initRandom() {
  bx = 960
  by = 540
  bvx = (Math.random() - 0.5) * 8
  bvy = (Math.random() - 0.5) * 8
  pos.value = { x: bx, y: by }
  bInit = true
}

function step() {
  phaseTick += 1
  if (props.mode === 'ballistic') {
    const t = phaseTick / FRAMES_PER_CYCLE
    if (t > 1) {
      resetBallistic()
      raf = requestAnimationFrame(step)
      return
    }
    // Symmetric parabola: launch (100, 950) → peak (960, 250) → land (1820, 950).
    const x = 100 + 1720 * t
    const y = 950 - 4 * 700 * t * (1 - t)
    pos.value = { x, y }
    trail.value.push({ x, y })
  } else {
    if (!bInit) initRandom()
    bvx += (Math.random() - 0.5) * 2.5 * props.speed
    bvy += (Math.random() - 0.5) * 2.5 * props.speed
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
    // Rolling buffer ≈ 25 s of trail at 60 fps.
    if (trail.value.length > 1500) trail.value.shift()
  }
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
