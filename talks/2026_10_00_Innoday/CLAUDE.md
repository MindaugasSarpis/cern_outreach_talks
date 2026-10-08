# Innoday (talks/2026_10_00_Innoday)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_00_Innoday/` — Innoday (Lithuanian): "Nuo Vilniaus iki
  visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo
  privačiame sektoriuje", for a business and innovation audience. Opens on
  the NFTMC zoom-out (`vu_ff_zoom.mp4`, copied to this talk's release), then
  CERN, LHCb, what CERN gave the world, and knowledge transfer into the
  private sector (2025–26 news, a top ten, what Lithuanian firms can do).
  Slides carry a picture, a number or a short headline; what is said is in
  the notes. Built on the packaged engine (`slidev-addon-stage`, blue
  palette, `hadron` plugin); every clip uses `transition: dust`. Date
  placeholder `10_00`, as for Startertalk. See "The stage (Innoday)" below.

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
  Open for the owner: the zoom-out plays whole (4:42; a manifest `trim` would
  shorten it), the closing `lhcb_aciu.mp4` has English captions inside, the
  MARS wrist image is © MARS Bioimaging, the date is still `10_00`.
