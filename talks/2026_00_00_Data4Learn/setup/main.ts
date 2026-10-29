// Talk 4 of "Data analysis, the CERN way": the data kit's forms (components/data-kit,
// reached through the talk's components symlink), given the engine from this talk's own
// pinned slidev-addon-stage. The talk draws no collision, so no lhc-opening here.
import * as stage from 'slidev-addon-stage'
import { installDataKit } from '../components/data-kit/index.js'

export default ({ app }) => {
  installDataKit({ app, stage })
}
