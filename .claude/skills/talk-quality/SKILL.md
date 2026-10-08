---
name: talk-quality
description: Use when designing, writing, overhauling or judging an outreach talk in ~/outreach_talks, or when the owner asks for a talk to be impressive, spectacular, "like the Startertalk", or reviewed for content, wording, flow or visuals. Points at the house quality bar (docs/talk-quality.md), the spectacle playbook (docs/spectacle.md), the pipeline from brief to deploy and the AFK protocol.
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
| Outline | slides with title, message and pose; `pnpm talk map <t>` |
| Deck draft | text and notes now; `<!-- facts: id -->` as its own comment before the notes comment, never the slide's last (that one is the notes); `pnpm talk facts search` |
| Research the gaps | skill `talk-research` (saved workflow `talk-research-gaps`) |
| Lint | `pnpm talk lint <t>` |
| Shots and sheet review | skill `talk-verify` (`pnpm talk review <t>`) |
| Diff-only fact check | saved workflow `talk-review`, facts lens |
| Timing gate | `pnpm talk lint <t>`: notes and clips within `duration` + 5 % |
| Ready | `pnpm talk ready <t>` |
| Deploy | skill `talk-deploy`, only on the owner's request |

## Checklist for every slide

- One claim; a plain title of six words or fewer; at most 60 words on screen.
- One dominant visual; every world object on it maps to a sentence or label
  on the slide.
- Every number sourced (`.src`, a facts comment before the notes); nothing
  unverified.
- Every term and plot introduced before it is used.
- Readable over the world (type floor, dim, no bright detail behind text).
- Notes carry the spoken script and `(~N min)`.

And for the talk: the cover and close each have an entrance and the hum; one
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
  duration: 12, lang: 'lt', audience: 'grade 9-12 students, watching a stream',
  delivery: 'broadcast',          // venue | broadcast
  sheets: ['<contact sheets of the current deck, if any>'],
} })
```

(or `<repo>/.claude/workflows/talk-blueprint.js` by path). It writes
`talks/<t>/notes/blueprint.md` and returns the research gaps, which go to
`talk-research` (saved workflow `talk-research-gaps`).

## AFK protocol

After "go", "finish", "afk", "continue to completion" or a hand-off like
it: never block on a question, take the recommended option, log it under
Decisions in `talks/<t>/CLAUDE.md`, finish with the open questions batched
in one message (`docs/talk-quality.md` §6). Pushing to main still needs the
owner's request.
