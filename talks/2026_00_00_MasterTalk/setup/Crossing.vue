<script setup>
// <Crossing name="crossing" start />: starts the collision when this slide
// opens (from its run-in); <Crossing name="crossing" :lead="3.05" /> on the slides
// after it lets the same run go on when the deck steps forward from the slide
// before, and otherwise (opened directly, a jump, a step back) starts the run
// afresh `lead` engine-seconds in, so the slide stands as it would have after
// the forward step: slide 10 at the edge of the crossing, 11 and 12 on the
// settled debris (27 Oct; slide 10 was black opened directly).
// <Crossing name="crossing" stop /> lets it fade. The shared opening's own
// <LhcOpening> carries Lithuanian captions; the MasterTalk shows its numbers on
// the slides instead. Not in print.
import { useNav, useSlideContext } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'
import { slideNav } from './slideNav.js'
import { bus } from '../components/lhc-opening/bus.js'

const props = defineProps({
  name: { type: String, default: 'crossing' },
  start: { type: Boolean, default: false },
  stop: { type: Boolean, default: false },
  lead: { type: Number, default: null },   // engine-s of the run this slide expects at its start
})
const { isPrintMode } = useNav()
const { $page } = useSlideContext()

// the collision's shared uniforms (components/lhc-opening/collision.js): one
// object per run, shared by its materials, so moving uStart and uTc moves the run
function runUniforms() {
  const h = document.querySelector('.stage canvas')?.__space
  let u = null
  h?.scene?.traverse((o) => { const m = o.material?.uniforms; if (!u && m?.uStart && m?.uTc && m?.uVB) u = m })
  return u
}

onSlideEnter(() => {
  if (isPrintMode.value) return
  if (props.stop) { bus.set(props.name, 0); bus.emit('stop', { name: props.name }); return }
  if (props.start) { bus.set(props.name, 1); return }
  if (props.lead == null) return
  const page = $page?.value ?? $page
  const forward = slideNav.prev === page - 1 && bus.state.get(props.name) === 1
  if (forward) return
  // collisionRun answers the step with 'start' (uStart = now): at once in a running
  // world, or once a world that is still booting has built the collision (it replays
  // the bus's last step); the run is moved back `lead` as soon as its uniforms are found
  const lead = props.lead
  let pending = false, tries = 0
  const off = bus.on('start', (e) => { if (e?.name === props.name) { pending = true; off() } })
  const shift = () => {
    const u = pending && runUniforms()
    if (u) { u.uStart.value -= lead; u.uTc.value -= lead; return }
    if (++tries < 600) requestAnimationFrame(shift); else off()
  }
  bus.set(props.name, 1)
  shift()
})
</script>

<template><span class="crossing-step" aria-hidden="true" /></template>
