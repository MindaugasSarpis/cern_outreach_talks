#!/usr/bin/env python3
"""Scaffold a new talk under talks/<YYYY_MM_DD_Name>/ on the slidev-videos workflow.

Bakes in the standing policy (since 2026-07-18): 1080p H.264 web tier with
loudness normalization, 16:9, library clips inherited by name, no HQ tier.

Usage (from the repo root):
    pnpm new-talk 2026_09_15_SomeVenue [--title "Talk title"] [--aspect 16/9]
    pnpm new-talk 2026_10_00_Keynote --stage blue      # told inside the 3D stage
    pnpm install        # afterwards, to register the workspace + addons

--stage [palette] scaffolds a talk that lives in slidev-addon-stage's
persistent 3D world (classic | blue | ember): a cover on the hero station, a
section in the dust, clips that arrive and leave as particles, a starter
public/data/space.json and the `stage:check` / `videos:frames` scripts.
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
ADDONS_REF = "v0.4.0"
ADDONS_REPO = "github:MindaugasSarpis/slidev-videos"
REPO = "MindaugasSarpis/cern_outreach_talks"
PALETTES = {"classic": "#7dd3fc", "blue": "#5b93ff", "ember": "#ffb168"}   # name -> accent (the dust of a clip in flight)


def addon_specs(ref: str) -> dict[str, str]:
    return {
        "slidev-addon-videos": f"{ADDONS_REPO}#{ref}",
        "slidev-addon-stage": f"{ADDONS_REPO}#{ref}&path:/packages/stage",
    }


PNPM_SCRIPTS = {
    "dev": "slidev deck.md",
    "build": "slidev build deck.md",
    "build:portable": "slidev build deck.md --base ./ --out dist-portable",
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
STAGE_SCRIPTS = {
    "videos:frames": "slidev-videos frames",
    "stage:check": "slidev-stage-check .",
    "stage:shots": "slidev-stage-shots dist shots",
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
---

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
title: {title}
layout: cover
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


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("name", help="talk directory name, e.g. 2026_09_15_SomeVenue")
    parser.add_argument("--title", default=None, help="deck title (default: derived from name)")
    parser.add_argument("--aspect", default="16/9", help="slide aspect ratio (default 16/9)")
    parser.add_argument("--stage", nargs="?", const="classic", default=None, choices=sorted(PALETTES),
                        metavar="PALETTE", help="tell the talk inside the 3D stage; palette: " + " | ".join(sorted(PALETTES)))
    parser.add_argument("--addons-ref", default=ADDONS_REF, dest="addons_ref",
                        help=f"slidev-videos tag, branch or commit for the addons (default {ADDONS_REF})")
    args_list = list(sys.argv[1:] if argv is None else argv)
    if args_list[:1] == ["--"]:  # pnpm forwards the -- delimiter verbatim
        del args_list[0]
    args = parser.parse_args(args_list)

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
    if args.stage:
        (talk / "public" / "data").mkdir(parents=True)
        (talk / "public" / "data" / "space.json").write_text(json.dumps(STAGE_SPACE, indent=2, ensure_ascii=False) + "\n")
        (talk / "deck.md").write_text(STAGE_DECK.format(
            title=title, kicker=kicker, aspect=args.aspect, slug=slug, repo=REPO,
            palette=args.stage, accent=PALETTES[args.stage]))
    else:
        (talk / "deck.md").write_text(DECK.format(title=title, aspect=args.aspect, slug=slug, repo=REPO))

    print(f"Scaffolded {talk.relative_to(ROOT)}/" + (f" on the stage ({args.stage})" if args.stage else ""))
    print("Next steps:")
    print("  pnpm install                # register the workspace + addons")
    print(f"  cd talks/{args.name} && pnpm dev")
    if args.stage:
        print("  # the world: public/data/space.json; each slide's `space:` frontmatter steers the camera")
        print("  #   pnpm stage:check        after editing either")
        print("  #   pnpm videos:frames      after adding clips (commit public/video-frames/)")
    print("  # own clips: [[videos]] in videos/manifest.toml, raw in ../../videos/raw/, then")
    print("  #   pnpm videos:encode && pnpm videos:publish")
    print("  # before the talk: pnpm videos:check && pnpm videos:preflight && pnpm venue")
    return 0


if __name__ == "__main__":
    sys.exit(main())
