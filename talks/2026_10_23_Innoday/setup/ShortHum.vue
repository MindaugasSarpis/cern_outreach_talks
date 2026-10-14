<script setup>
import { onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { humProbe, stopHum } from 'slidev-addon-stage'

// <ShortHum :seconds="1.5" />: the stage's hum plays for as long as a slide
// lets it (`hum` not false); on a slide with this it sounds for about 3 s
// (owner, 14 Oct: "the humm on the universe it too long, only 2-3s please"):
// it swells for `seconds` from when it starts, then fades over the engine's
// 1.8 s release. The hum is watched rather than timed from the slide's
// arrival, because the stage starts it again on its own (the first key press
// that unlocks audio, the tab coming back into view): each new start gets the
// same `seconds`, never a hum that runs on.
const props = defineProps({ seconds: { type: Number, default: 1.5 } })
const { isPrintMode } = useNav()
let poll = 0, since = -1
function watchHum() {
  const h = humProbe()
  if (!h.playing || h.fading) { since = -1; return }
  const now = performance.now()
  if (since < 0) since = now
  else if (now - since >= props.seconds * 1000) { stopHum(); since = -1 }
}
const halt = () => { clearInterval(poll); poll = 0; since = -1 }
onSlideEnter(() => { if (isPrintMode.value) return; halt(); poll = setInterval(watchHum, 100); watchHum() })
onSlideLeave(halt)
onUnmounted(halt)
</script>

<template><span class="short-hum" hidden /></template>
