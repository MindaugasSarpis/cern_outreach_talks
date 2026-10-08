---
name: talk-broadcast
description: Use when a talk in the outreach_talks repo will be filmed, recorded, streamed or shown on TV (a studio recording, a broadcast to classrooms, an OBS capture, slides squeezed beside a presenter or shown on an LED wall behind them). The checklist for the look, the type floor, the safe box, flash safety, the recorder, plates, credits and the questions for the broadcaster.
---

# A talk for a camera

Engine defaults are made for a projector. On a stream at about 2.5 Mbps with
the slides at about two thirds of the frame, film grain and fine dust turn to
grey blocks and the kit's 11–12.5 px lines become unreadable. Measured on
engine frames: turning off grain and chromatic aberration cut the bitrate the
world needs at constant quality from 12.1 to 4.1 Mbps.

## 1. Ask the broadcaster, in one message, early

1. Do slides go out as a full-frame feed, squeezed beside the speaker (what
   size), on a screen or LED wall behind them, or a mix?
2. Do they want files in advance? Format, frame rate (1080p25, 1080p50,
   1080i50) and deadline.
3. Who advances the slides; is there a confidence monitor?
4. Laptop audio into their mixer, or silent?
5. Where do their logo, name supers and clock sit? Do they add their own
   lower thirds? May a QR code or link be shown?
6. Do they run a flash check (for example Harding)?

Default if there is no answer: the live laptop at 1920×1080, 50 Hz, silent,
plus per-slide MP4s and text-free plates, a stills PDF, the source clips and
a credits file. Record the answers in the talk's CLAUDE.md under Brief.

## 2. The look

Until the talk is on toolkit v0.6, in the headmatter:

```yaml
stage:
  sound: false
  halo: false
  options: { grain: 0, aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom: 0.45, flight: [2.5, 5] }
```

From v0.6 `look: broadcast` carries these. Lift the ground off near-black
(about `#0a0f1f` instead of `blue`'s `#03050d`) or use `ember`: a dark blue
gradient bands at stream bitrates. Pick a palette no other October talk uses.

## 3. Type and the safe box (980 px canvas)

- Readable text 37 px or more (49 is better); headlines 72–92; kickers 24 or
  more; nothing below 16, `.src` included. At most two lines of about 28
  characters per text block. Override the kit sizes in the talk's
  `styles/index.css`; keep `canvasWidth` at 980.
- Text inside x 98–882 and y 55–408. Keep the logo corner (top right), the
  name-super corner (bottom left) and the clock corner (bottom right) clear.
- Check (from v0.6): `pnpm talk safe <t>` runs `slidev-stage-safe` on the
  build in `/tmp/talk-<slug>/site` (building it if needed), in the render
  queue, with `--broadcast` for a talk marked broadcast; `--slides 2-4` keeps
  it small and `-- --json` prints the tool's own report. It reports the
  smallest font and every text box outside the safe box; `pnpm talk ready`
  runs it for a broadcast talk. Until v0.6, read `fontPx` and the boxes from
  the shots report (`talk-verify`).

## 4. Motion and flashes

- `sway: 1` or less on slides with text; hold the camera still for 2–3 s
  while text is up.
- Bursts under about 10 % of the frame and at most one every 1.5 s; no
  saturated red flashes; never replay `c` quickly on camera. The limit to
  stay under is three flashes a second (ITU-R BT.1702). Run a flash checker
  (EA IRIS) on the final recording.
- Clips: muted, short (5–8 s), each with its licence checked on its CDS or
  Commons record.

## 5. Record

```bash
pnpm talk build <t>                # into /tmp/talk-<slug>/site
pnpm talk record <t> --slides 2-2  # from v0.6: one slide first, to time it
pnpm talk record <t> --plate       # per-slide NN.mp4 at 1080p50 with a hold, NN-plate.mp4 without text, index.json
```

`slidev-stage-record` steps the engine on a fixed clock, so frames are exact.
Its speed depends on the renderer headless Chromium gets on the machine:
measured on one OpenData slide on 8 October, a 1080p frame took 0.18 s on a
CPU renderer (llvmpipe) and 0.10 s on a GPU, which puts a 22-slide talk at
roughly 30 to 50 minutes (an estimate from those rates). Time one slide
first, and start the rehearsal render days before the filming. The manual
fallback is an OBS capture on a machine with a GPU: Chrome at 1920×1080 and
DPR 1, display at 50 Hz, muted, NVENC CQP 16, about 8 s held on each slide.
Encode one test at the broadcast bitrate (`pnpm talk render -- <ffmpeg
command>`) and look at it on a phone and a projector before committing to
the look.

## 6. Hand-over

- per-slide MP4s and text-free plates, the stills PDF with the spoken cue
  line under each still, the source clips;
- `credits.txt` with every clip and photo, its licence and credit line;
- on the day: laptop at 50 Hz, sound off, a clicker, a USB stick with the
  MP4s.

Run `pnpm talk ready <t>` before hand-over; deploying the web version is a
separate request (`talk-deploy`).
