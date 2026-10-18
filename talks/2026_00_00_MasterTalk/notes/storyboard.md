# MasterTalk storyboard: one collision, one shot

Draft 1, 18 Oct 2026, for the owner's approval before any world work.
Built on the Ideas backlog's section H (mt-*). Assumes the default 30 min
slot; a shorter slot merges stations (see "If the slot is shorter").

One camera move, no cuts. The camera follows what moves (the bunch, the
tracks, the bytes, the stream), and stands still while a number is read.
Joins between slides are hidden in black or dust. On screen there are only
numbers with their units; the owner narrates everything else.

## The event

The one collision: a real 2012 crossing from LHCb open data, holding a
Λb⁰ → J/ψ p K⁻ candidate. It is picked **from the Vilnius thesis's own
selected sample** (Stonkus, 2012 dimuon stream, 16 400 Λb⁰), so the dot it
becomes in that plot is literally this collision. It is drawn with the
opening's extraction scripts (`~/talks/.cache/opendata/opening/event/`).

- We may say "one of 16 400" (the thesis). We may not say "one of the
  246 000" in the 2019 paper: Run 1 was in that sample, but we can't know
  that this event passed that selection. For 2019 the notes say "a decay
  like these".
- The event is from Run 1, and the route's numbers are from Run 3. The notes
  say this once: "a collision like this one; today the same path runs at
  30 MHz".

## Timeline (30 min)

| # | min | Station: where the camera is | On screen | Facts |
|---|---|---|---|---|
| 0 | 0:00–1:00 | **The peak**, out of focus: the 2019 m(J/ψ p) spectrum as grains, no axes | nothing | lhcb-pentaquark-2019 |
| 1 | 1:00–1:30 | **The dive**: into one bin, until one grain fills the frame; it unfolds backwards into its tracks and the beam pipe; then black | nothing | — |
| 2 | 1:30–3:30 | **The beam pipe** (the opening's push, reused) | 25 ns · 2 500 bunches · 160 000 000 000 protons | cern-lhc-collisions, lhc-bunch-milky-way |
| 3 | 3:30–5:30 | **The crossing**: our collision among its neighbours | 5 collisions · 30 000 000 per second | lhcb-trigger-5tbs-10gbs, lhcb-hlt1-30mhz |
| 4 | 5:30–7:30 | **The VELO**, on the real modules round the pipe | 5.1 mm · 55 µm | lhcb-velo-distance, lhcb-velopix |
| 5 | 7:30–9:30 | **The magnet and the SciFi**; the tracks bend; RICH, the calorimeters and the muon stations pass at their real z | 11 000 km · 20 Tbit/s | lhcb-scifi |
| 6 | 9:30–11:30 | **The readout**: the hits become bytes and leave through the fibres | 4 TB/s · 3 % (of the world's international bandwidth) | lhcb-run3-readout-4tbs, internet-intl-bandwidth-2022 |
| 7 | 11:30–14:00 | **HLT1, cut one**: the neighbours fall to dust; ours stays lit | 200 GPUs · 30 MHz → 1 MHz | lhcb-allen-gpu, lhcb-run3-hlt1-1mhz-out |
| 8 | 14:00–16:30 | **The buffer and HLT2, cut two** (the same gesture) | 30 PB · 3 000 servers · 10 GB/s · 1 byte in 500 | lhcb-trigger-5tbs-10gbs, lhcb-upgrade1-trigger |
| 9 | 16:30–18:30 | **The CERN Data Centre and the grid** | 1 EB · 170 sites · 42 countries | cern-exabyte, cern-wlcg |
| 10 | 18:30–21:00 | **The open data and Vilnius's hands**: the Run 1 release, the Ntuple Wizard, the open-data coordination | 800 TB [CHECK which volume] · 100 000 files | lhcb-open-data, lhcb-run1-volume-sources-differ, lhcb-run1-release-sarpis, ntuple-wizard-paper-2023, lhcb-open-data-coordinator-2026 |
| 11 | 21:00–23:30 | **Cut three, the analysis**: the stored events fall away and 16 400 Λb⁰ are left; ours lands as one entry in the Λb⁰ mass peak | 16 400 · 5 620 MeV [the event's own mass] | stonkus-bsc-2026-yield |
| 12 | 23:30–26:30 | **The peak, now sharp**: the same frame as station 0, in focus, with axes; the narration names the pentaquarks | 246 000 · 7.3σ | lhcb-pentaquark-2019-yield, lhcb-pentaquark-2019 |
| 13 | 26:30–28:30 | **Pull back to Vilnius**: the whole route behind, the thesis plot on a student's screen, the city's light on the map | nothing, or the group's faces (if consented) | stonkus-bsc-2026-yield |
| — | 28:30–30:00 | slack | | |

Every station can be jumped to directly (that's the safety net), and
`rate: 0` pauses the move.

The trigger is shown as **one gesture, three times** (stations 7, 8 and 11):
the neighbouring collisions fall to dust, ours stays lit, and the ratio is
the number on screen.

The 246 000 at station 12 comes from the 2019 paper, and the 16 400 at
station 11 from the Vilnius thesis on 2012 open data. The notes say which
number comes from where.

## If the slot is shorter

- 20 min: merge 4 into 5, 8 into 7, and 10 into 9; stations of about 1.5 min.
- 15 min: as for 20 min, and drop station 6 (its 4 TB/s moves into station 7).
- Stations 0, 1, 11, 12 and 13 always stay: they are the open and the close.

## Hero shots (offline, brought in as dust)

Two or three film-quality renders. Each needs the Scheduler's slot, and none
starts before 26 Oct:

1. **The crossing** (station 3), in LHCb's real geometry, with depth of field.
2. **Cut one** (station 7): thousands of collisions falling to dust round
   the one that stays.
3. *(optional)* **The pull-back** (station 13): the whole route in one frame.

## Media and licences

Every piece is cleared before a frame is built.

| Piece | Source | Licence | Status |
|---|---|---|---|
| The event, the thesis's sample | CERN Open Data, LHCb 2012 | CC0 | ok |
| LHCb geometry | Upgrade I paper's dimensions (arXiv:2305.10515), drawn as grains | own drawing | ok |
| Phoenix glTF of LHCb | HSF Phoenix | not checked | not used unless checked |
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

- **mt-clock**: a small running time since the crossing (from 0 ns to
  2012 → 2019), shown the whole talk. It's a number with its unit, but it
  stays on screen throughout. Yes or no?
- **The peak**: the pentaquarks (the default), or another peak.
- **Faces at station 13**: who, and with whose consent.

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
