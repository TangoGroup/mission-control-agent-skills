# House rules for church sites

taste-skill's house rules were written for award-gallery landing pages. Most of them make church sites better, a few fight what churches need, and some vary by direction. This file says which is which and what `scripts/check.sh` passes to the inspector as `--allow`.

## Keep, on every direction

- **Headlines two lines or fewer** at every width (three only for a stacked display headline that the direction calls for, and never on phones past three).
- **No invented proof**: no fake testimonials, quotes, statistics, logos.
- **Real pictures**, credited; no placeholder boxes, no stock that pretends to be the church's own people or building.
- **Contrast** 4.5:1 for text, scrims under text on photos.
- **No horizontal scroll**, nothing covered or clipped.
- **Motion** that never hides content and respects reduced motion.
- **No emoji as icons**, no gradient blobs, no glassmorphism.
- **No purple-to-blue gradient hero**, no terracotta-on-cream "assistant" palette.
- **Two typefaces at most.**
- **One primary action per screen.**

## Relax, because churches need them

- **Service-time labels and small caps** (`eyebrow`, `micro-label`): church schedules, liturgical seasons and parish utility strips legitimately use small labels. Keep them readable (13px+ with letter-spacing, or sentence case).
- **Rows of cards** (`card-rows`) for ministries, events and staff are fine when each card holds different real content; vary one row per page.
- **Pill buttons and pill navigation** (`pill-nav`): common and friendly; pick one button shape per site.
- **A shadow on a floating panel** (`shadow`): the Mass times panel or a service-time card over a photo.
- **Thin rules** (`hairline`, `outlined-box`): schedules, tables and order of worship are tabular content.
- **Numbering** (`numbering`): a real sequence (first-Sunday steps, order of worship, next steps).
- **Few pictures / no footage / still page** (`few-pictures`, `no-footage`, `still-page`): small churches often have three good photos and no video; quiet directions move little.
- **Size count** (`size-count`): schedules and forms add sizes; keep display sizes disciplined.

## Per direction (extra allowances in check.sh)

| Direction | Also allowed | Why |
| --- | --- | --- |
| 01 Cinematic Worship | gradient (photo scrims), palette warnings | dark overlays on video are the genre |
| 02 Message-First Media | mixed-font-headline | italic serif accents in series titles |
| 03 Campaign Billboard | gradient (kente/stripe bands), mixed-font-headline, palette warnings | poster language |
| 04 Bright & Friendly Modern | (none extra) | |
| 05 Family-Forward Playful | mixed-font-headline | playful accent words |
| 06 Editorial Quiet | palette-cream, palette-terracotta (only if the accent is not terracotta), focal-point | paper grounds; a modest serif statement beside a modest photo |
| 07 Heritage Cathedral | palette-cream, mixed-font-headline | stone and parchment grounds, titling caps |
| 08 Catholic Parish Hub | palette-cream, mixed-font-headline, focal-point | parish print tradition; the Mass times panel, not a giant headline, is the focal point |
| 09 Dark Moody Brand | mixed-font-headline | italic serif accents |
| 10 Small-Town Welcome | palette-cream, focal-point | warm traditional grounds; a split hero with the building photo at its real size |

`focal-point` is taste-skill's rule that the first screen needs a very large headline (4.5vw+) or a photo covering 30% of it. The split heroes of 06, 08 and 10 put a readable headline beside a times box and a photo shown at its true size, which is right for those churches, so the rule is relaxed for them. Every other direction should pass it.

## Church checks (church-check.mjs)

Fail:
- Homepage service times not visible in the first screen at 1440 or 390.
- No newcomer link (Plan a Visit, I'm New, New Here, Visit, First Time, What to Expect) in the header on the homepage.
- No Give link on any page header or footer.
- No phone number or street address in the footer.
- Placeholder text: lorem, `[` … `]` brackets, "TBD", "XXX", "your church".
- Body text under 16px (under 18px for directions 08 and 10).
- An image without alt text, or a broken image.
- A photo shown more than 1.3× its real pixel size (warn above 1.15×). Common with small church photos: show them in a smaller frame instead of stretching them.

The first-screen time must belong to a service: its block mentions worship, a service, Mass, Sunday, Sunday school or similar. Office hours and times in the header don't count.

Warn:
- More than seven page links in the main navigation (Give, the newcomer button, the wordmark, phone and language toggle don't count).
- A page with no `<h1>` or more than one.
- Times written inconsistently (9:30am vs 9:30 a.m.).
