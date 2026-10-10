# Lithuania and Japan: the bilateral project (talks/2026_11_18_Tokyo)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-11-18-tokyo.md, never here.

## Brief

Private context (sources, people, budget): `~/.local/share/outreach_talks/briefs/tokyo.md`.

- Event: introduction of the Lithuanian–Japanese bilateral research project
  "Penta-Charm" (Vilnius University LHCb group × Nagoya University theory,
  LMT + JSPS bilateral programme, 2026-04 to 2028-03) at the Embassy of the
  Republic of Lithuania in Japan, Tokyo. A week later (24–27 Nov) the project
  holds its workshop at Nagoya University.
- Date and slot: 2026-11-18; 15 min assumed, time of day TBC
- Venue and screen: embassy room; 16:9 projector or TV assumed (TBC)
- Audience: ambassadors and dignitaries, no physics background; Japanese and
  Lithuanian guests
- Language: English for slides and notes (`lang: en`); spoken English (TBC)
- Look: slidev-addon-stage, classic palette (TBC); the same particle effects
  as the other stage talks; pictures and numbers only, no words on screen
- Story: the particle stage → what quarks are → what pentaquarks are → the
  project. Startertalk (hadron space) as inspiration, much more generic and
  schematic. Must be very impressive.
- Takeaway (draft): Lithuania and Japan together are solving one of the open
  puzzles of matter, five quarks bound together, and training young
  scientists while doing it.
- Banned: fundraising amounts unless the owner says; unchecked citation counts.

Open questions: sent to the owner 2026-10-10 (see Decisions for the defaults).

## Status

- Branch `talk/tokyo`, worktree `.claude/worktrees/tokyo` (`pnpm talk open tokyo`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_11_18_Tokyo/
- 2026-10-10: scaffold builds (`talk check` ok), toolkit v0.7.0, private brief
  written. Blocked on the Brief questions; next: the outline.
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/tokyo.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long.

1. Cover:

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

## Decisions

The owner's decisions, dated, newest last.

## Verify

```bash
pnpm talk check tokyo     # videos:check, stage:check, a build into /tmp/talk-tokyo/site
pnpm talk review tokyo    # check, then shots of the changed slides and a contact sheet
pnpm talk ready tokyo     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```

- 2026-10-10 (Scheduler defaults, owner to confirm): stage palette classic,
  `lang: en`, 15 min, 16:9.
- 2026-10-10: toolkit pinned to v0.7.0 (both addons).
- 2026-10-10: cover stripped to the stage alone; the title lives only in the
  page `title:` headmatter.
- 2026-10-10: Brief questions sent; defaults used until answered are those
  in the message (15 min talk + Q&A separate, projector 16:9, English, no
  people photos without consent, classic palette).
