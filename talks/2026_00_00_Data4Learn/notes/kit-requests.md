# Kit requests from data4learn (draft, 29 Oct 2026)

Each: the form, what, why, the slide. The deck works around each one today.

1. **dk-curve: `replay: false`** (object or step key, as dk-hist's).
   - What: from hidden (an arrival, `c`, a cold open) the curve stands at once with its
     hist instead of waiting for `api.standing()` and drawing on over 1.2 s.
   - Why: the cover must be Talk 3's last frame exactly. `h` stands at once
     (`replay: false`), but the fitted curve draws on from the left about 1.5 s later, so
     the cut from Talk 3 shows the curve missing for a moment.
   - Slide: 1 (cover). Today: accepted; the draw-on happens under the title's rise.
2. **dk-scatter: the `depth` default range to the series' mass range.**
   - What: `depth.range` default `[1816, 1912]` (style.js `MASS`), rows outside it left out of
     the depth (or faded), instead of 1 810-1 920 (README "Known limits").
   - Why: the owner's decision of 29 Oct puts every mass axis on 1 816-1 912 MeV/c². A deck
     setting `[1816, 1912]` itself would clamp the outer rows onto the two ends, where they
     would stand as two bright stripes.
   - Slide: 13 (the leak, side on). Today: the default range; only the ticks 1 845 and
     1 885 MeV/c² are drawn, so no range end is on screen.
3. **dk-landscape: the ball standing at the path's start** (a step key, e.g. `ball: 'start'`).
   - What: after the gather, the ball stands at the path's first point (the untrained
     neuron, w = (0, 0), loss 0.693) with no roll, and `readout: 'path'` reads that point's
     value; the next step `{roll: true}` rolls it from there.
   - Why: today the ball shows only while it rolls (or at the minimum with `ball: true`), and
     a step without a roll reads the minimum (0.162), so a slide "a loss: the ball waits on
     the rim at 0.693" cannot be drawn. The outline's slide 7 was dropped for it (its drop
     order 2): the loss and the descent now share one slide, 2.0 min.
   - Slide: 7 (the valley; outline slides 7-8). With the key, the outline's split comes back.

## From the fresh-eyes review (fix:data4learn, 29 Oct 2026)

Request 2 above is now a review finding (medium, owner decision): the leak's depth axis
still runs over 1 810-1 920. The deck keeps the kit default rather than set `range` itself
(clamping). Please make 1 816-1 912 the default; the deck then needs no change.

4. **dk-scatter: clip a boundary to the data** (`clip: 'data'`, or a radius / a padded
   hull of the drawn rows, for every kind of boundary: line, epoch, bend).
   - What: the boundary's grains drawn only where rows are (the cloud's extent plus about
     10 %), not across the whole plot box.
   - Why: the ring's straight line (no axes) runs corner to corner of the box, about 1.4
     times the ring's radius beyond the data, down toward the lower third; on the real
     cloud the network's 0.5 contour ran through the empty corner under the cloud's floor.
   - Slides: 9 (the ring's line), 11 and 13 (the real boundary). Today: the real plot's
     y range starts at the data's own 0.150 ps floor (so the contour ends on the axis) and
     a 50 ps tick closes the y axis; the ring's range is ±2.75 and its frame sits higher.
5. **dk-landscape dims 2: edge captions** (`word` for the x edge, `wordY` for the y edge).
   - What: fixed-size labels in the name colour beside the two tick rows, shown and faded
     with the surface's ticks.
   - Why: the loss valley's ticks were bare numbers; the review asked for w₁ and w₂ on the
     two edges.
   - Slide: 7. Today: two built-in `label` objects at the valley station; they are
     world-sized and stand before the surface gathers (about 2.5 s).
6. **dk-scatter depth axis: a caption and centred ticks** (`depth.word`, ticks centred on
   their value).
   - What: the depth tick labels centred under their value (today left-aligned at it), and
     one caption after the axis's end, as the hist's `word`.
   - Why: side on, the left-aligned "1 845" and "1 885" sat about 35 px right of the white
     band's walls; the review asked for the caption "mass MeV/c²", as on the cover.
   - Slide: 12. Today: the two ticks are placed 5 MeV low (1 840, 1 880) with the texts
     "1 845" and "1 885", so each label centres under its wall, and a third tick at the axis
     end (1 920) carries the text "mass MeV/c²". Both go when the kit centres ticks.
7. **dk-scatter: a step key to mark rows a readout counts** (`{ mark: 'wrong:test' }`):
   a faint ring of fine grains round each such row, not dk-spark's marker (which the
   series keeps for our grain).
   - Why: the review asked to ring the 4 test points the line gets wrong.
   - Slide: 8. Today: the 4 errors are said, not marked.

## Series request (bible §3 "Number type", all five talks)

- The `.nums` block's `bottom` is 190 px here (it was 96 px): a three-line block then ends
  above the lower third (canvas 551 high, lower third from 367), which the house rule keeps
  clear. The other four talks still use 96 px; the bible should say one value for all five.

## From the motion review of the recorded takes (final:data4learn, 29 Oct 2026)

Request 1 (dk-curve `replay: false`) still stands. Today the cover's curve has `draw: 0.1`, so
it stands within a frame of its hist (about 0.4 s into a cold open, under the boot veil the
edit trims); with the key it would stand from frame 0 on any arrival.

8. **dk-landscape: the gather's length** (`gather` seconds, object or step key, as dk-scatter's `fill`).
   - What: the surface gathers in about 1 s instead of the fixed 1.5 s glide plus up to 1.1 s
     of per-grain delay (2.6 s), and the built-in `label`s at the station fade in with it.
   - Why: on a cut to the valley the frame stays almost black for about 1.2 s with only the
     w₁ and w₂ labels floating, and the surface stands at 2.6 s; a narrated explainer needs
     the picture within about 1 s of the cut.
   - Slide: 7. Today: the valley gathers on slide 6 (`loss: 1`, 100 units off screen) and slide 7's
     pose is not *at* the station, so the cut lands on the standing surface; with the key the
     valley could gather on its own slide again.
9. **dk-scatter: a drop with no landing glow** (`glow: false` on a `show` step, or a smaller glow).
   - What: held-out rows that drop in land at their final size and brightness.
   - Why: on the toy (alpha 1.35) the 50 held-out points flared as oversized bloom halos for
     about a second before shrinking to grain size.
   - Slide: 8's click. Today: the step has `gather: true`, so they glide in out of a seeded
     cloud and fade up (no glow), landing in about 2 s; the numbers wait 2.0-2.2 s after the click.
10. **dk-scatter: the dissolving boundary's length and brightness** (`dustTime`, `dustAlpha`).
    - What: the `{box: null}` dust keeps the edge's brightness while it rises and lasts about
      1 s at a level that reads, instead of fading under the noise floor in about 0.5 s.
    - Why: slide 5's click 1 ("no line while the weights are zero") has only a faint event.
    - Slide: 5. Today: the kit's 1.6 s dust, visible to about 0.6 s.
11. **dk-trigger: a gate's ring brightness before it fires** (`idle`, default 0.25).
    - What: the ring stands at a level that reads as an object before its step, then fires.
    - Why: at the default the first filter's ring was not seen before the click, so it read as
      popping in on the click.
    - Slide: 16. Today: the gate's ring has 4 000 grains (from 600; the form 36 500), so the dim ring reads by
      density, and the pose looks at the gate (x 30, on the lane's height) so it stands at the
      frame's centre.
12. **dk-scatter depth axis: caption and ticks timed with the camera** (with request 6).
    - What: the depth caption and ticks fade in once the plane has turned (and out before it
      turns back), and no axis line streaks across while the camera turns.
    - Why: on slide 12 "mass MeV/c²" and "1 885" float beside the flat cloud at 0 s; on
      slide 13 a label fragment lingers at 1.5 s.
    - Slides: 12, 13 (low finding; unchanged in the deck).

13. **dk-trigger: a collapse that reads** (`collapse` timing and brightness).
    - What: the kept packets visibly fold from the lane into the ball over about 1.5 s, the
      ball reading as an object while it forms (today it is a dim knot of buffer packets until
      the pile gathers round it, about 3.5 s after the step).
    - Why: "the kept lane folds into one file" is the close's message; in the take the lane
      fades, the frame is nearly black from 1.5 s to 3.5 s, and the fold itself is not seen.
    - Slide: 17. Today: the camera pans onto the ball's place by 2.2 s, so the ball forms in
      the centre of the frame and the pile gathers round it from about 3.8 s.

## Toolkit (slidev-addon-stage), not the kit

- **The recorder's first take opens on the boot veil.** 01.mp4 shows a lifted grey veil for
  0.7 s while the page boots. Today the edit starts the cover's take at 0.72 s
  (`01-trim.mp4` beside the takes); a recorder option to start after the boot fade would make
  that unnecessary.

## After the kit steward's pass (polish:data4learn, 29 Oct 2026)

The steward's answers (components/data-kit/notes/steward.md, "Data4Learn") and what the deck took:

- 1 `replay: false`: taken; the cover's `fit` has `"replay": false`, `draw: 0.1` dropped.
- 2, 6, 12 depth range, centred ticks, caption, camera timing: taken; `ev.depth` is
  `{ "ticks": [1845, 1885], "size": 14, "word": "mass MeV/c²" }` (the 5-MeV-low ticks and the
  1 920 text tick gone).
- 3 `ball: 'start'`: taken as a click, not a split: slide 7 opens on the ball waiting on the
  rim (0.693), click 1 rolls it (the count to 0.162). The slide count stays 17.
- 5 dims-2 `words`: taken; the two built-in `label` objects at the valley are gone.
- 8 `gather`: not taken; the valley still gathers off screen on slide 6 (that works and the cut
  lands on a standing surface).
- 9 `glow: false`: taken on slide 8's `show` step (`gather: true` dropped).
- 10 dust keys: taken on slide 5's `{box: null}` step (1.2 / 0.4 / 1.5, untuned).
- 11 `idle`: taken; the gate's ring back to 600 grains at `"idle": 0.8` (the lab found 0.6 faint).
- 13 `collapseTime` 1.5 and `ball.gain` 1.4: taken.
- LABEL 36: `tickPx` deleted on `h`. Ring white by default: nothing to change (`ours` core crowd).
- Still open: 4 (clip a boundary to the data); 7 declined (the ring marks our grain only).

## From the series review (fix:data4learn, 29 Oct 2026, second pass)

14. **dk-trigger: a gate ring's colour** (`ringColor: 'sel'` on a gate, or a form-wide key).
    - What: the first filter's ring drawn in the selected colour (white), as every boundary on
      slides 3-15 is, instead of the crowd's light blue (trigger.js draws the ring with `uColor:
      crowd`).
    - Why: slide 16's Message is that the learned boundary *is* the gate; a light-blue ring among
      light-blue packets breaks the talk's own colour grammar (boundary white, crowd light blue)
      on the one slide that says the boundary is the gate (review: high).
    - Slide: 16. Today: `idle` 1.2 (from 0.8), the slide's `dim` 0.25 (from 0.15) and the camera
      at dist 9 (from 12), so the ring reads large and bright by density, but light blue.
15. **dk-landscape dims 2: the x caption's place** (`words.align` or a `words.at`, e.g. the
    edge's middle).
    - What: the w₁ caption at the middle of its edge (under the middle tick), not past the near
      corner's "3", where it reads as the far edge's.
    - Why: review (low): a student cannot tell at once which edge is w₁ and which w₂.
    - Slide: 7. Today: the far-end "0" on the w₁ edge is dropped (`ticks: [1, 2, 3]`), so only
      the w₂ edge carries a 0 and the two edges no longer mirror each other.
