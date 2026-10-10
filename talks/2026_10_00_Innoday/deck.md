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
  sound: { hum: true, flight: true, clip: true }
  humAt: all   # the low hum through the talk, out in the open dust of the prologue too
  # deeper than the blue palette's own look: a black ground (fewer, dimmer dust
  # grains, little nebula, a firmer vignette), no film grain, no fringes
  options: { nebula: 0.12, grain: 0.012, aberration: 0, bloom: 0.55, density: 0.6, dustGain: 1.45, vignette: 0.42 }
title: Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje
info: |
  Innoday 2026, in Lithuanian. One story: to see what the world is made of,
  physicists needed a machine nobody could buy; each of its limits had to be
  broken, and the solutions left the laboratory as things in daily use; the
  next machine is being designed now, and Lithuanian firms can solve its
  problems. Prologue: the zoom-out from the VU Faculty of Physics to our galaxy,
  whose last frame becomes the world's grains (<WebTakeover>), the history of
  the Universe as a funnel of grains, the flight back to the CMB (Planck), and
  the question. Part I the machine: CERN, LHCb, the data rate, the LHC's
  limits. Part II the ring with a strand from each part to what it gave, each
  photo standing at its strand's end (StagePhoto places): touchscreen, the web,
  PET, colour X-ray, Timepix round the Moon, hadron therapy, White Rabbit,
  superconducting lines. Part III the private sector: how technology leaves
  CERN, what it does for suppliers, the next machine, Lithuania, the zoom-out
  reversed back to Saulėtekis, what a firm can do. Slides carry no words (owner,
  2026-10-10: he narrates), only a few numbers; the notes carry what is said.
  No cover: the deck opens on the zoom-out, held on its first frame until the
  first press (<OpenerStart>). Toolkit: slidev-videos v0.5.1. Keys on a video
  slide: p play/pause, + / - volume; `c` builds what stands where the camera is.
layout: default   # Slidev gives a first slide the cover layout, whose box would hold the clip at 0 px tall
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0 }   # the opener's pose, which the takeover keeps: the next slide stands exactly here
---

<OpenerStart poster="video-frames/vu_ff_zoom_galaxy.mp4.poster.jpg" />

<VideoPlayer src="vu_ff_zoom_galaxy.mp4" transition="fade" advance-on-end />

<!--
Kalbėtojui. Viršelio nėra: atsidarius skaidrėms rodomas pirmasis klipo kadras, o klipas tuo metu įkeliamas. Pirmas paspaudimas (→, tarpas, PageDown, „p“ arba pelės spustelėjimas) paleidžia klipą su garsu, o ne pereina toliau; tas pats veiksmas įjungia ir foninį garsą (naršyklė garsą leidžia tik po naudotojo veiksmo). Rodant per /presenter, prieš pradedant vieną kartą spustelėti auditorijos langą.
Sakyti (kol rodomas pirmasis kadras, jei norisi prisistatyti): „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei, kuri dirba CERN LHCb eksperimente. Pradėsime nuo Saulėtekio.“
Nutolinimas nuo VU Fizikos fakulteto ir NFTMC pastato Saulėtekyje: Vilnius, Lietuva, Žemė, mūsų galaktika. Klipas baigiasi mūsų galaktika iš šono (paskutinės 16 s, kuriose vaizdas užgęsta, nukirptos). Galima tylėti arba trumpai įvardyti etapus. Jei laiko mažai, klipą trumpinti manifeste (trim).
Spausti nereikia: klipui pasibaigus, skaidrės pačios pereina į kitą, kuri prasideda nuo to paties paskutinio kadro ir paverčia jį pasaulio grūdeliais. Paspaudus klipo metu, pereinama anksčiau (tada klipo pabaiga nieko nebedaro). Savaime pereinama tik auditorijos lange, ne /presenter.
(klipas 4:26, su savo garso takeliu; ~4,4 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }
---

<WebTakeover />

<!--
Kalbėtojui. Skaidrė prasideda nuo paskutinio klipo kadro, todėl perėjimo nesimato. Po pusės sekundės tamsa tolygiai pereina į pasaulio foną, o šviesios vietos subyra į grūdelius. Kiekvienas grūdelis stovi savo pikselio regėjimo linijoje, todėl, kol kamera nejuda, grūdeliai sudaro tą patį vaizdą; kitoje skaidrėje kamera pajuda ir paaiškėja, kad vaizdas turi gylį.
Sakyti (kol byra): „Mūsų galaktika iš šono. Kiekvienas šio vaizdo taškas dabar atsiskiria ir pakimba erdvėje.“
Techniškai: kadras — public/figures/opener_last.jpg, išsitrauktas komanda pnpm takeover:frame public/videos/<klipas>.mp4. Kai bus orbitinis klipas iki kosminio tinklo, kartoti su juo ir pakeisti Sakyti: „Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų.“
(~0,3 min)
-->

---
space: { at: [30, 39, -119], dist: 25, yaw: -72, pitch: 13, dim: 0, flight: 3.5 }   # the bell on its side, narrow end left, from three-quarters on the mouth side (the NASA/WMAP figure)
---

<AfterFlight :delay="3.4">
<div class="world-caption narrow small">

# 13,8 mlrd. metų

</div>
</AfterFlight>

<!--
Kalbėtojui. Kamera praskrenda pro mūsų galaktikos grūdelius ir parodo piltuvą iš šono: Visatos istorija iš grūdelių, nuo Didžiojo sprogimo (siauroji dalis) iki šiandienos (platusis galas, arčiau mūsų). Skaičius pasirodo, kai kamera sustoja. Kitoje skaidrėje kamera įskrenda į piltuvą.
Sakyti: „Mūsų galaktika — tik viena iš šimtų milijardų. Šis piltuvas yra Visatos istorija: siaurasis galas — Didysis sprogimas prieš 13,8 mlrd. metų, platusis — šiandien. Visata plečiasi, o maždaug pastaruosius šešis milijardus metų — vis greičiau. Kuo toliau žiūrime, tuo senesnę šviesą matome.“
Faktai: Visatos amžius 13,787 ± 0,020 mlrd. m. (Planck 2018, A&A 641, A6); spartėjantis plėtimasis — 1998 m. atradimas (2011 m. Nobelio premija); plėtimasis spartėja maždaug pastaruosius 6 mlrd. metų (z ≈ 0,6), tamsioji energija vyrauja maždaug pastaruosius 3,5 mlrd. metų (z ≈ 0,3) (Planck 2018, ΛCDM).
Šaltiniai: Planck 2018 results VI (A&A 641, A6).
(~0,4 min)
-->

---
space: { at: [30, 40, -136], dist: 7.5, yaw: 0, pitch: 0, dim: 0.1, flight: 5 }   # in at the mouth and back down the funnel, past the galaxies, the first stars and the dark ages, to the CMB disk
---

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
space: { at: [30, 40, -136], dist: 12, yaw: 24, pitch: 8, dim: 0.3 }   # pulled back from the CMB disk: the question stands over the oldest light
---

<!--
Kalbėtojui. Kamera atsitraukia nuo foninės spinduliuotės skydo, prieš seniausią šviesą. Klausimas „Iš ko visa tai sudaryta?“ — visos kalbos pradžia: kitos skaidrės rodo greitintuvą, kurį teko pastatyti, kad į jį atsakytume, ir ką davė jos problemos.
Sakyti: „Žvaigždės, dujos, planetos ir mes patys sudaryti iš kelių rūšių dalelių. Norint pamatyti, kas yra jų viduje, daleles reikia sudaužyti labai didele energija. Tam reikia didžiausio pasaulyje dalelių greitintuvo. Jį pastatė CERN, Europos dalelių fizikos laboratorija prie Ženevos.“
Pastaba: „žvaigždės, dujos, planetos ir mes“ — tyčia ne „galaktikos“: didžioji galaktikų masės dalis yra tamsioji materija, kurios sudėties nežinome.
(~0,4 min)
-->

---
layout: section
space: { at: [8.8, 0, -3], dist: 20, yaw: -30, pitch: 55, dim: 0.15 }   # the ring from above in the right half, clear of the title
---

<Strands :on="false" />

<!--
Kalbėtojui. Sakyti: „CERN ir Didysis hadronų greitintuvas.“ Pasaulyje — greitintuvo žiedas: du protonų paketai skrieja priešingomis kryptimis ir susitinka du kartus per ratą; iš kiekvieno susitikimo taško sklinda dalelių pėdsakai.
(~0,2 min)
-->

---
space: { at: [20, 5, -12], dist: 18, yaw: -30, pitch: 14 }
---

<Strands :on="false" />

<VideoPlayer src="cern_overview_short.mp4" />

<!--
Kalbėtojui. CERN iš paukščio skrydžio: Ženevos priemiestis, Prancūzijos ir Šveicarijos pasienis. Klipas trumpas (0:11) — kalbėti per jį ir po jo.
Sakyti: „Tai CERN. Jį 1954 m. įkūrė 12 Europos valstybių, kad po karo galėtų kartu tirti, iš ko sudarytas pasaulis. Šiandien jis turi 25 valstybes nares ir 11 asocijuotųjų narių, tarp jų Lietuvą. Su CERN dirba daugiau nei 12 000 mokslininkų, daugiau nei 110 tautybių atstovų. Po šiais laukais, apie 100 m gylyje, yra 27 km ilgio greitintuvo žiedas.“
Faktai: konvencija pasirašyta 1953 m., CERN oficialiai įsteigtas 1954 m. rugsėjo 29 d. Steigėjos — Belgija, Danija, Prancūzija, VFR, Graikija, Italija, Nyderlandai, Norvegija, Švedija, Šveicarija, JK, Jugoslavija. Naujausios narės — Estija (2024) ir Slovėnija (2025). Asocijuotosios narės (11): Brazilija, Čilė, Kroatija, Kipras (parengiamasis etapas), Indija, Airija, Latvija, Lietuva, Pakistanas, Turkija, Ukraina. Apie 2 500 darbuotojų, 12 639 registruoti naudotojai (2025). 2026 m. biudžeto įnašai — apie 1,28 mlrd. CHF.
Šaltiniai: home.cern/about/who-we-are/our-history; home.cern/about/who-we-are/member-states; usersoffice.web.cern.ch (2025 m. statistika); fap-dep.web.cern.ch (2026 m. įnašai).
(klipas 0:11; kalbos ~0,5 min)
-->

---
space: { at: [56, 5, -14], dist: 16, yaw: -28, pitch: 12 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" />

<!--
Kalbėtojui. LHCb detektoriaus 3D animacija (CERN-FOOTAGE-2022-042-001), be garso — kalbėti per ją.
Sakyti: „Mūsų eksperimentas — LHCb. Jis, be kita ko, tiria, kodėl Visatoje liko materija. Didysis sprogimas turėjo sukurti po lygiai materijos ir antimaterijos. Susitikusios jos viena kitą sunaikina, tačiau materijos liko. Todėl LHCb lygina, kaip skyla dalelės ir jų antidalelės, ir ieško mažyčių skirtumų. Detektorius 21 m ilgio ir stovi tik vienoje susidūrimo taško pusėje, nes jį dominančios dalelės dažniausiai išlekia pirmyn, arti pluošto. Arčiausiai pluošto, vos 5 mm nuo jo, stovi pikselių detektorius. Vilniaus universitetas yra LHCb kolaboracijos narys nuo 2024 m.“
Jei klausia apie rezultatus: 2025 m. LHCb pirmą kartą pamatė materijos ir antimaterijos elgesio skirtumą barionuose — dalelių šeimoje, kuriai priklauso protonai ir neutronai (>80 000 Λb⁰ → p K⁻ π⁺ π⁻ skilimų, asimetrija (2,45 ± 0,47) %, 5,2σ; Nature 2025 07 16). Standartinio modelio CP pažeidimo nepakanka stebimam materijos pertekliui paaiškinti (barionų ir fotonų santykis ~10⁻¹⁰, SM numato ~10⁻¹⁸).
Faktai: LHCb sveria 5 600 t, 21 × 10 × 13 m, 100 m po žeme; artimiausias VELO pikselis — 5,1 mm nuo pluošto; kolaboracijoje beveik 2 000 narių. VU priimtas 2024 m. rugsėjo 2 d. LHCb kolaboracijos tarybos sprendimu; grupė dirba VU FF Fotonikos ir nanotechnologijų institute (lhcb-vilnius.web.cern.ch). 2026 m. rugsėjo 14–18 d. LHCb savaitė pirmą kartą vyko Vilniuje (~200 dalyvių vietoje).
Šaltinis: home.cern/science/experiments/lhcb; VU FF naujienos, 2024 09 16.
(klipas 0:56; kalbos ~1 min)
-->

---
space: { at: [21, 0, 0], dist: 5, yaw: 180, pitch: 22, dim: 0.3 }   # match cut: down on the ring, looking along it; its curve becomes the tunnel's
---

<Strands :on="false" />

<div class="readout">

<div class="big"><Count :from="0" :to="4" :ms="1600" /><span class="unit">TB/s</span></div>

</div>

<!-- facts: lhcb-upgrade1-trigger, lhcb-allen-gpu -->

<!--
Kalbėtojui. Po LHCb animacijos: mūsų eksperimento problema. Kamera nusileidžia ant grūdelių žiedo ir žiūri išilgai jo — kitoje skaidrėje žiedo lankas tampa tunelio lanku.
Sakyti: „Šiandien mūsų eksperimento problema yra duomenų kiekis. LHCb detektorius kas sekundę pagamina apie 4 terabaitus. Tiek užrašyti neįmanoma, todėl reikia iš karto nuspręsti, ką pasilikti. Nuo 2022 m. tai daro vaizdo plokštės su tais pačiais lustais kaip žaidimų kompiuteriuose. LHCb — pirmasis eksperimentas, kurio visa pirmoji atrankos pakopa veikia vaizdo plokštėse. Į diską patenka maždaug vienas baitas iš keturių šimtų.“
Faktai: GPU — NVIDIA RTX A5000 (profesionali žaidimų lusto versija); vietų ~500, bazinei HLT1 reikia ~200; antroji pakopa — >3 000 serverių; į diską ~10 GB/s.
Šaltiniai: LHCb, JINST 19 (2024) P05065; CERN EP Newsletter (2020).
Jei klausia apie atviruosius duomenis: visus 2011–2012 m. LHCb duomenis (800 TB) viešam naudojimui parengiau. Nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, o nuo 2026 m. kovo per internetinę paslaugą galima gauti ir antrojo etapo duomenis, iš viso daugiau nei 4 PB.
(~0,7 min)
-->

---
space: { at: [21, 0, 0], dist: 5, yaw: 180, pitch: 22, dim: 0 }   # the same pose under the photo
---

<Strands :on="false" />

<StagePhoto src="figures/hero_tunnel.jpg" alt="LHC tunelis su mėlynais dipoliniais magnetais" class="frame" />

<div class="stats">
<div class="stat"><div class="n">26,7<small>km</small></div></div>
<div class="stat"><div class="n">−271,3<small>°C</small></div></div>
<div class="stat"><div class="n">2,85<small>m/s</small></div></div>
<div class="stat"><div class="n">1,5<small>mlrd.</small></div></div>
</div>

<!-- facts: cern-lhc-size-cost, cern-lhc-cold, cern-lhc-speed, cern-lhc-collisions -->

<!--
Kalbėtojui. Čia kalba pasisuka prie to, ko mašina pareikalavo. Šie skaičiai — II dalies problemos.
Sakyti: „Kad sužinotume, iš ko sudarytas pasaulis, greitintuvas turėjo būti toks. Jo žiedas yra 27 km ilgio ir 100 m po žeme. 1 232 superlaidūs magnetai atšaldomi iki minus 271 laipsnio Celsijaus, šalčiau nei erdvė tarp galaktikų. Protonai skrieja tik 2,85 m/s lėčiau už šviesą ir per sekundę apskrieja žiedą 11 245 kartus, o susidūrimų per tą pačią sekundę įvyksta apie pusantro milijardo, ir kiekvieną reikia pamatyti. Vaizdo plokštes galima nusipirkti parduotuvėje, o daugelio kitų dalykų niekas negamino, todėl juos teko sukurti. Su tokiomis problemomis per penkiasdešimt metų susidurta ir kuriant ankstesnius CERN greitintuvus.“
Svarbu: nuo 2026 06 29 LHC neveikia — prasidėjo trečioji ilgoji techninė pertrauka (LS3), todėl skaičiai — darbo metu (3-iasis darbo etapas: 6,8 TeV, 99,99999905 % šviesos greičio). Dažnai cituojamas „99,9999991 %“ atitinka projektinę 7 TeV energiją. Kosminis fonas — 2,7 K.
Faktai: 9 593 magnetai; vakuumas vamzdyje ~10⁻¹³ bar; pluošte sukaupta energija iki 490 MJ.
Šaltinis: home.cern/science/accelerators/large-hadron-collider (3-iojo darbo etapo, 2022–2026, parametrai).
Ekrane tik skaičiai: 26,7 km — žiedas 100 m po žeme; −271,3 °C — magnetai šaltesni nei erdvė tarp galaktikų; 2,85 m/s — tiek protonai lėtesni už šviesą; 1,5 mlrd. — susidūrimų per sekundę.
Vaizdas: LHC tunelis; nuotr. Samuel Joseph Hertzog / CERN, CC BY 4.0.
(~0,9 min)
-->

---
layout: section
space: { at: [14, 1, 0], dist: 36, yaw: -20, pitch: 52, dim: 0.15 }   # the ring and every strand leaving it
places: { inventions: true }   # Part II's photos stand in the world from here (hidden before)
---

<Strands />

<!--
Kalbėtojui. Pasaulyje — greitintuvo žiedas ir iš jo išeinančios šešios tekančių grūdelių gijos: kiekviena veda nuo greitintuvo dalies prie to, kas iš jos atsirado. Kiekviena šios dalies skaidrė prasideda problema ir baigiasi tuo, kas iš jos išėjo į pasaulį. Tvarka: kas yra jūsų kišenėje, kas padeda gydytojams ir astronautams, kas vyksta pramonėje šiandien.
Sakyti: „Šešios problemos: kaip valdyti greitintuvą, kaip tvarkyti informaciją, kaip pamatyti dalelę, kaip nukreipti pluoštą, kaip suderinti laikrodžius ir kaip atšaldyti. Iš kiekvienos atsirado kas nors, kas šiandien naudojama už CERN ribų. Pradėsiu nuo jutiklinio ekrano, kurį turite savo telefone.“
(Jutiklinio ekrano nevadinti CERN išradimu: CERN buvo vienas pirmųjų, ne pirmasis — žr. jo skaidrę.)
(~0,4 min)
-->

---
space: { at: stumpe, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="stumpe" :relief="0.25" :at="[19.5, 2.5, -9.53]" :size="3" :yaw="-30" src="figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" focus="50% 30%" />

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
space: { at: [25.0, 2.5, 0.0], dist: 9, yaw: -90, pitch: 30, dim: 0, flight: 1.6 }   # strand 0°: from its ring part, looking out along it to the product
---

<Strands />

<StagePhoto src="figures/hero_proposal.jpg" arrive="camera" :dust-ms="[800, 600]" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" focus="50% 0%" />

<!--
Kalbėtojui.
Sakyti: „CERN dirba tūkstančiai žmonių, kurie atvyksta vidutiniškai dvejiems metams ir išvyksta, o jų žinios pasimeta. 1989 m. kovą CERN programuotojas Timas Bernersas-Lee pasiūlė, kaip tą informaciją sujungti. Pasiūlyme jis cituoja klausimą, kuriuo tada baigdavosi pokalbiai apie būsimąjį LHC: kaip susigaudyti tokiame dideliame projekte? Vadovas Mike'as Sendallas ant pirmojo puslapio užrašė tris žodžius: „Vague but exciting…“ — „Miglota, bet įdomu…“ Iš to pasiūlymo atsirado pasaulinis žiniatinklis.“
Pasiūlymo įžanga: daugelis diskusijų apie CERN ateitį ir LHC erą baigiasi klausimu „Yes, but how will we ever keep track of such a large project?“ 1990 m. lapkričio 12 d. formaliame projekto pasiūlyme (su Robert'u Cailliau) prašyta 4 programinės įrangos inžinierių ir programuotojo maždaug pusmečiui.
Vaizdas: T. Bernerso-Lee pasiūlymas su M. Sendallo pastaba, CERN ekspozicija; nuotr. Sailko, CC BY 3.0 (Wikimedia Commons).
Šaltiniai: w3.org/History/1989/proposal.html; w3.org/Proposal.html.
(~0,7 min)
-->

---
space: { at: next, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="next" :relief="0.25" :at="[27.0, 2.5, 4.5]" :size="3" :yaw="-90" src="figures/hero_next.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" focus="35% 55%" />

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
space: { at: pet, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="pet" :relief="0.3" :at="[19.5, 2.5, 9.53]" :size="3" :yaw="-150" src="figures/hero_pet.jpg" alt="Šiuolaikinis PET/KT skeneris ligoninės kabinete" focus="60% 50%" />

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
space: { at: mars, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="mars" :relief="0.25" :at="[16.6, 2.5, 13.51]" :size="3" :yaw="-150" src="figures/hero_mars.jpg" alt="Spalvotas 3D žmogaus riešo rentgeno vaizdas: kaulai balti, minkštieji audiniai raudoni, metaliniai varžtai mėlyni" focus="40% 50%" />

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
space: { at: artemis, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="artemis" :relief="0.3" :at="[24.4, 2.5, 9.01]" :size="3" :yaw="-150" src="figures/hero_artemis.jpg" alt="NASA Artemis II raketa SLS kyla iš paleidimo aikštelės" focus="50% 40%" />

<!-- facts: gave-timepix-artemis, ktbest-advacam -->

<!--
Kalbėtojui. Ta pati lustų šeima.
Sakyti: „Ta pati lustų šeima šį balandį skrido aplink Mėnulį. Šeši CERN Timepix lustai Artemis II Orion kapsulėje realiuoju laiku matavo, kokią spinduliuotės dozę gauna įgula. Modulius pagamino Prahos įmonė ADVACAM, kuri išaugo iš šios CERN technologijos.“
Artemis II — pirmoji pilotuojama kelionė link Mėnulio nuo 1972 m. (startas 2026 m. balandžio 1 d. 18:35 Floridos laiku (Lietuvoje jau balandžio 2 d., 01:35); nusileido balandžio 10 d.). Timepix lustai TKS naudojami nuo 2012 m.; Timepix (NASA HERA) skrido ir 2022 m. nepilotuojamame Artemis I. ADVACAM — Praha, įkurta 2013 m.
Vaizdas: Artemis II startas, 2026 m. balandžio 1 d.; nuotr. NASA / Michael DeMocker.
(~0,4 min)
-->

---
space: { at: hadron, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="hadron" :relief="0.3" :at="[8.5, 2.5, 9.53]" :size="3" :yaw="150" src="figures/hero_hadron.jpg" alt="Hadronų terapijos centro sinchrotronas" focus="50% 50%" />

<!-- facts: ktbest-hadron-9000, gave-hadron-pimms -->

<!--
Kalbėtojui.
Sakyti: „Greitintuvais dalelių pluoštą galima nukreipti labai tiksliai. Protonai ir anglies jonai didžiąją energijos dalį atiduoda tam tikrame gylyje, todėl jais galima apšvitinti naviką ir mažiau pažeisti aplinkinius audinius. Tai vadinama hadronų terapija. CERN su partneriais 1996–2000 m. suprojektavo gydymui skirtą sinchrotroną ir projektą paskelbė atvirai. Pagal jį pastatyti du centrai: CNAO Italijoje ir MedAustron Austrijoje. CNAO pirmąjį pacientą gydė 2011 m. Juose jau gydyta daugiau nei 9 000 pacientų su retais ir sunkiai pagydomais navikais.“
Jei laikas leidžia: „CERN su Lozanos ligonine CHUV ir įmone THERYQ kuria FLASH greitintuvą DEFT: visa spindulinio gydymo dozė per mažiau nei 0,1 s, iki 25 cm gylio. Jis remiasi CERN CLIC technologija.“ Taip pat: CERN-MEDICIS 2025 m. IV ketv. pirmą kartą išsiuntė aktinio-225 pramonei — RayzeBio (2024 m. už 4,1 mlrd. USD įsigijo „Bristol Myers Squibb“).
Faktai: PIMMS (CERN, TERA, MedAustron, Onkologie-2000). CNAO Pavijoje (pirmasis pacientas 2011 m.), iki 2026 m. liepos >6 200 pacientų, vienas iš 8 pasaulio centrų, gydančių ir protonais, ir anglies jonais; MedAustron (pirmasis pacientas 2016 m. gruodį) iki 2025 m. sausio >2 700 pacientų. CERN 2026 m. studija: kartu „beveik 9 000“; su naujausiais centrų duomenimis — >9 000. DEFT: 140 MeV elektronai, 20–30 Gy. PRISMAP (2021–2025): 159 siuntos, 23 radionuklidai, 47 projektai iš 19 šalių.
Vaizdas: MedAustron sinchrotronas, Vyner Noištatas (Austrija); © CERN.
(~0,7 min)
-->

---
space: { at: whiterabbit, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="whiterabbit" :relief="0.3" :at="[3.0, 2.5, 0.0]" :size="3" :yaw="90" src="figures/white_rabbit.jpg" alt="White Rabbit jungiklis WRS-3/18 su šviesolaidžiais" focus="50% 50%" class="dim" />

<!-- facts: gave-white-rabbit, ktbest-whiterabbit-boerse, ktnews-wr-quantum -->

<!--
Kalbėtojui. Iš ligoninės — į pramonę šiandien.
Sakyti: „Tūkstančiai greitintuvo įrenginių turi veikti tiksliai vienu metu. Todėl CERN sukūrė White Rabbit: sistemą, kuri laikrodžius tinkle suderina nanosekundės dalies tikslumu. Ji veikia nuo 2012 m., jos aparatinė įranga atvira, ir šiandien ja naudojasi Frankfurto birža, o Ženevoje — pirmasis Šveicarijos kvantinis tinklas.“
Jei klausia apie duomenis: 2025 m. gruodį CERN saugomų LHC duomenų kiekis peržengė vieną eksabaitą (milijoną terabaitų); juos apdoroja pasaulinis tinklas — daugiau nei 170 centrų 42 šalyse.
Faktai: dauguma duomenų įrašyta į ~60 000 magnetinių juostų; CERN skaičiavimu, tai tik apie 10 % to, ką reikės saugoti per artimiausius dešimt metų. WLCG: ~1,4 mln. procesorių branduolių, 1,5 EB saugyklos, >2 mln. užduočių per dieną. Lietuva 2005 m. prisidėjo prie BalticGrid projekto. White Rabbit — nuo 2012 m., IEEE 1588-2019; Deutsche Börse — >500 prievadų; kvantinis tinklas — 262 km šviesolaidžių, tarp partnerių ID Quantique ir Rolex.
Jei laikas leidžia: duomenų problema davė atvirojo mokslo įrankius — Zenodo, ROOT, Geant4 (paslėpta skaidrė po pabaigos).
Vaizdas: White Rabbit jungiklis WRS-3/18 (atviroji aparatinė įranga, CERN OHL v1.2); nuotrauka iš CERN KT ataskaitos 2024 (report2024-kt.web.cern.ch/?p=1052), autorius nenurodytas.
(~0,7 min)
-->

---
space: { at: cold, dim: 0, flight: 1.6 }   # place mode: the photo stands at its strand's product
---

<Strands />

<StagePhoto mode="place" group="inventions" :grains="360" place-id="cold" :relief="0.3" :at="[8.5, 2.5, -9.53]" :size="3" :yaw="30" src="figures/hero_cold.jpg" alt="Superlaidi MgB₂ elektros linija bandymų stende" focus="50% 50%" />

<!-- facts: ktnews-airbus-samba, ktnews-cipea -->

<!--
Kalbėtojui. Paskutinis II dalies pavyzdys: technologija, kurią CERN šiandien kuria kartu su įmonėmis.
Sakyti: „LHC magnetai veikia tik atšaldyti beveik iki absoliutaus nulio, todėl superlaidūs kabeliai CERN yra kasdienybė. Superlaidi linija perduoda elektrą be nuostolių ir yra lengva, o vandeniliniame lėktuve ją atšaldytų pats skystas vandenilis. 2022–2024 m. su Airbus CERN išbandė 7 m ilgio tokią liniją, o dabar kuria liniją 2 megavatų varomajai sistemai.“
Faktai: SCALE (2022–2024, Airbus UpNext): lanksti REBCO linija, ±2 kA iki 63 K; SAMBA (2025–2026) — Airbus Cryoprop demonstratoriui. F4E pagrindų susitarimas 2025 09 10; bendradarbiavimas nuo 2014 m. Medicinai: GaToroid — superlaidus 12 t gantris vietoj iki 270 t.
Vaizdas: CERN superlaidi MgB₂ linija HL-LHC greitintuvui (SM18); jos technologija panaudota linijai, kurią CERN kūrė su Airbus; nuotr. Maximilien Brice / © CERN.
(~0,6 min)
-->

---
layout: section
space: { at: [120, -2.4, 0], dist: 14, yaw: -22, pitch: 22, dim: 0.4 }
places: { inventions: false }   # and are gone again in Part III
---

<Strands :on="false" />

<!--
Kalbėtojui. Dalies pavadinimas ištisai: „Prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje.“ Pasaulyje — auksinė „sėkla“ ir aplink ją besisukantis mazgų ratas: žinios, išeinančios iš CERN.
Sakyti: „Daugumoje šių pavyzdžių fizikų sprendimą produktu pavertė įmonė: Siemens — PET/KT skenerį, MARS — spalvotą rentgeną, ADVACAM — lustų modulius. O su Airbus CERN dabar bando superlaidžią liniją lėktuvams. Tokia įmonė galėtų būti ir lietuviška.“
(~0,3 min)
-->

---
space: { at: kt, dist: 17, yaw: 4, pitch: 34, dim: 0.4 }
---

<div class="payoff">
<div class="big">700+</div>
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
space: { at: [118.5, -1.6, 0], dist: 13, yaw: -30, pitch: 14, dim: 0.45 }
---

<Strands group="fcc" :on="false" />

<div class="payoff">
<div class="big">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">%</span></div>
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
space: { at: [22.5, 0, -14.7], dist: 70, yaw: -120, pitch: 58, dim: 0.15 }   # the FCC ring round the LHC at true scale (90.7 / 26.7 km); its strands end empty
---

<Strands group="fcc" />

<div class="readout">

<div class="big"><Count :from="27" :to="91" :ms="2400" /><span class="unit">km</span></div>

</div>

<!-- facts: cern-fcc-study, cern-espp-2026, ktnews-fcc-donors, cern-run3-end -->

<!--
Kalbėtojui. Kitos mašinos problemos.
Vaizdas: auksinis FCC žiedas tikru masteliu aplink mėlyną LHC žiedą (90,7 ir 26,7 km); šešios gijos baigiasi tuščiai — naujos mašinos problemos dar neišspręstos. Skaičius auga nuo 27 iki 91 km.
Sakyti: „Šių metų birželio 27 d. LHC žiede paskutinį kartą prieš ilgąją pertrauką skriejo protonai; iki 2030 m. jis pertvarkomas, kad duotų iki dešimties kartų daugiau susidūrimų. O gegužę CERN Taryba priėmė Europos dalelių fizikos strategiją: kitu greitintuvu siūlomas 91 km žiedas — Būsimasis žiedinis greitintuvas, sutrumpintai FCC. Sprendimas jį statyti laukiamas apie 2028 m. Jam reikės naujų magnetų, šaldymo ir vakuumo sistemų. Pernai gruodį pirmą kartą CERN istorijoje privatūs rėmėjai pažadėjo naujam greitintuvui apie 860 mln. eurų.“
Faktai: FCC galimybių studija (2025 03 31): 90,7 km, vidutinis gylis ~200 m, FCC-ee kaina ~15 mlrd. CHF per ~12–15 metų. Strategija priimta 2026 05 22 Budapešte. Datos: 2026 06 27 05:52 — paskutiniai 3-iojo etapo protonai (CERN Courier); 06 29 — LHC išjungtas, prasidėjo LS3 (home.cern). Rėmėjai: Ericas ir Wendy Schmidtai, Johnas Elkannas, Breakthrough Prize fondas, Xavier'as Nielis; pažadai priklauso nuo valstybių narių sprendimo. HL-LHC fizika — nuo 2030 m. birželio iki 2041 m.
Šaltiniai: home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/; council.web.cern.ch (2026 05 22 rezoliucija); home.cern/private-donors-pledge-860-million-euros-cerns-future-circular-collider/; cerncourier.com/a/fcc-feasibility-study-complete/.
(~0,8 min)
-->

---
space: { at: kt, dist: 18, yaw: 120, pitch: 12, dim: 0 }
---

<Strands group="fcc" :on="false" />

<StagePhoto src="figures/hero_lt.jpg" arrive="camera" alt="Prezidentas Gitanas Nausėda spaudžia ranką CERN generaliniam direktoriui Markui Thomsonui, už jų CERN, Lietuvos ir ES vėliavos" focus="50% 30%" />

<!-- facts: cern-lithuania, lt-full-decision, lt-nauseda-visit -->

<!--
Kalbėtojui.
Sakyti: „Lietuva yra asocijuotoji CERN narė nuo 2018 m. sausio, pirmoji iš Baltijos šalių. Todėl lietuviai gali dirbti CERN, o Lietuvos įmonės — dalyvauti jo pirkimuose. Lietuvos mokslininkai dirba CMS ir LHCb eksperimentuose. Šių metų sausį Prezidentas lankėsi CERN, nuotraukoje — su generaliniu direktoriumi Marku Thomsonu. Rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės, ir CERN patvirtino, kad procedūra pradėta. Estija visateise nare tapo 2024 m.“
Faktai: susitarimas pasirašytas 2017 06 27 Vilniuje, įsigaliojo 2018 01 08. Lietuvos įnašas 2026 m. — 1 000 000 CHF (~0,08 % biudžeto); visateisė narystė, LRT vertinimu, kainuotų apie 4 mln. eurų per metus (žurnalistų, ne CERN skaičius). CERN Grey Book (2026 10 07): Lietuva dalyvauja 7 eksperimentuose ir MTEP kolaboracijose — CMS (35 dalyviai, nuo 2007 m.), LHCb (15), DRD3 (11) ir kt. 2026 01 19 tą pačią dieną CERN pasirašė ketinimų memorandumus su „Ekspla“, „Ostaralab“ ir „Sargasas“.
Vaizdas: Prezidento G. Nausėdos vizitas CERN, 2026 m. sausio 19 d.; nuotr. Marina Cavazza / CERN.
Šaltiniai: home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20, Hamel de Monchenault: „The membership procedure has already started“); home.cern/presidential-visits-cern-0; greybook.cern.ch.
(~0,8 min)
-->

---
space: { at: [118.5, -1.6, 0], dist: 12, yaw: -18, pitch: 18, dim: 0.35 }   # the Light Conversion slide's pose: the world rests there under the clip
---

<VideoPlayer src="vu_ff_unzoom.mp4" advance-on-end />

<!--
Kalbėtojui. „…ir atgal“: įžangos nutolinimas atbulai, pagreitintas iki 0:30, be garso — nuo mūsų galaktikos pro Žemę ir Lietuvą atgal į Saulėtekį, į VU Fizikos fakultetą. Kalbėti per klipą. Spausti nereikia: klipui pasibaigus, skaidrės pačios pereina į kitą (įmonių skaidrę); paspaudus anksčiau, pereinama iš karto. Savaime pereinama tik auditorijos lange, ne /presenter.
Sakyti (per klipą): „O dabar grįžtame nuo galaktikos iki Saulėtekio, kur pradėjome, ir prie to, kaip su CERN gali dirbti Lietuvos įmonės.“
(klipas 0:30; ~0,5 min)
-->

---
space: { at: [118.5, -1.6, 0], dist: 12, yaw: -18, pitch: 18, dim: 0.35 }   # one Lithuanian firm; a StagePhoto stands here once the firm sends a photo
---

<!-- facts: lt-lightcon, light-conversion-vu-spinoff -->

<!--
Kalbėtojui. Viena Lietuvos įmonė, kuri jau laimėjo CERN konkursą — prieš kvietimą veikti.
Sakyti: „Vienas pavyzdys. „Light Conversion“ 1994 m. atsiskyrė nuo Vilniaus universiteto. 2021 m. ji laimėjo atvirą CERN konkursą: jos lazeris PHAROS buvo pasirinktas CERN greitintuvui CLEAR — jis išmuša elektronus, iš kurių greitintuve formuojamas pluoštas. Šiandien įmonė turi daugiau nei 800 darbuotojų ir pasaulyje įdiegusi daugiau nei 10 000 savo sistemų.“
Faktai: konkursas — 2021 m. birželis (atitiko specifikaciją, pasiūlė geresnę kainą); PHAROS su ultravioletine harmonika — CLEAR fotoinžektoriaus lazeris. CERN skaidrė (M. Martinez Calderon, SY-STI-LP, 2022 10 06): „Light Conversion PHAROS system already installed and tested at CLEAR laser-lab“. Ar jis tebeveikia 2026 m., nepatvirtinta — nesakyti „dabar“.
Vaizdas: kol kas pasaulis (auksinis žinių perdavimo branduolys). Kai įmonė atsiųs nuotrauką su leidimu, ji stovės čia kaip StagePhoto.
Šaltiniai: lightcon.com/news/pharos-will-generate-electron-beams-for-linear-electron-accelerator-at-cern-laboratory/; indico.cern.ch/event/1203308 (Run2c UV beamline, AWAKE); lightcon.com/about-us/.
(~0,5 min)
-->

---
space: { at: kt, dist: 18, yaw: 160, pitch: 14, dim: 0.45 }
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
layout: statement
space: { at: wide }   # the pentaquark whole
---

<!--
Kalbėtojui. Kamera nuskrenda prie pentakvarko — penkių kvarkų dalelės, kurią 2015 m. atrado LHCb; ilgiausias skrydis (~4,5 s). Pentakvarkas išsibarsto ir vėl susirenka; „c“ — dar kartą.
Sakyti: „Žiniatinklis, jutiklinis ekranas ir spalvotas rentgenas atsirado iš problemų, kurias fizikams iškėlė klausimas, iš ko sudarytas pasaulis. FCC iškels naujų problemų. Jei jūsų įmonė nori tiekti CERN, užsiregistruokite CERN tiekėjų portale ir parašykite Inovacijų agentūros specialistei, kuri rūpinasi įmonių bendradarbiavimu su CERN. Ačiū, laukiu klausimų.“
Nuorodos (pasakyti, ekrane jų nėra): lhcb-vilnius.web.cern.ch — mūsų grupė; kt.cern — CERN žinių perdavimas; business-with-cern.web.cern.ch — kaip tapti CERN tiekėju.
Laikas: skirta ~25 min ar daugiau (savininkas, 2026 10 08). Trukmė: kalba ~17,5 min; klipai — įžanginis 4:26, grįžimas („…ir atgal“) 0:30, CERN iš oro 0:11 ir LHCb animacija 0:56 (kalbama per juos); iš viso apie 22 min. Paslėpta skaidrė po šios (Geant4, ROOT, Zenodo ir kt.) — tik paklausus.
(~0,4 min)
-->

---
hide: true
space: { at: web, dist: 21, yaw: 95, pitch: 40, dim: 0.5 }
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
