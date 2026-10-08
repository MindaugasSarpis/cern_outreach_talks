# Pentaquarks at LHCb (talks/2026_09_00_Startertalk)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_09_00_Startertalk/` — "Pentaquarks at LHCb", a 30-minute
  technical physics seminar. Date not fixed yet: `09_00` is a placeholder —
  rename the dir, its `videos.toml` release_tag and the deck's `videos.release` once known
  (no talk-owned clips, so no release to rename).

### From "Hadron space (Startertalk)"

The world itself (stations, `space.json` object types, the engine, slide
frontmatter) is in `components/hadron-space/CLAUDE.md`. The talk's own parts:

- `components/ArgandDiagram.vue` — the theory slide's live Breit–Wigner:
  lineshape, phase and Argand circle linked by one sweeping marker (9 s a
  pass, only while the slide is live; static under reduced motion), six
  hollow markers for the 2015 free amplitudes. `LineshapeGallery.vue` — six
  computed lineshapes (props: `only` picks panels, `detail` lays two out large with a full explanation, the three “What a peak can be” slides; the interference labels and the cusp's pole distance were corrected 2026-09-11) (Breit–Wigner, Flatté, cusp, triangle, interference at
  three phases, the Λ(1520) reflection with real Λb⁰ → J/ψ p K⁻ kinematics)
  with an Argand inset marking the phase at the peak.
- Records (`scripts/hadrons.py` → `public/data/hadrons.json`, ten states:
  eight pentaquarks, Θ⁺(1540), the 1964 landmark; `OVERRIDES` carries
  `mass_text`, `width_text`, `significance`, `channel`, `date_text`,
  `label_html`, `status_year`/`status_before`, `note_year`; dates and masses
  of LHC states from Koppenburg's list, run `--check`, `--cached` offline).
  Stop figures (`FIGURES`): `src` (cropped paper PNG from
  `scripts/fetch_figures.sh` + `crop_figures.py`), `caption` (journal-style
  source) and `see` (one sentence naming the feature in the plot that is the
  state, written against the cropped image). Zweig's page:
  `scripts/fetch_zweig.sh` (CDS record 352337; download in a browser, CDS
  blocks scripts) → `public/figures/papers/zweig_th401_p1(_top).png`.
- Deck CSS (`styles/index.css`): Space Grotesk throughout, h1 42 px, card
  and caption text 20 px, tables 19 px (15 px on `class: backup` slides; the
  five-column comparison `table.cmp` and the `wide-table` backup wrap their cells),
  one `.src` footer line per slide; `.row` + `.col-40…60` place a figure on
  one side and ≤ 60ch of text on the other, `.stage` caps content height;
  `.quote-hero` (the 1964 slide; `.wide` for the 1992 quote), `.quote-line`
  (the 2006 quote), `.decay-caption` and `.world-caption` (slides whose
  picture is the world), `.plate` (a diagram on a card-like ground),
  `.checklist` (the "not every bump" slide, 18 px), `.refs` (the two
  references backups: three columns of one-line entries, each a link: APS by
  DOI, arXiv ids to arXiv, the rest an INSPIRE journal lookup), `.ol` and
  `.ol.cap` (a drawn bar for p̄ and Λ̄: Space Grotesk sets the combining macron
  beside a p; the HUD formatter emits `.ol` for p̄). Slides are
  transparent, cards translucent. No WebGL2 float targets → static gradient;
  overview/PDF have no world.
- Koppenburg's list is credited on the references backup and in the notes,
  not on the cover or the close (owner's call, 2026-09-10).
- Overhaul record (2026-09-09/10): critiques, blueprint, research brief and
  decisions in `docs/superpowers/plans/2026-09-09-startertalk-*.md`.
- Verify with headless Chromium (SwiftShader) screenshots: `pnpm talk shots
  startertalk` builds into /tmp and shoots into the talk's `shots/`
  (`--slides 3-5`, `--clicks '{"9":3}'`); it renders slowly, so it waits
  ~9 s after a click (`--click-wait`) before shooting a stop.
