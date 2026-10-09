// A phone or a tablet: the talk's own forms draw fewer, smaller grains, and the
// takeover keeps to the stage's one WebGL context. iOS drops a context whose
// frames run long (the owner's iPhone/iPad, 9 Oct: the funnel flashed, then every
// world slide was black), and the funnel seen whole is ~220 000 additive points,
// thousands of them large. Known as the stage knows a phone (diagnose.js
// pickTier): a coarse pointer. `?lite` forces it on a desktop, `?lite=0` off,
// before or after the `#`.
function pick() {
  try {
    const q = new URLSearchParams(`${location.search.slice(1)}&${location.hash.split('?')[1] || ''}`)
    if (q.has('lite')) return q.get('lite') !== '0' && q.get('lite') !== 'false'
    return matchMedia('(pointer: coarse)').matches
  } catch { return false }
}
export const LITE = typeof window !== 'undefined' && pick()

// n grains, or a share of them in lite mode
export const grains = (n, share = 0.4) => (LITE ? Math.max(1, Math.round(n * share)) : n)
// a point sprite's largest size in CSS px (each one is drawn over every pixel it covers)
export const POINT_CAP = LITE ? 20 : 48
