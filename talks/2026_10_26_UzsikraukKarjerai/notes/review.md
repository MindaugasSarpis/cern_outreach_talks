# Review before the filming (22 Oct 2026)

Reviewed f647983 (origin/main merged into the branch; the talk's files as deployed in acc0993). Notes fixes in
0787501. The owner, through the Scheduler: a careful review of the deployed deck as it will be filmed (Delfi,
26 Oct, 1080p50, the slides on a screen behind him, he clicks). Findings go to him first; nothing he sees on
screen changes until he says which.

## Checks run

| Check | Result |
| ---- | ---- |
| `talk ready` (f647983) | passed, nothing skipped: lint --release, check, shots (23), pages, preflight, venue --dry-run, plates, safe; pptx skipped (no PPTX, owner) |
| `talk lint` | 0 errors, 4 warnings (three optional slots on 14, „Ačiū“) |
| `talk facts check` | 0 errors; the 85 facts the deck cites: 76 confirmed, 9 corrected, all checked since 7 Oct |
| `talk safe` (TV safe box, 37 px floor) | ok; WebGL labels are not measured: slide 22's two names are about 36 canvas px |
| live walk (pages_check, the Pages URL) | 23/23, nothing failed |
| shots, every click of 3, 9–14, 17, 22 | no overflow, no page errors; „13,8 mlrd. metų“ (3) and „100 m“ (9) appear after the settle, not shot |
| clips wait for the press | slides 4, 5, 6, 8, 16, 20: still on their slide 5 s after `ended`, WebGL on and with WebGL and WebGL2 disabled in Chromium (fallback `no-webgl2`); the live URL in the fallback too |
| timing (120 words/min) | 12:26 scripted without the slots; 15–25 % over on camera (20 Oct) → about 14:15–15:15, with the three slots about 15:00–16:00 |

## Sound (EBU R128)

The LHCb reel (slide 8, level 1): −16,0 LUFS integrated, short-term −18,7 to −12,9 (loudest about 23 s in, after
the planned speech), sample peak −2,2 dBFS. The tunnel (slide 5, level 0,5): −18,0 LUFS in the file, about −24
heard, a hum under speech; peak −6,2 dBFS. Slides 4, 6, 16, 20: no audio track. The collision's swell, thump and
drone on slide 9 are synthesised (30–60 Hz, compressed), so no file to measure: check them at Delfi's sound check
(a broadcast high-pass may take them out).

## Fallback

The stills under the plates were from 18 Oct (the 20-slide deck): 15 and 19 showed other slides' worlds, 21–23 had
none (404). Re-rendered for all 23 slides (`slidev-stage-shots --stills`). Each clip slide's plate is requested
and 404s (no plate for a clip slide): console noise only.

## Visual findings (for the owner; none applied)

1. Slide 20, the tape robot: the slot stripes moiré on camera and block at stream bitrate; the robot ~10 % of the frame (high). Fix: drop it (also a timing cut).
2. Slide 10, click 2: the marked column turns bright white under the gold tick and the 3 500 dots dim to haze, so „Kauburio nebeliko“ looks like a peak (high, meaning). Fix: click 2 `th2: 1` (no mark); `th2` size 1.955 → 2.6, alpha 0.85 → 0.95.
3. The lower third: every readout sits at y 61–74 % (`--kk-floor` 150 px); a speaker in front of the screen hides it if he stands left or centre (high if so). Fix: `--kk-floor` 240 px, or he stands screen-right.
4. Slide 9: „mln. per sekundę“ across the wireframe and beam glow; the wireframe and floor grid moiré (medium). Fix: the glow readout top-left, unit 0,4 em.
5. Slide 3: mesh rings, floor grid, grains and bloom stack; the age lands on the grid (medium). Fix: the age top-left; the floor grid at half brightness.
6. Slide 22: the two WebGL names ~36 px, soft; their dots look like the gold clouds (medium). Fix: `labelH` 0,1 → 0,11; a pointing sentence in the notes.
7. Slide 1: „LHCb Vilnius“ touches the five-quark form (medium). Fix: the name line on three lines.
8. Slide 15: the route head's bloom washes out Vilnius (medium). Fix: dim 0,3 → 0,4.
9. Slides 17–19: the blue filament web means nothing; „1 TB“ labels a 12 px sphere (medium). Fix: `vault: 0`; a pointing sentence.
10. Slide 14: the route's head glow touches CERN (click 0), Glazgas, Bona and Vilnius as it arrives (low–medium). Fix: four label nudges.
11. Slide 11: the five ticks thin at `tickAlpha` 0,4 (low). Fix: 0,7, `tickSize` 3.
12. Slide 5: „LHC“ light blue on the tunnel's grey (low). Fix: white.
13. Slides 18–19: „Atvirieji LHCb duomenys“ wraps; „4000 TB“ without a space; „Visi“ a word that is not a name (low).
14. Slide 2: a grey-blue haze at a third of the frame (low). Keep it short.
15. Slide 13: the 140-dot strip may vanish on the stream (low; its smallness is the point). Notes pointer.

## Applied (notes only, 0787501)

- 4: the hedge spoken: „Tai CERN prie Ženevos – didžiausia pasaulyje dalelių fizikos laboratorija.“ (`cern-largest-particle-physics-lab` cited).
- 6–7: one bunch crossing, not one collision („Štai kaip jie susiduria.“, „tikras dviejų protonų paketų susidūrimas“); CMS „vienas iš keturių didžiųjų šio greitintuvo detektorių“.
- 8: „Šiame eksperimente dirba …“ (members, not people at the detector).
- 9: „Kai greitintuvas veikia, …“ (LS3 since 29 June); „skrieja pro … užfiksuoja“.
- 16: the light injection calibrates the light sensors, not the fibres; „Mūsų grupė dirba ir prie …“.
- 17: the repeat „Šiais metais atverta dar daugiau.“ cut (18 says it).
- 20: LHC experiments' data, not all CERN's; „Juostų ten …“.
- 22: „Jos laukia tavęs.“ cut (a slogan).
- 1, 3, 6, 10, 19: smaller wording fixes.

## After the owner's word (22 Oct, night)

"There might have been this rule about no captions, now the histogram slides are totally without context", then
"Focus on story telling take or add anything you need …" and "finish the talk to completion deploy, make zip
availabe". Applied: findings 1 (slide 20 dropped), 2, 4–8, 11, 12, 13 (the caption on one line; „4000“ left as
Count groups only from 10 000), 9's pointer (not `vault: 0`), 10 not changed (the names read on every click);
labels on 10–13; timing cuts 1–5 (not 6). Not changed: 3 (where he stands: Status), 14, 15 (a notes pointer).
Commits 7713925, 7552141, 61f2d6c, 1697a98, 3489ef5; the venue zip from 3489ef5.

## Timing cuts (proposed, least loss first)

1. Slide 8: → about 3 s after „Aš – vienas iš jų.“, not at the reel's end (−18 s, no edit).
2. Slide 20 whole (−19,5 s); 19's bridge „O saugomi jie štai kur.“ → „O štai ką su atviraisiais duomenimis padarė vienas mūsų studentas.“
3. Slide 21: the Brown preprint sentence (−7 s).
4. Slide 22: „Beje, pirmieji vieši LHCb failai …“ (−5 s).
5. Slide 10: „Iš šimto keturiasdešimties taškų tikros dalelės nuo atsitiktinumo neatskirsi.“ (−4 s).
6. Slide 18 whole (−16,5 s; medium loss).
1–5 save about 54 s: delivered with the slots, about 14:00–15:00.

---

# Review of the 15 Oct round

- HEAD reviewed: db8e2abd9fadefb4cb0c83519ca1c7e60e2c8ccd (snapshot the same; the tree was clean).
  The next review's `since` is this HEAD.
- Facts lens since 2bc8262254783b59d8865a9fb2a77d89e748a5f3 (the deck before the round).
- Workflow `talk-review`, lenses facts, copy, unslop, perf, state (lang lt, duration 12, venue);
  plus a visual review of the contact sheet (17 shots, SwiftShader) by a subagent.
- Fixes are in 43c5db8.

## Kept and applied

| Slide | Kind | Finding | Fix |
|---|---|---|---|
| all | state | print, PDF and reduced-motion stills were the old 15-slide deck's | stills 01–17 retaken |
| 4 | fact | „vienas … susidūrimas“ over a crossing of 19 collisions | „tą akimirką iš karto susidūrė devyniolika protonų porų“ |
| 7 | rigour | no precise backup for „dalelė iš penkių kvarkų“ | an „If asked“ line: four quarks and an antiquark |
| 10 | state | the overview grid applied the slide's Grains at its last click (peaks lit early) | Grains.vue steers only in the slide and presenter contexts |
| 10 | state | a click before the 20 s fill ended restarted the fill | the same share already filling runs on; the marks light when it ends |
| 11 | rigour | 5σ said as the chance that this bump is a fluke | the chance that background alone makes such a bump |
| 11 | rigour | „4,6 sigmos, bet … išnyko“ right after 5σ reads as the reason | „beveik tiek, kiek reikia atradimui … rėmėsi vos keliolika įvykių“ |
| 13 | language | „dvidešimt–keturiasdešimt“ cannot be read aloud | „nuo dvidešimties iki keturiasdešimties“ |
| 14 | fact | „atsisiuntė“: his thesis ran on CERN's computing | „paėmė“ |
| 14 | rigour | „16 407 skilimai“: a fit's yield at five digits (±162) | „16 400 skilimų“ (screen and the form's count) |
| 14 | slop | „ne tik fizikai“ setup | „ir studentai“ |
| 15 | fact | „kaip tai padarė Dominykas“ (download) | „tuos pačius, su kuriais dirbo Dominykas“ |
| 15 | language | the age range with a dash, an overloaded sentence | „nuo šešiolikos iki devyniolikos metų, kartu su mokytoju ar kitu suaugusiu vadovu“ |
| 6, 7, 9, 11, 15 | timing | marked short for their words | 0,8 · 0,5 · 0,7 · 0,9 · 0,8 min |

Visual review (contact sheet and 11 frames):

| Slide | Kind | Finding | Fix |
|---|---|---|---|
| 14 | meaning, overexposed | OpenData's constellation: a bubble with a white-hot core, a different symbol from the cover's | a second quintet (`pq2`) as on the cover; rise 600 grains, warm; named in the speech |
| 14 | words, illegible | the kicker „Bakalauro darbas, VU, 2026“ at 12,5 px | removed (said) |
| 14 | overexposed | the portrait's sky a white slab | `filter: brightness(0.82) contrast(1.06)` |
| 3 | illegible | „LHC 27 km“ on the tunnel's near-white wall | a radial scrim behind it in this talk's CSS (the module is shared: told the Scheduler) |
| 1 | illegible | the name line 17,9 px, dim, uppercased; the title mid blue | 22 px, sentence case, light; the title white; the form moved right |
| 7 | overexposed | a fat white tick over the bump | `tickSize` 2,2, `tickAlpha` 0,35; the trial pose one step back (dist 18) |
| 15 | meaning | a small leftover turned 26° in an empty frame | the frontal view of his plot, one step back, dim 0,35 |
| 12, 13 | layout | „Vilnius“ on its node's glow | moved up and right |
| 10 | layout | jx's axis at the left edge | jx at x −16,0; slide 11's „140 taškų“ follows |

## Not applied

- Cover „Dr.“ → „dr.“ (copy lens): the facts-and-Lithuanian review of the plan says a capital is right at the start of a standalone line, as on OpenData's and Innoday's covers.
- Slide 12 „Į LHCb aš patekau ne tiesiu keliu.“ (unslop: a road metaphor): kept, the topic sentence chosen on 8 Oct over a question bridge.
- Slide 12, an added „Net baigęs studijas dar nežinojau, kuo būsiu …“: not added, it would say something about the speaker no source holds; an optional line in the notes invites his own words.
- The lower third (visual): no banner is known for this online event.
- The route's blue and gold stops (visual, low): unchanged since v5.

## Unverified

None.
