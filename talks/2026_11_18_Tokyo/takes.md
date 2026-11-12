---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-stage
stage:
  space: takes/space.json   # takes/data/space.json, copied beside the site by takes/build.sh
  palette: { base: classic, bg: '#020203' }                                             # the deck's look: keep the
  options: { maxBufferWidth: 1920, grain: 0, aberration: 0, bloom: 0.32, density: 0.6 }  # two lines as deck.md's
  plugins: [hadron]
  lang: en
  sound: { flight: false, clip: false }
title: "Tokyo: the takes"
lang: en
space: { at: [600, 300, 0], dist: 12, dim: 0.9 }
---

<!-- Not a talk: the scenes the deck plays as clips, one per slide, for the recorder. takes/README.md has the
     commands (build, record, cut). Nothing here is deployed: tooling reads deck.md only. -->

<div style="position: absolute; left: 56px; top: 48px; font: 500 20px/1.6 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #c9dcf0; text-transform: none;">
The takes (takes/README.md)<br>
2 · data: LHCb, a collision, the 2019 histogram and its fit → data2019.mp4 (slide 10)<br>
3 · collision: LHCb's point cloud and a collision, drawing back → finale.mp4, first part<br>
4 · globe: the globe forms, Vilnius and Nagoya, the turn east → globe.mp4 (slide 13)<br>
5 · world: the Earth on Japan, drawing back, its grains into the pentaquark → finale.mp4, second part
</div>

---
space:
  dim: 0
  sway: 0
  ambient: 0
  hum: false
  path:
    # 13 Nov (the owner: "12 needs to show hop massive LHCb is, a slow zoomout from close up at eye level, then past a person
    # looking at lhcb and then show the data taking"): 12 s first. Close on the detector at a person's eye height, drawing
    # back; the person for scale (at about [1019.8, -485.6, 7.9], 1.83 m) comes in on the right and is passed; then the
    # whole detector, where the take used to begin. The collision (`delay`) and the histogram's fill (`lead`, the takes'
    # space.json) wait those 12 s.
    - [0, { at: [1011, -484.6, 2], dist: 8, yaw: 0, pitch: 0 }]
    - [5, { at: [1014, -484.4, 2], dist: 12.5, yaw: 0, pitch: 0 }]
    - [9, { at: [1018.5, -484, 2.5], dist: 20, yaw: 0, pitch: 1.5 }]
    - [12.5, { at: [1023.7, -483, 2.5], dist: 35, yaw: 0, pitch: 4 }]
    - [27.5, { at: [1023.7, -483, 2.5], dist: 35, yaw: 0, pitch: 4 }]
    - [31.5, { at: [1037.6, -482.3, 5], dist: 19.5, yaw: 0, pitch: 3 }]
---

<!-- 2 · data: the detector whole, a collision, its grains arcing out and landing as the histogram (`pc`); the
     camera comes to the histogram, the fit is drawn and the peaks light. Slide 10's axis and names sit on this
     camera's last pose: move it and they move (deck.md, styles/index.css). -->
<InsideLhcb :land-y="-470" :delay="12" />
<Grains :set="{ pc: 1 }" />

---
space:
  dim: 0
  sway: 0
  ambient: 0
  hum: false
  path:
    # 13 Nov (the owner: "18 collision happens to fast, look at uzsikrauk karjerai has to be timed"): a build-up first.
    # The camera comes round and in on the standing detector for 16 s, the crossing is at 17.0 s (`delay` 12.8), and the
    # cut puts it on the music's arrival; everything after it 11.6 s later than it was.
    - [0, { at: [1012, -481.5, 2.5], dist: 38, yaw: -34, pitch: 9 }]
    - [9, { at: [1012, -481.5, 2.5], dist: 29, yaw: -20, pitch: 5 }]
    - [16.7, { at: [1012, -481.5, 2.5], dist: 24.6, yaw: -10.5, pitch: 4 }]
    - [17.9, { at: [1012, -481.5, 2.5], dist: 19.5, yaw: -8, pitch: 4 }]   # a push in on the crossing
    - [21.6, { at: [1012, -481.5, 2.5], dist: 28, yaw: 2, pitch: 5 }]
    - [26.8, { at: [1014, -479, 2.5], dist: 40, yaw: 12, pitch: 16 }]
    - [30.3, { at: [1016, -474, 2.5], dist: 70, yaw: 18, pitch: 28 }]
---

<!-- 3 · collision: the point-cloud detector (`detp`), the collision 1.2 s in, its particles going through the
     detector as the camera turns around it and draws back; the detector fades from 14.5 s (the cut's cross-fade
     into the world take). -->
<!-- 13 Nov (the owner: "finale collision has to be slow-mo low sound, more substantial"): `freeze`, the world's rate
     from the crossing: down to a twelfth for three seconds, back to full by 7.5 s (it was 1.6 s). The camera's path
     keeps its own time. -->
<InsideLhcb det="detp" :land-y="-470" :delay="12.8" :fade-at="27.8" :freeze="[[0, 0.3], [0.3, 0.08], [3.2, 0.1], [5.5, 0.35], [7.5, 1]]" />

---
space:
  at: globe
  dim: 0
  sway: 0
  hum: false
  path:
    - [0, { at: globe, dist: 12.5, yaw: 0, pitch: 0 }]
    - [6.5, { at: globe, dist: 12.5, yaw: 0, pitch: 0 }]
    - [19.5, { at: globe, dist: 8.3, yaw: 0, pitch: 0 }]
---

<!-- 4 · globe (the owner, 10 Nov: "Slide 13 could zoom in and rotate earth"): the photograph dissolves into
     grains, the globe forms on Europe, Vilnius lights, then Nagoya and Tokyo, the strand is drawn; the globe
     turns east after it (the station's `tour`, its seconds and this path's both from the sequence's start:
     `tourFrom: cue`) as the camera comes in, and rests with both cities in the frame. The deck's `globe`
     station (public/data/space.json) is this take's end. -->
<CollabGlobe src="figures/earth_back.jpg" />

---
space: { at: [330, 70, 60], dist: 12, dim: 0 }
---

<!-- 5 · nothing (12 Nov): a slide between the globe take and the world take. The recorder comes to a take from the
     slide before it; coming from the globe take it brought a string of bright grains across the world take's
     first seconds (the owner: "finale has weird flick of particles before pentaquark appears"). -->

---
space:
  at: finale
  dim: 0
  sway: 0
  hum: false
  path:
    - [0, { at: finale, dist: 6.2, yaw: 0, pitch: 0 }]
    - [1.5, { at: finale, dist: 6.4, yaw: 0, pitch: 0 }]
    - [6.5, { at: finale, dist: 13, yaw: 0, pitch: 0 }]
    - [12.5, { at: finale, dist: 18, yaw: -8, pitch: 6 }]
    - [19, { at: finale, dist: 13.5, yaw: -16, pitch: 9 }]
---

<!-- 5 · world: the Earth in grains with Japan in the middle; the camera draws back, and from 6.5 s the globe's
     grains gather into the cover's pentaquark (the station's `pq`, its seconds from the camera setting out for
     this station, as this path's), which turns as the camera comes in. No component: the stage's `arm` cues it. -->
