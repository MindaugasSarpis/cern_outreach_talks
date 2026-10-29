// Open data (Talk 5 of "Data analysis, the CERN way"). The series' dk forms come from the
// shared kit (components/data-kit, through the talk's components symlink) with this talk's
// own pinned engine; the close draws one real crossing (components/lhc-opening, record
// 24506) inside the kit's LHCb detector, so the opening's builder and the event's tracks
// are installed too. <RouteCrossing> starts that crossing when the close is entered.
import * as stage from 'slidev-addon-stage'
import { setLhcbTracks } from 'slidev-addon-stage/plugins/lhcb'
import { installDataKit } from '../components/data-kit/index.js'
import { installOpening } from '../components/lhc-opening/index.js'
import { trajectories } from '../components/lhc-opening/event.js'
import EVENT from '../components/lhc-opening/event.json'
import RouteCrossing from './RouteCrossing.vue'

export default ({ app }) => {
  installDataKit({ app, stage })
  installOpening({ app, registerBuilder: stage.registerBuilder })
  // the detector's hits: the grains the event's tracks pass through
  setLhcbTracks(trajectories(EVENT).tracks.map((t) => t.pts))
  app.component('RouteCrossing', RouteCrossing)
}
