// The pieces only the recorded takes use (takes.md, takes/README.md): LHCb's model and point cloud (detector.js),
// its floor and cradles (cavern.js), LHCb's own 2012 collision (the shared lhc-opening), the histogram that fills
// out of the detector and its fit (histogram.js), and the two components that start them (InsideLhcb, Grains).
// setup/main.ts loads this file only in a takes build (VITE_TAKES=1, takes/build.sh): the deck plays the takes as
// clips, so neither this code nor the 11.5 MB of detector data (takes/data/) is in the deck's site.
import { installOpening } from '../../components/lhc-opening/index.js'
import EVENT_LB from '../../components/lhc-opening/event.json'
import { installDetector } from './detector.js'
import { installCavern } from './cavern.js'
import { installHistogram } from './histogram.js'
import InsideLhcb from './InsideLhcb.vue'
import Grains from './Grains.vue'
import { places } from '../afterCover.js'

export function installTakes({ app, registerBuilder }) {
  // no cover here to keep clear: the detector's and the globe's data load at once. The latch otherwise opens on
  // the step past slide 2, and the data take is slide 2, reached from slide 1: it was recorded without LHCb.
  places.flip()
  installOpening({ app, registerBuilder })                // `lhc-collision`: LHCb's 2012 event
  installDetector(registerBuilder, { event: EVENT_LB })   // `detector`: the model (`det`) and the point cloud (`detp`)
  installCavern(registerBuilder)                          // `cavern-floor`, `supports`
  installHistogram(registerBuilder)                       // `histogram`: the 2019 spectrum and its fit
  app.component('InsideLhcb', InsideLhcb)
  app.component('Grains', Grains)
}
