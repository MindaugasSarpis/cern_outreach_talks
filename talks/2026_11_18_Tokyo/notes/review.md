# Review, 2026-10-29

HEAD 26ebf00 (snapshot = HEAD, clean tree). The next review's `since`: 26ebf00.

Run: `pnpm talk lint tokyo` 0/0; `pnpm talk review tokyo` ok (lockfile, videos:check,
stage:check, build, shots: no overflow, no page errors); facts in the notes against
the facts bank by hand; a subagent on the contact sheet, shots.ndjson and frame
strips of globe.mp4 and finale.mp4 (seams 20→21, 25→26, 26→27 frame-identical).
Not run: the talk-review workflow (facts, copy, unslop, perf lenses).

## Fixed in this round

| Slide | Kind | Finding | Fix |
|---|---|---|---|
| 23 | fact | "524 288 Hamamatsu sensors": 524 288 are SiPM channels (4 096 arrays of 128; `lhcb-scifi-channels`) | label "Hamamatsu channels" |
| 23 | layout | number in the lower third over the green rails | `num tl`, `shade tl strong` |
| 7 | busy, layout | "5 600 t" in the lower third over the bright floor and stairs | `num tl`, `shade tl strong` |
| 16 | busy | "2003" over cabled racks and orange railings | `shade tr strong` |
| 22 | illegible, layout | "13 students" on the pale church facade; both numbers in the lower third | `num tl` / `num tr`, `shade tl tr strong`, `focus="50% 65%"` |

## Open (need a re-record, a live check, or the owner)

| Slide | Sev | Finding | Proposed fix |
|---|---|---|---|
| 26 | medium | finale 13–29 s: the stations pass small and edge-on (dist 24, yaw 55) through an empty starfield; "back along the route" does not read | waypoints dist 12–14, yaw 20–25, centred on each station, the collider at dist 18; re-record (fits the v0.11 `space.recorded` re-take) |
| 21 | medium | globe barely turns after 6.7 s; Nagoya on the right limb, Japan edge-on; the strand a hairline; the two dots look alike | collab-globe `lon` 92 → ~105; brighter strand and pulse (setup/globe.js); optional "Vilnius", "Nagoya" names; re-record |
| 26 | low–med | the quarks visibly lock at ~36.8 s; Starfire's peak is set at 36.0 (the shell appears at 36.0) | `drop.at` 36.7, `duck` 34.1, if the lock is the hit; owner to judge by eye |
| 12 | medium | the baryon reads as two blobs, the meson as one: the two recipes cannot be counted | check live; `space: { at: families, dist: 7.5, pitch: 3 }` or spread the baryon's quarks in space.json |
| 15 | low–med | a bright point left of Kobayashi's portrait, in no note | identify live; shift the pose (`yaw: 6`) |
| 26, 27 | low | a stray dotted arc enters top right in the finale's last ~15 s and on finale_end.jpg | find its source; re-record with the finale |
| 14 | low | Zweig's portrait and passage in the lower third | `space: { at: [170.55, 1.0, 0], dist: 12, yaw: 0, pitch: 2, dim: 0.06 }` |
| 25 | low | the photo pages press the top edge | page y 5.4 → 4.9 (changes the finale's frame 0: with the re-record) |
| 18 | low | the compact ball shows 4 of 5 quarks | a few degrees of yaw/pitch, live |
| 24 | low | "38.3 TB open data" sits on LHCb's official 2019 plot, not the thesis's | the thesis's own plot if its licence allows, or say so |
| 13 | low | a pale blob at the left edge, in no note | `dist: 7` |
| 17 | low | "2015 discovery" over the 2019 plot | leave to the narration |
| all | high | timing: 29.6 of 30 min by the notes; speech ran 15–25 % over in October | cut first: 16 (Belle), 24 (open data), 13 (Sakata) |

Rejected: slide 1's title "17.9 canvas px" was the subscript c of P<sub>c</sub>
(0.62 em); the title is 29 canvas px.

Content notes (not on screen): slide 12's "for more than fifty years every
particle … fell into one of two families" sits before slide 16's X(3872)
(2003), which started the exotic hunt; slide 25's note says "next week's
meeting in Nagoya" (stale, and the meeting is private until the owner says).
