# Data2Peak: kit requests

Requests from the deck draft (29 Oct, draft:data2peak) to `components/data-kit`
(branch kit/data-series). None blocks the deck: each has a fallback in the deck today.

**The steward's pass (29 Oct, `components/data-kit/notes/steward.md`), taken in polish:data2peak:**
applied and used: `reroll.end` (slide 11 rests on roll 2), the bake's band and 186-row 5 σ sets
(`m6`, `m6u`, `m6d`, `b5f`), LABEL 36 (no `tickPx` here), `alarmMark` (slide 11), dk-vertex
`decayTime`/`holdTime`/`foldTime` (slide 3's world `rate` dropped), hist `glow` (0.3 on `grow` and `hf`
step 2), the curve's scale snap (`after: 0.8` dropped on `bkf`/`b5f`). Declined as toolkit work (still
open, outside the kit): the shots report measuring world tick sprites, a station on a timed path
assembling at its last key (the roll station keeps its 15-unit offset), the first frame at ambient 1,
the videos addon's one dark frame on a dust leave.

Open, new (polish:data2peak):

- **Stage addon, not kit: the cover scrim.** `slidev-addon-stage`'s `.slidev-layout.cover::after`
  (0.55 radial darkening, 60 % × 55 % at 32 % / 50 %) dims whatever world stands right of the title
  by about a quarter; this deck narrows it in styles/index.css so the pile matches talk 1's close.
  Every series cover that continues the previous talk's last frame has the same drop: a stage
  option (e.g. `stage.coverScrim`) would let the five decks share one setting.
- **dk-hist `oursSlot` with a dk-vertex landing.** The ring on our grain at 1 880 covers the "1880"
  tick number at the series' distances (slides 3-5, 17, larger since LABEL 36). `oursSlot` lifts the
  grain, but slide 3's dk-vertex lands it on the axis (`land: { of: 'h' }`): the deck needs the vertex
  to land at the slot, or the ring's halo to clear the tick row, before it can set `oursSlot`.
  fix2:data2peak sets `oursSlot: 420` on `h`'s all-rows step (slide 5: the ring clears "1880") and
  `oursSlot: null` on the close's step, so slide 17 stays talk 3's cover frame; slides 3-4 (the landing
  on the empty axis) and 17 still touch the label. Slide 17 and talk 3's cover move together or not at
  all: a series decision (the close and T3's cover both at slot 420), or a kit ring offset.

Open, new (fix2:data2peak, 29 Oct):

- **Bake: the falling toy on the series' mass axis.** `bake/toys.py` draws `falling` on 1.45-1.75 GeV
  (30 bins of 10 MeV), a second mass axis after slides 3-5. This deck redraws it on 1 816-1 912 MeV/c²
  (30 bins of 3.2) with its own `bake/remap.py` into `public/dk/t2.json` and `t2-falling-big.f32` (the
  shape is scale-free, so every count, z and alarm is the bake's own). Ask: bake the toy (rolls,
  `alarmAt`, `edges`, curve sets, `falling-big.f32`) on `MASS` directly, ideally in 2 MeV bins with a
  new worked fact, and list the files in `data/manifest.json`. Until then check.mjs warns
  `not-in-manifest` twice (t2.json, t2-falling-big.f32).
- **Bake: slide 14's coarse counts.** `t2.json` `first186` (rows 1-186 in the three bands, 10 MeV bins
  from 1 820: 17, 16, 0, 23, 29, 27, 0, 17, 10) is a talk-owned count; d0.py could emit it beside
  `staysAbove5From` so the manifest covers it.
- **dk-hist: rebin per step.** `lo`/`hi`/`bin` are object-level, so slide 14 draws its 10 MeV picture
  as a second plot (`hf10`, a `src` counts plot, `unit: 0.01`, `pos` x +0.25 to align 1 820-1 910 with
  the series' 1 816-1 912 axis) while `hf` reads the same 186 rows invisibly (`alpha: 0`,
  `axis: false`) for the count, then pours the rest on the click. A step key `bin` (with the frame
  gliding) would make it one plot.
- **dk-heap: `alpha` (and a dim) as a step key.** The review asked to dim the pile once our grain has
  left it (slides 3-4). The heap's steps are integers and its alpha is object-level (the cover must
  keep talk 1's brightness), so the deck moved the pile instead: `[-20, 0, -14]`, behind the axis and
  left of its 1 816 end (the cover pose follows it).
- **dk-hist / dk-curve: the drawn column tops stand under the frame's own y scale at close range.** On
  slide 6 (data, `h`) and slide 7 (model, `roll`), framed level at dist 4.2, the light-blue mean line
  (1 461) and the band's centre stand about 14 px (900-px frame; about 0.06 units, about 20 entries)
  above the centre of the ragged tops' brightness ramp, so the tops ride in the band's lower half and
  the lower band edge's glow covers them. At dist 24 (slide 14) the tops and lines agree to a few px.
  The band is the model's own mean ± √mean (1 460.8 ± 38.2, `setBand` on `L.exp`), so the deck cannot
  re-centre it; the kit could check a grain's drawn top against `frame().y()` at close range (sprite
  anchor, or the jittered depth against the line's `z`).
- **Stage: the cover scrim as one series setting.** The series check asks every cover to have the same
  darkness; this deck alone narrows the stage's scrim (above). Moving the narrowed rule into all five
  decks needs the other talks' sessions or a stage/kit option: not done here (no other talk's
  directory is touched).

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
