# CERN Outreach Talks

Monorepo of [Slidev](https://sli.dev) decks for CERN outreach talks.
Shared theme, components, and video pipeline at the root; each talk is
a pnpm workspace under `talks/<name>/`.

This README is the **human walkthrough** — the talk lifecycle from
scaffold to post-talk cleanup. The detailed operating reference (config
layering, encoding profiles, fallback chains, edge cases) lives in
[CLAUDE.md](CLAUDE.md); it is written for the AI assistant but is the
same source of truth people should consult when the details matter.

## Talks

| Date       | Path                        | Deployed |
| ---------- | --------------------------- | -------- |
| 2026-04-28 | `talks/2026_04_28_editAI/`  | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_04_28_editAI/) |
| 2026-05-11 | `talks/2026_05_11_Sceptics/`| [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_05_11_Sceptics/) |
| 2026-07-18 | `talks/2026_07_18_Yaga/`    | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_07_18_Yaga/) |

Index of all talks: https://mindaugassarpis.github.io/cern_outreach_talks/

## The policy (since 2026-07-18, post-Yaga)

At the Yaga talk, playback froze twice on venue-native HEVC masters.
The standing policy since then, unless explicitly decided otherwise for
a specific talk:

- **Venues play the web tier**: 1080p-class (≤1920 px long edge) H.264 —
  it decodes everywhere and never chokes the venue machine. No 4K/HEVC
  "HQ masters" by default.
- **Audio is even across clips**: every web encode is loudness-normalized
  to −16 LUFS (EBU R128), so the venue volume is set once, on the first
  clip. Opt a clip out with `loudnorm = false` in the manifest;
  `<VideoPlayer :volume="0.7" />` is the live escape hatch.
- **`pnpm videos:preflight` before every talk** — it checks what each
  slide will *actually* play and flags anything risky (see below).

## Setup from scratch

Prerequisite: [conda](https://docs.conda.io) (or mamba/miniforge).

```bash
git clone <this-repo>
cd outreach_talks
conda env create -f env.yaml     # nodejs, pnpm, python, ffmpeg, rclone, gh
conda activate outreach_talks
pnpm install

cd talks/2026_07_18_Yaga
pnpm dev                         # http://localhost:3030
```

No videos are stored in git. Local video dirs being empty is normal —
clips stream from GitHub Releases at runtime, and everything can be
re-fetched on demand (see "Getting files back" below).

## Starting a new talk

```bash
pnpm new-talk 2026_09_15_SomeVenue --title "My talk"   # from the repo root
pnpm install                                           # register the workspace
```

This scaffolds the whole talk directory with the current policy baked in
(16:9, 1080p web tier, shared-clip inheritance). **Don't clone an old
talk directory** — that's how outdated venue-specific settings sneak
back in.

## Adding media to a slide

**Image / GIF** — drop into `talks/<name>/public/figures/` and reference
with an absolute path: `![](/figures/my-photo.jpg)`.

**Video** — add an entry to `videos/manifest.toml`, put the raw file on
the gdrive source folder (or in `videos/raw/` directly), then:

```bash
pnpm videos:sync       # fetch raws listed in the manifest from gdrive
pnpm videos:encode     # ffmpeg -> public/videos/  (H.264, loudness-normalized)
pnpm videos:publish    # upload to the talk's GitHub Release
```

Reference it in a slide:

```md
<VideoPlayer src="my_clip.mp4" />
<VideoPlayer src="loop.mp4" loop muted :controls="false" />
<VideoPlayer src="hot_clip.mp4" :volume="0.7" />   <!-- rare: live attenuation -->
```

Many widely-reused clips (CERN footage, chart renders, B-roll) are
**inherited from the shared registry** (`/videos/shared.toml`) and served
from the `videos-shared` release — reference them by filename and they
just work; don't add them to the talk manifest.

## Before the talk — the checklist

```bash
pnpm videos:check        # manifest / files / slide refs all consistent?
pnpm videos:preflight    # THE important one — see below
pnpm venue               # build the offline venue bundle
```

`videos:preflight` resolves what each slide will actually serve (local
file, talk release, or shared release) and probes it, flagging:

- video codecs browsers can't decode well (HEVC — what froze Yaga),
- resolution above the 1920 px web cap,
- bitrate above 10 Mbps,
- audio codecs Chrome plays as silence (PCM),
- loudness more than ±2 LU off the −16 LUFS target.

Fix flags by re-encoding (`pnpm videos:encode -- --force --only <name>`
then `pnpm videos:publish`), or consciously accept them.

`pnpm venue` produces `<talk>-venue.zip`: a fully offline bundle
(pulls inherited shared clips first, then builds and zips). Copy it to
the venue machine or gdrive; a RUN_ME.txt inside explains how to serve
it (`python3 -m http.server 8000` — browsers refuse ES modules on
`file://`).

## After the talk — cleanup

```bash
pnpm videos:clean            # dry run: shows what is safe to delete and why
pnpm videos:clean -- --yes   # actually delete (add --web to include web copies)
```

`clean` only deletes a local file when a size-matched copy is verified
on gdrive (raws) or a GitHub Release (encodes) — it refuses anything it
can't prove recoverable, and prints the recovery command for everything
it removes.

## Getting files back

```bash
pnpm videos:sync                          # raws, from gdrive
pnpm videos:pull                          # web encodes, from the talk release
pnpm videos:pull -- --include-shared      # + inherited shared clips (offline builds)
```

## Deploying

`git push` to GitHub — the Pages workflow builds every talk and deploys
the index. (The remote is named `github` on some clones, `origin` on
others; check `git remote -v`.)

## More detail

- [CLAUDE.md](CLAUDE.md) — full reference: config layering, encoding
  profiles and encoder selection, the VideoPlayer fallback chain, shared
  registry rules, release/archive semantics, Slidev gotchas.
- `docs/superpowers/specs/` — design docs for the bigger pieces (e.g.
  `2026-07-17-videos-clean-design.md`).
- `scripts/videos.py --help` and each subcommand's `--help`.
