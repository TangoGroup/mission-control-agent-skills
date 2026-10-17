---
name: church-photo-direction
description: Chooses, finds, vets, prepares and credits every photograph on a church website, the church's own photos first, then suitable stock photos of people, and writes a shot list so the church can replace stock with its own pictures. Use this whenever a church site needs pictures, when church-site-design reaches its photo step, when someone asks for stock photos for a church, wants to replace or improve church website images, or asks what photos a church should take, even if they don't say "photo direction".
---

# Church photo direction

Pictures decide whether a church site feels like a real congregation or a template. Visitors look for faces like their own, the building they will walk into, and what Sunday looks like. Generic stock betrays itself fast (a concert crowd for a 90-person church, saints' statues behind a Baptist welcome, a city skyline for a farm town) and wrong pictures do more harm than fewer pictures.

The order of preference is fixed by honesty, not convenience:

1. **The church's own photos**: people, building, worship, events. Always first, even if small or imperfect.
2. **Open-archive pictures of the church's real place**: its town, county, building history, through taste-skill's `assets.mjs` (Wikimedia Commons, Openverse, museums). Use sparingly, for history or place, never as the main imagery.
3. **Stock photos of people and church life** that fit the tradition, setting and congregation (Unsplash by default).
4. **Type, colour and simple drawn shapes**: better than a wrong photo.

A found or stock picture is never presented as the church's own people, pastor or building. Captions and alt text describe what is in the picture.

## The run

### 1. Inventory

Start from the photo table in `church-brief.md` (the brief skill downloads the current site's photos into `brief-assets/current-site/`). Add anything the user shares. For each photo note: what it shows, pixel size, sharpness, how recent it looks, and a verdict:

- **Hero-worthy:** 1600px+ wide, sharp, shows people or the building at its best.
- **Usable small:** sharp but under 1200px; use in cards, circles, a portrait slot, never stretched full-width.
- **Unusable:** blurry, dated, contains flyer text or logos, or a stock image the church did not own.

Measure sizes after rotation (`magick <file> -auto-orient -format '%wx%h' info:`); phone photos often carry an EXIF rotation that other tools ignore.

**The most common small-church case:** the only good building photo is small (450–960px wide). Keep it, because a real photo of the church beats any stock. Show it at or below its real width: a framed panel in a split hero, a card, a circle. Never stretch it full-bleed; `church-site-design`'s check fails photos shown more than 1.3× their real size. Put a request for a larger photo at the top of the shot list.

### 2. Map slots

From the direction file and the page plan, list every picture slot (hero, ministry tiles, staff, events, page heroes) with its size and crop, and fill each from the inventory first. Mark the slots still empty.

### 3. Find stock for the gaps

Read `references/stock-sources.md` for where and how to search. Search in the subject's words and the direction's mood ("small group living room bible", "kids church craft table", "choir robes gospel", "cathedral nave stained glass", "white church steeple autumn"). For each candidate, check it against `references/vetting.md` before you use it. Look at every image (Read tool) before choosing; titles and alt text lie.

### 4. Prepare

Resize and compress with `bash <this skill>/scripts/prepare.sh <source> <site>/assets/img/<name>.jpg [width]`: 1600px wide for heroes and full-width bands, 1000px for halves and cards, 480px for portraits; JPEG quality around 72; metadata stripped. Name files by content (`sanctuary-autumn.jpg`, `kids-crafts.jpg`), not by ID. Set `width`, `height`, `alt`, `loading="lazy"` (not on the hero) and an `object-position` that keeps faces in frame.

### 5. Credit

Write `site/CREDITS.md` from `assets/credits-template.md`: every file with title, creator, licence, source URL and where it is used. The church's own photos are listed as "First Christian Church" (or the church's name). Add a short credit line in the footer when any licence requires it (CC BY, CC BY-SA); Unsplash does not require credit, but listing photographers in CREDITS.md is good practice.

### 6. Shot list

Write `site/SHOT-LIST.md` from `assets/shot-list-template.md`: every stock photo on the site and the photo the church should take to replace it, with when and how (Sunday 10:45 from the balcony; ask permission before photographing children; natural light; landscape for heroes). This is how stock becomes temporary.

### 7. Report

List in the design report: which slots use the church's photos, which use stock (to be replaced), any picture you rejected and why, and any credit the footer must carry.

## Files

| File | Read it when |
| --- | --- |
| `references/stock-sources.md` | Searching for stock or archive pictures. |
| `references/vetting.md` | Checking a candidate photo. |
| `assets/credits-template.md` | Writing CREDITS.md. |
| `assets/shot-list-template.md` | Writing SHOT-LIST.md. |
| `scripts/prepare.sh` | Resizing and compressing a photo. |
