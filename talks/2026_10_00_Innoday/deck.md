---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-10-00-innoday
  fit: cover
  transition: dust          # every clip arrives and leaves as particles
  dust: '#5b93ff'
stage:
  space: data/space.json
  palette: blue
  plugins: [hadron]
  sound: true
title: World of Particles
info: |
  Innoday — a talk told inside one 3D world (slidev-addon-stage, blue palette):
  the camera flies from station to station and the clips condense out of the
  dust and break back into it (slidev-addon-videos, transition: dust).
  Date placeholder 2026_10_00. Clips are the World of Particles reel's library
  clips, inherited by name; swap them freely, then `pnpm videos:frames`.
  Keys on a video slide: p play/pause, + / - volume. On the cover, the part
  openers and the close: c builds what stands there again.
layout: cover
space:
  at: wide
---

# Innoday

# World of Particles

## From Saulėtekis to the edge of the Universe, down to the quarks, inside CERN

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<!--
Speaker: one scene throughout, and everything in it made of grains of light.
Behind the title the five quarks fly in from the dust and assemble into the
c c̄ u u d cluster; the title fades in as the last one lands, and `c` replays
it. The same cluster closes the talk. Three parts, each opening on a form
that gathers as the camera arrives: a spiral galaxy, a proton, the collider
ring with its two bunches meeting. Between them the clips: each gathers on a
plane standing off in the world and flies to the screen, and leaving it
breaks up past the camera and leaves its colours in the dust for a few
seconds; the camera has moved on by the time it clears. `c` on any part
opener builds its form again. While this slide is up the player buffers the
first three clips.
-->

---
layout: section
space: { at: [11.5, -2.6, 0], dist: 17, yaw: -20, pitch: 40, dim: 0.08 }   # the galaxy in the upper right, the title low and left
---

# Part I

From Saulėtekis to the edge of the Universe

<!--
Speaker: the first form: a spiral galaxy gathers out of the dust as the
camera arrives, and turns. The clips that follow go outward from home: the
Moon, Mars, Saturn, then the stars, the galaxies and the oldest light.
-->

---
space: { at: cosmos, dist: 22, yaw: 12, pitch: 52, dim: 0.62 }   # above the galaxy, behind the cards
---

# Leaving home

<div class="row">
<div class="card col-45">

## By rocket and by robot

Saturn V carried people to the Moon. Since then the machines have gone further: Mars, Saturn, and out of the Solar System.

</div>
<div class="card col-45">

## By light

What we cannot visit we watch. Hubble and Webb look back through thirteen billion years to the first galaxies.

</div>
</div>

<div class="src">Clips: NASA · ESA · Firefly Aerospace · slidev-videos shared library</div>

<!--
Speaker: a content slide, to show how text sits in the world: the scene
steps back (dim 0.62), cards float on it with a dust border. Replace with the
talk's own material.
-->

---
space: { at: [17, 5, -12], dist: 18, yaw: -38, pitch: 16 }
---

<!-- Part I · leaving Earth: Saturn V launch, NASA archival, with sound (2:55) -->
<VideoPlayer src="saturn_v_launch_nasa.mp4" />

---
space: { at: [18, 5.5, -13], dist: 18, yaw: -34, pitch: 15 }
---

<!-- Part I · the Moon: Firefly Blue Ghost in lunar orbit -->
<VideoPlayer src="blue_ghost_lunar_orbit.mp4" />

---
space: { at: [19, 6, -14], dist: 18, yaw: -30, pitch: 14 }
---

<!-- Part I · 1965: Mariner 4 — the first data from another planet (0:20) -->
<VideoPlayer src="nasa_mars_mariner_4_pan_audio.mp4" />

---
space: { at: [20, 6, -15], dist: 18, yaw: -26, pitch: 14 }
---

<!-- Part I · Mars: Perseverance — cruise-stage separation, parachute descent, touchdown (3:10) -->
<VideoPlayer src="perseverance_rover_landing_nasa.mp4" />

---
space: { at: [21, 6.5, -16], dist: 18, yaw: -22, pitch: 14 }
---

<!-- Part I · Saturn: Cassini Grand Finale ring dives, no voice-over (3:41) -->
<VideoPlayer src="cassini_grand_finale.mp4" />

---
space: { at: [22, 7, -17], dist: 18, yaw: -18, pitch: 14 }
---

<!-- Part I · the stars: starfield pan with ambient audio (0:20) -->
<VideoPlayer src="stars_pan_audio.mp4" />

---
space: { at: [24, 7.5, -18], dist: 18, yaw: -14, pitch: 14 }
---

<!-- Part I · Hubble in orbit (0:33) -->
<VideoPlayer src="hubble.mp4" />

---
space: { at: [26, 8, -20], dist: 18, yaw: -10, pitch: 14 }
---

<!-- Part I · a telescope under the night sky (0:40) -->
<VideoPlayer src="telescope.mp4" />

---
space: { at: [29, 9, -22], dist: 18, yaw: -6, pitch: 14 }
---

<!-- Part I · the deep universe: JWST image reel (2:58) -->
<VideoPlayer src="webb_reel.mp4" />

---
space: { at: [32, 10, -24], dist: 18, yaw: 2, pitch: 14 }
---

<!-- Part I · our galaxy: Milky Way formation simulation, with audio (1:01) -->
<VideoPlayer src="milky_way_sim_audio.mp4" />

---
space: { at: [35, 10, -24], dist: 18, yaw: 10, pitch: 12 }
---

<!-- Part I · the Big Bang: cosmic expansion funnel (0:30, silent) -->
<VideoPlayer src="expansion_funnel.webm" muted />

---
space: { at: [38, 9, -22], dist: 18, yaw: 18, pitch: 10 }
---

<!-- Part I · the oldest light: beyond the CMB (silent) -->
<VideoPlayer src="beyond_cmb.mp4" muted />

---
space: { at: [41, 7, -18], dist: 18, yaw: 26, pitch: 8 }
---

<!-- Part I · the CMB as sound — the part ends on data -->
<VideoPlayer src="cmb_sonification_drone.mp4" />

---
layout: section
space: { at: [47.2, -1.6, -2], dist: 10, yaw: -26, pitch: 8, sway: 5, dim: 0.08 }   # the proton in the upper right
---

# Part II

Down to the quarks

<!--
Speaker: the second form: a proton gathers, three quarks as clouds of grains,
each on its own orbit inside the bound volume, strings of grains flowing
between them.
-->

---
space: { at: matter, dist: 12, yaw: 14, pitch: 14, dim: 0.62 }
---

# What everything is made of

<div class="row">
<div class="card col-45">

## Three quarks

A proton is two up quarks and a down, held by gluons. Almost all of its mass is the energy of that binding, not the quarks.

</div>
<div class="card col-45">

## Seen by their tracks

Nobody has seen a quark alone. We see what they leave: tracks in a cloud chamber, showers in a detector.

</div>
</div>

<div class="src">PDG 2024, Review of Particle Physics</div>

<!--
Speaker: placeholder content in the talk's type. Replace.
-->

---
space: { at: [52, 5, -14], dist: 16, yaw: -28, pitch: 12 }
---

<!-- Part II · the primordial soup: quark-gluon plasma formation (0:33) -->
<VideoPlayer src="qgp_formation.mp4" />

---
space: { at: [56, 5, -14], dist: 16, yaw: -12, pitch: 12 }
---

<!-- Part II · zoom into atoms, from a hair to the quarks (CG, 2:06) -->
<VideoPlayer src="atoms.mp4" />

---
space: { at: [60, 5, -14], dist: 16, yaw: 4, pitch: 12 }
---

<!-- Part II · particles made visible: cloud chamber, with audio (2:29) -->
<VideoPlayer src="cloud_chamber_audio.mp4" />

---
space: { at: [64, 5, -14], dist: 16, yaw: 18, pitch: 12 }
---

<!-- Part II · the Standard Model table builds up (CERN-FOOTAGE-2015-006-001, 0:34) -->
<VideoPlayer src="cern_footage_2015_006_001.mp4" />

---
layout: section
space: { at: [84.5, -3.4, 0], dist: 19, yaw: -30, pitch: 24, dim: 0.08 }   # the ring in the upper right; its two bunches meet at the near and the far side
---

# Part III

Inside CERN

<!--
Speaker: the third form: the ring gathers, grains streaming both ways round
it. Two bunches run against each other and meet twice a lap; each meeting
throws a spray of tracks that bend and fade. One lap is eight seconds here;
in the LHC it is 89 microseconds, 27 km round.
-->

---
space: { at: [94, 6, -18], dist: 18, yaw: -26, pitch: 14 }
---

<!-- Part III · CERN from the air (0:11) -->
<VideoPlayer src="cern_overview_short.mp4" />

---
space: { at: [98, 6, -18], dist: 18, yaw: -10, pitch: 14 }
---

<!-- Part III · the real LHC tunnel, travelling shot (CERN-FOOTAGE-2022-013-001, 4:13) -->
<VideoPlayer src="cern_footage_2022_013_001.mp4" />

---
space: { at: [101, 6, -18], dist: 18, yaw: 0, pitch: 14 }
---

<!-- Part III · descending the ATLAS shaft (ATLAS-FOOTAGE-2022-004-002, 0:29, 3:2 → cover) -->
<VideoPlayer src="atlas_footage_2022_004_002.mp4" />

---
space: { at: [104, 6, -18], dist: 18, yaw: 10, pitch: 14 }
---

<!-- Part III · LHCb reel, with audio (0:47) -->
<VideoPlayer src="lhcb.mp4" />

---
space: { at: [107, 6, -18], dist: 18, yaw: 20, pitch: 14 }
---

<!-- Part III · the future: FCC map aerial (CERN-FOOTAGE-2024-006-001, 0:18) -->
<VideoPlayer src="cern_footage_2024_006_001.mp4" />

---
space: { at: [70, 14, -30], dist: 20, yaw: 0, pitch: 16 }
---

<!-- Closer · LHCb fly-through ending on "Ačiū" (2:28, library clip). The English
     twin, lhcb_thanks.mp4, and the opener vu_ff_zoom.mp4 are owned by the World
     of Particles release and are not in the library; to use them here, list them
     in videos/manifest.toml and publish them to this talk's release. -->
<VideoPlayer src="lhcb_aciu.mp4" />

---
layout: statement
space: { at: close }
---

# Thank you

<div class="mt-md">Questions · c builds it again</div>

<!--
Speaker: back where the talk began. The flight here is the longest in the
deck (about 4.5 s); the pentaquark is scattered when it starts and assembles
on arrival.
-->
