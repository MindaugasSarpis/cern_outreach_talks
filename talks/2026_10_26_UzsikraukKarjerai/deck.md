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
  dustFrom: start           # as OpenData: the clip condenses out of the grains from its first frame
stage:
  space: data/space.json
  palette: { base: blue, bg: '#000206', accent: '#5b6fd6', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }   # a true black ground, as OpenData's
  sound: { hum: false, flight: false, clip: false }   # no hum and no transition sounds (owner, 13–14 Oct: "transitions were like driving sounds", "only 2-3s"); the clips' audio and the collision's own sound still play
  options: { dustSize: 2.2, reach: 22, nebula: 0.12, grain: 0.012, aberration: 0, vignette: 0.7, bloom: 0.42 }   # OpenData's look: deep, crisp, not hazy
title: Vadovėlio gale atsakymo nėra
duration: 12min
sources: notes
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, delivered online on 27 Oct 2026. About 10 minutes,
  17 slides. A cover (title and name over the five-quark form gathering),
  then the LHC opening it shares with OpenData and Innoday
  (components/lhc-opening/: CERN from above, the real tunnel, into the beam
  pipe, one real 2012 CMS collision in slow motion, the 3D LHCb clip). The
  viewer sits in the physicist's seat: judge a bump in a histogram (2003 yes,
  2008 no), how a collision becomes a dot on that plot, 2015 yes, what made
  the difference, the speaker's route and working day, a VU student who found
  the pentaquark region again in LHCb's open data, three things a student can
  do this school year, one question to ask someone this week, and „Ačiū“ over
  the LHCb Vilnius group. The histograms fill grain by grain: slide 10 from
  LHCb's published 2019 J/ψ p bins (HEPData), slide 14 from the student's
  thesis; slides 6–8 are an illustration, said so in the notes.
layout: cover
space: { at: [593.2, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 0, jx: 0, peak: 0, team: 0 }" />

# Vadovėlio gale atsakymo nėra

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nt">LHCb</span>&nbsp;Vilnius<br>Vilniaus universitetas</div>

<!--
I. VADOVĖLIO GALE ATSAKYMO NĖRA
Message: who is speaking, and the talk's picture: in my work there is no answer at the back of the book.
Picture: the cover, as OpenData's and Innoday's (the owner, 15 Oct: "take elements from them"): the title and the name line, over the five-quark form gathering out of the dust (`quarks`). The overview clip buffers behind it. → starts the opening; that key is also the gesture browsers ask for before any sound.

Laba diena. Esu Mindaugas Šarpis, dalelių fizikas Vilniaus universitete. Mokykloje, kai nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Mano darbe tokio vadovėlio nėra. Ekrane iš dulkių susirenka dalelė, apie kurią bus šis pasakojimas. Bet pradėkime nuo CERN.

(~0.4 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The way in, as OpenData's: CERN from above, the library clip cern_overview_short.mp4 (11 s, no sound): from the Earth down to Geneva, then the LHC ring drawn over the fields with its four experiments named. It moves on by itself at its end, the camera pushing on into the ring (its right side, 0.72, 0.45 of the last frame), where the tunnel follows. -->
<VideoPlayer src="cern_overview_short.mp4" advance-on-end exit="push" exit-at="0.72,0.45" />

<!-- facts: lhc-geneva-27km-100m-four-experiments -->

<!--
Message: this is CERN, and its ring is the LHC.
Picture: CERN from above (11 s), the LHC ring drawn over the fields, its four experiments named; at its end the camera pushes on into the ring, where the tunnel follows (→ earlier).

Tai CERN prie Ženevos. Po šiais laukais, maždaug šimto metrų gylyje, yra dvidešimt septynių kilometrų žiedas – Didysis hadronų greitintuvas. Jame stovi keturi dideli eksperimentai, vienas jų – LHCb.

Šaltiniai: home.cern, „The Large Hadron Collider“.

The line is said over the clip; its 11 s are counted from the clip.
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The opening (components/lhc-opening/): the real LHC tunnel, CERN-FOOTAGE-2022-013-001, an 18 s cut (videos/manifest.toml). It moves on by itself at its end, into the beam pipe. -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" advance-on-end :volume="0.5" exit="push" exit-at="0.45,0.53" />

<LhcOpening part="tunnel" />

<!-- facts: cern-lhc-size-cost, cern-lhc-collisions, cern-run3-end -->

<!--
Picture: the real LHC tunnel, 100 m under the border, the magnets on the right;
„LHC 27 km“ low on the left. Let it run: at its end the camera goes on into the
beam pipe (it moves on by itself; → earlier). Its sound is the tunnel's own
ventilation hum.

Kai greitintuvas veikia, protonai jame susiduria beveik šviesos greičiu – daugiau nei milijardą kartų per sekundę.

(„Kai veikia“: the LHC has been in its long shutdown since 29 June 2026.)

Source: CERN-FOOTAGE-2022-013-001 (CERN). The line is said over the clip; its 18 s are counted from the manifest.
-->

---
space:
  at: opening
  dim: 0
  ambient: 0
  hum: false
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
---

<LhcOpening name="opening" :count="290" />

<!-- facts: cms-195099-137440354-record-300, cms-195099-8tev, cms-195099-290-drawn-tracks, cms-195099-19-vertices -->

<!--
Picture: one real collision in the black, OpenData's and Innoday's (the owner chose this sharper drawing for OpenData on 12 Oct: "the collision should be more in focus"). Two bunches of protons run in along the beam pipe and cross; 19 collisions flash along the beam, the world nearly stops at the crossing while the camera moves round it, then runs on as the debris flies out to every side: 290 tracks curling in the magnet, the calorimeters' cells lighting all round, two muons running out. „8 TeV“ at the crossing, „290 dalelių“ as it flies apart. A low swell, a thump at the crossing, a low drone that fades over four seconds as it flies apart: quiet enough to talk over. → for the LHCb clip.

Taip atrodo tikras susidūrimas: tą akimirką iš karto susidūrė devyniolika protonų porų. Jį 2012 metais užfiksavo CMS – kitas LHC eksperimentas.

The event: CMS Open Data record 300 (CC0), run 195099, event 137440354, recorded on 27 May 2012 at 8 TeV, a Higgs boson candidate; the 290 are the tracks the opening draws, not a number CMS reports. Provenance: components/lhc-opening/README.md.

(~0.2 min)
-->

---

<!-- The shared opening's LHCb reel: the detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release. It condenses out of the dust and moves on by itself when it ends. -->
<VideoPlayer src="lhcb.mp4" advance-on-end />

<!-- facts: lhcb-detector-size, lhcb-collaboration-2026, lhcb-collaboration-sep-2026, lhcb-vilnius-joined, lhcb-vilnius-associate-institute -->

<!--
Message: this is LHCb, and I am one of the people who work on it.
Picture: the LHCb detector in 3D, with music. Let the clip play (39 s); it ends by itself as the music fades; → moves on earlier. Near the end, over the music:

Tai LHCb – penkių tūkstančių šešių šimtų tonų detektorius. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš viso pasaulio. Nuo 2024 metų rugsėjo – ir Vilniaus universiteto grupė. Aš esu vienas iš jų.

The line is said over the clip; its 39 s are counted from the manifest.
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 1, th2: 0, jp: 0, jx: 0, peak: 0, team: 0 }" />

<!--
II. KAIP NUSPRĘSTI
Message: you decide: is this bump a particle or chance?
Picture: a histogram fills dot by dot (140 dots); one bin near the middle rises well above its neighbours.
Note: the plot is an illustration, not measured data: a random sample from a smooth spectrum with no particle in it, in which chance made the bump (public/data/theta-toy.json). Say „toks grafikas“, never „tikras“.

Mes dirbame su klausimais, į kuriuos dar niekas neatsakė. Tokį darbą dabar išbandysi ir tu. Štai toks grafikas, kokių matome kasdien. Kiekvienas taškelis – viena masė. Ją apskaičiuojame iš dalelių, kurias detektorius užregistravo susidūrime. Tai masė tos dalelės, iš kurios jos galėjo atsirasti. Taškelis krenta į tą masę atitinkantį stulpelį: kairėje – lengvesnės, dešinėje – sunkesnės. Kuo stulpelis aukštesnis, tuo dažniau tokia masė pasitaikė. Jeigu kurioje nors vietoje susidaro kauburys, gal ten yra dalelė, kurios dar niekas nematė. O gal tai tik atsitiktinumas, kaip kad metant kauliuką kelis kartus iš eilės iškrenta šešetas. Kaip manai, ar čia dalelė?
[pauzė 3 s]

(~0.8 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 2, th2: 0, jp: 0, jx: 0, peak: 0, team: 0 }" />

<!-- facts: theta-plus-2003-false-alarm, pentaquark-idea-1964 -->

<!--
Message: in 2003 physicists said yes and announced a pentaquark; others soon saw a bump too.
Picture: the same small histogram; the bump's bin lights while the rest steps back (th1 step 2).

2003 metais fizikai Japonijoje savo grafike pamatė panašų kauburį ir nusprendė, kad tai dalelė. Jie paskelbė, kad rado pentakvarką – dalelę iš penkių kvarkų. Kvarkai – smulkesnės dalelės, iš kurių sudaryti protonai ir neutronai. Protone jų yra trys. Pagal 1964 metais iškeltą kvarkų idėją galėjo būti ir dalelių iš penkių kvarkų, bet niekas jų nebuvo matęs. Netrukus panašų kauburį pamatė ir kitos grupės.

If asked: tiksliau – keturi kvarkai ir vienas antikvarkas (Θ⁺: uudds̄; LHCb Pc: uudcc̄).

(~0.5 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 1, jp: 0, jx: 0, peak: 0, team: 0 }" />

<!-- facts: theta-plus-2003-false-alarm -->

<!--
Message: with far more data the bump went away; by 2008 the PDG review concluded the particle does not exist.
Picture: the small histogram clears; 3 500 dots fall into the same bins and make a smooth, falling shape with no bump. Illustration, as on slide 6.

Vėliau kiti eksperimentai, surinkę daug daugiau duomenų, pakartojo matavimą. Kauburys išnyko. 2008 metų pagrindiniame dalelių fizikos žinyne parašyta, kad to pentakvarko nėra. Kauburys buvo atsitiktinumas, kurį fizikai per anksti palaikė dalele.

(~0.5 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 1, jp: 0, jx: 0, peak: 0, team: 0 }" />

<StagePhoto src="figures/photos/lhcb-event-run3.jpg" alt="Vienas protonų susidūrimas atnaujintame LHCb detektoriuje, 2022 m.: dalelių pėdsakai sklinda per detektorių" focus="35% 50%" />

<!-- facts: cern-lhc-collisions -->

<!--
Message: the story moves to LHCb, and how one collision becomes one dot on the plot the viewer judged.
Picture: a real LHCb event display (a proton–proton collision in the upgraded detector, 2022), condensing out of grains; the collision point on the left, the tracks fanning out to the right.
Words: the LHC and LHCb were introduced over the opening (slides 2–5, 15 Oct), so this slide keeps only the collision → dot paragraph.
Licence: CERN / LHCb image, free for educational, non-commercial use; confirm before the event (see the talk's CLAUDE.md, Figures).

Pentakvarkų istorija tęsėsi LHCb. Taip atrodo protonų susidūrimas LHCb detektoriuje. Kairėje, kur susiduria protonai, atsiranda daug naujų dalelių, ir kiekviena plona raudona linija, sklindanti iš ten, – vienos jų kelias. Detektorius išmatuoja, kur jos praskriejo ir kaip stipriai magnetas išlenkė jų kelią. Iš to kompiuteriai apskaičiuoja, kokią masę turėtų dalelė, iš kurios kelios iš jų galėjo atsirasti. Viena tokia apskaičiuota masė – vienas taškelis tokiame grafike, kokį vertinai pradžioje. Susidūrimų yra tiek daug, kad kompiuteriai iš karto atrenka tik tuos, kurie gali būti įdomūs.

(~0.7 min)
-->

---
space: { at: lhcb, dim: 0.05 }
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 1, jx: 0, peak: 0, team: 0 }" :clicks="{ 1: { jp: 2 } }" />

<!-- facts: lhcb-pentaquark-2015, lhcb-pentaquark-2019 -->

<!--
Message: in 2015 LHCb, studying a heavier particle's decay, found a peak it had not looked for, checked everything, and it held; by 2019 the peak was two states and a third had appeared.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate, fast at first, until the narrow peaks stand out (about 20 s). → spausk at „2019 metais…“: ticks light over the three peaks while the rest of the plot steps back (jp step 2; at once if the fill is done, else when it ends).
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV). These bins hold the 2015 sample and the later data together; the 2015 paper's own bins are not on HEPData.

2015 metais LHCb tyrė, kaip skyla viena sunki dalelė, ir grafike netikėtai iškilo smailė – aukštas, siauras kauburys. Čia matai visus duomenis iki 2019 metų, todėl smailių daugiau. Prieš skelbdama rezultatą, LHCb komanda tikrino viską, ką tik galėjo: ar smailės nesukuria detektorius, kitos dalelės ar tai, kaip buvo atrinkti duomenys. Smailė liko.
→ spausk
2019 metais, surinkus dar daugiau duomenų, paaiškėjo, kad tai iš tikrųjų dvi smailės, ir atsirado trečia. Tai trys pentakvarkai, kuriuos matai dabar.

(~0.7 min)
-->

---
space: { at: [1797.6, 4.2, 0], dist: 21, yaw: 0, pitch: 3, sway: 0.3, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 2, jx: 1, peak: 0, team: 0 }" />

<div class="heap" style="left: 557px; top: 404px"><span class="n">27&nbsp;292&nbsp;taškai</span></div>
<div class="heap" style="left: 116px; top: 404px"><span class="n">140&nbsp;taškų</span></div>

<!-- facts: theta-plus-2003-false-alarm, lhcb-pentaquark-2019, particle-physics-5-sigma-discovery -->

<!--
Message: the difference was the amount of data. A bump reported at 4,6σ in 2003 went away with more data; LHCb's peaks held with nine times more data in 2019, the new one at 7,3σ. (Not: 'it failed because 4,6 < 5'. Other 2003 bumps were reported near 5σ and went away too.)
Picture: the camera draws back to show two plots at the same scale, one grain per entry and the same height per entry. On the left is the 140-entry plot from slides 6–7: an illustration, not LEPS's data. On the right are LHCb's 27 292 candidates (the 2019 bins) with their three marked peaks. Under them, their counts: „140 taškų“ and „27 292 taškai“; the left plot appears as a thin strip.
Background, if asked: LEPS's own peak was 19 events over a background of 17 (19/√17 = 4,6σ, their paper's own estimate; arXiv:hep-ex/0301020).

Štai abu grafikai šalia, ir abiejuose vienas taškelis – viena apskaičiuota masė. Kairėje – pavyzdinis grafikas, kurį matei pradžioje, šimtas keturiasdešimt taškų. Dešinėje – LHCb duomenys, jų daugiau nei dvidešimt septyni tūkstančiai. Fizikai skaičiuoja, kiek kauburys iškyla virš atsitiktinių svyravimų. Tai vadinama reikšmingumu ir matuojama sigmomis. Atradimu paprastai vadinamas rezultatas, kurio reikšmingumas – bent penkios sigmos. Tai reiškia, kad vien atsitiktiniai svyravimai tokį ar dar didesnį kauburį sukurtų maždaug vieną kartą iš trijų su puse milijono. 2003 metų kauburys irgi atrodė reikšmingas – 4,6 sigmos, beveik tiek, kiek reikia atradimui. Bet jis rėmėsi vos keliolika įvykių, ir surinkus daugiau duomenų išnyko. 2019 metais LHCb turėjo devynis kartus daugiau duomenų nei 2015-aisiais, ir smailės liko. Naujos smailės reikšmingumas buvo 7,3 sigmos.

Šaltiniai: LEPS, Phys. Rev. Lett. 91, 012002 (2003), arXiv:hep-ex/0301020 („a Gaussian significance of 4.6 sigma“); LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData ins1728691; Physics World, 2007-05-01, „The tale of the blogs’ boson“ (3σ – požymiai, 5σ – atradimas).

(~0.9 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 0, team: 0 }" />

<div class="city late caption" style="left: 730px; top: 152px">Vilnius</div>
<div class="city late caption" style="left: 414px; top: 374px">CERN</div>

<!--
III. KELIAS
Message: my own road into LHCb was not planned either.
Picture: the trail draws across Europe: Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius. Only Vilnius and CERN are named on screen; Glasgow, Heidelberg and Bonn are the speaker's to tell or skip.

Į LHCb aš patekau ne tiesiu keliu. Iki dvylikos metų norėjau būti egiptologu. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN. Studijavau Glazge ir ten dirbau vadybininku, kad turėčiau iš ko gyventi. Parvykęs į Lietuvą dirbau su lazeriais. Į dalelių fiziką grįžau per doktorantūrą. Ją pradėjau Heidelberge, o pandemijos metais visa mūsų grupė persikėlė į Boną. Dabar Vilniaus universitete kartu su kolegomis kuriame LHCb grupę.

Optional, the organisers' point („you don't need to know now what you will be“), in your own words if it is true for you: nothing here is said for you.

(~0.5 min)
-->

---
space: { at: [1205.6, 0.25, -0.7], dist: 24, yaw: 0, pitch: 60, sway: 0.5, dim: 0.2 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 0, team: 0 }" />

<div class="city caption" style="left: 744px; top: 128px">Vilnius</div>
<div class="city caption" style="left: 232px; top: 428px">CERN</div>

<!-- facts: lhcb-run1-release-sarpis, sarpis-phd-bonn-2023, sarpis-interview-run1-1-5-years, lhcb-run1-volume-sources-differ, lhcb-open-data-coordinator-2026 -->

<!--
Message: what the work is like: mostly at a desk in Vilnius, results reachable from anywhere, a lot of travel, and long careful jobs such as preparing LHCb's open data, which I now coordinate.
Picture: the camera comes down from the whole map to Vilnius (upper right) and the arcs to CERN (lower left), both named.
Words: lines 1–4 are the draft the owner approved on 2026-10-09 (through the Scheduler), built from the speaker's own public words. Line 2 comes from an automatic transcript and is kept as the draft wrote it. The open-data numbers follow the VU Library interview of 5 March 2026 (15 Oct: „daugiau nei šimtą tūkstančių“, „apie pusantrų metų“; „beveik petabaitą“ holds under both VU's 1 PB and CERN's 800 TB).

Dabar dažniausiai dirbu Vilniaus universitete. Į CERN su savo grupe važiuojame tik ypatingomis progomis. Detektorius renka duomenis, prie jo dirba inžinieriai, o rezultatus aš galiu gauti iš bet kurios pasaulio vietos. Bet keliauti tenka daug. Mūsų srityje nuo dvidešimties iki keturiasdešimties skrydžių per metus nėra retenybė. Doktorantūros metais Bonoje man teko paruošti LHCb duomenis viešam naudojimui. Daugiau nei šimtą tūkstančių failų, iš viso beveik petabaitą, reikėjo surasti, patikrinti, nukopijuoti ir aprašyti. Net su tam parašytomis programomis tai užtruko apie pusantrų metų. Nuo šių metų rugpjūčio esu LHCb atvirųjų duomenų koordinatorius.

Šaltiniai: LRT KLASIKA „Šviesi ateitis“, LRT.lt, 2024-05-20; „Tapk geresniu“, 2026-09-14 (automatinis įrašo tekstas); M. Šarpio tinklaraštis, 2024-01-08 („Hello from RAL“) ir 2024-01-15 („LHCb Run I data is released“); VU biblioteka, interviu, 2026-03-05; VU, 2026-07-30.

(~0.8 min)
-->

---
space: { at: [898, -3.4, 0], dist: 16, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 1, pq2: 3, team: 0 }" />

<div class="thesis-slide world">
<div class="thesis-who">

<img class="portrait" src="/figures/people/dominykas-stonkus.jpg" alt="Dominykas Stonkus" />

<p class="name">Dominykas Stonkus</p>

</div>
<div class="thesis-count"><StageCount for="peak" :to="16400" lang="lt" /><span class="unit">skilimų</span></div>
</div>

<!-- facts: stonkus-bsc-2026, stonkus-bsc-2026-yield, lhcb-pentaquark-2015, lhcb-run1-release-sarpis -->

<!--
IV. KĄ GALI PADARYTI TU
Message: a student a few years older than the viewers did this with public data: he found the same bump again, and checked it rather than claimed a discovery.
Picture: OpenData's thesis slide (taken 15 Oct): his portrait and his name on the left (the thesis is said, not shown); his m(J/ψ p) fills grain by grain from his Λb⁰ decays in the 2012 open data (about 16 400 by the fit: „16 400 skilimų“ on screen, rounded as the fit's ±162 allows) (thesis Fig. 17, sideband-subtracted, 80 bins of 15 MeV, 4,0–5,2 GeV, digitised), the count rising with it; grains rise out of the peak into the talk's own five-quark form (the cover's quintet, `pq2`, in place of OpenData's bubble). Fill it as a callback to slide 10, not a replay.
Do not say „atrado“, „pirmasis“ or that he observed pentaquarks: the thesis calls it a qualitative check, „kokybinis patikrinimas“.

Šiuos duomenis gali naudoti ir studentai. Dominykas Stonkus šiais metais Vilniaus universitete apgynė bakalauro darbą. Jis paėmė viešus 2012 metų LHCb duomenis – tuos pačius, kuriuos ruošti padėjau aš, – ir atrinko apie šešiolika tūkstančių keturis šimtus skilimų. Jo grafike kauburys iškilo toje pačioje vietoje, kur LHCb 2015 metais rado pentakvarkus. Virš jo kauburio susirenka ta pati penkių kvarkų dalelė, kurią matei pradžioje. Naujų dalelių jis neatrado ir to neteigia: tam reikėtų daug išsamesnės analizės. Jis patikrino, ar viešuose duomenyse matyti tas pats, ką rado LHCb.

The figure, if asked: Λb⁰ → J/ψ p K⁻; a single-Gaussian fit to the Λb⁰ mass gives N_sig = 16 406,6 ± 161,7 (thesis Fig. 14); the m(J/ψ p) rise at 4,4–4,5 GeV (§3.2). Supervisor: M. Šarpis; approved for defence 2026-05-18.

Šaltiniai: D. Stonkus, „Pentakvarkų atradimas iš naujo naudojant LHCb atviruosius duomenis“, bakalauro darbas, VU, 2026, epublications.vu.lt/object/elaba:308118793/308118793.pdf; LHCb, Phys. Rev. Lett. 115, 072001 (2015).

(~0.7 min)
-->

---
space: { at: [898, -3.4, 0], dist: 20, yaw: 0, pitch: 3, sway: 0.5, dim: 0.35 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 1, pq2: 3, team: 0 }" />

<!-- facts: lhcb-masterclass-vilnius-2026, bl4s-2027-call, stonkus-bsc-2026 -->

<!--
Message: three real things a student can do this year; the first steps of the road Dominykas took.
Picture: the same frontal view of Dominykas's plot and its five-quark form, one step back and dimmed; no text.
Check before filming (26 Oct): the BL4S deadline day (still „XX March 2027“ on 15 Oct) and whether VU has announced the 2027 masterclass.

Štai ką gali padaryti jau šiais mokslo metais. Vilniaus universitete jau dvejus metus vyksta LHCb meistriškumo pamokos: 2025 metais kovą, 2026 metais vasarį. Mokiniai ten vieną dieną analizuoja tikrus LHCb duomenis. CERN kasmet rengia konkursą „Beamline for Schools“. Bent penkių mokinių komanda, dažniausiai nuo šešiolikos iki devyniolikos metų, kartu su mokytoju ar kitu suaugusiu vadovu pasiūlo eksperimentą. Paraiškas galima teikti nuo gruodžio, terminas – kovą. Laimėtojai savo eksperimentą atlieka prie tikro greitintuvo. Ir LHCb duomenis nemokamai gali atsisiųsti kiekvienas iš opendata.cern.ch – tuos pačius, su kuriais dirbo Dominykas.

Šaltiniai: VU FF, LHCb meistriškumo pamokos, 2025-03-06 ir 2026-02-26 (indico.cern.ch/event/1648092); beamlineforschools.cern (2027 m. sąlygos).

(~0.8 min)
-->

---
space: { at: quarks, dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.35 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 1, team: 0 }" />

<!--
Message: one task for this week.
Picture: the five-quark particle of the cover, held. The speaker asks the question. No text on screen.

Ir viena užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė 2 s]

(~0.4 min)
-->

---
space: { at: [333, 2.8, 0], dist: 27, yaw: 0, pitch: 3, dim: 0.2 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0, peak: 0, team: 1 }" />

<div class="thanks">Ačiū</div>

<!--
Message: thanks, and the people of LHCb Vilnius.
Picture: OpenData's close (taken 15 Oct): the camera flies on and the group gathers: fifteen portraits made of gold grains. The ring starts to move like a beam of particles: the portraits run round it, push one another away and bump; a fine gold beam is laid round the ring, through every face. „Ačiū“ in the middle. The names stay off the screen: Mindaugas Šarpis, Ramūnas Aleksiejūnas, Oleg Kravcov, Adam Morris, Augustas Vaitkevičius, Rūta Racz, Šarūnas Jacevičius, Margarita Biveinytė, Sophia Pennuttis, Mikas Paulius Iršėnas, Neilas Beniušis, Karolina German, Eliza Holvoet, Meda Paulavičiūtė, Dominykas Stonkus.
Photos: LHCb Vilnius group members, used with permission for OpenData (as on lhcb-vilnius.web.cern.ch/people.html); for this stream: the owner's question in the talk's CLAUDE.md.

Tai mūsų LHCb grupė Vilniaus universitete. Ačiū jums ir ačiū visai mūsų grupei.

(~0.3 min)
-->
