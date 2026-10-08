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
  look: broadcast
  sound: false
  options: { lift: 0.035, nebula: 0.18, bloom: 0.5, exposure: 1.12, vignette: 0.4, dustGain: 1.5, reach: 22 }
title: Vadovėlio gale atsakymo nėra
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, filmed in the Delfi studio on 26 Oct 2026 and
  streamed to classrooms on 27 Oct 2026, 12:00. About 10 minutes, 19 slides,
  one chronological thread: the open question (why matter survived) and
  where it is asked; how the speaker got there; the task his PhD gave him
  (pentaquarks, from the 1964 idea to the 2015 discovery and the three of
  2019); his search and its answer, „Neradau.“; what came after; the open
  question again and a task for the week. Real footage (LHC tunnel, LHCb,
  the CERN data centre), real LHCb plots and his own 2022 slide, inside one
  world of grains (slidev-addon-stage on slidev-videos feat/broadcast,
  `look: broadcast` with a darker ground). Laptop at 1920×1080, 50 Hz,
  silent. Speaker notes carry the full script, timings, sources and every
  [PATIKSLINTI] item.
layout: default
space: { at: origin, dim: 0.05 }
---

<Grains :set="{ bang: 1, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis · dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
I. KLAUSIMAS
Message: in my work there is no answer at the back of the book; here is one such question.
Picture: a cloud forms, gold grains (matter) and blue (antimatter).

Kai mokykloje sprendi uždavinį ir nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Aš esu dalelių fizikas, ir mano darbe tokio vadovėlio nėra. Dirbu su klausimais, į kuriuos atsakymo dar niekas nežino.
Štai vienas iš jų. Auksinės dalelės – tai medžiaga, iš jos sudaryta viskas aplink mus. Mėlynos – antimedžiaga, tarsi medžiagos veidrodinis atspindys. Visatos pradžioje atsirado ir vienų, ir kitų. O kai medžiagos dalelė susitinka su antimedžiagos dalele…
→ spausk

Source: CERN, „Antimatter“, home.cern/science/physics/antimatter.
(~0.6 min)
-->

---
space: { at: origin, dist: 24, dim: 0.05 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<!--
Message: if there had been equal amounts, everything would have vanished.
Picture: the pairs meet and go out as light, from the edge inward; a handful of gold grains is left. The world full-frame.

…abi išnyksta, lieka tik šviesa. Jeigu jų būtų buvę po lygiai, būtų išnykę viskas, ir mūsų nebūtų.
[pauzė 3 s]
(~0.3 min)
-->

---
space: { at: origin, dist: 17, dim: 0.1 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<div class="say wide">
<p class="num small blue">1&#8239;000&#8239;000&#8239;000</p>
<p class="line">antimedžiagos dalelių</p>
<p class="num small gold">1&#8239;000&#8239;000&#8239;001</p>
<p class="line">medžiagos dalelių</p>
</div>

<!--
Message: one particle in a billion was left over, everything is made of it, and nobody knows why.
Picture: only the remainder, a handful of gold grains in the dark.

Bet medžiagos buvo truputį daugiau. Kiekvienam milijardui antimedžiagos dalelių buvo maždaug milijardas ir viena medžiagos dalelė. Poros išnyko, o iš to mažo likučio susidarė viskas, ką matome – žvaigždės, planetos, mes. Kodėl medžiagos buvo daugiau, kol kas niekas nežino.

Source: CERN: "approximately one extra particle per billion antiparticles … This forms everything that we see today"; the mechanism is unknown.
(~0.4 min)
-->

---
space: { at: origin, dist: 12, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_001.mp4" muted />

<!--
Message: one way to look for the answer is collisions in the LHC at CERN.
Picture: real footage, a travelling shot along the LHC tunnel (CERN-FOOTAGE-2022-013-001). Advance whenever you finish; the clip is long.

Vienas iš būdų ieškoti atsakymo – dalelių susidūrimai. Prie Ženevos, CERN'e, šimto metrų gylyje yra Didysis hadronų greitintuvas – dvidešimt septynių kilometrų žiedas. Kai jis veikia, protonai lekia vieni priešais kitus beveik šviesos greičiu ir susiduria. Šią vasarą greitintuvą išjungė, nes iki 2030-ųjų jis bus atnaujinamas.

Sources: home.cern LHC page (27 km, 100 m underground, close to the speed of light); CERN, 29 Jun 2026: the LHC switched off for Long Shutdown 3, the High-Luminosity LHC scheduled for 2030.
(~0.5 min)
-->

---
space: { at: origin, dist: 12, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" muted />

<!--
Message: LHCb was built for this question, and I work on it; the road here was not straight.
Picture: the LHCb detector (CERN-FOOTAGE-2022-042-001, silent).

Viename iš susidūrimo taškų stovi LHCb – 5 600 tonų detektorius. Jis pastatytas tam, kad ištirtų, kuo medžiaga skiriasi nuo antimedžiagos. LHCb eksperimente dirba daugiau nei 1 800 žmonių iš 27 šalių, ir aš esu vienas iš jų. Bet kelias iki čia nebuvo tiesus.

Sources: home.cern/science/experiments/lhcb (5 600 t; matter and antimatter); LHCb Starterkit, 1 Dec 2025 (1 844 members, 108 institutes, 27 countries).
(~0.4 min)
-->

---
space: { at: whole, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 3 }" />

<!--
II. KELIAS
Message: I knew only that physics interested me; my first real research was on the very question I opened with.
Picture: Europe gathers out of the dust; a trail of light runs Vilnius → CERN → Vilnius → Glasgow.

Iki dvylikos norėjau būti egiptologu, o nuo dvylikos – fiziku. Po pamokų lankiau ne tik fizikos, bet ir verslo bei psichologijos užsiėmimus. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN'ą. Studijuoti išvykau į Glazgą. Pragyvenimui užsidirbdavau darbu, kuris su fizika neturėjo nieko bendro, o bakalauro darbui pirmą kartą gavau tikrus LHCb duomenis. Tema buvo ta pati, nuo kurios pradėjau, – kuo skiriasi medžiaga ir antimedžiaga.

Sources: LRT „Širdyje lietuvis“ (2024), 03:11 (Egyptologist until 12, then physics) [ASR: re-listen]; Mokslo sriuba podcast #62 (2019), 00:39 (first visit to CERN in 11th grade) and 32:39 (BSc thesis on CP violation in B decays) [ASR: re-listen]; Substack „A New Beginning“ (2024): "had to support myself so ended up working as a manager"; INSPIRE: Glasgow 2011–15; the after-school courses: the speaker's own account.
[PATIKSLINTI: užsiėmimų pavadinimai; ar minėti darbą Glazge taip.]
(~0.7 min)
-->

---
space: { at: whole, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<!--
Message: I left particle physics, came back for a PhD, and the PhD gave me pentaquarks to look for.
Picture: the trail runs on: back to Vilnius, then Heidelberg, then Bonn.

Po studijų grįžau į Vilnių ir iš dalelių fizikos išėjau – dirbau su lazeriais. Į ją grįžau doktorantūroje, Heidelberge. Po pusmečio prasidėjo pandemija, o mūsų grupė persikėlė į Boną. Doktorantūroje gavau užduotį ieškoti pentakvarkų. Kad būtų aišku, kas tai, reikia grįžti į 1964-uosius.

Sources: INSPIRE: VU 2017–19, Heidelberg 2019–20, Bonn 2020–23; the thesis acknowledgements (Bonn, 2023): the pandemic six months in, the group's move to Bonn; the laser work: the speaker's own account.
[PATIKSLINTI: ar „dirbau su lazeriais“ tinka.]
(~0.5 min)
-->

---
space: { at: quarks, dist: 15, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big huge">1964</p>
</div>

<!--
III. UŽDUOTIS
Message: in 1964 the quark idea allowed particles of five quarks, and nobody knew whether they exist.
Picture: five faint clusters drift apart; nothing holds yet.

1964 metais du fizikai, Murray Gell-Mannas ir George'as Zweigas, pasiūlė idėją, kad protonai ir neutronai sudaryti iš dar mažesnių dalelių – kvarkų. Pagal tą pačią idėją galėjo būti ir dalelių iš penkių kvarkų – pentakvarkų. Ar jų iš tikrųjų yra, niekas nežinojo.

Sources: Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401 (1964); the same model allows pentaquarks (LHCb, arXiv:1507.03414).
(~0.4 min)
-->

---
space: { at: quarks, dist: 11, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 1, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big">2003 – rasta<br><span class="blue">2008 – nėra</span></p>
</div>

<!--
Message: one was claimed in 2003 and shown not to exist by 2008.
Picture: the clusters half-gather, dim, and do not hold.

Jų ieškojo kelis dešimtmečius. 2003 metais viena tyrėjų grupė paskelbė, kad rado pentakvarką. Kiti bandė tai pakartoti ir nerado. 2008 metais pagrindinis dalelių fizikos žinynas paskelbė, kad daugybė įrodymų rodo: tokio pentakvarko nėra.

Sources: LEPS, PRL 91, 012002 (2003); PDG 2008 review: "overwhelming evidence that the claimed pentaquarks do not exist".
(~0.4 min)
-->

---
space: { at: [601.6, 0.2, 0], dist: 11, yaw: 18, pitch: 8, sway: 1, dim: 0.2 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="kick">1964 → 2015</p>
<p class="num gold">51 <span class="unit">metai</span></p>
</div>

<img class="plot" src="/figures/lhcb/LHCb-PAPER-2015-029_mjpsip-default_crop.png" alt="LHCb 2015: J/ψ p masės skirstinys su siaura pentakvarko smaile" />

<div class="credit">LHCb, PRL 115, 072001 (2015), CC BY 4.0</div>

<!--
Message: LHCb found them in 2015, 51 years after the idea.
Picture: on the left the five clusters gather, hold and burn bright; on the right the real LHCb plot.

2015 metais LHCb pentakvarkus pagaliau aptiko. Šitame grafike – tikri LHCb duomenys. Siaura smailė – tai pentakvarkas. Nuo idėjos iki atradimo praėjo penkiasdešimt vieneri metai.

Sources: LHCb, PRL 115, 072001 (2015), figure: m(J/ψ p) with the narrow Pc(4450)⁺ over the broad Pc(4380)⁺; CERN press release, 14 Jul 2015 (1 Feb 1964 → 14 Jul 2015 = 51 years).
(~0.4 min)
-->

---
space: { at: [601.6, 0.2, 0], dist: 11, yaw: 18, pitch: 8, sway: 1, dim: 0.2 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big huge">2019</p>
</div>

<img class="plot" src="/figures/lhcb/LHCb-PAPER-2019-014_mjpsip-spectrum-19_crop.png" alt="LHCb 2019: J/ψ p masės skirstinys su trimis siauromis smailėmis" />

<div class="credit">LHCb, PRL 122, 222001 (2019), CC BY 4.0</div>

<!--
Message: in 2019 there were three, and my task was to check whether they appear in another decay.
Picture: the same clusters; on the right the 2019 plot with three narrow peaks.

2019 metais, surinkus daugiau duomenų, ta smailė pasirodė esanti dvi smailės, ir atsirado dar viena. Iš viso trys siauri pentakvarkai. Kaip penki kvarkai laikosi krūvoje, iki šiol tiksliai nežinoma. Mano užduotis buvo patikrinti, ar šie trys pasirodo ir kitame skilime – kai dalelė subyra kitaip.

Sources: LHCb, PRL 122, 222001 (2019): Pc(4312)⁺, and the 2015 Pc(4450)⁺ resolved into Pc(4440)⁺ and Pc(4457)⁺; CERN, 2022: their exact nature "largely unknown"; the speaker's thesis (Bonn, 2023) searched Λb⁰ → Λc⁺ D̄*⁰ K⁻ for these three.
(~0.5 min)
-->

---
space: { at: search, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 1, phantom: 0, route: 6 }" />

<!--
IV. PAIEŠKA
Message: it is a search for a needle in a haystack, and after two years the method worked.
Picture: a wide, faint cloud of grains, the haystack; about 20 s in, a thread of light runs in and a small warm cluster gathers.

Tai panašu į adatos paiešką šieno kupetoje, kuri yra visos Lietuvos dydžio, kai net nežinai, kaip adata atrodo. Didžiąją laiko dalį rašai programas, kurios atsijoja duomenis, ir kompiuteriu modeliuoji, ką turėtum pamatyti, jei adata ten yra. Ir daug kalbiesi su kolegomis, nes naujos dalelės vienas nerasi.
Maždaug po dvejų metų pirmą kartą pažiūrėjau į savo duomenų grafiką ir pamačiau ne tas daleles, kurių ieškojau, o kitas – tikras, labai trumpai gyvenančias. Labai apsidžiaugiau, nes tai reiškė, kad metodas veikia.

Sources: LRT „Širdyje lietuvis“ (2024), 07:36 (the haystack), 06:15 („naujos dalelės vienas tikrai nerasi“), 11:12 (after about two years, other real short-lived particles, the happy dance) [ASR: re-listen].
[PATIKSLINTI: ar taip atrodė darbo dienos; ar tas grafikas buvo iš tos pačios analizės; ar „metodas veikia“ – tavo žodžiai.]
(~0.8 min)
-->

---
space: { at: search, dist: 11, yaw: 6, sway: 1, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 0, route: 6 }" />

<div class="say late">
<p class="big huge">Neradau.</p>
</div>

<!--
Message: after four and a half years the answer was: not found.
Picture: five faint clusters appear in the haystack, drift toward each other and apart, never holding. The world full-frame, then the face on the word.

Po ketverių su puse metų mano atsakymas buvo toks: neradau.
[tyla 3 s]
Tame skilime šių pentakvarkų nematyti. Jeigu jie ten ir atsiranda, tai labai retai.

Source: the thesis (Bonn, 2023): no signal; upper limits at 95 % CL: Pc(4312)⁺ < 0,52 %, Pc(4440)⁺ < 0,65 %, Pc(4457)⁺ < 0,54 %.
(~0.3 min)
-->

---
space: { at: search, dist: 18, yaw: -24, sway: 1, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 6 }" />

<!--
Message: the work still counted: others know where it was searched, and the method became my next project.
Picture: from the five faint clusters, arcs of gold run to one point beside them, where a cluster gathers and holds.

Bet darbas nenuėjo veltui. Dabar kiti žino, kur ieškota, ir gali ieškoti kitur. Be to, norėdamas apskritai ieškoti, turėjau sukurti naują būdą, kaip atkurti dalelę, kurios detektorius dažnai nepagauna. Tas būdas liko, ir juo remiasi mano dabartinis projektas. Blogas rezultatas irgi yra rezultatas.

Sources: the thesis (Extended Cone Closure); CORDIS 101244743 (PHANTOM, 2025–27, uses that method); „blogas rezultatas irgi yra rezultatas“: Mokslo sriuba podcast #62 (2019), 44:34 [ASR: re-listen].
[PATIKSLINTI: „sukurti“ pačiam ar su komanda?]
(~0.5 min)
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
Message: at the same time I opened LHCb's data to everyone.
Picture: real footage of the CERN data centre (CERN-FOOTAGE-2022-013-006).

Tuo pat metu beveik dvejus metus ruošiau dar vieną dalyką: visus pirmojo LHCb darbo etapo duomenis – beveik petabaitą –, kad juos galėtų atsisiųsti bet kas. 2023 metų gruodžio 20 dieną jie tapo vieši. Kitą dieną gyniau disertaciją. Tie duomenys prieinami ir tau, adresas ekrane.

Sources: M. Šarpis, „LHCb Run I Data is Released“ (Substack, 15 Jan 2024): close to two years, just under 1 PB; opendata.cern.ch: entire Run 1 public, 20 Dec 2023; thesis defence 21 Dec 2023.
(~0.5 min)
-->

---
space: { at: whole, dim: 0.35 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 6 }" />

<div class="plans">
<p class="kick">Mano planai · 2022 m. balandis</p>
<img src="/figures/planai-2022.jpg" alt="Ateities planai: Apsiginti PhD (liko 1–1,5 m.); Likti LHCb jeigu pavyks; Remote PostDoc (USA matyt); Gyventi Lietuvoje :O" />
</div>

<!--
V. PO TO
Message: in the middle of the search I wrote down my plans, and they did not include what happened.
Picture: my own slide from April 2022, over the map.

Kol ieškojau, galvojau ir apie tai, kas bus toliau. 2022 metų pavasarį susirašiau ateities planus. Apsiginti disertaciją. Likti LHCb, jeigu pavyks. Dirbti nuotoliu, matyt, su JAV. Ir paskutinis punktas – „Gyventi Lietuvoje“ – su nustebusiu veiduku gale.

Source: M. Šarpis, LPPM 2022 participants' introductions (11 Apr 2022), MSarpisIntro.pdf p. 16 (public on Indico).
[PATIKSLINTI: ar tinka rodyti šią skaidrę.]
(~0.4 min)
-->

---
space: { at: whole, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 7 }" />

<!--
Message: a year and a half later I was building an LHCb group in Vilnius, which was in none of the plans.
Picture: the trail arcs home from Bonn to Vilnius.

Po pusantrų metų jau dirbau Vilniuje, ir kūrėme LHCb grupę Vilniaus universitete. Šito mano planuose nebuvo. Nuo 2024 metų Vilniaus universitetas – oficialus LHCb dalyvis, o dauguma mūsų grupės narių – studentai.

Sources: ff.vu.lt: VU admitted to LHCb on 2 Sep 2024; VU, 20 Aug 2026: most of the group are students; the move home: the speaker's own account.
(~0.3 min)
-->

---
space: { at: cosmos, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 7 }" />

<!--
VI. TAU
Message: the question I opened with is still open, and someone who does not yet know what they will be may answer it.
Picture: a turning spiral galaxy.

O klausimas, nuo kurio pradėjau, vis dar atviras. Iš to likučio – vienos dalelės milijardui – susidarė žvaigždės ir galaktikos. Pernai LHCb pirmą kartą pamatė, kad dalelės, giminingos protonams, elgiasi šiek tiek kitaip nei jų antimedžiagos atitikmenys. Tai dar viena užuomina. Atsakymo vis dar nėra. Gal jį ras žmogus, kuris šiandien sėdi klasėje ir dar nežino, kuo bus.

Sources: CERN, 24 Mar 2025: first observation of CP violation in baryons (Λb).
(~0.6 min)
-->

---
space: { at: close, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 7 }" />

<div class="say wide">
<p class="kick">Šią savaitę paklausk</p>
<p class="big">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
Message: you do not need to know yet; try things, ask people, and here is a task for this week.
Picture: the camera pulls back until the whole galaxy is in frame. Hold 2 s after the last word; no logos, no summary.

Tau nebūtina jau dabar žinoti, kuo būsi. Šešiolikos metų aš žinojau tik tiek, kad man įdomi fizika, o kur ji nuves – nežinojau. Svarbiau bandyti: vasaros praktika, būrelis, savanorystė, savas projektas. Ir klausti žmonių, kurie dirba tai, kas tau įdomu. Tad štai užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė]
Ir pažiūrėk, kas iš to išeis.
(~0.6 min)

Total about 9½ minutes of speech plus pauses and clips: about 10 minutes.
-->
