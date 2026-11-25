# LHCb Vilnius 2026 m. ataskaita (talks/2026_12_00_LDFK)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-12-00-ldfk.md, never here.

## Brief

- Event: the LHCb Vilnius group's annual report to the Lithuanian Particle
  Physics Consortium (LDFK), covering 2026, with the outlook for 2027. Last
  year's report was given on 6 January 2026 (a PowerPoint deck, 37 slides).
- Date and slot: not fixed. The directory carries `2026_12_00` as a
  placeholder; 20 min assumed.
- Venue and screen: unknown; 16:9.
- Audience: the consortium's members and board; they know CERN and the group.
- Language: Lithuanian for slides and notes (`lang: lt`); chat with the owner in English
- Look: the shared theme with this talk's own kit (`styles/index.css`), no stage.
- Must-haves (owner, 25 Nov 2026): the composition of the group; talks, papers,
  analysis and events; prospects; LHCb Week first, with the media reach and
  the aftermovie; what the students do, what the PhD students do, the group's
  contributions to the experiment; the hexagonal group picture of last year's
  deck, animated; a PDF as well.

## Status

- 25 Nov 2026: first version, 20 slides (23 PDF pages with the group slide's
  clicks). `pnpm talk check ldfk` passes; `pnpm talk lint ldfk` gives 0 errors
  and warnings of two kinds only: the open marks (24 CHECK, 8 optional) and
  WORDS (a report has more than 60 words a slide).
- The PDF is `public/LHCb_Vilnius_2026_ataskaita.pdf`, made with
  `pnpm export --with-clicks` and moved there, so the site serves it beside
  the deck. It is a snapshot: export again after the slides change.
- 25 Nov 2026, the owner: "deploy". The open marks stay on the slides in this
  version, so the deploy runs with ready's lint step skipped (the owner's
  word, given after being told ready would refuse); every other step runs.
- Branch `talk/ldfk`, worktree `.claude/worktrees/ldfk` (`pnpm talk open ldfk`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_12_00_LDFK/
- The aftermovie `lhcb_week_aftermovie.mp4` (Innoday's web encode, copied
  from its venue bundle on this machine) is published on this talk's release
  `videos-2026-12-00-ldfk` (25 Nov 2026).
- `pnpm talk ready` will fail until the `[PATIKSLINTI…]` marks are settled:
  `--release` turns them into errors.
- On this machine `pnpm install` drops `path: /packages/stage` from two
  lockfile entries (the known pnpm fault `pnpm talk check` reports). The two
  lines were restored from origin/main's text; nothing else in the lockfile
  was edited by hand.

## Arc

1. Title.
2. The year in nine numbers.
3. The group as a honeycomb, four clicks: 2024, 2025, 2026, 2027.
4. Who does what, by level.
5. LHCb Week: the facts and the full hall.
6. The aftermovie, whole (2:28).
7. LHCb Week's programme: science, state, culture.
8. Media: 37 items in two weeks, the year's mentions by month, the open
   question of audience reach.
9. Patron, organisers, partners, sponsors, funding.
10. Lithuania and CERN in 2026: the road to full membership.
11. Research: the ECC paper, two Run 2 papers, two Run 3 analyses.
12. What the PhD students do.
13. What the students do.
14. What the group gives LHCb.
15. Conferences and talks.
16. The Lithuania–Japan project.
17. Funding and proposals.
18. Teaching and outreach.
19. 2027.
20. Thanks, credits.

## Figures

The checked facts are cited in the slides' notes (`<!-- facts: … -->`). The
numbers below are not in the facts bank; each has a `[PATIKSLINTI…]` mark or a
source line in its slide's notes.

| Value | Claim | Source | OK / CHECK |
| ----- | ----- | ------ | ---------- |
| 37 | media items on LHCb Week, 8–20 Sep 2026 | the Faculty of Physics media list (to 28 Oct 2026), counted by script | OK as a count of that list |
| 71 | media items on the group and LHCb, Jan–Oct 2026 | the same list; CMS and other groups' rows left out | OK as a count of that list |
| 21, 3 | posters at LHCb Week, poster prizes | the poster registration list; the event's cost sheet | CHECK |
| 100 k EUR, 20 k EUR | ministry and Go Vilnius funding for LHCb Week | the group briefings of 13 Jan and 14 Apr 2026 | CHECK |
| 100 k EUR, Apr 2026 – Mar 2028 | the Lithuania–Japan project | the group briefing of 14 Apr 2026; the Tokyo talk | OK |
| 2, 4 M EUR | ERC proposals | the group briefing of 14 Oct 2026 | OK |
| 140, 16, 1 231, 15 | the course's students, lectures, slides, seminars | VU's educational-initiative report, 28 Oct 2026 | OK |
| 12, 17, 13, 14+ | the group by year | last year's report; the team board of 14 Oct 2026 | CHECK (who left) |

## Talk-owned code

- `setup/team.ts`: the people, their tile's place on the board, the year they
  join and the year they are shown as alumni from. Edit this to change the
  honeycomb.
- `setup/HexTile.vue`: one hexagonal photo tile with thickness (stacked
  clipped layers in a preserve-3d box). `<HexTile who="ruta" :size="96" />`.
- `setup/HexTeam.vue`: the honeycomb. `<HexTeam :year="2026" />`; tiles whose
  year has not come wait behind the board and fly to their place. CSS 3D, no
  WebGL, so the PDF shows what the screen shows; in print nothing moves.
- `setup/Tex.vue`: inline maths inside HTML blocks, `<Tex v="\pi^0" />`
  (KaTeX; Markdown's `$…$` is not read there). `katex` is a dependency of
  this talk for it.
- `setup/main.ts`: registers the three and loads KaTeX's stylesheet.
- `styles/index.css`: the report's kit (panels, key numbers, tags, person
  rows, dated lists, the bar chart). One font size per slide scales
  everything: `class: dense | snug | full | roomy | airy` in a slide's
  frontmatter.
- `slide-top.vue`: the page number, on screen and in the PDF.
- `public/team/`: 360 px square portraits, from the group briefing's
  `public/team/` and last year's deck.
- `public/figures/lw_*.jpg`: stills from the aftermovie (campus, gala and
  reception are not used yet); `nagoya_workshop.jpg`: the workshop's group
  photo.

## Decisions

- 25 Nov 2026, the owner: build it in outreach_talks; it may be deployed, the
  content is public ("it's public so can deploy, not a problem").
- 25 Nov 2026, the owner: a group picture like last year's 3D hexagons with
  animation, and the deck must also be available as a PDF. So this talk's
  slides carry titles and lists (`onscreen: words`), an exception to the house
  rule of wordless slides.
- 25 Nov 2026, the owner: LHCb Week is the most important part, with the media
  reach reports and the aftermovie; also what the students and the PhD
  students do and the group's contributions to the experiment.
- 25 Nov 2026 (Claude's calls, to be confirmed): the board's alumni are the
  people on last year's board who are not on the team board of 14 Oct 2026;
  the event's budget total is left as an open mark, not copied from the cost
  sheet; no e-mail address on the last slide.

## Verify

```bash
pnpm talk check ldfk     # the lockfile, videos:check, a build into /tmp/talk-ldfk/site
pnpm talk lint ldfk      # 0 errors; CHECK and WORDS warnings are expected
pnpm talk shots ldfk --sheet
pnpm -C talks/2026_12_00_LDFK export --with-clicks   # the PDF, one page per click; move it into public/
pnpm talk ready ldfk     # before the venue: needs the open marks settled
```
