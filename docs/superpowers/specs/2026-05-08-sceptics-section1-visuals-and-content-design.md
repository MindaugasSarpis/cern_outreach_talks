# Sceptics talk — Section 1 visuals & full content design

**Talk:** `talks/2026_05_11_Sceptics/` — *Kvantinė mechanika skeptikams*. 40 min, sceptical lay audience, 4K 16:9 venue. Lithuanian.
**Author:** Dr. Mindaugas Šarpis (LHCb member — per the existing closing-slide reference; confirm in review).
**Date:** 2026-05-08.
**Status:** design only — no implementation work begins until user approves this spec.

## Goals

1. Insert a missing pedagogical bridge into Section 1 ("Kai fizika sulūžo") between the *classical-vs-reality* card slide and the orbital-viewer iframe: three custom Vue/SVG diagrams (wave / point particle / wave packet) plus a Manim preface and the Hitachi double-slit footage.
2. Provide a small, curated set of bonus visuals that reuse those components or fill clear gaps elsewhere in the deck.
3. Flesh out the two empty sections (Section 2 — *Kur QM yra šiandien*, Section 4 — *CERN*) with concrete slide-by-slide content.

## Non-goals

- No changes to Sections 3 (g-2 precision) or 5 (myths / red & green flags).
- No new theme work; reuse existing layouts and card classes.
- No new infrastructure beyond two new Manim videos and three new Vue components.

---

## A. Section 1 — visuals & insertion plan

### A.1 New deck flow (Section 1)

Existing slides marked **(E)**, new slides **(N)**:

1. (E) Section divider — *Kai fizika sulūžo*
2. (E) Card slide — *Klasikinė intuicija vs. tikrovė*
3. **(N) Slide — *Banga* (wave)** — `<WaveDiagram />`
4. **(N) Slide — *Taškinė dalelė* (point particle)** — `<ParticleDiagram />`
5. **(N) Slide — *Bangos paketas* (wave packet)** — `<WavePacketDiagram />`
6. **(N) Slide — *Klasikinis ar kvantinis?* (Manim preface)** — `<VideoPlayer src="double_slit_classical_vs_quantum.mp4" />`
7. **(N) Slide — *Tonomura, Hitachi, 1989* (Hitachi footage)** — `<VideoPlayer src="double_slit_hitachi.mp4" />`
8. (E) Atomic-orbital iframe slide
9. (E) Card slide — *Superpozicija*

Net addition: **5 slides** (3 Vue diagrams + 2 videos).

### A.2 Component design — `components/`

All three components live at the **repo root** `components/` (already symlinked into the talk's `components/` dir per the existing convention) so future talks can reuse them.

#### `WaveDiagram.vue`
- Full-bleed SVG sine wave traveling left → right.
- Props: `speed?: number = 1`, `wavelength?: number = 120`, `amplitude?: number = 80`, `color?: string = currentColor`.
- Implementation: single `<path>` whose `d` is regenerated on `requestAnimationFrame`. No external libs.
- Visual notes: dark background (inherits deck dark theme), accent-colored stroke, label "λ" annotated on one wavelength, faint horizontal axis.
- Caption (slide-side, not in component): *Klasikinė banga — vandens paviršiuje, garse, šviesoje. Užima erdvę, neša energiją, gali interferuoti.*

#### `ParticleDiagram.vue`
- Full-bleed SVG. A single dot moves along a parabolic / ballistic trajectory; a faint dotted trail marks the past path.
- Props: `speed?: number = 1`, `trajectory?: 'ballistic' | 'linear' = 'ballistic'`.
- Implementation: same RAF loop pattern; trail is a polyline that grows then resets.
- Visual notes: dot ~12 px, trail dotted, position+velocity vectors annotated at one frame.
- Caption: *Klasikinė dalelė — biliardo rutuliukas. Tiksli padėtis, tikslus greitis, lokalus poveikis.*

#### `WavePacketDiagram.vue`
- Full-bleed SVG. A Gaussian envelope `exp(-(x-x0)²/2σ²)` × carrier `cos(k(x-x0) - ωt)`.
- Initial state: σ moderately narrow (clearly localized).
- **Interaction:** click anywhere → packet "collapses" (σ → 0 over ~400 ms, fades into a particle dot at peak position). Click again → packet re-spreads back to initial.
- Props: `speed?: number = 1`, `sigma?: number = 60`, `k?: number = 0.5`, `interactive?: boolean = true`.
- Implementation: SVG `<path>` regenerated every frame. State machine: `idle → collapsing → collapsed → spreading → idle`.
- Caption: *Kvantinis objektas — nei viena, nei kita. Lokalizuota banga. Padėtis ir greitis vienu metu — neapibrėžti.*
- This component is **reused** in Myth #4 (Heisenberg) — see B.1.

### A.3 New videos — `videos/manifest.toml`

Add two `[[videos]]` entries:

```toml
[[videos]]
name    = "double_slit_classical_vs_quantum.mp4"
profile = "high-motion"
used_in = ["deck"]
notes   = "Manim preface, ~12 s. Three panels in sequence: classical balls (no interference), classical waves (interference), electrons (interference, surprise reveal). Source script: scripts/manim/double_slit_preface.py."

[[videos]]
name    = "double_slit_hitachi.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Tonomura / Hitachi 1989 single-electron buildup (Am. J. Phys.). Source: gdrive raw. Trim to ~30 s if longer than that."
```

Both pulled via the standard `pnpm videos:sync && pnpm videos:encode` flow once raws are in `gdrive:Work/Outreach/Resources/Videos/released`.

### A.4 Manim script — `scripts/manim/double_slit_preface.py`

(Lives in the **talk** dir, not repo root, so it's per-talk.) Three scenes, ~4 s each:

1. **Scene 1 — *Klasikiniai rutuliukai*** — Two slits, balls fired at random angles, hit a screen, two-bump distribution forms. Caption: *„Klasikinis kūnas: dvi juostos."*
2. **Scene 2 — *Klasikinės bangos*** — Source on left, plane wave hits two slits, semicircular waves emerge, interference pattern at screen with alternating bright/dark fringes. Caption: *„Klasikinė banga: interferencija."*
3. **Scene 3 — *Elektronai* (the surprise)** — Single electrons fired one at a time, each hits one spot — but the accumulated distribution shows interference fringes. Caption: *„Elektronas: ir vienas, ir banga."*

Output: 3840×2160 @ 60 fps, HEVC. ~12 s total.

### A.5 Caption / commentary for the Hitachi slide

Suggested HTML comment in deck for narration cue:

> *Tonomura, Hitachi, 1989. Vienas elektronas po kito. Kiekvienas trenkėsi į vieną tašką — vis dėlto sklaida sako, kad jis ėjo per abu plyšius. Tai ne animacija — tai duomenys.*

---

## B. Bonus visuals (selected: 1, 3, 4 from offered list; CERN visuals folded into Section 4)

### B.1 Heisenberg — Myth #4

- **Primary:** reuse `<WavePacketDiagram />` on the existing Myth #4 slide. Show position-narrow → momentum-wide and vice versa via component prop variation (two side-by-side instances, σ small / σ large) or a manual click-driven toggle.
- **Stretch:** Manim FT animation `heisenberg_ft.mp4` if time. Fold into the same slide as a third panel; for now, plan the stretch but don't block on it.

Slide structure: replace the right-hand "*Ką sako fizika*" card body with two small instances side-by-side: `<WavePacketDiagram :sigma="20" :interactive="false" />` (narrow position → wide momentum) and `<WavePacketDiagram :sigma="200" :interactive="false" />` (wide position → narrow momentum), plus one-sentence captions under each.

### B.2 Decoherence card — Schrödinger cat myth

- Add a small accent card or visual flourish to the Myth #2 slide that emphasises *10⁻²⁰ s*.
- Implementation: pure HTML/CSS, no new component. A tight `<div class="card card-accent pad-tight">` containing a comparison: human reaction (~10⁻¹ s) vs. cat decoherence (~10⁻²⁰ s) — "skirtumas: 19 eilių didesnis."

### B.3 Everyday-tech grid — Section 2 opener

- 4-card grid (`grid-2` × 2 rows on a single slide; user dropped LED & solar from the offered six, leaving four).
- Each card: emoji + title + 1-line "kas tai" + 1-line "kodėl QM".

(Detailed card content in Section C.1 below.)

---

## C. Section 2 — *Kur QM yra šiandien* (~6–8 min, ~50/50 everyday vs frontier)

Three slides total.

### C.1 Slide — *Be QM nebūtų...* (4-card grid)

Layout: `grid-2` on a `layout: default` slide, `pad-tight`.

| Card | Color class | Content |
|---|---|---|
| 📱 **Tranzistorius** | `card-primary` | Telefonai, kompiuteriai, automobiliai. Pusės XX a. revoliucija stovi ant juostinės teorijos — grynas QM. |
| 🔬 **Lazeris** | `card-secondary` | Stimuliuota emisija (Einstein, 1917). Šiandien — pluošto internetas, parduotuvės, akių chirurgija. |
| 🧲 **MRT** | `card-info` | Branduolinio sukinio rezonansas. Be Pauli ir Diraco — nėra MRT skenerių. |
| 🛰️ **GPS** | `card-accent` | Atominiai laikrodžiai (cezio kvantinis perėjimas) + reliatyvistinė pataisa. Be jų — ±11 km per dieną. |

Slide caption (footer, opacity-70): *Jeigu QM klystų 12 ženklų po kablelio — jūsų telefonas neįsijungtų.*

### C.2 Slide — *Pažangos riba 2026 — kvantiniai kompiuteriai*

`grid-2`. Honest framing.

- **Kur jie tikrai yra (2026):** Triukšmingi, ~1000 fizinių kubitų, klaidų korekcija — ankstyvieji demonstracijos eksperimentai. Nė vienas dar nepralenkė klasikinio kompiuterio realioje užduotyje, kuri nebūtų sukonstruota tam, kad QC laimėtų.
- **Ko jie greitai NEpadarys:** Nepalauš RSA ryt. Nesukurs DI. Neišgydys ligų magija.
- **Ko greičiausiai pasieks per 5–10 metų:** Kvantinė chemija (vaistai, baterijos), kombinatorinis optimizavimas, kvantinė kriptografija (post-kvantinė — jau diegiama).

### C.3 Slide — *Kvantinis jutimas + tinklai (jau dabar)*

`grid-2`. Underrated, sceptic-friendly story — these are *deployed*, not hyped:

- **Kvantinis jutimas:** atominiai gravitometrai (požeminių struktūrų vaizdinimas), magnetometrai (smegenų magnetoencefalografija be šaldymo), atominiai laikrodžiai 10⁻¹⁹ tikslumu.
- **Kvantiniai tinklai:** Kinijos Mičio palydovas (2017+), Europos Sąjungos EuroQCI, BB84 kvantinė raktų pasiskirstymas — komerciniuose duomenų centruose.

Slide footer: *Tai ne ateitis. Tai šiandiena, tik mažiau garsi nei „kvantinis kompiuteris".*

---

## D. Section 4 — *CERN* (~7–10 min)

Frame: CERN = *testavimo* organizacija, ne pamokslautojų. Five slides.

### D.1 Slide — *Kas yra CERN*

`statement` layout. CERN aerial photo as background (use CERN's open Document Server / CC-licensed media — full attribution caption).

Tight stat block:
- 23 valstybės narės, 110+ šalys dalyvauja
- Įkurtas 1954, atviras (publikacijos viešos), recenzuojamas
- 17 000+ tyrėjų, viešas finansavimas
- Vienas LHC eksperimentas → tūkstančiai autorių vienoje publikacijoje

Footer (sceptic-disarming): *Jei tai būtų sąmokslas — jis būtų prasčiausiai paslėptas pasaulio sąmokslas.*

### D.2 Slide — *Ką CERN patvirtino*

`grid-3` of dated, concrete results:

- 🎯 **Higgsas (2012)** — paskutinis trūkstamas Standartinio modelio elementas. ATLAS + CMS, ~5σ, dvi nepriklausomos grupės.
- ⚛️ **Antimaterija (ALPHA)** — antivandenilio spektrai 2017–2020. Tokie patys kaip vandenilio ribose paklaidų.
- ⚖️ **W bozono masė** — sub-promilė tikslumu, sutampa su Standartiniu modeliu (CMS 2024 pataisė ankstesnį Tevatron neatitikimą).

Each card has an event-display thumbnail or detector schematic.

### D.3 Slide — *Ką CERN paneigė* (the sceptical hook)

`statement` layout. **The most powerful sceptic-disarming slide in the deck.**

> *Mes ieškojome supersimetrijos. Pigios versijos — neradome. Tai irgi mokslas.*

Bullets:
- Lengvosios SUSY versijos — atmestos LHC duomenimis 2010–2024.
- Kai kurie tamsiosios materijos kandidatai (WIMP > 1 TeV, kai kurie sub-GeV) — atmesti.
- Dauguma „naujosios fizikos" prognozių iš 2000-ųjų — neišlaikė bandymo.

Footer: *Falsifikacija veikia. Hipotezė, kuri negali pralošti — ne mokslas.*

### D.4 Slide — *Ką CERN klausia dabar*

`grid-3`:

- 🌑 **Tamsioji materija** — kas tai yra? LHC + tiesioginiai detektoriai (LZ, XENONnT) + dangaus stebėjimai.
- ⚖️ **Materijos / antimaterijos asimetrija** — kodėl Visata yra, o ne išnyko? LHCb, ALPHA, neutrinų eksperimentai.
- 🌫️ **Neutrinų masė** — KATRIN, JUNO, DUNE; CERN tiekia pluoštus, infrastruktūrą.

### D.5 Slide — *Mano dalis* (personal hook)

LHCb-specific. *Confirm experiment in spec review — current placeholder is LHCb based on the closing-slide `LHCb_Aciu.mov` reference.*

Content options (pick one in implementation, depending on what the speaker wants to highlight):
- LHCb event display / detector cutaway + 1-line role description.
- Recent LHCb result (e.g., CP violation in charm, $B \to K\ell\ell$, lepton-universality test) — what was measured, what was learned, what the open question still is.
- Personal tooling story (something the speaker built / contributed to).

Closing transition: *Štai kur „kvantinė mechanika" virsta darbo užduotimi.* — leads naturally into Section 5 (myths) since the speaker now has earned credibility.

---

## E. Implementation order (for the follow-up plan)

The implementation plan (next skill: `superpowers:writing-plans`) should sequence work as follows so each step is independently demoable:

1. **Components first** — `WaveDiagram.vue`, `ParticleDiagram.vue`, `WavePacketDiagram.vue` at repo root. Smoke-test each on a scratch slide.
2. **Section 1 deck wiring** — insert slides 3–5 with the components, verify in `pnpm dev`.
3. **Manim preface** — write `scripts/manim/double_slit_preface.py`, render at 4K, add to manifest, encode, verify.
4. **Hitachi sourcing** — locate / trim raw, place in gdrive `released/`, sync + encode, add manifest entry, verify.
5. **Section 1 final** — slides 6–7 wired, full Section 1 review pass.
6. **Bonus visuals** — Heisenberg (B.1) reuse on Myth #4, decoherence card (B.2). Stretch: Manim FT.
7. **Section 2 content** — three slides (C.1–C.3), text-only first, icon polish second.
8. **Section 4 content** — five slides (D.1–D.5), text + sourced CERN media.
9. **Full deck dry-run** — `pnpm build`, click through, time it. Adjust pacing.

## F. Risks / open questions

- **Hitachi licensing:** the 1989 footage is widely circulated but not always cleanly licensed. Confirm a usable copy exists before committing to slide 7 — if not, fall back to a Manim continuation of the preface that mimics dot-by-dot buildup.
- **Manim install:** not yet in `env.yaml`. Will need to add `manim` (and its deps — `cairo`, `pango`, `ffmpeg` already there) to the conda env. Verify in the implementation plan.
- **CERN media licensing:** the CERN Document Server / `cds.cern.ch` images are largely CC-BY for press/educational use, but each one needs a per-image attribution check. Plan a 30-min sourcing pass.
- **LHCb specifics for D.5:** the personal-slide content depends on what the speaker wants to feature; confirm in spec review.
- **Aspect-ratio sanity:** all new components are full-bleed `inset-0`; double-check they look right at the venue's 16:9 4K (3840×2160) before the talk.

## G. Out of scope (explicitly)

- Restructuring Sections 3 or 5.
- New Slidev layouts or theme work.
- Building a Bell-test diagram (offered, not selected).
- Tunneling / energy-levels visuals (offered, not selected).
- Solar / blue-LED tech examples (offered, not selected).
