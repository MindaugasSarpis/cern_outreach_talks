# Facts bank

`facts.jsonl` holds the claims the talks have checked: one JSON object per
line, sorted by id. Search it before starting any research; when a research
or verify run confirms something new, add it here so the next talk starts
from it.

```bash
python3 scripts/facts.py search touchscreen      # or: pnpm talk facts touchscreen
python3 scripts/facts.py show gave-touch-stumpe-1972
python3 scripts/facts.py check                   # schema, ids, sources, the talks' citations
```

Search ranks by how many of the words appear in the id, `claim_en` and
`claim_lt` (case and diacritics ignored, `touchscreen` also finds
"touch screen"). `--json` prints one JSON object; the exit code is 1 when
nothing matches.

`show` also lists the other usable facts that cite the same page (`same
page:`, or `same_page` in the JSON). Read them before citing one: they
should agree.

## Schema

| key | type | meaning |
| --- | --- | --- |
| `id` | slug | `a-z`, `0-9` and single dashes, at most 64 characters. Stable: decks cite it, so never rename one. |
| `claim_en` | string | The claim in English, worded as it may be said or shown (for a corrected fact, the corrected wording). |
| `claim_lt` | string or null | A checked Lithuanian wording, with Lithuanian typography („…“, decimal comma, no-break space in thousands). |
| `value` | number, string or null | The headline number, when there is one. |
| `unit` | string or null | Its unit (`TB`, `members`, `% of matter`). |
| `as_of` | `YYYY`, `YYYY-MM`, `YYYY-MM-DD` or null | When the claim holds: the event date, or the date of the statistic. |
| `source_url` | URL | One public http(s) page that supports the whole claim, by its canonical URL (follow redirects such as WordPress `?p=` links). |
| `quote` | string or null | Verbatim text from that page, when the check recorded one. |
| `verdict` | enum | `confirmed`, `corrected`, `unverified` or `refuted` (below). |
| `verified_on` | `YYYY-MM-DD` | When the source was checked. Required unless the verdict is `unverified`. |
| `verified_by` | string | Who checked it: "the owner", or the run that did (for example "Innoday research workflow, verify lane"). Required unless `unverified`. |
| `used_in` | list | Talk directory names the fact was researched for or is cited in. |

No other keys. `facts.py check` and `facts.py add` enforce all of this.

## Verdicts

- **confirmed**: the source says what the claim says.
- **corrected**: the first wording was wrong or overstated; `claim_en` is
  the fixed wording, and only that may be used.
- **unverified**: not checked against a primary source yet. Do not put it
  on a slide; a deck that cites it fails `talk lint`.
- **refuted**: the claim is false. `claim_en` names the false claim and
  says what holds instead, so the next search finds the trap. Decks cannot
  cite it.

## Public sources only

The repository is public. A fact is kept only when `source_url` is a page
anyone can open: no Google Drive, Docs, Gmail or Calendar, no SharePoint,
OneDrive or Outlook, no local or private addresses, no links carrying
credentials. Nothing about the owner's private life or family goes in, even
when a public page mentions it. Briefs from mail and Drive belong in
`~/.local/share/outreach_talks/briefs/<slug>.md`, outside git.

## Adding facts

```bash
python3 scripts/facts.py add \
  --claim-en "In 2025 CERN signed 89 knowledge-transfer contracts." \
  --source-url https://kt-report-2025.web.cern.ch/ \
  --value 89 --unit contracts --as-of 2025 \
  --verdict confirmed --verified-on 2026-10-08 --verified-by "the owner" \
  --used-in 2026_10_00_Innoday
```

Without `--id` an id is made from the claim's first words. `--from-json
FILE` (or `-` for stdin) takes one object, a list or JSON lines in the
schema above; add `--loose` to import a research run's output as it comes
(`claim`, `corrected_claim`, `evidence_url`, `date`, verdicts such as
`unverifiable`), with `--verified-by` naming the run. Every entry is
validated, and a source that is not public is refused. `--replace`
overwrites an entry with the same id (to record a re-check, update
`verdict`, `verified_on` and `verified_by` and keep the id); `--dry-run`
validates without writing. One bank only: a talk does not keep its own
facts file (`check` warns about `talks/*/research/*.json`).

When usable facts from one page were checked by different runs, `check`
warns: two readings of one page can disagree. Read those facts together
against the page, fix any that do not hold, and record the re-check on all
of them (`verified_on`, and one `verified_by`); the warning then clears.

## Citing facts in a deck

Put a comment above a slide's speaker notes:

```md
<div class="src">CERN Courier, 31 Mar 2010</div>

<!-- facts: gave-touch-stumpe-1972, gave-touch-johnson-1965 -->

<!--
Speaker notes…
-->
```

Slidev takes the last comment of a slide as its notes, so the facts comment
must not be the last one. `talk lint` checks that each cited id exists with
the verdict `confirmed` or `corrected`.

## Where the seed came from

Seeded on 2026-10-08 from the research runs of 2026-10-07 and the
Startertalk research brief of 2026-09-10, keeping only claims with a public
source:

- Innoday's research and verify lanes (CERN, LHCb, Lithuania, what CERN gave
  the world, knowledge transfer): 202 facts after near-duplicates between
  lanes were merged, with the verifier's corrected wording and, where it
  named one, the page it checked as the source.
- The Užsikrauk karjerai science-facts lane and its verifier: 42 facts not
  already covered, with Lithuanian wordings where the verifier passed them.
- OpenData's public-facts lane: 32 facts on LHCb open data and data volumes,
  including the refuted "55 PB open".
- `docs/superpowers/plans/2026-09-09-startertalk-dioramas-research.md`: 14
  facts that passed its per-claim verifier.
