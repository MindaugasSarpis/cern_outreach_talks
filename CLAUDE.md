# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project overview

Monorepo of CERN outreach talks delivered as **Slidev** decks. Shared
theme, components, and video pipeline live at the repo root; each talk
is a pnpm workspace under `talks/<name>/`.

Current talks:

- `talks/2026_04_28_editAI/` — EditAI Seminar crash course, 2026-04-28.
  Audience: later-grade students, teachers, school principals.
  2880×1600 LED wall, 9:5. Its GH Release doubles as the shared release.
- `talks/2026_05_11_Sceptics/` — Sceptics Society talk, 2026-05-11.
  4K projector, 16:9.
- `talks/2026_07_18_Yaga/` — Yaga crash course (Lithuanian), 2026-07-18.
  4K 16:9 venue. Cloned from editAI; deck under construction.

## Environment setup (fresh machine)

```bash
conda env create -f env.yaml
conda activate outreach_talks
pnpm install                      # installs all talks' deps into node_modules
cd talks/2026_04_28_editAI
pnpm dev                          # opens http://localhost:3030
```

The conda env bundles everything: `nodejs`, `pnpm`, `python>=3.11`,
`ffmpeg`, `rclone`, `gh`.

## Repo layout

```
/
├── outreach.toml                 # global defaults (long_edge_px, max_size_mb)
├── pnpm-workspace.yaml           # workspace: talks/*
├── theme/                        # shared Slidev theme (@slidev/theme-scienced fork)
├── components/                   # shared Vue components (VideoPlayer, ParticleDiagram, …)
├── scripts/videos.py             # video pipeline (sync/encode/publish/check)
├── videos/
│   └── shared.toml               # shared registry: clips inherited by talks at runtime
└── talks/<name>/
    ├── deck.md                   # Slidev entry — theme: ../../theme
    ├── .env                      # VITE_VIDEO_REPO / VITE_VIDEO_RELEASE / VITE_VIDEO_SHARED_RELEASE
    ├── package.json              # slidev + per-talk scripts
    ├── components/ -> ../../components   (symlink; required for auto-import)
    ├── slides/                   # per-section markdown (optional)
    ├── public/                   # static assets (figures, encoded videos)
    │   ├── figures/              # images, gifs
    │   ├── videos/               # encoded web copies (gitignored)
    │   └── videos-hq/            # symlink to videos/hq/ (gitignored)
    └── videos/
        ├── manifest.toml         # talk-OWNED clips only (shared clips live in /videos/shared.toml)
        ├── raw/                  # originals (gitignored, rclone-synced)
        └── hq/                   # visually-lossless venue masters (gitignored)
```

**Theme** is referenced as `theme: ../../theme` in each deck's
frontmatter. Don't use a `theme` symlink — Vite's glob scanner doesn't
traverse symlinked theme dirs and silently drops custom layouts.
**Components** must stay as a symlink: Slidev auto-imports from
`<deck>/components/` and can't be redirected in frontmatter.

## Config layering (video pipeline)

`scripts/videos.py` resolves paths relative to cwd (the talk dir) and
merges `[defaults]` from:

1. `<repo>/outreach.toml` — global (long_edge_px=1920, max_size_mb=200)
2. `talks/<name>/videos/manifest.toml` `[defaults]` — talk overrides
3. Per-video `[[videos]]` fields — most specific

Release tags default to `videos-<talk-dirname-lowercased>` (web tier) and
`videos-hq-<talk-dirname-lowercased>` (HQ tier) unless overridden in talk
`[defaults]` as `release_tag` / `release_tag_hq`.

## Shared video registry (`/videos/shared.toml`)

Widely-reused clips — CERN/LHC footage, generic B-roll, and the
crash-course chart renders + editAI-lineage venue clips reused across
decks — live in a shared GH Release and are **inherited at runtime**
by talks via VideoPlayer's fallback chain. They are NOT downloaded or
re-encoded when working on an individual talk.

- `/videos/shared.toml` lists shared clips (same schema as a talk
  manifest) and declares the shared `release_tag` / `release_tag_hq`.
- The shared release currently reuses `videos-2026-04-28-editai`
  (editAI's own release also serves as the de-facto shared release).
  When a dedicated `videos-shared` release is created, point the tags
  there and republish; both are easy because schemas match.
- A talk references shared clips simply by using the filename in its
  deck. The talk's `manifest.toml` does NOT list them.
- `videos:check` (per-talk) treats deck refs satisfied by shared as OK
  and reports them under "inherited from shared".
- `pnpm videos:shared:check` (run from repo root) sanity-checks the
  shared registry: profile validity, release reachability, and
  cross-talk usage.

**To override a shared clip with a talk-specific encode** (e.g., a
different aspect ratio): list the same filename in the talk's
manifest, encode/publish to the talk's own release. Talk release wins
the fallback chain (it's earlier than shared).

**Inherited clips and offline builds**: at runtime inherited clips
stream from the shared release, so deployed (online) decks need
nothing local. Offline/portable/venue builds DO need local copies —
fetch them with `pnpm videos:pull -- --include-shared` (web tier) and
`pnpm videos:pull-hq -- --include-shared` (HQ masters) before
`pnpm build:portable`. `videos:check` prints an info list of inherited
clips that aren't local yet. Local copies of shared-registry names are
never deleted by `--prune`.

## Commands

Run from inside a talk directory:

```bash
pnpm dev                # live dev server (http://localhost:3030)
pnpm build              # static bundle in dist/ (absolute base, for GH Pages)
pnpm build:portable     # portable bundle in dist-portable/ (relative base, offline-safe)
pnpm export             # PDF export (requires playwright-chromium; install locally if needed)

pnpm videos:sync        # rclone manifest-listed raws from [defaults].source_remote
                        #   (--all mirrors the whole remote folder)
                        #   compares by MD5 so a same-name re-upload is never
                        #   mistaken for "up to date"; --quick reverts to
                        #   rclone's faster size+modtime compare
pnpm videos:encode      # ffmpeg raw -> public/videos/ (web tier, idempotent)
pnpm videos:encode-hq   # ffmpeg raw -> videos/hq/ (visually-lossless venue masters)
pnpm videos:publish     # upload encoded web files to the web GH Release
pnpm videos:publish-hq  # upload HQ files to the parallel HQ GH Release
pnpm videos:pull        # download web files from the release -> public/videos/
pnpm videos:pull-hq     # download HQ masters from the parallel release -> videos/hq/
                        #   (both pulls: --include-shared also fetches the deck's
                        #    inherited shared clips, for offline/portable builds)
pnpm videos:check       # profiles, per-tier missing/orphans, web size budget,
                        # slide-ref consistency; info list of non-local inherited clips
pnpm videos:build       # one-shot: (--sync) -> encode -> encode-hq -> check
```

`publish` / `publish-hq` and `pull` / `pull-hq` are manifest-driven and
idempotent: unchanged remote/local files (size match) are skipped. Both
directions accept `--prune` to delete counterparts absent from the
manifest — `publish --prune` removes orphan release assets, `pull --prune`
removes orphan local files. **When the talk's release tag matches the
shared release tag** (i.e. the talk's release doubles as the shared
host), `--prune` automatically protects shared-registry entries so
they aren't deleted out from under other talks. Fresh-machine
rehearsal flow is `pnpm install && pnpm videos:pull-hq` (skips the
multi-hour HQ encode).

**Oversize files (`hq_from_raw = true`)**: GH Release assets cap at 2 GB
per file. For masters whose raw is already a pixel-perfect venue target
and whose encoded HQ would exceed the cap (e.g., 2880×1600@60 HEVC
sources), set `hq_from_raw = true` on the `[[videos]]` entry. The HQ
tier then hard-links the raw (zero extra disk), `publish-hq` skips the
file, and `pull-hq` rclones it from `[defaults].source_remote` instead
of the release. Quality = raw bits, no re-encode.

From repo root:

```bash
pnpm videos:check-all     # run videos:check in every talk
pnpm videos:shared:check  # sanity-check /videos/shared.toml
pnpm videos:discover -- <kw>…   # search open archives (CDS/NASA/ESO/Hubble/Webb/NOIRLab/Commons)
                                # for new clips; prints report + [[videos]] snippets
```

## VideoPlayer

```html
<VideoPlayer src="Clip.mp4" />                   <!-- HQ if present, else web (default) -->
<VideoPlayer src="Clip.mp4" :hq="false" />       <!-- force web tier -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

`hq` defaults to `true`. Fallback chain (front-to-back):

1. `public/videos-hq/<src>` (skipped when `hq=false`)
2. `public/videos/<src>` (bundled web tier)
3. talk release at `$VITE_VIDEO_REPO/$VITE_VIDEO_RELEASE/<src>`
4. shared release at `$VITE_VIDEO_REPO/$VITE_VIDEO_SHARED_RELEASE/<src>`

Identical talk and shared release tags are deduped, so a talk that
doubles as the shared host (e.g., editAI today) probes only one URL.
Local dev with `videos/hq/` populated gets venue masters; deployed
builds (no HQ files) transparently fall back to the web tier and then
to releases.

HQ masters are uploaded to a parallel GH Release (`videos-hq-<talk>`) by
`pnpm videos:publish-hq`. On a fresh machine, pull them with
`gh release download videos-hq-<talk> -D videos/hq/` instead of re-running
`encode-hq`. VideoPlayer does not fetch HQ from the release automatically —
HQ is only served from the local `public/videos-hq/` symlink.

`videos:check` greps `VideoPlayer src="..."` against the manifest, so
keep that attribute syntax.

## Encoding profiles (`scripts/videos.py`)

**Two codecs by tier, on purpose.** The **web** tier (profiles below) is
**H.264** — it's the fallback that plays in arbitrary *deployed* browsers,
where HEVC doesn't hardware-decode (Firefox: never; Chrome: only where the OS
ships a decoder). Each web profile carries a `-maxrate/-bufsize` ceiling so a
high-motion clip streams instead of stalling. The **HQ** tier
(`hq-visually-lossless`) stays **HEVC** — it's played locally at the venue on
a machine that hardware-decodes HEVC, so the size win is free there.

Profiles are quality *targets*; concrete ffmpeg args are built per selected encoder.

- `remux` — `-c copy` + faststart. Use only when source is ALREADY web-friendly H.264 (or low-bitrate HEVC you accept won't play in Firefox). Ignores resolution cap and encoder.
- `standard` — H.264 web, cq 23 (NVENC) / crf 23 (libx264), ≤6 Mbps, AAC 128k.
- `standard-tight` — cq 27 / crf 26, ≤3.5 Mbps, for long clips that blow the size budget.
- `silent-loop` — cq 25 / crf 24, ≤5 Mbps, audio stripped.
- `high-motion` — cq 20 / crf 22, ≤8 Mbps, AAC 192k. Sims, fast action, CGI.
- `hq-visually-lossless` — HEVC master, cq 18 (NVENC) / crf 16 (libx265), no bitrate ceiling. Used by `encode-hq`; per-video `hq_crf` overrides.

**Encoder:** NVENC (GPU) is the default, auto-detected at runtime via a real
`h264_nvenc` probe, falling back to **CPU** (libx264 web / libx265 masters) when
NVENC is unavailable (CI, non-NVIDIA). Force per clip with `encoder = "nvenc" |
"cpu" | "videotoolbox"` on a `[[videos]]` entry, or talk-wide in `[defaults]`.

`videotoolbox` is Apple Silicon's hardware HEVC encoder for the **HQ tier**. It
is **opt-in only, never auto-selected** — the CPU fallback stays the default so
CI and non-Mac machines behave predictably. Reach for it when a CPU master
can't finish in the time available: on an M2 Pro at 4K, `libx265 -preset slow
-crf 16 -tune grain` measures **0.55 fps** (~2.8 h for a 3-minute clip, ~12 h
for a 4K60 six-minute one), while `hevc_videotoolbox` measures **~50 fps** —
the same master in under two minutes. It is bitrate-driven rather than
CRF-driven, so `hq_crf` does not apply; it targets ~80 Mbps at 4K, scaled
linearly for smaller masters.

**HQ audio is made browser-safe automatically.** The HQ tier is served straight
off disk to VideoPlayer, so its audio must survive Chrome's MP4/MOV demuxer.
`_hq_audio_args` probes the raw and overrides the profile's `-c:a copy` with
AAC 320k when the source carries something Chrome can't decode — notably the
uncompressed **PCM** that editors emit by default for QuickTime masters, which
copies through happily and then plays *silent* on the slide.

`{LONG_EDGE}` in profiles is resolved at encode time. The **web** tier resolves
it from `web_long_edge_px` (global default **1920** — the web copy is never
shown on the venue wall, so 1080p-class H.264 that decodes everywhere is
plenty). The **HQ** tier resolves it from `long_edge_px` (the venue/native
width). Override per-video with `long_edge_px = 3840` on a `[[videos]]` entry
for a venue-screen master; the web copy of that clip is still capped at
`web_long_edge_px`.

**Generated animations:** render frames in parallel → NVENC via
`scripts/render_lib.py` (reference: `talks/2026_05_11_Sceptics/scripts/orbital_animation.py`).
Needs `numpy`/`scipy`/`matplotlib` from `env.yaml` — run `conda env update -f
env.yaml` if a fresh clone is missing them.

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

Per-venue knobs (in `videos/manifest.toml` `[defaults]`):
- `long_edge_px` — venue's pixel width (1920 for 1080p, 2880 for the
  LED wall, 3840 for 4K) so the **HQ venue-master** tier encodes at native
  resolution. The **web** tier ignores this and caps at `web_long_edge_px`
  (default 1920) — the web copy is a browser fallback, not a venue master.

Reference setups:
- `2026_04_28_editAI` — 2.5 × 4.5 m LED wall, 2880×1600, **9:5**. `aspectRatio: 9/5`, `long_edge_px = 2880`.
- `2026_05_11_Sceptics` — 4K projector, 3840×2160, **16:9**. `aspectRatio: 16/9`, `long_edge_px = 3840`.

Videos keep native aspect via `object-fit: contain` in `VideoPlayer`;
mismatched clips letterbox inside the slide — expected. The
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

## Portable/offline bundle

`pnpm build:portable` produces `dist-portable/` with a relative base,
safe to zip and transport (e.g., upload to gdrive as a venue backup).
The bundle includes `public/videos/` and follows the `public/videos-hq`
symlink into `videos/hq/`, so all three VideoPlayer fallback tiers
resolve to local files — no internet required at the venue.

Browsers block ES-module SPAs on `file://`; the recipient serves it
with a trivial static server instead:

```bash
cd dist-portable && python3 -m http.server 8000
open http://localhost:8000
```

Run `pnpm build:portable` **after** HQ encodes finish (otherwise HQ
tier is incomplete). For `hq_from_raw` files, ensure the raw file is
present locally (hard link into `videos/hq/` — already in place after
`pnpm videos:encode-hq`).

**Inherited shared clips are NOT in the bundle by default** — they
resolve from the shared GH Release at runtime, which offline venues
can't reach. Before a portable build, localize them:

```bash
pnpm videos:pull -- --include-shared      # web tier of inherited clips
pnpm videos:pull-hq -- --include-shared   # HQ masters of inherited clips
pnpm build:portable
```

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` and deploys to GH Pages. A simple index at the site
root links to each talk. Enable under repo Settings → Pages → Source:
"GitHub Actions".

## Git remotes

GitHub remote is named `github` (not `origin`). Push with
`git push github <branch>`.
