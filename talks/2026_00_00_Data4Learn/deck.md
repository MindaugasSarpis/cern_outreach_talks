---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
  - slidev-addon-stage
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-00-00-data4learn
  fit: cover
  transition: dust          # clips arrive and leave as particles
  dust: '#7dd3fc'
stage:
  space: data/space.json
  palette: classic
title: Data4Learn
lang: en                  # slides and notes; `pnpm talk lint` reads it
htmlAttrs:
  lang: en
duration: 15min
layout: cover
space:
  at: wide
---

# Data4Learn

# Data4Learn

## A subtitle

<div class="mt-md">Name · Affiliation</div>

<PptxButton />

<!--
Speaker: the hero station builds itself behind the title; `c` replays it.
-->

---
layout: section
space: { at: first, dim: 0.2 }
---

# A section in the world

---
space: { at: [14, 3, -14], dist: 16, yaw: -30, pitch: 10 }
---

<!-- a library clip, inherited by name; no h1 on a video slide.
     After adding clips: pnpm videos:frames, and commit public/video-frames/ -->
<VideoPlayer src="cern_overview_short.mp4" />

---
space: { at: first, dim: 0.6 }
---

# A content slide

<div class="card">

## Cards float

The world steps back behind a content slide (`dim: 0.6`).

</div>

<div class="src">Source line</div>
