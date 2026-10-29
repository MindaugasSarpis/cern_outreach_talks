# Requests from t3 (dk-curve, dk-landscape)

1. **Withdrawn (fix:t3, 29 Oct):** dk-landscape now crops the grid itself (`range: [0.4, 0.3]`),
   and the 121 × 121 grid has enough nodes in the crop (about 40 × 45). Was: **bake (d0.py), optional:** a second χ² grid centred on the minimum, μ̂ ± 5 errors and
   width ± 5 errors (e.g. `d0-chi2.json` key `zoom`, same layout as the main grid, no path),
   so the Δχ² = 1 ring is a ring one reads (today it is 1/12 of the μ axis, because the main
   grid has to contain the LM start). dk-landscape reads it with `key: "zoom"` unchanged.
   Why: the bowl slide's ring is a small glow round the ball.
2. **core (hist.js), keep:** dk-curve adds its grains to `api.frame().group` and reads
   `frame().y(1)` every frame; dk-landscape's `under` adds its group to
   `frame().group.parent` (the hist's untilted base). Please keep that parenting
   (`plot` inside `g`) and `frame()` returning the live `dy`. No change asked.
3. **core (hist.js), small:** `api.frame()` could carry the target scale as well as the live
   one, so a curve could ease to it without its own smoothing. Not needed now (dk-curve
   eases on its own); only if core touches frame() anyway.
4. **t2 (dk-spark):** on T3's weights slides our grain (row 1, P(signal) 0.144) cannot be
   found without its halo; the T3 author needs dk-spark on the dense and sparse weights
   slides.

## Added by fix:t3 (review of lab 3, 29 Oct)

5. **core (hist.js:112), small:** the default stepper name is `dk-hist-${Math.random()}`, an
   unseeded value in a builder (differs per reload). Use a deterministic default, e.g.
   `dk-hist-${o.pos.join(',')}-${o.key ?? 'M'}`, or require `name`. Why: the engine contract
   (seeded, nothing random outside the RNG); review finding, slide 0.
6. **core (hist.js), look:** on the tau station (`width 20, bin 0.25, height 9`, dense,
   `{subtract}` + `{cut}`), the white (selected) columns render mid-grey, darker than the
   dk-curve over them, so "selected" reads as dim (lab 3 slide 6). Please check the depth
   shading / `alphaFor` on a plot with few, narrow, tall columns; the bible wants full fg.
7. **core (hist.js), small feature:** a way to colour the bins outside a fit range light blue
   (e.g. `fitRange: [0.5, 5]`: grains outside it keep the crowd colour even when counted).
   Why: on lab 3 slide 6 the two bins below 0.5 ps (the second is the tallest column) stand
   white outside the lifetime curve, which starts at 0.5 ps; a student reads "the fit misses
   the tallest bar". With them light blue they read as "not fitted".
8. **core (hist.js), optional:** the `{subtract}` still shows only the survivors; nothing in a
   still says a subtraction happened (lab 3 slide 5). An option to keep the removed
   sideband grains at low opacity beside their columns (e.g. `subtract: { ghost: 0.15 }`)
   would let a still show it. Lab 3 now shows the live survivor count (596, `signal`).
9. **core (hist.js), optional:** our grain (row 1) sits at the bottom of its 1 880-1 882
   column, so dk-spark's ring overlaps the 1 880 tick number on the weights slides (lab 3
   slide 7). If the hist placed our grain a few slots up its column (or at a fixed share of
   its height), the ring would clear the axis. Not blocking.
10. **t4 (train-perceptron.json lossGrid), for T4's author:** the loss over (w1, w2) at the
   fitted b has its minimum (2.1, 2.26) near the grid's far corner (grid −0.5…3.5), so only
   two walls rise; dk-landscape draws it as a tilted net with a ball even at height 8, zmax
   2.3, pitch 42 (lab 3 slide 9). A grid centred on the minimum (e.g. w ∈ min ± 2.5) would
   show the far walls; how steep they rise is the data's (logistic loss grows slowly on the
   far side).
