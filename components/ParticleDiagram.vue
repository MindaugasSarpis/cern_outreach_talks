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
