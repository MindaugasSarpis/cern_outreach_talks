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
- `talks/2026_10_00_OpenData/` — "Opening LHCb's data", a 6½-minute award talk
  (LHCb Vilnius nominated for an open data award). On the packaged stage, pinned
  to slidev-videos `efacca2` (feat/broadcast), plus two talk-owned builders. Date placeholder `10_00`. See
  "Open data talk" below.
- `talks/2026_10_26_UzsikraukKarjerai/` — „Vadovėlio gale atsakymo nėra“, an
  ~10-minute Lithuanian talk for grades 9–12 at „Užsikrauk karjerai“ (Delfi ×
  Lietuvos Junior Achievement), filmed in the Delfi studio on 26 Oct 2026
  with no audience, streamed to classrooms on 27 Oct 2026 12:00. Built for
  television on the packaged stage (same `640eaa5` pin), its own violet-gold
  palette and six talk-owned builders. See "Užsikrauk karjerai" below.

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
- `components/ArgandDiagram.vue` — the theory slide's live Breit–Wigner:
  lineshape, phase and Argand circle linked by one sweeping marker (9 s a
  pass, only while the slide is live; static under reduced motion), six
  hollow markers for the 2015 free amplitudes. `LineshapeGallery.vue` — six
  computed lineshapes (props: `only` picks panels, `detail` lays two out large with a full explanation, the three “What a peak can be” slides; the interference labels and the cusp's pole distance were corrected 2026-09-11) (Breit–Wigner, Flatté, cusp, triangle, interference at
  three phases, the Λ(1520) reflection with real Λb⁰ → J/ψ p K⁻ kinematics)
  with an Argand inset marking the phase at the peak.
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

## The stage (Innoday, and talks after it)

Startertalk's world is packaged as **`slidev-addon-stage`**
(`~/slidev-videos/packages/stage`, README there is the reference): the same
engine with its colours, object types, poses and numbers made the deck's to
set. Startertalk itself still runs on `components/HadronSpace.vue` and
`components/hadron-space/`; it has not been moved onto the package (that
wants a before/after screenshot comparison of all its slides). New talks use
the package.

- **Headmatter only.** `addons: [slidev-addon-videos, slidev-addon-stage]`
  and a `stage:` block (`space`, `palette`, `plugins`, `sound`, `options`).
  The addon mounts the world and the halo layer itself: no `global-top.vue` /
  `global-bottom.vue` in the talk. The addon's components are `Stage`,
  `StagePanel`, `StageHalo`, `StageHero`, so they do not clash with the
  symlinked `components/` (`HadronSpace`, `SpacePanel`, `HaloLayer`,
  `ParticleHero`).
- **Palette.** `blue` for Innoday: ultramarine dust, `#5b93ff` accent, a
  nebula behind the dust. `videos.dust` is set to the same accent so the
  clips' grains match the world's. CSS reads `--stage-*`.
- **Slides** steer the camera exactly as in Startertalk (`space: { at, dist,
  yaw, pitch, dim }`). The addon's CSS kit supplies the type: cover as kicker
  / title / subtitle / byline (`# Innoday`, `# Title`, `## …`, `.mt-md`),
  section as a kicker and a large line low on the left (`# Part I` and a
  paragraph), cards, `.src`, `.world-caption`. A talk's own
  `styles/index.css` overrides it.
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
- **Clips** arrive and leave as particles (`videos.transition: dust`). The
  grains take their colours from `public/video-frames/` — `pnpm
  videos:frames`, committed with the deck (5 strips, 1.3 MB for Innoday);
  without a strip a clip fades. A clip gathers on a plane standing off in
  the world and flies to the frame; leaving, it breaks up past the camera and
  leaves its colours in the dust for a few seconds. A clip that opens on
  black arrives as its first lit frame and plays from there
  (`videos.dustFrom: start` keeps the opening). Give a video slide a `space:` pose too: the
  world rests under a covering clip, and when the clip breaks into dust the
  camera is already flying to that pose.
- **Check and look.** `pnpm stage:check`; `pnpm build --base / && pnpm
  stage:shots` photographs every slide into `shots/` (needs
  `playwright-chromium` in the workspace).
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
- **ffmpeg here.** `~/.local/bin/ffmpeg` and `ffprobe` (static build) crash on
  HTTPS input (exit 139). `videos:frames` works round it by downloading;
  `videos:preflight` of release-only clips needs the env's ffmpeg
  (`PATH=~/micromamba/envs/outreach_talks/bin:$PATH`).
- Both addons and the CLI are pinned to slidev-videos `v0.4.0`: the talk's
  `package.json`, `scripts/new_talk.py` (`ADDONS_REF`) and env.yaml's pip
  entry move together on a release. The `frames` subcommand is new in 0.4.0;
  an env made before it needs `pip install -U` of that entry. The older talks
  stay on `#v0.3.3`: they use `cut`, which 0.4.0 does not change.

## Open data talk (2026_10_00_OpenData)

One world; one sphere is one terabyte. The hero is the engine's `collider`
(cover, the collisions slide, the close); the `store` station holds the
talk's own forms; `thesis` is a gold five-node `constellation` (the
pentaquark of Dominykas Stonkus's BSc project), at [12, -40, 24]: out of
every other pose's frame (at y = -30 its scattered nodes still showed as
specks on the exabyte slide in most loads) and never the nearest station for
the far-back scale poses.

- **Talk-owned builders** (`setup/grains.js`, registered from `setup/main.ts`;
  `stage:check` runs with `--types lineup,streams`):
  - `lineup` `{ name, pos, balls: [{ n, color, label }], unit, anchor, gaps, grow, reach, glow, labelH }`:
    piles of one and the same sphere side by side along x (1, 800, 4 000
    gold = open; 100 000 blue = LHCb since 2010; 1 000 000 steel = the LHC's
    exabyte), each pile the first n points of a face-centred cubic
    lattice taken shell by shell, so the first n always make a ball. Piles keep
    their size: the slides pull the camera back (dist 0.75 → 37.5 → 73.5, then in to 8.7 for Run 1)
    and what came before is seen shrinking into the new scale (the owner's ask,
    2026-10-07: a single ball per step "looked the same after zooming out").
    Every sphere is metal in one studio light (the `METAL` GLSL chunk:
    reflections of a drawn studio, Schlick Fresnel, contact shadow inside a
    pile); a pile seen from afar is shaded as one satin ball (`HEAP`: a heap
    of small polished balls has no single mirror highlight) (owner,
    2026-10-08: "washed out … photorealistic"). A standing pile draws only
    its skin: spheres more than 6 units inside it or facing away are culled
    in the vertex shader. The impostor's frame is built round the ray to the
    sphere, and the lattice is turned once (Euler 0.37, 0.61, 0.23) so no
    row points at a camera. A ball of one is a
    sphere mesh in that metal; piles are sphere impostors (a point
    sprite shaded as a ball, writing its own depth via gl_FragDepth, sized
    from the projection and the current viewport, clamped to the GPU's
    ALIASED_POINT_SIZE_RANGE), jittered more as piles grow so rows do not beat
    against the pixel grid. A step k shows balls 0..k, a step [i, j, …]
    exactly those (`scale: [0, 3]`); `${name}:labels` (0/1) shows constant-screen-size labels
    (`sizeAttenuation: false`), the single sphere's above it.
  - `streams` `{ name, pos, from, to: [{ pos, lift, node }], grains, node, nodeRadius, speed }`:
    grains along quadratic arcs, an end cluster that gathers when its stream
    starts (`node: false` where a form of its own stands, e.g. the pentaquark);
    a stopped stream fades out over 1.2 s.
  - Slides drive them with `<Grains :set="{ scale: 3, 'scale:labels': 1, world: 8 }" />`
    (fires on slide enter; the last step per name is kept for forms built
    later) and count with `<Count name :from :to />`. Arrival at `store` (and
    `c`) regathers the piles; `onDone` is always called, on the engine clock.
- Story (owner, 2026-10-08): what LHCb is (cavern photograph), how much data
  it takes (40 MHz; 1 TB; LHCb's 100 PB), what it finds (76 of 86 new LHC
  hadrons; the 2019 pentaquark spectrum, white on transparent), the LHC's
  exabyte ("one of the largest datasets in science"; CERN claims "the largest
  scientific data archive" in HEP), then open (800 TB, 4 PB) and its uses.
- Photographs, not renders, for what is real: slide 3 the detector in its
  cavern (`lhcb_detector_2024.jpg`, © CERN · M. Brice), slide 4 a Run 3
  event display (`lhcb_event_run3.jpg`, © CERN / LHCb); the credit stays on
  the slide (CERN's terms).
- The deck sets `stage.palette.bg: '#000206'` (the engine feeds bg to the
  ground as raw linear colour, so the blue palette's navy lifted every black
  to ~rgb(10,16,33): the "washed out" look) and `stage.options`: `reach: 20`
  (the exabyte pose targets x = 5.59, 14.4 from the store station, and must
  still count as *at* it), `nebula 0.12, dustGain 1.0, exposure 1.1,
  vignette 0.7, grain 0.012, aberration 0, bloom 0.42`.
- The finds slide (76 of 86, the 2019 fit) is opaque (`.finds` paints the
  bg): the scrim is a gradient, so even `dim: 1` left the 100 PB pile
  glowing through the transparent plot. Space Grotesk has no "≠": write it
  in words.
- **Figures** (owner, 2026-10-08): "55 PB open" was dropped (the group's LMT
  applications use ~55 PB for LHCb's *total* data); the open pile is the
  public "over 4 PB" of Run 1 + Run 2 through the Ntupling Service (LHCb
  outreach, 3 Mar 2026). The 600 PB pile is labelled HL-LHC on the owner's
  word; it was dropped in the 2026-10-08 rework (the public "600 PB" is
  CERN's Run 3 figure for all experiments). A number lives in the `lineup`
  balls in `public/data/space.json`, the slide's `<Count :to>`, and the pose maths.
- **Kick-off clip** (slide 2, after the cover so it buffers): `lhcb.mp4`, the
  LHCb detector in 3D with music, as this talk's own 39 s cut of the library
  clip (`trim = ["0:08", "0:47.1"]` in `videos/manifest.toml`, raw gdrive
  `released/lhcb.mp4`, on release `videos-2026-10-00-opendata`, which wins the
  chain by name). The library copy opens on 8 s of dark tunnel (mean
  brightness under the player's `DARK`, 0.07) and ends on black, so the
  default `dustFrom: lit` gathers the grains into a black frame and a clip
  left after its end breaks up as black. The cut opens on the shafts above
  the cavern (white CG on black, drawn by the grains with `videos.dustFrom:
  start`) and ends at 47.1 s, as the music fades and before the picture does.
  After re-encoding: `pnpm videos:frames` (commit `public/video-frames/`),
  `videos:publish`, `videos:preflight`.
- Slides carry main points only (owner, 2026-10-08: "people will not read it,
  I will just say it"); what they leave out is in the notes under "Say:".
  No `.src` footers on the slides either ("don't need the sources"): each
  slide's sources are a "Sources:" line in its notes.
- `vite.config.ts` excludes `slidev-addon-stage` and `three` from
  pre-bundling, else `slidev dev` has two builder registries (the world never
  sees `lineup`/`streams`) and two copies of three.
- Streams on the store station: `world` (8 anonymous users, on the 4 PB
  slide), `vilnius` (3: the Z → μμ analysis, the course, the masterclass) and
  `dominykas` (1, ends at the `thesis` pentaquark, alone on the climax slide);
  the Dominykas slide is the last content slide, the close follows.
- Verify with the shots tool from feat/shots-v2 (`bin/shots.mjs dist <out>
  --sheet --size 1600x900`): it settles each slide on the engine clock and
  takes the shared render lock itself.

## Užsikrauk karjerai (2026_10_26_UzsikraukKarjerai)

Third version, 19 slides, about 10 minutes, one chronological thread (the
owner rejected a 31-slide committee-written first version and a second whose
flow jumped between questions and whose world looked washed out). The
talk's own `CLAUDE.md` holds the brief, story table, status and decisions.
Pinned to slidev-videos `feat/broadcast` (efacca2) for `look: broadcast`,
`slidev-stage-safe` and `slidev-stage-record`. Real photographs and footage
carry the real things (LHC tunnel, LHCb cavern, Gell-Mann and Zweig, the
LHCb plots, NGC 1300), credited on screen and in `credits.txt`. Earlier
outline, kept for the world's mechanics:
I. the question nobody can answer yet (why matter survived: one in a
billion), then where it is asked (the LHC, LHCb); II. what working on such a
question looks like: one particle followed from idea (1964) to false find
(2003), retraction (2008) and discovery (2015), then the speaker's own
search for three of them, which ended in „Neradau.“, why that still counts,
and the open data; III. what it has to do with the viewer: his crooked
route across Europe, his own 2022 plans slide, back to the open question
(galaxy), and one task for the week. Slide text is only numbers, years, a
URL, his word „Neradau.“ and the closing question: no slogan cards. The
full spoken script, timings, public sources and [PATIKSLINTI] items are in
the notes.

- **Television rules** (research 2026-10-07; from the event's past
  recordings and broadcast standards): Delfi/LJA showed slides squeezed to about two-thirds
  of the frame in past editions and stream at ~2.5 Mbps, watched on classroom
  projectors. So `styles/index.css` sets readable text ≥ 49 px on the 980
  canvas (96 px at 1080p), big lines 58–80 px, numbers 130 px, all inside
  x 98–882 / y 55–408 and out of the logo/name-super corners; the headmatter
  turns off film grain, aberration, halos and sound and sets fewer, bigger
  dust grains, a low nebula and slower flights (`options: { grain: 0,
  aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom:
  0.45, flight: [2.5, 5] }`); the grains' twinkle is slow and shallow. Laptop
  output 1920×1080 at 50 Hz. No full-frame flashes (ITU-R BT.1702).
- **Stations** (one axis, 300 apart, so only one is ever in frame): `origin`
  (hero; `pairs`), `quarks` (`quintet`), `search` (`ghost` with a haystack,
  `streams` `dance` and `phantom`), `europe` (`map`, `path` `route`: Vilnius →
  CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius; pose
  `whole`, no sway, with HTML city labels projected from it).
  `stage.options.reach: 22`. The clips and photos cover the world on their
  slides; the collider ring and the grain galaxy are gone.
- **Talk-owned builders** (`setup/grains.js`, `stage:check --types
  path,streams,pairs,ghost,map,quintet`), all driven by `<Grains :set>`:
  - `pairs` — matter (gold) and antimatter (blue): 1 the hot cloud forms, 2 the
    pairs meet and go out as light (outer first; brightness only falls), 3 the
    remainder gathers into a knot. Forward one step plays it, anything else
    shows the step settled; an arrival from elsewhere (or `c`) replays up to
    the current step unless a step started under 5 s ago.
  - `quintet` — five clusters joined by flowing strings; per-step `{ hold,
    light }`: idea (scattered), claim (half-held, dim), retraction (scattered),
    discovery (held, bright).
  - `ghost` — faint clusters that come together and drift apart, never
    holding; `hay` adds a wide faint cloud round it; with a `name`, step 0
    hides the clusters and step 1 lets them appear (the single „Neradau.“).
  - `path` — a Catmull-Rom trail through ≤ 16 waypoints, drawn on to waypoint
    k, each leg arcing off the ground (`arc`); a waypoint at the same place as
    an earlier one relights that cluster instead of stacking a new one.
  - `map` — Europe's coastline and land borders as grains on the ground plane,
    from Natural Earth 1:50m (`scripts/make_europe.py` → `public/data/
    europe.json`; one unit = one degree of latitude, x scaled by cos 52°).
  - `streams` — OpenData's, with a per-stream `from` (many places to one).
- `setup/Count.vue` prints Lithuanian numbers: a narrow space from five digits
  up, none in years (`:group="false"`), decimal comma.
- `public/figures/planai-2022.jpg` is the speaker's own LPPM 2022 slide (p. 16
  of the public MSarpisIntro.pdf on Indico).
- Shots: `stage:shots --wait 30000` under SwiftShader.

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
