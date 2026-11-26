# LHCb Vilnius 2026 m. ataskaita (talks/2026_12_00_LDFK)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-12-00-ldfk.md, never here.

## Brief

- Event: the LHCb Vilnius group's annual report to the Lithuanian Particle
  Physics Consortium (LDFK) council, covering 2026. Last year's report was
  given on 6 January 2026 (a PowerPoint deck, 37 slides).
- Structure asked by the consortium (26 Nov 2026, "as last year"): a report
  by the points of the 2026 plan, and a plan for 2027 by six points: 1 the
  group's name, leader and direction (one or two sentences); 2 organisational
  activity (cooperation with CERN's units and bodies); 3 direct participation
  in CERN's research, in running or upgrading an experiment; 4 projects on
  CERN topics; 5 scientific activity (directions, expected results, their
  publicity); 6 attracting young researchers and students, and work with
  them. The owner, the same day: "now only report for 2026", so this deck
  is the report, laid out by the six points; the 2027 plan is not in it.
- Slot: up to 10 min and a few minutes of questions, "a little more" for
  the LHCb group. `duration: 15min`; the deck is 11.4 min spoken and the
  2:28 film.
- Date: not fixed. The directory carries `2026_12_00` as a placeholder.
- Delivery: the consortium wants the file in its MS Teams folder „2026 m.
  grupių ataskaitos“ (the owner uploads the PDF).
- Venue and screen: unknown; 16:9.
- Audience: the consortium's council, and people from the ministry (the
  owner, 26 Nov 2026). The council knows CERN and the group; the ministry's
  people do not know the physics, so the notes carry a plain sentence for
  each term.
- Language: Lithuanian for slides and notes (`lang: lt`); chat with the owner in English
- Look: the shared theme with this talk's own kit (`styles/index.css`), no stage.
- Must-haves (owner, 25 Nov 2026): the composition of the group; talks, papers,
  analysis and events; LHCb Week with the media reach and the aftermovie;
  what the students do, what the PhD students do, the group's
  contributions to the experiment; the hexagonal group picture of last year's
  deck, animated; a PDF as well.
- Must-haves (owner, 26 Nov 2026): the scientific directions highlighted; the
  light injection system highlighted; outreach on one slide; LHCb Week on a
  few slides; the paper with Rapševičiūtė, "highlighted in veritasium"; the
  LRT nomination for an award.

## Status

- 26 Nov 2026: reworked on the owner's word and the consortium's structure
  (Decisions, 26 Nov). 18 slides (20 PDF pages), 13.9 of 15 min. Not
  deployed: the live site and the PDF in `public/` before this commit's
  export are of e3e04c3. Open with the owner: the list under "Open
  questions" below.

- 25 Nov 2026: first version, 20 slides (23 PDF pages with the group slide's
  clicks). `pnpm talk check ldfk` passes; `pnpm talk lint ldfk` gives 0 errors
  and warnings of two kinds only: the open marks (24 CHECK, 8 optional) and
  WORDS (a report has more than 60 words a slide).
- The PDF is `public/LHCb_Vilnius_2026_ataskaita.pdf`, made with
  `pnpm export --with-clicks` and moved there, so the site serves it beside
  the deck. It is a snapshot: export again after the slides change.
- 25 Nov 2026, the owner: "deploy". Deployed: commit 2ea428c, Pages run
  45568416486 green, the URL and the PDF answer 200, the live walk passed.
  The open marks stay on the slides in this version, so ready ran with its
  lint step skipped (`--ready-skip lint`, the owner's word, given after
  being told ready would refuse); check, shots, pages, preflight and venue
  passed.
- 25 Nov 2026, later: the copy pass the owner asked for ("a bit marketing-like, some repetition as
  well") and the one budget slide. Deployed on the owner's word: commit e3e04c3, Pages run
  45573691789 green, the URL and the PDF answer 200, the live walk passed; ready's lint step skipped
  again (the open marks stay on the slides). The PDF in `public/` is of this version. What changed is
  under Decisions.
- Branch `talk/ldfk`, worktree `.claude/worktrees/ldfk` (`pnpm talk open ldfk`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_12_00_LDFK/
  (the PDF: `…/2026_12_00_LDFK/LHCb_Vilnius_2026_ataskaita.pdf`)
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

The kicker of each slide carries the number of the consortium's point.

1. Title.
2. The year in six numbers (no money).
3. Point 1, the group: the honeycomb, two clicks (2024, 2025, 2026), with
   the direction in one sentence and the leader.
4. Point 2, organisational: LHCb Week, the facts and the full hall.
5. The aftermovie, whole (2:28); may be skipped with a press.
6. LHCb Week: patron, organisers, partners, sponsors; 37 media items.
7. Lithuania and CERN in 2026: a dated list, the coordinator post on it.
8. Point 3, participation in the experiment: the SciFi light injection system.
9. Data, software, open data, shifts and VELO.
10. Point 4, projects: the Lithuania–Japan project.
11. Projects and attracted funds: the only slide with money on it.
12. Point 5, science: the three directions, with who works in each.
13. Pentaquark searches: the ECC paper, two Run 2 papers, two Run 3 analyses.
14. Papers and talks: the Physics Open review, the year's talks.
15. Outreach, one slide: schools, public and business, the year's media
    mentions by month, recognition (the LRT nomination).
16. Point 6, young researchers: two PhD students and the postdoc.
17. Students and teaching.
18. Thanks, credits.

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
| 197 k EUR, Aug 2025 – Jul 2027 | PHANTOM's maximum grant amount and dates | the grant agreement (project 101244743) | CHECK (show it publicly?) |
| 417 k EUR | the sum of the four budget rows with known amounts (197 + 100 + 100 + 20) | arithmetic on the rows above | OK as a sum |
| 100 k EUR, Apr 2026 – Mar 2028 | the Lithuania–Japan project | the group briefing of 14 Apr 2026; the Tokyo talk | OK |
| 2, 4 M EUR | ERC proposals | the group briefing of 14 Oct 2026 | OK |
| 140, 16, 1 231, 15 | the course's students, lectures, slides, seminars | VU's educational-initiative report, 28 Oct 2026 | OK |
| 12, 17, 13 | the group by year | last year's report; the team board of 14 Oct 2026 | CHECK (who left) |

| Physics Open 29 (2026) 100478 | the review with Rapševičiūtė, Šilalė and Rapševičius | Crossref's record of DOI 10.1016/j.physo.2026.100478 (fact `physics-open-mc-overview-2026`) | OK |
| "paminėtas „Veritasium“ kanale" | the review was mentioned on Veritasium | the owner's word (26 Nov 2026); no public trace found | CHECK (which video) |
| "Nominacija LRT apdovanojimams" | an LRT award nomination | the owner's word (26 Nov 2026); LRT's page of 25 Nov 2026 names categories, no nominees | CHECK (award, category, who) |
| 11 000 km, 524 288, 670 nm, 12 layers, 6 m × 5 m | the SciFi and its light injection system | facts `lhcb-scifi`, `lhcb-scifi-channels`, `lhcb-scifi-lis-vcsel`, `lhcb-scifi-layout` | OK |
| "nuo 2026 m. sausio tiriamos Vilniuje" | irradiated SciFi fibres in Vilnius | the group briefing of 13 Jan 2026 | OK |

## Open questions

For the owner, one list (each is a `[PATIKSLINTI…]` mark on a slide or in its notes):

1. Slide 8: what was done on the light injection system in 2026 and what
   comes next; the fibre measurements' results. Publicly confirmed is only
   that SciFi and LIS are the group's service work.
2. Slide 14: which Veritasium video mentions the review, and how.
3. Slide 15: which LRT award and category, and who is nominated; the result
   of VU's 2026 open-science competition.
4. Slide 11: LDFK's funds to the group in 2026, LHCb Week's total budget,
   sponsors' and fees' sums, the VU educational-initiative sum; whether
   PHANTOM's 197 k EUR may be shown.
5. Slide 3: whether Dainius, Karolina, Venera and Mikas left; when Anni starts.
6. Slides 2 and 4: the final attendance of LHCb Week from Indico.
7. Slide 14: who gave the Reinterpretation talk; summer talks; Confinement 2026.
8. Slide 6: the sponsor list and the unread logo.
9. Slide 17: thesis topics and defence dates.
10. Whether a 2027 plan by the six points is wanted in this deck after all
    (the consortium's note asks for one; the owner said report only).

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
- `public/figures/lw_*.jpg`: stills from the aftermovie (only `lw_hall` is
  used now); `nagoya_workshop.jpg`: the workshop's group photo; `scifi.jpg`:
  CERN's photo of a SciFi frame going into the cavern (`assets/photos/photos.toml`).
- Kit classes added 26 Nov: `.kick b` (the point's number), `.lead` (a
  sentence under a title), `.faces` (a row of small hexagons), `.kpi.long`
  (a long number in a narrow panel), `.ref` (a paper).

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

- 25 Nov 2026, the owner: "unslop the ldfk talk, it's a bit marketing-like, some repetition as well, need
  a slide of budgets / attracted funds (only one)". Done by `docs/unslop-lt.md`:
  - Money is on slide 17 only. It left the numbers slide, the partners slide, the Japan slide and the
    outlook ("ERC sprendimai" without the sum).
  - Cut as promotion or unsupported: the title „Metai, kai LHCb atvyko į Vilnių“; „kelias į visateisę
    narystę“; the sponsors line about companies presenting themselves; „LHCb savaitė parodė, kad Lietuva
    gali priimti visą kolaboraciją“; „Pagrindas visoms tolesnėms analizėms“; „rekordas“; the media line
    on Rūta's card; the speculative „Kryptis ateičiai“ on lasers; in the notes, „valstybės lygio
    renginiu“, „didžiausiais duomenų kiekiais“, „rezultatų metai“, „matomiausias pavyzdys“.
  - A claim corrected: the Brown University preprint was called the first independent work on LHCb open
    data; the facts bank does not say first, so the word is gone.
  - Said once now: LRT's headline (the media slide), the patron (the partners slide), the membership
    bid (slide 10), the coordinator post (slide 14), Open Readings and the Nagoya talks (slide 15).

- 26 Nov 2026, the owner: "the ldfk talk needs reworking, now only report for 2026, outreach should be
  one slide, lhcb week a few slides, our scientific directions are not highlighted, light injection
  system is not highlighted, there will be people from the ministry as well"; then "mention the paper
  with Rapseviciute, it was highlighted in veritasium, mention LRT nomination for award"; then the
  consortium's structure (Brief). Done:
  - The order follows the consortium's six points, the point's number in each kicker. Yesterday's
    "LHCb Week first" gave way to it: LHCb Week is under point 2, after the group. To undo, move
    slides 4 to 7 before slide 3.
  - Report only (Claude's reading of "now only report for 2026"): the 2027 slide, the honeycomb's
    2027 step and „ir 2027 m. perspektyvos“ on the cover are gone. They are in e3e04c3
    (`git show e3e04c3:talks/2026_12_00_LDFK/deck.md`). Gustė (from October 2027) stays as one
    line under the PhD slide and one under new topics.
  - LHCb Week: five slides became three (facts with the programme folded in, the film, partners
    with the media). The programme's three stills and the audience-reach panel are gone.
  - The directions: a slide of three (spectroscopy; data and software; detector) with the people
    of each as hexagons, the same three as last year's report; one sentence of them on the group
    slide and a key number on slide 2.
  - The light injection system has its own slide, first under point 3, with CERN's SciFi photo.
    What the group did on it in 2026 is an open mark: no source at hand says.
  - „Kas ką daro“ and „Ką grupė duoda LHCb“ are gone; their content is on the directions slide and
    on the two slides of point 3.
  - Outreach is one slide and holds the year's media chart; teaching moved to the students' slide.
  - The paper with Rapševičiūtė is on „Straipsniai ir pranešimai“; the Veritasium mention and the
    LRT nomination are on the slides in the owner's words, each with an open mark, since neither
    could be confirmed from a public page.
  - Cut from the talks list for room: the DPA and RTA meeting (it is on slide 9) and the Japan
    project's kick-off.

## Verify

```bash
pnpm talk check ldfk     # the lockfile, videos:check, a build into /tmp/talk-ldfk/site
pnpm talk lint ldfk      # 0 errors; CHECK and WORDS warnings are expected
pnpm talk shots ldfk --sheet
pnpm -C talks/2026_12_00_LDFK export --with-clicks   # the PDF, one page per click; move it into public/
pnpm talk ready ldfk     # before the venue: needs the open marks settled
```
