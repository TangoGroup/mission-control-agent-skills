---
name: church-site-brief
description: Start every church website job here. Runs church-site-audit on the church's current site, reads its facts (pages, service times, staff, ministries, photos, calendars), then interviews the user the way a designer interviews a new client (the church and its people, goals, the current site, a features wish list, then pictures of recommended themes to pick from with a follow-up or two), and writes church-brief.md for church-site-design to build from. Use this whenever someone wants to build, design, redesign, refresh, mock up or plan a website for a church, parish, cathedral, congregation, chapel, ministry or church plant, even if they only paste a church URL or say "make our church site better" — and run it before church-site-design or design-taste-frontend on any church project.
---

# Church site brief

A church website is judged by two very different visitors: the newcomer deciding whether to walk in on Sunday, and the member checking what time Wednesday supper starts. A design that is beautiful but built on guesses about either of them fails. This skill gathers the facts and decisions first, with the person who knows the church, so the build starts from what is true and wanted.

The output is one file, `church-brief.md`, in the project root. `church-site-design` and `church-photo-direction` read it.

## The run

### 0. Audit the current site

If the church has a website and `audit/church-audit.md` does not exist yet, run the `church-site-audit` skill first. It measures the site, scores it and writes the report the interview opens from. Give the user the score and top three fixes in a few lines and link the report before the interview starts. Skip it only when the church has no site or the user asks you to.

### 1. Read what already exists

The audit saved each audited page's text in `audit/text/`, screenshots in `audit/shots/`, and the PDFs and embedded frames it found in `audit/measure.json`. Start there and open pages only for what it missed. People answer better when you show them what you found.

- Collect the facts: name, denomination or tradition, address, phone, email, office hours, every service and its time, Sunday school and midweek times, staff and elders with roles, ministries and groups with ages and times, events with dates, giving method and provider link, livestream and social links, app, beliefs or statement of faith, history (founding year), languages. Open pages one level down from About, Ministries and Visit if the audit did not reach them; a page that needs scripts to render needs the browser.
- **Events and calendars often live outside the page.** Look for embedded calendars (iframes from Google Calendar, Church Center / Planning Center, Elvanto, Breeze, Tithe.ly Events) and read them at their source: for Google Calendar take the `src=` calendar ID from the iframe and fetch `https://calendar.google.com/calendar/ical/<id>/public/basic.ics`; for Church Center open the church's `*.churchcenter.com/calendar` page. Also check the latest bulletin or newsletter PDF. These are usually the most current facts on the site.
- **When the site contradicts itself** (choir at 5:15 on one page, 6:30 on another), prefer the most recently dated source: calendar feed, then dated bulletin or newsletter, then announcements, then static pages. Record the value you used and ask about every conflict in the interview.
- Inventory the pictures: download every photo the church owns (staff, building, people, events) into `brief-assets/current-site/` with the page it came from. Leave out logos, stock graphics and flyers unless they carry information. Measure sizes after rotation, since phone photos often carry an EXIF rotation that tools like `sips` ignore: `magick <file> -auto-orient -format '%f %wx%h\n' info:`. Judge them all at once on a contact sheet rather than one by one: `magick montage brief-assets/current-site/*.jpg -auto-orient -geometry 320x220+4+4 -tile 5x brief-assets/contact-sheet.jpg` (if montage lacks fonts, add `-label ''`), then look at the sheet. Note whether each is usable (sharp, recent, real people).
- If the existing site is a platform (Tithe.ly, Clover, Squarespace, Wix, WordPress, Subsplash, Nucleus, eCatholic), note it: it tells you what the church can maintain and which giving, app, calendar and form tools they already pay for.

If there is no website, gather the same facts from whatever the user gives you (a bulletin, a Facebook page, a description).

### 2. Interview

Interview like a designer meeting a new client, in four rounds: the church and its people; the site you have now (opening from the audit); a features wish list; then the look, chosen from pictures of the recommended themes with a follow-up or two. Follow `references/interview.md` for the questions, the theme gallery and the phrasing. Expect 12–16 questions; skip any the audit or site already answers, and confirm facts instead of asking for them.

By the end you must know: who the site is for and what a win looks like; who will update it; the pages; the wanted features; branding (logo, colours, tagline to keep); the themes they liked, favourite first, and the answers that tune them; and photos.

Do not ask about scope. Every build starts with three homepage options; more pages come only after the homepage is approved.

The user is often a pastor, staff member or volunteer, not a designer: use plain words, no design jargon, and keep it warm.

### 3. Write the brief

Fill `assets/brief-template.md` and save it as `church-brief.md` in the project root. Rules:

- Every fact carries its source: `(site: /about)`, `(user)`, or `(assumed, confirm)`. Anything assumed is listed again under "To confirm" so it is checked before launch.
- Never invent proof or doctrine: no testimonies, attendance numbers, quotes from the pastor, or beliefs the church did not state. Sample details for design density (event descriptions, group blurbs) are fine in the build but are marked as samples.
- Record the church in their own words, the audience, the goals and who updates the site under "Client".
- Record every theme the user liked by its file name (for example `directions/10-small-town-welcome.md`), favourite first, with the follow-up answers ("big church photo first", "keep red as an accent").
- Record each wanted feature with how it would work: built into the static site, or through a service the church already pays for (or would add).
- Copy the audit score and top fixes under "Audit". The design must answer each top fix, or the brief lists it as the church's to do.
- Record the page list in build order, with the sections each page needs.
- Record the photo inventory with a verdict per photo (hero-worthy, usable small, unusable) so the photo skill can start from it.

### 4. Confirm and hand off

Show the user a short summary of the brief (who it's for, the themes they picked, the features, what you need from them) and say what happens next: "I'm making three homepage options for you to compare now. Nothing else gets built until you've picked one and we've got it right." Then continue straight into `church-site-design` without waiting for a yes: drafts are cheap, and anything wrong in the summary can be corrected while they look at the options.

## Files

| File | Read it when |
| --- | --- |
| `references/interview.md` | Running the interview: rounds, questions, the theme gallery. |
| `references/page-catalog.md` | Comparing the church's pages with what churches commonly need. |
| `references/direction-fit.md` | Recommending design directions. |
| `scripts/theme-gallery.mjs` | Building the theme pictures for round 4. |
| `assets/brief-template.md` | Writing `church-brief.md`. |
