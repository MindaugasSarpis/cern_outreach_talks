<!-- outline:data3fit, 2026-10-29. The house pipeline's outline step (talk-quality §2, step 3) for Talk 3 of
"Data analysis, the CERN way". Inputs: series bible §5 Talk 3 with the corrections on top (binding), the kit README
(29 Oct), notes/prototypes.md, the research lanes data3fit-lhcb-scale and data3fit-pdg-d0, the Brief, and the
OpenData/Innoday decks as models. Revised the same day from the outline critique (revise:data3fit): every high and
medium finding fixed, the low ones taken. deck.md and space.json are not touched by this step. -->

# Data3Fit outline: "Fitting"

**Question.** The D⁰ peak is real (T2). Where exactly is it, and how long does a D⁰ live?

**Takeaway.** A fit moves a model until it matches the counts. The answer is the bottom of a valley, and its
uncertainty is how wide the valley is. A precise result can still sit off the world value for reasons the statistics
do not show.

**Misconception met on screen** (slide 2): the narrowest window mean, the one nearest PDG, is the mass. The slide
ends on the same window moved half an MeV/c², whose mean lands 0.4 MeV/c² below PDG.

**Hero.** The D⁰ heap of record 401 (91 583 candidates) with dk-curve settling onto it, then whitening by signal share.

**Music peak** (edit only, sound off in the deck): the bowl reveal, slide 5.

## Conventions used below

- Stations (proposal for space.json, which the deck step writes): `mass` at [0, 0, 0] (dk-hist `h`, dk-curve `fit`,
  dk-landscape `bowl` under `h`, dk-spark `ours`), `slice` at [70, 0, 0] (dk-landscape `s1` and `s2`, dims 1), `tau` at
  [140, 0, 0] (dk-hist `tau`, dk-curve `decay`). Positions and the lab poses below are lab 3's
  (`talks/2026_00_00_DataLab3`), whose stills the prototype review passed.
- Mass range of `h`: `lo: 1816, hi: 1912` (48 bins of 2 MeV/c²), the recommended default for prototypes.md's open
  edge-bin question, pending the owner (Decision 7). The fit range 1 820-1 910 and our grain's 1 880-1 882 bin are
  inside it and on the same bin edges.
- Every data slide: `ambient: 0`, `dim` 0.2-0.35, `steady: true` wherever a number is read off the picture,
  `transition: dust` between world slides, sound off. Poses are `space: { at, dist, yaw, pitch, dim, ambient, steady }`.
- Numbers are the `.nums` block (46 px number, 22 px `.unit`, a one- or two-word `.name`), at most three a slide. World
  tick numbers belong to the picture and are listed with it. The cover carries its plain title and nothing else.
- Colours: light blue = the crowd, white = the selected, dim = axes, our grain marked by dk-spark's ring only. Our
  grain's core keeps T2's colour until slide 13's `{weights}` click turns it light blue (0.144 explains why).
  "width" is the Gaussian's spread; σ is significance only (T2's meaning).
- **[P: name]** marks a slide that relies on a prototype mechanic from bible §4's table, with the verdict from
  notes/prototypes.md. **[unprototyped]** marks a mechanic outside the table that no still has shown yet. Every T3
  verdict was judged on stills only; the motion checks are listed under "Motion checks before recording".
- **Gated** marks a number that stays off the slide until its fact is in the bank (`pnpm talk facts show <id>` returns
  it). The ids are listed per slide under "Missing" and collected under "Facts to file before the deck step".

## Slide table

| # | part | picture (one) | on-screen numbers | min | prototype |
|---|---|---|---|---|---|
| 1 | Cover | T2's last frame, then a line of grains (`fit` set 0) draws across the peak | none (title "Fitting") | 0.5 | [P: dk-curve sparse] |
| 2 | Means disagree | dk-hist `{window}` narrowing three times, then re-centred on the fit; dim PDG tick | live mean MeV/c², 1 864.84 MeV/c² PDG | 1.5 | (window: lab 2 stills) + re-centre and close pose [unprototyped] |
| 3 | A model | dk-curve at the start values + pull row | 7.2 MeV/c² width, χ² 372 (gated) | 1.5 | [P: dk-curve sparse] |
| 4 | A model | dk-curve iterating to the fit, signal part, pulls | 1 864.47 MeV/c² μ, 7.65 MeV/c² width, χ² 53.4 / 40 | 2.0 | [P: dk-curve dense] |
| 5 | The valley | plot tilts back, χ² bowl gathers, ball rolls, Δχ² = 1 ring | live μ 1 864.47 MeV/c² | 1.5 | [P: dk-landscape dense] + tilt hand-over [unprototyped] |
| 6 | The valley | χ² slice in μ, Δχ² = 1 error bar | live μ 1 864.47 MeV/c², ± 0.10 MeV/c² error | 1.0 | [P: dk-landscape sparse] |
| 7 | Off by 0.37 | the same slice drawn up to Δχ² 20, PDG's ± 0.04 band on its wall | 0.37 MeV/c² gap, 3.5 σ | 1.0 | [P: dk-landscape sparse], extended [unprototyped] |
| 8 | Off by 0.37 | all grains slide by the scale (`{shift}`), the curve's summit glides from the 1 864.47 tick to the 1 864.84 tick | 0.026 % momentum, 0.03 % LHCb syst | 1.0 | [unprototyped: dk-hist {shift}; gated on its burst strip] |
| 9 | How long it lives | clip `velo_installation.mp4` (CDS 2295935, 12 s) | none | 0 + 12 s | |
| 10 | How long it lives | empty decay-time axis, then 2 000 candidates, `{subtract}` | live count "candidates" → 596 (gated) | 1.3 | [P: dk-hist subtraction sparse] |
| 11 | How long it lives | all candidates subtracted, exponential without the cut | 0.509 ps τ, 0.410 ps PDG | 0.6 | [P: dk-hist subtraction dense] |
| 12 | How long it lives | `{cut}` IPχ² < 9 removes grains at every time, most from the tail; curve steepens | 0.421 ± 0.005 ps τ, 0.410 ps PDG, < 9 IPχ² | 1.2 | [P: dk-hist subtraction dense] |
| 13 | Which are D⁰s | peak whitens by P(signal), our grain's core turns light blue | 16.2 MeV/c² offset, 0.144 P(signal) | 0.8 | [P: dk-hist weights sparse] |
| 14 | Close | the whole whitened peak with its curve (T4's cover pose) | 20 993 signal | 0.5 | [P: dk-hist weights dense] |

Minutes 14.4 + clip 12 s (0.2 min) = **14.6** (limit 15, hard 15.75). Parts: cover and means 2.0, a model 3.5, the
valley 2.5, off by 0.37 2.0, how long it lives 3.1 + 0.2, close 1.3.

---

## 1. Cover

- **Pose.** `mass`; T2's close pose exactly, so T2's last frame cuts to T3's first:
  `{ at: [-1, 3.2, 0], dist: 25, yaw: -4, pitch: 5, dim: 0.3, ambient: 0, sway: 1 }` (lab 2/3's mass look, to be
  matched to whatever T2's deck lands on). No rate change.
- **Entrance.** The bible's own: the first frame is T2's last frame (the heap standing, `h` step 1 with
  `replay: false` on this arrival so the 9 s fill does not replay; our grain's halo already on, its core in T2's
  colour). Then the plain title rises while dk-curve `fit` at set 0 draws on across the peak as a line of grains.
  Nothing disappears and nothing changes colour.
- **Picture.** dk-hist `h` of all 91 583 candidates (M, 2 MeV bins, drawn 1 816-1 912), dk-spark `ours` on `h` (core in
  T2's colour, halo on), dk-curve `fit` set 0 without pulls. Steps `{ h: 1, fit: { set: 0 }, bowl: 0, ours: 1 }`.
- **On screen.** The title "Fitting". Nothing else (no subtitle, byline, card, `.src`, kicker).
- **Notes.**
  - Message: last time we counted this peak and showed it is real; today we draw a line through this peak and
    measure it.
  - Picture: the same heap as T2's close, one grain per candidate, our grain (row 1) ringed in the 1 880-1 882 bin;
    the line of grains is the model we will fit, at a first guess.
  - Caveats: always "candidates" (the portal's 53 948 counts events). The drawn range is 1 816-1 912 because record
    401's stripping window (about 1 813-1 915) leaves the outer bins half empty.
  - Sources: CERN Open Data record 401 (DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR).
- **Facts.** `record401-candidates-91583`, `d0-row1-values-worked`.

## 2. Means disagree  [window: lab 2 stills; unprototyped: the re-centre click and the close pose]

- **Pose.** `mass`; clicks 1-3 `{ at: [-0.5, 3.0, 0], dist: 22, yaw: -4, pitch: 5, dim: 0.25, ambient: 0,
  steady: true }`. Click 4 closes on the summit over 1.6 s: `{ at: [-0.1, 9.0, 0], dist: 8, yaw: -4, pitch: 3,
  dim: 0.25, ambient: 0, steady: true }` (the window's edges, ± 2.5 world units, stay in frame).
- **Picture.** The narrowing window is the picture; the number is its mean. Arrival: `fit: 0` (the cover's line
  fades). dk-hist `h` `{window}` over clicks: [1 840, 1 890] → [1 850, 1 880] → [1 855, 1 875], then click 4 the same
  20 MeV/c² window re-centred on the fitted 1 864.47: [1 854.47, 1 874.47]. Grains inside turn white. A dim world
  tick at 1 864.84 (PDG) anchors the kit's mean tick on the close pose of click 4 (kit gap: `ticks` is an object prop
  today; see "Kit gaps"). Big move: the window narrows and the number changes with it; then the same window moved
  half an MeV/c² gives a different number.
- **On screen.** `<StageCount for="h" :decimals="2">` (MeV/c², name "mean"): 1 864.71 → 1 864.79 → 1 864.81 →
  1 864.42 (gated: `d0-window-centre-bias-worked`); 1 864.84 MeV/c² (name "PDG").
- **Notes.**
  - Message: the average of the grains in a window depends on the window, both its width and where it sits, so it
    cannot be the mass.
  - Picture: the white band is the window; the live number is the mean of its grains; each of the first three clicks
    narrows the window by 10 MeV/c²; the last click slides the narrowest window 0.53 MeV/c² to the left, onto the
    fitted centre, and the mean drops 0.38 MeV/c², from just under PDG to well below it.
  - Caveats: the all-candidate mean is 1 864.10 MeV/c² (91 583). The first three windows are all centred on 1 865, so
    the mean is pulled toward 1 865 as they narrow: the narrowest lands near PDG because of where it was placed.
    Centred on 1 864.47 instead, half-widths 25 / 15 / 10 / 5 give 1 864.38 / 1 864.46 / 1 864.42 / 1 864.44; centred
    on 1 865 with half-width 5 (1 860-1 870) the mean is 1 864.92, past PDG (computed 2026-10-29 from d0.f32; the bake
    commits them before the deck step).
  - Misconception: "the narrowest window mean, nearest PDG, is the mass". Narrower still overshoots it, and the same
    window moved half an MeV/c² undershoots it.
  - Sources: record 401 via bake/d0.py (d0-means.json); PDG 2026, pdgLive S032 (the D⁰ mass the Particle Data
    Group averages from all measurements; cite the "OUR FIT" 1 864.84, not "OUR AVERAGE" 1 864.85).
- **Facts.** `course-d0-row-means-worked`, `pdg-d0-mass-2026`. Missing: `d0-window-centre-bias-worked` (the
  off-centre means and the 1 860-1 870 mean).

## 3. A model: start values  [P: dk-curve sparse; verdict "reads"]

- **Pose.** `mass`; lab 3 slide 1: `{ at: [-6, 3.0, 0], dist: 26, yaw: -4, pitch: 5, dim: 0.25, ambient: 0,
  steady: true }` (room under the axis for the pull row).
- **Picture.** dk-curve `fit` (gauss+poly1, d0-fit.json) at set 0, the start values read off the histogram, back over
  the 84 680 candidates in the fit range 1 820-1 910 MeV/c², now with its pull row (`{ set: 0, pull: true }`).
  Steps `{ h: 1, fit: 1 }`. The pulls swing −3 … +3.5 in an S under the peak.
- **On screen.** 7.2 MeV/c² (name "width"); `<StageCount for="fit">` χ² → 372 (gated: `d0-fit-start-chi2-worked`;
  until it is filed the slide shows the width only).
- **Notes.**
  - Message: a model is a curve with five knobs, set here by eye from the peak's height, centre and width. Each pull
    is one bin's miss in units of its √N wobble; χ² adds them squared.
  - Picture: the white line is a Gaussian (T2's bell) on a straight background line; the row under the axis is each
    bin's pull, (count − model) / √count (T2's √N); the S of large pulls on the flanks is what χ² 372 means.
  - Caveats: the start width comes from the full width at half maximum, 16.86 MeV/c² / 2.355 = 7.16 MeV/c², at the
    tallest bin's centre 1 863.0 MeV/c² (said on screen only as "set by eye from the peak's width"); the line and the
    five knobs (signal count, μ, width, level, slope) are the course's model. χ² at the start values is 371.5
    (d0-fit.json iterations[0]; dk-curve's live readout matches it).
  - Sources: record 401 via bake/d0.py (d0-fit.json iterations[0]).
- **Facts.** `d0-fit-start-fwhm-worked`. Missing: `d0-fit-start-chi2-worked` (the bake output exists; the fact does
  not).

## 4. A model: the fit  [P: dk-curve dense; verdict "reads", pull row the busiest element]

- **Pose.** `mass`; lab 3 slide 2: `{ at: [-11, 1.6, 0], dist: 28, yaw: -4, pitch: 4, dim: 0.25, ambient: 0,
  steady: true }`.
- **Picture.** dk-curve `fit` glides through bake/d0.py's logged Levenberg-Marquardt steps: click 1 set 1 (χ² 56.6),
  click 2 set 2 (53.4), click 3 set 5 with `parts: 'sig'` (the white dashed Gaussian). Pulls shrink to a patternless
  ±2. Iterations 3-5 differ only in the fourth decimal, so three visible moves. Big move: the curve of grains finds
  the peak.
- **On screen.** 1 864.47 MeV/c² (name "μ"); 7.65 MeV/c² (name "width"); `<StageCount for="fit">` χ² → 53.4 with
  `.unit` "/ 40". No error yet: ± 0.10 first appears on slide 6, where it is defined.
- **Notes.**
  - Message: the fit moves the knobs until the pulls are as small as they get. Each pull wobbles by about ± 1 by
    chance, so a fit that matches has χ² near the number of bins minus the knobs, 45 − 5 = 40; 53 for 40 happens by
    chance about 8 % of the time (T2's p-value).
  - Picture: the white curve now touches the column tops; the dashed curve is the signal part alone (the background is
    the curve's flat shoulders); the pull row is small and has no pattern left.
  - Caveats: χ²/ndf 1.33, p = 0.077. The width is the detector's mass resolution, not how wide the D⁰ is: LHCb quotes
    about 8 MeV/c² for D⁰ → K⁻π⁺ in Run 1 and early Run 2. The minimiser path is logged by the script, never drawn by
    hand.
  - Sources: record 401 via bake/d0.py (d0-fit.json); LHCb, JHEP 03 (2016) 159 (resolution).
- **Facts.** `course-d0-fit-mass-worked`, `d0-fit-chi2-ndf-worked`, `d0-mass-resolution-lhcb`.

## 5. The valley: the bowl  [P: dk-landscape dense; verdict "reads, looks impressive"]  [unprototyped: tilt → fade]

- **Pose.** Lands on lab 3 slide 4's pose `{ at: [0.4, -3.6, 6.2], dist: 19, yaw: -12, pitch: 34, dim: 0.25,
  ambient: 0, steady: true }` by a 3 s `path` from slide 4's pose, the camera rising while the plot tips.
- **Picture.** On arrival `h` `{tilt: 62}` (the curve tilts with it). Click 1: `h: 0`, `fit: 0`, `bowl: 1`, the
  plot fades as the χ²(μ, width) surface gathers under the floor in front of it (cropped `range: [0.4, 0.3]`).
  Click 2: `bowl: 2`, the ball rolls the logged path in over the rim. Click 3: `bowl: 3`, the Δχ² = 1 ring lights.
  World ticks: μ 1 864.3 / 1 864.5 / 1 864.7 on the front lip, width 7.5 / 7.65 / 7.8 on the right edge. Big move:
  the plot tilts and the bowl appears under it (the music peak).
- **On screen.** `<StageCount for="bowl" :decimals="2">` → 1 864.47 MeV/c² (name "μ").
- **Notes.**
  - Message: every pair of knob values (μ, width) has a χ²; the fit is the bottom of that valley.
  - Picture: height is χ² above its minimum; the ball is the minimiser, rolling the steps slide 4 took; the white ring
    is where χ² is 1 above the bottom, and the next slide turns it into a number.
  - Caveats: the other three knobs are re-fitted at each point (profiled). The path's start (1 863.0) lies outside the
    crop, so the ball rolls in over the rim. The plot is hidden while the bowl stands: two μ scales on one screen read
    as one.
  - Sources: record 401 via bake/d0.py (d0-chi2.json).
- **Facts.** `d0-fit-valley-delta-chi2-worked`, `course-d0-fit-mass-worked`.

## 6. The valley: the slice  [P: dk-landscape sparse; verdict "reads"]

- **Pose.** `slice`; lab 3 slide 3: `{ at: [64.5, 3.6, 0], dist: 18, yaw: 0, pitch: 3, dim: 0.25, ambient: 0,
  steady: true }`; dust transition from the bowl.
- **Picture.** dk-landscape `s1` (dims 1, profiled slice, Δ ≤ 4): the white parabola draws on, the ball rolls to the
  bottom, then the dim Δχ² = 1 line, the white error bar between the crossings and the dim drop lines to their
  labels 1 864.38 and 1 864.57 (world numbers). Steps `{ s1: 3 }`, caption "Δχ²".
- **On screen.** `<StageCount for="s1" :decimals="2">` → 1 864.47 MeV/c² (name "μ"); ± 0.10 MeV/c² (name "error"), its
  first appearance in the talk.
- **Notes.**
  - Message: the error is how wide the valley is where it is 1 above its bottom.
  - Picture: one cut through the bowl along μ; the bar along the Δχ² = 1 line spans 1 864.38 to 1 864.57, half-width
    0.0965 MeV/c², the fit's statistical error.
  - Caveats: the slice shows Δ ≤ 4, so the ball's first leg starts at the slice's left end, not at the start value.
    The same cut along the width gives ± 0.10 MeV/c² for the width. Statistical means "from the counts' √N alone".
    Moving the 90 MeV/c² fit range by 4 MeV/c² moves μ by at most 0.03 MeV/c², inside its ± 0.10.
  - Sources: record 401 via bake/d0.py (d0-chi2.json slice; d0-fit.json stability).
- **Facts.** `d0-fit-valley-delta-chi2-worked`, `d0-fit-window-stability-worked`.

## 7. Off by 0.37: the world value on the wall  [P: dk-landscape sparse, extended; unprototyped: slice.zmax 20, ticks and a band on dims 1]

- **Pose.** `slice`, pulled back and lifted: `{ at: [64.5, 4.5, 0], dist: 23, yaw: 0, pitch: 4, dim: 0.25,
  ambient: 0, steady: true }`; same station, no dust.
- **Picture.** `s1` gives way to `s2`: the same profiled slice drawn up to Δχ² = 20 (`slice: { zmax: 20 }`; the bake's
  slice runs to 1 864.97, so PDG's band is on it), ball at the bottom, no ring (no crossing labels). PDG is drawn as
  a dim band 1 864.80-1 864.88 (its ± 0.04) standing on the right wall, where the wall runs from Δχ² 11.5 to 17.8
  across it; world ticks only 1 864.47 and 1 864.84. Steps `{ s1: 0, s2: 1 }`. Big move: the band sits high up the
  valley's wall.
- **On screen.** 0.37 MeV/c² (name "gap"); 3.5 `.unit` σ.
- **Notes.**
  - Message: the world value lies far up the wall of our valley: 0.37 MeV/c² away. Δχ² = n² is n errors from the
    bottom (1 is one error, 4 is two, 9 is three): at PDG's value Δχ² is 14.5, so it is 3.8 of our errors away. With
    PDG's own ± 0.04 added in quadrature, √(0.0965² + 0.04²) = 0.104, the gap is 3.5 σ.
  - Picture: the same valley as slide 6, drawn higher; the band is PDG's 1 864.84 ± 0.04, the second error, the one
    that is not ours.
  - Caveats: 3.5 σ is 0.368 / 0.1045 = 3.52, from unrounded values; the rounded 0.37 / √(0.10² + 0.04²) gives 3.44
    and the course's ± 0.05 gives 3.3 (bible open question 4 stays open; the corrections set 3.5 on screen). Errors
    add in quadrature when they are independent. Δχ² 14.5 at 1 864.84 is read off d0-chi2.json's slice (linear on its
    0.01 MeV/c² grid; 3.81² = 14.52 from the stat-only z). σ here is T2's significance.
  - Misconception: "3.5 σ means the fit is wrong, or new physics". A statistical error says nothing about a scale
    error; that is the next slide.
  - Sources: PDG 2026 S032; record 401 via bake/d0.py (d0-fit.json gap, d0-chi2.json slice).
- **Facts.** `d0-pdg-gap-3p5-sigma-worked`, `pdg-d0-mass-2026`. Missing: `d0-pdg-on-valley-wall-worked` (Δχ² 14.5 at
  1 864.84; the critique's 14.7 was the earlier outline's misreading).

## 8. Off by 0.37: a scale  [unprototyped: dk-hist {shift}; gated on a lab 3 sparse/dense pair with a `--burst` strip]

This slide is provisional until `{shift}` has been seen in motion (talk-quality §4 rule 2): the kit README calls the
0.02 % shift "a tenth of a bin" and unseen, and about a fifth of the grains change bin, which may read as a flicker.
If the burst does not read, drop order item 5 applies (fold into slide 7's notes) rather than a motionless slide.

- **Pose.** `mass`, close on the peak's summit so the summit's glide between two ticks reads:
  `{ at: [-0.1, 9.5, 0], dist: 6, yaw: -4, pitch: 3, dim: 0.25, ambient: 0, steady: true }`; dust from `slice`.
- **Picture.** `h` back upright and full; dk-curve `fit` at set 5 (no pulls). Two world ticks on the axis: 1 864.47
  (dim, our fit) and 1 864.84 (white, PDG) (kit gap: per-slide ticks). Click: `h` `{shift: 1.00019716}`, every grain
  slides right by 0.37 MeV/c² (0.09 world units) and the columns restack, and the curve glides to a refit set
  (`{ "mu": "@scale.refitMu", … }`, 1 864.85), its summit moving from the dim tick to the white one. Big move: the
  curve's summit glides from our value onto PDG's.
- **On screen.** 0.026 `.unit` % (name "momentum"); 0.03 `.unit` % (name "LHCb syst").
- **Notes.**
  - Message: the mass is computed from the two tracks' momenta (T2), and each momentum comes from how far the
    magnet bends the track; if that bending is calibrated 0.026 % off, every mass moves by 0.02 %, and that closes the
    gap. LHCb's own momentum-scale uncertainty in Run 1 was 0.03 %, so a result is value ± stat ± syst.
  - Picture: the grains are the same candidates; the shift multiplies every mass by 1.000197 (the refit gives
    1 864.85 ± 0.10 MeV/c²); the curve's summit moves from the dim tick (our fit) to the white one (PDG).
  - Caveats: the K⁻π⁺ mass moves by 0.856 of the momentum scale for a D⁰ at rest and 0.77 on average over decays
    (simulated angles), so the momentum shift is about 0.026 %, the mass shift 0.0197 %. This shows only that a shift
    of the size LHCb quotes would close the gap; it does not show that it is the cause (energy loss, alignment and the
    masterclass's own processing are others). 0.03 % is a Run 1 systematic (arXiv:1412.6352), "uncertainty", not
    "calibration precision". The name is "momentum", not "p scale", so it does not collide with slide 4's p-value.
  - Sources: LHCb, Int. J. Mod. Phys. A 30 (2015) 1530022; record 401 via bake/d0.py (d0-fit.json scale).
- **Facts.** `d0-mass-shift-0p02pct-worked`, `lhcb-momentum-scale-uncertainty`, `pdg-d0-mass-2026`.

## 9. How long it lives: the VELO (clip)

- **Pose.** One-key `path` cut under the clip's last frame to the `tau` station, empty axis:
  `path: [[0, { at: [140, 6, 0], dist: 30, yaw: -20, pitch: 18 }]]`, `dim: 0`, `ambient: 0`. Steps `{ tau: 0 }`.
  No h1, no fade after it, no `advance-on-end`. Commit `public/video-frames/index.json` (`pnpm videos:frames`).
- **Picture.** Clip `velo_installation.mp4`: CERN-FOOTAGE-2022-031-001 (CDS 2295935, 1:35, licence CERN, no
  credit), a 12 s stretch of the VELO lowered and inserted (timecode open). Added to videos/manifest.toml by the deck
  step.
- **On screen.** None.
- **Notes.**
  - Message: the VELO, silicon a few millimetres from the beams, sees where each D⁰ was made and where it decayed.
  - Picture: the clip shows the upgraded VELO going in (2022): 52 modules, about 41 million 55 µm pixels.
  - Caveats: record 401 is Run 1 data (2011 or 2012), measured by the original strip VELO, not the one in the clip.
  - Sources: videos.cern.ch record 2295935; LHCb VELO upgrade (lhcb-velo-pixels).
  - Clip 12 s; the owner talks over it. The lifetime itself is said on slide 10's first beat.
- **Facts.** `cds-2295935-velo-clip`, `lhcb-velo-pixels`, `lhcb-velo-distance` (5.1 mm), `lhcb-record401-year`.

## 10. Decay times, a few  [P: dk-hist subtraction sparse; verdict "quiet dot plot, subtraction lives in the motion"]

- **Pose.** `tau`; crane (3 s `path`) from slide 9's key to lab 3 slide 5: `{ at: [136, 2.6, 0], dist: 17, yaw: -4,
  pitch: 5, dim: 0.25, ambient: 0, steady: true }`.
- **Picture.** dk-hist `tau` (TAU, 0-5 ps, 0.25 ps bins, `split` on M: window 1 850-1 880 white, sidebands
  1 820-1 840 and 1 890-1 910 light blue), caption "decay time ps". Beat 1 (about 0.3 min): arrival on the empty
  decay-time axis, `{ tau: 0 }` held while the owner names what the axis measures. Click 1 `{ n: 2000 }`; click 2
  `{ subtract: true }`: three of every four sideband grains take one window grain of their bin with them, the rest go
  alone; the white grains settle. Steps `{ tau: 0 }` → `{ tau: 1 }` → `{ tau: 2 }`.
- **On screen.** `<StageCount for="tau">` (name "candidates"): up to the 2 000 drawn, down to 596 when the
  subtraction settles, all of them window grains then (gated: `d0-tau-subtract-2000-worked`; until it is filed the
  slide carries no number and the subtraction is the picture).
- **Notes.**
  - Message, beat 1: a decay time is flight length over speed; D⁰s live on average 0.41 ps, which is cτ = 123 µm of
    flight in their own frame.
  - Message, beat 2: under the peak sits background (T2's sidebands); its decay times are known from the sidebands
    and removed bin by bin.
  - Picture: white = candidates in the mass window, light blue = sideband candidates; three of every four sideband
    grains take one window grain with them; the rest go alone, because the sidebands are 40 MeV/c² wide against the
    window's 30 (weight 0.75); what stays white is the D⁰ part.
  - Caveats: the lab flight is longer than cτ by βγ = p/(Mc). The first 2 000 in the plot's seeded order; the
    subtraction is statistical (pairs within a bin), not a decision about which grain is a D⁰. Row 1
    (1 880.65 MeV/c²) is just outside the window and in no sideband, so it is on none of the decay-time plots.
  - Sources: record 401 via bake/d0.py (d0-tau.json); PDG 2026 summary tables (τ, cτ).
- **Facts.** `pdg-d0-lifetime-2026`, `d0-lifetime-fit-from-record401-worked`. Missing: `d0-tau-subtract-2000-worked`
  (596 with N_window and N_sideband of the first 2 000).

## 11. Decay times, all  [P: dk-hist subtraction dense; unprototyped: the no-cut curve set]

- **Pose.** `tau`; lab 3 slide 6: `{ at: [135.5, 2.6, 0], dist: 19, yaw: -4, pitch: 5, dim: 0.25, ambient: 0,
  steady: true }`.
- **Picture.** `tau` `{ n: 'all' }` then `{ subtract: true, fitRange: [0.5, 5] }` (bins below 0.5 ps keep the crowd
  colour: not used by the fit; `selGain` 1.5-1.8 so the white columns read white); dk-curve `decay` draws the
  sideband-weighted exponential fitted without the IPχ² cut (a second set, 0.509 ps), the curve ending at 3 ps.
- **On screen.** 0.509 ps (name "τ"); 0.410 ps (name "PDG").
- **Notes.**
  - Message: the subtracted decay times fall as an exponential, but one that lives too long.
  - Picture: white columns = window minus sidebands; the white line is the fitted exponential from 0.5 ps; the light
    blue below 0.5 ps here means "not used by the fit, like the crowd", not sideband (the sideband grains are gone).
  - Caveats: the file's decay times start at 0.150 ps (a pre-selection), and the efficiency rises over the first
    tenths of a ps, so the fit starts at 0.5 ps (an exponential is memoryless); acceptance is not modelled. Without
    the cut τ rises from 0.482 to 0.571 ps as the start moves from 0.25 to 1.0 ps: something long-lived is mixed in.
    Check on the lab 3 dense still before the deck's shots that the below-0.5 bins do not read as sideband; if they
    do, give them a lower alpha of the crowd colour.
  - Sources: record 401 via bake/d0.py (d0-tau.json scanT0.all); PDG 2026.
- **Facts.** `d0-lifetime-without-ipchi2-cut-worked`, `pdg-d0-lifetime-2026`.

## 12. Decay times, cut  [P: dk-hist subtraction dense; verdict "reads" with fitRange]

- **Pose.** `tau`; same pose as slide 11 (no camera move; the number is read off the picture).
- **Picture.** Click: `tau` `{ cut: ['IPCHI2', '<', 9] }`; the failing grains lift away as dust at every decay time,
  most of them from the long tail, and the columns settle; `decay` glides to the committed fit (0.421 ps). Big move:
  the tail thins out and the slope steepens.
- **On screen.** 0.421 ± 0.005 ps (name "τ"); 0.410 ps (name "PDG"); < 9 (name "IPχ²").
- **Notes.**
  - Message: a B is a heavier particle that flies a few millimetres before decaying, so a D⁰ from it starts away from
    the collision point and fakes a long life. A cut on IPχ² removes most of them, and τ comes out at
    0.421 ± 0.005 ps against PDG's 0.410.
  - Picture: IPχ² is the same kind of χ² as before: (how far the D⁰'s line misses the collision point / its error)²,
    so < 9 means within 3 errors (T1's fourth number). The cut removes grains at every decay time, most of them from
    the long tail: about a quarter of the window's grains below 0.75 ps, half by 1.5 ps, nine in ten beyond 3 ps
    (computed 2026-10-29 from d0-tau.json, h025_all against h025_ip9), so the slope steepens.
  - Caveats: unbinned, sideband-weighted fit on 0.5-5 ps (8 129 window and 636 sideband candidates, net 7 652),
    statistical error only, acceptance not modelled; moving the start or the cut (2 to 25) moves τ between about
    0.416 and 0.427 ps. D⁰s from B decays with IPχ² < 9 remain and pull τ up. A teaching fit, not LHCb's
    measurement. IPχ² < 9 is our cut; the LHCb masterclass cuts on log₁₀(IP) instead. Row 1 (IPχ² 1 299) would fail.
    With τ measured: the 7.65 MeV/c² width of slide 4 is the detector, since the D⁰'s natural width ħ/τ is
    6.582 × 10⁻²² MeV s / 4.103 × 10⁻¹³ s = 1.6 × 10⁻⁹ MeV.
  - Sources: record 401 via bake/d0.py (d0-tau.json fit, scanIp, hist); LHCb, JHEP 03 (2016) 159 (secondary charm);
    PDG 2026 (τ, ħ).
- **Facts.** `d0-lifetime-fit-from-record401-worked`, `d0-from-b-ipchi2`, `d0-masterclass-ip-cut`,
  `pdg-d0-lifetime-2026`, `d0-row1-signal-share-worked`. Missing: `d0-natural-width-worked` (ħ/τ).

## 13. Which are D⁰s: our grain  [P: dk-hist weights sparse; verdict "acceptable, the weakest of T3's pairs"]

- **Pose.** `mass`; lab 3 slide 7: `{ at: [-3.5, 2.0, 0], dist: 21, yaw: -4, pitch: 4, dim: 0.25, ambient: 0,
  steady: true }`; dust from `tau`.
- **Picture.** `h` upright, `fit` set 5 over it, dk-spark `ours` ringing row 1 in the 1 880-1 882 column with its core
  still in T2's colour. Click: `h` `{ weights: 'psig' }`, each grain whitens by its signal share, and in the same step
  `ours` `{ color: 'crowd' }` turns our grain's core light blue. Steps `{ h: 1, fit: 5, ours: 1 }` →
  `{ h: { weights: 'psig' }, fit: 5, ours: { color: 'crowd' } }`.
- **On screen.** 16.2 MeV/c² (name "offset"); 0.144 (name "P(signal)").
- **Notes.**
  - Message: the fit gives every grain a signal share; ours is 0.144, so it turns mostly blue.
  - Picture: where the dashed signal curve is high over the background the grains turn white; the flanks stay blue;
    the ring marks our grain, 16.2 MeV/c² (2.1 widths) above the fitted centre, and its core turns light blue now.
  - Caveats: at 1 880.65 the fit has 233.6 signal and 1 390.5 background per 2 MeV bin, so 233.6 / 1 624.0 = 0.144.
    Nobody can say whether one row is a D⁰ (series thread).
  - Misconception: 0.144 is not "14 % of a D⁰" or a property of the row; it is the share of D⁰s among candidates at
    that mass.
  - Sources: record 401 via bake/d0.py (d0-fit.json row1, d0-psig.f32).
- **Facts.** `d0-row1-signal-share-worked`, `d0-row1-values-worked`.

## 14. Close: the whitened peak  [P: dk-hist weights dense; verdict "reads"]

- **Pose.** `mass`; lab 3 slide 8, which is **T4's cover pose**: `{ at: [-5, 3.2, 0], dist: 26, yaw: -4, pitch: 5,
  dim: 0.25, ambient: 0, steady: true, sway: 1 }`.
- **Close entrance.** A 4 s `path` pulls back from slide 13's pose while the ring fades (`ours: 0`); the whitened
  peak and its white curve settle and hold. Big move: the peak white, its flanks blue, the frame T4 tips into a 2D
  cloud.
- **Picture.** `h` `{ weights: 'psig' }` with `fit` set 5. Steps `{ h: { weights: 'psig' }, fit: 5, ours: 0 }`.
- **On screen.** 20 993 (name "signal").
- **Notes.**
  - Message: a fit turns a heap into a measured peak and a signal share for every grain; next time a machine draws
    the line between them.
  - Picture: the sum of the shares in the fit range is the fitted signal count, 20 993 ± 276.
  - Caveats: 20 993 counts the 1 820-1 910 MeV/c² range only.
  - Sources: record 401 via bake/d0.py (d0-fit.json).
- **Facts.** `course-d0-fit-mass-worked`.

---

## Ladder check (every idea used is introduced in T1, T2 or this talk)

| idea used | introduced in |
|---|---|
| one grain = one candidate, our grain (row 1), the four numbers (mass, pT, decay time, IPχ²) | T1 close |
| the K⁻π⁺ mass from the two tracks' momenta, the histogram, the D⁰ peak, 2 MeV bins | T2 part 1 |
| √N per bin (used by the pulls, slide 3) | T2 "counts wobble" |
| the normal curve (the Gaussian of slide 3), σ as significance (slide 7), the p-value (slide 4) | T2 "how rare" |
| sidebands as counted background (slides 10-12) | T2 "the real peak" |
| PDG world value | T3 slide 2 |
| window mean and its dependence on the window's width and place | T3 slide 2 |
| model, knobs, start values, width, pull, χ² | T3 slide 3 |
| fit, iterations, χ² near the degrees of freedom, signal part | T3 slide 4 |
| the χ² valley, minimum, Δχ² = 1 ring | T3 slide 5 |
| statistical error from Δχ² = 1 | T3 slide 6 |
| Δχ² = n² for n errors; two independent errors in quadrature; gap in units of both errors | T3 slide 7 |
| momentum from the magnet's bend; systematic error, momentum scale, value ± stat ± syst | T3 slide 8 |
| the VELO | T3 slide 9 |
| decay time as flight over speed, lifetime τ, cτ | T3 slide 10, beat 1 (decay time as a column: T1) |
| sideband subtraction | T3 slide 10 |
| exponential decay, fit range, acceptance | T3 slide 11 |
| B meson (notes), IPχ² as a χ² and the cut, D⁰s from B decays, natural width (notes) | T3 slide 12 (IPχ² as a column: T1) |
| P(signal) per grain | T3 slide 13 |

Not used, and owned elsewhere: 5 σ and discovery (T2), classifiers and the loss (T4), the 120 selections and
reproducibility (T5). T4 reuses: the valley (slide 5), the cut as a boundary (slide 12), whitening (slides 13-14).

## Entrances

- **Cover entrance.** Opens on T2's exact last frame (`mass`, at [-1, 3.2, 0], dist 25, yaw −4, pitch 5): the settled
  D⁰ peak, our grain haloed with its core in T2's colour. The title rises while a line of grains (`fit` set 0) draws
  across the peak. Dependency: T2's last slide must land on this pose and this spark state (or T3 copies T2's when
  its deck exists).
- **Close entrance.** Slide 14's pull-back to `mass` at [-5, 3.2, 0], dist 26, yaw −4, pitch 5, the whitened peak with
  its curve: **T4's cover pose**, where T4's `{tip: 'scatter'}` tips the histogram into a 2D cloud. T4 must build its
  dk-hist on the same station, coordinates and drawn range (Decision 7).

## Motion checks before recording

Every T3 prototype verdict was judged on stills. Before recording, the deck step makes `--burst` frame strips (they
queue for the render slot through `pnpm talk`) and asks the owner one question: "does the plot visibly become the
bowl, does the heap visibly slide, and do the pairs visibly vanish?"

- Slide 5: tilt → fade → bowl hand-over (the music peak).
- Slide 8: `{shift}` on a lab 3 sparse/dense pair, before slide 8 is written into deck.md (talk-quality §4 rule 2).
- Slide 10: the subtraction, which lives in the motion only.
- Slide 2, click 4: whether the half-MeV re-centre reads on the close pose.

## Kit gaps this outline assumes

- Per-slide world ticks on `h` (slide 2's dim 1 864.84, slide 8's 1 864.47 and 1 864.84): `ticks` is an object prop
  today. Ask the kit for a `ticks` step override, or draw the ticks as a separate tick-only form at the `mass` station.
- A band on a dims-1 dk-landscape slice (slide 7's PDG ± 0.04) and `slice.zmax` 20 with ticks on dims 1.
- A window-only count on a `split` dk-hist would let slide 10's counter read "signal" from the start; this outline
  uses the existing `count` readout, named "candidates", instead.

## Facts to file before the deck step

All worked facts cite record 401 (DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR) via bake/d0.py, except the natural width.

- `d0-fit-start-chi2-worked`: χ² 371.5 at the start values (already in d0-fit.json iterations[0]).
- `d0-window-centre-bias-worked`: the off-centre window means (1 864.38 / 1 864.46 / 1 864.42 / 1 864.44 centred on
  1 864.47) and the 1 860-1 870 mean 1 864.92; bake/d0.py commits them to d0-means.json first.
- `d0-pdg-on-valley-wall-worked`: Δχ² 14.5 at 1 864.84 on the profiled slice (and 11.5 / 17.8 at the band's edges);
  bake/d0.py commits the value to d0-chi2.json first.
- `d0-tau-subtract-2000-worked`: 596 left of the first 2 000, with N_window and N_sideband; bake/d0.py computes it in
  the plot's seeded order first.
- `d0-natural-width-worked`: ħ/τ = 6.582 × 10⁻²² MeV s / 4.103 × 10⁻¹³ s = 1.60 × 10⁻⁹ MeV (PDG 2026 τ).

Until each is filed, its number stays off the slide (372 on slide 3, 1 864.42 on slide 2, 596 on slide 10).

## Drop order (if time runs short)

1. Slide 10, the sparse subtraction (−1.0 min): slide 11 shows the same subtraction on all candidates; slide 10's
   decay-time beat (0.3 min) moves onto slide 11's arrival.
2. Slide 13 into slide 14 (−0.5 min): 0.144 moves to the notes; the close keeps 20 993; the core turns light blue on
   slide 14's whitening.
3. Slide 4's pull row (−0.3 min, bible's second drop): the fit without pulls; χ² stays as the number.
4. Slide 11 into slide 12 (−0.6 min): the no-cut 0.509 ps moves to the notes.
5. If dk-hist `{shift}` fails its burst strip: slide 8 folds into slide 7's notes (−1.0 min). It does not ship as a
   motionless slide.
6. Slide 6, the 1D slice (−1.0 min), only after the owner has seen the bowl alone (slide 5's strip) and said the ring
   reads as the error. Then ± 0.10 moves onto slide 5 as a second number, and slide 7's wide slice shows the Δχ² = 1
   crossings itself, since it has no slice before it.

## Decisions taken in this outline (each with its alternative)

1. Bowl (slide 5) before slice (slide 6): the big move first, the ring named, then the slice makes it a number.
   Alternative: slice first (prototypes.md's open ordering question).
2. The gap is shown on the χ² slice wall (slide 7), the scale on the peak (slide 8). Alternative: the bible's single
   slide (PDG tick on the peak plus the shift), where 0.37 MeV/c² is one grain width and the two ticks overlap.
3. The momentum shift on screen is 0.026 % (name "momentum") beside LHCb's 0.03 % (name "LHCb syst") (corrections;
   now sourced). Alternative: 0.02 % mass shift only.
4. The cover opens on T2's exact last frame (`replay: false`, halo on, core in T2's colour) and its entrance is a
   line of grains drawing across the peak under the rising title (the bible's). Alternative: replay the 9 s fill as
   the gather (breaks the cut from T2).
5. A no-cut lifetime curve (slide 11) before the cut (slide 12), so "fakes a long life" has a number. Alternative:
   one dense slide as in lab 3.
6. The window-mean slide ends on the narrowest window re-centred on the fitted 1 864.47 (mean 1 864.42), so its last
   state is not "mean ≈ PDG". Alternative: a fourth narrowing to 1 860-1 870 (mean 1 864.92, past PDG), now kept in
   the notes.
7. Mass range drawn 1 816-1 912 (prototypes.md's recommended default for the edge-bin dips), pending the owner's
   answer; T2 and T4 use the same range for the cover-loop cuts. Alternative: the series range 1 810-1 920 with its
   two dips.
8. Slide 10's counter is named "candidates" on the existing `count` readout. Alternative: a window-only count named
   "signal" (needs a kit readout).
9. The decay time and the lifetime get slide 10's first beat on the empty axis (+0.3 min), taken from slide 11
   (0.8 → 0.6). Alternative: narrate them over the 12 s clip only.

## Decisions taken in the deck step (29 Oct, draft:data3fit)

10. **The owner's decisions of 29 Oct applied over this outline.** Nothing names the particle, its
    decay, the cut's quantity, the tracker or the record outside the notes' Sources lines: the
    peak is "a short-lived particle's mass peak", the IPχ² cut is "a quality cut" (how far the
    track points from the collision), the clip's tracker is "the silicon tracker around the
    collision point". Slide 12's third number (< 9, "IPχ²") is dropped; its value lives in the
    Caveats as "a χ² kept below 9". Slide 8's "LHCb syst" is named "uncertainty". The tracker's
    pixel counts are dropped from slide 9's notes (experiment internals). Mass axis at the kit's
    default 1 816-1 912 (no `lo`/`hi` on `h`). Alternative: none (binding).
11. **Slide 2 split in two (deck slides 2 and 3).** A camera move on a click has no slide key
    (only `stops`), so click 4's re-centre and close pose is its own slide (0.4 min, taken from
    slide 2's 1.5). Both slides have the plot right of the numbers (`at` −6 and −3.5), so the
    .nums block stands on black. Alternative: keep one slide and give up the close pose.
12. **Slide 2's PDG mark is unlabelled in the world** (`label: 'none'`): its number is the .nums
    line "1 864.84 PDG", so it appears once on screen. Slide 8's two marks keep their world labels
    (the .nums there are the scale).
13. **Slide 5 tilts without the pull row:** `fit` steps to set 5 without parts and pulls on the
    bowl slide's arrival, so the tipping plot carries no row hanging under it.
14. **Slide 13 (deck slide 14) reframed, the owner's weak spot:** close on the right flank
    (`at` [3.5, 2.6, 0], dist 10), our grain's ring at the foot of the 1 880-1 882 column, and on
    the click its core takes its own whiteness from the plot (dk-spark `color: 'follow'`, ring
    white), so the 0.144 is the grain's own colour, mostly light blue. The close (deck slide 15)
    pulls back to the whole peak. Alternative: lab 3 slide 7's pose with `color: 'crowd'`.
15. **Slide 8 (deck slide 9) kept, pose dist 7:** the curve's bloom at dist 6 covered the
    marks. Still gated on its motion check (below); kit-requests.md items 1-2.
16. **The cover title is styled by the talk's CSS** (a lone cover h1 is a kicker in the kit):
    `styles/index.css` gives it the title's size and moves it high on the left, over the black
    above the plot's shoulder, since the cover pose is T2's last frame and cannot move.
17. **Top-level `transition: fade`; the dust is `videos.transition`.** No dust slide transition
    exists for DOM slides; the clips arrive and leave as dust.

## Decisions taken in the fix step (29 Oct, fix:data3fit, from the fresh-eyes review)

18. **Slide 2's third window moves to deck slide 3**, which opens on a cut to the summit pose:
    the 20 MeV/c² window lands there with its mean tick on the world mark, and the click moves
    it half an MeV/c² (deck slide 2 0.8 min, slide 3 0.7). At dist 24 the mean tick and the
    world mark are one line. Alternative: labelled marks at the wide pose.
19. **Slide 11 (deck) opens on the 2 000 landing** as the crane lands (`lead` 2.6 s); the
    subtraction is the one click; 1.0 min. The empty-axis beat is narrated over the landing.
    Alternative: a dk-vertex for beat 1 (an unprototyped pairing at the tau station).
20. **Slide 13 (deck 14) shows the whole peak** right of the numbers, with a dotted near-white mark at
    the fitted centre (h step 10) and a second marker `big` (core size 7), so the 16.2 MeV/c²
    and the core's 0.144 both have something to point to. The close drops the mark (h step 12).
21. **"PDG" on screen reads "world"** (the spoken "world value"). The rest: deck CLAUDE.md
    Decisions, 29 Oct review fixes; kit-requests.md items 6-9.

## Decisions taken in the final step (29 Oct, final:data3fit, from the motion review)

22. **Outline slides 11 and 12 are one deck slide (deck 12, three clicks)**: every candidate, the
    subtraction, the no-cut exponential, then the quality cut with the curve steepening (1.8 min). As two
    slides, the second entry replayed the subtraction and drew the curve on again for 5 s. The two τ
    numbers share one line: 0.421 ± 0.005 takes 0.509's place on click 3. The deck has 14 slides.
23. **Cuts back to the mass plot find it standing**: while the camera is at the slice station (deck 7-8)
    and the decay-time station (deck 10-12), the mass plot and its fitted curve stand out of view at the
    state of the next mass slide, so a cut back opens on them at their scale (kit-requests 10-11).
24. **The clip's arrival gathers over slide 9's last frame** and the camera cuts under it to the
    decay-time station at 1.9 s; the clip breaks up as dust (1.7 s) while 2 000 grains drop from
    0.3 s and the camera cranes down in 1.5 s. The dust stays (bible §3), not a cross-dissolve.
