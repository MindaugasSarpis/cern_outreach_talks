// The shared kit of "Data analysis, the CERN way": the dk- forms every talk of the
// series draws its data with (bible §4). A talk installs it from setup/main.ts:
//
//   import * as stage from 'slidev-addon-stage'
//   import { installDataKit } from '../components/data-kit/index.js'
//   export default ({ app }) => { installDataKit({ app, stage }) }
//
// Kit files never import 'slidev-addon-stage' (it does not resolve from the root
// components/ directory; each talk pins its own copy): everything from the engine
// arrives in `stage`, and each module exports install(stage, kit). They may import
// 'three' (the root package has it; the addon's vite config dedupes it).
//
// Each module also exports TYPE, FIELDS (what an object must carry), OWNER and
// files(o) (the data files an object loads), which check.mjs reads.
import { Group } from 'three';
import * as style from './style.js';
import * as rng from './rng.js';
import { sampler, samplerOn } from './sampler.js';
import * as label from './label.js';
import * as morph from './morph.js';
import * as hist from './hist.js';
import * as heap from './heap.js';
import * as trigger from './trigger.js';
import * as glow from './glow.js';
import * as lineup from './lineup.js';
import * as ground from './ground.js';
import * as spark from './spark.js';
import * as vertex from './vertex.js';
import * as bell from './bell.js';
import * as curve from './curve.js';
import * as landscape from './landscape.js';
import * as scatter from './scatter.js';
import * as pipeline from './pipeline.js';

export const MODULES = [hist, heap, trigger, glow, lineup, ground, spark, vertex, bell, curve, landscape, scatter, pipeline];
// { 'dk-hist': { fields, owner, stub }, … }
export const DK_TYPES = Object.fromEntries(MODULES.map((m) => [m.TYPE, { fields: m.FIELDS, owner: m.OWNER, stub: !!m.STUB }]));
export const DK_TYPE_LIST = Object.keys(DK_TYPES).join(',');

// Data files live in each talk's public/dk/ (bake/sync.py copies them there) and are
// fetched at runtime, once per page, through ctx.asset so a Pages base works.
const cache = new Map();
const url = (ctx, file) => (ctx.asset ? ctx.asset('/dk/' + String(file).replace(/^\/?(dk\/)?/, '')) : '/dk/' + file);
function fetchOnce(ctx, file, kind) {
  const u = url(ctx, file);
  const key = kind + ':' + u;
  if (!cache.has(key)) {
    cache.set(key, fetch(u).then((r) => {
      if (!r.ok) throw new Error(`${u}: HTTP ${r.status}`);
      return kind === 'json' ? r.json() : r.arrayBuffer();
    }));
  }
  return cache.get(key);
}

function makeKit(stage) {
  const forms = new Map();
  const kit = {
    stage, style, rng, sampler, samplerOn, morph,
    label: {
      ...label,
      // a fixed-size label in the kit's look: kit.label.make('1 860', { px, color, align, hang })
      make: (text, opts) => label.fixedLabel(stage, text, opts),
    },
    // ---- data ----
    loadJSON: (ctx, file) => fetchOnce(ctx, file, 'json'),
    loadF32: async (ctx, file) => new Float32Array(await fetchOnce(ctx, file, 'bin')),
    // a row-major float32 table and its header (<stem>.json: { n, cols }), or `cols` given
    async loadTable(ctx, file = 'd0.f32', cols = null) {
      const head = cols ? { cols } : await kit.loadJSON(ctx, String(file).replace(/\.f32$/, '.json'));
      const data = await kit.loadF32(ctx, file);
      const names = head.cols || [];
      const w = Math.max(1, names.length);
      const n = Math.floor(data.length / w);
      const colCache = new Map();
      return {
        n, cols: names, data, head,
        col(name) {
          if (colCache.has(name)) return colCache.get(name);
          const j = names.indexOf(name);
          if (j < 0) return null;
          const c = new Float32Array(n);
          for (let r = 0; r < n; r++) c[r] = data[r * w + j];
          colCache.set(name, c);
          return c;
        },
      };
    },
    // record 401 as the series uses it: d0.f32 + d0.json
    loadD0: (ctx) => kit.loadTable(ctx, 'd0.f32'),
    // ---- forms by name (a dk-hist sorting a dk-heap, a curve in a hist's frame, a
    // scatter taking a hist's grains). Each dk form registers { type, api } under its name.
    forms,
    register(name, entry) { forms.set(String(name), entry); },
    unregister(name) { forms.delete(String(name)); },
    form: (name) => forms.get(String(name)) || null,
    // the empty form a stub registers until its owner writes it: nothing to draw, done at once
    stubForm(o) {
      const group = new Group();
      group.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
      return { group, api: { arm() {}, assemble(t, onDone) { onDone?.(); }, busy: false, value: () => 0 } };
    },
  };
  return kit;
}

let installed = null;
export function installDataKit({ app, stage } = {}) {
  if (!stage || typeof stage.registerBuilder !== 'function') throw new Error("installDataKit: pass { stage } (import * as stage from 'slidev-addon-stage')");
  if (installed && installed.stage === stage) return installed;
  const kit = makeKit(stage);
  for (const m of MODULES) m.install(stage, kit);
  installed = kit;
  return kit;
}
