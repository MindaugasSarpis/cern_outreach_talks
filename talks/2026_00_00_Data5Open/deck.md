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
  release: videos-2026-00-00-data5open
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  plugins: [lhcb]           # the close's detector
  palette: classic
  motion: floor
  lang: en
  sound: { hum: false, flight: false, clip: false }
  options: { aberration: 0 }   # tick numbers are world sprites: no colour fringes on them
title: Open data
info: |
  Talk 5 of 5, "Data analysis, the CERN way": the series' plot is deleted and made
  again from the open file it came from. The file as a ball of grains; the plot rises
  out of it and goes to dust; how much is open; the pipeline (file, converter, table,
  fitting code, plot) run twice, the second pass landing grain for grain on the first;
  120 reasonable selections and their spread of peaks; one selection fixed before
  looking; the route back to a crossing. Pictures and numbers only; the owner narrates.
lang: en                  # slides and notes; `pnpm talk lint` reads it
htmlAttrs:
  lang: en
duration: 15min
onscreen: numbers
sources: notes
layout: cover
# T4's last frame: the file's ball turning in the black; it stands from frame 1 (pipe replay: false; ambient keyed to 0 at t = 0, not eased down from a cold open's 1; the world's canvas has no load fade, styles/index.css)
space: { at: [-25.5, 3.1, 0], dist: 11, yaw: -10, pitch: 6, dim: 0.2, ambient: [[0, 0]], steady: true, sway: 1 }
steps: { pipe: 1, h0: 0, fit0: 0, h1: 0, h2: 0, fit1: 0, s: 0, g5: 0, tb: 0, hs: 0, hp: 0, det: 0, trg: 0, heap: 0, s2: 0, crossing: 0 }   # crossing: the close's collision (started by <RouteCrossing>), off till then
---

<!-- Slide 1, cover: the ball of 91 583 grains (dk-pipeline pile stage only), the plain title. -->

# Open data

<!-- facts: record401-candidates-91583 -->

<!--
Message: the whole series came out of one open file, and this talk asks whether anyone can make the same plot from it.
Picture: the ball is the file, one grain for each of its 91 583 candidates, turning slowly as Talk 4 left it. Our grain, the row followed since Talk 1, is the larger grain on the near side.
Caveats: the ball shows the candidates, not the file's bytes. Say "candidates", never "events" (the portal's 53 948 counts events; an event can hold more than one candidate).
Sources: CERN Open Data record 401 (DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR), MasterclassData.root, its tree of 91 583 entries.
(~0.5 min)
-->

---
# same station: the plot rises out of the ball to its right, then the fit draws on (h0 fills from the ball's centre)
space: { at: [-15.5, 3.8, 0], dist: 23.5, yaw: 0, pitch: 5, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { pipe: 1, h0: 1, fit0: 1, s: 1 }
---

<!-- Slide 2: dk-hist h0 (91 583, the series' mass range, 2 MeV bins) fills out of the ball; dk-curve fit0 (the fit's last set) draws on; dk-spark rings our grain. -->

<div class="nums" style="--d1: 9.5s">
  <p><b>1 864.47</b><span class="unit">MeV/c²</span><span class="name">μ</span></p>
</div>

<!-- facts: record401-candidates-91583, course-d0-fit-mass-worked, d0-fit-chi2-ndf-worked -->

<!--
Message: the series' plot comes out of this one file: each candidate is a pair of tracks whose combined mass is one grain, the grains pile up into the short-lived particle's mass peak (Talk 2), and the fit (Talk 3) puts the peak at 1 864.47 MeV/c².
Picture: the ball is the file; the histogram rising out of it is Talk 2's mass peak, one grain a candidate in 2 MeV bins; the white curve is Talk 3's fit; the ring marks our grain in the 1 880-1 882 MeV/c² bin, where Talk 2 landed it.
Caveats: the numbers are the bake's (components/data-kit/bake/d0.py): a Gaussian plus a straight line fitted in 45 bins of 2 MeV on 1 820-1 910 MeV/c² (84 680 candidates in the fit range), μ = 1 864.47 ± 0.10 MeV/c², χ² 53.4 for 40 degrees of freedom. The axis shows 1 816-1 912 MeV/c², the series' range. Everything shown so far in the series is grains that code put into bins, taken from this one file.
Sources: CERN Open Data record 401; d0-fit.json written by the kit's bake/d0.py.
(~1.25 min)
-->

---
# same station, the camera moves in on the ball (set right of centre, clear of the numbers) while the plot goes to dust (h0's cut fails every row)
space: { at: [-28.0, 3.0, 0], dist: 9, yaw: -14, pitch: 7, dim: 0.25, ambient: 0, steady: true, sway: 1 }
steps: { pipe: 1, h0: 2, fit0: 0, s: 0 }
---

<!-- Slide 3: h0 steps to { cut: ['M', '<', 0] }: all 91 583 grains lift away as dust, the curve fades, the ball turns on unchanged. -->

<div class="nums" style="--d1: 4s; --d2: 5.2s">
  <p><b>1 289 541</b><span class="unit">B</span></p>
  <p><b>2ebf133a</b><span class="name">checksum</span></p>
</div>

<!-- facts: record401-bytes-sha256, record401-file-sha256-worked, record401-licence-cc0, lhcb-opendata-masterclass-2014, lhcb-record401-year -->

<!--
Message: the plot can be deleted because the file stays: 1 289 541 bytes under a fixed DOI, free for anyone to reuse, with a checksum that tells anyone they hold exactly the same bytes.
Picture: the dust is the deleted plot; the ball is the file, unchanged. The two numbers are the file's size in bytes and its checksum. Introduce the hash here: a checksum is a short number computed from every byte of a file, and changing one byte changes it.
Caveats: the checksum shown is Adler-32, the one the portal lists (adler32:2ebf133a); our own SHA-256 of the download is 8694a2ed… (notes only). The DOI (10.7483/OPENDATA.LHCb.E7EJ.JUWR) and the licence (CC0, a public-domain waiver) stay in the notes. The record was published in 2014, among LHCb's first open files; it states no data-taking year: say "Run 1 (2011 or 2012)".
Sources: opendata.cern.ch/record/401; the portal's file listing (size, Adler-32); the record's licence (CC0 1.0); opendata.cern.ch/docs/lhcb-masterclass.
(~1 min)
-->

---
# the clip over the pipe station; its end cuts (slide 5's one-key path) to the archive's one sphere
space: { at: [-28.0, 3.0, 0], dist: 9, yaw: -14, pitch: 7, dim: 0.2, ambient: 0, sway: 0 }
steps: { pipe: 1, h0: 0, fit0: 0, s: 0 }
---

<VideoPlayer src="cern_footage_2022_014_001_datacentre.mp4" muted />

<!-- facts: cds-3020288-datacentre-2022, opendata-portal-records-2026-worked -->

<!--
Message: open files are kept and served by data centres such as CERN's.
Picture: real racks in the CERN Data Centre, 10.7 s of the 2022 footage (0:28-0:38.7: rack fronts close up, an aisle, a row of blue status bars), no people, no burnt-in titles. The cut ends before the source's last shot (a long dark aisle from 0:38.84), so the clip leaves on the rack row, not on a shot barely seen.
Caveats: do not claim that the racks shown hold this file. The portal listed 82 414 records on 2026-10-29 (records are datasets, documentation and software, not files; the count changes, so give the date).
Sources: CERN video record 3020288 (CERN-FOOTAGE-2022-014-001, licence CERN, no on-screen credit); the portal's search API on 2026-10-29 (components/data-kit/bake/portal.py, portal.json).
(clip 10.7 s; ~0 min)
-->

---
# cut under the clip's last frame (one-key path) to the one 1 TB sphere, held close: it fills about a third of the frame's height; its number is the .nums line (the lineup's world labels are too small at 720p)
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 0.3
  path: [[0, { at: [-60, 0.12, -150], dist: 0.6, yaw: -10, pitch: 6 }]]
steps: { pipe: 1, g5: 1, tb: 1 }
---

<!-- Slide 5: dk-lineup tb step 1: the one 1 TB sphere, gathering on the cut (assemble: false) from behind it (from, reach 0.2: nothing flies through the lens). No world label: the number is the .nums line. -->

<div class="nums" style="--d1: 1.5s">
  <p><b>1</b><span class="unit">TB</span></p>
</div>

<!-- facts: record401-bytes-sha256 -->

<!--
Message: one sphere is one terabyte, the unit of the piles to come: about 775 000 copies of the file.
Picture: the sphere is 1 TB (Talk 1's unit), the only object in the frame, held close; the number beside it is the unit the next slide counts in.
Caveats: 775 000 is computed [10¹² / 1 289 541 = 775 470]. The file's ball is not drawn beside the sphere: at scale it would be about 1/92 of the sphere's radius.
Sources: opendata.cern.ch/record/401 (the file's size).
(~0.4 min)
-->

---
# cut (one-key path) to the pulled-back pose, dist 7.5 (from 9) so the 1 TB sphere reads at 720p while the grown 4 PB pile still fits the frame: the 800 TB pile gathers beside the standing 1 TB sphere from behind it, and the click grows it to 4 PB; the numbers are .nums lines
clicks: 1
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 0.3
  path: [[0, { at: [-58.4, 1.8, -150], dist: 7.5, yaw: -10, pitch: 6 }]]
steps: { pipe: 1, g5: 1, tb: 2 }
---

<!-- Slide 6: dk-lineup tb: the 1 TB sphere (standing from slide 5) and the 800 TB pile gathering beside it on the cut (step 2, Run 1); click 1: the same pile grows in place to 4 PB (step 3, grow: { from: 1 }). Each drawn sphere of the pile is 3 × the 1 TB sphere's radius (grain 27: 27 × its volume). The spheres gather from behind the piles (from, reach 0.2), never past the lens. No world labels: the numbers are the .nums lines, 800 TB on the cut and 4 PB on the click. -->

<StageSteps :set="{ tb: 2 }" :clicks="{ 1: { tb: 3 } }" />

<div class="nums" style="--d1: 2.5s; --d2: 0.4s">
  <p><b>800</b><span class="unit">TB</span><span class="name">Run 1</span></p>
  <p v-click="1"><b>4</b><span class="unit">PB</span><span class="name">Runs 1–2</span></p>
</div>

<!-- facts: lhcb-run1-full-release-2023, lhcb-ntupling-service-4pb, lhcb-open-data-policy, lhc-open-data-policy-cern, lhcb-run1-volume-sources-differ, lhcb-open-data-first-release-2022 -->

<!--
Message: the file is a tiny part of what LHCb has opened: all of Run 1, about 800 TB, by December 2023, and over 4 PB of Runs 1 and 2 through a new open-data service in 2026; LHCb publishes about half of a data-taking campaign 5 years after it ends and all of it after 10.
Picture: the small sphere at the left is the 1 TB of slide 5. The pile that gathers beside it on the cut is Run 1, 800 TB (the first number); each sphere in it is drawn three times as wide as the 1 TB sphere, so it holds 27 TB, and the pile's volume is the 800 TB's. The click: that same pile grows in place to 4 PB (the second number); its first spheres stay and the new ones gather round them, so Run 1 sits inside Runs 1 and 2: the total is about 4 PB, not 4.8.
Caveats: sources give 800 TB, 900 TB and "over 1 PB" for Run 1; use 800 TB. Never say 55 PB (no public source). The 50 % / 100 % schedule is LHCb's own; CERN's policy for the LHC experiments only aims to start releases within five years of a run. The portal-wide 5 PB figure is stale (do not use it). The first large release was 200 TB in December 2022. Say "each of these spheres is 27 TB" once, as the pile gathers: the pile keeps the volumes true, not the sphere count.
Sources: LHCb outreach (2023-12-20; 2026-03-03, the Ntupling Service); arXiv:2504.00610 (the release policy); CERN open data policy for the LHC experiments (2020); LHCb outreach (2022-12-09).
(~0.8 min)
-->

---
# cut back to the pipe station (one-key path): the ball, the converter typing in, the sheet written row by row (pipe 1 → 3 plays as a step)
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 1
  path: [[0, { at: [-21.0, 4.0, 0], dist: 19.5, yaw: -4, pitch: 4 }]]
steps: { pipe: 3, g5: 0, tb: 0, s: 2 }
---

<!-- Slide 7: dk-pipeline step 3 (file, root_to_csv.py lines 19-52, the sheet of rows 1-90); dk-spark at the sheet's first row. -->

<div class="nums" style="--d1: 1s">
  <p><b><StageCount for="pipe" :to="91583" /></b><span class="unit">rows</span></p>
</div>

<!-- facts: record401-candidates-91583, d0-row1-values-worked -->

<!--
Message: the first program turns the file into a table of 91 583 rows of four numbers each, the row of four numbers Talk 1 ended on.
Picture: grains stream from the ball into the converter, whose lines type in one grain row a real line (indent, length and word gaps from the script itself, not readable code), and on into the sheet, written row by row by a white head; each value is a dash whose brightness is its rank in its column; a missing value leaves its cell dark. The ring marks row 1, our row, at the top of the sheet. The sheet draws rows 1-90; the count says how many there are.
Caveats: the converter drawn is the kit's public bake/root_to_csv.py (52 lines, sha256 20f05681…; its code body, lines 19-52, is drawn), which rebuilds the course's CSV (sha256 25c3c972…, 3 926 142 B) from the record's own file byte for byte (made with uproot 5.7.7, awkward 2.14.0, numpy 2.5.4). The four columns are the mass, the momentum across the beam, the decay time, and the quality-cut quantity (how far the track points from the collision). Row 1: 1 880.649 MeV/c², 3 000.95 MeV/c, 0.413 ps.
Sources: CERN Open Data record 401; components/data-kit/bake/root_to_csv.py; code-lines.json (bake/code.py).
(~0.75 min)
-->

---
# same station, a short move right: both programs side by side, the converter at the left, the table, and the fitting code typing in beside it (pipe 3 → 4 plays as a step)
space: { at: [-6.6, 3.6, 0], dist: 19, yaw: 0, pitch: 4, dim: 0.2, ambient: 0, steady: true, sway: 1, flight: 2 }
steps: { pipe: 4, s: 2 }
---

<!-- Slide 8: dk-pipeline step 4: bake/d0.py lines 87-208 type in, two columns, beside the sheet; the ring stays on the sheet's row 1. -->

<div class="nums" style="--d1: 3s">
  <p><b>45</b><span class="unit">bins</span></p>
</div>

<!-- facts: course-d0-fit-mass-worked, d0-fit-chi2-ndf-worked -->

<!--
Message: a second program reads the table, sorts the masses into 45 bins of 2 MeV/c² and fits the curve; it is in the folder too, line for line.
Picture: the two programs side by side, so each is told apart by its shape: at the left the converter of slide 7, one short block (34 lines), with the edge of the file's ball behind it; then the table, the ring still on row 1; and, typing in at the right, the fitting code, two tall columns (122 lines), one grain row a real line of it (its shape, not readable code), folded into two columns as an editor's minimap does: the top of the first column reads the table, the middle bins it, the end fits. The empty space at the right is where its plot will rise.
Caveats: the code drawn is bake/d0.py lines 87-208 (from reading the rows to the Levenberg-Marquardt fit; the script has 918 lines, sha256 053d8070…). It fits a Gaussian plus a straight line in 45 bins of 2 MeV on 1 820-1 910 MeV/c² (84 680 candidates), Talk 3's fit. Its line pitch matches the converter's, so the two scripts' lengths compare truly.
Sources: components/data-kit/bake/d0.py; code-lines.json (bake/code.py).
(~0.5 min)
-->

---
# same station, the establishing shot: all four stages run and the first pass fills the plot out of the fitting code
space: { at: [-2.55, 5.0, 0], dist: 34.5, yaw: 0, pitch: 5, dim: 0.2, ambient: 0, steady: true, sway: 1, flight: 2.2 }
steps: { pipe: 5, h1: 1, h2: 0, fit1: 0, s: 0 }
---

<!-- Slide 9: dk-pipeline step 5 (the hist stage runs the chain); dk-hist h1 (light blue, the first pass) fills from d0.py's outlet. No ring here: the establishing shot keeps the file and the plot clear; the ring comes back on slide 10, where our grain's landing is the point. -->

<div class="nums" style="--d1: 2s">
  <p><b><StageCount for="h1" :to="91583" /></b><span class="unit">candidates</span></p>
</div>

<!-- facts: record401-candidates-91583, d0-row1-values-worked -->

<!--
Message: the file and two scripts put the deleted plot back.
Picture: from left to right the file, the converter (slide 7), the table, the fitting code (slide 8) and the plot it fills; white sweeps run down both scripts and a head reads the sheet as the stream passes on. The first pass is light blue, like slide 2's plot: on slides 9 and 10 the colour marks the pass, not a selection. Our grain lands again in the 1 880-1 882 MeV/c² bin (the ring shows it on slide 10).
Caveats: the fitting code drawn is bake/d0.py lines 87-208 (from reading the rows to the Levenberg-Marquardt fit; the script has 918 lines, sha256 053d8070…). The fit is deterministic (fixed start values); the seed (mulberry32, 401) only places the picture's grains. The world replays the bake's result; the real rerun is `python3 bake/d0.py --check`, which recomputes every output and fails on any difference.
Sources: components/data-kit/bake/d0.py; code-lines.json (bake/code.py).
(~0.75 min)
-->

---
# same station, the hero: the second pass runs the whole chain again and lands white, grain for grain, on the first (h2 over h1)
space: { at: [3.7, 2.0, 0], dist: 24, yaw: 0, pitch: 4, dim: 0.2, ambient: 0, steady: true, sway: 1 }
steps: { pipe: 6, h1: 2, h2: 1, fit1: 1, s: 4 }
---

<!-- Slide 10: dk-pipeline step 6 (run 2, white streams); dk-hist h2 (tone sel, over: h1) takes each first-pass grain's slot as it lands, spread evenly over 7 s (fill 7, curve 1, glowTint 0.1: no white bloom of the landing front); dk-curve fit1 draws on once h2 stands; the ring stays in the same bin. -->

<div class="nums" style="--d1: 13s; --d2: 14.2s">
  <p><b>1 864.47</b><span class="unit">MeV/c²</span><span class="name">μ</span></p>
  <p><b>d2ec0d08</b><span class="name">both passes</span></p>
</div>

<!-- facts: course-d0-fit-mass-worked, d0-fit-rerun-sha256-worked, cern-wlcg, cvmfs-grid-pinning, reana-platform, fair-wilkinson-2016 -->

<!--
Message: running the same file through the same code again gives the same grain in the same bin, the same μ and the same hash of the output.
Picture: light blue is the first pass and white the second; each light-blue grain goes as its white twin lands in its slot, so the plot turns white from the bottom of each column up and its shape never moves. The curve is Talk 3's fit, drawn on the second pass. The ring shows our grain landing where it landed before. The hash is the first 8 hex digits of the SHA-256 of the fit's output file, the same idea as slide 3's checksum.
Misconception: "it works on my laptop". Two passes on one machine agreeing is exactly that: it shows the code is deterministic here, not that anyone else gets the result. The hash on screen is the test someone else can run: their pass must print d2ec0d08, and it can only when the file, the code and the package versions are the same. The first two are in the folder; the versions are the third thing, and they have to be written down and pinned too (the pinned environment: say it here, aloud; nothing in the picture draws it, see Caveats).
Caveats: d0-fit.json (7 331 B) has sha256 d2ec0d08… on both passes (bake/d0.py runs the bake twice and refuses to write unless every output is identical; `d0.py --check` recomputes it), on one machine with Python 3.14.4, numpy 2.5.0 and scipy 1.18.0. No run in a second environment exists, so do not say that another machine gets d2ec0d08; say what it needs. The picture claims only the same file, the same code and the same hash on one machine: no versions stage is drawn, because no pinned lockfile or second-environment rerun exists to draw (notes/kit-requests.md 7). Two plots that look the same are not proof; the hash and the digits are. For the versions sentence (notes only): the Worldwide LHC Computing Grid links over 170 sites in 42 countries, each of which must run the code the same way; CVMFS is CERN's read-only software file system, served from web servers and mounted under /cvmfs (do not say it pins versions: no source opened says so); REANA is CERN's reproducible-analysis platform; the FAIR principles ask for data and software that others can reuse. The colour on slides 9-10 marks the pass, the one stated exception to the series' grammar.
Sources: components/data-kit/bake/d0.py (d0-checks.json, d0-fit.json); home.cern (WLCG); cernvm.cern.ch/fs; reanahub.io; M. D. Wilkinson et al., Sci. Data 3 (2016) 160018.
(~1.75 min)
-->

---
# cut to the selection station (one-key path): one plot that refills itself through the 120 selections on the click, from the loosest to the tightest so the count only falls
clicks: 1
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 1
  path: [[0, { at: [56.5, 0.6, 0], dist: 25, yaw: 0, pitch: 4 }]]
steps: { pipe: 1, h1: 0, h2: 0, fit1: 0, s: 0, hs: 1, hp: 0 }
---

<!-- Slide 11: dk-hist hs fills as selection 0 (the count only); click 1 brings the 120 with the sweep: { select: [0, 119], every: 0.4, rescale: true } over t5-select-falling.json (the bake's d0-select.json in order of kept count, falling: selection 0 first, 119 last), about 48 s, each refill eased over 0.8 s, holding at selection 119. -->

<StageSteps :set="{ hs: 1 }" :clicks="{ 1: { hs: 2 } }" />

<div class="nums" style="--d1: 2s; --d2: 0.4s">
  <p><b><StageCount for="hs" :to="2803" /></b><span class="unit">candidates</span></p>
  <p v-click="1"><b>120</b><span class="name">selections</span></p>
</div>

<!-- facts: d0-120-selections-worked, d0-ipchi2-cut-count-worked, d0-select-counts-worked -->

<!--
Message: there are 120 reasonable ways to choose the candidates, and each one keeps a different sample.
Picture: before the click the plot is one selection, selection 0, and only the count is on screen; the 120 comes with the click that starts the refills. Each refill is one selection, made of three limits: the momentum across the beam (above 0, 2 800, 3 000, 3 200, 3 500 or 4 000 MeV/c), the quality cut, how far the track points from the collision (no limit or four tighter ones, Talk 3's cut), and the decay time, how long the candidate lived before it decayed (above none, 0.2, 0.3 or 0.5 ps). 6 × 5 × 4 = 120. The refills run in order of how many candidates each selection keeps, the most first, so the count only falls and the grains thin, while each refill fills the height so its shape stays readable. It holds at the tightest selection.
Caveats: the sweep starts at 91 534, not 91 583: every selection needs a decay time, and 49 rows have none. Selection 119 (momentum above 4 000 MeV/c, the quality cut at 5, decay time above 0.5 ps) keeps 2 803. Every selection gets the same 45-bin fit; slide 12 shows the peaks. The fitted peaks span 0.44 MeV/c², about a fifth of one 2 MeV bin, so on this axis each refill looks like the same peak at a smaller count: do not say here that the peak moves. The world refills; the peaks come from the bake. The grid is the course's Lecture 14.
Sources: components/data-kit/bake/d0.py → d0-select.json (record 401; the cut variable is the record's IPCHI2); the sweep reads public/dk/t5-select-falling.json, the same 120 entries sorted by kept count (CLAUDE.md, Talk-owned code).
(~1.75 min)
-->

---
# cut along the same station to the peaks plot: one grain a selection's fitted peak, on its own printed scale
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 1
  path: [[0, { at: [103.7, 0.6, 0], dist: 7, yaw: 0, pitch: 4 }]]
steps: { hs: 0, hp: 1, s: 7 }
---

<!-- Slide 12: dk-hist hp of d0-peaks.f32: the 120 fitted peaks, bin 0.025 MeV/c², ticks 1 864.2 / 1 864.4 / 1 864.6; selection 0 is the large grain, ringed (dk-spark s step 7, on: hp); two dotted lines at 1 864.374 and 1 864.574 (hp step ticks, no labels) bracket its ± 0.10 stat. error. -->

<div class="nums" style="--d1: 3.5s; --d2: 4.7s">
  <p><b>0.44</b><span class="unit">MeV/c²</span><span class="name">spread</span></p>
  <p><b>0.10</b><span class="unit">MeV/c²</span><span class="name">stat. error</span></p>
</div>

<!-- facts: d0-120-selections-worked, d0-fit-valley-delta-chi2-worked, d0-pdg-gap-3p5-sigma-worked, pdg-d0-mass-2026 -->

<!--
Message: each selection gives a slightly different peak; the choice alone moves it by 0.44 MeV/c², more than four times its statistical error, so a selection picked after seeing the peak could put it almost anywhere in that range.
Picture: each grain is one selection's fitted peak, dropping in as the peaks of the sweep just seen; the ringed large grain is selection 0, the nearest to the series' own. The two dotted lines either side of it are its statistical error, ± 0.10 MeV/c², the 0.10 on screen; the grains spread across 0.44, more than twice the gap between the lines. At 0.025 MeV/c² a bin, the shift that was invisible on slide 11 is the whole picture.
Caveats: the range is 1 864.22 to 1 864.65 MeV/c² (spread 0.436). 69 of the 120 lie within ± 0.10 of selection 0's 1 864.474, 65 within the unrounded ± 0.0965 [computed: d0-select.json nearSel0]. All 120 lie below PDG's 1 864.84 ± 0.04, so Talk 3's gap (3.5 σ) is not a choice of cuts. The spread is a picture of freedom, not a systematic error: the selections overlap and change what is in the sample. The stat. error is Talk 3's Δχ² = 1 half-width (0.0965); the dotted lines are drawn at selection 0's 1 864.474 ± 0.100 as rounded on screen (selection 0's own error is 0.0964). Here the ring marks selection 0, the series' own choice (the plot's `ours`), not row 1.
Sources: d0-select.json and d0-peaks.f32 (components/data-kit/bake/d0.py, bake/peaks.py); PDG 2026.
(~1.6 min)
-->

---
# cut back to the selection plot (the slide 11 pose): the one selection is fixed over the empty axis first, and the click fills it
space:
  dim: 0.2
  ambient: 0
  steady: true
  sway: 1
  path: [[0, { at: [56.5, 0.6, 0], dist: 25, yaw: 0, pitch: 4 }]]
clicks: 1
steps: { hp: 0, hs: 3, s: 5 }
---

<!-- Slide 13: hs step 3 { select: 0, n: 0 }: the empty axis, the selection fixed and "1 selection" on screen; click 1: hs step 4 fills selection 0 once and holds; dk-spark on hs rings our grain as it lands. -->

<StageSteps :set="{ hs: 3 }" :clicks="{ 1: { hs: 4 } }" />

<div class="nums" style="--d1: 1s">
  <p><b>1</b><span class="name">selection</span></p>
</div>

<!-- facts: course-d0-fit-mass-worked, d0-120-selections-worked, d0-select-counts-worked, blind-analysis-klein-roodman-2005 -->

<!--
Message: decide the selection before looking at the result, as a blind analysis does, and the spread cannot leak into the answer.
Picture: the order is the point. First the empty axis and the number: one selection, written down before any data is in the plot. Then, on the click, the data comes, once, and holds: one selection where slide 11 had 120. It is the selection fixed before the 120 were tried (no limit beyond a known decay time, the nearest to the series' own); the ring marks our grain, kept.
Caveats: selection 0 drops the 49 rows without a decay time (91 534 kept); its μ (1 864.4745) rounds to the same 1 864.47 as the series' (1 864.4724). A real blind analysis hides the signal region or the result while the choices are made; this hold is a picture of the rule, not a blind analysis of our own. The link to Talk 4: a choice tuned on the data is like testing on the training set.
Sources: J. R. Klein and A. Roodman, Annu. Rev. Nucl. Part. Sci. 55 (2005) 141; d0-select.json (components/data-kit/bake/d0.py).
(~0.75 min)
-->

---
# the close, the series' only long flight here: a crane back down the chain, from the held plot past the fitting code, the sheet and the converter to the ball, up and over it to the heap, over the filters, to Talk 1's cover landing in bullet time
# (motion review, 29 Oct: the pipeline stands along the first leg (pipe 4) and the selection station sits at x 60, so no stretch is empty; the [16.5] key rises over the ball, never nearer it than its dist-11 hold; the [28.5] key pulls wide (dist 34) as the heap leaves and the leg to the first filter is short (3 s), so the faint stretch of lane between them lasts about a second; the landing is T1's { at: [-1.5, 1.4, 0], dist: 12, yaw: -24, pitch: 10 } offset to the route station, with T1's timing: the crossing 0.3 s before the rate ramp, the landing in it)
space:
  recorded: plate
  dim: 0.2
  ambient: 0
  sway: 0
  rate: [[0, 1], [36.6, 1], [37.2, 0.02]]
  cameraRate: 1
  path:
    - [0, { at: [56.5, 0.6, 0], dist: 25, yaw: 0, pitch: 4 }]
    - [3, { at: [56.5, 0.6, 0], dist: 25, yaw: 0, pitch: 4 }]
    - [7.5, { at: [-25.5, 3.1, 0], dist: 11, yaw: -10, pitch: 6 }]
    - [13, { at: [-25.5, 3.1, 0], dist: 11, yaw: -10, pitch: 6 }]
    - [16.5, { at: [-30, 4, -20], dist: 24, yaw: -16, pitch: 16 }]
    - [20.5, { at: [-36, 1.5, -40], dist: 16, yaw: -20, pitch: 12 }]
    - [25, { at: [-36, 1.5, -40], dist: 16, yaw: -20, pitch: 12 }]
    - [28.5, { at: [-66, 1, -40], dist: 34, yaw: -16, pitch: 10 }]
    - [31.5, { at: [-130, 0.3, -40], dist: 16, yaw: -18, pitch: 8 }]
    - [37, { at: [-161.5, 1.4, -40], dist: 12, yaw: -24, pitch: 10 }]
steps: { pipe: 4, hs: 4, s: 6, det: 1, trg: 3, heap: 2, s2: 1, crossing: 1 }
---

<!-- Slide 14: the pipeline's converter, sheet and fitting code stand along the first leg (pipe 4); dk-spark glides from our grain in hs to the ball; dk-heap settled at the lane's end with our grain on its summit (s2); dk-trigger running with both filters and the buffer on, no packet of ours; the kit detector lit; lhc-collision crosses at 36.3 s (approach 36.3) as the rate falls to 0.02 from 36.6 to 37.2, and the camera lands at 37 s. -->

<RouteCrossing name="crossing" />

<div class="nums swap" style="--d1: 8s; --o1: 13s; --d2: 37.5s">
  <p><b>91 583</b><span class="unit">candidates</span></p>
  <p><b>1</b><span class="name">crossing</span></p>
</div>

<div class="credits credit">LHCb detector geometry: LHCb's DD4hep description, © CERN for the benefit of the LHCb Collaboration, GPL-3.0; converted by HSF Phoenix, Apache-2.0.</div>

<!-- facts: record401-candidates-91583, record24506-licence, lhcb-record401-year, d0-row1-values-worked -->

<!--
Message: every grain came from a crossing, through the filters and code; the open file makes the last steps (table, code, plot) redoable, but what the filters dropped is gone (Talk 1), and this row's own crossing cannot be found.
Picture: each stop is a talk: the held plot (Talks 2, 3 and this one), the fitting code, the table and the converter (this talk), the ball (this talk; its count stands only while the ball is held), the heap on the floor with our grain on top (Talk 1's close), the second filter, the buffer and the first filter (Talks 1 and 4), the crossing in the detector (Talk 1's cover). Our grain's ring glides from the plot to the ball; from the heap on, no packet of ours runs, only the generic lane. Narration cue at the detector: "a crossing, not row 1's".
Caveats: the crossing drawn is a different real crossing (CERN Open Data record 24506, 2012, 8 TeV, CC0), not row 1's. The file's run and event numbers are zero, so row 1's own crossing cannot be found. The file's rows passed the Run 1 filters, not the Run 3 ones drawn in Talk 1: say "filters like these". The data-taking year is Run 1 (2011 or 2012). The lane runs forward while the camera travels back: the filters' dust never reassembles. Recorded as a plate (the chain and the crossing are over the live grain budget); live, it runs at a lower tier.
Sources: CERN Open Data records 401 and 24506; components/lhc-opening/event.json; the kit's LHCb geometry (GPL-3.0 / Apache-2.0).
(~2 min)
-->
