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

<VideoPlayer src="Voyage_in_to_the_world_of_atoms.mp4" loop muted :controls="false" />

---


<VideoPlayer src="Cloud_Chamber_Audio.mp4"/>

<!-- Cloud chamber: charged particles leave visible tracks because each ion
     they create is an irreversible interaction with the supersaturated vapor.
     Concrete example for "matavimas = bet kokia negrįžtama sąveika".
     Inherited from /videos/shared.toml. -->

---

<DoubleSlitDiagram mode="classical-no-barrier" />

<!-- Double-slit story, beat 1 of 3: source fires balls, they fly straight,
     pile up in a single tight spot. Establishes "balls go where you aim". -->

---

<DoubleSlitDiagram mode="classical-slits" />

<!-- Beat 2: a barrier with two slits. Each ball visibly takes ONE slit,
     accumulating into TWO distinct bands. The classical expectation. -->

---

<WaveDiagram />

---

<DoubleSlitDiagram mode="quantum" />

<!-- Beat 3: same setup, but quantum particles. Wavefronts emerge from BOTH
     slits and overlap; the dot pattern builds into interference fringes —
     bright bands AND dark gaps where classically you'd expect bright. -->

---

<DoubleSlitDiagram mode="classical-electrons" />

<!-- Beat 4: classical EXPECTATION for electrons. They're tiny balls, right?
     So shooting them at the slits should give two bands behind the slits,
     just like the marbles. This is what intuition predicts before we run
     the experiment. -->

---

<DoubleSlitDiagram mode="quantum-electrons" />

<!-- Beat 5: what ACTUALLY happens. Single e⁻ particles fly from the source
     one at a time and visibly disappear at the barrier; a faint wavelet
     expands from BOTH slits per electron, then a single dot lands on the
     screen. Fringe pattern builds up — punchline: each electron interferes
     with itself, even though we're sending them through one at a time. -->

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


<VideoPlayer src="g2_data.mp4" muted />

<!-- Fermilab Muon g-2 — muonų sukinio osciliacija (duomenys). -->

---

<VideoPlayer src="g2_fit.mp4" muted />

<!-- Tas pats matavimas su modelio kreive. -->

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

# 🚫 **Mitas Nr. 1 — „Stebėtojas sukuria tikrovę“**

<div class="grid-2 mt-md">

<div class="card card-warning pad-tight">

### Ką teigia mitas

Reikia **sąmoningo stebėtojo**, kad „sukolapsuotų banginę funkciją“. Realybės be žiūrėjimo nėra.

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

Šilta, drėgna katė pasirenka būseną per **$10^-20$s** s.

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

# „Pirmoji taisyklė — neapgaudinėk savęs. O save apgauti yra lengviausia.“

 Richard Feynman

---

<VideoPlayer src="QGP_Formation.mp4" :controls="false" />

---

<VideoPlayer src="CERN_Overview_Short.mp4" muted :controls="false" />

---

<VideoPlayer src="LHCb.mp4" />

---

<VideoPlayer src="LHCb_Aciu.mov" />

