import { registerBuilder } from 'slidev-addon-stage'
import { installStrands } from './strands.js'
import { installFunnel } from './funnel.js'
import { installPlots } from './plots.js'
import Count from './Count.vue'
import Strands from './Strands.vue'
import AfterFlight from './AfterFlight.vue'
import WebTakeover from './WebTakeover.vue'
import OpenerStart from './OpenerStart.vue'
import CollisionStart from './CollisionStart.vue'
import ShortHum from './ShortHum.vue'
import AfterCover from './AfterCover.vue'
import { armAfterCover } from './afterCover.js'
// the cover's slow, silent CMS loop (owner, 21 Oct): `cover-collision` and <CoverCollision>
import { installCoverCollision } from './coverCollision.js'
import CoverCollision from './CoverCollision.vue'
import { installOpening } from '../components/lhc-opening/index.js'
import { installDetector } from './detector.js'
import { installEmblems } from './emblems.js'
import { installEurope } from './europe.js'
import Grains from './Grains.vue'
import LisTakeover from './LisTakeover.vue'
import Soundtrack from './Soundtrack.vue'
import ClipEnd from './ClipEnd.vue'
import Drone from './Drone.vue'
// the LHCb event the shared collision draws by default (lhc-opening's own): the
// close's detector marks the grains its tracks pass through
import EVENT_LB from '../components/lhc-opening/event.json'
// The CMS event's data in the deck's own bundle: lhc-opening loads it with a
// dynamic import, so its collision cloud (station collision; „Ačiū“ had one
// too until 19 Oct) was filled when that chunk arrived, ~2.7-3.3 s in, in the middle of the
// cover's fly-in (0.25-0.3 s of main thread each in a trace). Imported here, its
// import resolves at once and both fills run in the world's boot, before the
// fly-in starts (owner, 14 Oct: "slight lag on cover slide animation").
// components/lhc-opening is unchanged; the reference below keeps the import.
import EVENT_CMS from '../components/lhc-opening/event-cms.json'

// <Count> counts a slide's big number up as the slide arrives; <WebTakeover>
// turns the opener's last frame into the world's grains; <OpenerStart> holds
// the opener on its first frame until the first press when the deck is opened
// at it (the title slide's press is the gesture otherwise); <ShortHum> lets the
// funnel's hum sound for about 3 s, not for the whole slide; <AfterCover> holds
// the photo places until the cover is behind (afterCover.js). The talk's own
// world forms join the engine's registry before the stage boots: `strands`,
// `funnel` (with the prologue, the web's grains becoming it) and `plot` (slide
// 12's result plots, light on black, unlit and additive, as OpenData draws its
// plots). The shared LHC collision (components/lhc-opening, as
// in OpenData and Užsikrauk karjerai) registers `lhc-collision` and
// <LhcOpening>; on „Ačiū“ <LisTakeover> starts LHCb's own event inside LHCb's
// geometry as grains (`detector`, setup/detector.js, from MasterTalk; <Grains>
// sets its step), after turning the light injection clip's last frame into
// grains at the cold box's place in it (setup/lisGrains.js). <CollisionStart>
// (a collision started by its slide) is no longer used there since 19 Oct.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
//
// A page built from an old index.html (a tab restored or opened from cache
// after a deploy) asks for slide chunks the new build no longer has: Pages
// keeps only the latest build, and Slidev shows „Failed to fetch this slide“
// (owner, 13 Oct, on slide 29). Slidev loads every slide about 3 s after the
// page opens, so a stale page fails then. Vite reports a failed chunk as
// `vite:preloadError`: in the page's first 20 s, reload once on the same slide
// (the hash) to fetch the new build. Never later: Slidev retries a failed slide
// on each step next to it, and a reload mid-talk (or onto the browser's offline
// page) is worse than one slide's error. A failure within 60 s of the last
// reload shows the error too (no loop).
function reloadOnStaleChunk() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (e) => {
    if (performance.now() > 20000) return
    try {
      const k = 'innoday:chunk-reload'
      if (Date.now() - (Number(sessionStorage.getItem(k)) || 0) < 60000) return
      sessionStorage.setItem(k, String(Date.now()))
    } catch { return }   // no storage, no reload: it could not stop a loop
    e.preventDefault()
    location.reload()
  })
}

export default ({ app, router }) => {
  reloadOnStaleChunk()
  armAfterCover(router)
  ;(globalThis as any).__innodayCmsEvent = EVENT_CMS
  installStrands(registerBuilder)
  installFunnel(registerBuilder)
  installPlots(registerBuilder)
  installOpening({ app, registerBuilder })
  installCoverCollision(registerBuilder)   // the cover's loop (setup/coverCollision.js)
  installDetector(registerBuilder, { event: EVENT_LB })
  installEmblems(registerBuilder)   // the close's LHCb logo and Lithuanian flag in grains (setup/emblems.js)
  installEurope(registerBuilder)   // Part III's map: CERN's threads out to the member states, Lithuania lit (setup/europe.js)
  app.component('Count', Count)
  app.component('Strands', Strands)
  app.component('AfterFlight', AfterFlight)
  app.component('WebTakeover', WebTakeover)
  app.component('OpenerStart', OpenerStart)
  app.component('CollisionStart', CollisionStart)
  app.component('ShortHum', ShortHum)
  app.component('AfterCover', AfterCover)
  app.component('CoverCollision', CoverCollision)
  app.component('Grains', Grains)
  app.component('LisTakeover', LisTakeover)
  app.component('Soundtrack', Soundtrack)   // the close's music across its slides
  app.component('ClipEnd', ClipEnd)   // words over a clip's held last frame (slide 27)
  app.component('Drone', Drone)   // a synthesised deep hum under a slide (slide 27)
}
