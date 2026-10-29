# Data-kit bakes: what they compute, and every number

Scripts: `components/data-kit/bake/`. Outputs: `components/data-kit/data/`, each listed in
`data/manifest.json` with the script that writes it, the talks that load it, its shape and its meaning.
Computed 2026-10-29 with numpy 2.5.0 and scipy 1.18.0 (outreach_talks env). `h4l.py` used a throwaway venv
with uproot 5.7.7 and awkward 2.14.0. Every number below lives in the file named with it. Facts filed from
these numbers are "worked" facts that cite record 401 (or record 5500, or the course's seeded data) and this bake.

## Running

```
export PATH=~/micromamba/envs/outreach_talks/bin:$PATH
cd components/data-kit
python3 bake/d0.py        # [--cached D0_KPi.csv] [--check]          about 1 s
python3 bake/toys.py      # [--check]   reads data/d0-flat.json, so it runs after d0.py
python3 bake/train.py     # [--cached D0_KPi.csv] [--check]          about 35 s
python3 bake/portal.py    # one live GET; --cached FILE / --check re-derive without the network
<venv>/bin/python bake/h4l.py --cached DIR   # needs uproot + awkward; without --cached it fetches 18 files (1.2 MB)
<venv>/bin/python bake/root_to_csv.py MasterclassData.root D0_KPi.csv   # needs uproot; the course CSV, byte for byte
python3 bake/code.py      # [--check]   after any change to bake/d0.py or bake/root_to_csv.py
python3 bake/peaks.py     # [--check]   reads data/d0-select.json, so it runs after d0.py
python3 bake/sync.py --to talks/<talk> [--all] [--check]
```

- `--check` recomputes everything and compares it with the committed files: JSON numbers to a relative 1e-8
  (they are written to 9 significant digits), float32 arrays exactly or to 1e-6. It exits 1 on any difference
  and also checks the script's entries in `manifest.json`. All five `--check` runs pass as committed.
- With no `--cached`, `d0.py` and `train.py` read the course CSV from the course checkout next to
  outreach_talks (`CERN_lessons_on_data_analysis/lectures/workbook/docs/data/D0_KPi.csv`). They refuse a file
  whose sha256 does not start with `25c3c972` or that does not have 91 583 rows.
- Determinism comes from fixed seeds (`default_rng`: 401 for the momentum-scale toy, 1461 and 1540 for the toys,
  11, 16 and 0 as in the course). No timestamps are written. The only dates are the `retrieved` fields of the
  source blocks.
- `sync.py` takes the talk number from the directory name (`Data3Fit` or `DataLab3` gives 3) and copies the files
  the manifest lists for that talk into `public/dk/`, with a filtered `dk-manifest.json`. It copies a file only
  when its bytes differ and never deletes. The five lab decks were synced with `--all` (23 files, 3.69 MB each).
  This replaced temporary `d0-psig.f32` and `d0-select.json` files that DataLab2 had written earlier. dk-hist
  reads `selections[i].{pt, ip, tau, mu}`, which is the bake's schema.

## Source and the CSV against the ROOT file

- Record 401, "LHCb event file for real measurement", DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR, published 2014.
  `MasterclassData.root` is 1 289 541 B. It was downloaded from the portal on 2026-10-29 into the scratchpad (not
  the repo), and its sha256 is `8694a2ed518472b02994629154de3077fdff4aef1065691fa13ae9f6b23b039b`; the portal
  lists adler32 `2ebf133a`. The portal API record has **no licence field**. CC0 comes from the record page, as
  the kit lanes read it, and was not re-read here.
- Course CSV `D0_KPi.csv`: 3 926 142 B, sha256 `25c3c97299ea844f27308fde20a00ecaa87580868f3c767d7ade5621c1505136`,
  91 583 rows. **Checked with uproot:** DecayTree has 91 583 entries, and D0_MM, D0_PT, D0_TAU and D0_MINIPCHI2 equal
  the CSV's M, PT, TAU and IPCHI2 as float32 for every row (0 differences).
- Of the tree's 152 branches only those four carry non-zero values. runNumber, eventNumber and GpsTime are all
  zero, so **the data-taking year cannot be read from the file**. Gap `lhcb-record401-year` stays open.
- The API says `number_events: 53948` and "about 60k events". The file has 91 583 candidates.
- PDG values used: m(D⁰) = 1 864.84 ± 0.04 MeV/c² (PDG 2026, pdglive S032), τ = 0.4103 ps. m(K) = 493.677 MeV/c²
  and m(π) = 139.57039 MeV/c².

## d0.py: record 401

### The file (`d0.f32`, `d0.json`)
| number | value | how | file |
|---|---|---|---|
| candidates | 91 583 | CSV rows = DecayTree entries | d0.json `n` |
| TAU missing | 49 | CSV value −100, NaN in d0.f32 | d0.json `missingTau` |
| TAU ≤ 0 but not missing | 3 | | d0-cuts.json |
| TAU > 0 | 91 531 | | d0-cuts.json `tauPositive` |
| row 1 | M 1 880.649 MeV/c², PT 3 000.953 MeV/c, TAU 0.41271 ps, IPCHI2 1 299.167 | float32 values of the first row (TAU in ns × 1000) | d0.json `row1` |
| ranges | M 1 766.21 to 2 453.66 MeV/c²; TAU 0.150 to 578.8 ps | | d0.json `ranges` |

The decay times start at 0.150 ps, which looks like a pre-selection cut.

### Histograms (`d0-hist.json`)
- 2 MeV bins from 1 766 to 2 454 MeV/c² (344 bins). The full sample (91 583) is under `counts`, IPχ² < 9 under
  `countsIp9`, and ΣP(signal) per bin under `psigSum`. The tallest bin holds 3 746.
- Row 1 falls in bin 57, which is **1 880-1 882 MeV/c²**.
- The fit range 1 820-1 910 has 45 bins and holds **84 680** candidates (`fitRange.n`).

### Window means (`d0-means.json`), open windows lo < M < hi
| window (MeV/c²) | n | mean (MeV/c²) |
|---|---|---|
| all rows | 91 583 | 1 864.105 |
| 1 840-1 890 | 56 577 | 1 864.712 |
| 1 850-1 880 | 41 090 | 1 864.790 |
| 1 855-1 875 | 31 132 | 1 864.808 |

The ±sd/√n values in the file ignore the pull of the background on the mean.

### The fit (`d0-fit.json`)
- **Model:** a Gaussian plus a straight line, fitted by binned χ² in 45 bins of 2 MeV on 1 820-1 910 MeV/c². The
  counts per bin are n_sig·2/(width·√2π)·exp(−(m−μ)²/2width²) + a + b(m − 1865). The errors are √max(n, 1). This is
  the course's fit (Lecture 10/14).
- **Start values by eye:** the tallest bin is centred at 1 863.0. The background level is 1 392.9, the mean of the
  5 outer bins on each side. The height above it is 2 353.1. The FWHM read off the histogram by linear
  interpolation is **16.86 MeV**, so the start width is FWHM/2.355 = **7.16** and the start n_sig is 21 122.
- **Minimiser:** Levenberg-Marquardt with Marquardt scaling, λ starting at 1e-3. Every accepted step is logged in
  `iterations`, and dk-curve morphs through these sets. The χ² goes 371.5 (start) → 56.6 → 53.364 → 53.363 and
  then three more steps under 1e-4. **So the picture has two visible legs**: (1 863.00, 7.16) → (1 864.32, 7.66)
  → (1 864.47, 7.64). The minimum agrees with scipy `curve_fit` from the course's own start values to 1e-6.
- **Result:**
  - μ = **1 864.4724 ± 0.0965** MeV/c²
  - width = **7.6450 ± 0.0990** MeV/c²
  - n_sig = 20 993 ± 276
  - a = 1 414.09 ± 7.65 a bin, b = −1.508 ± 0.222 a bin per MeV
  - χ² = **53.36 / 40** (χ²/ndf 1.334, p = 0.077)
  - peak height 2 190.9 a bin
  - the pulls per bin are in `bins45.pull`
- **Window stability** (the same 45-bin fit with the range moved):
  - 1 816-1 906 gives μ 1 864.4465, a shift of −0.026
  - 1 824-1 914 gives 1 864.4953, a shift of +0.023
  - widening both ends by 4 MeV gives +0.004; narrowing both by 4 MeV gives −0.008 (`stability`)
- **The PDG gap** is 1 864.84 − μ = **0.3676 MeV/c²**:
  - unrounded, 0.3676 / √(0.0965² + 0.04²) = **3.52 σ**
  - rounded, 0.37 / √(0.10² + 0.04²) = **3.44 σ**
  - with the course's ±0.05: 3.38 σ unrounded and **3.31 σ** rounded
  - statistical error alone: 3.81 σ (`gap`)
- **Mass scale:** multiplying every mass by k = 1 864.84 / μ = 1.000197, a shift of **+0.0197 %**, closes the gap.
  The refit of M·k gives 1 864.854 ± 0.096 (`scale`).
- **Momentum scale.** When all track momenta scale by (1+ε) and the energies are recomputed with the K and π
  masses, the mass moves by d(M²)/dε / 2M² = [pK²Eπ/EK + pπ²EK/Eπ − 2 pK·pπ]/M² times ε. This depends on how
  the energy is shared between the two tracks:
  - D⁰ at rest: **0.856**
  - at most (M² − (mK + mπ)²)/M² = **0.885** in any frame
  - averaged over isotropic decays boosted with the window candidates' PT and η uniform in 2-5 (20 000 samples,
    seed 401, angles simulated): **0.767 ± 0.168**, confirmed by finite differences
  - So the momentum-scale shift that closes the gap is 0.0197 / 0.767 = **0.026 %**, or 0.022 % at the largest
    factor. The (M² − mK² − mπ²)/M² = 0.924 formula treats the energies as scaling with the momenta, which is
    wrong for massive daughters.
- **Row 1:**
  - it lies 16.18 MeV/c² above μ, which is **2.12 widths**
  - S(m) = 233.56 and B(m) = 1 390.48 a bin, so **P(signal) = 0.1438**
  - IPχ² 1 299 ≥ 9, so the IPχ² cut removes it (`row1`)

### χ² landscape (`d0-chi2.json`, for dk-landscape)
- A grid of 121 × 121 nodes over μ 1 862.90-1 865.27 and width 6.845-8.445 MeV/c². It is stretched so that the
  start of the path (1 863.0, 7.16) lies inside it. At each node χ² is minimised over n_sig and the line, which
  enter linearly. The file stores z = χ² − χ²min (0 to 337).
- `path` holds the six logged iterates as [μ, width, profile Δχ², the iterate's own Δχ²]. The ball rides the
  profile surface.
- Closed Δχ² = 1 and Δχ² = 4 rings, 180 points each.
- The 1D slice in μ, with the width profiled as well, crosses Δχ² = 1 at **1 864.376 and 1 864.569**, a
  half-width of **0.0965** that equals the fit error. The same slice in the width gives a half-width of 0.104.
- On this grid the Δχ² = 1 ring spans about 1/12 of the μ axis. If the bowl needs a bigger ring, the bake can
  write a tighter grid, but then the start of the path falls outside it.

### P(signal) per candidate (`d0-psig.f32`)
P(signal) = S/(S+B) from the fit above, in file order, one float32 per candidate. Outside 1 820-1 910 the fitted
line is extrapolated, and S is below 1e-7 there.

### File-order significance (`d0-z.f32`, `d0-significance.json`)
- Candidates are taken in file order. N_on counts 1 850 < M < 1 880. N_off counts 1 820 < M < 1 840 and 1 890 < M < 1 910.
  The background is b = ¾·N_off and z = (N_on − b)/√b.
- z first passes 5 at **candidate 27** (14 on, 5 off, z 5.29). It stays above 5 **from candidate 186** (79 on, 60
  off, z 5.07).
- At the end, z = 137.8 (41 090 on, 28 103 off).
- Further points: candidate 100 gives z 4.72, 1 000 gives 13.6, and 10 000 gives 51.4.

### The 14 flat bins (`d0-flat.json`)
- Fourteen 2 MeV bins on 1 816-1 844 MeV/c² hold 1 433 to 1 534 each, with a mean of **1 460.8**, so √ = **38.2**.
- Three spread estimates:
  - raw sd **33.9**
  - sd about a fitted line **31.4** (the bins rise by 3.70 a bin)
  - neighbour differences / √2 **39.1**
- A 14-bin spread is itself uncertain by 1/√26 = **19.6 %**.

### Cuts (`d0-cuts.json`)
- IPχ² < 9 keeps **53 194** of 91 583. It also keeps 53 194 of the 91 531 with TAU > 0, because none of the 49
  TAU-missing rows has IPχ² < 9.

### Decay time and the lifetime (`d0-tau.json`)
- **Histograms.** The window and sidebands are those of T2, and α = 0.75. The file has 0.25 ps bins (20 on 0-5 ps)
  and 0.1 ps bins (50), each with all TAU > 0 and with IPχ² < 9. For each it stores `on`, `off`, `net` = on − 0.75·off
  and `err`.
  - Counts with TAU > 0: on 41 069, off 28 087.
  - Counts with IPχ² < 9: on 27 763, off 13 915.
  - The first 0.25 ps bin is low (net 3 472 against 6 196 in the next bin). This is the acceptance turn-on above
    the 0.150 ps start.
- **Fit model.**
  - A truncated exponential exp(−t/τ)/(τ(e^{−t0/τ} − e^{−t1/τ})) on t0 ≤ t < t1, with t0 = 0.5 ps and t1 = 5 ps,
    and IPχ² < 9.
  - It is fitted as an unbinned weighted likelihood: w = +1 for window candidates and −0.75 for sideband
    candidates. This is sideband subtraction done candidate by candidate.
  - The error uses the sandwich formula Σw²s²/H².
- **Acceptance.** It is not modelled. The fit starts at t0 = 0.5 ps, above the turn-on. The truncated exponential
  is memoryless, so starting later does not bias τ.
- **Result:** **τ = 0.4211 ± 0.0053 ps (stat)**, from 8 129 window and 636 sideband candidates (net 7 652). The
  binned χ² cross-check on the 0.1 ps net histogram gives 0.4165 ± 0.0051 (χ² 47.9/39).
- **Stability:**
  - t0 from 0.25 to 1.0 ps gives 0.416-0.427
  - an IPχ² cut from 2 to 25 gives 0.420-0.426
  - t1 = 2.5, 3.5 and 10 ps give 0.4195, 0.4194 and 0.4233
- **Without the IPχ² cut:** 0.482 (t0 0.25) rising to 0.571 (t0 1.0), with 0.509 at t0 = 0.5. This is D⁰s from
  B decays faking a long life.
- **Honest statement:** τ = 0.421 ± 0.005 (stat) ps against PDG 0.4103, which is 2 statistical errors high. The
  likely cause is the D⁰-from-B remnant that passes IPχ² < 9. This is a teaching fit, not LHCb's measurement. The
  cut-dependence scans are the size of the systematic.
- cτ(PDG) = 299 792 458 m/s × 0.4103 ps = **123.0 µm** (arithmetic).

### The 120 selections (`d0-select.json`)
- The course's Lecture 14: keep PT > {0, 2 800, 3 000, 3 200, 3 500, 4 000} MeV/c, IPχ² < {none, 50, 20, 10, 5},
  TAU > {none, 0.2, 0.3, 0.5} ps, and always drop TAU missing. Index i = 20·iPT + 4·iIP + iTAU.
- Each selection gets the course fit, and the file keeps pt, ip, tau, n, μ, μ error, width, χ² and zPdg.
- These are cut parameters on d0.f32's columns, so a builder can apply them. The same keep masks from the float32
  columns in ps were checked equal to the CSV masks in ns for all 120.
- **Range:** from **1 864.215 ± 0.107** (i 80: PT > 3 500 only, 27 527 candidates) to **1 864.651 ± 0.151**
  (i 107: PT > 4 000, IPχ² < 50, TAU > 0.5 ps, 4 295 candidates). The spread is **0.436**.
- Against PDG ± 0.04 that is 5.46 σ to 1.21 σ. The course's 5.3 σ used ± 0.05.
- No cuts (TAU-missing rows dropped, 91 534): 1 864.4745 ± 0.0964.

## toys.py: simulated (`toys.json`)
- **Flat re-rolls.** There are 24 Poisson re-rolls of 14 bins at the real flat level of 1 460.8 (seed 1461). Their
  spread is 38.0, against √1 460.8 = 38.2. √N/N is 10 % for 100, 1 % for 10 000 and 2.6 % for 1 461.
- **Falling spectrum** (seed 1540):
  - Density ∝ exp(−3.2 (m − 1.45)/0.30) on 1.45-1.75 GeV, in 30 bins of 10 MeV, with 140 entries a roll and 20
    rolls.
  - An alarm is a bin whose one-sided Poisson significance against its expected count is z ≥ 2.
  - It fires in **7 of 20** rolls, in bins 26, 8, 18, 27, 15, 0 and 14, so it wanders.
  - The strongest is roll 2, bin **1.53-1.54 GeV**, with **z = 2.55** at 140 entries. Grown to 3 500 entries
    (its 140 plus 3 360 more), the same bin has **z = 1.13**, and the largest anywhere is 2.04.
  - The file stores every entry value, so the builder draws exactly these grains.
- **Normal tail:**
  - beyond 1 σ, 0.1587
  - beyond 3 σ, **1.350 × 10⁻³**, which is **405.0** of 300 000 grains
  - beyond 5 σ, **2.867 × 10⁻⁷**, which is **0.086** of 300 000 grains, and **1 in 3 488 556**
- **Look-elsewhere:** 1 − 0.95²⁰ = **0.6415**. For comparison, a two-sided 2 σ gives 0.606 and a one-sided 2 σ
  gives 0.369.

## train.py: classifiers
### Course perceptron (`train-perceptron.json`, simulated, rng 11)
- **Data:** the 200 points are regenerated exactly as `figures/src/perceptron.py` `_data()` makes them.
- **Threshold and line:**
  - the best threshold x1 > 1.386 gets **177/200**
  - the sigmoid neuron after 1 000 epochs (η 0.5) gets **185/200** (92.5 %)
- **Weights:**
  - after 1 update w = (**0.259, 0.255**), b = 0, loss 0.510
  - final w = (**2.100, 2.257**), b = **−4.315**
  - the Bayes line is (2, 2, −4)
- **Loss:** **0.693 → 0.162**. All 1 001 epochs are logged as [loss, acc, w1, w2, b].
- **Loss grid:** 101 × 101 over w1, w2 ∈ [−0.5, 3.5] at the final b, with the per-epoch path.
- **Split:**
  - 150/50 (perm rng 11): train **93.3 %**, test **92.0 %** ± 3.8 % (binomial √(p(1−p)/50))
  - 20 split seeds: mean 93.6 % ± 3.5 %

### Ring set (`train-ring.json`, simulated, seed 16)
- **Data:** regenerated from `ml_two_class.py`. The CSV text matches the course file **byte for byte** (sha256
  cc54cbfe…).
- **Split:** seed 0, 360 / 120 / 120.
- **Line:** **65.3 %** on the train rows.
- **2-4-1 network** (η 1, 5 000 steps, seed 0):
  - train 95.6 %, validation 91.7 %
  - test **0.950 (114/120)**, ± 0.020
  - test AUC **0.9908**
- **Score grid:** 121 × 121 over x1 1-9 and x2 −10-70.

### Record 401 classifier (`train-d0.json`, `d0-score.f32`, `d0-split.f32`)
- **Recipe:** ml.py `leakage` (Lecture 16).
- **Rows and label:** 91 531 rows with TAU > 0. The label is 1845 < M < 1885 (49 225 of 91 531). The split is
  rng 0, giving **73 224 train / 18 307 test**.
- **Inputs:** log PT, **log TAU** (the course uses the log of the decay time, not the decay time) and log IPχ².
- **Results:**
  - majority **0.5318**
  - neuron **0.6010**
  - 2-4-1 network **0.6291**, AUC 0.674
  - with M added, network **0.9989** (neuron 0.6026), AUC 1.0000
- **Two inputs only** (log IPχ², log TAU), the two the picture shows: network 0.6132.
- **Score grids:** 141 × 99 over log10 IPχ² −3 to 4 and TAU 0.1-5 ps. There is one grid for the three-input
  network at the median log PT of the train rows, and one for the two-input network.
- `d0-score.f32` holds the honest network's score per candidate. `d0-split.f32` holds 0 for train, 1 for test and
  −1 for not used.

### Rare signal (`train-rare.json`)
100 signal in 100 000, recall 0.90, 1 % false positives:
- TP 90, FP 999
- precision **8.26 %**
- accuracy 98.99 %
- "always background" **99.9 %**

## portal.py (`portal.json`)
- One GET of `https://opendata.cern.ch/api/records/?size=1` at 2026-10-29 00:39 EET, User-Agent
  `outreach-talks-data-kit/1.0`.
- **82 414 records.**
- By experiment: CMS 57 889, DELPHI 12 757, LHCb 9 348, OPERA 912, ATLAS 189, ALICE 171, JADE 147, TOTEM 3,
  PHENIX 1.
- By type: Dataset 66 071, Documentation 9 272, Supplementaries 5 904, Glossary 1 006, Environment 64, Software
  55, News 32.
- By availability: online 52 007, partial 20 105, requested 18.
- The file keeps the API's facet buckets.

## h4l.py: CMS record 5500 (`h4l.json`)
- **Source:** record 5500, DOI 10.7483/OPENDATA.CMS.JKB8.RR42. The licence field reads **GPL-3.0-only**. The
  files come from the GitHub repository at commit c05c526a. The 18 rootfiles (1.2 MB) were downloaded to the
  scratchpad, and only the derived JSON is in the repo.
- **Method:** combined exactly as `Level2/M4Lnormdatall.cc` does (lumi 2 330 and 11 580 pb⁻¹, its cross
  sections, scale factors and event counts), in 37 bins of 3 GeV on 70-181 GeV.
- **Counts:** data 2011 **20**, 2012 **82**. Expected background 83.99 and Higgs (125 GeV) 9.73.
- **Its own significance:**
  - binned Poisson likelihood ratio, b + μs against b, background fixed: **3.27 σ** (μ̂ 0.92)
  - counting in 121-130 GeV: **12 observed against 4.66 expected, 2.73 σ**
  - The record's own text says "about 2 standard deviations in this example". The bake's numbers include no
    background uncertainty, which is why they are higher. On screen, prefer the record's "about 2 σ" with its
    source, or the count 12 against 4.7. Do not put 3.3 σ on the slide unlabelled.

## Bible numbers, recomputed

Status: **matches**, or the corrected value.

| bible number | status | baked value | file |
|---|---|---|---|
| CSV 3 926 142 B, 91 583 rows, sha256 25c3c972…c1505136 | matches | same | d0.json |
| ROOT 1 289 541 B, sha256 8694a2ed…3b039b | matches (downloaded) | same | d0.json source |
| 49 rows TAU = −100 | matches | 49 | d0.json |
| row 1: 1 880.649, 3 000.95, 0.4127 ps, 1 299.17 | matches | 1 880.649, 3 000.953, 0.41271, 1 299.167 | d0.json |
| row 1 in the 1 880-1 882 MeV bin | matches | bin 57 = 1 880-1 882 | d0-hist.json |
| 16.2 MeV/c² (2.1 widths) above the centre | matches | 16.18, 2.12 | d0-fit.json row1 |
| P(signal) = 233.5/(233.5 + 1 390.5) = 0.144 [computed] | matches; S is 233.56, so "233.6" when rounded | 0.1438 | d0-fit.json, d0-psig.f32 |
| IPχ² < 9 removes row 1 | matches | 1 299 | d0-cuts.json |
| 14 flat bins, mean 1 461, √ 38 | matches | 1 460.8, 38.2 | d0-flat.json |
| raw 33.9, de-trended 31.4, slope 3.7 a bin, neighbour 39.1, ±19 % [computed] | matches | 33.88, 31.37, 3.70, 39.12, 19.6 % | d0-flat.json |
| beyond 3 σ 1.35 × 10⁻³, about 405 of 300 000 | matches | 1.350e-3, 405.0 | toys.json |
| beyond 5 σ 2.87 × 10⁻⁷, 0.09 grains, 1 in 3 500 000 [computed] | matches | 2.867e-7, 0.086, 3 488 556 | toys.json |
| 1 − 0.95²⁰ = 64 % [computed] | matches | 64.15 % | toys.json |
| z first passes 5 at candidate 27 (14 on, 5 off) [computed] | matches | 27 (14, 5), z 5.29 | d0-significance.json |
| stays above 5 from candidate 186 [computed] | matches | 186 (79, 60), z 5.07 | d0-significance.json |
| open 4ℓ sample alone about 2 σ | record's text says about 2; this bake gives 2.73 (count) / 3.27 (shape), with no background uncertainty | see h4l | h4l.json |
| window means 1 864.10, 1 864.71, 1 864.79, 1 864.81 | matches | 1 864.105, 1 864.712, 1 864.790, 1 864.808 | d0-means.json |
| FWHM 17 MeV gives width about 7.2 | matches | 16.86 → 7.16 | d0-fit.json start |
| μ = 1 864.47 ± 0.10, width 7.65 ± 0.10, χ² 53.4/40, 45 bins | matches | 1 864.4724 ± 0.0965, 7.6450 ± 0.0990, 53.36/40 | d0-fit.json |
| 84 680 candidates in range [computed] | matches | 84 680 | d0-fit.json, d0-hist.json |
| moving the window by 4 MeV moves μ by 0.03 | matches in size: −0.026 / +0.023 | | d0-fit.json stability |
| Δχ² = 1 gives ± 0.10 | matches | half-width 0.0965 | d0-chi2.json slice |
| gap 0.37 MeV/c² | matches | 0.3676 | d0-fit.json gap |
| 3.5 σ = 0.368/√(0.096² + 0.04²) = 3.54 [computed] | 3.5 matches; fully unrounded it is **3.52** (3.54 used 0.368 and 0.096 rounded) | 3.520 | d0-fit.json gap |
| rounded 0.37/√(0.10² + 0.04²) = 3.4 | matches | 3.435 | d0-fit.json gap |
| course's ± 0.05 gives 3.3 | matches (rounded inputs) | 3.309 (3.383 unrounded) | d0-fit.json gap |
| masses up by 0.02 % close the gap | matches | +0.0197 % (refit 1 864.854) | d0-fit.json scale |
| mass moves by 0.92 of the momentum scale [computed] | **corrected: 0.77** on average (isotropic decays, simulated angles), at most 0.885, 0.856 at rest. 0.924 assumes E ∝ p | 0.767 ± 0.168 | d0-fit.json scale |
| momentum scale about 0.02 % higher | **corrected: about 0.026 %** (0.022 % at the largest factor). "About 0.02-0.03 %" | 0.0257 % | d0-fit.json scale |
| cτ = 123 µm from 0.4103 ps [computed] | matches (arithmetic) | 123.0 µm | (notes) |
| IPχ² < 9: 53 194 of 91 583 pass [computed] | matches | 53 194 | d0-cuts.json |
| T4: 91 531 with TAU > 0, IPχ² < 9 keeps 53 194 | matches | 91 531; 53 194 | d0-cuts.json |
| lane checks 0.475 / 0.65 ps without the cut, about 0.42 with it | with the cut matches: committed fit **0.421 ± 0.005 ps**; without the cut 0.48-0.57 depending on t0 | 0.4211 | d0-tau.json |
| 120 selections, peak 1 864.22 to 1 864.65 | matches | 1 864.215 to 1 864.651 | d0-select.json |
| 177/200 threshold, 185/200 line | matches | 177, 185 | train-perceptron.json |
| (0.259, 0.255, 0) after one update | matches | (0.2590, 0.2552, 0) | train-perceptron.json |
| (2.10, 2.26, −4.31) | matches | (2.100, 2.257, −4.315) | train-perceptron.json |
| loss 0.693 → 0.162 | matches | 0.6931 → 0.1616 | train-perceptron.json |
| train 93.3 %, test 92.0 % ± 3.8 % | matches | 93.33 %, 92.0 % ± 3.84 % | train-perceptron.json |
| ring: a line gets 65 % | matches | 65.3 % (train rows) | train-ring.json |
| 2-4-1 test 0.95, AUC 0.991 | matches | 0.950, 0.9908 | train-ring.json |
| 73 224 train / 18 307 test | matches | same | train-d0.json |
| majority 0.532, neuron 0.601, network 0.629 | matches | 0.5318, 0.6010, 0.6291 | train-d0.json |
| adding the mass gives 0.999 | matches | 0.9989 | train-d0.json |
| inputs "log pT, decay time, log IPχ²" | **corrected: log TAU** (the course's recipe), not the decay time | | train-d0.json |
| rare signal: precision 8.3 %, always background 99.9 %, 90 white and 999 blue [computed] | matches | 8.26 %, 99.9 %, 90/999 | train-rare.json |
| portal 82 414 records on 2026-10-29 | matches | 82 414 | portal.json |
| record 401 CC0 | not in the API; the record page (not re-read here) | | d0.json source |
| lumi 2 330 and 11 580 pb⁻¹ (M4Lnormdatall.cc) | matches values | same | h4l.json |

Arithmetic-only bible numbers (T1). These are not bake outputs; they were recomputed here and all match:
- 30 PB / 4 TB/s = 7 500 s = 2.08 h
- 2 500 × 11 245 = 28.11 MHz
- 4 TB/s × 86 400 s = 345.6 PB
- 1.3 EB / 345.6 PB = 3.76 days
- 1 − 1/30 = 96.67 %
- 10 GB/s × 86 400 s = 864 TB

## Second round (lane kit-bake, 29 Oct 2026)

What the five outlines' open items asked of the bakes. Every number below is written by the
script named and checked by its `--check` (all seven pass: d0 14 files, toys 3, train 6, code 1,
peaks 1, portal 1; h4l was not touched). Made with Python 3.14.4, numpy 2.5.0, scipy 1.18.0
(outreach_talks env); the converter with uproot 5.7.7, awkward 2.14.0, numpy 2.5.4 (a venv).
`d0-fit.json` was deliberately left byte for byte as it was (sha256 d2ec0d08…, cited by T5):
the new d0 numbers live in other files, and the new d0.py code sits below `lm()`, so the
d0.py lines 87-208 that T5's code stage draws are unchanged (checked against the old
`code-lines.json` runs).

### toys.py
| number | value | file, key |
|---|---|---|
| the grown falling spectrum as rows | 3 500 float32 values (GeV): roll 2's 140, then the 3 360 added, each sorted | `falling-big.f32` (+ header `falling-big.json`) |
| binned as dk-hist bins them (`Math.floor((v − 1.45) / 0.01)`) | equal to the bake's roll-2 counts and `bigRoll.counts` (bin 8 = 1.53-1.54: 14 at 140, 172 at 3 500) | `falling-big.json` `counts140`, `counts3500`, `matchesBake` |
| expectation at 140 entries, dk-curve `exp` set | a 15.568 a bin at 1.45 GeV, slope −10.667 /GeV, pivot 1.45, bin 0.01 | `toys.json` `falling.curve.sets[0]` |
| expectation at 3 500 entries | a 389.198, same slope | `toys.json` `falling.curve.sets[1]` |
| curve at the bin centres against the bin integrals | within 0.047 % (sinh(u)/u − 1, u = 0.0533) | `toys.json` `falling.curve.check` |

Lab 2 slides 21-22 (another lane's test slides) already draw both: the set-0 curve runs along
roll 2's falling columns with bin 8 white over it, and the 3 500 rows fill in file order.

### d0.py
| number | value | file, key |
|---|---|---|
| mean, window centred on 1 864.47, ± 25 | **1 864.376** (56 589) | `d0-means.json` `centredOnFit.windows[0]` |
| ± 15 | **1 864.462** (41 108) | `[1]` |
| ± 10 (1 854.47-1 874.47) | **1 864.424** (31 182) | `[2]` |
| ± 5 | **1 864.437** (17 545) | `[3]` |
| 1 860-1 870 (centred on 1 865) | **1 864.920** (17 496) | `d0-means.json` `narrow1865` |
| closed windows (as dk-hist `{window}`) | the same n and means | `nClosed`, `meanClosed` |
| Δχ² on the profiled slice at 1 864.80 / 1 864.84 / 1 864.88 | **11.499 / 14.472 / 17.784** (3.39 / 3.80 / 4.22 errors) | `d0-chi2.json` `pdgOnSlice.dchi2`, `nErrors` |
| the same read linearly off the slice grid | 11.500 / 14.473 / 17.786 | `pdgOnSlice.interp` |
| the plot's subtraction, first 2 000 in lab 3's seeded order | **1 172 window, 828 sidebands**; 588 sideband grains picked, **576 pairs**, **596 left** (the count readout; 569 of them stand in the 0-5 ps columns) | `d0-tau.json` `plotSubtract.first2000` |
| the same as a statistical subtraction | 1 172 − 0.75 × 828 = 551 | `plotSubtract.first2000.leftCounted` |
| the subtraction on all 69 159 plotted grains | 41 071 window, 28 088 sidebands, 20 075 pairs, **20 996 left** (20 024 standing) | `plotSubtract.all` |
| the 5 σ line | b = 0.75 × 28 103 = 21 077.25, b + 5√b = 21 803.15, **1 453.54 a 2 MeV bin** over 1 850-1 880 (the window holds 2 739.3 a bin) | `d0-significance.json` `line5sigma` (`set` = `{a: 1453.54, bin: 2}`) |
| χ² at the fit's start values | **371.52** (dk-curve's readout formula gives the same) | `d0-checks.json` `fitStart.chi2`, `curveReadout`; also `d0-fit.json` `iterations[0].chi2` |
| selection 0 (no cuts, TAU known) | **91 534** | `d0-select.json` `counts.0` |
| selection 119 (PT > 4 000, IPχ² < 5, TAU > 0.5 ps) | **2 803** | `counts.119` |
| peaks within ± 0.10 of selection 0's 1 864.4745 | **69** of 120 (selection 0 counted) | `nearSel0.within.0.10` |
| within ± 0.0965 | **65** of 120 (also 65 within selection 0's own 0.0964) | `nearSel0.within.0.0965`, `.muErr0` |
| d0-fit.json sha256, two passes | **d2ec0d089945513b30b4358d4e7dcc872c714fa238952173955037609c268abf** both times | `d0-checks.json` `rerun.sha256` |

How the subtraction is computed: `plot_subtract` ports hist.js (setupGrains, layout with
`split` and `subtract`) and rng.js (mulberry32, `order`), the latter in `common.py`
(`mulberry32`, `series_order`), checked against rng.js under node: the same first draws of
mulberry32(12 438) and the same 91 583 ranks (sha256 of the rank array 28cee540… both
ways). Lab 3's `{subtract}` slide counts down to 596 (`:to="596"` in its deck): the port
reproduces it. The plot config is lab 3's `tau` object (grains 70 000, unit 1, 69 159 grains);
another seed, `grains` or window changes the numbers.

How the rerun works: `d0.py` calls `bake()` twice from scratch (the CSV read again, every
fit redone) and refuses to write unless every output is byte-identical; `d0.py --check`, run
later as its own process, recomputes and compares. It ran once more from the CSV the new
converter wrote (`--check --cached`): 14 files match. No run in a second environment with
other numpy/scipy versions exists (the uproot venv has no scipy).

### train.py
| number | value | file, key |
|---|---|---|
| lossProfile grid | 101 × 101 over w1, w2 ∈ [−0.6, 3.4] (step 0.04, so (0, 0) is a node), b profiled by Newton (gradient < 1e-10 at every node) | `train-perceptron.json` `lossProfile.z` |
| start | w = (0, 0): **0.693147** = ln 2, best b 0 | `lossProfile.start` |
| end (epoch 1 000) | profiled **0.161610** at (2.0999, 2.2566), best b −4.3225 against the trained −4.3146; logged loss 0.161612 | `lossProfile.end` |
| grid minimum | 0.161596 at (2.12, 2.28) | `lossProfile.gridMin` |
| path | 1 001 × [w1, w2, profiled loss, best b]; every profiled value ≤ the logged loss; epoch 1: 0.4775 (logged 0.5099) | `lossProfile.path` |
| what dk-landscape's bilinear readout gives | 0.69315 at the start, **0.16163** at the end, so it reads 0.162 | `lossProfile.readout` |
| epoch 1 | **150 of 200** right (accuracy 0.75), loss **0.510** (0.50985), w (0.2590, 0.2552), b 0; before it 100 of 200, ln 2 | `train-perceptron.json` `after1` |
| the ring's line | train **65.3 %** (235 / 360), test **53.3 %** (64 / 120) | `train-ring.json` `line.trainAccuracy`, `trainRight`, `testAccuracy`, `testRight` |
| row 1's three-input network score | **0.4624** (the honest 2-4-1 network on log PT, log TAU, log IPχ², `withoutM`; = d0-score.f32[0]); two-input network 0.4080; label 1; a train row | `train-d0.json` `row1.score3`, `score2`, `label`, `role` |
| the window's background share | 49 225 rows in 1 845 < M < 1 885 (of 91 531); the mass fit puts 20 802.7 signal and 28 281.7 background in it (sum 49 084), so **57.7 %** is background; with the whole fitted signal (20 992.8) instead, at least 28 232 (57.4 %) | `train-d0.json` `windowShare` |

Lab 3 slide 11 (another lane's test, `readout: 'path'`) shows the profiled bowl and reads
0.162 at the end of the roll.

### root_to_csv.py and code.py
- `bake/root_to_csv.py` (52 lines, 1 975 B, sha256 20f056816e904fa4413d221fa4784c04d9ed2518549dc9fb77fd335a16eb7a77)
  writes DecayTree's D0_MM, D0_PT, D0_TAU and D0_MINIPCHI2 as M, PT, TAU, IPCHI2, each value
  `str()` of its float32. Run on record 401's `MasterclassData.root` (sha256 8694a2ed…) in
  the venv, it wrote 3 926 142 B with sha256
  25c3c97299ea844f27308fde20a00ecaa87580868f3c767d7ade5621c1505136, the course CSV byte for
  byte. It needs uproot (not in the env). It is written for the kit, not copied from the
  course's script.
- `bake/code.py` now reads `bake/root_to_csv.py` (shown as `components/data-kit/bake/root_to_csv.py`)
  instead of the course's file; `code-lines.json` regenerated (sha256 137b09b0…). d0.py is
  now 918 lines (sha256 053d8070…); its runs for lines 87-208 are unchanged.
- Lab 5's code stage draws the whole converter (52 lines at 6.9 units: a pitch of 0.13
  against d0.py's 0.17). README (dk-pipeline) suggests `lines: [19, 52]` or a 9.0-unit stage.

### Sync
`sync.py --all` into DataLab1-5 only (28 files, 3.89 MB each; labs 1, 4 and 5 took 14 files,
labs 2 and 3 two). `check.mjs`: 0 errors in all five (the warnings are the named-decay
captions of other lanes' slides). `pnpm talk check datalab1..5`: all ok.

### Open
- The subtraction numbers hold for lab 3's plot config only; T3's deck must use the same
  `tau` object (seed 401, grains 70 000, window and sidebands) or re-bake with its own.
- The T3 outline's "Δχ² 14.5 at 1 864.84, 11.5 / 17.8 at the edges" is confirmed (14.47,
  11.50, 17.78). Its window means (1 864.38 / 1 864.46 / 1 864.42 / 1 864.44, 1 864.92)
  match to 0.01.
- `d0-fit.json`'s digest is the same in two passes on one machine; another machine needs the
  same numpy, scipy and Python. No pinned lockfile exists.
- Lab 2 slide 22 shows a short white bar above the alarm bin at 3 500 entries (the hist's
  `{window}` mean tick, not a bake output): for the dk-hist owner.
