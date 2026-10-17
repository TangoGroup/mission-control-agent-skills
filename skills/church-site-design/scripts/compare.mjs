#!/usr/bin/env node
// Build drafts/compare.html: the latest round of homepage drafts side by side as embedded screenshots
// (computer: first two screens; phone: first screen and a half), with earlier rounds listed below.
// Screenshots make it one file that works anywhere: a static preview pane, email, a published page.
// Drafts are drafts/home-v<round><letter?>.html, each with <meta name="draft-note" content="...">.
//
//   node compare.mjs [drafts] [--taste DIR]
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const ti = argv.indexOf('--taste'); const tasteArg = ti >= 0 ? argv.splice(ti, 2)[1] : '';
const dir = argv[0] || 'drafts';
const files = readdirSync(dir).filter((f) => /^home-v\d+[a-z]?\.html$/.test(f));
if (!files.length) { console.error(`no home-v*.html drafts in ${dir}`); process.exit(1); }
const info = files.map((f) => {
  const [, round, letter] = f.match(/^home-v(\d+)([a-z]?)\.html$/);
  const src = readFileSync(join(dir, f), 'utf8');
  const note = (src.match(/<meta\s+name=["']draft-note["']\s+content=["']([^"']*)["']/i) || [])[1] || '';
  return { f, round: +round, letter, note, label: `Version ${round}${letter.toUpperCase()}` };
}).sort((a, b) => a.round - b.round || a.letter.localeCompare(b.letter));
const last = Math.max(...info.map((d) => d.round));
const latest = info.filter((d) => d.round === last);
const earlier = info.filter((d) => d.round < last).reverse();
// Photograph each draft in the latest round (taste-skill's Chrome driver).
const taste = tasteArg || [join(homedir(), '.claude/skills/design-taste-frontend'), join(homedir(), '.agents/skills/design-taste-frontend')].find((d) => existsSync(join(d, 'scripts/lib/cdp.mjs')));
const shots = {};
if (taste) {
  const { Browser, sleep } = await import(pathToFileURL(join(taste, 'scripts/lib/cdp.mjs')).href);
  mkdirSync(join(dir, '.shots'), { recursive: true });
  const b = await Browser.launch({});
  for (const d of latest) {
    shots[d.f] = {};
    for (const [kind, w, h, mobile, clipH, scale] of [['desktop', 1440, 900, false, 1800, 0.6], ['phone', 390, 844, true, 1260, 1]]) {
      const p = await b.newPage({ width: w, height: h, mobile, reducedMotion: true });
      await p.goto(pathToFileURL(resolve(dir, d.f)).href, { settleMs: 1500 });
      await p.eval(() => new Promise((res) => { const imgs = [...document.images]; imgs.forEach((i) => { i.loading = 'eager'; }); let left = imgs.filter((i) => !i.complete).length; if (!left) return res(); imgs.forEach((i) => i.complete || i.addEventListener('load', () => --left || res(), { once: true })); setTimeout(res, 6000); }));
      await sleep(300);
      const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: clipH, scale } }, 45000);
      writeFileSync(join(dir, '.shots', `${d.f.replace('.html', '')}-${kind}.jpg`), Buffer.from(data, 'base64'));
      shots[d.f][kind] = 'data:image/jpeg;base64,' + data;
      await p.close();
    }
  }
  await b.close();
} else console.warn('taste-skill not found: showing live frames instead of screenshots (they may not load in a static preview).');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const tag = (d) => (latest.length > 1 ? d.letter.toUpperCase() : `v${d.round}`);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Homepage Options · Round ${last}</title>
<style>
:root{--bg:#efece6;--surface:#fff;--ink:#1f1d1a;--soft:#5b564f;--line:#ddd5c8;--accent:#2f5d50}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#161513;--surface:#211f1c;--ink:#f1ece4;--soft:#b5ada2;--line:#38342f;--accent:#7fb5a3}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}
header{padding:28px 24px 8px;max-width:1700px;margin:0 auto}h1{font-size:28px;margin:0 0 6px}header p{margin:0;color:var(--soft)}
.toggle{display:inline-flex;gap:6px;margin-top:16px}.toggle button{font:600 16px system-ui;min-height:44px;padding:0 18px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}.toggle button[aria-pressed=true]{background:var(--accent);color:#fff;border-color:transparent}
.row{display:grid;grid-template-columns:repeat(${Math.min(latest.length, 3)},minmax(0,1fr));gap:24px;padding:20px 24px 40px;max-width:1700px;margin:0 auto}
.opt{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px}
.opt h2{font-size:22px;margin:0}.opt h2 span{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;margin-right:10px;font-size:18px}
.note{color:var(--soft);margin:6px 0 12px;min-height:3em}.open{font-weight:600;color:var(--accent)}
.frame{position:relative;overflow:hidden;border-radius:10px;border:1px solid var(--line);background:#fff}
.frame iframe{border:0;transform-origin:0 0;position:absolute;top:0;left:0}
.shot img{display:block;width:100%;height:auto;border-radius:10px;border:1px solid var(--line)}.shot .phone{display:none;max-width:390px;margin:0 auto}body.is-phone .shot .desktop{display:none}body.is-phone .shot .phone{display:block}
.earlier{max-width:1700px;margin:0 auto;padding:0 24px 48px}.earlier ul{padding-left:20px}
@media (max-width:900px){.row{grid-template-columns:1fr}}
</style></head><body>
<header><h1>Homepage ${latest.length > 1 ? 'options' : 'version ' + last}</h1><p>${latest.length > 1 ? 'The top of each option. Open any one full size to scroll the whole page. Pick the closest, then tell me what to change.' : 'The top of the new version. Open it full size to scroll the whole page, then tell me what to change, or that it is the one.'}</p>
<div class="toggle" role="group" aria-label="Screen size"><button type="button" data-w="1440" aria-pressed="true">Computer</button><button type="button" data-w="390" aria-pressed="false">Phone</button></div></header>
<main class="row">${latest.map((d) => `
<section class="opt"><h2><span>${tag(d)}</span>${esc(d.label)}</h2><p class="note">${esc(d.note)}</p>
${shots[d.f] ? `<div class="shot"><img class="desktop" src="${shots[d.f].desktop}" alt="${esc(d.label)} on a computer, first two screens"><img class="phone" src="${shots[d.f].phone}" alt="${esc(d.label)} on a phone, first screen and a half"></div>` : `<div class="frame" data-src="${d.f}"><iframe src="${d.f}" title="${esc(d.label)}" loading="lazy"></iframe></div>`}
<p><a class="open" href="${d.f}" target="_blank">Open full size</a></p></section>`).join('')}
</main>
${earlier.length ? `<section class="earlier"><h2>Earlier versions</h2><ul>${earlier.map((d) => `<li><a href="${d.f}" target="_blank">${esc(d.label)}</a>: ${esc(d.note)}</li>`).join('')}</ul></section>` : ''}
<script>
let W = 1440;
function fit(){document.querySelectorAll('.frame').forEach(f=>{const box=f.clientWidth;const ifr=f.querySelector('iframe');const w=W, h=W===390?844:900;const s=Math.min(1,box/w);ifr.style.width=w+'px';ifr.style.height=(h*1.6)+'px';ifr.style.transform='scale('+s+')';f.style.height=(h*1.6*s)+'px';if(W===390){f.style.maxWidth=(390*Math.min(1,box/390))+'px';f.style.margin='0 auto'}else{f.style.maxWidth='';f.style.margin=''}})}
document.querySelectorAll('.toggle button').forEach(b=>b.addEventListener('click',()=>{W=+b.dataset.w;document.body.classList.toggle('is-phone',W===390);document.querySelectorAll('.toggle button').forEach(x=>x.setAttribute('aria-pressed',x===b));fit()}));
addEventListener('resize',fit);fit();
</script></body></html>`;
writeFileSync(join(dir, 'compare.html'), html);
console.log(`wrote ${join(dir, 'compare.html')}: round ${last}, ${latest.map((d) => d.f).join(', ')}`);
