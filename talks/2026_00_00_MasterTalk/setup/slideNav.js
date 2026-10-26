// The slide the deck came from, for components that must set up their own state
// when their slide is entered directly or out of order (the Scheduler, 27 Oct: "a
// slide must set up its own state when entered directly or out of order").
// router.beforeEach, as afterCover.js: Vue Router's hash mode moves with pushState.
export const slideNav = { prev: null, cur: null }
const slideOf = (path) => Number((/^\/(?:presenter\/)?(\d+)/.exec(path || '') || [])[1] || 1)

export function trackSlides(router) {
  if (typeof window !== 'undefined') slideNav.cur = slideOf(location.hash.slice(1))
  router?.beforeEach?.((to, from) => {
    const n = slideOf(to.path)
    if (n !== slideNav.cur) { slideNav.prev = slideNav.cur; slideNav.cur = n }
  })
}
