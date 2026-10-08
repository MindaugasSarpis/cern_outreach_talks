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
  palette: blue
  sound: true
  options: { reach: 20 }      # the 600 PB pose stands far back: still at the store station
title: Opening LHCb's data
info: |
  LHCb Vilnius, nominated for an open data award: a 6½-minute talk told inside
  one world of grains (slidev-addon-stage, blue palette, pinned to the
  slidev-videos feat/effects-v2 commit 640eaa5). One sphere is one terabyte:
  piles of the same sphere stand side by side (1 TB, 800 TB, 55 PB gold;
  LHC Run 3's 600 PB blue) and keep their size as the camera pulls back, and
  streams of grains carry the open data to the people who use them. The
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

# Opening LHCb's data

## From a detector at CERN to a bachelor's thesis in Vilnius

<div class="mt-md">Mindaugas Šarpis · LHCb Vilnius · Vilnius University</div>

<!--
Speaker (~0.5 min). Spoken: "I'm Mindaugas Šarpis. I lead LHCb Vilnius,
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
space: { at: [-59.6, -1.4, 7], dist: 10, yaw: -30, pitch: 10, dim: 0.25 }
---

<div class="world-caption narrow">

<p class="kicker">Where the data come from</p>

# Forty million times a second

4 TB every second, sorted in software

</div>

<div class="src">R. Aaij et al. (LHCb), “Evolution of the energy efficiency of LHCb’s real-time processing”, EPJ Web Conf. 251 (2021) 04009 · LHCb Starterkit, Run 3 data flow</div>

<!--
Speaker (~0.6 min): we are where the bunches meet. Each spray is one
crossing; LHCb sees what flies out of it: tracks, energies, particle types.
Spoken: "Since 2022 there is no electronic pre-filter: the whole detector is
read out, and graphics cards, the chips in gaming computers, choose what to
keep. About one byte in four hundred goes to tape."
Background, not for the slide: the first software stage runs at the average
non-empty crossing rate, 30 MHz; raw data about 4 TB/s (Aaij et al. 2021);
the design rate to tape is 10 GB/s (LHCb Sprucing paper, arXiv:2506.20309).
-->

---
space: { at: [7.92, 0, 0], dist: 0.75, yaw: -6, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: 0, 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">The scale</p>

<div class="big gold"><Count name="open" :from="1" :to="1" /><span class="unit">TB</span></div>

One sphere: a laptop's disk

</div>

<div class="src">HD streaming: up to 3 GB an hour (Netflix help centre) · decimal units, 1 TB = 1000 GB</div>

<!--
Speaker (~0.4 min). Say: one sphere is one terabyte, the disk of a laptop,
about 330 hours of HD video. The scale for the rest of the talk. One terabyte, one
sphere; point at it. LHCb's detector reads out four of these every second.
From here on every sphere is a terabyte, every pile is built of the same
spheres, and nothing shrinks: when the camera pulls back, what came before
stays beside the new pile at its true size.
-->

---
space: { at: [7.16, 0, 0], dist: 8.7, yaw: -4, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: 1, 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">December 2023 · all of Run 1</p>

<div class="big gold"><Count name="open" :from="1" :to="800" /><span class="unit">TB</span></div>

All of Run 1, public · prepared and released by Mindaugas Šarpis

</div>

<div class="src">LHCb, “LHCb releases entire Run 1 dataset”, opendata.cern.ch, 20 Dec 2023 · VU Faculty of Physics news · VU news, 30 Jul 2026</div>

<!--
Speaker (~0.6 min): eight hundred spheres pile up beside the first one. The release completed on
20 December 2023: the whole Run 1 proton–proton sample, about 800 TB. A
first 200 TB (three streams) came out in December 2022; LHCb's earliest open
files were small masterclass samples from 2014. Every one of more than a
hundred thousand files was copied to dedicated storage and checked; it took
close to two years (M. Šarpis, "LHCb Run I Data is Released", Jan 2024). I
did this work in Bonn as part of LHCb's Data Processing and Analysis (DPA)
project, and brought it with me to Vilnius. Since 1 August 2026 I coordinate
the collaboration's Analysis Preservation and Open Data work package.
-->

---
space: { at: [5.46, 0, 0], dist: 25.9, yaw: -4, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: 2, 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">Open</p>

<div class="big gold"><Count name="open" :from="800" :to="55000" /><span class="unit">TB</span></div>

Half after 5 years · all after 10

</div>

<div class="src">Policy: LHCb, “LHCb Open Data Ntupling Service”, arXiv:2504.00610 (2025)</div>

<!--
Speaker (~0.5 min): fifty-five thousand spheres; the first terabyte is now a
dot on the left.
[CHECK before the talk: "55 PB open" is the figure as given by the speaker.
The group's own LMT applications (2024, 2025) use ~55 PB for LHCb's TOTAL
data set; public figures for open LHCb data are ~800 TB (Run 1 files) and
"over 4 PB" of Run 1 + Run 2 through the Ntupling Service (Feb/Mar 2026);
the whole CERN Open Data portal holds "more than 5 PB". To change the
number: the `open` volume's last step in public/data/space.json, this
slide's <Count :to>, and the "eleven times" (600 000 ÷ the open figure) in
the notes of the Run 3 slide.]
The policy: LHCb agreed in 2013 to publish about 50% of a run's data five
years after it ends and all of it after ten (since 2020 within CERN's Open
Data Policy for the LHC experiments). The dates have slipped a little: all
of Run 1 was due by the end of 2022 and was complete in December 2023.
-->

---
space: { at: [2.3, 0, 0], dist: 57.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: 3, 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">LHC Run 3 · 2022–2026</p>

<div class="big blue"><Count name="run3" :from="0" :to="600000" /><span class="unit">TB</span></div>

All LHC experiments · 20 000 years of HD video

</div>

<div class="src">CERN, “Storage”, home.cern/science/computing/storage</div>

<!--
Speaker (~0.7 min): and now Run 3. Six hundred thousand spheres: the blue
ball is eleven times the gold in volume, and the first terabyte is a speck
under its label. CERN's own comparison: more than
600 PB is over 20 000 years of HD video recorded around the clock. In
December 2025 CERN passed one exabyte of stored LHC data, and the second
half of it was collected in Run 3 alone. Run 3 ended in June 2026. LHCb's
part of it, in analysis-ready form, opens on LHCb's schedule: about half
five years after the run, all of it after ten.
-->

---
space: { at: [10, -3.2, -1], dist: 30, yaw: 26, pitch: 10, dim: 0.3 }
---

<Grains :set="{ scale: 3, 'scale:labels': 0, world: 8, vilnius: 0, dominykas: 0 }" />

# Anyone can take it

<ul class="points">
<li>Ask for a decay, get the collisions</li>
<li>Theorists, schools, other universities</li>
<li>Service co-written in LHCb Vilnius</li>
</ul>

<div class="src">LHCb outreach, 3 Mar 2026 · arXiv:2504.00610 · DPHEP Global Report 2026, arXiv:2607.06775 · arXiv:2609.09275</div>

<!--
Speaker (~0.6 min). Say: name the particle decay you want and LHCb's online
service picks those collisions out for you, Run 1 and, since 2026, Run 2;
Adam Morris of LHCb Vilnius is one of its authors. About 20 requests by July
2026: theorists, people testing analysis methods, school projects; in
September 2026 two Brown University physicists posted a study built on LHCb
open data. Open means the data leave. Each stream is someone
taking data out. The service is the LHCb Ntupling Service (LHCb with the
CERN Open Data team; paper arXiv:2504.00610, Adam Morris among the authors,
as on the Ntuple Wizard paper of 2023): it runs the selection for you and
returns a small file. With Run 2 it opens over 4 petabytes (portal post 22
Feb 2026, LHCb outreach 3 Mar 2026). The DPHEP Global Report 2026 counts
about 20 requests, from theorists and phenomenologists (exotic hadrons, CP
asymmetries), people testing fitting methods, and school projects.
Stamenkovic and Landsberg (Brown), arXiv:2609.09275: simulated LHCb open
data, checked on 2017 collision open data.
-->

---
space: { at: [15.5, -3.4, 4], dist: 27, yaw: 12, pitch: 4, dim: 0.3 }
---

<Grains :set="{ scale: 3, 'scale:labels': 0, world: 0, vilnius: 3, dominykas: 0 }" />

# Used in Vilnius

<ul class="points">
<li>Z → μμ: among the first open-data analyses</li>
<li>A university course built on open data</li>
<li>First LHCb masterclass in Lithuania, 2025</li>
</ul>

<div class="src">M. Šarpis, “LHCb Run I Data is Released”, Jan 2024 · CERN Open Data record 401 · VU course workbook · LHCb Vilnius report, Jan 2026</div>

<!--
Speaker (~0.6 min). Say: Z bosons seen through their decay into two muons,
one of the first analyses of the released data, done in Vilnius; every
seminar of the VU course "Best Research and Data Analysis Practices from
CERN" works on one LHCb open-data file (91 583 candidate decays); the first
LHCb masterclass in Lithuania, organised by students, about 100
participants from Lithuania and Ukraine. Three streams from the same gold,
here in Vilnius. The
Z → μμ analysis was among the very first uses of the released data [CHECK:
year and who did it; if it was a thesis, the "first thesis" claim on the
next slide needs rewording]. The course (Faculty of Physics, every autumn)
gives every student the same open LHCb file: the D⁰ → K⁻π⁺ masterclass
sample, record 401 (53 948 events, 91 583 candidates). The 2025 masterclass:
about 65 participants from Lithuania and 35 from Ukraine, in English, run by
students [CHECK: that it ran on the open masterclass files].
-->

---
space: { at: thesis, dim: 0.3 }
---

<Grains :set="{ scale: 3, 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 1 }" />

<div class="readout thesis">

<p class="kicker">The first known thesis analysing LHCb open data</p>

# Dominykas Stonkus

<p class="sub">BSc thesis project, Vilnius University · <em>Rediscovering pentaquarks with LHCb open data</em></p>

</div>

<div class="src">LHCb, PRL 115 (2015) 072001 · LHCb Vilnius, CERN Baltic Conference, Kaunas, 2025 · “First”: no earlier thesis analysing LHCb open data on INSPIRE, Oct 2026</div>

<!--
Speaker (~0.8 min). Say: in 2015 LHCb discovered pentaquarks, particles of
five quarks. The collisions they were found in are now public, and Dominykas
looks for the same particles in the open data. The stream that matters most
today. One stream of gold
from the open ball, and at its end five quarks gather into one particle: a
pentaquark. Dominykas Stonkus joined LHCb Vilnius in 2025 as a bachelor's
student; his project is to find again, in open data, what LHCb found in
2015 (the discovery used Λb⁰ → J/ψ p K⁻ in Run 1).
Spoken qualifier: "As far as we know, the first thesis that analyses LHCb
open data: none earlier is listed on INSPIRE." (Earlier theses about the
release itself, mine in Bonn 2023 and Ana Trisovic's in 2018, prepared the
data; they did not analyse it.)
[CHECK with Dominykas: the official thesis title and defence date; the
decay and the data (Run 1 files, or Run 2 through the Ntupling Service);
his result or a plot; that the Z → μμ analysis on the previous slide was not
a thesis.] `c` builds the pentaquark again.
-->

---
layout: statement
space: { at: close }
---

# Thank you

<div class="mt-md">LHCb Vilnius · Vilnius University · opendata.cern.ch</div>

<p class="team">Mindaugas Šarpis · Ramūnas Aleksiejūnas · Oleg Kravcov · Adam Morris · Augustas Vaitkevičius · Rūta Racz · Šarūnas Jacevičius · Margarita Biveinytė · Sophia Pennuttis · Mikas Paulius Iršėnas · Neilas Beniušis · Karolina German · Eliza Holvoet · Meda Paulavičiūtė · Dominykas Stonkus</p>

<!--
Speaker (~0.4 min). Spoken: "That is the work we were nominated for:
preparing LHCb's data for release, coordinating it for the whole
collaboration, and doing research and teaching with it here in Vilnius.
Thank you, and thank you to everyone on this list."
The camera flies back to where the data are born. The names are the group
as listed on lhcb-vilnius.web.cern.ch.
Total about 6½ minutes (0.5+0.7 clip+0.6+0.4+0.6+0.5+0.7+0.6+0.6+0.8+0.4 =
6.4, plus breaths). For a hard 5-minute slot: leave the clip after ~20 s
(−0.3), "Anyone can take it" to one sentence (−0.4), the collisions slide
to its first two spoken sentences (−0.2), "Used in Vilnius" to the course
card only (−0.3).
-->
