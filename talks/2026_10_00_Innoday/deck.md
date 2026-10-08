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
  palette: blue
  plugins: [hadron]
  sound: true
  # deeper than the blue palette's own look: a black ground (fewer, dimmer dust
  # grains, little nebula, a firmer vignette), no film grain, no fringes
  options: { nebula: 0.12, grain: 0.012, aberration: 0, bloom: 0.55, density: 0.6, dustGain: 1.45, vignette: 0.42 }
title: Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje
info: |
  Innoday 2026, in Lithuanian. One spine: to see what the universe is made
  of, physicists built a machine that pushed every technology past its limit;
  each limit broken became something in daily use — and Lithuanian firms can
  be in the next round. Prologue: the zoom-out from the NFTMC / VU Faculty of
  Physics to our galaxy, whose last frame becomes the world's grains
  (<WebTakeover>). Part I the machine (CERN, Lithuania, the LHC's extremes,
  what it found, LHCb). Part II the inventions, each the answer to one of the
  machine's problems (detection, information, control, beams, data, cold),
  with the 2025–26 news inside them, ending on a top ten. Part III back to the
  private sector (how transfer works, the evidence, Lithuanian firms, FCC).
  Photographs are full bleed (`.hero`); slides carry a few words and the
  speaker notes carry what is said. Toolkit: slidev-videos feat/broadcast
  efacca2. Keys on a video slide: p play/pause, + / - volume; `c` builds
  what stands where the camera is again.
layout: cover
space:
  at: wide
---

# Innoday 2026

# Nuo Vilniaus iki visatos pakraščių

## ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nc">LHCb</span> Vilnius · Vilniaus universitetas</div>

<!--
Kalbėtojui (~0,5 min). Prieš pradedant paspausti bet kurį klavišą arba spustelėti, kad galėtų skambėti foninis garsas (naršyklė garsą įjungia tik po naudotojo veiksmo).
Už pavadinimo iš dulkių susirenka penki kvarkai: c c̄ u u d — pentakvarkas, LHCb atradimas. Prie jo grįšime I dalyje ir pačioje pabaigoje; „c“ jį surenka iš naujo.
Sakyti: „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei, dirbančiai CERN LHCb eksperimente. Šiandien nukeliausime nuo Saulėtekio iki visatos pakraščių, o tada grįšime atgal — prie dalykų, kuriuos kasdien laikote rankose, ir prie įmonių, kurios iš mokslo daro verslą. O pabaigoje papasakosiu, kodėl Lietuvos įmonės šiemet jau pasiekė CERN užsakymų lubas — ir ką tai reiškia jums.“
Kol ši skaidrė rodoma, grotuvas iš anksto įkelia pirmąjį klipą.
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0 }   # the takeover's pose: the next slide stands exactly here
---

<VideoPlayer src="vu_ff_zoom_galaxy.mp4" transition="fade" />

<!--
Kalbėtojui (4:26, su savo garso takeliu). Nutolinimas nuo VU Fizikos fakulteto / NFTMC pastato Saulėtekyje: Vilnius, Lietuva, Žemė, mūsų galaktika. Klipas baigiasi mūsų galaktika iš šono (paskutinės 16 s, kuriose vaizdas užgęsta, nukirptos). Galima tylėti arba trumpai komentuoti etapus.
Pirmyn spausti tik klipui pasibaigus: kita skaidrė prasideda nuo to paties paskutinio kadro ir paverčia jį pasaulio grūdeliais.
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }
---

<WebTakeover />

<!--
Kalbėtojui (~0,3 min). Skaidrė prasideda nuo to paties paskutinio klipo kadro, todėl perėjimo nesimato. Po pusės sekundės tamsa tolygiai pereina į pasaulio foną, o šviesios vietos subyra į grūdelius. Kiekvienas grūdelis stovi savo pikselio regėjimo linijoje, todėl, kol kamera nejuda, grūdeliai sudaro tą patį vaizdą; kitoje skaidrėje kamera pajuda ir paaiškėja, kad vaizdas turi gylį.
Sakyti (kol byra): „Čia baigiasi mūsų kelionė nuo Saulėtekio: mūsų galaktika iš šono — šimtai milijardų žvaigždžių. O dabar žiūrėkite: kiekvienas šio vaizdo taškas tampa dalele.“
Techniškai: kadras — public/figures/opener_last.jpg, išsitrauktas komanda pnpm takeover:frame public/videos/<klipas>.mp4. Kai bus naujas orbitinis klipas, kartoti su juo ir pakeisti Sakyti: „…Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų — kosminis tinklas.“
-->

---
space: { at: [30, 40, -82], dist: 26, yaw: 28, pitch: 14, sway: 6, dim: 0.15 }   # round the web the frame became: gently, or the strands read as streaks
---

<div class="world-caption narrow">

<p class="kicker">Klausimas</p>

# Iš ko visa tai sudaryta?

</div>

<!--
Kalbėtojui (~0,4 min). Kamera apskrieja grūdelius, kuriais ką tik virto paskutinis kadras: plokščias vaizdas pasirodo esąs erdvė.
Sakyti: „Visa, ką matėme, — žvaigždės, dujos, planetos ir mes patys — sudaryta iš kelių rūšių dalelių. Kad pamatytum, kas yra jų viduje, reikia didžiausio pasaulyje dalelių greitintuvo. Jis stovi prie Ženevos, ir Lietuva yra jo dalis.“
Pastaba: „žvaigždės, dujos, planetos ir mes“ — tyčia ne „galaktikos“: didžioji galaktikų masės dalis yra tamsioji materija, kurios sudėties nežinome.
-->

---
layout: section
space: { at: [12.5, -3.4, 0], dist: 19, yaw: -30, pitch: 24, dim: 0.08 }
---

# I dalis · Mašina

CERN ir Didysis hadronų greitintuvas

<!--
Kalbėtojui (~0,2 min). Pasaulyje — LHC žiedas: du protonų paketai skrieja priešingomis kryptimis ir susitinka du kartus per ratą; iš kiekvieno susitikimo taško sklinda dalelių pėdsakai.
-->

---
space: { at: [20, 5, -12], dist: 18, yaw: -30, pitch: 14 }
---

<VideoPlayer src="cern_overview_short.mp4" />

<!--
Kalbėtojui (0:11). CERN iš paukščio skrydžio: Ženevos priemiestis, Prancūzijos ir Šveicarijos pasienis. Po žeme — 27 km žiedas.
-->

---
space: { at: collider, dist: 26, yaw: 24, pitch: 58, dim: 0.3 }
---

<div class="readout">

<p class="kicker">CERN įkurtas</p>

<div class="big"><Count :from="1900" :to="1954" :ms="2200" plain /></div>

12 valstybių → šiandien 25 narės ir 11 asocijuotųjų

</div>

<div class="src">home.cern: Our history, Our Member States (2026) · CERN Users Office (2025)</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „CERN gimė iš idėjos, kad buvę priešai gali kartu kurti mokslą. Po Antrojo pasaulinio karo 12 Europos valstybių susitarė kartu tirti, iš ko sudarytas pasaulis: 1953 m. pasirašyta konvencija, 1954 m. rugsėjo 29 d. CERN oficialiai įsteigtas. Šiandien — 25 valstybės narės ir 11 asocijuotųjų; naujausios narės — Estija (2024) ir Slovėnija (2025). CERN dirba apie 2 500 darbuotojų, o su juo bendradarbiauja 12 639 registruoti mokslininkai — daugiau nei 110 tautybių atstovai.“
Faktai: steigėjos — Belgija, Danija, Prancūzija, VFR, Graikija, Italija, Nyderlandai, Norvegija, Švedija, Šveicarija, JK, Jugoslavija. Asocijuotosios narės (11): Brazilija, Čilė, Kroatija, Kipras (parengiamasis etapas), Indija, Airija, Latvija, Lietuva, Pakistanas, Turkija, Ukraina. 2026 m. biudžeto įnašai — apie 1,28 mlrd. CHF.
Šaltiniai: home.cern/about/who-we-are/our-history; home.cern/about/who-we-are/member-states; usersoffice.web.cern.ch (2025 m. statistika); fap-dep.web.cern.ch (2026 m. įnašai).
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
<div class="stat"><div class="n">26,7<small>km</small></div><p class="l">žiedo ilgis</p></div>
<div class="stat"><div class="n">−271,3<small>°C</small></div><p class="l">magnetai — šalčiau nei kosmose</p></div>
<div class="stat"><div class="n">2,85<small>m/s</small></div><p class="l">lėčiau už šviesą</p></div>
<div class="stat"><div class="n">1,5<small>mlrd.</small></div><p class="l">susidūrimų per sekundę</p></div>
</div>

<div class="src">home.cern: The Large Hadron Collider · 3-iojo darbo etapo (2022–2026) parametrai</div>

<!--
Kalbėtojui (~0,9 min). Šie keturi skaičiai — mašinos kraštutinumai; II dalis grįš prie tokių problemų; jutiklinis ekranas (SPS, 1973) ir PET (1977) senesni už LHC.
Sakyti: „LHC — 26,7 km žiedas apie 100 m po žeme, Prancūzijos ir Šveicarijos pasienyje. 1 232 superlaidūs magnetai darbo metu atšaldomi iki 1,9 kelvino — šalčiau nei kosmose (2,7 K). 6,8 TeV energijos protonai skrieja tik 2,85 m/s lėčiau už šviesą — tai 99,99999905 % šviesos greičio; per sekundę jie apskrieja žiedą 11 245 kartus. Darbo metu kiekvieną sekundę ATLAS ir CMS viduje įvyksta apie pusantro milijardo protonų susidūrimų.“
Svarbu: šiuo metu (nuo 2026 06 29) LHC neveikia — prasidėjo trečioji ilgoji techninė pertrauka (LS3), greitintuvas atšildytas ir atnaujinamas. Todėl sakoma „darbo metu“.
Faktai: 9 593 magnetai; vakuumas vamzdyje ~10⁻¹³ bar; pluošte sukaupta energija iki 490 MJ (3-iajame darbo etape). Dažnai cituojamas „99,9999991 %“ atitinka projektinę 7 TeV energiją.
Šaltinis: home.cern/science/accelerators/large-hadron-collider.
Sakyti (pabaigai): „Kiekvienas šių skaičių — inžinerinė problema: kaip tai valdyti, kaip atšaldyti, kaip pamatyti, kaip suskaičiuoti. Prie jų grįšime — iš tokių problemų gimė dalykai, kuriuos naudojate kasdien.“
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
<p class="line">Nobelio premija — 2013 m.</p>
</div>
<div class="credit">Higso bozono kandidatas CMS detektoriuje, 2012 · CMS Collaboration / CERN, CC BY-SA 4.0</div>
</div>

<!--
Kalbėtojui (~0,6 min).
Sakyti: „Garsiausias LHC atradimas — Higso bozonas. 2012 m. liepos 4 d. ATLAS ir CMS jį paskelbė vienu metu. Jį numatė 1964 m. pasiūlytas mechanizmas, paaiškinantis, kodėl elementariosios dalelės turi masę — jo ieškota beveik pusę amžiaus. 2013 m. Nobelio premiją gavo François Englert'as ir Peteris Higgsas, o premijos formuluotėje paminėti ATLAS ir CMS eksperimentai.“
Nuotraukoje: 2012 m. gegužės 27 d. CMS įvykis, Higso bozono kandidatas H → ZZ → 2e2μ.
Šaltinis: home.cern (Nobelio premija 2013 10 08); cds.cern.ch/images/CMS-PHO-EVENTS-2012-007-1.
-->

---
space: { at: cosmos, dist: 14, yaw: -40, pitch: 25, dim: 0.2 }
---

<div class="world-caption narrow">

<p class="kicker">Mūsų eksperimentas · <span class="nc">LHCb</span></p>

# Kodėl mes egzistuojame?

</div>

<!--
Kalbėtojui (~0,7 min). Iš didžiosios mašinos — į mūsų eksperimentą.
Sakyti: „Didysis sprogimas turėjo sukurti po lygiai materijos ir antimaterijos, o susitikusios jos viena kitą sunaikina — būtų likusi tik šviesa. Bet mes esame čia, o Visata sudaryta iš materijos. Vadinasi, gamta kažkur truputį „palankesnė“ materijai. LHCb ieško mažyčių dalelių ir antidalelių skirtumų: tiria dalelių su gražiuoju (b) ir žaviuoju (c) kvarkais skilimus ir lygina juos su antidalelių skilimais.“
Kontekstas: Standartinio modelio CP pažeidimo nepakanka stebimam materijos pertekliui paaiškinti (barionų ir fotonų santykis ~10⁻¹⁰, SM numato ~10⁻¹⁸).
Sakyti (pabaigai): „Ir 2025 m. LHCb pirmą kartą pamatė materijos ir antimaterijos elgesio skirtumą barionuose — dalelių šeimoje, kuriai priklauso protonai ir neutronai.“ (>80 000 Λb⁰ → p K⁻ π⁺ π⁻ skilimų, asimetrija (2,45 ± 0,47) %, 5,2σ; Nature 2025 07 16.)
Šaltinis: home.cern/science/experiments/lhcb.
-->

---
space: { at: [56, 5, -14], dist: 16, yaw: -28, pitch: 12 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" />

<!--
Kalbėtojui (0:56, be garso — komentuoti). LHCb detektoriaus 3D animacija (CERN-FOOTAGE-2022-042-001).
Sakyti: „LHCb — ne cilindras aplink susidūrimo tašką, kaip ATLAS ar CMS, o 21 m ilgio „teleskopas“, žiūrintis viena kryptimi: gražieji kvarkai dažniausiai išlekia pirmyn, arti pluošto. Pirmiausia — VELO, pikselių detektorius vos 5 mm nuo pluošto; toliau magnetas, sekimo sistemos, RICH detektoriai dalelėms atpažinti, kalorimetrai ir miuonų kameros.“
Faktai: LHCb sveria 5 600 t, 21 × 10 × 13 m, 100 m po žeme; artimiausias VELO pikselis — 5,1 mm nuo pluošto; kolaboracijoje beveik 2 000 narių.
-->

---
space: { at: cosmos, dist: 10, yaw: -10, pitch: 30, dim: 0.3 }
---

<div class="readout">

<p class="kicker">Nuo 2022 m. · realiuoju laiku</p>

<div class="big"><Count :from="0" :to="4" :ms="1600" /><span class="unit">TB/s</span></div>

atrenka vaizdo plokštės — kaip žaidimų kompiuteriuose

</div>

<div class="src">LHCb, The LHCb Upgrade I, arXiv:2305.10515 · CERN EP Newsletter: LHCb adopts GPUs for the Run 3 trigger (2020)</div>

<!--
Kalbėtojui (~0,7 min). Ši skaidrė — inovacijų auditorijai: realaus laiko didžiųjų duomenų apdorojimas.
Sakyti: „Tiek duomenų LHCb darbo metu gauna kas sekundę — apie 4 terabaitus. Nuo 2022 m. aparatinio filtro nebėra: pirmąją atranką atlieka „Allen“ programa vaizdo plokštėse (GPU) — iš esmės tokiose pat kaip žaidimų kompiuteriuose (profesionali to paties lusto versija). LHCb — pirmasis eksperimentas, kurio visa didelio pralaidumo atrankos pakopa veikia vaizdo plokštėse. Antroji pakopa — daugiau nei 3 000 serverių. Į diską patenka apie 10 GB/s — maždaug vienas baitas iš keturių šimtų. Rekonstrukcija, kalibravimas ir analizė vyksta realiuoju laiku.“
Faktai: GPU — NVIDIA RTX A5000; vietų ~500, bazinei HLT1 reikia ~200.
LHCb atnaujinimo vaisius (jei klausia): 2026 m. kovą atnaujintu detektoriumi per vienus metus rastas dvigubai žavus barionas Ξcc⁺ — senuoju to nepavyko per dešimtmetį (VU, 2026 04 03).
-->

---
space: { at: [-29.5, 0.2, 0], dist: 11, yaw: -10, pitch: 6, dim: 0.15 }
---

<div class="world-caption narrow">

<p class="kicker"><span class="nc">LHCb</span> · 2015</p>

# Pentakvarkas

76 iš 86 naujų LHC hadronų atrado LHCb

</div>

<div class="src">LHCb, PRL 115 (2015) 072001 · P. Koppenburg, New particles discovered at the LHC (2026 09 21)</div>

<!--
Kalbėtojui (~0,7 min). Kamera grįžta prie pentakvarko, kurį matėme pradžioje; „c“ surenka jį iš naujo.
Sakyti: „Prisiminkite penkis šviesos kamuoliukus, kuriuos matėte pradžioje: tai dalelė iš penkių kvarkų — dviejų u, vieno d, žaviojo kvarko c ir jo antikvarko. 1964 m. Gell-Mannas ir Zweigas pasiūlė kvarkų modelį, ir jau tada buvo aišku, kad tokios dalelės gali egzistuoti. Jų ieškota daugiau nei 50 metų; 2015 m. liepos 14 d. LHCb jas pamatė Λb skilimuose. 2019 m., turint devynis kartus daugiau duomenų, paaiškėjo, kad tai kelios siauros būsenos — galbūt net „molekulės“ iš bariono ir mezono. Iš 86 naujų hadronų, atrastų LHC, 76 atrado LHCb.“
Skaičius: Koppenburgo sąraše „86 hadrons have been discovered at the LHC, of which 76 by LHCb“ (paskutinis įrašas 2026 09 21, Bs0*(5700)0).
-->

---
space: { at: hero, dist: 18, yaw: 55, pitch: 28, dim: 0.4 }
---

<div class="head">

# LHCb Vilnius

</div>

<div class="stats three">
<div class="stat"><div class="n">2024</div><p class="l">VU — LHCb institucija</p></div>
<div class="stat"><div class="n">800<small>TB</small></div><p class="l">atvirų LHCb duomenų</p></div>
<div class="stat"><div class="n">2026</div><p class="l">LHCb savaitė Vilniuje</p></div>
</div>

<div class="src">VU FF naujienos, 2024 09 16 · LHCb, „LHCb releases entire Run 1 dataset“, 2023 12 20 · vu.lt, 2026 09</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „2024 m. rugsėjo 2 d. LHCb kolaboracijos taryba vienbalsiai priėmė Vilniaus universitetą — Lietuva tapo nauja LHCb šalimi. Grupė veikia VU Fizikos fakulteto Fotonikos ir nanotechnologijų institute: mūsų darbai — LHCb duomenų srautas, modeliavimas, detektorių kūrimas ir charakterizavimas bei duomenų analizė. Rūta Racz — pirmoji VU doktorantė ir pirmoji moteris iš Lietuvos LHCb eksperimente; ji ieško pentakvarkų ir budi LHCb valdymo salėje.“
„Visus 2011–2012 m. LHCb duomenis — 800 TB — viešam naudojimui parengiau aš; nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, o nuo 2026 m. kovo per internetinę paslaugą galima gauti ir antrojo etapo duomenis (kartu su pirmuoju — >4 PB). Nuo šių metų rugpjūčio koordinuoju LHCb atvirųjų duomenų darbą.“
„Rugsėjo 14–18 d. Vilniuje vyko LHCb savaitė — pirmą kartą Lietuvoje: apie 200 dalyvių vietoje ir dar keli šimtai nuotoliu.“
Grupė: M. Šarpis, R. Aleksiejūnas, O. Kravcov, A. Morris, A. Vaitkevičius, R. Racz, Š. Jacevičius ir studentai (lhcb-vilnius.web.cern.ch).
-->

---
layout: section
space: { at: [84.2, -2.2, 0], dist: 13, yaw: -22, pitch: 16, dim: 0.08 }
---

# II dalis · Išradimai

Ką CERN davė pasauliui

<!--
Kalbėtojui (~0,4 min). Pasaulyje — tinklas: mazgai, sujungti tekančių grūdelių gijomis. Šios dalies skaidrės eina laiko tvarka — nuo 1973-ųjų iki šių metų: kiekviena prasideda problema, kurią iškėlė CERN mašinos, ir baigiasi tuo, kas iš jos išėjo į pasaulį.
Sakyti: „Kiekviena CERN mašina kėlė problemų, kurių sprendimai vėliau išėjo iš laboratorijos. Pradėkime nuo seniausios — nuo 1973-ųjų.“
(Jutiklinio ekrano nevadinti CERN išradimu: CERN buvo vienas pirmųjų, ne pirmasis — žr. jo skaidrę.)
-->

---
space: { at: web, dist: 15, yaw: 46, pitch: 18, dim: 0 }
---

<div class="hero low" style="--focus: 50% 30%">
<img src="/figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" />
<div class="hero-text">
<p class="kicker gold">Problema: valdymas</p>
<div class="year">1973</div>
<h1>Jutiklinis ekranas</h1>
<p class="line"><b>1,26 mlrd.</b> išmaniųjų telefonų per metus</p>
</div>
<div class="credit">Bentas Stumpe su jutiklinio ekrano plokšte, 2016 · Nuotr. Sophia Elizabeth Bennett / CERN, CC BY 4.0</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1972 m. kovo 11 d. CERN inžinierius Bentas Stumpe ranka parašė pasiūlymą: ekranas su programuojamais mygtukais, kuriuos tereikia paliesti pirštu. Kartu su Franku Becku jis sukūrė skaidrų talpinį jutiklinį ekraną naujajam SPS greitintuvui valdyti. Vario linijos ant stiklo — 80 mikrometrų pločio, tokie pat ir tarpai tarp jų, todėl linijų nesimato. Ekranai naudoti nuo 1973 m.; kai 1976 m. SPS pradėjo veikti, jo valdymo pultuose jau buvo jutikliniai ekranai. Nuotraukoje — Stumpe su savo ekrano plokšte ir išmaniuoju telefonu. 2025 m. pasaulyje parduota 1,26 mlrd. išmaniųjų telefonų.“
Sąžiningai: tai vienas pirmųjų talpinių jutiklinių ekranų pasaulyje, ne pirmasis — pirmąjį talpinį jutiklinį ekraną aprašė E. A. Johnsonas (JK) 1965 m. CERN Courier CERN ekraną vadina „apparently the first application of the capacitative touch screen in the world“ ir „šiuolaikinių telefonų ekranų pirmtaku“ — tai CERN požiūris, ne įrodyta tiesioginė technologijų linija iki išmaniųjų telefonų.
Istorija: Stumpe atsisakė pasirašyti konfidencialumo sutartį dėl vėlesnio X–Y ekrano, nes CERN išradimus skelbia viešai.
Šaltiniai: cerncourier.com/?p=9153; repository.cern/records/xrg56-9ha60; IDC (2026 01 13).
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
<p class="line">PET/KT — TIME <b>2000 m. medicinos išradimas</b></p>
</div>
<div class="credit">Šiuolaikinis PET/KT skeneris, CERMEP, Lionas · Nuotr. Romainbehar, CC0</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „PET tomografija leidžia pamatyti, kur organizme ypač aktyvi medžiagų apykaita — pavyzdžiui, kur auga navikas. 1977 m. vasarą CERN fizikas Alanas Jeavonsas su savo dalelių detektoriumi ir Davidas Townsendas su vaizdų rekonstrukcijos programa gavo pirmąjį CERN PET vaizdą — pelės. Vėliau Townsendas, dirbdamas Ženevos kantono ligoninėje, suprato, kad PET reikia sujungti su kompiuterine tomografija, o jau Pitsburgo universitete (JAV) su Ronu Nuttu sukūrė PET/KT skenerį. Žurnalas TIME jį paskelbė 2000 m. medicinos išradimu; šiandien PET/KT — kasdienė onkologų priemonė. Nuotraukoje — šiuolaikinis PET/KT skeneris.“
Sąžiningai — CERN pats rašo: „PET was not invented at CERN, but the work carried out by Jeavons and Townsend made a major contribution to its development.“
Faktai: PET/KT kūrimas finansuotas nuo 1995 m., pirmieji klinikiniai vaizdai 1998 m., TIME — 2000 m. gruodį, pirmasis komercinis Siemens Biograph — 2001 m.; iki 2005 m. jau >1 000 PET/KT skenerių.
Šaltiniai: kt.cern/?p=1341; cerncourier.com/a/pet-and-ct-a-perfect-fit/; Siemens Healthineers.
-->

---
space: { at: web, dist: 15, yaw: 14, pitch: 16, dim: 0 }
---

<div class="hero low" style="--focus: 50% 20%">
<img src="/figures/hero_proposal.jpg" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" />
<div class="hero-text">
<p class="kicker gold">Problema: informacija</p>
<div class="year">1989</div>
<h1>„Vague but exciting…“</h1>
<p class="line">„Miglota, bet įdomu…“</p>
</div>
<div class="credit">T. Bernerso-Lee pasiūlymas su M. Sendallo pastaba, CERN ekspozicija · Nuotr. Sailko, CC BY 3.0</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1989 m. kovą CERN programuotojas Timas Bernersas-Lee parašė dokumentą „Information Management: A Proposal“ — apie tai, kaip CERN tvarkyti informaciją apie milžiniškus projektus. Jo vadovas Mike'as Sendallas ant pirmojo puslapio užrašė tris žodžius: „Vague but exciting…“ — „Miglota, bet įdomu…“ Atkreipkite dėmesį, kokia problema buvo sprendžiama: CERN — tūkstančiai žmonių, kurie ateina vidutiniškai dvejiems metams ir išeina, o informacija pasimeta. Pasiūlymo įžanga prasideda taip: daugelis diskusijų apie CERN ateitį ir LHC erą baigiasi klausimu „Taip, bet kaip mes kada nors susigaudysime tokiame dideliame projekte?“ Tas pats LHC, prie kurio šiandien dirbame ir mes. Žiniatinklis gimė iš fizikų poreikio. O tuos tris žodžius — „miglota, bet įdomu“ — įsidėmėkite: jie dar sugrįš.“
1990 m. lapkričio 12 d. formaliame projekto pasiūlyme (su Robert'u Cailliau) prašyta vos 4 programinės įrangos inžinierių ir programuotojo maždaug pusmečiui. Mažytė komanda — pasaulinis rezultatas.
Šaltiniai: w3.org/History/1989/proposal.html; w3.org/Proposal.html.
-->

---
space: { at: web, dist: 15, yaw: 30, pitch: 14, dim: 0 }
---

<div class="hero right" style="--focus: 35% 55%">
<img src="/figures/hero_next.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" />
<div class="hero-text">
<p class="kicker gold">Sprendimas — visiems</p>
<div class="year">1993</div>
<h1>Žiniatinklis atiduotas pasauliui</h1>
<p class="line"><b>~1,5 mlrd.</b> svetainių · <b>~6 mlrd.</b> žmonių internete</p>
</div>
<div class="credit">Pirmasis žiniatinklio serveris, CERN, 1990 · Nuotr. Patrice Loïez / CERN, CC BY-SA 4.0</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1990 m. pabaigoje šis NeXT kompiuteris tapo pirmuoju žiniatinklio serveriu: info.cern.ch. Lipdukas ant jo: „This machine is a server. DO NOT POWER IT DOWN!!“ — jei kas būtų išjungęs, būtų išjungęs visą tuometinį žiniatinklį. Bet svarbiausias sprendimas buvo ne techninis: 1993 m. balandžio 30 d. du CERN direktoriai pasirašė dokumentą, kuriuo CERN atsisakė visų intelektinės nuosavybės teisių į žiniatinklio programinę įrangą — ja galėjo naudotis bet kas. Todėl žiniatinklis tapo visų. Šiandien yra beveik pusantro milijardo svetainių, o internetu naudojasi apie 6 milijardus žmonių. Verslo paradoksas: didžiausią vertę pasauliui CERN sukūrė atsisakęs teisių į savo išradimą.“
Nesakyti „CERN išrado internetą“: internetas egzistavo anksčiau; CERN sukūrė žiniatinklį (WWW), veikiantį internete.
Faktai: pirmasis viešas paskelbimas — 1991 08 06 alt.hypertext grupėje; pirmasis serveris už Europos ribų — 1991 12 12, SLAC (irgi dalelių fizikos laboratorija). 1994 m. pabaigoje — 10 000 serverių, 10 mln. naudotojų. Netcraft, 2026 m. liepa: 1 494 915 628 svetainės; ITU: ~6 mlrd. žmonių (74 %) internete 2025 m. T. Bernersas-Lee — 2016 m. Turingo premija.
Šaltiniai: home.cern/science/computing/the-birth-of-the-web/; netcraft.com (2026 07); itu.int.
-->

---
space: { at: web, dist: 16, yaw: 62, pitch: 22, dim: 0 }
---

<div class="hero" style="--focus: 50% 50%">
<img src="/figures/hero_hadron.jpg" alt="Hadronų terapijos centro sinchrotronas" />
<div class="hero-text">
<p class="kicker gold">Problema: pluoštai</p>
<div class="year">9 000+</div>
<h1>pacientų gydyta CNAO ir MedAustron</h1>
<p class="line">2025: FLASH projektas — visa dozė per 0,1 s</p>
</div>
<div class="credit">MedAustron sinchrotronas, Vyner Noištatas (Austrija) · © CERN</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „Protonai ir anglies jonai didžiąją energijos dalį atiduoda tam tikrame gylyje, todėl galima taikliai paveikti naviką ir mažiau pažeisti aplinkinius audinius. CERN su partneriais (TERA, MedAustron, Onkologie-2000) 1996–2000 m. suprojektavo atvirą sinchrotrono „įrankių rinkinį“ PIMMS. Pagal jį pastatyti du centrai: CNAO Pavijoje, Italijoje (pirmasis pacientas — 2011 m.), ir MedAustron Austrijoje (pirmasis pacientas — 2016 m. gruodį). Juose protonais ir anglies jonais gydyta jau daugiau nei 9 000 pacientų su retais ir sunkiai pagydomais navikais.“
Faktai: CNAO iki 2026 m. liepos — >6 200 pacientų, vienas iš 8 pasaulio centrų, gydančių ir protonais, ir anglies jonais; MedAustron iki 2025 m. sausio — >2 700 pacientų (noe.gv.at), 2025 m. — ~550, planuoja ~1 000 per metus. CERN 2026 m. studija: kartu „beveik 9 000“; su naujausiais CNAO ir MedAustron duomenimis — jau >9 000.
Sakyti (pabaigai): „FLASH terapija — visa spindulinio gydymo dozė per sekundės dalį; taip labiau tausojami sveiki audiniai. CERN, Lozanos ligoninė CHUV ir THERYQ paskelbė DEFT greitintuvo projektą: 140 MeV elektronai per mažiau nei 0,1 s apšvitins navikus iki 25 cm gylio; greitintuvas remiasi CERN CLIC technologija.“
20–30 Gy, iki 20 cm pločio. Lygiagrečiai THERYQ projektas FLASHDEEP: 38 mln. EUR iš „France 2030“, montavimas Gustave Roussy planuotas 2026 m. pabaigoje, klinikiniai tyrimai — 2027 m.
Sakyti (pabaigai): „CERN-MEDICIS pirmą kartą išsiuntė aktinio-225 pramonei — įmonei RayzeBio, kurią 2024 m. už 4,1 mlrd. dolerių įsigijo „Bristol Myers Squibb“. Aktinis-225 — vienas perspektyviausių izotopų vėžiui gydyti.“ 2025 m. CERN Taryba leido tiekti masės separatoriumi išgrynintus radionuklidus klinikiniams tyrimams; IV ketvirtį — Ac-225 RayzeBio, bandomieji siuntiniai Heidelbergo universitetinei ligoninei. PRISMAP (2021–2025): 159 siuntos, 23 radionuklidai, 47 projektai iš 19 šalių.
-->

---
space: { at: web, dist: 18, yaw: 78, pitch: 26, dim: 0 }
---

<div class="hero" style="--focus: 50% 50%">
<img src="/figures/hero_datacentre.jpg" alt="CERN duomenų centro serverių spintos" />
<div class="hero-text">
<p class="kicker gold">Problema: duomenys</p>
<div class="year">1 EB</div>
<h1>Pasaulinis skaičiavimo tinklas</h1>
<p class="line">170 centrų 42 šalyse · <b>White Rabbit</b> laikas — biržose</p>
</div>
<div class="credit">CERN duomenų centras · Nuotr. Sophia Bennett / CERN, CC BY 4.0</div>
</div>

<!--
Kalbėtojui (~0,8 min). Problema — duomenys: vienas eksabaitas ir daugiau.
Sakyti: „2025 m. gruodį CERN peržengė vieno eksabaito ribą — milijonas terabaitų LHC duomenų; dauguma jų įrašyta į maždaug 60 000 magnetinių juostų. Ir tai, CERN skaičiavimu, tik apie 10 % to, ką reikės saugoti ir apdoroti per artimiausius dešimt metų. Duomenis apdoroja pasaulinis LHC skaičiavimo tinklas: daugiau nei 170 centrų 42 šalyse, apie 1,4 mln. procesorių branduolių.“
WLCG: 1,5 EB saugyklos, >2 mln. užduočių per dieną; CERN pats teikia ~20 % išteklių. Lietuva 2005 m. prisidėjo prie BalticGrid projekto (Vilniaus klasteris 2007 m. skyrė CMS 100 000 procesoriaus valandų).
White Rabbit: laiko sinchronizacija subnanosekundės tikslumu (CERN, nuo 2012 m.; IEEE 1588-2019); Deutsche Börse — >500 prievadų, laiko žymos prekybos dalyviams.
Sakyti: „Iš tos pačios mašinos atėjo ir tikslus laikas: CERN White Rabbit sinchronizuoja tūkstančius įrenginių subnanosekundės tikslumu — šiandien juo naudojasi Frankfurto birža. O Ženevoje jis sinchronizuoja pirmąjį Šveicarijos kvantinį tinklą: 262 km šviesolaidžių; laiką jame sinchronizuoja CERN White Rabbit, o tarp partnerių yra ID Quantique ir Rolex.“
Sakyti (trumpai): „Duomenų problema davė ir atvirą mokslą — Zenodo, ROOT, Geant4 naudoja viso pasaulio tyrėjai.“
Taip pat (jei laikas leidžia): „CERN platforma CAFEIN leidžia ligoninėms kartu mokyti dirbtinį intelektą nesidalijant pacientų duomenimis. Rugsėjo 21 d. Niujorke, JT Generalinės Asamblėjos metu, ji įvertinta Digital@UNGA 2026 apdovanojimuose.“
-->

---
space: { at: web, dist: 18, yaw: 92, pitch: 30, dim: 0 }
---

<div class="hero" style="--focus: 50% 50%">
<img src="/figures/hero_cold.jpg" alt="Superlaidi MgB₂ elektros linija bandymų stende" />
<div class="hero-text">
<p class="kicker gold">Problema: šaltis</p>
<div class="year">−271 °C</div>
<h1>Superlaidumas</h1>
<p class="line">superlaidi linija vandeniliniams lėktuvams (Airbus)</p>
</div>
<div class="credit">Superlaidi MgB₂ linija HL-LHC, SM18 bandymų stendas · Nuotr. Maximilien Brice / © CERN</div>
</div>

<!--
Kalbėtojui (~0,7 min). Problema — šaltis: LHC magnetai darbo metu atšaldomi iki 1,9 K; superlaidūs kabeliai ir magnetai — CERN kasdienybė.
Sakyti: „Su Airbus UpNext CERN išbandė 7 m ilgio superlaidžią elektros liniją vandeniliniams lėktuvams; tęsinys skirtas 2 MW varomajai sistemai.“
SCALE (2022–2024): lanksti REBCO linija, ±2 kA iki 63 K, kabelis ~290 g/m; SAMBA (2025–2026) — Airbus Cryoprop demonstratoriui.
Sakyti: „CERN ir ES įstaiga „Fusion for Energy“, valdanti Europos indėlį į ITER, susitarė kartu kurti magnetus iš aukštatemperatūrių superlaidininkų ir bandyti medžiagas.“
Pagrindų susitarimas 2025 09 10; bendradarbiavimas nuo 2014 m.
Taip pat: CERN HEARTS — palydovų elektronikos bandymai sunkiųjų jonų pluoštu (2025 m. 16 naudotojų); CIPEA — >25 aplinkosaugos projektai, >80 % finansuoja partneriai.
Medicinai: GaToroid — superlaidus 12 t gantris vietoj iki 270 t (≈95 % lengvesnis) pigesnei hadronų terapijai.
-->

---
space: { at: web, dist: 15, yaw: -52, pitch: 20, dim: 0 }
---

<div class="hero" style="--focus: 62% 45%">
<img src="/figures/hero_velo.jpg" alt="Montuojama pusė naujojo LHCb VELO detektoriaus su pikselių moduliais ir raudonais kabeliais" />
<div class="hero-text">
<p class="kicker gold">Problema: pamatyti dalelę</p>
<div class="year">55 µm</div>
<h1>Lustas, apsukęs ratą</h1>
<p class="line">fizika → medicina → vėl fizika</p>
</div>
<div class="credit">Naujojo LHCb VELO montavimas, 2022 m. gegužė · Nuotr. Julien Marius Ordan / CERN</div>
</div>

<!--
Kalbėtojui (~0,6 min). Po senųjų pavyzdžių — mūsų laikai ir mūsų detektorius: problema — kaip pamatyti dalelę.
Sakyti: „Ir čia mano eksperimentas susitinka su jūsų pasauliu. LHCb VELO detektoriuje — 41 milijonas 55 mikrometrų dydžio pikselių. Juos nuskaito VeloPix lustai, sukurti CERN Timepix3 lusto pagrindu. Hibridinių pikselių technologija gimė dalelių fizikoje, vėliau Medipix kolaboracija ją pritaikė medicininiam rentgenui, o VeloPix — ta pati technologija, grįžusi į dalelių fiziką.“
Faktai: VeloPix — 256 × 256 pikselių po 55 µm, 130 nm CMOS, iki 900 mln. signalų per sekundę (Timepix3 — 80 mln.), atsparus >4 MGy dozei. CERN Medipix puslapis VeloPix vadina „a direct spin back to high-energy physics“.
-->

---
space: { at: web, dist: 15, yaw: -34, pitch: 18, dim: 0 }
---

<div class="hero right" style="--focus: 40% 50%">
<img src="/figures/hero_mars.jpg" alt="Spalvotas 3D žmogaus riešo rentgeno vaizdas: kaulai balti, minkštieji audiniai raudoni, metaliniai varžtai mėlyni" />
<div class="hero-text">
<p class="kicker gold">Problema: pamatyti dalelę</p>
<div class="year">2026</div>
<h1>Spalvotas rentgenas — į kliniką</h1>
<p class="line">JAV FDA leidimas skeneriui su <b>CERN Medipix3</b></p>
</div>
<div class="credit">Spalvotas 3D riešo vaizdas (Medipix3) · MARS Bioimaging Ltd</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „Įprastas rentgenas — nespalvota nuotrauka: jis matuoja tik tai, kiek spinduliuotės praėjo. CERN Medipix3 lustas skaičiuoja kiekvieną fotoną atskirai ir išmatuoja jo energiją — tarsi spalvą. Naujosios Zelandijos įmonė MARS Bioimaging, kurią įkūrė tėvas ir sūnus Philas ir Anthony Butleriai, 2018 m. liepą parodė pirmąjį spalvotą 3D žmogaus vaizdą. Nuotraukoje — riešas: kaulai balti, audiniai raudoni, metaliniai varžtai mėlyni. Medipix technologija šiandien naudojama pagal 30 komercinių licencijų ir padėjo pramonei uždirbti daugiau nei 100 mln. frankų.“
Faktai: licencija tarp CERN (Medipix3 kolaboracijos vardu) ir MARS Bioimaging; įmonė įkurta 2007 m. Medipix (CERN 2026 m. studija): 30 aktyvių licencijų, >5 mln. CHF honorarų, >100 mln. CHF pramonės pajamų, 73 patentai, paremti Medipix publikacijomis (Philips, ASML, Siemens ir kt.), 40 % licencijų pasirašyta per pastaruosius 3 metus.
Vaizdas: MARS Bioimaging Ltd (CERN KT CDS įrašas KTTGROUP-PHO-TECH-2020-001); jei rodoma ne švietimo tikslais — paprašyti MARS leidimo.
Šaltiniai: kt.cern/first-3d-colour-x-ray-of-a-human-using-cern-technology/; kt-report-2025.web.cern.ch (socioekonominė studija).
Sakyti (pabaigai): „Kovą MARS Bioimaging skeneris su CERN Medipix3 lustu gavo JAV FDA leidimą — praėjus 20 metų nuo idėjos.“
FDA 510(k) nešiojamam fotonų skaičiavimo KT skeneriui rankų tyrimams. CTO A. Butleris: „Twenty years later, with the support of the Medipix Collaboration, we are starting to have a significant impact.“ 2025 m. klinikiniai tyrimai — Hospital for Special Surgery, Niujorkas.
-->

---
space: { at: web, dist: 16, yaw: -18, pitch: 14, dim: 0 }
---

<div class="hero" style="--focus: 50% 40%">
<img src="/figures/hero_artemis.jpg" alt="NASA Artemis II raketa SLS kyla iš paleidimo aikštelės" />
<div class="hero-text">
<p class="kicker gold">Tie patys lustai</p>
<div class="year">2026</div>
<h1>Aplink Mėnulį</h1>
<p class="line">6 CERN Timepix lustai matavo radiaciją įgulos kapsulėje</p>
</div>
<div class="credit">Artemis II startas, 2026 04 01 · Nuotr. NASA / Michael DeMocker</div>
</div>

<!--
Kalbėtojui (~0,5 min). Ta pati lustų šeima — kosmose.
Sakyti: „Balandį šeši CERN Timepix lustai skrido su Artemis II įgula aplink Mėnulį ir realiuoju laiku matavo radiaciją Orion kapsulėje. Modulius tiekė Prahos įmonė ADVACAM, išaugusi iš CERN technologijos.“
Artemis II — pirmoji pilotuojama kelionė link Mėnulio nuo 1972 m. (startas 2026 04 02, 00:35 CEST; nusileido 04 10). Timepix lustai TKS naudojami nuo 2012 m. ADVACAM — Praha, įkurta 2013 m. Timepix (NASA HERA) skrido ir 2022 m. nepilotuojamame Artemis I — naujiena ta, kad šįkart su įgula.
-->

---
space: { at: web, dist: 26, yaw: 130, pitch: 40, dim: 0.55 }
---

<div class="head">

# Mano CERN inovacijų dešimtukas

</div>

<div class="rank">
<div><span class="r">1</span><span class="t">Žiniatinklis</span></div>
<div><span class="r">2</span><span class="t">Jutikliniai ekranai</span></div>
<div><span class="r">3</span><span class="t">PET ir PET/KT</span></div>
<div><span class="r">4</span><span class="t">Hadronų terapija</span></div>
<div><span class="r">5</span><span class="t">Medipix ir Timepix</span></div>
<div><span class="r">6</span><span class="t">Pasaulinis skaičiavimo tinklas</span></div>
<div><span class="r">7</span><span class="t">White Rabbit</span></div>
<div><span class="r">8</span><span class="t">Medicininiai izotopai</span></div>
<div><span class="r">9</span><span class="t">Superlaidumas</span></div>
<div><span class="r">10</span><span class="t">Atvirasis mokslas</span></div>
</div>

<!--
Kalbėtojui (~0,8 min). Tai asmeninis reitingas pagal poveikį žmonėms — ne oficialus CERN sąrašas.
Sakyti: „Jei reikėtų išrinkti dešimt — štai mano sąrašas. Pirmosios trys inovacijos jau pakeitė kiekvieno iš mūsų gyvenimą. Paskutiniosios — dar tik keičia.“
1 — ~6 mlrd. žmonių internete, atiduotas nemokamai; 2 — 1,26 mlrd. telefonų per metus; 3 — vėžio diagnostika visame pasaulyje; 4 — >9 000 pacientų CNAO ir MedAustron; 5 — 30 licencijų, FDA leidimas, Artemis II; 6 — 170 centrų, 42 šalys; 7 — biržos, kvantiniai tinklai, IEEE standartas; 8 — MEDICIS radionuklidai klinikoms ir pramonei; 9 — nuo LHC magnetų iki Airbus ir sintezės; 10 — Zenodo, Geant4, ROOT, Indico (Indico: ~400 000 naudotojų, 300 serverių 52 šalyse, naudoja ir JT).
-->

---
hide: true
space: { at: web, dist: 21, yaw: 95, pitch: 40, dim: 0.5 }
---

<div class="head">

# Ir tai dar ne viskas

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
Kalbėtojui (~1 min). Greitai, po vieną sakinį.
Indico: renginių valdymo sistema (CERN, nuo 2004 m.): ~400 000 naudotojų, 300 serverių 52 šalyse, naudoja ir JT.
Geant4: dalelių sąveikos su medžiaga modeliavimas; pirmoji versija 1998 12 15; >16 000 citavimų; padėjo suprasti, kodėl NASA Chandra teleskopas prarado jautrumą (1999).
ROOT: LHC duomenų analizės sistema, pradėta kurti 1995 m. sausį (R. Brun, F. Rademakers); HighLO projektas — manipuliacijų biržose paieška; jį naudojo Deutsche Börse.
Zenodo: nemokama mokslo duomenų saugykla (2013, su OpenAIRE): 7 432 875 vieši įrašai (2026 10 07), >300 000 tyrėjų.
Proton Mail: šifruotą el. paštą 2014 m. Ženevoje sukūrė CERN susipažinę mokslininkai (Andy Yen ir kt.); beta versiją išbandė >300 žmonių iš CERN.
Saulės kolektoriai: LHC vakuumo NEG dangos (C. Benvenuti) → SRB Energy; 2012 m. ~300 kolektorių (1 200 m²) Ženevos oro uosto stogui.
CERN OHL: atvirosios aparatinės įrangos licencija (2011; v2 — 2020); 2026 05 07 CERN atvėrė 17 000 KiCad komponentų biblioteką.
HEV: 2020 m. kovą LHCb VELO grupė (J. Buytaert), remdamasi detektorių dujų sistemų patirtimi, per savaitę sukūrė veikiantį plaučių ventiliatoriaus demonstratorių.
-->

---
layout: section
space: { at: [120, -2.4, 0], dist: 14, yaw: -22, pitch: 22, dim: 0.08 }
---

# III dalis

Ir atgal — į privatų sektorių

<!--
Kalbėtojui (~0,2 min). Pasaulyje — auksinė „sėkla“ ir aplink ją besisukantis mazgų ratas: žinios, išeinančios iš CERN.
Sakyti: „Ką tik matėte Prahos įmonę ADVACAM, išaugusią iš CERN lustų. Kodėl tokia įmonė negalėtų būti lietuviška? Pradžioje žadėjau, kad grįšime atgal. Grįžtame — nuo visatos pakraščių iki jūsų įmonių. Visa, ką parodžiau, prasidėjo kaip fizikų problema, o virto kieno nors verslu. Kitą kartą tai gali būti jūsų verslas.“
-->

---
space: { at: [118.5, -1.6, 0], dist: 13, yaw: -30, pitch: 14, dim: 0.25 }
---

<div class="readout gold-k">

<p class="kicker">CERN tiekėjai · 2026 m. tyrimas</p>

<div class="big gold">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">%</span></div>

apyvartos, palyginti su panašiomis įmonėmis

</div>

<div class="src">Technopolis ir CSIL, CERN socioekonominė studija (2026) · CERN tiekėjų apklausa, 2024</div>

<!--
Kalbėtojui (~0,7 min). Pagrindinė žinia verslui.
Sakyti: „Nepriklausomas 2026 m. tyrimas palygino įmones, kurios 2016–2024 m. pirmą kartą gavo CERN užsakymą, su panašiomis įmonėmis, kurios jo negavo. Per penkerius metus jų apyvarta padidėjo 14 % daugiau nei panašių įmonių, darbuotojų skaičius — 13 % daugiau, patentų — 15 % daugiau, nematerialusis turtas — net 63 % daugiau. 54 % tiekėjų dėl darbo su CERN pateko į naujas rinkas. Darbas su CERN — tai bandymų poligonas technologijoms, kurių dar niekas kitas neprašo.“
Faktai: materialusis turtas +27 %; 70 % tiekėjų įgijo pažangių kompetencijų. WIFO (2025): CERN pirkimai kasmet sukuria ~680 mln. CHF pridėtinės vertės. Poveikis patentams pasireiškia po 5–8 metų (arXiv:1905.09552).
Šaltinis: kt-report-2025.web.cern.ch (CERN-socio-economic-final.pdf); home.cern (2026 06 23).
-->

---
space: { at: kt, dist: 17, yaw: 4, pitch: 34, dim: 0.4 }
---

<div class="head">

# Kaip CERN technologijos pasiekia rinką

</div>

<div class="stats gold">
<div class="stat"><div class="n">700+</div><p class="l">sutarčių su partneriais nuo 2011 m.</p></div>
<div class="stat"><div class="n">89</div><p class="l">sutartys vien 2025 m.</p></div>
<div class="stat"><div class="n">~100</div><p class="l">startuolių</p></div>
<div class="stat"><div class="n">2<small>%</small></div><p class="l">honoraras, be akcijų</p></div>
</div>

<div class="src">CERN Knowledge Transfer Report 2025 · Technopolis ir CSIL, CERN socioekonominė studija (2026) · WIPO Global Innovation Index 2026</div>

<!--
Kalbėtojui (~0,9 min).
Sakyti: „Kaip tai vyksta? CERN turi žinių perdavimo grupę, kuri rūpinasi licencijomis, bendrais MTEP projektais ir startuoliais. Nuo 2011 m. — daugiau nei 700 sutarčių. Vien 2025 m. pasirašytos 89: 32 bendri MTEP projektai, 28 licencijos, 15 paslaugų ir konsultavimo sutarčių, 8 startuolių sutartys; 63 partneriai — įmonės. CERN stebi apie 100 su juo susijusių startuolių. Startuoliams skirta programa CERN Venture Connect: CERN neima akcijų, o 2 % licencinis mokestis mokamas tik tada, kai metinės pardavimo pajamos pasiekia milijoną frankų. Ši programa šiemet aprašyta Pasaulinės intelektinės nuosavybės organizacijos Pasauliniame inovacijų indekse.“
Faktai: CVC — nuo 2023 m. spalio; 2026 m. spalį: 9 licencijai paruoštos technologijos, 21 startuolis, >50 partnerių. 2025 m. CVC startuoliai pritraukė 5,6 mln. CHF. Licencija — 10 metų, pasaulinė, neišimtinė, viena taikymo sritis. 2026 m. gegužę CERN pradėjo vidinę Verslumo akademiją (23 dalyviai).
Atsargiai: „27 su CERN susiję startuoliai pritraukė 3,2 mlrd. CHF“ — trys ketvirtadaliai sumos (2,4 mlrd.) — vienas 2024 m. Novartis skolos pritraukimas po IPO, priskirtas jos įsigytai Advanced Accelerator Applications. Šio skaičiaus geriau nevartoti be išlygos.
Paties CERN pajamos iš licencijų kuklios (2007–2024 m. vidutiniškai ~1,5 mln. CHF per metus): tikslas — poveikis, ne honorarai.
-->

---
space: { at: kt, dist: 22, yaw: 200, pitch: 40, dim: 0 }
---

<div class="hero" style="--focus: 55% 50%">
<img src="/figures/hero_fcc.jpg" alt="Siūlomo 91 km FCC žiedo aplink Ženevą žemėlapis šalia LHC žiedo" />
<div class="hero-text">
<p class="kicker">Kita mašina</p>
<div class="year blue">91 km</div>
<h1>Būsimasis žiedinis greitintuvas</h1>
<p class="line">Sprendimas statyti — apie 2028 m.</p>
</div>
<div class="credit">Būsimojo žiedinio greitintuvo (FCC) trasa · Daniel Dominguez / CERN</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „Šiais metais CERN žengė didelį žingsnį. Birželio 27 d. LHC paskutinį kartą sukosi protonai — trečiasis darbo etapas baigtas; iki 2030 m. greitintuvas pertvarkomas į didelio šviesio LHC, kuris duos iki dešimties kartų daugiau susidūrimų, nei numatė pradinis projektas. Gegužės 22 d. Budapešte CERN Taryba priėmė atnaujintą Europos dalelių fizikos strategiją: kitu pagrindiniu greitintuvu siūlomas 90,7 km FCC-ee; sprendimas statyti laukiamas apie 2028 m. O pernai gruodį — pirmą kartą CERN istorijoje — privatūs rėmėjai pažadėjo pinigų naujam greitintuvui: buvęs „Google“ vadovas Ericas Schmidtas su žmona Wendy, „Ferrari“ pirmininkas Johnas Elkannas, Breakthrough Prize fondas ir Xavier'as Nielis — iš viso apie 860 mln. eurų.“
Faktai: FCC galimybių studija (2025 03 31): 90,7 km, vidutinis gylis ~200 m, FCC-ee kaina ~15 mlrd. CHF per ~12–15 metų. Pažadai priklauso nuo valstybių narių sprendimo. HL-LHC fizika — nuo 2030 m. birželio iki 2041 m.
Šaltiniai: home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/; council.web.cern.ch (2026 05 22 rezoliucija); home.cern/private-donors-pledge-860-million-euros-cerns-future-circular-collider/; cerncourier.com/a/fcc-feasibility-study-complete/.
-->

---
space: { at: kt, dist: 26, yaw: 18, pitch: 50, dim: 0.25 }
---

<div class="readout gold-k">

<p class="kicker">CERN · 2026 m. rugsėjis</p>

<div class="big gold"><Count :from="0" :to="1.8" :ms="1800" :decimals="1" /><span class="unit">CHF</span></div>

grąžos iš kiekvieno į HL-LHC investuoto franko

</div>

<div class="src">M. Florio, J. Catalano: „The collider dividend“, CERN Courier, 2026 09 17 · home.cern, 2026 09 23</div>

<!--
Kalbėtojui (~0,5 min).
Sakyti: „Ir tas pats visos visuomenės mastu. Rugsėjį CERN paskelbė didelio šviesio LHC sąnaudų ir naudos analizę: kiekvienas investuotas frankas visuomenei grąžins apie 1,8 franko; iš 50 000 modeliavimų 94 % rodo teigiamą grąžą. Ir tai — visai neskaičiuojant galimų atradimų. 40 % naudos sukuria žmonės, kuriuos CERN parengė, dar 38 % — pramonė ir nemokama programinė įranga. O maždaug trys iš keturių žmonių, išėjusių iš CERN, dirba pramonėje — galbūt ir jūsų įmonėje.“
Alumni: „Around three-quarters of CERN alumni move into industry“, vidutinis algos priedas ~4 % (Technopolis ir CSIL, CERN socioekonominė studija, 2026; CERN Alumni Network, 2025 10).
Faktai: grynoji dabartinė vertė ~3,3 mlrd. CHF (2016 m. kainomis); žmogiškasis kapitalas — 40,3 % naudos, pramonės tiekėjai ir nemokama programinė įranga — 37,7 %.
-->

---
space: { at: kt, dist: 18, yaw: 120, pitch: 12, dim: 0 }
---

<div class="hero low" style="--focus: 50% 40%">
<img src="/figures/hero_lt.jpg" alt="Prezidentas Gitanas Nausėda spaudžia ranką CERN generaliniam direktoriui Markui Thomsonui, už jų CERN, Lietuvos ir ES vėliavos" />
<div class="hero-text">
<p class="kicker">Lietuva ir CERN</p>
<div class="year blue">2018</div>
<h1>Asocijuotoji narė</h1>
<p class="line">2026 m. — kreipimasis dėl <b>visateisės narystės</b></p>
</div>
<div class="credit">Prezidento G. Nausėdos vizitas CERN, 2026 01 19 · Nuotr. Marina Cavazza / CERN</div>
</div>

<!--
Kalbėtojui (~0,8 min). III dalyje — kodėl Lietuvai tai svarbu dabar.
Sakyti: „Lietuva — CERN asocijuotoji narė nuo 2018 m. sausio 8 d.; tapome pirmąja Baltijos šalimi, gavusia šį statusą. Lietuviai gali dirbti CERN, Lietuvos įmonės — dalyvauti jo pirkimuose. Lietuvos mokslininkai dirba CMS (nuo 2007 m.) ir LHCb eksperimentuose. Estija nuo 2024 m. jau visateisė narė. Šių metų sausį Prezidentas lankėsi CERN — nuotraukoje su generaliniu direktoriumi Marku Thomsonu. Rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės. CERN patvirtino, kad procedūra jau pradėta.“
Faktai: susitarimas pasirašytas 2017 06 27 Vilniuje; įsigaliojo 2018 01 08. Lietuvos įnašas 2026 m. — 1 000 000 CHF (apie 0,08 % biudžeto); visateisė narystė, LRT vertinimu, kainuotų apie 4 mln. eurų per metus (žurnalistų, ne CERN skaičius). CERN Grey Book (2026 10 07): Lietuva dalyvauja 7 eksperimentuose ir MTEP kolaboracijose — CMS (35 dalyviai), LHCb (15), DRD3 (11) ir kt.
2026 01 19 Prezidentas G. Nausėda su M. Thomsonu nusileido į CMS požeminę salę ir LHC tunelį; tą pačią dieną CERN pasirašė ketinimų memorandumus su įmonėmis „Ekspla“, „Ostaralab“ ir „Sargasas“ (apie jas — kitoje skaidrėje).
Šaltiniai: home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20, Hamel de Monchenault: „The membership procedure has already started“); home.cern/presidential-visits-cern-0; greybook.cern.ch.
-->

---
space: { at: kt, dist: 18, yaw: 160, pitch: 14, dim: 0.45 }
---

<div class="head">

# Lietuvos įmonėms

</div>

<div class="stats three gold">
<div class="stat"><div class="n">Tiekti</div><p class="l">CERN perka už ~600 mln. CHF per metus</p></div>
<div class="stat"><div class="n">Kurti FCC</div><p class="l">Ekspla · Ostaralab · Sargasas</p></div>
<div class="stat"><div class="n">Perimti</div><p class="l">CERN technologijas — per Inovacijų agentūrą</p></div>
</div>

<div class="src">business-with-cern.web.cern.ch: Member States statuses 2026–2027, Who to contact · inovacijuagentura.lt (2026 01) · CERN pirkimai 2024: 613 mln. CHF</div>

<!--
Kalbėtojui (~1 min). Kvietimas veikti.
Sakyti: „Ką tai reiškia jums? Pirma — CERN yra klientas: 2024 m. jis pirko prekių ir paslaugų už 613 mln. frankų. Dešimt su viršum Lietuvos įmonių jau tiekia CERN elektroniką, radijo dažnių įrangą, optiką, fotoniką ir mechaniką. Pavyzdys: 2021 m. „Light Conversion“ laimėjo atvirą CERN konkursą — atitiko visus reikalavimus ir pasiūlė geresnę kainą; jos lazeris PHAROS buvo pasirinktas išmušti elektronus iš fotokatodo CERN greitintuve CLEAR. O dabar naujiena: CERN oficialiame 2026–2027 m. sąraše Lietuva pažymėta kaip asocijuotoji narė, jau pasiekusi 2026 m. tiekimo užsakymų lubas. Mūsų pramonė šiems metams jau išnaudojo tai, ką leidžia asocijuotosios narės statusas — dar vienas argumentas už visateisę narystę. Antra — FCC: šių metų sausį „Ekspla“, „Ostaralab“ ir „Sargasas“ pasirašė su CERN ketinimų memorandumus dėl FCC technologijų ir tiekimo grandinių. Trečia — CERN technologijų licencijos ir bendri MTEP projektai. Jei šiandien įsiminsite tik vieną dalyką, tebūnie tai: užsiregistruokite CERN tiekėjų portale ir parašykite CERN pramonės ryšių pareigūnei Inovacijų agentūroje. Kai durys atsivers plačiau, būkite pirmieji eilėje.“
Light Conversion: 2021 m. birželį laimėjo atvirą CERN konkursą (atitiko specifikaciją, pasiūlė geresnę kainą); PHAROS, kurio spinduliuotė paversta UV, pasirinktas fotokatodo lazeriu CLEAR greitintuvui (lightcon.com, 2021 06 18). Ar jis tebeveikia 2026 m., nepatvirtinta — nesakyti „dabar“. Nuo 2018 m. CERN iš Lietuvos įmonių pirko už ~2,5 mln. CHF (VU rektoriaus R. Petrausko duomenimis, LRT, 2026 m. birželis).
Faktai: pirkimai nuo 50 000 CHF siunčiami ir nacionaliniams pramonės ryšių pareigūnams; >400 000 CHF — rinkos tyrimas ir konkursas; reikia registruotis CERN tiekėjų portale. Paslaugų sutartims Lietuva — „poorly balanced“ (yra vietos). Lietuvos CERN BIC (2019, Sunrise Valley ir Kauno MTP) — 40 000 EUR startuoliams (ar centras dar veikia, nepatikrinta: cern.lt domenas 2026 10 nebeaktyvus). Nuo 2018 m. ~2,5 mln. CHF — VU rektorius R. Petrauskas, LRT, 2026 m. birželis. Pramonės ryšių pareigūnė — Aušrinė Krištopaitytė (Inovacijų agentūra).
-->

---
layout: statement
space: { at: close }
---

# Ačiū

<div class="mt-md">Klausimai</div>

<p class="contacts">lhcb-vilnius.web.cern.ch · kt.cern · business-with-cern.web.cern.ch</p>

<!--
Pabaigai (~0,4 min, prieš klausimus).
Sakyti: „Žiniatinklio, jutiklinio ekrano ar spalvoto rentgeno iš CERN niekas neužsakė. Jie atsirado, nes fizikai sprendė savo problemas. Tokių uždavinių iškils kuriant FCC, didelio šviesio LHC ir atnaujinant LHCb. Kitos inovacijos gims ten pat. Klausimas tik vienas — ar jos bus lietuviškos. Lietuvos mokslininkai jau ten, trys Lietuvos įmonės jau pasirašė su CERN memorandumus dėl FCC. Laukiame jūsų. Ir kai kitą kartą kas nors atneš jums „miglotą, bet įdomią“ idėją — neišmeskite jos. Taip prasidėjo žiniatinklis.“
Kalbėtojui. Kamera grįžta ten, kur prasidėjo; ilgiausias skrydis (~4,5 s). Pentakvarkas išsibarsto ir vėl susirenka; „c“ — dar kartą.
Trukmė: kalba ~20,5 min; klipai — įžanginis 4:26 (naujasis orbitinis — pagal jo trukmę), CERN iš oro 0:11, LHCb skrydis 0:56; iš viso apie 26 min. Jei skirta 20 min: įžanginį klipą trumpinti iki ~1,5 min (−3), praleisti Higso skaidrę (−0,6), duomenų ir superlaidumo skaidres sutrumpinti iki vieno sakinio (−1), praleisti dešimtuką (−0,8). Paslėpta atsarginė skaidrė „Ir tai dar ne viskas“ (Geant4, ROOT, Zenodo ir kt.) — rodyti tik paklausus.
-->
