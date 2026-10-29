# Data2Peak (talks/2026_00_00_Data2Peak)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data2peak.md, never here.

## Brief

Talk 2 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: counting and noise: a peak in a histogram, Poisson fluctuations, 5 sigma, the Higgs.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 3 `Data3Fit` (fitting a model); 4 `Data4Learn` (from a perceptron to machine learning); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
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
- Private brief: ~/.local/share/outreach_talks/briefs/data2peak.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data2peak` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- Branch `talk/data2peak`, worktree `.claude/worktrees/data2peak` (`pnpm talk open data2peak`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data2Peak/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data2peak.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From
`notes/outline.md` (revised 2026-10-29); 13.6 min of slides + 23 s of clips.

1. Cover: T1's settled heap of 91 583 candidates, our grain's ring gathering on the summit, title "Counting"; last time the rows became this pile, today we count them (0.5 min).
2. One decay alone: dk-vertex, a D⁰ flies and splits into K⁻ and π⁺ strands, no number; a charged track curves in the magnet, the less momentum the tighter, angles simulated (0.6 min).
3. The landing: our grain lifts off the heap, decays, folds into one grain on the empty axis, `1 880.6 MeV/c²`; the bend gives momentum, calling them a kaon and a pion gives energies, together the pair's mass (0.6 min).
4. The first 1 000: grains leap from the heap into 2 MeV bins as a dot plot, `1 000`; a histogram is counting (0.5 min).
5. All 91 583: the rest pour in and the peak near 1 865 stands over a flat shoulder, `91 583`; no single grain could show it (0.8 min).
6. Fourteen flat bins: close on the ragged shoulder tops, `1 461`, `38`; bins that should agree differ by about √N (1.0 min).
7. Re-rolled: the same 14 bins at the same scale re-drawn 24 times inside ± √N lines, `24`, `2.6 %`; a count is one throw, about two in three land inside (1.5 min).
8. The normal tail: 300 000 grains under the bell, the front to 1 σ then 3 σ, `300 000`, `405`; the re-rolled tops in units of 38 make this bell, σ, and the white share is the p-value (1.0 min).
9. Five sigma, the hush: the front at 5 σ and nothing lights, `5 σ`, `0`; the discovery line, and p is not the chance the hypothesis is wrong (0.5 min).
10. The empty tail: the tail drawn 54 times taller dies out before 5, `1 in 3 500 000`; rarer than eight sixes in a row (0.5 min).
11. Twenty rolls of noise: a falling toy over its light-blue expected line, a white alarm bin wandering, `20`, `7`, `2.5 σ`; each roll looks in 30 places, 7 of 20 reach 2 σ, never the same bin (1.0 min).
12. Grown to 3 500: roll 2's white bin sinks onto the rescaled line, `3 500`, `1.1 σ`; more data drowns a chance bump (the Θ⁺ at 4.6 σ, narrated) and a real one grows (the Higgs with 10× data) (1.0 min).
13. Window and sidebands: the D⁰ histogram cut to three bands, our grain lifting with the dust from the gap, `41 090`, `21 077`; the sidebands count the background under the window (0.7 min).
14. In file order: the three bands refill from empty, holding at 186, `186`, `5 σ`; the excess passes 5 σ and never falls back (0.8 min).
15. One Higgs-like event: CERN's 11 s CMS γγ animation (CDS 1406328); what the Higgs boson is, and one event can still be background (11 s clip).
16. The four-lepton count: record 5500's 102 four-lepton masses, the Z near 91, a light-blue expected level over 121-130 GeV, `12`, `4.7`; four leptons give one mass the same way, simulation expects 4.7 (1.5 min).
17. Fourth of July 2012: the announcement footage (CDS 2296228), `5.0 σ` CMS, `5.9 σ` ATLAS; each experiment past 5 σ on its own (12 s clip + 0.3 min).
18. Close: the full D⁰ histogram standing, a 5 σ line of grains across the window once, then the bare peak (T3's cover pose), no number; the takeaway, and next time where the peak stands (0.8 min).

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
pnpm talk check data2peak     # videos:check, stage:check, a build into /tmp/talk-data2peak/site
pnpm talk review data2peak    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data2peak     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
