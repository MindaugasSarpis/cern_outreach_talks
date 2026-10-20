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
- 19 Oct: deployed f77fbc5, the whole story rough (all 12 stations; Pages run
  39309896624, green; the live deck walked clean). Open: part colours on the
  detector, the route behind the pull-back, slide 9's clicks unseen, the dot
  on slide 10 to check live, the 2→3 join.
- 20 Oct: Tools lifts the detector form (`setup/route.js`, `setup/grains.js`,
  `setup/Grains.vue`, `hero/bake_grains.py`, `hero/build_scene.py`,
  `public/data/lhcb-grains.bin` with its NOTICE), reconciled with Innoday's
  eye-level version, into slidev-addon-stage v0.9.0, reading
  origin/talk/mastertalk with "Talk-owned code" below as its guide (keep it
  current); nothing to change here meanwhile, its questions come through the
  Scheduler. This talk pilots the release: once the Scheduler says v0.9.0 is
  tagged, `pnpm talk pin mastertalk v0.9.0`, drop the copies for the kit's
  builder, `pnpm talk ready mastertalk`, ask the Scheduler for main. The
  cluster's editable slidev-videos CLI moves 0.4.0 → 0.8.1 the same day; the
  19 Oct deploy's videos:check, preflight and venue ran clean before it (the
  baseline), so any change in a videos:* command goes to the Scheduler.
  Checked the same day under 0.8.1: the same results, check 1.4 s.
- 20 Oct, v0.9.0's design (Tools, through the Scheduler), for the pilot:
  `src: 'lhcb'` (this bake) or `'lhcb-dense'` (Innoday's 446 400), fetched
  sha256-pinned from a `geometry-lhcb` release into
  ~/.cache/slidev-addon-stage/ and emitted under stage-data/ with the NOTICE,
  so `public/data/lhcb-grains.*` go; `parts: 'lhcb'` gives the palette above,
  no `parts` keeps one `color`; `near` defaults 48 px / 1.5–5 units
  (grains.js's own); the event through `installLhcb({ event })`; the bus is
  `slidev-stage:steps` (`setStep`, `stepOf`, `onStep`, `setStepLater`) and
  `<Grains>` becomes `<StageSteps :set :clicks>`, so stream, grid, spark and
  histogram move onto that bus in the pilot. Agreed the same day: `import
  { setStep, stepOf, onStep, stepper } from 'slidev-addon-stage'` for
  talk-owned builders (README); `setStepLater(name, k, s)` is grains.js's
  setGrainsLater/tick with the tick in the engine (world time: a frozen world
  holds it; returns a cancel function; `stepWaiting(name)`); `<StageSteps>`
  applies only in the `slide` and `presenter` contexts; a missing or
  mismatched geometry asset fails the build naming the asset, the sha and
  the cache dir, only for decks whose space.json uses `src: lhcb` or
  `lhcb-dense`; stage-data/ rides in build:portable.
- 20 Oct: v0.9.0 tagged (toolkit main 8ecddb8); the pilot: both addons pinned
  v0.9.0, the deck on the kit's lhcb plugin (`plugins: [lhcb]`, `src: lhcb`,
  `parts: lhcb`, `setLhcbTracks`), its steps bus and `<StageSteps>`; the
  talk's detector, bus, Grains.vue, geometry files and hero/ scripts dropped.
  Lint 0/0, check ok (the build fetched the geometry into stage-data/).
  Ready, then the Scheduler's main, then the deploy: this is the first real
  test of the Pages workflow and of `pnpm venue` with the geometry fetch.

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
  with a `focus` per step (blur 1 → 0: the open and the close, one object);
  its steps come from the kit's bus (`onStep`, `stepOf` from
  `slidev-addon-stage`). Move it to components/ after 26 Oct, so both talks
  share one copy.
- `setup/clock.js`, `setup/Clock.vue`: the running clock, one element outside
  the slides; `<Clock :keys="[[s, value], …]" unit="ns" />` or `<Clock off />`.
- `setup/Crossing.vue`: starts or continues the shared `lhc-collision` run
  without `<LhcOpening>`'s Lithuanian captions.
- `<StageSteps :set :clicks>` (the kit's, v0.9.0) sets each named form's step
  on slide enter and per click; it replaced this talk's `setup/Grains.vue` on
  20 Oct.
- `setup/route.js`: stations 5–11's forms, registered by
  `installRoute(registerBuilder)`, all in lhc-collision's frame
  (W(x, y, z) = [z·S, y·S·T, x·S·T], S 0.5 units/m, T 2.4 across the beam):
  `stream` (packets through two trigger gates, ours white), `grid` (store, 42
  sites, the thread to Vilnius), `spark` (the one dot); their steps from the
  kit's `stepper(name)`.
- The detector (station 4) is the kit's since v0.9.0 (20 Oct): `plugins:
  [lhcb]` in the deck's `stage:` block; `src: lhcb` (93 000 grains) and
  `parts: lhcb` in space.json, with this talk's `sweep`, `alpha` 0.32, `size`
  1.3 and `out`; its hits from `setLhcbTracks(trajectories(event).tracks.map(t
  => t.pts))` in setup/main.ts. The build fetches the geometry sha256-pinned
  from slidev-videos' geometry-lhcb release (cache ~/.cache/slidev-addon-stage;
  a failed fetch fails the build) and writes it to stage-data/ with its
  NOTICE (DD4hep GPL-3.0, Phoenix Apache-2.0); dev serves it from the cache;
  the last slide keeps the tiny credit. `parts: lhcb` is this talk's palette,
  white and light blue only, neighbours along the beam set apart, the
  trackers brightest and the magnet a frame: 0 velo #e6efff, 1 pipe #5b93ff,
  2 rich1 #7fa9ff, 3 ut #cfe2ff, 4 magnet #5b93ff at the lowest alpha, 5
  scifi #dce9ff, 6 rich2 #7fa9ff, 7 ecal #b8d2ff, 8 hcal #8fb6ff, 9 muon
  #cfe2ff (the collision's own muon tone); hits stay `hot` white.
- `styles/index.css`: `.nums` (numbers low left, white with light-blue
  words, staggered by `--d1…--d3`) and the clock.
- `package.json`: both addons pinned v0.9.0; `stage:check --types
  lhc-collision,stream,grid,spark` (the shared builder and this talk's).
- The bake and the hero shots' Blender scene are the kit's
  `tools/lhcb/bake_grains.py` and `tools/lhcb/build_scene.py` (slidev-videos
  v0.9.0): this talk's `hero/` copies until 20 Oct, lifted unchanged but for a
  budget multiplier `k` on the bake; run headless in Blender 4.5
  (~/talks/.cache/blender), shots `crossing` and `side`, the event's tracks
  grown to `--t` ns by light time. The .glb stays outside git
  (~/talks/.cache/opendata/mastertalk-geometry/), renders in
  ~/talks/.cache/mastertalk-hero/. Blender 4.5's glTF importer leaves every
  collection but one excluded; the script re-includes them all after the
  import. Coordinates: Blender (X, Y, Z) mm = LHCb (x, −z, y).

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
- 2026-10-19: go-ahead for the Blender hero shots; "numbers are ok" (owner).
  Test stills now (short drafts through `pnpm talk render`); the full shots'
  renders after 26 Oct with the Scheduler's slot. Blender 4.5.14 LTS lives in
  ~/talks/.cache/blender (outside the toolkit); the scene is `hero/build_scene.py`.
- 2026-10-19: "the one for the future": no deadline, to be reworked many
  times; the whole story goes into the deck now, rough, rather than station by
  station (owner: "I just see 4 slides now, the second slide is dark, need the
  full story"). All 12 stations drafted the same day; the dive now ends on a
  white dot (our collision) in its bin instead of fading to black early.
- 2026-10-20: this talk, and every incarnation of it, is the showcase: it
  "should present CERN and LHCb in a very cool way, gaining inspiration and
  lifting off of all of the other talks in storytelling, visuals, effects,
  impact" (owner). When a move works in another talk, consider bringing it
  here; the house rules still hold.

## Verify

```bash
pnpm talk check mastertalk     # videos:check, stage:check, a build into /tmp/talk-mastertalk/site
pnpm talk review mastertalk    # check, then shots of the changed slides and a contact sheet
pnpm talk ready mastertalk     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
