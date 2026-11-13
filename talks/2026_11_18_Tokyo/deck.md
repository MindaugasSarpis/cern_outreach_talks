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
  # the look (owner, 10 Nov: "a bit less graininess a bit more fidelity, now some parts look like through a fog"):
  # a deeper ground, no film grain or colour fringe, less bloom around bright things, fewer of the soft dust discs
  # near the camera. With it: the paper texture off (styles/index.css), the ground's glows lowered and the dust
  # nearest the camera capped in size (setup/look.js), the photographs at a lighter tone (space.json).
  palette: { base: classic, bg: '#020203' }
  plugins: [hadron]
  lang: en
  # maxBufferWidth: the drawing buffer at most 1920 wide, a projector's 1080p in full, a Retina Mac's screen at a
  # little over half its pixels (owner, 27 Oct: "make sure it works on a mac"; Innoday's fix for the M2's lag, 22 Oct)
  options: { maxBufferWidth: 1920, grain: 0, aberration: 0, bloom: 0.32, density: 0.6 }
  # the hum only. 12 Nov: the clips' rising tone was put back on for "effect across the board" and taken off again the same
  # day (the owner: 'No weird "scooter sound" in transitions'); the flights' whoosh was the "driving sounds" of 13 Oct.
  sound: { flight: false, clip: false }
  motion: floor   # v0.11 (owner, 5 Nov: "use the most up-to-date tools"): under reduced motion the world runs, floored; without WebGL the slides' recorded plates play
title: "Lithuania and Japan: pentaquarks"
lang: en                  # slides and notes; `pnpm talk lint` reads it
sources: notes            # sources in the speaker notes
onscreen: words           # captions (the owner, 5 Nov: "Need more words on the slides … all of the captions also disappeared"); no titles
htmlAttrs:
  lang: en
duration: 15min
layout: cover
space: { at: [-32.2, 0.4, 0], dist: 12, yaw: -30, pitch: 14, sway: 1.5, dim: 0.12 }
---

<!-- 10 Nov (the owner: "Need a very cool collision on the cover, like from the uzsikrauk karjerai. And only then a
     pentaquark appears (could be more substantial, a bit more dynamic)"): Karjera's cover. The slow, silent CMS loop
     (`cover-collision`) far behind the particle on the camera's line through it; the colour-charge pentaquark
     (`pentaquark-cc`, u u d c c̄, gluon springs, the sea's pairs, a skin) gathers out of the first crossing's flash
     (~4 s, <CoverCollision>), larger than Karjera's, its quarks moving inside it. -->
<CoverCollision />

<div class="tokyo-title">
  <div class="t">Unraveling the Structure of P<sub>c</sub> Pentaquarks through Joint Experimental and Theoretical Effort between Lithuanian and Japanese scientists</div>
  <div class="who">Mindaugas Šarpis, Vilnius University<br>Yasuhiro Yamaguchi, Nagoya University</div>
</div>

<!--
Title slide (the owner's exception to the no-title rule): the project's full
name and the two project leaders, Mindaugas Šarpis (Vilnius) and Yasuhiro
Yamaguchi (Japan). A CMS collision replays slowly far behind; out of its first
crossing's flash the pentaquark (u u d c c̄ in colour charge) gathers at the
right while the low hum swells; the title fades in as it lands.

Your Excellency, ladies and gentlemen, thank you for having me. I am
Mindaugas Šarpis, and together with Yasuhiro Yamaguchi I lead the project
named on the screen. I lead the LHCb group at Vilnius University, which works
on one of the four large experiments at CERN, near Geneva. In the next
fifteen minutes I would like to show you what this object behind me is, why
physicists waited half a century to find it, and why Lithuanian and Japanese
scientists are now studying it together. (~0.5 min)
-->

---
space: { at: proton, dim: 0.2 }
---

<!-- the owner, 10 Nov: "this slide should be replaced by the sped up zoomin video into the world of atoms";
     the caption "A proton: three quarks, never seen alone" left (a marketing line). atoms_fast.mp4: the
     library's atoms.mp4 (a hair down to the quarks of a proton) sped up; it ends on the proton and waits. -->
<VideoPlayer src="atoms_fast.mp4" muted :controls="false" />
<!-- The music (12 Nov: "need some mild soundtrack for the theorists introduction … maybe just age of wonder throughout";
     13 Nov: "the soundtrack should be a bit milder throughout, a build-up mode"): Scott Buckley's „Age of Wonder“ from
     here to the end, building: one bed (audio/wonder_bed.m4a, 16 min; videos/music/wonder_bed.py: the piece played
     forward, stepping back whole four-bar phrases on its own bar grid where length is needed, never to its opening;
     the owner, 13 Nov: "the sountrack was just restarted … it went better in uzsikrauk karjerai"), its level a little
     up from slide to slide (0.16 … 0.45). The finale has „Starfire“'s crescendo and arrival on its collision (the finale's comment).
     `+` / `-` set the level in the talk. The cover has the collision's own sound and no music. -->
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.3" start keys />

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
news.

11 Nov (the audience is scientists): the clip runs with a line or two over it, so half a minute beside
the clip, 47 s since 12 Nov. (~0.5 min)
-->

---
space: { at: sakata, dim: 0.15 }
---

<div class="num tr">1956<span class="name">Nagoya</span></div>
<div class="cap">Shoichi Sakata proposes a precursor to the quark model</div>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.16" start keys />

<!-- facts: sakata-model-1956, sakata-nagoya-1956 -->

<!--
Shoichi Sakata at Nagoya University: in 1956, every such particle built from
three basic ones; in the Nobel Committee's words, "the Sakata particles
finally became the quarks of Gell-Mann".
Sources: S. Sakata, Prog. Theor.
Phys. 16 (1956) 686; nobelprize.org (Scientific Background 2008). (~0.75 min)
-->

---
space: { at: paper, dim: 0.06 }
---

<div class="num tr">1964<span class="name">quarks</span></div>
<div class="cap r">Gell-Mann and Zweig propose the quark model</div>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.16" start keys />

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
(1964). (~1 min)
-->

---
space: { at: km, dim: 0.15 }
---

<div class="num tr">1973<span class="name">six quarks</span></div>
<div class="cap">Kobayashi and Maskawa propose six quarks, including the b quark</div>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.18" start keys />

<!-- facts: kobayashi-maskawa-1973, kobayashi-maskawa-nagoya-phd, kobayashi-maskawa-nobel-2008, b-quark-1977, lhcb-b-for-beauty -->

<!--
Makoto Kobayashi and Toshihide Maskawa, both from Sakata's school in Nagoya:
in 1972-73, three families of quarks (six) when three quarks were known; the fifth, b, found in 1977, is the
"b" in LHCb (Nobel Prize 2008).
Sources: Prog. Theor. Phys. 49 (1973) 652;
nobelprize.org; home.cern. (~0.75 min)
-->

---
space: { at: proton, dim: 0.97 }   # the world nearly dark: the flat slide carries it
---

<!-- 12 Nov (the owner: "After Kobayashi, Masakawaa, a slide just highlighting how difficult is QCD"; then, the same
     evening: "slide 6 should be reimagined, just floating QCD lagrangians, equations, diagrams to show how complicated it
     is, full screen of all sorts of diagrams / equations floating at different depts appearing"): setup/QcdStorm.vue.
     The equations are the blocks below, one a paragraph; the diagrams are the component's. The curve of the coupling
     (QcdCoupling.vue) left with the first version. -->
<QcdStorm>

$$\mathcal{L}_{\mathrm{QCD}} = \sum_f \bar\psi_f\left(i\gamma^\mu D_\mu - m_f\right)\psi_f - \tfrac14\, G^a_{\mu\nu}G^{a\,\mu\nu}$$

$$D_\mu = \partial_\mu - i g_s T^a A^a_\mu$$

$$G^a_{\mu\nu} = \partial_\mu A^a_\nu - \partial_\nu A^a_\mu + g_s f^{abc} A^b_\mu A^c_\nu$$

$$\left[T^a, T^b\right] = i f^{abc}\, T^c$$

$$\mu^2 \frac{d\alpha_s}{d\mu^2} = -\frac{\alpha_s^2}{4\pi}\left(11 - \tfrac23 n_f\right) + \mathcal{O}(\alpha_s^3)$$

$$\alpha_s(Q^2) = \frac{12\pi}{(33 - 2n_f)\,\ln\!\left(Q^2/\Lambda^2\right)}$$

$$\langle O\rangle = \frac1Z\int \mathcal{D}U\; \det M[U]\; O[U]\; e^{-S_g[U]}$$

$$S_g = \beta \sum_{\square}\left(1 - \tfrac13\,\mathrm{Re}\,\mathrm{Tr}\, U_\square\right)$$

$$V(r) = -\frac43\,\frac{\alpha_s}{r} + \sigma r$$

$$\mathcal{L}_{3g} = -g_s f^{abc}\left(\partial_\mu A^a_\nu\right)A^{b\,\mu}A^{c\,\nu}$$

$$\mathcal{L}_{4g} = -\tfrac14\, g_s^2\, f^{abe}f^{cde}\, A^a_\mu A^b_\nu A^{c\,\mu}A^{d\,\nu}$$

$$\mathcal{L}_{\mathrm{gf}} = -\frac{1}{2\xi}\left(\partial^\mu A^a_\mu\right)^2 + \left(\partial^\mu \bar c^a\right) D^{ab}_\mu c^b$$

$$\frac{\partial q(x,\mu^2)}{\partial \ln\mu^2} = \frac{\alpha_s}{2\pi}\int_x^1 \frac{dz}{z}\, P_{qq}(z)\, q\!\left(\frac{x}{z},\mu^2\right)$$

$$P_{qq}(z) = \frac43\left[\frac{1+z^2}{(1-z)_+} + \frac32\,\delta(1-z)\right]$$

$$m_\pi^2 f_\pi^2 = -(m_u + m_d)\,\langle \bar q q\rangle$$

$$T^\mu_{\ \mu} = \frac{\beta(g_s)}{2 g_s}\, G^a_{\mu\nu}G^{a\,\mu\nu} + \sum_q m_q\, \bar q q$$

</QcdStorm>
<!-- 14 Nov, the owner's own caption ("quantum chromodynamics - the very frontier of human knowledge"), his exception to
     his rule of 10 Nov against such lines; set with a colon as the deck's other captions -->
<div class="cap">Quantum chromodynamics: the very frontier of human knowledge</div>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.2" start keys />

<!-- facts: asymptotic-freedom-1973, alpha-s-world-average-2024, proton-mass-quarks-1-percent -->

<!--
Why hadrons are hard: the slide fills with QCD's own equations and diagrams. On it: the Lagrangian, the covariant
derivative and the field strength, the colour algebra, the three- and four-gluon terms, the gauge-fixing and ghost
terms; the one-loop running of the coupling and its solution; the lattice path integral and Wilson's plaquette
action; the Cornell potential; the DGLAP equation and its quark splitting function; the Gell-Mann–Oakes–Renner
relation; the trace anomaly (to leading order, the quark masses' anomalous dimension left out). The diagrams: the
quark–gluon, three-gluon and four-gluon vertices, one- and two-gluon exchange, the quark's and the gluon's
self-energies (a quark loop, a gluon loop), a vertex correction.
In 1973, the year of Kobayashi and Maskawa's paper, Gross, Wilczek and Politzer showed that the coupling falls with
energy (asymptotic freedom; Nobel Prize 2004): α_s = 0.118 at the Z mass, where QCD is computed as a series in it;
toward 1 GeV, the scale of hadrons, the series stops converging, and the masses and structure of hadrons, the
pentaquarks among them, come from lattice QCD and from models.
Sources: PDG, Review of Particle Physics 2024, "Quantum Chromodynamics"; D. J. Gross and F. Wilczek, PRL 30
(1973) 1343; H. D. Politzer, PRL 30 (1973) 1346; M. E. Peskin and D. V. Schroeder, An Introduction to Quantum
Field Theory, ch. 16 (the conventions of the Lagrangian's terms). (~0.5 min)
-->

---
space: { at: families, dim: 0.97 }   # the world nearly dark: the flat slide carries it
---

<QuarkRecipes />
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.22" start keys />

<!-- facts: kaon-quark-content, lambda-b-contains-b, gellmann-1964-five-quark-sentence, exotic-hadrons-particle-zoo -->

<!--
The six quarks in the Standard Model's frame (owner, 5 Nov: "a frame of all SM quarks, and then
how they form baryons and mesons, with different combinations"), then the recipes one after
another: mesons (a quark and an antiquark: π⁺ u d̄, K⁺ u s̄, D⁰ c ū, J/ψ c c̄, B⁺ u b̄, Υ b b̄),
baryons (three quarks: p uud, n udd, Λ uds, Ω⁻ sss, Λc⁺ udc, Ξcc⁺⁺ ucc, LHCb 2017, Λb⁰ udb),
and last five, uudcc̄, a pentaquark. Top stays dim: it decays before it can bind (the owner:
"just t quark doesn't hadronize"). setup/QuarkRecipes.vue; it runs once, about 30 s, and holds.
Sources: PDG (quark model); LHCb, PRL 119 (2017) 112001 (Ξcc⁺⁺).
11 Nov (the audience is scientists): the recipes run their 30 s and the talk goes on. (~0.75 min)
-->

---
space: { at: km, dim: 0.6 }
---

<!-- 12 Nov, evening (the owner: "belle should be shown after introduction to baryons and mezons in slide 8"): after the recipes.
     back from the hidden slides on 11 Nov (the owner: the audience is Japanese and Lithuanian scientists, from
     Nagoya, Tokyo and RIKEN): the Japanese thread goes on from Kobayashi and Maskawa to the experiment that
     confirmed them and then found the X(3872). The caption follows the facts bank: a candidate, never
     "the first exotic hadron". -->
<!-- 14 Nov (the owner: "KEK picture should zoom out slowly"): the photo drawn on a canvas over itself, from 1.16 times back
     to its full frame over 40 s (setup/PanCanvas.vue) -->
<StagePhoto src="figures/belle.jpg" alt="The Belle detector at KEK, Tsukuba" focus="50% 50%">
<PanCanvas src="figures/belle.jpg" :from="1.16" :to="1" :drift="[0, 0]" :focus="[50, 50]" :delay="0.5" :seconds="40" />
<div class="shade tr strong"></div>
<div class="num tr">2003<span class="name">KEK</span></div>
<div class="cap">Belle discovers the X(3872), an exotic hadron candidate</div>
</StagePhoto>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.22" start keys />

<!-- facts: belle-cpv-2001, belle-x3872-2003, x3872-started-exotic-searches, theta-plus-leps-japan-19-events, leps-theta-not-confirmed -->

<!--
Belle at KEK, Tsukuba: in 2001 it confirmed Kobayashi and Maskawa's
prediction; in 2003 it found the X(3872), whose discovery started the hunt
for exotic hadrons. The same year LEPS at SPring-8 reported a five-quark
candidate; more sensitive experiments did not confirm it.
Sources: Belle,
PRL 87 (2001) 091802 and PRL 91 (2003) 262001; nobelprize.org; LEPS,
PRL 91 (2003) 012002; PDG. (~0.75 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<!-- 12 Nov, later (the owner: "the first three slides should go after qcd / quark model introduction and belle"):
     CERN, the LHC and LHCb stand here, after the quarks' history and the recipes and before LHCb's data. -->

<VideoPlayer src="cern_overview_swoosh.mp4" />
<AtClipEnd :lead="0.6"><div class="veil tl"></div><div class="num tl">2018<span class="name">Lithuania: associate member</span></div></AtClipEnd>
<div class="cap">CERN, Geneva: the world’s largest particle physics laboratory</div>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.26" start keys />

<!-- facts: lhc-geneva-27km-100m-four-experiments, cern-lithuania -->

<!--
CERN (owner, 27 Oct). The clip is cern_overview_swoosh.mp4 (11 s): the library's cern_overview_short.mp4
with a swoosh on its dive through the clouds (10 Nov; videos/manifest.toml): from the Earth down to Geneva,
then the LHC ring drawn over the fields with its four experiments named. As it ends: 2018, the year
Lithuania became an associate member of CERN.
Sources: home.cern. (~0.5 min)
-->

---
space: { at: lhc, dim: 0.25 }
---

<VideoPlayer src="cern_footage_2022_013_001_tunnel_cut.mp4" muted />
<!-- 14 Nov (the owner: "Slide 10 captions appear, dissapear and appear again, only need to appear some time after video
     starts"): they stood over the world, went under the clip as it condensed and came back. Now they come once, 2.5 s
     into the clip (<AtClipEnd> counts from the clip's end: 18 s less 15.5 s) -->
<AtClipEnd :lead="15.5">
<div class="veil top"></div>
<div class="nums3">
  <div class="num">27 km<span class="name">LHC ring</span></div>
  <div class="num">13.6 TeV<span class="name">collision energy</span></div>
  <div class="num">−271.3 °C<span class="name">magnets</span></div>
</div>
<div class="cap">The Large Hadron Collider, 100 m underground</div>
</AtClipEnd>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.28" start keys />

<!-- facts: lhc-geneva-27km-100m-four-experiments, cern-lhc-size-cost, cern-lhc-energy, cern-lhc-cold, gave-cryo-lhc, cern-lithuania, cern-members-2026, lhc-turns-per-second, japan-lhc-contribution -->

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

On screen (10 Nov, the owner: "LHC should also say the energy, the temperature"): 13.6 TeV, the
collision energy of Run 3 (2022–2026, two 6.8 TeV beams); −271.3 °C (1.9 K), the superconducting magnets
when running, colder than outer space (2.7 K). Since Long Shutdown 3 began on 29 June 2026 the LHC is warm
for the HL-LHC upgrade: say "when it runs".

Sources: home.cern (LHC facts; member states; Lithuania; "Japan contributes
an additional 5 billion yen", 1998; Long Shutdown 3). (~0.5 min)
-->

---
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<!-- the clip's own music is off since 12 Nov: „Age of Wonder“ runs under the whole talk (slide 2's comment) -->
<VideoPlayer src="lhcb.mp4" muted />
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.4" start keys />
<div class="cap">LHCb Experiment at CERN</div>

<!--
Clip: lhcb.mp4, the LHCb detector in 3D with music (0:47, library clip), its music on (owner, 10 Nov:
"can have the soundtrack here"; caption "LHCb Experiment at CERN").
Let it play; at most one line over the music: "This is LHCb, the experiment
my group works on: a detector the size of a house, built to catch what comes
out of the collisions." It condenses out of the dust and leaves the same way.
(~0.5 min)
-->

---
space: { at: lhcb, dim: 0.97, recorded: clip }   # the world nearly dark under the clip; a back-step or a jump holds the clip's end
---

<!-- recorded (the owner, 10 Nov: "we want to have a peak from the fit. Also building up the histogram could be a bit
     more substantial, maybe like in uzsikrauk karjerai … (even involving the detector)"): data2019c.mp4 is the data
     take of takes.md (takes/README.md): a collision in LHCb, its grains landing as the 2019 histogram, the fit drawn
     over it, the three peaks lit. The axis and the names are HTML over the clip's settled end, so they stay sharp:
     the positions are the histogram's in the clip's last frame, in slide units; move them if the take's camera moves. -->
<!-- 13 Nov (the owner: "need low swoosh effect on 12 has to be really astonishing"): the clip has its own sound now
     (videos/clips/data_swoosh.py: the run-in's swell, the crossing's thump, the grains' trickle, a low swoosh from left to
     right as the camera flies to the histogram, a deep landing as it arrives, three glints as the peaks light), so it
     plays unmuted, over the music -->
<VideoPlayer src="data2019c.mp4" :controls="false" transition="fade" />
<!-- 13 Nov (the owner: "histogram stays dynamic, slowly zooming in line maybe running trough from time to time, orbiting"):
     as the clip ends its loop takes over (data_loopb.mp4: a light runs along the fit every 6 s, the peaks breathe), and
     clip, loop and the labels over them drift together: a slow zoom in and a gentle turn to and fro (setup/EndDrift.vue) -->
<!-- (videos:check reads a clip's use from a player tag; <ClipLoop> is not one, so the loop is named here for it:
     <VideoPlayer src="data_loopb.mp4" muted loop />) -->
<ClipLoop src="data_loopb.mp4" />
<EndDrift :at="[50, 42]" :zoom="1.3" :sway="4.5" :period="20" :seconds="100" />
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.28" start keys />   <!-- low here: the collision is the loud thing (13 Nov: "louder than the music") -->
<AtClipEnd :lead="5"><div class="spec-axis"><i style="left: 283.6px">4300</i><i style="left: 447.7px">4400</i><i style="left: 611.7px">4500</i><b>mass of J/ψ p (MeV)</b></div></AtClipEnd>
<AtClipEnd :lead="4"><div class="spec-names"><i class="c" style="left: 300px; top: 112px">P<sub>c</sub>(4312)<sup>+</sup></i><i class="r" style="left: 498px; top: 44px">P<sub>c</sub>(4440)<sup>+</sup></i><i class="l" style="left: 556px; top: 22px">P<sub>c</sub>(4457)<sup>+</sup></i></div></AtClipEnd>
<div class="cap">LHCb, 2019: the J/ψ p mass in Λ<sub>b</sub><sup>0</sup> → J/ψ p K<sup>−</sup> decays</div>

<!-- facts: lambda-b-contains-b, lhcb-pentaquark-2015, lhcb-pentaquark-2019, pentaquark-idea-to-discovery-51-years -->

<!--
Many experiments looked, and several claims did not survive. Then in July
2015, LHCb reported the first convincing pentaquarks, fifty-one years after
Gell-Mann's paper. They are made of two up quarks, a down quark, and a pair
of a heavy "charm" quark and its antiquark.

In 2019, with nine times more data, LHCb looked again. This is the result:
the histogram counts the particle pairs we found at each mass, the white
line is the fit, and the three narrow peaks are three pentaquarks. Where we
had seen one bump in 2015, there were in fact two, and a third appeared
beside them.

The pentaquarks came out of the decays of the Λb, a baryon that carries a b
quark: Kobayashi and Maskawa's quark.

The clip (data2019c.mp4, 24 s, no sound; 10 Nov): LHCb's detector, a collision in it, grains leaving the
detector and landing as the histogram of the J/ψ p mass, 4250–4600 MeV; the camera comes to the histogram
(18.7 s), the fit is drawn over it in white and the three peaks light; then the axis and the names.
The plot: HEPData ins1728691, Table 3 (the cos θ-weighted candidates of the paper's Fig. 6, 2 MeV bins), and a
fit of it made here as the paper's (bake/fit_2019.py): three Breit–Wigner peaks over a polynomial background.
Sources: LHCb, PRL 115 (2015) 072001; LHCb, PRL 122 (2019) 222001 (HEPData ins1728691, CC BY 4.0); CERN
press release, 14 July 2015. (~1 min)
-->

---
space: { at: lhcb, dim: 0.97 }
---

<!-- 10 Nov (the owner: "on the next slide dynamically build up a dalitz plot in 3D space from 2019 result"):
     setup/Dalitz3D.vue, the paper's Dalitz plot digitised (public/data/dalitz-2019.json). -->
<Dalitz3D />
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.34" start keys />
<div class="cap">LHCb, 2019</div>

<!-- facts: lhcb-pentaquark-2019 -->

<!--
The same 2019 decays, each one a point placed by two masses: across, the kaon with the proton; up, the
J/ψ with the proton. Seen from above as the paper draws it, the candidates fall in; then it tilts and the
columns rise to their counts. The tall ridge on the left is a known particle, the Λ(1520), made of the kaon
and the proton; the band across is the pentaquarks, P_c(4440)⁺ and P_c(4457)⁺, made of the J/ψ and the
proton (the P_c(4312)⁺ is a fainter band below it). A molecule and a compact particle leave different
patterns here: this is the picture theory and experiment are compared on.
The data: LHCb, PRL 122 (2019) 222001, the Dalitz-plot figure (CC BY 4.0), digitised from its colours into
200 × 200 cells (bake/dalitz_digitise.py; counts approximate: ~252 000 against the paper's ~246 000),
shown as 100 × 100 columns, height as √count. As the names come in, the columns of the P_c(4312)⁺ band and
of the P_c(4440)⁺ and P_c(4457)⁺ band are lit toward white where m(K⁻ p) > 1.9 GeV, the paper's cut: colour
only, every height is its count (11 Nov, the owner: "Dalitz should be 2019 data").
Sources: LHCb, PRL 122 (2019) 222001. (~0.75 min)
-->

---
space: { at: interiors, dim: 0.15, sway: 24 }   # the camera swings slowly round the three (±24°, a 46 s period)
---

<!-- 10 Nov (the owner: "On slide 11 can also show hadroquarkonium, give this a bit more depth, maybe some slow
     orbiting around them"): three pictures named under them; the rhetorical caption left. -->
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.34" start keys />
<div class="cap">Pentaquark: molecule, compact or hadroquarkonium</div>

<!-- facts: lhcb-pentaquark-2019, pc-hadrocharmonium-picture -->

<!--
So pentaquarks exist. But we still do not know how they are built, and there
are three main pictures.

On the left, the five quarks are really two particles side by side, three
quarks in one and a quark with an antiquark in the other, held loosely
together like two atoms in a molecule. In the middle, all five quarks are
packed into one ball. On the right, hadroquarkonium: a tight charm–anticharm
pair, a J/ψ-like core, sitting inside a cloud of the three light quarks.

The narrow peaks of 2019 point toward the molecule, but the question is
open. To settle it, we need precise measurements and precise theory that
predicts what each picture should look like in the data, worked out
together. Yukawa's pion as the molecule's glue, and the theory, are Yasuhiro Yamaguchi's talk, next (15-min cut, 5 Nov).
Hadroquarkonium: S. Dubynskiy and M. B. Voloshin, PLB 666 (2008) 344; M. I. Eides, V. Yu. Petrov and M. V. Polyakov,
PRD 93 (2016) 054039 (the Pc as nucleon–ψ(2S) bound states). (~1 min)
-->

---
space: { at: globe, recorded: clip }   # v0.11: a back-step or a jump holds the clip's settled end
---

<!-- recorded (owner, 27 Oct: "Deploy, make sure it works on a mac. The heavy point cloud should be
     pre-rendered as a video"; 10 Nov: "Slide 13 could zoom in and rotate earth"): globeb.mp4 is the globe
     take, takes.md slide 4 (CollabGlobe with figures/earth_back.jpg, setup/globe.js); to change it, change
     the take, record and cut it (takes/README.md) and encode. The `globe` station here is the take's end,
     so the slide after rests on the clip's last view. Fade, not cut: a cut clip never announces that it
     covers the slide, so the world would draw on under it (Innoday, 22 Oct). -->
<VideoPlayer src="globeb.mp4" muted :controls="false" transition="fade" />
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.42" start keys />
<!-- 11 Nov (the audience comes from Nagoya, Tokyo and RIKEN): the lit cities named once the globe rests (the clip
     from 15 s). The names are the slide's, over the clip's settled end, as slide 11's axis: the dots' places are
     the clip's last frame in slide units (Vilnius 290.7, 55.1; Nagoya 692.9, 326.1; Tokyo 705.8, 316.1; RIKEN's
     Wako campus is 15 km from Tokyo's dot, the same light at this scale, so the two names share a line and a
     bracket). Vilnius's name stands west of its light: the strand leaves it eastward. Nagoya's and Tokyo's
     lights are one white patch in the clip, so each is marked by a small dark dot where its line ends. Tokyo's
     line meets the bracket at y = 292, clear of a star of the clip's last frame at (762, 308). Move them if
     the take's end moves. -->
<!-- 13 Nov (the owner: "15 definitely shouldn't freeze, slowly rotate earth, pulse the line connecting japan and
     lithuania"): as the clip ends its loop takes over (globe_loop.mp4, 36 s: six seconds on the clip's last view, then
     the globe turns 9° on east and comes back, the strand's pulse running all the while); the cities' names, which sit
     on that last view's lights, go while it is turned away and come back with it (setup/AtLoopRest.vue). The zoom of
     12 Nov (<ZoomOn>) left: the turning is the motion now. (For videos:check, which reads a clip's use from a player
     tag: <VideoPlayer src="globe_loop.mp4" muted loop />) -->
<ClipLoop src="globe_loop.mp4" />
<AtLoopRest :lead="4" :rest="5.6" :again="35.3"><svg class="globe-names" viewBox="0 0 980 551.25" aria-hidden="true"><path class="case" d="M709.3 315.2 L778 292 M696.4 326.8 L778 344" /><path class="vil" d="M277 55.5 H252" /><path d="M709.3 315.2 L778 292 M778 280 V322 M696.4 326.8 L778 344" /><circle cx="705.8" cy="316.1" r="2.6" /><circle cx="692.9" cy="326.1" r="2.6" /><text class="vil" x="246" y="62" text-anchor="end">Vilnius</text><text x="786" y="294">RIKEN</text><text x="786" y="318">Tokyo</text><text x="786" y="351">Nagoya</text></svg></AtLoopRest>
<!-- 13 Nov (the owner: "on slide 15 show names of Lithuanian and Japanese participants, Margarita got deplaced by
     Dominykas"): the project's people, the Lithuanian side at the left, the Japanese at the right, from the clip's end
     on. The Japanese ten are the application's list; the Lithuanian six are its three main
     participants and the three the owner named on 13 Nov ("Lithuanian also: Rūta Racz, Šarūnas Jacevičius, Dominykas
     Stonkus"). The Japanese list stands at the top right, clear of the cities' names ("Maybe japanese names higher
     … at the top of the frame"). -->
<AtClipEnd :lead="3"><div class="people l"><b>Lithuania</b>Mindaugas Šarpis<br>Oleg Kravcov<br>Adam Morris<br>Rūta Racz<br>Šarūnas Jacevičius<br>Dominykas Stonkus</div><div class="people r"><b>Japan</b>Yasuhiro Yamaguchi<br>Takumi Doi<br>Tomona Kinugawa<br>Yan Lyu<br>Kotaro Murakami<br>Manato Sakai<br>Shota Ampuku<br>Zhibo Liu<br>Gento Yoshikawa<br>Kotaro Miyake</div></AtClipEnd>
<!-- no caption (13 Nov, the owner, of "Lithuania and Japan: Penta-Charm, 2026–2028, funded by …": "don't need this"):
     the cities' names are the slide's words; the project's name is on the cover, its years and funders are said -->

<!-- facts: lhcb-vilnius-joined -->

<!--
The globe (globeb.mp4, 20.6 s, no sound; 10 Nov): grains gather into a globe of grains with Europe in
the middle (coastlines, Natural Earth, public domain; Japan's the brightest); Vilnius lights, then
Nagoya and Tokyo at the right edge, and a strand of light is drawn from Vilnius to Nagoya, a pulse
running along it. From 3 s the globe turns east and the camera comes in; from 15 s it rests on Asia,
Vilnius upper left, Japan lower right.
Vilnius University (LHCb data) and the theorists in Japan, at Nagoya, Tokyo and RIKEN: the project.
The project runs from April 2026 to March 2028, funded by the Research Council of Lithuania (LMT) and the Japan
Society for the Promotion of Science (JSPS) in their bilateral programme (the owner, 5 Nov: may be shown).
Sources: Natural Earth; Vilnius University; the project's application. (~0.75 min)
-->

---
hide: true   # 14 Nov (the owner: "Don't need group photo and Nagoya university photo slides"); remove the line to bring it back
space: { at: project, dim: 0.6 }
---

<!-- 12 Nov (the owner: "group photo should have a slight pan / zoom effect so it's more dynamic"; then "it's stepping
     pixels rearraning"): the photo drawn again on a canvas over itself, pushing in and drifting for 44 s
     (setup/PanCanvas.vue; why a canvas: its comment) -->
<StagePhoto src="figures/vilnius_group.jpg" alt="The LHCb group at Vilnius University" focus="50% 50%">
<PanCanvas src="figures/vilnius_group.jpg" :focus="[50, 50]" />
<div class="cap">The LHCb group at Vilnius University</div>
</StagePhoto>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.42" start keys />

<!-- facts: lhcb-vilnius-joined, lhcb-vilnius-students -->

<!--
Vilnius University: an LHCb institute since September 2024; most of the group
are students, and 13 VU students did CERN summer placements in 2026.
Photo: the group (the owner's, 5 Nov 2026; team photos allowed, question 5).
Sources: Vilnius University news. (~0.75 min)
-->

---
hide: true   # 14 Nov (the owner: "Don't need group photo and Nagoya university photo slides"); remove the line to bring it back
space: { at: project, dim: 0.6 }
---

<!-- 13 Nov (the owner, asked what the talk still lacks, with the project's application: "we don't need the details.
     Maybe just something about japanese side"): the Japanese side beside the Vilnius group's photo: how many, where,
     and by what methods; no names (Yasuhiro Yamaguchi's is on the cover, and he speaks next). The photo is the one
     the hidden project slide used. -->
<StagePhoto src="figures/nagoya_p.jpg" alt="Nagoya University, Higashiyama campus: the Toyoda Auditorium" focus="50% 50%">
<PanCanvas src="figures/nagoya_p.jpg" :focus="[50, 50]" :drift="[1.4, -0.5]" />
<div class="shade tr strong"></div>
<div class="num tr">10<span class="name">theorists in Japan</span></div>
<div class="cap">Nagoya University, RIKEN and Institute of Science Tokyo: meson-exchange models, the quark model, lattice QCD</div>
</StagePhoto>
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.42" start keys />

<!-- facts: sakata-nagoya-1956, kobayashi-maskawa-nagoya-phd -->

<!--
The Japanese side: ten theorists, PhD and master's students among them, at Nagoya University (Sakata's university, and
Kobayashi's and Maskawa's), at RIKEN and at the Institute of Science Tokyo, led by Prof. Yasuhiro Yamaguchi, who speaks
next. They derive the interactions between the hadrons from meson-exchange models, from the quark model and from lattice
QCD, and predict what each picture of the pentaquark leaves in the data that the Vilnius group analyses.
Photo: Nagoya University, Higashiyama campus, the Toyoda Auditorium (DrKssn, CC BY-SA 3.0, Wikimedia Commons; credited
on the last page).
Sources: the project's application (the owner, 13 Nov: the Japanese side may be shown, without details); the event's
program; nobelprize.org (Kobayashi and Maskawa: Nagoya University PhDs). (~0.3 min)
-->

---
hide: true   # 12 Nov (the owner: "not just Nagoya, it's more institutes across japan now, maybe we should not show this at all"): its world shows Vilnius and Nagoya alone; the globe names the institutes, and its caption carries the project's name, years and funders
space: { at: project, dim: 0.15 }
---

<div class="num tc">2026–2028<span class="name">Penta-Charm</span></div>
<div class="cap">Funded by the Research Council of Lithuania and JSPS</div>

<!-- facts: lhcb-vilnius-joined -->

<!--
This is what our project does. On the left, Vilnius University, whose LHCb
group analyses LHCb data. On the right, Nagoya University in Japan, whose
theorists specialise in the theory of these particles. In the middle, the
pentaquark that both sides study.

We work as one team: the theory predicts what each picture of the
pentaquark should leave in the data, and we test those predictions with
LHCb measurements. Young researchers on both sides learn to work across
experiment and theory.

The project runs from April 2026 to March 2028, funded by the Research Council
of Lithuania (LMT) and the Japan Society for the Promotion of Science (JSPS)
in their bilateral programme (the owner, 5 Nov: may be shown).

Sources: Vilnius University (LHCb Vilnius, 2024); the project's application. (~0.75 min)
-->

---
hide: true   # the 15-min blueprint (owner, 5 Nov); remove to bring it back
space: { at: lhc, dist: 22, yaw: 15, pitch: 22 }
---

<VideoPlayer src="vilnius_out.mp4" />

<!-- facts: lhcb-vilnius-joined -->

<!--
Lithuania (owner, 27 Oct). Clip vilnius_out.mp4 (17.8 s, no sound): from NFTMC, Vilnius
University's physics campus in Saulėtekio slėnis, out over Vilnius (Google Earth) to the
clouds and the Earth's limb. It ends and waits for the press. The coming back is vilnius_back.mp4, hidden too.
Sources: the owner's SpaceEngine edit, stabilised for Užsikrauk karjerai (videos/manifest.toml).
(~0.5 min)
-->

---
hide: true   # the 15-min blueprint (owner, 5 Nov); remove to bring it back
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
hide: true   # the 15-min blueprint (owner, 5 Nov); remove to bring it back
space: { at: lhc, dist: 22, yaw: 15, pitch: 22, dim: 0.6 }
---

<StagePhoto src="figures/lhcb_detector.jpg" alt="The LHCb detector in its cavern under the LHCb banner, March 2024" focus="50% 50%">
<div class="shade tl strong"></div>
<div class="num tl">5 600 t<span class="name">LHCb</span></div>
</StagePhoto>

<!-- facts: lhcb-detector-size, lhcb-100m-below-ground, lhcb-three-storey-worked, lhcb-run3-readout-4tbs -->

<!--
What LHCb is (owner, 27 Oct). Photo: the LHCb detector in its cavern, March 2024
(CERN-PHOTO-202403-050-3, M. Brice). 5 600 tonnes, 21 m long, 10 m high (about three
storeys), 100 m under ground near Ferney-Voltaire; a forward spectrometer, its subdetectors one
behind another; 4 TB/s read out in real time in Run 3.
Sources: home.cern (LHCb); arXiv:2106.07701. (~0.75 min)
-->

---
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
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
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
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
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
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
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back. 12 Nov: Yukawa's portrait left the world (the owner: "On transition to 6 a photo of yukawa flashes … it's just there somewhere in space, not needed"): the camera passed it on the way to Sakata. To bring this slide back, put the page back at the `nucleus` station of public/data/space.json: { "type": "page", "src": "/figures/yukawa.jpg", "pos": [-6.2, 0.4, 0], "width": 2.4, "height": 3.2, "tone": "#d0d4da", "halo": false }
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
hide: true   # the 15-min blueprint (owner, 5 Nov); remove to bring it back
space: { at: families, dim: 0.15 }
---

<!--
For more than fifty years every particle built from quarks that we knew fell
into one of two families. On the left, a quark with an antiquark: a meson.
On the right, three quarks: a baryon, like the proton. Hundreds of such
particles are known, and they all follow these two recipes.

The question is whether nature allows more: four quarks, five, six. (~0.75 min)
-->

---
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
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
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
space: { at: project, dim: 0.6 }
---

<StagePhoto src="figures/scifi.jpg" alt="A SciFi tracker frame with its fibre modules lowered into the LHCb cavern, May 2021" focus="50% 50%">
<div class="shade tl strong"></div>
<div class="num tl">524 288<span class="name">Hamamatsu channels</span></div>
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
hide: true   # the 15-min cut (owner, 5 Nov); remove to bring it back
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
space: { at: [-31.5, 0.4, 0], dist: 12, yaw: -30, pitch: 14, dim: 0.1, recorded: clip }   # the world rests under the clip; v0.11: a back-step or a jump holds its end
---

<!-- recorded (owner, 10 Nov: "Reimagine the finale, now it's not good. Use the LHCb collision, use the world rendered,
     maybe the world turns into a pentaquark when zoomed out and then thank you appears in japanese and lithuanian"):
     then, on the first cut, "just need a smoother transition from the collision (maybe show more of it, particles
     propagating through detector, something like that)"): finalec.mp4 is cut from two takes (videos/finale/segments.sh;
     takes.md slides 3 and 5): LHCb's collision, its particles going through the detector as the camera turns round
     it and draws back, a dissolve into the world of grains on Japan, drawing back, the Earth's grains gathering
     into the cover's pentaquark. It carries its own sound, the low bang, so it plays unmuted; it ends on the
     pentaquark and waits, and the thanks come up over its last 4.5 s (from 27.5 s, as before the cut grew by 2 s). -->
<VideoPlayer src="finalec.mp4" :controls="false" transition="fade" />
<!-- 12 Nov (the owner: "Slide 17 should continue playing, also we should have some soundtrack"): as the clip ends
     finale_loop.mp4 takes over, the pentaquark turning on (a 30 s loop that begins on the frame after the clip's
     last; setup/ClipLoop.vue); the music cross-fades on arrival into „Age of Wonder“ from 3:54 (its arrival at 4:16.5 as the
     pentaquark has formed, 22.5 s) and runs to the piece's end, over the next page too. -->
<ClipLoop src="finale_loop.mp4" />
<!-- 12 Nov, evening (the owner: "japanese and lithuanian flags appearing in the background joined in the middle behind
     the pentaquark"): from 22.5 s, the pentaquark formed (setup/BehindFlags.vue); they stay over the loop and the last page -->
<BehindFlags :at="37.0" />
<!-- The finale's music (14 Nov, the owner: "examine uzsikrauk karjerai finale … we still miss the soundtrack on this
     finale"; before it, three times, "see what timing was used in uzsikrauk karjerai"). That talk's close is Scott
     Buckley's „Starfire“: its collision crosses 16.36 s in, on the piece's arrival at 1:37.38, the 16 s of crescendo
     before it played under the build-up at half level, entered by a 2 s cross-fade from the bed (`drop` with no duck).
     „Age of Wonder“ has no such crescendo into an arrival, and three of its moments were tried here. So this finale has
     Starfire's, as that one: starfire_finale_tokyo.m4a is Karjera's starfire_finale.m4a from 1.72 s in, so its arrival is
     14.3 s from its start, and the two bunches meet 14.3 s into the clip (read frame by frame); `drop` counts on the
     clip's own clock. „Age of Wonder“ runs up to this slide and cross-fades out here. -->
<StageSoundtrack src="audio/wonder_bed.m4a" :level="0.5" start keys :drop="{ at: 14.3, file: 'audio/starfire_finale_tokyo.m4a', hit: 14.3, duck: 99, xfade: 2000, quiet: 0.8 }" />
<AtClipEnd :lead="4.5"><div class="thanks low">ありがとうございました<span class="sep">·</span>Ačiū</div></AtClipEnd>

<!--
The finale (finalec.mp4, 32 s since 12 Nov, with its sound; 10 Nov): LHCb at eye level and one of its collisions, a low bang
on the crossing (3.9 s); the particles go through the detector as the camera turns round it and draws back; at
12 s the picture dissolves (1.6 s) into the Earth in grains, Japan in the middle; the camera draws back to the
whole Earth, and from 17.5 s its grains leave the globe and gather into a pentaquark (u u d c c̄), the cover's
particle (formed by 23 s), which turns as the camera comes in. The thanks, in Japanese and Lithuanian, come up
over the last 4.5 s; as the clip ends its loop takes over (finale_loop.mp4, 30 s), the pentaquark turning on.
Music: Scott Buckley, „Age of Wonder“, from 3:54 to its end (CC BY 4.0).

Five quarks were allowed on paper in 1964 and found in 2015. What they are
made of is the question that Lithuanian and Japanese physicists now answer
together. Thank you, and thank you to the Embassy for bringing us together
today. (~1 min)
-->

---
space: { at: [-31.5, 0.4, 0], dist: 12, yaw: -30, pitch: 14, dim: 0.1 }   # the finale's last pose; the world rests under its last frame (CloseStill)
---

<!-- 12 Nov: the loop of the turning pentaquark in place of the still (<CloseStill>), the music going on -->
<VideoPlayer src="finale_loop.mp4" muted loop :controls="false" transition="fade" />
<BehindFlags />
<StageSoundtrack src="audio/starfire_finale_tokyo.m4a" :level="0.5" keys />
<div class="thanks low">ありがとうございました<span class="sep">·</span>Ačiū</div>
<div class="credits credit">Photos: S. Sakata, Ken Domon (public domain); M. Kobayashi, The Japan Academy, CC BY 4.0; T. Maskawa, OIST, CC BY 2.0; the Belle detector, yellow_bird_woodstock, CC BY-SA 2.0; Vilnius University, Diliff, CC BY-SA 3.0; Nagoya University, DrKssn, CC BY-SA 3.0; all via Wikimedia Commons, cropped. LHCb model: © CERN for the benefit of the LHCb collaboration (GPL-3.0), HSF Phoenix (Apache-2.0); human model: Blender Human Base Meshes (CC0); LHCb collision: CERN open data. LHC tunnel: CERN-FOOTAGE-2022-013-001. Globe: Natural Earth. Music: „Age of Wonder“ and „Starfire“ by Scott Buckley, released under CC-BY 4.0, www.scottbuckley.com.au. J/ψ p spectrum and Dalitz plot: LHCb, Phys. Rev. Lett. 122 (2019) 222001, CC BY 4.0 (HEPData ins1728691). CMS collision on the cover: CERN open data.</div>

<!--
Credits (house rule: the credits a licence asks for, tiny print, on the last page). The finale's
loop goes on under them, and the music to its end. Nothing to say here: questions.
(~0 min)
-->
