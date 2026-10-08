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
  release: videos-2026-10-00-opendata
  fit: cover
  transition: dust
  dust: '#ffc05a'
  dustFrom: start           # the kick-off opens on white CG over black: the grains draw it, the clip plays from its first frame
stage:
  space: data/space.json
  palette: { base: blue, bg: '#000206' }   # a true black ground: the blue palette's navy read as haze
  sound: true
  options: { reach: 20, nebula: 0.12, dustGain: 1.0, exposure: 1.1, vignette: 0.7, grain: 0.012, aberration: 0, bloom: 0.42 }   # reach: the 1 EB pose stands far back; the rest: deep, crisp, not hazy
title: Opening LHCb's data
info: |
  LHCb Vilnius, nominated for an open data award: a 6½-minute talk told inside
  one world of grains (slidev-addon-stage, blue palette, pinned to the
  slidev-videos feat/effects-v2 commit 640eaa5). The story: what LHCb is,
  how much data it takes, what it finds, the LHC's exabyte, then what is
  open and who uses it. One sphere is one terabyte: piles of the same metal
  sphere stand side by side (1 TB; open data in gold, 800 TB and 4 PB;
  LHCb's 100 PB in blue; the LHC's 1 EB in steel) and keep their size as the
  camera pulls back; streams of grains carry the open data to its users. The
  talk's own forms are setup/grains.js (`lineup`, `streams`); `<Grains>` sets
  their step, `<Count>` counts with them. On any station `c` builds it again.
  Kick-off: lhcb.mp4, the LHCb detector in 3D with music, this talk's 39 s
  cut of the library clip (videos/manifest.toml), arrives and leaves as dust;
  its colours come from public/video-frames/.
  Date placeholder 2026_10_00.
layout: cover
space:
  at: wide
---

# Open data award · nominee

# Opening <span class="nt">LHCb</span>'s data

## From a detector at CERN to a bachelor's thesis in Vilnius

<div class="mt-md">Mindaugas Šarpis · <span class="nt">LHCb</span> Vilnius · Vilnius University</div>

<!--
Speaker (~0.4 min). Spoken: "I'm Mindaugas Šarpis. I lead LHCb Vilnius,
Vilnius University's group in the LHCb experiment at CERN. We were nominated
for our work on open data; this is that work, in a few minutes. It starts at
the detector." Then → for the LHCb clip (the cover gives it a head start to
buffer).
The world: behind the title, the LHC. Two bunches of protons run round
against each other and meet twice a lap; each meeting throws out a spray of
tracks. Everything after this is made of light: data.
Before starting, press a key or click once, so the low hum can play
(browsers start sound only after a gesture).
-->

---
space: { at: wide }
---

<!-- Kick-off: the LHCb detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release videos-2026-10-00-opendata. It condenses out of the dust over the ring and breaks back into it as the camera flies to the collision point. -->
<VideoPlayer src="lhcb.mp4" />

<!--
Speaker (~0.7 min, the clip runs 39 s): let it play; it opens the talk.
From the shafts above the cavern down to LHCb, the detector built up in 3D,
and a person standing in it for scale. At most one line over the music,
near the end: "This is LHCb: the detector our data come from." Press → when
the music has faded (or earlier): the frame on screen breaks into grains
while the camera flies to where the bunches meet. `p` pauses, `+` / `-` set the volume for the rest of
the talk.
-->

---
space: { at: wide, dim: 0.2 }
class: photo-slide
---

<div class="photo"><img src="/figures/lhcb_detector_2024.jpg" alt="The upgraded LHCb detector in its cavern near Geneva, 2024, three people on a platform under the LHCb banner" /><span class="credit">© CERN · M. Brice</span></div>

<div class="photo-text">

<p class="kicker">At CERN, 100 m underground</p>

# LHCb

<p class="purpose">Studies how matter and antimatter differ</p>

<div class="stats">
<div><b>5 600 t</b><span>detector</span></div>
<div><b>1 900</b><span>members</span></div>
<div><b>29</b><span>countries</span></div>
</div>

<p class="note">Vilnius University: a member since 2024</p>

</div>

<!--
Speaker (~0.5 min). Say: LHCb is one of the four big experiments at CERN's
Large Hadron Collider. Its job: find out why the Universe is made of matter
at all, by measuring how matter and antimatter differ. A 5 600-tonne
detector, 21 m long and 10 m high, in a cavern 100 m underground in France,
just across the border from Geneva. About 1 900 people from 29 countries
build it, run it and analyse its data; on 2 September 2024 the LHCb
Collaboration Board voted unanimously to take in Vilnius University.
Sources: home.cern, "LHCb"; CERN-RRB-2026-027 (V. Vagnoni, Apr 2026: 1 889
members, 110 institutes, 29 countries); VU Faculty of Physics news, Sep 2024.
-->

---
space: { at: [-59.6, -1.4, 7], dist: 10, yaw: -30, pitch: 10, dim: 0.25 }
class: photo-slide
---

<div class="photo event"><img src="/figures/lhcb_event_run3.jpg" alt="A proton–proton collision at 13.6 TeV in the upgraded LHCb detector, 2022: tracks fanning out through the detector" /><span class="credit">© CERN / LHCb</span></div>

<div class="photo-text event-text">

<p class="kicker">Where the data come from</p>

# 4 TB every second

<p class="line">From 40 million bunch crossings a second, sorted in software</p>

</div>

<!--
Speaker (~0.4 min): a real collision from Run 3, in the upgraded detector
(13.6 TeV protons, 2022): every line a particle LHCb measured. This happens
up to 40 million times a second.
Spoken: "Since 2022 there is no electronic pre-filter: the whole detector is
read out, and graphics cards, the chips in gaming computers, choose what to
keep. About one byte in four hundred goes to tape."
Background, not for the slide: the first software stage runs at the average
non-empty crossing rate, 30 MHz; raw data about 4 TB/s (Aaij et al. 2021);
the design rate to tape is 10 GB/s (LHCb Sprucing paper, arXiv:2506.20309).
Sources: R. Aaij et al. (LHCb), “Evolution of the energy efficiency of LHCb’s real-time processing”, EPJ Web Conf. 251 (2021) 04009 · LHCb Starterkit, Run 3 data flow
-->

---
space: { at: [10.37, 0, 0], dist: 0.75, yaw: -6, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: [0], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">The scale</p>

<div class="big gold"><Count name="unit" :from="1" :to="1" /><span class="unit">TB</span></div>

One sphere: a laptop's disk · LHCb reads out four a second

</div>

<!--
Speaker (~0.3 min). Say: one sphere is one terabyte, the disk of a laptop,
about 330 hours of HD video. LHCb reads out four of these every second.
From here on every sphere is a terabyte, and every pile is built of the same
spheres: nothing shrinks, the camera only steps back.
Sources: HD streaming up to 3 GB an hour (Netflix help centre); decimal units.
-->

---
space: { at: [7.36, 0, 0], dist: 37.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [0, 3], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot blue"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker"><span class="nt">LHCb</span>, since 2010</p>

<div class="big blue"><Count name="lhcb" :from="0" :to="100000" /><span class="unit">TB</span></div>

More than 100 PB · now tens of PB a year

</div>

<!--
Speaker (~0.4 min). Say: this is what LHCb has collected since 2010: more
than 100 petabytes, a hundred thousand spheres. Now it records tens of
petabytes a year; about 60 PB more were expected by the end of Run 3 in 2026. The first terabyte is the dot on the left.
Sources: B. Couturier, ISGC 2025 (16–21 Mar 2025): "Since it began
operations in 2010, the experiment has collected more than 100 PB of data
… now records tens of PB of data per year".
-->

---
space: { at: [7.36, 0, 0], dist: 37.5, yaw: -4, pitch: 4, dim: 1 }
---

<Grains :set="{ scale: [0, 3], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="finds">
<div class="finds-text">

<p class="kicker">What it finds</p>

<div class="big">76</div>

<p class="line">of the 86 new hadrons found at the LHC</p>

<ul class="chips">
<li><b>2015</b> pentaquarks</li>
<li><b>2025</b> matter and antimatter differ in baryons</li>
</ul>

</div>
<div class="finds-plot"><img src="/figures/pentaquarks_2019.png" alt="LHCb 2019: three narrow pentaquark peaks, Pc(4312), Pc(4440), Pc(4457), with the fit" /></div>
</div>

<!--
Speaker (~0.6 min). Say: and in this data LHCb finds new things. Of the 86
new hadrons (particles made of quarks) discovered at the LHC, 76 were found
by LHCb; the Higgs boson, a fundamental particle, is counted apart. In 2015 it found
pentaquarks, particles of five quarks, predicted since 1964; on the right is
the 2019 fit, nine times the data: three narrow peaks, Pc(4312), Pc(4440)
and Pc(4457). In
2025 LHCb saw for the first time that matter and antimatter behave
differently in baryons, the family of the proton and neutron (Nature, July
2025). In 2026 the upgraded detector found two new doubly charmed baryons.
Sources: P. Koppenburg's list of new hadrons at the LHC (86, of which 76 by
LHCb; last entry 21 Sep 2026); LHCb, PRL 115 (2015) 072001; LHCb, PRL 122
(2019) 222001 (the plot); LHCb, Nature (2025), CP violation in Λb⁰ → p K⁻ π⁺ π⁻.
-->

---
space: { at: [5.59, 0, 0], dist: 73.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [0, 3, 4], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot steel"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">All LHC experiments · 2025</p>

<div class="big steel"><Count name="lhc" :from="0" :to="1000000" /><span class="unit">TB</span></div>

One exabyte · one of the largest datasets in science

</div>

<!--
Speaker (~0.5 min). Say: and all four LHC experiments together, ten of
LHCb's piles: in December 2025 CERN passed one exabyte of stored LHC data, a million
terabytes, most of it on about 60 000 magnetic tapes. More than half of it
was taken in the last three years. CERN expects this to be only a tenth of
what it will store in the next ten years.
Spoken: "only a few archives in science are this big; the world's weather-
forecast archive (ECMWF) is one of them." The slide's "one of the largest" is
the defensible wording.
Sources: home.cern, "CERN hits one exabyte of stored experimental data from
the LHC" (17 Dec 2025); heise.de (Dec 2025).
-->

---
space: { at: [9.6, 0, 0], dist: 8.7, yaw: -4, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: [0, 1, 3, 4], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">Open · December 2023</p>

<div class="big gold"><Count name="open" :from="0" :to="800" /><span class="unit">TB</span></div>

All of Run 1, public · release prepared by Mindaugas Šarpis

</div>

<!--
Speaker (~0.5 min). Say: and now we open it. In December 2023 the whole Run 1
proton–proton data set, about 800 TB, went public on the CERN Open Data
portal. I prepared the data set and built the release, in Bonn, inside LHCb's
Data Processing and Analysis project; it took close to two years; every one
of more than a hundred thousand files copied and checked. Since 1 August 2026
I coordinate the collaboration's Analysis Preservation and Open Data work.
Sources: opendata.cern.ch, "LHCb releases entire Run 1 dataset" (20 Dec
2023); VU Faculty of Physics news; M. Šarpis, "LHCb Run I Data is Released"
(Jan 2024); VU news (30 Jul 2026).
-->

---
space: { at: [7.36, 0, 0], dist: 37.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [1, 2, 3], 'scale:labels': 1, world: 8, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">Open · 2026 · Run 1 + Run 2</p>

<div class="big gold"><Count name="open" :from="800" :to="4000" /><span class="unit">TB</span></div>

Anyone can ask for a&nbsp;decay and get the&nbsp;data

</div>

<!--
Speaker (~0.6 min). Say: since 2026 Run 2 is open too: with Run 1 over four
petabytes. Nobody downloads it whole: name the particle decay you want and
LHCb's online service picks those collisions out for you. About 20 requests
by July 2026: theorists, people testing analysis methods, school projects;
in September 2026 two Brown University physicists posted a study built on
LHCb open data. Adam Morris, now in LHCb Vilnius, is one of the service's
authors (on the paper: CERN). LHCb opens its data on a schedule: about half
of each run five years after it ends, all of it after ten; the blue pile is
on its way.
Sources: LHCb outreach, 3 Mar 2026 ("over 4 PB of data to explore"); CERN
Open Data portal, 22 Feb 2026; policy: LHCb, arXiv:2504.00610 (2025).
-->

---
space: { at: [15.5, -3.4, 4], dist: 27, yaw: 12, pitch: 4, dim: 0.3 }
---

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, world: 0, vilnius: 3, dominykas: 0 }" />

# Used in Vilnius

<ul class="points">
<li>Z → μμ: among the first open-data analyses</li>
<li>A university course built on open data</li>
<li>First LHCb masterclass in Lithuania, 2025</li>
</ul>

<!--
Speaker (~0.6 min). Say: Z bosons seen through their decay into two muons,
one of the first analyses of the released data, done in Vilnius; every
seminar of the VU course "Best Research and Data Analysis Practices from
CERN" works on one LHCb open-data file (91 583 candidate decays); the first
LHCb masterclass in Lithuania, organised by students, about 100
participants from Lithuania and Ukraine. Three streams from the same gold,
here in Vilnius. The
Z → μμ analysis (N. E. Eimutis, M. Ambrozas, M. Šarpis) was presented at Open
Readings, Vilnius, 23–26 Apr 2024, "as one of the initial analyses of LHCb
data posted on the Open Data portal". The course (Faculty of Physics, every autumn)
gives every student the same open LHCb file: the D⁰ → K⁻π⁺ masterclass
sample, record 401 (53 948 events, 91 583 candidates). The 2025 masterclass:
about 65 participants from Lithuania and 35 from Ukraine, in English, run by
students.
Sources: Open Readings 2024 abstract book, p. 75 (O7) · M. Šarpis, “LHCb Run I Data is Released”, Jan 2024 · CERN Open Data record 401 · VU course workbook · LHCb Vilnius report, Jan 2026
-->

---
space: { at: thesis, dim: 0.3 }
---

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 1 }" />

<div class="readout thesis">

<p class="kicker">Bachelor's thesis · Vilnius University</p>

# Dominykas Stonkus

<p class="sub">Finding the 2015 pentaquarks again, in LHCb open data</p>

</div>

<!--
Speaker (~0.6 min). Say: the stream that matters most today. The
collisions the 2015 pentaquarks were found in are now public, and Dominykas
looks for the same particles in them. One stream of gold from the open ball,
and at its end five quarks gather into one particle: a pentaquark. Dominykas Stonkus joined LHCb Vilnius in 2025 as a bachelor's
student; his project is to find again, in open data, what LHCb found in
2015 (the discovery used Λb⁰ → J/ψ p K⁻ in Run 1).
"First": keep it spoken only, as "as far as we know", and only once it is
checked: DESY (A. Geiser) has offered bachelor's and master's projects on LHCb
open data since 2023, and the Z → μμ analysis on the previous slide came
first (Open Readings, Apr 2024); "first" holds only if that was not a thesis. (Earlier theses about the
release itself, mine in Bonn 2023 and Ana Trisovic's in 2018, prepared the
data; they did not analyse it.)
Worth adding when known: the thesis's official title and defence date, the
data it uses (Run 1 files or Run 2 through the Ntupling Service), a result
or a plot. `c` builds the pentaquark again.
Sources: LHCb, PRL 115 (2015) 072001 · LHCb Vilnius, CERN Baltic Conference, Kaunas, 2025
-->

---
layout: statement
space: { at: close }
---

# Thank you

<div class="mt-md"><span class="nt">LHCb</span> Vilnius · Vilnius University · opendata.cern.ch</div>

<p class="team">Mindaugas Šarpis · Ramūnas Aleksiejūnas · Oleg Kravcov · Adam Morris · Augustas Vaitkevičius · Rūta Racz · Šarūnas Jacevičius · Margarita Biveinytė · Sophia Pennuttis · Mikas Paulius Iršėnas · Neilas Beniušis · Karolina German · Eliza Holvoet · Meda Paulavičiūtė · Dominykas Stonkus</p>

<!--
Speaker (~0.4 min). Spoken: "That is the work we were nominated for:
preparing LHCb's data for release, coordinating it for the whole
collaboration, and doing research and teaching with it here in Vilnius.
Thank you, and thank you to everyone on this list."
The camera flies back to where the data are born. The names are the group
as listed on lhcb-vilnius.web.cern.ch.
Total about 6½ minutes (0.4 cover + 0.7 clip + 0.5 + 0.4 + 0.3 + 0.4 + 0.6 +
0.5 + 0.5 + 0.6 + 0.6 + 0.6 + 0.4 close). For a hard 5 minutes: leave the
clip after ~20 s (−0.3), the 1 TB slide to one sentence (−0.15), the finds
slide to the 76 and the two chips (−0.25), the 800 TB slide to its first
sentence (−0.25), the 4 PB slide without the list of users (−0.2), and "Used
in Vilnius" to the course point only (−0.3): about 5 minutes.
-->
