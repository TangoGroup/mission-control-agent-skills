#!/usr/bin/env node
// Score a church website from measure.json (measured checks) and review.json (reviewed checks).
//
//   node score.mjs audit              score; writes audit/scores.json and prints the scorecard
//   node score.mjs audit --template   writes audit/review.json with every reviewed check to fill in
//   node score.mjs --rubric           prints the full rubric as markdown
//
// review.json: { "checks": { "<id>": { "score": n, "evidence": "quoted facts" } },
//                "overrides": { "<measured id>": { "score": n, "evidence": "...", "reason": "why the script was wrong" } } }
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, CHECKS, GRADES, grade, checkTotals } from './checks.mjs';

const max = checkTotals();
const args = process.argv.slice(2);

if (args.includes('--rubric')) {
  console.log(`# Church website scorecard (${max} points)\n`);
  console.log('Measured checks are scored by measure.mjs in a real browser at 1440px and 390px. Reviewed checks are scored by the auditor against the written levels, with the evidence quoted.\n');
  for (const k of CATEGORIES) {
    console.log(`## ${k.name} (${k.points})\n\n${k.why}\n\n| Check | Points | How | Rule |\n| --- | --- | --- | --- |`);
    for (const c of CHECKS.filter((c) => c.cat === k.id)) console.log(`| \`${c.id}\` ${c.label} | ${c.points} | ${c.method} | ${c.rule}${c.levels ? ` Allowed: ${c.levels.join(', ')}.` : ''} |`);
    console.log('');
  }
  console.log('## Grades\n\n' + GRADES.map(([min, name, line]) => `- ${min}+ **${name}**: ${line}`).join('\n'));
  process.exit(0);
}

const dir = args.find((a) => !a.startsWith('--')) || 'audit';
const reviewPath = join(dir, 'review.json');
if (args.includes('--template')) {
  if (existsSync(reviewPath)) { console.error(`${reviewPath} exists; not overwriting.`); process.exit(1); }
  const t = { checks: {}, overrides: {} };
  for (const c of CHECKS.filter((c) => c.method === 'reviewed')) t.checks[c.id] = { score: null, evidence: '', _rule: c.rule, _allowed: c.levels };
  writeFileSync(reviewPath, JSON.stringify(t, null, 2));
  console.log(`wrote ${reviewPath}: fill in score and evidence for ${Object.keys(t.checks).length} reviewed checks.`);
  process.exit(0);
}

const m = JSON.parse(readFileSync(join(dir, 'measure.json'), 'utf8'));
const review = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, 'utf8')) : { checks: {}, overrides: {} };
const problems = [];
const rows = CHECKS.map((c) => {
  let score = null, evidence = '', overridden = null;
  if (c.method === 'measured') {
    try { [score, evidence] = c.score(m); } catch (e) { score = null; evidence = 'Could not measure: ' + e.message; problems.push(`${c.id}: ${e.message}`); }
    const o = review.overrides?.[c.id];
    if (o && o.score != null) {
      if (!o.reason) problems.push(`override ${c.id} needs a reason`);
      if (o.score < 0 || o.score > c.points) problems.push(`override ${c.id}: ${o.score} is outside 0–${c.points}`);
      overridden = { measured: score, measuredEvidence: evidence, reason: o.reason || '' };
      score = o.score; evidence = o.evidence || evidence;
    }
  } else {
    const r = review.checks?.[c.id];
    if (!r || r.score == null) problems.push(`${c.id}: not reviewed yet`);
    else if (!c.levels.includes(r.score)) problems.push(`${c.id}: ${r.score} is not an allowed score (${c.levels.join(', ')})`);
    else if (!r.evidence || r.evidence.length < 12) problems.push(`${c.id}: evidence is missing (quote what you found)`);
    else { score = r.score; evidence = r.evidence; }
  }
  const { score: _fn, ...meta } = c;
  return { ...meta, score, evidence, overridden, lost: score == null ? null : Math.round((c.points - score) * 10) / 10 };
});

if (problems.length) {
  console.log('Not scored yet:\n' + problems.map((p) => '  - ' + p).join('\n'));
  if (!args.includes('--draft')) { console.log('\nFix these (or run with --draft to see the measured part only).'); process.exit(1); }
}

const sum = (a) => Math.round(a.reduce((s, r) => s + (r.score || 0), 0) * 10) / 10;
const cats = CATEGORIES.map((k) => { const rs = rows.filter((r) => r.cat === k.id); return { ...k, score: sum(rs), checks: rs.length }; });
const total = sum(rows);
const projected = Math.round(rows.reduce((s, r) => s + (r.redesign ? r.points : r.score || 0), 0) * 10) / 10;
const effortRank = { quick: 0, design: 1, content: 2 };
const gains = rows.filter((r) => r.lost > 0).sort((a, b) => b.lost - a.lost || effortRank[a.effort] - effortRank[b.effort]).map((r) => r.id);
const [, gname, gline] = grade(total);
const home = m.pages[0];
const scores = {
  url: m.start, measured: m.when, scored: new Date().toISOString(), max, total, grade: gname, gradeLine: gline,
  measuredPoints: sum(rows.filter((r) => r.method === 'measured')), reviewedPoints: sum(rows.filter((r) => r.method === 'reviewed')),
  measuredMax: CHECKS.filter((c) => c.method === 'measured').reduce((s, c) => s + c.points, 0),
  projected, projectedGrade: grade(projected)[1],
  categories: cats, checks: rows, gains,
  pages: m.pages.filter((p) => p.ok).map((p) => ({ path: p.path, title: p.meta?.title, slug: p.slug })),
  platform: home.platform, linksChecked: m.links.checked,
  draft: problems.length > 0,
};
writeFileSync(join(dir, 'scores.json'), JSON.stringify(scores, null, 1));

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${total} / ${max}  ${gname}${scores.draft ? '  (DRAFT: reviewed checks missing)' : ''}\n`);
for (const k of cats) console.log(`${pad(k.name, 34)} ${pad(k.score + ' / ' + k.points, 9)} ${'█'.repeat(Math.round(10 * k.score / k.points))}${'░'.repeat(10 - Math.round(10 * k.score / k.points))}`);
console.log('\nBiggest gains:');
for (const id of gains.slice(0, 8)) { const r = rows.find((x) => x.id === id); console.log(`  +${r.lost}  ${r.label} (${r.method}, ${r.effort})  ${r.evidence.slice(0, 110)}`); }
console.log(`\nA redesign alone would reach about ${projected} (${scores.projectedGrade}); the rest needs the church (photos, events, sermon uploads).`);
console.log(`wrote ${join(dir, 'scores.json')}`);
