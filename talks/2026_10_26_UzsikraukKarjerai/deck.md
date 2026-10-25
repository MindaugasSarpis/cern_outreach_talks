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
  LHCb clip); LHCb taking data (24 Oct): its own real collision and the 40 MHz
  glow beside its Ωc⁰ spectrum, which fills from the detector as its years
  tick, five narrow peaks, three quarks and their gluons, the rule, and the
  pentaquark found the same way in 2015 (the zoom's music under it); two
  things CERN made, Stumpe's touchscreen (1972) and the first website
  (1990). Then the speaker's road round
  Europe, the group in Vilnius, OpenData's piles of open data, the group's
  SciFi module and its flag, and Innoday's close out to the LHC, „mano
  greitintuvas“, and the FCC, „jūsų greitintuvas“ (Starfire under both); „Ačiū“.
layout: cover
space: { at: [594.9, 0, 0], dist: 10, yaw: -14, pitch: 8, sway: 1, dim: 0.25 }   # 24 Oct review: closer (dist 13 at [593.2, 0, 0] until then), so the five-quark form is the cover's hero, not a fifth of the frame
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
<VideoPlayer src="vilnius_zoom.mp4" transition="fade" :volume="0.25" />   <!-- 25 Oct (the owner: "zoomout swoosh a bit too loud"): the hum 0,25 (0,4 until then) -->
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.45" start keys />

<!-- facts: nftmc-opened-2016 -->

<!--
Message: where we are, then out past everything to the largest scale.
Picture: the owner's SpaceEngine zoom for Innoday, 4:13 made 19 s (scripts/remap_zoom.py): the NFTMC building in Saulėtekis (Google Earth, 0–2,3 s), the Saulėtekis campus (to ~3,9 s), Vilnius and its region (~3,9–5,4 s), into the clouds (~5 s), a quick dissolve to the Earth from space (~5,5–8,4 s), then a zoom-dissolve (the Earth shrinking on into the centre as our galaxy comes in large and settles) to our galaxy whole (~9,5–11 s), turning and receding to a dot (~11–12,5 s), and a second zoom-dissolve into the cosmic web (from ~12,5 s), slowing to a stop, held from 18 s. Stabilised (the owner: the source's wobble "on speedup it doesn't look good"); the swaying stretches are left out, and the scale jumps are zoom-dissolves since the owner's "This immediate switch from galaxy to universe web and from earth to galaxy doesn't work" (23 Oct). No sound of its own. It waits on the web for the press (no advance-on-end).

Čia – Saulėtekis Vilniuje. Čia dirba Vilniaus universiteto fizikai.
[kai matosi Žemė iš kosmoso, ~6 s] Žemė. [~10,5 s] Mūsų galaktika.
[tinklui pasirodžius tylėk; kai jis sustoja] → spausk

The words follow the picture: say each name as it comes, not before; the first sentence is over by the time Vilnius is in sight (~4,5 s). „Čia dirba Vilniaus universiteto fizikai“: NFTMC houses units of the VU Faculty of Physics (nftmc-opened-2016). Lithuania as a country is not shown, so it is not named.
The footage: the owner's SpaceEngine edit spaceengine/nftmc_zoom.mp4 (Google Earth for the Earth part: its logo is on every Earth frame and the imagery providers are named in the footage, as Innoday's notes say; at this speed the providers' line is up for well under a second); the web, NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“), as on the next slide.

The clip runs 19 s.

(~0.35 min)
-->

---
space:
  dim: 0
  sway: 0
  hum: false
  ambient: 0   # 24 Oct (the owner: "can we make the web universe darker? no blue in the back just clear visitble strands, monumental, vast"): the ground, nebula and dust off, the strands alone on black
  cameraRate: [[0, 0], [4, 0], [6, 1]]   # Innoday's: the camera stands still for the dissolve (WebTakeover restarts this when it places the grains), then eases into the path
  path:   # 24 Oct (the owner: "take from innoday and improve the point based universe web"): Innoday's flight through the web in depth, its 46 s cut to 23 s; the frame's knot stands at [30.6, 40.8, -86]
    - [0, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]          # the zoom's own pose: the frame is the picture
    - [5.5, { at: [30.6, 40.8, -86], dist: 40, yaw: 30, pitch: 10 }]    # a turn round the knot: the strands stand in depth
    - [9.5, { at: [30.6, 40.8, -86], dist: 30, yaw: 70, pitch: 4 }]    # side on to the frame's web
    - [13.5, { at: [10, 36, -112], dist: 34.5, yaw: 60.5, pitch: 2.5 }] # in past the knot
    - [17.5, { at: [-10, 38, -128], dist: 33, yaw: 61.4, pitch: -6.8 }] # past the web behind it (24 Oct review: dist 25,2 went through a strand: a grey cloud on a stream)
    - [23, { at: [30, 40, -70], dist: 18, yaw: 0, pitch: 0 }]          # 24 Oct review: back to the picture's own viewpoint (the web a picture again), where funnel.js's morph is made to be seen (seen from 55 units its grains were specks); the path 27 s → 23 s (6–16 s changed little)
    - [46, { at: [30, 40, -70], dist: 19.5, yaw: 0, pitch: 0 }]        # a slow drift back until the press
---

<WebTakeover :gain="1.75" :cosmos-gain="2.3" :size="0.46" :cosmos-size="1.5" />   <!-- 24 Oct: brighter, slightly larger strands on the black (gain 1,3, cosmos 1,65, size 0,4 and 1,3 until then) -->
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<!-- facts: cosmic-web-simulation-filaments-voids -->

<!--
Message: the Universe at its largest scale, as a picture that breaks into grains.
Picture: Innoday's cosmic web as a still (the owner, 18 Oct: "take the still cosmic web from the innoday"), the zoom's own last frame, so the cut from the clip does not show: the picture holds for half a second, then its dark lets go evenly and its bright filaments break into grains, each on its own pixel's line of sight (3 s). They make the funnel on the next step.

Maždaug taip atrodo Visata didžiausiu mastu – galaktikų gijos ir tuštumos tarp jų.
[leisk vaizdui subyrėti į grūdelius, maždaug 3,5 s] → spausk

The line is in the script since 21 Oct (the 15-minute round; the web is a cosmological simulation's visualisation, cosmic-web-simulation-filaments-voids); hold the slide for it.
The picture: the last frame of the owner's SpaceEngine edit for Innoday (public/figures/opener_last.jpg), the cosmic web of NCSA's Advanced Visualization Lab („Cosmic Bubble Bath“, NSF), as Innoday credits it; no public page of that title was found on 20 Oct (NASA SVS 10663 is the closest NCSA AVL piece), so the still's own source is the owner's to name for the credit. If the NCSA or Planck licence is refused for the Delfi stream, cut slides 2, 3 and 4: the cover flies straight to CERN and slide 4's quark ladder is said on slide 8 over the debris.

(~0.5 min)
-->

---
space:
  dim: 0
  ambient: 0   # 24 Oct: the web's black carried on under the funnel
  path:   # 24 Oct (the owner: "make slide 4 look more dramatic, and vast"): the flight out of the web ends far back, the funnel small in the web round it, then the camera swings in low along its side until its mouth looms (until then one pose: [30, 39, -119], dist 25, yaw -72, pitch 13)
    - [1, { at: [30, 40, -70], dist: 19.5, yaw: 0, pitch: 0 }]          # 24 Oct review: slide 3's last pose, the picture's viewpoint down the funnel's axis, held while the web's grains fly into the funnel (funnel.js's morph, 0–4,4 s; seen from the side far off, they all but vanished)
    - [4.4, { at: [30, 40, -70], dist: 21, yaw: 0, pitch: 0 }]
    - [8.5, { at: [30, 40, -116], dist: 50, yaw: -58, pitch: 12 }]    # out to the side, far back: the whole funnel inside the web
    - [16, { at: [30, 39.3, -120.5], dist: 23.5, yaw: -78, pitch: 7 }]    # in low beside it, the narrow end left, the mouth coming at the camera on the right
---

<AfterFlight :delay="9"><div class="age"><span class="n">13,8</span> mlrd. metų</div></AfterFlight>
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

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
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

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
<!-- 24 Oct: the dust stays on 6, 7 and 9 (a review round's `transition="fade"` left ~0,6 s of black after the push out of the clip before: the owner saw it flicker) -->
<!-- 25 Oct (the owner: "slide 6 too loud … on slide 6 let's just have music, mute the video"): muted (0,05 until then) -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" muted exit="push" exit-at="0.45,0.53" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

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
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

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
  # 24 Oct review: the whole timeline at 75 % (the crossing came ~6 s in, after a black frame and a thin streak: dead air on TV); the run-in's rate ×4/3 so the bunches still cross where the world freezes (until then [[0, 1.4], [2.0, 1.4], [2.7, 0.03], [5.6, 0.03], [6.6, 1.0], [8.0, 1.0], [9.0, 1.8], [11, 1.8], [12, 1]], the path's keys at 0, 2.6, 5.6, 6.5, 7.3, 8.3, 9.8, 11.5)
  rate: [[0, 1.87], [1.5, 1.87], [2.03, 0.03], [4.2, 0.03], [4.95, 1.0], [6.0, 1.0], [6.75, 1.8], [8.25, 1.8], [9, 1]]
  cameraRate: 1
  path:
    - [0, { at: [0, -400, 0], dist: 4.2, yaw: 18, pitch: 5 }]
    - [1.95, { at: [0, -400, 0], dist: 2.4, yaw: 32, pitch: 8 }]
    - [4.2, { at: [0, -400, 0], dist: 1.5, yaw: 70, pitch: 14 }]
    - [4.9, { at: [0, -400, 0], dist: 3.3, yaw: 58, pitch: 17 }]
    - [5.5, { at: [0, -400, 0], dist: 5.6, yaw: 26, pitch: 20 }]
    - [6.2, { at: [0, -400, 0], dist: 8.8, yaw: 9, pitch: 24 }]
    - [7.35, { at: [0, -400, 0], dist: 11.2, yaw: 4, pitch: 26 }]
    - [8.6, { at: [0, -400, 0], dist: 12, yaw: 2, pitch: 26 }]
---

<LhcOpening name="opening" :count="290" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<!-- facts: cms-195099-137440354-record-300, cms-195099-290-drawn-tracks, cms-195099-19-vertices, lhc-geneva-27km-100m-four-experiments, lhc-collisions-create-new-particles, particles-decay-detector-sees-products, lhcb-vilnius-joined -->

<!--
Message: one real collision: hundreds of particles fly out, among them new, heavy ones that live only an instant.
Picture: one real collision in the black, OpenData's and Innoday's. Two bunches of protons run in along the beam pipe and cross; 19 collisions flash along the beam, the world nearly stops at the crossing while the camera moves round it, then runs on as the debris flies out to every side: 290 tracks curling in the magnet, the calorimeters' cells lighting all round, two muons running out. „290 dalelių“ as it flies apart („8 TeV“ is hidden for this talk, styles/index.css: a unit grade 9–12 do not know). A low swell, a thump at the crossing, a low drone that fades over four seconds as it flies apart: quiet enough to talk over. Start speaking as the debris flies out (about 6 s in). → for the LHCb clip.

[palauk, kol dalelės išlėks]
Štai tikras dviejų protonų paketų susidūrimas. Šiame vaizde išlekia šimtai dalelių. Tarp jų būna ir naujų, sunkių dalelių, kurios gyvuoja labai trumpai: jos beveik iš karto suskyla, ir detektorius mato tik jų skeveldras.
Šį susidūrimą 2012 metais užfiksavo CMS – vienas iš keturių didžiųjų šio greitintuvo detektorių.
O dabar – LHCb.

The decay sentence follows cms.cern's own wording (most particles produced are unstable and transform rapidly; the detector measures the stable ones), so „skeveldros“ on slide 10 is heard a second time; the mass is taught on slide 10. No acronym in speech. If asked: CMS, one of the four LHC detectors, recorded it on 27 May 2012; 19 proton pairs collided in this crossing; the picture draws the 290 clearest tracks (not a number CMS reports); 8 TeV is the collision energy.

The event: CMS Open Data record 300 (CC0), run 195099, event 137440354, a Higgs boson candidate. Provenance: components/lhc-opening/README.md.

(~0.55 min)
-->

---
space: { path: [[0, { at: [1023.7, -483, 2.5], dist: 35, yaw: 0, pitch: 4 }]], sway: 0.3, dim: 0, ambient: 0, hum: false }   # 24 Oct: under the clip, a cut to the next slide's pose (the world rests there unseen), so the data slide starts at once, with no flight
---

<!-- The shared opening's LHCb reel: the detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release. It condenses out of the dust; the speaker's → moves on. -->
<!-- 24 Oct: muted, Starfire under it (the owner: "starfire for the entire deck … everything coherently connected"); the reel's own music was 0,45 -->
<VideoPlayer src="lhcb.mp4" muted />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<!-- facts: lhcb-detector-size, lhcb-three-storey-worked, lhcb-collaboration-sep-2026, lhcb-vilnius-joined, particle-decay-reconstructed-mass, particles-decay-detector-sees-products -->

<!--
Message: this is LHCb, three storeys high; almost two thousand people work on it, our Vilnius group among them, and I am one of them.
Picture: the LHCb detector in 3D, with music. Start about 3 s in; about 30 words take 16 s, 20 s at a slow delivery; then → about 3 s after „Aš – vienas iš jų.“ (the reel need not end; the next slide stands at the same detector).

Tai LHCb. Jis dešimties metrų aukščio – kaip trijų aukštų namas. Šiame eksperimente dirba beveik du tūkstančiai žmonių iš viso pasaulio, tarp jų ir mūsų grupė iš Vilniaus universiteto. Aš – vienas iš jų.
[palauk 3 s] → spausk

„beveik du tūkstančiai“: 1 891 members in September 2026; never „daugiau nei“. „kaip trijų aukštų namas“ is our arithmetic (10 m at about 3 m a storey). If asked: 5 600 tonnes, 21 m long; VU joined LHCb in September 2024.

The line is said over the clip. The lint counts the clip's whole 39 s from the manifest; pressed 3 s after the line (22 Oct), the slide takes about 25 s.
-->

---
space: { at: [1023.7, -483, 2.5], dist: 35, yaw: 0, pitch: 4, sway: 0.3, dim: 0, ambient: 0, hum: false }   # 24 Oct: the cavern side on, LHCb (x 0–24 of the `cavern` station) left and the Ωc⁰ plot (`oc`, x 28–47, 5 nearer) right, both in frame; the labels are projected from this pose (sway 0.3)
clicks: 1
---

<InsideLhcb :land-y="-470" :until="1" />
<DataSfx />
<ClickPose :poses="{ 1: { at: [1042.3, -481.9, 5], dist: 27, yaw: 0, pitch: 3, sway: 0.3, dim: 0, ambient: 0, hum: false, flight: 2.2 } }" />
<Grains :set="{ pq: 3, route: -1, th2: 0, th1: 0, oc: 1, omega: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { oc: 2, omega: 1 } }" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<AfterFlight :delay="2.5"><div v-click.hide="1" class="heap r late" style="left: 880px; top: 56px"><span class="n">LHCb duomenys</span></div><div v-click.hide="1" class="heap r axis late" style="left: 880px; top: 308px"><span class="n">masė&nbsp;→</span></div></AfterFlight>
<AfterFlight :delay="4.6"><div v-click.hide="1" class="heap l late" style="left: 104px; top: 324px"><span class="n"><FillClock name="oc" :years="[[0, 2011], [0.3, 2012], [0.91, 2015], [1, '2011–2015']]" :delay="5" :fill="9" /></span></div></AfterFlight>
<!-- 24 Oct (the owner: "Slide 10 indicate 4 TB/s"): LHCb's Run 3 readout, the whole detector every crossing, as its glow builds (lhcb-run3-readout-4tbs); top left, clear of the detector and the plot -->
<AfterFlight :delay="6"><div v-click.hide="1" class="heap l late" style="left: 104px; top: 66px"><span class="n">4 TB/s</span></div></AfterFlight>
<div v-click="1" class="heap l step" style="left: 390px; top: 66px; --step-delay: 2.2s"><span class="n">LHCb duomenys</span></div>
<div v-click="1" class="heap l step" style="left: 154px; top: 340px; --step-delay: 2.2s"><span class="n"><FillClock name="oc" :years="[[0, 2011], [0.3, 2012], [0.91, 2015], [1, '2011–2015']]" :delay="5" :fill="9" /></span></div>
<div v-click="1" class="heap r axis step" style="left: 600px; top: 340px; --step-delay: 2.2s"><span class="n">masė&nbsp;→</span></div>
<div v-click="1" class="heap l step" style="left: 390px; top: 124px; --step-delay: 2.8s"><span class="n">5&nbsp;naujos dalelės</span></div>
<div v-click="1" class="heap step" style="left: 769px; top: 144px; --step-delay: 3.2s"><span class="n">c</span></div><div v-click="1" class="heap step" style="left: 718px; top: 230px; --step-delay: 3.2s"><span class="n">s</span></div><div v-click="1" class="heap step" style="left: 816px; top: 230px; --step-delay: 3.2s"><span class="n">s</span></div>

<!-- facts: lhcb-run3-readout-4tbs, lhcb-100m-below-ground, particles-decay-detector-sees-products, particle-decay-reconstructed-mass, lhcb-omegac-2017-fig2-candidates, lhcb-omegac-2017-sample, lhcb-omegac-2017-years, lhcb-omegac-five-2017, lhcb-omegac-2017-masses, omegac-quark-content, proton-neutron-three-quarks, chance-bumps-shrink-with-data, particle-physics-5-sigma-discovery, lhcb-pentaquark-2015, lhcb-pentaquark-2015-cross-checks, pentaquark-idea-to-discovery-51-years -->

<!--
Picture (24 Oct, the owner: "slide 11-12 a bit anticlimactic need maybe the detector besides showing we are taking data and a single histogram with peaks built up"; the toy plot cut): LHCb's 3D model in the cavern, left, and beside it LHCb's real Ωc⁰ spectrum, right. LHCb's own 2012 collision crosses in the detector (~3 s), then the crossings come faster until they merge into the 40 MHz glow; just after the first crossing the plot starts to fill (`lead` 3,4 world-s): grains rise out of the detector and arc into their mass bins (20 s), „LHCb duomenys“ over it, the year the landing data were taken under the detector („2011 m.“ → „2015 m.“, then „2011–2015 m.“), „masė →“ under the axis. → spausk: the camera moves in to the plot as the detector and its collisions fade (the data are in), the five peaks get ticks, „5 naujos dalelės“, and the Ωc⁰ as three quarks (c, s, s) with gluons gathers right of it. The zoom's music under it.

Detektorius renka duomenis. Iš skeveldrų apskaičiuojame suskilusios dalelės masę – vienas taškas grafike. Tai tikri LHCb duomenys, surinkti per penkerius metus.
→ spausk
Čia penkios smailės – penkios naujos dalelės, kiekviena iš trijų kvarkų. Atradimu fizikai vadina tik tokią smailę, kurios atsitiktinumas beveik niekada nesukurtų. O 2015 metais lygiai taip pat LHCb rado dalelę iš penkių kvarkų, kurią matei pradžioje. Pentakvarkų ieškojau ir aš.

Data: LHCb, Phys. Rev. Lett. 118, 182001 (2017), Fig. 2, 2 960–3 300 MeV, 59 453 candidates (public/data/omegac.json), one grain per three candidates (`unit: 3`). The collision: CERN Open Data, LHCb 2012. The 40 MHz and the 2011–2015 years are not said together: the collision is Run 1's. If asked: the bar is 5σ, about 1 in 3,5 million; the five are at 10σ to 24σ.

Šaltiniai: LHCb, Phys. Rev. Lett. 118, 182001 (2017), arXiv:1703.04639; LHCb, Phys. Rev. Lett. 115, 072001 (2015); CERN Open Data (LHCb 2012).

(~1.4 min)
-->

---
space: { at: stumpe, flight: 1.6, dim: 0, hum: false }   # 24 Oct: the photo as a place (StagePhoto mode="place", as Innoday's): it stands in front of the data slide's camera, which pushes in to its front view
places: { inventions: true }   # the two invention photos stand in the world from here (hidden before)
---

<StagePhoto mode="place" group="inventions" :grains="360" place-id="stumpe" :relief="0.25" :at="[1023.7, -482.5, 22]" :size="3" :yaw="0" src="figures/hero_stumpe.jpg" alt="Bentas Stumpe laiko savo CERN jutiklinio ekrano stiklinę plokštę šalia išmaniojo telefono" focus="50% 30%" class="kk-dim">
<p class="kk-invention bl">Jutiklinis ekranas<br>1972</p>
</StagePhoto>
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<style>
/* 24 Oct: the inventions' names (a name of a thing shown), 38 px, white on a dark pill, inside the broadcast safe box and clear of the lower third */
:global(html[data-stage] .hero .kk-invention) { position: absolute; z-index: 2; margin: 0; font-size: 38px; font-weight: 600; line-height: 1.2; letter-spacing: 0.01em; color: #fff; white-space: nowrap; background: rgba(4, 6, 16, 0.72); padding: 6px 16px; border-radius: 6px; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5); opacity: 1; }
:global(html[data-stage] .hero .kk-invention.bl) { left: var(--kk-x); bottom: var(--kk-floor); }
:global(html[data-stage] .hero .kk-invention.tr) { right: var(--kk-x); top: 62px; }
/* near-white pictures graded down for the camera (Innoday's .hero.dim) */
:global(html[data-stage] .hero.kk-dim > img) { filter: brightness(0.8) contrast(1.05); }
:global(html[data-stage] .hero.kk-dim.page > img) { filter: brightness(0.55) contrast(1.05); }
</style>

<!-- facts: gave-touch-stumpe-1972, gave-touch-sps-1976, gave-touch-johnson-1965 -->

<!--
Picture: Bent Stumpe in 2016 with one of his CERN touchscreen panels beside a smartphone (Innoday's photo); it forms out of the world's grains as the camera pushes in. „Jutiklinis ekranas“ and „1972“ under it, low left (two lines, so the dark ground stays off his face).

CERN kuria ne tik mokslą. 1972 metais CERN inžinierius Bentas Stumpe pasiūlė greitintuvą valdyti paliečiant ekraną – tai vienas pirmųjų jutiklinių ekranų pasaulyje.

Never „CERN išrado jutiklinį ekraną“: E. A. Johnson described one in 1965 (UK). The SPS control room used them from its start in 1976.
Vaizdas: Bentas Stumpe, 2016; nuotr. Sophia Elizabeth Bennett / CERN, CC BY 4.0.
Šaltiniai: cerncourier.com/a/the-first-capacitative-touch-screens-at-cern/.

(~0.3 min)
-->

---
space: { at: firstweb, flight: 1.6, dim: 0, hum: false }   # place mode, beside the touchscreen
---

<StagePhoto mode="place" group="inventions" :grains="360" place-id="firstweb" :relief="0.05" :at="[1031, -482.5, 22]" :size="3" :yaw="0" src="figures/first_website_crt.jpg" alt="Pirmosios svetainės puslapis „World Wide Web“ žaliomis raidėmis terminalo ekrane" focus="50% 50%" class="">
<p class="kk-invention" style="left: var(--kk-x); top: 62px">Pirmoji svetainė · 1990</p>
</StagePhoto>
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />

<!-- facts: gave-www-proposal-lhc, gave-www-next-server, gave-www-first-site-date, gave-www-first-site-text, gave-www-pellow-1991 -->

<!--
Picture: the first website's page as CERN restored it at info.cern.ch („World Wide Web“; captured at 1920×1080, 2× zoom, a margin added round the page so its heading is inside the TV safe box; 24 Oct); it forms out of the grains. „Pirmoji svetainė · 1990“ top right, beside the heading.

1989 metais CERN programuotojas Timas Bernersas-Lee pasiūlė, kaip fizikams dalytis informacija. Taip gimė pasaulinis žiniatinklis. Štai pirmoji svetainė – CERN ji veikė jau 1990 metų pabaigoje.

Never „CERN išrado internetą“: CERN made the web, which runs on the internet. The first site was live by Christmas 1990 (CERN's Web@30); it was announced publicly in August 1991. The page shown is the first website as CERN restored it in 2013.
Vaizdas: info.cern.ch/hypertext/WWW/TheProject.html (CERN), ekrano kopija.
Šaltiniai: w3.org/History/1989/proposal.html; home.cern, „A short history of the Web“; web30.web.cern.ch.

(~0.3 min)
-->

---
space: { at: [1199.83, 0, 1.06], dist: 29.07, yaw: 0, pitch: 60, sway: 0, dim: 0.05, flight: 2 }   # 24 Oct review: `flight: 2` (the default flight up from the inventions took ~5,5 s of empty blue, and the map waited for it); 23 Oct (the criss-cross): closer than the `whole` pose's [1201, 0, 2.5] at dist 36, so the seven stops spread out and every name fits inside the broadcast safe box off the trail; the seven names are projected from this pose
clicks: 5
places: { inventions: false }   # the invention photos are gone from here on
---

<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<Grains :set="{ pq: 3, route: 1, th2: 0, th1: 0, oc: 0, omega: 0, jp: 0, jx: 0, lietuva: 0 }" :clicks="{ 1: { route: 3 }, 2: { route: 5 }, 3: { route: 7 }, 4: { route: 9 }, 5: { route: 10 } }" />

<!-- 25 Oct (the owner: "the map with my travels is not very smooth, the path appears first only then the text, quite a slow animation"): each name comes up with its trail, not after it (the arrival's at 8,5 s until now, the clicks' 1,2 s after the press); the legs drawn quicker (`draw` 0,9 s a leg, was 1,5) and started sooner (space.json) -->
<div class="city late caption" style="left: 742px; top: 153px; animation-delay: 2.8s">Vilnius</div>
<div class="city late caption" style="left: 421px; top: 344px; animation-delay: 3.4s">CERN</div>
<div v-click="1" class="city step caption" style="left: 138px; top: 56px; --step-delay: 0.15s">Glazgas</div>
<div v-click="2" class="city step caption" style="left: 102px; top: 116px; --step-delay: 0.15s">Airija</div>
<div v-click="3" class="city step caption" style="left: 500px; top: 285px; --step-delay: 0.15s">Heidelbergas</div>
<div v-click="4" class="city step caption" style="left: 337px; top: 180px; --step-delay: 0.15s">Bona</div>

<!-- facts: sarpis-glasgow-study-and-job, sarpis-phd-heidelberg-to-bonn, sarpis-phd-bonn-2023, lhcb-run1-release-sarpis-lrt-2025, lhcb-vilnius-joined -->

<!--
Message: my road went through Europe, back and forth: Glasgow; the doctorate begun in Heidelberg and finished in Bonn, where I searched for pentaquarks and prepared LHCb's data for everyone; then back to Lithuania, and now the LHCb group at Vilnius University. CERN is the place I kept coming back to. The personal touches are yours to tell, in three slots here (the first is the one to keep) and Manchester's on the next slide.
Picture: the trail criss-crosses Europe leg by leg, in the owner's order (23 Oct: "Vilnius, CERN, Glasgow, CERN, Ireland, Vilnius, Heidelberg, CERN, Bonn, CERN, Vilnius and Manchester CERN - like a criss cross. a bit more snappy on clicks"): Vilnius → CERN on arrival, then → Glasgow → CERN (click 1), → Ireland → Vilnius (2), → Heidelberg → CERN (3), → Bonn → CERN (4), and home, CERN → Vilnius (5); the next slide goes on from here, Vilnius → CERN → Manchester → CERN → Vilnius (the owner, 24 Oct), before it dives to Lithuania. Each leg bows to its own side (`bends` on the route), so a return over the same pair is a second line, not the first one drawn over. A click draws its legs in about 2 s (1,5 s for the last, one leg), and each name comes up as the trail reaches it. Ireland is named as the country („Airija“): the owner named no city. A click whose slot you skip just draws its legs.

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

Only the bank's lines are scripted: Glasgow 2011–2015 (study), the doctorate in Heidelberg 2019–2020 then Bonn 2020–2023, the pentaquark search and the open-data preparation in Bonn, the return and LHCb Vilnius; „ketveri metai“ is 2015 to 2019. Ireland and the trips back to CERN are not in the bank (nor Manchester, on the next slide): nothing is said about them unless you say it, and the returns to CERN are drawn without words. The slots are yours, in your own words (10–15 s each): the first (the CERN visit in 11th grade, at the viewers' age) is the one to tell, since the close (16) leans on „Mano kelias … nebuvo tiesus“; the second, what you did in Ireland and in the four years; the third, one sentence on what your pentaquark search showed, which answers „Pentakvarkų ieškojau ir aš“ (10). Nothing is written in their place: the bank does not hold them. The reason the doctorate moved to Bonn is no longer asked (23 Oct, for time). „Ir visa tai dabar galima daryti iš Lietuvos.“ moved to the next slide, where the camera dives to Vilnius.
If asked: Glasgow 2011–2015; Heidelberg 2019–2020; Bonn 2020–2023 (the thesis, December 2023: a pentaquark search and the LHCb open-data release); the Run 1 release is over 100 000 files, about a petabyte by VU's count.

Šaltiniai: INSPIRE-HEP author record; M. Šarpis, PhD thesis, University of Bonn, 2023; LRT.lt, 2025-01-08 (from a VU press release).

(~0.6 min)
-->

---
space: { path: [[0, { at: [1199.83, 0, 1.06], dist: 29.07, yaw: 0, pitch: 60 }], [4.4, { at: [1199.83, 0, 1.06], dist: 29.07, yaw: 0, pitch: 60 }], [8.2, { at: [1210.6, 0.25, -6.5], dist: 15, yaw: 0, pitch: 62 }]], sway: 0.3, dim: 0.35 }   # 24 Oct: opens on slide 13's Europe pose and holds it while the route draws Vilnius → CERN → Manchester → CERN → Vilnius (3,6 s from 0,3 s, `stepDraw`), then dives to Vilnius as before (the last key: the old pose); dim 0.5 until 24 Oct (0.4 until 23 Oct, 0.2 until 20 Oct: the route head's bloom washed out the east of the outline), 0.35 so the held Europe view is not darkened as much
---

<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<Grains :set="{ pq: 3, route: 14, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 1 }" />

<div class="city held caption" style="left: 742px; top: 153px">Vilnius</div>
<div class="city held caption" style="left: 421px; top: 344px">CERN</div>
<div class="city held caption" style="left: 138px; top: 56px">Glazgas</div>
<div class="city held caption" style="left: 102px; top: 116px">Airija</div>
<div class="city held caption" style="left: 500px; top: 285px">Heidelbergas</div>
<div class="city held caption" style="left: 337px; top: 180px">Bona</div>
<div class="city held manc caption" style="left: 282px; top: 113px">Mančesteris</div>
<div class="city dive caption" style="left: 718px; top: 230px">Vilnius</div>

<style>
/* the Europe names stay from slide 13 (Mančesteris comes up as the trail reaches it, about 2 s in) and go before the dive at 4,4 s; Vilnius at the dive's end */
html[data-stage] .city.held { animation: kk-held 4.4s linear both; }
html[data-stage] .city.held.manc { animation-name: kk-held-manc; }
html[data-stage] .city.dive { animation-delay: 7.8s; }
@keyframes kk-held { 0%, 86% { opacity: 1; } 100% { opacity: 0; } }
@keyframes kk-held-manc { 0%, 42% { opacity: 0; } 54%, 86% { opacity: 1; } 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce), print { html[data-stage] .city.held { display: none; } }
</style>

<!-- facts: cern-lithuania, lhcb-vilnius-students, lhcb-vilnius-work, lhcb-vilnius-racz, lhcb-open-data-coordinator-2026, lhcb-run1-release-sarpis-lrt-2025 -->

<!--
Message: all of it can now be done from Lithuania (the owner, 15 Oct: "then stress all of this can now be done in Lithuania"): a CERN associate member; a group of mostly students, on the detector, on software, or searching for particles; the first VU doctoral student on LHCb also searches for pentaquarks; 13 VU students at CERN this summer, a record. Then my own job since August, LHCb's open-data coordinator.
Picture: the slide opens on slide 13's Europe, its names still up, and the trail goes on at once (the owner, 24 Oct: "to cern from vilnius and from manchester and back to vilnius"): Vilnius → CERN → Manchester → CERN → Vilnius in about 3,6 s, „Mančesteris“ coming up as it is reached. At 4,4 s the names go and the camera dives from Europe down to Vilnius (about 4 s), and Lithuania's outline comes up in light blue round it (`lietuva`, Natural Earth); the route's arcs leave Vilnius westward out of frame. Then only Vilnius is named.

[PATIKSLINTI, neprivaloma: savais žodžiais – ką veikei Mančesteryje]
Ir visa tai dabar galima daryti iš Lietuvos.
Lietuva – asocijuotoji CERN narė, todėl lietuviai gali pretenduoti į darbą CERN. Didžioji mūsų grupės dalis – studentai. Jie dirba ir su detektoriumi, ir su programomis, ir ieško naujų dalelių. Pirmoji VU doktorantė LHCb eksperimente irgi ieško pentakvarkų. O šią vasarą praktiką CERN atliko trylika VU studentų – daugiausia iki šiol.
Nuo rugpjūčio esu ir LHCb atvirųjų duomenų koordinatorius.

The Manchester slot is yours, in your own words (10–15 s), while the trail draws: Manchester is not in the facts bank, so nothing is written in its place. „Ir visa tai dabar galima daryti iš Lietuvos.“ is said as the camera dives (from slide 12, 24 Oct). The question that bridged to the open-data piles went with them (24 Oct: "15-16-17 not needed"). The doctoral student stays unnamed. „pretenduoti“, not „kandidatuoti“. If asked: Lithuania has been an associate member since 2018; VU joined LHCb in September 2024.

Šaltiniai: home.cern, 2018-01-08 (asocijuotoji narė); VU FF, 2024-09-02 (VU priimtas į LHCb); VU, 2026-08-20 (grupė ir 13 vasaros studentų); VU, R. Racz (pirmoji VU doktorantė LHCb); VU, 2026-07-30 (koordinatorius).

(~0.7 min)
-->

---
space: { path: [[0, { at: [1210.6, 0.25, -6.5], dist: 15, yaw: 0, pitch: 62 }]], sway: 0, dim: 0.35 }   # 24 Oct review: slide 14's last pose held under the two clips (until then a cut to the cover's pose, whose five-quark form showed beside „Vilnius“ before the flag faded in); the credits page flies to the cover
---

<!-- The owner, 23 Oct: "Don't need second to last slide, better take 2 last slides from innoday just zoom out to lhc / fcc, not the globe". Innoday's lis_flag.mp4, here from its 3,5 s, 16,5 s (a Blender render of a whole SciFi module, then its light injection cold box and the Lithuanian flag lasered on it); its last frame is the first of the close. -->
<VideoPlayer src="lis_flag_50.mp4" muted :controls="false" transition="fade" />
<Soundtrack src="audio/starfire_bed.m4a" tail="audio/starfire_bed.m4a" :level="0.36" start keys />
<Grains :set="{ pq: 0, route: 14, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0, accel: 0 }" />

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
space:
  dim: 0
  sway: 0
  hum: false
  ambient: 0   # deep black throughout (the owner, 25 Oct: "this blue on blue somehow diminished the effect a bit... maybe deep black is better")
  path:   # 24–25 Oct (the owner: "make it vast, filling the entire screen"; "slowly orbit, indicate 3D fcc 300m underground"; then "keep it pointcloud but resolve better", "spend a little bit more time (like before) at eye level … Maximize effect, keeping the soundtrack in mind"): the close live, timed to Starfire (the finale file's 1:37,38 arrival at 16,36 s)
    - [0, { at: [1009.54, -482.702, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]   # 25 Oct (the owner: "the detector in slide 15 should move into LHCb as in innoday, with lithuanian flag"): the clip's last view, the flag on the cold box (<LisFlag>, Innoday's path at 22efcef, LHCb 1000 units along x here) …
    - [2, { at: [1009.54, -482.702, 0.96], dist: 2.236, yaw: -90, pitch: -29.74 }]   # … held while the frame turns to grains
    - [5.5, { at: [1009.6, -482, 0.8], dist: 7, yaw: -80, pitch: 4 }]                # out of the module's end, the flag shrinking to the module's place in the SciFi
    - [8.5, { at: [1010.6, -481.75, 1.6], dist: 14, yaw: -50, pitch: 4 }]
    - [12, { at: [1012, -481.5, 2.5], dist: 24, yaw: -18, pitch: 4 }]     # drawn back: the whole detector at eye level, the 1,83 m person beside it, the flag a small mark on its module
    - [16.4, { at: [1012, -481.5, 2.5], dist: 25, yaw: -12, pitch: 4 }]   # LHCb's collision crosses on the 1:37 arrival
    - [26, { at: [1012, -481.5, 2.5], dist: 28, yaw: 0, pitch: 5 }]       # the crossings come faster (the cascade from ~20 s) …
    - [33.8, { at: [1012, -481.5, 2.5], dist: 31, yaw: 10, pitch: 6 }]    # … until it glows evenly: 40 million a second; held at eye level to the breath at 1:54,8
    - [38, { at: [1018, -470, 2.5], dist: 38, yaw: 10, pitch: 45 }]     # the climb (the detector let go at 38,5 s)
    - [40.5, { at: [1023.7, -404, 2.5], dist: 32, yaw: 10, pitch: 76 }] # through the surface, over Point 8
    - [42.8, { at: [1028, -407, 24], dist: 72, yaw: 2, pitch: 54 }]     # the accelerators on the 2:03,8 bar (the swell after the breath), north up
    # 25 Oct (the owner: "The LHC FCC zoomout can be orbiting a bit quicker, zooming out so FCC is visible as a whole but 3D"): down to about 30° so the rings read in depth, both rings whole and filling about 80 % of the frame (each key's look point and distance fitted to the rings at its angle), and an orbit of 1,2° a second (0,5 until now)
    - [50, { at: [1031.1, -410, 38.7], dist: 62, yaw: 12, pitch: 32 }]
    - [60, { at: [1034.1, -410, 37.7], dist: 61, yaw: 24, pitch: 31.6 }]
    - [70, { at: [1036.8, -410, 36.1], dist: 59, yaw: 36, pitch: 31.2 }]
    - [80, { at: [1039.1, -410, 34.0], dist: 57, yaw: 48, pitch: 30.8 }]
    - [90, { at: [1041.0, -410, 31.5], dist: 54, yaw: 60, pitch: 30.4 }]
    - [100, { at: [1042.3, -410, 28.6], dist: 51, yaw: 72, pitch: 30 }]
    - [110, { at: [1042.9, -410, 25.6], dist: 48, yaw: 84, pitch: 29.6 }]
    - [120, { at: [1042.9, -410, 22.4], dist: 47, yaw: 96, pitch: 29.2 }]
    - [130, { at: [1042.3, -410, 19.4], dist: 49, yaw: 108, pitch: 28.8 }]
    - [140, { at: [1041.0, -410, 16.5], dist: 53, yaw: 120, pitch: 28.4 }]
    - [150, { at: [1039.1, -410, 14.0], dist: 56, yaw: 132, pitch: 28 }]
clicks: 1
---

<!-- 24 Oct: the close rebuilt live (setup/accel.js; until then Innoday's recorded close, close_quick.mp4). LHCb's cavern (slide 10's station): the collision waits 13,86 s so it crosses at 16,36 s (`delay`), the arrival of Starfire's 1:37 on it (the drop on the world's clock); at 23 s the detector is let go and the camera rises out of the cavern to the accelerator map above it (the `accel` station: Point 8's shaft stands over the detector), which then turns slowly. The depths are drawn ~20 times deeper than true so the two levels read; the FCC's eight shafts are evenly placed (indicative). On the click a CMS collision (`bang`) crosses over the FCC's middle 2,5 s later, on Starfire's 2:54,85 downbeat (starfire_downbeat.m4a starts 2,6 s before it), and its debris gathers into „Ačiū už dėmesį“ (`word`). -->
<InsideLhcb det="detp" :land-y="-470" :delay="13.86" :fade-at="38.5" :sync-to="{ src: 'starfire_finale', at: 13.52 }" />
<!-- 25 Oct: the clip's last frame (the flag on the cold box) turns to grains in LHCb's SciFi and shrinks to the detector's scale as the camera pulls back; it goes with the detector at 38,5 s. The point cloud no longer twinkles before the collision (`detp` steady, space.json). -->
<LisFlag :fade-at="38.5" />
<Grains :set="{ pq: 0, route: 14, th2: 0, th1: 0, oc: 0, omega: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0, accel: 1 }" />
<ClickBus name="bang" :click="1" />
<!-- the click: the camera flies in to face the place over the FCC's middle where the collision crosses and the words gather -->
<ClickPose :poses="{ 1: { at: [1027.99, -389.2, 30.56], dist: 22, yaw: 20, pitch: 5, flight: 2.2, ambient: 0 } }" />
<Soundtrack src="audio/starfire_finale.m4a" tail="audio/starfire_finale.m4a" :level="0.5" keys :drop="{ clock: 'world', at: 16.36, file: 'audio/starfire_finale.m4a', hit: 16.02, duck: 99, xfade: 2000, quiet: 0.8 }" :on-click="{ click: 1, file: 'audio/starfire_downbeat.m4a', level: 0.62, xfade: 700 }" />
<WorldLabel v-click.hide="1" :at="[1009.66, -408, -9.36]" :above="-440" :delay="44.5" align="left">LHC – mano<br>greitintuvas</WorldLabel>
<!-- the FCC label on the ring's south-west side (25 Oct): it stays in the safe box through the faster orbit; on the east side it ran off the bottom -->
<WorldLabel v-click.hide="1" :at="[1001.97, -416, 48.78]" :above="-440" :delay="47.5">FCC – jūsų<br>greitintuvas</WorldLabel>
<WorldLabel v-click.hide="1" :at="[1023.7, -404, 2.5]" :above="-440" :delay="45.5" :dx="34" :dy="-30">100 m</WorldLabel>
<WorldLabel v-click.hide="1" :at="[998.64, -408, 18.41]" :above="-440" :delay="49" align="left">~200 m</WorldLabel>

<!-- facts: lhc-geneva-27km-100m-four-experiments, cern-fcc-study, lt-fcc-unis, cern-ls3-hllhc, sarpis-glasgow-study-and-job, sarpis-phd-heidelberg-to-bonn -->

<!--
Message: the last slide (the owner, 23 Oct: "we finish on slide 20 [now 19] FCC full frame - saying 'LHC - mano greitintuvas, FCC - jūsų greitintuvas'"): from our flag on one module, out to the whole detector and its collisions; the LHC runs till they are about thirty; the cover's promise kept (my road was not straight; you need not know now what you will be); then the LHC ring, mine, and the FCC, CERN's proposed next ring, whose study VU has joined: theirs. Thanks.
Picture: Innoday's close, 54 s, no sound, at its own full framing (the FCC ring fills the height at the end): the flag's frame breaks into grains and dissolves (~2,5 s) into LHCb as a point cloud of its real geometry, the camera drawing back through it (3–14 s; the whole detector from ~12 s), the flag shrinking to where the module stands, a 1,83 m person for scale (~18 s); a real LHCb collision crosses at ~16 s, then the crossings come faster until the detector glows evenly (~18–33 s); then a slow climb until it looks straight down, north up (~35–42 s): LHCb shrinks to a point and the map comes up round it at true scale (the LHC ring from ~42 s, the FCC's whole circle ~49–52 s), the LHC ring (26,7 km) with its two beams, the proposed FCC ring (90,7 km) in orange dashes, Lake Geneva, the small flag at LHCb's point, the LHCb logo top left (its mirrored „LHCb“ is the logo's own CP mirror). „mano greitintuvas“ comes up beside the LHC ring as it appears, „jūsų greitintuvas“ beside the FCC ring once it is whole (deck text, <ClipCue>, following the rings as the camera settles); the licence credits are on slide 20, kept but not shown (the owner, 23 Oct). The music: Scott Buckley's „Starfire“, as Innoday's close, low under the speech; it goes on over the held frame.

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

---
space: { at: [595.5, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 0, dim: 0.7 }   # the credits page: the world dimmed far under the list
---

<Grains :set="{ pq: 3, route: 14, th2: 0, th1: 0, oc: 0, jp: 0, jx: 0, lietuva: 0, vault: 0, sun: 0, vilnius: 0, accel: 0 }" />
<Soundtrack src="audio/starfire_finale.m4a" tail="audio/starfire_finale.m4a" :level="0.33" keys />

<div class="credits-page">

Vaizdai ir duomenys: CERN (CERN iš oro, LHC tunelis CERN-FOOTAGE-2022-013-001, dipolis CERN-VIDEO-2019-050-008) · CMS susidūrimas: CERN atvirieji duomenys, įrašas 300 (CC0) · LHCb filmukas: LHCb kolaboracija · LHCb modelis: © CERN LHCb kolaboracijos naudai (GPL-3.0), HSF Phoenix (Apache-2.0); žmogaus modelis: Blender Human Base Meshes (CC0) · LHCb susidūrimas: CERN atvirieji duomenys · Ωc⁰ spektras: LHCb, Phys. Rev. Lett. 118, 182001 (2017), CC BY 4.0 · Jutiklinis ekranas: B. Stumpe, nuotr. S. E. Bennett / CERN, CC BY 4.0 · Pirmoji svetainė: A. Rao / CERN · Priartinimas: autoriaus SpaceEngine montažas; Žemė: Google Earth (Landsat / Copernicus; Airbus, CNES / Airbus, Maxar Technologies) · Kosminis tinklas: NCSA Advanced Visualization Lab („Cosmic Bubble Bath“, NSF) · CMB žemėlapis: ESA ir Planck kolaboracija, CC BY-NC 3.0 IGO (pakeistas) · Žemėlapiai: Natural Earth (viešasis domenas); © OpenStreetMap bendraautoriai (ODbL) · SciFi modulis ir pabaigos įrašas: Innoday (Blender; LHCb geometrija) · Muzika: Scott Buckley, „Starfire“ (scottbuckley.com.au), CC BY 4.0, pakeista

</div>

<!--
Kalbėtojui: šio puslapio nerodyti – pranešimas baigiasi 19-oje skaidrėje. Jis laikomas dėl licencijų reikalaujamų nuorodų (savininkas, 2026 10 23: „credits all go to slide 20 which I will make available but not show“); lieka žiniatinklio versijoje ir PDF. Muzika čia tęsiasi, jei puslapis būtų atvertas.
The zoom music's own credit is unknown (its title and licence were never filed): add it here once known. Everything listed follows credits.txt.

(~0 min)
-->

