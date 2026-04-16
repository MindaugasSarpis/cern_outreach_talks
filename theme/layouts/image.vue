<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'

const props = defineProps({
  image: { type: String, required: true },
  backgroundSize: { type: String, default: 'cover' },
  backgroundPosition: { type: String, default: 'center' },
})

const isActive = useIsSlideActive()
const renderKey = ref(0)

// Chromium caches decoded animated GIFs by URL and reuses the animation
// state across remounts of the same src — a plain :key bump won't
// restart the GIF. Changing the URL via a query-string cache-buster
// forces the browser to treat each slide entry as a fresh resource,
// restarting from frame 1.
watch(isActive, (v) => { if (v) renderKey.value++ }, { immediate: true })
</script>

<template>
  <div class="slidev-layout image-layout">
    <img
      :key="renderKey"
      :src="`${props.image}?k=${renderKey}`"
      :style="{ objectFit: props.backgroundSize, objectPosition: props.backgroundPosition }"
      alt=""
    />
    <slot />
  </div>
</template>

<style scoped>
.image-layout {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  background: #0a0a0f;
}
.image-layout img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
