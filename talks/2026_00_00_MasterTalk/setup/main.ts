import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installOpening } from '../components/lhc-opening/index.js'
import Grains from './Grains.vue'
import Clock from './Clock.vue'
import Crossing from './Crossing.vue'

// The MasterTalk's pieces, registered before the stage boots: the histogram
// (the 2019 peak the talk opens and closes on, setup/grains.js), the shared
// LHC opening's collision (components/lhc-opening/; its LHCb event until the
// talk's own Λb⁰ event is extracted), <Grains> for the forms' steps, <Clock>
// for the running time since the crossing, and <Crossing>, which starts and
// stops the collision without the opening's Lithuanian captions.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installGrains(registerBuilder)
  installOpening({ app, registerBuilder })
  app.component('Grains', Grains)
  app.component('Clock', Clock)
  app.component('Crossing', Crossing)
}
