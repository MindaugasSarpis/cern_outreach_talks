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
  talk for grades 9–12, delivered online on 27 Oct 2026. About 9 minutes,
  15 slides. It opens with the LHC opening it shares with OpenData
  (components/lhc-opening/: the real tunnel, into the beam pipe, one real 2012
  LHCb collision in slow motion, the 3D LHCb clip). The viewer sits in the physicist's seat: judge a bump in a
  histogram (2003 yes, 2008 no), what LHCb is and how a collision becomes a
  dot on that plot, 2015 yes, what made the difference, the speaker's
  route and working day, three things a student can do this school year, and one question
  to ask someone this week. The histograms fill
  grain by grain: slide 10 from LHCb's published 2019 J/ψ p bins (HEPData);
  slides 6–8 are an illustration, said so in the notes.
layout: default
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!--
The standby: black, while the LHC tunnel clip buffers behind it. → starts the
shared LHC opening (components/lhc-opening/, the same as OpenData's); that key
is also the gesture browsers ask for before any sound.
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The opening (components/lhc-opening/): the real LHC tunnel, CERN-FOOTAGE-2022-013-001, an 18 s cut (videos/manifest.toml). It moves on by itself at its end, into the beam pipe. -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" advance-on-end :volume="0.5" exit="push" exit-at="0.45,0.53" />

<LhcOpening part="tunnel" />

<!-- facts: cern-lhc-size-cost -->

<!--
Picture: the real LHC tunnel, 100 m under the border, the magnets on the right;
„LHC 27 km“ low on the left. Let it run: at its end the camera goes on into the
beam pipe (it moves on by itself; → earlier). Its sound is the tunnel's own
ventilation hum.
Words: the story's LHC and LHCb paragraphs stay where the story tells them, on
the event display (slide 9). Move them here if you want them over the opening.

Source: CERN-FOOTAGE-2022-013-001 (CERN).

(~0.3 min)
-->

---
space:
  at: opening
  dim: 0
  ambient: 0
  hum: false
  rate: [[0, 1.4], [2.0, 1.4], [2.7, 0.03], [5.6, 0.03], [6.4, 2.2], [8.5, 1]]
  cameraRate: 1
  path:
    - [0, { at: [0, -400, 0], dist: 3.4, yaw: 28, pitch: 4 }]
    - [2.6, { at: [0, -400, 0], dist: 2.3, yaw: 16, pitch: 6 }]
    - [5.6, { at: [0, -400, 0], dist: 2.0, yaw: -24, pitch: 13 }]
    - [7.8, { at: [2.4, -400, 0], dist: 6.0, yaw: -30, pitch: 12 }]
    - [10.5, { at: [3.4, -400, 0], dist: 8.4, yaw: -32, pitch: 13 }]
---

<LhcOpening name="opening" />

<!--
Picture: one real collision in the black. Two bunches of protons run in along
the beam pipe and cross; the world nearly stops at the crossing while the camera
keeps moving round it, then runs on fast as the debris flies out: 237 particles
bending in LHCb's magnet, stopping in the calorimeter in splashes of energy, the
muons running on. „8 TeV“ at the crossing, „237 dalelės“ as it flies apart. A
low swell, a thump at the crossing, the boom as it flies apart: quiet enough to
talk over. → for the LHCb clip.

The event: one real crossing from LHCb's 2012 open data (CERN Open Data record
24506, run 133488), the same as OpenData's; components/lhc-opening/README.md
has its provenance.

(~0.2 min)
-->

---

<!-- The shared opening's LHCb reel: the detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release. It condenses out of the dust and moves on by itself when it ends. -->
<VideoPlayer src="lhcb.mp4" advance-on-end />

<!--
Picture: the LHCb detector in 3D, with music. Let the clip play (39 s); it ends
by itself as the music fades; → moves on earlier. Here the two talks part: next
is this talk's own cover, the five-quark particle gathering.

(~0.7 min)
-->

---
space: { at: [594, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 0, jx: 0 }" />

<!--
I. VADOVĖLIO GALE ATSAKYMO NĖRA
Message: in my work there is no answer at the back of the book; today you will try it yourself.
Picture: a five-quark particle gathers out of the dust. No text on screen (the owner narrates, 2026-10-10).

Mokykloje, kai nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Esu dalelių fizikas Vilniaus universitete ir mano darbe tokio vadovėlio nėra. Dirbu su klausimais, į kuriuos dar niekas neatsakė. Ekrane – dalelė iš penkių kvarkų. Apie tokias daleles ir bus šis pasakojimas, o tokį darbą šiandien išbandysi ir tu.

(~0.5 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 1, th2: 0, jp: 0, jx: 0 }" />

<!--
II. KAIP NUSPRĘSTI
Message: you decide: is this bump a particle or chance?
Picture: a histogram fills dot by dot (140 dots); one bin near the middle rises well above its neighbours.
Note: the plot is an illustration, not measured data: a random sample from a smooth spectrum with no particle in it, in which chance made the bump (public/data/theta-toy.json). Say „toks grafikas“, never „tikras“.

Štai toks grafikas, kokių matome kasdien. Kiekvienas taškelis – viena masė. Ją apskaičiuojame iš dalelių, kurias detektorius užregistravo susidūrime. Tai masė tos dalelės, iš kurios jos galėjo atsirasti. Taškelis krenta į tą masę atitinkantį stulpelį: kairėje – lengvesnės, dešinėje – sunkesnės. Kuo stulpelis aukštesnis, tuo dažniau tokia masė pasitaikė. Jeigu kurioje nors vietoje susidaro kauburys, gal ten yra dalelė, kurios dar niekas nematė. O gal tai tik atsitiktinumas, kaip kad metant kauliuką kelis kartus iš eilės iškrenta šešetas. Kaip manai, ar čia dalelė?
[pauzė 3 s]

(~0.6 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 1, th2: 0, jp: 0, jx: 0 }" />

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

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 1, jp: 0, jx: 0 }" />

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

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 1, jp: 0, jx: 0 }" />

<StagePhoto src="figures/photos/lhcb-event-run3.jpg" alt="Vienas protonų susidūrimas atnaujintame LHCb detektoriuje, 2022 m.: dalelių pėdsakai sklinda per detektorių" focus="35% 50%" />

<!-- facts: cern-lhc-collisions, cern-run3-end, lhcb-detector-size, lhcb-mission, lhcb-collaboration-2026, lhcb-collaboration-dec-2025 -->

<!--
Message: the story moves to LHCb: the LHC, the experiment, and how a collision becomes one dot on the plot the viewer judged.
Words: the LHC and LHCb paragraphs had pictures of their own (the tunnel clip, the cavern photograph) until the shared opening showed both (2026-10-11). They stay here, in the story's order and unchanged; the opening's notes say where they are.
Picture: a real LHCb event display (a proton–proton collision in the upgraded detector, 2022), condensing out of grains; the collision point on the left, the tracks fanning out to the right.
Licence: CERN / LHCb image, free for educational, non-commercial use; confirm before the event (see the talk's CLAUDE.md, Figures).

Pentakvarkų istorija tuo nesibaigė. Ji tęsėsi eksperimente, kuriame dabar dirbu ir aš. Jis yra CERN, prie Ženevos. Ten, maždaug šimto metrų gylyje, yra dvidešimt septynių kilometrų žiedas – Didysis hadronų greitintuvas. Kai jis veikia, protonai jame susiduria beveik šviesos greičiu ir per sekundę įvyksta apie milijardą susidūrimų.

Viename iš susidūrimo taškų stovi LHCb – penkių tūkstančių šešių šimtų tonų detektorius. LHCb tiria daleles, kuriose yra sunkiųjų kvarkų, ypač gražiojo kvarko. Pirmiausia jis tiria, kuo materija skiriasi nuo antimaterijos. Visatos pradžioje jų turėjo atsirasti po lygiai, o šiandien beveik viskas aplink mus yra materija, ir kodėl taip yra, kol kas niekas nežino. Tie patys duomenys leidžia ieškoti ir naujų dalelių, sudarytų iš kvarkų. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš dvidešimt septynių šalių. Aš esu vienas iš jų.

Taip atrodo protonų susidūrimas LHCb detektoriuje. Kairėje, kur susiduria protonai, atsiranda daug naujų dalelių, ir kiekviena plona raudona linija, sklindanti iš ten, – vienos jų kelias. Detektorius išmatuoja, kur jos praskriejo ir kaip stipriai magnetas išlenkė jų kelią. Iš to kompiuteriai apskaičiuoja, kokią masę turėtų dalelė, iš kurios kelios iš jų galėjo atsirasti. Viena tokia apskaičiuota masė – vienas taškelis tokiame grafike, kokį vertinai pradžioje. Susidūrimų yra tiek daug, kad kompiuteriai iš karto atrenka tik tuos, kurie gali būti įdomūs.

(~1.6 min)
-->

---
space: { at: lhcb, dim: 0.05 }
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 1, jx: 0 }" :clicks="{ 1: { jp: 2 } }" />

<!-- facts: lhcb-pentaquark-2015, lhcb-pentaquark-2019 -->

<!--
Message: in 2015 LHCb, studying a heavier particle's decay, found a peak it had not looked for, checked everything, and it held; by 2019 the peak was two states and a third had appeared.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate, fast at first, until the narrow peaks stand out (about 20 s). → spausk at „2019 metais…“: ticks light over the three peaks while the rest of the plot steps back (jp step 2; at once if the fill is done, else when it ends).
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV). These bins hold the 2015 sample and the later data together; the 2015 paper's own bins are not on HEPData.

2015 metais LHCb tyrė, kaip skyla viena sunki dalelė, ir grafike netikėtai iškilo smailė – aukštas, siauras kauburys. Čia matai visus duomenis iki 2019 metų, todėl smailių daugiau. Apie jas – po akimirkos. Prieš skelbdama rezultatą, LHCb komanda tikrino viską, ką tik galėjo: ar smailės nesukuria detektorius, kitos dalelės ar tai, kaip buvo atrinkti duomenys. Smailė liko.
→ spausk
2019 metais, surinkus dar daugiau duomenų, paaiškėjo, kad tai iš tikrųjų dvi smailės, ir atsirado trečia. Tai trys pentakvarkai, kuriuos matai dabar.

(~0.7 min)
-->

---
space: { at: [1797.6, 4.2, 0], dist: 21, yaw: 0, pitch: 3, sway: 0.3, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, th2: 0, jp: 2, jx: 1 }" />

<div class="heap" style="left: 557px; top: 404px"><span class="n">27 292 taškai</span></div>
<div class="heap" style="left: 161px; top: 404px"><span class="n">140 taškų</span></div>

<!-- facts: theta-plus-2003-false-alarm, lhcb-pentaquark-2019, particle-physics-5-sigma-discovery -->

<!--
Message: the difference was the amount of data. A bump reported at 4,6σ in 2003 went away with more data; LHCb's peaks held with nine times more data in 2019, the new one at 7,3σ. (Not: 'it failed because 4,6 < 5'. Other 2003 bumps were reported near 5σ and went away too.)
Picture: the camera draws back to show two plots at the same scale, one grain per entry and the same height per entry. On the left is the 140-entry plot from slides 6–7: an illustration, not LEPS's data. On the right are LHCb's 27 292 candidates (the 2019 bins) with their three marked peaks. Under them, their counts: „140 taškų“ and „27 292 taškai“; the left plot appears as a thin strip.
Background, if asked: LEPS's own peak was 19 events over a background of 17 (19/√17 = 4,6σ, their paper's own estimate; arXiv:hep-ex/0301020).

Štai abu grafikai šalia, ir abiejuose vienas taškelis – viena apskaičiuota masė. Kairėje – pavyzdinis grafikas, kurį matei pradžioje, šimtas keturiasdešimt taškų. Dešinėje – LHCb duomenys, jų daugiau nei dvidešimt septyni tūkstančiai. Fizikai skaičiuoja, kiek kauburys iškyla virš atsitiktinių svyravimų. Tai vadinama reikšmingumu ir matuojama sigmomis. Atradimu paprastai vadinamas rezultatas, kurio reikšmingumas – bent penkios sigmos. Tada tikimybė, kad tai tik atsitiktinis svyravimas, – maždaug viena iš trijų su puse milijono. 2003 metų kauburio reikšmingumas buvo 4,6 sigmos, bet surinkus daugiau duomenų jis išnyko. 2019 metais LHCb turėjo devynis kartus daugiau duomenų nei 2015-aisiais, ir smailės liko. Naujos smailės reikšmingumas buvo 7,3 sigmos.

Šaltiniai: LEPS, Phys. Rev. Lett. 91, 012002 (2003), arXiv:hep-ex/0301020 („a Gaussian significance of 4.6 sigma“); LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData ins1728691; Physics World, 2007-05-01, „The tale of the blogs’ boson“ (3σ – požymiai, 5σ – atradimas).

(~0.6 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0 }" />

<div class="city late caption" style="left: 716px; top: 168px">Vilnius</div>
<div class="city late caption" style="left: 414px; top: 374px">CERN</div>

<!--
III. KELIAS
Message: my own road into LHCb was not planned either.
Picture: the trail draws across Europe: Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius. Only Vilnius and CERN are named on screen; Glasgow, Heidelberg and Bonn are the speaker's to tell or skip.

Į LHCb aš patekau ne tiesiu keliu. Iki dvylikos metų norėjau būti egiptologu. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN. Studijavau Glazge ir ten dirbau vadybininku, kad turėčiau iš ko gyventi. Parvykęs į Lietuvą dirbau su lazeriais. Į dalelių fiziką grįžau per doktorantūrą. Ją pradėjau Heidelberge, o pandemijos metais visa mūsų grupė persikėlė į Boną. Dabar Vilniaus universitete kartu su kolegomis kuriame LHCb grupę.

(~0.5 min)
-->

---
space: { at: [1205.6, 0.25, -0.7], dist: 24, yaw: 0, pitch: 60, sway: 0.5, dim: 0.2 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0 }" />

<div class="city caption" style="left: 726px; top: 128px">Vilnius</div>
<div class="city caption" style="left: 232px; top: 428px">CERN</div>

<!-- facts: lhcb-run1-release-sarpis, sarpis-phd-bonn-2023 -->

<!--
Message: what the work is like: mostly at a desk in Vilnius, results reachable from anywhere, a lot of travel, and long careful jobs such as preparing LHCb's open data.
Picture: the camera comes down from the whole map to Vilnius (upper right) and the arcs to CERN (lower left), both named.
Words: lines 1–4 are the draft the owner approved on 2026-10-09 (through the Scheduler), built from the speaker's own public words. Line 2 comes from an automatic transcript and is kept as the draft wrote it.

Dabar dažniausiai dirbu Vilniaus universitete. Į CERN su savo grupe važiuojame tik ypatingomis progomis. Detektorius renka duomenis, prie jo dirba inžinieriai, o rezultatus aš galiu gauti iš bet kurios pasaulio vietos. Bet keliauti tenka daug. Mūsų srityje dvidešimt–keturiasdešimt skrydžių per metus nėra retenybė. Doktorantūros metais Bonoje man teko paruošti LHCb duomenis viešam naudojimui. Šimtus tūkstančių failų reikėjo nukopijuoti ir patikrinti, iš viso beveik petabaitą. Tai užtruko beveik dvejus metus.

Šaltiniai: LRT KLASIKA „Šviesi ateitis“, LRT.lt, 2024-05-20; „Tapk geresniu“, 2026-09-14 (automatinis įrašo tekstas); M. Šarpio tinklaraštis, 2024-01-08 („Hello from RAL“) ir 2024-01-15 („LHCb Run I data is released“).

(~0.7 min)
-->

---
space: { at: [690, 6, 30], dist: 20, yaw: 40, pitch: 6, sway: 0.5, dim: 0.6 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0 }" />

<!--
IV. KĄ GALI PADARYTI TU
Message: three real things a student can do this year.
Picture: plain dust, dimmed (the camera turned away from the form, which returns on the close).
Check before the talk: the 2027 masterclass date at VU (2026: 26 February) and the 2027 Beamline for Schools call (past rules: 16 or older, teams of at least five with an adult coach).

Štai ką gali padaryti jau šiais mokslo metais. Vilniaus universitete vasarį ar kovą vyksta LHCb meistriškumo klasė. Mokiniai ten vieną dieną analizuoja tikrus CERN duomenis ir rezultatus aptaria su kitų šalių grupėmis. CERN kasmet rengia konkursą „Beamline for Schools“. Bent penkių mokinių nuo šešiolikos metų komanda su suaugusiu vadovu, pavyzdžiui, mokytoju, pasiūlo eksperimentą. Laimėtojai jį atlieka prie tikro greitintuvo. Ir LHCb duomenis nemokamai gali atsisiųsti kiekvienas iš opendata.cern.ch.

(~0.8 min)
-->

---
space: { at: quarks, dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.35 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, th2: 0, jp: 2, jx: 0 }" />

<!--
Message: one task for this week.
Picture: the five-quark particle of the cover, held. The speaker asks the question. No text on screen: every picture in the talk is CERN's, which needs no credit.

Ir viena užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė 2 s]

(~0.4 min)
-->
