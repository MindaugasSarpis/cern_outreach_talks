# `videos:clean` — space-saving cleanup of local video tiers

**Date:** 2026-07-17
**Status:** Approved design, pending implementation plan

## Problem

Local video tiers eat disk fast: raws (`videos/raw/`, multi-GB masters,
e.g. Yaga's 12.6 GB) and HQ venue masters (`videos/hq/`, another 5+ GB
per talk). All of it is reproducible — raws live on the gdrive remote,
HQ masters on the parallel `videos-hq-*` GH Release — so after a talk
ships (or between rehearsals) the local copies are pure cache. There is
currently no safe way to reclaim that space: manual `rm` has no check
that the remote copy actually exists.

## Goal

A per-talk command that deletes local raw + HQ (optionally web) files
**only when a verified remote copy guarantees cheap reproduction**, and
tells the user exactly how to get each file back.

## Non-goals

- Uploading anything. The gdrive remote is read-only from this machine;
  GH publishing stays in `publish` / `publish-hq`.
- Cleaning unmanaged files. Anything not traceable to the talk manifest
  or the shared registry is reported, never touched.
- Repo-wide sweeps. Like every other pipeline command it runs from a
  talk directory; run it per talk.

## Command surface

New subcommand in `scripts/videos.py` (reuses its manifest parser,
rclone listing, and `gh` release-asset queries):

```
pnpm videos:clean                 # dry-run, raw + hq tiers (default)
pnpm videos:clean -- --yes        # actually delete
pnpm videos:clean -- --raw        # restrict to one tier (likewise --hq, --web)
pnpm videos:clean -- --web        # web tier is opt-in only
pnpm videos:clean -- --include-shared   # also local copies of shared-registry clips
```

- **Dry-run is the default.** Without `--yes` nothing is deleted; the
  command prints what would happen.
- Tier flags compose; naming any tier flag restricts cleaning to the
  named tiers. Default (no tier flags) = `--raw --hq`.
- `videos:clean` pnpm alias added to each talk's `package.json`;
  documented in CLAUDE.md next to the other `videos:*` commands.

## Safety rules (what is deletable)

| Tier | File class | Deletable when |
|------|-----------|----------------|
| raw | any manifest entry | size-matched copy on `[defaults].source_remote` (rclone) |
| hq | talk-owned | size-matched asset on the talk's `release_tag_hq` release |
| hq | `hq_from_raw = true` | raw verified on `source_remote` (the HQ file is a hard link of the raw) |
| hq | shared clip (`--include-shared`) | size-matched asset on the shared `release_tag_hq` (from `/videos/shared.toml`) |
| web (`--web`) | talk-owned | size-matched asset on the talk's `release_tag` |
| web (`--web`) | shared clip (`--include-shared`) | size-matched asset on the shared `release_tag` |

Everything else is **skipped with a printed reason**: missing on
remote, size mismatch, release unreachable, or unmanaged file. A remote
that can't be listed (rclone error, `gh` failure) disables deletion for
every file that depends on it — verification failure is never treated
as absence.

Size match is the same criterion `publish`/`pull` already use for
idempotence, so a file that round-trips through the pipeline verifies
cleanly.

## Mechanics

- Remote inventories are fetched **once per remote/tag** (one rclone
  listing, one `gh release view` per tag), then all files are judged
  against the in-memory inventory.
- **Hard-link awareness:** `hq_from_raw` files share an inode between
  `videos/raw/` and `videos/hq/`. Deleting one link frees nothing;
  reported "bytes reclaimed" counts an inode only when its last local
  link is removed.
- Web tier operates on `public/videos/`; HQ on `videos/hq/` (the real
  directory behind the `public/videos-hq` symlink); raw on `videos/raw/`.
- Output: one row per candidate (tier, name, size, verdict —
  `DELETE via <recovery path>` or `SKIP <reason>`), then totals:
  reclaimable bytes, skipped count. After a `--yes` run, the actual
  freed total.
- Footer prints the recovery commands: `pnpm videos:sync` (raws),
  `pnpm videos:pull-hq [-- --include-shared]` (masters),
  `pnpm videos:pull [-- --include-shared]` (web).
- Exit code 0 on success (including "nothing deletable"); non-zero on
  hard errors (bad flags, unreadable manifest) or when a `--yes` run
  failed to delete a file it planned to.

## Error handling

- rclone/`gh` unavailable or failing → warn, mark affected tier
  non-deletable, continue with the rest.
- Deletion failures (permissions, vanished file) → report per file,
  continue with remaining files, exit non-zero at the end.
- Never delete on a stale plan: the `--yes` run re-verifies (re-stats
  local files) before each unlink.

## Testing

The deletable/skip decision is factored into a pure planning function
(local file stats + remote inventories in, per-file verdicts out) so it
can be unit-tested without network: `scripts/tests/test_clean_plan.py`
via `python3 -m unittest`, covering size mismatch, missing remote,
`hq_from_raw` hard links, shared-clip routing, and unmanaged files.
Manual verification against the Yaga talk (dry-run before/after
`publish-hq`) completes the loop.

## Consequences / prerequisites

- Strict HQ policy means a talk's masters are only cleanable after
  `publish-hq` has run for it. For Yaga specifically, `lt_zoom.mov`'s
  HQ master may exceed the 2 GB GH asset cap — resolve via
  `hq_from_raw = true` (raw is on gdrive) or a higher `hq_crf` before
  its master becomes cleanable.
- Local copies of shared clips remain protected by default (consistent
  with `--prune` semantics); `--include-shared` is the explicit opt-in.
- `--include-shared` covers only the web/HQ tiers of shared clips. Raws
  of shared-registry clips (present in the shared-host talk's `raw/`,
  e.g. editAI) are not listed in that talk's own manifest, so `clean`
  treats them as unmanaged and never deletes them.
