# data-kit: the shared forms of "Data analysis, the CERN way"

The dk- forms that the five talks (Data1Trigger … Data5Open) use to draw record 401's
candidates. There is one grain per candidate, one floor, one grain size, and one colour
grammar: light blue is the crowd, white is the selected, dim is the axis, and nothing is
gold (bible §3). A deck author should need nothing beyond this page. Builder authors
should also read "Writing a dk form" at the end.

## Install it in a deck

`setup/main.ts`:

```ts
import * as stage from 'slidev-addon-stage'
import { installDataKit } from '../components/data-kit/index.js'

export default ({ app }) => {
  installDataKit({ app, stage })
}
```

`package.json`: `stage:check` only finds types registered in the talk's own `setup/`, so
add the kit's types to it (`node components/data-kit/check.mjs --types` prints the list):

```json
"stage:check": "slidev-stage-check . --types dk-hist,dk-heap,dk-trigger,dk-glow,dk-lineup,dk-ground,dk-spark,dk-vertex,dk-bell,dk-curve,dk-landscape,dk-scatter,dk-pipeline"
```

`pnpm talk check <talk>` reads that line. `stage:check` then knows the types, but not the
fields each one requires. Run the kit's own check for those, and for the data files:

```
node components/data-kit/check.mjs talks/<talk dir>      # fields, grains, data files vs data/manifest.json
```

Data: `python3 components/data-kit/bake/sync.py --to talks/<talk dir>` copies the bake
outputs the deck needs into `public/dk/`. The forms fetch them at runtime with
`ctx.asset('/dk/<file>')`, so a Pages base works. The kit itself needs nothing in the
deck's `package.json`: it imports `three` from the repo root.

Recommended headmatter. Tick numbers are world sprites, and the engine's chromatic
aberration fringes them red and blue:

```yaml
stage:
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }
  options: { aberration: 0 }
```

Data slides: `space: { …, ambient: 0, dim: 0.2-0.35, steady: true }` (`steady` wherever a
number is read off the picture).

A deck that draws the crossing (`components/lhc-opening`, T1 and T5) adds
`lhc-collision` to the `--types` list (lab 1 does) and passes it palette colours (`tone`,
`muonTone`, `splashTone`, `bunchColor`): its defaults are gold
(`components/lhc-opening/collision.js:256-257`). A deck with the kit detector
(`plugins: [lhcb]`, T1 and T4) writes `style.detectorParts(palette)` into the detector
object's `parts`, because the engine's lhcb colours are royal and navy blues off the
series' light blue. space.json is JSON, so copy the literal (classic):

```json
"parts": { "preset": "lhcb", "velo": { "alpha": 0.25 }, "pipe": { "alpha": 0 },
  "magnet": { "color": "#7dd3fc", "alpha": 0.25 }, "rich1": { "color": "#7dd3fc" },
  "rich2": { "color": "#7dd3fc" }, "hcal": { "color": "#7dd3fc" } }
```

`Clock.vue`/`clock.js`, `Crossing.vue` + `slideNav.js` and `WorldLabel.vue` (bible §4,
components row) are **not in the kit yet**: lift them with T1 (notes/integration.md says
why). Lab 1 holds a lab-only `setup/Crossing.vue`. Name a lifted component so that its
first word is no unplugin-icons prefix (`LabCrossing` resolved as the `la` icon set and
broke the build).

## The data contract

- `data/d0.f32`: little-endian float32, row-major, 91 583 rows × 4 columns in file order:
  `M` (MeV/c²), `PT` (MeV/c), `TAU` (ps, i.e. the CSV's ns × 1000; NaN where the CSV has
  −100), `IPCHI2`. Row 1 of the CSV, our grain, is index 0.
- `data/d0.json`: `{ n, cols, units, row1, ranges, source: { title, url, doi, record,
  file, fileBytes, checksum, licence, retrieved, note } }`.
- Every other bake output is listed in `data/manifest.json` with its shape, dtype,
  meaning, the script that writes it (`by`) and the talks that load it (`talks`:
  `bake/sync.py --to talks/<t>` copies exactly those; `--all` copies everything, as the
  labs do). Each bake script is deterministic and has `--check`.
- The CSV the bakes read, `D0_KPi.csv` (sha256 25c3c972…c1505136, 3 926 142 B), is
  rebuilt from the record's own file by the kit's public converter
  `bake/root_to_csv.py MasterclassData.root D0_KPi.csv`, byte for byte. It needs uproot 5,
  which the outreach_talks env does not ship: run it in a throwaway venv
  (`python3 -m venv v && v/bin/pip install uproot`; made with uproot 5.7.7, awkward 2.14.0,
  numpy 2.5.4). The bakes take the result with `--cached D0_KPi.csv`.

| file | bake | talks | read by |
|---|---|---|---|
| `d0.f32` + `d0.json` | d0.py | 1-5 | dk-hist (`values`), dk-scatter (`src`), dk-pipeline (sheet), dk-vertex (`row1`) |
| `d0-psig.f32` | d0.py | 3, 4 | dk-hist `{weights}`: P(signal) per row from the mass fit |
| `d0-select.json` | d0.py | 5 | dk-hist `{select}`: `selections[i]` = `{ pt, ip, tau, mu, … }`, keep `!isNaN(TAU) && PT > pt && IPCHI2 < (ip ?? ∞) && TAU > (tau ?? −∞)`, or `{ cuts: [[col, op, v], …] }` |
| `d0-peaks.f32` | peaks.py | 5 | a dk-hist of the 120 fitted peaks (`values: 'd0-peaks.f32', cols: ['MU'], key: 'MU'`) |
| `d0-fit.json` | d0.py | 2-5 | dk-curve (start values, logged iterations, result, pulls) and the decks' numbers |
| `d0-chi2.json` | d0.py | 3 | dk-landscape (bowl grid, path, rings, slice); `pdgOnSlice` (Δχ² at 1 864.80 / .84 / .88) |
| `d0-tau.json` | d0.py | 3 | dk-curve `f: 'decay'` (the unbinned lifetime fit) and T3's numbers; `plotSubtract` (what lab 3's `{subtract}` leaves) |
| `d0-hist.json` | d0.py | 1, 2, 3, 5 | a dk-hist `src` (binned counts) and the decks' numbers |
| `d0-flat.json`, `d0-means.json`, `d0-cuts.json`, `d0-significance.json`, `d0-z.f32` | d0.py | 2-4 | the decks' numbers (flat bins and √N, window means incl. `centredOnFit` and `narrow1865`, IPχ² counts, file-order significance); `d0-significance.json` `line5sigma.set` is a dk-curve `flat` set |
| `d0-checks.json` | d0.py | 3, 5 | the fit's χ² at its start values (`fitStart`), `d0-fit.json`'s sha256 from two passes (`rerun`) |
| `d0-score.f32`, `d0-split.f32`, `train-*.json` | train.py | 4 | dk-scatter (networks, score grids, roles, the rare set's arithmetic); dk-landscape (`lossGrid` at the final b, `lossProfile` with b profiled) |
| `toys.json` | toys.py | 2 | dk-hist `model.rolls` (`flat.rolls`: arrays of counts; `falling.rolls`: objects with `counts` and the bake's own alarm, for `alarm: 'baked'`; `falling.expected140` as `model.rolls.expected`), dk-curve (`falling.curve.sets`, the expectation at 140 and 3 500 entries), dk-bell's numbers (`tail.bell300k`) |
| `falling-big.f32` + `falling-big.json` | toys.py | 2 | a dk-hist rows source: the falling toy grown to 3 500 entries, roll 2's 140 first (`key: 'M'`, GeV, `ours: false`, `order: 'file'`) |
| `code-lines.json` | code.py | 5 | dk-pipeline code stages: per script and line the [start, end) columns of its non-blank runs, no source text (`bake/root_to_csv.py`, `bake/d0.py`) |
| `h4l.json` | h4l.py | 2 | T2's Higgs numbers (needs uproot; ran outside the env) |
| `portal.json` | portal.py | 5 | T5's portal counts, with their date |

## The series constants (`style.js`)

Every form reads these, and no talk overrides them.

| constant | value | meaning |
|---|---|---|
| `GRAIN` | 1.25 | the grain size of one candidate (GRAIN_GLSL `place()` size; about 0.093 world units across) |
| `OURS` | 2.5 | our grain (row 1, `OURS_ROW = 0`) |
| `SEED` | 401 | the seed of every order, placement and toy unless an object gives `seed` |
| `FLOOR_Y` | 0 | the floor plane every heap and histogram stands on |
| `MASS` | `{ scale: 0.25, lo: 1816, hi: 1912, bin: 2 }` | world units per MeV/c², and the series' mass range (the owner's decision of 29 Oct: 1 816-1 912 in every talk, 48 bins; the outer bins of 1 810-1 920 are half outside record 401's stripping window and read as dips) and bin: every peak plot has its peak in the same place at the same size. A dk-hist on mass without `lo`/`hi` draws this range; a deck gives no range of its own |
| `HEIGHT` | 11 | a histogram's height in world units |
| `TICK_MASS` | 20 | MeV/c² between mass ticks |
| `LABEL` | `{ px: 24, minPx: 18, captionPx: 24 }` | font size on a 1080-high frame; labels never go below 18 px |
| `roles(palette)` | crowd = accent, sel = fg, axis = dim, tick = ink, name = fill | the colour grammar over the deck's palette |
| `alphaFor(n)` | clamp(1.3·(60/n)^0.25, 0.3, 1.5) | one grain's alpha for a tallest column of n grains: a lone grain is whole, a dense column a mid light blue, never a white bar |
| `fmt(v, d)` | | digits grouped from 4 with U+202F (as `<StageCount lang="en">`) |
| `detectorParts(p)` | | the lhcb detector's `parts` in the palette (see Install) |

## The forms

Every object carries `type`, `pos` (in its station's frame), `name` (where it steps) and
`grains` (its tier-0 count, so `grain-budget` counts it). Steps come from the bus: use
`steps: { <name>: k }` in a slide's frontmatter (it holds however the slide is reached),
or `<StageSteps :set>` / `:clicks`. `<StageCount for="<name>" :to="…">` shows a form's
`api.value()`.

### dk-hist: a histogram of grains, one grain per entry

Required: `pos name grains`.

Sources (choose one):

| field | meaning |
|---|---|
| `values` (default `d0.f32`), `key` (default `M`), `cols` | raw rows, binned in the builder. `cols` names the columns if there is no `<stem>.json` beside the file. This is the only source that can cut, select, shift, weight or subtract. |
| `src`, `key` (default `counts`), `lo`, `bin` | a JSON of binned counts (`lo`/`bin` from the object or the file). One grain is one entry in a slot. |
| `model: { lo, hi, bins, bkg, sig, seed, n, expected }` | a toy. The expected count per bin is `expected` (an array) or the sum of the terms `bkg`/`sig`: `['flat', a]`, `['exp', a, slope]`, `['poly1', a, b]`, `['power', a, p]`, `['gauss', mu, width, amp]`. Each `{resample: k}` is a seeded Poisson draw per bin (seed `model.seed + 7919·k`), or, with `model.rolls: { file, key, expected }` (e.g. `{ file: 'toys.json', key: 'flat.rolls' }`), `{resample: k}` (k ≥ 1) shows the bake's roll k − 1, so the notes can cite the exact counts. A roll is an array of counts or an object with `counts` (`falling.rolls[r]`). `expected`: a path in the same file to the expected count per bin (`'falling.expected140'`), which then sets the scale, the band and `{alarm: z}` instead of `bkg`/`sig`. Simulated: say so and give the seed in the notes. |

Frame and look:

| field | default | meaning |
|---|---|---|
| `lo`, `hi`, `bin` | the series mass range, 2 MeV | the axis range and the bin width (data units) |
| `width` | (hi − lo) × `MASS.scale` | world width. Give it only for a non-mass axis (decay time …). |
| `height`, `depth` | 11, one bin | world height; the depth the grains jitter over |
| `max` | the fill set's tallest bin | entries at full height. A cut, a selection or a subtraction keeps the scale, so the loss shows. |
| `unit` | as the tier's budget allows (1 at tiers 0-1 for 91 583) | entries per grain |
| `ticks` | every 20 MeV on mass, nice steps otherwise | numbers, or `[value, 'text']` pairs. Drawn as fixed-size labels under dim tick marks. A step can replace them (`ticks` step key, below). |
| `order` | the heap's | `'file'` (rows source only): grains fill in the file's own order (row 1 first), and `n` counts **rows of the file read**: `{n: 186}` shows the grains of rows 1-186 that `where`/`split` keep (139 in the three bands), and `api.value()` counts rows read as they land, ending at exactly 186. So "after 186 candidates in the file" is the picture's 186 (T2 slides 12, 14, 16). Default readout `'rows'`. Do not combine with `{sort}` from a heap (the heap's order is the other one) |
| `word` | none | the one axis caption, 5 words or fewer, no colon, naming no particle or experiment quantity: `mass MeV/c²`, `decay time ps` |
| `tone` | crowd | `'sel'` draws the whole set white (e.g. data over a light-blue expectation) |
| `ours` | 0 (row 1) | our row: it leaves the heap first, lands first and is drawn at size 2.5; `false` turns it off |
| `seed` | 401 | order and jitter. Give a heap and the hist that sorts it the same seed and ours. |
| `where` | none | a static row filter, `[col, op, v]` or a list of them |
| `split: { col, win, sb }` | none | rows in the window `win` (white) and in the sidebands `sb` (light blue); every other row is left out. Needed by `{subtract}`. |
| `from`, `fromSpread`, `arc` | none, 0, 4 | grains fill out of a box (e.g. a detector beside the plot) on a bowed arc instead of dropping from above (station frame) |
| `fill`, `fall`, `curve`, `lead`, `leap` | auto, 1.1, 1.4, 0.4, 1.5 | fill seconds for the step's new grains (auto: 1.6 s for a few, 5.5 s for 90 000), drop seconds, front-loading, the first grain's delay, and the leap seconds from a heap |
| `alpha`, `density` | `alphaFor` | per-grain brightness override |
| `lattice` | on | a sparse set (columns of tens) stands as a dot plot, its grains on a lattice up to 3 grain widths apart. `false` turns this off. |
| `selections`, `peaks: { y, zoom, at }` | `d0-select.json` | the file `{select}` reads. `peaks` draws the selections' fitted peaks, one grain each, on a line `y`·H under the axis. **Avoid it**: the peaks span 0.43 MeV, a tenth of a world unit, and a `zoom` row under the mass ticks reads as a 20 MeV spread (lab 5 review). Draw the peaks as their own dk-hist of `d0-peaks.f32` on a printed scale instead (lab 5 slide 9). |
| `weights` | `d0-psig.f32` | the file `{weights}` reads, or the fit's parameters `{ mu, width, ns, a, b, ref, bin }` to compute P(signal) = S/(S+B) |
| `readout` | count (`rows` with `order: 'file'`) | what `api.value()` gives: `'count'` (entries landed), `'rows'` (rows of the file read so far, `order: 'file'`), `'share'`, `{ count: X }` (the landed share × X, e.g. days), `'mean'`. With a `window` it gives the window's mean unless the readout is `'count'` or `'rows'`. |
| `meanTick` | true | `false` (object or step): a `window` draws no mean tick (a window used only to whiten a bin, T2 slide 12) |
| `spread`, `focusTime` | 1.2, 2.5 | how far `{focus}` blurs, and how fast |
| `errors` (object) | whiskers `{ alpha: 0.9, size: 0.75, cap: 3 }`; band `{ tone: 'tick', alpha: 1, size: 1, fill: 0.3 }` | the look of `{errors}`. Whiskers: dim axis grains at the axis line's weight, size × GRAIN, cap grains each end (0 for none). Band: its two edges in `tone` (`'tick'`, the tick numbers' near-white, so the band reads in front of dense light-blue columns: the owner's rollout condition; `'axis'` is the old dim look) and a fill of `fill` alpha between them. `alpha` and `size` apply to both |
| `selGain` | 1.3 | the white grains' alpha gain. A thin or sparse white set may want 1.5-1.8 to read as fg, not grey. No automatic lift: 0.7/alpha was tried and bloomed dense, narrow white columns into a halo (lab 2 tau station) |
| `glowTint` | 0.3 | how far a landing grain's glow goes toward white (1 = white, the morph default). Low, so a long fill's landing front stays in the plot's tone |
| `fitRange` | none | `[a, b]`: grains outside it keep the crowd colour even when counted or windowed (bins below a lifetime fit's start read as "not fitted", lab 3 slide 6). Also a step key |
| `over` | none | a dk-hist's name: this plot takes over that one grain by grain. Each grain of the other plot of the same row goes at the moment this one's lands (same values, seed and ours, so the same slot): T5's run 2 (light blue) replacing run 1 (white) bin by bin with no change of shape. A step back or a hide gives the grains back. Rows sources only |
| `oursFrom` | none | a form's name (a dk-vertex): our grain starts where that form's `api.ours()` is and glides into its slot, instead of leaping from the heap a second time. Also a step key |
| `replay` | true | `false`: an arrival or `c` shows the step's state at once (0.35 s) instead of replaying the fill. For a plot that should stand while another animates on the same slide opened cold. Also a step key (below) |
| `refill` | 2 | an arrival at a plot that has already stood once replays its fill in at most this many seconds (the audience saw it build) |
| `tipFirst`, `tipHold` | true, 1 | a `{tip}` step opened fresh stands as the histogram first, holds `tipHold` s, then lets its grains go; the dk-scatter that tips from it waits (`api.tipReady()`) |
| `subtractFirst` | true | a `{subtract}` step opened fresh (an arrival, `c`) fills window and sidebands first, holds 0.5 s, then the pairs meet; `false` drops in only what is left |
| `fade` | true | far from the camera the tick numbers fade (4 to 6 plot sizes away) and the grains too (8 to 12): another station's plot is otherwise legible numbers in mid-air or a bright point. `false` keeps both |

Steps. Step k is the steps 1..k merged in order: a step keeps every key of the steps
before it, and `key: null` drops one. Step 0 is hidden. A step forward animates; a step
back shows the state at once, in 0.35 s. An arrival from another station, or `c`,
replays the state from nothing.

| step key | what happens | busy |
|---|---|---|
| `n` (number or `'all'`) | the first n entries of the fill order drop in, about `fill` seconds for all of them. The y scale fits the shown set: the first 1 000 stand as a dot plot, and they glide down as the rest arrive. `n: 0` draws the frame and no grains (the empty axis a dk-vertex lands on). | while grains fall |
| `sort: '<heap name>'` | arriving grains leap out of that dk-heap, top of the pile first. The heap gives up each grain as it leaves and takes it back on a step back. | |
| `resample: k` | (model) a fresh seeded Poisson draw (or baked roll, with `model.rolls`): column tops tremble | 0.8 s |
| `reroll: { every, rolls }` | (model) the plot re-rolls itself on the world clock: `{resample}` 1, 2 … `rolls` (12), one every `every` s (1.2), then rests. Same as `resample: [1, rolls], every` | until the last roll |
| `select: [a, b]` or `resample: [a, b]`, with `every` | a sweep: the index steps from a to b by itself, one every `every` s (select 0.15, resample 1.2), once the step's first state stands. Only the step that names the range sweeps: a later step that inherits it, a step back or a settled arrival stands at b at once. Each motion is cut to 2 × `every` so the refills read | until it holds at b |
| `rescale: true` | the y scale is the counted set's own tallest column (each selection fills the height, so where the peak sits reads, not how many rows it kept). Pair it with a `select` sweep | |
| `alarm: z` | (model) the grains of bins ≥ z√e over their expectation turn white | |
| `alarm: 'baked'` | (model with `model.rolls`) exactly the bins the bake's own test lit in the roll shown turn white: the roll object's `alarmBins`, `alarmBin`, the bins inside `alarmAt`, or `maxBin` when `alarm` is true (`toys.json` `falling.rolls`: 7 of 20 rolls by the one-sided Poisson z ≥ 2, where `{alarm: 2}` lights 12). Follows a `reroll` sweep roll by roll; `api.values().alarms` lists the lit bins, `.roll` the roll. check.mjs errors without `model.rolls` | |
| `errors: true` | a dim √N whisker on every bin (axis colour, caps of 3 grains): around the count for data, around the expectation for a model. Inside a dense column only the half above the top shows | until they fade in |
| `errors: 'band'` | the ±√N band: its two edges as near-white grain lines across all bins and a faint fill between (expectation ± √expectation for a model, count ± √count for data); the tops tremble inside it (lab 2 slides 20 and 25). A bin whose band is thinner than half a grain draws none | until they fade in |
| `window: [lo, hi]` | entries inside turn white; a white tick glides to their mean; `api.value()` is that mean | 1.4 s |
| `shift: k` | every value × k: the grains slide to their new bins and restack (T3's momentum scale: `d0-fit.json` `scale.massFactor`) | 1.6 s |
| `cut: [col, op, v]` (or a list) | entries failing it lift away as dust and the columns settle; ops `< <= > >= == != in finite` | ~3 s |
| `weights: 'psig'` | each grain whitens by its P(signal), left to right across the plot (as a window does) | 1.3 s |
| `subtract: true` (or `{ sb, win, col, scale }`) | with `split`: sideband grains (scale = window width / sideband width) meet a window grain of their bin pair by pair and both flash out; the remaining sideband grains go too; the window grains settle | ~3.5 s |
| `select: i` | selection i of `d0-select.json`: grains outside lift out briefly and grains inside drop back. With `peaks`, the peak grains of selections 0..i stand under the axis. | ~1 s |
| `tilt: deg` | the plot plane tips back about its axis line (T3's bowl beneath). Add other forms to `api.frame().group` to tip with it. | 1.6 s |
| `focus: 0..1` | each grain spreads into a wider, fainter disc (out of focus) | until settled |
| `rise: [x, y, z]`, `riseR` | white grains lift into a ball at that point (the peak becoming its particle) | |
| `tip: 'scatter'` | the grains fade out after a dk-scatter has taken them (`api.grains()`), and the frame goes with them | 0.4 s |
| `replay: false` | the step stands at once (0.35 s) when it is reached from hidden: an arrival, `c`, or a jump from step 0, on a fresh page too. It holds for the steps that inherit it (`replay: null` drops it). T2's close and T3's cover: `{ cut: null, window: null, selGain: null, replay: false }`, the full plot standing on the crane's arrival (lab 2 slide 24) | 0.35 s |
| `ticks: [...]` | that step's world ticks instead of the object's (`null` gives the object's back, `[]` none), crossfading over 0.5 s. An entry is a value, `[value, 'text']`, or `{ v, text, tone, y, label, align }`: `tone` `'tick'` (default) / `'axis'` (dim) / `'sel'` (white) / `'crowd'` for the mark and its number; `y: [y0, y1]` the mark's span in shares of H (default the axis tick, `[-0.03, 0]`); a mark reaching into the plot (`y1` > 0.05) stands in front of the columns as a dotted line with its number above it (`label: 'above'`), else below; `align` `'left'`/`'right'` keeps two close numbers apart. T3: `{ ticks: [1820, 1840, 1880, 1900, { v: 1864.84, tone: 'axis', y: [0.86, 1.1], align: 'left' }, { v: 1864.47, tone: 'sel', y: [0.86, 1.1], align: 'right' }] }` (lab 2 slide 26) | 0.5 s |
| `max`, `fill`, `fall`, `lead`, `alpha`, `selGain`, `fitRange`, `oursFrom`, `meanTick` | per-step overrides of the object's own | |

`api`: `value()` as above (animated as grains land and leave); `values()` → `{ count,
mean, grains, unit, step, rows, roll, alarms }`; `standing()` (the shown state stands: its
fill done, or a sweep's first state; a dk-curve draws on then, not after the last roll);
`whiteOf(row)` (how white a row's grain is now, 0..1, or null; dk-spark `color: 'follow'`); `frame()` → `{ lo, hi, bin, bins, width, height, unit,
perEntry, colMax, group, x(v), y(entries) }`, the frame a dk-curve draws in (`group` is
the tilting plot group; its parent the untilted base); `pointOf(row)` / `ours()` → a
row's grain in world coordinates now (null if not drawn); `grains()` → `{ rows, pos,
white }`, every drawn grain now in world coordinates (for `{tip}`), and `grains({ last:
true })` where they stood in the last state shown that was not `{tip}`, even after they
went (a slide opened on the tip step); `cede(goneByRow | null)`, the receiving side of
another hist's `over`; `ready()`; `busy` (loading, armed, grains moving, the mean tick
gliding, tilting, focusing, whiskers fading in, a sweep running). Events: none. Every
motion is a world-clock transition (uT0 plus per-grain delay and duration) computed from
the step state, so stepping leaves no latched state and needs no `eventLatch`. The
default stepper name is deterministic (`dk-hist-<pos>-<key>`), but give every object a
`name`.

Example (lab 2, `talks/2026_00_00_DataLab2/public/data/space.json`):

```json
{ "type": "dk-hist", "name": "h", "pos": [0, 0, 0], "grains": 91583,
  "values": "d0.f32", "key": "M", "word": "mass MeV/c²",
  "steps": [0, { "n": 1000, "sort": "heap" }, { "n": "all" }, { "errors": true },
            { "errors": null, "window": [1850, 1880] }, { "window": null, "cut": ["IPCHI2", "<", 9] }] }
```

A slide: `steps: { heap: 2, h: 2 }` and `<StageCount for="h" :to="91583" />`. With a
window, `<StageCount for="h" :to="1864.79" :decimals="2" />`.

Captions name no particle, decay or experiment quantity on screen (the owner's decision of
29 Oct): `mass MeV/c²`, never `m(K⁻π⁺)`; check.mjs warns (`named-decay`).

T2's file-order count (lab 2 slide 23), its falling toy with the bake's alarms (lab 2 slide
21; its light-blue expectation is the dk-curve `e` under dk-curve), and its growth in file
order (lab 2 slide 22):

```json
{ "type": "dk-hist", "name": "hf", "pos": [0, 0, 0], "grains": 70000, "values": "d0.f32", "key": "M",
  "where": ["M", "in", [[1820, 1840], [1850, 1880], [1890, 1910]]],
  "split": { "col": "M", "win": [1850, 1880], "sb": [[1820, 1840], [1890, 1910]] },
  "order": "file", "word": "mass MeV/c²", "selGain": 1.6, "steps": [0, { "n": 186 }, { "n": "all" }] }
{ "type": "dk-hist", "name": "look", "pos": [0, 0, 0], "grains": 900, "width": 15, "height": 8, "word": "mass GeV",
  "model": { "lo": 1.45, "hi": 1.75, "bins": 30, "n": 140, "seed": 1540,
             "rolls": { "file": "toys.json", "key": "falling.rolls", "expected": "falling.expected140" } },
  "steps": [0, { "n": 140, "reroll": { "every": 1.2, "rolls": 20 }, "alarm": "baked" }] }
{ "type": "dk-hist", "name": "grow", "pos": [0, 0, 0], "grains": 3500, "width": 15, "height": 8, "values": "falling-big.f32",
  "key": "M", "lo": 1.45, "hi": 1.75, "bin": 0.01, "ours": false, "order": "file", "meanTick": false,
  "steps": [0, { "n": 140, "window": [1.53, 1.54] }, { "n": 3500 }] }
```

A re-roll toy (lab 2 slide 20) and a selection sweep (lab 2 slide 8):

```json
{ "type": "dk-hist", "name": "roll", "pos": [0, 0, 0], "grains": 24000, "width": 14, "height": 9, "alpha": 0.85,
  "model": { "lo": 1816, "hi": 1844, "bins": 14, "bkg": [["flat", 1]], "seed": 1461,
             "rolls": { "file": "toys.json", "key": "flat.rolls" } },
  "steps": [0, { "n": 20451, "errors": "band", "reroll": { "every": 1.2, "rolls": 12 } }] }
… "steps": [0, …, { "select": [0, 60], "every": 0.15, "rescale": true }, { "select": null, "every": null, "rescale": null, … }]
```

### dk-heap: the unsorted pile

Required: `pos name n grains`.

| field | default | meaning |
|---|---|---|
| `n` | | rows (91 583 for record 401). Grain i is row i, and rows beyond the tier's budget are not drawn. |
| `radius`, `height` | 5, radius/2 | the mound (a paraboloid, grains uniform in its volume) |
| `rain` | 6 | seconds for the whole pile to rain down at step 1 |
| `seed`, `ours` | 401, 0 | the rain order (`rng.order`): rank 0 lands first and lowest; ours lands last, on the summit, at size 2.5 |
| `ball: { r, at }`, `spin` | 0.42 × radius, above the centre; 0.12 rad/s | the ball of step 3, turning |
| `tone`, `alpha` | crowd, from the density | |
| `oursFrom`, `oursGlide` | none, 2.4 | a form's name (T1: the dk-trigger whose packet folded at the lane's end): in the rain (step 1, fresh) our grain does not fall with the others; it stands at that form's `api.ours()` from the first frame and glides down on a bowed arc, `oursGlide` s, landing last on the summit (lab 2 slide 27) |

Steps: `0` hidden · `1` rain · `2` settled (at once) · `3` collapse to a ball. `api.value()`
counts the grains on the floor (n when settled). `api.ours()` is our grain where it is now
(gliding in, on the summit, in the turning ball; null while hidden or claimed away), so a
dk-spark `on` the heap follows it. `api.posOf(row)` gives a row's place in
the pile; `claim(gone, who)` / `release(who)` are how a dk-hist (or a dk-vertex) takes
grains out of it: `gone[row]` is the world time the row leaves. Claims merge: each
claimant keeps its own array, a row goes at the earliest time any claimant names, and
`release(who)` drops only that claimant's (a dk-hist claims under its name). `api.rows()`,
`ready()`, `busy` (raining, collapsing, armed). Events: none (world-clock transitions).
A pile far off fades from 8 to 12 pile sizes away (`fade: false` keeps it). Rows past
the tier's budget are not drawn; a dk-hist sorting the pile drops those rows from above.

### dk-glow: bunch crossings as fronts that merge into one glow

Required: `pos name grains`. An overlay on the lhcb plugin's `detector`: it draws every
k-th grain of the same geometry file in the same frame and adds only the fronts' light.
The deck must use `plugins: [lhcb]` and a detector with the same `src`, so the build
serves `stage-data/lhcb-grains.bin`.

| field | default | meaning |
|---|---|---|
| `of` | none | the detector's `name`; the overlay follows its transform (then `pos` may stay `[0, 0, 0]`) |
| `src` | `lhcb` | the geometry file, as the detector names it (`lhcb` or `lhcb-dense`) |
| `scale`, `stretch` | 0.5, 2.4 | the detector's frame |
| `f0` | 0.6 | fronts a second at step 1 (one front in the detector at a time; stylised, since 25 ns cannot be drawn) |
| `rate` | 0.55 | the e-folding rate of the frequency from step 2; the fronts merge at about 2.2 a second, about 2.4 s after the step |
| `speed` | 6 | the fronts' speed down the beam, units a second (1.6 s to cross) |
| `after` | 0 | seconds from step 1 to the first front |
| `sharp`, `alpha`, `size` | 16, 0.9, 1.2 | the front's thinness, brightness, grain size |

Steps: `0` off (fades in 1.2 s) · `1` fronts at `f0` · `2` the fronts come faster and merge
into a steady light-blue glow with a fine white sparkle (other crossings' hits). A step back
from 2 to 1 returns to single fronts at once. A slide opened directly at step 2 shows the
glow at once. No grain flares more than about 2.2 times a second. The event times go
through `eventLatch`, so nothing is left after a step back or on a later slide.
`api.value()`: the fronts sent so far. `busy` while merging or fading. The fronts and the
glow are the crowd (light blue, lifted by `alpha`); only the sparkle of hits is white. Put
the detector in the palette (`detectorParts`, see Install).

```json
{ "type": "dk-glow", "name": "glow", "pos": [0, 0, 0], "of": "det", "src": "lhcb", "grains": 46500 }
```

### dk-trigger: the data lane, its gates, the buffer, our packet

Required: `pos name grains`. One packet of grains is one bunch crossing, running along +x.

| field | default | meaning |
|---|---|---|
| `from`, `to` | -27, 75 | the lane's ends (packets fade in and out there) |
| `lane`, `speed` | 1.1, 7 | the lane's radius; units a second |
| `packets`, `per` | 340, 22 | crossings and grains a crossing (thinned to the budget) |
| `empty` | 0.25 | the share of empty crossings: fainter, a few grains, dropped by every gate |
| `gates` | none | up to 4 × `{ x, keep (1), shrink (1), ring (600), step (2 + index), off ([]) }`. `step` is the step that fires the gate, so a buffer or flood step can stand between two gates. `off`: steps at which the gate is off although its step has passed (T1's flood: gate 1 `off: [4]` while the buffer stays on, so the full lane pours into the shell). `keep`: the share of non-empty packets that pass. `shrink`: the share of a kept packet's grains (bytes) that go on; the rest burst. A kept packet is drawn at the cube root of its kept volume (0.75 looks 0.91 as wide, no brighter); only a hard shrink (below about 0.6, Turbo's 0.075) packs to half and is lifted so it still reads as a knot. No gate has a default keep: give sourced numbers (HLT1 1/30; HLT2 about 1 in 10 with shrink 0.75: 1 MHz to about 100 kHz, 100 kB of 133 kB, `lhcb-hlt2-output-rate`, `lhcb-hlt2-keep-1-in-10-worked`) |
| `buffer` | none | `{ at, len (8), r (3.2), grains (6000), hold (3), step (3), spin (0.08), alpha (0.7) }`: from step `step` (until `collapse`), parked packets (grains / per knots of per grains) on a prolate-spheroid shell round the lane, len long and r wide, never inside it, turning as one at spin rad/s; packets in its span move hold times slower and, while the buffer is on, ride out onto the shell and back. Call it "the buffer", not a disc |
| `knot` | 0.1 | one packet's spread across the lane (σ; 1.6× along it): small keeps a dense lane reading as many packets |
| `minPx` | 0 | a floor on a grain's size in px (900-high frame) for a wide shot; 0 keeps the series size |
| `ours` | `[from]` | our white packet's place per step index: `x`, `[x, y, z]`, `{ at, fold, glide, lag }`, or `false` / `null` (hidden: it fades in 0.8 s where it stands; T5's route back fades it at the heap). `ours: false` on the object: no packet of ours at all (T4's gate). `fold`: folds into its core grain, our row; `glide`: this step's glide seconds; `lag`: a step forward to this step waits that long before its gate fires and ours moves, so a slide whose camera flies in fires once it has landed. Its core is the OURS size; past a shrinking gate it loses the same share of grains and keeps the loss: a step back holds ours where it stands |
| `glide` | 3.5 | seconds for ours to move |
| `collapse` | the last gate, buffer or `off` step + 1 | the step at which the kept packets fold into a turning ball, `ball: { at (beyond to), r (2.2), spin (0.12), from (the last gate's x), buffer (false) }`; the rest fade. Kept: past `ball.from` and kept by every active gate it has passed, at the moment of the collapse. With the gates' honest keeps few packets are past gate 2 (lab 1: a few dozen grains), so `buffer: true` folds the buffer's parked packets in too (lab 1, lab 4: a ball that reads), or `from` at gate 1's x takes the kept stream between the gates |
| `wave`, `size`, `alpha`, `seed` | 30, GRAIN, 0.9, 401 | the burst wave's speed (units a second) |

Steps: `0` hidden · `1` runs · `1 + k` gates 1..k on (or each gate's `step`; a gate is off at the steps in its `off`) · `collapse`.
A step forward (a jump of several steps too) fires the gate whose own step this is, after the
step's `lag`: the packets it drops burst at the gate as they cross, and those already past it
burst on a wave from the gate, so the lane past it empties at once. Any other gate that turns
on shows as long on (a jump 3 → 5 over the flood fires gate 2 and shows gate 1 long on; a step
back out of the flood shows gate 1 long on, so the flood is gone at once). An arrival on a lane
that was not running (step 0 or 1, a slide opened directly) fires the step's own gate after its
lag, so the burst plays on arrival. The buffer fills from the lane whenever it turns on (each
parked packet rides out to its slot, over about 2.5 s). A step back turns a gate off (the ring
dims to a floor that still reads): what it dropped stays dust, and new crossings pass; a gate
switched off by `off` behaves the same. On and off times go through `eventLatch`.

The collapse plays when it is reached from a running lane (a jump too: T4's 2 → 4) and stands
at once on a slide opened directly. A step back from it unfolds the ball into the running lane
(2 s: the grains fly out to where their packets are now, the rings and buffer come back), then
the collapse's times go back to OFF. A dk-pipeline pile with `from: '<this name>'` waits for
the ball, gathers round it and calls `api.cede(t)`: the ball fades from then (1.2 s). The lane
does not run backwards: a reversed lane would reassemble the gates' dust into packets, which
says the opposite of "what the trigger dropped is gone". T5's route back is the camera's
crane over a forward-running lane (a recorded plate), with `ours: false` from the heap on.

`api.value()`: the bytes the active gates pass (Π keep·shrink; a gate counts once it has
fired). `api.ours()`: our packet's world position now. `api.ball()`: `{ at (world), r,
formedAt (world time) }` while collapsed, else null. `api.cede(t)`. `busy` while showing,
while ours glides or fades, while the buffer fills, during a burst wave, while collapsing,
unfolding or ceding.

```json
{ "type": "dk-trigger", "name": "trg", "pos": [0, 0, 0], "grains": 72000,
  "from": 13, "to": 112, "lane": 0.7, "knot": 0.08, "packets": 4500, "per": 14,
  "gates": [{ "x": 30, "keep": 0.0333, "off": [4] }, { "x": 66, "keep": 0.1, "shrink": 0.75, "step": 5 }],
  "buffer": { "at": 49, "len": 12, "r": 4.5, "grains": 6000, "hold": 3 },
  "ours": [13, 14, { "at": 34, "lag": 2 }, { "at": [49, 4.4, 0] }, { "at": [49, 4.4, 0] },
           { "at": 70, "glide": 3, "lag": 1.5 }, { "at": 98, "fold": true }, false],
  "collapse": 7, "ball": { "at": [118, 3.1, 0], "r": 2.8, "spin": 0.06, "buffer": true } }
```

Lab 1 (steps): 2 gate 1 (slide 4), 3 the buffer, 4 the flood (slide 5's click), 5 gate 2
(slide 6, dist 7: 4-6 knots on the approach, about 9 in 10 burst at the ring, the far side
nearly empty but for ours), 6 ours folds (slide 10), 7 the collapse with the file's pile
taking over (slide 11), 7 → 5 the unfold (slide 12). T4's gate (lab 4 slides 17-18):
`ours: false`, gate 2 and the buffer at step 3, collapse 4, `ball.buffer`.

### dk-lineup: piles of one terabyte spheres that keep their size

Required: `pos name grains balls`. Sphere impostors in KJ's metal (not additive grains).

| field | default | meaning |
|---|---|---|
| `balls` | | up to 8 × `{ n, grain (1), color ('crowd' \| 'sel' \| 'axis'), at, label, merge, wait, from, grow }`. `n` spheres stand for n TB. With `grain`, each drawn sphere stands for `grain` of them, cbrt(grain) times as wide (the same volume). `at`: without it, piles stand side by side along x, resting on the floor; `[x, y, z]` exactly; `x` or `[x, z]` on the floor; `{ beside: k, side (1 right, -1 left), gap (1), z (0) }` on the floor beside pile k, whatever its size (T1's day kept, `color: 'sel'`, beside the day read out). `label`: a number with its unit, hung above the pile at a fixed size (≥ 18 px). `wait`: seconds after its step before the pile gathers. `from` ([x, y, z]): the side its spheres gather from instead of all round. `merge: { from, copiesAt }`: the pile first gathers as copies of a smaller pile. `grow: { from: k }`: the pile grows out of pile k in place (same `grain`): it takes k's place (no slot of its own in the row; `gaps` count only the piles that take a slot), and on a step that shows it while k stands and goes, k's spheres become its first spheres in the same frame and lift with its centre while the new ones gather round them; a step back flies the new ones off, settles the old ones back, and k stands there (T5's 800 TB growing to 4 PB) |
| `sets` | none | `{ "<step>": [i, j, …] }`: a numbered step that shows exactly those piles. A slide's frontmatter `steps:` carries numbers only (an array there is dropped), so a deck that needs `[2, 4]` from frontmatter writes `tb: 5` with `sets: { "5": [2, 4] }` |
| `unit` | 0.1 | one sphere's lattice step (radius 0.9 × unit) |
| `anchor`, `gaps` | 0, 2 each | the pile at the origin; the spaces between neighbours in the row |
| `grow`, `reach`, `mergeAt`, `armWait` | 3.2, 3, 2.4, 6 | gather seconds, how far out spheres start, merge timing, the arm fallback |
| `rest`, `assemble`, `seed` | true, true, 401 | piles on the floor; scatter on a flight and gather on arrival. A slide that cuts in on a `path` gets its assembly only when the path ends, so the piles wait in the dark: give that lineup `assemble: false` and it gathers on its steps |

Steps: `k` shows piles 0..k-1 (`0` hides all), or `sets[k]`; an array `[i, j]` (from
`<StageSteps>` only) shows exactly those. `api.value()`: the spheres (TB) the shown piles stand
for. The camera's pull-back (a `path`) is the deck's: the piles keep their size.

```json
{ "type": "dk-lineup", "name": "tb", "pos": [0, 0, 0], "grains": 91400,
  "balls": [{ "n": 1 }, { "n": 4 }, { "n": 345600, "grain": 8 }, { "n": 1300000, "grain": 27 },
            { "n": 864, "color": "sel", "at": { "beside": 2, "side": -1, "gap": 1.5 }, "label": "864 TB" }],
  "gaps": [0.5, 1.6, 5], "sets": { "5": [2, 4] } }
{ "type": "dk-lineup", "name": "tb", "pos": [0, 0, 0], "grains": 200, "assemble": false, "gaps": [0.5], "sets": { "3": [0, 2] },
  "balls": [{ "n": 1 }, { "n": 800, "grain": 27, "label": "800 TB" }, { "n": 4000, "grain": 27, "label": "4 PB", "grow": { "from": 1 } }] }
```

Lab 1 slide 13 (`tb: 5`) and lab 5 slide 10 (`tb` 1 → 2 → 3 → 2) show both.

### dk-ground: the series floor

Required: `pos grains`. Fine dim grains on y = FLOOR_Y, on a jittered grid, fading at the
rim, at grazing angles and far off. Fields: `radius` (40), `spacing` (default: `grains`
fill the disc), `alpha` (1.0), `size` (0.7), `tone` (`axis`, or `crowd`), `seed`. Without
`name` it is always there; with one, `0` hides it and `≥ 1` shows it (1.2 s fades). A floor
is meant to be stood over: add `"enterable": true` to its object, or stage:check warns
`camera-inside-form` (the checker cannot see the kit's registration).

### dk-spark: our grain, marked

Required: `pos name grains` (221 at the defaults: one core and 220 ring grains).

Our grain is row 1 of record 401 in every talk. dk-spark marks it with a core of size 2.5
(`OURS`) and a soft ring of fine grains round it. The ring faces the camera and keeps one
share of the frame at any distance, as a tick label does, so it finds the grain in a dense
column from 25 units as well as from 5. The core takes the colour the grammar gives our
grain on that slide (`color: 'sel'` white while it is kept, `'crowd'` light blue once it is
background-like). The marker is the ring, never a colour.

| field | default | meaning |
|---|---|---|
| `steps` | `[null, { at: [0, 0, 0] }]` | one entry per step (index = step; `null` hides) |
| `size`, `alpha` | 2.5, 1 | the core |
| `halo` | `{ r: 0.028, n: 220, size: 0.95, ref: 13 }` | ring radius as a share of the frame's height, grains, grain size (× GRAIN); `ref`: the distance at which a ring grain is drawn at `size`, larger by d/ref further off, so the ring looks the same from 27 units as from 13; `false` on a step hides it |
| `haloAlpha` | 1.35 | |
| `color` | `'sel'` | the core's role colour unless a step gives one: `'sel'`, `'crowd'`, or `'follow'` |
| `ringColor` | the core's | the ring's role colour (object or step). By default the ring takes the core's colour; give `'sel'` to keep the marker white while the core turns light blue |

A step: `{ at | on, from, glide, color, colorAfter, colorTime, ringColor, core, halo, row }`.
- `color` on a step changes the core's colour over `colorTime` (0.8 s) after `colorAfter`
  (0 s): T2's white core turning the crowd's light blue on T3's `{weights}` click, timed to
  the sweep reaching our grain (`colorAfter` 0.8 at 1 880 MeV/c²; lab 3 slide 12).
  `'follow'`: the core takes the followed grain's own colour each frame (dk-hist
  `api.whiteOf`; after `{weights}` that is our grain's 0.144, lab 3 slide 13). A followed
  spark draws its core only with `core: true`.
- `at: [x, y, z]` (station frame), with `from` (a step with `from` always plays its move,
  however the slide was reached) and `glide` seconds (2.5).
- `on: 'name'` or a list `['v', 'h']`: follow that form's grain of our row each frame
  (dk-hist and dk-vertex `api.ours()`, dk-heap `api.posOf(row)`); the first in the list
  that draws it wins, so a spark on `['v', 'h']` passes from the vertex's grain to the
  histogram's grain when the vertex hands over. Those forms draw the core themselves, so
  a followed spark draws only the ring (`core: true` adds its own core).

`api`: `arm()`, `assemble(t, onDone)` (calls onDone at once), `ours()` (the marker's
world position, null while hidden), `value()` 0, `ready()`, `busy` while it glides,
fades, changes colour or is armed. Events: none (the glide and the landing glow run from t0 on the
world clock).

```json
{ "type": "dk-spark", "name": "s2", "pos": [0, 0, 0], "grains": 221,
  "steps": [null, { "on": ["v2", "h2"] }] }
```

### dk-vertex: one decay, one number

Required: `pos name grains` (475 at the defaults: 1 + `trail` 34 + 2 × `strand` 220).

One short-lived particle flies, decays into two strands of grains, and the pair folds back
into one white grain that lands on a dk-hist's mass axis at the pair's mass (T2 part 1).
**The strands carry no names** (the owner's decision, 29 Oct: the decay is never named, on
screen or in the notes' Message and Picture lines). They read as two tracks from one point
by themselves: they leave the decay point together, bend apart in opposite senses, and
their roots are brighter (`root`), so the shared origin is the brightest place in the pair
(lab 2 slide 13). `names`, `namePx` and `tracks[].name` are ignored, and check.mjs warns.
The decay is row 1's: its M, pT and decay time (from `d0.json` `row1`, or `m`, `pt`, `tau`).
Record 401 has no track momenta, so the decay angle is **simulated** (seeded): isotropic
in the D⁰ rest frame with the two-body p* (869.6 MeV/c for row 1), boosted by βγ = pT/M
(the transverse plane). The lab momenta rebuild M exactly (`api.values()`: for seed 401,
p(K⁻) 2.68 GeV/c, p(π⁺) 0.80 GeV/c, opening 74°). The strands bend in opposite senses by
1/p, as a K⁻ and a π⁺ do in the magnet. By default the decay plane faces the camera (the
azimuth about the flight line is the view's to choose; `face: false` keeps the simulated
one). The notes must say "angles simulated".

| field | default | meaning |
|---|---|---|
| `at` | [0, 0, 0] | where the D⁰ starts (station frame) |
| `heap` | none | a dk-heap's name: start from our grain on its summit instead, and the heap gives that grain up while the vertex holds it |
| `dir`, `flight` | [0.35, 1, 0], 3.5 | the flight's direction and its world length (a picture length: the real flight is βγcτ = 0.20 mm) |
| `track`, `bend` | 6, 0.06 | strand length (world), curvature per 1/(GeV/c) |
| `land: { of, m }` | none | the dk-hist to land on and the mass (default row 1's M) |
| `root` | 0.8 | how much brighter each strand's first grains are (the shared origin) |
| `seed`, `face` | 401, true | |
| `flightTime`, `landTime`, `trail`, `strand` | 1.8, 1.6, 34, 220 | |
| `trailAlpha`, `landSize` | 0.9, 2.2 | the flight's brightness; our grain landed alone on an empty axis is drawn landSize larger and shrinks back as the hist's own grain takes over |

Steps: `0` hidden · `1` flight (1.8 s) · `2` decay (the D⁰ goes out, the strands grow,
1.3 s) · `3` land (the strands fold into one grain, 0.9 s; it arcs to its bin and lands,
1.6 s). A step forward plays its own part; an arrival or `c` plays every part up to its
step from nothing (about 6 s for step 3); a step back shows the step's end at once. Once
the `land.of` hist draws its own grain of our row where ours landed, ours hands over and
fades. `api.value()` is the pair's mass once our grain has landed on its bin (with
`land`; without, once the strands have folded), NaN before that (0 before step 3), so
`<StageCount for="v" :to="1880.6" :decimals="1">` prints no wrong number mid-decay: give
the deck's number a `--d` delay that reaches the landing; `api.ours()` is the
D⁰, the decay point while the pair is apart, then the folded grain (for a dk-spark).
`files(o)` is `['d0.json']` unless `m` and `pt` are given. Events: none. With `heap`, the
vertex claims our row from the pile under its own name (claims merge, see dk-heap).
Give the hist it lands on `oursFrom: '<vertex name>'` on its sort step, so the hist's
own grain of our row starts where the vertex landed it instead of leaping again.

```json
{ "type": "dk-vertex", "name": "v2", "pos": [0, 0, 0], "grains": 475, "heap": "heap2",
  "dir": [0.5, 1, 0], "flight": 3, "track": 5, "land": { "of": "h2" } }
```

### dk-bell: the normal tail

Required: `pos name grains` (300 000).

Each grain is one draw of N(0, 1) by seeded inverse-CDF sampling: one jittered draw in each
of n equal strata, x = Φ⁻¹(u) (Acklam's approximation), so the counts beyond each line are
n·(1 − Φ(k)) to within a grain. The height is uniform under the curve, so the grains fill
the bell evenly (a histogram with very fine bins). With n = 300 000 and seed 401: beyond
1 σ 47 596, 2 σ 6 825, 3 σ 405, 4 σ 9, 5 σ 0 (the largest draw is 4.59), matching
`toys.json` `tail.bell300k`. Each grain's alpha follows how deep the grains overlap there,
so the bell is an even light blue and a lone grain in the tail is whole.

| field | default | meaning |
|---|---|---|
| `n` | 300 000 | draws; `api.value()` counts from all of them even when a lower tier draws fewer grains |
| `sigmas`, `width`, `height` | 6, 24, 8 | the axis runs ±`sigmas`; world width and height |
| `ticks`, `word` | every integer, none | tick numbers (or `[v, 'text']`), the one caption (`σ`) |
| `seed`, `fill` | 401, 1.6 | the draws; seconds the bell takes to settle in on arrival |
| `size`, `alphaGain`, `selGain`, `litSize` | 0.65, 1.5, 1.7, 1.9 | grain size (× GRAIN: at 300 000 the grains read as sand, not a flat fill); brightness of the crowd; the white gain of lit grains in the dense body; lit grains past 2.5 σ (lone grains) drawn this much larger, so the 405 beyond 3 σ read as a white tail |

Steps merge as dk-hist's do (step k = steps 1..k, `null` drops a key, 0 hidden):
- `{}`: the bell, unlit.
- `lit: k`: a front sweeps to k σ (from the far tail the first time, then from where it
  stood) and the grains beyond it turn white; a white mark stands on the axis at the
  front. `api.value()` is the count beyond the front as it moves.
- `zoom: true | { from, gain }`: the tail beyond `from` σ (3) is redrawn `gain` times
  taller (default 0.6·e^(from²/2), 54 for 3), the rest of the bell and its ticks fade, and a
  line of slowly flowing grains traces the curve on to `sigmas` over the empty tail. It is
  a magnified scale: say so (and the factor) in the notes. The magnified tail is white
  (continuous with the lit tail) and the axis left of `from` fades with the bell.

`api`: `value()`, `values()` → `{ n, drawn, lit, count, max, gain, zoom }`, `busy` while it
fills, the front sweeps or the zoom moves. Budget: 300k is a builder's whole tier-0
budget; with the dust (124k) nothing else heavy shares the slide.

```json
{ "type": "dk-bell", "name": "z", "pos": [0, 0, 0], "grains": 300000, "word": "σ",
  "steps": [0, {}, { "lit": 1 }, { "lit": 3 }, { "lit": 5 }, { "zoom": { "from": 3 } }] }
```

### dk-pipeline: a plot anyone can redo

Required: `pos name stages grains` (`grains`: the ball's n plus its own streams,
sweeps, code and sheet grains, about 29 000; lab 5's is 120 722). The stages stand on the
floor left to right in the order the data flows. There are no words, boxes or arrows: a
run of grains streaming through is what joins them.

| stage | fields (defaults) | draws |
|---|---|---|
| `pile` | `at` (floor point), `r` 2.1, `n` 91 583, `spin` 0.06, `alpha` 0.6, `ours` 0, `from` | the file: a ball of n grains, one a candidate, turning; our row at size 2.5 on the camera's side. `from: '<dk-trigger name>'`: when the pile gathers (a step up from 0), it waits for that trigger's collapsed ball (`api.ball()`, up to 0.5 s for the trigger to take its step), gathers round it once it has formed, and the ball fades as the pile lands (`api.cede`): T4's close into T5's cover. Put the pile's centre (`at` + [0, r + 0.3, 0]) where the trigger's `ball.at` is |
| `code` | `at` (bottom-left), `size [w, h]`, `src` `code-lines.json`, `script`, `lines [first, last]` (1-based), `cols` 1, `gap` 0.5, `typing` 2.2 | a script, one grain row per real line; each non-blank run of characters is a run of grains, so indent, length and word gaps are the file's. `cols` folds a long range like a minimap. Keep the line pitch (h / lines per column) the same for every code stage, so their lengths compare truly |
| `sheet` | `at`, `size`, `values` `d0.f32`, `rows` 90 (per page), `pages` 1, `cell` 14, `stride` 1, `columns` | the CSV: rows × 4 columns, each value a dash of `cell` grains whose brightness is 0.1 + 0.9 × its rank in its column (over all rows); a missing TAU leaves its cell dark. Rows are file rows from row 1 (`stride` k: every k-th) |
| `hist` | `of` (a dk-hist name) | nothing of its own: marks the step that runs the data into the plot |

Object fields: `run { seconds: 8, lead: 0.4, twice: true, third: false, tones }`, `flow` 2500
(stream grains between two stages), `sweeps` 3, `alpha` 1.4 (code and sheet), `flowAlpha`,
`sweepAlpha`, `seed`, `replay` (true), `keep` (true). `run.tones`: the stream grains' tone per run
(`['crowd', 'sel']`: T5's first pass light blue, the second white; default all crowd).
`replay: false`: an arrival (a cold open, a flight in, `c`) shows the step's state at once
(0.02 s), with no gather, typing or run: T5's cover, where the ball must stand from frame 1 as
T4's last frame left it (lab 5 slide 1).

Steps: `0` hidden · `k = 1..S` stages 1..k stand: a code stage is typed in line by line; a
sheet is written row by row as the stream arrives from the stage before; a `hist` stage
runs the data from the file into the plot · `S+1` run 2 · `S+2` the third run (only with
`run.third`). A run is every stage at once: grains leave the ball for the first script,
white sweeps run down the scripts' lines, a white head writes and reads the sheet's rows,
grains stream on into the next script. The plot is a dk-hist of its own, stepped by the
deck on the same slide, filling out of the last script:
`"from": [right edge + 0.4, middle of its height, z], "fromSpread": [0.3, h, 0.3], "fill": 3.5`
(`api.outlet()` gives these). Run 2 is a second dk-hist with the same values, seed and
ours and `tone` crowd, over run 1's `tone: "sel"`: it lands grain for grain on run 1.
A flight to the station from a pose beside it, with the pipeline standing in view, keeps it
standing (the slide's step plays as a step, not a replay from scatter); `keep: false`
gives the replay back.
Two coincident grain sets add up to a pale grey, so run 1 gives way grain by grain: run 2
carries `"over": "h1"`, and each run-1 grain goes at the moment its run-2 twin lands in its
slot, so the plot changes colour from the bottom of each column up with no change of shape.
T5's order (lab 5 slides 4-6, kit-flow): `h1` light blue (no `tone`), steps `[0, {n: "all",
alpha: 0.75}, {}]`; `h2` `tone: "sel"`, `selGain: 1`, steps `[0, {n: "all", alpha: 0.5}]`,
`over: "h1"`; `run.tones: ["crowd", "sel"]`. Recorded at 25 fps: the light-blue pass fills
with no bloom, and the white pass takes over with no landing flash or halo; at alpha 0.5 the
white reads light grey in the dense columns (0.72 reads whiter; 0.95 blooms into a white blob
at dist 34.5 with the plot 20 units wide).

`api`: `value()` = the sheet's rows written so far, scaled to the file's 91 583, or with no
sheet (a pile alone) the pile's n as it gathers (for `<StageCount for>`); `busy` while anything gathers, types, writes or streams;
`outlet(k)`, `box(k)` (station frame); `scripts()`; `ready()`; `step()`.

Data: `code-lines.json` from `bake/code.py` (one entry per script: path, bytes, sha256,
lines, longest, and per line the [start, end) columns of its non-blank runs; no source
text). Both scripts are the kit's own and public: `bake/root_to_csv.py` (52 lines, sha256
20f05681…, the converter from record 401's ROOT file to the CSV, byte for byte) and
`bake/d0.py` (918 lines, 053d8070…). `code.py --check` fails when either changes; re-bake,
and re-check the `lines` range a deck draws (d0.py 87-208 still runs from `read` to `lm`:
new d0.py code goes below `lm`). The converter's code body is lines 19-52 (from `import
hashlib`); its whole 52 lines in lab 5's 6.9-unit-high stage give a line pitch of 0.13
against d0.py's 0.17, so draw `lines: [19, 52]` (34 lines, pitch 0.20) or a 9.0-unit-high
stage to keep the pitches equal.

Example (lab 5, `talks/2026_00_00_DataLab5/public/data/space.json`):

```json
{ "type": "dk-pipeline", "name": "pipe", "pos": [0, 0, 0], "grains": 120722,
  "stages": [
    { "kind": "pile", "at": [-25.5, 0, 0], "r": 2.8, "n": 91583 },
    { "kind": "code", "at": [-21.5, 0.6, 0], "size": [4.6, 6.9], "script": "root_to_csv.py" },
    { "kind": "sheet", "at": [-15.3, 0.6, 0], "size": [6.0, 10.5], "rows": 90, "cell": 14 },
    { "kind": "code", "at": [-6.9, 0.6, 0], "size": [7.6, 10.5], "script": "d0.py", "lines": [87, 208], "cols": 2 },
    { "kind": "hist", "of": "h1" } ],
  "run": { "seconds": 8, "lead": 0.4, "twice": true } }
```

Slides: `steps: { pipe: 3 }` (file, script, sheet), `steps: { pipe: 5, h1: 1 }` (run 1),
`steps: { pipe: 6, h1: 2, h2: 1 }` (run 2). A run fires only on a forward step (or an
arrival): a slide that keeps the same pose and the same step as the one before shows the
settled state, so a mid-run slide must come right after the step that starts the run. The
dk-hists in lab 5 are 20 units wide (`width` 20, `height` 10.5, explicit `ticks`), at
`pos` [12.5, 0, 0], fed from `[1.1, 5.85, 0]` with `fromSpread` [0.3, 10.5, 0.3]. Budget: ball 91 583 + 29 139 of its own (code 4 307,
sheet 5 040, streams 7 500, sweeps 12 292) + two dk-hists 183 166 + dust 123 904 = 427 792
at tier 0.

### dk-curve: a model as a line of flowing grains

Required: `pos name grains of`. The curve draws in the named dk-hist's `frame()` (its
grains join the hist's plot group, so they tilt with `{tilt}`), at the hist's own y scale:
y = model density × the hist's bin × `frame().y(1)`, gliding when the hist rescales. The
parameter sets come from a committed bake file, never from the deck.

| field | default | meaning |
|---|---|---|
| `src` | `d0-fit.json` | the bake file the sets, the model and the pull data come from |
| `sets` | `iterations` if the file has them, else `params`, else `fit` | a path to an array of sets, or a list of paths. A set is an array in `model.params` order, a logged iteration `{ p, chi2 }`, or an object; a string value `'@path'` is read from the same file (`{ "tau": "@pdgTau", "n": "@fit.nNet", "t0": "@fit.t0", "t1": "@fit.t1" }`) |
| `f` | the file's `model.f`, else `decay` for a file with `fit` | `gauss+poly1`, `gauss+exp`, `exp`, `poly1`, `flat`, `decay`. Terms: gauss `nSig mu width` (signal); poly1 `a b` about `pivot`, flat `a`, exp `a slope` or `a tau` (background, per `bin`); decay `n tau t0 t1` (n entries of the normalised exponential on [t0, t1]) |
| `pivot`, `bin`, `names` | the file's `model.pivot`, `model.bin`, `model.params` | |
| `range` | the file's `range`; [t0, t1] for decay; else the hist's | the x the curve is drawn over |
| `pull` | the file's `bins45` | `false`, or `{ data, counts, err, eval, y, height, max }`: `data` a path to `{ x or edges, counts or net, err }`; `eval` `'centre'` (a binned fit: density at the bin centre × bin, as the bake's χ²) or `'integral'` (an unbinned fit); the row stands at `y`·H under the axis (−0.38, clear of the tick numbers and the caption), `height`·H for a pull of 3 (0.17), clipped at ±`max` (3.5) |
| `readout` | `chi2` | what `api.value()` gives: `chi2` = Σ pull² of the curve as drawn now (53.36 at the fit, 371.5 at the start values, matching the bake), or any parameter name (`mu`, `width`, `tau` …), gliding with the curve |
| `flow`, `thick`, `dash`, `ease`, `draw`, `alpha`, `seed` | 0.25 units/s, 0.02, 0.5, 1.4 s, 1.2 s, 1, 401 | drift speed along the line, its spread across, the parts' dash period, the step glide, the draw-on, brightness, jitter seed |
| `z` | half the hist's bin width | the line's depth: the columns' near face, so a close fit touches the column tops instead of riding above them in perspective |
| `tone` | `'sel'` | `'crowd'`: the whole line light blue (an expectation of noise, T2 slides 11-12: what the crowd gives on average, not a fitted or selected thing; lab 2 slide 21). Its parts keep their colours |

Colours: the model and its signal part white (dashed), the background part light blue
(dashed, 0.3 units in front of the columns and brighter; on a light-blue plot prefer
`parts: 'sig'`, the curve's flat shoulders already show the background), the pulls white
on a dim zero line. Grains: 42 % on the line, 15 % on each part a step uses, 3 % on the
zero line, the rest in the pulls; without pulls every other grain is on the line.

Steps (merged like dk-hist's; without `steps`, step k shows set k − 1): `set` (an index,
`-1` or `'last'`), `parts: true | 'sig' | 'bkg'`, `pull: true`. Show the pull row with the
start values too (`{ set: 0, pull: true }`): the start curve looks close, and its pulls of
3-4 on the flanks are what χ² 372 means. Step 0 hidden. From hidden (or an
arrival, or `c`) the curve waits until its hist stands (dk-hist `api.standing()`: the fill
done; a re-rolling or sweeping plot stands once its first state does, so a curve over T2's
20 rolls draws on with the first roll, not 24 s later), then draws on from the left in 1.2 s. A step forward glides the parameters over 1.4 s (the pulls and the χ²
readout follow); a step back takes 0.35 s. Per step: `ease` (the glide's seconds),
`after` (seconds before it starts, e.g. once the camera has landed) and `through: true`
(a step across several sets, say set 0 to set 5, glides through every logged set between,
`ease` (0.8 s) each, so the fit is seen iterating). `busy` while waiting, drawing, gliding or
fading; the flow itself is idle motion and never busy.

`api`: `value()`, `values()` → `{ params, chi2, set, step }`, `params()`, `sets()`, `pulls()`,
`ready()`, `busy`.

```json
{ "type": "dk-curve", "name": "fit", "of": "h", "pos": [0, 0, 0], "grains": 9000, "src": "d0-fit.json",
  "steps": [0, { "set": 0, "pull": true }, { "set": 1 }, { "set": 2 }, { "set": 5, "parts": "sig" }, { "parts": null, "pull": null }] }
{ "type": "dk-curve", "name": "decay", "of": "tau", "pos": [0, 0, 0], "grains": 3000, "src": "d0-tau.json",
  "f": "decay", "sets": ["fit"], "pull": false, "steps": [0, { "set": 0 }] }
```

A slide: `steps: { h: 1, fit: 4 }` and `<StageCount for="fit" :to="53.4" :decimals="1" />`.
d0-fit.json's iterations 3-5 differ from 2 only in the fourth decimal: three visible
moves (start → 1 → 2). Budget: about 9 000 (T3 hero).

Baked sets for other curves (the file carries no top-level `model`, so the deck names `f`
and `range`; `pivot` and `bin` travel in each set):

```json
{ "type": "dk-curve", "name": "e", "of": "look", "pos": [0, 0, 0], "grains": 1500, "src": "toys.json",
  "sets": ["falling.curve.sets.0", "falling.curve.sets.1"], "f": "exp", "range": [1.45, 1.75], "pull": false }
{ "type": "dk-curve", "name": "b5", "of": "h", "pos": [0, 0, 0], "grains": 1500, "src": "d0-significance.json",
  "sets": ["line5sigma.set"], "f": "flat", "range": [1850, 1880], "pull": false }
```

`falling.curve.sets` are the toy's expected count at 140 (set 0) and 3 500 entries (set 1),
within 0.05 % of the bin integrals `expected140` / `expected3500` at the bin centres;
`line5sigma.set` is the level 1 453.5 a 2 MeV bin at which the window 1 850-1 880 would
stand exactly 5 σ over its counted background.

### dk-landscape: the χ² (or loss) valley

Required: `pos name grains`. A height field of grains from a bake's grid, the logged
minimiser path with a ball rolling it, the Δ = 1 ring, and the 1D slice whose Δ = 1
crossings are the error. The builder only draws: grid, path, slice and crossings are the
bake's (`d0-chi2.json`; T4: `train-perceptron.json` with `key: "lossProfile"`, the loss
with b set to its best at each (w1, w2), as T3's bowl profiles n_sig: 101 × 101 nodes over
−0.6 to 3.4 (w = (0, 0) is a node, 0.693), path `[w1, w2, profiled loss, best b]` per
epoch, so `readout: 'path'` reads 0.693 → 0.162 and the ball stays on the surface;
`lossGrid` fixes b at the trained −4.31, where w = (0, 0) stands at 2.17).

| field | default | meaning |
|---|---|---|
| `src`, `key` | `d0-chi2.json`, none | the file, and a path to the grid in it: `{ x: [lo, hi, nx], y: [lo, hi, ny], z (row-major z[j·nx+i]), min?, path? [[x, y, …]], slice? { x, z, cross } }`. z is shifted so its minimum is 0 (Δ) |
| `dims` | 2 | 2: the bowl; 1: the slice alone, a parabola of grains standing upright (the sparse slide) |
| `under` | none | a dk-hist's name: the bowl sits in front of its axis line, dug into the floor (rim at the floor, bottom `height` below), its minimum under the hist's x of the same value; `at` overrides the offset from the hist's base |
| `size`, `height` | [14, 10] (dims 1: [14]), 5 (dims 1: 7) | world width (grid x, right), depth (grid y, toward the camera; `flip` reverses it) and height |
| `range` | the whole grid | `[[xlo, xhi], [ylo, yhi]]`, or `[hx, hy]` half-widths round the grid's `min`: the part of the grid drawn. The path then starts where it first enters the range (the ball rolls in over the rim). For d0-chi2.json use `[0.4, 0.3]` (μ̂ ± 0.4, width ± 0.3 MeV/c²): the Δ = 1 ring spans a quarter of each axis and reads as a ring; on the whole grid it is a twelfth of the μ axis, a glow round the ball |
| `zmax` | 1.12 × the path's highest Δ in range (at least 4), at most the grid's | Δ at the rim: grains above it are not drawn. The path's start must be on the surface |
| `below` | true with `under` | the bowl hangs under the floor rather than standing on it |
| `mesh`, `lines`, `alpha` | 26, 0.6, 0.62 | grid lines a direction, the share of surface grains on them (the rest fill between), brightness; the bottom is brighter than the rim |
| `levels` | [1] | the rings (marching squares on the grid): the first white, the others light blue |
| `ball`, `roll` | `{ grains: 360, r: 0.17 }`, `{ legs: 24, leg: min(0.6, 8 / legs) }` | the ball, and the roll: a log longer than `legs` (a training run) is taken at even steps; `leg` seconds a leg, eased within each leg |
| `slice` | `{ zmax: 4, zoom, height, lift, dim: 0.6, decimals: 2, grains: 1600 }` | the slice shows Δ ≤ `zmax`; dims 2 stands it in the bowl's own height, in the plane of the minimum, magnified `zoom` times about the minimum (auto: ±√zmax errors over 55 % of the width) while the surface dims by `dim`; crossings labelled with `decimals` |
| `ticks`, `yticks`, `tickPx`, `word` | x: nice values along the bowl's front lip; y: none | `ticks`: grid x values along the front lip (`false` for none); dims 1: values under the slice's foot, each a value, `[value, 'text']` or `{ v, text, tone: 'sel' \| 'crowd' \| 'axis' }`, with a short mark (T3 slide 7: `[1864.47, { v: 1864.84, tone: 'sel' }]`; keep them off the crossing labels of a `ring` step). `yticks`: grid y values beside the right edge (width: `[7.5, 7.65, 7.8]`). Written with the decimals they are given; keep them off the corners. `word`: the slice's one caption (`Δχ²`), above its level number |
| `band` | none | dims 1: `{ x: [a, b], tone: 'axis' \| 'crowd' \| 'sel', alpha: 1, fill: 0.45, to: 'wall' \| 'top', grains: 2400 }`: a value ± its error as a band of grains standing from Δ = 0 up to the slice's wall over [a, b] (`to: 'top'`: up to `slice.zmax`), its two edges as lines and a fill between. T3 slide 7: PDG's 1 864.84 ± 0.04 high on the wall of our valley, `{ x: [1864.80, 1864.88] }` with `slice: { zmax: 20 }` (lab 3 slide 10). Shown with the slice from step 1, or on the steps with `band: true` if any step names `band` |
| `readout` | `x` | `api.value()`: the ball's x (μ as it rolls), `y`, `d` (Δ under the ball), `chi2` (`chi2min` + Δ: the grid's own value; with `lossProfile` the loss), or `path` (the path's own third column under the ball: a logged or profiled loss; `lossProfile` reads 0.693 → 0.162 exactly, lab 3 slide 11) |

Steps (merged like dk-hist's). Default (both dims): `[0, {}, {roll: true}, {ring: true}]`.
Keys: `surface` (dims 2, default on), `roll`, `ring` (dims 1: the dim Δ = 1 line, the white
error bar along it between the crossings, a dim drop line from each crossing to its value;
no baseline, so nothing closes into a box), `slice` (dims 2, opt-in: the slice rises inside
the dimmed bowl and the bowl's ticks go; legible but busy, so give the error its own dims-1
slide instead), `ball` (the ball stands at the minimum, no roll and no trail: T3 slide 7's
"ball at the bottom"), `band` (dims 1, see the field). Step 1 gathers the surface from a loose cloud under it (rim first,
about 2.5 s; dims 1 draws the parabola on in 1.2 s). From an arrival or `c` the stages
replay in order: gather, roll, ring, slice. A step back is instant (0.35 s). `busy` while
anything gathers, rolls, fades or rises.

`api`: `value()`, `values()` → `{ x, d, min, cross, step }`, `ready()`, `busy`.

```json
{ "type": "dk-landscape", "name": "bowl", "under": "h", "pos": [0, 0, 0], "grains": 60000,
  "src": "d0-chi2.json", "size": [14, 10], "height": 6, "range": [0.4, 0.3],
  "ticks": [1864.3, 1864.5, 1864.7], "yticks": [7.5, 7.65, 7.8] }
{ "type": "dk-landscape", "name": "s1", "pos": [0, 0, 0], "grains": 4000, "dims": 1, "src": "d0-chi2.json", "height": 7, "word": "Δχ²" }
{ "type": "dk-landscape", "name": "s2", "pos": [0, 0, 0], "grains": 5000, "dims": 1, "src": "d0-chi2.json", "height": 8,
  "slice": { "zmax": 20 }, "band": { "x": [1864.80, 1864.88] }, "ticks": [1864.47, { "v": 1864.84, "tone": "sel" }],
  "word": "Δχ²", "steps": [0, { "ball": true }] }
{ "type": "dk-landscape", "name": "loss", "pos": [0, 0, 0], "grains": 40000, "src": "train-perceptron.json",
  "key": "lossProfile", "readout": "path", "size": [12, 12], "height": 8, "ticks": [0, 1, 2, 3], "yticks": [0, 1, 2, 3],
  "roll": { "legs": 30 }, "steps": [0, {}, { "roll": true }] }
```

T4's loss valley (lab 3 slide 11): `<StageCount for="loss" :to="0.162" :decimals="3" />`;
the readout runs 0.693 → 0.162 along the path's profiled losses.

T3's bowl slide (lab 3 slide 4): `steps: { h: 0, fit: 0, bowl: 3 }` and
`<StageCount for="bowl" :to="1864.47" :decimals="2" />`, camera `{ at: [0.4, -3.6, 6.2],
dist: 19, yaw: -12, pitch: 34 }`. The plot (tilted or not) is hidden while the bowl
stands: its 1 820-1 910 axis next to the bowl's μ ruler reads as one scale. The plot can
tilt back on the step before and fade as the bowl gathers. Budget: hist 91 583 + curve
12 000 + landscape 60 000 + dust 123 904 = 287 487 at tier 0.

### dk-scatter: events in two variables, and the boundary between them

Required: `pos name grains`. One grain per row, at the series grain size, in a plane
standing on the floor (x from −W/2 to W/2, y from 0 to H, like a dk-hist). White is
class 1 / kept, light blue the crowd. Every boundary (a box edge, a threshold, a
perceptron's line, a network's score = 0.5) is the zero contour of a "kept" function over
the plot, drawn as a chain of fine white grains, so any boundary can turn into any other:
the vertical cut tilts into a line, the line sweeps through the epochs, the line bends
round the cloud.

Sources (choose one):

| source | what | defaults |
|---|---|---|
| `src: 'd0.f32'` (the default) | record 401 | x = log10 IPχ² (range −3.5 to 5), y = log10 decay time (0.08-50 ps, so the data's own 0.150 ps start and its long tail both sit inside the frame), rows with TAU > 0 (91 531), label = 1845 < M < 1885 (the course's Lecture 16 recipe), the leak axis on M, the bent boundary from `train-d0.json` `twoInputs` (the two inputs the picture shows) |
| `src: 'train-perceptron.json'` or `'train-ring.json'` | the course's point sets (simulated) | `points.x` → x1, x2; `points.label`; `points.splitRole` (`show: 'train'` / `'test'` / `'validation'`); the source's `{ w, b }` blocks as lines (`line`, `split`, `bayes`, `after1`), `epochs` for `{epoch}`, `scoreGrid` for `{bend}` |
| `rare: { n, signal, tp, fp, seed, bkg, sig }` | the rare-signal set (simulated, seeded) | 100 000 rows, 100 signal; background `bkg` [0.42, 0.42, 0.1] (4 sd clear of the frame), signal `sig` [0.68, 0.68, 0.06]; the cut `{ line: 'cut' }` (u + v > c) keeps exactly `tp` 90 signal and `fp` 999 background (train-rare.json's arithmetic). Use `axes: false`: its inputs are abstract |

Frame and look:

| field | default | meaning |
|---|---|---|
| `x`, `y` | per source | `{ col, log, range, ticks, raw }`. `range` is in display units (log10 on a log axis). `ticks`: numbers or `[value, 'text']`; with `raw: true` the values are in the column's units (`[[0.2, '0.2'], [1, '1'], [20, '20 ps']]` on log decay time) |
| `cols`, `log`, `range` | | shorthand: `cols: [x, y]`, `log: [bool, bool]`, `range: [[x0, x1], [y0, y1]]` |
| `std` | false | a JSON source with a `scaling`: plot both axes in the standardised units its network used ((raw − mean) / sd). Ranges, ticks and boxes are then in those units; lines, grids and readouts still work on raw values. The ring set reads round only this way (raw x1 2-8 against x2 0-60) |
| `axes` | true | `false`: no axis lines, tick marks or tick numbers (the rare set; the ring with `std`, lab 4 slide 14) |
| `where`, `label` | per source | a row filter and the class-1 rule, `[col, op, v]` or a list (ops `< <= > >= == != in finite`), or a column name |
| `size` | `[22, 12.5]` | world width and height. A sparse set reads better small and close (lab 4: 200 points in 6.5 × 6.5 at dist 10.5) |
| `word` | none | the one axis caption (x), at most five words. `wordY` exists, but the bible allows one caption: put the unit in a y tick instead (`'20 ps'`) |
| `depth` | d0: `{ col: 'M', range: [1810, 1920], size: 9, squeeze: 0.04 }` | the leak axis: `{ col, range, size, ticks, side: 'right', reverse, squeeze, crowd }`. Mass runs right as seen from the plot's right side (yaw > 0); `reverse` for a camera on the left. While it is open the plane squeezes to `squeeze` of its width as far as the camera stands side on (none face on, all of it at yaw 90, so the plane never collapses into one stacked column while still seen from the front), its own axes fade, and each grain's alpha follows the density seen from the side (`crowd`, default the form's). View it exactly side-on (yaw 90): the bands are then vertical stripes over the depth ticks. `false` turns it off |
| `score` | per source | `{ file, net, inputs }` (a logged network: inputs `[col, scale]` → ln(col · scale)) or `{ file, grid, z, space }` (a score grid; `space: ['log10', 'lin']` says how the grid's axes relate to the columns); `level` 0.5 |
| `alpha`, `selGain`, `crowd`, `cell`, `whiteVis` | 1.25 sparse / 1.05 dense; 1.0 sparse / 0.85 dense / 1.15 rare; 8; 0.12; none (1.25 rare) | brightness. Each grain's alpha also falls with the local density ((crowd / d)^(1/2.2) over cells of `cell` world units), so a dense core keeps one grain's colour: light blue stays light blue and white stays white. `whiteVis` lifts white grains to whole (× whiteVis) whatever the density around them, for a few white among many; above ~1.3 with selGain 1.3 they bloom into a halo |
| `lineAlpha`, `boundaryGrains` | 1.1, 1800 | the boundary's brightness (scaled by its length, so a short edge does not bloom) and its grain count. Over a dense cloud use ~1.8 |
| `litDim`, `roleDim`, `thick`, `seed`, `ours`, `oursTone` | 0.35 (0.55 rare), 0.2, 0.16, 401, row 1 on d0 | the dimming of grains outside the cut in `{lit}`; the dimming of a `{dim}` role; the plane's thickness; the order seed; our grain (size 2.5; `oursTone: 'crowd'` keeps it light blue); |
| `readout` | `'count'` | what `api.value()` gives (see below) |
| `of` | | with no `src`: a **readout proxy**. `{ type: 'dk-scatter', name: 'w1', of: 'toy', readout: 'w1', pos, grains: 0 }` draws nothing and gives another scatter's number, so one form can feed several `<StageCount>`s |

Steps (merged like dk-hist: step k = steps 1..k, `key: null` drops one; 0 hidden; a step
back takes 0.35 s; an arrival or `c` replays from nothing):

| step key | what happens | busy |
|---|---|---|
| `n` (`'all'` or a number) | the grains gather out of a wide seeded cloud and fade in (about 1.5-4 s) | while they move |
| `tip: '<dk-hist name>'` | they gather from the hist's grains instead (its `{tip}` step), bowed toward the camera, sweeping left to right, keeping the hist's whiteness and fading to the step's colour. It waits while the hist is still to tip (`tipReady()`: a hist opened fresh on its tip step stands first), so the plot is seen before it pours. If the hist has already let its grains go (a slide opened on the tip step), each row starts where it would stand in the hist's `frame()` | ~3 s |
| `color` | `'none'` (all light blue), `'truth'` (class 1 white), `'kept'` (the kept side of the step's boundary white), `'sel'` | 0.8 s sweep |
| `box: [[x0, x1], [y0, y1]]` | a cut: display units, `null` = open (`[[null, 0.9542], [null, null]]` is IPχ² < 9; `[[1.386, null], [null, null]]` the perceptron's threshold) | 1.2 s |
| `line` | `[w1, w2, b]` on raw values, or the name of a `{ w, b }` in the source (with its `scaling`, for the ring's standardised line) | 1.2 s |
| `epoch: k`, `sweep: s` | the line at epoch k of the source's log; with `sweep`, the line runs from the previous epoch (or `from`, default 0) to k in s seconds on a log schedule, so the fast early epochs and the slow late ones both show. Every readout (`right`, `accuracy`, `kept` …, not only `w1 w2 b loss epoch`) follows the line as drawn, frame by frame (lab 4 slide 13: 150 → 151 → 172 → 185 of 200) | while sweeping |
| `bend: true` | the score's 0.5 contour; the current boundary's grains travel onto it (1.8 s) | |
| `show` | `'all'`, `'train'`, `'test'`, `'validation'` (rows by `splitRole`): new rows drop in (held-out points arrive after training) | |
| `dim: 'train'` | rows of that role (or list) dim to `roleDim` (0.2), so the rows arriving with them (`show: 'all'`) are the only bright ones: the test grains judged by the line. A list on a first step dims from the start: `{n: 'all', color: 'truth', line: 'line', show: 'all', dim: ['train', 'validation']}` leaves only the ring's 120 test rows bright (lab 4 slide 14: `accuracy:test` 53.3 %, `right:test` 64) | 0.8 s |
| `lit: true` | grains on the cut side stay lit, the rest dim to `litDim` (rare mode) | |
| `after` | seconds the step's motion, line and depth wait (lab 4's undo: the depth closes once the camera has turned off edge-on) | |
| `depth: 1` | the leak: every grain snaps (0.55 s) to z = its mass, the plane turns edge-on, its axes and numbers step back and the depth axis's come in | ~2 s |
| `undo: true` | the axis closes and the overlap returns (1.1 s); keeps `depth` in the merged state, so stepping back reopens it. With a boundary on the same step (`{undo: true, bend: true}`, T4 slide 14) the boundary waits until the axis has closed (`after` + 1 s) and draws on; no boundary is ever drawn in the plane while the depth stands open (lab 4 slides 15-16) | |
| `boundary: false` | hide the boundary but keep its cut for colours and readouts | |
| `dust`, `draw` | a boundary that goes with none after it (`{box: null}` with no line, `{line: null}`, `boundary: false`) breaks into dust where it stands, rising and spreading as it fades (1.6 s); one that comes with none before it (`{epoch: 1}` after that) draws on along its length (1.2 s) instead of gliding from the old one. `dust: false` / `draw: false` (step or object) fade instead. A step back is always a 0.35 s fade | 1.6 s / 1.2 s |

`api.value()` is `api.read(readout)`. Readouts, over every row in the state (drawn or
not; rows outside the range still count): `'count'` (grains landed, scaled to the
state's rows: 91 531 when landed), `'rows'`, `'kept'`, `'right'`, `'wrong'`, `'accuracy'`
(%), `'signal'`, `'signalKept'`, `'bkgKept'`, `'precision'` (%), and the line's `'w1'`,
`'w2'`, `'b'`, `'loss'`, `'epoch'` (these follow a sweep frame by frame). A `:role`
suffix counts one split role only: `'accuracy:test'`, `'right:train'`.
Also `api.values()`, `frame()` → `{ width, height, x(u), y(v), xRange, yRange, group }`,
`pointOf(row)`, `ours()`, `ready()`, `busy`.

Far from the camera, the form's labels fade out (4 to 6 plot sizes away) and its grains
too (8 to 12): a dense plot far off is otherwise a bright point, and fixed-size tick
numbers stay legible at any distance.

Lab 4 (`talks/2026_00_00_DataLab4`), the numbers each slide read off the form: 177 of
200 (threshold), w₁ 2.10 / w₂ 2.26 / b −4.31 (epoch 1000), 92.0 % test, ring line
65.3 %, ring network 95.0 % test, 91 531, 53 194 kept, rare 90 / 999 / 8.3 %. All match
the bake. The real scatter:

```json
{ "type": "dk-scatter", "name": "ev", "pos": [0, 0, 0], "grains": 95000, "src": "d0.f32",
  "word": "log IPχ²", "x": { "ticks": [-2, 0, 2, 4] },
  "y": { "raw": true, "ticks": [[0.2, "0.2"], [0.5, "0.5"], [1, "1"], [2, "2"], [5, "5"], [10, "10"], [20, "20 ps"]] },
  "depth": { "ticks": [1845, 1885], "size": 14 }, "lineAlpha": 1.8,
  "steps": [0, { "n": "all", "tip": "h" },
            { "tip": null, "box": [[null, 0.9542], [null, null]], "color": "kept" },
            { "box": null, "color": "truth" }, { "bend": true },
            { "bend": null, "depth": 1 }, { "undo": true }] }
```

The perceptron: `"src": "train-perceptron.json", "range": [[-2.5, 5.5], [-2.5, 5.5]],
"size": [6.5, 6.5]`, steps `{n:'all', color:'truth'}`, `{box:[[1.386,null],[null,null]]}`,
`{box:null, epoch:1}`, `{epoch:1000, sweep:6}`, `{epoch:null, sweep:null, line:'split',
show:'train'}`, `{show:'all', dim:'train'}`. Give the threshold as 1.386: the JSON's points are
rounded to 5 decimals, and the point that sets the bake's 1.38564707 rounds above it.
Budget: 91 531 + 1 800 boundary + ~4 000 axis grains ≈ 97 000 at tier 0 for the real
scatter; the rare set 100 000 + 1 800.

## Every form at a glance

| type | owner | required | `api.value()` | events | tier-0 grains (as the labs use it) |
|---|---|---|---|---|---|
| dk-hist | core | pos name grains | entries landed (animated), the window mean, or share / `{count: X}` | none (world-clock transitions) | 91 583 for record 401 at unit 1; a model toy 24 000 |
| dk-heap | core | pos name n grains | grains on the floor | none | n (91 583) |
| dk-glow | t1 | pos name grains | fronts sent | `eventLatch` (uT0, uHideT, uT2; fade 1.3 s) | 46 500 (every k-th detector grain) |
| dk-trigger | t1 | pos name grains | bytes the active gates pass (Π keep·shrink) | `eventLatch` (gate on/off times) | 33 000 |
| dk-lineup | t1 | pos name grains balls | TB the shown piles stand for | none | 91 400 |
| dk-ground | t1 | pos grains | its grain count | none | 14 000 |
| dk-spark | t2 | pos name grains | 0 | none | 221 |
| dk-vertex | t2 | pos name grains | the pair's mass once folded | none | 475 |
| dk-bell | t2 | pos name grains | count beyond the front | none | 300 000 (a whole slide) |
| dk-curve | t3 | pos name grains of | χ² of the curve as drawn, or a parameter | none | 3 000-12 000 |
| dk-landscape | t3 | pos name grains | the ball's x (or y, Δ, χ²) | none | bowl 60 000, slice 4 000, loss 40 000 |
| dk-scatter | t4 | pos name grains | `api.read(readout)` (count, kept, accuracy, w1 …) | none | real 95 000, rare 104 000, toys ~3 000 |
| dk-pipeline | t5 | pos name stages grains | sheet rows written, scaled to 91 583 | `eventLatch` (the run's start) | ball n + ~29 000 of its own |

No form is a stub any more (`DK_TYPES[type].stub` is false for all thirteen). Every form's
`assemble` calls `onDone`, and every form is `busy` while anything moves on its own clock,
so shots and recordings settle. The engine's per-slide cap at tier 0 is about 503 000
grains, and the dust takes 123 904 of it: the bell (300 000) or two full dk-hists plus a
pipeline ball (lab 5: 427 792) fill a slide. Forms on other stations still count, so a
deck that keeps many full plots alive spreads them over stations it does not show at once.
At lower tiers each form thins to `ctx.budget` (dk-hist raises `unit`, dk-heap drops rows,
dk-lineup coarsens spheres keeping their volume, the others thin evenly).

## Known limits (29 Oct 2026)

Seen only as still end states (shots open each slide on its own): live back-and-forth
stepping, arrivals in a real deck order, every motion (fills, leaps, the select sweep's
refills, the re-roll, gate bursts, the bell front, the curve's glide, the ball's roll, the
tip into the scatter, the leak's snap, the pipeline's run and run 2's hand-over), tiers
1-3, and `minPx`. Not seen at all: dk-hist `{shift}` (a tenth of a bin at 0.02 %),
`{rise}`, `{alarm: z}`, the `src` (binned counts) source, `oursFrom`'s glide,
`grains({last: true})` feeding a cold-opened `{tip}`, dk-heap ball (step 3), dk-trigger
`collapse`, dk-pipeline's third run. Seen as stills only (29 Oct, kit-hist): `order:
'file'` and its rows readout, `alarm: 'baked'`, the brighter band, per-step `ticks`,
`replay: false` as a step key (a still cannot tell a refill from a stand: lab 2 slides 24
and 28 photograph alike), dk-heap `oursFrom` (the end state only), dk-spark's colour
change and `follow`, dk-landscape's `band`, dims-1 `ticks`, `{ball}` and `readout:
'path'`, dk-curve `tone`. White reads light grey in dense columns at the default `selGain`
(raise it per plot). The series' mass range is 1 816-1 912 (`MASS`, 29 Oct); dk-scatter's
default depth range still says 1 810-1 920 (scatter.js, another lane's file). A dk-curve or
dk-landscape added to a far dk-hist's group does not fade with it.

## Writing a dk form

- A module exports `TYPE`, `FIELDS`, `OWNER`, `files(o)` (the data files an object loads,
  for check.mjs) and `install(stage, kit)`, which calls
  `stage.registerBuilder(TYPE, (o, ctx) => …, { fields: FIELDS })`. index.js lists every
  module in `MODULES`.
- A kit file never imports `slidev-addon-stage`. The engine arrives as `stage`
  (`registerBuilder`, `grainMaterial`, `grainGeometry`, `grainPoints`, `GRAIN_GLSL`,
  `stepper`, `onStep`, `setStepLater`, `eventLatch`, `twinkleUniform`, `makeLabel` …).
  A kit file may import `three`.
- `kit` gives you:
  - `style`, the constants above;
  - `rng`: `mulberry32`, `gauss`, `poisson`, `shuffle`, `order(n, seed, ours)`;
  - `sampler(f)` / `samplerOn(f, lo, hi)`, inverse-CDF sampling of a density (MasterTalk's funnel.js);
  - `label.make(text, { px, color, align, hang })`, a fixed-size label (≥ 18 px), plus
    `label.shade(labels, show)` each frame and `label.niceTicks`. Always pass `color`
    from `roles(ctx.palette)`: the fallback is classic's fg literal;
  - `loadJSON` / `loadF32` / `loadTable` / `loadD0(ctx)`, once-per-page fetches from `/dk/`;
  - `register(name, { type, api })` / `form(name)`, to find another dk form by name;
  - `morph`: `createMorph(stage, n, { crowd, sel, seed, uniforms })`, the grain engine
    dk-hist and dk-heap draw with. A state is `{ pos, vis, white }` per grain, and
    `go(t, state, plan)` moves every grain from where it is now (mid-flight too) on the
    world clock, with motions glide, drop, leap, dust and annihilate.
    `staticGrains(stage, n, { color, alpha, share })` draws lines and marks;
    `toneGrains(stage, n, { crowd, sel, axis, alpha, size, share })` the same with a tone
    (`tone[i]`: −1 axis, 0..1 crowd → selected) and an alpha share (`vis[i]`) per grain. Uniforms a
    form may drive: `uAlpha`, `uSelGain` (white grains' gain), `uGlowTint` (landing glow
    toward white, 0..1), `uShow` (a plain multiplier: distance fades use it), `uBlur`,
    `uSpread`, `uSpin`; per grain `G` (gone time: `m.G[i]`, then `m.gone()`), `Z` (size).
- The contract: `assemble` always calls `onDone`; `busy` is true while anything moves on its
  own clock; animate on the world clock `t` only; use `eventLatch` for event uniforms;
  seed every placement; take colours from `roles(ctx.palette)` only; stay within
  `ctx.budget`; return a `frameScale` uniform at build (the engine reads it once); dispose
  what you made and `kit.unregister(name)`. `update(t, camPos)` receives the camera's
  world position, for distance fades.
- Data: a new bake output gets a script in `bake/` (deterministic, `--check`, an entry
  through `common.emit` with `talks`), then `sync.py` carries it to the talks that list it.
- Check: `node components/data-kit/check.mjs <talk>` (fields, numeric grains, data files
  against the manifest and the bake copy, `{sort}`, `over` and dk-heap `oursFrom` names,
  `alarm: 'baked'` without `model.rolls`, step `ticks` without values; and warnings for a
  dk-glow without the lhcb plugin or a matching detector, a dk-ground without
  `"enterable": true`, `order` other than `'file'` or on a non-rows source, a dims-2
  `band`, a dk-vertex given names, and a caption or tick text naming the decay or its
  quantities: `named-decay`).
