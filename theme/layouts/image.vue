<script setup lang="ts">
import { ref } from 'vue'
import { onSlideEnter } from '@slidev/client'

const props = defineProps({
  image: { type: String, required: true },
  backgroundSize: { type: String, default: 'cover' },
  backgroundPosition: { type: String, default: 'center' },
})

// Bumped on every slide entry so Vue remounts the <img>, forcing
// browsers to restart GIFs from frame 1.
const renderKey = ref(0)
onSlideEnter(() => { renderKey.value++ })
</script>

<template>
  <div class="slidev-layout image-layout">
    <img
      :key="renderKey"
      :src="props.image"
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
