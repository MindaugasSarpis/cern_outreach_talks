# Innoday — handoff (2026-10-08)

**Pin.** slidev-videos `5c72c33` (dust-fullframe, the dark-clip fix, `advance-on-end`, `StagePhoto`; both addons in `package.json`).
Shots: feat/shots-v2 `35340a9`, run from its worktree
(`node ~/slidev-videos/.claude/worktrees/feat-shots-v2/packages/stage/bin/shots.mjs <dist> <out> --sheet`).

**Done.**
- One spine: Prologue (zoom-out → its last frame becomes the world) → I Mašina
  → II Išradimai (time order, each slide names the machine's problem) → III Ir
  atgal (evidence, FCC, Lithuania, what firms can do) → Ačiū.
- Look: the world's ground is near-black (`palette: { base: blue, bg: '#000103' }`;
  the engine takes the ground as linear light, so blue's `#03050d` showed as
  navy), fewer and dimmer dust grains, full-bleed 2400 px photographs.
- Takeover on the real last frame of `vu_ff_zoom_galaxy.mp4`: 280 000 grains,
  gain 1.3, saturation 1.35; checked with record.mjs (slides 3–4).
- Credits fixed (Artemis II, the SM18 MgB₂ link, the data centre, MedAustron).
- Last full shots: 34 frames, clean (the two 404s are clips a local dist does
  not hold).

**Waiting on the owner.**
- The orbit clip from VU to the cosmic web (must end held on the web, no fade).
  When it arrives: uncomment `vu_orbit.mp4` in `videos/manifest.toml`, then
  `pnpm videos:sync && pnpm videos:encode && pnpm videos:publish`,
  `pnpm takeover:frame public/videos/vu_orbit.mp4 && pnpm videos:frames`,
  point slide 2's `<VideoPlayer>` at it, re-check exposure with record.mjs
  (under `flock /tmp/slidev-stage-shots.lock`), deploy.
- The spine and its wording are the owner's to confirm (no committee lines,
  no slogan cards).
- MARS wrist image © MARS Bioimaging; the date is still `10_00`.

**Next command** (from this directory, env first on PATH):

```bash
VITE_VIDEOS_LOCAL_FIRST=1 pnpm build --base / --out /tmp/innoday-dist && \
  node ~/slidev-videos/.claude/worktrees/feat-shots-v2/packages/stage/bin/shots.mjs /tmp/innoday-dist /tmp/innoday-shots --sheet --size 1600x900
```

## Status (2026-10-08, coherence pass)

Done: deck reworked for one retellable story; 28 visible slides + 1 hidden
backup; speech ~17,5 min + clips 5:33 ≈ 22 min (the event length is not
recorded anywhere — open). `pnpm build` and `stage:check` pass. Not yet:
shots and contact-sheet review (waits on the render queue and Tools'
Chromium fix), the unslop tool, deploy (Scheduler calls the order).

The story, in one breath: to see what the world is made of, physicists needed
a machine nobody could buy; every part of it was an unsolved problem; the
solutions left CERN as touchscreens, the web, PET, colour X-ray, hadron
therapy, grid computing, superconducting lines; the next machine (FCC) brings
the next round of problems, and Lithuanian firms can solve them.

## Decisions (2026-10-08)

- **Part I ends on the limits.** Order: CERN clip → Higgs → LHCb clip →
  pentaquark → "Ko reikėjo šiems atradimams" (LHC stats, formerly the second
  slide of Part I) → LHCb 4 TB/s. What the machine found answers the
  prologue's question; what it needed opens Part II. Undo: move the stats
  slide back after the CERN clip.
- **Cut to notes** (each slide's facts moved into a neighbour's notes):
  CERN 1954 counter (→ CERN clip), "Kodėl mes egzistuojame?" (question title,
  a side topic; → LHCb clip), LHCb Vilnius stats (→ LHCb clip, 4 TB/s,
  pentaquark), VELO "Lustas, apsukęs ratą" (cute title; → colour X-ray),
  "Mano CERN inovacijų dešimtukas" (repeats Part II). The 1,8 CHF HL-LHC slide
  became a "jei laikas leidžia" line under +14 %. Recover any from git
  (f752081..e8c424d).
- **Part II order by where the reader meets it**, not by year: pocket
  (touchscreen, web ×2) → hospital (PET, colour X-ray, Artemis — same chips —,
  hadron therapy) → industry today (data/White Rabbit, superconductivity with
  Airbus and F4E). Every slide keeps a "Problema:" kicker; the 1993 web slide
  now says what happened ("CERN atsisakė teisių į žiniatinklį") instead of
  "Sprendimas — visiems".
- **Part III**: section → how transfer works → +14 % for suppliers → FCC (the
  next round) → Lithuania (associate, full-membership bid) → "Ką gali
  Lietuvos įmonė" (supply, FCC, licence) → close. The section's notes name
  the firms from Part II (Siemens, MARS, ADVACAM, Airbus) as the bridge.
- **Wording removed** as slogan or antithesis: "Verslo paradoksas…",
  "Mažytė komanda — pasaulinis rezultatas", "bandymų poligonas…", "Kai durys
  atsivers plačiau…", "Klausimas tik vienas — ar jos bus lietuviškos",
  "nukeliausime", telegraphic captions ("fizika → medicina → vėl fizika",
  "White Rabbit laikas — biržose"). Kept on purpose: the prologue question
  "Iš ko visa tai sudaryta?" (the one question the talk answers) and the
  „Vague but exciting…“ callback at the close.
- **Typography**: thousands and number–unit pairs now carry no-break spaces
  (lt-copy). "kosmosą" on the LHC slide became "erdvė tarp galaktikų".
- **Notes** end with `(~N min)` (house rule) instead of starting with it.
- **Visuals unchanged** in this pass apart from slide order: every slide keeps
  its pose; the camera path still runs collider → hero → collider → web → kt
  → hero. The 4 TB/s slide moved from the galaxy station (which meant
  antimatter) to the collider.

## Open for the owner

- How long is the slot? The deck runs ~22 min; the close's notes list cuts
  for 15 min.
- The orbit clip, MARS image rights and the `10_00` date, as before.
- Slide 9 (pentaquark): the SwiftShader shots show two orbs, not the five-quark
  form. Probably the slow renderer; check on a real GPU (`pnpm dev`, go to
  slide 9, press `c`) before the talk.
- 27 June (last beam) vs 29 June (LS3 start): confirm (FCC slide notes).

## Unslop pass (2026-10-08)

Run by hand: `scripts/talk_copy.py` and `docs/unslop-lt.md` from
origin/feat/unslop (not merged), unslop 1.8.4 check mode, levels 3 and 2 plus
the Lithuanian seed list; a native-editor agent reviewed in parallel and its
edits were folded in. Changed:

- Titles as noun labels: "Didysis hadronų greitintuvas" (was the teaser
  "Ko reikėjo šiems atradimams"), "CERN technologijų perdavimas įmonėms",
  "Galimybės Lietuvos įmonėms". Part II is "Sprendimai", not "Išradimai":
  its own notes say CERN did not invent the touchscreen or PET.
- The takeaway ("a machine nobody could buy") is said once, on the LHC
  slide; the cover no longer previews the talk and the close no longer
  recaps it. The „Vague but exciting…“ callback at the close is gone (an
  aphoristic kicker); the close ends on the FCC memoranda.
- Cut: two colon-reveal maxims (LHC, 4 TB/s), two rhetorical openers, an
  unsourced mechanism sentence (+14 %), an unsourced "niekas negamina" list
  (FCC). The LHC notes are sentences, not a fragment run.
- Corrected: White Rabbit is accelerator timing, not part of the grid;
  "Licencija" (a firm takes a licence); the liaison officer is Lithuania's;
  machines no longer "know", "look" or "give"; FDA "leido naudoti".
- Gap: the notes give 27 June as the last LHC beam and 29 June as the start
  of LS3; both came from the earlier research, not rechecked.

## Visual review (2026-10-08, `talk review` from chore/talk-cli, gluon)

28 shots, no overflow; two reviewer rounds on the contact sheets. Fixed:
- **Cover title** hid until the pentaquark finished assembling, which under
  SwiftShader never came within 14 s. `styles/index.css` now shows it after
  4 s regardless (a slow venue GPU must not leave the cover blank).
- **1989 proposal**: new `.hero.page` — the photographed page fills the right
  60 %, the year and quote stand on black at the left, credit on the left.
- **Handshake (2018) and Stumpe (1973)**: new `.hero.low.deep` — a darker
  floor, a smaller year, a bold kicker; the Lithuania kicker is gold (blue on
  a blue jacket did not read). Text still crosses the lower half of the
  woman's jacket on 2018; faces are clear (the 3:2 photo has no room to
  shift). Accepted.
- **Superconductivity**: text on the right, off the technician.
- **LHC tunnel**: cards 0.8 opaque; credit and `.src` on one baseline.
- **Credits** on every photo slide have a dark chip behind them.
- **Dim** raised on the two section slides (0.08 → 0.4) and +14 % (0.45):
  bright dust sat behind their text.
- `videos/manifest.toml` no longer lists `vu_ff_zoom.mp4` (unused; its asset
  stays on the release, do not `--prune`); `shots/` is ignored.
Left as SwiftShader timing (confirm on a GPU): the pentaquark slide (09)
showed two orbs, not five, at the 14 s shot.

## Owner's fixes (2026-10-08, via the Scheduler)

- Slides 23, 24, 27 (and 9) carry one big number at photo-slide weight:
  new `.payoff` (kicker, a 176 px gold number, a short claim, one line).
  23 → "700+ sutarčių su partneriais nuo 2011 m."; 24 → "+14 % apyvartos
  augimo per penkerius metus"; 27 → "613 mln. CHF — tiek CERN per metus perka"
  (the three ways for a firm stay in the notes); 9 → "76 iš 86 naujų LHC
  hadronų atrado LHCb", so it reads while the pentaquark is still gathering.
  `.payoff` centres with flex: the kit's rise animation ends on
  `transform: none`, which undid a translateY centring (164 px overflow).
- Slide 8 (and 2, 6) were black only because the clips were not local;
  shot from a `VITE_VIDEOS_LOCAL_FIRST=1` build after `videos:pull
  --include-shared` they show their picture. The cover title shows (4 s fallback).
- **Pin** moved to slidev-videos `dca4e8f` (feat/dust-fullframe, on top of
  efacca2): clips arrive as grains over the whole frame and condense in place
  (`dustStyle: frame`, the default). Recorded slides 5–9 (record, gluon):
  slide 6 condenses cleanly; slide 8 shows ~1 s of black between the grains
  and the clip, whose opening is dark (reported to Tools via the Scheduler).
  The opener keeps `transition="fade"`.
- **Pin 12aa015**: slide 8's black gap is gone (grains condense into the
  detector by ~1.4 s; recorded on photon). The opener has `advance-on-end`:
  the deck goes to the takeover by itself when the clip ends (audience
  window only; a click during the clip moves on early). Renders on photon
  need `-n 1` (`RENDER_SRUN_ARGS="-p photon_primary -c 16 -n 1"`): without
  it srun started two recorders that wrote the same MP4s.

## Deployed (2026-10-08)

https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_Innoday/ —
commit 6bf60b2, Pages run 37815139786 (build and deploy green), URL 200, and
the live assets carry this round's text. The owner's go was for
`talk deploy innoday --ready-skip lint --ready-skip safe`: lint is not on
this branch (run by hand from feat/facts-lint: `--release`, 0 errors, 24
warnings) and `safe` misfired (talk.py read `grain: 0.012` as a broadcast
talk; fix sent to Tools). `deploy` printed "not deployed" because it looks
for a per-talk build job and the workflow has one `build` job; the run and
the URL say otherwise.
Next: „Ačiū“ alone (no subtitles), transitions round 2 with the strands
(wip/innoday-through), the „…ir atgal“ bookend.
- **No subtitles** (owner): „Ačiū“ stands alone; „Klausimai“ and the three
  URLs moved into its notes, to be said aloud. The three part titles lost
  their subtitle lines as well (said instead).

**Slot** (owner, 2026-10-08): about 25 min or more. The deck runs ≈ 23 min: no cuts, the opener stays whole.

## Where to cut if the slot is ever shorter (kept for reference)

Now: speech ~17,5 min + clips (opener 4:26, bookend 0:30; the CERN aerial
0:11 and the LHCb animation 0:56 are talked over) ≈ 23 min.
- **20 min (−3):** trim the opener in `videos/manifest.toml` (`trim =
  ["0:00", "1:50"]` keeps Saulėtekis → Earth; the takeover then needs a new
  `opener_last.jpg` from the cut's last frame, `pnpm takeover:frame`) −2,5;
  Artemis to one sentence over the photo −0,3; the 1,8 CHF line stays out.
- **15 min (−8):** as for 20, and: the opener to ~1:00 (−3,4 in all); drop
  the Higgs slide (−0,6) and the bookend clip (−0,5, say „ir atgal“ over the
  firms slide instead); one photo per problem in Part II — drop the 1993 web
  slide (−0,7) and Artemis (−0,4); KT and +14 % to one sentence each (−0,8).
  The spine (machine → limits → inventions → firms) stays whole.

## Deployed (2026-10-08, second round)

https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_Innoday/ —
commit 1d836da, Pages run 37836227756 (build and deploy green), URL 200; the
live assets carry place mode, the depth maps and the bookend strip.
On the owner's go, with `--ready-skip lint` (run by hand: 0 errors) and
`--ready-skip safe` (talk.py still reads `grain: 0.012` as broadcast).
In this round: Part II as places (each photo a depth relief at the end of its
LHC part's strand; strands from the ring; the part named during the flight;
flight 1.6 s, condense 0.8 s, text up in ~2.6–3.8 s); Part I in runs (media,
then world) with one match cut (the grain ring → the tunnel's curve); the
bookend clip; „Ačiū“ and the part titles without subtitles; the alumni claim
corrected; the ending ask in the notes; slidev-videos v0.5.1.
A text-merged pnpm-lock.yaml had re-resolved @slidev/cli to 52.20 and
markdown-it 15 (build: ERR_PACKAGE_PATH_NOT_EXPORTED); fixed by taking main's
lock and reinstalling (1d836da).
Next: the expansion funnel → CMB opening (Planck map reprojected in
~/talks/.cache/innoday/funnel/cmb), cut the Higgs and 76/86 slides, the final
text round, print stills, the ultracode review, deploy.

## Funnel round, final reviews (2026-10-08/09, wip/innoday-funnel)

- Opening: zoom-out → takeover → the history of the Universe as a funnel of
  grains (`setup/funnel.js`, station `funnel` at [30, 40, −110]) seen from
  outside („13,8 mlrd. metų nuo Didžiojo sprogimo“ after the flight) → down
  the funnel to the CMB cap in Planck 2018 SMICA colours
  (`public/figures/cmb_planck.png`, reprojected from the IRSA preview; „380 000
  metų po Didžiojo sprogimo“ after landing) → „Iš ko visa tai sudaryta?“.
  Higgs and 76/86 cut (owner's choice).
- Text round: talk-review (facts, copy, unslop) on 82ad284, 21 findings
  verified; final talk-review (six lenses) on 2ba63fe, 36 kept; delta review
  (five lenses) on 213abe9, 30 kept; all applied but per-slide facts ids
  for the funnel and CMB (no bank entry; the sources are in the notes).
- Before → after lists were sent to the Scheduler for its text audit.
- Render: point sprites capped and faded near the camera (funnel, takeover);
  takeover grains hidden outside the prologue; strands not drawn while off;
  places at 360 columns.

## Deployed (2026-10-09, third round)

7163101, Pages run 37898098431 (per-talk build and deploy green), URL 200;
`talk ready` passed with nothing skipped. Status: complete, pending the
owner's review.

## Deployed (2026-10-09, fourth round)

fe15a19, Pages run 37906723499 (green), URL 200: the funnel to the NASA/WMAP
reference (six recording rounds against it, wmap1–wmap9 in
~/talks/.cache/innoday), the 33-point text audit, AfterFlight captions,
stills. Status: complete, pending the owner's review.

## Pages-base fix (2026-10-09, Scheduler's report)

The fourth deploy 404'd on every print still and every Part II place photo:
both were written `/figures/…`, which resolves at the site root, outside the
Pages base; a build with base `/` cannot show it. Now `figures/…` (StagePhoto,
12) and `figures/stills/NN.jpg` (PrintStill, 16; the component prefixes
`BASE_URL`). New standing check, `pnpm pages:check` (`scripts/pages-check.mjs`):
clean; with one photo put back to `/figures/` it reports
`404 /figures/hero_stumpe.jpg`. `stage:check` now passes `--types
strands,funnel` itself. Not deployed: waits for the v0.5.2 pin (place groups,
`humAt`) and the owner's go.

## v0.5.2 round (2026-10-09)

Pinned v0.5.2. Part II's eight places are `group="inventions"`: shown from
section II (`places: { inventions: true }`), hidden again from section III.
Part I's wide poses are back: section I sees the ring from above, now in the
right half clear of the title (target [8.8, 0, −3], dist 20, pitch 55; the
old [16, 0, 0] dist 24 put a bunch on the title), 4 TB/s and the tunnel look
along the ring at pitch 22. `humAt: all`. Recorded on gluon (g1a–c, st7b,
st10 in ~/talks/.cache/innoday): no place in Part I or III frames, the places
fade in during the flight to section II. Stills 07, 10, 12 refreshed from the
settled last frames. `pages:check` clean on v0.5.2.

Then, on the Scheduler's word (the owner's iPhone shows black where the world
should be): pinned slidev-videos `15a7142` (feat/v0.5.3: `?stage-debug`, the
static background after a context loss). WebTakeover's overlay context is
released as soon as its dissolve ends (it used to stay open all talk long).
ParticleHero is not in this deck. Recorded slides 3–4, 7, 12–13 on the pin
(g3a–c): the takeover, the funnel, section I and Part II's places as before;
`pages:check` clean.
