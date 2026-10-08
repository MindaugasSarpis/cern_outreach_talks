---
name: talk-research
description: Use when a talk in ~/outreach_talks needs facts, numbers, sources, quotes or photos researched or checked. Searches the repo's facts bank first, researches only the gaps the deck draft leaves (inline for a few claims, the saved talk-research-gaps workflow for more), and files verified claims back into research/facts.jsonl.
---

# Research a talk

Research follows the deck draft, never the other way round: the deck is
written first with fact ids in its notes (`docs/talk-quality.md` §2, step 4),
then only what it still lacks is researched. Innoday spent 28.5 minutes
researching before a slide existed, and the TV talk then researched the same
topics again.

## 1. What the bank already has

```bash
pnpm talk facts search <words> --json     # per topic, English and Lithuanian words
pnpm talk facts show <id>
pnpm talk lint <t> --json                 # cited ids that are missing or not confirmed
pnpm talk map <t> --json                  # which slide says what
```

Read the Brief in `talks/<t>/CLAUDE.md` and, if it exists, the private brief
`~/.local/share/outreach_talks/briefs/<slug>.md` (`<slug>`: the name after
the date, lowercased, `_` as `-`; `.slug` in `pnpm talk list --json`).

## 2. The gap list

A claim is a gap when the deck states it and the bank has no `confirmed` or
`corrected` fact for it, when its fact's `verified_on` is older than six
months, or when the deck's wording goes further than the stored claim. Facts
the deck does not cite are not re-checked.

- Up to about five gaps: research them inline (WebSearch, WebFetch, primary
  sources: home.cern, the experiment's pages, arXiv, journals, PDG, official
  Lithuanian sites).
- More: run the saved workflow `talk-research-gaps` (listed with the skills),
  or by path `<repo>/.claude/workflows/talk-research-gaps.js`:

```js
Workflow({ name: 'talk-research-gaps', args: {
  talk: 'talks/2026_11_05_Venue', repo: '<worktree root>', slug: '<slug>',
  today: '2026-11-01', lang: 'lt',
  // optional: lanes you already know, else the workflow plans them from the deck
  lanes: [{ key: 'lhc', slides: '3-5', topic: 'the LHC in 2026', claims: ['…'] }],
  gaps: ['the award name and date'],      // personal sources only for these
  images: ['the LHCb cavern', 'the first web server'],
} })
```

It splits the gaps into disjoint slide-scoped lanes of about a dozen claims,
writes each lane to `talks/<t>/research/<lane>.json` as it lands, verifies
each lane adversarially, runs one image lane, uses mail and Drive only for the
named `gaps` within 15 calls, caps itself at about 30 agents, and returns
`unverified[]`.

## 3. File the results

A lane file is `{lane, slides, topic, status, facts: [...], notes,
open_questions}`; the bank takes only the facts, so a lane file given to
`facts add --from-json` directly is refused. `lane_facts.py` (next to this
skill) prints the facts of the lane files as one list, turns empty strings
into null and skips `images.json`. From the worktree root:

```bash
python3 -I .claude/skills/talk-research/lane_facts.py talks/<t>/research/*.json \
  | pnpm -s talk facts add --from-json - --dry-run       # then again without --dry-run
pnpm talk facts check
```

Then cite the ids in the slide notes as `<!-- facts: id1, id2 -->` and run
`pnpm talk lint <t>`.

## Rules

- The repo is public. The bank takes only claims with a public `source_url`.
  Anything from mail, Drive or a calendar goes to the private brief.
- Every fact carries the exact figure, its unit, the date it refers to
  (`as_of`), a verbatim `quote` from the source and, for Lithuanian decks,
  `claim_lt` in the wording the slide will use.
- A claim that stays unverified does not go on a slide. Report each one in
  `unverified[]` to the owner and keep it under Figures in the talk's
  CLAUDE.md.
- Photos: one image lane, never a second photo hunt in parallel. Record
  licence and credit; `scripts/photo_fetch.py cds:<ID> --dry-run` (branch
  `feat/facts-lint`) fetches with a User-Agent naming the repo, never an
  email address.
- The traps in `docs/talk-quality.md` §5 (what CERN did and did not invent,
  "first" claims, capacity against data, counts that change) are checked on
  every relevant claim.
