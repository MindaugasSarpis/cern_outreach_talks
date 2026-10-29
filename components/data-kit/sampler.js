// Sampling a density by its tabulated cumulative sum. Lifted from MasterTalk's
// setup/funnel.js l.78-88 (Oct 2026), unchanged but for the export and the
// inverse-CDF helper below.
//
// a density along t in [0, 1] → a sampler: u in [0, 1) → t, by its tabulated
// cumulative sum (deterministic: u comes from a seeded generator or a hash, so
// every build is the same)
export function sampler(f, n = 1024) {
  const c = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) c[i + 1] = c[i] + Math.max(0, f((i + 0.5) / n));
  return (u) => {
    const x = u * c[n]; let lo = 0, hi = n;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= x) lo = m; else hi = m; }
    return (lo + (x - c[lo]) / Math.max(c[lo + 1] - c[lo], 1e-12)) / n;
  };
}

// The same over [lo, hi] in the density's own units: f(x) → u ↦ x.
export function samplerOn(f, lo, hi, n = 2048) {
  const s = sampler((t) => f(lo + t * (hi - lo)), n);
  return (u) => lo + s(u) * (hi - lo);
}
