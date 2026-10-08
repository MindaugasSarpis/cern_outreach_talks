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
  palette: { base: blue, bg: '#020307', accent: '#ffc05a', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }
  look: broadcast
  sound: false
  options: { lift: 0, nebula: 0, bloom: 0.32, exposure: 1.0, vignette: 0.45, dustGain: 1.0, density: 0.45, dustSize: 2.2, reach: 22 }
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
space: { at: [-7, 0, 0], dist: 20, yaw: -12, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ bang: 1, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<div class="scrim-left"></div>

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis · dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
I. KLAUSIMAS
Message: in my work there is no answer at the back of the book; here is one such question.
Picture: a cloud forms, gold grains (matter) and blue (antimatter).

Kai mokykloje sprendi uždavinį ir nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Aš esu dalelių fizikas ir mano darbe tokio vadovėlio nėra. Dirbu su klausimais, į kuriuos atsakymo dar niekas nežino.
Štai vienas iš jų. Auksinės dalelės – tai medžiaga, iš kurios sudaryta viskas aplink mus. Mėlynos – antimedžiaga: tokios pat dalelės, tik su priešingu krūviu. Visatos pradžioje atsirado ir vienų, ir kitų. O kai medžiagos dalelė susitinka su antimedžiagos dalele…
→ spausk

Source: CERN, „Antimatter“, home.cern/science/physics/antimatter.
(~0.6 min)
-->

---
space: { at: [-5, 0, 0], dist: 19, yaw: -12, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<!--
Message: if there had been equal amounts, everything would have vanished.
Picture: the pairs meet and go out as light, from the edge inward; a handful of gold grains is left. The world full-frame.

…abi išnyksta, lieka tik šviesa. Jeigu jų būtų buvę po lygiai, būtų išnykę viskas ir mūsų nebūtų.
[pauzė 3 s]
(~0.3 min)
-->

---
space: { at: [-8, 0, 0], dist: 17, yaw: -12, pitch: 8, sway: 1, dim: 0.1 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<div class="scrim-left"></div>

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

Vienas iš būdų ieškoti atsakymo – dalelių susidūrimai. Susidūrimuose vėl atsiranda medžiagos ir antimedžiagos, todėl jas galima palyginti. Prie Ženevos, CERN'e, šimto metrų gylyje yra Didysis hadronų greitintuvas – dvidešimt septynių kilometrų žiedas. Kai jis veikia, protonai lekia vieni priešais kitus beveik šviesos greičiu ir susiduria.

Sources: home.cern LHC page (27 km, 100 m underground, close to the speed of light); home.cern/science/experiments/lhcb (LHCb compares matter and antimatter in the particles collisions make). The LHC is off since 29 Jun 2026 (Long Shutdown 3), hence „kai jis veikia“.
(~0.5 min)
-->

---
space: { at: origin, dist: 12, dim: 0 }
---

<div class="photo"><img src="/figures/photos/lhcb-cavern.jpg" alt="LHCb detektoriaus urvas CERN, 2019" /></div>

<div class="photo-credit">LHCb, CERN · Foto: Rosa Menkman, CC BY 2.0</div>

<!--
Message: LHCb was built for this question, and I work on it; I did not get here straight away.
Picture: a real photograph of the LHCb cavern (2019), full frame, slowly drawing closer.

Vienoje iš vietų, kur protonai susiduria, stovi LHCb – 5 600 tonų detektorius. Jis pastatytas tam, kad ištirtų, kuo medžiaga skiriasi nuo antimedžiagos. LHCb eksperimente dirba daugiau nei 1 800 žmonių iš 27 šalių, ir aš esu vienas iš jų. Bet čia atsidūriau ne iš karto.

Sources: home.cern/science/experiments/lhcb (5 600 t; matter and antimatter); LHCb Starterkit, 1 Dec 2025 (1 844 members, 108 institutes, 27 countries). Photo: Rosa Menkman, flickr.com/photos/r00s/48815389756, CC BY 2.0 (cropped to 16:9).
(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 3 }" />

<div class="city" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 406px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>

<!--
II. KELIAS
Message: my path went through other interests, and my first real research was on the very question I opened with.
Picture: Europe gathers out of the dust; a trail of light runs Vilnius → CERN → Vilnius → Glasgow.

Iki dvylikos norėjau būti egiptologu, o nuo dvylikos – fiziku. Po pamokų lankiau ne tik fizikos, bet ir verslo bei psichologijos užsiėmimus. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN'ą. [PATIKSLINTI: kaip – iki šešių žodžių] Studijuoti išvykau į Glazgą. Kad turėčiau iš ko gyventi, dirbau vadybininku – su fizika tai neturėjo nieko bendro. O baigiamajam bakalauro darbui pirmą kartą gavau tikrus LHCb duomenis. Tyrinėjau tą patį klausimą, nuo kurio šiandien pradėjau, – kuo skiriasi medžiaga ir antimedžiaga.

Sources: LRT „Širdyje lietuvis“ (2024), 03:11 (Egyptologist until 12, then physics) [ASR: re-listen]; Mokslo sriuba podcast #62 (2019), 00:39 (first visit to CERN in 11th grade) and 32:39 (BSc thesis on CP violation in B decays) [ASR: re-listen]; Substack „A New Beginning“ (2024): "had to support myself so ended up working as a manager"; INSPIRE: Glasgow 2011–15; the after-school courses: the speaker's own account.
[PATIKSLINTI: užsiėmimų pavadinimai; ar minėti darbą Glazge taip.]
(~0.7 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="city" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 406px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>
<div class="city" style="left: 462px; top: 318px">Heidelbergas</div>
<div class="city r" style="left: 413px; top: 268px">Bona</div>

<!--
Message: I left particle physics, came back for a PhD, and the PhD gave me a second open question: pentaquarks.
Picture: the trail runs on: back to Vilnius, then Heidelberg, then Bonn.

Po studijų grįžau į Vilnių ir iš dalelių fizikos išėjau – dirbau su lazeriais. [PATIKSLINTI: kodėl – viena frazė] Į dalelių fiziką grįžau per doktorantūrą – tai keleri metai, per kuriuos darai vieną didelį tyrimą. Rinkausi Heidelbergą, nes norėjau dirbti didelėje komandoje, kuri ieško naujų dalelių. Po pusmečio prasidėjo pandemija ir tais pačiais metais visa mūsų grupė persikėlė į Boną. Doktorantūroje gavau kitą klausimą be atsakymo – apie pentakvarkus. Kad būtų aišku, kas tai, reikia grįžti į 1964-uosius.

Sources: INSPIRE: VU 2017–19, Heidelberg 2019–20, Bonn 2020–23; the thesis acknowledgements (Bonn, 2023): the pandemic six months in, the group's move to Bonn; LRT „Širdyje lietuvis“ (2024), 04:36–05:03: chose LHCb in Heidelberg over a laser PhD because he wanted the collaboration [ASR: re-listen]; the laser work: the speaker's own account.
[PATIKSLINTI: ar „dirbau su lazeriais“ tinka; kodėl išėjai.]
(~0.5 min)
-->

---
space: { at: [602.5, 0.2, 0], dist: 20, yaw: -18, pitch: 8, sway: 1, dim: 0.15 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big huge">1964</p>
</div>

<div class="portraits">
<figure><img src="/figures/photos/gell-mann.jpg" alt="Murray Gell-Mann" /><figcaption>Murray Gell-Mann<small>Foto: Joi Ito, CC BY 2.5</small></figcaption></figure>
<figure><img src="/figures/photos/zweig.jpg" alt="George Zweig" /><figcaption>George Zweig<small>Foto: Peacearth, CC BY-SA 4.0</small></figcaption></figure>
</div>

<!--
III. UŽDUOTIS
Message: in 1964 the quark idea allowed particles of five quarks, and nobody knew whether they exist.
Picture: portraits of the two physicists; behind them five faint clusters drift apart, nothing holds yet.

1964 metais du fizikai, Murray Gell-Mannas ir George'as Zweigas, sugalvojo, kad protonai ir neutronai sudaryti iš dar mažesnių dalelių – kvarkų. Protonas – tai trys kvarkai. Pagal tą pačią idėją galėjo būti ir dalelių iš penkių kvarkų – pentakvarkų. Ar jų iš tikrųjų yra, niekas nežinojo.

Sources: Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401 (1964); the same model allows pentaquarks (LHCb, arXiv:1507.03414). Photos: Joi Ito (commons.wikimedia.org/wiki/File:MurrayGellMannJI1.jpg, CC BY 2.5); Peacearth (commons.wikimedia.org/wiki/File:George_Zweig.jpg, CC BY-SA 4.0); both cropped.
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

Jų ieškojo kelis dešimtmečius. 2003 metais viena tyrėjų grupė paskelbė, kad rado pentakvarką. Kiti bandė tai pakartoti ir nerado. 2008 metais pagrindinis dalelių fizikos žinynas paskelbė, kad tokio pentakvarko nėra.

Sources: LEPS, PRL 91, 012002 (2003); PDG 2008 review: "overwhelming evidence that the claimed pentaquarks do not exist".
(~0.4 min)
-->

---
space: { at: [601.6, 0.2, 0], dist: 11, yaw: 18, pitch: 8, sway: 1, dim: 0.42 }
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

2015 metais LHCb pagaliau aptiko pentakvarkus – tik kitokius nei tas, apie kurį skelbta 2003-iaisiais. Šiame grafike – tikri LHCb duomenys. Jeigu dalelė egzistuoja, matuojant daug kartų ta pati masė vis pasikartoja ir grafike iškyla smailė. Ši smailė – pentakvarkas. Nuo idėjos iki atradimo praėjo penkiasdešimt vieneri metai.

Sources: LHCb, PRL 115, 072001 (2015), figure: m(J/ψ p) with the narrow Pc(4450)⁺ over the broad Pc(4380)⁺; CERN press release, 14 Jul 2015 (1 Feb 1964 → 14 Jul 2015 = 51 years).
(~0.4 min)
-->

---
space: { at: [601.6, 0.2, 0], dist: 11, yaw: 18, pitch: 8, sway: 1, dim: 0.42 }
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

2019 metais, surinkus daugiau duomenų, paaiškėjo, kad ta smailė iš tikrųjų yra dvi, ir atsirado dar viena. Iš viso trys pentakvarkai. Kaip penki kvarkai laikosi krūvoje, iki šiol tiksliai nežinoma. Pentakvarkai atsiranda, kai subyra sunkesnė dalelė. Mano užduotis buvo patikrinti, ar šie trys atsiranda ir tada, kai ji subyra kitaip.

Sources: LHCb, PRL 122, 222001 (2019): Pc(4312)⁺, and the 2015 Pc(4450)⁺ resolved into Pc(4440)⁺ and Pc(4457)⁺; CERN, 2022: their exact nature "largely unknown"; the speaker's thesis (Bonn, 2023) searched Λb⁰ → Λc⁺ D̄*⁰ K⁻ for these three.
(~0.5 min)
-->

---
space: { at: search, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 1, phantom: 0, route: 6 }" />

<!--
IV. PAIEŠKA
Message: it is a search for a needle in a haystack; I had to invent a new way to find the particle, and after two years it worked.
Picture: a wide, faint cloud of grains, the haystack; about 20 s in, a thread of light runs in and a small warm cluster gathers.

Tai kaip ieškoti adatos šieno kupetoje, didelėje kaip visa Lietuva. Ir net nežinai, kaip ta adata atrodo. Didžiąją laiko dalį rašai programas, kurios atsijoja duomenis, ir kompiuteriu modeliuoji, ką turėtum pamatyti, jei adata ten yra. Ir daug kalbiesi su kolegomis, nes naujos dalelės vienas nerasi.
Kad apskritai galėčiau ieškoti, turėjau sugalvoti naują būdą aptikti dalelę, kurios detektorius dažnai nepagauna. Maždaug po dvejų metų pirmą kartą pažiūrėjau į savo duomenų grafiką ir pamačiau kitas, jau žinomas daleles. Labai apsidžiaugiau, nes tai reiškė, kad mano būdas veikia.

Sources: LRT „Širdyje lietuvis“ (2024), 07:36 (the haystack), 06:15 („naujos dalelės vienas tikrai nerasi“), 11:12 (after about two years, other real short-lived particles, the happy dance) [ASR: re-listen].
Method: the thesis (Extended Cone Closure).
[PATIKSLINTI: ar taip atrodė darbo dienos; ar tos dalelės buvo „jau žinomos“; ar „sugalvoti“ pačiam ar su komanda.]
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

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 0, phantom: 5, route: 6 }" />

<!--
Message: the work still counted: others know where it was searched, and the method became my next project.
Picture: from the five faint clusters, arcs of gold run to one point beside them, where a cluster gathers and holds.

Bet darbas nenuėjo veltui. Dabar kiti žino, kur ieškota, ir gali ieškoti kitur. O mano sugalvotas būdas liko – jį naudoju savo dabartiniame projekte.

Sources: the thesis (Extended Cone Closure); CORDIS 101244743 (PHANTOM, 2025–27, uses that method).
(~0.3 min)
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

Kol ieškojau pentakvarkų, beveik dvejus metus ruošiau visus LHCb pirmųjų darbo metų duomenis – beveik milijoną gigabaitų –, kad juos galėtų atsisiųsti bet kas. 2023 metų gruodžio 20 dieną juos paskelbėme. Kitą dieną gyniau daktaro disertaciją. Tie duomenys prieinami ir tau – adresas ekrane.

Sources: M. Šarpis, „LHCb Run I Data is Released“ (Substack, 15 Jan 2024): close to two years, just under 1 PB; opendata.cern.ch: entire Run 1 public, 20 Dec 2023; thesis defence 21 Dec 2023.
(~0.5 min)
-->

---
space: { at: whole, sway: 0, dim: 0.78 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 0, phantom: 5, route: 6 }" />

<div class="plans">
<p class="kick">Mano planai · 2022 m. balandis</p>
<img src="/figures/planai-2022.jpg" alt="Ateities planai: Apsiginti PhD (liko 1–1,5 m.); Likti LHCb jeigu pavyks; Remote PostDoc (USA matyt); Gyventi Lietuvoje :O" />
</div>

<!--
V. PO TO
Message: halfway through the search I wrote down my plans.
Picture: my own slide from April 2022, over the map.

Dar 2022 metų pavasarį, įpusėjęs paiešką, susirašiau ateities planus. Apsiginti disertaciją. Likti LHCb, jeigu pavyks. Dirbti nuotoliu, matyt, JAV universitetui. Ir paskutinis punktas – „Gyventi Lietuvoje“ – su nustebusiu veiduku gale.

Source: M. Šarpis, LPPM 2022 participants' introductions (11 Apr 2022), MSarpisIntro.pdf p. 16 (public on Indico).
[PATIKSLINTI: ar tinka rodyti šią skaidrę.]
(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 0, phantom: 5, route: 7 }" />

<div class="city home" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 406px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>
<div class="city" style="left: 462px; top: 318px">Heidelbergas</div>
<div class="city r" style="left: 413px; top: 268px">Bona</div>

<!--
Message: a year and a half later I was building an LHCb group in Vilnius, which my plans had not foreseen.
Picture: the trail arcs home from Bonn to Vilnius.

Po pusantrų metų jau dirbau Vilniaus universitete ir kūrėme ten LHCb grupę. Grupės kūrimo mano planuose nebuvo. Nuo 2024 metų Vilniaus universitetas – oficialus LHCb dalyvis, o dauguma mūsų grupės narių – studentai.

Sources: ff.vu.lt: VU admitted to LHCb on 2 Sep 2024; VU, 20 Aug 2026: most of the group are students; the move home: the speaker's own account.
(~0.3 min)
-->

---
space: { at: origin, dist: 14, dim: 0 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 0, phantom: 5, route: 7 }" />

<div class="photo"><img src="/figures/photos/ngc1300.jpg" alt="Galaktika NGC 1300, Hubble teleskopo nuotrauka" /></div>

<div class="photo-credit">NGC 1300 · NASA, ESA ir The Hubble Heritage Team (STScI/AURA)</div>

<!--
VI. TAU
Message: the question I opened with is still open, and someone who does not yet know what they will be may answer it.
Picture: a real Hubble photograph of the galaxy NGC 1300, full frame, slowly drawing closer.

O klausimas, nuo kurio pradėjau, vis dar atviras. Štai viena iš galaktikų, susidariusių iš to likučio, – Hubble teleskopo nuotrauka. Pernai LHCb pirmą kartą pamatė, kad dalelės, giminingos protonams, elgiasi šiek tiek kitaip nei tokios pat dalelės iš antimedžiagos. Bet šio skirtumo per maža, kad paaiškintų, kodėl liko medžiaga. Gal atsakymą ras žmogus, kuris šiandien sėdi klasėje ir dar nežino, kuo bus.

Sources: CERN, 24 Mar 2025: first observation of CP violation in baryons (Λb); the CP violation known in the Standard Model is too small to account for the matter–antimatter imbalance (CERN, „The matter-antimatter asymmetry problem“). Photo: NASA, ESA and The Hubble Heritage Team (STScI/AURA), esahubble.org/images/opo0501a, CC BY 4.0 (cropped to 16:9).
(~0.6 min)
-->

---
space: { at: origin, dist: 14, dim: 0 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 0, phantom: 5, route: 7 }" />

<div class="photo dim right"><img src="/figures/photos/ngc1300.jpg" alt="Galaktika NGC 1300, Hubble teleskopo nuotrauka" /></div>

<div class="scrim-left"></div>

<div class="photo-credit">NGC 1300 · NASA, ESA ir The Hubble Heritage Team (STScI/AURA)</div>

<div class="say wide">
<p class="kick">Šią savaitę paklausk</p>
<p class="big">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
Message: you do not need to know yet; try things, ask people, and here is a task for this week.
Picture: the same galaxy, darker behind the question. Hold 2 s after the last word; no logos, no summary.

Tau nebūtina jau dabar žinoti, kuo būsi. Šešiolikos metų aš žinojau tik tiek, kad man įdomi fizika, bet nežinojau, kur ji mane nuves. Svarbiau bandyti įvairius dalykus – kaip aš mokykloje bandžiau verslą ir psichologiją. Turiu tau užduotį šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė]
Ir pažiūrėk, kas iš to išeis.
(~0.6 min)

Total about 9½ minutes of speech plus pauses and clips: about 10 minutes.
-->
