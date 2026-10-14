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
