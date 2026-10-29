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

One line per slide: what it shows, what is said, how long.

1. Cover:

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
