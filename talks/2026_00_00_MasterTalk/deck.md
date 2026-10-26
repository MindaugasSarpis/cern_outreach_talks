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
  release: videos-2026-00-00-mastertalk
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#5b93ff'
stage:
  space: data/space.json
  plugins: [lhcb]           # LHCb's Run 3 geometry as grains (the detector), fetched from the kit's geometry-lhcb release
  palette: { base: blue, bg: '#000206' }   # a true black ground, as OpenData's
  sound: { hum: false, flight: false, clip: false }   # no hum, no transition sounds (house rule); the collision's own sound plays
  options: { reach: 30, nebula: 0.12, exposure: 1.1, vignette: 0.7, grain: 0.012, aberration: 0, bloom: 0.42 }
title: MasterTalk
info: |
  One collision, one shot: a keynote told as one continuous camera move. One
  real LHCb collision is followed through the detector, the trigger and the
  data flow to the single entry it becomes in a mass plot; the talk opens on
  the 2019 pentaquark spectrum out of focus and closes on it sharp. The
  storyboard is notes/storyboard.md (approved 18 Oct 2026).
lang: en                  # slides and notes; `pnpm talk lint` reads it
htmlAttrs:
  lang: en
duration: 40min           # provisional (26 Oct): the master deck holds every element (notes/master.md, ~40 min); venue talks are cut from it with their own duration. The Brief assumed 25; the owner decides
sources: notes
layout: cover
space:
  at: [0, 4.2, 0]
  dist: 19
  yaw: 0
  pitch: 3
  sway: 0.6
  dim: 0
  ambient: 0.15
---

<StageSteps :set="{ jp: 1, dot: 1, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- Station 0, the peak (storyboard 0:00–0:45). -->

<!--
Message: this picture is where the talk ends; for now it means nothing.

Say: "This is a picture from LHCb, the experiment I work on at CERN. By the
end of this talk you will be able to read it. Right now it is a blur, and
that is fine: we will find out what one point in it is."

The 2019 m(J/ψ p) spectrum (HEPData ins1728691, Table 2, the bins Užsikrauk
karjerai uses), its grains spread out of focus (`focus` 1), no axis, no
peaks lit, but the bins' steps and the narrow spike still show through
(`focus` 0.55). The grains fall into place as the slide opens.

(~0.75 min)
-->

---
space: { path: [[0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]], sway: 0, dim: 0, ambient: 0 }   # a cut to the takeover's pose under the clip (Karjera's): the next slide stands exactly here
---

<!-- Inherited 26 Oct from Užsikrauk karjerai (its slide 2, the newest copy): the zoom out from NFTMC in Saulėtekis past the Earth and our galaxy to the cosmic web, 49 s (Karjera's remap of Innoday's SpaceEngine edit). It ends on the frame the next slide's still is (public/figures/opener_last.jpg) and holds it; no advance-on-end. -->
<VideoPlayer src="vilnius_zoom.mp4" transition="fade" :volume="0.25" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.45" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: nftmc-opened-2016 -->

<!--
Message: where we are, then out past everything to the largest scale.
Picture: the owner's SpaceEngine zoom (Karjera's 49 s cut, stabilised): the NFTMC building in Saulėtekis, Vilnius, the Earth from space, our galaxy (a slow flight past its stars), the cosmic web, held on its last frame until the press. Its low hum at 0.25; Starfire's bed starts here.
Footage: the owner's SpaceEngine edit (Google Earth for the Earth part, its attribution in the footage); the web, NCSA's Advanced Visualization Lab ("Cosmic Bubble Bath"), credited on the last slide.

(~0.1 min: the clip runs 49 s)
-->

---
space:
  dim: 0
  sway: 0
  hum: false
  ambient: 0
  cameraRate: [[0, 0], [4, 0], [6, 1]]   # still for the dissolve (WebTakeover restarts this when it places the grains), then into the path
  path:   # Karjera's flight through the web in depth (24 Oct), 23 s, back to the picture's own viewpoint
    - [0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]
    - [5.5, { at: [30.6, 40.8, -86], dist: 40, yaw: 30, pitch: 10 }]
    - [9.5, { at: [30.6, 40.8, -86], dist: 30, yaw: 70, pitch: 4 }]
    - [13.5, { at: [10, 36, -112], dist: 34.5, yaw: 60.5, pitch: 2.5 }]
    - [17.5, { at: [-10, 38, -128], dist: 33, yaw: 61.4, pitch: -6.8 }]
    - [23, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]
    - [46, { at: [30, 40, -70], dist: 19.5, yaw: 0, pitch: 0 }]
---

<!-- Karjera's slide 3 with fewer grains: 220 000 in the frame and 300 000 round it (360 000 and 380 000 there, 740 000 in all; the MasterTalk keeps every slide under ~600 000 since Karjera's finale went white on the owner's M2), a little more gain for the light they lose. -->
<WebTakeover :grains="220000" :cosmos="300000" :gain="2.0" :cosmos-gain="2.6" :size="0.48" :cosmos-size="1.55" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: cosmic-web-simulation-filaments-voids -->

<!--
Message: the Universe at its largest scale, as a picture that breaks into grains.
Picture: the zoom's own last frame as a still, so the cut from the clip does not show; its dark lets go and its filaments break into grains (3 s), each on its pixel's line of sight; then the camera turns and flies through the web in depth and comes back to the picture's viewpoint. The grains make the funnel on the next step.
The picture: a cosmological simulation's visualisation (NCSA Advanced Visualization Lab, "Cosmic Bubble Bath", NSF), as Innoday and Karjera credit it.

(~0.5 min)
-->

---
space:
  dim: 0
  ambient: 0
  path:   # Karjera's slide 4 (24 Oct): held down the funnel's axis while the web's grains fly in, then out to the side and in low beside it
    - [1, { at: [30, 40, -70], dist: 19.5, yaw: 0, pitch: 0 }]
    - [4.4, { at: [30, 40, -70], dist: 21, yaw: 0, pitch: 0 }]
    - [8.5, { at: [30, 40, -116], dist: 50, yaw: -58, pitch: 12 }]
    - [16, { at: [30, 39.3, -120.5], dist: 23.5, yaw: -78, pitch: 7 }]
---

<AfterFlight :delay="9"><div class="nums" style="--d1: 0s"><p><b>13 800 000 000</b><span>years</span></p></div></AfterFlight>
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: universe-age-planck-2018, cmb-oldest-light-planck-2018, cmb-formed-380000-years-esa, atom-nucleus-protons-neutrons, proton-neutron-three-quarks, lhcb-pentaquark-2015 -->

<!--
Message: the funnel is the Universe's 13.8-billion-year history; everything in it is made of atoms, their nuclei of protons and neutrons, each of three quarks; the peak on the cover is where particles of five quarks showed up.
Picture: Innoday's funnel as Karjera last cut it: the web's grains fly into the funnel's shape (4.4 s), then the funnel's own grains and the CMB disk resolve over them and its mesh comes in; the Big Bang at the narrow end, the Planck disk, the dark ages, the first galaxies, today at the mouth. "13 800 000 000 years" (written out, as the deck's other numbers) once the funnel stands (9 s). Shown on this slide only: the peak's slides look towards it.
Sources: Planck 2018 results VI, A&A 641, A6 (13.787 ± 0.020 billion years); the CMB picture: Planck 2018 SMICA-noSZ map, ESA and the Planck Collaboration, CC BY-NC 3.0 IGO (reprojected, smoothed, recoloured), credited on the last slide.

(~0.6 min)
-->

---
space:
  at: [0.754, 7.17, 0]
  dist: 4
  yaw: 6
  pitch: 1
  dim: 0
  ambient: [[0, 0.15], [6, 0.12], [7.5, 0]]
  path:
    - [0, { at: [0, 4.2, 0], dist: 19, yaw: 0, pitch: 3 }]
    - [3.5, { at: [0.754, 6.9, 0], dist: 5, yaw: 4, pitch: 2 }]
    - [7, { at: [0.754, 7.17, 0], dist: 4, yaw: 6, pitch: 1 }]
---

<StageSteps :set="{ jp: 1, dot: 1, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- Station 1, the dive (0:45–1:15): into one bin, until one grain fills the frame; black. -->

<!--
Message: every point in this picture is one collision; we follow one of them.

Say: "Each grain here is one collision, one moment inside the detector. Let's
take one of them and follow it from the beginning."

The camera dives into the top of the bin at 4440 MeV, toward the one white
grain there (`dot`, the talk's own collision: m(J/ψ p̄) 4437.5 MeV), and
stops 4 units from it: the white dot stands among its bin's blue grains, so it
reads as one of them. The ambient world goes black; the join to the next slide
is the fade. To come: the grain unfolds backwards
into its tracks (storyboard).

(~0.5 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- Inherited 26 Oct from Karjera (its slides 5–7, as OpenData's way in): CERN from above, the library clip cern_overview_short.mp4 (11 s, no sound), the LHC ring drawn over the fields. At the press after its end the camera pushes on into the ring, where the tunnel follows. -->
<VideoPlayer src="cern_overview_short.mp4" exit="push" exit-at="0.72,0.45" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: cern-largest-particle-physics-lab, lhc-geneva-27km-100m-four-experiments -->

<!--
Message: where that one point came from: CERN near Geneva, and 100 m under its fields the 27 km ring.
Picture: CERN from above (11 s), the LHC ring drawn over the fields with its four experiments named; it holds its last frame; at the press the camera pushes into the ring.
Sources: home.cern, "The Large Hadron Collider".

(~0.1 min: the clip runs 11 s)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The real LHC tunnel, CERN-FOOTAGE-2022-013-001, Karjera's 18 s cut (videos/manifest.toml), muted under the music (Karjera, 25 Oct). At the press after its end it pushes on into the magnet. -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" muted exit="push" exit-at="0.45,0.53" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<div class="nums scrim" style="--d1: 1.6s">   <!-- the scrim: the tunnel wall behind the number is pale concrete (review 26 Oct) -->
  <p><b>27</b><span>km</span></p>
</div>

<!-- facts: lhc-geneva-27km-100m-four-experiments, cern-lhc-speed, cern-lhc-collisions, lhc-ls3-restart-2028 -->

<!--
Message: the LHC's ring, 27 km round, 100 m under the border; when it runs, protons fly in it at almost the speed of light.
Picture: the real tunnel, the magnets on the right, "27 km" low on the left. At the press after its end the camera goes on into the magnet. Tense: the LHC is in Long Shutdown 3 since 29 June 2026, back in 2028.
Source: CERN-FOOTAGE-2022-013-001 (CERN); home.cern.

(~0.1 min: the clip runs 18 s)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The LHC dipole, CERN-VIDEO-2019-050-008, Karjera's first 10.8 s (videos/manifest.toml): a cutaway of the blue cryostat into the two beam pipes, its small English/French labels kept. Silent. It lands where the tunnel's push went in; the beam pipe follows. -->
<VideoPlayer src="cern_video_2019_050_008.mp4" muted :controls="false" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: lhc-two-beam-pipes-opposite, cern-lhc-magnets, cern-lhc-cold -->

<!--
Message: inside the ring two beams fly in opposite directions in two pipes; 1 232 superconducting dipoles bend them round at −271 °C.
Picture: CERN's animation of an LHC dipole: the cryostat cut open, then the two beam pipes (10.8 s, silent). The beam pipe station follows, inside one of them.
Sources: home.cern, "The Large Hadron Collider"; CERN-VIDEO-2019-050-008 (CERN).

(~0.15 min: the clip runs 10.8 s)
-->

---
space:
  at: [0, -400.55, 0]
  dist: 5.5
  yaw: 0
  pitch: 4
  dim: 0
  ambient: 0
  hum: false
  rate: [[0, 1.4], [1.78, 1.4], [2.58, 0]]
  cameraRate: [[0, 1], [4.5, 1], [5, 0]]   # the camera stops once its path has landed: world and camera still, the hold the numbers are read in
  path:
    - [0, { at: [0, -400, 0], dist: 7, yaw: 40, pitch: 5 }]
    - [4, { at: [0, -400.55, 0], dist: 5.5, yaw: 0, pitch: 4 }]
---

<Crossing name="crossing" start />
<StageSteps :set="{ dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock :from="-25" unit="ns" />

<div class="nums" style="--d1: 4.5s; --d2: 5.7s; --d3: 6.9s">
  <p><b>25</b><span>ns</span></p>
  <p><b>2 500</b><span>bunches</span></p>
  <p><b>160 000 000 000</b><span>protons</span></p>
</div>

<!-- facts: cern-lhc-collisions, lhc-bunch-milky-way -->

<!--
Message: protons travel in bunches, and the bunches meet every 25 ns.

Say: "We start inside the beam pipe of the LHC. The protons travel in
bunches: about 2 500 of them in each beam, and up to 160 billion protons in
each bunch. Two bunches meet in the middle of LHCb every 25 nanoseconds.
The clock in the corner is our time: 25 nanoseconds before the crossing."

The two bunches run in from both ends of the pipe and stop (rate 0) about
10 m apart, a little before they meet; the camera settles square to the beam
line, the pipe across the frame, and the three numbers come up while it
holds.

Sources: home.cern, "The Large Hadron Collider" (about 2 500 bunches per beam,
up to 1.6×10¹¹ protons per bunch, 25 ns apart).

(~1.75 min)
-->

---
space:
  at: [3.4, -400.9, 0]
  dist: 8.4
  yaw: -32
  pitch: 13
  dim: 0
  ambient: 0
  hum: false
  rate: [[0, 0.35], [0.7, 0.35], [1.5, 0.03], [5, 0.03], [5.8, 2.2], [8.5, 1]]
  cameraRate: 1
  path:
    - [0, { at: [0, -400.55, 0], dist: 5.5, yaw: 0, pitch: 4 }]
    - [1.5, { at: [0, -400, 0], dist: 2.3, yaw: 16, pitch: 6 }]
    - [5, { at: [0, -400, 0], dist: 2.0, yaw: -24, pitch: 13 }]
    - [7.5, { at: [2.4, -400.6, 0], dist: 6.0, yaw: -30, pitch: 12 }]
    - [10, { at: [3.4, -400.9, 0], dist: 8.4, yaw: -32, pitch: 13 }]
---

<Crossing name="crossing" :lead="3.05" />
<StageSteps :set="{ dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock :keys="[[0, -25], [1.5, 0], [5.8, 0], [8.5, 63]]" unit="ns" />

<div class="nums" style="--d1: 10.5s; --d2: 11.7s">
  <p><b>65</b><span>particles</span></p>
  <p><b>30 000 000</b><span>crossings/s</span></p>
</div>

<!-- facts: lhcb-hlt1-30mhz, lhcb-muon-m5-18p8m -->

<!--
Message: this is our collision: 65 particles fly out of it, and crossings
like it happen thirty million times a second.

Say: "Here they cross. The world almost stops, so we can look. This is a
real collision, recorded by LHCb on 29 July 2012. Sixty-five particles fly
out of it, through the whole detector. Four of them matter to us, and we
will follow them. The fastest of it reaches the far
end, nearly 19 metres away, in 63 nanoseconds. This happens thirty million times
every second."

Bullet time at the crossing (rate 0.03, the camera orbiting on its own
clock), then the fly-out. The clock runs from −25 ns to 0 at the crossing,
holds in the freeze, and counts to 63 ns as the debris reaches the last muon
station (18.8 m, light time).

The event: CERN Open Data record 28040 (LHCb 2012, 8 TeV, magnet down,
DIMUON stream, CC0), run 124143, event 39463039, 29 July 2012, 03:10:40 UTC;
one collision, 92 reconstructed tracks, 65 of them good (ghost probability
≤ 0.4; the number on screen, as the opening counts). It holds an anti-Λb⁰ →
J/ψ(μ⁺μ⁻) p̄ K⁺ candidate (our own selection on the stripping's detached J/ψ:
m(J/ψ p̄ K⁺) 5628 MeV, m(J/ψ p̄) 4437.5 MeV, a 3.6 mm flight). A candidate,
not a certain Λb⁰: about half of the candidates in its mass window are
random combinations. In 2012 a crossing held fewer collisions than today
(Run 3: about five).

Sources: CERN Open Data record 28040 (the event); LHCb Starterkit, Run 3
data flow (30 MHz of non-empty crossings); X. Cid
Vidal for LHCb, arXiv:1005.2585 (M5 at 18.8 m; kept in Upgrade I,
arXiv:2305.10515).

(~1.75 min)
-->

---
space:
  at: [4.0, -400.8, 0]
  dist: 19
  yaw: -20
  pitch: 12
  dim: 0
  ambient: 0
  hum: false
  path:
    - [0, { at: [3.4, -400.9, 0], dist: 8.4, yaw: -32, pitch: 13 }]
    - [7, { at: [4.0, -400.8, 0], dist: 19, yaw: -20, pitch: 12 }]
---

<Crossing name="crossing" :lead="40" />
<StageSteps :set="{ dot: 0, det: 1, data: 0, grid: 0 }" />
<Clock :from="63" unit="ns" />

<div class="nums" style="--d1: 7.5s; --d2: 8.7s">
  <p><b>5.1</b><span>mm</span></p>
  <p><b>11 000</b><span>km</span></p>
</div>

<!-- facts: lhcb-velo-distance, lhcb-scifi, lhcb-muon-m5-18p8m -->

<!--
Station 4, the detector (storyboard 4:45–7:15).

Message: the particles have crossed a whole detector in 63 nanoseconds, and
every layer of it measured them.

Say: "In those 63 nanoseconds our particles crossed LHCb, all twenty metres
of it. First the VELO: silicon sensors just 5.1 millimetres from the beams,
which see where each particle was born. Then the magnet, which bends them so
we can weigh them, and the tracker behind it, built from more than 11 000
kilometres of plastic fibre. Then the calorimeters stop most of them, and only
the muons reach the last walls, nineteen metres out."

The detector is LHCb's real Run 3 geometry (the kit's lhcb plugin, `src:
lhcb`: grains baked from HSF Phoenix's LHCb.glb, from LHCb's DD4hep
description, fetched from slidev-videos' geometry-lhcb release), drawn
stretched across the beam as the event is (2.4×, as LHCb's event displays
do). It lights up behind a front that runs from the vertex to the last muon
station. The clock holds at 63 ns, the light time to M5.

Sources: LHCb VELO Upgrade (5.1 mm, lhcb-velo-distance); LHCb SciFi (over
11 000 km of fibre, lhcb-scifi); X. Cid Vidal for LHCb, arXiv:1005.2585 (M5
at 18.8 m).

(~2.5 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- Part II's people (master.md 12): the LHCb reel, Karjera's and OpenData's cut of the library's lhcb.mp4 (39 s, its own music): from the shafts above the cavern down to the detector. No advance-on-end. -->
<VideoPlayer src="lhcb.mp4" :volume="0.7" />
<StageSteps :set="{ dot: 0, det: 1, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: lhcb-100m-below-ground -->

<!--
Message: the detector the collision just crossed, and the people who built it and run it.
Picture: the LHCb reel (39 s, music), from the shafts down to the detector in its cavern; the speaker names the collaboration over it. The world rests at the crossing behind the clip; the readout station follows.
Source: the library's lhcb.mp4 (CERN), cut as OpenData's and Karjera's.

(~0.1 min: the clip runs 39 s)
-->

---
space:
  at: [12, -402, 0]
  dist: 17
  yaw: -42
  pitch: 10
  dim: 0
  ambient: 0
  hum: false
  path:
    - [0, { at: [4.0, -400.8, 0], dist: 19, yaw: -20, pitch: 12 }]
    - [3, { at: [5.5, -400, 0], dist: 17, yaw: -24, pitch: 11 }]
    - [9, { at: [12, -402, 0], dist: 17, yaw: -42, pitch: 10 }]
---

<Crossing name="crossing" :lead="40" />
<StageSteps :set="{ dot: 0, det: 2, data: 1, grid: 0 }" />
<Clock :from="1" :to="900" :run="105" unit="µs" />

<div class="nums" style="--d1: 9.5s; --d2: 10.7s">
  <p><b>4</b><span>TB/s</span></p>
  <p><b>3</b><span>%</span></p>
</div>

<!-- facts: lhcb-run3-readout-4tbs, internet-intl-bandwidth-2022 -->

<!--
Station 5, the readout (7:15–9:00): hits become bytes.

Message: every crossing is read out whole, and that is a flood of data.

Say: "Every place a particle touched is now a number. LHCb reads out the
whole detector for every crossing, thirty million times a second: about four
terabytes every second. That is about three percent of all the internet
traffic that crosses the world's borders, from one experiment."

The grains our tracks passed through (its hits) turn white, the rest of the
detector dims, and the hits leave downstream; the stream of crossings starts.
The clock runs on in µs without stopping on a value: no public source gives
the readout's latency (storyboard, "The clock").

Sources: arXiv:2105.04031 (4 TB/s average in Run 3); TeleGeography 2022
(997 Tbps of international bandwidth: 4 TB/s is 32 Tbps, about 3 %).

(~1.75 min)
-->

---
space:
  at: [30, -401.5, 0]
  dist: 10
  yaw: -35
  pitch: 8
  dim: 0
  ambient: 0
  hum: false
  path:
    - [0, { at: [12, -402, 0], dist: 17, yaw: -42, pitch: 10 }]
    - [4, { at: [30, -401.5, 0], dist: 10, yaw: -35, pitch: 8 }]
---

<StageSteps :set="{ dot: 0, det: 0, data: 2, grid: 0 }" />
<Clock :from="1" :to="900" :run="120" unit="ms" />

<div class="nums" style="--d1: 5.5s; --d2: 6.7s">
  <p><b>500</b><span>GPUs</span></p>
  <p><b>30 → 1</b><span>MHz</span></p>
</div>

<!-- facts: lhcb-hlt1-500-cards-89khz, lhcb-run3-hlt1-1mhz-out, lhcb-hlt1-30mhz -->

<!--
Station 6, HLT1, cut one (9:00–11:00).

Message: the first cut keeps one crossing in thirty, and ours survives.

Say: "Nobody can store that. So the first filter runs on about five hundred
graphics cards, the same chips as in a gaming PC, and looks at every crossing
in real time. Of thirty million a second, it keeps about one million. Ours is
one of them."

The trigger's gesture, the first of three: at the gate the crossings burst
into dust, about one in thirty passes, and ours (the white packet) stays lit
just past it. The clock runs on in ms without stopping on a value.

Sources: arXiv:2606.14480 (about 500 GPU cards in HLT1); arXiv:2408.03881
(HLT1 output about 1 MHz); LHCb Starterkit (30 MHz of non-empty crossings).

(~2 min)
-->

---
space:
  at: [56.5, -401.5, 0]
  dist: 17
  yaw: -40
  pitch: 12
  dim: 0
  ambient: 0
  hum: false
  path:
    - [0, { at: [30, -401.5, 0], dist: 10, yaw: -35, pitch: 8 }]
    - [5, { at: [56.5, -401.5, 0], dist: 17, yaw: -40, pitch: 12 }]
---

<StageSteps :set="{ dot: 0, det: 0, data: 3, grid: 0 }" />
<Clock :from="1" :to="48" :run="110" unit="h" />

<div class="nums" style="--d1: 6s; --d2: 7.2s; --d3: 8.4s">
  <p><b>30</b><span>PB</span></p>
  <p><b>10</b><span>GB/s</span></p>
  <p><b>1/500</b><span>bytes</span></p>
</div>

<!-- facts: lhcb-trigger-5tbs-10gbs, lhcb-buffer-80-hours, lhcb-upgrade1-trigger -->

<!--
Station 7, the buffer and HLT2, cut two (11:00–13:00): the same gesture.

Message: the survivors wait on disk while the detector is calibrated, then a
second, slower cut decides; one byte in five hundred is kept.

Say: "What survives waits in a buffer of thirty petabytes of disk, for hours,
sometimes days, while we calibrate the detector precisely. Then the second
filter looks at each crossing in full detail. In the end LHCb writes about ten
gigabytes a second to storage: of every five hundred bytes the detector
produced, one is kept. Ours, again, is that one."

The disc round the lane is the disk buffer; the second gate is the same
gesture as the first. The clock turns to hours: the final decision comes
hours to days later (the buffer could hold about 80 hours at 1 MHz: a
capacity, not a wait).

Sources: arXiv:2412.05041 (30 PB buffer, 10 GB/s to storage, one byte in
500; hours to days); arXiv:2305.10515 (80 hours at 1 MHz).

(~2 min)
-->

---
clicks: 2
space:
  at: [118, -404.5, 0]
  dist: 30
  yaw: -30
  pitch: 18
  dim: 0
  ambient: 0.06
  hum: false
  path:
    - [0, { at: [56.5, -401.5, 0], dist: 17, yaw: -40, pitch: 12 }]
    - [3.5, { at: [95, -400, 0], dist: 12, yaw: -36, pitch: 12 }]
    - [8, { at: [118, -404.5, 0], dist: 30, yaw: -30, pitch: 18 }]
---

<StageSteps :set="{ dot: 0, det: 0, data: 4, grid: 1 }" :clicks="{ 1: { grid: 2 }, 2: { grid: 3 } }" />
<Clock :keys="[[0, 0], [25, 11]]" unit="years" />

<div class="nums" style="--d1: 8.5s; --d2: 0.4s; --d3: 0.4s">
  <p><b>1</b><span>EB</span></p>
  <p v-click="1"><b>42</b><span>countries</span></p>
  <p v-click="2"><b>100 000</b><span>files</span></p>
</div>

<!-- facts: cern-exabyte, cern-wlcg, lhcb-open-data, lhcb-run1-release-sarpis, sarpis-interview-run1-1-5-years, lhcb-run1-volume-sources-differ -->

<!--
Station 8, the data centre, the grid and the open data (13:00–15:30).

Message: the kept data are stored for decades, shared across the world, and
then opened to everyone; Vilnius did that last step.

Say: "The data that survive go to CERN's data centre. In December last year
CERN passed one exabyte of stored data, a million terabytes, mostly on
magnetic tape. [click] From there they go out to the computing grid: more than
170 sites in 42 countries share the work. [click] And then, years later, the
data are opened to anyone. Our collision was recorded in 2012. Here in
Vilnius we prepared LHCb's whole Run 1 data for release: more than a hundred
thousand files, found, checked and copied one by one, a year and a half of
work. In December 2023 it went public, and our collision with it."

The store gathers as the stream ends in it; click 1: the 42 sites and their
threads; click 2: the thread to Vilnius turns white. The clock turns to years:
recorded 2012, released 2023 (11 years). "1 EB" is all of CERN's stored LHC
data, not LHCb's alone. The open-data volume differs by source (800 TB
official, over 1 PB with everything, 100 000+ files): the screen shows the
files.

Sources: home.cern, December 2025 (one exabyte); WLCG (170 sites, 42
countries); Vilnius University (Run 1 release: over 100 000 files);
VU Library interview, 5 March 2026 (a year and a half).

(~2.5 min)
-->

---
space: { at: [1500, 2.4, 0], dist: 19.8, yaw: 0, pitch: 3, sway: 0.4, dim: 0.05, ambient: 0 }   # Karjera's trial slide (24 Oct, before it was cut there for time), its pose
clicks: 2
---

<!-- Part IV's "how you know" (master.md 20), from Užsikrauk karjerai's history (8f8eef8^, its slide 11): 140 dots in four days make a bump (th1); click 1 lights its bin; click 2, 3 500 dots in 100 days (th2): the bump is gone. In the master's blues. -->
<StageSteps :set="{ th1: 1, th2: 0, dot: 0, det: 0, data: 0, grid: 0 }" :clicks="{ 1: { th1: 2 }, 2: { th1: 0, th2: 1 } }" />
<Clock off />

<AfterFlight :delay="4.6"><div v-click.hide="2" class="nums" style="--d1: 0s"><p><FillClock name="th1" :to="4" unit="day,days" :fill="7" /></p></div></AfterFlight>
<div v-click="2" class="nums" style="--d1: 0.6s"><p><FillClock name="th2" :to="100" unit="day,days" :at="2" :delay="0.6" :fill="12" /></p></div>

<!-- facts: particle-decay-reconstructed-mass, theta-toy-140-entries, chance-bumps-shrink-with-data, poisson-fluctuation-sqrt-n, theta-plus-2003-false-alarm, theta-plus-leps-japan-19-events, theta-plus-clas-2006-null -->

<!--
Message: how you know you have found something: a bump in four days of data can be chance; with a hundred days a chance bump goes away and a real one stays. The audience judges the first plot before the second.
Picture: a toy mass plot fills grain by grain as its days tick (140 entries, 4 days); click 1 lights the bump's bin; click 2 empties it and a second plot fills with 3 500 entries in 100 days, flat where the bump was. The toy is shaped on the Θ⁺ of 2003 (LEPS, 19 events), which later data (CLAS, 2006) did not confirm.
Sources: the facts above (Karjera's notes hold the toy's construction).

(~1.6 min)
-->

---
space:
  at: [-6.4, 4.44, 0]
  dist: 23
  yaw: 0
  pitch: 2
  dim: 0
  ambient: [[0, 0], [3, 0.15]]
---

<StageSteps :set="{ jp: 1, dot: 2, det: 0, data: 0, grid: 3 }" />
<Clock :keys="[[0, 11], [6, 14]]" unit="years" />

<div class="nums" style="--d1: 6.5s; --d2: 7.7s">
  <p><b>16 400</b><span>Λb⁰</span></p>
  <p><b>4 437.5</b><span>MeV</span></p>
</div>

<!-- facts: stonkus-bsc-2026-yield -->

<!--
Station 9, cut three, the analysis (15:30–18:00).

Message: a student in Vilnius ran the last cut on the open data, and our
collision is one dot in his plot.

Say: "This year Dominykas Stonkus, a student in our group, made the last cut
himself, on the open data, for his bachelor thesis. Out of all those
collisions he kept about 16 400 in which a Λb⁰ particle decayed the way we
want. Each of them becomes one dot. Ours lands here, at 4437 and a half MeV.
Fourteen years after it happened."

The dot falls into its bin of the spectrum (still out of focus). The clock
counts 11 → 14 years (2012 → 2026) and stops as the dot lands.

Caveats, said once if asked: the plot on screen is the 2019 spectrum (246 000
Λb⁰, next slide), the thesis's 16 400 are from 2012 open data alone. Our
collision is a candidate from our own selection, like the thesis's (not yet
matched against its list: run 124143, event 39463039), and about half the
candidates at its mass are random combinations. To come: the thesis's own
Λb⁰ mass peak, with the dot landing in it (needs the thesis's data and the
author's agreement).

Sources: D. Stonkus, VU bachelor thesis 2026 (N_sig = 16 406.6 ± 161.7);
CERN Open Data record 28040 (the event: m(J/ψ p̄) = 4437.5 MeV).

(~2.5 min)
-->

---
space:
  at: [-6.4, 4.44, 0]
  dist: 23
  yaw: 0
  pitch: 2
  dim: 0
  ambient: 0.15
---

<StageSteps :set="{ jp: 2, dot: 1, det: 0, data: 0, grid: 0 }" />
<Clock off />

<div class="nums" style="--d1: 7s; --d2: 8.2s">
  <p><b>246 000</b><span>Λb⁰</span></p>
  <p><b>7.3</b><span>σ</span></p>
</div>

<!-- facts: lhcb-pentaquark-2019-yield, lhcb-pentaquark-2019 -->

<!--
Station 10, the peak, now sharp (18:00–21:00): station 0's frame, in focus.

Message: now you can read the picture we started with: a new particle, a
pentaquark, found in a quarter of a million collisions like ours.

Say: "Now look again at the picture we started with. Every dot is one
collision like ours, 246 000 of them. Where the dots pile up higher than they
should, nature made something: a particle of five quarks, a pentaquark. The
narrow peak on the left was found in 2019 at 7.3 sigma: the chance that it is
a fluke is less than one in a trillion. And our dot sits right in the middle
of the other two."

The same object and the same frame as station 9 (the plot right of the
numbers): the grains pull into focus, the axis lights,
and the three peaks get their ticks (Pc(4312), Pc(4440), Pc(4457)); the white
dot stays in its bin by Pc(4440).

Sources: LHCb, arXiv:1904.03947 (246 000 Λb⁰ → J/ψ p K⁻; Pc(4312)⁺ at 7.3σ);
HEPData ins1728691 (the spectrum's bins).

(~3 min)
-->

---
space:
  at: [0, 4.2, 0]
  dist: 52
  yaw: 18
  pitch: 10
  dim: 0
  ambient: [[0, 0.15], [8, 0.45]]
  path:
    - [0, { at: [-6.4, 4.44, 0], dist: 23, yaw: 0, pitch: 2 }]
    - [14, { at: [0, 4.2, 0], dist: 52, yaw: 18, pitch: 10 }]
---

<StageSteps :set="{ jp: 2, dot: 1, det: 0, data: 0, grid: 0 }" />
<Clock off />


<!--
Station 11, the pull-back (21:00–23:30).

Message: one collision, followed for fourteen years and through three
countries' worth of machines, ends as one dot in a discovery, and the last
steps were taken here, in Vilnius.

Say: "So that is the life of one collision. Twenty-five nanoseconds before
it, two bunches of protons. Sixty-three nanoseconds after it, a whole detector
lit. Then three cuts, a million terabytes, forty-two countries, and fourteen
years later one dot in a plot that a student made here in Vilnius, from data
anyone can download. Thank you."

The camera pulls back from the plot, the world comes up round it. To come:
the whole route behind (the detector, the stream, the grid), and faces from
the group if they agree (storyboard, "For the owner to judge").

Sources: those of stations 2–10 (the numbers said here are theirs).

(~2.5 min)
-->

---
space: { at: [0, 4.2, 0], dist: 52, yaw: 18, pitch: 10, dim: 0, ambient: 0 }   # the pull-back's last pose, resting under the clip
---

<!-- Part V's flag (master.md 27): the library's lis_flag.mp4 (Innoday's render, 20 s, silent): the whole SciFi module, its cold box with the light injection system, a laser writing the Lithuanian flag. The recorded close follows it once v0.11's recorded mode is out (the Scheduler, 27 Oct). -->
<VideoPlayer src="lis_flag.mp4" muted :controls="false" transition="fade" />
<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<!-- facts: lhcb-scifi, lhcb-scifi-lis, lhcb-vilnius-scifi-lis -->

<!--
Message: the part of LHCb the group in Vilnius works on: the SciFi tracker's light injection system.
Picture: a Blender render after the SciFi drawing (not a photograph): the module panning down, the cold box outlined (~7 s), the flag written on it (12–17.6 s), held on its last frame.
Source: Innoday's notes (lis_flag.mp4 in its manifest).

(~0.4 min)
-->

---
class: credits-page
space: { at: [0, 4.2, 0], dist: 52, yaw: 18, pitch: 10, dim: 0.7, ambient: 0 }
---

<StageSteps :set="{ jp: 0, dot: 0, det: 0, data: 0, grid: 0 }" />
<Clock off />

<div class="credits credit">
  LHCb geometry: LHCb Collaboration, DD4hep (GPL-3.0), via HSF Phoenix (Apache-2.0) ·
  the collision: CERN Open Data, LHCb 2012 (CC0) · the spectrum: LHCb, HEPData ins1728691 ·
  Planck CMB map: ESA and the Planck Collaboration, CC BY-NC 3.0 IGO (reprojected, smoothed, recoloured) ·
  cosmic web: NCSA Advanced Visualization Lab ("Cosmic Bubble Bath", NSF) · Earth imagery: Google Earth ·
  music: Scott Buckley, "Starfire" (scottbuckley.com.au), CC BY 4.0 (sections joined)
</div>

<!--
The licence credits, kept on a page of their own after the close (as Innoday and Karjera do); not shown in the room.

(~0 min)
-->
