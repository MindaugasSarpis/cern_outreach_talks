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

## Story (16 slides, one thread)

The thread a viewer can retell: he did not know what he would be; his PhD
gave him a question nobody could answer (pentaquarks, which had been
claimed in 2003 and withdrawn by 2008, then found by LHCb in 2015); he
searched for four and a half years and did not find them; that check still
counts, and his own plans turned out differently too; so ask people what
they do not know yet.

| # | Message | Picture |
|---|---|---|
| 1 | No answer at the back of the book in my work; one such question, and first how I came to it | title; five faint clusters drift apart (the hero, `quarks`) |
| 2 | At 16 I knew only that physics interested me: school, CERN in 11th grade, Glasgow | Europe of grains, route Vilnius → CERN → Vilnius → Glasgow |
| 3 | I left particle physics, came back for a PhD; the PhD gave me pentaquarks | route → Vilnius → Heidelberg → Bonn |
| 4 | 1964: the quark idea allowed five-quark particles; nobody knew if they exist | Gell-Mann and Zweig, quintet scattered, „1964“ |
| 5 | 2003: a group announced it had found one | quintet half-held, „Paskelbė, kad rado.“ |
| 6 | Others checked and found nothing; by 2008 it was withdrawn | quintet falls apart, „Paaiškėjo, kad jo nėra.“ |
| 7 | They were found after all, at CERN, where the LHC collides protons | real LHC tunnel footage |
| 8 | LHCb is one collision point; I am one of its 1 800 people | real photo of the LHCb cavern |
| 9 | LHCb found them in 2015, 51 years after the idea | quintet held + LHCb 2015 plot |
| 10 | Three in 2019, the year I began; my task: do they appear in another decay? | LHCb 2019 plot |
| 11 | A needle in a haystack; after two years my method worked | haystack, a white-gold cluster gathers |
| 12 | After four and a half years: not found | the ghost, „Neradau.“ |
| 13 | That is a check like 2008's; the method went on into my next project | arcs from the ghost to a holding cluster |
| 14 | Halfway through I wrote down my plans | his own 2022 slide over the dimmed map |
| 15 | A year and a half later I was building an LHCb group in Vilnius | route home to Vilnius |
| 16 | You don't need to know yet; a task for this week | the map dimmed, „Ko jūs savo darbe dar nežinote?“ |

## Status

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
