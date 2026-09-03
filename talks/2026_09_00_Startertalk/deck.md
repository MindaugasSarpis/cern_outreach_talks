---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
title: Pentaquarks at LHCb
info: |
  Startertalk — 30-minute technical seminar on hidden-charm pentaquarks at LHCb.
  Audience: physics faculty and students. Date placeholder 2026_09_00.
  Figures: scripts/make_figures.py → public/figures/*.svg.
layout: cover
background: /figures/background_intro.jpg
---

# Mindaugas Šarpis

# Pentaquarks at LHCb

## Ten years of five-quark states — what we found, what they might be, and how we will find out

<div class="mt-md opacity-70">LHCb collaboration · Vilnius University</div>

<!--
Speaker: 30 minutes. Three parts — the discovery decade (what we found), the
pictures (what they might be), the programme (how we will find out). (~1 min)
-->

---

<VideoPlayer src="lhcb.mp4" />

<!--
Speaker: LHCb reel (48 s, with audio, shared release). Let it run; say nothing
until it ends — then: "that is the instrument; here is what it found."
-->

---

# Hadrons: What QCD **Allows**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 🎨 **Colour singlets come in many sizes**

- q q̄ mesons and qqq baryons — everything in the textbook
- qq q̄ q̄ tetraquarks and qqqq q̄ pentaquarks — written down in Gell-Mann's 1964 quark paper
- Nothing in QCD forbids them; nothing guarantees they are bound, or narrow enough to see

</div>

<div class="card card-warning pad-tight">

## 🕰️ **Fifty years of three-quark baryons**

- Every baryon found between 1947 and 2015 fitted the qqq scheme
- 2003: the light pentaquark Θ⁺(1540) — reported by a dozen experiments, gone once high-statistics data arrived
- Lesson the field paid for: a bump is not a state

</div>

</div>

<div class="card card-info pad-compact mt-md">

The heavy-quark sector changed the odds: a slow charm quark lets a weak residual force bind a meson–baryon pair, thresholds are sharp and well known, and the LHC produces beauty hadrons that decay into exactly such pairs by the billion.

</div>

<!--
Speaker: the Θ⁺ episode in one line, no more — it is why every claim since is
held to a full amplitude analysis. (~2 min)
-->

---
layout: section
hideInToc: true
---

# The discovery **decade**

---

# The Golden Channel: Λb⁰ → J/ψ p K⁻

<img src="/figures/lambda_b_decay.svg" class="mx-auto" style="height: 262px" alt="Two decay topologies of the Lambda_b to J/psi p K final state" />

<div class="grid-2 mt-sm">

<div class="card card-primary pad-compact">

## 🔭 **Why LHCb**

A forward spectrometer built for beauty: the vertex detector separates the Λb⁰ flight from the collision point, the RICH detectors identify the K⁻ and the p, and J/ψ → μ⁺μ⁻ is a clean trigger.

</div>

<div class="card card-accent pad-compact">

## 🧩 **Why this decay**

The J/ψ p pair carries c c̄ uud — five quarks, so a peak in m(J/ψ p) cannot be an ordinary baryon. But Λ* → p K⁻ resonances feed the same final state and reflect into m(J/ψ p): the fit must model both paths, and their interference, at once.

</div>

</div>

<!--
Speaker: both diagrams end in the same three particles. That single fact is
why "pentaquark" and "amplitude analysis" are inseparable words. (~2 min)
-->

---

# 2015: Two Peaks in m(J/ψ p)

<div class="grid-2 mt-md">

<div>

<div class="card card-primary pad-tight">

## 📈 **Pc(4380)⁺ and Pc(4450)⁺**

- Pc(4380)⁺: M = 4380 ± 8 ± 29 MeV, Γ = 205 ± 18 ± 86 MeV — **9σ**
- Pc(4450)⁺: M = 4449.8 ± 1.7 ± 2.5 MeV, Γ = 39 ± 5 ± 19 MeV — **12σ**
- Opposite parities preferred, e.g. J<sup>P</sup> = (3/2⁻, 5/2⁺)

</div>

<div class="card card-secondary pad-tight mt-md">

## 🧮 **The fit**

Run 1, 3 fb⁻¹: about 26 000 Λb⁰ → J/ψ p K⁻ decays. A six-dimensional amplitude fit — all decay angles and masses at once — with 14 Λ* resonances; the data refused to be described until two J/ψ p states were added.

</div>

</div>

<div class="card card-accent pad-tight">

## 🌀 **The Argand argument**

A resonance is more than a bump: its amplitude's **phase** must rotate through 180° across the peak, tracing a counter-clockwise circle in the Argand plane.

The fit let the Pc(4450)⁺ amplitude float freely — magnitude and phase — in six bins of m(J/ψ p), and the points drew the circle. That, not the bump, carried the claim.

For the broad Pc(4380)⁺ the loop was less clean — one reason it remains a candidate rather than a settled state.

</div>

</div>

<div class="text-xs opacity-60 mt-2">LHCb, PRL 115 (2015) 072001 · arXiv:1507.03414</div>

<!--
Speaker: stress that the 2015 result was an amplitude analysis, not a mass
fit — the Argand loop is the difference between "bump" and "state". (~2 min)
-->

---

# 2019: Run 1 + 2 — Nine Times the Yield

<div class="grid-3 mt-md">

<div class="card card-primary pad-compact">

## 🆕 **Pc(4312)⁺**

- M = 4311.9 ± 0.7 MeV
- Γ = 9.8 ± 2.7 MeV
- a new state: **7.3σ**

</div>

<div class="card card-secondary pad-compact">

## ✂️ **Pc(4440)⁺**

- M = 4440.3 ± 1.3 MeV
- Γ = 20.6 ± 4.9 MeV
- the old Pc(4450)⁺ splits …

</div>

<div class="card card-secondary pad-compact">

## ✂️ **Pc(4457)⁺**

- M = 4457.3 ± 0.6 MeV
- Γ = 6.4 ± 2.0 MeV
- … two peaks over one: **5.4σ**

</div>

</div>

<div class="grid-2 mt-md">

<div class="card card-success pad-compact">

## 📊 **What changed**

About 246 000 decays from 9 fb⁻¹ — nine times the 2015 sample. Three narrow states, widths of order 10 MeV, all just below open-charm thresholds: a pattern nobody had asked for.

</div>

<div class="card card-warning pad-compact">

## ⚠️ **The caveat**

One-dimensional fits to m(J/ψ p), with the Λ* reflections suppressed by cuts and weights — no amplitude analysis. So no J<sup>P</sup>, no phase motion, and the broad Pc(4380)⁺ neither confirmed nor excluded.

</div>

</div>

<div class="text-xs opacity-60 mt-2">LHCb, PRL 122 (2019) 222001 · arXiv:1904.03947 — statistical uncertainties shown</div>

<!--
Speaker: the caveat matters for part three — these numbers come from a 1D
fit, and the quantum numbers are still open. (~2 min)
-->

---

# The Threshold **Coincidence**

<img src="/figures/pc_thresholds.svg" class="mx-auto" style="height: 335px" alt="Pentaquark masses and widths against meson-baryon thresholds" />

<div class="card card-info pad-compact mt-sm">

Every narrow state sits within about 20 MeV of a charmed-baryon–anticharmed-meson threshold — the Pc states just below Σc D̄ and Σc D̄*, the strange states at Ξc D̄ and Ξc D̄*. If these are bound states, the offset is a binding energy of a few MeV; the deuteron's is 2.2 MeV.

</div>

<div class="text-xs opacity-60 mt-2">Thresholds from PDG masses (Σc(2455)⁺⁺, Σc(2520)⁺⁺, Ξc⁺, D⁰, D*⁰) · states: LHCb 2015–2022</div>

<!--
Speaker: this is the single most important slide of part one. Five narrow
states, five thresholds, no coincidence that large in a 300 MeV window. (~2 min)
-->

---

# Strange Partners: Add an s Quark

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 🔍 **Pcs(4459)⁰ — evidence, 2020**

- Ξb⁻ → J/ψ Λ K⁻, Runs 1–2
- M = 4458.8 ± 2.9 (+4.7 −1.1) MeV, Γ = 17.3 ± 6.5 (+8.0 −5.7) MeV
- **3.1σ** — evidence, not observation; the data do not exclude two overlapping peaks
- 15.8 MeV below the Ξc D̄* threshold

</div>

<div class="card card-accent pad-tight">

## 🏆 **P<sub>ψs</sub><sup>Λ</sup>(4338)⁰ — observation, 2022**

- B⁻ → J/ψ Λ p̄ — a B meson this time, not a b baryon
- M = 4338.2 ± 0.7 ± 0.4 MeV, Γ = 7.0 ± 1.2 ± 1.3 MeV
- **15σ**, full amplitude analysis: J<sup>P</sup> = 1/2⁻ favoured
- Right at the Ξc D̄ threshold

</div>

</div>

<div class="card card-info pad-compact mt-md">

## 🏷️ **New names for a new family**

LHCb's 2022 convention: P for pentaquark, subscript ψ for the c c̄ pair (plus s per strange quark), superscript for the isospin of the light quarks. So Pc(4312)⁺ becomes P<sub>ψ</sub><sup>N</sup>(4312)⁺, and P<sub>ψs</sub><sup>Λ</sup>(4338)⁰ is an isoscalar strange pentaquark.

</div>

<div class="text-xs opacity-60 mt-2">LHCb, Sci. Bull. 66 (2021) 1278 · arXiv:2012.10380 — LHCb, PRL 131 (2023) 031901 · arXiv:2210.10346 — naming: arXiv:2206.15233</div>

<!--
Speaker: the strange states matter because SU(3) partners are what every
theory prediction latches onto — part three is built on them. (~2 min)
-->

---

<VideoPlayer src="cern_video_2019_050_008_1080ph265.mp4" />

<!--
Speaker: silent CERN B-roll (shared release) — a breather before the theory.
Talk over it: "so we have five states; now the harder question — what are they?"
-->

---
layout: section
hideInToc: true
---

# What are **they**?

---

# Picture 1: A Hadronic **Molecule**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 🧲 **Σc D̄⁽*⁾ bound like a deuteron**

- A charmed baryon and an anticharmed meson held by π, ρ, ω exchange — the nuclear force, one level up
- Binding of a few MeV → masses pinned just below thresholds, as observed
- Weakly bound → narrow: to decay to J/ψ p the c and c̄ must find each other across the molecule
- Isospin 1/2 for free; heavy-quark spin symmetry organises the spectrum

</div>

<div class="card card-accent pad-tight">

## 🧮 **Seven slots, three filled**

| channel | J<sup>P</sup> | state |
|---|---|---|
| Σc D̄ | 1/2⁻ | Pc(4312)⁺ |
| Σc D̄* | 1/2⁻, 3/2⁻ | Pc(4440)⁺, Pc(4457)⁺ |
| Σc* D̄ | 3/2⁻ | Pc(4380)⁺ ? |
| Σc* D̄* | 1/2⁻, 3/2⁻, 5/2⁻ | — |

Which of 4440 and 4457 is the 1/2⁻ depends on the sign of the pion-exchange potential — a measurement decides.

</div>

</div>

<div class="card card-warning pad-compact mt-md">

**Weak spots:** the binding is not computable from first principles (cutoff dependence is real), and a state far from any threshold would have no place in the picture.

</div>

<div class="text-xs opacity-60 mt-2">Guo, Hanhart, Meißner et al., RMP 90 (2018) 015004 · arXiv:1705.00141 — Liu et al., PRL 122 (2019) 242001 — Du et al., PRL 124 (2020) 072001</div>

<style>
table { font-size: 0.8rem; margin: 0.3rem 0 0.4rem; }
th, td { padding: 0.15rem 0.5rem; }
</style>

<!--
Speaker: the multiplet is the falsifiable core — seven states or the picture
is wrong. Three found, one candidate, three missing. (~2 min)
-->

---

# Pictures 2–4: Compact **Five-Quark** States

<div class="grid-3 mt-md">

<div class="card card-primary pad-compact">

## 🧱 **Diquark–diquark–antiquark**

[cu][ud] c̄: two colour-antitriplet diquarks and an antiquark, bound by colour–spin forces — an ordinary hadron with five constituents.

- Rich SU(3) multiplets, including **isospin-3/2** partners nobody has seen
- Partners need not sit at thresholds
- Widths naively large — narrowness must be tuned

</div>

<div class="card card-secondary pad-compact">

## 🔗 **Diquark–triquark**

A [cq] diquark orbiting a [c̄ qq] triquark (Lebed): a different clustering with different spin couplings.

- Distinct J<sup>P</sup> assignments
- Specific forbidden transitions between partners
- An orbital excitation can split the pairs

</div>

<div class="card card-accent pad-compact">

## 🎯 **Hadrocharmonium**

A compact c c̄ core sitting in a light-quark cloud, held by the QCD analogue of the van der Waals force.

- Decays back to its seed, J/ψ p or ηc p — **open-charm decays suppressed**
- Γ(ηc p)/Γ(J/ψ p) of order one
- The sharpest falsifiable prediction on the table

</div>

</div>

<div class="text-xs opacity-60 mt-md">Maiani, Polosa, Riquer, PLB 749 (2015) 289 · arXiv:1507.04980 — Lebed, PLB 749 (2015) 454 — Eides, Petrov, Polyakov, arXiv:1904.11616</div>

<!--
Speaker: compact pictures predict more states and different partners;
hadrocharmonium is the one with a yes/no decay test. (~2 min)
-->

---

# Picture 5: No New State at All?

<div class="grid-2 mt-md">

<div class="card card-warning pad-compact">

## 🌊 **Threshold cusps**

When a channel opens — Σc D̄ at 4318.8 MeV — the amplitude has a square-root branch point: a cusp, a peak with no pole behind it.

- Peaks **at** the threshold, not below it
- Lineshape fixed by the channel, not tunable
- Needs strong coupling to be visible

</div>

<div class="card card-warning pad-compact">

## 🔺 **Triangle singularities**

Three intermediate hadrons that can all be on shell at once make a sharp peak — e.g. χc1 p → J/ψ p rescattering at the χc1 p threshold, 4448.9 MeV, uncomfortably close to the 2015 Pc(4450)⁺.

- Position depends on the production process
- Width from kinematics, not dynamics

</div>

</div>

<div class="card card-success pad-compact mt-md">

## ✅ **Why the narrow states look like poles**

The 2015 amplitude phases traced a full resonance circle; the Pc(4312)⁺ peak sits 7 MeV **below** Σc D̄, and its phase motion in fits loops like a resonance — a pure cusp does neither; and no triangle candidate lands at 4312. A kinematic origin is not excluded for every peak, but it cannot be the whole story.

</div>

<div class="text-xs opacity-60 mt-2">Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502 · Mikhasenko, arXiv:1507.06552 · Guo et al., RMP 90 (2018) 015004</div>

<!--
Speaker: the honest position — kinematic effects are real physics and can
sit on top of poles; the test is channel-independence (part three). (~2 min)
-->

---

# What Would **Tell Them Apart**

<div class="card card-info pad-compact mt-sm">

| Observable | Molecule | Compact diquark | Hadrocharmonium | Kinematic |
|---|---|---|---|---|
| J<sup>P</sup> pattern | fixed by S-wave thresholds: 1/2⁻, 3/2⁻ | many, positive parity too | seed ⊗ nucleon: 1/2⁻, 3/2⁻ | anything mimicked |
| Widths | narrow, ~10 MeV | naively broad, tuned | narrow | set by kinematics |
| Open charm, Λc D̄⁽*⁾ | sizable, maybe dominant | allowed | **suppressed** | — |
| Γ(ηc p) / Γ(J/ψ p) | suppressed | model-dependent | **order one** | — |
| Isospin-3/2 partners | none | **predicted** | none | none |
| Peak position vs channel | universal | universal | universal | **channel-dependent** |
| Magnetic moments | differ from compact in sign and size | differ from molecule | — | — |

</div>

<div class="note-text mt-md">Bold marks the entry a picture cannot escape. The first six rows are amplitude-analysis observables in data LHCb already has; magnetic moments need polarisation observables and are a longer game.</div>

<div class="text-xs opacity-60 mt-2">Chen et al., Phys. Rept. 639 (2016) 1 · arXiv:1601.02092 — EM observables: arXiv:2603.19151, arXiv:2510.26893</div>

<style>
table { font-size: 0.8rem; margin: 0; }
th, td { padding: 0.22rem 0.5rem; line-height: 1.3; }
th { text-align: left; }
</style>

<!--
Speaker: walk one row, not seven — open charm (row 3) is the cleanest yes/no.
(~2 min)
-->

---
layout: section
hideInToc: true
---

# How we will **find out**

---

# The Data Are In — The Analyses Are Not

<div class="grid-2 mt-sm">

<div>

<img src="/figures/lhcb_lumi.svg" class="w-full" alt="LHCb integrated luminosity per data-taking period" />

<div class="text-xs opacity-60 mt-2">LHCb recorded luminosity by data-taking period · Run 3 total 26.7 fb⁻¹</div>

</div>

<div>

<div class="card card-primary pad-compact">

## 📦 **Run 3 is complete**

26.7 fb⁻¹ with a fully software trigger — about three times the sample behind every pentaquark result so far. The LHC is in its long shutdown: the dataset is final and sits on disk.

</div>

<div class="card card-warning pad-compact mt-sm">

## 🧗 **The bottleneck is the fit**

An amplitude analysis is a multidimensional fit of hand-built interfering resonances — person-years per channel. The 2019 update fell back on a 1D mass fit, and the narrow states' J<sup>P</sup> are still unpublished from the full sample.

</div>

<div class="card card-info pad-compact mt-sm">

## 📐 **Why a 1D fit cannot give J<sup>P</sup>**

Spin and parity live in the angular distributions and in the interference with the Λ* — the mass projection integrates all of it away.

</div>

</div>

</div>

<!--
Speaker: the wall is not data, it is analysis capacity. Say it plainly. (~2 min)
-->

---

# Five Handles at LHCb

<div class="grid-3 mt-md">

<div class="card card-primary pad-compact">

## 1️⃣ **J<sup>P</sup> from the full amplitude fit**

Λb⁰ → J/ψ p K⁻ with Runs 1–3: pin the 1/2⁻ / 3/2⁻ ordering of Pc(4440)⁺ and Pc(4457)⁺ — the molecular picture's first hard test.

</div>

<div class="card card-secondary pad-compact">

## 2️⃣ **The next states, in J/ψ Ξ**

Ωb⁻ → J/ψ Ξ⁰ K⁻ and B⁻ → J/ψ Ξ⁻ Λ̄: chiral EFT predicts P<sub>ψs</sub><sup>Σ</sup>(4367) and P<sub>ψss</sub><sup>N</sup>(4379). Also Λb⁰ → J/ψ Ξ⁻ K⁺ and Ξb → J/ψ Ξ⁻ π⁺.

</div>

<div class="card card-accent pad-compact">

## 3️⃣ **Open-charm decays**

Pc⁺ → Λc⁺ D̄⁽*⁾⁰, e.g. in Λb⁰ → Λc⁺ D̄⁰ K⁻: sizable if molecular, absent if hadrocharmonium. Rare — but LHCb's trigger, vertexing and hadron ID are made for it.

</div>

</div>

<div class="grid-2 mt-md">

<div class="card card-success pad-compact">

## 4️⃣ **ηc p versus J/ψ p**

Reconstruct ηc → p p̄ and measure Γ(ηc p)/Γ(J/ψ p): order one says hadrocharmonium, strongly suppressed says molecule.

</div>

<div class="card card-warning pad-compact">

## 5️⃣ **Same peak, different door**

Compare peak masses across Λb⁰ → J/ψ p K⁻, B⁰₍s₎ → J/ψ p p̄ and prompt pp → J/ψ p + X: a pole is universal, a cusp or triangle moves. Prompt production also starves molecules — a rate test on top.

</div>

</div>

<div class="text-xs opacity-60 mt-2">JHEP 11 (2025) 149 · arXiv:2509.19840 · arXiv:1904.11616 · Mikhasenko, arXiv:1507.06552</div>

<!--
Speaker: handles 1–3 are Tier 1 for Run 3; 4–5 follow. All are amplitude
analyses of channels already on disk. (~3 min)
-->

---

# 2026 Snapshot: Theory Has an Ask

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 🔬 **Molecules? It depends on a phase**

arXiv:2608.25106 refits the published Run 1+2 J/ψ p spectrum with one global two-channel Flatté model for all three narrow states, extracting scattering lengths and effective ranges with bootstrap uncertainties.

- Real couplings → the (a, r) values read as molecular
- Let the relative coupling phases float → the conclusion is **not robust**
- The ask of the experiment: publish or constrain those phases — only a full amplitude analysis can

</div>

<div class="card card-accent pad-tight">

## 🎯 **The standing sharpest targets**

- **P<sub>ψss</sub><sup>N</sup>(4379)** in Ωb⁻ → J/ψ Ξ⁰ K⁻ — a named mass in a named channel (JHEP 11 (2025) 149)
- **J<sup>P</sup> ordering of Pc(4440)⁺ / Pc(4457)⁺** — heavy-quark spin symmetry ties the two together; hadrocharmonium and virtual-state readings call it differently (arXiv:2605.13344)
- **The doubly strange sector** in Λb⁰ → J/ψ Ξ⁻ K⁺ and Ξb → J/ψ Ξ⁻ π⁺ (arXiv:2509.19840)
- Each is a Run 3 amplitude analysis waiting for hands

</div>

</div>

<div class="text-xs opacity-60 mt-2">arXiv:2608.25106 (Aug 2026) · arXiv:2605.13344 (May 2026) · JHEP 11 (2025) 149 · arXiv:2509.19840</div>

<!--
Speaker: the field is asking the experiment for specific numbers — phases,
one mass, one ordering. That is the programme. (~2 min)
-->

---
layout: fact
---

# Nucleus or hadron?

Mapping the spectrum — which predicted states exist, with which quantum numbers — decides whether QCD binds five quarks the way it binds a deuteron, or the way it binds a proton.

<!--
Speaker: one sentence, then stop. (~1 min)
-->

---

<VideoPlayer src="cern_overview_short.mp4" />

<!--
Speaker: CERN overview (silent, shared release) as the outro backdrop.
Thank the audience over it, then advance to the contact slide for questions.
-->

---
layout: statement
---

# Thank you

<div class="mt-md opacity-80">Mindaugas Šarpis · LHCb · Vilnius University</div>

<div class="text-xs opacity-60 mt-lg">LHCb: arXiv:1507.03414 · 1904.03947 · 2012.10380 · 2210.10346</div>

<div class="text-xs opacity-60 mt-xs">Reviews: Guo et al., RMP 90 (2018) 015004 · Olsen, Skwarnicki, Zieminska, RMP 90 (2018) 015003 · PDG, "Pentaquarks"</div>
