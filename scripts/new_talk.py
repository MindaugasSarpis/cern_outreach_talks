#!/usr/bin/env python3
"""Scaffold a new talk under talks/<YYYY_MM_DD_Name>/ on the slidev-videos workflow.

Bakes in the standing policy (since 2026-07-18): 1080p H.264 web tier with
loudness normalization, 16:9, library clips inherited by name, no HQ tier.

Usage (from the repo root):
    pnpm new-talk 2026_09_15_SomeVenue [--title "Talk title"] [--aspect 16/9]
    pnpm install        # afterwards, to register the workspace + addon
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAME_RE = re.compile(r"^\d{4}_\d{2}_\d{2}_\w+$")
ADDON_SPEC = "github:MindaugasSarpis/slidev-videos#v0.3.2"
REPO = "MindaugasSarpis/cern_outreach_talks"

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


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("name", help="talk directory name, e.g. 2026_09_15_SomeVenue")
    parser.add_argument("--title", default=None, help="deck title (default: derived from name)")
    parser.add_argument("--aspect", default="16/9", help="slide aspect ratio (default 16/9)")
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

    title = args.title or args.name[11:].replace("_", " ")
    slug = args.name.lower().replace("_", "-")

    for d in ("public/figures", "public/videos", "videos"):
        (talk / d).mkdir(parents=True)
    (talk / "components").symlink_to("../../components", target_is_directory=True)

    (talk / "package.json").write_text(json.dumps({
        "name": f"talk-{slug}",
        "private": True,
        "description": f"{title} ({args.name[:10]})",
        "scripts": PNPM_SCRIPTS,
        "dependencies": {"@slidev/cli": "^52.14.2"},
        "devDependencies": {"slidev-addon-videos": ADDON_SPEC},
    }, indent=2, ensure_ascii=False) + "\n")
    (talk / "videos.toml").write_text(VIDEOS_TOML.format(slug=slug))
    (talk / "videos" / "manifest.toml").write_text(MANIFEST.format(slug=slug))
    (talk / "deck.md").write_text(DECK.format(title=title, aspect=args.aspect, slug=slug, repo=REPO))

    print(f"Scaffolded {talk.relative_to(ROOT)}/")
    print("Next steps:")
    print("  pnpm install                # register the workspace + addon")
    print(f"  cd talks/{args.name} && pnpm dev")
    print("  # own clips: [[videos]] in videos/manifest.toml, raw in ../../videos/raw/, then")
    print("  #   pnpm videos:encode && pnpm videos:publish")
    print("  # before the talk: pnpm videos:check && pnpm videos:preflight && pnpm venue")
    return 0


if __name__ == "__main__":
    sys.exit(main())
