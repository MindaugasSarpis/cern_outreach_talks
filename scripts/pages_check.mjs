// A deck as GitHub Pages serves it, walked slide by slide in headless Chromium:
// every request that fails, and any WebGL context the page lost. Clips are not
// counted: on Pages they come from the release, not the build.
//
//   node scripts/pages_check.mjs --site <dir> --prefix /cern_outreach_talks/<talk>/ [--json out.json]
//       a build made with that base (`slidev build --base <prefix>`), served under the
//       prefix with nothing at the root, as Pages does: an asset written /figures/…
//       resolves outside the base and fails here as it does there (talk ready)
//   node scripts/pages_check.mjs --url https://…/<talk>/ [--json out.json]
//       the live deck, after a deploy (talk deploy)
//
// Options: --wait <ms> per slide (default 1200), --slides <n> at most (default: the deck's
// count, from the stage's window.__stage, else until a slide does not appear). A slide that does not appear within 5 s is
// asked for again and given 20 s more (a long main-thread block, a clip arriving, a cold
// CDN); one that still does not, before the deck's last, fails the walk.
// Exit 0 clean, 1 something failed, 2 could not run.
// Promoted from the Innoday talk's scripts/pages-check.mjs (2026-10-09).
import { createServer } from 'node:http'
import { readFile, stat, readdir, writeFile } from 'node:fs/promises'
import { join, extname, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const site = opt('--site'), prefix = opt('--prefix'), live = opt('--url'), json = opt('--json')
const wait = Number(opt('--wait', 1200)), most = Number(opt('--slides', 500))
if (!(site && prefix) && !live) {
  console.error('usage: pages_check.mjs --site <dir> --prefix </repo/talk/> | --url <live url>  [--json out] [--wait ms] [--slides n]')
  process.exit(2)
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm' }
let server = null, base = live
if (!live) {
  server = createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0])
    if (!url.startsWith(prefix)) { res.statusCode = 404; return res.end('outside the base') }
    let p = url.slice(prefix.length) || 'index.html'
    if (p.endsWith('/')) p += 'index.html'
    try {
      const f = join(site, p); if (!(await stat(f)).isFile()) throw 0
      res.setHeader('content-type', TYPES[extname(f)] || 'application/octet-stream'); res.end(await readFile(f))
    } catch { res.statusCode = 404; res.end('not found') }
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  base = `http://127.0.0.1:${server.address().port}${prefix}`
}

// pnpm keeps playwright-chromium in the workspace store, not in every package
async function playwright() {
  for (const name of ['playwright-chromium', 'playwright-core']) { try { return await import(name) } catch {} }
  const store = resolve(dirname(fileURLToPath(import.meta.url)), '../node_modules/.pnpm')
  for (const pkg of ['playwright-chromium', 'playwright-core']) {
    const dir = (await readdir(store).catch(() => [])).find((d) => d.startsWith(`${pkg}@`))
    if (dir) return import(pathToFileURL(join(store, dir, 'node_modules', pkg, 'index.js')).href)
  }
  return null
}
const pw = await playwright()
if (!pw) { console.error('pages_check: playwright-chromium not found (pnpm install at the root)'); process.exit(2) }
const chromium = pw.chromium || pw.default?.chromium
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

const clip = (u) => /\.(mp4|webm|mov|m4v)\b/i.test(u)       // also a release redirect (the name is in its query)
const lost = /context lost|webglcontextlost|fallback — context-lost/i
const failed = new Map(), contextLost = []
let at = 1
const note = (line) => { if (!failed.has(line)) failed.set(line, at) }
page.on('response', (r) => { if (r.status() >= 400 && !clip(r.url())) note(`${r.status()} ${r.url()}`) })
page.on('requestfailed', (r) => { if (!clip(r.url()) && !/ERR_ABORTED/.test(r.failure()?.errorText || '')) note(`ERR ${r.url()} ${r.failure()?.errorText}`) })
page.on('console', (m) => { if (lost.test(m.text())) contextLost.push({ slide: at, text: m.text().slice(0, 200) }) })

// slide n, asked for by the hash: on screen within `ms`, and the hash still says n
// (past the last slide Slidev puts the hash back)
async function reach(n, ms) {
  await page.evaluate((n) => { location.hash = `#/${n}` }, n)
  const there = await page.waitForSelector(`.slidev-page[data-slidev-no="${n}"]`, { state: 'attached', timeout: ms }).then(() => true, () => false)
  return there && await page.evaluate((n) => Number((/^#\/(\d+)/.exec(location.hash) || [])[1]) === n, n)
}
let slides = 0, total = null, error = null
const retried = []
try {
  await page.goto(`${base}#/1`, { waitUntil: 'load', timeout: 60000 })
  await page.waitForSelector('.slidev-page[data-slidev-no="1"]', { state: 'attached', timeout: 60000 })
  await page.waitForTimeout(Math.max(wait, 3000))
  slides = 1
  // the deck's count: the stage's probe has it (a production build exposes no __slidev__)
  total = await page.evaluate(() => Number(window.__stage?.state?.()?.total || window.__slidev__?.nav?.total) || null).catch(() => null)
  for (let n = 2; n <= Math.min(most, total ?? most); n++) {
    at = n
    let on = await reach(n, 5000)
    if (!on && (total == null || n <= total)) { retried.push(n); on = await reach(n, 20000) }
    if (!on) {
      if (total != null) error = `slide ${n} of ${total} did not appear (asked twice, 25 s)`
      break
    }
    slides = n
    await page.waitForTimeout(wait)
  }
} catch (e) { error = String(e.message || e).split('\n')[0] }
const tier = await page.evaluate(() => document.querySelector('.stage canvas')?.__space?.tier ?? null).catch(() => null)
await browser.close(); server?.close()

const strip = (s) => (live ? s : s.replace(base.slice(0, base.length - prefix.length), ''))
const report = { ok: !error && failed.size === 0 && contextLost.length === 0, where: live || prefix, slides, total, retried, tier,
  failed: [...failed].map(([line, slide]) => ({ slide, request: strip(line) })), context_lost: contextLost, ...(error ? { error } : {}) }
for (const f of report.failed) console.log(`slide ${f.slide}: ${f.request}`)
for (const c of contextLost) console.log(`slide ${c.slide}: ${c.text}`)
if (retried.length) console.log(`slow to appear, asked again: slide ${retried.join(', ')}`)
if (error) console.log(`error: ${error}`)
console.log(report.ok ? `pages ok: ${slides} slide(s) under ${report.where}, nothing failed`
  : `${report.failed.length} failed request(s), ${contextLost.length} lost context(s) in ${slides} slide(s) under ${report.where}`)
if (json) await writeFile(json, JSON.stringify(report, null, 2) + '\n')
process.exit(report.failed.length || contextLost.length ? 1 : error && !slides ? 2 : report.ok ? 0 : 1)
