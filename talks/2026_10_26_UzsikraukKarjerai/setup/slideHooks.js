import { watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'

// Slidev's own onSlideEnter is a watchEffect: every reactive value its callback reads (the slide's
// $clicks, a prop, a ref) becomes a dependency, so it ran again on a click within the slide (25 Oct:
// <InsideLhcb> restarted LHCb under the map on 16's press; the music's arrival and the data sounds
// ran again on every press). This one runs when the slide becomes the current one, and only then.
export function onSlideEnter(cb) {
  const active = useIsSlideActive()
  watch(active, (on) => { if (on) cb() }, { immediate: true })
}
