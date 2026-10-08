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
  palette: { base: blue, bg: '#020307', accent: '#3a4fa0', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }
  look: broadcast
  sound: false
  options: { lift: 0, nebula: 0, bloom: 0.32, exposure: 1.0, vignette: 0.45, dustGain: 1.0, density: 0.45, dustSize: 2.2, reach: 22 }
title: Vadovėlio gale atsakymo nėra
duration: 12min
sources: notes
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, filmed in the Delfi studio on 26 Oct 2026 and
  streamed to classrooms on 27 Oct 2026, 12:00. About 9 minutes, 16 slides,
  one thread: how the speaker came to one question with no answer in the
  book (do pentaquarks appear in another decay?), the question's history
  (the 1964 idea, the 2003 claim that others checked and did not confirm,
  LHCb's discovery in 2015 and the three states of 2019), his four and a
  half years of searching and its answer, „Neradau.“, why that check still
  counts, how his own plans turned out, and one task for the week. Real
  footage (LHC tunnel), real photographs (LHCb cavern, Gell-Mann, Zweig),
  real LHCb plots and his own 2022 slide, inside one world of grains
  (slidev-addon-stage on slidev-videos feat/broadcast). Laptop at 1920×1080,
  50 Hz, silent. Speaker notes carry the full script, timings and sources.
layout: default
space: { at: quarks, dist: 14, yaw: -14, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ pq: 0, needle: 0, dance: 0, phantom: 0, route: -1 }" />

<div class="scrim-left"></div>

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis<br>dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
I. KELIAS
Message: in my work there is no answer at the back of the book; I will tell you about one such question, and first how I came to it.
Picture: five faint clusters of grains drift apart beside the title; nothing holds yet. They return on slide 4 as the 1964 idea.

Kai mokykloje sprendi uždavinį ir nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Aš esu dalelių fizikas, ir mano darbe tokio vadovėlio nėra. Dirbu su klausimais, į kuriuos atsakymo dar niekas nežino. Papasakosiu apie vieną tokį klausimą, prie kurio dirbau ketverius su puse metų. Bet pirmiausia – kaip iki jo atėjau.

(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 0, needle: 0, dance: 0, phantom: 0, route: 3 }" />

<div class="city late" style="left: 716px; top: 168px">Vilnius</div>
<div class="city late" style="left: 414px; top: 374px">CERN</div>
<div class="city late" style="left: 270px; top: 146px">Glazgas</div>

<!--
Message: at sixteen I knew only that physics interested me; school, a first visit to CERN and Glasgow came first.
Picture: Europe gathers out of the dust; a trail of light runs Vilnius → CERN → Vilnius → Glasgow.

Iki dvylikos metų norėjau būti egiptologu, o nuo dvylikos – fiziku. Po pamokų lankiau ne tik fizikos, bet ir verslo bei psichologijos užsiėmimus. Vienuoliktoje klasėje pirmą kartą nuvažiavau į CERN – Europos dalelių fizikos laboratoriją prie Ženevos. Studijuoti išvykau į Glazgą. Kad turėčiau iš ko gyventi, dirbau vadybininku, ir su fizika tas darbas neturėjo nieko bendro. Baigiamajam bakalauro darbui pirmą kartą gavau tikrus duomenis iš CERN eksperimento.

Sources: LRT „Širdyje lietuvis“ (2024), 03:11 (Egyptologist until 12, then physics); Mokslo sriuba podcast #62 (2019), 00:39 (first visit to CERN in 11th grade) and 32:39 (BSc thesis on LHCb data); Substack „A New Beginning“ (2024): "had to support myself so ended up working as a manager"; INSPIRE: Glasgow 2011–15; the after-school courses: the speaker's own account. Open items for the speaker are in the talk's CLAUDE.md.
(~0.6 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="city" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 414px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>
<div class="city" style="left: 474px; top: 318px">Heidelbergas</div>
<div class="city r" style="left: 405px; top: 254px">Bona</div>

<!--
Message: I left particle physics, came back for a PhD, and the PhD gave me my question: pentaquarks.
Picture: the trail runs on: back to Vilnius, then Heidelberg, then Bonn.

Po studijų grįžau į Vilnių ir iš dalelių fizikos išėjau – dirbau su lazeriais. Į dalelių fiziką grįžau per doktorantūrą. Doktorantūra – tai keleri metai, per kuriuos atlieki vieną didelį tyrimą. Rinkausi Heidelbergą, nes norėjau dirbti didelėje komandoje, kuri ieško naujų dalelių. Po pusmečio prasidėjo pandemija, ir tais pačiais metais visa mūsų grupė persikėlė į Boną. Doktorantūroje gavau užduotį apie daleles, kurios vadinamos pentakvarkais. Kad būtų aišku, kas tai, reikia grįžti į 1964-uosius.

Sources: INSPIRE: VU 2017–19, Heidelberg 2019–20, Bonn 2020–23; the thesis acknowledgements (Bonn, 2023): the pandemic six months in, the group's move to Bonn; LRT „Širdyje lietuvis“ (2024), 04:36–05:03: chose LHCb in Heidelberg over a laser PhD because he wanted the collaboration; the laser work: the speaker's own account.
(~0.6 min)
-->

---
space: { at: [602.5, 0.2, 0], dist: 20, yaw: -18, pitch: 8, sway: 1, dim: 0.15 }
---

<Grains :set="{ pq: 0, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big huge">1964</p>
</div>

<div class="portraits">
<figure><img src="/figures/photos/gell-mann.jpg" alt="Murray Gell-Mann" /><figcaption>Murray Gell-Mann<small>Foto: Joi Ito, CC BY 2.5</small></figcaption></figure>
<figure><img src="/figures/photos/zweig.jpg" alt="George Zweig" /><figcaption>George Zweig<small>Foto: Peacearth, CC BY-SA 4.0</small></figcaption></figure>
</div>

<!--
II. KLAUSIMAS
Message: in 1964 the quark idea allowed particles of five quarks, and nobody knew whether they exist.
Picture: portraits of the two physicists; behind them the five faint clusters of the cover drift apart.

1964 metais du fizikai, Murray Gell-Mannas ir George'as Zweigas, pasiūlė, kad protonai ir neutronai sudaryti iš dar mažesnių dalelių – kvarkų. Protoną sudaro trys kvarkai. Pagal tą pačią idėją galėjo egzistuoti ir dalelės iš penkių kvarkų – pentakvarkai. Ar jų iš tikrųjų yra, niekas nežinojo.

Sources: Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401 (1964); the same model allows pentaquarks (LHCb, PRL 115, 072001 (2015), introduction). Photos: Joi Ito (commons.wikimedia.org/wiki/File:MurrayGellMannJI1.jpg, CC BY 2.5); Peacearth (commons.wikimedia.org/wiki/File:George_Zweig.jpg, CC BY-SA 4.0); both cropped.
(~0.4 min)
-->

---
space: { at: quarks, dist: 11, dim: 0.1 }
---

<Grains :set="{ pq: 1, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="kick">2003 m.</p>
<p class="big">Paskelbė, kad rado.</p>
</div>

<!--
Message: in 2003 a group announced it had found a pentaquark, and others soon reported the same.
Picture: the five clusters half-gather, dim.

Pentakvarkų ieškota dešimtmečius. 2003 metais Japonijoje viena eksperimento grupė paskelbė, kad rado pentakvarką. Netrukus panašiai pranešė ir kelios kitos grupės.

Sources: LEPS (SPring-8), PRL 91, 012002 (2003); the further positive reports are listed in the PDG 2004 review of the Θ⁺(1540).
(~0.3 min)
-->

---
space: { at: quarks, dist: 11, dim: 0.1 }
---

<Grains :set="{ pq: 2, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="kick blue">2008 m.</p>
<p class="big">Paaiškėjo, kad jo nėra.</p>
</div>

<!--
Message: others checked with more data and found nothing; by 2008 the claim was withdrawn.
Picture: the clusters fall apart and fade.

Tada kitos grupės bandė tą patį pamatyti su daug didesniu duomenų kiekiu ir nepamatė. 2008 metais dalelių fizikos žinynas, kuriuo naudojasi visi šios srities fizikai, paskelbė, kad to pentakvarko nėra.

Sources: PDG 2008 review: "overwhelming evidence that the claimed pentaquarks do not exist".
(~0.3 min)
-->

---
space: { at: [604.2, -1.6, 0], dist: 13.5, yaw: 18, pitch: 8, sway: 1, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_001.mp4" muted />

<div class="photo-credit">Video: CERN</div>

<!--
Message: pentaquarks were found after all, at CERN, where the LHC collides protons.
Picture: real footage, a travelling shot along the LHC tunnel (CERN-FOOTAGE-2022-013-001). Advance whenever you finish; the clip is long.

Pentakvarkus vis dėlto rado CERN'e. Prie Ženevos, šimto metrų gylyje, yra Didysis hadronų greitintuvas – dvidešimt septynių kilometrų žiedas. Kai jis veikia, protonai lekia vieni priešais kitus beveik šviesos greičiu ir susiduria. Iš susidūrimo energijos atsiranda naujų dalelių.

Sources: home.cern LHC page (27 km, 100 m underground, close to the speed of light). The LHC is off since 29 Jun 2026 (Long Shutdown 3), hence „kai jis veikia“.
(~0.4 min)
-->

---
space: { at: [604.2, -1.6, 0], dist: 13.5, yaw: 18, pitch: 8, sway: 1, dim: 0 }
---

<div class="photo"><img src="/figures/photos/lhcb-cavern.jpg" alt="LHCb detektoriaus urvas CERN, 2019" /></div>

<div class="photo-credit">LHCb, CERN · Foto: Rosa Menkman, CC BY 2.0</div>

<!--
Message: one of the collision points is LHCb, and I am one of the people who work on it.
Picture: a real photograph of the LHCb cavern (2019), full frame, slowly drawing closer.

Vienoje iš vietų, kur protonai susiduria, stovi LHCb – 5 600 tonų detektorius. Jis pastatytas tirti, kuo medžiaga skiriasi nuo antimedžiagos, bet juo galima tirti ir kitas retas daleles. LHCb eksperimente dirba daugiau nei 1 800 žmonių iš 27 šalių, ir aš esu vienas iš jų.

Sources: home.cern/science/experiments/lhcb (5 600 t; matter and antimatter); LHCb Starterkit, 1 Dec 2025 (1 844 members, 108 institutes, 27 countries). Photo: Rosa Menkman, flickr.com/photos/r00s/48815389756, CC BY 2.0 (cropped to 16:9).
(~0.4 min)
-->

---
space: { at: [604.2, -1.6, 0], dist: 13.5, yaw: 18, pitch: 8, sway: 1, dim: 0.55 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="kick">Nuo idėjos iki atradimo</p>
<p class="num gold">51</p>
<p class="line">metai</p>
</div>

<img class="plot" src="/figures/lhcb/LHCb-PAPER-2015-029_mjpsip-default_crop.png" alt="LHCb 2015: J/ψ p masės skirstinys su siaura pentakvarko smaile" />

<div class="credit">LHCb, PRL 115, 072001 (2015), CC BY 4.0</div>

<!--
Message: LHCb found pentaquarks in 2015, 51 years after the idea.
Picture: on the left the five clusters gather, hold and burn bright; on the right the real LHCb plot.

2015 metais LHCb pagaliau aptiko pentakvarkus, tik kitokius nei tas, apie kurį skelbta 2003-iaisiais. Šiame grafike – tikri LHCb duomenys. Kai dalelė egzistuoja, matuojant vėl ir vėl kartojasi ta pati masė, ir grafike iškyla smailė. Ši smailė – pentakvarkas. Nuo idėjos iki atradimo praėjo penkiasdešimt vieneri metai.

Sources: LHCb, PRL 115, 072001 (2015), figure: m(J/ψ p) with the narrow Pc(4450)⁺ over the broad Pc(4380)⁺; CERN press release, 14 Jul 2015 (1 Feb 1964 → 14 Jul 2015 = 51 years).
(~0.4 min)
-->

---
space: { at: [604.2, -1.6, 0], dist: 13.5, yaw: 18, pitch: 8, sway: 1, dim: 0.55 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: 6 }" />

<div class="say">
<p class="big huge">2019</p>
</div>

<img class="plot" src="/figures/lhcb/LHCb-PAPER-2019-014_mjpsip-spectrum-19_crop.png" alt="LHCb 2019: J/ψ p masės skirstinys su trimis siauromis smailėmis" />

<div class="credit">LHCb, PRL 122, 222001 (2019), CC BY 4.0</div>

<!--
Message: in 2019 there were three, the year I started my PhD, and my task was to check whether they appear in another decay.
Picture: the same clusters; on the right the 2019 plot with three narrow peaks.

2019 metais, surinkus daugiau duomenų, paaiškėjo, kad ta smailė iš tikrųjų yra dvi, ir atsirado dar viena. Iš viso trys pentakvarkai. Kaip penki kvarkai laikosi kartu, iki šiol tiksliai nežinoma. Tais pačiais metais pradėjau doktorantūrą. Pentakvarkai atsiranda, kai subyra sunkesnė dalelė. Mano užduotis buvo patikrinti, ar šie trys atsiranda ir tada, kai ta dalelė subyra kitaip.

Sources: LHCb, PRL 122, 222001 (2019): Pc(4312)⁺, and the 2015 Pc(4450)⁺ resolved into Pc(4440)⁺ and Pc(4457)⁺; CERN, 2022: their exact nature "largely unknown"; the speaker's thesis (Bonn, 2023) searched Λb⁰ → Λc⁺ D̄*⁰ K⁻ for these three.
(~0.5 min)
-->

---
space: { at: search, dim: 0.06 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: 6 }" />

<!--
III. PAIEŠKA
Message: it is a search for a needle in a haystack; I had to invent a new way to find the particle, and after two years it worked.
Picture: a wide, faint cloud of straw-coloured grains, the haystack; about 20 s in, a thread of light runs in and a small white-gold cluster gathers.

Tai kaip ieškoti adatos šieno kupetoje, didelėje kaip visa Lietuva. Ir net nežinai, kaip ta adata atrodo. Didžiąją laiko dalį rašai programas, kurios atsijoja duomenis, ir kompiuteriu modeliuoji, ką turėtum pamatyti, jei adata ten yra. Daug kalbiesi su kolegomis, nes naujos dalelės vienas nerasi.
Kad apskritai galėčiau ieškoti, turėjau sugalvoti naują būdą aptikti dalelę, kurią detektorius dažnai praleidžia. Maždaug po dvejų metų pirmą kartą pažiūrėjau į savo duomenų grafiką ir pamačiau jame jau žinomas daleles. Labai apsidžiaugiau, nes tai reiškė, kad mano būdas veikia.

Sources: LRT „Širdyje lietuvis“ (2024), 07:36 (the haystack), 06:15 („naujos dalelės vienas tikrai nerasi“), 11:12 (after about two years, other real short-lived particles, the happy dance). Method: the thesis (Extended Cone Closure).
(~0.8 min)
-->

---
space: { at: search, dist: 11, yaw: 6, sway: 1, dim: 0.08 }
---

<Grains :set="{ pq: 3, needle: 1, dance: 1, phantom: 0, route: 6 }" />

<div class="say late">
<p class="big huge">Neradau.</p>
</div>

<!--
Message: after four and a half years the answer was: not found.
Picture: five faint clusters appear in the haystack, drift toward each other and apart, never holding. The world full-frame, then the word.

Po ketverių su puse metų mano atsakymas buvo toks: neradau.
[tyla 3 s]
Tame skilime šių pentakvarkų nematyti. Jeigu jie ten ir atsiranda, tai labai retai.

Source: the thesis (Bonn, 2023): no signal; upper limits at 95 % CL: Pc(4312)⁺ < 0,52 %, Pc(4440)⁺ < 0,65 %, Pc(4457)⁺ < 0,54 %.
(~0.3 min)
-->

---
space: { at: [902, 0, 0.5], dist: 10, yaw: -24, pitch: 8, sway: 1, dim: 0.06 }
---

<Grains :set="{ pq: 3, needle: 1, dance: 0, phantom: 5, route: 6 }" />

<!--
Message: a search that finds nothing is a check like the one in 2008, and the method I built carried on into my next project.
Picture: from the five faint clusters, arcs of gold run to one point beside them, where a cluster gathers and holds.

Prisimink 2003-iuosius. Vieni paskelbė, kad rado, o kiti patikrino ir nerado. Mano darbas buvo toks pat patikrinimas. Dabar kiti žino, kur jau ieškota ir kaip retai tie pentakvarkai galėtų ten atsirasti, todėl gali ieškoti kitur. O mano sugalvotas būdas liko. Jį naudoju savo dabartiniame projekte.

Sources: the thesis (upper limits; Extended Cone Closure); CORDIS 101244743 (PHANTOM, 2025–27, uses that method).
(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.78 }
---

<Grains :set="{ pq: 3, needle: 1, dance: 0, phantom: 5, route: 6 }" />

<div class="plans">
<p class="kick">Mano planai · 2022 m. balandis</p>
<img src="/figures/planai-2022.jpg" alt="Ateities planai: Apsiginti PhD (liko 1–1,5 m.); Likti LHCb jeigu pavyks; Remote PostDoc (USA matyt); Gyventi Lietuvoje :O" />
</div>

<!--
IV. PO TO
Message: halfway through the search I wrote down my plans, and living in Lithuania was the one that surprised me.
Picture: my own slide from April 2022, over the dimmed map.

2022 metų pavasarį, įpusėjęs paiešką, susirašiau ateities planus. Apsiginti disertaciją. Likti LHCb, jeigu pavyks. Dirbti nuotoliu, matyt, JAV universitetui. Ir paskutinis punktas – „Gyventi Lietuvoje“ – su nustebusiu veiduku gale. Disertaciją apgyniau 2023 metų gruodį.

Sources: M. Šarpis, LPPM 2022 participants' introductions (11 Apr 2022), MSarpisIntro.pdf p. 16 (public on Indico); thesis defence 21 Dec 2023.
(~0.4 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 1, dance: 0, phantom: 5, route: 7 }" />

<div class="city home" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 414px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>
<div class="city" style="left: 474px; top: 318px">Heidelbergas</div>
<div class="city r" style="left: 405px; top: 254px">Bona</div>

<!--
Message: a year and a half later I was back in Vilnius, helping to build an LHCb group, which no plan of mine had foreseen.
Picture: the trail arcs home from Bonn to Vilnius.

Po pusantrų metų jau dirbau Vilniaus universitete, ir kartu su kolegomis kūrėme ten LHCb grupę. Grupės kūrimo mano planuose nebuvo. Nuo 2024 metų Vilniaus universitetas – oficialus LHCb narys, o dauguma mūsų grupės narių – studentai.

Sources: ff.vu.lt: VU admitted to LHCb on 2 Sep 2024; VU, 20 Aug 2026: most of the group are students; the move home: the speaker's own account.
(~0.3 min)
-->

---
space: { at: whole, sway: 0, dim: 0.6 }
---

<Grains :set="{ pq: 3, needle: 1, dance: 0, phantom: 5, route: 7 }" />

<div class="scrim-left"></div>

<div class="say wide">
<p class="kick">Šią savaitę paklausk</p>
<p class="big">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
Message: you do not need to know yet; try things, and here is a task for this week.
Picture: the same map with the whole route, dimmed behind the question. Hold 2 s after the last word; no logos, no summary.

Tau nebūtina jau dabar žinoti, kuo būsi. Šešiolikos metų žinojau tik tiek, kad man įdomi fizika, bet nežinojau, kur ji mane nuves. Svarbiau bandyti įvairius dalykus, kaip aš mokykloje bandžiau verslą ir psichologiją. Turiu tau užduotį šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė]
Ir pažiūrėk, kas iš to išeis.

(~0.5 min)

Total about 7 minutes of speech, plus pauses and the tunnel clip: about 8–9 minutes.
-->
