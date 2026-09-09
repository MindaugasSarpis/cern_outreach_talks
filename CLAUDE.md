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

`talks/2026_09_00_Startertalk/` is told inside one persistent 3D scene:
every hadron discovered at the LHC (Koppenburg's list, CC BY 4.0) plus a
few pre-LHC landmarks, laid out as date (x) × mass (y) × quark-family
lane (z), in the WoP landing's ambient particle field.

- `components/hadron-space/space.js` — the three.js scene; `createSpace(canvas, container, { data, onArrive })`
  → `setPose({ at, dist, yaw, pitch })`, `setStop(id)`, `setPaused`, `dispose`. Named
  poses `wide` / `origin` / `future`; `at` may be a state id or `[x, y, z]`.
  Flights are timed ease-in-out (1.4–2.8 s by distance); parked, the camera drifts.
- `components/HadronSpace.vue` — mounted once from the deck's `global-bottom.vue`;
  reads each slide's `space:` frontmatter and `clicks`; shows the stop HUD (record
  left, paper figure right) after the camera lands; sets `html[data-space-stop]`
  while a stop is active so deck CSS fades the slide's cards.
- `components/HaloLayer.vue` — from `global-top.vue`; one 2D canvas that draws the
  hazy particle border around every `.card` on the live slide and every `.space-panel`.
- `components/SpacePanel.vue` — translucent panel for HUD text / figures.
- Data: `scripts/hadrons.py` → `public/data/hadrons.json` (run `--check`; `--cached`
  for offline). Stop figures: `scripts/fetch_figures.sh` → `public/figures/papers/`.
- Slide frontmatter: `space: { at: Pc(4312), dist: 8, yaw: -22, pitch: 6, stops: [Pc(4312), Pc(4440)] }`
  with `clicks: 2` (= stops.length). A slide without `space` keeps the previous pose.
- Deck CSS (`styles/index.css`) makes slides transparent and cards translucent.
  No WebGL2 float targets → static gradient; overview/PDF have no world.
- Verify with headless Chromium (SwiftShader) screenshots; it renders slowly, so
  wait ~9 s after a click before shooting a stop.

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
