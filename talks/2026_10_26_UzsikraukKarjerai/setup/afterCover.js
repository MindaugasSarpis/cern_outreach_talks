import { ref } from 'vue'

// Innoday's setup/afterCover.js, cut down to its `disk` latch: the funnel's CMB
// picture (funnel.js warmDisk: a 2048² decode and its upload) waits until the
// cover is behind. The cover's five-quark form flies in over 3 s on a clock that
// a long task freezes rather than skips, so a stall there shows (Innoday's owner,
// 14 Oct: "slight lag on cover slide animation"), nor in the fade to the web's
// slide (2): <WebTakeover> flips it once the still copy of the picture stands, in
// the 0.45 s it holds before the dissolve, so the stall does not show. The step to
// slide 3 flips it if the takeover did not run; a page opened past the cover flips
// it at once. router.beforeEach, not 'hashchange': Vue Router's hash mode moves
// with pushState.
function latch() {
  const on = ref(false), waiting = new Set()
  return {
    on,
    // run fn once the latch flips (now, if it has); returns an unsubscribe
    when(fn) {
      if (on.value) { fn(); return () => {} }
      waiting.add(fn)
      return () => waiting.delete(fn)
    },
    flip() {
      if (on.value) return
      on.value = true
      for (const fn of [...waiting]) { waiting.delete(fn); try { fn() } catch (e) { console.warn('afterCover:', e) } }
    },
  }
}
export const disk = latch()

const slideOf = (path) => Number((/^\/(?:presenter\/)?(\d+)/.exec(path || '') || [])[1] || 1)

export function armAfterCover(router) {
  if (typeof window === 'undefined' || slideOf(location.hash.slice(1)) > 1) return disk.flip()
  router?.beforeEach?.((to) => { if (slideOf(to.path) >= 3) disk.flip() })
}
