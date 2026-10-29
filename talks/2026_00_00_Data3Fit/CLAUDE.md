# Data3Fit (talks/2026_00_00_Data3Fit)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data3fit.md, never here.

## Brief

Talk 3 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: fitting a model: mass and lifetime from LHCb D0 -> K- pi+.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 2 `Data2Peak` (counting and noise); 4 `Data4Learn` (from a perceptron to machine learning); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
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
- Private brief: ~/.local/share/outreach_talks/briefs/data3fit.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data3fit` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- Branch `talk/data3fit`, worktree `.claude/worktrees/data3fit` (`pnpm talk open data3fit`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data3Fit/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data3fit.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. Full plan:
`notes/outline.md` (2026-10-29, revised from the critique). 14.4 min + 12 s clip = 14.6 min.

1. Cover: T2's last frame (the D⁰ heap, our grain haloed), a line of grains draws across the peak under the title "Fitting"; "today we draw a line through this peak and measure it" (0.5).
2. Means disagree: a lit window narrows three times, then shifts onto the fitted centre, mean 1 864.71 → 1 864.79 → 1 864.81 → 1 864.42 against PDG 1 864.84; a window's mean depends on its width and place, so it is not the mass (1.5).
3. A model: start values: Gaussian on a line at eyeballed knobs with its pull row; a pull is one bin's miss in √N units, χ² adds them squared (372, gated) (1.5).
4. A model: the fit: the curve glides through the logged steps onto the peak, pulls lose their pattern; μ 1 864.47, width 7.65, χ² 53.4 / 40, near the degrees of freedom as it should be (2.0).
5. The valley: the bowl: the plot tilts back and the χ²(μ, width) bowl gathers under it, the ball rolls to the bottom, the Δχ² = 1 ring lights; the fit is the bottom of a valley (1.5).
6. The valley: the slice: one cut along μ, the Δχ² = 1 bar from 1 864.38 to 1 864.57; the error ± 0.10 is how wide the valley is 1 above its bottom (1.0).
7. Off by 0.37: the same slice drawn to Δχ² 20 with PDG's ± 0.04 band high on the wall; Δχ² 14.5 is 3.8 of our errors, with PDG's added in quadrature 3.5 σ (1.0).
8. Off by 0.37: a scale: every grain slides by 0.02 %, the curve's summit glides from 1 864.47 onto 1 864.84; a 0.026 % momentum calibration closes the gap, LHCb's is 0.03 %, so value ± stat ± syst (1.0; gated on its `{shift}` burst strip).
9. How long it lives: clip of the VELO going in (CDS 2295935); it sees where a D⁰ was made and where it decayed (12 s).
10. Decay times, a few: the empty decay-time axis (decay time = flight over speed, τ 0.41 ps, cτ 123 µm), then 2 000 candidates and the sideband subtraction; three in four sideband grains take a window grain with them (1.3).
11. Decay times, all: all candidates subtracted, an exponential from 0.5 ps; τ 0.509 ps against PDG 0.410, it lives too long (0.6).
12. Decay times, cut: IPχ² < 9 lifts grains at every time, most from the tail, the slope steepens; D⁰s from B decays fake a long life, τ 0.421 ± 0.005 ps (1.2).
13. Which are D⁰s: the peak whitens by P(signal), our grain's core turns light blue; its signal share is 0.144, 16.2 MeV/c² off centre (0.8).
14. Close: pull back to the whitened peak with its curve (T4's cover pose); 20 993 signal, and next time a machine draws the line (0.5).

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
pnpm talk check data3fit     # videos:check, stage:check, a build into /tmp/talk-data3fit/site
pnpm talk review data3fit    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data3fit     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
