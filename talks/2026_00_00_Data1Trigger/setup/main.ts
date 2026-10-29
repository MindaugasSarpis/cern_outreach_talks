// The talk's pieces join the stage here, before it boots: the series' data kit
// (components/data-kit: dk-glow, dk-trigger, dk-lineup, dk-ground, dk-heap,
// dk-spark …), the shared LHC opening's collision drawing (components/lhc-opening,
// `lhc-collision`, one real 2012 LHCb crossing), the kit detector lit along that
// crossing's tracks, and <Crossing>, which starts the collision when the cover
// opens and lets it fade when the cover is left (setup/Crossing.vue).
// (A plain function: Slidev's defineAppSetup is the identity, and @slidev/types
// is not a dependency of the talk.)
import * as stage from 'slidev-addon-stage'
import { setLhcbTracks } from 'slidev-addon-stage/plugins/lhcb'
import { installDataKit } from '../components/data-kit/index.js'
import { installOpening } from '../components/lhc-opening/index.js'
import { trajectories } from '../components/lhc-opening/event.js'
import EVENT from '../components/lhc-opening/event.json'
import Crossing from './Crossing.vue'

export default ({ app }) => {
  installDataKit({ app, stage })
  installOpening({ app, registerBuilder: stage.registerBuilder })
  // the detector's hits: the grains the crossing's tracks pass through
  setLhcbTracks(trajectories(EVENT).tracks.map((t) => t.pts))
  app.component('Crossing', Crossing)
}
