#!/bin/sh
# git merge driver for pnpm-lock.yaml (.gitattributes: `pnpm-lock.yaml merge=pnpm-lock`).
# A lockfile is never merged as text: git's clean text merge of two lockfiles
# made the next install re-resolve the workspace (Innoday, 2026-10-08:
# @slidev/cli 52.20 and markdown-it 15, a build that failed). Take main's
# lockfile, then `pnpm install` folds this branch's own pins back in.
#   driver: sh scripts/lockfile-merge.sh %O %A %B   (talk.py registers it)
ours="$2"
if git show origin/main:pnpm-lock.yaml > "$ours.main" 2>/dev/null; then
  mv "$ours.main" "$ours"
  echo "pnpm-lock.yaml: took origin/main's; the post-merge hook runs pnpm install (scripts/post-merge.sh), then commit pnpm-lock.yaml." >&2
  exit 0
fi
rm -f "$ours.main"
echo "pnpm-lock.yaml: no origin/main to take it from; left as a conflict (take main's, then pnpm install)." >&2
exit 1
