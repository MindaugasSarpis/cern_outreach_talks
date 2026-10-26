import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installPiles } from './piles.js'
import { installDataspace } from './dataspace.js'
import { installSun } from './sun.js'
import { installFunnel } from './funnel.js'
import { armAfterCover } from './afterCover.js'
import { installOpening } from '../components/lhc-opening/index.js'
import { installDetector } from './detector.js'
import { installCavern } from './cavern.js'
import { installAccel } from './accel.js'
import WorldLabel from './WorldLabel.vue'
import ClickBus from './ClickBus.vue'
import { installThesis } from './thesis.js'
import { installTriplet } from './triplet.js'
import { installPentaquark } from './pentaquark.js'
import InsideLhcb from './InsideLhcb.vue'
import CoverCollision from './CoverCollision.vue'
// the cover's slow, silent CMS loop (25 Oct, Innoday's): `cover-collision` and <CoverCollision>
import { installCoverCollision } from './coverCollision.js'
import LisFlag from './LisFlag.vue'
// LHCb's own 2012 event, the shared collision's default: slide 8's detector (setup/detector.js)
import EVENT_LB from '../components/lhc-opening/event.json'
import Grains from './Grains.vue'
import Count from './Count.vue'
import FillClock from './FillClock.vue'
import WebTakeover from './WebTakeover.vue'
import AfterFlight from './AfterFlight.vue'
import ClickPose from './ClickPose.vue'
// Innoday's music player (23 Oct): the zoom's music under the histograms, Starfire under the close;
// `+` / `-` for its level (setup/soundLevel.js); <ClipCue>: text on a clip's own clock
import Soundtrack from './Soundtrack.vue'
import DataSfx from './DataSfx.vue'
import ClipCue from './ClipCue.vue'
import { installSoundKeys } from './soundLevel.js'
// The CMS event's data in the deck's own bundle (as Innoday's main.ts): lhc-opening
// loads it with a dynamic import, so the collision's cloud was filled when that
// chunk arrived, a few seconds in, in the middle of the cover's fly-in (0.25-0.3 s
// of main thread in Innoday's trace). Imported here, its import resolves at once
// and the fill runs in the world's boot, before the fly-in starts. The reference
// below keeps the import; components/lhc-opening is unchanged.
import EVENT_CMS from '../components/lhc-opening/event-cms.json'

// A page built from an old index.html (a tab restored or opened from cache
// after a deploy) asks for slide chunks the new build no longer has: Pages
// keeps only the latest build, and Slidev shows „Failed to fetch this slide“.
// Vite reports a failed chunk as `vite:preloadError`: in the page's first 20 s,
// reload once on the same slide (the hash) to fetch the new build. Never later
// (a reload mid-talk is worse than one slide's error), and not again within
// 60 s of the last reload (no loop). Innoday's, with this talk's key.
function reloadOnStaleChunk() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (e) => {
    if (performance.now() > 20000) return
    try {
      const k = 'karjera:chunk-reload'
      if (Date.now() - (Number(sessionStorage.getItem(k)) || 0) < 60000) return
      sessionStorage.setItem(k, String(Date.now()))
    } catch { return }   // no storage, no reload: it could not stop a loop
    e.preventDefault()
    location.reload()
  })
}

// The talk's own forms (matter and antimatter, a life's path, streams that
// bring it together, the plots) join the engine's registry before the stage
// boots, and <Grains> lets a slide set them. From OpenData (owner, 18 Oct: "Show
// something about open data, and masterclass"), on the same bus: `lineup` and
// `floor` (the piles of terabytes, setup/piles.js), `dataspace` (the space of data
// behind them) and `sun` (rays of grains from the gold pile to plots made from the
// open data, or to named clusters).
// From Innoday (owner, 18 Oct): `funnel`, the history of the Universe in grains
// (setup/funnel.js), which the cosmic web's grains make on the step from slide 2
// (<WebTakeover>, setup/takeover.js); its CMB picture waits for afterCover.js's
// latch, so the cover's fly-in stays clear; <AfterFlight> shows its number once
// the flight has landed.
// From Innoday (owner, 21 Oct: "Build" the 15-min proposal): `detector`, LHCb's
// model with the 1,83 m person (setup/detector.js), its `cavern-floor` and `supports`
// (setup/cavern.js), and <InsideLhcb>, which starts LHCb's own collision in it once the
// camera has come down to the cavern floor (slide 9).
// Back on 23 Oct (the review, "implement all"): `peakhist`, Dominykas's thesis plot
// with the rise into `pq2` (setup/thesis.js, here 15–18 Oct), on slide 18's click,
// and <ClickPose>, which takes the camera to it on that click (setup/ClickPose.vue).
// On 23 Oct (the owner: "after histogram is filled indicate schematically Omega particle"):
// `triplet`, a three-quark particle in the colour-charge picture with gluons between the
// quarks (setup/triplet.js), the Ωc⁰ beside its spectrum on slide 12's click.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app, router }) => {
  reloadOnStaleChunk()
  armAfterCover(router)
  ;(globalThis as any).__karjeraCmsEvent = EVENT_CMS
  installGrains(registerBuilder)
  installPiles(registerBuilder)
  installDataspace(registerBuilder)
  installSun(registerBuilder)
  installFunnel(registerBuilder)
  installOpening({ app, registerBuilder })   // the shared LHC opening: its collision, sound and <LhcOpening>
  installCoverCollision(registerBuilder)   // the cover's loop (setup/coverCollision.js)
  installDetector(registerBuilder, { event: EVENT_LB })
  installCavern(registerBuilder)
  installAccel(registerBuilder)   // the close's accelerators and its word (24 Oct)
  installThesis(registerBuilder)
  installTriplet(registerBuilder)
  installPentaquark(registerBuilder)   // the cover's particle (setup/pentaquark.js)
  app.component('Grains', Grains)
  app.component('Count', Count)
  app.component('FillClock', FillClock)
  app.component('WebTakeover', WebTakeover)
  app.component('AfterFlight', AfterFlight)
  app.component('InsideLhcb', InsideLhcb)
  app.component('CoverCollision', CoverCollision)
  app.component('LisFlag', LisFlag)
  app.component('ClickPose', ClickPose)
  app.component('Soundtrack', Soundtrack)
  app.component('DataSfx', DataSfx)   // the data slide's sound (24 Oct)
  app.component('WorldLabel', WorldLabel)   // the close's labels on the orbiting map (24 Oct)
  app.component('ClickBus', ClickBus)   // a collision started by a click (the close's „Ačiū už dėmesį“)
  app.component('ClipCue', ClipCue)
  installSoundKeys()
}
