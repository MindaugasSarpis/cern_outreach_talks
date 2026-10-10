// In `slidev dev` Vite pre-bundles 'slidev-addon-stage' for setup/main.ts
// while the addon's Stage.vue imports its own source: two builder registries,
// and the world never sees the talk's own forms. Keep the addon unbundled,
// and three with it, so setup/ and the engine share one three.
// (A plain object: 'vite' does not resolve from a talk directory.)
export default { optimizeDeps: { exclude: ['slidev-addon-stage', 'three'] } }
