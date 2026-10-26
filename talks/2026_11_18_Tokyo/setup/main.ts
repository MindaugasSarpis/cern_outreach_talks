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
import Soundtrack from './Soundtrack.vue'
import CloseStill from './CloseStill.vue'
import Regather from './Regather.vue'
import { installSoundKeys } from './soundLevel.js'

export default ({ app }) => {
  app.component('Soundtrack', Soundtrack)   // the finale's music; `drop` times its peak off the recorded clip
  app.component('CloseStill', CloseStill)   // the finale's last frame on the credits page, the world resting
  app.component('Regather', Regather)       // the finale's take: the cover's pentaquark gathers again
  installSoundKeys()                        // `+` / `-` for the music's level, seen only in the presenter window
}
