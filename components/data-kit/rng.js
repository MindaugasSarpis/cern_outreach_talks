// Seeded randomness for every placement, order and toy in the kit, so plates,
// stills, shots and the recorder all see the same picture (bible §3: "every
// placement and sample is seeded").

// mulberry32: a small fast 32-bit generator; () → [0, 1)
export function mulberry32(seed) {
  let a = (Number(seed) >>> 0) || 0x9e3779b9;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// a standard normal from a generator (Box-Muller, one of the pair)
export function gauss(rnd) {
  let u = 0;
  while (u <= 1e-12) u = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

// a Poisson count with mean lam (Knuth below 40, a rounded normal above)
export function poisson(rnd, lam) {
  if (!(lam > 0)) return 0;
  if (lam < 40) {
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= rnd(); } while (p > L);
    return k - 1;
  }
  return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss(rnd)));
}

// Fisher-Yates in place
export function shuffle(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// The series' order of n candidates: rank[row] in 0..n-1, a seeded shuffle, with
// `ours` (a row, or null) put last. dk-heap rains in this order (rank 0 lands first,
// lowest in the pile; ours lands last, on top), and dk-hist takes grains out of a
// heap in the reverse order (the top of the pile first: ours first). Cached: every
// form asking for the same (n, seed, ours) gets the same array.
const orders = new Map();
export function order(n, seed, ours = null) {
  const key = `${n}:${seed}:${ours}`;
  if (orders.has(key)) return orders.get(key);
  const perm = new Int32Array(n);
  for (let i = 0; i < n; i++) perm[i] = i;
  shuffle(perm, mulberry32(seed));
  const rank = new Int32Array(n);
  for (let i = 0; i < n; i++) rank[perm[i]] = i;
  if (ours != null && ours >= 0 && ours < n) {
    const r = rank[ours];
    for (let i = 0; i < n; i++) if (rank[i] > r) rank[i]--;
    rank[ours] = n - 1;
  }
  orders.set(key, rank);
  return rank;
}
