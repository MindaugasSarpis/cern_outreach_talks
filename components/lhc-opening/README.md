# The LHC opening

A talk's first minute, shared by the decks that start with it (OpenData first,
Užsikrauk karjerai next): the real LHC tunnel → on into the beam pipe → black →
one real collision in slow motion → the deck's own LHCb clip. No text.

The collision is LHCb's by default; `"event": "cms"` on the object draws a CMS
crossing instead, whose debris flies out to every side (OpenData's, from 12
October 2026: the owner asked for a collision "better resolved and symmetric to
all sides" and chose "a real CMS event, 4π").

| piece | file |
| --- | --- |
| the collision, a stage builder `lhc-collision` | `collision.js` |
| the event's particle paths (LHCb's states, its magnet) | `event.js` |
| the event: one real 2012 LHCb crossing, from CERN open data | `event.json` |
| `"event": "cms"`: the CMS drawing, sharp grains in 4π | `collision-cms.js` |
| its paths (helices in CMS's solenoid, the muons, the cells) | `cms.js` |
| its event: one real 2012 CMS crossing, from CERN open data | `event-cms.json` |
| the sound, synthesised (no files) | `sound.js` |
| `<LhcOpening name="opening" />`, the slide's trigger and captions | `LhcOpening.vue` |
| the captions' words, in Lithuanian | `captions.js` |
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
   stations. A low swell, a thump at the crossing, and a drone that fades as the
   debris flies out. The fly-out's boom went on 12 Oct 2026, in every talk: on a
   laptop it read as a car driving away (the owner: "no weird driving sound").

   With `"event": "cms"` the same run draws the CMS crossing: the flash lights
   each of its 19 collisions along the beam, and the debris flies out to every
   side, 290 tracks curling on their helices in CMS's 3.8 T solenoid out to the
   calorimeters, whose cells light all round (the ECAL warm, the HCAL light
   blue), the two muons running on out through the muon chambers. The camera
   pulls back with the burst and turns to the side of the beam, where it
   settles balanced (below, "Adopting it").
3. **The deck's LHCb clip** (OpenData: `lhcb.mp4`).

**Captions** (the owner: "And the captions?"; a number and the word that names
it, nothing more): over the tunnel „LHC 27 km“; at the crossing „8 TeV“ (the
2012 event's collision energy); as the debris flies out „237 dalelės“ (the
event's good tracks, the noun in the case its number takes). White numbers,
light-blue words, low on the left; printed, the collision's two show together.
A talk that draws the CMS event gives its numbers on the slide,
`<LhcOpening name="opening" :count="290" />` (`:tev` too, if it differs from
8): „8 TeV“ and „290 dalelių“. The two lines share one spot, so they hand over
rather than cross-fade: the one going fades in 0.3 s, the one coming waits 0.35 s.

**Sharp grains** (the CMS drawing; the owner on the LHCb one: "the collision
should be more in focus, it was blurry until the last frame"). LHCb's drawing
sizes a grain by perspective (72 / depth) with a soft sprite, and its camera
stands 2–3.4 units from the vertex for most of the shot: a track's grain is
7–10 px across at 900 rows (a tenth of them 15–21 px, a head up to 1.8× more),
a soft blob, and only the last pull-back (8.4 units) brings them to 5 px. They
also cost 13–17 million fragments a frame at 900 rows, 2.6× that on a 4K
canvas, enough to slow a laptop under the engine's 40 fps guard, which then
drops the resolution to 0.7 and 0.5 and never raises it. `collision-cms.js`
draws hard grains (full to the edge, the edge one pixel wide) of 1.8 px at 900
rows, at most 1.35× that when close (1.5–2.4 px through the shot); trails are
lines of them, dense near the vertex where the camera stands close, sparser
outward where it has pulled back; a head is brighter, not larger; a deposit is
a thin spike, not a cloud: 0.4–0.9 million fragments a frame. Grains spaced for
a distance part into beads when seen from much closer, so the shot keeps its
camera off them (a metre and a half from the vertex in the freeze; three metres
or more from anything lit once the debris is past the tracker, five or more by
the time the endcaps light) and the drawing fades whatever comes within a metre
of the lens.

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

### The CMS event (`"event": "cms"`)

`event-cms.json` is `Events/Run_195099/Event_137440354` of `4lepton.ig`, CERN
Open Data record 300 (CMS, "Higgs candidate events for use in education and
outreach", DOI 10.7483/OPENDATA.CMS.N9MJ.QEEC, CC0): 2012, √s = 8 TeV
(Run2012B), full reconstruction (RECO, CMSSW 5_3); run 195099, lumi section 115
(in the 8 TeV validated-runs list, record 1002), event 137440354, 27 May 2012,
23:35:47 UTC. A Higgs → ZZ → 2e2μ candidate: the four leptons' mass 127.05 GeV
(record 300's 4lepton.csv: 127.047752639), Z → μμ at 75.8 GeV, Z* → ee at 29.3
GeV; the open-data H → 4ℓ example (record 5200) selects the same event. The
bunch crossing holds 19 reconstructed collisions (z from −7.7 to +8.9 cm); 27
of the drawn tracks come from the Higgs candidate's.

Drawn: the first `nGood` = 290 of its 523 tracks (≥ 8 hits, χ²/ndof ≤ 5, ≤ 1 cm
from the beam line; the four leptons pass it), each a helix in 3.8 T along the
beam from its own pT, η, φ and charge (the file's own checks: the helix meets
its last hit within 4.5 mm, the median). Measured: from the first hit to the
last. Extrapolated: the rest. The tracker ends short of the ECAL (ρ 1.1 against
1.29 m, |z| 2.8 against 3.18 m): a track's last hit is a median 1.0 m of path
short of where its helix meets the ECAL's front (nine in ten more than half a
metre), so a track is drawn at full strength 0.6 m past its last hit (as event
displays carry a track to the calorimeter), then fades over 0.35 m, and stops at
the ECAL's front, after one full turn, or once faded out, whichever comes first:
85 of the 248 that reach the ECAL (the muons aside) get there at full strength,
122 at half or more; the slow ones (the 40 that never reach it,
and 39 more that would turn more than once on the way) show what the tracker
measured and a little more, not metres of guessed curl. The muons, measured on
through the muon system, never fade: they go on along iSpy's propagated points,
a cubic to the muon system's own track where those stop short, and a metre on. The
calorimeter hits (EB ≥ 0.25 GeV, EE ≥ 1, HB ≥ 0.5, HE and HO ≥ 1; 859 cells,
the forward HF left out: 5.6 TeV of mostly pile-up 11–13 m down the beam) are
spikes from each cell's front along the cell, √E long (0.12 m per √GeV in the
ECAL, 0.2 in the HCAL). One unit is one metre (`scale`), nothing stretched; CMS's
beam runs along the world's x, where the bunches run, and the frame is turned,
not mirrored, so every curl keeps its hand. The extraction (stdlib Python) and
its checks are in the OpenData talk's cache (`~/talks/.cache/opendata/r3/cms/`).

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
5. The slides (OpenData's deck.md, slides 1, 3 and 4; its slide 2 is CERN
   from above): a black standby (`dim: 1, ambient: 0, hum: false`), the
   tunnel (`<VideoPlayer … advance-on-end exit="push" exit-at="0.45,0.53" />`
   and `<LhcOpening part="tunnel" />`), and the collision:

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

   The CMS event (OpenData's slide 4): `"event": "cms"` on the object, the
   slide's own numbers on `<LhcOpening>`, and a shot of its own. The run-in and
   the crossing keep the keys above (and so the sound's timing); the fly-out is
   slower, since CMS is the size of a house where LHCb's drawing ran 10 units
   down the beam. The camera stands close in the freeze, near the beam's line,
   where the burst is a round flower of curls, and pulls back with the debris;
   once the flower is full (the heads at the tracker's edge) it turns round to
   the side of the beam, and is there before the endcaps light. In perspective
   only two places see CMS evenly: on the beam's line or square to it; anywhere
   between, one end is nearer and looms (an earlier path that held 45° off the
   beam, 5 m along it, framed the near endcap's fan and splashes large across
   half the screen and squashed the far one). So it settles square to the beam
   (yaw 2), 12 m off and lifted 26°: the barrel's tracks in the middle, both
   endcaps' splashes either side, the same size. The barrel muon runs on out of
   the frame at the top (its last chamber is 6.3 m out):

       rate: [[0, 1.4], [2.0, 1.4], [2.7, 0.03], [5.6, 0.03], [6.6, 1.0], [8.0, 1.0], [9.0, 1.8], [11, 1.8], [12, 1]]
       cameraRate: 1
       path:
         - [0, { at: [0, -400, 0], dist: 4.2, yaw: 18, pitch: 5 }]
         - [2.6, { at: [0, -400, 0], dist: 2.4, yaw: 32, pitch: 8 }]
         - [5.6, { at: [0, -400, 0], dist: 1.5, yaw: 70, pitch: 14 }]
         - [6.5, { at: [0, -400, 0], dist: 3.3, yaw: 58, pitch: 17 }]
         - [7.3, { at: [0, -400, 0], dist: 5.6, yaw: 26, pitch: 20 }]
         - [8.3, { at: [0, -400, 0], dist: 8.8, yaw: 9, pitch: 24 }]
         - [9.8, { at: [0, -400, 0], dist: 11.2, yaw: 4, pitch: 26 }]
         - [11.5, { at: [0, -400, 0], dist: 12, yaw: 2, pitch: 26 }]

       <LhcOpening name="opening" :count="290" />

## Options (the object in space.json)

`approach` (3.32), `bunch` (8 units/s), `light` (5.5 units/s, the debris),
`scale` (0.5 units per metre along the beam), `stretch` (2.4 across it), `pipe`
(26, the drawn pipe's half length), `flash` (0.09), `tone`, `muonTone`,
`splashTone`, `bunchColor`, `seed`, `sound: false`, `level` (0.32, the sound's
gain into the stage's output). The grain count follows `ctx.budget` (300k on a
desktop, 60k on a phone).

With `"event": "cms"`: `approach` (3.32), `bunch` (8), `light` (1.6 units/s),
`scale` (1 unit per metre, the same every way), `pipe` (26), `pipeR` (0.05),
`grain` (1.8 px at 900 rows), `flash` (0.012, one collision's flash core),
`calo` (`["EB", "EE", "HB", "HE", "HO"]`; add `"HF"` for the forward
calorimeter), `tone` (the tracks), `muonTone`, `ecalTone`, `hcalTone` (light
blue), `bunchColor`, `seed`, and the sound's `sound`, `level`. At the desktop
tier it draws about 200k grains (106k and 41k at the lower two), each one to
two pixels.
