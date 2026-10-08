#!/usr/bin/env bash
# Put the Playwright browsers this checkout pins onto the node's own disk, for
# `pnpm talk render` (talk.py passes PLAYWRIGHT_BROWSERS_PATH to a job only on
# a node that has all of them). Playwright's own installer stalls extracting
# onto the NFS home, so the zips are fetched once into a shared cache and
# unpacked here with unzip. Run it on every render node, and again after a
# toolkit bump:
#
#   srun -p photon_primary --ntasks=1 scripts/playwright-local.sh
#   srun -p gluon_primary  --ntasks=1 scripts/playwright-local.sh
#
# Env: RENDER_BROWSERS (default /var/tmp/$USER/ms-playwright), PW_ZIPS (default
# ~/.cache/pw-zips, on the shared home so the nodes fetch each zip once).
set -euo pipefail
REPO=$(cd "$(dirname "$0")/.." && pwd)
DEST=${RENDER_BROWSERS:-/var/tmp/$USER/ms-playwright}
ZIPS=${PW_ZIPS:-$HOME/.cache/pw-zips}
CDN=https://cdn.playwright.dev
mkdir -p "$DEST" "$ZIPS"

# name revision browserVersion, for every playwright-core in node_modules
mapfile -t WANT < <(python3 -I - "$REPO" <<'EOF'
import glob, json, sys
seen = set()
for f in glob.glob(f"{sys.argv[1]}/node_modules/.pnpm/playwright-core@*/node_modules/playwright-core/browsers.json"):
    for b in json.load(open(f)).get("browsers", []):
        if b.get("name") in ("chromium", "chromium-headless-shell", "ffmpeg"):
            row = (b["name"], b["revision"], b.get("browserVersion", ""))
            if row not in seen:
                seen.add(row)
                print(*row)
EOF
)
[ ${#WANT[@]} -gt 0 ] || { echo "no playwright-core under $REPO/node_modules: run pnpm install first" >&2; exit 2; }

for row in "${WANT[@]}"; do
  read -r name rev ver <<<"$row"
  dir="${name//-/_}-$rev"
  case $name in
    chromium)                url="$CDN/builds/cft/$ver/linux64/chrome-linux64.zip" ;;
    chromium-headless-shell) url="$CDN/builds/cft/$ver/linux64/chrome-headless-shell-linux64.zip" ;;
    ffmpeg)                  url="$CDN/dbazure/download/playwright/builds/ffmpeg/$rev/ffmpeg-linux.zip" ;;
  esac
  if [ -f "$DEST/$dir/INSTALLATION_COMPLETE" ]; then echo "$dir: present"; continue; fi
  zip="$ZIPS/$dir.zip"
  if ! unzip -tq "$zip" >/dev/null 2>&1; then
    curl -sfL -o "$zip.part" "$url"
    unzip -tq "$zip.part" >/dev/null
    mv "$zip.part" "$zip"
  fi
  tmp="$DEST/.$dir.$$"
  mkdir "$tmp"
  unzip -q "$zip" -d "$tmp"
  touch "$tmp/INSTALLATION_COMPLETE"
  mv "$tmp" "$DEST/$dir"          # whole or not at all: a job checks INSTALLATION_COMPLETE
  echo "$dir: installed"
done
echo "$(hostname): $DEST"
