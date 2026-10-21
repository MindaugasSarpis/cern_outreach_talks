# Review before the talk (21 Oct 2026)

HEAD fe3fb1a (deployed: 404f3a7; fe3fb1a adds only the removal of `advance-on-end` and its notes). Owner, via the
Scheduler: "Innoday is next, so focus on that, carefully review." Findings go to the owner first; nothing he
saw on screen is changed until he says which.

## Checks run

| Check | Result |
| ---- | ---- |
| `talk lint` | 0 errors, 17 warnings (font sizes in styles, cover's „2026“, three section/„Ačiū“ words, no `duration`); 25,0 min |
| `talk check` | videos:check, stage:check, build ok |
| `talk shots --sheet` (all 31) | no page errors, no overflow; d3d12 on the RTX 5080 |
| `talk facts check` | 0 errors; the 64 facts the deck cites are all confirmed or corrected |
| live walk (pages_check, the Pages URL) | 31/31, nothing failed, tier 0 |
| PDF (`talk export --format pdf -- --wait 12000`) | 32 pages; p32 blank (Slidev's); p30 prints the clip's last frame, not the close |
| venue zip (`pnpm venue`) | 427 MB, 7 clips venue-safe; „lhcb.mp4: not in release“ noted (it is the shared release's; packed from local) |
| clips wait for the press (headless, both modes) | slides 2 and 8: still on their slide 5 s after `ended`, → moves on; same in the no-WebGL fallback |
| INSPIRE paper count | 878 today (875 on the slide, 12 Oct) |

## Sound (EBU R128)

The film: −16,0 LUFS integrated; short-term −15 to −17 from 0:03 to 2:12, fading to −35 by 2:24. The notes'
„first 8 s quieter“ was wrong (fixed in the notes). Starfire on the light-injection slide at level 0,3: the
cut's first 15 s at about −33 LUFS heard, 17 dB under the film: a bed under speech. On „Ačiū“ at 0,9: the
arrival (18–21 s) at about −12 to −13 LUFS, the second climax (~45 s) about −12: 3 dB over the film.

## Visual findings (for the owner; none applied)

1. Slide 5, „380 000 metų“: no shadow or box, on the CMB map's speckle and a grid line (medium-high). Fix: dim 0,1 → 0,35 or the Part II caption box.
2. Slide 15, the 1989 proposal: 17 % near-white, the caption box over the diagram (high). Fix: `class="dim"` (+ a page filter), caption box 0,62 → 0,82.
3. Slide 13, the ring: 6 strands, ~9 cards, some cards with no strand, MARS edge-on, unexplained bright points; notes say only „šešios gijos“ (high, meaning). Fix: a notes sentence; the strands and card yaw in space.json.
4. Slide 16, the NeXT server: 26 % near-white (medium-high). Fix: `class="dim"`.
5. Slides 24–25: „mln. CHF“, „sutarčių“ on the KT sphere; the sphere is never named in what he says (medium). Fix: pose or dim 0,7; one sentence.
6. Slide 11: the stats cover the LHCb banner in the collaboration photo (medium). Fix: cards lower, over the scaffold.
7. Slide 20, MedAustron: still dense (medium). Fix: `class="dim"`.
8. Slide 30: the logo blooms into its reflection (medium). Fix: fade the reflection, lower its gain. The owner liked the close (20 Oct); offered, not proposed.
9. Lower third: Part II captions, „290 dalelių“, „Ačiū“, slide 8's stats at 72–86 % height (medium; a flat room). Fix: lift them.
10. Slide 1: „Innoday 2026“ 12,5 px, byline 16 px (low).
11. Slide 12: a far glow (funnel/CMB disk) at the top edge (low). Fix: pitch 1–2°.
12. Slides 14, 17: bright backdrops (low). PDF: p30 is not the close (medium, the PDF only); p21 prints brighter than shown.

## Applied (notes and talk notes only)

- Slides 2 and 8: what he presses and when (→, the clicker's forward, space or PageDown; the opener after 4:13, the
  tunnel when he has finished the numbers: the clip is 0:40, the speech ~0,9 min).
- Slide 28: the film starts on arrival at full level; nothing to say over it; say the Lithuania lines on the FCC
  slide before pressing, or over the film's dark last frame (it holds).
- CLAUDE.md: the `places` switches are on the section slides 13 and 23 (Decisions were stale since 12 Oct).
