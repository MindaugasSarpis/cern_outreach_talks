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
  „Užsikrauk karjerai“ (Delfi × Lietuvos Junior Achievement), a 13-minute
  Lithuanian talk for grades 9–12, filmed in the Delfi studio on 26 Oct 2026
  and streamed to classrooms on 27 Oct 2026, 12:00. Told inside one world of
  grains (slidev-addon-stage, pinned like OpenData and Innoday to
  slidev-videos 640eaa5): matter and antimatter, the LHC, a five-quark
  particle that is claimed, retracted and found, a haystack with a ghost in
  it, a crooked path across a Europe of grains, and a galaxy. Built for
  television: huge type inside the title-safe area, no film grain, slow
  motion, no sound from the deck, laptop output 1920×1080 at 50 Hz.
  The talk's own forms are setup/grains.js; <Grains> on a slide sets their
  step. Speaker notes carry the full Lithuanian script, timings, sources and
  every [PATIKSLINTI] item. `c` replays what builds itself where the camera is.
space: { at: origin, dim: 0.05 }
---

<Grains :set="{ bang: 1, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<!--
0:00 · ~25 s · KLAUSIMAS (no text: the speaker to the lens, the world full-frame from „Pažiūrėk.“)
The world: the hot cloud forms: gold grains are matter, blue antimatter, turning in slow swirls.

Yra klausimas, į kurį neatsakys nei tavo mokytojas, nei aš, nei joks vadovėlis pasaulyje. Ne todėl, kad jis per sunkus. Todėl, kad atsakymo dar niekas neturi.
[pauzė]
Pažiūrėk. Auksinės dalelės – medžiaga. Mėlynos – antimedžiaga, jos veidrodinis dvynys. Visatos pradžioje buvo ir tų, ir tų. O kai auksinė susitinka su mėlyna…
→ [spausk ant „…abi išnyksta“]

Sources: home.cern/science/physics/antimatter (matter and antimatter after the Big Bang).
Before filming: agree the „tu“ form with the organisers.
-->

---
space: { at: origin, dist: 24, dim: 0.05 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<!--
0:25 · ~15 s · SUSINAIKINIMAS ★ (no text)
The world: the pairs meet and go out as light, one slow wave from the rim inward
(the outer pairs first); the light grains fly apart and fade; brightness only falls.

…abi išnyksta. Jeigu jų būtų buvę po lygiai, būtų išnykę viskas. Nebūtų žvaigždžių. Nebūtų Žemės. Nebūtų tavęs.
[tyla 5 s – leisk pasauliui kalbėti]

The flying light is the picture only; the speech says just „išnyksta“.
Flash safety: no full-frame change; the light grains stay small and dim.
-->

---
space: { at: origin, dist: 17, dim: 0.1 }
---

<Grains :set="{ bang: 2, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="kick">Kiekvienam milijardui –</p>
<p class="num gold">+1</p>
</div>

<div class="src">≈ 1 papildoma medžiagos dalelė milijardui antidalelių · home.cern</div>

<!--
0:40 · ~18 s · +1
The world: only the remainder is left, a handful of gold grains in the dark; the camera moves in.

Bet medžiagos buvo truputį daugiau. Kiekvienam milijardui antimedžiagos dalelių – maždaug milijardas ir viena medžiagos dalelė. Poros išnyko. Liko ta viena iš milijardo. Ir iš tų likučių – viskas, ką matai: žvaigždės, Žemė, tu.

Source: CERN, „Antimatter“ (home.cern/science/physics/antimatter): "approximately one extra particle per billion antiparticles … This forms everything that we see today".
-->

---
space: { at: origin, dist: 12, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="big">Kodėl apskritai<br>kažkas liko?</p>
</div>

<!--
0:58 · ~10 s · KODĖL?
The world: the remainder gathers into one warm knot, turning slowly. It comes back at the end.

O kodėl ji liko? Niekas nežino. Ne „aš nežinau“ – niekas pasaulyje nežino.

Source: CERN: "some unknown mechanism".
-->

---
space: { at: [-16, 1.2, 0], dist: 30, yaw: -12, pitch: 8, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say title">
<p class="kick">Užsikrauk karjerai</p>
<p class="big huge">Vadovėlio gale<br>atsakymo nėra</p>
<p class="byline">Mindaugas Šarpis · dalelių fizikas · Vilniaus universitetas</p>
</div>

<!--
1:08 · ~22 s · VADOVĖLIO GALE (the title card: full-frame ~4 s, then the speaker to the lens)
The world: the knot sits small to the right in the dark.

Esu Mindaugas, dalelių fizikas. Mokykloje atsakymas į kiekvieną uždavinį laukia vadovėlio gale. Mano darbe tokio vadovėlio nėra. Tavęs turbūt dažnai klausia: „Kuo būsi?“ Aš šiandien kalbėsiu apie kitą klausimą – „kodėl?“ Ir, beje, šitie du klausimai susiję labiau, nei atrodo. Prie to dar grįšim.
-->

---
space: { at: collider, dim: 0 }
---

<VideoPlayer src="cern_overview_short.mp4" muted />

<div class="say on-clip">
<p class="kick">CERN, prie Ženevos</p>
<p class="big">Pirmą kartą –<br>11-oje klasėje</p>
</div>

<!--
1:30 · ~20 s · VIETA (the CERN aerial clip condenses out of the grains; under it the camera flies to the ring)

Yra vieta, kur atsakymo į mūsų klausimą ieško kasdien. CERN'as, prie Ženevos. Pirmą kartą čia atvažiavau vienuoliktoje klasėje – dar mokinys, kaip ir tu.
[PATIKSLINTI, neprivaloma: kaip ten patekai – vienas sakinys. Ar tai buvo COMENIUS ekologijos susitikimas Ženevoje? Jei taip: „Važiavau ne dėl dalelių – važiavau kalbėti apie vandenį ir ekologiją.“]
Nuo tada grįžau daugybę kartų ir kaskart jaučiu tą pačią nuostabą.
[PATIKSLINTI: tai tavo 2019 m. žodžiai – ar vis dar tiesa?]

Sources: Mokslo sriuba podcast #62 (2019), 00:39 [ASR: re-listen]: first visit in 11th grade, ~10 visits, the same wonder each time.
-->

---
space: { at: collider, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<!--
1:50 · ~30 s · ŽIEDAS ★ (no text; the ring full-frame, the speaker for „Nesvarbu, ar tu daktaras…“)
The world: the LHC as a ring of streaming grains; two bunches run against each other and meet twice a lap (a spray every ~4.5 s).

Šimtą metrų po žeme – dvidešimt septynių kilometrų žiedas, Didysis hadronų greitintuvas. Kai jis veikia, protonai lekia vieni priešais kitus beveik šviesos greičiu ir susiduria. Tai tarsi iššauti dvi adatas viena į kitą iš dešimties kilometrų taip, kad jos susitiktų per vidurį. Nesvarbu, ar tu mokslų daktaras, ar profesorius, – niekas iki galo nesupranta, kaip veikia visas šitas greitintuvas. Bet jis veikia. Nes prie jo kartu dirba tūkstančiai žmonių.

Sources: home.cern LHC page (27 km, 100 m underground, two needles 10 km apart); the LHC is off since 29 Jun 2026 for Long Shutdown 3, hence „kai jis veikia“; Mokslo sriuba podcast #62, 02:17 [ASR: re-listen] („niekas iki galo nesupranta … bet jisai veikia“).
-->

---
space: { at: collider, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_042_001.mp4" muted />

<!--
2:20 · ~20 s · LHCb (the detector fly-in condenses out of the grains; cut to the speaker for „Aš čia dirbu…“)

Viename iš susidūrimo taškų stovi LHCb – penkių tūkstančių šešių šimtų tonų „fotoaparatas“, kuris fotografuoja tuos susidūrimus. Jis pastatytas būtent dėl mūsų klausimo: kur dingo antimedžiaga. Aš čia dirbu. Su LHCb duomenimis – nuo 2014-ųjų.
[pauzė]
Su pertrauka.

Sources: home.cern/science/experiments/lhcb (5600 t; why matter and not antimatter). „nuo 2014-ųjų“: his words, LRT 8 Jan 2025.
Clip: CERN-FOOTAGE-2022-042-001 (LHCb detector 3D fly-in, silent). Advance before it ends if you like.
-->

---
space: { at: quarks, dist: 15, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 0, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="kick">1963</p>
<p class="big">Negaišk laiko<br>nesąmonėms</p>
</div>

<div class="src">CERN Courier, „Nineteen sixty-four“, 2025</div>

<!--
2:40 · ~35 s · 1963
The world: five clusters of grains drift apart, nothing holds yet: an idea on paper.

Kiek laiko gali tekti laukti atsakymo į tokį klausimą? Papasakosiu vieną istoriją. 1963-ieji. Vienas fizikas sugalvoja drąsią idėją: protonai ir neutronai sudaryti iš dar mažesnių dalelių – kvarkų. Kai jis paskambina kolegai į užsienį ir apie tai papasakoja, tas jį subara: negaišk laiko tokioms nesąmonėms. 1964-aisiais jis idėją vis tiek paskelbia – nors pats abejoja, ar kvarkai iš tikrųjų yra. O pagal tą pačią idėją gali būti ir keistesnių dalelių – iš penkių kvarkų. Pentakvarkų. Ar jie yra? Prasideda paieškos.

Sources: CERN Courier, "Nineteen sixty-four" (M. Riordan, Sep 2025): through 1963 Gell-Mann discussed the idea, Weisskopf on an international call chided him "not to waste their time talking about such nonsense"; he wrote it up in late 1963, published 1 Feb 1964, doubting quarks were real ("…the non-existence of real quarks"); the 1964 quark model allows pentaquarks (LHCb, arXiv:1507.03414). The card is a paraphrase, so no quotation marks; no names said.
-->

---
space: { at: quarks, dist: 11, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 1, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="kick">2003</p>
<p class="big">Atrasta!</p>
</div>

<!--
3:15 · ~15 s · ATRASTA
The world: the five clusters half-gather, dim: a claim seen in half-light.

2003-ieji. Sensacija: pentakvarkas rastas! Tais metais tai buvo vienintelė dalelių fizikos naujiena, kurią Amerikos fizikos institutas įtraukė į metų apžvalgą.

Sources: LEPS, PRL 91, 012002 (2003); PDG 2008 review: "The only advance in particle physics thought worthy of mention in the American Institute of Physics 'Physics News in 2003' was a false alarm." Keep this slide and the next back to back.
-->

---
space: { at: quarks, dist: 13, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 2, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="kick">2008</p>
<p class="big">Jo nėra.</p>
</div>

<div class="src">LEPS, 2003 · Particle Data Group, 2008</div>

<!--
3:30 · ~20 s · JO NĖRA
The world: the clusters let go and drift apart, fading.

Bet kiti ieškojo to paties – ir nerado. 2008-aisiais pagrindinis dalelių fizikos žinynas paskelbė: daugybė įrodymų rodo, kad tokių pentakvarkų nėra. Tai lyg prieš visą klasę pasakyti „klydau“. Nelengva. Bet būtent taip mokslas juda pirmyn.

Source: PDG 2008 (C. G. Wohl): "overwhelming evidence that the claimed pentaquarks do not exist". The field said „klydau“ (the PDG dropped Θ⁺ by 2008); the original LEPS team never retracted, so don't imply the discoverers themselves said it.
-->

---
space: { at: [595.8, 0.4, 0], dist: 11, yaw: 18, pitch: 10, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: -1, home: 0 }" />

<div class="say">
<p class="kick">1964 → 2015</p>
<p class="num gold">51 <span class="unit">metai</span></p>
</div>

<div class="src">CERN, 2015-07-14 · LHCb, PRL 115, 072001 · LHCb, 2019</div>

<!--
3:50 · ~40 s · 51 METAI ★
The world: the camera comes round; the five clusters gather and hold, joined by flowing strings, and burn bright: the lights are on.

O 2015-ųjų liepą LHCb paskelbė: pentakvarkai yra. Ne tie iš 2003-iųjų – visai kiti. CERN'as tada rašė: ankstesnės paieškos lyg ieškojo siluetų tamsoje, o LHCb ieškojo įjungęs šviesą.
Nuo idėjos iki atradimo – penkiasdešimt vieneri metai. Kai dirbi su tokiais klausimais, kartais jauti, kad atsakymą geriausiu atveju pamatys tavo vaikai. O kaip tie penki kvarkai laikosi krūvoje, iki šiol tiksliai nežino niekas. 2019-aisiais LHCb pamatė jau tris pentakvarkus. Būtent šių trijų aš vėliau ieškojau kitur.

Sources: CERN press release 14 Jul 2015 (its own text, not a quote of a physicist: "as if the previous searches were looking for silhouettes in the dark, whereas LHCb conducted the search with the lights on"; 1 Feb 1964 → 14 Jul 2015 = 51 years); LHCb 2019 (Pc(4312)⁺, Pc(4440)⁺, Pc(4457)⁺, PRL 122, 222001); CERN 2022: "the exact nature … largely unknown"; „tavo vaikai“: LRT „Širdyje lietuvis“ (2024), 10:29 [ASR: re-listen].
"Three" = the three narrow 2019 states (a simplification).
-->

---
space: { at: vilnius, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 4, home: 0 }" />

<!--
4:30 · ~40 s · EGIPTOLOGAS (no text; the speaker to the lens for the last three sentences)
The world: Europe gathers out of the dust; at Vilnius a trail of light begins, swings off in a small loop (the Egyptologist) and threads three small clusters (the schools).

O kaip aš pats čia atsidūriau? Tikrai ne tiesiu keliu. Iki dvylikos norėjau būti archeologu, egiptologu – gal dėl Indianos Džounso. O nuo dvylikos – fiziku. Jei pagalvoji, ne taip ir toli: abu kasinėja tai, ko dar niekas nematė. [PATIKSLINTI: ši mintis – scenarijaus, ne tavo; palik, jei tinka] Po pamokų dar lankiau verslo, psichologijos ir fizikos mokyklas. Verslo mokykloje sugalvojau kelis ekologijos projektus ir pats jiems vadovavau. Nė viena iš tų mokyklų nebuvo privaloma. Tokių durų yra ir aplink tave: būrelis, projektas, savanorystė, vasaros praktika. Keturiems iš dešimties Jaunimo savanoriškos tarnybos dalyvių savanorystė padėjo renkantis profesiją.

Sources: LRT „Širdyje lietuvis“ (2024), 03:11 [ASR: re-listen] (Egyptologist until 12, then physics); the schools and the ecology projects: the speaker's own account [PATIKSLINTI: tikslūs pavadinimai ir metai]; LINEŠA, „Profesinis orientavimas Lietuvos mokyklose 2023–2024“, citing the JRA study of the Jaunimo savanoriška tarnyba programme (Kairė, 2024): 41,4 % of its participants (not of all young volunteers).
[PATIKSLINTI: tikslūs mokyklų pavadinimai lietuviškai.]
-->

---
space: { at: glasgow, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 7, home: 0 }" />

<!--
5:10 · ~30 s · GLAZGAS (no text)
The world: the trail's longest arc yet, west to Glasgow; a grey cluster beside it (the job), then a gold one (the first real LHCb data).

Aštuoniolikos išvažiavau į Škotiją, į Glazgą, studijuoti teorinės fizikos: Lietuvoje galimybių užsiimti dalelių fizika tada buvo labai mažai.
[PATIKSLINTI, neprivaloma: kodėl būtent Glazgas – vienas sakinys]
Išsilaikyti turėjau pats, tad studijuodamas dirbau įmonėje, kuri parduotuvėse atlieka inventorizacijas: atrinkau ir mokiau darbuotojus, vėliau tapau vadovu. Su fizika – nieko bendro. O bakalauro darbui pirmą kartą gavau tikrus LHCb duomenis. Tema – atspėk – kuo skiriasi medžiaga ir antimedžiaga. Tas pats klausimas, nuo kurio pradėjome.

Sources: Glasgow 2011–15 (INSPIRE); Substack „A New Beginning“ (2024-01-05): "opportunities … very limited", "had to support myself so ended up working as a manager"; the inventory company and the recruiting: the speaker's own account [PATIKSLINTI]; BSc thesis on CP violation in B → ππ with LHCb data (Mokslo sriuba podcast #62, 2019; LRT „Labas rytas, Lietuva“, 2024).
[PATIKSLINTI: ar „aštuoniolikos“ tikslu?]
-->

---
space: { at: germany, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 10, home: 0 }" />

<div class="say top">
<p class="kick">Kryžkelė</p>
<p class="line faded">Australija · lazeriai</p>
<p class="big">Heidelbergas · LHCb</p>
</div>

<!--
5:40 · ~32 s · PERTRAUKA. KRYŽKELĖ.
The world: the trail swings back home (lasers, then a short flick: IT), then out to Heidelberg.

Atrodė, kad kelias rastas. [PATIKSLINTI: ar taip jauteisi?] Bet tada iš dalelių fizikos… išėjau.
[PATIKSLINTI: kodėl – vienas sakinys]
Grįžau į Vilnių, magistrantūroje studijavau lazerių fiziką, dirbau lazerių įmonėje, kelis mėnesius – net IT bendrovėje. Štai ta pertrauka. Siūlo vis tiek nepaleidau: savanoriavau dalelių fizikos užsiėmime moksleiviams. O kai rinkausi doktorantūrą, buvo du keliai: lazerių fizika Australijoje arba LHCb Heidelberge, Vokietijoje. Pasirinkau LHCb. Nes labai norėjau dirbti didelėje komandoje – naujos dalelės vienas tikrai nerasi.

Sources: MSc VU 2017–19 (INSPIRE); the laser company and the months in IT, and the volunteering: the speaker's own account [PATIKSLINTI: vienas užsiėmimas ar keli?]; „Širdyje lietuvis“ 04:36–05:03 and 06:15 [ASR: re-listen] (Australia vs Heidelberg, „nes norėjau labai būtent kolaboracijos“, „Naujos dalelės vienas tikrai nerasi“). Company names not said.
-->

---
space: { at: germany, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 11, home: 0 }" />

<!--
6:12 · ~20 s · MANIAU, KAD ŽINAU (no text; mostly the speaker)
The world: the trail runs on from Heidelberg to Bonn.

Kai pradėjau doktorantūrą, maniau, kad maždaug žinau, kaip viskas bus. Po pusmečio prasidėjo pandemija. Mūsų grupė persikėlė į kitą miestą – iš Heidelbergo į Boną. Paskui – karas Europoje.
[PATIKSLINTI, neprivaloma: sunkiausia akimirka – vienas sakinys]
Kaip vėliau parašiau disertacijoje, normalus gyvenimas nutolo labiau, nei galėjau įsivaizduoti.

Source: PhD thesis (Bonn, 2023), acknowledgements: "I thought I roughly knew how it was going to go … further away from normal than I could have ever imagined"; the pandemic six months in; the group's move Heidelberg → Bonn.
-->

---
space: { at: search, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 0, phantom: 0, route: 11, home: 0 }" />

<div class="say wide top">
<p class="kick">Adata šieno kupetoje</p>
<p class="big">Kupeta – Lietuvos dydžio</p>
</div>

<!--
6:32 · ~55 s · KUPETA (card for ~20 s, then the speaker full-frame)
The world: a wide, faint cloud of grains: the haystack. The needle is somewhere in it, or not.

Dabar papasakosiu, kaip ketveri su puse tų metų baigėsi vienu žodžiu. Mano užduotis buvo patikrinti, ar tie trys pentakvarkai pasirodo ir kitur, kai dalelė subyra kitaip. Tai lyg ieškoti adatos šieno kupetoje. Tik kupeta – visos Lietuvos dydžio. Ir tu net nežinai, kaip ta adata atrodo.
O kaip toks darbas vyksta iš tikrųjų? Ne kaip filmuose. Didžiąją laiko dalį rašai programas, kurios atsijoja šieną, ir kompiuteriu modeliuoji, ką apskritai turėtum pamatyti. [PATIKSLINTI: ar taip ir buvo?] Ir labai daug kalbiesi su žmonėmis. Ten pagarba savaime suprantama: profesorius, penkiasdešimt metų dirbantis fiziku, gali ateiti manęs paklausti apie pentakvarkus. O kaip ieškoti, daugiausia turi sugalvoti pats: vadovėlio su atsakymais gale čia nėra.

Sources: PhD 2019–2023 (INSPIRE; defence 21 Dec 2023, bonndoc); the thesis searched Λb⁰ → Λc⁺ D̄*⁰ K⁻ for the three Pc states; „Širdyje lietuvis“ 07:36 (the haystack), 05:08, 07:01 [ASR: re-listen]; what the daily work is: the speaker's own account.
First cut if long: the automatic-respect sentence (−8 s).
-->

---
space: { at: search, dist: 16, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 0, dance: 1, phantom: 0, route: 11, home: 0 }" />

<!--
7:27 · ~20 s · DŽIAUGSMO ŠOKIS (no text; mostly the speaker)
The world: a thread of light runs into the haystack and a small warm cluster gathers there.

Po maždaug dvejų metų darbo pagaliau galėjau atsidaryti tikrą savo duomenų grafiką. Ir pamačiau… ne tas daleles, kurių ieškojau. Kitas. Tikras daleles, kurios gyvena neįsivaizduojamai trumpai, – o štai jos, mano kompiuterio ekrane. Sušokau džiaugsmo šokį.
[PATIKSLINTI, neprivaloma: kodėl tai taip džiugino – tavo žodžiais]
Ieškai vieno – randi kitą.

Source: „Širdyje lietuvis“ 11:12 [ASR: re-listen] ("po kokių gerų dviejų metų", other extremely short-lived particles, "happy dance").
[PATIKSLINTI: ar tas paveikslas – iš tos pačios pentakvarkų analizės? Kokios tai buvo dalelės?]
-->

---
space: { at: search, dist: 11, yaw: 6, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 0, route: 11, home: 0 }" />

<!--
7:47 · ~6 s · O PENTAKVARKAI? (no text, the world full-frame)
The world: five faint clusters appear in the haystack, the same five as in 2015, drifting toward each other as if to hold, and apart again.

O pentakvarkai? Tie trys, kurių ieškojau?
[pauzė → spausk]
-->

---
space: { at: search, dist: 11, yaw: 6, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 0, route: 11, home: 0 }" />

<div class="say">
<p class="big huge">Neradau.</p>
</div>

<!--
7:53 · ~12 s · NERADAU. ★ (the peak: cut to the face on the word, hold through the silence)

Neradau.
[tyla 4 s]
Čia jų nėra. O jeigu ir yra – tokie reti, kad mūsų duomenyse jų nematyti.
[PATIKSLINTI, neprivaloma: kaip jauteisi tą dieną – vienas sakinys; jei ne, tyla veikia geriau]

Source: PhD thesis abstract: no signal; upper limits at 95 % CL: Pc(4312)⁺ < 0,52 %, Pc(4440)⁺ < 0,65 %, Pc(4457)⁺ < 0,54 %. Word-perfect; do not decorate.
-->

---
space: { at: search, dist: 30, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 0, route: 11, home: 0 }" />

<div class="say">
<p class="big">Blogas rezultatas –<br>irgi rezultatas</p>
</div>

<!--
8:05 · ~30 s · BLOGAS REZULTATAS (card, then the speaker full-frame for „Tau taip bus ne kartą…“)
The world: the camera pulls back until the ghost is small in a wide dark field.

Ar tai nesėkmė? Vienas žmogus moksle gali padaryti labai nedaug. Mes po truputį stumiame žinojimo ribą tolyn. Jei aš kažko neradau, vadinasi, bent jau ieškojau – ir kiti žinos, kad čia ieškota ir nerasta. Blogas rezultatas irgi yra rezultatas. Tau taip bus ne kartą: išbandysi būrelį, praktiką ar studijas ir suprasi – ne čia. Tai ne pralaimėjimas. Tai atsakymas.

Sources: „Širdyje lietuvis“ 09:53 [ASR]; Mokslo sriuba podcast #62, 44:34 [ASR] („blogas rezultatas irgi yra rezultatas“); OECD Policy Brief 16 (2024): active exploration is "good uncertainty".
-->

---
space: { at: search, dist: 30, dim: 0 }
---

<VideoPlayer src="cern_footage_2022_013_006.mp4" muted />

<div class="say on-clip">
<p class="kick">2023 m. gruodžio 20 d.</p>
<p class="big">Beveik petabaitas –<br>visiems</p>
</div>

<div class="src">opendata.cern.ch · M. Šarpis, „LHCb Run I Data is Released“, 2024</div>

<!--
8:35 · ~35 s · DUOMENYS – VISIEMS (the CERN tape robot condenses out of the grains)

Tuo pat metu beveik dvejus metus dirbau dar vieną darbą, kurio iš šono beveik nematyti. Daugiau nei šimtą tūkstančių failų reikėjo nukopijuoti ir kiekvieną patikrinti, kad visi pirmojo LHCb darbo etapo duomenys taptų vieši. Beveik petabaitas – maždaug tiek, kiek ketvirtis milijardo nuotraukų. Juk mokslas yra visos žmonijos, o duomenys – bendras visų turtas. 2023-iųjų gruodžio 20-ąją jie tapo prieinami bet kam pasaulyje. Ir tau. O kitą dieną aš gyniau disertaciją – su atsakymu „neradau“.

Sources: Substack „LHCb Run I Data is Released“ (2024-01-15): close to two years, just under 1 PB, over 100 000 files; VU news (250 000 000 photographs); LRT 8 Jan 2025 („Mokslas yra visos žmonijos…“); CERN Open Data: entire Run 1 public, Dec 2023; PhD defence 21 Dec 2023.
The date: opendata.cern.ch dates the release 20 Dec 2023 (CERN's own news says "end of December 2023").
Clip: CERN-FOOTAGE-2022-013-006 (data centre, tape robot).
-->

---
space: { at: search, dist: 18, yaw: -24, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 11, home: 0 }" />

<!--
9:10 · ~22 s · FANTOMAS (no text; the world full-frame for the streams, then the speaker)
The world: from the five faint clusters, slow arcs of gold run to one point beside them, where a cluster gathers and holds while the ghost keeps failing.

Ir dar. Kad apskritai galėčiau ieškoti, turėjau sugalvoti naują būdą, kaip atkurti dalelę, kurios mūsų „fotoaparatas“ dažnai nepagauna. [PATIKSLINTI: „sugalvoti“ ar „sukurti su komanda“?] Pentakvarkų neradau. Bet tas būdas liko – šiandien jis yra mano naujo projekto pagrindas. O projektas, kaip tyčia, vadinasi PHANTOM. Fantomas. Paieška, kuri baigėsi žodžiu „neradau“, davė įrankį kitai paieškai.

Sources: PhD thesis (Extended Cone Closure reconstructs the particle the detector misses); CORDIS 101244743 (PHANTOM, ERA Fellowship 2025–27, uses that technique). The acronym is spoken, not shown.
-->

---
space: { at: germany, dim: 0.35 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 11, home: 0 }" />

<div class="plans">
<p class="kick">Mano planai · 2022 m. balandis</p>
<img src="/figures/planai-2022.jpg" alt="Ateities planai: Apsiginti PhD (liko 1–1,5 m.); Likti LHCb jeigu pavyks; Remote PostDoc (USA matyt); Gyventi Lietuvoje :O" />
</div>

<div class="src">M. Šarpis, LPPM 2022, indico.cern.ch/event/1128345</div>

<!--
9:32 · ~22 s · PLANAI (his own slide, full-frame; the speaker for „Su nustebusiu veiduku.“)
The world: back over Europe; the path draws itself again, quickly, up to Bonn.

O dabar – mano paties skaidrė iš 2022-ųjų balandžio, kai buvau tos paieškos viduryje. Ateities planai. Apsiginti disertaciją. Likti LHCb, jeigu pavyks. Mokslinis darbas nuotoliu – matyt, JAV. Pusė punktų – su „jeigu“ ir „matyt“. Ir paskutinė eilutė: „Gyventi Lietuvoje“. Su nustebusiu veiduku.

Source: M. Šarpis, LPPM 2022 participants' introductions (11 Apr 2022), MSarpisIntro.pdf p. 16 (public on Indico).
[PATIKSLINTI: ar tinka rodyti seną skaidrę su „:O“, ir ar „su nustebusiu veiduku“ – tai, ką tada turėjai omeny.]
-->

---
space: { at: home13, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 0 }" />

<div class="say">
<p class="num gold"><Count :from="0" :to="13" :ms="1400" /></p>
<p class="line">VU studentų CERN'e šią vasarą</p>
</div>

<div class="src">Vilniaus universitetas, 2026-08-20 ir 2026-09-03</div>

<!--
9:54 · ~36 s · NAMO
The world: the trail arcs home to Vilnius and the cluster there flares again.

Nepraėjo nė dvejų metų – ir aš jau dirbau Vilniuje. Lietuva skyrė milijonus darbui su CERN'u, bet trūko žmonių, kurie CERN'ą pažinotų iš vidaus. Mane pakvietė grįžti, ir Vilniaus universitete nuo nulio atsirado LHCb grupė. [PATIKSLINTI: ar kvietimas buvo būtent kurti grupę?] Kurti grupę? Šito mano plane visai nebuvo. Šiandien jai vadovauju, ir dauguma jos narių – studentai, kai kurie vos keleriais metais vyresni už tave. O šią vasarą CERN'e praktiką atliko trylika Vilniaus universiteto studentų. Tiek VU studentų CERN'e per vieną vasarą dar nebuvo.

Sources: back at VU at the start of 2024 (ff.vu.lt, 2024); the invitation and „milijonus … trūko žmonių“: the speaker's own account; VU, 20 Aug 2026: most of the group are students; "largest number of VU students" at CERN in one summer: 13 (VU, 3 Sep 2026: some are members of LHCb Vilnius, so don't imply all are).
Cuts if long: „Lietuva skyrė milijonus…“ (−7 s). [PATIKSLINTI, neprivaloma: ar įvardyti, kas pakvietė.]
-->

---
space: { at: whole, dim: 0.04 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<!--
10:30 · ~32 s · IŠ TOLI ★ (no text, the world full-frame)
The world: the camera rises until the whole crooked path is one drawing over Europe; from each detour a slow river of light flows home to Vilnius.

Pažiūrėk į šitą kelią iš toli. Egiptologas. Darbas, kuris su fizika neturi nieko bendro. Lazeriai. IT. Pandemija. Iš šono – vingiai ir klaidžiojimai. Bet pažiūrėk, kur jie visi suteka. Valdyti projektus pradėjau mokytis dar verslo mokykloje, o vadovauti žmonėms – ne paskaitose, o toje inventorizacijos įmonėje. Ir kuriant grupę to reikia ne mažiau nei fizikos.
[PATIKSLINTI, neprivaloma: ką davė lazeriai ar IT – vienas sakinys]
Kryptį nujaučiau nuo dvylikos. Kelio – ne.
→ [spausk]

Sources: the speaker's own account (what the business school and the job taught him).
[PATIKSLINTI: ar sutinki su sąsajomis „verslo mokykla → projektai“, „inventorizacija → vadovavimas“?]
-->

---
space: { at: whole, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<div class="say">
<p class="big">Aistros nerandi.<br><em>Ją užsiaugini.</em></p>
</div>

<div class="src">O'Keefe, Dweck ir Walton, Psychological Science, 2018</div>

<!--
11:02 · ~10 s · AISTRA

Aistros nerandi kaip piniginės ant šaligatvio. Ją užsiaugini – bandydamas, klausdamas, kasdamas.
[tyla 3 s]

Source: O'Keefe, Dweck & Walton (2018): believing passion is found rather than developed narrows interest.
-->

---
space: { at: origin, dist: 14, dim: 0.08 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<!--
11:15 · ~37 s · VIS DAR ATVIRA (no text; the world on arrival, then mostly the speaker)
The world: back to the knot from the first minute, alone in the dark.

O mūsų pirmasis klausimas – kodėl liko medžiaga – vis dar atviras. Pernai LHCb rado dar vieną dėlionės gabalėlį: dalelės, giminingos protonams tavo kūne, elgiasi kitaip nei jų antimedžiagos dvyniai. Bet dėlionė dar nesudėta. Šią vasarą greitintuvą išjungė ir dabar jį perstato. Jis turėtų vėl veikti 2030-aisiais, o susidūrimų bus iki dešimties kartų daugiau, nei buvo numatyta iš pradžių. Tada tu galbūt jau studijuosi. O kol jis tyli, tūkstančiai tyrėjų kasinėja jau surinktus duomenis. Ir mūsų grupė Vilniuje – taip pat.

Sources: CERN, 24 Mar 2025: first CP violation in baryons (Λb, 5.2σ); CERN, 29 Jun 2026: LHC switched off for LS3; HL-LHC scheduled for 2030, luminosity up to ten times the original design; "thousands of researchers will continue analysing".
-->

---
space: { at: cosmos, dim: 0.06 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<div class="say late">
<p class="big">Vadovėlio gale<br>atsakymo dar nėra</p>
</div>

<div class="src">NASA: Paukščių Take 100–400 mlrd. žvaigždžių</div>

<!--
11:52 · ~32 s · GALAKTIKA ★ (the world full-frame for the reveal, then the card)
The world: out of the knot, into a turning galaxy.

Ta viena iš milijardo – štai kas iš jos išaugo. Vien mūsų galaktikoje – nuo šimto iki keturių šimtų milijardų žvaigždžių. Atsakymo, kodėl ji liko, dar nėra nė vieno vadovėlio gale. Gal kada nors jį ten įrašys žmogus, kuris šiandien sėdi klasėje ir dar nežino, kuo bus. Štai kaip tavo „kuo būsi?“ susijęs su mano „kodėl?“ Tau nereikia mano klausimo. Tau reikia savo.

Source: NASA (100–400 billion stars in the Milky Way).
-->

---
space: { at: close, dim: 0.1 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<div class="say wide">
<p class="big">Nebūtina žinoti jau dabar.<br><em>Klausimo – nepaleisk.</em></p>
</div>

<!--
12:24 · ~30 s · NEPALEISK (mostly the speaker to the lens)
The world: the camera pulls slowly back until the whole galaxy is in frame.

Aš nežinau, kuo būsi tu. Gal tavo klausimas – apie žvaigždes, apie žmones, apie kodą ar apie muziką. Tau nebūtina jau dabar žinoti, kur jis tave nuves. Bet nepaleisk jo. Bandyk: praktika, savanorystė, savas mažas verslas – kiekvienas bandymas yra eksperimentas. Arba randi, arba sužinai, kad ne čia. Ir klausk žmonių: paaugliai, kurie su kuo nors pasikalbėjo apie darbą, kurį patys norėtų dirbti, rečiau nežino, kuo nori būti.
→ [spausk]

Source: EBPO (OECD) Policy Brief No. 16 (2024), „Teenage career uncertainty“: students who had "talked to someone about the job you would like to do" were career-uncertain 19 % vs 32 % (PISA 2018; correlational, hence „rečiau“ and nothing stronger). The action on the next slide is a different behaviour; the statistic is not offered as proof of it.
-->

---
space: { at: close, dim: 0.12 }
---

<Grains :set="{ bang: 3, pq: 3, needle: 1, dance: 1, phantom: 5, route: 12, home: 6 }" />

<div class="say">
<p class="kick">Šią savaitę paklausk</p>
<p class="big">„Ko jūs savo darbe<br>dar nežinote?“</p>
</div>

<!--
12:54 · ~20 s · ŠIĄ SAVAITĘ (the speaker to the lens; hold 2 s after the last word; no logos, no summary)

Tad štai tau užduotis šiai savaitei. Kai sutiksi žmogų, kurio darbas tau atrodo įdomus, – mokytoją, kaimynę, tėvų draugą, – paklausk jo vieno dalyko: „Ko jūs savo darbe dar nežinote?“
[pauzė]
Ir pažiūrėk, kas gausis.

Word-perfect: the action and the last line.
Total ≈ 13 min (≈ 1 480 spoken words at ~120 words/min plus ~35 s of silences). Cut list to stay under 13:00 (≈ 36 s): the automatic-respect sentence (Kupeta), the AIP sentence (Atrasta), „Lietuva skyrė milijonus…“ (Namo), „Nes mokslas…“ and the photos (Duomenys), the ecology sentence (Egiptologas).
-->
