# Open data talk: handoff

**Language: Lithuanian** (owner, 2026-10-08). Title „Atveriame LHCb duomenis“.
Slides, labels and the spoken script (`Sakyti:`) are in Lithuanian; stage
directions and these notes are in English. `lang: lt` in the headmatter; the
lint runs in Lithuanian mode. Copy rules: lt-copy (origin/feat/talk-skills),
docs/unslop-lt.md (origin/feat/unslop); never „kolaborantai“, no „įgalinti“ or
„adresuoti“.

The design notes are in the repo `CLAUDE.md`, under "Open data talk".
Toolkit pin: slidev-videos v0.7.0, for both addons.

**Deploys (owner, 2026-10-09: "Deploy now, and always").** The standing rule
holds for this talk: it deploys without asking once `talk ready` passes with
nothing skipped and the Scheduler gives it main. Anything else still needs
the owner's word.

## Status (2026-10-09): approved by the owner; deployed on v0.6.8, v0.7.0 ready

- Pinned v0.7.0 (the Scheduler's batch round), not yet deployed: the forms
  on their own clock say `api.busy`, `<Grains :later>` runs on the world's
  clock, the stills are new. See the v0.7.0 decision.

- Redeployed 2026-10-09 under the standing rule: commit 546aed5 on main,
  Pages run 37974807816 (success); `talk deploy`'s live check passed (13
  slides, nothing failed). `talk ready` passed on 546aed5 with nothing
  skipped. The phone washout fix: see the v0.6.8 decision.
- Redeployed 2026-10-09 under the standing rule, after Innoday: commit
  64dbf61 on main, Pages run 37957885051 (success); `talk deploy`'s live
  check passed (13 slides, nothing failed). `talk ready` passed on 64dbf61
  with nothing skipped. v0.6.7 makes every pixel finite before bloom (the
  iPhone black screen from additive pile-ups); a v0.6.7 stills render matched
  the committed stills (slides 3–12 identical, 1–2's flash a hair dimmer), so
  they stay.
- Redeployed 2026-10-09 under the standing rule: commit 8a88b32 on main,
  Pages run 37949433367 (every job success); `talk deploy`'s live check
  passed. `talk ready` passed on 8a88b32 with nothing skipped. v0.6.6's kit
  owns print pages (each animation jumps to its end); the talk's own
  `.print-slide-container` rule is gone. Rasterised PDF: 13 pages, each with
  its text and its own still.
- Redeployed 2026-10-09 on the owner's go: commit ef5b903 on main, Pages run
  37946636011 (every job success); `talk deploy`'s live check passed (13
  slides, nothing failed). `talk ready` passed on ef5b903 with nothing
  skipped (lint, check, build, shots, pages, preflight, venue).
- In it: no gold text (white type, one light-blue accent); the PDF shows
  every slide's text (it did not on v0.5.3–v0.5.4, see the decision); v0.6.4
  with the floor `enterable`; stills on the v0.6 settle.
- Redeployed 2026-10-09 on the owner's go: commit 23a3bf7 on main, Pages run
  37930240036 (every job success). The URL answers 200 with the Lithuanian
  title; stills, the clip's poster and space.json answer too. `talk ready`
  passed on 23a3bf7 with nothing skipped.
- v0.5.4 fixed v0.5.3's print bug: a `talk export` gives each of the 13 pages
  its own still, and the PDF is 1.7 MB (42 MB on v0.5.3).
- Slide 9 now says „iki 2026 m. liepos“ (see the decision).
- Before: deployed 1c7330b on v0.5.3 (Pages run 37925969848) for the owner's
  laptop review, with the print bug.
- Redeployed 2026-10-09 on the owner's go, after Užsikrauk karjerai: commit
  d97015a on main, Pages run 37902214612 (every job success). The talk's URL
  answers 200 with the Lithuanian title, and the live space.json carries the
  ring's `motion`. `talk ready` passed on the same commit.

- 13 slides in Lithuanian, about 6.0 of 6.5 min (lint, lang lt: 0 errors, 0
  warnings). Toolkit pin v0.6.8.
- The line: the cover; the 3D clip (advances on its end); one real Z → μμ
  collision from LHCb open data; it collapses into the 1 TB sphere; 800 TB and
  4 PB open (gold; 4 PB forms from five 800 TB piles); LHCb's 100 PB (blue);
  the exabyte (ten of LHCb's spheres merge into it); the users; Vilnius; LHCb's
  2019 pentaquark plot; Dominykas's own plot with a pentaquark rising from its
  peak; „Ačiū“ in a ring of the group's portraits made of grains.
- Reviews: visual review clean (round 7, shots v16); the final copy review
  (lt-copy + unslop-lt) applied, every overclaim on slides 11–13 removed.
  Final shots come from the final build. The stills (public/stills/) are
  the stage's own since v0.5.3; see the v0.5.3 decision.
- Not run: the talk-review workflow (it needs the owner's own request in the
  session; the final review ran as separate reviewer agents instead).
- Deployed 2026-10-08 on the owner's go: commit 484a430 on main, Pages run
  37834273740 (build success, deploy success). The talk's URL,
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_OpenData/,
  answers 200 with the Lithuanian title; space.json, the stills, the portraits
  and the thesis plot answer too. `talk deploy` printed "not deployed" only
  because its per-talk build-job lookup does not match the new single `build`
  job (deploy.yml after f67d367); checked by hand with gh and curl.
  `ready` ran with lint skipped (not on this branch); the release lint was
  clean on the same commit.

## Decisions

- 2026-10-09. v0.7.0: `stage:check` warns (`unsaid-clock`) about a builder
  that moves on its own clock without saying so. The streams, the portraits
  and the collision now return `api.busy` (a stream filling its arc, 1/speed
  s; the faces gathering and the ring's drive ramping in, 3.3 s; the tracks
  growing, the event shrinking and its cloud fading, 4.7 s; any fade or
  label still moving), and so does the lineup (a pile growing or merging on
  a step of its own). `<Grains :later>` ran on `setTimeout`, wall time, so a
  headless still caught slide 4's 1 TB sphere only if the render was slow
  enough (with the default settle it was missing); it now runs on the
  world's clock (`setGrainsLater`, driven by the forms' updates), and a
  step still to come keeps its form busy. The stills are remade at each
  slide's last click (v0.7.0's `--stills`; this deck has no clicks) with
  `--settle 20`, which keeps the owner-approved phases (the collider's flash
  on slides 1–2, the ring on the close); the default settle now waits on
  its own (slide 4 to 9.25 engine-s, slide 10 to 8.75). Undo: the pin
  commit's parent.
- 2026-10-09. v0.6.8: grains sized to the frame, not in device pixels (on a
  phone's small slide band pixel-sized grains overlapped many times over and
  the additive piles washed out to white). The streams, the floor, the
  collision and the portraits' sparks return `frameScale` (buffer height /
  900) instead of `pixelRatio`; the lineup's spheres and the faces size from
  the viewport already. The collision's grains are at least 1.5 px, so the
  muon tracks stay unbroken on a phone. Checked: 1600×900 stills unchanged;
  an iPhone 13 shot (390×844, DPR 3) of the live v0.6.7 site blew slide 3's
  vertex and slide 10's streams out to white, this build does not. Undo: return
  `pixelRatio` again (16b3950^, 546aed5^).
- 2026-10-09. No gold letters (owner, via the Scheduler: "these gold letters
  are all over the internet now because everyone uses AI as a designer").
  Kickers (the kit's and the cover's too), units, slide 10's bullets and
  slide 11's years are one light-blue accent, `--od-accent: #9cc4ff`; big
  numbers and headlines are white (slide 11's 76 was a gradient); slide 10's
  stream labels in the world are the pile labels' neutral `#d4dcea`. The
  gold in the world (muons, open-data piles and streams, the portraits'
  grains) keeps its meaning. Undo: bbbfa0a^.
- 2026-10-09. The PDF: Slidev's export prints its print pages with screen
  media, so the talk's `@media print` rule never applied there, and the
  readouts that rise 2.6–5.2 s late (slides 4–9) printed without their text
  on v0.5.3–v0.5.4 (deployed 1c7330b and 23a3bf7). The PNG export I checked
  then waits longer and showed the text; check a rasterised PDF instead.
  Now every animation in the slide is off on `.print-slide-container`, under
  reduced motion and in print (each ends on the element's own style).
- 2026-10-09. v0.6.3, then v0.6.4 (the Scheduler's round): stills with the
  engine-clock settle, `--stills --settle 20` (the streams and the collision
  have neither `assemble()` nor `api.busy`); v0.5.4's real-time settle had
  called slides 1, 5 and 10 still too early. The floor is `enterable`.
- 2026-10-09. Slide 9: „per 2026 m. pirmąjį pusmetį“ → „iki 2026 m. liepos“
  (the Ideas backlog's item 1, owner-approved). The DPHEP Global Report 2026
  (arXiv:2607.06775, submitted 7 Jul 2026) says "At the time of writing,
  about 20 requests…"; the service ran as a beta from October 2024 and was
  released in February 2026, so the 20 are a total by July, not a half-year
  count. The screen keeps "20"; the notes say „apie dvidešimt“ (the
  Scheduler: fine as is). Undo: the old line in 9126ae2^.
- 2026-10-09. Pinned slidev-videos v0.5.3 (the Scheduler's round for the
  owner's laptop review): iPhone quality tiers, lost-context recovery,
  `?stage-debug`, the stage's own stills, clip posters.
  - The talk's print stills (shots with the slide's text, laid over the page
    in print by `.print-still`) are retired: the stage now draws
    `public/stills/NN.jpg` under the live text in print and in the static
    fallback, so those shots would have doubled the text.
  - The stills are the world alone (`slidev-stage-shots <dist> public/stills
    --stills`) after a 30 s settle: at 9 s SwiftShader's slow engine clock
    left the ring flying in and the piles forming. All 13 slides have one.
  - lhcb.mp4's poster came from `frames --all` with the v0.5.3 CLI, run from
    a `git archive v0.5.3` of the toolkit: the env's editable CLI (toolkit
    main b7e160f) predates the poster code.
  - Checked: a build with the Pages base served under its prefix (no failed
    request on any slide, in print or under reduced motion); a real
    `talk export` (13 pages, each with its text; the wrong still above).
  - Undo: `talk pin 2026_10_00_OpenData v0.5.1` and restore the
    `.print-still` images and CSS from 1c7330b^ (12824f5^).
- 2026-10-08. The exabyte now follows LHCb's 100 PB, and "What it finds"
  comes after it. Before, the order was 100 PB → finds → 1 EB → 800 TB.
  - Why: the camera now pulls back in one move (1 TB → 100 PB → 1 EB). The
    finds slide then answers why opening the data matters, and its pentaquark
    plot comes back on the Dominykas slide.
  - The opaque finds slide sits at the 800 TB pose, so the fly-in happens
    behind it and the camera is still when the 800 TB text appears.
  - Undo: swap slides 7 and 8 and give the finds slide back pose
    `[7.36, 0, 0]`, dist 37.5.
- 2026-10-08. Every owner-approved slide stays: the LHCb photo, the event
  display, the finds and the exabyte. The owner set this story earlier today.
  The Scheduler's shorter line (sphere → LHCb → open → users → Dominykas) is
  the spine; these slides set it up.
- 2026-10-08. On-screen text:
  - "~2 000 members" (LHCb, June 2026: "on the verge of exceeding 2000")
    replaces 1 900 members and 29 countries, which were not in the facts
    bank. "Vilnius joins 2024" is the third stat.
  - Cover kicker: "Nominated for an open data award". Subtitle: "How data from
    a detector at CERN reached a bachelor's thesis in Vilnius".
- 2026-10-08. CSS rewritten as one ordered file.
  - Colour classes on the readout: `.readout.blue`, `.readout.steel`
    (gold is the default).
  - Every sentence under a number is `.line`.
  - Type floor of 18 px: the legend 12.5 → 18, the stat labels 13 → 18 (no
    longer uppercase), the team 15 → 18.
  - Unused `.three-col` and `.world-caption.narrow` rules removed.
- 2026-10-08. Specks on the 1 EB pile: clamped the `pow()` bases in
  `metal`, `metalHard`, `heap` and the vertex `lit` term to [0, 1]. A unit dot
  product can pass 1 by rounding, and `pow` of a negative base is NaN in GLSL.
  Not yet confirmed on a render.

- 2026-10-08. Unslop pass (unslop 1.8.4, check mode, on `talk_copy.py`'s copy
  packet; house voice wins). Fixed:
  - Slide 5 said "one sphere is one terabyte" three times (legend, kicker,
    line). The kicker is now "One sphere" and the line names only the
    laptop comparison.
  - Slide 4: "software decides" became "software selects".
  - Notes, slide 5: "Nothing shrinks; the camera only steps back" (a
    negative parallelism) became a positive statement.
  - Notes, slide 7: cut "Only a few scientific archives anywhere are this
    large". It is a vague claim with no source in the bank (gap: the
    ECMWF comparison, unsourced).
  - Notes, slide 8: "finds new things" became "finds new particles".
  - Notes, slide 9: the vague "until a few years ago only LHCb's members could
    use this data" became the 2022 first release of 200 TB
    (`lhcb-open-data-first-release-2022`).
  - Notes, slide 12: "the stream I am proudest of" was a feeling the speaker
    never stated. It became "the last stream goes to one student".
  - Slide 10's line: "get a file of the collisions that contain it" (the
    service returns a file, an ntuple).
  - Left as they are: the counted numbers in place of slide titles (the
    deck's chosen style; the kickers carry the storyline) and the deliberate
    callback "Remember this plot; it comes back at the end".

- 2026-10-08. Screenshot review rounds (shots v9 to v12, a subagent on contact sheets):
  - The specks on the 1 EB pile came from `vF`, a varying: a settled sphere's
    1.0 could arrive as 0.99999. The shader then cut that sphere round
    (holes) and mixed in its dark mirror. Found with a debug build that
    painted NaN red (none) and unsettled spheres green (scattered over both
    piles 30 s after arrival). Settled is now `vF > 0.995`.
    - Two earlier guesses changed nothing visible: tiny flyers taking the
      pile's shading, and 1e-6 floors on pow() bases. Both are kept as harmless.
  - Streams take `label`, drawn beside each end cloud. The Vilnius ends are
    stacked in the list's order, right of a list capped at 52 %.
  - The type floor is now applied to the kit (`--stage-type-min: 18px`).
    Labels are drawn at 64 px and mipmapped.
  - The single sphere's softbox has soft edges.
  - Poses: the cover is dimmed to 0.25; the 1 EB target is x 9.6, without the
    1 TB; the 4 PB target is x 4.5, showing only gold; the close is dimmed to 0.3.
- 2026-10-08. Toolkit pin `dca4e8f` (feat/dust-fullframe): clips arrive as
  dust over the whole frame. Checked on the kick-off at 0.8, 2 and 4.5 s.
- 2026-10-08. Toolkit pin `12aa015` (full-frame dust, the dark-clip fix,
  `advance-on-end`). The kick-off clip uses `advance-on-end`: the cut ends on a
  lit frame as the music fades, and the next slide is the LHCb photo the
  spoken line introduces. Undo: drop the attribute and press → by hand.

- 2026-10-08. The signature line (owner): „nuo vieno susidūrimo iki
  petabaitų“. After the clip, one real Z → μμ event from LHCb open data (CERN
  Open Data record 24506, file 00041836_00076811_1.ew.dst, entry 3795, run
  133488, event 49420610; 76 of 95 tracks, 3× transverse stretch). On the next
  slide it shrinks into one grain among many that pack into the 1 TB sphere.
  Then 800 TB and 4 PB open (gold) appear inside LHCb's 100 PB (blue) and the
  LHC's exabyte (steel). Then the finds, the users, Vilnius, Dominykas, and the
  group as portraits of grains under „Ačiū“.
  - The cavern photo and the Run 3 event-display photo were dropped; the owner
    can ask for them back.
  - The text rises after the motion (`.late` 2.6 s; `.later` 4 s on the
    collapse). The corner key is gone; the 1 TB line names the unit.
  - Dominykas: his own thesis plot (Fig. 17, sideband-subtracted m(J/ψ p),
    VU 2026, open access), inverted to light on dark, with `PeakRise` lifting a
    pentaquark out of its 4.4–4.5 GeV peak. Notes keep the thesis's framing:
    a qualitative reproduction.
  - Portraits: the members' own photos, used with permission (owner). Credit:
    „Photos: LHCb Vilnius group members, used with permission“. Margarita
    Biveinytė's photo was confirmed on 2026-10-09 (below).

- 2026-10-09. The owner's answers (via the Scheduler):
  - The photo is Margarita Biveinytė's: she stays in the ring. The alt text
    on the group's People page, which names someone else, is a slip on the
    site.
  - The closing line drops „koordinuojame šį darbą kolaboracijoje“: the
    nomination names only preparing the data release and using the data for
    research and teaching in Vilnius. It now reads „Mus nominavo už tai, kad
    parengėme LHCb duomenis paskelbti ir patys juos naudojame tyrimams ir
    mokymui Vilniuje.“ The clause was never on screen. The 800 TB slide's
    notes still say, as a fact about the role and not the nomination, „Nuo
    šių metų rugpjūčio koordinuoju visos kolaboracijos analizių išsaugojimo
    ir atvirųjų duomenų darbus.“
- 2026-10-09. The „Ačiū“ ring moves like particles (owner). The portraits
  run round the ring like a beam, push one another away at a distance (a
  charge-like 1/d² push, so the ring keeps its spacing rather than queueing
  behind its slowest), bump as discs with friction (a glancing hit turns a
  face; a soft torque rights it), now and then one sprints into its
  neighbour, and where two meet a few gold grains fly out of the contact.
  - Code: `setup/ring.js` (pure, seeded, fixed 1/120 s steps on the engine
    clock, so a recording or a still repeats exactly); the `portraits`
    builder takes `motion` (one Group per person, moved by the sim) and
    `sparks`. Settings in space.json: speed 0.9, charge 6, dashBy 2, seed 7.
  - Everything is solved in the picture plane as the camera sees it from
    `view: 27` (the „Ačiū“ pose's dist): solved in the scene's plane, faces at
    different depths overlapped on screen by up to 75 % (seen on the first
    recording). `title`/`keepOut` keep the discs clear of „Ačiū“; `frame`
    [19.8, 11.0] keeps them inside the 16:9 frame with the idle sway.
  - Offline, 3 seeds × 180 s: about 5 bumps per 10 s, the first at 5.6 s; no
    on-screen overlap; at most 3–4 discs bunched; title clearance ≥ 0.7
    units beyond a disc's edge; edges within 89 % of the frame.
  - Reviewed by four reviewers, each finding checked by a skeptic. Fixed:
    sparks draw after the faces (`renderOrder = 1`; three's transparent sort
    used a key frozen at the group origin, so the faces covered or showed
    the bursts with the camera's sway); a reload or a link straight to
    slide 13 now gathers the ring (before, with `onEnter`, nothing did).
  - Undo: drop `motion` from the portraits object in space.json (the faces
    stand still at their `at`s again).

## Open

- The pinned shots tool (`talk ready`'s shots) waits a fixed 4.2 s of real
  time per slide; on SwiftShader the engine clock runs far slower, so its
  slide 13 catches the flight in (no ring yet, or the ring off centre). The
  record tool (a fake clock) shows the closing slide as it plays.

- Specks: gone on shots v12 (confirmed on a full-resolution crop of slide 7).
- Opened directly at slide 7 (a deep link or a reload), the piles never
  appear; navigating there from earlier slides works. Cause not found yet:
  `onSlideEnter` does fire on first load (Slidev uses watchEffect).
- The 100 PB pile reads flat and matte from far (a review finding). It needs
  shader work: a rim, edge fade, specular at small sizes.
- Perspective stretch: the piles at the right edge stretch about 14 % (the
  50° lens). Fixing it needs a toolkit change that scales point sizes by the
  field of view.

## Owner questions

- Slide 11's and Dominykas's plots keep their published English axis labels
  and legend (accepted by the owner via the Scheduler).

- Which award is it, and on what date? (The facts bank has VU's open science
  award: group nominations allowed, winners honoured in International Open
  Access Week, late October.)
- Was N. E. Eimutis's Z → μμ work (Open Readings, April 2024) a thesis? Until
  that is known, the notes say not to call Dominykas's thesis the first.
- Dominykas's official thesis title, defence date, data and any result.
- The opening 3D clip is a flat-shaded CAD render beside photographs. Keep it
  or replace it?
