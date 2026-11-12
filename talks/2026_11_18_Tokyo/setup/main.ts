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
import QcdStorm from './QcdStorm.vue'
import ClipLoop from './ClipLoop.vue'
import ZoomOn from './ZoomOn.vue'
import BehindFlags from './BehindFlags.vue'

// 12 Nov: the music now runs across slides at different levels, and a press that comes while a fade is still
// running made the toolkit's cancelAndHoldAtTime throw in Chromium ("setValueCurveAtTime … overlaps"; v0.11.0,
// stage/soundtrack.js `release`): an uncaught error, the level left where it was. Here the call falls back to
// what it means: the schedule cancelled, the present value held. For the toolkit: the same catch in `release`.
function holdOnOverlap() {
  const P = globalThis.AudioParam?.prototype
  if (!P?.cancelAndHoldAtTime || P.__tokyoHold) return
  const hold = P.cancelAndHoldAtTime
  P.__tokyoHold = true
  P.cancelAndHoldAtTime = function (t) {
    try { return hold.call(this, t) } catch { const v = this.value; try { this.cancelScheduledValues(0); this.setValueAtTime(v, t) } catch { /* no device */ } return this }
  }
}

export default async ({ app, router }) => {
  holdOnOverlap()
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
  app.component('QcdStorm', QcdStorm)         // QCD's equations and diagrams floating at different depths (slide 6)
  app.component('ClipLoop', ClipLoop)         // a looping clip that takes over as the slide's clip ends (the finale)
  app.component('BehindFlags', BehindFlags)   // Lithuania's and Japan's flags behind the finale's pentaquark
  app.component('ZoomOn', ZoomOn)             // after the slide's clip ends, its picture goes on in towards a point (the globe)
  app.component('CloseStill', CloseStill)   // the finale's last frame on the credits page, the world resting
  // the takes' detector, collision and histogram: only in a takes build (takes/build.sh sets VITE_TAKES)
  if (import.meta.env.VITE_TAKES) (await import('./takes/index.js')).installTakes({ app, registerBuilder })
}
