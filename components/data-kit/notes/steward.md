# Kit steward pass, 29 Oct 2026

The five decks' `notes/kit-requests.md` and the series check's findings that need the kit, each
applied or declined, and what each deck changes to use it. The keys are in README.md, "Added
29 Oct". Labs: what was seen in stills is listed there; the rest is built and checked, not seen.
Checks after the pass: `pnpm talk check datalab1..5` ok; `check.mjs` ok on all five labs (lab 4
keeps its old `named-decay` warning on "log IPχ²"); `bake/d0.py --check`: 14 files match.

## Four defaults changed (every deck sees them without editing)

| change | why | deck change |
|---|---|---|
| `LABEL` 24 → 36 px (`minPx` 36, `captionPx` 36) | the house floor is 18 px on the 980 canvas = 35.3 on a 1080 frame; 24 drew 12 px ticks (T2 request, T3 request 9, series check "tickPx") | T3: delete every `"tickPx": 36` (h, bowl, s1, s2, tau). T4: delete `"tickPx": 36` on h. check.mjs now warns `tick-px`. Wide shots (dist ≳ 30) with ticks every 20 MeV/c²: give `ticks` every 40 if the numbers touch (lab 5 slide 4 nearly does). Retake shots: every tick and caption is 1.5 × larger |
| dk-spark ring white by default | bible §3: the ring stays white, only the core changes (series check, T4/12; T5's `s` has the same light-blue ring) | none for T4/T5 (the fix lands by itself). A deck that wants the old ring: `ringColor: 'follow'`. T3's explicit `ringColor: 'sel'` can stay or go |
| dk-glow sparkle light blue | T1 request 5: white means "ours / kept" | none; `sparkle: 'sel'` restores white |
| dk-scatter depth range = `MASS` (1 816-1 912), rows outside fade out, ticks centred, `word` | T4 requests 2, 6, 12; series check T4/12 | T4 `ev.depth`: `{ "ticks": [1845, 1885], "size": 14, "word": "mass MeV/c²" }` (drop the 5-MeV-low positions and the 1 920 text tick). `size: 14` is the depth's world extent, not a label size: the check's "under the 18 px floor" read is a misreading, nothing to change there |

## Data1Trigger

1. dk-heap `oursFrom` a fixed point: **applied**, `oursFrom: { "at": [x, y, z] }` (station frame; `"world": true` for world). Deck: replace `"oursFrom": "fp"` with the fold point, drop the invisible `fp` spark. Lab 2 slide 27.
2. Clock.vue / Crossing.vue in the kit: **declined for now**. A kit file cannot import `slidev-addon-stage` (it does not resolve from the root `components/`), and both need the stage bus. Home: the toolkit (a `<StageCrossing>` / clock in slidev-addon-stage), or lhc-opening with a toolkit release. T1's and T5's talk-owned copies stand; show `25` ns alone.
3. `lhc-collision` on the step bus: **declined, not kit** (`components/lhc-opening`, another lane). Route to the main loop with T5 request 2.
4. dk-heap `value()` one over `n`: **applied** (the glided grain was counted in `base` and by its arrival). Deck: `<StageCount for="heap" :to="91583">` can follow the form again; drop the own-clock count.
5. dk-glow sparkle colour: **applied** (default changed, above).
6. dk-lineup `wait` per step: **applied**, `"wait": { "3": 2.4, "5": 0 }` (`default` for other steps). Deck: the day's pile `wait: { "<slide 6 step>": 3.8, "<slide 12 step>": 0 }`; slide 11 need not pre-set `tb: 5`. Lab 1 slide 13.
7. dk-trigger spray and staggered burst: **applied**, `spray` (units, e.g. 0.8) and `burstSpread` (s, e.g. 0.4). Deck: set both on `trg`; retake slides 8 and 10 and recheck slide 10's luma spike. Lab 1 slide 4 (spray seen).
8. dk-spark ring gather: **applied**, `haloIn` (s) and `haloGather: true`, object or step. Deck: `s1` on slides 1 and 13: `"haloIn": 0.6, "haloGather": true`. Not seen (motion).
9. dk-ground floor that reads close: **applied**, `alpha` as a list by step (`[0, 1, 1, 2.4]`). Deck: name the floor `g2` steps so slide 13 has its own step with a higher alpha and slide 14 keeps T2's. Not seen.
10-14. Clip blink, dust arrival, manifest fade-out, per-click camera keys, recorder frame 0: **declined, toolkit** (slidev-addon-videos, slidev-videos, slidev-addon-stage, the recorder).

## Data2Peak

- dk-hist `reroll` end: **applied**, `reroll: { every, rolls, end: 3 }` (also a step's `end` beside `[a, b]`). Deck: slide 11 `reroll: { "every": 2, "rolls": 20, "end": 3 }`; slide 12 then opens on its last frame. Lab 2 slide 21.
- Bake sets: **applied** (d0.py; `--check` passes). Deck: `m6u` `"src": "d0-flat.json", "sets": ["band.hi.set"]`, `m6d` `"band.lo.set"`, the mean `"band.set"`; `b5f` `"src": "d0-significance.json", "sets": ["staysAbove5From.set"]` (5.23607). Run `bake/sync.py --to talks/2026_00_00_Data2Peak`. Lab 2 slide 25 (the hi edge).
- Tick numbers ≥ 20 px: **applied** as LABEL 36 (above). The shots report measuring world sprites: **declined, toolkit**.
- `alarm: 'baked'` mark: **applied**, `alarmMark: true` (object or step): a white mark under each lit bin. Deck: `look`/slide 11's hist. Lab 2 slide 21.
- Engine: a station on a timed path assembles at the last key: **declined, toolkit** (space.js). Keep the station offset.
- dk-vertex durations: **applied** as object fields `decayTime`, `holdTime`, `foldTime` (step keys declined: one decay a slide). Deck: slide 3 can drop the `rate` speed-up and set the three times.
- dk-hist landing-glow gain, `curve` as a step key: **applied**, `glow` (object or step, 0..1) and step `curve`. Deck: slide 12 `grow` step 2 and slide 14 `hf` step 2 `"glow": 0.3`; `glowTint: 0` may stay.
- Engine first frame at ambient 1: **declined, toolkit**.
- dk-curve overshoot on a set change: **applied** (a step that changes the set takes the hist's new scale at once). Deck: drop `after: 0.8` on `bkf`/`b5f` step 2 if the shot shows no clipping.
- One dark frame as a clip leaves as dust: **declined, toolkit**.

## Data3Fit

1. `{shift}` that reads: **applied**, `shiftFlash` (default 1: grains that change bin start white and ease back over the 1.6 s move). Deck: nothing; `shiftFlash: 0` turns it off. Not seen.
2. dk-curve `alpha`/`thick` per step: **applied**. Deck: slide 9 `fit` step `"thick": 0.008, "alpha": 0.6` (tune on the shot).
3. readout `'window'`: **applied** (white grains landed). Deck: the counter can be "signal" with `"readout": "window"`.
4. Our grain clear of the axis: **applied**, `oursSlot: k` (object or step) on the dk-hist. Deck: `h` `"oursSlot": 3`.
5. `{subtract}` that shows in a still: **applied**, `ghost` (0..1, a step key with `{subtract}`): the unpaired sideband grains stay faint where they stood (the paired ones still annihilate). Deck: slide 11 `"ghost": 0.15`. Not seen; on a `replay: false` arrival there is no ghost (the sidebands never stood).
6. Pull-row guides: **applied**, `pull: { guides: [-2, 2] }`. Deck: on `fit`; drop the stand-in `ticks` step. Lab 3 slide 2.
7. dims-1 `yticks`: **applied**. Deck: `s1`/`s2` `"yticks": [1, 4, 9, 16]`. Lab 3 slide 10.
8. dims-2 captions: **applied**, `words: { x, y, z }`. Deck: `bowl` `"words": { "x": "μ MeV/c²", "y": "width MeV/c²", "z": "Δχ²" }`; the width ticks can come back. Lab 3 slide 4.
9. LABEL 36: **applied** (above): delete the `tickPx` overrides.
10. dk-curve `replay: false`: **applied** (object or step). Deck: `fit` (and the weights slide's curve) `"replay": false` on the steps that return to a standing plot.
11. A hidden plot's frame: **applied** (computed at load for the step wanted, or step 1). Deck: `h` and `fit` need not stand off-screen at the mass station while the camera is elsewhere (slides 7-8, 10-12); keep them until a shot confirms.
12. `meanTick` tone/height and a `gap` bracket: **declined**. A bracket is a drawn annotation (bible: no boxes or arrows), and the deck's per-step `ticks` already carry both marks.
13. A camera move on a click: **declined, toolkit**.
14, 15, 17. Recorder slide 1, the web encode's GOP, a clip's last frame on a DOM cut: **declined, toolkit**.
16. Landing-glow strength: **applied** (`glow`). Deck: slide 12's arrival `"glow": 0.3`.

## Data4Learn

1. dk-curve `replay: false`: **applied**. Deck: the cover's curve `"replay": false`, drop `draw: 0.1`.
2. Depth default range: **applied** (above).
3. Ball at the path's start: **applied**, `ball: 'start'` (step), `readout: 'path'` reads it. Deck: the outline's slides 7-8 can split again: `loss` steps `[0, { "ball": "start" }, { "roll": true }]` (on `lossProfile` it reads 0.693; on `lossGrid` at the fitted b it reads that grid's value, 2.17). Lab 3 slide 14.
4. Clip a boundary to the data: **not applied** (open). The boundary is one static grain chain; clipping it needs per-grain visibility in morph's static set. Deck keeps the y range at the data's floor.
5. dims-2 edge captions: **applied**, `words: { x: "w₁", y: "w₂" }`. Deck: drop the two built-in `label` objects at the valley. Lab 3 slide 14.
6. Depth caption, centred ticks: **applied** (above).
7. Ring the rows a readout counts: **declined for now**: the ring is the series' marker for our grain alone; a second ringed set needs the owner's word. The deck says the 4 errors.
8. Gather length: **applied**, `gather` (s, object or step). Deck: the valley can gather on its own slide again with `"gather": 1`.
9. A drop with no landing glow: **applied**, `glow: false` on the step. Deck: slide 8's `show` step `"glow": false`, drop `gather: true`.
10. The dissolving boundary: **applied**, `dustTime`, `dustHold`, `dustAlpha`. Deck: slide 5 `"dustTime": 1.2, "dustHold": 0.4, "dustAlpha": 1.5` (tune on the take).
11. Gate ring before it fires: **applied**, `idle` (0.25). Deck: `trg` `"idle": 0.6` and the ring back to 600 grains. Lab 4 slide 17 (faint at 0.6 with 600 grains: try 0.8).
12. Depth axis timed with the camera: **applied** (the depth's line, ticks and caption show only side on).
13. A collapse that reads: **applied**, `collapseTime` (2.2 s) and `ball.gain` (1). Deck: `trg` `"collapseTime": 1.5`, `"ball": { …, "gain": 1.4 }`. Not seen.
- Series `.nums` at 190 px: **applied** as `nums.css` (below).
- Toolkit: the recorder's boot veil: **declined, toolkit**.

## Data5Open

1. Crossing component: **declined for now** (T1 request 2).
2. lhc-collision and the budget: **declined, not kit** (T1 request 3).
3. dk-pipeline `api.ours()`: **applied**. Deck: slide 6/7 `s` `{ "on": "pipe" }` instead of the hand-placed `at`. Lab 5 slide 3.
4. Our grain rising out of the heap: **applied** in dk-spark: a step `{ "from": "heap", "at": [x, y, z], "glide": 2.5 }` lifts our row out of the pile (the heap gives it up through `claim`; a step back returns it). Deck: `s2` on slide 14. Not seen.
5. A camera cue on a step: **declined, toolkit** (answered in the deck by the split).
6. The lint's cover TEXT: **not kit** (scripts/talk_lint.py, main loop).
7. A versions stage and a pinned third run: **declined**, open for the owner: it needs a committed lockfile for the bakes, a `--check` in a second environment, and a filed fact with both digests before a stage may draw it.
8. Per-stage alpha: **applied**, `stageAlpha: { "<step>": { "<stage, 1-based>": a } }`. Deck: `"stageAlpha": { "5": { "2": 0.5, "4": 0.5 } }` for slide 9 (pipe 5). Lab 5 slide 4.
9. The ring per step: **applied**, step `halo: { r, alpha }`, and dk-hist `oursSlot` lifts the grain itself off the axis. Deck: `h0`/`h1` `"oursSlot": 3`, or `s` steps `"halo": { "r": 0.02 }`; slide 9 can ring again.
10. `.nums` above the lower third: **applied** as `nums.css` (below).
11. Sweep order and busy: **applied**, `by: 'n'` on the `{select}` step and `busy` from the bus's step. Deck: back to `d0-select.json` with `"by": "n"`, delete `public/dk/t5-select-falling.json`; try recording slide 11 without `--hold 55`.
12. Left-to-right landing, glow cap: **applied**, `fillBy: 'x'` and `glow`. Deck: h2 step `"fillBy": "x", "glow": 0.4`; `curve: 1` can go.
13. The canvas load fade: **declined, toolkit**.
14. Lineup label size: **applied** by LABEL 36 (and `labelPx`). Deck: the 1 TB / 800 TB / 4 PB labels may return as world labels; the `.nums` copy can stay.
15. `oursLast`: **applied**; `oursGlow`: **declined** (`glow` covers it); dotted tick width/dash: **declined for now** (open, low).
16. Axis with the grains, ring delay: **applied**, `axisWith: 'grains'` (dk-hist) and `delay` (dk-spark step); `when: 'landed'` declined (`delay` does it). Deck: slides 2 and 9.
17. `axis: false`: **applied** (step). Deck: slide 3's `cut` step `"axis": false`.
18. A lane that carries the crane: **no change needed**: dk-trigger already has `alpha`, `size` and `minPx`. Deck: `trg` `"minPx": 2.5` (and `alpha` 1.2) on the close.

## The series check's findings

- Slide 14 cover loop (T5 → T1): **deck work**, no kit gap: a dk-spark step `{ "at": <vertex>, "from": [...] }` with T1 `s1`'s size and halo; check the collision object's place in T5 (the 350 px offset says the object or the shot time differs).
- Slide 1 `tickPx`: **applied** (LABEL 36; delete the overrides in T3 and T4).
- Slide 1 cover title: **deck work** (styles/index.css; not a kit file).
- Slide 2 `.nums`: **applied**, `components/data-kit/nums.css` (left 56, bottom 190; `.unit` 22/500/0.04em/#9fd8ff/0.4em; `.name` 22/400/0.02em/#9fd8ff/0.6em; `.swap`; `.out` with `--oN`). Every deck: `@import '../components/data-kit/nums.css';` first in styles/index.css, delete its own `.nums` rules and `dk-nums-in`/`d1-nums-in` keyframes, rename T1's `d1-nums-in` uses. T2's top-left block becomes bottom 190 unless the owner records a series Decision. Lab 2 takes it this way.
- Slide 12 T4 depth: **applied** (range, centred ticks, word; `size` is not a font size).
- Slide 14 T1/T2 heap brightness: **deck work**: the same `alpha` on both heaps. For the number fading over the last second: `nums.css`'s `.nums.out` with `--o1`.
- Slide 16 T4 overlap: **deck work**.
- Slide 12 T4 ring colour: **applied** (default changed).
- Slide 1 headmatter: **deck work**.
