// The talk's own pieces join the stage here, before it boots. A form of the
// talk's own: `import { registerBuilder } from 'slidev-addon-stage'`, then
// registerBuilder(type, build, { fields: ['pos', ...] }); `pnpm talk check`
// finds the type and validates the deck with it. A component:
// app.component('Name', Component). (A plain function: Slidev's
// defineAppSetup is the identity, and @slidev/types is not a dependency of
// the talk.)
//
// Copied 2026-10-26 for the recorded finale, until the toolkit takes them over:
// Soundtrack.vue, slideHooks.js and soundLevel.js from Užsikrauk karjerai (the newest
// copies), CloseStill.vue from Innoday. Regather.vue is this talk's own.
// Copied 2026-10-27 for the Vilnius–Nagoya globe: globe.js, CollabGlobe.vue, view.js and
// (its `places` latch only) afterCover.js from Innoday; the strand between the cities is Tokyo's.
import { registerBuilder } from 'slidev-addon-stage'
import Soundtrack from './Soundtrack.vue'
import CloseStill from './CloseStill.vue'
import Regather from './Regather.vue'
import CollabGlobe from './CollabGlobe.vue'
import { installGlobe } from './globe.js'
import { armAfterCover } from './afterCover.js'
import { installSoundKeys } from './soundLevel.js'

export default ({ app, router }) => {
  armAfterCover(router)                     // the globe's data and picture load once the cover is behind
  installGlobe(registerBuilder)             // `collab-globe`: the globe of grains, Vilnius and Nagoya joined
  app.component('CollabGlobe', CollabGlobe) // the coming-back clip's last frame dissolving onto the globe
  app.component('Soundtrack', Soundtrack)   // the finale's music; `drop` times its peak off the recorded clip
  app.component('CloseStill', CloseStill)   // the finale's last frame on the credits page, the world resting
  app.component('Regather', Regather)       // the finale's take: the cover's pentaquark gathers again
  installSoundKeys()                        // `+` / `-` for the music's level, seen only in the presenter window
}
