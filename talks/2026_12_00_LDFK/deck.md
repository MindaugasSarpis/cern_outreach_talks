---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-12-00-ldfk
  fit: contain
title: LHCb Vilnius 2026 m. ataskaita
lang: lt                  # slides and notes; `pnpm talk lint` reads it
sources: notes            # each content slide's sources are in its notes
onscreen: words           # a report read as a PDF too: titles and lists on the slides (the owner, 25 Nov 2026)
htmlAttrs:
  lang: lt
duration: 15min           # the council: up to 10 min, "a little more" for LHCb; 11,2 min spoken and the 2:28 film
exportFilename: LHCb_Vilnius_2026_ataskaita
layout: default
---

<div class="cover-rep">
  <div class="kick">Lietuvos dalelių fizikos konsorciumui</div>
  <div class="t">LHCb Vilnius</div>
  <div class="s">2026 m. ataskaita</div>
  <div class="d">Vilniaus universiteto grupė CERN LHCb eksperimente: pentakvarkų paieškos, analizių išsaugojimas ir atvirieji duomenys, SciFi detektoriaus šviesos įvedimo sistema.</div>
  <div class="w">Dr. Mindaugas Šarpis, LHCb Vilnius vadovas<br>Vilniaus universitetas, Fizikos fakultetas</div>
</div>

<!--
Kalbėtojui. Titulinė skaidrė; joje ir pirmas plano punktas: grupės pavadinimas, vadovas, veiklos kryptis. Ataskaita sudėta pagal šešis konsorciumo plano punktus: grupė ir jos kryptys, organizacinė veikla, dalyvavimas eksperimente, projektai, mokslinė veikla, jaunieji tyrėjai ir studentai. Punkto numeris – virš kiekvienos skaidrės pavadinimo.
[PATIKSLINTI, neprivaloma: posėdžio data; aplanko pavadinime diena pažymėta 00.]
Šaltiniai: nėra, titulinė skaidrė.
(~0,2 min)
-->

---
clicks: 3
---

<div class="kick"><b>1</b>Grupė</div>

# LHCb Vilnius {{ [2024, 2025, 2026, 2027][$clicks] }} m.

<div class="team">
  <HexTeam :year="[2024, 2025, 2026, 2027][$clicks]" :until="2027" :size="112" />
  <div class="team-side">
    <div v-if="$clicks === 0">
      <div class="n">12<small>narių</small></div>
      <ul>
        <li>Grupė įkurta 2024 m. sausį</li>
        <li>Rugsėjo 2 d. VU vienbalsiai priimtas į LHCb kolaboraciją</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 1">
      <div class="n">17<small>narių</small></div>
      <ul>
        <li>Adam: pirmasis užsienio tyrėjas grupėje</li>
        <li>Šarūnas: antrasis doktorantas</li>
        <li>Magistrantai Mikas, Dominykas ir Margarita</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 2">
      <div class="n">13<small>narių</small></div>
      <ul>
        <li>Prisijungia podoktorantė Anni Kauniskangas (daktaro laipsnis – EPFL)</li>
        <li>Sophia ir Mikas apgynė magistro darbus</li>
        <li>Sophia tęsia doktorantūroje Groningeno LHCb grupėje</li>
      </ul>
    </div>
    <div v-else>
      <div class="n">14+<small>narių</small></div>
      <ul>
        <li>Gustė: trečioji doktorantė, nuo 2027&nbsp;m. spalio</li>
        <li>Naujos vietos: ERC paraiškos, doktorantūros konkursas, magistrantai</li>
      </ul>
    </div>
  </div>
</div>

<!-- facts: lhcb-vilnius-joined -->

<!--
Kalbėtojui. Pirmas plano punktas: grupė. Trys paspaudimai: 2024, 2025, 2026 ir 2027 m. Kiekvienu atskrenda tų metų nariai; 2026 m. išvykusieji papilkėja, 2027 m. atsiranda Gustė ir dvi tuščios vietos.
Ministerijos svečiams: LHCb – vienas iš keturių didžiųjų CERN Didžiojo hadronų greitintuvo eksperimentų; VU jo narys nuo 2024 m. rugsėjo.
2024 m. (12): Mindaugas, Ramūnas, Olegas, Augustas, Dainius, Rūta, Sophia, Karolina, Venera, Meda, Eliza, Neilas. 2025 m. prisijungė Adam, Šarūnas, Mikas, Dominykas, Margarita.
2026 m. (13): Mindaugas, Ramūnas, Adam, Olegas, Augustas, Anni, Rūta, Šarūnas, Margarita, Dominykas, Meda, Neilas, Eliza. Sophia ir Mikas šiemet apgynė magistro darbus.
2027 m.: nuo spalio – trečioji doktorantė Gustė; kitos vietos priklauso nuo ERC paraiškų ir doktorantūros konkurso.
[PATIKSLINTI, neprivaloma: ar Dainius, Karolina ir Venera tebėra grupėje; jų nėra 2026 10 14 komandos lentoje, todėl čia jie pažymėti kaip buvę nariai. Taisoma setup/team.ts.]
[PATIKSLINTI, neprivaloma: kada tiksliai pradeda Anni; Gustės pavardė.]
Šaltiniai: 2025 m. ataskaita LDFK (2026 01 06); grupės pasitarimo skaidrės (2026 10 14); ff.vu.lt (2024 09); indico.cern.ch/event/1461467; grupės vadovo žodžiai (2026 11 26).
(~1 min)
-->

---
clicks: 3
---

<div class="kick"><b>1</b>Grupė</div>

# Mokslinės kryptys

<div class="team">
  <HexTeam :year="2026" :until="2027" :size="112" settled :focus="[null, ['mindaugas', 'adam', 'olegas', 'ruta', 'sarunas', 'anni', 'dominykas'], ['mindaugas', 'olegas', 'adam'], ['augustas', 'margarita']][$clicks]" />
  <div class="team-side">
    <div v-if="$clicks === 0">
      <div class="n">3<small>kryptys</small></div>
      <ul>
        <li>Egzotinių hadronų spektroskopija</li>
        <li>Duomenys ir programinė įranga</li>
        <li>Detektoriaus technologijos</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 1">
      <h3>Egzotinių hadronų spektroskopija</h3>
      <p>Pentakvarkų, dalelių iš penkių kvarkų, paieškos LHCb duomenyse.</p>
      <ul>
        <li>ECC metodas prarastoms neutralioms dalelėms atkurti</li>
        <li>Du Run 2 straipsniai, dvi Run 3 analizės</li>
        <li>Teoriniai modeliai su Japonijos partneriais</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 2">
      <h3>Duomenys ir programinė įranga</h3>
      <p>Kaip LHCb analizės atliekamos, išsaugomos ir atveriamos.</p>
      <ul>
        <li>Analizių išsaugojimas ir atvirieji duomenys</li>
        <li>Analizių automatizavimas</li>
        <li>Simuliacijos</li>
      </ul>
    </div>
    <div v-else>
      <h3>Detektoriaus technologijos</h3>
      <p>Darbas su LHCb detektoriaus sistemomis.</p>
      <ul>
        <li>SciFi šviesos įvedimo sistema</li>
        <li>Scintiliacinių skaidulų charakterizavimas</li>
        <li>VELO detektorius</li>
      </ul>
    </div>
  </div>
</div>

<!-- facts: lhcb-vilnius-work, lhcb-vilnius-scifi-lis -->

<!--
Kalbėtojui. Vis dar pirmas punktas: veiklos kryptys. Grupė dirba trimis kryptimis; trys paspaudimai, kiekvienu išryškėja tos krypties žmonės. Pirmoji – fizikos analizė: pentakvarkų paieškos; jos rezultatai – penktame punkte. Antroji – duomenys ir programinė įranga: analizių išsaugojimas, automatizavimas, simuliacijos, atvirieji duomenys. Trečioji – detektorius: SciFi šviesos įvedimo sistema, skaidulų tyrimai, VELO. Antrą ir trečią kryptis išsamiau rodysiu trečiame punkte, kaip grupės indėlį į eksperimentą.
Tos pačios trys kryptys buvo ir 2025 m. ataskaitoje: analizė, programiniai įrankiai, instrumentuotė.
Šaltiniai: vu.lt (2026 04 03); 2025 m. ataskaita LDFK (2026 01 06); grupės pasitarimo skaidrės ir komandos lenta (2026 10 14).
(~0,9 min)
-->

---
class: full
---

<div class="kick"><b>2</b>Organizacinė veikla</div>

# 121-oji LHCb savaitė: pirmą kartą Lietuvoje

<div class="g3 stretch" style="margin-bottom: 0.75em">
  <div class="panel kpi"><div class="n">~200</div><div class="l">fizikų Vilniuje</div></div>
  <div class="panel kpi"><div class="n">~600</div><div class="l">dalyvių su nuotoliniais</div></div>
  <div class="panel kpi"><div class="n">5</div><div class="l">dienos, rugsėjo 14–18</div></div>
</div>

<div class="split stretch">
  <div class="panel">
    <ul>
      <li>Visos LHCb kolaboracijos susitikimas: 1 891 narys, 112 institutų, 28 šalys</li>
      <li>Atidaryme – Prezidento ir VU rektoriaus sveikinimai, diskusija su CERN tyrimų direktoriumi, LHCb vadovu, ŠMSM ir EIMIN atstovais</li>
      <li>„Collaboration Board“ posėdis VU Auloje, 21 stendinis pranešimas</li>
      <li>Kultūrinė programa „Threads of Lithuania“</li>
    </ul>
  </div>
  <div>
    <img class="ph" src="/figures/lw_hall.jpg" alt="Pilna salė LHCb savaitės atidaryme" style="aspect-ratio: 3 / 2">
    <div class="cap">Atidarymas VU Gyvybės mokslų centre, rugsėjo 14 d.</div>
  </div>
</div>

<!-- facts: lhcb-week-vilnius, lhcb-week-vilnius-attendance-sources, lhcb-collaboration-sep-2026 -->

<!--
Kalbėtojui. Antras punktas: bendradarbiavimo su CERN dariniais plėtra. Svarbiausias metų įvykis – LHCb savaitė: eilinis visos kolaboracijos susitikimas, kuris kartą per metus vyksta ne CERN. Vilniaus paraiška pateikta 2024 m. lapkritį, praėjus dviem mėnesiams po priėmimo į LHCb.
Atidaryme: Prezidento sveikinimas (vaizdo įrašu), rektoriaus kalba, diskusija „Lithuania's AI Factory: Connecting Science, Industry and Global Research Infrastructures“ (moderatorė prof. S. Mačiukaitė-Žvinienė; G. Hamel de Monchenault, CERN; T. Gershon, LHCb; prof. P. Treigys; viceministrė R. Valutytė; B. Girdvainis, EIMIN).
Dalyvių skaičiai – prognozės ir nesutampa: VU pranešime apie 200 gyvai ir apie 600 iš viso, grupės puslapyje 300 gyvai ir 300 nuotoliu. [PATIKSLINTI: galutinis dalyvių skaičius iš Indico registracijos.]
[PATIKSLINTI, neprivaloma: stendinių pranešimų skaičius (21) paimtas iš registracijos sąrašo.]
Šaltiniai: lrt.lt/naujienos/mokslas-ir-it/11/3052140; vu.lt (2026 09 08 ir 09 14); indico.cern.ch/event/1696594; T. Gershon ataskaita CERN SPC (2026 09 22); LHCb savaitės atidarymo programa (2026 09).
Vaizdas: kadras iš LHCb savaitės filmo (Nebula Moments).
(~0,8 min)
-->

---
bare: true
class: p-0
---

<VideoPlayer src="lhcb_week_aftermovie.mp4" />

<!--
Kalbėtojui. Visas LHCb savaitės Vilniuje filmas su savo muzika, 2:28. Filmas prasideda skaidrei atsivėrus ir pasibaigęs laukia paspaudimo. Per filmą nekalbėti. Jei laiko mažai, skaidrę galima praleisti paspaudimu.
Filme: 0:16 Saulėtekio miestelis iš oro, 0:25 pilna salė atidaryme, 0:26 Prezidento sveikinimas, 0:30 atidarymo diskusija, 0:55 priėmimas Universiteto kieme, 1:15 ugnies šou, 1:27 vakarienė.
PDF versijoje vietoj filmo – jo kadras.
Vaizdas: LHCb savaitės filmas, Nebula Moments (Rimantas Unkevičius).
(~0,1 min)
-->

---

<div class="kick"><b>2</b>Organizacinė veikla</div>

# LHCb savaitė: partneriai ir žiniasklaida

<div class="g2 stretch">
  <div class="stack">
    <div class="panel">
      <h3>Globėjas</h3>
      <p>Lietuvos Respublikos Prezidentas Gitanas Nausėda</p>
    </div>
    <div class="panel">
      <h3>Organizatoriai ir partneriai</h3>
      <p>Vilniaus universitetas · Švietimo, mokslo ir sporto ministerija</p>
      <p>Lietuvos mokslo taryba · „Go Vilnius“ · Lietuvos dalelių fizikos konsorciumas</p>
    </div>
    <div class="panel">
      <h3>Rėmėjai</h3>
      <span class="tag">Light Conversion</span><span class="tag">EKSPLA</span><span class="tag">Standa</span><span class="tag">Brolis</span><span class="tag">Akoneer</span><span class="tag">Mono Spektra</span><span class="tag">Direct Machining Control</span><span class="tag">Humbility</span><span class="tag">Klaipėdos LEZ</span><span class="tag">Konica Minolta</span><span class="tag">Scienced</span>
    </div>
  </div>
  <div class="stack" style="grid-template-rows: auto 1fr">
    <div class="panel">
      <div class="kpi"><div class="n">37<small>publikacijos ir laidos per dvi savaites</small></div></div>
      <div style="margin-top: 0.45rem">
        <span class="tag">LRT „Panorama“</span><span class="tag">LRT „Labas rytas“</span><span class="tag">LRT English</span><span class="tag">„Delfi diena“</span><span class="tag">15min</span><span class="tag">Lrytas</span><span class="tag">TV3</span><span class="tag">BNS</span>
      </div>
    </div>
    <div class="panel">
      <ul>
        <li>„Vilniuje – didžiausias dalelių fizikų susitikimas Lietuvos istorijoje“ (LRT)</li>
        <li>„Lithuania seeks full CERN membership as Vilnius hosts particle physics community“ (LRT English)</li>
        <li>CERN troleibusas Vilniaus gatvėse, ekranai ir stendas oro uoste</li>
      </ul>
    </div>
  </div>
</div>

<!--
Kalbėtojui. Padėka ministerijai ir konsorciumui: ŠMSM kartu su VU buvo savaitės organizatorė, LDFK – partneris. Rėmėjai – daugiausia Lietuvos lazerių ir fotonikos įmonės.
Žiniasklaida: 37 įrašai apie LHCb savaitę rugsėjo 8–20 d. devyniolikoje kanalų, tarp jų trys LRT televizijos laidos, „Delfi diena“, TV3 ir BNS.
[PATIKSLINTI: rėmėjų sąrašas ir jų lygiai; logotipų tinklelyje dar buvo vienas logotipas, kurio neperskaičiau („VVT“?).]
[PATIKSLINTI, neprivaloma: pasiektos auditorijos skaičiai; pasiekiamumo ataskaitos (VU komunikacijos ar agentūros) neradau.]
Šaltiniai: LHCb savaitės logotipų tinklelis (2026 08 25); Fizikos fakulteto žiniasklaidos suvestinė (2026 10 28); lrt.lt/naujienos/mokslas-ir-it/11/3052140; lrt.lt/en (2026 09 20); LHCb savaitės viešinimo planas.
(~0,6 min)
-->

---
class: airy
---

<div class="kick"><b>2</b>Organizacinė veikla</div>

# Lietuva ir CERN 2026 m.

<div class="split stretch">
  <div class="panel">
    <div class="tl">
      <div class="d">01 19</div><div>Prezidentas lankosi CERN ir susitinka su Lietuvos bendruomene</div>
      <div class="d">08 01</div><div><strong>Mindaugas Šarpis – LHCb analizių išsaugojimo ir atvirųjų duomenų koordinatorius</strong></div>
      <div class="d">08 21</div><div>Ministras Pirmininkas nusprendžia oficialiai kreiptis dėl visateisės narystės CERN</div>
      <div class="d">09 04</div><div>Lietuvos nuolatinis atstovas Ženevoje lankosi CERN dėl narystės</div>
      <div class="d">09 14–18</div><div><strong>LHCb savaitė Vilniuje</strong></div>
      <div class="d">10 19</div><div>CERN Tarybos prezidentas Costas Fountas lankosi Lietuvoje ir susitinka su LHCb Vilnius bendruomene</div>
    </div>
  </div>
  <div class="stack" style="grid-template-rows: auto 1fr">
    <div class="panel">
      <div class="quote">„The membership procedure has already started.“</div>
      <div class="cap">Gautier Hamel de Monchenault, CERN tyrimų ir skaičiavimų direktorius, LRT, 2026 m. rugsėjo 20 d.</div>
    </div>
    <div class="panel" style="display: grid; align-content: space-between">
      <h3>Lietuvos dalyviai CERN eksperimentuose</h3>
      <div class="g3" style="margin: 0.4rem 0">
        <div class="kpi"><div class="n">35</div><div class="l">CMS</div></div>
        <div class="kpi"><div class="n">15</div><div class="l">LHCb</div></div>
        <div class="kpi"><div class="n">11</div><div class="l">DRD3</div></div>
      </div>
      <div class="cap">CERN „Grey Book“, 2026 m. spalio 7 d.</div>
    </div>
  </div>
</div>

<!-- facts: lt-nauseda-visit, lhcb-open-data-coordinator-2026, lt-full-decision, lt-member-interest-cern-visit-2026-09, lhcb-lithuania-membership, lt-greybook-participation -->

<!--
Kalbėtojui. Metų įvykiai tarp Lietuvos ir CERN. Nuo rugpjūčio 1 d. grupės vadovas koordinuoja visos LHCb kolaboracijos analizių išsaugojimą ir atviruosius duomenis. LHCb savaitė sutapo su valstybės sprendimu siekti visateisės narystės: Premjero sprendimas – rugpjūčio 21 d., laiškas CERN vadovybei paskelbtas rugpjūčio 26 d. CERN atstovas Vilniuje patvirtino, kad procedūra jau prasidėjo. Spalį Lietuvoje lankėsi CERN Tarybos prezidentas C. Fountas; su juo ir CERN direktore U. Bassler susitiko ir mūsų grupė.
[PATIKSLINTI, neprivaloma: vizito datos ir ar U. Bassler lankėsi kartu; žiniasklaidoje minimas tik C. Fountas, spalio 19 d.]
Šaltiniai: home.cern/presidential-visits-cern-0; vu.lt (2026 07 30); lrv.lt (2026 08 26); cds.cern.ch CERN-PHOTO-202609-233; lrt.lt/en (2026 09 20); delfi.lt ir lrt.lt (2026 10 19); greybook.cern.ch (2026 10 07).
(~0,7 min)
-->

---
class: snug
---

<div class="kick"><b>3</b>Dalyvavimas <span class="nc">LHCb</span> eksperimente</div>

# SciFi detektoriaus šviesos įvedimo sistema

<div class="split-wide stretch">
  <div class="stack">
    <div class="g3 stretch">
      <div class="panel kpi long"><div class="n">11 000 km</div><div class="l">scintiliacinių skaidulų</div></div>
      <div class="panel kpi long"><div class="n">524 288</div><div class="l">šviesos jutiklių kanalai</div></div>
      <div class="panel kpi long"><div class="n">670 nm</div><div class="l">kalibravimo lazerių bangos ilgis</div></div>
    </div>
    <div class="panel">
      <h3>Kas tai</h3>
      <ul>
        <li>SciFi – LHCb pėdsakų detektorius už magneto: 12 sluoksnių, maždaug 6 × 5 m</li>
        <li>Šviesos įvedimo sistema (LIS) siunčia į skaidulas trumpus lazerio impulsus; pagal juos kalibruojamas kiekvienas kanalas</li>
      </ul>
    </div>
    <div class="panel">
      <h3>Ką daro Vilnius</h3>
      <div class="who">Augustas</div>
      <ul>
        <li>LIS priežiūra ir tobulinimas: grupės bendrasis darbas LHCb kolaboracijai</li>
        <li>Apšvitintos SciFi skaidulos nuo 2026 m. sausio tiriamos Vilniuje</li>
        <li><span class="todo">[PATIKSLINTI: 2026 m. LIS darbai ir rezultatai]</span></li>
      </ul>
    </div>
  </div>
  <div>
    <img class="ph" src="/figures/scifi.jpg" alt="SciFi detektoriaus rėmas su skaidulų moduliais leidžiamas į LHCb šachtą" style="aspect-ratio: 5 / 6; object-position: right center">
    <div class="cap">SciFi rėmas leidžiamas į LHCb šachtą, 2021 m.</div>
  </div>
</div>

<!-- facts: lhcb-scifi, lhcb-scifi-channels, lhcb-scifi-layout, lhcb-scifi-lis, lhcb-scifi-lis-vcsel, lhcb-vilnius-scifi-lis -->

<!--
Kalbėtojui. Trečias punktas: tiesioginis dalyvavimas eksperimento darbe ir atnaujinime. Grupės techninis indėlis – SciFi, scintiliacinių skaidulų pėdsakų detektoriaus, šviesos įvedimo sistema. Detektoriuje – daugiau kaip 11 000 km plonų skaidulų; dalelei pralėkus jos sužimba, o šviesą renka apie pusė milijono silicio fotodaugintuvų kanalų. Kad kiekvieno kanalo signalą būtų galima patikimai skaityti, į skaidulas siunčiami trumpi 670 nm lazerio impulsai, po vieną–penkis fotonus kanalui; pagal juos nustatomi kanalų slenksčiai. Šią sistemą prižiūri ir tobulina Augustas.
Antras darbas – skaidulų senėjimas: apšvitintos SciFi skaidulos sausį atvežtos į Vilnių ir čia charakterizuojamos.
[PATIKSLINTI: kas 2026 m. padaryta su LIS (matavimai, įrangos ar programinės įrangos pakeitimai, pranešimai SciFi posėdžiuose) ir kas numatyta toliau; skaidulų tyrimų rezultatai. Viešai patvirtinta tik tai, kad SciFi ir LIS yra grupės bendrasis darbas (2024 10 03 darbotvarkė).]
Šaltiniai: LHCb „Upgrade I“ straipsnis, JINST 19 (2024) P05065, arXiv:2305.10515; L. Berninghoff, Heidelbergo universiteto disertacija (2022); indico.cern.ch/event/1461467; grupės pasitarimo skaidrės (2026 01 13); 2025 m. ataskaita LDFK (2026 01 06).
Vaizdas: CERN nuotrauka CERN-PHOTO-202105-062-12.
(~1 min)
-->

---

<div class="kick"><b>3</b>Dalyvavimas <span class="nc">LHCb</span> eksperimente</div>

# Duomenys, programinė įranga ir eksperimento darbas

<div class="g3 stretch">
  <div class="panel">
    <h3>Analizių išsaugojimas ir atvirieji duomenys</h3>
    <div class="who">Mindaugas</div>
    <ul>
      <li>Iš Vilniaus koordinuojamas visos kolaboracijos analizių išsaugojimas ir duomenų atvėrimas</li>
      <li>Vadovavo LHCb Run 1 duomenų atvėrimui</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Programinė įranga (DPA projektas)</h3>
    <ul>
      <li><strong>Olegas</strong>: darbas su failų suvestinėmis (FSR) įtrauktas į LHCb programinę įrangą</li>
      <li><strong>Adam</strong>: simuliacijos ir analizių atkuriamumas</li>
      <li>Analizių darbo eigos įrankiai („Snakemake“, analizių produkcijos)</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Eksperimento darbas</h3>
    <ul>
      <li><strong>Rūta</strong>: budėjimai LHCb valdymo centre</li>
      <li><strong>Margarita</strong>: VELO detektoriaus kūrimas CERN</li>
      <li><strong>Neilas</strong>: LHCb meistriškumo pamokos programos atnaujinimas</li>
      <li>Kolaboracijos straipsnių vidinis recenzavimas</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.75em">
  <strong>Atvirieji duomenys naudojami.</strong> 2026 m. rugsėjį Brauno universiteto grupė paskelbė darbą, patikrintą su atvirais LHCb 2017 m. susidūrimų duomenimis.
</div>

<!-- facts: lhcb-open-data-coordinator-2026, lhcb-opendata-brown-2026 -->

<!--
Kalbėtojui. Kiti grupės darbai eksperimentui. Pirma, duomenų apdorojimas ir analizė (DPA projektas): analizių išsaugojimas reiškia, kad paskelbtą rezultatą po daugelio metų galima pakartoti iš tų pačių duomenų ir programų; atvirieji duomenys – kad LHCb duomenis gali naudoti ir ne kolaboracijos nariai. Brauno universiteto darbas rodo, kad atverti duomenys jau naudojami. Olegas vasarį pristatė grupės darbus DPA ir RTA posėdyje; jo FSR („File Summary Record“) darbas įtrauktas į bendrą programinę įrangą. Antra, eksperimento priežiūra: budėjimai valdymo centre, VELO, vidinis straipsnių recenzavimas.
[PATIKSLINTI: tikslūs paslaugų darbų pavadinimai ir būklė (VELO); kiek budėjimų atliko grupė 2026 m.]
Šaltiniai: vu.lt (2026 07 30); indico.cern.ch/event/1635603; grupės pasitarimų skaidrės (2026 01 13, 2026 02 03, 2026 02 17, 2026 10 14); DPA ataskaita LHCb savaitėje (2026 09); arxiv.org/abs/2609.09275.
(~0,8 min)
-->

---
class: snug
---

<div class="kick"><b>4</b>Projektinė veikla</div>

# Lietuvos ir Japonijos projektas „Penta-Charm“

<div class="g2 stretch">
  <div class="panel">
    <h3>Projektas</h3>
    <ul>
      <li>LMT ir JSPS dvišalė programa, 2026 04 – 2028 03</li>
      <li>Analizė Vilniuje, teoriniai modeliai Japonijoje (Nagoja, RIKEN, „HAL QCD“)</li>
      <li>Tikslas: nustatyti <Tex v="P_c" /> pentakvarkų sandarą</li>
      <li>Iš Vilniaus: Mindaugas, Adam, Olegas, Rūta, Šarūnas ir magistrantai</li>
      <li>Kitas bendras darbo seminaras: 2027&nbsp;m. spalį</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Lietuvos ambasada Tokijuje, lapkričio 18 d.</h3>
    <ul>
      <li>Ambasadoriaus sveikinimas</li>
      <li>Projekto vadovų M. Šarpio ir Y. Yamaguchi pranešimai</li>
      <li>RIKEN tyrėjų pranešimai</li>
      <li>Klausytojai: abiejų šalių mokslininkai, ambasados svečiai</li>
    </ul>
  </div>
</div>

<div class="g2" style="margin-top: 0.75em">
  <div>
    <img class="ph" src="/figures/nagoya_workshop.jpg" alt="Nagojos darbo seminaro dalyviai" style="aspect-ratio: 5 / 2">
    <div class="cap">Seminaras „Exotic Hadrons“, Nagoja, lapkričio 24–27 d.</div>
  </div>
  <div>
    <div class="ph slot"><span class="todo">[PATIKSLINTI: renginio ambasadoje nuotrauka]</span></div>
    <div class="cap">Projekto pristatymas ambasadoje</div>
  </div>
</div>

<!--
Kalbėtojui. Ketvirtas punktas: projektai. Šiemet prasidėjo dvišalis projektas su Japonijos teoretikais; jo vadovas Japonijoje – Yasuhiro Yamaguchi iš Nagojos universiteto. Mes teikiame LHCb matavimus, jie – sąveikų modelius (Nagojos universitetas, RIKEN, „HAL QCD“ kolaboracija); kartu tikrinama, kaip sudaryti pentakvarkai.
Lapkritį projektas du kartus pristatytas Japonijoje. Lapkričio 18 d. – Lietuvos ambasadoje Tokijuje: po ambasadoriaus sveikinimo kalbėjo abu projekto vadovai, po 15 minučių, paskui RIKEN tyrėjai; klausėsi Japonijos ir Lietuvos mokslininkai iš Nagojos, Tokijo ir RIKEN bei ambasados svečiai. Lapkričio 24–27 d. Nagojoje vyko bendras darbo seminaras. Kitas darbo seminaras su Japonijos kolegomis numatytas spalį.
[PATIKSLINTI: renginio ambasadoje nuotrauka (įdėti į public/figures/embassy.jpg); tikslus renginio pavadinimas, dalyvių skaičius ir kas dar kalbėjo. Viešo pranešimo apie renginį neradau; čia – pagal Tokijo pranešimo programą.]
[PATIKSLINTI, neprivaloma: kito darbo seminaro vieta ir tikslios datos; skaidrėje – 2027 m. spalis, grupės vadovo žodžiais („will be held in October“, 2026 11 26).]
[PATIKSLINTI, neprivaloma: projekto pradžia – pasitarimo skaidrėse gegužės 1 d., Tokijo pranešime 2026 m. balandis – 2028 m. kovas; kiek grupės narių vyko į Japoniją.]
Šaltiniai: grupės pasitarimo skaidrės (2026 04 14); pranešimas Lietuvos ambasadoje Tokijuje ir renginio programa (2026 11 18); indico.rcnp.osaka-u.ac.jp/event/2981.
Vaizdas: darbo seminaro dalyvių nuotrauka (organizatorių).
(~0,7 min)
-->

---

<div class="kick"><b>4</b>Projektinė veikla</div>

# Projektai ir pritrauktos lėšos

<div class="panel">
  <table class="money">
    <tr><th>Šaltinis</th><th>Kam</th><th>Suma, tūkst. EUR</th><th>Laikotarpis</th></tr>
    <tr><td>Europos Komisija, „Horizon Europe“</td><td>PHANTOM</td><td class="n">197</td><td>2025 08 – 2027 07</td></tr>
    <tr><td>LMT ir JSPS</td><td>„Penta-Charm“</td><td class="n">100</td><td>2026 04 – 2028 03</td></tr>
    <tr><td>ŠMSM</td><td>LHCb savaitė</td><td class="n">100</td><td>2026</td></tr>
    <tr><td>„Go Vilnius“</td><td>LHCb savaitė</td><td class="n">20</td><td>2026</td></tr>
    <tr><td>Rėmėjai ir dalyvio mokesčiai</td><td>LHCb savaitė</td><td class="n"><span class="todo">[PATIKSLINTI]</span></td><td>2026</td></tr>
    <tr><td>VU edukacinių iniciatyvų lėšos</td><td>Dalyko atnaujinimas</td><td class="n"><span class="todo">[PATIKSLINTI]</span></td><td>2025 10 – 2026 10</td></tr>
    <tr class="sum"><td colspan="2">Iš viso be nepatikslintų eilučių</td><td class="n">417</td><td></td></tr>
  </table>
</div>

<div class="g3 stretch" style="margin-top: 0.75em">
  <div class="panel">
    <h3>LDFK lėšos grupei, 2026 m.</h3>
    <p><span class="todo">[PATIKSLINTI: skirta ir panaudota suma]</span></p>
  </div>
  <div class="panel">
    <h3>LHCb savaitės biudžetas</h3>
    <p><span class="todo">[PATIKSLINTI: bendra suma]</span></p>
  </div>
  <div class="panel">
    <h3>Pateiktos paraiškos</h3>
    <p>Dvi ERC paraiškos, iš viso 4&nbsp;mln.&nbsp;EUR</p>
  </div>
</div>

<!--
Kalbėtojui. Visos lėšos vienoje skaidrėje: kas pritraukta, ką grupė gavo iš konsorciumo ir kas pateikta. PHANTOM – Europos Komisijos finansuojamas projektas, tęsiasi iki 2027 m. liepos; Japonijos projektas prasidėjo šiemet; LHCb savaitę finansavo ministerija, „Go Vilnius“, rėmėjai ir dalyviai. Šiemet pateiktos dvi ERC paraiškos.
417 tūkst. EUR – keturių eilučių su žinomomis sumomis suma (197 + 100 + 100 + 20); PHANTOM ir „Penta-Charm“ sumos skirtos visam projekto laikotarpiui, ne vieniems metams.
[PATIKSLINTI: PHANTOM suma (197 tūkst. EUR) paimta iš dotacijos sutarties; ar rodyti ją viešai.]
[PATIKSLINTI: LDFK 2026 m. lėšos grupei; LHCb savaitės galutinis biudžetas, rėmėjų ir dalyvio mokesčių sumos (galutinė sąmata – privačiame apraše); VU edukacinės iniciatyvos suma; ERC paraiškų tipai ir sprendimų datos.]
Šaltiniai: PHANTOM dotacijos sutartis (projektas 101244743); grupės pasitarimų skaidrės (2026 01 13, 2026 04 14, 2026 10 14); pranešimas Lietuvos ambasadoje Tokijuje (2026 11 18); VU edukacinės iniciatyvos ataskaita (2026 10 28).
(~0,6 min)
-->

---

<div class="kick"><b>5</b>Mokslinė veikla</div>

# Pentakvarkų paieškos <em>open charm</em> kanaluose

<div class="panel" style="margin-bottom: 0.75em">
  <p>LHCb pentakvarkus atrado 2015 m. Ar <Tex v="P_c" /> pentakvarkai yra kompaktiški penkių kvarkų dariniai, ar bariono ir mezono molekulės? <em>Open charm</em> kanalai <Tex v="\Lambda_c^+ \bar{D}^{(*)0}" /> ir <Tex v="\Sigma_c^+ \bar{D}^{0}" /> leidžia šias hipotezes atskirti.</p>
</div>

<div class="g3 stretch">
  <div class="panel">
    <h3>ECC metodo straipsnis</h3>
    <div class="who">Mindaugas, Adam, Rūta</div>
    <ul>
      <li>Prarastos neutralios dalelės <span style="white-space: nowrap">(<Tex v="\pi^0" />, <Tex v="\gamma" />)</span> judesio kiekio atkūrimas</li>
      <li>Baigiamas iki gruodžio</li>
      <li>Taikomas Run&nbsp;2 ir Run&nbsp;3 analizėse</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Run 2: du straipsniai</h3>
    <div class="who">Mindaugas, Olegas, Adam</div>
    <ul>
      <li><Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" /></li>
      <li>I: kuo greičiau, prašo LHCb fizikos koordinatorius</li>
      <li>II: 2027 m. pradžioje</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Run 3: dvi analizės</h3>
    <div class="who">Rūta, Šarūnas</div>
    <ul>
      <li><Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" /> ir <Tex v="\Lambda_b^0 \to \Sigma_c^+ \bar{D}^{0} K^-" /></li>
      <li>2024 m. duomenys paruošti, atranka vyksta</li>
      <li>Pirmieji rezultatai: metų pabaigoje</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.75em">
  <strong>Naujos temos.</strong> Kanalai su dviem prarastomis neutraliomis dalelėmis · linijų formų modeliai su Japonijos teoretikais · pentakvarkų femtoskopija
</div>

<!-- facts: lhcb-pentaquark-2015 -->

<!--
Kalbėtojui. Penktas punktas: mokslinė veikla; pirmoji kryptis išsamiau. Pentakvarkas – dalelė iš penkių kvarkų; LHCb pirmuosius atrado 2015 m., bet iki šiol neaišku, kaip jie sudaryti. Mes jų ieškome „open charm“ kanaluose: skilimuose į du hadronus, kurių kiekvienas turi po žavųjį kvarką. Juose prarandama minkšta neutrali dalelė, π0 arba γ. Tam sukurtas ECC („Extended Cone Closure“) metodas; jo straipsnis baigiamas iki gruodžio. Run 2 analizė virsta dviem straipsniais; pirmojo prašo LHCb fizikos koordinatorius. Run 3 analizes atlieka doktorantai.
[PATIKSLINTI: straipsnių būklė pranešimo dieną (ECC – pateiktas ar ne; Run 2 I – kolaboracijos peržiūros etapas).]
Šaltiniai: grupės pasitarimo skaidrės (2026 10 14); pranešimas Nagojos darbo seminare (2026 11 25); lhcb-outreach.web.cern.ch (2015 07 14).
(~1 min)
-->

---
class: full
---

<div class="kick"><b>5</b>Mokslinė veikla</div>

# Straipsniai ir pranešimai

<div class="split stretch">
  <div class="panel ref">
    <h3>Paskelbta 2026 m.</h3>
    <p><span class="ttl">„Monte Carlo simulation for the LHC experiments at CERN: A comprehensive overview“</span></p>
    <p>„Physics Open“ 29 (2026) 100478 · M. Rapševičiūtė, A. Šilalė, M. Šarpis, V. Rapševičius</p>
    <p class="muted">Apžvalga, kaip keturi LHC eksperimentai simuliuoja duomenis. Straipsnis parodytas „Veritasium“ vaizdo įraše apie atsitiktinumą.</p>
  </div>
  <div>
    <img class="ph" src="/figures/veritasium.jpg" alt="Straipsnio pirmas puslapis „Veritasium“ vaizdo įraše" style="aspect-ratio: 1600 / 818; object-position: left top">
    <div class="cap">„Veritasium“: „Randomness is a lie. Let me explain“, 2026 m. lapkritis; 4,4 mln. peržiūrų per savaitę</div>
  </div>
</div>

<div class="panel" style="margin-top: 0.75em">
  <div class="tl">
    <div class="d">pavasaris</div><div><strong>„Open Readings 2026“, Vilnius</strong> · Meda, Neilas, Šarūnas</div>
    <div class="d">05 mėn.</div><div><strong>CHEP 2026, Bankokas</strong> · Mindaugas: „Towards fully reproducible physics analyses“</div>
    <div class="d">09 15</div><div><strong>LHCb savaitė, Vilnius</strong> · Mindaugas: „Pentaquarks at LHCb“</div>
    <div class="d">11 18</div><div><strong>Projekto „Penta-Charm“ pristatymas, Lietuvos ambasada Tokijuje</strong> · Mindaugas</div>
    <div class="d">11 25</div><div><strong>„Exotic Hadrons“, Nagoja</strong> · Mindaugas: „Overview of pentaquark results in LHCb and future prospects“; Šarūnas</div>
  </div>
</div>

<!-- facts: physics-open-mc-overview-2026 -->

<!--
Kalbėtojui. Rezultatai ir jų viešinimas. Šiemet žurnale „Physics Open“ paskelbta apžvalga apie Monte Karlo simuliacijas LHC eksperimentuose, parašyta kartu su Matematikos ir informatikos fakulteto kolegomis M. Rapševičiūte, A. Šilale ir V. Rapševičiumi. Lapkritį jos pirmas puslapis parodytas „Veritasium“ vaizdo įraše apie atsitiktinumą „Randomness is a lie. Let me explain“; tai vienas didžiausių mokslo populiarinimo kanalų „YouTube“, 21,5 mln. prenumeratorių, įrašas per savaitę peržiūrėtas 4,4 mln. kartų. Trys LHCb straipsniai rengiami, apie juos – ankstesnėje skaidrėje.
Pranešimai: du kviestiniai tarptautiniai – CHEP 2026 Bankoke ir Nagojos darbo seminaras, kuriame Mindaugas kalbėjo LHCb vardu ir buvo mokslinio komiteto narys. Vasarį Olegas pristatė grupės darbus DPA ir RTA posėdyje CERN.
[PATIKSLINTI, neprivaloma: sąrašas sudarytas iš pasitarimų skaidrių ir pranešimų archyvo; trūksta vasaros (birželio–rugsėjo) pranešimų, „Confinement 2026“ ir studentų pranešimų pavadinimų.]
Šaltiniai: doi.org/10.1016/j.physo.2026.100478; „Veritasium“, „Randomness is a lie. Let me explain“ („YouTube“, ekrano nuotrauka 2026 11 26: 4,4 mln. peržiūrų, „prieš 7 d.“); indico.cern.ch/event/1635603; indico.rcnp.osaka-u.ac.jp/event/2981; grupės pasitarimų skaidrės (2026 05 05, 2026 10 14).
Vaizdas: kadras iš „Veritasium“ vaizdo įrašo (grupės vadovo ekrano nuotrauka).
(~0,7 min)
-->

---

<div class="kick"><b>5</b>Mokslinė veikla</div>

# Sklaida

<div class="g2 stretch">
  <div class="stack">
    <div class="panel">
      <h3>Mokykloms</h3>
      <ul>
        <li>Antroji LHCb meistriškumo pamoka, vasario 26 d.; ją rengė studentai</li>
        <li>„Užsikrauk karjerai“: tiesioginė transliacija 9–12 klasėms („Delfi“, „Junior Achievement“)</li>
        <li>33 Kauno mokyklų vadovų vizitas CERN</li>
        <li>„Physics in Advent“</li>
      </ul>
    </div>
    <div class="panel">
      <h3>Visuomenei ir verslui</h3>
      <ul>
        <li>„Innoday 2026“: CERN technologijos ir Lietuvos įmonės</li>
        <li>Viešos paskaitos: Skeptikų draugija, „EditAI“, „Yaga“, „World of Particles“</li>
        <li>„Mokslo sriuba“: nauja dalelė LHCb</li>
        <li>Tinklalaidė „Prie knygų“ (Augustas)</li>
      </ul>
    </div>
  </div>
  <div class="stack">
    <div class="panel">
      <h3>Grupė ir LHCb žiniasklaidoje, 2026 m.</h3>
      <div class="bars" style="height: 14.5rem">
        <div class="bar"><b>0</b><i style="height: 0%"></i><span>01</span></div>
        <div class="bar"><b>6</b><i style="height: 16%"></i><span>02</span></div>
        <div class="bar"><b>1</b><i style="height: 3%"></i><span>03</span></div>
        <div class="bar"><b>9</b><i style="height: 24%"></i><span>04</span></div>
        <div class="bar"><b>1</b><i style="height: 3%"></i><span>05</span></div>
        <div class="bar"><b>0</b><i style="height: 0%"></i><span>06</span></div>
        <div class="bar"><b>6</b><i style="height: 16%"></i><span>07</span></div>
        <div class="bar"><b>0</b><i style="height: 0%"></i><span>08</span></div>
        <div class="bar"><b>37</b><i style="height: 100%"></i><span>09</span></div>
        <div class="bar"><b>11</b><i style="height: 30%"></i><span>10</span></div>
      </div>
      <div class="cap">71 įrašas sausio–spalio mėn.; rugsėjį – LHCb savaitė</div>
    </div>
    <div class="panel">
      <h3>Pripažinimas</h3>
      <p>Nominacija LRT apdovanojimams <span class="todo">[PATIKSLINTI: apdovanojimas ir kategorija]</span></p>
    </div>
  </div>
</div>

<!-- facts: lhcb-masterclass-vilnius-2026 -->

<!--
Kalbėtojui. Visa sklaida vienoje skaidrėje. Mokykloms – antroji LHCb meistriškumo pamoka ir „Užsikrauk karjerai“ transliacija. Verslui – „Innoday 2026“. Žiniasklaidoje per dešimt mėnesių – 71 įrašas: vasarį – Rūtos Racz interviu, balandį – Adamo ir Mindaugo komentarai apie naują dalelę, liepą – LHCb koordinatoriaus pareigos, rugsėjį – LHCb savaitė, spalį – „Innoday“ ir CERN Tarybos prezidento vizitas. Metų pabaigoje – nominacija LRT apdovanojimams.
[PATIKSLINTI: kokiam LRT apdovanojimui ir kurioje kategorijoje nominuota ir kas nominuotas (grupė, LHCb savaitė ar vadovas). LRT metų apdovanojimų balsavimas paskelbtas lapkričio 25 d. ir vyksta iki gruodžio 9 d., apdovanojimai – 2027 m. sausio 9 d.; nominantų pavardžių LRT puslapio tekste neradau.]
[PATIKSLINTI, neprivaloma: meistriškumo pamokos dalyvių skaičius; viešų paskaitų sąrašas (čia – pagal pranešimų archyvą: 04 28 „EditAI“, 05 11 Skeptikų draugija, 07 18 „Yaga“, 09 10 „World of Particles“, 10 23 „Innoday“, 10 26 „Užsikrauk karjerai“).]
Skaičiai suskaičiuoti iš suvestinės eilučių apie LHCb, grupės narius ir narystę CERN; CMS ir kitų grupių eilutės neįtrauktos. Suvestinė baigiasi 2026 10 28.
Šaltiniai: indico.cern.ch/event/1648092; Fizikos fakulteto žiniasklaidos suvestinė (2026 10 28); lrt.lt/naujienos/tavo-lrt/15/3125037.
(~0,6 min)
-->

---
clicks: 2
---

<div class="kick"><b>6</b>Jaunieji tyrėjai ir studentai</div>

# Doktorantai ir podoktorantė

<div class="team">
  <HexTeam :year="2026" :until="2027" :size="112" settled :focus="[['ruta'], ['sarunas'], ['anni']][$clicks]" />
  <div class="team-side">
    <div v-if="$clicks === 0">
      <h3>Rūta Racz</h3>
      <div class="rl">pirmoji grupės doktorantė</div>
      <ul>
        <li>Run 3 analizė <Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" />: atranka, fono tyrimai</li>
        <li>ECC straipsnio bendraautorė</li>
        <li>Budėjimai LHCb valdymo centre</li>
        <li>Vasarį išlaikė teorijos egzaminą</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 1">
      <h3>Šarūnas Jacevičius</h3>
      <div class="rl">antrasis doktorantas</div>
      <ul>
        <li>Run 3 analizė <Tex v="\Lambda_b^0 \to \Sigma_c^+ \bar{D}^{0} K^-" /></li>
        <li>Pranešimas darbo seminare Nagojoje, lapkričio 25 d.</li>
        <li>Analizių dokumentacija ir stebėsena „GitLab“</li>
        <li>LHCb savaitės ir meistriškumo pamokos organizavimas</li>
      </ul>
    </div>
    <div v-else>
      <h3>Anni Kauniskangas</h3>
      <div class="rl">podoktorantė</div>
      <ul>
        <li>Daktaro laipsnis EPFL: reto B mezono skilimo matavimas LHCb duomenyse</li>
        <li>Vilniuje: pentakvarkų paieškos kanaluose su dviem prarastomis neutraliomis dalelėmis</li>
      </ul>
    </div>
  </div>
</div>

<!-- facts: lhcb-vilnius-racz -->

<!--
Kalbėtojui. Šeštas punktas: jaunieji tyrėjai; du paspaudimai: Rūta, Šarūnas, Anni. Kiekvienas doktorantas atlieka savo Run 3 analizę. Rūta taip pat budi LHCb valdymo centre. Šarūnas lapkričio 25 d. skaitė pranešimą tarptautiniame darbo seminare Nagojoje. Šiemet prie grupės prisijungia podoktorantė Anni Kauniskangas, apgynusi disertaciją EPFL.
[PATIKSLINTI, neprivaloma: doktorantų mokyklos ir stažuotės 2026 m.; 2025 m. ataskaitoje buvo ESHEP (Rūta) ir Osakos mokykla (Šarūnas).]
Šaltiniai: vu.lt (R. Racz, 2026 02); grupės pasitarimų skaidrės (2026 02 03, 2026 05 05, 2026 10 14); Nagojos darbo seminaro programa (indico.rcnp.osaka-u.ac.jp/event/2981).
(~0,7 min)
-->

---

<div class="kick"><b>6</b>Jaunieji tyrėjai ir studentai</div>

# Studentai ir dėstymas

<div class="g2 stretch">
  <div class="panel">
    <h3>Studijos ir baigiamieji darbai</h3>
    <ul>
      <li><strong>Sophia</strong>: apgintas magistro darbas apie pentakvarkų paieškos metodą Run 3 duomenims</li>
      <li><strong>Mikas</strong>: apgintas magistro darbas</li>
      <li><strong>Margarita</strong>: rengia magistro darbą</li>
      <li><strong>Dominykas</strong>: magistrantūros pirmas kursas; Japonijos projektas</li>
      <li><strong>Meda, Neilas, Eliza</strong>: bakalauro darbai</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Stažuotės CERN</h3>
    <ul>
      <li><strong>Neilas</strong>: CERN vasaros studentų programa (ALICE); LMT finansuota 3 savaičių stažuotė meistriškumo pamokai atnaujinti</li>
      <li><strong>Margarita</strong>: LHCb finansuojama vieta prie VELO</li>
      <li><strong>Meda, Eliza, Dominykas</strong>: „Erasmus+“ praktika</li>
      <li>Iš viso 2026 m. vasarą CERN stažavosi 13&nbsp;VU studentų</li>
      <li>Kiekvienas studentas dirba poroje su doktorantu arba tyrėju</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.75em; display: grid; grid-template-columns: max-content minmax(0, 1fr); column-gap: 1.6em; align-items: center">
  <div>
    <h3>Dėstymas</h3>
    <div class="kpi"><div class="n">140<small>studentų</small></div></div>
  </div>
  <ul>
    <li>„CERN duomenų analizės metodai“: Fizikos fakultetas ir Verslo mokykla</li>
    <li>16 paskaitų, 15 seminarų; visa medžiaga atvira</li>
  </ul>
</div>

<!-- facts: lhcb-vilnius-students -->

<!--
Kalbėtojui. Studentai – didžioji grupės dalis. Jie rašo baigiamuosius darbus iš tų pačių analizių, vasarą dirba CERN ir patys rengia meistriškumo pamoką. Sophia dabar doktorantė Groningeno LHCb grupėje; jos darbas – „Development of a Kinematic Over-Constraint Method for Pentaquark Search in Λb0 decays at LHCb in Run 3“. Neilas vasarį tris savaites CERN su B. Couturier ir S. Ponce atnaujino LHCb meistriškumo pamokos programą.
Dėstymas: dalykas „CERN duomenų analizės metodai“ per metus dėstytas trijuose semestruose dviejuose padaliniuose, iš viso 140 studentų.
Šiemet magistro darbus apgynė du grupės studentai: Sophia ir Mikas. Margaritos magistro darbas – ne apie VELO; Dominykas – magistrantūros pirmame kurse.
[PATIKSLINTI, neprivaloma: Miko ir Margaritos magistro darbų temos; bakalauro darbų temos ir gynimų datos.]
[PATIKSLINTI, neprivaloma: vasaros praktikos pagal gegužės 5 d. pasitarimo sąrašą; jame dar Rūta Lomsargytė („Erasmus+“).]
Šaltiniai: grupės pasitarimų skaidrės (2026 02 17, 2026 03 31, 2026 05 05); vu.lt (2026 08 20); VU edukacinės iniciatyvos ataskaita (2026 10 28); grupės vadovo žodžiai (2026 11 26).
(~0,7 min)
-->

---

<div class="cover-rep">
  <div class="t">Ačiū</div>
  <div class="s">LHCb Vilnius</div>
  <div class="w">lhcb-vilnius.web.cern.ch</div>
  <div class="tiny" style="margin-top: 2.5rem">LHCb savaitės filmas ir jo kadrai: Nebula Moments (Rimantas Unkevičius). Nagojos darbo seminaro nuotrauka: seminaro organizatoriai. Vaizdo įrašo kadras: „Veritasium“ („YouTube“).</div>
</div>

<!--
Kalbėtojui. Padėka konsorciumui ir ministerijai; klausimai.
Šaltiniai: nėra, pabaigos skaidrė; vaizdų autoriai nurodyti skaidrėje.
(~0,1 min)
-->
