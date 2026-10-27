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
  release: videos-2026-11-18-tokyo
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  palette: classic
  plugins: [hadron]
  lang: en
title: "Lithuania and Japan: pentaquarks"
lang: en                  # slides and notes; `pnpm talk lint` reads it
htmlAttrs:
  lang: en
duration: 30min
layout: cover
space: { at: [-31.5, 0.4, 0], dist: 12, yaw: -30, pitch: 14, dim: 0.15 }
---

<div class="tokyo-title">
  <div class="t">Unraveling the Structure of P<sub>c</sub> Pentaquarks through Joint Experimental and Theoretical Effort between Lithuanian and Japanese scientists</div>
  <div class="who">Mindaugas Šarpis · Yasuhiro Yamaguchi</div>
</div>

<!--
Title slide (the owner's exception to the no-title rule): the project's full
name and the two project leaders, Mindaugas Šarpis (Vilnius) and Yasuhiro
Yamaguchi (Japan). The five quarks fly in out of the dust and lock into one
particle at the right while the low hum swells; the title fades in as they
land; `c` replays it.

Your Excellency, ladies and gentlemen, thank you for having me. I am
Mindaugas Šarpis, and together with Yasuhiro Yamaguchi I lead the project
named on the screen. I lead the LHCb group at Vilnius University, which works
on one of the four large experiments at CERN, near Geneva. In the next
thirty minutes I would like to show you what this object behind me is, why
physicists waited half a century to find it, and why Lithuanian and Japanese
scientists are now studying it together. (~1 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<VideoPlayer src="vilnius_out.mp4" />

<!-- facts: lhcb-vilnius-joined -->

<!--
Lithuania (owner, 27 Oct). Clip vilnius_out.mp4 (17.8 s, no sound): from NFTMC, Vilnius
University's physics campus in Saulėtekio slėnis, out over Vilnius (Google Earth) to the
clouds and the Earth's limb. It ends and waits for the press. The coming back is slide 20.
Sources: the owner's SpaceEngine edit, stabilised for Užsikrauk karjerai (videos/manifest.toml).
(~0.5 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<VideoPlayer src="cern_overview_short.mp4" />

<!-- facts: lhc-geneva-27km-100m-four-experiments -->

<!--
CERN (owner, 27 Oct). Library clip cern_overview_short.mp4 (11 s, no sound): from the Earth
down to Geneva, then the LHC ring drawn over the fields with its four experiments named.
Sources: home.cern. (~0.5 min)
-->

---
space: { at: lhc, dim: 0.25 }
---

<StagePhoto src="figures/tunnel.jpg" alt="The LHC tunnel: blue dipole magnets with the letters LHC" focus="50% 50%" arrive="camera">
<div class="shade tr"></div>
<div class="num tr">27 km<span class="name">LHC</span></div>
</StagePhoto>

<!-- facts: cern-lhc-size-cost, cern-lithuania, cern-members-2026, lhc-turns-per-second, japan-lhc-contribution -->

<!--
This is the Large Hadron Collider at CERN: a ring 27 kilometres long, about
100 metres under the border between France and Switzerland. Two beams of
protons go round it in opposite directions, more than eleven thousand times a
second, and meet at four points. Where they meet, the detectors record what
comes out of each collision.

Lithuania has been an Associate Member State of CERN since 2018. Japan has
an observer for the LHC, and Japanese institutes helped build both the
machine and its experiments. My group works on one of those
experiments, LHCb.

Sources: home.cern (LHC facts; member states; Lithuania; "Japan contributes
an additional 5 billion yen", 1998). (~1.25 min)
-->

---
space: { at: lhc, dist: 18, yaw: -10, pitch: 18, dim: 0.6 }
---

<StagePhoto src="figures/lithuania_cern.jpg" alt="President Gitanas Nausėda with the Lithuanian community at CERN, January 2026" focus="50% 40%">
<div class="shade tr strong"></div>
<div class="num tr">2018<span class="name">CERN</span></div>
</StagePhoto>

<!-- facts: cern-lithuania, lhcb-lithuania-membership, lt-member-interest-cern-visit-2026-09, lt-nauseda-visit, lt-consortium -->

<!--
Lithuania at CERN (owner, 27 Oct). Photo: President Gitanas Nausėda with the Lithuanian
community at CERN, 19 January 2026 (CERN-PHOTO-202601-009-23). Associate Member State since
8 January 2018, the first Baltic state; a letter seeking full membership at the end of August
2026; the Lithuanian Particle Physics Consortium (CERN-LT) since 2022.
Sources: home.cern (Lithuania becomes an Associate Member State, 2018; presidential visits,
2026); LRT, 20 September 2026; cds.cern.ch CERN-PHOTO-202609-233-1; LMT. (~1 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<VideoPlayer src="lhcb.mp4" />

<!--
Clip: lhcb.mp4, the LHCb detector in 3D with music (0:47, library clip).
Let it play; at most one line over the music: "This is LHCb, the experiment
my group works on: a detector the size of a house, built to catch what comes
out of the collisions." It condenses out of the dust and leaves the same way.
(~0.8 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22, dim: 0.6 }
---

<StagePhoto src="figures/lhcb_detector.jpg" alt="The LHCb detector in its cavern under the LHCb banner, March 2024" focus="50% 50%">
<div class="shade bl"></div>
<div class="num bl">5 600 t<span class="name">LHCb</span></div>
</StagePhoto>

<!-- facts: lhcb-detector-size, lhcb-100m-below-ground, lhcb-three-storey-worked, lhcb-run3-readout-4tbs -->

<!--
What LHCb is (owner, 27 Oct). Photo: the LHCb detector in its cavern, March 2024
(CERN-PHOTO-202403-050-3, M. Brice). 5 600 tonnes, 21 m long, 10 m high (about three
storeys), 100 m under ground near Ferney-Voltaire; a forward spectrometer, its subdetectors one
behind another; 4 TB/s read out in real time in Run 3.
Sources: home.cern (LHCb); arXiv:2106.07701. (~1 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22, dim: 0.6 }
---

<StagePhoto src="figures/collaboration.jpg" alt="The LHCb collaboration's group photo in front of the detector, June 2022" focus="50% 100%">
<div class="shade tl strong"></div>
<div class="num tl">1 891<span class="name">members</span></div>
</StagePhoto>

<!-- facts: lhcb-collaboration-sep-2026, lhcb-vilnius-joined -->

<!--
The LHCb collaboration in front of its detector (group photo, June 2022); 1891
members from 112 institutes in 28 countries (September 2026). Vilnius
University joined in September 2024.
Sources: T. Gershon, LHCb report to the CERN
SPC, 22 September 2026; Vilnius University. (~0.75 min)
-->

---
space: { at: atom, dim: 0.15 }
---

<!-- facts: atom-nucleus-size-ratio -->

<!--
What do we study with it? Let us go down in size. Everything around us, this
room and ourselves, is made of atoms. An atom is mostly empty: a cloud of
electrons, and at its centre a tiny bright point, the nucleus. The nucleus is
ten thousand to a hundred thousand times smaller than the atom, yet it holds
almost all of its mass.

Source: M. Strassler, "The nuclei of atoms" (profmattstrassler.com). (~1 min)
-->

---
space: { at: nucleus, dist: 12, yaw: -6, pitch: 5, dim: 0.15 }
---

<div class="num tr">1935<span class="name">meson</span></div>

<!-- facts: yukawa-meson-announced-1934, yukawa-meson-1935, yukawa-meson-200-electron, yukawa-nobel-1949, yukawa-first-japanese-laureate -->

<!--
Come closer, and the nucleus is a tight bundle of protons and neutrons, held
together by the strong force. At these distances it is far stronger than the
electric force that pushes the protons apart. 

At the left, Hideki Yukawa, at Osaka: proposed in 1934, published in 1935,
that this force is carried by a new particle about 200 times heavier than
the electron, the meson (Nobel Prize 1949, Japan's first).
Sources:
H. Yukawa, Proc. Phys.-Math. Soc. Japan 17 (1935) 48; nobelprize.org;
Osaka University. (~1.25 min)
-->

---
space: { at: proton, dim: 0.2 }
---

<div class="num tr">1 %<span class="name">mass</span></div>

<!-- facts: proton-mass-quarks-1-percent -->

<!--
Come closer again, into one proton, and we find three smaller particles:
quarks. Two of one kind, called "up", and one called "down". They are bound
by that same strong force, carried by particles called gluons.

Two things about quarks are strange. First, no one has ever seen a quark on
its own: pull two apart, and the energy you put in turns into new quarks.
They only exist in groups. Second, the three quarks make up only about one
percent of the proton's mass. The other ninety-nine percent is the energy of
their motion and of the force that holds them. Most of the mass of your body
comes from this energy.

Source: Yang et al., PRL 121 (2018) 212001; Brookhaven National Laboratory
news. (~1.5 min)
-->

---
space: { at: families, dim: 0.15 }
---

<!--
For more than fifty years every particle built from quarks that we knew fell
into one of two families. On the left, a quark with an antiquark: a meson.
On the right, three quarks: a baryon, like the proton. Hundreds of such
particles are known, and they all follow these two recipes.

The question is whether nature allows more: four quarks, five, six. (~1.25 min)
-->

---
space: { at: sakata, dim: 0.15 }
---

<div class="num tr">1956<span class="name">Nagoya</span></div>

<!-- facts: sakata-model-1956, sakata-nagoya-1956 -->

<!--
Shoichi Sakata at Nagoya University: in 1956, every such particle built from
three basic ones; in the Nobel Committee's words, "the Sakata particles
finally became the quarks of Gell-Mann".
Sources: S. Sakata, Prog. Theor.
Phys. 16 (1956) 686; nobelprize.org (Scientific Background 2008). (~1.25 min)
-->

---
space: { at: paper, dim: 0.06 }
---

<div class="num tr">1964<span class="name">quarks</span></div>

<!-- facts: quark-model-1964-papers, pentaquark-idea-1964 -->

<!--
The idea of quarks came in 1964, from two physicists working independently.
Murray Gell-Mann, at the top, in a two-page letter titled "A schematic model
of baryons and mesons", received by the journal on 4 January. George Zweig,
below, at CERN, in a report dated 17 January, where he called the particles
"aces".

Both papers already allow more than the two recipes. Gell-Mann writes that
baryons can be made of three quarks, or of four quarks and an antiquark.
Zweig's footnote says the same in his words. That five-particle combination,
four quarks and one antiquark, is what we now call a pentaquark.

Neither paper could say whether such a particle really exists. The search
took the rest of the century.

Sources: M. Gell-Mann, Phys. Lett. 8 (1964) 214; G. Zweig, CERN-TH-401
(1964). (~1.5 min)
-->

---
space: { at: km, dim: 0.15 }
---

<div class="num tr">1973<span class="name">six quarks</span></div>

<!-- facts: kobayashi-maskawa-1973, kobayashi-maskawa-nagoya-phd, kobayashi-maskawa-nobel-2008, b-quark-1977, lhcb-b-for-beauty -->

<!--
Makoto Kobayashi and Toshihide Maskawa, both from Sakata's school in Nagoya:
in 1972-73, three families of quarks (six) when three quarks were known; the fifth, b, found in 1977, is the
"b" in LHCb (Nobel Prize 2008).
Sources: Prog. Theor. Phys. 49 (1973) 652;
nobelprize.org; home.cern. (~1.25 min)
-->

---
space: { at: km, dim: 0.6 }
---

<StagePhoto src="figures/belle.jpg" alt="The Belle detector at KEK, Tsukuba" focus="50% 35%">
<div class="shade tr"></div>
<div class="num tr">2003<span class="name">KEK</span></div>
</StagePhoto>

<!-- facts: belle-cpv-2001, belle-x3872-2003, x3872-started-exotic-searches, theta-plus-leps-japan-19-events, leps-theta-not-confirmed -->

<!--
Belle at KEK, Tsukuba: in 2001 it confirmed Kobayashi and Maskawa's
prediction; in 2003 it found the X(3872), whose discovery started the hunt
for exotic hadrons. The same year LEPS at SPring-8 reported a five-quark
candidate; more sensitive experiments did not confirm it.
Sources: Belle,
PRL 87 (2001) 091802 and PRL 91 (2003) 262001; nobelprize.org; LEPS,
PRL 91 (2003) 012002; PDG. (~1.25 min)
-->

---
space: { at: lhcb, dim: 0.06 }
---

<div class="num tl">2015<span class="name">discovery</span></div>
<div class="num tr">2019<span class="name">precision</span></div>

<!-- facts: lambda-b-contains-b, lhcb-pentaquark-2015, lhcb-pentaquark-2019, pentaquark-idea-to-discovery-51-years -->

<!--
Many experiments looked, and several claims did not survive. Then in July
2015, LHCb reported the first convincing pentaquarks, fifty-one years after
Gell-Mann's paper. They are made of two up quarks, a down quark, and a pair
of a heavy "charm" quark and its antiquark.

In 2019, with nine times more data, LHCb looked again. This is the result:
each black point counts the particles we found at a given mass, the red line
is the fit, and the three narrow peaks are three pentaquarks. Where we had seen one bump in 2015, there were in fact
two, and a third appeared beside them.

The pentaquarks came out of the decays of the Λb, a baryon that carries a b
quark: Kobayashi and Maskawa's quark.

Sources: LHCb, PRL 115 (2015) 072001; LHCb, PRL 122 (2019) 222001; CERN
press release, 14 July 2015. (~1.75 min)
-->

---
space: { at: interiors, dim: 0.15 }
---

<!-- facts: lhcb-pentaquark-2019 -->

<!--
So pentaquarks exist. But we still do not know how they are built, and there
are two main pictures.

On the left, the five quarks are really two particles side by side, three
quarks in one and a quark with an antiquark in the other, held loosely
together like two atoms in a molecule. On the right, all five quarks are
packed into one ball.

The narrow peaks of 2019 point toward the molecule, but the question is
open. To settle it, we need precise measurements and precise theory that
predicts what each picture should look like in the data, worked out
together. (~1.25 min)
-->

---
space: { at: [229.3, 0, 0], dist: 7.5, yaw: 0, pitch: 6, dim: 0.15 }
---

<!-- facts: pc-molecule-deuteron-like, deuteron-one-pion-exchange, pion-yukawa-carrier-1947, pc-molecule-pion-exchange -->

<!--
The molecule up close: a three-quark particle and a quark–antiquark pair,
read as deuteron-like; Yukawa's pion exchange, which binds the deuteron, is
one of the glues theorists use for it, beside a short-range five-quark part.
Sources: PDG review "Pentaquarks" (2026); Y. Yamaguchi et al., PRD 96 (2017)
114031. (~1 min)
-->

---
space: { at: globe }
---

<VideoPlayer src="vilnius_back.mp4" transition="fade" />

<!--
The coming back (owner, 27 Oct: "Show Nagoya / Vilnius on a globe indicate collaboration
(maybe after zoomout video coming back)"). Clip vilnius_back.mp4 (12 s, no sound): slide 2's
zoom run backwards from further out, the cosmic web, past the galaxy, back to the Earth's limb.
It ends on that frame and waits for the press; the next slide starts from the same frame.
(~0.3 min)
-->

---
space: { at: globe }
---

<CollabGlobe src="figures/earth_back.jpg" />

<!-- facts: lhcb-vilnius-joined -->

<!--
The globe (owner, 27 Oct). The clip's last frame breaks into grains, which fly onto a slowly
turning globe of grains (coastlines, Natural Earth, public domain); Vilnius lights, then
Nagoya, and a strand of light is drawn between them, a pulse running along it. No text.
Vilnius University (LHCb data) and Nagoya University (theory): the project.
Sources: Natural Earth; Vilnius University. (~1 min)
-->

---
space: { at: project, dim: 0.6 }
---

<StagePhoto src="figures/vilnius.jpg" alt="The Great Courtyard of Vilnius University" focus="50% 45%" class="darker">
<div class="shade bl br"></div>
<div class="num bl">2024<span class="name">LHCb</span></div>
<div class="num br">13<span class="name">students</span></div>
</StagePhoto>

<!-- facts: lhcb-vilnius-joined, lhcb-vilnius-students -->

<!--
Vilnius University: an LHCb institute since September 2024; most of the group
are students, and 13 VU students did CERN summer placements in 2026.
Sources: Vilnius University news. (~1.25 min)
-->

---
space: { at: project, dim: 0.6 }
---

<StagePhoto src="figures/scifi.jpg" alt="A SciFi tracker frame with its fibre modules lowered into the LHCb cavern, May 2021" focus="50% 50%">
<div class="shade bl"></div>
<div class="num bl">524 288<span class="name">Hamamatsu sensors</span></div>
</StagePhoto>

<!-- facts: lhcb-scifi-channels, hamamatsu-japanese, hamamatsu-lhcb-scifi-sipm, lhcb-vilnius-scifi-lis -->

<!--
A SciFi tracker frame with its fibre modules going into the LHCb cavern (CERN
photo, May 2021; cropped clear of the workers): its fibres are read by 524 288 channels of Hamamatsu
(Japan) sensors; the Vilnius group's service work includes the SciFi and its
light injection system.
Sources: arXiv:2305.10515; hamamatsu.com; CERN Indico
(LHCb Vilnius, 3 October 2024). (~1 min)
-->

---
space: { at: [203, 0, 0], dist: 12, yaw: 4, pitch: 2, dim: 0.2 }
---

<div class="num tl">38.3 TB<span class="name">open data</span></div>

<!-- facts: stonkus-bsc-2026 -->

<!--
A Vilnius bachelor's thesis (2026) found the pentaquark signal again in LHCb's
open data (38.3 TB filtered), a reproduction, not an independent observation.
Source: D. Stonkus, BSc thesis, Vilnius University (2026). (~1 min)
-->

---
space: { at: project, dim: 0.15 }
---

<!-- facts: lhcb-vilnius-joined -->

<!--
This is what our project does. On the left, the people of the LHCb group at
Vilnius University, who analyse LHCb data. On the right, theorists in Japan,
at Nagoya University, who specialise in the theory of these particles. In
the middle, the pentaquark that both sides study.

We work as one team: the theory predicts what each picture of the
pentaquark should leave in the data, and we test those predictions with
LHCb measurements. Young researchers on both sides learn to work across
experiment and theory.

(The project's dates, its funders and next week's meeting in Nagoya go on
this slide once the owner confirms they may be shown.)

Sources: Vilnius University (LHCb Vilnius, 2024). (~1.5 min)
-->

---
space:
  path: [[0, { at: [270, 0, 0], dist: 17, yaw: 0, pitch: 8 }], [3, { at: [250, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [6, { at: [220, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [9, { at: [190, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [12, { at: [160, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [15, { at: [130, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [18, { at: [100, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [21, { at: [70, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [24, { at: [40, 0, 0], dist: 24, yaw: 55, pitch: 10 }], [27, { at: [10, 0, 0], dist: 22, yaw: 40, pitch: 12 }], [30.5, { at: [-26, 0, 0], dist: 14, yaw: -20, pitch: 12 }], [33, { at: [-31.5, 0.4, 0], dist: 12, yaw: -30, pitch: 14 }]]
  ambient: [[0, 1], [31, 1], [33.4, 0.12], [35.2, 0.12], [37, 1]]
  dim: 0.1
---

<Regather :at="35" />

<div class="credits credit">Photos: H. Yukawa, Nobel Foundation archive (public domain); S. Sakata, Ken Domon (public domain); M. Kobayashi, The Japan Academy, CC BY 4.0; T. Maskawa, OIST, CC BY 2.0; Belle, yellow_bird_woodstock, CC BY-SA 2.0; Vilnius University, Diliff, CC BY-SA 3.0; Nagoya University, DrKssn, CC BY-SA 3.0; all via Wikimedia Commons, Belle and the portraits cropped. Zoom: Google Earth (Landsat / Copernicus; Airbus, CNES / Airbus, Maxar Technologies), SpaceEngine; cosmic web: NCSA Advanced Visualization Lab. Globe: Natural Earth.</div>

<!--
The finale's take (2026-10-26; recorded after the toolkit bump, then this slide plays the
clip, muted, with Starfire's peak on the regathering: talks/…/CLAUDE.md, Decisions). From
the two teams the camera runs back along the whole route, pentaquark to collider, to the
cover's pose; the world falls dark for a moment, and on 35 s the five quarks fly in again
as on the cover.

Close. Back at the pentaquark from the start; the hum returns.

Five quarks were allowed on paper in 1964 and found in 2015. What they are
made of is the question that Lithuanian and Japanese physicists now answer
together. Thank you, and thank you to the Embassy for bringing us together
today. (~1.25 min)
-->
