// Innoday's (23 Oct, with <Soundtrack>). The deck's own sound at the presenter's hand (Innoday's owner, 22 Oct: "would be good to have
// control over sound as well"): `+` (or `=`) and `-` (or `_`) step the music and the hum
// (<Soundtrack>, <Drone>) by a tenth of their written levels, from silent to twice them.
// On a slide with a clip the same keys are the clip's own (VideoPlayer's session volume,
// which marks the key handled): this one steps only when nothing else took the press.
// The level sticks in this browser (localStorage) and crosses windows: a press in the
// presenter's window sets the audience window's music, where the music plays. The audience
// sees nothing (owner, 22 Oct: "invisible, but -+ to control"); the presenter's window shows
// the level for a moment.
const KEY = 'uzsikrauk:sound'
const subs = new Set()
let level = read()

function read() {
  try {
    const v = parseFloat(localStorage.getItem(KEY))
    return Number.isFinite(v) && v >= 0 && v <= 2 ? v : 1
  } catch { return 1 }
}
function apply(v) {
  level = v
  for (const f of subs) { try { f(v) } catch {} }
}
// the multiplier on every written level (1: as written)
export const soundLevel = () => level
// f(level) on every change; returns the unsubscribe
export function onSoundLevel(f) { subs.add(f); return () => subs.delete(f) }
// pages where the keys are the music's even over a clip (<Soundtrack keys>: slide 30's clip is
// the recorded close, silent, and the owner wants the music there at his hand)
const musicPages = new Set()
export const musicKeys = (n) => { musicPages.add(Number(n)) }
const pageNow = () => Number((location.hash.match(/(\d+)(?:\?.*)?$/) || [])[1] || 0)
function step(up) {
  const v = Math.max(0, Math.min(2, Math.round((level + (up ? 0.1 : -0.1)) * 10) / 10))
  try { localStorage.setItem(KEY, String(v)) } catch {}
  apply(v)
  flash(v)
}

let badge = null, badgeTimer = 0
function flash(v) {
  if (!/presenter/.test(location.hash + location.pathname)) return
  if (!badge) {
    badge = document.createElement('div')
    badge.className = 'innoday-sound-badge'
    badge.setAttribute('aria-live', 'polite')
    document.body.appendChild(badge)
  }
  badge.textContent = `♪ ${Math.round(v * 100)} %`
  badge.classList.add('on')
  clearTimeout(badgeTimer)
  badgeTimer = setTimeout(() => badge.classList.remove('on'), 1200)
}

export function installSoundKeys() {
  if (typeof window === 'undefined' || window.__innodaySoundKeys) return
  window.__innodaySoundKeys = true
  addEventListener('storage', (e) => { if (e.key === KEY) apply(read()) })
  addEventListener('keydown', (e) => {
    const up = e.key === '+' || e.key === '=', down = e.key === '-' || e.key === '_'
    if (!up && !down) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
    // after every other listener: a clip's player takes the press first
    setTimeout(() => { if (!e.defaultPrevented) step(up) })
  })
  // on a music page the press is the music's before the clip's player sees it
  addEventListener('keydown', (e) => {
    const up = e.key === '+' || e.key === '=', down = e.key === '-' || e.key === '_'
    if ((!up && !down) || e.metaKey || e.ctrlKey || e.altKey || !musicPages.has(pageNow())) return
    const t = e.target
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
    e.preventDefault(); e.stopImmediatePropagation()
    step(up)
  }, true)
}
