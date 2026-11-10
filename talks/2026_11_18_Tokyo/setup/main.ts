// The talk's own pieces join the stage here, before it boots. A form of the
// talk's own: `import { registerBuilder } from 'slidev-addon-stage'`, then
// registerBuilder(type, build, { fields: ['pos', ...] }); `pnpm talk check`
// finds the type and validates the deck with it. A component:
// app.component('Name', Component). (A plain function: Slidev's
// defineAppSetup is the identity, and @slidev/types is not a dependency of
// the talk.)
//
// What the deck draws live: the cover (coverCollision.js, pentaquark.js), the quark recipes and the Dalitz plot
// (their own three.js scenes), the world's stations. What it plays as clips: the data slide, the globe and the
// finale, recorded from takes.md (takes/README.md); their code is setup/takes/, loaded only in a takes build.
// globe.js, CollabGlobe.vue, view.js and afterCover.js's `places` latch came from Innoday (27 Oct); CloseStill.vue
// too (26 Oct); grains.js, pentaquark.js and the cover from Užsikrauk karjerai (10 Nov).
import { registerBuilder } from 'slidev-addon-stage'
import CloseStill from './CloseStill.vue'
import AtClipEnd from './AtClipEnd.vue'
import QuarkRecipes from './QuarkRecipes.vue'
import Dalitz3D from './Dalitz3D.vue'
import CollabGlobe from './CollabGlobe.vue'
import { installGlobe } from './globe.js'
import { armAfterCover } from './afterCover.js'
import CoverCollision from './CoverCollision.vue'
import { installCoverCollision } from './coverCollision.js'
import { installPentaquark } from './pentaquark.js'
import { installLook } from './look.js'

export default async ({ app, router }) => {
  armAfterCover(router)                     // the globe's data loads once the cover is behind
  installLook()                             // the ground's glows lowered, the nearest dust capped (look.js)
  installCoverCollision(registerBuilder)    // `cover-collision`: the cover's slow, silent CMS loop
  installPentaquark(registerBuilder)        // `pentaquark-cc`: the cover's particle, u u d c c̄ in colour charge
  app.component('CoverCollision', CoverCollision)
  installGlobe(registerBuilder)             // `collab-globe`: the globe of grains, Vilnius and Nagoya joined
  app.component('CollabGlobe', CollabGlobe) // the globe forming on its slide (the globe take; the deck plays its clip)
  app.component('QuarkRecipes', QuarkRecipes) // the six quarks and their recipes, in 3D
  app.component('Dalitz3D', Dalitz3D)         // the 2019 Dalitz plot built up in 3D
  app.component('AtClipEnd', AtClipEnd)     // what it wraps comes in as the slide's clip ends
  app.component('CloseStill', CloseStill)   // the finale's last frame on the credits page, the world resting
  // the takes' detector, collision and histogram: only in a takes build (takes/build.sh sets VITE_TAKES)
  if (import.meta.env.VITE_TAKES) (await import('./takes/index.js')).installTakes({ app, registerBuilder })
}
