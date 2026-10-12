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
  real LHC tunnel, on into the beam pipe, black, one real 2012 LHCb crossing in
  slow motion (237 tracks, the calorimeters' splashes), a low synthesised sound.
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
Pradėkime nuo detektoriaus.“

The standby: black, while the LHC tunnel clip buffers behind it. → starts the
opening; that key is also the gesture browsers ask for before any sound.

(~0.3 min)
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
One real collision in the black: two bunches of protons run in along the beam
pipe, cross, and the world nearly stops at the crossing while the camera keeps
moving round it; then it runs on fast as the debris flies out, hundreds of
particles bending in LHCb's magnet, stopping in the calorimeter in splashes of
energy, the muons running on. A low swell, a thump at the crossing, the boom as
it flies apart: quiet enough to talk over. → for the LHCb clip.

The event: one real crossing from LHCb's 2012 open data (CERN Open Data record
24506), drawn from its reconstructed tracks; components/lhc-opening/event.json
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

<Grains :set="{ vault: 1, collision: 2, scale: [], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" :later="{ scale: [[0], 3.0], collision: [0, 4.8] }" />

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


<Grains :set="{ vault: 1, scale: [0, 1], 'scale:labels': 1, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout late">

<div class="big"><Count name="open" :from="0" :to="800" :delay="2400" /><span class="unit">TB</span></div>

<p class="caption">Atverta 2023 m.</p>

</div>

<!-- facts: lhcb-open-data-first-release-2022, lhcb-run1-volume-sources-differ, lhcb-run1-release-sarpis, sarpis-phd-bonn-2023 -->

<!--
Message: in 2023 all of LHCb's first run became public, and I prepared it.

Sakyti: „Pirmą kartą didelę dalį duomenų, 200 terabaitų, LHCb
paskelbė 2022 m. gruodį. 2023 m. gruodį viešai paskelbti visi 2011–2012 m. protonų
susidūrimų duomenys, apie 800 terabaitų. Šį rinkinį paskelbti parengiau
aš, tuo metu rašydamas disertaciją Bonoje. Darbas truko beveik dvejus metus:
šimtus tūkstančių failų reikėjo nukopijuoti į atskirą saugyklą ir patikrinti.“

(The coordinator role is said on the Vilnius slide.)

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20);
VU Fizikos fakulteto naujienos; M. Šarpis, PhD thesis, University of Bonn
(2023).

(~0.4 min)
-->

---
space: { at: [11.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }
---

<Grains :set="{ vault: 1, scale: [0, 1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

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

<Grains :set="{ vault: 1, scale: [0, 1, 2, 3], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

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
aukštesnė už Everestą. Šie duomenys saugomi magnetinėse juostose, tokiose
saugyklose kaip ši.“

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
space: { at: [20, 0.1, 0], dist: 36, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, sun: 1 }" />

<div class="readout"><p class="caption sun-caption">Naudotis gali kiekvienas</p></div>

<!-- facts: lhcb-ntupling-requests-2026, lhcb-opendata-brown-2026, ntuple-wizard-paper-2023 -->

<!--
Message: anyone can use the open data.

Motion: twenty streams leave the gold pile to every side, like a sun, and each
ends at a plot made from LHCb's open data, most with a fit: the masses of π⁰, D⁰,
J/ψ, K⁰S and Λ, the D⁰ and K⁰S lifetimes, the magnet's field from the bend of
the tracks, the beam spot and the luminous region, spectra and multiplicities.
Every one of them was made for this talk from two public files: CERN Open Data
record 401 (the D⁰ masterclass sample) and record 24506 (a 2012 EW-stream
DST), with the files' own numbers.

Sakyti: „Atviruosius duomenis naudotis gali kiekvienas. Visų keturių
petabaitų siųstis nereikia: nurodai, kokio skilimo nori, ir LHCb duomenų
atrankos paslauga parenka tau reikalingus susidūrimus. Šiuos grafikus
padarėme patys iš dviejų viešų failų. Rugsėjį du Browno universiteto fizikai
paskelbė tyrimą, atliktą su LHCb atviraisiais duomenimis.“

Background, if asked: more than 30 requests to the Ntupling Service between its
February release and 25 May 2026 (P. Nogga et al., CHEP 2026, slide 11); the
DPHEP Global Report 2026 counted about twenty, mostly from theorists. Adam
Morris (co-author of the service's paper) is said on the next slide.

Šaltiniai: DPHEP Global Report 2026; arXiv:2609.09275; arXiv:2302.14235.

(~0.4 min)
-->

---
space: { at: [20, 5.2, 6], dist: 22, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 10, dominykas: 0, team: 0, sun: 0 }" />

<div class="role">
<img class="portrait" src="/figures/people/mindaugas-sarpis.jpg" alt="Mindaugas Šarpis" />
<div>
<p class="name">Mindaugas Šarpis</p>
<p class="caption">LHCb atvirųjų duomenų koordinatorius</p>
</div>
</div>

<!-- facts: lhcb-open-data-coordinator-2026, lhcb-run1-release-sarpis, lhcb-ntupling-service-4pb, ntuple-wizard-paper-2023 -->

<!--
Message: open data is what we do, every day: we opened it, we serve it, we
research with it, we teach with it, we present it; and I now coordinate it for
the whole LHCb experiment.

Motion: eleven streams leave the gold pile, one to each thing we do with open
data, named in a word or two: the data (Run 1 opened, the selection service),
research (the Z → μμ analysis, a bachelor's thesis, reproducible analyses),
teaching (the course, the masterclass), where we presented it (Riga, Boston,
Kaunas). Bottom left: the role. (The VU open-science award 2025 is in the
details, off the screen until the owner says: see HANDOFF.)

Sakyti: „Atvirieji duomenys – mūsų kasdienybė. Nuo šių metų rugpjūčio 1 d.
esu viso LHCb eksperimento analizių išsaugojimo ir atvirųjų duomenų
koordinatorius: eksperimente dalyvauja 120 institucijų ir beveik 2 000
mokslininkų.
Pirmąjį visą Run 1 rinkinį paskelbti parengiau dar Bonoje. Adamas Morrisas, nuo
2025 m. rugsėjo dirbantis mūsų grupėje, – vienas iš straipsnio apie LHCb
duomenų atrankos paslaugą autorių; nuo vasario ši paslauga atvira visiems ir
iki gegužės sulaukė daugiau nei 30 užklausų.
2024 m. Open Readings konferencijoje pristatėme Z bozono tyrimą su LHCb
atviraisiais duomenimis – vieną pirmųjų LHCb atvirųjų duomenų analizių.
Dominykas Stonkus bakalauro darbe su atviraisiais duomenimis atkartojo
pentakvarkų analizės bruožus – apie tai netrukus.
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
- The service: arXiv:2504.00610 (11 authors, Morris among them, then at
  CERN); released February 2026; „> 30 requests since Feb release“ (P. Nogga
  et al., CHEP 2026, 25 May 2026, slide 11). Say co-author, not builder.
- Z → μμ: Open Readings 2024 book of abstracts, p. 75 (N. E. Eimutis, M.
  Ambrozas, M. Šarpis): „one of the initial analyses of LHCb data posted on
  the Open Data portal“. The sources do not call the authors students.
- The thesis: D. Stonkus, VU, 2026; 38,3 TB of open data filtered.
- Reproducibility: CHEP 2024, 22 October 2024: modular analyses under a
  workflow manager (Snakemake), FAIR; the pentaquark search as the example.
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
  applications), for preparing and publishing the Run 1 set; also the
  Mantvydas Juozapavičius named scholarship (VU Foundation, 19 December 2025).

Šaltiniai: VU naujienos 2026-07-30 ir 2025-01-07; LRT 2026-07-30; M. Šarpis,
disertacija, Bonos universitetas, 2023; arXiv:2504.00610; P. Nogga ir kt., CHEP
2026; Open Readings 2024 tezių knyga, p. 75; D. Stonkus, bakalauro darbas, VU,
2026; CHEP 2024 (Indico 1338689); VU kurso svetainė ir užduočių sąsiuvinis;
Indico 1489482 ir 1648092; CBC 2023 (Indico 1288731); LHCP 2024 (Indico
1253590); 46-osios LNFK tezės, p. 32; VU FF naujienos 3303 ir 3443.

(~1.0 min)
-->

---
space: { at: [23.0, 1.0, 11.0], dist: 6.8, yaw: 0, pitch: 6, dim: 0.1 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, course: 1, d0: 1 }" />

<div class="readout">

<div class="big"><StageCount for="d0" :to="91583" lang="lt" /><span class="unit">kandidatai</span></div>

</div>

<!--
Message: the course's students work on this very file.

Motion: a stream leaves the gold pile for the course, and the course file's
D⁰ → K⁻π⁺ candidates stack into their mass histogram, one grain each, in the
order they come out of the file: the D⁰ peak grows out of the background as the
count runs to 91 583. (The photo of the course room comes when the owner sends
it.)

Sakyti: „Štai tas kurso failas. Kiekvienas grūdelis – vienas D⁰ mezono
kandidatas, ir iš fono išauga D⁰ smailė.“

The file: CERN Open Data record 401 (MasterclassData.root, DecayTree, D0_MM):
91 583 candidates; drawn 90 120 of them in 1816–1914 MeV, 56 bins; the peak
at 1864.5 MeV, σ 7.7 MeV.

Šaltiniai: CERN Open Data record 401; VU kurso užduočių sąsiuvinis.

(~0.3 min)
-->

---
space: { at: [11.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, dim: 1 }
---

<Grains :set="{ vault: 0, scale: [0, 1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0, course: 0, d0: 0 }" />

<div class="finds">
<div class="finds-text">

<div class="big">76<span class="unit">/ 86 hadronų</span></div>

</div>
<div class="finds-plot"><img src="/figures/pentaquarks_2019.png" alt="LHCb 2019 m.: trys siauros pentakvarkų smailės, Pc(4312), Pc(4440), Pc(4457), su pritaikyta kreive" /></div>
</div>

<!-- facts: lhcb-hadron-count, lhcb-pentaquark-2015, lhcb-pentaquark-2019, lhcb-cpv-baryons-2025 -->

<!--
Message: LHCb finds new particles in this data, so the data is worth opening.

Sakyti: „Šiuose duomenyse LHCb randa naujų dalelių. LHC eksperimentai atrado
86 naujus hadronus – iš kvarkų sudarytas daleles. 76 iš jų rado LHCb. 2015 m. LHCb atrado
pentakvarkus, penkių kvarkų daleles, numatytas dar 1964 m. Dešinėje – 2019 m.
matavimas su devynis kartus didesniu duomenų kiekiu, kuriame matyti
trys siauros smailės.“

If time allows: in 2025 LHCb saw for the first time that matter and antimatter
behave differently in baryons, the proton's and neutron's family (Nature 643
(2025) 1223).

The slide is opaque, as the next one: two plots in a row, LHCb's and then a student's.

Šaltiniai: P. Koppenburg, naujų LHC hadronų sąrašas (86, iš jų 76 LHCb; paskutinis
įrašas 2026-09-21); LHCb, PRL 115 (2015) 072001; LHCb, PRL 122 (2019) 222001
(grafikas); LHCb, Nature 643 (2025) 1223.

(~0.45 min)
-->

---
space: { at: [10.0, -44.5, 24], dist: 12.5, yaw: 0, pitch: 3, dim: 0.05 }
---

<Grains :set="{ vault: 0, scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 1, team: 0, course: 0, d0: 0, peak: 1, sun: 0 }" />

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
atrado pentakvarkus. Tai kokybinis atkartojimas: įrodyti, kad tai naujos
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

<Grains :set="{ vault: 0, team: 1, collision: 0, world: 0, vilnius: 0, dominykas: 0, course: 0, d0: 0, peak: 0, sun: 0 }" />

<div class="thanks">Ačiū</div>

<!--
Message: this is the work we were nominated for, and the people who did it.

Sakyti: „Mus nominavo už tai, kad parengėme LHCb duomenis paskelbti ir patys juos
naudojame tyrimams ir mokymui Vilniuje.
Duomenis gali atsisiųsti bet kas, svetainėje opendata.cern.ch. Ačiū jums ir ačiū visai mūsų grupei.“

The camera flies back to the collisions where the data begin, and the group
gathers beside them: fifteen portraits made of the same gold grains of data.
Then the ring starts to move like a beam of particles: the portraits run
round it, push one another away and bump, and where two meet a few gold
grains fly out. The names stay off the screen: Mindaugas Šarpis, Ramūnas
Aleksiejūnas, Oleg Kravcov, Adam Morris, Augustas Vaitkevičius, Rūta Racz,
Šarūnas Jacevičius, Margarita Biveinytė, Sophia Pennuttis, Mikas Paulius
Iršėnas, Neilas Beniušis, Karolina German, Eliza Holvoet, Meda Paulavičiūtė,
Dominykas Stonkus.

Photos: LHCb Vilnius group members, used with permission (as on
lhcb-vilnius.web.cern.ch/people.html); cropped square, metadata removed.

Timing: about 6 minutes with the 39 s clip. For a hard 5 minutes, end the clip
after about 20 s, keep the finds slide to the 76 and its two lines, and say
only the course point on „Naudojame Vilniuje“.

(~0.3 min)
-->
