// Talk-owned components. `components/` is the symlink to the shared kit, so this
// talk's own pieces are registered here instead of being auto-imported.
// Slidev loads KaTeX's stylesheet only for Markdown maths; <Tex> needs it too
import 'katex/dist/katex.min.css'
// the theme's typeface from the build, not from Google Fonts at run time (headmatter `fonts.provider: none`)
import '@fontsource/pt-serif/400.css'
import '@fontsource/pt-serif/700.css'
import '@fontsource/pt-serif/400-italic.css'
import '@fontsource/pt-serif/700-italic.css'
import HexTile from './HexTile.vue'
import HexTeam from './HexTeam.vue'
import Tex from './Tex.vue'

export default ({ app }: { app: import('vue').App }) => {
  app.component('HexTile', HexTile)
  app.component('HexTeam', HexTeam)
  app.component('Tex', Tex)
}
