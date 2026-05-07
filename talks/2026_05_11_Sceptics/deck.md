---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
title: Kvantinė mechanika skeptikams
info: |
  Populiarinamoji paskaita — sąžininga kvantinės mechanikos apžvalga,
  kodėl jos prireikė, kur ji yra šiandien ir kaip CERN čia įsipina.
  2026-05-11. 40 minučių. Skeptiškai nusiteikusiai plačiajai auditorijai.
layout: cover
background: /figures/background_intro.jpg
---

# Dr. Mindaugas Šarpis

# Kvantinė mechanika skeptikams

## Kas ji yra, kas ne, ir kodėl tuo rūpinasi CERN

<div class="mt-md opacity-70">2026-05-11</div>

---
layout: quote
---

> „Manau, galiu drąsiai pasakyti, kad niekas iš tikrųjų nesupranta kvantinės mechanikos.“

— Richard Feynman, 1965

---
layout: statement
---

# Šiandien

<div class="grid-3 mt-md">

<div class="card card-primary pad-tight">

## ⚛️ **Kvantinė mechanika**

Sąžininga versija — be mistikos.

</div>

<div class="card card-secondary pad-tight">

## 🔧 **Kur ji veikia**

Technologijos, kuriomis naudojatės kasdien.

</div>

<div class="card card-accent pad-tight">

## 🏛️ **CERN**

Kur ji bandoma prie pat ribos.

</div>

</div>

---
layout: section
hideInToc: true
---

# 1 dalis — Kai fizika sulūžo

<!-- image candidate: vintage physics lab / Solvay 1927 -->

---

# 🧱 **Klasikinė intuicija vs. tikrovė**

<div class="grid-2 mt-md">

<div class="card card-info pad-tight">

### Ko tikisi mūsų intuicija

- Daiktai — **dalelės** arba **bangos**.
- Padėtis ir greitis — visada apibrėžti.
- Nežiūrėjimas nieko nekeičia.
- Lokalu, priežastis → pasekmė.

</div>

<div class="card card-warning pad-tight">

### Ką iš tikrųjų daro Visata

- **Nei** rutuliukai, **nei** klasikinės bangos.
- Padėtis ir greitis vienu metu — **ne**.
- „Nežiūrėjimas“ — ne neutralus aktas.
- Nutolę objektai — **susieti**.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Tai ne filosofija. Tai išmatuota.
</div>

---

<div
  class="absolute inset-0 overflow-hidden bg-black"
  @click.stop
  @mousedown.stop
  @mouseup.stop
  @mousemove.stop
  @pointerdown.stop
  @pointerup.stop
  @pointermove.stop
  @wheel.stop
  @touchstart.stop
  @touchmove.stop
  @touchend.stop
  @contextmenu.stop
>
  <iframe
    src="https://asliceofcuriosity.fr/assets/atom/orbitalsApp-Metropolis.html"
    class="absolute top-0 left-0 border-0"
    style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: top left;"
    allow="fullscreen"
    scrolling="no"
  ></iframe>
</div>

<!-- Interactive 3D atomic-orbital viewer. Source: asliceofcuriosity.fr -->
<!-- @click.stop / @mousedown.stop / @wheel.stop block Slidev's slide-level event handlers -->
<!-- so drag-to-rotate and scroll-to-zoom inside the iframe work uninterrupted. -->
<!-- Use ←/→ or Space on the keyboard to navigate slides while the mouse is inside the iframe. -->

---

# 🎲 **Superpozicija**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

### Ką tai reiškia

Sistema = **galimybių suma**, kiekviena su kompleksine amplitudė.

Matuojant — tikimybė lygi amplitudės **kvadratui**.

</div>

<div class="card card-secondary pad-tight">

### Ko **NE**reiškia

Sistema **nėra** „slapta vienoje būsenoje, mes tiesiog nežinome“.

Tai paneigta: **Bello testai, Nobelis 2022**.

</div>

</div>

---
layout: section
hideInToc: true
---

# 2 dalis — Kur QM yra šiandien

<!-- image candidate: phone chip / MRI / laser collage -->

---
layout: section
hideInToc: true
---

# 3 dalis — Tikslumas, kuris neturi sau lygių

<!-- Visual: 6 g-2 figures + g-2 videos -->

---

<img src="/figures/g2/g.001.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Dirac, 1928. g = 2. -->

---

<img src="/figures/g2/g.002.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Schwinger, 1948. Pirmoji kilpa: pataisa α/(2π). -->

---

<img src="/figures/g2/g.003.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Schwingerio antkapyje. -->

---

<img src="/figures/g2/g.004.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Karplus, Kroll, Sommerfeld, Petermann (1950–1957). -->

---

<img src="/figures/g2/g.005.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Aoyama, 2012. ~12 000 diagramų. -->

---

<img src="/figures/g2/g.006.png" class="absolute inset-0 w-full h-full object-cover" />

<!-- Eksperimentinis matavimas. 12 ženklų po kablelio. -->

---

<VideoPlayer src="g2_data.mp4" muted />

<!-- Fermilab Muon g-2 — muonų sukinio osciliacija (duomenys). -->

---

<VideoPlayer src="g2_fit.mp4" muted />

<!-- Tas pats matavimas su modelio kreive. -->

---
layout: section
hideInToc: true
---

# 4 dalis — CERN

<!-- image candidate: CERN aerial / LHC tunnel / Higgs detection -->

---
layout: section
hideInToc: true
---

# 5 dalis — Skeptiko įrankių rinkinys

<!-- Mitai + raudonos/žalios vėliavos -->

---

# 🚫 **Mitas Nr. 1 — „Stebėtojas sukuria tikrovę“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Reikia **sąmoningo stebėtojo**, kad „supjautų bangos funkciją“. Realybės be žiūrėjimo nėra.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

„Matavimas“ = **bet kokia negrįžtama sąveika**. Detektoriaus pikselis. Dujų molekulė. Paklydęs fotonas.

Pikseliui PhD nereikia.

</div>

</div>

---

# 🚫 **Mitas Nr. 2 — „Schrödingerio katė tikrai gyva ir mirusi“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Katė dėžėje yra tikrojoje superpozicijoje, kol kažkas atidaro dangtį.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Schrödingeris šitą **juokavo**. Sugalvojo katę, kad **paneigtų** superpozicijos perkėlimą į makroobjektus.

Šilta, drėgna katė pasirenka būseną per **10⁻²⁰ s**.

</div>

</div>

---

# 🚫 **Mitas Nr. 3 — „Susietumas = greičiau už šviesą“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Susietos dalelės leidžia perduoti **informaciją** akimirksniu — kvantinis internetas, telepatija, „nuotolinis gydymas“.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Koreliacijos — taip, akimirksniu. **Informacija — ne.**

Atskiras matavimas — atsitiktinis triukšmas. Koreliacija matosi tik palyginus du įrašus, **šviesos greičiu**.

</div>

</div>

---

# 🚫 **Mitas Nr. 4 — „Neapibrėžtumas = bloga įranga“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Heisenbergo principas yra apie matavimo trūkumus. Su geresne įranga galėsime žinoti viską tiksliai.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Neapibrėžtumas — **sistemos savybė**, ne matavimo trūkumas.

Dalelė su tiksliai apibrėžta padėtimi **neturi** apibrėžto impulso. Ne „nežinome“ — **jo nėra**.

</div>

</div>

---
layout: statement
---

# Kaip atpažinti „kvantinį“ marketingą

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Raudonos vėliavos 🚩

- „Kvantinis“ + sveikatos / finansų / dvasingumo produktas
- „Stebėtojo efektas“, taikomas **nuotaikai**
- Susietumas + „momentinis bendravimas“ / „nuotolinis gydymas“
- Bet kas, parduodantis jums **tikrumą**

</div>

<div class="card card-success pad-tight">

### Žalios vėliavos ✅

- Konkreti, paneigiama prognozė
- Skaičiai, paklaidos, vienetai
- „Štai kur galiu klysti“
- Recenzuotas straipsnis, kurį iš principo galite perskaityti

</div>

</div>

---
layout: quote
---

> „Pirmoji taisyklė — neapgaudinėk savęs. O save apgauti yra lengviausia.“

— Richard Feynman

---
layout: fact
---

# Ačiū

Klausimai, prieštaravimai ir „o kaip dėl…“ — visi laukiami.

<!-- video candidate: LHCb_Aciu.mov -->
