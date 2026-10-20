---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-10-00-innoday
  fit: cover
  transition: dust          # every clip arrives and leaves as particles
  dust: '#5b93ff'
stage:
  space: data/space.json
  # the engine takes the ground as linear light, so blue's #03050d shows as navy
  # (15, 26, 51); this one shows as near-black with a trace of blue
  palette: { base: blue, bg: '#000103' }
  plugins: [hadron]
  sound: { hum: true, flight: false, clip: false }   # no flight whoosh, no clip rise: they read as driving sounds (owner, 12-13 Oct: "don't use the driving away sound")
  humAt: all   # but every slide except the funnel's two flights says space.hum: false (owner, 12 Oct: the hum only while zooming into the funnel); there <ShortHum> lets it sound ~3 s (owner, 14 Oct: "only 2-3s")
  # deeper than the blue palette's own look: a black ground (fewer, dimmer dust
  # grains, little nebula, a firmer vignette), no film grain, no fringes
  options: { nebula: 0.12, grain: 0.012, aberration: 0, bloom: 0.55, density: 0.6, dustGain: 1.45, vignette: 0.42 }
title: Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje
info: |
  Innoday 2026, 23 October, in Lithuanian. One story: to see what the world is
  made of, physicists needed a machine nobody could buy; each of its limits had
  to be broken, and the solutions left the laboratory as things in daily use;
  the next machine is being designed now, and Lithuanian firms can solve its
  problems. Title; the zoom-out from NFTMC in Saulėtekis to the cosmic web, whose last
  frame becomes the world's grains (<WebTakeover>); the history of the Universe as a
  funnel of grains (Big Bang, CMB, dark ages, hot proto-galaxies, then colder
  and sparser); the flight back to the CMB. CERN, the LHC tunnel with its
  numbers, one collision (components/lhc-opening), the LHCb animation with its
  music, LHCb in numbers, LHCb's results floating with its paper count.
  „O kur tai pritaikoma?“: the ring with a strand from each part to what it
  gave, each photo at its strand's end, named with its year and machine.
  „O kaip komercializuoti?“: contracts, procurement, suppliers, the FCC.
  Lithuania and CERN, with no section slide: photos of the LHCb Week in Vilnius
  (the rector, the President's video greeting, the panel with the
  vice-minister, the hall). The close: a laser writes the Lithuanian flag on a
  SciFi module's light injection cold box (a Blender clip), whose last frame
  becomes grains at its place in LHCb; „Ačiū“ over LHCb in grains with its own
  collision; the licence credits on a page after it. The owner's 12 Oct list brings back the title, the section breaks
  and „Ačiū“; the other slides carry pictures, named numbers and the
  inventions' names; the notes carry what is said. Keys on a video slide:
  p play/pause, + / - volume; `c` builds what stands where the camera is.
layout: cover
space: { at: wide, hum: false }
---

# Innoday 2026

# Nuo Vilniaus iki visatos pakraščių

## ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nc">LHCb</span> Vilnius · Vilniaus universitetas</div>

<!--
Kalbėtojui. Pavadinimo skaidrė (savininkas, 2026 10 12). Pirmas paspaudimas pereina prie įžanginio klipo ir kartu leidžia skambėti garsui (naršyklė garsą įjungia tik po naudotojo veiksmo). Rodant per /presenter, prieš pradedant vieną kartą spustelėti auditorijos langą. Už pavadinimo iš dulkių susirenka penki kvarkai — pentakvarkas, vienas LHCb atradimų; „c“ jį surenka iš naujo. Kol ši skaidrė rodoma, grotuvas iš anksto įkelia įžanginį klipą.
Sakyti: „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei, kuri dirba CERN LHCb eksperimente. Už manęs iš dulkių susirenka pentakvarkas — penkių kvarkų dalelė, kurią 2015 m. atrado LHCb. Pradėsime nuo Saulėtekio.“
(~0,5 min)
-->

---
space: { path: [[0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]], sway: 0, hum: false }   # a cut to the takeover's pose: the next slide stands exactly here
---

<OpenerStart poster="video-frames/nftmc_zoom_web.mp4.poster.jpg" />

<VideoPlayer src="nftmc_zoom_web.mp4" transition="fade" advance-on-end />

<!-- facts: nftmc-opened-2016 -->

<!--
Kalbėtojui. Klipas prasideda pats, kai skaidrė atsiveria. (Jei skaidrės atidaromos tiesiai šioje skaidrėje, rodomas pirmasis kadras, o pirmas paspaudimas paleidžia klipą su garsu, ne pereina toliau.)
Nutolinimas nuo NFTMC (Nacionalinis fizinių ir technologijos mokslų centras Saulėtekio slėnyje, atidarytas 2016 m.; Google Earth) iki kosminio tinklo: Saulėtekis, Vilnius, Lietuva, Žemė (~0:30), Saulė ir Paukščių Takas (~1:00), skrydis per mūsų galaktiką ir iš jos (~2:20), mūsų galaktika iš šalies (~3:10), ~20 s beveik juodos tarpgalaktinės erdvės, tada kosminis tinklas (~3:47) (savininko SpaceEngine montažas, nukirptas ties kadru, nuo kurio prasideda kita skaidrė; muzika užgęsta per paskutines 3 s). Galima tylėti arba trumpai įvardyti etapus. Kosminis tinklas — NCSA Advanced Visualization Lab vizualizacija („Cosmic Bubble Bath“, pirmųjų ~1,2 mlrd. metų simuliacija).
Spausti nereikia: klipui pasibaigus, skaidrės pačios pereina į kitą, kuri prasideda nuo to paties paskutinio kadro ir paverčia jį pasaulio grūdeliais. Paspaudus klipo metu, pereinama anksčiau (tada klipo pabaiga nieko nebedaro). Savaime pereinama tik auditorijos lange, ne /presenter.
(klipas 4:13, su savo muzika; ~4,2 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0, hum: false }
---

<WebTakeover />

<!--
Kalbėtojui. Skaidrė prasideda nuo paskutinio klipo kadro, todėl perėjimo nesimato. Po pusės sekundės tamsa tolygiai pereina į pasaulio foną, o šviesios vietos subyra į grūdelius. Kiekvienas grūdelis stovi savo pikselio regėjimo linijoje, todėl, kol kamera nejuda, grūdeliai sudaro tą patį vaizdą; kitoje skaidrėje jie susibėga į piltuvą.
Sakyti (kol byra): „Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų. Kiekvienas šio vaizdo taškas dabar atsiskiria ir pakimba erdvėje.“
Techniškai: kadras — public/figures/opener_last.jpg, išsitrauktas komanda pnpm takeover:frame public/videos/nftmc_zoom_web.mp4 (paskutinis klipo kadras — kosminis tinklas).
(~0,3 min)
-->

---
space: { at: [30, 39, -119], dist: 25, yaw: -72, pitch: 13, dim: 0, flight: 3.5 }   # the bell on its side, narrow end left, from three-quarters on the mouth side (the NASA/WMAP figure)
---

<ShortHum />

<AfterFlight :delay="6.8">
<div class="world-caption narrow small">

# 13,8 mlrd. metų

</div>
</AfterFlight>

<!--
Kalbėtojui. Kosminio tinklo grūdeliai susibėga į piltuvą (savininkas, 2026 10 13): pirmiausia vaizdo vidurys tampa Didžiuoju sprogimu ir foninės spinduliuotės skydu, tada grūdeliai išsidėsto piltuvu iki plačiojo galo; tada piltuvas išryškėja, o paskiausiai po juo atsiranda tinklelis. Kamera tuo metu apsuka ir parodo piltuvą iš šono: Visatos istorija iš grūdelių, nuo Didžiojo sprogimo (siauroji dalis) iki šiandienos (platusis galas, arčiau mūsų). Iš kairės į dešinę: Didysis sprogimas, foninė spinduliuotė, tamsieji amžiai be žvaigždžių, tanki karštų protogalaktikų ir pirmųjų žvaigždžių juosta, tada vis retesnės, šaltesnės ir toliau viena nuo kitos esančios galaktikos — Visata šąla ir tamsėja (savininkas, 2026 10 12). Žemas ūžesys skamba tik šios ir kitos skaidrės pradžioje, apie 3 s (savininkas, 2026 10 14). Skaičius pasirodo, kai piltuvas išryškėja (~7 s). Kitoje skaidrėje kamera įskrenda į piltuvą.
Sakyti: „Šis piltuvas yra Visatos istorija: siaurasis galas — Didysis sprogimas prieš 13,8 mlrd. metų, platusis — šiandien. Visata plečiasi, o maždaug pastaruosius šešis milijardus metų — vis greičiau. Kuo toliau žiūrime, tuo senesnę šviesą matome.“
Faktai: Visatos amžius 13,787 ± 0,020 mlrd. m. (Planck 2018, A&A 641, A6); spartėjantis plėtimasis — 1998 m. atradimas (2011 m. Nobelio premija); plėtimasis spartėja maždaug pastaruosius 6 mlrd. metų (z ≈ 0,6), tamsioji energija vyrauja maždaug pastaruosius 3,5 mlrd. metų (z ≈ 0,3) (Planck 2018, ΛCDM).
Šaltiniai: Planck 2018 results VI (A&A 641, A6).
(~0,4 min)
-->

---
space: { at: [30, 40, -136], dist: 7.5, yaw: 0, pitch: 0, dim: 0.1, flight: 5 }   # in at the mouth and back down the funnel, past the galaxies, the first stars and the dark ages, to the CMB disk
---

<ShortHum />

<AfterFlight :delay="4.6">
<div class="world-caption narrow">

# 380 000 metų

</div>
</AfterFlight>

<!--
Kalbėtojui. Kamera skrenda piltuvu atgal laiku: pro galaktikas, pirmąsias žvaigždes, tamsiuosius amžius, ir sustoja prie švytinčio skydo — kosminės foninės spinduliuotės. Skydas — tikras Planck temperatūros žemėlapis, nupieštas toje pačioje plokštumoje.
Sakyti: „Pro galaktikas, pro pirmąsias žvaigždes ir tamsiuosius amžius grįžtame iki seniausios šviesos, kurią įmanoma pamatyti. Tai kosminė foninė spinduliuotė: Visatai tada buvo apie 380 000 metų. Europos kosmoso agentūros palydovas Planck ją išmatavo visame danguje. Spalvos rodo temperatūros skirtumus, vos dešimttūkstantąsias kelvino dalis. Iš tokių nelygumų vėliau susiformavo galaktikos.“
Faktai: foninės spinduliuotės temperatūra 2,725 K; skirtumai žemėlapyje ~±100–300 µK (iki ~1 mK). Paskutinė sklaida — ~380 000 m. po Didžiojo sprogimo (z ≈ 1090).
Šaltiniai (ir vaizdas): Planck 2018 SMICA-noSZ žemėlapis (COM_CMB_IQU-smica-nosz_2048_R3.00_full, I_STOKES_INP — užpildytas ties Galaktikos plokštuma, apie 4 % skydo ploto), IRSA/ESA Planck Legacy Archive; ESA ir Planck kolaboracija; Planck 2018 results IV (A&A 641, A4). Skyde — šiaurinis Galaktikos pusrutulis (lygiaplotė projekcija, centre šiaurinis Galaktikos polius), išlyginta iki 1° (WMAP raiška), nuspalvinta WMAP stiliaus skale. Licencija CC BY-NC 3.0 IGO (nekomercinis naudojimas su nuoroda).
(~0,6 min)
-->

---
space: { at: [30, 40, -136], dist: 12, yaw: 24, pitch: 8, dim: 0.3, hum: false }   # pulled back from the CMB disk: the question stands over the oldest light
---

<!--
Kalbėtojui. Kamera atsitraukia nuo foninės spinduliuotės skydo, prieš seniausią šviesą. Klausimas „Iš ko visa tai sudaryta?“ — visos kalbos pradžia: kitos skaidrės rodo greitintuvą, kurį teko pastatyti, kad į jį atsakytume, ir ką davė jos problemos.
Sakyti: „Žvaigždės, dujos, planetos ir mes patys sudaryti iš kelių rūšių dalelių. Norint pamatyti, kas yra jų viduje, daleles reikia sudaužyti labai didele energija. Tam reikia didžiausio pasaulyje dalelių greitintuvo. Jį pastatė CERN, Europos dalelių fizikos laboratorija prie Ženevos.“
Pastaba: „žvaigždės, dujos, planetos ir mes“ — tyčia ne „galaktikos“: didžioji galaktikų masės dalis yra tamsioji materija, kurios sudėties nežinome.
(~0,4 min)
-->

---
space: { at: [20, 5, -12], dist: 18, yaw: -30, pitch: 14, hum: false }
---

<Strands :on="false" />

<VideoPlayer src="cern_overview_short.mp4" />

<!--
Kalbėtojui. I dalis (Greitintuvas) prasideda čia. CERN iš paukščio skrydžio: Ženevos priemiestis, Prancūzijos ir Šveicarijos pasienis. Klipas trumpas (0:11) — kalbėti per jį ir po jo.
Sakyti: „Tai CERN. Jį 1954 m. įkūrė 12 Europos valstybių, kad po karo galėtų kartu tirti, iš ko sudarytas pasaulis. Šiandien jis turi 25 valstybes nares ir 11 asocijuotųjų narių, tarp jų Lietuvą. Su CERN dirba daugiau nei 12 000 mokslininkų, daugiau nei 110 tautybių atstovų. Po šiais laukais, apie 100 m gylyje, yra 27 km ilgio greitintuvo žiedas.“
Faktai: konvencija pasirašyta 1953 m., CERN oficialiai įsteigtas 1954 m. rugsėjo 29 d. Steigėjos — Belgija, Danija, Prancūzija, VFR, Graikija, Italija, Nyderlandai, Norvegija, Švedija, Šveicarija, JK, Jugoslavija. Naujausios narės — Estija (2024) ir Slovėnija (2025). Asocijuotosios narės (11): Brazilija, Čilė, Kroatija, Kipras (parengiamasis etapas), Indija, Airija, Latvija, Lietuva, Pakistanas, Turkija, Ukraina. Apie 2 500 darbuotojų, 12 639 registruoti naudotojai (2025). 2026 m. biudžeto įnašai — apie 1,28 mlrd. CHF.
Šaltiniai: home.cern/about/who-we-are/our-history; home.cern/about/who-we-are/member-states; usersoffice.web.cern.ch (2025 m. statistika); fap-dep.web.cern.ch (2026 m. įnašai).
(klipas 0:11; kalbos ~0,5 min)
-->

---
space: { at: collision, dim: 1, ambient: 0, hum: false }   # black under the clip; its push lands in the collision's dark
---

<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" advance-on-end :volume="0.5" exit="push" exit-at="0.45,0.53" />

<AfterFlight :delay="2.4">
<div class="stats">
<div class="stat"><div class="n">26,7<small>km</small></div></div>
<div class="stat"><div class="n">−271,3<small>°C</small></div></div>
<div class="stat"><div class="n">2,85<small>m/s</small></div></div>
<div class="stat"><div class="n">1,5<small>mlrd. susidūrimų/s</small></div></div>
</div>
</AfterFlight>

<!-- facts: cern-lhc-size-cost, cern-lhc-cold, cern-lhc-speed, cern-lhc-collisions -->

<!--
Kalbėtojui. Kelionė LHC tuneliu (CERN-FOOTAGE-2022-013-001, 3:00–3:39,5), skaičiai virš jos. Klipui pasibaigus, kamera įlekia į tolį, kur dingsta magnetų eilė, ir prasideda susidūrimas (savaime, tik auditorijos lange). Šie skaičiai — II dalies problemos.
Sakyti: „Kad sužinotume, iš ko sudarytas pasaulis, greitintuvas turėjo būti toks. Jo žiedas yra 27 km ilgio ir 100 m po žeme. 1 232 superlaidūs magnetai atšaldomi iki minus 271 laipsnio Celsijaus, šalčiau nei erdvė tarp galaktikų. Protonai skrieja tik 2,85 m/s lėčiau už šviesą ir per sekundę apskrieja žiedą 11 245 kartus, o susidūrimų per tą pačią sekundę įvyksta apie pusantro milijardo, ir kiekvieną reikia pamatyti. Vaizdo plokštes galima nusipirkti parduotuvėje, o daugelio kitų dalykų niekas negamino, todėl juos teko sukurti. Su tokiomis problemomis per penkiasdešimt metų susidurta ir kuriant ankstesnius CERN greitintuvus.“
Svarbu: nuo 2026 06 29 LHC neveikia — prasidėjo trečioji ilgoji techninė pertrauka (LS3), todėl skaičiai — darbo metu (3-iasis darbo etapas: 6,8 TeV, 99,99999905 % šviesos greičio). Dažnai cituojamas „99,9999991 %“ atitinka projektinę 7 TeV energiją. Kosminis fonas — 2,7 K.
Faktai: 9 593 magnetai; vakuumas vamzdyje ~10⁻¹³ bar; pluošte sukaupta energija iki 490 MJ.
Šaltinis: home.cern/science/accelerators/large-hadron-collider (3-iojo darbo etapo, 2022–2026, parametrai).
Ekrane tik skaičiai: 26,7 km — žiedas 100 m po žeme; −271,3 °C — magnetai šaltesni nei erdvė tarp galaktikų; 2,85 m/s — tiek protonai lėtesni už šviesą; 1,5 mlrd. — susidūrimų per sekundę.
Vaizdas: CERN-FOOTAGE-2022-013-001 (LHC tunelio kelionė), © CERN.
(~0,9 min)
-->

---
space:
  at: collision
  dim: 0
  ambient: 0
  rate: [[0, 1.4], [2.0, 1.4], [2.7, 0.03], [5.6, 0.03], [6.6, 1.0], [8.0, 1.0], [9.0, 1.8], [11, 1.8], [12, 1]]
  cameraRate: 1
  path:
    - [0, { at: [0, -400, 0], dist: 4.2, yaw: 18, pitch: 5 }]
    - [2.6, { at: [0, -400, 0], dist: 2.4, yaw: 32, pitch: 8 }]
    - [5.6, { at: [0, -400, 0], dist: 1.5, yaw: 70, pitch: 14 }]
    - [6.5, { at: [0, -400, 0], dist: 3.3, yaw: 58, pitch: 17 }]
    - [7.3, { at: [0, -400, 0], dist: 5.6, yaw: 26, pitch: 20 }]
    - [8.3, { at: [0, -400, 0], dist: 8.8, yaw: 9, pitch: 24 }]
    - [9.8, { at: [0, -400, 0], dist: 11.2, yaw: 4, pitch: 26 }]
    - [11.5, { at: [0, -400, 0], dist: 12, yaw: 2, pitch: 26 }]
  hum: false
---

<LhcOpening name="opening" :count="290" />

<!-- facts: cms-195099-137440354-record-300, cms-195099-8tev, cms-195099-290-drawn-tracks, cms-solenoid-3p8-tesla -->

<!--
Kalbėtojui. Vienas tikras susidūrimas (bendras modulis components/lhc-opening, kaip OpenData ir „Užsikrauk karjerai“ kalbose). Du protonų paketai atlekia iš abiejų vamzdžio galų, susiduria, pasaulis beveik sustoja, kamera apsuka ratą, tada nuolaužos išlekia. Ekrane: „8 TeV“ (susidūrimo energija) ir „290 dalelių“ (nupiešti įvykio pėdsakai).
Savininko pasirinktas (2026 10 12) CMS 4π susidūrimas: 2012 m. Higso bozono kandidatas, visomis kryptimis aplink 3,8 T solenoidą.
Sakyti: „Taip atrodo vienas susidūrimas. Tokių kas sekundę — pusantro milijardo.“
Faktai: įvykis — CERN atvirųjų duomenų įrašas 300 (CMS 2012, 8 TeV, CC0), paleidimas 195099, įvykis 137440354, Higso bozono kandidatas; nupiešta 290 pėdsakų.
Šaltiniai: opendata.cern.ch (įrašas 300); components/lhc-opening/README.md.
(~0,3 min)
-->

---
space: { at: [56, 5, -14], dist: 16, yaw: -28, pitch: 12, hum: false }
---

<VideoPlayer src="lhcb.mp4" transition="fade" />

<!--
Kalbėtojui. LHCb detektoriaus 3D animacija su muzika (lhcb.mp4: tas pats vaizdas kaip CERN-FOOTAGE-2022-042-001, pirmosios 47 s; savininkas, 2026 10 12: „LHCb video with sound“). Klipas atsiranda tolygiai (ne grūdeliais), kad muzika skambėtų nuo pradžios. Kalbėti tyliau per muziką arba leisti jai skambėti.
Sakyti: „Mūsų eksperimentas — LHCb. Jis, be kita ko, tiria, kodėl Visatoje liko materija. Didysis sprogimas turėjo sukurti po lygiai materijos ir antimaterijos. Susitikusios jos viena kitą sunaikina, tačiau materijos liko. Todėl LHCb lygina, kaip skyla dalelės ir jų antidalelės, ir ieško mažyčių skirtumų. Detektorius 21 m ilgio ir stovi tik vienoje susidūrimo taško pusėje, nes jį dominančios dalelės dažniausiai išlekia pirmyn, arti pluošto. Arčiausiai pluošto, vos 5 mm nuo jo, stovi pikselių detektorius. Vilniaus universitetas yra LHCb kolaboracijos narys nuo 2024 m.“
Jei klausia apie rezultatus: 2025 m. LHCb pirmą kartą pamatė materijos ir antimaterijos elgesio skirtumą barionuose — dalelių šeimoje, kuriai priklauso protonai ir neutronai (>80 000 Λb⁰ → p K⁻ π⁺ π⁻ skilimų, asimetrija (2,45 ± 0,47) %, 5,2σ; Nature 2025 07 16). Standartinio modelio CP pažeidimo nepakanka stebimam materijos pertekliui paaiškinti (barionų ir fotonų santykis ~10⁻¹⁰, SM numato ~10⁻¹⁸).
Faktai: LHCb sveria 5 600 t, 21 × 10 × 13 m, 100 m po žeme; artimiausias VELO pikselis — 5,1 mm nuo pluošto; kolaboracijoje beveik 2 000 narių. VU priimtas 2024 m. rugsėjo 2 d. LHCb kolaboracijos tarybos sprendimu; grupė dirba VU FF Fotonikos ir nanotechnologijų institute (lhcb-vilnius.web.cern.ch). 2026 m. rugsėjo 14–18 d. LHCb savaitė pirmą kartą vyko Vilniuje (~200 dalyvių vietoje).
Šaltinis: home.cern/science/experiments/lhcb; VU FF naujienos, 2024 09 16.
(klipas 0:48; kalbos ~1 min)
-->

---
space: { at: [21, 0, 0], dist: 5, yaw: 180, pitch: 22, dim: 0, hum: false }
---

<StagePhoto src="figures/lhcb_collaboration.jpg" alt="LHCb kolaboracija LHCb urve po LHCb ženklu, 2022 m. birželio kolaboracijos savaitė" class="frame" />

<div class="stats top">
<div class="stat"><div class="n">4<small>TB/s</small></div></div>
<div class="stat"><div class="n">~1 900<small>narių</small></div></div>
<div class="stat"><div class="n">112<small>institutų</small></div></div>
<div class="stat"><div class="n">28<small>šalys</small></div></div>
</div>

<!-- facts: lhcb-upgrade1-trigger, lhcb-allen-gpu, lhcb-collaboration-sep-2026, lhcb-readout-32tbps-spc-2026 -->

<!--
Kalbėtojui. LHCb skaičiais, ant kolaboracijos nuotraukos (CERN-PHOTO-202206-112-6, 2022 m. birželio 17 d. kolaboracijos savaitė, LHCb urve). Ekrane: 4 TB/s, ~1 900 narių, 112 institutų, 28 šalys (LHCb ataskaita CERN Mokslo politikos komitetui, 2026 09 22: 1 891 narys).
Sakyti (pirmiausia): „Mus — beveik du tūkstančiai žmonių iš 112 institutų 28 šalyse.“
Sakyti: „Šiandien mūsų eksperimento problema yra duomenų kiekis. LHCb detektorius kas sekundę pagamina apie 4 terabaitus. Tiek užrašyti neįmanoma, todėl reikia iš karto nuspręsti, ką pasilikti. Nuo 2022 m. tai daro vaizdo plokštės su tais pačiais lustais kaip žaidimų kompiuteriuose. LHCb — pirmasis eksperimentas, kurio visa pirmoji atrankos pakopa veikia vaizdo plokštėse. Į diską patenka maždaug vienas baitas iš keturių šimtų.“
Faktai: GPU — NVIDIA RTX A5000 (profesionali žaidimų lusto versija); vietų ~500, bazinei HLT1 reikia ~200; antroji pakopa — >3 000 serverių; į diską ~10 GB/s.
Šaltiniai: LHCb, JINST 19 (2024) P05065; CERN EP Newsletter (2020); T. Gershon, LHCb ataskaita CERN SPC, 2026 09 22 (32 Tb/s = 4 TB/s; tai apie 3 % pasaulio tarptautinio interneto pralaidumo, 997 Tb/s 2022 m., TeleGeography).
Vaizdas: CERN-PHOTO-202206-112-6, nuotr. Piotr Traczyk / CERN (CERN sąlygos).
Jei klausia apie atviruosius duomenis: visus 2011–2012 m. LHCb duomenis (800 TB) viešam naudojimui parengiau. Nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, o nuo 2026 m. kovo per internetinę paslaugą galima gauti ir antrojo etapo duomenis, iš viso daugiau nei 4 PB.
(~0,7 min)
-->

---
space:
  at: [60, -30, 50]
  dim: 0
  hum: false
  path:   # a slow drift over the middle of the cards (results station, space.json)
    - [0, { at: [58.4, -31.4, 49], dist: 15, yaw: 9, pitch: 5 }]
    - [24, { at: [61.2, -31.8, 49], dist: 13, yaw: -7, pitch: 2 }]   # aimed low: the cards ride above the count
---

<div class="readout right">

<div class="big"><Count :from="0" :to="875" :ms="2200" /><span class="unit">straipsniai</span></div>

</div>

<!-- facts: lhcb-papers-2026-10, lhcb-figure-2026-010-hadrons -->

<!--
Kalbėtojui. Kamera lėtai plaukia tarp LHCb rezultatų grafikų iš paskelbtų straipsnių (CC BY 4.0, apkarpyti, perspalvinti): pentakvarkai Pc(4312), Pc(4440), Pc(4457) (PRL 122, 2019), CP pažeidimas barionuose (Nature 643, 2025; rodoma tik Λb⁰ pusė: antibarionų pusė atrodė kaip pakartota, todėl nukirpta (savininkas, 2026 10 13); smailės aukštis nėra tas 2,45 % skirtumas — taip nesakyti), Bs⁰ osciliacijos (Nature Physics 18, 2022), Tcc⁺ tetrakvarkas (Nature Physics 18, 2022), Ωcc⁺ (arXiv:2609.21921, 2026), Bs⁰→μ⁺μ⁻ (PRL 118, 2017), R(K) ir R(K*) ant Standartinio modelio linijos (PRD 108, 2023) ir LHCb-FIGURE-2026-010: 76 LHCb atrasti hadronai.
Sakyti: „Ką mes randame? Iki šiol LHCb paskelbė 875 mokslinius straipsnius. Tarp jų — penkių kvarkų dalelės, pentakvarkai, kuriuos atradome 2015 m., ir pernai pirmą kartą pamatytas materijos ir antimaterijos skirtumas barionuose. Iš viso LHCb atrado 76 naujas daleles — daugiau nei bet kuris kitas eksperimentas.“
Skaičių prieš kalbą patikrinti (2026 10 22) LHCb viešųjų rezultatų sąraše ir pataisyti, jei pasikeitė.
Šaltiniai: LHCb viešieji rezultatai (lhcbproject.web.cern.ch/Publications, LHCb Glance), INSPIRE (875: 860 su žurnalo nuoroda ir 15 recenzuojami, 2026 10 12); grafikai — LHCb kolaboracija, CC BY 4.0, apkarpyti ir perspalvinti (šviesūs ant juodo, kaip OpenData kalboje).
(~0,7 min)
-->

---
layout: section
hideInToc: true
space: { at: [14, 1, 0], dist: 36, yaw: -20, pitch: 52, dim: 0.15, hum: false }   # the ring and every strand leaving it
places: { inventions: true }   # Part II's photos stand in the world from here (hidden before)
---

<Strands />

<div class="sub">O kur tai pritaikoma?</div>

<!--
Kalbėtojui. Dalies pertrauka (savininkas, 2026 10 12). Pasaulyje — greitintuvo žiedas ir iš jo išeinančios gijos. Šešios tekančių grūdelių gijos veda nuo greitintuvo dalių prie to, kas iš jų atsirado; kiekviena šios dalies skaidrė prasideda problema ir baigiasi tuo, kas iš jos išėjo į pasaulį. Tvarka: kas yra jūsų kišenėje, kas padeda gydytojams ir astronautams, kas vyksta pramonėje šiandien.
Sakyti: „Šešios problemos: kaip valdyti greitintuvą, kaip tvarkyti informaciją, kaip pamatyti dalelę, kaip nukreipti pluoštą, kaip suderinti laikrodžius ir kaip atšaldyti. Iš kiekvienos atsirado kas nors, kas šiandien naudojama už CERN ribų. Pradėsiu nuo jutiklinio ekrano, kurį turite savo telefone.“
(Jutiklinio ekrano nevadinti CERN išradimu: CERN buvo vienas pirmųjų, ne pirmasis.)
(~0,4 min)
-->

---
space: { at: stumpe, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="stumpe" :relief="0.25" :at="[19.5, 2.5, -9.53]" :size="3" :yaw="-30" src="figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" focus="50% 30%">
<p class="caption invention">Jutiklinis ekranas · 1972 · SPS</p>
</StagePhoto>
</AfterCover>

<!-- facts: gave-touch-stumpe-1972, gave-touch-sps-1976, gave-touch-design-80um, gave-touch-johnson-1965 -->

<!--
Kalbėtojui.
Sakyti: „Naujajam SPS greitintuvui valdyti reikėjo tiek mygtukų ir rankenėlių, kad jie netilpo į pultus. 1972 m. CERN inžinierius Bentas Stumpe pasiūlė ekraną, kurio mygtukai yra programuojami ir kurį tereikia paliesti pirštu. Kartu su Franku Becku jis sukūrė skaidrų talpinį jutiklinį ekraną. Vario linijos ant stiklo buvo 80 mikrometrų pločio, todėl jų nesimatė. 1973 m. pagamintas pirmasis veikiantis prototipas, o kai 1976 m. SPS pradėjo veikti, jo valdymo pultuose ekranai jau buvo. Nuotraukoje — Stumpe su savo ekrano plokšte ir išmaniuoju telefonu.“
Sąžiningai: tai vienas pirmųjų talpinių jutiklinių ekranų pasaulyje, ne pirmasis — pirmąjį aprašė E. A. Johnsonas (JK) 1965 m. CERN Courier CERN ekraną vadina „apparently the first application of the capacitative touch screen in the world“ ir šiuolaikinių telefonų ekranų pirmtaku — tai CERN požiūris, tiesioginė technologijų linija iki išmaniųjų telefonų neįrodyta.
Istorija: pasiūlymas ranka parašytas 1972 m. kovo 11 d. Stumpe atsisakė pasirašyti konfidencialumo sutartį dėl vėlesnio X–Y ekrano, nes CERN išradimus skelbia viešai.
Vaizdas: Bentas Stumpe su jutiklinio ekrano plokšte, 2016; nuotr. Sophia Elizabeth Bennett / CERN, CC BY 4.0 (Wikimedia Commons).
Šaltiniai: cerncourier.com/?p=9153; repository.cern/records/xrg56-9ha60; IDC (2026 01 13).
(~0,8 min)
-->

---
space: { at: [25.0, 2.5, 0.0], dist: 9, yaw: -90, pitch: 30, dim: 0, flight: 1.6, hum: false }   # strand 0°: from its ring part, looking out along it to the product
---

<Strands />

<StagePhoto src="figures/hero_proposal.jpg" arrive="camera" :dust-ms="[800, 600]" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" focus="50% 0%">
<p class="caption invention">Pasaulinis žiniatinklis · 1989 · LEP</p>
</StagePhoto>

<!--
Kalbėtojui.
Sakyti: „CERN dirba tūkstančiai žmonių, kurie atvyksta vidutiniškai dvejiems metams ir išvyksta, o jų žinios pasimeta. 1989 m. kovą CERN programuotojas Timas Bernersas-Lee pasiūlė, kaip tą informaciją sujungti. Pasiūlyme jis cituoja klausimą, kuriuo tada baigdavosi pokalbiai apie būsimąjį LHC: kaip susigaudyti tokiame dideliame projekte? Vadovas Mike'as Sendallas ant pirmojo puslapio užrašė tris žodžius: „Vague but exciting…“ — „Miglota, bet įdomu…“ Iš to pasiūlymo atsirado pasaulinis žiniatinklis.“
Pasiūlymo įžanga: daugelis diskusijų apie CERN ateitį ir LHC erą baigiasi klausimu „Yes, but how will we ever keep track of such a large project?“ 1990 m. lapkričio 12 d. formaliame projekto pasiūlyme (su Robert'u Cailliau) prašyta 4 programinės įrangos inžinierių ir programuotojo maždaug pusmečiui.
Vaizdas: T. Bernerso-Lee pasiūlymas su M. Sendallo pastaba, CERN ekspozicija; nuotr. Sailko, CC BY 3.0 (Wikimedia Commons).
Šaltiniai: w3.org/History/1989/proposal.html; w3.org/Proposal.html.
(~0,7 min)
-->

---
space: { at: next, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="next" :relief="0.25" :at="[27.0, 2.5, 4.5]" :size="3" :yaw="-90" src="figures/hero_next.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" focus="35% 55%">
<p class="caption invention">Žiniatinklio serveris · 1990 · LEP</p>
</StagePhoto>
</AfterCover>

<!-- facts: gave-www-next-server, gave-www-public-domain-1993, gave-www-sites-2026, gave-www-users-2025 -->

<!--
Kalbėtojui.
Sakyti: „1990 m. pabaigoje šis NeXT kompiuteris tapo pirmuoju žiniatinklio serveriu, info.cern.ch. Ant jo lipdukas: „Šis kompiuteris — serveris, NEIŠJUNGTI!!“ Išjungus jį, būtų išjungtas visas tuometinis žiniatinklis. 1993 m. balandžio 30 d. CERN atsisakė visų teisių į žiniatinklio programinę įrangą, ir ja galėjo naudotis bet kas. Tai padėjo žiniatinkliui paplisti. Šiandien yra beveik pusantro milijardo svetainių, o internetu naudojasi apie 6 milijardai žmonių.“
Nesakyti „CERN išrado internetą“: internetas egzistavo anksčiau; CERN sukūrė žiniatinklį (WWW), veikiantį internete.
Faktai: pirmasis viešas paskelbimas — 1991 08 06 alt.hypertext grupėje; pirmasis serveris už Europos ribų — 1991 12 12, SLAC. 1994 m. pabaigoje — 10 000 serverių, 10 mln. naudotojų. Netcraft, 2026 m. liepa: 1 494 915 628 svetainės; ITU: ~6 mlrd. žmonių (74 %) internete 2025 m.
Vaizdas: pirmasis žiniatinklio serveris, CERN, 1990; nuotr. Patrice Loïez / CERN, CC BY-SA 4.0.
Šaltiniai: home.cern/science/computing/the-birth-of-the-web/; netcraft.com (2026 07); itu.int.
(~0,7 min)
-->

---
space: { at: pet, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="pet" :relief="0.3" :at="[19.5, 2.5, 9.53]" :size="3" :yaw="-150" src="figures/hero_pet.jpg" alt="Šiuolaikinis PET/KT skeneris ligoninės kabinete" focus="60% 50%">
<p class="caption invention">PET tomografija · 1977</p>
</StagePhoto>
</AfterCover>

<!-- facts: ktbest-pet-1977, gave-pet-mouse-1977 -->

<!--
Kalbėtojui. Iš kišenės — į ligoninę.
Sakyti: „Dalelių fizikai visą laiką kuria detektorius, kurie pamato vieną dalelę. Tokie detektoriai tinka ir medicinai. PET tomografija parodo, kur organizme ypač aktyvi medžiagų apykaita, pavyzdžiui, kur auga navikas. 1977 m. vasarą CERN fizikas Alanas Jeavonsas su savo detektoriumi ir Davidas Townsendas su vaizdų rekonstrukcijos programa gavo pirmąjį CERN PET vaizdą. Vėliau Townsendas su Ronu Nuttu JAV sujungė PET su kompiuterine tomografija, o žurnalas TIME PET/KT skenerį paskelbė 2000 m. medicinos išradimu. Pirmąjį komercinį PET/KT skenerį 2001 m. pagamino Siemens. Šiandien tai kasdienė onkologų priemonė.“
Sąžiningai — CERN pats rašo: „PET was not invented at CERN, but the work carried out by Jeavons and Townsend made a major contribution to its development.“
Faktai: pirmasis CERN PET vaizdas — pelės; Townsendas dirbo Ženevos kantono ligoninėje, vėliau Pitsburgo universitete. PET/KT kūrimas finansuotas nuo 1995 m., pirmieji klinikiniai vaizdai 1998 m., pirmasis komercinis Siemens Biograph — 2001 m.; iki 2005 m. — >1 000 PET/KT skenerių.
Vaizdas: šiuolaikinis PET/KT skeneris, CERMEP, Lionas; nuotr. Romainbehar, CC0.
Šaltiniai: kt.cern/?p=1341; cerncourier.com/a/pet-and-ct-a-perfect-fit/; Siemens Healthineers.
(~0,7 min)
-->

---
space: { at: mars, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="mars" :relief="0.25" :at="[16.6, 2.5, 13.51]" :size="3" :yaw="-150" src="figures/hero_mars.jpg" alt="Spalvotas 3D žmogaus riešo rentgeno vaizdas: kaulai balti, minkštieji audiniai raudoni, metaliniai varžtai mėlyni" focus="40% 50%">
<p class="caption invention">Spalvotas rentgenas · 2018 · LHC</p>
</StagePhoto>
</AfterCover>

<!-- facts: ktbest-mars-fda-2026, ktbest-medipix-licences -->

<!--
Kalbėtojui.
Sakyti: „Mūsų detektoriuose dalelę užregistruoja pikselių lustai. Tos pačios technologijos lustas Medipix3 skaičiuoja kiekvieną rentgeno fotoną atskirai ir išmatuoja jo energiją, tarsi spalvą. Įprastas rentgenas to nedaro, jis matuoja tik tai, kiek spinduliuotės praėjo. Naujosios Zelandijos įmonė MARS Bioimaging su šiuo lustu pastatė skenerį, kuris daro spalvotus 3D vaizdus. Nuotraukoje — riešas: kaulai balti, audiniai raudoni, metaliniai varžtai mėlyni. Šių metų kovą skeneris gavo JAV FDA leidimą, praėjus 20 metų nuo idėjos. Medipix technologija naudojama pagal 30 komercinių licencijų ir pramonei atnešė daugiau nei 100 mln. frankų pajamų.“
Ratas: hibridinių pikselių technologija gimė dalelių fizikoje, Medipix kolaboracija ją pritaikė rentgenui, o LHCb VELO detektorių nuskaito VeloPix lustai, sukurti Timepix3 pagrindu (41 mln. 55 µm pikselių) — CERN tai vadina „a direct spin back to high-energy physics“.
Faktai: MARS įkūrė Philas ir Anthony Butleriai (2007); pirmasis spalvotas 3D žmogaus vaizdas — 2018 m. liepą. FDA 510(k) nešiojamam fotonų skaičiavimo KT skeneriui rankų tyrimams. Medipix (CERN 2026 m. studija): 30 aktyvių licencijų, >5 mln. CHF honorarų, >100 mln. CHF pramonės pajamų, 73 patentai, paremti Medipix publikacijomis.
Vaizdas: MARS Bioimaging Ltd (CERN KT CDS įrašas KTTGROUP-PHO-TECH-2020-001); jei rodoma ne švietimo tikslais — paprašyti MARS leidimo.
Šaltiniai: kt.cern/first-3d-colour-x-ray-of-a-human-using-cern-technology/; kt-report-2025.web.cern.ch (socioekonominė studija).
(~0,8 min)
-->

---
space: { at: artemis, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="artemis" :relief="0.3" :at="[24.4, 2.5, 9.01]" :size="3" :yaw="-150" src="figures/hero_artemis.jpg" alt="NASA Artemis II raketa SLS kyla iš paleidimo aikštelės" focus="50% 40%">
<p class="caption invention">Timepix lustai · 2006 · LHC</p>
</StagePhoto>
</AfterCover>

<!-- facts: gave-timepix-artemis, ktbest-advacam, gave-timepix-2006 -->

<!--
Kalbėtojui. Ta pati lustų šeima.
Sakyti: „Ta pati lustų šeima šį balandį skrido aplink Mėnulį. Šeši CERN Timepix lustai Artemis II Orion kapsulėje realiuoju laiku matavo, kokią spinduliuotės dozę gauna įgula. Modulius pagamino Prahos įmonė ADVACAM, kuri išaugo iš šios CERN technologijos.“
Artemis II — pirmoji pilotuojama kelionė link Mėnulio nuo 1972 m. (startas 2026 m. balandžio 1 d. 18:35 Floridos laiku (Lietuvoje jau balandžio 2 d., 01:35); nusileido balandžio 10 d.). Timepix lustai TKS naudojami nuo 2012 m.; Timepix (NASA HERA) skrido ir 2022 m. nepilotuojamame Artemis I. ADVACAM — Praha, įkurta 2013 m.
Vaizdas: Artemis II startas, 2026 m. balandžio 1 d.; nuotr. NASA / Michael DeMocker.
Šaltiniai: medipix.web.cern.ch/medipix2 (Timepix, 2006); kt.cern/?p=1333 (hibridiniai pikseliai — LHC); NASA (Artemis II); advacam.com.
(~0,4 min)
-->

---
space: { at: hadron, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="hadron" :relief="0.3" :at="[8.5, 2.5, 9.53]" :size="3" :yaw="150" src="figures/hero_hadron.jpg" alt="Hadronų terapijos centro sinchrotronas" focus="50% 50%">
<p class="caption invention">Hadronų terapija · 1996–2000 · PIMMS</p>
</StagePhoto>
</AfterCover>

<!-- facts: ktbest-hadron-9000, gave-hadron-pimms -->

<!--
Kalbėtojui.
Sakyti: „Greitintuvais dalelių pluoštą galima nukreipti labai tiksliai. Protonai ir anglies jonai didžiąją energijos dalį atiduoda tam tikrame gylyje, todėl jais galima apšvitinti naviką ir mažiau pažeisti aplinkinius audinius. Tai vadinama hadronų terapija. CERN su partneriais 1996–2000 m. suprojektavo gydymui skirtą sinchrotroną ir projektą paskelbė atvirai. Pagal jį pastatyti du centrai: CNAO Italijoje ir MedAustron Austrijoje. CNAO pirmąjį pacientą gydė 2011 m. Juose jau gydyta daugiau nei 9 000 pacientų su retais ir sunkiai pagydomais navikais.“
Jei laikas leidžia: „CERN su Lozanos ligonine CHUV ir įmone THERYQ kuria FLASH greitintuvą DEFT: visa spindulinio gydymo dozė per mažiau nei 0,1 s, iki 25 cm gylio. Jis remiasi CERN CLIC technologija.“ Taip pat: CERN-MEDICIS 2025 m. IV ketv. pirmą kartą išsiuntė aktinio-225 pramonei — RayzeBio (2024 m. už 4,1 mlrd. USD įsigijo „Bristol Myers Squibb“).
Faktai: PIMMS (CERN, TERA, MedAustron, Onkologie-2000). CNAO Pavijoje (pirmasis pacientas 2011 m.), iki 2026 m. liepos >6 200 pacientų, vienas iš 8 pasaulio centrų, gydančių ir protonais, ir anglies jonais; MedAustron (pirmasis pacientas 2016 m. gruodį) iki 2025 m. sausio >2 700 pacientų. CERN 2026 m. studija: kartu „beveik 9 000“; su naujausiais centrų duomenimis — >9 000. DEFT: 140 MeV elektronai, 20–30 Gy. PRISMAP (2021–2025): 159 siuntos, 23 radionuklidai, 47 projektai iš 19 šalių.
Vaizdas: MedAustron sinchrotronas, Vyner Noištatas (Austrija); © CERN.
Šaltiniai: cerncourier.com/a/therapeutic-particles/ (PIMMS 1996–2000, CNAO 2011, MedAustron 2016); CNAO ir MedAustron duomenys; CERN socioekonominė studija (2026).
(~0,7 min)
-->

---
space: { at: whiterabbit, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="whiterabbit" :relief="0.3" :at="[3.0, 2.5, 0.0]" :size="3" :yaw="90" src="figures/white_rabbit.jpg" alt="White Rabbit jungiklis WRS-3/18 su šviesolaidžiais" focus="50% 50%" class="dim">
<p class="caption invention">White Rabbit · 2008 · LHC</p>
</StagePhoto>
</AfterCover>

<!-- facts: gave-white-rabbit, ktbest-whiterabbit-boerse, ktnews-wr-quantum, gave-white-rabbit-2008 -->

<!--
Kalbėtojui. Iš ligoninės — į pramonę šiandien.
Sakyti: „Tūkstančiai greitintuvo įrenginių turi veikti tiksliai vienu metu. Todėl CERN sukūrė White Rabbit: sistemą, kuri laikrodžius tinkle suderina nanosekundės dalies tikslumu. Ji veikia nuo 2012 m., jos aparatinė įranga atvira, ir šiandien ja naudojasi Frankfurto birža, o Ženevoje — pirmasis Šveicarijos kvantinis tinklas.“
Jei klausia apie duomenis: 2025 m. gruodį CERN saugomų LHC duomenų kiekis peržengė vieną eksabaitą (milijoną terabaitų); juos apdoroja pasaulinis tinklas — daugiau nei 170 centrų 42 šalyse.
Faktai: dauguma duomenų įrašyta į ~60 000 magnetinių juostų; CERN skaičiavimu, tai tik apie 10 % to, ką reikės saugoti per artimiausius dešimt metų. WLCG: ~1,4 mln. procesorių branduolių, 1,5 EB saugyklos, >2 mln. užduočių per dieną. Lietuva 2005 m. prisidėjo prie BalticGrid projekto. White Rabbit — nuo 2012 m., IEEE 1588-2019; Deutsche Börse — >500 prievadų; kvantinis tinklas — 262 km šviesolaidžių, tarp partnerių ID Quantique ir Rolex.
Jei laikas leidžia: duomenų problema davė atvirojo mokslo įrankius — Zenodo, ROOT, Geant4 (paslėpta skaidrė po pabaigos).
Vaizdas: White Rabbit jungiklis WRS-3/18 (atviroji aparatinė įranga, CERN OHL v1.2); nuotrauka iš CERN KT ataskaitos 2024 (report2024-kt.web.cern.ch/?p=1052), autorius nenurodytas.
Šaltiniai: home.cern/?p=10465; white-rabbit-collaboration-website.web.cern.ch/?p=585 (projektas nuo 2008 m.); Deutsche Börse; CERN KT naujienos (kvantinis tinklas).
(~0,7 min)
-->

---
space: { at: cold, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="cold" :relief="0.3" :at="[8.5, 2.5, -9.53]" :size="3" :yaw="30" src="figures/hero_cold.jpg" alt="Superlaidi MgB₂ elektros linija bandymų stende" focus="50% 50%">
<p class="caption invention">Superlaidžios linijos · 2014 · HL-LHC</p>
</StagePhoto>
</AfterCover>

<!-- facts: ktnews-airbus-samba, ktnews-cipea, hllhc-mgb2-line-2014 -->

<!--
Kalbėtojui. Paskutinis II dalies pavyzdys: technologija, kurią CERN šiandien kuria kartu su įmonėmis.
Sakyti: „LHC magnetai veikia tik atšaldyti beveik iki absoliutaus nulio, todėl superlaidūs kabeliai CERN yra kasdienybė. Superlaidi linija perduoda elektrą be nuostolių ir yra lengva, o vandeniliniame lėktuve ją atšaldytų pats skystas vandenilis. 2022–2024 m. su Airbus CERN išbandė 7 m ilgio tokią liniją, o dabar kuria liniją 2 megavatų varomajai sistemai.“
Faktai: SCALE (2022–2024, Airbus UpNext): lanksti REBCO linija, ±2 kA iki 63 K; SAMBA (2025–2026) — Airbus Cryoprop demonstratoriui. F4E pagrindų susitarimas 2025 09 10; bendradarbiavimas nuo 2014 m. Medicinai: GaToroid — superlaidus 12 t gantris vietoj iki 270 t.
Vaizdas: CERN superlaidi MgB₂ linija HL-LHC greitintuvui (SM18); jos technologija panaudota linijai, kurią CERN kūrė su Airbus; nuotr. Maximilien Brice / © CERN.
Šaltiniai: cerncourier.com/?p=108277 (MgB2 linijos HL-LHC, 2014 m. 20 kA); kt-report-2025.web.cern.ch (SCALE su Airbus); CERN KT naujienos (SAMBA).
(~0,6 min)
-->

---
layout: section
hideInToc: true
space: { at: [120, -2.4, 0], dist: 14, yaw: -22, pitch: 22, dim: 0.4, hum: false }   # the gold seed
places: { inventions: false }   # and Part II's photos are gone again
---

<Strands :on="false" />

<div class="sub">O kaip komercializuoti?</div>

<!--
Kalbėtojui. Dalies pertrauka (savininkas, 2026 10 12; dalis ištisai: „Prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje“). Pasaulyje — auksinė „sėkla“ ir aplink ją besisukantis mazgų ratas: žinios, išeinančios iš CERN.
Sakyti: „Daugumoje šių pavyzdžių fizikų sprendimą produktu pavertė įmonė: Siemens — PET/KT skenerį, MARS — spalvotą rentgeną, ADVACAM — lustų modulius. O su Airbus CERN dabar bando superlaidžią liniją lėktuvams. Tokia įmonė galėtų būti ir lietuviška.“
(~0,3 min)
-->

---
space: { at: kt, dist: 17, yaw: 4, pitch: 34, dim: 0.4, hum: false }
---

<div class="payoff">
<div class="big">700+<span class="unit">sutarčių</span></div>
</div>

<!-- facts: ktbest-kt2025-contracts, ktbest-socio-700contracts, ktnews-cvc-terms -->

<!--
Kalbėtojui.
Sakyti: „CERN turi žinių perdavimo grupę, kuri rūpinasi licencijomis, bendrais mokslinių tyrimų ir eksperimentinės plėtros projektais ir startuoliais. Nuo 2011 m. ji pasirašė daugiau nei 700 sutarčių, vien 2025 m. — 89; daugumos partneriai yra įmonės. CERN stebi apie šimtą su juo susijusių startuolių. Startuoliams per CERN Venture Connect programą CERN taiko paprastas sąlygas: akcijų neima, o 2 % licencinis mokestis mokamas tik tada, kai metinės pardavimo pajamos pasiekia milijoną frankų. Pasaulinė intelektinės nuosavybės organizacija šiemet šią programą aprašė savo Pasauliniame inovacijų indekse.“
Faktai: 2025 m. — 32 bendri MTEP projektai, 28 licencijos, 15 paslaugų ir konsultavimo sutarčių, 8 startuolių sutartys; 63 partneriai — įmonės. CERN Venture Connect — nuo 2023 m. spalio; 2026 m. spalį: 9 licencijai paruoštos technologijos, 21 startuolis, >50 partnerių; 2025 m. CVC startuoliai pritraukė 5,6 mln. CHF. Licencija — 10 metų, pasaulinė, neišimtinė, viena taikymo sritis.
Atsargiai: „27 su CERN susiję startuoliai pritraukė 3,2 mlrd. CHF“ — 2,4 mlrd. iš jų — vienas Novartis skolos pritraukimas; šio skaičiaus nevartoti. Paties CERN pajamos iš licencijų kuklios (2007–2024 m. vidutiniškai ~1,5 mln. CHF per metus): tikslas — poveikis, o ne honorarai.
Šaltiniai: CERN Knowledge Transfer Report 2025; Technopolis ir CSIL, CERN socioekonominė studija (2026); WIPO Global Innovation Index 2026.
(~0,8 min)
-->

---
space: { at: kt, dist: 18, yaw: 160, pitch: 14, dim: 0.45, hum: false }
---

<div class="payoff">
<div class="big">613<span class="unit">mln. CHF</span></div>
</div>

<!-- facts: ktbest-procurement-howto, lt-procurement-total, lt-lightcon, lt-company-mous -->

<!--
Kalbėtojui. Kvietimas veikti.
Sakyti: „Lietuvos įmonė gali dirbti su CERN trimis būdais. Pirma, CERN yra klientas: 2024 m. jis pirko prekių ir paslaugų už 613 mln. frankų. Dešimt su viršum Lietuvos įmonių jau tiekia CERN elektroniką, radijo dažnių įrangą, optiką, fotoniką ir mechaniką. „Light Conversion“ — vienas pavyzdys. Šiemet Lietuva jau pasiekė asocijuotajai narei nustatytas lubas. Tos lubos bendros: ir CERN darbuotojams iš Lietuvos, ir sutartims su mūsų įmonėmis; pavyzdžiui, kandidatų iš Lietuvos į darbo vietas, kuriose pradėti dirbti reikėtų 2026 m., CERN nebesvarsto. Visateisė narystė šias lubas panaikintų. Todėl registruotis verta jau dabar, kad tada jūsų įmonė jau būtų CERN tiekėjų sąraše. Antra, FCC: šių metų sausį „Ekspla“, „Ostaralab“ ir „Sargasas“ pasirašė su CERN ketinimų memorandumus dėl FCC technologijų ir tiekimo. Trečia, CERN technologijų licencijos ir bendri projektai.“
Light Conversion: 2021 m. birželį laimėjo atvirą CERN konkursą (atitiko specifikaciją, pasiūlė geresnę kainą); PHAROS pasirinktas fotokatodo lazeriu CLEAR greitintuvui (lightcon.com, 2021 06 18). Ar jis tebeveikia 2026 m., nepatvirtinta — nesakyti „dabar“. Nuo 2018 m. CERN iš Lietuvos įmonių pirko už ~2,5 mln. CHF (VU rektorius R. Petrauskas, LRT, 2026 m. birželis).
Šaltiniai: 613 mln. CHF — CERN pirkimų pristatymas, FCC Week 2025; business-with-cern.web.cern.ch; inovacijuagentura.lt.
Faktai: pirkimai nuo 50 000 CHF siunčiami ir nacionaliniams pramonės ryšių su CERN specialistams; >400 000 CHF — rinkos tyrimas ir konkursas. CERN 2026 03 01–2027 02 28 sąraše Lietuva pažymėta „Associate Member State that has reached its ceiling for 2026“ (todėl tiekimui laikoma „well balanced“); lubos — bendra darbuotojų ir sutarčių vertė, ne didesnė už metinį įnašą (1,0 mln. CHF). Šaltiniai: CERN pramonės grąžos sąrašas 2026–2027; CERN darbo skelbimai („Lithuanian … nationals cannot currently be considered for positions with a 2026 start date“). Ryšių su CERN specialistė — Aušrinė Krištopaitytė (Inovacijų agentūra). Lietuvos CERN BIC (2019) — ar dar veikia, nepatikrinta; neminėti.
(~1 min)
-->

---
space: { at: [118.5, -1.6, 0], dist: 13, yaw: -30, pitch: 14, dim: 0.45, hum: false }
---

<div class="payoff">
<div class="big">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">% apyvartos</span></div>
</div>

<!-- facts: ktnews-socioeco-suppliers -->

<!--
Kalbėtojui. Pagrindinis skaičius verslui.
Sakyti: „Nepriklausomas 2026 m. tyrimas palygino įmones, kurios 2016–2024 m. pirmą kartą gavo CERN užsakymą, su panašiomis įmonėmis, kurios jo negavo. Per penkerius metus CERN tiekėjų apyvarta išaugo 14 % labiau nei panašių įmonių, darbuotojų skaičius — 13 % daugiau, patentų — 15 % daugiau. Daugiau nei pusė tiekėjų dėl darbo su CERN pateko į naujas rinkas. Maždaug trys iš keturių žmonių, išėjusių iš CERN, dirba ne mokslo ir ne švietimo srityse.“
Jei laikas leidžia: „Visos visuomenės mastu CERN rugsėjį paskelbė, kad kiekvienas į atnaujintą LHC investuotas frankas visuomenei grąžins apie 1,8 franko, net neskaičiuojant galimų atradimų.“ (94 % iš 50 000 modeliavimų rodo teigiamą grąžą; 40 % naudos — žmonės, kuriuos CERN parengė, 38 % — pramonė ir nemokama programinė įranga.)
Faktai: nematerialusis turtas +63 %, materialusis +27 %; 54 % tiekėjų pateko į naujas rinkas, 70 % įgijo pažangių kompetencijų. WIFO (2025): CERN pirkimai kasmet sukuria ~680 mln. CHF pridėtinės vertės. Alumni: 26 % lieka švietime ar moksle, didžiausias kitas sektorius — kompiuterinė įranga, programinė įranga ir paslaugos (23 %); taigi apie trys iš keturių dirba už mokslo ir švietimo ribų, o ne „pramonėje“ (CERN socioekonominė studija, 2026, 5.4 sk., 18 pav.; CERN Alumni Network duomenys, 2025 10).
Šaltinis: kt-report-2025.web.cern.ch (CERN-socio-economic-final.pdf); home.cern (2026 06 23; 2026 09 23); M. Florio, J. Catalano, CERN Courier, 2026 09 17.
(~0,8 min)
-->

---
space: { at: [22.5, 0, -14.7], dist: 70, yaw: -120, pitch: 58, dim: 0.15, hum: false }
---

<VideoPlayer src="cern_footage_2025_014_002.mp4" muted :controls="false" />

<!-- facts: cern-fcc-study, cern-espp-2026, ktnews-fcc-donors, cern-run3-end -->

<!--
Kalbėtojui. Kitos mašinos problemos.
Vaizdas: CERN-FOOTAGE-2025-014-002 (2025 m. FCC žemėlapis, 18 s, be garso): kamera nusileidžia virš Ženevos baseino, 90,7 km FCC žiedas nusipiešia šalia LHC ir baigiasi pažymėtu vaizdu (LHC, FCC, Ženeva, Lemano ežeras, Alpės). © CERN.
Sakyti: „Šių metų birželio 27 d. LHC žiede paskutinį kartą prieš ilgąją pertrauką skriejo protonai; iki 2030 m. jis pertvarkomas, kad duotų iki dešimties kartų daugiau susidūrimų. O gegužę CERN Taryba priėmė Europos dalelių fizikos strategiją: kitu greitintuvu siūlomas 91 km žiedas — Būsimasis žiedinis greitintuvas, sutrumpintai FCC. Sprendimas jį statyti laukiamas apie 2028 m. Jam reikės naujų magnetų, šaldymo ir vakuumo sistemų. Pernai gruodį pirmą kartą CERN istorijoje privatūs rėmėjai pažadėjo naujam greitintuvui apie 860 mln. eurų.“
Faktai: FCC galimybių studija (2025 03 31): 90,7 km, vidutinis gylis ~200 m, FCC-ee kaina ~15 mlrd. CHF per ~12–15 metų. Strategija priimta 2026 05 22 Budapešte. Datos: 2026 06 27 05:52 — paskutiniai 3-iojo etapo protonai (CERN Courier); 06 29 — LHC išjungtas, prasidėjo LS3 (home.cern). Rėmėjai: Ericas ir Wendy Schmidtai, Johnas Elkannas, Breakthrough Prize fondas, Xavier'as Nielis; pažadai priklauso nuo valstybių narių sprendimo. HL-LHC fizika — nuo 2030 m. birželio iki 2041 m.
Šaltiniai: home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/; council.web.cern.ch (2026 05 22 rezoliucija); home.cern/private-donors-pledge-860-million-euros-cerns-future-circular-collider/; cerncourier.com/a/fcc-feasibility-study-complete/.
(~0,8 min)
-->

---
space: { at: kt, dist: 18, yaw: 120, pitch: 12, dim: 0, hum: false }
---

<VideoPlayer src="lhcb_week_aftermovie.mp4" :controls="false" />
<Grains :set="{ det: 0, lhcbLogo: 0, ltFlag: 0 }" />

<!-- facts: lhcb-week-vilnius, lhcb-week-vilnius-attendance-sources, cern-lithuania, lt-full-decision, lt-member-interest-cern-visit-2026-09 -->

<!--
Kalbėtojui. „Lietuvos istorija CERN“: visas LHCb savaitės Vilniuje filmas su savo muzika, vietoj keturių nuotraukų (savininkas, 2026 10 20: „show a video from the LHCb Week instead of the four photos“; „Don't worry about photos show the entire aftermovie“). Kamera atskrenda čia tiesiai nuo FCC. Filme: 0:16 VU Saulėtekio miestelis iš oro, 0:19 laboratorijos, 0:25 pilna salė atidaryme, 0:26 Prezidento sveikinimas abiejuose ekranuose, 0:28 kalbėtojas prie tribūnos, 0:30 atidarymo diskusija, 0:51 senamiestis iš oro, 0:55 priėmimas Universiteto kieme, 1:15 ugnies šou, 1:27 vakarienė, 2:03 pabaigos užsklandos. Pirmos 8 s tylesnės — per jas galima pradėti kalbėti; per filmą nekalbėti.
Sakyti (prieš filmą arba jam pasibaigus): „O dabar — apie Lietuvą ir CERN. Lietuva yra asocijuotoji CERN narė nuo 2018 m., pirmoji iš Baltijos šalių: lietuviai gali dirbti CERN, o mūsų įmonės — dalyvauti jo pirkimuose. Šių metų rugsėjį Vilniaus universitete pirmą kartą Lietuvoje vyko LHCb savaitė — viso LHCb eksperimento susitikimas, didžiausias dalelių fizikų susitikimas Lietuvos istorijoje: atvyko apie du šimtus fizikų iš viso pasaulio. Savaitę globojo Prezidentas, o rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės CERN.“
Faktai: 121-oji LHCb savaitė, 2026 09 14–18, pirmoji Lietuvoje. Dalyvių skaičiai — prognozės ir nesutampa (VU: ~200 gyvai, iš viso ~600; grupės puslapis: 300 gyvai ir 300 nuotoliu, 128 institutai iš 28 šalių); po renginio skaičiaus viešai nėra — nesakyti tiksliau nei „apie du šimtus“. LRT antraštė: „didžiausias dalelių fizikų susitikimas Lietuvos istorijoje“. Asocijuotoji narė nuo 2018 01 08 (susitarimas pasirašytas 2017 06 27 Vilniuje); įnašas 2026 m. — 1 000 000 CHF. Prezidentas G. Nausėda — savaitės globėjas, sveikino vaizdo įrašu (LRT: nuotoliu). Premjero sprendimas — 2026 08 21, oficialus laiškas CERN vadovybei paskelbtas 08 26; rugsėjo 4 d. nuolatinis atstovas Ženevoje ambasadorius R. Paulauskas lankėsi CERN dėl visateisės narystės (CERN-PHOTO-202609-233). Visateisė narystė panaikintų asocijuotajai narei taikomas lubas (darbuotojams ir sutartims). Estija visateise nare tapo 2024 m. CERN po savaitės: „The membership procedure has already started“ (Hamel de Monchenault, LRT, 2026 09 20). Atidarymo diskusija „Lithuania's AI Factory: Connecting Science, Industry and Global Research Infrastructures“: moderatorė prof. S. Mačiukaitė-Žvinienė, G. Hamel de Monchenault (CERN), T. Gershon (LHCb), prof. P. Treigys, švietimo, mokslo ir sporto viceministrė R. Valutytė, B. Girdvainis (Ekonomikos ir inovacijų ministerija); kas kur sėdi, nepatikrinta.
Vaizdas: LHCb savaitės filmas, Nebula Moments (Rimantas Unkevičius), 2:28; savininko Drive aplankas 2026-09-14_LHCb_Week_Vilnius.
Šaltiniai: lrt.lt/naujienos/mokslas-ir-it/11/3052140; indico.cern.ch/event/1696594; lhcb-vilnius.web.cern.ch; home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20); vu.lt (2026 09 08 ir 09 14); LHCb savaitės programa (Drive, LHCb_Week_Vilnius_2026_programa).
(~0,4 min)
-->

---
space: { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90.0, pitch: -29.74, dim: 0, hum: false }
---

<VideoPlayer src="lis_flag.mp4" muted :controls="false" transition="fade" />
<Grains :set="{ det: 0, lhcbLogo: 0, ltFlag: 0 }" />
<Soundtrack :level="0.3" start />

<!-- facts: lhcb-scifi, lhcb-scifi-channels, lhcb-scifi-lis, lhcb-scifi-lis-vcsel, lhcb-vilnius-scifi-lis -->

<!--
Kalbėtojui. SciFi sekiklio modulio galas su šviesos įvedimo sistema: dvi šviesos įvedimo plokštelės su lazeriniais diodais ir skaidulomis, šalia — apatinio modulio galo šaltoji dėžė (savininkas, 2026 10 20: „do the Lithuanian flag at the bottom of scifi“), ant kurios lazeris išgraviruoja Lietuvos vėliavą (savininkas, 2026 10 19). Vaizdas sukurtas Blender programa pagal SciFi brėžinį, ne nuotrauka. Klipas 10 s, be garso; paskutinis kadras lieka, kol paspaudžiama toliau, o tada virsta grūdeliais ir kamera atsitraukia į visą LHCb.
Sakyti: „LHCb sekiklyje — daugiau nei 11 000 km scintiliacinių skaidulų ir 524 288 kanalai, kurie registruoja jose kilusią šviesą. Kad visi kanalai būtų sukalibruoti, kiekvieno modulio gale įrengta šviesos įvedimo sistema: lazeriniai diodai siunčia į skaidulas trumpus šviesos impulsus. Mūsų grupės darbai LHCb kolaboracijai apima ir šį sekiklį, ir šią sistemą.“
Faktai: VCSEL lazeriai (670 nm), po du vienoje plokštelėje; kiekvienas SiPM kanalas pamato nuo vieno iki penkių fotoelektronų, pagal tai nustatomi PACIFIC lusto slenksčiai. Kiek iš viso plokštelių, nesakyti (viešai nepaskelbta). Apie Vilnių — ne daugiau, nei parašyta (grupės 2024 10 03 susitikimo darbotvarkė).
Šaltiniai: LHCb Upgrade I, JINST 19 (2024) P05065, 6.5.7 sk.; D. Berninghoff, daktaro disertacija, Heidelbergo universitetas, 2022, 4.5 sk.; indico.cern.ch/event/1461467.
(~0,4 min)
-->

---
layout: statement
class: thanks-lhcb
space:
  at: thanks
  dim: 0
  ambient: 0
  hum: false
  rate: [[0, 0.7], [2.4, 0.5]]   # LisTakeover slows it almost to a stop as the bunches cross (~18 s), then runs it on at 0.6
  cameraRate: 1
  path:   # hero/close_path.py --step 1.5: out of the module's end, the crane down to eye level (17,5 s), the drift round to side on (31 s), the slow dolly back to 28 m (48 s)
    - [0, { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]
    - [2, { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]
    - [5.5, { at: [9.6, -482, 0.8], dist: 7, yaw: -80, pitch: 4 }]
    - [7, { at: [10.138, -481.698, 0.766], dist: 9.013, yaw: -69.661, pitch: 1.657 }]
    - [8.5, { at: [10.747, -481.356, 0.726], dist: 11.293, yaw: -57.945, pitch: -0.999 }]
    - [10, { at: [11.385, -480.998, 0.686], dist: 13.681, yaw: -45.679, pitch: -3.779 }]
    - [11.5, { at: [12.008, -480.648, 0.646], dist: 16.016, yaw: -33.687, pitch: -6.498 }]
    - [13, { at: [12.575, -480.33, 0.609], dist: 18.135, yaw: -22.798, pitch: -8.966 }]
    - [14.5, { at: [13.041, -480.068, 0.579], dist: 19.88, yaw: -13.836, pitch: -10.997 }]
    - [16, { at: [13.363, -479.887, 0.559], dist: 21.088, yaw: -7.628, pitch: -12.404 }]
    - [17.5, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -5, pitch: -13 }]
    - [19, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -4.39, pitch: -13 }]
    - [20.5, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -3.697, pitch: -13 }]
    - [22, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -2.963, pitch: -13 }]
    - [23.5, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -2.229, pitch: -13 }]
    - [25, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -1.536, pitch: -13 }]
    - [26.5, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -0.926, pitch: -13 }]
    - [28, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -0.439, pitch: -13 }]
    - [29.5, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: -0.117, pitch: -13 }]
    - [31, { at: [13.5, -479.81, 0.55], dist: 21.6, yaw: 0, pitch: -13 }]
    - [32.5, { at: [13.504, -479.814, 0.545], dist: 21.864, yaw: 0, pitch: -12.89 }]
    - [34, { at: [13.516, -479.825, 0.532], dist: 22.589, yaw: 0, pitch: -12.588 }]
    - [35.5, { at: [13.533, -479.841, 0.512], dist: 23.677, yaw: 0, pitch: -12.134 }]
    - [37, { at: [13.554, -479.861, 0.487], dist: 25.029, yaw: 0, pitch: -11.571 }]
    - [38.5, { at: [13.578, -479.884, 0.459], dist: 26.546, yaw: 0, pitch: -10.939 }]
    - [40, { at: [13.603, -479.908, 0.43], dist: 28.129, yaw: 0, pitch: -10.28 }]
    - [41.5, { at: [13.628, -479.931, 0.402], dist: 29.679, yaw: 0, pitch: -9.634 }]
    - [43, { at: [13.65, -479.952, 0.376], dist: 31.096, yaw: 0, pitch: -9.043 }]
    - [44.5, { at: [13.669, -479.97, 0.354], dist: 32.283, yaw: 0, pitch: -8.549 }]
    - [46, { at: [13.683, -479.983, 0.338], dist: 33.141, yaw: 0, pitch: -8.191 }]
    - [47.5, { at: [13.69, -479.99, 0.331], dist: 33.569, yaw: 0, pitch: -8.013 }]
    - [48, { at: [13.69, -479.99, 0.33], dist: 33.6, yaw: 0, pitch: -8 }]
---

<LisTakeover><h1>Ačiū</h1></LisTakeover>
<Soundtrack :level="0.9" resync />

<!-- facts: lhcb-detector-size -->

<!--
Kalbėtojui. Klipo paskutinis kadras (vėliava ant apatinės šaltosios dėžės, SciFi apačioje) virsta grūdeliais, ir kamera atsitraukia iš modulio galo į visą LHCb detektorių, sudarytą iš grūdelių pagal tikrąją jo geometriją; vėliava lieka ženklu ten, kur stovi SciFi modulis (savininkas, 2026 10 19: „position it in a 3D LHCb CAD (maybe as pointcloud)“). Tada detektorius įsižiebia, o kamera nusileidžia ant ertmės grindų prieš detektorių, 18 m nuo pluošto, kalbėtojo akių aukštyje (1,71 m, ūgis 1,83 m): visas LHCb tikrosiomis proporcijomis užpildo ekraną nuo grindų iki viršaus, abu galai matomi. Kamerai nusileidus, kartu su muzikos kulminacija (~18 s), jame susikerta tikro LHCb susidūrimo protonų paketai (savininkas: „LHCb collision within lhcb“): laikas beveik sustoja, tada susidūrime gimusios dalelės lekia per detektorių, kiekviena jo dalis sušvinta, kai jos ją pasiekia, o grūdeliai, pro kuriuos praėjo dalelės, lieka šviesti. Kamera neskuba (savininkas, 2026 10 20: „don't need to rush to zoom out“): apie 13 s ji lėtai sukasi į vaizdą iš šono, tada lėtai traukiasi ta pačia linija iki 28 m, ir prie detektoriaus kojos stovi 1,83 m žmogus mastui (savininkas, 2026 10 20: „see the huge scale of lhcb … first person view at eye level“; „look at it side on from the middle. From where that person stands. It can be me, 183cm in height“). Traukiantis, su antra muzikos kulminacija (~42 s), virš detektoriaus greta susirenka LHCb logotipas ir Lietuvos vėliava; kamerai sustojus (~48 s) pasirodo „Ačiū“; viskas lieka per klausimus. Muzika po minutės pati nutyla.
Nuorodų ekrane nėra: licencijų reikalaujamos nuorodos — kitame puslapyje, kurio nerodyti (savininkas, 2026 10 19: „We don't need credits at the last slide“).
Sakyti: „Žiniatinklis, jutiklinis ekranas ir spalvotas rentgenas atsirado iš problemų, kurias fizikams iškėlė klausimas, iš ko sudarytas pasaulis. FCC iškels naujų problemų. Jei jūsų įmonė nori tiekti CERN, užsiregistruokite CERN tiekėjų portale ir parašykite Inovacijų agentūros specialistei, kuri rūpinasi įmonių bendradarbiavimu su CERN. Ačiū, laukiu klausimų.“
Nuorodos (pasakyti, ekrane jų nėra): lhcb-vilnius.web.cern.ch — mūsų grupė; kt.cern — CERN žinių perdavimas; business-with-cern.web.cern.ch — kaip tapti CERN tiekėju.
Laikas: skirta ~25 min ar daugiau (savininkas, 2026 10 08). Trukmė (pagal skaidrių pastabų laikus, 2026 10 20): iš viso apie 25 min; klipai — įžanginis 4:13, CERN iš oro 0:11, LHC tunelis 0:40, LHCb animacija 0:48, FCC žemėlapis 0:18, LHCb savaitės filmas 2:28 ir šviesos įvedimo sistema 0:10 (per filmą nekalbama, per kitus penkis — taip). Po šios — nuorodų puslapis (nerodyti), po jo paslėpta skaidrė (Geant4, ROOT, Zenodo ir kt.) — tik paklausus.
(~0,4 min)
-->

---
class: credits-page
space: { at: [13.69, -479.99, 0.33], dist: 33.60, yaw: 0, pitch: -8, dim: 0.7, ambient: 0, hum: false }
---

<Grains :set="{ det: 1, lhcbLogo: 1, ltFlag: 1 }" />
<Soundtrack :level="0.9" />
<div class="src credits credits-list">Planck CMB žemėlapis: ESA ir Planck kolaboracija, CC BY-NC 3.0 IGO (perprojektuotas, išlygintas, nuspalvintas)<br>
1989 m. pasiūlymas: nuotr. Sailko, CC BY 3.0<br>
Riešo vaizdas: MARS Bioimaging Ltd<br>
B. Stumpe: S. E. Bennett / CERN, CC BY 4.0<br>
NeXT serveris: P. Loïez / CERN, CC BY-SA 4.0<br>
LHCb rezultatų grafikai: © CERN LHCb kolaboracijos naudai, CC BY 4.0 (apkarpyti, perspalvinti)<br>
LHCb savaitės Vilniuje filmas: Nebula Moments (R. Unkevičius)<br>
Kosminis tinklas: NCSA Advanced Visualization Lab („Cosmic Bubble Bath“, NSF)<br>
Muzika: Scott Buckley, „Starfire“ (scottbuckley.com.au), CC BY 4.0</div>

<!--
Kalbėtojui. Šio puslapio nerodyti: po „Ačiū“ nebespausti. Jis — licencijų reikalaujamoms nuorodoms (savininkas, 2026 10 19: „We don't need credits at the last slide“; pasirinkta „B“ — paveikslai lieka, nuorodos kitame puslapyje); lieka žiniatinklio versijoje ir PDF. Planck žemėlapiui (CC BY-NC 3.0 IGO) ir Sailko nuotraukai (CC BY 3.0) jų reikia; CERN medžiagai — ne.
(~0 min)
-->

---
hide: true
space: { at: web, dist: 21, yaw: 95, pitch: 40, dim: 0.5, hum: false }
---

<!--
Kalbėtojui. Atsarginė skaidrė, tik paklausus. Greitai, po vieną sakinį.
Indico: renginių valdymo sistema (CERN, nuo 2004 m.): ~400 000 naudotojų, 300 serverių 52 šalyse, naudoja ir JT.
Geant4: dalelių sąveikos su medžiaga modeliavimas; pirmoji versija 1998 12 15; >16 000 citavimų; padėjo suprasti, kodėl NASA Chandra teleskopas prarado jautrumą (1999).
ROOT: LHC duomenų analizės sistema, pradėta kurti 1995 m. sausį (R. Brun, F. Rademakers); HighLO projektas — manipuliacijų biržose paieška; jį naudojo Deutsche Börse.
Zenodo: nemokama mokslo duomenų saugykla (2013, su OpenAIRE): 7 432 875 vieši įrašai (2026 10 07), >300 000 tyrėjų.
Proton Mail: šifruotą el. paštą 2014 m. Ženevoje sukūrė CERN susipažinę mokslininkai (Andy Yen ir kt.); beta versiją išbandė >300 žmonių iš CERN.
Saulės kolektoriai: LHC vakuumo NEG dangos (C. Benvenuti) → SRB Energy; 2012 m. ~300 kolektorių (1 200 m²) Ženevos oro uosto stogui.
CERN OHL: atvirosios aparatinės įrangos licencija (2011; v2 — 2020); 2026 05 07 CERN atvėrė 17 000 KiCad komponentų biblioteką.
HEV: 2020 m. kovą LHCb VELO grupė (J. Buytaert), remdamasi detektorių dujų sistemų patirtimi, per savaitę sukūrė veikiantį plaučių ventiliatoriaus demonstratorių.
Šaltiniai: home.cern; kt.cern; KT Report 2025; zenodo.org (2026 10 07); arXiv:2405.12159; arXiv:2004.00534.
(~1 min, tik paklausus)
-->
