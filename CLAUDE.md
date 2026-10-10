# CLAUDE.md

## House rules

- Chat with the owner in English, never in Russian. Lithuanian goes only in
  slide text and speaker notes.
- No title or section slides, titles or statements: the owner narrates. On
  screen: numbers with their unit or a word naming them, and a name of a word
  or two for a thing shown (an invention); fewest words. Licence credits: tiny
  print on the last slide (none for CERN's). White or light blue, never gold.
  Notes stay.
- One worktree per talk, made with `pnpm talk new <YYYY_MM_DD_Name>` or
  `pnpm talk open <name>`. The main checkout stays on `main`: never switch
  its branch or build a talk in it.
- Never merge `pnpm-lock.yaml` by hand: take main's (`git checkout
  origin/main -- pnpm-lock.yaml`), run `pnpm install`, commit the result.
- The shell is zsh: quote globs (`'talks/*'`). Never `pkill -f` a pattern
  that is also in your own command line; use `kill $!` or `fuser -k PORT/tcp`.
- Search the facts bank (`pnpm talk facts search <words>`) before
  researching a figure; research only what it lacks and add what a run
  confirms (`research/README.md`). Licensed photos: `assets/photos/photos.toml`.
  Lint before handing a deck back: `pnpm talk lint <name>`.
- Review with `pnpm talk review <name>`. Deploy with `pnpm talk deploy
  <name>` under `talk-deploy`'s standing rule. Say "deployed" only
  after the Pages run is green and the talk's URL returns 200.
- Every step has a command: `pnpm talk --help`, and README's "Day to day".

Guidance for Claude Code working in this repository. Every session loads
this file, so it stays under 12 KB: a talk's notes go to its own CLAUDE.md
("Where notes live" below). The human-oriented lifecycle walkthrough (new
talk → media → preflight → venue → cleanup) is in [README.md](README.md) —
keep the two consistent when workflows change.

## Project overview

Monorepo of CERN outreach talks delivered as **Slidev** decks. Shared
theme and content components live at the repo root; each talk is a pnpm
workspace under `talks/<name>/`. The video pipeline, the `VideoPlayer`
addon, the stage addon and the shared clip library are the external package
**`slidev-videos`** (the checkout beside this one, `../slidev-videos`, which
`$SLIDEV_VIDEOS_DIR` names; its CLI is editable-installed;
https://github.com/MindaugasSarpis/slidev-videos).

| Talk | What (the rest is in its `CLAUDE.md`) |
| ---- | ---- |
| `2026_04_28_editAI` | EditAI Seminar crash course; 2880×1600 LED wall, 9:5 |
| `2026_05_11_Sceptics` | Sceptics Society talk; 4K projector, 16:9 |
| `2026_07_18_Yaga` | Yaga crash course (Lithuanian); 4K, 16:9 |
| `2026_09_10_WorldOfParticles` | World of Particles opening lecture: ParticleHero and 32 clips |
| `2026_09_00_Startertalk` | "Pentaquarks at LHCb", a 30-minute seminar in the hadron space |
| `2026_10_00_Innoday` | Innoday (Lithuanian), a business audience; the stage |
| `2026_10_00_OpenData` | "Opening LHCb's data", a 6½-minute award talk; the stage |
| `2026_10_26_UzsikraukKarjerai` | „Vadovėlio gale atsakymo nėra“, a Lithuanian TV talk; the stage |

A date of `09_00` or `10_00` is a placeholder: once the date is known, rename
the dir, its `videos.toml` release_tag and the deck's `videos.release`.

## Setup

A new machine: README's "New machine" (both clones side by side,
`scripts/bootstrap.sh`, `pnpm talk session …`). The env bundles `nodejs`,
`pnpm`, `python>=3.11`, `ffmpeg`, `rclone`, `gh` and the `slidev-videos` CLI.
Settings: `~/.config/outreach_talks/env`; `pnpm talk config` shows each and
its source, `pnpm talk doctor` checks the tools.

**This workstation** (WSL2). A bare shell finds a Windows pnpm shim under
`/mnt/c` and a static `ffmpeg`/`ffprobe` in `~/.local/bin`: no NVENC, and
a crash on HTTPS input (exit 139), so `videos:preflight` of release-only
clips needs the env's. Bootstrap records the env's `bin` as
`OUTREACH_ENV_BIN`; `pnpm talk` puts it first on PATH for every tool it
runs, and so does each `pnpm talk session` window. Run a bare encode or
capture through `pnpm talk render -- <command>`. `bootstrap.sh --mesa-d3d12`
fetches Mesa's d3d12 driver so headless Chromium can use WSL's GPU.

## Repo layout

```
/
├── videos.toml               # slidev-videos [defaults] for every talk (repo, source remote, 1080p policy)
├── pnpm-workspace.yaml       # workspace: talks/*
├── env.yaml                  # the env bootstrap makes
├── theme/                    # shared Slidev theme (@slidev/theme-scienced fork)
├── components/               # shared Vue components (ParticleHero, ParticleDiagram, …)
│   ├── particle-hero/        # three.js scene behind ParticleHero (from the CERN lessons landing)
│   └── hadron-space/         # Startertalk's world (notes in its CLAUDE.md)
├── scripts/                  # talk.py (`pnpm talk`), bootstrap.sh, new_talk.py, render_lib.py
│                             # talk_lint.py, talk_map.py, facts.py, photo_fetch.py, talk_copy.py
├── research/facts.jsonl      # FACTS BANK: one checked public claim per line (research/README.md)
├── assets/photos/photos.toml # photos with checked licence and credit
├── docs/authoring.md         # the long form of the authoring sections below
├── tests/                    # python3 -m pytest -p no:cacheprovider tests
├── videos/raw/               # RAW BANK: originals for every talk (gitignored)
└── talks/<name>/
    ├── CLAUDE.md             # the talk's notes: Brief, Status, Decisions, Figures
    ├── deck.md               # Slidev entry: theme ../../theme, addons, videos: {repo, release, fit}
    ├── videos.toml           # project marker: raw_dir=../../videos/raw, release_tag
    ├── package.json          # slidev, the addons, videos:* scripts (slidev-videos <cmd>)
    ├── components/ -> ../../components   (symlink; required for auto-import)
    ├── setup/, styles/       # stage talks: setup/main.ts registers talk-owned builders
    ├── public/figures/       # images, gifs
    ├── public/videos/        # encoded web copies (gitignored)
    └── videos/manifest.toml  # talk-OWNED clips only (library clips are inherited by name)
```

**Raw bank.** Originals live once per machine in `<repo>/videos/raw/`;
every talk's `videos.toml` points `raw_dir` there. `videos:sync` fetches
only the raws the current talk's manifest names.

**Theme** is referenced as `theme: ../../theme` in each deck's
frontmatter. Don't use a `theme` symlink — Vite's glob scanner doesn't
traverse symlinked theme dirs and silently drops custom layouts.
**Components** must stay as a symlink: Slidev auto-imports from
`<deck>/components/` and can't be redirected in frontmatter.

## The talk CLI

`pnpm talk <verb>` from the repo root or a worktree's root; NAME is any part
of a talk's directory name. README's "Day to day" gives each step's command
and skill.

| Verb | Does |
| ---- | ---- |
| `new NAME`, `open NAME` | a worktree on `talk/<slug>` with the scaffold; find or make one |
| `list`, `status` | talks and pins; every worktree, the last deploys and Pages run |
| `dev`, `build` | live reload; a build into `$TALK_TMP/talk-<slug>/site`, never `dist/` |
| `check`, `shots`, `review` | videos:check, stage:check, build; shots into `shots/`; check, then shots of changed slides |
| `lint`, `map`, `facts …` | the deck lint; the slide map; the facts bank (`search`, `show`, `add`, `check`) |
| `ready`, `deploy` | before the venue (lint --release, check, shots, preflight); deploy, when asked |
| `record`, `safe` | broadcast talks: one MP4 per slide; the TV safe area |
| `render -- CMD` | the render slot: srun, condor_run, or the machine's render lock |
| `pin [NAME] REF`, `bump-toolkit` | one talk's two addon pins; all pins, env.yaml and the scaffolder |
| `session`, `sessions` | Claude in a window of the tmux session `talks`; the windows, status lines |
| `config`, `doctor` | the resolved settings; tool versions |

Every verb takes `--json` (`pnpm -s talk … --json`): one object on stdout;
exit 0 ok, 1 problems, 2 usage. Output goes to
`$OUTREACH_STATE/logs/<slug>-<verb>-<sha>-<time>.log`; the terminal gets a summary
and the log's path.

## Commands in a talk

In a talk directory: `pnpm dev`, `build`, `build:portable`, `export`; the
clips' `pnpm videos:sync`, `encode`, `frames` (stage talks), `publish`,
`pull`, `check`, `preflight` (the venue lint) and `clean`; `pnpm venue`
makes the offline zip. Encodes and strips go through `pnpm talk render --
…`. Each command's notes: `docs/authoring.md`; the clip workflow: skill
talk-videos. From the repo root: `pnpm videos:check-all`, `pnpm new-talk
<YYYY_MM_DD_Name>`.
`slidev-videos discover <keywords>` (any dir) searches open archives for clips.

## Videos

Library clips (the package's `shared.toml`, release `videos-shared`) are used
by name and never listed in a manifest; a talk's own clips and cuts (`trim`)
go in its `videos/manifest.toml` and on its own release, which wins the chain.
`<VideoPlayer src="name.mp4" [muted] [loop] [:controls="false"] [:autoplay="false"] [:volume="0.7"] />`:
keep that `src="..."` syntax, `videos:check` greps it. Web tier only (≤1920
H.264 ≤10 Mbps, AAC, -16 LUFS). Put a non-video slide in front of a heavy
opener so it buffers. In full: `docs/authoring.md`.

## Facts, lint and the map

`pnpm talk facts|lint|map`, or the scripts above (stdlib, `--json`).
Cite facts as `<!-- facts: id1, id2 -->` above the speaker notes. Open marks are `[CHECK…]`, `[PATIKSLINTI…]`, `[ASR…]` and
`[TODO…]`. Commands and lint rules: `docs/authoring.md`.

## Slide authoring conventions (inherited theme)

- Frontmatter: `theme: ../../theme`, `colorSchema: dark`, `transition: fade`, optional `background: /figures/…`.
- Custom layouts: `cover`, `section`, `quote`, `fact`, `statement`, `intro`, `center-bkg`.
- Cards `card card-<color> pad-<size>`; grids `grid-2`, `grid-3` with their own gap (no `grid`, `gap-md`).
- Layouts and cards are for the older decks; no emoji in headings (lint).
- Leave `canvasWidth` at Slidev's 980; per venue set only `aspectRatio`
  (`9/5` LED wall, `16/9` projector). A video slide has no h1: the player is
  full-bleed. An embedded site wants the 2× iframe trick. All three in
  `docs/authoring.md`.
- Shared components: `ParticleHero`, `QuizCard` (`docs/authoring.md`);
  `HadronSpace` is Startertalk's (`components/hadron-space/CLAUDE.md`).

## The stage

New talks use **`slidev-addon-stage`** (`$SLIDEV_VIDEOS_DIR/packages/stage`,
its README is the reference): `addons: [slidev-addon-videos,
slidev-addon-stage]` and a `stage:` headmatter block, no `global-*.vue`.
Slides steer the camera with `space: { at, dist, yaw, pitch, dim }`; clips
arrive as dust (`videos.transition: dust`; `pnpm videos:frames`, committed).
Talk-owned builders register from `setup/main.ts` (`registerBuilder`), and
`pnpm talk check` hands their types to `stage:check`. In full:
`docs/authoring.md`.

## Slidev gotchas

- Use `routerMode: hash` in frontmatter when deploying to GH Pages so deep links (`/#/3`) survive a refresh.
- Git conflict markers inside fenced code blocks crash Slidev's snippet plugin (`ENOENT` on `<<<<<<< HEAD`). Wrap in `{{'<<<<<<< HEAD'}}` inside a ```` ```text {*}{lines:false} ```` block.

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` and deploys to GH Pages. A simple index at the site
root links to each talk. Enable under repo Settings → Pages → Source:
"GitHub Actions". A deploy is `pnpm talk deploy NAME` from the talk's
worktree (README's "Deploying").

## Git remotes

This clone's GitHub remote is `origin`; some clones name it `github`.
Check `git remote -v`.

## Where notes live

- `talks/<name>/CLAUDE.md`: a talk's Brief, Status, Decisions, Figures and
  own code, read when Claude works in that directory. A talk's notes go
  there, not here.
- `components/hadron-space/CLAUDE.md`: Startertalk's world.
- `docs/authoring.md`: videos, ParticleHero and QuizCard, the stage, aspect
  ratio, embedded sites.
- `docs/claude-md-split.md`: where each paragraph of the old root file went.
- `$OUTREACH_STATE/status.md`: one line per session (`pnpm talk sessions`).
