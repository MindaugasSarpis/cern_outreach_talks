export const meta = {
  name: 'talk-blueprint',
  description: 'Design a talk from its Brief, or overhaul a deck: five critiques, three blueprints from different angles, three judges, and one editor who writes the blueprint (slide table with minutes, style rules, world plan, drop order, decisions, research gaps)',
  whenToUse: 'At the start of a talk that matters, or for an overhaul. args: { talk: "talks/<dir>", repo: "<worktree root>", today: "YYYY-MM-DD", duration: minutes, lang?: "en"|"lt", audience?: string, delivery?: "venue"|"broadcast", sheets?: [contact sheet paths], angles?: [{ key, brief }], judges?: [string], out?: "talks/<dir>/notes/blueprint.md" }',
  phases: [
    { title: 'Critique', detail: 'five lenses on the Brief, the outline or the current deck' },
    { title: 'Blueprints', detail: 'three independent proposals from different angles' },
    { title: 'Judge', detail: 'three judges score every proposal' },
    { title: 'Edit', detail: 'one editor merges the winner and the grafts into the blueprint' },
  ],
}

// Generalised from startertalk-critique-and-blueprint (wf_bdd1faf7, 9 September
// 2026): the run behind the deck the owner calls the house standard, and the
// source of the style rules in docs/talk-quality.md. Lessons applied: the
// judges' and the editor's inputs are complete lists, so their barriers stay;
// every stage tolerates a lost agent (that run lost two of three judges to a
// usage limit, and the editor worked from one) and says what was lost; the
// editor writes the blueprint to disk itself; research gaps come back as a
// list for the talk-research-gaps workflow instead of being guessed.

const A = args || {}
if (!A.talk || !A.repo || !A.today || !A.duration) {
  throw new Error('talk-blueprint: args.talk, args.repo, args.today and args.duration (minutes) are required')
}
const REPO = String(A.repo).replace(/\/+$/, '')
const TALK = String(A.talk).replace(/\/+$/, '').replace(REPO + '/', '')
const DIR = `${REPO}/${TALK}`
const TODAY = A.today
const MIN = Number(A.duration)
const LANG = A.lang === 'lt' ? 'lt' : 'en'
const BROADCAST = A.delivery === 'broadcast'
const AUDIENCE = A.audience || 'as the Brief describes it'
const SHEETS = Array.isArray(A.sheets) ? A.sheets : []
const OUT = A.out ? `${REPO}/${String(A.out).replace(REPO + '/', '')}` : `${DIR}/notes/blueprint.md`

const HOUSE = `HOUSE RULES (they bind every agent in this run; you will not see them anywhere else):
- Report in English. Never write Russian. Lithuanian only in proposed slide text and notes.
- Read only, except the one file the editor is told to write. No git command that changes state. Never touch the main checkout (the first entry of \`git worktree list\`) or another talk.
- The repo is public: nothing from mail, Drive, calendars or anyone's private life goes into the blueprint; refer to "the owner" (they/them) and to people by role unless the Brief names them publicly.
- Facts: search the bank first (\`cd ${REPO} && pnpm talk facts search <words> --json\`, or grep ${REPO}/research/facts.jsonl). Every number in a proposal carries a fact id from the bank or is listed as a research gap with a proposed id; never invent a figure.
- Headless browsers, if you need one: \`pnpm talk render -- <command>\`, at most 4 slides.
- Quote globs (the shell may be zsh). Never create claude.ai artifacts. Never ask the owner a question: take the recommended option and record it as a decision.`

const BAR = `THE OWNER'S BAR (verbatim; these are the acceptance criteria):
- Busy: "at some angles the screen is too busy with everything and words are difficult to make out, more importantly, the plots don't immediately correspond to the text"; "slide 20 too busy, barely readable".
- Meaning: "the space doesn't bear any meaning"; "isn't clear what they symbolize"; "now it's confusing and doesn't serve any purpose".
- Slop: "no sloppy wording like marketing"; '"The data are in the analyses are not" and similar sounds a lot like AI'; "I don't even use word cosmos".
- Rigour: "before slide 11 need a rigorous introduction what a dalitz plot is"; "if it's a cusp.. it's not a particle?".
- Wow: "Has to look really good, like apple keynote intro, has to have enough content"; "make it really flashy maybe pentaquark appearing somehow or something. More details"; "the sound should be a continuous low humm".
- Flow: "Will they smoothly move from one to another?"; "Now the flow is a bit broken here"; "Slide 8 before slide 5".
- Praise, to repeat: "Looks impressive", "The first slide is super nice", "figure is nice", "This is nice": slides with one dominant picture and a short plain title.`

const VOICE = `STYLE RULES: one claim per slide; the title states it in six words or fewer, sentence case, declarative or a plain label; no question titles, Title Case, partial bold or cute lines. At most 60 words on screen outside tables (aim for 40); tables at most 4 rows x 5 columns, empty cells "none". One dominant visual per content slide and at most two cards of at most 60ch; the lower third clear. English: no em dashes in body text, no "X, not Y", no slogans or fragments, no idioms or superlatives, no anthropomorphic verbs, no colon glosses, no emoji. Journal-style references; one .src line per slide. Notes carry the spoken script and end with (~N min).${LANG === 'lt' ? ' LITHUANIAN: natural spoken Lithuanian, „…“ quotes, decimal comma, no-break spaces in thousands, dates "1989 m. kovo 12 d.", em dashes are correct, no English UI words.' : ''}${BROADCAST ? ' BROADCAST: readable text at least 37 canvas px (49 better), headlines 72-92, kickers 24 or more, at most two lines of about 28 characters, text inside x 98-882 and y 55-408, corners clear; no film grain; bursts small and rare.' : ''}`

const WORLD = `THE WORLD: one persistent 3D world of grains under every slide (slidev-addon-stage; ${REPO}/docs/STAGE_QUICKSTART.md, and the pinned README under ${DIR}/node_modules/slidev-addon-stage/ if installed). Stations hold forms of grains (galaxy, collider, constellation, talk-owned builders) that gather when the camera arrives; slides set the camera with space: { at, dist, yaw, pitch, dim }. Rules: every world object on a slide maps to a sentence or label on that slide, or it goes; a new world mechanic is tried on one sparse and one dense slide before it spreads; everything is grains (solid shapes and labels read as a classroom diagram); text sits on a dimmed world. Devices that make a talk spectacular, with their cost: ${REPO}/docs/spectacle.md. Each part of the talk gets one big move; the cover and the close each get an entrance and the hum.`

const CONTEXT = `THE TALK: ${DIR}. The Brief (audience, language, duration, delivery, must-haves, banned claims, takeaway) is in ${DIR}/CLAUDE.md; the deck, if one exists yet, is ${DIR}/deck.md (speaker notes in <!-- -->), the world ${DIR}/public/data/space.json. Duration ${MIN} minutes, language ${LANG}, audience: ${AUDIENCE}, delivery: ${BROADCAST ? 'broadcast (filmed or streamed)' : 'venue (projector or LED wall)'}. ${SHEETS.length ? `Contact sheets of the current deck: ${JSON.stringify(SHEETS)} (read them; they are what the audience sees).` : 'No contact sheets were given.'} The house checklist is ${REPO}/docs/talk-quality.md. Today is ${TODAY}.

${HOUSE}`

const CRITIQUE = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slide: { type: 'integer', description: 'slide number; 0 for the talk as a whole' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          issue: { type: 'string' },
          recommendation: { type: 'string' },
          source: { type: 'string' },
        },
        required: ['slide', 'severity', 'issue', 'recommendation'],
      },
    },
    global: { type: 'array', items: { type: 'string' } },
  },
  required: ['lens', 'summary', 'findings', 'global'],
}
const SLIDE = {
  type: 'object',
  properties: {
    no: { type: 'integer' },
    kind: { type: 'string', description: 'cover | section | content | figure | table | statement | clip | close | backup' },
    title: { type: 'string' },
    message: { type: 'string', description: 'the one sentence this slide says' },
    body: { type: 'string', description: 'the on-screen text, final wording' },
    world: { type: 'string', description: 'pose (at, dist, yaw, pitch, dim) and what the world shows, and which sentence on the slide each world object carries' },
    visual: { type: 'string' },
    notes: { type: 'string', description: 'the gist of the spoken script, with fact ids' },
    facts: { type: 'array', items: { type: 'string' }, description: 'fact ids used; new ones are also listed in research_gaps' },
    minutes: { type: 'number' },
  },
  required: ['no', 'kind', 'title', 'message', 'body', 'world', 'notes', 'minutes'],
}
const BLUEPRINT = {
  type: 'object',
  properties: {
    angle: { type: 'string' },
    arc: { type: 'string' },
    takeaway: { type: 'string' },
    style_rules: { type: 'array', items: { type: 'string' } },
    slides: { type: 'array', items: SLIDE },
    world_plan: { type: 'string', description: 'stations, forms, which are new, and the sparse and dense slides a new mechanic is tried on first' },
    drop_order: { type: 'array', items: { type: 'string' }, description: 'what goes first if a rehearsal runs over' },
    research_gaps: {
      type: 'array',
      items: { type: 'object', properties: { id: { type: 'string' }, claim: { type: 'string' }, slides: { type: 'string' } }, required: ['id', 'claim', 'slides'] },
    },
    decisions: { type: 'array', items: { type: 'string' }, description: 'choices taken without the owner, each with the alternative and why' },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['angle', 'arc', 'takeaway', 'style_rules', 'slides', 'world_plan', 'drop_order', 'research_gaps', 'decisions', 'open_questions'],
}
const SCORE = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          proposal: { type: 'string' },
          accuracy: { type: 'number' },
          message: { type: 'number' },
          readability: { type: 'number' },
          fit: { type: 'number', description: `fits ${MIN} minutes` },
          voice: { type: 'number' },
          world: { type: 'number', description: 'every world object carries a sentence; feasible on the engine' },
          wow: { type: 'number' },
          total: { type: 'number' },
          notes: { type: 'string' },
        },
        required: ['proposal', 'accuracy', 'message', 'readability', 'fit', 'voice', 'world', 'wow', 'total', 'notes'],
      },
    },
    best: { type: 'string' },
    graft: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'string' } },
  },
  required: ['scores', 'best', 'graft', 'risks'],
}

const LENSES = [
  { key: 'rigour', prompt: 'You review FACTS AND RIGOUR. Claim by claim (numbers, dates, names, "first"s, attributions, quotations), check the facts bank and, where it is silent, primary sources (WebSearch and WebFetch via ToolSearch). Name every claim that is wrong, overstated or unsourced, every term or plot used before it is introduced, and every claim the talk will need that nobody has sourced yet (as a research gap with a proposed fact id).' },
  { key: 'narrative', prompt: 'You review MESSAGE, MEANING AND ARC. For each slide (or, without a deck, each part the Brief implies), state in one sentence what it tries to say and whether it says it; find slides with two messages or none, and gaps in the arc the audience needs. Where does tension build and release; what is the single takeaway; does the opening pose the question and the close answer it? Recommend merges, splits, reorderings and the one-line message of each slide.' },
  { key: 'wording', prompt: 'You review WORDING AND VOICE against the style rules below. Quote every offending span, name the pattern and give the replacement in the owner\'s plain voice (same facts, fewer words). Check terminology and unit consistency, and that every title is a statement or a plain label, never a tease.' },
  { key: 'readability', prompt: 'You review READABILITY AND THE WORLD. From the contact sheets if given, else from the deck markup, the talk CSS and space.json: words on screen, type sizes against the floor, hierarchy, contrast over the world, whether the world is visible and meaningful or hidden behind cards, whether every world object maps to a sentence on its slide, whether it reads like a keynote (one picture, one claim) or a document. Recommend a layout per slide and any CSS changes.' },
  { key: 'structure', prompt: `You review STRUCTURE AND TIME. Count the minutes the notes imply, plus clip durations, against ${MIN} minutes; find where time is over- or under-spent; propose the slide list with minutes per slide and what each added slide displaces; place the world's stations and poses where they carry meaning; choose at most one big world move per part from docs/spectacle.md and say which sparse and which dense slide a new mechanic is tried on first.` },
]

const ANGLES = (Array.isArray(A.angles) && A.angles.length) ? A.angles : [
  { key: 'rigour-first', brief: 'Design as the most exacting expert in the room would want: every claim precise and sourced, caveats visible, the concepts introduced in order. Readability still mandatory.' },
  { key: 'story-first', brief: `Design as a keynote for ${AUDIENCE}: one claim per slide in a plain declarative title, few words, a question posed in the first minute and answered in the last, tension built and released. Facts still exact.` },
  { key: 'world-first', brief: 'Design around the world of grains: every part told by a form or a camera move that carries its sentence, the figures and numbers made into matter where the engine can carry it (docs/spectacle.md), text as captions and claims. Facts still exact.' },
]
const JUDGES = (Array.isArray(A.judges) && A.judges.length) ? A.judges : [
  'an expert in the talk\'s subject who will check every claim',
  `a member of the audience (${AUDIENCE}) with the attention they will really have`,
  BROADCAST ? 'a TV producer who cuts talks for a stream watched in classrooms' : 'a presentation designer who has built keynotes and knows this engine',
]

phase('Critique')
const critRaw = await parallel(LENSES.map((l) => () => agent(`${CONTEXT}

YOUR LENS: ${l.key.toUpperCase()}. ${l.prompt}
If the deck is still the scaffold, critique the Brief and any outline instead: what the audience needs, what would be wrong, what the world could carry.

${BAR}

${VOICE}

${WORLD}

Return structured findings, worst first.`, { label: `critique:${l.key}`, phase: 'Critique', schema: CRITIQUE })))
const critiques = critRaw.filter(Boolean)
const lostCritiques = LENSES.filter((l, i) => !critRaw[i]).map((l) => l.key)
log(`critiques: ${critiques.map((c) => `${c.lens} ${c.findings.length}`).join(', ')}${lostCritiques.length ? `; lost: ${lostCritiques.join(', ')}` : ''}`)
if (!critiques.length) throw new Error('talk-blueprint: every critique failed; nothing to design from')

const digest = critiques.map((c) => `### ${c.lens}\n${c.summary}\nGlobal: ${c.global.join(' | ')}\n` +
  c.findings.map((f) => `- [s${f.slide} ${f.severity}] ${f.issue} -> ${f.recommendation}${f.source ? ` (${f.source})` : ''}`).join('\n')).join('\n\n')

phase('Blueprints')
const proposals = (await parallel(ANGLES.map((a) => () => agent(`${CONTEXT}

You design the talk. Angle: ${a.key}: ${a.brief}

CRITIQUES (address every high-severity finding; use the sources they cite):
${digest}

${BAR}

${VOICE}

${WORLD}

Produce a complete slide-by-slide blueprint whose minutes sum to ${MIN} or less. For each slide: kind, a plain title, the one-sentence message, the exact on-screen text in the owner's voice (typeset nearly verbatim later), the world (pose, what it shows, which sentence each world object carries), the visual, the gist of the notes with fact ids, and minutes. Also: the world plan (stations and forms, new mechanics and the sparse and dense slides they are tried on first), the drop order, the research gaps (claims needing a source, with proposed ids), the decisions you took, and open questions.`, { label: `blueprint:${a.key}`, phase: 'Blueprints', schema: BLUEPRINT })))).filter(Boolean)
const lostProposals = ANGLES.length - proposals.length
log(`proposals: ${proposals.map((p) => `${p.angle} (${p.slides.length} slides, ${p.slides.reduce((n, s) => n + (Number(s.minutes) || 0), 0).toFixed(1)} min)`).join(', ')}${lostProposals ? `; lost ${lostProposals}` : ''}`)
if (!proposals.length) throw new Error('talk-blueprint: every proposal failed')

const proposalsText = proposals.map((p) => `=== PROPOSAL ${p.angle} ===\n${JSON.stringify(p, null, 1)}`).join('\n\n')

phase('Judge')
const judges = (await parallel(JUDGES.map((who, i) => () => agent(`${CONTEXT}

You are ${who}. Score each proposal 1-10 on accuracy, message (one claim per slide, arc, takeaway), readability (words on screen, type, the world behind the text), fit (${MIN} minutes), voice (the owner's plain voice), world (every world object carries a sentence; feasible on the engine) and wow (would the owner call it impressive). total = the sum. Name the best, list the specific slides, devices and rules to graft from the others, and the risks of the best.

${BAR}

${proposalsText}`, { label: `judge:${i + 1}`, phase: 'Judge', schema: SCORE })))).filter(Boolean)
const tally = {}
for (const j of judges) for (const s of j.scores) tally[s.proposal] = (tally[s.proposal] || 0) + (Number(s.total) || 0)
log(`judges: ${judges.length} of ${JUDGES.length}; tally ${JSON.stringify(tally)}`)

phase('Edit')
const final = await agent(`${CONTEXT}

You are the editor. Merge the proposals into ONE blueprint. ${judges.length ? `Judges' tally (higher is better): ${JSON.stringify(tally)}. Their notes, grafts and risks:\n${JSON.stringify(judges, null, 1)}` : 'No judge finished: judge the proposals yourself against the bar and say so in decisions.'}${lostCritiques.length ? `\nCritiques lost in this run: ${lostCritiques.join(', ')}; cover those lenses yourself.` : ''}

PROPOSALS:
${proposalsText}

CRITIQUES:
${digest}

${BAR}

${VOICE}

${WORLD}

Rules for the final: minutes sum to ${MIN} or less; one claim per slide; the final on-screen wording; every number with a fact id or a research gap; every world object tied to a sentence; at most one big world move per part, each new mechanic with its sparse and dense prototype slides; a drop order; decisions taken without the owner, each with the alternative.
WRITE the blueprint as readable markdown to ${OUT} (mkdir -p its directory): angle, arc and takeaway; the slide table (#, kind, title, message, world, minutes, with the total); the slide bodies and notes gists; the style rules; the world plan; the drop order; research gaps; decisions; open questions. Then return the structured blueprint.`, { label: 'editor', phase: 'Edit', schema: BLUEPRINT })

const lost = [
  ...lostCritiques.map((k) => `critique:${k}`),
  ...(lostProposals ? [`${lostProposals} blueprint proposal(s)`] : []),
  ...(JUDGES.length - judges.length ? [`${JUDGES.length - judges.length} judge(s)`] : []),
  ...(final ? [] : ['the editor: no blueprint was written; merge from proposals and judges']),
]
if (final) log(`blueprint: ${final.slides.length} slides, ${final.slides.reduce((n, s) => n + (Number(s.minutes) || 0), 0).toFixed(1)} of ${MIN} min, ${final.research_gaps.length} research gaps -> ${OUT}`)

return {
  talk: TALK,
  out: final ? OUT : null,
  tally,
  blueprint: final,
  proposals: final ? proposals.map((p) => ({ angle: p.angle, slides: p.slides.length })) : proposals,
  judges: final ? judges.map((j) => ({ best: j.best, risks: j.risks })) : judges,
  research_gaps: final ? final.research_gaps : proposals.flatMap((p) => p.research_gaps || []),
  unverified: lost,
  next: 'Review the blueprint with the owner (or log it under Decisions when AFK), write the outline and draft into deck.md citing the research_gaps ids, then run the talk-research-gaps workflow (skill talk-research): its plan agent finds the uncited and missing ids in the deck, or pass research_gaps as lanes[].claims. Never pass them as briefGaps, which only searches the owner\'s own mail, Drive and calendar.',
}
