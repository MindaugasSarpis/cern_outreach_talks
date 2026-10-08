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
