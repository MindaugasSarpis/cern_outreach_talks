---
theme: ../../theme
colorSchema: dark
transition: dust          # the series' DOM cut (bible §3): no slide's numbers stand faded over the next
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-00-00-data3fit
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }   # silent takes; the owner narrates, one music bed in the edit
  options: { aberration: 0 }   # tick numbers are world sprites: no colour fringes on them
title: Fitting
info: |
  Talk 3 of 5 of "Data analysis, the CERN way", for STEM students. One short-lived
  particle's mass peak in open data: window means wander; a model with five knobs is
  fitted to the counts; the fit is the bottom of a χ² valley and its error is the
  valley's width; the world value sits 3.5 σ up the wall, and a 0.026 % momentum-scale
  shift would close the gap, inside the 0.03 % uncertainty; decay times, sideband subtraction and a quality cut give the
  lifetime; every grain gets a signal share. Pictures and numbers only on screen;
  sources and the said text live in the notes.
lang: en                  # slides and notes; `pnpm talk lint` reads it
htmlAttrs:
  lang: en
duration: 15min
onscreen: numbers
sources: notes
layout: cover
# T2's last frame exactly (its close pose and state: the full plot standing, our grain ringed white with no core of its own, as T2's spark step 2): a first-guess line draws on once the plot stands,
# and the camera slides the plot right in 2.5 s while the title rises (as T4's cover), so the title stands clear of the bars; the scrim stays behind the title only (styles/index.css)
space: { at: [-7.5, 3.2, 0], dist: 27, yaw: -4, pitch: 5, dim: 0.3, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-1, 3.2, 0], dist: 25, yaw: -4, pitch: 5 }], [2.5, { at: [-7.5, 3.2, 0], dist: 27, yaw: -4, pitch: 5 }]] }
steps: { h: 1, fit: 1, bowl: 0, ours: 1, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
---

# Fitting

<!-- facts: record401-candidates-91583, d0-row1-values-worked -->

<!--
Message: last time we counted this peak and showed that it is real; today we draw a line through it and measure where it stands.
Picture: the same heap as last time, one grain per candidate, all 91 583 of them; the white ring marks our grain in the 1 880-1 882 MeV/c² bin, standing a few grains up its column, the grain itself in the plot's light blue, as last talk left it; the line of grains drawing across the peak is the model we will fit, set at a first guess; as the title rises the plot slides right, clear of it.
Caveats: always "candidates": the file holds 91 583, while the portal counts 53 948 events, and an event can hold more than one candidate. The axis runs 1 816-1 912 MeV/c², the series' range, inside the file's own pre-selection window.
Sources: CERN Open Data record 401 (DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR), through the data kit's bake/d0.py (d0.f32, d0-fit.json).
(~0.5 min)
-->

---
# the mass plot right of the numbers, the window lit white; it narrows once here (the third width lands on the close pose, next slide); the dim dotted mark is the world value
space: { at: [-8.7, 3.2, 0], dist: 28, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 0.5 }
steps: { h: 2, fit: 0, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 1
---

<StageSteps :clicks="{ 1: { h: 3 } }" />

<div class="nums" style="--d1: 2.4s; --d2: 3.4s">
  <p><b><StageCount for="h" :to="1864.79" :decimals="2" /></b><span class="unit">MeV/c²</span><span class="name">mean</span></p>
  <p><b>1 864.84</b><span class="unit">MeV/c²</span><span class="name">world</span></p>
</div>

<!-- facts: course-d0-row-means-worked, pdg-d0-mass-2026 -->

<!--
Message: the average of the grains inside a window depends on the window: as it narrows, the mean climbs toward the world value.
Picture: the white band is the window and the white tick under it its mean, the live number; the dim dotted mark is the world value, 1 864.84 MeV/c², from the Particle Data Group, which averages every measurement; the window is 50 MeV/c² wide (1 840-1 890), then 30 (1 850-1 880), and the mean goes 1 864.71, 1 864.79. At this distance the mean tick and the world mark stand within a grain of each other, so the number carries the climb; the next slide cuts close, where they can be told apart once the window moves.
Caveats: the mean of all 91 583 candidates is 1 864.10 MeV/c². All three windows are centred on 1 865 MeV/c², so the narrower they get, the harder the mean is pulled toward 1 865: the narrowest lands near the world value because of where it was put. Narrower still, 1 860-1 870, gives 1 864.92, past it.
Misconception: "the narrowest window's mean, the one nearest the world value, is the mass". The next slide moves the same window by half an MeV/c².
Sources: record 401 via bake/d0.py (d0-means.json); PDG 2026, pdgLive S032 (the "OUR FIT" value, 1 864.84 ± 0.04 MeV/c²).
(~0.8 min)
-->

---
# cut closer to the peak (right of the numbers, dist 10.5: the white window, blue columns either side and the labelled world mark in one frame): the window narrows to 20 MeV/c² and its mean,
# a white dotted mark at the world mark's height and depth (h step 4: `meanTick: false` and the mean as a step tick), lands on the world mark as one line; on the click the same window slides half
# an MeV/c² left and the mean's mark, shorter and labelled 1 864.42, stands apart from the dim world mark labelled 1 864.84
space: { at: [-2.4, 8.9, 0], dist: 10.5, yaw: -4, pitch: 3, dim: 0.25, ambient: 0, steady: true, sway: 0.3, path: [[0, { at: [-2.4, 8.9, 0], dist: 10.5, yaw: -4, pitch: 3 }]] }
steps: { h: 4, fit: 0, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 1
---

<StageSteps :clicks="{ 1: { h: 5 } }" />

<div class="nums" style="--d1: 1.8s; --d2: 2.6s">
  <p><b><StageCount for="h" :to="1864.42" :decimals="2" /></b><span class="unit">MeV/c²</span><span class="name">mean</span></p>
  <p><b>1 864.84</b><span class="unit">MeV/c²</span><span class="name">world</span></p>
</div>

<!-- facts: course-d0-row-means-worked, d0-window-centre-bias-worked, pdg-d0-mass-2026 -->

<!--
Message: narrowed to 20 MeV/c², the window's mean lands on the world value; the same window moved half an MeV/c² to the left gives a mean 0.4 MeV/c² lower, below it, so a window's mean cannot be the mass.
Picture: the cut lands closer on the peak, the white window with light-blue columns either side, as the window narrows to 20 MeV/c² (1 855-1 875); its mean, a white dotted mark, stands at 1 864.81 MeV/c² on the dim dotted world mark labelled 1 864.84, and the two read as one line; on the click the window slides 0.53 MeV/c² to the left, onto 1 864.47 MeV/c², where the fit will put the peak, and the mean's mark, shorter now and labelled 1 864.42, stands to the left of the world mark, apart from it.
Caveats: centred on 1 864.47, windows 50, 30, 20 and 10 MeV/c² wide give 1 864.38, 1 864.46, 1 864.42 and 1 864.44 MeV/c², below the world value whatever the width. The background under the peak is not flat, so every window's mean carries some of it. 1 864.47 is the fit's answer (slide 5); here it only places the window.
Sources: record 401 via bake/d0.py (d0-means.json, centredOnFit); PDG 2026, pdgLive S032.
(~0.7 min)
-->

---
# lab 3 slide 1, framed closer: the model at its start values over lighter columns, the pull row under the axis with its zero line and dotted ±2 guides (fit `pull.y` −0.46, `height` 0.15:
# the row clear of the caption; `split.zero` 0.15 of 14 000 grains: the zero line and the guides dense enough to read); a one-key cut from slide 3's pose; dist 25, so the plot stands between the numbers and the right edge
space: { at: [-7.1, 2.6, 0], dist: 25, yaw: -4, pitch: 5, dim: 0.15, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-7.1, 2.6, 0], dist: 25, yaw: -4, pitch: 5 }]] }
steps: { h: 6, fit: 2, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
---

<div class="nums" style="--d1: 2s; --d2: 3s">
  <p><b>7.2</b><span class="unit">MeV/c²</span><span class="name">width</span></p>
  <p><b><StageCount for="fit" :to="371.5" :decimals="1" /></b><span class="name">χ²</span></p>
</div>

<!-- facts: d0-fit-start-fwhm-worked, d0-fit-start-chi2-worked -->

<!--
Message: a model is a curve with five knobs, set here by eye from the peak's height, centre and width; each pull is one bin's miss in units of its √N wobble, and χ² adds the pulls up, squared.
Picture: the white line is a bell curve (last talk's) on a straight background line, over the 84 680 candidates between 1 820 and 1 910 MeV/c²; the row under the axis is each bin's pull, (count − model) / √count, standing up or down from its zero line, with dim dotted guides across the row at +2 and −2 (their numbers at the row's left end); the S of large pulls on the flanks, from −3 to +3.5, well past the guides, is what χ² 371.5 means.
Caveats: the start width comes from the full width at half maximum, 16.86 MeV/c² / 2.355 = 7.16 MeV/c², at the tallest bin's centre, 1 863.0 MeV/c². The five knobs are the signal count, the centre μ, the width, the background's level and its slope. "Width" is the bell's spread; σ keeps its meaning from last talk, the significance. χ² at the start values is 371.5 over 45 bins.
Sources: record 401 via bake/d0.py (d0-fit.json start, iterations[0]).
(~1.5 min)
-->

---
# lab 3 slide 2, slide 4's pose (the glide plays on the same frame, the pulls legible): the curve glides through the minimiser's logged steps onto the column tops; the pulls lose their pattern
# the χ² line stays where slide 4 had it (the block's last line), μ and the width rise above it on click 2
space: { at: [-7.1, 2.6, 0], dist: 25, yaw: -4, pitch: 5, dim: 0.15, ambient: 0, steady: true, sway: 1 }
steps: { h: 6, fit: 2, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 2
---

<StageSteps :clicks="{ 1: { fit: 3 }, 2: { fit: 5 } }" />

<div class="nums" style="--d1: 0.2s; --d2: 0.6s; --d3: 1.6s">
  <p v-click="2"><b>1 864.47</b><span class="unit">MeV/c²</span><span class="name">μ</span></p>
  <p v-click="2"><b>7.65</b><span class="unit">MeV/c²</span><span class="name">width</span></p>
  <p><b><StageCount for="fit" :to="53.4" :decimals="1" /></b><span class="name">χ²</span></p>
</div>

<!-- facts: course-d0-fit-mass-worked, d0-fit-chi2-ndf-worked, d0-mass-resolution-lhcb -->

<!--
Message: the fit moves the knobs, step by step, until the pulls are as small as they get. Each pull wobbles by about ± 1 by chance, so a model that matches has χ² near the number of bins minus the knobs, 45 − 5 = 40; 53 for 40 happens by chance about 8 % of the time.
Picture: the clicks follow the minimiser's logged steps: the white curve slides onto the column tops and χ² falls from 371.5 to 56.6 (click 1), then glides through the last logged steps to 53.4 (click 2); on the last click the dashed curve is the signal part alone (the background is the curve's flat shoulders), and the pull row is small, inside the dotted ±2 guides, with no pattern left; the centre μ is 1 864.47 MeV/c² and the width 7.65 MeV/c². The 40 (45 bins minus 5 knobs, the degrees of freedom) is said, not shown.
Caveats: χ²/ndf 1.33, p = 0.077 (last talk's p-value). The width is the detector's mass resolution, about 8 MeV/c² in the experiment's own papers; the particle's own width is far smaller (slide 13). Steps 3 to 5 of the log differ only in the fourth decimal, so two clicks show them: the first step, then the rest as one glide. The path is logged by the bake script, never drawn by hand. The error on μ comes on slide 7, where it is defined.
Sources: record 401 via bake/d0.py (d0-fit.json); LHCb, JHEP 03 (2016) 159 (mass resolution).
(~2 min)
-->

---
# lab 3 slide 4 (the bowl centred right of the number, a margin all round): the camera rises over 1.5 s while the plot (no axis, ticks or caption: h step 13 `axis: false`) tips back 62° and its grains
# lift away as dust (`cut` that takes them all, gone by about 2.5 s) and its curve fades (fit step 9, 0.8 s), as the χ² bowl gathers under the floor (the screen is never empty); click 1 the ball rolls in, click 2 the Δχ² = 1 ring lights
space: { at: [-3, -2.8, 6.2], dist: 20, yaw: -12, pitch: 30, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [-7.1, 2.6, 0], dist: 25, yaw: -4, pitch: 5 }], [1.5, { at: [-3, -2.8, 6.2], dist: 20, yaw: -12, pitch: 30 }]] }
steps: { h: 13, fit: 9, bowl: 1, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 2
---

<StageSteps :clicks="{ 1: { bowl: 2, h: 0, fit: 0 }, 2: { bowl: 3 } }" />

<div class="nums" style="--d1: 0.2s">
  <p v-click="1"><b><StageCount for="bowl" :to="1864.47" :decimals="2" /></b><span class="unit">MeV/c²</span><span class="name">μ</span></p>
</div>

<!-- facts: d0-fit-valley-delta-chi2-worked, course-d0-fit-mass-worked -->

<!--
Message: every pair of knob values, centre and width, has its χ²; the fit is the bottom of that valley.
Picture: as the camera rises the plot tips back and its grains lift away as dust while its fitted curve fades, and the valley gathers under the floor where the plot stood (the plot carries no axis, numbers or caption now); height is χ² above its minimum (captioned Δχ² at the left rim's back corner), μ runs along the front lip (its numbers 1 864.3, 1 864.5 and 1 864.7, captioned "μ MeV/c²", the same units as the μ on the left) and the width across, from front to back (7.6 and 7.8 on the right edge, captioned "width MeV/c²"); on click 1 the ball, the minimiser, rolls in over the rim along the steps the last slide took; on click 2 the white ring lights where χ² stands 1 above the bottom, and the next slide turns it into a number.
Caveats: the other three knobs are re-fitted at each point of the valley. The path starts at 1 863.0, outside the part drawn, so the ball rolls in over the rim. The tipped plot shows no axis, tick numbers or caption and is gone before the μ number and the ball: two μ scales on one screen would read as one.
Sources: record 401 via bake/d0.py (d0-chi2.json).
(~1.5 min)
-->

---
# cut to the slice station (lab 3 slide 3): one cut through the valley along μ; the ball rolls to the bottom (1.6-2.5 s); the Δχ² = 1 bar is the error
# out of view at the mass station, the plot and its fitted curve (thinned for the close pose) stand ready for slide 9's cut back (h 8, fit 8), so that cut opens on them at their scale
space: { at: [64.5, 3.6, 0], dist: 18, yaw: 0, pitch: 3, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [64.5, 3.6, 0], dist: 18, yaw: 0, pitch: 3 }]] }
steps: { h: 8, fit: 8, bowl: 0, ours: 0, big: 0, s1: 3, s2: 0, tau: 0, decay: 0 }
---

<div class="nums" style="--d1: 2.4s; --d2: 3.2s">
  <p><b><StageCount for="s1" :to="1864.47" :decimals="2" /></b><span class="unit">MeV/c²</span><span class="name">μ</span></p>
  <p><b>± 0.10</b><span class="unit">MeV/c²</span><span class="name">error</span></p>
</div>

<!-- facts: d0-fit-valley-delta-chi2-worked, d0-fit-window-stability-worked -->

<!--
Message: the error is how wide the valley is where it stands 1 above its bottom: ± 0.10 MeV/c².
Picture: one cut through the valley along μ: the white parabola is χ² above its minimum; the ball rolls to the bottom; the dim line is Δχ² = 1 (its level numbered at the slice's left end, under the Δχ² caption), and the white bar along it runs from 1 864.38 to 1 864.57 MeV/c², a half-width of 0.0965 MeV/c², the fit's statistical error.
Caveats: "statistical" means from the counts' √N alone. The slice is drawn up to Δχ² = 4, so the ball's first leg starts at the slice's left end. The same cut along the width gives ± 0.10 MeV/c² for the width. Moving the 90 MeV/c² fit range by 4 MeV/c² moves μ by at most 0.03 MeV/c², inside its ± 0.10.
Sources: record 401 via bake/d0.py (d0-chi2.json slice; d0-fit.json stability).
(~1 min)
-->

---
# same station, a step back: the slice drawn to Δχ² 20, its levels 1, 4, 9 and 16 numbered, the ball at the bottom labelled 1 864.47 (no ring: slide 7 said the bar's ends), the world value as a white band
# high on the right wall (fill 0.5, 4 000 grains), labelled 1 864.84 (the mass plot stands ready out of view, as on slide 7)
space: { at: [64.5, 4.3, 0], dist: 19, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.5 }
steps: { h: 8, fit: 8, bowl: 0, ours: 0, big: 0, s1: 0, s2: 1, tau: 0, decay: 0 }
---

<div class="nums" style="--d1: 2.4s; --d2: 3.4s">
  <p><b>0.37</b><span class="unit">MeV/c²</span><span class="name">gap</span></p>
  <p><b>3.5</b><span class="unit">σ</span></p>
</div>

<!-- facts: d0-pdg-gap-3p5-sigma-worked, d0-pdg-on-valley-wall-worked, pdg-d0-mass-2026, course-d0-fit-mass-worked -->

<!--
Message: the world value lies high up the wall of our valley, 0.37 MeV/c² away. Δχ² = n² is n errors from the bottom (1 is one error, 4 is two, 9 is three); at the world value Δχ² is 14.5, so it is 3.8 of our errors away, and with its own ± 0.04 added in quadrature, √(0.0965² + 0.04²) = 0.104, the gap is 3.5 σ.
Picture: the same valley as the last slide, drawn up to Δχ² 20, its levels 1, 4, 9 and 16 numbered at the left end (one, two, three, four errors); the ball rests at the bottom, its value 1 864.47 MeV/c² under it; the white band is the world value, 1 864.84 ± 0.04 MeV/c², a light band between two white edges, standing on the right wall where the wall runs from Δχ² 11.5 to 17.8; the white tick under it is 1 864.84. The band stands between the levels 9 and 16, between three and four errors from the bottom.
Caveats: 3.5 σ is 0.368 / 0.1045 = 3.52 from unrounded values; the rounded 0.37 / √(0.10² + 0.04²) gives 3.44, and the course's ± 0.05 gives 3.3. Independent errors add in quadrature. σ here is last talk's significance.
Misconception: "3.5 σ means the fit is wrong, or new physics". A statistical error says nothing about a scale error, which is the next slide.
Sources: PDG 2026, pdgLive S032; record 401 via bake/d0.py (d0-fit.json gap; d0-chi2.json pdgOnSlice).
(~1 min)
-->

---
# cut back to the mass plot, close on the summit (dist 5: 0.37 MeV/c² is about 18 px; right of the numbers, which stand on black) between two marks of different heights (our fit dim and lower, the world
# value white and higher, their labels staggered); the curve stands at once, thinned (fit 8) so its glow leaves the summit's columns and the marks clear; every grain slides by the scale and the summit glides onto the white mark
space: { at: [-1.5, 10.3, 0], dist: 5, yaw: -4, pitch: 3, dim: 0.35, ambient: 0, steady: true, sway: 0.3, path: [[0, { at: [-1.5, 10.3, 0], dist: 5, yaw: -4, pitch: 3 }]] }
steps: { h: 8, fit: 8, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 1
---

<StageSteps :clicks="{ 1: { h: 9, fit: 7 } }" />

<div class="nums" style="--d1: 2.4s; --d2: 0.2s">
  <p><b>0.026</b><span class="unit">%</span><span class="name">momentum</span></p>
  <p v-click="1"><b>0.03</b><span class="unit">%</span><span class="name">uncertainty</span></p>
</div>

<!-- facts: d0-mass-shift-0p02pct-worked, lhcb-momentum-scale-uncertainty, pdg-d0-mass-2026 -->

<!--
Message: each mass is computed from the two tracks' momenta (last talk), and each momentum from how far the magnet bends its track; if that bending is calibrated 0.026 % off, every mass moves by 0.02 % and the gap closes. The experiment's own uncertainty on its momentum scale is 0.03 %, so a result is quoted as value ± stat ± syst.
Picture: the camera is close on the summit; the dim, lower mark is our fit, 1 864.47 MeV/c², the white, taller one the world value, 1 864.84; on the click every grain's mass is multiplied by 1.000197, the grains slide right by 0.37 MeV/c² and restack (those that change bin flash white for a moment), and the thin curve moves its summit from the dim mark to the white one.
Caveats: a two-track mass moves by 0.86 of the momentum scale for a particle decaying at rest, and by 0.77 on average over simulated decay angles, so the momentum shift is about 0.026 % for a mass shift of 0.0197 %. The refit gives 1 864.85 ± 0.10 MeV/c²; the curve's other knobs are held at the fit's values. This shows only that a shift of the size the experiment quotes would close the gap; it does not show that the scale is the cause (energy loss, alignment and the open sample's own processing are others). 0.03 % is the momentum-scale systematic of the 2010-2012 data, an uncertainty rather than a calibration precision. The name on screen is "momentum", so it does not collide with slide 5's p-value.
Sources: LHCb, Int. J. Mod. Phys. A 30 (2015) 1530022 (momentum scale); record 401 via bake/d0.py (d0-fit.json scale).
(~1 min)
-->

---
# clip: real footage of the silicon tracker going in; the clip's grains gather over slide 9's last frame (the plot holds, h 9, fit 7), and once the clip covers it (1.9 s, the dust's arrival) the camera cuts under it to the decay-time station, which waits hidden
space: { at: [140, 6, 0], dist: 30, yaw: -20, pitch: 18, dim: 0, ambient: 0, path: [[0, { at: [-1.5, 10.3, 0], dist: 5, yaw: -4, pitch: 3 }], [1.9, { at: [-1.5, 10.3, 0], dist: 5, yaw: -4, pitch: 3 }], [1.94, { at: [140, 6, 0], dist: 30, yaw: -20, pitch: 18 }]] }
steps: { h: 9, fit: 7, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
---

<VideoPlayer src="lhcb_velo_installation_cut.mp4" muted />

<!-- facts: cds-2295935-velo-clip, lhcb-velo-distance, lhcb-record401-year -->

<!--
Message: to time a decay we have to see where each particle was made and where it decayed; silicon a few millimetres from the beams does that.
Picture: real footage, 2022: one half of the silicon tracker that sits around the collision point, on the crane and then lowered down the shaft into the cavern.
Caveats: the clip shows the 2022 upgrade, its nearest silicon 5.1 mm from the beam line. The data in our plots were taken in 2011 or 2012 (the record does not say which) with the tracker this one replaced.
Sources: videos.cern.ch record 2295935 (CERN-FOOTAGE-2022-031-001, licence CERN, no credit needed), cut 0:20.4-0:32.4; the LHCb VELO upgrade (5.1 mm); the CERN Open Data LHCb masterclass guide and record 401 (data-taking year).
Clip 12 s, muted; the owner talks over it. The lifetime itself is said on the next slide.
(~0 min)
-->

---
# crane from the clip's cut down onto the decay-time axis (lab 3 slide 5) in 1.5 s; 2 000 candidates drop in from 0.3 s, while the clip breaks up and the camera moves, then on the click the sideband pairs vanish
# out of view, the mass plot goes back to its fitted state (h 10, fit 6) for slide 13's cut
space: { at: [134.5, 2.6, 0], dist: 18.5, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [140, 6, 0], dist: 30, yaw: -20, pitch: 18 }], [1.5, { at: [134.5, 2.6, 0], dist: 18.5, yaw: -4, pitch: 5 }]] }
steps: { h: 10, fit: 6, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 2, decay: 0 }
clicks: 1
---

<StageSteps :clicks="{ 1: { tau: 3 } }" />

<div class="nums" style="--d1: 0.6s">
  <p><b><StageCount for="tau" :to="596" /></b><span class="name">candidates</span></p>
</div>

<!-- facts: pdg-d0-lifetime-2026, d0-tau-subtract-2000-worked -->

<!--
Message, beat 1 (as the grains land): a decay time is flight length over speed; these particles live on average 0.41 ps, which is 123 µm of flight in their own frame (cτ).
Message, beat 2 (the click): under the peak sits background (last talk's sidebands); its decay times are known from the sidebands and are removed bin by bin.
Picture: the axis is decay time, 0 to 5 ps; as the camera cranes down 2 000 candidates drop in (by about 3 s), white from the mass window 1 850-1 880 MeV/c², light blue from the sidebands 1 820-1 840 and 1 890-1 910 MeV/c², and the live count climbs to 2 000; on the click three of every four sideband grains take one window grain of their bin with them and the rest go alone, leaving a faint ghost where they stood, because the sidebands are 40 MeV/c² wide against the window's 30; what stays white is the particle's part, and the count falls to 596.
Caveats: the flight in the lab is longer than cτ by βγ = p/(Mc). The 2 000 are the first in the plot's seeded order (1 172 window, 828 sideband); the counted subtraction 1 172 − 0.75 × 828 gives 551, the pairing leaves 596. The subtraction is statistical, pairs within a bin, and decides nothing about any one grain. Our grain (1 880.65 MeV/c²) is just outside the window and in no sideband, so it is on none of the decay-time plots.
Sources: record 401 via bake/d0.py (d0-tau.json plotSubtract); PDG 2026 summary tables (τ, cτ).
(~1.0 min)
-->

---
# lab 3 slides 6-7 as one slide (motion review: a second slide replayed the subtraction and redrew the curve): every candidate drops in (about 1.6 s) while
# the 596 glide down to the new scale; click 1 the subtraction; click 2 the exponential fitted from 0.5 ps without the cut; click 3 the quality cut lifts failing
# grains away at every decay time, most from the long tail, and the curve steepens onto the committed fit
space: { at: [134, 2.6, 0], dist: 19, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 10, fit: 6, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 4, decay: 0 }
clicks: 3
---

<StageSteps :clicks="{ 1: { tau: 5 }, 2: { decay: 1 }, 3: { tau: 6, decay: 2 } }" />

<!-- τ is the curve's own readout (decay `readout: tau`): 0.509 on click 2, gliding to 0.421 with the curve on click 3; the error is its own line, as on slide 7 -->
<div class="nums" style="--d1: 0.2s; --d2: 0.6s; --d3: 1.4s">
  <p v-click="2"><b><StageCount for="decay" :to="0.421" :decimals="3" /></b><span class="unit">ps</span><span class="name">τ</span></p>
  <p v-click="2"><b>0.410</b><span class="unit">ps</span><span class="name">world</span></p>
  <p v-click="3"><b>± 0.005</b><span class="unit">ps</span><span class="name">error</span></p>
</div>

<!-- facts: d0-lifetime-without-ipchi2-cut-worked, d0-lifetime-fit-from-record401-worked, d0-from-b-ipchi2, d0-masterclass-ip-cut, pdg-d0-lifetime-2026, d0-natural-width-worked -->

<!--
Message, beat 1 (arrival to click 2): all the candidates, subtracted the same way, fall as an exponential, but one that lives too long: 0.509 ps against the world value's 0.410.
Message, beat 2 (click 3): a heavier particle that flies a few millimetres before it decays can produce ours, and one made that way starts away from the collision point and fakes a long life; a quality cut on how far the particle's track points from the collision removes most of them, and τ comes out at 0.421 ± 0.005 ps.
Picture: on arrival every other candidate with a decay time drops in while the 596 that stood glide down to the full plot's scale, white from the window, light blue from the sidebands; click 1 is the same subtraction for all of them; on click 2 the white line is the exponential fitted from 0.5 ps, and the light-blue columns below 0.5 ps are the ones the fit does not use (the sideband grains are gone by then); on click 3 the grains that fail the cut lift away as dust at every decay time, most of them from the long tail (about a quarter to a third of the window's grains below 1 ps, half by 1.5 ps, nine in ten beyond 3 ps), the columns settle, the white curve steepens onto the new fit, and the τ number glides with it from 0.509 to 0.421, its error ± 0.005 ps below the world value.
Caveats: the file's decay times start at 0.150 ps (a pre-selection), and the efficiency rises over the first tenths of a ps, so the fit starts at 0.5 ps (an exponential is memoryless); the acceptance is not modelled. Without the cut, moving the start from 0.25 to 1.0 ps moves τ from 0.482 to 0.571 ps: something long-lived is mixed in. The cut is itself a χ², (how far the track misses the collision point / its error)², kept below 9, so within 3 errors (the fourth number of each row in the first talk). Unbinned, sideband-weighted fit on 0.5-5 ps (8 129 window and 636 sideband candidates, net 7 652), statistical error only; moving the start or the cut (from 2 to 25) moves τ between about 0.416 and 0.427 ps, and particles from heavier decays that pass the cut remain and pull τ up. A teaching fit; the experiment measures this with far more care, and its own student exercise cuts on the distance itself. With τ measured, slide 5's 7.65 MeV/c² width is the detector's: the particle's natural width is ħ/τ = 6.582 × 10⁻²² MeV s / 4.103 × 10⁻¹³ s = 1.6 × 10⁻⁹ MeV. Our grain would fail the cut.
Sources: record 401 via bake/d0.py (d0-tau.json scanT0.all, fit, scanIp, hist; IPχ² < 9 on the record's IPCHI2 column); LHCb, JHEP 03 (2016) 159 (D⁰ from b-hadron decays); the LHCb D⁰ lifetime masterclass (log₁₀ IP cut); PDG 2026 (τ, ħ).
(~1.8 min)
-->

---
# cut back to the mass plot (the sparse weights slide, reframed per the owner and again from review): the peak right of the numbers, summit, fitted-centre mark and our ring in one frame; the grains whiten by signal share, our grain's large light-blue core takes its own 0.144 and stays mostly light blue
space: { at: [-6, 3.2, 0], dist: 24, yaw: -4, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 0.3, path: [[0, { at: [-6, 3.2, 0], dist: 24, yaw: -4, pitch: 4 }]] }
steps: { h: 10, fit: 6, bowl: 0, ours: 0, big: 1, s1: 0, s2: 0, tau: 0, decay: 0 }
clicks: 1
---

<StageSteps :clicks="{ 1: { h: 11, big: 2 } }" />

<div class="nums" style="--d1: 2.4s; --d2: 0.4s">
  <p><b>16.2</b><span class="unit">MeV/c²</span><span class="name">offset</span></p>
  <p v-click="1"><b>0.144</b><span class="name">P(signal)</span></p>
</div>

<!-- facts: d0-row1-signal-share-worked, d0-row1-values-worked, course-d0-fit-mass-worked -->

<!--
Message: the fit gives every grain a signal share; ours is 0.144, so it stays mostly light blue.
Picture: the whole peak with its fitted curve; the white dotted mark standing through the summit is the fitted centre, labelled 1 864.47 MeV/c² above it; the white ring on the right flank marks our grain, 16.2 MeV/c² (2.1 widths) right of that mark, its core drawn large in the light blue it has had since Talk 2's close; on the click each grain whitens by its signal share, left to right: white where the fitted signal stands high over the background, light blue out on the flanks; our grain's core takes its own share, 0.144, and stays mostly light blue while the summit whitens, and the ring stays white.
Caveats: at 1 880.65 MeV/c² the fit has 233.6 signal and 1 390.5 background candidates per 2 MeV/c² bin, 233.6 / 1 624.0 = 0.144. Nobody can say whether one grain is the particle (the series' thread).
Misconception: 0.144 is not "14 % of a particle" or a property of the grain; it is the share of signal among the candidates at that mass.
Sources: record 401 via bake/d0.py (d0-fit.json row1, d0-psig.f32).
(~0.8 min)
-->

---
# lab 3 slide 8, T4's cover pose: the camera pulls back over 4 s while the ring and the centre mark fade; the whitened peak and its curve hold
space: { at: [-5, 3.2, 0], dist: 26, yaw: -4, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-6, 3.2, 0], dist: 24, yaw: -4, pitch: 4 }], [4, { at: [-5, 3.2, 0], dist: 26, yaw: -4, pitch: 5 }]] }
steps: { h: 12, fit: 6, bowl: 0, ours: 0, big: 0, s1: 0, s2: 0, tau: 0, decay: 0 }
---

<div class="nums out" style="--d1: 1.5s; --o1: 11s">
  <p><b>20 993</b><span class="name">signal</span></p>
</div>

<!-- facts: course-d0-fit-mass-worked -->

<!--
Message: a fit turns a heap into a measured peak, and gives every grain a signal share; next time a machine learns to draw the line between signal and background.
Picture: the camera pulls back to the whole peak, white where it is signal, light blue on its flanks, with its fitted curve over it; the sum of the shares in the fit range is the fitted signal count, 20 993 ± 276, which leaves at 11 s so the take's last second is the bare peak Talk 4's cover opens on.
Caveats: 20 993 counts the 1 820-1 910 MeV/c² fit range only.
Sources: record 401 via bake/d0.py (d0-fit.json params.nSig; d0-psig.f32).
(~0.5 min)
-->
