import { ref } from 'vue'

// Work that waits until the cover is behind (owner, 14 Oct: "slight lag on cover
// slide animation"). The cover's pentaquark flies in over 3 s from about 0.6 s
// after the world's boot, on a clock that a long task freezes rather than skips,
// so any main-thread work then shows as a stall. Two one-way latches:
//   disk     the funnel's CMB picture (funnel.js warmDisk: a 2048² decode and
//            upload), needed from slide 4;
//   places   the photo places (<AfterCover>: Slidev's preload mounted them ~3 s
//            in, each decoding its photo synchronously), needed from slide 13.
// Both flip 1.2 s after a clip covers the screen and still covers it: the
// opener on slide 2, under which the world rests (the stage pauses 600 ms
// after the cover), its picture's hand-over (450 ms) and its sound's fade-in
// (600 ms) done. A clip that stops covering first (back to the cover) cancels
// it until the next one. Without that (an opener that failed or was skipped
// within 1.2 s): `disk` on the step to slide 3, which opens on the clip's last
// frame and holds it still for 0.45 s, so the stall does not show; `places`
// under the next clip (slides 7, 8, 10), or at the latest on the step to slide
// 12. Both at once for a page opened past slide 1. A jump from the cover
// straight to a place slide before any of these (rehearsal: `g 14`) builds its
// place as it arrives, so the camera first heads for the cover's station and
// turns to the photo once it stands. router.beforeEach, not 'hashchange': Vue
// Router's hash mode moves with pushState.
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
export const places = latch()

const slideOf = (path) => Number((/^\/(?:presenter\/)?(\d+)/.exec(path || '') || [])[1] || 1)
const both = () => { disk.flip(); places.flip() }

export function armAfterCover(router) {
  if (typeof window === 'undefined') return both()
  if (slideOf(location.hash.slice(1)) > 1) return both()
  let timer = 0
  const onCover = (e) => {
    clearTimeout(timer)
    if (e.detail?.covered && e.detail.fit !== 'contain') timer = setTimeout(both, 1200)
    if (disk.on.value && places.on.value) window.removeEventListener('slidev-videos:cover', onCover)
  }
  window.addEventListener('slidev-videos:cover', onCover)
  router?.beforeEach?.((to) => {
    const n = slideOf(to.path)
    if (n >= 3) disk.flip()
    if (n >= 12) places.flip()
  })
}
