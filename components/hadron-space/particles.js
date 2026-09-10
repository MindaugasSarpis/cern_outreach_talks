// Particle names carry their flavour as a subscript: Λb⁰, Ξb⁻, Bs⁰, Σc⁺, Λc⁺, Ξc⁰,
// ηc p, χc0 p, Pc(4312)⁺, Pcs(4338)⁰, Zc(4200)⁻. Slide text writes <sub> by hand;
// the HUD and the world labels get it from here, so hadrons.json and space.json
// stay plain text. One regex, two renderers: HTML for the HUD, segments for the
// canvas labels.
const RE = /(P)(cs|c)(?=\()|([ΛΞΩ])(b)(?=[⁰⁺⁻\s→,.)]|$)|(B)(s)(?=[⁰⁺⁻\s→,.)]|$)|([ΣΛΞΩ])(c)(?=[⁰⁺⁻⁽*(\s→,.)]|$)|(η)(c)(?=[\s(,.)]|$)|(χ)(c[012])(?=[\s(,.)]|$)|(Z)(c)(?=\()/gu;

function pair(groups) {
  const g = groups.filter((x) => x !== undefined);
  return [g[0], g[1]];
}

// "Λb⁰ → J/ψ p K⁻" → "Λ<sub>b</sub>⁰ → J/ψ p K⁻"
export function subscriptHtml(text) {
  return String(text ?? '').replace(RE, (...m) => {
    const [base, sub] = pair(m.slice(1, -2));
    return `${base}<sub>${sub}</sub>`;
  });
}

// "Λb⁰" → [{t: 'Λ', sub: false}, {t: 'b', sub: true}, {t: '⁰', sub: false}]
export function subscriptSegments(text) {
  const s = String(text ?? '');
  const out = [];
  let last = 0;
  for (const m of s.matchAll(RE)) {
    const [base, sub] = pair(m.slice(1));
    if (m.index > last) out.push({ t: s.slice(last, m.index), sub: false });
    out.push({ t: base, sub: false });
    out.push({ t: sub, sub: true });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: s.slice(last), sub: false });
  return out;
}
