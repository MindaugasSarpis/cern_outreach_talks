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
  the LHCb group. `duration: 15min`; `pnpm talk map ldfk` gives the minutes,
  the 2:28 film and the 16 s module clip in them (14.7 on 27 Nov).
- Date: not fixed. The directory carries `2026_12_00` as a placeholder.
- Delivery: the consortium wants the file in its MS Teams folder „2026 m.
  grupių ataskaitos“ (the owner uploads the PDF).
- Venue and screen: unknown; 16:9.
- Audience: the consortium's council, and people from the ministry (the
  owner, 26 Nov 2026). The council knows CERN and the group; the ministry's
  people do not know the physics, so the notes carry a plain sentence for
  each term.
- Language: Lithuanian for slides and notes (`lang: lt`); chat with the owner in English
- Look: the shared theme with this talk's own kit (`styles/index.css`), over the stage: a silent
  world behind the report (the owner, 27 Nov 2026), a still of it under each PDF page.
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

- 27 Nov 2026, later: the owner's four follow-ups (Decisions, 27 Nov, the two entries after the
  first): Go Vilnius merged into 65 k EUR from the private sector, the communication report's
  media figures, no PhD slide, the aftermovie as the opener. 19 slides (25 PDF pages with the
  clicks), 14.2 of 15 min. Deployed on the owner's word: commit 6c63883, `talk ready` passed with
  nothing skipped, Pages run 45924086927 green, the URL and the PDF answer 200, the live walk
  passed all 19 slides. Shots of all 25 frames without overflow or page errors; two short
  subagent checks of the changed slides against the PDF, their findings applied.

- 27 Nov 2026: the owner's "improve it, and deploy", with a moving background, more on the light
  injection system and no sound (Decisions, 27 Nov). 20 slides (28 PDF pages with the clicks),
  14.7 of 15 min. Toolkit v0.11.0, the stage added. The open marks are off the slides: "Open
  questions" below is the list.
  Checked: `talk lint --release` 0 errors (14 WORDS, the LT-THOUSANDS on the article number);
  `talk check` ok (lockfile, videos:check, stage:check, build); shots of all 20 slides and every
  click of slides 2, 3 and 18 (28 frames) with the world running, none overflowing, no page or
  HTTP errors; the PDF's 28 pages each over the world's still, in PT Serif. Five subagent passes
  (two sheet reviews, two framing rounds for the detector, the module, the cover and three tiles,
  one check of screen against PDF), their findings applied. Left as they are: Adam's and
  Mindaugas' tiles (tight head shots: they need wider crops of the photographs); KaTeX indices at 12 to 13 px.
  The module clip `lis_flag_50.mp4` is on this talk's release (published 27 Nov).
  Deployed on the owner's word: commit 370b103, `talk ready` passed with nothing skipped, Pages
  run 45921620805 green, the URL, the PDF and the module's grains answer 200, the live walk passed
  all 20 slides (tier 0, no lost context).

- 26 Nov 2026, second round: the owner's list after reading the rework (Decisions, 26 Nov, the
  last two entries). 17 slides (25 PDF pages with the clicks), 13.7 of 15 min. Not deployed: the
  live site and its PDF are of e3e04c3. Open with the owner: "Open questions" below, first the
  embassy photo and the light injection system's 2026 work.
  Checked: `talk lint` 0 errors (16 CHECK, 13 optional, 14 WORDS, the LT-THOUSANDS on the article
  number); `talk check` ok; shots of all 17 slides and every click of slides 2, 3 and 15 (25
  frames) without overflow or page errors; three subagent passes (the tiles' framing, a sheet
  review, a check of its fixes), their findings applied. Left as they are: Mikas', Adam's,
  Dainius' and Gustė's chins meet the name on their tiles (the photos end there), Anni sits left
  of centre. The PDF in `public/` is of this version, 25 pages. Committed on `talk/ldfk`, not
  pushed (the push is the owner's, as below).

- 26 Nov 2026: reworked on the owner's word and the consortium's structure
  (Decisions, 26 Nov). 18 slides (25 PDF pages with the clicks), 13.9 of 15 min. Not
  deployed: the live site and the PDF in `public/` before this commit's
  export are of e3e04c3. Open with the owner: the list under "Open
  questions" below.
  Checked: `talk lint` 0 errors (25 CHECK, 7 optional, 12 WORDS, one
  LT-THOUSANDS on the article number 100478, which is not a count);
  `talk check` ok; shots of all 18 slides and of every click of slides 3,
  12 and 16 without overflow or page errors; two sheet reviews by
  subagents, their findings applied. Not applied: recrops of
  `public/team/mikas.jpg`, `sophia.jpg` and `adam.jpg` (the faces sit low
  or off-centre at the larger tile). The PDF in `public/` is of this
  version, 25 pages. Committed on `talk/ldfk`, not pushed: the session's
  permission check refused the push, so it is the owner's to run.

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

The kicker of each slide carries the number of the consortium's point. The world's station is in
brackets (`public/data/space.json`).

1. Title: the group's name, leader and direction in one sentence; it stands while the room
   settles. [hero: the three pictures of the pentaquark]
2. The opener: the LHCb Week aftermovie, whole (2:28), on the first press; the first words come
   after it. May be skipped with a press.
3. Point 1, the group: the honeycomb, three clicks (2024, 2025, 2026, 2027). The 2027 step:
   Gustė and two open places. [group: open dust]
4. Point 1, the three directions on the honeycomb, three clicks, the people of each picked out;
   the PhD students and the postdoc are spoken here (the notes carry what each does).
5. Point 2, organisational: LHCb Week, the facts and the full hall. [lhc: a collider ring]
6. LHCb Week: patron, organisers, partners, sponsors; the media figures of the communication
   report (52 mentions, 11.9 M potential audience).
7. Lithuania and CERN in 2026: a dated list, the coordinator post on it.
8. Point 3, participation in the experiment: SciFi inside LHCb. The world is the picture: LHCb's
   real geometry as grains, SciFi brightest; three numbers. [det]
9. A SciFi module, the Blender clip of Užsikrauk karjerai (16 s): down the module to the cold
   box, the flag.
10. The module's end from its CAD model as grains, the light injection parts white; a legend.
    [lis]
11. How the light injection system works (a chain of five steps), what it is for, what Vilnius
    does; CERN's SciFi photo.
12. Data, software, open data, shifts and VELO. [det, from afar]
13. Point 4, projects: the Lithuania–Japan project, the embassy event of 18 Nov and the Nagoya
    workshop. [projects: open dust]
14. Projects and attracted funds: the only slide with money on it.
15. Point 5, science: pentaquark searches (the ECC paper, two Run 2 papers, two Run 3 analyses).
    [hero]
16. Papers and talks: the Physics Open review with the Veritasium frame, the year's talks.
17. Outreach, one slide: schools, public and business, the year's media items by month (the
    Faculty's list), recognition (the LRT nomination).
18. Point 6, young researchers: students and teaching. [group]
19. Thanks, credits. [hero]

## Figures

The checked facts are cited in the slides' notes (`<!-- facts: … -->`). The
numbers below are not in the facts bank; each has a `[PATIKSLINTI…]` mark or a
source line in its slide's notes.

| Value | Claim | Source | OK / CHECK |
| ----- | ----- | ------ | ---------- |
| 37 | media items on LHCb Week, 8–20 Sep 2026 | the Faculty of Physics media list (to 28 Oct 2026), counted by script | OK as a count of that list; now only the September bar of slide 17's chart |
| 52, 11.9 M, 35, 16, 7 | mentions of LHCb Week in the media on 10–17 Sep 2026; the week's potential audience; items on the opening day, 14 Sep; LRT's and Delfi's mentions | „CERN „LHCb Week Vilnius“ renginio komunikacijos ataskaita“ (VU communications, the owner's file, 27 Nov 2026) | OK |
| 71 | media items on the group and LHCb, Jan–Oct 2026 | the same list; CMS and other groups' rows left out | OK as a count of that list |
| 21, 3 | posters at LHCb Week, poster prizes | the poster registration list; the event's cost sheet | CHECK |
| 100 k EUR | the ministry's funding for LHCb Week | the group briefings of 13 Jan and 14 Apr 2026 | CHECK |
| 65 k EUR | LHCb Week's funds from the private sector, Go Vilnius' contribution merged into it (20 k EUR in the briefings) | the owner's word (27 Nov 2026) | OK |
| 197 k EUR, Aug 2025 – Jul 2027 | PHANTOM's maximum grant amount and dates | the grant agreement (project 101244743) | CHECK (show it publicly?) |
| 462 k EUR | the sum of the four budget rows (197 + 100 + 100 + 65) | arithmetic on the rows above | OK as a sum |
| 100 k EUR, Apr 2026 – Mar 2028 | the Lithuania–Japan project | the group briefing of 14 Apr 2026; the Tokyo talk | OK |
| 2, 4 M EUR | ERC proposals | the group briefing of 14 Oct 2026 | OK |
| 140, 16, 1 231, 15 | the course's students, lectures, slides, seminars | VU's educational-initiative report, 28 Oct 2026 | OK |
| 12, 17, 13 | the group by year | last year's report; the team board of 14 Oct 2026 | CHECK (who left) |

| Physics Open 29 (2026) 100478 | the review with Rapševičiūtė, Šilalė and Rapševičius | Crossref's record of DOI 10.1016/j.physo.2026.100478 (fact `physics-open-mc-overview-2026`) | OK |
| "parodytas „Veritasium“ vaizdo įraše", 4,4 mln., 21,5 mln. | the review's first page is shown in Veritasium's "Randomness is a lie. Let me explain"; 4.4 M views "7d ago", 21.5 M subscribers | the owner's screenshot of the YouTube page, 26 Nov 2026 (`public/figures/veritasium.jpg` is its video frame) | OK as of that screenshot |
| 18 Nov 2026, the embassy | the project's presentation at the Embassy of Lithuania in Tokyo: the Ambassador's welcome, the two project leaders (15 min each), RIKEN researchers; scientists of both countries and the embassy's guests | the Tokyo talk's Brief (`talks/2026_11_18_Tokyo/CLAUDE.md`: the owner, 5 and 11 Nov) | OK; no public page found; the event's name and a photo: CHECK |
| Sophia and Mikas | MSc theses defended in 2026; Margarita's thesis is not on VELO; Dominykas is in MSc year 1 | the owner's word (26 Nov 2026) | OK |
| "Nominacija LRT apdovanojimams" | an LRT award nomination | the owner's word (26 Nov 2026); LRT's page of 25 Nov 2026 names categories, no nominees | CHECK (award, category, who) |
| 11 000 km, 524 288, 670 nm, 12 layers, 6 m × 5 m | the SciFi and its light injection system | facts `lhcb-scifi`, `lhcb-scifi-channels`, `lhcb-scifi-lis-vcsel`, `lhcb-scifi-layout` | OK |
| "nuo 2026 m. sausio tiriamos Vilniuje" | irradiated SciFi fibres in Vilnius | the group briefing of 13 Jan 2026 | OK |

## Open questions

For the owner, one list. Since 27 Nov 2026 the open marks are here and no longer on the slides or
in their notes (`docs/talk-quality.md` §3, rule 11): the slides say only what a source supports,
and `pnpm talk ready` runs with its lint step.

1. Slides 10 and 11: what the group did on the light injection system in 2026 and what comes
   next; the results of the fibre measurements; what the prototype module of slide 10 is (the CAD
   names a prototype with a cold box; the slide calls it „SciFi modulio prototipas“ and no more),
   and whether its geometry may be shown publicly as grains. Publicly confirmed is only that SciFi
   and the LIS are the group's service work.
2. Slide 13: a photo of the embassy event of 18 Nov (none in Drive, Gmail or on this Mac on
   27 Nov; the workshop's photos are in Drive, `Photos/2026-11-24_Nagoya_Japan/Workshop`); the
   event's name and who else spoke. The slide's place for the photo is gone: the Nagoya group
   photo stands whole in its column.
3. Slide 17: which LRT award and category, and who is nominated. LRT's page lists the categories
   (the science one is „Metų atradimas“), no nominees in its text (27 Nov); the slide says
   „Nominacija LRT apdovanojimams“.
4. Slide 14: LDFK's funds to the group in 2026, LHCb Week's total budget, the fees' sum, the VU
   educational-initiative sum (the last two are named under the table without a sum); whether
   PHANTOM's 197 k EUR may be shown.
5. Slide 3 (optional): whether Dainius, Karolina and Venera left; when Anni starts; Gustė's
   surname.
6. Slide 5: the final attendance of LHCb Week from Indico (the slide's ~200 and ~600 are the
   forecasts of VU's news item); the poster count (21) is from the registration list.
7. Slide 16 (optional): summer talks; Confinement 2026; the students' talk titles.
8. Slide 6: the sponsor list and its tiers; one logo of the grid was not read („VVT“?). The reach
   figures are settled (the communication report, 27 Nov).
9. Slide 18 (optional): Mikas' and Margarita's thesis topics; the BSc theses' topics and dates.
10. Slides 12 and 15: the state of the VELO work and of the three papers on the day of the talk;
    how many shifts the group took in 2026.
11. Slide 7 (optional): the dates of the October visit and whether U. Bassler came with
    C. Fountas.
12. Slide 13 (optional): the place and dates of the October 2027 workshop; the project's start
    (1 May in the briefing, April 2026 in the Tokyo talk).
13. Slide 1 (optional): the date of the council's meeting (a Doodle was open on 24 Nov).

## Talk-owned code

- `setup/team.ts`: the people, their tile's place on the board, the year they
  join and the year they are shown as alumni from; `pos` and `zoom` frame a
  person's photo inside the tile; `openSlots` are the outlined places of the
  2027 step. Edit this to change the honeycomb.
- `setup/HexTile.vue`: one hexagonal photo tile with thickness (stacked
  clipped layers in a preserve-3d box). `<HexTile who="ruta" :size="96" />`.
- `setup/HexTeam.vue`: the honeycomb. `<HexTeam :year="2026" />`; tiles whose
  year has not come wait behind the board and fly to their place. `:focus`
  takes ids from `team.ts`: those tiles come forward and the rest fade (who
  does what, a click at a time); `:until` is the last year the deck shows, so
  the board is no wider than the columns in use; `settled` puts the tiles
  in place at once. CSS 3D, no
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
- `public/figures/veritasium.jpg`: the video frame cut from the owner's
  screenshot (26 Nov 2026), credited on the last slide.
- `public/figures/lw_*.jpg`: stills from the aftermovie (only `lw_hall` is
  used now); `nagoya_workshop.jpg`: the workshop's group photo; `scifi.jpg`:
  CERN's photo of a SciFi frame going into the cavern (`assets/photos/photos.toml`).
- Kit classes added 27 Nov: `.world-nums`, `.world-legend`, `.world-cap` (numbers, a legend and one
  line on a slide whose picture is the world), `.chain` (steps left to right, an arrowhead between
  them), `.credits` (the foot of the last slide); the `html[data-stage]` rules at the file's end.
- `bake/lis_module.py`: the module's grains from the CAD's STEP file (FreeCAD).
- `setup/interiors.js` and `setup/grains.js`: the Tokyo talk's `interior` builder (the molecule,
  the compact particle, the hadroquarkonium, each moving) and the grains' material it needs, copied
  as they are on 27 Nov; `setup/main.ts` registers the builder; `vite.config.ts` is Tokyo's (one
  `three` for setup/ and the engine under `slidev dev`).
- Kit classes added 26 Nov: `.kick b` (the point's number), `.kpi.long`
  (a long number in a narrow panel), `.ref` (a paper), `.team-side h3`, `.rl`,
  `.after` (the text beside a honeycomb with people picked out),
  `.cover-rep .d` (the direction on the cover).
- Kit changes of 26 Nov, second round: list items have their own line-height
  (1.36; the theme's 1.8 made a wrapped bullet read as two); panel headings
  are in rem; `.ph.slot` is the place of a photo still owed; `.team-side` has
  one height, so the text beside the board starts at the same line at every
  click. A slide whose extra item does not fit a column puts it in a
  full-width strip under the row of panels (slides 9, 12, 13, 16).

- 27 Nov 2026, the owner, after the deploy of 370b103: "Go Vilnius contribution can be merged in
  65kEUR from private sector". Slide 14: the row „Go Vilnius“ (20) became „Privatus sektorius“,
  65 k EUR for LHCb Week, and the total 462 (was 417); the sponsors left the line under the table,
  the fees stay there. Claude's reading: 65 is the whole private-sector sum with Go Vilnius' 20 in
  it, not 65 beside it. Go Vilnius stays among the partners on slide 6.

- 27 Nov 2026, the owner, three more: the communication report on LHCb Week's media coverage
  (a file); "Don't need to show another 3 slides on PhDs and Anni, I will already cover at the
  start"; "maybe we start with a cold-starter - LHCb week aftermoview?". Done:
  - Slide 6 carries the report's figures (52 mentions on 10–17 Sep, 11.9 M potential audience, 35
    on the opening day, LRT 16 and Delfi 7) in place of the Faculty list's 37. Slide 17's chart is
    still the Faculty's list, and says so, because the report covers one week: its September bar
    (37) counts articles and programmes, the report every mention.
  - The slide „Doktorantai ir podoktorantė“ (three steps) is gone; what it said of Rūta, Šarūnas
    and Anni is in the notes of the directions slide. It is in 370b103
    (`git show 370b103:talks/2026_12_00_LDFK/deck.md`).
  - The aftermovie is slide 2, straight after the title, and no longer sits between the LHCb Week
    slides. Claude's call: the title stays slide 1 and not the film, so that the PDF opens on the
    title, the film has a slide before it to buffer, and the press that starts it lets the browser
    play its sound. To open on the film itself, move the film's slide above the cover's content
    (the headmatter stays first) and give it `:autoplay="false"`.

- 27 Nov 2026, the owner: "The cover pentaquark can be the one from tokyo embassy, where we have 3
  different types (can show all three)". Station `hero` holds Tokyo's three `interior` forms in
  place of the five-node constellation: a triangle at the right of the cover and of the last
  slide, behind the panels of slides 15 to 17. No labels on them (the cover is a title; the notes
  of slides 1 and 15 name the three). Their colours are Tokyo's: light blue, cyan, rose, violet.

## The world

- `stage:` in the headmatter: palette `blue`, `plugins: [lhcb]`, no sound, no halo, a faint film
  grain (0.006; `grain: 0` would make `talk ready` treat the deck as a broadcast talk and run the TV
  safe-area check), `motion: floor`. Five stations in `public/data/space.json`: `hero` (the three pictures of the pentaquark, Tokyo's `interior` forms:
  molecule, compact, hadroquarkonium), `group` and `projects` (open dust), `lhc` (a collider
  ring), `det` (LHCb's Run 3 geometry, the plugin's `detector`, SciFi white and the rest faint),
  `lis` (the module's end: the same builder on this talk's own grains, `public/data/lis-module.bin`).
- Every slide has a `space:` pose; `steps: { det, lis }` in the frontmatter of slides 8 to 13
  lights the two forms and puts them out.
- The grains of the module: `bake/lis_module.py` (FreeCAD reads the CAD's STEP file, which is not
  in the repository). Groups: fibre mats, panels, cold box, electronics, cooling, light injection.
- The PDF and print take `public/stills/NN.jpg`, the world alone at each slide's pose:
  `node talks/2026_12_00_LDFK/node_modules/slidev-addon-stage/bin/shots.mjs /tmp/talk-ldfk/site
  talks/2026_12_00_LDFK/public/stills --stills` through `pnpm talk render --`, after a build; make
  them again after a pose or the space file changes, then export the PDF.
- Without WebGL the stage shows the still, drifting (no plates recorded: `pnpm talk record ldfk
  --plates` and a publish would add them).
- The stage's kit sets its own typeface and title size on `html[data-stage]`; the end of
  `styles/index.css` puts the deck's back and drops the veil the theme's photograph needed.

## Decisions

- 27 Nov 2026, the owner: "was working on ldfk talk, improve it, and deploy"; then "Can have some
  dynammic background like in tokyo embassy talk, but should also look good on pdf"; "also need to
  expand on LIS, can take some ideas from uzsikrauk karjerai"; "just no soundtrack"; "this is the
  real geometry if you need it" (a STEP file of a SciFi module). Done:
  - The open marks left the slides and the notes for "Open questions" above. Slide 14 lists only
    rows with a sum; what has none is named under the table. The embassy photo's empty place is
    gone. To put a mark back on a slide: `<span class="todo">…</span>` (the kit keeps the class).
  - The stage, silent, as the background (The world, above). The deck keeps its PT Serif and its
    panels (Claude's call: the owner asked for the background, not for Tokyo's wordless slides).
    To undo: drop `slidev-addon-stage` from `addons`, the `stage:` block and the last section of
    `styles/index.css`; the `space:` lines are then ignored.
  - The light injection system has four slides, 8 to 11, where it had one: LHCb's real geometry
    with SciFi lit; Užsikrauk karjerai's module clip (a second copy on this talk's release, as the
    aftermovie is; a third talk using it says it belongs in the library); the module's end from
    the owner's CAD file as grains; how the system works, in five steps from the facts bank
    (`lhcb-scifi-lis`, `lhcb-scifi-lis-vcsel`). What the group did on it in 2026 is still not on a
    slide: no source at hand says (Open questions, 1).
  - Claude's reading of the CAD file: its part names say a prototype module with a cold box, LEDs
    and light-injection fibres across the mats' ends. The slide says „SciFi modulio prototipo
    galas pagal konstrukcinį (CAD) modelį“ and nothing about what the prototype is for. The site
    carries 167 000 points sampled from its surfaces, not the model.
  - Layout, from two sheet reviews by subagents: the page number on the kicker's line (at the
    foot it met the panels' borders), none on the last slide; the open-data strip of slide 12
    folded into its first panel; one-line panel headings and one way of naming people there; the
    Veritasium frame cut lower; the media chart as tall as its column; the honeycomb at 108 px and
    its side text at the `roomy` size; credits at the foot of the last slide, with the licence
    line of LHCb's geometry (GPL-3.0, HSF Phoenix).
  - Wording: „Rankraštis baigiamas“ for the ECC paper (the slide said „iki gruodžio“, which goes
    stale in December); „pirmiausia, LHCb fizikos koordinatoriaus prašymu“ for the first Run 2
    paper.


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
  - The directions: a slide of three (spectroscopy; data and software; detector), the same three
    as last year's report; one sentence of them on the cover and a key number on slide 2.
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

- 26 Nov 2026, the owner: "The hexes with pictures should be larger, and then we can use the same
  layout to focus on who's doing what, select one or few people at a time". The honeycomb is 112 px a
  tile (88 before, 106 on 25 Nov) and no wider than the six columns in use; `HexTeam` has `focus`. The
  directions slide and the PhD slide are the honeycomb with clicks (Claude's choice of slides); the
  students' slide keeps its panels, for the theses and the placements. The direction's sentence
  moved to the cover to give the tiles the height.

- 26 Nov 2026, the owner, after reading the reworked deck: "Don't need slide 2. My photo is a
  incorrectly cropped in 3. Mikas also defended MSc thesis. It's clear what grey ones are, don't
  need to state it. Moksline veikla with these hexes should go directly after the group
  introduction. atviro žavesio - open charm in italic. veritasium need a screenshot, on randomness.
  11 11 we didn't do. need more info on 11 18 event in the embassy, a photo. VU atvirojo mokslo we
  din't get, don't mention. mention Guste only in growth in 2027. margarita MSc not on Velo,
  Dominykas still in year 1. Rework the style / flow / wording a bit." Then the owner's screenshot
  of the Veritasium video. Done:
  - The numbers slide is gone: 17 slides.
  - The directions slide follows the group slide and carries point 1's kicker (the consortium's
    point 1 asks for the group's direction); point 5 opens with the pentaquark slide.
  - Gustė is on the group slide's new 2027 step only, with two open places (Claude's reading of
    "only in growth in 2027": the step the deployed e3e04c3 had). With the October workshop
    (below) it is the deck's only look ahead; to drop it, set the group slide back to `clicks: 2` and three years. Her line on the PhD slide
    is gone.
  - „atviro žavesio“ is *open charm*, in italics, in the title and the text of slide 12 (Claude's
    reading: the English term in place of the calque; the notes explain it in a sentence).
  - The Veritasium frame is on slide 13 with the video's title and its views; the open mark is
    closed. The frame is cut from the owner's screenshot and credited on the last slide.
  - The Reinterpretation workshop (11 Nov) and VU's open-science competition are off the slides
    and the notes.
  - The embassy event has its own panel on slide 10 (from the Tokyo talk's Brief) and a marked
    place for its photo: none was found in Drive, Gmail or on this Mac, and no public page
    reports the event. The talks list names it as the project's presentation, not as a "forum"
    (a name an earlier draft had without a source).
  - Sophia and Mikas: MSc theses defended. Margarita: writing hers, no topic on the slide (not
    VELO; her VELO placement at CERN stays under the placements). Dominykas: MSc year 1.
  - The grey tiles' legend is gone.
  - The owner's tile uses the OpenData talk's portrait (`2026_10_21_OpenData/public/figures/people/
    mindaugas-sarpis.jpg`): the old square was a stage shot from below, face low and turned.
    Twelve other tiles are reframed with `pos`/`zoom` in `setup/team.ts`.
  - Style, from a sheet review by a subagent: the list line-height, uneven panels evened out on
    slides 7, 9, 10, 14 and 16, the tiles' names at the type floor, the leader's rim fading with
    his tile, slides 9, 12, 14 and 16 at the default type size. Not taken: abbreviated month names
    in the dated lists (the numeric „09 15“ is the Lithuanian form) and moving „Lietuva ir CERN“
    before LHCb Week.

- 26 Nov 2026, the owner: "workshop with japanese colleagues will be held in October". One line
  on slide 10, „Kitas bendras darbo seminaras: 2027 m. spalį“ (Claude's reading: the next October,
  2027; no place given, so none is named).

## Verify

```bash
pnpm talk check ldfk     # the lockfile, videos:check, a build into /tmp/talk-ldfk/site
pnpm talk lint ldfk      # 0 errors; CHECK and WORDS warnings are expected
pnpm talk shots ldfk --sheet
pnpm -C talks/2026_12_00_LDFK export --with-clicks   # the PDF, one page per click; move it into public/
pnpm talk ready ldfk     # before the venue: needs the open marks settled
```
