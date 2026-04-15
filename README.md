# CERN Crash Course — EditAI Seminar (2026-04-28)

Outreach talk: a crash course on CERN and how research is done there.
Audience: later-grade students, teachers, school principals.
Delivered as a [Slidev](https://sli.dev) deck with heavy video/image content.

## Running from scratch

Prerequisite: [conda](https://docs.conda.io) (or mamba/miniforge).

```bash
# 1. Clone and enter the repo
git clone <this-repo> edit-ai-seminar
cd edit-ai-seminar

# 2. Create the environment (node, pnpm, python, ffmpeg, rclone, gh)
conda env create -f env.yaml
conda activate edit-ai-seminar

# 3. Install Slidev + JS deps into node_modules/
pnpm install

# 4. Start the dev server (opens http://localhost:3030)
pnpm dev
```

Edit `deck.md` (or files in `slides/`) and the browser reloads automatically.

## Common tasks

```bash
pnpm dev              # live dev server on deck.md
pnpm build            # static bundle in dist/
pnpm export           # PDF export of the deck

# Video pipeline (all operate on videos/manifest.toml)
pnpm videos:sync      # rclone raws from the configured remote -> videos/raw/
pnpm videos:encode    # ffmpeg videos/raw/ -> public/videos/ (idempotent)
pnpm videos:publish   # upload encoded files to GH Release `videos`
pnpm videos:check     # sanity-check manifest vs raws / encoded / slide refs

pnpm videos:link-hq   # symlink public/videos-hq/ -> videos/raw/ for local HQ playback
pnpm videos:publish-hq  # upload raw masters to GH Release `videos-hq`
```

## Adding media to a slide

**Image or GIF** — drop the file under `public/` and reference it with an absolute path:

```md
![](/my-photo.jpg)
```

**Video** — add an entry in `videos/manifest.toml`, drop the raw in `videos/raw/`,
then `pnpm videos:encode`. Reference it from a slide:

```md
<VideoPlayer src="My_Clip.mp4" />              <!-- web-encoded copy -->
<VideoPlayer src="My_Clip.mp4" hq />           <!-- untouched raw master -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

The player streams from `public/videos/` locally and falls back to the
GitHub Release when deployed.

## Before the talk

1. `pnpm videos:check` — catch orphan raws, missing manifest entries, or broken slide refs.
2. `pnpm videos:encode` — regenerate any stale web copies.
3. `pnpm videos:publish` (and `publish-hq` if you use HQ playback) — push assets to the Releases.
4. `pnpm build` and deploy `dist/` (GitHub Pages, or serve locally for an offline venue).
