---
name: lt-copy
description: Use when writing, translating or editing Lithuanian slide text or speaker notes in the outreach_talks repo (decks with lang lt, Lithuanian talks such as Innoday or a TV talk for schools). Glossary of settled physics and CERN terms, Lithuanian typography (quotes, decimal comma, no-break spaces, dates), and the rule that chat with the owner stays in English.
---

# Lithuanian copy

## Language of the work

- Slides and speaker notes are in Lithuanian. Everything said to the owner
  (status, questions, summaries) is in English, always. Never Russian: a
  session's status updates once drifted from Lithuanian into Russian.
- Notes are read aloud, so the `Sakyti:` lines must sound natural spoken.
  Read each sentence aloud in your head; rewrite calques from English rather
  than translating word for word.
- The owner's voice rules apply in Lithuanian too (`docs/talk-quality.md` §3):
  plain, no slogans, no superlatives, one claim per slide. Em dashes are
  correct Lithuanian punctuation; do not "unslop" them away.

## Glossary

Terms as used in the October decks. A native editor has the last word; add a
term here once it is settled, and check new ones in the state term bank
(terminai.vlkk.lt).

| English | Lithuanian |
|---|---|
| World Wide Web | pasaulinis žiniatinklis (WWW) |
| browser | naršyklė |
| touchscreen; capacitive | jutiklinis ekranas; talpinis |
| knowledge transfer | žinių perdavimas (technologijų perdavimas) |
| spin-off; start-up | atžalinė įmonė; startuolis |
| associate member state; full membership | asocijuotoji narė; visateisė narystė |
| Large Hadron Collider | Didysis hadronų greitintuvas (Didysis hadronų priešpriešinių srautų greitintuvas) |
| accelerator; beam; collision | greitintuvas; pluoštas; susidūrimas |
| superconducting magnet | superlaidusis magnetas |
| positron emission tomography; hadron therapy | pozitronų emisijos tomografija; hadronų terapija |
| luminosity | šviesis |
| charm quark; beauty quark | žavusis kvarkas; gražusis kvarkas |
| hadrons; baryons; pentaquark | hadronai; barionai; pentakvarkas |
| antimatter | antimaterija |
| CP violation | CP pažeidimas |
| collaboration (an experiment's) | kolaboracija |
| open data | atvirieji duomenys |

## Typography

- Quotes: „…“ (U+201E, U+201C), never straight "…" or English “…”.
- Decimals: a comma, `3,14`, `6,8 TeV`.
- Thousands: a thin no-break space (U+202F) or a no-break space (U+00A0):
  `12 600`, `1 844`. Never a comma or a dot, never a plain breaking space.
  Years are written plain: `2026`.
- A no-break space between a number and its unit or sign: `27 km`, `5 %`.
- Dates: `1989 m. kovo 12 d.`; a year alone `2026 m.`; ranges with an en
  dash, `2011–2015 m.`. Months in the genitive: sausio, vasario, kovo,
  balandžio, gegužės, birželio, liepos, rugpjūčio, rugsėjo, spalio,
  lapkričio, gruodžio.
- Abbreviations: `mln.`, `mlrd.`, `tūkst.`.
- No English left in the interface: Dalis (Part), Ačiū (Thank you),
  Klausimai (Questions).
- Kit text that is uppercased (cover kicker, byline, section kicker) turns
  "LHCb" into "LHCB": wrap it in a span with `text-transform: none`.
- Counters: the talk's `Count` (from v0.6 `StageCount`) formats Lithuanian
  numbers; give years the `plain` prop.

## Check

```bash
pnpm talk lint <t>     # for lang: lt also Cyrillic, English leftovers, straight quotes, decimal points, thousands spaces
```

For a full pass, the saved workflow `talk-review` with `lang: 'lt'` runs a
native-editor lens whose every edit a second editor accepts or rejects.
