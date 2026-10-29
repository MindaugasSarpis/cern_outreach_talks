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
- Branch `talk/data5open`, worktree `.claude/worktrees/data5open` (`pnpm talk open data5open`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data5Open/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data5open.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From `notes/outline.md`
(revised 2026-10-29, revise:data5open): 12 slides, 13.8 min plus 12 s of clip = 14.0.

1. Cover: T4's ball of 91 583 grains already standing and turning, plain title "Open data"; the whole series came out of one open file, so can anyone redo its plot? (0.5)
2. The series' plot: the D⁰ histogram fills out of the ball and T3's curve draws on, μ 1 864.47 MeV/c²; recap (a D⁰ candidate is a kaon-pion pair, its mass one grain) and everything shown is code applied to this file. (1.25)
3. Delete it: the plot goes to dust and the ball stays, 1 289 541 B and checksum 2ebf133a; record 401 is fixed by DOI, CC0, and a checksum proves you hold the same bytes. (1.0)
4. Clip: the CERN Data Centre, 12 s, no labels; open files are kept and served by data centres. (12 s)
5. How much is open: one 1 TB sphere, then one pile of 800 TB (Run 1) that grows in place to 4 PB (Runs 1 and 2); LHCb opens half a campaign after 5 years and all of it after 10. (1.2)
6. The file, the script, the sheet: the converter types in as real line shapes and the sheet fills, 91 583 rows; the first program makes the table (its course script is not public: a gap, in the notes). (1.0)
7. First pass: the whole pipeline runs and rebuilds the deleted plot in light blue, 91 583 candidates; the file and two scripts put the plot back, and the fit has no randomness. (1.0)
8. Second pass (hero): the rerun lands white grain for grain on the first, the curve draws on, μ 1 864.47 and hash d2ec0d08 on both passes; same grain, same bin, same hash, but on another machine only with the same package versions ("it works on my laptop"). (1.75)
9. 120 reasonable choices: one histogram refills through the 120 selections (pT, IPχ², decay time), count 91 534 down to 2 803; each choice keeps a different sample. (1.75)
10. The 120 peaks: one grain per selection's fitted peak on a 0.025 MeV/c² scale, spread 0.44 against stat. error 0.10; each choice gives a slightly different peak, so a choice made after looking could land it anywhere in that range. (1.6)
11. Fix it before looking: the histogram refills once with selection 0 and holds, 1 selection; decide before looking, as a blind analysis does. (0.75)
12. Close (recorded plate): a ~42 s crane from the held plot past the ball and the heap, where our packet fades, then through the gates to a crossing in LHCb at T1's cover landing, 91 583 then 1; the file makes table, code and plot redoable, but what the trigger dropped is gone and row 1's own crossing cannot be found ("a crossing, not row 1's"). (2.0)

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
pnpm talk check data5open     # videos:check, stage:check, a build into /tmp/talk-data5open/site
pnpm talk review data5open    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data5open     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
