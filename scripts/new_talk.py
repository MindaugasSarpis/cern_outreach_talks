#!/usr/bin/env python3
"""Scaffold a new talk under talks/<YYYY_MM_DD_Name>/ on the slidev-videos workflow.

Bakes in the standing policy (since 2026-07-18): 1080p H.264 web tier with
loudness normalization, 16:9, library clips inherited by name, no HQ tier.

Usage (from the repo root; `pnpm talk new` runs this inside a fresh worktree):
    pnpm new-talk 2026_09_15_SomeVenue [--title "Talk title"] [--aspect 16/9]
    pnpm new-talk 2026_10_00_Keynote --stage blue --lang lt --duration 20
    pnpm new-talk 2026_10_26_OnAir --stage blue --broadcast   # filmed for TV
    pnpm install        # afterwards, to register the workspace + addons

Every talk gets talks/<name>/CLAUDE.md, the notes file sessions read first
(Brief with the questions to ask the owner, Status, Arc, Figures, Talk-owned
code, Decisions, Verify), and `lang:` / `duration:` in the headmatter.

--stage [palette] scaffolds a talk that lives in slidev-addon-stage's
persistent 3D world (classic | blue | ember): a cover on the hero station, a
section in the dust, clips that arrive and leave as particles, a starter
public/data/space.json, setup/main.ts for the talk's own forms, and the
`stage:check` / `videos:frames` scripts. --broadcast (implies --stage) sets
the engine numbers for a talk filmed and streamed rather than projected.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAME_RE = re.compile(r"^\d{4}_\d{2}_\d{2}_\w+$")
# One ref for both addons: they are released together from one repo.
# `pnpm talk bump-toolkit vX.Y.Z` rewrites this line, env.yaml's pip entry and
# the talks' pins together.
ADDONS_REF = "v0.4.0"
ADDONS_REPO = "github:MindaugasSarpis/slidev-videos"
REPO = "MindaugasSarpis/cern_outreach_talks"
PALETTES = {"classic": "#7dd3fc", "blue": "#5b93ff", "ember": "#ffb168"}   # name -> accent (the dust of a clip in flight)
LANGS = ("en", "lt")
PAGES = "https://mindaugassarpis.github.io/cern_outreach_talks"


def addon_specs(ref: str) -> dict[str, str]:
    return {
        "slidev-addon-videos": f"{ADDONS_REPO}#{ref}",
        "slidev-addon-stage": f"{ADDONS_REPO}#{ref}&path:/packages/stage",
    }


PNPM_SCRIPTS = {
    "dev": "slidev deck.md",
    "build": "slidev build deck.md",
    "build:portable": "VITE_VIDEOS_LOCAL_FIRST=1 slidev build deck.md --base ./ --out dist-portable",
    "export": "slidev export deck.md",
    "videos:sync": "slidev-videos sync",
    "videos:encode": "slidev-videos encode",
    "videos:publish": "slidev-videos publish",
    "videos:pull": "slidev-videos pull",
    "videos:check": "slidev-videos check",
    "videos:clean": "slidev-videos clean",
    "videos:preflight": "slidev-videos preflight",
    "venue": "slidev-videos venue",
}
# Shots are `pnpm talk shots <name>`: it builds into /tmp/talk-<slug>/site,
# never into the talk's dist/.
STAGE_SCRIPTS = {
    "videos:frames": "slidev-videos frames",
    "stage:check": "slidev-stage-check .",
}

VIDEOS_TOML = """\
# slidev-videos project marker for this talk. Running `slidev-videos` (or
# `pnpm videos:*`) from inside this directory selects the talk as the
# project; ../../videos.toml supplies the shared [defaults].

[project]
raw_dir = "../../videos/raw"   # repo-level raw bank: one copy per machine, every talk

[defaults]
release_tag = "videos-{slug}"
"""

MANIFEST = """\
# Talk-OWNED clips only. Clips from the slidev-videos library
# (https://github.com/MindaugasSarpis/slidev-videos, src/slidev_videos/shared.toml)
# are inherited by name — reference them in the deck, never list them here.
#
# POLICY (since 2026-07-18): venues play the 1080p H.264 web tier, loudness
# -16 LUFS. No HQ tier. Run `pnpm videos:preflight` before the talk.
# Profiles: remux | standard | standard-tight | silent-loop | high-motion

[defaults]
# release_tag comes from videos.toml (videos-{slug}).

# [[videos]]
# name    = "example_clip.mp4"
# profile = "standard"
# used_in = ["deck"]
# notes   = "What this clip is and where it came from."
"""

DECK = """\
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: {aspect}
addons:
  - slidev-addon-videos
videos:
  repo: {repo}
  release: videos-{slug}
  fit: contain
title: {title}
{meta}---

# {title}

First slide.

---
layout: section
hideInToc: true
---

# Section

---

<!-- a library clip, inherited by name -->
<VideoPlayer src="cern_overview_short.mp4" />
"""

STAGE_DECK = """\
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: {aspect}
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: {repo}
  release: videos-{slug}
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '{accent}'
stage:
  space: data/space.json
  palette: {palette}
{broadcast}title: {title}
{meta}layout: cover
space:
  at: wide
---

# {kicker}

# {title}

## A subtitle

<div class="mt-md">Name · Affiliation</div>

<!--
Speaker: the hero station builds itself behind the title; `c` replays it.
-->

---
layout: section
space: {{ at: first, dim: 0.2 }}
---

# A section in the world

---
space: {{ at: [14, 3, -14], dist: 16, yaw: -30, pitch: 10 }}
---

<!-- a library clip, inherited by name; no h1 on a video slide.
     After adding clips: pnpm videos:frames, and commit public/video-frames/ -->
<VideoPlayer src="cern_overview_short.mp4" />

---
space: {{ at: first, dim: 0.6 }}
---

# A content slide

<div class="card">

## Cards float

The world steps back behind a content slide (`dim: 0.6`).

</div>

<div class="src">Source line</div>
"""

STAGE_SPACE = {
    "hero": "hero",
    "stations": [
        {
            "id": "hero",
            "pos": [-26, 0, 0],
            "look": {"target": [-7.8, 0.4, 0], "dist": 15, "yaw": -22, "pitch": 7, "sway": 9},
            "gather": 3.6,
            "pulse": 6,
            "objects": [
                {
                    "type": "constellation", "pos": [0, 0, 0], "radius": 3.1, "nodeRadius": 0.72,
                    "nodes": [
                        {"pos": [1.2, 0.9, 0.3]}, {"pos": [0.4, -1.5, -0.9], "color": "#dfe6ee"},
                        {"pos": [1.5, -0.3, -1.2]}, {"pos": [-0.9, 1.3, -1.0], "color": "#dfe6ee"},
                        {"pos": [-1.3, -0.6, 0.6]},
                    ],
                },
            ],
        },
        {
            "id": "first",
            "pos": [8, 0, 0],
            "look": {"dist": 10, "yaw": -24, "pitch": 7},
            "objects": [
                {"type": "ring", "pos": [0, 0, 0], "radius": 3, "thickness": 0.01, "tilt": 80, "spin": 0},
                {"type": "orbs", "pos": [0, 0, 0], "items": [{"id": "here", "pos": [0, 0, 0], "label": "start here"}]},
            ],
        },
    ],
}


# A talk filmed and streamed (TV at about 2.5 Mbps, the slides at about two
# thirds of the frame) rather than projected: no film grain or chromatic
# aberration, which cost the encoder the most bits, fewer and larger grains,
# slower flights, no dust borders. slidev-addon-stage v0.6's `look: broadcast`
# replaces these numbers.
BROADCAST = """\
  # Broadcast numbers; slidev-addon-stage v0.6's `look: broadcast` replaces them.
  halo: false
  options: {{ grain: 0, aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom: 0.45, flight: [2.5, 5] }}
"""

SETUP_MAIN = """\
// The talk's own pieces join the stage here, before it boots. A form of the
// talk's own: `import {{ registerBuilder }} from 'slidev-addon-stage'`, then
// registerBuilder(type, build, {{ fields: ['pos', ...] }}); `pnpm talk check`
// finds the type and validates the deck with it. A component:
// app.component('Name', Component). (A plain function: Slidev's
// defineAppSetup is the identity, and @slidev/types is not a dependency of
// the talk.)
export default ({{ app }}) => {{}}
"""

# Until the addon ships its own vite config (toolkit v0.6).
VITE_CONFIG = """\
// In `slidev dev` Vite pre-bundles 'slidev-addon-stage' for setup/main.ts
// while the addon's Stage.vue imports its own source: two builder registries,
// and the world never sees the talk's own forms. Keep the addon unbundled,
// and three with it, so setup/ and the engine share one three.
// (A plain object: 'vite' does not resolve from a talk directory.)
export default {{ optimizeDeps: {{ exclude: ['slidev-addon-stage', 'three'] }} }}
"""

TALK_GITIGNORE = """\
# Never committed: headless shots (`pnpm talk shots`), throwaway scripts,
# workflow state.
shots/
.scratch/
.wf/
"""

NOTES = """\
# {title} (talks/{name})

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/{slug}.md, never here.

## Brief

- Event: TODO
- Date and slot: {date}, {duration}
- Venue and screen: {screen}
- Audience: TODO
- Language: {lang_name} for slides and notes (`lang: {lang}`); chat with the owner in English
- Look: {look}

Ask the owner before building, and write the answers above (dated, in
Decisions when they are choices):

1. What is the event, who is in the room, and how long is the slot,
   questions included?
2. What should the audience remember, in one sentence?
3. Which language on the slides, and which spoken?
4. What screen: projector, LED wall or a TV stream (resolution, aspect)?
5. Which numbers, stories or people must be in it, and what is off limits?
6. Which clips and photos may be used, and who is credited?
7. Is an offline venue bundle, a PDF or a recording needed, and by when?

## Status

- Branch `talk/{wt}`, worktree `.claude/worktrees/{wt}` (`pnpm talk open {wt}`)
- URL: {url}
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/{wt}.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long.

1. Cover:

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

## Decisions

The owner's decisions, dated, newest last.

## Verify

```bash
pnpm talk check {wt}     # videos:check, stage:check, a build into /tmp/talk-{wt}/site
pnpm talk review {wt}    # check, then shots of the changed slides and a contact sheet
pnpm talk ready {wt}     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
"""


def worktree_slug(name: str) -> str:
    """2026_10_26_UzsikraukKarjerai -> uzsikraukkarjerai: the talk's worktree,
    branch (talk/<slug>), build dir (/tmp/talk-<slug>) and status file."""
    return name[11:].lower().replace("_", "-")


def headmatter_meta(lang: str, duration: int | None) -> str:
    lines = [f"lang: {lang}                  # slides and notes; `pnpm talk lint` reads it",
             "htmlAttrs:", f"  lang: {lang}"]
    lines.append(f"duration: {duration}min" if duration else "# duration: 20min           # the slot; ask the owner")
    return "\n".join(lines) + "\n"


def notes(name: str, title: str, lang: str, duration: int | None, stage: str | None, broadcast: bool) -> str:
    date = name[:10].replace("_", "-")
    if date.endswith("-00") or "-00-" in date:
        date = f"{date} (placeholder: the date is not fixed)"
    look = f"slidev-addon-stage, {stage} palette" if stage else "the shared theme, no stage"
    if broadcast:
        look += ", broadcast numbers (`stage.options`; v0.6: `look: broadcast`)"
    screen = ("TV stream (about 2.5 Mbps, the slides at about two thirds of the frame): "
              "large type, few words, no fine grain" if broadcast else "TODO (projector, LED wall or stream; 16:9 unless told)")
    return NOTES.format(
        title=title, name=name, slug=name.lower().replace("_", "-"), wt=worktree_slug(name),
        date=date, duration=f"{duration} min" if duration else "TODO min",
        screen=screen, lang=lang, lang_name={"lt": "Lithuanian", "en": "English"}[lang],
        look=look, url=f"{PAGES}/{name}/")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("name", help="talk directory name, e.g. 2026_09_15_SomeVenue")
    parser.add_argument("--title", default=None, help="deck title (default: derived from name)")
    parser.add_argument("--aspect", default="16/9", help="slide aspect ratio (default 16/9)")
    parser.add_argument("--stage", nargs="?", const="classic", default=None, choices=sorted(PALETTES),
                        metavar="PALETTE", help="tell the talk inside the 3D stage; palette: " + " | ".join(sorted(PALETTES)))
    parser.add_argument("--lang", default="en", choices=LANGS, help="slides and notes language (default en)")
    parser.add_argument("--duration", type=int, default=None, metavar="MIN", help="the slot in minutes")
    parser.add_argument("--broadcast", action="store_true",
                        help="filmed and streamed, not projected: the broadcast engine numbers (implies --stage)")
    parser.add_argument("--addons-ref", default=ADDONS_REF, dest="addons_ref",
                        help=f"slidev-videos tag, branch or commit for the addons (default {ADDONS_REF})")
    args_list = list(sys.argv[1:] if argv is None else argv)
    if args_list[:1] == ["--"]:  # pnpm forwards the -- delimiter verbatim
        del args_list[0]
    args = parser.parse_args(args_list)

    if args.broadcast and not args.stage:
        args.stage = "classic"
    if args.duration is not None and args.duration <= 0:
        print("error: --duration is the slot in minutes, a positive number", file=sys.stderr)
        return 2
    if not NAME_RE.match(args.name):
        print(f"error: {args.name!r} doesn't match YYYY_MM_DD_Name", file=sys.stderr)
        return 2
    talk = ROOT / "talks" / args.name
    if talk.exists():
        print(f"error: {talk} already exists", file=sys.stderr)
        return 2

    kicker = args.name[11:].replace("_", " ")
    title = args.title or kicker
    slug = args.name.lower().replace("_", "-")
    specs = addon_specs(args.addons_ref)

    for d in ("public/figures", "public/videos", "videos"):
        (talk / d).mkdir(parents=True)
    (talk / "components").symlink_to("../../components", target_is_directory=True)

    scripts = dict(PNPM_SCRIPTS)
    dev_deps = {"slidev-addon-videos": specs["slidev-addon-videos"]}
    if args.stage:
        scripts.update(STAGE_SCRIPTS)
        dev_deps["slidev-addon-stage"] = specs["slidev-addon-stage"]
    (talk / "package.json").write_text(json.dumps({
        "name": f"talk-{slug}",
        "private": True,
        "description": f"{title} ({args.name[:10]})",
        "scripts": scripts,
        "dependencies": {"@slidev/cli": "^52.14.2"},
        "devDependencies": dev_deps,
    }, indent=2, ensure_ascii=False) + "\n")
    (talk / "videos.toml").write_text(VIDEOS_TOML.format(slug=slug))
    (talk / "videos" / "manifest.toml").write_text(MANIFEST.format(slug=slug))
    (talk / ".gitignore").write_text(TALK_GITIGNORE)
    (talk / "CLAUDE.md").write_text(notes(args.name, title, args.lang, args.duration, args.stage, args.broadcast))
    meta = headmatter_meta(args.lang, args.duration)
    if args.stage:
        (talk / "public" / "data").mkdir(parents=True)
        (talk / "public" / "data" / "space.json").write_text(json.dumps(STAGE_SPACE, indent=2, ensure_ascii=False) + "\n")
        (talk / "setup").mkdir()
        (talk / "setup" / "main.ts").write_text(SETUP_MAIN.format())
        (talk / "vite.config.ts").write_text(VITE_CONFIG.format())
        (talk / "deck.md").write_text(STAGE_DECK.format(
            title=title, kicker=kicker, aspect=args.aspect, slug=slug, repo=REPO, meta=meta,
            palette=args.stage, accent=PALETTES[args.stage],
            broadcast=BROADCAST.format() if args.broadcast else ""))
    else:
        (talk / "deck.md").write_text(DECK.format(title=title, aspect=args.aspect, slug=slug, repo=REPO, meta=meta))

    print(f"Scaffolded {talk.relative_to(ROOT)}/" + (f" on the stage ({args.stage})" if args.stage else "")
          + (", broadcast numbers" if args.broadcast else ""))
    print("Next steps:")
    print(f"  talks/{args.name}/CLAUDE.md   # ask the owner the Brief questions, write the answers there")
    print("  pnpm install                # register the workspace + addons (`pnpm talk new` already did)")
    print(f"  pnpm talk dev {worktree_slug(args.name)}")
    if args.stage:
        print("  # the world: public/data/space.json; each slide's `space:` frontmatter steers the camera")
        print("  #   pnpm talk check <name>  after editing either")
        print("  #   pnpm videos:frames      after adding clips (commit public/video-frames/)")
    print("  # own clips: [[videos]] in videos/manifest.toml, raw in ../../videos/raw/, then")
    print("  #   pnpm videos:encode && pnpm videos:publish")
    print("  # look at it: pnpm talk review <name>; before the venue: pnpm talk ready <name>")
    return 0


if __name__ == "__main__":
    sys.exit(main())
