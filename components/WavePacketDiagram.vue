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
const transition = ref(0)
let raf: number | null = null

const COLLAPSE_FRAMES = 24

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
