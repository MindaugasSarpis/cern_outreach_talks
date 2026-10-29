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
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data4learn.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. The full outline, with poses,
steps, caveats and fact ids, is `notes/outline.md` (revised 2026-10-29; 14.0 min, no clips).

1. Cover: T3's whitened D⁰ peak and its curve at T3's close pose, plain title "Machine learning"; last time the fit gave every candidate a signal share, today a machine learns to draw the line. 0.5 min
2. Two numbers a candidate: the histogram tips into a 2D cloud, IPχ² against decay time (both log, raw ticks), 91 531 "plotted"; we sort by the other numbers because the mass is what we fit afterwards. 0.75 min
3. A cut is a line: T3's IPχ² < 9 becomes a white edge, 53 194 "kept"; a cut is a boundary someone chose. 0.75 min
4. One threshold: 200 simulated points in two clouds and the best cut on x₁, 177 of 200; one variable gets this far. 1.0 min
5. One update: the edge dissolves, then the first line draws on, w₁ 0.259, w₂ 0.255, b 0; a neuron draws a line and scores each point 0 to 1, training starts at zero weights, and this first line (150 of 200) is worse than the cut. 1.0 min
6. Training: the line sweeps through 1 000 epochs and settles, 185 of 200 against the cut's 177; the machine beats the hand cut. 1.25 min
7. A loss: the loss bowl over (w₁, w₂), ball at the rim, 0.693 (needs the b-profiled bake, else dropped); the loss is the average −ln of the right answer's score, a number to make small. 1.0 min
8. Down the valley: the ball rolls the logged path to the bottom, 0.162; each step moves the weights downhill, so training is a fit, like T3's χ² valley. 1.0 min
9. Unseen points: the line retrained on 150 points judges 50 it never saw, 93.3 % train, 92.0 % test ± 3.8 %; a classifier is judged on points it did not train on. 1.0 min
10. A ring: one class round the other, the best straight line gets 53.3 % of test points; no straight line separates them. 0.75 min
11. A bent boundary: the line bends round the cloud, 95.0 %, 114 of 120; four neurons draw lines and a fifth combines them, which can close a ring. 0.5 min
12. Real labels: record 401 coloured by the mass window, overlapping, guess 53.2 %, network 61.3 %; labels come from the mass, inputs from everything else, and the classes overlap. 0.75 min
13. The leak: side on, the mass axis opens and the classes snap apart, 99.9 % "with mass"; feed the mass back in and the network just reads the label (music peak). 0.75 min
14. Undo: the mass axis closes and the overlap returns, 61.3 % "network"; without the leak the honest number returns. 0.75 min
15. Rare signal: 100 white grains among 99 900 light blue, 99.9 %; a classifier that never says yes is 99.9 % right, the second 99.9 % that means nothing. 0.5 min
16. Precision: the cut lights 90 signal and 999 background, precision 8.3 %; finding most of the signal still keeps a set that is mostly background. 0.75 min
17. The trigger decides first: T1's gate 1 fires and 29 of 30 packets burst, 1 in 30 "kept"; a trigger is a classifier that answers before anyone looks, and what it drops is gone. 0.5 min
18. Close: the file: the kept lane folds into one turning ball of 91 583 "candidates", T5's cover pose; everything sorted today is one file, and next time we make the plot again from it. 0.5 min

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
pnpm talk check data4learn     # videos:check, stage:check, a build into /tmp/talk-data4learn/site
pnpm talk review data4learn    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data4learn     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
