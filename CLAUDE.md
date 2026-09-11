# CLAUDE.md

Guidance for Claude Code working in this repository. This file is the
detailed operating reference; the human-oriented lifecycle walkthrough
(new talk → media → preflight → venue → cleanup) is in
[README.md](README.md) — keep the two consistent when workflows change.

## Project overview

Monorepo of CERN outreach talks delivered as **Slidev** decks. Shared
theme and content components live at the repo root; each talk is a pnpm
workspace under `talks/<name>/`. The video pipeline, the `VideoPlayer`
addon and the shared clip library are the external package
**`slidev-videos`** (`~/slidev-videos` on this machine, editable-installed;
https://github.com/MindaugasSarpis/slidev-videos).

Current talks:

- `talks/2026_04_28_editAI/` — EditAI Seminar crash course, 2026-04-28.
  Audience: later-grade students, teachers, school principals.
  2880×1600 LED wall, 9:5. Owns the 14 chart renders + mokslo_sala on its release.
- `talks/2026_05_11_Sceptics/` — Sceptics Society talk, 2026-05-11.
  4K projector, 16:9.
- `talks/2026_07_18_Yaga/` — Yaga crash course (Lithuanian), 2026-07-18.
  4K 16:9 venue. Cloned from editAI; deck under construction.
- `talks/2026_09_10_WorldOfParticles/` — World of Particles open course,
  opening lecture, 2026-09-10. Video-only reel: landing (ParticleHero) +
  32 clips in three acts, all library clips except the opener
  `vu_ff_zoom.mp4`; 16:9, 1080p H.264 web tier.
- `talks/2026_09_00_Startertalk/` — "Pentaquarks at LHCb", a 30-minute
  technical physics seminar. Date not fixed yet: `09_00` is a placeholder —
  rename the dir, its `videos.toml` release_tag and the deck's `videos.release` once known
  (no talk-owned clips, so no release to rename).

## Environment setup (fresh machine)

```bash
conda env create -f env.yaml
conda activate outreach_talks
pnpm install                      # all talks' deps incl. the slidev-addon-videos player
                                  # (the slidev-videos CLI comes from env.yaml's pip entry)
cd talks/2026_09_10_WorldOfParticles
pnpm dev                          # opens http://localhost:3030
```

The conda env bundles everything: `nodejs`, `pnpm`, `python>=3.11`,
`ffmpeg`, `rclone`, `gh`, and the `slidev-videos` CLI (pip, git tag).

## Repo layout

```
/
├── videos.toml                   # slidev-videos [defaults] for every talk (repo, source remote, 1080p policy)
├── pnpm-workspace.yaml           # workspace: talks/*
├── theme/                        # shared Slidev theme (@slidev/theme-scienced fork)
├── components/                   # shared Vue components (ParticleHero, ParticleDiagram, …)
│   └── particle-hero/            # three.js scene behind ParticleHero (ported from CERN lessons landing)
├── scripts/new_talk.py           # scaffolder;  scripts/render_lib.py — animation rendering
├── videos/raw/                   # RAW BANK: originals for every talk (gitignored)
└── talks/<name>/
    ├── deck.md                   # Slidev entry — theme: ../../theme, addons: [slidev-addon-videos], videos: {repo, release, fit}
    ├── videos.toml               # project marker: raw_dir=../../videos/raw, release_tag
    ├── package.json              # slidev + slidev-addon-videos + videos:* scripts (slidev-videos <cmd>)
    ├── components/ -> ../../components   (symlink; required for auto-import)
    ├── public/figures/           # images, gifs
    ├── public/videos/            # encoded web copies (gitignored)
    └── videos/manifest.toml      # talk-OWNED clips only (library clips are inherited by name)
```

**Raw bank.** Originals live once per machine in `<repo>/videos/raw/`;
every talk's `videos.toml` points `raw_dir` there. `videos:sync` fetches
only the raws the current talk's manifest names.

**Theme** is referenced as `theme: ../../theme` in each deck's
frontmatter. Don't use a `theme` symlink — Vite's glob scanner doesn't
traverse symlinked theme dirs and silently drops custom layouts.
**Components** must stay as a symlink: Slidev auto-imports from
`<deck>/components/` and can't be redirected in frontmatter.

## Commands

Run from inside a talk directory:

```bash
pnpm dev / build / build:portable / export
pnpm videos:sync        # rclone manifest-listed raws -> <repo>/videos/raw/
pnpm videos:encode      # ffmpeg raw -> public/videos/ (1080p H.264, -16 LUFS)
pnpm videos:publish     # -> talk release videos-<talk>   (-- --prune drops unlisted assets)
pnpm videos:pull        # release -> public/videos/       (-- --include-shared for offline builds)
pnpm videos:check       # manifest vs files vs slide refs; library refs reported as inherited
pnpm videos:preflight   # VENUE LINT — probe what each ref will serve (codec/size/bitrate/audio/loudness)
pnpm videos:clean       # delete local files whose remote copy is verified (dry-run; -- --yes)
pnpm venue              # pull --include-shared -> preflight -> build:portable -> <talk>-venue.zip
```

From the repo root: `pnpm videos:check-all`, `pnpm new-talk <YYYY_MM_DD_Name>`.
`slidev-videos discover <keywords>` (any dir) searches open archives for clips.
NVENC: the env ffmpeg has it, the bare `~/.local/bin/ffmpeg` does not —
prefix `PATH=~/micromamba/envs/outreach_talks/bin:$PATH` for GPU encodes.

## Videos (slidev-videos)

- **Library clips** come from the package registry `src/slidev_videos/shared.toml`
  (43 clips) on release `MindaugasSarpis/slidev-videos@videos-shared`. Decks
  reference them by name; manifests never list them. Promote a clip there
  (encode in the package repo, publish, bump the tag) when a second deck
  needs it; keep venue clips and chart renders talk-owned.
  Library clips are full length (since 2026-09-09); a deck that wants a
  shorter cut lists the clip in its own manifest with `trim = ["m:ss", "m:ss"]`
  and encodes/publishes to its own release, which wins the chain.
- **Player**: `<VideoPlayer src="name.mp4" [muted] [loop] [:controls="false"] [:autoplay="false"] [:volume="0.7"] />`.
  Chain: own release -> shared release -> local `public/videos/` (dev mode
  local-first). Config in headmatter `videos: {repo, release, fit}`;
  old decks use `fit: contain`, WoP `fit: cover`. Keys: `p`, `+`, `-`.
  Slidev's overview grid and next-slide preview render a placeholder, not a
  `<video>`.
- **Policy** (since 2026-07-18): web tier only, ≤1920 H.264 ≤10 Mbps,
  AAC, -16 LUFS; `videos:preflight` enforces it. No HQ tier.
- **Renames** (2026-09-08 migration): see the package README's rename table.
- **Sliding attach window (v0.3.3).** A player carries its `<source>` only
  while its slide is live, one of the next three (look-ahead: attached early
  with `preload="auto"` so the clip buffers while the current slide is up, in
  dev AND production) or the one just passed; everything else is detached and
  `load()`ed empty. Chrome caps the media elements loaded per page (~10 on
  desktop) and past the cap a `load()` silently never completes — with every
  visited clip left attached, WoP froze from its 9th clip on, web and offline
  alike (2026-09-09). Earlier, production relied on `<link rel="preload"
  as="video">`, which Chrome rejects, so clips started cold (2026-09-07).
  Authoring consequence: put a non-video slide (cover) in front of a heavy
  opener so it gets a head start; the first slide itself can never be warmed.
- `videos:check` greps `VideoPlayer src="..."`, so keep that attribute syntax.

## ParticleHero (live hero slides) and QuizCard

```html
<ParticleHero mode="galaxy" kicker="Part I" title="From Saulėtekis|to the edge of|the Universe" corner-br="I / III" />
<ParticleHero mode="proton" sound counter kicker="World of Particles" title="Ačiū"
  sub="Questions?|c, or a click on the proton: one more collision" />
<QuizCard n="1" total="9" q="How fast…?" :options="['A…','B…','C…']" :answer="1" fact="One line shown on reveal." />
```

The CERN-lessons landing hero (live three.js particle scene, Space Grotesk
uppercase title) as a full-bleed slide, in three `mode`s
(`components/particle-hero/core.js`): `proton` (the probed sphere: beam
pulses along the fibers, eruptions inside — the landing), `galaxy` (a
spinning spiral disc), `collider` (a ring; two bunches cross at the top and
bottom interaction points twice a lap and erupt there). While the slide is
active: pointer stirs the field, a click shoves it and fires a collision,
`c` fires one now. `counter` shows a running tally; `sound` plays a
synthesised crack + thump (`particle-hero/sound.js`) for the presenter-
triggered collisions only. `'|'` breaks lines. Full-bleed like VideoPlayer —
no h1 on the slide. The scene runs only on the active slide and only in the
live `slide`/`presenter` render contexts (the overview grid gets the static
gradient card); without WebGL2 float render targets or under reduced
motion the static card is what you get.

`QuizCard` is the audience quiz in the same visual language: one question,
three tiles. Keys while active: `1`–`3` point at a tile, `Enter` or a click
reveals (correct tile lights, others dim, fact fades in, a 2D-canvas
burst), `r` resets. None of these clash with Slidev's navigation keys.

WoP uses them as act cards (galaxy / proton / collider), an interactive
finale (proton, sound, counter) and nine backup quiz slides after it.
Verify visually with headless Chromium (`--use-gl=angle --use-angle=swiftshader
--enable-unsafe-swiftshader` renders WebGL2 with float targets) — see the
shot script pattern in the 2026-09-08 migration plan.

## Hadron space (Startertalk)

`talks/2026_09_00_Startertalk/` is told inside one persistent 3D scene: a
path of eight built scenes (stations) in the WoP landing's ambient particle
field, a uniform bright ground pulled only faintly toward the active station
(a station may set `gather`, and `pulse: <s>` shoves the dust outward that
often). Stations: `hero` (the cover and the close: a large living c c̄ u u d
cluster, quarks on their own tilted orbits — `cluster` with `orbit`, `core`,
`quarkScale` — the dust swirling into it, the camera swaying ±9°; `wide`
resolves here), `paper` (page 1 of Zweig's CERN-TH-401 as a lit sheet, five quark spheres
drifting together), `theta` (a ghost cluster — five faint quarks that breathe
apart and never hold — standing for Θ⁺(1540)), `decay` (Λb⁰ →
J/ψ p K⁻ as tubes with a pulse), `states` (the eight pentaquarks as spheres
on a local mass axis with threshold planes; the nine record-and-plot stops),
`interiors` (a Σc D̄ molecule and a compact five-quark ball at one 1 fm
scale), `neutrals` (Λb⁰ → Σc⁺ D̄*⁰ K⁻ with the π⁰/γ tracks dashed, and a
six-quark cluster), `future` (an empty grid). Design:
`docs/superpowers/specs/2026-09-09-startertalk-dioramas-design.md`; the
earlier spec (`…-hadron-space-design.md`) still governs HUD, stops, scrim.

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
  GitHub Pages base and left the sheet a blank white square, 2026-09-10).
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
  (`hadron-space/sound.js`, Web Audio, no assets): a low swell during the
  fly-in and a deep thump as the last quark lands; the browser keeps audio
  suspended until the first key press or pointer down, so the assembly on
  first load is silent and every later one sounds (`sound` prop, default
  on).
- Frame rule from the renders: an object appears to the RIGHT of the frame
  centre when its x is larger than the pose target's x; the ambient field
  wraps in a ±30 box around the camera, so stations can sit anywhere.
- `components/HaloLayer.vue` (from `global-top.vue`) dusts every `.card`,
  `.halo` and `.space-panel` with fine sub-pixel grains (count by perimeter,
  grains inside a neighbouring box dropped) — the same grain as the field.
- `components/ArgandDiagram.vue` — the theory slide's live Breit–Wigner:
  lineshape, phase and Argand circle linked by one sweeping marker (9 s a
  pass, only while the slide is live; static under reduced motion), six
  hollow markers for the 2015 free amplitudes. `LineshapeGallery.vue` — six
  computed lineshapes (Breit–Wigner, Flatté, cusp, triangle, interference at
  three phases, the Λ(1520) reflection with real Λb⁰ → J/ψ p K⁻ kinematics)
  with an Argand inset marking the phase at the peak.
- `components/HadronSpace.vue` — mounted once from the deck's
  `global-bottom.vue`; fetches `hadrons.json` and `space.json`; reads each
  slide's `space:` frontmatter and `clicks`; HUD (record left, paper plot
  right with its `see` line) after the camera lands; sets
  `html[data-space-stop]` while a stop is active; scrim between world and
  slide with opacity `dim`.
- Slide frontmatter: `space: { at: states, dist: 8, yaw: -22, pitch: 6, stops: [Pc(4312), Pc(4440)] }`
  with `clicks: 2` (= stops.length). A slide without `space` keeps the previous pose.
  Optional keys: `asof: 2015` renders each stop's record as of that year
  (a state whose `status_year` is later shows `status_before`; a `note` whose
  `note_year` is later is dropped). `dim: 0..1` sets the scrim; without it
  0 while a stop is active, 0.15 on cover/section/statement/fact/quote
  layouts, 0.6 on content slides; slides whose picture is the world itself
  use 0.2–0.35.
- Records (`scripts/hadrons.py` → `public/data/hadrons.json`, ten states:
  eight pentaquarks, Θ⁺(1540), the 1964 landmark; `OVERRIDES` carries
  `mass_text`, `width_text`, `significance`, `channel`, `date_text`,
  `label_html`, `status_year`/`status_before`, `note_year`; dates and masses
  of LHC states from Koppenburg's list, run `--check`, `--cached` offline).
  Stop figures (`FIGURES`): `src` (cropped paper PNG from
  `scripts/fetch_figures.sh` + `crop_figures.py`), `caption` (journal-style
  source) and `see` (one sentence naming the feature in the plot that is the
  state, written against the cropped image). Zweig's page:
  `scripts/fetch_zweig.sh` (CDS record 352337; download in a browser, CDS
  blocks scripts) → `public/figures/papers/zweig_th401_p1(_top).png`.
- Deck CSS (`styles/index.css`): Space Grotesk throughout, h1 42 px, card
  and caption text 20 px, tables 19 px (15 px on `class: backup` slides; the
  five-column comparison `table.cmp` and the `wide-table` backup wrap their cells),
  one `.src` footer line per slide; `.row` + `.col-40…60` place a figure on
  one side and ≤ 60ch of text on the other, `.stage` caps content height;
  `.quote-hero` (the 1964 slide; `.wide` for the 1992 quote), `.quote-line`
  (the 2006 quote), `.decay-caption` and `.world-caption` (slides whose
  picture is the world), `.plate` (a diagram on a card-like ground),
  `.checklist` (the "not every bump" slide, 18 px), `.refs` (the two
  references backups: three columns of one-line entries, each a link: APS by
  DOI, arXiv ids to arXiv, the rest an INSPIRE journal lookup), `.ol` and
  `.ol.cap` (a drawn bar for p̄ and Λ̄: Space Grotesk sets the combining macron
  beside a p; the HUD formatter emits `.ol` for p̄). Slides are
  transparent, cards translucent. No WebGL2 float targets → static gradient;
  overview/PDF have no world.
- Koppenburg's list is credited on the references backup and in the notes,
  not on the cover or the close (owner's call, 2026-09-10).
- Overhaul record (2026-09-09/10): critiques, blueprint, research brief and
  decisions in `docs/superpowers/plans/2026-09-09-startertalk-*.md`.
- Verify with headless Chromium (SwiftShader) screenshots
  (`~/slidev-videos/.tmp/st-all.mjs <dist> <out> <n>` with `CLICKS` JSON);
  it renders slowly, so the script waits ~9 s after a click before shooting
  a stop.

## Slidev gotchas

- Use `routerMode: hash` in frontmatter when deploying to GH Pages so deep links (`/#/3`) survive a refresh.
- Git conflict markers inside fenced code blocks crash Slidev's snippet plugin (`ENOENT` on `<<<<<<< HEAD`). Wrap in `{{'<<<<<<< HEAD'}}` inside a ```` ```text {*}{lines:false} ```` block.

## Slide authoring conventions (inherited theme)

- Frontmatter: `theme: ../../theme`, `colorSchema: dark`, `transition: fade`, optional `background: /figures/…`.
- Custom layouts: `cover`, `section`, `quote`, `fact`, `statement`, `intro`, `center-bkg`.
- Structure: cover → quote → motivation → section breaks (`layout: section` + `hideInToc: true`).
- Card system: `<div class="card card-primary pad-tight">…</div>`. Colors: `primary|secondary|accent|info|success|warning`. Padding: `pad-tight|compact|snug|balanced`.
- Grids: `grid-2`, `grid-3` (theme classes — built-in gap; do **not** add `class="grid ..."` or `gap-md`).
- Emoji format: `## 📊 **Title**` — emoji outside bold.

## Aspect ratio and canvas

The scienced theme's typography (`text-4xl` h1, `text-3xl` h2, etc.) is
calibrated against Slidev's default `canvasWidth = 980`. Slidev
transform-scales the slide to fit the viewport, so the deck visually
fills any venue at any resolution — `canvasWidth` only affects the
unscaled grid the theme is calibrated for, raster-asset alignment,
and PDF export pixel resolution.

**Rule of thumb: don't set `canvasWidth` in deck frontmatter.** Leave
it at Slidev's default 980. Then theme proportions match the CERN
lessons reference exactly.

Per-venue knobs (in deck frontmatter):
- `aspectRatio` — `9/5` for the editAI LED wall, `16/9` for projectors.

Video resolution is not a per-venue knob any more: every clip is a
1080p-class H.264 web encode (policy since 2026-07-18) and Slidev scales
the slide, so `long_edge_px` stays at the root `videos.toml` default.

Reference setups:
- `2026_04_28_editAI` — 2.5 × 4.5 m LED wall, 2880×1600, **9:5**. `aspectRatio: 9/5`.
- `2026_05_11_Sceptics` — 4K projector, 3840×2160, **16:9**. `aspectRatio: 16/9`.
- `2026_09_10_WorldOfParticles` — 16:9 projector; video-only reel, `fit: cover`.

With `fit: contain` (the old decks) mismatched clips letterbox inside
the slide — expected; `fit: cover` (WoP) fills the frame and crops. The
`VideoPlayer` itself is `position: absolute; inset: 0` (full-bleed),
so video slides should not also have an h1 — the video covers it. Add
descriptive copy on the preceding/following slide instead.

## Embedded iframe slides

A naive `<iframe class="absolute inset-0 w-full h-full" />` renders the
embedded site at the slide's canvas size (~980×552 with default
`canvasWidth`). Slidev then transform-scales the slide ~4× to hit a 4K
screen, so the embedded UI ends up oversized and pixelated.

Trick: oversize the iframe DOM by 2× and `transform: scale(0.5)` it
back. The embedded site sees a ~1960×1104 viewport (UI sizes itself
properly), and the outer Slidev scale lands at native 4K crisp:

```html
<div class="absolute inset-0 overflow-hidden bg-black">
  <iframe
    src="..."
    class="absolute top-0 left-0 border-0"
    style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: top left;"
    allow="fullscreen"
    scrolling="no"
  ></iframe>
</div>
```

Bump to `300%` / `scale(0.333)` for higher-DPI sites; `400%` / `scale(0.25)`
shrinks UI dramatically (good only for sites where the UI is incidental).

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` and deploys to GH Pages. A simple index at the site
root links to each talk. Enable under repo Settings → Pages → Source:
"GitHub Actions".

## Git remotes

This clone's GitHub remote is `origin`; some clones name it `github`.
Check `git remote -v`.
