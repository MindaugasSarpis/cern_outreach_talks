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
import { installOpening } from '../components/lhc-opening/index.js'

// <Count> counts a slide's big number up as the slide arrives; <WebTakeover>
// turns the opener's last frame into the world's grains; <OpenerStart> holds
// the opener on its first frame until the first press when the deck is opened
// at it (the title slide's press is the gesture otherwise). The talk's own
// world forms join the engine's registry before the stage boots: `strands`,
// `funnel` (with the prologue, the web's grains becoming it) and `plot` (slide
// 12's result plots, light on black, unlit and additive, as OpenData draws its
// plots). The shared LHC collision (components/lhc-opening, as
// in OpenData and Užsikrauk karjerai) registers `lhc-collision` and
// <LhcOpening>; <CollisionStart> starts one on „Ačiū“ without its captions.
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app }) => {
  installStrands(registerBuilder)
  installFunnel(registerBuilder)
  installPlots(registerBuilder)
  installOpening({ app, registerBuilder })
  app.component('Count', Count)
  app.component('Strands', Strands)
  app.component('AfterFlight', AfterFlight)
  app.component('WebTakeover', WebTakeover)
  app.component('OpenerStart', OpenerStart)
  app.component('CollisionStart', CollisionStart)
}
