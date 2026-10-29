# Requests from t4 (dk-scatter), 29 Oct 2026

1. **hist.js: keep the last layout after `{tip}`** (owner: core)
   - What: `api.layout()` or `api.grains({ last: true })`. It would return the rows,
     positions (world) and whiteness of the hist's last shown state, even after its
     grains have faded at a `{tip}` step.
   - Why: when a slide opens on the tip step, or the scatter steps more than 0.4 s after
     the hist, `api.grains()` is empty. dk-scatter then stacks each row in its 2 MeV bin of
     `api.frame()`, which is close but loses the P(signal) whitening and the hist's own
     jitter. With a last layout, the tip always starts from the exact picture T3 ended on.
2. **label.js / hist.js / heap.js: fade with camera distance** (owner: core)
   - What: fixed-size labels should fade out a few form sizes from the camera, and the
     grains of a dense form further out.
   - Why: in lab 4, the tick numbers of forms at other stations stayed fully legible from
     80 units away, because a fixed-size label does not shrink. A 91 000-grain plot 330
     units away showed as one bright bloom point. dk-scatter now does this itself in
     `update(t, camPos)`: labels fade from 4R to 6R, and grains (via `morph.u.uShow`) from
     8R to 12R, where R is the plot size. The same would help any multi-station deck that
     uses dk-hist or dk-heap.
3. **hist.js: keep `stateAt` exported** (owner: core). dk-scatter imports it so the two
   forms merge steps in the same way.
4. **morph.js: `uShow` stays a plain multiplier** (owner: core). dk-scatter drives it for
   the distance fade.
5. **Bible / T4 author** (not a code change): see notes/t4.md "Open". The y axis is log
   decay time. The drawn boundary is the two-input network (0.613), not 0.629. Row 1 is
   class 1 by the mass-window label. The perceptron threshold is 1.386 against the JSON's
   rounded points.
