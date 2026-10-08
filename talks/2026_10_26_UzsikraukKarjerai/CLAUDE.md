# Užsikrauk karjerai — „Vadovėlio gale atsakymo nėra“

## Brief

- Event: „Užsikrauk karjerai“, Delfi conferences team with Lietuvos Junior
  Achievement, for grades 9–12 (LJA lists 8–12).
- Filmed in the Delfi studio, Vilnius, on 26 Oct 2026, 16:00–18:00, with no
  audience; streamed to classrooms on 27 Oct 2026 at 12:00.
- Lithuanian, 10–15 minutes (this deck: about 10).
- The organisers' ask: real stories over conference talks; you don't need to
  know now what you will be; notice what interests you and dig; what working
  on questions with no textbook answer is like.
- Delivery (owner, 2026-10-08, replaces the earlier broadcast brief): **a
  private event delivered online, not TV.** No TV safe area, logo corners,
  `safe` check, Delfi questions, per-slide MP4s for a broadcaster or a
  2.5 Mbit/s gate. Keep: type readable on a laptop or a classroom
  projector showing a stream, and no ultra-fine dust that video
  compression smears. The normal stage look is allowed again. No sources
  on slides and no reference lists required; facts must still be true.
- Owner's steers: "doesn't have to be my life story"; the first version was
  rejected for too many slides, AI-sounding lines and a broken story; the
  second for incoherent flow and washed-out visuals ("more striking but not
  synthetic, not sloppy, photorealistic").
- Banned: slogan cards, "X, not Y" antithesis, unsourced numbers, anything
  from the speaker's private documents in git.

## Story (fifth version after the owner's review, 12 slides, about 7 min)

Approved outline: `notes/outline-v5.md` with its two change sections
(owner, 2026-10-08). The viewer sits in the physicist's seat.

| # | Screen | Picture |
|---|---|---|
| 1 | title, name | the five-quark form gathers (hero, `quarks`) |
| 2 | „Ar čia dalelė?“ | `th1` fills: 140 dots, a chance bump at 1,54 GeV (illustration) |
| 3 | 2003 m. · „Paskelbta, kad tai dalelė“ | same |
| 4 | 2008 m. · „Surinkus daugiau duomenų kauburys išnyko“ | `th2` fills: 3 500 dots, smooth (illustration) |
| 5 | (clip) | LHC tunnel footage |
| 6 | (photo) | LHCb cavern, StagePhoto: what LHCb studies and why |
| 7 | „Vienas susidūrimas LHCb detektoriuje“ | LHCb Run 3 event display, StagePhoto: how a collision becomes a dot |
| 8 | 2015 m. · „LHCb duomenyse iškilo smailė“ → 2019 m. · „Trys pentakvarkai“ | `jp`: LHCb's real 2019 m(J/ψ p) bins fill; ticks over the three peaks |
| 9 | „Šimtus kartų daugiau duomenų nei 2003 m.“ | the full LHCb histogram, camera back |
| 10 | city labels | the route across Europe |
| 11 | three things to do this school year | the form far off, dimmed |
| 12 | „„Ko jūs savo darbe dar nežinote?““ alone | the form, held |

## Status

- 2026-10-08 (late night): **complete, pending the owner's review.** Fifth
  version deployed as main 336e0ea (Pages run 37830786185 green; the talk
  URL returns 200). After it, a final text round on the branch, not yet
  deployed: my plain-text pass, a native-Lithuanian editor (26 findings),
  an independent verifier (accepted, corrected or rejected each, found 5
  more, checked facts on the web) and the Scheduler's audit of 336e0ea (25
  findings); merged, lint --release 0 errors, check/build ok. Redeploy
  after OpenData's turn (tell the Scheduler first).
- Timing: about 600 spoken words, so about 6 min of speech; with the fills,
  pauses and the tunnel clip about 7½–8 min against ~10. Not padded; the
  speaker can add his own account on slides 9 and 12.

- 2026-10-08 (night): **fifth version built on the branch, not deployed.**
  Pinned to slidev-videos v0.5.0. A `histogram` builder (setup/grains.js)
  fills a distribution grain by grain, one grain per entry, easing (fast
  first), and lights `marks` bins once full. Data: `public/data/jpsip-2019.json`
  (HEPData ins1728691 Table 2), `theta-toy.json` and `search-toy.json`
  (illustrations, seeds inside). Broadcast look and TV type floors removed.
  Lint --release 0 errors; check/build ok. Recorded and reviewed: slide 7
  (sheet sent to the Scheduler), slides 2–4 and 10, stills of all 14.
  Next: verify the fixes on 1, 7, 9, 10, then `talk ready`, the owner's go,
  `talk deploy` (tell the Scheduler first).
- Renders: `PLAYWRIGHT_BROWSERS_PATH=/var/tmp/misarpis/ms-playwright
  RENDER_SRUN_ARGS="-p gluon_primary --ntasks=1 --cpus-per-task=16"` while
  photon drains (else `-p photon_primary -c 16 -n 1`); output under /home.

- 2026-10-08 (late): **stopped before deploy; fifth storyline proposed.**
  The owner does not see enough meaning in the fourth version (a
  chronology from the speaker's side). `notes/outline-v5.md` puts the
  viewer in the physicist's seat: judge a real bump (2003 yes → 2008 no →
  2015 yes), his „Neradau.“, what the job trains, three things to do this
  year, the closing question. **Awaiting the owner's approval; build
  nothing until then.** Pending after approval: pin to slidev-videos
  10ad67f (`talk pin … --allow-sha`), undo the TV-only deck settings,
  prototype the histogram on the 2015 slide and send a frame sheet; renders
  on photon (`RENDER_SRUN_ARGS="-p photon_primary -c 16 -n 1"`,
  `PLAYWRIGHT_BROWSERS_PATH=/var/tmp/misarpis/ms-playwright`, output under
  /home).
- Findings on the fourth version kept for the build: shots need `--wait
  30000` under SwiftShader (at the default 4.2 s the map and trail had not
  drawn); at 30 s the map draws but slide 11 (haystack) stayed blank and
  the cover's clusters were near-invisible; every world-only slide needs
  something on screen before the grains arrive.

- 2026-10-08 (evening): **fourth version, on the branch, not deployed.**
  The owner's order (relayed by the Scheduler): coherence first, plain
  prose, visuals free within the TV rules, then deploy for review. The
  matter/antimatter frame and the open-data slide were cut so the talk has
  one question, his own (see Decisions). 16 slides; spoken script about
  760 words (7–8 min) plus the tunnel clip; `duration: 12min` in the
  headmatter (the brief allows 10–15). Checks run: `talk_lint.py --release`
  (from origin/feat/facts-lint) 0 errors, 3 false-positive LT-DECIMAL on
  pose coordinates; `pnpm talk check` ok (videos:check, stage:check, build).
  **Not yet seen:** no shots of this version. The render slot has no
  Chromium on the cluster (Tools is fixing it); the cover at `quarks`, the
  2008 scatter (quintet step 2, first use) and the close over the map are
  unverified.
- Next: once Chromium works, `pnpm talk review` (contact sheets to a
  subagent), fix what reads badly, then `pnpm talk ready` and, when the
  Scheduler calls the order and the owner has asked, `pnpm talk deploy`.
  Then the speaker's answers (Figures below) and Delfi's (Brief).
- Earlier: third version deployed as main 047fe53 (Pages run 37779392470);
  a3001a1 and 71fb6f1 before it, all rejected by the owner.

### Handoff (2026-10-08, workstation session ended; the owner moved to the HPC cluster)

- **Owner's rework state.** Third version deployed (main 047fe53). The
  owner's last verdict, on the second version, was "the story telling and
  the flow is not coherent; visuals good but a bit washed out, needs to be
  more striking but not synthetic not sloppy, photorealistic". This third
  version answers that (one chronological thread, real photos/footage/plots,
  near-black ground) but the owner has not reviewed it yet.
- **Branch ahead of main, not deployed** (this commit): denser coastline
  grains (Natural Earth points every 0.07°, size 4, alpha 0.8), a dull straw
  haystack (`hayColor` #8f7d55) so the white-gold "method works" cluster on
  slide 12 stands out (`dance`: #ffe08a, larger, delay 6 s), CERN label 8 px
  right. Unverified: headless shots on the slow software clock caught slides
  6 and 12 mid-assembly. Verify the end states with the recorder on its exact
  clock (`slidev-stage-record dist out --slides 6-6 --fps 10 --size 1280x720
  --hold 14 --gl auto`, then the same for 12 with `--hold 22`; take the last
  frame), then deploy if they read.
- **Next step.** The owner reviews the deployed deck (story and look); then
  the speaker's [PATIKSLINTI] items (re-listen to the transcript quotes,
  confirm the after-school courses, the Glasgow job and the laser work, why
  he left particle physics, the "known particles" plot, the 2022 slide) and
  Delfi's answers (feed type, squeeze size, 25p/50p, who advances slides,
  logo/super/clock positions, files in advance).
- **Pin.** slidev-videos `feat/broadcast` efacca2 (both addons), not yet a
  release. Move to the release tag once the toolkit integration lands
  (`pnpm talk pin` when the talk CLI is on main), re-run `slidev-stage-safe
  --broadcast` and reshoot.
- **Filming.** Delfi studio, Vilnius, 26 Oct 2026 16:00–18:00, no audience;
  streamed to classrooms 27 Oct 2026 12:00. Laptop at 1920×1080, 50 Hz,
  silent; a clicker. Record per-slide MP4s and plates as a backup before
  the day.

## Decisions

- 2026-10-08 — Owner, after reviewing the deployed version: an LHCb
  introduction before 2015 (slides 6–7, real photos), the search and
  „Neradau.“ removed, „Ko išmokau“ removed. The event display is © CERN /
  LHCb (educational, non-commercial): used because the event is private
  and online; listed under Figures for the owner to confirm. Undo: restore
  01bed17's deck.md and space.json.

- 2026-10-08 — Final text round, facts corrected: LHCb found the Pc peak
  while studying a Λb⁰ decay (not a pentaquark search); in 2019 the 2015
  peak split in two and a third appeared (not "split into three"); about a
  billion collisions a second (not "millions"); about three in four CERN
  alumni now work outside research and education, most often in IT (CERN
  socio-economic study 2026, §5.4; the "three-quarters move into industry"
  line had no source). The masterclass is "šiais mokslo metais", „vasarį ar
  kovą“, not „kasmet“ (only 2026 confirmed). Rejected from the audit: „milijonai
  susidūrimų“ (understates), „išryškėjo trys“ (loses the split), a new
  sentence on slide 9 (adds content). Full list:
  /home/misarpis/talks/.cache/uzk-review/text-changes-raw.diff.

- 2026-10-08 — Slide 7 fills LHCb's 2019 bins (the 2015 paper's are not on
  HEPData); the line changes from „2015 m. – taip.“ to „2019 m. – trys.“ as
  the peaks light (Scheduler's review), so screen, data and words agree.
  Undo: label it 2015 only and drop `marks`.
- 2026-10-08 — Slides 2–4 and 10 are illustrations, declared in the notes
  and spoken as „toks grafikas“: HEPData has no Θ⁺ data, and the thesis
  plot is not public. Replace `search-toy.json` with the real histogram if
  the speaker gives one.
- 2026-10-08 — Dropped: the 2022 plans slide (owner), the 1964 portraits,
  the separate 2019 slide, the empty-histogram slide (merged into
  „Neradau.“).

- 2026-10-08 — Not TV (owner): broadcast rules dropped from the brief;
  TV-only deck settings (`look: broadcast` overrides, safe-box CSS) stay
  until the fifth storyline is approved, then go. Undo: the old Brief in
  git history.
- 2026-10-08 — Fifth outline opens on the bump (viewer decides) rather
  than on the antimatter question the Scheduler proposed: one question
  followed to the end, as the second version was rejected for jumping
  between two. Alternative kept in the outline: swap slide 1 for the
  antimatter opening.
- 2026-10-08 — Closing slide is its one line alone (owner's rule): no
  kicker, name or URL under the question.

- 2026-10-08 — One question, the speaker's own: pentaquarks. Cut the
  matter/antimatter opening (old slides 1–3, the `origin` station with its
  `pairs`), the open-data slide (old 15) and the NGC 1300 close (old 18–19).
  Why: the owner found the third version "not coherent"; it opened and
  closed on one question and spent its middle on another, and open data was
  a side branch. The route moves to the start, so the PhD hands him the
  question and its history runs straight into his task. Matter vs
  antimatter survives as one clause on the LHCb slide. Alternatives: keep
  matter/antimatter as the frame (the third version), or open on the
  pentaquark history and put the route after 2019 (a detour between the
  2019 plot and his task). Undo: restore 0469677's deck.md and space.json.
- 2026-10-08 — The 2003 and 2008 beats are two slides with a sentence each
  („Paskelbė, kad rado.“, „Paaiškėjo, kad jo nėra.“) instead of one
  telegraphic card („2003 – rasta / 2008 – nėra“); the quintet's
  retraction step (2) is used for the first time. Slide 13 now ties his
  „Neradau.“ to that check. Undo: merge slides 5–6 back.
- 2026-10-08 — The hero station is `quarks`: the cover shows the five
  scattered clusters that slide 4 names. The close sits on the map with
  the whole route drawn, dim 0.6. Undo: `hero` in space.json.
- 2026-10-08 — Open items moved out of the notes into Figures below
  (`[PATIKSLINTI]` and `[ASR]` marks fail `lint --release`).
- 2026-10-08 — Credit lines 16 → 18 px (the lint floor).
- 2026-10-08 — Unslop pass (unslop 1.8.4 check mode on `talk_copy.py`'s
  packet, structure and rhythm only, with `docs/unslop-lt.md` from
  origin/feat/unslop). Fixed in the spoken script: the colon reveal on
  slide 12 („atsakymas buvo toks: neradau.“ → „Ieškojau ketverius su puse
  metų ir neradau.“); the realization coda on slide 13 („Mano darbas buvo
  toks pat patikrinimas.“, replaced by the concrete 2008 parallel); the
  maxim on slide 16 („Svarbiau bandyti įvairius dalykus“, replaced by what
  he tried: business, psychology, the manager's job in Glasgow); two
  unsupported "all"s (slide 6 „visi šios srities fizikai“, slide 13 „visi
  sužinojo“). Kept on purpose: the three short screen sentences („Paskelbė,
  kad rado.“, „Paaiškėjo, kad jo nėra.“, „Neradau.“) are the deck's one
  rhyme, not a slogan cadence; „Ir pažiūrėk, kas iš to išeis.“ is a plain
  spoken instruction. No facts were added; no gaps found beyond Figures.

- 2026-10-08 — Story as one chronological thread with the opening question
  as a frame (rather than question-first with a separate biography): the
  second version jumped from matter/antimatter to pentaquarks with no link.
  Pentaquarks now enter as the PhD task. Undo: restore 71fb6f1's deck.md.
- 2026-10-08 — Real footage of the LHC tunnel replaces the grain collider
  ring; real LHCb plots (2015, 2019, CC BY 4.0) carry the discovery; plots
  are inverted to light-on-dark and screen-blended, so no white sheet flashes
  on air. Undo: remove `img.plot` from slides 10–11.
- 2026-10-08 — Pinned to `feat/broadcast` (not yet released) for the
  broadcast look, `safe` and `record`. Move to the release tag once it
  exists (`pnpm talk pin` when the tooling lands).
- 2026-10-08 — `lift` 0 and `nebula` 0 instead of the look's 0.07 and 0.3:
  the owner found the second version washed out, and a visual review
  measured the ground at about RGB(28,42,72). The toolkit measured more
  banding at lower lift (4.5 % of gradient blocks at 0.07, 8 % at 0), but
  with no nebula there are few gradients left; check a test encode at
  2.5 Mbit/s before the filming. Undo: drop the `options` overrides.
- 2026-10-08 — City names on the map are HTML labels at positions projected
  from the `whole` pose (target europe + [1, 0, −3], dist 36, yaw 0, pitch
  60, sway 0). If that pose changes, recompute them.

- 2026-10-08 — Real photographs where the story names something real: the
  LHCb cavern (Rosa Menkman, CC BY 2.0), Gell-Mann (Joi Ito, CC BY 2.5),
  Zweig (Peacearth, CC BY-SA 4.0), NGC 1300 (NASA/ESA/Hubble Heritage, CC BY
  4.0); credits on screen and in `credits.txt`. CERN's own CDS photos were
  not used: the reachable record says non-commercial, and Delfi is
  commercial. The grain galaxy station is gone (the Hubble photo replaces it).

## Figures and open items (for the speaker)

- Licences to confirm for this event: the LHC tunnel clip
  (CERN-FOOTAGE-2022-013-001) and the LHCb event display (slide 7), both
  CERN material for educational, non-commercial use.

- Length: the script is about 7–8 minutes spoken; the brief allows 10–15.
  If the speaker wants more, slide 11 (what a working day is like) is where
  the organisers' ask is; it needs his own account, not invented detail.
- Re-listen to the transcript quotes, all from automatic transcripts: LRT
  „Širdyje lietuvis“ 2024 at 03:11, 04:36–05:03, 06:15, 07:36, 11:12;
  Mokslo sriuba podcast #62 at 00:39, 32:39.
- Confirm: the after-school courses (names; slides 2 and 16); the Glasgow
  job as worded; "dirbau su lazeriais" and why he left particle physics
  (one phrase, slide 3); whether the plot after two years showed known
  particles from the same analysis and whether "mano būdas veikia" is his
  wording; "sugalvoti" alone or with the team (slide 11); "kartu su
  kolegomis kūrėme" (slide 15); showing the 2022 slide (slide 14); the
  CDS licence of CERN-FOOTAGE-2022-013-001 for a commercial broadcaster.
- Ask Delfi: feed type and squeeze-back size; files in advance and format;
  25p or 50p; who advances slides; confidence monitor; logo/super/clock
  positions; flash check.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_26_UzsikraukKarjerai/` — „Vadovėlio gale atsakymo nėra“, an
  ~10-minute Lithuanian talk for grades 9–12 at „Užsikrauk karjerai“ (Delfi ×
  Lietuvos Junior Achievement), filmed in the Delfi studio on 26 Oct 2026
  with no audience, streamed to classrooms on 27 Oct 2026 12:00. Built for
  television on the packaged stage (same `640eaa5` pin), its own violet-gold
  palette and six talk-owned builders. See "Užsikrauk karjerai" below.

### Užsikrauk karjerai (2026_10_26_UzsikraukKarjerai)

Fifth version (2026-10-08), 14 slides, about 10 minutes, online (not TV;
the TV rules below are history). The viewer judges a bump: a histogram
fills grain by grain (2003 yes, 2008 no as illustrations; LHCb's real 2019
J/ψ p bins from HEPData on slide 7, the three peaks lighting up), then the
speaker's search fills with no peak („Neradau.“), what the work trains, the
route across Europe, three things to do this year, the closing question.
Outline: `notes/outline-v5.md`; the talk's own `CLAUDE.md` holds status and
decisions. Pinned to slidev-videos v0.5.0. Talk-owned builder `histogram`
(`setup/grains.js`): one grain per entry, random order, easing fill,
`marks` bins light once full.

- **Television rules** (research 2026-10-07; from the event's past
  recordings and broadcast standards): Delfi/LJA showed slides squeezed to about two-thirds
  of the frame in past editions and stream at ~2.5 Mbps, watched on classroom
  projectors. So `styles/index.css` sets readable text ≥ 49 px on the 980
  canvas (96 px at 1080p), big lines 58–80 px, numbers 130 px, all inside
  x 98–882 / y 55–408 and out of the logo/name-super corners; the headmatter
  turns off film grain, aberration, halos and sound and sets fewer, bigger
  dust grains, a low nebula and slower flights (`options: { grain: 0,
  aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom:
  0.45, flight: [2.5, 5] }`); the grains' twinkle is slow and shallow. Laptop
  output 1920×1080 at 50 Hz. No full-frame flashes (ITU-R BT.1702).
- **Stations** (one axis, 300 apart, so only one is ever in frame): `quarks`
  (hero; `quintet`), `search` (`ghost` with a haystack,
  `streams` `dance` and `phantom`), `europe` (`map`, `path` `route`: Vilnius →
  CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius; pose
  `whole`, no sway, with HTML city labels projected from it).
  `stage.options.reach: 22`. The clips and photos cover the world on their
  slides; the collider ring, the grain galaxy and the `origin` station with
  its matter/antimatter `pairs` are gone.
- **Talk-owned builders** (`setup/grains.js`, `stage:check --types
  path,streams,pairs,ghost,map,quintet`), all driven by `<Grains :set>`:
  - `pairs` — matter (gold) and antimatter (blue): 1 the hot cloud forms, 2 the
    pairs meet and go out as light (outer first; brightness only falls), 3 the
    remainder gathers into a knot. Forward one step plays it, anything else
    shows the step settled; an arrival from elsewhere (or `c`) replays up to
    the current step unless a step started under 5 s ago.
  - `quintet` — five clusters joined by flowing strings; per-step `{ hold,
    light }`: idea (scattered), claim (half-held, dim), retraction (scattered),
    discovery (held, bright).
  - `ghost` — faint clusters that come together and drift apart, never
    holding; `hay` adds a wide faint cloud round it; with a `name`, step 0
    hides the clusters and step 1 lets them appear (the single „Neradau.“).
  - `path` — a Catmull-Rom trail through ≤ 16 waypoints, drawn on to waypoint
    k, each leg arcing off the ground (`arc`); a waypoint at the same place as
    an earlier one relights that cluster instead of stacking a new one.
  - `map` — Europe's coastline and land borders as grains on the ground plane,
    from Natural Earth 1:50m (`scripts/make_europe.py` → `public/data/
    europe.json`; one unit = one degree of latitude, x scaled by cos 52°).
  - `streams` — OpenData's, with a per-stream `from` (many places to one).
- `setup/Count.vue` prints Lithuanian numbers: a narrow space from five digits
  up, none in years (`:group="false"`), decimal comma.
- `public/figures/planai-2022.jpg` is the speaker's own LPPM 2022 slide (p. 16
  of the public MSarpisIntro.pdf on Indico).
- Shots: `stage:shots --wait 30000` under SwiftShader.
