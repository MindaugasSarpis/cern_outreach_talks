# MasterTalk (talks/2026_00_00_MasterTalk)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/mastertalk.md, never here.

## Brief

- Event: a keynote seminar "something like Innoday" (owner, 18 Oct): an
  innovation or business day; no event named yet
- Date and slot: 2026-00-00 (placeholder); about 25 min, as Innoday (assumed)
- Venue and screen: a venue with a 16:9 projector, as Innoday (assumed)
- Audience: business and policy, no physics background, as Innoday; a
  keynote, so no audience participation (owner, 18 Oct)
- Language: English for slides, notes and the talk (owner, 18 Oct)
- Look: slidev-addon-stage, blue palette (scaffold default)
- Idea ("one collision, one shot", owner took it 18 Oct): the whole talk is
  one continuous camera move with no cuts. It follows one real collision
  through LHCb's real geometry, then the trigger and data flow (LHCb
  Vilnius's work), down to the single dot it becomes in a discovery plot,
  then pulls back to the whole peak and to Vilnius. Each reduction is a
  station with its real number and unit, from 40 million crossings per
  second down to one dot. The talk opens on the peak, which means nothing
  yet, and closes on it once the audience can read it. No words on screen.
- Reuse: the opening's push into the pipe, the real collision, the funnel
  (as data reduction), the grain histograms. New: an LHCb open-data event in
  the real geometry; two or three offline-rendered hero shots arriving as
  dust; timing set to a recorded rehearsal; every station reachable by a jump.
- Private brief: ~/.local/share/outreach_talks/briefs/mastertalk.md

Open questions: the takeaway; what is off limits (defaults in the
storyboard).

## Status

- Branch `talk/mastertalk`, worktree `.claude/worktrees/mastertalk` (`pnpm talk open mastertalk`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_MasterTalk/
- 18 Oct: storyboard draft 2 approved (`notes/storyboard.md`). Stations 0–3
  built (the peak out of focus, the dive, the beam pipe, the crossing) with
  the clock; lint 0/0, `pnpm talk check` ok. The collision is still the
  talk's own Λb⁰ candidate event (record 28040, run 124143, event 39463039).
  Review round 1 fixed (53b5b5d). Next: a live run of stations 2→3 (the
  crossing inside the freeze), then stations 4–5, then the Blender hero shots
  (after 26 Oct, with the Scheduler's slot).
- 19 Oct: deployed 6f1880a (stations 0–3; Pages run 39205522850, green; the
  live deck walked clean). Slide 3's camera now stops at 5 s, so the shot tool
  reads the freeze as settled. `pnpm talk status` shows each deploy.

## Arc

The timeline is in `notes/storyboard.md` (12 stations, 25 min); this
section takes the slide list once the owner approves it.

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 25 ns · 2 500 · 160 000 000 000 | bunch spacing, bunches per beam, protons per bunch | home.cern LHC page | 2026-10 | cern-lhc-collisions, lhc-bunch-milky-way | OK |
| 5 · 30 000 000 per second | collisions per crossing; non-empty crossings | arXiv:2412.05041; Starterkit | 2026-10 | lhcb-trigger-5tbs-10gbs, lhcb-hlt1-30mhz | OK |
| 63 ns (clock) | light time to M5 at 18.8 m | arXiv:1005.2585 | 2026-10-18 | lhcb-muon-m5-18p8m | OK |
| 246 000 | Λb⁰ decays in the 2019 analysis | arXiv:1904.03947 | 2026-10-18 | lhcb-pentaquark-2019-yield | OK |
| 1 MHz | HLT1 output | arXiv:2408.03881 | 2026-10-18 | lhcb-run3-hlt1-1mhz-out | OK |
| 500 GPUs | HLT1 cards | arXiv:2606.14480 | 2026-10-18 | lhcb-hlt1-500-cards-89khz | OK |
| 80 hours | buffer capacity at 1 MHz (a capacity, not a wait) | arXiv:2305.10515 | 2026-10-18 | lhcb-buffer-80-hours | OK |
| open-data volume (station 8) | which figure: 800 TB, 1 PB or 4 PB | lhcb-run1-volume-sources-differ | | | CHECK |
| 2019 bins licence | HEPData ins1728691 Table 2 | hepdata.net | | | CHECK (expected CC0) |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/grains.js`: `histogram`, copied from Užsikrauk karjerai (18 Oct)
  with a `focus` per step (blur 1 → 0: the open and the close, one object).
  Move it to components/ after 26 Oct, so both talks share one copy.
- `setup/clock.js`, `setup/Clock.vue`: the running clock, one element outside
  the slides; `<Clock :keys="[[s, value], …]" unit="ns" />` or `<Clock off />`.
- `setup/Crossing.vue`: starts or continues the shared `lhc-collision` run
  without `<LhcOpening>`'s Lithuanian captions.
- `setup/Grains.vue`: Užsikrauk's, sets a form's step on slide enter.
- `styles/index.css`: `.nums` (numbers low left, white with light-blue
  words, staggered by `--d1…--d3`) and the clock.
- `package.json`: `stage:check --types lhc-collision` (the shared builder).

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-18: name MasterTalk; the pitch "one collision, one shot"; no audience
  participation in a keynote.
- 2026-10-18: the running clock (mt-clock) goes on screen (owner: "Clock on
  screen").
- 2026-10-18: the event is "something like Innoday": a business and policy
  audience; 25 min and a 16:9 projector assumed from Innoday.
- 2026-10-18: storyboard draft 2 approved; English (owner: "Approved, English").
- 2026-10-18: the collision is an anti-Λb⁰ → J/ψ p̄ K⁺ candidate from the 2012
  DIMUON stream (record 28040, CC0), chosen by our own selection; station 3
  shows its 65 particles in place of "5 collisions" (it has one collision).
  Undo: setup/data/event-lb.json and the `event` in setup/main.ts.
- 2026-10-18: hero shots in the look of CERN's B⁰ → K*μμ film (the owner:
  "geant rendering as in that lhcb thanks video", "Might have been geant +
  blender"): Phoenix's LHCb.glb (DD4hep, GPL-3.0 + Apache-2.0) → Blender
  Cycles on CPU. Proposed, not started; renders after 26 Oct.

## Verify

```bash
pnpm talk check mastertalk     # videos:check, stage:check, a build into /tmp/talk-mastertalk/site
pnpm talk review mastertalk    # check, then shots of the changed slides and a contact sheet
pnpm talk ready mastertalk     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
