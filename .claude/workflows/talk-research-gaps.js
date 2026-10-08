export const meta = {
  name: 'talk-research-gaps',
  description: 'Research and verify only the facts a talk deck still lacks: the facts bank first, disjoint slide-scoped lanes written as they land, one image lane, mail and Drive only for named Brief questions; returns unverified[]',
  whenToUse: 'After the deck draft cites fact ids. args: { talk: "talks/<dir>", repo: "<worktree root>", today: "YYYY-MM-DD", slug?, lang?: "en"|"lt", lanes?: [{ key, slides, topic, claims: [string | { id, text }] }] (public claims, e.g. a blueprint\'s research_gaps), briefGaps?: [string] (only Brief questions the owner\'s own mail, Drive and calendar answer; never public claims), images?: [string], maxAgents?: 30, staleMonths?: 6, personalBudget?: 15, done?: [lane keys already verified, "images", "personal"] (skipped on a re-run), effort?: { stage or label: "low"|"medium"|"high"|"xhigh"|"max" }, models?: { stage or label: model id } (none pinned) }',
  phases: [
    { title: 'Plan', detail: 'read the Brief, the deck and the facts bank; list the gaps as slide-scoped lanes' },
    { title: 'Research', detail: 'one researcher per lane, primary sources; the lane file is written as it lands' },
    { title: 'Verify', detail: 'one skeptic per lane tries to refute every claim' },
    { title: 'Images', detail: 'one lane for photos with licence and credit' },
    { title: 'Personal', detail: 'mail, Drive and calendar, only for the named Brief questions (briefGaps), within a call budget' },
  ],
}

// Generalised from the OpenData, Innoday and TV research runs of 7 October 2026
// and the Startertalk research brief (the one fan-out of five that lost no work).
// What changed: the deck comes first and only its gaps are researched; the
// facts bank is read before the web; lanes are disjoint and slide-scoped and
// each is written to talks/<t>/research/<lane>.json as soon as it lands; only
// claims the deck states are verified; one image lane; mail and Drive only for
// named Brief questions; no engine-scout lane (docs/STAGE_QUICKSTART.md covers it).
// Named talk-research-gaps, not talk-research: saved workflows are listed with
// the skills by meta.name, and the talk-research skill would shadow it.

const A = args || {}
if (!A.talk || !A.repo || !A.today) {
  throw new Error('talk-research-gaps: args.talk ("talks/<dir>"), args.repo (the worktree root) and args.today ("YYYY-MM-DD") are required')
}
const REPO = String(A.repo).replace(/\/+$/, '')
const TALK = String(A.talk).replace(/\/+$/, '').replace(REPO + '/', '')
const DIR = TALK.startsWith('/') ? TALK : `${REPO}/${TALK}`
const NAME = DIR.split('/').pop()
// As scripts/new_talk.py worktree_slug: 2026_10_00_OpenData -> opendata, the
// name of the private brief, the worktree and /tmp/talk-<slug>/site.
const SLUG = A.slug || (/^\d{4}_\d{2}_\d{2}_./.test(NAME) ? NAME.slice(11) : NAME).toLowerCase().replace(/_/g, '-')
const TODAY = A.today
const LANG = A.lang === 'lt' ? 'lt' : 'en'
const MAX = A.maxAgents || 30
const STALE = A.staleMonths || 6
const BUDGET = A.personalBudget || 15
// Lanes an earlier run finished (lane_facts.py --done lists the verified lane
// files): skipped, their files are filed with the rest. "images" and
// "personal" skip those lanes. A run that can still be resumed by its run id
// needs none of this; resume caches every finished agent.
// A label such as research:lhc or verify:lhc names its lane.
const DONE = new Set((Array.isArray(A.done) ? A.done : []).map((d) => String(d).replace(/^(research|verify):/, '')))

// Effort per stage, set here rather than inherited (the usage audit of 8 October
// 2026 found every sampled agent message at effort xhigh). The split is not
// measured yet. args.effort overrides it by label ("verify:lhc") or by stage
// ("verify"). The model is the owner's choice: args.models maps a label or a
// stage to a model id (the mechanical lanes are plan, images and personal);
// none is pinned here, so every agent inherits the session's model.
const EFFORT = { plan: 'low', research: 'low', verify: 'medium', images: 'low', personal: 'low' }
const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max']
for (const [k, v] of Object.entries(A.effort || {})) {
  if (!LEVELS.includes(v)) throw new Error(`talk-research-gaps: args.effort.${k} is ${JSON.stringify(v)}; use one of ${LEVELS.join(', ')}`)
}
const pick = (map, label) => (map && typeof map === 'object' ? map[label] || map[label.split(':')[0]] : undefined)
const opts = (label, phase, schema) => {
  const o = { label, phase, schema, effort: pick(A.effort, label) || pick(EFFORT, label) }
  const model = pick(A.models, label)
  if (model) o.model = String(model)
  return o
}
if (A.gaps) {
  throw new Error('talk-research-gaps: args.gaps is now args.briefGaps, and it is only for Brief questions the owner\'s own mail, Drive and calendar answer; public claims (a blueprint\'s research_gaps too) go in args.lanes[].claims or are found in the deck by the plan agent')
}
const GAPS = Array.isArray(A.briefGaps) ? A.briefGaps.filter(Boolean) : []
const BRIEF = `$HOME/.local/share/outreach_talks/briefs/${SLUG}.md`
const OUT = `${DIR}/research`

const HOUSE = `HOUSE RULES (they bind every agent in this run; you will not see them anywhere else):
- Report in English. Never write Russian. Lithuanian only in slide text, speaker notes and claim_lt.
- The repo ${REPO} is public. Nothing from mail, Drive, calendars, contacts or anyone's private life goes into a file under it. Private context goes only to ${BRIEF} (outside git).
- Never put the owner's email address, or any personal address, into a search query, a request header, a URL or a User-Agent.
- Write only the files this prompt names. Do not edit deck.md, space.json, styles, setup code or research/facts.jsonl.
- No git command that changes state (no commit, stash, checkout, merge, push). Never touch another talk's directory or the main checkout (the first entry of \`git worktree list\`).
- Search the facts bank before the web: \`cd ${REPO} && pnpm talk facts search <words> --json\`, or grep ${REPO}/research/facts.jsonl if the command is not installed.
- Run \`pnpm talk …\` from ${REPO} (cd there first): it is a script of the root package, and pnpm does not find it from a talk directory. Quote globs (the shell may be zsh). If node, pnpm or ffmpeg misbehave, \`cd ${REPO} && pnpm talk doctor\` says which binary is first on PATH.
- Never let one command block for more than 240 s (give Bash a timeout of at most 240000 ms), and never sleep or poll in a loop. Work that would take longer goes into your result as an open item instead of a wait. Read only the fields you need from a command's JSON or log.
- Never create claude.ai artifacts. Never ask the owner a question; record open questions in your result.`

const SOURCES = `SOURCES: load WebSearch and WebFetch with ToolSearch ("select:WebSearch,WebFetch"). Prefer primary sources: home.cern, kt.cern, cds.cern.ch, the experiment's own pages, arXiv, journals, HEPData, PDG, opendata.cern.ch, official government and university sites. Every claim needs a public http(s) source you actually opened, the exact figure with its unit, the date the figure refers to, and a verbatim quote from that page. Never invent; when unsure, say so. Known traps: CERN made the web, not the internet; the touchscreen claim needs E.A. Johnson's 1965 precedent; a "first" resting on an absence of records must say so; a storage capacity is not data collected; Run 2 and Run 3 beam energies differ (6.5 vs 6.8 TeV); Internet users are not Web users; counts that change (member states, collaboration size, staff) are given with their date; thresholds come from charge-consistent pairs with PDG masses; yields are candidates.`

const LT = LANG === 'lt' ? `
LITHUANIAN: fill claim_lt with the wording a slide or note would use: natural Lithuanian (no calques), „…“ quotes, decimal comma, a no-break or thin no-break space in thousands and before units and %, dates as "1989 m. kovo 12 d.". Settled terms: pasaulinis žiniatinklis, jutiklinis ekranas, žinių perdavimas, asocijuotoji narė, visateisė narystė, Didysis hadronų greitintuvas, pluoštas, susidūrimas, šviesis, žavusis kvarkas, gražusis kvarkas, kolaboracija, antimaterija, atvirieji duomenys.` : ''

const FACT = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'a-z, 0-9 and single dashes, at most 64 characters, <topic>-<what>, e.g. lhc-circumference; keep the id the deck already cites' },
    claim_en: { type: 'string', description: 'one precise sentence; the corrected wording when the verdict is corrected' },
    claim_lt: { type: 'string', description: 'Lithuanian wording for lt talks, else empty' },
    value: { type: 'string' },
    unit: { type: 'string' },
    as_of: { type: 'string', description: 'the date the figure refers to, as YYYY, YYYY-MM or YYYY-MM-DD (the bank refuses any other form); empty when there is none' },
    source_url: { type: 'string', description: 'a public http(s) page that was opened' },
    quote: { type: 'string', description: 'verbatim excerpt from that page supporting the claim' },
    verdict: { type: 'string', enum: ['confirmed', 'corrected', 'unverified', 'refuted'] },
    verified_on: { type: 'string', description: 'YYYY-MM-DD' },
    verified_by: { type: 'string' },
    used_in: { type: 'array', items: { type: 'string' } },
  },
  required: ['id', 'claim_en', 'source_url', 'quote', 'verdict'],
}
const LANE = {
  type: 'object',
  properties: {
    lane: { type: 'string' },
    slides: { type: 'string' },
    topic: { type: 'string' },
    facts: { type: 'array', items: FACT },
    notes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, note: { type: 'string' } }, required: ['id', 'note'] }, description: 'why a claim was corrected, refuted or left unverified; caveats the speaker must know' },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['lane', 'facts', 'open_questions'],
}
const PLAN = {
  type: 'object',
  properties: {
    covered: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, slides: { type: 'string' } }, required: ['id'] } },
    lanes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', description: 'short unique slug, used as the file name' },
          slides: { type: 'string', description: 'slide range, e.g. 3-5' },
          topic: { type: 'string' },
          claims: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'the cited id, or a proposed new one' },
                text: { type: 'string', description: 'the claim exactly as the deck states it' },
                why: { type: 'string', enum: ['missing', 'stale', 'wording', 'uncited'] },
              },
              required: ['id', 'text', 'why'],
            },
          },
        },
        required: ['key', 'slides', 'topic', 'claims'],
      },
    },
    images: { type: 'array', items: { type: 'string' }, description: 'subjects the deck needs a photo for and has none' },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['covered', 'lanes', 'images', 'open_questions'],
}
const IMAGES = {
  type: 'object',
  properties: {
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          subject: { type: 'string' },
          page_url: { type: 'string' },
          direct_url: { type: 'string' },
          ref: { type: 'string', description: 'cds:<ID> or commons:File:<name>, as scripts/photo_fetch.py takes it' },
          licence: { type: 'string' },
          credit: { type: 'string', description: 'the credit line to print on the slide' },
          px: { type: 'string' },
          note: { type: 'string' },
        },
        required: ['subject', 'page_url', 'licence', 'credit'],
      },
    },
    missing: { type: 'array', items: { type: 'string' } },
  },
  required: ['images', 'missing'],
}
const PERSONAL = {
  type: 'object',
  properties: {
    answered: { type: 'array', items: { type: 'object', properties: { gap: { type: 'string' }, answer: { type: 'string' }, source: { type: 'string' } }, required: ['gap', 'answer', 'source'] } },
    unanswered: { type: 'array', items: { type: 'string' } },
    calls: { type: 'integer' },
  },
  required: ['answered', 'unanswered', 'calls'],
}

const CONTEXT = `THE TALK: ${DIR} (a Slidev deck: deck.md holds the slides; a slide's last <!-- --> comment is its speaker notes, and facts are cited as <!-- facts: id1, id2 --> in a separate comment placed before the notes comment, never as the slide's last comment). Its Brief (audience, language, duration, must-haves, banned claims) is the Brief section of ${DIR}/CLAUDE.md. The facts bank is ${REPO}/research/facts.jsonl, one JSON object per line {id, claim_en, claim_lt, value, unit, as_of, source_url, quote, verdict, verified_on, verified_by, used_in[]}, verdict confirmed | corrected | unverified | refuted. Today is ${TODAY}. Talk language: ${LANG}.

${HOUSE}`

const laneFile = (key) => `${OUT}/${key}.json`
const asClaims = (claims) => (claims || []).map((c, i) => (typeof c === 'string' ? { id: '', text: c, why: 'missing', n: i + 1 } : c))
// A lane key names its file: lowercase, a-z 0-9 and dashes, unique, never "images".
const keyed = (list) => {
  const seen = new Set()
  return list.map((l, i) => {
    let base = String(l.key || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || `lane-${i + 1}`
    if (base === 'images' || base === 'personal') base = `${base}-facts`
    let key = base
    for (let n = 2; seen.has(key); n++) key = `${base}-${n}`
    seen.add(key)
    return { ...l, key }
  })
}
const doneLanes = [...DONE].filter((d) => d !== 'images' && d !== 'personal')

phase('Plan')
let plan
if (Array.isArray(A.lanes) && A.lanes.length) {
  plan = { covered: [], lanes: keyed(A.lanes.map((l, i) => ({ key: l.key || `lane-${i + 1}`, slides: l.slides || '', topic: l.topic || '', claims: asClaims(l.claims) }))), images: A.images || [], open_questions: [] }
  log(`${plan.lanes.length} lanes given in args; planning skipped`)
} else {
  plan = await agent(`${CONTEXT}

You plan the research for this talk. Do not research anything yourself.
1. Read the Brief in ${DIR}/CLAUDE.md, the whole of ${DIR}/deck.md, and the facts bank. If they exist, run \`cd ${REPO} && pnpm talk map ${NAME} --json\` and \`pnpm talk lint ${NAME} --json\` for slide numbers and for cited ids that are missing or not confirmed.
2. List every claim the deck states, on screen or in the notes: numbers, dates, names, "first"s, rankings, attributions, quotations, photo captions.
3. A claim is COVERED when it cites a fact id that exists in the bank with verdict confirmed or corrected, verified_on within ${STALE} months of ${TODAY}, and the deck's wording does not go beyond claim_en or claim_lt. Everything else is a gap: why = missing (no such fact), stale (older than ${STALE} months, or a count that changes), wording (the deck says more than the stored claim), uncited (a figure with no fact id; search the bank for it first and treat a match as covered or wording).
4. Group the gaps into lanes: disjoint (no claim in two lanes), each scoped to a slide range and one topic, at most 12 claims each, ordered most error-prone first. Keep the id the deck cites; propose slug-like ids for uncited claims.
5. List photo subjects the deck needs and has no image for.${doneLanes.length ? `
LANES FINISHED IN AN EARLIER RUN: ${doneLanes.map((k) => laneFile(k)).join(', ')}. Read them: every claim in them is covered, so do not plan it again, and do not use these keys (${doneLanes.join(', ')}) for new lanes.` : ''}
Return the plan; covered lists the ids that need no work.`, opts('plan', 'Plan', PLAN))
  if (!plan) throw new Error('talk-research-gaps: the planning agent returned nothing; rerun, or pass args.lanes')
  plan.lanes = keyed(plan.lanes || [])
}
const skipped = plan.lanes.filter((l) => DONE.has(l.key))
if (skipped.length) log(`done in an earlier run, skipped: ${skipped.map((l) => l.key).join(', ')}`)
const todo = plan.lanes.filter((l) => !DONE.has(l.key))

const IMAGE_SUBJECTS = DONE.has('images') ? [] : [...new Set([...(A.images || []), ...(plan.images || [])])]
const PERSONAL_GAPS = DONE.has('personal') ? [] : GAPS
if (DONE.has('images')) log('image lane done in an earlier run, skipped')
if (DONE.has('personal') && GAPS.length) log('personal lane done in an earlier run, skipped')
const fixed = 1 + (IMAGE_SUBJECTS.length ? 1 : 0) + (PERSONAL_GAPS.length ? 1 : 0)
const room = Math.max(0, Math.floor((MAX - fixed) / 2))
const lanes = todo.slice(0, room)
const dropped = todo.slice(room)
if (dropped.length) log(`agent cap ${MAX}: ${dropped.length} lanes not researched this run (${dropped.map((l) => l.key).join(', ')}); they are returned in unverified[]`)
log(`${(plan.covered || []).length} cited claims already covered by the bank; ${lanes.length} lanes, ${lanes.reduce((n, l) => n + l.claims.length, 0)} claims to research`)

const research = (lane) => agent(`${CONTEXT}

${SOURCES}${LT}

You research one lane of claims for slides ${lane.slides} (${lane.topic}). Other agents cover the other slides; stay inside this lane.
CLAIMS (as the deck states them; id = the id the deck cites or a proposed one):
${JSON.stringify(lane.claims, null, 1)}

For each claim find the primary source and fill one fact: the exact figure, unit, as_of, source_url, a verbatim quote, claim_en worded to what the source supports (and claim_lt for Lithuanian talks). Set verdict to "unverified" on every fact: a second agent verifies. Add facts the slides need that the claims missed, only if they belong to these slides. used_in: ["${NAME}"].
As soon as you are done, write the lane as JSON to ${laneFile(lane.key)} (mkdir -p ${OUT}): {"lane": "${lane.key}", "slides": "${lane.slides}", "topic": ..., "status": "researched", "facts": [...], "notes": [...], "open_questions": [...]}. Then return the same object.`, opts(`research:${lane.key}`, 'Research', LANE))

const verify = (r, lane) => {
  if (!r) return null
  return agent(`${CONTEXT}

${SOURCES}${LT}

You are an adversarial fact-checker for the lane "${lane.key}" (slides ${lane.slides}). A researcher produced the facts below. For EACH fact open its source_url and, for any number, date, "first", ranking or recent news, at least one more independent source, and try to REFUTE it. Check the figure, the unit, the date it refers to, the name, and whether it is still true on ${TODAY}.
Verdict: confirmed (correct as worded), corrected (rewrite claim_en/claim_lt to what the sources support, and give the quote that supports the correction), refuted (wrong; say why in notes), unverified (no reliable public source confirms it; the default when in doubt). Set verified_on "${TODAY}" and verified_by "talk-research-gaps verify:${lane.key} ${TODAY}". Replace a non-public source_url (Drive, Gmail, docs.google.com) with a public one or mark the fact unverified.
Overwrite ${laneFile(lane.key)} with the verified lane, "status": "verified", then return it.

FACTS:
${JSON.stringify(r.facts, null, 1)}
RESEARCHER'S OPEN QUESTIONS: ${JSON.stringify(r.open_questions || [])}`, opts(`verify:${lane.key}`, 'Verify', LANE))
    .then((v) => v || { ...r, facts: (r.facts || []).map((f) => ({ ...f, verdict: 'unverified' })), verifyFailed: true })
}

const images = IMAGE_SUBJECTS.length
  ? agent(`${CONTEXT}

You are the only image lane of this run; nobody else hunts photos. Find images that may be shown in a public talk and published on a public website, for: ${JSON.stringify(IMAGE_SUBJECTS)}.
Prefer CERN Document Server records (CERN photos with the credit "CERN" for educational use) and Wikimedia Commons (CC BY, CC BY-SA, CC0, public domain); open each record page to confirm the licence and the credit line. If ${REPO}/scripts/photo_fetch.py exists, run it with --dry-run for each pick (\`python3 -I ${REPO}/scripts/photo_fetch.py cds:<ID> --dry-run\` or \`commons:File:<name>\`) and use its licence and credit. Do not download into the repo. Any request you make carries a User-Agent naming github.com/MindaugasSarpis/cern_outreach_talks, never an email address.
Write the result as JSON to ${OUT}/images.json (mkdir -p ${OUT}), then return it.`, opts('images', 'Images', IMAGES))
  : Promise.resolve(null)

const personal = PERSONAL_GAPS.length
  ? agent(`${CONTEXT}

You answer named Brief questions from the owner's own records. QUESTIONS: ${JSON.stringify(PERSONAL_GAPS)}. Search only for these; never search mail or Drive for a public fact.
Load the tools with ToolSearch ("select:mcp__claude_ai_Gmail__search_threads,mcp__claude_ai_Gmail__get_thread,mcp__claude_ai_Google_Drive__search_files,mcp__claude_ai_Google_Drive__read_file_content,mcp__claude_ai_Google_Calendar__search_events"). Budget: at most ${BUDGET} tool calls in total across Gmail, Drive and Calendar; stop at the budget. Read only: never send, label, move or delete anything. Search narrowly (event and organiser words in English and Lithuanian; add -from:linkedin.com in Gmail).
First read ${BRIEF} if it exists: do not search again for what it already answers.
Append what you find to ${BRIEF} (mkdir -p its directory) under a heading "## talk-research-gaps ${TODAY}", each answer with its source (mail subject and date, file title). Nothing goes into the repo. Return the answers, the gaps still open and the number of calls used.`, opts('personal', 'Personal', PERSONAL))
  : Promise.resolve(null)

const [laneResults, imageResult, personalResult] = await Promise.all([
  pipeline(lanes, research, verify),
  images,
  personal,
])

const unverified = []
const summary = []
lanes.forEach((lane, i) => {
  const res = laneResults[i]
  if (!res) {
    unverified.push({ lane: lane.key, slides: lane.slides, reason: 'the research agent failed; nothing was researched', claims: lane.claims.map((c) => c.id || c.text) })
    summary.push({ lane: lane.key, file: null, facts: 0 })
    return
  }
  const facts = res.facts || []
  const count = (v) => facts.filter((f) => f.verdict === v).length
  for (const f of facts) {
    if (f.verdict !== 'confirmed' && f.verdict !== 'corrected') {
      unverified.push({ lane: lane.key, slides: lane.slides, id: f.id, claim: f.claim_en, verdict: f.verdict, reason: res.verifyFailed ? 'the verifier failed' : ((res.notes || []).find((n) => n.id === f.id) || {}).note || '' })
    }
  }
  summary.push({ lane: lane.key, file: laneFile(lane.key), facts: facts.length, confirmed: count('confirmed'), corrected: count('corrected'), refuted: count('refuted'), unverified: count('unverified'), verifyFailed: !!res.verifyFailed })
})
for (const lane of skipped) summary.push({ lane: lane.key, file: laneFile(lane.key), skipped: 'done in an earlier run' })
for (const lane of dropped) unverified.push({ lane: lane.key, slides: lane.slides, reason: `not researched: over the ${MAX}-agent cap`, claims: lane.claims.map((c) => c.id || c.text) })
if (IMAGE_SUBJECTS.length && !imageResult) unverified.push({ lane: 'images', reason: 'the image agent failed', subjects: IMAGE_SUBJECTS })
if (PERSONAL_GAPS.length && !personalResult) unverified.push({ lane: 'personal', reason: 'the personal-records agent failed', briefGaps: PERSONAL_GAPS })

log(`${summary.reduce((n, s) => n + (s.confirmed || 0) + (s.corrected || 0), 0)} facts confirmed or corrected; ${unverified.length} items unverified`)

return {
  talk: TALK,
  today: TODAY,
  covered: plan.covered || [],
  done: [...DONE],
  lanes: summary,
  images: imageResult,
  personal: personalResult ? { answered: personalResult.answered.map((a) => a.gap), unanswered: personalResult.unanswered, calls: personalResult.calls, brief: BRIEF } : null,
  open_questions: [...(plan.open_questions || []), ...laneResults.filter(Boolean).flatMap((r) => r.open_questions || [])],
  unverified,
  next: `To retry failed lanes, rerun with args.done from \`python3 -I .claude/skills/talk-research/lane_facts.py --done ${TALK}/research/*.json\`, which skips the verified ones. File the lanes as skill talk-research step 3 says, from ${REPO}: python3 -I .claude/skills/talk-research/lane_facts.py ${TALK}/research/*.json | pnpm -s talk facts add --from-json - --dry-run, then without --dry-run (an existing id is refused: compare, then --id <id> and --replace), then pnpm talk facts check; copy the speaker caveats from the lane notes under Figures in ${TALK}/CLAUDE.md, fetch the photos the deck uses with python3 scripts/photo_fetch.py <ref> --record --out ${TALK}/public/figures, and delete ${TALK}/research/*.json. Cite the ids as <!-- facts: id --> in a separate comment before each slide's notes comment, never as its last comment. Report unverified[] to the owner. Then hand off (docs/talk-quality.md §8), from the worktree root: Status and Decisions in ${TALK}/CLAUDE.md; a commit by path of the talk's files and the shared files filing changed (git add ${TALK} research/facts.jsonl assets/photos/photos.toml); a push of the talk's branch (never main); and this session's line via python3 -I .claude/skills/talk-quality/status_line.py <slug>.`,
}
