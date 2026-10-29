---
# cover: a 9 s cold open from far out into LHCb; the bunches meet as the camera lands, the world drops into bullet time, the plain title rises with the crossing
theme: ../../theme
colorSchema: dark
transition: dust
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-00-00-data1trigger
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  plugins: [lhcb]
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }
  options: { aberration: 0 }   # tick numbers and labels are world sprites: no colour fringes
title: The trigger
info: |
  Talk 1 of 5 of "Data analysis, the CERN way". A collision becomes data: bunches
  crossed every 25 ns, 40 million crossing slots a second, and reading every crossing
  out whole made 4 TB a second, 345.6 PB a day. Two filters kept about 1 byte in 400
  (864 TB a day); a kept crossing becomes a row of numbers, and the rows a pile of
  91 583 candidates. Opens on a real 2012 crossing (talk 5's last frame) and closes on
  talk 2's first (the settled pile). Pictures and numbers on screen; sources in the notes.
lang: en
htmlAttrs:
  lang: en
duration: 15min
onscreen: numbers
sources: notes
layout: cover
space:
  dim: 0
  sway: 0.5
  ambient: [[0, 0.35], [7, 0.1], [9, 0]]   # the dust gives the fly-in its speed; the crossing lands on black
  rate: [[0, 1], [8.6, 1], [9.2, 0.02]]    # bullet time from the crossing on
  cameraRate: 1                            # the camera keeps moving while the world freezes
  path:
    - [0, { at: [40, 12, -30], dist: 260, yaw: -70, pitch: 25 }]
    - [5, { at: [6, 1, 0], dist: 60, yaw: -40, pitch: 16 }]
    - [9, { at: [-1.5, 1.4, 0], dist: 12, yaw: -24, pitch: 10 }]   # the landing, the crossing right of the title (T5's close cranes back to it)
steps: { det: 1, glow: 0, trg: 0, lane: 0, s1: 1, g1: 0, tb: 0, g2: 0, heap: 0, s2: 0 }
---

<!-- The collision starts when this slide opens; its bunches meet 8.3 s in (space.json approach), as the path lands. -->
<Crossing />

# The trigger

<!-- facts: record24506-licence, lhc-bunch-spacing-25ns, lhcb-run3-readout-4tbs, lhcb-upgrade1-trigger -->

<!--
Message: Each bunch crossing is read out whole by the detector, like one frame from a camera.
Picture: The tracks are one real crossing that LHCb recorded in 2012. Each line is a track: the path of one charged particle, rebuilt from the hits it left in the detector. The grains round it are the LHCb detector. The white point with its ring marks one crossing that we follow through the filters; it stands in for any crossing.
Caveats:
- This crossing is not the crossing whose row closes the talk (slide 13). That row comes from a different crossing, recorded in 2011-12. No slide may say they are the same, and this crossing shows no numbers.
- It is a 2012 crossing drawn in the detector as rebuilt for the run that began in 2022.
- The world is slowed to a fiftieth after the bunches meet: the tracks grow out of the collision point while the slide is up.
Sources: CERN Open Data record 24506 (CC0); components/lhc-opening/README.md; LHCb, arXiv:2106.07701 ("reading out the full detector for every bunch crossing"); arXiv:2305.10515; the LHCb detector geometry (GPL-3.0 / Apache-2.0, credited on slide 14).
(~1.2 min)
-->

---
# fronts: one light-blue front a crossing runs down the detector; the cover's crossing has faded with the cover
space: { at: [5, 0.4, 0], dist: 17, yaw: -30, pitch: 9, dim: 0, ambient: 0, sway: 0.4 }   # dim 0 as on the cover: a 0.2 scrim snapped on at the cut (motion review)
steps: { det: 1, glow: 1, s1: 0 }
---

<!-- dk-glow step 1: fronts at 0.6 a second (f0), stylised -->

<div class="nums" style="--d1: 2.5s">
  <p><b>25</b><span class="unit">ns</span></p>
</div>

<!-- facts: lhc-bunch-spacing-25ns, lhc-crossing-40mhz, lhc-ls3-restart-2028 -->

<!--
Message: Bunches crossed at LHCb every 25 ns, and each crossing was a fresh picture of the whole detector.
Picture: Each front of light running down the detector is one crossing. The fronts are slowed about 7 × 10⁷ times, one every 1.7 s instead of one every 25 ns: 25 ns cannot be drawn.
Caveats:
- The fronts are stylised at 0.6 a second: 1 / 0.6 s ÷ 25 ns = 6.7 × 10⁷.
- 25 ns between bunches is about 7 m along the ring.
- Past tense: the LHC stopped in June 2026 for its long shutdown.
Sources: home.cern, The Large Hadron Collider; LHCb, JINST 19 (2024) P05065; arXiv:2305.10515.
(~0.9 min)
-->

---
# glow: a cut to a wider pose from the other side; the world speeds up until the fronts merge into one steady glow
space: { dim: 0, ambient: 0, sway: 0.4, rate: [[0, 0.001], [6, 1]], path: [[0, { at: [5, 0.4, 0], dist: 22, yaw: -60, pitch: 9 }]] }
steps: { det: 1, glow: 2 }
---

<!-- dk-glow step 2: the frequency grows until the fronts merge -->

<div class="nums" style="--d1: 4s">
  <p><b>40</b><span class="unit">MHz</span><span class="name">slots</span></p>
</div>

<!-- facts: lhc-crossing-40mhz, lhcb-hlt1-30mhz, lhc-filled-crossings-28mhz-worked, cern-lhc-collisions, lhc-turns-per-second, lhcb-upgrade-design-lumi, lhc-ls3-restart-2028 -->

<!--
Message: 25 ns apart means 40 million crossing slots a second; about 30 million of them, in LHCb's round design figure, had protons colliding.
Picture: The glow is the fronts coming too fast to tell apart: forty million crossing slots a second, one light. The finer sparkle in it is the hits of the crossings that follow one another.
Caveats:
- 40 MHz is the design slot rate. The bunch count gives at most 28.1 MHz (2 500 bunches × 11 245 turns a second). LHCb's 30 MHz is a rounded design figure for crossings with a visible collision, so say "about 30 million". Never call 30 MHz the count of filled bunches.
- The 30 million is said here, not shown: nothing in the glow tells a filled slot from an empty one. It comes on screen on slide 8, as the lane's `30` MHz in.
- Past tense: the run ended in June 2026, and the LHC restarts from 2028.
Misconception: "A crossing is one collision." The next two slides answer it.
Sources: LHCb, JINST 19 (2024) P05065; arXiv:2305.10515 ("the visible interaction rate of ∼30 MHz"); home.cern, The Large Hadron Collider.
(~0.9 min)
-->

---
# clip: under it the world waits at slide 5's first key, inside the detector along the beam, so the clip's last frame becomes the world there
space: { at: [-2, 0, 0], dist: 4, yaw: -80, pitch: 2, dim: 0, ambient: 0, sway: 0, path: [[0, { at: [-2, 0, 0], dist: 4, yaw: -80, pitch: 2 }]] }
steps: { det: 1, glow: 0 }
---

<VideoPlayer src="atlas_footage_2024_001_001_pileup.mp4" muted />

<!-- facts: atlas-pileup-display-2300480, atlas-cms-run3-pileup-60 -->

<!--
Message: One crossing holds several collisions at once; at ATLAS, up to about 60 in the last run.
Picture: The ATLAS experiment's display of one crossing from June 2018: three of its collision points are lit, then the camera pulls back to the whole ATLAS detector and runs along the beam. The clip runs 11.6 s, silent.
Caveats:
- This is ATLAS, named as such, in 2018 at 13 TeV.
- The display lights 3 collision points. Do not say the crossing held 3 collisions.
- The 60 is ATLAS's figure for the run of 2022-26 ("up to"), not CMS's.
- The ATLAS logo is burnt in. CERN material: no credit.
Sources: CERN video 2300480 (ATLAS-FOOTAGE-2024-001-001); ATLAS, JINST 19 (2024) P05063.
(~0.2 min)
-->

---
# readout: a cut under the clip's last frame inside the detector, then a crane out as every crossing's hits stream out along the lane
space:
  dim: 0
  ambient: 0
  sway: 0.4
  path:
    - [0, { at: [-2, 0, 0], dist: 4, yaw: -80, pitch: 2 }]
    - [5, { at: [7, 0.5, 0], dist: 15, yaw: -8, pitch: 8 }]   # the detector side on, the stream leaving it to the right
steps: { det: 2, glow: 0, g1: 1, tb: 1 }   # the 1 TB sphere gathers far off (station bytes), so slide 6 opens on it
---

<!-- detector step 2: the hits (hot, light blue: every crossing, the crowd) leave along +x -->

<div class="nums" style="--d1: 1.5s">
  <p><b>4</b><span class="unit">TB/s</span></p>
</div>

<!-- facts: lhcb-run3-readout-4tbs, lhcb-run3-pileup-5, lhcb-upgrade1-trigger -->

<!--
Opening (over the first key, inside the detector): At LHCb a crossing held about 5 collisions.
Message: Reading every crossing out whole made about 4 TB a second.
Picture: The light-blue stream leaving the detector is the full readout of every crossing: the hits of each crossing, read out whole and sent on. It is light blue because it is every crossing, nothing chosen yet. The dim grains round it are the detector.
Caveats:
- 4 TB/s is the average of the run of 2022-26.
- LHCb's 5 is the design average of visible collisions, not a measured mean.
- Past tense.
Sources: LHCb, arXiv:2106.07701; LHCb, JINST 19 (2024) P05065; E. Graverini, PoS(ICHEP2022)679.
(~0.9 min)
-->

---
# one day: a cut to the single sphere, then the camera pulls back from one second to one day while the piles keep their size
space:
  dim: 0.2
  ambient: 0
  sway: 0.3
  path:
    - [0, { at: [400.45, 0.2, 0], dist: 1.8, yaw: -12, pitch: 6 }]   # the 1 TB sphere stands from frame 0 (tb: 1 since slide 5)
    - [4.5, { at: [400.45, 0.2, 0], dist: 1.8, yaw: -12, pitch: 6 }]   # held while the pile of 4 gathers beside it (1.6 s + 3.2 s): one sphere, then one second
    - [9, { at: [404, 5, 0], dist: 17, yaw: -70, pitch: -2 }]   # back, from the small piles' side: the whole day (it gathers from 5 s), the pile of 4 (about 40 px) and the 1 TB sphere (15 px) in the foreground below it
steps: { det: 0, glow: 0, trg: 0, g1: 1, tb: 3 }
---

<!-- dk-lineup piles 0..2: 1 TB, 4 TB (a second, from 1.6 s), 345 600 TB (a day, 8 to a sphere, from 5 s as the camera pulls back: wait { "3": 5 }) -->

<div class="nums" style="--d1: 8.5s">
  <p><b>345.6</b><span class="unit">PB/day</span></p>
</div>

<!-- facts: lhcb-raw-345pb-per-day-worked, lhcb-run3-readout-4tbs -->

<!--
Message: One day of full readout would have been 345.6 PB.
Picture: Every sphere is one terabyte, a quarter of a second of readout. The pile of 4 that gathers beside the first sphere is one second; both stay in front, below the big pile, as the camera pulls back. The big pile is one day, drawn 8 terabytes to a sphere at the same volume.
Caveats: This is arithmetic (4 TB/s × 86 400 s), not data anyone stored.
Sources: LHCb, arXiv:2106.07701; worked (4 TB/s × 86 400 s).
(~0.8 min)
-->

---
# CERN's tape: the camera pulls back again; the tape archive's pile stands beside the day
space:
  dim: 0.2
  ambient: 0
  sway: 0.3
  path:
    - [0, { at: [404, 5, 0], dist: 17, yaw: -70, pitch: -2 }]   # slide 6's last pose; the 1 TB sphere and the pile of 4 fade (tb sets[4] = piles 2, 3)
    - [2, { at: [409, 4, 0], dist: 50, yaw: -20, pitch: 8 }]   # pull back first, so the tape pile gathers in the distance (its spheres come from behind it)
    - [5, { at: [418, 7, 0], dist: 80, yaw: 0, pitch: 8 }]
steps: { g1: 1, tb: 4 }
---

<!-- dk-lineup step 4 = sets[4] = piles [2, 3]: the day and the tape archive (1 300 000 TB, 27 to a sphere); the small piles leave -->

<div class="nums" style="--d1: 0.3s; --d2: 3s; --d3: 3.8s">
  <p><b>345.6</b><span class="unit">PB/day</span></p>
  <p><b>1.3</b><span class="unit">EB</span><span class="name">CERN tape</span></p>
  <p><b>3.8</b><span class="unit">days</span></p>
</div>

<!-- facts: cern-physics-data-tape-1p3eb, cern-tape-3p8-days-worked -->

<!--
Message: Under four days of LHCb's full readout would have been as much as everything CERN keeps on tape, from all its experiments.
Picture: The left pile is the day from slide 6 (its 345.6 PB stays on screen as the first line). The pile that gathers on its right, the largest, is CERN's tape archive, drawn 27 terabytes to a sphere. The lines read in the piles' order, left to right, then the days.
Caveats:
- 1.3 EB is all CERN experiments, stored at CERN (Annual Progress Report 2025). It is a store, not a yearly rate.
- 1.3 EB ÷ 345.6 PB a day = 3.8 days.
- A size comparison only: "decide later" is met once, on slide 9.
Sources: CERN Annual Progress Report 2025 (CERN/3980/Rev), p. 17; worked.
(~0.5 min)
-->

---
# gate 1: a cut to the detector's exit, then a flight along the lane (the travel is the story); click 1 fires the first filter
clicks: 1
space:
  dim: 0.2
  ambient: 0
  sway: 0.4
  path:
    - [0, { at: [10, 0.4, 0], dist: 16, yaw: -30, pitch: 8 }]
    - [5, { at: [32, -1.8, 0], dist: 10, yaw: -50, pitch: 6 }]   # the flight lands at the gate, so the click's burst fills the frame (the stage has no per-click camera key: kit request); yaw -50 so the ring across the lane reads as a ring, not edge on; the lane above y 330 of 900, clear of the numbers
steps: { det: 2, glow: 0, g1: 0, tb: 0, trg: 0, lane: 1, s1: 2 }
---

<!-- dk-trigger `lane`: this slide's sparse lane (600 crossings, so each knot stands apart); step 1 runs, step 2 gate 1 (keep 1/30) fires 0.4 s after the click. dk-spark s1 rings our knot (on: lane). Slides 9-10 return to the dense `trg`. -->
<StageSteps :set="{ lane: 1 }" :clicks="{ 1: { lane: 2 } }" />

<div class="nums" style="--d1: 5s; --d2: 0.5s">
  <p><b>30</b><span class="unit">MHz</span><span class="name">in</span></p>
  <p v-click="1"><b>1</b><span class="unit">MHz</span><span class="name">out</span></p>
</div>

<!-- facts: lhcb-hlt1-30mhz, lhcb-run3-hlt1-1mhz-out, lhcb-hlt1-drops-96p7pct-worked, lhcb-hlt1-500-cards-89khz, lhcb-upgrade1-trigger, lhcb-trigger-5tbs-10gbs -->

<!--
Message: The trigger is these two filters. The first, a program, kept about 1 crossing in 30 and dropped the rest before anything was stored; it had to keep pace with 30 million crossings a second.
Picture: Each knot of grains in the lane is one crossing; the fainter ones are empty. The ring across the lane is the first filter. On the click, the crossings it drops burst into dust at the ring, and those already past it burst on the wave, so the lane beyond empties at once: about one knot in thirty goes on. The dust never comes back. Light blue is every crossing, including those the filter passes; the white knot with the marker ring is ours, a stand-in crossing, and it passes.
Caveats:
- The drop is 1 − 1/30 = 96.7 %.
- It kept pace on average, in large batches, with no fixed time limit per crossing.
- What the first filter looked for is not said here: it needs a fact the bank lacks (notes/facts-needed.md).
- The lane here is drawn sparser than on slides 9-10 (600 knots against 4 500), so one knot can be told from the next. Both are drawings: neither count is a rate.
- Until 2018 a first filter built in hardware passed at most 1 MHz; from 2022 the whole chain was software.
Misconception: "The trigger keeps everything and looks later." The first filter dropped 29 of every 30 crossings before anything reached a disk. Only the second filter's choice came later, hours to days after the crossing, from the buffer (slide 9).
Sources: LHCb, JINST 19 (2024) P05065; LHCb Starterkit (Run 3 dataflow); arXiv:2606.14480 (throughput, batches); arXiv:2305.10515; arXiv:2412.05041 ("hours to days later" only).
(~1.5 min)
-->

---
# buffer: kept crossings park on a turning shell round the lane; click 1 switches the first filter off and the full lane floods it
clicks: 1
space: { dim: 0.2, ambient: 0, sway: 0.4, steady: true, path: [[0, { at: [50, -2.5, 0], dist: 20, yaw: -10, pitch: 8 }]] }   # target 2.5 below the lane: the lane and the shell in the upper middle, the numbers on black
steps: { det: 0, lane: 0, trg: 3, s1: 3 }
---

<!-- dk-trigger: step 3 the buffer; step 4 the flood (gate 1 off: [4], the buffer on) -->
<StageSteps :set="{ trg: 3 }" :clicks="{ 1: { trg: 4 } }" />

<!-- the click swaps the second line in place: 80 h leaves, and the second block (one line, anchored at the same bottom) brings 2.1 h where it stood -->
<div class="nums" style="--d1: 3s; --d2: 4.2s">
  <p><b>30</b><span class="unit">PB</span><span class="name">buffer</span></p>
  <p v-click.hide="1"><b>80</b><span class="unit">h</span><span class="name">at 1 MHz</span></p>
</div>
<div class="nums" v-click="1" style="--d1: 0.2s">
  <p><b>2.1</b><span class="unit">h</span><span class="name">full readout</span></p>
</div>

<!-- facts: lhcb-buffer-80-hours, lhcb-buffer-full-readout-2h-worked, lhcb-run3-hlt1-1mhz-out -->

<!--
Message: The kept crossings waited on 30 PB of disk, which held about 80 hours of them; only what the first filter kept could wait, and without it the full readout would have filled the buffer in about 2 hours.
Picture: The turning shell of parked knots is the disk buffer between the two filters, and our white knot, ringed, waits there. The lane goes on through it to the second filter. On the click the first filter is switched off and every crossing pours in, crowding the shell.
Caveats:
- 80 h is a capacity, not a typical waiting time.
- 2.1 h = 30 PB / 4 TB/s = 7 500 s. The two numbers come from different sources.
- Say "buffer", never "disc".
- The flood is the counterfactual: it never happened.
Misconception: "Store everything and decide later." At full readout the buffer is full in 2.1 h.
Sources: LHCb, JINST 19 (2024) P05065; arXiv:2305.10515; worked (30 PB / 4 TB/s).
(~1.2 min)
-->

---
# gate 2: close on the second filter's ring (the first filter long on again); ours leaves the buffer and waits before the ring; click 1 fires it
clicks: 1
space: { at: [62, -2.5, 0], dist: 12, yaw: -38, pitch: 4, dim: 0.2, ambient: 0, sway: 0.4, steady: true }   # the buffer's exit at the upper left, ours waiting at x 62.5, the ring at x 66 seen at an angle (a ring, not a band); the lane in the upper half, the numbers on black
steps: { det: 0, lane: 0, trg: 5, s1: 3 }
---

<!-- dk-trigger: step 5 (from 3 or the flood's 4) turns gate 1 long on and glides ours out of the buffer to x 62.5 (3 s); the click's step 6 fires gate 2 (keep 0.1, shrink 0.75) 1.5 s after it, and ours goes through to x 70 -->
<StageSteps :set="{ trg: 5 }" :clicks="{ 1: { trg: 6 } }" />

<div class="nums" style="--d1: 1.5s; --d2: 2.3s">
  <p v-click="1"><b>100</b><span class="unit">kHz</span></p>
  <p v-click="1"><b>10</b><span class="unit">GB/s</span></p>
</div>

<!-- facts: lhcb-hlt2-output-rate, lhcb-hlt2-keep-1-in-10-worked, lhcb-run3-hlt1-1mhz-out, lhcb-run3-readout-4tbs, lhcb-realtime-analysis, lhcb-event-sizes-2024 -->

<!--
Message: The second filter reconstructed each kept crossing in full and kept about 1 in 10, about 10 GB a second.
Picture: The ring is the second filter. Reconstructing means joining the hits into tracks and particles. Our white knot, ringed, comes out of the buffer and waits before the ring. On the click the filter drops about 9 knots in 10 to dust, and each knot it keeps goes on a little smaller (it is stored smaller: the caveat's quarter). Ours goes through, a little smaller.
Caveats:
- 1 MHz in, about 100 kHz out: keep about 0.1. 10 GB/s ÷ 100 kHz = 100 kB a kept crossing, against 4 TB/s ÷ 30 MHz = 133 kB read out, so a kept crossing is stored about a quarter smaller (0.75). Our arithmetic, from design figures.
- Many kept crossings were written as the reconstructed particles only (about 10 kB); the design average was about 100 kB. Never say "most of them compact" over this picture: the knots shrink by a quarter, not by 13 times.
- 10 GB/s and about 100 kHz are design targets in the sources, not measured averages over the run.
Sources: SMARTHEP trigger summary, arXiv:2408.03881 §1.3; arXiv:2412.05041; home.cern, March 2023 (real-time analysis); LHCb event sizes, arXiv:2506.20309; worked.
(~1.3 min)
-->

---
# clip: under it the world waits at slide 12's first key, far out over the piles, so the clip's last frame becomes the world there
space: { at: [404, 4, 0], dist: 70, yaw: -4, pitch: 10, dim: 0, ambient: 0, sway: 0, path: [[0, { at: [404, 4, 0], dist: 70, yaw: -4, pitch: 10 }]] }
steps: { det: 0, trg: 6, s1: 0, g1: 1, tb: 0 }   # the floor only: slide 12's piles gather on slide 12 (the day's wait is 0 on step 5), not under the clip
---

<VideoPlayer src="cern_footage_2020_042_001_tape_library.mp4" muted />

<!-- facts: cern-tape-library-2020 -->

<!--
Message: What both filters kept went to tape.
Picture: CERN's tape library being installed in August 2020, its racks lined up and closed into one wall: tape cartridges, 15 000 slots, room for 48 drives. The clip runs 12 s, silent; its last 0.6 s dim to 30 %, so the room does not flash white as it breaks into the dust of slide 12.
Caveats: This is one library in the CERN Data Centre, not all of CERN's tape. CERN material: no credit.
Sources: CERN video 2728761 (CERN-FOOTAGE-2020-042-001).
(~0.2 min)
-->

---
# kept a day: a cut under the clip's last frame far out, then a crane in; one day kept (white) beside one day read out
space:
  dim: 0.2
  ambient: 0
  sway: 0.3
  steady: true
  path:
    - [0, { at: [404, 4, 0], dist: 70, yaw: -4, pitch: 10 }]
    - [6, { at: [402, 4, 0], dist: 28, yaw: -4, pitch: 10 }]   # target 2 left of the clip's: the white kept pile stands clear of the second number line
steps: { det: 0, trg: 7, g1: 1, tb: 5 }   # trg 7: ours glides on to x 98, unseen, so slide 13 opens with it in frame
---

<!-- dk-lineup step 5 = sets[5] = piles [2, 4]: the day read out (345 600 TB) and the day kept (864 TB, white, beside it) gather at once (the day's wait is 0 on step 5) as the clip's dust clears; numbers once they stand (grow 3.2 s) -->

<div class="nums" style="--d1: 2.6s; --d2: 3.2s">
  <p><b>864</b><span class="unit">TB</span><span class="name">kept</span></p>
  <p><b>345 600</b><span class="unit">TB</span><span class="name">read out</span></p>
</div>

<!-- facts: lhcb-kept-864tb-per-day-worked, lhcb-upgrade1-trigger, lhcb-raw-345pb-per-day-worked, lhcb-hlt2-keep-1-in-10-worked, lhcb-sprucing-rates, lhcb-run3-end -->

<!--
Message: The two filters kept about 1 byte in 400: 864 TB a day of the 345 600 TB (345.6 PB) read out.
Picture: The small white pile is a day of what reached tape. The large light-blue pile is a day of readout, the same pile as on slide 6. The white pile is 400 times smaller by volume, about 7 times narrower.
Caveats:
- Said aloud: 30 × 10 = 300 in crossings; each kept crossing was also stored smaller, about 100 kB instead of 133 kB, so in bytes it is about 400.
- The 400 pairs with 4 TB/s (one source). Never with "1 in 500" or 5 TB/s.
- The 864 TB went to tape before a later slimming step, which cut it to 3.5 GB/s for disk.
- Design rates, past tense: the run ended in June 2026.
Sources: LHCb, JINST 19 (2024) P05065; arXiv:2305.10515; LHCb data-processing rates (2025); worked (10 GB/s × 86 400 s).
(~1.1 min)
-->

---
# one row: a cut past the second filter at the lane's end; our kept knot folds into one white grain, ringed, as the floor fades in below
space: { dim: 0.2, ambient: 0, sway: 0.4, steady: true, path: [[0, { at: [98, 0, 0], dist: 9, yaw: -20, pitch: 14 }]] }   # pitch 14: the floor below is in frame as it fades in (faint: the series floor)
steps: { det: 0, g1: 0, tb: 0, trg: 8, g2: 1, s2: 1, heap: 0 }   # g2 step 1: the floor brighter than slide 14's (alpha by step), so it reads 9 units below
---

<!-- dk-trigger step 8: ours, already at x 98 (step 7, slide 12), folds where it stands over 1.2 s from the cut ({ at: 98, fold: true, glide: 1.2 }); dk-spark s2 rings it (on: trg; the ring gathers in over 0.6 s, haloGather) -->

<div class="nums" style="--d1: 1.5s; --d2: 2.1s; --d3: 2.7s">
  <p><b>1 880.6</b><span class="unit">MeV/c²</span><span class="name">mass</span></p>
  <p><b>3 001</b><span class="unit">MeV/c</span><span class="name">momentum</span></p>
  <p><b>0.413</b><span class="unit">ps</span><span class="name">decay time</span></p>
</div>

<!-- facts: d0-row1-values-worked, lhcb-record401-year, lhcb-upgrade1-trigger -->

<!--
Message: A kept crossing, reconstructed, becomes rows of numbers; for a pair of tracks that may come from one short-lived particle, a row like this one.
Picture: Our white knot folds into one white grain with its ring: one row of numbers. The mass is the mass of the two-track pair. The momentum is its momentum across the beam (pT); say "across the beam" aloud. The decay time is how long it lived before it decayed. The row holds a fourth number, how far its path points from the collision, which talk 3 uses. The few knots drifting past are the other kept crossings, still running on down the lane.
Caveats (all three must be said):
- The crossing drawn on the cover is a different real crossing from this row's.
- This row was recorded in 2011-12, under the trigger of that time, not the one drawn here; the file's guide calls the sample "randomly collected". Never say it passed this talk's filters.
- The year is not settled: the record states none, its guide says 2011, a 2015 paper says 2012. Say "2011-12", without an energy.
- Values are float32 from the file: 1 880.649 MeV/c², 3 000.953 MeV/c, 0.41271 ps; the fourth is 1 299.17.
- Three numbers on screen (the bible's limit); the fourth is said only.
Sources: CERN Open Data record 401 (row 1); the CERN Open Data LHCb masterclass guide ("a sample of randomly collected LHC interactions during 2011 data taking"); PoS(EPS-HEP2015)358.
(~1.8 min)
-->

---
# the heap: the camera follows our grain down to the floor while the file's rows rain onto it; ours lands last on the summit (T2's cover pose)
space:
  dim: 0.2
  ambient: 0
  sway: 1
  steady: true
  path:
    - [0, { at: [98, 0, 0], dist: 9, yaw: -20, pitch: 14 }]
    - [8, { at: [100, -7.2, 0], dist: 16, yaw: -12, pitch: 12 }]   # heap + [0, 1.8, 0]: T2 opens here
steps: { det: 0, trg: 0, g2: 2, heap: 1, s2: 2 }   # g2 step 2: the series floor (T2's cover's alpha)
---

<!-- dk-heap step 1: the rain (6 s; the count follows the heap, which lands on 91 583 since the steward's fix); our grain starts at the fold point (oursFrom { at: [-2, 9, 0] }, slide 13's x 98) and glides onto the summit last; s2 rings it (on: heap). -->

<div class="nums" style="--d1: 1s">
  <p><b><StageCount for="heap" :to="91583" /></b><span class="name">candidates</span></p>
</div>

<div class="credits credit">LHCb detector geometry: LHCb's DD4hep description, © CERN for the benefit of the LHCb Collaboration, GPL-3.0; converted by HSF Phoenix, Apache-2.0.</div>

<!-- facts: record401-candidates-91583, record401-licence-cc0, d0-row1-values-worked, d0-row1-signal-share-worked -->

<!--
Message: Each row is a candidate, two tracks that may come from one short-lived particle; a dataset is a pile of such rows, here 91 583 candidates from one file, the pile the next four talks work on.
Picture: Each grain is one row of the file. The white one with the ring is ours, landing last on the summit. All of these were recorded and kept; from here light blue is every candidate, and white will mark what a selection keeps (talk 2 on).
Caveats:
- Say "candidates". The portal counts 53 948 events (recorded crossings), and one can hold more than one candidate.
- Most of these grains are not the short-lived particle (talk 2 counts the excess).
- The heap is unsorted: no axis, no histogram (talk 2).
Misconception: "A row is a particle." Nobody can say whether one row is the particle (talk 3 gives our row a signal share of 0.144).
Sources: CERN Open Data record 401 (CC0), DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR.
(~1.2 min)
-->
