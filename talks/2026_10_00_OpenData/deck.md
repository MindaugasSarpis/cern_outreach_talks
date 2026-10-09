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
  toolkit pin slidev-videos 12aa015).
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
  Date placeholder 2026_10_00.
layout: cover
space:
  at: wide
  dim: 0.25
---

<img class="print-still" src="/stills/01.jpg" alt="" />

<Grains :set="{ team: 0 }" />

# Atvirųjų duomenų apdovanojimo nominantai

# Atveriame <span class="nt">LHCb</span> duomenis

<div class="mt-md">Mindaugas Šarpis · <span class="nt">LHCb</span> Vilnius · Vilniaus universitetas</div>

<!--
Message: this talk is about the work we were nominated for, opening LHCb's data.

Sakyti: „Esu Mindaugas Šarpis, vadovauju LHCb Vilnius grupei – Vilniaus
universiteto komandai CERN LHCb eksperimente. Mus nominavo už darbą su
atviraisiais duomenimis.
Pradėkime nuo detektoriaus.“

Then press → for the clip; the cover gives it time to buffer. Before starting,
press a key or click once so the low hum can play (browsers start sound only
after a gesture).

(~0.3 min)
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
space: { at: [24.4, -0.6, 5.9], dist: 5.2, yaw: 8, pitch: 30, sway: 10, dim: 0.15 }
---

<img class="print-still" src="/stills/03.jpg" alt="" />

<Grains :set="{ collision: 1, scale: [], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout event">

<p class="kicker">Vienas susidūrimas · 2012 m.</p>

# Z → μμ

<p class="line">Čia Z bozonas suskilo į du miuonus. Šį susidūrimą gali atsisiųsti kiekvienas.</p>

</div>

<!-- facts: lhcb-run3-readout-4tbs -->

<!--
Message: one real collision, from data anyone can download.

Sakyti: „Štai vienas tikras susidūrimas iš 2012 m. LHCb duomenų. Dvi auksinės
linijos – du miuonai. Į juos skilo Z bozonas, beveik šimtą kartų sunkesnis už
protoną. Kitos linijos – kitos tame susidūrime susidariusios dalelės. Šį susidūrimą šiandien
gali atsisiųsti bet kas, o mūsų studentai Vilniuje tyrė būtent tokius
Z bozonus.“

The event: CERN Open Data record 24506 (LHCb 2012 Beam4000GeV MagDown EW
Stream Stripping21), file 00041836_00076811_1.ew.dst, entry 3795: run 133488,
event 49420610, recorded 1 December 2012, selected by StrippingZ02MuMuLine.
Two well-measured long tracks (χ²/ndof 0.73 and 0.92) with a mass of 92,5 GeV;
one primary vertex, 42 tracks. Drawn: 76 of its 95 reconstructed tracks (ghost
probability ≤ 0,4), each from its own track state, bent once at the magnet by
the measured momentum; the muons run on to the muon stations. Drawn with the
transverse directions stretched 3× (as event displays are): LHCb's tracks run
within a few degrees of the beam. Read from the
public DST with uproot and LHCb's packing scales (cross-checked: the mass from
the decoded tracks equals the stored candidate mass).
Background, if asked: LHCb sees up to 40 million bunch crossings a second; since
2022 it reads out about 4 TB a second and software chooses what to keep.

Šaltiniai: opendata.cern.ch/record/24506; R. Aaij et al. (LHCb), EPJ Web Conf.
251 (2021) 04009.

(~0.5 min)
-->

---
space: { at: [23.02, 0.1, 6.0], dist: 0.76, yaw: -13.7, pitch: 19.1, dim: 0.2 }
---

<img class="print-still" src="/stills/04.jpg" alt="" />

<Grains :set="{ collision: 2, scale: [], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" :later="{ scale: [[0], 3.0], collision: [0, 4.8] }" />

<div class="readout later">

<p class="kicker">Mastelis</p>

<div class="big"><Count name="unit" :from="1" :to="1" /><span class="unit">TB</span></div>

<p class="line">Viena sfera – vienas terabaitas, keliasdešimt milijonų tokių susidūrimų.</p>

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

<img class="print-still" src="/stills/05.jpg" alt="" />


<Grains :set="{ scale: [0, 1], 'scale:labels': 1, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout late">

<p class="kicker">Atverti 2023 m. gruodį</p>

<div class="big"><Count name="open" :from="0" :to="800" :delay="2400" /><span class="unit">TB</span></div>

<p class="line">Visi 2011–2012 m. LHCb protonų susidūrimų duomenys. Duomenis paskelbti parengė Mindaugas Šarpis.</p>

</div>

<!-- facts: lhcb-open-data-first-release-2022, lhcb-run1-volume-sources-differ, lhcb-run1-release-sarpis, sarpis-phd-bonn-2023, lhcb-open-data-coordinator-2026 -->

<!--
Message: in 2023 all of LHCb's first run became public, and I prepared it.

Sakyti: „Pirmą kartą didelę dalį duomenų, 200 terabaitų, LHCb
paskelbė 2022 m. gruodį. 2023 m. gruodį viešai paskelbti visi 2011–2012 m. protonų
susidūrimų duomenys, apie 800 terabaitų. Šį rinkinį paskelbti parengiau
aš, tuo metu rašydamas disertaciją Bonoje. Darbas truko beveik dvejus metus:
teko nukopijuoti ir patikrinti kiekvieną iš daugiau nei šimto tūkstančių
failų. Nuo šių metų rugpjūčio koordinuoju visos kolaboracijos analizių
išsaugojimo ir atvirųjų duomenų darbus.“

Šaltiniai: opendata.cern.ch, „LHCb releases entire Run 1 dataset“ (2023-12-20);
VU Fizikos fakulteto naujienos; M. Šarpis, PhD thesis, University of Bonn
(2023); VU naujienos (2026-07-30).

(~0.5 min)
-->

---
space: { at: [11.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, flight: 5, dim: 0.15 }
---

<img class="print-still" src="/stills/06.jpg" alt="" />

<Grains :set="{ scale: [0, 1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout last">

<p class="kicker">Atverti 2026 m.</p>

<div class="big"><Count name="open" :from="800" :to="4000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="line">Dalis 2015–2018 m. duomenų. Iš viso penkis kartus daugiau nei 2023 m.</p>

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

<img class="print-still" src="/stills/07.jpg" alt="" />

<Grains :set="{ scale: [0, 1, 2, 3], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout blue late">

<p class="kicker"><span class="nt">LHCb</span> nuo 2010 m.</p>

<div class="big"><Count name="lhcb" :from="0" :to="100000" :delay="2400" /><span class="unit">TB</span></div>

<p class="line">Iš viso daugiau nei 100 PB. Auksinė dalis priekyje jau atvira.</p>

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
space: { at: [-2, 9, -18], dist: 60.1, yaw: -1.9, pitch: 2.9, sway: 4, flight: 5, dim: 0.15 }
---

<img class="print-still" src="/stills/08.jpg" alt="" />

<Grains :set="{ scale: [0, 1, 2, 3, 4], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout steel last">

<p class="kicker">Visi LHC eksperimentai, 2025 m. gruodis</p>

<div class="big"><Count name="lhc" :from="0" :to="1000000" :delay="5200" :ms="900" /><span class="unit">TB</span></div>

<p class="line">Vienas eksabaitas – maždaug dešimt kartų daugiau nei LHCb.</p>

</div>

<!-- facts: cern-exabyte, cern-second-500pb-run3 -->

<!--
Message: the whole LHC has stored ten times as much again.

Sakyti: „O visų LHC eksperimentų duomenų 2025 m. gruodį jau buvo sukaupta
eksabaitas – milijonas terabaitų, maždaug dešimt kartų daugiau nei LHCb. Tokia
nešiojamųjų kompiuterių krūva būtų dvidešimties kilometrų aukščio, daugiau nei
dukart aukštesnė už Everestą. Didžioji šių duomenų dalis įrašyta į maždaug
60 tūkstančių magnetinių juostų.“

Scale, worked out: a laptop about 2 cm thick holding 1 TB; 10⁶ × 2 cm = 20 km
(Everest 8,85 km); LHCb's 100 PB = 10⁵ laptops = 2 km. Why the piles on screen
look only about twice as wide: volume grows as width cubed, so ten times the
spheres is 10^(1/3) ≈ 2,15 times the width. (If a terabyte were a 1 cm marble,
close-packed, the exabyte would be a heap only 1,1 m across, which is why the
talk uses the stack of laptops.)

Šaltiniai: home.cern, „CERN hits one exabyte of stored experimental data from
the LHC“ (2025-12-17).

(~0.4 min)
-->

---
space: { at: [16, 6, -2], dist: 32, yaw: 0, pitch: 1.8, dim: 0.15 }
---

<img class="print-still" src="/stills/09.jpg" alt="" />

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, collision: 0, world: 8, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="readout late">

<p class="kicker">Naudotojai</p>

<div class="big"><Count name="asks" :from="0" :to="20" :delay="2400" /></div>

<p class="line">užklausų LHCb duomenų atrankos paslaugai per 2026 m. pirmąjį pusmetį, daugiausia teoretikų.</p>

</div>

<!-- facts: lhcb-ntupling-requests-2026, lhcb-opendata-brown-2026, ntuple-wizard-paper-2023 -->

<!--
Message: people outside LHCb already use the open data.

Sakyti: „Visų keturių petabaitų siųstis nereikia. Nurodai, kokio skilimo nori, ir
LHCb duomenų atrankos paslauga parenka tau reikalingus susidūrimus. Iki
liepos tokių užklausų buvo apie dvidešimt, daugiausia teoretikų. Rugsėjį du
Browno universiteto fizikai paskelbė tyrimą, atliktą su LHCb atviraisiais
duomenimis. Vienas šios paslaugos kūrėjų, Adamas Morrisas, dabar dirba
LHCb Vilnius grupėje.“

Šaltiniai: DPHEP Global Report 2026; arXiv:2609.09275; arXiv:2302.14235.

(~0.5 min)
-->

---
space: { at: [12.5, 2.5, 4], dist: 27, yaw: 12, pitch: 2.1, dim: 0.3 }
---

<img class="print-still" src="/stills/10.jpg" alt="" />

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 3, dominykas: 0, team: 0 }" />

# Naudojame Vilniuje

<ul class="points">
<li>Z → μμ: viena pirmųjų LHCb atvirųjų duomenų analizių (2024)</li>
<li>VU kursas: kiekvienas studentas dirba su atviraisiais duomenimis</li>
<li>Pirmoji <span class="nt">LHCb</span> meistriškumo klasė Lietuvoje (2025)</li>
</ul>

<!--
Message: in Vilnius we use the open data for research and for teaching.

Sakyti: „Atviruosius duomenis naudojame ir patys. 2024 m. studentai Vilniuje tyrė
Z bozonų skilimą į du miuonus – tai buvo viena pirmųjų LHCb atvirųjų
duomenų analizių. Kurse „Geriausios tyrimų ir duomenų analizės praktikos iš
CERN“ kiekvienas studentas dirba su tuo pačiu LHCb atvirųjų duomenų failu,
kuriame apie 92 tūkstančiai skilimo kandidatų. O 2025 m. studentai surengė pirmąją LHCb
meistriškumo klasę Lietuvoje – joje dalyvavo apie šimtas moksleivių ir studentų iš
Lietuvos ir Ukrainos.“

Background: the Z → μμ analysis (N. E. Eimutis, M. Ambrozas, M. Šarpis), Open
Readings, Vilnius, 2024-04-23…26. The course file: the D⁰ → K⁻π⁺ masterclass
sample, CERN Open Data record 401 (53 948 events, 91 583 candidates). The
masterclass: about 65 participants from Lithuania and 35 from Ukraine.

Šaltiniai: Open Readings 2024 tezių knyga, p. 75 (O7); CERN Open Data įrašas
401; VU kurso užduočių sąsiuvinis; LHCb Vilnius ataskaita, 2026 m. sausis.

(~0.5 min)
-->

---
space: { at: [11.5, 2.0, 1.5], dist: 20.8, yaw: 54.8, pitch: 2.8, dim: 1 }
---

<Grains :set="{ scale: [0, 1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="finds">
<div class="finds-text">

<p class="kicker">Ką <span class="nt">LHCb</span> rado savo duomenyse</p>

<div class="big">76</div>

<p class="line">iš 86 naujų hadronų, atrastų LHC eksperimentuose</p>

<ul class="chips">
<li><b>2015</b> Pentakvarkai, penkių kvarkų dalelės</li>
<li><b>2025</b> Materija ir antimaterija barionuose elgiasi skirtingai</li>
</ul>

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
trys siauros smailės. O 2025 m. LHCb pirmą kartą
pamatė, kad materija ir antimaterija barionuose – protono ir neutrono šeimoje –
elgiasi skirtingai.“

The slide is opaque, as the next one: two plots in a row, LHCb's and then a student's.

Šaltiniai: P. Koppenburg, naujų LHC hadronų sąrašas (86, iš jų 76 LHCb; paskutinis
įrašas 2026-09-21); LHCb, PRL 115 (2015) 072001; LHCb, PRL 122 (2019) 222001
(grafikas); LHCb, Nature 643 (2025) 1223.

(~0.6 min)
-->

---
space: { at: thesis, dim: 1 }
---

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, collision: 0, world: 0, vilnius: 0, dominykas: 0, team: 0 }" />

<div class="thesis-slide">
<div class="thesis-who">

<img class="portrait" src="/figures/people/dominykas-stonkus.jpg" alt="Dominykas Stonkus" />

<p class="kicker">Bakalauro darbas, VU, 2026</p>

<p class="name">Dominykas Stonkus</p>

<p class="line">Atviruosiuose 2012&nbsp;m. <span class="nt">LHCb</span> duomenyse jis rado pakilimą ten pat, kur LHCb 2015&nbsp;m. atrado pentakvarkus.</p>

</div>
<div class="thesis-plot">
<div class="plot-box">
<img src="/figures/thesis/jpsip-mass.png" alt="Dominyko Stonkaus bakalauro darbas: J/ψ p invariantinė masė, atėmus foną; pakilimas ties 4,4–4,5 GeV" />
<PeakRise :x="0.44" :y="0.29" :delay="1.4" :rise="0.2" :size="0.09" />
</div>
</div>
</div>

<!-- facts: lhcb-pentaquark-2015 -->

<!--
Message: a student here has found the pentaquark region again in public data.

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
repository.vu.lt/VU:ELABAETD308118793 (open access); LHCb, PRL 115 (2015) 072001.

(~0.6 min)
-->

---
space: { at: [53, 2.8, 160], dist: 27, yaw: 0, pitch: 3, dim: 0.2 }
---

<img class="print-still" src="/stills/13.jpg" alt="" />

<Grains :set="{ team: 1, collision: 0, world: 0, vilnius: 0, dominykas: 0 }" />

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
