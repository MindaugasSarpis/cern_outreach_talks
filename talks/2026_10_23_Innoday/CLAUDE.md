# Innoday (talks/2026_10_23_Innoday)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.
The round-by-round log (what each round changed, recordings, deploys) is
`HANDOFF.md`; this file is the state.

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

## World

Everything is grains; no solid shapes, no labels (LHCb's result figures are
`plot`s: light-on-black pictures on unlit additive planes, as OpenData's).

- Stations (`public/data/space.json`): `hero` (the pentaquark: cover, close),
  `collider` (the LHC ring; carries `strands`), `cosmos`, `web`, `kt` (the gold
  seed and loop: Part III), `funnel` (the history of the Universe, at
  [30, 40, −110], its axis along −z behind the takeover's frame), `results`
  (eight `plot`s of LHCb result figures, public/figures/lhcb/res_*.jpg, at
  [60, −30, 50]), and far below everything the shared collision twice:
  `collision` ([0, −400, 0], object `opening`, OpenData's options) and
  `thanks` ([0, −480, 0]: object `thanks`, LHCb's own event since 19 Oct,
  `light 2.6`, `approach 2.5`, `pipe 3`, `sound: false`, the deck's blues; and
  `det`, a `detector`: LHCb's Run 3 geometry as 93 000 grains, `alpha 0.95`,
  `size 1.9`).
- Talk-owned builders (`setup/`, registered in `main.ts`; `stage:check
  --types detector,funnel,lhc-collision,plot,strands`): `detector.js`
  (`detector`, the close's LHCb, from MasterTalk), `plots.js` (`plot`, slide 12), `strands.js` (grains from ring parts
  to products, in groups: `inventions`, Part II's, on from the „O kur tai
  pritaikoma?“ section and off from „O kaip komercializuoti?“; `fcc`, a second
  object on the collider station with its own `ring` of grains, unused since
  the FCC became a clip; `<Strands :on group>`), `funnel.js` (wall rings and
  lines, the Big Bang, the CMB disk, then along the axis (owner, 12 Oct): grey
  empty dark ages, first light, a dense band of hot blue-white proto-galaxies
  (`dawn 0.32`, `peak 0.37`), then galaxies that grow, cool to dim red and
  spread apart toward the mouth (`thin 0.11`, `rest 0.05`); 181 544 grains).
  The shared collision: `components/lhc-opening` (`installOpening` in
  `main.ts`; `<LhcOpening name="opening" />` on the collision slide;
  `<LisTakeover>` starts `thanks` on „Ačiū“ through the module's bus, without the
  captions; the talk's `<CollisionStart>` is unused since 19 Oct). Never
  edit that module here: OpenData's and Užsikrauk karjerai's live openings use
  its defaults; tune through the objects' options.
- Part II photos are StagePhoto places with depth maps
  (`public/figures/*.depth.png`, `slidev-videos depth`, committed), relief
  0.25–0.35, `flight: 1.6`, condense 0.8 s; text is up 2.6–3.8 s after the
  click. The 1989 page and the tunnel stay screen StagePhotos (not full bleed).
- The takeover (`setup/WebTakeover.vue`, `takeover.js`): the opener's last
  frame (`public/figures/opener_last.jpg`, the cosmic web since 12 Oct) as 280 000 grains, gain
  1.3, saturation 1.35; the dissolving copy has its own WebGL context only
  for the 3 s dissolve (released after it, a new canvas each time: a second
  context held all talk long raises the odds of a context loss on iPhone); opener and takeover share the pose [30, 40, −70],
  dist 18, yaw 0, pitch 0, sway 0; the clip uses `transition="fade"`.
- The prologue (owner, 13 Oct: the web "should transition to the funnel by
  arranging particles such that they make up the funnel (and then it gets more
  resolved, as it is now)… And then the mesh appears underneath"):
  `funnelSeq` in `setup/funnel.js`, driven by `<WebTakeover>`. The funnel does
  not exist before the web makes it (owner, 13 Oct: "don't like that it's
  floating in the cover slide … needs to be created from cosmic web
  particles"): hidden on slides 1–3 (a new world reads the hash: hidden up to
  the takeover's slide); the step 3 → 4 plays it on the
  world's clock: the web's 280 000 grains fly into the funnel's shape over
  4.4 s (the takeover's camera looks down the funnel's axis, so the picture's
  middle becomes the Big Bang, then the CMB disk, then the bell out to the
  mouth; each grain keeps its angle round the middle, evened out by rank, and
  turns a little round the axis on the way), the grain funnel stands a moment,
  the funnel's own grains and the CMB picture resolve over it (4.8–6.6 s) as
  the web's fade, and the mesh (the rings and lines from the CMB end, the
  floor from under the funnel) comes in last (6.4–8.0 s). Every other arrival
  finds the funnel whole. `busy` while it plays (the shots and stills wait);
  the caption „13,8 mlrd. metų“ at 6.8 s. The grains' targets are worked out
  once per picture, after the dissolve (histograms, no sort). A rebuilt world
  (after a lost WebGL context) starts with the funnel whole, and on slide 3 the
  takeover runs again (`slidev-stage:rebuilt`). The web's grains draw without
  a depth test (the fading CMB disk writes depth and cut off the Big Bang
  knot); the plots are front-side only (every other slide sees their backs).
- Look (owner, 8 Oct: "more striking, photorealistic"): black ground
  (`palette.bg #000103`, density 0.6, dustGain 1.45, nebula 0.12, vignette
  0.42); 2400 px photographs; MedAustron is a Lanczos 2× upscale, nothing
  invented.
- Clips: talk-owned `nftmc_zoom_web.mp4` (the opener since 13 Oct: the owner's
  SpaceEngine edit spaceengine/nftmc_zoom.mp4, from NFTMC, cut at 253.45 s on
  the frame `opener_last.jpg` was taken from (the source runs on past it and
  holds a later frame; manifest notes), a 3 s audio fade) and
  `cern_footage_2022_013_001_1080p_lhc.mp4` (the tunnel, 3:00–3:39.5 of
  CERN-FOOTAGE-2022-013-001, pushing on into the collision); library
  `cern_overview_short.mp4`, `lhcb.mp4` (the 3D animation with music: the same
  picture as CERN-FOOTAGE-2022-042-001, whose own audio is digital silence),
  `cern_footage_2025_014_002.mp4` (the 2025 FCC map). Retired, kept on
  the release: `vu_ff_zoom_galaxy.mp4`, `vu_ff_unzoom.mp4` (12 Oct),
  `vu_zoom_web.mp4` (the VU Business School opener, 13 Oct). Publish only with
  `--only <talk-owned names>`: the manifest lists `lhcb.mp4` for its poster.
- Phones (owner's iPhone, 9 Oct, after the black was fixed): slides 4–5 washed
  out white. The talk's grains were sized in raw pixels like the engine's, so
  on a ~220 px slide band they covered ~4× more of the frame and the dense
  surfaces overlapped ~15× more. `setup/view.js`: funnel, takeover and strands
  now size grains to the frame height (against 900 px; identical at 1600×900),
  with a 1 px floor dimmed by coverage. Headless iPhone (390×844, tier 2)
  slide 5 went from mean luma 191 to the desktop's look. Since v0.6.8 the
  engine sizes its own field and forms the same way (buffer height / 900).
- The CMB disk is a picture of the real map (owner, 9 Oct: "a real image of
  cmb at that plane exactly"): `public/figures/cmb_disk.jpg` (2048, 1024 for
  touch), rendered from the Planck PR3 SMICA-noSZ HEALPix map (Nside 2048,
  I_STOKES_INP) in the old disk's projection and orientation (checked:
  identity correlation 0.95, others < 0.1), smoothed to 1°, the old WMAP-like
  palette; `cmbTint 0.5` and `cmbSheet 0.6` keep it under the bloom threshold.
  Licence CC BY-NC 3.0 IGO: the on-slide credit says it was reprojected,
  smoothed and recoloured (required). The scripts are not in the repo; the
  parameters are in the speaker notes and this file.
- Toolkit: slidev-videos v0.8.1 (both addons; v0.8.0's settling that stretches with load, shots that never cache a failed frame, per-slide `hum: false` and `space.ambient`, unused here; v0.8.1 prints each page with its own dim: v0.8.0 gave every page slide 1's, which printed this deck's worlds at about half their stills; v0.7.0: stills at each slide's last click, which is click 0 here: the deck has no clicks; v0.6.8: the engine's grains sized to the frame; `strands` registered `enterable: true`; print shows every animation at its end state; every pixel clamped finite before bloom: the funnel's additive core overflowed the half-float target to Inf → NaN → black on iOS). Device switches for a phone: `?stage-debug`, `?stage-post=off`, `?stage-targets=half`, `?stage-tier=0..3`. A lite mode for phones (fewer, smaller grains in the talk's forms, no takeover overlay) is parked on `wip/innoday-lite`, unused unless the iPhone still struggles: place groups, `humAt: all`,
  `?stage-debug`, quality tiers (a phone starts at 2; desktop and the headless
  recorder at 0, `pages:check` prints it), lighter photo places, the context-
  loss fixes, stills and posters for print (v0.5.4: correct per page).

## Status

2026-10-22 (00:45, deployed): the fresh-eyes review of all 31 slides found nothing high; its fixes
are in (White Rabbit darker, 19 and 22 dimmed, „8 TeV“/„290 dalelių“ at bottom 96 px, slides 5–6
further back, the units light blue, the cover's lines shadowed, the sun's cards stepping back at a
touch, slide 4's notes point at the Big Bang); the plates re-recorded and published (--only, 8
changed); the Scheduler's lockfile fix merged (path keys of the v0.8.1/v0.9.0 tarballs). `ready`
passed with nothing skipped (plates: 03-plate 45 MB over budget; "stale" only because the merged
lockfile entered the fingerprint, no file the talk builds from changed). Deployed 8e44020 —
https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/ — Pages run 39680747326
green, URL 200, the live walk 31/31. The venue zip rebuilt from it.

2026-10-22 (00:10, deployed overnight; the owner asleep: "Continue working, I'm going to sleep.
Implement all said improvements"): v0.8.2 adopted (merged origin/main and origin/chore/live-fallback,
`pnpm talk pin … v0.8.2`, `stage.motion: floor`), 24 plates recorded (`talk record --plates`) and
published with --only with the cold-box lis_flag.mp4; the forced no-webgl2 walk passed (2→3 onto a
playing plate, 8 waits for the press, 30's still fades and „Ačiū“ by ~50 s); `ready` passed with
nothing skipped (one plates warning: 03-plate.mp4 45 MB, over the 40 MB budget: the ~80 s flight).
Deployed 5c93455 — https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/ —
Pages run 39675192178: Innoday's build and deploy jobs green, URL 200, the live walk 31/31; the run
as a whole red because UzsikraukKarjerai, OpenData and MasterTalk no longer build ("Failed to resolve
entry for package slidev-addon-stage", after the merged LhcOpening.vue; their live pages still 200;
reported to the Scheduler). Since: the paper count 878 (INSPIRE, 22 Oct; fact lhcb-papers-2026-10-22).
Open for the owner (morning): his notes on the three review MP4s (the close, slide 3, slide 29),
the 21 Oct visual round; slide 11 was the recommended option, taken without his answer.

2026-10-21 (night, deployed): the owner wrote "Publish". lis_flag.mp4 (20 s) published
with --only; `ready` passed with nothing skipped; deployed 3da294a —
https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/ — Pages run
39645262547 (green), URL 200, the live walk passed. Live: the round below (the close as
grains to the LHC ring, the CMS cover, the funnel's eras, Europe for Part III, slide 27's
question, the 20 s light-injection clip, the music at 0,6). The new raw is hard-linked into
the main checkout's raw bank. Wednesday: the paper count (878 on INSPIRE on 21 Oct), the
owner's notes if any, then v0.8.2 (pin, plates, ready, redeploy) and the venue zip.

2026-10-21 (night): the round below is built, committed (c1a826e, 7667e69) and pushed on
talk/innoday, not deployed; the owner has the close's review MP4 (53 s, with the music), the
new 20 s light-injection clip and stills of the cover, the funnel and Part III. Not yet
published: lis_flag.mp4 (the release still holds the 10 s clip; `videos:publish --only
lis_flag.mp4` with the deploy, after his yes). The new raw is in this worktree's
videos/raw only. Next: his yes or notes Wednesday morning, the paper count, then v0.8.2.
The owner's new round, all approved in this window: „Ačiū“'s music 0,9 → 0,6 (done); the close back to grains with the person as 3D grains
(part 10, bake_grains.py; done, unreviewed) and a new path "to really reveal the vast scale",
ending in a pull-out to the full LHC ring ("can show the accelerator as well, so this doesn't look
isolated … panning out at the very last second to full accelerator and then ačiū appears"); the
light-injection clip ~20 s (the whole module, a pan down, the boards glowing, the same last frame;
publish --only lis_flag.mp4 after); the cover a slow silent looping CMS collision; slides 4–6 the
funnel as the Universe's history, brighter, no floor grid; Part III a Europe map in grains
(CERN → member states, Lithuania lit) for the "weird" sphere; slide 27 „O kokį vaidmenį atliks
Lietuva?“ at the clip's end (done). Order: these → the owner's review MP4 of the close tonight →
his yes Wednesday morning → v0.8.2 adoption → plates → ready → deploy → venue zip, by Wed evening.

2026-10-21 (review): owner, via the Scheduler: "Innoday is next, so focus on that, carefully
review." Review of fe3fb1a in notes/review.md (checks, sound levels, 12 visual findings for the
owner, none applied). Applied: the press notes on slides 2 and 8, the film's notes (it plays at full
level from 0:03; say the Lithuania lines on the FCC slide or over its held last frame), the stale
`places` Decisions. Open for the owner: which visual findings to fix; the paper count (878 on
INSPIRE today, 875 on slide 12; refresh on 22 Oct); the talk's start time on 23 Oct (not in the
calendar); the earlier open items below (the CAD never came; the three CERN CC credits; the
iPhone retest; the film's rights).
Venue checklist (23 Oct): (1) on the venue PC open the URL with `?stage-debug` first: a
`data-stage-fallback` reason means no world (after Thursday's bump the plates play; before it the
stills; either way both clips wait for the press); then reload without it at slide 1. (2) Sound:
the PC's audio to the hall; set the hall gain once on the opener's first seconds (every clip and
Starfire are at -16 LUFS). (3) Clicker: forward and back; the first press on the title goes to the
opener and unlocks sound (opened cold on slide 2, the first press starts the clip). (4) With
/presenter, click the audience window once first. (5) The offline zip on a USB stick
(`pnpm venue`, rebuilt after the bump). (6) At the close, the frame-rate guard (below).
Timeline (Scheduler, 21 Oct: the calendar has the talk inside a 09:00–14:00 block on Thu 23 Oct, so
everything lands on Wed 22 Oct, deploy and the USB zip included; Thursday morning is only a last live
walk before he leaves). Paper count refreshed on 22 Oct. Cut-off Wed 19:00: without v0.8.2 by then,
the clip change and the review fixes he approved deploy alone under the standing rule and the fallback
is dropped for this talk (the Scheduler gives main at 19:00 either way). The adoption, from the
release's relay on Wednesday (T): T+0 merge origin/main, `pnpm talk pin v0.8.2`,
commit; T+5 `stage.motion: floor`, check, lint; T+10 `pnpm talk record --plates` (~15 min on the
GPU, render-lock priority); T+25 `videos:publish --only <plates>`; T+35 force the fallbacks
(reduced motion, no WebGL) and walk 2→3, 8→9, 9→10→9 (a back-step onto a held plate), 28, 30, and test the takeovers on the plate
layer under `--force no-webgl2` (prepared 21 Oct: on html[data-stage-layer="plate"], once
html[data-stage-plate] is `playing`, WebTakeover's still goes at once and LisTakeover's fades after
`hold`, with „Ačiū“ at the path's end + 0,6 s; `held` (a back-step or jump) shows the end at once;
`living` keeps the photo and the word; inert on v0.8.1, which never sets the attributes; the Scheduler
read StagePlate: the state is this slide's within ~50 ms of the route, so the observer stays); T+45 `talk ready` (plates step); T+55
deploy under the standing rule; T+65 the venue zip rebuilt and onto the USB stick, hand-off. About
75 min.

2026-10-21 (later): the owner, via the Scheduler: "Can we not mark clips to advance, in
innoday as well.... I will specifically ask if it's needed". `advance-on-end` removed
from slides 2 and 8, notes say the press is his (Decisions, "No clip moves on by
itself"). Not deployed: Thursday morning's redeploy with the fallback carries it; if the
toolkit release has not been relayed by Thu 23 Oct 09:00, this change deploys alone under
the standing rule (`ready` with nothing skipped; the Scheduler gives main then).

2026-10-21: the owner asked (via the Scheduler) to renew the talk for the toolkit's
non-static fallback, now being released by Tools: a floor tier of the world where the browser lacks only a
feature or asks for reduced motion, per-slide MP4 plates where the world cannot run, and
a GPU-free "living still" under both. The trigger was OpenData's "it seemed like the
slides autoclick" on a Windows machine that had fallen back to the stills. No renders
until the release is on GitHub. Audit (no changes yet): the deck moves on by itself only
through `advance-on-end` on two clips, the opener (slide 2 → 3, the web takeover) and the
tunnel (slide 8 → 9, the collision); `VideoPlayer`'s `onEnded` calls `next()` whatever
the stage's state, so in the fallback each clip still ends and moves on, onto a still
whose flight never comes. Everything else is visual only: `AfterFlight` (a 2,4 s fade),
`LisTakeover` (rate and emblem timers, `wordBy`), `ShortHum` and `Soundtrack` (audio),
`OpenerStart` (takes the first press on a cold open; never advances). The talk's
`<Grains>` has no `later`. Slide 9's "8 TeV" and "290 dalelių" (components/lhc-opening)
appear only on the world's `cross` and `flyout` events, so in the fallback they never
show (OpenData's collision slide is the same). The plan once the release is out, all before 23 Oct: `pnpm talk pin
<vX.Y.Z>` from the worktree root, `pnpm talk check`, `pnpm talk record --plate` for
every slide (render lock), the fallbacks forced and walked (slides 2→3, 8→9, 9, 30),
`talk ready`, deploy under the standing rule.

2026-10-20 (night, deployed): the owner's three items and his detector choices are live
(Decisions: "The slower, bigger close", the aftermovie, "LHCb on „Ačiū“ is a 3D model").
Deployed 404f3a7 — https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/
— Pages run 39485774569 (green), URL 200, the live walk passed; `ready` passed with nothing
skipped. 31 slides, 25,0 min. The aftermovie's credit on the credits page: „LHCb savaitės
Vilniuje filmas: Nebula Moments (R. Unkevičius)“. Rights: asked whether the organisers and
Nebula Moments agree to the film on the public release and Pages, and about its music's
licence, the owner answered "Don't worry about photos show the entire aftermovie" and then
"Deploy"; no separate permission was recorded. The photos' „VU nuotr.“ question no longer
applies to the deck (they left it). This worktree needs `pnpm videos:pull -- --include-shared`
and lhcb.mp4 fetched from the shared release (`gh release download videos-shared --repo
MindaugasSarpis/slidev-videos -p lhcb.mp4`) before `talk check` passes; the aftermovie's
raw is also hard-linked into the main checkout's raw bank.

2026-10-20 (late): three items from the owner via the Scheduler. (1) The stripe on
„Ačiū“ ("lhcb logo has a weird vertical stripe") was in figures/lhcb_logo_grains.png:
column 0 opaque from the mirror axis down, and the axis's hairline lit across rows
325–330; both cleared (letters, reflection and the red slash kept), still 33 retaken.
(2) "Make it even more spectacular? don't need to rush to zoom out": built (Decisions,
"The slower, bigger close"), checked on four headless recordings of slide 33; a review
copy with the music went to the owner. Not deployed: the owner reviews first.
(3) The LHCb Week video for „Lietuvos istorija CERN“ is the aftermovie (owner's
correction; not the President's greeting; then "show the entire aftermovie": built,
ee790f1, published with --only; Decisions): „CERN Aftermovie_4K_HQ_final.mp4“ (2:28,
4K25, its own music at -15,3 LUFS; film by Nebula Moments, R. Unkevičius), uploaded to
the LHCb Week Drive folder on 20 Oct, now in the raw bank; the cut is proposed to the
owner, not built. Open for the owner: the cut, its audio against Starfire, and the
credit and permission for the film (the photos' „VU nuotr.“ question still open too).

2026-10-20 (night): the owner's notes on the eye-level close ("lhcb seems 3m high",
"horizontally squished", "chopped in half ... full 16x9 frame filling view ... then
slowly panning out, showing this person for scale", "do the Lithuanian flag at the
bottom of scifi") are built (Decisions, "The close at eye level"): true proportions,
the close-up 16 m back with the whole detector in frame, the pull-back to 28 m with
the person at the muon wall's foot, the clip re-rendered with the module's lower
readout end (57 min on gluon) and republished with --only, the hand-over's anchor at
the lower cold box. Stills 31–34 retaken. Not yet deployed at this entry.

2026-10-20 (later): the owner's notes on the deployed close ("Looks amazing" — the
eye-level view, the logo and the flag, more solid grains, the soundtrack, no CAD for
now) are built (Decisions, "The close at eye level"): five visual review rounds, a
four-lens code review with each finding verified, its confirmed findings fixed;
the music's two files measured (-15,9 and -14,1 LUFS, the arrival at the cut's
67–70 s) and its flow tested headless (forward, back, a direct open, the overview).
Stills 31–34 retaken. Then (the owner: LHCb looked 3 m high and squashed) true
proportions on „Ačiū“ and the end side on from the middle at the owner's eye level
(Decisions); three more visual rounds, deployed dafb7eb — Pages run 39342886481
(green), URL 200, live walk 34/34; `ready` passed with nothing skipped. Before it:
897b30c — Pages run 39339958890 (green), URL 200,
live walk 34/34, the music files served; `ready` passed with nothing skipped.
Nobody has listened to the music in a session: the owner hears it first.

2026-10-20: the new ending is built (Decisions, "The new ending"; owner, 20 Oct:
"Deploy"): slide 32 the light injection clip `lis_flag.mp4` (rendered at
1080p, 160 samples, 250 frames in 57 min on gluon; on the release with
`--only`, 1.6 MB, PSNR 48 dB against the raw), 33 „Ačiū“ with the hand-over
to LHCb in grains, 34 the credits page; 34 slides, 23,6 min. The cover's
pentaquark reads as five quarks (Decisions). A five-lens review with each
finding verified; its confirmed findings are fixed. Print stills retaken.
Deployed 8be6a41 — https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/
— Pages run 39333964525 (green), URL 200, live walk 34/34; `ready` passed
with nothing skipped.
Open for the owner: the CAD file never came (the model follows the drawing),
whether the notes may say more about Vilnius's LIS work, the three CERN
credits on the credits page.

2026-10-14 (later): the cover's fly-in no longer stalls (`<AfterCover>`, the
CMS event in the bundle, the CMB disk warmed under the opener; Decisions).
Deployed de00cca — Pages run 38560873241 (green), URL 200, live walk 32/32;
`ready` passed with nothing skipped. Waiting on the owner: the VU yard laser
photo for a slide before „Ačiū“ (owner, 14 Oct; which file?).

2026-10-14: the funnel's hum lasts ~3 s on slides 4-5 (`<ShortHum>`), not
the whole slide. Deployed 92c6cbb — Pages run 38548170841 (green), URL 200,
live walk 32/32; `ready` passed with nothing skipped.

2026-10-13: **the NFTMC opener** (the owner's new SpaceEngine edit, cut on the
takeover's frame), slide 12's CP plot as one panel, no „Lietuvos istorija
CERN“ section slide (32 slides), and a stale page reloads itself while it
loads. Deployed 8688ebf —
https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_23_Innoday/ —
Pages run 38464557033 (green), URL 200, live walk 32/32; `ready` passed with
nothing skipped. Before it: 9d5f7e2 (the prologue from the web's grains, the
plots, the LHCb Week photos), run 38391635790. The opener's Google Earth
attribution is in its footage (manifest notes).
Open for the owner: whether the LHCb Week photos from the Drive may stay in
the public repo and their credit („VU nuotr.“), any minister photos at LHCb,
lhcb.mp4's music (probably a commercial film score), the opener's music and
the NCSA web's licence, the CERN CC credits, the paper count on 22 Oct, the
iPhone retest. For a PDF: `pnpm talk export innoday --format pdf -- --wait
12000`. For the offline zip: `pnpm venue` in the talk dir (the env's slidev-videos is
v0.8.1 since 20 Oct and builds the zip local-first itself).

## Decisions

Dated detail in `HANDOFF.md`. The ones a later session must not undo:

- The 22 Oct round (owner, in this window):
  - „Ačiū“'s music at 0,3, half of 0,6 ("And the last soundtrack 50% quieter"); `+` / `-` step
    the music and slide 27's hum on a slide without a clip, 0–200 % of the written level, kept in
    the browser and crossing to the audience window ("would be good to have control over sound as
    well"; setup/soundLevel.js); on a clip's slide the same keys stay the clip's own.
  - The close ends on a map after CERN's FCC schematic ("For the last one, can you use something
    like this? Now the SPS is weirdly connected to lhc"): straight down, north up, the LHC and the
    whole FCC in frame; the SPS, the PS and TI 2, TI 8, TT2/TT10 are the tunnels' own lines from
    OpenStreetMap (they meet the LHC at Points 2 and 8), the FCC a dashed orange 90,7 km circle
    fitted to its eight sites (cern-fcc-sites), Lake Geneva, the border, the Rhône, the Jura's
    crest and four ridges (hero/ring_map.py → public/data/ring_map.json; credited). The logo rides
    to the top left.
  - „Ačiū“ comes out of a collision ("aciu should appear out of particle collision now it's a bit
    flat"), with the Lithuanian flag under it ("Also Lithuanian flag should appear with aciu"): a
    CMS crossing (`aciuCol`, scale 10) in the FCC's middle as the camera stops; 0,9 s after its
    crossing the word and the flag (`aciu`, `ltAciu`: emblems with `text` / `flag` and `burst`)
    gather out of it on curling tracks; the collision lets go after 5 s. The slot's HTML word is
    hidden wherever the world or its plate runs; it stays for the still, living layer and print.
- The 21 Oct round (owner, in this window; each answered by him):
  - The music goes on after „Ačiū“ ("sountrack has to continue"): both Starfire files now run
    to the track's own end (src 0:30–5:41, tail 1:19–5:41, 311 s and 262 s, the master from
    scottbuckley.com.au at −0,5 dB as before), about four minutes under the questions.
  - „Ačiū“'s music at 0,6, not 0,9 ("Sound on the aciu slide is a bit too loud"): its peaks
    now sit at the film's level (−16 LUFS), not 3 dB over it. The credits page matches.
  - The close is a point cloud again ("let's get back to point cloud"; supersedes "LHCb on
    „Ačiū“ is a 3D model"): the blue grains with their edges and lit faces, the person as
    3D grains (part 10 of lhcb-grains.bin, hero/bake_grains.py's sixth argument, the same
    body and place as the hologram person; its own colour, never lit by the collision).
    hero/export_mesh.py and lhcb-mesh.glb stay, unused.
  - The close reveals the scale ("we want to really reveal the vast scale of it") and ends
    on the LHC ("can show the accelerator as well, so this doesn't look isolated, it's a
    part of huge infrastructure. Maybe panning out at the very last second to full
    accelerator and then ačiū appears"): eye level 7,6 m from the person, a walk upstream,
    the pull-back to the whole detector, then a scale cross-fade into the ring (`ring`
    object `lhcRing`, emblems.js; not at true scale), Point 8 marked, „Ačiū“ inside the
    ring at 49 s (hero/close_path.py). The flag's grains turn to face the camera
    (lisGrains.js): side on, the cold box's flag was seen edge-on.
  - The light-injection clip is ~20 s: the whole SciFi module, a slow pan down, the cold box's
    blue outline glow while he names the system (no text; owner: "The light injection system is
    within this black coldbox, no need for blue cables": no boards or fibres on the mats), the engraving, today's last frame
    ("show the full SciFi module panning slowly … on the bottom I indicate the light
    injection system"; chose "Re-rendered clip" and "Glow outline, no text").
  - The cover is the real CMS collision (record 300, the 2012 Higgs candidate), filling the
    frame, slow, silent, looping (~23 s a round) ("Cover slide can be more substantial, say
    the cms collision full frame slowly"; chose "Slow loop"). The pentaquark is gone
    (setup/coverCollision.js, CoverCollision.vue; the `hero` station).
  - Slides 3–6, the funnel as the Universe's history, its eras in their own colours (white-hot
    Big Bang, orange CMB ring, red-black dark ages, blue-white first stars and cyan bubbles,
    the bright galaxies band, today's red galaxies on violet filaments), ~220 000 grains, no
    floor grid ("no grid on the bottom so it doesn't exist in some other space"; chose
    "Read as the Universe's history", "Brighter, richer look"). `floor: true` brings it back.
  - Part III's world is a Europe map in grains (setup/europe.js, public/data/europe.json from
    Natural Earth 1:50m v5.1.2, public domain; hero/europe_map.py converts it): CERN lit on
    23, threads to the 25 Member States on 24, to the associates too and Lithuania lit on 25,
    a steady glow on 26 (owner on the old seed and shells: "this is a weird one..."; chose
    "Europe map: CERN → Lithuania"). The thread ends are a picture of flow, not data.
  - Slide 3 flies through the web ("Slide 2-3 auto move on, and also rotate, fly through this
    point cloud universe, can be more substantial, busy, better resolved, and then I will
    manually switch to the funnel"): the opener advances by itself (his named exception); the
    frame's 360 000 grains are given coherent depth round the picture's knot (takeover.js
    placeWeb) and ~380 000 generated web grains (buildCosmos: clusters, bowed filaments, gas
    clumps, in the frame's colours) fade in as the camera leaves the clip's pose; a ~52 s turn
    and flight, then a drift; he presses → into the funnel at any moment. The web is the
    cosmic web's form, not a map (notes say so). Lower `cosmos` first on a weak PC.
  - The Big Bang is a small bright point beside the CMB disk, off the neck ("don't like this
    fuzzy big bang should be a bit displaced, and point-like but bright"; funnel.js `bigBang`
    −5,8); grains behind the disk are dropped (funnel and web shaders); the funnel shows on any
    arrival (funnelSeq.sync), not only after slide 3.
  - Slide 11, the collaboration photo dissolves onto a turning globe of LHCb's institutes ("Slide
    11 is a bit of a step back from the first few very cool slides"; offered three options, no
    answer: the recommended one, taken overnight): CERN Greybook's 111 LHCb teams in 28
    countries at 92 city points (hero/lhcb_institutes_greybook.json, hero/globe_map.py; Natural
    Earth, 15 OpenStreetMap coordinates credited); the screen says LHCb's 112; Vilnius brighter.
    setup/globe.js, CollabGlobe.vue, the `collab` station.
  - Slide 12, a sun of LHCb's results after OpenData's ("Slide 12 can be more dynamic, there is
    a similar cool slide in open data talks"): a blue-white core, rays to the eight plots, which
    turn in 3D (setup/sun.js, adapted from OpenData's; the `plot` builder kept, unused).
  - Slide 8's tunnel starts at 5 % volume ("start 8 slide at 5% audio"); slide 27 has a
    synthesised low hum, swelling under the question ("deep cool hum sounds"; setup/Drone.vue,
    about −29 LUFS).
  - Taken overnight (owner: "Implement all said improvements"), from the 21 Oct review: the
    near-white photos dimmed (15 with a darker page filter, 14, 16, 17, 20; print too), Part II's
    captions at bottom 96 px on a 0,78 ground and the stats at 112 px (clear of a flat room's
    heads), the cover's small type at 18 px, slide 9's notes tie its collision to the cover's,
    slide 13's notes name the photos at the strands' ends.
  - Slide 27: „O kokį vaidmenį atliks Lietuva?“ fades in as the FCC clip ends, over its held
    last frame (setup/ClipEnd.vue; owner: "At the end of slide 27 text appears "o kokią rolę
    turės Lietuva?"" — written with „vaidmuo“, the standard word; his own wording on request).
- No clip moves on by itself (owner, 21 Oct, via the Scheduler: "Can we not mark
  clips to advance, in innoday as well.... I will specifically ask if it's needed"; a
  standing rule for every talk). `advance-on-end` is off the opener (slide 2) and the
  tunnel (slide 8): each holds its last frame until the owner presses →, and the tunnel's
  push into the collision runs on that press. Never add `advance-on-end` (or
  `videos.advanceOnEnd`) to a clip unless the owner asks for that clip by name. He did for the
  opener (21 Oct: "Slide 2-3 auto move on"): slide 2 has `advance-on-end` again; the tunnel
  (slide 8) still waits for his press. The
  trigger: OpenData "seemed like the slides autoclick" on a machine in the stills fallback.
- The new ending (owner, 19 Oct, via the Scheduler: "need a much stronger
  finishing aspect. Can we show photorealistic 3D rendering of SciFi light
  injection system, then "laser" inscribe Lithuanian flag on it and then
  position it in a 3D LHCb CAD (maybe as pointcloud)"; the plan went to the
  owner in this window the same day). Slide 32: `lis_flag.mp4`, 10 s, silent,
  played once: a SciFi module's end standing as in LHCb (the readout end up),
  modelled in `hero/lis_scene.py` after the drawing the owner sent ("Can use
  this for now to mimic the Light Injection system pcb": the cold box's four
  blocks, numbered 4, two LIS boards, 3, with their connectors, fibres and
  flex, the mats, the Kapton flex cables), the camera from the module end in
  to block 3, where a laser writes the flag line by line from the top (owner:
  "LIS coldbox with the flag"), the marks white-hot cooling to the flag's
  official colours (#FDB913, #006A44, #C1272D; the Standard view transform:
  AgX and Khronos Neutral greyed them; each stripe's glow tuned against the
  lights so the render measures within ~5 of those). No visible beam (a
  marking laser's is infrared); the spot and sparks show it. The lens's
  vertical field is the stage's 50°, and the script writes the last frame's
  depth (a ray cast per pixel, 480×270, 16 bits in a PNG's red and green) and
  camera (`setup/data/lis.json`, with the flag's corners). Slide 33 („Ačiū“):
  `<LisTakeover>` opens on that last frame (`figures/lis_last.jpg`) and fades
  it into grains placed in depth along the same view at the cold box's place
  on a T1 module's top end in LHCb (anchor [3.975, -476.94, 0.96]: LHCb
  (0.8, 2.55, 7.95) m), `hero/lis_pose.py` giving path[0]; the path holds 2 s,
  then pulls back to a 3/4 side view of the whole detector (MasterTalk's
  lhcb-grains, `setup/detector.js`, GPL-3.0 notice kept) while the picture
  shrinks faster than it recedes; the flag's own grains stop shrinking at
  9 units a metre, so it stays a ~20 px mark at the module, and the rest of
  the picture fades. The detector lights up, LHCb's own event collides in it
  (owner: "LHCb collision within lhcb"; replacing the CMS event there, slide 9
  keeps its) and „Ačiū“ fades in, each when the camera has come that far, not
  on timers (on a slow machine the world's clock runs behind the wall's).
  The grains reproduce the frame's colours: density ~ each pixel's brightest
  channel^1.2, each grain its pixel's full hue, gain 0.92 (the stage's finish
  turns density d into about d^1.85 of light; weighed by luminance the red and
  green came out a third to a fifth of the yellow), and a grain under two
  pixels gives 0.3·ps² of light (drawn at the 1 px floor it lit its pixel at
  full strength, and the shrunken flag added up to white). Measured at 1280×720:
  the still (254,191,26) (10,112,72) (197,43,46), the grains a second later
  (225,197,84) (75,106,65) (162,39,38). At the end the flag's grains hold 20
  units a metre (~20 px) and the detector's grains make way round it on screen
  (`hole` on `det`): the whole detector's glow still tints it toward cream,
  teal and magenta. Fallback had the render not been right by 22 Oct: the part
  and the flag in grains, live. The CAD, when it comes, stays out of git (public repo and
  Pages): only renders and stills are committed.
- The close at eye level, and its music (owner, 20 Oct: "Looks amazing, we just want
  to see the huge scale of lhcb, maybe then go to first person view at eye level lhcb
  filling thr screen, show lhcb logo and Lithuanian flag besides in 3d space"; "Point
  cloud can somehow be more solid - as well as the flag"; "Will need some crazy
  inspirational soundtrack for the last theee slides spanning - maybe scott buckley").
  Then (owner, 20 Oct: "lhcb seems 3m high from this angle, or the person is huge, we
  want to look at it side on from the middle. From where that person stands. It can be
  me, 183cm in height"; "Lhcb really looks horizontally squished") „Ačiū“ draws LHCb and
  its collision in true proportions (1,2 units a metre every way: `scale 1.2, stretch 1`
  on `det` and `thanks`; the event-display convention, 0,5 along the beam and 2,4×
  across, which the rest of the deck and MasterTalk keep, made it look squashed), the
  cold box's anchor at (9.54, -476.94, 0.96), then (owner, 20 Oct: "So do the Lithuanian
  flag at the bottom of scifi", confirmed as the engraved one) the module's LOWER
  readout end: `hero/lis_scene.py --end bottom` turns the module a half turn about the
  view axis through the flag (the cold box below the mats, the flex cables hanging
  down; the camera and lights keep their place relative to the flag, the
  establishing shot centred on the module; the flag's v flipped so yellow stays on
  top), the anchor at (9.54, -483.06, 0.96): LHCb (0.8, -2.55, 7.95) m, 3 m above the
  floor, near eye level. Then (owner: "You only show lhcb up to
  scifi, it's chopped in half need a full 16x9 frame filling view of how it would look
  like standing up close (entire detector) then slowly panning out, showing this
  person for scale") the path comes down from the cold box by 16 s to the owner's eye
  level (1,71 m of his 1,83 m, above a floor at the muon stations' foot, y = -5,6 m in
  LHCb's frame), side on, 18 m from the beam and centred on the whole detector (the
  camera at x 13.50, found by projecting the geometry: both ends inside ±0,76 of the
  width, the muon wall's top at 0,83; the grains' sprites and bloom add a few percent
  at the sides and about 0,08 at the muon tops, so at 15 and 16 m they spilled past
  the top edge, at 17 m they grazed it, and only 18 m leaves a clean margin above
  with the figure's feet off the bottom edge), 13° up: the entire detector fills the
  16:9 frame, 10 % of it black at each side; lingers there (since the slower close
  below: from 17,5 to 31 s, drifting 5° round to side on); then dollies straight back along
  the same line to 28 m (31–48 s, slow at both ends), 8° up, where LHCb spans about half the
  width and a 1,83 m person in grains (`emblem` of `det`, figures/person_grains.png)
  stands at the muon wall's near foot, 9 % of the frame high against the detector's
  ~45 % (in the close view it is at the bottom right, 26 % high). Earlier tries, for
  the record: a side view from the detector's middle 16,5 m back (the calorimeters
  and muon stations ran off the right edge: "up to scifi"), 6,8 m back (pressed
  against the near faces), and a 3/4 hold. LHCb stands on a faint grain floor grid,
  on grain legs (`supports`, legs and foot rails: the magnet, SciFi, RICH2 and
  calorimeters do not reach the floor in the geometry). Then the LHCb logo (the collaboration's own, its marks
  only, `figures/lhcb_logo_grains.png`) and the Lithuanian flag (waving, its yellow
  given as #FFC800: at the frame's top the finish dulled #FDB913) gather side by side
  over the dark upstream space (`emblem`, setup/emblems.js, drawn last with normal
  blending: added on, the detector's blue tinted them), in the dark above the detector
  in the wide view;
  the collision fades and the small flag at the module goes (its clearing in the
  detector a soft 25 % dimming, not a hole); then the word. Every pose was searched against the
  geometry's projection. LHCb re-baked with 4,8× the grains (446 400, hero/bake_grains.py
  `k`) at lower alpha, the VELO (its grains packed round the vertex) and the beam pipe
  dimmed; the hand-over picture has 320 000 grains. The music: Scott Buckley's
  „Starfire“ (CC BY 4.0), picked from six of his tracks by measured loudness: one
  arrival after a steep build (track 1:37). `<Soundtrack>` on slides 31–34, two files
  from the same master at the same gain (the track's 0:30–2:25 and 1:19–2:25; a seek
  fails on a server without byte ranges, the venue zip's python http.server): it
  starts low (0,3) under the speech on the hall photo on a forward arrival,
  cross-fades on „Ačiū“ to the second file while the first is still before its 49 s,
  so the arrival lands on the eye-level view, plays full (0,9), fades out with the cut
  (2:10–2:22 of the track), and fades if the deck goes back before 31; „Ačiū“ opened
  directly starts the second file; levels through Web Audio gain (iOS ignores an
  element's volume); only the audience's window plays it. Credited on the credits page.
- The slower, bigger close (owner, 20 Oct, via the Scheduler: "In general, the ending
  looks good, but can we make it even more spectacular? don't need to rush to zoom out").
  Everything above stays; „Ačiū“ now runs 48 s to the word (was ~34) and is sequenced to
  the music's second file (its loudness measured per second: the build 9–17 s, the
  arrival 17–19 s at -10,6 LUFS momentary, a dip at 33–35, the second, larger climax at
  42–44 at -10,4, the fade from 51). The path is written by `hero/close_path.py` (keys
  every 1,5 s: the stage runs each segment at a constant pace, so a slow landing and an
  easing dolly need dense keys): out of the module as before, the crane down and round
  slowing to a drift as it lands at eye level at 17,5 s; the drift 5° round to side on
  until 31 s; the dolly back to 28 m from 31 to 48 s, slow at both ends. LHCb's collision
  starts at 12,6 s (camera 16 units from the flag) so its bunches cross on the landing
  and the music's arrival; on the collision's `cross` event `<LisTakeover>` slows the
  world to 0,15 for a second (the flash blooms; at 0,08, keyed to the slide's clock, the
  crossing drifted seconds late and the flash took three seconds to bloom), then runs it
  at 0,6. The debris then crosses the detector in ~10 s while the camera lingers: each
  station flares as the debris front reaches it (`pulse: thanks`, `light 4.0` on `det`,
  setup/detector.js; the flare capped for the calorimeters and muon walls, which at
  their doubled weight flared to a white slab) and the grains its tracks pass through
  (the hits) light and stay lit, weighted like their part (the VELO's at a quarter: at
  full strength they stayed a white blob at the vertex). The emblems gather on the dolly
  (camera 26 units out, 38,5 s), whole by the second climax; the collision and the small
  flag at the module fade with them, as before; „Ačiū“ 0,6 s after the camera stops
  (~48,6 s); `wordBy` 62 s. Checked on headless recordings of slide 33 (llvmpipe,
  1280×720, three rounds).
- LHCb on „Ačiū“ is a 3D model, not grains (owner, 20 Oct: "improve the 3d detector at
  the end"; of four offers he took a sharper, more solid form and "40 million collisions a
  second", tried colour by sub-detector and dropped it, "The blue one i like better";
  "Doesn't have to be point cloud if that looks better"; of two blue versions recorded,
  A sharper grains and B the model, "B"). `det` draws `mesh: data/lhcb-mesh.glb`
  (hero/export_mesh.py, Blender 4.5.14 LTS; the source .glb is Phoenix's LHCb.glb.zip, kept
  in ~/.cache/outreach_talks/, out of git) with `grains: false`: per part a decimated
  surface, faint faces, a rim glow by the view angle and the feature edges as lines, all
  in the detector's blue, added on; per-part gains (`meshLook.gain`, `lineGain`) because
  SciFi's stacked mats and the muon walls' tiles summed to white. The same front reveals
  it, and the debris flare and the crossings light it. The person for scale is in the same
  file, a 3D figure in the same light (Blender's Human Base Meshes v1.4.1, CC0,
  `GEO-body_male_realistic` as authored, 1,83 m, facing the camera at the muon wall's
  foot), replacing the flat grain cut-out ("the person is weird…"). The crossings after the
  event (`cascade` on `det`, from 7 world-s after the crossing, ~30 s): fronts down the
  detector from 0,35 a second, faster and faster, merging into a steady glow by the second
  climax; no distinct flare more than about twice a second, and the glow does not flicker
  (the broadcast flash rule). Variant A stays one switch away: drop `mesh` and `grains:
  false` (the grains were re-baked the same day, 3,8× on faces and 0,3 more along feature
  edges, with each grain's normal in lhcb-grains.shape.bin, and look good: lit faces,
  crisp edges; hero/bake_grains.py reproduced the old bake byte for byte first).
- The cover's pentaquark reads as five quarks (owner, 20 Oct: "the pentaquark
  (far too many quarks and some orbits)"): headless frames showed five nodes, but
  each a loose sparkle of grains with a weak core, pairs drifting together on
  their orbits, and the flowing strings and the shell's rim reading as orbit
  lines. The hero object now has tight quarks (`quarkRadius 0.42`, was 0.72),
  small sharp cores (`coreSize 6`, was 15: a core is one sprite sized by
  distance, and larger ones read as out-of-focus discs that grew and shrank as
  the quark orbited), slow orbits (`speed 0.15`, so the five keep apart) and a
  dim haze (`haze #1c2c4c`), which also dims the strings to a faint binding. The addon is unchanged; undo by dropping those keys in space.json.
- Credits (owner, 19 Oct: "We don't need credits at the last slide"; of the
  two options offered, "B"): the Planck map and Sailko's 1989 photo stay, and
  the licence credits moved from „Ačiū“ to a page after it that is never
  shown in the room (`class: credits-page`, one per line, readable); it
  stays in the web deck and the PDF. The other option was replacing those
  two images (WMAP, CERN's own scan) so nothing needs a credit.
- The owner's restructure list (12 Oct), which the deck now follows: the title
  slide back; the zoom-out ending on the cosmic web, whose last frame becomes
  the funnel; the funnel as Big Bang → CMB → no stars → hot dense
  proto-galaxies → colder, darker, galaxies far apart; the low hum only while
  zooming into the funnel (`hum: false` on every other slide, `humAt: all`;
  14 Oct, "only 2-3s": `<ShortHum>` on slides 4-5 stops it 1.5 s after it
  starts, so it swells and fades in ~3 s; it watches the hum, so a restart by
  the stage, the tab back in view or audio unlocked there, is cut too);
  CERN overview; the LHC tunnel as a moving clip with slide 9's numbers; a
  collision from the OpenData talk (he picked the CMS 4π event, 12 Oct: CMS
  Open Data record 300, `"event": "cms"` on both objects since the module
  reached main, OpenData's camera path on slide 9, a slower, closer one on „Ačiū“); the LHCb
  video with sound; LHCb factoids over a collaboration photo; LHCb results
  floating with the paper count; three section breaks („O kur tai
  pritaikoma?“ — his "So what are the applications", in the deck's Lithuanian
  — „O kaip komercializuoti?“, „Lietuvos istorija CERN“, the last dropped
  13 Oct); each invention's
  caption with its year invented and the machine it served; 613 mln. CHF right
  after 700+; the FCC as an overview clip; the reverse zoom dropped; „Ačiū“
  over a slow collision filling the screen. These supersede the 10 Oct "no
  cover / no sections / no words" for those slides (lint's TEXT warns on them,
  expected).
- The prologue and the plots (owner, 13 Oct): the web's grains make the funnel
  before it resolves and its mesh comes in (World, "The prologue"); slide 12's
  plots are drawn as OpenData draws its plots ("a really nice way of this was
  in opendata talk"): `scripts/plots_dark.py` turns each figure's lightness
  over (hue kept, black ground, ink at #e8ecf4 under the bloom threshold,
  saturated colours lifted, hairlines thickened, 1280 wide), `setup/plots.js`
  draws it unlit and additive. Additive lines tangle where cards cross, so the
  cards were moved until none overlaps another, leaves the frame or touches
  the count anywhere along the slide's path (± the sway); keep that when moving
  one. The credit says „apkarpyti, perspalvinti“ (CC BY 4.0 asks that changes
  be indicated). The CP-violation figure is its left panel only, Λb⁰ (owner,
  13 Oct: "repeated": the Λb⁰ and anti-Λb⁰ panels look alike); a narrower card
  inside the old one's footprint, so the layout holds.
- A stale page reloads itself (owner, 13 Oct: „Failed to fetch this slide“ on
  slide 29): Pages keeps only the latest build, so a page built from an old
  index.html (a tab opened or restored from cache after a deploy) asks for
  chunks that are gone. Slidev loads every slide ~3 s after opening, so
  `setup/main.ts` reloads on Vite's `vite:preloadError` only in the page's
  first 20 s, on the same slide, at most once a minute; a later failure shows
  the slide's error as before (never a reload mid-talk: review of a85cbd8).
  At the venue, still reload the deck before starting (or use `pnpm venue`).
- The cover's fly-in runs clear of the main thread (owner, 14 Oct: "slight lag
  on cover slide animation"). The pentaquark flies in over 3 s from ~0.6 s
  after the world's boot, on a clock a long task freezes. A trace of the cover
  found, inside that window: lhc-opening's two CMS fills when its dynamic
  import arrived (~0.25 + 0.3 s), the 8 photo places building when Slidev's
  3 s preload mounted their slides (8 synchronous photo decodes, ~0.5 s), and
  the funnel's CMB disk decode and 2048² upload. Now `setup/main.ts` imports
  event-cms.json, so both fills run in the boot (lhc-opening unchanged; Vite
  warns the dynamic import stays in the entry chunk, expected); two one-way
  latches in `setup/afterCover.js` flip 1.2 s after a clip covers the screen
  and still does (the opener; going back to the cover first cancels it):
  `places` mounts the place StagePhotos (`<AfterCover>`), `disk` lets
  funnel.js's `warmDisk` decode and upload the CMB picture, both under the
  clip. Fallbacks for an opener that failed or was skipped: `disk` on the step
  to slide 3 (it opens on a held still frame), `places` under the next clip
  (7, 8, 10) or on the step to slide 12; a page opened past slide 1 flips both.
  A rehearsal jump from the cover straight to a place slide (`g 14`) builds the
  place on arrival, so the camera turns to it late (once). Review of the change
  (3 lenses) found no defect in the CMS import; its four low findings are fixed
  or noted here. After it: nothing ≥ 30 ms on the cover's main thread after the
  boot but Slidev's own ~40 ms mount of every slide at 3 s (headless trace).
  If it still stutters on the venue machine, press `c` on the cover once the
  page has settled (replays the assembly).
- „Lietuvos istorija CERN“ is the LHCb Week aftermovie since 20 Oct (owner: "show a
  video from the LHCb Week instead of the four photos"; "Don't worry about photos show the
  entire aftermovie"): `lhcb_week_aftermovie.mp4`, the whole film (2:28, high-motion,
  1080p, 123 MB, its own music at -16 LUFS; on the release with `--only`), film by
  Nebula Moments (R. Unkevičius), credited on the credits page; its 0:25–0:31 holds
  what the four photos showed. Starfire now starts on the light injection clip
  (slide 30), so it is still before its 49 s on „Ačiū“. The four photos' notes,
  facts and sources are merged into the film slide's. The talk times at 25,0 min. The
  photo decision below is kept for the record (the figures stay in the repo).
- (Superseded 20 Oct) „Lietuvos istorija CERN“ is photos only (owner, 13 Oct: "just have some
  pictures about LHCb visits from the ministers and LHCb week"): four from the
  LHCb Week's opening in Vilnius, StagePhotos at `kt`, the camera turning a
  little between them. CERN's photo archive has no Lithuanian minister at LHCb
  (the state visits went to CMS and the LHC tunnel), so the officials are the
  President's video greeting (he was the week's patron) and vice-minister
  Valutytė on the opening panel; ask the owner for any other minister photos.
  The President-at-CERN photo (`hero_lt.jpg`, CMS, kept in figures/) and the
  Light Conversion slide left the deck (the firm stays in the notes of „O kaip
  komercializuoti?“). Sources: the owner's Drive
  `2026-09-14_LHCb_Week_Vilnius/Opening_Ceremony` (LHCB-47, -59, -172; the
  photographer is not recorded, probably VU's) and VU's press photo P1197849
  (T. Laurinavičius / VU); the credit „VU nuotr.“ waits for the owner's word.
- No driving sounds (owner, 12 Oct: "don't use the 'driving away sound', sounds
  funny"; to OpenData, 13 Oct: "transitions were like driving sounds"): the
  collision's falling boom is gone from components/lhc-opening (27e9837, for
  every talk), and the stage's flight whoosh and clip rise are off here
  (`stage.sound: { hum: true, flight: false, clip: false }`). What still
  sounds: the funnel hum (slides 4-5, ~3 s each), the collision's swell, thump and drone
  (slide 9; sub-bass, barely there on laptop speakers), the clips' own audio.
- The LHCb clip's sound is the owner's own edit `lhcb.mp4` (owner: "should be on
  gdrive"): its music is the drive's untagged `Sunshine Adagio in D Minor.mp3`,
  probably John Murphy's commercial film score (2007); seven other decks
  already play it on the public site. Flagged to the owner, not cleared.

- Wording (review of 8 Oct): never „kolaborantai“ (collaborators with
  occupiers) but „kolaboracijos nariai“; the +14 % is against comparable firms;
  the HL-LHC 1,8 CHF counts discoveries at zero; CERN made the web, not the
  internet; the touchscreen and PET are "among the first", not CERN inventions;
  CERN alumni: about three in four work outside research and education (2026
  study §5.4), not "in industry".
- No words on the slides (owner, 10 Oct: "No titles, statements - I will be
  there. Don't need newspaper-like titles. What can stay is the numbers. I
  will narrate myself"): no titles, kickers, part words, years or credits,
  the cover and the section slides included ("without title and section
  slides"). Two exceptions, the owner's too: each invention carries its name
  as a caption of a word or two („Jutiklinis ekranas“ …, `.invention`, bottom
  left on its own ground), and a number says what it is with its unit or one
  word for what it counts (owner: "I prefer fewer words so I can adapt to the
  audience. These slides are not lecture slides") (13,8 mlrd. metų, 4 TB/s, 26,7 km … 1,5 mlrd. susidūrimų/s,
  700+ sutarčių, +14 % apyvartos, 91 km, 613 mln. CHF). `talk lint`'s TEXT
  still flags those (expected until Tools' fix). The section slides' switches
  moved to the next slide: `places: { inventions: true }` on the touchscreen,
  `false` and the strands off on 700+; their notes open those slides. (Since the
  12 Oct restructure brought the section slides back, the switches are on them:
  `true` on „O kur tai pritaikoma?“ (13), `false` and `<Strands :on="false" />`
  on „O kaip komercializuoti?“ (23); review, 21 Oct.)
  Each removed credit and source is in its slide's notes. The credits a licence
  asks for stood in tiny print on the last slide (owner: "Credit on last slide
  tiny print"; CERN's material needs none) until 19 Oct; since then they are on
  a page of their own after „Ačiū“ (Decisions, "Credits"): the Planck map, the
  1989 proposal photo, the MARS image and the three CERN photos under CC
  licences. The photos
  have no dark text ground any more (`.hero::after` off).
- The opener's first press (10 Oct, while there was no cover; the title is back
  since 12 Oct, so this only guards a deck opened at slide 2):
  `setup/OpenerStart.vue` shows its first frame
  (the poster) at once while the clip buffers, holds the clip at 0, and turns
  the first press (→, space, PageDown, ↓, p, click) into play-with-sound
  instead of a step: Chrome pauses a clip unmuted before any press, so the
  first → used to skip it. The slide says `layout: default` (Slidev gives a
  first slide the cover layout, whose box held the clip at 0 px).
- Taken overnight on 10 Oct (owner asleep, "complete everything"; the
  recommended option, for the morning): the three CERN photos under CC
  licences stay in the credits (drop them if CERN-user covers them?);
  presenting through /presenter, click the audience window once before the
  first press (the title's notes say so). (The closing pentaquark question is
  gone: the close is „Ačiū“ over a collision since 12 Oct.)
- No slogans, no rhetorical openers in the notes either.
- Part II opens with „O kur tai pritaikoma?“; the speaker names each problem.
- The accelerator is „greitintuvas“, never „mašina“ (a CERN-English calque);
  White Rabbit „suderina laikrodžius“; the liaison is an Inovacijų agentūros
  „specialistė“, not „pareigūnė“ (Scheduler's audit, 9 Oct).
- The funnel follows the NASA/WMAP figure (owner, 9 Oct): CMB in a WMAP-like
  palette from the Planck 2018 map (`cmb_wmap.png`); the Big Bang flare fades
  when the camera looks down the axis, and the disk dims with the viewing angle
  so overlapping grains keep their colours.
- Match cuts: none since 12 Oct (the tunnel is a clip; the 4 TB/s ring slide
  went into the LHCb numbers slide). Ring → CERN aerial and loop → FCC were weak.
- Part II's photo places are one group, `group="inventions"`: the section
  slide 13 says `places: { inventions: true }`, slide 23 `false` (since 12 Oct;
  first the touchscreen and 700+), so they are hidden in the prologue, Part I and
  Part III (v0.5.2).
- Data → White Rabbit (2012, Frankfurt exchange), the thing that left CERN;
  the grid figures are in the notes. The photo's credit („© CERN (KT
  ataskaita, 2024)“) is taken from the KT report page; the photographer is
  not named there.
- Part II's captions: name · year invented · machine served (owner, 12 Oct: "a
  few more bits of info on each caption (year invented), collider it
  served"), e.g. „Jutiklinis ekranas · 1972 · SPS“. The year is when CERN
  invented or first made it (touchscreen 1972 = Stumpe's proposal, not the
  1973 prototype; White Rabbit 2008 = the project's start, first used 2012);
  PET carries no machine (none applies), hadron therapy carries PIMMS (CERN's
  design, not a collider). Each year is in the facts bank.
- No gold text (owner, 9 Oct: "gold letters are all over the internet now
  because everyone uses AI as a designer"): headlines and numbers white, one
  light-blue accent (`--in-accent: #9cc4ff`) for kickers, units and the rare
  emphasis. Gold stays only in the world's grains (strands, the KT seed, the
  FCC ring), which read as warm light beside the blue.
- The FCC is CERN's 2025 map clip `cern_footage_2025_014_002.mp4` (owner,
  12 Oct: "FCC overview video, not this animation"): the 90.7 km ring draws
  itself round Geneva beside the LHC. The grain ring (`fcc` strands) stays in
  space.json, unused.
- Light Conversion (owner's pick, 9 Oct; slide 30 since 12 Oct) stands in the world until
  the firm gives a photo with permission; then it becomes a StagePhoto at that
  pose. Its line is the owner's: „Light Conversion“ lazeris PHAROS 2021 m. buvo
  pasirinktas CERN greitintuvui CLEAR. Never "dabar" (2026 use unconfirmed).
- Print and PDF (toolkit, since v0.5.3; the talk's own PrintStill is retired):
  the stage prints `public/stills/NN.jpg` under each slide's own text, and the
  on-screen fallback shows the same stills. They are the world alone, from
  `slidev-stage-shots <dist> public/stills --stills` (v0.6.4 settles each
  slide on the engine clock: the whole deck in about a minute; reshot on
  v0.7.0, so 05–06 print the real Planck map). Clips print their posters (`public/video-frames/*.poster.jpg`,
  `slidev-videos frames --all`); the LHCb animation's is at 0:24 by the
  manifest's `poster = "0:24"` (its first lit frame is a speck on black), which
  lists that library clip for the poster only. Export checked on v0.6.4: every
  page has its text (the AfterFlight captions too), its own still and the
  deck's fonts, 11 MB; a blank last page is Slidev's. Slidev's default
  `h1 + p { opacity: .5 }` greyed Part II's invention line: `.pf .answer` sets
  opacity 1. v0.6.5 printed the part words over the photos; v0.6.6 prints
  animations at their end state (hidden), and the deck keeps its own
  `display: none` for them in print as a belt.
- Place mode over screen mode for Part II (owner via the Scheduler, 8 Oct):
  the inventions visibly hang off the machine.
- The opener stays whole (slot ≥ 25 min).
- Asset paths are relative to the deck's base: `src="figures/…"` on StagePhoto
  and WebTakeover, never `/figures/…` (that resolves outside
  `/cern_outreach_talks/2026_10_23_Innoday/` on Pages, and a local build with
  base `/` hides it). Before a deploy, `pnpm pages:check`: builds with the
  Pages base, serves it under that prefix, opens slides 11 and 13 and print
  mode, and fails on any request that fails (clips excepted: they come from
  the release).

## Figures and open items (for the speaker)

- The close's LHCb logo is the collaboration's own (lhcb.web.cern.ch/speakersbureau/material,
  `lhcb-logo-300dpi.tif`): its marks only, recoloured for a black ground
  (`figures/lhcb_logo_grains.png`; CERN's material, no credit). The music:
  Scott Buckley, „Starfire“ (scottbuckley.com.au/library/starfire), CC BY 4.0,
  credited on the credits page; the track from 0:30 to its end is in the deck
  (`public/audio/starfire_close.m4a`, -16 LUFS). Nobody has listened to it in
  this session: check once that 1:25–1:40 has no whoosh or riser.
- The light injection system (facts lhcb-scifi-lis, -lis-vcsel, -channels,
  -layout, -modules-area, -z-position, lhcb-vilnius-scifi-lis; 19 Oct): at
  each module end, two LIS boards (6-layer PCBs, two GBLD drivers and two
  670 nm VCSELs each), and per mat an aluminium light injection bar holding a
  fibre whose last 13 cm are scratched; each SiPM channel sees 1-5
  photoelectrons, to set the PACIFIC's thresholds (1,5, 2,5, 4,5 p.e.).
  524 288 channels. The board count (512 boards, 1024 VCSELs) is arithmetic, unverified: don't say
  it. Vilnius: only the group's own agenda (3 Oct 2024) lists „SciFi + Light
  Injection System“ among its service tasks; say no more than that the
  group's service work includes the SciFi and its LIS, unless the owner
  confirms more. Area: about 320 m² (CERN Courier 2021; 340 and 360 m² are
  older figures). Stations at about 8-9,3 m from the collision (2014 TDR).
- The MARS wrist image is © MARS Bioimaging (CERN KT hosts it); ask MARS
  before any non-educational use.
- On the venue laptop, read the stage's frame-rate guard at the close
  (`document.querySelector('.stage canvas').__space.guardStage`); above 0
  means a slide was too heavy.
- The talk is on 23 October 2026. The videos release tag still says `10_00`.
