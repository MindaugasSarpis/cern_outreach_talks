import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installOpening } from '../components/lhc-opening/index.js'
import Grains from './Grains.vue'
import Clock from './Clock.vue'
import Crossing from './Crossing.vue'
// The talk's one collision: a real 2012 LHCb crossing from the DIMUON stream
// (CERN Open Data record 28040, CC0; run 124143, event 39463039) holding an
// anti-Λb⁰ → J/ψ p̄ K⁺ candidate, m(J/ψ p̄) = 4437.5 MeV. Provenance and the
// candidate's tracks: setup/data/candidate-lb.json; extraction in
// ~/talks/.cache/opendata/mastertalk-event/.
import EVENT_LB from './data/event-lb.json'

// The MasterTalk's pieces, registered before the stage boots: the histogram
// (the 2019 peak the talk opens and closes on, setup/grains.js), the shared
// LHC opening's collision drawing (components/lhc-opening/) with the talk's
// own Λb⁰ event, <Grains> for the forms' steps, <Clock>
// for the running time since the crossing, and <Crossing>, which starts and
// stops the collision without the opening's Lithuanian captions.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installGrains(registerBuilder)
  installOpening({ app, registerBuilder, event: EVENT_LB })
  app.component('Grains', Grains)
  app.component('Clock', Clock)
  app.component('Crossing', Crossing)
}
