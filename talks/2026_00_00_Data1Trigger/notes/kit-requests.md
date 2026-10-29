# Kit requests from Data1Trigger (draft:data1trigger, 29 Oct)

For the kit lane (`components/data-kit`, branch kit/data-series). This talk does not edit
the kit.

1. **dk-heap `oursFrom` a fixed point** (form dk-heap; slide 14). What: accept
   `oursFrom: { at: [x, y, z] }` (world or station frame) besides a form's name. Why: on
   slide 14 the lane (`trg`) is hidden as the heap rains, and a cold-opened slide 14 (shots,
   a jump) would read the hidden lane's packet wherever its step 0 puts it. The deck works
   round it with an invisible dk-spark `fp` (alpha 0, no halo) at the fold point.
2. **Clock.vue / Crossing.vue in the kit** (bible §4 components row; slides 1-2). What: the
   series' Crossing (start the shared `lhc-collision` on a slide's entry, fade it on leave)
   and the ns Clock tied to dk-glow's fronts (`api.value()` × 25 ns). Why: T1 and T5 both
   draw the crossing; T1 slide 2 would show the running ns with a Clock. T1 holds a
   talk-owned `setup/Crossing.vue` for now and shows `25` ns alone.
3. **`lhc-collision` on the step bus** (components/lhc-opening; slide 1-2). What: let the
   collision also follow a stage step (`steps: { crossing: 0 | 1 }`), so stage:check sees
   it hidden and stops counting its 200k on every slide. Why: the outline's budget case (a)
   assumes a hidden collision does not count; today stage:check counts it everywhere
   (535k at most, under the 600k budget, but near the engine's 503k cap noted in the kit
   README).
4. **dk-heap `api.value()` lands one over `n` with `oursFrom`** (form dk-heap; slide 14).
   What: with `oursFrom` set, `<StageCount for="heap" :to="91583">` settles on 91 584 in
   the shots (heap.js `value()`: `(base + upper(arrTimes, now)) / N · n`; our glided grain
   seems to be counted twice). Why: a wrong count on screen. The deck counts on its own
   clock (`<StageCount :to="91583" :delay="300" :ms="6500">`) until the kit fixes it.
5. **dk-glow: the sparkle of hits in the crowd's colour** (form dk-glow; slide 3; fix:data1trigger,
   29 Oct). What: an option for the sparkle's colour (`sparkle: 'crowd' | 'sel'`), or the
   crowd by default. Why: the sparkle is mixed toward `uSel` (white) in glow.js, and white is
   "ours / kept" in the series grammar; over slide 3's glow it reads as selected hits, while
   it stands for every crossing's hits (the fresh-eyes review of T1). Slide 5's readout
   stream is already light blue (the detector's `hot: '#7dd3fc'`), so slide 3 is the only
   white that means "every crossing". Until then slide 3 shows it as is.

## From the motion review (final:data1trigger, 29 Oct)

Data kit (`components/data-kit`, branch kit/data-series):

6. **dk-lineup `wait` per step** (form dk-lineup; slides 6, 11-12). What: a pile's `wait` keyed by
   step (`wait: { "3": 2.4, "5": 0 }`), or a `sets` entry that carries its own waits. Why: the
   day's pile waits after the 1 TB sphere and the pile of 4 on slide 6, but on slide 12 it should
   gather at once. The deck sets `tb: 5` already on the clip slide 11 and shortens the day's
   wait from 3.8 to 2.4 s, so the gather is running when slide 12's clip breaks up (the world
   rests under a covering clip, about 2.5 s after slide 11 opens). That leans on the clip's
   timing.
7. **dk-trigger: a visible spray where a gate drops packets** (form dk-trigger; slides 8, 10).
   What: the dropped packets' grains thrown outward for about 0.4 s as they burst (a `spray`
   option), and a burst staggered over about 0.4 s (`burstSpread`). Why: the reviewer's slide 8
   (29 of 30 to dust; the deck now lands the camera at the gate, dist 8, where the burst reads)
   and slide 10's one-frame luma spike of 1.35 when 9 in 10 burst at once (low, open).
8. **dk-spark: a ring gather time** (form dk-spark; slides 1, 13). What: `haloIn` seconds
   (default 0.5, the fade it has now), and an option to gather the ring's grains in from
   outside rather than fade. Why: the reviewer asks for 0.6 s gathers on the cover (as the
   bunches meet) and on slide 13.
9. **dk-ground: a floor that reads from 10-20 units** (form dk-ground; slide 13). What: an
   `alpha` per step, or a near-distance gain. Why: on slide 13 the floor 9 units below our
   folded grain does not show (bottom-third luma 0.2 on 255 at pitch 8, 14 and 24 alike), so
   "the floor fades in below" is not seen. The deck cannot raise g2's alpha: slide 14's last
   frame is T2's cover, and the floors must match.

Toolkit (slidev-addon-stage, slidev-addon-videos, slidev-videos; for the toolkit lane):

10. **Clip-to-world hand-over blink** (slidev-addon-videos dust leave + the stage's resume;
    slides 5 and 12). What: keep the `<video>` drawn until the leaving dust's first frame is on
    screen. Why: both takes blink dark for one frame at 0.04 s (slide 5: luma 72 → 48 → 68;
    slide 12: 42 → 25 → 39 after the deck's dim tail, 124 → 74 → 115 before).
11. **A dust arrival that starts at once** (slidev-addon-videos dust enter; slides 4, 11). What:
    the grains visible from the slide's first frame. Why: slides 4 and 11 sit near black for
    about 1 s before the grains show (slide 4: 0.4-1.0 s; slide 11: 0-1.0 s).
12. **A fade-out field in the videos manifest** (slidev-videos encode; slide 11's clip). What:
    `tail = { at = "0:11.4", dur = 0.6, to = 0.3 }` (or `fade_out`) applied at encode. Why: the
    tape cut is a white room to its last frame; the deck darkens its tail with a talk-owned
    `videos/dim_tail.sh` after the encode, which a plain `videos:encode --force` would undo.
    Also: the strip's tiles are every 4 s, so a deployed deck (release clips, no CORS) breaks
    up from the 8 s tile, not the dimmed last frame; a last tile at the clip's end would help.
13. **Per-click camera keys** (slidev-addon-stage; slide 8). What: `space: { clicks: { 1: {
    at, dist, yaw, pitch, flight } } }`, a pose (or a path) that a click flies to without
    restarting the slide's path. Why: the reviewer asks for slide 8's click to bring the camera
    to the first filter; `stops` light a shell and need records. The deck instead lands the
    flight at the gate (dist 8, yaw -15), away from T4's echo of the old pose (dist 22).
14. **The recorder's frame 0** (slidev-stage-record). What: start a take on the first frame
    after the slide's DOM has changed. Why: every take's frame 0 still shows the slide before
    it (its numbers, or the cover's title on slide 2: a 3.5 luma drop at 0.04 s), which the
    review read as numbers carried over at the cut.

## The steward's answers (29 Oct) and what this deck did (polish:data1trigger)

- 1 `oursFrom { at }`: used. `heap` takes `oursFrom: { at: [-2, 9, 0] }` (slide 13's fold point,
  x 98 in world); the stand-in spark `fp` is gone from space.json and every slide's steps.
- 2 Crossing.vue, 3 `lhc-collision` on the bus: declined (toolkit / lhc-opening). The talk-owned
  `setup/Crossing.vue` stays; still open for the main loop.
- 4 `value()` one over `n`: used. Slide 14's count is `<StageCount for="heap" :to="91583" />` again.
- 5 sparkle colour: the default is light blue now; slide 3 needs nothing.
- 6 lineup `wait` by step: used. The day's pile waits `{ "3": 2.4, "5": 0 }`: slide 6 keeps the
  reviewed 2.4 s (the steward suggested 3.8; not taken unseen), slide 12 gathers both piles at
  once, and slide 11 (the clip) no longer pre-sets `tb: 5`.
- 7 spray, burstSpread: used on `lane` and `trg` (0.8, 0.4). Slides 8 and 10 need a motion retake.
- 8 ring gather: used. `s1` step 1 (cover) `delay: 7.8, haloIn: 0.6, haloGather: true` (the point
  and its ring gather as the bunches meet at 8.3 s); `s2` step 1 (slide 13) `haloIn: 0.6,
  haloGather: true`. Not seen in motion.
- 9 floor alpha by step: used. `g2` `alpha: [0, 2.4, 1]`: slide 13 is g2 step 1, slide 14 step 2
  (alpha 1, T2's cover floor).
- 10-14: declined (toolkit), still open.

## fix:data1trigger (29 Oct, the second review)

15. **A record-only mark on the page** (slidev-stage-record; slide 14). What: the recorder sets an
    attribute on `<html>` (say `data-record`) while it takes a slide, so a deck can write
    `html[data-record] .nums.out` and `html[data-record] .credit` fades for the take's last
    1.5 s. Why: the review asks that slide 14's last recorded frame equal T2's bare cover (no
    `91 583 candidates`, no credit line); `.nums.out` alone also fades the number in the shots,
    the stills, the PPTX and the print (tried and reverted in polish:data1trigger). Until then
    the number and the credit stay to the end of the take.
16. **The detector against the fronts** (kit `detectorParts`, dk-glow; slides 1-5). What: a
    series colour for the detector one step deeper than the crowd (this deck now writes the
    palette's `dust` #4d8cb8 into every part), so dk-glow's light-blue fronts, the hits and the
    white ring are the only bright things in it. Why: with `detectorParts` (accent on the magnet,
    RICH and HCAL, the preset's near-white on the trackers and the VELO) the front was the same
    light blue as the grains it ran over, and the VELO read as a white blob beside slide 2's and
    slide 5's numbers. T4 and T5 (whose close lands on this cover) should take the same parts,
    or the kit should change `detectorParts`.
