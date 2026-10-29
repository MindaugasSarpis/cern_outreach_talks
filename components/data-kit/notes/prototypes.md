# Prototype pairs: does each element carry meaning on the dense slide? (29 Oct 2026)

Bible §4's prototype table, one row per mechanic, shot on the integrated kit (every lab
reshot after the last kit change; all slides settled, no page errors). Slide numbers are
the lab deck's. Sheets are per 6-slide run under `talks/2026_00_00_DataLabN/shots/`
(lab dirs are scratch and untracked); the full-size PNGs sit beside them as `NN.png`.
Verdicts are mine, from the sheets and a few full-size frames, judged against the
owner's bar ("the plots don't immediately correspond to the text", "too busy, barely
readable", "the space doesn't bear any meaning").

| mechanic | lab | sparse | dense | sheet | verdict |
|---|---|---|---|---|---|
| dk-trigger gates | 1 | 4 (gate 1, 30 → 1 MHz) | 5 (buffer, 30 PB) and 6 (gate 2, 10 GB/s) | `DataLab1/shots/sheet-int-1-6.png` | Gate 1 reads: a dense packet lane on the left, a handful of packets past the gate, the two rates beside it. The buffer reads as a ring of parked packets, plausibly "stored", but nothing in the picture says how much. Gate 2 is the weak one: a dim gate ring, two or three packets and our packet as a white star in a mostly empty black frame, so most of the space bears no meaning and the 10 GB/s has no visible counterpart. It needs a closer pose or a sourced HLT2 keep share (t1's open item) |
| dk-vertex | 2 | 13 (one decay alone) | 14 (the landing on the heap's axis) | `DataLab2/shots/sheet-int-13-18.png` | Both read. The D⁰ flight, the two named bent strands and the white grain with its ring are clear, with one number (1 880.6 MeV/c²). On 14 the grain sits alone on the empty mass axis beside the heap, at its tick. Clean, and nothing is decorative |
| dk-heap → dk-hist sort | 2 | 2 (the first 1 000) | 3 (all 91 583) | `DataLab2/shots/sheet-int-1-6.png` | Dense: the D⁰ peak reads at a glance as a histogram of light-blue grains, with ticks, a caption and the count. Sparse: an honest dot plot whose peak barely shows; the heap's edge crops in at the left. It is quiet, not wrong (core's open item: frame it closer) |
| dk-curve | 3 | 1 (start values, pulls) | 2 (fit, signal part, pulls) | `DataLab3/shots/sheet-int-1-6.png` | Reads. The white curve over the light-blue peak, the dashed signal part, and a pull row that is visibly large on 1 and small on 2 carry the χ² numbers (372 → 53.4/40). The pull row is the busiest element, and it earns its place |
| dk-landscape | 3 | 3 (1D slice, ± 0.10) | 4 (the χ² bowl with its Δ = 1 ring) | `DataLab3/shots/sheet-int-1-6.png` | The slice reads as a parabola with the Δ = 1 line and two crossing ticks. The bowl reads as a surface with a white ring and the ball; its μ and width ticks are small and sit on the bowl's edges. It looks impressive. Whether the room maps the ring to "the error" without the slice first is the deck's ordering question |
| dk-hist subtraction | 3 | 5 (2 000 candidates, 20 bins) | 6 (all, IPχ² < 9, lifetime curve) | `DataLab3/shots/sheet-int-1-6.png` | Dense reads: white decay-time columns under the light-blue exponential. With `fitRange` the two bins below 0.5 ps are now light blue, so "not fitted" shows and the tallest bar no longer looks missed. The whites read light grey (default `selGain`; T3 may set 1.5-1.8). Sparse is a white dot plot with "596 signal". The still does not show that anything was subtracted (t3-8 declined), so the subtraction lives in the motion only |
| dk-hist weights | 3 | 7 (our grain, P(signal) 0.144) | 8 (the whole peak whitened) | `DataLab3/shots/sheet-int-7-9.png` | Dense reads: the peak whitens under the fitted curve, flanks stay blue, "20 993 signal". Sparse is the dense picture with a spark ring at 1 880 touching the tick; "0.144" has a counterpart (the ring), but the grain itself cannot be seen as 14 % white. Acceptable; it is the weakest of T3's pairs |
| dk-scatter | 4 | 1 (200 points, cut on x1) | 6 (91 531 tipped from the mass plot) | `DataLab4/shots/sheet-int-1-6.png` (and `sheet-int-7-11.png` for the cut, network, leak, rare) | Reads. Sparse: two clouds and a white vertical cut with "177 of 200". Dense: the record-401 cloud in log IPχ² × log decay time with its ticks. Follow-ups in 7-11 also read: the box cut, the bent boundary, the leak as clean side-on stripes, and the rare set's line |
| dk-pipeline | 5 | 2-3 (file, script, sheet: frozen and settled) | 4 (four stages, run 1 lands white) and 5-6 (run 2 takes over grain by grain) | `DataLab5/shots/sheet-int-1-3.png`, `DataLab5/shots/sheet-int-4-9.png` | Run 2 now carries meaning: with `over`, the frozen frame shows light blue replacing white from the bottom of each column up with no change of shape, and the settled frame is wholly light blue (before, it was a grey on grey). The code and sheet stages read as "text-shaped" grain blocks. Their meaning (a real script, a real CSV) rests on the narration. Run 1's white blooms into a soft halo at alpha 0.72 at this distance |

## Open for the owner

- T1 gate 2 (lab 1 slide 6): a mostly empty frame. Either pose closer or source an HLT2
  keep share so gate 2 visibly drops packets.
- Mass edge bins (1 810-1 816, 1 912-1 920) read as dips on every D⁰ plot: keep the series
  range, or draw 1 816-1 912 (integration.md, t2-9).
- White in dense columns reads light grey at the default `selGain` 1.3. Each deck tunes
  this per plot, because a global lift bloomed (integration.md, t3-6).
- Not judged: anything in motion. Every verdict above is a still end state, or one frozen
  frame (lab 5 slide 5).
