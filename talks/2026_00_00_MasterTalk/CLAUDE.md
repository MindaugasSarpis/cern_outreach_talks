# MasterTalk (talks/2026_00_00_MasterTalk)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/mastertalk.md, never here.

## Brief

- Event: a keynote seminar "something like Innoday" (owner, 18 Oct): an
  innovation or business day; no event named yet
- Date and slot: 2026-00-00 (placeholder); about 25 min, as Innoday (assumed)
- Venue and screen: a venue with a 16:9 projector, as Innoday (assumed)
- Audience: business and policy, no physics background, as Innoday; a
  keynote, so no audience participation (owner, 18 Oct)
- Language: English for slides and notes (`lang: en`); not yet confirmed
- Look: slidev-addon-stage, blue palette (scaffold default)
- Idea ("one collision, one shot", owner took it 18 Oct): the whole talk is
  one continuous camera move with no cuts. It follows one real collision
  through LHCb's real geometry, then the trigger and data flow (LHCb
  Vilnius's work), down to the single dot it becomes in a discovery plot,
  then pulls back to the whole peak and to Vilnius. Each reduction is a
  station with its real number and unit, from 40 million crossings per
  second down to one dot. The talk opens on the peak, which means nothing
  yet, and closes on it once the audience can read it. No words on screen.
- Reuse: the opening's push into the pipe, the real collision, the funnel
  (as data reduction), the grain histograms. New: an LHCb open-data event in
  the real geometry; two or three offline-rendered hero shots arriving as
  dust; timing set to a recorded rehearsal; every station reachable by a jump.
- Private brief: ~/.local/share/outreach_talks/briefs/mastertalk.md

Open questions (asked 18 Oct): language (Innoday was Lithuanian); takeaway;
what is off limits; storyboard approval.

## Status

- Branch `talk/mastertalk`, worktree `.claude/worktrees/mastertalk` (`pnpm talk open mastertalk`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_MasterTalk/
- Scaffold committed 18 Oct; `pnpm talk check` ok. Blocked on the Brief
  questions. Storyboard draft 2 (`notes/storyboard.md`, 18 Oct: clock on, Innoday-like, 25 min) is with the
  owner; nothing is built until it is approved.
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/mastertalk.json`; `pnpm talk status` shows it.

## Arc

The timeline is in `notes/storyboard.md` (12 stations, 25 min); this
section takes the slide list once the owner approves it.

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

- 2026-10-18: name MasterTalk; the pitch "one collision, one shot"; no audience
  participation in a keynote.
- 2026-10-18: the running clock (mt-clock) goes on screen (owner: "Clock on
  screen").
- 2026-10-18: the event is "something like Innoday": a business and policy
  audience; 25 min and a 16:9 projector assumed from Innoday.

## Verify

```bash
pnpm talk check mastertalk     # videos:check, stage:check, a build into /tmp/talk-mastertalk/site
pnpm talk review mastertalk    # check, then shots of the changed slides and a contact sheet
pnpm talk ready mastertalk     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
