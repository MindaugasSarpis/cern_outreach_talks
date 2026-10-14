import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'
import { installThesis } from './thesis.js'
import { installTeam, armTeam } from './team.js'
import { installOpening } from '../components/lhc-opening/index.js'
import Grains from './Grains.vue'
import Count from './Count.vue'
// The CMS event's data in the deck's own bundle (as Innoday's main.ts): lhc-opening
// loads it with a dynamic import, so the collision's cloud was filled when that
// chunk arrived, a few seconds in, in the middle of the cover's fly-in (0.25-0.3 s
// of main thread in Innoday's trace). Imported here, its import resolves at once
// and the fill runs in the world's boot, before the fly-in starts. The reference
// below keeps the import; components/lhc-opening is unchanged.
import EVENT_CMS from '../components/lhc-opening/event-cms.json'

// A page built from an old index.html (a tab restored or opened from cache
// after a deploy) asks for slide chunks the new build no longer has: Pages
// keeps only the latest build, and Slidev shows „Failed to fetch this slide“.
// Vite reports a failed chunk as `vite:preloadError`: in the page's first 20 s,
// reload once on the same slide (the hash) to fetch the new build. Never later
// (a reload mid-talk is worse than one slide's error), and not again within
// 60 s of the last reload (no loop). Innoday's, with this talk's key.
function reloadOnStaleChunk() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (e) => {
    if (performance.now() > 20000) return
    try {
      const k = 'karjera:chunk-reload'
      if (Date.now() - (Number(sessionStorage.getItem(k)) || 0) < 60000) return
      sessionStorage.setItem(k, String(Date.now()))
    } catch { return }   // no storage, no reload: it could not stop a loop
    e.preventDefault()
    location.reload()
  })
}

// The talk's own forms (matter and antimatter, a life's path, streams that
// bring it together, the plots) join the engine's registry before the stage
// boots, and <Grains> lets a slide set them. From OpenData, on the same bus:
// `peakhist` (Dominykas's thesis plot with the rise, setup/thesis.js) and
// `portraits` (the group's ring of faces round a gold beam, setup/team.js,
// whose pictures wait for armTeam's latch: the cover's fly-in stays clear).
// (A plain function: Slidev's defineAppSetup is the identity, and
// @slidev/types is not a dependency of the talk.)
export default ({ app, router }) => {
  reloadOnStaleChunk()
  armTeam(router)
  ;(globalThis as any).__karjeraCmsEvent = EVENT_CMS
  installGrains(registerBuilder)
  installThesis(registerBuilder)
  installTeam(registerBuilder)
  installOpening({ app, registerBuilder })   // the shared LHC opening: its collision, sound and <LhcOpening>
  app.component('Grains', Grains)
  app.component('Count', Count)
}
