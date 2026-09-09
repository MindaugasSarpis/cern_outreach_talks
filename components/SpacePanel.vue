<script setup>
// A translucent panel for text or a figure floating in the hadron space. No
// drawn edge: HaloLayer (global-top.vue) surrounds every `.space-panel` with
// hazy particles instead. `kicker` is a small uppercase line above the slot.
defineProps({
  kicker: { type: String, default: '' },
  plain: { type: Boolean, default: false },   // kicker keeps its case (m(J/ψ p), not M(J/Ψ P))
})
</script>

<template>
  <div class="space-panel">
    <p v-if="kicker" class="space-kicker" :class="{ plain }">{{ kicker }}</p>
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
  margin: 0 0 8px; font-size: 11px; font-weight: 500;
  color: #7dd3fc; text-transform: uppercase; letter-spacing: 0.14em;
}
.space-kicker.plain { text-transform: none; letter-spacing: 0.04em; font-size: 12px; }
</style>
