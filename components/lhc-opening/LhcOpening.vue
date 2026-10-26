<script setup>
// <LhcOpening name="opening" />: on the opening's collision slide. When the slide
// becomes the current one the collision starts from its run-in (every visit plays
// it again); leaving the slide lets it fade. Not in print, where every page is
// "current": the still shows it. Nor without a world (the stage fell back to a
// still or a plate): both captions show, as printed.
//
// Its captions name what is shown, a number and its word, nothing more (the house
// rule): at the crossing the collision's energy, as the debris flies out the count
// of its particles (the event's tracks). <LhcOpening part="tunnel" /> on the tunnel
// clip's slide names the machine: LHC, 27 km. Printed, both of the collision's
// show at once. The numbers are LHCb's event's; a talk that draws another gives
// its own: <LhcOpening name="opening" :tev="8" :count="290" /> (CMS's).
import { ref, computed, onBeforeUnmount } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import { bus } from './bus.js'
import { captions, collisionCaptions } from './captions.js'

const props = defineProps({
  name: { type: String, default: 'opening' },
  part: { type: String, default: 'collision' },   // 'collision' | 'tunnel'
  tev: { type: Number, default: undefined },       // the collision's energy
  count: { type: Number, default: undefined },     // the particles drawn
})
const { isPrintMode } = useNav()
const printing = computed(() => !!isPrintMode.value)
const shown = ref('')                               // '' | 'energy' | 'count'
const offs = []
// Without a world nothing crosses or flies out: both captions show, as printed.
// The stage says so on <html> (data-stage-fallback) and by its events; an older
// stage never does, and the captions are as they were.
const noWorld = ref(!!document.documentElement.dataset.stageFallback)
if (props.part === 'collision') {
  offs.push(bus.on('cross', (d) => { if (d.name === props.name) shown.value = 'energy' }))
  offs.push(bus.on('flyout', (d) => { if (d.name === props.name) shown.value = 'count' }))
  for (const [type, on] of [['slidev-stage:fallback', true], ['slidev-stage:rebuilt', false]]) {
    const h = () => { noWorld.value = on }
    window.addEventListener(type, h)
    offs.push(() => window.removeEventListener(type, h))
  }
}
onBeforeUnmount(() => { for (const off of offs) off() })
onSlideEnter(() => {
  shown.value = ''
  if (props.part === 'collision' && !isPrintMode.value) bus.set(props.name, 1)
})
onSlideLeave(() => {
  if (props.part !== 'collision') return
  bus.set(props.name, 0); bus.emit('stop', { name: props.name })
})
const c = computed(() => ({ ...captions, ...collisionCaptions({ tev: props.tev, count: props.count }) }))
</script>

<template>
  <div v-if="part === 'tunnel'" class="lhc-cap lhc-tunnel" aria-hidden="true">
    <span class="lhc-name">{{ c.tunnel.name }}</span><b>{{ c.tunnel.n }}</b><span class="lhc-unit">{{ c.tunnel.unit }}</span>
  </div>
  <div v-else class="lhc-cap lhc-collision" :class="{ printing: printing || noWorld }" aria-hidden="true">
    <div class="lhc-line" :class="{ on: printing || noWorld || shown === 'energy' }"><b>{{ c.energy.n }}</b><span class="lhc-unit">{{ c.energy.unit }}</span></div>
    <div class="lhc-line" :class="{ on: printing || noWorld || shown === 'count' }"><b>{{ c.count.n }}</b><span class="lhc-unit">{{ c.count.unit }}</span></div>
  </div>
</template>

<style scoped>
/* a number in white, its word in the house's light blue (never gold), low on the left */
.lhc-cap {
  position: absolute; left: 56px; bottom: 44px; z-index: 30; pointer-events: none;
  font-family: 'Space Grotesk', system-ui, sans-serif; color: #fff;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.75), 0 0 2px rgba(0, 0, 0, 0.6);
}
.lhc-cap b { font-size: 56px; font-weight: 700; letter-spacing: -0.01em; line-height: 1; font-variant-numeric: normal; }
.lhc-unit, .lhc-name { font-size: 22px; font-weight: 500; letter-spacing: 0.04em; color: #9cc4ff; margin-left: 0.4em; }
.lhc-name { margin: 0 0.6em 0 0; font-size: 24px; letter-spacing: 0.08em; }
.lhc-tunnel { opacity: 0; animation: lhc-in 1.2s ease 1.6s forwards; }
/* the two lines share one spot: the one going goes quickly, the one coming waits for
   it, so a number never stands on the other's (at the fly-out's best moment) */
.lhc-collision .lhc-line { position: absolute; left: 0; bottom: 0; white-space: nowrap; opacity: 0; transform: translateY(6px); transition: opacity 0.3s ease, transform 0.3s ease; }
.lhc-collision .lhc-line.on { opacity: 1; transform: none; transition: opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s; }
.lhc-collision.printing .lhc-line { position: static; transition: none; }
@keyframes lhc-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .lhc-tunnel { animation: none; opacity: 1; } .lhc-collision .lhc-line, .lhc-collision .lhc-line.on { transition: none; } }
</style>
