---
theme: ../../theme
colorSchema: dark
transition: dust
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-00-00-data2peak
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }   # silent takes; the owner narrates, the music bed is laid in the edit
  options: { aberration: 0 }   # tick numbers are world sprites: no colour fringes on them
title: Counting
info: |
  Talk 2 of 5 of "Data analysis, the CERN way". A histogram shows a bump: when is it a
  particle and not chance? A count N wobbles by about √N, and a bump counts as a
  discovery only when chance would make one that large less than once in 3.5 million
  tries, after every place you looked is counted. Opens on talk 1's last frame (the
  settled pile of 91 583 candidates) and closes on talk 3's first (the full mass peak).
lang: en
htmlAttrs:
  lang: en
duration: 15min
onscreen: numbers
sources: notes
layout: cover
# the cover: talk 1's last frame exactly (the settled pile, seen from its summit + 1.8 up); only our grain's ring gathers.
# ambient as a keyframe at 0: black from the first frame (a plain 0 eases down from 1 over 1 s, a grey veil); the title fades in once the pile stands
# The pile stands at z -11, behind the plot's axis, so on slides 3-4 it reads as a source, not as masses on the axis
space: { at: [-8.5, 1.8, -11], dist: 16, yaw: -12, pitch: 12, dim: 0.2, ambient: [[0, 0]], steady: true, sway: 1 }
steps: { heap: 2, h: 0, s: 1 }
---

<!-- the cover's plain title; the .name span only keeps `talk lint` from reading the headmatter's onscreen: numbers as this slide's own (it renders as a plain h1) -->

# <span class="name">Counting</span>

<!-- facts: record401-candidates-91583, record401-licence-cc0, lhcb-record401-year, lhcb-upgrade1-trigger -->

<!--
Message: last time a collision became a row of four numbers and the rows became this pile; today we count them.
Picture: the pile is 91 583 grains on the floor, one grain for each candidate pair of tracks ("each grain is one candidate"); the ringed white grain on the summit is the one we followed last time ("this one is ours").
Caveats: say "candidates", never "events": the file lists fewer events than candidates, because one collision can give more than one candidate. The data are from the LHC's first run (2011 or 2012; the record states no year), so these rows passed that run's trigger, not the newer one shown last time.
Sources: CERN Open Data record 401, LHCb, DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR (CC0); record 401's portal page and the LHCb masterclass guide for the year; LHCb Upgrade I (arXiv:2305.10515) for the newer trigger.
(~0.5 min)
-->

---
# one decay alone (the sparse vertex): a cut to the decay station; the world slows through the split
space: { at: [-41.5, 3, -80], dist: 10, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5, rate: [[0, 1], [1.6, 0.3], [3.4, 1]], path: [[0, { at: [-41.5, 3, -80], dist: 10, yaw: -4, pitch: 4 }]] }
steps: { s: 0, v1: 2, s1: 1 }
---

<!--
The picture alone: dk-vertex v1 flies in from the left and splits into two strands that bend
apart (they carry no names); dk-spark s1 rings the split.
-->

<!-- facts: d0-row1-values-worked, magnet-bends-tracks-momentum -->

<!--
Message: a short-lived particle lives only a moment, then splits into two charged particles that leave two tracks.
Picture: the dotted line is the particle's flight ("it flies a fraction of a millimetre before it splits; how far is next time's subject"); the ring is where it splits; the two strands are the two tracks, bending apart in the detector's magnet ("how much a track bends gives its momentum, and opposite charges bend opposite ways").
Caveats: the file holds no track momenta, so the two directions are simulated (seed 401) around our row's real mass, transverse momentum and decay time: say "angles simulated". The drawn flight is a picture length; no flight length or speed in this talk (next talk).
Sources: CERN Open Data record 401 row 1 (bake/d0.py); the kit's dk-vertex (seed 401, api.values()); LHCb outreach, "The magnet".
(~0.6 min)
-->

---
# the landing (the dense vertex): a cut back to the floor; our grain lifts off the summit, splits, folds into one grain and lands on the empty axis
# the world runs 1.6x for the first 3.2 s (the vertex's 4.8 s of world time, flightTime and landTime 1.0), so the grain lands by about 3 s
space: { at: [-3, 2.5, -3], dist: 20, yaw: -6, pitch: 11, dim: 0.25, ambient: 0, steady: true, sway: 0.5, rate: [[0, 1.6], [3.2, 1.6], [4, 1]], path: [[0, { at: [-3, 2.5, -3], dist: 20, yaw: -6, pitch: 11 }]] }
steps: { v1: 0, s1: 0, heap: 2, h: 1, v: 3, s: 2 }
---

<div class="nums" style="--d1: 3.2s">
  <p><b><StageCount for="v" :to="1880.6" :decimals="1" /></b><span class="unit">MeV/c²</span></p>
</div>

<!-- facts: d0-row1-values-worked, d0-kpi-mass-definition, magnet-bends-tracks-momentum -->

<!--
Message: two tracks make one number, the mass of the pair, which is where the grain lands.
Picture: the two strands folding back into one grain ("two tracks make one number"); the grain on the axis at its tick ("1 880.6 MeV/c², the mass of this pair"); the pile behind ("every other grain has its own number").
Caveats: an optional aside, only if there is time: the bend of each track gives its momentum, a guess of which particle each one is gives its energy, and the mass of the pair is M² = (E₁ + E₂)² − |p₁ + p₂|² with c = 1, each energy from E = √(p² + m²) for the mass the track is assumed to have (the mass hypothesis). The angles are simulated, as on the slide before. The pile stands behind the axis: it is where the grains come from, not a place on the mass axis.
Sources: PDG, Review of Particle Physics 2024, Kinematics, Eq. 49.2; CERN Open Data record 401 row 1 (bake/d0.py); LHCb outreach, "The magnet".
(~0.8 min)
-->

---
# the first 1 000 (the sparse sort): grains leap from the top of the pile into 2 MeV bins; closer than lab 2, so the sparse dot plot reads
space: { at: [2, 2.2, -1], dist: 16, yaw: -6, pitch: 11, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 2 }
---

<div class="nums" style="--d1: 1.5s">
  <p><b><StageCount for="h" :to="1000" /></b><span class="unit">candidates</span></p>
</div>

<!-- facts: record401-candidates-91583 -->

<!--
Message: a histogram is counting: each candidate drops into the 2 MeV/c² bin of its mass.
Picture: each leaping grain is one candidate ("one grain, one count"); the columns are the bins ("a column is how many fell in this range"); our grain is already in its bin, the first one counted.
Caveats: the grains leave the pile in the series' seeded order (seed 401), not the file's; at 1 000 no peak shows yet, and that is the point of the next slide.
Sources: CERN Open Data record 401 (bake/d0.py).
(~0.5 min)
-->

---
# all 91 583 (the dense sort): the rest pour in, the scale takes the full set, the peak stands over flat shoulders
space: { at: [-1, 3.2, 0], dist: 25, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 3 }
---

<div class="nums" style="--d1: 1s">
  <p><b><StageCount for="h" :to="91583" /></b><span class="unit">candidates</span></p>
</div>

<!-- facts: record401-candidates-91583, pdg-d0-mass-2026, d0-row1-values-worked -->

<!--
Message: with all the candidates counted, a peak stands where no single grain could show one.
Picture: the peak ("near 1 865 MeV/c², the known mass of a short-lived particle"); the flat shoulders ("pairs that only look like it"); the ring ("ours, on the flank: nobody can tell whether one row is the particle").
Caveats: the axis runs 1 816-1 912 MeV/c², the series' range in every talk: the file's candidates were preselected with loose criteria, and the few bins beyond this range read as dips. No centre, width or fit here: that is next time.
Sources: CERN Open Data record 401 (bake/d0.py); PDG 2026, mass 1 864.84 ± 0.04 MeV (notes only).
(~0.8 min)
-->

---
# fourteen flat bins: down the low shoulder to the tops of 1 816-1 844 (1 461 of 3 746 is 4.3 of the 11 units), framed
# close so the rise from 1 844 up stays out of frame; the light-blue mean line draws on with the arrival, the click adds ±38
space: { at: [-8.9, 4.1, 0], dist: 4.7, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5 }
steps: { m6: 1 }
clicks: 1
---

<StageSteps :clicks="{ 1: { m6u: 1, m6d: 1 } }" />

<div class="nums" style="--d1: 2.5s; --d2: 0.4s">
  <p><b>1 461</b><span class="name">mean</span></p>
  <p v-click="1"><b>38</b><span class="name">√N</span></p>
</div>

<!-- facts: d0-flat-bins-sqrtn-worked, poisson-pdg-statistics-review -->

<!--
Message: fourteen bins with no peak in them should hold the same number, and they differ by about √N.
Picture: the ragged tops ("1 419 to 1 534 a bin, no two alike"); the light-blue line across them ("their mean, 1 461 a bin"); [click] the two fainter lines ("1 461 ± 38, the square root of the count: the tops scatter about that much round the mean").
Misconception: "a bin height is exact". It is one throw: the same physics gives a different count each time.
Caveats: the band's lines are drawn at 1 460.8 ± 38.2 (d0-flat.json mean ± sqrtMean, typed into the deck's two curves until the bake carries them as sets: notes/kit-requests.md). Three estimates of the bin-to-bin spread, 33.9 raw, 31.4 about a line (the bins rise by about 3.7 a bin toward the peak) and 39.1 from neighbour differences, each uncertain by about 20 % for 14 bins: all consistent with 38, never a precise confirmation.
Sources: CERN Open Data record 401 (d0-flat.json, bake/d0.py); PDG, Review of Particle Physics 2024, Probability (a Poisson count's variance equals its mean).
(~1.2 min)
-->

---
# re-rolled: a cut to the same 14 bins at the same scale (1 461 at 4.3 units), whole columns first (the 2.6 % point), standing within
# 1 s, re-drawn 24 times (the first at about 1.2 s, then one every 3 s) inside the light-blue ±√N band; from 8 s the camera cranes in to
# the tops, where the jumps are big. The roll station's centre stands 15 units behind its plot, so this pose is not *at* it: the
# engine assembles a station on a path's last key (12 s here), and the plot would wait for its 6 s fallback; out in the open it fills at once
space: { at: [-80, 4.3, 60], dist: 4, yaw: -4, pitch: 2, dim: 0.25, ambient: 0, steady: true, sway: 0.3, path: [[0, { at: [-80, 4.3, 60], dist: 9.5, yaw: -4, pitch: 4 }], [8, { at: [-80, 4.3, 60], dist: 9.5, yaw: -4, pitch: 4 }], [12, { at: [-80, 4.3, 60], dist: 4, yaw: -4, pitch: 2 }]] }
steps: { heap: 0, h: 0, v: 0, s: 0, m6: 0, m6u: 0, m6d: 0, g7: 1, roll: 1 }
---

<div class="nums" style="--d1: 1.5s; --d2: 2.5s">
  <p><b>24</b><span class="unit">re-rolls</span></p>
  <p><b>2.6</b><span class="unit">%</span><span class="name">√N / N</span></p>
</div>

<!-- facts: d0-flat-rerolls-simulated-worked, poisson-pdg-statistics-review, normal-tail-300k-grains-worked -->

<!--
Message: draw the same 1 461 a bin again and again, and the tops jump by about √N every time, 2.6 % of the column.
Picture: the trembling tops ("a new count each time"); the two light-blue lines ("1 461 ± 38: about two throws in three land between them; the next slide shows why"); the crane in to the tops ("seen close, every roll jumps by about that much").
Misconception: as on the slide before, a count is one throw.
Caveats: simulated (seed 1461): 24 seeded Poisson re-rolls of 14 bins at the real level of 1 460.8, spread 38.0 a bin over all 24 (so run all 24). "Two in three" is 1 − 2 × 0.1587 = 68 % of a normal curve inside ± 1 σ; for counts this large a Poisson count is close to normal. The re-rolls are level: the real bins' small rise toward the peak is left out. √N/N is 10 % at 100 entries and 1 % at 10 000 (narrated, no picture).
Sources: toys.json flat.rolls (bake/toys.py), level from CERN Open Data record 401; PDG, Review of Particle Physics 2024, Probability and Statistics.
(~1.3 min)
-->

---
# the normal tail: a cut to the bell; the front sweeps to 1 σ on arrival, to 3 σ on the click
space: { at: [-2.2, 2.0, 120], dist: 22, yaw: -4, pitch: 6, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [-2.2, 2.0, 120], dist: 22, yaw: -4, pitch: 6 }]] }
steps: { g7: 0, roll: 0, gz: 1, z: 2 }
clicks: 1
---

<StageSteps :clicks="{ 1: { z: 3 } }" />

<div class="nums" style="--d1: 3s; --d2: 0.4s">
  <p><b>300 000</b><span class="unit">grains</span></p>
  <p v-click="1"><b><StageCount for="z" :to="405" /></b><span class="unit">grains</span><span class="name">beyond 3 σ</span></p>
</div>

<!-- facts: normal-tail-300k-grains-worked, five-sigma-p-value-one-sided, particle-physics-5-sigma-discovery, p-value-definition-pdg -->

<!--
Message: take each re-rolled top, subtract 1 461 and divide by 38; piled up, those numbers make this bell, the distance in these units is called σ, and the white share is the p-value.
Picture: the bell ("300 000 grains laid out as noise would fall, each an excess in units of √N"); the front at 1 σ ("about one grain in six lies beyond it on one side, so about one throw in three lands outside the two lines of the slide before"); [click] the white tail at 3 σ ("405 of 300 000: how often noise alone goes this far, the p-value of a 3 σ excess").
Caveats: σ here means significance only, an excess over √b; the series never calls a curve's spread σ (it is the width, next time). One-sided beyond 3 σ is 1.35 × 10⁻³, about 1 in 740 (say only this rounding); 3 σ is what particle physics calls "evidence". The 3 σ share is the Gaussian tail (RPP 2024 Table 40.1, halved). The grains are stratified (seed 401) so the count beyond each line matches n(1 − Φ) to a grain: quantiles laid out as noise falls, not random throws.
Sources: PDG, Review of Particle Physics 2024, Statistics (section 40.3.2 for the p-value); LHCb outreach and Physics World for the "evidence" name; toys.json tail.bell300k (bake/toys.py).
(~1.2 min)
-->

---
# five sigma, the hush: the front sweeps on to 5 σ and nothing lights; the world stops once the front stands (the edit's music peak)
# closer and right of the bell's centre, so the 5 σ mark stands right of centre and its tick numbers read
# (the path starts at slide 8's pose, so a jump here never flies in from another station while the world slows)
space: { at: [2.5, 2.0, 120], dist: 17, yaw: -4, pitch: 6, dim: 0.25, ambient: 0, steady: true, sway: 0.5, rate: [[0, 1], [4.5, 1], [5.5, 0]], path: [[0, { at: [-2.2, 2.0, 120], dist: 22, yaw: -4, pitch: 6 }], [1.8, { at: [2.5, 2.0, 120], dist: 17, yaw: -4, pitch: 6 }]] }
steps: { z: 4 }
---

<div class="nums" style="--d1: 2s; --d2: 3s">
  <p><b>5</b><span class="unit">σ</span></p>
  <p><b><StageCount for="z" :to="0" /></b><span class="unit">grains</span><span class="name">beyond</span></p>
</div>

<!-- facts: five-sigma-p-value-one-sided, particle-physics-5-sigma-discovery, normal-tail-300k-grains-worked, p-value-definition-pdg -->

<!--
Message: at 5 σ noise alone would make an excess this large about once in 3.5 million tries, so among 300 000 grains none lies there, and 5 σ is the line particle physics calls a discovery.
Picture: the mark at 5 over an empty axis ("5 σ, the discovery line"); the unlit bell ("300 000 grains laid out as noise would fall, and none this far").
Misconception: "p is the probability that the hypothesis is wrong". A p-value is the chance of data at least this extreme if there is only noise; it says nothing directly about how likely the particle is.
Caveats: one-sided, 2.87 × 10⁻⁷; at 5 σ the result is called an "observation".
Sources: PDG, Review of Particle Physics 2024, Statistics (Z = 5 and p = 2.87 × 10⁻⁷; the p-value, section 40.3.2); LHCb outreach and Physics World for the names.
(~0.5 min)
-->

---
# the empty tail: the camera dives into the tail, redrawn 54 times taller, while the curve runs on past 5 over an empty axis
space: { at: [4.8, 2.0, 120], dist: 8.5, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [2.5, 2.0, 120], dist: 17, yaw: -4, pitch: 6 }], [3, { at: [4.8, 2.0, 120], dist: 8.5, yaw: -4, pitch: 4 }]] }
steps: { z: 5 }
---

<div class="nums" style="--d1: 4s">
  <p><b>1 in 3 500 000</b><span class="name">chance</span></p>
</div>

<!-- facts: normal-tail-300k-grains-worked, five-sigma-p-value-one-sided, dice-eight-sixes-worked -->

<!--
Message: 5 σ is about one chance in 3.5 million, rarer than eight sixes in a row with a fair die.
Picture: the magnified white grains ("the last few hundred, drawn 54 times taller than the bell of the slide before"); the flowing line past 5 ("where the chance goes on, too small for any grain").
Caveats: a magnified scale, factor 54 = 0.6 e^(3²/2); exactly 1 in 3 488 556; eight sixes in a row is 1 in 1 679 616.
Sources: PDG, Review of Particle Physics 2024, Statistics; toys.json tail (bake/toys.py).
(~0.5 min)
-->

---
# twenty rolls of noise: a cut to the falling toy over its light-blue expected line; the bake's own alarm bin turns white, roll by
# roll, each roll held 2 s; brighter grains (alpha 1.7) and a closer camera so the bins read as columns; the first roll and its line
# stand within about 1.5 s (a fast first fill), the white bin at selGain 1.3 and no white landing glow, so a roll reads as a bin moving
space: { at: [80, 1.8, 60], dist: 10, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [80, 1.8, 60], dist: 10, yaw: -4, pitch: 4 }]] }
steps: { gz: 0, z: 0, gl: 1, look: 1, e: 1 }
---

<div class="nums" style="--d1: 1.5s; --d2: 2.5s; --d3: 3.5s">
  <p><b>20</b><span class="unit">rolls</span></p>
  <p><b>7</b><span class="unit">alarms</span></p>
  <p><b>2.5</b><span class="unit">σ</span><span class="name">largest</span></p>
</div>

<!-- facts: falling-spectrum-alarm-wanders-worked, look-elsewhere-effect-definition -->

<!--
Message: each roll of pure noise looks in 30 places, and in 7 of 20 rolls some bin reaches 2 σ, never the same one.
Picture: the light-blue line ("what noise gives on average"); the white bin ("an alarm: noise reached 2 σ over the line here"); its jumps ("never in the same place").
Misconception: "one bump is a discovery". A bump has to be judged against every place it could have appeared.
Caveats: simulated (seed 1540), 140 entries a roll in 30 bins of 10 MeV/c² on 1 450-1 750 MeV/c²; an alarm is a bin whose one-sided Poisson z against its expected count reaches 2; 7 of 20 rolls alarm, the largest at 2.55. 20 rolls of 30 bins are 600 looks, so the "twenty looks, 64 %" rule of thumb describes a different experiment: not narrated here. The p-value that counts every place is the global one, and it is larger than the local one.
Sources: toys.json falling.rolls (bake/toys.py); PDG, Review of Particle Physics 2024, Statistics, section 40.3.2.2.
(~1 min)
-->

---
# grown to 3 500: roll 2 with its alarm bin white over the expected line, standing within 1 s; on the click 3 360 more entries rain in
# light blue (no white landing glow, the grains dimmed to alpha 0.9 as the columns grow), the line rescales, the white bin sinks onto it;
# 1.1 σ fades in 5.5 s after the click, as the count reaches 3 500 (a v-click line's delay runs from its click: styles/index.css)
space: { at: [78, 4.4, 60], dist: 17, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5 }
steps: { look: 0, e: 0, grow: 1, eg: 1 }
clicks: 1
---

<StageSteps :clicks="{ 1: { grow: 2, eg: 2 } }" />

<div class="nums" style="--d1: 1.2s; --d2: 5.5s">
  <p><b><StageCount for="grow" :to="3500" /></b><span class="unit">entries</span></p>
  <p v-click="1"><b>1.1</b><span class="unit">σ</span><span class="name">same bin</span></p>
</div>

<!-- facts: falling-spectrum-alarm-wanders-worked, chance-bumps-shrink-with-data, sigma-effects-go-away-more-data, theta-plus-leps-japan-19-events, theta-plus-2003-false-alarm, theta-plus-clas-2006-null, poisson-fluctuation-sqrt-n -->

<!--
Message: more data drowns a chance bump, while a real one grows.
Picture: the white bin ("roll 2's 2.5 σ bump, over the line"); [click] its fall ("3 500 entries later it sits on the line at 1.1 σ: nothing").
Narrated, not on screen: in 2003 a bump at 1.54 GeV reached 4.6 σ and was announced as a new particle; with more data it went away. And the other side: the real Higgs peaks of 2012 became much more visible with about ten times more data.
Caveats: the toy is simulated and holds no particle; it sits at 1.54 GeV only to echo where that 2003 peak was, so no number of that experiment goes over it. The largest z anywhere at 3 500 entries is 2.04. The 2003 peak was 36 events over a background of 17.0; a 2006 search with far more data found nothing, and the 2008 PDG review saw overwhelming evidence against it. Lyons: 3-4 σ effects have often gone away with more data.
Sources: toys.json falling.bigRoll, falling-big.f32 (bake/toys.py); LEPS, PRL 91 (2003) 012002; CLAS, PRL 96 (2006) 042001; PDG 2008 review; Physics World, 2 August 2010 (Lyons); CERN Courier, 3 July 2023 (Lyons).
(~1.2 min)
-->

---
# window and sidebands: a cut back to the floor; the plot refills, the grains outside three bands lift away as dust (ours with them),
# the window turns a softer white (selGain 1.1); the bands stand by about 2 s (a fast refill), then a light-blue line across the window at the counted background
# (b over the window's 15 bins, 1 405 a bin); the click takes the ring away
space: { at: [-1, 3.4, 0], dist: 23, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-1, 3.4, 0], dist: 23, yaw: -4, pitch: 5 }]] }
steps: { gl: 0, grow: 0, eg: 0, h: 4, s: 2, bk: 1 }
clicks: 1
---

<StageSteps :clicks="{ 1: { s: 0 } }" />

<div class="nums" style="--d1: 1.5s; --d2: 2.5s">
  <p><b>41 090</b><span class="name">window</span></p>
  <p><b>21 077</b><span class="name">background</span></p>
</div>

<!-- facts: d0-window-5sigma-line-worked, d0-peak-5sigma-file-order-worked, d0-row1-values-worked -->

<!--
Message: the two side bands count the background under the window, so the excess is the window minus that count, measured in √(background).
Picture: the white window ("41 090 candidates in 1 850-1 880"); the light-blue bands either side ("their count, scaled by 30/40, is the background under the window"); the light-blue line across the window ("that background, 21 077, spread over the window's bins: everything above it is the excess"); the gaps ("not used"); the ring rising with the dust ("ours, at 1 880.6, sits in a gap and is not used"); [click] the ring goes.
Caveats: the line is b/15 = 1 405.2 a bin (the dk-curve reads b from d0-significance.json and spreads it over the 30 MeV/c² window). b = ¾ × the side bands assumes a flat background over 1 820-1 910; z = (N_on − b)/√b treats b as exact and gives about 138 σ for the whole file (notes only; the next slide's count carries the significance). The window stays 1 850-1 880, so our row is out of every band. No fit, width or curve: next time.
Sources: CERN Open Data record 401; d0-significance.json (bake/d0.py).
(~0.9 min)
-->

---
# in file order: the same three bands refill from empty in the file's own order, scaled to their own height (10 a bin full,
# one grain a count, all landed by about 1.3 s); once the 186 stand, the light-blue background level (3.0 a bin) and the white 5 σ height (5.24 a bin)
# draw across the window, which stands just at it; the click pours in the rest, the scale takes the full set and both lines
# glide to the whole file's (1 405 and 1 453.5 a bin) while the window rises far above them, the pour (2.4 s, alpha 0.38, an even rate) and the glide done together within about 3 s
space: { at: [-1, 3.4, 0], dist: 23, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, s: 0, bk: 0, hf: 1, bkf: 1, b5f: 1 }
clicks: 1
---

<StageSteps :clicks="{ 1: { hf: 2, bkf: 2, b5f: 2 } }" />

<div class="nums" style="--d1: 0.8s; --d2: 2.4s">
  <p><b><StageCount for="hf" :to="186" /></b><span class="unit">candidates</span></p>
  <p><b>5</b><span class="unit">σ</span><span class="name">stays above</span></p>
</div>

<!-- facts: d0-peak-5sigma-file-order-worked -->

<!--
Message: read in the file's order, the excess passes 5 σ after 186 candidates and never falls back.
Picture: the 186 candidates read, one grain a count, the count climbing as they land; the light-blue line ("the background the side bands count under the window, 45 in all"); the white line ("the height the window needs for 5 σ"); the white window standing at it ("79 in the window: just past 5 σ"); [click] the pour of the rest, both lines move to the whole file's levels and the window rises far over them ("from here it only grows").
Caveats: file order is not time order: say "in the file". At 186 rows b = 0.75 × 60 = 45 and the 5 σ height is (45 + 5√45)/15 = 5.236 a bin, typed into the deck's curve until the bake carries it as a set (notes/kit-requests.md); the background line reads 60 from d0-significance.json and spreads it over the side bands' 40 MeV/c². Of the 186 rows read, 139 fall in the three bands and are drawn. z first touches 5 at candidate 27 (14 in the window, 5 in the side bands) and dips again, so say only "stays above"; the end value is about 138 σ.
Sources: CERN Open Data record 401; d0-significance.json, d0-z.f32 (bake/d0.py).
(~0.9 min)
-->

---
# one Higgs-like event: the last 4.4 s of CERN's animation of a real 2011 collision with two photons, from the source's own cut to the
# black-background event view (the red calorimeter fly-through is left out, so the clip holds no cut inside it),
# zoomed 1.25x so the source's burned-in event label and display logo are out of frame (videos/manifest.toml); the world rests at the close's crane start under the clip
space: { at: [-1, 6, 0], dist: 32, yaw: -4, pitch: 16, dim: 0.3, ambient: 0, steady: true, sway: 0, path: [[0, { at: [-1, 6, 0], dist: 32, yaw: -4, pitch: 16 }]] }
steps: { hf: 0, bkf: 0, b5f: 0 }
---

<VideoPlayer src="cern_video_2011_191_001_hgg.mp4" muted />

<!-- facts: cds-1406328-cms-hgg-clip, higgs-boson-what-cern, higgs-idea-to-discovery-48-years -->

<!--
Message: the Higgs boson is a wave in the field that gives elementary particles their mass, proposed in 1964 and the LHC's great search, and one collision can look like one and still be background.
Picture: the two orange towers ("two high-energy photons, as a Higgs boson would give").
Caveats: December 2011, before the discovery; CERN's own caption says the event is also consistent with background from known physics. The clip is the animation's last 4.4 s (from its cut to the black event view), zoomed 1.25x about the collision point (the source's corner label is cropped away).
Sources: videos.cern.ch record 1406328 (CERN-VIDEO-2011-191-001), licence CERN; CERN, "The Higgs boson"; Nobel Prize 2013.
Clip 4.4 s, then the hold.
(~0.5 min)
-->

---
# Fourth of July 2012: the CERN auditorium, one shot (the room from the front stairs, applauding); the clip itself dims to 40 % over
# its last second (baked into the raw: videos/manifest.toml), so the held frame and the dust that carries it out to the close are both dim
space: { at: [-1, 6, 0], dist: 32, yaw: -4, pitch: 16, dim: 0.3, ambient: 0, steady: true, sway: 0 }
---

<VideoPlayer src="cern_video_2022_016_001_2012_room.mp4" muted />

<div class="nums" style="--d1: 5.4s; --d2: 6s">
  <p><b>5.0</b><span class="unit">σ</span><span class="name">CMS</span></p>
  <p><b>5.9</b><span class="unit">σ</span><span class="name">ATLAS</span></p>
</div>

<!-- facts: higgs-cms-2012-5p0-sigma, higgs-atlas-2012-5p9-sigma, cern-higgs-nobel, cds-2296228-higgs10-clip -->

<!--
Message: in 2012 two experiments each passed 5 σ on their own, and on 4 July CERN announced a new particle.
Picture: the room ("CERN's auditorium, 4 July 2012"); the two numbers ("each experiment past 5 σ, separately").
Caveats: paper values, local significances (PLB 716 (2012) 1 and 30, July 2012). The seminar's own figures differ slightly and are not in the bank: do not quote them. Nobel Prize 2013 to Englert and Higgs. The clip is from a 2022 anniversary release that contains the 2012 footage: one 4.1 s shot of the room applauding, dimmed to 40 % over its last second.
Sources: ATLAS, PLB 716 (2012) 1; CMS, PLB 716 (2012) 30; videos.cern.ch record 2296228 (CERN-VIDEO-2022-016-001), licence CERN.
Clip 4.1 s, then the hold.
(~0.5 min)
-->

---
# close (talk 3's cover pose): a cut under the clip's last frame, a crane down onto the full plot already standing; the light-blue
# background level (1 405 a bin) and the white 5 σ height just above it (1 453.5) draw across the window once, the peak far over
# both; the click fades them to the bare peak
space: { at: [-1, 3.2, 0], dist: 25, yaw: -4, pitch: 5, dim: 0.3, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-1, 6, 0], dist: 32, yaw: -4, pitch: 16 }], [4, { at: [-1, 3.2, 0], dist: 25, yaw: -4, pitch: 5 }]] }
steps: { hf: 0, bkf: 0, b5f: 0, h: 5, s: 2, bk: 1, b5: 1 }
clicks: 1
---

<StageSteps :clicks="{ 1: { b5: 0, bk: 0 } }" />

<!-- facts: five-sigma-p-value-one-sided, look-elsewhere-effect-definition, d0-window-5sigma-line-worked, d0-peak-5sigma-file-order-worked -->

<!--
Message: a count wobbles by √N, and a bump is a discovery only when chance would make it less than once in 3.5 million tries after every place you looked is counted; this peak passed that line long ago, and next time we ask exactly where it stands.
Picture: the light-blue line ("the background the side bands count under the window"); the white line just above it ("the height the window would need to be just 5 σ: only about 48 a bin over the background"); the peak far over both, about 1 300 a bin over the background ("counted, far past 5 σ"); the ring ("ours is back in its bin; still nobody can say whether our one grain is the particle"); [click] the line goes, and the bare peak is where next time starts.
Caveats: the white line is (b + 5√b)/15 = 1 453.5 a bin with b = 21 077.25 from the side bands, the light-blue one b/15 = 1 405.2, against 2 739 a bin in the window (1 334 over the background): counted levels, not a fit.
Sources: CERN Open Data record 401; d0-significance.json line5sigma (bake/d0.py); PDG, Review of Particle Physics 2024, Statistics.
(~0.9 min)
-->
