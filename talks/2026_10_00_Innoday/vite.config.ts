// In `slidev dev` Vite pre-bundles 'slidev-addon-stage' for setup/main.ts while
// the addon's Stage.vue imports its own source: two builder registries, and the
// world never sees `strands`. Keep the addon unbundled, and three with it, so
// setup/strands.js and the engine share one three (as in the OpenData talk).
export default { optimizeDeps: { exclude: ['slidev-addon-stage', 'three'] } }
