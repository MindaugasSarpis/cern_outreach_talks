# Data5Open (talks/2026_00_00_Data5Open)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data5open.md, never here.

## Brief

Talk 5 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: open data and reproducibility: a plot anyone can redo.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 2 `Data2Peak` (counting and noise); 3 `Data3Fit` (fitting a model); 4 `Data4Learn` (from a perceptron to machine learning). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
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
- Private brief: ~/.local/share/outreach_talks/briefs/data5open.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data5open` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- 2026-10-29: deck drafted from notes/outline.md (draft:data5open): 12 slides, 14.0 min;
  check, kit check and map green, lint 1 warning (the cover title, a lint bug:
  notes/kit-requests.md 6); slide 12's plate not recorded yet. Changes against the
  outline: its Decisions (draft:data5open).
- 2026-10-29: review fixes (fix:data5open): slide 5 split (1 TB close, then the piles), a
  fitting-code beat (new slide 8), slide 10 reframed and its Message narrowed, slide 12's ± 0.10
  bracket and ring, slide 13's order (empty axis, then the fill), slide 11's 120 on the click;
  14 slides, 14.0 min. check, kit check, map green; lint 0 errors, 1 waived warning (the cover).
  Open: slide 14's plate (record --plates, then publish by the main loop).
- 2026-10-29: motion-review fixes (final:data5open), every high and medium finding: slide 14's
  crane rebuilt (pipeline standing along the first leg, a rise over the ball, a wide key over
  the lane, T1's landing pose and timing, a 9.5 s landing hold; the count only while the ball
  is held), slide 11's sweep in falling order at 0.4 s (48 s), slide 10's white pass spread
  over 7 s, slides 5-6 closer with their numbers in `.nums`, the clip cut before its last shot
  (10.7 s, re-encoded, dust frames redone), the cover drawn from frame 0. Re-recorded 1, 4, 5,
  6, 10-14 (rec-final, 1280x720, 25 fps): no frame-to-frame jump over 1 luma in slide 14's
  14-21 s, max 2.05 in the whole take; slide 10 peaks +2.6 over settled; slide 11's refills step
  ≤ 0.47 and fall monotonically; slide 6 ≤ 0.6; the clip's last 2 s ≤ 1.63. check, kit check
  (1 warning: the talk-owned selections copy), lint 0 errors (the waived cover warning), map:
  14 slides, 13.8 min plus 10.7 s of clip = 14.0 min.
  Open: slide 14's plate for the deck (`pnpm talk record data5open --plates`, over 240 s, the
  main loop) and the re-encoded clip's publish (`pnpm videos:publish`, the main loop); one
  near-empty second on slide 14 (28.9-30.0 s, kit-requests 18); the 1 TB sphere on slide 6
  is about 12 px wide at 1280 (kit-requests 14); the low findings on slides 2, 3, 9, 12
  (kit-requests 15-17). Next: `pnpm talk record data5open --plates`, then `pnpm talk review data5open`.
- 2026-10-29: polish (polish:data5open), the kit steward's pass, the series check and the
  series' one look: styles/index.css imports the kit's `nums.css` (its own `.nums` block and
  keyframes deleted; the block now stands at bottom 190 px, above the lower third) and takes
  Data2Peak's cover-title rule (no uppercase, no position override); the cover's "larger grain"
  sentence dropped (T4's file ball shows none); the old slide 5 (1 TB alone) folded into the
  piles slide (13 slides, 13.8 min with the clip); the close lands on T1's cover (route look =
  T1's landing, dim 0, sway 0.5, detector alpha 0.42 and `hot` as T1, lane off at 33.5 s, our
  grain lifted out of the heap at 24 s and glided to the vertex: the white ringed point of
  T1/01, checked side by side in a still); steward keys: `s` on: 'pipe', `stageAlpha` on slide 8,
  `oursSlot` 3 and `axisWith` on h0/h1/h2/hs, the ring back on slide 8, `axis: false` on slide 3's
  dust, h2 `fillBy: 'x'` + `glow` 0.4 (curve 1 dropped), hs `by: 'n'` over the bake's
  d0-select.json (the talk-owned falling copy deleted), hp `oursLast`, trg `minPx` 2.5 + `alpha`
  1.2; slide 8's ticks every 40 MeV/c². check ok (stage:check's one warning: slide 13 over the
  live budget, recorded as a plate), check.mjs 0 warnings, lint 0 errors 0 warnings (the cover
  waiver is gone), map 13 slides 13.8 min, shots 13 frames (13 "not settled": bullet time).
  Open: the cover title overlaps the left edge of T4's centred ball (the series' one title
  position against T4's close pose: T4 or the series to decide); the 1 TB sphere on slide 5 is
  a dot at the piles' pose (kit-requests 14, 5); every motion is unseen in stills: re-record
  1-3, 5, 8-13 (`pnpm talk record data5open`; slide 10 without `--hold 55`) and the plate for
  slide 13 (`--plates`), then `pnpm videos:publish` by the main loop.
- 2026-10-29: review fixes (fix:data5open, the still review): every high and medium finding and the
  sound lows. Slide 7 shows what it draws, 122 lines (fact d0-fit-code-122-lines-worked; the 45 bins
  said on slide 8), from a pull-back that holds the ball whole and keeps the number on black; the
  numbers on 2, 8 and 9 lie on black or faint rows (lower targets; slide 9 wider, its scripts and
  sheet at 0.3 by `stageAlpha` 6, h2 ticks every 40 as slide 8); our ring 360 grains up its column
  on h0/h1/h2 (`oursSlot` counts grains: 3 and 6 sat on the axis line), clear of 1 880; the cover
  eases from T4's closing pose to the ball right of the title by 3.2 s (the cut still matches;
  Data2's title-only scrim); slide 5 lands close on the 1 TB sphere and pulls back by 5 s as the
  pile gathers (gap 0.3); slide 11 moved right, peaks at alpha 0.9 and ring 1.0 (light-blue core,
  no bloom), the ± 0.10 lines a dim bracket at 0.6 height; slide 12's empty plot draws its edges;
  slide 13's ring at alpha 0.85 (ring band within 0.05 of T1's cover still); shots/14.png deleted.
  check ok (stage:check's one warning, slide 13 over the live budget, a plate), check.mjs 0
  warnings, lint 0 errors 0 warnings, map 13 slides 13.8 min; shots of 1, 2, 5 (+ click), 7-9,
  11, 12 (+ click), 13 looked at (13 "not settled": bullet time).
  Open: kit-requests 22-26 (code-lines.json stale against d0.py; axis alpha; ours alpha; the 1 TB
  marble's light; T4 may end on T5's eased cover pose, T1's cover font); the 1 TB sphere is still a
  dot in the slide 5 still (the close-up is in the motion only); the motions are unseen in stills.
  Next: `pnpm talk record data5open` (slides 1, 2, 5, 7-9, 11-13; slide 12's click after 1.5-2 s),
  then `pnpm talk record data5open --plates` for slide 13 and `pnpm videos:publish` by the main loop.
- Branch `talk/data5open`, worktree `.claude/worktrees/data5open` (`pnpm talk open data5open`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data5Open/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data5open.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From `notes/outline.md` with its
Decisions (draft and fix:data5open, 2026-10-29; polish:data5open folded 5 into 6): 13 slides, 13.6 min plus 10.7 s of clip = 13.8.
The peak is never named on screen or in Message/Picture lines: "a short-lived particle's mass
peak", "a pair of tracks", "the quality cut".

1. Cover: T4's ball of 91 583 grains already standing and turning, plain title "Open data"; the whole series came out of one open file, so can anyone redo its plot? (0.5)
2. The series' plot: the short-lived particle's mass peak fills out of the ball and T3's curve draws on, μ 1 864.47 MeV/c²; each candidate is a pair of tracks, its mass one grain, and everything shown is code applied to this file. (1.25)
3. Delete it: the plot goes to dust and the ball stays, 1 289 541 B and checksum 2ebf133a; the file is fixed by DOI, free to reuse, and a checksum proves you hold the same bytes. (1.0)
4. Clip: the CERN Data Centre, 10.7 s (0:28-0:38.7), no labels; open files are kept and served by data centres. (10.7 s)
5. How much is open: cut to the pulled-back pose (dist 7.5), opening on the 1 TB sphere already standing (Talk 1's unit, gathered under the clip; about 775 000 copies of the file), the 800 TB pile (Run 1) gathers from behind beside it at honest volume (each sphere 27 TB), the click grows it in place to 4 PB (Runs 1 and 2), the three numbers in the numbers block; LHCb opens half a campaign after 5 years and all of it after 10. (1.0)
6. The file, the converter, the sheet: the converter types in as real line shapes and the sheet fills, 91 583 rows; the first program makes the table. (0.75)
7. The fitting code: a pull-back over the whole chain so far (ball, converter, sheet) as d0.py types in at the right, 122 lines; a second program reads, bins and fits, and it is in the folder too. (0.5)
8. First pass: the whole pipeline runs and rebuilds the deleted plot in light blue, 91 583 candidates; the file and two scripts put the plot back, and the fit has no randomness. (0.75)
9. Second pass (hero): the rerun lands white grain for grain on the first, the curve draws on, μ 1 864.47 and hash d2ec0d08 on both passes; same grain, same bin, same hash (the versions point, "it works on my laptop", is said aloud). (1.75)
10. 120 reasonable choices: one histogram, selection 0 (91 534); the click brings "120 selections" and 48 s of refills (momentum, the quality cut, decay time) in order of kept count (`by: 'n'`), so the count only falls, down to 2 803; each choice keeps a different sample. (1.75)
11. The 120 peaks: one grain per selection's fitted peak on a 0.025 MeV/c² scale, selection 0 ringed between two dotted lines at ± 0.10, spread 0.44 against stat. error 0.10; a choice made after looking could land the peak anywhere in that range. (1.6)
12. Fix it before looking: the empty axis with "1 selection" first, then the click fills selection 0 once and holds; decide before looking, as a blind analysis does. (0.75)
13. Close (recorded plate): a 37 s crane from the held plot past the fitting code, the sheet and the converter to the ball (91 583 while it is held), up over it to the heap, wide over the lane, through the filters to a crossing in the detector at T1's cover landing (our grain lifted out of the heap at 24 s and glided down the lane to the vertex by 35.5 s, the lane off from 33.5 s, the crossing at 36.3 s, bullet time from 36.6 s, landing at 37 s on T1's first frame: dim 0, sway 0.5, the ringed white point at the vertex, then 1 crossing); the file makes table, code and plot redoable, but what the filters dropped is gone and row 1's own crossing cannot be found ("a crossing, not row 1's"). (2.0)

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 1 864.47 MeV/c² μ (slides 2, 9) | the series' fit puts the peak at 1 864.47 ± 0.10 | components/data-kit/bake/d0.py, d0-fit.json | 2026-10-29 | course-d0-fit-mass-worked | OK (confirmed) |
| 1 289 541 B (slide 3) | the size of record 401's file | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-bytes-sha256 | OK (confirmed) |
| 2ebf133a checksum (slide 3) | the portal's Adler-32 of that file | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-bytes-sha256, record401-file-sha256-worked | OK (confirmed) |
| 1 TB (slide 5) | the unit sphere (Talk 1's unit); a definition, not a measurement | (unit) | – | – (775 000 copies in the notes: record401-bytes-sha256) | OK |
| 800 TB Run 1 (slide 5) | LHCb's full Run 1 release, December 2023 | LHCb outreach, 2023-12-20 | 2026-10-29 | lhcb-run1-full-release-2023 (sources differ: lhcb-run1-volume-sources-differ) | OK (confirmed) |
| 4 PB Runs 1–2 (slide 5) | over 4 PB through the Ntupling Service, 2026 | LHCb outreach, 2026-03-03 | 2026-10-29 | lhcb-ntupling-service-4pb | OK (confirmed) |
| 91 583 rows / candidates (slides 6, 8, 13) | the file's tree holds 91 583 candidates (53 948 events) | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-candidates-91583 | OK (corrected) |
| 122 lines (slide 7) | the fitting code drawn is d0.py lines 87-208, 122 lines (the converter 34); the 45 bins are now narrated on slide 8 (d0-fit-chi2-ndf-worked) | bake/d0.py, code-lines.json | 2026-10-29 | d0-fit-code-122-lines-worked | OK (confirmed) |
| d2ec0d08 both passes (slide 9) | the first 8 hex digits of d0-fit.json's SHA-256, identical on two passes | bake/d0.py, d0-checks.json | 2026-10-29 | d0-fit-rerun-sha256-worked | OK (corrected) |
| 91 534 → 2 803 candidates (slide 10, the count) | selection 0 keeps 91 534, selection 119 keeps 2 803 | d0-select.json | 2026-10-29 | d0-select-counts-worked | OK (confirmed) |
| 120 selections (slide 10) | 6 × 5 × 4 reasonable selections | d0-select.json (the course's Lecture 14) | 2026-10-29 | d0-120-selections-worked | OK (confirmed) |
| 0.44 MeV/c² spread (slide 11) | the 120 fitted peaks span 0.436 | d0-select.json | 2026-10-29 | d0-120-selections-worked | OK (confirmed) |
| 0.10 MeV/c² stat. error (slide 11) | the fit's Δχ² = 1 half-width, 0.0965 | bake/d0.py | 2026-10-29 | d0-fit-valley-delta-chi2-worked | OK (corrected) |
| 1 selection (slide 12) | one selection fixed before looking; a count, not a measurement | d0-select.json | 2026-10-29 | d0-120-selections-worked | OK |
| 1 crossing (slide 13) | the one real crossing drawn (record 24506, 2012) | https://opendata.cern.ch/record/24506 | 2026-10-29 | record24506-licence | OK (confirmed) |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/RouteCrossing.vue`: starts the close's collision on the bus when slide 13 is entered
  (kit-requests 1), and sets its `later` steps after so many seconds of world time
  (setStepLater, cancelled on leave): `s` 8 and `s2` 0 at 24 s (our grain out of the heap and
  down the lane to the vertex), `trg` 0 at 33.5 s (the lane off before the landing).
- `styles/index.css`: imports the kit's `nums.css` (the series' `.nums` block, one copy for
  all five), the series' cover-title rule (Data2Peak's), the credit, and (29 Oct) no load fade
  of the world's canvas, so the cover stands from frame 0 (kit-requests 13).

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
- 2026-10-29 (fix:data5open, recommended options without the owner; details and
  alternatives in notes/outline.md "Decisions (fix:data5open)"): slide 5 split in two; a
  fitting-code slide; slide 10's Message claims only same file, same code, same hash (versions
  aloud; a drawn versions stage waits on kit request 7); slide 12's bracket and ring on
  selection 0; slide 13 fixes the selection over the empty axis before the fill.
- 2026-10-29, waiver pending the lint fix (kit-requests 6), closed 29 Oct (polish): the lint
  now exempts the cover title; `pnpm talk lint` is clean.
- The `.nums` block in the lower third (kit-requests 10): closed 29 Oct by the kit's
  `nums.css` (bottom 190 px), shared by all five talks.
- 2026-10-29 (final:data5open, the motion review's high and medium findings; recommended
  options without the owner, each undoable in deck.md / public/data/space.json):
  - Slide 14's crane: the selection station moved from x 120 to x 60 (slides 11-13 keep their
    framing; their paths moved with it) and the pipeline stands along the first leg (`pipe: 4`:
    converter, sheet, fitting code), so the crane is never on an empty frame for long; a
    [16.5] key rises over the ball (no frame nearer it than its dist-11 hold); a wide [28.5]
    key (dist 34) and a 3 s leg to the first filter instead of the reviewer's dist-22 key at
    x -90 (measured: 2.3 s near-black with that, 1.1 s with this; dist 46 gave 1.8 s). The
    landing is T1's cover pose offset to the route station ([-161.5, 1.4, -40], dist 12, yaw
    -24, pitch 10) with T1's timing (crossing 0.3 s before the rate ramp, `approach` 36.3,
    rate 1 → 0.02 over 36.6-37.2 s, landing at 37): the tracks fan right of the crossing at
    56 % across, as on T1's cover. "91 583" stands only while the ball is held (8-13 s); "1
    crossing" at 37.5 s. Alternative: the reviewer's timings (landing at 40, `--max 60`).
  - Slide 11's sweep: a talk-owned falling-order copy of the selections at `every: 0.4` (48 s)
    rather than 30 evenly spaced selections at 0.5 s: the slide's 1.75 min holds the whole
    sweep, and every one of the 120 is shown. Slide 11 is recorded with `--hold 55` until the
    kit's sweep holds `busy` (kit-requests 11).
  - Slide 10: h2 `curve: 1`, `glowTint: 0.1`, `fill: 7` (the pass lands evenly over 7 s, close
    to the pipeline's 8 s run) instead of a per-bin stagger the kit lacks (kit-requests 12).
  - Slides 5-6: the lineup's world labels dropped and the numbers moved into the `.nums` block
    (1 TB; 800 TB Run 1, 4 PB Runs 1–2 on the click), because the kit's labels cannot reach
    the type floor; slide 5 at dist 0.6, slide 6 at dist 7.5 (the closest pose that fits the
    grown 4 PB pile); spheres gather from behind the piles (`from`, `reach: 0.2`).
  - Slide 4's clip cut to 0:28-0:38.7 (10.7 s), ending before the source's last shot.
  - Slide 1: `ambient: [[0, 0]]` and a talk CSS override of the stage's canvas load fade
    (kit-requests 13) instead of waiting for a toolkit change.
  - The low findings (slides 2, 3, 9, 12) are left as kit requests 15-17: each needs a kit
    step key the talk cannot add.


- 2026-10-29 (polish:data5open; the series check and the steward's notes, recommended options
  without the owner; each undoable in deck.md, public/data/space.json, styles/index.css):
  - The series' one look: `nums.css` and Data2Peak's cover rule, plain `<h1>`, no `tickPx`, the
    kit's mass range, white rings. The cover title now stands at the layout's own place and
    overlaps the left edge of the ball (T4's last frame centres it); kept, as the one look
    binds. Alternatives: T4's close pose moved right, or a series exception for T5.
  - Slide 1: the sentence about our grain as "the larger grain on the near side" deleted
    rather than giving T4's ball (another talk) and T5's cover a marked grain: neither frame
    shows one, and the two talks stay consistent.
  - Slide 5 folded into the piles slide (the series check, low): Talk 1 owns the 1 TB unit,
    so the sphere stands as the slide opens (gathered under the clip, `tb: 1` on slide 4) and
    "1 TB" is the first of three numbers. Cost: the sphere is a dot at the piles' pose.
    Undo: restore the fix pass's slide 5 from git.
  - Slides 8-9, the passes' colours (the series check, low): kept against the bible's "run 2
    in light blue lands on run 1". The reason: white is the grammar's "ours / kept", and the
    second pass is the one the talk keeps (the hash both passes print); the first pass in
    light blue matches slide 2's plot, so the plot that was deleted returns in its own colour
    and the rerun lands white on it. The kit's README documents this order (h1 crowd, h2 sel).
  - The close lands on T1/01: the ring travels as `s` (pipe station, world frame) from the
    heap to the vertex, because a spark in the route station replays its `from` move when the
    camera reaches that station at 37 s (seen: no ring in the still); the timed steps live in
    `<RouteCrossing :later>` until the stage keys steps by time (kit-requests 19).
  - Slide 8's ticks every 40 MeV/c² at 1 820 / 1 860 / 1 900 (not 1 840 / 1 880): the ring
    stands over 1 880.
  - Steward deck changes not taken: the lineup's world labels (the `.nums` lines stay, the
    series' type), slide 2's ring `delay` kept at 2.5 s, slide 8's dropped (a followed ring
    shows only while its grain is drawn, and a 3 s delay kept it out of the still).

## Verify

```bash
pnpm talk check data5open     # videos:check, stage:check, a build into /tmp/talk-data5open/site
pnpm talk review data5open    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data5open     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
