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
  Figures: scripts/make_figures.py → public/figures/*.svg; paper plots: scripts/fetch_figures.sh.
layout: cover
space:
  at: wide
---

# LHCb Startertalk

# Pentaquarks at LHCb

## Hidden-charm pentaquarks, 2015–2026

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<!--
Speaker: 30 minutes, one scene throughout: a path of stations in the dust
(the 1964 page, the Θ⁺ ghost, the decay, the states, the two interiors, the
missing neutrals, the empty grid). Three parts: what LHCb found (2015–2022), what the
states could be, what Run 3 will measure. The 2015 paper (LHCb, PRL 115 (2015)
072001, submitted July 2015) is eleven years old. Behind the title: the hero station. The five quarks fly in from the dust and assemble into the c c̄ u u d cluster, the title fades in as the last one lands, and `c` replays it; the same cluster closes the talk. Hadron dates and masses in the records are from Koppenburg's list (LHCb-FIGURE-2021-001 and updates, CC BY 4.0), credited on the references backup. (~0.5 min)
-->

---
space: { at: [3.4, 3.2, 0], dist: 11, yaw: 2, pitch: 4, dim: 0.35 }   # the paper station, the page at the left and the cluster low right, clear of the scans
---

# 1964: five quarks are allowed

<div class="papers">
<figure class="paper-row">
<img class="portrait" src="/figures/GellMannPhoto.png" alt="Murray Gell-Mann" />
<div class="scan-col">
<img class="scan" src="/figures/Gell-Mann.png" alt="Gell-Mann, Physics Letters 8 (1964) 214: baryons from (qqq), (qqqqq̄), mesons from (qq̄), (qqq̄q̄)" />
<figcaption>Gell-Mann, Phys. Lett. 8 (1964) 214, received 4 January: (qqqqq̄) in the first quark paper</figcaption>
</div>
</figure>
<figure class="paper-row">
<img class="portrait" src="/figures/ZweigPhoto.png" alt="George Zweig" />
<div class="scan-col">
<img class="scan" src="/figures/Zweig.png" alt="Zweig, CERN-TH-401 (1964), footnote 6: baryons from three aces, and from four aces and an anti-ace" />
<figcaption>Zweig, CERN-TH-401, 17 January, footnote 6: ĀAAAA, four aces and an anti-ace</figcaption>
</div>
</figure>
</div>

<!--
Speaker: the page floating in the world is page 1 of Zweig's CERN report
TH-401, dated 17 January 1964 (CERN Document Server record 352337): three
"aces" with baryon number 1/3, hence fractional charge. Gell-Mann's letter
(Phys. Lett. 8 (1964) 214, received 4 January 1964) has the sentence on
screen: five-quark baryons appear in the first quark paper, in the same
sentence as qqq. Zweig's footnote 6, the second scan, says the same in his
language: baryons "not only from the product of three aces, AAA, but also
from ĀAAAA, ĀĀAAAAA, etc.", mesons from "ĀA, ĀĀAA etc.", and the light ones
"deuces and treys". The rule in 1964 was baryon number: the triplet carries
B = 1/3, so a baryon is qqq plus any number of qq̄ pairs. Colour came later
(Greenberg, PRL 13 (1964) 598; Han and Nambu, Phys. Rev. 139 (1965) B1006).
Zweig's CERN-TH-412 (21 February 1964) is the longer second version. Neither
paper says whether a five-quark state binds, or how narrow it would be.
Point at the five spheres drifting into one cluster below the scans:
no experiment established a five-quark state until 2015. (~1.25 min)
-->

---
space: { at: [12.5, 6, -5], dist: 14, yaw: -20, pitch: 32, dim: 0.35 }   # the ghost in the empty lower right, clear of the quote
---

# 1976–1992: the same story for twenty years

<div class="quote-hero wide">“the results permit no definite conclusion — the same story for 20 years. […] The skepticism about baryons not made of three quarks, and lack of any experimental activity in this area, make it likely that another 20 years will pass before the issue is decided.”<span class="who">Particle Data Group, 1992 edition · the last listing of Z₀(1780), Z₀(1865) and Z₁(1900), positive-strangeness baryons claimed in the early 1970s</span></div>

<div class="src">PDG 1976, RMP 48 (1976) S1 · PDG 1992, PRD 45 (1992) S1 · both quoted in PDG 2024 (2025 update), review “Pentaquarks” (Karliner, Skwarnicki)</div>

<!--
Speaker: the first wave. Kaon–nucleon partial-wave analyses in the early
1970s claimed Z baryons with strangeness +1, which no qqq state can carry; the
1976 PDG listed Z₀(1780), Z₀(1865) and Z₁(1900), and nothing sharpened for
twenty years. Read the 1992 note aloud: it is the mood the subject lived in
until 2015 — and 1992 + 23 = 2015. The ghost ahead is the second wave. (~1 min)
-->

---
clicks: 1
space:
  at: theta
  stops: [Theta(1540)]
---

# 1997–2006: the Θ⁺(1540)

<div class="row stage">
<div class="card card-primary pad-tight col-45">

## Predicted, 1997

Diakonov, Petrov and Polyakov: the chiral-soliton antidecuplet has an exotic uudds̄ member near 1530 MeV, narrower than 15 MeV, decaying to K⁺n and K⁰p.

</div>
<div class="card card-warning pad-tight col-45">

## Seen, then not

LEPS reported it in 2003 at 4.6σ from tens of events; about ten experiments followed. The high-statistics runs of CLAS, Belle and BaBar saw nothing, and PDG 2008 closed the case.

</div>
</div>

<div class="quote-line mt-md">“The conclusion that pentaquarks in general, and the Θ⁺, in particular, do not exist, appears compelling.”<span class="who">Particle Data Group, 2006 edition</span></div>

<div class="src">Diakonov, Petrov, Polyakov, Z. Phys. A 359 (1997) 305 · LEPS, PRL 91 (2003) 012002 · Hicks, EPJ H 37 (2012) 1 · PDG 2006, J. Phys. G 33 (2006) 1</div>

<!--
Speaker: LEPS saw a peak near 1540 MeV in γn → K⁺K⁻n: M = 1540 ± 10 MeV,
4.6σ, from tens of events (LEPS, PRL 91 (2003) 012002). Positive reports in
2003–04 from LEPS, DIANA, CLAS, SAPHIR, HERMES, ZEUS and others, each with
samples of tens of events; the CLAS high-statistics runs, Belle and BaBar found
no signal, and the PDG 2008 review "Pentaquarks" (C.G. Wohl) refers to "the overwhelming evidence that the claimed pentaquarks do not exist"; the Θ(1540) is gone from the Listings soon after. A bump in
one projection can be a reflection, a kinematic effect or a fluctuation: the CLAS repeat of its own γd measurement, at about 30 times the luminosity, found no signal (PDG 2006 pentaquark update). The 2015 claim rested on a six-dimensional amplitude fit with phase motion shown for the narrow state, and in the 2019 sample, nine times the data, the narrow state was there again, resolved into two (slide 13).
Click: the stop on Θ⁺(1540); the record reads LEPS, 2003, 1540 ± 10 MeV, not confirmed. The
ghost in the world is five faint quarks that breathe apart and never hold: a
state that went away. Throughout the world an unestablished state is a dim
orb, an established one a lit one. (~1.25 min including the stop, ≤ 15 s on
the record)
-->

---
space: { at: [38, 2, -28], dist: 16, yaw: -8, pitch: 12, dim: 0.76 }   # off the path, in the dust; no station in frame
---

# A resonance is a pole, not a bump

<div class="plate halo">
<ArgandDiagram />
</div>

<div class="caption mt-sm" style="max-width: none">A pole at m₀ − iΓ/2 makes |A|² a symmetric bump and forces the phase δ through 90° at the peak: in the Argand plane the amplitude walks a circle. The histogram never shows δ. The interference with the Λ* amplitudes across the decay angles does, and that is what the amplitude fit reads. In 2015 LHCb replaced the P<sub>c</sub>(4450)⁺ Breit–Wigner by six free complex numbers, one per mass bin; they traced the circle.</div>

<div class="src">Breit, Wigner, Phys. Rev. 49 (1936) 519 · PDG 2024, review “Resonances” · LHCb, PRL 115 (2015) 072001, Fig. 9</div>

<!--
Speaker: let the marker sweep once while talking (nine seconds a pass). The
three views move together: the peak, the phase through 90°, the top of the
circle. Then the six hollow markers: that is what the 2015 fit floated, and
the reason a phase, not a bump, made the claim. Argand, 1806, was a
bookkeeper who drew complex numbers as points in a plane. (~2 min)
-->

---
space: { at: [38, 2, -28], dist: 16, yaw: 16, pitch: 12, dim: 0.76 }
---

# Not every bump is a state

<div class="checklist">
<div>

<h2 class="bump">How a bump appears</h2>

- <b>Reflections.</b> Fourteen Λ* in the 2015 model, each a broad band in m(J/ψ p); interfering bands make bumps. Model them in six dimensions, or show that no Λ* of any allowed spin can make a peak that narrow (2016).
- <b>Interference.</b> Two overlapping states of the same J<sup>P</sup> add coherently and move each other's mass; the +6.8 MeV on P<sub>c</sub>(4312)⁺ is that systematic.
- <b>Fluctuations.</b> The Θ⁺ came from samples of tens of events and cuts tuned on the data that made them.

</div>
<div>

<h2 class="state">What a state must do</h2>

- <b>Significance against a model.</b> Δχ² or Δ(−2 ln L) on pseudoexperiments, not Wilks; the look-elsewhere effect from the best peak in each pseudo-spectrum; Λ* model, resolution and background varied.
- <b>Phase motion.</b> Six free amplitudes trace the circle, or they do not.
- <b>Universality.</b> One mass in every channel and parent; a cusp sits at its threshold; a triangle moves.
- <b>Width against resolution.</b> 2–3 MeV in m(J/ψ p); a width at the resolution is quoted as a 95% CL limit.

</div>
</div>

<div class="src">LHCb, PRL 115 (2015) 072001 · PRL 117 (2016) 082002 · PRL 122 (2019) 222001 and Supplemental Material · Gross, Vitells, EPJC 70 (2010) 525</div>

<!--
Speaker: this is the checklist the rest of the talk is graded against; amber
is how a bump appears, green what a state must do. Every 2015 and 2019 claim
went through the right-hand column: the 2015 significances are Δ(−2 ln L)
with the extended Λ* model; the 2019 ones are Δχ² on pseudoexperiments, 7.3σ with
the look-elsewhere correction for P_c(4312)⁺, and the two-peak hypothesis
over one at 5.4σ. The
model-independent 2016 check uses the Legendre moments of the Λ* → pK⁻
angular distribution, limited by the highest Λ* spin, and rejects
"reflections only" at more than 9σ. (~2 min)
-->

---
space:
  at: [63.5, -0.8, 1]
  dist: 14
  yaw: 0
  pitch: 58          # from above: the states and neutrals stations stay out of the frame, only dust behind the models
  dim: 0.22          # the two models in the world are the picture
---

# One hadron or two

<div class="three-col caption world-caption">
<div><b>Two hadrons.</b> A charmed baryon and an anticharmed meson about two femtometres apart, bound by a few MeV through the residual strong force, as in a deuteron.</div>
<div><b>One hadron.</b> Five quarks in one volume, bound directly by the colour force, as in a proton. QCD allows both; the talk is about telling them apart.</div>
<div><b>Why charm.</b> Charmed hadrons are heavy, so a pair moves slowly and a weak residual force can bind it, as a proton and a neutron bind in the deuteron. The thresholds, sums of measured masses, are known to a fraction of an MeV.</div>
</div>

<div class="src">Sizes schematic; the 1 fm bar in the world is to scale · Guo et al., RMP 90 (2018) 015004 · PDG 2024 masses</div>

<!--
Speaker: this is the talk's question, asked once the Θ⁺ lesson and the checklist are on the table; say it in one sentence and come back
to it at the close. The third line, why charm, hands over to the LHCb decay on the next slides. The two models in the world (left: the Σc D̄ molecule with
its exchange glow; right: the compact ball — seen from above, so only dust
lies behind them) are the picture; nothing else is drawn on the slide. Deuteron: binding energy 2.22 MeV (m_p + m_n − m_d, PDG 2024 constants),
size r ≈ ħc/√(2μE_B) ≈ 4.3 fm for μ = 469.5 MeV, several times the range of
the force. Proton: rms charge radius 0.84 fm (PDG 2024), one volume, no
substructure of hadrons inside. The two panels carry no quark letters and no
channel labels on purpose: do not name Σc D̄ or diquarks here, the physics
labels come on slides 18 and 19. Why charm, the third line. Heavy hadrons: a Σc D̄ pair has a large reduced mass (μ ≈ 1059 MeV for Σc⁺D̄⁰, against 470 MeV for the deuteron), so the kinetic energy of its relative motion, k²/2μ, is small and a weak residual force (light-meson exchange between the two hadrons) is enough to bind; this is the deuteron mechanism one level up (Törnqvist, Z. Phys. C 61 (1994) 525; Guo, Hanhart, Meißner et al., RMP 90 (2018) 015004, Sec. III). The relevant mass is the reduced mass of the two hadrons; the charm quark's motion inside either hadron does not enter. Thresholds are sharp because the hadron masses are known to a fraction of an MeV: D⁰ 1864.84 ± 0.05 MeV, Σc(2455)⁺ 2452.65 (+0.22 −0.16) MeV (PDG 2024). A state a few MeV below such a threshold is narrow because a decay to J/ψ p needs the c and the c̄ to recombine across two hadrons. Say "bound like a deuteron" here: that is what part two calls a hadronic molecule. The LHC makes b hadrons whose decays put cc̄ and light quarks in one place: 26 000 Λb⁰ → J/ψ p K⁻ decays in Run 1 (3 fb⁻¹; LHCb, PRL 115 (2015) 072001); the decay is on slide 10. (~1.5 min)
-->

---
space: { at: [63.5, -0.8, 1], dist: 14, yaw: 14, pitch: 58, dim: 0.86 }   # the two models stay behind, almost hidden; the figure is the slide
---

# A number for one or two: Weinberg's Z

<div class="row stage">
<img src="/figures/weinberg_z.svg" class="col-60 plate" alt="Weinberg's relations, a/R and r/R against Z, with the deuteron at Z near zero and the force-range correction for the deuteron and for Pc(4312)+" />
<div class="col-40">
<div class="caption">Weinberg, 1965: for a shallow bound state, the scattering length a and the effective range r of the two hadrons measure Z, the weight of an elementary component, through a = 2(1−Z)/(2−Z) R and r = −Z/(1−Z) R, up to the force range 1/m<sub>π</sub> = 1.4 fm.</div>
<div class="caption mt-sm">A two-hadron state has a ≈ R and a small positive r; an elementary one has a large negative r. For P<sub>c</sub>(4312)⁺ both numbers come from the Σ<sub>c</sub>⁺D̄⁰ lineshape, and with R = 1.8 fm, a width and a possibly virtual pole they need the extended forms.</div>
</div>
</div>

<div class="src">Weinberg, Phys. Rev. 137 (1965) B672 · R = ħc/√(2μE<sub>B</sub>) · deuteron a<sub>t</sub>, r<sub>t</sub>, E<sub>B</sub>: PDG 2024 · with a width: Baru et al., PLB 586 (2004) 53 · range, virtual states: Matuschek, Baru, Guo, Hanhart, EPJA 57 (2021) 101 · Guo et al., RMP 90 (2018) 015004</div>

<!--
Speaker: Weinberg's 1965 paper is titled "Evidence that the deuteron is not
an elementary particle". Take a bare state, elementary with probability Z,
coupled to a two-hadron continuum. If the bound state is shallow, the two
low-energy parameters of two-hadron scattering fix Z: a = 2(1−Z)/(2−Z) R and
r = −Z/(1−Z) R, each up to a term of the order of the force range, 1/m_π =
1.4 fm, with R = ħc/√(2μE_B) = 4.3 fm for the deuteron (μ = 469.5 MeV, E_B =
2.22 MeV). Measured: a_t = 5.42 fm, r_t = 1.76 fm. Z = 0 predicts a = 4.3 ±
1.4 fm and r = 0 ± 1.4 fm; both fit. Z = ½ would need r ≈ −4.3 fm. The pole
condition of the effective-range expansion, 1/a = 1/R − r/(2R²), returns a =
5.42 fm from R and r exactly: a consistency check, not the evidence; the
evidence is the sign and size of r. Why it is clean for the deuteron: R =
4.3 fm ≫ 1.4 fm, that is 2.2 MeV ≪ (ħc)²/(2μ (1.4 fm)²) ≈ 21 MeV. For
Pc(4312)⁺ as Σc⁺D̄⁰: μ = 1059 MeV, E_B = 5.6 MeV (with a +6.8 MeV systematic
on the mass, so even the sign of E_B is open), R = 1.8 fm against 1.4 fm and
the scale is 9 MeV: the leading-order relations lose their power. The state
has Γ = 9.8 MeV > E_B, so its pole is off the real axis, and JPAC prefer a
virtual pole. Hence the extended forms: Baru, Haidenbauer, Hanhart,
Kalashnikova, Kudryavtsev (PLB 586 (2004) 53) for a state with a width,
through the Flatté coupling, whose size measures 1 − Z; Matuschek, Baru, Guo,
Hanhart (EPJA 57 (2021) 101) for range corrections and virtual states. What
LHCb measures: the lineshape at the Σc⁺D̄⁰ threshold in Λb⁰ → J/ψ p K⁻, and
the Σc D̄ channel itself in Λb⁰ → Σc D̄ K⁻ (slide 22, the neutrals); an
amplitude fit with a Flatté or effective-range form returns a and r. The
2026 Flatté refit of the published spectrum (arXiv:2608.25106) is a first
pass on the published histogram; the phases need the full amplitude
analysis. If asked about the X(3872): the same argument on LHCb's Flatté
lineshape started a dispute over how the D⁺D⁻ channel and the D*⁰ width feed
the effective range (Esposito et al., arXiv:2108.11413; Baru et al.,
arXiv:2110.07484). Close on one sentence: Z is the number that "one hadron or
two" becomes. (~1.25 min)
-->

---
layout: section
hideInToc: true
space: { at: [32.4, 1.6, 2], dist: 13, yaw: -30, pitch: 8 }   # the decay below the section title
---

# What LHCb found, 2015–2022

<!--
Speaker: one sentence while the camera flies to the decay station; the title sits above the Λb⁰ → J/ψ p K⁻ tubes. If the context is wanted: the X(3872) of 2003 (Belle, PRL 91 (2003) 262001) is the first hidden-charm exotic and is established; Z(4430)⁺ followed in 2007 (Belle, PRL 100 (2008) 142001) and Zc(3900)⁺ in 2013 (BESIII, PRL 110 (2013) 252001; Belle, PRL 110 (2013) 252002); no pentaquark until 2015. (~0.25 min)
-->

---
space: { at: decay, dim: 0.2 }
---

# Λ<sub>b</sub>⁰ → J/ψ p K⁻

<div class="caption decay-caption">Two paths lead to the same three particles. A resonance decaying to J/ψ p must have minimal quark content cc̄uud, five quarks. Λ* → K⁻p resonances reflect into m(J/ψ p). The fit models both paths and their interference.</div>

<div class="src">About 26 000 Λ<sub>b</sub>⁰ → J/ψ p K⁻ decays in Run 1 (3 fb⁻¹) · LHCb, PRL 115 (2015) 072001</div>

<!--
Speaker: Why LHCb, in speech only: a forward spectrometer built for b hadrons (LHCb, JINST 3 (2008) S08005). The vertex detector resolves the Λb⁰ flight distance from the collision point, the RICH detectors identify the K⁻ and the p, and J/ψ → μ⁺μ⁻ gives a clean trigger. Why this decay: the quark transition is the Cabibbo-favoured b → cc̄s, and a resonance decaying strongly to J/ψ p must have minimal quark content cc̄uud, five quarks (the paper's wording); a three-quark uud baryon reaches J/ψ p only through OZI-suppressed cc̄ creation. Whether a structure in m(J/ψ p) is a resonance at all is what the fit has to establish. The other path, Λb⁰ → J/ψ Λ*, Λ* → K⁻p, ends in the same three particles; its resonances reflect into m(J/ψ p). The interference between the two paths complicates the fit, and it is what gives access to the phase of a J/ψ p amplitude. Sample: 26 007 ± 166 signal decays in Run 1 (3 fb⁻¹), 5.4% background in the signal window (LHCb, PRL 115 (2015) 072001). (~1.25 min)
-->

---
space: { at: [30, 3.5, 2], dist: 24, yaw: -30, pitch: 18, dim: 0.8 }   # the decay far below, a backdrop; the plots own the frame
---

# What an amplitude analysis fits

<div class="row stage">
<img src="/figures/dalitz_schematic.svg" style="height: 265px" alt="Schematic Dalitz plane: Lambda* bands vertical, pentaquark bands horizontal" />
<img src="/figures/papers/LHCb-PAPER-2015-029_dlz.png" class="paper" style="height: 265px" alt="LHCb 2015 Dalitz plot of Lambda_b to J/psi p K" />
</div>

<div class="caption mt-sm">Λ* resonances make vertical bands in m²(K⁻p). A pentaquark makes a horizontal band in m²(J/ψ p) across the heavier Λ* bands; the boundary keeps it clear of the Λ(1520). The 2015 fit used m(K⁻p) and five decay angles, six dimensions, with complex couplings for every resonance.</div>

<div class="src">Left: schematic, Λ* at PDG masses, P<sub>c</sub> bands at the 2019 LHCb masses, widths exaggerated · Right: LHCb, PRL 115 (2015) 072001, Fig. 5</div>

<!--
Speaker: The left panel is the schematic, the right panel the 2015 data. The three horizontal bands on the left are the 2019 states, drawn for orientation; the 2015 data show one band, near 19.5 GeV² in the paper's words. The 2015 fit was six-dimensional: m(K⁻p) and five decay angles (the Λb⁰, Λ* and J/ψ helicity angles and two azimuths, φ_K and φ_μ). Each Λ* is a vertical band with its own spin structure in the angles. A J/ψ p state is a horizontal band that crosses the heavier Λ* bands, and its interference with the Λ* amplitudes fixes its phase and its J^P. At the Λ(1520) mass m(J/ψ p) cannot go below 4501 MeV, so no Pc band reaches the Λ(1520) band. In the data the bright vertical band at m²(K⁻p) ≈ 2.3 GeV² is the Λ(1520) (mass 1519.42 MeV, PDG 2024 average); the horizontal band the paper places near 19.5 GeV² is the J/ψ p structure: the narrow Pc(4450)⁺ at 4.45² = 19.8 GeV², with the broad Pc(4380)⁺ (19.2 GeV²) under it. This is why a one-dimensional fit to m(J/ψ p) cannot give quantum numbers; that point returns once, on slide 13. The 2015 extended model had 14 Λ* states, with masses and widths fixed to PDG values, and 146 free helicity couplings. Λ* alone does not reproduce the m(J/ψ p) peak, and one added J/ψ p state is not enough; two are. Central values come from the reduced model, 12 Λ* states and 64 free parameters, with the two J/ψ p states; the extended model gives the significances, and its differences enter the systematics. Six mass bins and free magnitudes and phases per bin give the Argand test on the next slide. (~1.25 min)
-->

---
clicks: 2
space: { at: [58, 2, -30], dist: 16, yaw: -8, pitch: 12, dim: 0.7, asof: 2015, stops: [Pc(4380), Pc(4450)] }   # dust in front of the states; the stops fly to the orbs
---

# 2015: two J/ψ p states

<div class="row stage">
<div class="card card-primary pad-tight col-55">

## Six dimensions, 14 Λ* resonances

The 26 000 Run 1 decays are described only once two J/ψ p states are added, at 9σ and 12σ. The P<sub>c</sub>(4450)⁺ amplitude, left free in six bins of m(J/ψ p) across ±Γ, traces the Argand circle.

</div>
</div>

<div class="src">LHCb, PRL 115 (2015) 072001</div>

<!--
Speaker: the numbers stay in the HUD. Run 1 (3 fb⁻¹), 26 007 ± 166 Λb⁰ → J/ψ p K⁻ decays; a six-dimensional amplitude fit (m(Kp) and five angles) with 14 Λ* resonances; the data are not described until two J/ψ p states are added. Pc(4380)⁺: M = 4380 ± 8 ± 29 MeV, Γ = 205 ± 18 ± 86 MeV, 9σ. Pc(4450)⁺: M = 4449.8 ± 1.7 ± 2.5 MeV, Γ = 39 ± 5 ± 19 MeV, 12σ. Best fit J^P = (3/2⁻, 5/2⁺); (3/2⁺, 5/2⁻) and (5/2⁺, 3/2⁻) acceptable (LHCb, PRL 115 (2015) 072001, arXiv:1507.03414). The Argand test: the Pc(4450)⁺ amplitude was left free, magnitude and phase, in six bins of m(J/ψ p) across ±Γ, and the six points follow the Breit–Wigner circle anticlockwise. The broad state's loop shows a large phase change, but the amplitude values depend on the Λ* model and the paper calls that study not conclusive. Its later status is on the next slide. Two 2016 checks the Θ⁺ never had: a model-independent analysis shows that Λ* reflections alone cannot describe the data (PRL 117 (2016) 082002, arXiv:1604.05708), and the Cabibbo-suppressed Λb⁰ → J/ψ p π⁻ decay shows exotic contributions at 3.1σ, the two Pc states plus the Zc(4200)⁻ → J/ψ π⁻ taken together, which the data do not separate; the Pc pair alone reaches 3.3σ only if the Zc(4200)⁻ is assumed absent, and its rate is consistent with the J/ψ p K⁻ result after Cabibbo suppression (PRL 117 (2016) 082003, arXiv:1606.06999). Stops 15 s each: first the broad state (the paper's m(J/ψ p) projection), then the narrow one (the paper's own Argand diagram, the circle of the pole slide traced by data). The HUD reads as of 2015: do not say "split" yet; that is the next slide. (~1.75 min)
-->

---
clicks: 3
space: { at: [58, 2, -30], dist: 16, yaw: 4, pitch: 12, dim: 0.75, stops: [Pc(4312), Pc(4440), Pc(4457)] }
---

# 2019: three narrow states

<div class="caption">Runs 1–2 (9 fb⁻¹) gave 246 000 decays, nine times the 2015 sample.</div>

<div class="row stage mt-sm">
<div class="col-45 plate">

| state | M (MeV) | Γ (MeV) |
|---|---|---|
| P<sub>c</sub>(4312)⁺ | 4311.9 ± 0.7 | 9.8 ± 2.7 |
| P<sub>c</sub>(4440)⁺ | 4440.3 ± 1.3 | 20.6 ± 4.9 |
| P<sub>c</sub>(4457)⁺ | 4457.3 ± 0.6 | 6.4 ± 2.0 |

<div class="caption mt-sm">P<sub>c</sub>(4312)⁺ is new, at 7.3σ; the 2015 P<sub>c</sub>(4450)⁺ resolves into two peaks, preferred over one at 5.4σ.</div>
</div>
<img src="/figures/papers/LHCb-PAPER-2019-014_pentaquarks_nominal_fit_and_thresholds_crop.png" class="paper col-50" style="height: 255px" alt="LHCb 2019: the weighted m(J/psi p) spectrum with the three narrow peaks and the Sigma_c+ Dbar(*)0 thresholds" />
</div>

<div class="caption mt-sm">The spectrum is the weighted sample, with the Λ* flattened; the next slide shows how. The fit is one-dimensional in m(J/ψ p), so it gives no J<sup>P</sup> and no phase.</div>

<div class="src">LHCb, PRL 122 (2019) 222001 · statistical uncertainties only; systematic uncertainties are larger, up to +6.8 MeV on a mass and −10.1 MeV on a width</div>

<!--
Speaker: Run 1 = 3 fb⁻¹ (2011–12), Run 2 = 6 fb⁻¹ (2015–18); about 246 000 Λb⁰ → J/ψ p K⁻ decays (6.4% background), nine times the 2015 sample (LHCb, PRL 122 (2019) 222001, arXiv:1904.03947). The Λ* reflections are reduced by an m(Kp) > 1.9 GeV cut and by cos θ_Pc weighting; the fit is one-dimensional in m(J/ψ p), so there is no amplitude analysis, no J^P and no phase. Say this caveat once, here, and not again until part three. Systematic uncertainties (same paper): Pc(4312)⁺ Γ = 9.8 ± 2.7 (+3.7 −4.5) MeV, < 27 MeV at 95% CL; Pc(4440)⁺ Γ = 20.6 ± 4.9 (+8.7 −10.1) MeV; Pc(4457)⁺ Γ = 6.4 ± 2.0 (+5.7 −1.9) MeV; masses 4311.9 ± 0.7 (+6.8 −0.6), 4440.3 ± 1.3 (+4.1 −4.7), 4457.3 ± 0.6 (+4.1 −1.7) MeV. Pc(4312)⁺ is new at 7.3σ; the 2015 Pc(4450)⁺ resolves into Pc(4440)⁺ and Pc(4457)⁺, two peaks preferred over one at 5.4σ; all three narrow: 6 and 10 MeV for Pc(4457)⁺ and Pc(4312)⁺, about 20 MeV for Pc(4440)⁺. The broad Pc(4380)⁺ is neither confirmed nor excluded by this fit. The figure on the slide is the nominal fit on the weighted sample with the Σc⁺D̄⁰ and Σc⁺D̄*⁰ thresholds drawn; the next slide is how that sample was made. Walk the three stops: one dot (the full spectrum), then two dots 17 MeV apart where one was (the same nominal fit, then the m(Kp) > 1.9 GeV spectrum with its inset). (~2.25 min)
-->

---
space: { at: [58, 2, -30], dist: 16, yaw: 14, pitch: 12, dim: 0.78 }
---

# Getting the Λ* out of the way

<div class="row stage">
<img src="/figures/papers/LHCb-PAPER-2019-014_mkp-spectrum.png" class="paper" style="height: 192px" alt="m(Kp) spectrum of Lambda_b to J/psi p K candidates, dominated by the Lambda(1520)" />
<img src="/figures/papers/LHCb-PAPER-2019-014_weight.png" class="paper" style="height: 192px" alt="The cos theta_Pc weight function, the inverse of the candidate density" />
</div>

<div class="two-col caption mt-sm">
<div><b>The cut.</b> m(Kp) > 1.9 GeV removes most of the Λ*, which peak at low pK⁻ mass, the Λ(1520) above all; the value maximises the expected significance for an isotropic P<sub>c</sub>⁺ decay.</div>
<div><b>The weights.</b> θ<sub>Pc</sub> is the angle between the K⁻ and the J/ψ in the P<sub>c</sub>⁺ frame; the Λ* fill cos θ<sub>Pc</sub> > 0. Weighting each candidate by the inverse of the candidate density in cos θ<sub>Pc</sub>, taken where signal is scarce, flattens the Λ* and leaves the signal untouched.</div>
</div>

<div class="src">LHCb, PRL 122 (2019) 222001, Figs. 1 and 4 · fit: three relativistic Breit–Wigners × p·q, incoherent, convolved with the 2–3 MeV resolution, on a polynomial; validated on six-dimensional amplitude-model pseudo-data</div>

<!--
Speaker: the fraction of Λ* the cut removes: quote it only from the paper (verify before the venue). The reweighting is worth a minute because it is often misread as a
fit to a signal model. It is not: the weights are one over the background
density in the helicity angle, taken from the data in the narrow-peak mass
region, where the signal is a small fraction of the candidates, so the Λ*
are flattened without sculpting a P_c (whose decay is assumed isotropic). The
fit on each sample: binned χ² in 4.22–4.57 GeV; three relativistic
Breit–Wigners added incoherently, each times the phase-space factor p·q,
convolved with the 2–3 MeV resolution, on a polynomial background — sixth
order in the nominal weighted fit, or lower order plus a broad fourth
Breit–Wigner. Sensitivity: weighted > m(Kp) cut (7.3σ for P_c(4312)⁺ with the
look-elsewhere effect) > inclusive; all three samples
enter the systematics because their backgrounds differ. Coherent sums of
pairs of Breit–Wigners give no significant Δχ² but shift the masses: the
+6.8 MeV on P_c(4312)⁺. The strategy was validated on ensembles of
six-dimensional amplitude-model pseudo-data with and without a broad P_c⁺
and for several J^P assignments. (~1.5 min)
-->

---
clicks: 1
space: { at: [58, 2, -30], dist: 16, yaw: 22, pitch: 12, dim: 0.75, stops: [Pc(4337)] }
---

# Masses and thresholds

<img src="/figures/pc_thresholds.svg" class="stage mx-auto plate" style="height: 252px" alt="Pentaquark masses and widths against charmed-baryon anticharmed-meson thresholds" />

<div class="caption mt-sm" style="max-width: none">Five narrow states lie within 20 MeV of a Σ<sub>c</sub>D̄⁽*⁾ or Ξ<sub>c</sub>D̄⁽*⁾ threshold. For P<sub>c</sub>(4312)⁺ and P<sub>c</sub>(4457)⁺ the threshold lies within the peak, so a bound and a virtual state both fit. P<sub>c</sub>(4337)⁺, evidence in B<sub>s</sub>⁰ → J/ψ p <span class="ol">p</span>, lies 13 and 20 MeV above the Σ<sub>c</sub>⁺⁺D⁻ and Σ<sub>c</sub>⁺D̄⁰ thresholds.</div>

<div class="src">Thresholds from PDG 2024 masses, charge-consistent pairs; the values, the Σ<sub>c</sub>(2520) pairs and the inputs are on the backup slide · states: LHCb 2015–2022</div>

<!--
Speaker: take this slide slowly; slides 18 and 20 reuse the 5.6 MeV offset. Offsets from charge-consistent pairs, PDG 2024 masses (Σc(2455)⁺ 2452.65, Ξc⁺ 2467.71, Ξc⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85 MeV; inputs on the thresholds backup): Pc(4312)⁺ 5.6 MeV below Σc⁺D̄⁰ (4317.5); Pc(4440)⁺ 19.2 and Pc(4457)⁺ 2.2 MeV below Σc⁺D̄*⁰ (4459.5); Pcs(4338)⁰ 0.8 MeV above Ξc⁺D⁻ (4337.4); Pcs(4459)⁰ 18.5 MeV below Ξc⁰D̄*⁰ (4477.3). LHCb's own words: "approximately 5 and 2 MeV below" (PRL 122 (2019) 222001), "about 20 MeV of binding" (same), "about 19 MeV below Ξc⁰D̄*⁰" (Sci. Bull. 66 (2021) 1278), "at the Ξc⁺D⁻ threshold" (PRL 131 (2023) 031901). The Σc⁺⁺D⁻ and Σc⁺⁺D*⁻ pairs lie 6 and 5 MeV higher (4323.6, 4464.2). The deuteron is bound by 2.2 MeV (m_p + m_n − m_d, PDG 2024 constants). For Pc(4312)⁺ and Pc(4457)⁺ the threshold sits inside the width, so a bound state and a virtual state both fit. LHCb 2019 lists virtual states among the plausible explanations, and JPAC (Fernández-Ramírez et al., PRL 123 (2019) 092001, arXiv:1904.10021) fits the 2019 spectrum with S-matrix amplitudes and finds the pole about 2 MeV above the Σc⁺D̄⁰ threshold on an unphysical sheet, a virtual state; in their words the attraction is 'not strong enough, however, to form a bound state'. Fewer than 1% of their bootstrap fits (0.7%, scattering-length case) turn it into a bound state, and in the effective-range case the pole does not survive decoupling the channels; the effective-range case is preferred only at 1.8σ, and both favour a virtual state. The stop: Pc(4337)⁺, M = 4337 (+7 −4) (+2 −2) MeV, Γ = 29 (+26 −12) (+14 −14) MeV, 3.1–3.7σ depending on the J^P hypothesis, in 797 ± 31 Bs⁰ → J/ψ p p̄ decays (LHCb, PRL 128 (2022) 062001, arXiv:2108.04720); no Pc(4312)⁺ signal in that channel. If confirmed, it does not sit just below a Σc D̄⁽*⁾ threshold as the 2019 states do: Σc⁺⁺D⁻ (4323.6) and Σc⁺D̄⁰ (4317.5) lie 13 and 20 MeV below it, Σc⁺D̄*⁰ 122 MeV above; the nearest threshold above it is χc0 p at 4353.0, 16 MeV up, and with Γ = 29 MeV the Σc⁺⁺D⁻ threshold sits inside the peak. The LHCb paper says only that a compatible J^P = 1/2⁺ state is predicted in the D̄Λc–D̄Σc coupled-channel study of Shen, Rönchen, Meißner and Zou (Chin. Phys. C 42 (2018) 023106); Yan, Peng, Sánchez Sánchez and Pavón Valderrama (arXiv:2108.05306) list χc0 p, D̄Σc and D̄*Λc–D̄Σc coupled-channel readings, while compact-pentaquark papers argue the opposite. Say 'not below a Σc D̄ threshold', not 'no threshold nearby'. (~2 min)
-->

---
clicks: 2
space: { at: [58, 2, -30], dist: 16, yaw: 30, pitch: 12, dim: 0.7, stops: [Pcs(4459), Pcs(4338)] }
---

# Strange partners

<div class="row stage">
<div class="card card-primary pad-tight col-45">

## P<sub>cs</sub>(4459)⁰, evidence (2020)

It appears at 3.1σ in Ξ<sub>b</sub>⁻ → J/ψ Λ K⁻, Runs 1–2, about 19 MeV below the Ξ<sub>c</sub>⁰D̄*⁰ threshold.

</div>
<div class="card card-accent pad-tight col-45">

## P<sub>cs</sub>(4338)⁰, observation (2022)

An amplitude analysis of B⁻ → J/ψ Λ <span class="ol">p</span> finds the state at more than 15σ with J = 1/2; its mass lies at the Ξ<sub>c</sub>⁺D⁻ threshold.

</div>
</div>

<div class="caption mt-sm">Both pictures, molecular and compact, predicted strange partners; these are the first two.</div>

<div class="src">LHCb, Sci. Bull. 66 (2021) 1278 · PRL 131 (2023) 031901 · LHCb now writes P<sub>ψs</sub><sup>Λ</sup>(4459)⁰ and P<sub>ψs</sub><sup>Λ</sup>(4338)⁰ (arXiv:2206.15233)</div>

<!--
Speaker: Pcs(4459)⁰ in Ξb⁻ → J/ψ Λ K⁻, Runs 1–2 (9 fb⁻¹), about 1750 signal decays, a one-dimensional fit to m(J/ψΛ) with the Ξ* reflections modelled, so no J^P: M = 4458.8 ± 2.9 (+4.7 −1.1) MeV, Γ = 17.3 ± 6.5 (+8.0 −5.7) MeV, 3.1σ; a two-peak hypothesis (4454.9 and 4467.8 MeV) is neither confirmed nor refuted; about 19 MeV below Ξc⁰D̄*⁰ (LHCb, Sci. Bull. 66 (2021) 1278, arXiv:2012.10380). Pcs(4338)⁰ in B⁻ → J/ψ Λ p̄, Runs 1–2 (9 fb⁻¹), about 4400 signal candidates, full amplitude analysis: M = 4338.2 ± 0.7 ± 0.4 MeV, Γ = 7.0 ± 1.2 ± 1.3 MeV, significance above 15σ; J = 1/2 with 3/2 excluded, negative parity favoured and positive parity excluded at 90% CL; at the Ξc⁺D⁻ threshold, 0.8 MeV above 4337.4 (LHCb, PRL 131 (2023) 031901, arXiv:2210.10346). The peak sits 3 MeV below the m(J/ψΛ) endpoint, m(B⁻) − m(p) = 4341.1 MeV, which is why the stop figure shows it at the right edge; the 15σ comes from the six-dimensional amplitude fit with the nonresonant Λp̄ and J/ψp̄ terms, and the 1 MeV mass resolution resolves the 7 MeV width. The parent is a B meson rather than a b baryon; a different parent alone is not yet a test of universality. The test is one peak at the same mass in two parents; the only such case so far is the 3.1σ Λb⁰ → J/ψ p π⁻ result of 2016, and B⁻ → J/ψ Λ p̄ ends at m(J/ψ Λ) = 4341 MeV, so it cannot reach Pcs(4459)⁰. That test is programme item 3 on slide 25. Strange partners were predicted before they were seen, as Ξc D̄⁽*⁾ molecules by Xiao, Nieves, Oset (PLB 799 (2019) 135051: Ξc D̄ at 4277, Ξc D̄* at 4430 MeV) and Wang, Meng, Zhu (PRD 101 (2020) 034018: 4319, 4457, 4463 MeV), and as compact diquark states by Ali et al. (JHEP 10 (2019) 256); LHCb cites all three in PRL 131 (2023) 031901, and Sci. Bull. 66 (2021) 1278 also cites Santopinto and Giachino, PRD 96 (2017) 014014. If asked about SU(3): Σc sits in the flavour sextet with Ξc′ and Ωc, so the SU(3) siblings of the Σc D̄⁽*⁾ molecules would be at the Ξc′ D̄⁽*⁾ thresholds; the Ξc D̄⁽*⁾ states come from the antitriplet sector in the coupled-channel models, not from an SU(3) rotation. These are the first two strange states either way. Naming (arXiv:2206.15233): P for pentaquark, ψ for the cc̄ pair plus one s per strange quark, the superscript is the light-quark isospin (Λ: I = 0, N: 1/2, Σ: 1, Δ: 3/2). The old names stay on screen because they match the paper figures at the two stops. (~2 min)
-->

---
layout: section
hideInToc: true
space: { at: [58, 2.3, -14], dist: 15, yaw: -8, pitch: 22 }   # the states below the section title, a higher and more frontal look than the result slides; the models were introduced on the question slide and get their own slides next
---

# What they could be

<!--
Speaker: there are two families of answers, two hadrons or one, and a third
possibility that a peak is kinematic and there is no state at all. The camera
swings round the states while the line is said; the two models, introduced on
the question slide, get their own slides next. (~0.25 min)
-->

---
space:
  at: [52.5, 2.5, 0]
  dist: 12
  yaw: -10
  pitch: 8
  dim: 0.75
---

# Two hadrons bound as a molecule

<div class="row stage">
<div class="col-40">
<img src="/figures/hadron_molecule.svg" style="height: 220px" alt="A Sigma_c D-bar molecule: two hadrons about 1.8 fm apart" />
<div class="caption under-fig">A Σ<sub>c</sub> D̄⁽*⁾ pair is bound by light-meson exchange, as nucleons are. Binding of 2 to 20 MeV puts each mass below its threshold; recombining c and c̄ across two hadrons keeps the states narrow.</div>
</div>
<div class="col-55">

| channel | J<sup>P</sup> | state |
|---|---|---|
| Σ<sub>c</sub> D̄ | 1/2⁻ | P<sub>c</sub>(4312)⁺ |
| Σ<sub>c</sub> D̄* | one 1/2⁻, one 3/2⁻ | P<sub>c</sub>(4440)⁺, P<sub>c</sub>(4457)⁺ |
| Σ<sub>c</sub>* D̄ | 3/2⁻ | candidate near 4380 |
| Σ<sub>c</sub>* D̄* | 1/2⁻, 3/2⁻, 5/2⁻ | none seen |

<div class="caption mt-sm">Seven predicted states. Three seen, one candidate, three missing.</div>
</div>
</div>

<div class="src">Liu et al., PRL 122 (2019) 242001 · Du et al., PRL 124 (2020) 072001</div>

<!--
Speaker: the binding is light-meson exchange (π, ρ, ω, σ), the nuclear force one
level up. One-pion exchange only acts where a D̄* is involved (D̄ → D̄π has no
vertex), so Σc D̄ binds through vector exchange and coupled channels. Isospin
1/2 is attractive, 3/2 repulsive, so the picture gives I = 1/2 without further input.
Weakly bound, hence narrow: to decay to J/ψ p the c and c̄ must recombine
across the two hadrons. Heavy-quark spin symmetry organises the seven S-wave
Σc⁽*⁾ D̄⁽*⁾ states in the table (Liu et al., PRL 122 (2019) 242001, arXiv:1903.11560; Du et al., PRL 124 (2020) 072001, arXiv:1910.11846). Which of Pc(4440)⁺ and Pc(4457)⁺ is the 1/2⁻ depends on the sign of one spin-dependent term. Liu et al. give both orderings (scenario A: Pc(4440)⁺ = 1/2⁻, Pc(4457)⁺ = 3/2⁻; B reversed) and prefer A, calling the preference 'probably not particularly strong'; Du et al., with one-pion exchange, find Pc(4440)⁺ = 3/2⁻ and Pc(4457)⁺ = 1/2⁻. A measurement settles it (slide 25, not here). The "candidate near 4380" is the narrow Σc* D̄ hint in the Du et al.
fit of the 2019 spectrum, not the broad 2015 Pc(4380)⁺ (M = 4380 ± 8 ± 29 MeV,
Γ = 205 ± 18 ± 86 MeV, PRL 115 (2015) 072001). Binding energies from the
observed masses: Pc(4312)⁺ sits 5.6 MeV below Σc⁺ D̄⁰ (PDG 2024 masses);
the deuteron's 2.2 MeV is the comparison planted on slide 7. Review: Guo et al.,
RMP 90 (2018) 015004. Open issues, in speech only: the binding energies depend
on the regulator and are not first-principles numbers; a state far from every
threshold would have no place in this picture. (~1.75 min)
-->

---
space:
  at: [66, 2.0, 0]
  dist: 10
  yaw: 20
  pitch: 8
  dim: 0.8
---

# One hadron: compact or hadrocharmonium

<div class="row stage">
<div class="col-45">
<img src="/figures/hadron_compact.svg" style="height: 188px" alt="A compact five-quark state" />
<div class="caption under-fig"><b>Compact.</b> [cu][ud]c̄ is held together by colour–spin forces at the size of an ordinary hadron. It fills SU(3) multiplets with isospin-3/2 partners, needs no threshold nearby, and allows positive parity.</div>
</div>
<div class="col-45">
<img src="/figures/hadron_hadrocharmonium.svg" style="height: 188px" alt="Hadrocharmonium: a c c-bar core in a light-quark cloud" />
<div class="caption under-fig"><b>Hadrocharmonium.</b> A compact cc̄ core (χ<sub>c0</sub> or ψ(2S)) sits inside a light-quark cloud, held by the QCD van der Waals force. The core itself decays to J/ψ and the cloud becomes the proton; the cc̄ never splits, so open charm and η<sub>c</sub> p are suppressed. P<sub>c</sub>(4312)⁺ would be 1/2⁺.</div>
</div>
</div>

<div class="src">Maiani, Polosa, Riquer, PLB 749 (2015) 289 · Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151</div>

<!--
Speaker: the compact picture. Diquark–diquark–antiquark, [cu][ud]c̄ (Maiani,
Polosa, Riquer, PLB 749 (2015) 289, arXiv:1507.04980): two colour-antitriplet
diquarks and an antiquark bound by colour–spin forces, an ordinary hadron with five constituents, the size of an ordinary hadron, under 1 fm (proton rms charge radius 0.84 fm, PDG 2024, slide 7). Lebed's diquark–triquark [cq][c̄qq]
(PLB 749 (2015) 454, arXiv:1507.05867) is a different clustering with different
spin couplings; one sentence, no more. Both give full SU(3) multiplets
including isospin-3/2 partners, none of which has been observed; there is no
reason for the masses to lie at thresholds, and the widths come out large
unless tuned. Hadrocharmonium (Dubynskiy and Voloshin, PLB 666 (2008) 344; applied to the Pc states by Eides, Petrov and Polyakov): a compact cc̄ seed
held in a light-quark cloud by the QCD analogue of the van der Waals force.
Pc(4440)⁺ and Pc(4457)⁺ as ψ(2S) p with 1/2⁻ and 3/2⁻; Pc(4312)⁺ as χc0 p with
J^P = 1/2⁺ and about 42 MeV of binding (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151). Decays are
dominated by hidden charm through the seed, so open charm is suppressed
(Eides, Petrov, PRD 98 (2018) 114037), and ηc p needs a heavy-quark spin flip and is suppressed
too. This picture has a direct decay test, on slide 21. Positive parity for Pc(4312)⁺ separates it from the S-wave molecule of slide 18. (~1.5 min)
-->

---
space:
  at: interiors
  dist: 14
  yaw: 30
  pitch: 10
---

# Cusp or pole

<div class="row stage">
<img src="/figures/lineshapes_cusp_vs_pole.svg" class="col-55 plate" alt="A threshold cusp peaking at the threshold and a pole 5.6 MeV below it" />
<div class="col-40">
<div class="caption">A pure cusp is no particle: the rate rises where the Σ<sub>c</sub>⁺D̄⁰ channel opens, with no pole behind it, so it peaks exactly at the threshold. P<sub>c</sub>(4312)⁺ peaks 5.6 MeV below, within its 10 MeV width and its +6.8 MeV mass systematic. JPAC's fit reads the spectrum as a pole, more likely virtual than bound: an attraction, short of binding.</div>
<div class="caption mt-sm">The triangle candidate for P<sub>c</sub>(4457)⁺, Λ<sub>c</sub>(2595)⁺D̄⁰ at 4457.1 MeV, describes LHCb's 2019 data worse than a Breit–Wigner.</div>
</div>
</div>

<div class="src">Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001 · LHCb, PRL 122 (2019) 222001</div>

<!--
Speaker: the third possibility, a peak with no state behind it. Threshold cusp:
when a channel opens the amplitude has a square-root branch point; the peak
sits at the threshold, its lineshape is fixed by the channel, and it needs
strong coupling to be visible at all. Σc⁺ D̄⁰ opens at 4317.5 MeV (PDG 2024: 2452.65 + 1864.84); Pc(4312)⁺ has a Breit–Wigner mass of 4311.9 ± 0.7 (+6.8 −0.6) MeV and Γ = 9.8 ± 2.7 MeV (PRL 122 (2019) 222001), 5.6 MeV below the threshold, but the +6.8 MeV systematic (from fits with interfering resonances) puts the threshold inside the peak, so the position alone does not exclude a cusp. What argues against a purely kinematical cusp is JPAC's lineshape fit: it needs an attractive Σc⁺D̄⁰ interaction, and its preferred pole is a virtual state at about 4320 MeV on the fourth sheet, which shows up in the data as an enhancement at the threshold; cusp and pole are not exclusive, the question is whether an attraction sits behind the cusp.
JPAC's S-matrix fit of the 2019 spectrum (Fernández-Ramírez et al., PRL 123
(2019) 092001, arXiv:1904.10021) reads the peak as a pole and finds a virtual state more likely: it finds no support for a bound molecule, though a bound-state pole is not excluded (in the scattering-length fit 0.7% of bootstrap poles are bound). LHCb itself writes that virtual rather than bound states are among the plausible explanations. Say it as: a pole, more likely virtual than bound; never "a pole is required". The only conclusive phase motion is the 2015 Pc(4450)⁺ Argand loop (PRL 115 (2015) 072001, Fig. 9a); the same six-bin fit for Pc(4380)⁺ (Fig. 9b) shows a large phase change but the paper calls it not conclusive; the 2019 states come from a 1D fit and have no phase (slide 13). Triangle singularities:
three intermediate hadrons on shell at once produce a sharp peak whose
position depends on the production process. The χc1 p threshold at 4448.9 MeV
(PDG 2024: 3510.67 + 938.27) was the 2015 triangle candidate for Pc(4450)⁺
(Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502, arXiv:1507.04950); after the
split the live candidate is Λc(2595)⁺ D̄⁰ at 4457.1 MeV (2592.25 + 1864.84)
for Pc(4457)⁺, which LHCb tested in 2019 against a Breit–Wigner and found to
describe the data worse. No triangle candidate lands at 4312. Kinematic effects can sit on top of poles, so the test is universality: a pole has the same mass in every production channel; a triangle peak moves with the process; a cusp stays pinned to its threshold in every channel, only its strength changes with the production coupling (slide 21). (~1.25 min)
-->

---
space: { at: [70, 2, -34], dist: 16, yaw: 10, pitch: 12, dim: 0.8 }   # off the path, in the dust: the table is the slide
---

# What tells them apart

<div class="plate">
<table class="cmp stage">
<thead><tr><th></th><th>Molecule</th><th>Compact</th><th>Hadrocharmonium</th><th>Cusp or triangle</th></tr></thead>
<tbody>
<tr><th>J<sup>P</sup></th><td>negative parity only</td><td class="key">positive parity too</td><td>1/2⁺ for P<sub>c</sub>(4312)⁺</td><td>set by the channel</td></tr>
<tr><th>Open charm</th><td>large</td><td>allowed</td><td class="key">suppressed</td><td>not fixed</td></tr>
<tr><th>η<sub>c</sub> p / J/ψ p</th><td class="key">≈ 3 for Σ<sub>c</sub>D̄; small for Σ<sub>c</sub>D̄*</td><td>model-dependent</td><td>suppressed</td><td>not fixed</td></tr>
<tr><th>Weinberg Z</th><td class="key">≈ 0: r small, positive</td><td>≈ 1: r large, negative</td><td>≈ 1</td><td>no pole to test</td></tr>
<tr><th>Peak across channels</th><td>same</td><td>same</td><td>same</td><td class="key">triangle moves; cusp at threshold</td></tr>
</tbody>
</table>
</div>

<div class="caption mt-sm">Filled cells: the prediction that separates each picture.</div>

<div class="src">Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007</div>

<!--
Speaker: walk one row only, the ηc p row. The Weinberg row is the number of slide 8, a and r at the Σc D̄ threshold: Z ≈ 0 for a molecule, ≈ 1 for a compact state or a hadrocharmonium with respect to that channel; a pure cusp has no pole to test. Heavy-quark spin symmetry for the Σc D̄ molecule, Pc(4312)⁺ with J^P = 1/2⁻, gives Γ(ηc p) ≈ 3 Γ(J/ψ p) (Voloshin, PRD 100 (2019) 034020, eq. 8; Sakai, Jing, Guo, PRD 100 (2019) 074007). For the Σc D̄* state with 1/2⁻, whichever of Pc(4440)⁺ and Pc(4457)⁺ it is, the same symmetry gives Γ(ηc p)/Γ(J/ψ p) = 3/25 (Voloshin, eq. 11), and for the 3/2⁻ state ηc p is forbidden in S-wave. Phase space and binding move these by a few tens of percent. Hadrocharmonium built on a
ψ(2S) or χc0 seed suppresses ηc p because the decay needs a heavy-quark spin
flip, and a χc0 p seed gives Pc(4312)⁺ positive parity, 1/2⁺ (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151). Open charm: a molecule decays predominantly to
Λc D̄⁽*⁾; in hadrocharmonium open charm is suppressed, though less strongly
than hidden charm is suppressed in a molecule (Eides, Petrov, PRD 98 (2018) 114037). Compact diquark states admit positive parity through an
orbital excitation (Maiani, Polosa, Riquer, PLB 749 (2015) 289). A pole sits at the same mass in every production channel; a triangle peak depends on the process; a cusp stays at its threshold in every process, so for it the test is the lineshape and whether the peak shows up in channels that couple to Σc D̄, not the position (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502; Guo et al., RMP 90 (2018) 015004). Isospin-3/2
partners, widths and magnetic moments are on the backup comparison table
(Chen et al., Phys. Rept. 639 (2016) 1). (~1.5 min)
-->

---
space: { at: [76.2, 0.5, -2], dist: 13, yaw: -18, pitch: 6, dim: 0.45 }   # the decay in the right half, the text in the left
---

# Where the neutrals go missing

<div class="row stage">
<div class="card card-primary pad-tight col-45">

## Σ<sub>c</sub>⁺D̄⁽*⁾⁰ always decays with a π⁰ or γ

Σ<sub>c</sub>⁺ → Λ<sub>c</sub>⁺π⁰; D̄*⁰ → D̄⁰π⁰ or D̄⁰γ. The pair that P<sub>c</sub>(4312)⁺ and P<sub>c</sub>(4457)⁺ sit just below leaves a soft π⁰ or γ in every decay.

</div>
</div>

<div class="caption mt-sm col-45">LHCb has observed the isospin partner, <span style="white-space: nowrap">Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺D⁽*⁾⁻K⁻</span>. The Λ<sub>b</sub>⁰ flight direction and mass fix one missing π⁰ or γ up to a two-fold ambiguity; the Σ<sub>c</sub>⁺ or D̄*⁰ mass resolves it. The LHCb Vilnius group is working on this recovery.</div>

<div class="src">LHCb, PRL 122 (2019) 222001 · LHCb, PRD 110 (2024) L031104 · PDG 2024</div>

<!--
Speaker: the tracks in the world are Λb⁰ → Σc⁺ D̄*⁰ K⁻ with the two neutrals
drawn dashed because the detector does not reconstruct them. Thresholds: LHCb quotes Pc(4312)⁺ and
Pc(4457)⁺ "approximately 5 MeV and 2 MeV below the Σc⁺D̄⁰ and Σc⁺D̄*⁰
thresholds" and Pc(4440)⁺ with about 20 MeV of binding (PRL 122 (2019)
222001); the Σc⁺⁺D⁽*⁾⁻ thresholds lie about 5 MeV higher (PDG 2024: Σc⁺D̄⁰
4317.5, Σc⁺⁺D⁻ 4323.6, Σc⁺D̄*⁰ 4459.5, Σc⁺⁺D*⁻ 4464.2 MeV). If asked: the
+6.8 and +4.1 MeV upward systematics on the masses exceed the gaps to the
neutral thresholds, so "below" is not established at 1σ for Pc(4312)⁺ and
Pc(4457)⁺. Decay chains (PDG 2024): Σc(2455) → Λc⁺ π is the only open strong
decay, so Σc⁺ → Λc⁺ π⁰ (p* = 94 MeV/c); the electromagnetic Λc⁺ γ mode is allowed but unmeasured, and it too leaves a neutral; D*(2007)⁰ → D⁰ π⁰ (64.7 ±
0.9)% or D⁰ γ (35.3 ± 0.9)%, D⁺ π⁻ closed. Unreconstructed neutrals per
charge channel of Λb⁰ → Σc D̄⁽*⁾ K⁻: Σc⁺⁺D⁻ none; Σc⁺⁺D*⁻ none in 67.7%
(D̄⁰ π⁻), one otherwise; Σc⁺D̄⁰ one, always; Σc⁺D̄*⁰ two, always. Say "no
unreconstructed neutral", not "fully charged": the D̄⁰ is neutral but
reconstructed. What LHCb has observed: Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻, Run 2, 6 fb⁻¹,
four modes, 480 ± 25 / 279 ± 26 / 243 ± 17 / 116 ± 15 decays, 32σ to 9σ;
B(Σc⁺⁺D⁻K⁻)/B(Λc⁺D̄⁰K⁻) = 0.282 ± 0.016 ± 0.016 ± 0.005; the paper calls
O(100) candidates per mode too few for an amplitude analysis and does not
search for Pc states (PRD 110 (2024) L031104). The Σc⁺D̄⁽*⁾⁰ K⁻ channel is
not reconstructed there, so the open-charm test at the thresholds the 2019
paper quotes has so far been done in the isospin partner; that reading is
mine. Recovering the neutral: one missing particle of known mass is three
unknowns; the Λb⁰ flight direction from the primary and decay vertices gives
two equations, the Λb⁰ mass a third, quadratic in |p(Λb⁰)|, so two
solutions. LHCb has used this for a missing neutrino: |Vub| from
Λb⁰ → p μ ν, q² up to a two-fold ambiguity, resolutions about 1 and 4 GeV²
(Nature Phys. 11 (2015) 743); Λb⁰ → Λc⁺ μ ν shape (PRD 96 (2017) 112005),
Eq. 6. The intermediate mass, m(Σc⁺) on Λc⁺ π⁰ or m(D̄*⁰) on D̄⁰ π⁰/γ, is a
fourth equation for the same three unknowns: one overconstraint, the case a
decay-tree fit handles if the tree is not under-constrained (Hulsbergen, NIM
A 552 (2005) 566). That fourth-constraint step is general kinematics, not a
published LHCb analysis. Why the calorimeter route is hard: analyses cut on
photon pT at 200 to 250 MeV/c and the resolved π⁰ mass resolution is about
8 MeV/c² (IJMPA 30 (2015) 1530022; LHCb-PROC-2015-009), while these π⁰ and
γ are soft. The LHCb Vilnius group is working on the recovery; in progress,
no numbers. (~1.25 min)
-->

---
layout: section
hideInToc: true
space: { at: future }
---

# What Run 3 will measure

<!--
Speaker: say nothing beyond the title. The camera flies right, past the last
station, onto the empty floor grid: this is where the next states go. (~0.25 min)
-->

---
space: { at: future, yaw: -20 }
---

# Run 3 is complete

<div class="row stage">
<img src="/figures/lhcb_lumi.svg" class="col-55" alt="LHCb recorded luminosity: Runs 1–2 and the three Run 3 years" />
<div class="card card-primary pad-tight col-40">

## 26.7 fb⁻¹, 2024–26

Run 3 recorded all of it with a software trigger: three times the 9 fb⁻¹ behind every pentaquark result since 2019. The LHC is in Long Shutdown 3. What remains is analysis, and the amplitude fit is the slow step.

</div>
</div>

<div class="src">LHCb recorded luminosity, Run 3 pp 2024–26; 2022–23 commissioning (under 2 fb⁻¹) not shown</div>

<!--
Speaker: per year: 2024 9.56 fb⁻¹ (LHCb, Comput. Softw. Big Sci. 9 (2025) 15, Sec. 2.4), 2025 11.8 fb⁻¹ recorded (LHCb, 11 Nov 2025; CERN quotes 12.6 fb⁻¹ delivered), 2026 5.34 fb⁻¹ (LHCb, 27 May 2026); sum 26.7 fb⁻¹. Last pp collisions 16 May 2026 (proton programme closed 19 May), last beams 27 June; LS3 from 29 June 2026 (CERN). The largest sample behind any pentaquark result is the 9 fb⁻¹ of Runs 1–2 (PRL 122 (2019) 222001; Sci. Bull. 66 (2021) 1278; PRL 128 (2022) 062001; PRL 131 (2023) 031901); the 2015 observation and the 2016 J/ψ p π⁻ evidence used Run 1 only, 3 fb⁻¹ (PRL 115 (2015) 072001; PRL 117 (2016) 082003). 26.7/9 = 2.97, hence the factor three. The Run 3 detector triggers fully in software
(LHCb Upgrade I, JINST 19 (2024) P05065), and at 13.6 TeV the Λb⁰ yield gain
is larger than the factor three in luminosity; do not quote a yield. An
amplitude analysis is a multidimensional fit of interfering resonances with a
model built per channel, and each takes person-years. No amplitude analysis of the Runs
1–2 J/ψ p K⁻ sample has been published; the J^P of the three narrow states are
unmeasured. (~1.25 min)
-->

---
space: { at: future, yaw: -10 }
---

# Three amplitude analyses

<ol class="prog stage">
<li><span class="n">1</span><span class="m">J<sup>P</sup> of the three narrow states, the coupling phases, and Weinberg's Z from the Σ<sub>c</sub>D̄ lineshape</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ p K⁻, Runs 1–3</span></li>
<li><span class="n">2</span><span class="m">Predicted doubly strange states</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ · Ω<sub>b</sub>⁻ → J/ψ Ξ⁰ K⁻ · B⁻ → J/ψ Ξ⁻ Λ̄</span></li>
<li><span class="n">3</span><span class="m">Decays, and the same peak in other parents</span><span class="ch">Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ · η<sub>c</sub> p · Λ<sub>b</sub>⁰ → J/ψ p π⁻ · B<sub>s</sub>⁰ → J/ψ p <span class="ol">p</span></span></li>
</ol>

<div class="closing">All three use data already recorded; none is published on Run 3.</div>

<div class="src">LHCb, EPJC 85 (2025) 812 · LHCb, PRD 110 (2024) L031104 · names as in arXiv:2206.15233</div>

<!--
Speaker: Item 1. In the molecular picture heavy-quark spin symmetry fixes the multiplet, not which of the two Σc D̄* states is the 1/2⁻: that depends on the sign of one spin-spin term. The pionless contact-range fit of Liu et al. (PRL 122 (2019) 242001) weakly prefers Pc(4440)⁺ = 1/2⁻, Pc(4457)⁺ = 3/2⁻; with one-pion exchange the reversed ordering is as likely (Valderrama, PRD 100 (2019) 094028) and Du et al. (PRL 124 (2020) 072001) get the reverse; a 2026 contact-range study using heavy-quark spin and antiquark–diquark symmetry favours the Liu ordering, with stated uncertainties (arXiv:2605.13344). Hadrocharmonium (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151) gives the same order, Pc(4440)⁺ = 1/2⁻ and Pc(4457)⁺ = 3/2⁻, as on slide 19, from the ratio of total widths, so the Liu ordering would not separate molecule from hadrocharmonium; the reversed ordering would contradict the hadrocharmonium width argument. The same fit gives the parity of Pc(4312)⁺, which separates the two pictures: 1/2⁻ for the Σc D̄ molecule, 1/2⁺ for a χc0 p seed. A 2026 two-channel Flatté refit of the published Runs 1–2
spectrum gives scattering parameters compatible with a molecular interpretation when the couplings are real, and that conclusion is less robust once the
relative coupling phases float (arXiv:2608.25106): only a full amplitude
analysis of Λb⁰ → J/ψ p K⁻ gives the phases. This is the only place the J^P
ordering is said. Item 2. Λb⁰ → J/ψ Ξ⁻ K⁺ was first observed by CMS on 140 fb⁻¹ (EPJC 84 (2024) 1062, arXiv:2401.16303). LHCb then observed Ξb⁰ → J/ψ Ξ⁻ π⁺ for the first time and measured the Λb⁰ → J/ψ Ξ⁻ K⁺ branching fraction four times more precisely on 5.4 fb⁻¹ of 2016–18 data: 84 ± 10 and 107 ± 12 decays, both above 10σ (EPJC 85 (2025) 812, arXiv:2501.12779); the paper states that an amplitude analysis needs the larger Run 3 samples; the predicted
Pcss state of width about 10 MeV is narrower than the present resolution
(Roca, Song, Oset, arXiv:2509.19840); heavy-pentaquark chiral perturbation theory predicts an isodoublet Pψss^N(4379) and an isovector Pψs^Σ(4367), both J^P = 1/2⁻, and proposes the J/ψ Ξ spectra of Ωb⁻ → J/ψ Ξ⁰ K⁻ (Pψss^N(4379)⁰) and B⁻ → J/ψ Ξ⁻ Λ̄ (Pψss^N(4379)⁻) for the former; the Σ state would need a J/ψ Σ final state, and the paper names no channel for it (Li and Li, JHEP 11 (2025) 149). Item 3. Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻, observed in 2024 (PRD 110 (2024) L031104, arXiv:2404.19510), is the direct open-charm channel of the molecular
picture; ηc p is reconstructed through ηc → p p̄; Λb⁰ → J/ψ p π⁻ gave 3.1σ evidence in 2016 for the exotic contributions taken together, Pc(4380)⁺, Pc(4450)⁺ and Zc(4200)⁻; the two Pc states alone reach 3.3σ only if Zc(4200)⁻ is assumed negligible (PRL 117 (2016) 082003); Bs⁰ → J/ψ p p̄
reaches only 4429 MeV, shows no Pc(4312)⁺ (p-value 0.5 per the paper) and 3.1–3.7σ evidence for Pc(4337)⁺ instead (PRL 128 (2022) 062001). A pole has the same mass in every
channel; a triangle depends on the production process. Prompt-production
rates are a further, model-dependent handle; do not lead with them. Close with the line on screen: all three use data already recorded; none is published on Run 3. That is the Startertalk's
purpose. (~2.25 min)
-->

---
layout: fact
space:
  at: future
  pitch: 14
  dist: 12
---

# One hadron or two

The J<sup>P</sup> and decays of the pentaquarks, and which family members exist, will settle whether five quarks bind as two hadrons, like the deuteron, or as one, like the proton.

<!--
Speaker: one sentence, then stop. Which of the predicted states exist, with which J^P and which decays, shows whether QCD binds five quarks the way it binds a deuteron (two hadrons, 2.2 MeV of binding, PDG 2024) or the way it binds a proton (one volume, charge radius 0.84 fm, PDG 2024). This closes the question posed on slide 7. The data are recorded. (~0.5 min)
-->

---
layout: statement
space: { at: [-26.5, -3.4, 0], dist: 15.5, yaw: -22, pitch: 2, sway: 9 }   # the hero cluster above the centred text
---

# Thank you

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<!--
Speaker: questions. Hadron dates and masses in the records are from
P. Koppenburg's list (LHCb-FIGURE-2021-001 and updates, CC BY 4.0), credited on
the references backups. The world is back at the hero pose, and the cluster assembles again as the camera lands. Backups follow in this order: thresholds with the PDG inputs, the full seven-row comparison, the six lineshapes, six quarks, related LHCb results, references on two slides with every entry a link (all titled Backup). (~0.25 min)
-->

---
hideInToc: true
class: backup
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }
---

# Backup: thresholds

| pair | threshold (MeV) | state | offset (MeV) |
|---|---|---|---|
| Σ<sub>c</sub>⁺D̄⁰ | 4317.5 | P<sub>c</sub>(4312)⁺ | −5.6 |
| Σ<sub>c</sub>(2520)⁺D̄⁰ | 4382.2 | P<sub>c</sub>(4380)⁺, broad candidate | not quoted |
| Σ<sub>c</sub>⁺D̄*⁰ | 4459.5 | P<sub>c</sub>(4440)⁺, P<sub>c</sub>(4457)⁺ | −19.2, −2.2 |
| Σ<sub>c</sub>(2520)⁺D̄*⁰ | 4524.3 | none | none |
| Ξ<sub>c</sub>⁺D⁻ / Ξ<sub>c</sub>⁰D̄⁰ | 4337.4 / 4335.3 | P<sub>cs</sub>(4338)⁰ | +0.8 |
| Ξ<sub>c</sub>⁰D̄\*⁰ / Ξ<sub>c</sub>⁺D\*⁻ | 4477.3 / 4478.0 | P<sub>cs</sub>(4459)⁰ | −18.5 |
| Λ<sub>c</sub>(2595)⁺D̄⁰ | 4457.1 | triangle candidate, P<sub>c</sub>(4457)⁺ | +0.2 |
| χ<sub>c1</sub> p | 4448.9 | triangle candidate, 2015 P<sub>c</sub>(4450)⁺ | +0.9 |

<div class="src">PDG 2024: Σ<sub>c</sub>(2455)⁺ 2452.65, Σ<sub>c</sub>(2455)⁺⁺ 2453.97, Σ<sub>c</sub>(2520)⁺ 2517.4, Ξ<sub>c</sub>⁺ 2467.71, Ξ<sub>c</sub>⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85, D*⁻ 2010.26, Λ<sub>c</sub>(2595)⁺ 2592.25, χ<sub>c1</sub> 3510.67, p 938.27 MeV · Σ<sub>c</sub>⁺⁺D⁻ 4323.6 and Σ<sub>c</sub>⁺⁺D*⁻ 4464.2 lie 6 and 5 MeV higher</div>

<!--
Speaker: backup for the question "which charge combination did you use". Every threshold is the sum of two PDG 2024 masses for a charge-consistent pair: Σc⁺D̄⁰ = 2452.65 + 1864.84 = 4317.5; Σc(2520)⁺D̄⁰ = 2517.4 + 1864.84 = 4382.2; Σc⁺D̄*⁰ = 2452.65 + 2006.85 = 4459.5; Σc(2520)⁺D̄*⁰ = 2517.4 + 2006.85 = 4524.3; Ξc⁺D⁻ = 2467.71 + 1869.66 = 4337.4 and Ξc⁰D̄⁰ = 2470.44 + 1864.84 = 4335.3; Ξc⁰D̄*⁰ = 2470.44 + 2006.85 = 4477.3 and Ξc⁺D*⁻ = 2467.71 + 2010.26 = 4478.0; Λc(2595)⁺D̄⁰ = 2592.25 + 1864.84 = 4457.1; χc1 p = 3510.67 + 938.27 = 4448.9. The other isospin partner of each non-strange pair, Σc⁺⁺D⁻ (4323.6) and Σc⁺⁺D*⁻ (4464.2), lies 6 and 5 MeV higher, so the offsets quoted in the talk are the smaller ones. Offsets are M(state) − threshold with the state masses from the LHCb papers: Pc(4312)⁺ 4311.9, Pc(4440)⁺ 4440.3, Pc(4457)⁺ 4457.3 (PRL 122 (2019) 222001); Pc(4450)⁺ 4449.8 (PRL 115 (2015) 072001); Pcs(4338)⁰ 4338.2 (PRL 131 (2023) 031901); Pcs(4459)⁰ 4458.8 (Sci. Bull. 66 (2021) 1278). The strange offsets are quoted against Ξc⁺D⁻ and Ξc⁰D̄*⁰, LHCb's own choices in those papers. Pc(4337)⁺ is not in the table: it sits above the Σc D̄ thresholds (Σc⁺⁺D⁻ 4323.6 and Σc⁺D̄⁰ 4317.5, 13 and 20 MeV below it), not below one, which is the point made on slide 15. The two triangle rows are thresholds used as kinematic candidates, the χc1 p one for the 2015 Pc(4450)⁺ (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502) and the Λc(2595)⁺D̄⁰ one for Pc(4457)⁺ (tested by LHCb in PRL 122 (2019) 222001). No offset is quoted for Pc(4380)⁺: its mass is 4380 ± 8 ± 29 MeV and its width 205 MeV, and the 2015 paper states that no threshold lies close to it (PRL 115 (2015) 072001); the Σc(2520)⁺D̄⁰ row stays because it is the Σc* D̄ channel of slide 18, where the narrow candidate near 4380 in the Du et al. fit is a different object from the broad 2015 state. (~0 min)
-->

---
hideInToc: true
class: backup wide-table
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }   # explicit, so a jump here from any slide lands on the grid
---

# Backup: the full comparison

| observable | Molecule | Compact | Hadrocharmonium | Cusp or triangle |
|---|---|---|---|---|
| J<sup>P</sup> | 1/2⁻, 3/2⁻ (S-wave; 5/2⁻ for Σ<sub>c</sub>\*D̄\*) | many, positive parity too | 1/2⁺ (χ<sub>c0</sub> p); 1/2⁻, 3/2⁻ (ψ(2S) p) | set by the channel (Λ<sub>c</sub>(2595)⁺D̄⁰ triangle: 1/2⁺) |
| Widths | narrow, about 10 MeV | broad unless tuned | narrow | set by kinematics |
| Open charm Λ<sub>c</sub> D̄⁽*⁾ | dominant | allowed | suppressed; hidden charm dominates | not fixed |
| Γ(η<sub>c</sub> p) / Γ(J/ψ p) | ≈ 3 (Σ<sub>c</sub>D̄, 1/2⁻); ≈ 0.1 (Σ<sub>c</sub>D̄*, 1/2⁻); 0 (3/2⁻) | model-dependent | suppressed | not fixed |
| Weinberg Z (a, r at the Σ<sub>c</sub>D̄ threshold) | ≈ 0: a ≈ R, r small and positive | ≈ 1: r large and negative | ≈ 1 with respect to Σ<sub>c</sub>D̄ | no pole to test |
| Isospin-3/2 partners | none expected | predicted | none | none |
| Peak position across channels | same | same | same | cusp at threshold; triangle moves |
| Magnetic moments | differ from compact in sign and size | differ from molecule | not computed | none |

<div class="src">Chen et al., Phys. Rept. 639 (2016) 1 · Sakai, Jing, Guo, PRD 100 (2019) 074007 · full list on the References slide</div>

<!--
Speaker: the eight-row version of slide 21; the Weinberg row is slide 8 (Weinberg, Phys. Rev. 137 (1965) B672; with a width, Baru et al., PLB 586 (2004) 53; range and virtual states, Matuschek et al., EPJA 57 (2021) 101). Rows 1 to 6 are amplitude-analysis observables in data already recorded; magnetic moments need polarisation observables and are further off. Row by row: J^P, S-wave Σc D̄⁽*⁾ molecules give only 1/2⁻ and 3/2⁻; the Σc* D̄* member of the multiplet adds a 5/2⁻ state, not seen (Liu et al., PRL 122 (2019) 242001; Du et al., PRL 124 (2020) 072001); compact diquark states fill SU(3) multiplets with positive-parity members (Maiani, Polosa, Riquer, PLB 749 (2015) 289); hadrocharmonium puts Pc(4312)⁺ on a χc0 seed with 1/2⁺ and Pc(4440)⁺, Pc(4457)⁺ on a ψ(2S) seed with 1/2⁻, 3/2⁻ (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151). Widths: a molecule bound by a few MeV is large, so decays to hidden charm, which need the c and c̄ to recombine across two hadrons, are suppressed and the observed widths of order 10 MeV fit (Eides, Petrov, PRD 98 (2018) 114037); compact widths come out large unless a barrier is tuned in, because nothing keeps the c and c̄ apart (PDG 2024, Pentaquarks review, Karliner and Skwarnicki); cusp and triangle widths follow from the kinematics (Guo et al., RMP 90 (2018) 015004). Open charm: molecules decay predominantly to Λc D̄⁽*⁾; in hadrocharmonium open charm is suppressed, less strongly than hidden charm is suppressed in a molecule (Eides, Petrov, PRD 98 (2018) 114037). ηc p over J/ψ p: heavy-quark spin symmetry gives about 3 for the Σc D̄ 1/2⁻ molecule, 3/25 for the Σc D̄* 1/2⁻ state and zero in S-wave for the Σc D̄* 3/2⁻ state (Voloshin, PRD 100 (2019) 034020, eqs. 8 and 11; Sakai, Jing, Guo, PRD 100 (2019) 074007, whose coupled-channel numbers give 2.9 to 4.0 for Pc(4312)⁺); hadrocharmonium on a ψ(2S) or χc0 seed needs a heavy-quark spin flip, so ηc p is suppressed. Isospin-3/2 partners exist only in the compact multiplets; the I = 3/2 Σc D̄ channel is repulsive in the molecular picture. Peak position: a pole sits at the same mass in every production channel and so does a cusp, at its threshold; only a triangle singularity moves with the process (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502). A cusp or triangle carries the S-wave J^P of its rescattering channel; for Pc(4457)⁺ the Λc(2595)⁺D̄⁰ triangle gives 1/2⁺ (LHCb, PRL 122 (2019) 222001). Magnetic moments: molecular and compact assignments differ in sign and size; Özdem's compact-current sum rules give negative moments for the 1/2⁻ Pc states, the molecular currents positive ones (arXiv:2603.19151; EPJC 81 (2021) 277); no hadrocharmonium calculation exists. (~0 min)
-->

---
hideInToc: true
class: backup
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }
---

# Backup: what a peak can be

<LineshapeGallery />

<div class="src">Flatté, PLB 63 (1976) 224 · Guo, Hanhart, Meißner et al., RMP 90 (2018) 015004 · Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502 · Λ(1520) reflection: PDG 2024 masses, isotropic decay, Λ<sub>b</sub>⁰ → J/ψ p K⁻ kinematics</div>

<!--
Speaker: backup for the question "could it be a cusp / a triangle / a reflection". Six mechanisms on one axis, computed, not sketched. Top row: an
isolated pole; a pole pinned under a threshold (Flatté), narrow, with a kink
where the channel opens; a cusp with no pole at all, which peaks exactly at
the threshold with the phase still at zero. Bottom row: a triangle
singularity, a log branch point whose position is set by the loop masses and
moves with the production process; the same Breit–Wigner on a coherent
background at three phases, a peak, an asymmetric shoulder, a dip; and the
Λ(1520) → pK⁻ reflection, sixteen MeV wide in m(pK), five hundred MeV wide in
m(J/ψ p), straight across the P_c masses. Only the first two have a pole. The
phase at the peak, marked on each inset, is what separates them, and a
one-dimensional mass fit never measures it. (~0 min)
-->

---
hideInToc: true
class: backup
space: { at: [84.5, 0.8, -2], dist: 9, yaw: 10, pitch: 6, dim: 0.35 }
---

# Backup: six quarks

<div class="row stage">
<div class="card card-accent pad-tight col-50">

## The deuteron is the six-quark bound state we know

It is bound by 2.22 MeV. Lattice QCD predicts heavy dibaryons bound by tens of MeV: Ω<sub>c</sub>Ω<sub>cc</sub>, Ω<sub>b</sub>Ω<sub>bb</sub>, Ω<sub>ccb</sub>Ω<sub>cbb</sub>. The d*(2380) claim is disputed. At LHCb, the Λ<sub>c</sub>⁺Λ̄<sub>c</sub>⁻ spectrum in B⁰ → Λ<sub>c</sub>⁺Λ̄<sub>c</sub>⁻K⁰<sub>S</sub> shows no significant structure.

</div>
</div>

<div class="src">PDG 2024 · Junnarkar, Mathur, PRL 123 (2019) 162003 · LHCb, PRD 114 (2026) 012012</div>

<!--
Speaker: backup, for the question "and six quarks?". The six-quark cluster in the world is a schematic.
The one we know: the deuteron, m_p + m_n − m_d = 2.224 566 MeV from the PDG
2024 constants table; PDG has no dibaryon or hexaquark listing.
Terms: dibaryon = two baryons, baryon number 2; baryonium = baryon and
antibaryon, baryon number 0. Claimed: d*(2380), WASA-at-COSY, pn → d π⁰ π⁰,
a Lorentzian energy dependence consistent with a resonance I(J^P) = 0(3⁺)
(PRL 106 (2011) 242302, a title with a question mark); polarised np
scattering adds a pole at (2380 ± 10 − i 40 ± 5) MeV in the ³D₃–³G₃ waves
(PRL 112 (2014) 202301; PRC 90 (2014) 035204), and the fusion cross sections give M ≈ 2380 MeV, Γ ≈ 70 MeV (the pole width is 2 × 40 = 80 MeV).
Status: one experimental programme plus A2@MAMI photoproduction (same lead
authors), not in the PDG, and contested: Molina, Ikeno and Oset reproduce the
peak with sequential single-pion production and a triangle singularity
(Chin. Phys. C 47 (2023) 041001), Bashkanov, Clement and Skorodko reply
(arXiv:2106.00494); HAL QCD lattice at heavy pion masses finds a ΔΔ ⁷S₃
quasi-bound state (PLB 811 (2020) 135935), qualitative support only.
Predicted: binding grows with quark mass. Lattice QCD (Junnarkar and Mathur, PRL 123
(2019) 162003): J^P = 1⁺ dibaryons ΩcΩcc at 6381(20) MeV, 26(9) MeV below
the spin-1/2 threshold; ΩbΩbb at 16004(17) and ΩccbΩcbb at 19105(21) MeV,
also bound, so stable against strong and electromagnetic decay. ΩcccΩccc
(Lyu et al., PRL 127 (2021) 072003): bound by 5.7 MeV without Coulomb, near
unitarity with it. Molecular models: ΞccΞcc loosely bound in one-boson
exchange, 0.6 to 18 MeV depending on the cutoff (Meng, Li, Zhu, PRD 95
(2017) 114019). What LHCb could measure, my speculation: a charmed dibaryon
needs two charm baryons in one event, and σ(Ξcc⁺⁺)·B/σ(Λc⁺) is
2.2 × 10⁻⁴ (Chin. Phys. C 44 (2020) 022001), so pairs of doubly charmed baryons are too rare to search for; ALICE's femtoscopy of p–Ω⁻ and p–Ξ⁻ pairs (Nature 588 (2020) 232)
could in principle be tried on Λc–p or Λc–Λc pairs here, not done.
Established, baryon number 0: B̄s⁰ → Λc⁺Λ̄c⁻ observed at 6.2σ and evidence for
B̄⁰ → Λc⁺Λ̄c⁻ (PRL 136 (2026) 061802), two-body, so no spectrum; B⁰ →
Λc⁺Λ̄c⁻K⁰S on 5.4 fb⁻¹ shows no significant structure in m(Λc⁺Λ̄c⁻), while its Λc⁺K⁰S system gives 3.9σ evidence for Ξc(2923)⁺ and Ξc(2939)⁺ (PRD 114
(2026) 012012). Belle's threshold enhancement in e⁺e⁻ → Λc⁺Λ̄c⁻ at 4634 MeV
(PRL 101 (2008) 172001) is not seen by BESIII (PRL 131 (2023) 191901). The
Cabibbo-favoured Λb⁰ → Λc⁺Λ̄c⁻Λ is closed (threshold 5688.6 MeV against
5619.6), so charmed baryon–antibaryon pairs at LHCb come from B mesons.
Close: sixty years after (qqqqq̄), the six-quark list is the deuteron plus
predictions. (~0 min)
-->

---
hideInToc: true
class: backup
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }   # back to the grid after the six-quark station
---

# Backup: related LHCb results

- 2016: a model-independent analysis confirms that Λ* reflections alone cannot describe the data. PRL 117 (2016) 082002
- 2016: Λ<sub>b</sub>⁰ → J/ψ p π⁻ gives 3.1σ evidence for the exotic contributions taken together. PRL 117 (2016) 082003
- 2022: B<sub>s</sub>⁰ → J/ψ p <span class="ol">p</span> contains P<sub>c</sub>(4337)⁺ at 3.1–3.7σ and no P<sub>c</sub>(4312)⁺. PRL 128 (2022) 062001
- 2024: Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ is observed. PRD 110 (2024) L031104
- 2024–25: Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ (CMS) and Ξ<sub>b</sub>⁰ → J/ψ Ξ⁻ π⁺ (LHCb) are observed. CMS, EPJC 84 (2024) 1062 · LHCb, EPJC 85 (2025) 812
- Ceilings: m(J/ψ p) cannot exceed 4341 MeV in B⁰ → J/ψ p <span class="ol">p</span> or 4429 MeV in B<sub>s</sub>⁰ → J/ψ p <span class="ol">p</span>.

<div class="src">Ceilings from PDG 2024 masses, m(B⁰) − m(p) and m(B<sub>s</sub>⁰) − m(p) · both decays first observed on 5.2 fb⁻¹: LHCb, PRL 122 (2019) 191804</div>

<!--
Speaker: hidden backup, not spoken. The results an LHCb room will ask about
that the main line skips. 2016 confirmation: model-independent analysis of
Λb⁰ → J/ψ p K⁻ on Run 1 (3 fb⁻¹); the Λ* reflections alone are rejected at
more than 9σ (LHCb, PRL 117 (2016) 082002, arXiv:1604.05708). 2016 second
channel: Λb⁰ → J/ψ p π⁻, Cabibbo-suppressed, 3.1σ evidence for exotic
contributions taken together (LHCb, PRL 117 (2016) 082003, arXiv:1606.06999).
2022: Bs⁰ → J/ψ p p̄ on Runs 1–2 (9 fb⁻¹), 797 ± 31 signal decays; the
Pc(4337)⁺ significance is 3.1–3.7σ depending on the J^P hypothesis; the fit
finds no Pc(4312)⁺ contribution, p-value 0.5 as quoted in the slide-25 note
(LHCb, PRL 128 (2022) 062001, arXiv:2108.04720). 2024: Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ observed, the open-charm final state that a Σc D̄⁽*⁾ molecule would feed (LHCb, PRD 110 (2024) L031104, arXiv:2404.19510). 2024: CMS observes Λb⁰ → J/ψ Ξ⁻ K⁺ on 140 fb⁻¹ (EPJC 84 (2024) 1062, arXiv:2401.16303). 2025: LHCb observes Ξb⁰ → J/ψ Ξ⁻ π⁺ and measures Λb⁰ → J/ψ Ξ⁻ K⁺ on 5.4 fb⁻¹, 84 ± 10 and 107 ± 12 decays; no amplitude analysis yet (EPJC 85 (2025) 812, arXiv:2501.12779). Ceilings from PDG 2024: m(B⁰) − m(p) = 5279.72 − 938.272 = 4341.4 MeV; m(Bs⁰) − m(p) = 5366.93 − 938.272 = 4428.7 MeV; so neither B → J/ψ p p̄
channel can reach Pc(4440)⁺ (4440.3 MeV) or Pc(4457)⁺ (4457.3 MeV, both PRL 122 (2019) 222001). Both B⁰ → J/ψ p p̄ and Bs⁰ → J/ψ p p̄ were first observed by LHCb on 5.2 fb⁻¹ (PRL 122 (2019) 191804, arXiv:1902.05588). (~0 min)
-->

---
hideInToc: true
class: backup
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }   # explicit, so a jump here from any slide lands on the grid
---

# Backup: references I

<div class="refs">
<div class="ref-group">
<b>LHCb</b>
<ul>
<li><span class="tag">P<sub>c</sub>(4380)⁺, P<sub>c</sub>(4450)⁺</span> <a href="https://doi.org/10.1103/PhysRevLett.115.072001" target="_blank" rel="noopener">PRL 115 (2015) 072001</a> <a class="arx" href="https://arxiv.org/abs/1507.03414" target="_blank" rel="noopener">1507.03414</a></li>
<li><span class="tag">model-independent</span> <a href="https://doi.org/10.1103/PhysRevLett.117.082002" target="_blank" rel="noopener">PRL 117 (2016) 082002</a> <a class="arx" href="https://arxiv.org/abs/1604.05708" target="_blank" rel="noopener">1604.05708</a></li>
<li><span class="tag">J/ψ p π⁻</span> <a href="https://doi.org/10.1103/PhysRevLett.117.082003" target="_blank" rel="noopener">PRL 117 (2016) 082003</a> <a class="arx" href="https://arxiv.org/abs/1606.06999" target="_blank" rel="noopener">1606.06999</a></li>
<li><span class="tag">B → J/ψ p <span class="ol">p</span></span> <a href="https://doi.org/10.1103/PhysRevLett.122.191804" target="_blank" rel="noopener">PRL 122 (2019) 191804</a> <a class="arx" href="https://arxiv.org/abs/1902.05588" target="_blank" rel="noopener">1902.05588</a></li>
<li><span class="tag">three narrow states</span> <a href="https://doi.org/10.1103/PhysRevLett.122.222001" target="_blank" rel="noopener">PRL 122 (2019) 222001</a> <a class="arx" href="https://arxiv.org/abs/1904.03947" target="_blank" rel="noopener">1904.03947</a></li>
<li><span class="tag">P<sub>cs</sub>(4459)⁰</span> <a href="https://inspirehep.net/literature?q=j%20Sci.Bull.%2C66%2C1278" target="_blank" rel="noopener">Sci. Bull. 66 (2021) 1278</a> <a class="arx" href="https://arxiv.org/abs/2012.10380" target="_blank" rel="noopener">2012.10380</a></li>
<li><span class="tag">P<sub>c</sub>(4337)⁺</span> <a href="https://doi.org/10.1103/PhysRevLett.128.062001" target="_blank" rel="noopener">PRL 128 (2022) 062001</a> <a class="arx" href="https://arxiv.org/abs/2108.04720" target="_blank" rel="noopener">2108.04720</a></li>
<li><span class="tag">P<sub>cs</sub>(4338)⁰</span> <a href="https://doi.org/10.1103/PhysRevLett.131.031901" target="_blank" rel="noopener">PRL 131 (2023) 031901</a> <a class="arx" href="https://arxiv.org/abs/2210.10346" target="_blank" rel="noopener">2210.10346</a></li>
<li><span class="tag">Λ<sub>b</sub>⁰ → Σ<sub>c</sub>D̄K</span> <a href="https://doi.org/10.1103/PhysRevD.110.L031104" target="_blank" rel="noopener">PRD 110 (2024) L031104</a> <a class="arx" href="https://arxiv.org/abs/2404.19510" target="_blank" rel="noopener">2404.19510</a></li>
<li><span class="tag">J/ψ Ξ⁻ K⁺</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.C%2C85%2C812" target="_blank" rel="noopener">EPJC 85 (2025) 812</a> <a class="arx" href="https://arxiv.org/abs/2501.12779" target="_blank" rel="noopener">2501.12779</a></li>
<li><span class="tag">J/ψ Ξ⁻ K⁺ first</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.C%2C84%2C1062" target="_blank" rel="noopener">CMS, EPJC 84 (2024) 1062</a> <a class="arx" href="https://arxiv.org/abs/2401.16303" target="_blank" rel="noopener">2401.16303</a></li>
<li><span class="tag">Λ<sub>c</sub>⁺Λ̄<sub>c</sub>⁻</span> <a href="https://doi.org/10.1103/PhysRevLett.136.061802" target="_blank" rel="noopener">PRL 136 (2026) 061802</a> <a class="arx" href="https://arxiv.org/abs/2511.20476" target="_blank" rel="noopener">2511.20476</a></li>
<li><span class="tag">Λ<sub>c</sub>⁺Λ̄<sub>c</sub>⁻K⁰<sub>S</sub></span> <a href="https://doi.org/10.1103/PhysRevD.114.012012" target="_blank" rel="noopener">PRD 114 (2026) 012012</a> <a class="arx" href="https://arxiv.org/abs/2604.15040" target="_blank" rel="noopener">2604.15040</a></li>
<li><span class="tag">|V<sub>ub</sub>|</span> <a href="https://inspirehep.net/literature?q=j%20Nature%20Phys.%2C11%2C743" target="_blank" rel="noopener">Nature Phys. 11 (2015) 743</a> <a class="arx" href="https://arxiv.org/abs/1504.01568" target="_blank" rel="noopener">1504.01568</a></li>
<li><span class="tag">Λ<sub>c</sub>⁺ μ ν</span> <a href="https://doi.org/10.1103/PhysRevD.96.112005" target="_blank" rel="noopener">PRD 96 (2017) 112005</a> <a class="arx" href="https://arxiv.org/abs/1709.01920" target="_blank" rel="noopener">1709.01920</a></li>
<li><span class="tag">naming</span> <a href="https://arxiv.org/abs/2206.15233" target="_blank" rel="noopener">LHCb-PUB-2022-013</a></li>
<li><span class="tag">detector</span> <a href="https://inspirehep.net/literature?q=j%20JINST%2C3%2CS08005" target="_blank" rel="noopener">JINST 3 (2008) S08005</a></li>
<li><span class="tag">Upgrade I</span> <a href="https://inspirehep.net/literature?q=j%20JINST%2C19%2CP05065" target="_blank" rel="noopener">JINST 19 (2024) P05065</a></li>
<li><span class="tag">review</span> <a href="https://inspirehep.net/literature?q=j%20Ann.Rev.Nucl.Part.Sci.%2C74%2C583" target="_blank" rel="noopener">Johnson, Polyakov, Skwarnicki, Wang, Ann. Rev. Nucl. Part. Sci. 74 (2024) 583</a> <a class="arx" href="https://arxiv.org/abs/2403.04051" target="_blank" rel="noopener">2403.04051</a></li>
</ul>
</div>
<div class="ref-group">
<b>Data</b>
<ul>
<li><span class="tag">Θ⁺</span> <a href="https://doi.org/10.1103/PhysRevLett.91.012002" target="_blank" rel="noopener">LEPS, PRL 91 (2003) 012002</a></li>
<li><span class="tag">d*(2380)</span> <a href="https://doi.org/10.1103/PhysRevLett.106.242302" target="_blank" rel="noopener">WASA-at-COSY, PRL 106 (2011) 242302</a></li>
<li><a href="https://doi.org/10.1103/PhysRevLett.112.202301" target="_blank" rel="noopener">WASA-at-COSY, PRL 112 (2014) 202301</a></li>
<li><span class="tag">X(3872)</span> <a href="https://doi.org/10.1103/PhysRevLett.91.262001" target="_blank" rel="noopener">Belle, PRL 91 (2003) 262001</a></li>
<li><span class="tag">Z(4430)⁺</span> <a href="https://doi.org/10.1103/PhysRevLett.100.142001" target="_blank" rel="noopener">Belle, PRL 100 (2008) 142001</a></li>
<li><span class="tag">Z<sub>c</sub>(3900)⁺</span> <a href="https://doi.org/10.1103/PhysRevLett.110.252001" target="_blank" rel="noopener">BESIII, PRL 110 (2013) 252001</a></li>
<li><a href="https://doi.org/10.1103/PhysRevLett.110.252002" target="_blank" rel="noopener">Belle, PRL 110 (2013) 252002</a></li>
<li><span class="tag">masses, reviews</span> <a href="https://pdg.lbl.gov/" target="_blank" rel="noopener">PDG 2024 and the 2025 update</a></li>
<li><a href="https://pdg.lbl.gov/2008/" target="_blank" rel="noopener">PDG 2008, review “Pentaquarks”</a></li>
<li><span class="tag">LHCb-FIGURE-2021-001</span> <a href="https://www.nikhef.nl/~pkoppenb/particles.html" target="_blank" rel="noopener">P. Koppenburg, List of hadrons observed at the LHC (CC BY 4.0)</a></li>
<li><a href="https://lhcb-public.web.cern.ch/" target="_blank" rel="noopener">LHCb public luminosity plots</a></li>
</ul>
</div>
</div>

<!--
Speaker: hidden backup, not spoken. Every LHCb result cited on a slide, in
the HUD or in a note, and the data sources; each entry is a link: APS papers
by DOI, arXiv ids to arXiv, the rest to an INSPIRE journal lookup. Journal
style where a journal reference exists, arXiv id after it. (~0 min)
-->

---
hideInToc: true
class: backup
space: { at: future, dist: 14, yaw: -40, pitch: 10, dim: 0.85 }   # explicit, so a jump here from any slide lands on the grid
---

# Backup: references II

<div class="refs">
<div class="ref-group">
<b>Theory</b>
<ul>
<li><span class="tag">1964</span> <a href="https://inspirehep.net/literature?q=j%20Phys.Lett.%2C8%2C214" target="_blank" rel="noopener">Gell-Mann, Phys. Lett. 8 (1964) 214</a></li>
<li><a href="https://cds.cern.ch/record/352337" target="_blank" rel="noopener">Zweig, CERN-TH-401 (1964)</a></li>
<li><a href="https://inspirehep.net/literature?q=reportnumber%3ACERN-TH-412" target="_blank" rel="noopener">Zweig, CERN-TH-412 (1964)</a></li>
<li><span class="tag">Z</span> <a href="https://doi.org/10.1103/PhysRev.137.B672" target="_blank" rel="noopener">Weinberg, Phys. Rev. 137 (1965) B672</a></li>
<li><span class="tag">Z with a width</span> <a href="https://inspirehep.net/literature?q=j%20Phys.Lett.B%2C586%2C53" target="_blank" rel="noopener">Baru et al., PLB 586 (2004) 53</a> <a class="arx" href="https://arxiv.org/abs/hep-ph/0308129" target="_blank" rel="noopener">hep-ph/0308129</a></li>
<li><span class="tag">Z, range, virtual</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.A%2C57%2C101" target="_blank" rel="noopener">Matuschek, Baru, Guo, Hanhart, EPJA 57 (2021) 101</a> <a class="arx" href="https://arxiv.org/abs/2007.05329" target="_blank" rel="noopener">2007.05329</a></li>
<li><span class="tag">molecules</span> <a href="https://doi.org/10.1103/RevModPhys.90.015004" target="_blank" rel="noopener">Guo et al., RMP 90 (2018) 015004</a> <a class="arx" href="https://arxiv.org/abs/1705.00141" target="_blank" rel="noopener">1705.00141</a></li>
<li><a href="https://doi.org/10.1103/RevModPhys.90.015003" target="_blank" rel="noopener">Olsen, Skwarnicki, Zieminska, RMP 90 (2018) 015003</a> <a class="arx" href="https://arxiv.org/abs/1708.04012" target="_blank" rel="noopener">1708.04012</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Phys.Rept.%2C639%2C1" target="_blank" rel="noopener">Chen et al., Phys. Rept. 639 (2016) 1</a> <a class="arx" href="https://arxiv.org/abs/1601.02092" target="_blank" rel="noopener">1601.02092</a></li>
<li><span class="tag">HQSS multiplet</span> <a href="https://doi.org/10.1103/PhysRevLett.122.242001" target="_blank" rel="noopener">Liu et al., PRL 122 (2019) 242001</a> <a class="arx" href="https://arxiv.org/abs/1903.11560" target="_blank" rel="noopener">1903.11560</a></li>
<li><a href="https://doi.org/10.1103/PhysRevLett.124.072001" target="_blank" rel="noopener">Du et al., PRL 124 (2020) 072001</a> <a class="arx" href="https://arxiv.org/abs/1910.11846" target="_blank" rel="noopener">1910.11846</a></li>
<li><span class="tag">virtual state</span> <a href="https://doi.org/10.1103/PhysRevLett.123.092001" target="_blank" rel="noopener">Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001</a> <a class="arx" href="https://arxiv.org/abs/1904.10021" target="_blank" rel="noopener">1904.10021</a></li>
<li><span class="tag">η<sub>c</sub> p</span> <a href="https://doi.org/10.1103/PhysRevD.100.034020" target="_blank" rel="noopener">Voloshin, PRD 100 (2019) 034020</a> <a class="arx" href="https://arxiv.org/abs/1907.01476" target="_blank" rel="noopener">1907.01476</a></li>
<li><a href="https://doi.org/10.1103/PhysRevD.100.074007" target="_blank" rel="noopener">Sakai, Jing, Guo, PRD 100 (2019) 074007</a> <a class="arx" href="https://arxiv.org/abs/1907.03414" target="_blank" rel="noopener">1907.03414</a></li>
<li><span class="tag">hadrocharmonium</span> <a href="https://doi.org/10.1103/PhysRevD.98.114037" target="_blank" rel="noopener">Eides, Petrov, PRD 98 (2018) 114037</a> <a class="arx" href="https://arxiv.org/abs/1811.01691" target="_blank" rel="noopener">1811.01691</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Mod.Phys.Lett.A%2C35%2C2050151" target="_blank" rel="noopener">Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151</a> <a class="arx" href="https://arxiv.org/abs/1904.11616" target="_blank" rel="noopener">1904.11616</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Phys.Lett.B%2C666%2C344" target="_blank" rel="noopener">Dubynskiy, Voloshin, PLB 666 (2008) 344</a> <a class="arx" href="https://arxiv.org/abs/0803.2224" target="_blank" rel="noopener">0803.2224</a></li>
<li><a href="https://doi.org/10.1103/PhysRevD.100.094028" target="_blank" rel="noopener">Valderrama, PRD 100 (2019) 094028</a> <a class="arx" href="https://arxiv.org/abs/1907.05294" target="_blank" rel="noopener">1907.05294</a></li>
<li><span class="tag">compact</span> <a href="https://inspirehep.net/literature?q=j%20Phys.Lett.B%2C749%2C289" target="_blank" rel="noopener">Maiani, Polosa, Riquer, PLB 749 (2015) 289</a> <a class="arx" href="https://arxiv.org/abs/1507.04980" target="_blank" rel="noopener">1507.04980</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Phys.Lett.B%2C749%2C454" target="_blank" rel="noopener">Lebed, PLB 749 (2015) 454</a> <a class="arx" href="https://arxiv.org/abs/1507.05867" target="_blank" rel="noopener">1507.05867</a></li>
<li><span class="tag">triangle</span> <a href="https://doi.org/10.1103/PhysRevD.92.071502" target="_blank" rel="noopener">Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502</a> <a class="arx" href="https://arxiv.org/abs/1507.04950" target="_blank" rel="noopener">1507.04950</a></li>
<li><span class="tag">dibaryons</span> <a href="https://doi.org/10.1103/PhysRevLett.123.162003" target="_blank" rel="noopener">Junnarkar, Mathur, PRL 123 (2019) 162003</a> <a class="arx" href="https://arxiv.org/abs/1906.06054" target="_blank" rel="noopener">1906.06054</a></li>
<li><a href="https://doi.org/10.1103/PhysRevLett.127.072003" target="_blank" rel="noopener">Lyu et al., PRL 127 (2021) 072003</a> <a class="arx" href="https://arxiv.org/abs/2102.00181" target="_blank" rel="noopener">2102.00181</a></li>
<li><a href="https://doi.org/10.1103/PhysRevD.95.114019" target="_blank" rel="noopener">Meng, Li, Zhu, PRD 95 (2017) 114019</a> <a class="arx" href="https://arxiv.org/abs/1704.01009" target="_blank" rel="noopener">1704.01009</a></li>
<li><span class="tag">decay-tree fit</span> <a href="https://inspirehep.net/literature?q=j%20Nucl.Instrum.Meth.A%2C552%2C566" target="_blank" rel="noopener">Hulsbergen, NIM A 552 (2005) 566</a> <a class="arx" href="https://arxiv.org/abs/physics/0503191" target="_blank" rel="noopener">physics/0503191</a></li>
<li><span class="tag">P<sub>ψss</sub></span> <a href="https://inspirehep.net/literature?q=j%20JHEP%2C2511%2C149" target="_blank" rel="noopener">H.-S. Li, T. Li, JHEP 11 (2025) 149</a> <a class="arx" href="https://arxiv.org/abs/2502.05495" target="_blank" rel="noopener">2502.05495</a></li>
<li><a href="https://arxiv.org/abs/2509.19840" target="_blank" rel="noopener">Roca, Song, Oset</a> <a class="arx" href="https://arxiv.org/abs/2509.19840" target="_blank" rel="noopener">2509.19840</a></li>
<li><a href="https://arxiv.org/abs/2605.13344" target="_blank" rel="noopener">Yıldırım</a> <a class="arx" href="https://arxiv.org/abs/2605.13344" target="_blank" rel="noopener">2605.13344</a></li>
<li><span class="tag">Flatté refit</span> <a href="https://arxiv.org/abs/2608.25106" target="_blank" rel="noopener">Atangana Likéné et al.</a> <a class="arx" href="https://arxiv.org/abs/2608.25106" target="_blank" rel="noopener">2608.25106</a></li>
<li><span class="tag">magnetic moments</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.C%2C81%2C277" target="_blank" rel="noopener">Özdem, EPJC 81 (2021) 277</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20JHEP%2C2602%2C207" target="_blank" rel="noopener">Özdem, JHEP 02 (2026) 207</a> <a class="arx" href="https://arxiv.org/abs/2510.26893" target="_blank" rel="noopener">2510.26893</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.C%2C86%2C359" target="_blank" rel="noopener">Özdem, EPJC 86 (2026) 359</a> <a class="arx" href="https://arxiv.org/abs/2603.19151" target="_blank" rel="noopener">2603.19151</a></li>
</ul>
</div>
<div class="ref-group">
<b>History and method</b>
<ul>
<li><a href="https://doi.org/10.1103/PhysRev.49.519" target="_blank" rel="noopener">Breit, Wigner, Phys. Rev. 49 (1936) 519</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20Phys.Lett.B%2C63%2C224" target="_blank" rel="noopener">Flatté, PLB 63 (1976) 224</a></li>
<li><span class="tag">Θ⁺ predicted</span> <a href="https://inspirehep.net/literature?q=j%20Z.Phys.A%2C359%2C305" target="_blank" rel="noopener">Diakonov, Petrov, Polyakov, Z. Phys. A 359 (1997) 305</a> <a class="arx" href="https://arxiv.org/abs/hep-ph/9703373" target="_blank" rel="noopener">hep-ph/9703373</a></li>
<li><span class="tag">Θ⁺ history</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.H%2C37%2C1" target="_blank" rel="noopener">Hicks, EPJ H 37 (2012) 1</a></li>
<li><span class="tag">look-elsewhere</span> <a href="https://inspirehep.net/literature?q=j%20Eur.Phys.J.C%2C70%2C525" target="_blank" rel="noopener">Gross, Vitells, EPJC 70 (2010) 525</a> <a class="arx" href="https://arxiv.org/abs/1005.1891" target="_blank" rel="noopener">1005.1891</a></li>
<li><a href="https://doi.org/10.1103/RevModPhys.48.S1" target="_blank" rel="noopener">PDG 1976, RMP 48 (1976) S1</a></li>
<li><a href="https://doi.org/10.1103/PhysRevD.45.S1" target="_blank" rel="noopener">PDG 1992, PRD 45 (1992) S1</a></li>
<li><a href="https://inspirehep.net/literature?q=j%20J.Phys.G%2C33%2C1" target="_blank" rel="noopener">PDG 2006, J. Phys. G 33 (2006) 1</a></li>
<li><a href="https://pdg.lbl.gov/" target="_blank" rel="noopener">PDG 2024 (2025 update), review “Pentaquarks” (Karliner, Skwarnicki)</a></li>
</ul>
</div>
</div>

<!--
Speaker: hidden backup, not spoken. Theory, history and method, each entry a
link as on the previous slide. Bare arXiv ids where no journal reference was
verified (2509.19840, 2605.13344, 2608.25106). (~0 min)
-->


