# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Outreach talk — crash course on CERN and how research is done there. Delivered as an interactive **Slidev** deck. Seminar date: 2026-04-28.
Audience: later-grade students, teachers, school principals. Content is video/image-heavy.

## Commands

```bash
pnpm install

# Dev server
pnpm dev

# Production build / PDF export
pnpm build
pnpm export

# Video pipeline (raws in videos/raw/, encoded web copies in public/videos/)
pnpm videos:sync        # rclone raw files from the configured remote
pnpm videos:encode      # ffmpeg raw -> web per manifest profile (idempotent)
pnpm videos:publish     # upload encoded files to GH Release `videos`
pnpm videos:check       # sanity-check manifest vs raw/web/slide refs

# HQ raw playback (serve untouched masters instead of web copies)
pnpm videos:link-hq     # symlink public/videos-hq/ -> videos/raw/ (local only)
pnpm videos:publish-hq  # upload raw masters to GH Release `videos-hq`
```

No tests or linters.

## Architecture

### Deck structure

- `deck.md` — Slidev entry point. Add per-section imports via `src:` frontmatter pointing at `slides/*.md`.
- `slides/` — per-section markdown files (create as content lands).
- `theme/` — local Slidev theme (`@slidev/theme-scienced`), inherited from the CERN lectures project. Custom layouts: `cover`, `section`, `quote`, `fact`, `statement`, `intro`, `center-bkg`. Card system + grid utilities in `theme/styles/custom-slides.css`.
- `components/VideoPlayer.vue` — local-first / remote-fallback video player.
- `public/` — static assets referenced as `/filename.ext` from slides (images, gifs, web-encoded videos under `public/videos/`, HQ raws symlinked at `public/videos-hq/`).

### Video pipeline

Inherited verbatim from the CERN lectures project, paths adjusted for this flat layout.

- Source of truth: `videos/manifest.toml`. Every video must have an entry; `videos:check` enforces it against raws, encoded files, and slide references.
- `videos/raw/` — originals pulled via rclone (gitignored). Mirror of `[defaults].source_remote`.
- `public/videos/` — encoded web copies (gitignored). Produced by `videos:encode`, uploaded to GH Release `videos` by `videos:publish`.
- `public/videos-hq/` — symlink to `videos/raw/` (gitignored). Created by `videos:link-hq` so HQ playback works in dev without duplication.
- GH Releases are the deployed CDN: `videos` for web copies, `videos-hq` for raw masters. `VideoPlayer` loads from `public/` first, falls back to the appropriate release on 404.

### Encoding profiles (in `scripts/videos.py`)

- `remux` — lossless stream copy + faststart. Use when source is already a web-friendly codec ≤~5 Mbps.
- `standard` — HEVC CRF 24, 1080p cap, AAC 128k.
- `standard-tight` — HEVC CRF 27 for long clips that blow the 200 MB budget.
- `silent-loop` — HEVC CRF 26, audio stripped. Background loops.
- `high-motion` — HEVC CRF 22, AAC 192k. Sims, fast action, CGI.

### VideoPlayer usage

```html
<VideoPlayer src="My_Clip.mp4" />                   <!-- web-encoded, from public/videos/ -->
<VideoPlayer src="My_Clip.mp4" hq />                <!-- HQ raw, from public/videos-hq/ -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

`videos:check` scrapes `VideoPlayer src="..."` references from slide markdown and compares against the manifest, so keep that attribute syntax.

## Slide Authoring Conventions (inherited theme)

- Frontmatter: `theme: ./theme`, `colorSchema: dark`, `transition: fade`, optional `background: /…`.
- Structure: cover → quote → motivation → section breaks (`layout: section` + `hideInToc: true`).
- Card system: `<div class="card card-primary pad-tight">…</div>`. Colors: `primary|secondary|accent|info|success|warning`. Padding: `pad-tight|compact|snug|balanced`.
- Grids: `grid-2`, `grid-3` with `gap-md mt-md`.
- Emoji format: `## 📊 **Title**` — emoji outside bold.

## Slidev gotchas

- Git conflict markers inside fenced code blocks crash Slidev's snippet plugin (`ENOENT` on `<<<<<<< HEAD`). Wrap them in `{{'<<<<<<< HEAD'}}` inside a ```` ```text {*}{lines:false} ```` block.

## TODO before first deploy

1. Create the GitHub repo and update `REPO_RELEASES` in `components/VideoPlayer.vue` if the slug differs from the `EditAI_Seminar_2026` placeholder.
2. Set `[defaults].source_remote` in `videos/manifest.toml` to the rclone remote holding raws.
3. Create the `videos` and (optionally) `videos-hq` releases on first `videos:publish` / `videos:publish-hq`.
4. Add a `.github/workflows/deploy.yml` if GH Pages deploy is desired (pattern: `teaching/CERN_lessons_on_data_analysis`).
