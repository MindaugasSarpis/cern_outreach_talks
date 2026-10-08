# CERN Outreach Talks

Monorepo of [Slidev](https://sli.dev) decks for CERN outreach talks.
Shared theme and content components at the root; each talk is a pnpm
workspace under `talks/<name>/`. Videos are handled by the
[slidev-videos](https://github.com/MindaugasSarpis/slidev-videos) package
(CLI + `VideoPlayer` addon + the shared clip library); this repo holds
only decks and per-talk config.

## Talks

| Date       | Path                                   | Deployed |
| ---------- | -------------------------------------- | -------- |
| 2026-04-28 | `talks/2026_04_28_editAI/`             | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_04_28_editAI/) |
| 2026-05-11 | `talks/2026_05_11_Sceptics/`           | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_05_11_Sceptics/) |
| 2026-07-18 | `talks/2026_07_18_Yaga/`               | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_07_18_Yaga/) |
| 2026-09-10 | `talks/2026_09_10_WorldOfParticles/`   | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_10_WorldOfParticles/) |
| TBD        | `talks/2026_09_00_Startertalk/`        | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_00_Startertalk/) |
| TBD        | `talks/2026_10_00_Innoday/`            | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_Innoday/) |
| TBD        | `talks/2026_10_00_OpenData/`           | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_OpenData/) |

Index of all talks: https://mindaugassarpis.github.io/cern_outreach_talks/

## Setup from scratch

```bash
git clone <this-repo> && cd outreach_talks
conda env create -f env.yaml     # nodejs, pnpm, python, ffmpeg, rclone, gh + the slidev-videos CLI
conda activate outreach_talks
pnpm install                     # every talk's deps, incl. the slidev-addon-videos player
cd talks/2026_09_10_WorldOfParticles && pnpm dev     # http://localhost:3030
```

No videos live in git. Empty `public/videos/` and `videos/raw/` dirs are
normal: clips stream from GitHub Releases, and everything is
re-fetchable (`pnpm videos:pull`, `pnpm videos:sync`).

## The policy (since 2026-07-18)

- Venues play the **1080p H.264 web tier** (no 4K/HEVC masters — they froze at Yaga).
- Audio is **loudness-normalized to −16 LUFS**; set the venue volume once.
  On a video slide `p` toggles play/pause, `+`/`-` step the volume and
  the level sticks for the rest of the deck.
- `pnpm videos:preflight` before every talk.

## Starting a new talk

```bash
pnpm new-talk 2026_09_15_SomeVenue --title "My talk"   # from the repo root
pnpm install
```

Don't clone an old talk directory; the scaffold carries the current
layout (`videos.toml`, addon headmatter, empty manifest).

A talk told inside the 3D stage (one world under every slide, clips that
arrive and leave as particles):

```bash
pnpm new-talk 2026_10_15_SomeKeynote --title "My talk" --stage blue   # classic | blue | ember
pnpm install
cd talks/2026_10_15_SomeKeynote
pnpm stage:check       # after editing public/data/space.json or a slide's `space:`
pnpm videos:frames     # after adding clips; commit public/video-frames/
```

`talks/2026_10_00_Innoday/` (Innoday, in Lithuanian) is the worked example. The engine is
[`slidev-addon-stage`](https://github.com/MindaugasSarpis/slidev-videos/tree/main/packages/stage).

## Videos

**Library clips** (CERN/LHC footage, space B-roll, science sims) are
listed in the package's
[`shared.toml`](https://github.com/MindaugasSarpis/slidev-videos/blob/main/src/slidev_videos/shared.toml)
and served from its `videos-shared` release. Reference them by name and
nothing else is needed:

```md
<VideoPlayer src="cern_overview_short.mp4" />
<VideoPlayer src="expansion_funnel.webm" muted />
```

**Talk-owned clips** (venue footage, chart renders): add a `[[videos]]`
entry to `talks/<name>/videos/manifest.toml`, put the raw on the gdrive
`released/` folder or straight into the repo raw bank `videos/raw/`, then

```bash
pnpm videos:sync        # raws listed in the manifest -> <repo>/videos/raw/
pnpm videos:encode      # ffmpeg -> public/videos/ (H.264 1080p, loudnorm)
pnpm videos:publish     # -> the talk's GitHub Release (videos-<talk>)
pnpm videos:check       # manifest / files / slide refs consistent?
```

Finding new clips: `slidev-videos discover "cloud chamber" lhc` searches
CDS, NASA, ESO/Hubble/Webb/NOIRLab and Wikimedia Commons and prints
manifest snippets.

## Facts, photos and the lint

`research/facts.jsonl` holds the claims earlier talks checked, each with a
public source and a verdict; search it before researching anything
(`research/README.md`). `assets/photos/photos.toml` lists photos whose
licence and credit were read on their record.

```bash
python3 scripts/facts.py search touchscreen      # what is already checked
python3 scripts/facts.py add --from-lane talks/<name>/research/*.json --dry-run   # file a research run
python3 scripts/talk_lint.py talks/<name>        # language, wording, density, sources, timing, facts
python3 scripts/talk_map.py talks/<name>         # one line per slide, numbered as Slidev numbers them
python3 scripts/photo_fetch.py cds:<ID> --dry-run  # licence and credit before fetching
python3 -m unittest discover -s tests            # the tools' own tests
```

## Before the talk

From the repo root, `python3 scripts/talk_lint.py talks/<name> --release`
(open marks fail: `[CHECK…]`, `[PATIKSLINTI…]`, `[ASR…]`, `[TODO…]` in the
slides or notes; so does overtime); then in the talk directory:

```bash
pnpm videos:check
pnpm videos:preflight    # probes what each slide will actually serve: codec, size, bitrate, audio, loudness
pnpm venue               # offline bundle <talk>-venue.zip (RUN_ME.txt inside)
```

## After the talk

```bash
pnpm videos:clean            # dry run: what is safe to delete locally and why
pnpm videos:clean -- --yes
pnpm videos:publish -- --prune   # drop release assets the manifest no longer lists
```

World of Particles: run `pnpm videos:publish -- --prune` in its talk dir
after 2026-09-10 to drop the six superseded Yaga-lineage copies.

## Deploying

`git push origin main` — the Pages workflow builds every talk and the index.

## More detail

- [CLAUDE.md](CLAUDE.md) — repo conventions, theme, authoring, gotchas.
- slidev-videos README — CLI, profiles, player props, `videos.toml`.
- `docs/superpowers/specs/2026-09-08-slidev-videos-migration-design.md` — why things are laid out this way.
