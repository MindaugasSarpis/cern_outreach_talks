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

# Ar paranormalu tampa normalu? Kvantinė fizika 

## Skeptics meetup

<div class="mt-md opacity-70">2026-05-11</div>

---
layout: quote
---

# „Manau, galiu drąsiai pasakyti, kad niekas iš tikrųjų nesupranta kvantinės mechanikos.“

Richard Feynman, 1965

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

<ParticleDiagram mode="ballistic" />

---

<ParticleDiagram mode="random" />

---

<WaveDiagram />

---

<WavePacketDiagram />

---

<VideoPlayer src="orbitals.mp4" loop muted :controls="false" />

<!-- Pre-rendered hydrogen-like orbital surfaces (s, p, d, f; m=0) rotating around z. -->
<!-- Replaces the asliceofcuriosity iframe (broken on Mac). Render via:        -->
<!--   python3 scripts/orbital_animation.py    (then `pnpm videos:encode`)     -->

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

# 🔌 **Be QM nebūtų...**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 📱 **Tranzistorius**

Telefonai, kompiuteriai, automobiliai. Pusės XX a. revoliucija stovi ant juostinės teorijos — gryno QM.

</div>

<div class="card card-secondary pad-tight">

## 🔬 **Lazeris**

Stimuliuota emisija (Einstein, 1917). Šiandien — pluošto internetas, parduotuvės, akių chirurgija.

</div>

<div class="card card-info pad-tight">

## 🧲 **MRT**

Branduolinio sukinio rezonansas. Be Pauli ir Diraco — nėra MRT skenerių.

</div>

<div class="card card-accent pad-tight">

## 🛰️ **GPS**

Atominiai laikrodžiai (cezio kvantinis perėjimas) + reliatyvistinė pataisa. Be jų — ±11 km per dieną.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Jeigu QM klystų 12 ženklų po kablelio — jūsų telefonas neįsijungtų.
</div>

---

# 🧮 **Pažangos riba 2026 — kvantiniai kompiuteriai**

<div class="grid-2 mt-md">

<div class="card card-info pad-tight">

### Kur jie tikrai yra (2026)

Triukšmingi, ~1000 fizinių kubitų, klaidų korekcija — ankstyvieji demonstracijos eksperimentai.

Nė vienas dar nepralenkė klasikinio kompiuterio realioje užduotyje, kuri **nebūtų sukonstruota tam, kad QC laimėtų**.

</div>

<div class="card card-warning pad-tight">

### Ko greitai **NE**padarys

- Nepalauš RSA ryt.
- Nesukurs DI.
- Neišgydys ligų magija.

</div>

</div>

<div class="card card-success pad-tight mt-md">

### Ko greičiausiai pasieks per 5–10 metų

Kvantinė chemija (vaistai, baterijos), kombinatorinis optimizavimas, kvantinė kriptografija (post-kvantinė — **jau diegiama**).

</div>

---

# 📡 **Kvantinis jutimas + tinklai (jau dabar)**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

### Kvantinis jutimas

- **Atominiai gravitometrai** — požeminių struktūrų vaizdinimas.
- **Magnetometrai** — smegenų magnetoencefalografija be šaldymo.
- **Atominiai laikrodžiai** — 10⁻¹⁹ tikslumu.

</div>

<div class="card card-accent pad-tight">

### Kvantiniai tinklai

- **Mičio palydovas** (Kinija, 2017+) — kvantinis raktų pasiskirstymas iš orbitos.
- **EuroQCI** — ES kvantinis ryšio tinklas.
- **BB84** komerciniuose duomenų centruose.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Tai ne ateitis. Tai šiandiena, tik mažiau garsi nei „kvantinis kompiuteris".
</div>

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
layout: statement
---

<!-- speaker: once /public/figures/cern/aerial.jpg exists, add `background: /figures/cern/aerial.jpg` to this slide's frontmatter for an aerial backdrop -->

# Kas yra CERN

<div class="card card-primary pad-tight max-w-[60%] mx-auto mt-md">

- **23 valstybės narės**, 110+ šalys dalyvauja
- Įkurtas **1954**, atviras (publikacijos viešos), recenzuojamas
- **17 000+** tyrėjų, viešas finansavimas
- Vienas LHC eksperimentas → **tūkstančiai autorių vienoje publikacijoje**

</div>

<div class="mt-md opacity-80 text-center text-lg">
Jei tai būtų sąmokslas — jis būtų prasčiausiai paslėptas pasaulio sąmokslas.
</div>

---

# ✅ **Ką CERN patvirtino**

<div class="grid-3 mt-md">

<div class="card card-primary pad-tight">

## 🎯 **Higgsas (2012)**

<div class="w-full h-24 rounded my-1 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-xs opacity-60">ATLAS / CMS event</div>
<!-- speaker: replace the placeholder div above with <img src="/figures/cern/higgs_event.png" class="w-full rounded my-1" /> once the CC-BY image is in place -->

Paskutinis trūkstamas Standartinio modelio elementas. ATLAS + CMS, ~5σ, dvi nepriklausomos grupės.

</div>

<div class="card card-secondary pad-tight">

## ⚛️ **Antimaterija (ALPHA)**

<div class="w-full h-24 rounded my-1 bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center text-xs opacity-60">ALPHA antihydrogen</div>
<!-- speaker: replace with <img src="/figures/cern/alpha_antihydrogen.png" class="w-full rounded my-1" /> -->

Antivandenilio spektrai 2017–2020. Tokie patys kaip vandenilio ribose paklaidų.

</div>

<div class="card card-info pad-tight">

## ⚖️ **W bozono masė**

<div class="w-full h-24 rounded my-1 bg-gradient-to-br from-amber-900 to-rose-900 flex items-center justify-center text-xs opacity-60">CMS 2024 measurement</div>
<!-- speaker: replace with <img src="/figures/cern/cms_w_mass.png" class="w-full rounded my-1" /> -->

Sub-promilė tikslumu, sutampa su Standartiniu modeliu (CMS 2024 pataisė ankstesnį Tevatron neatitikimą).

</div>

</div>

---
layout: statement
---

# ❌ **Ką CERN paneigė**

<div class="card card-warning pad-tight max-w-[70%] mx-auto mt-md">

> *Mes ieškojome supersimetrijos. Pigios versijos — neradome. Tai irgi mokslas.*

</div>

<div class="grid-2 mt-md max-w-[80%] mx-auto">

<div class="card card-info pad-tight">

- Lengvosios SUSY versijos — **atmestos** LHC duomenimis 2010–2024.
- Kai kurie tamsiosios materijos kandidatai (WIMP > 1 TeV, kai kurie sub-GeV) — **atmesti**.

</div>

<div class="card card-info pad-tight">

- Dauguma „naujosios fizikos" prognozių iš 2000-ųjų — **neišlaikė bandymo**.
- Tas pats LHC, kuris rado Higgsą, **atmetė** dešimtis kitų hipotezių.

</div>

</div>

<div class="mt-md opacity-80 text-center text-lg">
Falsifikacija veikia. Hipotezė, kuri negali pralošti — ne mokslas.
</div>

---

# ❓ **Ką CERN klausia dabar**

<div class="grid-3 mt-md">

<div class="card card-primary pad-tight">

## 🌑 **Tamsioji materija**

Kas tai yra? LHC + tiesioginiai detektoriai (LZ, XENONnT) + dangaus stebėjimai.

</div>

<div class="card card-secondary pad-tight">

## ⚖️ **Materijos / antimaterijos asimetrija**

Kodėl Visata yra, o ne išnyko? LHCb, ALPHA, neutrinų eksperimentai.

</div>

<div class="card card-info pad-tight">

## 🌫️ **Neutrinų masė**

KATRIN, JUNO, DUNE; CERN tiekia pluoštus, infrastruktūrą.

</div>

</div>

---

# 🔬 **Mano dalis — LHCb**

<div class="grid-2 mt-md">

<div class="w-full h-64 rounded bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center text-sm opacity-60">LHCb event display</div>
<!-- speaker: replace placeholder div with <img src="/figures/cern/lhcb_event.png" class="w-full rounded" /> once available -->

<div class="card card-primary pad-tight">

### Ką aš matau

LHCb — vienas iš keturių didžiųjų LHC eksperimentų. Specializuojasi **b ir c kvarkų skilimuose**: vieta, kur ieškoma smulkių neatitikimų tarp materijos ir antimaterijos.

<!-- speaker: optionally add 1 line here about your specific role / subsystem -->

</div>

</div>

<div class="mt-md opacity-80 text-center">
Štai kur „kvantinė mechanika" virsta darbo užduotimi.
</div>

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

<div class="mt-md flex justify-center">
  <div class="card card-accent pad-tight max-w-[80%]">

  <div class="grid-2 items-center text-center">
    <div>
      <div class="opacity-70 text-sm">Žmogaus reakcija</div>
      <div class="text-3xl font-mono">~10⁻¹ s</div>
    </div>
    <div>
      <div class="opacity-70 text-sm">Katės dekoherencija</div>
      <div class="text-3xl font-mono">~10⁻²⁰ s</div>
    </div>
  </div>

  <div class="text-center mt-2 opacity-90">Skirtumas — **19 eilių didesnis**.</div>

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

<div class="grid-2 mt-2">
  <div class="relative h-32 overflow-hidden rounded">
    <WavePacketDiagram :sigma="40" :interactive="false" />
  </div>
  <div class="relative h-32 overflow-hidden rounded">
    <WavePacketDiagram :sigma="320" :interactive="false" />
  </div>
</div>

<div class="grid-2 mt-1 text-sm opacity-80">
  <div>Tiksli padėtis → neapibrėžtas impulsas.</div>
  <div>Tikslus impulsas → neapibrėžta padėtis.</div>
</div>

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

<VideoPlayer src="LHCb_Aciu.mov" />

<!-- LHCb thanks reel (~2:28 with audio). Source: gdrive Outreach/Resources/Videos/released. -->
<!-- Same master as the editAI talk uses; hq_from_raw=true means the HQ ships via gdrive pull, -->
<!-- not via the GH release (raw 2880x1600 HEVC > 2 GB cap). -->

