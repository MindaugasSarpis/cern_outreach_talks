# Data1Trigger: outline (label outline:data1trigger, 29 Oct 2026; revised revise:data1trigger)

> **Superseded by the owner's 29 Oct decisions** (the series bible's top block): the stage,
> decay and record names in the slide sections below (HLT1, HLT2, VELO, Turbo, GPU counts,
> the decay and its fourth number's name) are not to be used on screen or in any Message or
> Picture line. `deck.md` is the source; this outline is the history of how it was planned.

Talk 1 of "Data analysis, the CERN way". This is the outline step of the house pipeline
(talk-quality §2, step 3). It covers each slide's pose, its one picture, the numbers on
screen and the notes, so the deck draft can be written from it. It does not change
`deck.md` or `space.json`.

Inputs: the series bible §5 Talk 1 with the corrections at its top (binding), the kit
README, the prototype verdicts (`components/data-kit/notes/prototypes.md`), lab 1
(`talks/2026_00_00_DataLab1`, kit worktree), kit note `t1.md`, the research lanes'
caveats (crossings, trigger-out, tape-record401, clips), and the clip cuts already in
`videos/manifest.toml`. Every fact id below was checked with `pnpm -s talk facts show`.
The ones missing from the bank are listed at the end.

Revision (revise:data1trigger, 29 Oct): the critique's 19 findings are folded in. The
record 401 trigger claim is gone (the only source calls the sample randomly collected);
the cover no longer implies its crossing is row 1; gate 2's words match its 0.75 shrink;
slide 8 no longer says the trigger decided "on the spot"; every physics word is defined
where it first appears; slide 9 gets a click for its 2.1 h; the cover's crossing leaves
the world after slide 1; `dim` is 0.2 on every number slide.

- **Cover title:** The trigger
- **Question:** LHCb sees a bunch crossing every 25 ns. What does it keep, and how does it
  choose in time?
- **Takeaway:** A program decides what becomes data before anyone looks, and what it drops
  is gone for good. What survives is a row of four numbers. (If slide 13's four-number
  grant is refused: "What survives is a row of numbers".)
- **Misconception met on screen:** "store everything and decide later" (slide 9, click 1:
  with gate 1 off the full readout floods the 30 PB buffer, full in 2.1 h).
- **Total:** 13.6 min of notes plus 24 s of clips = **14.0 min** (limit 15.75).

## Deck-wide

- Headmatter as in bible §3: `onscreen: numbers`, `sources: notes`, `duration: 15min`,
  `lang: en`, `transition: dust`, `videos.dust: '#7dd3fc'`, `stage: { palette: classic,
  motion: floor, lang: en, plugins: [lhcb], sound: { hum: false, flight: false, clip:
  false }, options: { aberration: 0 } }`. Add `lhc-collision` and the dk types to
  `stage:check --types`.
- Colour: light blue = every crossing, packet and candidate (the crowd), including those a
  gate passes. White = ours (our packet, our grain, marked by dk-spark's ring), and the
  kept pile on slide 12 (`color: 'sel'`). From talk 2 on, white also marks what a
  selection keeps.
- Past tense for every rate: Run 3 ended in June 2026 and the LHC is in LS3
  (`lhc-ls3-restart-2028`, `lhcb-run3-end`; the two sources give 29 and 27 June: say
  "June 2026").
- 4 TB/s is paired only with ×400, never with "1 in 500" or 5 TB/s.
  `lhcb-trigger-5tbs-10gbs` is cited once, on slide 8, in the notes only and only for
  "the final decision came hours to days later" (not for 5 TB/s or 1 in 500).
- `dim: 0.2` on every slide where numbers sit on the world (bible §3, talk-quality §4
  floor 0.2-0.35). Lab 1 used 0.15; it is raised here, not kept as an exception.
- Physics words are defined in one plain clause where they first appear (see Ladder
  check): track (1), VELO (5), reconstruction (10), pT, decay time and IPχ² (13),
  candidate and D⁰ (14).
- Clips: no h1, no numbers over the footage, no `advance-on-end`, no fade after them.
  `pnpm videos:frames` and commit `public/video-frames/index.json`.

### Stations (proposed)

| station | pos | objects |
|---|---|---|
| `lhcb` | [0, 0, 0] | `detector` det (`src: lhcb`, 93 000, `parts` = the classic literal from README "Install", `out: [16, 0, 0]`); `lhc-collision` crossing (event.json, record 24506; `tone`/`splashTone` `#7dd3fc`, `muonTone`/`bunchColor` `#f2f5f9`, `sound: false`; shown on slide 1 only, `crossing: 0` from slide 2); dk-glow glow (`of: det`, 46 500); dk-trigger trg (lab 1's object, with the changes on slides 8-10 and 13); dk-spark s1 (cover) |
| `bytes` | [400, 0, 0] | dk-ground g1 (named, `enterable: true`); dk-lineup tb, balls `[{n: 1}, {n: 4}, {n: 345600, grain: 8}, {n: 1300000, grain: 27}, {n: 864, color: 'sel', at: beside the 345 600 pile}]`, gaps as lab 1 |
| `floor` | [100, -9, 0], under the lane's end | dk-ground g2 (named: hidden until slide 13, so no floor shows under the gates); dk-heap heap (`n: 91583`, `radius: 4`, as lab 2, so T2's cover matches); dk-spark s2 |

Budget (tier 0, cap about 503 000; hidden forms do not count, as lab 1's 464k gate slide
shows). The cover's crossing leaves the world after slide 1 (`steps: { crossing: 0 }`;
`collisionRun` in `components/lhc-opening/collision.js` fades it over 1.6 s at step 0).
Whether a faded `lhc-collision` still counts against the cap is unchecked, so both cases:

| slides | forms shown | (a) crossing hidden | (b) crossing still counted |
|---|---|---|---|
| 1 | collision 200k + det 93k + spark + dust 124k | ≈ 417k | ≈ 417k |
| 2-3 | det + glow 46.5k + dust | ≈ 264k | ≈ 464k |
| 5 | det + dust | ≈ 217k | ≈ 417k |
| 6-7, 12 | lineup 91.4k + ground 14k + dust | ≈ 230k | ≈ 230k (other station) |
| 8-10 | det + trigger 50-75k + dust | ≈ 270-290k | ≈ 470-490k (trigger then at most about 60k) |
| 13 | det + trigger + ground 14k + spark + dust | ≈ 290k | ≈ 490k |
| 14 | heap 91.6k + ground 14k + spark + dust | ≈ 230k | ≈ 230k (other station) |

In case (b) the collision is still in view on slides 2, 3, 5 and 8-10, and each of their
Pictures must add: "The tracks hanging at the centre are the cover's crossing." (§4 rule
1). Case (a) is the plan; a sparse shot of slide 2 decides it.

---

## Part 1. Cover: one crossing (1.5 min)

### Slide 1 · cover · 1.5 min

- **Pose:** station `lhcb`. Cold open: a `path` from far out to the VELO in about 9 s.
  - `[0, { at: [40, 12, -30], dist: 260, yaw: -70, pitch: 25 }]`
  - `[5, { at: [6, 1, 0], dist: 60, yaw: -40, pitch: 16 }]`
  - `[9, { at: [3, 0.4, 0], dist: 12, yaw: -24, pitch: 10 }]`, the landing. It is near lab 1's
    cover (`[4.5, 0.5, 0]`, dist 18, yaw -24, pitch 12), a little further in. Frame it so the
    title has black round it.
  - `ambient: [[0, 0.35], [7, 0.1], [9, 0]]`: the dust gives the fly-in its speed, and the
    crossing is on black.
  - `rate: [[0, 1], [8.6, 1], [9.2, 0.02]]` with `cameraRate: 1` (bullet time at the
    crossing). `dim: 0` (no numbers on this slide), `sway: 0.5`.
  - `steps: { crossing: 1, det: 1, glow: 0, trg: 0, s1: 1 }`.
  - The title fades in at about 8.6 s, as the bunches meet, and holds over the bullet time
    (talk-quality §1 "Wow": the title rises with the gathering form, never over the
    fly-through's moving grains).
- **Picture:** the real 2012 LHCb crossing (`lhc-collision`, event.json from record 24506)
  inside the kit's LHCb detector (`src: lhcb`). `<Crossing>` (the bible §4 lift of
  MasterTalk's component, which T1 builds) times the bunches to meet as the camera lands.
  The debris then hangs in bullet time. dk-spark s1 sits white at the primary vertex, at
  `[0, 0, 0]`.
- **On screen:** the plain title "The trigger" and nothing else (no byline, card, `.src`,
  ring station or "start here").
- **Notes:**
  - *Message:* Each bunch crossing is read out whole by the detector, like one frame from a
    camera.
  - *Picture:* The tracks are one real LHCb crossing from 2012. Each line is a track, the
    path of one charged particle rebuilt from the hits. The detector is LHCb's geometry in
    grains. The white point with its ring marks one crossing that we follow through the
    trigger. It stands in for any crossing. The row it becomes on slide 13 comes from a
    different crossing, recorded in 2011-12.
  - *Caveats:*
    - This crossing (record 24506, run 133488, event 2028034058, 8 TeV) is not the crossing
      of row 1, which closes the talk. No slide may say it is. Its numbers on screen would
      need a fact (missing, below), so it shows none.
    - It is 2012 (Run 1) data drawn in the Run 3 detector geometry.
  - *Sources:* CERN Open Data record 24506 (CC0); `components/lhc-opening/README.md`; kit
    lhcb geometry (GPL-3.0 / Apache-2.0, credited on slide 14); arXiv:2106.07701 ("reading
    out the full detector for every bunch crossing").
- **Facts:** `record24506-licence`, `lhc-bunch-spacing-25ns`, `lhcb-run3-readout-4tbs`
  ("read out whole"). Missing: `lhcb-crossing-24506-event`.
- **Prototype:** none (lab 1 slide 1 was judged good). The fly-in, the title's fade-in and
  bullet time are new, so check them in a `--burst` shot.

## Part 2. Forty million a second (2.2 min)

### Slide 2 · fronts · 0.9 min

- **Pose:** `lhcb`, `{ at: [5, 0.4, 0], dist: 17, yaw: -30, pitch: 9, dim: 0.2, ambient: 0,
  sway: 0.4 }` (lab 1 slide 2, `dim` raised from 0.15). `steps: { crossing: 0, det: 1,
  glow: 1, s1: 0 }`.
- **Picture:** dk-glow step 1: one light-blue front of grains runs down the detector for
  each crossing. `<Clock unit="ns">` counts 25 ns per front (MasterTalk's Clock.vue, lifted
  with T1; without it, the slide shows 25 ns alone). The cover's crossing fades out as the
  slide opens.
- **On screen:** `25` ns (and the clock's running ns, if the Clock is lifted).
- **Notes:**
  - *Message:* Bunches cross at LHCb every 25 ns, and each crossing is a fresh picture of
    the whole detector.
  - *Picture:* Each front is one crossing passing through the detector. The fronts are
    slowed about 7 × 10⁷ times (one every 1.7 s instead of every 25 ns): 25 ns cannot be
    drawn.
  - *Caveats:* The fronts are stylised at 0.6 fronts a second (dk-glow `f0`; t1.md open
    item 4): 1 / 0.6 s ÷ 25 ns = 6.7 × 10⁷. The bunches are about 7 m apart.
  - *Sources:* home.cern, The Large Hadron Collider; LHCb, JINST 19 (2024) P05065.
- **Facts:** `lhc-bunch-spacing-25ns`, `lhc-crossing-40mhz`.
- **Prototype:** none (lab 1 slide 2, fair to good).

### Slide 3 · glow · 0.9 min

- **Pose:** the same pose (`dim: 0.2`). `steps: { det: 1, glow: 2 }`. `rate: [[0, 0.001],
  [6, 1]]`: the world speeds up until the fronts merge.
- **Picture:** dk-glow step 2: the fronts come faster and merge into one steady light-blue
  glow with a white sparkle of hits.
- **On screen:** `40` MHz (name "slots"), `30` MHz (name "non-empty").
- **Notes:**
  - *Message:* 25 ns apart means 40 million crossing slots a second; about 30 million of
    them, in LHCb's round design figure, had protons colliding.
  - *Picture:* The glow is the fronts too fast to tell apart. The white sparkle is the hits
    of other crossings.
  - *Caveats:*
    - 40 MHz is the design slot rate. The bunch count gives at most 28.1 MHz (2 500 bunches
      × 11 245 turns a second); LHCb's 30 MHz is a rounded design figure for crossings with
      a visible collision, so say "about 30 million". Never call 30 MHz the count of
      filled bunches.
    - Use the past tense (Run 3 ended in June 2026).
  - *Misconception:* "a crossing is one collision". The next two slides answer it.
  - *Sources:* LHCb, JINST 19 (2024) P05065; arXiv:2305.10515 ("the visible interaction
    rate of ∼30 MHz"); home.cern.
- **Facts:** `lhc-crossing-40mhz`, `lhcb-hlt1-30mhz`, `lhc-filled-crossings-28mhz-worked`,
  `cern-lhc-collisions`, `lhc-turns-per-second`, `lhcb-upgrade-design-lumi`,
  `lhc-ls3-restart-2028`.
- **Prototype:** none (lab 1 slide 3, good).

### Slide 4 · clip · 0.2 min + 12 s clip

- **Pose:** the space under the clip sits at slide 5's key-0 pose (inside the LHCb
  detector, along the beam), so the clip's last frame becomes the world there.
- **Picture:** clip `atlas_footage_2024_001_001_pileup.mp4` (CDS 2300480, cut 22-34 s, 12 s):
  ATLAS's display of one 2018 crossing with its pile-up vertices, pulling back to the whole
  ATLAS detector and then along the beam.
- **On screen:** nothing (the clip).
- **Notes** (said over the clip, about 12 s):
  - *Message:* One crossing holds several collisions at once; ATLAS in Run 3 had up to
    about 60.
  - *Picture:* An ATLAS crossing from 12 June 2018 (run 352514, event 1031263761): a Z → μμ
    vertex and two dijet pile-up vertices, among the others. (Not said; for the record.)
  - *Caveats* (not said unless asked):
    - This is ATLAS, named as such, in Run 2 at 13 TeV.
    - The display highlights 3 vertices. Do not say the crossing held 3 collisions, or call
      it a high-pile-up event.
    - The 60 is ATLAS's Run 3 figure only ("up to"), not CMS's.
    - The ATLAS logo is burnt in. CERN material: no credit.
  - *Sources:* CERN video 2300480; ATLAS, JINST 19 (2024) P05063.
- **Facts:** `atlas-pileup-display-2300480`, `atlas-cms-run3-pileup-60`.

## Part 3. Bytes (2.2 min)

### Slide 5 · readout · 0.9 min

- **Pose:** `lhcb`. A one-key `path` cut under the clip's last frame to `{ at: [-2, 0, 0],
  dist: 4, yaw: -80, pitch: 2 }` (inside the detector, along the beam), then a crane out to
  `{ at: [10, 0.5, 0], dist: 24, yaw: -20, pitch: 10 }` by 5 s. `dim: 0.2`, `ambient: 0`.
  `steps: { crossing: 0, det: 2, glow: 0 }`.
- **Picture:** the detector at step 2: every crossing's hits stream out of it along +x, the
  readout leaving the detector.
- **On screen:** `4` TB/s.
- **Notes:**
  - *Opening* (over key 0, inside LHCb): At LHCb a crossing held about 5 collisions.
  - *Message:* Reading every crossing out whole made about 4 TB a second.
  - *Picture:* The stream leaving the detector is the full readout of every crossing.
  - *Caveats:*
    - 4 TB/s is the Run 3 average.
    - The VELO, the pixel detector about 5 mm from the beam, alone made about 2 Tbit/s.
    - LHCb's 5 is the design average of visible collisions, not a measured mean.
  - *Sources:* arXiv:2106.07701 (LHCb, real-time processing efficiency); LHCb, JINST 19
    (2024) P05065; arXiv:2305.10515 (VELO); E. Graverini, PoS(ICHEP2022)679.
- **Facts:** `lhcb-run3-readout-4tbs`, `lhcb-run3-pileup-5`, `lhcb-velo-pixels`,
  `lhcb-velo-distance`.
- **Prototype:** none. The detector's `out` step was seen on lab 1 slides 4-6.

### Slide 6 · one day · 0.8 min

- **Pose:** `bytes`, lab 1 slide 8's path: `[0, { at: [400.45, 0.2, 0], dist: 1.8, yaw: -12,
  pitch: 6 }]`, hold to 3.5 s, then `[10, { at: [406, 7, 0], dist: 40, yaw: -6, pitch: 8 }]`.
  `dim: 0.2`, `ambient: 0`, `sway: 0.3`. `steps: { det: 0, trg: 0, g1: 1, tb: 3 }`.
- **Picture:** dk-lineup: one sphere is 1 TB (a quarter of a second of readout), a pile of 4
  is one second, and a pile of 345 600 is one day. The piles keep their size while the
  camera pulls back.
- **On screen:** `345.6` PB/day.
- **Notes:**
  - *Message:* One day of full readout would have been 345.6 PB.
  - *Picture:* Every sphere is one terabyte. The big pile is drawn 8 to a sphere, at the
    same volume.
  - *Caveats:* This is arithmetic (4 TB/s × 86 400 s), not data anyone stored.
  - *Sources:* as slide 5; worked.
- **Facts:** `lhcb-raw-345pb-per-day-worked`, `lhcb-run3-readout-4tbs`.
- **Prototype:** none (lab 1 slide 8, good).

### Slide 7 · all of CERN's tape · 0.5 min

- **Pose:** `bytes`, lab 1 slide 9: path from slide 6's end to `{ at: [418, 7, 0], dist: 80,
  yaw: 0, pitch: 8 }` by 6 s. `dim: 0.2`. `steps: { tb: 4 }`.
- **Picture:** the 1.3 EB pile (all physics data on CERN's tape) beside the one-day pile.
- **On screen:** `1.3` EB (name "CERN tape"), `3.8` days.
- **Notes:**
  - *Message:* Under four days of LHCb's full readout would have been as much as
    everything CERN keeps on tape, from all its experiments. (A size comparison only: the "decide
    later" misconception is met once, on slide 9.)
  - *Picture:* The largest pile is CERN's tape archive, drawn 27 to a sphere.
  - *Caveats:* 1.3 EB is all CERN experiments, stored at CERN (Annual Progress Report
    2025). It is a store, not a yearly rate. 1.3 EB ÷ 345.6 PB a day = 3.8 days.
  - *Sources:* CERN Annual Progress Report 2025 (CERN/3980/Rev), p. 17.
- **Facts:** `cern-physics-data-tape-1p3eb`, `cern-tape-3p8-days-worked`.
- **Prototype:** none (lab 1 slide 9, good).

## Part 4. The gates (4.0 min)

### Slide 8 · gate 1 · 1.5 min · PROTOTYPE (dk-trigger gates, sparse)

- **Pose:** `lhcb`, flown in from `bytes`. A `path` from the detector's exit
  `[0, { at: [10, 0.4, 0], dist: 16, yaw: -30, pitch: 8 }]` along the lane to lab 1 slide 4's
  pose, `[5, { at: [32, 0.2, 0], dist: 22, yaw: -6, pitch: 6 }]`. `dim: 0.2`, `ambient: 0`,
  `sway: 0.4`, `clicks: 1`. `steps: { crossing: 0 }` held.
- **Picture:** dk-trigger.
  - Click 0 (`trg: 1`, `det: 2`): the lane. One knot of grains is one crossing, the empty
    ones fainter, and our white packet rides in it.
  - Click 1 (`trg: 2`): gate 1 (HLT1) fires. 29 of every 30 packets burst into dust at the
    ring, and the dust never comes back. Those already past it burst on the wave, so the
    lane beyond empties at once. Our packet passes, white; the other packets that pass stay
    light blue.
  - This is the talk's measured music peak (in the edit).
- **On screen:** `30` MHz (name "in") at click 0; `1` MHz (name "out") and `500` GPUs at
  click 1.
- **Notes:**
  - *Message:* The first gate, a program on about 500 GPUs, kept about 1 crossing in 30 and
    dropped the rest before anything was stored: HLT1 had to keep pace with 30 million
    crossings a second on average, in batches, with no time limit per crossing. It kept
    crossings with a track that carried large momentum across the beam or missed the
    collision point.
  - *Picture:* Each knot is one crossing. The ring is HLT1. The dust is the 96.7 % of
    crossings it dropped. Light blue is every crossing, including those a gate passes;
    white with a ring is ours. The white knot is ours, a stand-in crossing.
  - *Caveats:*
    - The drop is 1 − 1/30 = 96.7 %.
    - The sources give the GPU count two ways: "about 500 GPU cards" (2026) against "the
      servers can host about 500, the baseline needs about 200" (Upgrade I paper). Say
      "about 500 cards".
    - Run 3 had no hardware trigger. Runs 1-2 had one, limited to 1 MHz.
    - What HLT1 looked for (large momentum across the beam, tracks that miss the collision
      point, and muons: signs of a short-lived heavy particle) needs `lhcb-hlt1-selections`
      (missing). Until it exists the deck draft keeps the last sentence of the Message
      marked CHECK. Off screen (notes only), and never called learned (T4).
  - *Misconception:* "The trigger keeps everything and looks later." HLT1 dropped 29 of
    every 30 crossings before anything reached disk. Only HLT2's choice came later, hours
    to days after the crossing, from the buffer (slide 9).
  - *Sources:* LHCb, JINST 19 (2024) P05065; LHCb Starterkit (Run 3 dataflow);
    arXiv:2606.14480 (HLT1 throughput, batches, no per-crossing latency); arXiv:2412.05041
    ("hours to days later", notes only).
- **Facts:** `lhcb-hlt1-30mhz`, `lhcb-run3-hlt1-1mhz-out`, `lhcb-hlt1-drops-96p7pct-worked`,
  `lhcb-hlt1-500-cards-89khz`, `lhcb-allen-gpu`, `lhcb-upgrade1-trigger`,
  `lhcb-trigger-5tbs-10gbs` (for "hours to days" only). Missing: `lhcb-hlt1-selections`.
- **Prototype:** yes, the bible §4 sparse slide of "dk-trigger gates" (lab 1 slide 4; "Gate 1
  reads").

### Slide 9 · buffer · 1.2 min · PROTOTYPE (dk-trigger gates, dense a)

- **Pose:** `lhcb`, lab 1 slide 5: `{ at: [50, 0, 0], dist: 20, yaw: -10, pitch: 8, dim:
  0.2, ambient: 0, sway: 0.4, steady: true }`, `clicks: 1`.
- **Picture:** dk-trigger.
  - Click 0 (`trg: 3`): the buffer. The kept packets park on a turning shell round the lane
    and move three times slower in its span. Our white packet parks there.
  - Click 1 (kit step key, requested): gate 1 switches off while the buffer stays on, so
    the full lane floods the shell and parked knots crowd it. This is the counterfactual
    the 2.1 h counts.
- **On screen:** click 0: `30` PB (name "buffer"), `80` h (name "at 1 MHz"). Click 1: `30` PB
  and `2.1` h (name "full readout"), which replaces `80` h. Two numbers at a time.
- **Notes:**
  - *Message:* The kept crossings waited on 30 PB of disk, which held about 80 hours of
    them. Only what HLT1 kept could wait; HLT2 decided later, from the buffer. Without the
    first gate, full readout would have filled it in about 2 hours.
  - *Picture:* The shell of parked knots is the disk buffer between the two gates. The lane
    goes on through it to gate 2. On the click, gate 1 is switched off and every crossing
    pours in.
  - *Caveats:*
    - 80 h is a capacity, not a typical waiting time.
    - 2.1 h = 30 PB / 4 TB/s = 7 500 s. The two numbers come from different sources
      (verdict corrected).
    - Say "buffer", never "disc".
  - *Misconception:* "store everything and decide later". At full readout the buffer is full
    in 2.1 h.
  - *Sources:* LHCb, JINST 19 (2024) P05065; worked.
- **Facts:** `lhcb-buffer-80-hours`, `lhcb-buffer-full-readout-2h-worked`,
  `lhcb-run3-hlt1-1mhz-out`.
- **Prototype:** yes, dense (lab 1 slide 5; "a ring of parked packets, plausibly stored";
  verdict "nothing in the picture says how much", which click 1 answers).
- **Kit notes:**
  - Gate 2 must not fire on this slide, so the buffer and gate 2 need separate steps.
    Either a pass-through gate (`keep: 1, shrink: 1, ring: 0`) at the buffer's mouth, so
    the buffer (`buffer.step: 3`) and HLT2 (gate index 3, `trg: 4`) step apart, or a kit
    change. The fallback is lab 1's order: buffer and gate 2 together at step 3.
  - Click 1 needs a dk-trigger step key the kit does not have: a step back turns gate 1
    off but also the buffer (it starts at `buffer.step`). Request (for
    `components/data-kit/notes/requests-t1.md`): a per-step gate `off` list, or
    `buffer.flood: <step>` (gate 1 off, buffer on, the lane floods the shell). Slide 10
    then opens with gate 1 back on, shown as long on.
  - Fallback if the kit change does not land: no click; show `30` PB and `2.1` h only, and
    move 80 h to the notes.

### Slide 10 · gate 2 · 1.3 min · PROTOTYPE (dk-trigger gates, dense b)

- **Pose:** `lhcb`, closer than lab 1 slide 6: `{ at: [66.5, 0, 0], dist: 7, yaw: -12,
  pitch: 6, dim: 0.2, ambient: 0, sway: 0.4, steady: true }`, `clicks: 1`.
- **Picture:** dk-trigger.
  - Click 0 (`trg: 3`): gate 2's ring is dark, and whole knots pass it.
  - Click 1 (`trg: 4`): HLT2 fires. It drops about 9 of 10 knots to dust, and each knot it
    keeps loses about a quarter of its grains (bytes) at the ring. Our packet goes
    through, a little smaller.
  - Proposed numbers: gate 2 `keep: 0.1, shrink: 0.75` (1 MHz → about 100 kHz; 10 GB/s ÷
    100 kHz = 100 kB a kept crossing against 4 TB/s ÷ 30 MHz = 133 kB read out, so 0.75,
    all design figures). With gate 1's 1/30 that is Π = 1/400. Lab 1 used `shrink: 0.075`
    alone.
  - Raise `packets` to about 3 600-5 400 (`per` 14), so that 6-9 knots stand on each side of
    the gate in this frame. This answers the prototype verdict ("a mostly empty frame").
    Trigger budget: about 50-75k, so keep the slide under the cap (see Budget).
- **On screen:** `100` kHz, `10` GB/s.
- **Notes:**
  - *Message:* The second gate reconstructed each kept crossing in full and kept about 1 in
    10, about 10 GB a second.
  - *Picture:* The ring is HLT2. Reconstructing means joining the hits into tracks and
    particles. The dust is the dropped crossings. The knots past it are the kept
    crossings, stored about a quarter smaller on average.
  - *Caveats:*
    - Many kept crossings were written as reconstructed objects only (Turbo, about 10 kB);
      the design average was about 100 kB a kept crossing. Never say "most of them
      compact" over this picture: the knots shrink by a quarter, not by 13 times.
    - 10 GB/s and about 100 kHz are design targets in the sources, not measured averages
      over Run 3. A 2026 target may have been set a little lower (unread).
    - The 0.1 and 0.75 split is our arithmetic (`lhcb-hlt2-keep-1-in-10-worked`, to be
      added). It uses the design rates; the 2024 sizes (Turbo about 10 kB, Full 34-115 kB,
      68 % Turbo in the design) would give a smaller mean, so the 0.75 is a design figure,
      not a measured one.
    - HLT2 runs on CPU servers ("more than 3 000").
  - *Sources:* SMARTHEP trigger summary, arXiv:2408.03881 §1.3; CTD 2023, arXiv:2412.05041;
    home.cern, March 2023 (real-time analysis); LHCb event sizes, arXiv:2506.20309; worked.
- **Facts:** `lhcb-hlt2-output-rate`, `lhcb-run3-hlt1-1mhz-out`, `lhcb-run3-readout-4tbs`,
  `lhcb-realtime-analysis`, `lhcb-event-sizes-2024`, `lhcb-allen-gpu`. Missing:
  `lhcb-hlt2-keep-1-in-10-worked` (1 MHz in from `lhcb-run3-hlt1-1mhz-out`, about 100 kHz
  out from `lhcb-hlt2-output-rate`, so keep about 0.1; 10 GB/s ÷ 100 kHz = 100 kB against
  4 TB/s ÷ 30 MHz = 133 kB, so the mean byte share is about 0.75; all design figures).
- **Prototype:** yes, dense, and the weak one ("Gate 2 is the weak one"). The proposed keep,
  shrink and packets change the prototyped picture, so reshoot lab 1 slide 6 with them and
  get the owner's yes before roll-out.

## Part 5. Archive (1.5 min)

### Slide 11 · clip · 0.2 min + 12 s clip

- **Pose:** the space under the clip sits at slide 12's key-0 pose (far out over `bytes`).
- **Picture:** clip `cern_footage_2020_042_001_tape_library.mp4` (CDS 2728761, cut 7-19 s,
  12 s): the TFinity tape library's racks lined up and closed into one wall. The last frame
  is the empty, finished row.
- **On screen:** nothing.
- **Notes:**
  - *Message:* What both gates kept went to tape.
  - *Picture:* CERN's tape library being installed in August 2020: LTO tape, 15 000
    cartridge slots, room for 48 drives.
  - *Caveats:* This is one library in the CERN Data Centre, not all of CERN's tape.
  - *Sources:* CERN video 2728761.
- **Facts:** `cern-tape-library-2020`.

### Slide 12 · kept a day · 1.1 min

- **Pose:** `bytes`. A one-key cut under the clip's last frame to far out, `{ at: [404, 4,
  0], dist: 70, yaw: -4, pitch: 10 }`, then a crane in to `{ dist: 28 }` by 6 s. `dim: 0.2`,
  `ambient: 0`, `steady: true`. `steps: { g1: 1, tb: [2, 4] }`.
- **Picture:** dk-lineup: one day's kept pile (864 spheres, 864 TB, white: `color: 'sel'`)
  beside one day's readout (345 600, light blue). It is 400 times smaller by volume, about
  7 times narrower.
- **On screen:** `864` TB (name "kept"), `345.6` PB (name "read out").
- **Notes:**
  - *Message:* The two gates kept about 1 byte in 400: 864 TB a day of the 345.6 PB read out.
  - *Picture:* The small white pile is a day of what reached tape. The large one is a day
    of readout, the same pile as slide 6.
  - *Caveats:*
    - Said aloud: 30 × 10 = 300 in crossings; each kept crossing was also stored smaller,
      about 100 kB instead of 133 kB, so in bytes it is about 400 (`lhcb-upgrade1-trigger`;
      the split is `lhcb-hlt2-keep-1-in-10-worked`, once it exists).
    - The ×400 pairs with 4 TB/s (one source).
    - The 864 TB goes to tape before Sprucing. Sprucing then reduced it to 3.5 GB/s for
      disk.
    - Design rates, past tense.
  - *Sources:* LHCb, JINST 19 (2024) P05065; LHCb Sprucing rates (2025); worked.
- **Facts:** `lhcb-kept-864tb-per-day-worked`, `lhcb-upgrade1-trigger`,
  `lhcb-raw-345pb-per-day-worked`, `lhcb-sprucing-rates`, `lhcb-run3-end`. Missing (cite
  once it exists): `lhcb-hlt2-keep-1-in-10-worked`.
- **Prototype:** none. A dk-lineup array step (`[2, 4]`), a pile with `at` and a `sel`
  pile were never rendered (t1.md "Not verified").

## Part 6. Close: one row (2.6 min)

### Slide 13 · one crossing, one row · 1.4 min

- **Pose:** `lhcb`, past gate 2 at the lane's end: `{ at: [96, 0, 0], dist: 9, yaw: -14,
  pitch: 8, dim: 0.2, ambient: 0, steady: true }`. `steps: { trg: 5, g2: 1 }`. The floor
  fades in below. (With the grant, no click; with the fallback, no click either.)
- **Picture:** our kept packet folds out of the lane into one white grain (dk-trigger
  `ours: { at: 98, fold: true }` at step 5; `collapse` set past the last step so nothing
  else folds). dk-spark s2 rings it (`core: true`).
- **On screen** (requested: four numbers at once, an `onscreen` exception):
  - `1 880.6` MeV/c² (name "mass"), `3 001` MeV/c (name "pT"), `0.413` ps (name "decay
    time"), `1 299` (name "IPχ²"), together, as one row.
  - Fallback if the owner refuses the grant: `1 880.6` MeV/c², `3 001` MeV/c and `0.413` ps
    at once (three, within bible §3), IPχ² said in the notes only, and the takeaway reads
    "What survives is a row of numbers", so T2 (mass) and T3 (decay time, IPχ²) lose
    nothing. Never split the row into pairs over a click: that undoes the idea of one row.
- **Notes:**
  - *Message:* A kept crossing, reconstructed, becomes rows of numbers. For a pair of
    tracks that may come from one short-lived particle, four of them.
  - *Picture:* The white grain is one row of record 401: the mass of the two-track pair,
    its momentum across the beam (pT), how long it lived before decaying, and how far its
    path misses the collision point in units of the measurement error (IPχ²). Two of the
    row's numbers, pT and IPχ², are the kind the gates looked at (notes only; needs
    `lhcb-hlt1-selections`).
  - *Caveats* (bible §2; all three must be said):
    - The crossing drawn on the cover (record 24506) is a different real crossing from this
      row's.
    - Record 401's rows were recorded in Run 1 (2011-12), under a different trigger from
      the Run 3 one drawn here; the masterclass guide calls the sample randomly collected.
      (Which trigger or stream the sample came from needs `lhcb-record401-run1-trigger`,
      missing. Never say the rows "passed the Run 1 trigger" or that its first stage was
      hardware until it exists.)
    - The data-taking year is not settled. The record states none, the masterclass guide
      says 2011, and a 2015 paper says 2012. Say "Run 1 (2011-12)", without 7 or 8 TeV.
    - Values are float32 from the file: 1 880.649 MeV/c², 3 000.953 MeV/c, 0.41271 ps,
      1 299.167.
  - *Sources:* CERN Open Data record 401; the CERN Open Data LHCb masterclass guide
    ("a sample of randomly collected LHC interactions during 2011 data taking");
    PoS(EPS-HEP2015)358.
- **Facts:** `d0-row1-values-worked`, `lhcb-record401-year`. Missing:
  `lhcb-record401-run1-trigger`, `lhcb-hlt1-selections`.
- **Prototype:** no §4 mechanic. `ours` with `fold` was built and never rendered (t1.md
  "Not verified"), so it needs its own sparse shot.

### Slide 14 · the heap · 1.2 min (T2's cover pose)

- **Pose:** `floor`. A `path` from the fold point down to the heap:
  - `[0, { at: [98, -3, 0], dist: 10, yaw: -12, pitch: 14 }]`
  - `[8, { at: heap + [0, 1.8, 0], dist: 16, yaw: -12, pitch: 12 }]`, lab 2 slide 1's
    settled-heap pose.
  - `dim: 0.2`, `ambient: 0`, `steady: true`, `sway: 1`.
  - `steps: { trg: 0, heap: 1, g2: 1, s2: 2 }`.
- **Picture:** dk-heap step 1: 91 583 light-blue grains rain onto the series floor in about
  6 s. Our white grain glides down from the lane after them and settles last, on the
  summit, with its ring.
- **On screen:** `<StageCount for="heap" :to="91583">` (name "candidates"). Tiny `.credits`
  line: kit LHCb geometry (GPL-3.0 / Apache-2.0).
- **Notes:**
  - *Message:* Each row is a candidate: two tracks that may come from one short-lived
    particle, a D⁰ meson. Talk 2 shows how the pair gives the mass. A dataset is a pile of
    such rows: 91 583 candidates from one LHCb file, the pile the next four talks work on.
  - *Picture:* Each grain is one row of record 401. The white one with the ring is ours.
    All of these were recorded and kept; from here light blue is every candidate, and
    white will mark what a selection keeps (talk 2 on).
  - *Caveats:*
    - Say "candidates". The portal counts 53 948 events (recorded crossings), and one can
      hold more than one D⁰ candidate.
    - Most of these grains are not D⁰s (T2 counts the excess).
    - The heap is unsorted: no axis, no histogram (T2).
  - *Misconception:* "a row is a D⁰". Nobody can say whether one row is a D⁰ (T3 gives our
    row a signal share of 0.144).
  - *Sources:* CERN Open Data record 401 (CC0), DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR.
- **Facts:** `record401-candidates-91583`, `record401-licence-cc0`.
- **Prototype:** not a §4 mechanic in T1. dk-heap rain (step 1) was never rendered, and the
  hand-over of our grain from dk-trigger's fold to the heap's summit has no form yet (open).

---

## Minutes

| part | slides | min | clip s |
|---|---|---|---|
| Cover | 1 | 1.5 | |
| Forty million a second | 2-4 | 2.0 | 12 |
| Bytes | 5-7 | 2.2 | |
| The gates | 8-10 | 4.0 | |
| Archive | 11-12 | 1.3 | 12 |
| Close | 13-14 | 2.6 | |
| **total** | 14 | **13.6** | **24 (0.4 min)**, so **14.0** |

Changes in the revision: slide 4 0.5 → 0.2 (its LHCb sentence moves to slide 5), slide 5
0.6 → 0.9, slide 7 0.6 → 0.5 (no misconception line), slide 13 1.3 → 1.4 (the four plain
definitions). The total stays 14.0.

## Ladder check

T1 is the first talk, so every idea must be introduced in T1 before it is used, and none of
T2-T5's ideas may appear.

| idea | introduced | used again |
|---|---|---|
| bunch crossing, 25 ns | 1 (picture), 2 | 3, 8 |
| track (path of one charged particle, rebuilt from hits) | 1 (notes) | 10, 13, 14; T2-T4 |
| 40 MHz slots and 30 MHz non-empty | 3 | 8 (30 MHz in) |
| collisions per crossing (pile-up) | 4 (ATLAS), 5 (LHCb's 5) | (notes only after) |
| readout, bytes per second | 5 | 6, 7, 9, 12 |
| VELO (the pixel detector about 5 mm from the beam) | 5 (notes) | T3 slide 9 (its ladder row should read "VELO: T1") |
| a day of readout (345.6 PB) | 6 | 12 |
| tape (1.3 EB) | 7 | 11, 12 |
| packet = crossing, the lane | 8 click 0 | 9, 10, 13 |
| trigger, gate 1 (HLT1), GPUs, dropped is gone | 8 | 9, 10 |
| what HLT1 looked for (large momentum across the beam, tracks missing the collision point) | 8 (notes only) | 13 (pT, IPχ²) |
| buffer, "decide later" | 9 | 10 |
| reconstruction (joining hits into tracks and particles), gate 2 (HLT2) | 10 | 12, 13 |
| Turbo | 10 (caveat only) | |
| ×400 | 12 (built from 8 and 10, with the 133 → 100 kB shrink said aloud) | |
| row of four numbers: mass of the two-track pair, pT, decay time, IPχ² (one plain clause each) | 13 | T2 (mass), T3 (decay time, IPχ²: "T1's fourth number"), T4 (pT) |
| candidate (two tracks that may come from one short-lived particle), D⁰ meson | 14 | T2 cover on |
| the heap of 91 583, our grain | 14 (our grain also on 13) | T2 cover |

- "Event" is never used on screen or in the narration. Where a source says "event", the
  notes say "crossing" or "kept crossing"; it stays only as a record field in ids
  (slides 1 and 4) and in slide 14's caveat, glossed there as "recorded crossings".
- Kept out: histogram, √N and σ (T2); the D⁰ mass built from a K⁻π⁺ pair (T2), decay time as
  a lifetime, the IPχ² cut (T3); classifier (T4; HLT1's selections are not called
  learned); record bytes and hash, open release (T5).

## Entrances

- **Cover entrance:** a cold open from nothing. The camera flies about 9 s from far out
  (`dist` 260) into the LHCb detector. The dust thins as `ambient` falls to 0, the bunches
  meet as the camera lands, and the world drops to `rate` 0.02 (bullet time, `cameraRate:
  1`). The plain title fades in at about 8.6 s, as the bunches meet, and holds over the
  bullet time. The debris hangs round the white spark at the vertex under it.
  - T5's close cranes back to this landing pose: `lhcb`, `{ at: [3, 0.4, 0], dist: 12, yaw:
    -24, pitch: 10 }`, to be fixed in framing.
- **Gate 1 is load-bearing for T4:** slide 8's pose (`[32, 0.2, 0]`, dist 22, yaw -6,
  pitch 6) and its gate-1 step (`trg: 1 → 2`) are reused by T4 slide 17; change them only
  together. T1 owns `30` and `1` MHz on screen (T4's critique decides whether T4 shows the
  burst without numbers).
- **Close entrance:** our packet folds out of the lane past gate 2 into one white grain
  (slide 13). On slide 14 the camera follows it down to the floor while 91 583 grains rain
  under it, and it settles last on the summit.
  - **The last frame is T2's cover pose:** the settled heap (`radius: 4`, light blue, our
    grain ringed on the summit), seen from `heap + [0, 1.8, 0]`, `dist: 16, yaw: -12, pitch:
    12`, `dim: 0.2`, `ambient: 0`, `steady: true`.
  - T2 opens on the same heap at the same relative pose, and our grain lifts into dk-vertex.

## Drop order (if the timing gate is over)

1. Slide 7 (the 1.3 EB pile): −0.5 min. 3.8 days moves to slide 6's notes, and slide 9's
   misconception keeps the buffer's 2.1 h.
2. Slide 4 (ATLAS clip): −0.4 min. Pile-up is narrated over slide 3's glow.
3. Slide 11 (tape clip): −0.4 min. Slide 12 opens by flight from slide 10.
4. Slides 2 and 3 merge into one slide with a click (glow 1 → 2): −0.6 min.
5. Slide 5 merges into slide 6 (path key 0 at the detector's exit): −0.4 min.

Never dropped: the cover, gate 1, the buffer (the misconception), gate 2, slides 13-14 (the
row and T2's cover).

## Open

- **Prototype verdicts.** The owner's yes on dk-trigger gates (slides 8-10) is outstanding
  (bible §7 Q10). Gate 2's proposed change (keep 0.1, shrink 0.75, about 4 500 packets,
  dist 7) needs a reshot dense pair first, and slide 9's flood click needs its own dense
  shot once the kit key exists.
- **Kit request (slide 9, for `requests-t1.md`, owner: t1/core):** a dk-trigger step key
  that turns gate 1 off while the buffer stays on (a per-step gate `off` list, or
  `buffer.flood: <step>`). Fallback: no click, `30` PB and `2.1` h on screen, 80 h in the
  notes. This lane writes only the outline and the talk's CLAUDE.md, so the main loop
  files it.
- **Unrendered mechanics:** dk-trigger `fold` (slide 13), dk-heap rain (slide 14), our
  grain's hand-over from the fold to the heap's summit (no form does it; dk-heap has no
  `oursFrom`), dk-lineup array steps, `at` and a `sel` pile (slide 12), buffer and gate 2
  on separate steps (slide 9), the cover's title fade at 8.6 s, and `crossing: 0` from
  slide 2 (does a faded `lhc-collision` still count against the cap? Budget case a or b).
  Each needs a sparse shot.
- **Components to lift with T1** (bible §4): `Crossing.vue` + `slideNav.js` and `Clock.vue`
  from MasterTalk. Check the names against the unplugin-icons prefixes (`LabCrossing`
  broke). Without Clock, slide 2 shows only 25 ns.
- **Four numbers on slide 13:** requested as an `onscreen` exception ("slide 13: four
  numbers at once"). Record it in bible §7 (the main loop; this lane cannot write the
  bible) and it is recorded in the talk's CLAUDE.md Arc. Fallback as on slide 13: three
  numbers, IPχ² in the notes, takeaway "a row of numbers".
- **Bible §2 must change** (the main loop): its second "three things" statement, "the
  record 401 rows passed the Run 1 trigger, not the Run 3 one", is unsourced and the only
  source points the other way. Replace it with "the record 401 rows were recorded in Run 1
  (2011-12), under a different trigger from the Run 3 one; the masterclass guide calls the
  sample randomly collected", and drop "passes both gates and becomes this row" under
  "T1:" in favour of "our white packet stands in for a crossing; the row it becomes is
  row 1, from a different crossing". Bible §7 Q6 stays open.
- **Missing facts** (research, then the deck draft):
  - `lhcb-record401-run1-trigger`: which trigger or stream record 401's sample came from
    (the guide says "randomly collected"; a no-bias or minimum-bias stream would mean it
    passed no physics gate at all).
  - `lhcb-hlt1-selections`: what HLT1 selected in Run 3 (large-pT tracks, tracks with a
    large impact parameter, muons), from the Allen/HLT1 papers or the Run 3 Starterkit.
  - `lhcb-hlt2-keep-1-in-10-worked`: the 0.1 / 0.75 split (worked, design figures; inputs
    on slide 10).
  - `lhcb-crossing-24506-event`: the cover crossing's own numbers (none are shown, so this
    only matters if the cover ever gains a number).
- **Live deck:** a show-machine rehearsal of slide 1 (the heaviest) and slide 14. Either
  may need `recorded: plate`.
- **Claims to watch:** the 10 GB/s 2026 target (an unread 2025 LHCb talk), the 200-or-500
  GPU count, and the design-only 0.75 shrink against the 2024 event sizes.

## Decisions (deck draft, draft:data1trigger, 29 Oct)

Where the deck departs from the outline above, and why. The owner's decisions of 29 Oct
(bible top block) win over the outline's text.

- **No experiment internals, no named decay.** The outline predates the owner's 29 Oct
  decisions. In the deck the trigger stages are "the first filter" and "the second
  filter" in every Message, Picture, Caveat and Misconception line; the VELO caveat
  (slide 5), the GPU count (slide 8: the `500` GPUs number is dropped, so slide 8 shows
  `30` MHz "in", then `1` MHz "out"), the reconstructed-only format and the CPU farm
  (slide 10) are gone or reworded without names. Record numbers stay in Sources only.
  Slide 14 says "a short-lived particle", never its name.
- **Slide 13: three numbers, not four.** The fourth number's name is banned on screen, so
  the outline's own fallback is taken: `1 880.6` MeV/c² mass, `3 001` MeV/c pT,
  `0.413` ps decay time at once; the fourth is said only, as "how far its path points
  from the collision". The takeaway reads "What survives is a row of numbers".
- **The collision is not stepped by `steps:`.** `lhc-collision` listens to the
  lhc-opening bus, not the stage's step bus, so `crossing: 0/1` in frontmatter would do
  nothing. `setup/Crossing.vue` (talk-owned, MasterTalk's without slideNav) starts it
  when the cover opens and fades it (1.6 s) when the cover is left. The object's
  `approach: 8.3` makes the bunches meet 8.3 s in, as the 9 s path lands and the rate
  falls (8.6-9.2 s). stage:check counts the collision's 200k on every slide (no step
  drives it): at most about 535k at tier 0, under its 600k budget.
- **No Clock.** `Clock.vue` is not lifted: slide 2 shows `25` ns alone (the outline's
  fallback). Lifting it into the kit is a kit request.
- **Slide 9's flood click uses the kit's `off: [4]`** (gate 1 off at step 4, the buffer on),
  as lab 1 does; slide 10 opens on step 3 (gate 1 long on) and its click jumps 3 → 5,
  which fires gate 2 only. The `80` h line swaps for `2.1` h in place on the click.
- **Slide 10's numbers come with the click** (`100` kHz, `10` GB/s), so click 0 is the
  picture alone (gate 2 dark, whole knots passing).
- **The hand-over from the fold to the heap** uses `dk-heap oursFrom` on `fp`, an invisible
  dk-spark at the fold point ([98, 0, 0] world), not on `trg`: slide 14 hides the lane,
  and a cold-opened slide 14 would otherwise start the glide wherever the hidden lane
  puts its packet. `s2` rings our packet on slide 13 (`on: trg`) and our grain on 14
  (`on: heap`). Slide 14's path starts at slide 13's pose (a flight down with the grain).
- **Slide 12:** the kept pile carries no world label (`864 TB` shows once, in `.nums`).
- **Slide 4's Message** names ATLAS for the 60 (the fact is ATLAS's figure only).
- **The cover title** is one `# The trigger`, styled in `styles/index.css` as the stage's
  cover title (no kicker), fading in at 8.4 s; the stage also holds it until the path
  lands. The lint reads the headmatter's `onscreen: numbers` as slide 1's own, so it flags
  the cover's title as TEXT (a false positive; open item for the main loop).
- **Facts held off the deck:** what the first filter looked for (`lhcb-hlt1-selections`)
  and which stream record 401's sample came from (`lhcb-record401-run1-trigger`), in
  `notes/facts-needed.md`. Slide 8's notes say only that it is not said.
- **The cover's landing moved** from `[3, 0.4, 0]` to `[-1.5, 1.4, 0]` (dist 12, yaw −24,
  pitch 10), so the crossing sits right of and below the title with black round the
  title (the first sheet had the title over the tracks). T5's close cranes back to this
  pose; the `lhcb` station's look target matches it.
- **Slide 14's count** runs on its own 6.5 s clock: `for="heap"` landed on 91 584 in the
  shots (kit request 4).
- **Fresh-eyes fixes (fix:data1trigger, 29 Oct).** The readout stream (slides 5, 8) is
  light blue, the crowd (the detector's `hot: '#7dd3fc'`); slide 5 ends closer
  (`[6, 0.5, 0]`, dist 16) with `dim: 0`. `.nums` sits 200 px up, clear of the lower third.
  Slide 3 shows `40` MHz only and gets its own pose (a cut, yaw −60, dist 22); the 30 MHz is
  said and comes on screen on slide 8; its white sparkle is kit request 5. Slide 6 ends from
  the small piles' side (`[402.5, 2.8, 0]`, dist 15, yaw −42) so the 1 TB sphere and the
  pile of 4 stay at 10 px or more (the day's sphere is cut by the frame's top; at dist 26
  the small piles were 3-6 px); slide 7 keeps the day's
  `345.6` PB/day as its first line. Slide 8 runs on a second, sparse dk-trigger (`lane`, 600
  knots, gate 1 only) so knots stand apart, with dk-spark `s1` ringing ours (`on: lane`);
  slides 9-10 return to the dense `trg` (slide 9 is now a cut) with `s1` on `trg`.
  Slide 10 is framed at `[67.5, 0, 0]`, dist 10. Slide 13 says "momentum" (pT in the
  Picture line only) and is posed at `[98, 0, 0]`, yaw −20 (slide 14 starts there);
  slide 13 is 1.8 min and slide 1 1.2 min. The cover title is set in Space Grotesk.
- **Slide 4's gold.** The ATLAS display's tracks are gold-olive: real footage, CERN's own,
  the only gold in the talk; accepted as it is (the house look's "never gold" governs what
  we draw). The alternative, a cut starting after the pull-back, would lose the pile-up
  vertices the slide is about.
- **Motion review fixes (final:data1trigger, 29 Oct).** Poses and timings changed on slides
  2-8 and 11-14 (slide 8 now lands at the gate, dist 8, yaw −15, not dist 22; slide 6 ends at
  `[403, 3.5, 0]`, dist 22, yaw −76; slide 13 at pitch 14; `trg` gains step 7 for the fold;
  slide 4's cut starts at 22.4 s; the tape cut has a dim tail). The list and the reasons are
  in the talk's CLAUDE.md, Decisions, 2026-10-29 final:data1trigger.
