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
