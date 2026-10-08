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

## New machine

The two repos sit side by side in one directory, `$OUTREACH_ROOT`; the rest
is made from them.

```bash
mkdir talks && cd talks            # on a cluster: a directory on the shared filesystem
git clone https://github.com/MindaugasSarpis/cern_outreach_talks outreach_talks
git clone https://github.com/MindaugasSarpis/slidev-videos
outreach_talks/scripts/bootstrap.sh --dry-run   # every action it would take
outreach_talks/scripts/bootstrap.sh             # on a cluster: OUTREACH_PREFIX=/scratch/$USER/micromamba first
```

`scripts/bootstrap.sh` can run again at any time; what is there already stays. It

- makes the micromamba env from `env.yaml` under `$OUTREACH_PREFIX` (default
  `~/micromamba`, package cache included, so scratch space works where the
  home directory is small) and installs the slidev-videos CLI from the
  checkout beside this repo (`pip install -e`);
- runs `pnpm install` in both repos and fetches the headless Chromium the
  stage tools drive. When the home directory is on another filesystem than
  the repos, the browsers and the pnpm store go to `$OUTREACH_ROOT/.cache/`;
- picks the render backend (Slurm if `sbatch` is there, HTCondor if
  `condor_submit` is, else this machine) and the WebGL backend: a native
  NVIDIA driver, WSL's GPU through Mesa's d3d12 driver (`--mesa-d3d12` fetches
  it, about 250 MB), else llvmpipe;
- writes all of it to `~/.config/outreach_talks/env`;
- prints the optional Claude Code permission rules. It never writes
  `~/.claude/settings.json` or a hook: add the rules by hand if you want them.

Then Claude: run `claude` once and `/login`. Every session starts with
Remote Control under its own name, so the phone app lists it, and runs in its
own window of the tmux session `talks`:

```bash
cd outreach_talks
pnpm talk session scheduler     # coordinates the others: outreach_talks, with --add-dir ../slidev-videos
pnpm talk session tools         # the toolkit, in ../slidev-videos
pnpm talk session opendata      # one per active talk, in its worktree (made if missing)
tmux attach -t talks
pnpm talk sessions              # the windows, each with its line in $OUTREACH_STATE/status.md
```

`session` on a window that is open already prints the attach command. A
parked talk's session writes its Status and its status line and commits;
then its window is closed (`/exit` in Claude, or `tmux kill-window -t
talks:<slug>`). `pnpm talk session <talk>` opens it again later.

On a cluster, compute nodes may have no internet. The sessions run on a
login or dev node, and renders (shots, recordings, encodes, frame strips) go
to the compute nodes through `pnpm talk render -- <command>`: srun with a GPU
where the cluster has GPUs, or `condor_run` on HTCondor (it writes the submit
file and waits for the job; the job runs in the current directory, so the
repos must be on a filesystem the execute nodes see). `pnpm talk shots`,
`record` and `safe` go through the same slot themselves. On one machine
renders run one at a time under a lock instead.

The settings (`pnpm talk config` shows each with where it came from; the
environment wins over `~/.config/outreach_talks/env`, the file over the
defaults, and every line of the file also reaches the tools talk runs):

| Setting | Default |
| ------- | ------- |
| `OUTREACH_ROOT` | the directory holding outreach_talks |
| `SLIDEV_VIDEOS_DIR` | `$OUTREACH_ROOT/slidev-videos` |
| `OUTREACH_STATE` | `~/.local/state/outreach_talks`: logs, `status.md` |
| `OUTREACH_ENV_BIN` | the env's `bin` (bootstrap writes it), else `$CONDA_PREFIX/bin`, else `~/micromamba/envs/outreach_talks/bin` |
| `RENDER_BACKEND` | `slurm`, `condor` or `local`, detected |
| `RENDER_LOCK` | `/tmp/slidev-stage-shots.lock` where it exists (the stage tools' own lock, so talk and the tools keep one queue), else `$OUTREACH_STATE/render.lock` |
| `RENDER_GPUS`, `RENDER_SRUN_ARGS` | ask for a GPU (`auto`: when the cluster has GPUs); more srun options (`-p`, `--time`, `--account`) |
| `TALK_TMP` | where builds go: the temp directory, on a cluster `$OUTREACH_ROOT/.cache/talk-builds` |
| `SLIDEV_STAGE_GL`, `SLIDEV_STAGE_MESA_D3D12`, `SLIDEV_STAGE_CHROMIUM_ARGS`, `SLIDEV_STAGE_CHROMIUM_ENV` | the stage launcher's; passed to shots, record, safe and render as they are. A backend set in `SLIDEV_STAGE_GL` is forced (a run that cannot reach it fails); `auto` falls through to the next |

Without bootstrap: `conda env create -f env.yaml`, `conda activate
outreach_talks`, `pip install -e ../slidev-videos`, `pnpm install`, then
`cd talks/2026_09_10_WorldOfParticles && pnpm dev` (http://localhost:3030).

No videos live in git. Empty `public/videos/` and `videos/raw/` dirs are
normal: clips stream from GitHub Releases, and everything is
re-fetchable (`pnpm videos:pull`, `pnpm videos:sync`).

## Day to day

One command per step, the same for the owner and for agents (the skills in
`.claude/skills/` call these). Run them from the repo root or a talk's
worktree; NAME is any part of a talk's directory name (`opendata`). A talk's
own worktree, the one `open`, `session`, `deploy` and `pin` use, is named
after the talk, is on its `talk/<slug>` branch, or changes that talk and no
other; a branch that changes several talks, or the notes (`CLAUDE.md`) of
several and nothing else, is none of theirs.

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
| A render: an encode, a capture, a probe | `pnpm talk render -- COMMAND` | talk-videos, talk-verify |
| One talk onto a toolkit release | `pnpm talk pin vX.Y.Z`, in the talk's worktree | |
| Everything onto a toolkit release | `pnpm talk bump-toolkit vX.Y.Z --active` (when the owner asks) | |
| Start or find a session | `pnpm talk session NAME` (`tools`, `scheduler`) · `pnpm talk sessions` | scheduler |
| Is this machine set up? | `pnpm talk doctor` · `pnpm talk config` | |

- `talk VERB …` does the same from any directory once linked (from the repo
  root: `ln -s "$PWD/scripts/talk" ~/.local/bin/talk`). It also puts the env's
  `bin` first, ahead of a Windows pnpm shim a bare WSL shell may find.
- Every verb takes `--json`: one JSON object on stdout, the rest on stderr;
  exit 0 ok, 1 problems found, 2 usage error. Through pnpm, add `-s`
  (`pnpm -s talk status --json`) or pnpm's own banner lands on stdout.
- What builds, checks, lint and the tools print goes to
  `$OUTREACH_STATE/logs/<slug>-<verb>-<sha>-<time>.log`, a new file each run;
  the terminal gets one line per step, the first problem lines (the last
  lines too when a step fails) and the log's path, which `--json` carries as
  `log`.
- Builds for checks and shots go to `$TALK_TMP/talk-<slug>/site`, never a
  talk's `dist/`; shots land in `talks/<name>/shots/` (not committed). Point
  `SLIDEV_STAGE_BIN` at a slidev-videos `packages/stage/bin` to use newer
  shots, record or safe tools than the talk's pin.
- Two ways to move toolkit pins. `pnpm talk pin [NAME] vX.Y.Z` moves one
  talk's two addon pins (`slidev-addon-videos`, `slidev-addon-stage`) and runs
  `pnpm install`, in the talk's own worktree, and changes nothing else.
  `pnpm talk bump-toolkit vX.Y.Z --active` (or `--talk NAME …`) is the
  release-wide move: the pins of several talks, env.yaml's CLI pin and the
  scaffolder's `ADDONS_REF`. Both take release tags; a bare commit only with
  `--allow-sha` (pin spells a short one out from the slidev-videos checkout).

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
`origin/main` (and prints the rebase), runs `pnpm talk ready` unless ready
already passed this very commit (the stamp ready leaves in
`.git/talk-status/<slug>.ready.json`, with no more steps skipped than deploy
skips; `--rerun-ready` runs it anyway), pushes the commit that ready passed
to `main` (it stops if anything was committed or edited in the worktree while
ready ran), watches the Pages run and checks the talk's URL before it says
"deployed".

The Pages workflow builds each talk on its own: a talk whose files did not
change comes from the cache, and a talk that fails to build keeps its last
good build on the site and turns the run red without holding the others
back. The index lists each talk by its `package.json` description. Pull
requests build the talks they change, as a check, without deploying.

## More detail

- [CLAUDE.md](CLAUDE.md) — repo conventions, theme, authoring, gotchas.
- [docs/authoring.md](docs/authoring.md) — the player, ParticleHero and QuizCard, the stage, aspect ratio, embedded sites.
- `talks/<name>/CLAUDE.md` — each talk's notes; `components/hadron-space/CLAUDE.md` — Startertalk's world.
- slidev-videos README — CLI, profiles, player props, `videos.toml`.
- `docs/superpowers/specs/2026-09-08-slidev-videos-migration-design.md` — why things are laid out this way.
