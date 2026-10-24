# Užsikrauk karjerai

## Brief

- Event: „Užsikrauk karjerai“, Delfi conferences team with Lietuvos Junior
  Achievement, for grades 9–12 (LJA lists 8–12).
- Filmed in the Delfi studio, Vilnius, on 26 Oct 2026, 16:00–18:00, with no
  audience; streamed to classrooms on 27 Oct 2026 at 12:00.
- Title (the owner, 21 Oct, through the Scheduler; his capitalisation): „Kas
  vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po žeme“. No
  title slide (16 Oct): it is the deck's `title:` (the tab) and goes to Delfi
  with the notes. Hedge for the speaker: CERN is the world's largest
  *particle physics* laboratory (`cern-largest-particle-physics-lab`; no
  source ranks it among all science labs), and 100 m is LHCb's depth and the
  LHC tunnel's (`lhcb-100m-below-ground`, `lhc-geneva-27km-100m-four-experiments`).
  In speech: „didžiausia pasaulyje dalelių fizikos laboratorija“.
- Lithuanian, **15 minutes** (the owner, 21 Oct: "school students oriented, so
  more visuals, but 15 min we can cover quite a lot of content"; until then
  10–15, and the 20 Oct deck is about 10).
- The organisers' ask: real stories over conference talks; you don't need to
  know now what you will be; notice what interests you and dig; what working
  on questions with no textbook answer is like.
- Delivery (owner, 21 Oct, through the Scheduler: "15min talk, will be
  recorded in a studio with good quality"): **a studio recording of good
  quality**, filmed at Delfi on 26 Oct and streamed to classrooms on 27 Oct.
  The broadcast path in full (skill talk-broadcast): `broadcast: true` in the
  headmatter, so `talk ready` runs the safe-area check; per-slide MP4s and
  text-free plates at the studio's frame and rate (`talk record --plates`,
  Friday on v0.8.2); the stills PDF with cue lines, `credits.txt`, the source
  clips; the venue zip (`pnpm venue`) as the fallback copy. Open with the
  owner (asked 21 Oct): the frame and rate (1080p50 or 2160p), how the deck is
  fed (a screen capture of the laptop or files), and the rest of the
  broadcaster's list. The 8 Oct "not TV" meant no broadcast channel; it
  replaced the earlier TV brief and is itself replaced by this. Kept from
  then: the stage look, no sources on slides; facts must still be true.
- The studio (the owner, 21 Oct, in this window): **1080p50**; the deck runs
  on his MacBook and must also be available online (he will try the local
  copy first) and wants a package that plays anywhere; shown **on a screen
  behind him** (the camera films the screen, so no direct feed is known);
  **he clicks**; the laptop's sound **goes into the mixer** (the clips at
  −16 LUFS, the opening's swell, thump and drone, the tunnel at 0,5);
  probably **no on-screen logo** of theirs (he is not sure). Ways to run it,
  in order: the live URL; the venue zip on the MacBook (local HTTP); with
  v0.8.2 either one falls back to recorded plates where the world cannot run;
  the per-slide 1080p50 MP4s as the last copy (a Keynote/PowerPoint file of
  them plays on any machine, if he wants it). The order is the Scheduler's
  approved plan (21 Oct). v0.8.2 adds `RUN_ME.command` (macOS) and
  `RUN_ME.bat` (Windows) to the venue zip: python3's http.server where it
  exists, else what to install; a bundled server binary is put to the owner.
- The feed (the owner, 23 Oct): "They will have the ability to switch between
  room view (me in front of screen) and the presentation view": Delfi takes the
  laptop's output into the mixer as well as filming the screen behind him, so the
  slides also go out full frame at stream bitrate (the broadcast look and the safe
  box matter for both; where he stands only in the room view). For the day: the
  MacBook's HDMI at 1920×1080, 50 Hz, mirrored (a presenter window on the laptop
  runs a second world and may stutter); ask whether the sound goes over HDMI or
  a separate cable.
- Owner's steers: "doesn't have to be my life story"; the first version was
  rejected for too many slides, AI-sounding lines and a broken story; the
  second for incoherent flow and washed-out visuals ("more striking but not
  synthetic, not sloppy, photorealistic").
- Banned: slogan cards, "X, not Y" antithesis, unsourced numbers, anything
  from the speaker's private documents in git.

## Story (fifteenth version, 23 Oct night: the review round, then the owner's last cuts: 19 slides, 11,8 min by the lint's slide times; about 13–14 min delivered with the slots)

The owner, 21 Oct: "15 min we can cover quite a lot of content … more
visuals", then "Build" on the proposal in this window; his rounds of 22–23 Oct
reshaped the ends. Blueprint v2 (`notes/blueprint.md`, 20 Oct) stays the spine:
one dot, a particle of five quarks that took 51 years to find, and how you know
you have found something nobody has seen; the viewer judges; the rule said once;
then the dots are handed on through the speaker's road, the group in Vilnius and
the open data, to the group's own part of the detector and the close out to the
LHC, „mano greitintuvas“, and the FCC, „jūsų greitintuvas“, where the cover's
promise (where this work can start) is kept. The owner's three slots on 13 stay
his (the first the one to tell).

Pictures and numbers (owner, 2026-10-10): no titles, kickers, statements or
section slides; the speaker narrates from the notes. A number carries the word
that names it; a thing shown may carry its name. Exceptions: the cover's name
line, the plots' axis words, and the owner's two labels and the licence credits
on the last slide (lint TEXT warnings, on purpose).

| # | Screen | Picture | min |
|---|---|---|---|
| 1 | „Dr. Mindaugas Šarpis · LHCb Vilnius / Vilniaus universitetas“ | cover: the five-quark form gathers at `quarks` | 0,6 |
| 2 | — (clip) | the zoom out from NFTMC in Saulėtekis past the Earth and our galaxy to the cosmic web, 19 s, stabilised, the scale jumps as zoom-dissolves (`vilnius_zoom.mp4`); four names spoken | 0,35 |
| 3 | — | Innoday's cosmic web, a still that dissolves into grains (`<WebTakeover>`); one spoken line | 0,2 |
| 4 | „13,8 mlrd. metų“ | Innoday's funnel; atoms → three quarks → five | 0,6 |
| 5 | — (clip) | CERN from above (`cern_overview_short.mp4`, 11 s) | 0,19 |
| 6 | „LHC 27 km“ | the real tunnel (18 s cut) | 0,3 |
| 7 | — (clip) | **new**: an LHC dipole magnet cut open, its two beam pipes (`cern_video_2019_050_008.mp4`, 10,8 s, the owner's "A, ok"); 1 232 magnets at −271 °C | 0,3 |
| 8 | „290 dalelių“ | one real 2012 CMS crossing in 4π; „užfiksavo CMS“ spoken | 0,55 |
| 9 | — (clip) | `lhcb.mp4` (39 s): LHCb, its people; → 3 s after „Aš – vienas iš jų.“ (22 Oct), not at its end | 0,4 |
| 10 | „100 m“, then „40 mln. per sekundę“ | **new**: inside LHCb, the 3D model beside a 1,83 m person (Innoday's), the camera craned down to the cavern floor; LHCb's own 2012 collision in it; the 40 MHz glow; one mass, one dot (`<InsideLhcb>`, station `cavern`) | 1,0 |
| 11 | days ticking „0 dienų“ → „4 dienos“, then → „100 dienų“; „masė →“ (two clicks) | `th1` fills, 140 dots in four days („tarkime“); the viewer judges; the tick; click 2, `th2` 3 500 random dots in 100 days, no tick, the bump gone; 2003 | 1,6 |
| 12 | „LHCb duomenys“, the year ticking „2011 m.“ → „2012 m.“ → „2015 m.“, then „2011–2015 m.“, „masė →“; „5 naujos dalelės“ (one click) | `oc` at a steady rate, five peaks; the rule (< 1 in 3,5 mln.) and the 2015 pentaquark spoken; „Pentakvarkų ieškojau ir aš.“; on the click an Ωc⁰ drawn as three quarks (c, s, s) and gluons beside it; the zoom's music under 11–12 | 1,2 |
| 13 | Vilnius, CERN; „Glazgas“, „Airija“, „Heidelbergas“, „Bona“, „Mančesteris“ | the criss-cross route (the owner, 23 Oct): Vilnius → CERN → Glasgow → CERN → Ireland → Vilnius → Heidelberg → CERN → Bonn → CERN → Vilnius → Manchester → CERN, in 5 clicks of about 1 s a leg; four optional owner slots | 0,6 |
| 14 | Vilnius | the dive to Vilnius; the group; the coordinator bridge | 0,65 |
| 15 | „1 TB“, „800 TB“ | OpenData's piles: in close on the 1 TB sphere (the unit), then back to the Run 1 data the speaker prepared; „– ir tau“ | 0,6 |
| 16 | „4 000 TB“, „Atvirieji duomenys“ | the gold pile | 0,3 |
| 17 | „> 100 000 TB“, „Visi LHCb duomenys“ | LHCb's pale pile; a kilometre of laptops | 0,45 |
| 18 | — (clip) | Innoday's `lis_flag.mp4` from 3,5 s (16,5 s): the SciFi module, its cold box, the flag; the group works on it; „Starfire“ starts low | 0,1 + clip |
| 19 | „mano greitintuvas“, „jūsų greitintuvas“; the credits | the last: Innoday's close at full frame (`close_lhc_fcc.mp4`, 54 s): out from the flag to LHCb and its collisions, to the LHC and FCC rings; the HL-LHC to 2041, the cover's promise and the advice, „LHC – mano greitintuvas. FCC – jūsų greitintuvas.“, „Ačiū.“ | 1,2 |
| 20 | the credits | kept, not shown: the licence credits (the owner, 23 Oct: "credits all go to slide 20 which I will make available but not show") | 0 |


## Status

- 2026-10-24 (evening, latest): **deployed 7586b41** (the owner: "DEPLOY"; Pages run 40122787406,
  green; https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/ 200, the
  live walk passed, 17 slides; `talk ready` passed on it, nothing skipped but the pptx; plates one
  warning): the owner's round (Decisions, 24 Oct evening). A first deploy attempt was refused by
  the auto-mode classifier until the owner's word. The new clips (vilnius_zoom 25 s,
  lis_flag_50, close_quick), the 10 plates and the venue zip built from 75112aa (308 MB) are on the
  release; venue.json points at it; stills retaken. 17 slides, 10,1 min timed. Open for the owner:
  the terminal image's licence (CERN, non-commercial; as the Planck map); his ear on the Starfire
  bed's joins, the hum and slide 10's effects (`+` / `-` scale all of them); his words for slide
  13's slots; where he stands.
- 2026-10-24 (about 2 am, latest): **deployed 26727ec** (Pages run 40036497924, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/ 200, the
  live walk passed, 17 slides; `talk ready` passed on it, nothing skipped but the pptx). The
  late rounds (Decisions): the warp-drive zoom with Aphelion, the data slide, the touchscreen
  and first website, the route ending home and the Manchester legs, the levelled sound.
  Plates (10, 30 s hold) and stills retaken and published; the venue zip rebuilt from 26727ec
  (259 MB). Open for the owner: his words for slide 13's slots; where he stands; the
  slide 10 camera lift; the credits page is one → after the close, so no extra press there.
- 2026-10-24 (just after midnight, latest): **deployed f4ce1b5** (Pages run 40024556208,
  green; https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed, 20 slides; `talk ready` passed on it, nothing skipped but the
  pptx, plates one warning): the zoom's zoom-dissolves (19 s), slide 13's criss-cross route,
  the close from the 4K take, the credits page (20, not shown). Plates (13) and stills 01–20
  retaken and published; the venue zip rebuilt from f4ce1b5 (257 MB); venue.json. 19
  slides spoken, 11,7 min timed, about 13–14 delivered with his slots. Open for the owner:
  the zoom music's title and licence; his words for slide 13's four slots (11th grade,
  Ireland and the years between, the pentaquark search's outcome, Manchester); slide 10's
  camera lift (not applied); where he stands in the room view; a beat at each city on 13
  if he wants one (now the head turns straight back). The release matches plates.json (the
  Scheduler deleted 18- and 21-plate); the tape-robot clip stays. Fragile: the close's 4K
  source (videos/raw/innoday/close_take_4k.mp4, 735 MB) is only in this machine's raw bank,
  copied from an Innoday /tmp scratchpad; the rclone remote is read-only, so the owner should
  copy it to his Drive with the other raws (without it, close_home.mp4 remakes a softer clip).
- 2026-10-23 (night, latest): **deployed 2646fa4** (Pages run 40014341245, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed on it, nothing skipped, plates one
  warning, the fingerprint): the owner's last round (Decisions), 19 slides, 11,7 min
  timed, about 13–14 delivered with his slots. The zoom's music under 11–12, Starfire
  under 18–19; the Ωc⁰ on 12's click; old 18 and „Ačiū“ cut; the talk ends on the
  close at full frame with „mano greitintuvas“ / „jūsų greitintuvas“ and the credits.
  Reviewed after the changes by a visual pass (twice) and a story-and-facts pass; their
  fixes are in. Plates (12) and stills 01–19 retaken and published; the close at full
  frame on the release; the venue zip rebuilt from 2646fa4 (237 MB); venue.json. Open
  for the owner: the zoom music's title and licence (unknown since Innoday); his
  words for slide 13's slots; slide 10's camera lift (not applied); where he stands in
  the room view; the release still holds 18- and 21-plate.mp4 and the tape-robot clip, which
  no slide uses (a prune is his or the Scheduler's to run).
- 2026-10-23 (evening, latest): **deployed 6f13fc3** (Pages run 39998140027, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed on it, nothing skipped, plates one
  warning, the fingerprint): the review round (Decisions), 21 slides, 12,7 min
  timed, about 14–15 delivered with his slots. Plates (14) and stills 01–21 retaken
  under the broadcast look and published; the zoom (17 s), the SciFi clip (16,5 s)
  and the fitted close (54 s) on the release; the venue zip rebuilt from 6f13fc3
  (236 MB); venue.json. Review copies of the zoom and the close in the window. Open
  for the owner: silent or the swoosh; the OpenStreetMap credit on „Ačiū“; his
  words for slide 13's slots (the 11th-grade visit, the four years, what his
  pentaquark search showed); slide 10's camera lift (not applied); where he stands.
- 2026-10-23: **deployed 1da3ab7** (Pages run 39944544983, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed on it, nothing skipped, plates
  one warning, the fingerprint): 21 slides, 12,9 min timed, about 14½–15½ delivered
  with his slots. New: the 20 s zoom from Saulėtekis to the web (slide 2, silent,
  stabilised), Innoday's SciFi flag (19) and its close cut at the LHC/FCC map (20);
  the masterclass slide cut (Decisions). Plates (14) and stills 01–21 retaken and
  published; the venue zip rebuilt from 1da3ab7 (263 MB) on the release; venue.json.
  Review copies sent in the window: the zoom silent and with the swoosh, the close
  at 720p. Open for the owner: silent or the swoosh; the OpenStreetMap credit for
  the close's map (ODbL: tiny print on „Ačiū“?); whether the advice lines on 20 stay;
  the time (at the slot's edge with his slots: the slots or the advice are the cuts).
  Release clean-up done (the owner asked; the Scheduler ran it, 23 Oct): 02-, 07-,
  09-, 19-, 20-, 22- and 23-plate.mp4 deleted, the 14 plates of plates.json remain;
  cern_footage_2022_013_006.mp4 (the tape robot, no slide uses it) stays, as he
  asked for plates only.
- 2026-10-23: **deployed c30e7e8** (Pages run 39924390162, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed on it, nothing skipped, plates
  one warning, the fingerprint): the owner's 23 Oct cuts (Decisions), 19 slides,
  11,6 min timed, about 13–14 min delivered with the slots. Plates retaken on
  the GPU (15; 11–19 published with --only; 20–23-plate.mp4 left on the release,
  unused, not pruned), stills 01–19. The venue zip rebuilt from c30e7e8
  (203 MB) and on the release; venue.json. Open for the owner: whether to use
  the 1–2 free minutes (his slots on 12 are the natural place); the road
  slide's details (below) and the morning list (labels on 10–11, where he
  stands, slides 9 and 19 on his MacBook, the drone at Delfi's sound check).
- 2026-10-23: **deployed c81b29c** (Pages run 39855393262, green;
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed on it, plates one warning, the
  fingerprint). The landing page shows „ZIP · 226 MB“ (the venue zip from
  3489ef5, the same deck). Main handed back to the Scheduler.
- 2026-10-23 (night; the owner asleep, "finish the talk to completion
  deploy, make zip availabe"): **the pre-filming round, 22 slides** (Decisions,
  22 Oct; notes/review.md). The venue zip is rebuilt from 3489ef5 (226 MB, 22 slides, the new
  plates and stills) and on the talk's release; `videos/venue.json` puts it on
  the landing page. `talk ready` passed on 3489ef5 (plates: one warning, the
  fingerprint counting the notes and manifest written after the take; the
  world is the take's). **For the owner to look at before Monday:**
  1. the histogram labels on 10–13 (his "totally without context"), worded by
     the session: „masė →“, „140 taškų“ → „3 500 taškų“, „LHCb duomenys“,
     „5 naujos dalelės“, „3 pentakvarkai“, „atsitiktinumas“ / „LHCb“,
     „< 1 iš 3,5 mln.“ (13, 10 s in: timed to the sentence at 120 words a
     minute; it may land early or late against his pace);
  2. slide 20 (the tape robot) dropped and the cuts (Decisions): to put the
     robot back, revert 7713925's slide and 3489ef5's manifest change;
  3. slide 8: he presses 3 s after „Aš – vienas iš jų.“, not at the reel's end;
  4. where he stands: the numbers sit low left (61–74 % down); stand
     screen-right, or say so and they move up;
  5. his MacBook: run slides 9 and 22 on it; slide 9 is Innoday's close scene
     (the detector and the collision), which his M2 struggled with in the Innoday rehearsal (22 Oct)
     („MacPro M2 can't quite handle the final slide“). If it stutters, it can
     be recorded as a clip;
  6. Delfi's sound check: the collision's drone on 9 is 30–60 Hz, synthesised.
  Still open: the road slide 14 (the last stretch Bonn → Manchester → Vilnius?,
  which Irish city, did the trail start in Vilnius, years and roles for the
  notes); its three optional slots stay his.
- 2026-10-22 (latest, evening): **deployed acc0993 on v0.8.3** (Pages run
  39790852994, green after its deploy job sat queued about an hour on
  GitHub's Actions incident; https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed on 23 slides). `talk ready` had passed on acc0993
  with nothing skipped ("pptx: skipped, no pptx"; plates one warning, the
  fingerprint false positive). Live: the v0.8.3 pin and the cover's
  `<PptxButton />`, which shows nothing until `videos/pptx.json` exists. No
  PPTX: the owner said "no pptx" (Decisions), so the studio runs the live
  URL with the venue zip as the fallback. No per-slide
  `talk record` MP4s exist, only the plates. Main is Innoday's; this talk
  pushes nothing until the Scheduler says.
- 2026-10-22 (afternoon): **the second round on the branch, then
  deployed as acc0993 (above)**: origin/main 5f0d669 merged (v0.8.3's talks side), pinned
  v0.8.3 (the lockfile's v0.8.1/v0.9.0 entries restored from main's after
  the pin; `talk lock` passes), `<PptxButton />` on the cover (it renders
  nothing until `videos/pptx.json` is there); lint 0 errors, `talk check` ok,
  `talk pptx --dry-run` plan ok. The PPTX waits: Innoday's take showed the
  recorder films clip slides frame by frame at 1080p50 (53 min for a 4-min
  opener), and Tools is changing `talk pptx` to embed the clip files and
  record only the world slides. Next: `talk ready` and the deploy when the
  Scheduler gives main after Innoday's (about 18:00); `talk pptx` after the
  toolkit fix. Until then the studio's 1080p50 copy is the per-slide MP4s of
  `talk record`. The plates were recorded on v0.8.2; `ready` will call them
  stale (the fingerprint counts package.json and the lockfile), with no change
  to what they show expected from a PPTX-only release.
- 2026-10-22 (morning): **deployed 883560a on v0.8.2** (Pages run
  39751672500, green; https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_26_UzsikraukKarjerai/
  200, the live walk passed; `talk ready` passed with nothing skipped, its one
  warning the plates' fingerprint counting this CLAUDE.md, the only change
  after the take). Every label inside the broadcast safe box; plates on the
  release; the venue zip built after the deploy (`pnpm venue`, 227,1 MB, all
  23 clips venue-safe, RUN_ME.command for the MacBook and RUN_ME.bat, in the
  talk dir, gitignored) (the owner, in this
  window: "Deploy"; the Scheduler gave the render lock and main for v0.8.2,
  the PptxButton and `talk pptx` in a second round once v0.8.3 is tagged).
  On the branch: origin/main merged (8e44020); pinned v0.8.2 (the lockfile's
  v0.8.1/v0.9.0 entries of other talks keep `path: /packages/stage`, restored
  by hand from main's after the pin dropped them); `stage.motion: floor`;
  `lis_flag.mp4` made talk-owned (the library's 10 s copy as-is, on this
  talk's release: the env's CLI, 0.8.3, predates v0.9.0's registry and failed
  `videos:check` on it). First shots of all 23 and a review by a subagent;
  `talk safe` found 19 problems (the left edge at 72 px, readouts and labels
  below y 408, type at 30–36 px), all fixed (Decisions, 22 Oct): `talk safe`
  0 problems, lint 0 errors. Plates: 17 (every non-clip slide; 1080p25,
  20 s hold) recorded at 6eda07d in 16 min, 180,7 MB (6,2–20,6 MB each),
  published to the talk's release with --only. Not shot: the late text of 3 and 11 (judged from
  geometry), 14's click states (checked by `talk safe`), 9's crane and
  collision in motion. Left as they are, for the owner: 21's sun of plots is
  unreadable in detail by design; 6's clip carries a small burned-in
  „CERN Control Centre“ inset with an accelerator map, top right (cut A, its
  English labels approved); 20's robot is small in the frame at the start.
  Open owner questions (they do not block): the road (Bonn → Manchester and
  Vilnius in order or together, which Irish city, whether the trail starts in
  Vilnius, years or roles); drop 20 if long; where he stands; Delfi's flash
  check.
- 2026-10-21 (latest): **the 15-minute round built on the branch, not
  rendered, not deployed** (the owner: "Build"; then the dipole magnet as
  slide 6, encoded and published). 23 slides, 13,6 min by the
  notes (lint: 0 errors; the open TODO on 19 and the three optional slots are
  the warnings), so about 15 delivered with the slots. `talk check` ok
  (videos, stage, build). Not yet seen in a browser: no shots or recordings
  while Innoday holds the render lock (until its Thursday redeploy). Friday,
  in one batch: pin v0.8.2; a frame sheet of `cern_footage_2022_013_006.mp4`
  to cut the tape-robot shot (20's TODO: manifest trim, encode, publish);
  shots of all 23 (9's crane, collision and glow at their seconds; 10's second
  click; the clips on 6, 16 and 20), a review; `talk safe`; `talk record --plates` at
  1080p50; the stills PDF; `pnpm venue`; the Keynote/PowerPoint copy of the
  per-slide MP4s; `talk ready`; the deploy when the Scheduler gives main.
- 2026-10-21 (latest): **live is the 20 Oct rebuild, not a60d0fa.** It went
  out with main's Pages run 39485774569 at 404f3a7 (Innoday's deploy, green,
  20 Oct 19:42 UTC), which builds every talk and contains 292181d…3c7c655.
  Checked 21 Oct: URL 200, tab „Užsikrauk karjerai“, the live bundle carries
  the rebuild's „59 453“ and „Bakalauro darbai“ and not the 18 Oct
  „Magistro ir bakalauro darbai“. This talk's own `talk ready` was not run on
  the rebuild (no ready or deploy record on this machine), so it is live
  unverified by a walk. On the branch since: `advance-on-end` stripped from
  the three clips (Decisions, 2026-10-21), the owner's title in the headmatter
  and Brief, two facts filed. Next: the owner's answer to the 15-min proposal
  (in this window), then build content; renders wait for Innoday's Thursday
  redeploy; Friday: pin v0.8.2, stills, `talk record --plates`, `talk ready`.
- 2026-10-18 (latest): **flow overhaul, blueprint written, not built.** The
  owner, in this window, on the deployed 20-slide deck: "This one still lacks
  coherence, now I can build some story telling around it ... but need a much
  better flow. And oriented at highschool students". The saved workflow
  `talk-blueprint` (run wf_acba6022-08d, head fe956c2; three spines:
  one-question, the-particle, student-path; four judges: a 15-year-old, a
  documentary editor, an LHCb physicist, a physics teacher) wrote
  `notes/blueprint.md`: one question („Kaip sužinoti, kad radai tai, ko dar
  niekas nematė?“) carried by the cover's particle, 20 slides, about 11,5 min.
  The deck is unchanged until the owner says yes; 21 research gaps listed in
  the blueprint. The deployed state below is still what is live.
- 2026-10-18: **deployed a60d0fa** under the standing rule (the
  Scheduler gave main): the owner's four 18 Oct changes (Decisions,
  2026-10-18): Innoday's web and funnel (2–3), the event display gone, LHCb's
  Ωc⁰ peaks (9–10), OpenData's open data and the masterclass (15–19), „Ačiū“
  beside the five-quark form (20); main 6e51eaf merged; stills 01–20 retaken.
  20 slides, about 9,9 min. `talk ready` passed with nothing skipped (the
  build's walk 20 of 20); Pages run 39120492250 green; the live walk passed 20
  of 20 (1 retried, none failed, no lost context); URL 200, the tab
  „Užsikrauk karjerai“. Shown to the owner: a contact sheet of the new slides.
  Open for the owner: Figures 4 (the tunnel clip; Planck's NC licence and the
  NCSA web, which the Scheduler passes on), 5's re-listen, 8, 9 (the close,
  the web's place). Weak, left: slide 2's settled grains read as a soft haze
  (Innoday's takeover, unchanged); „800 TB“ twice on 15; two of 18's plots
  cross on the left for a moment.
- 2026-10-16: **deployed 9bf3b0d** under the standing rule (the
  Scheduler gave main): no title (Decisions, 2026-10-16); the cover keeps the
  name line. `talk ready` passed with nothing skipped; Pages run 38877499226
  green; the live walk passed 17 of 17 (none failed or retried); URL 200, the
  tab „Užsikrauk karjerai“. Open for the owner: Figures 2, 4, 5's re-listen,
  6's BL4S day, 8.
- 2026-10-15: **deployed eb6a6a3** under the standing rule (the
  Scheduler gave main): the owner's answers (Decisions, 2026-10-15): the path
  round Europe told leg by leg (slide 12), the dive to Vilnius with Lithuania's
  outline (13), the masterclass without dates (15); main 7f89f2f merged.
  `talk ready` passed with nothing skipped; Pages run 38777285383 green; the
  live walk passed 17 of 17 (none failed or retried); URL 200. Open for the
  owner: the list under Figures (1, 2, 4, 5's re-listen, 6's BL4S day, 8).
- 2026-10-15: **deployed 3948c6b** under the standing rule: the 15 Oct
  round below. `talk ready` passed with nothing skipped; Pages run 38649918760
  green; the live walk passed 17 of 17 (none failed or retried); URL 200.
- 2026-10-15: **the 15 Oct round, built and reviewed** (the owner:
  "Open data and innoday talks are really good, take elements from them and
  finish this one off"; Decisions, 2026-10-15). 17 slides, about 9,3 min by the
  notes (the brief: 10–15; the speaker's own stories are where more would go).
  Checked: `talk lint --release` 0 errors (2 TEXT warnings, the cover and
  „Ačiū“, on purpose); `talk check` ok; shots of all 17 in order, settled, no
  page or HTTP errors; the cover's fly-in clear of long tasks (a trace); the
  `talk-review` workflow on db8e2ab (facts, copy, unslop, perf, state) and two
  rounds of visual review, all applied or answered in `notes/review.md`;
  stills 01–17 retaken (10 at its click); the PDF export (17 pages) checked on
  a rasterised sheet. Open for the owner: the list under Figures.
- 2026-10-13 (latest): **deployed c14d350** under the standing rule: the
  stage's flight whoosh and clip tone off (b7e1cce), slide 3's notes after the
  opening's fly-out fix (73da04c, lhc-opening 27e9837), and main 51b0021.
  `talk ready` passed with nothing skipped, Pages run 38316339426 green, URL
  200, live bundle carries `sound:{flight:!1,clip:!1}`. Sound not heard (headless):
  the owner's listen is the check. The morning list is still open.
- 2026-10-12: **deployed e507bf7** under the standing rule ("Deploy
  all"): the notes commit fb01b22 and main 3fe3545 (OpenData, Innoday's CMS
  swap, Tokyo's notes); the deck is unchanged. `talk ready` passed with nothing
  skipped, Pages run 38289206455 green, URL 200. The morning list is still open.
- 2026-10-11: **deployed 99ac5d4** under the owner's standing deploy
  rule: slidev-videos v0.8.1 (print reads each page's own dim, so the talk's print
  workaround is gone), OpenData's bloom fix in the shared opening (main 8bd087b),
  and still 03 retaken for it. `talk ready` passed with nothing skipped. Pages
  run 38091421726 green, live walk passed for 15 slides, URL 200. The open items
  went to the owner through the Scheduler in one morning list. They are: the LHC
  and LHCb lines over the opening or on slide 9; the fewer-words choices; the
  licences for Delfi; their moments for slide 13; the masterclass and BL4S dates;
  the length.

- 2026-10-11: **deployed f23d671** under the owner's standing deploy
  rule: the shared LHC opening (Decisions, 2026-10-11) on slidev-videos v0.8.0,
  15 slides. Main fe69406 is merged. `talk ready` passed with nothing skipped.
  Pages run 38089305763 green, live walk passed for 15 slides, URL 200. Both
  clips are on the release `videos-2026-10-26-uzsikraukkarjerai`. First version
  for the owner's review. Open for the owner: whether to move the LHC and LHCb
  lines from the event display (slide 9) over the opening, their moments for
  slide 13 (the working day), the licences of the CERN clips and event display
  for Delfi, the 2027 masterclass date and the BL4S call.

- 2026-10-10: **deployed 4de8e57** under the owner's standing deploy
  rule: the names follow-up and fewer words (Decisions, 2026-10-10). On screen:
  slide 9's „140 taškų“ and „27 292 taškai“, Vilnius and CERN on slides 10 and
  11, and slide 13's credit. Lint 0 warnings (main 7f6b0fe's TEXT). `talk ready`
  passed with nothing skipped. Pages run 38085005443 green, live walk passed for
  13 slides, URL 200, and the live text scan matches. Next: the shared opening
  with v0.8.0, once OpenData's module is on main.

- 2026-10-10: **deployed b675427** under the owner's standing deploy
  rule: pictures and numbers only (Decisions, 2026-10-10). On screen: slide 9's
  „140“ and „27 292“, and slide 13's tiny-print credit for the slide 6 photo
  (Rosa Menkman, CC BY 2.0). Main 8e1b223 is merged. `talk ready` passed with
  nothing skipped (TEXT warns on the credit line). Pages run 38082352299 green,
  live walk passed for 13 slides, URL 200; a visible-text scan of the live deck
  finds nothing else. Next: the shared opening (LHC footage, a collision, the 3D
  LHCb video), once OpenData's module is on main. Still open for the owner:
  their moments for slide 11, the licences of the CERN clip and event display
  for Delfi, the 2027 masterclass date and the BL4S call.

- 2026-10-09: **deployed 1ed62a9** under the owner's standing deploy rule
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

- 2026-10-24 (late) — The finale's hit (the owner: "The finale (which is starfire 1:05) should only
  be [heard] on LHCb Collision in the last slide"; "It was really nice in the innoday, but we didn't
  have a soundtrack for all the slides"; "so have to reshuffle somehow, and on switch have a nice
  transition to that one (like innoday)"). His 1:05 is the old close file's (it began at 0:30): the
  track's 1:37 arrival, Innoday's ~18 s into the same close. Now: the bed is 0:00–1:21,8 and
  2:27,8–5:00,9 in turn (18,7 min), so the crescendo, the arrival and the first climax are heard
  only at the close; `starfire_finale.m4a` is the track from 1:21,38; on the press into 16 the bed
  cross-fades into it over 2 s (`drop.xfade`, new) and its 1:37,38 arrival lands on LHCb's
  collision at 16,36 s (Chromium: the file at 16,04 s when the clip is at 16,37 s). This replaces
  the 2:54,85 downbeat and the fade-out of the entry below.

- 2026-10-24 (evening) — The owner's round in this window ("Can we use Scott Buckley starfire for
  the entire deck? …", then slides 3, 4, 9, 10, 12, 15, 16; "Has to be within 15min (aim for a
  little less)"; "implement all of these"):
  - **Music:** one piece, „Starfire“ (CC BY 4.0, credited as adapted). `public/audio/starfire_bed.m4a`
    (scripts/starfire_bed.py): 17,6 min, the track's opening and rise (0:00–2:39,9) and its second
    half (3:06,9–5:00,9) in turn, every join a one-bar cross-fade on its 80 bpm bar grid anchored
    at the 2:54,85 downbeat, ridden even, −16 LUFS; on every slide 2–15 at 0,36 (0,45 on the zoom),
    `start` on each so a reload picks it up. The 2:42,85–2:54,85 build and its downbeat are only in
    `starfire_finale.m4a`: on the press into the close (16) the bed fades out (2,5 s), the finale
    comes in at 4,34 s on the hit that opens its last four bars and its downbeat lands on LHCb's
    first collision crossing at 16,36 s of the clip (measured; checked in Chromium: the file at
    12,027 s when the clip is at 16,368 s); `<Soundtrack drop>` gained `out` and `fade`.
    Aphelion and Born Of The Sky are gone; the LHCb reel (9) is muted, Starfire under it.
  - **The zoom (2):** 25 s (was 20; remap_zoom.py `SLOW`, the warp's speeds scaled with it), the
    whoosh replaced by a low hum (scripts/zoom_hum.py: E1 with harmonics and a rumble, nothing above
    ~400 Hz, swelling at the warps; −16 LUFS in the file, played at 0,4).
  - **The web (3) and the funnel (4):** Innoday's latest takeover.js, WebTakeover.vue and funnel.js
    (the web in depth with the procedural cosmos round it; the eras in their own colours, no floor
    grid); slide 3 flies through the web on Innoday's path cut from 46 s to 27 s; slide 4 arrives far
    back (the funnel small in the web) and swings in low beside it until the mouth looms (13 s).
  - **The axis (9 → 10):** the Ωc⁰ plot's axis stood at 0,5 from the build and showed under the
    reel's dust and before the fill; it now comes in as the first grains land (setup/grains.js).
  - **Sound on the data slide (10):** the collision's own sound on (`inside`), and `<DataSfx>`: the
    cascade's fronts as soft low pulses merging into a quiet band (the 40 MHz glow), each landing
    grain a tiny click toward the plot, and on the click five B-minor-pentatonic bells for the peaks
    and a low swell as the Ωc⁰ gathers.
  - **The first website (12):** CERN's line-mode rendering of the first page, green on black
    (CERN-HOMEWEB-PHO-2019-004, Achintya Rao/CERN: "freely available for non-commercial use", not
    CC BY: the same open question as the Planck map for a stream Delfi co-organises); the label
    top left, the page lower right of it, undimmed.
  - **The flag (15):** `lis_flag_50.mp4`, motion-interpolated from 25 to 50 fps (no Blender scene
    here), the high-motion profile (was 1,4 Mbit/s).
  - **The close (16):** `close_quick.mp4` (scripts/close_retime.py): the even glow and the climb
    (24–44 s) in 10 s, eased up to 2,5x; 44,2 s; the labels 10 s earlier (35 and 42 s).
  - **Time:** the lint's 8,6 min plus the web's flight (~0,3) and the owner's slots: well under 15.

- 2026-10-24 (early hours) — The owner's late rounds:
  - **The zoom (2):** one continuous, stabilised flight with two "warps" (a fisheye bulge,
    radial zoom blur, dark edges; the corridor widened under them) and a synthesised whoosh
    in the clip. Scott Buckley's „Aphelion“ starts as the web appears (13,6 s, `<Soundtrack
    clip-at>`) and plays through slide 5.
  - **Cut:** inside LHCb (old 10), the three pile slides; the zoom-out's unlicensed music.
  - **The data slide (10):** LHCb with its own collisions; grains rise out of it into the
    Ωc⁰ spectrum (fills in 9 s); the click marks the five peaks and draws the Ωc⁰. „Born Of
    The Sky“ under it.
  - **11–12:** the touchscreen (Stumpe, 1972) and the first website (a capture of
    info.cern.ch), as photos out of the grains.
  - **13–14:** the criss-cross route ending home; 14 draws Vilnius → CERN → Manchester → CERN →
    Vilnius before the dive; Lithuania's outline waits for the dive (map `showDelay`).
  - **The close (16):** „LHC – mano / greitintuvas“, „FCC – jūsų / greitintuvas“.
  - **Sound:** levelled (see the entry below).
  - **Reviewed:** a final visual review and a re-check; the redraw a recorded take shows on 14
    is the recorder opening each slide fresh (the live deck carries the route on).
  - **Plates:** recorded with a 30 s hold so the data slide's fill is in.

- 2026-10-24 (night) — The sound, levelled (the owner: "2" of the proposals). Heard
  loudness (the file's integrated LUFS plus the deck's level): the music beds under the
  speech at about −24/−25 (Aphelion 0,35 on 2 and 0,3 on 3–5, −23/−25; Born Of The Sky
  0,25, −25; Starfire 0,33, −25); the zoom's whoosh −20 integrated, −19 at its peak, with no
  speech over the warps; the LHCb reel (slide 9) from 1 (−16, peaks −13) to 0,45 (−23, peaks
  −20), so it no longer jumps 10 dB over the beds; the tunnel at the owner's 5 % (−44).
  Delfi sets one gain at the sound check on the zoom's start or the reel.

- 2026-10-23 (late night) — The owner, on the result: "This immediate switch from galaxy
  to universe web and from earth to galaxy doesn't work"; "Slide 13 - sequence: Vilnius,
  CERN, Glasgow, CERN, Ireland, Vilnius, Heidelberg, CERN, Bonn, CERN, Vilnius and
  manchester CERN - like a criss cross. a bit more snappy on clicks"; "credits all go to
  slide 20 which I will make available but not shiw"; "slide 19 is a bit fuzzy". So:
  - **The zoom (2), 19 s:** the scale jumps are zoom-dissolves (1,4 s; one camera at a
    steady log rate, the outgoing feathered and shrinking into the centre, the incoming
    from 2,2× settling); the galaxy now turns and recedes to a dot before the web; the
    Earth longer (about 2,9 s alone); the galaxy's core dimmed while drawn large, the
    Earth's own Milky Way band faded, the web lifted as it comes in. Two review passes.
  - **13:** the criss-cross route in 5 clicks, „Airija“ (the owner said only "Ireland": no
    city) and „Mančesteris“ new, about 1 s a leg (`draw` 1,5, `delay` 0,3; the path builder's
    new `bends`/`arcs` keep round trips apart); slides 14–17 show the whole route
    (`route: 12`). His roles in Ireland and Manchester are slots (the bank holds neither).
  - **19:** made from Innoday's 4K take of its close (taken down once with Lanczos), the
    lines thickened 3 px not 5: about 27 % sharper (Laplacian variance); CRF 12 under the
    9,5 Mbit/s cap.
  - **20:** the credits page, kept but not shown; the credits left the close.

- 2026-10-23 (night) — The owner's last round, in the window: "Need this soundtrack
  spanning the histogram slides, what did we use in innoday zoomout?"; "On slide 12
  after histogram is filled indicate schematically Omega particle (quarks, some
  gluons..)"; "Slide 18 not needed, slide 19-20 has to have the same soundtrack like
  in innoday"; "And we finish on slide 20 FCC full frame - saying 'LHC - mano
  greitintuvas, FCC - jūsų greitintuvas'"; "mano appearing where LHC is and when FCC
  is in view - jūsų greitintuvas"; "also should be better resolved now fuzzy";
  "Slide 21 not needed"; "Go to completion now"; "implement all the suggestions,
  carefully review"; "not that we are in a rush". So:
  - **Music** (Innoday's `<Soundtrack>`, setup/Soundtrack.vue and soundLevel.js, with
    `+`/`-` for its level):
    - 11–12: the zoom-out's own music, the track of his SpaceEngine edit
      (public/audio/zoom_music.m4a, its 4:13 at −16 LUFS, level 0,25 under the speech);
    - 18–19: Innoday's „Starfire“ (Scott Buckley, CC BY 4.0), started low (0,3) on the
      SciFi clip, cross-faded on the close to a second file from the track's 1:22
      (public/audio/starfire_from52.m4a), so its 1:37 arrival lands where Innoday's
      did, our close being 3 s shorter; it goes on over the held last frame.
  - **12:** on the click, beside the plot, an Ωc⁰ as three quark balls (c, s, s) and
    gluon curls (setup/triplet.js); the camera a step back to make room, the labels
    moved; „Kvarkus kartu laiko gliuonai.“ added.
  - **Cut:** old 18 (the sun and Dominykas's plot; 17's bridge is now „Mūsų grupė
    dirba ir prie paties detektoriaus.“, his thesis no longer told) and old 21
    („Ačiū“).
  - **The talk ends on the close (19), at its own full framing** (scripts/close_fit.py
    --no-fit: the dark gap cut, the lines thickened, CRF 16 under 9,5 Mbit/s,
    remuxed). Over it, „mano greitintuvas“ beside the LHC ring from 43,3 s and „jūsų
    greitintuvas“ beside the FCC ring from 52 s, deck text on the clip's clock
    (setup/ClipCue.vue; the rings measured on the clip).
  - **Words over the close:** the 21 m, the HL-LHC to 2041, the cover's promise and
    the advice, then „Šis žiedas – … LHC. LHC – mano greitintuvas.“, the FCC, VU in its
    study, „FCC – jūsų greitintuvas.“, „Ačiū.“
  - **Credits:** the licence credits in tiny print over its last 1,5 s: Starfire,
    OpenStreetMap and Natural Earth, Planck, with NCSA's web and Google Earth.

  Decided without him: the zoom music's title and licence are still unknown
  (Innoday never filed them), used as he asked, to be cleared before the stream; „Ačiū“
  is said, not shown. Undo: revert the commits of 23 Oct night.

- 2026-10-23 (evening) — The review round (the owner: "Condition workable but can be
  improved. Review story telling, what can we do better? Also visuals?", then "Go
  ahead and implement all"). Two reviewers, one on the story, one on the visuals.
  Story, in the script:
  - 1: the 51 years are from the idea („rasti užtruko"), with the doubt
    („…ir neapsigavai?") and the 100 m promised;
  - 4: the turn „O dabar – į mažiausią mastą", and one superlative only (5's);
  - 8: „O dabar – LHCb." (no double „aš");
  - 11: the dice line after the reveal, so the viewer judges first; the opener
    „Mano darbe nėra vadovėlio su atsakymais gale.";
  - 12: the pentaquark gets how LHCb convinced itself in 2015 (fitted without it
    first, the 2011 and 2012 data checked apart; lhcb-pentaquark-2015-cross-checks);
    the five Ωc's later confirmations cut;
  - 13: „Tarp studijų ir doktorantūros praėjo ketveri metai."; slot 1 (11th grade)
    the one to tell; slot 3 now the outcome of his own search (answers 12's last
    line), the Bonn reason dropped;
  - 14: the student triad as one sentence; 15 ends „– ir tau.";
  - 18 → 19: „Mūsų grupė dirba ir prie paties detektoriaus.";
  - 19: shorter, the flag „į šį vaizdą įpiešėme";
  - 20: the HL-LHC to 2041, „Tada tau bus apie trisdešimt." (cern-ls3-hllhc);
  - 21: the advice moved here to close the cover's promise („Pradžioje žadėjau…
    Mano kelias … nebuvo tiesus.").

  Visuals:
  - `look: broadcast` (dropped on 8 Oct when the talk was "not TV");
  - the readouts 50 px higher (`--kk-floor` 200 px);
  - the funnel 8 rings and 10 lines (15 and 16);
  - the cavern floor alpha 0,45, step 3;
  - Lithuania's outline size 5, alpha 1, dim 0,5;
  - 15 arrives close on the 1 TB sphere and draws back;
  - the 100 000 TB ball lighter (#8fb2ff);
  - no vault web on 15–17;
  - the zoom 17 s without the Sun and the flight inside the galaxy, its cloud
    whiteout toned down;
  - the SciFi clip without its dark first 3,5 s;
  - slide 18's sun closer, with Dominykas's own plot on its click;
  - the close's ending reworked for the camera.

  Not applied: slide 10's camera lift (pitch −13 → −8, the reviewer's unchecked
  guess; it would undo the eye-level view); where he stands stays his to decide.
  Undo: revert the commits of 23 Oct evening.

- 2026-10-23 — The ending (the owner, in this window: "Don't need second to last
  slide, better take 2 last slides from innoday just zoom out to lhc / fcc, not the
  globe"). The masterclass slide (old 19, the second sun) is cut; in its place
  Innoday's two last shown slides: its 20 s `lis_flag.mp4` (the whole SciFi module,
  then the flag; not the library's 10 s copy this release held, because the close
  starts from the 20 s cut's last frame, correlation 0,998) and its recorded close
  `close_home.mp4` cut at 57,2 s, where the camera rests over the LHC/FCC map
  (`close_lhc_fcc.mp4`; the fly-off to the globe starts at 57,5 s). Both fade, muted,
  no advance-on-end. „Ačiū“ (the five-quark form) stays last: he named only the
  second to last. Read as his ask, though he cut the SciFi clip from the middle of
  the talk this morning. Decided without him: old 16's SciFi words on 19; on 20 the
  LHC and FCC named, the FCC decision „apie 2028 metus“, VU's part in the FCC study
  (lt-fcc-unis), and the organisers' advice from the cut masterclass slide
  („Nebūtina jau dabar žinoti, kuo būsi …“); the masterclass itself is no longer
  told; slide 18's bridge „Pradėti galima dar mokykloje.“ → „O štai dar viena
  dalis, prie kurios dirba mūsų grupė.“ +0,9 min: 12,9 timed, about 14½–15½
  delivered with his slots, at the slot's edge.
- 2026-10-23 — The zoom, round 2 (the owner: "Silent, maybe some swoosh, also
  needs stabilization"; "The source, but on speedup it doesn't look good"). The
  edit's camera sways by screen widths over 10–20 s, a shake at 30–55×, more than any
  crop can take out, so `scripts/remap_zoom.py` now plays six steadier stretches
  joined by 0,4 s dissolves (Google Earth to the clouds; the Earth from space; the
  Sun; inside the galaxy; the galaxy whole, ~1,8 s; the web) and stabilises each
  onto a smooth path within a corridor of the real one (`scripts/zoom_motion.py`,
  OpenCV; crop at most 1,12). Google Earth's logo and providers' line are filled out
  of the frame before it moves and pasted back fixed, so they stay readable and
  whole. Four review passes by a subagent over the frames and the measured motion.
  Silent in the deck; a swoosh that follows the speed (`scripts/zoom_swoosh.py`) is
  a review copy for him.
- 2026-10-23 — The zoom (the owner, through the Scheduler: "Can we do a quick
  zoomout from vilnius straight to universe web - in 20s"). New slide 2 after
  the cover: Innoday's opener (his SpaceEngine edit spaceengine/nftmc_zoom.mp4,
  its first 253,42 s) time-remapped to 19 s plus a 1 s hold on the web, 1080p50
  (`scripts/remap_zoom.py`; the speed keys after two subagent passes over the
  frames give Vilnius ~0,8 s, the Earth whole ~0,55 s, the galaxy whole ~1 s, the
  web from 14,4 s; up to 55× through the dark). It ends on the source frame
  slide 3's still is (correlation 0,998), so the clip's fade out (`transition="fade"`,
  as Innoday's) shows the same picture underneath, and slide 2 cuts the camera to
  the takeover pose. No advance-on-end. Decided without him: no sound (a review
  copy with his edit's music at −24 LUFS under it is in this window: his call);
  the cover's last line „Bet pradėkime nuo Vilniaus.“ (was „…nuo visos
  Visatos.“); four spoken names over it (Saulėtekis with „Čia dirba Vilniaus
  universiteto fizikai“, Žemė, Saulė, Mūsų galaktika; Lithuania is not shown as a
  country, so not named); the Google Earth logo and providers left in the
  footage, as Innoday's, though at this speed the providers' line is up for
  well under a second (a tiny-print line on „Ačiū“ is his to say). The CMB
  disk's decode latch (afterCover.js) now waits for slide 4, so it does not
  stall the clip. +0,35 min: 12,0 timed. Undo: revert 3587200.

- 2026-10-23 — The owner's cuts, in this window: "Don't need scifi module, a
  bit too much histograms, just show one with not a lot of data (show days /
  years of collection increasing) then show the 5 omega resonances also with
  time ticking of when this was collected." Cut: the SciFi clip (old 16), the
  pentaquark plot (old 12) and the two plots at one scale with the rule (old
  13); 22 → 19 slides. The toy keeps its two clicks (the bump drowning is the
  "collection increasing"); its counts give way to a clock of days, „0 dienų“ →
  „4 dienos“, then „0 dienų“ → „100 dienų“ for the 3 500 (35 dots a day in
  both, an illustration said with „tarkime“). The Ωc plot's count gives way to
  the year the landing data were recorded, „2011 m.“ → „2012 m.“ → „2015 m.“,
  then the span „2011–2015 m.“ once full (not a lone 2015 beside the five), switched at the sample's luminosity shares (1,0 / 2,0 / 0,3 fb⁻¹: 30 %, 91 %;
  `lhcb-omegac-2017-years`), and it fills at a steady rate (`curve` 1, was 1,8)
  so the years tick as the data came. The clock is `<FillClock>`
  (setup/FillClock.vue), which reads the plot's landed share (grains.js
  `fillShare`), so it cannot run ahead of the dots; without WebGL it keeps its
  own time as the plate does. Decided without him, kept from the cut slides:
  the discovery rule (spoken on 11, no on-screen number: "too much"), the 2015
  pentaquark after 51 years and „Pentakvarkų ieškojau ir aš.“ (spoken on 11:
  the cover's question and slides 14 and 19 lean on them), and the coordinator
  line (moved to the Lithuania slide, 13). Undo: revert 4c848d7.

- 2026-10-22 — The pre-filming round (notes/review.md). The owner, on the review:
  "There might have been this rule about no captions, now the histogram slides
  are totally without context", then "Focus on story telling take or add
  anything you need having in mind the format and time contraints and
  everything". So: the histogram slides 10–13 get naming labels (the axis word
  „masė →“, the counts, „LHCb duomenys“ against the computer's dots, the peaks
  counted at their click, the 5σ rule as „< 1 iš 3,5 mln.“ on 13): the
  pictures-and-numbers rule stands, a name of a word or two for a thing shown
  is within it. Slide 20 (the tape robot: the slots moiré on camera; 20 s)
  dropped; cut for time: slide 8 moves on 3 s after his line (not at the reel's
  end), the Brown preprint (21→20), the first-public-files aside (22→21), one
  sentence on 10. The deck is 22 slides. The labels (subagent, checked by shots and `talk safe`) reframe 10 and 12 so the words fit under the axes, and slow the second sun (21) to a 450 s turn, drawn back to dist 45, so its names stay in the safe box. Undo: 7713925 and the label commit after it.
- 2026-10-22 — No PPTX (the owner: "no pptx"). The studio runs the live URL,
  the venue zip as the fallback; `talk pptx` is not run and the pin stays
  v0.8.3. The cover's `<PptxButton />` stays: it shows nothing without
  `videos/pptx.json`.
- 2026-10-22 — The broadcast safe box (x 98–882, y 55–408 of the 980 canvas,
  37 px type floor; `talk safe` for a talk marked `broadcast`): the text
  area's edge `--kk-x` 72 → 104 px and floor `--kk-floor` 84 → 150 px, the
  readouts and the shared opening's caption on it; names, units and the cover
  line at 38 px. Labels projected from a pose re-projected after a reframe:
  11 (drawn back, dist 23), 13 (dist 26), 14 (the `whole` pose moved 5,5
  south: `[1201, 0, 2.5]`, dist 36, pitch 60; `whole` itself is unused now),
  17 (the 1 TB sphere left of x 800, its label 0.12), 19 (13 west, the 100 PB
  sphere clear of the readout), 22 (the sun's names at labelH 0.1, the camera
  back to dist 37,5, and the sun turns at 300 s instead of 100, its items
  started 219 s along their orbit: at the old turn no pose keeps
  „Meistriškumo pamoka“ in the box; the sun is about 20 % smaller and slower).
  Soft shades behind 9's readouts (they stand on the detector's wireframe now)
  and a larger one behind 5's caption. Undo: the commit 6eda07d and 13c0b43.
- 2026-10-22 — `lis_flag.mp4` talk-owned: the library's 10 s copy, byte for
  byte, on this talk's release, so `videos:check` passes on any CLI and the
  clip no longer depends on the library chain. Innoday's 20 s cut stays
  Innoday's.
- 2026-10-22 — The tape library cut (slide 20's TODO, cleared): from a frame
  sheet, CERN-FOOTAGE-2022-013-006's last shot, 1:48–2:02 (14 s): the tape
  library's aisle, the robot's carriage running down it. Silent (`silent-loop`;
  under speech). Talk-owned, same name as the library copy; encoded from the
  Drive raw, published to the talk's release, its dust strip committed.
- 2026-10-21 — The LHC dipole magnet (the owner, through the Scheduler: "can
  show magnet video from CERN (somewhere in google drive)", the file
  cern_video_2019_050_008_1080ph265.mp4; then in this window "A, ok" to cut A
  and to its labels; his third answer, whether to drop the data-centre slide if
  the talk runs long, not given, so it stays). New slide 6, between the
  tunnel's push and the collision: the first 10,8 s (a cutaway of the
  cryostat into the two beam pipes; the film dissolves to its vacuum part at
  11 s), its English/French labels kept, silent. Talk-owned, same name as the
  library's full-length copy so this release wins; encoded from the Drive raw
  (in the worktree's gitignored `videos/raw`), published to
  `videos-2026-10-26-uzsikraukkarjerai`, its dust strip committed. The tunnel's
  bridge „Štai vienas toks susidūrimas.“ moved to the magnet slide. New fact
  `lhc-two-beam-pipes-opposite` (home.cern). Every later slide is one higher;
  the notes, comments and credits renumbered. Undo: delete the slide and the
  manifest entry.
- 2026-10-21 — The 15-minute round (the owner, in this window: "Build", to the
  proposal of the same day; his photos for the road and the Keynote copy were
  not answered, so: no photos, the slots stay spoken; the Keynote/PowerPoint
  copy is made on Friday with the recordings). Built:
  - **8, inside LHCb** (new): Innoday's model of LHCb's Run 3 geometry with the
    1,83 m person (main 404f3a7: `setup/detector.js` → this talk's, on its grain
    bus and `disk` latch, grains file not fetched; its floor and cradles from
    `emblems.js` → `setup/cavern.js`, `floor` renamed `cavern-floor`, since
    OpenData's `floor` is this talk's); station `cavern` at [1000, −480, 0] with
    Innoday's `thanks` objects (collision `inside`, LHCb's own 2012 event, the
    default of components/lhc-opening); `<InsideLhcb>` starts it once the
    camera has craned down (y < −482), and freezes the world at the crossing
    as Innoday's; the 40 MHz glow is the detector's `cascade`. „100 m“ counts up
    during the crane (the title's depth, `lhcb-100m-below-ground`), then „40 mln.
    per sekundę“ on the dolly back. The mass lines moved here from 7, which now
    lets the reel's music run. No magnet line: the outreach page did not answer.
  - **9, click 2** (new): `th2`, the 3 500-dot sample of the same random
    spectrum (theta-toy.json's `large`, back from before 18 Oct), fills where
    `th1` was and lights the tick over the same column: the bump is gone. 10's
    smoothing sentence now says only what real particles do (no repeat).
  - **15, the group's part** (new): the library clip `lis_flag.mp4` (Innoday's
    10 s render, the flag Innoday's touch, both said in the script); the
    coordinator bridge moved here from 14. Not a real photograph: my proposal
    called it real footage, corrected the same day.
  - **19, the data centre** (new): `cern_footage_2022_013_006.mp4` whole until
    Friday's cut (TODO mark, so `lint --release` stops a deploy without it);
    about 60 000 tapes, over a million terabytes (`cern-exabyte`).
  - Spoken now (the blueprint's "If there is room"): 2's web line, 6's CMS line,
    10's five-at-once and the four confirmed, 20's Brown preprint, 21's first
    LHCb files for masterclasses; held silences of 4 s on 12, 3 s on 22.
  - `duration: 15min`, the `info` block, slide references renumbered.
  Undo: `git revert` the round's commit; the 20 Oct deck is 3c7c655.
- 2026-10-21 — No `advance-on-end` on any clip unless the owner asks for that
  clip by name (his standing rule, 21 Oct, after OpenData's "autoclick";
  through the Scheduler). Stripped from slides 4 (`cern_overview_short.mp4`),
  5 (the tunnel) and 7 (`lhcb.mp4`); the notes now say → at the clip's end
  (a clip holds its last frame; the push exits still run on the speaker's →).
  `slidev-stage-record` drives the deck itself, so the recordings are
  unchanged. Undo: none wanted; ask the owner per clip.
- 2026-10-21 — The title back in the headmatter: `title:` is the owner's
  „Kas vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po
  žeme“ (the 16 Oct „Užsikrauk karjerai“ tab name replaced); still no title
  slide or h1. Kept his capital „Pasaulyje“ as given.
- 2026-10-20 — Blueprint v2 built (the owner, 20 Oct, on v1: "This will
  need to be reworked a bit…"; asked what is off: "10-15min talk"; then:
  "Taking elements from innoday and open data set up a good story telling
  for highschool students with some personal touches about me, my career
  path. Finish to completion"). Reading taken, not asked again: the talk
  must fit 10–15 min as delivered (speech runs 15–25 % over a script on
  camera), so v2 is 9,9 min scripted at 115 words a minute with clips,
  fills, flights and pauses counted, about 11,5–12 delivered, 12–13 with the
  slots; the Innoday and OpenData elements stay as built; the career path is
  a thread (the road's bridge „Pentakvarkų ieškojau ir aš“, Bonn, Vilnius,
  the 800 TB as the speaker's own work, Dominykas, the masterclass) scripted
  only from the bank; the five unverified personal lines (Egyptologist until
  12, CERN in 11th grade, the Glasgow job, the lasers, the pandemic move) are
  three optional owner slots on slide 12 in the lint's optional-mark form,
  outside the scripted time, stating nothing. Workflow wf_f555b9e0-58b (four
  diagnoses, three reworks: tight-spine 132, one-dot 134, who-does-this 133;
  three judges; editor; three verifiers; fixer); base one-dot with grafts.
  Changes from the deployed deck: 20 → 19 slides (deployed 10 folded into 9
  as a click; v1's new slide 11 never built), clicks on 8 and 9, `oc` light
  blue (#9fd0ff) so gold means the pentaquark family, „59 453 masės“ under
  the Ωc plot (`<AfterFlight :delay="25">`), „8 TeV“ hidden by talk CSS, the
  800 pile's world label removed (the readout says it once), „>“ before
  100 000 TB, the cluster „Bakalauro darbai“, „daugiau nei kilometro“ for
  the laptop stack, 2003 told on 8 right after the viewer's own „Ne“, the
  viewer asked twice, every slide ending on a spoken bridge. Two worked
  facts filed from in-repo sources (theta-toy-140-entries,
  opendata-sun-plots-from-records); the six public gaps went to
  talk-research-gaps (wf_c44c35d0-786). Undo: `git revert` the build
  commit; v1 is f840ac0, the 18 Oct deck a60d0fa.

- 2026-10-18 — Flow overhaul for high-school viewers (the owner, in this
  window: "need a much better flow. And oriented at highschool students"):
  `notes/blueprint.md` (talk-blueprint run wf_acba6022-08d). The spine
  question is asked on the cover, answered in the same words on the
  two-plots slide and through the particle at the close; every slide's notes
  end with a spoken bridge into the next picture. Tally 224 (one-question),
  216 (the-particle), 213 (student-path); the editor merged one-question with
  grafts from the other two. Its own decisions are logged in the blueprint.
  Held for the owner's yes before any deck change.

- 2026-10-18 — The owner's four changes (to the Scheduler, relayed 18 Oct;
  "Up to 15 min"; copied from the other branches, which are unchanged):
  1. "take the still cosmic web from the innoday, and compy the funnel as well":
     slides 2–3, after the cover, before CERN from above (the Scheduler's
     reading; it asked the owner about the web's place). From feat/innoday-cern
     d80ea9a: `public/figures/opener_last.jpg` (the still), `cmb_disk.jpg`,
     `cmb_disk_1024.jpg`, `cmb_wmap.png`, `setup/takeover.js`,
     `WebTakeover.vue`, `funnel.js` (its `at` 2 here), `view.js`,
     `AfterFlight.vue`, and `afterCover.js` cut to its `disk` latch (flipped by
     <WebTakeover> in the still's 0,45 s hold: no clip before it here). The
     funnel station is Innoday's, at [30, 40, −110], with Innoday's poses. No
     hum (this talk's). Slide 3's words: Innoday's „13,8 mlrd. metų“ and its
     bridge to CERN (Innoday's slide 6). The cover's last line now „Bet
     pradėkime nuo visos Visatos.“ Provenance: credits.txt (the Planck map's
     CC BY-NC 3.0 IGO; the NCSA web).
  2. "slide 9 not needed": the LHCb event display is gone (its licence
     question with it); `lhcb-event-run3.jpg` removed.
  3. "slide 7-8 just show such histogram with omega c resonances, nicely
     resolved": slides 9–10 fill `oc` at a new station `omegac` (x 1650)
     with LHCb's m(Ξc⁺K⁻), then tick its five narrow peaks. The data: PRL 118 (2017) 182001, Fig. 2 (no HEPData record; CDS's figure macros sit behind a bot check): the vector figure's 1 MeV bin contents read from its drawing commands (integers within 0,001; the error bars √N), summed to 2 MeV (equal to the paper's Fig. 3 bin for bin), 2960–3300 MeV, 59 453 candidates, `unit: 2`; ticks over the five peaks' tallest bins. Facts `lhcb-omegac-*`, `omegac-quark-content`, `kaon-quark-content` added (research run, 18 Oct). The 2003
     LEPS claim moved into slide 12's words (two sentences), where the 4,6σ
     needs it; slide 11 now introduces the pentaquark (1964). `th2` removed.
  4. "Slides 14- the end, we need to replace. Show something about open data,
     and masterclass. That everyone can use this.": slides 15–19 from
     OpenData's slides 7–9, 11 and 12 (feat/opendata-talk 1e52d06): its data
     world (`floor`, `lineup` `scale`, `dataspace` `vault`, `sun` `sun` and
     `vilnius`) as station `store` at x 2600 (OpenData's x 20; every pose
     shifted +2580), its 1,3 EB pile left out (not shown; 1,3 M spheres
     saved), three `clear` capsules added for this talk's flights. Code:
     `setup/piles.js` (OpenData's `lineup` and `floor`), `dataspace.js`,
     `weave.js`, `sun.js`, on this talk's bus; 19 of its 20 plots in
     `public/figures/opendata/` (calo-3, a bright filled map that outshone
     the piles, is an empty place here); both suns without OpenData's
     caption box (`keepOut`); the second sun's names at `labelH` 0,048
     (the 18 px floor). Shots review: 15's pose from the front (the 1 TB
     sphere in frame), 20's „Ačiū“ beside the form, 3's age on a soft shade,
     9–10 framed with the lower third clear. Slide 18 has no caption („Naudotis gali
     kiekvienas“ is said, the Scheduler's reading); slide 19 keeps two of the
     nine names („Meistriškumo pamoka“, „Magistro ir bakalauro darbai“), the
     rest empty places, at OpenData's searched positions; no masterclass
     dates. Dominykas is said on slide 18 (his slide went with 14). Gone: the
     thesis slide, the three-things slide (BL4S with it), the question for the
     week and the faces ring (`team.js`, `thesis.js`, `beam.js`, the 15
     portraits). Slide 20 is „Ačiū“ over the cover's five-quark form until the
     owner says (the Scheduler asked about a closing „Ačiū“).
  Undo: git revert of the round's commit.

- 2026-10-16 — No title (the owner to the Scheduler: "Don't call it
  'vadovelio gale atsakymo nera' don't need that"). Gone: the cover's h1, the
  headmatter `title` (now „Užsikrauk karjerai“, the tab's name), the
  package.json description, credits.txt's heading, this file's heading, and
  slide 1's textbook framing („Mokykloje … vadovėlio gale. Mano darbe tokio
  vadovėlio nėra.“), its section mark (now „I. PRADŽIA“) and Message. Kept, on
  the Scheduler's reading: the cover's name line over the five-quark form (the
  owner asked for the cover on 15 Oct), now 30 px as the cover's only text;
  the greeting and „Bet pradėkime nuo CERN.“ notes/outline-v5.md stays as
  history. Not touched: the root CLAUDE.md row (the owner's word is needed)
  and tests/test_talk_copy.py (Tools'). Undo: c538633's deck.md slide 1.

- 2026-10-15 — The owner's answers, relayed by the Scheduler in its window
  (the owner's words quoted):
  - "Cms opening": slide 4's CMS collision stays.
  - "No dates for masterclass": slide 15's spoken line drops the two past
    dates and „jau dvejus metus“; the dates stay in its sources line only.
    Undo: 3948c6b's slide 15 notes.
  - "Length - up to 15min": nothing padded; about 9,7 min by the notes.
  - "Show my path around europe, then stress all of this can now be done in
    Lithuania". Slide 12: the route draws leg by leg with the told stops (4
    clicks: Glasgow, home, Heidelberg and Bonn, home), and „Glazgas“,
    „Heidelbergas“ and „Bona“ are back on screen (gone since 10 Oct's fewer
    words), each fading in as the trail reaches it (`.city.step`,
    `--step-delay`). The open-data job (100 000+ files, about a petabyte,
    1,5 years) moves from slide 13 to Bonn, where it was done. Slide 13 opens
    with „Visa tai dabar galima padaryti Lietuvoje“ and the bank's facts behind
    it: CERN associate membership since 2018 (Lithuanians may apply for CERN
    jobs), VU in LHCb since 2024, a group mostly of students up to PhD, the
    first VU doctoral student on LHCb searching for pentaquarks (unnamed: the
    group's consent question is still open), 13 VU students at CERN this
    summer, a record. The 20–40 flights line went: it worked against the
    point (and came from an automatic transcript). Undo: 3948c6b's slides 12–13
    and `.city.step` in styles/index.css.
    The picture follows the point: slide 13's camera dives from Europe to
    Vilnius (dist 15, about 2,4 times closer; the CERN label is out of frame
    and gone), and Lithuania's outline fades in round it, light blue (a
    second `map`, `lietuva`, from Natural Earth 1:50m admin 0 via
    scripts/make_lithuania.py; a named map shows from step 1, hidden on
    every other slide). Undo: drop the `lietuva` object and the steps.
  - "No need for small print at all" (to Innoday): the Scheduler is asking
    whether it covers every talk's credits; this talk's are unchanged until
    it says.
- 2026-10-15 — The tunnel caption's shade (slide 3, `.lhc-tunnel::before` in
  styles/index.css) stays this talk's own. The owner said yes to it for
  OpenData, which copies the rule; components/lhc-opening is untouched. After
  26 Oct the lhc-opening lift folds the shade into the module and drops both
  copies (the Scheduler).

- 2026-10-15 — "Open data and innoday talks are really good, take elements from
  them and finish this one off" (the owner, in this talk's window; AFK
  protocol: the recommended option at each choice, all of them listed for the
  owner below). Built from a study of both decks and an adversarial review of
  the plan (three lenses: the owner's rules and the story, facts and
  Lithuanian, engineering); scratch notes are outside git. Taken, slide by slide:
  - **Cover** (slide 1; OpenData's and Innoday's, which the owner granted them on
    12 Oct: "open data and innoday need cover slide after all"): the title and
    the name line over the five-quark form gathering, as on Innoday's. It
    reverses this talk's 10 Oct removal of the cover's title and name; the owner
    named only OpenData and Innoday then, so it is the first question below. No
    date (the review: a kicker, and filming 26 Oct vs the stream 27 Oct). The old
    black standby and the second cover (old 5) are gone; the cover's spoken
    intro is old slide 5's, and its promise („tokį darbą šiandien išbandysi ir
    tu“) moves to slide 6, just before the viewer judges. Undo: headmatter
    `layout: default`, drop the h1 and the byline.
  - **The way in** (slide 2): OpenData's CERN from above, the library clip used
    by name (its strip and poster copied from OpenData, no manifest entry). The
    LHC and LHCb words are spoken over the opening (the morning list's first
    item): the LHC line on 2–3, the LHCb line near the end of the reel (5); the
    event display (9) keeps only how a collision becomes a dot, and the
    matter/antimatter clause goes (one question). Undo: git 2bc8262's deck.md.
  - **The collision** (slide 4): the CMS 4π crossing that the owner chose for
    OpenData ("the collision should be more in focus, it was blurry until the
    last frame") and Innoday also uses, with OpenData's `rate`/`path` keys and
    „290 dalelių“; the notes say it is CMS's. Undo: drop `"event": "cms"` from
    the `opening` object and restore 2bc8262's slide 3 keys and count.
  - **Dominykas** (slide 14): OpenData's thesis slide (portrait, the thesis and
    his name, his m(J/ψ p) filling, grains rising from the peak,
    „16 400 skilimų“: the fit's 16 406,6 ± 161,7 rounded as its error allows,
    where OpenData shows 16 407), without OpenData's sentence and kicker (fewer words; the visual review
    found the kicker at 12,5 px, unreadable on a stream; „apgynė bakalauro
    darbą“ is said). The grains from his peak gather into this talk's own
    five-quark form (a second quintet, `pq2`, as on the cover) instead of
    OpenData's constellation bubble, which read as a different symbol and burned
    white; the rise is softer (600 grains, warm). New lines for 15-year-olds instead of the award jury's: the
    same public data the speaker prepared, the bump in the same place, and the
    thesis's own caveat (a qualitative check, never "observed"). New fact
    `stonkus-bsc-2026-yield`, read from the thesis (Fig. 14: N_sig =
    16 406,6 ± 161,7; §3.2: 4,4–4,5 GeV; "nėra galima interpretuoti kaip
    pentakvarkų stebėjimą"). Undo: delete the slide and the `thesis` station.
  - **What you can do** (slide 15): over Dominykas's plot, drawn back and dimmed,
    instead of OpenData's sun of named clusters (the review: rays from the
    pentaquark to three opportunities carry no meaning, and the sun's layout
    needs an annealing search). The masterclass is „LHCb meistriškumo
    pamokos“, OpenData's term („klasė“ gone; the consortium says „dirbtuvės“), told as
    past dates (6 Mar 2025, 26 Feb 2026), not a promised 2027 month. BL4S:
    proposals from December 2026, the deadline in March 2027 (the day still
    unpublished; new fact `bl4s-2027-call`); the age as „dažniausiai 16–19“
    because younger pupils may take part with consent.
  - **Close** (16–17): the question stays alone over the held form (this talk's
    8 Oct rule), then OpenData's close: „Ačiū“ over the LHCb Vilnius group's 15
    portraits of grains running round a gold beam. Undo: delete slide 17 and
    the `team` station.
  - **Working day** (13): the open-data numbers follow the bank („daugiau nei
    šimtą tūkstančių failų“, „beveik petabaitą“, „apie pusantrų metų“) and the
    coordinator role is spoken; no role box (the review: the name twice and a CV).
  - **Look and sound**: OpenData's true black ground and crisp options
    (`bg #000206`, nebula 0.12, no film grain or fringes, vignette 0.7, bloom
    0.42) and `videos.dustFrom: start`; the hum off as in OpenData (the owner on
    Innoday's: "only 2-3s please"). Undo: the headmatter of 2bc8262.
  - **Slide 7**: the 2003 bump's bin lights (`th1` marks, step 2), as outline v5
    had it; theta-toy.json gains its `bin`.
  - **Code** (copied, not shared): OpenData's `portraits` (with ring.js and
    beam.js) and its thesis histogram with the rise, on this talk's one bus;
    Innoday's stale-tab reload; the CMS event imported at boot.
  Not taken: OpenData's data-space piles and sun, Innoday's section slides,
  NFTMC opener, cosmic history, funnel and takeover (a second subject), the
  LHCb Week photos (their credit is unconfirmed), the collaboration photo slide.

- 2026-10-13 — No transition sounds. The owner, to OpenData after the boom
  went: "transitions were like driving sounds". The stage block has
  `sound: { flight: false, clip: false }`: no whoosh on a camera flight, no
  rising tone as a dust clip condenses (OpenData and Innoday did the same).
  The sounds that stay are the hum (slides 1 and 3 have `hum: false` anyway),
  the tunnel clip's own audio, the LHCb reel's music, and the opening's swell,
  thump and drone through `ctx.audio()`.
- 2026-10-11 — The shared LHC opening (components/lhc-opening/, built by
  OpenData; the owner: "start with the real video of LHC, then go into it, make
  everything black and show really exciting collision ... then we go to 3d lhcb
  video, then the two talks diverge"). Slides 1–4 are OpenData's opening as its
  README asks: a black standby; the tunnel (an 18 s cut of
  CERN-FOOTAGE-2022-013-001, `exit="push"` into the beam pipe, „LHC 27 km“); the
  2012 collision („8 TeV“, „237 dalelės“; the same event and timing); `lhcb.mp4`
  (the same 39 s cut). Both clips are in this talk's manifest and on its release
  `videos-2026-10-26-uzsikraukkarjerai`, with their own strips and posters (cut
  with the v0.8.0 CLI from an extracted copy, since the editable install is at
  v0.4.0). The talk's own deck follows from slide 5, the cover.
  LHCb is not introduced twice. The old tunnel clip (5) and cavern photograph (6)
  are gone, and their words move unchanged, in the story's order, onto the event
  display (now 9). Its facts comment takes both slides' ids, and its notes say so.
  The opening's notes point there, so the owner can move the LHC and LHCb lines
  over the opening when retelling. With the cavern photograph gone, the last
  slide's credit goes too: every picture is CERN's. Notes that cite slide
  numbers are renumbered. Toolkit v0.8.0 (stage 0.5.0) for the rate, path,
  ambient and push. First version for the owner's review (AFK protocol).
  Print: a printed page's scrim takes `dim` from the deck's current slide, which
  stays at 1 on the print route, so the standby's `dim: 1` darkened every printed
  still (v0.8.0, sent to Tools). v0.8.1 reads each print page's own frontmatter,
  so the talk's print-scrim workaround is gone again.
- 2026-10-10 — Fewer words (the owner, before sleeping: "fewer words so I can
  adapt to the audience; these slides are not lecture slides"; AFK protocol,
  the recommended option). Slide 10 names only Vilnius and CERN, the route's
  anchors; Glazgas, Heidelbergas and Bona are gone, so the speaker can tell
  those stops or skip them. Slide 11 keeps Vilnius and CERN, since the slide is
  about those two places. Slide 9 keeps „140 taškų“ and „27 292 taškai“: one
  word each, the least a number needs to say what it counts.
  For the lint (main 7f6b0fe): the city names carry `.caption` and the last
  slide's credit `.credits`. The stage's `.caption` style leaves them at 45,7 px
  in the same places, with a box 6 px shorter. Lint: 0 warnings.
- 2026-10-10 — Names back, as the owner refined the rule: "numbers should have
  units or name what they are", and a thing shown may carry a short caption that
  names it, a name and never a sentence (root CLAUDE.md, main 8c7fd47). Slide 9's
  counts read „140 taškų“ and „27 292 taškai“ again, and the map's city names
  return on slides 10 and 11, at the same places and timing as before. Slide 7's
  event display stays without its caption: the speaker names it.
- 2026-10-10 — No text on screen but numbers. The owner: "No titles, statements -
  I will be there. Don't need newspaper-like titles. What can stay is the
  numbers. I will narrate myself." Then: "Don't do the small photo credits,
  it's cern license, I'm CERN user." (both relayed by the Scheduler; the first
  is the root house rule, main 1016ce2). Gone: the cover's kicker, title and
  name; every slide line and year kicker (2003, 2008, 2015, 2019 m.); slide 7's
  caption; the map's city names (slides 10 and 11); slide 12's three lines
  (the opendata.cern.ch address with them); slide 13's question; the two text
  scrims; the three credits. Kept: slide 9's two counts (bare for one deploy, then with their word again, above), the notes, and every
  camera pose and dim. Slide 8 keeps its click (`clicks: 1`): the ticks light at it.
  Notes changed only where they described text that is gone (slide 1's
  „Šalia pavadinimo“ → „Ekrane“, and the Picture lines of 1, 8, 9, 11, 12 and
  13). Provenance stays in `credits.txt`. The slide 6 cavern photo is not
  CERN's (Rosa Menkman, CC BY 2.0, which asks for attribution). Then the
  owner: "Credit on last slide tiny print" (root CLAUDE.md,
  main 51f4c3e): slide 13 carries the one credit a licence asks for, the
  cavern photo's, in the kit's `.src` footer (12 px). CERN's clip and event
  display need none. `talk lint` still warns TEXT on that line. The CSS for the removed text (`.say`, `.city`, `.photo-credit`,
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
  from the slide's pose (until 22 Oct the `whole` pose, target europe +
  [1, 0, −3]; since then `[1201, 0, 2.5]`, dist 36, yaw 0, pitch 60, sway 0,
  in the slide's frontmatter). If that pose changes, recompute them.

- 2026-10-08 — Real photographs where the story names something real: the
  LHCb cavern (Rosa Menkman, CC BY 2.0), Gell-Mann (Joi Ito, CC BY 2.5),
  Zweig (Peacearth, CC BY-SA 4.0), NGC 1300 (NASA/ESA/Hubble Heritage, CC BY
  4.0); credits on screen and in `credits.txt`. CERN's own CDS photos were
  not used: the reachable record says non-commercial, and Delfi is
  commercial. The grain galaxy station is gone (the Hubble photo replaces it).

## Figures and open items (for the speaker)

0. ~~TV or online?~~ Answered 21 Oct: "15min talk, will be recorded in a
   studio with good quality" (Brief, Delivery); the studio's answers are in
   the Brief (1080p50, a screen behind him, he clicks, sound to the mixer,
   probably no logo). Still open: where he stands against the screen (what
   his body hides), whether Delfi runs a flash check, the Keynote/PowerPoint
   copy.
1. ~~The cover's title~~ Answered 16 Oct: "Don't call it 'vadovelio gale
   atsakymo nera' don't need that". The name line stays (the Scheduler's
   reading); say if the cover should go too.
2. ~~The group's 15 portraits and Dominykas's portrait~~ Gone with slides
   14–17 (18 Oct). Dominykas's thesis is said on slide 18, not shown.
3. ~~The CMS collision on slide 4: keep?~~ Answered 15 Oct: "Cms opening".
4. Licences for the Delfi stream: the tunnel clip (CERN-FOOTAGE-2022-013-001)
   is CERN material marked for educational, non-commercial use (the owner,
   10 Oct: "it's cern license, I'm CERN user"); the event display went with
   slide 9 (18 Oct). New with Innoday's web and funnel (18 Oct): the Planck
   CMB map is CC BY-NC 3.0 IGO (non-commercial; the event is co-organised by
   Delfi), and the cosmic web still is NCSA's („Cosmic Bubble Bath“), whose
   licence is open in Innoday too.
5. ~~Their own moments for the working day~~ (answered 15 Oct: "Show my path
   around europe, then stress all of this can now be done in Lithuania";
   slides 12–13). Still: a re-listen of the transcript lines on slide 13
   („Į CERN su savo grupe važiuojame tik ypatingomis progomis“) and on
   slide 12 (the Glasgow job, „dirbau su lazeriais“).
6. ~~The BL4S 2027 deadline day~~ BL4S went with slide 15 (18 Oct). The
   masterclass has no dates (answered 15 Oct: "No dates for masterclass").
7. ~~Length~~ Answered 15 Oct: "Length - up to 15min". About 9,7 min by the
   notes; nothing padded.
8. The root CLAUDE.md talk table calls this "a Lithuanian TV talk"; the owner
   said on 8 Oct it is a private online event. Change the row to "a Lithuanian
   online talk for schools"?
9. The close (18 Oct): „Ačiū“ over the cover's five-quark form stands in for
   the faces ring until the owner says (the Scheduler asked); and the web's
   place after the cover.
10. The blueprint's research (talk-research-gaps run wf_753cedc2-696, 18 Oct;
   18 facts filed, 3 unverified). For the speaker:
   - The laptop stack: a 1 TB laptop of today is about 1,1 cm thick, so
     100 000 of them stack to about 1,1 km; say „daugiau nei kilometro“, not
     „dviejų kilometrų“ (the live deck's slide 17 still says two; fixed in the
     rebuild). `laptop-stack-over-1km-worked`.
   - „Būtent šiuose duomenyse 2015 metais iškilo pentakvarko smailė“: the
     release holds the same 2011–2012 collisions, not the analysts' own files;
     it is the 2015 peak (2019 used Run 1 and Run 2). The release is about
     800 TB (other sources: 900 TB, over 1 PB).
   - LEPS 2003: 36 events in the peak region over about 17 of background,
     so about 19 above it; 4,6σ is their own figure. „2008 metais fizikai
     jau rašė, kad tos dalelės nėra“ is the PDG review (C. G. Wohl, 2008).
   - The Ωc⁰ plot is all candidates, background included; the three quarks
     of a proton are its valence quarks; a real particle's mass comes out
     „beveik ta pati“ (the peak has a width).
   - „Kaip trijų aukštų namas“ is our arithmetic (10 m at about 3 m a storey);
     no CERN page compares LHCb with storeys.
   - 100 PB is LHCb's figure from March 2025, a lower bound: „daugiau nei“.
   - The masterclass: held 6 March 2025 and 26 February 2026; no 2027 date
     was public on 18 Oct (no dates are said anyway).
   - Not found in any public text, so the owner's own word is needed: wanting
     to be an Egyptologist until 12, the first CERN visit in 11th grade, the
     laser job back in Lithuania, the manager's job in Glasgow, and the whole
     group's move to Bonn in the pandemic. Confirmed by INSPIRE: Glasgow
     2011–2015 (undergraduate), the PhD in Heidelberg 2019–2020 and Bonn
     2020–2023.

11. The gap research for blueprint v2 (talk-research-gaps wf_c44c35d0-786,
   20 Oct; 11 facts filed, none unverified). In the script now, with their
   facts: the nucleus rung on 3 (home.cern), the decay sentence on 6
   (cms.cern: most particles are unstable and transform rapidly; the detector
   measures the stable ones) and „atsitiktiniai kauburiai išsilygina“ on 9
   (√N against N; Lyons, CERN Courier 2023); the CMB line is under If asked
   on 3 (ESA: the oldest light, about 380 000 years). Open for the speaker:
   - The cosmic web still (slide 2): no public NCSA AVL or NSF page titled
     „Cosmic Bubble Bath“ exists (checked 20 Oct); NASA SVS 10663 is the
     closest NCSA AVL piece and asks for a „NASA/GSFC and NCSA AVL“ credit.
     Name where the SpaceEngine edit's web imagery came from, so the credit
     and the stream licence can be settled.
   - The Planck map (slide 3): ESA Standard Licence on the esa.int image page,
     CC BY-NC 3.0 IGO on the sci.esa.int copies; whether a stream Delfi
     co-organises counts as non-commercial is yours (Figures 4).
   - The masterclass (slide 18): no 2026–27 LHCb date was public on 20 Oct
     (IPPOG's schedule appears from late November; physicsmasterclasses.org
     answered 500), so the script says „jau vyko“; VU's yearly masterclasses
     are the CMS ones, never „kasmet“ of the LHCb one. If you know a date
     first-hand, it goes in the private brief, not the bank.

## The world (current, 2026-10-08)

Online talk (not TV): the TV rules in earlier notes are history. Pinned to
slidev-videos v0.5.0. Palette `blue` with the talk's own violet-gold
colours; `options: { dustSize: 2.2, reach: 22, nebula: 0.4 }`.

- **Stations** (one axis, 300 apart, only one in frame): `quarks` (hero,
  `quintet`: the cover and the close), `europe` at 1200 (`map` and the `path`
  `route` Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn →
  Vilnius; pose `whole`, no sway, HTML city labels projected from it, shown
  after 8.5 s), `trial` at 1500 (`histogram` `th1` 140 entries and `th2`
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
- `talk ready` after a small edit shoots only the changed slides (`--changed`).
  It walks the unchanged ones on a held clock, which arms `jp`, `jx` and `route`
  out of view. Their 6 s fallback then fills them for about 30 engine-s, and the
  settle waits on every station. So a reshot slide 09–13 can end "not settled"
  under load (2026-10-10, slide 13; the v0.8.0 review). Recovery: delete
  `shots/.shots-cache.json` and run `talk ready` again, so all slides are shot in
  order. The toolkit fix (settle on the station in view) is with Tools.
