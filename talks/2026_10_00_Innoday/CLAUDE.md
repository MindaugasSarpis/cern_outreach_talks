# Innoday (talks/2026_10_00_Innoday)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.
The round-by-round log (what each round changed, recordings, deploys) is
`HANDOFF.md`; this file is the state.

## Brief

„Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų
pritaikymo privačiame sektoriuje“, Innoday 2026, in Lithuanian, for an
innovation-day audience (business, policy). Venue, 16:9 projector. Slot about
25 min or more (owner, 2026-10-08); the deck runs ≈ 23 min with the clips.
Date placeholder `10_00`. Speaker: Dr. Mindaugas Šarpis, LHCb Vilnius, VU.

## Story

One spine, retellable in a breath: to see what the world is made of,
physicists needed a machine nobody could buy; each of its limits had to be
broken; the solutions left CERN as things in daily use; the next machine (FCC)
brings the next round, and Lithuanian firms can solve it.

- **Prologue.** Zoom-out from the VU Faculty of Physics to our galaxy (clip,
  advance-on-end) → the takeover (its last frame becomes the world's grains) →
  the history of the Universe as a funnel of grains, seen from outside → the
  camera flies back down it to the CMB („380 000 metų po Didžiojo sprogimo“,
  Planck map) → „Iš ko visa tai sudaryta?“ over the oldest light.
- **I · Mašina.** CERN aerial clip, LHCb animation (media run), then LHCb's
  4 TB/s at grain level on the ring, whose curve becomes the tunnel's (the one
  match cut), and the LHC's limits on the tunnel photo.
- **II · Sprendimai.** The ring with six strands of grains, each from the part
  that forced an invention to the invention's photo standing at its end
  (StagePhoto place mode): control room → touchscreen; information → the web
  (1989 proposal, 1993 public domain); detectors → PET, colour X-ray, Timepix
  round the Moon; beams → hadron therapy; the timing system → White Rabbit (Frankfurt
  exchange); magnets → the superconducting line (tested with Airbus). The part is named during the flight.
- **III · Privačiam sektoriui.** How technology leaves CERN (700+), what suppliers gain
  (+14 %), the next machine (FCC: its ring in grains round the LHC at true
  scale, its strands ending empty), Lithuania (associate, full-membership bid),
  the bookend clip (the zoom-out reversed, back to Saulėtekis), one Lithuanian
  firm (Light Conversion: PHAROS chosen in CERN's 2021 tender for CLEAR), what a
  firm can do (613 mln. CHF a year; register, write to the liaison officer),
  „Ačiū“.

## World

Everything is grains; no solid shapes, no labels (one deliberate exception:
the part word during a Part II flight, gone before the photo lands).

- Stations (`public/data/space.json`): `hero` (the pentaquark: cover, close),
  `collider` (the LHC ring; carries `strands`), `cosmos`, `web`, `kt` (the gold
  seed and loop: Part III), `funnel` (the history of the Universe, at
  [30, 40, −110], its axis along −z behind the takeover's galaxy).
- Talk-owned builders (`setup/`, registered in `main.ts`; `stage:check
  --types strands,funnel`): `strands.js` (grains from ring parts to products,
  in groups: `inventions`, Part II's, on from section II and off from section
  III; `fcc`, a second object on the collider station with its own `ring` of
  grains at 7 × 90.7/26.7 = 23.8 and six strands ending empty, on slide 25 only;
  `<Strands :on group>`), `funnel.js` (wall rings and
  lines, the Big Bang, the CMB disk coloured from `public/figures/cmb_wmap.png`,
  dark ages, first stars, galaxies).
- Part II photos are StagePhoto places with depth maps
  (`public/figures/*.depth.png`, `slidev-videos depth`, committed), relief
  0.25–0.35, `flight: 1.6`, condense 0.8 s; text is up 2.6–3.8 s after the
  click. The 1989 page and the tunnel stay screen StagePhotos (not full bleed).
- The takeover (`setup/WebTakeover.vue`, `takeover.js`): the opener's last
  frame (`public/figures/opener_last.jpg`, our galaxy) as 280 000 grains, gain
  1.3, saturation 1.35; the dissolving copy has its own WebGL context only
  for the 3 s dissolve (released after it, a new canvas each time: a second
  context held all talk long raises the odds of a context loss on iPhone); opener and takeover share the pose [30, 40, −70],
  dist 18, yaw 0, pitch 0, sway 0; the clip uses `transition="fade"`.
- Look (owner, 8 Oct: "more striking, photorealistic"): black ground
  (`palette.bg #000103`, density 0.6, dustGain 1.45, nebula 0.12, vignette
  0.42); 2400 px photographs; MedAustron is a Lanczos 2× upscale, nothing
  invented.
- Clips: `vu_ff_zoom_galaxy.mp4` (talk-owned, 4:26), `vu_ff_unzoom.mp4`
  (talk-owned bookend, 0:30, made by reversing the opener; do not `--prune`
  `vu_ff_zoom.mp4`, its source), library `cern_overview_short.mp4`,
  `cern_footage_2022_042_001.mp4`.
- Toolkit: slidev-videos v0.6.4 (both addons; `strands` registered `enterable: true`): place groups, `humAt: all`,
  `?stage-debug`, quality tiers (a phone starts at 2; desktop and the headless
  recorder at 0, `pages:check` prints it), lighter photo places, the context-
  loss fixes, stills and posters for print (v0.5.4: correct per page).

## Status

2026-10-09: **complete, pending the owner's review.** Live: 6001e31, Pages run
37944984688. On the branch: v0.6.4 (stills re-taken on the engine clock, the
cover title still lands with the pentaquark at ~4 s), Part II's invention line
at full white. Waiting: the Light Conversion photo (owner).

## Decisions

Dated detail in `HANDOFF.md`. The ones a later session must not undo:

- Wording (review of 8 Oct): never „kolaborantai“ (collaborators with
  occupiers) but „kolaboracijos nariai“; the +14 % is against comparable firms;
  the HL-LHC 1,8 CHF counts discoveries at zero; CERN made the web, not the
  internet; the touchscreen and PET are "among the first", not CERN inventions;
  CERN alumni: about three in four work outside research and education (2026
  study §5.4), not "in industry".
- No slogans, no subtitles under „Ačiū“ or part titles, no colon or dash
  reveals, no rhetorical openers; kickers only where they add information.
- Part II is "Sprendimai" (solutions), each slide names its problem.
- The accelerator is „greitintuvas“, never „mašina“ (a CERN-English calque);
  White Rabbit „suderina laikrodžius“; the liaison is an Inovacijų agentūros
  „specialistė“, not „pareigūnė“ (Scheduler's audit, 9 Oct).
- The funnel follows the NASA/WMAP figure (owner, 9 Oct): CMB in a WMAP-like
  palette from the Planck 2018 map (`cmb_wmap.png`); the Big Bang flare fades
  when the camera looks down the axis, and the disk dims with the viewing angle
  so overlapping grains keep their colours.
- Match cuts: only ring → tunnel; ring → CERN aerial and loop → FCC were weak.
- Part II's photo places are one group, `group="inventions"`: section II
  says `places: { inventions: true }`, section III `false`, so they are hidden
  in the prologue, Part I and Part III (v0.5.2). Part I keeps its wide poses:
  section I sees the ring from above in the right half, clear of the title (target [8.8, 0, −3], dist 20, pitch 55), 4 TB/s and the tunnel
  look along the ring at pitch 22. (On v0.5.1 those poses had to look down at
  pitch 40 to keep the photos above the frame.)
- Data → White Rabbit (2012, Frankfurt exchange), the thing that left CERN;
  the grid figures are in the notes. The photo's credit („© CERN (KT
  ataskaita, 2024)“) is taken from the KT report page; the photographer is
  not named there.
- Part II, layout A (owner, 9 Oct): the problem is the headline, in the words
  slide 12 speaks („Valdyti greitintuvą“ …), the year a small kicker above it,
  the invention under it, then one line. The strands keep their ring order, so
  the years run out of order; as the biggest text they read as a broken
  timeline. Part words name ring parts only.
- No gold text (owner, 9 Oct: "gold letters are all over the internet now
  because everyone uses AI as a designer"): headlines and numbers white, one
  light-blue accent (`--in-accent: #9cc4ff`) for kickers, units and the rare
  emphasis. Gold stays only in the world's grains (strands, the KT seed, the
  FCC ring), which read as warm light beside the blue.
- Slide 25 is the FCC in grains, not the map photo (owner, 9 Oct): the number
  counts 27 → 91 km; the strands carry no labels.
- Slide 28, Light Conversion (owner's pick, 9 Oct), stands in the world until
  the firm gives a photo with permission; then it becomes a StagePhoto at that
  pose. Its line is the owner's: „Light Conversion“ lazeris PHAROS 2021 m. buvo
  pasirinktas CERN greitintuvui CLEAR. Never "dabar" (2026 use unconfirmed).
- Print and PDF (toolkit, since v0.5.3; the talk's own PrintStill is retired):
  the stage prints `public/stills/NN.jpg` under each slide's own text, and the
  on-screen fallback shows the same stills. They are the world alone, from
  `slidev-stage-shots <dist> public/stills --stills` (v0.6.4 settles each
  slide on the engine clock: the whole deck in about a minute). Clips print their posters (`public/video-frames/*.poster.jpg`,
  `slidev-videos frames --all`); the LHCb animation's is at 0:24 by the
  manifest's `poster = "0:24"` (its first lit frame is a speck on black), which
  lists that library clip for the poster only. Export checked on v0.6.4: every
  page has its text (the AfterFlight captions too), its own still and the
  deck's fonts, 11 MB; a blank last page is Slidev's. Slidev's default
  `h1 + p { opacity: .5 }` greyed Part II's invention line: `.pf .answer` sets
  opacity 1.
- Place mode over screen mode for Part II (owner via the Scheduler, 8 Oct):
  the inventions visibly hang off the machine.
- The opener stays whole (slot ≥ 25 min).
- Asset paths are relative to the deck's base: `src="figures/…"` on StagePhoto
  and WebTakeover, never `/figures/…` (that resolves outside
  `/cern_outreach_talks/2026_10_00_Innoday/` on Pages, and a local build with
  base `/` hides it). Before a deploy, `pnpm pages:check`: builds with the
  Pages base, serves it under that prefix, opens slides 11 and 13 and print
  mode, and fails on any request that fails (clips excepted: they come from
  the release).

## Figures and open items (for the speaker)

- The MARS wrist image is © MARS Bioimaging (CERN KT hosts it); ask MARS
  before any non-educational use.
- On the venue laptop, read the stage's frame-rate guard at the close
  (`document.querySelector('.stage canvas').__space.guardStage`); above 0
  means a slide was too heavy.
- The date is still `10_00`.
