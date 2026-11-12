<script setup>
// <QcdCoupling />: the strong coupling against the energy scale (the owner, 12 Nov: "After Kobayashi, Masakawaa,
// a slide just highlighting how difficult is QCD"). One curve, drawn as the slide opens: α_s falls with energy
// (asymptotic freedom, 1973) and grows toward the scale of hadrons, where an expansion in it stops converging.
// The curve is two-loop running in the MS-bar scheme from the PDG's α_s(M_Z) = 0.1180 (2024), the number of
// flavours stepping at m_b = 4.18 GeV and m_c = 1.27 GeV; 61 points, 1 GeV to 1 TeV, twenty a decade (computed
// once; the list below). It stops at 1 GeV: below it the perturbative formula means nothing. Off the live slide
// (overview, print, the presenter's preview) it stands drawn.
import { computed } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const A = [0.4444, 0.4073, 0.3764, 0.3524, 0.3315, 0.3132, 0.2969, 0.2823, 0.2691, 0.2572, 0.2463, 0.2364, 0.2272,
  0.2193, 0.2122, 0.2055, 0.1993, 0.1935, 0.188, 0.1828, 0.1779, 0.1732, 0.1688, 0.1647, 0.1607, 0.157, 0.1534,
  0.1499, 0.1467, 0.1435, 0.1405, 0.1377, 0.1349, 0.1323, 0.1297, 0.1273, 0.1249, 0.1227, 0.1205, 0.1184, 0.1164,
  0.1144, 0.1125, 0.1107, 0.1089, 0.1072, 0.1056, 0.104, 0.1024, 0.1009, 0.0994, 0.098, 0.0966, 0.0953, 0.094,
  0.0927, 0.0915, 0.0903, 0.0891, 0.088, 0.0868]
// the plot's box in slide units (980 × 551.25); x: log10 Q from 0.5 GeV to 1 TeV, y: α_s from 0 to 0.5
const X0 = 150, X1 = 880, Y0 = 372, Y1 = 78
const LMIN = Math.log10(0.5), LMAX = 3
const x = (q) => X0 + ((Math.log10(q) - LMIN) / (LMAX - LMIN)) * (X1 - X0)
const y = (a) => Y0 - (a / 0.5) * (Y0 - Y1)
const curve = A.map((a, i) => `${i ? 'L' : 'M'}${x(10 ** (i / 20)).toFixed(1)} ${y(a).toFixed(1)}`).join(' ')
const XT = [1, 10, 100, 1000], YT = [0.1, 0.2, 0.3, 0.4, 0.5]
const MP = 0.938, MZ = 91.19, AZ = 0.118

const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const run = computed(() => live.value && active.value)
</script>

<template>
  <svg class="qcd" :class="{ run, done: !live }" viewBox="0 0 980 551.25" aria-label="The strong coupling against the energy scale">
    <!-- below about 1 GeV: the scale of hadrons -->
    <rect class="soft" :x="X0" :y="Y1" :width="x(1) - X0" :height="Y0 - Y1" />
    <line class="mp" :x1="x(MP)" :x2="x(MP)" :y1="Y1" :y2="Y0" />
    <path class="ax" :d="`M${X0} ${Y1} V${Y0} H${X1}`" />
    <g v-for="t in XT" :key="'x' + t"><line class="tick" :x1="x(t)" :x2="x(t)" :y1="Y0" :y2="Y0 + 7" /><text class="tk" :x="x(t)" :y="Y0 + 28" text-anchor="middle">{{ t }}</text></g>
    <g v-for="t in YT" :key="'y' + t"><line class="tick" :x1="X0 - 7" :x2="X0" :y1="y(t)" :y2="y(t)" /><text class="tk" :x="X0 - 14" :y="y(t) + 6" text-anchor="end">{{ t.toFixed(1) }}</text></g>
    <text class="nm" :x="(X0 + X1) / 2" :y="Y0 + 54" text-anchor="middle">energy scale Q (GeV)</text>
    <text class="nm" :x="X0 - 70" :y="Y1 + 8" text-anchor="middle">α<tspan class="sub" dy="5">s</tspan></text>
    <path class="curve" :d="curve" pathLength="1" />
    <g class="late">
      <circle class="pt" :cx="x(MZ)" :cy="y(AZ)" r="5.5" />
      <text class="lb" :x="x(MZ)" :y="y(AZ) - 18" text-anchor="middle">α<tspan class="sub" dy="5">s</tspan><tspan dy="-5"> = 0.118 at 91 GeV</tspan></text>
      <text class="rg" :x="x(MP) + 12" :y="Y1 + 24">proton mass</text>
      <text class="rg hi" :x="x(1.5)" :y="y(0.385)">hadrons: no expansion in α<tspan class="sub" dy="5">s</tspan></text>
      <text class="rg hi" :x="x(MZ)" :y="y(0.118) + 46" text-anchor="middle">LHC collisions: perturbation theory</text>
    </g>
  </svg>
</template>

<style scoped>
.qcd { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; text-transform: none; }
.soft { fill: rgba(125, 211, 252, 0.09); }
.mp { stroke: #9fd8ff; stroke-opacity: 0.7; stroke-width: 1.5; stroke-dasharray: 5 5; }
.ax { fill: none; stroke: #9fb8d0; stroke-width: 1.5; }
.tick { stroke: #9fb8d0; stroke-width: 1.2; }
.tk { font-size: 18px; fill: #c9dcf0; font-variant-numeric: lining-nums tabular-nums; }
.nm { font-size: 20px; font-weight: 500; fill: #e8f6ff; }
.curve { fill: none; stroke: #e8f6ff; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 6px rgba(125, 211, 252, 0.55)); stroke-dasharray: 1; stroke-dashoffset: 0; }
.pt { fill: #03050c; stroke: #e8f6ff; stroke-width: 2.5; }
.lb { font-size: 21px; font-weight: 600; fill: #fff; }
.rg { font-size: 18px; fill: #9fd8ff; }
.rg.hi { font-size: 21px; font-weight: 500; fill: #e8f6ff; }
/* the theme sets its headings' case on what it finds inside a slide: the subscript s stays an s */
.qcd text, .qcd tspan { text-transform: none !important; }
.qcd .sub { font-size: 0.68em !important; }
/* live: the curve is drawn from 1 TeV down to 1 GeV (the path runs the other way, so the offset counts up from −1), then the names */
.qcd:not(.done) .curve { stroke-dashoffset: -1; }
.qcd:not(.done) .late { opacity: 0; }
.qcd.run .curve { animation: qcd-draw 3.2s ease-in-out 0.8s forwards; }
.qcd.run .late { animation: qcd-in 0.9s ease 3.6s forwards; }
@keyframes qcd-draw { to { stroke-dashoffset: 0; } }
@keyframes qcd-in { to { opacity: 1; } }
@media print { .qcd .curve { stroke-dashoffset: 0 !important; animation: none !important; } .qcd .late { opacity: 1 !important; animation: none !important; } }
</style>
