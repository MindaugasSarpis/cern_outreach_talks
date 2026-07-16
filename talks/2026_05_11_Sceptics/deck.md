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

Kur QM tyrinėjama iki galo.
</div>

</div>

---

<ParticleDiagram mode="ballistic" />

---

<ParticleDiagram mode="random" />

---

<VideoPlayer src="voyage_in_to_the_world_of_atoms.mp4" />

---


<VideoPlayer src="cloud_chamber_audio.mp4"/>

<!-- Cloud chamber: charged particles leave visible tracks because each ion
     they create is an irreversible interaction with the supersaturated vapor.
     Concrete example for "matavimas = bet kokia negrįžtama sąveika".
     Inherited from /videos/shared.toml. -->

---

<DoubleSlitDiagram mode="classical-no-barrier" />

<!-- Beat 1: source fires balls, they fly straight, pile up in a single
     tight spot. Establishes "balls go where you aim". -->

---

<DoubleSlitDiagram mode="classical-slits" />

<!-- Beat 2: a barrier with two slits. Each ball visibly takes ONE slit,
     accumulating into TWO distinct bands. The classical baseline the
     audience will be asked to predict from in the next slide. -->

---

<DoubleSlitDiagram mode="classical-electrons" />

<!-- Beat 3: ask the audience to predict. Electrons are tiny balls, right?
     So shooting them at the slits should give two bands behind the slits,
     just like the marbles. This is what intuition predicts; the diagram
     shows that prediction so the next slide's contrast lands hard. -->

---

<DoubleSlitDiagram mode="quantum-electrons-dots" />

<!-- Beat 4: the surprise. Same setup, single e⁻ fired one at a time, as
     particles — but each electron lands on the detector as a single DOT,
     and after many electrons the dots do NOT pile into two bands. They
     organise into FRINGES. Narrate: "we are still firing them ONE AT A
     TIME — count them — but look where they land. Not two bands. Stripes."
     Audience is now puzzled — that is the cue to introduce waves. -->

---

<WaveDiagram />

<!-- Beat 5: the answer starts here — what a wave is, why waves can produce
     bright-AND-dark stripes via interference. Pure wave intuition, no
     particles yet. -->

---

<DoubleSlitDiagram mode="quantum" />

<!-- Beat 6: a wave hits the same barrier. Wavefronts emerge from BOTH
     slits and overlap; the cos²·Gaussian interference INTENSITY fades up
     on the detector. The audience now SEES the wave producing the same
     fringe pattern the electrons made on Beat 4. -->

---

<DoubleSlitDiagram mode="quantum-electrons" />

<!-- Beat 7: closing the loop — the same electron experiment, depicted
     purely as waves. Single-e⁻ launches, per-electron wavelet from BOTH
     slits, bright continuous envelope (no dots). The picture says: each
     electron's amplitude went through both slits and interfered with
     ITSELF. That is why the dots on Beat 4 chose the bright fringes. -->

---

<WavePacketDiagram />

---

<div class="absolute inset-0 overflow-hidden bg-black" style="pointer-events: none;">
  <iframe
    src="https://asliceofcuriosity.fr/assets/atom/orbitalsApp-Metropolis.html"
    class="absolute top-0 left-0 border-0"
    style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: top left; pointer-events: auto;"
    allow="fullscreen"
    scrolling="no"
    tabindex="0"
  ></iframe>
  <a
    href="https://asliceofcuriosity.fr/assets/atom/orbitalsApp-Metropolis.html"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Atidaryti naujame lange"
    class="absolute bottom-4 right-4 flex items-center justify-center text-white"
    style="pointer-events: auto; width: 40px; height: 40px; font-size: 22px; line-height: 1; border-radius: 8px; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.25);"
  >↗</a>
</div>

<!-- Interactive 3D atomic-orbital viewer. Drag to rotate, wheel to zoom. -->
<!-- Doesn't work on Mac per upstream issue — the top-right link opens the -->
<!-- viewer in a new browser tab as a fallback for venues where the iframe -->
<!-- can't render (or for any time you want hands-on interaction). -->

---

<VideoPlayer src="sm.mov" />

<!-- Standard Model overview reel — inventory of fundamental particles after
     the atomic-orbital exploration; sets up the transition to "where this
     knowledge becomes useful". Inherited from /videos/shared.toml.
     Native aspect 9:5 (encoded for editAI's 2880x1600 venue), so it will
     letterbox left/right on the Sceptics 16:9 venue. -->

---

<img src="/figures/ChargeAPE5LQanimXs30.gif" class="absolute inset-0 w-full
h-full object-cover" />

---

<img src="/figures/g2/g.001.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Dirac, 1928. g = 2. -->

---

<img src="/figures/g2/g.002.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Schwinger, 1948. Pirmoji kilpa: pataisa α/(2π). -->

---

<img src="/figures/g2/g.003.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Schwingerio antkapyje. -->

---

<img src="/figures/g2/g.004.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Karplus, Kroll, Sommerfeld, Petermann (1950–1957). -->

---

<img src="/figures/g2/g.005.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Aoyama, 2012. ~12 000 diagramų. -->

---

<img src="/figures/g2/g.006.png" class="absolute inset-0 w-full h-full
object-cover" />

<!-- Eksperimentinis matavimas. 12 ženklų po kablelio. -->

---

<VideoPlayer src="g2_data.mp4" muted />

<!-- Fermilab Muon g-2 — muonų sukinio osciliacija (duomenys). -->

---

<VideoPlayer src="g2_fit.mp4" muted />

<!-- Tas pats matavimas su modelio kreive. -->


---

# 🚫 **Mitas Nr. 1 — „Stebėtojas sukuria tikrovę“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Be **sąmoningo stebėtojo** banginė funkcija nesukolapsuoja. Realybės be matavimo
nėra.

</div>

</div>

---

# 🚫 **Mitas Nr. 1 — „Stebėtojas sukuria tikrovę“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Be **sąmoningo stebėtojo** banginė funkcija nesukolapsuoja. Realybės be matavimo
nėra.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

„Matavimas“ = **bet kokia negrįžtama sąveika**. Detektoriaus pikselis. Dujų
molekulė. Paklydęs fotonas.

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

Schrödingeris šį pavyzdį sugalvojo **kaip pajuokavimą** — norėdamas
**paneigti**, kad superpozicija galėtų galioti makroobjektams.

Šiltos, drėgnos katės būsena nusistovi per **~10⁻²⁰ s**.

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

  <div class="text-center mt-2 opacity-90">Skirtumas — **10¹⁹ kartų**.</div>

  </div>
</div>

---

# 🚫 **Mitas Nr. 3 — „Susipynimas = greičiau už šviesą“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Susipynusios dalelės leidžia perduoti **informaciją** akimirksniu — kvantinis
internetas, telepatija, „nuotolinis gydymas“.

</div>

</div>

---

# 🚫 **Mitas Nr. 3 — „Susipynimas = greičiau už šviesą“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Susipynusios dalelės leidžia perduoti **informaciją** akimirksniu — kvantinis
internetas, telepatija, „nuotolinis gydymas“.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Koreliacijos — taip, akimirksniu. **Informacija — ne.**

Atskiras matavimas — atsitiktinis triukšmas. Koreliacija išryškėja tik palyginus
du įrašus, o tas palyginimas keliauja **ne greičiau už šviesą**.

</div>

</div>

---


# 🚫 **Mitas Nr. 4 — „Neapibrėžtumas = bloga įranga“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Heisenbergo principas kalba apie matavimo trūkumus. Turėdami geresnę įrangą,
viską žinosime tiksliai.

</div>

</div>

---

# 🚫 **Mitas Nr. 4 — „Neapibrėžtumas = bloga įranga“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Heisenbergo principas kalba apie matavimo trūkumus. Turėdami geresnę įrangą,
viską žinosime tiksliai.

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

# 🚫 **Mitas Nr. 5 — „Kvantinis = sveikatai naudinga“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Etiketė „kvantinis“ — ant homeopatinių lašelių, vandens jonizatoriaus,
„kvantinės rezonansinės terapijos“, Reiki ar energetinio gydymo. Skamba
moksliškai — vadinasi, veikia.

</div>

</div>

---

# 🚫 **Mitas Nr. 5 — „Kvantinis = sveikatai naudinga“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Etiketė „kvantinis“ — ant homeopatinių lašelių, vandens jonizatoriaus,
„kvantinės rezonansinės terapijos“, Reiki ar energetinio gydymo. Skamba
moksliškai — vadinasi, veikia.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Kvantiniai efektai išlieka tik **šaltose, izoliuotose, mažose** sistemose.
Šiltame, drėgname kūne dekoherencija įvyksta per **~10⁻²⁰ s** — lygiai tas pats
argumentas, kaip ir su kate.

„Vandens atmintis“ — H₂O ryšiai persitvarko per pikosekundes; vandens molekulei
nėra kuo „atsiminti“.

Klinikinės meta-analizės (NHMRC 2015, Lancet 2005): efektas neatskiriamas nuo
placebo.

</div>

</div>

---

# 🚫 **Mitas Nr. 6 — „Kvantiniai kompiuteriai išspręs viską akimirksniu“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Kvantiniai kompiuteriai eksponentiškai greitesni už klasikinius. Nulauš visą
šifravimą, išspręs bet kokią problemą, paaiškins sąmonę.

</div>

</div>

---

# 🚫 **Mitas Nr. 6 — „Kvantiniai kompiuteriai išspręs viską akimirksniu“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Kvantiniai kompiuteriai eksponentiškai greitesni už klasikinius. Nulauš visą
šifravimą, išspręs bet kokią problemą, paaiškins sąmonę.

</div>

<div class="card card-success pad-tight">

### Ką sako fizika

Eksponentinis pagreitėjimas pasiekiamas **tik konkretiems** uždaviniams: Shoro
algoritmas (faktorizacija), kvantinė simuliacija, kai kurios tiesinės algebros
problemos.

Groverio paieška — **kvadratinis**, ne eksponentinis pagreitėjimas.

NP-pilnoms problemoms (komivojažieriaus, SAT) — jokio žinomo eksponentinio
pagreitėjimo.

**2026 m. realybė:** ~1000 kubitų prototipai, klaidų taisymas tik prasideda.

</div>

</div>

---

# 🔌 **Be QM nebūtų...**

<div class="grid-2 mt-md">

<div class="card card-primary pad-tight">

## 📱 **Tranzistorius**

Telefonai, kompiuteriai, automobiliai. Antrosios XX a. pusės revoliucija remiasi
juostine teorija — gryna kvantine mechanika.

</div>

<div class="card card-secondary pad-tight">

## 🔬 **Lazeris**

Stimuliuota emisija (Einsteinas, 1917). Šiandien — šviesolaidinis internetas,
brūkšninių kodų skaitytuvai, akių chirurgija.

</div>

<div class="card card-info pad-tight">

## 🧲 **MRT**

Branduolio sukinio rezonansas. Be Paulio ir Diraco MRT skenerių nebūtų.

</div>

<div class="card card-accent pad-tight">

## 🛰️ **GPS**

Atominiai laikrodžiai (cezio kvantinis šuolis) + reliatyvistinė pataisa. 
Be jų — ±11 km per dieną.

</div>

</div>

<div class="mt-md opacity-70 text-center">
Jeigu QM klystų 12 ženklų po kablelio — jūsų telefonas neįsijungtų.
</div>

---
layout: statement
---

# Kaip atpažinti „kvantinę“ rinkodarą

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Raudonos vėliavos 🚩

- „Kvantinis“ + sveikatos, finansų ar dvasingumo produktas
- „Stebėtojo efektas“, taikomas **nuotaikai**
- Susipynimas + „momentinis bendravimas“ ar „nuotolinis gydymas“
- Bet kas, parduodantis jums **tikrumą**

</div>

</div>

---
layout: statement
---

# Kaip atpažinti „kvantinę“ rinkodarą

<div class="grid-2 mt-md">

<div class="card card-success pad-tight">

### Žalios vėliavos ✅

- Konkreti, paneigiama  hipotezė
- Skaičiai, paklaidos, vienetai
- Teiginys „štai kur galiu klysti“
- Recenzuotas straipsnis, kurį *iš principo* galite perskaityti

</div>

</div>

---
layout: quote
---

# „Pirmoji taisyklė — neapgaudinėk savęs. O save apgauti yra lengviausia.“

 Richard Feynman

---

<VideoPlayer src="qgp_formation.mp4" :controls="false" />

---

<VideoPlayer src="cern_overview_short.mp4" muted :controls="false" />

---

<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" muted
:controls="false" />

---

<VideoPlayer src="cern_footage_2024_010_002.mp4" muted :controls="false" />

---

<VideoPlayer src="cern_footage_2025_014_002.mp4" muted :controls="false" />

---

<VideoPlayer src="lhcb.mp4" />

---

<VideoPlayer src="lhcb_aciu.mov" />