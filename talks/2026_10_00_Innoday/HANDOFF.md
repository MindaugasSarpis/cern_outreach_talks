# Innoday — handoff (2026-10-08)

**Pin.** slidev-videos feat/broadcast `efacca2` (both addons in `package.json`).
Shots: feat/shots-v2 `35340a9`, run from its worktree
(`node ~/slidev-videos/.claude/worktrees/feat-shots-v2/packages/stage/bin/shots.mjs <dist> <out> --sheet`).

**Done.**
- One spine: Prologue (zoom-out → its last frame becomes the world) → I Mašina
  → II Išradimai (time order, each slide names the machine's problem) → III Ir
  atgal (evidence, FCC, Lithuania, what firms can do) → Ačiū.
- Look: the world's ground is near-black (`palette: { base: blue, bg: '#000103' }`;
  the engine takes the ground as linear light, so blue's `#03050d` showed as
  navy), fewer and dimmer dust grains, full-bleed 2400 px photographs.
- Takeover on the real last frame of `vu_ff_zoom_galaxy.mp4`: 280 000 grains,
  gain 1.3, saturation 1.35; checked with record.mjs (slides 3–4).
- Credits fixed (Artemis II, the SM18 MgB₂ link, the data centre, MedAustron).
- Last full shots: 34 frames, clean (the two 404s are clips a local dist does
  not hold).

**Waiting on the owner.**
- The orbit clip from VU to the cosmic web (must end held on the web, no fade).
  When it arrives: uncomment `vu_orbit.mp4` in `videos/manifest.toml`, then
  `pnpm videos:sync && pnpm videos:encode && pnpm videos:publish`,
  `pnpm takeover:frame public/videos/vu_orbit.mp4 && pnpm videos:frames`,
  point slide 2's `<VideoPlayer>` at it, re-check exposure with record.mjs
  (under `flock /tmp/slidev-stage-shots.lock`), deploy.
- The spine and its wording are the owner's to confirm (no committee lines,
  no slogan cards).
- MARS wrist image © MARS Bioimaging; the date is still `10_00`.

**Next command** (from this directory, env first on PATH):

```bash
VITE_VIDEOS_LOCAL_FIRST=1 pnpm build --base / --out /tmp/innoday-dist && \
  node ~/slidev-videos/.claude/worktrees/feat-shots-v2/packages/stage/bin/shots.mjs /tmp/innoday-dist /tmp/innoday-shots --sheet --size 1600x900
```

## Status (2026-10-08, coherence pass)

Done: deck reworked for one retellable story; 28 visible slides + 1 hidden
backup; speech ~17,5 min + clips 5:33 ≈ 22 min (the event length is not
recorded anywhere — open). `pnpm build` and `stage:check` pass. Not yet:
shots and contact-sheet review (waits on the render queue and Tools'
Chromium fix), the unslop tool, deploy (Scheduler calls the order).

The story, in one breath: to see what the world is made of, physicists needed
a machine nobody could buy; every part of it was an unsolved problem; the
solutions left CERN as touchscreens, the web, PET, colour X-ray, hadron
therapy, grid computing, superconducting lines; the next machine (FCC) brings
the next round of problems, and Lithuanian firms can solve them.

## Decisions (2026-10-08)

- **Part I ends on the limits.** Order: CERN clip → Higgs → LHCb clip →
  pentaquark → "Ko reikėjo šiems atradimams" (LHC stats, formerly the second
  slide of Part I) → LHCb 4 TB/s. What the machine found answers the
  prologue's question; what it needed opens Part II. Undo: move the stats
  slide back after the CERN clip.
- **Cut to notes** (each slide's facts moved into a neighbour's notes):
  CERN 1954 counter (→ CERN clip), "Kodėl mes egzistuojame?" (question title,
  a side topic; → LHCb clip), LHCb Vilnius stats (→ LHCb clip, 4 TB/s,
  pentaquark), VELO "Lustas, apsukęs ratą" (cute title; → colour X-ray),
  "Mano CERN inovacijų dešimtukas" (repeats Part II). The 1,8 CHF HL-LHC slide
  became a "jei laikas leidžia" line under +14 %. Recover any from git
  (f752081..e8c424d).
- **Part II order by where the reader meets it**, not by year: pocket
  (touchscreen, web ×2) → hospital (PET, colour X-ray, Artemis — same chips —,
  hadron therapy) → industry today (data/White Rabbit, superconductivity with
  Airbus and F4E). Every slide keeps a "Problema:" kicker; the 1993 web slide
  now says what happened ("CERN atsisakė teisių į žiniatinklį") instead of
  "Sprendimas — visiems".
- **Part III**: section → how transfer works → +14 % for suppliers → FCC (the
  next round) → Lithuania (associate, full-membership bid) → "Ką gali
  Lietuvos įmonė" (supply, FCC, licence) → close. The section's notes name
  the firms from Part II (Siemens, MARS, ADVACAM, Airbus) as the bridge.
- **Wording removed** as slogan or antithesis: "Verslo paradoksas…",
  "Mažytė komanda — pasaulinis rezultatas", "bandymų poligonas…", "Kai durys
  atsivers plačiau…", "Klausimas tik vienas — ar jos bus lietuviškos",
  "nukeliausime", telegraphic captions ("fizika → medicina → vėl fizika",
  "White Rabbit laikas — biržose"). Kept on purpose: the prologue question
  "Iš ko visa tai sudaryta?" (the one question the talk answers) and the
  „Vague but exciting…“ callback at the close.
- **Typography**: thousands and number–unit pairs now carry no-break spaces
  (lt-copy). "kosmosą" on the LHC slide became "erdvė tarp galaktikų".
- **Notes** end with `(~N min)` (house rule) instead of starting with it.
- **Visuals unchanged** in this pass apart from slide order: every slide keeps
  its pose; the camera path still runs collider → hero → collider → web → kt
  → hero. The 4 TB/s slide moved from the galaxy station (which meant
  antimatter) to the collider.

## Open for the owner

- How long is the slot? The deck runs ~22 min; the close's notes list cuts
  for 15 min.
- The orbit clip, MARS image rights and the `10_00` date, as before.
