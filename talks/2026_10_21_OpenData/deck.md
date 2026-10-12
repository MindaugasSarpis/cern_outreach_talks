---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
lang: lt
duration: 6.5min
sources: notes
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-10-00-opendata
  fit: cover
  transition: dust
  dust: '#ffc05a'
  dustFrom: start           # the kick-off opens on white CG over black: the grains draw it, the clip plays from its first frame
stage:
  space: data/space.json
  palette: { base: blue, bg: '#000206' }   # a true black ground: the blue palette's navy read as haze
  sound: true
  options: { reach: 30, nebula: 0.12, dustGain: 1.0, exposure: 1.1, vignette: 0.7, grain: 0.012, aberration: 0, bloom: 0.42 }   # reach: the 1 EB pose stands far back (27 from the store); the rest: deep, crisp, not hazy
title: Atveriame LHCb duomenis
info: |
  In Lithuanian. LHCb Vilnius, nominated for an open data award: a 6½-minute
  talk told inside one world of grains (slidev-addon-stage, blue palette,
  toolkit pin slidev-videos v0.8.0).
  The opening (components/lhc-opening/, shared with Užsikrauk karjerai): the
  real LHC tunnel, on into the beam pipe, black, one real 2012 CMS crossing in
  slow motion (CERN Open Data record 300, run 195099, event 137440354: 290 tracks
  curling out to every side, the calorimeters' cells all round), a low
  synthesised sound.
  The line: the LHCb detector (3D clip); one real collision from LHCb open data
  (a 2012 Z → μμ event, its tracks drawn as grains); that collision shrinks into
  one grain among tens of millions, which pack into a sphere of one terabyte;
  the spheres grow into the open data (800 TB, 4 PB, gold), LHCb's 100 PB (blue)
  and the LHC's exabyte (steel), the piles standing on a floor of grains at
  different depths; what LHCb found; who uses the open data; Vilnius; a Vilnius
  bachelor's student; „Ačiū“ over the group, each member a portrait of grains.
  The talk's own forms are in setup/grains.js (`collision`, `lineup`, `streams`,
  `floor`, `portraits`); `<Grains>` sets their steps (`later` after a delay) and
  `<Count>` counts with them. On any station `c` builds the form again.
  Kick-off: lhcb.mp4, the LHCb detector in 3D with music, this talk's 39 s cut
  of the library clip (videos/manifest.toml). It arrives as dust and moves on
  by itself when it ends.
  The talk: 21 October 2026.
layout: cover
space:
  at: opening
  dim: 1
  ambient: 0
  hum: false
---

<Grains :set="{ vault: 0, team: 0 }" />

<!--
Message: this talk is about the work we were nominated for, opening LHCb's data.

Sakyti: „Esu Mindaugas Šarpis, vadovauju LHCb Vilnius grupei – Vilniaus
universiteto komandai CERN LHCb eksperimente. Mus nominavo už darbą su
atviraisiais duomenimis.
Pradėkime nuo CERN.“

The standby: black, while the CERN clip buffers behind it. → starts the
opening; that key is also the gesture browsers ask for before any sound.

(~0.3 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The way in: CERN from above, the library clip cern_overview_short.mp4 (11 s, no sound): from the Earth down to Geneva, then the LHC ring drawn over the fields with its four experiments named. It moves on by itself at its end, the camera pushing on into the ring (its right side, 0.72, 0.45 of the last frame), where the tunnel follows. -->
<VideoPlayer src="cern_overview_short.mp4" advance-on-end exit="push" exit-at="0.72,0.45" />

<!-- facts: lhc-geneva-27km-100m-four-experiments -->

<!--
Message: this is CERN, and its ring is the LHC.

Sakyti: „Tai CERN prie Ženevos. Po šiais laukais, apie 100 metrų gylyje,
yra 27 kilometrų žiedas – Didysis hadronų greitintuvas, LHC. Jame veikia
keturi dideli eksperimentai, vienas jų – LHCb.“

Let it run; at its end the camera pushes on into the ring and the tunnel clip
takes over (→ earlier).

Šaltiniai: home.cern, „The Large Hadron Collider“ (27 km ring, 100 m
underground, on the Franco-Swiss border near Geneva, four collision points:
ATLAS, CMS, ALICE, LHCb).

(~0.2 min)
-->

---
space: { at: opening, dim: 1, ambient: 0, hum: false }
---

<!-- The opening (components/lhc-opening/): the real LHC tunnel, CERN-FOOTAGE-2022-013-001, an 18 s cut (videos/manifest.toml). It moves on by itself at its end, into the beam pipe. -->
<VideoPlayer src="cern_footage_2022_013_001_1080p_lhc.mp4" advance-on-end :volume="0.5" exit="push" exit-at="0.45,0.53" />

<LhcOpening part="tunnel" />

<!--
The LHC itself: the real tunnel, 100 m under the border, the magnets on the right.
Let it run; at its end the camera goes on into the beam pipe (it moves on by
itself; → earlier). Its sound is the tunnel's own ventilation hum.

Source: CERN-FOOTAGE-2022-013-001 (CERN). Its 18 s are counted from the
manifest.
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

<!-- facts: cms-195099-137440354-record-300, cms-195099-8tev, cms-195099-290-drawn-tracks, cms-195099-19-vertices, cms-195099-m4l-127-gev, cms-solenoid-3p8-tesla -->

<!--
One real collision in the black: two bunches of protons run in along the beam
pipe, cross, every collision in the crossing flashes, and the world nearly stops
while the camera keeps moving round it; then the debris flies out to every side,
each charged particle curling on its own helix in CMS's 3.8 T magnet, its energy
lighting the calorimeters' cells all round, the two muons running on out through
the muon chambers. The camera pulls back with it and turns to the side of the
beam, so it settles balanced: the tracks in the middle, both ends' splashes
either side. A low swell, a thump at the crossing, the boom as it flies apart:
quiet enough to talk over. → for the LHCb clip.

Nothing needs saying here. If the room should hear that the event is CMS's (an
LHCb talk), half a line over the fly-out: „Taip atrodo vienas tikras
susidūrimas – šįkart CMS detektoriuje.“

On screen: „8 TeV“, the collision energy (2012: two 4 TeV beams), and „290
dalelių“, the tracks drawn: the charged particles CMS reconstructed that pass the
display's quality cut. It is one bunch crossing with 19 proton–proton collisions
in it; only about thirty of the 290 come from the Higgs candidate's own collision
(27, giving each track to the nearest collision along the beam: the drawing's
count, not CMS's own track–vertex association).

The event: CMS, run 195099, lumi section 115, event 137440354, recorded 27 May
2012 at 23:35:47 UTC, √s = 8 TeV. A Higgs-boson candidate (H → ZZ → 2e2μ, the
four leptons' mass 127 GeV) that CMS released for education: CERN Open Data
record 300 (DOI 10.7483/OPENDATA.CMS.N9MJ.QEEC, CC0), file 4lepton.ig; the
open-data H → 4ℓ example (record 5200) picks the same event. A CMS event, not an
LHCb one, because CMS surrounds the collision and its debris flies out to every
side (the owner's choice). Drawn from its own reconstruction: each track's helix
from its momentum, direction and charge, bright as far as its last measured hit
and a little on (towards the calorimeter), fading after; the calorimeter hits in
their cells; the muons along their chambers. components/lhc-opening/event-cms.json
has its provenance.

(~0.2 min)
-->

---
space: { at: wide }
---

<!-- Kick-off: the LHCb detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release videos-2026-10-00-opendata. It condenses out of the dust and moves on by itself when it ends. -->
<VideoPlayer src="lhcb.mp4" advance-on-end />

<!--
Message: this is LHCb.

Let the clip play (39 s; its time is counted from the manifest). It ends by
itself as the music fades (`advance-on-end`); → moves on earlier. Near the end,
over the music, at most this:

Sakyti: „Tai LHCb. Detektorius sveria 5 600 tonų ir stovi šimto metrų gylyje
prie Ženevos. Vilniaus universitetas – LHCb kolaboracijos narys nuo 2024 m.“

`p` pauses; `+` and `-` set the volume for the rest of the talk.
-->

---
space: { at: [23.02, 0.1, 6.0], dist: 0.76, yaw: -13.7, pitch: 19.1, dim: 0.2 }
---

<Grains :set="{ vault: 1, collision: 2, scale: [], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 0 }" :later="{ scale: [[0], 3.0], collision: [0, 4.8] }" />

<div class="readout later">

<div class="big"><Count name="unit" :from="1" :to="1" /><span class="unit">TB</span></div>

<p class="caption">Dešimtys milijonų susidūrimų</p>

</div>

<!-- facts: lhcb-event-sizes-2024 -->

<!--
Message: a sphere of one terabyte is made of tens of millions of collisions.

Motion first, then the point: the event shrinks into one grain among many, the
grains pack into a ball, the metal sphere takes their place (3 s), and the
text rises at 4 s.

Sakyti: „Vienas toks įrašytas susidūrimas užima kelias dešimtis kilobaitų.
Keliasdešimt milijonų tokių susidūrimų sudaro vieną terabaitą, maždaug
nešiojamojo kompiuterio diską. Toliau kiekviena sfera – vienas terabaitas. Sferos lieka tokio pat dydžio,
tolsta kamera.“

Background: LHCb's average stored event in 2024 was 33,8 kB (Full stream, after
Sprucing) and about 10 kB (Turbo), so a terabyte holds about 30 to 100 million
of them.

Šaltiniai: LHCb Sprucing paper, arXiv:2506.20309 (2024 event sizes).

(~0.4 min)
-->

---
space: { at: [12.5, 1.4, 5.0], dist: 13.8, yaw: 73, pitch: 7.5, dim: 0.15 }
---


<Grains :set="{ vault: 1, scale: [0, 1], 'scale:labels': 1, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 0 }" />

<div class="readout late">

<div class="big"><Count name="open" :from="0" :to="800" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Atverta 2023 m.</p>

<p class="who"><span>Mindaugas Šarpis</span> · VU atvirojo mokslo apdovanojimas, 2025</p>

</div>

<!-- facts: lhcb-open-data-first-release-2022, lhcb-run1-volume-sources-differ, lhcb-run1-release-sarpis, lhcb-run1-release-sarpis-lrt-2025, sarpis-phd-bonn-2023, sarpis-interview-run1-1-5-years, vu-open-science-award-2025-run1, vu-open-science-award-2025-prize-dec -->

<!--
Message: in 2023 all of LHCb's first run became public; I was responsible for
preparing and publishing it, and was given VU's open-science award for it.

On screen, small under the caption: the name and the award (the owner,
2026-10-12).

Sakyti: „Pirmą kartą didelę dalį duomenų, 200 terabaitų, LHCb
paskelbė 2022 m. gruodį. 2023 m. gruodį viešai paskelbti visi 2011–2012 m. protonų
susidūrimų duomenys, apie 800 terabaitų. Už šio rinkinio parengimą ir
paskelbimą buvau atsakingas aš, tuo metu rašydamas disertaciją Bonoje. Daugiau
nei šimtą tūkstančių failų reikėjo surasti, patikrinti, nukopijuoti į atskirą
saugyklą ir aprašyti; net automatizavus tai truko apie pusantrų metų. Už šį
darbą pernai gavau Vilniaus universiteto apdovanojimą už reikšmingą indėlį į
atvirąjį mokslą.“

The words: the sources say „buvo atsakingas už … parengimą ir paskelbimą“ (VU
Library, 2025-10-28; VU FF and LRT, 2025-01-08: „paruošimą ir techninį jų
išleidimo įgyvendinimą“); none says „vadovavo“, so „buvau atsakingas“, not
„vadovavau“. The award: VU's competition for significant contribution to open
science, 2025 (its second), category „Atvirojo mokslo poveikis“, 14
applications; winners announced 22 October 2025, the prize handed over 18
December 2025. The year and a half and the 100 000 files: the owner's VU
Library interview (2026-03-05).

(The coordinator role is said on the Vilnius slide.)

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20);
VU bibliotekos naujienos 2025-10-28 ir 2026-03-05 (interviu); VU FF naujienos
3443; LRT 2025-01-08; M. Šarpis, PhD thesis, University of Bonn (2023).

(~0.4 min)
-->

---
space: { at: [11.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }
---

<Grains :set="{ vault: 1, scale: [0, 1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 0 }" />

<div class="readout last">

<div class="big"><Count name="open" :from="800" :to="4000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="caption">Atvirieji LHCb duomenys</p>

</div>

<!-- facts: lhcb-ntupling-service-4pb -->

<!--
Message: since 2026 more than four petabytes are open.

Sakyti: „Šiais metais atverta ir dalis 2015–2018 m. duomenų. Kartu su ankstesniais
tai daugiau nei keturi tūkstančiai terabaitų, arba keturi petabaitai.“

Šaltiniai: LHCb outreach, 2026-03-03 („over 4 PB of data to explore“); CERN Open
Data portalas, 2026-02-22.

(~0.3 min)
-->

---
space: { at: [3.5, 6.5, -7], dist: 65, yaw: 21.8, pitch: 7.1, sway: 4, dim: 0.15 }
---

<Grains :set="{ vault: 1, scale: [0, 1, 2, 3], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 0 }" />

<div class="readout blue late">

<div class="big"><Count name="lhcb" :from="0" :to="100000" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Visi LHCb duomenys</p>

</div>

<!-- facts: lhcb-data-100pb, lhcb-open-data-policy -->

<!--
Message: open data is the gold part in front of LHCb's whole 100 PB.

Sakyti: „Tai visi LHCb nuo 2010 m. surinkti duomenys, daugiau nei šimtas
petabaitų, arba šimtas tūkstančių sferų. Jei kiekvieną terabaitą laikytume
viename nešiojamajame kompiuteryje, tokių kompiuterių krūva būtų dviejų
kilometrų aukščio. Kasmet prisideda dar keliasdešimt
petabaitų. Auksinė
dalis priekyje jau atvira. Pusę kiekvieno etapo duomenų LHCb atveria praėjus
penkeriems metams nuo jo pabaigos, o visus – po dešimties.“

Šaltiniai: B. Couturier, ISGC 2025 („Since it began operations in 2010, the
experiment has collected more than 100 PB of data … now records tens of PB of
data per year“); LHCb, arXiv:2504.00610 (atvirųjų duomenų politika).

(~0.5 min)
-->

---
space: { at: [-7, 11, -27], dist: 78, yaw: -2, pitch: 5, sway: 4, flight: 5, dim: 0.15 }
---

<Grains :set="{ vault: 1, scale: [0, 1, 2, 3, 4], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 0 }" />

<div class="readout steel last">

<div class="big"><Count name="lhc" :from="0" :to="1300000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="caption">CERN mokslo duomenys</p>

</div>

<!-- facts: cern-physics-data-tape-1p3eb, cern-exabyte -->

<!--
Message: CERN keeps thirteen times as much again.

Motion: thirteen piles the size of LHCb's stand behind it and merge into one.

Sakyti: „O visų CERN eksperimentų fizikos duomenų CERN jau saugo 1,3 milijono
terabaitų, arba 1,3 eksabaito – trylika tokių krūvų kaip LHCb. Tokia
nešiojamųjų kompiuterių krūva būtų 26 kilometrų aukščio, beveik triskart
aukštesnė už Everestą. Šie duomenys saugomi magnetinėse juostose.“

Scale, worked out: a laptop about 2 cm thick holding 1 TB; 1,3 × 10⁶ × 2 cm =
26 km (Everest 8,85 km); LHCb's 100 PB = 10⁵ laptops = 2 km. Why the merged
pile looks only about twice as wide as LHCb's: volume grows as width cubed, so
thirteen times the spheres is 13^(1/3) ≈ 2,35 times the width. The LHC alone
passed one exabyte in December 2025 (home.cern), mostly on about 60 000 tapes.

Šaltiniai: CERN Annual Progress Report 2025 (CERN/3980/Rev, 2026-06-10), p. 17
(„Total physics data on Tape … Amount of data stored: 1.30 EB“); home.cern,
„CERN hits one exabyte of stored experimental data from the LHC“ (2025-12-17).

(~0.4 min)
-->
---
space: { at: [20, -0.3, 0], dist: 36, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 1 }" />

<div class="readout"><p class="caption sun-caption">Naudotis gali kiekvienas</p></div>

<!-- facts: lhcb-ntupling-requests-2026, lhcb-opendata-brown-2026, ntuple-wizard-paper-2023 -->

<!--
Message: anyone can use the open data.

Motion: a sun turns slowly round the gold pile, in front of it and behind:
rays of grains leave the pile to every side, twenty of them ending at plots made
from LHCb's open data (the grains land on each plot's curves), and six at empty
places, clouds of gold waiting: room for the next uses. The plots, most with a
fit: the masses of π⁰, D⁰,
J/ψ, K⁰S and Λ, the D⁰ and K⁰S lifetimes, the magnet's field from the bend of
the tracks, the beam spot and the luminous region, spectra and multiplicities.
Every one of them was made for this talk from two public files: CERN Open Data
record 401 (the D⁰ masterclass sample) and record 24506 (a 2012 EW-stream
DST), with the files' own numbers.

Sakyti: „Atviruosius duomenis naudotis gali kiekvienas. Šiuos grafikus
padarėme patys iš dviejų viešų failų. Rugsėjį du Browno universiteto fizikai
paskelbė tyrimą, atliktą su LHCb atviraisiais duomenimis. O tuščios vietos
laukia naujų tyrimų – galbūt ir jūsų.“

Not said (the owner, 2026-10-12): the selection service („atrankos
paslauga“). Background, if asked: more than 30 requests to the Ntupling Service between its
February release and 25 May 2026 (P. Nogga et al., CHEP 2026, slide 11); the
DPHEP Global Report 2026 counted about twenty, mostly from theorists. Adam
Morris (co-author of the service's paper) is said on the next slide.

Šaltiniai: DPHEP Global Report 2026; arXiv:2609.09275; arXiv:2302.14235.

(~0.4 min)
-->

---
space: { at: [20, 5.2, 6], dist: 22, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 9, dominykas: 0, team: 0, sun: 0 }" />

<div class="role">
<img class="portrait" src="/figures/people/mindaugas-sarpis.jpg" alt="Mindaugas Šarpis" />
<div>
<p class="name">Mindaugas Šarpis</p>
<p class="caption">LHCb atvirųjų duomenų koordinatorius</p>
</div>
</div>

<!-- facts: lhcb-open-data-coordinator-2026, lhcb-collaboration-2026, fair-lt-randami-prieinami-saveikus, fair-wilkinson-2016, chep2024-sarpis-reproducibility, stonkus-bsc-2026, vu-bsc-2026-cms-open-data-spukas, or2024-eimutis-z-lhcb-open-data, lhcb-masterclass-vilnius-2026, cbc2023-lhcb-open-data-poster, lhcp2024-lhc-open-data-talk, lnfk46-lhcb-vilnius-open-data -->

<!--
Message: open data is what we do, every day: we opened it, we work by FAIR
and make analyses repeatable, students write their theses on it, we teach with
it, we present it; and I now coordinate it for the whole LHCb experiment.

Motion: nine streams leave the gold pile, one to each thing we do with open
data, named in a word or two: Run 1 opened, FAIR, repeatable analyses, master's
and bachelor's theses, the course, the masterclass, where we presented it (Riga,
Boston, Kaunas). Bottom left: the role. (The owner, 2026-10-12: FAIR, analysis
reproducibility and the theses in; the selection service and the Z → μμ
analysis out.)

Sakyti: „Atvirieji duomenys – mūsų kasdienybė. Nuo šių metų rugpjūčio 1 d.
esu viso LHCb eksperimento analizių išsaugojimo ir atvirųjų duomenų
koordinatorius; LHCb – beveik 2 000 mokslininkų.
Dirbame pagal FAIR principus: duomenys turi būti randami, prieinami, sąveikūs
ir pakartotinai panaudojami. Analizes rašome taip, kad kiekvieną jų
žingsnį, nuo duomenų iki rezultato, būtų galima atkartoti.
Su atviraisiais duomenimis studentai rašo magistro ir bakalauro darbus – vieną
jų netrukus pamatysite.
Kurse „Geriausios tyrimų ir duomenų analizės praktikos iš CERN“ studentai
dirba su tikru LHCb atvirųjų duomenų failu. Vilniuje jau dvejus metus
rengiame LHCb meistriškumo pamokas: 2025 m. kovą ir 2026 m. vasarį mokiniai
ir studentai patys matavo D⁰ mezono gyvavimo trukmę su tikrais LHCb
duomenimis.
Atviruosius duomenis pristatėme Rygoje, Bostone – LHC eksperimentų vardu –
ir Kaune.“

Details, if asked:
- The role: LHCb Analysis Preservation and Open Data Coordinator, from 1 August
  2026 (VU news, 30 July 2026; LRT). The work: preserving the analyses'
  automated recipes and their computing environment, so analyses can be
  continued and repeated; it matters for open data through example analyses.
- Run 1: the full set, about 800 TB, released 20 December 2023 (CERN); the
  first 200 TB on 9 December 2022. Prepared in Bonn, as the University of
  Bonn's commitment to LHCb, with CERN IT (thesis, ch. 6). CERN's release pages
  do not name individuals.
- FAIR and reproducibility: CHEP 2024, 22 October 2024: modular analyses under
  a workflow manager (Snakemake), for reproducibility and preservation under
  the FAIR principles; the pentaquark search as the example.
- FAIR in Lithuanian as VU writes it (the award's rules R-224 §5.3; the VU
  Senate's open-science guidelines, 2022): „randami, prieinami, sąveikūs ir
  pakartotinai panaudojami“. The principles: M. D. Wilkinson et al., Sci. Data
  3, 160018 (2016).
- The theses: on the owner's word (2026-10-12). In the public record so far:
  D. Stonkus, BSc, VU, 2026 (38,3 TB of open data filtered; the next slide); no
  master's thesis on LHCb open data is public yet. D. Špukas, BSc, VU, 2026,
  used CMS open data (supervisor M. Ambrozas). Do not call any thesis the first.
- Not said on this slide (the owner, 2026-10-12), only if asked: the selection
  service (arXiv:2504.00610, 11 authors, A. Morris among them; released
  February 2026; „> 30 requests since Feb release“, P. Nogga et al., CHEP 2026,
  slide 11; say co-author, not builder) and the Z → μμ analysis (Open Readings
  2024, p. 75: N. E. Eimutis, M. Ambrozas, M. Šarpis; a conference abstract,
  not a thesis).
- The course: VU Faculty of Physics, autumn 2026, 16 lectures; from seminar 5
  the students work on CERN Open Data record 401 (91 583 D⁰ → K⁻π⁺
  candidates).
- Masterclasses: 6 March 2025 (Indico 1489482) and 26 February 2026 (Indico
  1648092), the D⁰-lifetime exercise; organised by the VU Faculty of Physics'
  particle-physics outreach centre, funded by the Lithuanian Particle Physics
  Consortium.
- Presented: CBC 2023, Riga, 9 October 2023 (poster); LHCP 2024, Boston, 3
  June 2024, „LHC Open Data“ on behalf of the CERN experiments; 46th LNFK,
  Kaunas, 8 October 2025.
- VU open-science award 2025, category „Atvirojo mokslo poveikis“ (14
  applications), for preparing and publishing the Run 1 set (said on the 800 TB
  slide); also the Mantvydas Juozapavičius named scholarship (VU Foundation, 19
  December 2025).

Šaltiniai: VU naujienos 2026-07-30; LRT 2026-07-30 ir 2025-01-08; M. Šarpis,
disertacija, Bonos universitetas, 2023; arXiv:2504.00610; P. Nogga ir kt., CHEP
2026; Open Readings 2024 tezių knyga, p. 75; D. Stonkus, bakalauro darbas, VU,
2026; CHEP 2024 (Indico 1338689); VU kurso svetainė ir užduočių sąsiuvinis;
Indico 1489482 ir 1648092; CBC 2023 (Indico 1288731); LHCP 2024 (Indico
1253590); 46-osios LNFK tezės, p. 32; VU FF naujienos 3303 ir 3443.

(~1.0 min)
-->

---
space: { at: [10.0, -44.5, 24], dist: 12.5, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 1, team: 0, peak: 1, sun: 0 }" />

<div class="thesis-slide world">
<div class="thesis-who">

<img class="portrait" src="/figures/people/dominykas-stonkus.jpg" alt="Dominykas Stonkus" />

<p class="kicker">Bakalauro darbas, VU, 2026</p>

<p class="name">Dominykas Stonkus</p>

<p class="line">Atviruosiuose 2012 m. <span class="nt">LHCb</span> duomenyse jis rado pakilimą ten pat, kur LHCb 2015 m. atrado pentakvarkus.</p>

</div>
<div class="thesis-count"><StageCount for="peak" :to="16407" lang="lt" /><span class="unit">skilimai</span></div>
</div>

<!-- facts: lhcb-pentaquark-2015 -->

<!--
Message: a student here has found the pentaquark region again in public data.

PROTOTYPE (od-story-everyday, slide 9): the last stream, from the gold pile to
here, becomes his peak: his 16 407 Λb⁰ → J/ψ p K⁻ decays stack, one grain each,
into his m(J/ψ p) (thesis Fig. 17, sideband-subtracted, 80 bins of 15 MeV,
digitised from the figure: the bins sum to 16 387), and the pentaquark stands
over the peak. His plot as an image and his portrait are off this version.

Motion: the slide opens on his plot; 1,4 s later grains of gold rise out of
its peak and gather into a pentaquark above it.

Sakyti: „Mūsų studentas Dominykas Stonkus šiais metais
apgynė bakalauro darbą „Pentakvarkų atradimas iš naujo naudojant LHCb
atviruosius duomenis“. Jis paėmė atviruosius 2012 m. LHCb duomenis, atrinko apie
16 400 Λb⁰ skilimų į J/ψ, protoną ir kaoną. J/ψ ir protono poros masės
skirstinyje jis rado pakilimą ties 4,4–4,5 GeV – ten pat, kur LHCb 2015 m.
atrado pentakvarkus, daleles iš penkių kvarkų. Tai kokybinis atkartojimas: įrodyti, kad tai naujos
dalelės, reikėtų išsamios amplitudžių analizės.“

The figure: thesis Fig. 17 (right), the sideband-subtracted m(J/ψ p), 15 MeV
bins, 4000–5200 MeV, shown inverted (light on dark). The Λb⁰ fit (Fig. 14,
Gaussian): μ = 5624,01 ± 0,15 MeV, σ = 15,56 MeV, N_sig = 16 407 ± 162,
χ²/ndf = 1,09. Data: LHCb 2012 open data, both magnet polarities. Supervisor:
M. Šarpis; approved for defence 2026-05-18.
Do not say „pirmasis atvirųjų duomenų bakalauro darbas“, nor that he observed
pentaquarks: the thesis itself calls it a qualitative reproduction.

Šaltiniai: D. Stonkus, „Pentakvarkų atradimas iš naujo naudojant LHCb
atviruosius duomenis“, bakalauro darbas, VU, 2026,
epublications.vu.lt/object/elaba:308118793/308118793.pdf (open access); LHCb, PRL 115 (2015) 072001.

(~0.6 min)
-->

---
space: { at: [53, 2.8, 160], dist: 27, yaw: 0, pitch: 3, dim: 0.2 }
---

<Grains :set="{ vault: 0, team: 1, collision: 0, world: 0, vilnius: 0, dominykas: 0, peak: 0, sun: 0 }" />

<div class="thanks">Ačiū</div>

<!--
Message: this is the work we were nominated for, and the people who did it.

Sakyti: „Mus nominavo už tai, kad parengėme LHCb duomenis paskelbti ir patys juos
naudojame tyrimams ir mokymui Vilniuje.
Duomenis gali atsisiųsti bet kas, svetainėje opendata.cern.ch. Ačiū jums ir ačiū visai mūsų grupei.“

The camera flies back to the collisions where the data begin, and the group
gathers beside them: fifteen portraits made of the same gold grains of data.
Then the ring starts to move like a beam of particles: the portraits run
round it, push one another away and bump. Once the camera has landed a fine
gold beam is laid round the ring, through every face: it parts round each
portrait and closes behind it, and where two bump it is thrown out and a few
gold tracks curl away from the contact. The names stay off the screen:
Mindaugas Šarpis, Ramūnas Aleksiejūnas, Oleg Kravcov, Adam Morris, Augustas
Vaitkevičius, Rūta Racz, Šarūnas Jacevičius, Margarita Biveinytė, Sophia
Pennuttis, Mikas Paulius Iršėnas, Neilas Beniušis, Karolina German, Eliza
Holvoet, Meda Paulavičiūtė, Dominykas Stonkus.

Photos: LHCb Vilnius group members, used with permission (as on
lhcb-vilnius.web.cern.ch/people.html); cropped square, metadata removed.

Timing: about 6 minutes with the 39 s clip. For a hard 5 minutes, end the clip
after about 20 s and on the Vilnius slide say only the role, FAIR and the
masterclass.

(~0.3 min)
-->
