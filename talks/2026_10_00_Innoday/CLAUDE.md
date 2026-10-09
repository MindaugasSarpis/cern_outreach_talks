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
  (+14 %), the next machine (FCC), Lithuania (associate, full-membership bid),
  the bookend clip (the zoom-out reversed, back to Saulėtekis), what a firm can
  do (613 mln. CHF a year; register, write to the liaison officer), „Ačiū“.

## World

Everything is grains; no solid shapes, no labels (one deliberate exception:
the part word during a Part II flight, gone before the photo lands).

- Stations (`public/data/space.json`): `hero` (the pentaquark: cover, close),
  `collider` (the LHC ring; carries `strands`), `cosmos`, `web`, `kt` (the gold
  seed and loop: Part III), `funnel` (the history of the Universe, at
  [30, 40, −110], its axis along −z behind the takeover's galaxy).
- Talk-owned builders (`setup/`, registered in `main.ts`; `stage:check
  --types strands,funnel`): `strands.js` (grains from ring parts to products;
  `<Strands :on>` fades them in with Part II), `funnel.js` (wall rings and
  lines, the Big Bang, the CMB cap coloured from `public/figures/cmb_planck.png`,
  dark ages, first stars, galaxies). `PrintStill.vue` shows a still of a
  world-only slide in print/export only.
- Part II photos are StagePhoto places with depth maps
  (`public/figures/*.depth.png`, `slidev-videos depth`, committed), relief
  0.25–0.35, `flight: 1.6`, condense 0.8 s; text is up 2.6–3.8 s after the
  click. The 1989 page and the tunnel stay screen StagePhotos (not full bleed).
- The takeover (`setup/WebTakeover.vue`, `takeover.js`): the opener's last
  frame (`public/figures/opener_last.jpg`, our galaxy) as 280 000 grains, gain
  1.3, saturation 1.35; opener and takeover share the pose [30, 40, −70],
  dist 18, yaw 0, pitch 0, sway 0; the clip uses `transition="fade"`.
- Look (owner, 8 Oct: "more striking, photorealistic"): black ground
  (`palette.bg #000103`, density 0.6, dustGain 1.45, nebula 0.12, vignette
  0.42); 2400 px photographs; MedAustron is a Lanczos 2× upscale, nothing
  invented.
- Clips: `vu_ff_zoom_galaxy.mp4` (talk-owned, 4:26), `vu_ff_unzoom.mp4`
  (talk-owned bookend, 0:30, made by reversing the opener; do not `--prune`
  `vu_ff_zoom.mp4`, its source), library `cern_overview_short.mp4`,
  `cern_footage_2022_042_001.mp4`.
- Toolkit: slidev-videos v0.5.1 (both addons).

## Status

2026-10-09: **complete, pending the owner's review.** Deployed 7163101 —
https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_Innoday/ —
Pages run 37898098431 (per-talk build and deploy green), URL 200. `talk ready`
passed with nothing skipped (lint 0 errors, check, shots, preflight, venue).
In it: the funnel → CMB opening (Planck 2018 map), Higgs and 76/86 cut, the
text round, the final talk-review (six lenses, 36 findings) and its delta
review (five lenses, 30 findings), White Rabbit in place of the grid, Part II's
photos kept out of Part I's frames, print stills on 16 slides.
Next: the owner's review on Pages; Tools' place visibility and `humAt: all`
when they land (then re-pose Part I if wanted).

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
- Match cuts: only ring → tunnel; ring → CERN aerial and loop → FCC were weak.
- Part II's photo places are built when their slides mount (all of them 3 s
  after load) and stay in the world. Until the toolkit can hide them, Part I's
  poses keep them out of frame: section I and the 4 TB/s/tunnel slides look
  down along the ring at pitch 40 from just above it, so the photos (y 2.5,
  4–6 outside the ring) stay above the top edge.
- Data → White Rabbit (2012, Frankfurt exchange), the thing that left CERN;
  the grid figures are in the notes. The photo's credit („© CERN (KT
  ataskaita, 2024)“) is taken from the KT report page; the photographer is
  not named there.
- Part II kickers name the problem in the words slide 12 speaks („Problema:
  valdyti mašiną“ …); part words name ring parts only.
- Print and PDF: `<PrintStill>` on the world-only and clip slides, the stills
  are settled last frames of `slidev-stage-record` runs in sequence (a shot
  taken after a jump catches flights mid-way); export with `--wait-until load`.
- Place mode over screen mode for Part II (owner via the Scheduler, 8 Oct):
  the inventions visibly hang off the machine.
- The opener stays whole (slot ≥ 25 min).

## Figures and open items (for the speaker)

- The MARS wrist image is © MARS Bioimaging (CERN KT hosts it); ask MARS
  before any non-educational use.
- Part II's photo places: a visibility control is asked of Tools (8 Oct);
  the Part I poses avoid them meanwhile (see Decisions).
- The hum drops on the open-space prologue poses (takeover, CMB, question):
  `humAt: all` asked of Tools (9 Oct).
- `ktbest-alumni` in research/facts.jsonl still says "into industry"; the
  deck does not cite it (reported to the Scheduler).
- On the venue laptop, read the stage's frame-rate guard at the close
  (`document.querySelector('.stage canvas').__space.guardStage`); above 0
  means a slide was too heavy.
- The date is still `10_00`.
