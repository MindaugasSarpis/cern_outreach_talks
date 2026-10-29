#!/usr/bin/env node
// The kit's own check of a talk (node, no WebGL):
//
//   node components/data-kit/check.mjs talks/<talk dir> [--json]
//   node components/data-kit/check.mjs --types      # the --types list for package.json's stage:check
//
// - every dk object in the talk's space.json has its type's required fields (FIELDS in
//   each module) and a numeric `grains` (so stage:check's grain-budget counts it);
// - every data file a dk object loads (files(o) in each module) is in the talk's
//   public/dk/, and its size matches data/manifest.json (the bake's shape and dtype) and
//   the bake's own copy in data/ (a mismatch: run bake/sync.py --to <talk>);
// - a dk-hist {sort} names a dk-heap in the same space, and {over} a dk-hist; a stub type
//   is a warning; a dk-glow without the lhcb plugin or a matching detector, and a
//   dk-ground without "enterable", are warnings.
// Errors exit 1.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.removeAllListeners('warning');   // index.js is ESM in a typeless package: Node warns on import
const here = dirname(fileURLToPath(import.meta.url));
const { DK_TYPES, DK_TYPE_LIST, MODULES } = await import('./index.js');

const args = process.argv.slice(2);
if (args.includes('--types')) { console.log(DK_TYPE_LIST); process.exit(0); }
const json = args.includes('--json');
const dir = resolve(args.find((a) => !a.startsWith('--')) || '.');

const problems = [];
const filesUsed = new Map();
let counted = 0;
const add = (level, code, msg) => problems.push({ level, code, msg });

// the space file: deck.md's stage.space (default data/space.json), under public/
let spaceRel = 'data/space.json';
const deck = join(dir, 'deck.md');
if (existsSync(deck)) {
  const head = readFileSync(deck, 'utf8').split(/^---\s*$/m)[1] || '';
  const m = /^stage:[\s\S]*?^\s+space:\s*['"]?([^\s'"#]+\.json)/m.exec(head);
  if (m) spaceRel = m[1];
}
const spacePath = join(dir, 'public', spaceRel);
if (!existsSync(spacePath)) { add('error', 'no-space', `${spacePath} not found`); finish(); }
let space;
try { space = JSON.parse(readFileSync(spacePath, 'utf8')); } catch (e) { add('error', 'bad-space', `${spacePath}: ${e.message}`); finish(); }

// the bake's manifest and its own copies
const dataDir = join(here, 'data');
let manifest = {};
try {
  const m = JSON.parse(readFileSync(join(dataDir, 'manifest.json'), 'utf8'));
  manifest = m.files || m;
} catch { add('warning', 'no-manifest', `${join(dataDir, 'manifest.json')} not found or unreadable: sizes are not checked`); }
const DTYPE = { float32: 4, f32: 4, float64: 8, int32: 4, uint32: 4, int16: 2, uint16: 2, uint8: 1, int8: 1 };
function expectedBytes(entry) {
  if (!entry || !Array.isArray(entry.shape)) return null;
  if (entry.bytes != null) return Number(entry.bytes);
  const k = DTYPE[String(entry.dtype || '').split(/\s/)[0].toLowerCase()];
  return k ? entry.shape.reduce((a, b) => a * b, 1) * k : null;
}

const byType = Object.fromEntries(MODULES.map((m) => [m.TYPE, m]));
const objects = [];
for (const st of space.stations || []) for (const o of st.objects || []) objects.push({ st: st.id, o });
const heaps = new Set(objects.filter(({ o }) => o.type === 'dk-heap').map(({ o }) => String(o.name)));
for (const { st, o } of objects) {
  if (typeof o.type !== 'string' || !o.type.startsWith('dk-')) continue;
  counted++;
  const where = `${st}/${o.name ?? o.type}`;
  const mod = byType[o.type];
  if (!mod) { add('error', 'unknown-dk-type', `${where}: no kit type ${o.type} (kit: ${Object.keys(DK_TYPES).join(', ')})`); continue; }
  if (mod.STUB) add('warning', 'stub', `${where}: ${o.type} is still a stub (owned by ${mod.OWNER}): it draws nothing`);
  for (const f of mod.FIELDS) if (o[f] == null) add('error', 'missing-field', `${where}: ${o.type} needs \`${f}\``);
  if (o.grains != null && !Number.isFinite(Number(o.grains))) add('error', 'bad-grains', `${where}: grains must be a number (its tier-0 count)`);
  if (Array.isArray(o.steps)) {
    o.steps.forEach((s, k) => {
      if (k === 0 || s === 0 || s == null) return;
      if (typeof s !== 'object' || Array.isArray(s)) add('error', 'bad-step', `${where}: step ${k} must be an object`);
      else if (o.type === 'dk-hist' && s.sort != null && !heaps.has(String(s.sort))) add('error', 'unknown-heap', `${where}: step ${k} sorts from "${s.sort}", no dk-heap of that name`);
    });
  }
  for (const f of mod.files?.(o) || []) {
    const name = String(f).replace(/^\/?(dk\/)?/, '');
    if (!filesUsed.has(name)) filesUsed.set(name, where);
  }
}

// cross-form checks the engine's stage:check cannot see
const deckHead = existsSync(deck) ? (readFileSync(deck, 'utf8').split(/^---\s*$/m)[1] || '') : '';
const detectors = objects.filter(({ o }) => o.type === 'detector');
for (const { st, o } of objects) {
  const where = `${st}/${o.name ?? o.type}`;
  if (o.type === 'dk-glow') {
    // dk-glow fetches stage-data/<src>-grains.bin, served only when the deck names the plugin and a detector uses that src
    if (!/plugins:\s*\[[^\]]*lhcb/.test(deckHead) && !/plugins:\s*\n(\s+-\s*\S+\n)*\s+-\s*lhcb/.test(deckHead)) add('warning', 'glow-no-plugin', `${where}: the headmatter has no \`plugins: [lhcb]\`, so dk-glow's grains file is not served`);
    if (o.of != null && !detectors.some(({ o: d }) => String(d.name) === String(o.of))) add('warning', 'glow-of', `${where}: of "${o.of}" names no detector object in the space`);
    const src = o.src ?? 'lhcb';
    if (!detectors.some(({ o: d }) => (d.src ?? 'lhcb') === src)) add('warning', 'glow-src', `${where}: no detector uses src "${src}", so stage-data/${src}-grains.bin may not be built`);
  }
  if (o.type === 'dk-ground' && o.enterable == null) add('warning', 'ground-enterable', `${where}: add "enterable": true (stage:check's camera-inside-form cannot see the kit's flag)`);
  if (o.type === 'dk-hist' && o.over != null && !objects.some(({ o: h }) => h.type === 'dk-hist' && String(h.name) === String(o.over))) add('error', 'unknown-over', `${where}: over "${o.over}" names no dk-hist`);
}

for (const [name, where] of filesUsed) {
  const p = join(dir, 'public', 'dk', name);
  if (!existsSync(p)) { add('error', 'missing-file', `${where}: public/dk/${name} is missing (python3 components/data-kit/bake/sync.py --to ${dir})`); continue; }
  const size = statSync(p).size;
  const want = expectedBytes(manifest[name]);
  if (want != null && want !== size) add('error', 'size', `public/dk/${name}: ${size} B, the manifest says ${want} B (${JSON.stringify(manifest[name].shape)} ${manifest[name].dtype})`);
  if (!manifest[name] && Object.keys(manifest).length) add('warning', 'not-in-manifest', `public/dk/${name}: not listed in data/manifest.json`);
  const src = join(dataDir, name);
  if (existsSync(src) && statSync(src).size !== size) add('warning', 'stale-copy', `public/dk/${name} differs from data/${name} in size: run bake/sync.py --to ${dir}`);
}

finish();

function finish() {
  const errors = problems.filter((p) => p.level === 'error').length;
  if (json) console.log(JSON.stringify({ ok: !errors, problems, files: [...filesUsed.keys()] }, null, 1));
  else {
    for (const p of problems) console.log(`${p.level}: ${p.code}: ${p.msg}`);
    console.log(`data-kit: ${errors ? 'FAIL' : 'ok'}: ${counted} dk object(s), ${filesUsed.size} data file(s), ${errors} error(s), ${problems.length - errors} warning(s)`);
  }
  process.exit(errors ? 1 : 0);
}
