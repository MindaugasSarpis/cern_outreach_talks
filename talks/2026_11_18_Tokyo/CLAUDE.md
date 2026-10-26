# Lithuania and Japan: the bilateral project (talks/2026_11_18_Tokyo)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/tokyo.md, never here.

## Brief

Private context (sources, people, budget): `~/.local/share/outreach_talks/briefs/tokyo.md`.

- Event: introduction of the Lithuanian–Japanese bilateral research project
  (Vilnius University LHCb group and Nagoya University theory) at the
  Embassy of the Republic of Lithuania in Japan, Tokyo. Project details
  (name, funders, dates, meetings) stay in the private brief until the owner
  says they may be shown: the site and its speaker notes are public.
- Date and slot: 2026-11-18; **30 min** (owner, 2026-10-26, via the Scheduler: "Tokyo is now a
  30-minute talk"; it was built as 15), time of day TBC
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
- Spine (30 min, 2026-10-26; one line, Innoday's lesson): Japanese physics
  named what holds matter together (Yukawa's force, 1935; Sakata's three
  building blocks in Nagoya, 1956; Kobayashi and Maskawa's six quarks, 1973,
  whose b quark is LHCb's "b"); LHCb found five quarks bound together in the
  decays of a particle carrying that b quark; whether they are held by
  Yukawa's force, as a molecule, is the question Vilnius (LHCb data) and
  Nagoya (theory) now answer together. The finale closes the cover's loop:
  the camera runs back along the whole route and the cover's pentaquark
  gathers again on the music's peak.
- Banned: fundraising amounts unless the owner says; unchecked citation counts.

Open questions: sent to the owner 2026-10-10 (see Decisions for the defaults).

## Status

- Branch `talk/tokyo`, worktree `.claude/worktrees/tokyo` (`pnpm talk open tokyo`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_11_18_Tokyo/
- 2026-10-27: 30-min iteration on talk/tokyo, not deployed (the live site is
  still the 15-min deck): 21 slides, 27.9 of 30 min, lint 0/0, `talk check`
  ok. Next: the review round's fixes; then, once the Scheduler relays v0.11:
  pin, record the finale on its recorded mode (Decisions, 26 Oct), plates, ready;
  main from the Scheduler for a deploy.
- 2026-10-11: v0.8.1 deployed: commit 8bd087b, Pages run 38090919117
  (success), URL 200, the live walk passed all 12 slides. Stills 01–12 in
  `public/stills` for print and the fallback.
- 2026-10-11: title slide deployed: commit dc6691d, Pages run 38088298046
  (success), URL 200, the live walk passed all 12 slides. Open: affiliations
  under the names, the project's dates, funders and the Nagoya meeting (the
  owner's list).
- 2026-10-10: first version deployed for the owner's review: commit 40aaef6,
  Pages run 38085599191 (success), URL 200, the live walk passed all 12
  slides, listed on the site index. 12 slides, 14.8 of 15 min; lint 0/0.
  Next: the owner's answers to the 10 Brief questions (on the Scheduler's
  list), above all whether the project's dates, funders and the Nagoya
  meeting may be shown.
- `pnpm talk deploy` records each deploy in `.git/talk-status/tokyo.json`;
  `pnpm talk status` shows it.

### Open for the owner (one list, 2026-10-27)

From the 10 Oct Brief questions, the ones that still matter (defaults in use):
1. The project's dates, funders and the Nagoya meeting: may they be shown or
   said? (Default: neither; the project slide shows the two teams only.)
2. Affiliations under the two names on the cover: Yamaguchi's reads Nagoya in
   the application and Tokyo Metropolitan University in the 2026 memo. Which?
   (Default: none.)
3. The time of day and the room's screen: 16:9 projector or TV? (Default:
   16:9 projector.) Is Q&A outside the 30 min? (Default: yes.)
4. Spoken English throughout, or a greeting in Japanese or Lithuanian?
   (Default: English.)
5. Photos of the Vilnius group or the Nagoya partner, with their consent?
   (Default: no faces of living team members; places only.)

The 30-min Arc's choices:
6. The spine: the Japanese thread (Yukawa 1935, Sakata 1956 in Nagoya,
   Kobayashi–Maskawa 1973, Belle 2003) into the project. Keep it, or less
   history and more pentaquark physics?
7. Name the LEPS (SPring-8) 2003 Θ⁺ claim at the embassy? It was not
   confirmed. (Default: in the notes only, said with care, nothing on screen.)
8. Is Yasuhiro Yamaguchi an author of the Pc molecule papers cited on slide 16
   (Yamaguchi et al., PRD 96 (2017) 114031)? If so, slide 16 can say so.
9. The finale's music: Starfire again (Innoday, Karjera) or another Scott
   Buckley track? And the finale's idea: the route back and the cover's
   pentaquark gathering on the peak.
10. Slide 18 is CERN's SciFi cabling photo (Nov 2019) cropped clear of the
    technician's face. Keep, or another SciFi picture?
11. The CC BY chart of LHCb's 76 hadrons beside Belle's 34
    (LHCb-FIGURE-2026-010): fetch it for slide 14? (CDS blocks the script.)

## Arc

30-min cut (2026-10-26). Pictures and numbers only; photos are full-bleed
StagePhotos; world pages carry the portraits. New slides carry only their
facts ids, sources and minutes in the notes (owner: no script writing).

| # | Station | Picture | On screen | Spoken | Min |
|---|---|---|---|---|---|
| 1 | hero | five quarks fly in, the hum | project name, two names | thanks; who we are; what follows | 1 |
| 2 | lhc | aerial photo, ring drawn (CERN) | 27 km LHC | the LHC; Lithuania and Japan at CERN | 1.25 |
| 3 | lhc | clip lhcb.mp4 | | LHCb, my experiment | 0.8 |
| 4 | lhc | LHCb collaboration photo (2022) | 1 891 members, 28 countries | the collaboration; Vilnius since 2024 | 1 |
| 5 | atom | grain cloud, bright point | | atoms are empty; the nucleus | 1 |
| 6 | nucleus | protons and neutrons; Yukawa's portrait | 1935 meson | the strong force; Yukawa's meson | 1.5 |
| 7 | proton | u u d | 1 % mass | quarks; never alone; mass from energy | 1.5 |
| 8 | families | meson and baryon | | the two recipes | 1.25 |
| 9 | sakata | Sakata's portrait | 1956 Nagoya | three building blocks: the step before quarks | 1.25 |
| 10 | paper | Gell-Mann, Zweig, passages | 1964 quarks | five quarks allowed on paper | 1.5 |
| 11 | km | Kobayashi and Maskawa | 1973 six quarks | the third family; b is LHCb's "b" | 1.5 |
| 12 | km | Belle photo (KEK) | 2003 KEK | CP violation confirmed; X(3872); LEPS | 1.5 |
| 13 | lhcb | 2019 spectrum, pentaquark | 2015, 2019 | the discovery, from Λb (b quark) decays | 1.75 |
| 14 | families | the two hadron families again | 76 hadrons | particle zoo 2.0; Belle 34 | 1.25 |
| 15 | interiors | molecule and compact ball | | the open question | 1.5 |
| 16 | interiors | the molecule up close | | held by Yukawa's mesons? Nagoya's theory | 1 |
| 17 | project | Vilnius University photo | 2024 LHCb, 13 students | the Vilnius group | 1.25 |
| 18 | project | SciFi photo (cropped, no face) | 524 288 Hamamatsu sensors | Japanese sensors in the detector Vilnius serves | 1 |
| 19 | lhcb | the spectrum again | 38.3 TB open data | a VU student finds the pentaquark again | 1 |
| 20 | project | two teams (VU, Nagoya photos), one pentaquark | | the project | 2 |
| 21 | hero | finale: back along the route, dark, the five quarks gather on the peak | | close; thank you | 1.25 |

Total 27.0 min of 30 by the notes. On camera, speech ran 15–25 % over
the script in the October talks, so this leaves room for that.

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 27 km | LHC ring 26,659 m (over the tunnel photo since 2026-10-26) | home.cern | 2026-10-10 | cern-lhc-size-cost | OK |
| 1 % | quark masses ≈1 % of proton mass | BNL / PRL 121 212001 | | proton-mass-quarks-1-percent | OK |
| 1964 | Gell-Mann, Zweig papers | Phys. Lett. 8 214; CERN-TH-401 | | quark-model-1964-papers | OK |
| 2015, 2019 | LHCb pentaquarks | home.cern; lhcb-outreach | | lhcb-pentaquark-2015/-2019 | OK |
| 1 891 | LHCb members, Sep 2026 | LHCb SPC report (Gershon) | 2026-09 | lhcb-collaboration-sep-2026 | OK |
| 1935 | Yukawa's meson paper (proposed 1934) | J-STAGE; Osaka University | 2026-10-26 | yukawa-meson-1935, yukawa-meson-announced-1934 | OK |
| 1956 | Sakata's model, Nagoya | PTP 16 (1956) 686; Nobel background 2008 | 2026-10-26 | sakata-model-1956, sakata-nagoya-1956 | OK |
| 1973, six quarks | Kobayashi–Maskawa (submitted 1 Sep 1972) | PTP 49 (1973) 652; nobelprize.org | 2026-10-26 | kobayashi-maskawa-1973 | OK |
| 2003 | Belle's X(3872) at KEK | PRL 91 (2003) 262001; PDG | 2026-10-26 | belle-x3872-2003, x3872-started-exotic-searches | OK |
| 76 hadrons | LHCb's hadron discoveries | LHCb-FIGURE-2026-010 (CDS 2970971) | 2026-09-21 | lhcb-figure-2026-010-hadrons | OK |
| 2024 | VU joins LHCb | VU | | lhcb-vilnius-joined | OK |
| 13 | VU students at CERN, summer 2026 | VU news | | lhcb-vilnius-students | OK |
| 524 288 | SciFi SiPM channels (Hamamatsu) | arXiv:2305.10515; hamamatsu.com | 2026-10-26 | lhcb-scifi-channels, hamamatsu-lhcb-scifi-sipm | OK |
| 38.3 TB | open data filtered in a VU BSc thesis | VU epublications | | stonkus-bsc-2026 | OK |

Speaker's caveats from the 26 Oct research lane (said, never on screen):
- Yukawa: say "proposed in 1934, published in 1935"; a "received 17 Nov
  1934" date was removed from J-STAGE as an erratum.
- X(3872) (PDG now χc1(3872)): its discovery "initiated" the searches beyond
  quark–antiquark; never "the first exotic". It lies within 200 keV of the
  D⁰D̄*⁰ threshold.
- Pion exchange in the Pc states: PDG reads them as deuteron-like, but single
  pion exchange is impossible in Σc D̄ (the Pc(4312)); it can act in Σc D̄*
  (Pc(4440), Pc(4457)). Models such as Yamaguchi et al. (PRD 96 (2017)
  114031) add a short-range five-quark part. Say "one of the glues".
- LEPS's 2003 Θ⁺ at SPring-8: later, more sensitive experiments did not
  confirm it (PDG); it started the worldwide search. Said with care.
- Kobayashi–Maskawa: written at Kyoto, both Nagoya PhDs from Sakata's school.

Open: provenance and licence of `GellMannPhoto.png`, `ZweigPhoto.png` and
the two passage scans (copied from Startertalk, not in photos.toml). If a
licence asks for a credit, it goes in tiny print on the close slide.
Open (26 Oct): LHCb-FIGURE-2026-010's image (CC BY 4.0) could not be fetched
(CDS's bot check; `photo_fetch.py` reads only photo records), so slide 14 is
"76 hadrons" over the 2019 spectrum; the chart (Belle 34 beside LHCb 76)
would suit a Japanese audience. The new photos are in photos.toml; their
credits are in tiny print on slide 21 (CERN's need none).

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/Soundtrack.vue`, `slideHooks.js`, `soundLevel.js`: copied 2026-10-26
  from Užsikrauk karjerai (the newest copies) for the finale's music: `drop`
  times Starfire's peak off the recorded clip's clock; `+`/`-` set the level,
  seen only in the presenter window. They move into the toolkit later.
- `setup/CloseStill.vue`: copied from Innoday; the finale clip's last frame
  on the page after it, with the world resting.
- `setup/Regather.vue` (this talk's): `<Regather :at="35" />` re-runs the
  assembly of the station the camera is at, `at` engine-seconds after the
  slide opens (the finale's loop back to the cover). It is timed off the
  engine clock, so a take lands it on the same frame each time.
- `public/audio/starfire_close.m4a` (the track 0:30 to its end) and
  `starfire_close_peak.m4a` (from 2:52.85; the peak, the downbeat at 2:54.85,
  is 2.013 s in): Innoday's files, Scott Buckley „Starfire“, CC BY 4.0.
- `styles/index.css` `.hero`: the full-bleed StagePhoto slides, with a dark
  corner behind the numbers.

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-10 (Scheduler defaults, owner to confirm): stage palette classic,
  `lang: en`, 15 min, 16:9.
- 2026-10-10: toolkit pinned to v0.7.0 (both addons).
- 2026-10-10: cover stripped to the stage alone; the title lives only in the
  page `title:` headmatter.
- 2026-10-10: Brief questions sent; defaults used until answered are those
  in the message (15 min talk + Q&A separate, projector 16:9, English, no
  people photos without consent, classic palette).
- 2026-10-10 (house rule, main 51f4c3e): credits a licence requires go in
  tiny print on the last slide only; CERN material needs none. Nothing else
  on screen but numbers.
- 2026-10-10 (owner: "Go ahead, also take elements from startertalk (like
  gell mann and zweig papers / photos)"): AFK protocol. Built on the Brief
  defaults: 15 min, 16:9, English, classic palette, no faces of living team
  members. Reused from Startertalk: the 1964 paper station (Gell-Mann and
  Zweig portraits and passages, the five-quark cluster), the hero pentaquark,
  the molecule-vs-compact pair, the LHCb 2019 J/ψp spectrum. Undo: drop the
  stations from `public/data/space.json` and their slides.
- 2026-10-10: only shipped stage forms (collider, constellation, the hadron
  plugin's pentaquark/cluster/molecule, page, tracks); no talk-owned builder,
  so no new world mechanic needs the two-slide prototype. The project slide
  is two constellations (the Vilnius team, cyan; the Japanese team, rose)
  with lit tracks into a pentaquark between them, not a geographic map
  (the constellation's nodes orbit, so a map would need a new builder).
  Alternative: a globe builder with Vilnius, CERN and Nagoya, prototyped
  first.
- 2026-10-10: on-screen numbers are 27 km, 1 %, 1964, 2015, 2019,
  (`.num` in `styles/index.css`, #e8f6ff). Everything
  else is in the notes.

- 2026-10-10 (owner rule, main 8c7fd47, then "fewer words so I can adapt to
  the audience; these slides are not lecture slides", via the Scheduler):
  one word under each number (27 km LHC, 1 % mass, 1964 quarks, 2015
  discovery, 2019 precision); world
  names only where the picture needs them: Gell-Mann, Zweig, Vilnius
  University, Nagoya University. Everything else is narrated. The opener is
  the pentaquark picture alone (no title or section slides).
- 2026-10-10 (AFK, "complete everything"): added the library clip lhcb.mp4
  (0:47, the LHCb detector in 3D with music) after the LHC slide, so the
  embassy sees the real detector once; the LHC slide drops to 1.25 min.
  Undo: delete the clip slide and `public/video-frames/lhcb*`.
- 2026-10-10: three sheet reviews by subagents (busy, meaning, legibility,
  framing); fixes in a22923a, c7f7d1c, 8f987b2.

- 2026-10-10 (Scheduler, owner AFK): nothing sourced only from the owner's
  own mail or Drive goes into the deck, its notes or this file, because the
  Pages site and the notes are public. The project slide shows the two teams
  and the pentaquark with no dates; the project's name, funders, dates and
  the Nagoya meeting wait for the owner's yes (question 5). The page title
  no longer carries the project acronym. Earlier commits on `talk/tokyo`
  (66cec05 … bae5c35) still hold those details in history; whether to
  rewrite the branch is the owner's call.

- 2026-10-11 (owner via the Scheduler: "Embassy talk should have a title
  indicating myself, yasuhiro, full name of the project"): a title slide, an
  exception to the no-title rule for this talk only. The project's full name
  (as in the application), "Mindaugas Šarpis · Yasuhiro Yamaguchi", white and
  light blue, left of the pentaquark, fading in as it assembles. No
  affiliations: Yamaguchi's reads Nagoya University in the application and
  Tokyo Metropolitan University in the 2026 workshop memo, so it does not
  read cleanly in a word or two. Lint's TEXT warning on slide 1 is this
  exception. The project's name is now cleared for the site; its dates,
  funders and the Nagoya meeting still wait for the owner.

- 2026-10-11 (owner: "update talks to latest tools"): toolkit v0.8.1 (v0.8.0 plus the print-dim fix);
  `public/stills/01–12.jpg` from `slidev-stage-shots --stills` for print,
  PDF and the fallback. The rasterised PDF (pypdfium2) matches the stills
  page by page, the title and numbers print, so the slide-1 dim print bug
  does not touch this deck (dim 0.15) and no `.scrim` workaround is added.
  The clip slide prints dark (a video has no print frame).

- 2026-10-26 (owner, via the Scheduler: "Tokyo is now a 30-minute talk";
  one iteration to that length; AFK-style hand-off, the 10 Oct defaults
  kept): the 30-min Arc above, 21 slides, 27.9 min by `talk map`.
  - The spine is the Japanese thread (Yukawa, Sakata, Kobayashi–Maskawa,
    Belle) into the Vilnius–Nagoya project (Brief). Alternative: the 15-min
    story stretched with more physics; rejected because one line a diplomat
    can retell, with Japan in every chapter, suits the embassy.
  - Real photos where the 15-min cut was schematic: the LHC tunnel (CC BY,
    CERN) for 27 km, the LHCb collaboration photo, Belle, Vilnius University,
    the LHCb cavern; portraits as world pages (Yukawa, Sakata, Kobayashi,
    Maskawa). Dropped on a by-eye check: CERN's aerial (its ring and labels
    are drawn in gold) and the SciFi installation photo (a recognisable
    technician; the no-faces default). Undo: the slides' StagePhotos.
  - New slides carry only facts ids, sources and minutes in their notes (the
    owner's rule: no scripts); the old notes stay, "fifteen" made "thirty".
  - The finale (slide 21) is built live now as the take's source: a `path`
    back along the whole route (project → hero, 0–33 s), the world dark at
    33.4–35.2 s (`ambient`), the cover's pentaquark gathering again at 35 s
    (`<Regather>`). It is recorded on v0.11 (Scheduler, 27 Oct: its recorded mode
    decides how the take is cut and the music slaved; no take before it), as planned here:
    (`pnpm talk record tokyo --out DIR -- --slides 21 --fps 50 --hold 16
    --clicks none`, 4K taken down to 1080p as Innoday), published `--only`,
    and slide 21 becomes `<VideoPlayer src="finale.mp4" muted
    :controls="false" transition="fade" />` with `<Soundtrack
    src="audio/starfire_close.m4a" start :level="0.5" keys :drop="{ at: 35,
    file: 'audio/starfire_close_peak.m4a', hit: 2.013, duck: 32.4, quiet:
    0.06 }" />`, then a credits page on `<CloseStill>`. That is Innoday's
    pattern (the clip silent, the music live, its peak slaved to the clip's
    clock), not Karjera's live close. Starfire is reused (CC BY 4.0;
    credited once it plays). Alternative: another Scott Buckley track,
    measured the same way. No renders now: the toolkit release is being
    built.
  - Slide 14 is "76 hadrons" over the spectrum until the CC BY chart
    LHCb-FIGURE-2026-010 is fetched (Figures, open).
  - Not used, kept for later: the SciFi photo; the SPring-8 aerial
    (attribution only) for the LEPS line.

- 2026-10-27, first review round (a subagent on the contact sheet, 13
  findings; the high and medium ones fixed): the photo slides' corner shade
  is an element in StagePhoto's slot (`<div class="shade tr">`), because
  `.hero::after` showed no gradient in the shots; the Vilnius courtyard
  darkened whole (`class="darker"`); focus moved on the collaboration and
  Belle photos; slide 18 the SciFi photo, cropped clear of the face; slide
  14's "76 hadrons" over the two hadron families (it counted nothing on the
  spectrum); slide 19's number top left; `km` moved to x 188 (it showed at
  the paper station's edge); Yukawa's page as large as the other portraits;
  the project's photo pages larger and its labels out of the lower third; a
  pulsing track between the molecule's two parts at `interiors` (the binding
  the notes name). Left as they were (low; slides the owner already saw):
  the Zweig passage's small type, the families' meson quarks close
  together.

## Verify

```bash
pnpm talk check tokyo     # videos:check, stage:check, a build into /tmp/talk-tokyo/site
pnpm talk review tokyo    # check, then shots of the changed slides and a contact sheet
pnpm talk ready tokyo     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
