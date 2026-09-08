---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-09-10-worldofparticles
  fit: cover
title: World of Particles
info: |
  World of Particles — opening lecture of the open course, 2026-09-10.
  A video-only reel modelled on lecture 1 of "Best Research and Data
  Analysis Practices from CERN": a landing slide, then three acts —
  from the cosmos, to the quantum, inside CERN. Every clip except the
  opener is a slidev-videos library clip; the venue plays the 1080p
  H.264 web tier. Keys on a video slide: p play/pause, + / - volume.
  Live slides (landing, act cards, finale): click or press c to fire a
  collision. Backup quiz after the finale: 1-3 point, Enter reveals, r resets.
# Slidev defaults slide 1 to the cover layout, which traps a full-bleed
# component in its bottom content strip — force the plain layout.
layout: default
---

<!-- Landing — the CERN-lessons hero (live particle sphere, "proton being
     probed"). Full-bleed, no h1. While this slide is up the player's
     look-ahead buffers the opener and the two clips after it. -->
<ParticleHero
  kicker="Dr. Mindaugas Šarpis"
  title="World of|Particles"
  sub="Opening lecture of the open course · VU Faculty of Physics|10 September 2026"
  corner-tr="Autumn 2026"
  corner-br="Lecture 1"
/>

<!--
Speaker: welcome, one sentence on what the course is, then dim the lights
and advance. The reel runs without talk-over; pick it up between acts.
Act I — from the cosmos (15 clips, ~17 min) · Act II — to the quantum
(4 clips, ~3 min) · Act III — inside CERN (13 clips, ~11 min).
Each act opens on a live card (galaxy / proton / collider ring): click it
or press c to fire a collision while you introduce the act. The finale
counts collisions and plays a sound for the ones you trigger. Nine quiz
cards wait after the finale as backup material (g + slide number).
-->

---

<!-- Act I card — live spiral galaxy (ParticleHero mode="galaxy"). Click / c
     fires a burst at the centre. Static card in the overview grid. -->
<ParticleHero
  mode="galaxy"
  kicker="Act I"
  title="From the|Cosmos"
  corner-tr="World of Particles"
  corner-br="I / III"
/>

---

<!-- Act I · opener: zoom-out from the VU Faculty of Physics roof through
     Vilnius, Earth, the Milky Way and the galaxies to the cosmic web (4:42,
     own audio). Talk-owned; the only clip not from the library. -->
<VideoPlayer src="vu_ff_zoom.mp4" />

---

<!-- Act I · leaving Earth: Saturn V launch, NASA archival, with sound (2:55) -->
<VideoPlayer src="saturn_v_launch_nasa.mp4" />

---

<!-- Act I · the Moon: Firefly Blue Ghost in lunar orbit -->
<VideoPlayer src="blue_ghost_lunar_orbit.mp4" />

---

<!-- Act I · 1965: Mariner 4 — the first data from another planet (0:20) -->
<VideoPlayer src="nasa_mars_mariner_4_pan_audio.mp4" />

---

<!-- Act I · Mars: Perseverance parachute descent and touchdown (1:30 trim) -->
<VideoPlayer src="perseverance_rover_landing_nasa.mp4" />

---

<!-- Act I · Saturn: Cassini Grand Finale ring dive, no voice-over (1:30 trim) -->
<VideoPlayer src="cassini_grand_finale.mp4" />

---

<!-- Act I · the stars: starfield pan with ambient audio (0:20) -->
<VideoPlayer src="stars_pan_audio.mp4" />

---

<!-- Act I · Hubble in orbit (0:33) -->
<VideoPlayer src="hubble.mp4" />

---

<!-- Act I · a telescope under the night sky (0:40) -->
<VideoPlayer src="telescope.mp4" />

---

<!-- Act I · the deep universe: JWST image reel (1:30 trim) -->
<VideoPlayer src="webb_reel.mp4" />

---

<!-- Act I · our galaxy: Milky Way formation simulation, with audio (1:01) -->
<VideoPlayer src="milky_way_sim_audio.mp4" />

---

<!-- Act I · the SDSS map — a universe drawn from a dataset (0:30) -->
<VideoPlayer src="sdss_universe_zoom.mp4" />

---

<!-- Act I · the Big Bang: cosmic expansion funnel (0:30, silent) -->
<VideoPlayer src="expansion_funnel.webm" muted />

---

<!-- Act I · the oldest light: beyond the CMB (silent) -->
<VideoPlayer src="beyond_cmb.mp4" muted />

---

<!-- Act I · the CMB as sound — the act ends on data -->
<VideoPlayer src="cmb_sonification_drone.mp4" />

---

<!-- Act II card — the probed proton (ParticleHero mode="proton"): beam
     pulses arrive along the fibers and collisions erupt inside. -->
<ParticleHero
  mode="proton"
  kicker="Act II"
  title="To the|Quantum"
  corner-tr="World of Particles"
  corner-br="II / III"
/>

---

<!-- Act II · the primordial soup: quark-gluon plasma formation (0:33) -->
<VideoPlayer src="qgp_formation.mp4" />

---

<!-- Act II · the Standard Model table builds up (CERN-FOOTAGE-2015-006-001, 0:34) -->
<VideoPlayer src="cern_footage_2015_006_001.mp4" />

---

<!-- Act II · zoom into atoms (CG) -->
<VideoPlayer src="atoms.mp4" />

---

<!-- Act II · particles made visible: cloud chamber, with audio (1:30 trim) -->
<VideoPlayer src="cloud_chamber_audio.mp4" />

---

<!-- Act III card — collider ring (ParticleHero mode="collider"): two
     bunches race in opposite directions and collide at the interaction
     points twice a lap. -->
<ParticleHero
  mode="collider"
  kicker="Act III"
  title="Inside|CERN"
  corner-tr="World of Particles"
  corner-br="III / III"
/>

---

<!-- Act III · CERN from the air (0:11) -->
<VideoPlayer src="cern_overview_short.mp4" />

---

<!-- Act III · the real LHC tunnel, travelling shot (CERN-FOOTAGE-2022-013-001, 1:30 trim) -->
<VideoPlayer src="cern_footage_2022_013_001.mp4" />

---

<!-- Act III · descending the ATLAS shaft (ATLAS-FOOTAGE-2022-004-002, 0:29, 3:2 → cover) -->
<VideoPlayer src="atlas_footage_2022_004_002.mp4" />

---

<!-- Act III · ATLAS detector overview (ATLAS-VIDEO-2021-001-001, 0:49) -->
<VideoPlayer src="atlas_video_2021_001_001.mp4" />

---

<!-- Act III · CMS (0:30) -->
<VideoPlayer src="cms.mp4" />

---

<!-- Act III · LHCb 3D fly-in, a human for scale (CERN-FOOTAGE-2022-042-001, 0:56) -->
<VideoPlayer src="cern_footage_2022_042_001.mp4" />

---

<!-- Act III · LHCb reel, with audio (0:47) -->
<VideoPlayer src="lhcb.mp4" />

---

<!-- Act III · collision burst in the beam pipe (CERN-FOOTAGE-2024-006-012, 0:27) -->
<VideoPlayer src="cern_footage_2024_006_012.mp4" />

---

<!-- Act III · a collision as data: ATLAS event display (ATLAS-VIDEO-2023-013-001, 0:30) -->
<VideoPlayer src="atlas_video_2023_013_001.mp4" />

---

<!-- Act III · the data centre and the tape robot (CERN-FOOTAGE-2022-013-006, 1:30 trim) -->
<VideoPlayer src="cern_footage_2022_013_006.mp4" />

---

<!-- Act III · the Worldwide LHC Computing Grid globe (CERN-FOOTAGE-2025-048-001, 0:23) -->
<VideoPlayer src="cern_footage_2025_048_001.mp4" />

---

<!-- Act III · the future: FCC map aerial (CERN-FOOTAGE-2024-006-001, 0:18) -->
<VideoPlayer src="cern_footage_2024_006_001.mp4" />

---

<!-- Closer · LHCb fly-through ending on "Ačiū" — thanks, in Lithuanian (2:28) -->
<VideoPlayer src="lhcb_aciu.mp4" />

---

<!-- Finale — interactive Q&A backdrop: the proton with a live collision
     tally. Click or press c: a collision erupts and a synthesised thump
     plays (only for the ones you trigger; the ambient ones stay silent). -->
<ParticleHero
  mode="proton"
  sound
  counter
  kicker="World of Particles"
  title="Ačiū"
  sub="Questions?|Press C — or click the proton — to collide"
  corner-tr="Autumn 2026"
  corner-br="Lecture 1"
/>

<!--
Speaker: Q&A. Every c / click is a collision with sound — hand the keyboard
to a student. Backup quiz cards follow (next slide onward): the room votes
by hand, 1/2/3 points at a tile, Enter reveals, r resets.
-->

---
hideInToc: true
---

<QuizCard n="1" total="9"
  q="How fast do the LHC's protons travel?"
  :options="['99 % of the speed of light', '99.9999991 % of the speed of light', 'Half the speed of light']"
  :answer="1"
  fact="At 6.5 TeV a proton is short of light speed by about 3 m/s — roughly a slow walk." />

---
hideInToc: true
---

<QuizCard n="2" total="9"
  q="The LHC ring is 27 km around. How many laps does a proton make each second?"
  :options="['About 11', 'About 11 000', 'About 11 million']"
  :answer="1"
  fact="11 245 laps a second — the proton crosses the Franco-Swiss border about 22 000 times per second." />

---
hideInToc: true
---

<QuizCard n="3" total="9"
  q="How cold are the LHC's superconducting magnets?"
  :options="['−80 °C, like a deep freezer', '1.9 K — colder than outer space', 'Room temperature; they are just big']"
  :answer="1"
  fact="Superfluid helium keeps 27 km of magnets at 1.9 K (−271 °C). The cosmic microwave background is a balmy 2.7 K." />

---
hideInToc: true
---

<QuizCard n="4" total="9"
  q="How many protons circulate in one LHC beam?"
  :options="['About 3 million', 'About 300 trillion', 'About 3 × 10²⁰']"
  :answer="1"
  fact="2 808 bunches × 1.15 × 10¹¹ protons ≈ 3 × 10¹⁴. All of them together weigh less than a grain of sand." />

---
hideInToc: true
---

<QuizCard n="5" total="9"
  q="What is inside a proton?"
  :options="['Three quarks and nothing else', 'Three valence quarks, gluons, and a sea of quark–antiquark pairs', 'Electrons packed tightly']"
  :answer="1"
  fact="The three valence quarks carry only about 1 % of the proton's mass; the rest is the energy of the gluon field binding them." />

---
hideInToc: true
---

<QuizCard n="6" total="9"
  q="How much of the universe is ordinary matter — atoms, stars, us?"
  :options="['About 5 %', 'About 27 %', 'About 68 %']"
  :answer="0"
  fact="About 5 %. Dark matter is ~27 % and dark energy ~68 % — everything the reel showed is the small slice." />

---
hideInToc: true
---

<QuizCard n="7" total="9"
  q="How hot is the quark–gluon plasma made in lead–lead collisions at the LHC?"
  :options="['About 5 500 °C, like the Sun\'s surface', 'About 5.5 million degrees', 'About 5.5 trillion degrees']"
  :answer="2"
  fact="ALICE measured about 5.5 trillion kelvin in 2012 — several hundred thousand times hotter than the centre of the Sun." />

---
hideInToc: true
---

<QuizCard n="8" total="9"
  q="When was the Higgs boson discovered?"
  :options="['1995', '2012', '2022']"
  :answer="1"
  fact="4 July 2012, announced by ATLAS and CMS at CERN — 48 years after it was predicted." />

---
hideInToc: true
---

<QuizCard n="9" total="9"
  q="When did Lithuania join CERN as an Associate Member State?"
  :options="['1954, as a founding member', '2018', 'It has not joined yet']"
  :answer="1"
  fact="8 January 2018. Lithuanian students, teachers and researchers have been at CERN ever since — some of them in this room." />
