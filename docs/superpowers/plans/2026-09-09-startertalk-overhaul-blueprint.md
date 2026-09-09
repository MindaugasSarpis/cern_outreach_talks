> **Status (2026-09-09, after implementation).** This blueprint is the plan the deck was written from. The deck then went through an adversarial fact-check (136 confirmed findings, applied to `talks/2026_09_00_Startertalk/deck.md`); where the two differ, the deck is right and this file records the earlier reasoning. Known corrections not mirrored here: charge-consistent threshold counts and the Pc(4337)⁺ wording on slide 11; the 2015 reduced/extended Λ* model; the Dalitz plot is Fig. 5; the ηc p ratio is ≈ 3 only for the Σc D̄ 1/2⁻ state; a cusp does not move between channels, a triangle does; Eides–Petrov (PRD 98 (2018) 114037) has no Polyakov; arXiv:1903.11560 for Liu et al.; CMS observed Λb⁰ → J/ψ Ξ⁻ K⁺ first (2024); JPAC prefers a virtual state.

# Startertalk overhaul: final redesign blueprint

**Date:** 2026-09-09 · **Deck:** `talks/2026_09_00_Startertalk/deck.md` ("Pentaquarks at LHCb", 30-minute LHCb Startertalk, Vilnius University) · **Status:** editor's final, merged from the three proposals and five critiques per the judge (`wf_09_judge.json`).

Base: the Visual-first proposal. Grafts applied from Rigour-first (thresholds backup, HUD record spec, numbers/sources rules, 2019 3×4 table, "What an amplitude analysis fits", radius caption) and from Story-first ("Why charm" slide, the Θ⁺(1540) stop, the programme-list CSS, the cover darkening, the deuteron planted three times, the `lambda_b_decay.svg` revision). Every weakness the judge listed is fixed below (titles, word ceiling, padding-bottom hack, garbled note, unverified specifics, `—` cells, naming footer, JPAC wording, camera time).

## 1. Angle, arc, takeaway

**Angle.** One dominant picture per slide inside the persistent 3D hadron world: the world itself on 1964, Θ⁺, the section breaks and the close; the LHCb papers' own plots at the nine stops; three re-rendered matplotlib SVGs; five new deterministic schematics. Text is a plain declarative title plus a caption or at most two narrow cards. Numbers live in the HUD records and in one table per slide at most. Physics is corrected to the LHCb papers' wording: charge-consistent thresholds, the ηc p / J/ψ p direction from heavy-quark spin symmetry, no phase claim for the 2019 states, JPAC's reading of Pc(4312)⁺, Pc(4337)⁺ drawn where the camera stops.

**Arc.** The question is posed in the first five minutes and closed in the last thirty seconds. Part 0 (slides 2–5): 1964 at the origin star (Gell-Mann's own sentence lists (qqqqq̄) next to (qqq)); 2003 at the hollow Θ⁺(1540) ring (a peak reported by ten experiments was not a state; a claim needs the full amplitude); the talk's question, "One hadron or two", with the deuteron and the proton as the two pictures; "Why charm" framed on the J/ψ marker. Part 1 (slides 7–12, six pentaquark stops): the decay, what an amplitude analysis fits (Dalitz plane), 2015 (two states, the phase moved), 2019 (nine times the data, three narrow states, a 1D fit), the threshold ladder with Pc(4337)⁺ as the exception, the strange partners. Part 2 (slides 14–17, camera orbiting the cluster): the molecule (family of seven), compact or hadrocharmonium, cusp or pole, one four-row table of what separates them. Part 3 (slides 19–21, camera past 2026 on the empty floor): Run 3 is complete and the sample is final, three amplitude analyses on recorded data, none published; then the closing fact echoes the question. Four hidden backups after "Thank you".

**Takeaway.** LHCb found a family of narrow five-quark states within 20 MeV of charmed-baryon + anticharmed-meson thresholds. Whether they are two hadrons bound like a deuteron or one hadron built like a proton is decided by their J^P, their decays and whether the peaks move between production channels. Only amplitude analyses of the now-final Run 3 sample give those, and none has been published.

## 2. Slide table (27.0 min spoken, stops included)

| # | kind | title | space | min |
|---|---|---|---|---|
| 1 | cover | Pentaquarks at LHCb | `at: wide, yaw: -22` | 0.5 |
| 2 | figure | 1964: five quarks are allowed | `at: quarks-1964, dist 9, yaw -60, pitch 8` | 1.25 |
| 3 | stop | 2003: Θ⁺(1540) | stop Theta(1540) | 1.25 |
| 4 | figure | One hadron or two | `[8.5, 3.2, -8]`, dist 15 | 1.0 |
| 5 | content | Why charm | `at: J/psi`, dist 12 | 1.0 |
| 6 | section | What LHCb found, 2015–2022 | `[10.4, 5.2, -2.6]`, dist 12 | 0.25 |
| 7 | figure | Λb⁰ → J/ψ p K⁻ | `[15.4, 6.0, -1.4]`, dist 10 | 1.25 |
| 8 | figure | What an amplitude analysis fits | same, yaw −16 | 1.25 |
| 9 | stop | 2015: two J/ψ p states | stops Pc(4380), Pc(4450); `asof: 2015` | 2.25 |
| 10 | table | 2019: three narrow states | stops Pc(4312), Pc(4440), Pc(4457) | 2.25 |
| 11 | stop | Masses and thresholds | stop Pc(4337) | 2.0 |
| 12 | stop | Strange partners | stops Pcs(4459), Pcs(4338) | 2.0 |
| 13 | section | What they could be | `[19.5, 6.2, -1.5]`, dist 14 | 0.25 |
| 14 | table | Two hadrons: a molecule | yaw −25 | 1.75 |
| 15 | figure | One hadron: compact or hadrocharmonium | yaw −10 | 1.5 |
| 16 | figure | Cusp or pole | yaw 5 | 1.25 |
| 17 | table | What tells them apart | yaw 20 | 1.5 |
| 18 | section | What Run 3 will measure | `at: future` | 0.25 |
| 19 | figure | Run 3 is complete | `future, yaw -20` | 1.25 |
| 20 | content | Three amplitude analyses | `future, yaw -10` | 2.25 |
| 21 | close | One hadron or two | `future, pitch 14, dist 12` | 0.5 |
| 22 | close | Thank you | `at: wide` | 0.25 |
| 23 | backup | Backup: thresholds | (none) | 0 |
| 24 | backup | Backup: the full comparison | (none) | 0 |
| 25 | backup | Related LHCb results | (none) | 0 |
| 26 | backup | References | (none) | 0 |

22 spoken slides, 9 stops (≤ 15 s each, inside the slide minutes), 4 hidden backups. If a rehearsal runs over, drop first the Pc(4380) stop on slide 9 (keep `clicks: 1`, `stops: [Pc(4450)]`), then the paper's Dalitz panel on slide 8.

## 3. Style rules

1. One claim per slide; the title states it in ≤ 6 words, sentence case, declarative or a plain label; no question titles (the two "One hadron or two" slides are statements), no partial bold, no outline numbers, no Title Case, no cute lines, no anthropomorphic verbs in titles ("fits", not "sees").
2. On-screen prose ≤ 60 words outside tables and the programme list (target 40); a table ≤ 4 rows × 5 columns with one-line cells; empty cells read "none", never "—". Anything longer goes to the speaker note or a backup.
3. Every content slide has one dominant visual (figure, table, or the world itself) and at most two cards; a card or caption is ≤ 60ch wide and ≤ 45% of the canvas beside a visual; no full-width paragraphs. Widths use the deck classes `.col-40/.col-45/.col-50/.col-55/.col-60` (UnoCSS already owns `w-40`).
4. The lower third of the frame stays clear on every content slide (`.stage` caps content at 340 px); figures carry explicit `height` and sit on one side, the world on the other. No `padding-bottom` hack.
5. No em dashes in body text; no "X, not Y"; no emoji; no idioms or superlatives; sentences, not fragments; every bullet capitalised; arrows only in decays.
6. One pentaquark notation on screen: P<sub>c</sub>(4312)⁺, P<sub>cs</sub>(4338)⁰ (matching the HUD ids and the paper figures). LHCb's 2022 names appear only in the footers of slides 12 and 20. Real subscripts on every flavour letter (Λ<sub>b</sub>⁰, Ξ<sub>b</sub>⁻, Ω<sub>b</sub>⁻, Σ<sub>c</sub>, Ξ<sub>c</sub>, Λ<sub>c</sub>⁺, B<sub>s</sub>⁰, η<sub>c</sub>, χ<sub>c1</sub>); cc̄ unspaced; a charge on every hadron.
7. Data periods: "Run 1 (3 fb⁻¹)", "Runs 1–2 (9 fb⁻¹)", "Runs 1–3". Journal style everywhere, slides and HUD alike: PRL / PLB / PRD / EPJC / Sci. Bull. / RMP; arXiv ids only where no journal reference exists, never inside a sentence.
8. Numbers appear once: statistical uncertainty on slides; full M ± stat ± syst, Γ, significance and channel in the HUD record and the notes; "> 15σ" where the paper says "exceeds"; error precision matched to the value; thresholds always from charge-consistent pairs with PDG 2024 masses, inputs on the thresholds backup.
9. Footer: one `.src` line per slide, 12 px at 70% opacity, bottom-left, ≤ 2 references (slides 12 and 20 add the naming reference as the designated exception); long lists go to the References backup.
10. Type: Space Grotesk for the whole deck (loaded by `HadronSpace.vue`); h1 42 px/700; card heading 22 px/600; body and captions 20 px at line-height 1.35; table cells 19 px; footer 12 px; HUD name 36 px, values 15 px, labels 12 px. Nothing is shrunk to fit; content is cut.
11. Speaker notes carry the detail (detector, systematics, the 2016 follow-ups, theory attributions, caveats) and a minute budget; the deuteron is planted on slides 4 and 5 and closed on 21; the 1D-fit caveat is said on slide 10 only; the J^P ordering on slide 20 only.

## 4. Slides

Bodies below are the exact Slidev markup to typeset. `space` is the exact YAML the slide carries.

### 1 · cover · Pentaquarks at LHCb (0.5 min)

```yaml
layout: cover
space:
  at: wide
  yaw: -22
```

```md
# LHCb Startertalk

# Pentaquarks at LHCb

## Hidden-charm pentaquarks, 2015–2026

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<div class="src">Hadron data: P. Koppenburg, LHCb-FIGURE-2021-001 and updates (CC BY 4.0)</div>
```

Visual: the world at `wide`, yawed so the 2011–2016 spike cluster sits right of the title block; the "1964 · Gell-Mann · Zweig" tick readable bottom-left; radial darkening behind the text (CSS). No figure.

Notes: 30 minutes, one scene throughout: date left to right, mass up, quark family in depth. Three parts: what LHCb found (2015–2022), what the states could be, what Run 3 will measure. The 2015 paper is eleven years old this July. The credit is Koppenburg's table; the whole world is his list. 0.5 min.

### 2 · figure · 1964: five quarks are allowed (1.25 min)

```yaml
space:
  at: quarks-1964
  dist: 9
  yaw: -60
  pitch: 8
```

```md
# 1964: five quarks are allowed

<div class="quote-line">“Baryons can now be constructed from quarks by using the combinations (qqq), (qqqqq̄), etc., while mesons are made out of (qq̄), (qqq̄q̄), etc.”</div>

<img src="/figures/quark_model_singlets.svg" class="stage mx-auto mt-sm" style="height: 180px" alt="Meson, baryon, tetraquark and pentaquark as quark clusters" />

<div class="caption mt-sm">Five-quark baryons are in the first quark paper, in the same sentence as qqq. Zweig proposed the same constituents the same year. Neither paper says whether such states bind, or how narrow they are.</div>

<div class="src">Gell-Mann, Phys. Lett. 8 (1964) 214 · Zweig, CERN-TH-401 and CERN-TH-412 (1964)</div>
```

Visual: NEW `quark_model_singlets.svg` (fig-A) full width at 180 px under the one-line quote; the 1964 star lands left of centre in the clear lower band (this is the `origin` pose).

Notes: The sentence is quoted verbatim from Gell-Mann, Phys. Lett. 8 (1964) 214. Zweig's CERN-TH-401 and CERN-TH-412 (January 1964) propose the same constituents as "aces"; the five-quark combination on screen is Gell-Mann's. Colour came later (1965 and after); in 1964 the argument was charges alone. Every baryon found before 2015 fits qqq (Λ(1405) and N(1440) puzzles aside). Point at the empty pentaquark lane running toward the camera. 1.25 min.

### 3 · stop · 2003: Θ⁺(1540) (1.25 min)

```yaml
clicks: 1
space:
  at: Theta(1540)
  dist: 8
  yaw: -40
  pitch: 6
  stops: [Theta(1540)]
```

```md
# 2003: Θ⁺(1540)

<div class="card card-warning pad-tight col-45">

## Not confirmed

Θ⁺(1540), uudds̄, seen by LEPS in 2003 and by about ten experiments after it. Absent in the high-statistics data of CLAS, Belle and BaBar. PDG 2008: not confirmed.

A peak in one mass projection is not enough. A claim needs the full amplitude, with its phase.

</div>

<div class="src">LEPS, PRL 91 (2003) 012002 · PDG 2008, review “Pentaquarks”</div>
```

Visual: no figure; the hollow Θ⁺ ring centre-right at 1540 MeV on the pentaquark lane, the lane empty on to 2015. One card top-left. Click 1: stop on Theta(1540); the HUD record (LEPS · 2003 · 1540 ± 10 MeV · superseded · not confirmed by later experiments (PDG 2008)) with no figure panel (the figure panel is `v-if`'d).

Notes: LEPS saw a peak near 1540 MeV in γn → K⁺K⁻n; positive reports in 2003–04 from LEPS, DIANA, CLAS, SAPHIR, HERMES, ZEUS and others with samples of tens of events; CLAS high-statistics runs, Belle and BaBar saw nothing; the PDG 2008 review calls the evidence overwhelmingly negative. The lesson for everything that follows: a bump in a projection can be a reflection, a kinematic effect or a fluctuation; the 2015 claim was held to a six-dimensional amplitude fit and phase motion. Name the hollow ring: evidence and superseded states are drawn hollow throughout the world. 1.25 min including the stop.

### 4 · figure · One hadron or two (1.0 min)

```yaml
space:
  at: [8.5, 3.2, -8]
  dist: 15
  yaw: -68
  pitch: 7
```

```md
# One hadron or two

<img src="/figures/hadron_pictures_2.svg" class="stage mx-auto" style="height: 240px" alt="Two hadrons a femtometre apart, and one compact hadron, at a common 1 fm scale" />

<div class="two-col caption mt-sm">
<div><b>Two hadrons.</b> A charmed baryon and an anticharmed meson about a femtometre apart, bound by a few MeV. Like a deuteron.</div>
<div><b>One hadron.</b> Five quarks in one volume, bound by colour forces. Like a proton.</div>
</div>

<div class="caption mt-sm">QCD allows both. The rest of the talk is about telling them apart.</div>
```

Visual: NEW `hadron_pictures_2.svg` (fig-C, two panels titled "two hadrons" / "one hadron", no quark letters, no Σc D̄ or [cu][ud]c̄ labels, common 1 fm bar) across the upper 60%; the camera looks back along the axis toward the LHC era, the pentaquark lane empty until 2015.

Notes: This is the talk's question; say it in one sentence and come back to it on slide 21. Deuteron: 2.2 MeV binding, r ≈ 4.3 fm; proton: 0.8 fm. Do not name Σc D̄ or diquarks here; the physics labels come on slides 14–15. 1.0 min.

### 5 · content · Why charm (1.0 min)

```yaml
space:
  at: J/psi
  dist: 12
  yaw: -55
  pitch: 9
```

```md
# Why charm

<div class="card card-primary pad-tight col-50">

A charm quark is heavy and slow. A charmed baryon and an anticharmed meson can bind by a few MeV, as a proton and a neutron bind in the deuteron.

Such a state lies just below the pair's threshold, and the threshold is known to a fraction of an MeV.

b-hadron decays at the LHC supply these pairs in large numbers.

</div>
```

Visual: one card at 50% width, upper left; the world framed on the J/ψ (1974) marker in the meson lane with the conventional lanes receding and the empty pentaquark lane in front. No figure.

Notes: Heavy quark: small kinetic energy, so a weak residual force (light-meson exchange) can bind; thresholds are sharp because the hadron masses are known to a fraction of an MeV; such a state is narrow because decay to J/ψ p needs the c and c̄ to recombine across two hadrons. "Bound like a deuteron" is what part two calls a hadronic molecule. The LHC makes b hadrons whose decays give cc̄ plus light quarks in one place; Λb⁰ → J/ψ p K⁻ is where the story starts. 1.0 min.

### 6 · section · What LHCb found, 2015–2022 (0.25 min)

```yaml
layout: section
hideInToc: true
space:
  at: [10.4, 5.2, -2.6]
  dist: 12
  yaw: -30
  pitch: 8
```

```md
# What LHCb found, 2015–2022
```

Notes: one sentence while the camera flies: the hollow ring behind is the Θ⁺; the X(3872) (2003) in the tetraquark lane is the first hidden-charm exotic and is still with us; Z(4430)⁺ 2007, Zc(3900)⁺ 2013. The pentaquark lane stays empty until 2015. 15 s.

### 7 · figure · Λb⁰ → J/ψ p K⁻ (1.25 min)

```yaml
space:
  at: [15.4, 6.0, -1.4]
  dist: 10
  yaw: -24
  pitch: 7
```

```md
# Λ<sub>b</sub>⁰ → J/ψ p K⁻

<img src="/figures/lambda_b_decay.svg" class="stage mx-auto" style="height: 300px" alt="Two decay paths of Lambda_b to the J/psi p K final state" />

<div class="caption mt-sm">Two paths to the same three particles. The J/ψ p pair carries cc̄uud: five quarks. Λ* → p K⁻ resonances feed the same final state and reflect into m(J/ψ p). The fit models both paths and their interference.</div>

<div class="src">About 26 000 Λ<sub>b</sub>⁰ → J/ψ p K⁻ decays in Run 1 (3 fb⁻¹) · LHCb, PRL 115 (2015) 072001</div>
```

Visual: REVISED `lambda_b_decay.svg` (fig-F) full width at 300 px, no caption inside the SVG; no cards.

Notes: Why LHCb, in speech only: forward spectrometer for b hadrons; the vertex detector resolves the Λb⁰ flight distance, the RICH identifies K⁻ and p, J/ψ → μ⁺μ⁻ triggers cleanly. Why this decay: Cabibbo-favoured b → cc̄s, and the J/ψ p pair is five quarks by construction, so a peak in m(J/ψ p) cannot be an ordinary baryon. The interference is the whole difficulty and the whole opportunity: it gives access to the phase. 26 007 ± 166 signal decays in the 2015 paper. 1.25 min.

### 8 · figure · What an amplitude analysis fits (1.25 min)

```yaml
space:
  at: [15.4, 6.0, -1.4]
  dist: 10
  yaw: -16
  pitch: 7
```

```md
# What an amplitude analysis fits

<div class="row stage">
<img src="/figures/dalitz_schematic.svg" style="height: 290px" alt="Schematic Dalitz plane: Lambda* bands vertical, pentaquark bands horizontal" />
<img src="/figures/papers/LHCb-PAPER-2015-029_dlz.png" class="paper" style="height: 290px" alt="LHCb 2015 Dalitz plot of Lambda_b to J/psi p K" />
</div>

<div class="caption mt-sm">Λ* resonances: vertical bands in m²(K⁻p). A pentaquark: a horizontal band in m²(J/ψ p), across all of them. The 2015 fit used this plane and five decay angles, each resonance with a magnitude and a phase.</div>

<div class="src">Left: schematic, PDG masses, band widths exaggerated · Right: LHCb, PRL 115 (2015) 072001, Fig. 2</div>
```

Visual: NEW `dalitz_schematic.svg` (fig-E) left and the paper's own Dalitz plot (`dlz.png`, fetched, fig-G) right, equal height, reading "what we expect, what we see". Small yaw step from slide 7.

Notes: Six dimensions in 2015: m(Kp) and five angles. Each Λ* is a vertical band with its own spin structure in the angles; a J/ψ p state is horizontal and crosses them, so its interference with the Λ* fixes its phase and J^P. The bright vertical band in the data at 2.3 GeV² is the Λ(1520). This is why a one-dimensional fit to m(J/ψ p) cannot give quantum numbers; that point returns once, on slide 10. The 2015 model: 14 Λ* states with PDG masses and widths, helicity couplings free, then two J/ψ p states added. 1.25 min.

### 9 · stop · 2015: two J/ψ p states (2.25 min)

```yaml
clicks: 2
space:
  at: [15.9, 6.1, 0]
  dist: 8
  yaw: -22
  pitch: 6
  asof: 2015
  stops: [Pc(4380), Pc(4450)]
```

```md
# 2015: two J/ψ p states

<div class="row stage">
<div class="card card-primary pad-tight col-40">

## Six dimensions, 14 Λ* resonances

Run 1, 26 000 decays. The data are described only with two J/ψ p states added: 9σ and 12σ.

</div>
<img src="/figures/argand_schematic.svg" class="col-55" alt="Argand circle of a Breit–Wigner amplitude in six mass bins, with its lineshape" />
</div>

<div class="caption mt-sm">A resonance phase turns through 180° across the peak. Fitted freely in six bins of m(J/ψ p), the P<sub>c</sub>(4450)⁺ amplitude follows the circle.</div>

<div class="src">LHCb, PRL 115 (2015) 072001</div>
```

Visual: NEW `argand_schematic.svg` (fig-B) right at 55%, one card left at 40%. Stop 1 (Pc(4380)⁺): the paper's m(J/ψ p) projection `LHCb-PAPER-2015-029_mjpsip-default_crop.png`. Stop 2 (Pc(4450)⁺): the paper's Argand diagram, panel (a) of `DoubleArgand-final.png` cropped (fig-G). HUD records carry M ± stat ± syst, Γ, significance, channel; `asof: 2015` renders Pc(4450)⁺ as "observed · 12σ" with no mention of the 2019 split.

Notes: Numbers stay in the HUD: Pc(4380)⁺ M = 4380 ± 8 ± 29 MeV, Γ = 205 ± 18 ± 86 MeV, 9σ; Pc(4450)⁺ M = 4449.8 ± 1.7 ± 2.5 MeV, Γ = 39 ± 5 ± 19 MeV, 12σ. Best fit J^P = (3/2⁻, 5/2⁺); (3/2⁺, 5/2⁻) and (5/2⁺, 3/2⁻) acceptable. The broad state's loop shows a large phase change but the paper calls that study not conclusive; it remains a candidate. Confirmed model-independently (Λ* reflections alone cannot describe the data, PRL 117 (2016) 082002) and seen at 3.1σ in Cabibbo-suppressed Λb⁰ → J/ψ p π⁻ (PRL 117 (2016) 082003): the checks the Θ⁺ never passed. Stops 15 s each: the broad state first, then the narrow one that will split; do not say "split" yet. 2.25 min.

### 10 · table · 2019: three narrow states (2.25 min)

```yaml
clicks: 3
space:
  at: [19.6, 6.1, 0]
  dist: 8
  yaw: -22
  pitch: 6
  stops: [Pc(4312), Pc(4440), Pc(4457)]
```

```md
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

<div class="src">LHCb, PRL 122 (2019) 222001 · statistical uncertainties; the widths carry systematic uncertainties of similar size</div>
```

Visual: the 3×4 table at 60% width, left; the three dots 17 MeV apart in the world on the right. Stop 1 (Pc(4312)⁺): `LHCb-PAPER-2019-014_mjpsip-spectrum-all_crop.png`. Stop 2 (Pc(4440)⁺): `LHCb-PAPER-2019-014_pentaquarks_nominal_fit_and_thresholds_crop.png` (the fit with three narrow states and the Σc⁺D̄⁰, Σc⁺D̄*⁰ lines). Stop 3 (Pc(4457)⁺): `LHCb-PAPER-2019-014_mjpsip-spectrum-19_crop.png` (m(Kp) > 1.9 GeV with the inset on the two peaks).

Notes: Run 1 = 3 fb⁻¹, Run 2 = 6 fb⁻¹. Systematics: Pc(4312) Γ = 9.8 ± 2.7 (+3.7 −4.5) MeV, < 27 MeV at 95% CL; Pc(4440) Γ = 20.6 ± 4.9 (+8.7 −10.1); Pc(4457) Γ = 6.4 ± 2.0 (+5.7 −1.9). Λ* reflections reduced by an m(Kp) > 1.9 GeV cut and cos θ weighting; no amplitude analysis. The broad Pc(4380)⁺ is neither confirmed nor excluded. Walk the three stops: one dot, then two dots 17 MeV apart where one was. Say the 1D-fit caveat once, here, and not again until slide 19. 2.25 min.

### 11 · stop · Masses and thresholds (2.0 min)

```yaml
clicks: 1
space:
  at: [20.5, 6.1, 0]
  dist: 8
  yaw: -18
  pitch: 6
  stops: [Pc(4337)]
```

```md
# Masses and thresholds

<img src="/figures/pc_thresholds.svg" class="stage mx-auto" style="height: 310px" alt="Pentaquark masses and widths against charmed-baryon anticharmed-meson thresholds" />

<div class="caption mt-sm">Five narrow states, five thresholds, all within 20 MeV. For P<sub>c</sub>(4312)⁺ and P<sub>c</sub>(4457)⁺ the threshold lies within the peak width: bound or virtual is open. P<sub>c</sub>(4337)⁺, evidence in B<sub>s</sub>⁰ → J/ψ p p̄, has no threshold nearby.</div>

<div class="src">Thresholds from PDG 2024 masses, charge-consistent pairs (inputs on the backup slide) · states: LHCb 2015–2022</div>
```

Visual: REVISED `pc_thresholds.svg` (fig-H) full width at 310 px with charge-consistent thresholds and Pc(4337)⁺ as a hollow marker. Stop (Pc(4337)⁺): `LHCb-PAPER-2021-018_Fig2e_crop.png`; the HUD record carries the asymmetric errors and the Bs⁰ channel.

Notes: The most important slide of part one. Offsets from charge-consistent pairs: Pc(4312)⁺ 5.6 MeV below Σc⁺D̄⁰ (4317.5); Pc(4440)⁺ 19.2 and Pc(4457)⁺ 2.2 MeV below Σc⁺D̄*⁰ (4459.5); Pcs(4338)⁰ 0.8 MeV above Ξc⁺D⁻ (4337.4); Pcs(4459)⁰ 18.5 MeV below Ξc⁰D̄*⁰ (4477.3). LHCb's words: "approximately 5 and 2 MeV below", "about 20 MeV of binding", "about 19 MeV below Ξc⁰D̄*⁰", "at the Ξc⁺D⁻ threshold". Σc⁺⁺D⁻ and Σc⁺⁺D*⁻ are 6 and 5 MeV higher. The deuteron is bound by 2.2 MeV. LHCb 2019 lists virtual states among the plausible explanations; JPAC (PRL 123 (2019) 092001) prefers a virtual state for Pc(4312)⁺. The stop: Pc(4337)⁺, M = 4337 (+7 −4)(+2 −2) MeV, Γ = 29 (+26 −12)(+14 −14) MeV, 3.1–3.7σ, 797 ± 31 Bs⁰ → J/ψ p p̄ decays; no Pc(4312)⁺ signal in that channel; if confirmed, a problem for a pure molecular picture. 2.0 min.

### 12 · stop · Strange partners (2.0 min)

```yaml
clicks: 2
space:
  at: [22.3, 6.15, 0]
  dist: 8
  yaw: -22
  pitch: 6
  stops: [Pcs(4459), Pcs(4338)]
```

```md
# Strange partners

<div class="row stage">
<div class="card card-primary pad-tight col-45">

## P<sub>cs</sub>(4459)⁰, evidence (2020)

- Ξ<sub>b</sub>⁻ → J/ψ Λ K⁻, Runs 1–2
- 3.1σ; two overlapping peaks not excluded
- About 19 MeV below Ξ<sub>c</sub>⁰ D̄*⁰

</div>
<div class="card card-accent pad-tight col-45">

## P<sub>cs</sub>(4338)⁰, observation (2022)

- B⁻ → J/ψ Λ p̄, a B-meson decay
- > 15σ, full amplitude analysis
- J = 1/2; positive parity excluded at 90% CL
- At the Ξ<sub>c</sub>⁺ D⁻ threshold

</div>
</div>

<div class="caption mt-sm">In the molecular picture SU(3) requires strange partners. These are the first two.</div>

<div class="src">LHCb, Sci. Bull. 66 (2021) 1278 · PRL 131 (2023) 031901 · LHCb now writes P<sub>ψs</sub><sup>Λ</sup>(4459)⁰ and P<sub>ψs</sub><sup>Λ</sup>(4338)⁰ (arXiv:2206.15233)</div>
```

Visual: two cards at 45% each in the upper half; the two orange states in the lower band of the world. Stop 1 (Pcs(4459)⁰): `LHCb-PAPER-2020-039_Fig3b_crop.png`. Stop 2 (Pcs(4338)⁰): `LHCb-PAPER-2022-031_Fig3a_crop.png`.

Notes: Pcs(4459)⁰: M = 4458.8 ± 2.9 (+4.7 −1.1) MeV, Γ = 17.3 ± 6.5 (+8.0 −5.7) MeV, 1750 ± 50 signal decays, itself a six-dimensional amplitude analysis; the two-peak hypothesis (4454.9 and 4467.8 MeV) is neither confirmed nor refuted. Pcs(4338)⁰: M = 4338.2 ± 0.7 ± 0.4 MeV, Γ = 7.0 ± 1.2 ± 1.3 MeV, about 4400 signal candidates on 9 fb⁻¹; J = 1/2 with 3/2 excluded. Found in a B-meson decay, a different parent: the first hint that the peak does not depend on the production process (programme item 3). Naming: P for pentaquark, ψ for cc̄ plus s per strange quark, the superscript is the light-quark isospin (Λ: I = 0, N: 1/2, Σ: 1, Δ: 3/2). Old names on screen throughout because they match the paper figures at the stops. 2.0 min.

### 13 · section · What they could be (0.25 min)

```yaml
layout: section
hideInToc: true
space:
  at: [19.5, 6.2, -1.5]
  dist: 14
  yaw: -40
  pitch: 12
```

```md
# What they could be
```

Notes: Two families of answers, two hadrons or one, and the possibility that a peak is kinematic. From here to slide 17 the camera orbits the cluster (yaw −25 → +20); keep the lower third clear so the drift reads. 15 s.

### 14 · table · Two hadrons: a molecule (1.75 min)

```yaml
space:
  at: [19.5, 6.2, -1.5]
  dist: 13
  yaw: -25
  pitch: 10
```

```md
# Two hadrons: a molecule

<div class="row stage">
<div class="col-40">
<img src="/figures/hadron_molecule.svg" style="height: 220px" alt="A Sigma_c D-bar molecule: two hadrons about 1.8 fm apart" />
<div class="caption under-fig">Σ<sub>c</sub> D̄⁽*⁾ bound by light-meson exchange, as nucleons are. A few MeV of binding puts each mass just below its threshold and keeps the state narrow.</div>
</div>
<div class="col-55">

| channel | J<sup>P</sup> | state |
|---|---|---|
| Σ<sub>c</sub> D̄ | 1/2⁻ | P<sub>c</sub>(4312)⁺ |
| Σ<sub>c</sub> D̄* | 1/2⁻, 3/2⁻ | P<sub>c</sub>(4440)⁺, P<sub>c</sub>(4457)⁺ |
| Σ<sub>c</sub>* D̄ | 3/2⁻ | candidate near 4380 |
| Σ<sub>c</sub>* D̄* | 1/2⁻, 3/2⁻, 5/2⁻ | none seen |

<div class="caption mt-sm">Seven predicted states. Three seen, one candidate, three missing.</div>
</div>
</div>

<div class="src">Liu et al., PRL 122 (2019) 242001 · Du et al., PRL 124 (2020) 072001</div>
```

Visual: NEW `hadron_molecule.svg` (fig-C, single panel) left at 40% with the caption under it; the table right at 55%, 19 px cells; lower third clear.

Notes: Light-meson (π, ρ, ω, σ) exchange; one-pion exchange only where a D̄* is involved (D̄ → D̄π has no vertex), so ΣcD̄ binds through vector exchange and coupled channels. I = 1/2 attractive, I = 3/2 repulsive. Weakly bound, hence narrow: decay to J/ψ p needs the c and c̄ to recombine across the two hadrons. Which of Pc(4440)⁺ and Pc(4457)⁺ is 1/2⁻ depends on the sign of one spin-dependent term (Liu et al. and Du et al. differ); a measurement settles it (slide 20). The "candidate near 4380" is the narrow Σc*D̄ hint of Du et al., not the broad 2015 state. Review: Guo et al., RMP 90 (2018) 015004. Open issues, in speech only: binding energies depend on the regulator; a state far from every threshold would not fit. 1.75 min.

### 15 · figure · One hadron: compact or hadrocharmonium (1.5 min)

```yaml
space:
  at: [19.5, 6.2, -1.5]
  dist: 13
  yaw: -10
  pitch: 10
```

```md
# One hadron: compact or hadrocharmonium

<div class="row stage">
<div class="col-45">
<img src="/figures/hadron_compact.svg" style="height: 210px" alt="A compact five-quark state" />
<div class="caption under-fig"><b>Compact.</b> [cu][ud]c̄, held by colour–spin forces. Full SU(3) multiplets, isospin-3/2 partners included. Partners need not lie at thresholds. Positive parity allowed.</div>
</div>
<div class="col-45">
<img src="/figures/hadron_hadrocharmonium.svg" style="height: 210px" alt="Hadrocharmonium: a c c-bar core in a light-quark cloud" />
<div class="caption under-fig"><b>Hadrocharmonium.</b> A cc̄ core (χ<sub>c0</sub> or ψ(2S)) in a light-quark cloud. Decays back to the seed; open charm and η<sub>c</sub> p suppressed. P<sub>c</sub>(4312)⁺ would be 1/2⁺.</div>
</div>
</div>

<div class="src">Maiani, Polosa, Riquer, PLB 749 (2015) 289 · Eides, Petrov, Polyakov, arXiv:1904.11616</div>
```

Visual: NEW `hadron_compact.svg` and `hadron_hadrocharmonium.svg` (fig-C) side by side at 45% each, the same 1 fm bar as the molecule panel; a caption under each.

Notes: Diquark pictures (Maiani, Polosa, Riquer [cu][ud]c̄; Lebed's diquark–triquark [cq][c̄qq], PLB 749 (2015) 454, a different clustering with different spin couplings, one sentence) give full SU(3) multiplets including I = 3/2 partners, none observed, no reason for masses to lie at thresholds, and widths that come out large unless tuned. Hadrocharmonium (Eides, Petrov, Polyakov): Pc(4440)⁺ and Pc(4457)⁺ as ψ(2S) p with 1/2⁻ and 3/2⁻, Pc(4312)⁺ as χc0 p with J^P = 1/2⁺ and about 42 MeV binding (arXiv:1904.11616); decays dominated by hidden charm through the seed (arXiv:1811.01691); ηc p needs a heavy-quark spin flip and is suppressed. This is the picture with the cleanest decay test. 1.5 min.

### 16 · figure · Cusp or pole (1.25 min)

```yaml
space:
  at: [19.5, 6.2, -1.5]
  dist: 13
  yaw: 5
  pitch: 10
```

```md
# Cusp or pole

<div class="row stage">
<img src="/figures/lineshapes_cusp_vs_pole.svg" class="col-55" alt="A threshold cusp peaking at the threshold and a pole 5.6 MeV below it" />
<div class="col-40">
<div class="caption">A pure cusp peaks at the threshold. P<sub>c</sub>(4312)⁺ peaks 5.6 MeV below Σ<sub>c</sub>⁺D̄⁰ and is 10 MeV wide. JPAC's fit of the spectrum reads it as a pole, virtual or bound. Only the 2015 P<sub>c</sub>(4450)⁺ has a measured phase.</div>
<div class="caption mt-sm">Triangle candidate for P<sub>c</sub>(4457)⁺: Λ<sub>c</sub>(2595)⁺D̄⁰ at 4457.1 MeV. In LHCb's 2019 test it describes the data worse than a Breit–Wigner.</div>
</div>
</div>

<div class="src">Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001 · LHCb, PRL 122 (2019) 222001</div>
```

Visual: NEW `lineshapes_cusp_vs_pole.svg` (fig-D) left at 55%; two short captions right in the upper half.

Notes: Threshold cusp: a square-root branch point at a channel opening, lineshape fixed by the channel, needs strong coupling to be visible. Triangle singularities: three intermediate hadrons on shell at once; the peak position depends on the production process. The χc1 p threshold (4448.9 MeV) was the 2015 triangle candidate for Pc(4450)⁺ (Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502); after the split the live candidate is Λc(2595)⁺D̄⁰ for Pc(4457)⁺, tested by LHCb in 2019. No triangle candidate lands at 4312. JPAC's S-matrix fit of the 2019 spectrum cannot separate bound from virtual and prefers virtual; LHCb itself lists virtual states among the plausible explanations. Kinematic effects can sit on top of poles; the test is universality across production channels (slide 20). 1.25 min.

### 17 · table · What tells them apart (1.5 min)

```yaml
space:
  at: [19.5, 6.2, -1.5]
  dist: 13
  yaw: 20
  pitch: 10
```

```md
# What tells them apart

<table class="cmp stage">
<thead><tr><th></th><th>Molecule</th><th>Compact</th><th>Hadrocharmonium</th><th>Cusp or triangle</th></tr></thead>
<tbody>
<tr><th>J<sup>P</sup></th><td>1/2⁻ and 3/2⁻</td><td class="key">positive parity too</td><td>1/2⁺ for P<sub>c</sub>(4312)⁺</td><td>any</td></tr>
<tr><th>Open charm</th><td>large</td><td>allowed</td><td class="key">suppressed</td><td>none</td></tr>
<tr><th>η<sub>c</sub> p / J/ψ p</th><td class="key">≈ 3 (1/2⁻); 0 (3/2⁻)</td><td>model-dependent</td><td>suppressed</td><td>none</td></tr>
<tr><th>Peak across channels</th><td>same</td><td>same</td><td>same</td><td class="key">moves</td></tr>
</tbody>
</table>

<div class="caption mt-sm">Filled cells: the prediction that separates each picture.</div>

<div class="src">Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007</div>
```

Visual: one 4 × 5 HTML table at 88% width, 19 px cells, the decisive cell per column filled with the accent at 18% opacity (no bold); the world visible below.

Notes: Walk one row: ηc p. Heavy-quark spin symmetry for a ΣcD̄ (1/2⁻) molecule gives Γ(ηc p) ≈ 3 Γ(J/ψ p) (Voloshin; Sakai, Jing, Guo); for a ΣcD̄* (3/2⁻) state ηc p is forbidden in S-wave. Hadrocharmonium on a ψ(2S) or χc0 seed suppresses ηc p because it needs a heavy-quark spin flip. Open charm: molecules decay predominantly to Λc D̄⁽*⁾; in hadrocharmonium open charm is suppressed, less strongly than hidden charm is suppressed in a molecule (Eides et al., arXiv:1811.01691). Isospin-3/2 partners, widths and magnetic moments are on the backup table. 1.5 min.

### 18 · section · What Run 3 will measure (0.25 min)

```yaml
layout: section
hideInToc: true
space:
  at: future
```

```md
# What Run 3 will measure
```

Notes: the camera flies right past 2026 into the empty floor grid: this is where the next states go. 15 s.

### 19 · figure · Run 3 is complete (1.25 min)

```yaml
space:
  at: future
  yaw: -20
```

```md
# Run 3 is complete

<div class="row stage">
<img src="/figures/lhcb_lumi.svg" class="col-55" alt="LHCb recorded luminosity: Runs 1–2 and the three Run 3 years" />
<div class="card card-primary pad-tight col-40">

## The sample is final

26.7 fb⁻¹ recorded with a software trigger, three times the luminosity behind every pentaquark result. The LHC is in Long Shutdown 3. What remains is analysis, and the amplitude fit is the slow step.

</div>
</div>

<div class="src">LHCb recorded luminosity, Run 3 pp 2024–26; 2022–23 commissioning (about 1 fb⁻¹) not shown</div>
```

Visual: REVISED `lhcb_lumi.svg` (fig-I) left at 55%; one card right at 40%, upper half.

Notes: Per year: 2024 9.6 fb⁻¹ (the owner's Run 3 total 26.7 minus the published 2025 and 2026 values; public sources say "exceeded 9 fb⁻¹"; confirm against the LHCb public luminosity plot before the talk), 2025 11.8 fb⁻¹ (CERN), 2026 5.34 fb⁻¹ (LHCb outreach). Last pp collisions 16 May 2026; LS3 from 27 June 2026. At 13.6 TeV with the software trigger the Λb⁰ yield gain is larger than the factor three in luminosity; do not quote a yield. An amplitude analysis is a multidimensional fit of interfering resonances with a model built per channel; person-years each. No amplitude analysis of the Runs 1–2 J/ψ p K⁻ sample has been published; the J^P of the three narrow states are unmeasured. 1.25 min.

### 20 · content · Three amplitude analyses (2.25 min)

```yaml
space:
  at: future
  yaw: -10
```

```md
# Three amplitude analyses

<ol class="prog stage">
<li><span class="n">1</span><span class="m">J<sup>P</sup> of P<sub>c</sub>(4440)⁺ and P<sub>c</sub>(4457)⁺, and the coupling phases</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ p K⁻, Runs 1–3 · molecule: one 1/2⁻, one 3/2⁻</span></li>
<li><span class="n">2</span><span class="m">The missing family members</span><span class="ch">Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ (observed 2025), Ω<sub>b</sub>⁻ → J/ψ Ξ⁰ K⁻, B⁻ → J/ψ Ξ⁻ Λ̄ · predicted P<sub>ψs</sub><sup>Σ</sup>(4367), P<sub>ψss</sub><sup>N</sup>(4379)</span></li>
<li><span class="n">3</span><span class="m">Decays, and the same peak in other parents</span><span class="ch">Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ (observed 2024), η<sub>c</sub> p; Λ<sub>b</sub>⁰ → J/ψ p π⁻, B<sub>s</sub>⁰ → J/ψ p p̄ · molecule or hadrocharmonium; pole or cusp</span></li>
</ol>

<div class="closing">All on data already recorded. None published.</div>

<div class="src">LHCb, EPJC 85 (2025) 812 · LHCb, arXiv:2404.19510 · JHEP 11 (2025) 149 · names as in arXiv:2206.15233</div>
```

Visual: the three-row programme list in the upper 65% and left 70% of the canvas (accent numeral 28 px, measurement 22 px, channel line 18 px in `#8b97a6`); the empty future floor right and below. No cards.

Notes: Item 1: heavy-quark spin symmetry favours Pc(4440)⁺ = 1/2⁻, Pc(4457)⁺ = 3/2⁻ in the molecular picture (arXiv:2605.13344); hadrocharmonium orders them differently (Eides et al.); a 2026 two-channel Flatté refit of the published Runs 1–2 spectrum reads as molecular with real couplings and is not robust once the relative coupling phases float (arXiv:2608.25106): only a full amplitude analysis gives the phases. Item 2: Λb⁰ → J/ψ Ξ⁻ K⁺ and Ξb⁰ → J/ψ Ξ⁻ π⁺ observed on 5.4 fb⁻¹ (EPJC 85 (2025) 812, arXiv:2501.12779), amplitude analysis pending; the predicted ~10 MeV P_css state is narrower than the present resolution (Roca, Song, Oset, arXiv:2509.19840); heavy-pentaquark chiral perturbation theory predicts P_ψs^Σ(4367) and P_ψss^N(4379) in Ωb⁻ → J/ψ Ξ⁰ K⁻ and B⁻ → J/ψ Ξ⁻ Λ̄ (JHEP 11 (2025) 149, arXiv:2502.05495). Item 3: Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ observed in 2024 (arXiv:2404.19510) is the direct open-charm partner of the molecular picture; ηc → p p̄; Λb⁰ → J/ψ p π⁻ gave 3.1σ evidence in 2016; Bs⁰ → J/ψ p p̄ reaches only 4429 MeV, saw no Pc(4312)⁺ (p-value 0.5 per the paper) and Pc(4337)⁺ instead. A pole has the same mass in every channel; a triangle depends on the production process. Prompt-production rates are a further, model-dependent handle; do not lead with them. Close: three analyses, data recorded, none published. That is the Startertalk's purpose. 2.25 min.

### 21 · close · One hadron or two (0.5 min)

```yaml
layout: fact
space:
  at: future
  pitch: 14
  dist: 12
```

```md
# One hadron or two

Bound like a deuteron, or built like a proton.
```

Visual: fact layout, one 26 px regular-weight line under the title; the empty future floor with the pitch up.

Notes: One sentence, then stop: which predicted states exist, with which J^P and which decays, tells us whether QCD binds five quarks the way it binds a deuteron or the way it binds a proton. The data are recorded. 0.5 min.

### 22 · close · Thank you (0.25 min)

```yaml
layout: statement
space:
  at: wide
```

```md
# Thank you

<div class="mt-md">Mindaugas Šarpis · LHCb · Vilnius University</div>

<div class="src">Hadron data: P. Koppenburg, List of hadrons observed at the LHC, LHCb-FIGURE-2021-001 and updates (CC BY 4.0)</div>
```

Notes: Questions. Backups follow: thresholds, the full comparison, related LHCb results, references. 15 s.

### 23 · backup · Backup: thresholds (0 min)

```yaml
hideInToc: true
```

```md
# Backup: thresholds

| pair | threshold (MeV) | state | offset (MeV) |
|---|---|---|---|
| Σ<sub>c</sub>⁺D̄⁰ | 4317.5 | P<sub>c</sub>(4312)⁺ | −5.6 |
| Σ<sub>c</sub>(2520)⁺D̄⁰ | 4382.2 | P<sub>c</sub>(4380)⁺, broad | −2.2 |
| Σ<sub>c</sub>⁺D̄*⁰ | 4459.5 | P<sub>c</sub>(4440)⁺, P<sub>c</sub>(4457)⁺ | −19.2, −2.2 |
| Σ<sub>c</sub>(2520)⁺D̄*⁰ | 4524.3 | none | none |
| Ξ<sub>c</sub>⁺D⁻ / Ξ<sub>c</sub>⁰D̄⁰ | 4337.4 / 4335.3 | P<sub>cs</sub>(4338)⁰ | +0.8 |
| Ξ<sub>c</sub>⁰D̄*⁰ / Ξ<sub>c</sub>⁺D*⁻ | 4477.3 / 4478.0 | P<sub>cs</sub>(4459)⁰ | −18.5 |
| Λ<sub>c</sub>(2595)⁺D̄⁰ | 4457.1 | triangle candidate, P<sub>c</sub>(4457)⁺ | none |
| χ<sub>c1</sub> p | 4448.9 | triangle candidate, 2015 P<sub>c</sub>(4450)⁺ | none |

<div class="src">PDG 2024: Σ<sub>c</sub>(2455)⁺ 2452.65, Σ<sub>c</sub>(2520)⁺ 2517.4, Ξ<sub>c</sub>⁺ 2467.71, Ξ<sub>c</sub>⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85, D*⁻ 2010.26, Λ<sub>c</sub>(2595)⁺ 2592.25, χ<sub>c1</sub> 3510.67 MeV · Σ<sub>c</sub>⁺⁺D⁻ 4323.6 and Σ<sub>c</sub>⁺⁺D*⁻ 4464.2 lie 6 and 5 MeV higher</div>
```

Notes: for the question "which charge combination did you use". The 8-row table is allowed here because it is a backup.

### 24 · backup · Backup: the full comparison (0 min)

```yaml
hideInToc: true
```

```md
# Backup: the full comparison

| observable | Molecule | Compact | Hadrocharmonium | Cusp or triangle |
|---|---|---|---|---|
| J<sup>P</sup> | 1/2⁻, 3/2⁻ (S-wave) | many, positive parity too | 1/2⁺ (χ<sub>c0</sub> p); 1/2⁻, 3/2⁻ (ψ(2S) p) | any |
| Widths | narrow, about 10 MeV | broad unless tuned | narrow | set by kinematics |
| Open charm Λ<sub>c</sub> D̄⁽*⁾ | large, possibly dominant | allowed | suppressed, less than for a molecule | none |
| Γ(η<sub>c</sub> p) / Γ(J/ψ p) | ≈ 3 for 1/2⁻; 0 in S-wave for 3/2⁻ | model-dependent | suppressed | none |
| Isospin-3/2 partners | none expected | predicted | none | none |
| Peak position across channels | same | same | same | moves |
| Magnetic moments | differ from compact in sign and size | differ from molecule | none | none |

<div class="src">Chen et al., Phys. Rept. 639 (2016) 1 · Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007 · Eides, Petrov, Polyakov, arXiv:1811.01691 · EM observables: arXiv:2603.19151, arXiv:2510.26893</div>
```

Notes: rows 1–6 are amplitude-analysis observables in recorded data; magnetic moments need polarisation observables and are further off.

### 25 · backup · Related LHCb results (0 min)

```yaml
hideInToc: true
```

```md
# Related LHCb results

- 2016: model-independent confirmation; Λ* reflections alone cannot describe the data. PRL 117 (2016) 082002
- 2016: Λ<sub>b</sub>⁰ → J/ψ p π⁻, 3.1σ evidence for P<sub>c</sub> contributions. PRL 117 (2016) 082003
- 2022: B<sub>s</sub>⁰ → J/ψ p p̄, 797 ± 31 decays; no P<sub>c</sub>(4312)⁺ signal; P<sub>c</sub>(4337)⁺ at 3.1–3.7σ. PRL 128 (2022) 062001
- 2024: Λ<sub>b</sub>⁰ → Σ<sub>c</sub>⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ observed, the open-charm channel. arXiv:2404.19510
- 2025: Λ<sub>b</sub>⁰ → J/ψ Ξ⁻ K⁺ and Ξ<sub>b</sub>⁰ → J/ψ Ξ⁻ π⁺ observed on 5.4 fb⁻¹; amplitude analysis pending. EPJC 85 (2025) 812
- Kinematic ceilings: m(J/ψ p) ≤ 4341 MeV in B⁰ → J/ψ p p̄ and ≤ 4429 MeV in B<sub>s</sub>⁰ → J/ψ p p̄; neither reaches P<sub>c</sub>(4440)⁺ or P<sub>c</sub>(4457)⁺
```

Notes: the results an LHCb room will ask about that the main line skips. Ceilings: m(B⁰) − m(p) = 4341.4 MeV, m(Bs⁰) − m(p) = 4428.7 MeV (PDG 2024).

### 26 · backup · References (0 min)

```yaml
hideInToc: true
```

```md
# References

<div class="refs">

**LHCb.** PRL 115 (2015) 072001 [1507.03414] · PRL 117 (2016) 082002 [1604.05708] · PRL 117 (2016) 082003 [1606.06999] · PRL 122 (2019) 222001 [1904.03947] · Sci. Bull. 66 (2021) 1278 [2012.10380] · PRL 128 (2022) 062001 [2108.04720] · PRL 131 (2023) 031901 [2210.10346] · naming: 2206.15233 · Λ<sub>b</sub>⁰ → Σ<sub>c</sub> D̄ K: 2404.19510 · J/ψ Ξ⁻ K⁺: EPJC 85 (2025) 812 [2501.12779] · review: 2403.04051

**Theory.** Gell-Mann, Phys. Lett. 8 (1964) 214 · Zweig, CERN-TH-401, 412 (1964) · Guo et al., RMP 90 (2018) 015004 · Olsen, Skwarnicki, Zieminska, RMP 90 (2018) 015003 · Chen et al., Phys. Rept. 639 (2016) 1 · Liu et al., PRL 122 (2019) 242001 · Du et al., PRL 124 (2020) 072001 · Fernández-Ramírez et al. (JPAC), PRL 123 (2019) 092001 · Voloshin, PRD 100 (2019) 034020 · Sakai, Jing, Guo, PRD 100 (2019) 074007 · Eides, Petrov, Polyakov, 1811.01691; 1904.11616 · Maiani, Polosa, Riquer, PLB 749 (2015) 289 · Lebed, PLB 749 (2015) 454 · Guo, Meißner, Wang, Yang, PRD 92 (2015) 071502 · JHEP 11 (2025) 149 [2502.05495] · 2509.19840 · 2605.13344 · 2608.25106

**Data.** LEPS, PRL 91 (2003) 012002 · PDG 2008, review “Pentaquarks” · PDG 2024 · P. Koppenburg, LHCb-FIGURE-2021-001 and updates (CC BY 4.0) · LHCb public luminosity plots

</div>
```

Notes: serves the PDF export and questions.

## 5. New and revised figures

All in `scripts/make_figures.py` unless stated; deterministic (existing rcParams, `svg.hashsalt` "startertalk-2026", transparent background); colours INK `#e6e6e6`, MUTED `#a8a8a8`, FAINT `#6b6b6b`, BLUE `#3987e5`, ORANGE `#d95926`. Replace the mass dict `M` with PDG 2024 values (MeV): Σc(2455)⁺ 2452.65, Σc(2455)⁺⁺ 2453.97, Σc(2520)⁺ 2517.4, Ξc⁺ 2467.71, Ξc⁰ 2470.44, D⁰ 1864.84, D⁻ 1869.66, D*⁰ 2006.85, D*⁻ 2010.26, Λc(2595)⁺ 2592.25, χc1 3510.67, Λb⁰ 5619.60, J/ψ 3096.90, p 938.27, K⁻ 493.68. Keep `thr()` (half-up rounding).

**fig-A `quark_model_singlets.svg`** (slide 2). `fig_singlets()`: figsize (11, 3.6), four equal panels, axis off, xlim/ylim [−1, 1]. Panel k draws N_k filled circles (radius 0.30 axes units) at the vertices of a regular N-gon of circumradius 0.52 centred on (0, 0), N = 2, 3, 4, 5, first vertex at 90°; for N = 2 place them at (±0.40, 0). Quark colours cycle red `#e5484d`, green `#30a46c`, blue `#3987e5`; antiquarks use the same fill with a 2.5-pt INK ring and a bar over the letter. Letters inside the circles (fontsize 17, INK): q / q̄. Labels under each panel (fontsize 19, INK): "q q̄  meson", "q q q  baryon", "q q q̄ q̄  tetraquark", "q q q q q̄  pentaquark". No "colour singlet" wording (1964 predates colour). No footer in the SVG (the slide footer carries the references).

**fig-B `argand_schematic.svg`** (slide 9; fallback stop figure for Pc(4450)⁺). `fig_argand()`: A(m) = (Γ/2) / (M − m − iΓ/2), M = 4449.8 MeV, Γ = 39 MeV (LHCb 2015), m on [M − 2Γ, M + 2Γ], 1000 points. figsize (11, 4.6), two panels (width ratios 1:1.3). Left (square, xlim [−0.62, 0.62], ylim [−0.08, 1.12]): Re A vs Im A as a MUTED circle lw 1.2; six BLUE markers (ms 11, mec INK) at the centres of six equal bins spanning [M − Γ, M + Γ] (bin width Γ/3), joined by "-|>" annotate arrows in increasing m (counter-clockwise); labels (fontsize 15) "m < M" at the first, "m = M" at the top, "m > M" at the last; axes labelled "Re A", "Im A"; ticks off. Right: |A|² normalised to 1 vs m (BLUE lw 2.4), the six bins shaded alternately alpha 0.10 / 0.22, dashed vertical at M labelled "M", x label "m(J/ψ p) (MeV)", y ticks off. Title (fontsize 15, ORANGE): "schematic Breit–Wigner, M = 4450, Γ = 39 MeV; not the LHCb data".

**fig-C hadron pictures** (`hadron_pictures_2.svg` slide 4; `hadron_molecule.svg` slide 14; `hadron_compact.svg`, `hadron_hadrocharmonium.svg` slide 15). `fig_pictures()`: one drawing routine per panel on axes with xlim/ylim [−3, 3], axis off, aspect equal; 1 fm = 1.0 axis unit; each panel carries a 1 fm scale bar bottom-left (INK, lw 2, label "1 fm", fontsize 14). Colours: c/c̄ BLUE, light quarks INK, antiquarks with a white ring, diquark brackets ORANGE, cloud BLUE alpha 0.10. MOLECULE (title "hadronic molecule  Σc D̄"): Σc⁺ as three quark circles (c, u, d; radius 0.18) inside a dashed circle radius 0.45 at (−0.9, 0); D̄⁰ as (c̄, u) inside a dashed circle radius 0.40 at (+0.9, 0) (centre separation 1.8 fm); a dashed MUTED line between the centres labelled "ρ, ω, σ exchange (π only with a D̄*)"; caption (fontsize 13, MUTED, two lines): "r ≈ ħc/√(2μE_B); μ = 1059 MeV, E_B = 5.6 MeV gives ≈ 1.8 fm" and "deuteron: E_B = 2.2 MeV, r ≈ 4.3 fm". COMPACT (title "compact  [cu][ud] c̄"): five quark circles inside one solid INK circle radius 0.5 at the origin; the [cu] and [ud] pairs bracketed by thin ORANGE arcs; caption "colour–spin forces; size 0.5–0.8 fm (a typical hadron)". HADROCHARMONIUM (title "hadrocharmonium"): a solid BLUE circle radius 0.22 at the origin containing c, c̄ labelled "χc0 or ψ(2S)" (fontsize 13), inside a translucent circle radius 0.9 labelled "light-quark cloud (uud)"; caption "QCD van der Waals force". Footer on every file (fontsize 12, FAINT): "sizes schematic; only the 1 fm bar is to scale". Single-panel files figsize (4.2, 4.2). `hadron_pictures_2.svg` = molecule + compact side by side, figsize (9, 4.2), panel titles "two hadrons" / "one hadron", circles WITHOUT letters, no exchange label, no radius caption, footer kept.

**fig-D `lineshapes_cusp_vs_pole.svg`** (slide 16). `fig_lineshapes()`: figsize (11, 4.6), single axes, m from 4280 to 4360 MeV, 1600 points. m_th = 4317.5 MeV (Σc(2455)⁺ + D⁰), reduced mass μ = 2452.65·1864.84/4317.49 = 1059.4 MeV. k(m) = √(2μ(m − m_th)) for m ≥ m_th, k = i√(2μ(m_th − m)) below. Curve 1 "threshold cusp, no bound state (a = −1 fm)": |A|² with A = 1/(−1/a − ik), a = −1.0 fm = −1/197.327 MeV⁻¹, ORANGE lw 2.4; it peaks at m_th. Curve 2 "Breit–Wigner at the Pc(4312)⁺ mass, schematic": |A|² with M = 4311.9, Γ = 9.8 MeV, BLUE lw 2.4. Both normalised to peak 1. Dashed vertical MUTED line at 4317.5 labelled "Σc⁺ D̄⁰  4317.5"; a horizontal "<->" annotate arrow between the two peaks at y = 1.06 labelled "5.6 MeV". Legend upper left fontsize 15; x label "m(J/ψ p) (MeV)" fontsize 17; y ticks off, y label "intensity (arb.)". Title (fontsize 15, ORANGE): "schematic lineshapes: a cusp peaks at the threshold, a pole below it".

**fig-E `dalitz_schematic.svg`** (slide 8). `fig_dalitz()`: figsize (7.2, 6.2), x = m²(K⁻p) (GeV²), y = m²(J/ψ p) (GeV²). For s = m²(Kp) on [2.0505, 6.3640] GeV² (800 points): E_p* = (s + m_p² − m_K²)/(2√s), E_ψ* = (M² − s − m_ψ²)/(2√s); y_± = (E_p* + E_ψ*)² − (√(E_p*² − m_p²) ∓ √(E_ψ*² − m_ψ²))²; fill between y_− and y_+ with FAINT alpha 0.25 and outline INK lw 1.2 (y spans 16.28 to 26.28 GeV²). Vertical ORANGE bands (alpha 0.35) clipped to the boundary at m² of Λ(1520) 2.309 (Γ 15.6 MeV), Λ(1690) 2.856 (Γ 70), Λ(1820) 3.312 (Γ 80), Λ(2100) 4.410 (Γ 200) with half-width m·Γ in GeV² and a minimum drawn half-width of 0.06 GeV²; labels above the plot. Horizontal BLUE bands at m² = 18.592 (Pc(4312)⁺), 19.716 (Pc(4440)⁺), 19.868 (Pc(4457)⁺) with drawn half-width 0.12 GeV² (annotate "widths exaggerated ×10"), labels at the right edge. Axis labels fontsize 17 ("m²(K⁻p) (GeV²)", "m²(J/ψ p) (GeV²)"), ticks 15. No footer in the SVG.

**fig-F `lambda_b_decay.svg` (revised)** (slide 7). `fig_decay()`: figsize (10.5, 4.6); vertex and particle labels fontsize 22, quark-content labels 16 (was 13.5), panel titles 18; remove the bottom `fig.text` caption; write "cc̄" unspaced, "Λb⁰" as mathtext `r'$\Lambda_b^0$'`, "Pc⁺" as `r'$P_c^+$'`; panel titles "pentaquark path: peak in m(J/ψ p)" / "Λ* path: peak in m(p K⁻)". Colours unchanged.

**fig-G paper PNGs** (slides 8, 9, 10, 11, 12; new `scripts/crop_figures.py`, called at the end of `scripts/fetch_figures.sh`). Fetch, in addition to the six existing files: `LHCb-PAPER-2015-029/hidef_DoubleArgand-final.png`, `LHCb-PAPER-2015-029/hidef_dlz.png`, `LHCb-PAPER-2019-014/hidef_mjpsip-spectrum-19.png`, `LHCb-PAPER-2019-014/hidef_pentaquarks_nominal_fit_and_thresholds.png` (all verified present on 2026-09-09; 1200 px wide). `crop_figures.py` (PIL, deterministic): for `DoubleArgand-final.png` first crop the box (0, 0, 0.505·W, H) = panel (a), Pc(4450)⁺, then for every paper PNG trim the white margin (bbox of pixels darker than 245 on any channel, plus a 12 px pad), cap the width at 1600 px, and save as `<name>_crop.png` beside the original (the untrimmed originals stay for reference). The HUD figure map (hadrons.py `FIGURES`) points at the `_crop` files; `dlz.png` is used on slide 8 directly.

**fig-H `pc_thresholds.svg` (revised)** (slide 11). `fig_thresholds()`: thresholds from the PDG 2024 dict: Σc⁺D̄⁰ 4317.5, Σc(2520)⁺D̄⁰ 4382.2, Σc⁺D̄*⁰ 4459.5, Σc(2520)⁺D̄*⁰ 4524.3 (family c, MUTED at full opacity, labels along the top); Ξc⁺D⁻ 4337.4 (with a fainter tick at Ξc⁰D̄⁰ 4335.3), Ξc⁰D̄*⁰ 4477.3 (family s, ORANGE, labels along the bottom). J/ψ p row: Pc(4312)⁺ 4311.9 Γ 9.8 → −5.6; Pc(4440)⁺ 4440.3 Γ 20.6 → −19.2; Pc(4457)⁺ 4457.3 Γ 6.4 → −2.2; Pc(4380)⁺ 4380 Γ 205 as the faint broad band labelled "Pc(4380)⁺, broad, candidate"; NEW Pc(4337)⁺ at 4337.0, Γ 29, hollow marker (mfc "none", mec BLUE, mew 2) with a band at alpha 0.20, label "Pc(4337)⁺ · evidence · Bs⁰ → J/ψ p p̄" in MUTED fontsize 14 placed below the row clear of Pc(4312)⁺, offset text "no threshold nearby". J/ψ Λ row: Pcs(4338)⁰ 4338.2 Γ 7.0 → +0.8 (relative to Ξc⁺D⁻); Pcs(4459)⁰ 4458.8 Γ 17.3 → −18.5 (relative to Ξc⁰D̄*⁰). Old-style names with mathtext subscripts (`r'$P_c(4312)^+$'`, `r'$P_{cs}(4338)^0$'`). Type: state labels 17, threshold labels 16, row labels 21, ticks 17; figsize (12, 5.6). Offsets printed with one decimal and sign. `__main__` prints the threshold table for the backup slide.

**fig-I `lhcb_lumi.svg` (revised)** (slide 19). `fig_lumi()`: bars Runs 1–2 (2011–18) 9.0; 2024 9.6; 2025 11.8; 2026 5.3 (fb⁻¹); value labels fontsize 20; bracket text "Run 3 pp 2024–26: 26.7 fb⁻¹" fontsize 19; first-bar annotation "every pentaquark result so far: this 9 fb⁻¹" fontsize 16; y label "recorded luminosity (fb⁻¹)"; footer line (fontsize 13, MUTED): "LHCb recorded luminosity; 2025: 11.8 fb⁻¹ (CERN); 2026: 5.34 fb⁻¹ (LHCb); 2024: confirm against the LHCb public luminosity plot". figsize (9.5, 5.2).

## 6. CSS changes (`talks/2026_09_00_Startertalk/styles/index.css`)

1. Delete the top block `.card ul, .card ol { font-size: 0.85rem … }`, `.card li`, `.card h2 + ul` (replaced by the scale below). Delete every per-slide `<style>` block in deck.md.
2. Typeface: `.slidev-layout, .slidev-layout .card, .slidev-layout table, .slidev-layout .caption, .slidev-layout .src { font-family: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }` (the faces are loaded by `HadronSpace.vue`'s `@fontsource` imports; no new import). PT Serif is used nowhere in this deck.
3. Headings: `.slidev-layout h1 { font-size: 42px !important; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 18px; }` (the theme's `text-4xl` rule has equal specificity, hence `!important`; the cover rules below already carry `!important` and higher specificity). `.slidev-layout.section h1 { font-size: 44px !important; font-weight: 600 !important; line-height: 1.15 !important; }` `.slidev-layout.statement h1 { font-size: 56px !important; font-weight: 700 !important; }`.
4. Cards: `.card { max-width: 60ch; font-size: 20px; }` `.card h2 { font-size: 22px; font-weight: 600; line-height: 1.25; margin: 0 0 8px; padding-left: 0; }` `.card p, .card li { font-size: 20px; line-height: 1.35; }` `.card ul, .card ol { font-size: 20px; line-height: 1.35; padding-left: 1.1em; margin: 0.35rem 0 0; }` `.card li { margin: 0.15em 0; }`. Keep the existing translucent `.card` fill, `::before` removal and card-in animation. Reduce `.card { backdrop-filter: blur(6px); }`.
5. Captions and quote: `.caption { font-size: 20px; line-height: 1.35; max-width: 60ch; color: #e6e9ee; }` `.quote-line { font-size: 22px; font-weight: 500; line-height: 1.35; max-width: 60ch; color: #f2f5f9; }` `.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; max-width: none; }` `.two-col > div { max-width: 60ch; }` `.under-fig { margin-top: 8px; }` `.closing { font-size: 22px; font-weight: 500; margin-top: 6px; }` `.refs { font-size: 15px; line-height: 1.4; column-count: 2; column-gap: 32px; }`.
6. Layout budget (replaces the `padding-bottom: 33%` idea): `.row { display: flex; gap: 28px; align-items: flex-start; }` `.stage { max-height: 340px; }` `.col-40 { flex: 0 0 40%; max-width: 40%; } .col-45 { flex: 0 0 45%; max-width: 45%; } .col-50 { flex: 0 0 50%; max-width: 50%; } .col-55 { flex: 0 0 55%; max-width: 55%; } .col-60 { flex: 0 0 60%; max-width: 60%; }` (named `col-` because UnoCSS already defines `w-40` = 10rem). `img.col-55, img.col-45 { height: auto; }`.
7. Tables: `.slidev-layout table { width: auto; font-size: 19px; border-collapse: collapse; margin: 0; }` `.slidev-layout th, .slidev-layout td { padding: 5px 12px; line-height: 1.3; white-space: nowrap; text-align: left; vertical-align: top; }` `.slidev-layout th { font-weight: 600; color: #c9d1da; }` `.slidev-layout tbody th { font-weight: 500; }` `table.cmp { width: 88%; }` `td.key { background: rgba(125, 211, 252, 0.18); border-radius: 6px; }`. `hideInToc` backup tables: `.slidev-layout.backup table { font-size: 17px; }` (add `class: backup` to the four backup slides' frontmatter).
8. Footer: `.src { position: absolute; left: 44px; bottom: 22px; font-size: 12px; line-height: 1.3; opacity: 0.7; letter-spacing: 0.02em; max-width: 86%; color: #c9d1da; }` (replaces every `text-xs opacity-60` line).
9. Paper figures on slides: `.paper { background: #fff; border-radius: 6px; padding: 4px; opacity: 0.94; }`.
10. Programme list: `.prog { list-style: none; padding: 0; margin: 0; max-width: 70%; }` `.prog li { display: grid; grid-template-columns: 44px 1fr; gap: 4px 14px; margin: 0 0 18px; }` `.prog .n { grid-row: 1 / span 2; color: #7dd3fc; font-size: 28px; font-weight: 700; line-height: 1; }` `.prog .m { font-size: 22px; font-weight: 600; line-height: 1.25; }` `.prog .ch { grid-column: 2; font-size: 18px; line-height: 1.3; color: #8b97a6; }`.
11. Stop fade: replace `html[data-space-stop="1"] .slidev-page .slidev-layout { opacity: 0.05; filter: blur(3px); }` with `{ opacity: 0; filter: none; }` (keep the 0.55 s transition).
12. Cover: keep the existing cover rules; add `.slidev-layout.cover .src { position: static; white-space: nowrap; font-size: 11px; margin-top: 28px; }`; `.slidev-layout.cover::after { content: ''; position: absolute; inset: 0; background: radial-gradient(60% 55% at 32% 50%, rgba(5, 5, 7, 0.55), transparent 70%); pointer-events: none; z-index: 0; }` and `.slidev-layout.cover .cover-content { position: relative; z-index: 1; }`.
13. Fact: `.slidev-layout.fact h1 { font-size: 64px !important; font-weight: 700 !important; letter-spacing: -0.02em; }` `.slidev-layout.fact h1 + p { font-size: 26px !important; font-weight: 400 !important; color: #c9d1da; opacity: 1 !important; max-width: 60ch; margin: 18px auto 0 !important; }`. Statement/thank-you: `.slidev-layout.statement .mt-md { font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: #8b97a6; }` `.slidev-layout.statement .src { position: static; margin-top: 28px; }`.

## 7. Code changes outside deck.md

1. **`deck.md` frontmatter**: remove the `addons:` list and the `videos:` block (no videos in this talk); keep `aspectRatio: 16/9`, `routerMode: hash`, default `canvasWidth`; `package.json` and `videos.toml` are left as they are. Add `class: backup` and `hideInToc: true` to slides 23–26.
2. **`scripts/hadrons.py`**: add an `OVERRIDES` dict keyed by id, applied in `build()` after the LHC rows, additions and landmarks are assembled (`for s in states: s.update(OVERRIDES.get(s["id"], {}))`), with exactly these records:
   - `Pc(4380)`: `mass 4380, mass_err 8, mass_text "4380 ± 8 ± 29", width_text "205 ± 18 ± 86", significance "9σ", channel "Λb⁰ → J/ψ p K⁻", status "candidate", status_year 2019, status_before "observed", note "neither confirmed nor excluded by the 2019 fit", note_year 2019, ref "PRL 115 (2015) 072001"`.
   - `Pc(4450)`: `mass 4449.8, mass_err 1.7, mass_text "4449.8 ± 1.7 ± 2.5", width_text "39 ± 5 ± 19", significance "12σ", channel "Λb⁰ → J/ψ p K⁻", status "superseded", status_year 2019, status_before "observed", note "resolved into Pc(4440)⁺ and Pc(4457)⁺ in 2019", note_year 2019, ref "PRL 115 (2015) 072001"`.
   - `Pc(4312)`: `mass 4311.9, mass_err 0.7, mass_text "4311.9 ± 0.7", width_text "9.8 ± 2.7", significance "7.3σ", channel "Λb⁰ → J/ψ p K⁻", note "", ref "PRL 122 (2019) 222001"`.
   - `Pc(4440)`: `mass 4440.3, mass_err 1.3, mass_text "4440.3 ± 1.3", width_text "20.6 ± 4.9", significance "two peaks over one: 5.4σ", channel "Λb⁰ → J/ψ p K⁻", note "Pc(4450)⁺ resolved", ref "PRL 122 (2019) 222001"`.
   - `Pc(4457)`: `mass 4457.3, mass_err 0.6, mass_text "4457.3 ± 0.6", width_text "6.4 ± 2.0", significance "two peaks over one: 5.4σ", channel "Λb⁰ → J/ψ p K⁻", note "Pc(4450)⁺ resolved", ref "PRL 122 (2019) 222001"`.
   - `Pc(4337)`: `mass 4337, mass_err 7, mass_text "4337 (+7 −4) (+2 −2)", width_text "29 (+26 −12) (+14 −14)", significance "3.1–3.7σ", channel "Bs⁰ → J/ψ p p̄", note "no Pc(4312)⁺ signal in this channel", ref "PRL 128 (2022) 062001"`.
   - `Pcs(4459)`: `mass_text "4458.8 ± 2.9 (+4.7 −1.1)", width_text "17.3 ± 6.5 (+8.0 −5.7)", significance "3.1σ", channel "Ξb⁻ → J/ψ Λ K⁻", note "two overlapping peaks not excluded"`.
   - `Pcs(4338)`: `mass_err 0.7, mass_text "4338.2 ± 0.7 ± 0.4", width_text "7.0 ± 1.2 ± 1.3", significance "> 15σ", channel "B⁻ → J/ψ Λ p̄", note "J = 1/2; positive parity excluded at 90% CL", ref "PRL 131 (2023) 031901"`.
   - `Theta(1540)`: `date_text "2003", mass_text "1540 ± 10", significance "4.6σ (LEPS)", channel "γn → K⁺K⁻n", note "not confirmed by later experiments (PDG 2008)", ref "LEPS, PRL 91 (2003) 012002"`.
   Also: (a) write `label_html` for every state whose id starts with `Pc`/`Pcs` (`P<sub>c</sub>(4312)⁺`, `P<sub>cs</sub>(4338)⁰`) and use `label` (never `name`, which renders "Pcc̄") in every note string; (b) shorten every `ref` to journal style (`Phys. Rev. Lett.` → `PRL`, `Physics Letters B` → `PLB`) in a `short_ref()` applied to all states; (c) replace `FIGURES` with: `Pc(4380)` → `LHCb-PAPER-2015-029_mjpsip-default_crop.png`, caption "LHCb, PRL 115 (2015) 072001 · m(J/ψ p), fit projection"; `Pc(4450)` → `LHCb-PAPER-2015-029_DoubleArgand-final_crop.png`, caption "LHCb, PRL 115 (2015) 072001 · Argand diagram, Pc(4450)⁺, six bins of m(J/ψ p)"; `Pc(4312)` → `LHCb-PAPER-2019-014_mjpsip-spectrum-all_crop.png`, caption "LHCb, PRL 122 (2019) 222001 · m(J/ψ p), Runs 1–2"; `Pc(4440)` → `LHCb-PAPER-2019-014_pentaquarks_nominal_fit_and_thresholds_crop.png`, caption "LHCb, PRL 122 (2019) 222001 · fit with three narrow states and the Σc⁺D̄⁽*⁾⁰ thresholds"; `Pc(4457)` → `LHCb-PAPER-2019-014_mjpsip-spectrum-19_crop.png`, caption "LHCb, PRL 122 (2019) 222001 · m(J/ψ p) for m(Kp) > 1.9 GeV"; `Pc(4337)` → `LHCb-PAPER-2021-018_Fig2e_crop.png`, caption "LHCb, PRL 128 (2022) 062001 · m(J/ψ p) in Bs⁰ → J/ψ p p̄"; `Pcs(4459)` → `LHCb-PAPER-2020-039_Fig3b_crop.png`, caption "LHCb, Sci. Bull. 66 (2021) 1278 · m(J/ψ Λ) in Ξb⁻ → J/ψ Λ K⁻"; `Pcs(4338)` → `LHCb-PAPER-2022-031_Fig3a_crop.png`, caption "LHCb, PRL 131 (2023) 031901 · m(J/ψ Λ) in B⁻ → J/ψ Λ p̄"; (d) extend `check()` to assert `mass_text`, `width_text`, `significance` and `channel` on all eight `PENTAQUARKS`; (e) regenerate with `python3 scripts/hadrons.py --check` (or `--cached <saved page>` offline).
3. **`scripts/fetch_figures.sh`**: add the four `get` lines (`LHCb-PAPER-2015-029 DoubleArgand-final`, `LHCb-PAPER-2015-029 dlz`, `LHCb-PAPER-2019-014 mjpsip-spectrum-19`, `LHCb-PAPER-2019-014 pentaquarks_nominal_fit_and_thresholds`) and finish with `python3 "$(dirname "$0")/crop_figures.py"`; add `scripts/crop_figures.py` as specified under fig-G.
4. **`scripts/make_figures.py`**: PDG 2024 mass dict, the five new figure functions and the three revisions from section 5; `__main__` runs all and prints the threshold table.
5. **`components/HadronSpace.vue`**: (a) `const asof = computed(() => Number(frontmatterSpace.value?.asof) || 9999)` and a `shown` computed that copies `stopState` and, when `status_year > asof`, replaces `status` with `status_before || 'observed'` and, when `note_year > asof`, blanks `note`; (b) render the name with `v-html="s.label_html || s.label || s.name"`; (c) rows in this order: date (`s.date_text || fmtDate(s.date)`), mass (`s.mass_text ? s.mass_text + ' MeV' : fmtMass(s)`), width (`s.width_text + ' MeV'`, row omitted when absent), significance (omitted when absent), channel (omitted when absent), quarks, status (status only; `note` on its own line under it in the dim colour), reference; (d) pass `plain` to the figure `SpacePanel`; (e) scoped CSS: `.hud { grid-template-columns: 340px 1fr; }` `.hud-name { font-size: 36px; }` `.hud-rows { font-size: 15px; gap: 6px 16px; }` `.hud-rows dt { font-size: 12px; }` `.hud-figure { max-width: 560px; }` `.space-figure { max-height: 420px; opacity: 0.94; }`.
6. **`components/SpacePanel.vue`**: add prop `plain: { type: Boolean, default: false }`; `.space-kicker` 11 px; when `plain`, apply `text-transform: none; letter-spacing: 0.04em; font-size: 12px` so "m(J/ψ p)" is not uppercased to "M(J/Ψ P)"; the record panel keeps the small-caps "state" kicker.
7. **`components/HaloLayer.vue`**: replace the constant `DOTS = 190` with a per-element count `Math.round(Math.min(190, Math.max(60, perimeter / 14)))` computed from the rect on first seed; when drawing, skip a dot whose point lies inside any other tracked rect expanded by `SPREAD + 3` px, so two abutting cards do not produce a speckled band.
8. **`CLAUDE.md`, section "Hadron space (Startertalk)"**: document the new frontmatter key `space.asof: <year>` (HUD renders status and note as of that year) and the record fields `mass_text`, `width_text`, `significance`, `channel`, `date_text`, `label_html`, `status_year`, `status_before`, `note_year`; note that stop figures are the `_crop.png` files produced by `scripts/crop_figures.py`.

## 8. Decisions taken (the owner was not available)

1. **2024 luminosity 9.6 fb⁻¹ kept.** It is the owner's Run 3 total (26.7) minus the published 2025 (11.8, CERN) and 2026 (5.34, LHCb) values; public statements confirm only "exceeded 9 fb⁻¹". The chart footer and the slide-19 note say to confirm it against the LHCb public luminosity plot before the talk.
2. **Argand on slide 9 and at the stop.** The schematic (fig-B) stays on the slide as the teaching picture; stop 2 shows the paper's own Argand (panel (a) of `DoubleArgand-final.png`, verified on the public page). The schematic is the fallback only if the fetch fails.
3. **Slide 8 shows the schematic Dalitz plane and the paper's Dalitz plot side by side** ("what we expect, what we see"): the real plot exists (`dlz.png`) and an LHCb room expects it; the schematic carries the labels the back row needs.
4. **Pc(4380)⁺ status "candidate", no PDG star rating on screen or in the HUD** (the star could not be verified); the note says "neither confirmed nor excluded by the 2019 fit".
5. **The Bs⁰ → J/ψ p p̄ coupling bound (0.043) is dropped**; "no Pc(4312)⁺ signal" is on the backup and "p-value 0.5 per the paper" is in the slide-20 note only.
6. **Θ⁺(1540) is the ninth stop** (slide 3, `clicks: 1`); the record exists, the figure panel is `v-if`'d, so no figure is needed; its HUD date prints "2003" via `date_text`.
7. **Old-style names everywhere**, with real subscripts; LHCb's 2022 names appear only in the footers of slides 12 and 20 (the judge's naming-footer risk).
8. **Word ceiling is 60**, tables and the programme list excluded, replacing Visual-first's decorative 40; every body above was counted.
9. **HUD precision is solved with prebuilt strings** (`mass_text`, `width_text` from hadrons.py) rather than a JS formatter: deterministic, reviewable, handles asymmetric and systematic errors with no parsing.
10. **2019 stop 2 uses the paper's nominal-fit-with-thresholds figure** (three narrow states, Σc⁺D̄⁽*⁾⁰ lines): it previews slide 11 by a minute, but it is LHCb's own 2019 figure and gives each of the three stops a distinct plot.
11. **Width utilities are `.col-40 … .col-60`**, because UnoCSS already defines `w-40` (= 10rem) and the proposals' `.w-40` would have been overridden.
12. **The `padding-bottom: 33%` rule is not used**; `.stage` (max-height 340 px) plus explicit figure heights keep the lower third clear without cropping fixed-height figures.
13. **JPAC wording**: "reads it as a pole, virtual or bound", never "a pole is required".
14. **Zweig is credited for the constituents, not for listing qqqqq̄** (only Gell-Mann's sentence was verified); the quotation on slide 2 is Gell-Mann's verbatim.
15. **Eides, Petrov, Polyakov are cited by arXiv id** (1904.11616 for χc0 p with 1/2⁺; 1811.01691 for the decay pattern) because no journal reference could be verified; every other footer is journal style.
16. **Empty comparison cells read "none"**, per the no-em-dash rule.
17. **Time**: 27.0 min including nine stops at ≤ 15 s; the rehearsal drop order is the Pc(4380) stop first, then the paper's Dalitz panel on slide 8. The flights themselves (1.4–2.8 s) are inside the slide budgets.
18. **`package.json` and `videos.toml` are untouched**; only the deck's `addons`/`videos` frontmatter goes, which is enough to remove the player from this talk without touching the workspace.
19. **Slide 4 panels are label-free** ("two hadrons" / "one hadron") so the question is not read as the answer; the physics labels arrive on slides 14–15.
20. **`hideInToc` backups carry `class: backup`** so their 17 px tables do not change the 19 px rule for the spoken slides.
