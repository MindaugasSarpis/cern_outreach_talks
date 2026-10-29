# Data4Learn: outline (talk 4 of "Data analysis, the CERN way")

> **Read first (29 Oct 2026):** the slide specs below predate the owner's decisions of 29 Oct
> and still use the old names (D⁰, IPχ², IPχ² < 9, record 401) and the outline's 18-slide
> numbering. `deck.md` is authoritative: 17 slides, the peak never named ("the short-lived
> particle's mass peak", "the quality cut", how far the track points from the collision),
> and the poses, minutes and numbers as fixed after the fresh-eyes review (Decisions 12-21
> at the end). Copy a picture spec from the deck's Picture lines, not from here.

Outline step of the house pipeline (talk-quality §2, step 3). Written 2026-10-29 from the
series bible §5 Talk 4 and the corrections at its top, the data-kit README (forms and steps
as they work today), the prototype verdicts (`components/data-kit/notes/prototypes.md`),
the research lane notes (ml lane) and the bake outputs (`components/data-kit/data/train-*.json`,
`d0-cuts.json`, `d0-score.f32`). Revised the same day from the outline critique
(`revise:data4learn`): slide 5 starts from zero weights, slide 6 shows 185 of 200, the loss
bowl waits for a b-profiled bake, the mass is named as the thing we fit afterwards, and the
close splits into two parts. This file holds no deck: `deck.md` and `space.json` are
written in the draft step.

- **Cover title:** Machine learning
- **Question:** Can a machine draw the line between signal and background better than a
  hand-made cut, and how far should we trust it?
- **Takeaway:** A classifier is a fit whose answer is yes or no. It learns a boundary from
  labelled examples by the same descent as a fit, and it is only as honest as its labels,
  its inputs and its test on unseen data.
- **Misconception met on screen:** 99.9 % accuracy is good (slides 15-16). In the notes:
  training accuracy is the result (slide 9).
- **Delivery:** silent per-slide takes plus a live 16:9 deck. No clips (bible: no ML footage
  meets the bar), so the minutes alone sum to **14.0**.
- **Headmatter (bible §3):** `onscreen: numbers`, `sources: notes`, `duration: 15min`,
  `lang: en`, `transition: dust`, `videos.dust: '#7dd3fc'`, `stage: { palette: classic,
  motion: floor, lang: en, sound: { hum: false, flight: false, clip: false }, options:
  { aberration: 0 } }`, v0.11.0 pins, the dk types in `stage:check --types`. The cover keeps
  the plain title only: the scaffold's subtitle, byline, `PptxButton` and `at: wide`
  station go.
- **Music peak (edit):** the leak snapping apart, slide 13.

## Stations

Poses below are given relative to each station's origin (`at` = station pos + offset).
Offsets are the ones the labs shot and judged; the draft places the stations.

| station | forms | from |
|---|---|---|
| `real` | `h` dk-hist (record 401 M, pos [0, 0, −14]), `fit` dk-curve of `h`, `ev` dk-scatter (record 401, pos [0, 0, 0], 22 × 12.5), readout proxies, `ours` dk-spark | lab 4 `real`, lab 3 slide 8 |
| `toy` | `toy` dk-scatter (train-perceptron.json, 6.5 × 6.5), proxies `w1 w2 b right acc:train acc:test` | lab 4 `toy` |
| `valley` | `loss` dk-landscape (train-perceptron.json `lossProfile`, 12 × 12, height 8) | lab 3 slide 10 (test) |
| `ring` | `ring` dk-scatter (train-ring.json, `std: true`, `axes: false`), proxies | lab 4 `ring` |
| `rare` | `rare` dk-scatter (rare mode: 100 000 rows, 100 signal among 99 900 background), proxies | lab 4 `rare` |
| `gate` | `trg` dk-trigger (T1's two gates and buffer, no kit detector, no packet of ours), `file` dk-pipeline with only its `pile` stage | lab 1 slides 4-6, lab 5 slide 1 |

Grain grammar (bible §3): light blue is the crowd and class 0, white is class 1 or kept.
Our grain (row 1) keeps a light-blue core on every slide that draws it (`oursTone: 'crowd'`),
with the dk-spark halo as its marker. Slide 17 draws no grain or packet of ours; it comes
back only in slide 18's pile. Data slides: `ambient: 0`, `dim` 0.25 (0.15 at the gate),
`steady: true` wherever a number is read off the picture.

Visibility (grain budget, bible T4 risk "never the landscape with the 91k scatter"): `h`
and `fit` at 0 from slide 3; `ev` at 0 on slides 4-11 and 15-18; `loss` at 0 outside
slides 7-8; `rare` at 0 outside slides 15-16; `trg` and `file` at 0 before slide 17
(hidden at step 0, or not built on those slides if hidden forms still count: open item 3).
`grain-budget` must be green on every slide before the draft is judged.

---

## Part 1. Cover and a cut is a line (2.0 min)

### 1. Cover · 0.5 min
- **Pose:** `real`, at [−5, 3.2, −14], dist 26, yaw −4, pitch 5, `dim` 0.25, `ambient` 0,
  `steady` true, `sway` 1: T3's close pose exactly (T3 outline slide 14), so the cut from
  T3's last frame is seamless. Then a short `path` easing to dist 23, yaw 6 over 6 s, so the
  next slide's tip reads toward the camera.
- **Picture:** T3's last frame: `h` dk-hist `{n: 'all', weights: 'psig'}` with `fit`
  dk-curve at its last set, `replay: false` so the plot stands from frame 1 exactly as T3's
  final take ended (`selGain` the same value T3's close uses). `ours` dk-spark on `h`
  (crowd core). Entrance: the camera's path and the title rising; nothing refills.
- **On screen:** the title "Machine learning". No numbers.
- **Notes.** Message: last time the fit gave every candidate a signal share; today a machine
  learns to draw the line itself. Picture: the whitened D⁰ peak and its fitted curve, our
  grain in the 1 880-1 882 MeV bin with share 0.144 (said, not shown). Caveats: the whiteness
  is P(signal) from T3's mass fit, a property of the bin, not a decision about the grain.
  Sources: record 401 (DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR); `d0-psig.f32`, `d0-fit.json`
  (bake/d0.py).
- **Facts:** `d0-row1-signal-share-worked`
- **Prototype:** dk-hist weights (T3 dense pair, "reads"); `replay: false` is unseen
  (README known limits).

### 2. Two numbers a candidate · 0.75 min
- **Pose:** `real`, at [−6.2, 5.6, 0], dist 24.5, yaw 0, pitch 4; `flight` 3 s back from the
  cover pose while the grains bow toward the camera. `dim` 0.25, `ambient` 0, `steady` true.
- **Picture:** `h` `{tip: 'scatter'}` hands its grains to `ev` dk-scatter
  `{n: 'all', tip: 'h', color: 'none'}`: the 1D histogram tips into the 2D cloud, IPχ² (x)
  against decay time (y), both logarithmic and both with raw ticks: x `{ raw: true, ticks:
  [[0.01, '0.01'], [1, '1'], [100, '100'], [10000, '10 000']] }`, y `{ raw: true, ticks:
  [[0.2, '0.2'], [0.5, '0.5'], [1, '1'], [2, '2'], [5, '5'], [10, '10'], [20, '20 ps']] }`,
  caption `IPχ²`. The white of the peak fades to light blue as the grains land. `fit` to 0.
  `ours` follows our grain to IPχ² 1 299, 0.41 ps, at the far right.
- **On screen:** 91 531 (`<StageCount for="ev">`), name "plotted".
- **Notes.** Message: each candidate is now a point in two of its four numbers; we sort by
  the other numbers, because the mass is what we fit afterwards (T3). Picture: every grain
  of the mass plot moves to its (IPχ², decay time) place; the mass leaves the picture.
  Caveats: both axes are logarithmic, so equal steps are equal factors (say it: it is new);
  52 of the 91 583 rows have no positive decay time (49 missing, 3 ≤ 0) and are left out,
  which is why the count says "plotted" and slide 18's file says 91 583. Sources: record 401
  via bake/d0.py (`d0-cuts.json`: `tauPositive` 91 531).
- **Facts:** `d0-ipchi2-cut-count-worked`, `record401-candidates-91583`, `d0-row1-values-worked`
- **Prototype:** dk-scatter dense (lab 4 slide 6, "reads", with log ticks on x: the raw x
  ticks are unseen); the tip motion itself is unseen in motion, and a cold-opened tip relies
  on `grains({last: true})` (unseen).

### 3. A cut is a line · 0.75 min
- **Pose:** as slide 2, `steady` true.
- **Picture:** `ev` `{tip: null, box: [[null, 0.9542], [null, null]], color: 'kept'}`: T3's
  IPχ² < 9 becomes a vertical edge of fine white grains at 9, between the 1 and 100 ticks;
  the kept side turns white. Our grain stays light blue far to the right of the edge.
- **On screen:** 53 194 (`<StageCount for="evKept">`), name "kept".
- **Notes.** Message: a cut is a boundary someone chose, and IPχ² < 9 keeps 53 194 of
  91 531. Picture: the edge is the cut from T3; white is kept. Caveats: IPχ² < 9 is our
  series cut, chosen to remove D⁰s from B decays (T3); the LHCb masterclass cuts on log₁₀(IP)
  instead (bible correction). Sources: `d0-cuts.json` (bake/d0.py); arXiv:1510.01707 for
  secondary charm at large IPχ²; the LHCb D⁰-lifetime masterclass page.
- **Facts:** `d0-ipchi2-cut-count-worked`, `d0-from-b-ipchi2`, `d0-masterclass-ip-cut`
- **Prototype:** dk-scatter box (lab 4 slide 7, "reads").

## Part 2. The perceptron (3.25 min)

### 4. One threshold · 1.0 min
- **Pose:** `toy`, at [−1.8, 3.1, 0], dist 10.5, yaw 0, pitch 4, `sway` 1; `flight` 3.5 s
  from `real`. `dim` 0.25, `ambient` 0, `steady` true.
- **Picture:** `toy` dk-scatter `{n: 'all', color: 'truth'}` then `{box: [[1.386, null],
  [null, null]]}`: 100 white points around (2, 2), 100 light blue around (0, 0), and the
  best vertical cut on x₁.
- **On screen:** 177 (`readout: 'right'`), unit "of 200".
- **Notes.** Message: the best cut on one variable gets 177 of 200 right. Picture: one grain a
  point; white class 1, light blue class 0; the white edge is the threshold. Caveats:
  simulated, the course's `perceptron.py` points (numpy `default_rng(11)`); say "simulated"
  aloud once. The threshold is given as 1.386 because the stored points are rounded to 5
  decimals (README). Sources: course figures/src/perceptron.py; `train-perceptron.json`
  (bake/train.py).
- **Facts:** `perceptron-course-worked`
- **Prototype:** dk-scatter sparse (lab 4 slide 1, "reads").

### 5. One update · 1.0 min
- **Pose:** as slide 4.
- **Picture:** two clicks. Step 1 `toy` `{box: null}`: the threshold edge dissolves to
  dust and the plot stands with no line (the untrained neuron, w = (0, 0), b = 0, scores
  every point 0.5). Step 2 `{epoch: 1}`: the epoch-1 line x₁ + x₂ = 0 draws on fresh, with
  no glide from the cut, through the centre of the light-blue cloud.
- **On screen:** 0.259 (w₁), 0.255 (w₂), 0 (b), names as `.name` (proxies `w1 w2 b`), with
  step 2.
- **Notes.** Message: a neuron draws a line w₁x₁ + w₂x₂ + b = 0 and gives each point a score
  from 0 to 1 by how far it lies across the line; on the line the score is 0.5. Training
  starts with all weights at zero, and one step nudges them so that more points land on
  their own side. Picture: the cut goes, nothing stands while the weights are zero, then
  the first line. Say that this first line is worse than the hand cut: 150 of 200 right
  against 177, so training has to keep going (say it only once the amendment to
  `perceptron-course-worked` is filed, open item 2b). Caveats: the course's "perceptron" is a
  sigmoid neuron trained by gradient descent on the cross-entropy (learning rate 0.5, all
  weights starting at 0); Rosenblatt's 1958 perceptron is a threshold unit with a different
  update rule, so name Rosenblatt's paper as the origin of the idea, and date the paper, not
  the invention (the lane note: an earlier 1957 report exists). Sources: Rosenblatt,
  Psychological Review 65 (1958) 386; `train-perceptron.json` `epochs[0]`, `epochs[1]`,
  `after1`.
- **Facts:** `perceptron-course-worked` (+ its amendment: epoch-1 accuracy 0.75),
  `rosenblatt-perceptron-1958`
- **Prototype:** dk-scatter epochs (lab 4 slide 2 covers the sweep). Unseen: `{box: null}`
  with no line dissolving the edge to dust, and `{epoch: 1}` drawing on from no boundary
  instead of gliding (check in the first shots; open item 4).

### 6. Training · 1.25 min
- **Pose:** as slide 4, `steady` true (the count runs while the line sweeps).
- **Picture:** `toy` `{epoch: 1000, sweep: 6}`: the line runs from epoch 1 through the 1 000
  logged epochs on a log schedule in 6 s (fast early moves and slow late ones both show) and
  settles. This replaces the bible's camera `rate` keyframes: the sweep is on the form's
  clock.
- **On screen:** 185 (`readout: 'right'`), unit "of 200", counting with the sweep (from 150);
  and 177, name "cut", a fixed number (no readout gives the threshold's count once the line
  has replaced it). Two numbers.
- **Notes.** Message: training moves the line until it settles, and it gets 185 of 200 right
  against the hand cut's 177: the machine beats the cut. Picture: the same line, epoch by
  epoch. Caveats: one epoch = one update using all 200 points. The line ends at w₁ 2.10,
  w₂ 2.26, b −4.31, next to the exact boundary (2, 2, −4); the exact boundary is the best line
  possible, known only because we made the clouds ourselves (two unit Gaussians at (0, 0) and
  (2, 2), the bake's `bayes`). The weights are on screen only on slide 5 (bible §3). If
  `right` does not follow the sweep frame by frame (the README lists only `w1 w2 b loss
  epoch` as doing so), it lands on 185 at the end, which is enough. Simulated. Sources:
  `train-perceptron.json` `epochs`, `line`, `bayes`.
- **Facts:** `perceptron-course-worked`
- **Prototype:** dk-scatter sweep (lab 4 slide 2, still end state only; the sweep motion and
  `right` during a sweep are unseen).

## Part 3. The same valley (2.0 min)

Both slides are blocked on the b-profiled loss bake (open item 1). Without it, slide 7 drops
(drop order 2) rather than show a ball at 2.17 under a spoken 0.693.

### 7. A loss · 1.0 min
- **Pose:** `valley`, at [0, 2.4, 0], dist 24, yaw −14, pitch 42, `sway` 0.5; `flight` 3.5 s
  from `toy`. `dim` 0.25, `ambient` 0, `steady` true.
- **Picture:** `loss` dk-landscape on `lossProfile`, step 1: the loss surface over (w₁, w₂)
  gathers from a loose cloud (rim first, about 2.5 s); the ball waits at w = (0, 0) on the
  rim, at height 0.693. Ticks 0 1 2 3 on both edges; `zmax` set from the profiled grid. The
  loss is the average of −ln(the score given to the right answer); a score of 0.5 everywhere
  gives ln 2 = 0.693.
- **On screen:** 0.693, name "loss" (the ball's height as the readout).
- **Notes.** Message: training needs a number to make small, the loss, and here it is a
  surface over the two weights. Picture: height = the lowest loss these two weights can
  reach (b chosen at its best at each point, as T3's profiled bowl); the ball is the
  untrained neuron, where every point scored 0.5. Caveats: the loss has three parameters and
  the picture two, so b is profiled at each (w₁, w₂), as T3 profiled n_sig. Sources:
  `train-perceptron.json` `lossStart`, `lossProfile` (to bake).
- **Facts:** `perceptron-course-loss-worked`
- **Prototype:** dk-landscape (T3 pair "reads"; the loss variant only as lab 3's test slide,
  no pair of its own; the profiled loss grid is unseen).

### 8. Down the valley · 1.0 min
- **Pose:** `valley`, at [0, 2.0, 1.5], dist 19, yaw −12, pitch 34 (T3's bowl angles; this
  bowl stands on the floor where T3's hung under it, so the offset is lifted), so the room
  sees the same valley again. `steady` true.
- **Picture:** `loss` `{roll: true}`: the ball rolls the logged path of 1 000 epochs taken
  as 30 legs, each leg's height the profiled loss at that epoch's (w₁, w₂), so the ball stays
  on the bowl; it stops at the bottom, (2.10, 2.26).
- **On screen:** 0.162, name "loss".
- **Notes.** Message: training is a fit: each step moves the weights downhill on the loss,
  and the ball rolls to the bottom of a valley, like T3's χ² valley. Picture: the same
  descent as slide 6, drawn as height; height = the lowest loss these two weights can reach.
  Caveats: χ² scores how far the curve misses the counts; cross-entropy scores how far the
  scores miss the yes/no labels; both are numbers to make small, so both are valleys. (If
  the owner wants it, one line beyond the series: both are minus a log-likelihood.) No
  Δ = 1 ring is drawn, since T4 quotes no error on the weights. If the bake is not in and
  slide 7 dropped, this slide arrives on the bowl, says no starting height, and reads only
  0.162, which both grids give at the end. Sources: `train-perceptron.json` `lossEnd`,
  `lossProfile` path (to bake); T3's valley `d0-chi2.json`.
- **Facts:** `perceptron-course-loss-worked`, `d0-fit-valley-delta-chi2-worked`
- **Prototype:** dk-landscape roll (lab 3 slide 10 test, still end state; the roll is unseen
  in motion).

## Part 4. Bending the line (2.25 min)

### 9. Unseen points · 1.0 min
- **Pose:** `toy`, as slide 4; `flight` 3.5 s from `valley`.
- **Picture:** `toy` `{epoch: null, sweep: null, line: 'split', show: 'train'}` then
  `{show: 'all', dim: 'train'}` (two clicks): the line retrained on 150 points; the 150 step
  back to 0.2 and the 50 held-out grains drop in, judged by a line that never saw them.
- **On screen:** 93.3 % (train), 92.0 % (test), ± 3.8 %.
- **Notes.** Message: a classifier is judged on points it did not train on. Picture: the
  bright grains are the 50 test points; the 4 on the wrong side are the errors.
  Misconception: training accuracy is the result; it is always the optimistic number.
  Caveats: the ± 3.8 % is the binomial spread for 50 points, √(0.92 × 0.08 / 50), the same
  √N wobble as T2's counts; over 20 split seeds the test accuracy averages 93.6 %. The split
  line differs slightly from slide 6's line (150 points, not 200). Simulated.
  Sources: `train-perceptron.json` `split`.
- **Facts:** `perceptron-course-split-worked`
- **Prototype:** dk-scatter show/dim (lab 4 slide 3, "reads").

### 10. A ring · 0.75 min
- **Pose:** `ring`, at [−1.8, 3.1, 0], dist 10.5, yaw 0, pitch 4; `flight` 3.5 s.
- **Picture:** `ring` dk-scatter `{n: 'all', color: 'truth', line: 'line', show: 'all',
  dim: ['train', 'validation']}`, `axes: false`: the 600-point ring set, both inputs rescaled
  to the same spread (`std: true`) so it reads round, the 120 test grains bright, and the
  best straight line through it.
- **On screen:** 53.3 % (test), from `readout: 'accuracy:test'`.
- **Notes.** Message: when one class surrounds the other, no straight line separates them.
  Picture: white cloud inside a light-blue ring; the line cuts both; both inputs are rescaled
  to the same spread, so no axes are drawn. Caveats: simulated (course `ml_two_class.py`,
  seed 16; split 360 / 120 / 120). The bible's 65 % is the line's training accuracy
  (65.3 %); after slide 9 the slide must show the test number, 53.3 %, near guessing
  (`train-ring.json` `line.testAccuracy` 0.5333; fact to file, open item 2a). If it is not
  filed before the draft, fall back to 65.3 % named "train". Sources: `train-ring.json`
  `line`.
- **Facts:** `ml-two-class-course-worked`, `ml-two-class-line-test-worked` (to file)
- **Prototype:** dk-scatter ring (lab 4 slide 4, "reads", with axes; `axes: false` on the
  ring and the test-only dim on it are unseen).

### 11. A bent boundary · 0.5 min
- **Pose:** as slide 10.
- **Picture:** `ring` `{line: null, bend: true}` (one click): the line's grains travel onto
  the 2-4-1 network's 0.5 contour and close round the white cloud (1.8 s).
- **On screen:** 95.0 % (test), 114, unit "of 120", read at once.
- **Notes.** Message: four neurons each draw a line; a fifth combines their four scores, and
  that combination can close round the cloud: 114 of 120 test points right. Picture: the
  boundary is the network's score = 0.5 line from its score grid. Caveats: 2-4-1 means two
  inputs, four hidden neurons, one output; the network is drawn only as its boundary and
  described only in words (bible §3: no neuron diagrams). Test AUC 0.991 stays in the notes
  (AUC is not introduced). Simulated. Sources: `train-ring.json` `net`, `scoreGrid`.
- **Facts:** `ml-two-class-course-worked`
- **Prototype:** dk-scatter bend (lab 4 slide 5, "reads").

## Part 5. Real rows (2.25 min)

### 12. Real labels · 0.75 min
- **Pose:** `real`, as slide 2; `flight` 4 s from `ring`.
- **Picture:** `ev` `{box: null, color: 'truth'}` then `{bend: true}`: record 401's cloud
  recoloured by label (mass in 1 845-1 885 MeV/c² white), white and light blue overlapping
  almost everywhere; the network's bent boundary from `train-d0.json` `twoInputs`.
  Our grain: light-blue core, in the overlap.
- **On screen:** 53.2 % (name "guess"), 61.3 % (name "network").
- **Notes.** Message: the labels come from the mass, the inputs from everything else. On
  real candidates the classes overlap, and the network barely beats guessing. Picture: the
  labels come from T2's mass window; the boundary is the network trained on the two inputs
  drawn. Caveats: the bible's 62.9 % uses log pT as a third input, which the picture cannot
  show; the boundary drawn is the two-input network's, so the slide shows its 61.3 % and the
  notes give 62.9 % (three inputs) and 60.1 % (one neuron). Check that `accuracy:test` on the
  interpolated grid lands on 61.3; if not, write it as a fixed number. The label is weak by
  design: more than half of the window is background (49 225 candidates labelled 1 against
  at most 20 993 fitted signal, T3; a worked fact to file, open item 2d, or drop the share),
  so no classifier can do much better on these labels. Row 1: labelled signal by the window,
  P(signal) 0.144 from T3's fit, and the three-input network scores it 0.46 (just under 0.5;
  only once `d0-row1-network-score-worked` is filed, open item 2c, else drop the 0.46):
  nobody can say whether one row is a D⁰ (the series thread). Its core stays light blue by
  the series grammar. Sources: `train-d0.json` (bake/train.py, the course's Lecture 16
  recipe), `d0-score.f32`, record 401.
- **Facts:** `d0-classifier-leakage-worked`, `d0-classifier-two-inputs-worked`,
  `d0-row1-signal-share-worked`, `course-d0-fit-mass-worked` (+ to file:
  `d0-row1-network-score-worked`, `d0-window-background-share-worked`)
- **Prototype:** dk-scatter truth + bend on the dense cloud (lab 4 slide 8, "reads").

### 13. The leak · 0.75 min
- **Pose:** `real`, at [0, 6, 2.5], dist 18.4, yaw 90, pitch 4 (exactly side on); `flight`
  2.5 s. `steady` true. Music peak in the edit.
- **Picture:** `ev` `{bend: null, depth: 1}`: every grain snaps to depth = its mass, the
  plane turns edge-on, and the window's white band stands apart from the light-blue
  sidebands as vertical stripes over the depth ticks 1 845 and 1 885.
- **On screen:** 99.9 %, name "with mass".
- **Notes.** Message: feed the mass back in and the network just reads the label: 99.9 %.
  Picture: the third axis is the mass; seen from the side the classes separate perfectly.
  Caveats: this is leakage, the answer fed in as an input; it must never read as success,
  and the next click undoes it. Sources: `train-d0.json` `withM` (0.9989).
- **Facts:** `d0-classifier-leakage-worked`
- **Prototype:** dk-scatter depth (lab 4 slide 9, "reads"); the snap is unseen in motion.

### 14. Undo · 0.75 min
- **Pose:** `real`, as slide 2; `flight` 2.5 s back to the front.
- **Picture:** `ev` `{undo: true, bend: true}`: the mass axis closes, the overlap returns,
  the network's boundary comes back.
- **On screen:** 61.3 %, name "network" (the same name as slide 12).
- **Notes.** Message: without the leak the honest number returns. Picture: the same cloud as
  slide 12. Caveats: `{undo}` with `bend` back on in the same step is an untested
  combination (lab 4 slide 10 had no boundary); if it misbehaves, keep `bend: null`.
  Sources: `train-d0.json`.
- **Facts:** `d0-classifier-two-inputs-worked`
- **Prototype:** dk-scatter undo (lab 4 slide 10, "reads").

## Part 6. Rare signal (1.25 min)

### 15. Rare signal · 0.5 min
- **Pose:** `rare`, at [−3, 5.8, 0], dist 18, yaw 0, pitch 4; `flight` 3.5 s. `steady` true.
- **Picture:** `rare` dk-scatter `{n: 'all', color: 'truth'}`, `axes: false`: 100 white
  grains among 99 900 light blue (100 000 in all).
- **On screen:** 99.9 %, unit only (the accuracy of answering "background" every time).
- **Notes.** Message: when signal is rare, a classifier that never says yes is 99.9 % right.
  Picture: one grain a candidate; the white ones are the signal. Misconception: 99.9 %
  accuracy is good. Name the echo: this is the second 99.9 % that means nothing (slide 13's
  was the leak). Caveats: simulated, abstract inputs (no axes), the course's Lecture 16
  arithmetic. Sources: course figures/src/ml.py; `train-rare.json`.
- **Facts:** `rare-signal-accuracy-trap-worked`
- **Prototype:** dk-scatter rare (lab 4 slide 11, "reads").

### 16. Precision · 0.75 min
- **Pose:** as slide 15.
- **Picture:** `rare` `{line: 'cut', lit: true}`: the cut keeps 90 white and 999 light blue;
  everything else dims.
- **On screen:** 90 (name "signal"), 999 (name "background"), 8.3 % (name "precision").
- **Notes.** Message: a classifier that finds most of the signal still keeps a set that is
  only 8.3 % signal; that share is the precision. Picture: the lit set is mostly light blue.
  Caveats: the two inputs behind 90 and 999 are the recall, 90 % of the 100 signal found
  (90), and the false-positive rate, 1 % of the 99 900 background let through (999);
  precision is 90 of 1 089 kept. Its accuracy is 98.99 %, lower than "always background".
  Sources: `train-rare.json`.
- **Facts:** `rare-signal-accuracy-trap-worked`
- **Prototype:** dk-scatter rare lit (lab 4 slide 11, "reads").

## Part 7. Close: the gate (1.0 min)

### 17. The trigger decides first · 0.5 min
- **Pose:** `gate`, at [32, 0.2, 0], dist 22, yaw −6, pitch 6 (T1's gate 1 pose), `dim`
  0.15, `ambient` 0, `steady` true; `flight` 4 s from `rare`.
- **Picture:** `trg` dk-trigger arriving at step 1 (the lane runs), one `<StageSteps>` click
  to step 2: gate 1 fires and 29 of 30 packets burst to dust. No dk-spark and no white packet
  of ours at the gate: the lane is everyone's crossings, not our row.
- **On screen:** 1, unit "in 30", name "kept" (if the numbers-only lint flags "in", write
  `1/30`).
- **Notes.** Message: a trigger is a classifier that answers before anyone looks, at a rate
  where signal is rare, and what it drops is gone: it keeps 1 crossing in 30. Picture: T1's
  lane and first gate, now read as yes/no. Caveats: the T1 callback, notes only: 30 MHz of
  non-empty crossings in, about 1 MHz out (Run 3 HLT1). The learned selections at LHCb are
  HLT2's topological triggers (monotonic Lipschitz neural networks in the published Run 3
  design, 2023-24; superseding decision trees); no ML claim attaches to the GPU gate drawn
  here, and no source after 2024 was checked for the production setup, so say "was designed
  with", in the past tense (LHC in LS3). HLT1 ran on about 500 GPUs (notes only). Sources:
  LHCb starterkit dataflow page; arXiv:2408.03881; Delaney et al., EPJ Web Conf. 295 (2024)
  09005.
- **Facts:** `lhcb-hlt1-drops-96p7pct-worked`, `lhcb-hlt1-30mhz`, `lhcb-run3-hlt1-1mhz-out`,
  `ml-in-lhcb-trigger`, `lhcb-hlt1-500-cards-89khz`
- **Prototype:** dk-trigger gates (T1 sparse lab 1 slide 4, "reads"; the lab shot the gate
  as a still, with our packet: the gate without it is unseen).

### 18. Close: the file · 0.5 min
- **Pose:** `gate`, `path` [[0, slide 17's pose], [7, P + [0, 3.1, 0], dist 11, yaw −10,
  pitch 6]], where P is the pile's floor point beyond the lane's end. The end pose is T5's
  cover pose (lab 5 slide 1). `dim` 0.2, `steady` true at the end.
- **Picture:** `trg` to `collapse` (step 4, both gates long on): the kept packets fold into a
  turning ball at P (`ball: { at: P + [0, 3.1, 0], r: 2.8, spin: 0.06 }`); `file`
  dk-pipeline step 1 (the `pile` stage only: r 2.8, n 91 583, alpha 0.6, spin 0.06, seed
  401, our row on the camera's side) gathers round it as the trigger's ball fades. Our grain
  comes back here, in the pile. The last frame is T5's first.
- **On screen:** 91 583 (`<StageCount>`), name "candidates".
- **Notes.** Message: everything this talk sorted is one file of 91 583 candidates, and next
  time we delete the plot and make it again from that file. Picture: what the trigger kept
  becomes the ball that T5 opens on. Caveats: record 401's rows passed the Run 1 trigger
  (2011 or 2012, year not settled), not the Run 3 one drawn on slide 17; the ball is a
  picture of "kept data becomes a file", not this file's history. HiggsML (record 328,
  818 238 events, CC0) is an open ML dataset for anyone who wants a clean separation (notes
  only). Sources: record 401; opendata.cern.ch/docs/lhcb-masterclass;
  opendata.cern.ch/record/328.
- **Facts:** `record401-candidates-91583`, `lhcb-record401-year`, `higgsml-2014-dataset`
- **Prototype:** dk-trigger `collapse` (never seen: README known limits) and the
  pipeline pile (lab 5 slide 1, seen). The hand-over from the trigger's ball to the pile is
  a new pairing with no lab.

---

## Timing

| part | slides | min | big move |
|---|---|---|---|
| Cover and a cut is a line | 1-3 | 2.0 | the 1D histogram tipping into a 2D cloud |
| The perceptron | 4-6 | 3.25 | the line sweeps through the cloud and settles |
| The same valley | 7-8 | 2.0 | T3's valley returns and the ball rolls again |
| Bending the line | 9-11 | 2.25 | the straight line bending round the cloud |
| Real rows | 12-14 | 2.25 | the snap apart and the undo |
| Rare signal | 15-16 | 1.25 | the lit set is mostly blue |
| Close: the gate | 17-18 | 1.0 | the lane folds into one ball |
| **Total** (no clips) | 18 | **14.0** | |

Against the bible's table: perceptron −0.25 (the sweep runs on the form's clock in 6 s and
the end weights go to the notes), bending −0.25 (slide 11 is one click, its numbers read at
once), real rows −0.25, close +0.75 (split into "Rare signal" and "Close: the gate", one big
move each; the misconception and precision get their own slides, slide 16 at 0.75 min, and
the close entrance its own slide).

## Prototype mechanics this talk relies on (bible §4)

| slides | mechanic | lab verdict |
|---|---|---|
| 1 | dk-hist weights (T3's close as T4's cover) | lab 3 slide 8, reads (weakest T3 pair) |
| 2-3, 12-14 | dk-scatter dense: tip, box, truth, bend, depth, undo | lab 4 slides 6-10, reads |
| 4-6, 9-11 | dk-scatter sparse: threshold, epochs, split, ring, bend | lab 4 slides 1-5, reads |
| 7-8 | dk-landscape (loss grid) | T3 pair reads; the loss variant was a lab 3 test slide only |
| 15-16 | dk-scatter rare | lab 4 slide 11, reads |
| 17 | dk-trigger gate 1 | lab 1 slide 4, reads |
| 18 | dk-trigger collapse + dk-pipeline pile | collapse never seen; pile lab 5 slide 1 |

Unseen anywhere so far: `replay: false` (slide 1), the tip in motion and a cold-opened tip
and the raw x ticks on IPχ² (slide 2), a dk-spark following a dk-scatter's grain (slides
2-14), the threshold dissolving with no line and the epoch-1 line drawing on fresh (5),
`right` counting during a sweep (6), the b-profiled loss grid (7-8), `axes: false` and the
test-only dim on the ring (10-11), `{undo}` with `bend` (14), the gate with no packet of
ours (17), dk-trigger `collapse` and its hand-over to the pile (18). All motion is unjudged
(prototypes.md: still end states only).

## Ladder check

Every idea used, and where it was introduced (bible §1 table; earlier talks by their own
bible rows):

| idea | introduced | used here |
|---|---|---|
| a candidate as a row of four numbers (mass, pT, decay time, IPχ²) | T1 close | 2, 12 |
| bunch crossing, trigger, gates, dropped is gone (30 MHz, 1 MHz) | T1 | 17 (1 in 30 on screen; the rates in the notes) |
| the K⁻π⁺ mass, histogram, mass window | T2 | 1, 12, 13 |
| √N wobble of a count | T2 | 9 (binomial ±) |
| fit, curve, χ², the valley and its minimiser path, a profiled bowl | T3 | 1, 7-8 |
| the mass is what gets fitted, so a selection sorts by the other numbers | T3 (said again on slide 2) | 12-13 |
| IPχ² cut, D⁰s from B decays, decay time | T3 | 2-3 |
| P(signal) per grain, row 1's 0.144 | T3 close | 1, 12 |
| a cut is a boundary (2D scatter, log axes: equal steps are equal factors) | T4 slides 2-3 | 4, 12 |
| neuron, line w₁x₁ + w₂x₂ + b, a score from 0 to 1 (0.5 on the line), one update | T4 slide 5 | 6-9, 11 |
| epoch (one update using all points), training, the exact boundary | T4 slide 6 | 7-9 |
| loss (cross-entropy as the average −ln of the right answer's score), same valley as χ² | T4 slides 7-8 | 9 |
| train / test, accuracy on unseen points | T4 slide 9 | 10-16 |
| network (neurons whose lines a last neuron combines), bent boundary | T4 slide 11 | 12, 14 |
| label, classifier on real data | T4 slide 12 | 13-14, 17 |
| leakage | T4 slide 13 | T5 (choices before looking) |
| precision (recall and false positives in the notes) | T4 slide 16 | 17 |
| the file of 91 583 candidates | T1 close (count), T4 slide 18 (as one ball) | T5 cover |

Kept out (bible scope_out): significance and σ (T2: no σ on screen here), fit mathematics
(T3), trigger rates in detail (T1: notes only on slide 17), reproducibility (T5), named deep
architectures and XOR, AUC (notes only), likelihood (one optional notes line on slide 8,
marked beyond the series).

## Entrances

- **Cover entrance:** T3's last frame, the whitened D⁰ peak with its fitted curve at T3's
  close pose (`real`, at [−5, 3.2, −14], dist 26, yaw −4, pitch 5, `steady` true, `sway` 1,
  the same as T3's slide 14), standing at once (`replay: false`); the camera eases to dist
  23, yaw 6 and the plain title rises. The first click tips the peak into the 2D cloud
  (slide 2), the talk's first big move. If T3 changes its close pose (sway included), this
  pose follows it.
- **Close entrance:** the kept lane collapses into one turning ball, and the camera's path
  ends on T5's cover pose: the file as a ball of 91 583 grains (dk-pipeline pile, r 2.8,
  alpha 0.6, spin 0.06, seed 401), at the ball + [0, 3.1, 0], dist 11, yaw −10, pitch 6.
  T5 must use the same pile object (same seed, radius, alpha) for the frames to match.

## Drop order (if the takes run long)

1. Slide 5 (one update): slide 6's sweep starts from epoch 0 and the zero start and the
   first step are said (−1.0 min).
2. Slide 7 (the bowl alone): slide 8 arrives on the bowl and plays gather then roll
   (−1.0 min). Also forced if the `lossProfile` bake is not in before the draft (open
   item 1); slide 8 then says no starting height.
3. Slide 14 (undo) folds into slide 13 as a second click on the same pose (−0.5 min; the
   undo itself must stay).
4. Slide 15 folds into slide 16: 99.9 % and 8.3 % on one slide (−0.5 min).
5. Slide 10 (the ring's line): slide 11 opens on the line and bends on the first click
   (−0.75 min).
6. Slide 17 (the gate): slide 18 starts on the lane with both gates long on (−0.5 min).

Never drop: slides 2-3 (the cut as a line), 9 (unseen points), 12-13 (real overlap and the
leak), 16 (precision).

## Open items

1. **Blocker for slides 7-8.** Bake a b-profiled loss grid (`train-perceptron.json`, new
   key `lossProfile`): at each (w₁, w₂), the loss at its best b, as T3's χ² grid profiles
   n_sig; and the path's heights as the profiled value at each epoch's (w₁, w₂), so the ball
   stays on the bowl (the true training loss lies on or above the profiled surface, so a
   ball at the logged loss would float mid-roll). The start then reads ln 2 = 0.693 at
   w = (0, 0) and the bottom 0.162 (check in the bake that the 1 000-epoch b is at its
   profiled optimum, so the end reads 0.162 and not a hair lower). The current `lossGrid`
   fixes b = −4.31, where w = (0, 0) stands at 2.17. If the bake is not in before the
   draft, slide 7 drops (drop order 2).
2. Facts to file before the draft cites them (this outline does not write the bank):
   a. `ml-two-class-line-test-worked`: the ring's best line gets 53.3 % of the 120 test
      points right (65.3 % on training), from `train-ring.json` `line.testAccuracy`
      0.5333 and `trainAccuracy` 0.6528 (slide 10).
   b. An amendment to `perceptron-course-worked`: at w = (0, 0), b = 0 every point scores
      0.5 (loss ln 2); after one update the line gets 150 of 200 right (accuracy 0.75,
      loss 0.510), from `train-perceptron.json` `epochs[0]` and `epochs[1]` (slide 5).
   c. `d0-row1-network-score-worked`: row 1's score in `d0-score.f32` is 0.462; bake.md calls
      it "the honest network's score", so confirm which network (three-input, 0.629) before
      filing; else drop the 0.46 from slide 12 and open item 5.
   d. `d0-window-background-share-worked`: 49 225 of the 91 531 plotted candidates lie in
      the 1 845-1 885 window (`train-d0.json` `nLabel1`), against 20 993 ± 276 fitted signal
      over the whole 1 820-1 910 range (`course-d0-fit-mass-worked`), so at least 28 232
      (57 %) of the window is background (the fit counts all 91 583 rows; the 52-row
      difference does not change "more than half"). Else drop the share from slide 12.
3. Budget: all six stations' forms alive add up to about 590k grains at tier 0 (hist 91.6k,
   curve 9k, real scatter 95k, toys 6k, loss 40k, rare 104k, trigger 33k, pile 92k, dust
   124k), above the engine's about 503k per-slide cap if forms on other stations count
   (README). Apply the visibility schedule under Stations (ev, rare, loss, trg, file, h,
   fit), confirm with `grain-budget` whether a form at step 0 still counts, and if it does,
   do not build it on those slides. `grain-budget` green on every slide is required before
   the draft is judged. The kit detector at the gate is already dropped.
4. Prototype before roll-out (talk-quality §4 rule 2): the close (dk-trigger `collapse` into
   a dk-pipeline pile) on a sparse and a dense slide; dk-spark following a dk-scatter's
   grain; slide 5's `{box: null}` (the edge to dust, no line) then `{epoch: 1}` drawing on
   fresh rather than gliding; `right` counting during slide 6's sweep; the trigger with no
   packet of ours.
5. Owner: our grain keeps a light-blue core on slides 12-14 although its window label is
   class 1 (bible decision 2). Keep it, or let it turn white there to show that the label,
   the fit (0.144) and the network (0.46, if filed) disagree?
6. Owner: slide 10 shows the line's test accuracy (53.3 %) where the bible had the training
   65 %.
7. Owner: slide 12 shows the two-input 61.3 % where the bible had 0.629 (three inputs), so
   the number belongs to the boundary drawn.
8. Owner (bible §7.9): real labels from the mass window (weak, 61.3 % / 62.9 %) or sWeights
   (stronger, to build). This outline keeps the window.
9. Was the Lipschitz topological trigger still HLT2's production selection in 2025-26 data
   taking? No source after 2024 was checked (lane open question). Slide 17's notes use the
   past tense and "designed with" until then.
10. T3: the cover copies T3's close pose with `sway` 1 and `steady` true. If T3 drops the
    sway instead, drop it here too; either way the two poses stay identical.

## Decisions taken in the draft (29 Oct 2026, `draft:data4learn`)

The deck follows this outline with the owner's decisions of 29 Oct (bible top block) on top.
Each with its alternative.

1. **Cuts between stations.** Slides 4, 7, 8, 9, 11, 14 and 16 of the deck enter their
   station on a one-key `path` at t = 0, not the outline's flights. Inside a station the
   camera still moves where the move is the picture: the cover's 6 s ease, slide 2's 3 s
   rise with the tip, the side-on turn and back (slides 12-13, lab 4's three-key paths) and
   the close's 7 s pull-back to T5's cover pose. Alternative: flights, as written above.
2. **The peak unnamed.** No caption on the cloud's x axis (no "IPχ²", and "how far the track
   points from the collision" is too long for a caption): raw ticks 0.01 to 10 000 only; y
   keeps "20 ps" in its top tick. Every Message and Picture line is rewritten without the
   particle's, the decay's or the record's names ("a short-lived particle's mass peak", "the
   quality cut"); Sources keep the provenance. Alternative: a two-word caption such as
   "track offset", which the owner has not seen.
3. **No experiment internals.** Slide 16's notes say "the first filter" and "the second
   filter", and drop the GPU count (`lhcb-hlt1-500-cards-89khz` is no longer cited).
4. **Outline slide 7 dropped (drop order 2).** The b-profiled bake is in, but the kit draws
   no ball standing at the path's start: at the gather step the ball is hidden and the
   readout reads the minimum, 0.162 (first shots). The deck's slide 7 is a cut to the valley
   that gathers, then rolls from 0.693 to 0.162, the count following the ball; 2.0 min, both
   messages in its notes. Kit request 3 would bring the split back.
5. **The cover has no dk-spark.** T3's close fades its ring (`ours: 0`), so the cut from T3
   is seamless only without one; the ring comes in on slide 2, following the cloud's grain
   of our row (`on: 'ev'`). The fitted curve draws on about 1.5 s after the plot stands
   (dk-curve has no `replay: false`: kit request 1), under the title's rise.
6. **Slide 5 does not say "150 of 200".** The amendment to `perceptron-course-worked` is not
   filed (notes/facts-needed.md); the notes say only that training has to go on from the
   first line. Slide 6's live count still starts at 150 as the sweep begins.
7. **Fixed numbers where the form gives none:** 177 "cut" on slide 6, 0 for b on slide 5,
   92.0 % test and ± 3.8 % on slide 8, 53.2 % guess and 61.3 % network on slides 11 and 13,
   99.9 % on slides 12 and 14, 1 in 30 on slide 16. Every other number is a `<StageCount>`
   reading its form.
8. **The leak's depth range** stays dk-scatter's default 1 810-1 920 (kit request 2); only
   the ticks 1 845 and 1 885 MeV/c² are drawn, so no range end shows.
9. **The close** uses lab 4's proven gate (gate 2 at keep 0.1, shrink 0.75, and the buffer
   from step 3; `ball.buffer: true`, so the ball reads) and cites
   `lhcb-hlt2-keep-1-in-10-worked` for the second filter's keep.
10. **No clips, no credits.** The talk's manifest lists no clip and the outline uses none; no
    LHCb geometry is drawn, so the last slide carries no licence credit.
11. **Open:** the lint flags the cover's title as TEXT. The headmatter's `onscreen: numbers`
    (needed to turn the numbers-only rule on for a `2026_00` deck, bible §3) is read as
    slide 1's own `onscreen`, which refuses the cover its title
    (`scripts/talk_lint.py`, the `words_ok` line; `tests/test_lint.py`
    `test_older_decks_and_opt_outs` expects that behaviour). The five data talks all meet
    it; the fix belongs to the lint, not to a deck.

## Decisions from the fresh-eyes review (29 Oct 2026, `fix:data4learn`)

12. **The valley (deck slide 7)** is seen low along its floor from the trained end (yaw 45,
    pitch 20, dist 25.5), over w from −0.2 to 3.4 with `zmax` 0.6 (loss heights above 0.76,
    the negative-weight corner, are not drawn), so the walls rise left, right and behind the
    ball. The bake's grid ends at 3.4, and past the minimum the loss rises only to about
    0.18, so "ticks 0-4 so the far walls rise" was not possible; looking along the floor
    gives the walls instead. Ticks 0-3 on the front edge, 0-2 on the right (one 3 at the near
    corner), and the names w₁ and w₂ as two built-in world labels (kit request 5).
    Alternative: T3's bowl angles (yaw −12, pitch 34), which read as a sloping sheet.
13. **Minutes:** slide 7 2.0 → 1.5, slide 10 0.5 → 1.0 (the network is the talk's hardest
    new idea), slide 16 0.5 → 0.75; total 14.25.
14. **Toy and ring stations seen close:** plots 4 × 4 at dist 6.8 (toy) and 8.2 (ring), so a
    grain draws about 1.3-1.5 times larger (the series grain size is unchanged); toy axes
    named x₁ and x₂ (`word`, `wordY`); alpha 1.35. The ring shows all 600 points, the 480
    training and validation points at 0.45 brightness, the 120 test points whole; its range
    is ±2.75 and its frame sits higher, so the straight line ends nearer the data and above
    the lower third (kit request 4 would clip it to the data).
15. **Slide 8's errors** are said, not marked: dk-spark's ring is the series' marker for our
    grain, and four more would blur it (kit request 7 asks for a separate mark).
16. **The real plot's y axis** starts at the data's own 0.150 ps floor (range −0.826 to
    1.699 in log10 ps) and closes with a 50 ps tick, so the network's boundary ends on the
    axis instead of running through the empty corner below the cloud. Slide 2's Caveats now
    explain the floor.
17. **The leak's depth ticks** read "1 845" and "1 885", placed 5 MeV low so each
    left-aligned label centres under its wall, and a third tick at the axis end carries
    "mass MeV/c²" (kit request 6). The range stays the kit default (Decision 8, kit
    request 2).
18. **The gate (deck slide 16)** is framed close: dist 12, yaw −18, pitch 12, with the first
    filter's ring in the middle of the frame and the lane above the number. Slide 17's path
    starts from the same pose.
19. **The cover title** stands in the empty top left (`justify-content: flex-start`,
    padding-top 7.5 %), clear of the histogram's left flank; T3's close pose is unchanged.
20. **`.nums` at bottom 190 px** (was 96): a three-line block ends above the lower third.
    The other four talks should follow (series request in notes/kit-requests.md).
21. **Slide 10** shows one number, 95.0 % test, against slide 9's 53.3 %; 114 of 120 moves
    to the notes. Slide 15's Message names recall.
