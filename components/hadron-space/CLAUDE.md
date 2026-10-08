# Hadron space (components/hadron-space/, components/HadronSpace.vue)

Startertalk's world, and the engine `slidev-addon-stage` was packaged from;
new talks use the package (`docs/authoring.md`, "The stage"). In the notes
below, `public/data/`, `deck.md` and `scripts/` are
`talks/2026_09_00_Startertalk/`'s; that talk's own parts (its records, deck
CSS, data components and how to verify it) are in its CLAUDE.md.

## Notes moved from the root CLAUDE.md (2026-10-08)

### Hadron space (Startertalk)

`talks/2026_09_00_Startertalk/` is told inside one persistent 3D scene: a
path of seven built scenes (stations) in the WoP landing's ambient particle
field, a uniform bright ground pulled only faintly toward the active station
(a station may set `gather`, and `pulse: <s>` shoves the dust outward that
often). Stations: `hero` (the cover and the close: a large living c c̄ u u d
cluster, quarks on their own tilted orbits — `cluster` with `orbit`, `core`,
`quarkScale` — the dust swirling into it, the camera swaying ±9°; `wide`
resolves here), `paper` (the 1964 slide: Gell-Mann and Zweig beside their printed passages, portraits and scans as lit sheets with caption text, five quark spheres drifting together), `theta` (a ghost cluster — five faint quarks that breathe
apart and never hold — standing for Θ⁺(1540)), `decay` (Λb⁰ →
J/ψ p K⁻ as tubes with a pulse), `interiors` (a Σc D̄ molecule and a compact five-quark ball at one 1 fm
scale), `neutrals` (Λb⁰ → Σc⁺ D̄*⁰ K⁻ with the π⁰/γ tracks dashed, and a
six-quark cluster), `future` (an empty grid). Design:
`docs/superpowers/specs/2026-09-09-startertalk-dioramas-design.md`; the
earlier spec (`…-hadron-space-design.md`) still governs the scrim. The stops it describes (a click flies to a state's orb and a HUD
shows its record and paper plot) were retired from the deck on 2026-09-11, with the `states`
station they flew to: small orbs and a fading slide confused more than they explained, and
the HUD repeated the slides' own figures. The data slides now show their plots and tables
directly; the HUD code stays for reuse.

- `public/data/space.json` — the stations: `id`, `pos`, `look`
  (`dist/yaw/pitch`, optional `target` offset) and `objects[]` of types
  `page | text | ring | tracks | spheres | planes | cluster | molecule |
  grid | bar` (fields in `scripts/check_space.mjs`, which also checks that
  every `space.at` and stop id in `deck.md` resolves; run it after editing
  either file). A track whose end is a vertex sets `labelAt` (`mid`, or
  `[x, y, z]` relative to the object) so its label does not sit on the node. A `ring` or a `cluster` with an `id` stands for a state; a
  `cluster` with `ghost: true` is a state that went away (Θ⁺). No hollow
  markers anywhere: an unestablished state is the same orb at a third of
  the light. `page.src` is written `/figures/…` and resolved against
  `import.meta.env.BASE_URL` at load (an absolute path 404s under the
  GitHub Pages base and left the sheet a blank white square, 2026-09-10). A `page` may set `paper` (a ground colour:
  the image is composed onto a sheet of that colour with a margin, for transparent
  scans) and `tone` (the albedo tint, default `#5c6066`); `halo: false` drops the faint
  halo behind a sheet.
- `components/hadron-space/dioramas.js` — one builder per object type;
  `buildStation()` → `{group, anchors, update, setDim, dispose}`. Every
  sphere (quark, state marker, decay vertex) is an `orb()`: a rim-lit
  fresnel shader, dark translucent centre, bright edge — a volume of glow,
  not a flat disc.
  `labels.js` — `makeLabel` (one line, tracked; `upper: false` for particle
  names) and `makeText` (multi-line); both draw the flavour of a particle name
  as a subscript (Λb⁰, Σc⁺, Pc(4312)⁺) through `particles.js`, whose one regex
  also feeds `subscriptHtml` for the HUD, so `hadrons.json` and `space.json`
  stay plain text. `space.js` — field, camera spring,
  `createSpace(canvas, container, { data, space, onArrive })` →
  `setPose({at, dist, yaw, pitch})`, `setStop(id)` (a rim-glow shell round the state), `setDim(k)`, `setPaused`,
  `dispose`. `at` resolves as `[x, y, z]` → station id → state id (sphere
  anchor + HUD offset) → named pose (`wide` = the hero station, `origin` =
  the paper, `future`). A look or a pose may set `sway` (idle yaw amplitude
  in degrees, default 2.5). Shells are fresnel bubbles (rim only). Flights 1.4–4.5 s by distance. The shared shader
  `particle-hero/shaders/passes.glsl.js` gained `uGather` (a wide pull
  toward a point; zero in the WoP hero).
  Rendering (spec `2026-09-11-startertalk-render-upgrade-design.md`): the
  canvas is opaque and draws the page gradient itself; EffectComposer with
  RenderPass → UnrealBloomPass → a finish pass (vignette, edge chromatic
  aberration, grain) → SMAA → OutputPass (ACES); a hemisphere light, a key
  directional and a fill point light that rides the look target; a
  RoomEnvironment PMREM at low intensity; the drawing buffer is capped at
  2560 px wide. Quark balls, state markers and decay vertices are `marble()`
  (MeshPhysicalMaterial, clearcoat, emissive core) with a thin fresnel rim;
  ghosts stay orbs; tubes and the page are lit. The dust takes `uFocus` (the
  camera-to-target distance): grains away from it draw bigger and fainter.
  The hero's pentaquark is born scattered (`arm()`: quarks 7–11 units out
  in the dust, strings, boundary and label hidden), is armed again when a
  flight toward the station starts, and assembles on arrival (the quarks fly
  in over 3 s with trails; strings, boundary and label fade in over the
  second half; then the pulse), so a whole cluster is never seen before its
  fly-in; `c` replays it. HadronSpace toggles `html[data-space-assembled]`
  and the deck CSS fades the cover's title in with it. Sound
  (`hadron-space/sound.js`, Web Audio, no assets): the lessons landing's hum made
  continuous, a 55 Hz drone that swells in while the pose is at the hero station
  (the cover and the close) and fades when the camera leaves; it starts at the
  first key press or pointer down (autoplay policy), never in `/presenter` (two
  open windows would hum twice); `sound` prop, default on; `root.__hum()` reports
  its level for the headless probes.
- Frame rule from the renders: an object appears to the RIGHT of the frame
  centre when its x is larger than the pose target's x; the ambient field
  wraps in a ±30 box around the camera, so stations can sit anywhere.
- `components/HaloLayer.vue` (from `global-top.vue`) dusts every `.card`,
  `.halo` and `.space-panel` with fine sub-pixel grains (count by perimeter,
  grains inside a neighbouring box dropped) — the same grain as the field.
- `components/HadronSpace.vue` — mounted once from the deck's
  `global-bottom.vue`; fetches `hadrons.json` and `space.json`; reads each
  slide's `space:` frontmatter and `clicks`; HUD (record left, paper plot
  right with its `see` line) after the camera lands; sets
  `html[data-space-stop]` while a stop is active; scrim between world and
  slide with opacity `dim`.
- Slide frontmatter: `space: { at: decay, dist: 13, yaw: -30, pitch: 8, dim: 0.2 }`.
  `stops: [...]` with `clicks: n` still works but the deck no longer uses it. A slide without `space` keeps the previous pose.
  Optional keys: `asof: 2015` renders each stop's record as of that year
  (a state whose `status_year` is later shows `status_before`; a `note` whose
  `note_year` is later is dropped). `dim: 0..1` sets the scrim; without it
  0 while a stop is active, 0.15 on cover/section/statement/fact/quote
  layouts, 0.6 on content slides; slides whose picture is the world itself
  use 0.2–0.35.
