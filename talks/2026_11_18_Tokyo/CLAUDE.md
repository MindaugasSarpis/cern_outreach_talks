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
  b quark is LHCb's "b"); LHCb's pentaquarks in the decays of a particle
  carrying that b quark (2019); how the five quarks are bound is the
  question Vilnius (LHCb data) and Nagoya (theory) answer together.
  Yukawa's pion and the molecule's theory are Yamaguchi's talk, next.
- Banned: fundraising amounts unless the owner says; unchecked citation counts.

## Status

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

- The atoms clip's credit: the library says only "released/atoms.mov (outreach)".
- Provenance and licence of `GellMannPhoto.png`, `ZweigPhoto.png` and the two passage scans (Figures).
- Not played on a real Mac (none here): the three heavy scenes are clips and the live slides have plates.
- Questions 7, 8, 10 and 11 of the 27 Oct list are about slides now hidden (`notes/history.md`).

## Arc

1 cover: the CMS collision, the pentaquark out of its flash · 2 the CERN clip with its swoosh, 2018 at its
end · 3 the LHC tunnel: 27 km, 13.6 TeV, −271.3 °C · 4 lhcb.mp4 with its music · 5 atoms_fast.mp4 · 6 Sakata,
1956 · 7 Gell-Mann and Zweig, 1964 · 8 Kobayashi and Maskawa, 1973 · 9 the six quarks and their recipes in
3D, the pentaquark full screen · 10 data2019.mp4: LHCb, a collision, the 2019 histogram, its fit and three
peaks · 11 the 2019 Dalitz plot in 3D · 12 molecule, compact, hadroquarkonium · 13 globe.mp4, "Lithuania
and Japan" · 14 the Vilnius group · 15 the project, 2026–2028 · 16 finale.mp4 · 17 thanks and credits.

17 slides, 14.9 min by the notes and clips (`pnpm talk map tokyo`). Twelve more are hidden (`hide: true`,
not deleted; remove the line to bring one back): the Vilnius zoom out and the coming back, the LHCb detector
(5 600 t), Lithuania at CERN (2018), the collaboration (1 891), the atom, Yukawa (1935), the two hadron
families, Belle (2003), the molecule close-up, the SciFi's Hamamatsu channels (524 288), open data (38.3 TB).

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
  `public/figures/dalitz_end.jpg`. Its labels are HTML, projected each frame; the camera's pose and the
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
- `setup/CloseStill.vue` (Innoday's): slide 17, the finale clip's last frame with the world resting.
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
