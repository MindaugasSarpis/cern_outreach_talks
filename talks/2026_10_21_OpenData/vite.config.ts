// In `slidev dev` Vite pre-bundles 'slidev-addon-stage' for setup/main.ts
// while the addon's Stage.vue imports its own source: two builder registries,
// and the world never sees `volume` or `streams`. Keep the addon unbundled,
// and three with it, so setup/grains.js and the engine share one three.
// (A plain object: 'vite' does not resolve from a talk directory.)
import { fileURLToPath } from 'node:url'
import { checkDataspace } from './setup/dataspace.check.mjs'

// The space of data is woven round the camera's poses from capsules written by hand:
// a pose moved in deck.md without them would put a filament through the lens. Every
// build holds the web against the deck (setup/dataspace.check.mjs) and fails, naming
// what to move; `slidev dev` only warns.
let command = 'serve'
const dataspace = {
  name: 'opendata:dataspace-check',
  configResolved(c) { command = c.command },
  buildStart() {
    const { problems } = checkDataspace(fileURLToPath(new URL('.', import.meta.url)))
    if (!problems.length) return
    const msg = `the space of data does not fit the deck:\n  ${problems.join('\n  ')}`
    if (command === 'build') this.error(msg)
    else this.warn(msg)
  },
}

export default { optimizeDeps: { exclude: ['slidev-addon-stage', 'three'] }, plugins: [dataspace] }
