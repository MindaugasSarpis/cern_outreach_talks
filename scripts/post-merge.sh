#!/bin/sh
# git post-merge and post-rewrite hook (talk.py installs it beside the lockfile
# merge driver). The driver takes main's pnpm-lock.yaml as it is, so after a
# merge or rebase that brought in a lockfile or a package.json the worktree's
# node_modules and lockfile can disagree with its pins until someone reinstalls
# (Užsikrauk karjerai, 2026-10-09: main's lockfile, byte for byte, still named
# the talk at v0.5.0 while its package.json pinned e5d05a9). Reinstall at once,
# and say what to commit.
#   post-merge: $1 = 1 for a squash merge · post-rewrite: $1 = amend | rebase
[ "${1:-}" = amend ] && exit 0
changed=$(git diff --name-only ORIG_HEAD HEAD 2>/dev/null) || exit 0
printf '%s\n' "$changed" | grep -Eq '(^|/)(pnpm-lock\.yaml|package\.json)$' || exit 0
say() { echo "talk hook: $*" >&2; }
if ! command -v pnpm >/dev/null 2>&1; then
  say "pnpm-lock.yaml or a package.json changed, and pnpm is not on PATH: run pnpm install, then commit pnpm-lock.yaml"
  exit 0
fi
say "pnpm-lock.yaml or a package.json changed; pnpm install"
if pnpm install >&2; then
  if [ -n "$(git status --porcelain -- pnpm-lock.yaml)" ]; then
    say "pnpm-lock.yaml now records this branch's pins: commit it"
    say "  git add pnpm-lock.yaml && git commit -m 'chore: pnpm-lock.yaml reinstalled after the merge'"
  fi
else
  say "pnpm install failed: fix it, then commit pnpm-lock.yaml (talk ready and talk deploy refuse a lockfile that does not record the pins)"
fi
exit 0
