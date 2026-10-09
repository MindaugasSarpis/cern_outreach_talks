// The deck as GitHub Pages serves it: build with the Pages base, serve it under that
// prefix, open slides in headless Chromium and list every request that fails. An asset
// written /figures/… resolves outside the base and fails here, as it does on Pages.
//   node scripts/pages-check.mjs <site> <prefix> <out> <slides, e.g. 11,13> [waitMs]
// Print mode (?print=true) is opened last, so every slide's still is requested too.
// Clips are skipped: on Pages they come from the release, not the build.
import { createServer } from 'node:http'
import { readFile, stat, mkdir, readdir } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const [site, prefix, out, list, waitArg] = process.argv.slice(2)
if (!list) { console.error('usage: pages-check.mjs <site> <prefix> <out> <slides> [waitMs]'); process.exit(2) }
const wait = Number(waitArg || 9000)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.webm': 'video/webm' }
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  if (!url.startsWith(prefix)) { res.statusCode = 404; return res.end('outside the base') }
  let p = url.slice(prefix.length) || 'index.html'
  if (p.endsWith('/')) p += 'index.html'
  try {
    const f = join(site, p); if (!(await stat(f)).isFile()) throw 0
    res.setHeader('content-type', TYPES[extname(f)] || 'application/octet-stream'); res.end(await readFile(f))
  } catch { res.statusCode = 404; res.end('not found') }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

// pnpm keeps playwright-chromium out of the talk's node_modules: find it in the store
async function playwright() {
  try { return await import('playwright-chromium') } catch {}
  const store = join(dirname(fileURLToPath(import.meta.url)), '../../../node_modules/.pnpm')
  const dir = (await readdir(store)).find((d) => d.startsWith('playwright-chromium@'))
  return import(pathToFileURL(join(store, dir, 'node_modules/playwright-chromium/index.js')).href)
}
const pw = await playwright(); const chromium = pw.chromium || pw.default.chromium
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const failed = []
const clip = (u) => /\.(mp4|webm)\b/i.test(u)  // also the release redirect (filename in the query)
page.on('response', (r) => { if (r.status() >= 400 && !clip(r.url())) failed.push(`${r.status()} ${r.url()}`) })
page.on('requestfailed', (r) => { if (!clip(r.url())) failed.push(`ERR ${r.url()} ${r.failure()?.errorText}`) })
await mkdir(out, { recursive: true })
const base = `http://localhost:${port}${prefix}`
await page.goto(`${base}#/1`); await page.waitForTimeout(4000)
for (const n of list.split(',').map(Number)) {
  await page.evaluate((n) => { location.hash = `#/${n}` }, n)
  await page.waitForTimeout(wait)
  await page.screenshot({ path: join(out, `${String(n).padStart(2, '0')}.png`) })
}
await page.goto(`${base}?print=true#/1`); await page.waitForTimeout(6000)
await page.screenshot({ path: join(out, 'print-top.png') })
await browser.close(); server.close()
const uniq = [...new Set(failed)].map((f) => f.replace(`http://localhost:${port}`, ''))
for (const f of uniq) console.log(f)
console.log(uniq.length ? `${uniq.length} failed request(s) under ${prefix}` : `pages ok: nothing failed under ${prefix}; shots in ${out}`)
process.exit(uniq.length ? 1 : 0)
