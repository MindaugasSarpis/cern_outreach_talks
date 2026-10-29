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
// - a dk-hist {sort} names a dk-heap in the same space, and {over} a dk-hist; a dk-heap
//   `oursFrom` names a form; `alarm: 'baked'` needs `model.rolls`; a stub type is a
//   warning; a dk-glow without the lhcb plugin or a matching detector, and a dk-ground
//   without "enterable", are warnings;
// - the owner's decision of 29 Oct (the decay is never named, no experiment internals):
//   a dk-vertex with names, and a caption (`word`) or tick text naming the particles or
//   IPχ², are warnings; `order` other than 'file', and a dims-2 `band`, are warnings;
// - the series look (bible §3: no talk overrides style.js): `tickPx` on any dk object is
//   a warning (`tick-px`), and a dk-hist `by` other than 'n' a warning.
//   Since 30 Oct: dk-landscape `gatherFrom` and dk-spark `from` must name an object, a
//   dk-spark `path` must be [[t, [x, y, z]], …], and `arrival` is 'replay' or 'keep'.
// Errors exit 1.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.removeAllListeners('warning');   // index.js is ESM in a typeless package: Node warns on import
const here = dirname(fileURLToPath(import.meta.url));
const { DK_TYPES, DK_TYPE_LIST, MODULES } = await import('./index.js');
const { LABEL } = await import('./style.js');

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
      if (s && typeof s === 'object' && o.type === 'dk-hist') {
        if (s.alarm === 'baked' && !o.model?.rolls?.file) add('error', 'alarm-baked', `${where}: step ${k} has alarm 'baked' but the object has no model.rolls (the bake's rolls carry the alarms)`);
        if (s.ticks != null && !Array.isArray(s.ticks)) add('error', 'bad-ticks', `${where}: step ${k} ticks must be a list (or null for the object's own)`);
        if (Array.isArray(s.ticks)) for (const t of s.ticks) if (!Number.isFinite(Number(Array.isArray(t) ? t[0] : t && typeof t === 'object' ? (t.v ?? t.at) : t))) add('error', 'bad-ticks', `${where}: step ${k} has a tick without a numeric value: ${JSON.stringify(t)}`);
        if (s.replay != null && s.replay !== false) add('warning', 'replay-key', `${where}: step ${k} replay is ${JSON.stringify(s.replay)}; only false changes anything (null drops an inherited false)`);
      }
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
  if (o.type === 'dk-hist' && o.order != null && o.order !== 'file') add('warning', 'hist-order', `${where}: order "${o.order}": only 'file' changes the fill order (the default is the heap's)`);
  if (o.type === 'dk-hist' && o.order === 'file' && (o.src || o.model)) add('warning', 'hist-order', `${where}: order 'file' applies to a rows source only (values), not to src or model`);
  if (o.type === 'dk-heap' && o.oursFrom != null) {
    if (typeof o.oursFrom === 'object') { if (!Array.isArray(o.oursFrom.at) || o.oursFrom.at.length !== 3 || !o.oursFrom.at.every((v) => Number.isFinite(Number(v)))) add('error', 'bad-ours-from', `${where}: oursFrom { at } needs a point [x, y, z]`); }
    else if (!objects.some(({ o: f }) => String(f.name) === String(o.oursFrom))) add('error', 'unknown-ours-from', `${where}: oursFrom "${o.oursFrom}" names no object`);
  }
  // since 30 Oct (steward2): names a form must resolve, and `arrival` takes one value
  {
    const named = (n) => objects.some(({ o: f }) => String(f.name) === String(n));
    const stepList = Array.isArray(o.steps) ? o.steps.filter((x) => x && typeof x === 'object') : [];
    for (const src of [o, ...stepList]) {
      if (o.type === 'dk-landscape' && src.gatherFrom != null && !named(src.gatherFrom)) add('error', 'unknown-gather-from', `${where}: gatherFrom "${src.gatherFrom}" names no object`);
      if (o.type === 'dk-spark' && typeof src.from === 'string' && !named(src.from)) add('error', 'unknown-spark-from', `${where}: from "${src.from}" names no object`);
      if (o.type === 'dk-spark' && src.path != null && !(Array.isArray(src.path) && src.path.every((k) => Array.isArray(k) && k.length === 2 && Number.isFinite(Number(k[0])) && Array.isArray(k[1]) && k[1].length === 3))) add('error', 'bad-spark-path', `${where}: path needs [[t, [x, y, z]], …]`);
    }
    if (typeof o.type === 'string' && o.type.startsWith('dk-') && o.arrival != null && o.arrival !== 'replay' && o.arrival !== 'keep') add('warning', 'arrival', `${where}: arrival ${JSON.stringify(o.arrival)}: only 'replay' (or the default 'keep') is known`);
  }
  if (typeof o.type === 'string' && o.type.startsWith('dk-') && o.tickPx != null) add('warning', 'tick-px', `${where}: tickPx ${o.tickPx} overrides the series' LABEL.px (style.js, ${LABEL.px} px since 29 Oct); no talk overrides style.js (bible §3): drop it`);
  if (o.type === 'dk-hist' && Array.isArray(o.steps) && o.steps.some((s) => s && typeof s === 'object' && s.by != null && s.by !== 'n')) add('warning', 'hist-by', `${where}: a step's \`by\` is ${JSON.stringify(o.steps.find((s) => s && s.by != null && s.by !== 'n').by)}; only 'n' (the selections by kept count, falling) is known`);
  if (o.type === 'dk-landscape' && o.band != null && Number(o.dims ?? 2) !== 1) add('warning', 'band-dims', `${where}: band is drawn on a dims-1 slice only`);
  if (o.type === 'dk-vertex' && (o.names === true || o.namePx != null || (Array.isArray(o.tracks) && o.tracks.some((t) => t && t.name != null)))) add('warning', 'vertex-names', `${where}: dk-vertex draws no names any more (the owner's decision, 29 Oct: the decay is never named); names, namePx and tracks[].name are ignored`);
  // captions and tick texts that name the decay or its quantities (the owner's decision)
  const NAMED = /K⁻|K\^-|π⁺|D⁰|D0\b|kaon|pion|IPχ²|IPCHI2/i;
  const texts = [o.word, ...(Array.isArray(o.ticks) ? o.ticks.map((t) => (Array.isArray(t) ? t[1] : t?.text)) : []), ...(Array.isArray(o.steps) ? o.steps.flatMap((s) => (s && Array.isArray(s.ticks) ? s.ticks.map((t) => (Array.isArray(t) ? t[1] : t?.text)) : [])) : [])];
  for (const t of texts) if (typeof t === 'string' && NAMED.test(t)) add('warning', 'named-decay', `${where}: "${t}" names the decay or its quantities on screen (the owner's decision, 29 Oct: "a short-lived particle's mass peak", "mass MeV/c²")`);
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
