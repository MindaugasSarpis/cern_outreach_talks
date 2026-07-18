#!/usr/bin/env python3
"""Scaffold a new talk under talks/<YYYY_MM_DD_Name>/.

Bakes in the post-Yaga (2026-07-18) defaults so they can't be inherited
wrongly from a cloned deck: 1080p H.264 web-tier encodes with loudness
normalization, 16:9, no venue-native HQ masters unless explicitly opted in.

Usage (from the repo root):
    pnpm new-talk 2026_09_15_SomeVenue [--title "Talk title"] [--aspect 16/9]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAME_RE = re.compile(r"^\d{4}_\d{2}_\d{2}_\w+$")

PNPM_SCRIPTS = {
    "dev": "slidev deck.md",
    "build": "slidev build deck.md",
    "build:portable": "slidev build deck.md --base ./ --out dist-portable",
    "export": "slidev export deck.md",
    "videos:sync": "python3 ../../scripts/videos.py sync",
    "videos:encode": "python3 ../../scripts/videos.py encode",
    "videos:publish": "python3 ../../scripts/videos.py publish",
    "videos:pull": "python3 ../../scripts/videos.py pull",
    "videos:check": "python3 ../../scripts/videos.py check",
    "videos:encode-hq": "python3 ../../scripts/videos.py encode-hq",
    "videos:publish-hq": "python3 ../../scripts/videos.py publish-hq",
    "videos:pull-hq": "python3 ../../scripts/videos.py pull-hq",
    "videos:clean": "python3 ../../scripts/videos.py clean",
    "videos:preflight": "python3 ../../scripts/videos.py preflight",
    "venue": "python3 ../../scripts/videos.py venue",
}

MANIFEST_TEMPLATE = """\
# Talk-OWNED video assets for this talk. Clips inherited from the shared
# registry (/videos/shared.toml) are NOT listed here; they stream at runtime
# from the videos-shared GH Release via VideoPlayer's fallback chain.
#
# POLICY (since 2026-07-18): venues play the 1080p H.264 web tier.
#   - long_edge_px stays at the global 1920 — do NOT bump it to the venue's
#     native width unless explicitly decided for this talk.
#   - No encode-hq/publish-hq by default; leave videos/hq/ empty.
#   - Web encodes are loudness-normalized to -16 LUFS (EBU R128) so audio is
#     even across clips; opt a clip out with `loudnorm = false`.
#   - Run `pnpm videos:preflight` before the talk: it probes exactly what
#     each slide will serve and flags codec/bitrate/resolution/loudness
#     problems (this is the check that would have caught the Yaga freezes).
#
# Profiles (in scripts/videos.py):
#   remux          - lossless stream copy + faststart (already web-friendly H.264).
#   standard       - web H.264 CRF 23 (<=6 Mbps), AAC 128k.
#   standard-tight - web H.264 CRF 26 (<=3.5 Mbps) for long clips.
#   silent-loop    - web H.264 CRF 24 (<=5 Mbps), audio stripped. Loops.
#   high-motion    - web H.264 CRF 22 (<=8 Mbps), AAC 192k. Sims/CGI/fast.

[defaults]
source_remote = "gdrive:work/outreach/resources/videos/released"  # ALL lowercase

# release_tag auto-derives from the talk dirname.
# long_edge_px / web_long_edge_px / max_size_mb inherited from /outreach.toml.

# [[videos]]
# name    = "example_clip.mp4"
# profile = "standard"
# notes   = "What this clip is and where it came from."
"""

DECK_TEMPLATE = """\
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: {aspect}
title: {title}
---

# {title}

First slide.

---
layout: section
hideInToc: true
---

# Section
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

    for d in ("slides", "public/figures", "public/videos", "videos/raw", "videos/hq"):
        (talk / d).mkdir(parents=True)
    (talk / "components").symlink_to("../../components", target_is_directory=True)
    (talk / "public" / "videos-hq").symlink_to("../videos/hq", target_is_directory=True)

    (talk / "package.json").write_text(json.dumps({
        "name": f"talk-{slug}",
        "private": True,
        "description": f"{title} ({args.name[:10]})",
        "scripts": PNPM_SCRIPTS,
        "dependencies": {"@slidev/cli": "^52.14.2"},
    }, indent=2) + "\n")

    (talk / ".env").write_text(
        "VITE_VIDEO_REPO=MindaugasSarpis/cern_outreach_talks\n"
        f"VITE_VIDEO_RELEASE=videos-{slug}\n"
        "VITE_VIDEO_SHARED_RELEASE=videos-shared\n"
    )
    (talk / "videos" / "manifest.toml").write_text(MANIFEST_TEMPLATE)
    (talk / "deck.md").write_text(DECK_TEMPLATE.format(title=title, aspect=args.aspect))

    print(f"Scaffolded {talk.relative_to(ROOT)}/")
    print("Next steps:")
    print("  pnpm install                # register the new workspace")
    print(f"  cd talks/{args.name} && pnpm dev")
    print("  # add clips: [[videos]] in videos/manifest.toml, then")
    print("  #   pnpm videos:sync && pnpm videos:encode && pnpm videos:publish")
    print("  # before the talk: pnpm videos:preflight && pnpm venue")
    return 0


if __name__ == "__main__":
    sys.exit(main())
