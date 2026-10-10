# The LHC opening

A talk's first minute, shared by the decks that start with it (OpenData first,
Užsikrauk karjerai next): the real LHC tunnel → on into the beam pipe → black →
one real collision in slow motion → the deck's own LHCb clip. No text.

| piece | file |
| --- | --- |
| the collision, a stage builder `lhc-collision` | `collision.js` |
| the event's particle paths (LHCb's states, its magnet) | `event.js` |
| the event: one real 2012 LHCb crossing, from CERN open data | `event.json` |
| the sound, synthesised (no files) | `sound.js` |
| `<LhcOpening name="opening" />`, the slide's trigger | `LhcOpening.vue` |
| steps and events between them | `bus.js`, `index.js` |

## The shot

1. **The tunnel.** CERN-FOOTAGE-2022-013-001, an 18 s cut of the travelling
   shot (2:35–2:53), with its own ventilation hum. It moves on by itself; at its
   end the player's `exit="push"` rushes into the point where the magnet string
   vanishes (0.45, 0.53 of the last frame), the frame tears into grains, black
   holds, and the stage lifts in.
2. **The collision**, in a world made black (`space.ambient: 0`):
   two bunches of protons, needles of blue light, run in from both ends of the
   beam pipe and light its wall; they cross, each primary vertex flashes, the
   world nearly stops (`rate` 0.03) while the camera keeps orbiting
   (`cameraRate: 1`, a `path`); then it runs on fast as the debris flies out:
   237 reconstructed tracks bending in LHCb's dipole, splashes of energy in the
   ECAL (153 real clusters) and HCAL, the muons running on through the muon
   stations. A low swell, a thump at the crossing, the boom on the fly-out.
3. **The deck's LHCb clip** (OpenData: `lhcb.mp4`).

## The event

`event.json` is entry 2178 of `00041836_00076811_1.ew.dst`, CERN Open Data
record 24506 (LHCb 2012, 8 TeV, magnet down, EW stream, Stripping21): run
133488, event 2028034058, 1 December 2012, 14:59:38 UTC. It fired a dijet line
(jets of pT 29 and 52 GeV, 166° apart). 237 good tracks (132 VELO-only, 85
long, 8 upstream, 12 downstream; ghost probability ≤ 0.4) from two primary
vertices (82 and 67 tracks), 153 ECAL clusters (906 GeV), the HCAL energy of 92
tracks. Read with uproot from the packed DST; its counts match the event's own
reconstruction summary, every long track bends with the sign its charge
predicts (median kick 1.29 GeV), the file's K0S peak at 498 MeV. The HCAL
deposits' depth (z = 14 m) is assumed, not stored. The extraction scripts and
the full record (event-full.json) are in the OpenData talk's cache
(`~/talks/.cache/opendata/opening/event/`).

The drawing stretches distances across the beam 2.4× (as LHCb's event displays
do: its tracks run within a few degrees of the beam), and runs every particle at
one speed (all of them near light speed).

## Adopting it in a talk

1. Pin slidev-videos v0.8.0 or later (`space.rate`, `cameraRate`, `path`,
   `ambient`, `hum`; `ctx.audio`, `ctx.budget`; the player's `exit="push"`).
2. `setup/main.ts`:

       import { installOpening } from '../components/lhc-opening/index.js'
       export default ({ app }) => { installOpening({ app, registerBuilder }); … }

   and add `lhc-collision` to the `--types` of the talk's `stage:check` script.
3. The station, in the talk's `space.json`, far from every other form:

       { "id": "opening", "pos": [0, -400, 0],
         "look": { "target": [0, 0, 0], "dist": 6, "yaw": 60, "pitch": 6, "sway": 0 },
         "objects": [{ "type": "lhc-collision", "name": "opening", "pos": [0, 0, 0] }] }

4. The tunnel clip in the talk's `videos/manifest.toml` (copy OpenData's
   `cern_footage_2022_013_001_1080p_lhc.mp4` entry: the name is the raw's on
   gdrive), then `videos:sync`, `encode`, `frames` (posters need the v0.7.0+
   CLI), `publish`.
5. The slides (OpenData's deck.md, slides 1–3): a black standby (`dim: 1,
   ambient: 0, hum: false`), the tunnel (`<VideoPlayer … advance-on-end
   exit="push" exit-at="0.45,0.53" />`), and the collision:

       space:
         at: opening
         dim: 0
         ambient: 0
         hum: false
         rate: [[0, 1.4], [2.0, 1.4], [2.7, 0.03], [5.6, 0.03], [6.4, 2.2], [8.5, 1]]
         cameraRate: 1
         path:
           - [0, { at: [0, -400, 0], dist: 3.4, yaw: 28, pitch: 4 }]
           - [2.6, { at: [0, -400, 0], dist: 2.3, yaw: 16, pitch: 6 }]
           - [5.6, { at: [0, -400, 0], dist: 2.0, yaw: -24, pitch: 13 }]
           - [7.8, { at: [2.4, -400, 0], dist: 6.0, yaw: -30, pitch: 12 }]
           - [10.5, { at: [3.4, -400, 0], dist: 8.4, yaw: -32, pitch: 13 }]

       <LhcOpening name="opening" />

   The `path`'s `at` is the station's position: move both together. The
   crossing is timed for these `rate` keys (`approach: 3.32` engine-seconds
   puts it where the world is nearly still); change one, re-time the other.

## Options (the object in space.json)

`approach` (3.32), `bunch` (8 units/s), `light` (5.5 units/s, the debris),
`scale` (0.5 units per metre along the beam), `stretch` (2.4 across it), `pipe`
(26, the drawn pipe's half length), `flash` (0.09), `tone`, `muonTone`,
`splashTone`, `bunchColor`, `seed`, `sound: false`, `level` (0.32, the sound's
gain into the stage's output). The grain count follows `ctx.budget` (300k on a
desktop, 60k on a phone).
