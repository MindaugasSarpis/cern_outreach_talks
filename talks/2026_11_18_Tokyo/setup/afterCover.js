import { ref } from 'vue'

// From Innoday's setup/afterCover.js (2026-10-27), its `places` latch only: the globe's data
// (setup/globe.js) and its photo (CollabGlobe.vue) load once the cover is behind, so their
// decoding never stalls the cover's pentaquark flying in. It flips 1.2 s after a clip covers
// the screen and still covers it (the zoom out from Vilnius on slide 2), or at the latest on
// the step past slide 2; at once for a page opened past the cover.
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
export const places = latch()

const slideOf = (path) => Number((/^\/(?:presenter\/)?(\d+)/.exec(path || '') || [])[1] || 1)

export function armAfterCover(router) {
  if (typeof window === 'undefined') return places.flip()
  if (slideOf(location.hash.slice(1)) > 1) return places.flip()
  let timer = 0
  const onCover = (e) => {
    clearTimeout(timer)
    if (e.detail?.covered && e.detail.fit !== 'contain') timer = setTimeout(() => places.flip(), 1200)
    if (places.on.value) window.removeEventListener('slidev-videos:cover', onCover)
  }
  window.addEventListener('slidev-videos:cover', onCover)
  router?.beforeEach?.((to) => { if (slideOf(to.path) >= 3) places.flip() })
}
