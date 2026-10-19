# MasterTalk storyboard: one collision, one shot

Draft 2, 18 Oct 2026, for the owner's approval before any world work.
Built on the Ideas backlog's section H (mt-*). Assumes an Innoday-like event
(25 min, a business audience); a shorter slot merges stations.

One camera move, no cuts. The camera follows what moves (the bunch, the
tracks, the bytes, the stream), and stands still while a number is read.
Joins between slides are hidden in black or dust. On screen there are only
numbers with their units; the owner narrates everything else.

## The event

The one collision (picked 18 Oct): CERN Open Data record 28040 (LHCb 2012,
8 TeV, magnet down, DIMUON stream, CC0), run 124143, event 39463039, 29 July
2012. One collision, 92 tracks (65 good), holding an anti-Λb⁰ → J/ψ(μ⁺μ⁻)
p̄ K⁺ candidate: m(J/ψ p̄ K⁺) 5628 MeV, m(J/ψ p̄) 4437.5 MeV, which lands in
the Pc(4440) bin (found by an honest ranking, not chosen for it). Extraction
and selection: `~/talks/.cache/opendata/mastertalk-event/`; the event as
drawn is `setup/data/event-lb.json`.

- It is a *candidate* from our own selection, not a certain Λb⁰ (about half
  the candidates in its mass window are random combinations), and it is not
  yet matched to the thesis's 16 400. "One of 16 400" needs the thesis
  ntuple's run and event numbers (run 124143, event 39463039); until then
  the notes say "a candidate like the thesis's 16 400".
- The event is from Run 1, and the route's numbers are from Run 3. The notes
  say this once: "a collision like this one; today the same path runs at
  30 MHz".
- Station 3 shows the event's own count, 65 particles (the opening's way of
  counting), in place of "5 collisions": the event has one collision.

## Timeline (25 min, a business audience like Innoday's)

Draft 2 (18 Oct): the owner chose the clock, and an event "something like
Innoday". For a 25-minute slot, the VELO joins the magnet and SciFi as one
detector station, and the open data joins the data centre. The three cuts
all stay.

| # | min | Station: where the camera is | On screen | Clock | Facts |
|---|---|---|---|---|---|
| 0 | 0:00–0:45 | **The peak**, out of focus: the 2019 m(J/ψ p) spectrum as grains, no axes | nothing | — | lhcb-pentaquark-2019 |
| 1 | 0:45–1:15 | **The dive** into one bin; the grain unfolds backwards into its tracks and the beam pipe; black | nothing | runs back to 0 | — |
| 2 | 1:15–3:00 | **The beam pipe** (the opening's push) | 25 ns · 2 500 bunches · 160 000 000 000 protons | −25 ns, counting up | cern-lhc-collisions, lhc-bunch-milky-way |
| 3 | 3:00–4:45 | **The crossing**: ours among its neighbours | 65 particles · 30 000 000 crossings/s | 0 ns | lhcb-trigger-5tbs-10gbs, lhcb-hlt1-30mhz |
| 4 | 4:45–7:15 | **The detector**: the VELO round the pipe, the magnet, the SciFi; RICH, the calorimeters and the muon stations at their real z | 5.1 mm · 11 000 km | 1 ns → 63 ns at the last muon station (18.8 m) | lhcb-velo-distance, lhcb-scifi, lhcb-muon-m5-18p8m |
| 5 | 7:15–9:00 | **The readout**: hits become bytes | 4 TB/s · 3 % | runs on (µs → s), no rung read | lhcb-run3-readout-4tbs, internet-intl-bandwidth-2022 |
| 6 | 9:00–11:00 | **HLT1, cut one** | 500 GPUs · 30 MHz → 1 MHz | runs on, no rung read | lhcb-hlt1-500-cards-89khz, lhcb-run3-hlt1-1mhz-out |
| 7 | 11:00–13:00 | **The buffer and HLT2, cut two** (the same gesture) | 30 PB · 10 GB/s · 1 byte in 500 | hours → days | lhcb-trigger-5tbs-10gbs, lhcb-upgrade1-trigger, lhcb-buffer-80-hours |
| 8 | 13:00–15:30 | **The data centre, the grid, the open data**, and Vilnius's hands on it | 1 EB · 42 countries · 100 000 files | turns to years: 2012 → 2023 (the full Run 1 release) | cern-exabyte, cern-wlcg, lhcb-open-data, lhcb-run1-release-sarpis, sarpis-interview-run1-1-5-years |
| 9 | 15:30–18:00 | **Cut three, the analysis**: 16 400 Λb⁰ are left; ours lands as one entry in the Λb⁰ mass peak | 16 400 · its own mass in MeV | 2026: stops at 14 years and fades as the dot lands | stonkus-bsc-2026-yield |
| 10 | 18:00–21:00 | **The peak, now sharp**: station 0's frame, in focus, with axes | 246 000 · 7.3σ | — | lhcb-pentaquark-2019-yield, lhcb-pentaquark-2019 |
| 11 | 21:00–23:30 | **Pull back to Vilnius**, the whole route behind | nothing, or faces (if consented) | — | stonkus-bsc-2026-yield |
| — | 23:30–25:00 | slack | | | |

**The clock** (mt-clock, owner's choice). It is small at the edge of the
frame and grows only when it jumps a rung. It stops when the camera stops,
and it is gone after the dot lands. Its first rungs (ns) are physics and hold
for any year. The µs, ms and hours rungs are today's machine (Run 3), like
the route's numbers. No public source gives a latency for the readout or
HLT1 (LHCb: both are asynchronous, "no latency requirements"; buffers hold
O(20) s), so through stations 5 and 6 the clock runs on without stopping on
a value; it stops only on sourced rungs (63 ns, hours to days, the years).
The years are this event's own: recorded in 2012,
released in 2023, in a thesis in 2026. The notes say this once.

Every station can be jumped to directly, and `rate: 0` pauses the move.

The trigger is shown as **one gesture, three times** (stations 6, 7 and 9):
the neighbouring collisions fall to dust, ours stays lit, and the ratio is
the number on screen.

The 246 000 at station 10 comes from the 2019 paper, and the 16 400 at
station 9 from the Vilnius thesis on 2012 open data. The notes say which is
which.

## If the slot is shorter

- 20 min: merge 7 into 6 (cut two folds into cut one's gesture); trim
  stations 2 and 4.
- 15 min: as for 20 min, and drop station 5 (its 4 TB/s moves into station 6).
- Stations 0, 1, 9, 10 and 11 always stay: they are the open and the close.

## Hero shots (offline, brought in as dust)

The look of CERN's film `cern_video_2025_029_001` (one B⁰ → K*μμ decay
followed through LHCb; the owner's "lhcb thanks" reel is a recut of it):
path-traced detector geometry, emissive tracks, depth of field. Ours are
rendered the same way from LHCb's real Run 3 geometry and this talk's own
event: HSF Phoenix's `LHCb.glb` (from LHCb's DD4hep geometry, July 2025;
every sub-detector; mm, Draco) → Blender, Cycles on CPU, tracks as `bpy`
curves growing by time of flight. Estimate: 15–45 s a 1080p frame on this
machine's 128 cores, 2–7 h a 10–20 s shot (unmeasured). Each render needs
the Scheduler's slot; none before 26 Oct:

1. **The crossing** (station 3), the real geometry round the pipe.
2. **Cut one** (station 6): thousands of collisions falling to dust round
   the one that stays.
3. *(optional)* **The pull-back** (station 11): the whole route in one frame.

The same `.glb` can stand live in the browser at stations 4–5 (as grains on
its planes, or a faint ghost under them).

## Media and licences

Every piece is cleared before a frame is built.

| Piece | Source | Licence | Status |
|---|---|---|---|
| The event | CERN Open Data record 28040, LHCb 2012 DIMUON | CC0 | ok |
| CERN's film (reference, or a clean version) | CDS CERN-VIDEO-2025-029-001 | CERN | captioned frames unusable on screen |
| LHCb geometry | gitlab.cern.ch/lhcb/Detector (DD4hep), via HSF Phoenix `LHCb.glb` | GPL-3.0 (© CERN for the benefit of the LHCb Collaboration) + Apache-2.0 (Phoenix); ship both notices and the source link with the file; tiny credit line | ok |
| 2019 spectrum bins (Užsikrauk's histogram) | HEPData? | [CHECK] the source and licence of the bins | open |
| Thesis plot | D. Stonkus, VU 2026 | [CHECK] the author's OK and a credit line | open |
| Cavern, racks, tape robot, WLCG | CERN (CDS, library clips) | CERN, no credit | ok |
| Data-centre racks photo (if used) | Wikimedia, SimonWaldherr | CC BY-SA 4.0, tiny credit | ok |
| The group, the room in Vilnius | the owner | consent from each face | open |
| The opening (pipe push, `lhc-opening`) | shared component | in repo | ok |

## Grammar (mt-handoff)

- The camera follows what moves. It never flies *to* a thing with nothing
  leading it.
- Each station ends with the next one's object already lit at the edge of
  the frame.
- The camera is still while a number is read; its speed is capped and it
  never sways.
- Joins are hidden in black (`ambient: 0`) or in dust, never in open space.
- Sound: one continuous bed that crossfades from station to station, with a
  hush at the dot. No whoosh, no falling pitch.

## For the owner to judge

- **The peak**: the pentaquarks (the default), or another peak.
- **Faces at station 11**: who, and with whose consent.

## Engine needs (for the Scheduler to take to Tools after 26 Oct)

Needed:

- **Joins that carry velocity across slides.** Without them every station
  boundary is a stop and start, which is a slideshow with long transitions.
  Chained paths with hidden joins work until then.
- **Seek and pause on a path.** Timing comes from a recorded rehearsal, and
  the speaker has to be able to hold a station.

Wanted:

- **A follow target**: "follow one grain" without typing 40–60 keys by hand.
- **Depth of field**: station 0's out-of-focus peak, and the hand-off of
  focus from object to object. Until then: scatter and light.

Not needed: roll, and fov per pose (a single dolly zoom isn't worth it).

## Next

1. The owner approves this, or changes it.
2. Pick the event from the thesis's selection output and record its masses
   (the check: its m(J/ψ p K⁻) equals the bin it lands in).
3. Build stations 0–3 as chained slide paths on v0.8.1, and record 60 s
   for the mt-handoff check.
