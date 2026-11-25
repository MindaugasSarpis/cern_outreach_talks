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
duration: 20min
exportFilename: LHCb_Vilnius_2026_ataskaita
layout: default
---

<div class="cover-rep">
  <div class="kick">Lietuvos dalelių fizikos konsorciumui</div>
  <div class="t">LHCb Vilnius</div>
  <div class="s">2026 m. ataskaita ir 2027 m. perspektyvos</div>
  <div class="w">Dr. Mindaugas Šarpis, LHCb Vilnius vadovas<br>Vilniaus universitetas, Fizikos fakultetas</div>
</div>

<!--
Kalbėtojui. Titulinė skaidrė. Ataskaitos tvarka: metai trumpai, grupė, LHCb savaitė Vilniuje, tyrimai, doktorantai ir studentai, indėlis į eksperimentą, pranešimai, projektai, dėstymas ir sklaida, 2027 m.
[PATIKSLINTI, neprivaloma: posėdžio data ir pranešimo trukmė; aplanko pavadinime diena pažymėta 00.]
Šaltiniai: nėra, titulinė skaidrė.
(~0,3 min)
-->

---
class: airy
---

<div class="kick">Apžvalga</div>

# 2026 m. skaičiais

<div class="g3 stretch">
  <div class="panel kpi"><div class="n">13</div><div class="l">grupės narių: 5 tyrėjai, 2 doktorantai, 5 studentai ir vadovo pavaduotojas</div></div>
  <div class="panel kpi"><div class="n">~200</div><div class="l">LHCb savaitės dalyvių Vilniuje (VU duomenys)</div></div>
  <div class="panel kpi"><div class="n">3</div><div class="l">rengiami straipsniai: ECC metodas ir du Run 2 analizės</div></div>
  <div class="panel kpi"><div class="n">2</div><div class="l">Run 3 analizės, kurias veda doktorantai</div></div>
  <div class="panel kpi"><div class="n">140</div><div class="l">studentų dalyke „CERN duomenų analizės metodai“</div></div>
  <div class="panel kpi"><div class="n">71</div><div class="l">paminėjimas žiniasklaidoje sausio–spalio mėn.</div></div>
</div>

<!-- facts: lhcb-week-vilnius, lhcb-week-vilnius-attendance-sources, lhcb-open-data-coordinator-2026 -->

<!--
Kalbėtojui. Šeši metų skaičiai; kiekvienas toliau turi savo skaidrę. Lėšos – vienoje skaidrėje „Biudžetas ir pritrauktos lėšos“.
Dalyvių skaičiai – VU pranešimo prognozė (apie 200 gyvai, apie 600 iš viso); galutinio skaičiaus viešai nėra. [PATIKSLINTI: galutinis užsiregistravusių skaičius iš Indico.]
71 – Fizikos fakulteto žiniasklaidos suvestinės įrašai apie grupę ir LHCb iki spalio 28 d.
Šaltiniai: vu.lt (2026 09 08, 2026 07 30); Fizikos fakulteto žiniasklaidos suvestinė (iki 2026 10 28); grupės pasitarimų skaidrės (2026 04 14, 2026 10 14); VU edukacinės iniciatyvos ataskaita (2026 10 28).
(~1 min)
-->

---
clicks: 3
---

<div class="kick">Grupė</div>

# LHCb Vilnius {{ [2024, 2025, 2026, 2027][$clicks] }} m.

<div class="team">
  <HexTeam :year="[2024, 2025, 2026, 2027][$clicks]" :size="106" />
  <div class="team-side">
    <div v-if="$clicks === 0">
      <div class="n">12<small>narių</small></div>
      <ul>
        <li>Grupė įkurta 2024 m. sausį</li>
        <li>2024 m. rugsėjo 2 d. VU vienbalsiai priimtas į LHCb</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 1">
      <div class="n">17<small>narių</small></div>
      <ul>
        <li>Adam: pirmasis užsienio tyrėjas grupėje</li>
        <li>Šarūnas: antrasis doktorantas</li>
        <li>Mikas, Dominykas, Margarita</li>
      </ul>
    </div>
    <div v-else-if="$clicks === 2">
      <div class="n">13<small>narių</small></div>
      <ul>
        <li>Sophia apgynė magistro darbą ir išvyko į Groningeno LHCb grupės doktorantūrą</li>
        <li>Prisijungia podoktorantė Anni Kauniskangas (EPFL daktaro laipsnis)</li>
        <li class="muted">Pilki šešiakampiai: buvę nariai</li>
      </ul>
    </div>
    <div v-else>
      <div class="n">14+<small>narių</small></div>
      <ul>
        <li>Gustė: doktorantūra nuo 2027 m. spalio</li>
        <li>Naujos vietos: ERC paraiškos, doktorantūros konkursas, magistrantai</li>
      </ul>
    </div>
  </div>
</div>

<!-- facts: lhcb-vilnius-joined -->

<!--
Kalbėtojui. Keturi paspaudimai: 2024, 2025, 2026, 2027 m. Kiekvienu paspaudimu atskrenda tų metų nariai; 2026 m. buvę nariai papilkėja, 2027 m. atsiranda tuščios vietos.
2024 m. (12): Mindaugas, Ramūnas, Olegas, Augustas, Dainius, Rūta, Sophia, Karolina, Venera, Meda, Eliza, Neilas. 2025 m. prisijungė Adam, Šarūnas, Mikas, Dominykas, Margarita.
2026 m. (13): Mindaugas, Ramūnas, Adam, Olegas, Augustas, Anni, Rūta, Šarūnas, Margarita, Dominykas, Meda, Neilas, Eliza.
[PATIKSLINTI: ar Dainius, Karolina, Venera ir Mikas tebėra grupėje; jų nėra 2026 10 14 komandos lentoje, todėl čia jie pažymėti kaip buvę nariai. Taisoma setup/team.ts.]
[PATIKSLINTI: kada tiksliai pradeda Anni.]
Šaltiniai: 2025 m. ataskaita LDFK (2026 01 06); grupės pasitarimo skaidrės (2026 10 14); ff.vu.lt (2024 09).
(~1,5 min)
-->

---
class: dense
---

<div class="kick">Grupė</div>

# Kas ką daro

<div class="g4 stretch">
  <div class="panel">
    <h3>Tyrėjai</h3>
    <div class="person"><HexTile who="mindaugas" :size="50" label="" /><div class="t"><div class="nm">Mindaugas</div><div class="small muted">vadovas; straipsniai, DPA, ERC, Japonijos projektas</div></div></div>
    <div class="person"><HexTile who="adam" :size="50" label="" /><div class="t"><div class="nm">Adam</div><div class="small muted">simuliacijos, ECC ir Run 2 straipsniai</div></div></div>
    <div class="person"><HexTile who="olegas" :size="50" label="" /><div class="t"><div class="nm">Olegas</div><div class="small muted">Run 2 straipsniai, DPA, analizių palaikymas</div></div></div>
    <div class="person"><HexTile who="augustas" :size="50" label="" /><div class="t"><div class="nm">Augustas</div><div class="small muted">SciFi šviesos įvedimo sistema, Run 3 palaikymas</div></div></div>
    <div class="person"><HexTile who="anni" :size="50" label="" /><div class="t"><div class="nm">Anni</div><div class="small muted">podoktorantė; kanalai su dviem prarastomis neutraliomis dalelėmis</div></div></div>
  </div>
  <div class="panel">
    <h3>Doktorantai</h3>
    <div class="person"><HexTile who="ruta" :size="50" label="" /><div class="t"><div class="nm">Rūta</div><div class="small muted">Run 3: <Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" />; ECC straipsnis</div></div></div>
    <div class="person"><HexTile who="sarunas" :size="50" label="" /><div class="t"><div class="nm">Šarūnas</div><div class="small muted">Run 3: <Tex v="\Lambda_b^0 \to \Sigma_c^+ \bar{D}^{0} K^-" /></div></div></div>
    <div class="person"><HexTile who="guste" :size="50" label="" /><div class="t"><div class="nm">Gustė</div><div class="small muted">nuo 2027 m. spalio; pentakvarkų femtoskopija</div></div></div>
  </div>
  <div class="panel">
    <h3>Magistrantai</h3>
    <div class="person"><HexTile who="margarita" :size="50" label="" /><div class="t"><div class="nm">Margarita</div><div class="small muted">VELO detektoriaus kūrimas</div></div></div>
    <div class="person"><HexTile who="dominykas" :size="50" label="" /><div class="t"><div class="nm">Dominykas</div><div class="small muted">magistro darbas, Japonijos projektas, meistriškumo pamoka</div></div></div>
  </div>
  <div class="panel">
    <h3>Bakalaurai</h3>
    <div class="person"><HexTile who="meda" :size="50" label="" /><div class="t"><div class="nm">Meda</div><div class="small muted">baigiamasis darbas, meistriškumo pamoka</div></div></div>
    <div class="person"><HexTile who="neilas" :size="50" label="" /><div class="t"><div class="nm">Neilas</div><div class="small muted">baigiamasis darbas, meistriškumo pamokos programa</div></div></div>
    <div class="person"><HexTile who="eliza" :size="50" label="" /><div class="t"><div class="nm">Eliza</div><div class="small muted">baigiamasis darbas, meistriškumo pamoka</div></div></div>
  </div>
</div>

<p class="small muted">Visi tyrėjai dėsto Fizikos fakultete. Ramūnas Aleksiejūnas: grupės vadovo pavaduotojas ir LDFK direktorius.</p>

<!--
Kalbėtojui. Grupės darbų pasiskirstymas pagal 2026 m. spalio komandos lentą: tyrėjai rašo straipsnius ir palaiko analizes, doktorantai veda Run 3 analizes, magistrantai ir bakalaurai rašo baigiamuosius darbus ir rengia meistriškumo pamoką.
[PATIKSLINTI, neprivaloma: Anni tema čia užrašyta pagal spalio 14 d. pasitarimo skaidrę.]
Šaltiniai: grupės pasitarimo skaidrės ir komandos lenta (2026 10 14); CERN „Grey Book“ (2026 10 07).
(~1 min)
-->

---
class: roomy
---

<div class="kick"><span class="nc">LHCb</span> savaitė Vilniuje</div>

# 121-oji LHCb savaitė: pirmą kartą Lietuvoje

<div class="split stretch">
  <div class="stack">
    <div class="g3">
      <div class="panel kpi"><div class="n">~200</div><div class="l">fizikų Vilniuje</div></div>
      <div class="panel kpi"><div class="n">~600</div><div class="l">dalyvių su nuotoliniais</div></div>
      <div class="panel kpi"><div class="n">5</div><div class="l">dienos, rugsėjo 14–18</div></div>
    </div>
    <div class="panel">
      <ul>
        <li>Visos LHCb kolaboracijos susitikimas: 1 891 narys, 112 institutų, 28 šalys</li>
        <li>VU Gyvybės mokslų centras ir Verslo mokykla, Saulėtekis</li>
        <li>Paraiška rengti savaitę pateikta 2024 m. lapkritį</li>
      </ul>
    </div>
  </div>
  <div>
    <img class="ph" src="/figures/lw_hall.jpg" alt="Pilna salė LHCb savaitės atidaryme">
    <div class="cap">Atidarymas VU Gyvybės mokslų centre, rugsėjo 14 d.</div>
  </div>
</div>

<!-- facts: lhcb-week-vilnius, lhcb-week-vilnius-attendance-sources, lhcb-collaboration-sep-2026 -->

<!--
Kalbėtojui. LHCb savaitė – svarbiausias metų įvykis. Tai eilinis visos kolaboracijos susitikimas, kuris kartą per metus vyksta ne CERN. Vilniaus paraiška pateikta 2024 m. lapkritį, praėjus dviem mėnesiams po priėmimo į LHCb.
Dalyvių skaičiai – prognozės ir nesutampa: VU pranešime apie 200 gyvai ir apie 600 iš viso, grupės puslapyje 300 gyvai ir 300 nuotoliu iš 128 institutų 28 šalyse. [PATIKSLINTI: galutinis dalyvių skaičius iš Indico registracijos; kiek šalių ir institutų.]
[PATIKSLINTI, neprivaloma: kada tiksliai LHCb patvirtino Vilnių; paraiška teikta 2024 11 29.]
Šaltiniai: lrt.lt/naujienos/mokslas-ir-it/11/3052140; vu.lt (2026 09 08 ir 09 14); indico.cern.ch/event/1696594; T. Gershon ataskaita CERN SPC (2026 09 22).
Vaizdas: kadras iš LHCb savaitės filmo (Nebula Moments).
(~1 min)
-->

---
bare: true
class: p-0
---

<VideoPlayer src="lhcb_week_aftermovie.mp4" />

<!--
Kalbėtojui. Visas LHCb savaitės Vilniuje filmas su savo muzika, 2:28. Filmas prasideda skaidrei atsivėrus ir pasibaigęs laukia paspaudimo. Per filmą nekalbėti.
Filme: 0:16 Saulėtekio miestelis iš oro, 0:25 pilna salė atidaryme, 0:26 Prezidento sveikinimas, 0:30 atidarymo diskusija, 0:55 priėmimas Universiteto kieme, 1:15 ugnies šou, 1:27 vakarienė.
PDF versijoje vietoj filmo – jo kadras.
Vaizdas: LHCb savaitės filmas, Nebula Moments (Rimantas Unkevičius).
(~0,1 min)
-->

---
class: snug
---

<div class="kick"><span class="nc">LHCb</span> savaitė Vilniuje</div>

# Savaitės programa

<div class="ph-row">
  <div><img class="ph" src="/figures/lw_president.jpg" alt="Prezidento sveikinimas ekranuose"><div class="cap">Prezidento sveikinimas atidaryme</div></div>
  <div><img class="ph" src="/figures/lw_panel.jpg" alt="Atidarymo diskusija"><div class="cap">Diskusija „Lithuania's AI Factory“</div></div>
  <div><img class="ph" src="/figures/lw_mapping.jpg" alt="Lazerių projekcija Universiteto kieme"><div class="cap">Lazerių projekcija VU Didžiajame kieme</div></div>
</div>

<div class="g3 stretch" style="margin-top: 0.7rem">
  <div class="panel">
    <h3>Mokslas</h3>
    <ul>
      <li>Plenariniai posėdžiai ir darbo grupės visą savaitę</li>
      <li>„Collaboration Board“ posėdis VU Auloje</li>
      <li>21 stendinis pranešimas, 3 apdovanojimai</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Atidarymas</h3>
    <ul>
      <li>Prezidento ir VU rektoriaus sveikinimai</li>
      <li>Diskusija su CERN tyrimų direktoriumi, LHCb vadovu, ŠMSM ir EIMIN atstovais</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Kultūra</h3>
    <ul>
      <li>Programa „Threads of Lithuania“</li>
      <li>Priėmimas VU Didžiajame kieme, vakarienė „Tech Zity“</li>
      <li>Ekskursijos: Vilnius, Trakai, Molėtų observatorija</li>
    </ul>
  </div>
</div>

<!--
Kalbėtojui. Mokslinė dalis – įprasta LHCb savaitė. Atidaryme: Prezidento sveikinimas (vaizdo įrašu), rektoriaus kalba, diskusija „Lithuania's AI Factory: Connecting Science, Industry and Global Research Infrastructures“ (moderatorė prof. S. Mačiukaitė-Žvinienė; G. Hamel de Monchenault, CERN; T. Gershon, LHCb; prof. P. Treigys; viceministrė R. Valutytė; B. Girdvainis, EIMIN). LHCb vadovybė iš anksto prašė autentiškos kultūrinės programos.
[PATIKSLINTI, neprivaloma: stendinių pranešimų skaičius (21) paimtas iš registracijos sąrašo; apdovanojimų – iš sąmatos.]
Šaltiniai: LHCb savaitės atidarymo ir vakarų programos (2026 09); indico.cern.ch/event/1696594.
Vaizdas: kadrai iš LHCb savaitės filmo (Nebula Moments).
(~1 min)
-->

---
class: snug
---

<div class="kick"><span class="nc">LHCb</span> savaitė Vilniuje</div>

# Žiniasklaida: 37 publikacijos ir laidos per dvi savaites

<div class="split stretch">
  <div class="stack">
    <div class="panel">
      <h3>Kur</h3>
      <span class="tag">LRT „Panorama“</span><span class="tag">LRT „Labas rytas“</span><span class="tag">LRT žinios</span><span class="tag">LRT English</span><span class="tag">„Delfi diena“</span><span class="tag">Delfi</span><span class="tag">15min</span><span class="tag">Lrytas</span><span class="tag">TV3</span><span class="tag">BNS</span><span class="tag">Diena</span><span class="tag">Respublika</span><span class="tag">Mokslo Lietuva</span><span class="tag">Elektronika.lt</span>
    </div>
    <div class="panel">
      <h3>Apie ką</h3>
      <ul>
        <li>„Vilniuje – didžiausias dalelių fizikų susitikimas Lietuvos istorijoje“ (LRT)</li>
        <li>„Lithuania seeks full CERN membership as Vilnius hosts particle physics community“ (LRT English)</li>
      </ul>
    </div>
    <div class="panel">
      <h3>Mieste</h3>
      <ul>
        <li>CERN troleibusas Vilniaus gatvėse nuo rugsėjo 7 d.</li>
        <li>Ekranai ir informacijos stendas Vilniaus oro uoste</li>
      </ul>
    </div>
  </div>
  <div class="stack">
    <div class="panel">
      <h3>Grupės ir LHCb temos žiniasklaidoje, 2026 m.</h3>
      <div class="bars">
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
      <div class="cap">71 įrašas sausio–spalio mėn. Fizikos fakulteto žiniasklaidos suvestinėje</div>
    </div>
    <div class="panel">
      <h3>Auditorija</h3>
      <p><span class="todo">[PATIKSLINTI: pasiekta auditorija ir reklamos ekvivalentas iš žiniasklaidos stebėsenos ataskaitos]</span></p>
    </div>
  </div>
</div>

<!--
Kalbėtojui. Žiniasklaidos dėmesys: 37 įrašai apie LHCb savaitę rugsėjo 8–20 d. devyniolikoje kanalų, tarp jų trys LRT televizijos laidos, „Delfi diena“, TV3 ir BNS. Grafike – visi 2026 m. įrašai apie grupę ir LHCb: vasarį – Rūtos Racz interviu, balandį – Adamo ir Mindaugo komentarai apie naują dalelę, liepą – LHCb koordinatoriaus pareigos, spalį – „Innoday“ ir CERN Tarybos prezidento vizitas.
[PATIKSLINTI: pasiektos auditorijos skaičiai. Diske ir pašte radau tik Fizikos fakulteto suvestinę su publikacijų sąrašu; pasiekiamumo ataskaitos (VU komunikacijos ar agentūros) neradau.]
Skaičiai suskaičiuoti iš suvestinės eilučių apie LHCb, grupės narius ir narystę CERN; CMS ir kitų grupių eilutės neįtrauktos. Suvestinė baigiasi 2026 10 28.
Šaltiniai: Fizikos fakulteto žiniasklaidos suvestinė (2026 10 28); lrt.lt/naujienos/mokslas-ir-it/11/3052140; delfi.lt (2026 09 14); lrt.lt/en (2026 09 20); LHCb savaitės viešinimo planas.
(~1 min)
-->

---
class: airy
---

<div class="kick"><span class="nc">LHCb</span> savaitė Vilniuje</div>

# Partneriai ir rėmėjai

<div class="g2 stretch">
  <div class="stack">
    <div class="panel">
      <h3>Globėjas</h3>
      <p>Lietuvos Respublikos Prezidentas Gitanas Nausėda</p>
    </div>
    <div class="panel">
      <h3>Organizatoriai</h3>
      <p>Vilniaus universitetas · Švietimo, mokslo ir sporto ministerija</p>
    </div>
    <div class="panel">
      <h3>Partneriai</h3>
      <p>Lietuvos mokslo taryba · „Go Vilnius“ · Lietuvos dalelių fizikos konsorciumas</p>
    </div>
  </div>
  <div class="stack">
    <div class="panel">
      <h3>Rėmėjai</h3>
      <span class="tag">Light Conversion</span><span class="tag">EKSPLA</span><span class="tag">Standa</span><span class="tag">Brolis</span><span class="tag">Akoneer</span><span class="tag">Mono Spektra</span><span class="tag">Direct Machining Control</span><span class="tag">Humbility</span><span class="tag">Klaipėdos LEZ</span><span class="tag">Konica Minolta</span><span class="tag">Scienced</span>
    </div>
  </div>
</div>

<!--
Kalbėtojui. Padėka konsorciumui: LDFK buvo savaitės partneris. Rėmėjų sąrašas – iš renginio logotipų tinklelio (2026 08 25).
[PATIKSLINTI: rėmėjų sąrašas ir jų lygiai; tinklelyje dar buvo vienas logotipas, kurio neperskaičiau („VVT“?).]
Šaltiniai: LHCb savaitės logotipų tinklelis (2026 08 25); grupės pasitarimų skaidrės (2026 01 13, 2026 04 14).
(~0,7 min)
-->

---
class: airy
---

<div class="kick">Narystė</div>

# Lietuva ir CERN 2026 m.

<div class="split stretch">
  <div class="panel">
    <div class="tl">
      <div class="d">01 19</div><div>Prezidentas lankosi CERN ir susitinka su Lietuvos bendruomene</div>
      <div class="d">08 21</div><div>Ministras Pirmininkas nusprendžia oficialiai kreiptis dėl visateisės narystės CERN</div>
      <div class="d">09 04</div><div>Lietuvos nuolatinis atstovas Ženevoje lankosi CERN dėl narystės</div>
      <div class="d">09 14–18</div><div><strong>LHCb savaitė Vilniuje</strong></div>
      <div class="d">10 19</div><div>CERN Tarybos prezidentas Costas Fountas lankosi Lietuvoje ir susitinka su LHCb Vilnius bendruomene</div>
    </div>
  </div>
  <div class="stack">
    <div class="panel">
      <div class="quote">„The membership procedure has already started.“</div>
      <div class="cap">Gautier Hamel de Monchenault, CERN tyrimų ir skaičiavimų direktorius, LRT, 2026 m. rugsėjo 20 d.</div>
    </div>
    <div class="panel">
      <h3>Lietuvos dalyviai CERN eksperimentuose</h3>
      <p>CMS 35, <strong>LHCb 15</strong>, DRD3 11</p>
      <div class="cap">CERN „Grey Book“, 2026 m. spalio 7 d.</div>
    </div>
  </div>
</div>

<!-- facts: lt-nauseda-visit, lhcb-open-data-coordinator-2026, lt-full-decision, lt-member-interest-cern-visit-2026-09, lhcb-lithuania-membership, lt-greybook-participation -->

<!--
Kalbėtojui. LHCb savaitė sutapo su valstybės sprendimu siekti visateisės narystės CERN: Premjero sprendimas – rugpjūčio 21 d., laiškas CERN vadovybei paskelbtas rugpjūčio 26 d. CERN atstovas Vilniuje patvirtino, kad procedūra jau prasidėjo. Spalį Lietuvoje lankėsi CERN Tarybos prezidentas C. Fountas; su juo ir CERN direktore U. Bassler susitiko ir mūsų grupė.
[PATIKSLINTI, neprivaloma: vizito datos ir ar U. Bassler lankėsi kartu; žiniasklaidoje minimas tik C. Fountas, spalio 19 d.]
Šaltiniai: home.cern/presidential-visits-cern-0; vu.lt (2026 07 30); lrv.lt (2026 08 26); cds.cern.ch CERN-PHOTO-202609-233; lrt.lt/en (2026 09 20); delfi.lt ir lrt.lt (2026 10 19); greybook.cern.ch (2026 10 07).
(~1 min)
-->

---
class: snug
---

<div class="kick">Tyrimai</div>

# Pentakvarkų paieškos atviro žavesio kanaluose

<div class="g3 stretch">
  <div class="panel">
    <h3>ECC metodo straipsnis</h3>
    <div class="who">Mindaugas, Adam, Rūta</div>
    <ul>
      <li>Prarastos neutralios dalelės (<Tex v="\pi^0" />, <Tex v="\gamma" />) judesio kiekio atkūrimas</li>
      <li>Baigiamas iki gruodžio</li>
      <li>Taikomas Run 2 ir Run 3 analizėse</li>
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

<div class="g2 stretch" style="margin-top: 0.8rem">
  <div class="panel">
    <h3>Klausimas</h3>
    <p>Ar <Tex v="P_c" /> pentakvarkai yra kompaktiški penkių kvarkų dariniai, ar bariono ir mezono molekulės? Atviro žavesio kanalai <Tex v="\Lambda_c^+ \bar{D}^{(*)0}" /> ir <Tex v="\Sigma_c^+ \bar{D}^{0}" /> leidžia šias hipotezes atskirti.</p>
  </div>
  <div class="panel">
    <h3>Naujos kryptys</h3>
    <ul>
      <li>Pentakvarkų femtoskopija (Gustė)</li>
      <li>Kanalai su dviem prarastomis neutraliomis dalelėmis (Anni)</li>
      <li>Linijų formų modeliai su Japonijos teoretikais</li>
    </ul>
  </div>
</div>

<!--
Kalbėtojui. Grupės fizikos programa: Pc pentakvarkų paieška skilimuose į atviro žavesio hadronus, kur prarandamas minkštas π0 arba γ. Tam sukurtas ECC („Extended Cone Closure“) metodas; jo straipsnis baigiamas iki gruodžio. Run 2 analizė virsta dviem straipsniais; pirmojo prašo LHCb fizikos koordinatorius. Run 3 analizes veda doktorantai. Išeities taškas – 2024 m. paskelbtas skilimo Λb0 → Λc+ D̄(*)0 K− stebėjimas.
[PATIKSLINTI: straipsnių būklė pranešimo dieną (ECC – pateiktas ar ne; Run 2 I – kolaboracijos peržiūros etapas).]
Šaltiniai: grupės pasitarimo skaidrės (2026 10 14); pranešimas Nagojos darbo seminare (2026 11 25).
(~1,5 min)
-->

---
class: airy
---

<div class="kick">Doktorantai</div>

# Ką daro doktorantai

<div class="g3 stretch">
  <div class="panel">
    <div class="person">
      <HexTile who="ruta" :size="104" label="" />
      <div class="t"><div class="nm">Rūta Racz</div><div class="rl">pirmoji grupės doktorantė</div></div>
    </div>
    <ul class="small" style="margin-top: 0.5rem">
      <li>Run 3 analizė <Tex v="\Lambda_b^0 \to \Lambda_c^+ \bar{D}^{*0} K^-" />: atranka, BDT, fono tyrimai</li>
      <li>ECC straipsnio bendraautorė</li>
      <li>Detektoriaus stebėsenos budėjimai LHCb valdymo centre</li>
      <li>Vasarį išlaikė teorijos egzaminą</li>
    </ul>
  </div>
  <div class="panel">
    <div class="person">
      <HexTile who="sarunas" :size="104" label="" />
      <div class="t"><div class="nm">Šarūnas Jacevičius</div><div class="rl">antrasis doktorantas</div></div>
    </div>
    <ul class="small" style="margin-top: 0.5rem">
      <li>Run 3 analizė <Tex v="\Lambda_b^0 \to \Sigma_c^+ \bar{D}^{0} K^-" /></li>
      <li>Pranešimas darbo seminare Nagojoje, lapkričio 25 d.</li>
      <li>Analizių dokumentacija ir stebėsena „GitLab“</li>
      <li>LHCb savaitės ir meistriškumo pamokos organizavimas</li>
    </ul>
  </div>
  <div class="panel">
    <div class="person">
      <HexTile who="guste" :size="104" label="" />
      <div class="t"><div class="nm">Gustė</div><div class="rl">nuo 2027 m. spalio</div></div>
    </div>
    <ul class="small" style="margin-top: 0.5rem">
      <li>Tema: pentakvarkų femtoskopija LHCb eksperimente</li>
      <li>Nauja grupei metodika: dalelių koreliacijos mažuose santykiniuose judesio kiekiuose</li>
    </ul>
  </div>
</div>

<!-- facts: lhcb-vilnius-racz -->

<!--
Kalbėtojui. Doktorantai veda po Run 3 analizę. Rūta taip pat budi LHCb valdymo centre. Šarūnas lapkričio 25 d. skaitė pranešimą tarptautiniame darbo seminare Nagojoje.
[PATIKSLINTI: Gustės pavardė ir ar tema jau patvirtinta.]
[PATIKSLINTI, neprivaloma: doktorantų mokyklos ir stažuotės 2026 m.; 2025 m. ataskaitoje buvo ESHEP (Rūta) ir Osakos mokykla (Šarūnas).]
Šaltiniai: vu.lt (R. Racz, 2026 02); grupės pasitarimų skaidrės (2026 02 03, 2026 05 05, 2026 10 14); Nagojos darbo seminaro programa (indico.rcnp.osaka-u.ac.jp/event/2981).
(~1 min)
-->

---
class: snug
---

<div class="kick">Studentai</div>

# Ką daro studentai

<div class="g2 stretch">
  <div class="stack">
    <div class="panel">
      <h3>Baigiamieji darbai</h3>
      <ul>
        <li><strong>Sophia</strong>: magistro darbas „Development of a Kinematic Over-Constraint Method for Pentaquark Search in <Tex v="\Lambda_b^0" /> decays at LHCb in Run 3“; tęsia Groningeno LHCb grupėje</li>
        <li><strong>Dominykas</strong>: magistro darbas; Japonijos projektas</li>
        <li><strong>Margarita</strong>: magistro darbas apie VELO detektorių</li>
        <li><strong>Meda, Neilas, Eliza</strong>: bakalauro darbai</li>
      </ul>
    </div>
  </div>
  <div class="stack">
    <div class="panel">
      <h3>Vasara CERN</h3>
      <ul>
        <li><strong>Neilas</strong>: CERN vasaros studentų programa (ALICE)</li>
        <li><strong>Margarita</strong>: LHCb finansuojama vieta prie VELO</li>
        <li><strong>Meda, Eliza, Dominykas</strong>: „Erasmus+“ praktika</li>
        <li>Iš viso 2026 m. vasarą CERN stažavosi 13 VU studentų (VU duomenys)</li>
      </ul>
    </div>
    <div class="panel">
      <h3>Atsakomybės grupėje</h3>
      <ul>
        <li>LHCb meistriškumo pamokos organizavimas; Neilas tam skyrė LMT finansuotą 3 savaičių stažuotę CERN</li>
        <li>LHCb savaitė: „Indico“ puslapis (Dominykas), savanoriai</li>
        <li>Kiekvienas studentas dirba poroje su doktorantu arba tyrėju</li>
      </ul>
    </div>
  </div>
</div>

<!-- facts: lhcb-vilnius-students -->

<!--
Kalbėtojui. Studentai – didžioji grupės dalis. Jie rašo baigiamuosius darbus iš tų pačių analizių, vasarą dirba CERN ir patys rengia meistriškumo pamoką. Sophia – pirmoji grupės magistrė, dabar doktorantė Groningeno LHCb grupėje. Neilas vasarį tris savaites CERN su B. Couturier ir S. Ponce atnaujino LHCb meistriškumo pamokos programą.
[PATIKSLINTI: bakalauro ir magistro darbų temos, kas ir kada ginasi; ar Dominykas 2026 m. apgynė bakalauro darbą ir įstojo į magistrantūrą.]
[PATIKSLINTI, neprivaloma: vasaros praktikos pagal gegužės 5 d. pasitarimo sąrašą; jame dar Rūta Lomsargytė („Erasmus+“).]
Šaltiniai: grupės pasitarimų skaidrės (2026 02 17, 2026 03 31, 2026 05 05); vu.lt (2026 08 20).
(~1 min)
-->

---
class: snug
---

<div class="kick">Indėlis į eksperimentą</div>

# Ką grupė duoda LHCb

<div class="g3 stretch">
  <div class="panel">
    <h3>Duomenys ir analizė (DPA)</h3>
    <ul>
      <li><strong>Mindaugas</strong>: LHCb analizių išsaugojimo ir atvirųjų duomenų koordinatorius nuo rugpjūčio 1 d.</li>
      <li><strong>Olegas</strong>: FSR darbas įtrauktas į LHCb programinę įrangą; pranešimas DPA ir RTA bendrame posėdyje</li>
      <li><strong>Adam</strong>: simuliacijos, analizių atkuriamumas</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Detektorius</h3>
    <ul>
      <li><strong>Augustas</strong>: SciFi sekiklio šviesos įvedimo sistema</li>
      <li>Apšvitinti SciFi šviesolaidžiai tiriami Vilniuje</li>
      <li><strong>Margarita</strong>: VELO detektoriaus kūrimas CERN</li>
      <li><strong>Rūta</strong>: budėjimai valdymo centre</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Kolaboracijos gyvenimas</h3>
    <ul>
      <li>121-osios LHCb savaitės organizavimas</li>
      <li>LHCb meistriškumo pamokos programos atnaujinimas</li>
      <li>Kolaboracijos straipsnių vidinis recenzavimas</li>
      <li>Analizių darbo eigos įrankiai („Snakemake“, analizių produkcijos)</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.8rem">
  <strong>Atvirieji duomenys.</strong> LHCb Run 1 duomenų atvėrimą vedė Mindaugas. 2026 m. rugsėjį Brauno universiteto grupė paskelbė darbą, patikrintą su atvirais LHCb 2017 m. susidūrimų duomenimis (arXiv:2609.09275).
</div>

<!-- facts: lhcb-open-data-coordinator-2026, lhcb-vilnius-scifi-lis, lhcb-opendata-brown-2026 -->

<!--
Kalbėtojui. Trys indėlio sritys. Pirma, duomenų apdorojimas ir analizė (DPA projektas): nuo rugpjūčio 1 d. Mindaugas koordinuoja visos kolaboracijos analizių išsaugojimą ir atviruosius duomenis; Olegas vasarį pristatė grupės darbus DPA ir RTA posėdyje, jo FSR („File Summary Record“) darbas įtrauktas į bendrą programinę įrangą. Antra, detektorius: SciFi šviesos įvedimo sistema, apšvitintų šviesolaidžių tyrimai Vilniuje, VELO. Trečia, bendri kolaboracijos darbai.
[PATIKSLINTI: tikslūs paslaugų darbų pavadinimai ir būklė (SciFi LIS, VELO); kiek budėjimų atliko grupė 2026 m.]
Šaltiniai: vu.lt (2026 07 30); indico.cern.ch/event/1635603; grupės pasitarimų skaidrės (2026 01 13, 2026 02 03, 2026 10 14); DPA ataskaita LHCb savaitėje (2026 09); arxiv.org/abs/2609.09275.
(~1,2 min)
-->

---
class: airy
---

<div class="kick">Pranešimai</div>

# Konferencijos ir pranešimai 2026 m.

<div class="panel">
  <div class="tl">
    <div class="d">02 mėn.</div><div><strong>DPA ir RTA posėdis, CERN</strong> · Olegas: LHCb Vilnius darbai DPA projekte</div>
    <div class="d">pavasaris</div><div><strong>„Open Readings 2026“, Vilnius</strong> · Meda, Neilas, Šarūnas</div>
    <div class="d">05 08</div><div><strong>Lietuvos ir Japonijos projekto pradžios susitikimas</strong> · Mindaugas</div>
    <div class="d">05 mėn.</div><div><strong>CHEP 2026, Bankokas</strong> · Mindaugas: „Towards fully reproducible physics analyses“</div>
    <div class="d">09 15</div><div><strong>LHCb savaitė, Vilnius</strong> · Mindaugas: „Pentaquarks at LHCb“</div>
    <div class="d">11 11</div><div><strong>„Reinterpretation of LHC results for new physics“, CERN</strong> · kviestinis pranešimas „Analysis preservation and reinterpretation at LHCb“ <span class="todo">[PATIKSLINTI: pranešėjas]</span></div>
    <div class="d">11 18</div><div><strong>Lietuvos ir Japonijos mokslo forumas, Lietuvos ambasada Tokijuje</strong> · Mindaugas</div>
    <div class="d">11 25</div><div><strong>„Exotic Hadrons: Bridging Experiment, Theory, and Lattice QCD“, Nagoja</strong> · Mindaugas: „Overview of pentaquark results in LHCb and future prospects“; Šarūnas</div>
  </div>
</div>

<p class="small muted">Taip pat: LHCb savaitės CERN vasarį ir birželį, „Confinement 2026“ <span class="todo">[PATIKSLINTI: kas dalyvavo]</span>.</p>

<!--
Kalbėtojui. Metų pranešimai. Du kviestiniai tarptautiniai: CHEP 2026 Bankoke ir Nagojos darbo seminaras, kuriame Mindaugas kalbėjo LHCb vardu ir buvo mokslinio komiteto narys. Reinterpretacijos seminare CERN LHCb pristatė visas analizių išsaugojimo priemones.
[PATIKSLINTI: sąrašas sudarytas iš pasitarimų skaidrių ir pranešimų archyvo; trūksta vasaros (birželio–rugsėjo) pranešimų, „Confinement 2026“ ir studentų pranešimų pavadinimų. Reinterpretacijos seminare spalio 14 d. siūlytas pranešėjas buvo Adam.]
Šaltiniai: indico.cern.ch/event/1635603; indico.cern.ch/event/1665816; indico.rcnp.osaka-u.ac.jp/event/2981; grupės pasitarimų skaidrės (2026 05 05, 2026 10 14).
(~0,8 min)
-->

---
class: full
---

<div class="kick">Projektai</div>

# Lietuvos ir Japonijos projektas „Penta-Charm“

<div class="split-r stretch">
  <div class="stack">
    <div class="panel">
      <ul>
        <li>LMT ir JSPS dvišalė programa, 2026 m. balandis – 2028 m. kovas</li>
        <li>LHCb eksperimentinė analizė Vilniuje ir teoriniai modeliai Japonijoje: Nagoja, RIKEN, „HAL QCD“</li>
        <li>Tikslas: nustatyti <Tex v="P_c" /> pentakvarkų sandarą</li>
        <li>Dalyviai iš Vilniaus: Mindaugas, Adam, Olegas, Rūta, Šarūnas ir magistrantai</li>
      </ul>
    </div>
  </div>
  <div>
    <img class="ph" src="/figures/nagoya_workshop.jpg" alt="Nagojos darbo seminaro dalyviai" style="aspect-ratio: 4 / 3">
    <div class="cap">Darbo seminaras „Exotic Hadrons“, Nagojos universitetas, 2026 m. lapkričio 24–27 d.</div>
  </div>
</div>

<!--
Kalbėtojui. Dvišalis projektas su Japonijos teoretikais (vadovas Japonijoje – Yasuhiro Yamaguchi). Mes teikiame matavimus atviro žavesio kanaluose, jie – linijų formų ir sąveikų modelius; kartu tikrinamos kompaktiškų ir molekulinių pentakvarkų hipotezės. Lapkričio 18 d. projektas pristatytas Lietuvos ambasadoje Tokijuje, lapkričio 24–27 d. Nagojoje vyko bendras darbo seminaras.
[PATIKSLINTI, neprivaloma: projekto pradžia – pasitarimo skaidrėse gegužės 1 d., Tokijo pranešime 2026 m. balandis – 2028 m. kovas; kiek grupės narių vyko į Japoniją.]
Šaltiniai: grupės pasitarimo skaidrės (2026 04 14); pranešimas Lietuvos ambasadoje Tokijuje (2026 11 18); indico.rcnp.osaka-u.ac.jp/event/2981.
Vaizdas: darbo seminaro dalyvių nuotrauka (organizatorių).
(~0,8 min)
-->

---

<div class="kick">Biudžetas</div>

# Biudžetas ir pritrauktos lėšos

<div class="split-wide stretch">
  <div class="panel">
    <h3>Pritrauktos lėšos</h3>
    <table class="money">
      <tr><th>Šaltinis</th><th>Kam</th><th>Suma</th><th>Laikotarpis</th></tr>
      <tr><td>Europos Komisija, „Horizon Europe“</td><td>PHANTOM</td><td class="n">197 tūkst. EUR</td><td>2025 08 – 2027 07</td></tr>
      <tr><td>LMT ir JSPS</td><td>„Penta-Charm“</td><td class="n">100 tūkst. EUR</td><td>2026 04 – 2028 03</td></tr>
      <tr><td>ŠMSM</td><td>LHCb savaitė Vilniuje</td><td class="n">100 tūkst. EUR</td><td>2026</td></tr>
      <tr><td>„Go Vilnius“</td><td>LHCb savaitė Vilniuje</td><td class="n">20 tūkst. EUR</td><td>2026</td></tr>
      <tr><td>Rėmėjai ir dalyvio mokesčiai</td><td>LHCb savaitė Vilniuje</td><td class="n"><span class="todo">[PATIKSLINTI]</span></td><td>2026</td></tr>
      <tr><td>VU edukacinių iniciatyvų lėšos</td><td>Dalyko atnaujinimas</td><td class="n"><span class="todo">[PATIKSLINTI]</span></td><td>2025 10 – 2026 10</td></tr>
      <tr class="sum"><td colspan="2">Iš viso be nepatikslintų eilučių</td><td class="n">417 tūkst. EUR</td><td></td></tr>
    </table>
  </div>
  <div class="stack">
    <div class="panel">
      <h3>LDFK lėšos grupei, 2026 m.</h3>
      <p><span class="todo">[PATIKSLINTI: skirta ir panaudota suma, pagrindinės išlaidų eilutės]</span></p>
    </div>
    <div class="panel">
      <h3>LHCb savaitės biudžetas</h3>
      <p><span class="todo">[PATIKSLINTI: bendra suma]</span></p>
    </div>
    <div class="panel">
      <h3>Pateiktos paraiškos</h3>
      <p>Dvi ERC paraiškos, iš viso 4 mln. EUR</p>
    </div>
  </div>
</div>

<!--
Kalbėtojui. Visos lėšos vienoje skaidrėje: kas jau pritraukta, ką grupė gavo iš konsorciumo ir kas pateikta. PHANTOM tęsiasi iki 2027 m. liepos, Japonijos projektas prasidėjo šiemet, LHCb savaitę finansavo ministerija, „Go Vilnius“, rėmėjai ir dalyviai.
417 tūkst. EUR – keturių eilučių su žinomomis sumomis suma (197 + 100 + 100 + 20); PHANTOM ir „Penta-Charm“ sumos skirtos visam projekto laikotarpiui, ne vieniems metams.
[PATIKSLINTI: PHANTOM suma (197 tūkst. EUR) paimta iš dotacijos sutarties; ar rodyti ją viešai.]
[PATIKSLINTI: LDFK 2026 m. lėšos grupei; LHCb savaitės galutinis biudžetas, rėmėjų ir dalyvio mokesčių sumos (galutinė sąmata – privačiame apraše); VU edukacinės iniciatyvos suma; ERC paraiškų tipai ir sprendimų datos; ar rodyti LMT stažuotes ir stipendijas studentams.]
Šaltiniai: PHANTOM dotacijos sutartis (projektas 101244743); grupės pasitarimų skaidrės (2026 01 13, 2026 04 14, 2026 10 14); pranešimas Lietuvos ambasadoje Tokijuje (2026 11 18); VU edukacinės iniciatyvos ataskaita (2026 10 28).
(~0,8 min)
-->

---

<div class="kick">Sklaida</div>

# Dėstymas ir sklaida

<div class="g3 stretch">
  <div class="panel">
    <h3>Dėstymas</h3>
    <div class="kpi"><div class="n">140<small>studentų</small></div></div>
    <ul style="margin-top: 0.4rem">
      <li>„CERN duomenų analizės metodai“: Fizikos fakultetas ir Verslo mokykla</li>
      <li>16 paskaitų, 1 231 skaidrė, 15 seminarų</li>
      <li>Visa medžiaga atvira</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Mokykloms</h3>
    <ul>
      <li>Antroji LHCb meistriškumo pamoka, vasario 26 d.</li>
      <li>„Užsikrauk karjerai“: tiesioginė transliacija 9–12 klasėms („Delfi“, „Junior Achievement“)</li>
      <li>33 Kauno mokyklų vadovų vizitas CERN</li>
      <li>„Physics in Advent“</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Visuomenei ir verslui</h3>
    <ul>
      <li>„Innoday 2026“: CERN technologijos ir Lietuvos įmonės</li>
      <li>Skeptikų draugija, „EditAI“, „Yaga“, „World of Particles“</li>
      <li>„Mokslo sriuba“: nauja dalelė LHCb</li>
      <li>Tinklalaidė „Prie knygų“ (Augustas)</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.8rem">
  <strong>Pripažinimas.</strong> VU apdovanojimas už indėlį į atvirąjį mokslą (2025 m. gruodis); 2026 m. konkurso pristatymas „Opening LHCb's data“ spalio 21 d. <span class="todo">[PATIKSLINTI: 2026 m. konkurso rezultatas]</span>
</div>

<!-- facts: lhcb-masterclass-vilnius-2026, vu-open-science-award-2025, vu-open-science-awards-2026-event -->

<!--
Kalbėtojui. Dėstymas ir sklaida. Dalykas „CERN duomenų analizės metodai“ per metus dėstytas trijuose semestruose dviejuose padaliniuose; visa medžiaga vieša. Mokykloms – antroji LHCb meistriškumo pamoka ir „Užsikrauk karjerai“ transliacija. Verslui – „Innoday 2026“.
[PATIKSLINTI: meistriškumo pamokos dalyvių skaičius; „Physics in Advent“ 2025–2026 m. dalyviai; viešų paskaitų sąrašas (čia – pagal pranešimų archyvą: 04 28 „EditAI“, 05 11 Skeptikų draugija, 07 18 „Yaga“, 09 10 „World of Particles“, 10 23 „Innoday“, 10 26 „Užsikrauk karjerai“).]
Šaltiniai: VU edukacinės iniciatyvos ataskaita (2026 10 28); indico.cern.ch/event/1648092; ff.vu.lt (2025 12 18); biblioteka.vu.lt (2026 10); Fizikos fakulteto žiniasklaidos suvestinė.
(~0,8 min)
-->

---
class: full
---

<div class="kick">Perspektyvos</div>

# 2027 m.

<div class="g3 stretch">
  <div class="panel">
    <h3>Rezultatai</h3>
    <ul>
      <li>ECC metodo straipsnis</li>
      <li>Du Run 2 straipsniai</li>
      <li>Pirmieji Run 3 rezultatai konferencijose</li>
      <li>Pirmasis bendras straipsnis su Japonijos teoretikais</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Žmonės</h3>
    <ul>
      <li>Podoktorantė Anni, doktorantė Gustė</li>
      <li>ERC sprendimai</li>
      <li>Magistrantai lieka doktorantūroje su savo temomis</li>
      <li>Olegas perima savarankišką analizės temą</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Lietuva ir CERN</h3>
    <ul>
      <li>Visateisės narystės procedūra</li>
      <li>Didesnis indėlis į LHCb: detektorius ir „Upgrade II“</li>
      <li>Trečioji LHCb meistriškumo pamoka</li>
      <li>Japonijos projekto vizitai ir antrasis susitikimas</li>
    </ul>
  </div>
</div>

<div class="panel" style="margin-top: 0.8rem">
  <strong>Ko reikia iš konsorciumo.</strong> <span class="todo">[PATIKSLINTI: prašymai LDFK 2027 m. – etatai, kelionės, detektorių darbai, skaičiavimo ištekliai]</span>
</div>

<!--
Kalbėtojui. 2027 m. laukiami trys straipsniai ir pirmieji Run 3 rezultatai. Atvyksta podoktorantė, spalį – trečioji doktorantė; laukiama ERC sprendimų. Tęsiasi narystės CERN procedūra.
[PATIKSLINTI: ko prašoma iš konsorciumo; ar minėti LHCb „Upgrade II“ įsipareigojimus ir M&O įnašus.]
Šaltiniai: grupės pasitarimo skaidrės (2026 10 14); lrt.lt/en (2026 09 20).
(~1 min)
-->

---

<div class="cover-rep">
  <div class="t">Ačiū</div>
  <div class="s">LHCb Vilnius</div>
  <div class="w">lhcb-vilnius.web.cern.ch</div>
  <div class="tiny" style="margin-top: 2.5rem">LHCb savaitės filmas ir jo kadrai: Nebula Moments (Rimantas Unkevičius). Nagojos darbo seminaro nuotrauka: seminaro organizatoriai.</div>
</div>

<!--
Kalbėtojui. Padėka konsorciumui ir klausimai.
Šaltiniai: nėra, pabaigos skaidrė; vaizdų autoriai nurodyti skaidrėje.
(~0,2 min)
-->
