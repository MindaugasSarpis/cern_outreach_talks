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
//
// A tab opened before a deploy asks for slide chunks the new build no longer
// has (Pages keeps only the latest build), and Slidev shows „Failed to fetch
// this slide“ (owner, 13 Oct, on slide 29). Vite reports the failed chunk as
// `vite:preloadError`: reload once, on the same slide (the hash), to fetch the
// new build. A second failure within 30 s is a real network fault: it shows.
function reloadOnStaleChunk() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (e) => {
    try {
      const k = 'innoday:chunk-reload'
      if (Date.now() - (Number(sessionStorage.getItem(k)) || 0) < 30000) return
      sessionStorage.setItem(k, String(Date.now()))
    } catch { return }   // no storage, no reload: it could not stop a loop
    e.preventDefault()
    location.reload()
  })
}

export default ({ app }) => {
  reloadOnStaleChunk()
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
