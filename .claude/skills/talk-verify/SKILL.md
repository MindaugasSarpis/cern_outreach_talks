---
name: talk-verify
description: Use before telling the owner a talk in the outreach_talks repo is done or fixed, and whenever slides need checking for how they look, read, time or behave (screenshots, contact sheets, "is everything ok", a review round). Runs pnpm talk lint and review, and has a subagent judge the contact sheets and shots metrics so no screenshots enter the main context.
---

# Verify a talk

The owner should not be the visual QA. In the Startertalk an agent called the
deck "in good shape" and within 40 minutes the owner found four busy or
meaningless slides; the main context read 270 PNGs, grew to 943k tokens and
was compacted.

## 1. Deterministic checks first

```bash
pnpm talk lint <t>             # language, slop, words, type floor, sources, timing, fact ids
pnpm -s talk review <t> --json # check + build into /tmp/talk-<slug>/site + shots --changed --sheet
```

Start `review` with `run_in_background` and fix what lint reports while it
runs; its notification brings the result. Do not poll it. Its `--json`
output gives the shots directory as `.shots` (by default `talks/<t>/shots/`)
and the NDJSON shots report as the `report` of the step named `shots`; the
contact sheet is `sheet.png` in the shots directory. If shots are slow, probe
first: `pnpm talk shots <t> --probe --slides <n>` reports frames per second
and engine seconds per wall second; below 0.5 the deck has a fill-rate
problem, not a waiting problem.

Renders share the machine with other sessions. `pnpm talk shots`, `review`,
`ready`, `record` and `safe` queue for the render slot themselves; any other
headless browser, Playwright capture or ffmpeg encode goes through
`pnpm talk render -- <command>` (srun on Slurm, a job on HTCondor, a lock on a
single machine). Keep runs small (2 to 4 slides) while iterating.

## 2. The visual judgement goes to a subagent

Dispatch one subagent (Agent tool, general-purpose) with this brief; its
text comes back on its own. Never Read a PNG in the main loop, a contact
sheet included: a finding that needs a second look goes back to a subagent,
with the slide named.

```
You review the slides of <talk> for the owner. Read these contact sheets:
<paths>. Read the shots report <ndjson path> (one JSON line per frame:
slide, click, station, overflowPx, pageErrors, wordsOnScreen, textBoxes with
fontPx, lumMean, lumVar). The slide map: <pnpm talk map output>.
Open at most 12 images in all: the contact sheets first, then single frames
(the png of a report line) only for slides a sheet or the report flags.
Calibrate on the owner's own words (docs/talk-quality.md §1, busy and
meaning): "at some angles the screen is too busy with everything and words
are difficult to make out", "slide 20 too busy, barely readable", "the space
doesn't bear any meaning", "isn't clear what they symbolize", "Zweig paper is
just white".
For every slide report, as text only: slide number and title, kind (busy,
illegible, meaning, overexposed, overflow, layout, render), severity (high,
medium, low), what is wrong and the exact fix. Check that every world object
on a slide maps to a sentence or label on it, that text never sits on bright
or busy world detail (high lumVar behind body text), that nothing is near
white (lumMean), that no readable text is under <floor> canvas px, that
mixed-case names are not uppercased (LHCb), and that the lower third of
content slides is clear. Do not praise; list problems only, worst first.
Never let one command block for more than 240 s (a Bash timeout of at most
240000 ms), and never sleep or poll: what would take longer goes back as
an open item.
```

`<floor>` is 18 for a projector talk and 37 for a broadcast (`talk-broadcast`).

Framing goes the same way. A subagent changes the slide's `space:` pose,
reshoots that slide (`pnpm talk shots <t> --slides <n>`, from the worktree
root), looks within the same cap of 12 images, and returns the pose it
settled on and why; the main loop reads its text, checks the diff and
commits. Its brief carries the same rule as the one above: never block one
command for more than 240 s (a Bash timeout of at most 240000 ms). The
shots wait for the render slot while another session renders (a full
recording holds it for half an hour or more), so a reshoot that cannot
start in time comes back as an open item, with the pose untested, never as
a wait.

## 3. A full review

For facts, copy, timing and code together, run the saved workflow
`talk-review` (or `<repo>/.claude/workflows/talk-review.js`). It judges a
pinned snapshot, so pass both SHAs:

```bash
git -C <worktree> rev-parse HEAD
git -C <worktree> stash create       # prints a SHA when the tree is dirty, nothing when clean
```

```js
Workflow({ name: 'talk-review', args: {
  talk: 'talks/<t>', repo: '<worktree root>', head: '<HEAD sha>',
  snapshot: '<stash sha, or the HEAD sha>', site: '/tmp/talk-<slug>/site',
  today: '<YYYY-MM-DD>', lang: 'en', duration: 30,
  sheets: ['<sheet paths>'], ndjson: '<report path>',
  since: '<HEAD sha of the last review, from notes/review.md>',   // facts lens checks only what changed
  done: ['facts'],   // only on a re-run of the same snapshot: lenses that finished
} })
```

Effort is set per stage in the template (`medium` for reviewers and
verifiers, `high` for the facts verifier; `effort: { review: 'high' }`
overrides one); no model is pinned (`models: { <stage>: '<model id>' }` is
the owner's choice). Each finished lens writes its findings with their
verdicts to `/tmp/talk-review-<slug>/<first 12 characters of the snapshot
SHA>/<lens>.json`. If a run stops, resume it by its run id when you have
it; otherwise run it again on the same snapshot with `done` set to the
lenses `ls` finds there, and merge their files into `notes/review.md` with
the new result.

The run reports back when it finishes: do not sleep, read its journal or open
agent transcripts meanwhile; fix the lint findings or end the turn. It
returns `kept[]` (verified findings with exact fixes, deduped by slide and
kind) and `unverified[]`. Write `talks/<t>/notes/review.md` from the result,
with both SHAs at the top (the HEAD SHA is the next review's `since`; a
stash SHA is not kept by git for long),
apply the fixes against the current text (the snapshot may be older), and
report `unverified[]` to the owner.

## 4. After fixing

Run `pnpm talk review <t>` again (it reshoots only changed slides) and
`pnpm talk map <t>` after any structural change. The end-of-turn summary
carries the commands run and their results, failures included
(`docs/talk-quality.md` §7).

## Hand-off

Once `notes/review.md` is written and its fixes are in
(`docs/talk-quality.md` §8), from the worktree root: write Status, with the
review's HEAD SHA (the next review's `since`), and Decisions in
`talks/<t>/CLAUDE.md`, commit the talk's files by path, push the talk's
branch (never main), and update this session's line in
`$OUTREACH_STATE/status.md`
(`name | branch | toolkit pin | doing | blocked on | next`):

```bash
python3 -I .claude/skills/talk-quality/status_line.py <slug> --doing "…" --blocked "…" --next "…"
```
