# Vadovėlio gale atsakymo nėra (Užsikrauk karjerai) (talks/2026_10_26_UzsikraukKarjerai)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_26_UzsikraukKarjerai/` — „Vadovėlio gale atsakymo nėra“, an
  ~10-minute Lithuanian talk for grades 9–12 at „Užsikrauk karjerai“ (Delfi ×
  Lietuvos Junior Achievement), filmed in the Delfi studio on 26 Oct 2026
  with no audience, streamed to classrooms on 27 Oct 2026 12:00. Built for
  television on the packaged stage (same `640eaa5` pin), its own violet-gold
  palette and six talk-owned builders. See "Užsikrauk karjerai" below.

### Užsikrauk karjerai (2026_10_26_UzsikraukKarjerai)

One thread in three parts, 17 slides, about 10 minutes (reworked
2026-10-08 after the owner rejected a 31-slide, committee-written first
version: "too many slides, AI-sounding statements, storytelling off"):
I. the question nobody can answer yet (why matter survived: one in a
billion), then where it is asked (the LHC, LHCb); II. what working on such a
question looks like: one particle followed from idea (1964) to false find
(2003), retraction (2008) and discovery (2015), then the speaker's own
search for three of them, which ended in „Neradau.“, why that still counts,
and the open data; III. what it has to do with the viewer: his crooked
route across Europe, his own 2022 plans slide, back to the open question
(galaxy), and one task for the week. Slide text is only numbers, years, a
URL, his word „Neradau.“ and the closing question: no slogan cards. The
full spoken script, timings, public sources and [PATIKSLINTI] items are in
the notes.

- **Television rules** (research 2026-10-07; from the event's past
  recordings and broadcast standards): Delfi/LJA showed slides squeezed to about two-thirds
  of the frame in past editions and stream at ~2.5 Mbps, watched on classroom
  projectors. So `styles/index.css` sets readable text ≥ 49 px on the 980
  canvas (96 px at 1080p), big lines 58–80 px, numbers 130 px, all inside
  x 98–882 / y 55–408 and out of the logo/name-super corners; the headmatter
  turns off film grain, aberration, halos and sound and sets fewer, bigger
  dust grains, a low nebula and slower flights (`options: { grain: 0,
  aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom:
  0.45, flight: [2.5, 5] }`); the grains' twinkle is slow and shallow. Laptop
  output 1920×1080 at 50 Hz. No full-frame flashes (ITU-R BT.1702).
- **Stations** (one axis, 300 apart, so only one is ever in frame): `origin`
  (hero; `pairs`), `collider`, `quarks` (`quintet`), `search` (`ghost` with a
  haystack, `streams` `phantom`), `europe` (`map`, `path` `route`: Vilnius →
  CERN → Vilnius → Glasgow → Vilnius → Heidelberg → Bonn → Vilnius; pose
  `whole`), `cosmos` (`galaxy`; pose `close`). `stage.options.reach: 22`.
- **Talk-owned builders** (`setup/grains.js`, `stage:check --types
  path,streams,pairs,ghost,map,quintet`), all driven by `<Grains :set>`:
  - `pairs` — matter (gold) and antimatter (blue): 1 the hot cloud forms, 2 the
    pairs meet and go out as light (outer first; brightness only falls), 3 the
    remainder gathers into a knot. Forward one step plays it, anything else
    shows the step settled; an arrival from elsewhere (or `c`) replays up to
    the current step unless a step started under 5 s ago.
  - `quintet` — five clusters joined by flowing strings; per-step `{ hold,
    light }`: idea (scattered), claim (half-held, dim), retraction (scattered),
    discovery (held, bright).
  - `ghost` — faint clusters that come together and drift apart, never
    holding; `hay` adds a wide faint cloud round it; with a `name`, step 0
    hides the clusters and step 1 lets them appear (the single „Neradau.“).
  - `path` — a Catmull-Rom trail through ≤ 16 waypoints, drawn on to waypoint
    k, each leg arcing off the ground (`arc`); a waypoint at the same place as
    an earlier one relights that cluster instead of stacking a new one.
  - `map` — Europe's coastline and land borders as grains on the ground plane,
    from Natural Earth 1:50m (`scripts/make_europe.py` → `public/data/
    europe.json`; one unit = one degree of latitude, x scaled by cos 52°).
  - `streams` — OpenData's, with a per-stream `from` (many places to one).
- `setup/Count.vue` prints Lithuanian numbers: a narrow space from five digits
  up, none in years (`:group="false"`), decimal comma.
- `public/figures/planai-2022.jpg` is the speaker's own LPPM 2022 slide (p. 16
  of the public MSarpisIntro.pdf on Indico).
- Shots: `stage:shots --wait 30000` under SwiftShader.
