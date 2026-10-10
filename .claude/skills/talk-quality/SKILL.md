---
name: talk-quality
description: Use when designing, writing, overhauling or judging an outreach talk in the outreach_talks repo, or when the owner asks for a talk to be impressive, spectacular, "like the Startertalk", or reviewed for content, wording, flow or visuals. Points at the house quality bar (docs/talk-quality.md), the spectacle playbook (docs/spectacle.md), the pipeline from brief to deploy and the AFK protocol.
---

# Talk quality

Read [docs/talk-quality.md](../../../docs/talk-quality.md) in full before
designing or judging a talk; it holds the owner's own words, which are the
acceptance criteria. For effects, [docs/spectacle.md](../../../docs/spectacle.md);
for the engine, [docs/STAGE_QUICKSTART.md](../../../docs/STAGE_QUICKSTART.md).

## The pipeline

| Step | How |
|---|---|
| Brief | skill `talk-new` |
| Blueprint | saved workflow `talk-blueprint` (below), or by hand for a short talk |
| Outline | slides with the spoken line, message and pose (no on-screen title); `pnpm talk map <t>` |
| Deck draft | text and notes now; `<!-- facts: id -->` as its own comment before the notes comment, never the slide's last (that one is the notes); `pnpm talk facts search` |
| Research the gaps | skill `talk-research` (saved workflow `talk-research-gaps`) |
| Lint | `pnpm talk lint <t>` |
| Shots and sheet review | skill `talk-verify` (`pnpm talk review <t>`) |
| Unslop pass | lens `unslop` of saved workflow `talk-review` (on by default), or by hand: `python3 -I scripts/talk_copy.py talks/<t> --out /tmp/talk-<slug>-copy.md`, then the `unslop` skill in check mode on that packet; Lithuanian: [docs/unslop-lt.md](../../../docs/unslop-lt.md) |
| Diff-only fact check | saved workflow `talk-review`, facts lens |
| Timing gate | `pnpm talk lint <t>`: notes and clips within `duration` + 5 % |
| Ready | `pnpm talk ready <t>` |
| Deploy | skill `talk-deploy`, under its standing rule |

## Checklist for every slide

- Pictures and numbers only (owner, 2026-10-10): no title, statement, kicker,
  caption or credit on screen, and no title or section slides; the owner
  narrates. Every number carries its unit or a word or two naming what it
  counts (a bare number doesn't read). A thing shown, such as an invention,
  may carry a short caption that names it: a name, never a sentence. Fewer
  words is better: the owner adapts the talk to the audience, and these are
  not lecture slides that must stand on their own. `talk lint` warns `TEXT`
  on any other word.
  The one exception: credits a licence asks for, in tiny print on the last
  slide (CERN's material needs none).
- One claim; one dominant visual; every world object on it maps to a
  sentence in the notes.
- Every number sourced (a facts comment before the notes, sources in the
  notes); nothing unverified.
- Every term and plot introduced before it is used.
- Numbers readable over the world (type floor, dim, no bright detail behind
  them).
- Nothing reads as generated: the unslop pass is clean on the spoken notes
  and anything left on screen (house VOICE wins where they differ).
- Notes carry the spoken script and `(~N min)`.

And for the talk: the opening and close each have an entrance and the hum; one
big move per part; the minutes fit; a new world mechanic was tried on one
sparse and one dense slide before it spread.

## The blueprint workflow

Critique (five lenses) → three blueprints from different angles → three
judges → an editor who writes one blueprint with a slide table, minutes,
style rules, a drop order and a Decisions log. Run it at the start of a talk
that matters, or for an overhaul:

```js
Workflow({ name: 'talk-blueprint', args: {
  talk: 'talks/<t>', repo: '<worktree root>', today: '<YYYY-MM-DD>',
  head: '<HEAD sha>',             // git rev-parse HEAD; keys this run's result files
  duration: 12, lang: 'lt', audience: 'grade 9-12 students, watching a stream',
  delivery: 'broadcast',          // venue | broadcast
  sheets: ['<contact sheets of the current deck, if any>'],
  done: ['critique-rigour', 'blueprint-story-first'],   // only on a re-run, see below
} })
```

(or `<repo>/.claude/workflows/talk-blueprint.js` by path). It writes
`talks/<t>/notes/blueprint.md` and returns `research_gaps`, public claims
with proposed ids. Cite those ids in the deck draft and run `talk-research`
(saved workflow `talk-research-gaps`): its plan agent finds them in the deck,
or pass them as `lanes[].claims`. Never pass them as `briefGaps`, which
searches the owner's own mail, Drive and calendar.

Only the readability critic opens the contact sheets. Effort is set per
stage (`medium` for critiques and judges, `high` for the three blueprints
and the editor; `effort: { judge: 'high' }` overrides one); no model is
pinned (`models: { <stage>: '<model id>' }` is the owner's choice). Each
critique, blueprint and judge writes its result to
`/tmp/talk-blueprint-<slug>/<key>/<id>.json`, where `<key>` is the first 12
characters of `head` (the day, `today`, when no head is given); the result
gives the directory as `run_dir`. If a run stops, resume it by its run id
when you have it; otherwise run it again with the same `head` and with
`done` set to the ids `ls` finds in that directory (`critique-<lens>`,
`blueprint-<angle>`, `judge-<n>`): the stages after them read those files.
Once the blueprint is filed, remove the directory (`rm -r <run_dir>`), as
the result's `next` says, so that no later run reads its files.

Workflows report back when they finish. While one runs, never sleep, read
its journal or open agent transcripts; work on something else or end the
turn. The rest of the waiting rules, the render queue and the image cap
are in `docs/talk-quality.md` §9.

## AFK protocol

After "go", "finish", "afk", "continue to completion" or a hand-off like
it: never block on a question, take the recommended option, log it under
Decisions in `talks/<t>/CLAUDE.md`, finish with the open questions batched
in one message (`docs/talk-quality.md` §6). Pushing to main still needs the
owner's request.

## Hand-off

The blueprint, the outline and the deck draft each end a step
(`docs/talk-quality.md` §8). After each, from the worktree root: write
Status and Decisions in `talks/<t>/CLAUDE.md`, commit the talk's files by
path, push the talk's branch (never main), and update this session's line in
`$OUTREACH_STATE/status.md`
(`name | branch | toolkit pin | doing | blocked on | next`):

```bash
python3 -I .claude/skills/talk-quality/status_line.py <slug> --doing "…" --blocked "…" --next "…"
```
