---
name: talk-deploy
description: Use only when the owner explicitly asks to deploy, publish, push or put a talk in the outreach_talks repo live on GitHub Pages. Runs pnpm talk ready and pnpm talk deploy from the talk's worktree and reports deployed only after the Pages run is green and the URL answers.
---

# Deploy a talk

The deploy model is the owner's existing one: a push to `main` triggers the
Pages workflow, which builds every talk. Nothing deploys unless the owner asked
for it in this conversation ("deploy", "push", "publish", "put it live", or a
hand-off such as "finish and push"). A plain "finish" or "afk" is not a deploy
request; under the AFK protocol the talk is left ready and the deploy is listed
as an open question.

## Steps

```bash
pnpm talk ready <t>               # lint --release + check + shots + videos:preflight + venue --dry-run, one exit code
pnpm talk deploy <t> --dry-run    # what would be pushed, and the checks it will make
pnpm talk deploy <t>              # push HEAD to main, watch the Pages run, check the URL
pnpm talk status --json           # every talk's recorded deploy state, under deploys[]
```

Run them from the talk's own worktree. `deploy`:

- refuses a dirty tree and a branch that does not contain `origin/main`
  (it prints the rebase command);
- runs `ready` first unless told to skip it;
- pushes `HEAD` to `main`, watches the Pages run and requests the talk's URL;
- records the result in `talk-status/<slug>.json` in the shared git directory
  (the main checkout's `.git`), not in a tracked file, so a deploy never leaves a
  dirty tree or triggers a second run. `status` takes no talk name: read the
  entry whose `talk` is this one.

Say "deployed" only after the run is green and the URL returned 200, and give
the URL, the commit and the run id. Let the watch run in the background and
keep working.

## When it refuses

- **Dirty tree**: commit the talk's own files (`git add` by path, never
  `git add -A` at the root, never `git stash`).
- **Behind origin/main**: rebase the talk branch in its worktree as printed.
  On a `pnpm-lock.yaml` conflict take main's version and run `pnpm install`;
  never hand-merge the lockfile. Then `ready` again.
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

After the green run and the 200 (`docs/talk-quality.md` §8): write Status,
with the URL, the deployed commit and the run id, and Decisions in
`talks/<t>/CLAUDE.md`, commit the talk's files by path, and update this
session's line in `$OUTREACH_STATE/status.md`
(`name | branch | toolkit pin | doing | blocked on | next`):

```bash
python3 -I .claude/skills/talk-quality/status_line.py <slug> --doing "…" --blocked "…" --next "…"
```
