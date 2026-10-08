# Innoday (talks/2026_10_00_Innoday)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_00_Innoday/` — Innoday (Lithuanian): "Nuo Vilniaus iki
  visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo
  privačiame sektoriuje". One spine (owner's feedback 8 Oct: the first flow
  was not coherent): to see what the universe is made of, physicists built a
  machine that pushed every technology past its limit; each limit broken
  became something in daily use, and Lithuanian firms can be in the next
  round. Prologue (NFTMC zoom-out → its last frame becomes the world),
  I the machine, II the inventions (each slide names the problem it solved),
  III back to the private sector. Photographs are full bleed (`.hero`);
  slides carry a few words, the notes carry what is said; no slogan cards.
  Coherence pass (8 Oct, owner: "weird, not coherent and sloppy"): 33 → 28
  visible slides. Part I answers the prologue's question (Higgs, LHCb, the
  pentaquark) and ends on the limits that made it possible (LHC extremes,
  LHCb's 4 TB/s); Part II follows its "Problema:" kickers grouped pocket →
  hospital → industry today, ending on Airbus so Part III opens on "a firm
  made a product of it". Cut to notes: the 1954 counter, the antimatter
  question card, LHCb Vilnius, the VELO chip, the top ten. Decisions log in
  `talks/2026_10_00_Innoday/HANDOFF.md`.
  Pinned to slidev-videos 5c72c33 (dust-fullframe, advance-on-end, StagePhoto). Date placeholder `10_00`.
  See "The stage (Innoday)" below.

### From "The stage (Innoday, and talks after it)"

The stage in general (headmatter, palette, slides, clips, checks, pins) is in
`docs/authoring.md`. Innoday's own parts:

- **Everything in the world is made of grains.** Innoday's stations are the
  particle pentaquark (`hero`: cover, the pentaquark slide of Part II, close),
  a `collider` (Part I, CERN), a `galaxy` (`cosmos`: the edge of the Universe
  and LHCb's antimatter question), `web` (two rings of `constellation` nodes
  whose strings cross like links: what CERN gave the world) and `kt` (a gold
  three-node seed with a ten-node loop round it: knowledge transfer); all
  points of light, no solid shapes, no labels, no scale bars. A first version opened Part I on a Solar
  System of lit spheres, rings and labels; it read as a classroom diagram
  standing in the scene and was removed (2026-09-29). Each form is born
  scattered and gathers when the camera arrives at its station; `c` builds it
  again. Grains streak while the camera flies; flights and arriving clips
  have a quiet sound (`stage.sound: { hum, flight, clip, level }`).
- **Innoday's own pieces.** `setup/Count.vue` (registered from `setup/main.ts`)
  counts a slide's big number as it arrives, Lithuanian style (thin space,
  decimal comma, `plain` for years). `styles/index.css` adds `.readout`,
  `.stats` (`.three`, `.gold`), `.feature` (photo, year, headline, one gold
  `.today` line), `.tiles`, `.news`, `.rank`. Photos live in
  `public/figures/` with their credit on the slide (`.credit`); CERN-terms
  photos are fine for this non-commercial site, the MARS wrist image is
  © MARS Bioimaging (hosted by CERN KT). Facts were checked on 7 Oct 2026;
  every slide's source is in its `.src` footer and its notes. A review round
  on 8 Oct 2026 (Lithuanian editor, fact-checker, talk coach, each edit checked
  by a second agent) set the wording: never "kolaborantai" (it means
  collaborators with occupiers) — "kolaboracijos nariai"; the +14 % is against
  comparable firms; the HL-LHC 1,8 CHF counts discoveries at zero.
  **The takeover** (2026-10-08, owner's design): the opener ends on the cosmic
  web; the next slide (`<WebTakeover />`, `setup/WebTakeover.vue` +
  `setup/takeover.js`) opens on that same frame (`public/figures/opener_last.jpg`),
  snaps the camera to the slide's pose under it, puts 280 000 grains of the
  frame into the world along each pixel's line of sight from the live camera
  (depth 14–46 by a smooth noise), and dissolves the copy into them, voids
  first; the slide after it orbits the picture so it shows depth. Opener
  and takeover slides share the pose `[30, 40, -70]`, dist 18, yaw 0, pitch 0,
  sway 0; the clip uses `transition="fade"` (dust would break it up). Until the
  owner's orbit clip exists, the opener is `vu_ff_zoom_galaxy.mp4` (the
  zoom-out cut at 4:26, before its fade to black) and `opener_last.jpg` is its
  real last frame, our galaxy; swap steps are in `videos/manifest.toml`.
  Exposure, judged in `record.mjs` takes: a frame lit all over (a galaxy disk)
  needs 280 000 grains at `gain` 1.3 (140 000 at 0.85 gave a fifth of its
  light; 1.25 at gamma 1.7 burned the knots white), and the grains start 1.35×
  more saturated than their pixels because the tone mapper greys what adds up.
  **Look** (owner, 8 Oct: "washed out… more striking, photorealistic"): the
  world's ground is black, not navy (`stage.options` density 0.6, dustGain
  1.45, nebula 0.12, vignette 0.42), the photographs are 2400 px CERN/NASA
  originals, and the one small original (MedAustron, 1200 px) is a Lanczos
  2× upscale, not an AI one, so no detail is invented.
  Open for the owner: the spine and its wording, the MARS wrist image is
  © MARS Bioimaging, the date is still `10_00`.
