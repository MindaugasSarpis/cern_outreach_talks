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
stage:
  space: data/space.json
  palette: { base: blue, accent: '#ffc05a', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }
  sound: false
  halo: false
  options: { grain: 0, aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom: 0.45, flight: [2.5, 5], reach: 22 }
title: Vadovėlio gale atsakymo nėra
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, filmed in the Delfi studio on 26 Oct 2026 and
  streamed to classrooms on 27 Oct 2026, 12:00. About 9–10 minutes, 17 slides.
  One thread in three parts: a question nobody can answer yet (why matter
  survived), what working on such a question looks like (one particle from
  idea to discovery, and the speaker's own search that ended in „Neradau.“),
  and what it has to do with the viewer (his path, his 2022 plans, a task for
  the week). Told inside one world of grains (slidev-addon-stage, pinned to
  slidev-videos 640eaa5). Built for television: large type in the title-safe
  area, no film grain, slow motion, no sound from the deck, laptop output
  1920×1080 at 50 Hz. Speaker notes carry the full script, timings, sources
  and every [PATIKSLINTI] item. `c` replays what builds itself where the
  camera is.
space: { at: origin, dim: 0.05 }
---

<Grains :set="{ bang: 1, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<!--
I. KLAUSIMAS
0:00 · ~35 s · the speaker to the lens; the world full-frame from „Pažiūrėk“
Picture: a cloud forms, gold grains (matter) and blue (antimatter), turning slowly.

Kai mokykloje sprendi uždavinį ir nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Aš dirbu su klausimais, į kuriuos atsakymo dar niekas nežino.
Štai vienas. Pažiūrėk į šį debesį. Auksinės dalelės – medžiaga: iš jos sudaryta viskas aplink mus ir mes patys. Mėlynos – antimedžiaga, tarsi medžiagos veidrodinis atspindys. Visatos pradžioje atsirado ir vienų, ir kitų. O kai medžiagos dalelė susitinka su antimedžiagos dalele…
→ spausk

Source: CERN, „Antimatter“, home.cern/science/physics/antimatter.
-->

---
space: { at: origin, dist: 24, dim: 0.05 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<!--
0:35 · ~15 s · the world full-frame
Picture: the pairs meet and go out as light, from the edge inward; a handful of gold grains is left.

…abi išnyksta, lieka tik šviesa. Jeigu jų būtų buvę po lygiai, būtų išnykę viskas, ir mūsų nebūtų.
[pauzė 3 s]
-->

---
space: { at: origin, dist: 17, dim: 0.1 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<div class="say wide">
<p class="num small blue">1&#8239;000&#8239;000&#8239;000</p>
<p class="line">antimedžiagos dalelių</p>
<p class="num small gold">1&#8239;000&#8239;000&#8239;001</p>
<p class="line">medžiagos dalelių</p>
</div>

<div class="src">CERN, „Antimatter“</div>

<!--
0:50 · ~20 s
Picture: only the remainder, a handful of gold grains in the dark.

Bet medžiagos buvo truputį daugiau: kiekvienam milijardui antimedžiagos dalelių – maždaug milijardas ir viena medžiagos dalelė. Poros išnyko, o iš to mažo likučio susidarė viskas, ką matome: žvaigždės, planetos, mes. Kodėl medžiagos buvo daugiau, kol kas niekas nežino.

Source: CERN: "approximately one extra particle per billion antiparticles … This forms everything that we see today"; the mechanism is unknown.
-->

---
space: { at: [-16, 1.2, 0], dist: 30, yaw: -12, pitch: 8, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis · dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
1:10 · ~20 s · the title card full-frame ~4 s, then the speaker
Picture: the remainder has gathered into one warm knot, small on the right.

Esu Mindaugas Šarpis, dalelių fizikas iš Vilniaus universiteto. Papasakosiu, kaip atrodo darbas su tokiais klausimais ir kaip tai susiję su klausimu, kurį tu tikriausiai dažnai girdi: „Kuo būsi?“
-->

---
space: { at: collider, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<!--
1:30 · ~25 s · the world full-frame
Picture: the LHC as a ring of streaming grains; two bunches run against each other and meet twice a lap.

Vienas iš būdų ieškoti atsakymo – dalelių susidūrimai. Prie Ženevos, CERN'e, šimto metrų gylyje yra Didysis hadronų greitintuvas – dvidešimt septynių kilometrų žiedas. Kai jis veikia, protonai lekia vieni priešais kitus beveik šviesos greičiu – per sekundę jie apskrieja žiedą daugiau nei vienuolika tūkstančių kartų – ir susiduria. Šią vasarą greitintuvą išjungė: iki 2030-ųjų jis bus atnaujinamas.

Sources: home.cern LHC page (27 km, 100 m underground, close to the speed of light, 11 245 laps a second); CERN, 29 Jun 2026: the LHC switched off for Long Shutdown 3, the High-Luminosity LHC scheduled for 2030.
-->

---
space: { at: collider, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" muted />

<!--
1:55 · ~25 s · the clip full-frame, then the speaker
Picture: the LHCb detector, a 3D fly-in (CERN-FOOTAGE-2022-042-001, silent). Advance before it ends if you like.

Viename iš susidūrimo taškų stovi LHCb – 5 600 tonų detektorius. Jis fiksuoja, kas atsiranda per susidūrimus, ir pastatytas tam, kad ištirtų, kuo medžiaga skiriasi nuo antimedžiagos. LHCb eksperimente dirba daugiau nei 1 800 žmonių iš 27 šalių. Aš esu vienas iš jų – su LHCb duomenimis dirbu nuo 2014 metų.

Sources: home.cern/science/experiments/lhcb (5 600 t; matter and antimatter); LHCb Starterkit, 1 Dec 2025 (1 844 members, 108 institutes, 27 countries); „nuo 2014-ųjų“: LRT, 8 Jan 2025.
-->

---
space: { at: quarks, dist: 15, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, phantom: 0, route: -1 }" />

<div class="say">
<p class="big huge">1964</p>
</div>

<!--
II. KAIP ATRODO TOKS DARBAS
2:20 · ~30 s
Picture: five faint clusters drift apart; nothing holds yet.

Kiek laiko gali trukti atsakymo paieška? Papasakosiu apie vieną dalelę. 1964 metais fizikai pasiūlė idėją, kad protonai ir neutronai sudaryti iš dar mažesnių dalelių – kvarkų. Pagal tą pačią idėją galėjo būti ir dalelių iš penkių kvarkų – pentakvarkų. Ar jų iš tikrųjų yra, niekas nežinojo.

Sources: Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401 (1964); the same model allows pentaquarks (LHCb, arXiv:1507.03414).
-->

---
space: { at: quarks, dist: 11, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 1, needle: 0, phantom: 0, route: -1 }" />

<div class="say">
<p class="big">2003 – rasta<br><span class="blue">2008 – nėra</span></p>
</div>

<div class="src">LEPS, PRL 91, 012002 (2003) · Particle Data Group (2008)</div>

<!--
2:50 · ~25 s
Picture: the clusters half-gather, dim, and do not hold.

Jų ieškojo kelis dešimtmečius. 2003 metais viena tyrėjų grupė paskelbė, kad rado pentakvarką. Kiti bandė tai pakartoti ir nerado. 2008 metais pagrindinis dalelių fizikos žinynas paskelbė: daugybė įrodymų rodo, kad tokio pentakvarko nėra.

Sources: LEPS, PRL 91, 012002 (2003); PDG 2008 review: "overwhelming evidence that the claimed pentaquarks do not exist".
-->

---
space: { at: [595.8, 0.4, 0], dist: 11, yaw: 18, pitch: 10, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, phantom: 0, route: -1 }" />

<div class="say">
<p class="kick">1964 → 2015</p>
<p class="num gold">51 <span class="unit">metai</span></p>
</div>

<div class="src">LHCb, PRL 115, 072001 (2015) · LHCb, PRL 122, 222001 (2019)</div>

<!--
3:15 · ~35 s
Picture: the five clusters gather and hold, joined by flowing strings, and burn bright.

Pentakvarkus pagaliau aptiko LHCb – 2015 metais. Nuo idėjos iki atradimo praėjo penkiasdešimt vieneri metai. Kaip tie penki kvarkai laikosi krūvoje, tiksliai nežinoma iki šiol. 2019 metais LHCb pamatė tris pentakvarkus. Patikrinti, ar jie pasirodo ir kitur, buvo mano doktorantūros užduotis.

Sources: CERN press release, 14 Jul 2015 (1 Feb 1964 → 14 Jul 2015 = 51 years); CERN, 2022: their exact nature "largely unknown"; LHCb 2019: Pc(4312)⁺, Pc(4440)⁺, Pc(4457)⁺; the speaker's thesis (Bonn, 2023) searched for these three.
-->

---
space: { at: search, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, phantom: 0, route: -1 }" />

<!--
3:50 · ~40 s · mostly the speaker
Picture: a wide, faint cloud of grains: the haystack.

Ieškojau jų kitame skilime – kai dalelė subyra kitaip. Tai panašu į adatos paiešką šieno kupetoje, kuri yra visos Lietuvos dydžio, kai net nežinai, kaip adata atrodo. Didžiąją laiko dalį rašai programas, kurios atsijoja duomenis, ir kompiuteriu modeliuoji, ką turėtum pamatyti, jei adata ten yra. Ir daug kalbiesi su kolegomis – naujos dalelės vienas nerasi.
Maždaug po dvejų metų pirmą kartą pažiūrėjau į savo duomenų grafiką ir pamačiau ne tas daleles, kurių ieškojau, o kitas – tikras, labai trumpai gyvenančias. Labai apsidžiaugiau: vadinasi, metodas veikė.

Sources: the thesis searched Λb⁰ → Λc⁺ D̄*⁰ K⁻; LRT „Širdyje lietuvis“ (2024), 07:36 (the haystack) and 06:15 („naujos dalelės vienas tikrai nerasi“) [ASR: re-listen].
„Širdyje lietuvis“ 11:12 [ASR: re-listen] (after about two years, other real short-lived particles, the happy dance).
[PATIKSLINTI: ar taip ir atrodė darbo dienos; ar tas grafikas buvo iš tos pačios analizės, ir ar „metodas veikė“ – tavo žodžiai.]
-->

---
space: { at: search, dist: 11, yaw: 6, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 0, route: -1 }" />

<div class="say late">
<p class="big huge">Neradau.</p>
</div>

<!--
4:30 · ~15 s · the world full-frame, then the face on the word; hold the silence
Picture: five faint clusters appear in the haystack, drift toward each other and apart, never holding.

Po ketverių su puse metų mano atsakymas buvo toks: neradau.
[tyla 3 s]
Tame skilime šių pentakvarkų nematyti. Jeigu jie ten ir atsiranda, tai labai retai.

Source: the thesis (Bonn, 2023): no signal; upper limits at 95 % CL: Pc(4312)⁺ < 0,52 %, Pc(4440)⁺ < 0,65 %, Pc(4457)⁺ < 0,54 %.
-->

---
space: { at: search, dist: 18, yaw: -24, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 5, route: -1 }" />

<!--
4:45 · ~30 s · mostly the speaker
Picture: from the five faint clusters, arcs of gold run to one point beside them, where a cluster gathers and holds.

Ar tai buvo veltui? Ne. Dabar kiti žino, kur ieškota, ir gali ieškoti kitur. Be to, norėdamas apskritai ieškoti, turėjau sukurti naują būdą, kaip atkurti dalelę, kurios detektorius dažnai nepagauna. Tas būdas liko – juo remiasi mano dabartinis projektas. Blogas rezultatas irgi yra rezultatas.

Sources: the thesis (Extended Cone Closure); CORDIS 101244743 (PHANTOM, 2025–27, uses that method); „blogas rezultatas irgi yra rezultatas“: Mokslo sriuba podcast #62 (2019), 44:34 [ASR: re-listen].
[PATIKSLINTI: „sukurti“ pačiam ar su komanda?]
-->

---
space: { at: search, dist: 30, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_006.mp4" muted />

<div class="say on-clip">
<p class="kick">2023 m. gruodžio 20 d.</p>
<p class="big">opendata.cern.ch</p>
</div>

<!--
5:15 · ~30 s · the clip full-frame (CERN data centre, CERN-FOOTAGE-2022-013-006)

Tuo pat metu beveik dvejus metus ruošiau dar vieną dalyką: visus pirmojo LHCb darbo etapo duomenis – beveik petabaitą –, kad juos galėtų atsisiųsti bet kas. 2023 metų gruodžio 20 dieną jie tapo vieši. Kitą dieną gyniau disertaciją. Tie duomenys prieinami ir tau – adresas ekrane.

Sources: M. Šarpis, „LHCb Run I Data is Released“ (Substack, 15 Jan 2024): close to two years, just under 1 PB; opendata.cern.ch: entire Run 1 public, 20 Dec 2023; thesis defence 21 Dec 2023.
-->

---
space: { at: whole, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 5, route: 7 }" />

<!--
III. KUO BŪSI?
5:45 · ~45 s · the world full-frame, then the speaker
Picture: Europe gathers out of the dust, and a trail of light draws the route: Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius.

O kaip aš pats atsidūriau šioje paieškoje? Ne tiesiu keliu. Iki dvylikos norėjau būti egiptologu, o nuo dvylikos – fiziku. Po pamokų lankiau ne tik fizikos, bet ir verslo bei psichologijos užsiėmimus. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN'ą. Studijuoti išvykau į Glazgą. Pragyvenimui užsidirbdavau darbu, kuris su fizika neturėjo nieko bendro, o bakalauro darbui pirmą kartą gavau tikrus LHCb duomenis. Tema buvo ta pati, nuo kurios pradėjau: kuo skiriasi medžiaga ir antimedžiaga. Po studijų grįžau į Vilnių ir iš dalelių fizikos išėjau – dirbau su lazeriais. Į ją grįžau tik doktorantūroje, Heidelberge. Po pusmečio prasidėjo pandemija, o mūsų grupė persikėlė į Boną.

Sources: LRT „Širdyje lietuvis“ (2024), 03:11 (Egyptologist until 12, then physics) and 04:36–05:03 [ASR: re-listen]; Mokslo sriuba podcast #62 (2019), 00:39 (first visit to CERN in 11th grade) [ASR: re-listen]; Substack „A New Beginning“ (2024): "had to support myself so ended up working as a manager"; INSPIRE: Glasgow 2011–15, VU 2017–19, Heidelberg 2019–20, Bonn 2020–23; BSc thesis on CP violation in B → ππ with LHCb data (Mokslo sriuba podcast #62, 2019); the thesis acknowledgements (Bonn, 2023): the pandemic six months in, the group's move to Bonn; the schools and the laser work: the speaker's own account.
[PATIKSLINTI: užsiėmimų pavadinimai; ar minėti darbą Glazge ir lazerius taip.]
-->

---
space: { at: whole, dim: 0.35 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 5, route: 7 }" />

<div class="plans">
<p class="kick">Mano planai · 2022 m. balandis</p>
<img src="/figures/planai-2022.jpg" alt="Ateities planai: Apsiginti PhD (liko 1–1,5 m.); Likti LHCb jeigu pavyks; Remote PostDoc (USA matyt); Gyventi Lietuvoje :O" />
</div>

<div class="src">M. Šarpis, LPPM 2022, indico.cern.ch/event/1128345</div>

<!--
6:30 · ~35 s · his own slide full-frame, then the speaker

2022 metų pavasarį, doktorantūros viduryje, susirašiau ateities planus. Štai jie: apsiginti disertaciją, likti LHCb, jeigu pavyks, dirbti nuotoliu – matyt, su JAV. Ir paskutinis punktas: „Gyventi Lietuvoje“ – su nustebusiu veiduku gale. Po pusantrų metų jau dirbau Vilniuje, ir kūrėme LHCb grupę Vilniaus universitete. Šito mano planuose nebuvo. Nuo 2024-ųjų Vilniaus universitetas – oficialus LHCb dalyvis, o dauguma mūsų grupės narių – studentai.

Sources: M. Šarpis, LPPM 2022 participants' introductions (11 Apr 2022), MSarpisIntro.pdf p. 16 (public on Indico); ff.vu.lt: VU admitted to LHCb on 2 Sep 2024; VU, 20 Aug 2026: most of the group are students.
[PATIKSLINTI: ar tinka rodyti šią skaidrę.]
-->

---
space: { at: cosmos, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 5, route: 7 }" />

<div class="src">NASA: Paukščių Take 100–400 mlrd. žvaigždžių · CERN, 2025-03-24</div>

<!--
7:05 · ~40 s · the world full-frame for the arrival, then the speaker
Picture: a turning spiral galaxy.

O klausimas, nuo kurio pradėjau, vis dar atviras. Iš to likučio – vienos dalelės milijardui – susidarė žvaigždės ir galaktikos. Vien mūsų galaktikoje – nuo šimto iki keturių šimtų milijardų žvaigždžių. Pernai LHCb pirmą kartą pamatė, kad dalelės, giminingos protonams, elgiasi šiek tiek kitaip nei jų antimedžiagos atitikmenys. Tai dar viena užuomina, bet ne atsakymas. Gal jį ras žmogus, kuris šiandien sėdi klasėje ir dar nežino, kuo bus.

Sources: NASA (100–400 billion stars); CERN, 24 Mar 2025: first observation of CP violation in baryons (Λb).
-->

---
space: { at: close, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, phantom: 5, route: 7 }" />

<div class="say wide">
<p class="kick">Šią savaitę paklausk</p>
<p class="big">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
7:45 · ~40 s · the speaker to the lens; hold 2 s after the last word; no logos, no summary
Picture: the camera pulls back until the whole galaxy is in frame.

Tau nebūtina jau dabar žinoti, kuo būsi. Šešiolikos metų aš žinojau tik tiek, kad man įdomi fizika, o kur ji nuves – nežinojau. Svarbiau bandyti: vasaros praktika, būrelis, savanorystė, savas projektas. Ir klausti žmonių, kurie dirba tai, kas tau įdomu. Tad štai užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė]
Ir pažiūrėk, kas iš to išeis.

About 870 spoken words: roughly 8 minutes at a studio pace, plus pauses and clips, about 9–10 minutes. Room for the [PATIKSLINTI] lines and a slower studio pace.
-->
