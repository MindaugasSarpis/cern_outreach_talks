# Innoday (talks/2026_10_23_Innoday)

Delivered on 23 Oct 2026 ("Innoday went great! And it's very good content"); parked. This file keeps the
Brief, the arc as given, the delivered Status with its leftovers, what worked and a reuse index. Every
earlier Status entry, the World, the Decisions, the Figures and the old `HANDOFF.md` (8–12 Oct) are in
`notes/history.md`, moved verbatim on 26 Oct.

## Brief

„Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų
pritaikymo privačiame sektoriuje“, Innoday 2026, in Lithuanian, for an
innovation-day audience (business, policy). Venue, 16:9 projector. Slot about
25 min or more (owner, 2026-10-08); the deck runs ≈ 23 min by the notes'
timings (`talk lint`, 13 Oct), the 4:13 NFTMC opener included (1:26 longer
than the one before).
Date: 23 October 2026 (owner, 11 Oct). The dir and the Pages address carry it
since 11 Oct (owner: "Change web addresses as well, I don't share this with
anyone"); the videos release tag keeps `videos-2026-10-00-innoday` (a storage
name, renamed later if at all). Speaker: Dr. Mindaugas Šarpis, LHCb Vilnius, VU.

## Story

One spine, retellable in a breath: to see what the world is made of,
physicists needed a machine nobody could buy; each of its limits had to be
broken; the solutions left CERN as things in daily use; the next machine (FCC)
brings the next round, and Lithuanian firms can solve it.

- **Opening.** The title (owner, 12 Oct: back), then the zoom-out from
  NFTMC in Saulėtekis to the cosmic web (the owner's SpaceEngine edit,
  `nftmc_zoom_web.mp4`; it waits for the press at its end) → the takeover (its last frame, the web, becomes the world's
  grains) → the web's grains fly into a funnel, which resolves into the history
  of the Universe as a funnel of grains, its mesh coming in last, seen from outside
  (Big Bang, CMB, dark ages, a band of hot proto-galaxies, then colder, sparser
  galaxies) → the dive back to the CMB (380 000 metų) → pulled back: the
  question „Iš ko visa tai sudaryta?“ (spoken). The low hum only as the funnel
  and the dive begin, ~3 s each (`<ShortHum>`).
- **The machine and LHCb.** CERN overview clip → the LHC tunnel in motion with
  its four numbers (pushes on into) → one collision in grains (shared
  components/lhc-opening; the owner's CMS 4π pick, a 2012 Higgs candidate,
  `"event": "cms"`) → the LHCb 3D animation with its music (`lhcb.mp4`) → LHCb in numbers
  over the collaboration photo (4 TB/s, ~1 900 narių, 112 institutų, 28 šalys)
  → LHCb's results floating as eight figure sheets, „875 straipsniai“.
- **„O kur tai pritaikoma?“** (section). The ring with six strands of grains,
  each from the part that forced an invention to the invention's photo at its
  end (StagePhoto place mode), each named with its year and machine:
  touchscreen (1972, SPS), the web (1989, LEP), the first server (1990, LEP),
  PET (1977), colour X-ray (2018, LHC), Timepix (2006, LHC), hadron therapy
  (1996–2000, PIMMS), White Rabbit (2008, LHC), superconducting lines (2014,
  HL-LHC). The speaker names each problem.
- **„O kaip komercializuoti?“** (section). 700+ sutarčių, 613 mln. CHF,
  +14 % apyvartos, the FCC (CERN's 2025 map clip).
- **„Lietuvos istorija CERN“** (no section slide since 13 Oct: owner, "don't
  need the 'Lietuvos istorija' cover slide"; the camera flies from the FCC
  clip straight to it). Since 20 Oct the whole LHCb Week Vilnius aftermovie
  (owner: "Don't worry about photos show the entire aftermovie"; 2:28, its own
  music, nothing said over it; the Lithuania lines before or after it), in
  place of the four photos; the membership facts are in its notes;
  then (19 Oct) the light injection clip, a SciFi module's end where a laser
  writes the flag on the cold box, whose last frame becomes grains at its place
  in LHCb, the camera pulling back to the whole detector in grains and LHCb's
  own collision in it, „Ačiū“ (Decisions, "The new ending"); the licence
  credits on a page after it, never shown in the room.

## Status

2026-10-23 (delivered, parked): the talk was given on Thu 23 Oct 2026 from the deployed 95ff916
(https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/, Pages run 39831269167)
and its venue zip (`2026_10_23_Innoday-venue.zip` on the release videos-2026-10-00-innoday,
907 285 203 bytes, built from 73940ec). The owner, after the talk: "Innoday went great! And it's
very good content". Nothing to deploy; the session is parked (`pnpm talk session innoday` reopens
it from here). Leftovers for a later session:
- Plates 30–31 are stale (30 is now a clip, 31 a still), and 03-plate.mp4 is 45 MB, over the
  40 MB a plate may take; re-record with `pnpm talk record innoday --plates` before any reuse.
- Unused assets on the release: close.mp4 (the first recorded close, 73 MB), the 644 MB PPTX,
  the old plates. Prune them with `talk-videos` (never `--only` with `--prune`).
- The release tag still says `10-00`; renaming it means the deck's `videos.release`,
  `videos.toml` and the zip's URL in `videos/venue.json` together.
- The full flight home (the ring, the collision full frame, „Ačiū“ over Vilnius, the dive into
  NFTMC) can be reused in other talks: `hero/bookend.py` builds it from a 4K take of slide 30
  (`pnpm talk record innoday --out DIR -- --slides 30 --fps 50 --size 3840x2160 --hold 16 --max
  110 --clicks none`, `maxBufferWidth` 3840 for the take only) and the opener, reversed
  (nftmc_zoom_web.mp4). The 4K take sat only in a session scratch dir: not kept.
- Small artifacts in close_home.mp4: a few faint dashes in the flash for ~1 s, a stray particle
  dot near the word, the CG/Google Earth flash in the dive, Geneva not placed geographically.
- The toolkit's `transition="cut"` clip never announces cover, so the world draws under it
  (reported to the Scheduler for v0.8.4); this deck works around it with `fade`.
- On slide 30, P pauses the clip but not the music: a pause before 69.8 s throws the hit off.
  Possible later: P pausing both, and a key to play the live close on a strong GPU.
- The final form (95ff916) was not checked on the M2 Mac from this session.

Every earlier entry (from 12 Oct): `notes/history.md`.

## What worked

The owner, 26 Oct, on Innoday and Užsikrauk karjerai: "Innoday went really well … Other elements from
those two are good."

- **One spine**, retellable in a breath (Story): the machine nobody could buy, its limits broken, the
  solutions in daily use, the next machine and the Lithuanian firms. Every slide hangs on it.
- **Real footage**: the owner's SpaceEngine zoom from NFTMC, CERN's own clips, the LHCb Week Vilnius
  aftermovie whole, the SciFi module with the flag; no synthetic stand-ins.
- **A finale that closes the title's loop**: „…ir atgal“; the close flies out from LHCb to the rings and
  back down into Vilnius onto NFTMC, where the opener began (`hero/bookend.py`).
- **A recorded close**: slide 30 plays `close_home.mp4`, a 4K take of the live slide taken down to
  1080p, with nothing live under it (`transition="fade"`, slide 31 a still). The owner's M2 MacBook "can't
  quite handle the final slide" live (22 Oct); the clip played fine from the venue zip on it.
- **The music on its measured peak, after a beat of silence**: one track („Starfire“, picked by measured
  loudness), its biggest onset measured in the file (the 2:54.85 downbeat); the `drop` takes the bed
  down to 6 % from 92.7 s, the peak file opens on the downbeat, and the muted clip's playbackRate is
  slaved to the music, so one clock carries both.
- **The venue zip on the M2**: the talk ran from `2026_10_23_Innoday-venue.zip` on the owner's MacBook.

## Reuse index

Paths are under `talks/2026_10_23_Innoday/`.

- **The opener**: `nftmc_zoom_web.mp4` (videos/manifest.toml) and `setup/WebTakeover.vue` +
  `setup/takeover.js` (the clip's last frame becomes the world's grains); `setup/funnel.js` (the
  Universe's history as a funnel of grains); `setup/ShortHum.vue`.
- **The collision**: shared `components/lhc-opening/` (`event: "cms"`, `:count="290"`);
  `setup/CollisionStart.vue`, `setup/coverCollision.js` + `setup/CoverCollision.vue` (the cover's loop).
- **LHCb as a point cloud**: `setup/detector.js` with `public/data/lhcb-grains.bin` / `.shape.bin`
  (`hero/bake_grains.py`, `hero/export_mesh.py`). On v0.8.3 it ignores the grain budget at tier 0 and
  keeps its collision state after stop (Užsikrauk karjerai's Lessons).
- **The flag hand-over**: `setup/LisTakeover.vue`, `setup/lisGrains.js`, `setup/data/lis.json`,
  `hero/lis_pose.py`, `hero/lis_scene.py`.
- **The inventions**: `setup/Strands.vue` + `setup/strands.js` (strands from a part to its photo),
  `setup/sun.js`, `setup/plots.js` (`scripts/plots_dark.py`: figures light-on-black).
- **The collaboration**: `setup/CollabGlobe.vue`, `setup/globe.js`, `setup/europe.js`, `hero/globe_map.py`,
  `hero/europe_map.py`, `hero/ring_map.py`.
- **The music**: `setup/Soundtrack.vue` + `setup/soundLevel.js` (the `drop`, `keys`, Web Audio gain);
  `public/audio/starfire_close*.m4a`.
- **The recorded close**: `hero/bookend.py`, `hero/close_path.py`, `setup/CloseStill.vue`,
  `setup/ClipEnd.vue`; `scripts/last_frame.sh`.
- `scripts/pages-check.mjs`: the live walk of a deployed talk.

