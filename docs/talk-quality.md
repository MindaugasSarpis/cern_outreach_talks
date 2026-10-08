# Talk quality

The checklist every talk in this repo is held to, for working by hand and for
agents. The `talk-quality` skill (`.claude/skills/talk-quality/SKILL.md`)
points here, and the workflow templates in `.claude/workflows/` repeat the
parts they need inline, because workflow subagents do not load skills.

The bar comes from the owner's feedback on the Startertalk ("Pentaquarks at
LHCb", 8–12 September 2026), the deck the owner now calls the house standard,
and from the October talks. Where the owner said something, it is quoted as
written, typos included. The recipe that produced that deck is in
`docs/superpowers/plans/2026-09-09-startertalk-overhaul-blueprint.md` and
`docs/superpowers/specs/2026-09-09-startertalk-hadron-space-design.md` §9.

For the world itself (headmatter, poses, builders, review commands) see
[STAGE_QUICKSTART.md](STAGE_QUICKSTART.md); for devices that make a talk
spectacular, [spectacle.md](spectacle.md).

## 1. The owner's bar

Grouped the way the owner kept raising them. Each group ends with the check
that catches it before the owner has to.

### Busy or illegible (raised 6 times)

- "some issues I noticed was at some angles the screen is too busy with everything and words are difficult to make out, more importantly, the plots don't immediately correspond to the text"
- "plot from slide 14 is nice but very busy, can we review it? make it more clear?"
- "slide 16 is confusing because of the angle and we already introduced molecular and tightly bound picture"
- "slide 20 too busy, barely readable"
- "weinberg slice (8) is too busy, figure is nice, but examine it and make it readable"
- "slides 19 and 20 are nice, but can be improved, show diagrams much larger (or even make photo realistic 3d as well)"

OpenData, 8 October, on slide text: "people will not read it, I will just say
it". Slides carry the main points; the rest is in the notes.

Check: `pnpm talk lint` (more than 60 words on screen, talk CSS under 18 px).
In the shots report, `wordsOnScreen` and each text box's `fontPx`, `lumMean`
and `lumVar` (from v0.6): high variance behind body text means world detail
behind the words, so raise `dim` or move the pose. Judge every slide on the
contact sheet at projector size, not on a single full-size PNG. A figure that
needs explaining is drawn larger or split; nothing is shrunk to fit.

### Slop or marketing wording (6 times, World of Particles included)

- "Go ahead, but no sloppy wording like marketing"
- "\"The data are in the analyses are not\" and similar sounds a lot like AI"
- "These \"from the cosmos\" look a bit like a slop, I don't even use word cosmos."
- "Some slides have a lot of text without much substance, there is also some AI sloppiness still."
- "Do a unslip and text flow check everywhere, implement improvements"
- "is the languane non-sloppy, LHCb style? any possible improvements to the flow, story telling?"

Check: `pnpm talk lint` first (antithesis "X, not Y", banned words such as
cosmos, journey and unlock, anthropomorphic verbs, emoji, colon glosses). An
editorial pass by an agent runs only on slides that are lint-clean and changed
since the last pass. One "all clean" agent pass was followed by 38 colon
glosses found the next day, so the lint is the gate, not the agent.

### Meaning: every visual carries something (4 times)

- "the space could be a bit more substantive, maybe we don't need to fixate on p koppenburgs figure, now it's not recognizable anyway and the space doesn't bear any meaning."
- "area with slide 12 clicks in the background is totally not clear, maybe better not to put them there at all? isn't clear what they symbolize"
- "exploring and selecting Pcs (4312,4440,4457) needs to be reimagined... either we just show the 3D space, and then separately, cleanly the plots and tables or do something else, now it's confusing and doesn't serve any purpose"
- "slide 2 is nice but the background show be their images, not the paper, because we already have papers on the right."

OpenData, 7 October: a single ball per step "looked the same after zooming
out", so the piles now keep their size and the camera pulls back.

Check: section 4, rule 1 (every world object maps to a sentence on its slide)
and rule 2 (prototype a mechanic on a sparse and a dense slide first).

### Rigour: introduce before use (6 times)

- "before slide 11 need a rigorous introduction what a dalitz plot is"
- "what does it mean \"it decays through the seed?\""
- "if it's a cusp.. it's not a particle?"
- "the backup slide of what a peak can be should be with the cusp (probably before the argand and the animation) and thoroughly introduce these. This is nice"
- "Implement weinbergs stability criteria somewhere, maybe where we do one hadron or two"
- "b and c subscriots"

Check: for every slide, ask "which term or plot on this slide has not been
introduced yet?" (a review question in `talk-review`). Facts come from the
bank with sources (section 5). Notation is checked against the style rules.

### Wow (6 times)

- "Has to look really good, like apple keynote intro, has to have enough content for LHCb startertalk"
- "Make sure it's really cool, maybe there is something interactive we can do? Like the really nice landing page. Surprise me"
- "improve the background and visuals, make them \"photorealistic\" and less cartoonish"
- "the cover slide we can still overhaull now it looks good but quite simple, make it really flashy maybe pentaquark appearing somehow or something. More details"
- "The first slide is super nice but The Pentaquark flickers, with all quarks and then they fly in. If they fly in, would make sense to also only then show the border... also, can we add a low sound like for the lecture opening?"
- "the sound should be a continuous low humm"

The standing request for new talks is "super impressive like the Startertalk".

Check: the cover and the close each have an entrance (a form that gathers on
arrival, the title rising with it) and the hum. Each part of the talk has one
big move. Pick devices from [spectacle.md](spectacle.md); "content enough for
the audience" still comes first.

### Flow and order (5 times)

- "Has to be 30min talk so from gelmann and zweig"
- "Will they smoothly move from one to another?"
- "if the flow good? From theta state to one hadron or two then to poles.."
- "show the three states in the nice diagram from slide 12 click 2 along with the table, then talk about the background subtraction. Now the flow is a bit broken here"
- "Slide 8 before slide 5"

Check: `pnpm talk map` after every structural edit (number, title, clicks,
`space.at`, minutes), so the owner's "slide 14" resolves without reading the
deck. Every slide has a one-sentence message, and each message follows from
the one before. The timing gate is in section 2, step 9.

### Render bugs (4 times)

- "Zweig paper is just white"
- "The Pentaquark flickers, with all quarks and then they fly in"
- A white square where a sheet should be (a 404 path under the Pages base), and a hollow ring that read as a bug (paraphrased in commit 62db346).

Check: shots of a real build after every render or CSS change. A text box or
sheet with `lumMean` near white is an overexposure. An animated slide gets a
burst of frames (`--burst`, from v0.6), because still frames cannot show a
flicker.

### What to repeat

The owner's praise, for calibration: "Looks impressive", "Looks really good",
"The first slide is super nice", "figure is nice", "slides 19 and 20 are
nice", "This is nice". Each of these was about a slide with one dominant
picture and a short plain title.

## 2. The pipeline

Write the deck first and research only what it still needs. Innoday researched
for 28.5 minutes before a single slide existed; the Startertalk's verified
research brief was the only workflow of five that finished without losses.

| # | Step | Command or skill | Done when |
|---|---|---|---|
| 1 | Brief | `pnpm talk new`, skill `talk-new` | the Brief section of `talks/<t>/CLAUDE.md` answers audience, language, duration, venue or broadcast, must-haves, banned claims; private context sits outside git |
| 2 | Blueprint | saved workflow `talk-blueprint` for a talk that matters, else by hand | angle, arc, takeaway, a slide table whose minutes sum to the duration or less, style rules, a drop order, a Decisions log |
| 3 | Outline | `pnpm talk map` | every slide exists in `deck.md` with its title, one-sentence message (in the notes) and pose |
| 4 | Deck draft | `pnpm talk facts search <words>` | slide text and notes are written; notes cite `<!-- facts: id1, id2 -->` for numbers the bank already has, and name new ids for the rest |
| 5 | Research the gaps | skill `talk-research`, saved workflow `talk-research-gaps` | every cited id exists in `research/facts.jsonl` with verdict `confirmed` or `corrected`; the workflow's `unverified[]` is reported to the owner |
| 6 | Lint | `pnpm talk lint <t>` | exit 0 |
| 7 | Shots and contact-sheet review | `pnpm talk review <t>`, skill `talk-verify` | no overflow or page errors; a reviewer that saw the sheets and the metrics (not the main loop) reports no high finding |
| 8 | Diff-only fact check | saved workflow `talk-review` (facts lens) | only claims new or changed since the last verified run were checked (`git diff` of `deck.md`) |
| 9 | Timing gate | `pnpm talk lint <t>` (timing) | the `(~N min)` notes plus clip durations sum to no more than `duration` + 5%; each added slide names what it displaces |
| 10 | Ready | `pnpm talk ready <t>` | one exit code 0: `lint --release`, check, shots, `videos:preflight`, `venue --dry-run` |
| 11 | Deploy | `pnpm talk deploy <t>`, skill `talk-deploy` | only when the owner asked; "deployed" is said only after the Pages run is green and the talk URL returns 200 |

Two things the pipeline does not do:

- It does not re-verify facts the deck does not cite. A fact in the bank that
  was confirmed within six months and is quoted as stored is not checked
  again; a claim whose wording goes beyond the stored fact is.
- It does not read screenshots in the main context. Visual review runs in a
  subagent that gets the contact sheets, the shots metrics and the owner's
  quotes above, and returns text. The Startertalk session read 270 PNGs and
  ran out of context.

## 3. Slide rules

From the Startertalk blueprint's style rules, generalised.

1. One claim per slide. The title states it in six words or fewer, sentence
   case, declarative or a plain label. No question titles, no Title Case, no
   partial bold, no outline numbers, no cute lines.
2. At most 60 words on screen outside tables (aim for 40). A table has at most
   4 rows and 5 columns with one-line cells; an empty cell reads "none".
   Anything longer goes to the notes or a backup slide.
3. One dominant visual per content slide (a figure, a table, or the world
   itself) and at most two cards; a card or caption is at most 60ch wide.
4. The lower third of the frame stays clear on content slides; figures carry
   an explicit height and sit on one side, the world on the other.
5. Voice (English): plain, direct, precise. No em dashes in body text, no
   "X, not Y", no slogans or fragments, no idioms or superlatives, no
   anthropomorphic verbs (a fit does not "see", data do not "say"), no colon
   glosses, no emoji. Sentences, each bullet capitalised. Lithuanian decks
   follow `lt-copy`; em dashes are correct there.
6. One notation, with real subscripts and a charge on every hadron
   (P<sub>c</sub>(4312)⁺, Λ<sub>b</sub>⁰). Mixed-case names (LHCb) never sit
   in uppercased kit text without a `text-transform: none` wrapper; the kit
   uppercases the cover kicker, byline, section kicker and kickers.
7. Journal-style references (PRL, PLB, PRD, EPJC); an arXiv id only where no
   journal reference exists, never inside a sentence.
8. A number appears once on screen, at a precision that matches its error, and
   with a source: one `.src` line per slide, at most two references.
9. Type: nothing is shrunk to fit; content is cut. Projector floors on the
   980 px canvas: body and cards 20 px, nothing below 18 px outside `.src` and
   credits. Broadcast floors are higher (skill `talk-broadcast`).
10. Notes carry the spoken script, the detail and the sources, and end with the
    slide's minutes as `(~N min)`. Clip slides state the clip's duration.
11. Open checks do not live in slide notes. A `[CHECK …]` block is a warning
    during work and an error under `lint --release`; open items go under
    Figures in `talks/<t>/CLAUDE.md`.

## 4. The world

1. **Every world object maps to a sentence or a label on its slide**, or it
   is removed. The Startertalk's stops (small orbs, a fading slide, a HUD that
   repeated the slides' figures) were built, polished over four commits and
   retired because they "confused more than they explained". OpenData's
   unexplained orange nodes on three slides are the same mistake.
2. **Prototype a new world mechanic on two slides first**: one sparse and one
   data-dense. Send the owner a contact sheet with one question: "does each
   element carry meaning on the dense slide?" Roll it out only after a yes.
   The Koppenburg date-by-mass space drew "Looks impressive" on sparse slides
   and was dropped a day later on dense ones. Under the AFK protocol, build
   the two prototype slides, record the question under Decisions and wait for
   the answer before rolling out.
3. Everything in the world is made of grains. Solid shapes with labels read
   as a classroom diagram standing in the scene (Innoday's first Solar System
   was removed for this).
4. Text sits on a dimmed world: `dim` 0.6 on content slides, 0.2–0.35 where
   the picture is the world itself. The camera holds still while text is up.
5. Each talk picks its own palette and hero form in the Brief. The three
   October talks all started on `blue` with the same gold.

## 5. Numbers, sources and the facts bank

- `research/facts.jsonl` holds one claim per line: `{id, claim_en, claim_lt,
  value, unit, as_of, source_url, quote, verdict, verified_on, verified_by,
  used_in[]}`, verdict `confirmed | corrected | unverified | refuted`.
  `pnpm talk facts search <words>` before any research; `facts show <id>`,
  `facts add`, `facts check`.
- Notes cite facts as `<!-- facts: id1, id2 -->`. The lint fails on an id that
  is missing or not `confirmed`/`corrected`.
- The repo is public. The bank holds only claims with a public `source_url`.
  Anything from mail, Drive or calendars goes to the private brief
  (`~/.local/share/outreach_talks/briefs/<slug>.md`), never into git.
- Physics traps that recurred in the Startertalk: thresholds from
  charge-consistent pairs with PDG masses; the η<sub>c</sub>p / J/ψp ratio
  of about 3 holds only for the Σ<sub>c</sub>D̄ 1/2⁻ state; a cusp stays put
  between production channels while a triangle singularity moves; yields
  are "candidates"; label every stat/syst pair; check author lists against
  INSPIRE.
- Traps from the October talks: CERN made the web, not the internet; the
  touchscreen claim needs the 1965 precedent; a "first" that rests on an
  absence of records says so; a capacity figure is not data collected; Run 2
  and Run 3 energies differ; counts that change (member states, collaboration
  size) are rechecked on the day.

## 6. AFK protocol

The owner hands off and leaves ("Looks impressive I am going now…",
"complete, check and push, im going afk", "Finish and push", "upgraded plan,
go ahead, push this to completion"). Of 14 questions asked during the
Startertalk the owner took the option marked recommended 12 times, and one
question blocked a session for 109 minutes.

After the owner says "go", "finish", "afk", "continue to completion" or
anything to the same effect:

1. Never block on a question. Take the recommended option.
2. Log each choice under Decisions in `talks/<t>/CLAUDE.md`: the date, the
   decision, the alternatives, why, and how to undo it.
3. Keep going to the end of the task, including verification.
4. Finish with one message that lists the decisions taken and the open
   questions, batched, so the owner can answer them in one reply.

What AFK does not cover: pushing to main (deploy) unless the request itself
asked to push or deploy; sending mail or messages for the owner; deleting
release assets or anything else that cannot be undone; rolling out a world
mechanic the owner has not seen on a dense slide.

## 7. End of a turn

Every summary to the owner carries: the talk map rows that changed, the total
minutes against the duration, decisions taken, open questions, claims still
unverified, which commands were run to verify (with their results, failures
included), and the deploy state as `pnpm talk status <t>` reports it.
