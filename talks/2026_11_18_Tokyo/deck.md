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
duration: 15min
layout: cover
space:
  at: wide
---

<!--
Cover. No words on screen: the five quarks fly in out of the dust and lock
into one particle while the low hum swells; `c` replays it.

Your Excellency, ladies and gentlemen, thank you for having me. I am
Mindaugas Šarpis. I lead the LHCb group at Vilnius University, which works
on one of the four large experiments at CERN, near Geneva. In the next
fifteen minutes I would like to show you what this object behind me is, why
physicists waited half a century to find it, and why Lithuanian and Japanese
scientists are now studying it together. (~1 min)
-->

---
space: { at: lhc, dim: 0.25 }
---

<div class="num tr">27 km<span>LHC</span></div>

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
space: { at: nucleus, dim: 0.15 }
---

<!--
Come closer, and the nucleus is a tight bundle of protons and neutrons, held
together by the strong force. At these distances it is far stronger than the
electric force that pushes the protons apart. (~0.75 min)
-->

---
space: { at: proton, dim: 0.2 }
---

<div class="num tr">1 %<span>mass</span></div>

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
space: { at: paper, dim: 0.06 }
---

<div class="num tr">1964<span>quarks</span></div>

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
space: { at: lhcb, dim: 0.06 }
---

<div class="num tl">2015<span>discovery</span></div>
<div class="num bl">2019<span>precision</span></div>

<!-- facts: lhcb-pentaquark-2015, lhcb-pentaquark-2019, pentaquark-idea-to-discovery-51-years -->

<!--
Many experiments looked, and several claims did not survive. Then in July
2015, LHCb reported the first convincing pentaquarks, fifty-one years after
Gell-Mann's paper. They are made of two up quarks, a down quark, and a pair
of a heavy "charm" quark and its antiquark.

In 2019, with nine times more data, LHCb looked again. This is the result:
each black point counts the particles we found at a given mass, the red line
is the fit, and the three narrow peaks are three pentaquarks. Where we had seen one bump in 2015, there were in fact
two, and a third appeared beside them.

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
together. (~1.5 min)
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

Sources: Vilnius University (LHCb Vilnius, 2024). (~2 min)
-->

---
space: { at: hero, dist: 8, yaw: 20, pitch: -6, dim: 0.1 }
---

<!--
Close. Back at the pentaquark from the start; the hum returns.

Five quarks were allowed on paper in 1964 and found in 2015. What they are
made of is the question that Lithuanian and Japanese physicists now answer
together. Thank you, and thank you to the Embassy for bringing us together
today. (~0.5 min)
-->
