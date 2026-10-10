import { registerBuilder } from 'slidev-addon-stage'
import { installStrands } from './strands.js'
import { installFunnel } from './funnel.js'
import Count from './Count.vue'
import Strands from './Strands.vue'
import AfterFlight from './AfterFlight.vue'
import WebTakeover from './WebTakeover.vue'
import OpenerStart from './OpenerStart.vue'

// <Count> counts a slide's big number up as the slide arrives; <WebTakeover>
// turns the opener's last frame into the world's grains; <OpenerStart> holds
// the opener, the deck's first slide, on its first frame until the first
// press; `strands` (the talk's own world form) joins the engine's registry
// before the stage boots.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installStrands(registerBuilder)
  installFunnel(registerBuilder)
  app.component('Count', Count)
  app.component('Strands', Strands)
  app.component('AfterFlight', AfterFlight)
  app.component('WebTakeover', WebTakeover)
  app.component('OpenerStart', OpenerStart)
}
