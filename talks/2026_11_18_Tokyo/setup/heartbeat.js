// One heartbeat, slow and loud (the owner, 13 Nov: "when pentaquark appears, a sound of a single heartbeat loud and
// slow"): two low thumps 0.46 s apart, the first the heavier (58 -> 36 Hz), each with its octave so a small speaker
// carries it. Synthesised (Web Audio), nothing to load. Heard on the cover as the pentaquark gathers and on slide 7
// as it comes to the front; the finale's is in its clip's own sound (videos/finale/lowbang.py --beat). Only the
// audience's window plays it, and only once a key or a click has unlocked the audio.
let ctx = null
function audio() {
  try { ctx ||= new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx.state === 'running' ? ctx : null
}
export function heartbeat(level = 0.9) {
  if (typeof window === 'undefined' || /\/presenter/.test(location.pathname + location.hash)) return
  const ac = audio(); if (!ac) return
  const out = ac.createGain(); out.gain.value = level
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220
  out.connect(lp).connect(ac.destination)
  const thump = (t, f0, f1, dur, g) => {
    for (const [k, a] of [[1, 1], [2, 0.38]]) {
      const o = ac.createOscillator(), v = ac.createGain()
      o.type = 'sine'; o.frequency.setValueAtTime(f0 * k, t); o.frequency.exponentialRampToValueAtTime(f1 * k, t + dur * 0.6)
      v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g * a, t + 0.014); v.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      o.connect(v).connect(out); o.start(t); o.stop(t + dur + 0.05)
    }
  }
  const t = ac.currentTime + 0.03
  thump(t, 58, 36, 0.42, 1.0)
  thump(t + 0.46, 66, 42, 0.32, 0.72)
  setTimeout(() => { try { out.disconnect(); lp.disconnect() } catch { /* gone */ } }, 1500)
}
