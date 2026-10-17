#!/usr/bin/env node
// Build a one-file theme gallery for the interview: the recommended themes first and large, each
// with why it fits this church, then the other directions smaller. Screenshots are embedded.
//
//   node theme-gallery.mjs --church "Grace Lutheran Church" \
//     --rec 10 "Your building and Sunday times up front..." --rec 05 "..." [--rec 04 "..."] \
//     [--out brief-assets/themes.html]
import { readFileSync, writeFileSync, existsSync, mkdirSync, realpathSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(realpathSync(fileURLToPath(import.meta.url)));
const previews = resolve(here, '../../church-site-design/previews');
const args = process.argv.slice(2);
let church = '', out = 'brief-assets/themes.html'; const rec = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--church') church = args[++i];
  else if (args[i] === '--out') out = args[++i];
  else if (args[i] === '--rec') rec.push({ id: args[++i].padStart(2, '0'), why: args[++i] || '' });
}
if (!rec.length) { console.error('usage: theme-gallery.mjs --church NAME --rec NN "why it fits" [--rec NN "..."] [--out file]'); process.exit(2); }

// Visitor-terms descriptions (no design jargon).
const T = {
  '01': ['Cinematic Worship', 'Big, dark, full-screen worship photos and video, bold short headline, a countdown to the next service.'],
  '02': ['Message-First Media', 'The latest sermon front and centre with the series artwork, then a library of past messages.'],
  '03': ['Campaign Billboard', 'Bold colour and big type for the season\'s big event, with a busy, celebratory calendar.'],
  '04': ['Bright & Friendly Modern', 'Light and airy, warm photos of people, friendly plain words and a clear first-visit path.'],
  '05': ['Family-Forward Playful', 'Bright colours, kids and families first, check-in times and age groups up front.'],
  '06': ['Editorial Quiet', 'Calm, book-like pages with fine type, the church year and the order of worship.'],
  '07': ['Heritage Cathedral', 'The historic building and its music lead, rich colours, dignified and grand.'],
  '08': ['Catholic Parish Hub', 'Mass and confession times first, sacraments, bilingual, parish life at a glance.'],
  '09': ['Dark Moody Brand', 'Dark, stylish and minimal, made for young adults and evening gatherings.'],
  '10': ['Small-Town Welcome', 'Your building and Sunday times up front, a note from the pastor, large readable type, warm and plain-spoken.'],
};
const img = (nn, kind) => { const p = join(previews, `${nn}-${kind}.jpg`); return existsSync(p) ? `data:image/jpeg;base64,${readFileSync(p).toString('base64')}` : ''; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const recIds = rec.map((r) => r.id);
const others = Object.keys(T).filter((k) => !recIds.includes(k));

const big = (r, i) => `
<article class="rec">
  <div class="label"><span class="n">${i + 1}</span><div><h2>${esc(T[r.id][0])}</h2><p class="what">${esc(T[r.id][1])}</p>${r.why ? `<p class="why"><strong>Why it fits:</strong> ${esc(r.why)}</p>` : ''}</div></div>
  <div class="pair"><figure><img src="${img(r.id, 'desktop')}" alt="${esc(T[r.id][0])} homepage on a computer"><figcaption>Computer</figcaption></figure><figure class="phone"><img src="${img(r.id, 'phone')}" alt="${esc(T[r.id][0])} homepage on a phone"><figcaption>Phone</figcaption></figure></div>
</article>`;
const small = (id) => `<figure class="mini"><img src="${img(id, 'desktop')}" alt="${esc(T[id][0])} homepage" loading="lazy"><figcaption><strong>${esc(T[id][0])}</strong>${esc(T[id][1])}</figcaption></figure>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Theme Options${church ? ' · ' + esc(church) : ''}</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,600&family=Public+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f4ef;--surface:#fffdf9;--ink:#1f1d1a;--soft:#5b564f;--line:#e4ddd2;--accent:#2f5d50}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#171614;--surface:#211f1c;--ink:#f1ece4;--soft:#b5ada2;--line:#38342f;--accent:#7fb5a3}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:400 18px/1.55 'Public Sans',system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:40px 20px 64px}
h1,h2{font-family:'Newsreader',Georgia,serif;font-weight:600;line-height:1.15;margin:0}h1{font-size:clamp(32px,5vw,48px)}h2{font-size:30px}
.intro{color:var(--soft);max-width:60ch;margin:12px 0 32px}
.rec{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:28px;margin-bottom:28px}
.label{display:flex;gap:18px;align-items:flex-start;margin-bottom:20px}.n{flex:none;width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:600;font-size:20px}
.what{margin:6px 0 0}.why{margin:8px 0 0;color:var(--soft)}
.pair{display:grid;grid-template-columns:3fr 1fr;gap:20px;align-items:start}
figure{margin:0}img{width:100%;height:auto;display:block;border-radius:10px;border:1px solid var(--line)}figcaption{font-size:16px;color:var(--soft);margin-top:8px}
h3{font:600 22px 'Newsreader',Georgia,serif;margin:44px 0 6px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-top:16px}
.mini img{aspect-ratio:4/5;object-fit:cover;object-position:top}.mini figcaption strong{display:block;color:var(--ink);font-size:17px}
@media (max-width:760px){.pair{grid-template-columns:1fr}.phone{max-width:240px}.rec{padding:18px}}
</style></head><body><main class="wrap">
<h1>Which of these feels like ${church ? esc(church) : 'your church'}?</h1>
<p class="intro">These are example homepages for made-up churches, so ignore the names and words. Look at the feel: the layout, the colours, how much photo, how it reads on a phone. Pick every one you like; your site would use your own photos, times and words.</p>
${rec.map(big).join('')}
<h3>The other directions</h3><p class="intro" style="margin:0">Any of these is fine to choose too.</p>
<div class="grid">${others.map(small).join('')}</div>
</main></body></html>`;
mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(out, html);
console.log('wrote ' + out);
