// The opening's captions, in Lithuanian: a number and the word that names it.
//   the tunnel     LHC, 27 km (the ring is 26.7 km round)
//   the crossing   the event's collision energy: 2012, two 4 TeV beams, √s = 8 TeV
//   the debris     the event's good tracks, counted from event.json, with the
//                  Lithuanian noun in the case its number takes
import EVENT from './event.json';

// Lithuanian: 1, 21, 31 … take the nominative singular; 2–9, 22–29 … the nominative
// plural; 10–20, 30, 40 … and every teen the genitive plural
export function ltCount(n, [one, few, many]) {
  const d = n % 10, t = n % 100;
  if (d === 1 && t !== 11) return one;
  if (d >= 2 && d <= 9 && !(t >= 12 && t <= 19)) return few;
  return many;
}

const tracks = EVENT.nGood ?? (EVENT.tracks || []).length;

export const captions = {
  tunnel: { name: 'LHC', n: '27', unit: 'km' },
  energy: { n: '8', unit: 'TeV' },
  count: { n: String(tracks), unit: ltCount(tracks, ['dalelė', 'dalelės', 'dalelių']) },
};
