// Validate public/data/space.json and every space.at / stops id in deck.md.
// Usage: node scripts/check_space.mjs   (from the talk dir; exit 1 on any problem)
import { readFileSync } from 'node:fs';
const space = JSON.parse(readFileSync('public/data/space.json', 'utf8'));
const hadrons = JSON.parse(readFileSync('public/data/hadrons.json', 'utf8'));
const deck = readFileSync('deck.md', 'utf8');
const problems = [];
const REQUIRED = {
  page: ['src', 'pos', 'width', 'height'], text: ['text', 'pos', 'height'], ring: ['pos', 'radius'],
  tracks: ['pos', 'tracks'], spheres: ['pos', 'ids', 'origin', 'scale', 'rows'], planes: ['pos', 'planes', 'origin', 'scale', 'height', 'depth'],
  cluster: ['pos', 'radius', 'quarks'], molecule: ['pos', 'separation', 'a', 'b'], grid: ['pos', 'from', 'to', 'step'], bar: ['pos', 'length', 'label'],
};
const ids = new Set();
for (const st of space.stations) {
  if (!st.id || ids.has(st.id)) problems.push(`station id missing or duplicate: ${st.id}`);
  ids.add(st.id);
  if (!Array.isArray(st.pos) || st.pos.length !== 3) problems.push(`${st.id}: pos must be [x,y,z]`);
  if (!st.look || typeof st.look.dist !== 'number') problems.push(`${st.id}: look.dist missing`);
  for (const o of st.objects || []) {
    const req = REQUIRED[o.type];
    if (!req) { problems.push(`${st.id}: unknown object type ${o.type}`); continue; }
    for (const k of req) if (o[k] === undefined) problems.push(`${st.id}/${o.type}: missing ${k}`);
    if (o.type === 'spheres') for (const id of o.ids) if (!hadrons.states.find((s) => s.id === id)) problems.push(`${st.id}/spheres: unknown state ${id}`);
    if (o.type === 'page' && !o.src.startsWith('/figures/')) problems.push(`${st.id}/page: src must start with /figures/`);
    if ((o.type === 'ring' || o.type === 'cluster') && o.id && !hadrons.states.find((s) => s.id === o.id)) problems.push(`${st.id}/${o.type}: unknown state ${o.id}`);
  }
}
const stateIds = new Set(hadrons.states.map((s) => s.id));
const named = new Set(['wide', 'origin', 'future']);
const resolves = (at) => at.startsWith('[') || ids.has(at) || stateIds.has(at) || named.has(at);
for (const m of deck.matchAll(/^\s*at:\s*([^\n#]+)/gm)) { const at = m[1].trim(); if (!resolves(at)) problems.push(`deck space.at does not resolve: ${at}`); }
for (const m of deck.matchAll(/space:\s*\{[^}]*\bat:\s*([^,}\n]+)/g)) { const at = m[1].trim(); if (!resolves(at)) problems.push(`deck inline space.at does not resolve: ${at}`); }
for (const m of deck.matchAll(/stops:\s*\[([^\]]*)\]/g)) for (const id of m[1].split(',').map((s) => s.trim()).filter(Boolean)) if (!stateIds.has(id)) problems.push(`deck stop is not a state id: ${id}`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`space.json ok: ${space.stations.length} stations, ${space.stations.reduce((n, s) => n + (s.objects || []).length, 0)} objects; deck poses resolve`);
