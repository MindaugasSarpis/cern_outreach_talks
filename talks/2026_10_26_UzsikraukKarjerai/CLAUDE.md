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
- Delivery: broadcast. Laptop at 1920×1080, 50 Hz, silent. In past editions
  the producers squeezed slides to about two thirds of the frame.
- Owner's steers: "doesn't have to be my life story"; the first version was
  rejected for too many slides, AI-sounding lines and a broken story; the
  second for incoherent flow and washed-out visuals ("more striking but not
  synthetic, not sloppy, photorealistic").
- Banned: slogan cards, "X, not Y" antithesis, unsourced numbers, anything
  from the speaker's private documents in git.

## Story (19 slides, one thread)

| # | Message | Picture |
|---|---|---|
| 1 | In my work there is no answer at the back of the book; here is one such question | the matter/antimatter cloud forms, title |
| 2 | Equal amounts would have wiped everything out | the pairs go out as light |
| 3 | One in a billion was left; everything is made of it; nobody knows why | the remainder, 1 000 000 000 vs 1 000 000 001 |
| 4 | One way to look for the answer: collisions at the LHC | real LHC tunnel footage |
| 5 | LHCb was built for this question, I work on it; the road was not straight | real photo of the LHCb cavern |
| 6 | I knew only that physics interested me; my first research was on this very question | Europe of grains, route Vilnius → CERN → Vilnius → Glasgow |
| 7 | I left particle physics, came back for a PhD; the PhD gave me pentaquarks | route → Vilnius → Heidelberg → Bonn |
| 8 | 1964: the quark idea allowed five-quark particles; nobody knew if they exist | portraits of Gell-Mann and Zweig, quintet scattered, „1964“ |
| 9 | Claimed in 2003, shown not to exist by 2008 | quintet half-held |
| 10 | Found by LHCb in 2015, 51 years after the idea | quintet held + LHCb 2015 plot |
| 11 | Three in 2019; my task: do they appear in another decay? | LHCb 2019 plot |
| 12 | A needle in a haystack; after two years the method worked | haystack, a cluster gathers |
| 13 | After four and a half years: not found | the ghost, „Neradau.“ |
| 14 | It still counted; the method became my next project | arcs from the ghost to a holding cluster |
| 15 | At the same time I opened LHCb's data to everyone | real CERN data-centre footage, opendata.cern.ch |
| 16 | My 2022 plans did not include what happened | his own 2022 slide |
| 17 | A year and a half later I was building an LHCb group in Vilnius | route home to Vilnius |
| 18 | The opening question is still open; someone in a classroom may answer it | Hubble photo of NGC 1300 |
| 19 | You don't need to know yet; try, ask; a task for this week | the galaxy photo dimmed, „Ko jūs savo darbe dar nežinote?“ |

## Status

- 2026-10-08: third version on slidev-videos `feat/broadcast` efacca2,
  `look: broadcast` overridden to a near-black ground (lift 0, nebula 0,
  bloom 0.32, dust dimmer and sparser). A flow critique and a visual review
  of the contact sheets were applied. `slidev-stage-safe --broadcast` clean
  (smallest type 31 px at 1080p). Deployed versions: a3001a1 (rejected),
  71fb6f1 (rejected), then this one.
- Next: the speaker's [PATIKSLINTI] answers; Delfi's answers (Brief); a
  test encode at 2.5 Mbit/s of a dark slide to check banding; per-slide MP4s
  with `slidev-stage-record` for Delfi once the toolkit release lands.

## Decisions

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

- Re-listen to the transcript quotes (LRT „Širdyje lietuvis“ 2024 at 03:11,
  06:15, 07:36, 11:12; Mokslo sriuba podcast #62 at 00:39, 32:39, 44:34).
- Confirm: the after-school courses; the job in Glasgow and the laser work as
  worded; whether the plot after two years was from the same analysis and
  whether "metodas veikia" is his wording; "sukurti" alone or with the team;
  showing the 2022 slide.
- Ask Delfi: feed type and squeeze-back size; files in advance and format;
  25p or 50p; who advances slides; confidence monitor; logo/super/clock
  positions; flash check.
