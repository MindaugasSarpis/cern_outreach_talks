import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installSun } from './sun.js'
import { installOpening } from '../components/lhc-opening/index.js'
import Grains from './Grains.vue'
import Count from './Count.vue'
import PeakRise from './PeakRise.vue'

// The talk's own forms (piles of terabyte spheres, streams to the people who
// use them) join the engine's registry before the stage boots, and <Grains> lets
// a slide set them. (A plain function: Slidev's defineAppSetup is the
// identity, and @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installGrains(registerBuilder)
  installSun(registerBuilder)     // the sun of plots made from the open data
  installOpening({ app, registerBuilder })   // the shared LHC opening: its collision, sound and <LhcOpening>
  app.component('Grains', Grains)
  app.component('Count', Count)
  app.component('PeakRise', PeakRise)
}
