# Data2Peak: kit requests

Requests from the deck draft (29 Oct, draft:data2peak) to `components/data-kit`
(branch kit/data-series). None blocks the deck: each has a fallback in the deck today.

## dk-hist `reroll`: end on a chosen roll (slide 11 → 12)

- **Form:** dk-hist, model source with `model.rolls`, step key `reroll`.
- **What:** a way to end a `reroll` sweep on a named roll, e.g.
  `reroll: { every: 1.2, rolls: 20, end: 3 }` (show the bake's rolls 0-19, then come to
  rest on `{resample: 3}`, the bake's roll 2), with `alarm: 'baked'` following it.
- **Why:** slide 11 re-rolls the falling toy 20 times and rests on roll 19, which has no
  alarm, so the slide's settled frame (and its still, its plate) shows no white bin
  while its numbers say 7 alarms; slide 12 then opens on roll 2 (the 2.5 σ bump that
  `falling-big.f32` grows). Resting on roll 2 would make slide 11's last frame slide 12's
  first and keep a white bin in the still.
- **Slide:** 11 (`look`), handing over to 12 (`grow`).
- **Fallback in the deck:** the sweep rests on roll 19; slide 12 cuts to roll 2 (same
  station, same axis).

## Bake sets for the deck's typed curve levels (fix:data2peak, 29 Oct)

- **Form:** dk-curve `f: 'flat'` sets, from `bake/d0.py` into `d0-flat.json` and
  `d0-significance.json`.
- **What:** (1) `d0-flat.json` `band.set` / `band.hi.set` / `band.lo.set`: `{a, bin: 2}` at the
  flat bins' mean and mean ± √mean (1 460.79, 1 499.01, 1 422.57); (2) `d0-significance.json`
  `staysAbove5From.set`: `{a, bin: 2}` at the 5 σ height after 186 rows, (b + 5√b)/15 with
  b = 0.75 × 60 = 45, i.e. 5.23607 a bin (the counterpart of `line5sigma.set` for the full file).
- **Why:** the review asked for a mean line with a ±38 band on slide 6 and for the 5 σ height
  over the 186-row plot on slide 14. The mean (`{a: '@mean', bin: 2}`) and both background
  levels (`{a: '@line5sigma.b', bin: 30}`, `{a: '@staysAbove5From.off', bin: 40}`) compose from
  bake numbers; the band edges and the 186-row 5 σ height do not, so the deck types them
  (space.json `m6u`, `m6d`, `b5f` set 0). With the keys baked, the deck points at them.
- **Slides:** 6 (`m6u`, `m6d`), 14 (`b5f`).

## dk axis tick numbers at least 20 px at the series' distances (fix:data2peak)

- **Form:** label.js / every form's tick sprites (`LABEL.minPx` 18).
- **What:** raise the floor to about 20-22 canvas px, or size tick sprites by the working
  camera distance, and have `slidev-stage-shots` report world tick sprites' pixel size.
- **Why:** the review measured the bell's ticks at dist 17-22 at about 12-14 px (slides 8-9);
  the shots report measures DOM text only, so the tick size is unchecked across the deck. The
  deck moved slide 9 closer (dist 17) in the meantime.
- **Slides:** 8-10 (bell), 3-5 and 13-14 (mass axis).

## dk-hist `alarm: 'baked'`: a mark on the alarm bin (fix:data2peak)

- **Form:** dk-hist model with `model.rolls`, step key `alarm: 'baked'`.
- **What:** an optional mark that follows the lit bin roll by roll (a short white tick under
  the axis at the bin, or a flash as it lights), e.g. `alarm: { baked: true, mark: true }`.
- **Why:** slide 11's white alarm bin is a few grains among 140; a mark would let "7 alarms"
  point at something at the series' distance. The deck brightened the grains (`alpha` 2.2),
  slowed the roll to 2 s and moved closer in the meantime.
- **Slide:** 11.

## Engine: a station on a timed `path` assembles only at the path's last key (final:data2peak, 29 Oct)

- **Form:** slidev-addon-stage `space.js` (setPose / the path's `pathDone`), and every dk form's
  `arm()` / `assemble()` (dk-hist waits for `assemble`, with a 6 s fallback).
- **What:** when a slide's `path` starts with a key at t = 0 that is already *at* the new station
  (a cut), assemble that station on the first frame, not when the last key is reached; or a pose key
  `assemble: 0` (seconds) that says when.
- **Why:** slide 7 cuts to the roll station and cranes in at 8-12 s. The engine armed the roll plot
  on the cut and assembled it at the path's end, so the plot waited for dk-hist's 6 s fallback and the
  screen stayed empty floor for 6.8 s (motion review, slide 7). The deck's workaround: the roll
  station's centre stands 15 units behind its plot (station `pos` [-80, 0, 75], objects at
  [0, 0, -15]), so the slide's pose is not *at* the station, nothing is armed, and the plot fills
  as a plain step from frame 0. With the engine fix the station can go back to [-80, 0, 60].
- **Slide:** 7 (`roll`); any slide that cuts to a station and then moves on a timed path.

## dk-vertex: the decay, hold and fold durations as fields (final:data2peak)

- **Form:** dk-vertex (vertex.js: `TD = 1.3`, `TH = 0.6`, `TO = 0.9` are constants; only
  `flightTime` and `landTime` are fields).
- **What:** `decayTime`, `holdTime`, `foldTime` fields (and the same as step keys if cheap).
- **Why:** the motion review asked slide 3's lift-off, split and fold to take about 2.5 s and the
  grain to land by 3 s; at the defaults the sequence is 6.2 s of world time. The deck sets
  `flightTime` and `landTime` to 1.0 (4.8 s of world time) and runs the world 1.6x for the first
  3.2 s (`rate: [[0, 1.6], [3.2, 1.6], [4, 1]]`), so the dust and the idle sway run fast too.
- **Slide:** 3 (`v`).

## dk-hist: a landing-glow gain, and `curve` as a step key (final:data2peak)

- **Form:** dk-hist (morph.js: a landing grain's alpha × (1 + 0.8 glow) and size × (1 + 0.5 glow)
  for about 0.33 s; `glowTint` only changes the colour; `curve` is object-level).
- **What:** `glow` (0..1, object and step key) scaling that brightness and size pulse, and `curve` as
  a step key.
- **Why:** a dense pour landing in 1-3 s blooms the whole plot: slide 14's click (about 55 000 grains)
  rose to luma 38 against a rest of 26, slide 13's refill to 27 against 23, slide 12's click to the
  "white-hot columns" the review saw. The deck uses `glowTint: 0` (light-blue landings), a uniform
  `curve: 1` on `hf`, a lower `alpha` for the pour (0.38 on `hf` step 2, 0.9 on `grow` step 2) and
  longer fills where the review allowed it; the brightness pulse itself cannot be capped from a deck.
- **Slides:** 12 (`grow`), 13 (`h` step 4), 14 (`hf` step 2).

## Engine: the first frame at ambient 1 (final:data2peak)

- **Form:** slidev-addon-stage (space.js: `ambient = 1` and `ambKeys = [[0, 1]]` at construction).
- **What:** take the first slide's `ambient` before the first frame is drawn.
- **Why:** the cover opened on a grey veil (luma 25.7 against a rest of 21.7, fading over 0.8 s):
  the ambient world at 1 easing to the cover's 0. The deck's `ambient: [[0, 0]]` (a keyframe at 0,
  no ease) shortens it to about 0.3 s (luma 21.7 to 19.6), which is the stage's own start.
- **Slide:** 1.

## dk-curve: a set change on the step that rescales its hist overshoots (final:data2peak)

- **Form:** dk-curve (curve.js: `yScale` follows the hist's `frame().y(1)` at 4/s while the parameters
  glide over `ease` from the step's start).
- **What:** take the hist's new scale at once when the same step changes both (or glide the product,
  not the two factors), so a line moving to a far larger level never passes above the frame.
- **Why:** slide 14's click takes `hf` from `max: 10` to the full set and both lines from the 186-row
  levels (3.0 and 5.24 a bin) to the whole file's (1 405 and 1 453.5): for the first second the lines
  stood at the top of the frame, clipped. The deck delays the glide (`after: 0.8` on `bkf`/`b5f`
  step 2), so the lines rise onto the window once the scale has settled.
- **Slide:** 14 (`bkf`, `b5f`).

## slidev-addon-videos: one dark frame as a clip leaves as dust (final:data2peak)

- **Form:** the videos addon's `transition: dust` (the leave).
- **What:** draw the dust's first frame on the frame the video element goes, with no frame between.
- **Why:** slide 17's take opens 41 (the held, dimmed clip frame), 30.5 for one frame, then 44.6 as the
  dust appears and dissolves to the floor by 1 s. With the dim baked into the clip, nothing rises above
  the held frame any more (the review's +41 flash is gone), but the one-frame dip remains.
- **Slide:** 16 → 17.
