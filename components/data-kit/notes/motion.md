# Motion fixes (29 Oct 2026)

The motion reviewers' findings on labs 1-5, each with what was done or why it was not. The
`file` column is where the fix landed. "Cut" means the slide's `space` gained a one-key
`path` at t = 0: the camera stands at the new station from the first frame, with no flight,
no streaks and no other station crossing the frame. The arrival assembles at once, under
the deck's dust transition. Between stations 80-300 units apart this replaces the 4.5 s
flights that read as black (findings L2 s14, L3 s3, L4 s6).

## Lab 1

| finding | done | file |
|---|---|---|
| s8 wrong order: black 0-5.8 s, then all piles at once, the big pile flying through the camera | The black came from the lineup being armed by the path's arrival and waiting for an assembly that a `path` only gives at its end (10 s): `armWait` 6 s, then everything at once. The lineup now has `assemble: false` and gathers on its step. New per-pile `wait` (the pile of 4 waits 1.6 s, the day's 3.8 s, as the pull-back starts) and `from` (the day's pile gathers from behind and below, `[0.15, -0.25, -1]`, with no swirl, out of the close camera's path). The single sphere stands within about 1 s. | lineup.js; DataLab1 space.json, deck.md s8 |
| s6 wrong order: slides 5 and 6 share trg 3, gate 2 fired on slide 5 | New gate field `step`: gate 1 at 2, the buffer at 3, gate 2 at 4 (collapse moves to 5). Slide 5 is trg 3: ours glides out onto the buffer shell (`[49, 4.4, 0]`) and parks there. Slide 6 is trg 4. New ours entry fields `lag` and `glide`: gate 2 fires 1.5 s in, and ours leaves the buffer and crosses the ring about 3.6 s in, about 1 s after the pan settles. | trigger.js; space.json; deck s5, s6 |
| s4 meaningless motion: 0 → 2 counted as a jump, the burst never played | A jump from a lane that was not running (step 0 or 1, or a slide opened directly) still fires the step's own gate after its lag, and ours glides from the step before. Slide 4 cuts to the lane (the re-recorded flight still swept past the crossing's vertex bloom, one bright frame at 0.92 s), ours `{ at: 34, lag: 2 }`: gate 1 fires 2 s in, 30 MHz at 1.5 s and 1 MHz at 3.5 s. | trigger.js; deck s4 |
| s7 wrong order: on a step back ours glides upstream through gate 2 and un-shrinks; the ring fades to nothing | A step back holds ours where it stands. The shrink a gate gave it stays until ours is upstream of that gate again (`passed`). The ring's off floor is 0.25 (it was 0.1). Slide 7 now tests trg 4 → 3 → 4, because gate 2 forward is slide 6's move now. | trigger.js; deck s7 |
| s2 flicker: a strobe at the vertex on each front | Three changes. The dense head (VELO, RICH1, x < 3.5) has a softer rise: its sharpness is ×0.3 on the approach side, about 5 frames instead of 2. Its weight is 0.55. The phase is a quarter period behind, so a grain's first front ramps up from dark (at tau = 0 every grain started at full pulse). | glow.js |
| s3 meaningless motion: the merged glow is dimmer than a front | Merged term 0.4 → 0.95. | glow.js |
| s4 blowout: slide 3's glow carried into the flight | The glow's hide fade is 0.4 s (it was 1.2 s), and the latch fade is 0.5 s. The crossing's own bloom (lhc-collision, `<Crossing>`) is not the kit's: the re-recorded flight still showed it at the vertex for a frame or two, so slide 4 now cuts (above). | glow.js |
| s5 pop: the buffer appears as a whole shell | The buffer fills from the lane on a step forward to it. Each parked packet rides out from the lane to its slot, staggered over 2.2 s and 0.9 s each. A jump shows it at once. | trigger.js |

## Lab 2

| finding | done | file |
|---|---|---|
| s16 blowout + one-frame blink at 8.22 s | `uSweep` eases in over 0.3 s and out over 0.4 s (it switched in one frame). The front's glow is ×0.25 in the dense body and full only past about 2.6 σ. busy covers the ease-out. | bell.js |
| s17 one-frame white bloom at frame 0 | Same cause and fix (the sweep starts at 0 and ramps; the body glow is masked). | bell.js |
| s14 pop: 0.0 MeV/c² for 2.5 s, then a snap | `api.value()` is NaN after step 3 until our grain has landed (with `land`; otherwise until the fold), so StageCount prints no wrong number. The deck's `--d1` is 6.8 s, reaching the landing on the cut arrival. | vertex.js; DataLab2 deck s14 |
| s14 too slow: 4 s of black transit (also s10, s12, s13, s16, s20) | Cut on slides 10, 12, 13, 14, 16 and 20. | deck |
| s12 meaningless motion: the flight sweeps past the floor station; the toy fill never settles | Cut (nothing crosses the frame). Toy step 1 `fill: 2.5`. | deck; space.json |
| s8 never settles: the select sweep dims the plot and back | **Declined.** Holding `uAlpha` through the sweep was tried and re-recorded: the plot still dimmed (frame mean 4.7 down to 0.7-1.1). The dimming is the selections' own grain count. Selection 60 keeps a few thousand of 91 583 rows, and `rescale` stretches them to the full height without adding light, so the per-index alpha re-ramp is the only compensation and was put back. The take also ends mid-sweep: 60 × 0.15 s runs past the recorder's 9.4 s, although `busy` holds while `sw && !sw.done`. **Open:** the recorder's settle (see open items). A shorter sweep (`every` 0.08) or a narrower range fits one take. | hist.js |
| s20 never settles: the fill buries the re-roll; band lines faint | Roll step `fill: 2` (the re-roll clock already starts at `morph.end + 0.2`). The band look is `errors: { alpha: 1.4, size: 1 }`. Cut. The take must run arrival + 12 × 1.2 s to show every roll. | space.json; deck |
| s3 too slow: 9.7 s, the count only at 9 s | The kit's auto fill cap is 5.5 s (it was 9 s; 91 583 grains took 7.8 s). `--d1: 1s`, so the count runs with the build. | hist.js; deck s3 |
| s15 same as s3 | Same cap. `--d1: 1.5s`. | hist.js; deck s15 |
| s7 flicker: the whole plot pulses on weights | `{weights}` on or off is now a left-to-right sweep (`T = 1.2·x/W`; 0.6 still swelled to twice the end level at 1 s in the re-record) for the grains coming back from the cut and for the movers alike. The alpha was not re-ramping here (colMax is unchanged); the pulse was thousands of returning grains landing together with their landing glow. | hist.js |
| s10 blowout: white columns with a halo, sideband faint | tau plot `alpha: 0.55` (alphaFor gave about 0.40), `selGain: 0.9`, `fill: 3`. Cut. | space.json; deck |

## Lab 3

| finding | done | file |
|---|---|---|
| s7 never settles: the D⁰ plot rebuilt from nothing on arrival | New `refill` (2 s). An arrival at a plot that has already stood once replays its fill in at most that time. The recorder opens each take on a fresh page, though, where nothing has stood yet. The first re-record still filled for about 8 s, with the curve at 9 s. So lab 3's h also has `replay: false`: an arrival shows its state at once (0.35 s), slide 1's "standing peak" included, and the curve draws within about 1 s. That still refilled: on a cut, the slide's steps land a frame after the station's assembly, so the hist saw a step up from 0, not an arrival. A step up from nothing within 1 s of an arrival now counts as that arrival (`replay`, `refill` and the staged first phases hold). Re-recorded, the plot stands by 1 s, the curve is drawn by 3 s, and the take settles at about 4 s (it was 12 s or more). | hist.js; space.json; deck s7 |
| s3 meaningless motion: cross-world flights, black, stray forms | Cut on slides 3, 4, 5, 7 and 9. The station positions are unchanged. | deck |
| s8 wrong order: the peak already white on slide 8 | h steps are now `[0, {n: all}, {tilt: 62}, {tilt: null}, {weights: psig}]`. Slide 7 is h 3 (light-blue peak, ours and 0.144) and slide 8 is h 4: the whitening plays on slide 8, left to right. | space.json; deck s7, s8 |
| s4 pop: bowl tick labels alone before the bowl | The surface's fader (its labels' only driver) starts 0.4 s before the gather ends and fades in over 0.5 s. | landscape.js |
| s3 pop: μ shows the answer, then jumps back | `readout()` gives the path's start while a roll is still to come (`want`'s state has `roll`), never `minX`. | landscape.js |
| s5 meaningless motion: subtraction reads as glitter; the count only rises | A `{subtract}` opened fresh (an arrival, `c`) fills window and sidebands first, holds 0.5 s, then runs the pairs as a forward step, so the count climbs to 2 000 and falls to 596 (new `subtractFirst`, default true). The tau step 1 has `fill: 2.5, alpha: 0.9, selGain: 1.0`: light-blue sideband grains at 0.9 against white at 0.9 instead of 0.66 against 0.86. `--d1: 1s`. | hist.js; space.json; deck s5 |
| s6 too slow: the plot respraying, τ before its curve | Slide 6 is a forward jump on the same station, not a replay. Its 68 000 new grains fill in 2.5 s (step 1's `fill`, inherited). The nums are at 6.5 s and 7.5 s, after the curve's draw. | space.json; deck s6 |
| s2 too fast: the fit leaps in 1.4 s during the camera move | New dk-curve step keys `through`, `ease` and `after`. Step 4 is `{ set: 5, through: true, ease: 0.7, after: 1.2 }`: after the camera, it glides through logged iterations 1-5, 0.7 s each, and the χ² readout follows. | curve.js; space.json |

## Lab 4

| finding | done | file |
|---|---|---|
| s6 pop: black, then a whole mass histogram, psig lost | The black was the 4.5 s flight. Cut. A dk-hist opened fresh on a `{tip}` step stands as its state without the tip first (`tipFirst`, `tipHold` 1 s), then lets go. dk-scatter's `{tip}` waits for the hist's new `api.tipReady()`, so the weighted plot is seen and pours with its whiteness. The tipped grains start at the hist's alpha against the scatter's (`grains().alpha`); the re-record showed a +3.7 one-frame step as they took over at the scatter's full alpha. h step 1 `fill: 2.5`. `--d1: 6s`. | hist.js, scatter.js; space.json; deck s6 |
| s6 wrong order: scatter axes over the histogram, 0 candidates | While its tip waits, the scatter has no state, so its frame and axes stay hidden until the pour starts. The count is set for 6 s. | scatter.js; deck |
| s9 blowout: edge-on ellipse | The cause was the x squeeze, which ran with the depth while the camera was still face on: 91 k grains collapsed into one column seen from the front. The squeeze now follows the camera's side-on angle (none face on, all of it at yaw 90). The re-record showed no column, but the straight flight cut the corner through the cloud (frame mean 8.5 → 25 at 2.4 s). Slide 9 now orbits on a `path` (front, yaw 45 at 23 units, side; 2.6 s). | scatter.js; deck s9 |
| s10 blowout: the same in reverse | The undo step has `after: 1.2` (new scatter step key): the depth closes once the camera has turned off edge-on. Together with the squeeze following the camera, the column cannot form. Slide 10 orbits back on the reverse path. | scatter.js; space.json; deck s10 |
| s11 wrong order: numbers before the picture; black | Cut (the black was the flight). Rare step 1 `fill: 2`. Numbers at 4 s, 4.4 s and 4.8 s, after the cloud lands. **Declined:** reading rarePrec from the landed counts. With the delays the three numbers appear only at their final values. | space.json; deck s11 |
| s4 wrong order: 65.3 % on black, the line whole over an empty frame | Cut. On a fresh arrival the boundary comes in once half the cloud has gathered. `--d1: 3.5s`. | scatter.js; deck s4 |
| s7 never settles: the box edge crawls as beads | **Declined for now.** `boundaryPoints` already resamples the contour, and it is drawn in display space, so the "raw y" cause does not apply as stated. The crawl needs its source found (the overlap alpha from a capped mean spacing, or the contour breaking into pieces) before a fix. | scatter.js |

## Lab 5

| finding | done | file |
|---|---|---|
| s7 flicker: run 1 flashes white at frame 0 | A `cede(null)` that arrives while the receiving plot is itself going (the bus says 0) keeps its grains gone. They come back at that plot's next shown state. | hist.js |
| s4 never settles: 4.5 s black, the pipeline regathers, run 1 unfinished | dk-pipeline armed while it stands in view (a flight from a pose beside the station) stays standing, and the step plays as a step (`keep: false` restores the replay). Slide 4 `flight: 2.2`. h1/h2 `fill: 3.5` (it was 7.5). **Open:** the recorder's 3.98 s settle with the plot still filling. | pipeline.js; space.json; deck s4 |
| s4 blowout: run 1 lands as a glowing bar | h1 step alpha 0.5 (it was 0.72), `selGain: 1.0`. | space.json |
| s5 blowout: grey haze from white run 1 | Same h1 change, and h2 step alpha 0.75 (it was 0.85). The re-record had no haze (frame mean about 21 against 54-65 before), but run 2's first landings stepped +6 in one frame. h1 and h2 have `curve: 0.75`, so the fill starts slowly and ramps up instead of front-loading thousands of landing glows into the first 0.3 s. | space.json |
| s6 wrong order: the end of run 2 between takes | **Declined (recorder).** The recorder settles each slide's predecessor before the take ("each slide arrives from the slide before it … settled"), so slide 6 cannot carry slide 5's unfinished run. With fill 3.5 s, most of run 2 now lands inside slide 5's 4.2 s before the freeze. | — |
| s8 pop: selection 41 arrives as a cut, plus a swell | It was a step back (hs 120 → 41), which the kit shows at once by design. A new step 121 = `{select: 40, max: 2348}` makes slide 8 a forward step: grains outside lift away and the new ones drop in. The re-record still swelled (frame mean 2.7 → 8.2 → 3.9) as about 30 k grains landed in 1.2 s at the sparse plot's alpha. Two changes: a plot getting denser (alphaTo < 0.85 × alphaFrom) eases its alpha in 0.4 s, not 1.2 s, and a new selection's returning grains are spread over 0.8 s, not 0.3 s. | hist.js; space.json; deck s8 |
| s7 too slow: 4.5 s of empty axes | Cut (the 4.5 s was the flight from the hero pose). hs step 1 `fill: 2.5, lead: 0.2`. | space.json; deck s7 |

## Kit-wide changes worth knowing

- dk-hist auto fill: at most 5.5 s (it was 9 s). `refill` (2 s) for a plot already seen.
  `subtractFirst` and `tipFirst`/`tipHold` stage a fresh arrival. `api.tipReady()`.
  `{weights}` sweeps left to right.
- dk-trigger: gate `step`; ours entries `{ at, fold, glide, lag }`; a step back holds ours; the
  buffer fills from the lane; the ring floor is 0.25.
- dk-lineup: per-pile `wait` and `from`; use `assemble: false` on a slide that arrives on a path.
- dk-scatter: step key `after`; the squeeze follows the camera; the tip waits for its hist; the
  boundary waits for half the cloud on a fresh arrival.
- dk-curve: step keys `through`, `ease` and `after`.
- dk-vertex: `value()` is NaN until our grain lands.
- dk-pipeline: stays standing when armed in view (`keep`).

## Re-recorded (25 fps, 1280×720)

The takes are in `scratchpad/rec/lab<N>-fix` (all the touched slides), `-fix2` (lab 1 s4, lab 2 s8,
lab 3 s1, s2, s7, s8, lab 4 s6, s9, s10, lab 5 s4, s5, s8, after the second round), `-fix3` (lab 2 s7, lab 3 s8) and
`lab3-fix4` (s5-s7, after the arrival fix). Frame means are on a full-range 0-255 scale at 320×180, so they are not
the reviewers' TV-range YAVG.

| take | before (review) | after |
|---|---|---|
| L1 s2 | 76 luma steps > 1.5 in 11.5 s (50 fps) | 21 at 25 fps; largest step 2.1 |
| L1 s3 | merged glow dimmer than a front | merged 12-12.7 against fronts 8-11 |
| L1 s4 | glare carried over, burst missing | no glare (largest step 0.08); the lane runs, gate 1 bursts at 2 s |
| L1 s5/s6 | buffer whole at once; gate 2 off-camera | the buffer fills from the lane; ours parks on the shell, then crosses gate 2 at 3.6 s and shrinks |
| L1 s8 | 5.8 s black, all piles at once | the sphere stands at 0.5 s, the day's pile gathers from behind at about 4 s, settled 9.9 s |
| L2 s16/s17 | white halo, one-frame blink | no step above 0.54; peak 7.5 against the end's 6.9 |
| L2 s10/12/13/14/16/20 | 4 s black transits | cuts: content from about 1-1.5 s |
| L2 s7 | pulse at 0.8 s | 3.3 → 5.0 → 4.4, no step above 0.31 |
| L3 s7 | 8 s refill, curve never drawn | plot at 1 s, curve by 3 s |
| L4 s6 | 3.5 s frozen black, the hist popped | the plot fills, holds and pours; largest step 0.98 (3.68 before the alpha match) |
| L4 s9/s10 | 22 → 40 (TV) edge-on bloom | no column; the orbit peaks at 12.9 / 9.6 against an end of 12.6 / 7.3 |
| L5 s4 | 4.5 s black; +3.2 first-landing pop | the pipeline stays; largest step 0.77 |
| L5 s5 | haze 54-65 (TV); +1.35 landing flash | no haze; largest step 0.9 |
| L5 s7 | white flash at frame 0 | frame 0 at 1.3; settles 3.8 s |
| L5 s8 | a cut, then a swell | a forward move; swell 2.7 → 5.3 → 3.9 |

## Open

- The recorder's settle ends a take while `api.busy` still holds: lab 2 s8's sweep (60 × 0.15 s) runs past its
  9.4 s take, and the reviewers saw the same on lab 5 s4 (3.98 s settle while filling). Not traced: it is in
  slidev-stage-record, not the kit.
- Lab 4 s7: the box edge's crawl (declined above, needs its source found).
- Lab 1 s2 still pulses (that is the front), with 21 single-frame steps above 1.5 at 25 fps. The head's
  softer rise could go further (`sharp` 16 → 10 overall) if the owner still reads it as a strobe.
- Lab 2 s8 dims with the tighter selections (declined above). A shorter sweep would fit one take.
- The cuts trade the flights' sense of travel for content from the first second. Where the owner wants the
  travel back, a short `flight` (1.6-2 s) is the middle way. Lab 1's s6 pan and the lab 4 s9/s10 orbit stay.
