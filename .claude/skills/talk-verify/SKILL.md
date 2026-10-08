---
name: talk-verify
description: Use before telling the owner a talk in ~/outreach_talks is done or fixed, and whenever slides need checking for how they look, read, time or behave (screenshots, contact sheets, "is everything ok", a review round). Runs pnpm talk lint and review, and has a subagent judge the contact sheets and shots metrics so no screenshots enter the main context.
---

# Verify a talk

The owner should not be the visual QA. In the Startertalk an agent called the
deck "in good shape" and within 40 minutes the owner found four busy or
meaningless slides; the main context read 270 PNGs, grew to 943k tokens and
was compacted.

## 1. Deterministic checks first

```bash
pnpm talk lint <t>             # language, slop, words, type floor, sources, timing, fact ids
pnpm talk review <t> --json    # check + build into /tmp/talk-<slug>/site + shots --changed --sheet
```

Fix what lint reports before anyone looks at pictures. The `--json` output of
`review` names the contact sheets and the NDJSON shots report (by default
under `talks/<t>/shots/`). If shots are slow, probe first:
`pnpm talk shots <t> --probe --slides <n>` reports frames per second and
engine seconds per wall second; below 0.5 the deck has a fill-rate problem,
not a waiting problem.

Headless browsers share the CPU with other sessions: any direct run of a
shots, record or safe tool goes through `flock /tmp/slidev-stage-shots.lock`,
with small runs (2 to 4 slides) while iterating.

## 2. The visual judgement goes to a subagent

Dispatch one subagent (Agent tool, general-purpose) with this brief and wait
for its text. Do not Read the PNGs yourself; open at most one sheet when a
specific finding needs a second look.

```
You review the slides of <talk> for the owner. Read these contact sheets:
<paths>. Read the shots report <ndjson path> (one JSON line per frame:
slide, click, station, overflowPx, pageErrors, wordsOnScreen, textBoxes with
fontPx, lumMean, lumVar). The slide map: <pnpm talk map output>.
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
```

`<floor>` is 18 for a projector talk and 37 for a broadcast (`talk-broadcast`).

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
} })
```

It returns `kept[]` (verified findings with exact fixes, deduped by slide and
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
