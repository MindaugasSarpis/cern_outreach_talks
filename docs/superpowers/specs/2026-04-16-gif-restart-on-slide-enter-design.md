# GIF restart on slide enter

## Problem

Slides in `talks/2026_04_28_editAI/deck.md` embed GIFs via Slidev's built-in
`layout: image`, which renders the image as a CSS `background-image`.
When the presenter navigates away and later returns to the slide, browsers
resume the cached GIF mid-loop (or show the last frame) instead of restarting
from frame 1. This breaks the "live" feel of animated plots that are core
to the pedagogy (fit convergence, CMB power spectrum build-up, etc.).

## Goal

Every time a slide that uses `layout: image` becomes active — including
revisits — the image restarts from frame 1. For static images (jpg/png),
the mechanism is invisible.

## Approach

Add a custom `image.vue` layout at `theme/layouts/image.vue` that overrides
Slidev's built-in. Slidev resolves theme layouts before built-ins, so no
deck changes are needed. All 16 existing `layout: image` slides pick up
the new behavior automatically.

The layout:

1. Renders the image as an `<img>` element (not CSS background-image) so
   the DOM node can be replaced to force a fresh decode.
2. Reads frontmatter props `image`, `backgroundSize` (default `cover`,
   matching Slidev's built-in), `backgroundPosition` (default `center`) —
   the same fields already in use — and maps them to `object-fit` /
   `object-position` on the `<img>`.
3. Imports `onSlideEnter` from `@slidev/client` and, in the callback,
   increments a local `renderKey` ref. The `<img>` has `:key="renderKey"`,
   so Vue unmounts and remounts the node on every slide entry. The
   browser treats the remounted element as a fresh request and restarts
   the GIF from frame 1.
4. Fills the slide area (`width: 100%; height: 100%`) matching the
   built-in layout's visual footprint so nothing shifts.

## Why remount-via-key

Considered and rejected:

- **Cache-bust query param (`?t=<ts>`)** — forces a network re-fetch on
  every visit. Wasteful for local assets; also adds flicker.
- **Toggle `background-image: none` then back** — unreliable across
  browsers. Safari in particular retains the cached frame.
- **Rewrite each GIF slide to inline `<img>` in markdown body** — 16
  slides of churn for no architectural gain.

Remount-via-key is the standard Vue pattern for forcing a component
reset and works reliably across Chromium/Safari/Firefox.

## Files

- **New:** `theme/layouts/image.vue` (~30 lines)
- **Unchanged:** `deck.md`, figures, all other layouts.

## Out of scope

- Inline `<img src="*.gif">` usages inside markdown bodies (there are
  none in the current deck). If added later, a separate component wrapper
  would be needed — not part of this work.
- Video restart (already handled by `VideoPlayer`).
- Preloading or syncing GIF start with slide transition animation.

## Verification

1. `pnpm dev` from `talks/2026_04_28_editAI/`.
2. Navigate to a GIF slide (e.g. slide with `gaussian.gif`). Let it play
   through once.
3. Navigate forward one slide, then back. Confirm the GIF visibly
   restarts from frame 1 rather than resuming or showing the last frame.
4. Repeat for a few GIFs on different slides.
5. Confirm static-image slides (cover, intro with `background_*.jpg`)
   still render identically — no visual regression.
