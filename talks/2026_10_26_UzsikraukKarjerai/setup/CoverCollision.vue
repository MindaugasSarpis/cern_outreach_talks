<script setup>
// <CoverCollision />: the cover's slow CMS loop (`cover-collision`, setup/coverCollision.js, Innoday's;
// the owner, 25 Oct: "the cover slide could be more substantial, maybe a colission from innoday, or
// something even more innovative"). While the cover is the current slide the rounds run (bunches meet,
// the tracks fan out, the burst holds, fades, again); leaving it lets the burst fade. Here the
// five-quark form (`pq`) stands scattered until the first round's crossing and gathers out of its burst
// (`gatherAt` world seconds after the arrival: the run-in and its slowing bring the first crossing at ~4 s), so the
// particle this talk is about comes out of a collision. Silent. Only the live slide drives it; in print
// the still shows it.
import { onSlideLeave, useNav, useSlideContext } from '@slidev/client'
import { onSlideEnter } from './slideHooks.js'
import { bus } from '../components/lhc-opening/bus.js'
import { setGrains, setGrainsLater } from './grains.js'

const props = defineProps({
  name: { type: String, default: 'cover' },
  form: { type: String, default: 'pq' },
  gatherAt: { type: Number, default: 3.8 },   // measured: the first crossing's flash at ~4 s
})
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const live = () => ['slide', 'presenter'].includes($renderContext?.value)
let cancel = null
onSlideEnter(() => {
  if (!live() || isPrintMode.value) return
  cancel?.()
  setGrains(props.form, 0)
  cancel = setGrainsLater(props.form, 3, props.gatherAt)
  bus.set(props.name, 1)
})
onSlideLeave(() => {
  if (!live()) return
  cancel?.(); cancel = null
  setGrains(props.form, 3)   // the form stays whole for the slides that keep it
  bus.set(props.name, 0)
})
</script>

<template><span class="cover-collision" aria-hidden="true" /></template>
