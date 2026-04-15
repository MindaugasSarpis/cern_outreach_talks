# CERN Outreach Talks

Monorepo of [Slidev](https://sli.dev) decks for CERN outreach talks.
Shared theme, components, and video pipeline at the root; each talk is
a pnpm workspace under `talks/<name>/`.

## Talks

| Date       | Path                               | Deployed |
| ---------- | ---------------------------------- | -------- |
| 2026-04-28 | `talks/2026_04_28_editAI/`         | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_04_28_editAI/) |

Index of all talks: https://mindaugassarpis.github.io/cern_outreach_talks/

## Running from scratch

Prerequisite: [conda](https://docs.conda.io) (or mamba/miniforge).

```bash
git clone <this-repo>
cd Outreach_Talks
conda env create -f env.yaml
conda activate outreach_talks
pnpm install

cd talks/2026_04_28_editAI
pnpm dev                            # http://localhost:3030
```

## Common tasks (inside a talk directory)

```bash
pnpm dev                # live dev server on deck.md
pnpm build              # static bundle in dist/
pnpm export             # PDF (requires playwright-chromium; install locally)

pnpm videos:sync        # rclone raws from the configured remote
pnpm videos:encode      # ffmpeg raw -> public/videos/ (idempotent)
pnpm videos:publish     # upload encoded files to GH Release
pnpm videos:check       # sanity-check manifest vs raws / encoded / slide refs
pnpm videos:link-hq     # symlink public/videos-hq/ -> videos/raw/
pnpm videos:publish-hq  # upload raw masters to GH Release `videos-hq-…`
```

From the repo root: `pnpm videos:check-all` runs `videos:check` in every talk.

## Adding a new talk

```bash
scripts/new-talk.sh <name>          # scaffolds talks/<name>/
```

Or manually:

```bash
mkdir -p talks/<name>/{public/figures,videos/raw,slides}
ln -s ../../components talks/<name>/components
```

Then create `deck.md`, `.env`, `package.json`, and `videos/manifest.toml`
(copy from an existing talk).

## Adding media to a slide

**Image / GIF** — drop into `talks/<name>/public/` and reference with an
absolute path:

```md
![](/my-photo.jpg)
```

**Video** — add an entry in `videos/manifest.toml`, drop the raw in
`videos/raw/`, run `pnpm videos:encode`, then reference it:

```md
<VideoPlayer src="My_Clip.mp4" />              <!-- web-encoded copy -->
<VideoPlayer src="My_Clip.mp4" hq />           <!-- raw master -->
<VideoPlayer src="Loop.mp4" loop muted :controls="false" />
```

Local: streams from `public/videos{,-hq}/`. Deployed: falls back to the
per-talk GitHub Release on 404.

## Before the talk

1. `pnpm videos:check` — catch orphan raws, missing manifest entries, broken slide refs.
2. `pnpm videos:encode` — regenerate any stale web copies.
3. `pnpm videos:publish` (and `publish-hq` if you use HQ playback).
4. `git push github main` — GH Pages rebuilds and deploys all talks.
