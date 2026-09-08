# Startertalk in one 3D hadron space — design

**Date:** 2026-09-09 · **Status:** approved in discussion, awaiting spec review ·
**Deck:** `talks/2026_09_00_Startertalk/` ("Pentaquarks at LHCb", 30 min, date TBD).

## 1. Summary

The whole talk is told inside one persistent 3D scene: the hadrons
discovered so far, laid out as a spectrum in space — discovery date along
the flight direction, mass upward, quark family in depth — wrapped in the
World of Particles landing's ambient particle field for volume. Each slide
is a camera pose; the deck flies from 1964 (Gell-Mann and Zweig) through
the LHC era, stops at each of the eight pentaquarks with the paper's own
spectrum plot floating beside it, and ends past 2026 in the empty part of
the timeline. Every card and plot appearing in the space carries a soft
border of hazy particles instead of a hard edge. The talk's text is kept.

## 2. The world (`components/hadron-space/`)

### 2.1 Data

- **LHC hadrons**: Patrick Koppenburg's table at
  https://koppenburg.ch/particles.html (86 states on 2026-09-09; CC BY 4.0,
  credited on the cover as "Data: P. Koppenburg, *List of hadrons observed
  at the LHC*, LHCb-FIGURE-2021-001 and updates"). `scripts/hadrons.py`
  fetches and parses the HTML table (columns: counter, experiment,
  particle, mass, quarks, date, reference, note) into
  `public/data/hadrons.json`; the JSON is committed so builds need no
  network. Fields per state: `id` (slug), `name` (LaTeX as published, plus
  a plain-text render for HUDs), `mass`, `mass_err`, `quarks`, `date`
  (ISO), `year_frac`, `experiment`, `ref`, `arxiv`, `note`, `lane`,
  `status` (`observed` | `evidence` | `superseded`, from the note and
  Koppenburg's hollow-marker rule).
- **Additions** (hand-curated in the script, each with its reference):
  the two pentaquark *evidence* states missing from the list,
  Pcs(4459)⁰ (LHCb, Sci. Bull. 66 (2021) 1278, arXiv:2012.10380, 3.1σ)
  and Pc(4337)⁺ (LHCb, PRL 128 (2022) 062001, arXiv:2108.04720,
  3.1–3.7σ), status `evidence`.
- **Pre-LHC landmarks** (hand-curated, PDG values, drawn dimmer and
  labelled "before the LHC"): 1964 quark model marker at the origin
  (Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401/412) — not a
  hadron, a star at x = 1964 on the axis; J/ψ 1974 (3097 MeV, meson lane);
  Θ⁺(1540) 2003 (LEPS, pentaquark lane, status `superseded` — "the
  pentaquark that wasn't"); X(3872) 2003 (Belle, tetraquark lane);
  Z(4430)⁺ 2007 (Belle, tetraquark lane); Zc(3900)⁺ 2013 (BESIII/Belle,
  tetraquark lane).

### 2.2 Coordinates

- **x (flight direction)** = date, linear in years, 1964 → 2028. World
  scale 1 year = 1.0 unit; the LHC era (2011–2026) is 15 units wide, the
  pre-LHC stretch (1964–2011) is compressed 4:1 so the origin is reachable
  without a long empty flight (piecewise-linear map, both pieces labelled
  with year ticks every 5 years).
- **y (up)** = mass, 0 → 11 GeV, 1 GeV = 1.4 units.
- **z (depth) = quark-family lanes**, 3.2 units apart, front to back:
  pentaquarks (cc̄qqq) · hidden-charm/beauty tetraquarks (cc̄qq̄, cc̄ss̄,
  cc̄us̄ …) · open-flavour tetraquarks (ccūd̄, cs̄ud̄, cd̄sū) · fully heavy
  (cc̄cc̄) · conventional baryons (three quarks) · conventional mesons
  (qq̄). Lane assignment from the quark string (count of quark symbols and
  presence of a q q̄ pair). Pentaquarks are the front lane so the camera
  can hover close to them with the rest of the spectrum receding behind.

### 2.3 Look

- Ambient field: the WoP landing's GPGPU curl-noise particle field
  (`particle-hero/shaders/passes.glsl.js`, reused as is) in a larger wrap
  box around the camera, so every pose sits inside drifting dust. Point
  count from the same device heuristic.
- Hadrons: additive glow sprites. Colour by lane (pentaquarks in the
  accent `#7dd3fc`, others in cooler dim blues), size by status
  (observed > evidence), hollow ring sprite for `evidence` and
  `superseded`. A thin vertical "drop line" from each state to the y = 0
  floor plane, faint, so mass reads as height.
- Structure: floor grid on y = 0 (year ticks as lines across all lanes,
  labelled every 5 years in Space Grotesk sprites), a mass scale at the
  left edge of the LHC era (1 GeV ticks), lane labels as sprites at the
  far end of each lane. Faint depth fog toward the back lanes. Grain
  overlay and the landing's palette (`#050507`, `#f2f5f9`, `#8b97a6`,
  accent `#7dd3fc`).
- Camera: perspective, FOV 50, poses are (target point, distance, yaw,
  pitch); flights use a critically damped spring (~1.6 s to settle), with
  a slow idle drift when parked (the WoP rig's sway/breathe). Look-ahead:
  none needed.

## 3. Persistence and poses

- `talks/2026_09_00_Startertalk/global-bottom.vue` mounts `<HadronSpace />`
  once; Slidev keeps global layers mounted across slides. `global-top.vue`
  mounts `<HaloLayer />` (§4).
- The scene reads the current slide's frontmatter via `useNav()`:
  `currentSlideRoute.value.meta.slide.frontmatter.space`, and the click
  index via `clicks`. Pose schema:

  ```yaml
  space:
    at: Pc(4312)          # a hadron id | wide | origin | future | [x, y, z]
    dist: 7               # camera distance (default 9)
    yaw: -25              # degrees around y (default -20)
    pitch: 8              # degrees above the target (default 6)
    stops: [Pc(4312), Pc(4440), Pc(4457)]   # optional: click k flies to stops[k-1]
  ```
  A slide without `space` keeps the previous pose. `clicks:` in the same
  frontmatter equals `stops.length` so Space advances stop by stop and then
  to the next slide.
- Named poses: `wide` (high, right of 2028, looking back along the
  timeline so the whole spectrum is in frame), `origin` (the 1964 star
  with the axis running away into the distance), `future` (parked past
  2026, the empty floor grid ahead).
- When a stop is active the scene emits the state's record; `HadronSpace`
  renders the **stop HUD** (a `SpacePanel`: plain-text name, date, mass ±
  error, experiment, status/significance, reference) anchored to the
  screen's left, and the **figure panel** (a `SpacePanel` with the paper
  PNG) to the right. Both fade with the flight.

## 4. Panels with hazy particle borders

- `components/SpacePanel.vue`: a translucent dark panel
  (`rgba(5,5,7,0.62)` + `backdrop-filter: blur(10px)`, radius 12 px) for
  text or a figure; no visible edge.
- `components/HaloLayer.vue` (in `global-top.vue`): ONE 2D canvas over the
  slide, `pointer-events: none`. Each frame it collects the rects of
  `.card`, `.space-panel` and `img.space-figure` inside the live slide and
  draws ~120 soft dots per panel jittered along a rounded outline (±14 px),
  slowly drifting and twinkling, accent-tinted, fading with distance from
  the edge. Dots are seeded per element so they don't re-roll every frame.
  So every existing `.card` in the deck gets the hazy border with no
  markup change, and so do the stop HUD and figure panels.
- Deck-local CSS (`styles/index.css`): slides' `background` image
  removed (transparent, the world shows through), `.card` fill made
  translucent (`rgba(5,5,7,0.55)` + blur) with its gradient border
  replaced by none; text colours unchanged. Section/fact/statement
  layouts likewise transparent.

## 5. Slide → pose map (the flight plan)

| # | slide | pose |
|---|---|---|
| 1 | cover | `wide`; cover text kept, credit line added |
| 2 | LHCb reel (full-bleed video) | `origin` — the camera flies to the 1964 star while the reel covers the screen, so slide 3 opens there |
| 3 | Hadrons: what QCD allows | from `origin`, hover the conventional lanes 1964–1980 (J/ψ in frame) |
| 4 | § The discovery decade | fly to 2003–2015: Θ⁺(1540) hollow, X(3872) |
| 5 | The golden channel | approach the pentaquark lane at 2015, dist 10 |
| 6 | 2015: two peaks | stops Pc(4380), Pc(4450) — figure `mjpsip-default.png` (LHCb-PAPER-2015-029) |
| 7 | 2019: nine times the yield | stops Pc(4312), Pc(4440), Pc(4457) — figures `mjpsip-spectrum-all.png`, `mjpsip2x3.png` (LHCb-PAPER-2019-014) |
| 8 | The threshold coincidence | stop Pc(4337) ("the one not at a threshold") — figure `Fig2a.png` (LHCb-PAPER-2021-018); the deck's thresholds SVG stays as a panel |
| 9 | Strange partners | stops Pcs(4459) — `Fig1a.png` (LHCb-PAPER-2020-039); Pcs(4338) — `Fig2.png` (LHCb-PAPER-2022-031) |
| 10 | CERN B-roll (full-bleed video) | pull back over the pentaquark shelf, dist 14, ready for the section that follows |
| 11 | § What are they? | slow orbit of the pentaquark cluster (yaw drifts) |
| 12–15 | pictures 1–5, what tells them apart | hold on the cluster, yaw +15° per slide |
| 16 | § How we will find out | fly right past 2026 into `future` |
| 17–19 | data are in / five handles / 2026 snapshot | `future`, small yaw steps |
| 20 | fact | `future`, pitch up |
| 21 | CERN overview (full-bleed video) | fly to `wide` under the video |
| 22 | Thank you | `wide`, idle drift |

Figures are fetched by `scripts/fetch_figures.sh` from the LHCb public
pages (`lhcbproject.web.cern.ch/Publications/p/<paper>.html`,
`Directory_<paper>/hidef_<name>.png`) into `public/figures/papers/`, and
committed (about eight PNGs; each is checked to be under 1.5 MB, otherwise
downscaled to 1600 px wide).

## 6. Fallbacks and constraints

- No WebGL2 float render targets, or reduced motion: `HadronSpace`
  renders the static gradient card; slides stay readable (translucent cards
  on the dark ground). PDF export and the overview grid show slides without
  the world (global layers are not rendered there).
- The 30-minute budget: the flight plan adds no slides; stops add clicks
  (8 in total) inside existing slides. The three full-bleed video slides
  hide the world while it flies, which is exactly when long flights happen.
- Keys: Space/arrows unchanged (Slidev); no new bindings.
- Performance: one WebGL context for the whole deck; hadron sprites ≈ 100;
  the ambient field uses the WoP FPS guard.

## 7. Verification

- `pnpm build` of the Startertalk succeeds; zero console errors in a
  headless-Chromium run (SwiftShader WebGL2).
- Screenshots: slides 1, 2, 3, 4, 6 (click 1 and 2), 7 (click 3), 8, 9,
  16, 17, 22 — checked by eye for framing, HUD legibility, and the hazy
  borders on cards.
- Pose changes are observable: a DOM attribute `data-space-at` on the
  scene root equals the active target id after each navigation.
- `slidev-videos check` still clean (no clips change).

## 8. Out of scope

Rewriting the talk's text; translating; touching other decks; a shared
package for the space (it lives in this repo's `components/` like
ParticleHero, and can be promoted later).
