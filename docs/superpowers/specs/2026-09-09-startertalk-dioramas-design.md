# Startertalk: the hadron space as a path of dioramas — design

Date: 2026-09-09. Supersedes the world layout of
[2026-09-09-startertalk-hadron-space-design.md](2026-09-09-startertalk-hadron-space-design.md)
(sections 2–3: date × mass × lane); the HUD, stops, scrim and slide
mechanics of that spec stay.

## 1. Why

The owner's review of the overhauled deck (2026-09-09): the world drawn
from Koppenburg's list "is not recognizable anyway and doesn't bear any
meaning"; the space should be more abstract, "going further from state
to state", and could show "how a pentaquark could look". Also: start from
the Gell-Mann and Zweig papers; add hexaquarks and the missing-neutral
problem in Σc and D*; cut text without substance; remove the remaining
AI-sounding wording.

## 2. The world

One path through the ambient particle field with seven stations, spaced
so every flight reads as travel (flights 3–5 s). The field is drawn
toward the active station (the hero's pointer-attraction uniform, aimed
at the station centre), so volume gathers around the scene in view.

| # | id | Scene | Slides |
|---|----|-------|--------|
| 1 | `paper` | Page 1 of Zweig, CERN-TH-401 (CDS, public) as a lit sheet; Gell-Mann's "(qqq), (qqqqq̄)" sentence as glowing type beside it; five quark spheres drift into one cluster | cover, 1964 |
| 2 | `theta` | A hollow ring that dims as the camera nears: Θ⁺(1540), not confirmed | 2003 (stop) |
| 3 | `decay` | Λb⁰ → J/ψ p K⁻ as three glowing tracks from one vertex; the Pc node bright on the J/ψ p branch; the Λ* path faint beside it; a slow pulse along the tracks | Λb decay, amplitude analysis |
| 4 | `states` | The eight pentaquarks as spheres on a local mass axis; Σc D̄, Σc D̄*, Ξc D̄, Ξc D̄* thresholds as translucent planes | 2015, 2019, thresholds, strange partners (nine stops) |
| 5 | `interiors` | Two large models side by side: a Σc D̄ molecule (two quark clusters ≈ 2 fm apart, a faint exchange glow between them) and a compact five-quark ball; the camera orbits them | section, molecule, compact, cusp, table |
| 6 | `neutrals` | Λb⁰ → Σc⁺ D̄*⁰ K⁻ as tracks, with the π⁰ from Σc⁺ → Λc⁺ π⁰ and the π⁰/γ from D̄*⁰ dashed and fading; a six-quark cluster beside it | missing neutrals, six quarks |
| 7 | `future` | An empty lit region, the grid running out | Run 3 section, luminosity, programme, close |

Koppenburg's other hadrons are not drawn. His credit stays on the
references backup (the state records still quote his list for dates).

## 3. Data and code

- `public/data/space.json` (new; hand-written, committed): stations with
  `id`, `pos`, `look` (default camera offset) and `objects[]`, each
  `{type, ...params}`. Object types: `page` (textured plane from a PNG),
  `text` (label sprite, existing `makeLabel`), `ring` (hollow marker),
  `tracks` (polyline set; per-track colour, width, `dashed`, `pulse`),
  `spheres` (state markers from `hadrons.json` ids, placed by `mass`
  along a local axis with `scale`), `planes` (threshold planes with a
  label), `cluster` (n quark spheres in a ball, colours by flavour),
  `molecule` (two clusters + link glow). No other types.
- `components/hadron-space/space.js`: `createSpace` builds the stations
  from `space.json`; one builder per object type in a new module
  `components/hadron-space/dioramas.js` so `space.js` keeps the field,
  camera and API. The date/mass/lane layout, floor grid and axis labels
  go. `setPose({at})` accepts a station id (camera at the station's
  `look`), a state id (as now, resolved to its sphere in `states`) or
  `[x, y, z]`. `setStop(id)` unchanged. New: the field attraction target
  follows the active station.
- `components/HadronSpace.vue`: fetches both `hadrons.json` and
  `space.json`; passes both to `createSpace`. Scrim, `dim`, `asof`, HUD,
  `see` unchanged.
- `scripts/hadrons.py`: keeps the eight pentaquark records (+ Θ⁺ and the
  1964 landmark for the HUD/text); the 86 LHC rows are no longer used by
  the scene and are dropped from the output to keep the file honest.
- Fallbacks unchanged: no WebGL2 float targets → static gradient.

## 4. Deck changes

- New slide 2: the paper page and the quotation, no other text on
  screen; notes carry the history.
- New slides before the Run 3 section: "Where the neutrals go missing"
  (the Σc⁺ D̄*⁰ pair, whose thresholds the Pc states sit at, always
  loses a neutral: Σc⁺ → Λc⁺ π⁰, D̄*⁰ → D̄⁰ π⁰ or D̄⁰ γ; the charged
  channels LHCb has observed; recovery by kinematic overconstraints, as
  the group's work in progress, without numbers) and "Six quarks" (the
  deuteron as the hexaquark we know; predicted charmed dibaryons; which
  decays would show them). Sources from the literature research; every
  number cited in the notes.
- Text cuts: the Θ⁺ card, Why charm, the two strange-partner cards, the
  programme's channel lines, the related-results backup. Target: ≤ 40
  words on screen for these.
- Editorial pass over every slide and note against the owner's voice
  rules (the unslop contract): no antithesis, no fragments as slogans,
  no "X: Y" headline tics, no anthropomorphic verbs, no filler.
- Poses re-planned: every slide's `space.at` is a station id or a state
  id; stops unchanged in number and content.

## 5. Method

Ultracode: (1) research workflow (hexaquark predictions with channels;
missing-neutral recovery by kinematic constraints in b-hadron decays;
PDG branching fractions for Σc and D* modes; Zweig PDF on CDS);
(2) implementation plan (writing-plans); (3) scene and data in one
worktree, deck in the main tree; (4) fact-check workflow on the changed
slides; (5) headless screenshots at every station and stop, judged for
legibility and for plot-to-text correspondence; (6) commit.

## 6. Out of scope

Videos; changes to other talks; the theme; the WoP hero.

## 7. As built (2026-09-10)

Stations at x = 0 (paper), 16 (theta), 30 (decay), 58 (states, z = −14),
64 (interiors: molecule at −6.5, compact ball at +7), 78 (neutrals; six-quark
cluster at +10.5), 104 (future). The paper station shows the top half of
Zweig's page 1 (title, author, abstract) so the type reads at slide distance;
the quotation is on the slide (`.quote-hero`), not in the world. Solid tracks
are thin tubes (WebGL lines are one pixel); dashed "not seen" tracks stay
lines. The old 86-hadron layout, floor grid and axis labels are gone;
`hadrons.json` holds ten records. Slide 7 (the Λb decay) has no figure: the
tracks in the world are the picture, with `dim: 0.2`. Frame rule learned from
the renders: an object appears right of centre when its x exceeds the pose
target's x.
