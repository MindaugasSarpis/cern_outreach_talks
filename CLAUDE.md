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
- No `advance-on-end` on a clip unless the owner asks for that clip by name
  (2026-10-21, after OpenData clicked itself on at a venue PC without
  WebGL): a clip ends and waits for the press. Lint: ADVANCE.
- Without WebGL the stage plays recorded plates over a drifting still. A
  talk adopts it: pin the release that carries it, `stage.motion: floor`,
  `pnpm talk record NAME --plates`, `pnpm videos:publish --only <plates>`,
  `ready`, `deploy` (`docs/authoring.md`).
- Every step has a command: `pnpm talk --help`, README's "Day to day".

Every session loads this file, so it stays under 12 KB: a talk's notes go
to its own CLAUDE.md ("Where notes live"). `README.md` walks the lifecycle;
keep the two consistent.

## Project overview

Monorepo of CERN outreach talks as **Slidev** decks: the shared theme and
components at the root, each talk a pnpm workspace under `talks/<name>/`.
The video pipeline, the `VideoPlayer` addon, the stage addon and the clip
library are the package **`slidev-videos`** (the checkout beside this one,
`$SLIDEV_VIDEOS_DIR`; https://github.com/MindaugasSarpis/slidev-videos).

| Talk | What (the rest: its `CLAUDE.md`) |
| ---- | ---- |
| `2026_04_28_editAI` | EditAI Seminar crash course; 2880×1600 LED wall, 9:5 |
| `2026_05_11_Sceptics` | Sceptics Society talk; 4K projector, 16:9 |
| `2026_07_18_Yaga` | Yaga crash course (Lithuanian); 4K, 16:9 |
| `2026_09_10_WorldOfParticles` | World of Particles opening lecture: ParticleHero and 32 clips |
| `2026_09_15_Startertalk` | "Pentaquarks at LHCb", a 30-min seminar in the hadron space |
| `2026_10_21_OpenData` | "Opening LHCb's data", a 6½-min award talk; the stage; given |
| `2026_10_23_Innoday` | Innoday (Lithuanian), a business audience; the stage; given |
| `2026_10_26_UzsikraukKarjerai` | Užsikrauk karjerai, a Lithuanian TV talk; the stage; filmed |
| `2026_11_18_Tokyo` | the Lithuania–Japan project, Embassy in Tokyo, 30 min; the stage |
| `2026_00_00_MasterTalk` | placeholder keynote, "one collision, one shot"; the v0.9.0 pilot |

A `00` day is a placeholder: once known, rename the dir, its `videos.toml`
release_tag and the deck's `videos.release`.

## Setup

A new machine: README's "New machine" (both clones side by side,
`scripts/bootstrap.sh`, `pnpm talk session …`). The env bundles `nodejs`,
`pnpm`, `python>=3.11`, `ffmpeg`, `rclone`, `gh` and the `slidev-videos` CLI.
Settings: `~/.config/outreach_talks/env`; `pnpm talk config` shows each with
its source, `pnpm talk doctor` checks the tools.

**This workstation** (WSL2). A bare shell finds a Windows pnpm shim under
`/mnt/c` and a static `ffmpeg`/`ffprobe` in `~/.local/bin` (no NVENC; exit
139 on HTTPS input, so `videos:preflight` of release-only clips needs the
env's). Bootstrap records the env's `bin` as `OUTREACH_ENV_BIN`; `pnpm talk`
and each `pnpm talk session` window put it first on PATH; a bare encode or
capture goes through `pnpm talk render -- <command>`. `bootstrap.sh
--mesa-d3d12` fetches Mesa's d3d12 driver: headless Chromium on WSL's GPU.

## Repo layout

```
/
├── videos.toml               # slidev-videos [defaults] for every talk (repo, raw remote, 1080p)
├── pnpm-workspace.yaml       # workspace: talks/*
├── env.yaml                  # the env bootstrap makes
├── theme/                    # shared Slidev theme (@slidev/theme-scienced fork)
├── components/               # shared Vue components (ParticleHero, …)
│   ├── particle-hero/        # three.js scene behind ParticleHero
│   └── hadron-space/         # Startertalk's world (its CLAUDE.md)
├── scripts/                  # talk.py (`pnpm talk`), bootstrap.sh and the helpers talk.py runs
├── research/facts.jsonl      # FACTS BANK: one checked claim per line (research/README.md)
├── assets/photos/photos.toml # photos with checked licence and credit
├── docs/authoring.md         # the long form of the sections below
├── tests/                    # python3 -m pytest -p no:cacheprovider tests
├── videos/raw/               # RAW BANK: originals for every talk (gitignored)
└── talks/<name>/
    ├── CLAUDE.md             # the talk's notes: Brief, Status, Decisions, Figures
    ├── deck.md               # Slidev entry: theme ../../theme, addons, videos: {repo, release, fit}
    ├── videos.toml           # project marker: raw_dir=../../videos/raw, release_tag
    ├── package.json          # slidev, the addons, videos:* scripts (slidev-videos <cmd>)
    ├── components/ -> ../../components   (symlink, for auto-import)
    ├── setup/, styles/       # stage talks: setup/main.ts registers talk-owned builders
    ├── public/figures/       # images, gifs
    ├── public/videos/        # encoded web copies (gitignored)
    └── videos/manifest.toml  # talk-OWNED clips (library clips go by name)
```

**Raw bank.** Originals live once per machine in `videos/raw/`;
`videos:sync` fetches only the raws the talk's manifest names.

**Theme** is `theme: ../../theme` in each deck's frontmatter, never a
symlink: Vite's glob scanner does not traverse one and silently drops
custom layouts. **Components** stays a symlink: Slidev auto-imports from
`<deck>/components/` and cannot be redirected in frontmatter.

## The talk CLI

`pnpm talk <verb>` from the repo root or a worktree's; NAME is any part of
a talk's directory name. README's "Day to day" pairs each step with its skill.

| Verb | Does |
| ---- | ---- |
| `new NAME`, `open NAME` | a worktree on `talk/<slug>` with the scaffold; find or make one |
| `list`, `status` | talks and pins; every worktree, the last deploys and Pages run |
| `dev`, `build` | live reload; a build into `$TALK_TMP/talk-<slug>/site`, never `dist/` |
| `check`, `shots`, `review` | the lockfile, videos:check, stage:check, build; shots into `shots/`; check, then shots of changed slides |
| `lint`, `map`, `facts …` | the deck lint; the slide map; the facts bank (`search`, `show`, `add`, `check`) |
| `ready`, `deploy` | before the venue (lint --release, check, shots, preflight, plates); deploy, when asked |
| `record`, `safe` | MP4s per slide, or `--plates`; the TV safe area |
| `render -- CMD` | the render slot: srun, condor_run, or this machine's lock |
| `pin [NAME] REF`, `bump-toolkit` | one talk's two addon pins; all pins, env.yaml and the scaffolder |
| `session`, `sessions` | Claude in a window of the tmux session `talks`; the windows, status lines |
| `config`, `doctor` | the resolved settings; tool versions |

Every verb takes `--json` (`pnpm -s talk … --json`): one object on stdout;
exit 0 ok, 1 problems, 2 usage. Output:
`$OUTREACH_STATE/logs/<slug>-<verb>-<sha>-<time>.log`; the terminal gets a
summary and the log's path.

## Commands in a talk

In a talk directory: `pnpm dev`, `build`, `build:portable`, `export`; the
clips' `pnpm videos:sync`, `encode`, `frames` (stage talks), `publish`,
`pull`, `check`, `preflight` (the venue lint) and `clean`; `pnpm venue`
makes the offline zip. Encodes and strips go through `pnpm talk render --
…`. Notes: `docs/authoring.md`; the clip workflow: skill talk-videos. From
the repo root: `pnpm videos:check-all`, `pnpm new-talk <YYYY_MM_DD_Name>`;
`slidev-videos discover <keywords>` (any dir) searches open archives.

## Videos

Library clips (the package's `shared.toml`, release `videos-shared`) go by
name, never in a manifest; a talk's own clips and cuts (`trim`) go in its
`videos/manifest.toml` and on its own release, which wins the chain.
`<VideoPlayer src="name.mp4" [muted] [loop] [:controls="false"] [:autoplay="false"] [:volume="0.7"] />`:
keep that `src="..."` syntax, `videos:check` greps it. Web tier only (≤1920
H.264 ≤10 Mbps, AAC, -16 LUFS). A non-video slide before a heavy opener
lets it buffer. In full: `docs/authoring.md`.

## Facts, lint and the map

`pnpm talk facts|lint|map`, or the scripts above (stdlib, `--json`). Cite
facts as `<!-- facts: id1, id2 -->` above the speaker notes. Open marks are
`[CHECK…]`, `[PATIKSLINTI…]`, `[ASR…]` and `[TODO…]`. Lint rules and
commands: `docs/authoring.md`.

## Slide authoring conventions (inherited theme)

- Frontmatter: `theme: ../../theme`, `colorSchema: dark`, `transition: fade`, optional `background: /figures/…`.
- Custom layouts: `cover`, `section`, `quote`, `fact`, `statement`, `intro`, `center-bkg`.
- Cards `card card-<color> pad-<size>`; grids `grid-2`, `grid-3` with their own gap (no `grid`, `gap-md`).
- Layouts and cards are for the older decks; no emoji in headings (lint).
- Leave `canvasWidth` at Slidev's 980; per venue set only `aspectRatio`
  (`9/5` LED wall, `16/9` projector). A video slide has no h1: the player is
  full-bleed. An embedded site wants the 2× iframe trick. All three:
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
`pnpm talk check` hands their types to `stage:check`. In full: `docs/authoring.md`.

## Slidev gotchas

- `routerMode: hash` in frontmatter, so deep links (`/#/3`) survive a refresh on GH Pages.
- Conflict markers in a fenced block crash Slidev's snippet plugin (`ENOENT` on `<<<<<<< HEAD`): wrap them as `{{'<<<<<<< HEAD'}}` in a ```` ```text {*}{lines:false} ```` block.

## Deployment

`.github/workflows/deploy.yml` builds every `talks/<name>/` with base
`/<repo>/<name>/` onto GH Pages (Settings → Pages → Source: "GitHub
Actions"); an index at the root links each talk. A deploy is `pnpm
talk deploy NAME` from the talk's worktree (README's "Deploying"). The
GitHub remote is `origin` here, `github` in some clones (`git remote -v`).

## Where notes live

A talk's Brief, Status, Decisions and own code: `talks/<name>/CLAUDE.md`
(a delivered talk's full log: its `notes/history.md`). Startertalk's world:
`components/hadron-space/CLAUDE.md`. The long form: `docs/authoring.md`;
the old root file's paragraphs: `docs/claude-md-split.md`. One line per
session: `$OUTREACH_STATE/status.md` (`pnpm talk sessions`).
