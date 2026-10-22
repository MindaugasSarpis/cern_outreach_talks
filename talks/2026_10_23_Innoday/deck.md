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
  motion: floor   # a venue PC's reduced-motion setting is the venue's, not the audience's choice (v0.8.2; Scheduler, 21 Oct)
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
space: { at: wide, dim: 0, ambient: 0.35, hum: false }   # wide: the hero station's look, square to the CMS beam; little dust behind the burst
---

<CoverCollision />

# Innoday 2026

# Nuo Vilniaus iki visatos pakraščių

## ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nc">LHCb</span> Vilnius · Vilniaus universitetas</div>

<!-- facts: cms-195099-137440354-record-300, cms-195099-8tev, cms-195099-m4l-127-gev, cms-195099-290-drawn-tracks, cms-195099-523-tracks -->

<!--
Kalbėtojui. Pavadinimo skaidrė (savininkas, 2026 10 12). Pirmas paspaudimas pereina prie įžanginio klipo ir kartu leidžia skambėti garsui (naršyklė garsą įjungia tik po naudotojo veiksmo). Rodant per /presenter, prieš pradedant vieną kartą spustelėti auditorijos langą. Už pavadinimo per visą ekraną lėtai ir be garso kartojasi vienas tikras CMS susidūrimas (savininkas, 2026 10 21), kol renkasi žmonės: du protonų paketai susitinka, pėdsakai išsiskleidžia į visas puses iki kalorimetrų, vaizdas kelias sekundes pastovi, užgęsta, ir viskas prasideda iš naujo (vienas ratas ~23 s). Tas pats įvykis 9 skaidrėje rodomas su garsu ir skaičiais. Kol ši skaidrė rodoma, grotuvas iš anksto įkelia įžanginį klipą.
Sakyti: „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei, kuri dirba CERN LHCb eksperimente. Už manęs — vienas tikras protonų susidūrimas, kurį 2012 m. užfiksavo CMS eksperimentas. Pradėsime nuo Saulėtekio.“
Faktai: įvykis — CERN atvirųjų duomenų įrašas 300 (CMS 2012, 8 TeV, CC0), paleidimas 195099, įvykis 137440354, 2012 m. gegužės 27 d.; Higso bozono kandidatas (du elektronai ir du miuonai, 127 GeV); nupiešta 290 iš 523 pėdsakų.
Šaltiniai: opendata.cern.ch (įrašas 300); components/lhc-opening/README.md.
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
Spausti nereikia: klipui pasibaigus (po 4:13, kai pasirodo kosminis tinklas ir muzika nutyla), skaidrės pačios pereina į kitą (savininkas, 2026 10 21: „Slide 2-3 auto move on“), kuri prasideda nuo to paties kadro ir paverčia jį pasaulio grūdeliais. Paspaudus klipo metu, pereinama anksčiau, bet perėjimas nebebus sklandus. Savaime pereinama tik auditorijos lange, ne /presenter.
(klipas 4:13, su savo muzika; ~4,2 min)
-->

---
space:
  dim: 0
  sway: 0
  hum: false
  cameraRate: [[0, 0], [4, 0], [6, 1]]   # the camera stands still for the dissolve (WebTakeover restarts this when it places the grains), then eases into the path
  path:   # owner, 21 Oct: "rotate, fly through this point cloud universe"; the frame's knot stands at [30.6, 40.8, -86]
    - [0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]          # the opener's own pose: the frame is the picture
    - [8, { at: [30.6, 40.8, -86], dist: 40, yaw: 30, pitch: 10 }]    # a slow turn round the knot: the strands stand in depth
    - [15, { at: [30.6, 40.8, -86], dist: 30, yaw: 70, pitch: 4 }]    # side on to the frame's web
    - [22, { at: [10, 36, -112], dist: 34.5, yaw: 60.5, pitch: 2.5 }] # in past the knot
    - [29, { at: [-10, 38, -128], dist: 25.2, yaw: 61.4, pitch: -6.8 }] # through the web behind it
    - [36, { at: [30.6, 40.8, -86], dist: 34.2, yaw: -107.1, pitch: 5.4 }] # turned back to the knot from the far side
    - [46, { at: [30.6, 40.8, -86], dist: 54.9, yaw: -9, pitch: 5.4 }]   # out in front: the whole web, looking down the funnel's axis again
    - [72, { at: [30.6, 40.8, -86], dist: 50.3, yaw: -5.2, pitch: 4.2 }] # a slow drift until the press
---

<WebTakeover />

<!-- facts: cosmic-web-simulation-filaments-voids -->

<!--
Kalbėtojui. Skaidrė atsiveria pati, kai baigiasi klipas, ir prasideda nuo paskutinio jo kadro, todėl perėjimo nesimato. Po pusės sekundės tamsa tolygiai pereina į pasaulio foną, o šviesios vietos subyra į grūdelius (iki ~4 s). Kiekvienas grūdelis stovi savo pikselio regėjimo linijoje, todėl iš čia jie sudaro tą patį vaizdą; gylis parinktas taip, kad gijos, išeinančios iš ryškaus mazgo vidury, ir erdvėje liktų gijomis — vienos artyn, kitos tolyn.
Tada kamera skrenda pati (savininkas, 2026 10 21): ~6–14 s lėtai apsuka aplink mazgą, gijos atsiskiria gyliu, o aplink iš tamsos išnyra visas kosminis tinklas tomis pačiomis spalvomis — gijos, spiečiai, tuštumos tarp jų ir oranžinės dujų sankaupos; ~21 s tinklas matomas iš šono; ~28 s kamera praskrenda pro mazgą; ~35 s skrenda per tinklą už jo; ~42 s atsigręžia į mazgą iš kitos pusės; ~52 s atsitraukia priešais visą tinklą ir iki ~78 s dar labai lėtai slenka, tada stovi. Tinklas aplink kadrą sugeneruotas: jis rodo kosminio tinklo pavidalą, ne tikrą dangaus žemėlapį.
Spausti →, kai būsite pasiruošę (galima ir skrydžio viduryje): kitoje skaidrėje kadro grūdeliai susibėga į piltuvą ir nusidažo jo erų spalvomis, o aplinkinis tinklas užgęsta.
Sakyti (kol byra): „Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų. Kiekvienas šio vaizdo taškas dabar atsiskiria ir pakimba erdvėje.“
Sakyti (kol skrendame): „Didžiausiu mastu medžiaga išsidėsčiusi gijomis, o tarp jų — beveik tuščios erdvės. Gijos susieina į mazgus, kur galaktikų tankiausia. Toks yra Visatos audinys.“
Techniškai: kadras — public/figures/opener_last.jpg, išsitrauktas komanda pnpm takeover:frame public/videos/nftmc_zoom_web.mp4 (paskutinis klipo kadras — kosminis tinklas). Kameros kelias — šios skaidrės space.path; grūdeliai ir tinklas aplink — setup/takeover.js (placeWeb, buildCosmos).
(~1 min)
-->

---
space: { at: [30, 39, -119], dist: 25, yaw: -72, pitch: 13, dim: 0, flight: 3.5 }   # the bell on its side, narrow end left, from three-quarters on the mouth side (the NASA/WMAP figure)
---

<ShortHum />

<AfterFlight :delay="6.8">
<div class="world-caption narrow small scrim">

# 13,8 mlrd. metų

</div>
</AfterFlight>

<!-- facts: universe-age-planck-2018, cmb-formed-380000-years-esa, cosmic-web-simulation-filaments-voids -->

<!--
Kalbėtojui. Parodyti: ryškus taškas kairėje nuo disko — Didysis sprogimas. Kosminio tinklo grūdeliai susibėga į piltuvą (savininkas, 2026 10 13): pirmiausia vaizdo vidurys tampa Didžiuoju sprogimu ir foninės spinduliuotės skydu, tada grūdeliai išsidėsto piltuvu iki plačiojo galo; tada piltuvas išryškėja savo erų spalvomis, o paskiausiai atsiranda jo žiedai ir linijos. Grindų tinklelio po piltuvu nebėra: piltuvas kabo tamsoje (savininkas, 2026 10 21). Kamera tuo metu apsuka ir parodo piltuvą iš šono: Visatos istorija iš grūdelių, nuo Didžiojo sprogimo (siauroji dalis, kairėje) iki šiandienos (platusis galas, arčiau mūsų). Kiekviena era atpažįstama iš savo spalvos — iš to, kas ją užpildo, ir kokia to temperatūra (savininkas, 2026 10 21). Iš kairės į dešinę: (1) Didysis sprogimas — mažas, ryškus baltas taškas kairėje, šiek tiek prieš piltuvo kaklelį (savininkas, 2026 10 21: ne didelis neryškus švytėjimas). (2) Kaklelis — karšta plazma, švyti nuo baltos iki oranžinės, kol atvėsta. (3) Foninė spinduliuotė — Planck žemėlapio skydas su oranžiškai baltu žiedu: šviesa, kuri išsilaisvino Visatai atvėsus iki maždaug 3000 K. (4) Tamsieji amžiai — ta šviesa ant piltuvo sienelės blėsta iš oranžinės į tamsiai raudoną ir užgęsta; viduje tik keli blankūs dujų grūdeliai, žvaigždžių nėra. (5) Kosminė aušra — pirmosios žvaigždės, melsvai baltos kibirkštys, kiekviena žydrame dujų burbule, kurį ji įšvietė; toliau burbulai didėja ir susilieja. (6) Galaktikos — ryškiausia juosta: baltai gelsvos galaktikos, daug spiralinių, tarp jų švytinčios dujos, tankiausios piltuvo viduryje. (7) Šiandiena — platusis galas: retesnės, senesnės, rausvesnės galaktikos išsirikiavusios violetinėmis gijomis, tarp jų tuštumos — tas pats kosminis tinklas, kuriuo baigėsi įžanginis klipas; galas platėja vis greičiau (spartėjantis plėtimasis). Kiekvienas žiedas nusidažęs savo eros spalva. Žemas ūžesys skamba tik šios ir kitos skaidrės pradžioje, apie 3 s (savininkas, 2026 10 14). Skaičius pasirodo, kai piltuvas išryškėja (~7 s). Kitoje skaidrėje kamera įskrenda į piltuvą.
Sakyti: „Šis piltuvas yra Visatos istorija: siaurasis galas — Didysis sprogimas prieš 13,8 mlrd. metų, platusis — šiandien. Iš kairės: karšta plazma, seniausia šviesa, tamsieji amžiai be žvaigždžių, pirmosios žvaigždės, galaktikos ir šiandienos galaktikų tinklas. Visata plečiasi, o maždaug pastaruosius šešis milijardus metų — vis greičiau.“
Faktai: Visatos amžius 13,787 ± 0,020 mlrd. m. (Planck 2018, A&A 641, A6); spartėjantis plėtimasis — 1998 m. atradimas (2011 m. Nobelio premija); plėtimasis spartėja maždaug pastaruosius 6 mlrd. metų (z ≈ 0,6), tamsioji energija vyrauja maždaug pastaruosius 3,5 mlrd. metų (z ≈ 0,3) (Planck 2018, ΛCDM).
Šaltiniai: Planck 2018 results VI (A&A 641, A6).
(~0,5 min)
-->

---
space: { at: [30, 40, -136], dist: 9.5, yaw: 0, pitch: 0, dim: 0.1, flight: 5 }   # in at the mouth and back down the funnel, past the galaxies, the first stars and the dark ages, to the CMB disk
---

<ShortHum />

<AfterFlight :delay="4.6">
<div class="world-caption narrow scrim">

# 380 000 metų

</div>
</AfterFlight>

<!-- facts: cmb-formed-380000-years-esa -->

<!--
Kalbėtojui. Kamera skrenda piltuvu atgal laiku: pro šiandienos galaktikų gijas, pro galaktikas, pro pirmųjų žvaigždžių žydrus burbulus, pro tamsiuosius amžius, kur sienelės šviesa vis raudonesnė ir blankesnė, ir sustoja prie švytinčio skydo — kosminės foninės spinduliuotės, apjuostos jos pačios oranžiškai baltos šviesos žiedu. Skydas — tikras Planck temperatūros žemėlapis, nupieštas toje pačioje plokštumoje. Skaičius pasirodo kairėje apačioje (~4,6 s po skrydžio), ant tamsaus pagrindo, kad nesilietų su žemėlapiu.
Sakyti: „Pro galaktikas, pro pirmąsias žvaigždes ir tamsiuosius amžius grįžtame iki seniausios šviesos, kurią įmanoma pamatyti. Tai kosminė foninė spinduliuotė: Visatai tada buvo apie 380 000 metų. Europos kosmoso agentūros palydovas Planck ją išmatavo visame danguje. Spalvos rodo temperatūros skirtumus, vos dešimttūkstantąsias kelvino dalis. Iš tokių nelygumų vėliau susiformavo galaktikos.“
Faktai: foninės spinduliuotės temperatūra 2,725 K; skirtumai žemėlapyje ~±100–300 µK (iki ~1 mK). Paskutinė sklaida — ~380 000 m. po Didžiojo sprogimo (z ≈ 1090).
Šaltiniai (ir vaizdas): Planck 2018 SMICA-noSZ žemėlapis (COM_CMB_IQU-smica-nosz_2048_R3.00_full, I_STOKES_INP — užpildytas ties Galaktikos plokštuma, apie 4 % skydo ploto), IRSA/ESA Planck Legacy Archive; ESA ir Planck kolaboracija; Planck 2018 results IV (A&A 641, A4). Skyde — šiaurinis Galaktikos pusrutulis (lygiaplotė projekcija, centre šiaurinis Galaktikos polius), išlyginta iki 1° (WMAP raiška), nuspalvinta WMAP stiliaus skale. Licencija CC BY-NC 3.0 IGO (nekomercinis naudojimas su nuoroda).
(~0,6 min)
-->

---
space: { at: [28.6, 40, -135.5], dist: 11, yaw: 26, pitch: 8, dim: 0.3, hum: false }   # turned from the CMB disk, still in the dark ages (nothing hot near the camera): the disk to the right, the dark ages' fading wall to the left; the question stands over the oldest light
---

<!--
Kalbėtojui. Kamera pasisuka nuo foninės spinduliuotės skydo, likdama tamsiuosiuose amžiuose: dešinėje seniausia šviesa, kairėje piltuvo sienelė, kurios raudona šviesa blėsta į tamsą. Klausimas „Iš ko visa tai sudaryta?“ — visos kalbos pradžia: kitos skaidrės rodo greitintuvą, kurį teko pastatyti, kad į jį atsakytume, ir ką davė jos problemos.
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

<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" :volume="0.05" exit="push" exit-at="0.45,0.53" />

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
Kalbėtojui. Kelionė LHC tuneliu (CERN-FOOTAGE-2022-013-001, 3:00–3:39,5), skaičiai virš jos. Klipas trunka 0:40, kalba — apie 0,9 min: klipui pasibaigus, ekrane lieka paskutinis jo kadras su skaičiais. Pabaigus kalbėti, paspausti → (pultelio „pirmyn“): tada kamera įlekia į tolį, kur dingsta magnetų eilė, ir prasideda susidūrimas. Pačios skaidrės toliau nepereina. Šie skaičiai — II dalies problemos.
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
Sakyti: „Tą patį susidūrimą matėte už manęs pačioje pradžioje. Taip jis atrodo iš arti. Tokių kas sekundę — pusantro milijardo.“
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
space: { at: [56.7, -80, 20], dist: 13, yaw: 0, pitch: 0, sway: 0, dim: 0, hum: false }   # the globe of institutes (station collab) right of the middle, the numbers on the dark left
---

<CollabGlobe src="figures/lhcb_collaboration.jpg">
<div class="globe-stats">
<div class="gs"><span class="n"><Count :to="4" :ms="1200" :delay="0" /></span><span class="u">TB/s</span></div>
<div class="gs"><span class="n">~<Count :to="1900" :ms="1800" :delay="150" /></span><span class="u">narių</span></div>
<div class="gs"><span class="n"><Count :to="112" :ms="1800" :delay="300" /></span><span class="u">institutų</span></div>
<div class="gs"><span class="n"><Count :to="28" :ms="1600" :delay="450" /></span><span class="u">šalys</span></div>
</div>
</CollabGlobe>

<!-- facts: lhcb-upgrade1-trigger, lhcb-allen-gpu, lhcb-collaboration-sep-2026, lhcb-readout-32tbps-spc-2026, lhcb-greybook-teams-2026-10-21 -->

<!--
Kalbėtojui. Pirmiausia visu ekranu kolaboracijos nuotrauka (CERN-PHOTO-202206-112-6, 2022 m. birželio 17 d. kolaboracijos savaitė, LHCb urve), apie 2 s. Tada ji subyra į šviesos grūdelius, kaip įžangos paskutinis kadras, ir per kelias sekundes jie suskrenda į lėtai besisukantį Žemės gaublį: pakrantės — blyškūs grūdeliai, LHCb institutų miestai — ryškūs taškai, Vilniaus taškas šiek tiek ryškesnis (be užrašų). Gaublys sukasi kaip Žemė: Europa slenka į dešinę, iš kairės ateina Amerika. Kairėje, tamsoje, suskaičiuoja skaičiai. Ekrane: 4 TB/s, ~1 900 narių, 112 institutų, 28 šalys (LHCb ataskaita CERN Mokslo politikos komitetui, 2026 09 22: 1 891 narys).
Sakyti (pirmiausia): „Mus — beveik du tūkstančiai žmonių iš 112 institutų 28 šalyse.“
Sakyti: „Šiandien mūsų eksperimento problema yra duomenų kiekis. LHCb detektorius kas sekundę pagamina apie 4 terabaitus. Tiek užrašyti neįmanoma, todėl reikia iš karto nuspręsti, ką pasilikti. Nuo 2022 m. tai daro vaizdo plokštės su tais pačiais lustais kaip žaidimų kompiuteriuose. LHCb — pirmasis eksperimentas, kurio visa pirmoji atrankos pakopa veikia vaizdo plokštėse. Į diską patenka maždaug vienas baitas iš keturių šimtų.“
Faktai: GPU — NVIDIA RTX A5000 (profesionali žaidimų lusto versija); vietų ~500, bazinei HLT1 reikia ~200; antroji pakopa — >3 000 serverių; į diską ~10 GB/s.
Šaltiniai: LHCb, JINST 19 (2024) P05065; CERN EP Newsletter (2020); T. Gershon, LHCb ataskaita CERN SPC, 2026 09 22 (32 Tb/s = 4 TB/s; tai apie 3 % pasaulio tarptautinio interneto pralaidumo, 997 Tb/s 2022 m., TeleGeography).
Gaublys: pakrantės ir sausuma — Natural Earth 1:50 mln. ir 1:110 mln. (viešasis domenas). Institutai — CERN Greybook LHCb komandų sąrašas (greybook.cern.ch, 2026 10 21): 111 institutų 92 miestuose 28 šalyse (CERN — Šveicarijoje); kiekvienas taškas — instituto miestas (Natural Earth 1:10 mln. gyvenvietės; 15 mažesnių miestelių — OpenStreetMap). LHCb skaičiuoja 112 institutų, Greybook sąraše jų 111 (vieno nėra); ekrane — LHCb skaičius.
Vaizdas: CERN-PHOTO-202206-112-6, nuotr. Piotr Traczyk / CERN (CERN sąlygos).
Jei klausia apie atviruosius duomenis: visus 2011–2012 m. LHCb duomenis (800 TB) viešam naudojimui parengiau. Nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, o nuo 2026 m. kovo per internetinę paslaugą galima gauti ir antrojo etapo duomenis, iš viso daugiau nei 4 PB.
(~0,7 min)
-->

---
space: { at: [60, -30, 50], dist: 26, yaw: 0, pitch: 11, sway: 1.5, dim: 0, hum: false }   # the sun of results (results station, setup/sun.js): the pose its layout was searched for; pitch 11 keeps the cosmos station's galaxy above the frame
---

<div class="readout right">

<div class="big"><Count :from="0" :to="878" :ms="2200" /><span class="unit">straipsniai</span></div>

</div>

<!-- facts: lhcb-papers-2026-10-22, lhcb-figure-2026-010-hadrons -->

<!--
Kalbėtojui. LHCb rezultatai kaip saulė (savininkas, 2026 10 21: kaip OpenData kalboje): kamerai atskridus, viduryje susitelkia šviesus grūdelių branduolys — LHCb darbas, — ir iš jo į visas puses vienas po kito išbėga grūdelių spinduliai. Kiekvienas baigiasi rezultato grafiku iš paskelbto straipsnio; grūdeliai nusileidžia ant grafiko linijų ir trumpai sužiba. Visa saulė lėtai sukasi (vienas apsisukimas per 2,5 min): grafikai skrieja aplink branduolį, visada stati ir atsukti į salę, viršuje arčiau ir didesni, apačioje toliau, mažesni ir blankesni; kas priartėja prie skaičiaus, prigęsta. Grafikai (CC BY 4.0, apkarpyti, perspalvinti): pentakvarkai Pc(4312), Pc(4440), Pc(4457) (PRL 122, 2019), CP pažeidimas barionuose (Nature 643, 2025; rodoma tik Λb⁰ pusė: antibarionų pusė atrodė kaip pakartota, todėl nukirpta (savininkas, 2026 10 13); smailės aukštis nėra tas 2,45 % skirtumas — taip nesakyti), Bs⁰ osciliacijos (Nature Physics 18, 2022), Tcc⁺ tetrakvarkas (Nature Physics 18, 2022), Ωcc⁺ (arXiv:2609.21921, 2026), Bs⁰→μ⁺μ⁻ (PRL 118, 2017), R(K) ir R(K*) ant Standartinio modelio linijos (PRD 108, 2023) ir LHCb-FIGURE-2026-010: 76 LHCb atrasti hadronai.
Sakyti: „Ką mes randame? Iki šiol LHCb paskelbė 878 mokslinius straipsnius. Tarp jų — penkių kvarkų dalelės, pentakvarkai, kuriuos atradome 2015 m., ir pernai pirmą kartą pamatytas materijos ir antimaterijos skirtumas barionuose. Iš viso LHCb atrado 76 naujas daleles — daugiau nei bet kuris kitas eksperimentas.“
Skaičių prieš kalbą patikrinti (2026 10 22) LHCb viešųjų rezultatų sąraše ir pataisyti, jei pasikeitė.
Šaltiniai: LHCb viešieji rezultatai (lhcbproject.web.cern.ch/Publications, LHCb Glance), INSPIRE (878, 2026 10 22; 2026 10 12 buvo 875: 860 su žurnalo nuoroda ir 15 recenzuojami); grafikai — LHCb kolaboracija, CC BY 4.0, apkarpyti ir perspalvinti (šviesūs ant juodo, kaip OpenData kalboje).
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
Kalbėtojui. Dalies pertrauka (savininkas, 2026 10 12). Pasaulyje — greitintuvo žiedas ir iš jo išeinančios gijos. Šešios tekančių grūdelių gijos veda nuo greitintuvo dalių prie to, kas iš jų atsirado; jų galuose jau stovi šios dalies nuotraukos (pirmoji — jutiklinis ekranas), apie kurias kalbėsite; kiekviena šios dalies skaidrė prasideda problema ir baigiasi tuo, kas iš jos išėjo į pasaulį. Tvarka: kas yra jūsų kišenėje, kas padeda gydytojams ir astronautams, kas vyksta pramonėje šiandien.
Sakyti: „Šešios problemos: kaip valdyti greitintuvą, kaip tvarkyti informaciją, kaip pamatyti dalelę, kaip nukreipti pluoštą, kaip suderinti laikrodžius ir kaip atšaldyti. Iš kiekvienos atsirado kas nors, kas šiandien naudojama už CERN ribų. Pradėsiu nuo jutiklinio ekrano, kurį turite savo telefone.“
(Jutiklinio ekrano nevadinti CERN išradimu: CERN buvo vienas pirmųjų, ne pirmasis.)
(~0,4 min)
-->

---
space: { at: stumpe, dim: 0, flight: 1.6, hum: false }   # place mode: the photo stands at its strand's product
---

<Strands />

<AfterCover>
<StagePhoto mode="place" group="inventions" :grains="360" place-id="stumpe" :relief="0.25" :at="[19.5, 2.5, -9.53]" :size="3" :yaw="-30" src="figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" focus="50% 30%" class="dim">
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

<StagePhoto src="figures/hero_proposal.jpg" arrive="camera" :dust-ms="[800, 600]" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" focus="50% 0%" class="dim page">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="next" :relief="0.25" :at="[27.0, 2.5, 4.5]" :size="3" :yaw="-90" src="figures/hero_next.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" focus="35% 55%" class="dim">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="pet" :relief="0.3" :at="[19.5, 2.5, 9.53]" :size="3" :yaw="-150" src="figures/hero_pet.jpg" alt="Šiuolaikinis PET/KT skeneris ligoninės kabinete" focus="60% 50%" class="dim">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="artemis" :relief="0.3" :at="[24.4, 2.5, 9.01]" :size="3" :yaw="-150" src="figures/hero_artemis.jpg" alt="NASA Artemis II raketa SLS kyla iš paleidimo aikštelės" focus="50% 40%" class="dim">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="hadron" :relief="0.3" :at="[8.5, 2.5, 9.53]" :size="3" :yaw="150" src="figures/hero_hadron.jpg" alt="Hadronų terapijos centro sinchrotronas" focus="50% 50%" class="dim">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="whiterabbit" :relief="0.3" :at="[3.0, 2.5, 0.0]" :size="3" :yaw="90" src="figures/white_rabbit.jpg" alt="White Rabbit jungiklis WRS-3/18 su šviesolaidžiais" focus="50% 50%" class="dim darker">
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
<StagePhoto mode="place" group="inventions" :grains="360" place-id="cold" :relief="0.3" :at="[8.5, 2.5, -9.53]" :size="3" :yaw="30" src="figures/hero_cold.jpg" alt="Superlaidi MgB₂ elektros linija bandymų stende" focus="50% 50%" class="dim">
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
space: { at: [119, 0, 3], dist: 20, yaw: 15, pitch: 70, sway: 1.5, dim: 0.15, hum: false }   # Europe in grains, CERN lit (setup/europe.js), above the title
places: { inventions: false }   # and Part II's photos are gone again
---

<Strands :on="false" />
<Grains :set="{ eu: 1 }" />

<div class="sub">O kaip komercializuoti?</div>

<!--
Kalbėtojui. Dalies pertrauka (savininkas, 2026 10 12; dalis ištisai: „Prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje“). Pasaulyje — Europos žemėlapis iš grūdelių (krantai ir sienos), jis susidėlioja nuo Ženevos; ten šviečia CERN.
Sakyti: „Daugumoje šių pavyzdžių fizikų sprendimą produktu pavertė įmonė: Siemens — PET/KT skenerį, MARS — spalvotą rentgeną, ADVACAM — lustų modulius. O su Airbus CERN dabar bando superlaidžią liniją lėktuvams. Tokia įmonė galėtų būti ir lietuviška.“
(~0,3 min)
-->

---
space: { at: [108, 0, -1], dist: 26, yaw: 15, pitch: 75, sway: 1.5, dim: 0.15, hum: false }   # the map lower right, the number over the Atlantic
---

<div class="payoff">
<div class="big">700+<span class="unit">sutarčių</span></div>
</div>
<Grains :set="{ eu: 2 }" />

<!-- facts: ktbest-kt2025-contracts, ktbest-socio-700contracts, ktnews-cvc-terms, cern-members-2026 -->

<!--
Kalbėtojui. Pasaulyje iš CERN į Europą pradeda tekėti grūdelių gijos — po vieną į kiekvieną iš 25 valstybių narių (artimiausios pirmos): žinios ir sutartys, išeinančios į įmones. Gijos — tėkmės vaizdas; jų galai šalyse parinkti atsitiktinai, sutarčių pasiskirstymo jie nerodo.
Sakyti: „CERN turi žinių perdavimo grupę, kuri rūpinasi licencijomis, bendrais mokslinių tyrimų ir eksperimentinės plėtros projektais ir startuoliais. Nuo 2011 m. ji pasirašė daugiau nei 700 sutarčių, vien 2025 m. — 89; daugumos partneriai yra įmonės. CERN stebi apie šimtą su juo susijusių startuolių. Startuoliams per CERN Venture Connect programą CERN taiko paprastas sąlygas: akcijų neima, o 2 % licencinis mokestis mokamas tik tada, kai metinės pardavimo pajamos pasiekia milijoną frankų. Pasaulinė intelektinės nuosavybės organizacija šiemet šią programą aprašė savo Pasauliniame inovacijų indekse.“
Faktai: 2025 m. — 32 bendri MTEP projektai, 28 licencijos, 15 paslaugų ir konsultavimo sutarčių, 8 startuolių sutartys; 63 partneriai — įmonės. CERN Venture Connect — nuo 2023 m. spalio; 2026 m. spalį: 9 licencijai paruoštos technologijos, 21 startuolis, >50 partnerių; 2025 m. CVC startuoliai pritraukė 5,6 mln. CHF. Licencija — 10 metų, pasaulinė, neišimtinė, viena taikymo sritis.
Atsargiai: „27 su CERN susiję startuoliai pritraukė 3,2 mlrd. CHF“ — 2,4 mlrd. iš jų — vienas Novartis skolos pritraukimas; šio skaičiaus nevartoti. Paties CERN pajamos iš licencijų kuklios (2007–2024 m. vidutiniškai ~1,5 mln. CHF per metus): tikslas — poveikis, o ne honorarai.
Šaltiniai: CERN Knowledge Transfer Report 2025; Technopolis ir CSIL, CERN socioekonominė studija (2026); WIPO Global Innovation Index 2026.
(~0,8 min)
-->

---
space: { at: [111.5, 0, -1.5], dist: 22, yaw: 15, pitch: 75, sway: 1.5, dim: 0.15, hum: false }   # closer: Lithuania in view as it lights
---

<div class="payoff">
<div class="big">613<span class="unit">mln. CHF</span></div>
</div>
<Grains :set="{ eu: 3 }" />

<!-- facts: ktbest-procurement-howto, lt-procurement-total, lt-lightcon, lt-company-mous, cern-members-2026, lt-econ-impact -->

<!--
Kalbėtojui. Kvietimas veikti. Pasaulyje gijų iš CERN padaugėja — jos nubėga į visas valstybes nares ir asocijuotąsias nares žemėlapyje: CERN perka visoje Europoje (1999–2024 m. 94 % sutarčių vertės teko valstybėms narėms). Paskutinės dvi nusileidžia Lietuvoje (Vilniuje ir Kaune), ir maždaug po 4 s, kai jau ištarėte „Lietuvos įmonė…“, Lietuva nušvinta.
Sakyti: „Lietuvos įmonė gali dirbti su CERN trimis būdais. Pirma, CERN yra klientas: 2024 m. jis pirko prekių ir paslaugų už 613 mln. frankų. Dešimt su viršum Lietuvos įmonių jau tiekia CERN elektroniką, radijo dažnių įrangą, optiką, fotoniką ir mechaniką. „Light Conversion“ — vienas pavyzdys. Šiemet Lietuva jau pasiekė asocijuotajai narei nustatytas lubas. Tos lubos bendros: ir CERN darbuotojams iš Lietuvos, ir sutartims su mūsų įmonėmis; pavyzdžiui, kandidatų iš Lietuvos į darbo vietas, kuriose pradėti dirbti reikėtų 2026 m., CERN nebesvarsto. Visateisė narystė šias lubas panaikintų. Todėl registruotis verta jau dabar, kad tada jūsų įmonė jau būtų CERN tiekėjų sąraše. Antra, FCC: šių metų sausį „Ekspla“, „Ostaralab“ ir „Sargasas“ pasirašė su CERN ketinimų memorandumus dėl FCC technologijų ir tiekimo. Trečia, CERN technologijų licencijos ir bendri projektai.“
Light Conversion: 2021 m. birželį laimėjo atvirą CERN konkursą (atitiko specifikaciją, pasiūlė geresnę kainą); PHAROS pasirinktas fotokatodo lazeriu CLEAR greitintuvui (lightcon.com, 2021 06 18). Ar jis tebeveikia 2026 m., nepatvirtinta — nesakyti „dabar“. Nuo 2018 m. CERN iš Lietuvos įmonių pirko už ~2,5 mln. CHF (VU rektorius R. Petrauskas, LRT, 2026 m. birželis).
Šaltiniai: 613 mln. CHF — CERN pirkimų pristatymas, FCC Week 2025; business-with-cern.web.cern.ch; inovacijuagentura.lt.
Faktai: pirkimai nuo 50 000 CHF siunčiami ir nacionaliniams pramonės ryšių su CERN specialistams; >400 000 CHF — rinkos tyrimas ir konkursas. CERN 2026 03 01–2027 02 28 sąraše Lietuva pažymėta „Associate Member State that has reached its ceiling for 2026“ (todėl tiekimui laikoma „well balanced“); lubos — bendra darbuotojų ir sutarčių vertė, ne didesnė už metinį įnašą (1,0 mln. CHF). Šaltiniai: CERN pramonės grąžos sąrašas 2026–2027; CERN darbo skelbimai („Lithuanian … nationals cannot currently be considered for positions with a 2026 start date“). Ryšių su CERN specialistė — Aušrinė Krištopaitytė (Inovacijų agentūra). Lietuvos CERN BIC (2019) — ar dar veikia, nepatikrinta; neminėti.
(~1 min)
-->

---
space: { at: [107, 0, 0], dist: 32, yaw: 30, pitch: 50, sway: 1.5, dim: 0.15, hum: false }   # lower: the threads' arcs over the map
---

<div class="payoff">
<div class="big">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">% apyvartos</span></div>
</div>
<Grains :set="{ eu: 4 }" />

<!-- facts: ktnews-socioeco-suppliers -->

<!--
Kalbėtojui. Pagrindinis skaičius verslui. Pasaulyje gijos sulėtėja ir ima švytėti tolygiai: penkeri metai po pirmojo CERN užsakymo.
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

<ClipEnd><div class="question">O kokį vaidmenį atliks Lietuva?</div></ClipEnd>
<Drone :level="0.22" :swell="14" />

<!-- facts: cern-fcc-study, cern-espp-2026, ktnews-fcc-donors, cern-run3-end -->

<!--
Kalbėtojui. Kitos mašinos problemos. Po klipu skamba žemas, lėtai banguojantis ūžesys (sintezuotas, savininkas, 2026 10 21: „deep cool hum sounds“); jis sustiprėja, kai pasirodo klausimas, ir užgęsta, kai pereinama prie filmo. Klipui baigiantis, ant paskutinio jo kadro pasirodo klausimas „O kokį vaidmenį atliks Lietuva?“ (savininkas, 2026 10 21); paskutinis kadras su klausimu lieka, kol paspausite →, o kita skaidrė — LHCb savaitės filmas — į jį atsako.
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
<Grains :set="{ det: 0, lhcbLogo: 0 }" />

<!-- facts: lhcb-week-vilnius, lhcb-week-vilnius-attendance-sources, cern-lithuania, lt-full-decision, lt-member-interest-cern-visit-2026-09 -->

<!--
Kalbėtojui. „Lietuvos istorija CERN“: visas LHCb savaitės Vilniuje filmas su savo muzika, vietoj keturių nuotraukų (savininkas, 2026 10 20: „show a video from the LHCb Week instead of the four photos“; „Don't worry about photos show the entire aftermovie“). Kamera atskrenda čia tiesiai nuo FCC. Filme: 0:16 VU Saulėtekio miestelis iš oro, 0:19 laboratorijos, 0:25 pilna salė atidaryme, 0:26 Prezidento sveikinimas abiejuose ekranuose, 0:28 kalbėtojas prie tribūnos, 0:30 atidarymo diskusija, 0:51 senamiestis iš oro, 0:55 priėmimas Universiteto kieme, 1:15 ugnies šou, 1:27 vakarienė, 2:03 pabaigos užsklandos. Filmas prasideda vos skaidrei atsivėrus, jo muzika visu garsu nuo 3-iosios sekundės — per filmą nekalbėti. Pasibaigęs (2:28) jis nepereina toliau: lieka tamsus paskutinis kadras, kol paspausite →.
Sakyti (dar FCC skaidrėje, prieš paspaudžiant, arba filmui pasibaigus, per jo paskutinį kadrą): „O dabar — apie Lietuvą ir CERN. Lietuva yra asocijuotoji CERN narė nuo 2018 m., pirmoji iš Baltijos šalių: lietuviai gali dirbti CERN, o mūsų įmonės — dalyvauti jo pirkimuose. Šių metų rugsėjį Vilniaus universitete pirmą kartą Lietuvoje vyko LHCb savaitė — viso LHCb eksperimento susitikimas, didžiausias dalelių fizikų susitikimas Lietuvos istorijoje: atvyko apie du šimtus fizikų iš viso pasaulio. Savaitę globojo Prezidentas, o rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės CERN.“
Faktai: 121-oji LHCb savaitė, 2026 09 14–18, pirmoji Lietuvoje. Dalyvių skaičiai — prognozės ir nesutampa (VU: ~200 gyvai, iš viso ~600; grupės puslapis: 300 gyvai ir 300 nuotoliu, 128 institutai iš 28 šalių); po renginio skaičiaus viešai nėra — nesakyti tiksliau nei „apie du šimtus“. LRT antraštė: „didžiausias dalelių fizikų susitikimas Lietuvos istorijoje“. Asocijuotoji narė nuo 2018 01 08 (susitarimas pasirašytas 2017 06 27 Vilniuje); įnašas 2026 m. — 1 000 000 CHF. Prezidentas G. Nausėda — savaitės globėjas, sveikino vaizdo įrašu (LRT: nuotoliu). Premjero sprendimas — 2026 08 21, oficialus laiškas CERN vadovybei paskelbtas 08 26; rugsėjo 4 d. nuolatinis atstovas Ženevoje ambasadorius R. Paulauskas lankėsi CERN dėl visateisės narystės (CERN-PHOTO-202609-233). Visateisė narystė panaikintų asocijuotajai narei taikomas lubas (darbuotojams ir sutartims). Estija visateise nare tapo 2024 m. CERN po savaitės: „The membership procedure has already started“ (Hamel de Monchenault, LRT, 2026 09 20). Atidarymo diskusija „Lithuania's AI Factory: Connecting Science, Industry and Global Research Infrastructures“: moderatorė prof. S. Mačiukaitė-Žvinienė, G. Hamel de Monchenault (CERN), T. Gershon (LHCb), prof. P. Treigys, švietimo, mokslo ir sporto viceministrė R. Valutytė, B. Girdvainis (Ekonomikos ir inovacijų ministerija); kas kur sėdi, nepatikrinta.
Vaizdas: LHCb savaitės filmas, Nebula Moments (Rimantas Unkevičius), 2:28; savininko Drive aplankas 2026-09-14_LHCb_Week_Vilnius.
Šaltiniai: lrt.lt/naujienos/mokslas-ir-it/11/3052140; indico.cern.ch/event/1696594; lhcb-vilnius.web.cern.ch; home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20); vu.lt (2026 09 08 ir 09 14); LHCb savaitės programa (Drive, LHCb_Week_Vilnius_2026_programa).
(~0,4 min)
-->

---
space: { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90.0, pitch: -29.74, dim: 0, hum: false }
---

<VideoPlayer src="lis_flag.mp4" muted :controls="false" transition="fade" />
<Grains :set="{ det: 0, lhcbLogo: 0 }" />
<Soundtrack :level="0.3" start />

<!-- facts: lhcb-scifi, lhcb-scifi-layout, lhcb-scifi-channels, lhcb-scifi-lis, lhcb-scifi-lis-vcsel, lhcb-vilnius-scifi-lis -->

<!--
Kalbėtojui. Visas SciFi sekiklio modulis, stovintis kaip LHCb: beveik 5 m ilgio ir apie 52 cm pločio scintiliacinių skaidulų kilimėlių lakštas (savininkas, 2026 10 21: „show the full SciFi module panning slowly (a long scifi sheet) and then on the bottom I indicate the light injection system“). Klipas 20 s, be garso: 0–7 s kamera iš apačios rodo visą modulį ir lėtai leidžiasi juo žemyn iki apatinio galo; 7–10 s ji stovi, o apatinio galo šaltoji dėžė, kurios viduje yra šviesos įvedimo sistema (plokštelės su lazeriniais diodais; savininkas, 2026 10 21: „The light injection system is within this black coldbox, no need for blue cables“), apsibrėžia švelniai šviečiančiu šviesiai mėlynu kontūru (nuo 6,6 iki 10 s, be užrašų) — tada, ties ~7 s, ją ir įvardykite; 10–12 s kamera priartėja prie apatinio modulio galo šaltosios dėžės (savininkas, 2026 10 20: „do the Lithuanian flag at the bottom of scifi“), 12–17,5 s lazeris ant jos išgraviruoja Lietuvos vėliavą (savininkas, 2026 10 19), paskui vėliava atvėsta iki savo spalvų, kamera šiek tiek atsitraukia ir nuo 19,4 s stovi. Vaizdas sukurtas Blender programa pagal SciFi brėžinį, ne nuotrauka. Paskutinis kadras lieka, kol paspaudžiama toliau, o tada virsta grūdeliais ir kamera atsitraukia į visą LHCb.
Sakyti (per modulį, 0–7 s): „LHCb sekiklyje — daugiau nei 11 000 km scintiliacinių skaidulų ir 524 288 kanalai, kurie registruoja jose kilusią šviesą.“ Kai šaltoji dėžė nušvinta (~7 s): „Kad visi kanalai būtų sukalibruoti, kiekvieno modulio gale įrengta šviesos įvedimo sistema: lazeriniai diodai siunčia į skaidulas trumpus šviesos impulsus. Mūsų grupės darbai LHCb kolaboracijai apima ir šį sekiklį, ir šią sistemą.“
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
  path:   # hero/close_path.py: out of the module's end, the crane down to eye level in front of the person (17,5 s), the walk upstream along it (29 s), the pull-back to the whole detector (43,5 s), the pull-out to the accelerator complex (48,4 s)
    - [0, { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]
    - [2, { at: [9.54, -483.362, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]
    - [5.5, { at: [9.6, -482, 0.8], dist: 7, yaw: -80, pitch: 4 }]
    - [7, { at: [10.234, -482.05, 0.69], dist: 8.644, yaw: -63.871, pitch: 2.484 }]
    - [8.5, { at: [10.952, -482.107, 0.565], dist: 10.506, yaw: -45.595, pitch: 0.765 }]
    - [10, { at: [11.704, -482.167, 0.434], dist: 12.456, yaw: -26.459, pitch: -1.034 }]
    - [11.5, { at: [12.439, -482.225, 0.306], dist: 14.362, yaw: -7.753, pitch: -2.792 }]
    - [13, { at: [13.106, -482.278, 0.19], dist: 16.094, yaw: 9.235, pitch: -4.389 }]
    - [14.5, { at: [13.655, -482.321, 0.094], dist: 17.518, yaw: 23.215, pitch: -5.704 }]
    - [16, { at: [14.036, -482.351, 0.028], dist: 18.505, yaw: 32.9, pitch: -6.614 }]
    - [17.5, { at: [14.197, -482.364, 0], dist: 18.923, yaw: 36.999, pitch: -7 }]
    - [19, { at: [14.084, -482.294, 0], dist: 18.978, yaw: 35.852, pitch: -7.184 }]
    - [20.5, { at: [13.862, -482.156, 0], dist: 19.085, yaw: 33.602, pitch: -7.546 }]
    - [22, { at: [13.561, -481.969, 0], dist: 19.231, yaw: 30.554, pitch: -8.037 }]
    - [23.5, { at: [13.211, -481.752, 0], dist: 19.4, yaw: 27.013, pitch: -8.607 }]
    - [25, { at: [12.843, -481.523, 0], dist: 19.578, yaw: 23.284, pitch: -9.207 }]
    - [26.5, { at: [12.487, -481.302, 0], dist: 19.751, yaw: 19.672, pitch: -9.788 }]
    - [28, { at: [12.172, -481.107, 0], dist: 19.904, yaw: 16.484, pitch: -10.301 }]
    - [29.5, { at: [11.994, -480.954, 0], dist: 20.307, yaw: 14.575, pitch: -10.487 }]
    - [31, { at: [11.971, -480.768, 0], dist: 21.613, yaw: 13.889, pitch: -10.106 }]
    - [32.5, { at: [11.939, -480.512, 0], dist: 23.411, yaw: 12.944, pitch: -9.581 }]
    - [34, { at: [11.899, -480.191, 0], dist: 25.661, yaw: 11.761, pitch: -8.923 }]
    - [35.5, { at: [11.851, -479.811, 0], dist: 28.328, yaw: 10.36, pitch: -8.144 }]
    - [37, { at: [11.797, -479.376, 0], dist: 31.374, yaw: 8.759, pitch: -7.255 }]
    - [38.5, { at: [11.737, -478.893, 0], dist: 34.761, yaw: 6.979, pitch: -6.265 }]
    - [40, { at: [11.671, -478.367, 0], dist: 38.453, yaw: 5.039, pitch: -5.187 }]
    - [41.5, { at: [11.6, -477.803, 0], dist: 42.412, yaw: 2.959, pitch: -4.03 }]
    - [43, { at: [11.526, -477.205, 0], dist: 46.601, yaw: 0.757, pitch: -2.807 }]
    - [43.5, { at: [11.5, -477, 0], dist: 48.042, yaw: 0, pitch: -2.386 }]
    - [43.85, { at: [11.332, -477.044, 0.835], dist: 49.536, yaw: -2.421, pitch: -1.246 }]
    - [44.2, { at: [11.008, -477.128, 2.44], dist: 52.407, yaw: -6.875, pitch: 0.852 }]
    - [44.55, { at: [10.531, -477.253, 4.804], dist: 56.635, yaw: -13.008, pitch: 3.74 }]
    - [44.9, { at: [9.899, -477.418, 7.937], dist: 62.239, yaw: -20.466, pitch: 7.253 }]
    - [45.25, { at: [9.109, -477.624, 11.853], dist: 69.243, yaw: -28.896, pitch: 11.223 }]
    - [45.6, { at: [8.162, -477.871, 16.546], dist: 77.638, yaw: -37.942, pitch: 15.483 }]
    - [45.95, { at: [7.067, -478.156, 21.97], dist: 87.341, yaw: -47.25, pitch: 19.867 }]
    - [46.3, { at: [5.849, -478.474, 28.008], dist: 98.142, yaw: -56.466, pitch: 24.207 }]
    - [46.65, { at: [4.55, -478.813, 34.447], dist: 109.658, yaw: -65.237, pitch: 28.338 }]
    - [47, { at: [3.238, -479.155, 40.95], dist: 121.291, yaw: -73.207, pitch: 32.091 }]
    - [47.35, { at: [2.006, -479.477, 47.056], dist: 132.213, yaw: -80.023, pitch: 35.301 }]
    - [47.7, { at: [0.971, -479.747, 52.189], dist: 141.394, yaw: -85.329, pitch: 37.8 }]
    - [48.05, { at: [0.261, -479.932, 55.709], dist: 147.69, yaw: -88.773, pitch: 39.422 }]
    - [48.4, { at: [0, -480, 57], dist: 150, yaw: -90, pitch: 40 }]
---

<LisTakeover><h1>Ačiū</h1></LisTakeover>
<Soundtrack :level="0.6" resync />

<!-- facts: lhcb-detector-size, lhcb-hlt1-30mhz, lhcb-trigger-5tbs-10gbs, cern-lhc-size-cost, cern-fcc-study, cern-sps-7km -->

<!--
Kalbėtojui. Klipo paskutinis kadras (vėliava ant apatinės šaltosios dėžės, SciFi apačioje) virsta grūdeliais, ir kamera atsitraukia iš modulio galo į visą LHCb detektorių — taškų debesį pagal tikrąją geometriją (savininkas, 2026 10 21: „let's get back to point cloud“); išgraviruota vėliava kartu su modulio vaizdu, kuriame ji yra, lieka ten, kur LHCb sekiklyje iš tikrųjų stovi tas SciFi modulis (apatinė šaltoji dėžė), modulio padėtimi, ir kamerai tolstant mažėja iki tikrojo detektoriaus mastelio (~15 s), kol tampa mažyčiu ženklu; iš šono ji matoma kampu (savininkas, 2026 10 21: „the inscribed flag (on one of the SciFi mats) along with the mat itself moves to a position where scifi is. and reduces in size accordingly (because it's far away)“). Kamera nusileidžia ant ertmės grindų prie miuonų sienos, kalbėtojo akių aukštyje (1,71 m, ūgis 1,83 m), 7,6 m priešais žmogų mastui (1,83 m, toks pat taškų debesis): miuonų siena iškyla virš kadro, o detektorius tolsta visais savo 21 m iki susidūrimo taško kairėje (savininkas, 2026 10 20: „see the huge scale of lhcb … first person view at eye level“; „look at it side on from the middle. From where that person stands. It can be me, 183cm in height“; 2026 10 21: „we want to really reveal the vast scale of it“). Kamerai nusileidus, kartu su muzikos kulminacija (~18 s), tame taške susikerta tikro LHCb susidūrimo protonų paketai (savininkas: „LHCb collision within lhcb“): laikas beveik sustoja, tada susidūrime gimusios dalelės lekia per detektorių link žiūrovų, ir kiekviena jo dalis sušvinta, kai jos ją pasiekia. Kamera lėtai eina išilgai detektoriaus (~18–29 s), tada ilgai ir lėtai traukiasi ir kyla, kol matyti visas detektorius ir mažytis žmogus prie jo kojos (~43 s) (savininkas, 2026 10 20: „don't need to rush to zoom out“). Tuo metu (~30 s) susidūrimai kartojasi vis dažniau, kol jų blyksniai susilieja ir detektorius ima švytėti tolygiai (savininkas, 2026 10 20: „40 million collisions a second“): ryšuliai LHCb susikerta 40 mln. kartų per sekundę, ir visas detektorius nuskaitomas kiekvieną kartą. Su antra muzikos kulminacija (~42 s) virš detektoriaus susirenka LHCb logotipas. Tada (~44–48 s) kamera traukiasi toliau, kyla ir pasisuka: LHCb kartu su vėliava susitraukia į tašką, ir aplink jį išnyra visas CERN greitintuvų kompleksas tikrosiomis tarpusavio proporcijomis, išdėstytas apytiksliai kaip FCC žemėlapyje (27 skaidrė): LHC žiedas (26,7 km) su dviem priešpriešiais skriejančiais pluoštais (žydru ir baltu), jo viduje SPS (beveik 7 km), šalia PS ir pernešimo linijos į LHC, punktyru — siūlomas FCC žiedas (90,7 km); logotipas pakyla į kadro viršų (savininkas, 2026 10 21: „can show the accelerator as well, so this doesn't look isolated, it's a part of huge infrastructure“; „still want to see LHC, FCC, and 2 beams circulating“; „So the full accelerator complex (much like slide 27)“). Kamerai sustojus (~48 s), FCC žiedo viduryje pasirodo „Ačiū“, o LHCb vieta LHC žiede (8-asis taškas) pažymėta šviesiu tašku. Pavadinimų ekrane nėra: žiedus įvardyti žodžiu (kairėje mažesnis — LHC, dešinėje didysis punktyrinis — FCC). LHCb ir kompleksas nupiešti skirtingu masteliu (LHCb ilgis 21 m): kompleksas rodo, kur LHCb stovi. Pluoštai sukasi tol, kol vyksta klausimai. Viskas lieka per klausimus. Muzika po minutės pati nutyla.
Nuorodų ekrane nėra: licencijų reikalaujamos nuorodos — kitame puslapyje, kurio nerodyti (savininkas, 2026 10 19: „We don't need credits at the last slide“).
Sakyti: „Žiniatinklis, jutiklinis ekranas ir spalvotas rentgenas atsirado iš problemų, kurias fizikams iškėlė klausimas, iš ko sudarytas pasaulis. FCC iškels naujų problemų. Jei jūsų įmonė nori tiekti CERN, užsiregistruokite CERN tiekėjų portale ir parašykite Inovacijų agentūros specialistei, kuri rūpinasi įmonių bendradarbiavimu su CERN. Ačiū, laukiu klausimų.“
Faktai (jei paklaus apie švytėjimą): ryšuliai LHCb susikerta 40 MHz dažniu; 3-iajame etape vidutiniškai 30 mln. kartų per sekundę susikirtime būna susidūrimų, ir LHCb nuskaito visą detektorių kiekvieną kartą — apie 5 TB/s į programinį trigerį, saugoti lieka apie 10 GB/s (maždaug vienas baitas iš 500).
Nuorodos (pasakyti, ekrane jų nėra): lhcb-vilnius.web.cern.ch — mūsų grupė; kt.cern — CERN žinių perdavimas; business-with-cern.web.cern.ch — kaip tapti CERN tiekėju.
Laikas: skirta ~25 min ar daugiau (savininkas, 2026 10 08). Trukmė (pagal skaidrių pastabų laikus, 2026 10 20): iš viso apie 25 min; klipai — įžanginis 4:13, CERN iš oro 0:11, LHC tunelis 0:40, LHCb animacija 0:48, FCC žemėlapis 0:18, LHCb savaitės filmas 2:28 ir šviesos įvedimo sistema 0:20 (per filmą nekalbama, per kitus penkis — taip). Po šios — nuorodų puslapis (nerodyti), po jo paslėpta skaidrė (Geant4, ROOT, Zenodo ir kt.) — tik paklausus.
(~0,4 min)
-->

---
class: credits-page
space: { at: [0, -480, 57], dist: 150, yaw: -90, pitch: 40, dim: 0.7, ambient: 0, hum: false }   # the close's last view: the accelerator complex from above
---

<Grains :set="{ det: 1, lhcbLogo: 1 }" />
<Soundtrack :level="0.6" />
<div class="src credits credits-list">Planck CMB žemėlapis: ESA ir Planck kolaboracija, CC BY-NC 3.0 IGO (perprojektuotas, išlygintas, nuspalvintas)<br>
1989 m. pasiūlymas: nuotr. Sailko, CC BY 3.0<br>
Riešo vaizdas: MARS Bioimaging Ltd<br>
B. Stumpe: S. E. Bennett / CERN, CC BY 4.0<br>
NeXT serveris: P. Loïez / CERN, CC BY-SA 4.0<br>
LHCb rezultatų grafikai: © CERN LHCb kolaboracijos naudai, CC BY 4.0 (apkarpyti, perspalvinti)<br>
LHCb savaitės Vilniuje filmas: Nebula Moments (R. Unkevičius)<br>
Kosminis tinklas: NCSA Advanced Visualization Lab („Cosmic Bubble Bath“, NSF)<br>
Žemėlapiai: Natural Earth (viešasis domenas); miestų koordinatės iš dalies © OpenStreetMap bendraautoriai (ODbL)<br>
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
