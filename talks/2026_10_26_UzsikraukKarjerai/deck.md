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
  palette: { base: blue, bg: '#04040c', accent: '#5b6fd6', dust: '#5b4fd6', dustBright: '#ebe6ff', nebula: '#3a2a9e', nebulaAlt: '#0f6e86', sky: '#9a8cff', fill: '#c9b8ff', highlight: '#fff0d0', dim: '#a39dc0' }
  options: { dustSize: 2.2, reach: 22, nebula: 0.4 }
title: Vadovėlio gale atsakymo nėra
duration: 12min
sources: notes
info: |
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement): a Lithuanian
  talk for grades 9–12, delivered online on 27 Oct 2026. About 10 minutes,
  14 slides. The viewer sits in the physicist's seat: judge a bump in a
  histogram (2003 yes, 2008 no, 2015 yes), then the speaker's own search,
  which found nothing, what the work trains, three things a student can do
  this year, and one question to ask someone this week. The histograms fill
  grain by grain: slide 7 from LHCb's published 2019 J/ψ p bins (HEPData);
  slides 2–4 and 10 are illustrations, said so in the notes.
layout: default
space: { at: [594, 0, 0], dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 0, th2: 0, jp: 0, mine: 0 }" />

<div class="scrim-left"></div>

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis<br>dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
I. VADOVĖLIO GALE ATSAKYMO NĖRA
Message: in my work there is no answer at the back of the book; today you will try it yourself.
Picture: a five-quark particle gathers out of the dust beside the title.

Mokykloje, kai nežinai atsakymo, gali pasižiūrėti vadovėlio gale. Aš esu dalelių fizikas Vilniaus universitete, ir mano darbe tokio vadovėlio nėra. Visi klausimai, su kuriais dirbu, yra tokie, į kuriuos dar niekas neatsakė. Šiandien pabandysi pats, kaip tai atrodo.

(~0.5 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 1, th2: 0, jp: 0, mine: 0 }" />

<div class="say top">
<p class="big">Ar čia dalelė?</p>
</div>

<!--
II. KAIP NUSPRĘSTI
Message: you decide: is this bump a particle or chance?
Picture: a histogram fills dot by dot (140 dots); one bin near the middle rises well above its neighbours.
Note: the plot is an illustration, not measured data: a random sample from a smooth spectrum with no particle in it, in which chance made the bump (public/data/theta-toy.json). Say „toks grafikas“, never „tikras“.

Štai toks grafikas, kokius matome kasdien. Kiekvienas taškelis – vienas susidūrimas, kurį užregistravo detektorius, o grafike jie sudėti pagal masę. Jeigu kažkurioje vietoje susidaro kauburys, gal ten yra dalelė, kurios dar niekas nematė. O gal tai tik atsitiktinumas, kaip kad metant kauliuką kelis kartus iš eilės iškrenta šešetas. Kaip manai, ar čia dalelė?
[pauzė 3 s]

(~0.6 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 1, th2: 0, jp: 0, mine: 0 }" />

<div class="say top">
<p class="big">2003 m. – taip.</p>
</div>

<!--
Message: in 2003 physicists said yes and announced a pentaquark; others soon saw a bump too.
Picture: the same small histogram.

2003 metais fizikai Japonijoje nusprendė, kad taip. Jie paskelbė, kad rado pentakvarką – dalelę iš penkių kvarkų. Tokių dalelių galimybę dar 1964 metais numatė kvarkų idėja, bet niekas jų nebuvo matęs. Netrukus panašų kauburį pamatė ir kitos grupės.

(~0.4 min)
-->

---
space: { at: trial, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 0, th2: 1, jp: 0, mine: 0 }" />

<div class="say top">
<p class="big">2008 m. – <span class="blue">ne.</span></p>
</div>

<!--
Message: with far more data the bump went away; by 2008 the claim was withdrawn.
Picture: the small histogram clears; 3 500 dots fall into the same bins and make a smooth, falling shape with no bump. Illustration, as on slide 2.

Tada kitos komandos pakartojo matavimą su daug daugiau duomenų. Kauburys išnyko. 2008 metais pagrindinis dalelių fizikos žinynas parašė, kad to pentakvarko nėra. Kauburys buvo atsitiktinumas, kurį per anksti palaikė dalele.

(~0.5 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_001.mp4" muted />

<div class="photo-credit">Video: CERN</div>

<!--
Message: years later my experiment took up the search, at the LHC.
Picture: real footage, a travelling shot along the LHC tunnel. Advance whenever you finish; the clip is long.

Po kelerių metų pentakvarkų ieškoti ėmėsi mano eksperimentas. Prie Ženevos, šimto metrų gylyje, yra dvidešimt septynių kilometrų žiedas – Didysis hadronų greitintuvas. Jame protonai susiduria beveik šviesos greičiu, ir per sekundę įvyksta milijonai susidūrimų.

(~0.4 min)
-->

---
space: { at: lhcb, dim: 0 }
---

<StagePhoto src="/figures/photos/lhcb-cavern.jpg" alt="LHCb detektoriaus urvas CERN, 2019">
<div class="photo-credit">LHCb, CERN · Foto: Rosa Menkman, CC BY 2.0</div>
</StagePhoto>

<!--
Message: LHCb is one of the collision points, and I am one of the people who work on it.
Picture: the real photograph of the LHCb cavern condenses out of grains.

Viename iš susidūrimo taškų stovi LHCb – penkių tūkstančių šešių šimtų tonų detektorius. Jame dirba daugiau nei tūkstantis aštuoni šimtai žmonių iš dvidešimt septynių šalių, ir aš esu vienas iš jų.

(~0.3 min)
-->

---
space: { at: lhcb, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 0, th2: 0, jp: 1, mine: 0 }" />

<div class="say top swap-out">
<p class="big">2015 m. – taip.</p>
</div>

<div class="say top swap-in">
<p class="big">2019 m. – <em>trys.</em></p>
</div>

<!--
Message: in 2015 LHCb saw a peak, checked everything, and it held; by 2019 it was three.
Picture: LHCb's real m(J/ψ p) spectrum (the published 2019 bins, 4,25–4,60 GeV, 27 292 candidates) fills candidate by candidate, fast at first, until the narrow peaks stand out (about 20 s); then the three peaks light up and the line on screen changes from „2015 m. – taip.“ to „2019 m. – trys.“. Time the last sentence of the script to that change.
Data: LHCb, PRL 122, 222001 (2019), HEPData ins1728691 Table 2 (m(Kp) > 1,9 GeV). These bins hold the 2015 sample and the later data together; the 2015 paper's own bins are not on HEPData.

2015 metais LHCb grafike vėl iškilo smailė. Šįkart duomenų buvo dešimtys tūkstančių, o ne šimtai. Prieš paskelbdama, LHCb komanda tikrino viską, ką sugalvojo: ar smailė neatsiranda dėl detektoriaus, dėl kitų dalelių, dėl to, kaip atrinkti duomenys. Ir abejojo pati savimi, nes 2003-iųjų istoriją visi prisiminė. Smailė liko. 2019 metais, su dar daugiau duomenų, ji išsiskyrė į tris pentakvarkus – tai, ką matai dabar.

(~0.7 min)
-->

---
space: { at: lhcb, dist: 21, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, th1: 0, th2: 0, jp: 1, mine: 0 }" />

<div class="say top">
<p class="big">Kuo skyrėsi?</p>
</div>

<!--
Message: the difference was more data, checking by people who did not want the result, and doubting yourself.
Picture: the full LHCb histogram, the camera drawing back.

Tai kuo skyrėsi 2003 ir 2015 metai? Duomenų buvo šimtus kartų daugiau. Rezultatą tikrino ne tie patys žmonės, kurie jo norėjo. Ir buvo daug abejonės, nukreiptos į save. Šito nėra vadovėlio gale, bet to galima išmokti.

(~0.4 min)
-->

---
space: { at: search, dim: 0.06 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: -1, th1: 0, th2: 0, jp: 1, mine: 0 }" />

<div class="say top">
<p class="kick">2019–2023 m.</p>
<p class="big">Mano paieška</p>
</div>

<!--
III. NERADAU
Message: my task was to check whether these three appear in another decay: a needle in a haystack, and after two years my method worked.
Picture: a wide field of straw-coloured grains, the haystack; a thread of light runs in and a white-gold cluster gathers.

2019 metais pradėjau doktorantūrą Heidelberge. Mano užduotis buvo patikrinti, ar šie trys pentakvarkai atsiranda ir tada, kai sunkesnė dalelė subyra kitaip. Tai kaip ieškoti adatos šieno kupetoje, kai net nežinai, kaip adata atrodo. Didžiąją laiko dalį rašiau programas, kurios atsijoja duomenis, ir daug kalbėjausi su kolegomis. Kad apskritai galėčiau ieškoti, turėjau sugalvoti naują būdą aptikti dalelę, kurią detektorius dažnai praleidžia. Po dvejų metų pamačiau, kad jis veikia.

(~0.6 min)
-->

---
space: { at: mine, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: -1, th1: 0, th2: 0, jp: 1, mine: 1 }" />

<div class="say top late">
<p class="big huge">Neradau.</p>
</div>

<!--
Message: after four and a half years: not found; a "no" tells the next people where not to look.
Picture: a histogram fills the same way as the LHCb one, and no peak comes.
Note: illustrative, not the thesis plot: a random sample from a smooth spectrum with no peak (public/data/search-toy.json). Replace it with the real thesis histogram if the speaker gives one.

Ieškojau ketverius su puse metų ir neradau.
[tyla 3 s]
Dabar žinome, kad tame skilime šie pentakvarkai, jeigu ir atsiranda, tai labai retai. 2008 metų „ne“ reiškė, kad niekam nebereikia tirti dalelės, kurios nėra. Mano „ne“ reiškia, kad tie, kurie ieškos po manęs, žinos, kur jau ieškota. O mano sugalvotą būdą dabar naudoju kitame projekte.

(~0.6 min)
-->

---
space: { at: whole, sway: 0, dim: 0.55 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: -1, th1: 0, th2: 0, jp: 1, mine: 1 }" />

<div class="say top wide">
<p class="kick">Ko išmokau</p>
<p class="big">Programuoti, statistikos, anglų kalbos,<br>dirbti komandoje ir abejoti savimi</p>
</div>

<!--
IV. KO TAI IŠMOKO
Message: the work trains skills that many jobs need; about three in four people who leave CERN work in industry.
Picture: the map of Europe gathers, dimmed, behind the line.

Ką aš iš tikrųjų išmokau per tuos metus? Programuoti, nes be programų tokių duomenų neperžiūrėsi. Statistikos, nes reikia mokėti pasakyti, kada kauburys yra atsitiktinumas. Dirbti komandoje su žmonėmis iš visų žemynų ir kalbėtis su jais angliškai. Ir abejoti savo pačio rezultatu. Tų pačių dalykų reikia labai daugelyje darbų. CERN skaičiavimu, maždaug trys iš keturių žmonių, išėjusių iš CERN, dirba pramonėje: duomenų analizėje, medicinoje, inžinerijoje, finansuose.

(~0.6 min)
-->

---
space: { at: whole, sway: 0, dim: 0.05 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: 7, th1: 0, th2: 0, jp: 1, mine: 1 }" />

<div class="city" style="left: 716px; top: 168px">Vilnius</div>
<div class="city" style="left: 414px; top: 374px">CERN</div>
<div class="city" style="left: 270px; top: 146px">Glazgas</div>
<div class="city" style="left: 474px; top: 318px">Heidelbergas</div>
<div class="city r" style="left: 405px; top: 254px">Bona</div>

<!--
Message: your own road is not in the back of the book either.
Picture: the trail draws across Europe: Vilnius → CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius.

Ir tavo paties kelio nėra vadovėlio gale. Iki dvylikos norėjau būti egiptologu. Studijavau Glazge ir ten dirbau vadybininku, kad turėčiau iš ko gyventi. Grįžęs į Lietuvą dirbau su lazeriais, doktorantūrą pradėjau Vokietijoje, o dabar Vilniaus universitete kartu su kolegomis kuriame LHCb grupę.

(~0.4 min)
-->

---
space: { at: quarks, dist: 22, yaw: 20, pitch: 6, sway: 0.5, dim: 0.6 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: 7, th1: 0, th2: 0, jp: 1, mine: 1 }" />

<div class="say top wide list">
<p class="kick">Ką gali padaryti jau šiais metais</p>
<p class="line">LHCb meistriškumo klasė Vilniaus universitete · vasaris–kovas</p>
<p class="line">„Beamline for Schools“ konkursas CERN · nuo 16 metų</p>
<p class="line">opendata.cern.ch</p>
</div>

<!--
V. TAVO ĖJIMAS
Message: three real things a student can do this year.
Picture: the five-quark particle far off, dimmed behind the three lines.
Check before the talk: the 2027 masterclass date at VU (2026: 26 February) and the 2027 Beamline for Schools call (past rules: 16 or older, teams of at least five with an adult coach).

O dabar tavo ėjimas. Kasmet vasarį–kovą Vilniaus universitete vyksta LHCb meistriškumo klasė: vieną dieną mokiniai analizuoja tikrus CERN duomenis ir rezultatus aptaria su kitų šalių grupėmis. CERN kasmet rengia konkursą „Beamline for Schools“: ne mažiau kaip penkių mokinių nuo šešiolikos metų komanda su mokytoju pasiūlo eksperimentą, o laimėtojai jį atlieka prie tikro greitintuvo. Ir LHCb duomenis gali atsisiųsti kiekvienas, nemokamai, adresu opendata.cern.ch.

(~0.8 min)
-->

---
space: { at: quarks, dist: 13, yaw: -14, pitch: 8, sway: 1, dim: 0.35 }
---

<Grains :set="{ pq: 3, needle: 0, dance: 1, phantom: 0, route: 7, th1: 0, th2: 0, jp: 1, mine: 1 }" />

<div class="scrim-left"></div>

<div class="say wide">
<p class="big huge">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
Message: one task for this week.
Picture: the five-quark particle of the cover, held. The question alone: no kicker, name or URL.

Ir viena užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, paklausk jo: „Ko jūs savo darbe dar nežinote?“
[pauzė 2 s]

(~0.4 min)

Total ≈ 8 min of speech plus pauses and the tunnel clip: about 9–10 minutes.
-->
