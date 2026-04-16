# GIF restart on slide enter + VideoPlayer control-bar width fix

Two small, related fixes to the shared media rendering in the monorepo
theme/components. Bundled because they share reviewers, test surface
(run the deck and watch), and commit cadence.

## Problem 1 — GIFs don't restart on slide revisit

Slides in `talks/2026_04_28_editAI/deck.md` embed GIFs via Slidev's
built-in `layout: image`, which renders the image as a CSS
`background-image`. When the presenter navigates away and later returns,
browsers resume the cached GIF mid-loop (or show the last frame) instead
of restarting from frame 1. This breaks the "live" feel of animated
plots that are core to the pedagogy (fit convergence, CMB power spectrum
build-up, etc.).

## Problem 2 — VideoPlayer controls bar is stuck at ~1920px

The deck canvas is 2880×1600 (9:5 venue LED wall). `VideoPlayer.vue`
sizes the `<video>` element to `100% × 100%` with `object-fit: contain`.
For a 1920×1080 source, the video image scales correctly (~2844×1600,
nearly full slide width), but Chromium renders the native media-controls
panel at the video's *intrinsic* 1920px width — so the control bar sits
centered at roughly half the slide width while the video pixels fill it.
Safari and Firefox render controls differently and don't exhibit this.

## Goals

- Every time a slide using `layout: image` becomes active (including
  revisits) the image restarts from frame 1. Static images are
  unaffected visually.
- The VideoPlayer's control bar spans the same width as the rendered
  video element in Chromium.

## Approach 1 — custom `image.vue` layout

Add `theme/layouts/image.vue` overriding Slidev's built-in. Slidev
resolves theme layouts before built-ins, so no deck changes are needed.
All 16 existing `layout: image` slides pick up the new behavior
automatically.

The layout:

1. Renders the image as an `<img>` element (not CSS background-image) so
   the DOM node can be replaced to force a fresh decode.
2. Reads frontmatter props `image`, `backgroundSize` (default `cover`,
   matching Slidev's built-in), `backgroundPosition` (default `center`)
   — the same fields already in use — and maps them to `object-fit` /
   `object-position` on the `<img>`.
3. Imports `onSlideEnter` from `@slidev/client` and, in the callback,
   increments a local `renderKey` ref. The `<img>` has
   `:key="renderKey"`, so Vue unmounts and remounts the node on every
   slide entry. The browser treats the remounted element as a fresh
   request and restarts the GIF from frame 1.
4. Fills the slide area (`width: 100%; height: 100%`) matching the
   built-in layout's visual footprint so nothing shifts.

### Why remount-via-key

Considered and rejected:

- **Cache-bust query param (`?t=<ts>`)** — forces a network re-fetch on
  every visit. Wasteful for local assets; also adds flicker.
- **Toggle `background-image: none` then back** — unreliable across
  browsers. Safari in particular retains the cached frame.
- **Rewrite each GIF slide to inline `<img>` in markdown body** — 16
  slides of churn for no architectural gain.

Remount-via-key is the standard Vue pattern for forcing a component
reset and works reliably across Chromium/Safari/Firefox.

## Approach 2 — shadow-DOM CSS override in VideoPlayer

Add an unscoped `<style>` block to `VideoPlayer.vue` targeting the
WebKit media-controls shadow-DOM pseudo-elements and forcing them to
the element's full width:

```css
video::-webkit-media-controls-enclosure,
video::-webkit-media-controls-panel {
  width: 100%;
  max-width: none;
}
```

These pseudo-elements are part of the UA shadow DOM but style-able from
normal CSS. The rule is a no-op in Firefox (no matching selector) and
a soft no-op in Safari (selector matches but the panel already sizes to
element width there). Only scopes to `<video>` inside the VideoPlayer
component by keeping the rule adjacent to the scoped block; given the
component is only used for slide-deck video, global leakage of a rule
targeting `video::-webkit-media-controls-*` is acceptable.

### Why not custom controls

Rejected: replacing native controls with a custom Vue control bar
(~100+ lines) would lose native keyboard shortcuts, picture-in-picture,
AirPlay, and the right-click context menu. The scoped CSS override is
~5 lines and preserves all native behavior.

Also rejected: wrapping `<video>` in an aspect-ratio box matching each
clip's source aspect — couples the player to per-clip dimensions,
breaks the generic "any video" abstraction.

## Files

- **New:** `theme/layouts/image.vue` (~30 lines)
- **Modified:** `components/VideoPlayer.vue` (+ ~6 lines of CSS)
- **Unchanged:** `deck.md`, figures, videos, all other layouts.

## Out of scope

- Inline `<img src="*.gif">` usages inside markdown bodies (there are
  none in the current deck). If added later, a separate component
  wrapper would be needed.
- Custom VideoPlayer controls (play/pause/seek UI rework).
- Preloading or syncing GIF start with slide transition animation.

## Verification

1. `pnpm dev` from `talks/2026_04_28_editAI/`.
2. **GIF restart:** navigate to a GIF slide (e.g. `gaussian.gif`), let
   it play through once, advance one slide, then return. Confirm the
   GIF visibly restarts from frame 1 rather than resuming or showing
   the last frame. Repeat for a few different GIFs.
3. **Static images unaffected:** confirm cover/intro slides with
   `background_*.jpg` still render identically.
4. **VideoPlayer controls:** navigate to any slide using
   `<VideoPlayer>`. Confirm the native control bar spans the full
   width of the rendered video (not centered at ~1920px). Check in
   Chrome specifically.
5. **Video playback itself unchanged:** autoplay, loop, muted,
   start-from-zero-on-slide-enter behaviors all still work.
