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
title: Užsikrauk karjerai
duration: 12min
sources: notes
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, delivered online on 27 Oct 2026. About 11 minutes,
  20 slides. A cover (the speaker's name over the five-quark form gathering);
  Innoday's cosmic web as a still that breaks into grains, which fly into the
  funnel of the Universe's history; then the LHC opening it shares with
  OpenData and Innoday (components/lhc-opening/: CERN from above, the real
  tunnel, into the beam pipe, one real 2012 CMS collision in slow motion, the
  3D LHCb clip). The viewer sits in the physicist's seat: judge a bump in a
  small histogram (an illustration, said so in the notes); LHCb's real Ωc⁰
  spectrum fills grain by grain and its five narrow peaks light; the
  pentaquark peaks (2015, 2019, from HEPData) and the two plots side by side,
  where the 2003 false alarm is told; the speaker's route round Europe, and how
  all of it can now be done in Lithuania; OpenData's piles of open data (800 TB,
  4 PB, LHCb's 100 PB), the sun of plots anyone can make from it, the
  masterclass, and „Ačiū“ over the five-quark form.
layout: cover
space: { at: [593.2, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0 }" />

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nt">LHCb</span>&nbsp;Vilnius<br>Vilniaus universitetas</div>

<!--
I. PRADŽIA
Message: who is speaking, and the particle this story is about.
Picture: the cover, as OpenData's and Innoday's (the owner, 15 Oct: "take elements from them"), without a title (the owner, 16 Oct: "Don't call it 'vadovelio gale atsakymo nera' don't need that"): the name line over the five-quark form gathering out of the dust (`quarks`). The overview clip buffers behind it. → starts the opening; that key is also the gesture browsers ask for before any sound.

Laba diena. Esu Mindaugas Šarpis, dalelių fizikas Vilniaus universitete. Ekrane iš dulkių susirenka dalelė, prie kurios dar grįšime. Bet pradėkime nuo visos Visatos.

(~0.3 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }   # Innoday's takeover pose: it looks down the funnel's axis, so the picture's middle becomes the Big Bang on the next step
---

<WebTakeover />

<!--
Message: the Universe at its largest scale.
Picture: Innoday's cosmic web as a still (the owner, 18 Oct: "take the still cosmic web from the innoday"): the picture holds for half a second, then its dark lets go evenly and its bright filaments break into grains, each on its own pixel's line of sight, so the picture is now made of the world's grains (3 s). They make the funnel on the next step.

Maždaug taip atrodo Visata didžiausiu mastu: galaktikų gijos ir tuštumos tarp jų.

The picture: the last frame of the owner's SpaceEngine edit for Innoday (public/figures/opener_last.jpg), the cosmic web of NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“, NSF), as Innoday credits it.

(~0.2 min)
-->

---
space: { at: [30, 39, -119], dist: 25, yaw: -72, pitch: 13, dim: 0, flight: 3.5 }   # Innoday's: the bell on its side, narrow end left, from three-quarters on the mouth side (the NASA/WMAP figure)
---

<AfterFlight :delay="6.8"><div class="age"><span class="n">13,8</span> mlrd. metų</div></AfterFlight>

<!-- facts: universe-age-planck-2018, lhc-worlds-largest-accelerator -->

<!--
Message: the history of the Universe, from the Big Bang to today; to see what everything is made of, we need the biggest accelerator.
Picture: Innoday's funnel (the owner, 18 Oct: "copy the funnel as well"): the web's grains fly into the funnel's shape (4,4 s), the middle of the picture first, as the camera swings round to the side; then the funnel's own grains and the CMB disk resolve over them, and last its mesh comes in underneath. The Universe's history in grains, the NASA/WMAP figure: the Big Bang at the narrow end (left), the CMB disk (the real Planck map), the dark ages with no stars, a crowd of hot first galaxies, then ever fewer, cooler ones to the mouth, today. „13,8 mlrd. metų“ once the funnel stands (6,8 s). No hum (this talk's).

Šis piltuvas – Visatos istorija. Siaurasis galas – Didysis sprogimas prieš 13,8 milijardo metų, platusis – šiandiena. Žvaigždės, planetos ir mes patys esame sudaryti iš dalelių. Norint pamatyti, kas yra pačių dalelių viduje, jas reikia įgreitinti iki didžiulės energijos ir sudaužyti. Tam CERN – Europos dalelių fizikos laboratorija – pastatė didžiausią pasaulyje dalelių greitintuvą.

If asked: the disk is the real cosmic microwave background, the oldest light we can see, when the Universe was about 380 000 years old (Planck's 2018 map, ESA and the Planck Collaboration).

Šaltiniai: Planck 2018 results VI, A&A 641, A6 (13,787 ± 0,020 mlrd. metų); the CMB picture: Planck 2018 SMICA-noSZ map, ESA and the Planck Collaboration, CC BY-NC 3.0 IGO (reprojected, smoothed, recoloured: Innoday's notes).

(~0.5 min)
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

<Grains :set="{ pq: 3, route: -1, th1: 1, oc: 0, jp: 0, jx: 0, lietuva: 0 }" />

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
space: { at: omegac, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, oc: 1, jp: 0, jx: 0, lietuva: 0 }" />

<!-- facts: lhcb-omegac-five-2017, lhcb-omegac-2017-sample -->

<!--
Message: from 140 dots you cannot tell; this is what it looks like when there is enough data.
Picture: LHCb's real m(Ξc⁺K⁻) spectrum fills grain by grain, fast at first (about 20 s), until five narrow peaks stand clear of the rest (the owner, 18 Oct: "slide 7-8 just show such histogram with omega c resonances, nicely resolved"). Data: LHCb, Phys. Rev. Lett. 118, 182001 (2017), Fig. 2 (3,3 fb⁻¹ at 7, 8 and 13 TeV): its 1 MeV bin contents read from the vector figure (no HEPData record) and summed to 2 MeV, where they equal the paper's own Fig. 3 bin for bin; 2 960–3 300 MeV, 59 453 candidates (public/data/omegac.json), drawn one grain per two candidates (`unit: 2`). All candidates as the figure shows them, no background subtracted.

Iš šimto keturiasdešimties taškų to pasakyti negalima: tokį kauburį gali sukurti ir atsitiktinumas. Štai kaip atrodo, kai duomenų užtenka. Tai tikri LHCb duomenys. Čia beveik šešiasdešimt tūkstančių apskaičiuotų masių. Grafike iškyla penkios smailės – aukšti, siauri kauburiai.

(~0.4 min)
-->

---
space: { at: omegac, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, oc: 2, jp: 0, jx: 0, lietuva: 0 }" />

<!-- facts: lhcb-omegac-five-2017, lhcb-omegac-2017-masses, omegac-quark-content, kaon-quark-content, lhcb-omegac-confirmed, lhcb-omegac-2023 -->

<!--
Message: each peak is a new particle: in 2017 LHCb announced five at once, all made of the same three quarks.
Picture: the same plot; ticks light over the five narrow peaks while the rest steps back (oc step 2).

Kiekviena smailė – nauja dalelė. 2017 metais LHCb iš karto paskelbė penkias naujas daleles. Visos jos sudarytos iš tų pačių trijų kvarkų: vieno žaviojo ir dviejų keistųjų. Kvarkai – smulkesnės dalelės, iš kurių sudaryti ir protonai bei neutronai; protone jų irgi trys. Šios penkios dalelės skiriasi tuo, kiek energijos turi jų viduje esantys kvarkai, todėl skiriasi ir jų masės.

If asked: the Ωc⁰ states (css), seen decaying to a Ξc⁺ (usc) and a K⁻ (sū); masses 3000, 3050, 3066, 3090 and 3119 MeV, each above 10σ, the narrowest under a few MeV wide (PRL 118 (2017) 182001). The ticks stand over the tallest 2 MeV bin of each. Belle and LHCb itself (in Ωb⁻ decays) later confirmed four of them; in 2023, with five times the data, LHCb added two more, broader ones (PRL 131 (2023) 131902).

Šaltiniai: LHCb, Phys. Rev. Lett. 118, 182001 (2017), arXiv:1703.04639, Fig. 2 (bin contents read from the vector figure).

(~0.5 min)
-->

---
space: { at: lhcb, dim: 0.05 }
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th1: 0, oc: 0, jp: 1, jx: 0, lietuva: 0 }" :clicks="{ 1: { jp: 2 } }" />

<!-- facts: pentaquark-idea-1964, lhcb-pentaquark-2015, lhcb-pentaquark-2019 -->

<!--
Message: the five-quark particle of the cover: in 2015 LHCb, studying a heavier particle's decay, found a peak it had not looked for, checked everything, and it held; by 2019 the peak was two states and a third had appeared.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate, fast at first, until the narrow peaks stand out (about 20 s). → spausk at „2019 metais…“: ticks light over the three peaks while the rest of the plot steps back (jp step 2; at once if the fill is done, else when it ends).
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV). These bins hold the 2015 sample and the later data together; the 2015 paper's own bins are not on HEPData.

O dabar grįžkime prie dalelės, kurią matei pačioje pradžioje. Pagal 1964 metais iškeltą kvarkų idėją gali būti ir dalelių iš penkių kvarkų – pentakvarkų, bet ilgai niekas jų nebuvo matęs. 2015 metais LHCb tyrė, kaip skyla viena sunki dalelė, ir grafike netikėtai iškilo smailė. Prieš skelbdami rezultatą, LHCb fizikai tikrino viską, ką tik galėjo: ar smailės nesukuria detektorius, kitos dalelės ar tai, kaip buvo atrinkti duomenys. Smailė liko. Čia matai visus duomenis iki 2019 metų, todėl smailių daugiau.
→ spausk
2019 metais, surinkus dar daugiau duomenų, paaiškėjo, kad tai iš tikrųjų dvi smailės, ir atsirado trečia. Tai trys pentakvarkai, kuriuos matai dabar.

(~0.8 min)
-->

---
space: { at: [1797.6, 4.2, 0], dist: 21, yaw: 0, pitch: 3, sway: 0.3, dim: 0.05 }
---

<Grains :set="{ pq: 3, route: -1, th1: 0, oc: 0, jp: 2, jx: 1, lietuva: 0 }" />

<div class="heap" style="left: 557px; top: 404px"><span class="n">27&nbsp;292&nbsp;taškai</span></div>
<div class="heap" style="left: 116px; top: 404px"><span class="n">140&nbsp;taškų</span></div>

<!-- facts: theta-plus-2003-false-alarm, lhcb-pentaquark-2019, particle-physics-5-sigma-discovery -->

<!--
Message: the difference was the amount of data. A bump reported at 4,6σ in 2003 went away with more data; LHCb's peaks held with nine times more data in 2019, the new one at 7,3σ. (Not: 'it failed because 4,6 < 5'. Other 2003 bumps were reported near 5σ and went away too.)
Picture: the camera draws back to show two plots at the same scale, one grain per entry and the same height per entry. On the left is the 140-entry plot of slide 8: an illustration, not LEPS's data. On the right are LHCb's 27 292 candidates (the 2019 bins) with their three marked peaks. Under them, their counts: „140 taškų“ and „27 292 taškai“; the left plot appears as a thin strip.
Words: the 2003 claim (slides 7–8 until 18 Oct, when the owner swapped them for the Ωc plot) is told here in two sentences.
Background, if asked: LEPS's own peak was 19 events over a background of 17 (19/√17 = 4,6σ, their paper's own estimate; arXiv:hep-ex/0301020).

Štai abu grafikai šalia, ir abiejuose vienas taškelis – viena apskaičiuota masė. Kairėje – pavyzdinis grafikas, kurį vertinai, šimtas keturiasdešimt taškų. Dešinėje – LHCb pentakvarkų grafikas, daugiau nei dvidešimt septyni tūkstančiai taškų. Fizikai skaičiuoja, kiek kauburys iškyla virš atsitiktinių svyravimų. Tai vadinama reikšmingumu ir matuojama sigmomis. Atradimu paprastai vadinamas rezultatas, kurio reikšmingumas – bent penkios sigmos. Tai reiškia, kad vien atsitiktiniai svyravimai tokį ar dar didesnį kauburį sukurtų maždaug vieną kartą iš trijų su puse milijono. 2003 metais fizikai Japonijoje panašų kauburį jau buvo paskelbę pentakvarku. Jo reikšmingumas buvo 4,6 sigmos, beveik tiek, kiek reikia atradimui. Bet tą kauburį sudarė vos keliolika taškų, ir surinkus daugiau duomenų jis išnyko. 2019 metais LHCb turėjo devynis kartus daugiau tokių skilimų nei 2015-aisiais, ir smailės liko. Naujos smailės reikšmingumas buvo 7,3 sigmos.

Šaltiniai: LEPS, Phys. Rev. Lett. 91, 012002 (2003), arXiv:hep-ex/0301020 („a Gaussian significance of 4.6 sigma“); LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData ins1728691; Physics World, 2007-05-01, „The tale of the blogs’ boson“ (3σ – požymiai, 5σ – atradimas).

(~0.9 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
clicks: 4
---

<Grains :set="{ pq: 3, route: 1, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0 }" :clicks="{ 1: { route: 3 }, 2: { route: 4 }, 3: { route: 6 }, 4: { route: 7 } }" />

<div class="city late caption" style="left: 734px; top: 149px">Vilnius</div>
<div class="city late caption" style="left: 360px; top: 452px">CERN</div>
<div v-click="1" class="city step caption" style="left: 280px; top: 152px; --step-delay: 3.4s">Glazgas</div>
<div v-click="3" class="city step caption" style="left: 470px; top: 357px; --step-delay: 2.2s">Heidelbergas</div>
<div v-click="3" class="city r step caption" style="left: 394px; top: 250px; --step-delay: 3.6s">Bona</div>

<!-- facts: sarpis-phd-bonn-2023, lhcb-run1-release-sarpis, sarpis-interview-run1-1-5-years, lhcb-run1-volume-sources-differ -->

<!--
III. KELIAS
Message: my own road into LHCb was not planned either, and it went round Europe.
Picture: the trail draws across Europe leg by leg as the stops are told (the owner, 15 Oct: "Show my path around europe"): Vilnius → CERN on arrival, then Glasgow (click 1), home (2), Heidelberg and Bonn (3), home to Vilnius (4). Each city's name comes up as the trail reaches it.

Į LHCb aš patekau ne tiesiu keliu. Iki dvylikos metų norėjau būti egiptologu. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN.
→ spausk
Studijavau Glazge ir ten dirbau vadybininku, kad turėčiau iš ko gyventi.
→ spausk
Parvykęs į Lietuvą dirbau su lazeriais.
→ spausk
Į dalelių fiziką grįžau per doktorantūrą. Ją pradėjau Heidelberge, o pandemijos metais visa mūsų grupė persikėlė į Boną. Ten man teko paruošti LHCb duomenis viešam naudojimui – daugiau nei šimtą tūkstančių failų. Net su tam parašytomis programomis tai užtruko apie pusantrų metų.
→ spausk
Dabar Vilniaus universitete kartu su kolegomis kuriame LHCb grupę.

Optional, the organisers' point („you don't need to know now what you will be“), in your own words if it is true for you: nothing here is said for you.

Šaltiniai: LRT KLASIKA „Šviesi ateitis“, LRT.lt, 2024-05-20; „Tapk geresniu“, 2026-09-14 (automatinis įrašo tekstas); M. Šarpio tinklaraštis, 2024-01-15 („LHCb Run I data is released“); VU biblioteka, interviu, 2026-03-05.

(~0.8 min)
-->

---
space: { at: [1210.6, 0.25, -6.5], dist: 15, yaw: 0, pitch: 62, sway: 0.3, dim: 0.2 }
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 1 }" />

<div class="city caption" style="left: 718px; top: 230px">Vilnius</div>

<!-- facts: cern-lithuania, lhcb-vilnius-joined, lhcb-vilnius-students, lhcb-vilnius-racz, lhcb-open-data-coordinator-2026 -->

<!--
Message: all of what that road took abroad can now be done in Lithuania (the owner, 15 Oct: "then stress all of this can now be done in Lithuania").
Picture: the camera dives from slide 12's whole of Europe down to Vilnius, and Lithuania's outline comes up in light blue round it (`lietuva`, Natural Earth); the route's arcs leave Vilnius westward out of frame. Only Vilnius is named.
Words: the working-day lines 3–4 are from the draft the owner approved on 2026-10-09 (through the Scheduler), from the speaker's own public words; line 3 comes from an automatic transcript. The travel line (20–40 flights a year) is gone: it worked against this slide's point. The open-data job moved to slide 12, to Bonn, where it was done.

Visa tai dabar galima padaryti Lietuvoje. Nuo 2018 metų Lietuva yra asocijuotoji CERN narė, todėl Lietuvos piliečiai gali kandidatuoti į darbo vietas CERN. Nuo 2024 metų Vilniaus universitetas dalyvauja LHCb eksperimente. Didžioji dalis mūsų grupės – studentai, nuo bakalauro studijų iki doktorantūros. Pirmoji VU doktorantė LHCb eksperimente ieško pentakvarkų. O šią vasarą CERN praktiką atliko trylika VU studentų – daugiausia iki šiol.
Pats dažniausiai dirbu Vilniaus universitete. Į CERN su savo grupe važiuojame tik ypatingomis progomis. Detektorius renka duomenis, prie jo dirba inžinieriai, o rezultatus galiu gauti iš bet kurios pasaulio vietos. Nuo šių metų rugpjūčio esu LHCb atvirųjų duomenų koordinatorius.

Šaltiniai: home.cern, 2018-01-08 (asocijuotoji narė); VU FF, 2024-09-02 (VU priimtas į LHCb); VU, 2026-08-20 (grupė ir 13 vasaros studentų); VU, R. Racz (pirmoji VU doktorantė LHCb); LRT KLASIKA „Šviesi ateitis“, LRT.lt, 2024-05-20; „Tapk geresniu“, 2026-09-14 (automatinis įrašo tekstas); VU, 2026-07-30 (koordinatorius).

(~0.9 min)
-->

---
space: { at: [2597.0, 0.6, 5.0], dist: 10, yaw: -10, pitch: 8, dim: 0.15 }   # from the front, so the 1 TB sphere and its label stand in frame right of the 800 pile, nearly as far from the lens (OpenData's yaw-73 pose, its slide 7, left the sphere below the frame); the camera stays inside the vault's clear capsules
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1], 'scale:labels': 1, sun: 0, vilnius: 0 }" />

<div class="readout late">

<div class="big"><Count name="open" :from="0" :to="800" :delay="2400" /><span class="unit">TB</span></div>

</div>

<!-- facts: lhcb-run1-volume-sources-differ, lhcb-open-data, lhcb-run1-release-sarpis, lhcb-event-sizes-2024 -->

<!--
IV. ATVIRIEJI DUOMENYS
Message: the data the speaker prepared in Bonn, in one picture: 800 terabytes.
Picture: OpenData's piles (the owner, 18 Oct: "Show something about open data"): the camera flies in to a single gold sphere and a pile of 800 like it, standing on a floor of grains in a space of data (fine filaments, a front of light from the first sphere); „1 TB“ and „800 TB“ under them, the count „800 TB“ low on the left.

Prisimeni duomenis, kuriuos ruošiau Bonoje? Štai jie. Kiekviena sfera – vienas terabaitas, maždaug nešiojamojo kompiuterio diskas. Jame telpa dešimtys milijonų įrašytų susidūrimų. 2023 metų gruodį viešai paskelbti visi 2011–2012 metų LHCb protonų susidūrimų duomenys – apie aštuonis šimtus terabaitų.

The volume: CERN's figure is 800 TB (VU: over 1 PB in all, of which 800 TB of physics data in over 100 000 files; lhcb-run1-volume-sources-differ); slide 13 says only the files since 18 Oct, so the size is told here, once. A stored LHCb event is about 10–100 kB (2024), so a terabyte holds tens of millions.

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20); VU naujienos (Run 1 rinkinio parengimas); LHCb Sprucing, arXiv:2506.20309 (2024 m. įvykių dydžiai).

(~0.4 min)
-->

---
space: { at: [2591.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }   # OpenData's 4 PB pose (its slide 8)
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1, 2], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout last">

<div class="big"><Count name="open" :from="800" :to="4000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="caption">Atvirieji LHCb duomenys</p>

</div>

<!-- facts: lhcb-ntupling-service-4pb -->

<!--
Message: today more than four petabytes of LHCb data are open.
Picture: the camera pulls back; five copies of the 800 pile merge into one gold pile of 4 000 spheres; the count runs from 800 to 4 000 TB.

Šiais metais atverta ir dalis 2015–2018 metų duomenų. Kartu su ankstesniais tai daugiau nei keturi tūkstančiai terabaitų, arba keturi petabaitai.

Šaltiniai: LHCb outreach, 2026-03-03 („over 4 PB of data to explore“); CERN Open Data portalas, 2026-02-22.

(~0.3 min)
-->

---
space: { at: [2583.5, 6.5, -7], dist: 65, yaw: 21.8, pitch: 7.1, sway: 4, dim: 0.15 }   # OpenData's 100 PB pose (its slide 9)
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1, 2, 3], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout blue late">

<div class="big"><Count name="lhcb" :from="0" :to="100000" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Visi LHCb duomenys</p>

</div>

<!-- facts: lhcb-data-100pb, lhcb-open-data-policy -->

<!--
Message: the open data is the gold part in front of LHCb's whole 100 PB, and more opens every year.
Picture: the camera pulls far back; a blue pile of 100 000 spheres stands behind the gold one.

O tai visi LHCb nuo 2010 metų surinkti duomenys – daugiau nei šimtas petabaitų, arba šimtas tūkstančių tokių sferų. Jei kiekvieną terabaitą laikytume atskirame nešiojamajame kompiuteryje ir juos sukrautume vieną ant kito, stulpas būtų dviejų kilometrų aukščio. Auksinė dalis priekyje jau atvira. Iš kiekvieno duomenų rinkimo etapo LHCb maždaug pusę duomenų atveria praėjus penkeriems metams nuo jo pabaigos, o visus – po dešimties.

Scale, worked out: a laptop about 2 cm thick holding 1 TB; 100 000 × 2 cm = 2 km (OpenData's notes).

Šaltiniai: B. Couturier, ISGC 2025 („more than 100 PB of data“); LHCb, arXiv:2504.00610 (atvirųjų duomenų politika).

(~0.5 min)
-->

---
space: { at: [2600, -0.3, 0], dist: 36, yaw: 0, pitch: 3, dim: 0.05 }   # OpenData's sun pose (its slide 11)
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, scale: [1, 2], 'scale:labels': 0, sun: 1, vilnius: 0 }" />

<!-- facts: lhcb-open-data, opendata-portal-5pb, lhcb-opendata-brown-2026, stonkus-bsc-2026, stonkus-bsc-2026-yield, lhcb-pentaquark-2015 -->

<!--
Message: anyone can use the open data: we did, researchers elsewhere do, and so did a VU student.
Picture: OpenData's sun of plots: a sun turns slowly round the gold pile, rays of grains leaving it to every side, nineteen of them ending at plots made from LHCb's open data (the grains land on each plot's curves), seven at empty places, gold clouds waiting (OpenData's bright calorimeter map, calo-3, is an empty place here: it outshone the piles). No caption, so no `keepOut` box: plots and names read in the lower left too. No text: „everyone can use this“ is said, not shown (the owner, 18 Oct, through the Scheduler).

Šiais duomenimis naudotis gali kiekvienas. Juos nemokamai galima atsisiųsti iš svetainės opendata.cern.ch. Šiuos grafikus padarėme patys iš dviejų viešų failų. Rugsėjį du Browno universiteto fizikai paskelbė tyrimą, atliktą su atviraisiais LHCb duomenimis. O mūsų studentas Dominykas Stonkus šiais metais apgynė bakalauro darbą. Jis paėmė viešus 2012 metų LHCb duomenis, ir jo grafike kauburys iškilo toje pačioje vietoje, kur LHCb 2015 metais rado pentakvarkus.

Do not say „atrado“ or „pirmasis“ of the thesis: it calls itself a qualitative check, not an independent observation. The plots, if asked: the masses of π⁰, D⁰, J/ψ, K⁰S and Λ, the D⁰ and K⁰S lifetimes, the magnet's field, the beam spot, spectra and multiplicities, all from CERN Open Data records 401 and 24506. The Brown paper is a preprint.

Šaltiniai: CERN Open Data portalas (daugiau nei 5 PB); arXiv:2609.09275; D. Stonkus, bakalauro darbas, VU, 2026, epublications.vu.lt/object/elaba:308118793/308118793.pdf.

(~0.6 min)
-->

---
space: { at: [2600.17, -1.03, 0], dist: 30.45, yaw: 0, pitch: 3, dim: 0.05 }   # OpenData's Vilnius pose (its slide 12)
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, scale: [1, 2], 'scale:labels': 0, sun: 0, vilnius: 1 }" />

<!-- facts: lhcb-masterclass-vilnius-2026, lhcb-opendata-masterclass-2014, stonkus-bsc-2026 -->

<!--
Message: you can start now: the masterclass, then a thesis; the empty places are yours.
Picture: OpenData's second sun, round the same gold pile: rays end at two white clusters named „Meistriškumo pamoka“ and „Magistro ir bakalauro darbai“ and at gold clouds breathing slowly, room for what comes next. (OpenData's other seven names are empty places here; the positions are its searched layout.)
The masterclass is told without dates (the owner, 15 Oct: "No dates for masterclass"). Do not say the Vilnius masterclass uses CERN Open Data files: no source shows it; it uses real LHCb data.

Pradėti galima jau mokykloje. Vilniaus universitete vyksta LHCb meistriškumo pamokos: mokiniai ten per vieną dieną su tikrais LHCb duomenimis patys išmatuoja, kiek laiko gyvuoja viena dalelė. Beje, pirmieji vieši LHCb failai 2014 metais buvo paskelbti būtent tokioms pamokoms. Universitete studentai su atviraisiais duomenimis rašo magistro ir bakalauro darbus. O šios tuščios vietos laukia tavęs.

If asked: the particle is the D⁰ meson (the masterclass's D⁰-lifetime exercise).

Šaltiniai: VU FF, LHCb meistriškumo pamokos (indico.cern.ch/event/1648092); CERN Open Data, įrašas 401 (2014); D. Stonkus, bakalauro darbas, VU, 2026.

(~0.5 min)
-->

---
space: { at: [595.5, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }   # the cover's view and dim, the form a little nearer the middle (right half), „Ačiū“ beside it in the left half
---

<Grains :set="{ pq: 3, route: 7, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0 }" />

<div class="thanks beside">Ačiū</div>

<!--
Message: thanks.
Picture: back to the cover's five-quark particle; „Ačiū“. (The faces ring went with slides 14–17 on 18 Oct; whether the talk closes on „Ačiū“, and over what, is the owner's to say: the Scheduler asked.)

Ačiū.

(~0.1 min)
-->
