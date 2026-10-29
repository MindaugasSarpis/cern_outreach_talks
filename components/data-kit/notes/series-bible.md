<!-- Filed 2026-10-29 from the data-series-design workflow (three proposals, two judges, one editor). -->

> **Corrections since the bible was written (bakes and research, 2026-10-29), which win over the text below:**
> - Momentum scale: the K⁻π⁺ mass moves by 0.856 of the momentum scale at rest (mean 0.77 over decays), so the shift that closes the 0.37 MeV/c² gap is about 0.026 %, not 0.02 % (the 0.02 % *mass* shift stays right). LHCb's momentum scale is calibrated to 0.03 % (`lhcb-momentum-scale-uncertainty`).
> - The PDG gap is 3.52 σ fully unrounded (3.5 on screen; 3.44 from rounded inputs).
> - T4's record-401 classifier takes log pT, log decay time and log IPχ² (the course recipe).
> - Record 401 lists an Adler-32 checksum (2ebf133a), not SHA-256; the SHA-256 above is ours. It counts 53 948 events; the file holds 91 583 candidates. The data-taking year is not stated (the masterclass guide says 2011).
> - The LHCb masterclass cuts on log₁₀(IP), not IPχ² < 9: IPχ² < 9 is our cut (`d0-from-b-ipchi2`).
> - Open 4ℓ sample: the record says about 2 σ; our count is 12 observed against 4.66 expected in 121-130 GeV. No σ of our own on screen.
> - ATLAS's 60 collisions a crossing is ATLAS's figure only (`atlas-cms-run3-pileup-60`); ML in LHCb's trigger is HLT2's topological selections (`ml-in-lhcb-trigger`).
> - Lifetime: τ = 0.421 ± 0.005 ps (stat) from the committed unbinned sideband-weighted fit (IPχ² < 9, 0.5-5 ps, acceptance not modelled).
> - Clips: all seven new CERN clips carry the licence "CERN" (videos.cern.ch API); no on-screen credit.

# Series bible: "Data analysis, the CERN way"

Five explainer talks of 15 minutes each (planned at 14.0, limit 15.75), for university STEM students from any field.
Each talk takes one idea from the CERN lessons course and tells it through CERN data, at the visual standard of the
owner's outreach talks. Delivery: recorded per-slide MP4s (`pnpm talk record`, silent takes, the owner narrates) and a
live 16:9 deck. Toolkit: slidev-videos v0.11.0 pins, palette `classic`. Notes carry Message, Picture, caveats,
Sources, fact ids and `(~N min)`. There are no speaker scripts.

Frame: the data-as-matter proposal (judges 97). Grafts: Keynote supplies the cover loop, dk-vertex, the χ² bowl under
the tilted plot, the leak-and-undo beat and accuracy fixes. Teacher supplies the misconception per talk, the ladder
check, the heap shift, and Talk 4 on course and record 401 data. Numbers marked **[computed 2026-10-29]** were
recomputed in this run from the course CSV
(`/home/mindaugas_wsl/claude_sessions/CERN_lessons_on_data_analysis/lectures/workbook/docs/data/D0_KPi.csv`,
3 926 142 B, 91 583 rows), with the course fit parameters from kit-course.md l.324. The bake scripts must commit
every one of them before it goes on a slide.

---

## 1. Spine

One grain is one D⁰ candidate. Talk 1 makes it, Talk 2 counts it, Talk 3 measures it, Talk 4 sorts it, and Talk 5
deletes it and makes it again.

Ladder rule (review checklist): talk N uses only what talks 1 to N−1 introduced. Each talk's scope_out names the talk
that owns each excluded idea.

| idea | introduced in | first used again in |
|---|---|---|
| bunch crossing, trigger, buffer, a row of four numbers (mass, pT, decay time, IPχ²) | T1 | T4 (gate), T5 (route back) |
| the K⁻π⁺ mass (one pair = one grain on the axis, dk-vertex) | T2 part 1 | T3 |
| histogram, √N, σ as significance, p-value, sidebands as counted background | T2 | T3 (3.5 σ gap, sideband subtraction) |
| model, width, fit, χ², Δχ² = 1, P(signal), IPχ² cut, decay time | T3 | T4 (loss bowl, cut as a line, whitening) |
| classifier, train/test, leakage, recall | T4 | T5 (choices before looking) |
| record, hash, pinned environment, blind choice | T5 | (series close) |

Cover loop: each talk's last frame is the next talk's cover pose.
T1 heap on the floor → T2 cover. T2 settled D⁰ peak → T3 cover. T3 whitened peak with its curve → T4 cover, where the
histogram tips into a 2D cloud. T4 cloud collapsing into one ball (the file) → T5 cover. T5 cranes back to T1's
crossing as a recorded plate.

## 2. Thread

**CERN Open Data record 401**: LHCb D⁰ → K⁻π⁺, DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR, CC0 per the record page, ROOT
file 1 289 541 B (sha256 8694a2ed…3b039b). The course CSV `D0_KPi.csv` has sha256 25c3c972…c1505136, 91 583 rows,
and columns M (MeV/c²), PT (MeV/c), TAU (ns, −100 = missing in 49 rows) and IPCHI2.
- Always say "candidates". The portal's 53 948 counts events, and there is more than one candidate per event.
- The same 91 583 grains appear in every talk, one grain per candidate, at the same grain size, on the one shared floor.

**Our grain = row 1** (read 2026-10-29): M 1 880.649 MeV/c², PT 3 000.95 MeV/c, TAU 0.4127 ps, IPCHI2 1 299.17.
- T1: our white packet passes both gates and becomes this row.
- T2: its K⁻π⁺ pair lands first, in the 1 880-1 882 MeV bin on the flank of the peak.
- T3: it lies 16.2 MeV/c² (2.1 widths) above the fitted centre. The fit gives it P(signal) = 233.5 / (233.5 + 1 390.5)
  = 0.144 **[computed 2026-10-29]**, and the IPχ² < 9 cut removes it.
- T4: it lies outside the hand cut, in the overlap of the real classifier.
- T5: it is deleted and rebuilt, and lands in the same bin.

The point it makes: nobody can say whether one row is a D⁰. The notes must say three things:
- the crossing drawn in T1 (record 24506) is a different real crossing;
- the record 401 rows passed the Run 1 trigger, not the Run 3 one;
- the data-taking year is a gap.

---

## 3. Look (binding for all five decks)

### Palette and colour grammar
- `stage.palette: classic` as shipped, with no bg override: near-black ground, accent `#7dd3fc`, fg `#f2f5f9`, dim
  `#8b97a6`. Builders take colours from `ctx.palette` only, never a literal.
- **Light blue `#7dd3fc` is the crowd**: all candidates, background, packets in the lane, the unselected.
- **White `#f2f5f9` is the selected**: kept, signal class, inside the cut.
- **Dim `#8b97a6`** is for axis grains only.
- **Never gold.** Every ported `#ffc05a` default is deleted.
- **Our grain gets a marker, not a colour.** It is drawn at size 2.5 with a soft halo ring of fine grains (dk-spark).
  Its core takes the colour the grammar gives it on that slide: white while it is kept (T1), light blue once it is
  background-like (T3 whitening at 0.144, T4). So row 1 never reads as signal.
- On-screen numbers are `#e8f6ff`, names `#9fd8ff` (the Tokyo pattern).

### Grains
- Every form is built on `grainMaterial` / `GRAIN_GLSL`, every placement and sample is seeded (`mulberry32`), and
  every object declares `grains` (its tier-0 count) so `grain-budget` counts it.
- One constant file, `components/data-kit/style.js`, holds the series grain size, our grain's size (2.5), the floor
  plane, the mass scale (world units per MeV) and the axis tick spacing. No talk overrides them. This is what makes
  five implementers' decks look like one series.
- **One floor (dk-ground).** Every histogram stands on the same plane with mass running to the right. Every
  histogram uses 2 MeV bins unless the slide is about rebinning.
- `ambient: 0` on data slides and `dim` 0.2-0.35. `steady: true` on any slide where a number is read off the picture.
- Budget: about 600k lit grains a slide at tier 0, 300k per builder, and the dust is 123 904. Any slide over budget
  or with a burst finale is `recorded: plate`.

### Figures
- A plot is a heap of grains, one grain per entry. Its axis is a line of dim grains.
- Tick numbers are fixed-size world labels of at least 18 px (`label.js` over `makeLabel`, `upper: false`).
- At most one axis caption, of 5 words or fewer, with no colon: `m(K⁻π⁺) MeV`, `decay time ps`, `log IPχ²`.
- A curve is a line of slowly flowing grains. A surface is a height field of grains.
- No solid shapes, arrows, boxes with words, or neuron diagrams. Perceptron weights appear only as numbers.
- One histogram a slide. The owner asked for "one histogram, not a lot of data".
- **Two meanings of σ, never mixed.** The Gaussian's spread is called **width**: a number with `.name` "width",
  e.g. `7.65 MeV/c²`. **σ** means significance only, introduced in T2. Row 1's offset is shown as
  `16.2 MeV/c²` or `2.1 widths`, never as "2.1 σ".

### Number type
- Toolkit typography with MasterTalk's `.nums` block: a 46 px number and a 22 px `.unit`, each line fading in at
  its `--dN` after the camera lands.
- 1 to 3 numbers a slide, each with its unit (`<span class="unit">`) and at most a one- or two-word `.name`.
- `%` and `σ` go in `.unit`. Big counts are written in full with plain spaces, or as `<StageCount>`; exponents as
  `<sup>`. Symbols (μ, τ, χ²) go in `.name`, never as `τ =` text.
- `<StageCount>` with `decimals` for anything the world counts or settles on.

### Sound
- Every deck sets `sound: { hum: false, flight: false, clip: false }` (takes are silent, and the owner narrates).
- One series music bed is laid in the edit under all five talks, with one measured peak a talk:
  - T1: the first gate fires
  - T2: the hush at 5 σ
  - T3: the bowl reveal
  - T4: the leak snaps apart
  - T5: run 2 lands
- Accents go on the music clock only (`<StageSoundtrack drop>` if the owner later wants it live), never the world clock.

### Transitions
- `transition: dust` between world slides, with `videos.dust: '#7dd3fc'`.
- Clip to world: a one-key `path` cut under the clip's last frame, then a crane. Commit
  `public/video-frames/index.json`.
- Never a fade after a clip, never `advance-on-end`, no h1 on a clip slide. Each clip is 15 s or shorter.

### Headmatter (all five)
`onscreen: numbers` and `sources: notes`. The `2026_00` date sorts before the `2026_10` cut-off, so without these
lines the numbers-only lint is off. Also: `duration: 15min`, `lang: en`, `stage: { palette: classic, motion: floor,
lang: en, sound: {hum: false, flight: false, clip: false} }`, v0.11.0 pins, `three` added to `package.json`, and the
dk types passed to `stage:check --types`.

The cover keeps a plain title and nothing else. Delete the scaffold's subtitle, byline, card, `.src` line,
`ring`/`orbs` station and "start here" label.

### Slide pattern
Pose frontmatter with a `#` reason → authoring comment → `<StageSteps>` → one picture → `.nums` →
`<!-- facts: … -->` → notes (Message, Picture, caveats, Misconception where it applies, Sources, `(~N min)`).

---

## 4. Shared kit (`components/data-kit/`, types prefixed `dk-`)

Registered once by `installDataKit(registerBuilder)` from each talk's `setup/main.ts`. The kit is built on
`talk/data1trigger` (the first talk in the ladder, which builds the first prototypes). The other four branches merge
that branch until it reaches main. No talk edits `components/data-kit/` without merging back first. The kit is
lifted into slidev-addon-stage after the series.

**Build order** (each step unblocks the talks listed):
0. `index.js`, `style.js`, `rng.js`, `sampler.js`, `label.js`, `check.mjs` (all)
1. `dk-hist` (T2, T3, T5)
2. `dk-heap`, `dk-spark`, `dk-ground` (T1 close, T2 cover)
3. `dk-trigger`, `dk-glow`, `dk-lineup` (T1)
4. `dk-vertex` (T2)
5. `dk-curve` (T3)
6. `dk-bell` (T2)
7. `dk-landscape` (T3, T4)
8. `dk-scatter` (T4)
9. `dk-pipeline` (T5)

Bakes run alongside, starting with `bake/d0.py`. Content work on all five talks proceeds while the kit is built, and
heavy renders wait for each form's prototype pair.

| name | lift / new | what | fields | steps | used in |
|---|---|---|---|---|---|
| `installDataKit`, `style.js`, `rng.js`, `sampler.js`, `label.js` | new; `sampler()` lifted from MasterTalk `setup/funnel.js` l.78-88 | registration, series constants (§3), mulberry32, pdf sampling, fixed-size labels with an 18 px floor | none | none | 1-5 |
| `dk-hist` | lift and merge: KJ `talks/2026_10_26_UzsikraukKarjerai/setup/grains.js:851-1091`, OD `talks/2026_10_21_OpenData/setup/grains.js:1221-1479`, MT `setup/grains.js:63-283`; ported to the v0.11 bus, seeded, palette colours | histogram of grains, one per entry (or per `unit`) | `src key lo bin values cols model{lo,hi,bins,bkg,sig,seed} width height unit max axis ticks word from fromSpread arc lead rise readout{count,share} weights ours grains seed` | `0` hidden · `{n,fill}` · `{sort}` (from a dk-heap) · `{resample}` · `{errors}` (√N whiskers) · `{window:[lo,hi]}` (lit band, mean tick = `api.value()`) · `{shift:k}` (all values × k) · `{cut:[col,op,v]}` (failing grains lift to dust) · `{weights:'psig'}` (whiten by P(signal)) · `{subtract:{sb}}` (sideband pairs annihilate) · `{select:i}` (selection i of a baked set) · `{tilt:deg}` (the plot plane tips back) · `{tip:'scatter'}` (hands grains to a dk-scatter) · `{focus}`; `busy` while grains move | 1 (close), 2, 3, 5 |
| `dk-heap` | new (the dk-hist shader without bins) | the unsorted pile of N grains raining onto the floor | `n at radius rain seed grains` | `0` hidden · `1` rain · `2` settled · `3` collapse to a ball (T4 close) | 1, 2, 4, 5 |
| `dk-spark` | lift MT `setup/route.js:271-330`; adds a halo ring | our grain: size 2.5, halo, core colour per slide | `steps[{at,from,glide,color}] size halo grains` | one place per step | 1-5 |
| `dk-trigger` | lift MT `setup/route.js:32-177` `stream`, generalised from 2 to 4 gates; MT's unsourced second keep of 0.06 removed | data lane: one packet per crossing (empty ones fainter); gates burst dropped packets to dust or shrink packets (Turbo); a buffer disc; our packet | `from to lane speed packets per gates[{x,keep,shrink}] buffer{at,r,grains} ours empty grains` | `0` hidden · `1` runs · `1+k` gate k on · `collapse` (kept packets fold into a dk-heap ball) | 1, 4, 5 |
| `dk-glow` | port KJ `setup/detector.js` `cascade` onto the kit detector, with `eventLatch` | crossings as fronts every 25 ns merging into one 40 MHz glow | `of after rate speed grains` | `0` off · `1` fronts · `2` glow | 1 |
| `dk-lineup` + `dk-ground` | lift KJ `setup/piles.js:16-552` (`floor` renamed `dk-ground`, recoloured) | piles of 1 TB spheres that keep their size as the camera pulls back; the series floor | `balls[{n,grain,color,at}] unit grow reach glow grains` | one pile per step | 1, 5 (ground in all) |
| `dk-vertex` | new (small) | one D⁰ in flight, a K⁻ strand and a π⁺ strand of grains, the pair folding into one grain that lands on a dk-hist axis | `at flight tracks[2] land(of) grains seed` | `1` flight · `2` decay · `3` land | 2 |
| `dk-curve` | new | a model drawn as flowing grains in a dk-hist's frame; signal and background parts; pull row | `of f(gauss+poly1, exp, decay) params[] parts pull{height} flow grains` | k → `params[k]` eased 1.4 s with `busy`; parameter sets only from committed bake output | 2 (counted background level only), 3, 4 |
| `dk-bell` | new | 300 000 grains under N(0,1) by seeded inverse-CDF sampling | `sigmas width height grains seed` | `{lit:k}` (count = `api.value()`) · `{zoom}` (redraws the tail at a finer unit) | 2 |
| `dk-landscape` | new | χ² or loss surface as a height field of grains; a ball rolls the logged minimiser path; Δ = 1 ring; 1D slice whose Δ = 1 width is the error | `src{x,y,z,min,path} dims size height zmax contours under(of hist) ball{grains} grains` | `1` gather beneath the tilted plot · `2` roll (0.6 s a leg, `busy`) · `3` ring · `4` 1D slice | 3, 4 |
| `dk-scatter` | new | one grain per event in two variables; class colours white / light blue; box cut; perceptron line per epoch; curved boundary from a score grid; rare mode; leak axis | `src cols classCol range size from(of hist) colors boxes boundary{kind,w[]} score readout rare depth grains` | `1` gather (or tip in from a dk-hist) · `2` truth colours · `3` box · `4..k` line at epoch k · `last` curved boundary · `{depth}` opens the leak axis · `{undo}` | 4 |
| `dk-pipeline` | new | file ball → CSV sheet of value grains → code drawn from the real scripts' line lengths → dk-hist; a second run lands grain for grain on the first | `stages[{kind:pile|sheet|code|hist,n,rows,cols,lines,of,at}] run{twice,third} grains` | one stage a step · `run2` · `third` (only with a computed case, see T5) | 5 |
| `Clock.vue`/`clock.js`, `Crossing.vue` + `slideNav.js`, `WorldLabel.vue` | lift MT `setup/` (Clock unit raised to the 18 px floor), KJ `setup/WorldLabel.vue` | time ladder ns → h; starts `lhc-collision` when its slide is entered directly; pins a number to a world point | Clock: `from to unit run keys` | n/a | 1, 3, 5 |
| shipped, used as is | `components/lhc-opening/` (`lhc-collision`, event.json), kit detector `plugins: [lhcb]` (`src: lhcb` 93 000; `lhcb-dense` only without the collision), `StageCount`, `StageSteps` | | | | 1, 5 |
| `bake/` (Python, committed) | new, in the pattern of `talks/2026_09_15_Startertalk/scripts/hadrons.py` (`--cached`, `--check`, deterministic, no timestamps) | `d0.py`: record 401 → `d0.f32`, row 1, histograms, window means, fit iteration log, χ² grid and path, P(signal), file-order significance, IPχ² counts, sideband-subtracted decay times, unbinned lifetime fit, the 120 selections, the momentum-scale shift. `toys.py`: Poisson re-rolls, the falling-spectrum bump, the bell. `train.py`: course perceptron (rng 11), ring set (seed 16), record 401 classifier and the leak run, score grids. `h4l.py`: record 5500 (needs uproot). `portal.py`: live API counts with a date | source block `{title,url,doi,record,file,fileBytes,checksum,licence,retrieved,note}` | n/a | all |

**Prototype pairs** (talk-quality rule: one sparse slide and one dense slide, then a contact sheet, before roll-out;
record each result in the talk's CLAUDE.md Decisions):

| mechanic | sparse slide | dense slide |
|---|---|---|
| dk-trigger gates | T1 gate 1 | T1 gate 2 with the buffer |
| dk-vertex | T2 one decay alone | T2 the landing on the heap |
| dk-heap → dk-hist sort | T2 the first 1 000 grains | T2 all 91 583 |
| dk-curve | T3 start values | T3 fit with pulls |
| dk-landscape | T3 1D slice | T3 2D bowl under the tilted plot |
| dk-hist subtraction | T3 20 decay-time bins | T3 all candidates |
| dk-hist weights | T3 zoom on 5 bins | T3 the whole peak |
| dk-scatter | T4 200 synthetic points | T4 91 531 real candidates |
| dk-pipeline | T5 two stages | T5 four stages run twice |

---

## 5. Talks

### Talk 1: `2026_00_00_Data1Trigger` (slug data1trigger)

- **Cover title:** The trigger
- **Question:** LHCb sees a bunch crossing every 25 ns. What does it keep, and how does it choose in time?
- **Takeaway:** A program decides what becomes data before anyone looks, and what it drops is gone for good. What
  survives is a row of four numbers.
- **Misconception met on screen:** "store everything and decide later". At full readout the 30 PB buffer would
  fill in 30 PB / 4 TB/s = 7 500 s ≈ 2.1 h **[computed 2026-10-29]**.
- **Scope in:**
  - bunch crossing, 25 ns, 40 MHz, about 28-30 MHz non-empty
  - collisions per crossing (about 5 at LHCb, about 60 at ATLAS/CMS)
  - readout bytes (4 TB/s), what a day of it would be, HLT1 on GPUs, the buffer, HLT2/Turbo, 1 byte in 400 kept
  - tape
  - a kept crossing becomes rows; the heap of 91 583
- **Scope out:**
  - histograms and statistics → T2
  - the D⁰ mass, lifetime, fitting → T3
  - classifiers (T4 revisits the gate)
  - open release, the total open archive, reproducibility → T5

| part | min | carries | picture | big move |
|---|---|---|---|---|
| Cover: one crossing | 1.5 | One crossing, read out like a camera. The cover shows the plain title only. | `lhc-collision` with the LHCb 2012 event (event.json, record 24506, run 133488, 237 good tracks) inside the kit detector `src: lhcb` (93 000); our white crossing point at the vertex (dk-spark). **Entrance:** a cold open, a `path` from far out into the VELO over about 9 s with `ambient` keyframes | rate down to 0.02 at the crossing (bullet time, `cameraRate: 1`) |
| Forty million a second | 2.5 | 25 ns → 40 MHz; 2 500 bunches × 11 245 turns/s = 28.1 MHz filled **[computed]**, matching LHCb's 30 MHz non-empty; about 5 collisions a crossing at LHCb and about 60 at ATLAS/CMS | dk-glow fronts every 25 ns with `<Clock unit="ns">`; then clip N 2300480 ATLAS pile-up display (≤ 12 s; run 352514, named as ATLAS in the notes). Numbers: 25 ns, 40 MHz, 30 MHz | rate keyframes 0.001 → 1 until the fronts merge into one glow |
| Bytes | 2 | 4 TB/s × 86 400 s = 345.6 PB a day **[computed]**; all 1.3 EB on CERN's tape would last 3.8 days **[computed]**; the buffer would fill in 2.1 h (misconception) | hits leave the detector (detector step 2) into dk-lineup spheres of 1 TB. Numbers: 4 TB/s, 345.6 PB, 3.8 days | piles keep their size while the camera pulls back from one second to one day |
| The gates | 4 | HLT1 on about 500 GPUs: 30 → 1 MHz (keeps 1 in 30); 30 PB buffer of about 80 h; HLT2 and Turbo shrink what is kept to 10 GB/s, 1 byte in 400 overall; a dropped crossing is gone | dk-trigger on `src: lhcb`: gate 1 bursts 29 of 30 packets to dust, the buffer disc, gate 2 shrinks packet bytes (Turbo, sizes from `lhcb-event-sizes-2024`) and drops packets; our packet stays white. Two slides: gate 1 (sparse prototype), gate 2 + buffer (dense prototype) | the gate fires and 96.7 % of the lane (1 − 1/30 **[computed]**) bursts to dust that never returns |
| Archive | 1.5 | 10 GB/s × 86 400 s = 864 TB a day kept **[computed]**, against 345.6 PB read out; the end of the chain is tape | clip N 2728761 tape-library time-lapse (≤ 12 s); then the world. Numbers: 864 TB, 15 000 slots | the clip's last frame cuts to one day's kept pile seen from far out |
| Close: one row | 2.5 | A kept crossing, reconstructed, becomes rows of four numbers; a dataset is a pile of rows | our packet lands and becomes our grain with row 1's four numbers and names (1 880.6 MeV/c² mass, 3 001 MeV/c pT, 0.413 ps decay time, 1 299 IPχ²); then dk-heap rains 91 583 grains onto the floor (`StageCount`). **Entrance:** the packet folds out of the lane | one grain becomes 91 583 raining onto the floor: T2's cover pose |

Sum 14.0.

- **Hero:** the dk-trigger lane leaving the kit LHCb detector with our white packet. It opens on the crossing and
  closes on that packet becoming one grain on the heap.
- **Datasets:**
  - `components/lhc-opening/event.json` (record 24506; the API licence field is empty, so confirm on the page)
  - kit lhcb geometry (GPL-3.0 / Apache-2.0, tiny credit on the last slide)
  - record 401 row 1 and the 91 583 count via `bake/d0.py`
- **Clips:** N 2300480 ATLAS-FOOTAGE-2024-001-001 pile-up display (45 s, trimmed to ≤ 12 s); N 2728761
  CERN-FOOTAGE-2020-042-001 tape library time-lapse (4K, ≤ 12 s).
- **Builders:**
  - shipped: kit detector (`plugins: [lhcb]`, `src: lhcb`), `lhc-collision`, StageCount
  - MT: `Crossing.vue` + `slideNav.js`, `Clock.vue`
  - kit: dk-glow, dk-trigger, dk-spark, dk-lineup + dk-ground, dk-heap
- **Facts:**
  - existing:
    - `cern-lhc-collisions`, `lhc-turns-per-second`, `lhcb-hlt1-30mhz`
    - `hllhc-pileup` (about 60 a crossing at ATLAS/CMS)
    - `lhcb-trigger-5tbs-10gbs` (only for about 5 collisions a crossing)
    - `lhcb-run3-readout-4tbs`, `lhcb-upgrade1-trigger` (×400), `lhcb-velo-pixels`
    - `lhcb-allen-gpu`, `lhcb-hlt1-500-cards-89khz`, `lhcb-run3-hlt1-1mhz-out`, `lhcb-buffer-80-hours`
    - `lhcb-realtime-analysis`, `lhcb-event-sizes-2024`, `lhcb-sprucing-rates`
    - `cern-physics-data-tape-1p3eb`, `lhc-ls3-restart-2028`
  - proposed:
    - `lhc-crossing-40mhz`
    - `lhc-filled-crossings-28mhz-worked`, `lhcb-raw-345pb-per-day-worked`, `cern-tape-3p8-days-worked`
    - `lhcb-buffer-full-readout-2h-worked`, `lhcb-kept-864tb-per-day-worked`
    - `atlas-pileup-display-2300480`, `cern-tape-library-2020` (15 000 slots, 48 drives, CDS 2728761)
    - `record401-candidates-91583` (rewording of `opendata-sun-plots-records`), `d0-row1-values-worked`
  - gaps:
    - `lhcb-record401-year` (data-taking year)
    - `lhcb-record401-run1-trigger` (source for the Run 1 trigger statement)
    - `lhcb-hlt2-output-rate`
- **Risks:**
  - All rates are in the past tense (LHC in LS3 since 29 Jun 2026). 4 TB/s pairs only with ×400 (never 1 in 500),
    one source a slide.
  - Gate 2 shrinks bytes. It never shows a typed keep share (MT's 0.06 has no source).
  - Record 24506 is not row 1's crossing, and no slide may claim it is.
  - The ATLAS clip in an LHCb talk is named as ATLAS in the notes.
  - Budget: collision about 200k + lhcb 93k + dust 124k + trigger about 24k ≈ 441k. Never `lhcb-dense` with the
    collision (≈ 547k).
  - dk-glow carries KJ's blink history. Use `eventLatch`, and test stepping back and forth.
  - d3d12 rendering on this machine is unverified.

### Talk 2: `2026_00_00_Data2Peak` (slug data2peak)

- **Cover title:** Counting
- **Question:** A histogram shows a bump. When is it a particle and not chance?
- **Takeaway:** A count N wobbles by about √N. A bump counts as a discovery only when chance would make one that
  large less than once in 3.5 million tries, after every place you looked is counted.
- **Misconceptions met on screen:**
  - a bin height is exact
  - p is the probability that the hypothesis is wrong
  - one bump is a discovery
- **Scope in:**
  - the K⁻π⁺ mass (one pair = one grain); a histogram is counting
  - √N measured on 14 real flat bins, then seeded re-rolls
  - the normal tail, σ as significance, p-value, 5 σ
  - look-elsewhere (20 looks, 64 %) and Θ⁺ at 4.6 σ
  - background counted from sidebands, and the D⁰ peak's excess growing past 5 σ
  - the Higgs in 2012
- **Scope out:**
  - any fitted curve, the width, the centre, errors from curvature → T3
  - classifiers → T4
  - provenance and reruns → T5

| part | min | carries | picture | big move |
|---|---|---|---|---|
| Cover and a mass | 3 | One K⁻ and one π⁺ make one number, the mass of the pair; a histogram counts those numbers | **Entrance:** T1's heap on the floor, plain title. Our grain lifts and unfolds into dk-vertex: a D⁰ flight, a K⁻ strand and a π⁺ strand; the pair folds into one grain that lands on the empty mass axis at 1 880.6 MeV/c². Then dk-heap → dk-hist `{sort}`, 2 MeV bins, `StageCount` to 91 583. Caption `m(K⁻π⁺) MeV`. Numbers: 1 880.6 MeV/c², 91 583 | every grain flies to its bin and the peak near 1 865 MeV appears |
| Counts wobble | 2.5 | 14 flat bins of 2 MeV (1 816-1 844 MeV) hold 1 461 on average; √1 461 = 38. Poisson re-rolls of the same level jitter by that much; 100 entries wobble by 10 %, 10 000 by 1 % | zoom on the 14 bins, then dk-hist `model` re-rolled with `setStepLater` every 1.2 s (seeded, simulated) with √N whiskers of grains. Numbers: 1 461, 38 | the column tops tremble by √N |
| How rare | 2 | The normal tail. Beyond 3 σ: 1.35 × 10⁻³ (about 405 of 300 000 grains). Beyond 5 σ: 2.87 × 10⁻⁷ (0.09 grains, so none), 1 in 3 500 000 **[computed]**. A p-value is the chance of data this extreme if there is only noise | dk-bell 300 000 grains, `{lit:1}`, `{lit:3}`, `{lit:5}`, `{zoom}`; `steady`. Numbers: 5 σ, 1 in 3 500 000 | the hush: `rate: 0`, nothing lights beyond 5 σ, the camera dives into the empty tail |
| Looking everywhere | 2 | Twenty looks at noise raise a 2 σ alarm somewhere 64 % of the time (1 − 0.95²⁰ **[computed]**). Θ⁺ reached 4.6 σ and died | one dk-hist `model`: a seeded falling spectrum of 140 entries re-rolled 20 times in place (the alarm bin lights), then 3 500 entries. Numbers: 20 looks, 64 %, 4.6 σ | the alarm bin wanders from place to place, then drowns at 3 500 entries |
| The real peak | 1.5 | Sidebands count the background under the window. The D⁰ excess over it divided by √(background) passes 5 σ early in the file and stays above it | the D⁰ heap refills in file order; window 1 850-1 880 MeV lit white, sidebands 1 820-1 840 and 1 890-1 910 light blue; `StageCount` of significance. Numbers: 5 σ, candidate number (from the bake) | the significance counter climbs past 5 and the peak stands still |
| The Higgs, and close | 3 | One event is also consistent with background. Real counts over the expected background: the open 4ℓ sample alone is about 2 σ. With all 2012 channels, CMS 5.0 σ and ATLAS 5.9 σ on 4 July 2012 | slide a: clip N 1406328 CMS H→γγ candidate (11 s). Slide b: dk-hist of the CMS 4ℓ open-data example (record 5500), 2011 then 2012 data in white over the expected background in light blue (counted level, dk-curve as a flat line of grains only); number: its own σ from the bake. Slide c: clip N 2296228 (the 2012 room, ≤ 12 s); numbers 5.0 σ, 5.9 σ. **Close entrance:** the camera returns to the D⁰ heap, full and steady, our grain haloed in its bin | the 4ℓ heap fills year by year and rises out of its √N band; then the settle on the D⁰ peak (T3's cover pose) |

Sum 14.0.

- **Hero:** the D⁰ histogram, 91 583 grains on the series floor. It opens as T1's heap sorting itself and closes full
  and still.
- **Datasets:**
  - record 401 M column via `bake/d0.py`
  - CMS record 5500 / `cms-opendata-analyses/HiggsExample20112012` histograms (GPL-3.0 code; data licence to check;
    lumi 2 330 and 11 580 pb⁻¹ per `M4Lnormdatall.cc` l.76-77)
  - CMS record 300 candidates (CC0), optional as single grains
  - seeded toys from `bake/toys.py` (labelled simulated with their seed; they replace the unscripted
    `theta-toy.json`)
- **Clips:** N 1406328 CERN-VIDEO-2011-191-001 (11 s); N 2296228 CERN-VIDEO-2022-016-001 (timecode gap).
- **Builders:**
  - kit: dk-heap, dk-vertex, dk-hist (sort, model, resample, errors, window, readout), dk-bell, dk-curve (flat
    counted level only), dk-spark
  - shipped: StageCount
- **Facts:**
  - existing:
    - `poisson-fluctuation-sqrt-n` (re-source to PDG), `particle-physics-5-sigma-discovery`, `dice-eight-sixes-worked`
    - `chance-bumps-shrink-with-data`, `theta-plus-leps-japan-19-events`, `theta-plus-2003-false-alarm`,
      `theta-plus-clas-2006-null`
    - `cern-higgs-nobel`, `cms-195099-137440354-record-300`, `cms-195099-m4l-127-gev`
  - proposed:
    - `higgs-atlas-2012-5p9-sigma` (arXiv:1207.7214), `higgs-cms-2012-5p0-sigma` (arXiv:1207.7235)
    - `poisson-pdg-statistics-review`, `five-sigma-p-value-one-sided`
    - `d0-flat-bins-sqrtn-worked`, `look-elsewhere-20-looks-worked`, `d0-peak-5sigma-file-order-worked`
    - `cms-h4l-opendata-5500` (with its own σ), `d0-kpi-mass-definition` (PDG kinematics review)
  - notes only: `atlas-750-gev-look-elsewhere`
- **Risks:**
  - The open 4ℓ sample is about 2 σ. 5.0 σ and 5.9 σ never sit under that heap; they go with the 2012 clip on the
    next slide.
  - The record 5500 bake needs uproot/awkward, which are not in the env. Fallback below.
  - **√N check:** raw spread 33.9; de-trended 31.4 (the 14 bins rise by 3.7 a bin toward the peak); estimate from
    neighbour differences 39.1 **[computed]**. All are consistent with 38 within the about 19 % uncertainty of a
    14-bin spread. On screen show only 1 461 and 38. The notes give the three estimates and never call 34 vs 38 a
    precise confirmation.
  - **File-order significance:** with z = (N_on − b)/√b, b = ¾·N_sidebands, window 1 850-1 880 and sidebands
    1 820-1 840 / 1 890-1 910, z first passes 5 at candidate 27 (14 on, 5 off) and stays above 5 from candidate 186
    **[computed]**. Show only the "stays above" number. File order is not time order, so say "in the file". The
    bake commits it, and it replaces data-as-matter's Li-Ma 309, which used a fitted window from T3.
  - **dk-vertex geometry:** record 401 has no track momenta. The decay angles are simulated (seeded) around row 1's
    M, PT and TAU; the notes say "angles simulated".
  - Budget: bell 300k + dust 124k leaves nothing else on that slide.
  - One histogram a slide, enforced.

### Talk 3: `2026_00_00_Data3Fit` (slug data3fit)

- **Cover title:** Fitting
- **Question:** The D⁰ peak is real. Where exactly is it, and how long does a D⁰ live?
- **Takeaway:** A fit moves a model until it matches the counts. The answer is the bottom of a valley, and its
  uncertainty is how wide the valley is. A precise result can still sit off the world value for reasons the
  statistics do not show.
- **Misconception met on screen:** the narrowest window mean, the one nearest PDG, is the mass.
- **Scope in:**
  - window means that disagree
  - Gaussian plus line: start values, iterations, width, pulls, χ²/ndf; stability under the window
  - the χ² valley and Δχ² = 1
  - statistical against systematic: the 0.37 MeV/c² gap and a momentum scale
  - decay time, sideband subtraction, the exponential, IPχ² and D⁰s from B decays
  - P(signal) per grain
- **Scope out:**
  - significance and 5 σ → T2
  - classification and the loss → T4
  - the 120 selections and reproducibility → T5

| part | min | carries | picture | big move |
|---|---|---|---|---|
| Cover and means disagree | 2 | Window means wander: all rows 1 864.10; windows 1 864.71, 1 864.79, 1 864.81 MeV/c²; PDG 1 864.84 ± 0.04 | **Entrance:** T2's settled D⁰ peak, plain title, a line of grains draws across. A lit window narrows over 1 840-1 890, 1 850-1 880, 1 855-1 875 MeV with a white mean tick (`api.value()` into `StageCount`) | the window narrows and the mean slides toward PDG for the wrong reason |
| A model | 3 | Start values by eye: FWHM 17 MeV gives width ≈ 7.2. The fit gives μ = 1 864.47 ± 0.10 MeV/c², width 7.65 ± 0.10, χ² 53.4 / 40 over 45 bins (84 680 candidates **[computed]**). Moving the window by 4 MeV moves μ by 0.03 | dk-curve gauss+poly1 morphing through `bake/d0.py`'s logged iterations, pull row settling, `steady` at the end. Numbers via `StageCount` decimals | the curve of grains finds the peak |
| The valley | 3 | The best value is the minimum of χ²; Δχ² = 1 gives ± 0.10 MeV/c² | the plot plane tilts back (`{tilt}`) to reveal dk-landscape χ²(μ, width) beneath it, from the bake's grid; the ball rolls the logged minimiser path; the Δ = 1 ring lights; the 1D slice in μ rises with its width. Two slides: 1D slice (sparse) and bowl (dense) | the plot tilts and the bowl appears under it |
| Off by 0.37 | 1.5 | PDG lies 0.37 MeV/c² above: 3.5 σ statistical (0.368 / √(0.096² + 0.04²) = 3.54 **[computed]**). Shifting all masses up by 0.02 % closes it; for K⁻π⁺ that needs a momentum scale about 0.02 % higher (mass moves by 0.92 of the momentum scale **[computed]**). A result is value ± stat ± syst | zoom on the peak, PDG tick in light blue; all 91 583 grains slide together by the bake's shift (`{shift}`) onto the PDG tick. Numbers: 0.37 MeV/c², 3.5 σ, 0.02 % | the whole heap sliding together |
| How long it lives | 3.5 | A D⁰ flies cτ = 123 µm (PDG 0.4103 ps **[computed]**). Sidebands remove the background's decay times. D⁰s from B decays fake a long life, and IPχ² < 9 removes them (53 194 of 91 583 pass **[computed]**; our grain leaves). τ comes from the committed unbinned fit | clip N 2295935 VELO installation (8K, ≤ 12 s), path cut, then the same grains re-sort onto a decay-time axis; sideband grains annihilate window grains in pairs (`{subtract}`); dk-curve decay; the `{cut}` lifts the large-IPχ² tail to dust. Numbers: 123 µm, τ (bake), 0.410 ps | pairs turn to dust, the tail lifts out, the slope steepens |
| Close: which are D⁰s | 1 | Each grain gets a signal share from the fit; row 1's is 0.144 | **Close entrance:** back to the mass peak with the fitted curve; grains whiten by P(signal) (`{weights:'psig'}`); our haloed grain stays mostly light blue. Number: 0.144 | the peak turns white and its flanks stay blue: T4's cover pose |

Sum 14.0.

- **Hero:** the D⁰ heap with dk-curve settling onto it, then whitening by signal share.
- **Datasets:** record 401 via `bake/d0.py` (drop the 49 TAU = −100 rows and say so); PDG 2026 D⁰ listing (pdglive
  S032).
- **Clips:** N 2295935 CERN-FOOTAGE-2022-031-001 VELO installation (7680×4320).
- **Builders:**
  - kit: dk-hist (window, shift, cut, weights, subtract, tilt), dk-curve (gauss+poly1, decay, pull), dk-landscape,
    dk-spark
  - KJ: WorldLabel.vue
  - shipped: StageCount
- **Facts:**
  - existing: `particle-decay-reconstructed-mass`, `lhcb-opendata-masterclass-2014`, `lhcb-masterclass-vilnius-2026`,
    `lhcb-velo-pixels`
  - proposed:
    - `pdg-d0-mass-2026`, `pdg-d0-lifetime-2026` (with cτ = 123.0 µm)
    - `course-d0-row-means`, `course-d0-fit-mass`: both recomputed from record 401 by the bake, filed as worked
      facts citing the record
    - `d0-fit-window-stability-worked`, `d0-pdg-gap-3p5-sigma-worked`, `d0-mass-shift-0p02pct-worked`
    - `d0-ipchi2-cut-count-worked`, `d0-row1-signal-share-worked`, `course-d0-tau-column-ns`
  - gaps:
    - `d0-lifetime-fit-from-record401`
    - `lhcb-momentum-scale-uncertainty` (a source that LHCb's scale is uncertain at this level)
    - `d0-mass-resolution-lhcb` (arXiv:1412.6352)
- **Risks:**
  - No τ on screen before the committed unbinned fit (low-t acceptance, 5 ps truncation, IPχ² < 9). The lane checks
    disagree: 0.475 / 0.65 ps without the cut, about 0.42 ps with it.
  - The minimiser path must be logged by the script and never drawn by hand.
  - The 0.02 % slide claims only that this shift closes the gap (computed). Whether LHCb's scale is that uncertain
    stays in the notes until sourced.
  - **3.5 σ vs 3.4 σ:** the slide shows 3.5 (unrounded 0.368 and 0.096). The notes say that the rounded
    0.37 / √(0.10² + 0.04²) gives 3.4 and the course's ± 0.05 gives 3.3. One judge prefers 3.4.
  - Budget ≈ 285k (hist 92k + curve 9k + landscape 60k + dust 124k).
  - If time runs short, drop the 1D slice first, then the pull row.

### Talk 4: `2026_00_00_Data4Learn` (slug data4learn)

- **Cover title:** Machine learning
- **Question:** Can a machine draw the line between signal and background better than a hand-made cut, and how far
  should we trust it?
- **Takeaway:** A classifier is a fit whose answer is yes or no. It learns a boundary from labelled examples by the
  same descent as a fit, and it is only as honest as its labels, its inputs and its test on unseen data.
- **Misconception met on screen:** 99.9 % accuracy is good. Notes also meet "training accuracy is the result".
- **Scope in:**
  - a cut as a boundary drawn by hand
  - a cut against a line; the perceptron update; the loss valley (T3's again, χ² ↔ cross-entropy)
  - train vs test; a bent boundary
  - the real D⁰ classifier and leakage
  - the rare-signal trap; the trigger as a classifier
- **Scope out:**
  - fitting maths → T3
  - significance → T2
  - trigger rates in detail → T1
  - reproducibility → T5
  - named deep architectures and XOR (notes only)

| part | min | carries | picture | big move |
|---|---|---|---|---|
| Cover and a cut is a line | 2 | A cut is a boundary someone chose: IPχ² < 9 keeps 53 194 of 91 531 **[computed]** | **Entrance:** T3's whitened peak tips over into a 2D cloud (dk-hist `{tip}` → dk-scatter, log IPχ² against decay time, 91 531 grains with TAU > 0); plain title. The grains go light blue; T3's cut becomes a box edge and the kept grains turn white; our grain lies far outside. Number: 53 194 | the 1D histogram tipping into a 2D cloud |
| The perceptron | 3.5 | One threshold gets 177/200 right, a tilted line 185/200. Training moves (w₁, w₂, b) along the loss gradient: (0.259, 0.255, 0) after one update, then (2.10, 2.26, −4.31) against the exact (2, 2, −4) | dk-scatter of the course's 200 points (rng 11, simulated): a vertical cut tilts into a line, then the line per epoch from `bake/train.py`'s seeded log, `rate` keyframes speeding the epochs; three `StageCount`s w₁, w₂, b | the line sweeps through the cloud and settles |
| The same valley | 2 | Training is a fit: the loss falls from 0.693 to 0.162 down a valley like T3's | dk-landscape reused as the loss over (w₁, w₂) at the fitted b; the ball rolls the logged path. Numbers: 0.693, 0.162 | T3's valley returns and the ball rolls again |
| Bending the line | 2.5 | Judge on unseen points: train 93.3 %, test 92.0 % ± 3.8 %. On a ring a line gets 65 %; a 2-4-1 network bends round it, test 0.95, AUC 0.991 | held-out grains arrive after training (200-point set), then the 600-point ring set (seed 16, simulated) with the score-grid boundary bending into a ring. Numbers: 92.0 %, 65 %, 0.95 | the straight line bending round the cloud |
| Real rows | 2.5 | On record 401, label = mass in 1 845-1 885 MeV; inputs log pT, decay time, log IPχ²; guessing the majority scores 0.532, one neuron 0.601, the network 0.629. Adding the mass gives 0.999: leakage | dk-scatter of 91 531 real candidates (log IPχ² vs decay time), labels white / light blue overlapping, the honest boundary; then `{depth}` opens the mass axis and the clouds snap apart; next beat `{undo}` removes it and the overlap returns. Numbers: 0.532, 0.629, then 0.999 | the snap apart and the undo |
| Close: rare signal, the gate | 1.5 | 100 signal in 100 000: "always background" scores 99.9 %; at 90 % recall and 1 % false positives, precision is 8.3 % **[computed]**. The trigger cut on about 500 GPUs at 30 MHz | dk-scatter rare mode: 100 white grains among 100 000 light blue; the cut lights 90 white and 999 blue; then T1's dk-trigger gate fires with a learned boundary as the gate. **Close entrance:** the kept lane `collapse`s into one ball of 91 583 grains | the lit set is mostly blue, then the lane folds into one ball: T5's cover pose |

Sum 14.0.

- **Hero:** the dk-scatter cloud with the boundary sweeping through it.
- **Datasets:**
  - course 200 points (`figures/src/perceptron.py` l.30-34, rng 11; simulated)
  - course `ml_two_class.csv` (600 rows, seed 16; simulated)
  - course L16 rare-signal arithmetic
  - record 401 (91 531 rows with TAU > 0; real; 73 224 train / 18 307 test)
  - not in v1: HiggsML record 328 (65.6 MB, over the 50 MB rule)
- **Clips:** none. No ML footage meets the bar; worlds carry the talk.
- **Builders:**
  - kit: dk-hist (`tip`), dk-scatter (box, epochs, score grid, rare, depth/undo), dk-landscape (loss), dk-trigger
    (reused gate + collapse), dk-heap (ball), dk-spark
  - shipped: StageCount
  - no neuron form
- **Facts:**
  - existing: `lhcb-hlt1-30mhz`, `lhcb-allen-gpu`, `lhcb-hlt1-500-cards-89khz`, `lhcb-opendata-qml-2020` (notes)
  - proposed:
    - `rosenblatt-perceptron-1958` (Psychological Review 65, 386)
    - `perceptron-course-worked` (simulated), `ml-two-class-course-worked` (simulated)
    - `d0-classifier-leakage-worked` (recomputed by `train.py`), `rare-signal-accuracy-trap-worked`
    - `d0-ipchi2-cut-count-worked`
  - gaps:
    - `ml-in-lhcb-trigger` (arXiv:2111.09177, to read before the gate slide claims a learned boundary)
    - `higgsml-2014-dataset` (notes only)
- **Risks:**
  - Every strong number is simulated. The notes label each one with its seed.
  - The real classifier is weak by design (the mass-window label also holds background) and must read as overlap.
  - The 0.999 must never read as success: the undo beat follows on the next click.
  - The 2D picture shows two of the three inputs the 0.629 used. The notes say so.
  - The loss bowl is a 3-parameter loss drawn in 2D, so b is fixed at its fitted value.
  - The gate slide's "learned boundary" needs `ml-in-lhcb-trigger` sourced. Until then the gate is drawn as a cut
    with no ML claim.
  - Budget ≈ 240k for the real scatter; the rare mode is 100k + dust. Never the landscape with the 91k scatter.

### Talk 5: `2026_00_00_Data5Open` (slug data5open)

- **Cover title:** Open data
- **Question:** CERN publishes its data. Can you redo the series' plot from the open file and get the same digits?
- **Takeaway:** A result can be redone when the data, the code and the package versions are published and pinned.
  Then anyone gets the same grain in the same bin, and a choice made after looking shows up as a spread.
- **Misconception met on screen:** "it works on my laptop". Two of the three things a result depends on are in the
  folder.
- **Scope in:**
  - the plot is code applied to a file
  - record 401: DOI, CC0, bytes, hash
  - the size of open data and the release policy
  - the pipeline run twice
  - versions and pinned environments on the grid
  - 120 selections and deciding before looking
  - the route back to the crossing
- **Scope out:**
  - the trigger → T1
  - statistics → T2
  - fit mechanics → T3
  - ML → T4
  - tape totals (T1 used 1.3 EB)

| part | min | carries | picture | big move |
|---|---|---|---|---|
| Cover and delete the plot | 1.5 | Everything the series showed is a pile of grains made by code from one file | **Entrance:** T4's ball of 91 583 grains turning, plain title; the series' plot (D⁰ hist + T3 curve) unfolds from it | the plot dissolves to dust, `ambient` to 0, the ball remains |
| The record | 3 | Record 401: 1 289 541 B, CC0, DOI, sha256 8694a2ed. LHCb opened about 800 TB of Run 1 (2023) and over 4 PB through its ntupling service (2026); 50 % after 5 years, 100 % after 10. The portal held 82 414 records on 2026-10-29 | the ball as one grain among dk-lineup piles of 1 TB; clip N 3020288 data centre 2022 (≤ 12 s). Numbers per slide (≤ 3): 1 289 541 B, 8694a2ed / 800 TB, 4 PB / 50 %, 100 % | piles keep their size while the camera pulls back from one file |
| The pipeline | 3.5 | The same file, script and seed give the same sha256 and the same μ = 1 864.47 ± 0.10 MeV/c²; someone else's notebook rebuilds a Higgs plot the same way | dk-pipeline: ball → CSV sheet (91 583 rows) → code (the real line lengths of `root_to_csv.py` and the fit) → dk-hist; `run2` in light blue lands on run 1; clip N 2745513 ATLAS Open Data notebook (≤ 15 s, timecode gap) | run 2 lands grain for grain on run 1 |
| Versions | 1.5 | A result depends on the package versions as well. Pinned software (CVMFS) runs the same at more than 170 grid sites | clip N 2640380 WLCG live activity (≤ 12 s), then the pipeline with its env stage swapped. A drifting third run only if `bake/d0.py` finds a real D⁰ version case; otherwise the third run lands on the first two under the pinned env. Numbers: 170 sites, plus the drift values if computed | the third run drifts, or lands, depending on the env grain |
| Choices before looking | 2.5 | 120 reasonable selections (6 × 5 × 4) move the fitted peak from 1 864.22 to 1 864.65 MeV/c², against ± 0.10 statistical. Fix the selection before looking (blind analysis) | one D⁰ dk-hist refilled through the 120 baked selections in place (`{select:i}`), each fitted peak leaving one tick grain on a line below, so the spread grows as a row of ticks; then one selection frozen, `steady`. Numbers: 120, 1 864.22, 1 864.65 | 120 refills, then one held |
| Close: the route back | 2 | From 91 583 rows back to one crossing | `recorded: plate`. One crane back through the series: pipeline → heap → buffer → gates → detector → T1's crossing, our grain travelling back as the white packet. **Close entrance:** the crane leaves the frozen peak. Numbers: 91 583, 1 | the whole route in one frame, ending on T1's cover pose |

Sum 14.0.

- **Hero:** dk-pipeline rebuilding the D⁰ histogram, the second run landing on the first.
- **Datasets:**
  - record 401: ROOT sha256 8694a2ed…3b039b; CSV sha256 25c3c972…c1505136
  - portal API counts (`bake/portal.py`, dated)
  - the series' own scripts as code-stage data
  - the 120 selections recomputed by `bake/d0.py`
- **Clips:**
  - N 3020288 CERN-FOOTAGE-2022-014-001 data centre 2022
  - N 2745513 ATLAS-VIDEO-2020-003-003 notebook (timecode gap)
  - N 2640380 OPEN-VIDEO-2018-041-001 WLCG live activity (4K)
- **Builders:**
  - kit: dk-pipeline, dk-hist (`select`), dk-curve, dk-lineup, dk-heap, dk-trigger, dk-spark
  - shipped: kit detector, `lhc-collision` (finale plate), StageCount
  - no collab-globe (dropped as decoration)
- **Facts:**
  - existing:
    - `opendata-portal-5pb` (stale, notes), `lhcb-run1-full-release-2023`, `lhcb-open-data-first-release-2022`
    - `lhcb-ntupling-service-4pb`, `lhcb-open-data-policy`, `lhc-open-data-policy-cern`
    - `cern-wlcg` (count changes), `fair-wilkinson-2016`, `lhcb-data-700-papers`, `lhcb-opendata-masterclass-2014`
    - `lhcb-55pb-open-refuted` (never say 55 PB)
  - proposed:
    - `record401-bytes-sha256`, `record401-licence-cc0`, `opendata-portal-records-2026`
    - `d0-120-selections-worked` (recomputed), `course-pandas-version-drift` (notes only, the pendulum example)
    - `atlas-opendata-notebook-2745513`, `cvmfs-grid-pinning`
    - `reana-platform`, `hepdata-repository` (notes)
  - gap: `d0-version-drift-worked`
- **Risks:**
  - dk-pipeline is the most diagram-like form. Draw code only from real line lengths and prototype it first.
  - The pandas 9.2 / 9.02 drift is the course's pendulum, not the D⁰. It never goes under a D⁰ picture.
  - Portal counts change: stamp the date.
  - Do not repeat OpenData's opening or its advance-on-end. Check `talks/2026_10_21_OpenData/deck.md` l.45-208
    before building "Delete the plot".
  - The finale is a recorded plate.
  - Budget ≈ 428k for the pipeline slide (pipeline 120k + two hists 184k + dust).

---

## 6. Decisions taken without the owner (each with its alternative)

1. **Frame and thread.** Data-as-matter's visual grammar (one grain = one candidate, one floor, one grain size,
   light blue crowd / white selected) with record 401 and row 1 as our grain. *Alt:* Keynote's story-first frame,
   or row 2 (1 860.7 MeV/c², IPχ² 0.34, a likely prompt D⁰) as our grain.
2. **Our grain's marker** is size 2.5 + halo, with its core colour following the slide's grammar. *Alt:* white
   everywhere, which contradicts the grammar in T3/T4.
3. **σ means significance only.** The Gaussian spread is "width", and row 1's offset is 16.2 MeV/c² or 2.1 widths.
   *Alt:* "2.1 σ" as the course writes it.
4. **Cover titles:** The trigger, Counting, Fitting, Machine learning, Open data. No series line on covers.
   *Alt:* Keynote's longer titles, or the series name on every cover.
5. **Cover loop** (each close is the next cover) and the T5 crane back to T1 as `recorded: plate`. *Alt:*
   self-contained talks.
6. **dk-vertex is in T2 part 1,** so the K⁻π⁺ mass is introduced as a picture before the M column is histogrammed.
   *Alt:* T3 part 2 (Keynote), or T1's close.
7. **No fitted curve before T3.** T2 counts background from sidebands, and T2's file-order significance uses a fixed
   window 1 850-1 880 and z = (N_on − b)/√b. *Alt:* Li-Ma with a μ ± 2-width window (candidate 309), which needs T3's
   fit.
8. **T4 uses no HiggsML.** The perceptron runs on the course's 200 points, the bent boundary on the 600-point ring
   set, and the real data is record 401 with the leak and undo. *Alt:* one 65.6 MB download of record 328 for a clean
   dense separation (needs the owner's approval).
9. **PDG 2026 ± 0.04 everywhere; the gap is shown as 3.5 σ** from unrounded values, with the rounding note.
   *Alt:* 3.4 σ from rounded values (one judge's reading).
10. **Momentum-scale beat** shows the computed shift that closes the gap ("about 0.02 %"). LHCb's own scale
    uncertainty stays in the notes until sourced. *Alt:* cut the beat.
11. **T1 gate 2 shrinks bytes (Turbo)** and shows no typed keep share. Rates are in the past tense, and 4 TB/s pairs
    with ×400. *Alt:* 5 TB/s with 1 in 500 (`lhcb-trigger-5tbs-10gbs`).
12. **Sound off in decks and takes,** with one series music bed and one measured peak a talk in the edit. *Alt:*
    Teacher's hum on world slides plus a `StageSoundtrack` per deck.
13. **Shared kit in `components/data-kit/`, built on `talk/data1trigger`,** merged by the others. *Alt:* Teacher's
    data2peak branch (owner of dk-hist), or copies in each `setup/`.
14. **Bakes read the course CSV with `--cached`** and check its sha256 (25c3c972…). The ROOT reads of records 401 and
    5500 wait for uproot. *Alt:* add uproot + awkward to the outreach_talks env now.
15. **Course numbers** (1 864.47 ± 0.10, 53.4/40, the window means, 120 selections, 0.629) are recomputed by the
    bakes and filed as worked facts citing record 401. *Alt:* cite the course repo, which is not a public source.
16. **One histogram a slide.** The 120 selections refill one histogram in place, with a row of peak ticks. *Alt:*
    data-as-matter's 120 histograms flickering on one floor (judged "too busy").
17. **No TK collab-globe and no owner screen capture in T5.** dk-lineup piles and CERN clips carry it. *Alt:*
    Keynote's globe strands and a recorded capture of the record page.
18. **Covers live inside part 1** and are not separate 1-minute parts. Each talk is planned at 14.0 min including
    clip seconds, and each clip is 15 s or shorter.
19. **T5 version drift** is drawn on the D⁰ only with a computed D⁰ case. Otherwise the pinned third run lands on the
    first two. *Alt:* show the course's pendulum 9.2 / 9.02, named.
20. **Record 5500 fallback:** if the uproot question stays open, T2's Higgs part runs on the two clips plus record
    300's 13 candidates as single grains on a 4ℓ axis. *Alt:* the CMS record 545 dimuon spectrum (not a Higgs).
21. **`onscreen: numbers` + `sources: notes`** in every headmatter, because the `2026_00` date sorts before the lint
    cut-off. *Alt:* rename the directories with a real date.

## 7. Open questions for the owner

1. Approve one 65.6 MB download of HiggsML record 328 for a clean dense separation in T4, or keep the honest record
   401 classifier only (current default)?
2. May uproot + awkward be added to the outreach_talks env (or a separate bake env) for records 401 and 5500?
3. Row 1 (probably not a D⁰, cut by IPχ² < 9) or row 2 (1 860.7 MeV/c², IPχ² 0.34) as our grain?
4. 3.5 σ (unrounded) or 3.4 σ (rounded inputs, matching the on-screen ± 0.10) on T3's gap slide?
5. A source for LHCb's momentum-scale uncertainty, so the 0.02 % beat can say it is plausible on screen.
6. Which year was record 401 taken in, and can the Run 1 trigger statement be sourced?
7. When does `components/data-kit/` merge to main (pushing to main is the owner's call)?
8. Clip timecodes: the 4 July 2012 moment in CDS 2296228 / 1459513; the histogram-filling stretch in CDS 2745513;
   label-free stretches of every chosen clip (contact sheets under the render lock).
9. T4's real labels: the course's mass window (weak, 0.629) or sWeights (stronger, to build)?
10. The owner's verdict on each sparse/dense prototype pair before roll-out (§4).
11. The record 24506 licence (API field empty) and the record 5500 data licence beyond its GPL-3.0 code.
12. Recording: one `--hold` per talk, or several runs per part (`--hold`/`--max` are deck-wide)?
