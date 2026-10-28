// The talk's own pieces join the stage here, before it boots. A form of the
// talk's own: `import { registerBuilder } from 'slidev-addon-stage'`, then
// registerBuilder(type, build, { fields: ['pos', ...] }); `pnpm talk check`
// finds the type and validates the deck with it. A component:
// app.component('Name', Component). (A plain function: Slidev's
// defineAppSetup is the identity, and @slidev/types is not a dependency of
// the talk.)
export default ({ app }) => {}
