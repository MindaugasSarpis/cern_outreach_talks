// The space of data (setup/dataspace.js) is woven to keep out of the camera's way, from
// capsules written by hand in space.json; a pose moved in deck.md would put a filament
// through the lens, or a pile moved in the lineup would leave its feeders and its cone
// behind. This weaves the web as the builder does and holds it against the deck: every
// filament, feeder and knot more than MARGIN units from the camera on each slide that
// shows the web (with its idle sway), from its flights in, between and out, from the
// line of sight to each slide's newest pile, and from every pile (a feeder, there only
// on its pile's slide: from that slide's camera and the piles standing there, and
// ending short of its own); and the dataspace's `piles` where the lineup and the deck
// put them. vite.config.ts runs it on every
// build, so a moved pose fails the build, naming what to move.
//
//   node setup/dataspace.check.mjs [talk dir]     prints what it found; exit 1 on a problem

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mulberry32 } from './ring.js'
import { weave, bez, segDist, dist } from './weave.js'

const MARGIN = 3
const D2R = Math.PI / 180

// a YAML flow value as the deck writes them ({ at: [1, 2, 3], dist: 4, at: wide }) as JSON
function flow(s) {
  const j = s.replace(/'([^']*)'/g, '"$1"')
    .replace(/([{,]\s*)([A-Za-z_][\w-]*)\s*:/g, '$1"$2":')
    .replace(/:\s*([A-Za-z_][\w.-]*)\s*(?=[,}\]])/g, ': "$1"')
  return JSON.parse(j)
}

// The deck's slides, each with its frontmatter's `space` (the last key of a `path`) and
// what its <Grains> sets, the steps for later included (as they stand once they land).
function slides(md) {
  const parts = md.split(/^---[ \t]*$/m)
  const out = []
  const isFm = (c) => /^\s*[A-Za-z_][\w-]*\s*:/.test(c) && !/^\s*</.test(c)
  for (let i = 1; i < parts.length; i++) {
    let fm = '', body = parts[i]
    if (i === 1 || (isFm(parts[i]) && i + 1 < parts.length)) { fm = parts[i]; body = parts[++i] ?? '' }
    out.push({ n: out.length + 1, space: readSpace(fm), sets: readSets(body) })
  }
  return out
}
function readSpace(fm) {
  const lines = fm.split('\n'), at = lines.findIndex((l) => /^space\s*:/.test(l))
  if (at < 0) return null
  const rest = lines[at].replace(/^space\s*:\s*/, '').trim()
  if (rest) return flow(rest)
  const pose = {}
  for (const l of lines.slice(at + 1)) {
    if (!/^\s/.test(l)) break
    const m = l.match(/^\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/)
    if (m && m[2]) pose[m[1]] = /^[[{'"-\d]/.test(m[2]) ? flow(m[2]) : m[2]
    const key = l.match(/^\s+-\s*(\[.*\])\s*$/)
    if (key) Object.assign(pose, flow(key[1])[1])   // a path's key: the last one is where it ends
  }
  return pose
}
function readSets(body) {
  const sets = {}
  for (const m of body.matchAll(/<Grains\b([^>]*)>/g)) {
    const set = m[1].match(/:set="(\{[^"]*\})"/), later = m[1].match(/:later="(\{[^"]*\})"/)
    if (set) Object.assign(sets, flow(set[1]))
    if (later) for (const [k, [step]] of Object.entries(flow(later[1]))) sets[k] = step
  }
  return sets
}

// where the camera stands for a pose (as the engine resolves it: a point, a station, a
// named pose), and how far its idle sway and breathing take it from there
function camera(pose, space) {
  const stations = new Map(space.stations.map((s) => [s.id, s]))
  let at = pose.at ?? 'wide', offset = null, target
  const named = { wide: { station: space.hero ?? space.stations[0].id }, ...(space.poses || {}) }
  const p = { dist: pose.dist, yaw: pose.yaw, pitch: pose.pitch, sway: pose.sway }
  const fill = (from) => { for (const k of Object.keys(p)) p[k] ??= from[k] }
  if (typeof at === 'string' && named[at] && !stations.has(at)) {
    const n = named[at]
    fill(n); offset = n.offset || null
    at = n.station ?? n.at
  }
  if (Array.isArray(at)) target = at.map(Number)
  else if (stations.has(at)) {
    const s = stations.get(at), look = s.look || {}
    target = s.pos.map((v, i) => v + ((offset || look.target)?.[i] ?? 0))
    fill(look)
  } else return null
  if (![p.dist, p.yaw, p.pitch].every((v) => typeof v === 'number')) return null
  const put = (d, y, q) => [target[0] + d * Math.sin(y * D2R) * Math.cos(q * D2R), target[1] + d * Math.sin(q * D2R), target[2] + d * Math.cos(y * D2R) * Math.cos(q * D2R)]
  const pos = put(p.dist, p.yaw, p.pitch), sway = p.sway ?? 2.5, all = []
  for (const dy of [-sway, 0, sway]) for (const dq of [-1.2, 0, 1.2]) for (const k of [0.98, 1, 1.02]) all.push(put(p.dist * k, p.yaw + dy, p.pitch + dq))
  return { pos, all, target, spread: Math.max(...all.map((x) => dist(x, pos))) }
}

export function checkDataspace(dir) {
  const md = readFileSync(join(dir, 'deck.md'), 'utf8')
  const space = JSON.parse(readFileSync(join(dir, 'public/data/space.json'), 'utf8'))
  const problems = []
  const found = []
  for (const st of space.stations) for (const o of st.objects || []) if (o.type === 'dataspace') found.push({ st, o })
  if (!found.length) return { problems, notes: ['no dataspace in space.json'] }
  const notes = []
  for (const { st, o } of found) {
    // everything in the dataspace's own frame: the station's origin, then its pos
    const origin = st.pos.map((v, i) => v + (o.pos?.[i] ?? 0))
    const local = (p) => p.map((v, i) => v - origin[i])
    const lineup = (st.objects || []).find((x) => x.type === 'lineup' && x.name === (o.lineup || 'scale'))
    const piles = o.piles || []

    // the slides that show the web, and the lineup's step on each
    const deck = slides(md)
    let on = 0, step = null, last = null
    const shown = []
    for (const s of deck) {
      if (s.space) last = s.space
      if (o.name in s.sets) on = s.sets[o.name] ? 1 : 0
      if (lineup && lineup.name in s.sets) step = s.sets[lineup.name]
      s.pose = last; s.on = on; s.step = step
      if (on) shown.push(s.n)
    }
    if (!shown.length) { notes.push(`${o.name}: no slide shows it`); continue }
    // the poses: one before the first slide that shows it (the flight in), every one that
    // does, and the one after (the flight out)
    const first = shown[0] - 1, lastN = shown[shown.length - 1] + 1
    const range = deck.filter((s) => s.n >= first && s.n <= lastN)
    const cams = []
    for (const s of range) {
      const c = s.pose && camera(s.pose, space)
      if (!c) { problems.push(`slide ${s.n}: cannot place its camera (space: ${JSON.stringify(s.pose)})`); continue }
      cams.push({ n: s.n, on: s.on, step: s.step, ...c, pos: local(c.pos), all: c.all.map(local), target: local(c.target) })
    }
    const newest = (step) => (Array.isArray(step) ? (step.length ? Math.max(...step) : -1) : typeof step === 'number' ? step : -1)

    // the piles as the lineup has them, and the dataspace's piles agreeing with it and the deck
    const bodies = []
    if (lineup) {
      lineup.balls.forEach((b, i) => {
        const p = piles.find((q) => q.ball === i)
        if (!p) { problems.push(`${o.name}: piles has no entry for the lineup's ball ${i} (${b.label})`); return }
        if (dist(p.at, b.at) > 0.01) problems.push(`${o.name}: pile ${i} (${b.label}) stands at [${b.at}] in the lineup, at [${p.at}] in its piles`)
        bodies.push({ ball: i, at: p.at, r: p.r ?? 1 })
        for (const c of b.merge?.copiesAt || []) bodies.push({ ball: i, at: c, r: piles.find((q) => q.ball === b.merge.from)?.r ?? 1, copy: true })
        const cam = cams.find((c) => c.on && newest(c.step) === i)
        if (cam && p.view && dist(p.view, cam.pos) > 2) problems.push(`${o.name}: pile ${i}'s view [${p.view}] is not where slide ${cam.n}'s camera stands [${cam.pos.map((v) => +v.toFixed(2))}]`)
        if (cam && p.look && dist(p.look, cam.target) > 2) problems.push(`${o.name}: pile ${i}'s look [${p.look}] is not where slide ${cam.n}'s camera looks [${cam.target.map((v) => +v.toFixed(2))}]`)
      })
    }

    // the web, woven as the builder weaves it
    const web = weave({ ...o, piles }, mulberry32(o.seed ?? 11))
    const samples = []
    for (const f of [...web.fils, ...web.feeds]) {
      const n = Math.max(8, Math.ceil(f.L))
      for (let i = 0; i <= n; i++) samples.push({ p: bez(f.P, i / n), m: 0, feed: f.group >= 0 ? piles[f.group].ball : -1, what: f.group >= 0 ? `a feeder into pile ${piles[f.group].ball}` : 'a filament' })
    }
    for (const kn of web.knots) samples.push({ p: kn.p, m: 4 * (0.35 + 0.28 * kn.deg), feed: -1, what: 'a knot' })

    const worst = {}
    const note = (key, d) => { worst[key] = Math.min(worst[key] ?? Infinity, d) }
    const fail = (msg) => { if (problems.length < 40) problems.push(msg) }
    const at = (p) => `[${p.map((v) => +v.toFixed(1))}]`
    for (const { p, m, feed, what } of samples) {
      for (const c of cams) {
        // a feeder is there only on its pile's slide: after the flight in, and gone a moment
        // into the flight out
        const top = newest(c.step)
        if (feed >= 0 && !(c.on && feed === top)) continue
        const d = Math.min(...c.all.map((x) => dist(p, x))) - m
        note('camera', d)
        if (d < MARGIN) fail(`slide ${c.n}: ${what} at ${at(p)} passes ${d.toFixed(1)} from the camera`)
        // the lines of sight on each slide that shows the web
        if (c.on) {
          const pile = bodies.find((b) => b.ball === top && !b.copy)
          for (const [goal, name] of [[c.target, 'what it looks at'], ...(pile && feed !== top ? [[pile.at, `pile ${top}`]] : [])]) {
            const s = segDist(p, c.pos, goal) - m
            note('sight', s)
            if (s < 2) fail(`slide ${c.n}: ${what} at ${at(p)} crosses the line of sight to ${name} (${s.toFixed(1)})`)
          }
        }
      }
      for (let i = 1; i < cams.length && feed < 0; i++) {
        const a = cams[i - 1], b = cams[i]
        if (!a.on && !b.on) continue
        const d = segDist(p, a.pos, b.pos) - m - Math.max(a.spread, b.spread)
        note('flight', d)
        if (d < MARGIN) fail(`the flight from slide ${a.n} to ${b.n}: ${what} at ${at(p)} passes ${d.toFixed(1)} from it`)
      }
      for (const b of bodies) {
        // a feeder is there only on its pile's slide, where the later piles are not yet (nor
        // those merging into the exabyte, gone before its feeders come)
        if (feed >= 0 && (b.copy || b.ball > feed)) continue
        const d = dist(p, b.at)
        if (b.ball === feed && !b.copy) {
          note('own pile', d / b.r)
          if (d < 1.4 * b.r) fail(`${what} runs to ${(d / b.r).toFixed(2)} r of its pile's middle (it should end at 1.5 r)`)
        } else {
          note('pile', d - b.r - m)
          if (d - b.r - m < MARGIN) fail(`${what} at ${at(p)} passes ${(d - b.r - m).toFixed(1)} from pile ${b.ball}${b.copy ? ' (a copy merging into it)' : ''}`)
        }
      }
    }
    const fed = piles.map((p, g) => [p.ball, web.feeds.filter((f) => f.group === g).length, p.lines ?? 0])
    for (const [ball, n, want] of fed) if (n < want) notes.push(`pile ${ball}: ${n} of ${want} feeders found room`)
    notes.push(`${o.name}: ${web.knots.length} knots, ${web.fils.length} filaments, feeders ${fed.filter(([, , w]) => w).map(([b, n]) => `${n} into pile ${b}`).join(', ')}; ` +
      `slides ${cams.map((c) => c.n + (c.on ? '' : '*')).join(' ')} (* the flights in and out); nearest: ` +
      Object.entries(worst).map(([k, v]) => `${k} ${k === 'own pile' ? v.toFixed(2) + ' r' : v.toFixed(1)}`).join(', '))
  }
  if (problems.length) problems.push('move the dataspace\'s clear capsules (or hold, or its piles) in public/data/space.json to match, or try another seed')
  return { problems, notes }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = resolve(process.argv[2] || join(fileURLToPath(import.meta.url), '../..'))
  const { problems, notes } = checkDataspace(dir)
  for (const n of notes) console.log(n)
  for (const p of problems) console.log('problem: ' + p)
  process.exit(problems.length ? 1 : 0)
}
