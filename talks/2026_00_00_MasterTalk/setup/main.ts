import { registerBuilder } from 'slidev-addon-stage'
import { setLhcbTracks } from 'slidev-addon-stage/plugins/lhcb'
import { installGrains } from './grains.js'
import { installRoute } from './route.js'
import { installOpening } from '../components/lhc-opening/index.js'
import { trajectories } from '../components/lhc-opening/event.js'
import Clock from './Clock.vue'
import Crossing from './Crossing.vue'
// Inherited 26 Oct from Užsikrauk karjerai, the newest copies (the toolkit takes them over in
// v0.11): the opening's cosmic web as a picture that breaks into grains (<WebTakeover>,
// takeover.js), the funnel those grains make (funnel.js; here shown on its own slide only),
// the latch that keeps the funnel's CMB decode off the cover (afterCover.js), <AfterFlight>,
// and Innoday's music player with Starfire's bed (<Soundtrack>, `+` / `-` from soundLevel.js).
import { installFunnel } from './funnel.js'
import { armAfterCover } from './afterCover.js'
import WebTakeover from './WebTakeover.vue'
import AfterFlight from './AfterFlight.vue'
import Soundtrack from './Soundtrack.vue'
import { installSoundKeys } from './soundLevel.js'
// The talk's one collision: a real 2012 LHCb crossing from the DIMUON stream
// (CERN Open Data record 28040, CC0; run 124143, event 39463039) holding an
// anti-Λb⁰ → J/ψ p̄ K⁺ candidate, m(J/ψ p̄) = 4437.5 MeV. Provenance and the
// candidate's tracks: setup/data/candidate-lb.json; extraction in
// ~/talks/.cache/opendata/mastertalk-event/.
import EVENT_LB from './data/event-lb.json'

// The MasterTalk's pieces, registered before the stage boots: the histogram
// (the 2019 peak the talk opens and closes on, setup/grains.js), the shared
// LHC opening's collision drawing (components/lhc-opening/) with the talk's
// own Λb⁰ event, the kit's detector (plugins: [lhcb]) lit along the event's
// tracks, the kit's <StageSteps> for the forms' steps, <Clock>
// for the running time since the crossing, and <Crossing>, which starts and
// stops the collision without the opening's Lithuanian captions.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app, router }) => {
  armAfterCover(router)
  installGrains(registerBuilder)
  installFunnel(registerBuilder)   // the Universe's history in grains (setup/funnel.js)
  installOpening({ app, registerBuilder, event: EVENT_LB })
  installRoute(registerBuilder)   // the data's route, the grid, the dot (setup/route.js)
  setLhcbTracks(trajectories(EVENT_LB).tracks.map((t) => t.pts))   // the detector's hits: the grains our tracks pass through
  app.component('Clock', Clock)
  app.component('Crossing', Crossing)
  app.component('WebTakeover', WebTakeover)
  app.component('AfterFlight', AfterFlight)
  app.component('Soundtrack', Soundtrack)
  installSoundKeys()
}
