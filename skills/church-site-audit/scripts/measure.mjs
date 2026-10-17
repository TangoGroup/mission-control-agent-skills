#!/usr/bin/env node
// Measure a live church website in a real browser for the church-site-audit scorecard.
//
//   node measure.mjs <homepage URL> [--out audit] [--max 15] [--pages url,url] [--taste DIR]
//
// Opens the homepage, finds the pages in its menu (newcomer, kids, watch, give... first), and
// measures each at 1440px and 390px: first-screen facts, footer contact, menu, tap sizes, text size,
// contrast, alt text, headings, fonts, enlarged photos, links, titles, speed. Saves screenshots
// (audit/shots), each page's text (audit/text) and every number to audit/measure.json.
// Uses taste-skill's zero-dependency Chrome driver. Node 22+.
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const out = resolve(flag('out', 'audit'));
const max = +flag('max', '15');
const extra = flag('pages', '').split(',').filter(Boolean);
let taste = flag('taste', process.env.TASTE || '');
const start = args[0];
if (!start || !/^https?:\/\//.test(start)) { console.error('usage: node measure.mjs <https://church.example> [--out audit] [--max 15] [--pages url,url]'); process.exit(2); }

function findTaste() {
  const c = [join(homedir(), '.claude/skills/design-taste-frontend'), join(homedir(), '.agents/skills/design-taste-frontend')];
  for (const d of c) if (existsSync(join(d, 'scripts/lib/cdp.mjs'))) return d;
  const walk = (dir, depth) => { if (depth > 7) return ''; let ents = []; try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return ''; }
    for (const e of ents) { if (!e.isDirectory()) continue; const p = join(dir, e.name); if (e.name === 'design-taste-frontend' && existsSync(join(p, 'scripts/lib/cdp.mjs'))) return p; const r = walk(p, depth + 1); if (r) return r; } return ''; };
  return walk(join(homedir(), '.claude/plugins'), 0);
}
taste = taste || findTaste();
if (!taste) { console.error('taste-skill (design-taste-frontend) not found; install it or pass --taste DIR.'); process.exit(2); }
const { Browser, sleep } = await import(pathToFileURL(join(taste, 'scripts/lib/cdp.mjs')).href);

for (const d of ['shots', 'text']) mkdirSync(join(out, d), { recursive: true });
const slug = (u) => { const p = new URL(u).pathname.replace(/\/+$/, ''); return p ? p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60) : 'home'; };

// ---------------------------------------------------------------- in-page probe
function probe() {
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const text = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const H = innerHeight;
  const top = (el) => el.getBoundingClientRect().top + scrollY;
  const timeRe = /\b\d{1,2}(:\d{2})?\s?(a\.?m\.?|p\.?m\.?)(?![a-z])|\b\d{1,2}:\d{2}\b/i;
  const streetRe = /\d+\s+[A-Za-z0-9.' ]{1,40}\b(St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Hwy|Highway|Pkwy|Parkway|Ct|Court|Pl|Place|Calle|Pike|Trail|Circle)\b\.?/;
  const newRe = /plan (a|your) visit|plan your first|i'?m new|new here|first time|what to expect|^visit( us)?$|^new$|nuevo|visítanos/i;
  const out = {};

  // Text nodes: first-screen service time and address.
  let time = '', addrFirst = '', addrAny = '';
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const n = w.currentNode; const t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || !vis(el)) continue;
    const r = el.getBoundingClientRect(); const first = r.top + scrollY < H - 10 && r.bottom > 0;
    if (!time && first && timeRe.test(t)) {
      let ctx = el; for (let i = 0; i < 3 && ctx.parentElement && text(ctx).length < 40; i++) ctx = ctx.parentElement;
      const c = text(ctx);
      const office = /office|opening|open daily|doors open|hours/i.test(c) && !/worship|service|mass|misa/i.test(c);
      if (!office && /worship|service|mass|misa|sunday|saturday|domingo|school|eucharist|gather|vigil|evensong|liturgy|communion|traditional|contemporary|celebration/i.test(c)) time = c.slice(0, 80);
    }
    if (streetRe.test(t)) { const m = t.match(streetRe)[0]; addrAny = addrAny || m; if (first && !addrFirst) addrFirst = m; }
  }
  out.timeInFirstScreen = time; out.addressInFirstScreen = addrFirst; out.addressOnPage = addrAny;

  const anchors = [...document.querySelectorAll('a[href]')];
  const lbl = (a) => !a || !a.getAttribute ? '' : (text(a) || a.getAttribute('aria-label') || a.getAttribute('title') || a.querySelector('img')?.alt || '').slice(0, 60);
  const visA = anchors.filter(vis);
  out.newcomerInFirstScreen = lbl(visA.find((a) => top(a) < H - 10 && newRe.test(lbl(a))));
  out.newcomerOnPage = lbl(visA.find((a) => newRe.test(lbl(a))));

  // Header: elements in <header>, a top-level <nav>, or anything in the top 200px.
  const inHeader = (el) => !!el.closest('header, [role=banner]') || (top(el) < 200 && !el.closest('main, article, footer'));
  const navAnchors = visA.filter((a) => (a.closest('nav, header, [role=navigation], [role=banner]') || top(a) < 160) && top(a) < 400 && !el_in_footer(a));
  function el_in_footer(a) { return !!a.closest('footer, [role=contentinfo]'); }
  out.navLinks = [...new Set(navAnchors.filter((a) => !/^(tel|mailto):/.test(a.getAttribute('href') || '') && !a.querySelector('img') && text(a))
    .map(text).filter((t) => t.length < 40 && !/\bgive\b|giving|donate|plan (a|your)|i'?m new|new here|^(en|es|english|español)$|^menu$|^close$|log ?in|sign ?in|search/i.test(t)))];
  out.headerGive = visA.some((a) => inHeader(a) && /\bgive\b|giving|donate|tithe/i.test(lbl(a) + ' ' + a.href));

  // Footer contact.
  const foot = [...document.querySelectorAll('footer, [role=contentinfo]')].pop() || null;
  const ft = foot ? text(foot) : text(document.body).slice(-1500);
  out.footer = { phone: /\(?\d{3}\)?[\s.‑-]\d{3}[\s.‑-]\d{4}/.test(ft), address: streetRe.test(ft), email: /[\w.+-]+@[\w-]+\.[\w.]+/.test(ft) || !!foot?.querySelector('a[href^="mailto:"]'), found: !!foot };
  out.copyright = (ft.match(/(©|copyright)\s*(\d{4})/i) || [])[2] || '';
  out.telLinks = anchors.filter((a) => /^tel:/i.test(a.getAttribute('href') || '')).length;

  // Homepage tasks one click away.
  const task = (re, hrefRe) => lbl(anchors.find((a) => re.test(lbl(a)) || (hrefRe && hrefRe.test(a.getAttribute('href') || '')))).slice(0, 40);
  out.tasks = {
    visit: task(/plan (a|your) visit|i'?m new|new here|first time|what to expect|^visit|service times|times (&|and) location|sunday mornings?|^new$|^sundays?$|worship times/i, /\/(visit|new|plan|im-new|first-time|what-to-expect)/i),
    give: task(/\bgive\b|giving|donate|tithe|offering/i, /\/(give|giving|donate)|tithe\.ly|pushpay|subsplash.*give|onrealm|planningcenteronline.*giving|churchcenter\.com\/giving/i),
    watch: task(/watch|live|livestream|sermon|messages?$|media|podcast/i, /youtube\.com|vimeo\.com|\/(media|sermons|watch|live|messages)/i),
    kids: task(/kids|children|child|students|youth|nursery|jr\.? high|high school|teens/i, /\/(kids|children|youth|students|nursery)/i),
    events: task(/events?|calendar|happenings/i, /\/(events|calendar)/i),
    contact: task(/contact|location|directions|find us|map|get in touch/i, /\/(contact|location|directions)|maps\.(google|apple)|goo\.gl\/maps/i),
  };

  // Overflow and phone menu candidate.
  out.overflowX = document.documentElement.scrollWidth > innerWidth + 2;
  const menuBtn = [...document.querySelectorAll('button, a, [role=button], [aria-expanded], [class*=menu i], [class*=burger i], [class*=toggle i], [id*=menu i]')]
    .filter((el) => vis(el) && top(el) < 220 && text(el).length < 30)
    .filter((el) => el.hasAttribute('aria-expanded') || /menu|burger|nav-?toggle|navbar-toggler|mobile-nav/i.test((el.getAttribute('aria-label') || '') + ' ' + (typeof el.className === 'string' ? el.className : '') + ' ' + el.id + ' ' + text(el)))
    .sort((a, c) => (/^(BUTTON)$/.test(c.tagName) || c.hasAttribute('aria-expanded') ? 1 : 0) - (/^(BUTTON)$/.test(a.tagName) || a.hasAttribute('aria-expanded') ? 1 : 0) || a.getBoundingClientRect().width * a.getBoundingClientRect().height - c.getBoundingClientRect().width * c.getBoundingClientRect().height)[0];
  if (menuBtn) menuBtn.setAttribute('data-audit-menu', '1');
  out.menuCandidate = menuBtn ? (menuBtn.getAttribute('aria-label') || text(menuBtn) || 'menu button').toString().slice(0, 40) : '';
  out.visibleNavCount = navAnchors.length;

  // Tap targets (links inside sentences excluded).
  const taps = [...document.querySelectorAll('a[href], button, [role=button], input[type=submit], input[type=button], select, summary')]
    .filter((el) => vis(el) && !el.closest('p') && !(el.tagName === 'A' && el.parentElement && text(el.parentElement).length > text(el).length + 25 && getComputedStyle(el).display === 'inline'));
  const small = taps.filter((el) => el.getBoundingClientRect().height < 44);
  out.tap = { total: taps.length, small: small.length, examples: [...new Set(small.map((e) => (text(e) || e.getAttribute('aria-label') || e.querySelector('img')?.alt || 'an unlabelled icon').slice(0, 30)))].slice(0, 6) };

  // Body text size.
  const ps = [...document.querySelectorAll('p, li, dd')].filter((p) => vis(p) && !p.closest('header, nav, footer, [role=navigation]') && text(p).length > 30).map((p) => parseFloat(getComputedStyle(p).fontSize)).sort((a, b) => a - b);
  out.bodySize = ps.length ? Math.round(ps[Math.floor(ps.length / 2)] * 10) / 10 : null;

  // Contrast (WCAG AA). Text over photos or video is skipped.
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const mix = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => { const ch = [c.r, c.g, c.b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]; };
  const bgOf = (el) => { const layers = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== 'none') return null; const c = parse(s.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } } let b = { r: 255, g: 255, b: 255, a: 1 }; for (const l of layers.reverse()) b = mix(l, b); return b; };
  // null = text sits on a photo, video or gradient (not counted); undefined = could not tell.
  const paintedBg = (el) => { const r = el.getBoundingClientRect(); const x = r.left + Math.min(r.width / 2, 40), y = r.top + r.height / 2; if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return undefined;
    const layers = []; for (const e of document.elementsFromPoint(x, y)) { if (e === el || el.contains(e)) continue; if (/^(IMG|VIDEO|PICTURE|CANVAS|IFRAME|svg)$/i.test(e.tagName)) return null; const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== 'none') return null; const c = parse(s.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
    let b = { r: 255, g: 255, b: 255, a: 1 }; for (const l of layers.reverse()) b = mix(l, b); return b; };
  const overMedia = (el) => { const r = el.getBoundingClientRect(); const x = r.left + Math.min(r.width / 2, 40), y = r.top + r.height / 2; if (y < 0 || y > innerHeight) return false; return document.elementsFromPoint(x, y).some((e) => /^(IMG|VIDEO|PICTURE|CANVAS|IFRAME)$/.test(e.tagName) || (getComputedStyle(e).backgroundImage || 'none') !== 'none'); };
  const texts = [...document.querySelectorAll('body *')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1) && vis(el) && !/^(SCRIPT|STYLE|NOSCRIPT|OPTION)$/.test(el.tagName)).slice(0, 700);
  let total = 0, pass = 0; const worst = [];
  for (const el of texts) {
    const s = getComputedStyle(el); const fg = parse(s.color); if (!fg) continue;
    const bg = bgOf(el); if (!bg) continue;
    const f = mix(fg, bg); const L1 = lum(f), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700; const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    let r2 = ratio;
    if (ratio < need) {
      // Backgrounds are often painted by an overlay layer, not an ancestor: read what is under the text.
      el.scrollIntoView({ block: 'center' });
      const under = paintedBg(el); if (under === null) continue;
      if (under) { const f2 = mix(fg, under); const a = lum(f2), c = lum(under); r2 = (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05); }
    }
    total++; if (r2 >= need) pass++; else worst.push({ text: text(el).slice(0, 40), ratio: Math.round(r2 * 10) / 10 });
  }
  scrollTo(0, 0);
  worst.sort((a, b) => a.ratio - b.ratio);
  out.contrast = { total, pass, worst: worst.slice(0, 5) };

  // Images, headings, fonts.
  const imgs = [...document.images].filter((i) => i.naturalWidth > 40 || i.getBoundingClientRect().width > 40);
  out.images = { total: imgs.length, noAlt: imgs.filter((i) => !i.hasAttribute('alt')).length, list: imgs.slice(0, 40).map((i) => ({ src: i.currentSrc || i.src, alt: i.getAttribute('alt'), w: i.naturalWidth, h: i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) })) };
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).map((h) => +h.tagName[1]);
  out.h1 = hs.filter((l) => l === 1).length;
  out.headingSkips = hs.some((l, i) => i > 0 && l > hs[i - 1] + 1);
  out.headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.tagName + ': ' + text(h).slice(0, 70)).slice(0, 30);
  const fam = {}; for (const el of texts) { const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (!f || /awesome|icon|glyph|dashicons|eicons|material|fa-|ionicons|themify|feather|social/i.test(f)) continue; fam[f] = (fam[f] || 0) + 1; }
  out.fonts = Object.entries(fam).filter(([, n]) => n >= 2).map(([f]) => f);
  out.stretched = [...document.images].filter((i) => vis(i) && i.naturalWidth > 0).map((i) => { const r = i.getBoundingClientRect(); const fit = getComputedStyle(i).objectFit; const s = fit === 'cover' ? Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight) : r.width / i.naturalWidth; return { src: i.currentSrc || i.src, scale: Math.round(s * 100) / 100, shown: Math.round(r.width), real: i.naturalWidth }; }).filter((x) => x.scale > 1.15);
  return out;
}

function pageFacts() {
  const m = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) || '';
  const scripts = [...document.querySelectorAll('script[src], link[href]')].map((s) => s.src || s.href).join(' ') + ' ' + m('meta[name=generator]');
  const platforms = [['Tithe.ly', /tithely|tithe\.ly/i], ['Squarespace', /squarespace/i], ['Wix', /wix(static)?\.com/i], ['WordPress', /wp-content|wordpress/i], ['Clover Sites', /cloversites/i], ['Subsplash', /subsplash/i], ['Nucleus', /nucleus/i], ['eCatholic', /ecatholic/i], ['Faithlife Sites', /faithlife/i], ['Church Plant Media', /churchplantmedia/i], ['Ekklesia 360', /ekklesia360|monkdev/i], ['Webflow', /webflow/i], ['Weebly', /weebly/i], ['Ministry Designs', /ministrydesigns/i], ['Finalweb', /finalweb/i]];
  const body = document.body.innerText;
  const dateRe = /\b(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|June?|July?|Aug(ust)?|Sep(t(ember)?)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\.?\s+\d{1,2}(st|nd|rd|th)?(,?\s+\d{4})?|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g;
  const dates = []; let x; while ((x = dateRe.exec(body)) && dates.length < 40) dates.push(body.slice(Math.max(0, x.index - 50), x.index + x[0].length + 30).replace(/\s+/g, ' '));
  const all = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, text: (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60) })).filter((a) => /^https?:/.test(a.href));
  const menu = [...document.querySelectorAll('header a[href], nav a[href], [role=navigation] a[href], [role=banner] a[href]')].map((a) => a.href);
  const nav = performance.getEntriesByType('navigation')[0];
  return {
    meta: { title: document.title.trim(), description: m('meta[name=description]').trim(), ogImage: m('meta[property="og:image"]') || m('meta[name="twitter:image"]'), viewport: /width=device-width/.test(m('meta[name=viewport]')), lang: document.documentElement.lang || '', generator: m('meta[name=generator]') },
    platform: platforms.filter(([, re]) => re.test(scripts)).map(([n]) => n),
    iframes: [...document.querySelectorAll('iframe')].map((f) => f.src).filter(Boolean),
    pdfs: all.filter((a) => /\.pdf(\?|$)/i.test(a.href)).slice(-200),
    links: all, menu,
    dates,
    loadMs: nav ? Math.round(nav.loadEventEnd || nav.domContentLoadedEventEnd) : null,
    text: body,
  };
}

// ---------------------------------------------------------------- run
const b = await Browser.launch({});
const origin = new URL(start).origin.replace('://www.', '://');
const sameSite = (u) => { try { return new URL(u).origin.replace('://www.', '://') === origin; } catch { return false; } };
const result = { start, when: new Date().toISOString(), tool: 'church-site-audit measure.mjs', pages: [], links: { checked: 0, broken: [] } };

async function measure(url, isHome) {
  const page = { url, path: new URL(url).pathname || '/', slug: slug(url), ok: false };
  try {
    for (const [view, w, h, mobile] of [['desktop', 1440, 900, false], ['mobile', 390, 844, true]]) {
      const p = await b.newPage({ width: w, height: h, mobile, reducedMotion: true });
      let bytes = 0;
      if (isHome && view === 'desktop') { await p.send('Network.enable'); b.on(p.sessionId, 'Network.loadingFinished', (e) => { bytes += e.encodedDataLength || 0; }); }
      await p.goto(url, { settleMs: 2500, timeoutMs: 30000 });
      if (view === 'desktop') {
        const f = await p.eval(pageFacts);
        Object.assign(page, { finalUrl: await p.eval('location.href'), meta: f.meta, platform: f.platform, iframes: f.iframes, pdfs: f.pdfs, dates: f.dates, menu: f.menu, perf: { loadMs: f.loadMs } });
        page.linkList = f.links;
        writeFileSync(join(out, 'text', page.slug + '.txt'), `${url}\n\n${f.text}`);
      }
      // Load lazy images so sizes are real, then come back to the top.
      await p.eval(() => new Promise((res) => { const imgs = [...document.images]; imgs.forEach((i) => { i.loading = 'eager'; }); let left = imgs.filter((i) => !i.complete).length; if (!left) return res(); imgs.forEach((i) => i.complete || i.addEventListener('load', () => --left || res(), { once: true })); setTimeout(res, 6000); }));
      await p.eval('scrollTo(0,0)'); await sleep(300);
      await p.screenshot({ path: join(out, 'shots', `${page.slug}-${view}.jpg`) });
      const r = await p.eval(probe);
      await p.screenshot({ path: join(out, 'shots', `${page.slug}-${view}-full.jpg`), fullPage: true, quality: 55 });
      if (view === 'mobile') {
        // Does the phone menu open? Count visible menu links before and after one click.
        let note = '';
        const before = r.visibleNavCount;
        if (r.menuCandidate) {
          await p.eval(() => { const el = document.querySelector('[data-audit-menu]'); el && el.click(); });
          await sleep(900);
          const after = await p.eval(() => [...document.querySelectorAll('a[href]')].filter((a) => { const r = a.getBoundingClientRect(); const s = getComputedStyle(a); return r.width > 1 && r.height > 1 && r.top < innerHeight && r.bottom > 0 && s.visibility !== 'hidden' && +s.opacity > 0.05; }).length);
          await p.screenshot({ path: join(out, 'shots', `${page.slug}-mobile-menu.jpg`) });
          const opened = after > before + 2;
          r.menu = { ok: opened, note: opened ? `Menu button "${r.menuCandidate}" opens the navigation (${after - before} more links).` : `Menu button "${r.menuCandidate}" found, but tapping it showed no new links.` };
        } else {
          r.menu = { ok: !r.overflowX && before <= 6 && before > 0, note: before ? `No menu button; ${before} links shown in the header.` : 'No menu button and no navigation visible on a phone.' };
        }
        void note;
      }
      if (isHome && view === 'desktop') page.perf.mb = Math.round(bytes / 1e5) / 10;
      page[view] = r;
      await p.close();
    }
    page.ok = true;
  } catch (e) { page.error = String(e.message || e).slice(0, 200); }
  return page;
}

console.log('measuring ' + start);
const home = await measure(start, true);
result.pages.push(home);
if (!home.ok) { console.error('homepage failed: ' + home.error); await b.close(); writeFileSync(join(out, 'measure.json'), JSON.stringify(result, null, 1)); process.exit(1); }

// Pages to audit: the menu, important ones first, then any given.
const want = /visit|new|about|who-we-are|kids|child|youth|student|give|giving|watch|media|sermon|message|live|event|calendar|contact|location|staff|leader|belief|connect|group|next|ministr|prayer/i;
const seen = new Set([new URL(home.finalUrl).pathname.replace(/\/$/, '') || '/']);
const cand = [...extra, ...home.menu.filter(sameSite).filter((u) => !/\.(pdf|jpg|png|docx?)(\?|$)/i.test(u) && !/#/.test(u.replace(/#$/, '')))];
cand.sort((a, c) => (want.test(c) ? 1 : 0) - (want.test(a) ? 1 : 0));
const queue = [];
for (const u of cand) { const k = new URL(u).pathname.replace(/\/$/, '') || '/'; if (seen.has(k)) continue; seen.add(k); queue.push(u.split('#')[0]); if (queue.length >= max - 1) break; }
for (const u of queue) { console.log('  ' + new URL(u).pathname); result.pages.push(await measure(u, false)); }
await b.close();

// Link check: every link on audited pages, same-site first. Bot-blocking codes are not counted as broken.
const links = new Map();
for (const p of result.pages) for (const l of p.linkList || []) { const u = l.href.split('#')[0]; if (!links.has(u)) links.set(u, { from: p.path, text: l.text }); }
const urls = [...links.keys()].sort((a, c) => (sameSite(c) ? 1 : 0) - (sameSite(a) ? 1 : 0)).filter((u) => !/facebook\.com|instagram\.com|twitter\.com|x\.com|linkedin\.com/i.test(u)).slice(0, 220);
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
async function check(u) {
  for (const method of ['HEAD', 'GET']) {
    try { const r = await fetch(u, { method, redirect: 'follow', headers: { 'user-agent': ua }, signal: AbortSignal.timeout(12000) });
      if (method === 'HEAD' && (r.status === 405 || r.status === 403 || r.status >= 500)) continue;
      return r.status;
    } catch (e) { if (method === 'GET') return 'error'; }
  }
  return 'error';
}
let i = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (i < urls.length) { const u = urls[i++]; const s = await check(u); result.links.checked++; if (s === 'error' || s === 404 || s === 410 || (typeof s === 'number' && s >= 500)) result.links.broken.push({ url: u, status: s, from: links.get(u).from, text: links.get(u).text }); } }));

for (const p of result.pages) { p.links = (p.linkList || []).length; delete p.linkList; }
writeFileSync(join(out, 'measure.json'), JSON.stringify(result, null, 1));
const h = result.pages[0];
console.log(`\n${result.pages.filter((p) => p.ok).length} pages measured, ${result.links.checked} links checked (${result.links.broken.length} broken).`);
console.log(`home: times on phone "${h.mobile.timeInFirstScreen || '-'}", newcomer "${h.desktop.newcomerInFirstScreen || '-'}", body ${h.desktop.bodySize}px, ${h.desktop.navLinks.length} menu links, ${h.perf.mb} MB / ${h.perf.loadMs} ms, platform ${h.platform.join(', ') || '?'}`);
console.log(`wrote ${join(out, 'measure.json')}, shots/, text/`);
