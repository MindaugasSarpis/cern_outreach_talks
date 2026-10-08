export const meta = {
  name: 'talk-review',
  description: 'Review a pinned snapshot of a talk (facts, copy and timing, visuals from contact sheets, performance, slide state and render contexts); each reviewer is verified as soon as it lands; findings deduped by slide and kind; returns kept[] and unverified[]',
  whenToUse: 'Before pnpm talk ready, or after a large edit. args: { talk: "talks/<dir>", repo: "<worktree root>", head: "<git rev-parse HEAD>", snapshot: "<git stash create SHA, or HEAD>", today: "YYYY-MM-DD", site?: "/tmp/talk-<slug>/site", slug?, lang?: "en"|"lt", duration?: minutes, delivery?: "venue"|"broadcast", since?: "<SHA of the last verified review>", sheets?: [paths], ndjson?: path, lenses?: ["facts","copy","visual","perf","state"], stageBin?, done?: [lenses an earlier run on the same snapshot finished] (skipped on a re-run), effort?: { stage or label: "low"|"medium"|"high"|"xhigh"|"max" }, models?: { stage or label: model id } (none pinned) }',
  phases: [
    { title: 'Review', detail: 'one reviewer per lens, all judging the same pinned snapshot' },
    { title: 'Verify', detail: 'one verifier per reviewer batch, started as soon as that reviewer lands' },
  ],
}

// Generalised from opendata-talk-review (7 October 2026) and the Innoday deck
// review. What changed: every agent judges one pinned snapshot (HEAD plus a
// `git stash create` SHA), so no verdict is spent on text that was fixed
// meanwhile (39 of 45 verifications were in the OpenData run); reviewers and
// verifiers form a pipeline with no barrier; one verifier per reviewer batch
// instead of one per finding; the code review is split into performance (fps
// probe first), slide state and render contexts, each with a soft time budget;
// high findings are logged the moment they land; everything not checked is
// returned in unverified[].

const A = args || {}
if (!A.talk || !A.repo || !A.head || !A.today) {
  throw new Error('talk-review: args.talk, args.repo, args.head (git rev-parse HEAD) and args.today are required; pass args.snapshot from `git stash create` when the tree is dirty')
}
const REPO = String(A.repo).replace(/\/+$/, '')
const TALK = String(A.talk).replace(/\/+$/, '').replace(REPO + '/', '')
const NAME = TALK.split('/').pop()
// As scripts/new_talk.py worktree_slug: 2026_10_00_OpenData -> opendata, so the
// default site is the /tmp/talk-<slug>/site that `pnpm talk build` writes.
const SLUG = A.slug || (/^\d{4}_\d{2}_\d{2}_./.test(NAME) ? NAME.slice(11) : NAME).toLowerCase().replace(/_/g, '-')
const HEAD = A.head
const SNAP = A.snapshot || A.head
const TODAY = A.today
const LANG = A.lang === 'lt' ? 'lt' : 'en'
const BROADCAST = A.delivery === 'broadcast'
const SITE = A.site || `/tmp/talk-${SLUG}/site`
const STAGE_BIN = A.stageBin || `\${SLIDEV_STAGE_BIN:-${REPO}/${TALK}/node_modules/slidev-addon-stage/bin}`
const SHEETS = Array.isArray(A.sheets) ? A.sheets : []
const NDJSON = A.ndjson || ''
const SCRATCH = `/tmp/talk-review-${SLUG}`
// One directory per snapshot: the exports, and <lens>.json for each lens that
// finished (its findings with their verdicts). `ls ${RUN}/*.json` names the
// lenses a re-run on the same snapshot can pass as args.done; a run that can
// still be resumed by its run id needs none of this.
const RUN = `${SCRATCH}/${SNAP.slice(0, 12)}`
const exportDir = (lens) => `${RUN}/export-${lens}`
const resultFile = (lens) => `${RUN}/${lens}.json`
const DONE = new Set((Array.isArray(A.done) ? A.done : []).map(String))

// Effort per stage, set here rather than inherited (the usage audit of 8 October
// 2026 found every sampled agent message at effort xhigh). The split is not
// measured yet. args.effort overrides it by label ("verify:copy") or by stage
// ("review"). The model is the owner's choice through args.models (a label or
// a stage to a model id); none is pinned here, so every agent inherits the
// session's model.
const EFFORT = { review: 'medium', verify: 'medium', 'verify:facts': 'high' }
const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max']
for (const [k, v] of Object.entries(A.effort || {})) {
  if (!LEVELS.includes(v)) throw new Error(`talk-review: args.effort.${k} is ${JSON.stringify(v)}; use one of ${LEVELS.join(', ')}`)
}
const pick = (map, label) => (map && typeof map === 'object' ? map[label] || map[label.split(':')[0]] : undefined)
const opts = (label, phase, schema) => {
  const o = { label, phase, schema, effort: pick(A.effort, label) || pick(EFFORT, label) }
  const model = pick(A.models, label)
  if (model) o.model = String(model)
  return o
}

const HOUSE = `HOUSE RULES (they bind every agent in this run; you will not see them anywhere else):
- Report in English. Never write Russian. Lithuanian only inside proposed slide text and notes.
- Read only. Do not edit any file in ${REPO}; your result is the report. Scratch files go under ${SCRATCH}/.
- No git command that changes state (no commit, stash, checkout, merge, push, reset). Never touch the main checkout (the first entry of \`git worktree list\`) or another talk.
- Renders share the machine with other sessions: \`pnpm talk shots\`, \`record\` and \`safe\` queue for the render slot themselves; run any other headless browser or encode through \`pnpm talk render -- <command>\`. At most 4 slides per run, 1280x720 or smaller.
- Never let one command block for more than 240 s (give Bash a timeout of at most 240000 ms), and never sleep or poll in a loop. Work that would take longer goes into your result as an open item instead of a wait. Read only the fields you need from a command's JSON or log.
- Never pkill -f a pattern from your own command; kill by PID. Quote globs (the shell may be zsh). If node, pnpm or ffmpeg misbehave, \`pnpm talk doctor\` says which binary is first on PATH.
- Never put the owner's email address into a request, header, URL or User-Agent. Never create claude.ai artifacts. Never ask the owner a question.`

const SNAPSHOT = `THE SNAPSHOT YOU JUDGE: commit ${SNAP} in ${REPO} (HEAD was ${HEAD}${SNAP !== HEAD ? '; the snapshot adds the uncommitted changes of tracked files' : ''}). Export it first and read only the export:
  mkdir -p ${'$'}D && git -C ${REPO} archive ${SNAP} -- ${TALK} | tar -x -C ${'$'}D
with D set to the directory named in your task. The talk is ${'$'}D/${TALK}: deck.md (slides; a slide's last <!-- --> comment is its speaker notes, and facts are cited as <!-- facts: id --> in a separate comment placed before the notes comment, never as the slide's last comment), public/data/space.json (the 3D world), setup/ (talk-owned builders and components), styles/index.css, videos/manifest.toml, CLAUDE.md (Brief, Figures, Decisions). Read the facts bank and the repo scripts from ${REPO} itself; they are not under review. A file the deck needs but the export lacks was untracked at snapshot time: read it from ${REPO}/${TALK} and say so. Slide numbers are as \`python3 ${REPO}/scripts/talk_map.py ${'$'}D/${TALK} --json\` counts them (if the script exists; else count the --- separators, the headmatter being slide 1). Report against the snapshot; the main session applies fixes to the current text.`

const BAR = `THE OWNER'S BAR (verbatim; these are the acceptance criteria):
- Busy: "at some angles the screen is too busy with everything and words are difficult to make out, more importantly, the plots don't immediately correspond to the text"; "slide 20 too busy, barely readable".
- Meaning: "the space doesn't bear any meaning"; "isn't clear what they symbolize"; "now it's confusing and doesn't serve any purpose".
- Slop: "no sloppy wording like marketing"; '"The data are in the analyses are not" and similar sounds a lot like AI'; "I don't even use word cosmos".
- Rigour: "before slide 11 need a rigorous introduction what a dalitz plot is"; "if it's a cusp.. it's not a particle?".
- Wow: "Has to look really good, like apple keynote intro, has to have enough content"; "the sound should be a continuous low humm".
- Flow: "Will they smoothly move from one to another?"; "Now the flow is a bit broken here".
- Render: "Zweig paper is just white"; "The Pentaquark flickers".`

const VOICE = `VOICE: plain, direct, precise. One claim per slide; a title of six words or fewer, sentence case, declarative or a plain label; no question titles, Title Case or cute lines. At most 60 words on screen outside tables. English: no em dashes in body text, no "X, not Y", no slogans or fragments, no idioms or superlatives, no anthropomorphic verbs (a fit does not "see", data do not "say"), no colon glosses, no emoji. Journal-style references (PRL, PLB, PRD, EPJC). Every number sourced: one .src line per slide, a facts comment before the notes. Notes carry the spoken script and end with (~N min).${LANG === 'lt' ? `
LITHUANIAN: natural spoken Lithuanian, no calques; „…“ quotes; decimal comma; a no-break or thin no-break space in thousands and before units and %; dates "1989 m. kovo 12 d."; em dashes are correct; no English UI words (Dalis, Ačiū, Klausimai); mixed-case names such as LHCb never inside uppercased kit text without a text-transform:none wrapper. Settled terms: pasaulinis žiniatinklis, jutiklinis ekranas, žinių perdavimas, asocijuotoji narė, visateisė narystė, Didysis hadronų greitintuvas, pluoštas, susidūrimas, šviesis, žavusis kvarkas, gražusis kvarkas, kolaboracija, antimaterija.` : ''}`

const WORLD = `THE WORLD: one persistent 3D world of grains under every slide (slidev-addon-stage; the pinned README is ${REPO}/${TALK}/node_modules/slidev-addon-stage/README.md, the summary ${REPO}/docs/STAGE_QUICKSTART.md). Every world object on a slide maps to a sentence or label on that slide, or it goes. Everything is grains; solid shapes and labels read as a classroom diagram. Text sits on a dimmed world (dim 0.6 on content slides, 0.2-0.35 where the world is the picture).${BROADCAST ? ' This talk is BROADCAST: readable text at least 37 canvas px (49 better), headlines 72-92, kickers 24 or more, nothing under 16 incl. .src, at most two lines of about 28 characters, text inside x 98-882 and y 55-408 with the logo, super and clock corners clear, no film grain or aberration, bursts under 10 % of the frame and at most one per 1.5 s.' : ' Projector floors on the 980 px canvas: body and cards 20 px, nothing under 18 px outside .src and credits.'}`

const CONTEXT = `THE TALK: ${TALK} in ${REPO}. Language ${LANG}${A.duration ? `, duration ${A.duration} min` : ''}. Today is ${TODAY}. The facts bank is ${REPO}/research/facts.jsonl (verdict confirmed | corrected | unverified | refuted).

${HOUSE}

${SNAPSHOT}`

const LIST = 'Report only real problems, worst first, each with the exact fix (for text: old = the exact span at the snapshot, fix = the replacement). Spend at most about 15 minutes; when you reach that, stop and return what you have, listing what you did not get to under not_checked.'

const LENSES = {
  facts: `You are an adversarial FACT-CHECKER. ${A.since ? `Check only claims that are new or changed since commit ${A.since}: \`git -C ${REPO} diff ${A.since} ${SNAP} -- ${TALK}/deck.md\`, plus any figure that cites no fact id.` : 'Check every factual claim on the slides and in the notes.'} A claim that cites a bank fact with verdict confirmed or corrected, verified within six months, and is worded no further than the stored claim needs no web check; check that the wording matches. Everything else (numbers, dates, names, "first"s, rankings, attributions, quotations, captions, each .src line against what its slide says) goes against primary sources (load WebSearch and WebFetch with ToolSearch). Known traps: CERN made the web, not the internet; touchscreen priority (E.A. Johnson 1965); a "first" resting on an absence of records; capacity against data collected; Run 2 6.5 TeV vs Run 3 6.8 TeV; Internet users vs Web users; counts that change; charge-consistent thresholds; candidates, not decays, for yields; author lists against INSPIRE. Default to reporting only with evidence.`,
  copy: `You are the COPY EDITOR, TIMING and FLOW reviewer. First run the deterministic lint on the export: \`python3 ${REPO}/scripts/talk_lint.py ${'$'}D/${TALK} --json\` (if the script exists); do not re-report what it finds, report what it cannot see, with one exception: report each FACT-NOTES warning as high, because that slide's facts comment is its last comment and has replaced the speaker notes (fix: move the facts comment above the notes comment). Read the deck slide by slide as the audience in the Brief. Check: one idea per slide, readable in about ten seconds; the voice rules below; jargon the audience will not follow (the smallest plain fix that keeps precision); every term or plot introduced before it is used; consistent terms, names and diacritics; the arc (does each part earn its place, does the close land, is the takeaway delivered); the speaker notes as spoken text. TIMING: sum the (~N min) notes and the clip durations against the duration and give the total; if over, propose what to drop first. Slide references in notes ("slide N") must point at the right slide.${LANG === 'lt' ? ' You are a native Lithuanian editor with a physics background: proofread every Lithuanian sentence on slides and in notes.' : ''}\n\n${VOICE}`,
  visual: `You are the VISUAL reviewer. Open at most 12 images in all: the contact sheets first, then single frames (the png of a report line) only for slides a sheet or the report flags. Read the contact sheets ${JSON.stringify(SHEETS)}${NDJSON ? ` and the shots report ${NDJSON} (one JSON line per frame: slide, click, station, renderer, dpr, overflowPx, pageErrors, wordsOnScreen, textBoxes with fontPx, lumMean and lumVar)` : ''}. Judge every slide as the owner would, calibrated on the bar below: busy or illegible slides, text over bright or busy world detail (high lumVar behind body text), anything near white (lumMean), overflow and page errors, type under the floor, uppercased mixed-case names (LHCB), a lower third that is not clear, world objects that carry no sentence on their slide, a camera angle that confuses, a slide that looks like a document instead of one picture and one claim. Text only: never paste images. Name each slide by number and title.\n\n${WORLD}`,
  perf: `You are the PERFORMANCE reviewer. Step 1, before reading code: probe the frame rate on the built site ${SITE} (build it first with \`cd ${REPO} && pnpm talk build ${NAME}\` if it is missing). Use \`pnpm talk render -- node ${STAGE_BIN}/shots.mjs ${SITE} ${SCRATCH}/probe --probe --slides <the 2-4 heaviest slides>\`; if that tool has no --probe, load each slide headless (a script run the same way, through pnpm talk render) and read document.querySelector('.stage canvas').__space.frames and .elapsed twice, 10 s apart (frames per second, engine seconds per wall second). Below 0.5 engine-s per s at 1280x720 is a fill-rate or vertex problem in the talk. Step 2: read setup/*.js and space.json for its cause: grain counts drawn on slides where they are not seen, point sprites that grow near the camera without a clamp or a fade, additive overdraw under bloom, per-frame JavaScript loops over many grains, buffers re-uploaded every frame, every station drawn every frame, the frame-rate guard stepping quality down. Give the measured numbers and exact code fixes.`,
  state: `You are the SLIDE STATE and RENDER CONTEXT reviewer for the talk-owned code (setup/*, components, the <Grains>/<Count> steps, space.json poses) on the engine's builder contract (builders return { group, update(t, camPos), api: { arm, assemble(now, onDone) }, dispose }; onDone must always be called; the engine clock clamps the step to 1/12 s). Check: going back and forth across slides, fast clicks, a deep link straight to a middle slide (#/N) and a reload there, the 'c' replay, steps that must persist across slides, a form built after its step was set, the presenter window (a second world, sound only once), the overview grid, print and PDF export (counters must show their final value), reduced motion, HMR listener leaks, GLSL ES 3.00 problems (reserved words, int and float mixing, smoothstep with edge0 > edge1). Use \`slidev dev\` or the built site ${SITE} headless (through \`pnpm talk render -- <command>\`) when you need to see it; scratch scripts under ${SCRATCH}/.`,
}
const DEFAULT_LENSES = ['facts', 'copy', 'visual', 'perf', 'state']
let chosen = (Array.isArray(A.lenses) && A.lenses.length ? A.lenses : DEFAULT_LENSES).filter((l) => LENSES[l])
const skipped = chosen.filter((l) => DONE.has(l))
if (skipped.length) log(`done in an earlier run on this snapshot, skipped: ${skipped.join(', ')} (results in ${RUN}/)`)
chosen = chosen.filter((l) => !DONE.has(l))
if (chosen.includes('visual') && !SHEETS.length && !NDJSON) {
  chosen = chosen.filter((l) => l !== 'visual')
  log('visual lens skipped: pass args.sheets (contact sheets) and args.ndjson from pnpm talk review --json')
}

const ISSUES = {
  type: 'object',
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slide: { type: 'integer', description: 'slide number; 0 for deck-wide' },
          title: { type: 'string' },
          where: { type: 'string', enum: ['screen', 'notes', 'world', 'code', 'css', 'space'] },
          kind: { type: 'string', enum: ['fact', 'copy', 'language', 'timing', 'flow', 'rigour', 'visual', 'meaning', 'perf', 'state', 'context'] },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          problem: { type: 'string' },
          evidence: { type: 'string', description: 'URL and quote, measured numbers, or file:line' },
          old: { type: 'string', description: 'the exact span at the snapshot when the fix is a replacement' },
          fix: { type: 'string', description: 'the exact replacement or change' },
        },
        required: ['slide', 'kind', 'severity', 'problem', 'evidence', 'fix'],
      },
    },
    not_checked: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['issues', 'not_checked'],
}
const VERDICTS = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'integer' },
          real: { type: 'boolean' },
          reason: { type: 'string' },
          better_fix: { type: 'string', description: 'when the problem is real but the proposed fix is wrong or worse' },
        },
        required: ['index', 'real', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

const VERIFY_LENS = {
  facts: 'You are a second fact-checker. Try to REFUTE each claimed error from the primary sources (WebSearch and WebFetch via ToolSearch). real = the deck is wrong or overstated and the fix is better supported than the old text. Default to real=false when the evidence is unclear.',
  copy: LANG === 'lt'
    ? 'You are a second native Lithuanian editor. Accept an edit only if the new text is correct, natural Lithuanian, keeps the meaning and is at least as good; reject preference edits. For timing and flow issues, recount the minutes yourself.'
    : 'You are a second editor. Accept an edit only if it fixes a real violation of the voice rules, an unclear or unintroduced term, a flow break or a timing error, keeps the meaning and adds no new fact or pattern; reject preference edits. Recount the minutes yourself.',
  visual: 'You are a second visual reviewer. Look at the same contact sheets (at most 12 images in all, the sheets first) and report; accept a finding only if you see the problem yourself or the metrics show it, and the fix would remove it without breaking another slide.',
  perf: 'You are a second performance reviewer. Accept a finding only if the measurement or the code shows it; rerun the probe on one slide if the numbers look off (through pnpm talk render).',
  state: 'You are a second reviewer of the slide state and render contexts. Accept a bug only if you can show it from the code path or reproduce it; reject speculative ones.',
}

const review = (lens) => agent(`${CONTEXT}

${LENSES[lens]}

${BAR}

${LIST}
Use D=${exportDir(lens)} for the export. If you find no issues, also write {"lens": "${lens}", "head": "${HEAD}", "snapshot": "${SNAP}", "issues": [], "not_checked": [...]} as JSON to ${resultFile(lens)} before you return; otherwise write nothing there (the verifier does).`, opts(`review:${lens}`, 'Review', ISSUES))

const verify = (r, lens) => {
  if (!r) return { lens, review: null, verdicts: null }
  for (const it of r.issues || []) if (it.severity === 'high') log(`high · ${lens} · slide ${it.slide}: ${String(it.problem).slice(0, 140)}`)
  if (!(r.issues || []).length) return { lens, review: r, verdicts: [] }
  const list = r.issues.map((it, index) => ({ index, ...it }))
  return agent(`${CONTEXT}

${VERIFY_LENS[lens]} Judge the same snapshot. Give one verdict per index.

${lens === 'copy' ? VOICE : lens === 'visual' ? WORLD : ''}
Use D=${exportDir(lens + '-verify')} for the export.
When you have decided, write {"lens": "${lens}", "head": "${HEAD}", "snapshot": "${SNAP}", "issues": [every finding below with your real, reason and better_fix added], "not_checked": the reviewer's list below} as JSON to ${resultFile(lens)}, then return the verdicts.

FINDINGS (JSON):
${JSON.stringify(list, null, 1)}
NOT CHECKED BY THE REVIEWER: ${JSON.stringify(r.not_checked || [])}`, opts(`verify:${lens}`, 'Verify', VERDICTS))
    .then((v) => ({ lens, review: r, verdicts: v ? v.verdicts : null }))
}

phase('Review')
log(`snapshot ${SNAP.slice(0, 12)} (HEAD ${HEAD.slice(0, 12)}); lenses: ${chosen.join(', ')}`)
const results = (await pipeline(chosen, review, verify)).map((r, i) => r || { lens: chosen[i], review: null, verdicts: null })

const kept = []
const unverified = []
const notChecked = []
let rejected = 0
for (const res of results) {
  if (!res.review) { unverified.push({ lens: res.lens, reason: 'the reviewer failed; this lens was not reviewed' }); continue }
  for (const n of res.review.not_checked || []) notChecked.push({ lens: res.lens, item: n })
  const issues = res.review.issues || []
  if (res.verdicts === null) {
    for (const it of issues) unverified.push({ lens: res.lens, reason: 'the verifier failed', ...it })
    continue
  }
  const byIndex = new Map((res.verdicts || []).map((v) => [v.index, v]))
  issues.forEach((it, i) => {
    const v = byIndex.get(i)
    if (!v) { unverified.push({ lens: res.lens, reason: 'no verdict returned', ...it }); return }
    if (!v.real) { rejected++; return }
    kept.push({ lens: res.lens, ...it, fix: v.better_fix || it.fix, reason: v.reason })
  })
}

// Dedupe by slide and kind: one entry per (slide, kind), every distinct item kept inside it.
const RANK = { high: 0, medium: 1, low: 2 }
const groups = new Map()
for (const it of kept) {
  const key = `${it.slide}|${it.kind}`
  const g = groups.get(key) || { slide: it.slide, title: it.title || '', kind: it.kind, severity: it.severity, lenses: [], items: [] }
  if (RANK[it.severity] < RANK[g.severity]) g.severity = it.severity
  if (!g.lenses.includes(it.lens)) g.lenses.push(it.lens)
  const same = g.items.find((x) => (x.old && x.old === it.old) || x.problem === it.problem)
  if (!same) g.items.push({ where: it.where || '', problem: it.problem, evidence: it.evidence, old: it.old || '', fix: it.fix, lens: it.lens })
  if (!g.title && it.title) g.title = it.title
  groups.set(key, g)
}
const deduped = [...groups.values()].sort((a, b) => RANK[a.severity] - RANK[b.severity] || a.slide - b.slide)
log(`${kept.length} findings verified (${deduped.length} after dedupe by slide and kind), ${rejected} rejected, ${unverified.length} unverified`)

return {
  talk: TALK,
  snapshot: { head: HEAD, snapshot: SNAP },
  lenses: chosen,
  done: skipped.map((lens) => ({ lens, file: resultFile(lens) })),
  kept: deduped,
  high: deduped.filter((g) => g.severity === 'high').length,
  rejected,
  unverified,
  not_checked: notChecked,
  next: `Write ${TALK}/notes/review.md from kept[] (one section per slide)${skipped.length ? `, adding the findings marked real in ${skipped.map(resultFile).join(', ')} (lenses done in an earlier run)` : ''}, apply the fixes to the current text (the snapshot may be older), rerun pnpm talk review, and report unverified[] and not_checked to the owner.`,
}
