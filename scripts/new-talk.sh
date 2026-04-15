#!/usr/bin/env bash
# Scaffold a new talk under talks/<name>/.
#
# Usage:  scripts/new-talk.sh YYYY_MM_DD_ShortName
#
# Creates the directory structure, symlinks shared components, writes a
# minimal deck.md / .env / package.json / manifest.toml.

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 YYYY_MM_DD_ShortName" >&2
  exit 2
fi

NAME="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/talks/$NAME"

if [[ -e "$DIR" ]]; then
  echo "error: $DIR already exists" >&2
  exit 1
fi

SLUG="$(echo "$NAME" | tr '[:upper:]_' '[:lower:]-')"
PKG_NAME="talk-$SLUG"
RELEASE="videos-$SLUG"
RELEASE_HQ="videos-hq-$SLUG"

REPO_SLUG="$(cd "$ROOT" && git remote get-url github 2>/dev/null \
  | sed -E 's#.*github\.com[:/](.+)(\.git)?$#\1#; s#\.git$##' \
  || echo 'OWNER/REPO')"

mkdir -p "$DIR"/{public/figures,videos/raw,slides}
ln -s ../../components "$DIR/components"

cat > "$DIR/.env" <<EOF
VITE_VIDEO_REPO=$REPO_SLUG
VITE_VIDEO_RELEASE=$RELEASE
VITE_VIDEO_RELEASE_HQ=$RELEASE_HQ
EOF

cat > "$DIR/package.json" <<EOF
{
  "name": "$PKG_NAME",
  "private": true,
  "description": "TODO: describe this talk",
  "scripts": {
    "dev": "slidev deck.md",
    "build": "slidev build deck.md",
    "export": "slidev export deck.md",
    "videos:sync": "python3 ../../scripts/videos.py sync",
    "videos:encode": "python3 ../../scripts/videos.py encode",
    "videos:publish": "python3 ../../scripts/videos.py publish",
    "videos:check": "python3 ../../scripts/videos.py check",
    "videos:link-hq": "python3 ../../scripts/videos.py link-hq",
    "videos:publish-hq": "python3 ../../scripts/videos.py publish-hq"
  },
  "dependencies": {
    "@slidev/cli": "^52.14.2"
  }
}
EOF

cat > "$DIR/deck.md" <<'EOF'
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/10
canvasWidth: 1280
title: TODO
layout: cover
background: /figures/background_intro.jpg
---

# Title

## Subtitle
EOF

cat > "$DIR/videos/manifest.toml" <<'EOF'
# Global defaults live in /outreach.toml. Only override what's
# talk-specific here, or per-video on a [[videos]] block.
#
# Profiles: remux | standard | standard-tight | silent-loop | high-motion

[defaults]
source_remote = "gdrive:TODO/path/to/raw"

# [[videos]]
# name    = "Example.mp4"
# profile = "remux"
# used_in = ["deck"]
EOF

echo "Created talks/$NAME/"
echo "Next:"
echo "  1. Drop public/figures/background_intro.jpg (or change the background path)"
echo "  2. Edit $DIR/videos/manifest.toml to point at your rclone remote"
echo "  3. pnpm install"
echo "  4. cd talks/$NAME && pnpm dev"
