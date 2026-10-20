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
duration: 25min
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

<Crossing name="crossing" />
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

<Crossing name="crossing" />
<StageSteps :set="{ dot: 0, det: 1, data: 0, grid: 0 }" />
<Clock :from="63" unit="ns" />

<div class="nums" style="--d1: 7.5s; --d2: 8.7s">
  <p><b>5.1</b><span>mm</span></p>
  <p><b>11 000</b><span>km of fibre</span></p>
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

<Crossing name="crossing" />
<StageSteps :set="{ dot: 0, det: 2, data: 1, grid: 0 }" />
<Clock :from="1" :to="900" :run="105" unit="µs" />

<div class="nums" style="--d1: 9.5s; --d2: 10.7s">
  <p><b>4</b><span>TB/s</span></p>
  <p><b>3 %</b><span>of the internet</span></p>
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
  <p><b>1 in 500</b><span>bytes kept</span></p>
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

<div class="credits credit">
  LHCb geometry: LHCb Collaboration, DD4hep (GPL-3.0), via HSF Phoenix (Apache-2.0) ·
  the collision: CERN Open Data, LHCb 2012 (CC0) · the spectrum: LHCb, HEPData ins1728691
</div>

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
