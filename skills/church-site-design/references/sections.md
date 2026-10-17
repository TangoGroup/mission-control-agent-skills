# Church section library

The building blocks every church site draws from. Each entry says what the section must hold, what it is for, and how the directions vary it. Compose pages from these; a direction file says which ones the homepage leads with and in what form.

## Contents

1. Header
2. Service times
3. Newcomer path (Plan a Visit)
4. Live and next-service line
5. Ages and ministries
6. Kids check-in and safety
7. Sermons and watch
8. Events
9. Groups and next steps
10. Leadership
11. Giving
12. Prayer request
13. Mass and worship schedule
14. Sacraments
15. History
16. Location and contact
17. Footer
18. Language toggle

## 1. Header

Holds: the church's name or wordmark (linking home), four to seven page links, one newcomer action (Plan a Visit / I'm New / New Here), Give. The check counts page links only: the wordmark, phone, Give, the newcomer button and a language toggle don't count toward the seven. On phones: name, newcomer action or Give, and a menu button that opens the full list. Sticky is fine; keep it short (64–80px).

Varies: a solid coloured bar for Small-Town Welcome and Catholic Parish Hub; transparent over the hero for Cinematic Worship and Dark Moody Brand; a top utility strip (Mass times, bulletin, language) for Catholic Parish Hub and Heritage Cathedral.

Avoid: more than seven page links; mega-menus on small sites; Give and the newcomer action both styled as primary buttons (pick one; usually the newcomer action on the homepage, Give elsewhere).

## 2. Service times

Holds: every weekly service with day, time, name or style, place (campus or building), language if not English, livestream note. Sunday school and midweek where they matter.

Must be in the first screen of the homepage, in text. Repeat in the footer and on Plan a Visit. Use tabular figures and write times the way the church does (9:30 a.m.).

Varies: a band of time cards (Small-Town, Family-Forward), a single line under the headline (Dark Moody), a schedule table set like a book (Editorial Quiet), a dense grid with Confession and Adoration (Catholic Parish Hub), a "today at the cathedral" strip (Heritage Cathedral), a countdown (Cinematic Worship).

## 3. Newcomer path (Plan a Visit)

Holds: arriving (parking, which door), what happens (length, music, communion practice in plain words), kids, what to wear, accessibility, after the service, and an action: "Let us know you're coming" (form or email) with a promise about follow-up ("we'll look out for you; no follow-up you didn't ask for").

On the homepage: three to five short steps with an action. On its own page: the full set plus FAQ (details/summary accordion) and a map link.

## 4. Live and next-service line

Holds: the next service and when it starts, computed in the church's time zone, with "Watch live" during a service. Fallback text without JavaScript: the Sunday times.

Use it in the hero for Cinematic Worship (countdown), a top bar for Message-First Media, the Mass times panel for Catholic Parish Hub ("Next Mass"), the hero photo caption for Small-Town Welcome. Script pattern: `Intl.DateTimeFormat` with the church's IANA zone (America/Chicago), a weekly schedule array in minutes after midnight, find current or next.

## 5. Ages and ministries

Holds: one entry per age or life stage that the church actually serves (kids, students, young adults, adults, seniors, women, men, Spanish), each with who, when, where, and a link. Use the church's own ministry names.

Varies: photo tiles of uneven sizes (Bright & Friendly, Cinematic), colour-field cards (Campaign Billboard, Family-Forward), a plain list with times (Small-Town, Editorial Quiet). Avoid a row of identical icon-topped cards: it is the most generic church-site pattern.

## 6. Kids check-in and safety

Holds: age groups with rooms and times, how check-in works (where, what parents get, pickup), safety commitments the church actually has (background checks, two-adult rule, allergy notes: only what the brief confirms), what kids do, pre-registration.

Parents are the reader. Keep it calm, specific and short. Family-Forward Playful leads with it; most others link to the Kids page.

## 7. Sermons and watch

Holds: the latest message (title, speaker, date, scripture, series, length, watch link), the series it belongs to, the livestream schedule and platform, podcast links, archive link.

Varies: the hero itself (Message-First Media); a strip under the hero (Cinematic Worship); a modest card (Bright & Friendly, Small-Town); a clean list of titles and texts (Editorial Quiet); a homily link (Catholic Parish Hub). Never embed third-party players in the static site; link to the video with a thumbnail and play button styling.

## 8. Events

Holds: the next three to six dated events with date block, title, time, place, one-line description, link or sign-up; a link to the full calendar.

Dates as a date block (month + day) or a line ("Sat Oct 24, 8–11 a.m."). Leave out events already past when you build or update the site. Because a static site keeps running after you leave, also give each event `data-date="2026-10-24"` and let `site.js` hide events whose date has passed, falling back to the next recurring items or a "See the full calendar" link. Campaign Billboard turns the lead event into the hero poster.

## 9. Groups and next steps

Holds: the church's actual path (newcomer class, baptism, membership, groups, serving, giving), each with what it is, when, and how to start. Use an ordered list only when the order is real.

## 10. Leadership

Holds: photo, name, role, one or two lines, contact. Staff and elders or vestry separately. Photos at a consistent crop; never stretch a 240px photo to 600px (use it small or circular).

## 11. Giving

Holds: online giving link (the church's provider, exact URL), app, text-to-give if any, by mail address, envelopes and year-end statements, current campaign with progress only if the church gives real figures.

Never a payment form in the site. One sentence on why the church gives (in its words if available).

## 12. Prayer request

Holds: name (optional), contact (optional), request, who may see it (pastors only / prayer team / share with church), when the prayer group meets, a prayer chain phone line if one exists.

## 13. Mass and worship schedule

Holds (Catholic, Episcopal, Lutheran, Orthodox, cathedrals): weekend services (Vigil, Sunday), weekday, language, Confession/Reconciliation, Adoration, Daily Office, holy days of obligation with dates, livestreamed services, changes this week.

A panel or grid that reads at a glance on a phone: days down, times across, language tags. "Next Mass" line on top.

## 14. Sacraments

Holds: Baptism, First Communion, Confirmation, Marriage, Reconciliation, Anointing of the Sick, Holy Orders, Funerals: each with who to contact and the first step (class, registration, months of notice).

## 15. History

Holds: founding year, the building's story, a few dated milestones. A timeline for Heritage Cathedral and Small-Town Welcome; a sentence elsewhere.

## 16. Location and contact

Holds: address, a "Get directions" link to a maps search URL, parking, accessibility, phone, email, office hours. No embedded map iframe (it breaks offline and slows the page). Draw only what is certain: a pin with the address and the cross streets or landmarks the church itself names ("on Winnebago Street, two blocks from the courthouse"). Never invent street layouts, rivers or landmarks; when in doubt, a styled block with the address and a big "Get directions" button is enough.

## 17. Footer

Holds: name, address, service times, phone, email, office hours, links to the main pages, Give, social links, livestream, photo credits link, copyright. On Small-Town Welcome and Catholic Parish Hub, the footer is often the most-used part of the page: keep it large and legible.

## 18. Language toggle

For bilingual churches: a toggle in the header that swaps key labels (and `html lang`) between languages, stored per visitor. Translate service names, times labels and section headings; link to fully translated pages where they exist. Mark Spanish services with a tag in the schedule.
