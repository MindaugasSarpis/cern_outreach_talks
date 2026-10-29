# Integration: the kit after every lane (29 Oct 2026)

Label `integrate`. Every request in `notes/requests-*.md`, applied or declined, with the
reason. Then the stubs, the files touched, the checks and what was not verified.

## Requests

### t1 (requests-t1.md)

| # | request | outcome |
|---|---|---|
| 1 | check.mjs: warn on a dk-glow without `plugins: [lhcb]`, an `of` naming no detector, no detector with the same `src` | **applied** (codes `glow-no-plugin`, `glow-of`, `glow-src`) |
| 2 | check.mjs: suggest `"enterable": true` on a dk-ground | **applied** (`ground-enterable`); lab 2's floor now carries it |
| 3 | README: `lhc-collision` in `--types`, palette colours for it (gold defaults) | **applied** (README, Install) |
| 4 | lift Crossing.vue + slideNav.js (and the §4 components row: Clock, WorldLabel) into the kit | **declined for now.** A .vue in the root `components/` is auto-registered in every talk of the repo (the symlink), so a name clash or an icon-prefix name (`LabCrossing` → the `la` set) breaks other talks' builds; Crossing needs `whenEntered` from `slidev-addon-stage`, which a kit file cannot import (it would have to come through the installed kit's `stage`); and no lab exercises a lifted copy. Do it with T1's first deck, with a `Dk`-free name checked against the icon sets. Lab 1's stand-in works. README says so |
| 5 | style.js: a palette detector preset | **applied**: `detectorParts(p)` in style.js and the literal in README (Install) |
| 6 | README t1 sections (buffer shell, knot, minPx, example, glow colour note) | **applied** |

### t2 (requests-t2.md)

| # | request | outcome |
|---|---|---|
| 1 | hist.js re-roll clock | **applied** as a general sweep: `{reroll: {every, rolls}}` = `{resample: [1, rolls], every}`; also `{select: [a, b], every}` (t5-2). World clock, busy until the last index, a step back or an inherited range stands at b at once. Lab 2 slide 20 now uses it and its `<script setup>` chain is gone; it settles (27.6 engine-s) where the old endless loop never did |
| 2 | heap.js merged claims `claim(gone, who)` / `release(who)` | **applied**: per-claimant arrays, a row goes at the earliest time; dk-hist claims under its name. vertex.js's workaround still runs and is now harmless; t2 may simplify it |
| 3 | hist `oursFrom` | **applied** (object field and step key): our grain starts at the named form's `api.ours()` and glides 0.6 s into its slot. Lab 2 `h2` sort step carries `oursFrom: 'v2'`; slide 15's end state is unchanged (seen). The motion itself is not seen |
| 4 | lighter whiskers | superseded by 7 |
| 5 | baked rolls `model.rolls` | **applied**: `{resample: k}` (k ≥ 1) shows `rolls[k − 1]` of the file; `files()` lists it, so check.mjs checks it. Lab 2 `roll` uses `toys.json` `flat.rolls` |
| 6 | README `{n: 0}` | **applied** |
| 7 | `{errors}` in the series look | **applied**: whiskers in `P.axis` at alpha 0.9, size 0.75 × GRAIN (the axis line's weight), caps of 3; `errors: 'band'` draws only the ±√N edges as two dim lines across all bins. The first try, alpha 0.5 / size 0.6 as asked, was invisible on black (lab 2 slide 20 shot); 0.9 / 0.75 reads as two faint lines at full size. Inside a dense column a whisker's lower half is hidden, so on lab 2 slide 4 the whiskers barely show at sheet size: T2 should use `'band'` |
| 8 | a y range not starting at zero | **declined**: a grain column is its count; starting the axis above zero hides grains (an entry not drawn) and breaks one grain = one entry. The band (7) plus a close camera on the tops does the job (slide 20) |
| 9 | MASS lo 1816, hi 1912 | **declined as a series constant**: changing `MASS` moves every D⁰ plot of all five talks and is a bible §3 decision. The edge bins are real data (1 810-1 812 holds 3 entries, 1 812-1 814 holds 29; seen as the stray-looking grains left of the first full column on lab 2 slide 15). A deck can set `lo: 1816, hi: 1912`; README "Known limits" says so. Owner's call |
| 10 | one mass unit | **applied** in lab 2's floor station (`m(K⁻π⁺) MeV/c²`); hist.js has no default caption. Lab 3, lab 4 and lab 5 mass captions still say `m(K⁻π⁺) MeV` (their lanes' decks; the T3/T4/T5 decks should write `MeV/c²` to match the nums) |
| 11 | label.js default colour literal; Math.random stepper names | hist.js **applied** (`dk-hist-<pos>-<key>`); scatter.js was already fixed by t4 (no Math.random in the kit now). label.js **declined**: every caller passes a palette role (checked with grep); the literal is only a fallback, and README now says to always pass `color` |
| 12 | README t2 sections | **applied** (spark `halo.ref`, vertex `namePx`/`trailAlpha`/`landSize`, bell `size`/`alphaGain`/`selGain`/`litSize`, zoom whitening) |

### t3 (requests-t3.md)

| # | request | outcome |
|---|---|---|
| 1 | bake zoom grid | withdrawn by t3 |
| 2 | keep `plot` inside `g` and `frame()` live | **kept** (no change) |
| 3 | `frame()` target scale | **declined**: dk-curve eases on its own; not needed |
| 4 | dk-spark on the weights slides | done by t3 in lab 3 |
| 5 | deterministic stepper name | **applied** (see t2-11) |
| 6 | white tau columns render grey | **applied as an option, not a default**: new `selGain` (object or step). An automatic lift (selGain = 0.7 / alpha, up to 2) was built and shot: it bloomed the dense, narrow white tau columns of lab 2 slides 10-11 into a white halo (a solid shape), so it was reverted. T3 sets `selGain` 1.5-1.8 on its tau plot and checks the picture |
| 7 | `fitRange` | **applied** (object field and step key). Lab 3 tau step 4 carries `fitRange: [0.5, 5]`: on slide 6 the two bins below 0.5 ps are now light blue, the fitted ones white (seen) |
| 8 | subtract ghost | **declined for now**: needs a per-grain alpha floor in the morph's dust/annihilate motions (today a removed grain ends at vis 0); a ghost would also be a second population at a third brightness on a busy slide. The live survivor count carries the still |
| 9 | our grain a few slots up its column | **declined**: it would move row 1 out of its fill order (the first to land is the lowest), which T2's "first to land" relies on. A smaller `halo.r` on that slide clears the tick |
| 10 | T4 loss grid centred on the minimum | for the T4 author / bake (train.py); not a kit code change. Recorded |

### t4 (requests-t4.md)

| # | request | outcome |
|---|---|---|
| 1 | hist last layout after `{tip}` | **applied**: `api.grains({ last: true })`; scatter.js's `tipSource` now tries it before its frame fallback, so a cold-opened tip starts from the hist's own whitening and jitter. Not seen as a picture (lab 4 slide 6 reaches the tip in order) |
| 2 | distance fades for labels and grains | **applied** to dk-hist (labels 4R-6R, grains, axis and marks 8R-12R; `fade: false` keeps them) and dk-heap (8-12 pile sizes). dk-curve / dk-landscape grains added to a far hist do not fade with it (README known limit) |
| 3 | keep `stateAt` exported | kept |
| 4 | `uShow` a plain multiplier | kept; dk-hist and dk-heap now drive it too (each form owns its own morph, so no conflict) |
| 5 | bible / T4 author notes | not code; carried in notes/t4.md |

### t5 (requests-t5.md)

| # | request | outcome |
|---|---|---|
| 1 | `bake/code.py` → `code-lines.json` + manifest + sync | **applied**: the lab script adopted as `bake/code.py` (course file found through `common.course_file`; `--check` fails on a changed sha256). Its output equals lab 5's copy byte for byte in content |
| 2 | `{select}` sweep on the world clock | **applied** (`{select: [a, b], every}`), see t2-1. Lab 2 slide 8 sweeps 0-60 at 0.15 s and settles at 14.3 engine-s |
| 3 | rescale per selection | **applied**: step key `rescale: true` (the counted set's tallest column). Lab 5's 120 explicit `max` steps still work; T5 can replace them with `{select: [0, 119], every: 0.15, rescale: true}` |
| 4 | peaks ticks | superseded by 6 (lab 5 no longer uses `peaks`); README now steers away from `peaks` |
| 5 | `replay: false` | **applied** (object field): an arrival or `c` shows the step's state in 0.35 s. Not seen |
| 6 | `d0-peaks.f32` bake | **applied** as `bake/peaks.py` (reads d0-select.json; `--check`). Equal to lab 5's copy byte for byte |
| 7 | `over`: run 2 takes over run 1 grain by grain | **applied**: run 2 calls run 1's new `api.cede(goneByRow)`, which sets each grain's gone time (morph `aGone`) to its twin's landing time; a step back or hide gives them back. Lab 5 `h2` has `over: 'h1'` and `h1` no longer ghosts. Slide 5 (frozen 4.2 s into run 2) shows light blue rising from the bottom of each white column with no change of shape; slide 6 is wholly light blue (seen). The swap is instant per grain (no 0.3 s fade): the landing grain's glow covers it |
| 8a | clamp grains to [lo, hi] | **declined**: positions are inside their bins by construction; the grains left of the first full column are the real 3 + 29 entries of 1 810-1 814 (see t2-9) and depth jitter seen in perspective |
| 8b | landing front glows white | **applied**: morph `uGlowTint` (default 1, unchanged for other forms); dk-hist sets 0.3 (`glowTint`), so a landing glow stays near the plot's tone. Not seen in motion |
| 9 | tick labels bloom at close range | **declined** (engine): the post bloom is the engine's; a kit sprite cannot opt out of it. For the engine owner: a bloom layer mask for label sprites |

## Stubs

None remain. All thirteen modules are real builders (`DK_TYPES[t].stub === false`);
`kit.stubForm` stays in index.js as an API for a future form.

## Files touched by integrate

- `hist.js`: sweeps (`select`/`resample` ranges, `reroll`), `rescale`, `model.rolls`,
  `fitRange`, `selGain`, `glowTint`, `over` + `api.cede`, `oursFrom`, `replay`,
  `grains({last})`, dim whiskers and `errors: 'band'`, distance fades, deterministic
  stepper name, claims under its name, a fuller `dispose()`.
- `morph.js`: `uGlowTint` uniform. `heap.js`: merged claims, distance fade, dispose.
- `scatter.js` (t4's): `tipSource` tries `grains({ last: true })`.
- `style.js`: `detectorParts`. `check.mjs`: glow/ground warnings, `over` names.
- `bake/code.py`, `bake/peaks.py` (new); `data/code-lines.json`, `data/d0-peaks.f32`,
  `data/manifest.json` (two entries).
- `README.md` (the complete API), `notes/integration.md`, `notes/prototypes.md`.
- Labs (scratch): lab 2 `space.json` (floor caption, `enterable`, slide 8 sweep, `roll`
  baked rolls + band + reroll, `h2` oursFrom) and `deck.md` (slide 8 and 20 titles, slide 20's
  script removed); lab 3 `space.json` (tau `fitRange`) and `deck.md` (slide 6 title); lab 5
  `space.json` (`h2.over`, `h1` step 2 empty) and `deck.md` (slides 5-6 titles and note);
  every lab's `public/dk/` resynced (`sync.py --all`).

## Checks

- `node components/data-kit/check.mjs talks/2026_00_00_DataLab{1..5}`: all ok, 0 errors,
  0 warnings.
- `pnpm talk check datalab{1..5}`: lockfile, videos:check, stage:check, build all ok (each
  build's one warning line is Vite's "outDir is not inside project root" notice; no
  data-kit file appears in unplugin-vue-components' naming-conflict list).
- Bakes: `d0.py`, `toys.py`, `train.py`, `portal.py`, `code.py`, `peaks.py` all `--check` clean.
- Shots: every slide of every lab, in runs of at most 6 (one run of 8, lab 2 slides 4-11,
  by mistake), all settled, no page errors, console warnings or HTTP errors. Sheets:
  `talks/2026_00_00_DataLab*/shots/sheet-int-*.png`.

## Not verified

Motion of anything (shots are end states): the sweeps' refills, the re-roll cadence, the
`over` hand-over in motion beyond the one frozen frame, `oursFrom`'s glide, `replay:
false`, `grains({last})` on a cold tip, the glow tint on a long fill, distance fades in a
flight between stations, live back-and-forth stepping, tiers 1-3.
