# Lithuania and Japan: the bilateral project (talks/2026_11_18_Tokyo)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/tokyo.md, never here.

The log to 5 Nov (the status rounds, the 27 Oct open list with its answers, the 30-min arc, the decisions of
10 to 27 Oct, the code list as it grew) is `notes/history.md`, moved there verbatim on 10 Nov. Read it when
a hidden slide comes back or an old choice is questioned.

## Brief

Private context (sources, people, budget): `~/.local/share/outreach_talks/briefs/tokyo.md`.

- Event: introduction of the Lithuanian–Japanese bilateral research project
  (Vilnius University LHCb group and Nagoya University theory) at the
  Embassy of the Republic of Lithuania in Japan, Tokyo. The project's name
  (owner, 11 Oct), its dates and its funders (5 Nov) may be shown; its
  meetings and the rest of the private brief stay there: the site and its
  speaker notes are public.
- Date and slot: 2026-11-18, 15:15–15:30: **15 min**, no Q&A slot (owner,
  5 Nov, the program; it was 30 min from 26 Oct). Prof. Yasuhiro Yamaguchi
  (Nagoya University) speaks next, 15 min, then RIKEN researchers; the
  Ambassador's welcome and greetings come before (the full program: the
  private brief).
- Venue and screen: embassy room; projector **1280 × 800** (owner, 5 Nov).
  The deck stays 16:9 on it: the scale is set by the width (1280/980), the
  bars are black on a dark deck, the 16:9 clips are not cropped. The room's
  audio may be poor: no music (5 Nov) but lhcb.mp4's own (10 Nov); the
  stage's hum and the finale's low bang.
- Audience: Japanese and Lithuanian scientists, from Nagoya, Tokyo and
  RIKEN (owner, 11 Nov), with the embassy's guests and dignitaries
- Language: English for slides and notes (`lang: en`); a greeting in
  Japanese and in Lithuanian, spoken (owner, 5 Nov); the finale's thanks in
  Japanese and Lithuanian (10 Nov).
- Look: slidev-addon-stage v0.11.0, classic palette on near black. One
  caption per slide, bottom left on a shade (`.cap`, `onscreen: words`;
  owner, 5 Nov: "Need more words on the slides"), saying plainly what is
  shown (10 Nov: no marketing lines); no titles but the cover's (owner,
  11 Oct: "a title indicating myself, yasuhiro, full name of the project").
- Story: owner, 27 Oct: "Need to introduce CERN, Lithuania, what quarks are,
  then what pentaquarks are (for Gell-Mann and Zweig). Show Nagoya / Vilnius
  on a globe indicate collaboration (maybe after zoomout video coming back).
  Then about the project itself from the Lithuanian side. Explain what LHCb
  is..." Must be very impressive.
- Takeaway (draft): Lithuania and Japan together are solving one of the open
  puzzles of matter, five quarks bound together, and training young
  scientists while doing it.
- Spine: CERN, the LHC and LHCb; matter down to quarks; the Japanese thread
  (Sakata in Nagoya, 1956; Kobayashi and Maskawa's six quarks, 1973, whose
  b quark is LHCb's "b"; Belle's X(3872) at KEK, 2003); LHCb's pentaquarks in the decays of a particle
  carrying that b quark (2019); how the five quarks are bound is the
  question Vilnius (LHCb data) and Nagoya (theory) answer together.
  Yukawa's pion and the molecule's theory are Yamaguchi's talk, next.
- Banned: fundraising amounts unless the owner says; unchecked citation counts.

## Status

- 2026-11-12, night (the owner: "deploy when finished"): **Deployed:** commit 081f75f (the evening round;
  Decisions, 12 Nov, evening), Pages run 43298898403 (success), URL 200, the live walk passed. `ready` ran
  inside the deploy with `safe` skipped; lint 0 errors, 1 warning (slide 6's WORDS, the equations). Onto the
  release before it: `data2019.mp4`, `finale.mp4`, `finale_loop.mp4` (all re-cut from the new takes) and the
  plates of the new order. A first deploy attempt stopped at `shots` (the pan's box off the frame, an equation
  17 px off the right, a fade interrupted by a press throwing in the toolkit's soundtrack); fixed in 081f75f,
  the last by a guard in `setup/main.ts` (`holdOnOverlap`; for the toolkit: the same catch in soundtrack.js's
  `release`). Slide 2's dust transition stays (the owner, after asking about it: "ah no, that's ok"). Not yet
  heard by anyone: the bed's levels and its two cross-fades. The venue zip on the Mac is of fbc1267.
- 2026-11-12, evening (the owner: "deploy"): **Deployed:** commit 1368cb5 (the 12 Nov round and the new order),
  Pages run 43287039315 (success), URL 200, the live walk passed. `ready` ran inside the deploy with `safe`
  skipped and passed. Before it, onto the release videos-2026-11-18-tokyo: `finale.mp4` (32 s),
  `finale_loop.mp4` and the plates of the new take (03 to 08, 13, 14, 16; 01 unchanged). The entry below was
  written before this deploy. Not yet heard or played by the owner on the Mac; the venue zip there is of fbc1267.
- 2026-11-12, later (the owner's seven points; Decisions, 12 Nov): on `talk/tokyo`, **not deployed, nothing
  published**. 18 slides, 14.4 of 15 min, lint 0/0, `talk check` ok. Checked in a browser on a build with the
  local encodes (d3d12): the recipes draw on a first visit, a visit back and a reload; the QCD curve; the
  finale handing over to its loop (the clip ended at 32 s, the loop running, the thanks up) and the loop on the
  last page; the music playing on 5, 12 and 17, silent on the slides after 5 and 12, carried from 17 onto 18.
  Not heard by anyone: the music's levels (0.6 under the two clips, 0.85 on the finale; `+` / `-` in the talk)
  and where its swells fall are set from the track's loudness curve, not by ear. Before a deploy: publish
  `finale.mp4` (re-cut, 32 s), `finale_loop.mp4` (new) and the plates of the new take, `--only`, with the deploy
  (Verify); until then the live deck plays the 30 s finale and has no loop (`<ClipLoop>` finds no file and
  stays out). `public/stills/` (16, of 5 Nov) were not re-made.
- 2026-11-12 (the owner, on the Mac the talk is given from: "deploy latest, build locally on mac"):
  **Deployed:** commit fbc1267 (the Dalitz plot's 2019 bands), Pages run 43185259851 (success), URL 200, the
  live walk passed. `ready --skip safe` passed on it on the Mac (plates: "stale" and 18-plate "unsettled", as
  before; the plate of slide 12 is the world alone and stays). The offline copy: `pnpm venue` there made
  `2026_11_18_Tokyo-venue.zip` (246.5 MB, all 20 clips local) and `dist-portable/`; not yet opened by the
  owner. The Mac (M2 Pro) was set up by hand, `scripts/bootstrap.sh` being Linux-only (bash 4, GNU stat and
  realpath, a Linux micromamba): the env with `conda env create -f env.yaml`, the settings file written by
  hand. Its headless Chromium needs `SLIDEV_STAGE_CHROMIUM_ARGS='--use-angle=metal'`: with XQuartz's DISPLAY
  the launcher takes its llvmpipe backend, ANGLE on Apple's OpenGL, and every screenshot times out ("no
  picture in 60000 ms"); through Metal the 18 shots pass.
- 2026-11-11 (the owner: "Deploy"): **Deployed:** commit 17dfc95, Pages run 43102870314 (success), URL 200,
  the live walk passed all 18 slides (no failed requests, no lost context). Before it the 11 plates of the
  new take went onto the release videos-2026-11-18-tokyo (7 uploaded, 01, 06, 07 and 08 were unchanged; a
  second dry run reads all 11 "unchanged"); `ready` ran inside the deploy with `safe` skipped and passed
  (plates: "stale", this file changed after the take, and 18-plate "unsettled", as before).
- 2026-11-11 (the owner: the audience is Japanese and Lithuanian scientists, from Nagoya, Tokyo and RIKEN;
  "Yes, also make sure the flow and talk is good"; Decisions, 11 Nov): the round the entry above deployed.
  Commit 2e4c9b6 on `talk/tokyo`: 18 slides, 14.6 of 15 min, lint 0/0, `ready --skip safe` passed on
  it (the Pages walk included; plates: 18-plate local only and "unsettled", as 17-plate was). A subagent
  judged the contact sheet of all 18 and fresh captures of slides 9, 14 (the clip at its end, the names up)
  and 16; its findings are applied or listed under Open. A new take of the plates is published with
  `pnpm -C talks/2026_11_18_Tokyo videos:publish -- --only <the plates the record prints>` before its deploy:
  `ready` checks a plate's name only, and the release keeps older takes under the same names.
- 2026-11-10, second round (the owner: "Push and deploy"; Decisions, 10 Nov, second round): **Deployed:**
  commit b109651, Pages run 42907009294 (success), URL 200, the live walk passed all 17 slides (no failed
  requests, no lost context). On the release videos-2026-11-18-tokyo, each the size of its local encode:
  data2019.mp4 (24 s, slide 10), globe.mp4 (20.6 s, slide 13), finale.mp4 (30 s) and ten plates (01, 06, 07,
  08, 09, 11, 12, 14, 15, 17; slide 10 is a clip now, so 10-plate.mp4 left the manifest and stays on the
  release until a prune after the talk). `ready` passed with one step skipped, `safe` (Decisions, second
  round, 10), and two plate warnings: "stale" (only this file changed after the take) and 17-plate
  "unsettled", as before. Before it: lint 0/0, `talk check` ok, 17 slides at 14.9 of 15 min, shots of all 17
  from a build with `VITE_VIDEOS_LOCAL_FIRST=1`, each plate's last frame checked on a sheet.
- 2026-11-10 (the owner: "deploy"): **Deployed:** commit 13472fd, Pages run 42815338931 (success), URL 200, the
  live walk passed all 17 slides (no failed requests, no lost context); `ready` passed on it with nothing skipped
  (four plate warnings, all cleared by the publish or known: 17-plate unsettled under its full-frame still). On the
  release videos-2026-11-18-tokyo, sizes checked against the local files: atoms_fast.mp4, cern_overview_swoosh.mp4,
  finale.mp4 and the 11 plates (the first publish was refused by the session's permission check; the second, on
  the owner's ask, went through).
- 2026-11-10: **the owner's 14 changes** (Decisions, 10 Nov).
  17 slides (a new slide 11, the Dalitz plot), lint 0/0, `talk check` ok; shots of all 17 clean but one
  (slide 11's top-down view ran 72 px off the bottom; fixed and re-taken in motion). Each changed slide was
  checked in motion (`slidev-stage-record`, strips): the cover, 2, 9, 10, 11, 12, 15 and the finale. Plates
  re-recorded. Open: the atoms clip's credit (the library
  says only "released/atoms.mov (outreach)").

- Branch `talk/tokyo`, worktree `.claude/worktrees/tokyo` (`pnpm talk open tokyo`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_11_18_Tokyo/
- `pnpm talk deploy` records each deploy in `.git/talk-status/tokyo.json`;
  `pnpm talk status` shows it.
- The rounds of 10 Oct to 5 Nov: `notes/history.md`.

### Open

- From 12 Nov: the music's levels and cut points were not heard by anyone; "effect across the board" and the
  globe's caption (Decisions, 12 Nov, 2 and 7); the 11 Nov list below keeps its slide numbers (its 9 to 16 are
  now 10 to 17, its "slide 16" hidden).
- From the 11 Nov review, for the owner, none of it done (each changes a slide the owner has reviewed):
  slide 11 without the Σc⁺D̄⁰ and Σc⁺D̄*⁰ thresholds the 2019 figure marks (fact `pc-2019-near-thresholds`;
  the molecule's case and the hand-over to the next talk); no slide says what the project measures or what
  Nagoya computes (it needs public content from the owner); 2015 is only spoken; for experts slide 8's
  caption could be "CP violation requires six quarks" and slide 3's −271.3 °C "1.9 K"; slides 4 and 5 are
  elementary for this audience (47 s and 26.5 s of clip); slide 10 says "five quarks" beside "a quark and an
  antiquark", and its Υ draws as a Latin Y; the last slide's still shows four of the pentaquark's five
  quarks (a finale re-cut); slide 7's caption box cuts the five-quark bubble's lower third; slide 11's axis
  is "mass of J/ψ p (MeV)" beside slide 12's "m²(J/ψ p) [GeV²]"; slide 16 spells one funder out and not the
  other; from 9 to 10 to 11 the camera goes back to `families` and forward again under dim 0.97, as it did
  from 8 before, not seen in motion.
- RIKEN's name on the globe beside the project's cities (Decisions, 11 Nov, 3).
- The atoms clip's credit: the library says only "released/atoms.mov (outreach)".
- Provenance and licence of `GellMannPhoto.png`, `ZweigPhoto.png` and the two passage scans (Figures).
- Not played by the owner on the Mac yet (12 Nov: built there, and headless Chromium drew all 18 slides
  through Metal): the live URL and the venue bundle in Chrome, on the projector's 1280 × 800 if it can be had.
- Questions 7, 8, 10 and 11 of the 27 Oct list are about slides now hidden (`notes/history.md`).

## Arc

1 cover: the CMS collision, the pentaquark out of its flash · 2 atoms_fast.mp4, music · 3 Sakata, 1956 ·
4 Gell-Mann and Zweig, 1964 · 5 Kobayashi and Maskawa, 1973 · 6 QCD: its equations and diagrams floating at
different depths · 7 the six quarks and their recipes in 3D, the pentaquark full screen · 8 Belle at KEK, 2003:
the X(3872) · 9 the CERN clip with its swoosh, 2018 at its end · 10 the LHC tunnel: 27 km, 13.6 TeV, −271.3 °C ·
11 lhcb.mp4, muted; „Age of Wonder“ starts here and runs to the end · 12 data2019.mp4: LHCb, a collision, the
2019 histogram, its fit and three peaks · 13 the 2019 Dalitz plot in 3D · 14 molecule, compact,
hadroquarkonium · 15 globe.mp4, the cities and RIKEN named at its end, the project's name, years and funders
in the caption · 16 the Vilnius group, a slow pan · 17 finale.mp4, the two flags behind the pentaquark, then
its loop · 18 thanks and credits over the loop and the flags.

**The order changed three times on 12 Nov** (Decisions, 12 Nov, 4, 9 and the evening's 1): the Decisions of 10 and 11 Nov, the code
comments and `takes/README.md` keep the slide numbers of their day, and so do points 1 to 8 of 12 Nov (their
5, 9, 11 and 12 are now 2, 6, 8 and 12).

18 slides, 14.4 min by the notes and clips (`pnpm talk map tokyo`). **Since 11 Nov every slide from the old 9
on is one higher, and since 12 Nov every slide from Belle to the group photo one higher again**: the Decisions
of 10 and 11 Nov below, the code comments and `takes/README.md` keep the numbers of their day (10 Nov's
"slide 10" is the data clip, now 12; its "slide 13" the globe, now 15). The project slide (2026–2028) is hidden
since 12 Nov. Eleven more are
hidden (`hide: true`, not deleted; remove the line to bring one back): the Vilnius zoom out and the coming
back, the LHCb detector (5 600 t), Lithuania at CERN (2018), the collaboration (1 891), the atom, Yukawa
(1935), the two hadron families, the molecule close-up, the SciFi's Hamamatsu channels (524 288), open data
(38.3 TB).

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 27 km | LHC ring 26,659 m (over the tunnel photo since 2026-10-26) | home.cern | 2026-10-10 | cern-lhc-size-cost | OK |
| 13.6 TeV | collision energy in Run 3, 6.8 TeV a beam (slide 3, since 2026-11-10) | home.cern | 2026-10-07 | cern-lhc-energy | OK |
| −271.3 °C | the LHC's magnets at 1.9 K (slide 3, since 2026-11-10) | home.cern | 2026-10-07 | cern-lhc-cold | OK |
| 1 % | quark masses ≈1 % of proton mass | BNL / PRL 121 212001 | | proton-mass-quarks-1-percent | OK |
| 1964 | Gell-Mann, Zweig papers | Phys. Lett. 8 214; CERN-TH-401 | | quark-model-1964-papers | OK |
| 2015, 2019 | LHCb pentaquarks | home.cern; lhcb-outreach | | lhcb-pentaquark-2015/-2019 | OK |
| Pc(4312)⁺, Pc(4440)⁺, Pc(4457)⁺; 4300–4500 MeV | slide 10's peaks and axis: the J/ψ p mass, data and fit | HEPData ins1728691, Table 3 (PRL 122 (2019) 222001) | 2026-11-10 | lhcb-pentaquark-2019 | OK |
| 2026–2028 | the project's dates (April 2026 – March 2028); funders: the Research Council of Lithuania, JSPS | the owner, 5 Nov (the private brief) | | | OK |
| 1 891 | LHCb members, Sep 2026 | LHCb SPC report (Gershon) | 2026-09 | lhcb-collaboration-sep-2026 | OK |
| 1935 | Yukawa's meson paper (proposed 1934) | J-STAGE; Osaka University | 2026-10-26 | yukawa-meson-1935, yukawa-meson-announced-1934 | OK |
| 1956 | Sakata's model, Nagoya | PTP 16 (1956) 686; Nobel background 2008 | 2026-10-26 | sakata-model-1956, sakata-nagoya-1956 | OK |
| 1973, six quarks | Kobayashi–Maskawa (submitted 1 Sep 1972) | PTP 49 (1973) 652; nobelprize.org | 2026-10-26 | kobayashi-maskawa-1973 | OK |
| α_s = 0.118 at 91 GeV; the curve | slide 9: the PDG's world average α_s(M_Z) = 0.1180 ± 0.0009 (2024); the curve is two-loop running from it (MS-bar; n_f steps at 4.18 and 1.27 GeV), 1 TeV to 1 GeV, computed here (0.444 at 1 GeV, 0.313 at the τ mass). The dashed line: the proton's mass, 0.938 GeV | pdg.lbl.gov (RPP 2024, QCD review); nobelprize.org (2004) | 2026-11-12 | alpha-s-world-average-2024, asymptotic-freedom-1973 | OK; the PDG value read from a 2025 summary of it and FLAG 2024, not from the PDG's own page |
| 2003 | Belle's X(3872) at KEK | PRL 91 (2003) 262001; PDG | 2026-10-26 | belle-x3872-2003, x3872-started-exotic-searches | OK |
| 2018 | Lithuania a CERN Associate Member State (8 Jan 2018) | home.cern | 2026-10-27 | cern-lithuania | OK |
| 5 600 t | LHCb detector's weight | home.cern | 2026-10-27 | lhcb-detector-size | OK |
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
The photos are in photos.toml; their credits are in tiny print on slide 17
(CERN's need none). The "76 hadrons" slide left the deck on 27 Oct; its chart
(LHCb-FIGURE-2026-010, CC BY 4.0: Belle 34 beside LHCb 76) could not be
fetched (CDS's bot check) and would suit a Japanese audience if the slide
comes back (`notes/history.md`).

## Talk-owned code

What each of this talk's own files does now (the list as it grew: `notes/history.md`). A piece a second talk
needs moves to the shared kit instead of being copied.

- `setup/main.ts`: registers the builders and components below; with `VITE_TAKES` set (only by
  `takes/build.sh`) it also loads `setup/takes/`.
- `setup/CoverCollision.vue`, `coverCollision.js`, `pentaquark.js`, `grains.js`, `slideHooks.js`: Karjera's
  cover, copied (10 Nov): the slow CMS loop and the colour-charge pentaquark, type `pentaquark-cc` here (the
  hadron plugin owns `pentaquark`), larger, its quarks moving (`orbit`, `tumble`).
- `setup/AtClipEnd.vue`: what it wraps comes in as the slide's clip ends (slide 2's 2018, slide 10's axis and
  names, the finale's thanks).
- `setup/QuarkRecipes.vue`: slide 9, its own three.js scene: the six quarks as lit glossy balls, then the
  mesons, the baryons and the pentaquark made from them; still `public/figures/recipes_end.jpg`.
- `setup/Dalitz3D.vue`: slide 11, the 2019 paper's Dalitz figure digitised (`public/data/dalitz-2019.json`,
  `bake/dalitz_digitise.py`, `bake/dalitz_check.png`) as instanced columns; still
  `public/figures/dalitz_end.jpg`. Its labels are HTML, projected each frame (and two SVG lines, from the
  P_c names to their bands, whose columns are lit by colour as the names come, 11 Nov); the camera's pose and the
  x-axis name's offset keep them in the frame and clear of the caption (Decisions, second round, 9). Both
  stills are frames of a build at 1920 × 1080 with `.cap` hidden: the recipes' last frame; the Dalitz plot
  21.3 s after the slide is entered (the turn's right extreme).
- `setup/globe.js`, `CollabGlobe.vue`, `view.js`, `afterCover.js` (Innoday's, copied 27 Oct): the
  `collab-globe` builder (`public/data/globe.json`: Natural Earth's coast and land, Japan's 1:10m coastline
  the brightest, the cities, the `link` strand with its pulse). Tokyo's own: globes kept by `name`; `tour`
  turns the globe ([s, lon, lat] keys; with `tourFrom: cue` counted from the cue); `pq` gathers the globe's
  grains into a pentaquark. The cue is the camera setting out for the station (the stage's `arm`) or
  `<CollabGlobe>` starting its photo's sequence. `afterCover.js`'s `places` latch keeps the heavy data off
  the cover.
- `setup/look.js`: the ground's glows lowered, the dust nearest the camera capped (Decisions, second round).
- `setup/CloseStill.vue` (Innoday's): the finale clip's last frame with the world resting; not in the deck
  since 12 Nov (the last page plays the loop), kept registered.
- `setup/QcdStorm.vue` (12 Nov): slide 6, QCD's equations (the slide's markdown) and diagrams (its own SVG)
  floating at different depths. `setup/BehindFlags.vue`: the two flags behind the finale's pentaquark.
- `setup/ClipLoop.vue` (12 Nov): slide 17, `finale_loop.mp4` taking over as `finale.mp4` ends. The loop's
  address is the clip's own with the file's name changed, so it plays from wherever the player found the clip.
- `public/audio/wonder_open.m4a`, `wonder_bed.m4a`, `wonder_close.m4a` (12 Nov): Scott Buckley, „Age of
  Wonder“ (CC BY 4.0; https://www.scottbuckley.com.au/library/age-of-wonder, the full mix's MP3), one gain for
  the whole piece (−3.51 dB: −16 LUFS integrated) and three files: 0:00–1:35; the bed (Decisions, 12 Nov evening, 4); 3:54 to the end.
  Played by the toolkit's `<StageSoundtrack>`, started by each slide's clip (`clip-at`).
- `setup/takes/`, `takes.md`, `takes/`: the deck of the three recorded scenes, their code (LHCb's grains and
  mesh, its collision, the histogram) and data. `takes/README.md`: how to build, record and cut them, and what
  in the deck depends on them. None of it is in the deck's site.
- `bake/fit_2019.py`: `takes/data/jpsip-2019-fit.json` from HEPData ins1728691, Table 3.
- `videos/clips/swoosh.py`: slide 2's swoosh. `videos/finale/segments.sh`, `lowbang.py`: finale.mp4 from its
  two takes, and the shared opening's low bang (components/lhc-opening/sound.js) rendered offline as a WAV.
- `styles/index.css`: `.num` (and `.nums3`), `.cap`, `.hero` with its shades (the StagePhoto slides), `.veil`,
  `.spec-axis` and `.spec-names` (slide 10), `.tokyo-title`, `.thanks`, `.credit`.
- `videos/manifest.toml`: every talk-owned clip, with how its raw is made. The raws are cuts made here, not
  on gdrive: never a plain `videos:sync` (it would delete them).

## Decisions

What holds from the rounds to 5 Nov, each in full in `notes/history.md`; the 10 Nov rounds follow.

- 10 Oct: nothing sourced only from the owner's own mail or Drive goes into the deck, its notes or this file.
  Credits a licence asks for: tiny print on the last slide; CERN's need none.
- 11 Oct: the cover carries the project's full name and the two leaders' names, the one title slide (lint's
  TEXT warning on slide 1 is this exception); 5 Nov: with "Vilnius University" and "Nagoya University".
- 27 Oct ("Deploy, make sure it works on a mac. The heavy point cloud should be pre-rendered as a video"):
  heavy scenes are recorded and played as clips with `transition="fade"` (a cut clip never tells the stage it
  covers the slide; Innoday, 22 Oct); `stage.options.maxBufferWidth: 1920`.
- 5 Nov: 15 min; the projector 1280 × 800 with the deck at 16:9; no music; captions on every slide;
  Yamaguchi's talk follows, so Yukawa's pion and the molecule's theory are his; the project's dates and
  funders shown; Tokyo on the globe; team photos allowed.
- 5 Nov ("use the most up-to-date tools"): toolkit v0.11.0: `stage.motion: floor` and recorded plates (the
  no-WebGL fallback), the watchdog, `space.recorded: clip`. The LHC tunnel cut is a talk-owned copy of the
  library's encode (v0.11.0's library list predates it). `stage.sound: { flight: false, clip: false }`.
- 5 Nov: Japan's contour the globe's brightest (Natural Earth 1:10m), the lit cities smaller.

## Decisions, 10 Nov (the owner's review, 14 points)

1. Cover: Karjera's collision; "only then a pentaquark appears (could be more substantial, a bit more dynamic)":
   the colour-charge pentaquark gathers out of the first crossing (~4–6 s), 2.9 spread (Karjera 2.5), moving.
2. 2018 only at the clip's end, "zooming swoosh": a talk-owned copy of cern_overview_short with a synthesised
   swoosh on the dive. 3. LHC: 13.6 TeV (Run 3) and −271.3 °C magnets (the notes say: warm since LS3, 29 Jun 2026).
4. "LHCb Experiment at CERN", the clip's music on (the one exception to 5 Nov's no-music).
5. The proton slide is atoms.mp4 sped up (126 s → 26.5 s), no caption. 6. "Shoichi Sakata proposes a
   precursor to the quark model". 7. No marketing lines, in any project (a global rule now, ~/.claude/CLAUDE.md):
   "Gell-Mann and Zweig propose the quark model"; slide 8 "…propose six quarks, including the b quark".
8. Slide 9 in 3D, then the pentaquark full screen in front; later "a bit too colorful, make photorealistic": lit
   glossy balls, natural colours.
9. Slide 10 the whole 2019 curve, drawn from HEPData, named peaks and an inset; slide 11 new, the Dalitz plot
   built up in 3D from the 2019 figure (digitised; counts approximate, said in the notes).
10. Slide 12: hadroquarkonium added (c c̄ core in a u u d cloud; Dubynskiy–Voloshin 2008, Eides et al. 2016),
    names under the three, the camera swinging ±24°. 11. Globe caption "Lithuania and Japan".
12. The group photo: the caption only, no top shade or numbers (2024 and 13 left the screen; notes keep them).
13. The project: the two universities' pictures with "LHCb data" and "theory", one pentaquark, the strands; the
    two nine-node "teams" left (they read as many-quark states).
14. The finale: LHCb's collision → white → the Earth on Japan → drawing back → the Earth's grains into the
    cover's pentaquark (tints softened toward the globe's blue) → ありがとうございました · Ačiū (no English, the
    owner's two languages). 23 s, the low bang.

## Decisions, 10 Nov, second round (after 13472fd)

The owner: "on slide 10 this is from Run1.. 2015. Not very expressed. we want to have a peak from the fit. Also
building up the histogram could be a bit more substantial, maybe like in uzsikrauk karjerai, something like that
(even involving the detector). Slide 13 could zoom in and rotate earth. The finale is nice, just need a smoother
transition from the collision (maybe show more of it, particles propagating through detector, something like
that)."; "maybe a bit less graininess a bit more fidelity, now some parts look like through a fog"; "Improve and
tidy this talk up".

1. Slide 10 is a clip, data2019.mp4 (24 s): LHCb whole, a collision in it, its grains landing as the 2019 J/ψ p
   histogram, the fit drawn, the three peaks lit. Data and fit: HEPData ins1728691, Table 3
   (`bake/fit_2019.py`). The axis and the peaks' names are the slide's HTML over the clip's last frame
   (`.spec-axis`, `.spec-names`). The SVG spectrum and its inset left (`Spectrum2019.vue`, Table 1's bake).
2. Slide 13's globe forms on Europe, turns east as the camera comes in, and rests with Vilnius and Japan in
   the frame (globe.mp4, 20.6 s). The deck's `globe` station is the take's end.
3. The finale, 30 s: the collision take runs 13.6 s (its particles through the detector, the camera turning
   round it and drawing back) and dissolves over 1.6 s into the Earth on Japan; the white flash left. The
   thump at 3.9 s, the drone to 23 s, the pentaquark formed by 23 s, the thanks over the last 2.5 s.
4. The look: ground `#020203`, no film grain or colour fringe, bloom 0.32, dust density 0.6
   (`stage.options`); the paper texture off (`.stage .grain`); the ground's two glows at 0.35 and the dust
   nearest the camera capped (`setup/look.js`: v0.11 has no option for either, so it changes the stage's two
   materials at run time and edits no toolkit file). For the toolkit: a `glow` option for the ground, a
   near-size option for the dust.
5. The three recorded scenes have a deck of their own, `takes.md`, their code in `setup/takes/` and their
   data in `takes/`, loaded only when `VITE_TAKES` is set: the deck's site carries none of it
   (`takes/README.md`).
6. The globe builder keeps globes by name and counts a turn's and the pentaquark's seconds from the cue, not
   from the stage's `assemble`: a take was lost to each (`takes/README.md`, "Four things that cost a take").
7. Tidy: slide 12's camera at 16.5 (the hadroquarkonium inside the frame at the swing's ends); captions at
   most 868 px wide (slide 8's on one line); the axis type at 18 and 20 px; three unused figures removed
   (lhcb_2019_peaks.png, tunnel.jpg, vilnius.jpg) and the frame strips of cern_overview_short.mp4, which the
   deck no longer plays; slide 15's notes name the two universities, as its pictures do; this file's log to
   5 Nov moved to `notes/history.md`.
8. A build plays the release's copy of a clip before the local encode (the videos addon's order; `pnpm dev`
   is local first). globe.mp4 and finale.mp4 are re-cuts under names already on the release, so until they
   are published a build, its shots and the live deck show the cuts of 13472fd. To see the new ones in a
   build: `VITE_VIDEOS_LOCAL_FIRST=1` (Verify).
9. Slide 11: in the turn the plot's near corner and its x-axis labels went under the caption, and seen at a
   low angle the tick "4" stood on the axis's name. The camera now looks at a point toward the viewer and
   comes closer only as the tilt completes (`dist`, `tgt` in `Dalitz3D.vue`), and the x-axis name moves out
   from its ticks with the tilt. Checked in frames from 3 s to 64 s (the turn's period is 57 s): every label
   inside the frame, above the caption (its box starts at y = 460 of 551) and clear of the others. The still
   re-made from the new pose.
10. `ready`'s `safe` step (the TV safe area) is skipped for this talk: `pnpm talk ready tokyo --skip safe`,
    `pnpm talk deploy tokyo --ready-skip safe`. The CLI reads `stage.options.grain: 0` as the mark of a talk
    made for television (`is_broadcast`, scripts/talk.py) and then holds the captions and the credits to the
    broadcast margins and type sizes; this deck is for a projector, and the step never ran on it before the
    grain went to 0 (point 4). A skipped step needs the owner's word for the deploy. For the CLI: a
    headmatter `broadcast: false` that wins over the grain. The plates read "stale" after every edit of
    this file, which is in the take's fingerprint though no plate shows it.

## Decisions, 12 Nov (the owner's seven points)

The owner: "Slide 17 should continue playing, also we should have some soundtrack, effect across the board.
Slide 5 some soundtrack (maybe this age of wonder). On transition to 6 a photo of yukawa flashes. After
Kobayashi, Masakawaa, a slide just highlighting how difficult is QCD. Slide 10 too colorful, need to be a bit
more blue, dark blue, see through, photo realistic, and also it's not refreshable for some reason. slide 11
need some soundtrack. Slide 16 not just Nagoya, it's more institutes across japan now, maybe we should not
show this at all since we have slide 17". Then, on Yukawa: "Yukawa shouldn't flash that's the thing. it's just
there somewhere in space. not needed". The numbers are the deployed deck's (fbc1267).

1. The finale goes on moving. `finale.mp4` is 32 s (2 s more of the pentaquark with the camera at rest), and as
   it ends `finale_loop.mp4` takes over (`<ClipLoop>`): 30 s of the same take, its end cross-faded into its
   beginning, its first frame the one after the finale's last. The world take was recorded again with a 52 s
   hold (`videos/takes/tokyo_finale_world.mp4`, 54 s; the 24 s one kept as `…_24s.mp4`). The last page plays
   the loop in place of the still. Not chosen: the live world under the last page (the finale's pentaquark is
   made of the globe's grains, softer in tint than the cover's, so the hand-over would show; and the Mac).
2. Music: Scott Buckley's „Age of Wonder“ (the owner's "this age of wonder"; CC BY 4.0, credited on the last
   page), one piece in three cuts: its top under the atoms clip (slide 5), 1:27 on under the data clip (slide
   12; its swell at 1:46 as the fit is drawn), 3:54 on under the finale (its arrival at 4:16.5 as the
   pentaquark has formed, 22.5 s) and to the piece's end over the loop and the last page. Each starts with its
   slide's clip, goes on under the speaker after the clip ends and fades when the slide is left. This ends
   5 Nov's "no music". "Effect across the board" is read as the stage's own sounds: the rising tone as a clip
   condenses is on again (`stage.sound.clip`); the flights' whoosh stays off, the sound the owner called
   "driving sounds" on 13 Oct. Open: whether more is meant (a sound on the cover's collision, the globe, the
   recipes).
3. Yukawa's portrait left the world. It was a page at the `nucleus` station (x 68.8), kept for a slide hidden
   since 5 Nov, and the camera showed it on the way to Sakata. The hidden slide's `hide:` comment says how to
   put it back. (First read as a request for a flash of the portrait; a component for that was written and
   removed on the owner's correction.)
4. A new slide 9 after Kobayashi and Maskawa: the strong coupling against the energy scale, one curve drawn
   from 1 TeV down to 1 GeV, "α_s = 0.118 at 91 GeV", the proton's mass as a dashed line, "LHC collisions:
   perturbation theory" and "hadrons: no expansion in α_s"; caption "QCD: at the scale of hadrons the coupling
   is no longer small". Figures has the numbers. Its notes carry sources and the minutes, with one paragraph
   of what the picture shows (asymptotic freedom, 1973, the year of slide 8).
5. The recipes (now slide 11): every quark a ball of dark blue glass (see-through in the middle, dense at the
   edge, a polished coat; hues from cyan to indigo, the flavour read from its letter), an antiquark the same
   glass nearly empty. "Not refreshable": leaving the slide ended the renderer with `forceContextLoss()`, and
   a canvas keeps its one WebGL context, so every later start drew into a lost one. The renderer is now kept
   while the component lives; the Dalitz plot had the same fault and the same fix. `recipes_end.jpg` re-made.
6. The data clip's music: point 2.
7. The project slide (2026–2028, the two universities' pictures) is hidden. The globe names Vilnius, RIKEN,
   Tokyo and Nagoya, and its caption now reads "Lithuania and Japan: Penta-Charm, 2026–2028, funded by the
   Research Council of Lithuania and JSPS", so the name, years and funders stay on screen once. The owner's
   "since we have slide 17" is read as the globe. Open: whether the caption should stay "Lithuania and Japan"
   alone (the owner's of 10 Nov), with the funders only said.
8. The plates were recorded again (the slides from 9 on moved).
9. Later the same day (the owner: "the first three slides should go after qcd / quark model introduction and
   belle"): CERN, the LHC and LHCb (the three after the cover) now stand after the quarks' history, as slides
   9 to 11: cover, atoms, Sakata, Gell-Mann and Zweig, Kobayashi and Maskawa, QCD, Belle, the recipes, then
   CERN, the LHC, LHCb, and LHCb's data. The recipes are kept with the quark model, before CERN, so LHCb's
   clip is followed by LHCb's data clip; the other reading (CERN straight after Belle, the recipes between
   LHCb and its data) is one block's move in deck.md. The cover stays first. lhcb.mp4's own music is now
   followed at once by the data clip's. The plates recorded again for this order.

## Decisions, 12 Nov, evening (after the deploy of 1368cb5)

The owner: "belle should be shown after introduction to baryons and mezons in slide 8. slide 6 should be
reimagined, just floating QCD lagrangians, equations, diagrams to show how complicated it is, full screen of all
sorts of diagrams / equations floating at different depts appearing. No weird "scooter sound" in transitions.
age of wonder should continue from slide 11 on to the very end. finale has weird flick of particles before
pentaquark appears"; then "the person is glowing in 17 and 12, we don't want that"; "for the finale we want
japanese and lithuanian flags appearing in the background joined in the middle behind the pentaquark"; "group
photo should have a slight pan / zoom effect so it's more dynamic"; "deploy when finished".

1. Belle stands after the recipes: slide 7 the recipes, slide 8 Belle.
2. Slide 6 is `setup/QcdStorm.vue`: sixteen equations (the slide's own `$$ … $$` blocks, set by Slidev's KaTeX:
   the Lagrangian, the covariant derivative, the field strength, the colour algebra, the three- and four-gluon
   terms, gauge fixing and ghosts, the one-loop running and its solution, the lattice path integral, Wilson's
   action, the Cornell potential, DGLAP and its splitting function, Gell-Mann–Oakes–Renner, the trace anomaly)
   and nine diagrams drawn by the component (the vertices, one- and two-gluon exchange, the self-energies, a
   vertex correction), each at its own depth (far: small, dim, soft), coming in one after another over about
   11 s and drifting. Places are found once from a fixed seed, each clear of the frame's edge, the caption and
   the items near its own depth. Caption "Quantum chromodynamics". The curve of the coupling left
   (QcdCoupling.vue, in git at eef71be). Lint's WORDS warning on slide 6 is this slide: it counts the equations'
   letters as words (the second standing exception, after slide 1's title). The conventions are Peskin and
   Schroeder's; an expert audience reads them, so a change to an equation is checked against the book.
3. The clips' rising tone is off again (the "scooter sound"): `stage.sound: { flight: false, clip: false }`.
4. Music: „Age of Wonder“ from slide 11 to the end, one bed (`public/audio/wonder_bed.m4a`, 8 min 7 s: the
   piece from 0:30 to 3:35, then 1:00 to 3:35 twice more, 4 s cross-fades, the piece's one gain) at 0.6 under
   the LHCb and data clips, 0.45 under the globe, 0.35 under the slides spoken over; on the finale it
   cross-fades (1.5 s) into the piece's last build (`wonder_close.m4a`, level 0.85), which runs to its end over
   the loop and the last page. Slide 11 is read as written, so lhcb.mp4 plays muted (its own music, the owner's
   of 10 Nov, would run under the piece). Slide 2 keeps the piece's opening. `wonder_build.m4a` left. If the
   talk reaches the finale later than 8 min after slide 11 the bed has ended and the finale starts the close
   from silence.
5. The finale's "flick": a string of bright grains across the frame as the globe began to dissolve. They were
   the globe take's photo grains: the recorder comes to a take from the slide before it, and the world take
   followed the globe take. `takes.md` has an empty slide between them (the world take is slide 6 now). On the
   way: the cities' lights no longer fly with the globe's grains, they go out in place (`light` in globe.js's
   shader); that alone did not remove the string.
6. The person beside LHCb (slides 12 and 17): in the grains it took the muon walls' weight 1.4 and bloomed
   (part 10, 11 700 grains): now 0.07; as a mesh its gains were about ten times the machine's: now the
   machine's (detector.js). A faint figure in the data clip, hardly seen in the finale's.
7. The flags (`setup/BehindFlags.vue`; the name `FlagsBehind` is taken by Slidev's icon resolver, set `flag`):
   Lithuania's on the left, Japan's on the right, each fading into the other across the middle, added to the
   clip as light (`mix-blend-mode: screen`, 0.26, blurred 7 px, held back in the middle and at the edges), from
   22.5 s of the finale (the pentaquark formed), over the loop and on the last page.
8. The group photo: `class="pan"`, a push in to 1.1 and a drift over 40 s (styles/index.css).
9. Recorded again: the data, collision and world takes (points 5 and 6); data2019.mp4, finale.mp4 and
   finale_loop.mp4 cut and encoded from them at the times they had; the plates for the new order.

## Decisions, 12 Nov, night (after the deploy of 081f75f)

The owner, in a run of messages: "low humm on cover slide with collision low sound (like in uzsikrauk karjerai,
powerful)"; "Second slide could be slower, maybe not full scale, but slower … or even full"; "need some mild
soundtrack for the theorists introduction … maybe just age of wonder throughout"; "slide 6 more dynamic, remains
dynamic, they should appear and dissapears, pass through, more of them appear far away, appear close"; "just
have to somehow match finale again"; "on slide 15 keep zooming int to japan"; "slide 16 something is wrong...
it's stepping pixels rearraning"; "on slide 17 the collision more dramatic, timed on a low sound"; "flags more
in focus, wawing, the pentaquark can become more blurry"; "antiquarks formatted weird, bar is too close".

1. The cover's collision has the shared opening's voice (`sound: 0.5` on `cover-collision`, space.json;
   coverCollision.js tells components/lhc-opening/sound.js of each round's start, crossing and speed): the swell
   as the bunches run in, the thump on the crossing, the drone while the round runs slow. Every round (about
   23 s apart) while the cover is shown; after the first key or click, as all the stage's sound.
2. atoms_fast.mp4 is 47 s (3× then 1.5×; it was 26.5 s). In full it is 116.5 s, a minute and a half more than
   the 15 minutes have; `talk map` still counts the notes' half minute beside it.
3. „Age of Wonder“ runs from slide 2 to the end: `wonder_bed.m4a` (16 min 10 s: the piece to 3:35, then 1:00 to
   3:35 five times, 4 s cross-fades), 0.6 under the clips that are watched, 0.3 to 0.45 under the rest; the
   finale cross-fades into `wonder_close.m4a` (the last build, its arrival on the pentaquark formed), which now
   starts at 0.3 of its level and opens over 3.4 to 8.5 s, so the collision's boom (3.9 s) is heard.
   `wonder_open.m4a` left. Known: after a step back and forward again onto a slide the toolkit does not start
   the music (its `G.prev` is stale); the next slide starts it.
4. Slide 6 is a flight: each of 50 items (every equation and diagram twice) is born far away, grows along its
   own line out of the middle (size S0·e^(g·p), 20 s from birth to passing), fades before its box reaches the
   frame's edge and is born again on another line. One requestAnimationFrame loop while the slide is live.
5. Slide 15: 5 s after the globe clip rests the picture goes on in towards Japan, to 1.6× over 90 s
   (`setup/ZoomOn.vue`, a transform about the point between Tokyo's and Nagoya's lights); Vilnius's name goes.
6. Slide 16's pan is drawn on a canvas over the photo (`setup/PanCanvas.vue`): an `object-view-box` window moved
   in whole pixels (the "stepping"), and a scaled <img> is an element off the slide, which the layout check
   refuses even with a delay (the shots run the page's clock ahead).
7. The finale: the collision take recorded again with more light (`inside` light 7, flash 0.11; `detp` light
   6.5) and a push in on the crossing; `lowbang.py --boom` adds a hit a room's speakers carry (95 → 38 Hz with
   its octave and a burst of low noise), the clip's sound at −2 dBFS peak. The flags are a canvas now: one
   cloth, laid down in 2 px columns moved by two travelling sines and shaded by the fold; 0.5 as light over the
   clip, which goes soft (blur 3.5 px) as they come up.
8. The antiquark's bar stands clear of the letter (QuarkRecipes.vue, `.bar`).
9. Not recorded again: the plates (the worlds they show did not change; `ready` reads them as stale).

## Decisions, 12 Nov, late night (slides 13 and 14; the toolkit)

The owner: "13 slide should be more impressive, maybe don't need a grid, should appear from different parts in
space, fill in the bins, no caption just "LHCb, 2019...." fly through the dalitz plot itself in 3d then zoom out
a little like now to show"; "14 should be more dynamic, molecule rotating around eachother indicate some
interaction in the middle, the other ones the shell is too static"; "This talk is good, can we propagate
something to tools? … There is a tools session and tools repo and a scheduler … maybe this is a task for the
scheduler."

1. Slide 13 (Dalitz3D.vue): no floor and no grid; 7 000 candidates come in from a wide shell all round the plot
   and fill the bins, the columns rising as they fill, the camera circling at an angle (to 9.5 s); then it goes
   in over the Λ(1520) ridge and flies along the P_c bands, lit, to four fifths of the way across (9.5 to
   17.5 s); then it draws back to the view the slide always ended on, and only there the ticks and names come
   (from 20 s), with the slow turn. Caption "LHCb, 2019". `dalitz_end.jpg` (the fallback still) is the old end
   view with its floor: not re-made.
2. Slide 14: `setup/interiors.js`, a talk-owned builder `interior` (kinds molecule, compact, hadroquarkonium) in
   place of the hadron plugin's five still `pentaquark` forms: the molecule's baryon and meson circle their
   middle with grains exchanged between them, every quark moves on its own loop, every skin ripples.
3. For the toolkit, handed to the Scheduler (the list below). This session edits no toolkit file.

### For the toolkit (for the Scheduler, 12 Nov)

What this talk had to build or work round, and what it would be as a part of slidev-videos:
- **A clip's hand-over to a loop** (`setup/ClipLoop.vue`): a `loopAfter="clip_loop.mp4"` on VideoPlayer, and a
  recorder mode that cuts the loop from a take's settled tail (segments.sh's cross-faded cut).
- **What follows a clip's end** (`AtClipEnd.vue`, `ZoomOn.vue`): a `<StageAtClipEnd lead>` wrapper, and a slow
  zoom on a clip after it ends (a transform about a point).
- **A photo's pan** (`PanCanvas.vue`): `pan` on StagePhoto, drawn so the element keeps its box (a scaled <img>
  fails the shots' layout check; `object-view-box` moves in whole pixels).
- **The shots' layout check**: a way to mark an element as full-bleed by design (today only `.video-player`
  is), and a note that the shots run the page's clock ahead, so a delayed animation is already under way.
- **StageSoundtrack**: (a) `release` in stage/soundtrack.js throws when a press interrupts a fade in Chromium
  ("setValueCurveAtTime … overlaps"; this talk's guard: `holdOnOverlap`, setup/main.ts); (b) after a step back
  and forward again `G.prev` is stale and `start` does not start; (c) a bed for a whole talk: `loop`, or a
  builder that makes one from a track (Karjera's starfire_bed.py, this talk's ffmpeg line), and a level per
  slide in headmatter in place of a tag on every slide.
- **The recorder**: it comes to a take from the slide before it and carries that slide's running effects in
  (the finale's stray grains); an option to open a take cold.
- **The stage's look**: options for the ground's glow and the dust nearest the camera (`setup/look.js`).
- **Forms**: the colour-charge pentaquark (`pentaquark.js`), the moving interiors (`interiors.js`), the cover's
  collision loop with its sound (`coverCollision.js`), the globe (`globe.js`): a second talk that wants one
  takes it from the kit, not a copy. The WebGL slides' renderer rule (keep the renderer while the component
  lives; never `forceContextLoss()` on leaving) belongs in docs/authoring.md.
- **Lint**: equations counted as words (slide 6's WORDS warning); a `broadcast: false` that wins over
  `grain: 0` (the `safe` step); `talk map` counting a clip's seconds from the encode.
- **The icon resolver**: a component named `Flags…` is read as the icon set `flag` (a note in authoring.md).

## Decisions, 11 Nov (the audience)

The owner: "it's japan and lithuania scientists, they will be from nagoya, tokyo, rikken". Four changes were
offered for that audience (less time on the introduction, the Belle slide back, the wording an expert would
catch, RIKEN on the globe) and the owner answered: "Yes, also make sure the flow and talk is good".

1. The introduction's minutes: slide 5 (the atoms clip) half a minute beside its 26.5 s, the recipes
   (slide 10) 0.75 min for their 30 s. The clips themselves stay as the owner chose them on 10 Nov.
2. Belle is back as slide 9: the photo of the detector, "2003 / KEK", "Belle discovers the X(3872), an exotic
   hadron candidate" (the facts bank: a candidate, never "the first exotic hadron"). After Kobayashi and
   Maskawa, at their station: Belle was built to test them, so the Japanese thread runs 1956, 1973, 2003
   unbroken, and the recipes still end on the pentaquark that the next slide's data shows. The other place,
   after the recipes, would put a four-quark candidate between the pentaquark and its data. The photo's crop
   is `focus="50% 50%"` (the detector's opened end above the caption; at 35 % it read as a hall of racks).
   Its credit is on the last slide. Its notes still name LEPS's Θ⁺ at SPring-8 (RIKEN's site): with RIKEN in
   the room that is said with care or left out (Figures, the speaker's caveats).
3. The globe (slide 14) names its lit cities once the clip rests (from 15 s; `<AtClipEnd :lead="4">`):
   Vilnius, and beside Japan RIKEN, Tokyo and Nagoya, each on a thin line from its light. The names are the
   slide's own, an SVG in slide units over the clip's last frame (`.globe-names`, styles/index.css), as the
   data slide's axis is: nothing was recorded again, and nothing needs publishing for it. RIKEN's Wako campus
   is 15 km from Tokyo's light, the same light at this scale, so the two names share one line and a bracket.
   Not chosen: a fourth light in the take (it would fall on Tokyo's) and a new take with Japan's contour
   lowered until Nagoya and Tokyo resolve (the reviewer's root fix; the owner asked for the contour "central
   and brightest" on 5 Nov). The lights' places in the last frame, slide units: Vilnius (290.7, 55.1), Nagoya
   (692.9, 326.1), Tokyo (705.8, 316.1); they follow from the take's last pose (centre 104° E, 44° N, roll
   −6°, dist 8.3, a focal length of 1155 px at 1920 wide). A new take with another end moves them.
   Open for the owner: RIKEN is named beside the project's cities though the strand joins only Vilnius and
   Nagoya; if that reads as a partner's role, the name goes (one `<text>` and the bracket).
4. From the review of the shots (a subagent on the contact sheet, then on fresh captures of 9, 14 and 16):
   the recipes' quark content never under 18 px (`.hl .c`, QuarkRecipes.vue); slide 16's "LHCb data" and
   "theory" at height 0.75, lighter (space.json); the credits end "all via Wikimedia Commons, cropped" (the
   Belle photo is cropped too). The Dalitz plot (slide 12): ticks at 18 px (were 15), the x axis "m²(K⁻ p)",
   and the P_c name lowered from 1.25 to 0.85 over the plane with a thin line down to its band's top (0.45):
   it stood about 42 slide units over a band that is itself low. Every label's box was read from the page
   each 0.5 s from 0.5 to 66 s: none out of the frame, under the caption or touching another (closest: the
   tick row 12 px over the x axis's name while seen from above). The still `dalitz_end.jpg` re-made the same
   way (21.3 s, the caption hidden).
5. Every slide from the old 9 on is one higher, so the plates were recorded again.
6. The no-notes rule held: no script was written or changed; only minutes, sources and comments.
7. After the deploy the owner: "Dalitz should be 2019 data". It is (the 2019 figure digitised, ~252 000
   candidates; its rows for m(Kp) > 1.9 GeV peak at 4313, 4439 and 4456 MeV), but the plot did not show
   it: the bands stood barely over their surroundings and one name covered two states, as 2015's single band.
   Now, as the names come in (12.5 s), the columns of the two bands are lit toward white, by colour only
   (every height stays its count): m²(J/ψ p) 18.52–18.73 GeV² for the P_c(4312)⁺ and 19.57–19.99 for the
   P_c(4440)⁺ and P_c(4457)⁺ (1.5 columns apart, one band at this binning), where m²(K⁻ p) ≥ 3.61 GeV², the
   paper's own m(Kp) > 1.9 GeV cut. The P_c(4312)⁺ has its own name, hung under its band on a line; the
   other name moved to m²(K⁻ p) 5.7, clear of its lit band (`BANDS`, `PC` in Dalitz3D.vue). No dimming of the
   rest. Read from the page each 0.5 s to 66 s: no label out of the frame, under the caption or touching
   another; the two P_c names at least 166 px apart (at 1920). The still re-made (21.3 s). The plate of
   slide 12 is the world alone, so it stays.

## Verify

```bash
pnpm talk check tokyo     # videos:check, stage:check, a build into /tmp/talk-tokyo/site
pnpm talk review tokyo    # check, then shots of the changed slides and a contact sheet
pnpm talk ready tokyo --skip safe   # before the venue: lint --release, check, shots, pages, preflight, venue
                                    # --dry-run, the plates; safe is TV's (Decisions, second round, 10)
# a build and shots with the local encodes of the clips, not the release's (a re-cut not yet published):
#   VITE_VIDEOS_LOCAL_FIRST=1 pnpm talk shots tokyo --sheet --rebuild
# a re-cut clip or re-recorded plates onto the release (outward-facing: the owner's call; a clip under a name
# already on the release changes the live deck at once, so publish and deploy go together; never with --prune):
#   pnpm -C talks/2026_11_18_Tokyo videos:publish -- --only <the clips> <the plates>
# a change to a recorded scene: takes/README.md
```
