# Data4Learn (talks/2026_00_00_Data4Learn)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data4learn.md, never here.

## Brief

Talk 4 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: from a perceptron to machine learning: separating signal from background.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 2 `Data2Peak` (counting and noise); 3 `Data3Fit` (fitting a model); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
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
- Private brief: ~/.local/share/outreach_talks/briefs/data4learn.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data4learn` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- Branch `talk/data4learn`, worktree `.claude/worktrees/data4learn` (`pnpm talk open data4learn`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data4Learn/
- 2026-10-29: the draft (`draft:data4learn`): deck.md (17 slides, 14.0 min), space.json
  (six stations: real, toy, valley, ring, rare, gate), setup/main.ts (the kit),
  styles/index.css (.nums, the cover title). check, kit check, lint (one TEXT on the
  cover title, open), map and shots green; decisions in notes/outline.md, kit gaps in
  notes/kit-requests.md, a fact to file in notes/facts-needed.md.
- 2026-10-29: the fresh-eyes review fixed (`fix:data4learn`): the valley seen along its floor
  with w₁/w₂ named, the toy and ring seen close, held-out and test grains brightest, the real
  plot's floor at 0.15 ps with a 50 ps tick, the gate framed close, the cover title in the top
  left, `.nums` at bottom 190 px, slides 7/10/16 at 1.5/1.0/0.75 min (14.25 min). Kit gaps 4-7
  and a series request in notes/kit-requests.md.
- 2026-10-29: the motion review's high and medium findings fixed (`final:data4learn`). Done: no
  black transits (slide 2 tips from 0 s, Y never under 18.7; the cuts to slides 4, 8, 9 and 14
  stand by about 1.8-2.0 s, from 4.1-4.4 s; slide 7 cuts onto a standing valley, Y 17.8 from
  0.16 s); the cover's curve stands with its hist (0.4 s) and the take is trimmed past the boot
  veil (`01-trim.mp4`); click numbers rise after the picture they score (slides 5, 8, 11, 16);
  slide 8's held-out points glide in with no flare; slide 16's ring stands at the frame's centre
  before it fires; slide 17 pans onto the ball, which forms centred from 2.5 s, the count at
  4.5 s, the last frame unchanged (Talk 5's cover). Re-recorded takes (1280x720, 25 fps):
  slides 1-11, 14, 16, 17 in the session's scratchpad `decks/data4learn/rec-final/`.
  check, kit check.mjs, lint (exit 0; the cover title's TEXT warning, accepted) and map
  green. Map: 17 slides, no clips, 14.25 min of 15 (the map rounds to 14.2).
  Open: the valley gathers on slide 6 and its ball cannot wait on the rim (kit requests 3, 8);
  slide 17's fold is still faint between 1.5 and 3.5 s (kit request 13); slides 12-13's depth
  caption timing (kit request 12, low); slide 9's ring reads weakly at roleDim 0.3 (look at it
  in the full take); the two filed-fact requests in notes/facts-needed.md. Next: a full
  re-record for the owner's edit, `pnpm talk record data4learn --out <dir> -- --size 1920x1080`,
  then `pnpm talk review data4learn`.
- 2026-10-29: the series polish (`polish:data4learn`): the kit steward's deck changes, the series
  check's findings and the series' one look. Done: `styles/index.css` imports the kit's `nums.css`
  (own `.nums` block and `dk-nums-click` deleted) and carries Data2Peak's cover-title rule (plain
  `<h1>`, `class: dk-title` and its top-left placement gone); `tickPx` deleted on `h` (kit LABEL is
  36 px); the cover's curve `replay: false` (`draw: 0.1` dropped); the leak's depth on the kit's
  1 816-1 912 range with centred 1 845 / 1 885 ticks and the "mass MeV/c²" caption; the valley's
  captions as `words` (the two `label` objects gone) and slide 7 opening on the ball waiting on the
  rim at 0.693 (`ball: 'start'`), click 1 rolls it to 0.162; slide 5's dust keys; slide 8's held-out
  points `glow: false`; the gate's ring 600 grains at `idle: 0.8`, `collapseTime: 1.5`,
  `ball.gain: 1.4`; slide 16 without the "1 in 30 kept" number (the gate is the learned boundary;
  Talk 1 counted it); slide 11's Picture names the label window (1 845-1 885, a little wider than
  Talk 2's 1 850-1 880). The cover's settled pose moved so the plot clears the series' title
  (Decisions). check, kit check.mjs (0 warnings), lint (exit 0, 0 warnings), map (17 slides,
  14.25 min) and shots with the sheet green. Not seen (motions): the dust keys, `glow: false`,
  `collapseTime`/`ball.gain`, the camera-timed depth labels, the roll after the click. Open: kit
  request 4 (clip a boundary); Talk 5's cover sentence about our grain (its session's change).
  Next: a full re-record (`pnpm talk record data4learn --out <dir> -- --size 1920x1080`).
- 2026-10-29: the series review fixed (`fix:data4learn`, second pass), its strengths kept. Done:
  slide 15's crowd outside the cut nearly black (`litDim` 0.15 on `rare`) and the camera closed on
  the kept corner ([398.5, 6.6, 0], dist 14), so the lit set reads as mostly light blue; slide 16's
  gate ring at `idle` 1.2, the slide's `dim` 0.25 and dist 9 (slide 17's path starts there), so the
  ring stands large and bright in the centre (still light blue: kit request 14); the real cloud
  captioned "how far from the collision" (x) and "decay time" (y, unit in the "50 ps" tick) on
  slides 2, 3, 11 and 13 (hidden side on, slide 12); the ring's other grains at `roleDim` 0.5 and
  the camera at [298.23, 1.5, 0], dist 6.4 (slides 9-10); slide 5 opens on the dissolve (`toy: 3`,
  one click draws the line and its weights); slide 14's "99.9 % never yes"; slide 6's "185 neuron /
  177 hand cut"; slide 8's "92.0 ± 3.8 % test" (click) above "93.3 % train" on the baseline;
  slide 7's w₁ edge without its far-end 0 (`ticks: [1, 2, 3]`; kit request 15 for the caption's
  place). check, kit check.mjs (0 warnings), lint (exit 0, 0 warnings), every fact id in the bank,
  map (17 slides, 14.25 min; the map rounds to 14.2) and shots with the sheet green (slides 2, 3,
  5-17 looked at). Not seen: clicked states (slide 5's line, slide 8's test line, slide 16's fire)
  and the motions (slide 15's glide in, slide 5's entry dissolve). Open: kit requests 4, 14, 15;
  Talk 5's cover sentence about our grain (its session). Next: a full re-record,
  `pnpm talk record data4learn --out <dir> -- --size 1920x1080`, then `pnpm talk review data4learn`.
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data4learn.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. The full outline, with poses,
steps, caveats and fact ids, is `notes/outline.md` (revised 2026-10-29; no clips). The deck (`deck.md`, 29 Oct) has 17 slides, 14.25 min after the review fixes, and is authoritative where the outline's older slide specs differ: its Decisions are at the end of the outline. The record's peak is never named here either: "the short-lived particle's mass peak", "the quality cut" (how far the track points from the collision).

1. Cover: T3's whitened mass peak of the short-lived particle and its curve at T3's close pose, sliding right in 2.5 s; plain title "Machine learning" at the series' cover place (left, mid-height); last time the fit gave every candidate a signal share, today a machine learns to draw the line. 0.5 min
2. Two numbers a candidate: the histogram tips into a 2D cloud, how far the track points from the collision against decay time (both log, raw ticks, the floor at the data's own 0.15 ps), 91 531 "plotted"; we sort by the other numbers because the mass is what we fit afterwards. 0.75 min
3. A cut is a line: T3's quality cut becomes a white edge, 53 194 "kept"; a cut is a boundary someone chose. 0.75 min
4. One threshold: 200 simulated points in two clouds (axes named x₁ and x₂, seen close so each grain reads) and the best cut on x₁, 177 of 200; one variable gets this far. 1.0 min
5. One update: the edge dissolves as the slide opens, then click 1 draws the first line on, w₁ 0.259, w₂ 0.255, b 0; a neuron draws a line and scores each point 0 to 1, training starts at zero weights, and this first line (150 of 200) is worse than the cut. 1.0 min
6. Training: the line sweeps through 1 000 epochs and settles, 185 "neuron" against 177 "hand cut"; the machine beats the hand cut. 1.25 min
7. The valley (outline slides 7-8 in one slide with a click): a cut to the loss surface over (w₁, w₂, captioned on its edges), seen low along its floor; the ball waits on the far rim at zero weights, 0.693 "loss"; click 1 rolls it down to 0.162 "trained"; the loss is a number to make small, and training is a fit down its valley, like T3's χ². 1.5 min
8. Unseen points: the line retrained on 150 points judges 50 it never saw (the 150 dim, the 50 at full brightness), 93.3 % train, then (click) 92.0 ± 3.8 % test above it; a classifier is judged on points it did not train on. 1.0 min
9. A ring: all 600 points, one class round the other, the 120 test points brightest; the best straight line gets 53.3 % of them; no straight line separates them. 0.75 min
10. A bent boundary: the line bends round the cloud, 95.0 % test (one number, against slide 9's 53.3 %); four neurons draw lines and a fifth combines them, which can close a ring. 1.0 min
11. Real labels: the real candidates coloured by the mass window, overlapping, guess 53.2 %, network 61.3 %; labels come from the mass, inputs from everything else, and the classes overlap. 0.75 min
12. The leak: side on, the mass axis opens and the classes snap apart, 99.9 % "with mass"; feed the mass back in and the network just reads the label (music peak). 0.75 min
13. Undo: the mass axis closes and the overlap returns, 61.3 % "network"; without the leak the honest number returns. 0.75 min
14. Rare signal: 100 white grains among 99 900 light blue, 99.9 % "never yes"; a classifier that never says yes is 99.9 % right, the second 99.9 % that means nothing. 0.5 min
15. Precision: the cut lights 90 signal and 999 background, the rest goes nearly black and the camera closes on the kept corner, precision 8.3 %; finding 90 % of the signal (its recall) still keeps a set that is mostly background. 0.75 min
16. The trigger decides first: T1's lane framed close on the first filter's ring, the learned boundary as a gate, which fires and bursts most packets; no number on screen (Talk 1 counted the 1 in 30); a trigger is a classifier that answers before anyone looks, and what it drops is gone. 0.75 min
17. Close: the file: the kept lane folds into one turning ball of 91 583 "candidates", T5's cover pose; everything sorted today is one file, and next time we make the plot again from it. 0.5 min

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 91 531 plotted (slide 2) | record 401's candidates with a positive decay time | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-ipchi2-cut-count-worked` | OK (corrected) |
| 53 194 kept (3) | the quality cut keeps 53 194 of the 91 531 | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-ipchi2-cut-count-worked` | OK (corrected) |
| 177 of 200 (4, 6) | the best single threshold on the course's 200 simulated points | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/perceptron.py | 2026-10-29 | `perceptron-course-worked` | OK |
| 0.259 w₁, 0.255 w₂, 0 b (5) | the neuron's weights after one update | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/perceptron.py | 2026-10-29 | `perceptron-course-worked` | OK |
| 185 of 200 (6) | the trained neuron after 1 000 epochs | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/perceptron.py | 2026-10-29 | `perceptron-course-worked` | OK |
| 0.162 loss, counted from 0.693 (7) | mean cross-entropy from ln 2 at zero weights to 0.162 after training | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/perceptron.py | 2026-10-29 | `perceptron-course-loss-worked` | OK |
| 93.3 % train, 92.0 % test, ± 3.8 % (8) | trained on 150, tested on the other 50 | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/perceptron.py | 2026-10-29 | `perceptron-course-split-worked` | OK (corrected) |
| 53.3 % test (9) | the best straight line on the ring set's 120 test points | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/lectures/workbook/docs/data/ml_two_class.py | 2026-10-29 | `ml-two-class-line-test-worked` | OK (corrected) |
| 95.0 % test (10) | a 2-4-1 network on the ring set's test points (114 of 120) | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/lectures/workbook/docs/data/ml_two_class.py | 2026-10-29 | `ml-two-class-course-worked` | OK |
| 53.2 % guess (11) | always answering the larger class on the real test candidates | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-classifier-leakage-worked` | OK |
| 61.3 % network (11, 13) | the 2-4-1 network on the two inputs the picture shows | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-classifier-two-inputs-worked` | OK |
| 99.9 % with mass (12) | the mass fed back in as an input (leakage) | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-classifier-leakage-worked` | OK |
| 99.9 % (14) | always answering 'background' with 100 signal in 100 000 | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/ml.py | 2026-10-29 | `rare-signal-accuracy-trap-worked` | OK |
| 90 signal, 999 background, 8.3 % precision (15) | 90 % recall and 1 % false positives | https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis/blob/main/figures/src/ml.py | 2026-10-29 | `rare-signal-accuracy-trap-worked` | OK |
| 1 in 30 kept (16, notes only since 29 Oct) | the first filter keeps about 1 MHz of 30 MHz | https://lhcb-starterkit-run3.docs.cern.ch/first-analysis-steps/dataflow | 2026-10-29 | `lhcb-hlt1-drops-96p7pct-worked` | OK |
| 91 583 candidates (17) | the file's entries, one a candidate | https://opendata.cern.ch/record/401 | 2026-10-29 | `record401-candidates-91583` | OK (corrected) |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/main.ts`: installs the data kit (`installDataKit({ app, stage })`).
- `styles/index.css`: imports the kit's `components/data-kit/nums.css` (the series' `.nums`
  block) and carries the series' one cover-title rule (Data2Peak's `h1:only-of-type` block).

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

## Verify

```bash
pnpm talk check data4learn     # videos:check, stage:check, a build into /tmp/talk-data4learn/site
pnpm talk review data4learn    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data4learn     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
- 2026-10-29 (`final:data4learn`, the motion review of the recorded takes): the cuts stay cuts
  (the owner's decision: a one-key `path` at t = 0). The review's fix "delete the one-key path"
  would turn every station change into a 1.4-4.5 s flight; in this engine a one-key path ends on
  its first frame, so assembly already starts at the cut. The black openings were the forms'
  own gathers (2-4 s from a wide cloud), so the gathers were shortened instead: toy and ring
  `fill: 0.5, lead: 0`, rare `fill: 0.8, lead: 0`. The valley's gather has no key (kit request 8).
- 2026-10-29: the cover's path already starts on Talk 3's close: T3's hist stands at the
  station's origin and its close looks at [-5, 3.2, 0]; this talk's hist stands at z −14, so
  the same frame is [-5, 3.2, −14] (the review's [-5, 3.2, 0] would have looked 14 units in
  front of the plot). The seam's other differences were taken: the hist's ticks at T3's
  `tickPx: 36`, and the curve's draw-on cut to 0.1 s (`draw: 0.1`, kit request 1 open). The
  boot veil (0-0.72 s of 01.mp4) is trimmed in the edit (`01-trim.mp4`).
- 2026-10-29: slides 2-3 look at the same frame as before from further back along the same
  ray (`at: [-6.2, 4.87, -10.48], dist: 35`; camera at [-6.2, 7.31, 24.44]), so the pose is not
  *at* the real station (reach 12): a pose arriving *at* a station from outside it arms the
  station's forms and hides them until the camera lands, which was slide 2's 3 s of black.
  Slide 2 now eases from the cover's settled pose in 2.5 s and the tip plays from 0 s.
- 2026-10-29: numbers revealed by a click rise at their own `--dN` counted from the click,
  so slides 5, 7, 8 and 11 show the picture first (since the polish: the kit's nums.css rule).
- 2026-10-29: slide 8's held-out points `gather: true` (glide in, no landing glow) instead of
  the drop's bloom; slide 9's training grains dim to 0.3 (from 0.45); slide 16 looks at the
  gate (x 30, the lane's height) and its ring has 4 000 grains (the form 36 500); slide 17's middle key
  looks at the ball's place from dist 21 at 2.2 s (from dist 62 at 3 s; the review's dist 30 at
  x 80 still left 1.5-3.6 s black, the collapse being off frame), the last key (Talk 5's cover
  pose, unchanged) at 6 s, the count at 4.5 s. Slide 7's valley gathers on slide 6, off
  screen, and slide 7 looks at it from 37.5 along the same ray (not *at* the station), so the cut
  lands on a standing surface and the ball rolls from 0.3 s. Low findings 7 (the valley's framing
  and the ball's wait, kit request 3) and 12 (the depth caption's timing, kit request 12)
  stay open.
- 2026-10-29 (`polish:data4learn`, the series' one look): `nums.css` from the kit, Data2Peak's
  cover-title rule and a plain `<h1>`, no `tickPx`, our grain's ring white (the kit default) with a
  crowd core, the mass range the kit's 1 816-1 912. The cover hist keeps the default 20 MeV/c² ticks:
  at the cover's dist 28 the labels stand well apart (the 40 MeV/c² spacing is for wide shots).
- 2026-10-29: the series' title place (left, mid-height) overlapped the plot's left flank at T3's
  close pose, so the cover's path starts on T3's last frame ([-5, 3.2, −14], dist 26, yaw −4) and
  slides in 2.5 s to [-9.6, 3.2, −14], dist 28, yaw −4, pitch 5 (bars from x ≈ 720 of 1600,
  "LEARNING" ends ≈ 655); slide 2's path starts from that pose. Undo: the cover's old end pose
  ([-5, 3.2, −14], dist 23, yaw 6) with a deck-own title place.
- 2026-10-29: the steward's `ball: 'start'` taken as a click on slide 7 rather than the outline's
  split into two slides (the slide count and the cross-references stay; 1.5 min). The valley still
  gathers off screen on slide 6 (`gather` key not taken: the cut already lands on a standing surface).
- 2026-10-29: slide 17 keeps no grain of ours (`ours: false`, no spark), as before; Talk 5's cover
  shows none either (`s: 0`), so the consistent fix is in Talk 5: delete its cover Picture sentence
  "Our grain … is the larger grain on the near side" (that talk's session; not edited here).
- 2026-10-29: slide 16 shows no number: the 1 in 30 is Talk 1's taught beat (series check, low);
  the slide's idea is the learned boundary standing as a gate. The fact ids stay in its notes.
- 2026-10-29 (`fix:data4learn`, second pass): the real cloud carries two captions, "how far from
  the collision" and "decay time", as the toy carries x₁ and x₂, although the bible (§3) allows one
  caption a picture: the review asked for both, the axis across is a unitless log ratio that no
  tick can name, and "50 ps" alone does not say what is timed. Undo: drop `wordY` on `ev` (the
  "50 ps" tick stays). The series check should settle one rule for 2D clouds (this talk's toy
  and this cloud use two).
- 2026-10-29: slide 5's dissolve is the slide's entry (`toy: 3` at click 0, one click), not a
  click, so the slide never opens on slide 4's picture minus its number. Undo: `toy: 2` with
  clicks `{1: {toy: 3}, 2: {toy: 4}}` and the numbers on `v-click="2"`.
