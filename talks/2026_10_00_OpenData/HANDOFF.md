# Open data talk: handoff

**Language: Lithuanian** (owner, 2026-10-08). Title „Atveriame LHCb duomenis“.
Slides, labels and the spoken script (`Sakyti:`) are in Lithuanian; stage
directions and these notes are in English. `lang: lt` in the headmatter; the
lint runs in Lithuanian mode. Copy rules: lt-copy (origin/feat/talk-skills),
docs/unslop-lt.md (origin/feat/unslop); never „kolaborantai“, no „įgalinti“ or
„adresuoti“.

The design notes are in the repo `CLAUDE.md`, under "Open data talk".
Toolkit pin: slidev-videos `12aa015`, for both addons.

## Status (2026-10-08): complete, pending the owner's review

- 13 slides in Lithuanian, about 6.0 of 6.5 min (lint, lang lt: 0 errors, 0
  warnings). Toolkit pin v0.5.1.
- The line: the cover; the 3D clip (advances on its end); one real Z → μμ
  collision from LHCb open data; it collapses into the 1 TB sphere; 800 TB and
  4 PB open (gold; 4 PB forms from five 800 TB piles); LHCb's 100 PB (blue);
  the exabyte (ten of LHCb's spheres merge into it); the users; Vilnius; LHCb's
  2019 pentaquark plot; Dominykas's own plot with a pentaquark rising from its
  peak; „Ačiū“ in a ring of the group's portraits made of grains.
- Reviews: visual review clean (round 7, shots v16); the final copy review
  (lt-copy + unslop-lt) applied, every overclaim on slides 11–13 removed.
  Final shots and the print stills (public/stills/, shown only in print/PDF)
  come from the final build.
- Not run: the talk-review workflow (it needs the owner's own request in the
  session; the final review ran as separate reviewer agents instead).
- Deployed 2026-10-08 on the owner's go: commit 484a430 on main, Pages run
  37834273740 (build success, deploy success). The talk's URL,
  https://mindaugassarpis.github.io/cern_outreach_talks/2026_10_00_OpenData/,
  answers 200 with the Lithuanian title; space.json, the stills, the portraits
  and the thesis plot answer too. `talk deploy` printed "not deployed" only
  because its per-talk build-job lookup does not match the new single `build`
  job (deploy.yml after f67d367); checked by hand with gh and curl.
  `ready` ran with lint skipped (not on this branch); the release lint was
  clean on the same commit.

## Decisions

- 2026-10-08. The exabyte now follows LHCb's 100 PB, and "What it finds"
  comes after it. Before, the order was 100 PB → finds → 1 EB → 800 TB.
  - Why: the camera now pulls back in one move (1 TB → 100 PB → 1 EB). The
    finds slide then answers why opening the data matters, and its pentaquark
    plot comes back on the Dominykas slide.
  - The opaque finds slide sits at the 800 TB pose, so the fly-in happens
    behind it and the camera is still when the 800 TB text appears.
  - Undo: swap slides 7 and 8 and give the finds slide back pose
    `[7.36, 0, 0]`, dist 37.5.
- 2026-10-08. Every owner-approved slide stays: the LHCb photo, the event
  display, the finds and the exabyte. The owner set this story earlier today.
  The Scheduler's shorter line (sphere → LHCb → open → users → Dominykas) is
  the spine; these slides set it up.
- 2026-10-08. On-screen text:
  - "~2 000 members" (LHCb, June 2026: "on the verge of exceeding 2000")
    replaces 1 900 members and 29 countries, which were not in the facts
    bank. "Vilnius joins 2024" is the third stat.
  - Cover kicker: "Nominated for an open data award". Subtitle: "How data from
    a detector at CERN reached a bachelor's thesis in Vilnius".
- 2026-10-08. CSS rewritten as one ordered file.
  - Colour classes on the readout: `.readout.blue`, `.readout.steel`
    (gold is the default).
  - Every sentence under a number is `.line`.
  - Type floor of 18 px: the legend 12.5 → 18, the stat labels 13 → 18 (no
    longer uppercase), the team 15 → 18.
  - Unused `.three-col` and `.world-caption.narrow` rules removed.
- 2026-10-08. Specks on the 1 EB pile: clamped the `pow()` bases in
  `metal`, `metalHard`, `heap` and the vertex `lit` term to [0, 1]. A unit dot
  product can pass 1 by rounding, and `pow` of a negative base is NaN in GLSL.
  Not yet confirmed on a render.

- 2026-10-08. Unslop pass (unslop 1.8.4, check mode, on `talk_copy.py`'s copy
  packet; house voice wins). Fixed:
  - Slide 5 said "one sphere is one terabyte" three times (legend, kicker,
    line). The kicker is now "One sphere" and the line names only the
    laptop comparison.
  - Slide 4: "software decides" became "software selects".
  - Notes, slide 5: "Nothing shrinks; the camera only steps back" (a
    negative parallelism) became a positive statement.
  - Notes, slide 7: cut "Only a few scientific archives anywhere are this
    large". It is a vague claim with no source in the bank (gap: the
    ECMWF comparison, unsourced).
  - Notes, slide 8: "finds new things" became "finds new particles".
  - Notes, slide 9: the vague "until a few years ago only LHCb's members could
    use this data" became the 2022 first release of 200 TB
    (`lhcb-open-data-first-release-2022`).
  - Notes, slide 12: "the stream I am proudest of" was a feeling the speaker
    never stated. It became "the last stream goes to one student".
  - Slide 10's line: "get a file of the collisions that contain it" (the
    service returns a file, an ntuple).
  - Left as they are: the counted numbers in place of slide titles (the
    deck's chosen style; the kickers carry the storyline) and the deliberate
    callback "Remember this plot; it comes back at the end".

- 2026-10-08. Screenshot review rounds (shots v9 to v12, a subagent on contact sheets):
  - The specks on the 1 EB pile came from `vF`, a varying: a settled sphere's
    1.0 could arrive as 0.99999. The shader then cut that sphere round
    (holes) and mixed in its dark mirror. Found with a debug build that
    painted NaN red (none) and unsettled spheres green (scattered over both
    piles 30 s after arrival). Settled is now `vF > 0.995`.
    - Two earlier guesses changed nothing visible: tiny flyers taking the
      pile's shading, and 1e-6 floors on pow() bases. Both are kept as harmless.
  - Streams take `label`, drawn beside each end cloud. The Vilnius ends are
    stacked in the list's order, right of a list capped at 52 %.
  - The type floor is now applied to the kit (`--stage-type-min: 18px`).
    Labels are drawn at 64 px and mipmapped.
  - The single sphere's softbox has soft edges.
  - Poses: the cover is dimmed to 0.25; the 1 EB target is x 9.6, without the
    1 TB; the 4 PB target is x 4.5, showing only gold; the close is dimmed to 0.3.
- 2026-10-08. Toolkit pin `dca4e8f` (feat/dust-fullframe): clips arrive as
  dust over the whole frame. Checked on the kick-off at 0.8, 2 and 4.5 s.
- 2026-10-08. Toolkit pin `12aa015` (full-frame dust, the dark-clip fix,
  `advance-on-end`). The kick-off clip uses `advance-on-end`: the cut ends on a
  lit frame as the music fades, and the next slide is the LHCb photo the
  spoken line introduces. Undo: drop the attribute and press → by hand.

- 2026-10-08. The signature line (owner): „nuo vieno susidūrimo iki
  petabaitų“. After the clip, one real Z → μμ event from LHCb open data (CERN
  Open Data record 24506, file 00041836_00076811_1.ew.dst, entry 3795, run
  133488, event 49420610; 76 of 95 tracks, 3× transverse stretch). On the next
  slide it shrinks into one grain among many that pack into the 1 TB sphere.
  Then 800 TB and 4 PB open (gold) appear inside LHCb's 100 PB (blue) and the
  LHC's exabyte (steel). Then the finds, the users, Vilnius, Dominykas, and the
  group as portraits of grains under „Ačiū“.
  - The cavern photo and the Run 3 event-display photo were dropped; the owner
    can ask for them back.
  - The text rises after the motion (`.late` 2.6 s; `.later` 4 s on the
    collapse). The corner key is gone; the 1 TB line names the unit.
  - Dominykas: his own thesis plot (Fig. 17, sideband-subtracted m(J/ψ p),
    VU 2026, open access), inverted to light on dark, with `PeakRise` lifting a
    pentaquark out of its 4.4–4.5 GeV peak. Notes keep the thesis's framing:
    a qualitative reproduction.
  - Portraits: the members' own photos, used with permission (owner). Credit:
    „Photos: LHCb Vilnius group members, used with permission“. Margarita
    Biveinytė's photo still awaits the owner's confirmation.

## Open

- On the branch (b6b0ecc), not yet deployed: `grain` is 0.012 again (the
  tooling merge fixed the broadcast detector), and slide 5 has its print still.
  Redeploy when the Scheduler calls it.

- Specks: gone on shots v12 (confirmed on a full-resolution crop of slide 7).
- Opened directly at slide 7 (a deep link or a reload), the piles never
  appear; navigating there from earlier slides works. Cause not found yet:
  `onSlideEnter` does fire on first load (Slidev uses watchEffect).
- The 100 PB pile reads flat and matte from far (a review finding). It needs
  shader work: a rim, edge fade, specular at small sizes.
- Perspective stretch: the piles at the right edge stretch about 14 % (the
  50° lens). Fixing it needs a toolkit change that scales point sizes by the
  field of view.

## Owner questions

- Margarita Biveinytė's photo: the People page's alt text names someone else.
  It is in the „Ačiū“ ring; confirm, or say to drop it.
- The closing line names "coordinating the work in the collaboration" among
  the nominated work (the role began on 1 August 2026). Keep it only if the
  nomination covers it.
- Slide 11's and Dominykas's plots keep their published English axis labels
  and legend (accepted by the owner via the Scheduler).

- Which award is it, and on what date? (The facts bank has VU's open science
  award: group nominations allowed, winners honoured in International Open
  Access Week, late October.)
- Was N. E. Eimutis's Z → μμ work (Open Readings, April 2024) a thesis? Until
  that is known, the notes say not to call Dominykas's thesis the first.
- Dominykas's official thesis title, defence date, data and any result.
- The opening 3D clip is a flat-shaded CAD render beside photographs. Keep it
  or replace it?
