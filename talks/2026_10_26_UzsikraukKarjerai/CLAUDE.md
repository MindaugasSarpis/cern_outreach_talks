# Užsikrauk karjerai

Delivered: filmed 26 Oct 2026 at Delfi for the stream on 27 Oct. The full notes of the build are in
`notes/history.md`.

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

## Story (final, as filmed 26 Oct: 17 slides, 9,8 min by the lint's slide times)

Blueprint v2 (`notes/blueprint.md`) stays the spine: one dot, a particle of five quarks that took 51 years
to find, how you know you have found something nobody has seen; then the dots handed on through the
speaker's road and the group in Vilnius to the group's part of the detector and the close, „LHC – mano
greitintuvas“, „FCC – jūsų greitintuvas“. One music bed, Scott Buckley's „Starfire“ (CC BY 4.0), under
2–15; its 1:37 arrival kept for the close. The fifteenth version's 19-slide table and every round before:
`notes/history.md`.

| # | Screen | Picture |
|---|---|---|
| 1 | the name line | a pentaquark (u u d c c̄) in colour charge gathers out of the flash of Innoday's CMS collision |
| 2 | — (clip) | `vilnius_zoom.mp4`, 49 s: from NFTMC in Saulėtekis past the Earth and the galaxy's stars to the cosmic web |
| 3 | — | Innoday's cosmic web, a still that breaks into grains; the flight through it, on black |
| 4 | „13,8 mlrd. metų“ | the web pours into Innoday's funnel; atoms → three quarks → five |
| 5 | — (clip) | CERN from above (`cern_overview_short.mp4`) |
| 6 | „LHC 27 km“ | the real tunnel, muted under the music |
| 7 | — (clip) | an LHC dipole magnet cut open (`cern_video_2019_050_008.mp4`) |
| 8 | „290 dalelių“ | one real collision in the black, 290 tracks |
| 9 | — (clip) | `lhcb.mp4`: LHCb and its people; → 3 s after „Aš – vienas iš jų.“ |
| 10 | „LHCb duomenys“, „masė →“, the years, „4 TB/s“; on the press „5 naujos dalelės“ | LHCb in its cavern, its 2012 collision, the Ωc⁰ plot filling; on the press the five peaks and an Ωc⁰ as c, s, s |
| 11 | „Jutiklinis ekranas“, „1972“ | Bent Stumpe with his touchscreen (a place in the world) |
| 12 | „Pirmoji svetainė · 1990“ | CERN's first web page, green on black |
| 13 | Vilnius, CERN, „Glazgas“, „Airija“, „Heidelbergas“, „Bona“ | the criss-cross route over Europe, 5 presses; the owner's slots |
| 14 | „Vilnius“, „Mančesteris“ | the last legs home, the dive to Vilnius, the group |
| 15 | — (clip) | `lis_flag_50.mp4`: the SciFi module, its cold box, the Lithuanian flag |
| 16 | „LHC – mano greitintuvas“, „FCC – jūsų greitintuvas“, „100 m“, „~200 m“ | the live close: the flag hands over to LHCb's point cloud, the collision on Starfire's arrival, the climb to the LHC and FCC rings under the map; on the press a collision whose debris writes „Ačiū už dėmesį“ |
| 17 | the credits | kept, not shown |

## Status

- 2026-10-26 (final): **filmed** in the Delfi studio from the venue ZIP (the release's, the last built from
  fbe9feb, 315.2 MB) in Chrome on the owner's MacBook Pro M2, on the v0.8.3 pin. The sound went choppy, then
  slide 16 (the live close) went white; the stage's fallback did not trigger, and the studio captured the
  white screen. The same evening the owner got per-slide recordings of slides 15–17 with the Starfire music
  mixed in, as repair material for Delfi's edit before the stream (27 Oct, 12:00). Live: 9882d6f, the last
  deploy this file records (Pages run 40226043005, green, the URL 200). On the talk's release
  (`videos-2026-10-26-uzsikraukkarjerai`): the clips, the 11 plates, the venue zip from fbe9feb and the
  per-slide 1080p50 MP4s from d75c4fc (`2026_10_26_UzsikraukKarjerai-slides-1080p50.zip`). The owner's
  verdict on Innoday and this talk: "Innoday went really well, we improved quite a lot for uzsikrauk
  karjerai, but missed the finale with the crash, pointcloud blinking from the start and missed soundtrack
  accent. Other elements from those two are good." Why: Lessons. The toolkit's fixes go into slidev-videos
  v0.11.

Every earlier entry (18–25 Oct): `notes/history.md`.

## Lessons (26 Oct, from the talk's code on the v0.8.3 pin)

1. **The point cloud blinked from the start of 16.** setup/detector.js stores `uCrossT` / `uCascT` when a
   collision starts and never clears them on stop, so slide 10's `inside` collision left 16's `steady`
   gate off; LisFlag's grains (setup/lisGrains.js) twinkle on the wall clock outside `steady`. The plates
   start each slide fresh, so they never showed it. Rule: a builder clears its event state on stop.
2. **Slide 16 went white.** About 1.1M additive grains at tier 0 on the M2 (the detector ignores the grain
   budget at tier 0); the stage has no fallback on slowness, and a crash of the GPU process sends no
   context-lost, so nothing fell back. It was foreseen: Innoday's notes, 22 Oct, "MacPro M2 can't quite
   handle the final slide"; Innoday's close was a recorded clip and played fine from the zip on the same
   M2. Rule: a heavy finale is a recorded clip unless a rehearsal of that slide on the show laptop, from
   the venue zip, is logged; a per-slide grain budget (~600k at tier 0).
3. **The soundtrack's accent was missed.** Two clocks: the music on the audio clock; the world, its
   collision and `drop clock: 'world'` on world time, which lags whenever a frame takes over 83 ms;
   `sync-to` checks once; the fades run on rAF. On a struggling machine the collision drifts off the
   1:37 arrival. Innoday's drop slaved the muted close clip's playbackRate to the music: one clock.
   Rule: never time an accent off the world clock.

## Reuse index

Paths are under `talks/2026_10_26_UzsikraukKarjerai/`. Read Lessons first: on v0.8.3 these pieces carry
the three faults.

- **The live close** (slide 16): `setup/accel.js` (the `accel` station: Innoday's OSM map as the surface,
  the LHC 100 m down with its beams, the FCC dashed at ~200 m, the shafts; `word`, a collision's debris
  gathering into a line of text), with `setup/InsideLhcb.vue`, `setup/cavern.js` and `setup/detector.js`.
  Record it as a clip for a show; clear `detector.js`'s collision state on stop before using it live.
- **The LisFlag hand-over**: `setup/LisFlag.vue`, `setup/lisGrains.js`, `setup/data/lis.json`: the
  clip's last frame (`lis_flag_50.mp4`) turns to grains at its place in LHCb's SciFi and shrinks to the
  detector's scale (Innoday's LisTakeover cut down; SSIM 0,986 against the clip's last frame).
- **The colour-charge pentaquark cover**: `setup/pentaquark.js` (u u d c c̄ in colour charge, gluon
  springs, the sea's pairs, a skin), `setup/coverCollision.js` and `setup/CoverCollision.vue`
  (Innoday's CMS loop far behind, a burst every ~34 s; the form gathers out of the first flash).
- **The music bed**: `setup/Soundtrack.vue` and `setup/soundLevel.js` (`+` / `-` for the level; `start`
  so a reload picks it up; `drop` with `xfade`, `out` and `fade`; `on-click`; `clip-at`);
  `scripts/starfire_bed.py` builds a bed from one track (one-bar cross-fades on its bar grid, −16 LUFS);
  `public/audio/starfire_bed.m4a`, `starfire_finale.m4a`, `starfire_downbeat.m4a`.
- **`setup/slideHooks.js`**: an `onSlideEnter` that runs once a visit (Slidev's own is a watchEffect and
  re-runs on a press: `watch(useIsSlideActive)`).
- **`setup/WorldLabel.vue`**: a label pinned to a world point, smoothed and placed by a sub-pixel
  transform (no jumping).
- **`scripts/remap_zoom.py`**: the owner's SpaceEngine zoom (4:13) remapped to any length (`TOTAL`), its
  steady stretches held, two warps; `scripts/zoom_hum.py` the low hum under it.
- **The TV checks**: `broadcast: true` in the headmatter (`talk ready` runs `talk safe`: the safe box
  x 98–882, y 55–408 of the 980 canvas, a 37 px type floor), `stage.look: broadcast`, `stage.motion:
  floor`, plates and stills, the per-slide 1080p50 MP4s of `talk record`; skill talk-broadcast.
- Also: `setup/DataSfx.vue` (the data slide's sounds), `setup/ClickPose.vue`, `setup/FillClock.vue`.

## History

`notes/history.md` holds, moved verbatim on 26 Oct: the fifteenth version's Story, the Status log
(18 Oct to 25 Oct), the Decisions, Figures and open items, and the 8 Oct world. Also in `notes/`: the
blueprint, the fifth outline, the 22 Oct review.
