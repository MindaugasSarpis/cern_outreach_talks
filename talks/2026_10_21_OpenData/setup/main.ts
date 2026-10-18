import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installDataspace } from './dataspace.js'
import { installSun } from './sun.js'
import { installOpening } from '../components/lhc-opening/index.js'
import Grains from './Grains.vue'
import Count from './Count.vue'
import PeakRise from './PeakRise.vue'
import CoverCollision from './CoverCollision.vue'

// The talk's own forms (piles of terabyte spheres, streams to the people who
// use them) join the engine's registry before the stage boots, and <Grains> lets
// a slide set them. (A plain function: Slidev's defineAppSetup is the
// identity, and @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installGrains(registerBuilder)
  installDataspace(registerBuilder)   // the space of data behind the piles (setup/dataspace.js)
  installSun(registerBuilder)         // the sun of plots made from the open data (setup/sun.js)
  installOpening({ app, registerBuilder })   // the shared LHC opening: its collision, sound and <LhcOpening>
  app.component('Grains', Grains)
  app.component('Count', Count)
  app.component('PeakRise', PeakRise)
  app.component('CoverCollision', CoverCollision)   // the cover's silent CMS crossing
}
