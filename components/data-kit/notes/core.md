# core: the kit's foundation, dk-hist, dk-heap (29 Oct 2026)

## Files

- `index.js`: `installDataKit({ app, stage })`. It sets up `MODULES`, `DK_TYPES` and
  `DK_TYPE_LIST`, the data loaders, and the forms registry (`kit.register` / `kit.form`).
- `style.js`, `rng.js`, `sampler.js` (MasterTalk funnel.js l.78-88), `label.js`.
- `morph.js`: the grain engine (`createMorph`, `staticGrains`). This file was not named in
  the task. It holds what dk-hist and dk-heap share, and other forms may use it too.
- `hist.js` (dk-hist), `heap.js` (dk-heap), `check.mjs`, `README.md`.
- Stubs: trigger, glow, lineup, ground (t1); spark, vertex, bell (t2); curve, landscape
  (t3); scatter (t4); pipeline (t5). Each carries `// STUB: owned by <label>`.

## Decisions

1. **One grain engine.** Every dk-hist step is a target state per grain (`{pos, vis, white}`).
   `morph.go` moves every grain from where it is at world time t, so a step taken mid-flight
   does not jump. A step back is instant (0.35 s), and an arrival or `c` replays from
   nothing. This replaces the three copies' share-based fill shaders. Alternative: keep
   KJ's share shader and bolt the new steps on.
2. **Steps merge** (step k = steps 1..k, `null` drops a key), so a later step keeps the
   window, the cut and the sort it builds on.
3. **The y scale is the fill set's tallest bin.** A cut, a selection or a subtraction
   keeps the scale, so the loss shows; a step that adds grains rescales.
4. **Sparse sets stand as a dot plot** (lattice, rows at most 3 grain widths apart). This
   comes from looking at the lab: 1 000 grains jittered over the full height read as dust.
5. **Alpha follows the tallest column** (`alphaFor`, 1.3·(60/k)^0.25, between 0.3 and
   1.5); the size never changes (`GRAIN` 1.25 everywhere). The fragment's (c·a)^2.2 makes
   alpha strongly non-linear: 0.16 left the D⁰ peak almost black.
6. **The heap and the hist share one order** (`rng.order(n, seed, ours)`). The heap rains
   rank 0 first. The hist takes the reverse (the top of the pile first), so our grain sits
   on the summit and is the first to land in its bin, as T2 says.
7. **Labels** are sprites without size attenuation, rescaled in `onBeforeRender` to a fixed
   share of the frame: `px` is the font size on a 1080-high frame, never under 18. They
   take the scrim's dim through `userData.dimOp`.
8. **stage:check types.** The checker reads `registerBuilder` only from the talk's own
   `setup/`, so each deck lists the kit's types in `package.json`'s `stage:check --types`
   (lab 2 does), and `check.mjs` checks the required fields. I edited lab 2's
   `package.json` (one line) to get `pnpm talk check datalab2` green. That file was not in
   my list, but the lab is scratch.
9. **`options: { aberration: 0 }`** in lab 2's headmatter. The post-process aberration
   fringed the tick numbers red and blue.

## Verified (lab 2, `pnpm talk check datalab2` green, shots on d3d12)

- Slides 1-6 (`talks/2026_00_00_DataLab2/shots/sheet.png` from the 1-6 run): the heap;
  the sparse slide with the first 1 000 sorted out of it (a dot plot, StageCount 1 000);
  the dense slide (91 583, the D⁰ peak reads at a glance); √N whiskers on the flat bins
  (1 461 / 38); the window 1850-1880 in white with the mean tick (StageCount 1 864.79);
  the IPχ² < 9 cut (StageCount 53 194). The counts on screen came from `api.value()` and
  match the bake.
- Slides 7-12 (test slides, same deck): `{weights}` whitens the peak; `{select: 60}` with
  the peak row; `{tilt: 55, focus: 0.6}`; `split` on TAU and `{subtract}`; a model toy
  with `{resample}` and `{errors}`.

## Not verified

- `{shift}` (no picture: at 0.02 % it is a tenth of a bin), `{rise}`, `{tip}` with a real
  dk-scatter, `{alarm}`, the `src` (binned counts) source, `from`/`fromSpread` arcs.
  These run through the same engine but have not been seen.
- Stepping back and forth live (shots open each slide on its own). The logic is that a
  back step is a 0.35 s jump to a state computed from the steps, which leaves no
  per-event uniforms behind.
- Tier 2/3 (unit > 1 thinning, heap rows past the budget falling from above instead of
  leaping from the pile).
- The heap's step 3 (ball) and the rain at step 1 as a picture (only step 2 was shot).
- The other labs build with the stubs: no lab but lab 2 installs the kit yet.

## Open

- The sparse slide is honest but quiet: 1 000 grains in 55 bins is a noisy dot plot
  whose peak barely shows. T2 may want the camera closer (dist ~16) on the peak for its
  sparse beat.
- The model toy of 14 flat bins at 1 461 is a block of grains, and its √N band is thin
  against the block (as it is in the data). T2's "tops tremble" beat may want the camera
  on the tops.
- `peaks.zoom` is a magnified ruler (0.43 MeV of peak spread is 0.1 world units at the
  series scale). T5 decides between a close camera and the zoom, and says which in the
  notes.
- The tau `{subtract}` leaves about a third of the column height (window minus scaled
  sidebands, against the window + sideband fill). That is correct, but T3 may want `max`
  pinned to the window-only height.
