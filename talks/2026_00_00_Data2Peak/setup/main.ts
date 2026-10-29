// Talk 2 of "Data analysis, the CERN way": the series' dk- forms (components/data-kit,
// reached through the talk's components symlink), given the engine from this talk's
// own pinned copy of slidev-addon-stage. The .nums look is in styles/index.css.
// (A plain function: Slidev's defineAppSetup is the identity, and @slidev/types is
// not a dependency of the talk.)
import * as stage from 'slidev-addon-stage'
import { installDataKit } from '../components/data-kit/index.js'

export default ({ app }) => {
  installDataKit({ app, stage })
}
