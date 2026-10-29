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
- Branch `talk/data1trigger`, worktree `.claude/worktrees/data1trigger` (`pnpm talk open data1trigger`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data1Trigger/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data1trigger.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From
`notes/outline.md` (revised 29 Oct, revise:data1trigger); 13.6 min of notes plus
24 s of clips = 14.0 min.

1. Cover: a 9 s cold open into LHCb, a real 2012 crossing (record 24506) in bullet time, a white spark at the vertex, the plain title fading in at 8.6 s / each crossing is read out whole, like one camera frame; a track is one charged particle's path; the spark stands in for any crossing (row 1 comes from a different one) / 1.5 min
2. Fronts: one light-blue front a crossing down the detector (the cover's crossing fades out), `25` ns / bunches crossed every 25 ns, the fronts slowed about 7 × 10⁷ times / 0.9 min
3. Glow: the fronts merge into one glow, `40` MHz slots, `30` MHz non-empty / 40 million slots a second, about 30 million with colliding protons (LHCb's round design figure; the bunch count caps it at 28.1 MHz) / 0.9 min
4. Clip: ATLAS pile-up display (CDS 2300480, 12 s), nothing on screen / one crossing holds several collisions; ATLAS in Run 3 up to about 60 / 0.2 min + 12 s
5. Readout: from inside LHCb, a crane out as the hits stream out of the detector, `4` TB/s / about 5 collisions a crossing at LHCb; full readout made about 4 TB a second (the VELO, the pixel detector 5 mm from the beam, alone 2 Tbit/s) / 0.9 min
6. One day: dk-lineup, 1 TB spheres, piles of 4 and 345 600, `345.6` PB/day / a day of full readout would have been 345.6 PB / 0.8 min
7. CERN's tape: the 1.3 EB pile beside the day, `1.3` EB, `3.8` days / under four days of readout was as much as all of CERN's tape (size only) / 0.5 min
8. Gate 1: the lane of knots, then HLT1 bursts 29 of 30 to dust; ours passes white, the rest light blue; `30` MHz in, then `1` MHz out and `500` GPUs / about 500 GPUs kept 1 crossing in 30 before anything was stored, keeping pace in batches; it kept tracks with large momentum across the beam or missing the collision point (fact pending) / 1.5 min
9. Buffer: kept knots park on a turning shell, `30` PB and `80` h; click: gate 1 off, the lane floods it, `2.1` h replaces 80 h (kit key requested; fallback 30 PB and 2.1 h, no click) / only what HLT1 kept could wait; HLT2 decided later from 30 PB of disk; store everything and it fills in 2 h / 1.2 min
10. Gate 2: close on HLT2, then it drops 9 of 10 knots and each kept knot loses a quarter, `100` kHz, `10` GB/s / HLT2 reconstructed (hits joined into tracks and particles) and kept about 1 in 10, about 10 GB a second; Turbo only in the caveats / 1.3 min
11. Clip: CERN's TFinity tape library installed (CDS 2728761, 12 s), nothing on screen / what both gates kept went to tape / 0.2 min + 12 s
12. Kept a day: a white 864 TB pile beside the 345 600 TB day, `864` TB, `345.6` PB / about 1 byte in 400 kept: 300 in crossings, and each kept crossing stored at about 100 kB instead of 133 kB / 1.1 min
13. One row: our packet folds into one white grain, ringed, over the fading-in floor; `1 880.6` MeV/c², `3 001` MeV/c, `0.413` ps, `1 299` at once (requested `onscreen` exception, four numbers at once; fallback: the first three, IPχ² in the notes, takeaway "a row of numbers") / a kept crossing becomes rows of numbers: pair mass, pT, decay time, IPχ², each in one clause; record 401 is a different Run 1 (2011-12) crossing under a different trigger, a sample the guide calls randomly collected / 1.4 min
14. The heap: 91 583 light-blue grains rain onto the floor, ours settles last on the summit (T2's cover pose), the count `91583` "candidates" / each row is a candidate (two tracks that may come from one D⁰ meson); this pile is what the next four talks work on; a row is not known to be a D⁰ / 1.2 min

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

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

## Verify

```bash
pnpm talk check data1trigger     # videos:check, stage:check, a build into /tmp/talk-data1trigger/site
pnpm talk review data1trigger    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data1trigger     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
