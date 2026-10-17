---
name: church-site-audit
description: Audits a church's current website with a fixed 100-point scorecard (first visit, accurate information, phones, readability, navigation, photos, brand, watch and give, next steps, search), measured in a real browser at computer and phone widths plus a written rubric for what a person must judge, and writes a pastor-friendly report that leads with the score, the three changes worth the most points and quick wins, then the full evidence. Use this whenever someone asks to audit, review, grade, score or critique a church, parish or ministry website, asks "what's wrong with our church site" or "how good is our website", wants a report to show church leaders, or starts a church redesign with church-site-brief (which runs this first).
---

# Church site audit

A pastor deciding whether to redesign the church website needs two things: a short answer they can act on, and proof it is not just one designer's taste. This skill gives both. Every point comes from a fixed rubric, most of it measured by a script in a real browser, and the report leads with what to do rather than with everything that is wrong.

The audit is also the first conversation in a redesign. Write it like a designer who wants this church as a client: respectful of what the church has built, honest with numbers, specific about what would change for a visitor, and confident about the way forward.

Outputs, in `audit/` in the project root:

- `report.html`: the report for the church (one file, screenshots embedded, prints cleanly).
- `church-audit.md`: the same findings for `church-site-brief` and `church-site-design`.
- `measure.json`, `review.json`, `scores.json`, `story.json`, `shots/`, `text/`: the working files behind the numbers.

## The run

Scripts are in this skill's `scripts/` folder. They need Node 22+, Chrome, and taste-skill installed (its Chrome driver is reused; pass `--taste DIR` if it is not found).

### 1. Measure

```bash
node <this skill>/scripts/measure.mjs https://church.example --out audit
```

It opens the homepage, follows the main menu (newcomer, kids, watch, give and events pages first, 15 pages at most; add `--pages url,url` for ones the menu misses), measures each page at 1440px and 390px, checks every link, and saves screenshots to `audit/shots/` and each page's text to `audit/text/`. It takes one to three minutes.

If the homepage fails to load, stop and tell the user. If a page errors, the rest still score; mention it.

### 2. Review

```bash
node <this skill>/scripts/score.mjs audit --template
```

This writes `audit/review.json` with the 15 reviewed checks, each with its rule and allowed scores. Fill in each one from the screenshots (`shots/*-full.jpg`) and page text (`text/*.txt`), following `references/reviewing.md`. Also read what the brief skill would read: the embedded calendar, the latest bulletin or newsletter PDF (listed in `measure.json` as `pdfs`), and the sermon page, because conflicts and stale dates hide there.

- **Score only the allowed levels.** Evidence quotes what you saw, with the page: `"/events lists 'VBS June 9–13, 2025' as upcoming (audit date 2026-10-16)"`.
- **Check the script.** Look at the homepage screenshots and compare them with the measured evidence (`score.mjs audit --draft` prints it). If a measurement is plainly wrong (a times bar the script missed, a cookie banner covering the first screen), add an entry under `overrides` with the corrected score, evidence and a `reason`. The report shows both numbers, so use overrides only for real measurement errors, never to soften a score.

### 3. Score

```bash
node <this skill>/scripts/score.mjs audit
```

It refuses to finish until every reviewed check has an allowed score and evidence. It prints the total, the category bars and the biggest gains, and writes `scores.json`. Print the full rubric any time with `score.mjs --rubric`.

### 4. Write the story

Write `audit/story.json`: the headline, opening, strengths, closing and any per-check notes, in the voice described in `references/writing.md`. The numbers come from `scores.json`; the story explains what they mean for a visitor. Optional `topFixes` (three check ids) chooses the lead fixes when two of the biggest gains are really one change (body text on computer and on phone, say); otherwise the three biggest gains lead.

```bash
node <this skill>/scripts/report.mjs audit
```

### 5. Look, then hand off

Open `audit/report.html` in the browser and read the first screen as the pastor would: score, three fixes, what's working. Check it at phone width too. Fix anything that reads as harsh, vague or wrong, re-run `report.mjs`, and then:

- Give the user the short version in chat: the score and grade, the three top fixes with their points, and the projected score after a redesign. Link the report.
- Offer to share `report.html` so they can pass it to church leaders: attach it or save it where they can open it. It is one file that opens in any browser. Do not post it anywhere public without asking; it names a real church.
- If this is the start of a redesign, continue with `church-site-brief`. It reads `audit/church-audit.md` and opens the interview from these findings.

## Rules

- **Scores, not opinions.** Every sentence that criticises cites a check and its evidence. If something bothers you that no check covers, it does not lower the score; mention it in a note as an observation.
- **Never invent.** No guessed visitor numbers, no "most visitors leave in 3 seconds" claims beyond the benchmark lines in `checks.mjs`, no imagined problems.
- **Respect the people.** Volunteers built most church sites. Criticise the site, never the people who made it.
- **Same rubric every time.** Do not add, remove or reweight checks for one church. Changes to the rubric go in `scripts/checks.mjs` and the CHANGELOG, so scores stay comparable across churches and over time.

## Files

| File | Read it when |
| --- | --- |
| `scripts/checks.mjs` | You need the exact rule, points, effort or benchmark for a check. |
| `references/reviewing.md` | Scoring the reviewed checks. |
| `references/writing.md` | Writing story.json and the chat summary. |
| `scripts/measure.mjs`, `score.mjs`, `report.mjs` | Running the audit. |
