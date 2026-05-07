# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project overview

Monorepo of CERN outreach talks delivered as **Slidev** decks. Shared
theme, components, and video pipeline live at the repo root; each talk
is a pnpm workspace under `talks/<name>/`.

Current talks:

- `talks/2026_04_28_editAI/` — EditAI Seminar crash course, 2026-04-28.
  Audience: later-grade students, teachers, school principals.

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
├── components/                   # shared Vue components (VideoPlayer)
├── scripts/videos.py             # video pipeline (sync/encode/publish/check)
└── talks/<name>/
    ├── deck.md                   # Slidev entry — theme: ../../theme
    ├── .env                      # VITE_VIDEO_REPO / VITE_VIDEO_RELEASE
    ├── package.json              # slidev + per-talk scripts
    ├── components/ -> ../../components   (symlink; required for auto-import)
    ├── slides/                   # per-section markdown (optional)
    ├── public/                   # static assets (figures, encoded videos)
    │   ├── figures/              # images, gifs
    │   ├── videos/               # encoded web copies (gitignored)
    │   └── videos-hq/            # symlink to videos/hq/ (gitignored)
    └── videos/
        ├── manifest.toml         # per-talk + per-video overrides
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

## Commands

Run from inside a talk directory:

```bash
pnpm dev                # live dev server (http://localhost:3030)
pnpm build              # static bundle in dist/ (absolute base, for GH Pages)
pnpm build:portable     # portable bundle in dist-portable/ (relative base, offline-safe)
pnpm export             # PDF export (requires playwright-chromium; install locally if needed)

pnpm videos:sync        # rclone raws from [defaults].source_remote
pnpm videos:encode      # ffmpeg raw -> public/videos/ (web tier, idempotent)
pnpm videos:encode-hq   # ffmpeg raw -> videos/hq/ (visually-lossless venue masters)
pnpm videos:publish     # upload encoded web files to the web GH Release
pnpm videos:publish-hq  # upload HQ files to the parallel HQ GH Release
pnpm videos:pull        # download web files from the release -> public/videos/
pnpm videos:pull-hq     # download HQ masters from the parallel release -> videos/hq/
pnpm videos:check       # manifest vs raw/web/slide consistency
```

`publish` / `publish-hq` and `pull` / `pull-hq` are manifest-driven and
idempotent: unchanged remote/local files (size match) are skipped. Both
directions accept `--prune` to delete counterparts absent from the
manifest — `publish --prune` removes orphan release assets, `pull --prune`
removes orphan local files. Fresh-machine rehearsal flow is
`pnpm install && pnpm videos:pull-hq` (skips the multi-hour HQ encode).

**Oversize files (`hq_from_raw = true`)**: GH Release assets cap at 2 GB
per file. For masters whose raw is already a pixel-perfect venue target
and whose encoded HQ would exceed the cap (e.g., 2880×1600@60 HEVC
sources), set `hq_from_raw = true` on the `[[videos]]` entry. The HQ
tier then hard-links the raw (zero extra disk), `publish-hq` skips the
file, and `pull-hq` rclones it from `[defaults].source_remote` instead
of the release. Quality = raw bits, no re-encode.

From repo root:

```bash
pnpm videos:check-all   # run videos:check in every talk
```

## VideoPlayer

```html
<VideoPlayer src="Clip.mp4" />                   <!-- HQ if present, else web (default) -->
<VideoPlayer src="Clip.mp4" :hq="false" />       <!-- force web tier -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

`hq` defaults to `true`. Chain is `public/videos-hq/<src>` →
`public/videos/<src>` → web GH Release. Local dev with `videos/hq/` populated
gets venue masters automatically; deployed builds (no HQ files) transparently
fall back to the web tier. The release URL is built from `VITE_VIDEO_REPO` and
`VITE_VIDEO_RELEASE` (set in the talk's `.env`).

HQ masters are uploaded to a parallel GH Release (`videos-hq-<talk>`) by
`pnpm videos:publish-hq`. On a fresh machine, pull them with
`gh release download videos-hq-<talk> -D videos/hq/` instead of re-running
`encode-hq`. VideoPlayer does not fetch HQ from the release automatically —
HQ is only served from the local `public/videos-hq/` symlink.

`videos:check` greps `VideoPlayer src="..."` against the manifest, so
keep that attribute syntax.

## Encoding profiles (`scripts/videos.py`)

- `remux` — `-c copy` + faststart. Use when source is already web-friendly HEVC/H.264 ≤~5 Mbps. Ignores resolution cap.
- `standard` — HEVC CRF 24, AAC 128k.
- `standard-tight` — HEVC CRF 27 for long clips that blow the size budget.
- `silent-loop` — HEVC CRF 26, audio stripped.
- `high-motion` — HEVC CRF 22, AAC 192k. Sims, fast action, CGI.

`{LONG_EDGE}` in profiles is resolved at encode time from the merged
`long_edge_px`. Override per-video with `long_edge_px = 2880` on a
`[[videos]]` entry for venue-screen clips.

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
  LED wall, 3840 for 4K) so videos encode at native resolution.

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

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` and deploys to GH Pages. A simple index at the site
root links to each talk. Enable under repo Settings → Pages → Source:
"GitHub Actions".

## Git remotes

GitHub remote is named `github` (not `origin`). Push with
`git push github <branch>`.
