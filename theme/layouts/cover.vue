<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { handleBackground } from '../layoutHelper'

const props = defineProps({
  background: {
    default: '/figures/background_intro.jpg',
  },
})

// Use handleBackground for the animated bg layer (dim=true adds dark overlay)
const bgStyle = computed(() => handleBackground(props.background, true))
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 50)
})
</script>

<template>
  <div class="slidev-layout cover cover-root">
    <!-- Animated background layer -->
    <div class="cover-bg" :style="bgStyle"></div>

    <!-- Volumetric light glows -->
    <div class="vol-light vol-1"></div>
    <div class="vol-light vol-2"></div>

    <!-- Accent line -->
    <div class="cover-accent" :class="{ 'is-mounted': mounted }"></div>

    <!-- Content -->
    <div class="cover-content" :class="{ 'is-mounted': mounted }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover-root {
  position: relative !important;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #0a0a0f !important;
  background-image: none !important;
}

/* === Animated background — Ken Burns slow drift === */
.cover-bg {
  position: absolute;
  top: -8%;
  left: -8%;
  width: 116%;
  height: 116%;
  z-index: 0;
  animation: ken-burns 30s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes ken-burns {
  0%   { transform: scale(1) translate(0, 0); }
  50%  { transform: scale(1.08) translate(-2.5%, 1.5%); }
  100% { transform: scale(1.12) translate(1%, -2%); }
}

/* === Volumetric light glows — above background, visible === */
.vol-light {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  filter: blur(70px);
}

.vol-1 {
  width: 450px;
  height: 280px;
  top: 25%;
  left: 10%;
  background: rgba(50, 190, 200, 0.15);
  opacity: 0.7;
  animation: drift-1 18s ease-in-out infinite alternate;
}

.vol-2 {
  width: 380px;
  height: 220px;
  top: 35%;
  right: 5%;
  background: rgba(70, 210, 220, 0.12);
  opacity: 0.6;
  animation: drift-2 22s ease-in-out infinite alternate;
}

@keyframes drift-1 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(30px, -20px) scale(1.1); opacity: 1; }
  100% { transform: translate(-20px, 15px) scale(0.95); }
}

@keyframes drift-2 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-25px, 20px) scale(1.12); opacity: 0.9; }
  100% { transform: translate(15px, -10px) scale(0.9); }
}

/* === Accent line === */
.cover-accent {
  position: relative;
  z-index: 2;
  margin-left: 4.5rem;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #5ec4c4, rgba(94, 196, 196, 0.15));
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.cover-accent.is-mounted {
  width: min(35%, 280px);
}

/* === Content === */
.cover-content {
  position: relative;
  z-index: 2;
  padding: 1.75rem 4.5rem 3.5rem;
  max-width: 80%;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease-out 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

.cover-content.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

/* === Typography === */
.cover-root :deep(h1) {
  color: #f0f0f0 !important;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0.35rem 0;
}

.cover-root :deep(h1:first-child) {
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(220, 220, 220, 0.7) !important;
  letter-spacing: 0.02em;
}

.cover-root :deep(h2) {
  color: #5ec4c4 !important;
  font-weight: 500;
  font-size: 1.35rem;
  letter-spacing: 0.03em;
  margin-top: 0.5rem;
}

.cover-root :deep(p) {
  color: rgba(240, 240, 240, 0.5);
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

/* Mobile: disable heavy animations to save GPU/battery */
@media (max-width: 768px), (pointer: coarse) {
  .cover-bg { animation: none; }
  .vol-light { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cover-bg { animation: none; }
  .vol-light { animation: none; }
  .cover-accent { transition: none; width: min(35%, 280px); }
  .cover-content { transition: none; opacity: 1; transform: none; }
}
</style>
