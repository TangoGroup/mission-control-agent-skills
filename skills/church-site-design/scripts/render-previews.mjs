#!/usr/bin/env node
// Maintainer script: photograph the ten reference homepages for the theme gallery.
//   node render-previews.mjs [--taste DIR]
// Writes previews/NN-desktop.jpg (first two screens at 1440px, half scale) and
// previews/NN-phone.jpg (first 1.4 screens at 390px). Re-run after changing an example.
import { readdirSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const skill = resolve(here, '..');
const args = process.argv.slice(2);
const ti = args.indexOf('--taste');
const taste = ti >= 0 ? args[ti + 1] : [join(homedir(), '.claude/skills/design-taste-frontend'), join(homedir(), '.agents/skills/design-taste-frontend')].find((d) => existsSync(join(d, 'scripts/lib/cdp.mjs')));
if (!taste) { console.error('taste-skill not found; pass --taste DIR'); process.exit(2); }
const { Browser, sleep } = await import(pathToFileURL(join(taste, 'scripts/lib/cdp.mjs')).href);

const out = join(skill, 'previews'); mkdirSync(out, { recursive: true });
const b = await Browser.launch({});
for (const f of readdirSync(join(skill, 'examples')).filter((f) => /^\d\d-.*\.html$/.test(f)).sort()) {
  const nn = f.slice(0, 2);
  for (const [kind, w, h, mobile, clipH, scale] of [['desktop', 1440, 900, false, 1800, 0.5], ['phone', 390, 844, true, 1180, 1]]) {
    const p = await b.newPage({ width: w, height: h, mobile, reducedMotion: true });
    await p.goto(pathToFileURL(join(skill, 'examples', f)).href, { settleMs: 2500 });
    await p.eval(() => new Promise((res) => { const imgs = [...document.images]; imgs.forEach((i) => { i.loading = 'eager'; }); let left = imgs.filter((i) => !i.complete).length; if (!left) return res(); imgs.forEach((i) => i.complete || i.addEventListener('load', () => --left || res(), { once: true })); setTimeout(res, 8000); }));
    await sleep(500);
    const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: clipH, scale } }, 45000);
    writeFileSync(join(out, `${nn}-${kind}.jpg`), Buffer.from(data, 'base64'));
    await p.close();
  }
  console.log('rendered ' + f);
}
await b.close();
