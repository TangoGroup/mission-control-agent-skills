# Scoring the reviewed checks

Fifteen checks need a person: they depend on meaning, not pixels. Each has fixed levels (in `scripts/checks.mjs` and in `review.json` as `_allowed`). Pick the level the evidence supports, and quote the evidence. When you are torn between two levels, choose the lower one and say what would earn the higher one.

Use the audit date (in `measure.json` as `when`) for anything about freshness. Read the page text in `audit/text/`, the full-page screenshots in `audit/shots/`, the PDFs listed in `measure.json`, and any embedded calendar (see `church-site-brief` step 1 for how to read Google Calendar and Church Center feeds).

## First visit

**visit-page (0–4).** Find the newcomer page (Plan a Visit, I'm New, What to Expect, Visit). One point for each question it answers in plain words: what happens and how long; what about my kids; where to park and which door; what to wear. A link to a video does not answer a question by itself. If the "I'm New" link goes to a generic contact form or the About page, score what that page actually answers.

## Accurate, current information

**no-conflicts (0, 2, 4).** Compare times, places, staff names, phone and email across the pages, the bulletin or newsletter, and the calendar. A conflict is the same fact with two values ("Sunday School 9:15" on the homepage, "9:30" in the bulletin). List each one in the evidence with both sources. Two pages that both lack a fact are not a conflict.

**events-current (0, 1, 3).** Anything shown as upcoming, open or "going on now" that is dated before the audit date, or a registration form for a past season. Count items, quote dates. Archived lists clearly labelled as past are fine.

**media-fresh (0, 1, 2).** The newest sermon, service recording or livestream replay reachable from the site. Use its date, not the page's copyright year. A link to a YouTube or Facebook channel counts only if the newest video there is within range; say which.

## Photos

**people-photos (0, 1, 3).** Recognisable photos of this congregation on the homepage (a Sunday crowd, kids, a supper, a baptism). Event flyers with people in them, stock photos and building shots score 1.

**hero-photo (0, 1, 3).** The picture in the first screen. 3 needs a real photo or video of this church that is sharp and well cropped at both widths. A rotating slideshow of announcements, a flyer, a stock photo or an image too small for the space scores 1. No image, or text only, scores 0.

**recent-photos (0, 1, 2).** Judge from what is in the photos (people's clothes, recognisable events, seasons, file dates in URLs like `/2021/11/`). Say what you used.

## Brand

**logo (0, 1, 2).** Is it crisp at its displayed size (check `images.list` in `measure.json`: a 530px-wide raster shown at 300px is fine, a 150px raster shown at 300px is blurry)? Is it the same version everywhere, including footer and favicon?

**colours (0, 1, 2).** Name the colours you see and where (sample hex values from the screenshots if needed). A platform's default theme colours with no tie to the logo score 1 at most.

**voice (0, 1, 2).** Quote the tagline and the first sentence or two of homepage copy. Apply the swap test: could another church in the same town say exactly this? "A place where everyone is welcome" is sincere but generic (1 if used consistently). Specific to place, people or practice scores 2.

## Watch and give

**give-path (0, 1, 2).** Count clicks from the homepage to the actual giving form (not a page about giving). Note the provider (Tithe.ly, Pushpay, Planning Center, Realm). Other ways to give (mail address, text-to-give, app, envelopes) must be stated somewhere on the give page.

**sermon-archive (0, 1, 2).** Is there a list of past sermons with titles and dates, and can a visitor browse a series? A bare YouTube channel link scores 1.

## Next steps

**kids-info (0–3).** One point each for: age groups named; when and where each group meets; check-in and safety (background checks, secure check-in, who to ask). Use the kids or youth page, or the homepage if there is no page.

**connect-form (0, 1, 2).** A short form (name, email, a question or two) for visitors or prayer requests, reachable from the homepage, that loads. Long membership forms or a form two pages deep score 1. Do not submit the form.

**groups (0, 1, 2).** Small groups, classes or serving teams listed with day and time, plus how to join (a sign-up link, a contact). A list of ministry names alone scores 1.

## Overrides of measured checks

The script is right most of the time and wrong in known ways:

- A times line rendered as an image, or inside a slideshow slide that was not showing at capture time.
- A cookie or app banner covering the first screen (look at `shots/home-mobile.jpg`).
- A menu that opens on hover only (desktop), or a phone menu that the script could not click.
- Contrast on text over a coloured shape that is drawn by an image file.

Override only when the screenshot shows the script measured something that a visitor would not experience. Write the reason so the report can show it.
