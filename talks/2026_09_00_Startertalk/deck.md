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

<div class="src">Hadron data: P. Koppenburg, List of hadrons observed at the LHC, LHCb-FIGURE-2021-001 and updates (CC BY 4.0)</div>

<!--
Speaker: 30 minutes, one scene throughout: date runs left to right, mass up,
quark family in depth. Three parts: what LHCb found (2015–2022), what the
states could be, what Run 3 will measure. The 2015 paper (LHCb, PRL 115 (2015)
072001, submitted July 2015) turned eleven in July 2026. The credit is Koppenburg's table (LHCb-FIGURE-2021-001 and updates, CC BY 4.0): the LHC hadrons behind the title are his list, laid out as date × mass × quark family. Eight points are added by hand from their own papers: two LHCb evidence states his list omits, Pc(4337)⁺ and Pcs(4459)⁰, and six pre-LHC landmarks, the 1964 quark model, J/ψ, Θ⁺(1540), X(3872), Z(4430)⁺ and Zc(3900)⁺. (~0.5 min)
-->

---
space:
  at: paper
  dim: 0.35          # the page and the cluster are the slide
---

# 1964: five quarks are allowed

<div class="quote-line">“Baryons can now be constructed from quarks by using the combinations (qqq), (qqqqq̄), etc., while mesons are made out of (qq̄), (qqq̄q̄), etc.”</div>

<img src="/figures/quark_model_singlets.svg" class="stage mx-auto mt-sm" style="height: 180px" alt="Meson, baryon, tetraquark and pentaquark as quark clusters" />

<div class="caption mt-sm">Five-quark baryons are in the first quark paper, in the same sentence as qqq. Zweig proposed the same constituents the same year. Neither paper says whether such states bind, or how narrow they are.</div>

<div class="src">Gell-Mann, Phys. Lett. 8 (1964) 214 · Zweig, CERN-TH-401 and CERN-TH-412 (1964)</div>

<!--
Speaker: the sentence on screen is quoted verbatim from Gell-Mann, Phys. Lett.
8 (1964) 214. Zweig's CERN-TH-401 (17 January 1964) and CERN-TH-412 (21 February 1964) propose the
same constituents as "aces"; the five-quark combination on screen is
Gell-Mann's sentence, so credit Zweig for the constituents only. Colour came later (Greenberg's parastatistics, PRL 13 (1964) 598; Han and Nambu, Phys. Rev. 139 (1965) B1006; and after). In 1964 the argument was baryon number: Gell-Mann gives the triplet B = 1/3, so a baryon is qqq plus any number of qq̄ pairs, which is why the figure says nothing about colour singlets. Every baryon found
before 2015 fits qqq (the Λ(1405) and N(1440) puzzles aside). Point at the
empty pentaquark lane running toward the camera: 1964 is the origin star of
the world, and the lane stays empty for fifty years. (~1.25 min)
-->

---
clicks: 1
space:
  at: theta
  stops: [Theta(1540)]
---

# 2003: Θ⁺(1540)

<div class="card card-warning pad-tight col-45">

## Not confirmed

Θ⁺(1540), uudds̄, seen by LEPS in 2003 and by about ten experiments after it. Absent in the high-statistics data of CLAS, Belle and BaBar. PDG 2008: dropped from the Listings.

A peak of tens of events in one mass projection is not enough. A state has to survive a repeat with far more data, and its quantum numbers come only from the full amplitude, with its phase.

</div>

<div class="src">LEPS, PRL 91 (2003) 012002 · PDG 2008, review “Pentaquarks”</div>

<!--
Speaker: LEPS saw a peak near 1540 MeV in γn → K⁺K⁻n: M = 1540 ± 10 MeV,
4.6σ, from tens of events (LEPS, PRL 91 (2003) 012002). Positive reports in
2003–04 from LEPS, DIANA, CLAS, SAPHIR, HERMES, ZEUS and others, each with
samples of tens of events; the CLAS high-statistics runs, Belle and BaBar saw
nothing, and the PDG 2008 review "Pentaquarks" (C.G. Wohl) speaks of "the overwhelming evidence that the claimed pentaquarks do not exist"; the 2008 edition drops the Θ(1540) from the Listings. The lesson for everything that follows: a bump in
one projection can be a reflection, a kinematic effect or a fluctuation; the CLAS repeat of its own γd measurement, at about 30 times the luminosity, saw nothing (PDG 2006 pentaquark update); the 2015 claim was held to a six-dimensional amplitude fit, with phase motion shown for the narrow state, and 2019 repeated it with nine times the data (slide 10).
Click: the stop on Θ⁺(1540); the record reads LEPS, 2003, 1540 ± 10 MeV, not confirmed. Name the hollow ring: every state not established (evidence, candidate, not confirmed, superseded) is drawn hollow throughout the world, and
the pentaquark lane runs on empty to 2015. (~1.25 min including the stop,
≤ 15 s on the record)
-->

---
space:
  at: interiors
  dist: 22
  yaw: -40
  pitch: 12
---

# One hadron or two

<img src="/figures/hadron_pictures_2.svg" class="stage mx-auto" style="height: 240px" alt="Two hadrons about two femtometres apart, and one compact hadron, at a common 1 fm scale" />

<div class="two-col caption mt-sm">
<div><b>Two hadrons.</b> A charmed baryon and an anticharmed meson about two femtometres apart, bound by a few MeV of residual force. Like a deuteron.</div>
<div><b>One hadron.</b> Five quarks in one volume, bound directly by the colour force. Like a proton.</div>
</div>

<div class="caption mt-sm">QCD allows both. The rest of the talk is about telling them apart.</div>

<!--
Speaker: this is the talk's question; say it in one sentence and come back
to it on slide 21. Deuteron: binding energy 2.22 MeV (m_p + m_n − m_d, PDG 2024 constants),
size r ≈ ħc/√(2μE_B) ≈ 4.3 fm for μ = 469.5 MeV, several times the range of
the force. Proton: rms charge radius 0.84 fm (PDG 2024), one volume, no
substructure of hadrons inside. The two panels carry no quark letters and no
channel labels on purpose: do not name Σc D̄ or diquarks here, the physics
labels come on slides 14 and 15. The camera looks back along the date axis
toward the LHC era, with the pentaquark lane empty until 2015. (~1.0 min)
-->

---
space: { at: decay, dist: 16, yaw: -50, pitch: 10 }
---

# Why charm

<div class="card card-primary pad-tight col-50">

Charmed hadrons are heavy, so a pair moves slowly and a weak force can bind it: a charmed baryon and an anticharmed meson by a few MeV, as a proton and a neutron in the deuteron.

Such a state lies just below the pair's threshold, and the threshold is known to a fraction of an MeV.

The LHC makes b hadrons whose decays put cc̄ and light quarks in one place, in large numbers.

</div>

<div class="src">Guo et al., RMP 90 (2018) 015004 · PDG 2024 masses</div>

<!--
Speaker: Heavy hadrons: a Σc D̄ pair has a large reduced mass (μ ≈ 1059 MeV for Σc⁺D̄⁰, against 470 MeV for the deuteron), so the kinetic energy of its relative motion, k²/2μ, is small and a weak residual force (light-meson exchange between the two hadrons) is enough to bind; this is the deuteron mechanism one level up (Törnqvist, Z. Phys. C 61 (1994) 525; Guo, Hanhart, Meißner et al., RMP 90 (2018) 015004, Sec. III). It is the pair's mass that matters, not the charm quark's motion inside one hadron. Thresholds are sharp because the hadron masses are known to a fraction of an MeV: D⁰ 1864.84 ± 0.05 MeV, Σc(2455)⁺ 2452.65 (+0.22 −0.16) MeV (PDG 2024). A state a few MeV below such a threshold is narrow because a decay to J/ψ p needs the c and the c̄ to recombine across two hadrons. Plant the deuteron here for the second time: binding energy 2.22 MeV (m_p + m_n − m_d, PDG 2024 constants), and "bound like a deuteron" is what part two calls a hadronic molecule. The LHC makes b hadrons whose decays put cc̄ and light quarks in one place: 26 000 Λb⁰ → J/ψ p K⁻ decays already in Run 1 (3 fb⁻¹; LHCb, PRL 115 (2015) 072001), and that decay is where the story starts on the next slide. (~1.0 min)
-->

---
layout: section
hideInToc: true
space: { at: decay, dist: 13, yaw: -30, pitch: 8 }
---

# What LHCb found, 2015–2022

<!--
Speaker: one sentence while the camera flies. The hollow ring behind is the Θ⁺(1540) (LEPS, PRL 91 (2003) 012002; not confirmed, PDG 2008). In the tetraquark lane the X(3872) of 2003 (Belle, PRL 91 (2003) 262001) is the first hidden-charm exotic and is still with us; Z(4430)⁺ followed in 2007 (Belle, PRL 100 (2008) 142001) and Zc(3900)⁺ in 2013 (BESIII, PRL 110 (2013) 252001; Belle, PRL 110 (2013) 252002). The pentaquark lane stays empty until 2015. (~0.25 min)
-->

---
space: { at: decay }
---

# Λ<sub>b</sub>⁰ → J/ψ p K⁻

<img src="/figures/lambda_b_decay.svg" class="stage mx-auto" style="height: 300px" alt="Two decay paths of Lambda_b to the J/psi p K final state" />

<div class="caption mt-sm">Two paths lead to the same three particles. The J/ψ p pair carries cc̄uud: five quarks. Λ* → K⁻p resonances feed the same final state and reflect into m(J/ψ p). The fit models both paths and their interference.</div>

<div class="src">About 26 000 Λ<sub>b</sub>⁰ → J/ψ p K⁻ decays in Run 1 (3 fb⁻¹) · LHCb, PRL 115 (2015) 072001</div>

<!--
Speaker: Why LHCb, in speech only: a forward spectrometer built for b hadrons (LHCb, JINST 3 (2008) S08005). The vertex detector resolves the Λb⁰ flight distance from the collision point, the RICH detectors identify the K⁻ and the p, and J/ψ → μ⁺μ⁻ gives a clean trigger. Why this decay: the quark transition is the Cabibbo-favoured b → cc̄s, and a resonance decaying strongly to J/ψ p must have minimal quark content cc̄uud, five quarks (the paper's wording); a three-quark uud baryon reaches J/ψ p only through OZI-suppressed cc̄ creation. Whether a structure in m(J/ψ p) is a resonance at all is what the fit has to establish. The other path, Λb⁰ → J/ψ Λ*, Λ* → K⁻p, ends in the same three particles; its resonances reflect into m(J/ψ p). The interference between the two paths is the whole difficulty and the whole opportunity: it is what gives access to the phase of a J/ψ p amplitude. Sample: 26 007 ± 166 signal decays in Run 1 (3 fb⁻¹), 5.4% background in the signal window (LHCb, PRL 115 (2015) 072001). (~1.25 min)
-->

---
space: { at: decay, yaw: -8 }
---

# What an amplitude analysis fits

<div class="row stage">
<img src="/figures/dalitz_schematic.svg" style="height: 265px" alt="Schematic Dalitz plane: Lambda* bands vertical, pentaquark bands horizontal" />
<img src="/figures/papers/LHCb-PAPER-2015-029_dlz.png" class="paper" style="height: 265px" alt="LHCb 2015 Dalitz plot of Lambda_b to J/psi p K" />
</div>

<div class="caption mt-sm">Λ* resonances make vertical bands in m²(K⁻p). A pentaquark makes a horizontal band in m²(J/ψ p) across the heavier Λ* bands; the boundary keeps it clear of the Λ(1520). The 2015 fit used m(K⁻p) and five decay angles, six dimensions, with complex couplings for every resonance.</div>

<div class="src">Left: schematic, Λ* at PDG masses, P<sub>c</sub> bands at the 2019 LHCb masses, widths exaggerated · Right: LHCb, PRL 115 (2015) 072001, Fig. 5</div>

<!--
Speaker: Left, the pattern; right, the 2015 data. The three horizontal bands on the left are the 2019 states, drawn for orientation; the 2015 data show one band, near 19.5 GeV² in the paper's words. The 2015 fit was six-dimensional: m(K⁻p) and five decay angles (the Λb⁰, Λ* and J/ψ helicity angles and two azimuths, φ_K and φ_μ). Each Λ* is a vertical band with its own spin structure in the angles; a J/ψ p state is a horizontal band that crosses the heavier Λ* bands (at the Λ(1520) mass m(J/ψ p) cannot go below 4501 MeV, so no Pc band reaches it), so its interference with the Λ* amplitudes fixes its phase and its J^P. In the data the bright vertical band at m²(K⁻p) ≈ 2.3 GeV² is the Λ(1520) (mass 1519.42 MeV, PDG 2024 average); the horizontal band the paper places near 19.5 GeV² is the J/ψ p structure: the narrow Pc(4450)⁺ at 4.45² = 19.8 GeV², with the broad Pc(4380)⁺ (19.2 GeV²) under it. This is why a one-dimensional fit to m(J/ψ p) cannot give quantum numbers; that point returns once, on slide 10. The 2015 model: 14 Λ* states, masses and widths fixed to PDG, 146 free helicity couplings (the extended model). Λ* alone does not reproduce the m(J/ψ p) peak, and one added J/ψ p state is not enough; two are. Central values come from the reduced model, 12 Λ* states and 64 couplings, with the two J/ψ p states; the extended model gives the significances, and its differences enter the systematics. Six mass bins and free magnitudes and phases per bin give the Argand test on the next slide. (~1.25 min)
-->

---
clicks: 2
space: { at: states, asof: 2015, stops: [Pc(4380), Pc(4450)] }
---

# 2015: two J/ψ p states

<div class="row stage">
<div class="card card-primary pad-tight col-40">

## Six dimensions, 14 Λ* resonances

Run 1, 26 000 decays. The data are described only with two J/ψ p states added: 9σ and 12σ.

</div>
<img src="/figures/argand_schematic.svg" class="col-55" alt="Argand circle of a Breit–Wigner amplitude in six mass bins, with its lineshape" />
</div>

<div class="caption mt-sm">Schematic: a Breit–Wigner phase turns through 180° across the peak, so the amplitude runs round a circle. LHCb left the P<sub>c</sub>(4450)⁺ amplitude free in six bins across ±Γ; the fitted points follow the circle.</div>

<div class="src">LHCb, PRL 115 (2015) 072001</div>

<!--
Speaker: the numbers stay in the HUD. Run 1 (3 fb⁻¹), 26 007 ± 166 Λb⁰ → J/ψ p K⁻ decays; a six-dimensional amplitude fit (m(Kp) and five angles) with 14 Λ* resonances (the extended model; the reduced 12-state model gives the central values); the data are not described until two J/ψ p states are added. Pc(4380)⁺: M = 4380 ± 8 ± 29 MeV, Γ = 205 ± 18 ± 86 MeV, 9σ. Pc(4450)⁺: M = 4449.8 ± 1.7 ± 2.5 MeV, Γ = 39 ± 5 ± 19 MeV, 12σ. Best fit J^P = (3/2⁻, 5/2⁺); (3/2⁺, 5/2⁻) and (5/2⁺, 3/2⁻) acceptable (LHCb, PRL 115 (2015) 072001, arXiv:1507.03414). The Argand test: the Pc(4450)⁺ amplitude was left free, magnitude and phase, in six bins of m(J/ψ p) across ±Γ, and the six points follow the Breit–Wigner circle anticlockwise. The broad state's loop shows a large phase change, but the amplitude values depend on the Λ* model and the paper calls that study not conclusive. Its later status is on the next slide. Two 2016 checks the Θ⁺ never had: a model-independent analysis shows that Λ* reflections alone cannot describe the data (PRL 117 (2016) 082002, arXiv:1604.05708), and the Cabibbo-suppressed Λb⁰ → J/ψ p π⁻ decay needs exotic contributions at 3.1σ: the two Pc states plus the Zc(4200)⁻ → J/ψ π⁻ together, which the data cannot separate; the Pc pair alone reaches 3.3σ only if the Zc(4200)⁻ is assumed absent, and its rate is consistent with the J/ψ p K⁻ result after Cabibbo suppression (PRL 117 (2016) 082003, arXiv:1606.06999). Stops 15 s each: first the broad state (the paper's m(J/ψ p) projection), then the narrow one (the paper's own Argand diagram). The HUD reads as of 2015: do not say "split" yet; that is the next slide. (~2.25 min)
-->

---
clicks: 3
space: { at: states, yaw: -22, stops: [Pc(4312), Pc(4440), Pc(4457)] }
---

# 2019: three narrow states

<div class="caption">246 000 decays, Runs 1–2 (9 fb⁻¹): nine times the 2015 sample.</div>

<div class="col-60 mt-sm">

| state | M (MeV) | Γ (MeV) | |
|---|---|---|---|
| P<sub>c</sub>(4312)⁺ | 4311.9 ± 0.7 | 9.8 ± 2.7 | new, 7.3σ |
| P<sub>c</sub>(4440)⁺ | 4440.3 ± 1.3 | 20.6 ± 4.9 | P<sub>c</sub>(4450)⁺ resolved |
| P<sub>c</sub>(4457)⁺ | 4457.3 ± 0.6 | 6.4 ± 2.0 | two peaks over one, 5.4σ |

</div>

<div class="caption mt-sm">A one-dimensional fit to m(J/ψ p): no J<sup>P</sup>, no phase.</div>

<div class="src">LHCb, PRL 122 (2019) 222001 · statistical uncertainties only; systematic uncertainties are larger, up to +6.8 MeV on a mass and −10.1 MeV on a width</div>

<!--
Speaker: Run 1 = 3 fb⁻¹ (2011–12), Run 2 = 6 fb⁻¹ (2015–18); about 246 000 Λb⁰ → J/ψ p K⁻ decays (6.4% background), nine times the 2015 sample (LHCb, PRL 122 (2019) 222001, arXiv:1904.03947). The Λ* reflections are reduced by an m(Kp) > 1.9 GeV cut and by cos θ_Pc weighting; the fit is one-dimensional in m(J/ψ p), so there is no amplitude analysis, no J^P and no phase. Say this caveat once, here, and not again until slide 19. Systematic uncertainties (same paper): Pc(4312)⁺ Γ = 9.8 ± 2.7 (+3.7 −4.5) MeV, < 27 MeV at 95% CL; Pc(4440)⁺ Γ = 20.6 ± 4.9 (+8.7 −10.1) MeV; Pc(4457)⁺ Γ = 6.4 ± 2.0 (+5.7 −1.9) MeV; masses 4311.9 ± 0.7 (+6.8 −0.6), 4440.3 ± 1.3 (+4.1 −4.7), 4457.3 ± 0.6 (+4.1 −1.7) MeV. Pc(4312)⁺ is new at 7.3σ; the 2015 Pc(4450)⁺ resolves into Pc(4440)⁺ and Pc(4457)⁺, two peaks preferred over one at 5.4σ; all three narrow: 6 and 10 MeV for Pc(4457)⁺ and Pc(4312)⁺, about 20 MeV for Pc(4440)⁺. The broad Pc(4380)⁺ is neither confirmed nor excluded by this fit. Walk the three stops: one dot (the full spectrum), then two dots 17 MeV apart where one was (the nominal fit with the Σc⁺D̄⁰ and Σc⁺D̄*⁰ lines, then the m(Kp) > 1.9 GeV spectrum with its inset). (~2.25 min)
-->

---
clicks: 1
space: { at: states, dist: 10, yaw: -14, stops: [Pc(4337)] }
---

# Masses and thresholds

<img src="/figures/pc_thresholds.svg" class="stage mx-auto" style="height: 285px" alt="Pentaquark masses and widths against charmed-baryon anticharmed-meson thresholds" />

<div class="caption mt-sm">Five narrow states, each within 20 MeV of a Σ<sub>c</sub>D̄⁽*⁾ or Ξ<sub>c</sub>D̄⁽*⁾ threshold (dashed lines). For P<sub>c</sub>(4312)⁺ and P<sub>c</sub>(4457)⁺ the threshold lies within the peak: bound or virtual is open. P<sub>c</sub>(4337)⁺ (evidence, B<sub>s</sub>⁰ → J/ψ p p̄) lies above the Σ<sub>c</sub>D̄ thresholds, not below one.</div>

<div class="src">Thresholds from PDG 2024 masses, charge-consistent pairs (inputs on the backup slide) · states: LHCb 2015–2022</div>

<!--
Speaker: the most important slide of part one. Offsets from charge-consistent pairs, PDG 2024 masses (Σc(2455)⁺ 2452.65, Ξc⁺ 2467.71, Ξc⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85 MeV; inputs on the thresholds backup): Pc(4312)⁺ 5.6 MeV below Σc⁺D̄⁰ (4317.5); Pc(4440)⁺ 19.2 and Pc(4457)⁺ 2.2 MeV below Σc⁺D̄*⁰ (4459.5); Pcs(4338)⁰ 0.8 MeV above Ξc⁺D⁻ (4337.4); Pcs(4459)⁰ 18.5 MeV below Ξc⁰D̄*⁰ (4477.3). LHCb's own words: "approximately 5 and 2 MeV below" (PRL 122 (2019) 222001), "about 20 MeV of binding" (same), "about 19 MeV below Ξc⁰D̄*⁰" (Sci. Bull. 66 (2021) 1278), "at the Ξc⁺D⁻ threshold" (PRL 131 (2023) 031901). The Σc⁺⁺D⁻ and Σc⁺⁺D*⁻ pairs lie 6 and 5 MeV higher (4323.6, 4464.2). The deuteron is bound by 2.2 MeV (m_p + m_n − m_d, PDG 2024 constants). For Pc(4312)⁺ and Pc(4457)⁺ the threshold sits inside the width, so a bound state and a virtual state both fit: LHCb 2019 lists virtual states among the plausible explanations, and JPAC (Fernández-Ramírez et al., PRL 123 (2019) 092001, arXiv:1904.10021) fits the 2019 spectrum with S-matrix amplitudes and finds the pole about 2 MeV above the Σc⁺D̄⁰ threshold on an unphysical sheet, a virtual state: the attraction is 'not strong enough to form a bound state'. Fewer than 1% of their bootstrap fits (0.7%, scattering-length case) turn it into a bound state, and in the effective-range case the pole does not survive decoupling the channels; the two parametrisations differ only at 1.8σ and both point the same way. The stop: Pc(4337)⁺, M = 4337 (+7 −4) (+2 −2) MeV, Γ = 29 (+26 −12) (+14 −14) MeV, 3.1–3.7σ depending on the J^P hypothesis, in 797 ± 31 Bs⁰ → J/ψ p p̄ decays (LHCb, PRL 128 (2022) 062001, arXiv:2108.04720); no Pc(4312)⁺ signal in that channel. If confirmed, it does not sit just below a Σc D̄⁽*⁾ threshold as the 2019 states do: Σc⁺⁺D⁻ (4323.6) and Σc⁺D̄⁰ (4317.5) lie 13 and 20 MeV below it, Σc⁺D̄*⁰ 122 MeV above; the nearest threshold above it is χc0 p at 4353.0, 16 MeV up, and with Γ = 29 MeV the Σc⁺⁺D⁻ threshold sits inside the peak. The LHCb paper says only that a compatible J^P = 1/2⁺ state is predicted in the D̄Λc–D̄Σc coupled-channel study of Shen, Rönchen, Meißner and Zou (Chin. Phys. C 42 (2018) 023106); Yan, Peng, Sánchez Sánchez and Pavón Valderrama (arXiv:2108.05306) list χc0 p, D̄Σc and D̄*Λc–D̄Σc coupled-channel readings, while compact-pentaquark papers argue the opposite. Say 'not below a Σc D̄ threshold', not 'no threshold nearby'. (~2 min)
-->

---
clicks: 2
space: { at: states, yaw: -26, pitch: 8, stops: [Pcs(4459), Pcs(4338)] }
---

# Strange partners

<div class="row stage">
<div class="card card-primary pad-tight col-45">

## P<sub>cs</sub>(4459)⁰, evidence (2020)

- Ξ<sub>b</sub>⁻ → J/ψ Λ K⁻, Runs 1–2
- 3.1σ; two overlapping peaks not excluded
- About 19 MeV below Ξ<sub>c</sub>⁰D̄*⁰

</div>
<div class="card card-accent pad-tight col-45">

## P<sub>cs</sub>(4338)⁰, observation (2022)

- B⁻ → J/ψ Λ p̄, a B-meson decay
- \> 15σ, full amplitude analysis
- J = 1/2; positive parity excluded at 90% CL
- At the Ξ<sub>c</sub>⁺D⁻ threshold

</div>
</div>

<div class="caption mt-sm">Strange partners were predicted in both pictures, molecular and compact. These are the first two.</div>

<div class="src">LHCb, Sci. Bull. 66 (2021) 1278 · PRL 131 (2023) 031901 · LHCb now writes P<sub>ψs</sub><sup>Λ</sup>(4459)⁰ and P<sub>ψs</sub><sup>Λ</sup>(4338)⁰ (arXiv:2206.15233)</div>

<!--
Speaker: Pcs(4459)⁰ in Ξb⁻ → J/ψ Λ K⁻, Runs 1–2 (9 fb⁻¹), 1750 ± 50 signal decays, itself a six-dimensional amplitude analysis: M = 4458.8 ± 2.9 (+4.7 −1.1) MeV, Γ = 17.3 ± 6.5 (+8.0 −5.7) MeV, 3.1σ; a two-peak hypothesis (4454.9 and 4467.8 MeV) is neither confirmed nor refuted; about 19 MeV below Ξc⁰D̄*⁰ (LHCb, Sci. Bull. 66 (2021) 1278, arXiv:2012.10380). Pcs(4338)⁰ in B⁻ → J/ψ Λ p̄, Runs 1–2 (9 fb⁻¹), about 4400 signal candidates, full amplitude analysis: M = 4338.2 ± 0.7 ± 0.4 MeV, Γ = 7.0 ± 1.2 ± 1.3 MeV, significance above 15σ; J = 1/2 with 3/2 excluded, negative parity favoured and positive parity excluded at 90% CL; at the Ξc⁺D⁻ threshold, 0.8 MeV above 4337.4 (LHCb, PRL 131 (2023) 031901, arXiv:2210.10346). The peak sits 3 MeV below the m(J/ψΛ) endpoint, m(B⁻) − m(p) = 4341.2 MeV, which is why the stop figure shows it at the right edge; the 15σ comes from the six-dimensional amplitude fit with the nonresonant Λp̄ and J/ψp̄ terms, and the 1 MeV mass resolution resolves the 7 MeV width. Found in a B-meson decay: a meson parent, not a b baryon. That is not yet a test of universality. The test is one peak at the same mass in two parents; the only such case so far is the 3.1σ Λb⁰ → J/ψ p π⁻ result of 2016, and B⁻ → J/ψ Λ p̄ ends at m(J/ψ Λ) = 4341 MeV, so it cannot even reach Pcs(4459)⁰. That test is programme item 3 on slide 20. Why they matter: strange partners were predicted before they were seen, as Ξc D̄⁽*⁾ molecules by Xiao, Nieves, Oset (PLB 799 (2019) 135051: Ξc D̄ near 4337, Ξc D̄* near 4479 MeV) and Wang, Meng, Zhu (PRD 101 (2020) 034018: 4319, 4457, 4463 MeV), and as compact diquark states by Ali et al. (JHEP 10 (2019) 256); LHCb cites all three in PRL 131 (2023) 031901, and Sci. Bull. 66 (2021) 1278 also cites Santopinto and Giachino, PRD 96 (2017) 014014. If asked about SU(3): Σc sits in the flavour sextet with Ξc′ and Ωc, so the SU(3) siblings of the Σc D̄⁽*⁾ molecules would be at the Ξc′ D̄⁽*⁾ thresholds; the Ξc D̄⁽*⁾ states come from the antitriplet sector in the coupled-channel models, not from an SU(3) rotation. These are the first two strange states either way. Naming (arXiv:2206.15233): P for pentaquark, ψ for the cc̄ pair plus one s per strange quark, the superscript is the light-quark isospin (Λ: I = 0, N: 1/2, Σ: 1, Δ: 3/2). The old names stay on screen because they match the paper figures at the two stops. (~2 min)
-->

---
layout: section
hideInToc: true
space:
  at: interiors
  dist: 16
  yaw: -30
  pitch: 10
---

# What they could be

<!--
Speaker: two families of answers, two hadrons or one, and a third possibility
that a peak is kinematic and no state at all. From here to slide 17 the camera
orbits the cluster of eight states (yaw −25 → +20); say the line and move on so
the drift reads. (~0.25 min)
-->

---
space:
  at: [59.5, 0, 0]
  dist: 9
  yaw: -20
  pitch: 6
---

# Two hadrons: a molecule

<div class="row stage">
<div class="col-40">
<img src="/figures/hadron_molecule.svg" style="height: 220px" alt="A Sigma_c D-bar molecule: two hadrons about 1.8 fm apart" />
<div class="caption under-fig">Σ<sub>c</sub> D̄⁽*⁾ bound by light-meson exchange, as nucleons are. Binding of 2 to 20 MeV puts each mass below its threshold; recombining c and c̄ across two hadrons keeps the states narrow.</div>
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
Σc⁽*⁾ D̄⁽*⁾ states in the table (Liu et al., PRL 122 (2019) 242001, arXiv:1903.11560; Du et al., PRL 124 (2020) 072001, arXiv:1910.11846). Which of Pc(4440)⁺ and Pc(4457)⁺ is the 1/2⁻ depends on the sign of one spin-dependent term. Liu et al. give both orderings (scenario A: Pc(4440)⁺ = 1/2⁻, Pc(4457)⁺ = 3/2⁻; B reversed) and prefer A, calling the preference 'probably not particularly strong'; Du et al., with one-pion exchange, find Pc(4440)⁺ = 3/2⁻ and Pc(4457)⁺ = 1/2⁻. A measurement settles it (slide 20, not here). The "candidate near 4380" is the narrow Σc* D̄ hint in the Du et al.
fit of the 2019 spectrum, not the broad 2015 Pc(4380)⁺ (M = 4380 ± 8 ± 29 MeV,
Γ = 205 ± 18 ± 86 MeV, PRL 115 (2015) 072001). Binding energies from the
observed masses: Pc(4312)⁺ sits 5.6 MeV below Σc⁺ D̄⁰ (PDG 2024 masses);
the deuteron's 2.2 MeV is the comparison planted on slide 4. Review: Guo et al.,
RMP 90 (2018) 015004. Open issues, in speech only: the binding energies depend
on the regulator and are not first-principles numbers; a state far from every
threshold would have no place in this picture. (~1.75 min)
-->

---
space:
  at: [69, 0, 0]
  dist: 9
  yaw: 15
  pitch: 6
---

# One hadron: compact or hadrocharmonium

<div class="row stage">
<div class="col-45">
<img src="/figures/hadron_compact.svg" style="height: 235px" alt="A compact five-quark state" />
<div class="caption under-fig"><b>Compact.</b> [cu][ud]c̄ held by colour–spin forces, the size of an ordinary hadron. It fills SU(3) multiplets with isospin-3/2 partners, needs no threshold nearby, and allows positive parity.</div>
</div>
<div class="col-45">
<img src="/figures/hadron_hadrocharmonium.svg" style="height: 235px" alt="Hadrocharmonium: a c c-bar core in a light-quark cloud" />
<div class="caption under-fig"><b>Hadrocharmonium.</b> A cc̄ core (χ<sub>c0</sub> or ψ(2S)) held in a light-quark cloud by the QCD van der Waals force. It decays through the seed to J/ψ p; open charm and η<sub>c</sub> p are suppressed. P<sub>c</sub>(4312)⁺ would be 1/2⁺.</div>
</div>
</div>

<div class="src">Maiani, Polosa, Riquer, PLB 749 (2015) 289 · Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151</div>

<!--
Speaker: the compact picture. Diquark–diquark–antiquark, [cu][ud]c̄ (Maiani,
Polosa, Riquer, PLB 749 (2015) 289, arXiv:1507.04980): two colour-antitriplet
diquarks and an antiquark bound by colour–spin forces, an ordinary hadron with five constituents, the size of an ordinary hadron, under 1 fm (proton rms charge radius 0.84 fm, PDG 2024, slide 4). Lebed's diquark–triquark [cq][c̄qq]
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
too. This picture has a direct decay test, on slide 17. Positive parity for Pc(4312)⁺ separates it from the S-wave molecule of slide 14. (~1.5 min)
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
<img src="/figures/lineshapes_cusp_vs_pole.svg" class="col-55" alt="A threshold cusp peaking at the threshold and a pole 5.6 MeV below it" />
<div class="col-40">
<div class="caption">A pure cusp peaks at the threshold. P<sub>c</sub>(4312)⁺ peaks 5.6 MeV below Σ<sub>c</sub>⁺D̄⁰, within its 10 MeV width and its +6.8 MeV mass systematic. JPAC's fit of the spectrum reads it as a pole, more likely virtual than bound.</div>
<div class="caption mt-sm">Triangle candidate for P<sub>c</sub>(4457)⁺, Λ<sub>c</sub>(2595)⁺D̄⁰ at 4457.1 MeV: LHCb's 2019 fit prefers a Breit–Wigner.</div>
</div>
</div>

<div class="src">Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001 · LHCb, PRL 122 (2019) 222001</div>

<!--
Speaker: the third possibility, a peak with no state behind it. Threshold cusp:
when a channel opens the amplitude has a square-root branch point; the peak
sits at the threshold, its lineshape is fixed by the channel, and it needs
strong coupling to be visible at all. Σc⁺ D̄⁰ opens at 4317.5 MeV (PDG 2024: 2452.65 + 1864.84); Pc(4312)⁺ has a Breit–Wigner mass of 4311.9 ± 0.7 (+6.8 −0.6) MeV and Γ = 9.8 ± 2.7 MeV (PRL 122 (2019) 222001), 5.6 MeV below the threshold, but the +6.8 MeV systematic (from fits with interfering resonances) puts the threshold inside the peak, so the position alone does not exclude a cusp. What argues against a purely kinematical cusp is JPAC's lineshape fit: it needs an attractive Σc⁺D̄⁰ interaction, and its preferred pole is a virtual state at about 4320 MeV on the fourth sheet, which shows up in the data as an enhancement at the threshold; cusp and pole are not exclusive, the question is whether an attraction sits behind the cusp.
JPAC's S-matrix fit of the 2019 spectrum (Fernández-Ramírez et al., PRL 123
(2019) 092001, arXiv:1904.10021) reads the peak as a pole and finds a virtual state more likely: it finds no support for a bound molecule, though a bound-state pole is not excluded (in the scattering-length fit 0.7% of bootstrap poles are bound). LHCb itself writes that virtual rather than bound states are among the plausible explanations. Say it as: a pole, more likely virtual than bound; never "a pole is required". The only conclusive phase motion is the 2015 Pc(4450)⁺ Argand loop (PRL 115 (2015) 072001, Fig. 9a); the same six-bin fit for Pc(4380)⁺ (Fig. 9b) shows a large phase change but the paper calls it not conclusive; the 2019 states come from a 1D fit and have no phase (slide 10). Triangle singularities:
three intermediate hadrons on shell at once produce a sharp peak whose
position depends on the production process. The χc1 p threshold at 4448.9 MeV
(PDG 2024: 3510.67 + 938.27) was the 2015 triangle candidate for Pc(4450)⁺
(Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502, arXiv:1507.04950); after the
split the live candidate is Λc(2595)⁺ D̄⁰ at 4457.1 MeV (2592.25 + 1864.84)
for Pc(4457)⁺, which LHCb tested in 2019 against a Breit–Wigner and found to
describe the data worse. No triangle candidate lands at 4312. Kinematic effects can sit on top of poles, so the test is universality: a pole has the same mass in every production channel; a triangle peak moves with the process; a cusp stays pinned to its threshold in every channel, only its strength changes with the production coupling (slide 20). (~1.25 min)
-->

---
space: { at: interiors, dist: 15, yaw: 45, pitch: 12 }
---

# What tells them apart

<table class="cmp stage">
<thead><tr><th></th><th>Molecule</th><th>Compact</th><th>Hadrocharmonium</th><th>Cusp or triangle</th></tr></thead>
<tbody>
<tr><th>J<sup>P</sup></th><td>negative parity only</td><td class="key">positive parity too</td><td>1/2⁺ for P<sub>c</sub>(4312)⁺</td><td>set by the channel</td></tr>
<tr><th>Open charm</th><td>large</td><td>allowed</td><td class="key">suppressed</td><td>not fixed</td></tr>
<tr><th>η<sub>c</sub> p / J/ψ p</th><td class="key">≈ 3 (Σ<sub>c</sub>D̄); ≈ 0.1 (Σ<sub>c</sub>D̄* 1/2⁻); 0 (3/2⁻)</td><td>model-dependent</td><td>suppressed</td><td>not fixed</td></tr>
<tr><th>Peak across channels</th><td>same</td><td>same</td><td>same</td><td class="key">triangle moves; cusp at threshold</td></tr>
</tbody>
</table>

<div class="caption mt-sm">Filled cells: the prediction that separates each picture.</div>

<div class="src">Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007</div>

<!--
Speaker: walk one row only, the ηc p row. Heavy-quark spin symmetry for the Σc D̄ molecule, Pc(4312)⁺ with J^P = 1/2⁻, gives Γ(ηc p) ≈ 3 Γ(J/ψ p) (Voloshin, PRD 100 (2019) 034020, eq. 8; Sakai, Jing, Guo, PRD 100 (2019) 074007). For the Σc D̄* state with 1/2⁻, whichever of Pc(4440)⁺ and Pc(4457)⁺ it is, the same symmetry gives Γ(ηc p)/Γ(J/ψ p) = 3/25 (Voloshin, eq. 11), and for the 3/2⁻ state ηc p is forbidden in S-wave. Phase space and binding move these by a few tens of percent. Hadrocharmonium built on a
ψ(2S) or χc0 seed suppresses ηc p because the decay needs a heavy-quark spin
flip, and a χc0 p seed gives Pc(4312)⁺ positive parity, 1/2⁺ (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151). Open charm: a molecule decays predominantly to
Λc D̄⁽*⁾; in hadrocharmonium open charm is suppressed, though less strongly
than hidden charm is suppressed in a molecule (Eides, Petrov, PRD 98 (2018) 114037). Compact diquark states admit positive parity through an
orbital excitation (Maiani, Polosa, Riquer, PLB 749 (2015) 289). A pole sits at the same mass in every production channel; a triangle peak depends on the process; a cusp stays at its threshold in every process, so for it the test is the lineshape and whether the peak shows up in channels that couple to Σc D̄, not the position (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502; Guo et al., RMP 90 (2018) 015004). Isospin-3/2
partners, widths and magnetic moments are on the backup comparison table
(Chen et al., Phys. Rept. 639 (2016) 1). (~1.5 min)
-->

---
layout: section
hideInToc: true
space: { at: future }
---

# What Run 3 will measure

<!--
Speaker: say nothing beyond the title. The camera flies right, past the 2026
column, onto the empty floor grid: this is where the next states go. (~0.25 min)
-->

---
space: { at: future, yaw: -20 }
---

# Run 3 is complete

<div class="row stage">
<img src="/figures/lhcb_lumi.svg" class="col-55" alt="LHCb recorded luminosity: Runs 1–2 and the three Run 3 years" />
<div class="card card-primary pad-tight col-40">

## The sample is final

26.7 fb⁻¹ recorded with a software trigger, three times the 9 fb⁻¹ behind every result since 2019. The LHC is in Long Shutdown 3. What remains is analysis, and the amplitude fit is the slow step.

</div>
</div>

<div class="src">LHCb recorded luminosity, Run 3 pp 2024–26; 2022–23 commissioning (under 2 fb⁻¹) not shown</div>

<!--
Speaker: per year: 2024 9.56 fb⁻¹ (LHCb, Comput. Softw. Big Sci. 9 (2025) 15, Sec. 2.4), 2025 11.8 fb⁻¹ recorded (LHCb, 11 Nov 2025; CERN quotes 12.6 fb⁻¹ delivered), 2026 5.34 fb⁻¹ (LHCb, 27 May 2026); sum 26.7 fb⁻¹. Last pp collisions 16 May 2026 (proton programme closed 19 May), last beams 27 June; LS3 from 29 June 2026 (CERN). The largest sample behind any pentaquark result is the 9 fb⁻¹ of Runs 1–2 (PRL 122 (2019) 222001; Sci. Bull. 66 (2021) 1278; PRL 128 (2022) 062001; PRL 131 (2023) 031901); the 2015 observation and the 2016 J/ψ p π⁻ evidence used Run 1 only, 3 fb⁻¹ (PRL 115 (2015) 072001; PRL 117 (2016) 082003). 26.7/9 = 2.97, hence the factor three. The Run 3 detector triggers fully in software
(LHCb Upgrade I, JINST 19 (2024) P05065), and at 13.6 TeV the Λb⁰ yield gain
is larger than the factor three in luminosity; do not quote a yield. An
amplitude analysis is a multidimensional fit of interfering resonances with a
model built per channel; person-years each. No amplitude analysis of the Runs
1–2 J/ψ p K⁻ sample has been published; the J^P of the three narrow states are
unmeasured. (~1.25 min)
-->

---
space: { at: future, yaw: -10 }
---

# Three amplitude analyses

<ol class="prog stage">
<li><span class="n">1</span><span class="m">J<sup>P</sup> of the three narrow states, and the coupling phases</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ p K⁻, Runs 1–3 · molecule: all negative parity · hadrocharmonium: P<sub>c</sub>(4312)⁺ 1/2⁺</span></li>
<li><span class="n">2</span><span class="m">The missing family members</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ (CMS 2024, LHCb 2025), Ω<sub>b</sub>⁻ → J/ψ Ξ⁰ K⁻, B⁻ → J/ψ Ξ⁻ Λ̄ · predicted P<sub>ψss</sub><sup>N</sup>(4379)</span></li>
<li><span class="n">3</span><span class="m">Decays, and the same peak in other parents</span><span class="ch">Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ (observed 2024), η<sub>c</sub> p; Λ<sub>b</sub>⁰ → J/ψ p π⁻, B<sub>s</sub>⁰ → J/ψ p p̄ · molecule or hadrocharmonium; pole or triangle</span></li>
</ol>

<div class="closing">All three use data already recorded; none is published on Run 3.</div>

<div class="src">LHCb, EPJC 85 (2025) 812 · LHCb, PRD 110 (2024) L031104 · names as in arXiv:2206.15233</div>

<!--
Speaker: item 1. In the molecular picture heavy-quark spin symmetry fixes the multiplet, not which of the two Σc D̄* states is the 1/2⁻: that hangs on the sign of one spin-spin term. The pionless contact-range fit of Liu et al. (PRL 122 (2019) 242001) weakly prefers Pc(4440)⁺ = 1/2⁻, Pc(4457)⁺ = 3/2⁻; with one-pion exchange the reversed ordering is as likely (Valderrama, PRD 100 (2019) 094028) and Du et al. (PRL 124 (2020) 072001) get the reverse; a 2026 contact-range study using heavy-quark spin and antiquark–diquark symmetry favours the Liu ordering, with stated uncertainties (arXiv:2605.13344). Hadrocharmonium (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151) gives the same order, Pc(4440)⁺ = 1/2⁻ and Pc(4457)⁺ = 3/2⁻, as on slide 15, from the ratio of total widths, so the ordering does not separate molecule from hadrocharmonium; a reversed ordering would contradict the hadrocharmonium width argument. The parity of Pc(4312)⁺ is the same fit's cleanest hadrocharmonium test: 1/2⁻ for the Σc D̄ molecule, 1/2⁺ for a χc0 p seed. A 2026 two-channel Flatté refit of the published Runs 1–2
spectrum reads as molecular with real couplings and is not robust once the
relative coupling phases float (arXiv:2608.25106): only a full amplitude
analysis of Λb⁰ → J/ψ p K⁻ gives the phases. This is the only place the J^P
ordering is said. Item 2. Λb⁰ → J/ψ Ξ⁻ K⁺ was first observed by CMS on 140 fb⁻¹ (EPJC 84 (2024) 1062, arXiv:2401.16303). LHCb then observed Ξb⁰ → J/ψ Ξ⁻ π⁺ for the first time and measured the Λb⁰ → J/ψ Ξ⁻ K⁺ branching fraction four times more precisely on 5.4 fb⁻¹ of 2016–18 data: 84 ± 10 and 107 ± 12 decays, both above 10σ (EPJC 85 (2025) 812, arXiv:2501.12779); the paper says an amplitude analysis needs the larger Run 3 samples; the predicted
Pcss state of width about 10 MeV is narrower than the present resolution
(Roca, Song, Oset, arXiv:2509.19840); heavy-pentaquark chiral perturbation theory predicts an isodoublet Pψss^N(4379) and an isovector Pψs^Σ(4367), both J^P = 1/2⁻, and proposes the J/ψ Ξ spectra of Ωb⁻ → J/ψ Ξ⁰ K⁻ (Pψss^N(4379)⁰) and B⁻ → J/ψ Ξ⁻ Λ̄ (Pψss^N(4379)⁻) for the former; the Σ state would need a J/ψ Σ final state, and the paper names no channel for it (Li and Li, JHEP 11 (2025) 149). Item 3. Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻, observed in 2024 (PRD 110 (2024) L031104, arXiv:2404.19510), is the direct open-charm channel of the molecular
picture; ηc p is reconstructed through ηc → p p̄; Λb⁰ → J/ψ p π⁻ gave 3.1σ evidence in 2016 for the exotic contributions taken together, Pc(4380)⁺, Pc(4450)⁺ and Zc(4200)⁻; the two Pc states alone reach 3.3σ only if Zc(4200)⁻ is assumed negligible (PRL 117 (2016) 082003); Bs⁰ → J/ψ p p̄
reaches only 4429 MeV, shows no Pc(4312)⁺ (p-value 0.5 per the paper) and 3.1–3.7σ evidence for Pc(4337)⁺ instead (PRL 128 (2022) 062001). A pole has the same mass in every
channel; a triangle depends on the production process. Prompt-production
rates are a further, model-dependent handle; do not lead with them. Close: three analyses, data recorded, none published on Run 3. That is the Startertalk's
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

Bound like a deuteron, or built like a proton.

<!--
Speaker: one sentence, then stop. Which of the predicted states exist, with which J^P and which decays, tells us whether QCD binds five quarks the way it binds a deuteron (two hadrons, 2.2 MeV of binding, PDG 2024) or the way it binds a proton (one volume, charge radius 0.84 fm, PDG 2024). This closes the question posed on slide 4. The data are recorded. (~0.5 min)
-->

---
layout: statement
space:
  at: wide
---

# Thank you

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<div class="src">Hadron data: P. Koppenburg, List of hadrons observed at the LHC, LHCb-FIGURE-2021-001 and updates (CC BY 4.0)</div>

<!--
Speaker: questions. The world is back at the wide pose, drifting. Backups follow in this order: thresholds with the PDG inputs, the full seven-row comparison, related LHCb results, references (all titled Backup). (~0.25 min)
-->

---
hideInToc: true
class: backup
---

# Backup: thresholds

| pair | threshold (MeV) | state | offset (MeV) |
|---|---|---|---|
| Σ<sub>c</sub>⁺D̄⁰ | 4317.5 | P<sub>c</sub>(4312)⁺ | −5.6 |
| Σ<sub>c</sub>(2520)⁺D̄⁰ | 4382.2 | P<sub>c</sub>(4380)⁺, broad candidate | not quoted |
| Σ<sub>c</sub>⁺D̄*⁰ | 4459.5 | P<sub>c</sub>(4440)⁺, P<sub>c</sub>(4457)⁺ | −19.2, −2.2 |
| Σ<sub>c</sub>(2520)⁺D̄*⁰ | 4524.3 | none | none |
| Ξ<sub>c</sub>⁺D⁻ / Ξ<sub>c</sub>⁰D̄⁰ | 4337.4 / 4335.3 | P<sub>cs</sub>(4338)⁰ | +0.8 |
| Ξ<sub>c</sub>⁰D̄*⁰ / Ξ<sub>c</sub>⁺D*⁻ | 4477.3 / 4478.0 | P<sub>cs</sub>(4459)⁰ | −18.5 |
| Λ<sub>c</sub>(2595)⁺D̄⁰ | 4457.1 | triangle candidate, P<sub>c</sub>(4457)⁺ | +0.2 |
| χ<sub>c1</sub> p | 4448.9 | triangle candidate, 2015 P<sub>c</sub>(4450)⁺ | +0.9 |

<div class="src">PDG 2024: Σ<sub>c</sub>(2455)⁺ 2452.65, Σ<sub>c</sub>(2455)⁺⁺ 2453.97, Σ<sub>c</sub>(2520)⁺ 2517.4, Ξ<sub>c</sub>⁺ 2467.71, Ξ<sub>c</sub>⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85, D*⁻ 2010.26, Λ<sub>c</sub>(2595)⁺ 2592.25, χ<sub>c1</sub> 3510.67, p 938.27 MeV · Σ<sub>c</sub>⁺⁺D⁻ 4323.6 and Σ<sub>c</sub>⁺⁺D*⁻ 4464.2 lie 6 and 5 MeV higher</div>

<!--
Speaker: backup for the question "which charge combination did you use". Every threshold is the sum of two PDG 2024 masses for a charge-consistent pair: Σc⁺D̄⁰ = 2452.65 + 1864.84 = 4317.5; Σc(2520)⁺D̄⁰ = 2517.4 + 1864.84 = 4382.2; Σc⁺D̄*⁰ = 2452.65 + 2006.85 = 4459.5; Σc(2520)⁺D̄*⁰ = 2517.4 + 2006.85 = 4524.3; Ξc⁺D⁻ = 2467.71 + 1869.66 = 4337.4 and Ξc⁰D̄⁰ = 2470.44 + 1864.84 = 4335.3; Ξc⁰D̄*⁰ = 2470.44 + 2006.85 = 4477.3 and Ξc⁺D*⁻ = 2467.71 + 2010.26 = 4478.0; Λc(2595)⁺D̄⁰ = 2592.25 + 1864.84 = 4457.1; χc1 p = 3510.67 + 938.27 = 4448.9. The other isospin partner of each non-strange pair, Σc⁺⁺D⁻ (4323.6) and Σc⁺⁺D*⁻ (4464.2), lies 6 and 5 MeV higher, so the offsets quoted in the talk are the smaller ones. Offsets are M(state) − threshold with the state masses from the LHCb papers: Pc(4312)⁺ 4311.9, Pc(4440)⁺ 4440.3, Pc(4457)⁺ 4457.3 (PRL 122 (2019) 222001); Pc(4450)⁺ 4449.8 (PRL 115 (2015) 072001); Pcs(4338)⁰ 4338.2 (PRL 131 (2023) 031901); Pcs(4459)⁰ 4458.8 (Sci. Bull. 66 (2021) 1278). The strange offsets are quoted against Ξc⁺D⁻ and Ξc⁰D̄*⁰, LHCb's own choices in those papers. Pc(4337)⁺ is not in the table: it sits above the Σc D̄ thresholds (Σc⁺⁺D⁻ 4323.6 and Σc⁺D̄⁰ 4317.5, 13 and 20 MeV below it), not below one, which is the point made on slide 11. The two triangle rows are thresholds used as kinematic candidates, the χc1 p one for the 2015 Pc(4450)⁺ (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502) and the Λc(2595)⁺D̄⁰ one for Pc(4457)⁺ (tested by LHCb in PRL 122 (2019) 222001). No offset is quoted for Pc(4380)⁺: its mass is 4380 ± 8 ± 29 MeV and its width 205 MeV, and the 2015 paper states that no threshold lies close to it (PRL 115 (2015) 072001); the Σc(2520)⁺D̄⁰ row stays because it is the Σc* D̄ channel of slide 14, where the narrow candidate near 4380 in the Du et al. fit is a different object from the broad 2015 state. (~0 min)
-->

---
hideInToc: true
class: backup wide-table
---

# Backup: the full comparison

| observable | Molecule | Compact | Hadrocharmonium | Cusp or triangle |
|---|---|---|---|---|
| J<sup>P</sup> | 1/2⁻, 3/2⁻ (S-wave; 5/2⁻ for Σ<sub>c</sub>*D̄*) | many, positive parity too | 1/2⁺ (χ<sub>c0</sub> p); 1/2⁻, 3/2⁻ (ψ(2S) p) | set by the channel (Λ<sub>c</sub>(2595)⁺D̄⁰ triangle: 1/2⁺) |
| Widths | narrow, about 10 MeV | broad unless tuned | narrow | set by kinematics |
| Open charm Λ<sub>c</sub> D̄⁽*⁾ | dominant | allowed | suppressed; hidden charm dominates | not fixed |
| Γ(η<sub>c</sub> p) / Γ(J/ψ p) | ≈ 3 (Σ<sub>c</sub>D̄, 1/2⁻); ≈ 0.1 (Σ<sub>c</sub>D̄*, 1/2⁻); 0 (3/2⁻) | model-dependent | suppressed | not fixed |
| Isospin-3/2 partners | none expected | predicted | none | none |
| Peak position across channels | same | same | same | cusp at threshold; triangle moves |
| Magnetic moments | differ from compact in sign and size | differ from molecule | not computed | none |

<div class="src">Chen et al., Phys. Rept. 639 (2016) 1 · Sakai, Jing, Guo, PRD 100 (2019) 074007 · full list on the References slide</div>

<!--
Speaker: the seven-row version of slide 17. Rows 1 to 6 are amplitude-analysis observables in data already recorded; magnetic moments need polarisation observables and are further off. Row by row: J^P, S-wave Σc D̄⁽*⁾ molecules give only 1/2⁻ and 3/2⁻; the Σc* D̄* member of the multiplet adds a 5/2⁻ state, not seen (Liu et al., PRL 122 (2019) 242001; Du et al., PRL 124 (2020) 072001); compact diquark states fill SU(3) multiplets with positive-parity members (Maiani, Polosa, Riquer, PLB 749 (2015) 289); hadrocharmonium puts Pc(4312)⁺ on a χc0 seed with 1/2⁺ and Pc(4440)⁺, Pc(4457)⁺ on a ψ(2S) seed with 1/2⁻, 3/2⁻ (Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151). Widths: a molecule bound by a few MeV is large, so decays to hidden charm, which need the c and c̄ to recombine across two hadrons, are suppressed and the observed widths of order 10 MeV fit (Eides, Petrov, PRD 98 (2018) 114037); compact widths come out large unless a barrier is tuned in, because nothing keeps the c and c̄ apart (PDG 2024, Pentaquarks review, Karliner and Skwarnicki); cusp and triangle widths follow from the kinematics (Guo et al., RMP 90 (2018) 015004). Open charm: molecules decay predominantly to Λc D̄⁽*⁾; in hadrocharmonium open charm is suppressed, less strongly than hidden charm is suppressed in a molecule (Eides, Petrov, PRD 98 (2018) 114037). ηc p over J/ψ p: heavy-quark spin symmetry gives about 3 for the Σc D̄ 1/2⁻ molecule, 3/25 for the Σc D̄* 1/2⁻ state and zero in S-wave for the Σc D̄* 3/2⁻ state (Voloshin, PRD 100 (2019) 034020, eqs. 8 and 11; Sakai, Jing, Guo, PRD 100 (2019) 074007, whose coupled-channel numbers give 2.9 to 4.0 for Pc(4312)⁺); hadrocharmonium on a ψ(2S) or χc0 seed needs a heavy-quark spin flip, so ηc p is suppressed. Isospin-3/2 partners exist only in the compact multiplets; the I = 3/2 Σc D̄ channel is repulsive in the molecular picture. Peak position: a pole sits at the same mass in every production channel and so does a cusp, at its threshold; only a triangle singularity moves with the process (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502). A cusp or triangle carries the S-wave J^P of its rescattering channel; for Pc(4457)⁺ the Λc(2595)⁺D̄⁰ triangle gives 1/2⁺ (LHCb, PRL 122 (2019) 222001). Magnetic moments: molecular and compact assignments differ in sign and size; Özdem's compact-current sum rules give negative moments for the 1/2⁻ Pc states, the molecular currents positive ones (arXiv:2603.19151; EPJC 81 (2021) 277); no hadrocharmonium calculation exists. (~0 min)
-->

---
hideInToc: true
class: backup
---

# Backup: related LHCb results

- 2016: model-independent confirmation; Λ* reflections alone cannot describe the data. PRL 117 (2016) 082002
- 2016: Λ<sub>b</sub>⁰ → J/ψ p π⁻, 3.1σ evidence for exotic contributions, P<sub>c</sub>(4380)⁺, P<sub>c</sub>(4450)⁺ and Z<sub>c</sub>(4200)⁻ taken together. PRL 117 (2016) 082003
- 2022: B<sub>s</sub>⁰ → J/ψ p p̄, 797 ± 31 decays; no P<sub>c</sub>(4312)⁺ signal; P<sub>c</sub>(4337)⁺ at 3.1–3.7σ. PRL 128 (2022) 062001
- 2024: Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ observed on 6 fb⁻¹, the Σ<sub>c</sub>⁽*⁾ D̄⁽*⁾ final state. PRD 110 (2024) L031104
- 2024–25: Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ observed by CMS on 140 fb⁻¹; LHCb observes Ξ<sub>b</sub>⁰ → J/ψ Ξ⁻ π⁺ and measures Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ on 5.4 fb⁻¹, 84 ± 10 and 107 ± 12 decays; amplitude analysis pending. CMS, EPJC 84 (2024) 1062 · LHCb, EPJC 85 (2025) 812
- Kinematic ceilings: m(J/ψ p) ≤ 4341 MeV in B⁰ → J/ψ p p̄ and ≤ 4429 MeV in B<sub>s</sub>⁰ → J/ψ p p̄; neither reaches P<sub>c</sub>(4440)⁺ or P<sub>c</sub>(4457)⁺

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
finds no Pc(4312)⁺ contribution, p-value 0.5 as quoted on the slide-20 note
(LHCb, PRL 128 (2022) 062001, arXiv:2108.04720). 2024: Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ observed, the open-charm final state that a Σc D̄⁽*⁾ molecule would feed (LHCb, PRD 110 (2024) L031104, arXiv:2404.19510). 2024: CMS observes Λb⁰ → J/ψ Ξ⁻ K⁺ on 140 fb⁻¹ (EPJC 84 (2024) 1062, arXiv:2401.16303). 2025: LHCb observes Ξb⁰ → J/ψ Ξ⁻ π⁺ and measures Λb⁰ → J/ψ Ξ⁻ K⁺ on 5.4 fb⁻¹, 84 ± 10 and 107 ± 12 decays; no amplitude analysis yet (EPJC 85 (2025) 812, arXiv:2501.12779). Ceilings from PDG 2024: m(B⁰) − m(p) = 5279.72 − 938.272 = 4341.4 MeV; m(Bs⁰) − m(p) = 5366.93 − 938.272 = 4428.7 MeV; so neither B → J/ψ p p̄
channel can reach Pc(4440)⁺ (4440.3 MeV) or Pc(4457)⁺ (4457.3 MeV, both PRL 122 (2019) 222001). Both B⁰ → J/ψ p p̄ and Bs⁰ → J/ψ p p̄ were first observed by LHCb on 5.2 fb⁻¹ (PRL 122 (2019) 191804, arXiv:1902.05588). (~0 min)
-->

---
hideInToc: true
class: backup
---

# Backup: references

<div class="refs">

**LHCb.** PRL 115 (2015) 072001 [1507.03414] · PRL 117 (2016) 082002 [1604.05708] · PRL 117 (2016) 082003 [1606.06999] · PRL 122 (2019) 191804 [1902.05588] · PRL 122 (2019) 222001 [1904.03947] · Sci. Bull. 66 (2021) 1278 [2012.10380] · PRL 128 (2022) 062001 [2108.04720] · PRL 131 (2023) 031901 [2210.10346] · naming: 2206.15233 · Λ<sub>b</sub>⁰ → Σ<sub>c</sub> D̄ K: PRD 110 (2024) L031104 [2404.19510] · J/ψ Ξ⁻ K⁺: EPJC 85 (2025) 812 [2501.12779]; first seen by CMS, EPJC 84 (2024) 1062 [2401.16303] · review: Johnson, Polyakov, Skwarnicki, Wang, Ann. Rev. Nucl. Part. Sci. 74 (2024) 583 [2403.04051] · detector: JINST 3 (2008) S08005 · Upgrade I: JINST 19 (2024) P05065

**Theory.** Gell-Mann, Phys. Lett. 8 (1964) 214 · Zweig, CERN-TH-401, 412 (1964) · Guo et al., RMP 90 (2018) 015004 · Olsen, Skwarnicki, Zieminska, RMP 90 (2018) 015003 · Chen et al., Phys. Rept. 639 (2016) 1 · Liu et al., PRL 122 (2019) 242001 · Du et al., PRL 124 (2020) 072001 · Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001 [1904.10021] · Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007 · Eides, Petrov, PRD 98 (2018) 114037 [1811.01691] · Eides, Petrov, Polyakov, Mod. Phys. Lett. A 35 (2020) 2050151 [1904.11616] · Dubynskiy, Voloshin, PLB 666 (2008) 344 · Valderrama, PRD 100 (2019) 094028 · Maiani, Polosa, Riquer, PLB 749 (2015) 289 · Lebed, PLB 749 (2015) 454 · Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502 · H.-S. Li, T. Li, JHEP 11 (2025) 149 [2502.05495] · Roca, Song, Oset, 2509.19840 · Yıldırım, 2605.13344 · Atangana Likéné et al., 2608.25106 · Özdem, EPJC 81 (2021) 277; JHEP 02 (2026) 207 [2510.26893]; EPJC 86 (2026) 359 [2603.19151]

**Data.** LEPS, PRL 91 (2003) 012002 · PDG 2008, review “Pentaquarks” · PDG 2024 · P. Koppenburg, List of hadrons observed at the LHC, LHCb-FIGURE-2021-001 and updates (CC BY 4.0) · LHCb public luminosity plots · X(3872): Belle, PRL 91 (2003) 262001 · Z(4430)⁺: Belle, PRL 100 (2008) 142001 · Z<sub>c</sub>(3900)⁺: BESIII, PRL 110 (2013) 252001; Belle, PRL 110 (2013) 252002

</div>

<!--
Speaker: hidden backup, not spoken. Serves the PDF export and questions:
every source cited on a slide, in the HUD or in a note, journal style where a
journal reference exists (PRL / PLB / PRD / EPJC / Sci. Bull. / RMP / JHEP / Phys. Rept. / Mod. Phys. Lett. A / Ann. Rev. Nucl. Part. Sci.), arXiv id in brackets, bare arXiv id only where no journal
reference was verified (naming 2206.15233, LHCb-PUB-2022-013; 2509.19840, 2605.13344, 2608.25106). Hadron list under
CC BY 4.0 (P. Koppenburg, LHCb-FIGURE-2021-001 and updates). (~0 min)
-->
