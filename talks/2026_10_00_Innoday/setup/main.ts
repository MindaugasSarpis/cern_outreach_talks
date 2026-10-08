import { registerBuilder } from 'slidev-addon-stage'
import { installStrands } from './strands.js'
import Count from './Count.vue'
import Strands from './Strands.vue'
import PrintStill from './PrintStill.vue'
import WebTakeover from './WebTakeover.vue'

// <Count> counts a slide's big number up as the slide arrives; <WebTakeover>
// turns the opener's last frame into the world's grains; `strands` (the
// talk's own world form) joins the engine's registry before the stage boots.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installStrands(registerBuilder)
  app.component('Count', Count)
  app.component('Strands', Strands)
  app.component('PrintStill', PrintStill)
  app.component('WebTakeover', WebTakeover)
}
