# unslop for Lithuanian talks

The unslop plugin (jlwin/unslop_ai, `unslop@unslop-ai`) knows English and
German. For a Lithuanian deck (Innoday, Užsikrauk karjerai) its levels 2 and 3
still apply, and its word lists, punctuation budget and microformats do not.
This file is the Lithuanian seed for what is missing. It is a starting list
and not yet the owner's: fold in each correction the owner makes, with one
example it has to catch and one look-alike it has to leave alone, as unslop
does for its own lists.

House rules win over unslop everywhere: `docs/talk-quality.md` and the VOICE
block of `.claude/workflows/talk-review.js` hold the owner's words; unslop is a
second opinion on top of them.

## What carries over unchanged

Language-independent, so apply them to Lithuanian slide text, notes and world
labels as written in the skill:

- Level 3 (structure): the takeaway once; the title sequence carries the
  storyline; titles name content; no formulaic opener or closer; the
  portability test; the aphoristic kicker; interpretive metadiscourse;
  phantom objections; counted lists for their own sake; preview and recap
  symmetry; significance inflation; named instead of vague references;
  realization codas and epilogues in the anecdotes (Užsikrauk karjerai's
  „Neradau.“ story).
- Level 2 (rhythm): runs of equal sentences; parataxis chains in the notes;
  decorative triads; negative parallelism; load-bearing metaphors; hedge
  stacking; false agency; staged emphasis; slogan cadence; the colon reveal;
  repeated sentence openings.
- The guardrails: no invented facts, first person, numbers or quotes; no
  staccato; no silent loss; the speaker's own rough voice stays.

## What does not carry over

- **The word lists** (`references/word-lists.md`): German and English. Use
  the seed below instead.
- **The em-dash rule.** In Lithuanian the dash (–, —) is correct punctuation
  (the house VOICE says so), so a dash is never a finding by itself. The tell
  is the *staged* dash, the Lithuanian colon reveal: „… o tada grįšime atgal
  — prie dalykų, kuriuos …“ is fine; „Ir svarbiausia — tai veikia.“ is the
  reveal.
- **Microformats.** Lithuanian has its own: decimal comma, a (thin)
  no-break space in thousands and before units and %, „…“ quotes, dates as
  „1989 m. kovo 12 d.“. The house VOICE lists them.
- **The slide register's nominal style** carries over in spirit
  („Duomenų atvėrimas“ rather than „Kaip mes atvėrėme duomenis“), but the
  house title rule (six words or fewer, sentence case, a plain label or
  claim) is the one to apply.

## Seed list: Lithuanian tells

Flag in context, as unslop does: a hit is a reason to look, not a licence to
edit. Literal, quoted and technical uses stay.

| Pattern | Typical form | Instead |
|---|---|---|
| Wide-angle opener | „Šiandieniniame sparčiai besikeičiančiame pasaulyje“, „Šiais laikais“ | open on the claim |
| Generic closer | „Apibendrinant“, „Ateitis atrodo šviesi“, „Laikas parodys“, „Viena aišku:“ | end on the last concrete line |
| Metadiscourse | „Svarbu pažymėti, kad“, „Verta paminėti“, „Kaip matome“, „Kitaip tariant“ after a clear sentence, „Tai svarbiau, nei atrodo“ | delete; the claim stands alone |
| Faux insight | „Ko dauguma nežino“, „Apie tai niekas nekalba“ | cut the setup |
| Negative parallelism | „Tai ne X, o Y“, „ne tik …, bet ir …“ as a device, „X vietoj Y“ when nobody proposed Y | the positive statement |
| Buzzwords as filler | „inovatyvus“, „unikalus“, „esminis“, „išskirtinis“, „neatsiejama dalis“, „revoliucinis“, „proveržis“ (for routine news), „holistinis“, „sinergija“, „transformacija“ | the fact behind it, or cut |
| Calques from English | „įgalinti“ (empower), „adresuoti problemą“ (address), „daryti skirtumą“ (make a difference), „dienos pabaigoje“ (at the end of the day), „tai turi prasmę“ (makes sense), „žaidimo keitiklis“ | „leisti“, „spręsti“, „keisti“, cut, „prasminga“, cut |
| Journey metaphors | „kelionė“ for a project or a career, „atveria duris“, „naujas puslapis“ | what happened |
| Load-bearing metaphors | „kertinis akmuo“, „stuburas“, „pamatas“, „širdis“ (of a system), „atsiperka“ without a measure | the criterion or number |
| False agency | „skaičiai kalba patys už save“, „duomenys pasakoja istoriją“, „vaizdas byloja“ | what the figure shows |
| The „ist real“ calque | „Iššūkis yra realus.“ | what the challenge is |
| Slogan cadence | „Mažiau žodžių. Daugiau mokslo.“ three times in a deck | one plain sentence |
| Staged emphasis | „Kiekvieną. Dieną.“, „Perskaityk dar kartą.“ | the fact that earns the weight |

## Speaker notes

The decks' notes mix English stage directions (Message, Picture, Source,
„Kalbėtojui“, „→ spausk“) with the Lithuanian script that is spoken. Judge
only the script by the prose rules, and as spoken Lithuanian: short spoken
sentences and a direct „jūs“/„tu“ are the register for a school audience,
not staccato. Stage directions, sources and `[PATIKSLINTI]` markers are not
copy.

## Is a full Lithuanian profile worth it?

Not yet as a fork of the plugin. Two Lithuanian talks are in flight, and the
structure and rhythm checks find most of what reads as generated. Keep this
file next to the talks, grow the seed list from the owner's corrections on
Innoday and Užsikrauk karjerai, and contribute it upstream as a `lt` word
list once it has held through two talks.
