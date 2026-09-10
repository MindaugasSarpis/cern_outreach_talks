# Startertalk hadron space: rendering upgrade and the cover assembly

Date: 2026-09-11. Owner's brief: "make the background and visuals photorealistic,
less cartoonish"; "the cover: make it flashy, the pentaquark appearing somehow,
more detail". Route chosen (2026-09-11): rendering upgrade on the existing
geometry, with better geometry where it clearly helps; the cover gets an
assembly animation. Builds on `2026-09-09-startertalk-dioramas-design.md`
(stations, HUD, stops, scrim), which still governs layout and behaviour.

## 1. Rendering chain (`components/hadron-space/space.js`)

- The renderer becomes opaque (`alpha: false`, clear `#050507`) and draws the
  page gradient itself: a screen-space quad behind everything with the two
  radial glows the CSS had. The CSS gradient stays as the static fallback.
- `EffectComposer`: RenderPass → UnrealBloomPass (threshold 0.72, strength
  0.8, radius 0.55) → a finish pass (vignette, a touch of chromatic
  aberration at the edges, film grain) → SMAAPass → OutputPass.
  ACES filmic tone mapping, exposure 1.05, sRGB output through OutputPass.
- Lights: a hemisphere light (sky `#7dd3fc` over ground `#0a0c14`), a key
  directional light from upper left, and a fill point light that sits at the
  camera's look target so whatever the slide looks at is lit. A
  `RoomEnvironment` PMREM as `scene.environment` at low intensity gives the
  glossy materials something to reflect.
- Fake depth of field on the dust: the field shader takes `uFocus` (the
  camera-to-target distance); grains far from the focus distance draw bigger
  and fainter. No depth-buffer DoF: the world is mostly additive and
  transparent, which the depth buffer does not see.
- Resolution: the drawing buffer is capped at 2560 px wide (about half
  resolution at 4K) so bloom and SMAA hold 60 fps on a laptop GPU; SMAA and
  the browser's upscale keep edges clean. The frame-rate guard steps the
  composer's pixel ratio with the renderer's.
- Shadows: none. Nothing in the world would receive one but the page and the
  grid.

## 2. Materials (`components/hadron-space/dioramas.js`)

- Quark balls and state markers become marbles: `MeshPhysicalMaterial`,
  clearcoat, low roughness, the flavour colour with a faint emissive core so
  bloom lifts it, environment reflections. A thin fresnel rim shell stays
  around each for the glow. Unestablished states: the same marble at a third
  of the light and half opacity. The Θ⁺ ghost keeps the translucent fresnel
  orbs: transparency is its meaning.
- Decay tubes: lit `MeshStandardMaterial` with an emissive of the track colour,
  slightly thicker; vertices are marbles. The additive glow lines stay.
- The Zweig page: a lit paper (`MeshStandardMaterial`, rough) so the key light
  falls across it.
- Shells (bubbles), strings, haze and the dust: unchanged geometry; bloom does
  the rest.

## 3. The cover assembly (hero station, `build.pentaquark`)

- On arrival at the hero station (first load, and every flight that lands
  there: the cover and the close) the five quarks start scattered 10–16 units
  out in the dust and fly in on curved paths over 3 s (smootherstep), each
  leaving a short trail of grains; the strings and the boundary haze fade in
  with the assembly; when the last quark lands the dust gets the station's
  pulse. `c` replays it while the hero pose is current.
- `html[data-space-assembled]` is set when no assembly is running; the deck
  CSS keeps the cover's title and byline at opacity 0 without it and fades
  them in over 1.4 s when it appears, so the title lands with the cluster.
  The attribute is set at boot, so without WebGL the title simply shows.

## 4. Verification

Headless Chromium with SwiftShader renders the post-processing chain (slowly):
the cover shot at 1, 2 and 5 s after load, three stations, the full 34-slide
pass with stops for overflow and console errors, then the push.
