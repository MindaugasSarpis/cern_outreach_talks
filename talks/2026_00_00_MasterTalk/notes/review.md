# Review — the v0.9.0 pilot's shots

HEAD bb030e7 (snapshot the same: clean tree). Shots of 20 Oct 2026 04:19,
1600×900 frames, SwiftShader; judged by a subagent from the single frames
and shots.ndjson (the contact sheet was stale, item 0). Verdict: ship —
every form present at its step on all 12 slides after the move to the kit's
lhcb plugin and step bus; no page errors; nothing high. The mediums are
visual-quality items, the first two open before the change.

## Findings, worst first

0. **Stale contact sheet** (review artefact, medium). `sheet.png` kept its
   19 Oct date while the frames and the report were 20 Oct: `shots --changed`
   does not recompose the sheet. For Tools, through the Scheduler.
1. **Slide 5, the detector** (overexposed, medium). The VELO at the vertex is
   a solid near-white block (34×28 canvas px, mean 0.91–0.95) with a ~250 px
   bloom halo, right where "5.1 mm" points: a lamp, not sensors. Already in
   the 19 Oct build. Downstream (x 850–1250: RICH2, ECAL, HCAL, muon) the lit
   pixels are saturated mid-blue (saturation ≥ 0.55 in 59–97 %), matching the
   fallback `color` #5b93ff, not the palette's pale #cfe2ff / #b8d2ff /
   #8fb6ff: the colours by part arrive only at the vertex end. Fix: (i) a
   per-part alpha for the VELO (~0.08) or a smaller VELO budget in the bake —
   the kit's, via the Scheduler; meanwhile `alpha` 0.32 → 0.2 and `bloom`
   0.42 → 0.25 shrink the halo, not the block; (ii) the pale parts: explained
   by Tools (20 Oct), no test needed. The mapping is right (ids 0–9 match the
   bake's PARTS, each part's z range checks out) and nothing tints by
   distance; the shared grain shader (GRAIN_FRAG) outputs pow(color·alpha,
   2.2) on a colour three.js has already linearised, so the gamma is applied
   twice and pale colours come out saturated (#cfe2ff → 0.65, #b8d2ff → 0.80,
   #8fb6ff → 0.94, #5b93ff → 0.99); at the vertex overlapping grains add up
   to white, which is why the palette seems to arrive there. Every talk's
   frames depend on it, so the fix comes as an opt-in option in v0.9.x, with
   the VELO's per-part alpha (also opt-in), the stage-data log line and the
   sheet rebuilt by `shots --changed`. Pin the next tag and turn the option
   on, then re-shoot slide 5.
2. **The dot, slides 1, 10, 11** (meaning, medium). A 4–5 px speck: on slide 1
   a 4×4 px grey spot (luminance 0.78) among 57 brighter plot blobs, so the
   opening does not show "one white dot"; on 10 it is landed on the Pc(4440)
   flank, on 11 the same speck. Fix: spark `size` 1.0 → 2.5 (~12 px core at
   the plot; ~65 px at the dive's 4 units, so re-shoot slide 2), or `dot: 0`
   on slide 1 if the opening should show nothing.
3. **Slide 9, the store** (underexposed, medium). 99.5 % black: a sparse
   dotted ball ~200 px wide of dim grains; at risk of vanishing in a lit
   hall for the 8.5 s before click 1. Fix: grid `size` 1 → 1.6 and `store`
   3.0 → 4, or hold dist 14 until click 1; re-shoot with the clicks.
4. **The clock's unit, slides 3–10** (illegible, medium). `.master-clock .u`
   at 2.6vh is 14.3 canvas px, under the 18 px floor, and the unit carries
   the meaning (ns → µs → ms → h → years); the digits at 3.4vh = 18.7 just
   pass. Fix: `.n` 3.4vh → 4.2vh (23 px), `.u` 2.6vh → 3.3vh (18 px).
5. **Slide 3, the bunches** (meaning, low). 99.7 % black: two pale streaks;
   the pipe the notes promise is not on screen, so the ~1.75 min hold is two
   smudges and numbers. A design call: draw the pipe as a grain tube between
   the bunches, or shorten the hold.
6. **Slide 6 words** (low). "3 % of the internet" names nothing shown; the
   owner approved the numbers on 19 Oct, so his call ("internet traffic", or
   "3 %" alone, narrated).
7. **Slide 12 credits** (low). Mixed case, 9 px, dim, no overflow. The house
   rule has no credits for CERN's material: "the collision: CERN Open Data,
   LHCb 2012 (CC0) · the spectrum: LHCb, HEPData ins1728691" can go; the
   DD4hep (GPL-3.0) / Phoenix (Apache-2.0) line stays.

## Checked and fine

Slide 6: ~110 white hits visible along the tracks (a cloud at the detector at
the shot's time, the blue packets flowing right with our white packet at
their head); the dimmed detector is a faint haze above and right of the
numbers, not behind them (behind-box means 0.005–0.010 on 5, 6, 10, 11).
Slides 7–12 at their steps: the ring and the bursts (7), the disc and the
second ring (8), the store (9), the plot blurred with the dot (10), sharp
with three ticks (11), small at centre with the credits (12); 10 and 11 not
swapped. No number on world detail; nothing near white but the VELO block;
numbers 46 px, words 22, clock digits 18.7; nothing uppercased; the lower
third holds only the numbers, the clock and the plot's base on 10–11; no
overflow; no pageErrors, console warnings or HTTP errors. All frames are
SwiftShader's: sprite sizes and bloom may differ on the venue's GPU.
