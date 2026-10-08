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
  sound: true
  # deeper than the blue palette's own look: a black ground (fewer, dimmer dust
  # grains, little nebula, a firmer vignette), no film grain, no fringes
  options: { nebula: 0.12, grain: 0.012, aberration: 0, bloom: 0.55, density: 0.6, dustGain: 1.45, vignette: 0.42 }
title: Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje
info: |
  Innoday 2026, in Lithuanian. One story: to see what the world is made of,
  physicists needed a machine nobody could buy; each of its problems had to be
  solved from scratch, and the solutions left the laboratory as things in daily
  use; the next machine is being designed now, and Lithuanian firms can solve
  its problems. Prologue: the zoom-out from the VU Faculty of Physics to our
  galaxy, whose last frame becomes the world's grains (<WebTakeover>), and the
  question. Part I the machine: what it found (Higgs, LHCb, the pentaquark),
  then the limits it had to pass. Part II one slide per problem and what it
  gave: in your pocket (touchscreen, web), in hospitals (PET, colour X-ray,
  Moon, hadron therapy), in industry today (data, cold). Part III back to the
  private sector: how technology leaves CERN, what it does for suppliers, the
  next machine, Lithuania, what a firm can do. Photographs are full bleed
  (`.hero`); slides carry a few words, the notes carry what is said. Toolkit:
  slidev-videos 12aa015. Keys on a video slide: p play/pause,
  + / - volume; `c` builds what stands where the camera is again.
layout: cover
space:
  at: wide
---

# Innoday 2026

# Nuo Vilniaus iki visatos pakraščių

## ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nc">LHCb</span> Vilnius · Vilniaus universitetas</div>

<!--
Kalbėtojui. Prieš pradedant paspausti bet kurį klavišą arba spustelėti, kad galėtų skambėti foninis garsas (naršyklė garsą įjungia tik po naudotojo veiksmo). Už pavadinimo iš dulkių susirenka penki kvarkai — pentakvarkas, prie kurio grįšime I dalyje; „c“ jį surenka iš naujo. Kol ši skaidrė rodoma, grotuvas iš anksto įkelia pirmąjį klipą.
Sakyti: „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei, kuri dirba CERN LHCb eksperimente. Pradėsime nuo Saulėtekio.“
(~0,5 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0 }   # the takeover's pose: the next slide stands exactly here
---

<VideoPlayer src="vu_ff_zoom_galaxy.mp4" transition="fade" advance-on-end />

<!--
Kalbėtojui. Nutolinimas nuo VU Fizikos fakulteto ir NFTMC pastato Saulėtekyje: Vilnius, Lietuva, Žemė, mūsų galaktika. Klipas baigiasi mūsų galaktika iš šono (paskutinės 16 s, kuriose vaizdas užgęsta, nukirptos). Galima tylėti arba trumpai įvardyti etapus. Jei laiko mažai, klipą trumpinti manifeste (trim).
Spausti nereikia: klipui pasibaigus, skaidrės pačios pereina į kitą, kuri prasideda nuo to paties paskutinio kadro ir paverčia jį pasaulio grūdeliais. Paspaudus klipo metu, pereinama anksčiau (tada klipo pabaiga nieko nebedaro). Savaime pereinama tik auditorijos lange, ne /presenter.
(klipas 4:26, su savo garso takeliu)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }
---

<WebTakeover />

<!--
Kalbėtojui. Skaidrė prasideda nuo paskutinio klipo kadro, todėl perėjimo nesimato. Po pusės sekundės tamsa tolygiai pereina į pasaulio foną, o šviesios vietos subyra į grūdelius. Kiekvienas grūdelis stovi savo pikselio regėjimo linijoje, todėl, kol kamera nejuda, grūdeliai sudaro tą patį vaizdą; kitoje skaidrėje kamera pajuda ir paaiškėja, kad vaizdas turi gylį.
Sakyti (kol byra): „Mūsų galaktika iš šono: šimtai milijardų žvaigždžių. Kiekvienas šio vaizdo taškas dabar tampa dalele.“
Techniškai: kadras — public/figures/opener_last.jpg, išsitrauktas komanda pnpm takeover:frame public/videos/<klipas>.mp4. Kai bus orbitinis klipas iki kosminio tinklo, kartoti su juo ir pakeisti Sakyti: „Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų.“
(~0,3 min)
-->

---
space: { at: [30, 40, -82], dist: 26, yaw: 28, pitch: 14, sway: 6, dim: 0.15 }   # round the picture the frame became: gently, or the strands read as streaks
---

<div class="world-caption narrow">

<p class="kicker">Klausimas</p>

# Iš ko visa tai sudaryta?

</div>

<!--
Kalbėtojui. Kamera apskrieja grūdelius, kuriais ką tik virto paskutinis kadras: plokščias vaizdas pasirodo esąs erdvė. Šis klausimas — visos kalbos pradžia; kitos skaidrės į jį atsako ir parodo, ką atsakymo paieškos davė.
Sakyti: „Žvaigždės, dujos, planetos ir mes patys sudaryti iš kelių rūšių dalelių. Norint pamatyti, kas yra jų viduje, daleles reikia sudaužyti labai didele energija. Tam reikia didžiausio pasaulyje dalelių greitintuvo. Jį pastatė CERN, Europos dalelių fizikos laboratorija prie Ženevos.“
Pastaba: „žvaigždės, dujos, planetos ir mes“ — tyčia ne „galaktikos“: didžioji galaktikų masės dalis yra tamsioji materija, kurios sudėties nežinome.
(~0,4 min)
-->

---
layout: section
space: { at: [12.5, -3.4, 0], dist: 19, yaw: -30, pitch: 24, dim: 0.4 }
---

# I dalis

Mašina

<!--
Kalbėtojui. Sakyti: „CERN ir Didysis hadronų greitintuvas.“ Pasaulyje — greitintuvo žiedas: du protonų paketai skrieja priešingomis kryptimis ir susitinka du kartus per ratą; iš kiekvieno susitikimo taško sklinda dalelių pėdsakai.
(~0,2 min)
-->

---
space: { at: [20, 5, -12], dist: 18, yaw: -30, pitch: 14 }
---

<VideoPlayer src="cern_overview_short.mp4" />

<!--
Kalbėtojui. CERN iš paukščio skrydžio: Ženevos priemiestis, Prancūzijos ir Šveicarijos pasienis. Klipas trumpas (0:11) — kalbėti per jį ir po jo.
Sakyti: „Tai CERN. Jį 1954 m. įkūrė 12 Europos valstybių, kad po karo galėtų kartu tirti, iš ko sudarytas pasaulis. Šiandien jis turi 25 valstybes nares ir 11 asocijuotųjų narių, tarp jų Lietuvą. Su CERN dirba daugiau nei 12 000 mokslininkų iš daugiau nei 110 šalių. Po šiais laukais, apie 100 m gylyje, yra 27 km ilgio greitintuvo žiedas.“
Faktai: konvencija pasirašyta 1953 m., CERN oficialiai įsteigtas 1954 m. rugsėjo 29 d. Steigėjos — Belgija, Danija, Prancūzija, VFR, Graikija, Italija, Nyderlandai, Norvegija, Švedija, Šveicarija, JK, Jugoslavija. Naujausios narės — Estija (2024) ir Slovėnija (2025). Asocijuotosios narės (11): Brazilija, Čilė, Kroatija, Kipras (parengiamasis etapas), Indija, Airija, Latvija, Lietuva, Pakistanas, Turkija, Ukraina. Apie 2 500 darbuotojų, 12 639 registruoti naudotojai (2025). 2026 m. biudžeto įnašai — apie 1,28 mlrd. CHF.
Šaltiniai: home.cern/about/who-we-are/our-history; home.cern/about/who-we-are/member-states; usersoffice.web.cern.ch (2025 m. statistika); fap-dep.web.cern.ch (2026 m. įnašai).
(klipas 0:11; kalbos ~0,5 min)
-->

---
space: { at: collider, dist: 20, yaw: 40, pitch: 30, dim: 0 }
---

<div class="hero right" style="--focus: 30% 50%">
<img src="/figures/hero_higgs.jpg" alt="CMS detektoriaus įvykis: Higso bozono kandidatas, skylantis į du elektronus ir du miuonus" />
<div class="hero-text">
<p class="kicker">Ką mašina rado</p>
<div class="year blue">2012</div>
<h1>Higso bozonas</h1>
<p class="line">2013 m. Nobelio premija</p>
</div>
<div class="credit">Higso bozono kandidatas CMS detektoriuje, 2012 · CMS Collaboration / CERN, CC BY-SA 4.0</div>
</div>

<!--
Kalbėtojui. Pirmasis atsakymas į klausimą, iš ko viskas sudaryta.
Sakyti: „Garsiausias šio greitintuvo atradimas — Higso bozonas. 1964 m. buvo pasiūlytas mechanizmas, kuris paaiškina, kodėl elementariosios dalelės turi masę, ir pagal jį turėjo egzistuoti ši dalelė. Jos ieškota beveik pusę amžiaus. 2012 m. liepos 4 d. ją vienu metu paskelbė du CERN eksperimentai, ATLAS ir CMS. Kitais metais François Englert'as ir Peteris Higgsas gavo Nobelio premiją. Nuotraukoje — vienas iš tų susidūrimų CMS detektoriuje.“
Nuotraukoje: 2012 m. gegužės 27 d. CMS įvykis, Higso bozono kandidatas H → ZZ → 2e2μ. Nobelio premijos formuluotėje paminėti ATLAS ir CMS eksperimentai.
Šaltinis: home.cern (Nobelio premija 2013 10 08); cds.cern.ch/images/CMS-PHO-EVENTS-2012-007-1.
(~0,6 min)
-->

---
space: { at: [56, 5, -14], dist: 16, yaw: -28, pitch: 12 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" />

<!--
Kalbėtojui. LHCb detektoriaus 3D animacija (CERN-FOOTAGE-2022-042-001), be garso — kalbėti per ją.
Sakyti: „Mūsų eksperimentas — LHCb. Jis, be kita ko, tiria, kodėl Visatoje liko materija. Didysis sprogimas turėjo sukurti po lygiai materijos ir antimaterijos, o susitikusios jos viena kitą sunaikina, tačiau materijos liko. Todėl LHCb lygina, kaip skyla dalelės ir jų antidalelės, ir ieško mažyčių skirtumų. Detektorius 21 m ilgio ir stovi tik vienoje susidūrimo taško pusėje, nes jį dominančios dalelės dažniausiai išlekia pirmyn, arti pluošto. Arčiausiai pluošto, vos 5 mm nuo jo, stovi VELO pikselių detektorius. Vilniaus universitetas yra LHCb kolaboracijos narys nuo 2024 m.“
Jei klausia apie rezultatus: 2025 m. LHCb pirmą kartą pamatė materijos ir antimaterijos elgesio skirtumą barionuose — dalelių šeimoje, kuriai priklauso protonai ir neutronai (>80 000 Λb⁰ → p K⁻ π⁺ π⁻ skilimų, asimetrija (2,45 ± 0,47) %, 5,2σ; Nature 2025 07 16). Standartinio modelio CP pažeidimo nepakanka stebimam materijos pertekliui paaiškinti (barionų ir fotonų santykis ~10⁻¹⁰, SM numato ~10⁻¹⁸).
Faktai: LHCb sveria 5 600 t, 21 × 10 × 13 m, 100 m po žeme; artimiausias VELO pikselis — 5,1 mm nuo pluošto; kolaboracijoje beveik 2 000 narių. VU priimtas 2024 m. rugsėjo 2 d. LHCb kolaboracijos tarybos sprendimu; grupė dirba VU FF Fotonikos ir nanotechnologijų institute (lhcb-vilnius.web.cern.ch). 2026 m. rugsėjo 14–18 d. LHCb savaitė pirmą kartą vyko Vilniuje (~200 dalyvių vietoje).
Šaltinis: home.cern/science/experiments/lhcb; VU FF naujienos, 2024 09 16.
(klipas 0:56; kalbos ~1 min)
-->

---
space: { at: [-29.5, 0.2, 0], dist: 11, yaw: -10, pitch: 6, dim: 0.15 }
---

<div class="payoff">
<p class="kicker"><span class="nc">LHCb</span> · 2015 m. pentakvarkas</p>
<div class="big blue">76<span class="unit">iš 86</span></div>
<h1>naujų LHC hadronų atrado <span class="nc">LHCb</span></h1>
<p>Vienas jų — pentakvarkas, dalelė iš penkių kvarkų.</p>
</div>

<div class="src">LHCb, PRL 115 (2015) 072001 · P. Koppenburg, New particles discovered at the LHC (2026 09 21)</div>

<!--
Kalbėtojui. Kamera grįžta prie pentakvarko, kurį matėme pradžioje; „c“ surenka jį iš naujo.
Sakyti: „Penki šviesos kamuoliukai, kuriuos matėte pradžioje, yra dalelė iš penkių kvarkų. Kai 1964 m. Gell-Mannas ir Zweigas pasiūlė kvarkų modelį, jau buvo aišku, kad tokios dalelės gali egzistuoti. Jų ieškota daugiau nei 50 metų. 2015 m. jas aptiko LHCb. Pentakvarkai — tarp 86 naujų dalelių, atrastų prie šio greitintuvo; 76 iš jų atrado LHCb.“
Jei klausia: c c̄ u u d; 2015 m. liepos 14 d., Λb skilimuose; 2019 m., turint devynis kartus daugiau duomenų, paaiškėjo, kad tai kelios siauros būsenos — galbūt „molekulės“ iš bariono ir mezono. Rūta Racz, pirmoji VU doktorantė LHCb, ieško naujų pentakvarkų.
Skaičius: Koppenburgo sąraše „86 hadrons have been discovered at the LHC, of which 76 by LHCb“ (paskutinis įrašas 2026 09 21, Bs0*(5700)0).
(~0,6 min)
-->

---
space: { at: collider, dist: 11, yaw: -48, pitch: 9, dim: 0 }
---

<div class="hero frame">
<img src="/figures/hero_tunnel.jpg" alt="LHC tunelis su mėlynais dipoliniais magnetais" />
<div class="credit">LHC tunelis · Nuotr. Samuel Joseph Hertzog / CERN, CC BY 4.0</div>
</div>

<div class="head">

# Didysis hadronų greitintuvas

</div>

<div class="stats">
<div class="stat"><div class="n">26,7<small>km</small></div><p class="l">žiedas 100 m po žeme</p></div>
<div class="stat"><div class="n">−271,3<small>°C</small></div><p class="l">magnetai šaltesni nei erdvė tarp galaktikų</p></div>
<div class="stat"><div class="n">2,85<small>m/s</small></div><p class="l">tiek protonai lėtesni už šviesą</p></div>
<div class="stat"><div class="n">1,5<small>mlrd.</small></div><p class="l">susidūrimų per sekundę</p></div>
</div>

<div class="src">home.cern: The Large Hadron Collider · 3-iojo darbo etapo (2022–2026) parametrai</div>

<!--
Kalbėtojui. Čia kalba pasisuka: nuo to, ką mašina rado, prie to, ko ji pareikalavo. Šie skaičiai — II dalies problemos.
Sakyti: „Kad šie atradimai būtų įmanomi, greitintuvas turėjo būti toks. Jo žiedas yra 27 km ilgio ir 100 m po žeme. 1 232 superlaidūs magnetai atšaldomi iki 1,9 kelvino, šalčiau nei erdvė tarp galaktikų. Protonai skrieja tik 2,85 m/s lėčiau už šviesą ir per sekundę apsuka žiedą 11 245 kartus, o kiekvieną sekundę įvyksta apie pusantro milijardo susidūrimų, kuriuos reikia pamatyti ir užrašyti. Nė vieno iš šių dalykų nebuvo galima nusipirkti. Su tokiomis problemomis susidūrė ir ankstesnės CERN mašinos.“
Svarbu: nuo 2026 06 29 LHC neveikia — prasidėjo trečioji ilgoji techninė pertrauka (LS3), todėl skaičiai — darbo metu (3-iasis darbo etapas: 6,8 TeV, 99,99999905 % šviesos greičio). Dažnai cituojamas „99,9999991 %“ atitinka projektinę 7 TeV energiją. Kosminis fonas — 2,7 K.
Faktai: 9 593 magnetai; vakuumas vamzdyje ~10⁻¹³ bar; pluošte sukaupta energija iki 490 MJ.
Šaltinis: home.cern/science/accelerators/large-hadron-collider.
(~0,9 min)
-->

---
space: { at: collider, dist: 26, yaw: 24, pitch: 58, dim: 0.3 }
---

<div class="readout">

<p class="kicker"><span class="nc">LHCb</span> · nuo 2022 m.</p>

<div class="big"><Count :from="0" :to="4" :ms="1600" /><span class="unit">TB/s</span></div>

Tiek duomenų kas sekundę pagamina detektorius. Pirmąją atranką atlieka vaizdo plokštės, kokios yra žaidimų kompiuteriuose.

</div>

<div class="src">LHCb, The LHCb Upgrade I, arXiv:2305.10515 · CERN EP Newsletter: LHCb adopts GPUs for the Run 3 trigger (2020)</div>

<!--
Kalbėtojui. Viena iš tų problemų — mūsų eksperimento šiandien.
Sakyti: „Mūsų eksperimento problema šiandien — duomenys. LHCb detektorius kas sekundę pagamina apie 4 terabaitus. Tiek užrašyti neįmanoma, todėl reikia iš karto nuspręsti, ką pasilikti. Nuo 2022 m. tai daro vaizdo plokštės, iš esmės tokios pat kaip žaidimų kompiuteriuose. LHCb — pirmasis eksperimentas, kurio visa pirmoji atrankos pakopa veikia vaizdo plokštėse. Į diską patenka maždaug vienas baitas iš keturių šimtų. Dabar pažiūrėkime, kas per penkiasdešimt metų atsirado sprendžiant ankstesnių CERN mašinų problemas.“
Faktai: GPU — NVIDIA RTX A5000 (profesionali žaidimų lusto versija); vietų ~500, bazinei HLT1 reikia ~200; antroji pakopa — >3 000 serverių; į diską ~10 GB/s.
Jei klausia apie atviruosius duomenis: visus 2011–2012 m. LHCb duomenis (800 TB) viešam naudojimui parengė kalbėtojas; nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, nuo 2026 m. kovo per internetinę paslaugą — ir antrojo etapo duomenis (kartu >4 PB).
(~0,7 min)
-->

---
layout: section
space: { at: [84.2, -2.2, 0], dist: 13, yaw: -22, pitch: 16, dim: 0.08 }
---

# II dalis

Sprendimai

<!--
Kalbėtojui. Pasaulyje — tinklas: mazgai, sujungti tekančių grūdelių gijomis. Kiekviena šios dalies skaidrė prasideda problema (ji parašyta viršuje) ir baigiasi tuo, kas iš jos išėjo į pasaulį. Tvarka: kas yra jūsų kišenėje, kas yra ligoninėse, kas vyksta pramonėje šiandien.
Sakyti: „Šešios problemos: kaip valdyti mašiną, kaip tvarkyti informaciją, kaip pamatyti dalelę, kaip nukreipti pluoštą, kur dėti duomenis ir kaip atšaldyti. Iš kiekvienos atsirado kas nors, kas šiandien naudojama už CERN ribų. Pradėsiu nuo to, ką turite kišenėje.“
(Jutiklinio ekrano nevadinti CERN išradimu: CERN buvo vienas pirmųjų, ne pirmasis — žr. jo skaidrę.)
(~0,4 min)
-->

---
space: { at: web, dist: 15, yaw: 46, pitch: 18, dim: 0 }
---

<div class="hero low deep" style="--focus: 50% 30%">
<img src="/figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" />
<div class="hero-text">
<p class="kicker gold">Problema: valdymas</p>
<div class="year">1973</div>
<h1>Jutiklinis ekranas</h1>
<p class="line">2025 m. parduota <b>1,26 mlrd.</b> išmaniųjų telefonų</p>
</div>
<div class="credit">Bentas Stumpe su jutiklinio ekrano plokšte, 2016 · Nuotr. Sophia Elizabeth Bennett / CERN, CC BY 4.0</div>
</div>

<!--
Kalbėtojui.
Sakyti: „Naujajam SPS greitintuvui valdyti reikėjo tiek mygtukų ir rankenėlių, kad jie netilpo į pultus. 1972 m. CERN inžinierius Bentas Stumpe pasiūlė ekraną, kurio mygtukai yra programuojami ir kurį tereikia paliesti pirštu. Kartu su Franku Becku jis sukūrė skaidrų talpinį jutiklinį ekraną. Vario linijos ant stiklo buvo 80 mikrometrų pločio, todėl jų nesimatė. Ekranai naudoti nuo 1973 m., o kai 1976 m. SPS pradėjo veikti, jo valdymo pultuose jie jau buvo. Nuotraukoje — Stumpe su savo ekrano plokšte ir išmaniuoju telefonu.“
Sąžiningai: tai vienas pirmųjų talpinių jutiklinių ekranų pasaulyje, ne pirmasis — pirmąjį aprašė E. A. Johnsonas (JK) 1965 m. CERN Courier CERN ekraną vadina „apparently the first application of the capacitative touch screen in the world“ ir šiuolaikinių telefonų ekranų pirmtaku — tai CERN požiūris, tiesioginė technologijų linija iki išmaniųjų telefonų neįrodyta.
Istorija: pasiūlymas ranka parašytas 1972 m. kovo 11 d. Stumpe atsisakė pasirašyti konfidencialumo sutartį dėl vėlesnio X–Y ekrano, nes CERN išradimus skelbia viešai.
Šaltiniai: cerncourier.com/?p=9153; repository.cern/records/xrg56-9ha60; IDC (2026 01 13).
(~0,8 min)
-->

---
space: { at: web, dist: 15, yaw: 14, pitch: 16, dim: 0 }
---

<div class="hero page" style="--focus: 50% 0%">
<img src="/figures/hero_proposal.jpg" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" />
<div class="hero-text">
<p class="kicker gold">Problema: informacija</p>
<div class="year">1989</div>
<h1>„Vague but exciting…“</h1>
<p class="line">„Miglota, bet įdomu…“</p>
</div>
<div class="credit">T. Bernerso-Lee pasiūlymas su M. Sendallo pastaba, CERN ekspozicija · Nuotr. Sailko, CC BY 3.0</div>
</div>

<!--
Kalbėtojui.
Sakyti: „CERN dirba tūkstančiai žmonių, kurie atvyksta vidutiniškai dvejiems metams ir išvyksta, o jų žinios pasimeta. 1989 m. kovą CERN programuotojas Timas Bernersas-Lee pasiūlė, kaip tą informaciją sujungti. Jo pasiūlymo įžanga prasideda klausimu apie būsimąjį LHC: kaip susigaudyti tokiame dideliame projekte? Vadovas Mike'as Sendallas ant pirmojo puslapio užrašė tris žodžius: „Vague but exciting…“ — „Miglota, bet įdomu…“ Iš to pasiūlymo atsirado pasaulinis žiniatinklis.“
Pasiūlymo įžanga: daugelis diskusijų apie CERN ateitį ir LHC erą baigiasi klausimu „Yes, but how will we ever keep track of such a large project?“ 1990 m. lapkričio 12 d. formaliame projekto pasiūlyme (su Robert'u Cailliau) prašyta 4 programinės įrangos inžinierių ir programuotojo maždaug pusmečiui.
Šaltiniai: w3.org/History/1989/proposal.html; w3.org/Proposal.html.
(~0,7 min)
-->

---
space: { at: web, dist: 15, yaw: 30, pitch: 14, dim: 0 }
---

<div class="hero right" style="--focus: 35% 55%">
<img src="/figures/hero_next.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" />
<div class="hero-text">
<p class="kicker gold">Problema: informacija</p>
<div class="year">1993</div>
<h1>CERN atsisakė teisių į žiniatinklį</h1>
<p class="line">Šiandien <b>~1,5 mlrd.</b> svetainių ir <b>~6 mlrd.</b> žmonių internete</p>
</div>
<div class="credit">Pirmasis žiniatinklio serveris, CERN, 1990 · Nuotr. Patrice Loïez / CERN, CC BY-SA 4.0</div>
</div>

<!--
Kalbėtojui.
Sakyti: „1990 m. pabaigoje šis NeXT kompiuteris tapo pirmuoju žiniatinklio serveriu, info.cern.ch. Ant jo lipdukas: „Šis kompiuteris — serveris, NEIŠJUNGTI!!“ Išjungus jį, būtų išjungtas visas tuometinis žiniatinklis. 1993 m. balandžio 30 d. CERN atsisakė visų teisių į žiniatinklio programinę įrangą, ir ja galėjo naudotis bet kas. Todėl žiniatinklis paplito: šiandien yra beveik pusantro milijardo svetainių, o internetu naudojasi apie 6 milijardai žmonių.“
Nesakyti „CERN išrado internetą“: internetas egzistavo anksčiau; CERN sukūrė žiniatinklį (WWW), veikiantį internete.
Faktai: pirmasis viešas paskelbimas — 1991 08 06 alt.hypertext grupėje; pirmasis serveris už Europos ribų — 1991 12 12, SLAC. 1994 m. pabaigoje — 10 000 serverių, 10 mln. naudotojų. Netcraft, 2026 m. liepa: 1 494 915 628 svetainės; ITU: ~6 mlrd. žmonių (74 %) internete 2025 m.
Šaltiniai: home.cern/science/computing/the-birth-of-the-web/; netcraft.com (2026 07); itu.int.
(~0,7 min)
-->

---
space: { at: web, dist: 15, yaw: -2, pitch: 12, dim: 0 }
---

<div class="hero" style="--focus: 60% 50%">
<img src="/figures/hero_pet.jpg" alt="Šiuolaikinis PET/KT skeneris ligoninės kabinete" />
<div class="hero-text">
<p class="kicker gold">Problema: pamatyti dalelę</p>
<div class="year">1977</div>
<h1>PET tomografija</h1>
<p class="line">2000 m. TIME PET/KT skenerį paskelbė metų medicinos išradimu</p>
</div>
<div class="credit">Šiuolaikinis PET/KT skeneris, CERMEP, Lionas · Nuotr. Romainbehar, CC0</div>
</div>

<!--
Kalbėtojui. Iš kišenės — į ligoninę.
Sakyti: „Dalelių fizikai visą laiką kuria detektorius, kurie pamato vieną dalelę. Tokie detektoriai tinka ir medicinai. PET tomografija parodo, kur organizme ypač aktyvi medžiagų apykaita, pavyzdžiui, kur auga navikas. 1977 m. vasarą CERN fizikas Alanas Jeavonsas su savo detektoriumi ir Davidas Townsendas su vaizdų rekonstrukcijos programa gavo pirmąjį CERN PET vaizdą. Vėliau Townsendas su Ronu Nuttu JAV sujungė PET su kompiuterine tomografija, o žurnalas TIME PET/KT skenerį paskelbė 2000 m. medicinos išradimu. Šiandien tai kasdienė onkologų priemonė.“
Sąžiningai — CERN pats rašo: „PET was not invented at CERN, but the work carried out by Jeavons and Townsend made a major contribution to its development.“
Faktai: pirmasis CERN PET vaizdas — pelės; Townsendas dirbo Ženevos kantono ligoninėje, vėliau Pitsburgo universitete. PET/KT kūrimas finansuotas nuo 1995 m., pirmieji klinikiniai vaizdai 1998 m., pirmasis komercinis Siemens Biograph — 2001 m.; iki 2005 m. — >1 000 PET/KT skenerių.
Šaltiniai: kt.cern/?p=1341; cerncourier.com/a/pet-and-ct-a-perfect-fit/; Siemens Healthineers.
(~0,7 min)
-->

---
space: { at: web, dist: 15, yaw: -34, pitch: 18, dim: 0 }
---

<div class="hero right" style="--focus: 40% 50%">
<img src="/figures/hero_mars.jpg" alt="Spalvotas 3D žmogaus riešo rentgeno vaizdas: kaulai balti, minkštieji audiniai raudoni, metaliniai varžtai mėlyni" />
<div class="hero-text">
<p class="kicker gold">Problema: pamatyti dalelę</p>
<div class="year">2026</div>
<h1>Spalvotas rentgenas</h1>
<p class="line">JAV FDA leido naudoti skenerį su <b>CERN Medipix3</b> lustu</p>
</div>
<div class="credit">Spalvotas 3D riešo vaizdas (Medipix3) · MARS Bioimaging Ltd</div>
</div>

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
space: { at: web, dist: 16, yaw: -18, pitch: 14, dim: 0 }
---

<div class="hero" style="--focus: 50% 40%">
<img src="/figures/hero_artemis.jpg" alt="NASA Artemis II raketa SLS kyla iš paleidimo aikštelės" />
<div class="hero-text">
<p class="kicker gold">Problema: pamatyti dalelę</p>
<div class="year">2026</div>
<h1>Aplink Mėnulį</h1>
<p class="line">6 CERN Timepix lustai matavo radiaciją įgulos kapsulėje</p>
</div>
<div class="credit">Artemis II startas, 2026 04 01 · Nuotr. NASA / Michael DeMocker</div>
</div>

<!--
Kalbėtojui. Ta pati lustų šeima.
Sakyti: „Ta pati lustų šeima šį balandį skrido aplink Mėnulį. Šeši CERN Timepix lustai Artemis II Orion kapsulėje realiuoju laiku matavo, kiek radiacijos gauna įgula. Modulius pagamino Prahos įmonė ADVACAM, kuri išaugo iš šios CERN technologijos.“
Artemis II — pirmoji pilotuojama kelionė link Mėnulio nuo 1972 m. (startas 2026 04 02, 00:35 CEST; nusileido 04 10). Timepix lustai TKS naudojami nuo 2012 m.; Timepix (NASA HERA) skrido ir 2022 m. nepilotuojamame Artemis I. ADVACAM — Praha, įkurta 2013 m.
(~0,4 min)
-->

---
space: { at: web, dist: 16, yaw: 62, pitch: 22, dim: 0 }
---

<div class="hero" style="--focus: 50% 50%">
<img src="/figures/hero_hadron.jpg" alt="Hadronų terapijos centro sinchrotronas" />
<div class="hero-text">
<p class="kicker gold">Problema: pluošto nukreipimas</p>
<div class="year">9 000+</div>
<h1>Hadronų terapija</h1>
<p class="line">pacientų gydyta CNAO ir MedAustron centruose</p>
</div>
<div class="credit">MedAustron sinchrotronas, Vyner Noištatas (Austrija) · © CERN</div>
</div>

<!--
Kalbėtojui.
Sakyti: „Greitintuvais dalelių pluoštą galima nukreipti labai tiksliai. Protonai ir anglies jonai didžiąją energijos dalį atiduoda tam tikrame gylyje, todėl jais galima paveikti naviką ir mažiau pažeisti aplinkinius audinius. CERN su partneriais 1996–2000 m. suprojektavo gydymui skirtą sinchrotroną ir projektą paskelbė atvirai. Pagal jį pastatyti du centrai: CNAO Italijoje ir MedAustron Austrijoje. Juose jau gydyta daugiau nei 9 000 pacientų su retais ir sunkiai pagydomais navikais.“
Jei laikas leidžia: „CERN su Lozanos ligonine CHUV ir įmone THERYQ kuria FLASH greitintuvą DEFT: visa spindulinio gydymo dozė per mažiau nei 0,1 s, iki 25 cm gylio. Jis remiasi CERN CLIC technologija.“ Taip pat: CERN-MEDICIS 2025 m. IV ketv. pirmą kartą išsiuntė aktinio-225 pramonei — RayzeBio (2024 m. už 4,1 mlrd. USD įsigijo „Bristol Myers Squibb“).
Faktai: PIMMS (CERN, TERA, MedAustron, Onkologie-2000). CNAO Pavijoje (pirmasis pacientas 2011 m.), iki 2026 m. liepos >6 200 pacientų, vienas iš 8 pasaulio centrų, gydančių ir protonais, ir anglies jonais; MedAustron (pirmasis pacientas 2016 m. gruodį) iki 2025 m. sausio >2 700 pacientų. CERN 2026 m. studija: kartu „beveik 9 000“; su naujausiais centrų duomenimis — >9 000. DEFT: 140 MeV elektronai, 20–30 Gy. PRISMAP (2021–2025): 159 siuntos, 23 radionuklidai, 47 projektai iš 19 šalių.
(~0,7 min)
-->

---
space: { at: web, dist: 18, yaw: 78, pitch: 26, dim: 0 }
---

<div class="hero" style="--focus: 50% 50%">
<img src="/figures/hero_datacentre.jpg" alt="CERN duomenų centro serverių spintos" />
<div class="hero-text">
<p class="kicker gold">Problema: duomenys</p>
<div class="year">1 EB</div>
<h1>Pasaulinis skaičiavimo tinklas</h1>
<p class="line">LHC duomenis apdoroja <b>170</b> centrų <b>42</b> šalyse</p>
</div>
<div class="credit">CERN duomenų centras · Nuotr. Sophia Bennett / CERN, CC BY 4.0</div>
</div>

<!--
Kalbėtojui. Iš ligoninės — į pramonę šiandien.
Sakyti: „2025 m. gruodį CERN saugomų LHC duomenų kiekis peržengė vieną eksabaitą — milijoną terabaitų. Vienas kompiuterių centras tiek neapdoros, todėl LHC duomenis apdoroja pasaulinis tinklas: daugiau nei 170 centrų 42 šalyse. Tūkstančiai greitintuvo įrenginių turi veikti tiksliai vienu metu, todėl CERN sukūrė sistemą White Rabbit, kuri juos sinchronizuoja nanosekundės dalies tikslumu. Šiandien ja naudojasi Frankfurto birža, o Ženevoje — pirmasis Šveicarijos kvantinis tinklas.“
Faktai: dauguma duomenų įrašyta į ~60 000 magnetinių juostų; CERN skaičiavimu, tai tik apie 10 % to, ką reikės saugoti per artimiausius dešimt metų. WLCG: ~1,4 mln. procesorių branduolių, 1,5 EB saugyklos, >2 mln. užduočių per dieną. Lietuva 2005 m. prisidėjo prie BalticGrid projekto. White Rabbit — nuo 2012 m., IEEE 1588-2019; Deutsche Börse — >500 prievadų; kvantinis tinklas — 262 km šviesolaidžių, tarp partnerių ID Quantique ir Rolex.
Jei laikas leidžia: duomenų problema davė ir atvirojo mokslo įrankius — Zenodo, ROOT, Geant4 (paslėpta skaidrė po pabaigos).
(~0,7 min)
-->

---
space: { at: web, dist: 18, yaw: 92, pitch: 30, dim: 0 }
---

<div class="hero right" style="--focus: 50% 50%">
<img src="/figures/hero_cold.jpg" alt="Superlaidi MgB₂ elektros linija bandymų stende" />
<div class="hero-text">
<p class="kicker gold">Problema: šaltis</p>
<div class="year">−271 °C</div>
<h1>Superlaidumas</h1>
<p class="line">superlaidi elektros linija Airbus vandeniliniams lėktuvams</p>
</div>
<div class="credit">Superlaidi MgB₂ linija HL-LHC, SM18 bandymų stendas · Nuotr. Maximilien Brice / © CERN</div>
</div>

<!--
Kalbėtojui. Paskutinis II dalies pavyzdys: technologija, kurią CERN šiandien kuria kartu su įmonėmis.
Sakyti: „LHC magnetai veikia tik atšaldyti beveik iki absoliutaus nulio, todėl superlaidūs kabeliai CERN yra kasdienybė. Su Airbus CERN išbandė 7 m ilgio superlaidžią elektros liniją vandeniliniams lėktuvams, o dabar kuria liniją 2 megavatų varomajai sistemai. Su Europos agentūra „Fusion for Energy“, kuri valdo Europos indėlį į ITER sintezės reaktorių, CERN kartu kuria magnetus iš aukštatemperatūrių superlaidininkų.“
Faktai: SCALE (2022–2024, Airbus UpNext): lanksti REBCO linija, ±2 kA iki 63 K; SAMBA (2025–2026) — Airbus Cryoprop demonstratoriui. F4E pagrindų susitarimas 2025 09 10; bendradarbiavimas nuo 2014 m. Medicinai: GaToroid — superlaidus 12 t gantris vietoj iki 270 t.
(~0,6 min)
-->

---
layout: section
space: { at: [120, -2.4, 0], dist: 14, yaw: -22, pitch: 22, dim: 0.4 }
---

# III dalis

Atgal

<!--
Kalbėtojui. Dalies pavadinimas ištisai: „Atgal — prie mokslo pasiekimų privačiame sektoriuje.“ Pasaulyje — auksinė „sėkla“ ir aplink ją besisukantis mazgų ratas: žinios, išeinančios iš CERN.
Sakyti: „Daugumoje šių pavyzdžių fizikų sprendimą į produktą pavertė įmonė: Siemens — skenerį, MARS — spalvotą rentgeną, ADVACAM — lustų modulius, Airbus — liniją lėktuvui. Pažiūrėkime, kaip tai vyksta ir kodėl tai gali būti Lietuvos įmonė.“
(~0,3 min)
-->

---
space: { at: kt, dist: 17, yaw: 4, pitch: 34, dim: 0.4 }
---

<div class="payoff">
<p class="kicker gold">CERN technologijų perdavimas įmonėms</p>
<div class="big">700+</div>
<h1>sutarčių su partneriais nuo 2011 m.</h1>
<p>Startuoliams 2 % licencinis mokestis, akcijų CERN neima.</p>
</div>

<div class="src">CERN Knowledge Transfer Report 2025 · Technopolis ir CSIL, CERN socioekonominė studija (2026) · WIPO Global Innovation Index 2026</div>

<!--
Kalbėtojui.
Sakyti: „CERN turi žinių perdavimo grupę, kuri rūpinasi licencijomis, bendrais mokslinių tyrimų ir eksperimentinės plėtros projektais ir startuoliais. Nuo 2011 m. ji pasirašė daugiau nei 700 sutarčių, vien 2025 m. — 89; daugumos partneriai yra įmonės. CERN stebi apie šimtą su juo susijusių startuolių. Startuoliams CERN taiko paprastas sąlygas: akcijų neima, o 2 % licencinis mokestis mokamas tik tada, kai metinės pardavimo pajamos pasiekia milijoną frankų. Pasaulinė intelektinės nuosavybės organizacija šiemet šią programą aprašė savo Pasauliniame inovacijų indekse.“
Faktai: 2025 m. — 32 bendri MTEP projektai, 28 licencijos, 15 paslaugų ir konsultavimo sutarčių, 8 startuolių sutartys; 63 partneriai — įmonės. CERN Venture Connect — nuo 2023 m. spalio; 2026 m. spalį: 9 licencijai paruoštos technologijos, 21 startuolis, >50 partnerių; 2025 m. CVC startuoliai pritraukė 5,6 mln. CHF. Licencija — 10 metų, pasaulinė, neišimtinė, viena taikymo sritis.
Atsargiai: „27 su CERN susiję startuoliai pritraukė 3,2 mlrd. CHF“ — 2,4 mlrd. iš jų — vienas Novartis skolos pritraukimas; šio skaičiaus nevartoti. Paties CERN pajamos iš licencijų kuklios (2007–2024 m. vidutiniškai ~1,5 mln. CHF per metus): tikslas — poveikis, o ne honorarai.
(~0,8 min)
-->

---
space: { at: [118.5, -1.6, 0], dist: 13, yaw: -30, pitch: 14, dim: 0.45 }
---

<div class="payoff">
<p class="kicker gold">CERN tiekėjai · 2026 m. tyrimas</p>
<div class="big">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">%</span></div>
<h1>apyvartos augimo per penkerius metus</h1>
<p>palyginti su panašiomis įmonėmis, kurios CERN užsakymo negavo</p>
</div>

<div class="src">Technopolis ir CSIL, CERN socioekonominė studija (2026) · M. Florio, J. Catalano, CERN Courier, 2026 09 17</div>

<!--
Kalbėtojui. Pagrindinis skaičius verslui.
Sakyti: „Nepriklausomas 2026 m. tyrimas palygino įmones, kurios 2016–2024 m. pirmą kartą gavo CERN užsakymą, su panašiomis įmonėmis, kurios jo negavo. Per penkerius metus CERN tiekėjų apyvarta išaugo 14 % daugiau, darbuotojų skaičius — 13 % daugiau, patentų — 15 % daugiau. Daugiau nei pusė tiekėjų dėl darbo su CERN pateko į naujas rinkas. Maždaug trys iš keturių žmonių, išėjusių iš CERN, dirba pramonėje.“
Jei laikas leidžia: „Visos visuomenės mastu CERN rugsėjį paskelbė, kad kiekvienas į didelio šviesio LHC investuotas frankas visuomenei grąžins apie 1,8 franko, net neskaičiuojant galimų atradimų.“ (94 % iš 50 000 modeliavimų rodo teigiamą grąžą; 40 % naudos — žmonės, kuriuos CERN parengė, 38 % — pramonė ir nemokama programinė įranga.)
Faktai: nematerialusis turtas +63 %, materialusis +27 %; 54 % tiekėjų pateko į naujas rinkas, 70 % įgijo pažangių kompetencijų. WIFO (2025): CERN pirkimai kasmet sukuria ~680 mln. CHF pridėtinės vertės. Alumni: „Around three-quarters of CERN alumni move into industry“ (CERN socioekonominė studija, 2026; CERN Alumni Network, 2025 10).
Šaltinis: kt-report-2025.web.cern.ch (CERN-socio-economic-final.pdf); home.cern (2026 06 23; 2026 09 23).
(~0,8 min)
-->

---
space: { at: kt, dist: 22, yaw: 200, pitch: 40, dim: 0 }
---

<div class="hero" style="--focus: 55% 50%">
<img src="/figures/hero_fcc.jpg" alt="Siūlomo 91 km FCC žiedo aplink Ženevą žemėlapis šalia LHC žiedo" />
<div class="hero-text">
<p class="kicker">Kita mašina</p>
<div class="year blue">91 km</div>
<h1>Būsimasis žiedinis greitintuvas</h1>
<p class="line">Sprendimas statyti — apie 2028 m.</p>
</div>
<div class="credit">Būsimojo žiedinio greitintuvo (FCC) trasa · Daniel Dominguez / CERN</div>
</div>

<!--
Kalbėtojui. Kitos mašinos problemos.
Sakyti: „Šių metų birželio 27 d. LHC paskutinį kartą prieš ilgąją pertrauką sukosi protonai; iki 2030 m. jis pertvarkomas, kad duotų iki dešimties kartų daugiau susidūrimų. O gegužę CERN Taryba priėmė Europos dalelių fizikos strategiją: kitu greitintuvu siūlomas 91 km žiedas, Būsimasis žiedinis greitintuvas. Sprendimas jį statyti laukiamas apie 2028 m. Jam reikės naujų magnetų, šaldymo ir vakuumo sistemų. Pernai gruodį pirmą kartą CERN istorijoje privatūs rėmėjai pažadėjo naujam greitintuvui apie 860 mln. eurų.“
Faktai: FCC galimybių studija (2025 03 31): 90,7 km, vidutinis gylis ~200 m, FCC-ee kaina ~15 mlrd. CHF per ~12–15 metų. Strategija priimta 2026 05 22 Budapešte. Datas patvirtinti savininkui: čia 06 27 — paskutinis pluoštas, LHC skaidrėje 06 29 — LS3 pradžia; po ankstesnio tyrimo nepertikrinta. Rėmėjai: Ericas ir Wendy Schmidtai, Johnas Elkannas, Breakthrough Prize fondas, Xavier'as Nielis; pažadai priklauso nuo valstybių narių sprendimo. HL-LHC fizika — nuo 2030 m. birželio iki 2041 m.
Šaltiniai: home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/; council.web.cern.ch (2026 05 22 rezoliucija); home.cern/private-donors-pledge-860-million-euros-cerns-future-circular-collider/; cerncourier.com/a/fcc-feasibility-study-complete/.
(~0,8 min)
-->

---
space: { at: kt, dist: 18, yaw: 120, pitch: 12, dim: 0 }
---

<div class="hero low deep" style="--focus: 50% 30%">
<img src="/figures/hero_lt.jpg" alt="Prezidentas Gitanas Nausėda spaudžia ranką CERN generaliniam direktoriui Markui Thomsonui, už jų CERN, Lietuvos ir ES vėliavos" />
<div class="hero-text">
<p class="kicker gold">Lietuva ir CERN</p>
<div class="year blue">2018</div>
<h1>Asocijuotoji narė</h1>
<p class="line">2026 m. Lietuva kreipėsi dėl <b>visateisės narystės</b></p>
</div>
<div class="credit">Prezidento G. Nausėdos vizitas CERN, 2026 01 19 · Nuotr. Marina Cavazza / CERN</div>
</div>

<!--
Kalbėtojui.
Sakyti: „Lietuva yra asocijuotoji CERN narė nuo 2018 m. sausio, pirmoji iš Baltijos šalių. Todėl lietuviai gali dirbti CERN, o Lietuvos įmonės — dalyvauti jo pirkimuose. Lietuvos mokslininkai dirba CMS ir LHCb eksperimentuose. Šių metų sausį Prezidentas lankėsi CERN, nuotraukoje — su generaliniu direktoriumi Marku Thomsonu. Rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės, ir CERN patvirtino, kad procedūra pradėta. Estija visateise nare tapo 2024 m.“
Faktai: susitarimas pasirašytas 2017 06 27 Vilniuje, įsigaliojo 2018 01 08. Lietuvos įnašas 2026 m. — 1 000 000 CHF (~0,08 % biudžeto); visateisė narystė, LRT vertinimu, kainuotų apie 4 mln. eurų per metus (žurnalistų, ne CERN skaičius). CERN Grey Book (2026 10 07): Lietuva dalyvauja 7 eksperimentuose ir MTEP kolaboracijose — CMS (35 dalyviai, nuo 2007 m.), LHCb (15), DRD3 (11) ir kt. 2026 01 19 tą pačią dieną CERN pasirašė ketinimų memorandumus su „Ekspla“, „Ostaralab“ ir „Sargasas“.
Šaltiniai: home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20, Hamel de Monchenault: „The membership procedure has already started“); home.cern/presidential-visits-cern-0; greybook.cern.ch.
(~0,8 min)
-->

---
space: { at: kt, dist: 18, yaw: 160, pitch: 14, dim: 0.45 }
---

<div class="payoff">
<p class="kicker gold">Lietuvos įmonėms</p>
<div class="big">613<span class="unit">mln. CHF</span></div>
<h1>tiek CERN per metus perka prekių ir paslaugų</h1>
<p>Registracija CERN tiekėjų portale; ryšiai su CERN — per Inovacijų agentūrą.</p>
</div>

<div class="src">CERN pirkimai 2024 · business-with-cern.web.cern.ch · inovacijuagentura.lt</div>

<!--
Kalbėtojui. Kvietimas veikti.
Sakyti: „Lietuvos įmonė gali dirbti su CERN trimis būdais. Pirma, CERN yra klientas: 2024 m. jis pirko prekių ir paslaugų už 613 mln. frankų. Dešimt su viršum Lietuvos įmonių jau tiekia CERN elektroniką, radijo dažnių įrangą, optiką, fotoniką ir mechaniką. Pavyzdžiui, 2021 m. „Light Conversion“ laimėjo atvirą CERN konkursą, ir jos lazeris PHAROS buvo pasirinktas CERN greitintuvui CLEAR. O CERN 2026–2027 m. sąraše Lietuva pažymėta kaip asocijuotoji narė, jau pasiekusi 2026 m. tiekimo užsakymų lubas. Mūsų įmonės šiems metams išnaudojo tai, ką leidžia dabartinis statusas; tai dar viena priežastis siekti visateisės narystės. Antra, FCC: šių metų sausį „Ekspla“, „Ostaralab“ ir „Sargasas“ pasirašė su CERN ketinimų memorandumus dėl FCC technologijų ir tiekimo. Trečia, CERN technologijų licencijos ir bendri projektai. Pirmiausia užsiregistruokite CERN tiekėjų portale ir parašykite Lietuvos pramonės ryšių su CERN pareigūnei Inovacijų agentūroje.“
Light Conversion: 2021 m. birželį laimėjo atvirą CERN konkursą (atitiko specifikaciją, pasiūlė geresnę kainą); PHAROS pasirinktas fotokatodo lazeriu CLEAR greitintuvui (lightcon.com, 2021 06 18). Ar jis tebeveikia 2026 m., nepatvirtinta — nesakyti „dabar“. Nuo 2018 m. CERN iš Lietuvos įmonių pirko už ~2,5 mln. CHF (VU rektorius R. Petrauskas, LRT, 2026 m. birželis).
Faktai: pirkimai nuo 50 000 CHF siunčiami ir nacionaliniams pramonės ryšių pareigūnams; >400 000 CHF — rinkos tyrimas ir konkursas. Paslaugų sutartims Lietuva — „poorly balanced“ (yra vietos). Pramonės ryšių pareigūnė — Aušrinė Krištopaitytė (Inovacijų agentūra). Lietuvos CERN BIC (2019) — ar dar veikia, nepatikrinta; neminėti.
(~1 min)
-->

---
layout: statement
space: { at: close }
---

# Ačiū

<!--
Kalbėtojui. Kamera grįžta ten, kur prasidėjo; ilgiausias skrydis (~4,5 s). Pentakvarkas išsibarsto ir vėl susirenka; „c“ — dar kartą.
Sakyti: „Žiniatinklis, jutiklinis ekranas ir spalvotas rentgenas atsirado iš problemų, kurias fizikams iškėlė klausimas, iš ko sudarytas pasaulis. FCC iškels naujų problemų, o trys Lietuvos įmonės jau pasirašė su CERN memorandumus dėl jo. Ačiū, laukiu klausimų.“
Nuorodos (pasakyti, ekrane jų nėra): lhcb-vilnius.web.cern.ch — mūsų grupė; kt.cern — CERN žinių perdavimas; business-with-cern.web.cern.ch — kaip tapti CERN tiekėju.
Trukmė: kalba ~17,5 min; klipai — įžanginis 4:26, CERN iš oro 0:11, LHCb animacija 0:56 (kalbama per ją); iš viso apie 22 min. Jei skirta 15 min: įžanginį klipą trumpinti iki ~1,5 min (−3), praleisti Higso ir Artemis skaidres (−1), FCC ir +14 % sutrumpinti iki vieno sakinio (−1). Paslėpta skaidrė po šios (Geant4, ROOT, Zenodo ir kt.) — tik paklausus.
(~0,4 min)
-->

---
hide: true
space: { at: web, dist: 21, yaw: 95, pitch: 40, dim: 0.5 }
---

<div class="head">

# Kiti CERN įrankiai

</div>

<div class="tiles">
<div class="card"><p class="k">renginiai</p><h2>Indico</h2></div>
<div class="card"><p class="k">kosmosas · medicina</p><h2>Geant4</h2></div>
<div class="card"><p class="k">didieji duomenys</p><h2>ROOT</h2></div>
<div class="card"><p class="k">atvirasis mokslas</p><h2>Zenodo</h2></div>
<div class="card"><p class="k">privatumas</p><h2>Proton Mail</h2></div>
<div class="card"><p class="k">energija</p><h2>Saulės kolektoriai</h2></div>
<div class="card"><p class="k">atviroji įranga</p><h2>CERN OHL</h2></div>
<div class="card"><p class="k">COVID-19</p><h2>HEV plaučių ventiliatorius</h2></div>
</div>

<div class="src">home.cern · kt.cern · KT Report 2025 · zenodo.org (2026 10 07) · arXiv:2405.12159 · arXiv:2004.00534</div>

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
(~1 min, tik paklausus)
-->
