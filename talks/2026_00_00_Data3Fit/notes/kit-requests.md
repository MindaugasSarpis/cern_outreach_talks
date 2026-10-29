# Kit requests from Data3Fit (deck step, 29 Oct)

What the deck needed from `components/data-kit/` and could not get, or got only in part.
Each: the form, what, why, the slide. None blocks the deck; the closest honest picture is
in `deck.md` and noted in `notes/outline.md` Decisions.

1. **dk-hist `{shift}`, look (slide 9).** At the series' mass scale 0.37 MeV/c² is 0.09 world
   units: on the close pose (dist 7) the grains and the curve's summit move about 15-20 px, and
   the two marks (1 864.47 dim, 1 864.84 white) stand that close. Ask: an option for the shift
   step to draw the moving grains' trails for a moment (or a brief white flash on the grains
   that change bin), so a still and a recording show that every grain moved. Why: the outline
   gates the slide on its burst strip; if the motion does not read, the slide folds into slide 8's
   notes (outline drop order 5).
2. **dk-curve, per-step `alpha` or `thick` (slide 9).** On a close pose (dist 6-8) the curve's
   line blooms into a broad glow that covers the summit's columns and the two marks it should sit
   between. Ask: `alpha` (and `thick`) as step keys, so a close slide can thin the line without a
   second curve object. Why: the summit's glide from one mark to the other is the slide.
3. **dk-hist readout, window-only count on a `split` plot (slide 11).** `readout: 'count'`
   counts every grain landed, window and sidebands alike, so the counter is named "candidates"
   and reads 2 000 → 596. Ask: `readout: 'window'` (white grains only), so the number could be
   named "signal" from the first click. (Outline Decision 8.)
4. **dk-hist, our grain clear of the axis (slide 14).** Our grain still lands at the foot of its
   1 880-1 882 column, so dk-spark's ring sits on the axis line next to the 1 880 tick
   (requests-t3 item 9). On the reframed close pose it reads, but a slot a few grains up its
   column would clear the axis.
5. **dk-hist `{subtract}`, a still that shows it (slide 11).** As requests-t3 item 8: nothing in a
   still says a subtraction happened; a faint ghost of the removed sideband grains would let the
   shots and a paused frame show it.

Not a kit request, for the record: a camera move on a click inside a slide (outline slide 2,
click 4) has no slide-level key besides `stops`; the deck splits that beat into its own slide
(slides 2 and 3).

## From the fresh-eyes review (29 Oct, fix:data3fit)

6. **dk-curve pull row, guides (slides 4-5).** The pull row's zero line is 3 % of the grains at
   0.7 dim and hardly shows at dist 22-28, and the row has no scale, so "the S of large pulls"
   and "within ± 2" are not on the picture. Ask: `pull.guides: [-2, 2]`, dim dotted lines at
   those pulls across the row, each with its number at the left end, and a brighter zero line.
   The deck stands in with a dk-hist `ticks` step: a dim vertical ruler at 1 817.6 from −2 to
   +2 and three zero-length marks carrying "+2", "0" and "−2" (`label: 'above'`, set 0.06 H low so each number centres on its level), which depends
   on the pull row's default `y` (−0.38) and `height` (0.17).
7. **dk-landscape dims 1, Δχ² ticks (slide 8).** `yticks` works only on dims 2, and a dims-1
   slice shows its level number and caption only with `ring`. Ask: `yticks` on dims 1 (e.g.
   `[1, 4, 9, 16]`, dim short marks at the slice's left end with their numbers), so "Δχ² = n² is
   n errors" and the band's height (11.5-17.8) can be read on the slide. The deck shows the
   Δχ² = 1 bar (`ring: true` with `ball`) as the one-error scale instead.
8. **dk-landscape dims 2, axis captions (slide 6).** The bowl's tick numbers carry no name or
   unit (`ticks` takes numbers only, `word` shows only with the slice). Ask: `word: { x, y, z }`
   captions in the hist's style ("μ MeV/c²" on the front lip, "width MeV/c²" on the right edge,
   "Δχ²" up the height). The deck drops the width ticks and keeps μ's (the .nums μ names them).
9. **LABEL px for the series (all five talks).** Tick numbers at `LABEL.px` 24 on a 1080 frame
   are about 12 px on the 980-wide canvas, under the house floor of 18; on slides 7-9 the
   values the slide carries (bar ends, the world value, the two marks) exist only as labels.
   Ask: `LABEL.px` 36 and `captionPx` 36 in style.js. This talk sets `tickPx: 36` on each form
   meanwhile (the hist caption stays 24: no override); drop them when the kit changes.

## From the motion review (29 Oct, final:data3fit)

10. **dk-curve, `replay: false` (or a step-level `draw`) on an arrival (slides 9, 13).** A cut back to the
    mass station arms the station's forms: dk-hist with `replay: false` stands again in 0.35 s, but dk-curve
    always waits for its hist and then draws on from the left in 1.2 s, so a fitted curve that stood when
    the camera left is missing for the first 1.5 s of the cut back. Ask: `replay: false` on dk-curve (object or
    step), as dk-hist's: on an arrival the curve stands at once with its hist. Why: the motion review asked for
    the summit to be present at 0.0 s on slide 9, and the same holds for slide 13 (the weights).
11. **dk-hist, a hidden plot's frame (slides 9, 13).** A dk-hist that has never stood on the page keeps `dy = 1`
    and `colMax = 1`, so a dk-curve drawn over its first arrival starts at a scale hundreds of times too tall
    and glides down (slide 9's take: a white bar across the top of the frame, then a flat-topped trapezoid,
    at 0.4-1.8 s). The deck works round it by keeping `h` and `fit` standing at the mass station, out of
    view, while the camera is at the slice and decay-time stations (slides 7-8, 10-12). Ask: compute the frame
    of the wanted step at load (or of step 1), so `frame().y` is right before the first transition.
12. **dk-hist window, a contrasting mean tick and a gap mark (slide 3).** A window's mean tick is white like
    the window's grains, and 0.4 MeV/c² is 0.1 world units: at dist 9 the click moved 0.5 % of the pixels.
    The deck reframes at dist 7 and stands a white dotted mark at 1 864.42 beside the dim world mark on the
    click (a `ticks` step). Ask: `meanTick: { tone, y }` for a taller mean mark, and a `gap: [a, b]` key that
    draws a short horizontal bracket between two values with its size as a label.
13. **Stage: a camera move on a click (slide 3).** The review asked for a push from dist 9 to 6 over 0.8 s on
    the click; `stops` needs orbs and lights them. Ask: `clicks: { 1: { space: {...} } }` or a `poses` list
    stepped by clicks, without the highlight.

Toolkit (slidev-videos), for the record (no change in the deck can reach these):

14. **record.mjs, slide 1 (the cover, also T4's).** Slide 1 is filmed from the page's first frame: about 0.5 s
    of a grey veil while the world boots, then the plot at a different scale and place until the first
    assembly (0.6 s of the page's clock), then the cover's own pose. The other slides are filmed after their
    predecessor settled. Ask: for slide 1, run the boot (canvas sized, first assembly armed) before frame 0, or
    a `--from-black` that starts slide 1 on the stage's first painted frame. Why: the cover must open on T2's
    last frame exactly.
15. **The clip's web encode for frame-stepped recording (slide 10).** The `standard` profile's long GOP with
    B-frames (100-frame GOP, 3 B-frames) shows black macroblocks when the recorder seeks it frame by frame.
    The local web copy is re-encoded by hand (`-g 25 -bf 0`, CRF 19, 8.5 Mbit/s cap); the release copy is not.
    Ask: a manifest key (`gop`, `bframes`) or a `record` profile, so `encode` and `publish` make that copy.
16. **dk-hist, a landing glow's strength (slide 12).** When some 68 000 grains land within about a second
    (slide 12's arrival: every candidate over the 2 000), each grain's landing glow (alpha × 1.8, size × 1.5,
    `exp(−3t)`) adds up to a white bloom round the tallest columns for about a second (luminance 16.9 →
    26.7 → 19.4), even with `glowTint: 0`. Ask: a `glow` field and step key (0..1, default 1) that scales
    the landing glow, so a dense refill can land quietly.
17. **slidev-addon-videos, a clip's last frame on a DOM cut (slide 10 → 11).** With the series' `transition: dust`
    (no Slidev CSS transition) the clip slide's player leaves the DOM at once, and the dust overlay draws its
    break-up a frame later: slide 11's take dips for one frame (luminance 59 → 42 → 56). Under `fade` the old
    slide stayed while it faded and there was no dip. Ask: hold the clip's last frame (or the overlay's first
    sheet) on the frame the slide changes.

## The steward's answers (29 Oct, polish:data3fit)

Items 1-11 and 16 applied in the kit (notes/steward.md, Data3Fit) and taken by the deck, except item
3's `readout: 'window'` (declined in the deck: "signal" would name the 1 172 window grains before the
subtraction) and item 11 (the out-of-view standing plot is kept until a take confirms the load-time
frame). Item 12 declined by the steward; 13-15 and 17 are toolkit asks and stay open there.

## From the review of 29 Oct (fix:data3fit, second pass)

None blocks the deck; each has a stand-in in `public/data/space.json`.

18. **dk-hist window, a mean tick's span and depth (slide 3).** The window's own mean tick stands at z 0
    over the window's top (0.04-0.16 H above it), while a tall step tick stands at z 0.6 × depth from its
    own `y`: at dist 7 the mean (1 864.81) and the world mark (1 864.84) stood about 20 px apart by
    parallax and at different heights. The deck sets `meanTick: false` on h steps 4-5 and draws the mean
    as a white step tick at the world mark's span (`y: [0.9, 1.16]`), so the two coincide as one line;
    the mean no longer glides between the two windows of slide 3 (the step ticks crossfade). Ask:
    `meanTick: { y, tone, z: 'tick' }`, a mean tick drawn like a step tick and still gliding.
19. **dk-landscape dims 1, the ring without its crossing labels (slide 8).** `ring: true` always labels its
    two crossings, so slide 8's bar ends (1 864.38, 1 864.57) stood 15 px apart and read as one string.
    The deck drops the ring on s2 (no Δχ² = 1 bar) and labels the ball's value with `ticks`
    (`{ v: 1864.47, text: '1 864.47' }`); the levels 1, 4, 9, 16 carry the error scale. Ask:
    `ring: { labels: false }` (or a `crossLabels` field), so the one-error bar can stay unlabelled.
20. **dk-curve pull guides, density and brightness (slides 4-5).** The zero line and the ±2 guides get
    3 % of the grains (every other grain of a guide shown, alpha 0.55): at dist 22-28 they hardly showed.
    The deck raises the share with the curve's undocumented `split: { zero: 0.15 }` and 14 000 grains.
    Ask: `pull.guides` as an object (`{ at: [-2, 2], alpha, grains }`), documented.
21. **dk-hist, a fade-out step (slide 6).** An `alpha` drop eases in 0.4 s and `h: 0` in 0.35 s; the
    review asked the tipped plot to go during the camera's 1.5 s rise. The deck uses a `cut` that takes
    every grain (`["M", "<", 0]`) with `axis: false`, so the grains lift away as dust by about 2.5 s,
    and fades the curve with a fit step `{ alpha: 0 }` (0.8 s). Ask: `fade: seconds` as a step key (the
    grains, frame and labels to 0 over that time), so a plot can leave without the dust reading as a cut.

Toolkit (slidev-videos), for the record:

22. **shots, `.nums.out` (slide 14).** `slidev-stage-shots` finishes every CSS animation, so a still of a
    close with `.nums.out` shows the bare picture without its number (slide 14's 20 993). A take plays it
    on the page's clock (in at 1.5 s, out at 11 s). Ask: finish the `dk-nums-in` animations but hold the
    `dk-nums-out` ones at their start for stills, or a `--stills-at` that names the moment.
