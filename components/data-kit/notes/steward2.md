# Kit steward pass 2, 30 Oct 2026

The kit-level findings of the final motion review of the recorded takes, and every request
the first pass (`notes/steward.md`) left open in the five decks' `notes/kit-requests.md`.
Each item: applied or declined (with the reason), the lab slide that shows it, and the
exact change the deck makes. The keys are in README.md, "Added 30 Oct". No talk worktree
was touched; the decks make these changes themselves.

Checks after the pass: `pnpm talk check datalab1..5` ok (lockfile, videos:check,
stage:check, build); `check.mjs` ok on all five labs (lab 4 keeps its old `named-decay`
warning) and, read only, on the five decks (no new errors); `bake/d0.py --check` 14 files
match, `code.py --check` 1, `toys.py` 3, `train.py` 6, `peaks.py` 1, `portal.py` 1.
Labs synced (`bake/sync.py --to … --all`). Motion: recorded takes at 1280×720, 25 fps, read
by per-frame luma (YAVG) and strips. Takes and strips are in the session scratchpad
(`steward2/lab1` … `lab5`), not in the repo.

## Defaults changed (every deck gets them without editing)

| change | why | deck change |
|---|---|---|
| **Keep on arrival.** dk-hist, dk-heap, dk-vertex, dk-spark, dk-curve, dk-landscape and dk-bell: a form that stands when its station is armed (a flight or cut to its station) stays, and the slide's step plays on from it as a plain step. Before this, an arrival replayed every part from nothing | T2 05 (high): the sort went back to nothing, the strands came back at the ring, the count jumped; T3 13: grains faded in under a standing curve; T5 request 21: a `from` glide replayed at bullet time | none. A deck that wants the old replay puts `"arrival": "replay"` on that object. Lab 2 slides 29-32: slide 30 opens at slide 29's last luma (17.4 against 17.5), largest frame step 0.07, the pour goes on from 1 000; slide 32 opens at 17.5 = 17.5, no strands |
| **Grains in flight.** morph.js: a dropping or leaping grain shows a share of itself in flight (`flight`: 0.3 in dk-hist, 0.15 in dk-heap's rain; leaps out of a heap keep 0.7) and grows to whole as it lands; the landing glow ramps in over 0.12 s; an arriving grain has its colour from the start; dk-hist scales the glow by the densest third of a second of landings (`glowCap: false` turns that off) | T5 10 and 12-c1: a dim block filled the box before anything landed, then a bright base row popped in one frame; T5 09: the white pass flew light blue; T2's dense pours | none. `"flight": 1` (object or step) gives the old in-flight look. Lab 5 slide 4: largest frame step 0.25, no block, the ring waits for its grain |
| **Depth of marks.** dk-hist whiskers, the ±√N band and tall step ticks (`markZ`, 0) and a dk-curve's line (`z`, 0) stand at the columns' own depth centre, not half a bin in front | T2 request "column tops under the frame's y at close range": at dist 4-7 the mean line and the band stood about 14 px above the tops by parallax; T3 request 18's parallax | none; `markZ: 0.55` / `z: 0.27` restore. T2's `bkf10`/`b5f10` keep their explicit `z: 0.27` |
| **dk-bell.** It gathers up from its axis, low grains first (`fillFrom: 'drop'` for the old fade); the front's glow in the sparse tail is `frontGlow` 0.6; a zoom keeps the bell, its axis and ticks at `zoom.keep` 0.45 while the tail grows out of the bell's own tail | T2 08 (the bell faded in whole; a stray tail speck), T2 10 (1.4 s near black in the dive) | none. Lab 2 slide 16 (the bell rises), slide 19: darkest frame 17.9 (16.7 at keep 0.2; the review's take was under 17.5 for 1.4 s) |
| **dk-heap rain.** From a soft gaussian disc of emitters, wider than the pile, each grain fading in as it falls | T1 14 (a column with hard edges, a slab above the heap) | none. Lab 2 slide 27 |
| **dk-scatter rare set.** `gamma` 0.62, `dimFloor` 0.03 | T4 14 (the background's core near white) | none (see T4 below for `fill`). Lab 4 slide 11: the core reads light blue at `crowd: 24` |
| **`detectorParts`.** Every part in the palette's `dust` (#4d8cb8) | T1 request 16 | T1 has it already. Any other deck that draws the detector copies the literal in README.md, Install |

## Data1Trigger

Motion review (kit layer):

1. **04: slide 3's glow on slide 5's pose (medium).** Applied: dk-glow `hideFade` (s, 0.4; 0 = gone on the frame of the hide). Deck: `glow` object `"hideFade": 0`. Lab 1 slide 4 (glow step 2 → 0 with a cut): frame 0 at luma 16.4, no fade of the glow (the review measured 47.6 → 20.5 over 0.4 s).
2. **08-c1: our knot pops in at the frame edge as a white bloom; the burst is a slow thinning (medium).** Applied: dk-trigger `oursMaxPx` (a cap on our packet's grain size in px; past it they shrink and dim), `oursAlpha`, `burstGain` and `burstLife` (a flash as each dropped packet breaks, a shorter dust); the existing `wave` (30 units/s) is documented: the 1.5 s "thinning" is the burst wave running 82 units at 30/s. Declined in the kit: fading ours in before the frame edge (a glide is shown from its start; where it starts is the deck's). Deck: `trg` and `lane` `"wave": 90, "burstGain": 1.5, "burstLife": 0.8`, `trg` `"oursMaxPx": 30`; if the entry still pops, frame slide 8 a little wider (dist 10, at x 63) so our packet's glide from the buffer (x 49) starts in frame. Lab 1 slide 4: the gate's burst is one flash (luma +3 over 0.4 s, frame steps ≤ 0.57) and the lane past the gate is empty by the next tile.
3. **13: the fold is over at 0.5 s; the floor never shows (medium).** The fold: no kit change; the deck has the keys. Deck: `trg` `ours` step 8 `{ "at": 98, "fold": true, "glide": 2.4, "lag": 0.6 }`. The floor: applied, dk-ground `size` as a list by step. Alpha alone cannot do it: from 10-20 units the 0.7 grains are 2-3 px dots about 30 px apart, about 1 % of the frame. Deck: `g2` `"size": [0, 2.2, 0.7]` beside `"alpha": [0, 2.4, 1]`; slide 14 keeps T2's floor. The lane: deck `trg` `"minPx": 2` if the knots still do not read. Lab 1 slide 14 (T1's own pose, `at: [98, 0, 0]`, dist 9, pitch 14): the floor reads as a dotted plane.
4. **05: the readout stream pulses; the detector does not read side on (low).** Declined: the stream (`out`, `hot`) and the detector's grains are the engine's lhcb plugin (slidev-addon-stage), not a kit file. Toolkit lane. Deck: the detector's `alpha` (0.6) is the deck's.
5. **14: the rain's hard column; "0 candidates" before any grain lands (low).** The rain: applied (default). The count: deck: slide 14's `.nums` `style="--d1: 1.5s"` (the first grains land about 1.5 s in).
6. **10 / 10-c1: gate 2's burst faint (low, unverified).** Applied by 2: `burstGain` and `wave` are object-wide, so gate 2 takes them. Deck: nothing more; retake 10-c1 and open its strip.

Requests (those the first pass left open):

- 2 Crossing.vue / Clock.vue, 3 `lhc-collision` on the bus, 10-14 (clip blink, dust arrival, manifest fade-out, per-click camera keys, recorder frame 0), 15 (a record-only mark on `<html>`): **declined, toolkit / lhc-opening**, as before. A kit file cannot import slidev-addon-stage; these belong to the main loop.
- 16 the detector one step deeper than the crowd: **applied** (`detectorParts` default above). Deck: nothing (T1 already writes the literal).

Retake: 04, 08, 08-c1, 10, 10-c1, 13, 14.

## Data2Peak

Motion review:

7. **05: the sort restarts from nothing (high).** Applied: keep on arrival (above). Deck: nothing; the review's workaround (`v: 0` from slide 4) is not needed. Retake 05.
8. **12: slide 11's last picture blanks and refills; slide 11's rolls never rest (high).** No kit gap: `grow` is a second plot, and `replay: false` is already a step key on dk-hist and dk-curve. Deck: `grow` step 1 `"replay": false` and `eg` step 1 `"replay": false`. Slide 11: `look`'s `reroll` runs 20 rolls × 2 s = 40 s against an 8 s hold, so the take never reaches roll 2. Either `"reroll": { "every": 0.6, "rolls": 20, "end": 3 }` (rests on roll 2 at about 12.6 s; record slide 11 with `--hold 14`), or keep `every: 2` and record with `--hold 44`. Slide 12 then opens on slide 11's last frame.
9. **08: the bell fades in whole; a speck at 2.8 s (medium).** Applied (dk-bell default above). Deck: nothing.
10. **10: the dive goes near black (medium).** Applied: `zoom.keep` (0.45) and `zoom.after`. Deck: nothing needed; `z` step 5 `"zoom": { "from": 3, "after": 0.6 }` if the camera's move should land first.

Requests:

- **The cover scrim:** declined, toolkit (`slidev-addon-stage`'s `.cover::after`; a `stage.coverScrim` option). Still open there, twice asked.
- **`oursSlot` with a dk-vertex landing (the ring over "1880" on slides 3-4):** applied, dk-vertex `land.lift` (units above the axis). Deck: `v` `"land": { "of": "h", "lift": 0.5 }`, and `h` step 2 (n 1 000) `"oursSlot": 3` so the poured grain of our row stands clear of the tick as well (420 stays on the all-rows step). Slide 17 and T3's cover: still a series decision (both at slot 420, or not). Lab 2 slide 31.
- **Bake: the falling toy on `MASS`:** declined for now. It needs a new worked fact for the 2 MeV binning and an owner's check that the toy's alarms (7 of 20) still hold on the new axis; the deck's `remap.py` is exact (the shape is scale-free). `not-in-manifest` stays a warning.
- **Bake: slide 14's coarse counts:** applied. `d0-significance.json` `staysAbove5From10` = [17, 16, 0, 23, 29, 27, 0, 17, 10] (139 rows: 79 window, 60 side bands, the deck's own `first186` exactly). Deck: `hf10` `"src": "d0-significance.json", "key": "staysAbove5From10"` (keep `lo: 1820, bin: 10`), then `python3 components/data-kit/bake/sync.py --to talks/2026_00_00_Data2Peak`; `t2.json` keeps only the toy. Lab 2 slide 35.
- **dk-hist rebin per step:** declined. The bins set every grain's slot and the frame; a rebin is a second layout, which the two-plot workaround (`hf10` beside `hf`) already is.
- **dk-heap `alpha` as a step key:** applied as `states` (a list by step) and `alpha` as a list by step. Deck (optional; the moved pile works): `heap` `"states": ["off", "rain", "pile", "ball", "pile"], "alpha": [0, 0.387, 0.387, 0.387, 0.2]` (0.387 is the pile's own alpha now, so the cover keeps T1's brightness) and `heap: 4` on slides 3-4. Lab 2 slide 34.
- **Column tops under the frame's y at close range:** applied (marks' depth, above). Deck: nothing; retake 06-07.

Retake: 03-05, 06, 07, 08, 10, 12.

## Data3Fit

Motion review:

11. **06: the screen goes empty between plot and valley (medium).** Applied: dk-landscape `gatherFrom: '<dk-hist>'` (object or step): the bowl gathers out of the plot's grains where they stand, and dk-hist `fadeOut` (step, s). Deck: `bowl` `"gatherFrom": "h"`; replace slide 6's every-row `cut` on `h` with `{ "fadeOut": 1.5 }` (else the grains both lift as dust and fly to the bowl); lower or slow the camera's rise so the plot stays in frame for the first second. Lab 3 slide 4: grains travel from the plot down into the bowl, darkest frame 17.4 (the review's 16.5).
12. **13: the plot's grains fade in under a standing curve (low).** Applied: keep on arrival. Deck: nothing (`h` standing out of view now stays at full opacity across the cut). Retake 13.

Requests:

- 18 **meanTick as a step tick:** applied, `meanTick: { y: [y0, y1], tone }` (still gliding). Deck: h steps 4-5: `"meanTick": { "y": [0.9, 1.16], "tone": "sel" }` in place of `meanTick: false` and the white step tick at 1 864.81. Lab 3 slide 15.
- 19 **ring without crossing labels:** applied, `crossLabels: false` (object) or a step's `ring: { labels: false }`. Deck: `s2` steps back to `ring: true` with `"crossLabels": false`. Lab 3 slide 17.
- 20 **pull guides as an object:** applied, `pull.guides: { at, alpha, share, every }`. Deck: `fit` `"pull": { "guides": { "at": [-2, 2], "alpha": 0.8, "share": 0.15, "every": 1 }, "y": -0.46, "height": 0.15 }` and drop `"split": { "zero": 0.15 }`. Lab 3 slide 2.
- 21 **a fade-out step:** applied, `fadeOut` (above).
- 22 (shots and `.nums.out`), 13-15, 17: **declined, toolkit**. 12 (bracket): declined (bible: no drawn annotations), as before.

Retake: 03, 06, 09, 13.

## Data4Learn

Motion review:

13. **07-c1: the ball blinks on the click; the descent is a drop (medium).** Applied: from `ball: 'start'` a `{roll: true}` step rolls from where the ball stands (no fade), and `roll: { by: 'distance', time }` times each leg by its length on the surface (an even speed). Deck: `loss` `"roll": { "legs": 30, "by": "distance" }` (and `"time": 5` if 30 × leg is too short). Lab 3 slide 18, click 1 recorded: the ball stands from frame 0 (luma flat at 18.6, steps ≤ 0.11) and rolls over about 5 s.
14. **14: the background's near-white core (medium).** Applied (`gamma` default above). Deck: `rare` step 1 `"fill": 2.5` (the blob fades in whole at `fill: 0.8`); `crowd: 24` may stay. Lab 4 slide 11.

Requests:

- 4 **clip a boundary to the data:** declined, still open. The boundary is one static chain of grains; clipping it to a padded hull needs per-grain visibility in morph's static set and a hull per kind of boundary. The deck's data-floor range stands.
- 7 (ring the rows a readout counts): declined (the ring is our grain's alone; the owner's word needed), as before.
- 14 **the gate ring white:** applied, dk-trigger `ringColor: 'sel'`. Deck: `trg` `"ringColor": "sel"`; `idle` 1.2 may come down. Lab 4 slide 17.
- 15 **the w₁ caption's place:** applied, `words.xAt: 'middle'`. Deck: `loss` `"words": { "x": "w₁", "y": "w₂", "xAt": "middle" }`; the w₁ edge's 0 can come back (`ticks: [0, 1, 2, 3]`). Lab 3 slide 18.

Retake: 07, 07-c1, 14, 16.

## Data5Open

Motion review:

15. **10: a dim block before the grains land, then a bright row in one frame (medium).** Applied (grains in flight, glow ramp and cap: defaults). Deck: nothing; `h2`'s `"glow": 0.4` may go (the cap covers it).
16. **12-c1: the same block; the ring before its grain (medium).** Applied: the defaults, and dk-spark `when: 'landed'`. Deck: `s` step 5 `{ "on": "hs", "when": "landed" }`. Lab 5 slide 4 (`sp2` on `h1`).
17. **03: "goes to dust" reads as a fade (low).** Applied: a cut's `dust: { lift, spread, time }` (step). Deck: `h0` step 2 add `"dust": { "lift": 0.7, "spread": 0.15, "time": 2 }`; delay the camera's move until about 1 s in if it still competes. Lab 5 slides 11-12: the plot rises and spreads away over 2 s.
18. **09: the departing grains rise as a blue haze (low).** The haze was `h2`'s own grains in flight from `from`, leaving light blue and whitening as they landed. Applied: arriving grains have their colour from the start, and fly at the `flight` share. Deck: nothing.

Requests:

- 7 (a versions stage): declined, the owner's call, as before.
- 15 **a dotted tick's look:** applied in part: a step tick's `dash` (grain spacing) and `alpha`; a grain size per tick is declined (one size per tick set). Deck: slide 12's ± 0.10 ticks `"dash": 0.02, "alpha": 1`.
- 19 (timed steps), 13: **declined, toolkit**.
- 20 **a multi-key glide:** applied, dk-spark `path: [[t, [x, y, z]], …]` (a smooth curve through the keys, the run eased at its ends; with `from: '<heap>'` it starts at the lifted grain). Deck: `s` step 8, for example `{ "from": "heap", "at": [-160, 0, -40], "path": [[3, [<heap x>, 12, <heap z>]], [8, [<midway x>, 9, <midway z>]]], "glide": 3.5, "halo": { "alpha": 0.85 } }` (the keys in the spark's station frame; the last leg runs to `at` over `glide`). Lab 2 slide 33.
- 21 **a `from` step replayed on assembly:** applied (keep on arrival). Deck: the gliding ring may move back to the destination station's spark; nothing required.
- 22 **`code-lines.json` stale:** applied, re-baked: `d0.py` is 935 lines, sha256 8a955e73…, after this pass's 8 lines in the significance block (below line 208). The drawn range 87-208 (`# === read` … `return log, cov`) is unchanged. Deck: `python3 components/data-kit/bake/sync.py --to talks/2026_00_00_Data5Open` and cite the new hash.
- 23 **`axisAlpha`:** applied. Deck: `hs` step 3 `"axisAlpha": 2`; the two dim edge ticks may go.
- 24 **our grain's own alpha and size:** applied, `oursAlpha`, `oursSize` (object or step). Deck: `hp` `"oursSize": 0.6, "oursAlpha": 0.9`, and the plot's alpha back to 1.3.
- 25 **the marble reads dark:** applied, dk-lineup `lit: 'soft'` (ball or object) and `gain`. Deck: `tb` ball 0 `"lit": "soft"`. Lab 5 slide 10.
- 26: cross-talk, not kit.

Retake: 03, 09, 10, 11, 12, 12-c1, 13.

## Not seen

dk-trigger `oursMaxPx`/`oursAlpha` (no lab pass of our packet near the camera), dk-bell
`zoom.after`, `glowCap` against a plot without it, and every deck's own retake. The labs
show each key once; a deck's retake is the proof for that deck.
