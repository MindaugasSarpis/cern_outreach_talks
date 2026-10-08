---
name: talk-research
description: Use when a talk in the outreach_talks repo needs facts, numbers, sources, quotes or photos researched or checked. Searches the repo's facts bank first, researches only the gaps the deck draft leaves (inline for a few claims, the saved talk-research-gaps workflow for more), and files verified claims back into research/facts.jsonl.
---

# Research a talk

Research follows the deck draft, never the other way round: the deck is
written first, citing fact ids (`docs/talk-quality.md` §2, step 4),
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
  talk: 'talks/2026_11_05_Venue', repo: '<worktree root>', today: '2026-11-01', lang: 'lt',
  // optional: lanes you already know, else the workflow plans them from the deck
  lanes: [{ key: 'lhc', slides: '3-5', topic: 'the LHC in 2026', claims: ['…'] }],
  // optional: Brief questions only the owner's own mail, Drive and calendar answer
  briefGaps: ['the award name and date'],
  images: ['the LHCb cavern', 'the first web server'],
} })
```

It splits the gaps into disjoint slide-scoped lanes of about a dozen claims,
writes each lane to `talks/<t>/research/<lane>.json` as it lands, verifies
each lane adversarially, runs one image lane, searches mail, Drive and
calendar only for `briefGaps` within 15 calls, caps itself at about 30
agents, and returns `unverified[]`. Public claims, including a blueprint's
`research_gaps`, go in `lanes[].claims` or are left for the plan agent to
find in the deck; never in `briefGaps`, which searches the owner's mail,
Drive and calendar for them.

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

- `add` refuses an id the bank already has: the lane re-checked a stale
  fact, or the deck said more than the stored claim. Compare with
  `pnpm talk facts show <id>`. A re-check of the same claim that came back
  `confirmed` or `corrected` replaces the stored one:
  `python3 -I .claude/skills/talk-research/lane_facts.py talks/<t>/research/*.json --id <id> | pnpm -s talk facts add --from-json - --replace`.
  A different claim gets a new id in the lane file, is filed, and the deck
  cites the new id.
- Anything else refused (an `as_of` that is not `YYYY`, `YYYY-MM` or
  `YYYY-MM-DD`, a private source): fix it in the lane file and file again.
- Photos the deck uses from `images.json`:
  `python3 scripts/photo_fetch.py <ref> --record` (`ref` is `cds:<ID>` or
  `commons:File:<name>`) fetches each into `assets/photos/` and records its
  licence and credit in `assets/photos/photos.toml`.
- Copy the lane `notes` the speaker needs (why a figure was corrected, its
  caveats) under Figures in `talks/<t>/CLAUDE.md`.
- Then delete the lane files and `images.json` (`rm talks/<t>/research/*.json`).
  They are untracked scratch, never committed, and `facts check` warns about
  each one until it is gone.

Cite the ids in a separate comment placed before the slide's notes comment,
never as the slide's last comment: Slidev takes a slide's last comment as its
speaker notes, so a facts comment after the notes replaces the script. Then
run `pnpm talk lint <t>`; it reports a misplaced facts comment as the warning
`FACT-NOTES`, which does not fail `lint` or `ready`, so read the warnings.

```md
<!-- facts: lhc-circumference, lhc-run3-energy -->

<!--
The spoken script… (~1 min)
-->
```

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
