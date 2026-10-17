#!/usr/bin/env node
// Write the audit report from scores.json + story.json: audit/report.html (for the church) and
// audit/church-audit.md (for church-site-brief and the design skills).
//
//   node report.mjs audit [--no-inline]
//
// Screenshots are embedded so report.html is one file that can be emailed or published.
// story.json (written by the auditor, see references/writing.md):
//   { "church": "...", "town": "...", "preparedBy": "...", "headline": "...", "opening": "...",
//     "strengths": ["..."], "topFixes": ["check-id", ...], "notes": { "check-id": "..." }, "closing": "..." }
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, GRADES } from './checks.mjs';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--')) || 'audit';
const inline = !args.includes('--no-inline');
const S = JSON.parse(readFileSync(join(dir, 'scores.json'), 'utf8'));
const st = existsSync(join(dir, 'story.json')) ? JSON.parse(readFileSync(join(dir, 'story.json'), 'utf8')) : {};
const need = ['church', 'headline', 'opening', 'strengths', 'closing'].filter((k) => !st[k] || (Array.isArray(st[k]) && !st[k].length));
if (need.length) { console.error(`story.json is missing: ${need.join(', ')} (see references/writing.md)`); process.exit(1); }
if (S.draft) console.warn('WARNING: scores.json is a draft (some reviewed checks are not scored).');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const byId = Object.fromEntries(S.checks.map((c) => [c.id, c]));
const top = (st.topFixes?.length ? st.topFixes : S.gains).filter((id) => byId[id]?.lost > 0).slice(0, 3).map((id) => byId[id]);
const quick = S.checks.filter((c) => c.lost > 0 && c.effort === 'quick' && !top.includes(c)).sort((a, b) => b.lost - a.lost).slice(0, 5);
const full = S.checks.filter((c) => c.lost === 0).length;
const date = new Date(S.measured).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const img = (f) => { const p = join(dir, 'shots', f); if (!existsSync(p)) return ''; return inline ? `data:image/jpeg;base64,${readFileSync(p).toString('base64')}` : `shots/${f}`; };
const tone = (c) => (c.score == null ? 'none' : c.lost === 0 ? 'full' : c.score > 0 ? 'part' : 'zero');
const pct = (a, b) => Math.round((100 * a) / b);
const fixText = (c) => st.notes?.[c.id] || c.fix;
const firstSentence = (t) => { const m = String(t).match(/^.{40,220}?[.!?](\s|$)/); return m ? m[0].trim() : String(t).slice(0, 220); };
const site = S.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// Score ring
const ring = (v, maxv, size = 168) => { const r = size / 2 - 12, C = 2 * Math.PI * r, f = v / maxv; return `<svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${v} out of ${maxv}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--track)" stroke-width="12"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="49%" text-anchor="middle" class="ring-n">${v}</text><text x="50%" y="66%" text-anchor="middle" class="ring-of">out of ${maxv}</text></svg>`; };
const bar = (v, maxv) => `<span class="bar"><span style="width:${pct(v, maxv)}%"></span></span>`;
const method = (c) => `<span class="chip ${c.method}">${c.method === 'measured' ? 'Measured' : 'Reviewed'}</span>`;

const checkRow = (c) => `
  <li class="check ${tone(c)}">
    <div class="check-head"><span class="dot" aria-hidden="true"></span><h4>${esc(c.label)}</h4>${method(c)}<span class="pts">${c.score ?? '–'} / ${c.points}</span></div>
    <p class="evidence">${esc(c.evidence)}</p>
    ${c.overridden ? `<p class="override">Adjusted by the reviewer. The script measured ${c.overridden.measured} because "${esc(c.overridden.measuredEvidence)}". ${esc(c.overridden.reason)}</p>` : ''}
    ${c.bench ? `<p class="bench">${esc(c.bench)}</p>` : ''}
    ${c.lost > 0 ? `<p class="fix"><strong>Fix:</strong> ${esc(fixText(c))}</p>` : ''}
  </li>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Website Audit · ${esc(st.church)}</title>
<meta name="description" content="${esc(`${st.church} website audit: ${S.total} of ${S.max}. ${st.headline}`)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f4ef;--surface:#fffdf9;--ink:#1f1d1a;--ink-soft:#5b564f;--line:#e4ddd2;--track:#e9e2d6;--accent:#2f5d50;--accent-soft:#e3ece8;--full:#2f7a55;--part:#b7791f;--zero:#b4412f;--none:#8a847b;--serif:'Newsreader',Georgia,serif;--sans:'Public Sans',system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#171614;--surface:#211f1c;--ink:#f1ece4;--ink-soft:#b5ada2;--line:#38342f;--track:#38342f;--accent:#7fb5a3;--accent-soft:#25332e;--full:#6cc095;--part:#e0a948;--zero:#e07a66}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.6 var(--sans)}
.wrap{max-width:1040px;margin:0 auto;padding:0 20px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.15;margin:0}
h2{font-size:clamp(28px,4vw,38px);margin-bottom:8px}h3{font-size:24px}
h4{font:600 17px/1.35 var(--sans);margin:0}
p{margin:0 0 12px}.lede{font-size:19px;color:var(--ink-soft);max-width:62ch}
section{padding:56px 0;border-top:1px solid var(--line)}
.top{padding:40px 0 48px}
.kicker{font:600 14px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.hero{display:grid;grid-template-columns:auto 1fr;gap:36px;align-items:center;margin-top:20px}
.ring-n{font:600 52px var(--serif);fill:var(--ink)}.ring-of{font:500 14px var(--sans);fill:var(--ink-soft)}
.grade{display:inline-block;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:4px 12px;border-radius:999px;margin-bottom:12px}
.hero h1{font-size:clamp(32px,5vw,52px);margin-bottom:14px}
.meta{color:var(--ink-soft);font-size:16px;margin-top:18px}
.cats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 40px;margin-top:36px;padding:24px;background:var(--surface);border:1px solid var(--line);border-radius:14px}
.cat{display:grid;grid-template-columns:1fr 72px 120px;gap:12px;align-items:center;font-size:16px}
.cat b{font-weight:600;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{display:block;height:8px;border-radius:99px;background:var(--track);overflow:hidden}.bar span{display:block;height:100%;background:var(--accent);border-radius:99px}
.fixes{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:22px}
.gain{font:600 30px var(--serif);color:var(--accent)}.gain small{font:500 15px var(--sans);color:var(--ink-soft);margin-left:6px}
.card h4{margin:6px 0 8px;font-size:18px}.card p{font-size:17px}.card .evidence{color:var(--ink-soft);font-size:16px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:24px}
ul.plain{list-style:none;padding:0;margin:0}ul.plain li{padding:10px 0 10px 28px;border-bottom:1px solid var(--line);position:relative}
ul.plain li::before{content:"";position:absolute;left:4px;top:19px;width:10px;height:10px;border-radius:50%;background:var(--full)}
ul.quick li::before{background:var(--part)}ul.plain li span{display:block;color:var(--ink-soft);font-size:16px}
.projection{display:grid;gap:14px;margin-top:24px;max-width:720px}
.proj{display:grid;grid-template-columns:150px 1fr 70px;gap:14px;align-items:center}.proj .bar{height:14px}.proj b{text-align:right;font-variant-numeric:tabular-nums}
.proj.after .bar span{background:var(--full)}
.shots{display:grid;grid-template-columns:3fr 1fr;gap:20px;margin-top:24px;align-items:start}
.shots figure{margin:0}.shots img{width:100%;height:auto;border-radius:10px;border:1px solid var(--line);display:block}
figcaption{font-size:16px;color:var(--ink-soft);margin-top:8px}
.category{margin-top:40px}.category-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap}
.category-head .score{font:600 22px var(--serif);font-variant-numeric:tabular-nums}.category .why{color:var(--ink-soft);max-width:70ch;margin-top:6px}
ol.checks{list-style:none;padding:0;margin:16px 0 0;display:grid;gap:10px}
.check{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
.check-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.check-head h4{flex:1;min-width:200px}
.dot{width:12px;height:12px;border-radius:50%;flex:none}.full .dot{background:var(--full)}.part .dot{background:var(--part)}.zero .dot{background:var(--zero)}.none .dot{background:var(--none)}
.pts{font-weight:700;font-variant-numeric:tabular-nums;min-width:56px;text-align:right}
.chip{font-size:14px;font-weight:600;padding:3px 10px;border-radius:99px;border:1px solid var(--line);color:var(--ink-soft)}.chip.measured{background:var(--accent-soft);color:var(--accent);border-color:transparent}
.evidence{margin:10px 0 0 22px;font-size:17px}.bench,.override{margin:6px 0 0 22px;font-size:16px;color:var(--ink-soft);font-style:italic}
.fix{margin:8px 0 0 22px;font-size:17px}
.method p{max-width:72ch}.method table{width:100%;border-collapse:collapse;font-size:16px;margin-top:12px}
.method th,.method td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}.method th{font-weight:600}
details{margin-top:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 18px}summary{cursor:pointer;font-weight:600;min-height:44px;display:flex;align-items:center}
.closing{background:var(--accent);color:#fff;border-radius:18px;padding:40px;margin-top:8px}.closing h2{color:#fff}.closing p{font-size:19px;max-width:62ch;color:#f3f7f5}
footer{padding:32px 0 56px;color:var(--ink-soft);font-size:16px}
@media (max-width:820px){.hero,.two,.shots{grid-template-columns:1fr}.hero{gap:20px}.fixes{grid-template-columns:1fr}.cats{grid-template-columns:1fr}.cat{grid-template-columns:1fr 64px 80px}.proj{grid-template-columns:110px 1fr 56px}.closing{padding:28px}}
@media print{body{background:#fff;font-size:12pt}section{break-inside:avoid-page;padding:28px 0}.closing{color:#000;background:#eef3f1}.closing h2,.closing p{color:#000}details{display:block}}
</style>
</head>
<body>
<main>
<div class="wrap top">
  <p class="kicker">Website audit · ${esc(st.church)}${st.town ? `, ${esc(st.town.split(',')[0])}` : ''}</p>
  <div class="hero">
    ${ring(S.total, S.max)}
    <div>
      <span class="grade">${esc(S.grade)}</span>
      <h1>${esc(st.headline)}</h1>
      <p class="lede">${esc(st.opening)}</p>
    </div>
  </div>
  <div class="cats" aria-label="Score by category">
    ${S.categories.map((k) => `<div class="cat"><span>${esc(k.name)}</span><b>${k.score} / ${k.points}</b>${bar(k.score, k.points)}</div>`).join('')}
  </div>
  <p class="meta">${esc(st.church)}${st.town ? `, ${esc(st.town)}` : ''} · measured ${date} · ${S.pages.length} pages and ${S.linksChecked} links checked${st.preparedBy ? ` · prepared by ${esc(st.preparedBy)}` : ''}. ${S.measuredPoints} of the ${S.total} points come from measurements a browser took; the rest from a written rubric. <a href="#method">How we scored</a>.</p>
</div>

<section><div class="wrap">
  <p class="kicker">Start here</p>
  <h2>The three changes worth the most</h2>
  <p class="lede">Together they are worth ${Math.round(top.reduce((s, c) => s + c.lost, 0) * 10) / 10} points.</p>
  <div class="fixes">
    ${top.map((c) => `<div class="card"><div class="gain">+${c.lost}<small>points</small></div><h4>${esc(c.label)}</h4><p>${esc(fixText(c))}</p><p class="evidence">Found: ${esc(firstSentence(c.evidence))}</p></div>`).join('')}
  </div>
  <div class="two">
    <div><h3>What's already working</h3><ul class="plain">${st.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="meta">${full} of ${S.checks.length} checks earned full marks.</p></div>
    <div><h3>Quick wins for this week</h3>${quick.length ? `<ul class="plain quick">${quick.map((c) => `<li>${esc(fixText(c))}<span>+${c.lost} points · ${esc(c.label)}</span></li>`).join('')}</ul>` : '<p>No quick fixes left: the remaining gains need design or content work.</p>'}</div>
  </div>
</div></section>

<section><div class="wrap">
  <p class="kicker">What a redesign would do</p>
  <h2>From ${S.total} to as high as ${S.projected}</h2>
  <p class="lede">A new site fixes everything that is about how the site is built. The rest depends on the church keeping events, sermons and photos current, so it is not counted here.</p>
  <div class="projection">
    <div class="proj"><span>Today</span>${bar(S.total, S.max)}<b>${S.total}</b></div>
    <div class="proj after"><span>After a redesign</span>${bar(S.projected, S.max)}<b>${S.projected}</b></div>
  </div>
</div></section>

<section><div class="wrap">
  <p class="kicker">Your homepage today</p>
  <h2>What a visitor sees first</h2>
  <div class="shots">
    ${img('home-desktop.jpg') ? `<figure><img src="${img('home-desktop.jpg')}" alt="The current homepage on a computer, first screen" loading="lazy"><figcaption>On a computer, 1440px wide, before scrolling.</figcaption></figure>` : ''}
    ${img('home-mobile.jpg') ? `<figure><img src="${img('home-mobile.jpg')}" alt="The current homepage on a phone, first screen" loading="lazy"><figcaption>On a phone, before scrolling.</figcaption></figure>` : ''}
  </div>
</div></section>

<section><div class="wrap">
  <p class="kicker">The full scorecard</p>
  <h2>Every check, with what we found</h2>
  <p class="lede">Green earned full points, amber some, red none. Each score shows the evidence behind it.</p>
  ${S.categories.map((k) => `
  <div class="category">
    <div class="category-head"><h3>${esc(k.name)}</h3><span class="score">${k.score} / ${k.points}</span></div>
    <p class="why">${esc(k.why)}</p>
    <ol class="checks">${S.checks.filter((c) => c.cat === k.id).map(checkRow).join('')}</ol>
  </div>`).join('')}
</div></section>

<section id="method" class="method"><div class="wrap">
  <p class="kicker">How we scored</p>
  <h2>The same rubric for every church</h2>
  <p>Every church site is scored on the same ${S.checks.length} checks, worth ${S.max} points in ten categories. The rubric was built from a study of 179 church websites in October 2026, and it weights what decides whether a visitor comes on Sunday: times, place, phones and readability. Nothing is scored on taste.</p>
  <p><strong>Measured</strong> checks (${S.measuredMax} points) were taken by a script driving a real browser at computer (1440px) and phone (390px) widths: what is visible before scrolling, text sizes, contrast against WCAG AA, tap target sizes, links, titles and load time. Run the script again and you get the same numbers.</p>
  <p><strong>Reviewed</strong> checks (${S.max - S.measuredMax} points) need a person to read the pages: whether facts agree, whether events are current, what the photos show. Each one has fixed levels written in advance, and the report quotes the evidence for the level given.</p>
  <table><thead><tr><th>Score</th><th>Grade</th><th>What it means</th></tr></thead><tbody>${GRADES.map(([min, n, l]) => `<tr><td>${min}+</td><td>${esc(n)}</td><td>${esc(l)}</td></tr>`).join('')}</tbody></table>
  <details><summary>Every check and its rule</summary>
    <table><thead><tr><th>Check</th><th>Points</th><th>How</th><th>Rule</th></tr></thead><tbody>
    ${S.checks.map((c) => `<tr><td>${esc(c.label)}</td><td>${c.points}</td><td>${c.method}</td><td>${esc(c.rule)}</td></tr>`).join('')}
    </tbody></table>
  </details>
  <details><summary>Pages audited</summary><ul>${S.pages.map((p) => `<li>${esc(p.path)}: ${esc(p.title)}</li>`).join('')}</ul></details>
</div></section>

<section><div class="wrap">
  <div class="closing"><h2>Where we go from here</h2><p>${esc(st.closing)}</p></div>
</div></section>
</main>
<footer><div class="wrap">Measured ${date}${S.platform?.length ? ` · current platform: ${esc(S.platform.join(', '))}` : ''} · scored with church-web-kit's church website scorecard.</div></footer>
</body>
</html>`;
writeFileSync(join(dir, 'report.html'), html);

// Markdown for the brief and design skills.
const md = [
  `# Website audit: ${st.church}`, '',
  `${S.url} · measured ${date} · **${S.total} / ${S.max} (${S.grade})** · a redesign alone can reach ${S.projected} (${S.projectedGrade}).`, '',
  `**${st.headline}** ${st.opening}`, '',
  '## Top fixes', '', ...top.map((c, i) => `${i + 1}. **${c.label}** (+${c.lost}): ${fixText(c)} Found: ${c.evidence}`), '',
  '## Already working', '', ...st.strengths.map((s) => `- ${s}`), '',
  '## Quick wins', '', ...(quick.length ? quick.map((c) => `- ${fixText(c)} (+${c.lost}, ${c.id})`) : ['- none']), '',
  '## Scores by category', '', '| Category | Score |', '| --- | --- |', ...S.categories.map((k) => `| ${k.name} | ${k.score} / ${k.points} |`), '',
  '## Every check', '', '| Check | Method | Score | Evidence |', '| --- | --- | --- | --- |',
  ...S.checks.map((c) => `| ${c.label} (\`${c.id}\`) | ${c.method} | ${c.score ?? '–'} / ${c.points} | ${String(c.evidence).replace(/\|/g, '/')} |`), '',
  '## For the interview', '', 'Raise these with the church (the biggest point losses, in order):', '',
  ...S.gains.slice(0, 8).map((id) => `- ${byId[id].label}: ${byId[id].evidence}`), '',
];
writeFileSync(join(dir, 'church-audit.md'), md.join('\n'));
console.log(`wrote ${join(dir, 'report.html')} and ${join(dir, 'church-audit.md')}`);
