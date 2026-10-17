---
name: church-site-design
description: Builds church websites from a church-brief.md using ten church design directions researched from 179 real church sites (from Cinematic Worship and Message-First Media to Heritage Cathedral, Catholic Parish Hub and Small-Town Welcome), a church section library (service times, plan a visit, kids check-in, Mass times, sermons, events, giving, prayer requests) and taste-skill's real-browser inspector. Starts with three quick homepage options, then one revised homepage per round of feedback until the client approves, then builds the approved design into 2–3 key pages or the whole site, checked in a real browser, as static files that deploy to Vercel. Use this whenever you build, design, redesign, restyle or mock up a website or page for a church, parish, cathedral, congregation, ministry or church plant, and whenever a church-brief.md exists in the project.
---

# Church site design

General design skills are tuned on award-gallery sites: studios, products, hotels. None of the sites they studied was a church, and their rules push toward one striking landing page. A church site is a small set of practical pages for two audiences at once, the newcomer deciding whether to come on Sunday and the member checking a time, and it has to feel like a specific congregation, not a brand exercise. This skill keeps what transfers from taste-skill (real content, no ornament for its own sake, measured checks in a real browser, honest pictures) and replaces the directions with ten that come from church sites.

## Before you start

1. **The brief.** Read `church-brief.md` in the project root. If it does not exist, run the `church-site-brief` skill first: designing a church site from guesses produced the weakest results in testing, and the user expects to be asked.
2. **taste-skill.** Find it with `bash <this skill>/scripts/find-taste.sh` (prints the `design-taste-frontend` folder, or an install hint). You need its `scripts/inspect.mjs`, `scripts/lint.mjs`, `scripts/assets.mjs` and its `references/copy.md` and `references/motion.md`. If it is missing, tell the user and continue; skip the inspector and check with screenshots instead, and say so in the report.
3. **The directions.** Read the direction files of the themes the client liked (brief, "Themes liked"), then skim their reference homepages in `examples/` for structure and component ideas. Take the principles, not the copy: the examples belong to fictional churches.

## Two stages

1. **Homepage options (fast).** Three homepage drafts, then one new version per round of feedback, until the client says "this is it". No checks, no critique rounds: the point is speed, so the client reacts to real designs within minutes. Follow `references/homepage-loop.md` exactly.
2. **Build the site.** Only after the homepage is approved, and only the pages the client chose (2–3 key pages or the whole site). This stage turns the approved draft into the real site and runs the full checks before anything is presented as finished. It is the run below.

If `drafts/` already holds an approved homepage (the brief names it), go straight to stage 2. If the user asks for the whole site up front, still start with stage 1: say that the homepage comes first so the look is settled before every page is built.

**Which rule wins.** The user's words, then the brief, then the direction file, then this skill's references, then taste-skill's references. Where a direction asks for something taste-skill's copy or house rules discourage (a "Welcome to First Baptist" headline, a "Since 1887" line, almost no motion, small schedule labels), follow the direction: it comes from what works on church sites. taste-skill's rules apply everywhere the direction is silent.

## Build the site

Work from the approved draft: its layout, type, colours and components are the design. Your job is to make it real: the shared structure, every chosen page, real photos, and the checks.

### 1. Plan the site

From the brief, write a short plan in your notes: the pages and their sections in order (use `references/sections.md` for what each church section must hold), the one thing each page must get a visitor to do, and the shared header and footer. Every page gets the same header, footer, tokens and type; only the sections change.

### 2. Write the words

Write each page as plain text before markup, following taste-skill's `references/copy.md` (two-line headline arithmetic, one primary action per screen, specific nouns and real numbers) with these church rules:

- **Service times and address are in the first screen of the homepage**, in text, at body size or larger. They are the most-sought fact on any church site.
- **Write to the newcomer** without talking down to members: what happens, where to go, how long, what about my kids. Plain, warm, specific.
- **Use the church's own words** for its tagline, mission and beliefs, verbatim from the brief. Never write doctrine, a statement of faith or a creed for a church.
- **Never invent proof:** no testimonies, quotes from the pastor or members, attendance or baptism numbers, reviews.
- **The pastor's note.** Use the pastor's own words when the brief has them (a newsletter column, an About page letter). Without them, replace the note with a factual "Meet our pastor" block (photo, name, role, since when, how to reach them), or write a short draft, label it "Draft for Pastor X to approve" in the brief's To confirm list, and say so in the report.
- **Sample details are allowed** where the brief has gaps (a group's description, an event blurb) so the design can be judged at full density. Keep a list of every sample detail for the report.
- **Plain language.** Many members read on phones, some with poor eyesight, and some are new to church vocabulary: explain terms like "Eucharist" or "Sunday school" once where a newcomer meets them.

### 3. Photos

Run the `church-photo-direction` skill (or follow it) to fill every picture slot: the church's own photos first, then suitable stock of people, credited. Hotlinked stock in the drafts is replaced here with downloaded, resized, credited files. Do not start the build with placeholder boxes; the look depends on real pictures.

### 4. Build

Follow `references/site-structure.md` for the folder layout, shared CSS/JS, clean URLs and Vercel config. Order of work:

1. **Tokens** in `assets/css/site.css`: colour roles, two typefaces at most, a five-step type scale, spacing, radius, motion. Take them from the approved draft (its fonts, colours and spacing), filling gaps from the direction file.
2. **Header and footer** once, then copy into every page.
3. **The homepage** as approved: port the draft into the shared structure without redesigning it. Then any changes the checks require. When the client cut sections from the draft, keep their component styles (cards, tiles, lists) in `site.css` if the other pages can reuse them. A homepage the client wants without a footer is fine: keep the phone and address visible elsewhere in the first screen.
4. **The other pages**, reusing the section library.
5. **Shared behaviour** in `assets/js/site.js`: mobile menu, the live "next service" line, forms (see below), accessibility helpers.

Church rules for the build:

- **Readable for everyone:** body text 17px or larger (18–19px for Small-Town Welcome and Catholic Parish Hub), contrast 4.5:1, tap targets 44px, visible focus, real headings, alt text describing what is in the photo.
- **Forms without a backend** (plan a visit, prayer request, kids pre-registration) handle `submit` in script and open a pre-filled email to the church office for now. Note in the README that Vercel deployment can swap this for a form service later. Never build a payment form; giving always links to the church's provider.
- **Links to what exists:** pages not rebuilt (sermon archive, events calendar) link to the church's current site URLs from the brief.
- **Motion** follows taste-skill's `references/motion.md`, at the direction's level: content is visible without JavaScript, everything respects `prefers-reduced-motion`.
- **No external dependencies** beyond Google Fonts: the site must open from the file system and deploy as plain files.

### 5. Check

Run the church check over the whole site:

```bash
bash <this skill>/scripts/check.sh site --direction NN
```

It runs taste-skill's linter over the source, and for every page runs taste-skill's inspector (1440, 768 and 390px) with the rules this direction legitimately relaxes allowed, plus church checks (service times visible in the first screen, newcomer and Give links in the header, phone and address in the footer, body size, no placeholder text). Fix every FAIL. For each WARN, either fix it or be able to say in one sentence why the direction needs it. `references/house-rules.md` explains which taste-skill rules carry over and which each direction relaxes.

### 6. Look

Open the screenshots the inspector saved (every page, desktop and phone, and the tablet ones: photos stretch most at 768px) and critique them against `references/critique.md`. Fix the top three problems, re-run the check, look again. Three rounds at most. The site is done when the check has no FAIL and every critique score is 7 or more; if three rounds don't get there, say which scores fall short in the report.

### 7. Report

Write the report to `REPORT.md` beside `site/` when you can, and give the user the short version in your reply: the direction and why; the pages built; how to preview (open `site/index.html`) and deploy (see `site/README.md`); every sample detail and assumption to confirm (copy them from the brief's "To confirm" list plus your sample details); the photo credits and which photos are stock to be replaced; any check you could not run.

## Files

| File | Read it when |
| --- | --- |
| `references/homepage-loop.md` | Stage 1: the three options, feedback rounds, approval. |
| `directions/NN-*.md` | Before drafting: each liked direction's DNA, blueprint, type, colour, photos, pitfalls. |
| `examples/NN-*.html` | For structure and component ideas from a full reference homepage. |
| `references/sections.md` | Planning and building any church section. |
| `references/site-structure.md` | Setting up `site/`, shared files, clean URLs, Vercel. |
| `references/house-rules.md` | Deciding which taste-skill rules apply, and what the inspector allows per direction. |
| `references/critique.md` | Looking at the screenshots. |
| `scripts/compare.mjs` | Showing a round of drafts side by side. |
| `scripts/render-previews.mjs`, `previews/` | Maintainers: re-photographing the reference homepages for the theme gallery. |
| `scripts/find-taste.sh` | Locating taste-skill. |
| `scripts/check.sh`, `scripts/church-check.mjs` | Checking the built site. |
