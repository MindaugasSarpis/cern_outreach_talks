# kit-hist: what the five outlines needed from the kit's core forms (29 Oct 2026)

Label `kit-hist`. Lane files: hist.js, heap.js, curve.js, landscape.js, label.js, spark.js,
vertex.js, morph.js, style.js, index.js, check.mjs, README.md. Each change below names the
outline item it answers, where it landed and the lab slide that shows it. README has the
full API of every changed type.

## Changes

| need (outline) | done | file | lab slide |
|---|---|---|---|
| Mass axis 1 816-1 912 MeV in every talk (owner, 29 Oct) | `MASS = { scale: 0.25, lo: 1816, hi: 1912, bin: 2 }`: a dk-hist on mass without `lo`/`hi` draws 48 bins, ticks 1 820 … 1 900, no edge dips. Labs that give `lo: 1810, hi: 1920` explicitly keep it (scratch) | style.js | L2 s23, s24, s28 (hf, no range given); L4 s6 (the default-range hist that tips into the scatter) |
| T2 Open 2: `order: 'file'` for a rows source (slides 12, 14, 16) | grains fill in the file's order, and `n` counts rows of the file read (the grains of rows < n that `where`/`split` keep). Default readout `'rows'`: rows read as the grains land, ending at exactly n. `{n: 186}` with the three bands shows 139 grains and reads 186 | hist.js | L2 s23 (186), s22 (falling-big 3 500) |
| T2 Open 3: `model.rolls` reading `falling.rolls[r].counts`; `alarm: 'baked'` | a roll may be an array or an object with `counts`; `model.rolls.expected` reads the expectation from the same file (`falling.expected140`); `{alarm: 'baked'}` lights exactly the roll's own alarm bins (`alarmBins`, `alarmBin`, `alarmAt`, or `maxBin` when `alarm`); `values().alarms`, `.roll` | hist.js | L2 s21 (roll 2, bin 8 white, as `falling.alarmBins[1]`) |
| T2 Open 3, T3 cover: `replay: false` as a step key | `standsAt(k)`: the object field or the step's merged state; from hidden (arrival, `c`, a jump from 0, fresh page) the step stands in 0.35 s; `replay: null` drops it | hist.js | L2 s24 (and s28, the control) |
| T3 slides 2, 8: per-step world ticks | step key `ticks: [...]` replaces the object's ticks for that step (null restores, [] none), 0.5 s crossfade; entries `{ v, text, tone, y, label, align }`; a tall tick is a dotted line in front of the columns with its number above | hist.js, morph.js (`toneGrains`) | L2 s26 (dim 1 864.84 and white 1 864.47 at the summit) |
| Owner's rollout condition: T2's √N band brighter, legible in dense columns | `errors: 'band'`: edges in the tick numbers' near-white (`tone: 'tick'`), alpha 1, size 1, and a 0.3 fill between; bins whose band is under half a grain draw none (the near-empty edge bins made a bright smear on the axis) | hist.js | L2 s25 (dense D⁰ flat bins, close), s20 (the re-roll toy) |
| T2 slide 11: a dk-curve over a re-rolling plot | dk-hist `api.standing()`; dk-curve draws on once its hist stands (a sweep stands once its first state does) instead of waiting for `busy` (up to 12 s, past most of 24 s of rolls) | hist.js, curve.js | L2 s21 |
| T2 slide 11: "a light-blue dk-curve of the expected count" | dk-curve `tone: 'crowd'` | curve.js | L2 s21 |
| T2 slide 12: a window only to whiten a bin | `meanTick: false` (object or step) | hist.js | L2 s22 |
| T3 slide 7: a band on a dims-1 slice (PDG's ± 0.04), `slice.zmax 20`, ticks on dims 1, ball at the bottom | dk-landscape `band: { x, tone, alpha, fill, to, grains }` (edges as lines, fill between, from Δ = 0 up to the wall); dims-1 `ticks` (value, pair or `{ v, text, tone }`) with marks; step key `ball: true` (the ball stands at the minimum, no roll) | landscape.js | L3 s10 |
| T4 Open 1: the bake's `lossProfile` with a profiled path | the path keeps its third column; `readout: 'path'` reads it under the ball (0.693 → 0.162); `readout: 'chi2'` reads the grid (the bake's own note) | landscape.js | L3 s11 |
| T2 → T3: dk-spark core colour change on a step | step keys `colorAfter` (0) and `colorTime` (0.8 s); `color: 'follow'` takes the followed grain's whiteness (dk-hist `api.whiteOf(row)`); `ringColor` (object or step) separates the ring's colour from the core's (default: the core's, as before) | spark.js, hist.js | L3 s12 (white → light blue 0.8 s in), s13 (follow, white ring) |
| Owner, 29 Oct: dk-vertex draws no names; still two tracks from one point | the K⁻/π⁺ labels are gone (`names`, `namePx`, `tracks[].name` ignored; check.mjs warns); each strand's root is brighter (`root` 0.8: alpha and size), so the shared origin reads | vertex.js | L2 s13 |
| T1 Open: our grain's hand-over from dk-trigger's fold to the heap's summit | dk-heap `oursFrom: '<form>'` and `oursGlide` (2.4 s): in the rain our grain stands at that form's `api.ours()` from the first frame and glides down, landing last on the summit; dk-heap `api.ours()` (live, for a dk-spark `on` the heap) | heap.js | L2 s27 (from a dk-spark's point; the end state only) |
| Owner, 29 Oct: nothing names the decay on screen | check.mjs `named-decay` warning on a `word` or tick text with K⁻, π⁺, D⁰, kaon, pion, IPχ²; lab captions now `mass MeV/c²` (labs 2-5) | check.mjs; lab space.json | all labs: 0 `named-decay` |
| check.mjs for the new keys | errors: `alarm-baked` (no `model.rolls`), `bad-ticks`, `unknown-ours-from`; warnings: `hist-order`, `band-dims`, `vertex-names`, `replay-key`, `named-decay` | check.mjs | all labs ok |

## Lab slides added

- Lab 2 (stations `look` [80, 0, 60], `file` [160, 0, 0], `rain` [160, 0, 80]; `h` steps 9 and
  10; `roll` lost its `errors` override so it shows the new default): slides 21 (falling
  roll, baked alarm, light-blue curve), 22 (falling-big in file order), 23 (186 rows), 24
  (`replay: false` step), 25 (band on dense data), 26 (per-step ticks), 27 (heap `oursFrom`),
  28 (control for 24).
- Lab 3 (`slice` gained `s2`; station `lossP` [280, 0, 0]; `ours` steps 2-4): slides 10 (band
  slice), 11 (lossProfile, `readout: 'path'`), 12 (spark white → light blue), 13 (`follow`).

## Checks (29 Oct, after the last code change)

- `node components/data-kit/check.mjs talks/2026_00_00_DataLab{1..5}`: all ok, 0 errors;
  lab 4 keeps one `stale-copy` warning (another lane's re-bake, not synced there).
- `pnpm talk check datalab{1..5}`: lockfile, stage:check, build ok.
- Shots of every slide of every lab (L1 1-13, L2 1-28, L3 1-13, L4 1-18, L5 1-10): all
  settled, no page errors, console warnings or HTTP errors.

## Not verified

- Motion: shots photograph settled end states. `replay: false` cannot be told from a refill
  in a still (lab 2 slides 24 and 28 come out identical, as both end states are the full
  plot); the ticks' crossfade, the band's fade-in, the spark's colour timing against the
  `{weights}` sweep, dk-heap `oursFrom`'s glide, the rows readout counting up, the curve's
  draw-on during a 24 s re-roll.
- `alarm: 'baked'` through a whole `reroll` sweep (the lab shows one roll, roll 2).
- The new 1 816-1 912 range moves every default-range D⁰ plot by 1 MeV/c² (0.25 units) and
  narrows it by 3.5 units: the talk decks' camera poses were written against labs that gave
  1 810-1 920 or 1 816-1 912 explicitly; check each pose once the decks drop their own range.

## Open

- dk-scatter's default `depth.range` is still [1810, 1920] (scatter.js:37, another lane's
  file): it should read `MASS.lo`/`MASS.hi` to match the series range.
- T5 asks dk-pipeline for a `replay: false` like dk-hist's (pipeline.js, another lane).
- T4 asks dk-spark to follow a dk-scatter's grain: dk-scatter needs `api.ours()` or
  `api.pointOf(row)` (scatter.js, another lane); dk-spark already follows any form that
  has one.
- The talk decks: T2 and T3 should drop `lo`/`hi` from their mass hists (the style constant
  is the range now), write captions as `mass MeV/c²`, and remove any `errors` look override
  copied from lab 2's old `roll` object (`{ alpha: 1.4, size: 1 }`), which would make the
  new band glare.
