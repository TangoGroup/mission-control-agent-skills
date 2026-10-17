// Church-specific checks for a built site, in a real browser (taste-skill's Chrome driver).
// node church-check.mjs <site dir> <direction NN> <taste-skill dir> [page.html]
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , site, direction = '00', taste, onlyPage] = process.argv;
if (!taste) { console.log('church checks need taste-skill (for its Chrome driver); skipped.'); process.exit(0); }
const { Browser } = await import(pathToFileURL(join(taste, 'scripts/lib/cdp.mjs')).href);

const minBody = ['08', '10'].includes(direction) ? 18 : 16;
const pages = onlyPage ? [onlyPage] : readdirSync(site).filter((f) => f.endsWith('.html')).sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
const fails = [], warns = [];

function probe(args) {
  const { firstScreen } = args;
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const text = (el) => (el.innerText || '').replace(/\s+/g, ' ').trim();
  const timeRe = /\b\d{1,2}(:\d{2})?\s?(a\.?m\.?|p\.?m\.?)(?![a-z])/i;
  const out = {};
  if (firstScreen) {
    let found = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode; const t = n.textContent.trim(); if (!timeRe.test(t)) continue;
      const el = n.parentElement; if (!el || !vis(el) || el.closest('header')) continue;
      // The time must be a service: its surrounding block names one, and is not office or opening hours.
      let ctx = el; for (let i = 0; i < 3 && ctx.parentElement && text(ctx).length < 40; i++) ctx = ctx.parentElement;
      const c = text(ctx);
      if (/office|opening|open daily|doors open|hours/i.test(c) && !/worship|service|mass|misa/i.test(c)) continue;
      if (!/worship|service|mass|misa|sunday|saturday|sundays|domingo|school|eucharist|gather|vigil|evensong|prayer|liturgy|communion|youth|bible/i.test(c)) continue;
      const r = el.getBoundingClientRect(); if (r.top >= 0 && r.top < innerHeight - 10) { found = t.slice(0, 60); break; }
    }
    out.timeInFirstScreen = found;
    const top = [...document.querySelectorAll('a,button')].filter((a) => vis(a) && a.getBoundingClientRect().top < innerHeight - 10).map(text);
    out.newcomer = top.find((t) => /plan (a|your) visit|plan your first|i'?m new|new here|first time|what to expect|^visit( us)?$|nuevo|visítanos/i.test(t)) || '';
  }
  // Page links in the main navigation: not the wordmark, phone, email, Give, newcomer or language buttons.
  const navLinks = [...document.querySelectorAll('header nav a, nav[aria-label] a, header > nav a')].filter(vis)
    .filter((a) => !/^(tel|mailto):/.test(a.getAttribute('href') || '') && !a.querySelector('img,svg'))
    .map(text).filter((t) => t && !/\bgive\b|giving|donate|plan (a|your)|i'?m new|new here|^(en|es|english|español)$|menu|close/i.test(t));
  out.headerLinks = new Set(navLinks).size;
  // Photos shown larger than their real size look soft; object-fit: cover crops scale by the larger ratio.
  out.stretched = [...document.images].filter((i) => vis(i) && i.naturalWidth > 0).map((i) => {
    const r = i.getBoundingClientRect(); const fit = getComputedStyle(i).objectFit;
    const s = fit === 'cover' ? Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight) : r.width / i.naturalWidth;
    return [i.getAttribute('src'), Math.round(s * 100) / 100, Math.round(r.width), i.naturalWidth];
  }).filter(([, s]) => s > 1.15);
  out.give = [...document.querySelectorAll('a')].some((a) => /\bgive\b|giving|donate|ofrenda|donar/i.test(text(a) + ' ' + (a.getAttribute('aria-label') || '')));
  const foot = document.querySelector('footer') || document.body;
  const ft = foot.innerText || '';
  out.phone = /\(?\d{3}\)?[\s.‑-]\d{3}[\s.‑-]\d{4}/.test(ft);
  out.address = /\d+\s+[A-Za-z0-9.' ]{1,40}\b(St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Hwy|Highway|Pkwy|Parkway|Ct|Court|Pl|Place|Calle|Pike|Trail|Circle)\b/.test(ft);
  const body = document.body.innerText;
  const ph = body.match(/lorem|ipsum|\bTBD\b|\bXXX\b|your church name|\[[A-Za-z][^\]\n]{1,40}\]/i);
  out.placeholder = ph ? ph[0] : '';
  const ps = [...document.querySelectorAll('main p, main li, main dd')].filter(vis).map((p) => parseFloat(getComputedStyle(p).fontSize)).sort((a, b) => a - b);
  out.bodySize = ps.length ? ps[Math.floor(ps.length / 2)] : null;
  out.noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src')).slice(0, 5);
  out.broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')).slice(0, 5);
  out.h1 = document.querySelectorAll('h1').length;
  out.timeStyles = [/\d\s?(am|pm)\b/i.test(body), /\d\s?(a\.m\.|p\.m\.)/i.test(body)];
  return out;
}

const b = await Browser.launch({});
for (const page of pages) {
  const url = pathToFileURL(join(site, page)).href;
  for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
    const p = await b.newPage({ width: w, height: h, mobile, reducedMotion: true });
    await p.goto(url, { settleMs: 1800 });
    // Load lazy images so their real sizes can be measured.
    await p.eval(() => new Promise((res) => { const imgs = [...document.images]; imgs.forEach((i) => { i.loading = "eager"; }); let left = imgs.filter((i) => !i.complete).length; if (!left) return res(); imgs.forEach((i) => i.complete || i.addEventListener("load", () => --left || res(), { once: true })); setTimeout(res, 6000); }));
    const r = await p.eval(probe, { firstScreen: page === 'index.html' });
    await p.close();
    const at = `${page} @${w}`;
    if (page === 'index.html') {
      if (!r.timeInFirstScreen) fails.push(`${at}: no service time visible in the first screen`);
      if (!r.newcomer) fails.push(`${at}: no newcomer link (Plan a Visit / I'm New / New Here) in the first screen`);
    }
    if (w === 1440) {
      if (!r.give) fails.push(`${page}: no Give link`);
      if (!r.phone) fails.push(`${page}: no phone number in the footer`);
      if (!r.address) fails.push(`${page}: no street address in the footer`);
      if (r.placeholder) fails.push(`${page}: placeholder text "${r.placeholder}"`);
      if (r.bodySize && r.bodySize < minBody) fails.push(`${page}: body text ${r.bodySize}px (needs ${minBody}px+)`);
      if (r.noAlt.length) fails.push(`${page}: images without alt: ${r.noAlt.join(', ')}`);
      if (r.broken.length) fails.push(`${page}: broken images: ${r.broken.join(', ')}`);
      if (r.headerLinks > 7) warns.push(`${page}: ${r.headerLinks} page links in the main navigation (7 at most; Give and the newcomer button don't count)`);
      if (r.h1 !== 1) warns.push(`${page}: ${r.h1} h1 elements (expected 1)`);
      if (r.timeStyles[0] && r.timeStyles[1]) warns.push(`${page}: times written two ways (am and a.m.)`);
    }
    for (const [src, s, shown, nat] of r.stretched) (s > 1.3 ? fails : warns).push(`${at}: ${src} shown ${s}x its real size (${nat}px source, ${shown}px wide box); show it smaller or use a larger photo`);
    if (page === 'index.html' && r.timeInFirstScreen) console.log(`ok   ${at}: first-screen service time "${r.timeInFirstScreen}"`);
  }
}
await b.close();
for (const f of fails) console.log('FAIL ' + f);
for (const x of warns) console.log('WARN ' + x);
console.log(`church checks: ${fails.length} FAIL, ${warns.length} WARN`);
process.exit(fails.length ? 1 : 0);
