# Data3Fit (talks/2026_00_00_Data3Fit)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data3fit.md, never here.

## Brief

Talk 3 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: fitting a model: mass and lifetime of a short-lived particle's mass peak (the record 401
  peak, never named on screen or in Message/Picture lines: the owner, 29 Oct).
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 2 `Data2Peak` (counting and noise); 4 `Data4Learn` (from a perceptron to machine learning); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
- Event: none yet; an explainer series. Date `2026_00_00` (placeholder).
- Duration: 15 min each (`duration: 15min`), no questions inside.
- Delivery: recorded video (`pnpm talk record`: per-slide MP4s the owner
  narrates over) and a live 16:9 deck on a projector. 1080p web tier.
- Audience: university STEM students from any field, no particle physics
  assumed (the course's audience).
- Language: English on screen and in the notes.
- On screen: pictures and numbers only (root CLAUDE.md, talk-quality §3);
  the cover keeps a plain title. The owner narrates and does not read
  notes; notes carry sources, `<!-- facts: -->` ids and `(~N min)`.
- Quality bar: "visual good quality, not sloppy explainers / diagrams":
  real data and real footage over stand-ins, one dominant picture a slide,
  every form in the world carries what the slide says.
- Look: slidev-addon-stage v0.11.0, palette `classic` (cyan `#7dd3fc` on
  near-black, the course's accent), shared by the five talks.
- Must-haves and banned claims: from the series bible; facts only from the
  bank (`pnpm talk facts search`).
- Private brief: ~/.local/share/outreach_talks/briefs/data3fit.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data3fit` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- 2026-10-29 (draft:data3fit): the deck from notes/outline.md, 15 slides (outline slide 2
  split in two), 14.4 min + 12 s clip; space.json stations `mass`, `slice`, `tau` with the
  kit's dk-hist, dk-curve, dk-landscape, dk-spark; the clip's dust strip made. check, kit
  check, lint (one TEXT warning on the cover title: the headmatter's `onscreen: numbers` is
  also slide 1's own key) and shots green. Open: the motion checks (outline), kit-requests.md.
- 2026-10-29 (fix:data3fit): the fresh-eyes review's high and medium findings fixed (see
  Decisions, 29 Oct review fixes); 15 slides, 14.1 min + 12 s clip. Open: kit-requests.md items
  6-9 (pull-row guides, Δχ² ticks on a slice, bowl axis captions, LABEL px series-wide).
- 2026-10-29 (final:data3fit): the motion review's high and medium findings worked through (Decisions,
  29 Oct motion fixes; kit and toolkit asks in notes/kit-requests.md 10-17). Outline slides 11-12 are one
  slide now: **14 slides**, 14.1 min + 12 s clip = 14.3 min (`pnpm talk map`: 14 slides, 14.3 min timed
  of 15). `talk check`, the kit's check.mjs and `talk lint` (0 errors, 0 warnings) green. Slides 1 and
  3-14 re-recorded at 1280x720, 25 fps (scratch takes, not committed), measured by mean luminance and
  frame-to-frame difference: slide 4 is a cut (largest diff 2.6, was 13.8 with the flight); slide 6
  never goes black (luminance 20-23 through 0-3 s, was 16 for 0.5-1.4 s); slide 9's cut back has no
  white bar (largest diff 2.1, was 13.2); slide 10 opens on slide 9's plot (37, was black 18) with no
  step at the hidden cut; slide 11's 2 000 drop from 0.3 s (14 → 983 → 1 898 → 2 000 at 0.8 / 1.6 /
  2.4 / 3.2 s, was nothing before 2.4 s); slide 12 keeps its curve through the cut (click 3) and its
  landing glow is down to about a second (16.9 → 26.7 → 19.4 by 2 s, was bright to 3.8 s); slide 13's
  cut back draws its curve at the plot's scale; slide 14's 20 993 at 1.5 s.
  Open: the cover's first 0.6 s on a fresh page (toolkit, kit-requests 14); the clip's release copy
  (kit-requests 15: only the local web copy is re-encoded with a 25-frame GOP and no B-frames, not
  published); the curves' 1.2 s draw-on after a cut back (kit-requests 10); slide 3's shift still
  moves few pixels (frame diff 0.2; kit-requests 12-13); slide 12's landing glow (16); the clip's
  break-up into slide 11 stays a dust burst (largest diff 21.8 at 0.6 s, bible §3) with a one-frame dip
  at the DOM cut (17). Next: `pnpm talk review data3fit`, then the owner's look at the takes.
- 2026-10-29 (polish:data3fit): the kit steward's deck changes, the series check's findings and the
  series' one look applied (Decisions, 29 Oct polish). 14 slides, 14.3 min timed of 15 (`pnpm talk map`).
  `talk check` green (the one build warning is Vite's outDir-outside-root note), check.mjs 0 errors
  0 warnings, `talk lint` 0 errors 0 warnings, `talk shots --sheet` all 14 slides (slide 6 re-shot
  after its caption fix). Seen in the stills: tick numbers at the kit's 36 px with no label touching on
  any mass pose (so no 40-MeV ticks needed), the cover's plain title, the pull row's ±2 guides
  (slides 4-5), the bowl's three captions (slide 6), Δχ² levels (slides 7-8), the thinned curve on
  slide 9, slide 13's light-blue core in a white ring. Not seen (motions, clicks): the `{shift}` flash,
  the curve standing at once on the cuts back (slides 9, 13), slide 11's ghost, slide 12's quieter
  landing. Open: the cover title now stands on the plot's left shoulder (Decisions); the hist caption
  "mass MeV/c²" touches the tallest right-hand pull bars on slides 4-5; `shots/15.png` is a stale
  frame from the 15-slide draft (not removed: no git changes in this pass). Next: re-record the takes
  (every tick and caption is 1.5 × larger), then the owner's look.
- 2026-10-29 (fix:data3fit, the review of the one-look pass): its 3 high and 8 medium findings fixed
  and 3 lows (Decisions, 29 Oct review of the one look). 14 slides, 14.3 min timed of 15 (`pnpm talk map`).
  `talk check` green (Vite's outDir note the one build warning), check.mjs 0 errors 0 warnings, `talk lint`
  0 errors 0 warnings, `talk shots --sheet` of slides 1-9 and 12-14, plus click stills of 3, 5, 6, 9, 12, 13
  (scratch). Seen: the cover's plot right of the title; slide 3's mean and world mark as one line, apart and
  labelled on the click; slides 4-5 one frame, the pull row clear of the caption with its ±2 guides; slide 6's
  bowl centred with the μ number left of it; slide 8's 1 864.47 and 1 864.84 apart; slide 9's two marks at
  two heights; slide 12's τ 0.509 → 0.421 with its error line; slide 13's labelled centre mark. Open:
  kit-requests 18-22; the motions (slide 1's slide, slide 6's dust, slide 12's gliding τ) are unseen in a
  take; T3 14 against T4 01 at t = 0 (another talk's take); slide 13's ring still sits by the 1 880 label
  (`oursSlot` is the series' T2 slot: changing it breaks the cover's match). Next: `pnpm talk record data3fit`
  (slides 1, 3-6, 8, 9, 12-14), then the owner's look.
- Branch `talk/data3fit`, worktree `.claude/worktrees/data3fit` (`pnpm talk open data3fit`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data3Fit/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data3fit.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. Full plan:
`notes/outline.md` (2026-10-29, revised from the critique; deck numbering below, after the
split of outline slide 2, the review fixes and the motion-review merge of outline slides 11-12, 29 Oct). Nothing names the particle, its
decay, the cut's quantity, the tracker or the record on screen or in Message/Picture lines.
14.1 min + 12 s clip = 14.3 min, 14 slides.

1. Cover: T2's last frame (the short-lived particle's mass peak, our grain ringed), a line of grains draws across the peak and the plot slides right of the plain title "Fitting" in 2.5 s; "today we draw a line through this peak and measure it" (0.5).
2. Means disagree, wide: a lit window narrows from 50 to 30 MeV/c², its mean 1 864.71 → 1 864.79 against the world value 1 864.84 (0.8).
3. Means disagree, close: a cut closer to the peak (white window, blue columns either side); the window narrows to 20 and its mean (1 864.81) lands on the world mark labelled 1 864.84 as one line; on the click the same window moves half an MeV/c² and its mean's mark, labelled 1 864.42, stands apart; a window's mean is not the mass (0.7).
4. A model: start values: a bell curve on a line at eyeballed knobs, its pull row with a zero line and a ±2 ruler; a pull is one bin's miss in √N units, χ² adds them squared (371.5) (1.5).
5. A model: the fit: the curve glides through the logged steps onto the peak, pulls lose their pattern; μ 1 864.47, width 7.65, χ² 53.4, near the degrees of freedom (40) as it should be (2.0).
6. The valley: the bowl: the camera rises, the plot tips back and lifts away as dust, and the χ²(μ, width) bowl gathers, centred; the ball rolls to the bottom, the Δχ² = 1 ring lights; the fit is the bottom of a valley (1.5).
7. The valley: the slice: one cut along μ, the Δχ² = 1 bar from 1 864.38 to 1 864.57; the error ± 0.10 is how wide the valley is 1 above its bottom (1.0).
8. Off by 0.37: the same slice drawn to Δχ² 20 with its levels 1, 4, 9, 16, the ball labelled 1 864.47, the world value's ± 0.04 as a white band high on the wall labelled 1 864.84; Δχ² 14.5 is 3.8 of our errors, with the world value's added in quadrature 3.5 σ (1.0).
9. Off by 0.37: a scale: every grain slides by 0.02 %, the curve's summit glides from 1 864.47 onto 1 864.84; a 0.026 % momentum calibration closes the gap, the experiment's uncertainty is 0.03 %, so value ± stat ± syst (1.0; gated on its `{shift}` burst strip).
10. How long it lives: clip of the silicon tracker going in around the collision point (12 s); it sees where each particle was made and where it decayed.
11. Decay times, a few: 2 000 candidates drop onto the decay-time axis as the camera lands (decay time = flight over speed, τ 0.41 ps, cτ 123 µm), then the sideband subtraction; three in four sideband grains take a window grain with them, 596 stay (1.0).
12. Decay times, all, then cut: every candidate drops in over the 596 in 0.8 s; click 1 the same subtraction; click 2 an exponential from 0.5 ps, τ 0.509 ps against the world value 0.410, it lives too long; click 3 a quality cut (how far the track points from the collision) lifts grains at every time, most from the tail, the slope steepens; particles made in a heavier particle's decay start away from the collision and fake a long life; τ 0.421 ± 0.005 ps (1.8).
13. Which grains are signal: the whole peak with a white dotted mark at the fitted centre, labelled 1 864.47; it whitens by P(signal), our grain's large core turns light blue; its signal share is 0.144, 16.2 MeV/c² off centre (0.8).
14. Close: pull back to the whitened peak with its curve (T4's cover pose); 20 993 signal, which leaves at 11 s so the take ends on the bare peak; next time a machine draws the line (0.5).

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 1 864.71 → 1 864.79 MeV/c² mean (s2, live) | window means, 50 and 30 MeV/c² wide, centred on 1 865 | record 401 via bake/d0.py (d0-means.json) | 2026-10-29 | course-d0-row-means-worked | OK |
| 1 864.84 MeV/c² world (s2, s3; tick s3, s8, s9) | the world mass, PDG 2026 OUR FIT ± 0.04 | https://pdglive.lbl.gov (S032) | 2026-10-29 | pdg-d0-mass-2026 | OK |
| 1 864.81 → 1 864.42 MeV/c² mean (s3, live; tick label 1 864.42 on the click) | the 20 MeV/c² window centred on 1 865, then on 1 864.47 | record 401 via bake/d0.py (d0-means.json centredOnFit) | 2026-10-29 | course-d0-row-means-worked, d0-window-centre-bias-worked | OK |
| 7.2 MeV/c² width (s4) | start width, FWHM 16.86 / 2.355 | record 401 via bake/d0.py (d0-fit.json start) | 2026-10-29 | d0-fit-start-fwhm-worked | OK |
| 371.5 χ² (s4, live) | χ² at the start values, 45 bins | record 401 via bake/d0.py (d0-fit.json iterations[0]) | 2026-10-29 | d0-fit-start-chi2-worked | OK |
| 53.4 χ² (s5, live) | χ² at the fit, 40 degrees of freedom | record 401 via bake/d0.py (d0-fit.json) | 2026-10-29 | d0-fit-chi2-ndf-worked | OK |
| 1 864.47 MeV/c² μ (s5, s6 live, s7 live; tick s8, s9, s13) | the fitted centre | record 401 via bake/d0.py (d0-fit.json) | 2026-10-29 | course-d0-fit-mass-worked | OK |
| 7.65 MeV/c² width (s5) | the fitted width, 7.645 ± 0.099 | record 401 via bake/d0.py (d0-fit.json) | 2026-10-29 | course-d0-fit-mass-worked | OK |
| 1 864.3 / 1 864.5 / 1 864.7 (s6 ticks) | the bowl's μ ruler | record 401 via bake/d0.py (d0-chi2.json) | 2026-10-29 | d0-fit-valley-delta-chi2-worked | OK |
| ± 0.10 MeV/c² error (s7); bar 1 864.38-1 864.57 (s7 labels) | Δχ² = 1 half-width 0.0965 | record 401 via bake/d0.py (d0-chi2.json slice) | 2026-10-29 | d0-fit-valley-delta-chi2-worked | OK |
| 0.37 MeV/c² gap, 3.5 σ (s8) | gap to the world value, 3.52 σ unrounded | record 401 via bake/d0.py; PDG 2026 | 2026-10-29 | d0-pdg-gap-3p5-sigma-worked, d0-pdg-on-valley-wall-worked | OK |
| 0.026 % momentum (s9) | the momentum-scale shift that closes the gap (0.0197 % in mass) | record 401 via bake/d0.py (d0-fit.json scale) | 2026-10-29 | d0-mass-shift-0p02pct-worked | OK |
| 0.03 % uncertainty (s9) | LHCb's momentum-scale uncertainty, 2010-2012 data | LHCb, Int. J. Mod. Phys. A 30 (2015) 1530022 | 2026-10-29 | lhcb-momentum-scale-uncertainty | OK |
| 2 000 → 596 candidates (s11, live) | the first 2 000 of the seeded order, after the paired subtraction | record 401 via bake/d0.py (d0-tau.json plotSubtract) | 2026-10-29 | d0-tau-subtract-2000-worked | OK |
| 0.509 ps τ (s12, click 2, the curve's live readout) | sideband-weighted fit from 0.5 ps without the cut | record 401 via bake/d0.py (d0-tau.json scanT0.all) | 2026-10-29 | d0-lifetime-without-ipchi2-cut-worked | OK |
| 0.421 ps τ, ± 0.005 ps error (s12, click 3; the readout glides 0.509 → 0.421) | the committed fit with the quality cut, statistical error only | record 401 via bake/d0.py (d0-tau.json fit) | 2026-10-29 | d0-lifetime-fit-from-record401-worked | OK |
| 0.410 ps world (s12) | PDG 2026 mean life, 410.3 ± 1.0 fs | PDG 2026 summary tables | 2026-10-29 | pdg-d0-lifetime-2026 | OK |
| 16.2 MeV/c² offset (s13) | our grain above the fitted centre (16.18, 2.12 widths) | record 401 via bake/d0.py (d0-fit.json row1) | 2026-10-29 | d0-row1-signal-share-worked | OK |
| 0.144 P(signal) (s13) | our grain's signal share, 233.6 / 1 624.0 | record 401 via bake/d0.py (d0-fit.json row1) | 2026-10-29 | d0-row1-signal-share-worked | OK |
| 20 993 signal (s14) | the fitted signal count, ± 276, 1 820-1 910 MeV/c² | record 401 via bake/d0.py (d0-fit.json params.nSig) | 2026-10-29 | course-d0-fit-mass-worked | OK |
| 1 820 … 1 900 mass ticks; 0-5 ps decay-time ticks | axis rulers (the series' 1 816-1 912 range) | the data kit (style.js MASS) | 2026-10-29 | (axis) | OK |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/main.ts`: installs the shared data kit (`installDataKit`) with this talk's pinned stage.
- `styles/index.css`: imports the kit's nums.css; Data2Peak's cover title rule and its cover scrim
  (`.slidev-layout.cover::after`, a radial darkening behind the title only), word for word.

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-28, the owner (chat): the series "Data analysis, the CERN way",
  five 15-min explainers, STEM students, English, recorded video plus a live
  16:9 deck. All four were the recommended options.
- 2026-10-28: toolkit v0.11.0 ("use the latest tools"), pinned with
  `pnpm talk pin`; pnpm dropped `path:`/`gitHosted` from the other talks'
  toolkit tarball resolutions, so main's resolution lines were restored
  (memory: lockfile path keys after a pin). Undo: `pnpm talk pin <talk> v0.8.1`.
- 2026-10-28: palette `classic` for the whole series (the course's cyan on
  near-black; no live talk uses it; never gold). Alternative: `blue` (Tokyo's)
  or a series palette via `definePalette`.
- 2026-10-28: names `2026_00_00_Data<N><Topic>` so the five sort in series order.
- 2026-10-29, the owner (review page and chat): roll out all the kit's forms
  (prototype pairs seen as recorded takes,
  https://claude.ai/artifact/Ef62WwCznaTyo7MKcM8338); cuts between stations;
  keep the record 401 peak as the thread but never name it (no D⁰, K⁻π⁺,
  IPχ² or record numbers in Message/Picture notes or on screen; Sources keep
  the provenance); big picture only: no experiment internals (sub-detector
  and trigger-stage names, GPU counts, CMS/ATLAS analysis counts). Mass axis
  1 816-1 912 MeV (default taken: the answer to that question was "No D0").
  Undo: the series bible's top block (components/data-kit/notes/series-bible.md).

- 2026-10-29 (fix:data3fit, from the fresh-eyes review): `.nums` raised to bottom 190 px (as
  T4) so a block ends above the lower third, with the poses moved so the numbers stand on
  black; tick labels at 36 px on a 1080 frame (`tickPx` on every form, about 18 canvas px,
  the house floor) until the kit raises LABEL for the series (kit-requests item 9); "PDG"
  on screen is "world"; slide 2's third window lands on slide 3's close pose (a cut), where
  the mean tick and the world mark separate; slide 4-5 columns lighter (`alpha` 0.72, dim
  0.15) with a dim ±2 ruler at the pull row's left end (hist ticks); slide 5's χ² is "53.4"
  alone (40 said); slide 6's bowl gathers on arrival (ball click 1, ring click 2) and drops
  its unnamed width ticks; slide 8's world band is white (fill 0.3) and the one-error bar
  stands at the slice's foot; slide 9 re-posed so the summit is right of the numbers;
  slide 11 opens on the 2 000 landing (1.0 min); slide 14 shows the whole peak with a dim
  fitted-centre mark and a second marker `big` (core size 7) so the core's colour change
  reads. Alternative for slide 14: the close flank pose with `offset` dropped.

- 2026-10-29 (final:data3fit, the motion review's fixes; each with its alternative):
  - Headmatter `transition: dust` (bible §3, as T2 and T4): the DOM cuts, so no slide's numbers stand
    faded over the next one (the review's slides 4, 9, 13). Alternative: `fade`, as before.
  - Outline slides 11-12 merged into deck slide 12 (three clicks; 0.421 takes 0.509's line on click 3):
    a second slide replayed the subtraction and drew the curve on again. Alternative: the kit's own fix
    (no replay when a slide's steps equal the last click's), then split again.
  - The mass plot and its curve stand out of view while the camera is at the slice and decay-time
    stations (h 8 / fit 6 on 7-8, h 9 / fit 7 on 10, h 10 / fit 6 on 11-12), so slide 9's and 13's cuts
    back open at the plot's scale (slide 9's take had a white bar and a clipped curve at 0.4-1.8 s). The
    curve still draws on in 1.2 s after the 0.35 s settle (kit-requests 10).
  - Slide 10's camera holds slide 9's pose under the arriving clip and cuts at 1.9 s, once the dust has
    gathered into the clip (no black before the footage; a cut at 1.0 s showed through the grains); the clip still leaves as dust (1.7 s, the default), not a cross-dissolve as the review
    offered (bible §3 keeps dust for clips); a 1.0 s leave (`videos.dustMs`) was tried and made the
    break-up harsher (a one-frame dip from 59 to 42 and a 23 frame diff), so it was dropped. Slide 11: path 1.5 s, the 2 000 drop from 0.3 s
    and stand by about 3 s (lead 0.3, fill 1.4, fall 0.8). Slide 12 enters with the rest of the
    candidates in about 1.6 s over the 596 (fill 1.0, fall 0.6, lead 0), `selGain` 1.3 and the tau
    plot's `glowTint` 0 (a landing grain glows light blue, not white), so the landing glow round the
    tallest columns lasts about a second instead of 2.4 s (kit-requests 16); 1.6 again once subtracted. The 596 cannot keep their places: the scale goes from the
    2 000's (max 260) to every candidate's, so they glide down as the rest land.
  - Slide 10's clip: the local web copy re-encoded from the raw (`-g 25 -bf 0`, CRF 19, 8.5 Mbit/s cap)
    against the recorder's black macroblocks on frame-by-frame seeks; the dust strip remade. The release
    copy is the manifest's `standard` encode until a profile key exists (kit-requests 15).
  - Slide 4 is a one-key cut from slide 3's close pose (a 1 s flight from dist 7 to 22 swung the plot
    through the frame). Slide 6: the camera path 3 s → 1.5 s, and the plot with its fitted curve tips back
    62° (no tick numbers; h step 13) over the gathering bowl instead of fading to black first; click 1
    fades it with the ball's roll, before the μ number (its caption "mass MeV/c²" lies tipped beside the bowl
    until then) (alternative: `h: 0` on arrival, the black
    second the review found); slide 7's ball rolls in about
    0.9 s (`roll.leg` 0.18) from 1.6 s, the numbers at 2.4 s and 3.2 s; slide 3 framed at dist 7 (aimed at y 10.4 so the marks over the summit
    stand inside the frame) with a white dotted mark at 1 864.42 on the click beside the dim world mark (the camera push on the click
    needs the stage, kit-requests 13); slide 5 two clicks (the last logged steps as one glide); slide 14's
    20 993 at 1.5 s.
  - The cover's pose was T2's close already; its spark now matches T2's close too (a white ring on
    the plot's own grain, no white core: `ours` step 1 `{ on: h }`, as T2's spark step 2), and the
    first-guess line draws on once the plot stands (about 0.35 s). Its first 0.6 s in a take is the page
    booting (record.mjs films slide 1 from the first frame), a toolkit request (kit-requests 14).
    Alternative: a white core, as the earlier cover had.
    Not changed either (low): slide 4's slow brightening, T4's cover state (another talk's deck).

- 2026-10-29 (polish:data3fit, the steward's pass, the series check and the series' one look):
  - The one look: styles/index.css imports `components/data-kit/nums.css` and keeps no `.nums` rules of
    its own (the kit's `.name` is weight 400 with a 0.6em gap, was 500 and 0.5em); the cover title is
    Data2Peak's `.slidev-layout.cover h1:only-of-type` block (stage type scale, no text-transform
    override, so it renders in capitals as the theme sets it) and a plain `# Fitting` (no `.name` span;
    the lint exempts the cover title now). The deck's own cover placement (`padding-top: 84px`, the
    title high over the black) went with it, so the title now stands at the theme's place, over the
    plot's left shoulder. Alternative, if the owner prefers it for all five: a series-wide placement rule
    in the kit, not a deck override.
  - Every `tickPx: 36` deleted (h, bowl, s1, s2, tau): the kit's LABEL is 36 px for the series. The
    wide mass poses (dist 22-28) keep ticks every 20 MeV/c²: none of their labels touch in the stills.
  - Our grain: the ring is the kit's default white (the explicit `ringColor: 'sel'` dropped); `big`'s
    core on slide 13's arrival is the crowd's light blue (`color: crowd`, was white), as since Talk 2's
    close, and the click lets it take its own 0.144 (`follow`), so it stays mostly light blue while the
    summit whitens round it (series check: slide 1 said light blue, slide 13 said white). The
    Picture line says so. The mass plot's `oursSlot: 3` lifts our grain clear of the axis line.
  - Headmatter info: "a 0.026 % momentum-scale shift would close the gap, inside the 0.03 % uncertainty".
  - Steward deck changes taken: `fit` `pull.guides [-2, 2]` (the hand-made ±2 ruler of h step 6
    deleted); `fit` steps 6+ `replay: false` (slides 9 and 13 cut back to a standing curve); a thin
    curve for slide 9's close pose (`thick` 0.008, `alpha` 0.6: new fit step 8, the fitted state thinned,
    used on slides 7-9 arrival; step 7, the shifted refit, thinned too), the plot's other slides keep
    the full line; `bowl` `words` (μ MeV/c², width MeV/c², Δχ²) and width ticks 7.6, 7.8 (7.4 sat under
    the width caption); `s1`/`s2` `yticks [1, 4, 9, 16]` (s1 shows 1 and 4, its slice stops at 4);
    `tau` step 3 `ghost: 0.15` (slide 11's subtraction leaves a faint ghost) and step 4 `glow: 0.3`
    (slide 12's arrival lands quietly). Slide 6's tipped plot gets `axis: false` (h step 13), since its
    "mass MeV/c²" caption sat on the bowl's new "width MeV/c²". Alternative: keep the caption and drop
    the bowl's `words.y`.
  - Declined: `readout: 'window'` for slide 11 (it would read 1 172 window grains before the click,
    and "signal" for those is wrong; "candidates" 2 000 → 596 stays, outline Decision 8). Kept until a
    take confirms the kit's load-time frame (steward 11): `h` and `fit` standing out of view at the mass
    station while the camera is elsewhere.

- 2026-10-29 (fix:data3fit, the review of the one-look pass; each with its alternative):
  - Cover: Data2Peak's cover scrim block (behind the title only) and a 2.5 s path from T2's close pose to
    [-7.5, 3.2, 0] dist 27 while the title rises, so the bars clear the title (the review offered [-5.5, …]
    dist 26.5; by the frame's geometry, FOV 50°, the 1 816 columns would stand against the title's last letter there). Alternative: the
    title placement as a series rule in the kit.
  - Slide 3: `meanTick: false` and the mean as a white step tick at the world mark's span and depth (one
    line, kit-requests 18); pose dist 10.5 (white window, blue columns either side, the labelled world mark),
    not 11-12: there half an MeV/c² is under 10 px and no axis shows either way. The click labels 1 864.42.
  - Slides 4-5 one pose, [-7.1, 2.6, 0] dist 25 (at dist 22 the three-line block touched the columns); the
    χ² line is the block's last on both; the pull row at `y` −0.46, `height` 0.15, clear of the caption;
    guides denser (`split.zero` 0.15, 14 000 grains; kit-requests 20).
  - Slide 6: the plot tips back with a cut that takes every grain (dust by about 2.5 s) and the curve fades
    in 0.8 s during the rise (kit-requests 21); end pose [-3, -2.8, 6.2] dist 20 pitch 30, the bowl centred
    right of the μ number. Alternative: `h: 0` on arrival (0.35 s, the plot never seen tipping).
  - Slide 7: s1 `yticks [1]`. Slide 8: no ring (its crossing labels cannot be dropped, kit-requests 19), the
    ball labelled 1 864.47, the band fill 0.5 with 4 000 grains. Alternative: the ring and its two labels.
  - Slide 9: dist 5 at [-1.5, 10.3, 0] (0.37 MeV/c² about 18 px at FOV 50°; the review's 40-60 px would need dist 2 or less),
    the marks at two heights (fit [0.8, 1.02], world [0.86, 1.1]) with staggered labels.
  - Slide 12: τ is the decay curve's readout (`readout: tau`, `<StageCount for="decay">`), gliding
    0.509 → 0.421 with the curve; the error its own line; no negative margin and no swap needed.
  - Slide 13: 1 860 back, the centre mark white (`tick` and `axis` marks draw in the same dim colour) and
    labelled 1 864.47 above the summit. Slide 14: `.nums out`, 20 993 leaves at 11 s (take ≈ 12.4 s).
    Slide 2: dist 28 at x −8.7 (right margin about 90 px). `shots/15.png` deleted.

## Verify

```bash
pnpm talk check data3fit     # videos:check, stage:check, a build into /tmp/talk-data3fit/site
pnpm talk review data3fit    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data3fit     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
