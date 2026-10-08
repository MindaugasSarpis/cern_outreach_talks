---
name: talk-new
description: Use when the owner wants a new outreach talk, deck or presentation in ~/outreach_talks (a new venue, award, lecture, school event or TV appearance). Scaffolds the talk in its own worktree with pnpm talk new, gathers the owner's context from mail, Drive and calendar once into a private brief, and asks the Brief questions in one message.
---

# New talk

One worktree per talk, one Brief per talk, one message of questions. The
quality bar the talk will be held to is `docs/talk-quality.md`.

## 1. Check what exists

```bash
pnpm talk list --json        # talks/* and their worktrees
pnpm talk status --json      # branches, dirty trees, last Pages run
```

If the talk already has a worktree, `pnpm talk open <name>` and stop here.
If pnpm, node or ffmpeg misbehave, `pnpm talk doctor` says which binary is
first on PATH (a Windows pnpm shim under `/mnt/c` is a known trap).

## 2. Owner context, once

Search the owner's Gmail, Drive and Calendar for the invitation and its thread
(load the tools with ToolSearch). Budget: **15 calls in total** for all three.
Look for organiser, date and time, venue or broadcast format, audience,
language, slot length, what was asked for, and attachments. Narrow queries
(names, event words in English and Lithuanian, `-from:linkedin.com`). Read
only; never send, label or move anything.

Write what you found to the private brief, outside git:

```
~/.local/share/outreach_talks/briefs/<slug>.md
```

(`<slug>` is the part of the name after the date, lowercased, with `_` as
`-`: `2026_11_05_Venue` gives `venue`; `pnpm talk list --json` reports it
as `.slug` once the talk exists; `mkdir -p` the directory). Quote sources
(subject and date, file title). Never copy mail, Drive content, contacts or
family details into the repo, and never put the owner's email address into
any request, header, URL or User-Agent.

## 3. The Brief questions, in one message

Ask everything that the private brief did not answer, in a single message,
each with a recommended default so the work can go on without an answer:

1. Event, organiser, date and time; a venue room or a recording or stream?
2. Audience (who, how many, prior knowledge) and language of slides and talk.
3. Slot length and talk length (questions included or not).
4. Screen: projector, LED wall (aspect), or broadcast (full frame, squeezed
   beside the speaker, a wall behind)? For a broadcast, use `talk-broadcast`.
5. The one thing the audience should leave with; must-have topics, names or
   clips; claims to avoid.
6. People and photos to feature, and whether each person has agreed.
7. Palette and hero form, if the owner has a preference (default: one that
   no other live talk uses).

## 4. Scaffold

```bash
pnpm talk new <YYYY_MM_DD_Name> --stage <palette> [--lang lt] [--duration N] [--broadcast]
pnpm talk open <name>                  # cd into the printed worktree
pnpm talk check <name>                 # the scaffold builds
```

Use `00` for an unknown day or month, as the October talks did. Work only
inside the talk's worktree from now on; the main checkout stays on main.

## 5. Fill talks/<t>/CLAUDE.md

Sections: Brief, Status, Arc, Figures, Talk-owned code, Decisions, Verify.
The Brief holds only public-safe facts: audience, language, duration,
delivery, must-haves, banned claims, the takeaway, palette and hero, and the
open questions. Point to the private brief by path, never paste it.

## Done when

- the worktree exists and `pnpm talk check <name>` exits 0;
- the Brief section is filled and the private brief written;
- the questions went out in one message (or, under the AFK protocol in
  `docs/talk-quality.md` §6, the defaults are logged under Decisions);
- the next step is named: a blueprint (`talk-quality`, saved workflow
  `talk-blueprint`) or, for a short talk, the outline.
