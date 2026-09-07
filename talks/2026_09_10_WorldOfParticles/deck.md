---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
title: World of Particles
info: |
  World of Particles — opening lecture of the open course, 2026-09-10.
  A video-driven tour from the cosmos to the quantum and into CERN;
  the Yaga crash-course reel (2026-07-18) with a venue-specific opener:
  a zoom-out from the VU Faculty of Physics building into the cosmic web.
  Venue plays the 1080p H.264 web tier (post-Yaga policy).
# Slidev defaults slide 1 to the cover layout, which traps a full-bleed
# component in its bottom content strip — force the plain layout.
layout: default
---

<!-- Cover — the CERN-lessons landing hero (live particle sphere) with the
     "proton being probed" twist: beam pulses arrive along the fibers and
     collision sprays erupt from inside the sphere. Full-bleed; no h1 here.
     Doubles as the head start for the opener: VideoPlayer's look-ahead
     starts buffering the next clips while this slide is up. -->
<ParticleHero
  kicker="Dr. Mindaugas Šarpis"
  title="World of|Particles"
  sub="Opening lecture of the open course · VU Faculty of Physics|10 September 2026"
  corner-tr="Autumn 2026"
  corner-br="Lecture 1"
/>

---

<!-- Act I — From here to the cosmos: zoom-out that starts on the VU Faculty
     of Physics building (Google Earth) and ends in the cosmic web, 4:42 -->
<VideoPlayer src="vu_ff_zoom.mp4" />

---

<!-- leaving Earth: Saturn V launch (NASA archival) -->
<VideoPlayer src="saturn_v_launch_nasa.mp4" />

---

<!-- the Moon: Firefly Blue Ghost lunar orbit -->
<VideoPlayer src="blue_ghost_lunar_orbit.mp4" />

---

<!-- 1965: Mariner 4, the first data from another planet -->
<VideoPlayer src="nasa_mars_mariner_4_pan_audio.mp4" />

---

<!-- Mars: Perseverance landing -->
<VideoPlayer src="perseverence_rover_landing_nasa.mp4" />

---

<!-- Saturn: Cassini -->
<VideoPlayer src="cassini.mov" />

---

<!-- the deep universe: JWST reel -->
<VideoPlayer src="webb_reel.mp4" />

---

<!-- Big Bang: cosmic expansion funnel -->
<VideoPlayer src="expansion_funnel_h264_1080p.webm" muted />

---

<!-- the oldest light: beyond the CMB -->
<VideoPlayer src="beyond_cmb.mp4" muted />

---

<!-- the CMB as sound -->
<VideoPlayer src="cmb_sonification_drone.mp4" />

---

<!-- Act II — …to the quantum: zoom into atoms -->
<VideoPlayer src="atoms.mov"/>

---

<!-- particles made visible: cloud chamber -->
<VideoPlayer src="cloud_chamber_audio.mp4"/>

---

<!-- Act III — Inside CERN: aerial overview -->
<VideoPlayer src="cern_overview_short.mp4" />

---

<!-- the LHC tunnel (CERN-FOOTAGE-2022-013-001) -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" />

---

<!-- vacuum / beam-pipe animation (CERN-VIDEO-2019-050-008) -->
<VideoPlayer src="cern_video_2019_050_008_1080ph265.mp4" />

---

<!-- FCC map aerial (CERN-FOOTAGE-2024-006-001) -->
<VideoPlayer src="cern_footage_2024_006_001.mp4" />

---

<!-- quark-gluon plasma formation -->
<VideoPlayer src="qgp_formation.mp4" loop />

---

<!-- LHCb reel -->
<VideoPlayer src="lhcb.mp4" />

---

<!-- closing: LHCb thanks (Lithuanian) -->
<VideoPlayer src="lhcb_aciu.mov" />
