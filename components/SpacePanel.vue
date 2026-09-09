<script setup>
// A translucent panel for text or a figure floating in the hadron space. No
// drawn edge: HaloLayer (global-top.vue) surrounds every `.space-panel` with
// hazy particles instead. `kicker` is a small uppercase line above the slot.
defineProps({
  kicker: { type: String, default: '' },
})
</script>

<template>
  <div class="space-panel">
    <p v-if="kicker" class="space-kicker">{{ kicker }}</p>
    <slot />
  </div>
</template>

<style scoped>
.space-panel {
  position: relative;
  padding: 18px 20px 20px;
  border-radius: 12px;
  background: rgba(5, 5, 7, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #f2f5f9;
  font-family: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
.space-kicker {
  margin: 0 0 8px; font-size: 9.5px; font-weight: 500;
  color: #7dd3fc; text-transform: uppercase; letter-spacing: 0.14em;
}
</style>
