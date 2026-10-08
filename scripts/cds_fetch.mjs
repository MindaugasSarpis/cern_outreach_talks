// Fetch CDS pages through Chromium, past the Anubis bot check that CDS
// puts in front of its record pages and record JSON (ported from
// slidev-videos/.tmp/cds-fetch.mjs). Called by photo_fetch.py --browser.
//
//   node scripts/cds_fetch.mjs [--page URL]... [--text URL]... [--save URL PATH]...
//
// --page prints the page's HTML, --text its body text (record JSON renders as
// text), --save writes the response body to PATH using the same browser
// context, so the bot-check cookie carries over. Prints one JSON object:
// { pages: {url: html}, texts: {url: text}, saved: {url: {path, status, contentType}} }.
// playwright-chromium comes from this repo's node_modules, or from the
// directory in $PLAYWRIGHT_PATH. The User-Agent ($CDS_FETCH_UA) names the
// GitHub repo, never an e-mail address.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

async function loadChromium() {
  for (const name of ['playwright-chromium', 'playwright']) {
    try { return (await import(name)).chromium; } catch { /* next */ }
  }
  if (process.env.PLAYWRIGHT_PATH) {
    const require = createRequire(import.meta.url);
    return require(process.env.PLAYWRIGHT_PATH).chromium;
  }
  throw new Error('playwright-chromium not found: pnpm install in the repo, or set PLAYWRIGHT_PATH to its directory');
}

const args = process.argv.slice(2);
const pages = [], texts = [], saves = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--page') pages.push(args[++i]);
  else if (args[i] === '--text') texts.push(args[++i]);
  else if (args[i] === '--save') { saves.push([args[i + 1], args[i + 2]]); i += 2; }
  else { console.error(`unknown argument ${args[i]}`); process.exit(2); }
}
const UA = process.env.CDS_FETCH_UA || 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36';
if (UA.includes('@')) { console.error('the User-Agent must not carry an e-mail address'); process.exit(2); }

const chromium = await loadChromium();
const browser = await chromium.launch();
const ctx = await browser.newContext({ acceptDownloads: true, userAgent: UA });
const page = await ctx.newPage();
const out = { pages: {}, texts: {}, saved: {} };

// Anubis answers with a proof-of-work page that reloads itself; wait until it is gone.
async function settle(test) {
  for (let i = 0; i < 30; i++) {
    if (await page.evaluate(test).catch(() => false)) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

try {
  for (const url of pages) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await settle(() => !/anubis|techaro/i.test(document.documentElement.innerHTML) || document.body.innerText.includes('About this image'));
    out.pages[url] = await page.content();
  }
  for (const url of texts) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await settle(() => /^\s*[[{]/.test(document.body.innerText));
    out.texts[url] = await page.evaluate(() => document.body.innerText);
  }
  for (const [url, path] of saves) {
    if (!pages.length && !texts.length) {             // pass the check on the origin first
      await page.goto(new URL(url).origin + '/', { waitUntil: 'networkidle', timeout: 60000 });
      await settle(() => !/anubis|techaro/i.test(document.documentElement.innerHTML));
    }
    const resp = await ctx.request.get(url, { timeout: 120000 });
    if (resp.ok()) writeFileSync(path, await resp.body());
    out.saved[url] = { path, status: resp.status(), contentType: resp.headers()['content-type'] || '' };
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(out));
