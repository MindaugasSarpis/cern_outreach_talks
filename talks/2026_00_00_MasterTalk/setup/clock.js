// The running clock (mt-clock, the owner's choice of 18 Oct 2026): the time
// since the crossing, with its unit, small at the frame's lower left. One
// element for the whole talk, outside the slides, so it never blinks at a
// slide change; each slide sets it through <Clock>. It counts from `from` to
// `to` over `run` seconds and then holds, or follows `keys`, [[s, value], …]
// in seconds from the slide's opening, linear between, the last holding; it grows for a moment when its unit
// changes (a rung jumped), and it can fade out (`off`), as it does once the
// dot has landed.

let el, num, unitEl, raf = 0, shown = null

function ensure() {
  if (el) return
  el = document.createElement('div')
  el.className = 'master-clock'
  el.setAttribute('aria-hidden', 'true')
  num = document.createElement('span'); num.className = 'n'
  unitEl = document.createElement('span'); unitEl.className = 'u'
  el.append(num, unitEl)
  document.body.appendChild(el)
}

// 12 345 678 with thin no-break spaces; a minus sign, not a hyphen
function fmt(v, digits) {
  const s = Math.abs(v).toFixed(digits)
  const [i, f] = s.split('.')
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (v < 0 ? '−' : '') + g + (f ? '.' + f : '')
}

export function setClock({ from, to = from, unit = 'ns', run = 0, digits = 0, off = false, keys = null }) {
  if (typeof document === 'undefined') return
  ensure()
  cancelAnimationFrame(raf)
  if (off) { el.classList.remove('on'); shown = null; return }
  const jumped = shown && shown.unit !== unit
  el.classList.add('on')
  unitEl.textContent = unit
  if (jumped) { el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump') }
  const K = keys?.length ? keys : [[0, from], [Math.max(run, 0), to]]
  const t0 = performance.now(), end = K[K.length - 1][0]
  const at = (s) => {
    if (s <= K[0][0]) return K[0][1]
    for (let i = 1; i < K.length; i++) if (s <= K[i][0]) {
      const [a, va] = K[i - 1], [b, vb] = K[i]
      return b > a ? va + (vb - va) * (s - a) / (b - a) : vb
    }
    return K[K.length - 1][1]
  }
  const step = () => {
    const s = (performance.now() - t0) / 1000
    num.textContent = fmt(at(s), digits)
    if (s < end) raf = requestAnimationFrame(step)
  }
  step()
  shown = { unit }
}
