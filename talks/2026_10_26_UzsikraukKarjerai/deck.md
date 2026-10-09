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
  release: videos-2026-10-26-uzsikraukkarjerai
  fit: cover
  transition: dust
  dust: '#ffc05a'
stage:
  space: data/space.json
  palette: { base: blue, bg: '#04040c', accent: '#5b6fd6', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }
  options: { dustSize: 2.2, reach: 22, nebula: 0.4 }
title: Vadovėlio gale atsakymo nėra
duration: 12min
sources: notes
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, delivered online on 27 Oct 2026. About 7 minutes,
  12 slides. The viewer sits in the physicist's seat: judge a bump in a
  histogram (2003 yes, 2008 no), what LHCb is and how a collision becomes a
  dot on that plot, 2015 yes, what made the difference, the speaker's
  route, three things a student can do this school year, and one question
  to ask someone this week. The histograms fill
  grain by grain: slide 8 from LHCb's published 2019 J/ψ p bins (HEPData);
  slides 2–4 are an illustration, said so in the notes.
layout: default
space: { at: [594, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 0 }" />

<div class="scrim-left"></div>

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis<br>dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
I. VADOVĖLIO GALE ATSAKYMO NĖRA
Message: in my work there is no answer at the back of the book; today you will try it yourself.
Picture: a five-quark particle gathers out of the dust beside the title.

Mokykloje, kai nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Esu dalelių fizikas Vilniaus universitete ir mano darbe tokio vadovėlio nėra. Dirbu su klausimais, į kuriuos dar niekas neatsakė. Šalia pavadinimo – dalelė iš penkių kvarkų. Apie tokias daleles ir bus šis pasakojimas, o tokį darbą šiandien pabandysi ir tu.

(~0.5 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 1, th2: 0, jp: 0 }" />

<div class="say top">
<p class="big">Ar čia dalelė?</p>
</div>

<!--
II. KAIP NUSPRĘSTI
Message: you decide: is this bump a particle or chance?
Picture: a histogram fills dot by dot (140 dots); one bin near the middle rises well above its neighbours.
Note: the plot is an illustration, not measured data: a random sample from a smooth spectrum with no particle in it, in which chance made the bump (public/data/theta-toy.json). Say „toks grafikas“, never „tikras“.

Štai toks grafikas, kokių matome kasdien. Kiekvienas taškelis – viena masė. Ją apskaičiuojame iš dalelių, atsiradusių detektoriaus užregistruotame susidūrime, – tai masė tos dalelės, iš kurios jos galėjo atsirasti. Taškelis krenta į tą masę atitinkantį stulpelį: kairėje – lengvesnės, dešinėje – sunkesnės. Kuo stulpelis aukštesnis, tuo dažniau tokia masė pasitaikė. Jeigu kurioje nors vietoje susidaro kauburys, gal ten yra dalelė, kurios dar niekas nematė. O gal tai tik atsitiktinumas, kaip kad metant kauliuką kelis kartus iš eilės iškrenta šešetas. Kaip manai, ar čia dalelė?
[pauzė 3 s]

(~0.6 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 1, th2: 0, jp: 0 }" />

<div class="say top">
<p class="kick year">2003 m.</p>
<p class="big">Paskelbta, kad tai dalelė</p>
</div>

<!-- facts: theta-plus-2003-false-alarm, pentaquark-idea-1964 -->

<!--
Message: in 2003 physicists said yes and announced a pentaquark; others soon saw a bump too.
Picture: the same small histogram.

2003 metais fizikai Japonijoje savo grafike pamatė panašų kauburį ir nusprendė, kad tai dalelė. Jie paskelbė, kad rado pentakvarką – dalelę iš penkių kvarkų. Kvarkai – smulkesnės dalelės, iš kurių sudaryti protonai ir neutronai. Protone jų yra trys. Pagal 1964 metais iškeltą kvarkų idėją galėjo būti ir dalelių iš penkių kvarkų, bet niekas jų nebuvo matęs. Netrukus panašų kauburį pamatė ir kitos grupės.

(~0.4 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 1, jp: 0 }" />

<div class="say top">
<p class="kick blue year">2008 m.</p>
<p class="big">Surinkus daugiau duomenų kauburys išnyko</p>
</div>

<!-- facts: theta-plus-2003-false-alarm -->

<!--
Message: with far more data the bump went away; by 2008 the PDG review concluded the particle does not exist.
Picture: the small histogram clears; 3 500 dots fall into the same bins and make a smooth, falling shape with no bump. Illustration, as on slide 2.

Vėliau kiti eksperimentai, surinkę daug daugiau duomenų, pakartojo matavimą. Kauburys išnyko. 2008 metų pagrindiniame dalelių fizikos žinyne parašyta, kad to pentakvarko nėra. Kauburys buvo atsitiktinumas, kurį fizikai per anksti palaikė dalele.

(~0.5 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_001.mp4" muted />

<div class="photo-credit">Vaizdo įrašas: CERN</div>

<!-- facts: cern-lhc-collisions, cern-run3-end -->

<!--
Message: my experiment is at CERN, where the LHC collides protons, about a billion collisions a second.
Picture: real footage, a travelling shot along the LHC tunnel. Advance whenever you finish; the clip is long.

Pentakvarkų istorija tuo nesibaigė. Ji tęsėsi eksperimente, kuriame dabar dirbu ir aš. Jis yra CERN, prie Ženevos. Ten, maždaug šimto metrų gylyje, yra dvidešimt septynių kilometrų žiedas – Didysis hadronų greitintuvas. Kai jis veikia, protonai jame susiduria beveik šviesos greičiu ir per sekundę įvyksta apie milijardą susidūrimų.

(~0.4 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<StagePhoto src="figures/photos/lhcb-cavern.jpg" alt="LHCb detektoriaus požeminė salė, CERN, 2019 m.">
<div class="photo-credit">LHCb, CERN · Rosa Menkman nuotr., CC BY 2.0</div>
</StagePhoto>

<!-- facts: lhcb-detector-size, lhcb-mission, lhcb-collaboration-2026, lhcb-collaboration-dec-2025 -->

<!--
Message: LHCb is one of the collision points; it studies particles with heavy quarks, above all how matter differs from antimatter, and the same data let it look for new particles made of quarks. I am one of the nearly 2 000 people who work on it.
Picture: the real photograph of the LHCb cavern condenses out of grains.

Viename iš susidūrimo taškų stovi LHCb – penkių tūkstančių šešių šimtų tonų detektorius. LHCb tiria daleles, kuriose yra sunkiųjų kvarkų, ypač gražiojo kvarko. Pirmiausia jis tiria, kuo materija skiriasi nuo antimaterijos. Visatos pradžioje jų turėjo atsirasti po lygiai, o šiandien beveik viskas aplink mus yra materija, ir kodėl taip yra, kol kas niekas nežino. Tie patys duomenys leidžia ieškoti ir naujų dalelių, sudarytų iš kvarkų. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš dvidešimt septynių šalių. Aš esu vienas iš jų.

(~0.6 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<StagePhoto src="figures/photos/lhcb-event-run3.jpg" alt="Vienas protonų susidūrimas atnaujintame LHCb detektoriuje, 2022 m.: dalelių pėdsakai sklinda per detektorių" focus="35% 50%">
<div class="photo-caption">Protonų susidūrimas LHCb detektoriuje</div>
<div class="photo-credit">© CERN, LHCb</div>
</StagePhoto>

<!--
Message: how a collision becomes one dot on the plot the viewer judged.
Picture: a real LHCb event display (a proton–proton collision in the upgraded detector, 2022), condensing out of grains; the collision point on the left, the tracks fanning out to the right.
Licence: CERN / LHCb image, free for educational, non-commercial use; confirm before the event (see the talk's CLAUDE.md, Figures).

Taip atrodo protonų susidūrimas LHCb detektoriuje. Kairėje, kur susiduria protonai, atsiranda daug naujų dalelių, ir kiekviena plona raudona linija, sklindanti iš ten, – vienos jų kelias. Detektorius išmatuoja, kur jos praskriejo ir kaip stipriai magnetas išlenkė jų kelią. Iš to kompiuteriai apskaičiuoja, iš kokios sunkesnės dalelės jos atsirado ir kokia buvo tos dalelės masė. Viena tokia apskaičiuota masė – vienas taškelis tokiame grafike, kokį vertinai pradžioje. Susidūrimų yra tiek daug, kad kompiuteriai iš karto atrenka tik tuos, kurie gali būti įdomūs.

(~0.6 min)
-->

---
space: { at: lhcb, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 1 }" />

<div class="say top" v-click-hide="1">
<p class="kick year">2015 m.</p>
<p class="big">LHCb duomenyse iškilo smailė</p>
</div>

<div class="say top" v-click="1">
<p class="kick year">2019 m.</p>
<p class="big">Trys pentakvarkai</p>
</div>

<!-- facts: lhcb-pentaquark-2015, lhcb-pentaquark-2019 -->

<!--
Message: in 2015 LHCb, studying a heavier particle's decay, found a peak it had not looked for, checked everything, and it held; by 2019 the peak was two states and a third had appeared.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate, fast at first, until the narrow peaks stand out (about 20 s); then ticks light over the three peaks. → spausk at „2019 metais…“: the line on screen changes from „LHCb duomenyse iškilo smailė“ (2015 m.) to „Trys pentakvarkai“ (2019 m.).
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV). These bins hold the 2015 sample and the later data together; the 2015 paper's own bins are not on HEPData.

2015 metais LHCb tyrė, kaip skyla viena sunki dalelė, ir grafike netikėtai iškilo smailė – aukštas, siauras kauburys. Čia matai visus duomenis iki 2019 metų, todėl smailių daugiau. Apie jas – po akimirkos. Prieš skelbdama rezultatą, LHCb komanda tikrino viską, ką tik galėjo: ar smailės nesukuria detektorius, kitos dalelės ar tai, kaip atrinkti duomenys. Smailė liko.
→ spausk
2019 metais, surinkus dar daugiau duomenų, paaiškėjo, kad ta smailė iš tikrųjų yra dvi, ir atsirado trečia. Tai trys pentakvarkai, kuriuos matai dabar.

(~0.7 min)
-->

---
space: { at: lhcb, dist: 21, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 1 }" />

<div class="say top">
<p class="big">Daugiau duomenų ir nepriklausomas patikrinimas</p>
</div>

<!--
Message: the difference was far more data and checking by people outside the analysis.
Picture: the full LHCb histogram, the camera drawing back.

LHCb 2015 metais turėjo daug kartų daugiau duomenų nei fizikai 2003-iaisiais. Be to, rezultatą dar tikrino kiti LHCb mokslininkai, kurie toje analizėje nedalyvavo. Jų darbas buvo ieškoti klaidų.

(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 1 }" />

<div class="city late" style="left: 716px; top: 168px">Vilnius</div>
<div class="city late" style="left: 414px; top: 374px">CERN</div>
<div class="city late" style="left: 270px; top: 146px">Glazgas</div>
<div class="city late" style="left: 474px; top: 318px">Heidelbergas</div>
<div class="city r late" style="left: 405px; top: 254px">Bona</div>

<!--
III. KELIAS
Message: my own road into LHCb was not planned either.
Picture: the trail draws across Europe: Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius.

Į LHCb aš patekau ne tiesiu keliu. Iki dvylikos metų norėjau būti egiptologu. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN. Studijavau Glazge ir ten dirbau vadybininku, kad turėčiau iš ko gyventi. Parvykęs į Lietuvą dirbau su lazeriais. Į dalelių fiziką grįžau per doktorantūrą. Ją pradėjau Heidelberge, o pandemijos metais visa mūsų grupė persikėlė į Boną. Dabar Vilniaus universitete kartu su kolegomis kuriame LHCb grupę.

(~0.5 min)
-->

---
space: { at: [690, 6, 30], dist: 20, yaw: 40, pitch: 6, sway: 0.5, dim: 0.6 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 1 }" />

<div class="say top wide list">
<p class="kick">Ką gali padaryti jau šiais mokslo metais</p>
<p class="line">LHCb meistriškumo klasė Vilniaus universitete · vasaris–kovas</p>
<p class="line">CERN konkursas „Beamline for Schools“ · nuo 16 metų</p>
<p class="line">opendata.cern.ch</p>
</div>

<!--
IV. KĄ GALI PADARYTI TU
Message: three real things a student can do this year.
Picture: plain dust, dimmed behind the three lines (the camera turned away from the form, which returns on the close).
Check before the talk: the 2027 masterclass date at VU (2026: 26 February) and the 2027 Beamline for Schools call (past rules: 16 or older, teams of at least five with an adult coach).

Štai ką gali padaryti jau šiais mokslo metais. Vilniaus universitete vasarį ar kovą vyksta LHCb meistriškumo klasė. Mokiniai ten vieną dieną analizuoja tikrus CERN duomenis ir rezultatus aptaria su kitų šalių grupėmis. CERN kasmet rengia konkursą „Beamline for Schools“. Bent penkių mokinių nuo šešiolikos metų komanda su suaugusiu vadovu, pavyzdžiui, mokytoju, pasiūlo eksperimentą. Laimėtojai jį atlieka prie tikro greitintuvo. Ir LHCb duomenis nemokamai gali atsisiųsti kiekvienas iš opendata.cern.ch.

(~0.8 min)
-->

---
space: { at: quarks, dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.35 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 1 }" />

<div class="scrim-left"></div>

<div class="say wide">
<p class="big huge">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
Message: one task for this week.
Picture: the five-quark particle of the cover, held. The question alone: no kicker, name or URL.

Ir viena užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė 2 s]

(~0.4 min)
-->
