---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
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
  options: { reach: 20, nebula: 0.12, dustGain: 1.0, exposure: 1.1, vignette: 0.7, grain: 0.012, aberration: 0, bloom: 0.42 }   # reach: the 1 EB pose stands far back; the rest: deep, crisp, not hazy
title: Opening LHCb's data
info: |
  LHCb Vilnius, nominated for an open data award. A 6½-minute talk told inside
  one world of grains (slidev-addon-stage, blue palette, toolkit pin
  slidev-videos efacca2).
  The line of the talk: what LHCb is and where its data come from; one sphere
  is one terabyte; LHCb has kept 100 000 of them and the LHC a million; what
  LHCb found in them; how much of it is now open; who uses it; and a Vilnius
  bachelor's student who looks in the open data for the pentaquarks LHCb found.
  Piles of the same metal sphere stand side by side and keep their size while
  the camera pulls back. Gold is open data, blue LHCb's own, steel the whole
  LHC's. Streams of grains carry the open data to its users. The talk's own
  forms are in setup/grains.js (`lineup`, `streams`); `<Grains>` sets their
  step and `<Count>` counts with them. On any station `c` builds the form again.
  Kick-off: lhcb.mp4, the LHCb detector in 3D with music, this talk's 39 s cut
  of the library clip (videos/manifest.toml). It arrives and leaves as dust,
  with its colours from public/video-frames/.
  Date placeholder 2026_10_00.
layout: cover
space:
  at: wide
---

# Nominated for an open data award

# Opening <span class="nt">LHCb</span>'s data

## How data from a detector at CERN reached a bachelor's thesis in Vilnius

<div class="mt-md">Mindaugas Šarpis · <span class="nt">LHCb</span> Vilnius · Vilnius University</div>

<!--
Message: this talk is about the work we were nominated for, opening LHCb's data.

Say: "I'm Mindaugas Šarpis. I lead LHCb Vilnius, Vilnius University's group in
the LHCb experiment at CERN. We were nominated for our work on open data, and
in the next few minutes I'll show you what that work is. It starts at the
detector."

Then press → for the clip. The cover gives the clip time to buffer.
Behind the title is the LHC: two bunches of protons go round in opposite
directions and meet twice a lap, and each meeting throws out a spray of tracks.
Before starting, press a key or click once so that the low hum can play
(browsers start sound only after a gesture).

(~0.3 min)
-->

---
space: { at: wide }
---

<!-- Kick-off: the LHCb detector in 3D, from the shafts above the cavern down to the detector, with music. This talk's own cut of the library clip lhcb.mp4 (0:08–0:47.1, 39 s; videos/manifest.toml), on its release videos-2026-10-00-opendata. It condenses out of the dust over the ring and breaks back into it as the camera flies to the collision point. -->
<VideoPlayer src="lhcb.mp4" />

<!--
Message: this is LHCb.

Let the clip play; it runs 39 s and its time is counted from the manifest.
It goes from the shafts above the cavern down to LHCb, the detector built up in
3D, with a person standing in it for scale. Say at most one line over the
music, near the end: "This is LHCb, the detector our data come from."
Press → when the music has faded. The last frame breaks into grains while the
camera flies to where the bunches meet. `p` pauses; `+` and `-` set the volume
for the rest of the talk.
-->

---
space: { at: wide, dim: 0.2 }
class: photo-slide
---

<div class="photo"><img src="/figures/lhcb_detector_2024.jpg" alt="The upgraded LHCb detector in its cavern near Geneva, 2024, three people on a platform under the LHCb banner" /><span class="credit">© CERN · M. Brice</span></div>

<div class="photo-text">

<p class="kicker">At CERN, 100 m underground</p>

# LHCb

<p class="line">It measures how matter and antimatter differ.</p>

<div class="stats">
<div><b>5 600 t</b><span>detector</span></div>
<div><b>~2 000</b><span>members</span></div>
<div><b>2024</b><span>Vilnius joins</span></div>
</div>

</div>

<!-- facts: lhcb-detector-size, lhcb-mission, lhcb-collaboration-2026, lhcb-vilnius-joined -->

<!--
Message: LHCb is a large experiment at CERN, and Vilnius University is part of it.

Say: LHCb is one of the four large experiments at CERN's Large Hadron Collider.
It measures how matter and antimatter differ, to help explain why the Universe
is made of matter at all. The detector weighs 5 600 tonnes and stands 21 m long
and 10 m high, in a cavern 100 m underground on the French side of the border
near Geneva. The collaboration is close to 2 000 people. On 2 September 2024
its Collaboration Board voted unanimously to take in Vilnius University.

Sources: home.cern, "LHCb"; LHCb outreach, 30 June 2026 (new management,
"on the verge of exceeding 2000 members"); VU Faculty of Physics news,
September 2024.

(~0.5 min)
-->

---
space: { at: [-59.6, -1.4, 7], dist: 10, yaw: -30, pitch: 10, dim: 0.25 }
class: photo-slide
---

<div class="photo event"><img src="/figures/lhcb_event_run3.jpg" alt="A proton–proton collision at 13.6 TeV in the upgraded LHCb detector, 2022: tracks fanning out through the detector" /><span class="credit">© CERN / LHCb</span></div>

<div class="photo-text event-text">

<p class="kicker">Where the data come from</p>

# 4 TB every second

<p class="line">The detector is read out 40 million times a second, and software decides what to keep.</p>

</div>

<!-- facts: lhcb-run3-readout-4tbs, lhcb-upgrade1-trigger, lhcb-hlt1-30mhz, lhcb-sprucing-rates -->

<!--
Message: every collision becomes data, four terabytes of it every second.

Say: this is one real collision from 2022, in the upgraded detector. Each line
is a particle that LHCb measured. Bunches of protons cross up to 40 million
times a second, and since 2022 the whole detector is read out every time, about
4 terabytes a second. There is no electronic pre-filter any more. Software,
running on graphics cards, chooses what to keep, and about one byte in four
hundred goes to storage.

Background: the first software stage runs at the average rate of non-empty
crossings, 30 MHz; the design rate to tape is 10 GB/s.

Sources: R. Aaij et al. (LHCb), EPJ Web Conf. 251 (2021) 04009; LHCb Sprucing
paper, arXiv:2506.20309; LHCb Starterkit, Run 3 data flow.

(~0.4 min)
-->

---
space: { at: [10.37, 0, 0], dist: 0.75, yaw: -6, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: [0], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">The unit</p>

<div class="big"><Count name="unit" :from="1" :to="1" /><span class="unit">TB</span></div>

<p class="line">One sphere is one terabyte, about as much as a laptop's disk holds.</p>

</div>

<!-- facts: lhcb-run3-readout-4tbs -->

<!--
Message: from here on, one sphere is one terabyte.

Say: to see how much data that is, take one terabyte, about what a laptop's
disk holds, and make it one sphere. LHCb reads out four of these every second.
From now on every sphere is a terabyte, and every pile is built from the same
spheres. Nothing shrinks; the camera only steps back.

Sources: decimal units (1 TB = 10¹² bytes); a common laptop disk is 1 TB;
the 4 TB a second as on the previous slide.

(~0.3 min)
-->

---
space: { at: [7.36, 0, 0], dist: 37.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [0, 3], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot blue"></span>one sphere = one terabyte</div>

<div class="readout blue">

<p class="kicker"><span class="nt">LHCb</span>, since 2010</p>

<div class="big"><Count name="lhcb" :from="0" :to="100000" /><span class="unit">TB</span></div>

<p class="line">More than 100 PB so far, and tens of petabytes more each year.</p>

</div>

<!-- facts: lhcb-data-100pb -->

<!--
Message: LHCb has kept more than a hundred thousand of these spheres.

Say: this is what LHCb has collected since 2010: more than 100 petabytes, a
hundred thousand spheres. Since the upgrade it adds tens of petabytes every
year. The single terabyte from the last slide is the dot on the left.

Sources: B. Couturier, ISGC 2025 (16–21 March 2025): "Since it began operations
in 2010, the experiment has collected more than 100 PB of data … now records
tens of PB of data per year".

(~0.4 min)
-->

---
space: { at: [5.59, 0, 0], dist: 73.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [0, 3, 4], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot steel"></span>one sphere = one terabyte</div>

<div class="readout steel">

<p class="kicker">All LHC experiments, December 2025</p>

<div class="big"><Count name="lhc" :from="0" :to="1000000" /><span class="unit">TB</span></div>

<p class="line">One exabyte, about ten times what LHCb has kept.</p>

</div>

<!-- facts: cern-exabyte, cern-second-500pb-run3 -->

<!--
Message: the whole LHC has stored ten times as much again.

Say: and this is all four LHC experiments together. In December 2025 CERN
passed one exabyte of stored LHC data, a million terabytes, most of it on about
60 000 magnetic tapes. The first half took about twelve years to collect; the
second half came in three. Only a few scientific archives anywhere are this
large.

Sources: home.cern, "CERN hits one exabyte of stored experimental data from the
LHC" (17 December 2025).

(~0.4 min)
-->

---
space: { at: [9.6, 0, 0], dist: 8.7, yaw: -4, pitch: 4, dim: 1 }
---

<Grains :set="{ scale: [0, 3, 4], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="finds">
<div class="finds-text">

<p class="kicker">What <span class="nt">LHCb</span> found in its data</p>

<div class="big">76</div>

<p class="line">of the 86 new hadrons, particles made of quarks, discovered at the LHC</p>

<ul class="chips">
<li><b>2015</b> Pentaquarks, particles of five quarks</li>
<li><b>2025</b> Matter and antimatter behave differently in baryons</li>
</ul>

</div>
<div class="finds-plot"><img src="/figures/pentaquarks_2019.png" alt="LHCb 2019: three narrow pentaquark peaks, Pc(4312), Pc(4440), Pc(4457), with the fit" /></div>
</div>

<!-- facts: lhcb-hadron-count, lhcb-pentaquark-2015, lhcb-pentaquark-2019, lhcb-cpv-baryons-2025 -->

<!--
Message: in this data LHCb finds new particles, so the data is worth opening.

Say: in this data LHCb finds new things. Of the 86 new hadrons, particles made
of quarks, discovered at the LHC so far, 76 were found by LHCb. In 2015 it found
pentaquarks, particles made of five quarks, which had been predicted since 1964.
On the right is the 2019 measurement with nine times more data, where the
signal splits into three narrow peaks. Remember this plot; it comes back at
the end. In 2025 LHCb saw for the first time that matter and antimatter behave
differently in baryons, the family of the proton and the neutron.

The slide is opaque; behind it the camera moves in for the next slide.

Sources: P. Koppenburg's list of new hadrons at the LHC (86, of which 76 by
LHCb; last entry 21 September 2026); LHCb, PRL 115 (2015) 072001; LHCb, PRL 122
(2019) 222001 (the plot); LHCb, Nature 643 (2025) 1223.

(~0.6 min)
-->

---
space: { at: [9.6, 0, 0], dist: 8.7, yaw: -4, pitch: 4, dim: 0.2 }
---

<Grains :set="{ scale: [0, 1, 3, 4], 'scale:labels': 1, world: 0, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">Open since December 2023</p>

<div class="big"><Count name="open" :from="0" :to="800" /><span class="unit">TB</span></div>

<p class="line">All of LHCb's Run 1 data, prepared for release by Mindaugas Šarpis.</p>

</div>

<!-- facts: lhcb-run1-volume-sources-differ, lhcb-run1-release-sarpis, sarpis-phd-bonn-2023, lhcb-open-data-coordinator-2026 -->

<!--
Message: in 2023 we made all of LHCb's first run public.

Say: until a few years ago only LHCb's members could use this data. In December
2023 all of Run 1, the proton collisions of 2011 and 2012, about 800 terabytes,
went public on the CERN Open Data portal. I prepared that data set and built
the release, as part of my PhD in Bonn. It took close to two years, and every
one of more than a hundred thousand files was copied and checked. Since
1 August 2026 I coordinate analysis preservation and open data for the whole
collaboration.

Sources: opendata.cern.ch, "LHCb releases entire Run 1 dataset" (20 December
2023); VU Faculty of Physics news; M. Šarpis, PhD thesis, University of Bonn
(2023); VU news (30 July 2026).

(~0.5 min)
-->

---
space: { at: [7.36, 0, 0], dist: 37.5, yaw: -4, pitch: 4, dim: 0.15 }
---

<Grains :set="{ scale: [1, 2, 3], 'scale:labels': 1, world: 8, vilnius: 0, dominykas: 0 }" />

<div class="legend"><span class="dot gold"></span>one sphere = one terabyte</div>

<div class="readout">

<p class="kicker">Open since 2026, Run 1 and Run 2</p>

<div class="big"><Count name="open" :from="800" :to="4000" /><span class="unit">TB</span></div>

<p class="line">Anyone can name a decay and receive the collisions that contain it.</p>

</div>

<!-- facts: lhcb-ntupling-service-4pb, lhcb-ntupling-requests-2026, lhcb-opendata-brown-2026, ntuple-wizard-paper-2023, lhcb-open-data-policy -->

<!--
Message: since 2026 more than 4 PB are open, and people outside LHCb use them.

Say: since this year Run 2 is open as well, and with Run 1 that is more than
four petabytes. Nobody downloads all of it. You name the particle decay you
want, and LHCb's Ntupling Service selects those collisions for you. By July it
had about 20 requests, mostly from theorists. In September two physicists at
Brown University posted a study built on LHCb open data. Adam Morris, now in
LHCb Vilnius, is one of the service's authors. LHCb releases about half of each
run five years after it ends and all of it after ten, so the blue pile is on
its way.

Sources: LHCb outreach, 3 March 2026 ("over 4 PB of data to explore"); DPHEP
Global Report 2026; arXiv:2609.09275; LHCb, arXiv:2504.00610 (open data policy).

(~0.6 min)
-->

---
space: { at: [15.5, -3.4, 4], dist: 27, yaw: 12, pitch: 4, dim: 0.3 }
---

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, world: 0, vilnius: 3, dominykas: 0 }" />

# Used in Vilnius

<ul class="points">
<li>Z → μμ, one of the first analyses of the released data (2024)</li>
<li>A university course in which every student works on open data</li>
<li>Lithuania's first <span class="nt">LHCb</span> masterclass (2025)</li>
</ul>

<!--
Message: in Vilnius we use the open data for research and for teaching.

Say: we use it here as well. In 2024 students in Vilnius measured Z bosons
through their decay into two muons, one of the first analyses of the released
data. In the course "Best Research and Data Analysis Practices from CERN" every
student works on the same LHCb open-data file, about 92 000 candidate decays.
And in 2025 students organised Lithuania's first LHCb masterclass, with about
100 participants from Lithuania and Ukraine. Three streams from the gold pile,
all ending in Vilnius.

Background: the Z → μμ analysis (N. E. Eimutis, M. Ambrozas, M. Šarpis) was
presented at Open Readings, Vilnius, 23–26 April 2024. The course file is the
D⁰ → K⁻π⁺ masterclass sample, CERN Open Data record 401 (53 948 events,
91 583 candidates). The masterclass had about 65 participants from Lithuania
and 35 from Ukraine.

Sources: Open Readings 2024 abstract book, p. 75 (O7); CERN Open Data record
401; VU course workbook; LHCb Vilnius report, January 2026.

(~0.5 min)
-->

---
space: { at: thesis, dim: 0.3 }
---

<Grains :set="{ scale: [1, 2], 'scale:labels': 0, world: 0, vilnius: 0, dominykas: 1 }" />

<div class="readout thesis">

<p class="kicker">Bachelor's thesis, Vilnius University</p>

# Dominykas Stonkus

<p class="line">He is looking for LHCb's 2015 pentaquarks again, in the open data.</p>

</div>

<!-- facts: lhcb-pentaquark-2015 -->

<!--
Message: a student here now repeats one of LHCb's discoveries with public data.

Say: and this is the stream I am proudest of. The collisions in which LHCb found
the pentaquarks in 2015 are now public. Dominykas Stonkus joined LHCb Vilnius in
2025 as a bachelor's student, and his project is to find the same particles
again, in the open data. One stream of gold leaves the open pile, and at its
end five quarks gather into one particle, a pentaquark.

Do not say "first open-data thesis". DESY has offered bachelor's and master's
projects on LHCb open data since 2023, and the Z → μμ work came earlier. Only
say "as far as we know, the first" once both are checked. `c` builds the
pentaquark again.

Sources: LHCb, PRL 115 (2015) 072001; LHCb Vilnius, CERN Baltic Conference,
Kaunas, 2025.

(~0.6 min)
-->

---
layout: statement
space: { at: close }
---

# Thank you

<div class="mt-md"><span class="nt">LHCb</span> Vilnius · Vilnius University · opendata.cern.ch</div>

<p class="team">Mindaugas Šarpis · Ramūnas Aleksiejūnas · Oleg Kravcov · Adam Morris · Augustas Vaitkevičius · Rūta Racz · Šarūnas Jacevičius · Margarita Biveinytė · Sophia Pennuttis · Mikas Paulius Iršėnas · Neilas Beniušis · Karolina German · Eliza Holvoet · Meda Paulavičiūtė · Dominykas Stonkus</p>

<!--
Message: this is the work we were nominated for, and the people who did it.

Say: "That is the work we were nominated for: preparing LHCb's data for
release, coordinating it for the whole collaboration, and doing research and
teaching with it here in Vilnius. Thank you, and thank you to everyone on this
list."

The camera flies back to the collisions where the data begin. The names are
the group as listed on lhcb-vilnius.web.cern.ch.

Timing: about 6 minutes with the 39 s clip. For a hard 5 minutes, end the clip
after about 20 s, keep the finds slide to the 76 and the two lines, and say
only the course point on "Used in Vilnius".

(~0.4 min)
-->
