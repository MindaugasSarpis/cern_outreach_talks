#!/bin/sh
# The takes' site: takes.md built with the take code (VITE_TAKES, setup/main.ts) and the take data beside it.
#   takes/build.sh [OUT]     OUT defaults to ${TALK_TMP:-/tmp}/talk-tokyo/takes
# The env's node and pnpm first on PATH (`pnpm talk render -- talks/2026_11_18_Tokyo/takes/build.sh` does that).
set -eu
cd "$(dirname "$0")/.."
OUT="${1:-${TALK_TMP:-/tmp}/talk-tokyo/takes}"
VITE_TAKES=1 pnpm exec slidev build takes.md --base / --out "$OUT"
mkdir -p "$OUT/takes"
cp takes/data/*.json takes/data/*.bin takes/data/*.glb "$OUT/takes/"
echo "takes site: $OUT"
