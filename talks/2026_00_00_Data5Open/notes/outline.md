# Talk 5 outline: Open data (outline:data5open)

The house pipeline's outline step (talk-quality §2 step 3) for `2026_00_00_Data5Open`. The deck draft
(`deck.md`, `public/data/space.json`) is built from this. Inputs: the series bible §5 Talk 5 and the corrections at
its top (they win), the kit README (29 Oct), `notes/prototypes.md`, `notes/t5.md` and `notes/requests-t5.md` (lab 5),
the open-tools research lane, the Brief, and the OpenData and Innoday decks as models. Written 2026-10-29.

**Revised 2026-10-29 (revise:data5open)** from the outline critique. The Versions part (old slides 10-11) is folded
into slide 8 (drop order 4, carried out), and the ATLAS notebook clip (old slide 9) is dropped (drop order 2, carried
out). The talk now has 12 slides. Old → new numbers: 1-8 → 1-8; 9, 10, 11 → gone (their sentences are in slide 8's
notes); 12 → 9; 13 → 10; 14 → 11; 15 → 12. Each change and its alternative is under Decisions at the end.

**Cover title:** Open data. **Question:** CERN publishes its data; can you redo the series' plot from the open file and
get the same digits? **Takeaway:** a result can be redone when the data, the code and the package versions are
published and pinned. Then anyone gets the same grain in the same bin, and a choice made after looking shows up as a
spread. **Misconception on screen:** "it works on my laptop" (slide 8: two passes on one machine agree, and the hash on
screen is the test another machine must pass).

## Series rules this outline keeps

- On screen: the cover's plain title; elsewhere 1-3 numbers in `.nums`, each with its unit and at most a one- or
  two-word `.name`. Axis tick labels and the one caption `mass MeV/c²` belong to the plots. Nothing else. A number
  goes on screen once; μ = 1 864.47 appears on slide 2 and again on slide 8 only, where the same digits are the point.
- Colour grammar: light blue = the crowd, white = the selected, dim = the axis grains, never gold. Our grain (row 1)
  is size 2.5 with a dk-spark ring, and its core takes the slide's colour. One stated exception: on slides 7-8 the
  colour marks the pass (first pass light blue, as slide 2's plot; second pass white), not a selection. The notes of
  both slides say so.
- Words: "first pass" and "second pass" (or "the rerun") name the two runs of the pipeline. "Run 1" and "Run 2"
  name the LHC's data-taking periods only.
- `ambient: 0`, `dim` 0.2-0.35 and `steady: true` on every slide where a number is read off the picture.
  `transition: dust`. Sound off in the deck. The edit adds the series bed, with its one T5 peak where the second pass
  lands (slide 8).
- A clip lasts at most 15 s. No h1 on a clip slide, no `advance-on-end`, no fade after a clip. Clip to world is a
  one-key `path` cut under the clip's last frame, then a crane. Slide 4 is the talk's only clip, between two world
  slides. Commit `public/video-frames/index.json`.
- Notes: Message, Picture, Caveats, Misconception (where it applies), Sources, then `<!-- facts: -->` as a separate
  comment *before* the notes comment, and `(~N min)`.
- Never in a facts comment: `lhcb-55pb-open-refuted` (refuted; the lint fails on it). It is a guard for the notes only:
  never say 55 PB.

## Stations (proposed for space.json)

The coordinates come from lab 5 (`talks/2026_00_00_DataLab5/public/data/space.json` in the datakit worktree).

| station | pos | holds |
|---|---|---|
| `pipe` | [0, 0, 0] | dk-pipeline `pipe` (pile [-25.5, 0, 0] r 2.8, spin 0.06, seed 401; `root_to_csv.py` [-21.5, 0.6, 0] 4.6 × 6.9; sheet [-15.3, 0.6, 0] 6.0 × 10.5, rows 1-90; `d0.py` 87-208 [-6.9, 0.6, 0] 7.6 × 10.5, cols 2; hist → `h1`; no `run.third`, no env stage); dk-hist `h1` (first pass: tone crowd, alpha 0.85) and `h2` (second pass: tone sel, alpha 0.72, `over: h1`) at [12.5, 0, 0], width 20, height 10.5, ticks 1 820-1 920, the same bins and seed as `h0`; dk-curve `fit1` (`of: h2`, `src: d0-fit.json`); dk-hist `h0` and dk-curve `fit0` for slide 2 (below); dk-spark `s` |
| `archive` | [-60, 0, 45] (proposed) | dk-lineup `tb`: one 1 TB sphere (grain 1), then one pile that grows, 800 TB (grain 27, label 800 TB) to 4 000 TB (grain 27, label 4 PB) in the same place (see slide 5's Open) |
| `sel` | [120, 0, 0] | dk-hist `hs` (the select sweep), dk-hist `hp` at [45, 0, 0] (the 120 peaks, lo 1 864.15, hi 1 864.75, bin 0.025, 6 × 3.2, ticks 1 864.2 / 1 864.4 / 1 864.6, data `d0-peaks.f32`) |
| `route` | (from T1's space.json) | the T1 chain rebuilt for the finale plate: dk-heap `heap` (settled), dk-trigger `trg` (gates and buffer, our packet off from the heap on), kit detector `plugins: [lhcb]` `src: lhcb`, `lhc-collision` (components/lhc-opening event.json, record 24506), dk-spark. Heavy, so it is used only on the recorded plate |

## Slides

Minutes and clip seconds add up to 14.0: slide minutes 13.8 plus clip seconds 12 s (0.2 min).

---

### 1. Cover (part: Cover and delete the plot)

- **Pose:** `pipe`, look [-25.5, 3.1, 0], dist 11, yaw -10, pitch 6, dim 0.2, ambient 0, sway 1, `steady`. This is T4's
  closing pose (T4 outline slide 18, dim 0.2): the ball turns slowly in the black.
- **Entrance:** T4's last frame is this frame. The ball already stands: dk-pipeline `pipe` at step 1 with no
  `assemble` and no replay, so the cut between the talks is invisible. The entrance is the plain title rising and
  the slow turn of the ball (spin 0.06).
- **Picture:** dk-pipeline `pipe` step 1 (the `pile` stage only: 91 583 grains, r 2.8, alpha 0.6, spin 0.06, seed
  401), as T4's `file` pipeline ends. Our row is drawn at size 2.5 on the camera's side.
  `steps: { pipe: 1, h0: 0, fit0: 0, h1: 0, h2: 0, fit1: 0, hs: 0, hp: 0 }`.
- **On screen:** the title "Open data", nothing else.
- **Notes.** Message: the whole series came out of one open file, and this talk asks whether anyone can make the same
  plot from it. Picture: the ball is the file, with one grain for each of its 91 583 candidates. Our
  grain, the row followed since T1, sits on the near side. Caveats: the ball shows the candidates, not the file's
  bytes. Say "candidates", never "events". Sources: CERN Open Data record 401.
- **Facts:** `record401-candidates-91583`
- **Open:** the pile must stand at once on the deck's first slide. If an arrival or a cold open replays the pile's
  gather, dk-pipeline needs a `replay: false` like dk-hist's (kit request); check on lab 5 slide 1.
- **Minutes:** 0.5

### 2. The series' plot comes out of the file (part: Cover and delete the plot)

- **Pose:** `pipe`, look [-19.5, 4.0, 3.0], dist 21, yaw -8, pitch 5, dim 0.25, ambient 0, `steady`. The ball sits on
  the left and the plot rises to its right.
- **Picture:** dk-hist `h0` (91 583, the series' mass range and 2 MeV bins, tone crowd, `word` `mass MeV/c²`) beside
  the ball. It fills out of the ball (`from` = the ball's centre, `fromSpread` [2.8, 2.8, 2.8], `fill` 6). Then dk-curve
  `fit0` (`of: h0`, `src: d0-fit.json`, set `last`) draws on once h0 settles. dk-spark `s` `on: h0` rings our grain in
  the 1 880-1 882 bin. `steps: { pipe: 1, h0: 1, fit0: 1, s: 1 }`.
- **On screen:** `1 864.47` MeV/c² with `.name` μ (fades in after the curve settles).
- **Notes.** Message: each candidate is a pair of tracks, and their combined mass is one grain; the grains pile up into a
  short-lived particle's mass peak; the fit (T3) puts the peak at 1 864.47 MeV/c². Everything the series showed is grains that code put into
  bins, taken from this one file. Picture: the ball is the file, the histogram is T2's mass peak, and the curve is T3's
  fit with its μ. The ring marks our grain in the bin where T2 landed it. Caveats: the numbers are the bake's
  (`bake/d0.py`, 45 bins of 2 MeV on 1 820-1 910 MeV/c², 84 680 candidates in the fit range). Sources: record 401; the
  kit's `bake/d0.py` → `d0-fit.json`.
- **Facts:** `record401-candidates-91583`, `course-d0-fit-mass-worked`, `d0-fit-chi2-ndf-worked`
- **Relies on a prototype mechanic:** dk-curve (T3 "start values / fit with pulls"; verdict: reads).
- **Minutes:** 1.25

### 3. Delete it: the file is what stays (part: Cover and delete the plot)

- **Pose:** `pipe`, look [-25.5, 3.0, 0], dist 9, yaw -14, pitch 7, dim 0.25, ambient 0, `steady`. The camera moves in
  on the ball while the plot leaves.
- **Picture:** on arrival `h0` takes `{ cut: ['M', '<', 0] }`, which every row fails, so all 91 583 grains lift away as
  dust and the columns empty. `fit0` steps to 0 and fades. The ball turns on, unchanged. This is part 1's big move
  (the bible's): the plot goes to dust and the file remains. `steps: { pipe: 1, h0: 2, fit0: 0, s: 0 }`.
- **On screen:** `1 289 541` B; `2ebf133a` with `.name` checksum.
- **Notes.** Message: the plot can be deleted because the file stays: the file is 1 289 541 bytes under a fixed DOI,
  free to reuse (CC0), with a checksum that tells anyone they hold the same bytes. Picture: the dust is the deleted
  plot and the ball is the file. The two numbers are the file's size and its checksum. Introduce the hash here: a
  checksum is a short number computed from every byte, and changing one byte changes it. Caveats: the checksum shown
  is Adler-32 (the portal's algorithm; our SHA-256 of the download is 8694a2ed…, notes only). The DOI
  10.7483/OPENDATA.LHCb.E7EJ.JUWR goes in the notes, not on screen. The record was published in 2014, as LHCb's first
  open files. The data-taking year is not settled: say "Run 1 (2011 or 2012)". Sources: opendata.cern.ch/record/401,
  the portal API (checksum, size), the portal's terms of use (CC0).
- **Facts:** `record401-bytes-sha256`, `record401-file-sha256-worked`, `record401-licence-cc0`,
  `lhcb-opendata-masterclass-2014`, `lhcb-record401-year`
- **Open:** whether `pnpm talk lint` takes the hex `2ebf133a` as a number. If it reads it as TEXT, the owner either
  grants `onscreen: words` on this slide or the checksum moves to the notes. The same answer governs slide 8's
  `d2ec0d08`.
- **Minutes:** 1.0

### 4. Clip: CERN Data Centre (part: The record)

- **Pose:** the clip over `pipe`. On its end a one-key `path` cut under the last frame, then the crane to `archive`
  (slide 5).
- **Picture:** clip `cern_footage_2022_014_001_datacentre.mp4` (CERN-FOOTAGE-2022-014-001, record 3020288, 44 s
  source), cut to **12 s**. Choose a stretch without labels (timecode open; check it on the contact sheet).
- **On screen:** nothing (no h1 on a clip slide).
- **Notes.** Message: open files are kept and served by data centres such as CERN's. Picture: real racks in the CERN
  Data Centre. Caveats: do not claim that the racks shown hold record 401. The portal had 82 414 records on
  2026-10-29 (the count changes; give the date). Sources: CERN video record 3020288 (licence CERN, no on-screen
  credit); the portal search API (`bake/portal.py`).
- **Facts:** `cds-3020288-datacentre-2022`, `opendata-portal-records-2026-worked`
- **Minutes:** 0 + 12 s

### 5. How much is open (part: The record)

- **Pose:** `archive`. The crane from the clip cut ends at look [-60, 1.4, 45], dist 6, yaw 70, pitch 8, on the one
  sphere. On the grow step a short `path` pulls back to dist 22, yaw 55, pitch 3 over about 4 s, just enough to frame
  the grown pile. dim 0.2, ambient 0, `steady` once landed.
- **Picture:** dk-lineup `tb`: one 1 TB sphere (T1's unit). Step 2: beside it a pile of 800 TB gathers (Run 1).
  Step 3: that same pile grows to 4 000 TB in place; the 800 spheres keep their places and the new ones add on round
  them, so Run 1 is visibly inside Runs 1-2, never beside them. The new move is the growth; the pull-back only frames
  it (T1 used the pull-back three times). `steps: { tb: 1 }` then `<StageSteps>` to 2 and 3.
- **On screen:** the pile's label, `800` TB, then `4` PB as the pile grows (dk-lineup `label`, fixed size). No `.nums`
  block.
- **Notes.** Message: the file is a tiny part of what LHCb has opened: all of Run 1, about 800 TB, in December 2023,
  and over 4 PB of Runs 1 and 2 through the Ntupling Service in 2026. LHCb publishes about half of a campaign 5 years
  after the run ends and all of it after 10. Picture: each sphere is 1 TB, about 775 000 copies of the file
  [computed: 10¹² / 1 289 541 = 775 470]. The pile is Run 1, then grows to Runs 1 and 2: the 4 PB includes Run 1's
  800 TB, so the total is about 4 PB, not 4.8. Caveats: sources give 800 TB, 900 TB and "over 1 PB" for Run 1; use
  800 TB. Never say 55 PB (no public source). The 50 % / 100 % schedule is LHCb's own; CERN's policy only aims to
  start releases within five years. The portal-wide 5 PB figure is stale (notes only). The first large release was
  200 TB in December 2022. Sources: LHCb outreach (2023-12-20, 2026-03-03), arXiv:2504.00610 (policy), CERN open data
  policy for the LHC experiments (2020).
- **Facts:** `lhcb-run1-full-release-2023`, `lhcb-ntupling-service-4pb`, `lhcb-open-data-policy`,
  `lhc-open-data-policy-cern`, `lhcb-run1-volume-sources-differ`, `lhcb-open-data-first-release-2022`
- **Open:** dk-lineup has no grow-in-place: a pile's step shows or hides whole piles. Kit request: a ball field such as
  `grow: { from: <pile> }` that adds spheres onto an earlier pile in place (same grain, same `at`, earlier spheres
  kept). Fallback without it: both piles at the same `at` and grain 27 (about 30 and 148 drawn spheres), shown
  `[0, 1]` → `[0, 2]`, so the larger pile gathers over the smaller one's spot. The file ball is not drawn to scale
  beside the 1 TB sphere (it would be about 1/92 of the sphere's radius); the crane leaves it behind.
- **Minutes:** 1.2

### 6. The file, the script, the sheet (part: The pipeline) [prototype: dk-pipeline, sparse]

- **Pose:** `pipe`, look [-21.0, 4.0, 0], dist 19.5, yaw -4, pitch 4, dim 0.2, ambient 0, `steady`, sway 1 (lab 5
  slides 2-3). The slide follows a different station, so the pipeline replays on arrival with the newest stage
  building.
- **Picture:** dk-pipeline `pipe` step 3. The ball stands. `root_to_csv.py` types in line by line, one grain row a real
  line (indent, length and word gaps from `code-lines.json`). The sheet is written row by row as the stream arrives,
  with each value a dash whose brightness is its rank in its column. dk-spark `s` `at` the sheet's first row, our
  row 1. `steps: { pipe: 3, h1: 0, h2: 0, s: 2 }`.
- **On screen:** `<StageCount for="pipe" :to="91583" />` rows.
- **Notes.** Message: the first program turns the file into a table of 91 583 rows of four numbers, the row T1 ended
  on. Picture: the streams leave the ball for the script and leave the script for the sheet. The white head writes the
  rows. The ring marks row 1 as the sheet's first line. The sheet draws file rows 1-90; the count says how many there
  are. Caveats: the converter drawn, `root_to_csv.py` (40 lines, 1 701 B, sha256 15db448c…), is the course's script,
  and the course repo is not public. Today nobody can download this first program, so this stage of the talk's own
  claim has a gap; say so plainly if asked, and close it before the draft if the kit commits a public converter (see
  Open). The kit's bake reads the course CSV (sha256 25c3c972…, 3 926 142 B), checked value for value against the ROOT
  file with uproot on 2026-10-29. Say the grain rows are the script's real line shapes, not readable code. Sources:
  record 401; `code-lines.json` (`bake/code.py`).
- **Facts:** `record401-candidates-91583`
- **Open:** a public converter in the kit (for example `components/data-kit/bake/root_to_csv.py`, reading
  `MasterclassData.root` with uproot and writing the CSV whose sha256 is 25c3c972…), with `bake/code.py` pointed at it
  and `code-lines.json` regenerated. Then this stage draws public code and the notes of slides 6 and 7 cite its sha256
  in place of the gap sentence. Not built (kit work, outside this outline).
- **Minutes:** 1.0

### 7. First pass: the plot rebuilt (part: The pipeline) [prototype: dk-pipeline, dense]

- **Pose:** `pipe`, look [-2.55, 5.0, 0], dist 34.5, yaw 0, pitch 5, dim 0.2, ambient 0, `steady` (lab 5 slide 4,
  the establishing shot).
- **Picture:** dk-pipeline step 5 (four stages; the `hist` stage runs the chain): grains leave the ball, white sweeps
  run down both scripts, the head reads and writes the sheet, and the stream fills dk-hist `h1` (tone crowd, alpha
  0.85, light blue, with h0's bins, ticks and seed) out of `d0.py`'s outlet (`from` = `api.outlet()`, `fill` 7.5), so
  the rebuilt plot looks like the one deleted on slide 3. dk-spark `s` `on: h1`.
  `steps: { pipe: 5, h1: 1, h2: 0, s: 3 }`.
- **On screen:** `<StageCount for="h1" :to="91583" />` candidates.
- **Notes.** Message: the file and two scripts put the deleted plot back. Picture: from left to right the file, the
  converter, the table, the fitting code (`d0.py` lines 87-208, from `read` to `lm`: read, bin, fit) and the plot it
  fills. The first pass is light blue, like slide 2's plot; on slides 7-8 the colour marks the pass, not a selection.
  Our grain lands again in the 1 880-1 882 bin. Caveats: the fit is deterministic (Levenberg-Marquardt from fixed
  start values); the seed (mulberry32, 401) only places the grains of the picture. The world replays the bake's
  result. The real rerun is `python3 bake/d0.py --check`, which recomputes every output and fails on a difference.
  Name both scripts with their sha256 in the notes (`root_to_csv.py` 15db448c…, the course's, not public; `d0.py`
  6be00ecc…, the kit's; re-read `code-lines.json` before the draft). Sources: `components/data-kit/bake/d0.py`,
  `code-lines.json`.
- **Facts:** `record401-candidates-91583`, `d0-row1-values-worked`
- **Open:** the kit's prototype tuned the passes the other way round (first pass white at 0.72, second light blue at
  0.85, lab 5 slides 4-6). Light blue first and white `over` it is untried: check on lab 5 that the white landing
  front does not bloom (0.95 blooms; `glowTint` 0.3) and that the turnover reads.
- **Minutes:** 1.0

### 8. The second pass lands on the first (part: The pipeline) [prototype: dk-pipeline run 2, `over`, dense]

- **Pose:** `pipe`, look [8.0, 3.3, 0], dist 20.5, yaw 0, pitch 4, dim 0.2, ambient 0, `steady` (lab 5 slides 5-6,
  the hero). The slide follows slide 7 on the same station, so the first pass stands (no arrival) and the second pass
  fires on the forward step.
- **Picture:** dk-pipeline step 6 (run 2 in the kit's terms): the whole chain runs again, and dk-hist `h2` (tone sel,
  alpha 0.72, `over: h1`) lands grain by grain in the first pass's slots. Each light-blue grain goes as its white twin
  lands, so the plot turns white from the bottom of each column up with no change of shape. Once h2 settles, dk-curve
  `fit1` (`of: h2`, `src: d0-fit.json`) draws on, and then the two numbers fade in. dk-spark `s` `on: ['h2', 'h1']`:
  the ring stays in the same bin. `steps: { pipe: 6, h1: 2, h2: 1, fit1: 1, s: 3 }`. The series music peak falls
  here (edit).
- **On screen:** `1 864.47` MeV/c² `.name` μ; `d2ec0d08` `.name` both passes (after the curve; the same lint question
  as slide 3's hex).
- **Misconception:** "it works on my laptop". Two passes on one machine agreeing is exactly that: it shows the code is
  deterministic here, not that anyone else gets the result. The hash on screen is the test someone else can run:
  their pass must print d2ec0d08, and it can only when the file, the code and the package versions are the same. The
  first two are in the folder; the versions are the third thing, and they have to be written down and pinned too.
- **Notes.** Message: running the same file through the same code again gives the same grain in the same bin, the same
  μ and the same hash of the output. To get that hash on another computer you also need the same package versions,
  so they belong in the folder with the data and the code. Picture: light blue is the first pass, white the second,
  and the shape never moves. The curve is T3's fit, drawn on the second pass. The ring shows our grain landing where
  it landed before. The hash is the first 8 hex digits of the SHA-256 of the fit's output file, the same idea as
  slide 3's checksum. Caveats: `d0-fit.json` has sha256 d2ec0d08… on both passes (`d0.py --check`; fact
  `d0-fit-rerun-sha256-worked` to file before the draft). Both passes ran on one machine. The kit's own bake is not
  pinned yet: the repo's `env.yaml` is the toolkit's environment and names numpy and scipy without versions, so no
  check in a second environment exists. Do not say that another machine gets d2ec0d08; say what it needs. (Name the
  unpinned `env.yaml` aloud as an honest example only if the owner agrees.) The course's pendulum example (9.2
  against 9.02 after a pandas update) is not this peak's result and never goes under its picture: notes only, named
  (`course-pandas-version-drift`, to file, or drop the sentence). Two plots that look the same are not proof; the
  hash and the digits are. Notes only, for the versions sentence: the WLCG has over 170 sites in 42 countries, and
  each must run the code the same way; CVMFS is "CERN's read-only software file system, served from web servers and
  mounted under /cvmfs" (do not say it pins versions: no source opened says so); REANA is CERN's
  reproducible-analysis platform; the FAIR principles ask for data and software that others can reuse. The same
  recipe works for others: ATLAS publishes notebooks that rebuild a Higgs-boson plot from open data (ATLAS, not
  LHCb; a teaching reimplementation, not the 2012 discovery analysis). Sources: `bake/d0.py --check`; `d0-fit.json`;
  home.cern (WLCG); cernvm.cern.ch/fs; reanahub.io; Wilkinson et al. 2016; CERN video record 2745513.
- **Facts:** `course-d0-fit-mass-worked`, `d0-fit-rerun-sha256-worked` (to file), `cern-wlcg`, `cvmfs-grid-pinning`,
  `reana-platform`, `fair-wilkinson-2016`, `atlas-opendata-notebook-2745513`
- **Open:** `fit1` on h2 after an `over` turnover has not been seen (dk-curve waits while its hist is busy; check that
  it waits for the whole turnover). Option (a) of the critique would restore a Versions slide: commit a kit lockfile
  (e.g. `components/data-kit/bake/requirements.lock`, numpy== and scipy== pinned), run `d0.py --check` under it in a
  second, separate environment, file `d0-rerun-second-env-worked` with d0-fit.json's sha256 from both, and draw an env
  stage from that lockfile through `bake/code.py`. Then a slide "another machine, same pinned versions, same hash"
  can come back after slide 8 (see Decisions).
- **Minutes:** 1.75

### 9. 120 reasonable choices (part: Choices before looking)

- **Pose:** `sel`, look [-3.5, 0.6, 0] in the station's frame, dist 25, yaw 0, pitch 4, dim 0.2, ambient 0, `steady`
  (lab 5 slide 7: the plot sits up and to the right, clear of the `.nums`).
- **Picture:** one mass dk-hist `hs` (light blue) fills as selection 0 (91 534), then on the click it refills itself
  through the 120 baked selections in place: `{ select: [0, 119], every: 0.15, rescale: true }`, about 18 s. Each
  refill keeps a different, mostly smaller sample: the count falls and the grains thin (`density` 0.3, so the small
  late selections stay light blue), while `rescale` keeps each refill's shape readable. It holds at 119.
  `steps: { hs: 1 }` → click `{ hs: 2 }`.
- **On screen:** `120` `.name` selections; `<StageCount for="hs" />` candidates (91 534 at the start, 2 803 at the
  end).
- **Notes.** Message: there are 120 reasonable ways to choose the candidates, and each one keeps a different sample.
  Picture: each refill is one selection, made of three limits. pT is the candidate's momentum across the beam
  (thresholds 0, 2 800, 3 000, 3 200, 3 500 and 4 000 MeV/c). The quality cut is T3's: how far the track points from
  the collision (limits none, 50, 20, 10 and 5). The decay time is how long the
  candidate lived before it decayed, from how far it flew (limits none, 0.2, 0.3 and 0.5 ps). 6 × 5 × 4 = 120, the
  course's Lecture 14 grid. Every selection gets the same 45-bin fit; slide 10 shows the peaks. Caveats: the sweep
  starts at 91 534, not the series' 91 583, because every selection needs a decay time and 49 rows have none.
  Selection 119 (pT > 4 000 MeV/c, the quality cut at 5, decay time > 0.5 ps) keeps 2 803 (`d0-select-counts-worked`, to file).
  The fitted peaks span 0.44 MeV/c², about a fifth of one 2 MeV bin, so on this axis each refill looks like the same
  peak at a smaller count: do not say here that the peak moves. The world refills; the peaks come from the bake.
  Sources: `bake/d0.py` → `d0-select.json`.
- **Facts:** `d0-120-selections-worked`, `d0-ipchi2-cut-count-worked`, `d0-select-counts-worked` (to file)
- **Open:** the select sweep's motion has not been seen (only the still states 41 and 120).
- **Minutes:** 1.75

### 10. The 120 peaks (part: Choices before looking)

- **Pose:** `sel`, look [43.7, 0.6, 0] in the station's frame (world [163.7, 0.6, 0]), dist 7, yaw 0, pitch 4, dim 0.2,
  ambient 0, `steady` (lab 5 slide 9).
- **Picture:** dk-hist `hp`: the 120 fitted peaks as a dot histogram, one grain a selection, on its own printed scale
  (1 864.2, 1 864.4, 1 864.6 MeV/c², bin 0.025). Selection 0 (1 864.47) is the large grain. The grains drop in as the
  peaks of the sweep just seen. At 0.025 MeV/c² a bin, the shift that was invisible on slide 9 is the whole picture.
  `steps: { hs: 0, hp: 1 }`.
- **On screen:** `0.44` MeV/c² `.name` spread; `0.10` MeV/c² `.name` stat. error (its only time on screen).
- **Notes.** Message: each selection gives a slightly different peak. The choice alone moves it by 0.44 MeV/c², more
  than four times its statistical error, so a selection picked after seeing the peak could put it almost anywhere in
  that range. Picture: each grain is one selection's fitted peak, and the large grain is selection 0, the nearest to
  the series' own. Caveats: the range is 1 864.22 to 1 864.65 MeV/c². 69 of the 120 lie within ± 0.10 of selection
  0's 1 864.474 (65 within the unrounded ± 0.0965) [computed from `d0-select.json`]. All 120 lie below PDG's
  1 864.84 ± 0.04, so T3's gap is not a choice of cuts. The spread is a picture of freedom, not a systematic error:
  the selections overlap and change what is in the sample. Sources: `d0-select.json`, `d0-peaks.f32`
  (`bake/peaks.py`), PDG 2026.
- **Facts:** `d0-120-selections-worked` (extend with the 69 / 65 counts, or file them), `d0-fit-valley-delta-chi2-worked`,
  `d0-pdg-gap-3p5-sigma-worked`, `pdg-d0-mass-2026`
- **Minutes:** 1.6

### 11. Fix it before looking (part: Choices before looking)

- **Pose:** `sel`, the slide 9 pose (look [-3.5, 0.6, 0], dist 25), dim 0.2, ambient 0, `steady`.
- **Picture:** `hs` steps to `{ select: 0 }` and holds: the selection fixed before the 120 were tried (no cuts beyond
  a decay time being present, the nearest to the series' own) refills once and stops. dk-spark `s` `on: hs` rings our
  grain. `steps: { hp: 0, hs: 3, s: 4 }`.
- **On screen:** `1` `.name` selection.
- **Notes.** Message: decide the selection before looking at the result, as a blind analysis does, and the spread
  cannot leak into the answer. Picture: one refill, then stillness: one selection where slide 9 had 120. Caveats:
  selection 0 drops the 49 rows without a decay time (91 534 kept); its μ (1 864.4745) rounds to the same 1 864.47 as
  the series' (1 864.4724). A real blind analysis hides the signal region or the result while the choices are made;
  this hold is a picture of the rule, not a blind analysis of our own. The link to T4: a choice tuned on the data is
  like testing on the training set. Sources: J. R. Klein and A. Roodman, "Blind analysis in nuclear and particle
  physics", Annu. Rev. Nucl. Part. Sci. 55 (2005) 141 (to file before the draft); `d0-select.json`.
- **Facts:** `course-d0-fit-mass-worked`, `d0-120-selections-worked`, `d0-select-counts-worked` (to file),
  `blind-analysis-klein-roodman-2005` (to file)
- **Minutes:** 0.75

### 12. Close: the route back (part: Close) `recorded: plate`

- **Pose:** a `path` crane over about 42 s: from the held selection (`sel`, hold about 3 s) → the pipeline's ball
  (`pipe`, hold about 6 s) → T1's heap on the floor (hold about 6 s) → the buffer → the gates → the detector → T1's
  cover landing at the collision point (`route`). `rate` keyframes ease to 0.02 at the end (T1's bullet time, `cameraRate: 1`).
  dim 0.2, ambient 0. The slide is recorded as a plate: the T1 chain plus the collision is over the live grain budget,
  and a finale is a plate by default.
- **Picture:** our grain travels back as the white packet: dk-spark glides from `hs` to the ball, and the heap's grain
  rises out of the pile. At the heap the white packet fades (dk-trigger `ours: 0` before the gates): row 1's own
  crossing cannot be found, so it goes no further. From there only the generic lane runs back (gate 2, the buffer,
  gate 1) and ends in the kit detector, where `lhc-collision` (event.json) holds at a crossing. Tiny `.credits` on
  this last slide for the kit lhcb geometry (GPL-3.0 / Apache-2.0).
- **On screen:** `91 583` candidates at the heap, then `1` crossing (the second replaces the first as the detector
  comes in).
- **Close entrance:** the crane leaves the frozen selection of slide 11 and ends exactly on T1's cover landing
  (`lhcb`, `{ at: [3, 0.4, 0], dist: 12, yaw: -24, pitch: 10 }`, T1 outline slide 1, bullet time), so the series loops
  back to T1's cover.
- **Notes.** Message: every grain came from a crossing, through a trigger and code. The open file makes the last steps
  (table, code, plot) redoable, but what the trigger dropped is gone (T1), and this row's own crossing cannot be
  found. Picture: each stop is a talk: the plot (T2, T3), the table (T5), the heap (T1's close), the gates (T1, T4),
  the crossing (T1's cover). Narration cue at the detector: "a crossing, not row 1's". Caveats: the crossing drawn is
  a different real crossing (record 24506, 2012, 8 TeV), not row 1's. The file's run and event numbers are zero, so
  row 1's own crossing cannot be found. Record 401's rows passed the Run 1 trigger, not the Run 3 one drawn in T1:
  say "a trigger like this one". The data-taking year is Run 1 (2011 or 2012). Sources: records 401 and 24506.
- **Facts:** `record401-candidates-91583`, `record24506-licence`, `lhcb-record401-year`, `d0-row1-values-worked`
- **Relies on prototype mechanics:** dk-trigger gates (T1 gate 1 / gate 2; gate 2 judged weak) and dk-heap.
  `collapse` in reverse and the lane running backwards are untested (kit request). Check the off value of dk-trigger's
  per-step `ours` (`0` or `false`) for the fade at the heap.
- **Minutes:** 2.0

---

## Timing

| part | slides | minutes | clip s | bible |
|---|---|---|---|---|
| Cover and delete the plot | 1-3 | 2.75 | | 1.5 |
| The record | 4-5 | 1.2 | 12 | 3.0 |
| The pipeline | 6-8 | 3.75 | | 3.5 |
| Versions | folded into 8 | 0 | | 1.5 |
| Choices before looking | 9-11 | 4.1 | | 2.5 |
| Close: the route back | 12 | 2.0 | | 2.0 |
| **sum** | 12 | **13.8** | **12 (0.2 min)** | **14.0** |

The plot's deletion (bible part 1's big move) is slide 3, now counted in part 1, so part 1 owns its big move and The
record keeps one (the growing pile). Versions has no slide of its own: its sentence and the misconception are on
slide 8. Its 1.5 min, the dropped ATLAS clip's 15 s and slide 5's 0.6 min went to slides 2, 8 and 9-11. The split
departs from the bible's; see Decisions.

## Ladder check

Every idea used in this talk, and where it was introduced.

| idea | introduced | used here |
|---|---|---|
| one grain = one candidate, row 1 as our grain, the ring marker | T1 close (row of four numbers), T2 cover (dk-vertex) | 1, 2, 6, 7, 8, 11, 12 |
| a candidate as a pair of tracks, its mass | T1, T2 | 2 (one-sentence recap) |
| a row of four numbers (mass, pT, decay time, the quality-cut quantity) | T1 close | 6 (the sheet's four columns), 9 (the three cut variables) |
| bunch crossing, trigger gates, the buffer, the heap of 91 583 | T1 | 12 |
| 1 TB spheres that keep their size | T1 Bytes | 5 |
| histogram, 2 MeV bins, the mass axis | T2 cover | 2, 7, 8, 9 |
| fit, curve, μ = 1 864.47, Δχ² = 1 → ± 0.10 | T3 A model, The valley | 2, 8 (curve and μ), 10 (± 0.10 on screen) |
| the 3.5 σ gap to PDG 1 864.84 | T3 Off by 0.37 | 10 (notes) |
| the quality cut and decay-time cuts | T3 How long it lives (the quality cut defined there) | 9 (recalled in one sentence each) |
| pT | T1 slide 13 (name only); defined here | 9 |
| train / test, tuning on what you test on | T4 Bending the line, Real rows | 11 (notes link) |
| record, DOI, CC0, checksum / hash | **T5** slide 3 | 8 (`d2ec0d08` on screen) |
| open-data volumes and the release policy | **T5** slide 5 | |
| the pipeline (file → converter → table → code → plot) | **T5** slide 6 | 7, 8 |
| first pass and second pass, a rerun that lands grain for grain | **T5** slides 7-8 | 12 |
| package versions, the environment | **T5** slide 8 (narration and notes) | 12 (notes) |
| many selections, a sample per selection | **T5** slide 9 | 10, 11 |
| a spread of results | **T5** slide 10 | 11 |
| deciding before looking (blind choice) | **T5** slide 11 | |

Nothing is used before its slide. σ means significance only (the gap, in the notes); the spread and the error are
"spread" and "stat. error", never σ. Run 1 and Run 2 are LHC periods only (slides 3, 5, 12).

## Entrances

- **Cover entrance:** T4's close, the kept lane folded into one turning ball of 91 583 grains, is T5's slide 1 frame:
  `pipe` pile, look [-25.5, 3.1, 0], dist 11, yaw -10, pitch 6, dim 0.2. Agreed: T4's outline slide 18 already sets the
  ball to r 2.8, spin 0.06, seed 401 and this pose, with the `file` dk-pipeline pile gathering round it. T5 opens with
  the ball standing (no assemble), so the cut between talks is invisible.
- **Close entrance:** the next talk's cover pose. Talk 5 is the last, so the next is Talk 1 again. The crane ends on
  T1's cover landing: `lhcb`, `{ at: [3, 0.4, 0], dist: 12, yaw: -24, pitch: 10 }` (T1 outline slide 1, "to be fixed
  in framing"), `lhc-collision` (event.json, record 24506) inside the kit detector at the collision point, rate 0.02. If T1's
  deck refines the landing's framing, copy the final values from it.

## Drop order (if the timing gate fails, or a mechanic fails)

Carried out on 2026-10-29: the old order's 2 (the ATLAS notebook clip) and 4 (the Versions slides 10-11).

1. Slide 11 (0.75): its sentence moves to slide 10's notes; slide 12's crane leaves from the peaks plot instead.
2. Slide 4, the data-centre clip (12 s): the crane goes straight from slide 3 to the sphere.
3. Slide 5 to its 800 TB step alone, if the growing pile does not read or the kit's grow-in-place is not built.

Never drop: slides 6-8 (the hero and the misconception), 9-10 (the spread), 12 (the loop).

## Decisions (revise:data5open, 2026-10-29)

Taken on the recommended option without the owner; each with its alternative.

- **Versions folded into slide 8** (old drop order 4). No pinned kit lockfile, no second-environment rerun and no env
  stage exist, and a third pass on the same machine would confirm the misconception it is meant to answer. Slide 8
  carries the versions sentence and meets the misconception with the output hash on screen; "over 170 sites" is in
  its notes only. Alternative: the critique's option (a), the lockfile plus a filed `d0-rerun-second-env-worked`, which
  restores a slide "another machine, same pinned versions, same hash" after slide 8 (about 1.3 min, taken back from
  slides 9-10).
- **The ATLAS notebook clip dropped** (old slide 9): clip after clip, off the peak's thread, and code text on screen. Its
  sentence is in slide 8's notes. Alternative: keep it between two world slides, on a stretch with no readable code.
  The WLCG clip goes with the Versions slides (its label-free stretch is no longer needed).
- **The timing departs from the bible's split:** part 1 is 2.75 min (the dissolve is now its slide 3, plus a recap on
  slide 2), The record 1.4 min, The pipeline 3.75 min with Versions inside it, Choices 4.1 min, the close 2.0 min.
  Alternative: the bible's 1.5 / 3.0 / 3.5 / 1.5 / 2.5 / 2.0, which needs option (a) above.
- **The pass colours are swapped against the kit's prototype:** the first pass is light blue, like the deleted plot,
  and the second pass lands white over it; the notes of slides 7-8 say the colour marks the pass. Alternative: the
  kit's order (white first, light blue over it), with slide 2's `h0` drawn white too.
- **The converter stays the course's private script** until the kit commits a public one; slide 6's notes call it a
  gap. Alternative: the public uproot converter in the kit (slide 6's Open), which removes the gap.
- **Slide 5 draws one pile that grows** in place, not two piles side by side, so the 4 PB is read as including Run 1.
  Alternative: one pile only (800 TB).
- **The close's packet stops at the heap:** only the generic lane reaches a crossing, which the narration calls "a
  crossing, not row 1's". Alternative: none that the data supports.

## Decisions (draft:data5open, 2026-10-29)

The deck draft follows this outline with the owner's decisions of 29 Oct on top (the series
bible's top block), and with these changes, each taken without the owner on the recommended
option:

- **The owner's 29 Oct decisions win over the text above.** No "D⁰", "K⁻π⁺", "kaon",
  "pion", "IPχ²" or record numbers on screen or in the notes' Message and Picture lines (the
  peak is "a short-lived particle's mass peak", the cut "the quality cut, how far the track
  points from the collision"); Sources keep the provenance. Captions read `mass MeV/c²`; the
  mass plots take the kit's 1 816-1 912 MeV/c² range and default ticks (the outline's
  1 820-1 920 ticks are gone). No trigger-stage or sub-detector names: the close's stops are
  "the first filter", "the buffer", "the second filter" and the detector, landing at the
  collision point (not "the VELO").
- **Slide 6's gap is closed:** the kit now ships the public converter
  `bake/root_to_csv.py` (52 lines, sha256 20f05681…, byte for byte to the course CSV), and
  `code-lines.json` draws it. The deck draws its code body, lines 19-52, in a stage 5.85
  high, so its line pitch (0.172) equals d0.py's. d0.py is now 918 lines, sha256 053d8070…
  (the outline's 6be00ecc… is stale); lines 87-208 still run from reading to the fit.
- **Slide 2's plot stands beside the ball:** h0 at [-10.5, 0, 0], 20 wide and 10.5 high
  (the pipeline plots' size, so the rebuilt plot looks like the deleted one), and the pose
  look [-16.5, 4.6, 0], dist 23.5 frames both (the outline's dist 21 cut the plot's right
  edge). h0 hides from slide 4 on so its empty frame does not stand in the pipeline.
- **Slide 5's pull-back is on the opening path, not the grow click:** a click cannot move
  the camera. The slide cuts in on the one sphere (dist 2.2, held 4 s) and pulls back to
  the lab 5 framing (dist 9) by 10 s; click 1 brings the 800 TB pile, click 2 grows it in
  place to 4 PB (dk-lineup `grow: { from: 1 }`, now in the kit). Alternative: a per-click
  camera move (kit-requests 5).
- **The archive station stands at [-60, 0, -150]**, not the proposed [-60, 0, 45]: from
  there the camera looked back at the pipeline's ball, which stood in the frame as a large
  sphere beside the 1 TB one (first contact sheet). The cover's title sits low on the left,
  clear of the ball that T4's last frame centres.
- **Pass alphas:** h1 (first pass, light blue) 0.75 as lab 5 recorded it, h2 (white) 0.72
  as the outline asks (the kit's notes: 0.5 reads grey, 0.95 blooms).
- **The pipeline never goes to 0 before slide 9,** so the arrival on slide 6 from the
  archive keeps the standing ball and plays pipe 1 → 3 as a step (with the object's
  `replay: false`, which the cover needs, a replay from 0 would stand at once and skip the
  typing). From slide 9 on the pipeline stands at step 1 (the ball alone), which slide 12's
  crane passes.
- **Slide 12 (the close):** a 42 s `path` with `recorded: plate`. The route station
  (the T1 chain: detector, lhc-collision, dk-trigger with both filters and the buffer on,
  dk-heap settled) stands at [-160, 0, -40], so the heap is 40 units behind the ball. Our
  grain's ring (dk-spark `s` step 6) glides from the held plot to the ball; a second ring
  (`s2`) marks our grain on the heap's summit; the lane has no packet of ours at all
  (`ours: false`), so from the heap on only the generic lane runs. The crossing is timed by
  the collision's `approach: 38.3` to fall as the `rate` keys reach 0.02 at about 39 s, and a
  talk-owned `setup/RouteCrossing.vue` starts it on entering (kit-requests 1). The numbers:
  91 583 candidates over the heap (17-27 s), then 1 crossing at the detector (39 s), in one
  spot (`.nums.swap`). The detector geometry's licence credit is the tiny `.credits` line,
  T1's wording.
- **The dropped clips (ATLAS notebook, WLCG)** are commented out of videos/manifest.toml
  with their cut notes; their raws and web copies are parked in the raw bank's `sources/`
  so videos:check is clean.
- **The pendulum example** (`course-pandas-version-drift`) is dropped, not filed (notes
  only, not this peak; see facts-needed.md).
- **Open, for the owner or the main loop:** the plate of slide 12 is not recorded
  (`pnpm talk record data5open --plates`, about an hour on the render slot); the motion of
  the select sweep, the over hand-over with fit1 drawing on after it, the grow-in-place and
  the close's crane are seen only as stills; the lint's cover TEXT finding (kit-requests 6).

## Decisions (fix:data5open, 2026-10-29)

From the fresh-eyes review of the draft; each taken on the recommended option without the
owner. The deck now has 14 slides (13.8 min plus 12 s of clip = 14.0). Old → new numbers:
1-4 → 1-4; 5 → 5 and 6 (split); 6 → 7; a new 8 (the fitting code); 7 → 9; 8 → 10; 9 → 11;
10 → 12; 11 → 13; 12 → 14. The slide numbers in the sections above are the old ones.

- **Slide 5 split in two** (a click cannot move the camera). 5: the one sphere held close
  (one-key path, dist 1.4) with its own label `1 TB`. 6: a one-key cut to the pulled-back pose
  (dist 9), where the 800 TB pile gathers beside the standing sphere on arrival and the one
  click grows it in place to 4 PB. The pile is at honest volume: each drawn sphere is
  cbrt(27) = 3 × the 1 TB sphere's radius (dk-lineup `grain: 27`), seen side by side in the
  shots. Kit request 5 is answered by the split. Alternative: 6 opens on the sphere alone with
  two clicks (the first frame is then nearly empty).
- **The fitting code gets its own beat (new slide 8, 0.5 min):** pipe 3 → 4 types d0.py in
  beside the sheet, framed with the converter at the left, so the two scripts are told apart
  by shape (one short block, two tall columns) before the establishing shot; number `45` bins.
  Slides 7 and 9 give 0.25 min each. The first-pass shot (9) drops its ring (it covered the
  1880 tick); the ring is back on 10, where our grain's landing is the point. Dimming the code
  stages on 9 needs a per-step stage alpha (kit request 8).
- **Slide 10 (hero) claims only same file, same code, same hash:** the versions clause left
  Message for the Misconception and Caveats (said aloud), since nothing draws a pinned
  environment and no second-environment run exists. The pose is `at: [3.7, 2.0, 0], dist: 24`:
  the plot right of the numbers and the code above them, both 40 px or more clear. (The review's
  `at` x 10.5 moved the plot left, into the numbers.) Alternative: a versions stage with a
  pinned third run (bible decision 19), after kit request 7.
- **Slide 12 (peaks):** two dotted lines (hp step `ticks`, `label: false`) at 1 864.374 and
  1 864.574 bracket selection 0's ± 0.10, and dk-spark `s` step 7 (`on: hp`) rings selection 0,
  the plot's `ours`. The ring here marks the series' own selection, not row 1 (said in the
  notes).
- **Slide 13 shows the order:** hs step 3 is `{ select: 0, n: 0 }`, the empty axis with
  `1 selection` on screen; the click (hs step 4, `n: 'all'`) fills it once. The close (14) holds
  hs at step 4.
- **Slide 11:** `120 selections` comes in on the click with the sweep (`v-click`); before it
  only the count of selection 0 is on screen.
- **Slide 2:** yaw 0 (level ticks) and `at: [-15.5, 3.8, 0]`, so the ball clears the number.
- **Not changed, open for the owner:** the series' `.nums` block sits in the lower third
  (y 561-727 of 900) on every content slide; lifting it is a series-wide change of the five
  talks' styles (kit request 10), or an owner waiver. The cover's lint TEXT warning stands
  (kit request 6, a lint fix for the main loop); the plain cover title is the bible's.
