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

<Grains :set="{ jp: 1 }" />
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
  at: [1.0, 7.85, 0]
  dist: 0.8
  yaw: 6
  pitch: 1
  dim: 0
  ambient: [[0, 0.15], [6, 0]]
  path:
    - [0, { at: [0, 4.2, 0], dist: 19, yaw: 0, pitch: 3 }]
    - [3.5, { at: [1.0, 7.3, 0], dist: 5, yaw: 4, pitch: 2 }]
    - [6.5, { at: [1.0, 7.85, 0], dist: 0.8, yaw: 6, pitch: 1 }]
---

<Grains :set="{ jp: 1 }" />
<Clock off />

<!-- Station 1, the dive (0:45–1:15): into one bin, until one grain fills the frame; black. -->

<!--
Message: every point in this picture is one collision; we follow one of them.

Say: "Each grain here is one collision, one moment inside the detector. Let's
take one of them and follow it from the beginning."

The camera dives into the top of the bin at 4440 MeV, the grains part as it
passes, and the world goes black (ambient to 0). The join to the next slide
sits in that black. To come: the grain unfolds backwards into its tracks
(storyboard), once the talk's own event is extracted.

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
  cameraRate: 1
  path:
    - [0, { at: [0, -400, 0], dist: 7, yaw: 40, pitch: 5 }]
    - [4, { at: [0, -400.55, 0], dist: 5.5, yaw: 0, pitch: 4 }]
---

<Crossing name="crossing" start />
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
