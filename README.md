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

## Day to day

One command per step, the same for the owner and for agents (the skills in
`.claude/skills/` call these). Run them from the repo root or a talk's
worktree; NAME is any part of a talk's directory name (`opendata`).

| Step | Command | Skill |
| ---- | ------- | ----- |
| Start a talk: worktree, scaffold, install | `pnpm talk new 2026_11_05_Name --stage blue --lang lt --duration 20` | talk-new |
| Pick a talk up again | `pnpm talk open NAME` (prints its worktree) | talk-new |
| Every worktree, its talks, the last deploy | `pnpm talk status` · `pnpm talk list` | |
| Find a figure before researching it | `pnpm talk facts search WORDS` · `facts add` · `facts show ID` | talk-research |
| Edit with live reload | `pnpm talk dev NAME` | |
| Clips: find, encode, publish, frames | `slidev-videos discover WORDS`, then `pnpm videos:*` in the talk | talk-videos |
| Language, slop, timing, sources | `pnpm talk lint NAME` | lt-copy, talk-quality |
| What each slide shows, poses and timing | `pnpm talk map NAME` | talk-quality |
| Videos, stage and build in one go | `pnpm talk check NAME` | talk-verify |
| Look at the slides | `pnpm talk shots NAME --slides 3-5` | talk-verify |
| A review round | `pnpm talk review NAME` | talk-quality |
| Check every figure's source | `pnpm talk facts check` | talk-verify |
| Filmed for TV | `pnpm talk new … --broadcast` · `pnpm talk safe NAME` · `pnpm talk record NAME` | talk-broadcast |
| Before the venue | `pnpm talk ready NAME`, then `pnpm venue` in the talk | talk-verify |
| Deploy, when the owner asks | `pnpm talk deploy NAME` (`--dry-run` checks only) | talk-deploy |
| Move to a toolkit release | `pnpm talk bump-toolkit vX.Y.Z --active` | |
| Is this machine set up? | `pnpm talk doctor` | |

- `talk VERB …` does the same from any directory once linked:
  `ln -s ~/outreach_talks/scripts/talk ~/.local/bin/talk`. It also skips the
  Windows pnpm that a bare shell here finds first.
- Every verb takes `--json`: one JSON object on stdout, the rest on stderr;
  exit 0 ok, 1 problems found, 2 usage error. Through pnpm, add `-s`
  (`pnpm -s talk status --json`) or pnpm's own banner lands on stdout.
- Builds for checks and shots go to `/tmp/talk-<slug>/site`, never a talk's
  `dist/`; shots land in `talks/<name>/shots/` (not committed). Point
  `SLIDEV_STAGE_BIN` at a slidev-videos `packages/stage/bin` to use newer
  shots, record or safe tools than the talk's pin.

## The policy (since 2026-07-18)

- Venues play the **1080p H.264 web tier** (no 4K/HEVC masters — they froze at Yaga).
- Audio is **loudness-normalized to −16 LUFS**; set the venue volume once.
  On a video slide `p` toggles play/pause, `+`/`-` step the volume and
  the level sticks for the rest of the deck.
- `pnpm videos:preflight` before every talk.

## Starting a new talk

```bash
pnpm talk new 2026_09_15_SomeVenue --title "My talk"   # worktree .claude/worktrees/somevenue, branch talk/somevenue
cd .claude/worktrees/somevenue                         # the talk's own checkout; installed already
```

The talk gets `talks/<name>/CLAUDE.md`: the Brief (with the questions to
ask the owner), Status, Arc, Figures, Talk-owned code, Decisions, Verify.

Don't clone an old talk directory; the scaffold carries the current
layout (`videos.toml`, addon headmatter, empty manifest).

A talk told inside the 3D stage (one world under every slide, clips that
arrive and leave as particles):

```bash
pnpm talk new 2026_10_15_SomeKeynote --title "My talk" --stage blue   # classic | blue | ember; --broadcast for TV
pnpm talk check somekeynote   # after editing public/data/space.json or a slide's `space:`
pnpm videos:frames            # in the talk, after adding clips; commit public/video-frames/
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

## Before the talk

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

Only when the owner asks: `pnpm talk deploy <name>`, from the talk's
worktree. It refuses uncommitted changes and a branch that is not on top of
`origin/main` (and prints the rebase), runs `pnpm talk ready`, pushes the
branch to `main`, watches the Pages run and checks the talk's URL before it
says "deployed".

The Pages workflow builds each talk on its own: a talk whose files did not
change comes from the cache, and a talk that fails to build keeps its last
good build on the site and turns the run red without holding the others
back. The index lists each talk by its `package.json` description. Pull
requests build the talks they change, as a check, without deploying.

## More detail

- [CLAUDE.md](CLAUDE.md) — repo conventions, theme, authoring, gotchas.
- slidev-videos README — CLI, profiles, player props, `videos.toml`.
- `docs/superpowers/specs/2026-09-08-slidev-videos-migration-design.md` — why things are laid out this way.
