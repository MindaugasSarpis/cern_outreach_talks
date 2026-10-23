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
  look: broadcast   # 23 Oct review: for the stream (no film grain, fewer and larger grains, the ground lifted off black so it does not band); dropped on 8 Oct when the talk was "not TV", back now it is filmed
  options: { reach: 22, nebula: 0.12, aberration: 0, vignette: 0.45, bloom: 0.42 }   # OpenData's depth over the broadcast look (until 23 Oct: dustSize 2.2, grain 0.012, vignette 0.7)
title: Kas vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po žeme
duration: 15min
broadcast: true            # a studio recording (owner, 21 Oct): talk ready runs the safe-area check, talk record the broadcast rules
sources: notes
info: |
  „Kas vyksta didžiausioje Pasaulyje mokslo laboratorijoje 100 metrų po žeme“:
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement), a Lithuanian
  talk for grades 9–12, recorded in the Delfi studio on 26 Oct 2026 (1080p50,
  on a screen behind the speaker and the laptop's feed) and streamed on 27 Oct.
  15 minutes, 19 slides (notes/blueprint.md v2 of 20 Oct, the owner's rounds of
  21–23 Oct). One dot: a particle of five quarks took 51 years to find, so how
  do you know you have found something nobody has seen? The cover; the zoom
  from Saulėtekis to the cosmic web; Innoday's funnel; the LHC opening (CERN
  from above, the real tunnel, the dipole, a real 2012 CMS collision, the 3D
  LHCb clip); inside LHCb 100 m down, its own real collision and the 40 MHz
  glow, one mass one dot. The viewer judges a bump of 140 dots in four days,
  sees it drown in a hundred days of the same random dots, as physicists were
  fooled in 2003; LHCb's Ωc⁰ spectrum as its years tick, five narrow peaks,
  three quarks and their gluons, the rule, and the pentaquark found the same
  way in 2015 (the zoom's music under both). Then the speaker's road round
  Europe, the group in Vilnius, OpenData's piles of open data, the group's
  SciFi module and its flag, and Innoday's close out to the LHC, „mano
  greitintuvas“, and the FCC, „jūsų greitintuvas“ (Starfire under both); „Ačiū“.
layout: cover
space: { at: [593.2, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0 }" />

<div class="mt-md">Dr. Mindaugas Šarpis<br><span class="nt">LHCb</span>&nbsp;Vilnius<br>Vilniaus universitetas</div>

<PptxButton />

<!-- facts: pentaquark-idea-to-discovery-51-years, lhcb-pentaquark-2015, lhcb-vilnius-joined, pentaquark-idea-1964 -->

<!--
Message: who is speaking; the particle this story is about took 51 years to find; the question of the talk, and the promise: you will see how, dot by dot, and you judge; at the end, who does this work and where it starts.
Picture: the cover, as OpenData's and Innoday's: the name line over the five-quark form gathering out of the dust (`quarks`, 2,4 s). The overview clip buffers behind it. → starts the way in; that key is also the gesture browsers ask for before any sound.

Laba diena. Esu Mindaugas Šarpis, dalelių fizikas iš Vilniaus universiteto. Ekrane susidėlioja dalelė, kurią rasti užtruko penkiasdešimt vienerius metus. Kaip sužinoti, kad radai tai, ko dar niekas nematė, ir neapsigavai?
[pauzė 2 s]
Šiandien nusileisime šimtą metrų po žeme ir pamatysi, kaip ją rado – taškas po taško. Ir spręsti bandysi tu. O pabaigoje pasakysiu, nuo ko tokį darbą galima pradėti.
Pradėkime nuo Vilniaus.

The question lands at about 0:20. „kvarkas“ and „pentakvarkas“ wait for slide 4. „spręsti bandysi tu“: the plain spoken order, and gender-neutral (never „pats“). The last line is said as the zoom fades in.
If asked: the idea of five-quark particles is from 1964 (Gell-Mann and Zweig); LHCb announced the particle on 14 July 2015.

(~0.6 min)
-->

---
space: { path: [[0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]], sway: 0, dim: 0 }   # a cut to the takeover's pose under the clip, as Innoday's opener: the next slide stands exactly here
---

<!-- The zoom out (the owner, 23 Oct: "a quick zoomout from vilnius straight to universe web - in 20s"): Innoday's opener, the owner's SpaceEngine edit, time-remapped to 20 s. It ends on the frame slide 3's still is (public/figures/opener_last.jpg) and holds it; the fade out shows the same picture underneath. -->
<VideoPlayer src="vilnius_zoom.mp4" transition="fade" />

<!-- facts: nftmc-opened-2016 -->

<!--
Message: where we are, then out past everything to the largest scale.
Picture: the owner's SpaceEngine zoom for Innoday, 4:13 made 17 s (scripts/remap_zoom.py): the NFTMC building in Saulėtekis (Google Earth, 0–2,3 s), the Saulėtekis campus (to ~3,9 s), Vilnius and its region (~3,9–5,4 s), into the clouds (~5 s), then, joined by dissolves, the Earth from space (~5,5–7,9 s), our galaxy whole (~7,9–11 s), and the cosmic web (from ~11 s) slowing to a stop, held from 16 s. Stabilised (the owner: the source's wobble "on speedup it doesn't look good"); the swaying stretches between them are dissolved over, not played, and since the 23 Oct review the Sun and the flight inside the galaxy are left out (the most synthetic-looking pictures, near-black on a stream). No sound of its own. It waits on the web for the press (no advance-on-end).

Čia – Saulėtekis Vilniuje. Čia dirba Vilniaus universiteto fizikai.
[kai matosi Žemė iš kosmoso, ~6 s] Žemė. [~8,5 s] Mūsų galaktika.
[tinklui pasirodžius tylėk; kai jis sustoja] → spausk

The words follow the picture: say each name as it comes, not before; the first sentence is over by the time Vilnius is in sight (~4,5 s). „Čia dirba Vilniaus universiteto fizikai“: NFTMC houses units of the VU Faculty of Physics (nftmc-opened-2016). Lithuania as a country is not shown, so it is not named.
The footage: the owner's SpaceEngine edit spaceengine/nftmc_zoom.mp4 (Google Earth for the Earth part: its logo is on every Earth frame and the imagery providers are named in the footage, as Innoday's notes say; at this speed the providers' line is up for well under a second); the web, NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“), as on the next slide.

The clip runs 17 s.

(~0.3 min)
-->

---
space: { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0, sway: 0, dim: 0 }   # Innoday's takeover pose: it looks down the funnel's axis, so the picture's middle becomes the Big Bang on the next step
---

<WebTakeover />

<!-- facts: cosmic-web-simulation-filaments-voids -->

<!--
Message: the Universe at its largest scale, as a picture that breaks into grains.
Picture: Innoday's cosmic web as a still (the owner, 18 Oct: "take the still cosmic web from the innoday"), the zoom's own last frame, so the cut from the clip does not show: the picture holds for half a second, then its dark lets go evenly and its bright filaments break into grains, each on its own pixel's line of sight (3 s). They make the funnel on the next step.

Maždaug taip atrodo Visata didžiausiu mastu – galaktikų gijos ir tuštumos tarp jų.
[leisk vaizdui subyrėti į grūdelius, maždaug 3,5 s] → spausk

The line is in the script since 21 Oct (the 15-minute round; the web is a cosmological simulation's visualisation, cosmic-web-simulation-filaments-voids); hold the slide for it.
The picture: the last frame of the owner's SpaceEngine edit for Innoday (public/figures/opener_last.jpg), the cosmic web of NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“, NSF), as Innoday credits it; no public page of that title was found on 20 Oct (NASA SVS 10663 is the closest NCSA AVL piece), so the still's own source is the owner's to name for the credit. If the NCSA or Planck licence is refused for the Delfi stream, cut slides 2, 3 and 4: the cover flies straight to CERN and slide 4's quark ladder is said on slide 8 over the debris.

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
Šis piltuvas – Visatos istorija. Siaurasis galas – Didysis sprogimas prieš 13,8 milijardo metų, platusis – šiandiena. Šis diskas – seniausia šviesa, kurią galime matyti. O dabar – į mažiausią mastą. Ir Žemė, ir tu, ir aš sudaryti iš atomų. Atomo branduolys – protonai ir neutronai, o kiekvienas jų sudarytas iš trijų dar smulkesnių dalelių – kvarkų. Dalelė, kurią matei pradžioje, sudaryta iš penkių kvarkų. Ji vadinama pentakvarku. Tokios dalelės gimsta greitintuvo susidūrimuose.
Tam CERN pastatė greitintuvą.

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
Picture: the real LHC tunnel, 100 m under the border, the magnets on the right; „LHC 27 km“ low on the left. Let it run, then → at its end: the camera goes on into the beam pipe (no auto-advance). Its sound is the tunnel's own ventilation hum. 26 words take about 14 s, 17 s at a slow delivery, inside the 18 s; the last sentence as the push into the pipe begins (into the magnet, slide 7, since 21 Oct).

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
O dabar – LHCb.

The decay sentence follows cms.cern's own wording (most particles produced are unstable and transform rapidly; the detector measures the stable ones), so „skeveldros“ on slide 10 is heard a second time; the mass is taught on slides 10 and 11. No acronym in speech. If asked: CMS, one of the four LHC detectors, recorded it on 27 May 2012; 19 proton pairs collided in this crossing; the picture draws the 290 clearest tracks (not a number CMS reports); 8 TeV is the collision energy.

The event: CMS Open Data record 300 (CC0), run 195099, event 137440354, a Higgs boson candidate. Provenance: components/lhc-opening/README.md.

(~0.55 min)
-->

---

<!-- The shared opening's LHCb reel: the detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release. It condenses out of the dust; the speaker's → moves on. -->
<VideoPlayer src="lhcb.mp4" />

<!-- facts: lhcb-detector-size, lhcb-three-storey-worked, lhcb-collaboration-sep-2026, lhcb-vilnius-joined, particle-decay-reconstructed-mass, particles-decay-detector-sees-products -->

<!--
Message: this is LHCb, three storeys high; almost two thousand people work on it, our Vilnius group among them, and I am one of them. (How a collision becomes a dot moved to the next slide, inside the detector, 21 Oct.)
Picture: the LHCb detector in 3D, with music. Start about 3 s in; about 30 words take 16 s, 20 s at a slow delivery; then → about 3 s after „Aš – vienas iš jų.“ (22 Oct, for time: the next slide cranes down to the same detector; the reel need not end).

Tai LHCb. Jis dešimties metrų aukščio – kaip trijų aukštų namas. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš viso pasaulio, tarp jų ir mūsų grupė iš Vilniaus universiteto. Aš – vienas iš jų.
[palauk 3 s] → spausk

„beveik du tūkstančiai“: 1 891 members in September 2026; never „daugiau nei“. „kaip trijų aukštų namas“ is our arithmetic (10 m at about 3 m a storey). „Same mass every time“ is said on slide 11 while the dots fall. If asked: 5 600 tonnes, 21 m long; VU joined LHCb in September 2024.

The line is said over the clip. The lint counts the clip's whole 39 s from the manifest; pressed 3 s after the line (22 Oct), the slide takes about 25 s.
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
space: { at: [1500, 2.4, 0], dist: 19.8, yaw: 0, pitch: 3, sway: 0.4, dim: 0.05 }   # the trial station's look ([0, 4, 0], dist 18) drawn back and lowered, the plots 7 high (8 until 22 Oct): the axis at y 347, so the count and the axis word under it end inside the broadcast safe box (y 408); the labels are projected from this pose
clicks: 2
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 1, oc: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { th1: 2 }, 2: { th1: 0, th2: 1 } }" />
<Soundtrack src="audio/zoom_music.m4a" tail="audio/zoom_music.m4a" :level="0.25" start keys />

<AfterFlight :delay="6"><div class="heap r axis late" style="left: 757px; top: 358px"><span class="n">masė&nbsp;→</span></div></AfterFlight>
<AfterFlight :delay="4.6"><div v-click.hide="2" class="heap l late" style="left: 223px; top: 358px"><span class="n"><FillClock name="th1" :to="4" unit="diena,dienos,dienų" :fill="7" /></span></div></AfterFlight>
<div v-click="2" class="heap l step" style="left: 223px; top: 358px; --step-delay: 0.6s"><span class="n"><FillClock name="th2" :to="100" unit="diena,dienos,dienų" :at="2" :delay="0.6" :fill="12" /></span></div>

<!-- facts: particle-decay-reconstructed-mass, theta-toy-140-entries, chance-bumps-shrink-with-data, poisson-fluctuation-sqrt-n, theta-plus-2003-false-alarm, theta-plus-leps-japan-19-events, theta-plus-clas-2006-null -->

<!--
Message: we work on questions nobody has answered, so you try: each dot falls into a column by its mass; a real particle keeps landing in one column and a bump rises; chance can make a bump too. Is this one a new particle? No: a computer made it from random numbers. With 25 times more of the same random dots the bump is gone (seen, not only told: 21 Oct). In 2003 real physicists were fooled the same way, and more data wiped the bump out.
Picture: a small gold plot fills dot by dot into its columns (140 dots, 7 s) while the days of collecting tick under the axis's left end, „0 dienų“ to „4 dienos“, in step with the dots landing (the owner, 23 Oct: "just show one with not a lot of data (show days / years of collection increasing)"); „masė →“ under the axis, ending at its right end, from 6 s, as the columns are explained (what they sort by: light left, heavy right): the clock bottom left, the axis word bottom right. At the first click a tick lights over the one column that stands out (`th1` step 2); no new word (it is not called random before the answer). At the second the gold dots go and their clock with them, and 3 500 pale dots of the same random spectrum fill the same frame (`th2`, 12 s), smooth, with no tick (`th2` step 1; 22 Oct: the tick and the dimmed rest made the filled column read as a peak on camera), the clock in the same place running „0 dienų“ to „100 dienų“: 25 times the dots in 25 times the days, so where the bump was, the column is as tall as its neighbours. The first two sentences are said over the flight (4,5 s), the column sentences over the fill.
Note: both plots are illustrations, not measured data: two random samples from one smooth spectrum with no particle in it; in the 140 chance made the bump, the 3 500 are smooth (public/data/theta-toy.json, seeds inside). The days are the same illustration (35 dots a day, both plots), so they are said with „tarkime“. Say „sudėliojo kompiuteris“, never „tikri duomenys“. Each plot fills its frame to its own tallest column, so the two are not at one scale. The clock is <FillClock> (setup/FillClock.vue): it reads how much of the plot has landed, so it cannot run ahead of the dots.

Mano darbe nėra vadovėlio su atsakymais gale. Tokį darbą dabar išbandysi ir tu. Tarkime, duomenis renkame keturias dienas. Kiekvienas taškas krenta į stulpelį pagal masę. Kairėje – lengvesnės dalelės, dešinėje – sunkesnės. Lyg surikiuotum visus savo mokyklos mokinius pagal ūgį. Jei dalelė tikra, jos masė kaskart išeina beveik ta pati, ir taškai krenta į tą patį stulpelį. Taip iškyla kauburys.
→ spausk
Kaip manai, ar šis kauburys – nauja dalelė?
[pauzė 3 s]
Ne. Šį grafiką kompiuteris sudėliojo iš atsitiktinių skaičių – jokios dalelės jame nėra. Kauburį gali sukurti ir atsitiktinumas – kaip kauliukas, kuris kelis kartus iš eilės išmeta šešetą.
→ spausk
Štai tas pats atsitiktinumas, tik duomenis renkame šimtą dienų – dvidešimt penkis kartus ilgiau.
[leisk prisipildyti]
Kauburio nebeliko – ten, kur jis buvo, stulpelis dabar toks pat kaip kiti.
Panašų kauburį 2003 metais pamatė ir tikri fizikai. Eksperimentas Japonijoje pranešė apie kitą dalelę iš penkių kvarkų. Jo kauburį sudarė vos keliolika taškų. Kiti eksperimentai surinko daug daugiau duomenų ir tos dalelės nerado.
O dabar – tikri LHCb duomenys.

The 2003 claim was Θ⁺, a different five-quark particle: „kitą dalelę iš penkių kvarkų“, never „ši dalelė“. „vos keliolika taškų“: LEPS's own peak was about 19 events above a background of about 17 (36 in the peak region). If asked: LEPS at SPring-8 reported „evidence“ at 4,6σ (Phys. Rev. Lett. 91, 012002 (2003)); CLAS and others with far more data found nothing; by 2008 the PDG review wrote the particle does not exist; the idea of five-quark particles dates from 1964.

Šaltiniai: LEPS, Phys. Rev. Lett. 91, 012002 (2003), arXiv:hep-ex/0301020; CLAS, Phys. Rev. Lett. 96, 042001 (2006); PDG 2008, „Pentaquarks“ (C. G. Wohl).

(~1.6 min)
-->

---
space: { at: [1654, 2.9, 0], dist: 25, yaw: 0, pitch: 3, sway: 0.4, dim: 0.05 }   # the omegac station's look ([0, 3, 0], dist 21) drawn back and lowered (22 Oct): the axis at y 345, so the count under it ends inside the broadcast safe box (y 408); 23 Oct: 4 east and 2 back, so the Ωc⁰'s three quarks stand right of the plot inside the box (the labels re-projected)
clicks: 1
---

<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 1, omega: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { oc: 2, omega: 1 } }" />
<Soundtrack src="audio/zoom_music.m4a" tail="audio/zoom_music.m4a" :level="0.25" keys />

<AfterFlight :delay="2.5"><div class="heap l late" style="left: 403px; top: 80px"><span class="n">LHCb duomenys</span></div><div class="heap r axis late" style="left: 679px; top: 357px"><span class="n">masė&nbsp;→</span></div></AfterFlight>
<AfterFlight :delay="4.6"><div class="heap l late" style="left: 114px; top: 357px"><span class="n"><FillClock name="oc" :years="[[0, 2011], [0.3, 2012], [0.91, 2015], [1, '2011–2015']]" :fill="20" /></span></div></AfterFlight>
<div v-click="1" class="heap l step" style="left: 403px; top: 138px; --step-delay: 0.8s"><span class="n">5&nbsp;naujos dalelės</span></div>
<div v-click="1" class="heap step" style="left: 793px; top: 146px; --step-delay: 2.6s"><span class="n">c</span></div><div v-click="1" class="heap step" style="left: 742px; top: 232px; --step-delay: 2.6s"><span class="n">s</span></div><div v-click="1" class="heap step" style="left: 840px; top: 232px; --step-delay: 2.6s"><span class="n">s</span></div>

<!-- facts: lhcb-omegac-2017-fig2-candidates, lhcb-pentaquark-2015-cross-checks, lhcb-omegac-2017-sample, lhcb-omegac-2017-years, lhcb-omegac-five-2017, lhcb-omegac-2017-masses, omegac-quark-content, proton-neutron-three-quarks, proton-mass-quarks-1-percent, lhcb-omegac-confirmed, chance-bumps-shrink-with-data, poisson-fluctuation-sqrt-n, particle-physics-5-sigma-discovery, lhcb-pentaquark-2015, pentaquark-idea-to-discovery-51-years -->

<!--
Message: real LHCb data, almost 60 000 computed masses collected over five years: with this many, real particles rise as tall, narrow peaks; five here, five new particles, each of three quarks like a proton. Physicists call a discovery only a peak chance alone would make less than once in 3,5 million; these five pass it by far, and that is how they know. The cover's five-quark particle LHCb found the same way, in 2015, after 51 years; I searched for pentaquarks too. (Since 23 Oct this slide carries the rule and the pentaquark: the owner cut the pentaquark plot and the two plots at one scale, "a bit too much histograms".)
Picture: LHCb's real m(Ξc⁺K⁻) spectrum fills grain by grain in light blue at a steady rate (20 s; `curve` 1 since 23 Oct, so the years tick as the data came), until five narrow peaks stand clear of the rest (the owner, 18 Oct: "slide 7-8 just show such histogram with omega c resonances, nicely resolved"); „LHCb duomenys“ top right of the plot from 2,5 s (as the first sentence says so: real data, against slide 11's computer-made dots), with „masė →“ under the axis's right end; under its left end the year the landing dots were recorded in, „2011 m.“, „2012 m.“, „2015 m.“, and once all are in the span, „2011–2015 m.“ (a lone „2015 m.“ beside „5 naujos dalelės“ read as their year, and 2015 is the pentaquark's; the owner, 23 Oct: "show the 5 omega resonances also with time ticking of when this was collected"): the year changes at the share of the sample's luminosity taken by then (1,0, 2,0 and 0,3 fb⁻¹: 30 % and 91 %); 2013 and 2014 are skipped, no data were taken. „59 453“ is said, no longer shown. → spausk: white ticks light over the five peaks while the rest steps back (`oc` step 2), and „5 naujos dalelės“ comes up just right of the last tick, under the name (0,8 s). With them, right of the plot, one Ωc⁰ in the colour-charge picture (the owner, 23 Oct: "after histogram is filled indicate schematically Omega particle (quarks, some gluons..)"; `triplet` `omega`, setup/triplet.js): three balls of grains, soft red, green and blue, gather in a triangle from 0,9 s, and gluons, short curls of grains in the two balls' colours, draw in between them, breathing gently; „c“, „s“, „s“ on the balls from 2,6 s (the letters only: the flavour names stay out of speech). Light blue, so gold means the pentaquark family (the cover's form, the toy).
Data: LHCb, Phys. Rev. Lett. 118, 182001 (2017), Fig. 2 (3,3 fb⁻¹ at 7, 8 and 13 TeV): its 1 MeV bin contents read from the vector figure (no HEPData record) and summed to 2 MeV, where they equal the paper's own Fig. 3 bin for bin; 2 960–3 300 MeV, 59 453 candidates (public/data/omegac.json), drawn one grain per two candidates (`unit: 2`, so „masės“, not „taškai“). All candidates as the figure shows them, no background subtracted.

Tai tikri LHCb duomenys – beveik šešiasdešimt tūkstančių apskaičiuotų masių, surinktų per penkerius metus.
[leisk prisipildyti]
Su tikromis dalelėmis – atvirkščiai: kai taškų daugėja, jos iškyla aukštomis, siauromis smailėmis.
→ spausk
Čia jų penkios – penkios naujos dalelės. Kiekviena sudaryta iš trijų kvarkų, kaip ir protonas. Kvarkus kartu laiko gliuonai.
Atradimu fizikai vadina tik tokią smailę, kurią vien atsitiktinumas sukurtų rečiau nei kartą iš trijų su puse milijono. Šios penkios tą ribą peržengė su didele atsarga.
Trys kvarkai – įprasta. O 2015 metais lygiai taip pat LHCb rado dalelę iš penkių kvarkų, kurią matei pradžioje. Pirmiausia fizikai bandė jos smailę paaiškinti jau žinomomis dalelėmis. Nepavyko. Tada atskirai patikrino 2011 ir 2012 metų duomenis – smailė liko abiejuose. Štai kaip po penkiasdešimt vienerių metų fizikai įsitikino, kad rado tai, ko dar niekas nematė.
[pauzė 2 s]
Pentakvarkų ieškojau ir aš.

If asked why chance bumps flatten out: a chance fluctuation of N counts is about √N while a real peak grows with N; Lyons (CERN Courier, 2023): many 3σ and 4σ effects went away with more data, and the Higgs peaks grew. 2017 is not spoken. „per penkerius metus“: the sample is 2011–2015 (7, 8 and 13 TeV), with nothing in 2013–2014. „Sigma“ is not said; the five are at 10σ to 24σ, the bar is 5σ. If asked: a 5σ fluke is about 1 in 3,5 million, rarer than eight sixes in a row ((1/6)⁸, about 1 in 1,7 million); the pentaquark of 2015 was at 9σ and 12σ; the Ωc⁰ states, seen decaying to a Ξc⁺ and a K⁻; LHCb announced all five at once in March 2017; one charm and two strange quarks (flavour names stay out of speech); masses 3000, 3050, 3066, 3090 and 3119 MeV; four of the five were later confirmed by Belle and by LHCb in Ωb⁻ decays; the broad rise near 3 190 MeV is not a sixth narrow particle.

Šaltiniai: LHCb, Phys. Rev. Lett. 118, 182001 (2017), arXiv:1703.04639, Fig. 2 (bin contents read from the vector figure); LHCb, Phys. Rev. Lett. 131, 131902 (2023), arXiv:2302.04733 (2011–2015); LHCb, Phys. Rev. Lett. 115, 072001 (2015); Physics World, 2007-05-01, „The tale of the blogs’ boson“ (5σ – atradimas).

(~1.2 min)
-->

---
space: { at: [1199.83, 0, 1.06], dist: 29.07, yaw: 0, pitch: 60, sway: 0, dim: 0.05 }   # 23 Oct (the criss-cross): closer than the `whole` pose's [1201, 0, 2.5] at dist 36, so the seven stops spread out and every name fits inside the broadcast safe box off the trail; the seven names are projected from this pose
clicks: 5
---

<Grains :set="{ pq: 3, route: 1, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { route: 3 }, 2: { route: 5 }, 3: { route: 7 }, 4: { route: 9 }, 5: { route: 12 } }" />

<div class="city late caption" style="left: 742px; top: 153px">Vilnius</div>
<div class="city late caption" style="left: 421px; top: 344px">CERN</div>
<div v-click="1" class="city step caption" style="left: 138px; top: 56px; --step-delay: 1.2s">Glazgas</div>
<div v-click="2" class="city step caption" style="left: 102px; top: 116px; --step-delay: 1.2s">Airija</div>
<div v-click="3" class="city step caption" style="left: 500px; top: 285px; --step-delay: 1.2s">Heidelbergas</div>
<div v-click="4" class="city step caption" style="left: 337px; top: 180px; --step-delay: 1.2s">Bona</div>
<div v-click="5" class="city step caption" style="left: 282px; top: 113px; --step-delay: 1.7s">Mančesteris</div>

<!-- facts: sarpis-glasgow-study-and-job, sarpis-phd-heidelberg-to-bonn, sarpis-phd-bonn-2023, lhcb-run1-release-sarpis-lrt-2025, lhcb-vilnius-joined -->

<!--
Message: my road went through Europe, back and forth: Glasgow; the doctorate begun in Heidelberg and finished in Bonn, where I searched for pentaquarks and prepared LHCb's data for everyone; then back to Lithuania, and now the LHCb group at Vilnius University. CERN is the place I kept coming back to. The personal touches are yours to tell, in four slots (the first is the one to keep).
Picture: the trail criss-crosses Europe leg by leg, in the owner's order (23 Oct: "Vilnius, CERN, Glasgow, CERN, Ireland, Vilnius, Heidelberg, CERN, Bonn, CERN, Vilnius and Manchester CERN - like a criss cross. a bit more snappy on clicks"): Vilnius → CERN on arrival, then → Glasgow → CERN (click 1), → Ireland → Vilnius (2), → Heidelberg → CERN (3), → Bonn → CERN (4), → Vilnius → Manchester → CERN (5). Each leg bows to its own side (`bends` on the route), so a return over the same pair is a second line, not the first one drawn over. A click draws its legs in about 2 s (2,6 s for the last, three legs), and each name comes up as the trail reaches it. Ireland is named as the country („Airija“): the owner named no city. A click whose slot you skip just draws its legs.

Mano kelias iki šio darbo ėjo per Europą.
[PATIKSLINTI, neprivaloma, bet geriausia pasakyti: savais žodžiais – kaip 11 klasėje, žiūrovų amžiaus, pirmą kartą apsilankei CERN; ir kuo tada norėjai būti]
→ spausk
Studijavau Glazgo universitete.
→ spausk
Tarp studijų ir doktorantūros praėjo ketveri metai.
[PATIKSLINTI, neprivaloma: savais žodžiais – ką veikei Airijoje ir ką tuos metus dirbai Glazge ir Lietuvoje]
→ spausk
Doktorantūrą pradėjau Heidelberge.
→ spausk
Baigiau ją Bonoje. Ten ieškojau pentakvarkų ir ruošiau LHCb duomenis, kad jais galėtų naudotis visi.
[PATIKSLINTI, neprivaloma: vienu sakiniu savais žodžiais – ką ta paieška parodė (ji atsako į „Pentakvarkų ieškojau ir aš“)]
→ spausk
Tada grįžau į Lietuvą. Dabar Vilniaus universitete vadovauju LHCb grupei.
[PATIKSLINTI, neprivaloma: savais žodžiais – ką veikei Mančesteryje]
Ir visa tai dabar galima daryti iš Lietuvos.

Only the bank's lines are scripted: Glasgow 2011–2015 (study), the doctorate in Heidelberg 2019–2020 then Bonn 2020–2023, the pentaquark search and the open-data preparation in Bonn, the return and LHCb Vilnius; „ketveri metai“ is 2015 to 2019. Ireland, Manchester and the trips back to CERN are not in the bank: nothing is said about them unless you say it, and the returns to CERN are drawn without words. The slots are yours, in your own words (10–15 s each): the first (the CERN visit in 11th grade, at the viewers' age) is the one to tell, since the last slide (19) leans on „Mano kelias … nebuvo tiesus“; the second, what you did in Ireland and in the four years; the third, one sentence on what your pentaquark search showed, which answers „Pentakvarkų ieškojau ir aš“ (12); the fourth, what took you to Manchester. Nothing is written in their place: the bank does not hold them. The reason the doctorate moved to Bonn is no longer asked (23 Oct, for time). The last line is said as the camera dives to Vilnius (4 s).
If asked: Glasgow 2011–2015; Heidelberg 2019–2020; Bonn 2020–2023 (the thesis, December 2023: a pentaquark search and the LHCb open-data release); the Run 1 release is over 100 000 files, about a petabyte by VU's count.

Šaltiniai: INSPIRE-HEP author record; M. Šarpis, PhD thesis, University of Bonn, 2023; LRT.lt, 2025-01-08 (from a VU press release).

(~0.6 min)
-->

---
space: { at: [1210.6, 0.25, -6.5], dist: 15, yaw: 0, pitch: 62, sway: 0.3, dim: 0.5 }   # dim 0.4 until 23 Oct (the outline brighter, size 5); dim 0.2 until 20 Oct: the route head's bloom washed out the east of the outline in the still
---

<Grains :set="{ pq: 3, route: 12, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 1 }" />

<div class="city caption" style="left: 718px; top: 230px">Vilnius</div>

<!-- facts: cern-lithuania, lhcb-vilnius-students, lhcb-vilnius-work, lhcb-vilnius-racz, lhcb-open-data-coordinator-2026, lhcb-run1-release-sarpis-lrt-2025 -->

<!--
Message: all of it can now be done from Lithuania (the owner, 15 Oct: "then stress all of this can now be done in Lithuania"): a CERN associate member; a group of mostly students, on the detector, on software, or searching for particles; the first VU doctoral student on LHCb also searches for pentaquarks; 13 VU students at CERN this summer, a record. Then my own job since August, the bridge to the data (here since 23 Oct).
Picture: the camera dives from the whole of Europe down to Vilnius, and Lithuania's outline comes up in light blue round it (`lietuva`, Natural Earth); the route's arcs leave Vilnius westward out of frame. Only Vilnius is named. The question is asked as the camera flies to the piles of data.

Lietuva – asocijuotoji CERN narė, todėl lietuviai gali pretenduoti į darbą CERN. Didžioji mūsų grupės dalis – studentai. Jie dirba ir su detektoriumi, ir su programomis, ir ieško naujų dalelių. Pirmoji VU doktorantė LHCb eksperimente irgi ieško pentakvarkų. O šią vasarą praktiką CERN atliko trylika VU studentų – daugiausia iki šiol.
Nuo rugpjūčio esu ir LHCb atvirųjų duomenų koordinatorius. Prisimeni duomenis, kuriuos ruošiau Bonoje?

The doctoral student stays unnamed. „pretenduoti“, not „kandidatuoti“. If asked: Lithuania has been an associate member since 2018; VU joined LHCb in September 2024.

Šaltiniai: home.cern, 2018-01-08 (asocijuotoji narė); VU FF, 2024-09-02 (VU priimtas į LHCb); VU, 2026-08-20 (grupė ir 13 vasaros studentų); VU, R. Racz (pirmoji VU doktorantė LHCb); VU, 2026-07-30 (koordinatorius).

(~0.65 min)
-->

---
space: { path: [[3, { at: [2603.2, 0.1, 6.0], dist: 2.4, yaw: -10, pitch: 8 }], [7.5, { at: [2603.2, 0.1, 6.0], dist: 2.4, yaw: -10, pitch: 8 }], [11.5, { at: [2598.3, 0.6, 5.0], dist: 10, yaw: -10, pitch: 8 }]], dim: 0.15 }   # 23 Oct review: in close on the 1 TB sphere (the unit), held while it is named, then drawn back to the 800 pile;   # (x 2597.0 until 22 Oct: „1 TB“ ran to x 930, past the broadcast safe box) from the front, so the 1 TB sphere and its label stand in frame right of the 800 pile, nearly as far from the lens (OpenData's yaw-73 pose, its slide 7, left the sphere below the frame); the camera stays inside the vault's clear capsules
---

<Grains :set="{ pq: 3, route: 12, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, scale: [0, 1], 'scale:labels': 1, sun: 0, vilnius: 0 }" />

<div class="readout" style="animation-delay: 8s">

<div class="big"><Count name="open" :from="0" :to="800" :delay="8000" /><span class="unit">TB</span></div>

</div>

<!-- facts: laptop-stack-over-1km-worked, lhcb-run1-full-release-2023, lhcb-run1-volume-sources-differ, sarpis-interview-run1-1-5-years, lhcb-pentaquark-2015-run1-data, lhcb-open-data -->

<!--
Message: the data I prepared in Bonn, in one picture: each sphere a terabyte, about a laptop's disk; LHCb's 2011 and 2012 data are 800 of them; every file found, checked and described, about a year and a half; the pentaquark peak first rose in exactly these data, and now they are open to everyone.
Picture: OpenData's piles (the owner, 18 Oct: "Show something about open data"): the camera flies in to a single gold sphere and a pile of 800 like it, standing on a floor of grains in a space of data; „1 TB“ under the sphere, the count „800 TB“ low on the left (once: the pile's own label is gone).

Štai jie. Šis rutuliukas – vienas terabaitas, maždaug nešiojamojo kompiuterio diskas. Kiekviena sfera krūvoje – tokia pati. Čia LHCb 2011 ir 2012 metų duomenys – aštuoni šimtai terabaitų. Kiekvieną failą reikėjo surasti, patikrinti ir aprašyti. Net su tam parašytomis programomis tai užtruko apie pusantrų metų. Būtent šiuose duomenyse 2015 metais iškilo pentakvarko smailė. Dabar jie atviri visiems – ir tau.

Terabytes only, never „petabaitas“. 800 TB is CERN's figure (VU: over 1 PB in all, of which 800 TB of physics data in over 100 000 files); the release holds the same 2011–2012 collisions the 2015 peak rose in (2019 used Run 1 and Run 2). The year-and-a-half line is the speaker's public interview (VU Library, 5 March 2026). If asked: the full Run 1 release was completed on 20 December 2023; a terabyte holds tens of millions of recorded collisions.

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20); VU biblioteka, interviu, 2026-03-05; LHCb, Phys. Rev. Lett. 115, 072001 (2015) (3 fb⁻¹, 2011–2012).

(~0.6 min)
-->

---
space: { at: [2591.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }   # OpenData's 4 PB pose (its slide 8)
---

<Grains :set="{ pq: 3, route: 12, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, scale: [0, 1, 2], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout last">

<div class="big"><Count name="open" :from="800" :to="4000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="caption">Atvirieji duomenys</p>

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

<Grains :set="{ pq: 3, route: 12, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, scale: [0, 1, 2, 3], 'scale:labels': 0, sun: 0, vilnius: 0 }" />

<div class="readout blue late">

<div class="big"><span class="gt">></span><Count name="lhcb" :from="0" :to="100000" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Visi LHCb duomenys</p>

</div>

<!-- facts: lhcb-data-100pb, lhcb-data-total-2026, laptop-stack-over-1km-worked, lhcb-ntupling-service-4pb, lhcb-open-data-policy -->

<!--
Message: all the data LHCb has collected: more than 100 000 terabytes, a stack of laptops more than a kilometre high; the gold pile in front is open.
Picture: the camera pulls far back; a blue pile of 100 000 spheres rises behind the gold one; „> 100 000 TB“ counts up low on the left (a lower bound: LHCb's 100 PB is its March 2025 figure), the caption names it. The first sentence as the blue pile rises.

O tai visi LHCb surinkti duomenys – daugiau nei šimtas tūkstančių terabaitų. Sukrovus šimtą tūkstančių nešiojamųjų kompiuterių vieną ant kito, bokštas būtų aukštesnis nei kilometras. Auksinė krūva priekyje jau atvira.
Grįžkime prie paties detektoriaus.

Scale, worked out: a 1 TB laptop of today is about 1,1 cm thick, so 100 000 of them stack to about 1,1 km: „daugiau nei kilometro“, never „dviejų kilometrų“. If asked: LHCb opens about half of a period's data five years after it ends and all of it after ten.

Šaltiniai: B. Couturier, ISGC 2025 („more than 100 PB of data“); LHCb, arXiv:2504.00610 (atvirųjų duomenų politika).

(~0.45 min)
-->

---
space: { path: [[0, { at: [595.5, 0, 0], dist: 13, yaw: -14, pitch: 8 }]], sway: 0, dim: 0.25 }   # under the two clips, a cut to the cover's pose (the world rests there, unseen under the clips)
---

<!-- The owner, 23 Oct: "Don't need second to last slide, better take 2 last slides from innoday just zoom out to lhc / fcc, not the globe". Innoday's lis_flag.mp4, here from its 3,5 s, 16,5 s (a Blender render of a whole SciFi module, then its light injection cold box and the Lithuanian flag lasered on it); its last frame is the first of the close. -->
<VideoPlayer src="lis_flag.mp4" muted :controls="false" transition="fade" />
<Soundtrack src="audio/starfire_close.m4a" tail="audio/starfire_from52.m4a" :tail-at="52" :level="0.3" start keys />
<Grains :set="{ pq: 0, route: 12, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0 }" />

<!-- facts: lhcb-scifi, lhcb-scifi-lis, lhcb-scifi-lis-vcsel, lhcb-vilnius-scifi-lis -->

<!--
Message: one part of LHCb our group works on: the tracker of plastic fibres that light up when a particle passes, and the light injection system at the ends of its modules that sends short laser pulses into them to calibrate them. A computer-made picture, said so; the flag is ours.
Picture: Innoday's clip from its 3,5 s (the dark start cut), 16,5 s, silent: 0–3,5 s the camera pans slowly down a whole SciFi module (two fibre mats of 2,4 m) from below; 3,1–6,5 s the cold box at its lower end is outlined in soft light blue (the light injection system is inside it); 6,5–8,5 s the camera closes in on the box; 8,5–14 s a laser engraves the Lithuanian flag on it; it holds from 16 s. The press goes on to the close, which starts from this frame.

Tai vienas LHCb sekiklio modulis – kompiuteriu sukurtas vaizdas. Jame – plastikinės skaidulos, kurios sužimba, kai pro jas praskrieja dalelė.
[kamerai artėjant prie dėžės] Šioje dėžėje lazeriai siunčia į skaidulas trumpus šviesos impulsus – taip tikrinama, ar sekiklis matuoja tiksliai. Prie jo dirba ir mūsų grupė.
[vėliavai išryškėjus] Vėliavą į šį vaizdą įpiešėme patys.
[kai vaizdas sustoja] → spausk

The SciFi slide's words of 21 Oct, shortened to fit the 16,5 s clip (the final story pass, 23 Oct). If asked: the SciFi tracker holds more than 11 000 km of 250 µm fibre (lhcb-scifi) and records where the particles passed. Nothing more about Vilnius than the group's meeting agenda says (SciFi and the light injection system among its service tasks): never „mes sukūrėme“. The flag is not on the real module. If asked: 670 nm VCSEL lasers; 524 288 SiPM channels read the light.

Šaltiniai: LHCb Upgrade I, JINST 19 (2024) P05065, 6.5.7 sk.; indico.cern.ch/event/1461467 (VU LHCb grupės susitikimas, 2024-10-03).

The clip runs 16,5 s (trimmed); the words run a few seconds past it, over its held frame.

(~0.1 min)
-->

---
space: { path: [[0, { at: [595.5, 0, 0], dist: 13, yaw: -14, pitch: 8 }]], sway: 0, dim: 0.25 }
---

<!-- Innoday's recorded close (close_home.mp4, Innoday's last shown slide) cut at 57,2 s, where it rests on the LHC and FCC map, before it flies off to the globe and home (the owner: "just zoom out to lhc / fcc, not the globe"); for TV (scripts/close_fit.py --no-fit: the dark gap after the flag cut, its lines thickened, the source's own full framing), 54 s. Muted (Innoday's music is its own Soundtrack, not in the clip); it holds the map until the press. -->
<VideoPlayer src="close_lhc_fcc.mp4" muted :controls="false" transition="fade" />
<Soundtrack src="audio/starfire_close.m4a" tail="audio/starfire_from52.m4a" :tail-at="52" :level="0.3" resync keys />
<!-- the labels the owner asked for (23 Oct: "mano appearing where LHC is and when FCC is in view - jūsų greitintuvas"), on the clip's clock: the LHC ring reads from 43,3 s, the FCC's whole circle from 52 s (measured on the clip); „mano“ from 45 s, once the lake has swung clear of its place top right, „jūsų“ off the FCC ring's bottom right; canvas px, clear of the rings, the lake and the logo, inside the safe box -->
<ClipCue :from="45" :path="[[45, 652, 58]]" class="close-label">mano<br>greitintuvas</ClipCue>
<ClipCue :from="52" :path="[[52, 652, 328]]" class="close-label">jūsų<br>greitintuvas</ClipCue>
<ClipCue :end="1.5" class="close-credits">Muzika: Scott Buckley, „Starfire“ (CC BY 4.0) · Žemėlapis: © OpenStreetMap bendraautoriai (ODbL), Natural Earth · CMB žemėlapis: ESA ir Planck kolaboracija, CC BY-NC 3.0 IGO (pakeistas) · Kosminis tinklas: NCSA Advanced Visualization Lab · Žemė: Google Earth</ClipCue>

<!-- facts: lhc-geneva-27km-100m-four-experiments, cern-fcc-study, lt-fcc-unis, cern-ls3-hllhc, sarpis-glasgow-study-and-job, sarpis-phd-heidelberg-to-bonn -->

<!--
Message: the last slide (the owner, 23 Oct: "we finish on slide 20 [now 19] FCC full frame - saying 'LHC - mano greitintuvas, FCC - jūsų greitintuvas'"): from our flag on one module, out to the whole detector and its collisions; the LHC runs till they are about thirty; the cover's promise kept (my road was not straight; you need not know now what you will be); then the LHC ring, mine, and the FCC, CERN's proposed next ring, whose study VU has joined: theirs. Thanks.
Picture: Innoday's close, 54 s, no sound, at its own full framing (the FCC ring fills the height at the end): the flag's frame breaks into grains and dissolves (~2,5 s) into LHCb as a point cloud of its real geometry, the camera drawing back through it (3–14 s; the whole detector from ~12 s), the flag shrinking to where the module stands, a 1,83 m person for scale (~18 s); a real LHCb collision crosses at ~16 s, then the crossings come faster until the detector glows evenly (~18–33 s); then a slow climb until it looks straight down, north up (~35–42 s): LHCb shrinks to a point and the map comes up round it at true scale (the LHC ring from ~42 s, the FCC's whole circle ~49–52 s), the LHC ring (26,7 km) with its two beams, the proposed FCC ring (90,7 km) in orange dashes, Lake Geneva, the small flag at LHCb's point, the LHCb logo top left (its mirrored „LHCb“ is the logo's own CP mirror). „mano greitintuvas“ comes up beside the LHC ring as it appears, „jūsų greitintuvas“ beside the FCC ring once it is whole (deck text, <ClipCue>, following the rings as the camera settles); the licence credits in tiny print as the clip ends. The music: Scott Buckley's „Starfire“, as Innoday's close, low under the speech; it goes on over the held frame.

[vėliavai byrant, kamerai traukiantis, nuo 0 s] Pradžioje žadėjau pasakyti, nuo ko tokį darbą galima pradėti. Mano kelias, kaip girdėjai, nebuvo tiesus. Nebūtina jau dabar žinoti, kuo būsi. Užtenka pastebėti, kas tau įdomu, ir pasidomėti giliau.
[susidūrimams ėmus kartotis, ~19 s] Dabar greitintuvas atnaujinamas. Atnaujintas jis veiks iki 2041 metų. Tada tau bus apie trisdešimt.
[tylėk, kol detektorius ima švytėti ir kamera kyla, ~27–42 s]
[kai iškyla LHC žiedas, ~42 s; „mano greitintuvas“ pasirodo ~45 s] Šis žiedas – dvidešimt septynių kilometrų LHC. LHC – mano greitintuvas.
[~47 s; „jūsų greitintuvas“ prie FCC žiedo pasirodo ~52 s] O šis – devyniasdešimt vieno kilometro FCC, kurį CERN siūlo statyti kitą. Prie jo tyrimų jau prisijungė Vilniaus universitetas.
FCC – jūsų greitintuvas.
[pauzė 2 s]
Ačiū.

The order (the final story pass, 23 Oct): the advice over the wordless pull-back from the flag, so the 2041 line leads straight into „mano“ and „jūsų“ and the punchline is last, about 4 s after its label. „iki 2041 metų“: the HL-LHC is to run from June 2030 to 2041 (cern-ls3-hllhc); „apie trisdešimt“ is our arithmetic (15–18 now, plus 15). The organisers' advice is here since „Ačiū“'s slide went (23 Oct), where it closes the cover's promise; „Mano kelias … nebuvo tiesus“ leans on 13. „dvidešimt septynių kilometrų“ ties „LHC“, first said here, to slide 6's „LHC 27 km“. The two last lines are the owner's own („jūsų“, plural, as he said it). „Prie jo tyrimų jau prisijungė“: VU, KTU and LSMU signed a memorandum with CERN to join the FCC feasibility study (lt-fcc-unis, 22 Sept 2025). The collision is the same kind as slide 10's; its 40 MHz is not said again. If asked: the decision to build is hoped for about 2028 (the CERN Council, „possibly in 2028“, cern-fcc-council-2025); LHCb is 21 m long (lhcb-detector-size); FCC 90,7 km, about 200 m deep, its first stage an electron–positron collider of about 15 billion CHF (cern-fcc-study).

Šaltiniai: home.cern (LHCb; the FCC, 2025-11); cerncourier.com/a/fcc-feasibility-study-complete/; ff.vu.lt (2025-09-22).

The clip runs 54 s; the words run about 7 s past it, over the held map, and the music goes on after „Ačiū“.

(~1.05 min)
-->
