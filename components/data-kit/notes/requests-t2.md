# t2's requests to other owners (29 Oct 2026)

Each: file, what, why. t2 did not edit these files.

1. **`hist.js` (core): a re-roll clock.** A step key or field such as
   `{ reroll: { every: 1.2, rolls: 12 } }`. The hist would then step its own
   `resample` 1..rolls on the world clock and rest after the last roll, with `busy`
   true until then. Why: T2 "Counts wobble" re-rolls the 14 flat bins every 1.2 s. Lab 2
   slide 20 does this today from a slide `<script setup>` (`setStepLater` + `onStep`
   + `useIsSlideActive`, 12 steps `{resample: 1..12}`). That works, but each deck would
   copy the script. An endless loop also keeps the form busy, so the shots never settle
   (seen: slide 20 "not settled" after 30 s). The lab's chain therefore stops after 12
   rolls.

2. **`heap.js` (core): merged claims.** `claim(gone, who)` / `release(who)`, where a
   row's gone time is the minimum over the claimants. Why: dk-vertex takes our grain
   off the summit while it flies. A dk-hist `{sort}` on the same heap calls `claim()`
   with its own array, which replaces the vertex's claim, and its `release()` drops
   both. vertex.js works around it: it claims only while its `land.of` hist is empty
   and still, and never releases while the hist holds grains. It already passes its
   name as the second argument, which today's heap ignores. On a slide reached
   directly, our grain can therefore show on the summit for about 0.4 s next to the
   flying one.

3. **`hist.js` (core): our grain already placed.** For example
   `{ sort: 'heap', oursFrom: '<form name>' }`, or an object field `ours: { row: 0,
   from: 'v' }`: on that step the hist's grain of our row starts where the named form's
   `api.ours()` is, and needs no leap from the heap. Why: in T2 the vertex lands our
   grain on the empty axis, and the next step sorts the heap. Today the hist's own
   grain for row 1 leaps again from the summit and lands on the vertex's grain. The
   vertex then hands over and fades, so the end state is right (lab 2 slide 15), but a
   second "ours" crosses the picture.

4. **`hist.js` (core): lighter `{errors}` whiskers at close range.** *(Superseded by 7
   below; kept for the record.)* For example
   `errors: { alpha, size, cap }`, or a default alpha near 0.55 with a cap a fifth of
   the bin wide. Why: on the close re-roll view (lab 2 slide 20, camera 8 units from the
   tops) the whiskers are solid white bars with bloom and read like a row of "I" glyphs.
   They outweigh the column tops, which are the subject of the slide.

5. **`hist.js` (core): baked rolls for a model.** For example
   `model: { rolls: 'toys.json', key: 'flat.rolls' }`, so that `{resample: k}` shows
   row k of the bake's numpy rolls (seed 1461) and not the kit's mulberry32 Poisson
   draw. Why: the notes could then cite `toys.json` for the exact counts on screen.
   Today the toy is honest ("simulated, seed 1461") but cannot be reproduced from the
   bake.

6. **README (core): document `{ n: 0 }`.** It draws the frame and no grains: the empty
   axis that dk-vertex lands on (lab 2 slide 14). It works today but is not written
   down.

## Second round (fix:t2, 29 Oct 2026, after the fresh-eyes review)

7. **`hist.js` (core), `setWhiskers` (l.266-268, 571-583): `{errors}` in the series look.**
   Draw the whiskers in `P.axis` (dim), alpha about 0.5, size `GRAIN * 0.6`, caps of 3
   grains at most (or none). Better still for a `model`: mark only the ±√N band as two dim
   grain lines across all bins, at expectation ± √expectation. Why: white is reserved for
   selected grains, and at full alpha `P.sel` the 14 whiskers bloom into a row of "I"
   glyphs that hide the column tops (review: slide 20 high). Lab 2 slide 20 now drops
   `{errors}` and shows the whole plot (baseline, ticks, ragged tops) until this lands.

8. **`hist.js` (core): a y range that does not start at zero** (for example `ylo` with
   `yticks: [1423, 1461, 1499]`), so the √N wobble (2.6 % of a column) can be shown
   magnified on a labelled scale. Why: T2 "Counts wobble" is about the tops; with the
   full height the tops move by about 20 px at room size. Optional if 7 lands.

9. **`style.js` / `hist.js` (core): the mass range in whole data bins.** Record 401's
   candidates run from about 1 813 to 1 915 MeV/c², so the bins at the series' edges are
   partial: 1 810-1 816 hold 3, 29 and 812 entries, 1 912-1 920 hold 589, 24 and 2 (counted
   from d0.f32). The 1 814 and 1 912 columns read as dips in the data at the window's
   edges (review: slide 15). Suggest `MASS = { lo: 1816, hi: 1912 }` (whole bins inside
   the stripping window), or a hist that drops a bin the data covers only in part. t2
   kept lab 2's `h2` on the series' 1 810-1 920, so that its peak stands where every other
   D⁰ plot's does.

10. **`hist.js` (core) and the floor station's `h` in lab 2: one unit for the mass.** The
    default/lab caption is `m(K⁻π⁺) MeV`; the nums say `MeV/c²` (review: slide 14 low).
    t2 changed its own stations (`h2`, `roll`) to `m(K⁻π⁺) MeV/c²`; core's `h` (lab 2
    floor station) and any default caption in hist.js should match.

11. **`label.js` (core) l.21:** the default label colour is the literal `'#f2f5f9'`, not a
    palette role. Suggest no default (callers pass `roles(p).tick`/`.sel`), or take the
    palette as an argument. **`hist.js` (core) l.112** and **`scatter.js` (t4) l.224**
    name an unnamed stepper with `Math.random()`, which is unseeded and differs per load:
    use a module counter (`dk-hist-${k++}`) or require `name`.

12. **`README.md` (core): sync t2's sections** with the options this round added:
    dk-spark `halo.ref` (13: ring grains keep their pixel size from any distance);
    dk-vertex `namePx` default 28 (names in `P.crowd`, opacity 1, weight 600),
    `trailAlpha` 0.9, `landSize` 2.2; dk-bell `size` 0.65, `alphaGain` 1.5, `selGain` 1.7,
    `litSize` 1.9, the zoom whitening the magnified tail and fading the axis left of
    `from`. The source headers of spark.js, vertex.js and bell.js carry the same text.
