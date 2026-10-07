// In `slidev dev` Vite pre-bundles 'slidev-addon-stage' for setup/main.ts
// while the addon's Stage.vue imports its own source: two builder registries,
// and the world never sees `volume` or `streams`. Keep the addon unbundled.
// (A plain object: 'vite' does not resolve from a talk directory.)
export default { optimizeDeps: { exclude: ['slidev-addon-stage'] } }
