---
name: talk-deploy
description: Use when a talk in the outreach_talks repo should go live on GitHub Pages, under the owner's standing deploy rule (talk ready passed with nothing skipped and the Scheduler gave main) or when the owner asks to deploy, publish or push. Runs pnpm talk ready and pnpm talk deploy from the talk's worktree and reports deployed only after the Pages run is green and the URL answers.
---

# Deploy a talk

The deploy model is the owner's existing one: a push to `main` triggers the
Pages workflow, which builds every talk.

**Standing rule (owner, 2026-10-09).** A talk session deploys without asking
once `pnpm talk ready` has passed on the commit with nothing skipped and the
Scheduler has given it `main` (pushes to `main` stay one at a time). It reports
the Pages run and the URL's status afterwards. A deploy that needs a skipped
step (`--ready-skip`, `--skip-ready`), or that comes without the Scheduler's
go, still needs the owner's own word in this conversation ("deploy", "push",
"publish", "put it live", or a hand-off such as "finish and push").

## Steps

```bash
pnpm talk ready <t>               # lint --release + check + shots + pages + videos:preflight + venue --dry-run, one exit code
pnpm talk deploy <t> --dry-run    # what would be pushed, and the checks it will make
pnpm talk deploy <t>              # push HEAD to main, watch the Pages run, check the URL
pnpm talk status --json           # every talk's recorded deploy state, under deploys[]
```

Run them from the root of the talk's own worktree (the path
`pnpm talk open <name>` prints). `deploy`:

- refuses a dirty tree, untracked files included, and a branch that does
  not contain `origin/main`;
- runs `ready` first, unless `ready` already passed this commit on a clean
  tree (it stamps it) or it is told to skip it, so run `deploy` straight
  after `ready`, with no commit between them;
- pushes `HEAD` to `main`, watches the Pages run and requests the talk's URL;
- then walks the live deck headless (scripts/pages_check.mjs) and fails on
  any request that fails (release clips aside) or a lost WebGL context:
  "deployed, but the live deck fails" is a failed deploy to fix;
- records the result in `talk-status/<slug>.json` in the shared git directory
  (the main checkout's `.git`), not in a tracked file, so a deploy never
  leaves a dirty tree or triggers a second run. `status` takes no talk name:
  read the entry whose `talk` is this one.

`ready` and `deploy` each run for minutes: start them with
`run_in_background` and keep working; the notification brings the result.
`deploy` watches the Pages run itself, so never poll the run in a loop of
your own. Say "deployed" only after the run is green and the URL returned
200, and give the URL, the commit and the run id.

`ready`'s **pages** step builds the talk with the Pages base, serves it under
`/cern_outreach_talks/<talk>/` with nothing at the root, and walks every slide:
an asset written `/figures/…` that a component does not resolve against the
base fails there, as it does on Pages.

## When it refuses

- **Dirty tree**: commit the talk's own files and the shared files the
  steps changed (`git add` by path, `docs/talk-quality.md` §8; never
  `git add -A` at the root, never `git stash`).
- **Behind origin/main**: merge it into the talk branch in its worktree
  (`git fetch origin && git merge origin/main`). The CLI prints a rebase,
  but the branch is pushed, and a rebased branch needs a force push. On a
  `pnpm-lock.yaml` conflict take main's version
  (`git checkout origin/main -- pnpm-lock.yaml`), run `pnpm install` and add
  it; never hand-merge the lockfile. Then `ready` again. A merge or rebase
  that brings in a lockfile or a package.json runs `pnpm install` by itself
  (the post-merge hook `talk` installs, scripts/post-merge.sh); commit
  `pnpm-lock.yaml` when it says so. `ready` and `deploy` refuse a lockfile
  that does not record the talk's pins.
- **ready fails**: fix and rerun. `--skip-ready` only on the owner's word, and
  say so in the summary.

## Never

- touch the main checkout (`$OUTREACH_ROOT`, the first entry of
  `git worktree list`, stays on `main` for other sessions), switch its
  branch, or merge another talk's branch;
- force-push, or push anything other than the talk's own commits;
- publish or prune video release assets as part of a deploy (`talk-videos`);
- write "deployed" into a memory note, the talk's CLAUDE.md or a summary
  before the run is green.

## Hand-off

After the green run and the 200 (`docs/talk-quality.md` §8), from the
worktree root: write Status, with the URL, the deployed commit and the run
id, and Decisions in `talks/<t>/CLAUDE.md`, commit the talk's files by path,
push the talk's branch (`git push -u origin HEAD`; `deploy` itself is the
only push to main), and update this session's line in
`$OUTREACH_STATE/status.md`
(`name | branch | toolkit pin | doing | blocked on | next`):

```bash
python3 -I .claude/skills/talk-quality/status_line.py <slug> --doing "…" --blocked "…" --next "…"
```
