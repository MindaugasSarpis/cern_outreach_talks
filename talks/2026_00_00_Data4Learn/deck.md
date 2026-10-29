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
  release: videos-2026-00-00-data4learn
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }   # silent takes: the owner narrates over one series music bed
  options: { aberration: 0 }   # tick numbers are world sprites: no colour fringes on them
title: Machine learning
info: |
  Talk 4 of 5 of "Data analysis, the CERN way": a classifier is a fit whose answer is
  yes or no. From the hand-made cut to a neuron's line, its training as a descent down a
  loss valley, the test on unseen points, a bent boundary, the same machine on real
  candidates (overlap, leakage and its undo), rare signal and precision, and the trigger
  as the first classifier, whose kept data becomes the file Talk 5 opens on.
  Spec: notes/outline.md.
lang: en
htmlAttrs:
  lang: en
duration: 15min
onscreen: numbers
sources: notes
# T3's last frame exactly (its close pose): the whitened peak and its curve; the camera eases in a little while the title rises
layout: cover
class: dk-title
space: { at: [-5, 3.2, -14], dist: 23, yaw: 6, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-5, 3.2, -14], dist: 26, yaw: -4, pitch: 5 }], [6, { at: [-5, 3.2, -14], dist: 23, yaw: 6, pitch: 5 }]] }
steps: { h: 1, fit: 1, ev: 0, ours: 0, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

# Machine learning

<!-- facts: d0-row1-signal-share-worked, course-d0-fit-mass-worked -->

<!--
Message: last time the fit gave every candidate a signal share; today a machine learns to draw the line between signal and background by itself.
Picture: Talk 3's last frame, standing at once: the short-lived particle's mass peak, one grain a candidate, each grain whitened by its signal share from the mass fit, with the fitted curve over it as a line of flowing white grains. Our grain sits on the right flank, in the 1 880-1 882 MeV/c² bin, with a share of 0.144 (said, not shown).
Caveats: the whiteness is a property of the grain's bin, from the mass fit, and not a decision about the grain itself. The fit's 20 993 signal candidates are the sum of those shares over 1 820-1 910 MeV/c².
Sources: CERN Open Data record 401 (LHCb, DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR); d0-psig.f32 and d0-fit.json from bake/d0.py.
(~0.5 min)
-->

---
# the 1D plot tips into a 2D cloud: each grain flies to its place in two other numbers, and the camera rises with them from the cover's settled pose.
# The pose shows the same frame as slide 11 (camera at [-6.2, 7.31, 24.44]) along the same ray from 35 instead of 24.5, so it is not *at* the station: no arm, nothing hides, the tip plays at 0 s
space: { at: [-6.2, 4.87, -10.48], dist: 35, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-5, 3.2, -14], dist: 23, yaw: 6, pitch: 5 }], [2.5, { at: [-6.2, 4.87, -10.48], dist: 35, yaw: 0, pitch: 4 }]] }
steps: { h: 2, fit: 0, ev: 1, ours: 1, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3s">
  <p><b><StageCount for="ev" :to="91531" /></b><span class="unit">plotted</span></p>
</div>

<!-- facts: record401-candidates-91583, d0-ipchi2-cut-count-worked, d0-row1-values-worked -->

<!--
Message: each candidate becomes a point in two of its other numbers, how far its track points from the collision (across) and how long it lived (up); we sort by these because the mass is what we fit afterwards.
Picture: every grain of the mass plot leaves it and lands at its own place in the cloud, keeping its whiteness for a moment and then turning light blue; the mass leaves the picture. Our grain, ringed, lands far to the right, at 1 299 across and 0.41 ps up.
Caveats: both axes are logarithmic, so equal steps are equal factors; this is new to the series, so say it. The number across is the track's distance from the collision squared over its uncertainty, with no unit. 52 of the 91 583 candidates have no positive decay time (49 missing, 3 at or below zero) and are left out, which is why the count says 91 531 plotted and the file on slide 17 holds 91 583. The cloud has a flat floor at 0.15 ps, which is where the decay-time axis starts: the file holds no candidate that lived shorter (its shortest is 0.1500 ps), so they were removed before the file was written (the data's own selection), not by us.
Sources: CERN Open Data record 401 via bake/d0.py (d0-cuts.json, tauPositive 91 531).
(~0.75 min)
-->

---
# Talk 3's quality cut becomes a white edge in the cloud; the kept side turns white (slide 2's pose)
space: { at: [-6.2, 4.87, -10.48], dist: 35, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, fit: 0, ev: 2, ours: 1, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 2.5s">
  <p><b><StageCount for="evKept" :to="53194" /></b><span class="unit">kept</span></p>
</div>

<!-- facts: d0-ipchi2-cut-count-worked, d0-from-b-ipchi2, d0-masterclass-ip-cut -->

<!--
Message: a cut is a boundary someone chose: Talk 3's quality cut keeps 53 194 of the 91 531.
Picture: the vertical edge of fine white grains is the quality cut at 9, between the 1 and 100 ticks; the kept side, left of it, turns white. Our grain stays light blue far to the right of the edge.
Caveats: the cut removes particles made in the decays of longer-lived ones, whose tracks point further from the collision (Talk 3). It is this series' cut; the experiment's own masterclass cuts on the plain distance instead.
Sources: d0-cuts.json (bake/d0.py); LHCb, JHEP 03 (2016) 159 (arXiv:1510.01707) for D⁰ from b decays at large IPχ²; the LHCb D⁰-lifetime masterclass (lhcb-outreach.web.cern.ch/lhcbinternationalmasterclasses/d0-lifetime).
(~0.75 min)
-->

---
# a cut to the toy: 200 simulated points and the best threshold on one variable
space: { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 2, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3.5s">
  <p><b><StageCount for="toy" :to="177" /></b><span class="unit">of 200</span></p>
</div>

<!-- facts: perceptron-course-worked -->

<!--
Message: with one variable, the best cut gets 177 of the 200 points right.
Picture: 200 simulated points, one grain each: 100 white (class 1) around (2, 2) and 100 light blue (class 0) around (0, 0); the white edge is the best threshold on x₁, at 1.386.
Caveats: simulated; say "simulated" aloud once. These are the course's perceptron.py points (numpy default_rng(11), unit spread). The threshold is drawn at 1.386 because the stored points are rounded to 5 decimals.
Sources: CERN lessons course, figures/src/perceptron.py; train-perceptron.json (bake/train.py).
(~1 min)
-->

---
# one neuron: the cut dissolves, nothing stands while the weights are zero, then the line after one update draws on
clicks: 2
space: { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 2, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<StageSteps :set="{ toy: 2 }" :clicks="{ 1: { toy: 3 }, 2: { toy: 4 } }" />

<div class="nums" v-click="2" style="--d1: 1.4s; --d2: 1.6s; --d3: 1.8s">
  <p><b><StageCount for="w1" :to="0.259" :decimals="3" /></b><span class="name">w₁</span></p>
  <p><b><StageCount for="w2" :to="0.255" :decimals="3" /></b><span class="name">w₂</span></p>
  <p><b>0</b><span class="name">b</span></p>
</div>

<!-- facts: perceptron-course-worked, rosenblatt-perceptron-1958 -->

<!--
Message: a neuron draws a line, w₁x₁ + w₂x₂ + b = 0, and gives each point a score from 0 to 1 by how far it lies across the line, 0.5 on the line itself; training starts with every weight at zero, and one update nudges the weights so that more points land on their own side.
Picture: click 1, the threshold breaks into dust and no line stands: with all weights at zero every point scores 0.5. Click 2, the line after one update, x₁ + x₂ = 0 (w₁ 0.259, w₂ 0.255, b 0), draws on through the light-blue cloud. Training has to go on from here.
Caveats: the course's "perceptron" is a sigmoid neuron trained by gradient descent on the cross-entropy (learning rate 0.5, all weights starting at 0). Rosenblatt's perceptron is a threshold unit with a different update rule, so name his paper as the origin of the idea and date the paper, not the invention. The weights appear on screen on this slide only.
Sources: F. Rosenblatt, Psychol. Rev. 65 (1958) 386; train-perceptron.json epochs[0], epochs[1], after1 (bake/train.py).
(~1 min)
-->

---
# training: the line sweeps through 1 000 epochs on the form's own clock and settles
space: { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 5, loss: 1, ring: 0, rare: 0, trg: 0, file: 0 }   # loss 1: the valley gathers off screen, 100 units away, so slide 7 cuts to it standing
---

<div class="nums" style="--d1: 0.4s; --d2: 7s">
  <p><b><StageCount for="toy" :to="185" /></b><span class="unit">of 200</span></p>
  <p><b>177</b><span class="unit">of 200</span><span class="name">cut</span></p>
</div>

<!-- facts: perceptron-course-worked -->

<!--
Message: training moves the line until it settles, and the trained neuron gets 185 of 200 right against the hand cut's 177.
Picture: the same line, epoch after epoch: 1 000 epochs in 6 s on a log clock, so the fast early moves and the slow late ones both show; the count follows the line as drawn and lands on 185. The 177 stands for the cut it replaced.
Caveats: one epoch is one update using all 200 points. The line ends at w₁ 2.10, w₂ 2.26, b −4.31, next to the exact boundary (2, 2, −4); that is the best line possible, known only because we made the clouds ourselves (two unit Gaussians at (0, 0) and (2, 2)). Simulated.
Sources: train-perceptron.json epochs, line, bayes (bake/train.py).
(~1.25 min)
-->

---
# a cut to the loss valley over the two weights, seen low along its floor from the trained end: it stands (gathered on slide 6), then the ball rolls the logged training path from the rim down to us.
# The same frame as [196.6, -1.6, 1.4] at dist 25.5 (camera at [213.54, 7.12, 18.34]), looked at from 37.5 along the same ray, so the pose is not *at* the station: no arm, the standing surface is not hidden and regathered
space: { at: [188.63, -5.70, -6.57], dist: 37.5, yaw: 45, pitch: 20, dim: 0.25, ambient: 0, steady: true, sway: 0.5, path: [[0, { at: [188.63, -5.70, -6.57], dist: 37.5, yaw: 45, pitch: 20 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 2, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 2.6s">
  <p><b><StageCount for="loss" :to="0.162" :decimals="3" /></b><span class="name">loss</span></p>
</div>

<!-- facts: perceptron-course-loss-worked, d0-fit-valley-delta-chi2-worked -->

<!--
Message: training needs a number to make small, the loss, and over the two weights it is a valley; each training step moves the weights downhill, so training is a fit, and the ball rolls to the bottom as in Talk 3's χ² valley.
Picture: the surface stands at the cut: its height is the lowest loss each pair of weights (w₁, w₂) can reach, with b at its best there, as Talk 3's bowl did with the signal count; the two near edges carry the weights, named w₁ and w₂, with ticks 0 to 3 (one 3 at the near corner). Seen low along the valley's floor from the trained end, the walls rise left and right of the ball and behind it toward zero weights. Then the ball starts at the untrained neuron, w = (0, 0) high on the far rim, where every point scored 0.5 and the loss is ln 2 = 0.693, and rolls the same descent as slide 6: the 1 000 epochs taken as 30 legs, each leg's height the surface's loss at that epoch's weights, so the ball stays on the surface. The count follows the ball from 0.693 down to 0.162 at the bottom, (2.10, 2.26), near us.
Caveats: the loss is the average over the points of minus the log of the score given to the right answer. It has three parameters and the picture two, so b is set to its best at each point of the surface. χ² scores how far a curve misses the counts; this loss scores how far the scores miss the yes/no labels. Both are numbers to make small, so both are valleys. One line beyond the series, if wanted: both are minus a log-likelihood. No Δ = 1 ring is drawn, since this talk quotes no error on the weights. Past the bottom the valley rises only gently (0.162 to about 0.18 at weights of 3.4): larger weights make the scores more confident without moving the line much, so the valley is open toward large weights and steep toward zero. Loss heights above 0.76 (the corner of negative weights) are left out of the drawing.
Sources: train-perceptron.json lossStart, lossEnd and lossProfile with its path (bake/train.py); Talk 3's valley, d0-chi2.json (bake/d0.py).
(~1.5 min)
-->

---
# a cut back to the toy: the line trained on 150 points, then the 50 it never saw gather in; their numbers come once they have landed
clicks: 1
space: { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [98.83, 1.6, 0], dist: 6.8, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 6, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<StageSteps :set="{ toy: 6 }" :clicks="{ 1: { toy: 7 } }" />

<div class="nums" style="--d1: 3s; --d2: 2s; --d3: 2.2s">
  <p><b><StageCount for="toyTrain" :to="93.3" :decimals="1" /></b><span class="unit">%</span><span class="name">train</span></p>
  <p v-click="1"><b>92.0</b><span class="unit">%</span><span class="name">test</span></p>
  <p v-click="1"><b>± 3.8</b><span class="unit">%</span></p>
</div>

<!-- facts: perceptron-course-split-worked -->

<!--
Message: a classifier is judged on points it did not train on.
Picture: the line retrained on 150 of the points. At the click those 150 dim and the 50 held-out points gather in at full brightness, judged by a line that never saw them; 4 of them lie on the wrong side (said, not marked).
Misconception: training accuracy is the result. It is always the optimistic number.
Caveats: ± 3.8 % is the binomial spread for 50 points, √(0.92 × 0.08 / 50), the same √N wobble as Talk 2's counts; over 20 different splits the test accuracy averages 93.6 %. This line differs slightly from slide 6's, since it learned from 150 points, not 200. Simulated.
Sources: train-perceptron.json split (bake/train.py).
(~1 min)
-->

---
# a cut to the ring: one class round the other, the best straight line, the test points bright
space: { at: [298.83, 1.0, 0], dist: 8.2, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [298.83, 1.0, 0], dist: 8.2, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 1, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3.5s">
  <p><b><StageCount for="ring" :to="53.3" :decimals="1" /></b><span class="unit">%</span><span class="name">test</span></p>
</div>

<!-- facts: ml-two-class-course-worked, ml-two-class-line-test-worked -->

<!--
Message: when one class surrounds the other, no straight line separates them.
Picture: a white cloud inside a light-blue ring, all 600 simulated points, so the ring's shape reads; the best straight line cuts through both. The 120 test points are the brightest grains (the other 480 dimmed to under a third), and the line gets 53.3 % of them right, close to guessing. Both inputs are rescaled to the same spread, so the set reads round and no axes are drawn.
Caveats: simulated (the course's ml_two_class.py, seed 16; split 360 / 120 / 120). On its own training points the line gets 65.3 %, which is why the test number is the one shown.
Sources: train-ring.json line (bake/train.py).
(~0.75 min)
-->

---
# a bent boundary: the line's grains travel onto the network's 0.5 contour and close round the cloud
space: { at: [298.83, 1.0, 0], dist: 8.2, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 2, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 2.4s">
  <p><b><StageCount for="ring" :to="95" :decimals="1" /></b><span class="unit">%</span><span class="name">test</span></p>
</div>

<!-- facts: ml-two-class-course-worked -->

<!--
Message: four neurons each draw a line, a fifth combines their four scores, and that combination can close round the cloud: 95.0 % of the test points are right, against the straight line's 53.3 %.
Picture: the straight line's grains travel onto the network's boundary, the line where its score is 0.5, from its score grid, and close round the white cloud.
Caveats: a 2-4-1 network: two inputs, four hidden neurons, one output. The network is drawn only as its boundary and named only in words (no neuron diagrams). 95.0 % ± 2.0 % is 114 of the 120 test points (said if asked, not shown). Its test AUC, 0.991, stays in these notes, since AUC is not introduced. Simulated.
Sources: train-ring.json net and scoreGrid (bake/train.py).
(~1 min)
-->

---
# a cut back to the real cloud: recoloured by the mass label, the classes overlap; click 1 draws the network's bent boundary
clicks: 1
space: { at: [-6.2, 5.6, 0], dist: 24.5, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-6.2, 5.6, 0], dist: 24.5, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 3, ours: 1, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<StageSteps :set="{ ev: 3 }" :clicks="{ 1: { ev: 4 } }" />

<div class="nums" style="--d1: 4s; --d2: 1.8s">
  <p><b>53.2</b><span class="unit">%</span><span class="name">guess</span></p>
  <p v-click="1"><b>61.3</b><span class="unit">%</span><span class="name">network</span></p>
</div>

<!-- facts: d0-classifier-leakage-worked, d0-classifier-two-inputs-worked, d0-window-background-share-worked, d0-row1-network-score-worked, d0-row1-signal-share-worked -->

<!--
Message: on real candidates the labels come from the mass and the inputs from everything else; the classes overlap, and the network barely beats guessing, 61.3 % against 53.2 %.
Picture: the same cloud recoloured by its label: white for a mass inside Talk 2's window, 1 845-1 885 MeV/c², light blue outside, overlapping almost everywhere. At the click, the bent boundary of a network trained on the two inputs drawn. Our grain, ringed, keeps its light-blue core in the overlap.
Caveats: guessing means always answering the larger class (53.2 %). With the transverse momentum as a third input the network gets 62.9 %, and one neuron 60.1 %; the slide shows the two-input network's 61.3 % because its boundary is the one drawn. The label is weak by design: 49 225 candidates lie in the window, but the mass fit puts about 20 800 signal there, so about 58 % of the white rows are background, and no classifier can do much better on these labels. Our grain is labelled signal by the window; the mass fit gives it a signal share of 0.144, the three-input network a score of 0.462 and the two-input one 0.408, both under 0.5. Nobody can say whether one row is the particle. Its core stays light blue by the series' colour rule.
Sources: train-d0.json and d0-score.f32 (bake/train.py, the course's Lecture 16 recipe); CERN Open Data record 401.
(~0.75 min)
-->

---
# the leak: the camera turns exactly side on while every grain snaps to a depth equal to its mass
space: { at: [0, 6, 2.5], dist: 18.4, yaw: 90, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [-6.2, 5.6, 0], dist: 24.5, yaw: 0, pitch: 4 }], [1.3, { at: [-3, 5.8, 1], dist: 23, yaw: 45, pitch: 4 }], [2.6, { at: [0, 6, 2.5], dist: 18.4, yaw: 90, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 5, ours: 1, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3s">
  <p><b>99.9</b><span class="unit">%</span><span class="name">with mass</span></p>
</div>

<!-- facts: d0-classifier-leakage-worked -->

<!--
Message: feed the mass back in and the network just reads the label: 99.9 %.
Picture: the third axis opens into the depth and is the mass, captioned "mass MeV/c²" at its end; seen exactly from the side, the window's white band stands apart from the light-blue sidebands as vertical stripes, with 1 845 and 1 885 under its two walls.
Caveats: this is leakage, the answer fed in as an input. The depth axis still runs over 1 810-1 920 MeV/c², the kit's default for this form, not the series' 1 816-1 912 (kit request 2); no range end is labelled on screen. It must never read as success, and the next slide undoes it. The music's peak in the edit.
Sources: train-d0.json withM, 0.9989 (bake/train.py).
(~0.75 min)
-->

---
# undo: the camera turns back to the front, the mass axis closes and the boundary draws on again
space: { at: [-6.2, 5.6, 0], dist: 24.5, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [0, 6, 2.5], dist: 18.4, yaw: 90, pitch: 4 }], [1.3, { at: [-3, 5.8, 1], dist: 23, yaw: 45, pitch: 4 }], [2.6, { at: [-6.2, 5.6, 0], dist: 24.5, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 7, ours: 1, toy: 0, loss: 0, ring: 0, rare: 0, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3.5s">
  <p><b>61.3</b><span class="unit">%</span><span class="name">network</span></p>
</div>

<!-- facts: d0-classifier-two-inputs-worked -->

<!--
Message: without the leak the honest number returns.
Picture: the same cloud as slide 11: the mass axis closes, the overlap returns, and once the plane stands flat again the network's bent boundary draws on.
Caveats: 61.3 % is the two-input network of slide 11, on the 18 307 test candidates.
Sources: train-d0.json twoInputs (bake/train.py).
(~0.75 min)
-->

---
# a cut to rare signal: 100 white grains among 100 000
space: { at: [397, 5.8, 0], dist: 18, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1, path: [[0, { at: [397, 5.8, 0], dist: 18, yaw: 0, pitch: 4 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 0, rare: 1, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 3.5s">
  <p><b>99.9</b><span class="unit">%</span></p>
</div>

<!-- facts: rare-signal-accuracy-trap-worked -->

<!--
Message: when signal is rare, a classifier that never says yes is 99.9 % right.
Picture: 100 000 simulated candidates, one grain each; the 100 white ones are the signal.
Misconception: 99.9 % accuracy is good. Name the echo: this is the second 99.9 % that means nothing; slide 12's was the leak.
Caveats: simulated, with abstract inputs (so no axes); the arithmetic is the course's Lecture 16 example.
Sources: CERN lessons course, Lecture 16 (figures/src/ml.py); train-rare.json (bake/train.py).
(~0.5 min)
-->

---
# precision: the cut keeps most of the white grains, and far more light blue ones
space: { at: [397, 5.8, 0], dist: 18, yaw: 0, pitch: 4, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 0, rare: 2, trg: 0, file: 0 }
---

<div class="nums" style="--d1: 2.5s; --d2: 3s; --d3: 4s">
  <p><b><StageCount for="rareSig" :to="90" /></b><span class="name">signal</span></p>
  <p><b><StageCount for="rareBkg" :to="999" /></b><span class="name">background</span></p>
  <p><b><StageCount for="rarePrec" :to="8.3" :decimals="1" /></b><span class="unit">%</span><span class="name">precision</span></p>
</div>

<!-- facts: rare-signal-accuracy-trap-worked -->

<!--
Message: a classifier that finds 90 % of the signal (its recall) still keeps a set that is only 8.3 % signal; that share is the precision.
Picture: the grains on the kept side of the cut stay lit, 90 white and 999 light blue; everything else dims. The lit set is mostly light blue.
Caveats: 90 is the recall at work, 90 % of the 100 signal found; 999 is the false positives, 1 % of the 99 900 background let through; precision is 90 of the 1 089 kept. This classifier's accuracy is 98.99 %, lower than answering "background" every time.
Sources: train-rare.json (bake/train.py), the course's Lecture 16 arithmetic.
(~0.75 min)
-->

---
# a cut to Talk 1's data lane, framed close on the first filter's ring: everyone's crossings, no packet of ours; click 1 fires it
clicks: 1
space: { at: [30, 0, -300], dist: 12, yaw: -18, pitch: 12, dim: 0.15, ambient: 0, steady: true, sway: 0.4, path: [[0, { at: [30, 0, -300], dist: 12, yaw: -18, pitch: 12 }]] }
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 0, rare: 0, trg: 1, file: 0 }
---

<StageSteps :set="{ trg: 1 }" :clicks="{ 1: { trg: 2 } }" />

<div class="nums" v-click="1" style="--d1: 2s">
  <p><b>1</b><span class="unit">in 30</span><span class="name">kept</span></p>
</div>

<!-- facts: lhcb-hlt1-drops-96p7pct-worked, lhcb-hlt1-30mhz, lhcb-run3-hlt1-1mhz-out, ml-in-lhcb-trigger -->

<!--
Message: a trigger is a classifier that answers before anyone looks, at a rate where signal is rare, and what it drops is gone: the first filter keeps 1 crossing in 30.
Picture: Talk 1's data lane seen close and from above, one packet of grains a bunch crossing, now read as yes or no: the first filter's ring stands in the middle of the frame with the packets arriving from the left. At the click it fires: 29 of every 30 packets burst to dust at the ring, and the few that pass travel on to the right. No packet of ours here: the lane is everyone's crossings, not our row.
Caveats: the Talk 1 callback, in the notes only: about 30 MHz of non-empty crossings go in and about 1 MHz comes out. The learned selections sit in the second filter: for the current run they were designed with neural networks built to respond monotonically to their inputs, replacing decision trees (papers of 2023-24). No source after 2024 was checked for what runs now, so say "was designed with", in the past tense. The first filter drawn here carries no machine-learning claim.
Sources: LHCb Starterkit, the dataflow page; Delaney et al., EPJ Web Conf. 295 (2024) 09005 (arXiv:2312.14265).
(~0.75 min)
-->

---
# close: the second filter and the buffer come on, the kept lane folds into one ball, and the file gathers round it; the last frame is Talk 5's first
space:
  at: [118, 3.1, -300]
  dist: 11
  yaw: -10
  pitch: 6
  dim: 0.2
  ambient: 0
  steady: true
  sway: 1
  path:
    - [0, { at: [30, 0, -300], dist: 12, yaw: -18, pitch: 12 }]
    - [2.2, { at: [106, 2.8, -300], dist: 21, yaw: -9, pitch: 7 }]
    - [6, { at: [118, 3.1, -300], dist: 11, yaw: -10, pitch: 6 }]
steps: { h: 0, fit: 0, ev: 0, ours: 0, toy: 0, loss: 0, ring: 0, rare: 0, trg: 4, file: 1 }
---

<div class="nums" style="--d1: 4.5s">
  <p><b><StageCount for="file" :to="91583" /></b><span class="unit">candidates</span></p>
</div>

<!-- facts: record401-candidates-91583, lhcb-record401-year, lhcb-hlt2-keep-1-in-10-worked, higgsml-2014-dataset -->

<!--
Message: everything this talk sorted is one file of 91 583 candidates, and next time we delete the plot and make it again from that file.
Picture: the second filter (about 1 kept in 10) and the buffer come on, the kept packets fold into one turning ball, and the file gathers round it as a ball of 91 583 grains, one a candidate, while the trigger's ball fades. The camera pans along the lane onto the ball's place and ends on Talk 5's first frame.
Caveats: these candidates passed the trigger of 2011 or 2012 (the year is not settled), not the newer one drawn on slide 16, so the ball pictures "kept data becomes a file", not this file's history. For anyone who wants a clean separation to practise on, the 2014 Higgs machine-learning challenge's 818 238 events are open too (CC0).
Sources: CERN Open Data record 401 and opendata.cern.ch/docs/lhcb-masterclass; CERN Open Data record 328 (ATLAS Higgs Boson Machine Learning Challenge 2014, DOI 10.7483/OPENDATA.ATLAS.ZBP2.M5T8).
(~0.5 min)
-->
