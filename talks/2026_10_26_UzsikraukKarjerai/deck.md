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
  motion: floor   # the owner's MacBook or a studio PC: its reduced-motion setting is not the audience's choice (v0.8.2; Scheduler, 21 Oct)
  options: { dustSize: 2.2, reach: 22, nebula: 0.12, grain: 0.012, aberration: 0, vignette: 0.7, bloom: 0.42 }   # OpenData's look: deep, crisp, not hazy
title: Kas vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po žeme
duration: 15min
broadcast: true            # a studio recording (owner, 21 Oct): talk ready runs the safe-area check, talk record the broadcast rules
sources: notes
info: |
  „Kas vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po žeme“:
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement), a Lithuanian
  talk for grades 9–12, recorded in the Delfi studio on 26 Oct 2026 (1080p50,
  on a screen behind the speaker) and streamed on 27 Oct. 15 minutes, 22
  slides (notes/blueprint.md v2 of 20 Oct, with the owner's 15-minute round
  of 21 Oct). One dot: a particle of five quarks took 51 years to find, so
  how do you know you have found something nobody has seen? The cover;
  Innoday's cosmic web and funnel; the LHC opening (CERN from above, the real
  tunnel, a real 2012 CMS collision, the 3D LHCb clip); inside LHCb 100 m
  down, its model beside a person, its own real collision and the 40 MHz
  glow, one mass one dot. The viewer judges a bump of 140 dots, sees it drown
  in 25 times more random dots, as physicists were fooled in 2003; LHCb's
  Ωc⁰ spectrum, five narrow peaks; the 2015 pentaquark peak, which held; the
  two plots and the rule. Then the speaker's road round Europe, the group in
  Vilnius and its part of the detector (the SciFi light injection),
  OpenData's piles of open data, the data centre's tape robot, the sun of
  plots and a VU student's check, the masterclass, and „Ačiū“.
layout: cover
space: { at: [593.2, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0 }" />

<div class="mt-md">Dr. Mindaugas Šarpis · <span class="nt">LHCb</span>&nbsp;Vilnius<br>Vilniaus universitetas</div>

<PptxButton />

<!-- facts: pentaquark-idea-to-discovery-51-years, lhcb-pentaquark-2015, lhcb-vilnius-joined, pentaquark-idea-1964 -->

<!--
Message: who is speaking; the particle this story is about took 51 years to find; the question of the talk, and the promise: you will see how, dot by dot, and you judge; at the end, who does this work and where it starts.
Picture: the cover, as OpenData's and Innoday's: the name line over the five-quark form gathering out of the dust (`quarks`, 2,4 s). The overview clip buffers behind it. → starts the way in; that key is also the gesture browsers ask for before any sound.

Laba diena. Esu Mindaugas Šarpis, dalelių fizikas iš Vilniaus universiteto. Ekrane susidėlioja dalelė, kurios fizikai ieškojo penkiasdešimt vienerius metus. Kaip sužinoti, kad radai tai, ko dar niekas nematė?
[pauzė 2 s]
Šiandien pamatysi, kaip ją rado – taškas po taško. Ir spręsti bandysi tu. O pabaigoje sužinosi, kas tokį darbą dirba ir nuo ko jį galima pradėti.
Bet pradėkime nuo visos Visatos.

The question lands at about 0:20. „kvarkas“ and „pentakvarkas“ wait for slide 3. „spręsti bandysi tu“: the plain spoken order, and gender-neutral (never „pats“). The last line is said as the camera flies (4,5 s, hidden by the still).
If asked: the idea of five-quark particles is from 1964 (Gell-Mann and Zweig); LHCb announced the particle on 14 July 2015.

(~0.6 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }   # Innoday's takeover pose: it looks down the funnel's axis, so the picture's middle becomes the Big Bang on the next step
---

<WebTakeover />

<!-- facts: cosmic-web-simulation-filaments-voids -->

<!--
Message: the Universe at its largest scale, as a picture that breaks into grains. No words: the cover's last line has named it.
Picture: Innoday's cosmic web as a still (the owner, 18 Oct: "take the still cosmic web from the innoday"): the picture holds for half a second, then its dark lets go evenly and its bright filaments break into grains, each on its own pixel's line of sight (3 s). They make the funnel on the next step.

Maždaug taip atrodo Visata didžiausiu mastu – galaktikų gijos ir tuštumos tarp jų.
[leisk vaizdui subyrėti į grūdelius, maždaug 3,5 s] → spausk

The line is in the script since 21 Oct (the 15-minute round; the web is a cosmological simulation's visualisation, cosmic-web-simulation-filaments-voids); hold the slide for it.
The picture: the last frame of the owner's SpaceEngine edit for Innoday (public/figures/opener_last.jpg), the cosmic web of NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“, NSF), as Innoday credits it; no public page of that title was found on 20 Oct (NASA SVS 10663 is the closest NCSA AVL piece), so the still's own source is the owner's to name for the credit. If the NCSA or Planck licence is refused for the Delfi stream, cut slides 2 and 3: the cover flies straight to CERN and slide 3's quark ladder is said on slide 7 over the debris.

(~0.2 min)
-->

---
space: { at: [30, 39, -119], dist: 25, yaw: -72, pitch: 13, dim: 0, flight: 3.5 }   # Innoday's: the bell on its side, narrow end left, from three-quarters on the mouth side (the NASA/WMAP figure)
---

<AfterFlight :delay="6.8"><div class="age"><span class="n">13,8</span> mlrd. metų</div></AfterFlight>

<!-- facts: universe-age-planck-2018, human-body-atoms, atom-nucleus-protons-neutrons, proton-neutron-three-quarks, lhcb-pentaquark-2015, lhc-collisions-create-new-particles, lhc-worlds-largest-accelerator, cmb-oldest-light-planck-2018, cmb-formed-380000-years-esa -->

<!--
Message: the funnel is the Universe's 13,8-billion-year history; you and I are made of atoms; each proton and neutron is three quarks; the cover's particle has five, a pentaquark, and such particles are made in accelerator collisions.
Picture: Innoday's funnel (the owner, 18 Oct: "copy the funnel as well"): the web's grains fly into the funnel's shape (4,4 s), the middle of the picture first, as the camera swings round to the side; then the funnel's own grains and the CMB disk resolve over them, and last its mesh comes in underneath. The Universe's history in grains, the NASA/WMAP figure: the Big Bang at the narrow end (left), the Planck disk, the dark ages with no stars, a crowd of hot first galaxies, then ever fewer, cooler ones to the mouth, today. „13,8 mlrd. metų“ once the funnel stands (6,8 s). Wait for it before the first sentence.

[palauk, kol piltuvas susiformuos]
Šis piltuvas – Visatos istorija. Siaurasis galas – Didysis sprogimas prieš 13,8 milijardo metų, platusis – šiandiena. Šis diskas – seniausia šviesa, kurią galime matyti. Ir tu, ir aš sudaryti iš atomų. Atomo branduolys – protonai ir neutronai, o kiekvienas jų sudarytas iš trijų dar smulkesnių dalelių – kvarkų. Dalelė, kurią matei pradžioje, sudaryta iš penkių kvarkų. Ji vadinama pentakvarku. Tokios dalelės gimsta greitintuvo susidūrimuose.
Tam CERN pastatė didžiausią pasaulyje dalelių greitintuvą.

The ladder goes atoms → nucleus → protons and neutrons → quarks, home.cern's own order. The last line is said as the clip condenses.
If asked: strictly a pentaquark is four quarks and one antiquark; the three quarks of a proton are its valence quarks. The disk is the real cosmic microwave background, Planck's 2018 map (the one sentence spoken for it is in the script): „Ji išsiskyrė, kai Visatai buvo apie 380 000 metų.“

Šaltiniai: Planck 2018 results VI, A&A 641, A6 (13,787 ± 0,020 mlrd. metų); the CMB picture: Planck 2018 SMICA-noSZ map, ESA and the Planck Collaboration, CC BY-NC 3.0 IGO (reprojected, smoothed, recoloured: Innoday's notes).

(~0.6 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The way in, as OpenData's: CERN from above, the library clip cern_overview_short.mp4 (11 s, no sound): from the Earth down to Geneva, then the LHC ring drawn over the fields with its four experiments named. At the speaker's → after its end, the camera pushes on into the ring (its right side, 0.72, 0.45 of the last frame), where the tunnel follows. -->
<VideoPlayer src="cern_overview_short.mp4" exit="push" exit-at="0.72,0.45" />

<!-- facts: cern-largest-particle-physics-lab, lhc-geneva-27km-100m-four-experiments -->

<!--
Message: this is CERN near Geneva; 100 m under its fields runs the 27 km ring.
Picture: CERN from above (11 s), the LHC ring drawn over the fields, its four experiments named; at → after its end (it holds its last frame; no auto-advance) the camera pushes on into the ring, where the tunnel follows. 20 words take about 10 s, 12 s at a slow delivery: about the 11 s; the clip holds its last frame if he runs over.

Tai CERN prie Ženevos – didžiausia pasaulyje dalelių fizikos laboratorija. Po šiais laukais, šimto metrų gylyje, – dvidešimt septynių kilometrų greitintuvo žiedas.

The accelerator's acronym is not spoken; „greitintuvas“ carries it and „LHC 27 km“ on the next slide shows it. If asked: four large experiments, LHCb one of them.

Šaltiniai: home.cern, „The Large Hadron Collider“.

The line is said over the clip; its 11 s are counted from the clip.
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The opening (components/lhc-opening/): the real LHC tunnel, CERN-FOOTAGE-2022-013-001, an 18 s cut (videos/manifest.toml). At the speaker's → after its end, it pushes on into the beam pipe. -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" :volume="0.5" exit="push" exit-at="0.45,0.53" />

<LhcOpening part="tunnel" />

<!-- facts: cern-lhc-speed, cern-lhc-collisions, lhc-collisions-create-new-particles, lhc-ls3-restart-2028 -->

<!--
Message: when the accelerator runs, protons at almost the speed of light collide over a billion times a second, and the collision energy becomes new particles.
Picture: the real LHC tunnel, 100 m under the border, the magnets on the right; „LHC 27 km“ low on the left. Let it run, then → at its end: the camera goes on into the beam pipe (no auto-advance). Its sound is the tunnel's own ventilation hum. 26 words take about 14 s, 17 s at a slow delivery, inside the 18 s; the last sentence as the push into the pipe begins (into the magnet, slide 6, since 21 Oct).

Kai greitintuvas veikia, protonai jame skrieja beveik šviesos greičiu ir susiduria daugiau nei milijardą kartų per sekundę. Susidūrimo energija virsta naujomis dalelėmis.

Tense for 26–27 Oct: the LHC has been in Long Shutdown 3 since 29 June 2026: „Kai greitintuvas veikia“, never present-tense data taking. If asked: „Dabar jis sustabdytas atnaujinimui, vėl veiks nuo 2028 metų.“

Source: CERN-FOOTAGE-2022-013-001 (CERN). The line is said over the clip; its 18 s are counted from the manifest.
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- 21 Oct (the owner: "can show magnet video from CERN"; "A, ok"): the LHC dipole, CERN-VIDEO-2019-050-008, its first 10,8 s (videos/manifest.toml): a cutaway of the blue cryostat into the two copper-lined beam pipes; its small English/French labels („LHC Dipole“, „Beam pipes“) kept, the owner's "ok". Silent. It lands where the tunnel's push went in; → moves on (no auto-advance). -->
<VideoPlayer src="cern_video_2019_050_008.mp4" muted :controls="false" />

<!-- facts: lhc-two-beam-pipes-opposite, cern-lhc-magnets, cern-lhc-cold, gave-cryo-lhc, lhc-ls3-restart-2028 -->

<!--
Message: inside the ring two beams fly in opposite directions in two pipes; 1 232 superconducting magnets bend them round, and when the accelerator runs they are cooled to −271 °C, colder than outer space.
Picture: CERN's animation of an LHC dipole magnet: the blue cryostat cut open, then the camera turns to face its two beam pipes (10,8 s, silent). Under speech: 33 words take about 17 s, so say the first sentence over the clip and finish over its last frame, then →.

Žiede protonai skrieja dviem vamzdžiais, priešingomis kryptimis. Kad protonai suktųsi ratu, juos lenkia tūkstantis du šimtai trisdešimt du superlaidieji magnetai. Kai greitintuvas veikia, jie atšaldomi iki minus dviejų šimtų septyniasdešimt vieno laipsnio – šalčiau nei kosmose.
Štai kaip jie susiduria.

Tense for 26–27 Oct: the LHC is warm in Long Shutdown 3 (since 29 June 2026), so „kai greitintuvas veikia“; if asked: „Dabar jis atnaujinamas, vėl veiks nuo 2028 metų.“ „superlaidieji magnetai“: the 1 232 are the main dipoles, 15 m long; the LHC has 9 593 magnets in all. −271,3 °C is 1,9 K; outer space is 2,7 K.

Šaltiniai: home.cern, „The Large Hadron Collider“; CERN-VIDEO-2019-050-008 (CERN).

(~0.3 min)
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

<!-- facts: cms-195099-137440354-record-300, cms-195099-290-drawn-tracks, cms-195099-19-vertices, lhc-geneva-27km-100m-four-experiments, lhc-collisions-create-new-particles, particles-decay-detector-sees-products, lhcb-vilnius-joined -->

<!--
Message: one real collision: hundreds of particles fly out, among them new, heavy ones that live only an instant.
Picture: one real collision in the black, OpenData's and Innoday's. Two bunches of protons run in along the beam pipe and cross; 19 collisions flash along the beam, the world nearly stops at the crossing while the camera moves round it, then runs on as the debris flies out to every side: 290 tracks curling in the magnet, the calorimeters' cells lighting all round, two muons running out. „290 dalelių“ as it flies apart („8 TeV“ is hidden for this talk, styles/index.css: a unit grade 9–12 do not know). A low swell, a thump at the crossing, a low drone that fades over four seconds as it flies apart: quiet enough to talk over. Start speaking as the debris flies out (about 6 s in). → for the LHCb clip.

[palauk, kol dalelės išlėks]
Štai tikras dviejų protonų paketų susidūrimas. Šiame vaizde išlekia šimtai dalelių. Tarp jų būna ir naujų, sunkių dalelių, kurios gyvuoja labai trumpai: jos beveik iš karto suskyla, ir detektorius mato tik jų skeveldras.
Šį susidūrimą 2012 metais užfiksavo CMS – vienas iš keturių didžiųjų šio greitintuvo detektorių.
O dabar – LHCb, detektorius, prie kurio dirbu aš.

The decay sentence follows cms.cern's own wording (most particles produced are unstable and transform rapidly; the detector measures the stable ones), so „skeveldros“ on slide 9 is heard a second time; the mass is taught on slides 9 and 10. No acronym in speech. If asked: CMS, one of the four LHC detectors, recorded it on 27 May 2012; 19 proton pairs collided in this crossing; the picture draws the 290 clearest tracks (not a number CMS reports); 8 TeV is the collision energy.

The event: CMS Open Data record 300 (CC0), run 195099, event 137440354, a Higgs boson candidate. Provenance: components/lhc-opening/README.md.

(~0.55 min)
-->

---

<!-- The shared opening's LHCb reel: the detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release. It condenses out of the dust; the speaker's → moves on. -->
<VideoPlayer src="lhcb.mp4" />

<!-- facts: lhcb-detector-size, lhcb-three-storey-worked, lhcb-collaboration-sep-2026, lhcb-vilnius-joined, particle-decay-reconstructed-mass, particles-decay-detector-sees-products -->

<!--
Message: this is LHCb, three storeys high; almost two thousand people work on it, our Vilnius group among them, and I am one of them. (How a collision becomes a dot moved to the next slide, inside the detector, 21 Oct.)
Picture: the LHCb detector in 3D, with music. Start about 3 s in; about 30 words take 16 s, 20 s at a slow delivery; then let the music run to the clip's end (39 s) and → (no auto-advance).

Tai LHCb. Jis dešimties metrų aukščio – kaip trijų aukštų namas. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš viso pasaulio, tarp jų ir mūsų grupė iš Vilniaus universiteto. Aš – vienas iš jų.
[leisk muzikai skambėti iki klipo pabaigos] → spausk

„beveik du tūkstančiai“: 1 891 members in September 2026; never „daugiau nei“. „kaip trijų aukštų namas“ is our arithmetic (10 m at about 3 m a storey). The particle that split is named before its fragments, so „skeveldros“ has a referent when heard. „Same mass every time“ is said on slide 10 while the dots fall. If asked: 5 600 tonnes, 21 m long; VU joined LHCb in September 2024.

The line is said over the clip; its 39 s are counted from the manifest.
-->

---
space:
  at: cavern
  dim: 0
  ambient: 0
  hum: false
  cameraRate: 1
  path:   # cranes down from above the detector to the cavern floor at eye level (Innoday's „Ačiū“ pose, 1,83 m person beside LHCb's foot), lingers side on, then dollies back
    - [0, { at: [1013.5, -480, 0.5], dist: 40, yaw: -35, pitch: 50 }]
    - [2.5, { at: [1013.5, -480, 0.5], dist: 38, yaw: -30, pitch: 47 }]
    - [5, { at: [1013.5, -479.9, 0.5], dist: 30, yaw: -18, pitch: 22 }]
    - [7.5, { at: [1013.5, -479.81, 0.55], dist: 23, yaw: -7, pitch: -6 }]
    - [9, { at: [1013.5, -479.81, 0.55], dist: 21.6, yaw: -5, pitch: -13 }]
    - [15, { at: [1013.5, -479.81, 0.55], dist: 21.6, yaw: -3, pitch: -13 }]
    - [22, { at: [1013.5, -479.81, 0.55], dist: 21.6, yaw: 0, pitch: -13 }]
    - [36, { at: [1013.6, -479.9, 0.43], dist: 30, yaw: 0, pitch: -10 }]
---

<InsideLhcb />

<div class="readout depth"><div class="big"><Count :from="0" :to="100" :delay="2500" :ms="5000" /><span class="unit">m</span></div></div>
<div class="readout glow"><div class="big">40<span class="unit">mln. per sekundę</span></div></div>

<!-- facts: lhcb-100m-below-ground, lhcb-detector-size, lhcb-hlt1-30mhz, lhcb-upgrade1-trigger, lhcb-allen-gpu, lhcb-realtime-analysis, particles-decay-detector-sees-products, particle-decay-reconstructed-mass -->

<!--
Message: LHCb stands 100 m under the ground; beside it a person of my height. In one real LHCb collision the particles fly out through the detector's parts, and each part records where they passed. The bunches cross here 40 million times a second; computers with graphics cards choose, as it happens, which collisions to keep. From the fragments we compute the mass of the particle that split: one computed mass, one dot.
Picture: LHCb's real geometry as a 3D model, glowing edges in the detector's blue (Innoday's „Ačiū“ model, the owner's choice there, 20 Oct), with its cavern floor and cradles. The camera cranes down from above while the model comes in (5 s) and „100 m“ counts up low on the left; it lands at eye level on the cavern floor, a 1,83 m person beside the detector's foot (9 s). Then LHCb's own real 2012 collision starts in it (the shared opening's LHCb event, CERN open data): the bunches cross, the world nearly stops, the debris runs out through the stations and each part lights as the particles reach it. About 7 s later the crossings follow faster and faster until they merge into a steady glow, „40 mln. per sekundę“ low on the left as the camera dollies back (24 s). Speak the first two sentences over the crane, the collision ones as the debris flies, the last two over the dolly back.

Nusileiskime pas jį – šimtą metrų po žeme. Šalia detektoriaus stovi žmogus – mano ūgio.
[palauk, kol susidurs dalelių paketai]
Štai tikras LHCb susidūrimas. Išlėkusios dalelės skrieja pro detektoriaus dalis, ir kiekviena dalis užfiksuoja, kur jos praskriejo.
Kai greitintuvas veikia, dalelių paketai čia susikerta keturiasdešimt milijonų kartų per sekundę. Kompiuteriai su vaizdo plokštėmis iš karto atrenka, kuriuos susidūrimus verta išsaugoti.
Iš skeveldrų apskaičiuojame, kokios masės buvo suskilusi dalelė. Viena apskaičiuota masė – vienas taškas.

„100 m“: LHCb sits 100 metres below ground near Ferney-Voltaire (home.cern); the title's „100 metrų po žeme“ is this. The person is 1,83 m, the speaker's height (Innoday's notes: "It can be me, 183cm in height"). „40 mln.“: bunches cross at 40 MHz; in Run 3 about 30 million crossings a second hold collisions, and LHCb reads out the whole detector for each. „Kompiuteriai su vaizdo plokštėmis“: HLT1 (Allen) on GPUs, the first trigger of its kind; never „žaidimų“ (the cards are NVIDIA RTX A5000 workstation cards) and no card count (the ~500 is a 2019–20 feasibility figure). The collision is LHCb's, from 2012 (Run 1): the 40 MHz and the GPUs are Run 3's, so never say this collision was chosen by those cards. If asked: about 4 TB/s read out in real time, about 10 GB/s kept, roughly one part in 400; the event: CERN Open Data, run 133488, event 2028034058, 1 December 2012 (components/lhc-opening/README.md). No magnet line: the bending-and-momentum wording was not reachable on 21 Oct (lhcb-outreach.web.cern.ch); add it once filed.

Šaltiniai: home.cern, „LHCb“; LHCb Upgrade I, JINST 19 (2024) P05065; CERN EP Newsletter (2020), Allen; CERN Open Data (LHCb 2012).

(~1.0 min)
-->

---
space: { at: trial, dim: 0.05 }
clicks: 2
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 1, oc: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { th1: 2 }, 2: { th1: 0, th2: 2 } }" />

<!-- facts: particle-decay-reconstructed-mass, theta-toy-140-entries, chance-bumps-shrink-with-data, poisson-fluctuation-sqrt-n, theta-plus-2003-false-alarm, theta-plus-leps-japan-19-events, theta-plus-clas-2006-null -->

<!--
Message: we work on questions nobody has answered, so you try: each dot falls into a column by its mass; a real particle keeps landing in one column and a bump rises; chance can make a bump too. Is this one a new particle? No: a computer made it from random numbers. With 25 times more of the same random dots the bump is gone (seen, not only told: 21 Oct). In 2003 real physicists were fooled the same way, and more data wiped the bump out.
Picture: a small gold plot fills dot by dot into its columns (140 dots, 7 s); at the first click a tick lights over the one column that stands out (`th1` step 2). At the second the gold dots go and 3 500 pale dots of the same random spectrum fill the same frame (`th2`, 12 s), smooth: the tick comes back over the same column once it is full, and nothing stands there. The first two sentences are said over the flight (4,5 s), the column sentences over the fill.
Note: both plots are illustrations, not measured data: two random samples from one smooth spectrum with no particle in it; in the 140 chance made the bump, the 3 500 are smooth (public/data/theta-toy.json, seeds inside). Say „sudėliojo kompiuteris“, never „tikri duomenys“. Each plot fills its frame to its own tallest column, so the two are not at one scale (that is slide 13).

Mes dirbame su klausimais, į kuriuos dar niekas neatsakė. Tokį darbą dabar išbandysi ir tu. Kiekvienas taškas krenta į stulpelį pagal masę. Kairėje – lengvesnės dalelės, dešinėje – sunkesnės. Lyg surikiuotum visus savo mokyklos mokinius pagal ūgį. Jei dalelė tikra, jos masė kaskart išeina beveik ta pati, ir taškai krenta į tą patį stulpelį. Taip iškyla kauburys. Bet kauburį gali sukurti ir atsitiktinumas – kaip kauliukas, kuris kelis kartus iš eilės išmeta šešetą.
→ spausk
Kaip manai, ar šis kauburys – nauja dalelė?
[pauzė 3 s]
Ne. Šį grafiką kompiuteris sudėliojo iš atsitiktinių skaičių – jokios dalelės jame nėra. Iš šimto keturiasdešimties taškų tikros dalelės nuo atsitiktinumo neatskirsi.
→ spausk
Štai tas pats atsitiktinumas, tik taškų dvidešimt penkis kartus daugiau.
[leisk prisipildyti]
Kauburio nebeliko.
Panašų kauburį 2003 metais pamatė ir tikri fizikai. Eksperimentas Japonijoje pranešė apie kitą dalelę iš penkių kvarkų. Jo kauburį sudarė vos keliolika taškų. Kiti eksperimentai surinko daug daugiau duomenų ir tos dalelės nerado.
Štai kaip atrodo, kai taškų – dešimtys tūkstančių.

The 2003 claim was Θ⁺, a different five-quark particle: „kitą dalelę iš penkių kvarkų“, never „ši dalelė“. „vos keliolika taškų“: LEPS's own peak was about 19 events above a background of about 17 (36 in the peak region). If asked: LEPS at SPring-8 reported „evidence“ at 4,6σ (Phys. Rev. Lett. 91, 012002 (2003)); CLAS and others with far more data found nothing; by 2008 the PDG review wrote the particle does not exist; the idea of five-quark particles dates from 1964.

Šaltiniai: LEPS, Phys. Rev. Lett. 91, 012002 (2003), arXiv:hep-ex/0301020; CLAS, Phys. Rev. Lett. 96, 042001 (2006); PDG 2008, „Pentaquarks“ (C. G. Wohl).

(~1.65 min)
-->

---
space: { at: [1650, 2.6, 0], dist: 23, yaw: 0, pitch: 3, sway: 0.4, dim: 0.05 }   # the omegac station's look ([0, 3, 0], dist 21) drawn back and lowered (22 Oct): the axis at y 345, so the count under it ends inside the broadcast safe box (y 408)
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 1, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { oc: 2 } }" />

<AfterFlight :delay="6"><div class="heap late" style="left: 490px; top: 356px"><span class="n">59&nbsp;453&nbsp;masės</span></div></AfterFlight>

<!-- facts: lhcb-omegac-2017-fig2-candidates, lhcb-omegac-five-2017, lhcb-omegac-2017-masses, omegac-quark-content, proton-neutron-three-quarks, lhcb-omegac-confirmed, chance-bumps-shrink-with-data, poisson-fluctuation-sqrt-n -->

<!--
Message: real LHCb data with almost 60 000 computed masses: with this many, real particles rise as tall, narrow peaks; five here, five new particles, each of three quarks like a proton. Three quarks is usual.
Picture: LHCb's real m(Ξc⁺K⁻) spectrum fills grain by grain in light blue, fast at first (about 20 s), until five narrow peaks stand clear of the rest (the owner, 18 Oct: "slide 7-8 just show such histogram with omega c resonances, nicely resolved"); „59 453 masės“ under it from 6 s, as the number is said. → spausk: white ticks light over the five peaks while the rest steps back (`oc` step 2). Light blue, so gold means the pentaquark family (the cover's form, the toy, the pentaquark plot).
Data: LHCb, Phys. Rev. Lett. 118, 182001 (2017), Fig. 2 (3,3 fb⁻¹ at 7, 8 and 13 TeV): its 1 MeV bin contents read from the vector figure (no HEPData record) and summed to 2 MeV, where they equal the paper's own Fig. 3 bin for bin; 2 960–3 300 MeV, 59 453 candidates (public/data/omegac.json), drawn one grain per two candidates (`unit: 2`, so „masės“, not „taškai“). All candidates as the figure shows them, no background subtracted.

Tai tikri LHCb duomenys – beveik šešiasdešimt tūkstančių apskaičiuotų masių.
[leisk prisipildyti]
Su tikromis dalelėmis – atvirkščiai: kai taškų daugėja, jos iškyla aukštomis, siauromis smailėmis.
→ spausk
Čia jų penkios – penkios naujos dalelės. LHCb jas paskelbė iš karto, visas penkias. Keturias iš jų vėliau patvirtino ir kiti matavimai. Kiekviena sudaryta iš trijų kvarkų, kaip ir protonas. Trys kvarkai – įprasta.
O dalelė iš penkių kvarkų – ta, kurią matei pradžioje?

„atsitiktiniai kauburiai išsilygina“: a chance fluctuation of N counts is about √N while a real peak grows with N; Lyons (CERN Courier, 2023): many 3σ and 4σ effects went away with more data, and the Higgs peaks grew. 2017 is not spoken. If asked: the Ωc⁰ states, seen decaying to a Ξc⁺ and a K⁻; LHCb announced all five at once in March 2017; one charm and two strange quarks (flavour names stay out of speech); masses 3000, 3050, 3066, 3090 and 3119 MeV; four of the five were later confirmed by Belle and by LHCb in Ωb⁻ decays; the broad rise near 3 190 MeV is not a sixth narrow particle.

Šaltiniai: LHCb, Phys. Rev. Lett. 118, 182001 (2017), arXiv:1703.04639, Fig. 2 (bin contents read from the vector figure).

(~0.75 min)
-->

---
space: { at: lhcb, dim: 0.05 }
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 0, jp: 1, jx: 0, lietuva: 0 }" :clicks="{ 1: { jp: 2 } }" />

<!-- facts: lhcb-pentaquark-2015, lhcb-pentaquark-2015-cross-checks, pentaquark-idea-to-discovery-51-years, lhcb-pentaquark-2019, lhcb-pentaquark-2019-data-2011-2018, lhcb-pentaquark-2019-27292-entries -->

<!--
Message: LHCb's pentaquark plot, all its data up to 2019; the peak first rose in 2015. You judge again, and this time it is real: it survived the checks and was a pentaquark, 51 years on. Later, with nine times more data, there were three peaks.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate in gold, fast at first, until the narrow peaks stand out (about 20 s). The first two sentences over the flight and the fill; the question once the peaks stand. → spausk at „Vėliau…“: white ticks light over the three peaks while the rest of the plot steps back (`jp` step 2; at once if the fill is done, else when it ends).
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV): Run 1 and Run 2 together, so 2019 is named once, as the data's span; the 2015 peak is never placed „čia“.

Štai LHCb pentakvarkų grafikas – jame visi duomenys iki 2019 metų. Pirmą kartą smailė iškilo 2015 metais, kai LHCb tyrė, kaip skyla viena sunki dalelė.
[leisk prisipildyti]
Kaip manai, ar ši smailė tikra?
[pauzė 2 s]
Fizikai tikrino, ar smailė neatsiranda dėl kitų, jau žinomų dalelių, ir ar ji išlieka skirtingų metų duomenyse. Smailė liko. Tai pentakvarkas – po penkiasdešimt vienerių metų paieškų.
→ spausk
Vėliau, turint devynis kartus daugiau duomenų, smailių buvo jau trys.
Padėkime šalia grafiką, kurį vertinai tu.

The checks are worded to the stored claim only (fits with other known particles alone; stability across the 2011 and 2012 data); never „viską“, „detektorius“ or „atranka“; never „netikėtai“. If asked: Λb → J/ψ p K⁻; in 2019, with Run 1 and Run 2 data, the 2015 peak split in two and a third appeared, Pc(4312)⁺ at 7,3σ.

Šaltiniai: LHCb, Phys. Rev. Lett. 115, 072001 (2015); CERN, 2015-07-14 (the checks); LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData ins1728691.

(~0.8 min)
-->

---
space: { at: [1796.4, 3.0, 0], dist: 26, yaw: 0, pitch: 3, sway: 0.3, dim: 0.05 }   # drawn back (dist 21 until 22 Oct): both plots and their counts inside the broadcast safe box (x 98–882, y 55–408); the labels are projected from this pose
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 0, jp: 2, jx: 1, lietuva: 0 }" />

<div class="heap" style="left: 571px; top: 354px"><span class="n">27&nbsp;292&nbsp;taškai</span></div>
<div class="heap" style="left: 210px; top: 354px"><span class="n">140&nbsp;taškų</span></div>

<!-- facts: theta-toy-140-entries, lhcb-pentaquark-2019-27292-entries, particle-physics-5-sigma-discovery, dice-eight-sixes-worked, lhcb-pentaquark-2015-cross-checks, lhcb-pentaquark-2019, sarpis-phd-bonn-2023, sarpis-glasgow-study-and-job -->

<!--
Message: at one scale, your 140 dots are a thin strip beside LHCb's more than 27 000. Physicists call a discovery only a peak that chance alone would make less than once in 3,5 million times, rarer than eight sixes in a row. LHCb's peaks passed that bar; that is how physicists know they have found something nobody has seen.
Picture: the camera draws back to two plots at the same scale, one grain per entry and the same height per entry. Left, the 140-dot plot of slide 10 as a thin strip (an illustration, not LEPS's data); right, LHCb's 27 292 candidates with their three marked peaks. Under them, their counts. The last line is said as the camera flies to Europe (4,5 s).

Abu grafikai tuo pačiu masteliu. Kairėje – tavo šimtas keturiasdešimt taškų. Dešinėje – daugiau nei dvidešimt septyni tūkstančiai. Atradimu fizikai vadina tik tokią smailę, kurią vien atsitiktinumas sukurtų rečiau nei kartą iš trijų su puse milijono. Tai rečiau, nei kauliukas aštuonis kartus iš eilės išmestų šešetą. LHCb smailės šią ribą peržengė. Taip fizikai ir sužino, kad rado tai, ko dar niekas nematė.
[pauzė 4 s]
Pentakvarkų ieškojau ir aš.

The one spoken answer to the cover's question, in its words, said once. „Sigma“ is not said; if asked: five sigma; the 2015 states at 9σ and 12σ, Pc(4312)⁺ at 7,3σ; eight sixes in a row is (1/6)⁸, about 1 in 1,7 million; a 5σ fluke about 1 in 3,5 million.

Šaltiniai: LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData ins1728691; Physics World, 2007-05-01, „The tale of the blogs’ boson“ (5σ – atradimas).

(~0.7 min)
-->

---
space: { at: [1201, 0, 2.5], dist: 36, yaw: 0, pitch: 60, sway: 0, dim: 0.05 }   # the `whole` pose (europe + [1, 0, −3]) moved 5.5 south (22 Oct), so the map stands higher and CERN's name ends inside the broadcast safe box; the five names are projected from this pose
clicks: 4
---

<Grains :set="{ pq: 3, route: 1, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0 }" :clicks="{ 1: { route: 3 }, 2: { route: 4 }, 3: { route: 6 }, 4: { route: 7 } }" />

<div class="city late caption" style="left: 719px; top: 84px">Vilnius</div>
<div class="city late caption" style="left: 367px; top: 356px">CERN</div>
<div v-click="1" class="city step caption" style="left: 295px; top: 90px; --step-delay: 3.4s">Glazgas</div>
<div v-click="3" class="city step caption" style="left: 473px; top: 276px; --step-delay: 2.2s">Heidelbergas</div>
<div v-click="3" class="city r step caption" style="left: 399px; top: 173px; --step-delay: 3.6s">Bona</div>

<!-- facts: sarpis-glasgow-study-and-job, sarpis-phd-heidelberg-to-bonn, sarpis-phd-bonn-2023, lhcb-run1-release-sarpis-lrt-2025, lhcb-vilnius-joined -->

<!--
Message: my road went through Europe: Glasgow; the doctorate begun in Heidelberg and finished in Bonn, where I searched for pentaquarks and prepared LHCb's data for everyone; then back to Lithuania, and now the LHCb group at Vilnius University. The personal touches are yours to tell, in three optional slots.
Picture: the trail draws across Europe leg by leg as the stops are told (the owner, 15 Oct: "Show my path around europe"): Vilnius → CERN on arrival (the talk's own frame: home and the place of the work, not a dated trip), then Glasgow (click 1), home (2), Heidelberg and Bonn (3), home to Vilnius (4). Each city's name comes up as the trail reaches it. A click whose slot you skip just draws its leg (about 3 s).

Mano kelias iki šio darbo ėjo per Europą.
[PATIKSLINTI, neprivaloma: savais žodžiais – kuo norėjai būti vaikystėje ir kaip 11 klasėje pirmą kartą apsilankei CERN]
→ spausk
Studijavau Glazgo universitete.
→ spausk
[PATIKSLINTI, neprivaloma: savais žodžiais – darbai tarp studijų ir doktorantūros, Glazge ir Lietuvoje]
→ spausk
Doktorantūrą pradėjau Heidelberge, o baigiau Bonoje. Ten ieškojau pentakvarkų ir ruošiau LHCb duomenis, kad jais galėtų naudotis visi.
[PATIKSLINTI, neprivaloma: savais žodžiais – kodėl doktorantūra iš Heidelbergo persikėlė į Boną]
→ spausk
Tada grįžau į Lietuvą. Dabar Vilniaus universitete vadovauju LHCb grupei.
Ir visa tai dabar galima daryti iš Lietuvos.

Only the bank's lines are scripted: Glasgow 2011–2015 (study), the doctorate in Heidelberg 2019–2020 then Bonn 2020–2023, the pentaquark search and the open-data preparation in Bonn, the return and LHCb Vilnius. The three slots are yours: fill them in your own words (10–15 s each, outside the scripted time) or skip them; nothing is written in their place, and nothing on this slide claims anything the bank does not confirm. Skipped, slot 1 leaves the first sentence alone over the first leg, slot 2 lets click 2 just draw the leg home, slot 3 lets click 4 follow at once. The last line is said as the camera dives to Vilnius (4 s).
If asked: Glasgow 2011–2015; Heidelberg 2019–2020; Bonn 2020–2023 (the thesis, December 2023: a pentaquark search and the LHCb open-data release); the Run 1 release is over 100 000 files, about a petabyte by VU's count.

Šaltiniai: INSPIRE-HEP author record; M. Šarpis, PhD thesis, University of Bonn, 2023; LRT.lt, 2025-01-08 (from a VU press release).

(~0.6 min)
-->

---
space: { at: [1210.6, 0.25, -6.5], dist: 15, yaw: 0, pitch: 62, sway: 0.3, dim: 0.3 }   # dim 0.2 until 20 Oct: the route head's bloom washed out the east of the outline in the still
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 1 }" />

<div class="city caption" style="left: 718px; top: 230px">Vilnius</div>

<!-- facts: cern-lithuania, lhcb-vilnius-students, lhcb-vilnius-work, lhcb-vilnius-racz, lhcb-open-data-coordinator-2026, lhcb-run1-release-sarpis-lrt-2025 -->

<!--
Message: all of it can now be done from Lithuania (the owner, 15 Oct: "then stress all of this can now be done in Lithuania"): a CERN associate member; a group of mostly students, on the detector, on software, or searching for particles; the first VU doctoral student on LHCb also searches for pentaquarks; 13 VU students at CERN this summer, a record. The coordinator line moved to slide 16 (21 Oct), after the group's own part of the detector.
Picture: the camera dives from the whole of Europe down to Vilnius, and Lithuania's outline comes up in light blue round it (`lietuva`, Natural Earth); the route's arcs leave Vilnius westward out of frame. Only Vilnius is named. The last line is said as the clip condenses.

Lietuva – asocijuotoji CERN narė, todėl lietuviai gali pretenduoti į darbą CERN. Didžioji mūsų grupės dalis – studentai. Vieni dirba su detektoriumi, kiti – su programomis, treti ieško naujų dalelių. Pirmoji VU doktorantė LHCb eksperimente irgi ieško pentakvarkų. O šią vasarą praktiką CERN atliko trylika VU studentų – daugiausia iki šiol.
Mūsų grupė dirba ir prie paties detektoriaus.

The doctoral student stays unnamed. „pretenduoti“, not „kandidatuoti“. If asked: Lithuania has been an associate member since 2018; VU joined LHCb in September 2024.

Šaltiniai: home.cern, 2018-01-08 (asocijuotoji narė); VU FF, 2024-09-02 (VU priimtas į LHCb); VU, 2026-08-20 (grupė ir 13 vasaros studentų); VU, R. Racz (pirmoji VU doktorantė LHCb); VU, 2026-07-30 (koordinatorius).

(~0.55 min)
-->

---

<!-- 21 Oct, the 15-minute round: the group's own part of LHCb. The library clip lis_flag.mp4 (Innoday's, 10 s, silent, played once): a SciFi module's end with its light injection system, a Blender render after the SciFi drawing (not a photograph); the Lithuanian flag lasered on the cold box is Innoday's own touch (the owner, 19–20 Oct). It holds its last frame; → moves on. -->
<VideoPlayer src="lis_flag.mp4" muted :controls="false" />

<!-- facts: lhcb-scifi, lhcb-scifi-lis, lhcb-scifi-lis-vcsel, lhcb-vilnius-scifi-lis, lhcb-open-data-coordinator-2026, lhcb-run1-release-sarpis-lrt-2025 -->

<!--
Message: one part of LHCb our group works on: the tracker of plastic fibres that light up when a particle passes, and the light injection system at the ends of its modules that sends short laser pulses into them to calibrate them. A computer-made picture, said so. Then my own job since August, the bridge to the data.
Picture: the end of one SciFi module, its light injection boards with their laser diodes and fibres, the cold box below with the Lithuanian flag lasered on it (10 s, silent); its last frame holds while you finish. Say „kompiuteriu sukurtas vaizdas“ once: it is a render, not a photograph, and the flag is ours.

Tai vieno LHCb sekiklio modulio galas – kompiuteriu sukurtas vaizdas pagal jo brėžinį, o vėliavą ant jo nupiešėme patys. Sekiklyje – daugiau nei vienuolika tūkstančių kilometrų plonų plastikinių skaidulų. Kai pro jas praskrieja dalelė, jose sužimba šviesa. Kad šviesos jutikliai būtų tiksliai sukalibruoti, modulių galuose lazeriai siunčia į skaidulas trumpus šviesos impulsus. Mūsų grupė dirba ir prie šio sekiklio, ir prie šios sistemos.
Nuo rugpjūčio esu ir LHCb atvirųjų duomenų koordinatorius. Prisimeni duomenis, kuriuos ruošiau Bonoje?

„daugiau nei vienuolika tūkstančių kilometrų“: the SciFi tracker's 11 000+ km of 250 µm fibre (LHCb). Nothing more about Vilnius than the group's meeting agenda says (SciFi and the light injection system among its service tasks): never „mes sukūrėme“. The flag is not on the real module. If asked: 670 nm VCSEL lasers driven by GBLD chips; 524 288 SiPM channels read the light.

Šaltiniai: LHCb Upgrade I, JINST 19 (2024) P05065, 6.5.7 sk.; indico.cern.ch/event/1461467 (VU LHCb grupės susitikimas, 2024-10-03); VU, 2026-07-30 (koordinatorius).

(~0.4 min)
-->

---
space: { at: [2599.3, 0.6, 5.0], dist: 10, yaw: -10, pitch: 8, dim: 0.15 }   # (x 2597.0 until 22 Oct: „1 TB“ ran to x 930, past the broadcast safe box) from the front, so the 1 TB sphere and its label stand in frame right of the 800 pile, nearly as far from the lens (OpenData's yaw-73 pose, its slide 7, left the sphere below the frame); the camera stays inside the vault's clear capsules
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1], 'scale:labels': 1, sun: 0, vilnius: 0 }" />

<div class="readout late">

<div class="big"><Count name="open" :from="0" :to="800" :delay="2400" /><span class="unit">TB</span></div>

</div>

<!-- facts: laptop-stack-over-1km-worked, lhcb-run1-full-release-2023, lhcb-run1-volume-sources-differ, sarpis-interview-run1-1-5-years, lhcb-pentaquark-2015-run1-data, lhcb-open-data -->

<!--
Message: the data I prepared in Bonn, in one picture: each sphere a terabyte, about a laptop's disk; LHCb's 2011 and 2012 data are 800 of them; every file found, checked and described, about a year and a half; the pentaquark peak first rose in exactly these data, and now they are open to everyone.
Picture: OpenData's piles (the owner, 18 Oct: "Show something about open data"): the camera flies in to a single gold sphere and a pile of 800 like it, standing on a floor of grains in a space of data; „1 TB“ under the sphere, the count „800 TB“ low on the left (once: the pile's own label is gone).

Štai jie. Kiekviena sfera – vienas terabaitas, maždaug nešiojamojo kompiuterio diskas. Čia LHCb 2011 ir 2012 metų duomenys – aštuoni šimtai terabaitų. Kiekvieną failą reikėjo surasti, patikrinti ir aprašyti. Net su tam parašytomis programomis tai užtruko apie pusantrų metų. Būtent šiuose duomenyse 2015 metais iškilo pentakvarko smailė. Dabar jie atviri visiems.

Terabytes only, never „petabaitas“. 800 TB is CERN's figure (VU: over 1 PB in all, of which 800 TB of physics data in over 100 000 files); the release holds the same 2011–2012 collisions the 2015 peak rose in (2019 used Run 1 and Run 2). The year-and-a-half line is the speaker's public interview (VU Library, 5 March 2026). If asked: the full Run 1 release was completed on 20 December 2023; a terabyte holds tens of millions of recorded collisions.

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20); VU biblioteka, interviu, 2026-03-05; LHCb, Phys. Rev. Lett. 115, 072001 (2015) (3 fb⁻¹, 2011–2012).

(~0.6 min)
-->

---
space: { at: [2591.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }   # OpenData's 4 PB pose (its slide 8)
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1, 2], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout last">

<div class="big"><Count name="open" :from="800" :to="4000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="caption">Atvirieji LHCb duomenys</p>

</div>

<!-- facts: lhcb-ntupling-service-4pb, lhcb-open-data -->

<!--
Message: this year part of the later data opened too; with the earlier data that is over 4 000 TB.
Picture: the camera pulls back; five copies of the 800 pile merge into one gold pile of 4 000 spheres; the count runs from 800 to 4 000 TB (at 5,2 s). Say the line as the piles merge. The caption names what the count counts.

Šiais metais atverta ir dalis vėlesnių duomenų. Kartu su ankstesniais – daugiau nei keturi tūkstančiai terabaitų.
O dabar pažiūrėk, kiek jų yra iš viso.

Never „4 PB“ in speech. If asked: the Ntupling Service (February 2026) opens Run 1 and part of Run 2 without LHCb's software.

Šaltiniai: LHCb outreach, 2026-03-03 („over 4 PB of data to explore“); CERN Open Data portalas, 2026-02-22.

(~0.3 min)
-->

---
space: { at: [2570.5, 6.5, -7], dist: 65, yaw: 21.8, pitch: 7.1, sway: 4, dim: 0.15 }   # OpenData's 100 PB pose (its slide 9) moved 13 west (x 2583.5 until 22 Oct): with the readout on the 150 px floor, the blue sphere stood on „000 TB“; now it stands right of it (x ≈ 630–735)
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 1, scale: [0, 1, 2, 3], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout blue late">

<div class="big"><span class="gt">></span><Count name="lhcb" :from="0" :to="100000" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Visi LHCb duomenys</p>

</div>

<!-- facts: lhcb-data-100pb, lhcb-data-total-2026, laptop-stack-over-1km-worked, lhcb-ntupling-service-4pb, lhcb-open-data-policy -->

<!--
Message: all the data LHCb has collected: more than 100 000 terabytes, a stack of laptops more than a kilometre high; the gold pile in front is open.
Picture: the camera pulls far back; a blue pile of 100 000 spheres rises behind the gold one; „> 100 000 TB“ counts up low on the left (a lower bound: LHCb's 100 PB is its March 2025 figure), the caption names it. The first sentence as the blue pile rises.

O tai visi LHCb surinkti duomenys – daugiau nei šimtas tūkstančių terabaitų. Sukrovus šimtą tūkstančių nešiojamųjų kompiuterių vieną ant kito, bokštas būtų aukštesnis nei kilometras. Auksinė krūva priekyje jau atvira.
O saugomi jie štai kur.

Scale, worked out: a 1 TB laptop of today is about 1,1 cm thick, so 100 000 of them stack to about 1,1 km: „daugiau nei kilometro“, never „dviejų kilometrų“. If asked: LHCb opens about half of a period's data five years after it ends and all of it after ten.

Šaltiniai: B. Couturier, ISGC 2025 („more than 100 PB of data“); LHCb, arXiv:2504.00610 (atvirųjų duomenų politika).

(~0.45 min)
-->

---

<!-- 21 Oct, the 15-minute round: where the data live. This talk's cut of CERN-FOOTAGE-2022-013-006 (videos/manifest.toml): its last shot, 1:48–2:02, 14 s, silent: the tape library's aisle, the robot's carriage running away down it between walls of tapes. → moves on (no auto-advance). -->
<VideoPlayer src="cern_footage_2022_013_006.mp4" muted :controls="false" />

<!-- facts: cern-exabyte, cern-physics-data-tape-1p3eb, lhcb-data-100pb -->

<!--
Message: the data are kept in CERN's data centre, mostly on magnetic tape: about sixty thousand tapes, more than a million terabytes from all the LHC experiments; a robot takes them from the shelves. Then the bridge to Dominykas.
Picture: real footage inside CERN's tape library: an aisle between walls of tapes, the robot's carriage running away down it (14 s, silent); → as you finish.

Visų LHC eksperimentų duomenys saugomi CERN duomenų centre – daugiausia magnetinėse juostose. Juostų ten apie šešiasdešimt tūkstančių, o duomenų – daugiau nei milijonas terabaitų. Juostas iš lentynų paima robotas.
O štai ką su atviraisiais duomenimis padarė vienas mūsų studentas.

„daugiau nei milijonas terabaitų“: CERN passed one exabyte of stored LHC data in December 2025, mostly on about 60 000 tapes (home.cern); never „vien LHCb“ (LHCb's is the 100 000 TB of slide 19). „Juostas … paima robotas“ says what the footage shows (the carriage on its rail). If asked: CERN says this is about a tenth of what it will need over the next ten years.

Šaltiniai: home.cern, 2025-12 („one exabyte“); CERN Annual Progress Report 2025, p. 17; CERN-FOOTAGE-2022-013-006 (CERN).

(~0.3 min)
-->

---
space: { at: [2600, -0.3, 0], dist: 36, yaw: 0, pitch: 3, dim: 0.05 }   # OpenData's sun pose (its slide 11)
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, scale: [1, 2], 'scale:labels': 0, sun: 1, vilnius: 0 }" />

<!-- facts: opendata-sun-plots-from-records, stonkus-bsc-2026, stonkus-bsc-2026-yield, lhcb-pentaquark-2015, lhcb-open-data, lhcb-opendata-brown-2026 -->

<!--
Message: these plots were drawn from the open data; this year a VU bachelor student collected thousands of dots from them and checked whether the bump would rise where LHCb found the pentaquarks; it did, and he calls his work a check.
Picture: OpenData's sun of plots: a sun turns slowly round the gold pile, rays of grains leaving it to every side, nineteen of them ending at plots made from LHCb's open data (the grains land on each plot's curves), seven at empty places, gold clouds waiting. No text: „everyone can use this“ is said, not shown (the owner, 18 Oct, through the Scheduler).

Šie grafikai nubraižyti iš atvirųjų LHCb duomenų. Šiais metais mūsų bakalauro studentas Dominykas Stonkus paėmė atviruosius 2012 metų LHCb duomenis ir surinko iš jų tūkstančius taškų. Jis tikrino, ar kauburys iškils toje pačioje vietoje, kur LHCb rado pentakvarkus. Iškilo. Pats savo darbą jis vadina patikrinimu. O rugsėjį du Browno universiteto fizikai paskelbė išankstinį straipsnį, parengtą su atviraisiais LHCb duomenimis.
Pradėti galima dar mokykloje.

Do not say „atrado“, „pirmasis“, „savo kompiuteryje“ (38,3 TB filtered on CERN computing) or „pakartojo paiešką“ as if independent: the thesis calls itself a qualitative check. „tūkstančius taškų“ rests on the about 16 400 selected decays. No web address in speech. The plots, if asked: the masses of π⁰, D⁰, J/ψ, K⁰S and Λ, the D⁰ and K⁰S lifetimes, the magnet's field, the beam spot, spectra and multiplicities, all from CERN Open Data records 401 and 24506. The Brown line (21 Oct, in the script): a preprint, posted, not yet published, so never „paskelbė tyrimą“.

Šaltiniai: D. Stonkus, bakalauro darbas, VU, 2026, epublications.vu.lt/object/elaba:308118793/308118793.pdf; CERN Open Data, įrašai 401 ir 24506; arXiv:2609.09275.

(~0.6 min)
-->

---
space: { at: [2598.7, 1.5, 0], dist: 37.5, yaw: 0, pitch: 3, dim: 0.05 }   # OpenData's Vilnius pose (its slide 12: at [2600.17, −1.03, 0], dist 30.45) drawn back (22 Oct), with the names at labelH 0.1 and the turn at 300 s, so both names stay inside the broadcast safe box for the slide's first 48 s
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, scale: [1, 2], 'scale:labels': 0, sun: 0, vilnius: 1 }" />

<!-- facts: lhcb-masterclass-vilnius-2026, lhcb-masterclass-vilnius-2027, vu-masterclass-annual, stonkus-bsc-2026, vu-bsc-2026-cms-open-data-spukas, lhcb-opendata-masterclass-2014 -->

<!--
Message: you can start at school: pupils have measured a particle's lifetime in real LHCb data at VU's masterclass; later a bachelor's thesis from open data, as Dominykas did; the empty places are work nobody has done yet, and they wait for you. You need not know now what you will be.
Picture: OpenData's second sun, round the same gold pile: rays end at two white clusters named „Meistriškumo pamoka“ and „Bakalauro darbai“ and at gold clouds breathing slowly, room for what comes next. The last line is said as the camera flies back to the particle (4,5 s).
The masterclass is told without dates (the owner, 15 Oct: "No dates for masterclass") and in the past tense: no 2026–27 LHCb date was public on 20 Oct (two editions held, 2025 and 2026); VU's yearly masterclasses are the CMS ones, so never „kasmet“ of the LHCb one. Do not say it uses CERN Open Data files: no source shows it; it uses real LHCb data.

Vilniaus universitete jau vyko LHCb meistriškumo pamokos. Mokiniai ten su tikrais LHCb duomenimis patys išmatavo, kiek laiko gyvuoja viena dalelė. Beje, pirmieji vieši LHCb failai buvo paskelbti būtent tokioms pamokoms. Universitete iš atvirųjų duomenų gali parašyti bakalauro darbą, kaip Dominykas. O šios tuščios vietos – darbai, kurių dar niekas nepadarė. Nebūtina jau dabar žinoti, kuo būsi. Užtenka pastebėti, kas tau įdomu, ir pasidomėti giliau.
Ir grįžkime prie dalelės, nuo kurios pradėjome.

The organisers' point is said once, here, as advice; it claims nothing about you. Optional, after it, one sentence of your own about a moment you noticed something and followed it (nothing is written for it). If asked: the particle is the D⁰ meson; another VU bachelor's thesis of 2026 used CMS open data. „Beje, pirmieji vieši LHCb failai…“ (21 Oct, in the script): never as if the Vilnius masterclass uses them.

Šaltiniai: VU FF, LHCb meistriškumo pamokos (indico.cern.ch/event/1648092); D. Stonkus, bakalauro darbas, VU, 2026; CERN Open Data, įrašas 401 (2014).

(~0.7 min)
-->

---
space: { at: [595.5, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }   # the cover's view and dim, the form a little nearer the middle (right half), „Ačiū“ beside it in the left half
---

<Grains :set="{ pq: 3, route: 7, th2: 0, th1: 0, oc: 0, jp: 2, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0 }" />

<div class="thanks beside">Ačiū</div>

<!-- facts: lhcb-pentaquark-2015-cross-checks, lhcb-pentaquark-2015-run1-data, lhcb-run1-full-release-2023 -->

<!--
Message: the particle was found because physicists gathered a great many dots and checked carefully, and the data it first showed up in are now open to you. Thanks.
Picture: back to the cover's five-quark particle, gathering again out of the dust (`pq` replays its gather on arrival: more than 5 s since its last step change); „Ačiū“ beside it. Whether the talk closes on „Ačiū“, and over what, is the owner's to say (the Scheduler asked, 18 Oct); built as the default.

Ji rasta, nes fizikai surinko labai daug taškų ir kruopščiai tikrino. Duomenys, kuriuose ji pirmą kartą pasirodė, dabar atviri ir tau.
[pauzė 3 s]
Ačiū.

The question is answered through the dots, without a third „51 metai“ and without repeating it.

(~0.45 min)
-->
