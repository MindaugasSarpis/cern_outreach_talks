# Open data talk: handoff

The design notes are in the repo `CLAUDE.md`, under "Open data talk".
Toolkit pin: slidev-videos `dca4e8f` (feat/dust-fullframe), for both addons.

## Status (2026-10-08, coherence and prose rework)

Done:

- One line of argument, one sentence per slide (each slide's notes open with
  its `Message:`):
  1. Cover.
  2. Clip: this is LHCb.
  3. What LHCb is, and Vilnius in it (photo).
  4. Every collision becomes data, 4 TB a second (event display).
  5. One sphere is one terabyte.
  6. LHCb has kept 100 000 spheres.
  7. The whole LHC has stored ten times as much again (1 EB).
  8. What LHCb found in that data (76 of 86; the 2019 pentaquark peaks).
  9. 800 TB open since 2023, prepared by the speaker.
  10. Over 4 PB open since 2026, used outside LHCb.
  11. Used in Vilnius.
  12. Dominykas looks in the open data for the pentaquarks from slide 8.
  13. Thanks.
- Slide text is plain sentences: no `·` captions, no slogans. Notes are a
  spoken script under "Say:", with "Sources:" and `(~N min)`.
- Facts cited per slide as `<!-- facts: … -->`, all in the bank (feat/facts-lint)
  as confirmed.
- `duration: 6.5min`, `sources: notes` in the headmatter.
- Checks: the house lint (`talk_lint.py --release`, from feat/facts-lint) gives
  0 errors and 0 warnings, timed 6.2 of 6.5 min; `stage:check` ok; `pnpm build` ok.
- Not yet rendered. Shots wait for the render queue (Užsikrauk karjerai first)
  and Tools' Chromium fix.

Next: `pnpm talk ready opendata` when the render slot and the CLI are
available, then the visual review of the contact sheets, then the unslop pass.
Deploy only on the owner's word.

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

## Open

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

- Which award is it, and on what date? (The facts bank has VU's open science
  award: group nominations allowed, winners honoured in International Open
  Access Week, late October.)
- Was N. E. Eimutis's Z → μμ work (Open Readings, April 2024) a thesis? Until
  that is known, the notes say not to call Dominykas's thesis the first.
- Dominykas's official thesis title, defence date, data and any result.
- The opening 3D clip is a flat-shaded CAD render beside photographs. Keep it
  or replace it?
