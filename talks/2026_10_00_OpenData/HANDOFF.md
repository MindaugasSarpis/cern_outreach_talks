# Open data talk: handoff (2026-10-08)

The full design notes are in the repo `CLAUDE.md`, under "Open data talk".

**Toolkit pin:** slidev-videos `efacca2` (feat/broadcast), for both addons.

## Done

- The owner's story order:
  1. What LHCb is (cavern photo).
  2. 4 TB/s (event display).
  3. 1 TB → LHCb's 100 PB.
  4. What it finds (76 of 86, the 2019 fit).
  5. The LHC's exabyte.
  6. 800 TB open → 4 PB open.
  7. Uses in Vilnius → Dominykas → thanks.
- Look: black ground (`palette.bg #000206`), metal spheres, real CERN photos with their credits on the slide.
- Code-review fixes in `setup/grains.js`:
  - streams deep-link sentinel;
  - skin-only culling of standing piles;
  - ray-aligned impostors;
  - satin `HEAP` pile shading;
  - turned lattice;
  - sRGB stream colour.
- Other fixes:
  - `Grains.vue` print guard.
  - The finds slide is opaque.
  - "≠" spelled out in words.
  - Notes: timings now sum to 6.5 min, with a 5-minute cut list. The [CHECK] notes became plain notes (the notes ship in the public build).
- Verified by the v7 render (shots-v2, 1600×900, all 13 slides). Slide 04's 96 px overflow is the event display bleeding off the edge on purpose.

## Open

- **Specks on the 1 EB pile.** A few dark specks show on the steel pile (slide 8).
  - Cause: NaN in LINEUP_FRAG's tiny-sprite path (`if (tiny) …`, `pile * vShade`). A debug build that painted `isnan(pile) || isnan(vShade)` red showed about 1% of the disc red, scattered at random.
  - Next step: find the NaN source. Candidates are the `pow(1.0 - x, n)` bases in `heap()`, `metal()` and the vertex `lit` term; clamp each base to [0, 1].
  - Then rebuild and re-shoot slide 8:
    `PATH=~/micromamba/envs/outreach_talks/bin:$PATH pnpm build --base / && node <shots-v2>/bin/shots.mjs dist shots/v8 --slides 8 --size 1600x900`
- **Perspective stretch.** The piles at the right edge stretch about 14% (the 50° lens).
  - A narrower `options.fov` can't fix it: the engine sizes grains as 72/z px whatever the fov, so at 32° every grain form went 1.6× thinner and the thesis pentaquark vanished.
  - Fixing it needs a toolkit change that scales point sizes by the fov.

## Owner questions

- Was N. E. Eimutis's Z → μμ work (Open Readings, Apr 2024) a thesis? If it wasn't, "first open-data thesis" can be said aloud for Dominykas, as "as far as we know".
- The slide says "One of the largest datasets in science". CERN claims only the largest HEP archive; ECMWF is also exabyte-scale.
- The opening 3D clip is a flat-shaded CAD render, which sits oddly beside the photo realism of the rest. Keep it, or replace it?
- Which award is it, and on what date? Dominykas's official thesis title, defence date, data and result.
