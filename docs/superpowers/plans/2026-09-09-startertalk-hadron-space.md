# Startertalk Hadron Space — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Component sources are written directly to the files named below (they are the deliverable); this plan fixes their interfaces, data contracts, and checks.

**Goal:** Tell the whole "Pentaquarks at LHCb" talk inside one persistent 3D hadron space: date × mass × quark-family lanes, a camera pose per slide, eight pentaquark stops with the papers' plots, hazy particle borders on every panel.

**Architecture:** A data script turns Koppenburg's table into `public/data/hadrons.json`. `components/hadron-space/space.js` builds the three.js scene (ambient GPGPU field reused from `particle-hero/shaders`, hadron sprites, floor grid, labels, spring camera) and exposes `setPose`/`setStop`. `HadronSpace.vue` (mounted once from the deck's `global-bottom.vue`) maps slide frontmatter + clicks to poses and renders the stop HUD and figure panels. `HaloLayer.vue` (from `global-top.vue`) draws the particle halo around every `.card`/panel on the live slide. Deck-local CSS makes slides transparent and cards translucent.

**Tech Stack:** three.js 0.185 (already a root dependency), Slidev 52 global layers (`global-bottom.vue`, `global-top.vue`), `useNav()` for slide/click state, Python 3 stdlib for data, curl for figures, Playwright (from `~/slidev-videos/node_modules`) with SwiftShader for screenshots.

**Spec:** `docs/superpowers/specs/2026-09-09-startertalk-hadron-space-design.md`

## Global Constraints

- On-screen copy is labels and numbers: state name, date, mass ± error, experiment, status (observed / evidence / superseded), reference. No adjectives, no slogans.
- Data attribution on the cover: "Data: P. Koppenburg, List of hadrons observed at the LHC, LHCb-FIGURE-2021-001 and updates (CC BY 4.0)".
- Palette and type are the WoP landing's: `#050507 / #f2f5f9 / #8b97a6 / #7dd3fc`, Space Grotesk.
- Coordinates: x(year) = (year−1964)·0.25 for year < 2011, else 11.75 + (year−2011); y = mass[GeV]·1.4; z lanes (front→back) = 0, −3.2, −6.4, −9.6, −12.8, −16.0 for pentaquark, hidden-heavy tetraquark, open-flavour tetraquark, fully heavy, baryon, meson.
- Named poses: `wide` target (14, 5, −8) dist 34 yaw −35 pitch 18; `origin` target (0.5, 2, −6) dist 9 yaw −60 pitch 8; `future` target (30, 4, −4) dist 10 yaw −30 pitch 6. Defaults for `at: <id>`: dist 9, yaw −20, pitch 6.
- Commit trailer as in earlier plans; push to `origin main`.

---

### Task 1: Dataset — `scripts/hadrons.py` → `public/data/hadrons.json`

**Files:** create `talks/2026_09_00_Startertalk/scripts/hadrons.py`, `talks/2026_09_00_Startertalk/public/data/hadrons.json`.

**Interfaces (produces):** JSON `{ "source": {...}, "states": [ {id, name_tex, name, mass, mass_err, quarks, date, year_frac, experiment, ref, arxiv, note, lane, status, origin: "lhc"|"pre-lhc"|"addition"} ], "lanes": [ {key, label, z} ] }`. Ids for pentaquarks are `Pc(4380)`, `Pc(4450)`, `Pc(4312)`, `Pc(4440)`, `Pc(4457)`, `Pcs(4459)`, `Pc(4337)`, `Pcs(4338)`; landmarks `quarks-1964`, `J/psi`, `Theta(1540)`, `X(3872)`, `Z(4430)`, `Zc(3900)`.

- [ ] Fetch `https://koppenburg.ch/particles.html` (urllib; `--cached <file>` for offline), parse the 8-column table (HTMLParser), keep rows with a numeric mass.
- [ ] Name rendering: LaTeX → plain text (`\bar{c}`→`c̄`, Greek macros, `_{}`/`^{}` → subscript/superscript text, `\psi`→ψ); id rule: subscript `cc̄`→`c`, drop bars and charges, no spaces.
- [ ] Lane from the quark string: count quark symbols; 2 → meson, 3 → baryon, 5 → pentaquark, 4 → fully heavy if all c/b, hidden-heavy if it contains a `qq̄` heavy pair, else open-flavour.
- [ ] Status: `superseded` if the note says superseded / later resolved / not confirmed; `evidence` if it says evidence or a σ below 5; else `observed`.
- [ ] Append the two additions and six landmarks with their references (spec §2.1); write JSON; `--check` asserts 86 LHC rows, the 8 pentaquark ids present, every state has a lane and a year.
- [ ] Run: `python3 scripts/hadrons.py --check` → prints counts; commit script + JSON.

### Task 2: Paper figures — `scripts/fetch_figures.sh` → `public/figures/papers/`

- [ ] Download `hidef_*.png` from `https://lhcbproject.web.cern.ch/Publications/p/<paper>.html`'s `Directory_<paper>/`: 2015-029 `mjpsip-default`; 2019-014 `mjpsip-spectrum-all`, `mjpsip2x3`; 2021-018 `Fig1`, `Fig2a`; 2020-039 `Fig1a`, `Fig1b`; 2022-031 `Fig1`, `Fig2`. Name them `<paper>_<fig>.png`.
- [ ] View each; keep one per stop (the m(J/ψ p) or m(J/ψ Λ) fit projection with the peak). Downscale anything over 1.5 MB to 1600 px wide with the env ffmpeg. Record the chosen file per stop in `hadrons.json` as `figure` (path + caption "LHCb, <journal ref>, Fig. N").
- [ ] Commit script + PNGs.

### Task 3: Scene — `components/hadron-space/space.js`

**Interfaces (produces):** `createSpace(canvas, container, { data }) → { setPose(pose, { immediate }), setStop(id | null), setPaused(bool), dispose(), currentTarget }` where `pose = { at, dist, yaw, pitch }` and `at` is an id, a named pose, or `[x,y,z]`.

- [ ] Renderer/camera as in `particle-hero/sim.js` (WebGL2 + float check, container-rect sizing, FPS guard).
- [ ] Ambient field: the `passes.glsl.js` sim with `BOUNDS = (30, 14, 30)`, tiled by moving the points group to the camera position rounded to the box period, pointer parked far away.
- [ ] Hadron points: `ShaderMaterial` sprites with per-point `aColor`, `aSize`, `aHollow`; additive blending; drop lines to y = 0 (`LineSegments`, alpha 0.12); landmarks at 60 % brightness.
- [ ] Floor grid: year lines every 5 years across the lane span, lane lines along x; mass ticks at x(2011) every 1 GeV; labels as canvas-texture sprites (Space Grotesk via `document.fonts.load`, system-ui fallback): years, "GeV" ticks, lane names.
- [ ] Camera: target/position springs (exponential smoothing k = 3 s⁻¹, dt-clamped), idle sway/breathe when parked, `setPose` resolves ids to world points; `currentTarget` mirrors to `data-space-at` on the container.
- [ ] Highlight: the stopped state's sprite scales ×2.2 and pulses; a soft ring sprite at its position.

### Task 4: Components — `HadronSpace.vue`, `SpacePanel.vue`, `HaloLayer.vue`; deck global layers and CSS

- [ ] `components/HadronSpace.vue`: loads `/data/hadrons.json`, boots `createSpace`, watches `useNav().currentSlideRoute` frontmatter `space` and `clicks`; pose = `space` with `at = stops[clicks−1]` when `clicks ≥ 1` and `stops` exist; keeps the previous pose when a slide has none. Renders the stop HUD (left) and figure panel (right) as `SpacePanel`s when a stop is active. Static gradient fallback when WebGL2 is unavailable or reduced motion is on.
- [ ] `components/SpacePanel.vue`: translucent panel (`rgba(5,5,7,.62)`, blur 10 px, radius 12 px), `class="space-panel"`, slot content, optional `kicker`.
- [ ] `components/HaloLayer.vue`: one 2D canvas over the slide; each frame, rects of `.card, .space-panel, img.space-figure` in `.slidev-page[data-slidev-no="<current>"]`; per element 120 seeded dots on a rounded outline (±14 px), drift + twinkle, accent tint, 0.6 s fade-in; skips when the slide has none.
- [ ] `talks/2026_09_00_Startertalk/global-bottom.vue` → `<HadronSpace />`; `global-top.vue` → `<HaloLayer />`.
- [ ] `styles/index.css`: `.slidev-layout` backgrounds transparent (override the theme's background image), `.card` fill `rgba(5,5,7,.55)` + blur, gradient border and shadow off; cover/section/fact/statement layouts transparent.

### Task 5: Deck — poses, clicks, cover credit

- [ ] Add `space:` frontmatter per slide per spec §5; `clicks: N` on slides 6 (2), 7 (3), 8 (1), 9 (2). Check no slide with stops already uses `v-click`.
- [ ] Cover: keep text; add the data credit line (small, dim).
- [ ] Speaker note on slide 1: "the world is one scene; Space also steps through the pentaquark stops on the 2015, 2019, threshold and strange-partner slides".

### Task 6: Verification and ship

- [ ] `pnpm build` (Startertalk) succeeds; `slidev-videos check` clean.
- [ ] Headless shots (SwiftShader): slides 1, 2, 3, 4, 6 (+2 clicks), 7 (+3), 8 (+1), 9 (+2), 11, 16, 17, 22; assert `data-space-at` after each navigation; zero console errors (wake-lock aside). Inspect framing, HUD, halos; tune poses.
- [ ] CLAUDE.md: a "Hadron space (Startertalk)" section: files, pose schema, how to add a stop.
- [ ] Commit, push, deploy check.
