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
title: Nuo Vilniaus iki visatos pakraščių ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje
info: |
  Innoday 2026, in Lithuanian. The slides carry a picture, a number or a short
  headline; what is said is in the speaker notes. One world of grains
  (slidev-addon-stage, blue palette): the pentaquark LHCb discovered (cover,
  Part II, close), the LHC ring (CERN), a spiral galaxy (the edge of the
  Universe, antimatter), a web of linked nodes (what CERN gave the world) and a
  gold seed with a loop of nodes round it (knowledge transfer). Opener:
  vu_ff_zoom.mp4, the NFTMC / VU Faculty of Physics zoom-out (talk-owned,
  copied from the World of Particles release); the other clips are library
  clips. Facts verified 7 Oct 2026; sources in the footers and the notes.
  Keys on a video slide: p play/pause, + / - volume. On a station: c builds
  what stands there again.
layout: cover
space:
  at: wide
---

# Innoday 2026

# Nuo Vilniaus iki visatos pakraščių

## ir atgal prie novatoriškų mokslo pasiekimų pritaikymo privačiame sektoriuje

<div class="mt-md">Dr. Mindaugas Šarpis · LHCb Vilnius · Vilniaus universitetas</div>

<!--
Kalbėtojui (~0,5 min). Prieš pradedant paspausti bet kurį klavišą arba spustelėti, kad galėtų skambėti foninis garsas (naršyklė garsą įjungia tik po gesto).
Už pavadinimo iš dulkių susirenka penki kvarkai: c c̄ u u d — pentakvarkas, LHCb atradimas. Prie jo grįšime II dalyje ir pačioje pabaigoje; „c“ jį surenka iš naujo.
Sakyti: „Laba diena. Esu Mindaugas Šarpis, vadovauju Vilniaus universiteto grupei LHCb eksperimente CERN. Šiandien nukeliausime nuo Saulėtekio iki visatos pakraščių, o tada grįšime atgal — iki dalykų, kuriuos kasdien laikote rankose.“
Kol ši skaidrė rodoma, grotuvas iš anksto įkelia pirmąjį klipą.
-->

---
space: { at: [44, 6, -16], dist: 18, yaw: -30, pitch: 14 }
---

<VideoPlayer src="vu_ff_zoom.mp4" />

<!--
Kalbėtojui (4:42, su savo garso takeliu). Nutolinimas nuo VU Fizikos fakulteto / NFTMC pastato Saulėtekyje: Vilnius, Lietuva, Žemė, Paukščių Takas, galaktikos, kosminis tinklas.
Galima tylėti ir leisti žiūrėti, arba trumpai komentuoti etapus. Jei laiko mažai — „p“ sustabdo, rodyklė pirmyn eina toliau.
Kai klipas išyra į dulkes, kamera jau skrenda prie galaktikos.
-->

---
space: { at: [47, -1.5, -2], dist: 26, yaw: 30, pitch: 58, dim: 0.2 }
---

<div class="world-caption narrow">

<p class="kicker">Visatos pakraščiai</p>

# Ir atgal: iš ko visa tai sudaryta?

</div>

<!--
Kalbėtojui (~0,4 min). Pasaulyje susirenka spiralinė galaktika.
Sakyti: „Ką tik buvome kosminio tinklo mastu. Dabar — atgal, į patį mažiausią mastą. Žvaigždės, planetos ir mes patys sudaryti iš tų pačių kelių rūšių dalelių. Kad jas suprastų, Europa prieš 72 metus įkūrė didžiausią pasaulyje dalelių fizikos laboratoriją — CERN.“
Pastaba: „žvaigždės, planetos ir mes“ — tyčia ne „galaktikos“: didžioji galaktikų masės dalis yra tamsioji materija, kurios sudėties nežinome.
-->

---
layout: section
space: { at: [12.5, -3.4, 0], dist: 19, yaw: -30, pitch: 24, dim: 0.08 }
---

# I dalis · CERN

Didžiausia pasaulio dalelių fizikos laboratorija

<!--
Kalbėtojui (~0,2 min). Pasaulyje — LHC žiedas: du protonų paketai skrieja priešingomis kryptimis ir susitinka du kartus per ratą; iš kiekvieno susitikimo išlekia dalelių pėdsakai.
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
Sakyti: „CERN gimė iš idėjos, kad buvę priešai gali kartu daryti mokslą. Po Antrojo pasaulinio karo 12 Europos valstybių susitarė kartu tirti, iš ko sudarytas pasaulis: 1953 m. pasirašyta konvencija, 1954 m. rugsėjo 29 d. CERN oficialiai įsteigtas. Šiandien — 25 valstybės narės ir 11 asocijuotųjų; naujausios narės — Estija (2024) ir Slovėnija (2025). CERN dirba apie 2 500 darbuotojų, o su juo — 12 639 registruoti mokslininkai iš daugiau nei 110 tautybių.“
Faktai: steigėjos — Belgija, Danija, Prancūzija, VFR, Graikija, Italija, Nyderlandai, Norvegija, Švedija, Šveicarija, JK, Jugoslavija. Asocijuotosios narės (11): Brazilija, Čilė, Kroatija, Kipras (parengiamasis etapas), Indija, Airija, Latvija, Lietuva, Pakistanas, Turkija, Ukraina. 2026 m. biudžeto įnašai — apie 1,28 mlrd. CHF.
Šaltiniai: home.cern/about/who-we-are/our-history; home.cern/about/who-we-are/member-states; usersoffice.web.cern.ch (2025 m. statistika); fap-dep.web.cern.ch (2026 m. įnašai).
-->

---
space: { at: collider, dist: 18, yaw: -62, pitch: 12, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/lt_president_2026.jpg" alt="Prezidentas Gitanas Nausėda spaudžia ranką CERN generaliniam direktoriui Markui Thomsonui, už jų CERN, Lietuvos ir ES vėliavos" />
<div class="credit">Prezidento G. Nausėdos vizitas CERN, 2026 01 19 · Nuotr. Marina Cavazza / CERN</div>
</figure>
<div class="text">

<p class="kicker">Lietuva ir CERN</p>

<div class="year blue">2018</div>

# Asocijuotoji narė

<div class="today">2026 m. — kreipimasis dėl <b>visateisės narystės</b></div>

</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „Lietuva — CERN asocijuotoji narė nuo 2018 m. sausio 8 d.; buvome pirmoji Baltijos šalis su šiuo statusu. Lietuviai gali dirbti CERN, Lietuvos įmonės — dalyvauti jo pirkimuose. Lietuvos mokslininkai dirba CMS (nuo 2007 m.) ir LHCb eksperimentuose. Estija nuo 2024 m. jau visateisė narė. Šių metų sausį Prezidentas lankėsi CERN — nuotraukoje su generaliniu direktoriumi Marku Thomsonu. Rugpjūčio 21 d. Ministras Pirmininkas nusprendė oficialiai kreiptis dėl visateisės narystės, ir CERN patvirtino, kad procedūra jau pradėta.“
Faktai: susitarimas pasirašytas 2017 06 27 Vilniuje; įsigaliojo 2018 01 08. Lietuvos įnašas 2026 m. — 1 000 000 CHF (apie 0,08 % biudžeto); visateisė narystė, LRT vertinimu, kainuotų apie 4 mln. eurų per metus (žurnalistų, ne CERN skaičius). CERN Grey Book (2026 10 07): Lietuva dalyvauja 7 eksperimentuose ir R&D kolaboracijose — CMS (35 dalyviai), LHCb (15), DRD3 (11) ir kt.
2026 01 19 Prezidentas G. Nausėda su M. Thomsonu nusileido į CMS urvą ir LHC tunelį; tą pačią dieną CERN pasirašė ketinimų memorandumus su Ekspla, Ostaralab ir Sargasas (apie juos — IV dalyje).
Šaltiniai: home.cern/lithuania-becomes-associate-member-state-cern; lrv.lt (2026 08 26); lrt.lt/en (2026 09 20, Hamel de Monchenault: „The membership procedure has already started“); home.cern/presidential-visits-cern-0; greybook.cern.ch.
-->

---
space: { at: collider, dist: 11, yaw: -48, pitch: 9, dim: 0.4 }
---

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
Kalbėtojui (~0,8 min).
Sakyti: „LHC — 26,7 km žiedas apie 100 m po žeme, Prancūzijos ir Šveicarijos pasienyje. 1 232 superlaidūs magnetai darbo metu atšaldomi iki 1,9 kelvino — šalčiau nei kosmosas (2,7 K). 6,8 TeV protonai skrieja tik 2,85 m/s lėčiau už šviesą — tai 99,99999905 % šviesos greičio; per sekundę jie apskrieja žiedą 11 245 kartus. Kiekvieną sekundę ATLAS ir CMS viduje įvyksta apie pusantro milijardo protonų susidūrimų.“
Svarbu: šiuo metu (nuo 2026 06 29) LHC neveikia — prasidėjo 3-iasis ilgasis sustojimas, greitintuvas atšildytas ir atnaujinamas. Todėl „darbo metu“.
Faktai: 9 593 magnetai; vakuumas vamzdyje ~10⁻¹³ bar; pluošto energija iki 490 MJ (Run 3). Dažnai cituojamas „99,9999991 %“ atitinka projektinę 7 TeV energiją.
Šaltinis: home.cern/science/accelerators/large-hadron-collider.
-->

---
space: { at: [24, 6, -14], dist: 18, yaw: -24, pitch: 14 }
---

<VideoPlayer src="cern_footage_2022_013_001.mp4" />

<!--
Kalbėtojui. Tikras LHC tunelis, važiuojant palei magnetus (CERN-FOOTAGE-2022-013-001). Klipas 4:13 — kadras nesikeičia, todėl pakanka ~30–40 s; tada pirmyn.
Galima sakyti: „Mėlyni cilindrai — dipoliniai magnetai, kiekvienas 15 m ilgio. Jų viduje du vamzdžiai, kuriais priešingomis kryptimis skrieja protonai.“
-->

---
space: { at: collider, dist: 20, yaw: 40, pitch: 30, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/higgs_cms_2012.jpg" alt="CMS detektoriaus įvykis: Higso bozono kandidatas, skylantis į du elektronus ir du miuonus" />
<div class="credit">Higso bozono kandidatas CMS detektoriuje, 2012 · CMS Collaboration / CERN, CC BY-SA 4.0</div>
</figure>
<div class="text">

<p class="kicker">Atradimas</p>

<div class="year blue">2012</div>

# Higso bozonas

<div class="today">Nobelio premija — 2013 m.</div>

</div>
</div>

<!--
Kalbėtojui (~0,6 min).
Sakyti: „Garsiausias LHC atradimas — Higso bozonas. 2012 m. liepos 4 d. ATLAS ir CMS jį paskelbė vienu metu. Jį numatė 1964 m. pasiūlytas mechanizmas, paaiškinantis, kodėl elementariosios dalelės turi masę — jo ieškota beveik pusę amžiaus. 2013 m. Nobelio premiją gavo François Englert'as ir Peteris Higgsas, o premijos motyvuose įvardyti ATLAS ir CMS eksperimentai.“
Nuotraukoje: 2012 m. gegužės 27 d. CMS įvykis, Higso bozono kandidatas H → ZZ → 2e2μ.
Šaltinis: home.cern (Nobelio premija 2013 10 08); cds.cern.ch/images/CMS-PHO-EVENTS-2012-007-1.
-->

---
space: { at: collider, dist: 32, yaw: 0, pitch: 72, dim: 0.3 }
---

<div class="readout">

<p class="kicker">2025 m. gruodis</p>

<div class="big"><Count :from="0" :to="1" :ms="1400" /><span class="unit">EB</span></div>

milijonas terabaitų LHC duomenų

</div>

<div class="src">home.cern: CERN hits one exabyte of stored experimental data (2025) · home.cern/science/computing/grid</div>

<!--
Kalbėtojui (~0,6 min).
Sakyti: „2025 m. gruodį CERN peržengė vieno eksabaito ribą — milijonas terabaitų LHC duomenų, daugiausia maždaug 60 000 magnetinių juostų. Ir tai, CERN skaičiavimu, tik apie 10 % to, ką reikės saugoti ir apdoroti per artimiausius dešimt metų. Duomenis apdoroja pasaulinis LHC skaičiavimo tinklas: daugiau nei 170 centrų 42 šalyse, apie 1,4 mln. procesorių branduolių.“
WLCG: 1,5 EB saugyklos, >2 mln. užduočių per dieną; CERN pats teikia ~20 % išteklių. Lietuva 2005 m. prisidėjo prie BalticGrid (Vilniaus klasteris CMS 2007 m. atidavė 100 000 CPU valandų).
-->

---
space: { at: collider, dist: 42, yaw: -12, pitch: 62, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/fcc_map.jpg" alt="Siūlomo 91 km FCC žiedo aplink Ženevą žemėlapis šalia LHC žiedo" />
<div class="credit">Būsimojo žiedinio greitintuvo (FCC) trasa · Daniel Dominguez / CERN</div>
</figure>
<div class="text">

<p class="kicker">Ateitis</p>

<div class="year blue">91 km</div>

# Kitas žiedas

<div class="today">Privatūs rėmėjai pažadėjo <b>~860 mln. eurų</b></div>

</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „Šiais metais CERN žengė didelį žingsnį. Birželio 27 d. LHC paskutinį kartą sukosi protonai — trečiasis etapas baigtas; iki 2030 m. greitintuvas perstatomas į didelio šviesio LHC, kad duotų dešimt kartų daugiau susidūrimų nei pradinis projektas. Gegužės 22 d. Budapešte CERN Taryba priėmė atnaujintą Europos dalelių fizikos strategiją: kitas flagmanas — 90,7 km FCC-ee; sprendimas statyti laukiamas apie 2028 m. O pernai gruodį privatūs rėmėjai — Breakthrough Prize fondas, Erico ir Wendy Schmidtų fondas, Johnas Elkannas ir Xavieras Nielis — pažadėjo apie 860 mln. eurų. Tai pirmas kartas CERN istorijoje.“
Faktai: FCC galimybių studija (2025 03 31): 90,7 km, vidutinis gylis ~200 m, FCC-ee kaina ~15 mlrd. CHF per ~12–15 metų. Pažadai priklauso nuo valstybių narių sprendimo. HL-LHC fizika — nuo 2030 m. birželio iki 2041 m.
Šaltiniai: home.cern/cern-bids-farewell-to-the-lhc-and-enters-long-shutdown-3/; council.web.cern.ch (2026 05 22 rezoliucija); home.cern/private-donors-pledge-860-million-euros-cerns-future-circular-collider/; cerncourier.com/a/fcc-feasibility-study-complete/.
-->

---
layout: section
space: { at: [47.5, -2.6, -2], dist: 17, yaw: -20, pitch: 40, dim: 0.08 }
---

# II dalis · LHCb

Kur dingo antimaterija?

<!--
Kalbėtojui (~0,2 min). Vėl galaktika — nes II dalies klausimas yra apie visą Visatą.
-->

---
space: { at: cosmos, dist: 14, yaw: -40, pitch: 25, dim: 0.2 }
---

<div class="world-caption narrow">

<p class="kicker">Didžiausia Visatos mįslė</p>

# Kodėl mes egzistuojame?

</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „Didysis sprogimas turėjo sukurti po lygiai materijos ir antimaterijos, o susitikusios jos viena kitą sunaikina — liktų tik šviesa. Bet mes čia, ir Visata sudaryta iš materijos. Vadinasi, gamta kažkur truputį „palankesnė“ materijai. LHCb ieško mažyčių dalelių ir antidalelių skirtumų: tiria dalelių su gražiuoju (b) ir žaviuoju (c) kvarkais skilimus ir lygina juos su antidalelių skilimais.“
Kontekstas: Standartinio modelio CP pažeidimo nepakanka paaiškinti stebimą materijos perteklių (barionų ir fotonų santykis ~10⁻¹⁰, SM duoda ~10⁻¹⁸).
Šaltinis: home.cern/science/experiments/lhcb.
-->

---
space: { at: [56, 5, -14], dist: 16, yaw: -28, pitch: 12 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" />

<!--
Kalbėtojui (0:56, be garso — komentuoti). LHCb detektoriaus 3D animacija (CERN-FOOTAGE-2022-042-001).
Sakyti: „LHCb — ne cilindras aplink susidūrimo tašką kaip ATLAS ar CMS, o 20 m ilgio „teleskopas“, žiūrintis viena kryptimi: gražieji kvarkai dažniausiai išlekia pirmyn, arti pluošto. Pirmiausia — VELO, pikselių detektorius vos 5 mm nuo pluošto; toliau magnetas, sekimo sistemos, RICH detektoriai dalelėms atpažinti, kalorimetrai ir miuonų kameros.“
-->

---
space: { at: cosmos, dist: 20, yaw: 30, pitch: 45, dim: 0.4 }
---

<div class="head">

# LHCb detektorius

</div>

<div class="stats">
<div class="stat"><div class="n">5 600<small>t</small></div><p class="l">svoris</p></div>
<div class="stat"><div class="n">5,1<small>mm</small></div><p class="l">nuo protonų pluošto</p></div>
<div class="stat"><div class="n">30<small>mln./s</small></div><p class="l">detektoriaus nuskaitymų</p></div>
<div class="stat"><div class="n">~2 000</div><p class="l">kolaborantų</p></div>
</div>

<div class="src">home.cern/science/experiments/lhcb · LHCb Upgrade I, arXiv:2305.10515 · LHCb, 2025–2026</div>

<!--
Kalbėtojui (~0,6 min).
Sakyti: „LHCb sveria 5 600 tonų: 21 m ilgio, 10 m aukščio, 100 m po žeme. Atnaujintame VELO artimiausias pikselis — vos 5,1 mm nuo protonų pluošto. Visas detektorius nuskaitomas 30 milijonų kartų per sekundę. O kolaboracijoje — beveik 2 000 žmonių iš daugiau nei 100 institucijų.“
Faktai: VELO nuo 2022 m.: 5,1 mm (anksčiau 8,2 mm), 52 moduliai, ~41 mln. 55 µm pikselių. Nuskaitoma kiekvieną netuščią paketų susitikimą — ~30 MHz. Kolaboracija 2025 04 29: 1 784 nariai, 102 institucijos, 24 šalys; 2026 m. birželį LHCb skelbė, kad „artėja prie 2 000 narių“ (dvigubai daugiau nei prieš 15 metų). Nuo 2026 07 01 atstovas — Timas Gershonas.
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
Sakyti: „Tiek duomenų LHCb gauna kas sekundę — apie 4 terabaitus. Nuo 2022 m. elektroninio filtro nebėra: pirmąją atranką daro „Allen“ programa vaizdo plokštėse (GPU) — tokiose pat kaip žaidimų kompiuteriuose. LHCb buvo pirmasis eksperimentas su visu didelio pralaidumo trigeriu GPU. Antroji pakopa — daugiau nei 3 000 serverių. Į diską patenka ~10 GB/s, maždaug vienas baitas iš keturių šimtų. Rekonstrukcija, kalibravimas ir analizė vyksta realiuoju laiku.“
Faktai: GPU — NVIDIA RTX A5000; vietų ~500, bazinei HLT1 reikia ~200.
-->

---
space: { at: [-29.5, 0.2, 0], dist: 11, yaw: -10, pitch: 6, dim: 0.15 }
---

<div class="world-caption narrow">

<p class="kicker">LHCb · 2015</p>

# Pentakvarkas

76 iš 86 naujų LHC hadronų atrado LHCb

</div>

<div class="src">LHCb, PRL 115 (2015) 072001 · P. Koppenburg, New particles discovered at the LHC (2026 09 21)</div>

<!--
Kalbėtojui (~0,7 min). Kamera grįžta prie pradžios pentakvarko; „c“ surenka jį iš naujo.
Sakyti: „Štai kodėl pradžioje matėte penkis šviesos kamuoliukus: dalelė iš penkių kvarkų — dviejų u, vieno d, žaviojo kvarko c ir jo antikvarko. 1964 m. Gell-Mannas ir Zweigas pasiūlė kvarkų modelį, ir jau tada buvo aišku, kad tokios dalelės gali egzistuoti. Jų ieškota daugiau nei 50 metų; 2015 m. liepos 14 d. LHCb jas pamatė Λb skilimuose. 2019 m., su devynis kartus daugiau duomenų, paaiškėjo, kad tai kelios siauros būsenos — galbūt net „molekulės“ iš bariono ir mezono. Iš 86 naujų hadronų, atrastų LHC, 76 atrado LHCb.“
Skaičius: Koppenburgo sąraše „86 hadrons have been discovered at the LHC, of which 76 by LHCb“ (paskutinis įrašas 2026 09 21, Bs0*(5700)0).
-->

---
space: { at: hero, dist: 14, yaw: 25, pitch: 18, dim: 0.3 }
---

<div class="head">

# Naujausi LHCb atradimai

</div>

<div class="stats three">
<div class="stat"><div class="n">2025</div><p class="l">materijos ir antimaterijos skirtumas barionuose</p></div>
<div class="stat"><div class="n">2026</div><p class="l">dvigubai žavūs barionai Ξcc⁺ ir Ωcc⁺</p></div>
<div class="stat"><div class="n">2026</div><p class="l">duomenys kosminei antimaterijai suprasti</p></div>
</div>

<div class="src">LHCb, Nature 643 (2025) 1223 · lhcb-outreach.web.cern.ch: 2026 03 17, 2026 06 03, 2026 05 27 · VU naujienos, 2026 04 03</div>

<!--
Kalbėtojui (~0,9 min).
1) Sakyti: „2025 m. LHCb pirmą kartą pamatė materijos ir antimaterijos elgesio skirtumą barionuose — dalelių šeimoje, kuriai priklauso protonai ir neutronai.“ >80 000 Λb⁰ → p K⁻ π⁺ π⁻ skilimų, asimetrija (2,45 ± 0,47) %, 5,2σ; paskelbta Moriond 2025 03 25, Nature 2025 07 16.
2) Sakyti: „Šiemet kovą ir birželį LHCb atrado du naujus dvigubai žavius barionus. Ξcc⁺ atnaujintu detektoriumi rastas per vienus metus — senuoju to nepavyko per dešimtmetį.“ Ξcc⁺ (ccd), 7σ, ~3,9 karto sunkesnis už protoną, pirmoji nauja dalelė su atnaujintu detektoriumi (2026 03 17); Ωcc⁺ (ccs), 8,7σ (2026 06 03, arXiv:2609.21921). Taip LHCb atrado visus tris dvigubai žavius barionus (Ξcc⁺⁺ — 2017). Dr. Adamas Morrisas iš mūsų grupės komentavo atradimą.
3) Sakyti: „Balandį LHCb į greitintuvo vamzdį leido šešias dujas ir užrašė po milijardą susidūrimų — tai padės suprasti antimateriją, kurią kosmose matuoja AMS ir PAMELA.“ LHC dirbo 1,2 TeV energija; SMOG2: H, D, He, Ne, Ar, Xe.
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
Sakyti: „2024 m. rugsėjo 2 d. LHCb kolaboracijos taryba vienbalsiai priėmė Vilniaus universitetą — Lietuva tapo nauja LHCb šalimi. Grupė veikia VU Fizikos fakulteto Fotonikos ir nanotechnologijų institute: dirbame su LHCb duomenų srautu, simuliacijomis, detektorių kūrimu ir charakterizavimu bei duomenų analize. Rūta Racz — pirmoji VU doktorantė ir pirmoji moteris iš Lietuvos LHCb eksperimente; ji ieško pentakvarkų ir budi LHCb valdymo salėje.“
„Visus 2011–2012 m. LHCb duomenis — 800 TB — viešai prieinamus parengiau aš; nuo 2023 m. gruodžio juos gali parsisiųsti bet kas, o nuo 2026 m. kovo per internetinę paslaugą galima gauti ir antrojo etapo duomenis (>4 PB). Nuo šių metų rugpjūčio koordinuoju LHCb atvirųjų duomenų darbą.“
„Rugsėjo 14–18 d. Vilniuje vyko LHCb savaitė — pirmą kartą Lietuvoje: apie 200 dalyvių gyvai ir keli šimtai nuotoliu.“
Grupė: M. Šarpis, R. Aleksiejūnas, O. Kravcov, A. Morris, A. Vaitkevičius, R. Racz, Š. Jacevičius ir studentai (lhcb-vilnius.web.cern.ch).
-->

---
space: { at: hero, dist: 22, yaw: 72, pitch: 14, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/lhcb_velo.jpg" alt="Montuojama pusė naujojo LHCb VELO detektoriaus su pikselių moduliais ir raudonais kabeliais" />
<div class="credit">Naujojo LHCb VELO montavimas, 2022 m. gegužė · Nuotr. Julien Marius Ordan / CERN</div>
</figure>
<div class="text">

<p class="kicker gold">Tiltas į kasdienybę</p>

<div class="year">55 µm</div>

# Lustas, apsukęs ratą

<div class="today">fizika → medicina → vėl fizika</div>

</div>
</div>

<!--
Kalbėtojui (~0,6 min). Perėjimas į III dalį.
Sakyti: „Ir čia mano eksperimentas susitinka su jūsų pasauliu. LHCb VELO detektoriuje — 41 milijonas 55 mikrometrų pikselių. Juos skaito VeloPix lustai, sukurti pagal CERN Timepix3. Hibridinių pikselių technologija gimė dalelių fizikai, vėliau Medipix kolaboracija ją pritaikė medicininiam rentgenui, o VeloPix — ta pati technologija, grįžusi į dalelių fiziką. Ta pati lustų šeima šiandien daro spalvotas rentgeno nuotraukas ir skrido aplink Mėnulį. Tokių istorijų CERN turi daug.“
Faktai: VeloPix — 256 × 256 pikselių po 55 µm, 130 nm CMOS, iki 900 mln. signalų per sekundę (Timepix3 — 80 mln.), atsparus >4 MGy dozei. CERN Medipix puslapis VeloPix vadina „a direct spin back to high-energy physics“.
-->

---
layout: section
space: { at: [84.2, -2.2, 0], dist: 13, yaw: -22, pitch: 16, dim: 0.08 }
---

# III dalis

Ką CERN davė pasauliui

<!--
Kalbėtojui (~0,2 min). Pasaulyje — tinklas: mazgai, sujungti tekančių grūdelių gijomis.
-->

---
layout: statement
space: { at: web, dist: 9, yaw: 10, pitch: 5, dim: 0.3 }
---

# Kiekvienas iš jūsų šiandien jau naudojosi CERN išradimu

<!--
Kalbėtojui (~0,4 min). Klausimas salei.
Sakyti: „Pakelkite ranką, kas šiandien atsidarė bent vieną interneto svetainę. O kas palietė telefono ekraną? … Greičiausiai — ne vienu. Tai CERN istorijos dalis.“
-->

---
space: { at: web, dist: 15, yaw: -52, pitch: 20, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/web_proposal_1989.jpg" alt="1989 m. kovo pasiūlymo „Information Management: A Proposal“ pirmasis puslapis su ranka užrašyta pastaba „Vague but exciting…“" />
<div class="credit">T. Berners-Lee pasiūlymas su M. Sendallo pastaba, CERN ekspozicija · Nuotr. Sailko, CC BY 3.0</div>
</figure>
<div class="text">

<p class="kicker gold">Žiniatinklis</p>

<div class="year">1989</div>

# „Vague but exciting…“

<div class="today">„Miglota, bet įdomu…“</div>

</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1989 m. kovą CERN programuotojas Timas Berners-Lee parašė dokumentą „Information Management: A Proposal“ — kaip CERN tvarkyti informaciją apie milžiniškus projektus. Jo vadovas Mike'as Sendallas ant viršelio užrašė tris žodžius: „Vague but exciting…“ — „Miglota, bet įdomu…“. Atkreipkite dėmesį, kokia problema buvo sprendžiama: CERN — tūkstančiai žmonių, kurie ateina vidutiniškai dvejiems metams ir išeina, o informacija pasimeta. Pirmasis pasiūlymo sakinys: „Taip, bet kaip mes kada nors susigaudysime tokiame dideliame projekte?“ — apie LHC erą. Žiniatinklis gimė iš fizikų poreikio.“
1990 m. lapkričio 12 d. formalus projekto pasiūlymas (su Robert'u Cailliau) prašė vos 4 programų inžinierių ir programuotojo maždaug pusmečiui. Mažytė komanda — pasaulinis rezultatas.
Šaltiniai: w3.org/History/1989/proposal.html; w3.org/Proposal.html.
-->

---
space: { at: web, dist: 15, yaw: -28, pitch: 14, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/web_next_1990.jpg" alt="NeXT kompiuteris su lipduku „This machine is a server. DO NOT POWER IT DOWN!!“" />
<div class="credit">Pirmasis žiniatinklio serveris, CERN, 1990 · Nuotr. Patrice Loïez / CERN, CC BY-SA 4.0</div>
</figure>
<div class="text">

<p class="kicker gold">Žiniatinklis</p>

<div class="year">1993</div>

# Atiduotas pasauliui

<div class="today"><b>~1,5 mlrd.</b> svetainių · <b>~6 mlrd.</b> žmonių internete</div>

</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1990 m. pabaigoje šis NeXT kompiuteris tapo pirmuoju žiniatinklio serveriu: info.cern.ch. Lipdukas ant jo: „This machine is a server. DO NOT POWER IT DOWN!!“ — jei kas būtų išjungęs, būtų išjungęs visą tuometinį žiniatinklį. Bet svarbiausias sprendimas buvo ne techninis: 1993 m. balandžio 30 d. du CERN direktoriai pasirašė dokumentą, kuriuo CERN atsisakė visų intelektinės nuosavybės teisių į žiniatinklio programinę įrangą — ja galėjo naudotis bet kas. Todėl žiniatinklis tapo visų. Šiandien — beveik pusantro milijardo svetainių ir apie 6 milijardai žmonių internete.“
Nesakyti „CERN išrado internetą“: internetas egzistavo anksčiau; CERN sukūrė žiniatinklį (WWW), veikiantį internete.
Faktai: pirmasis viešas paskelbimas — 1991 08 06 alt.hypertext grupėje; pirmasis serveris už Europos ribų — 1991 12 12, SLAC (irgi dalelių fizikos laboratorija). 1994 m. pabaigoje — 10 000 serverių, 10 mln. vartotojų. Netcraft, 2026 m. liepa: 1 494 915 628 svetainės; ITU: ~6 mlrd. žmonių (74 %) internete 2025 m. T. Berners-Lee — 2016 m. Turingo premija.
Šaltiniai: home.cern/science/computing/the-birth-of-the-web/; netcraft.com (2026 07); itu.int.
-->

---
space: { at: web, dist: 15, yaw: -4, pitch: 10, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/touch_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" />
<div class="credit">Bentas Stumpe su jutiklinio ekrano plokšte, 2016 · Nuotr. Sophia Elizabeth Bennett / CERN, CC BY 4.0</div>
</figure>
<div class="text">

<p class="kicker gold">CERN SPS valdymo pultas</p>

<div class="year">1973</div>

# Jutiklinis ekranas

<div class="today"><b>1,26 mlrd.</b> išmaniųjų telefonų per metus</div>

</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „1972 m. kovo 11 d. CERN inžinierius Bentas Stumpe ranka parašė pasiūlymą: ekranas su programuojamais mygtukais, kuriuos liečiate pirštu. Su Franku Becku jie sukūrė skaidrų talpinį jutiklinį ekraną naujajam SPS greitintuvui valdyti. Vario linijos ant stiklo — 80 mikrometrų pločio ir tiek pat tarpų, todėl nematomos. Ekranai naudoti nuo 1973 m.; kai 1976 m. SPS pradėjo darbą, jo valdymo pultuose jau buvo jutikliniai ekranai. Nuotraukoje — Stumpe su savo ekrano plokšte ir išmaniuoju telefonu. 2025 m. pasaulyje pagaminta 1,26 mlrd. išmaniųjų telefonų.“
Sąžiningai: tai vienas pirmųjų talpinių jutiklinių ekranų pasaulyje, ne pirmasis — pirmąjį talpinį jutiklinį ekraną aprašė E. A. Johnsonas (JK) 1965 m. CERN Courier CERN ekraną vadina „apparently the first application of the capacitative touch screen in the world“ ir „šiuolaikinių telefonų ekranų pirmtaku“ — tai CERN požiūris, ne įrodyta tiesioginė technologijų linija iki išmaniųjų telefonų.
Istorija: Stumpe atsisakė pasirašyti konfidencialumo sutartį dėl tolesnio X–Y ekrano, nes CERN išradimus skelbia viešai.
Šaltiniai: cerncourier.com/?p=9153; repository.cern/records/xrg56-9ha60; IDC (2026 01 13).
-->

---
space: { at: web, dist: 15, yaw: 20, pitch: 18, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/pet_ct.jpg" alt="Šiuolaikinis PET/KT skeneris ligoninės kabinete" />
<div class="credit">Šiuolaikinis PET/KT skeneris, CERMEP, Lionas · Nuotr. Romainbehar, CC0</div>
</figure>
<div class="text">

<p class="kicker gold">Medicina</p>

<div class="year">1977</div>

# PET tomografija

<div class="today">PET/KT — TIME <b>2000 m. medicinos išradimas</b></div>

</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „PET tomografija leidžia pamatyti, kur organizme vyksta medžiagų apykaita — pavyzdžiui, kur auga navikas. 1977 m. vasarą CERN fizikas Alanas Jeavonsas su savo dalelių detektoriumi ir Davidas Townsendas su vaizdų rekonstrukcijos programa gavo vieną pirmųjų PET vaizdų — pelės. Vėliau Townsendas, dirbdamas Ženevos kantono ligoninėje, suprato, kad PET reikia sujungti su kompiuterine tomografija, ir su Ronu Nuttu sukūrė PET/KT skenerį. Žurnalas TIME jį paskelbė 2000 m. medicinos išradimu; šiandien PET/KT — kasdienė onkologų priemonė. Nuotraukoje — šiuolaikinis PET/KT skeneris.“
Sąžiningai — CERN pats rašo: „PET was not invented at CERN, but the work carried out by Jeavons and Townsend made a major contribution to its development.“
Faktai: PET/KT kūrimas finansuotas nuo 1995 m., pirmieji klinikiniai vaizdai 1998 m., TIME — 2000 m. gruodį, pirmasis komercinis Siemens Biograph — 2001 m.; iki 2005 m. jau >1 000 PET/KT skenerių.
Šaltiniai: kt.cern/?p=1341; cerncourier.com/a/pet-and-ct-a-perfect-fit/; Siemens Healthineers.
-->

---
space: { at: web, dist: 15, yaw: 44, pitch: 24, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/mars_wrist.jpg" class="contain" alt="Spalvotas 3D žmogaus riešo rentgeno vaizdas: kaulai balti, minkštieji audiniai raudoni, metaliniai varžtai mėlyni" />
<div class="credit">Spalvotas 3D riešo vaizdas su Medipix3 lustu · MARS Bioimaging Ltd</div>
</figure>
<div class="text">

<p class="kicker gold">CERN Medipix</p>

<div class="year">2018</div>

# Spalvotas 3D rentgenas

<div class="today"><b>30</b> komercinių licencijų</div>

</div>
</div>

<!--
Kalbėtojui (~0,8 min).
Sakyti: „Įprastas rentgenas — nespalvota nuotrauka: jis matuoja tik, kiek spinduliuotės praėjo. CERN Medipix3 lustas skaičiuoja kiekvieną fotoną atskirai ir pamatuoja jo energiją — tarsi spalvą. Naujosios Zelandijos įmonė MARS Bioimaging, kurią įkūrė tėvas ir sūnus Philas ir Anthony Butleriai, 2018 m. liepą parodė pirmąjį spalvotą 3D žmogaus vaizdą. Nuotraukoje — riešas: kaulai balti, audiniai raudoni, metaliniai varžtai mėlyni. Medipix technologija šiandien turi 30 komercinių licencijų ir padėjo pramonei uždirbti daugiau nei 100 mln. frankų.“
Faktai: licencija tarp CERN (Medipix3 kolaboracijos vardu) ir MARS Bioimaging; įmonė įkurta 2007 m. Medipix (CERN 2026 m. studija): 30 aktyvių licencijų, >5 mln. CHF honorarų, >100 mln. CHF pramonės pajamų, 73 patentai (Philips, ASML, Siemens ir kt.), 40 % licencijų pasirašyta per pastaruosius 3 metus.
Vaizdas: MARS Bioimaging Ltd (CERN KT CDS įrašas KTTGROUP-PHO-TECH-2020-001); jei rodoma ne švietimo tikslais — paprašyti MARS leidimo.
Šaltiniai: kt.cern/first-3d-colour-x-ray-of-a-human-using-cern-technology/; kt-report-2025.web.cern.ch (socio-ekonominė studija).
-->

---
space: { at: web, dist: 16, yaw: 68, pitch: 30, dim: 0.62 }
---

<div class="feature">
<figure class="figure">
<img src="/figures/medaustron.jpg" alt="MedAustron sinchrotrono žiedas salėje, Viner Noištatas" />
<div class="credit">MedAustron sinchrotronas, Viner Noištatas (Austrija) · CERN</div>
</figure>
<div class="text">

<p class="kicker gold">Vėžio gydymas</p>

<div class="year">≈9 000</div>

# Pacientų gydyta hadronais

<div class="today">CNAO (Italija) ir MedAustron (Austrija)</div>

</div>
</div>

<!--
Kalbėtojui (~0,7 min).
Sakyti: „Protonai ir anglies jonai didžiąją energijos dalį atiduoda tam tikrame gylyje, todėl galima smogti navikui ir mažiau pažeisti aplinkinius audinius. CERN 1996–2000 m. suprojektavo atvirą sinchrotrono „įrankių rinkinį“ PIMMS. Pagal jį pastatyti du centrai: CNAO Pavijoje, Italijoje (pirmasis pacientas — 2011 m.), ir MedAustron Austrijoje (pirmasis pacientas — 2016 m. gruodį). Juose protonais ir anglies jonais gydyta beveik 9 000 pacientų su retais ir sunkiai pagydomais navikais.“
Faktai: CNAO iki 2026 m. liepos — >6 200 pacientų, vienas iš 8 pasaulio centrų, gydančių ir protonais, ir anglies jonais; MedAustron 2025 m. — ~550 pacientų, planuoja ~1 000 per metus. Kartu — beveik 9 000 (CERN socio-ekonominė studija, 2026).
CERN toliau: GaToroid — superlaidus 12 t gantris vietoj iki 270 t (≈95 % lengvesnis).
-->

---
space: { at: web, dist: 21, yaw: 95, pitch: 40, dim: 0.5 }
---

<div class="head">

# Ir tai dar ne viskas

</div>

<div class="tiles">
<div class="card"><p class="k">laikas</p><h2>White Rabbit</h2></div>
<div class="card"><p class="k">kosmosas · medicina</p><h2>Geant4</h2></div>
<div class="card"><p class="k">didieji duomenys</p><h2>ROOT</h2></div>
<div class="card"><p class="k">atvirasis mokslas</p><h2>Zenodo</h2></div>
<div class="card"><p class="k">privatumas</p><h2>Proton Mail</h2></div>
<div class="card"><p class="k">energija</p><h2>Saulės kolektoriai</h2></div>
<div class="card"><p class="k">atviroji įranga</p><h2>CERN OHL</h2></div>
<div class="card"><p class="k">COVID-19</p><h2>HEV ventiliatorius</h2></div>
</div>

<div class="src">home.cern · kt.cern · KT Report 2025 · zenodo.org (2026 10 07) · arXiv:2405.12159 · arXiv:2004.00534</div>

<!--
Kalbėtojui (~1 min). Greitai, po vieną sakinį.
White Rabbit: laiko sinchronizacija subnanosekundės tikslumu; nuo 2012 m.; IEEE 1588-2019 „High Accuracy“ profilis; Deutsche Börse — >500 prievadų, laiko žymos prekybos dalyviams; 2026 m. liepą Indija paleido demonstracinį IST tinklą (NSE Chenajuje).
Geant4: dalelių sąveikos su medžiaga modeliavimas; pirmoji versija 1998 12 15; >16 000 citavimų; padėjo suprasti, kodėl NASA Chandra teleskopas prarado jautrumą (1999).
ROOT: LHC duomenų analizės sistema, pradėta 1995 m. sausį (R. Brun, F. Rademakers); HighLO projektas — manipuliacijų biržose paieška, naudojo Deutsche Börse.
Zenodo: nemokama mokslo duomenų saugykla (2013, su OpenAIRE): 7 432 875 vieši įrašai (2026 10 07), >300 000 tyrėjų.
Proton Mail: šifruotą el. paštą 2014 m. Ženevoje sukūrė CERN susipažinę mokslininkai (Andy Yen ir kt.); beta testavo >300 CERN žmonių.
Saulės kolektoriai: LHC vakuumo NEG dangos (C. Benvenuti) → SRB Energy; 2012 m. ~300 kolektorių (1 200 m²) Ženevos oro uosto stogui.
CERN OHL: atvirosios aparatinės įrangos licencija (2011; v2 — 2020); 2026 05 07 CERN atvėrė 17 000 KiCad komponentų biblioteką.
HEV: 2020 m. kovą LHCb VELO grupė (J. Buytaert) iš detektorių dujų sistemų patirties per savaitę sukūrė veikiantį plaučių ventiliatoriaus demonstratorių.
-->

---
layout: section
space: { at: [120, -2.4, 0], dist: 14, yaw: -22, pitch: 22, dim: 0.08 }
---

# IV dalis

Iš laboratorijos į privatų sektorių

<!--
Kalbėtojui (~0,2 min). Pasaulyje — auksinė „sėkla“ ir aplink ją besisukantis mazgų ratas: žinios, išeinančios iš CERN.
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

<div class="src">CERN Knowledge Transfer Report 2025 · Technopolis ir CSIL, CERN socio-ekonominė studija (2026) · WIPO Global Innovation Index 2026</div>

<!--
Kalbėtojui (~0,9 min).
Sakyti: „Kaip tai vyksta? CERN turi žinių perdavimo grupę: licencijos, bendri MTEP projektai, startuoliai. Nuo 2011 m. — daugiau nei 700 sutarčių. Vien 2025 m. pasirašytos 89: 32 bendri MTEP projektai, 28 licencijos, 15 paslaugų ir konsultacijų, 8 startuolių sutartys; 63 partneriai — įmonės. CERN stebi apie 100 su juo susijusių startuolių. Startuoliams yra programa CERN Venture Connect: CERN neima akcijų, o 2 % honoraras mokamas tik tada, kai metiniai pardavimai pasiekia milijoną frankų. Ši programa šiemet aprašyta Pasaulinės intelektinės nuosavybės organizacijos Pasauliniame inovacijų indekse.“
Faktai: CVC — nuo 2023 m. spalio; 2026 m. spalį: 9 licencijai paruoštos technologijos, 21 startuolis, >50 partnerių. 2025 m. CVC startuoliai pritraukė 5,6 mln. CHF. Licencija — 10 metų, pasaulinė, neišimtinė, viena taikymo sritis. 2026 m. gegužę CERN pradėjo vidinę Verslumo akademiją (23 dalyviai).
Atsargiai: „27 su CERN susiję startuoliai pritraukė 3,2 mlrd. CHF“ — beveik visa suma (2,4 mlrd.) yra vienas Novartis sandoris (Advanced Accelerator Applications). Šio skaičiaus geriau nevartoti be išlygos.
CERN pačios pajamos iš licencijų kuklios (2007–2024 m. vidutiniškai ~1,5 mln. CHF per metus): tikslas — poveikis, ne honorarai.
-->

---
space: { at: [118.5, -1.6, 0], dist: 13, yaw: -30, pitch: 14, dim: 0.25 }
---

<div class="readout gold-k">

<p class="kicker">CERN tiekėjai · 2026 m. tyrimas</p>

<div class="big gold">+<Count :from="0" :to="14" :ms="1800" /><span class="unit">%</span></div>

apyvartos per penkerius metus

</div>

<div class="src">Technopolis ir CSIL, The socio-economic impact of CERN (2026) · CERN tiekėjų apklausa, 2024</div>

<!--
Kalbėtojui (~0,7 min). Pagrindinė žinia verslui.
Sakyti: „Nepriklausomas 2026 m. tyrimas palygino įmones, kurios 2016–2024 m. pirmą kartą gavo CERN užsakymą, su panašiomis įmonėmis, kurios jo negavo. Per penkerius metus jų apyvarta augo 14 % sparčiau, darbuotojų skaičius — 13 %, patentų — 15 %, nematerialusis turtas — net 63 %. 54 % tiekėjų dėl darbo su CERN įžengė į naujas rinkas. Darbas su CERN — tai bandymų poligonas technologijoms, kurių dar niekas kitas neprašo.“
Faktai: materialusis turtas +27 %; 70 % tiekėjų įgijo pažangios kompetencijos. WIFO (2025): CERN pirkimai kasmet sukuria ~680 mln. CHF pridėtinės vertės. Patentų efektas pasireiškia po 5–8 metų (arXiv:1905.09552).
Šaltinis: kt-report-2025.web.cern.ch (CERN-socio-economic-final.pdf); home.cern (2026 06 23).
-->

---
space: { at: kt, dist: 20, yaw: 40, pitch: 30, dim: 0.5 }
---

<div class="head">

# Naujausi proveržiai: sveikata

</div>

<div class="news">
<div class="card"><p class="date">2026 m. kovas</p><h2>Spalvotas rentgenas gavo JAV FDA leidimą</h2></div>
<div class="card"><p class="date">2025 m. rugsėjis</p><h2>FLASH terapija: dozė per 0,1 s</h2></div>
<div class="card"><p class="date">2025 m. pabaiga</p><h2>Aktinis-225 — pirmą kartą pramonei</h2></div>
<div class="card"><p class="date">2026 m. spalis</p><h2>DI ligoninėms be pacientų duomenų dalijimosi</h2></div>
</div>

<div class="src">kt.cern (2026 04 23) · DEFT TDR, CERN Yellow Report CYRM-2025-007 · KT Report 2025 · home.cern (2026 10 01)</div>

<!--
Kalbėtojui (~1,2 min).
1) Sakyti: „Kovą MARS Bioimaging skeneris su CERN Medipix3 lustu gavo JAV FDA leidimą — praėjus 20 metų nuo idėjos.“ FDA 510(k) nešiojamam fotonų skaičiavimo KT skeneriui rankų tyrimams. CTO A. Butleris: „Twenty years later, with the support of the Medipix Collaboration, we are starting to have a significant impact.“ 2025 m. klinikiniai tyrimai — Hospital for Special Surgery, Niujorkas.
2) Sakyti: „FLASH — visa spindulinės terapijos dozė per sekundės dalį, tausojant sveikus audinius. CERN, Lozanos ligoninė CHUV ir THERYQ paskelbė DEFT greitintuvo projektą: 140 MeV elektronai iki 25 cm gylio navikui per mažiau nei 0,1 s, CERN CLIC technologija.“ 20–30 Gy, iki 20 cm pločio. Lygiagrečiai THERYQ projektas FLASHDEEP: 38 mln. EUR iš „France 2030“, montavimas Gustave Roussy planuotas 2026 m. pabaigoje, klinikiniai tyrimai — 2027 m.
3) Sakyti: „CERN-MEDICIS pirmą kartą išsiuntė aktinio-225 pramonei — įmonei RayzeBio, kurią 2024 m. už 4,1 mlrd. dolerių įsigijo „Bristol Myers Squibb“. Aktinis-225 — vienas perspektyviausių izotopų vėžiui gydyti.“ 2025 m. CERN Taryba leido tiekti masės separatoriumi išgrynintus radionuklidus klinikiniams tyrimams; IV ketvirtį — Ac-225 RayzeBio, bandomieji siuntiniai Heidelbergo universitetinei ligoninei. PRISMAP (2021–2025): 159 siuntos, 23 radionuklidai, 47 projektai 19 šalių.
4) Sakyti: „CERN platforma CAFEIN leidžia ligoninėms kartu mokyti dirbtinį intelektą nesidalijant pacientų duomenimis. Spalio 1 d. ji įvertinta Digital@UNGA 2026 apdovanojimuose.“ „Digital Frontiers“ kategorijos antroji vieta; projektai — insultas (UMBRELLA, TRUSTroke), klinikinių sprendimų palaikymas.
-->

---
space: { at: kt, dist: 22, yaw: 80, pitch: 18, dim: 0.5 }
---

<div class="head">

# Naujausi proveržiai: kosmosas, energija, kvantai

</div>

<div class="news">
<div class="card"><p class="date">2026 m. balandis</p><h2>CERN lustai skrido aplink Mėnulį</h2></div>
<div class="card"><p class="date">2025 m.</p><h2>Superlaidi elektros linija vandeniliniams lėktuvams</h2></div>
<div class="card"><p class="date">2025 m. spalis</p><h2>Kvantinis tinklas Ženevoje</h2></div>
<div class="card"><p class="date">2025 m. rugsėjis</p><h2>Superlaidūs magnetai sintezei</h2></div>
</div>

<div class="src">home.cern: Timepix chips fly to the Moon (2026) · KT Report 2025: CERN and Airbus UpNext · unige.ch (2025 10 14) · home.cern (2025 09 10)</div>

<!--
Kalbėtojui (~1,2 min).
1) Sakyti: „Balandį šeši CERN Timepix lustai skrido su Artemis II įgula aplink Mėnulį ir realiuoju laiku matavo radiaciją Orion kapsulėje. Modulius pagamino Čekijos įmonė ADVACAM — Centrinės Europos įmonė, išaugusi iš CERN lustų.“ Artemis II — pirmoji pilotuojama kelionė link Mėnulio nuo 1972 m. (startas 2026 04 02, 00:35 CEST; nusileido 04 10). Timepix ISS naudojami nuo 2012 m. ADVACAM — Praha, įkurta 2013 m.
2) Sakyti: „Su Airbus UpNext CERN išbandė 7 m superlaidžią elektros liniją vandeniliniams lėktuvams; tęsinys skirtas 2 MW varomajai sistemai.“ SCALE (2022–2024): lanksti REBCO linija, ±2 kA iki 63 K, kabelis ~290 g/m; SAMBA (2025–2026) — Airbus Cryoprop demonstratoriui.
3) Sakyti: „Ženevoje paleistas pirmasis Šveicarijos kvantinis tinklas: 262 km šviesolaidžių, CERN White Rabbit laikas, ID Quantique ir Rolex.“ 2025 10 14: UNIGE, CERN, HEPIA, ID Quantique, Rolex, Ženevos kantonas; supainioti fotonai tarp UNIGE, CERN ir HEPIA; CERN pirmą kartą tuo pačiu šviesolaidžiu siuntė White Rabbit laiką ir supainiotus fotonus.
4) Sakyti: „CERN ir „Fusion for Energy“, valdanti Europos indėlį į ITER, susitarė kartu kurti aukštatemperatūrius superlaidžius magnetus ir bandyti medžiagas.“ Pagrindų susitarimas 2025 09 10; bendradarbiavimas nuo 2014 m.
Taip pat: CERN HEARTS — palydovų elektronikos bandymai sunkiųjų jonų pluoštu (2025 m. 16 vartotojų); CIPEA — >25 aplinkosaugos projektų, >80 % finansuoja partneriai.
-->

---
space: { at: kt, dist: 26, yaw: 130, pitch: 40, dim: 0.55 }
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
Sakyti: „Jei reikėtų išrinkti dešimt — štai mano sąrašas. Pirmosios trys pozicijos jau pakeitė kiekvieno iš mūsų gyvenimą. Paskutinės — dar tik keičia.“
1 — ~6 mlrd. žmonių internete, atiduotas nemokamai; 2 — 1,26 mlrd. telefonų per metus; 3 — vėžio diagnostika visame pasaulyje; 4 — beveik 9 000 pacientų CNAO ir MedAustron; 5 — 30 licencijų, FDA leidimas, Artemis II; 6 — 170 centrų, 42 šalys; 7 — biržos, kvantiniai tinklai, IEEE standartas; 8 — MEDICIS radionuklidai klinikoms ir pramonei; 9 — nuo LHC magnetų iki Airbus ir sintezės; 10 — Zenodo, Geant4, ROOT, Indico (Indico: ~400 000 vartotojų, 300 serverių 52 šalyse, naudoja ir JT).
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
<div class="stat"><div class="n">Licencijuoti</div><p class="l">kontaktas: Inovacijų agentūra</p></div>
</div>

<div class="src">business-with-cern.web.cern.ch: Member States statuses 2026–2027, Who to contact · inovacijuagentura.lt (2026 01) · CERN pirkimai 2024: 613 mln. CHF</div>

<!--
Kalbėtojui (~1 min). Kvietimas veikti.
Sakyti: „Ką tai reiškia jums? Pirma — CERN yra klientas: 2024 m. jis pirko už 613 mln. frankų. Nuo 2018 m. CERN iš Lietuvos įmonių pirko už ~2,5 mln. frankų; dešimt su viršum įmonių tiekia elektroniką, radijo dažnių sprendimus, optiką, fotoniką ir mechaniką. CERN oficialiame 2026–2027 m. sąraše Lietuva pažymėta kaip asocijuotoji narė, jau pasiekusi 2026 m. tiekimo užsakymų lubas. Tai reiškia, kad Lietuvos pramonė jau išnaudojo asocijuotajai narei numatytas tiekimo galimybes — dar vienas argumentas visateisei narystei. Antra — FCC: šių metų sausį Ekspla, Ostaralab ir Sargasas pasirašė su CERN ketinimų memorandumus dėl dalyvavimo kuriant FCC technologijas ir tiekimo grandines. Trečia — licencijos ir bendri projektai: kontaktas Lietuvoje — CERN pramonės ryšių pareigūnė Inovacijų agentūroje.“
Faktai: pirkimai nuo 50 000 CHF siunčiami ir nacionaliniams pramonės ryšių pareigūnams; >400 000 CHF — rinkos tyrimas ir konkursas; reikia registruotis CERN tiekėjų portale. Paslaugų sutartims Lietuva — „poorly balanced“ (yra vietos). Lietuvos CERN BIC (2019, Sunrise Valley ir Kauno MTP) — 40 000 EUR startuoliams. Nuo 2018 m. ~2,5 mln. CHF — VU rektorius R. Petrauskas, LRT, 2026 m. birželis. Pramonės ryšių pareigūnė — Aušrinė Krištopaitytė (Inovacijų agentūra).
-->

---
space: { at: kt, dist: 30, yaw: 200, pitch: 52, dim: 0.25 }
---

<div class="readout gold-k">

<p class="kicker">CERN · 2026 m. rugsėjis</p>

<div class="big gold"><Count :from="0" :to="1.8" :ms="1800" :decimals="1" /><span class="unit">CHF</span></div>

grąžos iš kiekvieno į HL-LHC investuoto franko

</div>

<div class="src">M. Florio, G. Catalano (CSIL): HL-LHC kaštų ir naudos analizė, home.cern, 2026 09 23</div>

<!--
Kalbėtojui (~0,5 min).
Sakyti: „Ir paskutinis skaičius. Rugsėjo pabaigoje CERN paskelbė didelio šviesio LHC kaštų ir naudos analizę: kiekvienas investuotas frankas visuomenei grąžins apie 1,8 franko; iš 50 000 modeliavimų 94 % rodo teigiamą grąžą. Ir didžiausia nauda — ne atradimai, o žmonės (40 %) ir pramonė bei programinė įranga (38 %).“
Faktai: grynoji dabartinė vertė ~3,3 mlrd. CHF (2016 m. kainomis); žmogiškasis kapitalas — 40,3 % naudos, pramonės tiekėjai ir nemokama programinė įranga — 37,7 %.
-->

---
layout: statement
space: { at: kt, dist: 9, yaw: 220, pitch: 6, dim: 0.25 }
---

# Žiniatinklio niekas neužsakė

<!--
Kalbėtojui (~0,4 min).
Sakyti: „Niekas CERN neužsakė žiniatinklio, jutiklinio ekrano ar spalvoto rentgeno. Jie atsirado, nes fizikai sprendė savo problemas, kurių niekas kitas dar neturėjo. Tokių problemų laukia FCC, didelio šviesio LHC ir LHCb atnaujinimai. Kitos inovacijos gims ten pat — ir jos gali būti lietuviškos. Lietuvos mokslininkai ir įmonės jau ten, ir kviečiu prisijungti.“
-->

---
space: { at: [116, 10, -24], dist: 20, yaw: 0, pitch: 16 }
---

<VideoPlayer src="lhcb_aciu.mp4" />

<!--
Kalbėtojui (2:28, su garsu). LHCb skrydis per detektorių, pasibaigiantis užrašu „Ačiū“ (klipo viduje — angliški paaiškinimai). Jei laiko mažai — galima praleisti (rodyklė pirmyn).
-->

---
layout: statement
space: { at: close }
---

# Ačiū

<div class="mt-md">Klausimai</div>

<p class="contacts">lhcb-vilnius.web.cern.ch · kt.cern · business-with-cern.web.cern.ch</p>

<!--
Kalbėtojui. Kamera grįžta ten, kur prasidėjo; ilgiausias skrydis (~4,5 s). Pentakvarkas išsibarsto ir vėl susirenka; „c“ — dar kartą.
Trukmė: be klipų ~24 min; nutolinimas 4:42, LHC tunelis ~0:40, kiti klipai ~1:10, „Ačiū“ klipas 2:28 — iš viso apie 33 min. Jei skirta 20 min: praleisti „Ačiū“ klipą (−2,5), LHC tunelį (−0,7), nutolinimą sustabdyti ties Žeme (−3), Higso ir duomenų skaidres (−1,2), dešimtuką (−0,8), vieną naujienų skaidrę (−1,2).
-->
