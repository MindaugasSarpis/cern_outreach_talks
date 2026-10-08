import Count from './Count.vue'
import WebTakeover from './WebTakeover.vue'

// <Count> counts a slide's big number up as the slide arrives; <WebTakeover>
// turns the opener's last frame into the world's grains. (A plain
// function: Slidev's defineAppSetup is the identity, and @slidev/types is not
// a dependency of the talk.)
export default ({ app }) => {
  app.component('Count', Count)
  app.component('WebTakeover', WebTakeover)
}
