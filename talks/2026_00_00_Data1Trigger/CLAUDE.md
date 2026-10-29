# Data1Trigger (talks/2026_00_00_Data1Trigger)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data1trigger.md, never here.

## Brief

Talk 1 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: a collision becomes data: the detector, 40 MHz of bunch crossings, the trigger, what is kept.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 2 `Data2Peak` (counting and noise); 3 `Data3Fit` (fitting a model); 4 `Data4Learn` (from a perceptron to machine learning); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
- Event: none yet; an explainer series. Date `2026_00_00` (placeholder).
- Duration: 15 min each (`duration: 15min`), no questions inside.
- Delivery: recorded video (`pnpm talk record`: per-slide MP4s the owner
  narrates over) and a live 16:9 deck on a projector. 1080p web tier.
- Audience: university STEM students from any field, no particle physics
  assumed (the course's audience).
- Language: English on screen and in the notes.
- On screen: pictures and numbers only (root CLAUDE.md, talk-quality §3);
  the cover keeps a plain title. The owner narrates and does not read
  notes; notes carry sources, `<!-- facts: -->` ids and `(~N min)`.
- Quality bar: "visual good quality, not sloppy explainers / diagrams":
  real data and real footage over stand-ins, one dominant picture a slide,
  every form in the world carries what the slide says.
- Look: slidev-addon-stage v0.11.0, palette `classic` (cyan `#7dd3fc` on
  near-black, the course's accent), shared by the five talks.
- Must-haves and banned claims: from the series bible; facts only from the
  bank (`pnpm talk facts search`).
- Private brief: ~/.local/share/outreach_talks/briefs/data1trigger.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data1trigger` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- 2026-10-29: deck draft (draft:data1trigger): 14 slides, 14.0 min, the owner's 29 Oct
  decisions applied (outline Decisions at its end); check, kit check and map green;
  lint 0 errors (one TEXT false positive on the cover, see the outline's Decisions).
- 2026-10-29, final (final:data1trigger): every high and medium finding of the motion review
  fixed in the deck, or filed where only the toolkit or the kit can fix it
  (notes/kit-requests.md 6-14); slides 2-8 and 11-14 re-recorded (1280x720, 25 fps, in the
  session scratchpad's decks/data1trigger/rec-final) and checked by luma and contact sheets.
  Slide 12's flash: frame jump 50 → 17 luma, peak 147 → 50; slide 4's pop: largest jump
  23.9 → 9.0, the tracks lit from 1.2 s instead of 2.2 s; slide 13 frames the knot at 0 s and
  folds it by 0.8 s, numbers from 1.5 s; slide 6 opens on the 1 TB sphere and holds the
  whole day with the small piles from 6 s; slide 7 gathers the tape pile far off (peak luma
  17 → 11); slide 8 lands at the gate, where the click's burst fills the frame; slide 2's
  pulses 2.1 → 1.5. `pnpm talk check`, `check.mjs`, lint (0 errors, the cover's known TEXT
  warning) and map green. Map: 14 slides, 14.1 min timed (13.7 min of notes + 23.6 s of
  clips), headmatter 15 min.
  - Open: the toolkit's clip hand-over blink (slides 5, 12) and late dust arrival (slides 4,
    11), the recorder's frame 0 (every take shows the slide before for one frame), the
    per-click camera key for slide 8, the dim tail as a manifest field (kit requests 10-14);
    slide 13's floor does not show at that distance (kit request 9); the low findings: slide
    1's fly-in (ambient, the ring gathering at the crossing), slide 10's one-frame spike (kit
    request 7), slide 14's series cut (T2's cover, data2peak's own fix); T4's echo of slide
    8's gate pose (dist 22) no longer matches T1's (dist 8): T4's call.
  - Next: the main loop commits; then `pnpm talk record data1trigger` for the full set of
    takes once the toolkit's hand-over fix is out, and `pnpm talk deploy data1trigger` when
    the owner says so.
- 2026-10-29, polish (polish:data1trigger): the series' one look, the series check's findings
  for T1 and the kit steward's deck changes (Decisions, 29 Oct polish). `pnpm talk check`,
  `check.mjs` (0 warnings), lint (0 errors, 0 warnings: the cover's TEXT false positive is gone
  with the lint fix) and map (14 slides, 14.1 min timed) green; shots of every slide with the
  sheet (slide 1 "not settled" by design), plus slides 8-10 at their click (slide 9's 2.1 h stands
  where 80 h stood; slide 8's spray shows). Not seen: every motion change (ring gathers on slides 1 and 13, spray and staggered
  bursts on slides 8 and 10, slide 12's piles gathering as the clip clears): they need a motion retake (`pnpm talk record data1trigger`).
  - Open, other decks' fixes from the same series check (not this talk's directory): T5's
    close to land on this cover (dim 0, sway 0.5, the ringed point at the vertex), T2's heap to
    match this heap's alpha (both leave dk-heap's default; T2 decides what differs), T2/T3's
    `.name` span on the cover title.
- 2026-10-29, fix (fix:data1trigger): the second review's findings (Decisions, fix:data1trigger).
  Fixed: slide 10 (ours leaves the buffer and waits before gate 2's ring, the ring seen at an
  angle and brighter, a new `trg` step 5, gate 2 on 6); slide 8 (yaw −50 landing, gate 1's ring
  reads as a ring before and after the click, lane above the numbers); slide 9 (lane and shell
  above the numbers, also after the click); slide 2/5 (the detector in dust blue at alpha 0.6, so
  the fronts and the stream stand out, no white VELO blob); slide 12 (both numbers in TB, the
  kept pile clear of the text); slide 7 (the small piles leave); slide 1 (muon tracks light blue,
  the ringed point the only white, though the dense forward bundle still reads pale).
  Partly: slide 6 holds the 1 TB sphere and the pile of 4 for 4.5 s before the pull-back, and
  ends with them in the foreground under the whole day (pile of 4 about 40 px), but the
  metal spheres are dark at that distance, so in the still they read as a few dots; a whole day
  and a larger pile of 4 do not fit one frame at the current `gaps` (a gap of 9 instead of 1.6
  would give about 47 px and 400 px clear of the day, but moves slides 7, 11 and 12's targets).
  Not done: slide 14's record-only fade (kit request 15). `pnpm talk check`, `check.mjs`
  (0 warnings), lint (exit 0, 0 errors, 0 warnings), map (14 slides, 14.1 min timed) green;
  shots of every slide with clicks 8-10 and the sheet (slide 1 "not settled" by design).
  Not seen in motion: slide 6's hold and late day, slide 10's glide out of the buffer, the
  brighter rings' fire.
  - Open: kit request 16 (T4 and T5 to take this deck's detector colours, T5's close lands on
    this cover); T4's echo of slide 8's gate pose (now yaw −50, dist 10): T4's call.
  - Next: `pnpm talk record data1trigger -- --slides 6,8-10` to see the motion changes, then the
    full take once the toolkit's hand-over fix is out; `pnpm talk deploy data1trigger` when the
    owner says so.
- Branch `talk/data1trigger`, worktree `.claude/worktrees/data1trigger` (`pnpm talk open data1trigger`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data1Trigger/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data1trigger.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From
`notes/outline.md` (revised 29 Oct, revise:data1trigger; fix:data1trigger; final:data1trigger);
13.7 min of notes plus 23.6 s of clips = 14.1 min.

1. Cover: a 9 s cold open into LHCb, a real 2012 crossing (record 24506) in bullet time, a white spark at the vertex, the plain title fading in at 8.6 s / each crossing is read out whole, like one camera frame; a track is one charged particle's path; the spark stands in for any crossing (row 1 comes from a different one) / 1.2 min
2. Fronts: one light-blue front a crossing down the detector (the cover's crossing fades out), `25` ns / bunches crossed every 25 ns, the fronts slowed about 7 × 10⁷ times / 0.9 min
3. Glow: a cut to a wider pose; the fronts merge into one glow, `40` MHz slots / 40 million slots a second, about 30 million with colliding protons, said only (LHCb's round design figure; the bunch count caps it at 28.1 MHz) / 0.9 min
4. Clip: ATLAS pile-up display (CDS 2300480, 11.6 s, cut from its first lit frame), nothing on screen / one crossing holds several collisions; ATLAS in Run 3 up to about 60 / 0.2 min + 11.6 s
5. Readout: from inside LHCb, a crane out as the hits stream out of the detector in light blue, `4` TB/s / about 5 collisions a crossing at LHCb; full readout made about 4 TB a second / 0.9 min
6. One day: dk-lineup, the 1 TB sphere and the pile of 4 held 4.5 s, then the pull-back as the day's pile of 345 600 gathers (the small piles stay in the foreground, about 40 px), `345.6` PB/day / a day of full readout would have been 345.6 PB / 0.8 min
7. CERN's tape: the small piles leave; the 1.3 EB pile beside the day, `345.6` PB/day, `1.3` EB, `3.8` days / under four days of readout was as much as all of CERN's tape (size only) / 0.5 min
8. Gate 1: a flight along a sparse lane (knots apart), then on the click the first filter bursts 29 of 30 knots to dust; ours passes white and ringed, the rest light blue; `30` MHz in, then `1` MHz out / a program kept 1 crossing in 30 before anything was stored, keeping pace with 30 million a second (what it looked for: fact pending) / 1.5 min
9. Buffer: kept knots park on a turning shell, `30` PB and `80` h; click: the first filter off, the lane floods it, `2.1` h replaces 80 h (kit `off: [4]`) / only what the first filter kept could wait; the second decided later from 30 PB of disk; store everything and it fills in 2 h / 1.2 min
10. Gate 2: ours leaves the buffer and waits before the second filter's ring (seen at an angle), then on the click it drops 9 of 10 knots and each kept knot loses a quarter, `100` kHz, `10` GB/s / the second filter reconstructed (hits joined into tracks and particles) and kept about 1 in 10, about 10 GB a second / 1.3 min
11. Clip: CERN's TFinity tape library installed (CDS 2728761, 12 s), nothing on screen / what both gates kept went to tape / 0.2 min + 12 s
12. Kept a day: a white 864 TB pile beside the 345 600 TB day, `864` TB kept, `345 600` TB read out (one unit) / about 1 byte in 400 kept: 300 in crossings, and each kept crossing stored at about 100 kB instead of 133 kB / 1.1 min
13. One row: our packet folds into one white grain, ringed, over the fading-in floor; `1 880.6` MeV/c² mass, `3 001` MeV/c momentum, `0.413` ps decay time at once (the owner's 29 Oct decision: the fourth number is said only, as "how far its path points from the collision"; takeaway "a row of numbers") / a kept crossing becomes rows of numbers: pair mass, momentum across the beam, decay time, and how far its path points from the collision, each in one clause; the row is from a different 2011-12 crossing under a different trigger, a sample the guide calls randomly collected / 1.8 min
14. The heap: 91 583 light-blue grains rain onto the floor, ours glides down from the fold and settles last on the summit (T2's cover pose), the count `91583` "candidates" / each row is a candidate (two tracks that may come from one short-lived particle); this pile is what the next four talks work on; nobody can say whether one row is the particle / 1.2 min

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| `25` ns (slide 2) | LHC bunches spaced 25 ns | https://home.cern/science/accelerators/large-hadron-collider | 2026-10-29 | lhc-bunch-spacing-25ns | OK |
| `40` MHz slots (slide 3) | design crossing rate at each interaction point | https://arxiv.org/abs/2305.10515 | 2026-10-29 | lhc-crossing-40mhz | OK (corrected) |
| `4` TB/s (slide 5) | LHCb Run 3 average full readout | https://arxiv.org/abs/2106.07701 | 2026-10-07 | lhcb-run3-readout-4tbs | OK |
| `345.6` PB/day (slides 6, 7; `345 600` TB read out, slide 12) | 4 TB/s × 86 400 s | https://arxiv.org/abs/2106.07701 | 2026-10-29 | lhcb-raw-345pb-per-day-worked | OK (worked) |
| `1.3` EB CERN tape (slide 7) | all CERN experiments' physics data on tape at CERN | https://indico.cern.ch/event/1687157/contributions/7091886/attachments/3293721/5890092/APR2025_FC.pdf | 2026-10-12 | cern-physics-data-tape-1p3eb | OK |
| `3.8` days (slide 7) | 1 300 PB ÷ 345.6 PB a day | same as above | 2026-10-29 | cern-tape-3p8-days-worked | OK (worked) |
| `30` MHz in (slide 8) | the first filter's input, non-empty crossings | https://lhcb-starterkit-run3.docs.cern.ch/first-analysis-steps/dataflow | 2026-10-07 | lhcb-hlt1-30mhz | OK |
| `1` MHz out (slide 8) | the first filter's output to the buffer | https://arxiv.org/abs/2408.03881 | 2026-10-18 | lhcb-run3-hlt1-1mhz-out | OK |
| `30` PB buffer, `80` h at 1 MHz (slide 9) | the disk buffer between the filters | https://arxiv.org/pdf/2305.10515 | 2026-10-18 | lhcb-buffer-80-hours | OK |
| `2.1` h full readout (slide 9) | 30 PB ÷ 4 TB/s | https://arxiv.org/pdf/2305.10515 | 2026-10-29 | lhcb-buffer-full-readout-2h-worked | OK (worked) |
| `100` kHz, `10` GB/s (slide 10) | the second filter's design output | https://arxiv.org/html/2408.03881 | 2026-10-29 | lhcb-hlt2-output-rate | OK (corrected) |
| `864` TB kept (slide 12) | 10 GB/s × 86 400 s | https://arxiv.org/abs/2506.20309 | 2026-10-29 | lhcb-kept-864tb-per-day-worked | OK (worked) |
| `1 880.6` MeV/c², `3 001` MeV/c, `0.413` ps (slide 13) | row 1 of the file, float32 | https://opendata.cern.ch/record/401 | 2026-10-29 | d0-row1-values-worked | OK (corrected) |
| `91 583` candidates (slide 14) | the file's entries, one per candidate | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-candidates-91583 | OK (corrected) |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/main.ts`: installs the data kit (`installDataKit({ app, stage })`), the shared
  LHC opening's `lhc-collision`, the kit detector's hits along the 2012 crossing's
  tracks (`setLhcbTracks`), and `<Crossing>`.
- `setup/Crossing.vue`: starts the cover's collision when the cover opens (the bunches
  meet `approach` 8.3 s later, as the path lands) and fades it when the cover is left.
  MasterTalk's, without slideNav; a kit request asks to lift it (notes/kit-requests.md).
- `videos/dim_tail.sh`: re-encodes the tape-library cut with its last 0.6 s darkened to 30 %
  (the manifest has no fade field: kit request 12). Run it after any forced encode of that
  clip, then `videos:frames --force --only` it.
- `styles/index.css`: imports the kit's `nums.css` (the series' number block, one copy for
  all five talks); the series' one cover-title rule (Data2Peak's block) plus this deck's
  fade-in at 8.4 s; `.credit` tiny print on the last slide.

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-28, the owner (chat): the series "Data analysis, the CERN way",
  five 15-min explainers, STEM students, English, recorded video plus a live
  16:9 deck. All four were the recommended options.
- 2026-10-28: toolkit v0.11.0 ("use the latest tools"), pinned with
  `pnpm talk pin`; pnpm dropped `path:`/`gitHosted` from the other talks'
  toolkit tarball resolutions, so main's resolution lines were restored
  (memory: lockfile path keys after a pin). Undo: `pnpm talk pin <talk> v0.8.1`.
- 2026-10-28: palette `classic` for the whole series (the course's cyan on
  near-black; no live talk uses it; never gold). Alternative: `blue` (Tokyo's)
  or a series palette via `definePalette`.
- 2026-10-28: names `2026_00_00_Data<N><Topic>` so the five sort in series order.
- 2026-10-29, the owner (review page and chat): roll out all the kit's forms
  (prototype pairs seen as recorded takes,
  https://claude.ai/artifact/Ef62WwCznaTyo7MKcM8338); cuts between stations;
  keep the record 401 peak as the thread but never name it (no D⁰, K⁻π⁺,
  IPχ² or record numbers in Message/Picture notes or on screen; Sources keep
  the provenance); big picture only: no experiment internals (sub-detector
  and trigger-stage names, GPU counts, CMS/ATLAS analysis counts). Mass axis
  1 816-1 912 MeV (default taken: the answer to that question was "No D0").
  Undo: the series bible's top block (components/data-kit/notes/series-bible.md).
- 2026-10-29, final:data1trigger (the motion review's findings; recommended options taken,
  the owner away):
  - Slide 4's cut starts at 22.4 s, the first lit frame (raw luma 13 until 22.07 s, 120 at
    22.4 s), so the dust gathers into the burst of tracks: 11.6 s instead of 12 s.
  - Slide 11's tape cut keeps its 7-19 s but dims its last 0.6 s to 30 % (talk-owned
    `videos/dim_tail.sh`), so it does not break into white dust on slide 12.
  - Slides 11-12: `tb: 5` moves to the clip slide and the day's pile waits 2.4 s, not 3.8 s
    (slide 6 still shows 1 TB, then 4 at 1.6 s, then the day at 2.4 s), so slide 12's piles
    are gathering as the clip clears; numbers at 1.2 / 1.8 s.
  - Slide 13: dk-trigger `trg` gets a step 7. Step 6 (slide 12, unseen) glides ours on to
    x 98; step 7 folds it where it stands in 1.2 s, so the fold is in frame from the cut;
    collapse moves to 8. Pitch 8 → 14 (24 showed no more floor); numbers at 1.5 / 2.1 /
    2.7 s. Slide 14's first key follows (pitch 14).
  - Slide 6 opens on the 1 TB sphere (`tb: 1` and `g1: 1` from slide 5, far off), holds 1.5 s,
    and ends at 6 s from the small piles' side, `[403, 3.5, 0]`, dist 22, yaw −76, pitch 2:
    the whole day with the 1 TB sphere (8 px) and the pile of 4 (15 px) in front of its foot;
    the day gathers from beyond itself (`from: [1, 0.3, −0.2]`), not across the camera.
  - Slide 7 pulls back first (dist 50 at 2 s, 80 at 5 s); the tape pile gathers from behind
    itself (`from: [0.3, 0.25, −1]`); numbers at 0.3 / 3 / 3.8 s.
  - Slide 8 lands its flight at the gate (`[31, −1.2, 0]`, dist 8, yaw −15, pitch 6) instead of
    a click-time camera key the stage cannot do (kit request 13); the lane's knots are larger
    and brighter (`lane`: size 1.6, alpha 1.3, knot 0.1). T4's slide 17 echoes the old pose
    (dist 22) in its own deck: an open item for T4, not a dependency.
  - Slide 5 ends side on, `[7, 0.5, 0]`, dist 15, yaw −8, so the detector's planes stand left
    of the stream leaving it; `4` TB/s at 1.5 s. The detector's alpha 0.3 → 0.42 (slides 1-5).
  - Slides 2-3: `dim` 0.2 → 0 (the scrim snapped on at the cut from the cover), and dk-glow's
    alpha 0.9 → 0.75 (the fronts' pulse at the inner face).
  - Not changed (toolkit or recorder, kit requests 10-14): the one-frame blink as a clip
    hands over (slides 5, 12), the dust arrival's first second (slides 4, 11), and "the
    previous slide's numbers at the cut", which is the recorder's frame 0 only (every take,
    40 ms), not the live deck.

- 2026-10-29, polish:data1trigger (the series check's findings and the steward's pass; recommended
  options taken, the owner away):
  - The series' one look: `styles/index.css` imports `components/data-kit/nums.css` (left 56,
    bottom 190) and its own `.nums` block and `d1-nums-in` are gone (`.credit` uses
    `dk-nums-in`). The cover title takes Data2Peak's `.slidev-page .slidev-layout.cover
    h1:only-of-type` block (no font-family or text-transform of its own: the stage's face and case,
    which still sets it in capitals); the fade at 8.4 s stays this deck's. The cover title is a plain `<h1>`.
  - A v-click line now rises at its `--dN` counted from its click (nums.css): slide 10's
    `100` kHz and `10` GB/s come 1.5 / 2.3 s after the click, as gate 2 fires (they came at the
    click before); slide 8's `1` MHz 0.5 s after it. Slide 9's swap: `80` h is a v-click.hide
    line and `2.1` h a second one-line `.nums` block (v-click, `--d1` 0.2 s) anchored at the same
    bottom, so it stands where 80 h stood (nums.css's own `.swap` is timed, not clicked).
  - Headmatter `info` rewritten to match the deck (it promised "the script in the notes", which
    the series does not have, and left out the pile and the cover loop).
  - Kit (steward, 29 Oct): `heap` `oursFrom: { at: [-2, 9, 0] }` and no `fp` spark; slide 14's
    count follows the heap again (`for="heap"`); `lane` and `trg` `spray: 0.8, burstSpread: 0.4`;
    the cover's `s1` `delay: 7.8, haloIn: 0.6, haloGather: true` (the point and its ring gather
    in as the bunches meet at 8.3 s instead of standing through the fly-in) and slide 13's `s2`
    `haloIn: 0.6, haloGather: true`; `g2` `alpha: [0, 2.4, 1]` (slide 13 step 1 brighter, slide
    14 step 2 the series floor); the day's pile `wait: { "3": 2.4, "5": 0 }`, slide 11 no longer
    pre-sets `tb: 5`, slide 12 gathers both piles at once and its numbers wait to 2.6 / 3.2 s.
    Not taken: the steward's 3.8 s for slide 6's day (2.4 s was seen and kept in the motion
    review). Undo: `git diff` of this pass.
  - Slide 14's number stays to the end. Tried and reverted: `.nums.out` with `--o1: 13s` (the
    steward's offer for the cut to T2's bare cover): the shots fast-forward CSS animations, so
    the still (and a PPTX or print) lost the slide's only number. The heap brightness at the
    cut is T2's to match: both decks use dk-heap's default alpha and dim 0.2.

- 2026-10-29, fix:data1trigger (the second review's findings; recommended options taken, the owner
  away):
  - Slides 1-5: the detector's parts all in the palette's dust blue (#4d8cb8; alpha 0.42 → 0.6, so
    slide 5's planes still show beside the stream),
    instead of the kit's `detectorParts` (accent on four parts, the preset's near-white on the
    rest): the light-blue fronts (dk-glow alpha 0.75 → 0.9, size 1.2 → 1.4), the hits and the
    white ring are the bright things in it, and the near-white VELO blob beside slide 2's and
    slide 5's numbers is gone. The cover's muon tracks `muonTone` #f2f5f9 → #9fd8ff, so the
    ringed point is the cover's only white. T4/T5: kit request 16.
  - Slide 6: the opening pose holds to 4.5 s while the pile of 4 gathers; the day waits 5 s
    (`wait { "3": 5 }`) and gathers during the pull-back; the end pose `[404, 5, 0]`, dist 17,
    yaw −70, pitch −2 puts the pile of 4 (about 40 px) and the 1 TB sphere (15 px) in the
    foreground under the whole day; `345.6` PB/day at 8.5 s. Slide 7 starts there and its
    lineup step shows piles 2 and 3 only (`sets { "4": [2, 3] }`): the small piles fade.
  - Slide 8's landing `[32, −1.8, 0]`, dist 10, yaw −50: gate 1's ring is seen at an angle (it was
    edge on at yaw −15, a vertical band) and the lane stays above the numbers; the rings brighter
    before they fire (`idle` 0.25 → 0.6, 1 200 grains on gate 1 of `lane` and gate 2 of `trg`).
  - Slide 9: target `[50, −2.5, 0]`: the lane and the shell in the upper middle, the numbers on black.
  - Slide 10: `trg` gets a step 5 (ours glides out of the buffer to x 62.5 and waits before the
    ring); gate 2 fires on step 6 (the click), ours past it on 7 (slide 12), the fold on 8
    (slide 13), collapse 9. Pose `[62, −2.5, 0]`, dist 12, yaw −38, pitch 4: the buffer's exit,
    ours and the ring in the upper half, the numbers on black. Ours waiting on the shell could
    not share a frame with a readable ring without the shell behind the numbers.
  - Slide 12: both numbers in TB (`864` TB kept, `345 600` TB read out); the crane ends at
    `[402, 4, 0]` (was 404), so the white kept pile stands clear of the longer second line.
  - Not done: slide 14's record-only fade of the number and the credit (the recorder sets no
    mark on the page: kit request 15; the credit stays on the last slide by the house rule).

## Review notes

- Slide 1 never settles in the shots (bullet time at rate 0.02 keeps the world moving), so
  the shots report marks frame 01 "not settled" by design; reviews skip that flag. Since the lint
  fix of 29 Oct the cover title passes clean (no TEXT warning).

## Verify

```bash
pnpm talk check data1trigger     # videos:check, stage:check, a build into /tmp/talk-data1trigger/site
pnpm talk review data1trigger    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data1trigger     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
