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
pnpm build              # static bundle in dist/
pnpm export             # PDF export (requires playwright-chromium; install locally if needed)

pnpm videos:sync        # rclone raws from [defaults].source_remote
pnpm videos:encode      # ffmpeg raw -> public/videos/ (web tier, idempotent)
pnpm videos:encode-hq   # ffmpeg raw -> videos/hq/ (visually-lossless venue masters)
pnpm videos:publish     # upload encoded web files to the web GH Release
pnpm videos:publish-hq  # upload HQ files to the parallel HQ GH Release
pnpm videos:check       # manifest vs raw/web/slide consistency
```

From repo root:

```bash
pnpm videos:check-all   # run videos:check in every talk
```

## VideoPlayer

```html
<VideoPlayer src="Clip.mp4" />                   <!-- web copy (default) -->
<VideoPlayer src="Clip.mp4" hq />                <!-- visually-lossless venue master (local only; falls back to web if absent) -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

Loads from `public/videos{,-hq}/` first; the web tier falls back to the
per-talk web GH Release on 404. The release URL is built from `VITE_VIDEO_REPO`
and `VITE_VIDEO_RELEASE` (set in the talk's `.env`). When `hq` is requested
but the local HQ file is missing, playback transparently degrades to the
web copy (local, then GH Release).

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
- Grids: `grid-2`, `grid-3` with `gap-md mt-md`.
- Emoji format: `## 📊 **Title**` — emoji outside bold.

## Aspect ratio

Per-talk — set `aspectRatio` and `canvasWidth` in the deck frontmatter
to match the venue. The `2026_04_28_editAI` venue is a **2.5 × 4.5 m
LED wall at 2880 × 1600** (pixel pitch 1.56 mm), aspect **9:5** (= 1.8,
*not* 16:10 which is 1.6). The deck uses `aspectRatio: 9/5` and
`canvasWidth: 2880` so raster assets render at native resolution.

Videos keep native aspect via `object-fit: contain` in `VideoPlayer`;
16:9 clips letterbox inside a 9:5 slide — expected.

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` and deploys to GH Pages. A simple index at the site
root links to each talk. Enable under repo Settings → Pages → Source:
"GitHub Actions".

## Git remotes

GitHub remote is named `github` (not `origin`). Push with
`git push github <branch>`.
