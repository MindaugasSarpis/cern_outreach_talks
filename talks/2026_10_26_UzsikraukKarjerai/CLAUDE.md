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

## Story (fifth version after the owner's review, plus ideas 1, 3 and 7: 13 slides, about 8 min)

Approved outline: `notes/outline-v5.md` with its two change sections
(owner, 2026-10-08). The viewer sits in the physicist's seat.

No text on screen but numbers (owner, 2026-10-10): no titles, kickers,
statements, captions, labels or credits; the speaker narrates from the notes.

| # | Screen | Picture |
|---|---|---|
| 1 | — | the five-quark form gathers (hero, `quarks`) |
| 2 | — | `th1` fills: 140 dots, a chance bump at 1,54 GeV (illustration) |
| 3 | — | same |
| 4 | — | `th2` fills: 3 500 dots, smooth (illustration) |
| 5 | — (clip) | LHC tunnel footage |
| 6 | — (photo) | LHCb cavern, StagePhoto: what LHCb studies and why |
| 7 | — (photo) | LHCb Run 3 event display, StagePhoto: how a collision becomes a dot |
| 8 | — (one click, `clicks: 1`) | `jp`: LHCb's real 2019 m(J/ψ p) bins fill; ticks over the three peaks at the click |
| 9 | the counts alone: „140“ · „27 292“ | `jx`: the 140-entry plot of slides 2–3 at LHCb's scale beside `jp` (one grain per entry, the same bin width and height per entry); a coordinate pose between them |
| 10 | — | the route across Europe |
| 11 | — | the map close on Vilnius and the arcs to CERN: the working day (idea 7), in the speaker's own public words |
| 12 | — | the form far off, dimmed (the three things are said, not shown) |
| 13 | — | the form, held (the question is said, not shown) |

## Status

- 2026-10-09 (latest): **deployed 1ed62a9** under the owner's standing deploy rule
  (set in this talk's session before this round): slidev-videos v0.7.0, the
  batch round. Stills are at each slide's last click, and main 9dc21bd is merged.
  `talk ready` passed with nothing skipped. Pages run 37988984512 green, live walk
  passed for 13 slides, URL 200. Still open for the owner: their moments for
  slide 11, the licences of the event display and the tunnel clip, the 2027
  masterclass date and the BL4S call.

- 2026-10-09: **deployed 852e96a** on the owner's go: slidev-videos v0.6.8
  (the phone washout fix: the talk's builders return a frame-relative
  `frameScale`, so grains keep their size on a high-density screen; laptops
  unchanged) and main be73ad6. `talk ready` passed with nothing skipped. Pages
  run 37984117962 green, live walk passed for 13 slides, URL 200. Still open for
  the owner: their moments for slide 11, the licences of the event display and
  the tunnel clip, the 2027 masterclass date and the BL4S call.

- 2026-10-09: **deployed a9269bf** on the owner's go: slidev-videos v0.6.7
  (the iPhone NaN guard) on top of the v0.6.6 move. Pages run 37964270854 green,
  live walk passed, URL 200. Open for the owner: their moments for slide 11
  (relayed by the Scheduler), the licences of the event display and the tunnel
  clip, the 2027 masterclass date and the BL4S call.

- 2026-10-09: **deployed a8b4f46** on the owner's go (Pages run
  37947797885 green; the deploy's live walk passed; URL 200). It holds round 2,
  the PDF print fix (every line prints; checked on a rasterised PDF) and main
  ef5b903. Next: the move to slidev-videos v0.6.4 (stills again, the cover
  timing check), then the owner's moments for slide 11.

- 2026-10-09: **round 2 complete on the branch, awaiting the owner's go.**
  It holds v0.5.4, slide 9 (ideas 1 and 3), the review fixes, no gold text, and
  the working-day slide 11 (idea 7, lines 1–4 of the owner-approved draft).
  Open for the owner: one or two moments of their own for slide 11 (a plot, a
  check, CERN), relayed by the Scheduler. Add them to slide 11's notes when they
  come, and invent none. Still open: the licences of the event display and the
  tunnel clip, the 2027 masterclass date and the BL4S call.

- 2026-10-09: **deployed f2eecec** on the owner's go (Pages run
  37924290671 green, URL 200; in headless Chromium on the live site slides
  6 and 7 load both photos, ~/talks/.cache/uzk-review/livecheck). It is the
  photo fix below, slidev-videos e5d05a9, the lockfile regenerated after a
  merge had taken main's (which named this talk's v0.5.0), and origin/main
  b5e8a75. `talk ready` passed on it with nothing skipped. Still open for
  the owner: the licences of the slide 7 event display and the tunnel clip,
  the ~7 min length, slide 2's ~8 s before the plot appears (the long flight
  from the cover), the 2027 masterclass date and the BL4S call.

- 2026-10-09: **the live 00ade4a has no photos on slides 6–7**
  (the Scheduler's render): StagePhoto in v0.5.0 ignores the Pages base, so
  `/figures/photos/…` 404s at the domain root. Fixed on the branch (b59572e)
  with relative sources, checked on a `--pages` build served under the real
  subpath. Awaiting the owner's go to redeploy. Pinned slidev-videos e5d05a9 (5d7e786 plus the two lost-context fixes this review found); first 5d7e786
  (v0.5.3: device quality tiers, lost-context rebuild, StagePhoto under the
  base; its assetUrl leaves relative paths alone). Checked on that pin: the
  `--pages` photo check again; recordings of slides 1–4, 8 (+click), 9, 10
  (~/talks/.cache/uzk-review/v053), and slides 2 and 10 frame-identical to a
  v0.5.0 build (v050, ab-02.png, ab-10.png). A review workflow of the
  toolkit diff found only minor effects, all after a lost WebGL context:
  plots refill from empty (slide 8's ticks after ~22 s), one quality tier
  lower until a reload, softer bloom under 1280 px. Reload the page if the
  console says "stage: context lost".

- 2026-10-09: **deployed 00ade4a** (Pages run 37901453790 green,
  URL 200; the live bundle carries slide 9's new line, the slide 7 event
  display and the dimmed-not-burnt peaks). It is 29347fa (the last review:
  a dot is a computed mass, no unsourced ratio) with origin/main 7163101
  merged. `talk ready` passed: lint --release 0 errors, check, build, shots,
  preflight, venue. Open for the owner: the licences of the slide 7 event
  display and the tunnel clip, the ~7 min length, the 2027 masterclass date
  and the BL4S call.

- 2026-10-08 (night): **complete, pending the owner's review; on the
  branch, not yet deployed.** After the owner reviewed 01bed17 (live, run
  37832082933): an LHCb introduction (slides 6–7), the search, „Neradau.“ and
  „Ko išmokau“ removed; then the confirmed findings of the final talk-review
  workflow (6 lenses with verifiers) applied. Recorded on the exact clock
  and checked: slides 6–8, 10, 11 (sheets in ~/talks/.cache/uzk-review/v6,
  v8r, v9r). `talk lint --release` 0 errors; check/build ok. Merged
  origin/main (tooling, 9f7cea0). Next: redeploy when the Scheduler calls the
  turn (after OpenData and Innoday).

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

## Decisions

- 2026-10-10 — No text on screen but numbers. The owner: "No titles, statements -
  I will be there. Don't need newspaper-like titles. What can stay is the
  numbers. I will narrate myself." Then: "Don't do the small photo credits,
  it's cern license, I'm CERN user." (both relayed by the Scheduler; the first
  is the root house rule, main 1016ce2). Gone: the cover's kicker, title and
  name; every slide line and year kicker (2003, 2008, 2015, 2019 m.); slide 7's
  caption; the map's city names (slides 10 and 11); slide 12's three lines
  (the opendata.cern.ch address with them); slide 13's question; the two text
  scrims; the three credits. Kept: slide 9's two counts as bare numbers („140“, „27 292“: „taškai“ is a word, not a short unit, so the speaker says it), the notes, and every
  camera pose and dim. Slide 8 keeps its click (`clicks: 1`): the ticks light at it.
  Notes changed only where they described text that is gone (slide 1's
  „Šalia pavadinimo“ → „Ekrane“, and the Picture lines of 1, 8, 9, 11, 12 and
  13). Provenance stays in `credits.txt`. The slide 6 cavern photo is not
  CERN's (Rosa Menkman, CC BY 2.0, which asks for attribution); that is with
  the owner. The CSS for the removed text (`.say`, `.city`, `.photo-credit`,
  `.scrim-left`) is left in place, unused.

- 2026-10-09 — slidev-videos v0.7.0 (stage 0.4.0, from v0.6.8), the batch round
  the owner chose. Its new `unsaid-clock` warning stays quiet here: histogram,
  path and quintet already report `api.busy` (v0.6.6 below). A copy of
  grains.js with `busy` removed makes the check flag those three, so it does read
  them. `pairs` and `streams` still have no `busy`, but no station uses them; give
  them one if a slide ever does. `--stills` now shoots each slide at its last
  click, so all 13 stills are retaken with plain `--stills`. 08 is at click 1
  (marks lit), as print shows it, and the special 08 is gone. v0.6.9's dust fix
  only skips a frame copy for the tunnel clip, which comes from the release (its
  strip stands in, as before).
- 2026-10-09 — slidev-videos v0.6.8: grains sized to the frame. The talk's builders
  (histogram, path, quintet, map, pairs, ghost, streams) return their
  `uPixelRatio` as `frameScale`, so the engine keeps it at the buffer's height
  / 900 instead of the device pixel ratio. At 1600×900 the stills keep their
  mean brightness to within 0,05 of a level. At phone size (844×390 and 390×844
  viewports, the same grain-to-slide ratio as an iPhone 13 at ratio 3), the
  LHCb heap no longer saturates to flat yellow, and the ticks and map lines stay
  fine (~/talks/.cache/uzk-review/phone/landscape-ab.png).
- 2026-10-09 — slidev-videos v0.6.6 (from v0.5.4). Shots settle on the engine's clock,
  and a station counts as assembled only when its last form finishes. Print holds
  each animation at its end state, so the talk's own `animation: none` print rule
  is gone. The talk's builders report `api.busy` (histogram: armed, filling or
  lighting its marks; route: armed or drawing; quintet: gathering), so
  `--stills` waits for them. Stills 01–07 and 09–13 are retaken with plain
  `--stills`. 08 is the settled one with the marks, because print shows slide 8 at
  its last click and `--stills` shoots click 0 (sent to Tools). Checked:
  - a rasterised PDF: 13 pages, all text, 3,3 MB;
  - a 12 fps recording: the cover title is up at 0,5 s and the pentaquark gathers
    by about 3 s; slide 8's ticks light at the click;
  - the click test.
- 2026-10-09 — No gold text (the owner: gold letters read as AI design). Every kicker,
  including the year kickers, is one light blue (`--kk-kick`, #8fb2ff from the
  palette). Emphasis, numbers and labels are white. Gold stays only in the world,
  where it is matter: the plots, the route and the pentaquark. The peak ticks
  were already white.
- 2026-10-09 — Focused review of slide 9 and the state code (talk-review on 52a64e7,
  since c211acd; 5 lenses, verified). Applied:
  - the cover pentaquark gathers on a fresh load (it used to appear formed);
  - a reload on a plot slide fills from empty, with no full plot flashing first;
  - slide 8's peak ticks light at the click with „Trys pentakvarkai“
    (`markStep: 2`, jp steps [0, 1, 1]; `<Grains :clicks>`, also when a slide is
    entered at its last click);
  - slides 5–7 set jp 0, so 8 → 7 → 8 fills again;
  - the route on slide 10 draws once the camera has arrived (`.city.late` 8,5 s);
  - slide 9's labels say „Kaip 2003 m. · 140 taškų“ and „LHCb, 2019 m. · 27 292
    taškai“. Its spoken text no longer implies that 4,6σ failed for being under
    5σ: other 2003 bumps were reported near 5σ and still went away. It says the
    bump vanished with more data, and that LHCb's peaks held with nine times
    more;
  - copy on slides 1, 2, 7 and 8 (rigour on slide 7: the computers give the mass
    a parent would have had, not which particle it was).

  Not applied:
  - an on-screen „Atradimui reikia 5 σ“ line: it would put the misleading
    comparison on screen, and the approved idea had the speaker say it;
  - CLAS's 5,2σ: not in the bank.

  Verified by a click test (step events through 7 → 8 → click → 9 → back), a
  probe of the uniforms in a real page, and recordings. Recordings below 12 fps
  slow the world, because the engine clamps a frame to 1/12 s, so check timing
  at `--fps 12` or higher.
- 2026-10-09 — Ideas 1 and 3 (the owner's picks, through the Scheduler). Slide 9 no
  longer says „nepriklausomas patikrinimas“: LHCb's check was its own internal
  review, and other groups had also seen the 2003 bump. It now shows the
  140-entry illustration from slides 2–3 beside LHCb's 27 292 candidates at
  the same scale. A `jx` histogram at the lhcb station, x −14,4, has width
  30 × 22/175 and `max: 297`, LHCb's tallest bin, so one grain is one entry
  in both. It reads as a thin strip beside the heap. The speaker names the
  two amounts and the significances: LEPS 4,6σ (the paper's own abstract;
  19 events over 17 of background), 5σ as the usual discovery bar (Physics
  World 2007 and LHCb's outreach page; new fact
  `particle-physics-5-sigma-discovery`), and Pc(4312) 7,3σ. The notes keep
  the left plot labelled as an illustration.
- 2026-10-09 — Idea 7 (a "working day" slide after 10) waits for the owner. A draft
  built only from verified public words (109 passages, 40 sources) is in
  ~/talks/.cache/uzk-review/working-day-draft.md.
- 2026-10-08 — Last focused review (talk-review on a0b80f8: facts since
  01bed17, copy, unslop; 15 kept). Applied: slide 9's screen line is now
  „Daugiau duomenų ir nepriklausomas patikrinimas“ (the „šimtus kartų“
  ratio had no fact in the bank and compared unlike samples); a dot is a
  computed mass, and slide 2 says whose mass and which side is heavier;
  LHCb „beveik du tūkstančiai“ (bank, June 2026); the LHC „kai jis veikia“
  (shut down since 29 Jun 2026), „maždaug šimto metrų“; slide 7 points at the
  thin red lines from the vertex and says „tokiame grafike, kokį vertinai“;
  slide 8 says the plot holds the data up to 2019; facts comments on slides
  3–6 and 8. Rejected: the bridge „Kaip aš pats patekau į LHCb?“ (a question
  that answers itself; „Į LHCb aš patekau ne tiesiu keliu.“ instead);
  `duration: 9min` (the lint counts the tunnel clip whole, 4,6 min; a manifest
  trim would need an encode and a release). Timing: the per-slide notes sum
  to 6,4 min; the talk runs about 7 min.

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

## The world (current, 2026-10-08)

Online talk (not TV): the TV rules in earlier notes are history. Pinned to
slidev-videos v0.5.0. Palette `blue` with the talk's own violet-gold
colours; `options: { dustSize: 2.2, reach: 22, nebula: 0.4 }`.

- **Stations** (one axis, 300 apart, only one in frame): `quarks` (hero,
  `quintet`: the cover and the close), `europe` at 1200 (`map` and the `path`
  `route` Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn →
  Vilnius; pose `whole`, no sway, HTML city labels projected from it, shown
  after 7.5 s), `trial` at 1500 (`histogram` `th1` 140 entries and `th2`
  3 500, the illustration of slides 2–4), `lhcb` at 1800 (`histogram` `jp`,
  LHCb's 2019 m(J/ψ p) bins, `marks` over Pc(4312), Pc(4440), Pc(4457)). The
  LHC clip and the two photographs cover the world on slides 5–7, which rests
  at `lhcb` under them.
- **Talk-owned builders** (`setup/grains.js`, driven by `<Grains :set>`):
  `histogram` (one grain per entry in random order, an easing fill, ticks
  and a dimmed background once full; a fill requested during a flight starts
  on arrival, with a 6 s fallback), `quintet` (five clusters, per-step hold
  and light), `map`, `path`; `pairs`, `ghost` and `streams` stay registered
  but no slide uses them. Every grain sprite is capped at 48 px and fades
  within a few units of the camera.
- **Data**: `public/data/jpsip-2019.json` (HEPData ins1728691 Table 2),
  `theta-toy.json` (illustration, seeds inside), `europe.json` (Natural
  Earth 1:50m via `scripts/make_europe.py`).
- `setup/Count.vue` prints Lithuanian numbers (no slide uses it now).
- Shots under SwiftShader: `--wait 30000` or more; a fresh single-slide load
  needs about 40 s before the world draws. For animated slides use
  `slidev-stage-record` (exact clock); it enters each slide right after the
  one before, so a fill that restarts there is an artefact.
