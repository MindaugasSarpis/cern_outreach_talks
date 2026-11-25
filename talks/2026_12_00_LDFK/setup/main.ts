// Talk-owned components. `components/` is the symlink to the shared kit, so this
// talk's own pieces are registered here instead of being auto-imported.
// Slidev loads KaTeX's stylesheet only for Markdown maths; <Tex> needs it too
import 'katex/dist/katex.min.css'
import HexTile from './HexTile.vue'
import HexTeam from './HexTeam.vue'
import Tex from './Tex.vue'

export default ({ app }: { app: import('vue').App }) => {
  app.component('HexTile', HexTile)
  app.component('HexTeam', HexTeam)
  app.component('Tex', Tex)
}
