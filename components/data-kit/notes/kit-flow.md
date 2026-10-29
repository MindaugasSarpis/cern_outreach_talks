# kit-flow lane (29 Oct 2026)

Files: `trigger.js`, `lineup.js`, `pipeline.js`, `scatter.js`. `glow.js` and `ground.js`
are unchanged: no outline asks anything new of them. README: the dk-trigger and dk-lineup
sections are rewritten; the dk-pipeline and dk-scatter sections are amended. Each item below
was proven on a lab slide, recorded at 25 fps (1280×720) and read as frame grids. The takes
are in `scratchpad/kitflow/rec1b`, `rec4a`, `rec4b`, `rec5`, `rec5b` and stills are in
`talks/2026_00_00_DataLab1/shots/kf2`.

## dk-trigger

| need (outline) | done | proof |
|---|---|---|
| T1 s9 flood: gate 1 off, the buffer still on | gate field `off: [steps]` | lab 1 s5 click 1 (`trg` 3 → 4): the full lane pours in about 0.8 s, floods the shell by about 5 s, then runs out of the far end |
| gates switched off per step | the same `off` list. The ring dims to its floor, the gate's dust stays, and new crossings pass | lab 1 s5, s7 |
| gate 2 framed and filled honestly | Lab 1 gate 2 now has `keep: 0.1, shrink: 0.75, step: 5`, with 4 500 packets and a dist 7 pose. A kept packet is drawn at the cube root of its kept volume (0.75 looks 0.91 wide and no brighter). Only a shrink below about 0.6 still packs to half and is lifted, as the 0.075 was | lab 1 s6: 4-6 knots on the approach side burst at the ring, and the far side is empty except for ours (white, slightly smaller). s7 runs 5 → 3 → 5: the ring goes off, then a jump over the flood fires gate 2 again |
| gate firing on jumps | a step forward fires the gate whose own `step` is this step, even on a jump of several steps. Any other gate that turns on is shown as long on. Stepping back never fires a gate | lab 1 s7 click 2; lab 4 s18 (2 → 4) |
| a gate with no packet of ours | object `ours: false`. A per-step `false` / `null` fades ours out where it stands (0.8 s); T5 asked whether to write `0` or `false`, and it is `false` | lab 4 s17 (lane, then gate 1, never a white packet); lab 1 s11 (ours fades at the collapse) |
| the kept lane collapses into a ball that a dk-pipeline pile takes over (T4 into T5) | The collapse now plays on a jump from a running lane and stands at once only on a cold open. `ball.from` (x) and `ball.buffer` (the buffer's parked packets fold in too) are new. `api.ball()` gives `{ at, r, formedAt }` and `api.cede(t)` fades the ball. The pipeline's pile `from: '<trigger>'` waits for the ball, gathers round it and cedes | lab 1 s11, lab 4 s18: the buffer and the kept packets stream into the ball (about 2 s), the pile gathers round it from about 4.3 s, and the count reaches 91 583 |
| the collapse in reverse | a step back from `collapse` unfolds the ball into the running lane (2 s), and the rings and the buffer come back | lab 1 s12 click 1 |
| the lane running backwards (T5 route back) | **Declined, with an alternative.** A reversed lane would reassemble the gates' dust into packets, which says "what the trigger dropped comes back", the opposite of T5's message. Alternative (README): the route back is the camera's crane over a lane running forward (the finale is a recorded plate anyway), with `ours: false` from the heap on | n/a |

Honest gate 2 empties the lane: past gate 2 there is about one knot every 11 units. The
default ball (only packets past the last gate) is therefore a few dozen grains and does not
read. Lab 1 and lab 4 use `ball.buffer: true`. T4's notes should say that the ball pictures
"kept data becomes a file", not this file's history (the outline already does).

## dk-lineup

| need | done | proof |
|---|---|---|
| an array step | **Finding:** frontmatter `steps:` drops arrays (`stepsAt` keeps numbers only), so T1's outline line `tb: [2, 4]` would show nothing. New field `sets: { "5": [2, 4] }` makes a numbered step show exactly those piles. Arrays still work from `<StageSteps>` | lab 1 s13 (`tb: 5`) |
| an `at` per pile | `at` now accepts `x` or `[x, z]` (on the floor), `[x, y, z]` (exact), or `{ beside: k, side, gap, z }` (on the floor beside pile k, whatever its radius) | lab 1 s13: the white 864 pile left of the day's pile, labelled |
| a `sel` pile | already there (`color: 'sel'`); now seen | lab 1 s13 |
| grow in place `{grow: {from}}` | The pile takes k's place. k's spheres become its first spheres in the same frame and lift with the new centre while the rest gather round them. A step back flies the new spheres off, settles the old ones back, and k stands there | lab 5 s10, clicks 1-3. A first take lost pile k on the step back, because a show time of `t − 100` went negative early in the take; fixed |

## dk-pipeline

| need | done | proof |
|---|---|---|
| `replay: false` | an arrival (a cold open, a flight in, `c`) shows the state in 0.02 s: no gather, typing or run | lab 5 s1: the ball stands under the opening fade from frame 1 |
| the T5 colour swap | `run.tones` (stream tone per run). Lab 5 h1 is crowd at alpha 0.75; h2 is `tone: 'sel'` at alpha 0.5 with `selGain` 1 and `over: 'h1'` | lab 5 s4: the light-blue first pass with no bloom. s6: the white second pass, no halo or landing flash. At 0.5 the white reads light grey in dense columns; T5 can try 0.6-0.72 |
| a pile `from` a trigger | see dk-trigger | |
| a count for a pile alone | `value()` with no sheet gives the pile's n as it gathers | lab 1 s11, lab 4 s18: 91 583 |

## dk-scatter

| need (T4) | done | proof |
|---|---|---|
| `{box: null}` dissolves the edge | a boundary that goes with none after it breaks into seeded dust that rises and spreads as it fades (1.6 s). `dust: false` fades it instead | lab 4 s12 click 1 |
| `{epoch: 1}` draws on fresh | a boundary with none before it draws along its length (1.2 s). A dissolving boundary is never glided from. `draw: false` fades it instead | lab 4 s12 click 2 |
| `right` counting during a sweep | It already followed the sweep (the tally is recomputed each frame); now seen and documented | lab 4 s13: 150 → 151 → 172 → 185 |
| `axes: false` and a test-only dim | already there; now seen on the ring | lab 4 s14: no axes, 53.3 % test, 64 of 120 |
| `{undo}` with the bend back on | the boundary waits until the axis has closed (`after` + 1 s), then draws on. No boundary is drawn in the plane while the depth is open | lab 4 s15 → s16 (ev 5 → 7, new step 7 `{bend: true}`) |

## Lab changes (scratch)

- Lab 1, `trg`: 4 500 packets, gate 1 `off: [4]`, gate 2 keep 0.1 / shrink 0.75 / step 5, ours
  extended (step 6 fold, 7 false), `collapse: 7`, ball with buffer. A new `file` pipeline (pile
  only, `from: trg`) sits at [118, 0, 0]. `tb` gains a fifth pile (864, sel, beside 2) and
  `sets`. Deck: s5 gains a flood click; s6 and s7 move to trg 5 at dist 7; s10-s13 are new
  tests. Slide 11 warns at about 641k grains (the lhc-collision's 200k counts); it is lab only.
- Lab 4: new stations `toyB`, `ringB` and `gate` (trg plus file); `ev` gains step 7. Slides 12-18 are new.
- Lab 5: `pipe` gets `replay: false` and `run.tones`; h1 and h2 swap tones as T5 asks. A new station `archive`
  has a dk-ground and the growing lineup. Slide 10 is new; the notes of s1 and s4-s6 are updated.

## Open

- The recorder's "settled at" (0.04 s on most click takes) does not follow `api.busy`. This is
  the same open item as in `motion.md`; the kit forms do report busy.
- T1's outline writes `tb: [2, 4]` in frontmatter. It has to be `tb: 5` with `sets`, or a `<StageSteps>`.
- T4's ball: decide `ball.buffer: true` (it reads) against the honest default, a few dozen
  grains past gate 2. Lab 4 s18 uses buffer.
- T5's white second pass at alpha 0.5 reads light grey. Tune it in the deck (hist lane's
  `selGain`), and check its frame means for bloom.
- Not re-shot: lab 1 s4 (gate 1) after the new jump rule. That rule is unchanged for 1 → 2 and 0/1 → k.
