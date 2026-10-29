// Data3Fit: the shared data kit (components/data-kit, reached through the talk's
// components symlink) registers its dk- forms here, with the engine from this talk's
// own pinned slidev-addon-stage. No collision and no detector in this talk, so no
// lhc-opening and no lhcb plugin. (A plain function: Slidev's defineAppSetup is the
// identity, and @slidev/types is not a dependency of the talk.)
import * as stage from 'slidev-addon-stage'
import { installDataKit } from '../components/data-kit/index.js'

export default ({ app }) => {
  installDataKit({ app, stage })
}
