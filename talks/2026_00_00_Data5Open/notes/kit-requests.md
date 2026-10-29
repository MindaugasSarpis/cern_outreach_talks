# Kit requests from Talk 5 (Open data)

Written 2026-10-29 by the deck draft (draft:data5open). Each: the form, what, why, the slide.
The deck works around each one as noted; none blocks the draft.

1. **Crossing component (components/, with T1).** Lift lab 1's `setup/Crossing.vue` (the
   bus start of `lhc-collision` when its slide is entered) into the kit or
   `components/lhc-opening`, with an option to start the run so the crossing falls at a
   given slide time. Why: T1's cover and T5's close both start the same collision; T5 has a
   talk-owned `setup/RouteCrossing.vue` (bus.set on enter, 0 on leave) and times the
   crossing with the object's `approach: 38.3` engine-seconds, so it crosses as the
   slide's `rate` falls to 0.02 at the end of the 42 s crane. Slide 12.
2. **lhc-collision and the grain budget.** stage:check counts the collision's declared
   200 000 grains on every slide (no step drives it), though it draws nothing until its
   bus starts it. T5 names a step `crossing` (0 until the close, 1 there) only so the
   checker counts it on slide 12 alone. Ask: the collision reads its step from the
   stage bus too (or the checker learns its lhc bus), so the step is real. Slides 1-12.
3. **dk-pipeline `api.ours()` for the sheet.** dk-spark cannot follow row 1 on the sheet;
   T5 places the ring by hand at the first value of the sheet's top row
   (`at: [-14.7, 11.04, 0]`, computed from the sheet's `at`, `size`, `rows` and the cell
   width in pipeline.js). Ask: `api.ours()` on dk-pipeline giving row 1's grain on the
   newest stage that draws it (the ball, then the sheet), so `on: 'pipe'` works. Slide 6.
4. **dk-heap: our grain rising out of the pile.** The outline's close has row 1's grain
   rise out of the heap as the camera passes; dk-heap has no such step (our grain stays on
   the summit). T5 rings it there with a second dk-spark (`s2`, `on: heap`). Ask: a heap
   step (or a dk-spark `from: heap`) that lifts our grain off the summit. Slide 12.
5. **dk-lineup: a camera cue on a step.** The outline wanted the pull-back to frame the
   grown 4 PB pile on the grow click; a click cannot move the camera, so T5 pulls back on
   the slide's opening `path` (sphere held 4 s, framed by 10 s) and the clicks bring the
   800 TB pile and its growth inside that frame. Not a kit gap so much as a stage one:
   a per-click `path` would restore the outline's beat. Slide 5.
   **Answered 2026-10-29 (fix:data5open) by splitting the slide:** 5 holds the 1 TB sphere close,
   6 cuts to the pulled-back pose and gathers the pile on arrival. Kept as a stage wish only.
6. **Not kit, the lint (scripts/talk_lint.py, for the main loop).** The cover's plain title
   is flagged TEXT whenever the headmatter says `onscreen: numbers` (bible §3 requires it),
   because slide 1's own frontmatter is the headmatter, and
   `words_ok = own == "words" or (s.layout == "cover" and own != "numbers")` then refuses
   the cover. A one-line fix: read `own` for slide 1 as unset unless it is `words`. T1 and
   T4 hit the same. Slide 1. Until it lands, the warning is waived in the talk's Decisions
   (2026-10-29, fix:data5open): `pnpm talk lint` exits 0 with this one warning.

Added 2026-10-29 by the review fixes (fix:data5open); slide numbers are the 14-slide deck's.

7. **dk-pipeline: a versions stage and a pinned third run (bible decision 19).** Slide 10
   claims only "same file, same code, same hash"; the versions half of the lesson (the pinned
   environment) is said aloud, not drawn, because nothing exists to draw: no committed lockfile
   for bake/d0.py and no rerun in a second environment. Ask: commit
   `bake/requirements.lock` (numpy== and scipy== pinned), run `d0.py --check` under it in a
   second, separate environment, file `d0-rerun-second-env-worked` with d0-fit.json's sha256
   from both, and give dk-pipeline a `code` stage drawn from the lockfile (bake/code.py) plus the
   `run.third` pass landing on the first two (seen so far as code only). Then a slide "another
   machine, same pinned versions, same hash" can follow slide 10. Slide 10.
8. **dk-pipeline: per-stage alpha as a step key.** The establishing shot (slide 9) wants the two
   code stages dimmed (about 0.5) so the file and the plot dominate, while slide 7 and 8 keep
   them bright. Today `alpha` is one object field for code and sheet together. Ask: a step key
   (or per-stage `alpha`) that dims chosen stages on a step. Slide 9.
9. **dk-spark: lift or shrink the ring per step.** When our grain is the first grain in its
   column it sits on the axis line, and the ring (0.028 of the frame's height) covers the
   1 880 tick number below it (slides 2, 10, 13; slide 9 now hides the ring for this). Ask: a
   per-step `halo` object (r, alpha), or an `offset` that keeps the ring above the axis line.
   Slides 2, 9, 10, 13.
10. **Series style: the `.nums` block above the lower third.** Every content slide's numbers sit
   at y 561-727 of 900, inside the lower third that docs/talk-quality.md section 4 keeps clear.
   The block is each talk's own styles/index.css (`bottom: 96px`), copied five times; moving it
   in one talk would break the series' look and every framed pose. Ask (owner and main loop):
   either a series-wide move (e.g. `bottom: 34%`) with every talk's poses reframed, or a
   recorded owner waiver for stage number blocks in the series bible. All slides.

Added 2026-10-29 by the motion-review fixes (final:data5open); slide numbers are the 14-slide
deck's. Each was found in recorded takes (1280x720, 25 fps) by frame-mean luma and strips.

11. **dk-hist: a sweep order, and busy until the sweep ends.** Slide 11's `{select: [0, 119]}`
   ran the bake's index order, so the count jumped up and down (91 534, 27 316, 14 527,
   55 101 …) every 0.15 s and read as flicker. T5 now sweeps a talk-owned copy,
   `public/dk/t5-select-falling.json` (the same 120 entries sorted by kept count, falling;
   check.mjs warns `not-in-manifest`), at `every: 0.4` (48 s, luma steps ≤ 0.47). Ask: a step
   key `order: 'n'` (or `select: [i, j, …]`, a list) so the deck can drop its copy, or bake
   `d0-select.json` with a `byCount` index. Second: the recorder settled the click take at
   0.04 s although the README says `busy` covers a running sweep; the take was cut at 8 s,
   mid-sweep. T5 records slide 11 with `--hold 55`. Ask: `busy` true from the click until the
   sweep holds at b (including the wait before its first state stands). Slide 11.
12. **dk-hist: a left-to-right landing and a glow cap for a white pass.** Slide 10's second
   pass bloomed white (frame luma 22 → 45.2 against 33.8 settled) because `curve: 0.75` back-loads
   the fill, so most of 91 583 white grains landed, glowing, in the last second. T5 now sets
   h2 `curve: 1`, `glowTint: 0.1`, step `fill: 7` (peak +2.6 over settled). Ask: a step key
   that staggers the landing per bin from left to right (as `{weights}` does), so the white
   rises column by column as the notes say, and a cap on the summed landing glow. Slide 10.
13. **Stage (toolkit, not kit): the world's canvas fades in over 1.2 s at load.** A cold-opened
   cover showed the stage's lifted backdrop (luma 26) and the ball fading up through it for
   0.6 s: a grey blink at the hand-off from T4's last frame. T5 overrides it in
   styles/index.css (`.stage > canvas.field { transition: none }`) and keys `ambient: [[0, 0]]`
   on slide 1 (frame 0 is now the ball on black, luma 27.0 against 28.4 at frame 25, steps
   ≤ 0.19; the 1.4 left is the world settling over its first second). Ask: no load fade under a `steady` cover (or a `space.intro: false`), and the
   recorder starting a cover take on the first fully drawn world frame. Slide 1.
14. **dk-lineup: a label size at the type floor.** The lineup's fixed-size labels (24 px on
   a 1080 frame) read as about 6 px glyphs at 720p. T5 dropped the world labels and puts
   1 TB, 800 TB and 4 PB in the series' `.nums` block. Ask: a `labelPx` field (or labels at
   the deck's `--stage-type-min`). With request 5 (a per-click `path`), slide 6 could also
   hold closer on the 1 TB sphere and the 800 TB pile and pull back on the 4 PB click: at the
   one pose that fits the grown pile (dist 7.5) the 1 TB sphere is about 12 px wide at
   1280. Slides 5, 6.
15. **dk-hist (low): `ours` dropping alone and its glow.** On slide 12 selection 0's large
   grain drops first, alone, as a white bloom (luma jumps 1.16-1.22 at 1.0-1.1 s), and its
   glow covers the neighbouring bins; the two ± 0.10 dotted lines are hairlines at 720p. Ask:
   `oursLast: true` (ours lands with the others or last), a step-level `oursGlow` (halve
   it), and a `width`/`dash` for a dotted tick mark (2 px, brighter). Slide 12.
16. **dk-spark / dk-hist (low): the ring and the axis before the first grains.** On slides 2
   and 9 the mass axis, its tick numbers and (slide 2) the ring stand on an empty axis for
   1-2 s before any grain leaves the ball; slide 9 also opens with slide 8's ring for
   0.4 s. Ask: the axis fading in with the first grains (an `axisWith: 'grains'`), and a
   dk-spark step that rings our grain when it lands (`when: 'landed'`) or a `delay`.
   Slides 2, 9.
17. **dk-hist (low): `{cut}` that fails every row leaves the axis baseline.** Slide 3's
   `cut: ['M', '<', 0]` takes every grain and (with `ticks: []`) the numbers, but a thin grey
   baseline stays at the lower right for the rest of the take. Ask: `axis: false` as a step
   key (the frame fades with the dust). Slide 3.
18. **dk-trigger: the lane between the heap and the buffer draws almost nothing.** On the
   close the crane passes from the heap (x -36) to the buffer (x -111); the lane's generic
   packets between them barely lift the frame off black, so one stretch of about 1.1 s
   (28.9-30.0 s, luma 16.4) stays near-empty even with a wide (dist 34) key and a 3 s leg.
   Ask: a `laneAlpha`/`packetSize` (or denser `packets` that the budget allows), so the lane
   itself carries the crane between stops. Slide 14.

Added 2026-10-29 by the polish pass (polish:data5open); slide numbers are the 13-slide deck's
(the old slide 5 folded into 6).

19. **Stage (toolkit, not kit): steps keyed by slide time.** The close needs steps that change
   during one recorded slide: our grain lifted out of the heap and glided to the crossing at
   24 s (`s` 8, with `s2` 0), the lane turned off at 33.5 s (`trg` 0) so the last frame is Talk 1's first.
   T5 sets them from its talk-owned `<RouteCrossing :later>` with `setStepLater`. Ask: timed
   steps in the frontmatter (e.g. `steps: { trg: [[0, 3], [33.5, 0]] }`, like `rate` keys),
   so a still or a print shows the slide's end state too. Slide 13.
20. **dk-spark (low): a multi-key glide.** A step's glide is one straight, eased line; the
   ring's trip from the heap to the crossing (124 units) runs just above the lane rather than
   rising off the heap and arcing back down it. A step with `from: '<heap>'` followed by a
   second step drops the heap's claim (the grain would reappear on the summit), so the deck
   cannot chain two moves. Ask: `path: [[t, [x, y, z]], …]` on a step, or a claim kept across
   steps that name `keep: '<heap>'`. Slide 13.
21. **dk-spark: a `from` step replayed on assembly.** A spark in the destination station
   whose current step has `from: '<form>'` replays the whole move when the camera reaches the
   station (`assemble` → apply 'arrive'), and resets `show` to 0, which at bullet time (rate
   0.02) takes about 25 s to come back. Slide 13's ring, gliding from the heap to the vertex,
   was missing from the landing still for this; T5 moved the gliding ring to a spark in the
   pipe station. Ask: an arrival that keeps a move already played (or already ended), and a
   ring that is not re-faded on assembly when it was already shown. Slide 13.

Added 2026-10-29 by the review fixes (fix:data5open, second pass); slide numbers are the 13-slide
deck's.

22. **Kit data: `code-lines.json` is stale against `bake/d0.py`.** `python3 bake/code.py --check`
   reports 4 differences: d0.py is now 927 lines (sha256 1b56015c…, 50 294 B) against the baked
   918 (053d8070…). The drawn range 87-208 still runs from `def read` to the end of the
   Levenberg-Marquardt fit (the new lines are below it), so slides 7-8 and 13 draw the right
   shapes, but the notes can only cite the old hash. Ask: re-bake code-lines.json (bake/code.py)
   and re-check every deck's `lines` range. Slides 6-9, 13.
23. **dk-hist: the axis line's alpha as a step key.** Slide 12 opens on the empty plot (hs step 3,
   `n: 0`), and the baseline (alpha 0.9 in the axis colour) barely reads, so the frame looked like
   a plot that failed to load. T5 draws the plot's two edges as dim dotted step ticks at 1 816 and
   1 912 (`y: [0, 1]`, tone axis) on that step and drops them on the fill (`ticks: null`). Ask: an
   `axisAlpha` (object or step) so an empty plot's baseline can stand brighter. Slide 12.
24. **dk-hist: our grain's own alpha and size.** On slide 11 (hp, 120 peaks at dist 7) our grain,
   size 2.5 at the plot's alpha 1.3, bloomed into a white disc about 250 px across, swamping the
   grains round it, although its tone is the crowd's. T5 lowers the whole plot to alpha 0.9 and the
   ring to 1.0. Ask: `oursAlpha` / `oursSize` (object or step), so our grain keeps its light-blue
   core in a close shot without dimming the others. Slide 11.
25. **dk-lineup: the one-terabyte marble reads dark.** A ball of `n: 1` is drawn as a polished
   marble under the hard studio light (`metalHard`), so at the pose that fits the 4 PB pile it is a
   dark dot (about 12 px, request 14) while the pile's spheres shine. T5's path now lands close on
   it (dist 2.4) and pulls back as the pile gathers. Ask: a `lit` (or `soft: true`) option that
   draws the marble with the pile's soft studio light, so it holds its brightness at a distance.
   Slide 5.
26. **Cross-talk, not kit (T4 and T1 sessions).** (a) T4's close: T5's cover now eases from T4's
   closing pose ([118, 3.1, -300] there, dist 11, yaw -10, pitch 6, the ball centred) to the ball
   right of the title (T5 [-28.2, 3.1, 0], yaw -14: in T4's frame about [115.3, 3.1, -300], dist
   11, yaw -14, pitch 6) over 0.7-3.2 s, so the cut still matches. If T4 ends on the second pose,
   T5 drops its path's first two keys. (b) T1's cover shot sets "THE TRIGGER" in a fallback face
   (Arial-like) while T5's "OPEN DATA" uses the stage face under the same rule: re-shoot T1's cover
   after the webfont loads (or check that `d1-title-in` does not start before it) and compare the
   two covers side by side. Slide 1.
