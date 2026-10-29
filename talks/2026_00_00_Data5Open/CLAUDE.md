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
- Branch `talk/data5open`, worktree `.claude/worktrees/data5open` (`pnpm talk open data5open`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data5Open/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data5open.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From `notes/outline.md` with its
Decisions (draft and fix:data5open, 2026-10-29): 14 slides, 13.8 min plus 10.7 s of clip = 14.0.
The peak is never named on screen or in Message/Picture lines: "a short-lived particle's mass
peak", "a pair of tracks", "the quality cut".

1. Cover: T4's ball of 91 583 grains already standing and turning, plain title "Open data"; the whole series came out of one open file, so can anyone redo its plot? (0.5)
2. The series' plot: the short-lived particle's mass peak fills out of the ball and T3's curve draws on, μ 1 864.47 MeV/c²; each candidate is a pair of tracks, its mass one grain, and everything shown is code applied to this file. (1.25)
3. Delete it: the plot goes to dust and the ball stays, 1 289 541 B and checksum 2ebf133a; the file is fixed by DOI, free to reuse, and a checksum proves you hold the same bytes. (1.0)
4. Clip: the CERN Data Centre, 10.7 s (0:28-0:38.7), no labels; open files are kept and served by data centres. (10.7 s)
5. One terabyte: the one 1 TB sphere held close (a third of the frame's height), "1 TB" in the numbers block; the unit of the piles, about 775 000 copies of the file. (0.4)
6. How much is open: cut to the pulled-back pose (dist 7.5), the 800 TB pile (Run 1) gathers from behind beside the sphere at honest volume (each sphere 27 TB), the click grows it in place to 4 PB (Runs 1 and 2), both numbers in the numbers block; LHCb opens half a campaign after 5 years and all of it after 10. (0.8)
7. The file, the converter, the sheet: the converter types in as real line shapes and the sheet fills, 91 583 rows; the first program makes the table. (0.75)
8. The fitting code: d0.py types in beside the sheet, the converter at the left, 45 bins; a second program reads, bins and fits, and it is in the folder too. (0.5)
9. First pass: the whole pipeline runs and rebuilds the deleted plot in light blue, 91 583 candidates; the file and two scripts put the plot back, and the fit has no randomness. (0.75)
10. Second pass (hero): the rerun lands white grain for grain on the first, the curve draws on, μ 1 864.47 and hash d2ec0d08 on both passes; same grain, same bin, same hash (the versions point, "it works on my laptop", is said aloud). (1.75)
11. 120 reasonable choices: one histogram, selection 0 (91 534); the click brings "120 selections" and 48 s of refills (momentum, the quality cut, decay time) in order of kept count, so the count only falls, down to 2 803; each choice keeps a different sample. (1.75)
12. The 120 peaks: one grain per selection's fitted peak on a 0.025 MeV/c² scale, selection 0 ringed between two dotted lines at ± 0.10, spread 0.44 against stat. error 0.10; a choice made after looking could land the peak anywhere in that range. (1.6)
13. Fix it before looking: the empty axis with "1 selection" first, then the click fills selection 0 once and holds; decide before looking, as a blind analysis does. (0.75)
14. Close (recorded plate): a 37 s crane from the held plot past the fitting code, the sheet and the converter to the ball (91 583 while it is held), up over it to the heap, wide over the lane, through the filters to a crossing in the detector at T1's cover landing (the crossing at 36.3 s, bullet time from 36.6 s, landing at 37 s, then 1 crossing); the file makes table, code and plot redoable, but what the filters dropped is gone and row 1's own crossing cannot be found ("a crossing, not row 1's"). (2.0)

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 1 864.47 MeV/c² μ (slides 2, 10) | the series' fit puts the peak at 1 864.47 ± 0.10 | components/data-kit/bake/d0.py, d0-fit.json | 2026-10-29 | course-d0-fit-mass-worked | OK (confirmed) |
| 1 289 541 B (slide 3) | the size of record 401's file | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-bytes-sha256 | OK (confirmed) |
| 2ebf133a checksum (slide 3) | the portal's Adler-32 of that file | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-bytes-sha256, record401-file-sha256-worked | OK (confirmed) |
| 1 TB (slides 5, 6) | the unit sphere (Talk 1's unit); a definition, not a measurement | (unit) | – | – (775 000 copies in the notes: record401-bytes-sha256) | OK |
| 800 TB Run 1 (slide 6) | LHCb's full Run 1 release, December 2023 | LHCb outreach, 2023-12-20 | 2026-10-29 | lhcb-run1-full-release-2023 (sources differ: lhcb-run1-volume-sources-differ) | OK (confirmed) |
| 4 PB Runs 1–2 (slide 6) | over 4 PB through the Ntupling Service, 2026 | LHCb outreach, 2026-03-03 | 2026-10-29 | lhcb-ntupling-service-4pb | OK (confirmed) |
| 91 583 rows / candidates (slides 7, 9, 14) | the file's tree holds 91 583 candidates (53 948 events) | https://opendata.cern.ch/record/401 | 2026-10-29 | record401-candidates-91583 | OK (corrected) |
| 45 bins (slide 8) | the fit uses 45 bins of 2 MeV/c² on 1 820-1 910 | bake/d0.py | 2026-10-29 | d0-fit-chi2-ndf-worked, course-d0-fit-mass-worked | OK (confirmed) |
| d2ec0d08 both passes (slide 10) | the first 8 hex digits of d0-fit.json's SHA-256, identical on two passes | bake/d0.py, d0-checks.json | 2026-10-29 | d0-fit-rerun-sha256-worked | OK (corrected) |
| 91 534 → 2 803 candidates (slide 11, the count) | selection 0 keeps 91 534, selection 119 keeps 2 803 | d0-select.json | 2026-10-29 | d0-select-counts-worked | OK (confirmed) |
| 120 selections (slide 11) | 6 × 5 × 4 reasonable selections | d0-select.json (the course's Lecture 14) | 2026-10-29 | d0-120-selections-worked | OK (confirmed) |
| 0.44 MeV/c² spread (slide 12) | the 120 fitted peaks span 0.436 | d0-select.json | 2026-10-29 | d0-120-selections-worked | OK (confirmed) |
| 0.10 MeV/c² stat. error (slide 12) | the fit's Δχ² = 1 half-width, 0.0965 | bake/d0.py | 2026-10-29 | d0-fit-valley-delta-chi2-worked | OK (corrected) |
| 1 selection (slide 13) | one selection fixed before looking; a count, not a measurement | d0-select.json | 2026-10-29 | d0-120-selections-worked | OK |
| 1 crossing (slide 14) | the one real crossing drawn (record 24506, 2012) | https://opendata.cern.ch/record/24506 | 2026-10-29 | record24506-licence | OK (confirmed) |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/RouteCrossing.vue`: starts the close's collision on the bus when slide 14 is entered
  (kit-requests 1).
- `styles/index.css`: the series' `.nums` block, the cover title, the credit, and (29 Oct)
  no load fade of the world's canvas, so the cover stands from frame 0 (kit-requests 13).
- `public/dk/t5-select-falling.json`: the bake's `d0-select.json` selections sorted by kept
  count, falling, for slide 11's sweep (kit-requests 11). Remade from the synced copy with
  `python3 -c "import json;s=json.load(open('public/dk/d0-select.json'));f=json.load(open('public/dk/t5-select-falling.json'));f['selections']=sorted(s['selections'],key=lambda x:(-x['n'],x['i']));json.dump(f,open('public/dk/t5-select-falling.json','w'),indent=1,ensure_ascii=False)"`
  after a re-bake (run in this directory).

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
- 2026-10-29, waiver pending the lint fix (kit-requests 6): the cover's plain title "Open
  data" is flagged TEXT by `pnpm talk lint` because the headmatter's `onscreen: numbers` is
  read as slide 1's own; the bible requires both. `ready --release` will show this one warning
  until scripts/talk_lint.py is fixed on main.
- Open for the owner: the `.nums` block sits in the lower third on every content slide
  (kit-requests 10): a series-wide move or a waiver.
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

## Verify

```bash
pnpm talk check data5open     # videos:check, stage:check, a build into /tmp/talk-data5open/site
pnpm talk review data5open    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data5open     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
