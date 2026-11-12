// Copied 10 Nov 2026 from Užsikrauk karjerai (setup/coverCollision.js) for Tokyo's cover, unchanged.
// Copied on 25 Oct 2026 from Innoday (talk/innoday 26867e7, setup/coverCollision.js) for this talk's cover (the
// owner: "the cover slide could be more substantial, maybe a colission from innoday"); changed: `gap` (s of quiet
// between rounds, Innoday's 0,8), so the pentaquark in front stands alone most of the time.
// `cover-collision`: the cover's CMS crossing as a slow, silent loop (owner, 21 Oct:
// "Cover slide can be more substantial, say the cms collision full frame slowly";
// he chose a slow loop: "the collision replays slowly over and over (bunches meet,
// the tracks fan out across the whole frame, fade, again), so the screen lives
// while the room fills. Silent; the title stays legible on a darkened centre").
//
//   { type: cover-collision, name: cover, pos, grain?, approach?: 2.0, …lhc-opening's
//     CMS options (tone, muonTone, ecalTone, hcalTone, bunchColor, light, …) }
//
// The drawing is components/lhc-opening's CMS collision (collision-cms.js, unchanged)
// with the same 2012 CMS event (CERN Open Data record 300), built here with no sound of its own (the round's voice: `sound`, below)
// and no captions, on a clock of its own: each round runs in at full speed, nearly
// stops at the crossing, opens slowly while the tracks fan out and the calorimeters
// light, holds the full burst, fades, and runs again. Rounds in the event's own
// seconds (the time `light`, the debris's speed, counts in), against the crossing:
//
//   run-in   −2.0 … −0.5 at 1, slowing to 0.15 by the crossing      ~2.5 s
//   crossing    0 … 0.3  at 0.15: the flash blooms and dies slowly   ~2.5 s
//   fly-out   0.3 … 2.5  0.35 → 0.45: tracks, then the calorimeters  ~5.5 s
//            2.5 … 6    0.45 → 1: the last deposits, the muons out    ~5 s
//   hold        6 … 11   at 1: the whole burst, still                 ~5 s
//   fade      1.6 at 1, then 0.8 of black, and the next round         ~2.4 s
//
// about 23 s a round at the world's rate 1. One crossing flash a round, small and
// slow (flash safety: far under 3 a second).
//
// Steered by <CoverCollision> (CoverCollision.vue) through lhc-opening's bus, by the
// object's `name`: 1 while the cover is the current slide (the rounds start), 0 when
// it is left (the burst fades over 1.6 s, no new round). The draw itself listens
// under `<name>-run`, which only this loop sets.
//
// `busy` (what the shots and the stills wait for) is true for the first round only,
// until its burst stands (te ≈ 9.8): the shot and the print still then show the full
// burst, and later rounds never hold a headless tool up.
//
// The event's data comes from the deck's own bundle (setup/main.ts imports it for the
// same reason): the fill runs in the world's boot, not in the cover's first seconds.
import { buildCmsCollision } from '../components/lhc-opening/collision-cms.js'
import { bus } from '../components/lhc-opening/bus.js'
import { openingSound } from '../components/lhc-opening/sound.js'
import EVENT_CMS from '../components/lhc-opening/event-cms.json'

// [te, speed]: the round's speed against the crossing, in the event's seconds
const SPEED = [[-0.6, 1], [-0.1, 0.25], [0, 0.15], [0.3, 0.15], [0.8, 0.35], [2.5, 0.45], [4.5, 0.7], [6, 1]]
const speedAt = (te) => {
  if (te <= SPEED[0][0]) return SPEED[0][1]
  for (let i = 1; i < SPEED.length; i++) {
    const [t1, v1] = SPEED[i]
    if (te <= t1) {
      const [t0, v0] = SPEED[i - 1]
      const u = (te - t0) / (t1 - t0), s = u * u * (3 - 2 * u)
      return v0 + (v1 - v0) * s
    }
  }
  return SPEED[SPEED.length - 1][1]
}

export function installCoverCollision(registerBuilder) {
  registerBuilder('cover-collision', (o, ctx) => {
    const name = o.name || 'cover', run = `${name}-run`
    const approach = o.approach ?? 2.0
    const HOLD = o.hold ?? 11, FADE = 1.7, GAP = o.gap ?? 0.8, SETTLED = o.settled ?? 9.8
    // the draw's own clock: `local` runs at the world's pace times the round's speed
    let local = 0, lastT = null, speed = 1
    let on = false, tc = null, hiddenAt = null, first = true
    // the draw reads the rate for its streaks: the world's times the round's
    const c = Object.create(ctx)
    c.rate = () => (ctx.rate ? ctx.rate() : 1) * speed
    bus.state.delete(run)   // a rebuilt world (a lost context) starts clean
    const built = buildCmsCollision({ ...o, name: run, approach, sound: false }, c, bus, () => Promise.resolve(EVENT_CMS))

    // `sound` (Tokyo, 12 Nov; the owner: "low humm on cover slide with collision low sound (like in uzsikrauk karjerai,
    // powerful)"): the shared opening's voice (components/lhc-opening/sound.js: the sub-bass swell as the bunches run
    // in, the deep thump on the crossing, the drone held while the round runs slow, let go as it speeds up), told of
    // each round here: its start, its crossing, its speed. It needs the stage's audio, so a key or a click first.
    const snd = o.sound ? `${run}-sound` : null
    if (snd) openingSound(ctx, bus, { name: snd, level: typeof o.sound === 'number' ? o.sound : 0.5 })
    // 13 Nov (the owner: "Cover slide has nothing on collision"): the stage's audio is locked until the first key or
    // click, and the cover's first round starts as the page opens, so its voice found no audio, and the next round was
    // 20 s on, after the talk had left the cover. Now a round's voice starts as soon as there is audio, any time before
    // its crossing (`voiced`); and the first key or click on the cover ends the silent round and starts one at once
    // (`soon`), so the collision is heard on the press that unlocks the sound.
    let crossed = false, lastRate = 1, voiced = false, heard = false, soon = false
    const audible = () => { try { return !!ctx.audio?.() } catch { return false } }
    const voice = () => { if (snd && !voiced && audible()) { voiced = true; heard = true; bus.emit('start', { name: snd }) } }
    const startRound = () => { tc = local + approach; hiddenAt = null; bus.set(run, 1); crossed = false; lastRate = 1; voiced = false; voice() }
    const hide = () => { if (tc != null && hiddenAt == null) { hiddenAt = local; bus.set(run, 0); if (snd) bus.emit('stop', { name: snd }) } }
    const setOn = (k) => {
      const want = !!k
      if (want === on) return
      on = want
      if (on) { first = true; startRound() } else { hide(); first = false }
    }
    const off = bus.listen(name, setOn)
    // the press that unlocks the audio (the stage unlocks it on the same event; a moment later it is there)
    const onPress = () => { if (!snd || heard) return; setTimeout(() => { if (on && !heard && audible()) { if (hiddenAt == null) hide(); soon = true } }, 120) }
    window.addEventListener('pointerdown', onPress); window.addEventListener('keydown', onPress)
    if (bus.state.has(name)) queueMicrotask(() => setOn(bus.state.get(name)))

    const update = (t) => {
      const dt = lastT == null ? 0 : Math.max(0, t - lastT)
      lastT = t
      const te = tc == null ? null : local - tc
      speed = !on || hiddenAt != null || te == null ? 1 : speedAt(te)
      local += dt * speed
      built.update(local)
      if (snd && on && hiddenAt == null && te != null) {
        if (!crossed && te < -0.2) voice()
        if (!crossed && te >= 0) { crossed = true; if (voiced) bus.emit('cross', { name: snd }) }
        if (Math.abs(speed - lastRate) > 0.02) { lastRate = speed; bus.emit('rate', { name: snd, rate: speed }) }
      }
      if (!on || tc == null) return
      if (hiddenAt == null && local - tc >= HOLD) { hide(); first = false }
      else if (hiddenAt != null && local - hiddenAt >= FADE + (soon ? 0.2 : GAP)) { soon = false; startRound() }
    }
    const busy = () => {
      if (on) return first && (tc == null || local - tc < SETTLED)
      return hiddenAt != null && local - hiddenAt < FADE
    }
    const dispose = () => { off(); window.removeEventListener('pointerdown', onPress); window.removeEventListener('keydown', onPress); built.dispose?.() }
    return { ...built, api: { busy }, update, dispose }
  }, { fields: ['pos', 'name'] })
}
