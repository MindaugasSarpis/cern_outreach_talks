import Count from './Count.vue'

// <Count> counts a slide's big number up as the slide arrives. (A plain
// function: Slidev's defineAppSetup is the identity, and @slidev/types is not
// a dependency of the talk.)
export default ({ app }) => {
  app.component('Count', Count)
}
