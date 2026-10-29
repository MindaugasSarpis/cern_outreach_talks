# Data2Peak (talks/2026_00_00_Data2Peak)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/2026-00-00-data2peak.md, never here.

## Brief

Talk 2 of 5 in the explainer series "Data analysis, the CERN way" (the
owner, 2026-10-28: "5 explainer talks (like outreach videos + cern lessons on
data analysis course). 15min each, with visual good quality, not sloppy
explainers / diagrams." "Use the latest tools."). The owner chose the series
and the defaults below in chat on 2026-10-28; no invitation exists in mail or
Drive.

- Topic: counting and noise: a peak in a histogram, Poisson fluctuations, 5 sigma, the Higgs.
- Series: the CERN lessons course's first-principles spine told through
  CERN, one idea per talk, a ladder (each talk assumes only the ones before).
  The others: 1 `Data1Trigger` (a collision becomes data); 3 `Data3Fit` (fitting a model); 4 `Data4Learn` (from a perceptron to machine learning); 5 `Data5Open` (open data and reproducibility). The series bible (with its corrections on top) is `components/data-kit/notes/series-bible.md`; the kit API is `components/data-kit/README.md`.
- Event: none yet; an explainer series. Date `2026_00_00` (placeholder).
- Duration: 15 min each (`duration: 15min`), no questions inside.
- Delivery: recorded video (`pnpm talk record`: per-slide MP4s the owner
  narrates over) and a live 16:9 deck on a projector. 1080p web tier.
- Audience: university STEM students from any field, no particle physics
  assumed (the course's audience).
- Language: English on screen and in the notes.
- On screen: pictures and numbers only (root CLAUDE.md, talk-quality §3);
  the cover keeps a plain title. The owner narrates and does not read
  notes; notes carry sources, `<!-- facts: -->` ids and `(~N min)`.
- Quality bar: "visual good quality, not sloppy explainers / diagrams":
  real data and real footage over stand-ins, one dominant picture a slide,
  every form in the world carries what the slide says.
- Look: slidev-addon-stage v0.11.0, palette `classic` (cyan `#7dd3fc` on
  near-black, the course's accent), shared by the five talks.
- Must-haves and banned claims: from the series bible; facts only from the
  bank (`pnpm talk facts search`).
- Private brief: ~/.local/share/outreach_talks/briefs/data2peak.md (nothing
  private so far).

## Status

- 2026-10-28: scaffolded on v0.11.0; `pnpm talk check data2peak` green. Next:
  the series bible (workflow), then this talk's blueprint, outline and draft.
- 2026-10-29: deck drafted (draft:data2peak): 17 slides, space.json, setup, styles;
  `talk check`, kit check, `lint` (0 warnings) and `map` (14.1 min) green, shots
  taken. Not deployed. Open: the owner's look at the sheet; notes/kit-requests.md,
  notes/facts-needed.md.
- 2026-10-29 (final:data2peak): the motion review's four high and six medium findings fixed in the
  deck (slides 1, 3, 7, 11-17; slide 8's low bloom overshoot left); the γγ clip re-trimmed to the
  source's cut (4.4 s) and the room clip re-made as one dimmed shot (4.1 s), both encoded and their
  dust strips cut. Re-recorded takes 1, 3, 7, 11-17 at 1280x720/25 fps
  (scratchpad decks/data2peak/rec-final); `talk check`, kit check.mjs (0 errors, 0 warnings),
  `talk lint` (0/0, exit 0) green. `talk map`: 17 slides, 13.9 min timed (13.8 min of notes + 8.5 s
  of clips) against the 15 min headmatter. Measured on the new takes (luma, 25 fps): the close opens
  at 41 and never rises above slide 16's held frame (46; was a flare to 90), with one dark frame at
  0.04 s; the γγ clip's largest frame step 1.9 (was 38); every picture stands within 0.8-2.5 s of its
  cut (slide 7 at frame 0, was 6.8 s; slide 3 lands at about 2.8 s, was 6.6 s). Not deployed, not
  published. Open: six new kit-requests (a timed path's station assembling at its last key, dk-vertex
  timings, a dk-hist glow gain, the first frame's ambient, dk-curve's glide on a rescale, the videos
  addon's one dark frame on a dust leave); slide 14's click still glows about +6 luma over its 2.4 s
  pour and slide 13's refill +3 (one frame +3.0), both waiting on the glow gain; the cover's first
  0.3 s still eases from luma 21.7 to 19.6 (the engine's first frame); slide 8's low finding (not
  touched); notes/facts-needed.md (four claims, none on screen). Next: the owner's look at the takes, then
  `pnpm talk record data2peak` for the full set and `pnpm talk deploy data2peak` when he says so.
- Branch `talk/data2peak`, worktree `.claude/worktrees/data2peak` (`pnpm talk open data2peak`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_00_00_Data2Peak/
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/data2peak.json`; `pnpm talk status` shows it.

## Arc

One line per slide: what it shows, what is said, how long. From `deck.md` (draft
29 Oct, draft:data2peak, then fix:data2peak; the outline's slide 16 dropped by the owner's
decision): 13.8 min of notes + 13.0 s of clips = 14.0 min. Cuts between stations. The
numbers stand at the top left on every slide (the lower third stays clear). Since final:data2peak
(29 Oct): 13.8 min of notes + 8.5 s of clips = 13.9 min; each picture stands within about 1-2.5 s
of its cut and its numbers come after it (notes/outline.md, Decisions 21).

1. Cover: talk 1's settled pile of 91 583, our grain ringed on the summit, title "Counting"; the rows became this pile, today we count them (0.5).
2. One decay alone (decay station): a short-lived particle flies and splits into two unnamed strands, no number; angles simulated (0.6).
3. The landing (floor): our grain lifts off the pile (now behind the axis, a source), splits, folds into one grain on the empty axis by about 3 s (the world at 1.6x), `1 880.6 MeV/c²`; two tracks make one number, the mass of the pair (0.8).
4. The first 1 000: grains leap from the pile into 2 MeV bins, `1 000 candidates`; a histogram is counting (0.5).
5. All 91 583: the peak stands over flat shoulders, `91 583 candidates` (0.8).
6. Fourteen flat bins: the ragged tops of 1 816-1 844 framed close, a light-blue mean line, `1 461 mean`; click: the ±38 lines, `38 √N` (1.2).
7. Re-rolled (roll station): the same 14 bins standing from the cut, re-drawn 24 times (the first at about 1.2 s, then every 3 s) inside the light-blue ±√N band, a crane in to the tops at 8-12 s, `24 re-rolls`, `2.6 % √N / N` (1.3).
8. The normal tail (bell): 300 000 grains, the front to 1 σ, click to 3 σ, `300 000 grains`, `405 grains beyond 3 σ`; σ and the p-value (1.2).
9. Five sigma, the hush: the front at 5 σ, nothing lights, the world stops, `5 σ`, `0 grains beyond` (0.5).
10. The empty tail: the tail 54× taller dies out before 5, `1 in 3 500 000 chance` (0.5).
11. Twenty rolls of noise (look): the falling toy re-rolled 20 times over its expected line, the alarm bin wandering, `20 rolls`, `7 alarms`, `2.5 σ largest` (1.0).
12. Grown to 3 500: roll 2's white bin, click: 3 360 more entries, the bin sinks to `1.1 σ`; the 2003 false alarm narrated (1.2).
13. Window and side bands (floor): the cut to three bands, the window a softer white, a light-blue background line across it, our grain gone with the dust, `41 090 window`, `21 077 background` (0.9).
14. In file order: the bands refill in the file's order at their own scale, a light-blue background line and the white 5 σ height across the window, `186 candidates`, `5 σ stays above`; click: the rest, both lines to the whole file's levels (0.9).
15. One Higgs-like event: the last 4.4 s of CERN's animation of a 2011 two-photon collision, from its cut to the black event view, zoomed past its burned-in label (clip + 0.5).
16. Fourth of July 2012: the auditorium applauding, one 4.1 s shot dimmed to 40 % over its last second inside the clip (clip + 0.5), `5.0 σ CMS`, `5.9 σ ATLAS`.
17. Close (talk 3's cover pose): the full peak standing, the light-blue background level and the white 5 σ height just above it across the window, click: the bare peak, no number (0.9).

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 1 880.6 MeV/c² | our row's pair mass | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-row1-values-worked` | OK |
| 1 000, 91 583 candidates | candidates in the file (slides 4, 5; 91 583 again on 14 after the click) | https://opendata.cern.ch/record/401 | 2026-10-29 | `record401-candidates-91583` | OK |
| 1 461, 38 | flat bins' mean and √N | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-flat-bins-sqrtn-worked` | OK |
| 24, 2.6 % | simulated re-rolls, √N/N | bake/toys.py | 2026-10-29 | `d0-flat-rerolls-simulated-worked` | OK |
| 300 000, 405, 0 | bell grains beyond 3 and 5 σ | https://pdg.lbl.gov/ | 2026-10-29 | `normal-tail-300k-grains-worked` | OK |
| 5 σ, 1 in 3 500 000 | discovery line, one-sided p (slides 9, 10) | https://pdg.lbl.gov/ | 2026-10-29 | `five-sigma-p-value-one-sided`, `particle-physics-5-sigma-discovery` | OK |
| 20, 7, 2.5 σ | simulated falling toy alarms | bake/toys.py | 2026-10-29 | `falling-spectrum-alarm-wanders-worked` | OK |
| 140, 3 500 entries, 1.1 σ | the toy's roll before and after it grows, the same bin (slide 12) | bake/toys.py | 2026-10-29 | `falling-spectrum-alarm-wanders-worked` | OK |
| 41 090, 21 077 | window count, side-band background | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-window-5sigma-line-worked` | OK |
| 186, 5 σ | file-order count that stays above 5 σ | https://opendata.cern.ch/record/401 | 2026-10-29 | `d0-peak-5sigma-file-order-worked` | OK |
| 5.0 σ CMS, 5.9 σ ATLAS | 2012 local significances | PLB 716 (2012) 30 and 1 | 2026-10-29 | `higgs-cms-2012-5p0-sigma, higgs-atlas-2012-5p9-sigma` | OK |

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

- `setup/main.ts`: installs the data kit (`installDataKit({ app, stage })`).
- `styles/index.css`: the series `.nums` block (MasterTalk's, numbers #e8f6ff,
  units and names #9fd8ff; a hidden v-click line holds no animation, so its `--dN` runs from its
  click) and a lone cover h1 at the title's size, fading in 0.9 s after the stage assembles.
- `public/data/space.json`: stations `floor` (hero: pile, plot, vertex, spark, the
  file-order plot, the 5 σ line), `decay`, `roll`, `bell`, `look`.
- `notes/kit-requests.md`, `notes/facts-needed.md`: what the draft asks of the kit
  and the facts bank.

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-28, the owner (chat): the series "Data analysis, the CERN way",
  five 15-min explainers, STEM students, English, recorded video plus a live
  16:9 deck. All four were the recommended options.
- 2026-10-28: toolkit v0.11.0 ("use the latest tools"), pinned with
  `pnpm talk pin`; pnpm dropped `path:`/`gitHosted` from the other talks'
  toolkit tarball resolutions, so main's resolution lines were restored
  (memory: lockfile path keys after a pin). Undo: `pnpm talk pin <talk> v0.8.1`.
- 2026-10-28: palette `classic` for the whole series (the course's cyan on
  near-black; no live talk uses it; never gold). Alternative: `blue` (Tokyo's)
  or a series palette via `definePalette`.
- 2026-10-28: names `2026_00_00_Data<N><Topic>` so the five sort in series order.
- 2026-10-29, the owner (review page and chat): roll out all the kit's forms
  (prototype pairs seen as recorded takes,
  https://claude.ai/artifact/Ef62WwCznaTyo7MKcM8338); cuts between stations;
  keep the record 401 peak as the thread but never name it (no D⁰, K⁻π⁺,
  IPχ² or record numbers in Message/Picture notes or on screen; Sources keep
  the provenance); big picture only: no experiment internals (sub-detector
  and trigger-stage names, GPU counts, CMS/ATLAS analysis counts). Mass axis
  1 816-1 912 MeV (default taken: the answer to that question was "No D0").
  Undo: the series bible's top block (components/data-kit/notes/series-bible.md).
- 2026-10-29, deck draft (draft:data2peak): the deck's departures from the outline
  (slide 16 dropped, cuts between stations, the 1 816-1 912 axis, the clips' names,
  the timing, the cover title's `.name` span for the lint) are listed under
  "Decisions" in notes/outline.md.
- 2026-10-29, review fixes (fix:data2peak; outline Decisions 13-20): the γγ clip zoomed 1.25x
  past its burned-in event label and logo and cut to its last 5.6 s; the `.nums` block moved
  to the top left on every slide (talk-quality §5.4, the lower third clear); the heap moved
  behind the axis (z −11; the cover pose follows it, so talk 1's close frame is unchanged);
  curve lines carry the slides' numbers (mean and ±√N on 6, background on 13, 14, 17, the
  186-row 5 σ height on 14); the band light blue; mass captions `mass MeV/c²` on the toy.
  Undo: the commit after b8b7264.

## Verify

```bash
pnpm talk check data2peak     # videos:check, stage:check, a build into /tmp/talk-data2peak/site
pnpm talk review data2peak    # check, then shots of the changed slides and a contact sheet
pnpm talk ready data2peak     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
- 2026-10-29, motion fixes (final:data2peak; outline Decisions 21), taken under "continue to
  completion" as the review's recommended fixes: the deck shortens each slide's entrance through the
  kit's per-step `lead`/`fall`/`fill`, `glowTint: 0`, lower `alpha`/`selGain` on the toys, the world
  `rate` on slide 3 and `ambient: [[0, 0]]` on the cover, instead of changing components/data-kit
  (the four kit gaps are in notes/kit-requests.md). The roll station's centre moved 15 units behind
  its plot so slide 7's timed crane no longer delays its assembly (undo once the engine assembles a
  cut on its first key). The γγ clip starts at the source's own cut (4.4 s, not 5 s: the source ends
  at 11.32 s); the room clip is one shot from the front stairs (the review offered either shot; this
  one shows the room applauding), dimmed inside the clip, with its 2160p source kept in
  videos/src/. Undo: the commit after this one's parent.
