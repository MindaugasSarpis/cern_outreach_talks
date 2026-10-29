# Data2Peak: outline (talk 2 of "Data analysis, the CERN way")

Outline step of the house pipeline (talk-quality §2, step 3), written 2026-10-29 from
the series bible §5 Talk 2 and its corrections, the kit README as it stands, the
prototype verdicts, the research lanes' notes and the delivered OpenData and Innoday
decks. Revised the same day from the outline critique (revise:data2peak): every high
and medium finding fixed, the low ones taken where sound. Nothing here is built:
`deck.md` and `space.json` are untouched.

- **Cover title:** Counting
- **Question:** a histogram shows a bump. When is it a particle and not chance?
- **Takeaway:** a count N wobbles by about √N. A bump counts as a discovery only when
  chance would make one that large less than once in 3.5 million tries, after every
  place you looked is counted.
- **Hero:** the D⁰ histogram of record 401, 91 583 grains on the series floor. It opens
  as T1's settled heap and closes full and still.
- **Look:** palette `classic`, `ambient: 0`, `dim` 0.2-0.35, `steady: true` on every
  slide with a number and on the cover and close (they match T1's and T3's poses),
  `transition: dust` between world slides, sound off in the deck, the series music bed
  in the edit with its peak at the 5 σ hush (slide 9).
- **Headmatter:** `onscreen: numbers`, `sources: notes`, `duration: 15min`, `lang: en`,
  `stage: { palette: classic, motion: floor, lang: en, sound: {hum: false, flight:
  false, clip: false}, options: { aberration: 0 } }`, the dk types in `stage:check
  --types`.
- **On screen:** the cover's plain title, then numbers with units, the one- or two-word
  `.name`s below, the vertex's two strand names (K⁻, π⁺) and one axis caption a plot.
  Slides 2 and 18 carry no number (the picture alone).
- **Timing:** 13.60 min of slides + 23 s of clips = 13.98 min (plan 14.0, limit 15.75).
  Slide 17's 12 s is the planned cut, not yet measured (Open 6).

## Stations (proposed, for space.json)

| station | at | forms | note |
|---|---|---|---|
| `floor` | [0, 0, 0] | `h` dk-hist (record 401 M, 1 810-1 920, 2 MeV, caption `m(K⁻π⁺) MeV/c²`), `heap` dk-heap n 91 583 at [-8.5, 0, -6] (behind the low-mass end, lab 2's choice), `v` dk-vertex (`heap: 'heap'`, `land.of: 'h'`), `s` dk-spark (`steps: [null, { on: 'heap' }, { on: ['v', 'h'] }]`), `hf` dk-hist (the file-order refill, same pos and frame as `h`), `b5` dk-curve (`of: 'h'`, `f: 'flat'`, `range: [1850, 1880]`, 3 000 grains, the 5 σ level), dk-ground | x(m) = −13.75 + 0.25 (m − 1 810): the peak near 1 865 sits at x ≈ 0, row 1 (1 880.6) at x ≈ 3.9; tallest column 3 746 |
| `decay` | [-41.5, 3, -80] | `v1` dk-vertex alone, `s1` dk-spark | the sparse vertex slide |
| `roll` | [-80, 0, 60] | `roll` dk-hist `model`, 14 bins 1 816-1 844 at the mass scale (width 7, as `h`'s 0.25 units/MeV), height 11, `max: 3746` (so 1 461 stands at 4.3 units, as on slide 6), `model.rolls` = `toys.json` `flat.rolls` | same tick spacing and level as `h`; the same dk-ground |
| `bell` | [0, 0, 120] | `z` dk-bell 300 000, caption `σ` | the slide's whole budget: every other heavy form at 0 |
| `look` | [80, 0, 60] | `look` dk-hist `model` (falling toy, 30 bins 1.45-1.75 GeV, width 15, height 8), `e` dk-curve (`of: 'look'`, `f: 'exp'`, `src: 'toys.json'`, the toy's expectation at 140 entries, slope −3.2 over the range, light blue, 3 000 grains), `grow` dk-hist rows (roll 2's 140 entries, then 3 360 more), `eg` dk-curve (`of: 'grow'`, the same expectation, sets for 140 and 3 500 entries), caption `m GeV` | simulated, seed 1540 |
| `h4l` | [0, 0, -120] | `d4` dk-hist (record 5500, 37 bins of 3 GeV on 70-181 GeV, width 18.5, height 7, `tone: 'sel'`, caption `m(4ℓ) GeV`), `b4` dk-curve `f: 'flat'` over 121-130 GeV | |

Grain budget (tier 0, counts from `grain-budget` and the README's table): on the floor
slides `h` 91 583 + `heap` 91 583 + `hf` 69 193 + dk-ground 14 000 + `s` 221 + `v` 475 +
`b5` 3 000 + dust 123 904 = 393 959 at most (slide 14 sets `h` to 0, so its real
total is lower); the bell slides set `heap`, `h`, `hf`, `roll`, `look`, `grow` and `d4`
to 0 (bell 300 000 + dk-ground 14 000 + dust 123 904 = 437 904). Both stay under the
engine's 503 000 cap; rerun `grain-budget` once `space.json` exists.

Prototype mechanics (bible §4 table) this talk relies on: **dk-vertex** (sparse:
slide 2, dense: slide 3) and **dk-heap → dk-hist sort** (sparse: slide 4, dense:
slide 5). Both pairs read on the integrated kit (`notes/prototypes.md`); roll-out
waits for the owner's verdict (bible §7 q10). The close no longer replays the sort.

**Blocking kit items, before the deck is drafted:** dk-hist `order: 'file'` for a rows
source (slides 12, 14, 16); `model.rolls` reaching `falling.rolls[r].counts` and
`alarm: 'baked'` (slide 11); `replay: false` as a step key (slide 18, and T3's cover).
Fallbacks are under each slide and in Open.

---

## Part 1. Cover and a mass (1.7 min)

### 1. Cover (0.5 min)

- **Pose:** `floor`, at [-8.5, 1.8, -6] (the heap + [0, 1.8, 0]), dist 16, yaw −12,
  pitch 12, dim 0.2, ambient 0, steady, sway 1: T1's close pose exactly. `layout:
  cover`. Steps `{ heap: 2, h: 0, s: 1 }`: dk-heap at its settled step (2, at once, no
  rain), `s` on `heap`.
  **Entrance:** T1's last frame, the heap already settled. The only motion is our
  grain's dk-spark ring gathering on the summit while the title rises with it.
- **Picture:** the heap of 91 583 grains on the floor, our grain ringed on top.
- **On screen:** the title "Counting". No numbers.
- **Notes.** Message: last time a collision became a row of four numbers, and the rows
  became this pile; today we count them. Picture: the pile is record 401's 91 583 D⁰
  candidates, one grain each (the sentence "each grain is one candidate"); the ringed
  grain on top is row 1, the one T1 followed (the sentence "this one is ours").
  Caveats: say "candidates", never "events" (the record lists 53 948 events; the file
  holds 91 583 candidates, more than one per event); record 401 states no data-taking
  year (the masterclass guide says 2011); its rows passed the Run 1 trigger, not the
  Run 3 one T1 showed (source still missing). Sources: CERN Open Data record 401,
  DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR (CC0).
- **Facts:** `record401-candidates-91583`, `lhcb-record401-year`, `record401-licence-cc0`;
  missing `lhcb-record401-run1-trigger`.

### 2. One decay alone (0.6 min) [prototype: dk-vertex, sparse]

- **Pose:** `decay`, at [-41.5, 3, -80], dist 10, yaw −4, pitch 4, dim 0.25, ambient 0,
  steady, sway 0.5. A crane from the cover (`path`, three keys: up off the floor,
  across, in). `rate: [[0, 1], [1.6, 0.3], [3.4, 1]]` (slow through the decay; the part's
  lead-in, kept quiet: no extra flourish). Steps `{ heap: 0, h: 0, v1: 2, s1: 1 }`,
  `s1` on `v1`.
- **Picture:** dk-vertex `v1` steps 1-2: a D⁰ flies in from the left (`at [-5.5, 2.2, 0]`,
  `dir [1, 0.3, 0]`) and decays at the ring into a stiff K⁻ strand and a π⁺ strand
  that bends more (in this simulated decay the π⁺ carries 0.80 GeV/c, the K⁻ 2.68).
  The two strand names are the vertex's own labels. The drawn flight is a picture
  length, with no number beside it.
- **On screen:** nothing (the picture and the two strand names).
- **Notes.** Message: a D⁰ lives only a moment and leaves two tracks, a K⁻ and a π⁺.
  Picture: the dotted line is the D⁰'s flight ("it flies a fraction of a millimetre
  before it decays; how far is the subject of the next talk"); the ring is where it
  decays; the two strands are the K⁻ and the π⁺ ("a charged track curves in LHCb's
  magnet; the less momentum, the tighter the curve"). Caveats: record 401 holds no
  track momenta, so the decay angles are simulated (seed 401) around row 1's real mass,
  pT and decay time; say "angles simulated". No flight length, βγ or cτ in this talk
  (T3 slide 9 owns them). Sources: record 401 row 1; the kit's dk-vertex (`api.values()`
  for seed 401).
- **Facts:** `d0-row1-values-worked`; missing `lhcb-magnet-momentum-from-curvature` (a
  charged track's momentum from its bend in LHCb's dipole field, and E = √(p² + m²) for
  an assumed K or π mass; or extend `d0-kpi-mass-definition`).

### 3. The landing (0.6 min) [prototype: dk-vertex, dense]

- **Pose:** `floor`, at [-3, 2.5, -2], dist 20, yaw −6, pitch 8, dim 0.25, ambient 0,
  steady, sway 0.5. Crane back from `decay`. Steps `{ heap: 2, h: 1, v: 3, s: 2, v1: 0 }`,
  `h` step 1 = `{ n: 0 }` (the empty axis), `s` step 2 on `['v', 'h']`.
- **Picture:** dk-vertex `v` step 3: our grain lifts off the summit, flies, decays, the
  two strands fold back into one white grain, and it arcs onto the empty mass axis at
  1 880.6 (about 6 s; the landed grain swells to 2.2× and shrinks back). Default `rate`,
  no added move.
- **On screen:** `1 880.6 MeV/c²` (`<StageCount for="v" :to="1880.6" :decimals="1">`,
  landing with the grain).
- **Notes.** Message: the bend gives each track's momentum; calling one a kaon and one a
  pion gives their energies; together they give the mass of the pair, and that number
  is where the grain lands. Picture: the strands folding into one grain ("two tracks
  make one number"); the grain on the axis at its tick ("1 880.6 MeV/c², the mass of
  this pair"); the pile behind ("every other grain has its own number"). Caveats:
  M² = (E_K + E_π)² − |p_K + p_π|² (c = 1), the PDG's invariant mass, with
  E = √(p² + m²) for the assumed K and π masses (the mass hypothesis); angles
  simulated, as on slide 2. Sources: PDG Kinematics review (RPP 2024, Eq. 49.2);
  record 401 row 1.
- **Facts:** `d0-row1-values-worked`, `d0-kpi-mass-definition`; missing
  `lhcb-magnet-momentum-from-curvature` (as slide 2).

## Part 2. Counting (1.3 min)

### 4. The first 1 000 (0.5 min) [prototype: dk-heap → dk-hist sort, sparse]

- **Pose:** `floor`, at [2, 2.2, 0], dist 16, yaw −6, pitch 8, dim 0.25, ambient 0,
  steady, sway 1 (closer than lab 2's 22, core's open item: the sparse peak barely
  shows from further out). Steps `{ heap: 2, h: 2, v: 3, s: 2 }`, `h` step 2 =
  `{ n: 1000, sort: 'heap', oursFrom: 'v' }`.
- **Picture:** grains leap from the top of the pile into 2 MeV bins; 1 000 stand as a
  dot plot; our grain is already in its bin.
- **On screen:** `1 000` (.unit "candidates"; `<StageCount for="h" :to="1000">`).
- **Notes.** Message: a histogram is counting: each candidate drops into the 2 MeV bin of
  its mass. Picture: each leaping grain is one candidate ("one grain, one count");
  the columns are the bins ("a column is how many fell in this range"). Caveats: the
  fill order is the series' seeded heap order (seed 401), not the file order; the
  peak is not yet visible at 1 000, and that is the point of slide 5. Sources:
  record 401.
- **Facts:** `record401-candidates-91583`.
- **Unseen mechanic:** `oursFrom` motion (end state seen only).

### 5. All 91 583 (0.8 min) [prototype: dk-heap → dk-hist sort, dense]

- **Pose:** `floor`, at [-1, 3.2, 0], dist 25, yaw −4, pitch 5, dim 0.25, ambient 0,
  steady, sway 1 (lab 2's dense pose). Steps `{ heap: 2, h: 3, s: 2 }`, `h` step 3 =
  `{ n: 'all' }`, `s` on `h`.
- **Picture:** the rest of the pile leaps in over about 9 s; the first 1 000 glide down
  as the scale takes the full set; the peak near 1 865 MeV/c² stands over a flat
  shoulder; the ring finds our grain at the foot of the 1 880-1 882 column. This sort
  is the part's one big move.
- **On screen:** `91 583` (.unit "candidates"; StageCount). Caption `m(K⁻π⁺) MeV/c²`.
- **Notes.** Message: with all the candidates a peak stands where no single grain could
  show it. Picture: the peak ("near 1 865 MeV/c², the D⁰ mass"); the flat shoulders
  ("pairs that only look like a D⁰"); the ring ("ours, on the flank: nobody can tell
  whether one row is a D⁰"). Caveats: the edge bins 1 810-1 816 and 1 912-1 920 read
  as dips (record 401's stripping window is about 1 813-1 915); the series keeps
  1 810-1 920, or the deck draws `lo: 1816, hi: 1912` (owner's call). No width, centre
  or fit here (T3). Sources: record 401; PDG 2026 D⁰ mass 1 864.84 ± 0.04 MeV (notes
  only).
- **Facts:** `record401-candidates-91583`, `pdg-d0-mass-2026`, `d0-row1-values-worked`.

## Part 3. Counts wobble (2.5 min)

### 6. Fourteen flat bins (1.0 min)

- **Pose:** `floor`, at [-8.75, 4.3, 0] (the tops of the 1 816-1 844 bins: x of 1 830,
  1 461/3 746 of the 11-unit height), dist 9.5, yaw −4, pitch 4, dim 0.25, ambient 0,
  steady, sway 0.5. A short `path` down the shoulder from slide 5. Steps as slide 5.
- **Picture:** fourteen real columns of about 1 461 grains with visibly ragged tops.
- **On screen:** `1 461` (.name "mean"), `38` (.name "√N").
- **Notes.** Message: fourteen bins with no peak in them should hold the same number, and
  they differ by about √N. Picture: the ragged tops ("1 419 to 1 534, no two alike");
  nothing else is in frame. Misconception: "a bin height is exact". It is one throw:
  the same physics gives a different count each time. Caveats: three estimates of the
  bin-to-bin spread, 33.9 raw, 31.4 about a line (the bins rise by 3.7 a bin toward
  the peak) and 39.1 from neighbour differences, each uncertain by about 19.6 % for
  14 bins; all consistent with 38, never a precise confirmation. Sources: record 401;
  PDG RPP 2024, Probability (Poisson variance equals the mean).
- **Facts:** `d0-flat-bins-sqrtn-worked`, `poisson-pdg-statistics-review`.

### 7. Re-rolled (1.5 min)

- **Pose:** `roll`, at [-80, 4.3, 60], dist 9.5, yaw −4, pitch 4, dim 0.25, ambient 0,
  steady, sway 0.5: slide 6's pose relative to its 14 bins (`roll` is centred on 1 830
  at the station, at `h`'s 0.25 units/MeV, with 1 461 at 4.3 units), so the cut reads
  as "the same 14 bins again". A `path` cut on the dust. Steps `{ heap: 0, h: 0,
  roll: 1 }`, `roll` step 1 = `{ n: 20451, errors: 'band', reroll: { every: 1.2,
  rolls: 24 } }` (28.8 s, then rests).
- **Picture:** the 14 columns re-rolled 24 times from the bake's seeded Poisson draws; the
  tops tremble inside two dim lines at 1 461 ± 38. The dk-ground and the tick spacing
  are slide 6's; the flat toy has no rise of 3.7 a bin (it is the level alone).
- **On screen:** `24` (.name "re-rolls"), `2.6 %`.
- **Notes.** Message: re-draw the same 1 461 a bin and the tops jump by about √N every
  time, 2.6 % of the column. Picture: the trembling tops ("a new count each time");
  the two dim lines ("± √N, where about two throws in three land; the next slide shows
  why"). Caveats: simulated, seed 1461, 24 rolls of `toys.json` `flat.rolls`; their
  spread is 38.0 over all 24 (39.2 over the first 12, so run all 24). "Two in three" is
  1 − 2 × 0.1587 = 68 % of a normal curve inside ± 1 σ; for counts this large a
  Poisson count is close to normal. √N/N is 10 % at 100 entries and 1 % at 10 000
  (narrated, no picture). If the kit's `max` cannot hold the level at 4.3 units across
  re-rolls, say "the same level, drawn taller so the wobble shows". Misconception: as
  slide 6. Sources: `toys.json` (bake `toys.py`); PDG RPP 2024, Probability and
  Statistics.
- **Facts:** `d0-flat-rerolls-simulated-worked`, `poisson-pdg-statistics-review`,
  `normal-tail-300k-grains-worked` (the one-sided 0.1587 beyond 1 σ).
- **Unseen mechanic:** the re-roll motion (end state seen; lab 2 slide 20 settles at 27.6
  engine-s); `max` held through a `reroll`.

## Part 4. How rare (2.0 min)

### 8. The normal tail (1.0 min)

- **Pose:** `bell`, at [-2.2, 2.0, 120], dist 22, yaw −4, pitch 6, dim 0.25, ambient 0,
  steady, sway 0.5. Crane from `roll`. Steps `{ roll: 0, z: 2 }` then
  `<StageSteps>` to `z: 3`; `z` = `[0, {}, { lit: 1 }, { lit: 3 }, { lit: 5 },
  { zoom: { from: 3 } }]`.
- **Picture:** 300 000 grains under the normal curve; a white front sweeps to 1 σ (the
  tail whitens), then to 3 σ, where only a thin streak of 405 grains stays white.
- **On screen:** `300 000` (.name "grains"), `405` (.name "beyond 3 σ";
  `<StageCount for="z">`, passing 47 596 at 1 σ on the way).
- **Notes.** Message: take each re-rolled top of slide 7, subtract 1 461 and divide by
  38; piled up, those numbers make this bell; the distance in these units is called σ.
  The white share, 405 in 300 000, is the p-value of a 3 σ excess. Picture: the bell
  ("300 000 grains laid out as noise would fall, each an excess in units of √N"); the
  front at 1 σ ("47 596 beyond on one side: about one throw in six, so about one in three outside
  slide 7's two lines"); the white tail at 3 σ ("how often noise alone goes this far:
  that share is the p-value"). Caveats: σ here means significance only, the excess
  over √b; the Gaussian's spread is never called σ in the series. One-sided tail
  beyond 3 σ is 1.35 × 10⁻³, about 1 in 740 (say only this rounding, never "1 in
  800"); 3 σ is what particle physics calls "evidence". The 3 σ figure is computed
  from the Gaussian tail (RPP 2024 Table 40.1 halved); the 2026 edition dropped that
  table. The grains are stratified (seed 401) to match n(1 − Φ) to a grain: quantiles
  laid out as noise falls, not random throws. Sources: PDG RPP 2024, Statistics;
  physicsworld / LHCb outreach for the "evidence" name.
- **Facts:** `normal-tail-300k-grains-worked`, `five-sigma-p-value-one-sided`,
  `particle-physics-5-sigma-discovery`; missing `p-value-definition-pdg` (as slide 9).

### 9. Five sigma, the hush (0.5 min)

- **Pose:** as slide 8, `rate: [[0, 1], [2.5, 1], [3.5, 0]]` (the world stops once the
  front stands at 5). Steps `{ z: 4 }`. The music bed's measured peak sits on this
  silence (edit).
- **Picture:** the front sweeps on to 5 σ and nothing lights: not one of 300 000 grains
  lies beyond.
- **On screen:** `5 σ`, `0` (StageCount for `z`).
- **Notes.** Message: at 5 σ noise alone would make an excess this large about once in
  3.5 million tries, so among 300 000 grains none lies there; 5 σ is the discovery
  line. Picture: the mark at 5 over an empty axis ("5 σ, the discovery line"); the
  unlit bell ("300 000 grains laid out as noise would fall, and none this far").
  Misconception: "p is the probability that the hypothesis is wrong". A p-value is the
  chance of data at least this extreme if there is only noise; it says nothing directly
  about how likely the particle is. Caveats: one-sided, 2.87 × 10⁻⁷; 5 σ is called an
  "observation". Sources: PDG RPP 2024, Statistics (Z = 5 ↔ p = 2.87 × 10⁻⁷; the
  p-value's definition, §40.3.2); physicsworld / LHCb outreach for the "observation"
  name.
- **Facts:** `five-sigma-p-value-one-sided`, `particle-physics-5-sigma-discovery`,
  `normal-tail-300k-grains-worked`; missing `p-value-definition-pdg` (RPP 2024
  Statistics §40.3.2, which `look-elsewhere-effect-definition` already quotes in part:
  file before the draft).

### 10. The empty tail (0.5 min)

- **Pose:** `bell`, at [8.6, 1.95, 120], dist 8.5, yaw −4, pitch 4, dim 0.25, ambient 0,
  steady, sway 0.5. The camera dives into the tail (`path`, two keys over 3 s).
  Steps `{ z: 5 }`.
- **Picture:** the tail beyond 3 σ redrawn 54 times taller as separate white grains that
  die out before 5, a line of flowing grains tracing the curve on over the empty axis.
- **On screen:** `1 in 3 500 000` as one number (the bible's form); if the lint reads
  "in" as a word, `3 500 000` with `.unit` "to 1". No `× 54`.
- **Notes.** Message: 5 σ is about one chance in 3.5 million, rarer than eight sixes in a
  row with a fair die. Picture: the magnified grains ("the last few hundred, drawn 54
  times taller"); the flowing line past 5 ("where the chance goes on, too small for
  any grain"). Caveats: a magnified scale, factor 54 = 0.6 e^(3²/2); one in 3 488 556
  exactly; eight sixes is 1 in 1 679 616. Sources: PDG RPP 2024, Statistics.
- **Facts:** `normal-tail-300k-grains-worked`, `five-sigma-p-value-one-sided`,
  `dice-eight-sixes-worked`.

## Part 5. Looking everywhere (2.0 min)

### 11. Twenty rolls of noise (1.0 min)

- **Pose:** `look`, at [80, 4, 60], dist 16, yaw −4, pitch 4, dim 0.25, ambient 0,
  steady, sway 0.5. Crane from `bell`. Steps `{ z: 0, look: 1, e: 1 }`, `look` step 1 =
  `{ n: 140, reroll: { every: 1.2, rolls: 20 }, alarm: 'baked' }` (24 s); `e` step 1 =
  `{ set: 0 }` (the expectation at 140 entries).
- **Picture:** a smoothly falling spectrum of 140 entries in 30 bins, re-drawn 20 times,
  over a light-blue dk-curve of the expected count (the toy's own exponential, slope
  −3.2 over the range); in 7 rolls one bin rises far enough over the line to reach 2 σ
  and turns white, each time in a different bin.
- **On screen:** `20` (.name "rolls"), `7` (.name "alarms"), `2.5 σ` (.name "largest").
- **Notes.** Message: each roll looks in 30 places; in 7 of 20 rolls some bin reaches
  2 σ, never the same one. Picture: the line ("what noise gives on average"); the white
  bin ("an alarm: noise reached 2 σ over the line here"); its jumps ("never in the same
  place"). Misconception: "one bump is a discovery". Caveats: simulated (seed 1540),
  140 entries a roll, an alarm is a bin with one-sided Poisson z ≥ 2 against its
  expected count; 7 of 20 rolls alarm, in bins 26, 8, 18, 27, 15, 0 and 14. 20 rolls of
  30 bins are 600 looks, so the "twenty looks" sum (1 − 0.95²⁰ = 64 %, or 37 % with
  exact one-sided 2 σ tails) describes a different experiment: not narrated on this
  slide. The p-value that counts every place is the global one, and it is larger than
  the local one. Sources: PDG RPP 2024, Statistics §40.3.2.2; `toys.json`.
- **Facts:** `falling-spectrum-alarm-wanders-worked`, `look-elsewhere-effect-definition`
  (`look-elsewhere-20-looks-worked` for the caveat only).
- **Kit gaps (blocking, Open 3):** `model.rolls` reads arrays of counts, but
  `falling.rolls[r]` are objects (`counts`, `z`, `alarm`), so the key must reach
  `.counts` (kit or bake change); and `{alarm: 2}` tests (n − e)/√e ≥ 2, which lights
  12 of the 20 rolls (5 differ from the bake's Poisson z): needs `alarm: 'baked'` (each
  roll's own `alarm`/`z`). `{alarm}` has never been shot. Bake: `toys.json`
  `falling.curve`, the dk-curve sets (`f: 'exp'`, `a` and the slope per GeV, −3.2/0.3)
  for 140 and 3 500 entries, checked against `expected140` and `expected3500` at the
  bin centres (Open 4).

### 12. Grown to 3 500 (1.0 min)

- **Pose:** as slide 11. Steps `{ look: 0, e: 0, grow: 1, eg: 1 }`, then `<StageSteps>`
  to `{ grow: 2, eg: 2 }`; `grow` = rows of `falling-big.f32` (roll 2's 140 values,
  then the 3 360 added), `order: 'file'`, `[0, { n: 140, window: [1.53, 1.54] }, { n:
  3500 }]`; `eg` = `[0, { set: 0 }, { set: 1 }]` (the expectation at 140, then 3 500
  entries, gliding with the hist's rescale).
- **Picture:** roll 2 with its alarm bin at 1.53-1.54 GeV white over the light-blue
  expectation line; 3 360 more entries rain in, the scale takes the full set, the line
  rescales with it, and the white bin sinks onto the line.
- **On screen:** `3 500` (.unit "entries"), `1.1 σ` (the same bin).
- **Notes.** Message: more data drowns a chance bump; a real one grows. Picture: the
  white bin ("the 2.5 σ bump of roll 2, over the line"); its fall to 1.1 σ ("3 500
  entries later, it sits on the line: nothing"). Narrated, not on screen: in 2003 a
  bump at 1.54 GeV reached 4.6 σ and was called the Θ⁺; with more data it went away.
  And the other side: the real Higgs peaks of 2012 became much more visible with about
  ten times more data. Caveats: the toy is simulated and holds no particle; it sits at
  1.54 GeV only to echo where LEPS saw its peak, so no Θ⁺ number goes over it; the
  largest z anywhere at 3 500 is 2.04; LEPS: 36 events over a background of 17.0 in
  the peak region, 4.6 σ; CLAS (2006) found nothing and the 2008 PDG review saw
  overwhelming evidence against it. Lyons: 3-4 σ effects have often gone away with
  more data. Sources: LEPS, PRL 91 (2003) 012002; CLAS, PRL 96 (2006) 042001; PDG 2008
  review; Physics World 2010 (Lyons); CERN Courier, 3 July 2023 (Lyons, "Five sigma
  revisited").
- **Facts:** `falling-spectrum-alarm-wanders-worked`, `theta-plus-leps-japan-19-events`,
  `theta-plus-2003-false-alarm`, `theta-plus-clas-2006-null`,
  `sigma-effects-go-away-more-data`, `chance-bumps-shrink-with-data`.
- **Kit gaps:** no `falling-big.f32` yet (bake `toys.py`: roll 2's `values` then
  `bigRoll.extraValues`); dk-hist has no `order: 'file'` (blocking, Open 2); the `eg`
  sets (Open 4).

## Part 6. The real peak (1.5 min)

### 13. Window and sidebands (0.7 min)

- **Pose:** `floor`, at [-1, 3.2, 0], dist 25, yaw −4, pitch 5, dim 0.25, ambient 0,
  steady, sway 1. Crane from `look`. Steps `{ grow: 0, eg: 0, heap: 2, h: 4, s: 2 }`,
  then `<StageSteps>` to `s: 0`; `h` step 4 = `{ cut: ['M', 'in', [[1820, 1840], [1850,
  1880], [1890, 1910]]], window: [1850, 1880], selGain: 1.6 }`.
- **Picture:** the D⁰ histogram again; the grains outside three bands lift away as dust,
  our grain among them, its ring rising with it; the 1 850-1 880 window turns white;
  the two sidebands stay light blue. Once the dust has settled, the click takes the
  ring away.
- **On screen:** `41 090` (.name "window"), `21 077` (.name "background").
- **Notes.** Message: the sidebands count the background under the window, so the excess
  is the window minus that count, measured in √(background). Picture: the white
  window ("41 090 in the window"); the blue bands ("their count, scaled by 30/40, is
  the background under it, 21 077"); the gaps ("not used"); the rising ring ("our
  grain, at 1 880.6, sits in the gap and is not used; it lifts with the dust").
  Caveats: b = ¾ N_side assumes a flat background over 1 820-1 910; z = (N_on − b)/√b
  treats b as exact and gives 138 σ; with the sidebands' own √N added it is 104 σ
  (notes only; slide 14's count carries the significance). The window stays 1 850-1 880
  (the 186 / 138 σ facts are tied to it), so row 1 is out of every band, as T3's
  outline also notes. No fit, width or curve (T3). Sources: record 401; bake `d0.py`
  (`d0-significance.json`).
- **Facts:** `d0-peak-5sigma-file-order-worked`, `d0-row1-values-worked`; missing
  `d0-peak-5sigma-sideband-error-worked` (the variance b + (¾)² N_side gives 104.2 σ at
  the end and stays above 5 from candidate 227, computed 2026-10-29; needed only if
  104 σ is said).
- **Unseen mechanic:** `cut` with a list of ranges under `in` (the op exists; this form of
  it was not shot); white columns need `selGain` 1.5-1.8; a dk-spark following `h`'s
  grain of our row while it lifts as dust (if `h.api.ours()` goes null at the cut,
  `s: 0` moves onto the arrival and the sentence stays).

### 14. In file order (0.8 min)

- **Pose:** as slide 13. Steps `{ h: 0, heap: 0, s: 0, hf: 1 }`, then `<StageSteps>` to
  `hf: 2`; `hf` = rows of `d0.f32` with `where` the three bands, `split: { col: 'M',
  win: [1850, 1880], sb: [[1820, 1840], [1890, 1910]] }`, `order: 'file'`,
  `[0, { n: 186 }, { n: 'all' }]`.
- **Picture:** the same three bands refill from empty in the file's order; at 186
  candidates the fill holds: a dot plot with a white window visibly over its
  sidebands; then the rest pour in.
- **On screen:** `186` (.unit "candidates"; StageCount for `hf`), `5 σ`.
- **Notes.** Message: read in file order, the D⁰ excess passes 5 σ after 186 candidates
  and never falls back. Picture: the 186 grains ("enough to pass 5 σ"); the pour of
  the rest ("from here it only grows"). Caveats: file order is not time order: say "in
  the file"; z first touches 5 at candidate 27 (14 on, 5 off) and dips again, so show
  only "stays above"; the end value is 138 σ, 104 σ with the sideband error, which
  stays above 5 from candidate 227. Sources: record 401; `d0-significance.json`,
  `d0-z.f32`.
- **Facts:** `d0-peak-5sigma-file-order-worked`.
- **Kit gaps (blocking, Open 2):** `order: 'file'`; without it the fill runs in the seeded
  heap order and the 186 grains would not be the 186 the number names. Fallback:
  re-bake the stays-above-5 count in the series' fill order (seed 401), file it as a new
  worked fact (`d0-peak-5sigma-fill-order-worked`), and say "in this order", not "in the
  file". `split` needs `where` or it draws only the bands anyway (README: every other
  row is left out).

## Part 7. The Higgs, and close (2.6 min + 23 s of clips)

### 15. One Higgs-like event (clip, 11 s)

- **Pose:** clip slide over `h4l`, no h1, no numbers, `<VideoPlayer
  src="cern_video_2011_191_001_hgg.mp4" />` (the manifest's name; CDS 1406328, 11 s, licence
  "CERN", no credit). Never `advance-on-end`.
- **Picture:** CERN's 11 s animation of a real 2011 CMS collision with two high-energy
  photons.
- **Notes.** Message: the Higgs boson is the particle of the field that gives elementary
  particles their mass, proposed in 1964 and the LHC's great search; a single event can
  look like one and still be background. Picture: the two photon towers ("two photons,
  as a Higgs would give"). Caveats: December 2011, before the discovery; CMS's own
  caption says it is also consistent with Standard Model background. Sources:
  videos.cern.ch record 1406328 (CERN-VIDEO-2011-191-001); CERN, "The Higgs boson";
  Nobel Prize 2013 press release. Clip 11 s.
- **Facts:** `cds-1406328-cms-hgg-clip`, `higgs-idea-to-discovery-48-years`; missing
  `higgs-boson-what-cern` (CERN's one-sentence account of the Higgs field and boson).
- **Minutes:** 0 of its own + 11 s.

### 16. The four-lepton count (1.5 min)

- **Pose:** `h4l`, at [0, 3, -120], dist 14, yaw −4, pitch 5, dim 0.25, ambient 0, steady,
  sway 0.5. **Entrance:** a one-key `path` cut under the clip's last frame, then a
  crane onto the plot. Steps `{ hf: 0, b4: 1, d4: 1 }`, then `<StageSteps>` to `d4: 2`;
  `d4` = rows of `h4l-m4l.f32` (102 four-lepton masses, 2011 first), `order: 'file'`,
  `tone: 'sel'`, `[0, { n: 20 }, { n: 'all' }]`; `b4` = dk-curve `f: 'flat'` over
  121-130 GeV at 4.66/3 = 1.55 a bin, light blue.
- **Picture:** 2011's 20 candidates as white grains on a 4ℓ mass axis (a cluster near
  91 GeV), then 2012's 82 more; over 121-130 GeV a light-blue line marks the expected
  background, and the grains there stand well above it.
- **On screen:** `12` (.name "observed"), `4.7` (.name "expected").
- **Notes.** Message: four leptons give one mass the same way two tracks did, and near
  125 GeV CMS's open sample holds 12 candidates where background alone would give
  4.7. Picture: the white grains ("each one a collision with four leptons, at its
  mass"); the cluster near 91 ("a known particle, the Z, decays to four leptons near
  91 GeV: known physics, where it should be"); the blue line ("simulation of known
  processes, scaled to the amount of data each year, expects 4.7"). Caveats: record
  5500 is a strongly simplified reimplementation of parts of the CMS analysis; the
  record puts its own excess at about 2 σ (3.2 σ in this channel in the 2012 paper); no
  σ of our own on screen (the bake's 2.73 / 3.27 σ carry no background uncertainty).
  The simulated processes (ZZ, Z/γ* + X, tt̄) and their scaling as the example's
  `M4Lnormdatall.cc` does (2 330 and 11 580 pb⁻¹) stay here, not narrated. The example
  code is GPL-3.0; the CMS collision data are CC0 (never "the data are GPL"). Optional:
  record 300's candidate 195099/137440354 at 127.05 GeV as the single ringed grain.
  Sources: CERN Open Data record 5500 (DOI 10.7483/OPENDATA.CMS.JKB8.RR42); CMS,
  PLB 716 (2012) 30; PDG (Z mass).
- **Facts:** `cms-h4l-5500-window-count-worked`, `cms-h4l-opendata-5500`,
  `d0-kpi-mass-definition`, `cms-195099-m4l-127-gev` (if the single grain is drawn);
  missing `cms-h4l-5500-lumi-code` (lumi11 = 2 330, lumi12 = 11 580 pb⁻¹ in
  `Level3/M4Lnormdatall_lvl3.cc`, and the process list: file before the draft) and
  `z-boson-4l-91-gev` (PDG Z mass, about 91.19 GeV, and Z → 4ℓ seen by CMS).
- **Kit gaps:** `h4l.json` keeps counts per bin only, nested under `data`; dk-hist `src`
  reads a top-level key. Bake `h4l.py` should write the 102 masses (`h4l-m4l.f32`,
  year order) and a dk-curve parameter set for the flat level. `src` is unseen and
  `order: 'file'` missing (blocking, Open 2).

### 17. Fourth of July 2012 (clip, 12 s, 0.3 min hold)

- **Pose:** clip slide, no h1, `<VideoPlayer src="cern_video_2022_016_001_2012_room.mp4" />`
  (the manifest's name, trimmed 0:39.4-0:46.76 = 7.36 s; a ≤ 12 s cut of the 2012 announcement footage inside CDS 2296228,
  timecode still open), `.nums` fading in at `--dN` after the clip's last frame holds.
- **Picture:** the CERN auditorium on 4 July 2012.
- **On screen:** `5.0 σ` (.name "CMS"), `5.9 σ` (.name "ATLAS").
- **Notes.** Message: with every 2012 channel combined, CMS reached 5.0 σ and ATLAS
  5.9 σ, each on its own, and CERN announced a new particle. Picture: the room ("4
  July 2012"); the two numbers ("each experiment past 5 σ, separately"). Caveats:
  paper values, local significances (PLB 716 (2012) 1 and 30, 31 July 2012); ATLAS's
  global value, 5.1 σ over 110-600 GeV (look-elsewhere, slide 11), is said only once
  `higgs-atlas-2012-global-5p1-sigma` is filed; without it the sentence is cut. The
  seminar's own figures (CMS 4.9 σ) are not in the bank: do not quote them. Nobel 2013,
  Englert and Higgs. The clip is a 2022 anniversary release that contains the 2012
  footage. Sources: ATLAS, PLB 716 (2012) 1; CMS, PLB 716 (2012) 30; videos.cern.ch
  record 2296228 (CERN-VIDEO-2022-016-001). Clip 12 s (planned; measure on the contact
  sheet).
- **Facts:** `higgs-cms-2012-5p0-sigma`, `higgs-atlas-2012-5p9-sigma`, `cern-higgs-nobel`,
  `cds-2296228-higgs10-clip`; missing `higgs-atlas-2012-global-5p1-sigma` (PLB 716
  (2012) 1; in the lane note, not in the stored claim: file before the draft or cut the
  sentence).
- **Minutes:** 0.3 + 12 s.

### 18. Close: the counted peak (0.8 min)

- **Pose:** `floor`, at [-1, 3.2, 0], dist 25, yaw −4, pitch 5, dim 0.3, ambient 0,
  sway 1, steady: the pose agreed with Data3Fit's cover (T3 writes the same; Open 7).
  **Close entrance:** a one-key `path` cut under the clip's last frame, then a crane
  down onto a histogram that is already full: `h` step 5 = `{ cut: null, window: null,
  selGain: null, replay: false }` (all 91 583 again, standing at once on arrival, no
  third sort). Steps `{ d4: 0, b4: 0, hf: 0, heap: 2, h: 5, s: 2, b5: 1 }`, then
  `<StageSteps>` to `b5: 0`. Once the crane settles, `b5` draws its line of grains
  across the window once, at the level the window would need for exactly 5 σ; the click
  fades it, so the last frame is the bare peak, T3's first.
- **Picture:** the full D⁰ histogram, still, our grain ringed again in its 1 880-1 882
  bin on the flank; for a moment a line of grains across the window at 1 453.5 a bin,
  far below the peak's tops (about 2 739 a bin on average).
- **On screen:** nothing (the picture alone).
- **Notes.** Message: a count wobbles by √N, and a bump is a discovery only when chance
  would make it less than once in 3.5 million tries after every place you looked is
  counted; this peak passed that line long ago, and next time we ask exactly where it
  stands. Picture: the line ("the height that would be just 5 σ"); the peak over it
  ("counted, far past 5 σ"); the ring ("ours is back in its bin; still nobody can say
  whether our one grain is a D⁰"). Caveats: the line is (b + 5√b)/15 a bin with
  b = 21 077.25 from slide 13 (21 803 in the window, spread evenly over its 15 bins), a
  counted level, not a fit. Sources: as slides 6-14; `d0-significance.json`.
- **Facts:** `five-sigma-p-value-one-sided`, `look-elsewhere-effect-definition`,
  `d0-peak-5sigma-file-order-worked`; missing `d0-window-5sigma-line-worked` (the
  level 1 453.5 a bin, with a bake key in `d0-significance.json` for `b5`'s set).
- **Unseen mechanic:** `replay: false` as a step key (blocking, Open 3; fallback: the
  object field on a second hist `hc`, same pos and frame as `h`, with `replay: false`,
  at a cost of 91 583 grains on this slide, so `heap` goes to 0 here); `b5`'s draw-on
  and fade.

---

## Timing

| part | slides | minutes |
|---|---|---|
| 1 Cover and a mass | 1-3 | 0.5 + 0.6 + 0.6 = 1.7 |
| 2 Counting | 4-5 | 0.5 + 0.8 = 1.3 |
| 3 Counts wobble | 6-7 | 1.0 + 1.5 = 2.5 |
| 4 How rare | 8-10 | 1.0 + 0.5 + 0.5 = 2.0 |
| 5 Looking everywhere | 11-12 | 1.0 + 1.0 = 2.0 |
| 6 The real peak | 13-14 | 0.7 + 0.8 = 1.5 |
| 7 The Higgs, and close | 15-18 | 0 + 1.5 + 0.3 + 0.8 = 2.6, plus clips 11 s + 12 s |
| total | 18 | 13.6 min + 23 s = 13.98 min |

Clip slides carry their clip seconds; slide 17's 0.3 min is the hold after its clip,
and its 12 s is the planned cut (record the measured seconds here once the timecode is
picked on a contact sheet). One big move a part: the vertex flight and landing (1), the
sort (2), the re-roll (3), the bell's front (4), the wandering alarm and the growth (5),
the cut to dust (6), the four-lepton fill (7).

## Ladder check

Talk 2 uses only what T1 or this talk has introduced, each before its first use.

| idea used | introduced in | slide |
|---|---|---|
| candidate, the heap of 91 583, row 1 as our grain, a row of four numbers (M, pT, decay time, IPχ²) | T1 close | used 1, 2 |
| trigger, Run 1 vs Run 3 (notes only) | T1 | 1 |
| the D⁰ decay into K⁻ and π⁺; a track's bend in the magnet gives its momentum | T2 | 2 |
| the mass hypothesis (call one track a K, one a π), invariant mass of a pair, one pair = one grain on the axis | T2 | 3 |
| histogram as counting, 2 MeV bins | T2 | 4-5 |
| a peak over a flat shoulder | T2 | 5 |
| Poisson wobble, √N | T2 | 6-7 |
| simulated (seeded) re-draws | T2 | 7 |
| the normal curve built from the re-rolled tops, σ as an excess in units of √N, the p-value | T2 | 8 (uses 7) |
| 5 σ, the misconception about p | T2 | 9-10 (uses 8) |
| expected level drawn as a line, look-elsewhere, local and global | T2 | 11-12 |
| window and sidebands, background counted, z = (N_on − b)/√b | T2 | 13 (uses √N from 6, σ from 8) |
| file order | T2 | 14 |
| the Higgs boson (one sentence) | T2 | 15 |
| four-lepton mass (same invariant mass, four daughters), the Z as known physics | T2 | 16 (uses 3) |
| expected background from simulation, scaled to the data | T2 | 16 (uses the expected line of 11) |
| 5 σ local vs global for the Higgs | T2 | 17 (uses 11) |

Kept out (owner talk): the width, the centre, any fitted curve, χ² and errors from
curvature (T3; slide 16's flat line and slide 18's 5 σ line are counted levels, not
fits); flight distance, βγ and cτ (T3 slide 9); classifiers and IPχ² cuts (T3, T4);
provenance, checksums and reruns (T5). The words "fit" and "width" do not appear in
the narration (the caveats name "not a fit" only to rule it out).

## Entrances

- **Cover entrance:** T1's close pose exactly, the settled heap of 91 583 on the floor
  at the `floor` station (at [-8.5, 1.8, -6], the heap + [0, 1.8, 0], dist 16, yaw −12,
  pitch 12, dim 0.2, ambient 0, steady, sway 1). No rain: dk-heap stands at its settled
  step, so T1's last frame cuts to this one. Our grain's ring gathers on the summit
  and the title "Counting" rises with it; on slide 2 our grain's decay begins, and on
  slide 3 it lifts off the summit into dk-vertex.
- **Close entrance (the next talk's cover pose):** from the 2012 clip's last frame, a
  `path` cut and a crane down to the `floor` station (at [-1, 3.2, 0], dist 25,
  yaw −4, pitch 5, dim 0.3, ambient 0, sway 1, steady) onto the full D⁰ histogram,
  already standing (`replay: false`). The 5 σ line of grains draws across the peak
  once and fades. The settled bare peak, our grain ringed, is Data3Fit's cover (bible
  §1: "T2 settled D⁰ peak → T3 cover").

## Drop order (if the takes run long)

1. Slide 10 (the empty tail): fold "1 in 3 500 000" into slide 9's numbers: −0.5.
2. Slide 15 (the γγ clip): −11 s; slide 16 enters from slide 14 by a crane, and the
   Higgs sentence moves to slide 16's notes.
3. Slide 13 merges into slide 14 (keep the file-order fill; 41 090, 21 077 and our
   grain in the gap go to the notes): −0.7.
4. Slide 2 (one decay alone), once the owner has judged the vertex pair: slide 3 tells
   the decay at the floor: −0.6.
5. Slide 4 (the first 1 000), once the owner has judged the sort pair: −0.5.

(The old first item, slide 12's Θ⁺ number, is done: 4.6 σ is narrated only.)

## Open

1. The owner's verdict on the two prototype pairs (dk-vertex: slides 2-3; dk-heap →
   dk-hist sort: slides 4-5) before roll-out.
2. **Blocking.** Kit `dk-hist`: `order: 'file'` for a rows source (slides 12, 14, 16),
   before the deck is drafted. The fill is the seeded heap order today, so "186 in the
   file" would not match the picture. Fallback: re-bake the stays-above-5 count in the
   series' fill order (seed 401) as a new worked fact and say "in this order".
3. **Blocking.** Kit `dk-hist` model: `model.rolls` reaching per-roll objects
   (`falling.rolls[r].counts`) and `alarm: 'baked'` (slide 11; the Gaussian `{alarm: 2}`
   lights 12 of the 20 rolls against the fact's 7, computed 2026-10-29); `replay: false`
   as a step key (slide 18, and T3's cover; fallback under slide 18).
4. Bake `toys.py`: `falling-big.f32` (roll 2's 140 values, then `bigRoll.extraValues`)
   and `falling.curve` (dk-curve sets for the expectation at 140 and 3 500 entries).
   Bake `d0.py`: the 5 σ level set for `b5` (1 453.5 a bin over 1 850-1 880).
5. Bake `h4l.py`: `h4l-m4l.f32` (102 masses, 2011 first) and a flat-level parameter set
   for dk-curve over 121-130 GeV (or a binned expected curve over the full range).
   Needs the throwaway uproot venv again (bake.md).
6. Clips: add `cern_video_2011_191_001_hgg.mp4` (CDS 1406328, 11 s, `standard`) and
   `cern_video_2022_016_001_2012_room.mp4` (≤ 12 s of the 2012 footage in CDS 2296228; pick the
   timecode on a contact sheet under the render slot and record the clip's real
   seconds in the timing table) to `videos/manifest.toml`; then `videos:frames` and
   commit `public/video-frames/index.json`.
7. The close / T3 cover pose is agreed here as `at: [-1, 3.2, 0], dist 25, yaw −4,
   pitch 5, dim 0.3, ambient 0, sway 1, steady`; Data3Fit's outline has it without
   `steady` and must add it (that talk's session writes it). T1's close and this cover
   already agree.
8. Deviation from the bible: slide 11 narrates the picture's own count (each roll looks
   in 30 places; 7 of 20 rolls alarm, 2.5 σ largest) instead of "20 looks, 64 %",
   which is a rule of thumb for a 5 % chance a look and describes 20 looks, not 600.
   Alternative: a 20-bin toy so one roll is twenty looks (a re-bake and new facts).
9. Slides 13-14 keep 138 σ and 104 σ in the notes only; nothing on screen carries a
   significance from the bank's z except slide 14's "stays above 5". Showing 104 σ and
   227 instead would need `d0-peak-5sigma-sideband-error-worked` and a bake key.
10. Slide 10's number form: "1 in 3 500 000" as one number if the lint allows it, else
    `3 500 000` with `.unit` "to 1".
11. The mass caption: `m(K⁻π⁺) MeV/c²` (t2, matching the nums) against the bible §3
    example `m(K⁻π⁺) MeV`; the series should pick one.
12. Edge bins 1 810-1 816 and 1 912-1 920 read as dips on slides 5, 13 and 18: keep the
    series range or draw 1 816-1 912 (owner's call, integration t2-9).
13. Numbers over the 2012 footage (slide 17): legibility to check in shots; fallback,
    the two numbers on slide 18's world after the clip (which would end slide 18's
    "no number").
14. Unseen in any shot: `oursFrom` motion (4), the re-roll motion and `max` held through
    it (7), the bell's front and zoom as moves (8-10), `{alarm}` and a dk-curve over a
    model hist (11-12), `cut` with a list of ranges and a spark following a grain into
    the dust (13), `src` / rows from a new file (16), `replay: false` as a step key and
    `b5`'s draw-on and fade (18).
15. Missing facts, listed in this run's output: `lhcb-record401-run1-trigger`,
    `lhcb-magnet-momentum-from-curvature`, `p-value-definition-pdg`,
    `d0-peak-5sigma-sideband-error-worked` (only if 104 σ is said),
    `higgs-boson-what-cern`, `cms-h4l-5500-lumi-code`, `z-boson-4l-91-gev`,
    `higgs-atlas-2012-global-5p1-sigma`, `d0-window-5sigma-line-worked`. Dropped:
    `d0-row1-flight-0p2mm-worked` (slide 2 shows no number now).

## Decisions (deck draft, 29 Oct, draft:data2peak)

The deck (`deck.md`, `public/data/space.json`) follows this outline with these changes.
The owner's decisions of 29 Oct (series bible, top block) win over the text above.

1. **Slide 16 (the four-lepton count) is dropped** (the owner: no CMS/ATLAS channel
   histograms). The deck has 17 slides: the γγ clip (15) is followed directly by the 2012
   room clip (16), and the close is slide 17. The `h4l` station, `d4` and `b4` are not
   built; `h4l.json` stays in `public/dk/` as the kit's sync leaves it.
2. **Nothing names the particle.** Message and Picture lines say "a short-lived
   particle", "two tracks", "the mass of the pair"; the vertex strands carry no names
   (dk-vertex ignores them); the caption is `mass MeV/c²` (README, `named-decay`), not
   `m(K⁻π⁺) MeV/c²` (Open 11 settled). Record numbers stay in Sources lines only.
3. **Mass axis 1 816-1 912** (the kit default, no `lo`/`hi` on `h` or `hf`): x(m) =
   −12 + 0.25 (m − 1 816), so the flat bins' centre 1 830 sits at x = −8.5 (slide 6's
   pose is `[-8.5, 4.3, 0]`, not −8.75), the peak near 1 865 at x ≈ 0.25 (Open 12
   settled).
4. **Cuts between stations**: every station change (1→2, 2→3, 6→7, 7→8, 10→11, 12→13,
   clips→17) is a one-key `path` at t = 0; the outline's cranes between stations are
   gone. Moves inside a station stay (5→6 down the shoulder, 9→10 the dive, the close's
   crane from the clips' pose).
5. **Clips** are the manifest's `cern_video_2011_191_001_hgg.mp4` (11.32 s) and
   `cern_video_2022_016_001_2012_room.mp4` (7.36 s), both `muted`; their slides rest the
   world at the close's crane start (`[-1, 6, 0]`, dist 32, pitch 16).
6. **Timing**: with slide 16's 1.5 min gone the deck is 13.80 min of notes + 18.7 s of
   clips = 14.1 min: slide 3 0.8, slide 8 1.2, slide 12 1.2, slide 13 0.9, slide 14
   0.9, the γγ clip's hold 0.5, the room clip's hold 0.5, the close 0.9.
7. **Numbers** carry a unit or a `.name` inline after the unit (`.nums .name`, 22 px,
   #9fd8ff); slide 8's 405 and slide 12's 1.1 σ come in on the click (`v-click`) with the
   step they name. Slide 10 reads `1 in 3 500 000` with the name "chance" (Open 10). Slide
   14's count follows `hf` (rows read): 186 at its step, 91 583 after the click.
8. **Steps**: forms on stations the camera is away from are stepped to 0 (`h`, `heap`,
   `v`, `s` from slide 7; the toys and the bell off their slides), so no ring or far plot
   shows across the world and the budget stays at ~446k (stage:check). `v` goes to 0 from
   slide 7, so the return to the floor on slide 13 does not replay the vertex. Each toy
   station has its own named dk-ground (`g7`, `gz`, `gl`) on the series floor plane.
9. **The cover title** is `# <span class="name">Counting</span>`: `talk lint` reads the
   headmatter's `onscreen: numbers` as slide 1's own key and flags a plain cover title as
   TEXT (tests/test_lint.py asserts that case), while the house rule keeps the title. The
   span renders as the plain h1 (styles/index.css gives a lone cover h1 the title size).
   A lint fix would let the span go.
10. **Slide 1's trigger caveat** uses the bank's `lhcb-record401-year` (Run 1 data) and
    `lhcb-upgrade1-trigger` (the newer trigger) instead of the missing
    `lhcb-record401-run1-trigger`; slides 2-3 use `magnet-bends-tracks-momentum` instead of
    the missing `lhcb-magnet-momentum-from-curvature`. ATLAS's global 5.1 σ is cut
    (`higgs-atlas-2012-global-5p1-sigma` not filed); 104 σ is not said.
11. **Poses moved for legibility after the first contact sheet**: slide 10 ends at
    `[7.2, 1.6, 120]` (the tail right of the number); slide 11 at `[77.6, 1.6, 60]`,
    dist 12 (the 140-entry toy is a short dot plot, about 2.5 units of its 8);
    slide 12 at `[77, 3.6, 60]`, dist 17 (room for the grown plot's full height after
    the click); slides 13-14 at `[-5.6, 2.6, 0]`, dist 22 (the bands right of the two
    numbers and above them). The cover, slides 3-6 and the close keep the outline's
    poses; the close is talk 3's cover pose `[-1, 3.2, 0]`, dist 25, yaw −4, pitch 5,
    dim 0.3, steady.
12. **Clicks**: slides 8, 12, 13, 14 and 17 carry `clicks: 1` in their frontmatter, since
    `<StageSteps :clicks>` registers no click of its own.
13. **Fixes from the fresh-eyes review (fix:data2peak, 29 Oct).** The γγ clip (slide 15)
    burned in an event label (run and event number, decay channel) and a display logo: its
    raw is now the record's 1080p zoomed 1.25x about the collision point (the ffmpeg line is
    in videos/manifest.toml) and the cut starts at 5.7 s, as the two towers light (5.6 s).
14. **Numbers at the top left** on every content slide (styles/index.css `top: 64px`): the
    lower third stays clear for the recorded takes. Poses moved with it: 11 `[80, 1.8, 60]`
    dist 10, 12 `[78, 4.4, 60]`, 13-14 `[-1, 3.4, 0]` dist 23, 9 `[2.5, 2.0, 120]` dist 17
    (the 5 σ mark right of centre; its path starts at slide 8's pose), 10 ends at
    `[4.8, 2.0, 120]` (the magnified tail right of the number).
15. **The heap behind the axis** at `[-8.5, 0, -11]` (was −6), slides 3-4 at pitch 11, so the
    pile reads as a source and not as masses on the axis; the cover pose moved with it
    (`[-8.5, 1.8, -11]`), the same frame of the pile talk 1 closes on.
16. **Slide 6** framed close on the tops (`[-8.9, 4.1, 0]`, dist 4.7: the rise from 1 844 out
    of frame), a light-blue mean line (dk-curve `m6`, `@mean` of d0-flat.json) on arrival,
    the ±38 lines (`m6u`, `m6d`) and `38 √N` on a click (`clicks: 1`). 1.2 min.
17. **Slide 7**: the band light blue (`errors: { tone: 'crowd' }`), not near-white; one roll every
    3 s (72 s); a timed crane at 12-16 s in to the tops (dist 4). 1.3 min.
18. **Slides 11-12**: grains `alpha` 2.2, alarm white `selGain` 1.8, one roll every 2 s; the
    toy's caption `mass MeV/c²` with ticks 1 500 / 1 600 / 1 700 (the toy's own GeV values
    under MeV labels).
19. **Slides 13, 14, 17 carry the background as a light-blue line** (dk-curves `bk` of `h`,
    `bkf` of `hf`, both composed from d0-significance.json); slide 14 adds the white 5 σ
    height for 186 rows (`b5f`, 5.236 a bin, typed until baked: notes/kit-requests.md) and
    scales `hf` to its own height (`max: 10` at 186 rows, `lattice: false`); the click takes
    both lines to the whole file's levels. Slide 13's window `selGain` 1.1.
20. **Slide 16**: the held last frame dims to 40 % (`.hold-dim`, from 7.4 s) before the two
    numbers. Slide 3's Message is the one step (two tracks make one number); momentum and
    energy are an optional aside in its Caveats. Timing: 13.8 min + 13.0 s of clips = 14.0 min.
21. **Motion fixes from the recorded takes (final:data2peak, 29 Oct).** Every slide's picture stands
    within about 1-2.5 s of the cut and its numbers come after it. Cover: `ambient: [[0, 0]]` (black
    from the first frame, not a 1 s ease from the ambient world) and the title fading in from about
    1.5 s, once the pile stands. Slide 3: the vertex's `flightTime`/`landTime` 1.0 and the world at
    1.6x for 3.2 s, so the grain lands by about 3 s; `1 880.6` at 3.2 s. Slide 7: the roll station's
    centre 15 units behind its plot (the engine assembles a station at a timed path's last key: see
    notes/kit-requests.md), whole columns from frame 0, the first re-draw at about 1.2 s, the crane in
    at 8-12 s, the numbers at 1.5 and 2.5 s. Slide 11: a fast first fill, the expected line drawing at
    about 1.2 s, grains `alpha` 1.7, the white bin `selGain` 1.3 and no white landing glow. Slide 12:
    roll 2 standing within 1 s; on the click the new entries land light blue at `alpha` 0.9 (the alarm
    bin alone white, `selGain` 1.4) and `1.1 σ` fades in 5.5 s after the click, as the count reaches
    3 500 (a v-click line's delay now runs from its click). Slide 13: the band refill in 1.2 s, the
    numbers at 1.5 and 2.5 s, the background line after them. Slide 14: the 186 rows land in under
    1.5 s with both lines drawing after them; on the click the pour takes 2.4 s at `alpha` 0.38 with a
    uniform landing rate, and the lines rise onto the window from 0.8 s (`after`), once the scale has settled. Clips: the γγ clip starts at the source's own
    cut to the black event view (6.92 s, 4.4 s long, no cut inside it); the room clip is one shot
    (42.68-46.76, the room from the front stairs), dimmed to 40 % over its last second inside the
    clip, so the close's dust leaves from a dim frame (the CSS dim is gone); its numbers at 5.4 and
    6 s. Timing: 13.8 min + 8.5 s of clips = 13.9 min.
