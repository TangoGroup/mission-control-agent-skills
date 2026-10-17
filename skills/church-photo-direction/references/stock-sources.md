# Stock and archive sources

## Unsplash (default for people and church life)

- Licence: free for commercial and non-commercial use, no permission or credit required (credit appreciated). Not allowed: selling a photo unaltered, or compiling Unsplash photos into a competing collection. Fine for church websites. Avoid "Unsplash+" photos (paid, marked with a plus badge).
- Image URLs take the form `https://images.unsplash.com/photo-<id>?w=1600&q=72&fm=jpg`. Download the file into the site (`prepare.sh`), do not hotlink in a production site.
- Searching: Unsplash blocks scripted API calls without a key. Use the browser: open `https://unsplash.com/s/photos/<query>?license=free`, then read each result's photo link and image source from the page. In the browser tools, a script like this lists results:

  ```js
  [...new Map([...document.querySelectorAll('figure')].map(f => {
    const a = f.querySelector('a[href^="/photos/"]'), i = f.querySelector('img[src*="images.unsplash.com/photo-"]');
    const who = f.querySelector('a[href^="/@"]'), plus = /unsplash\+|plus\.unsplash/i.test(f.innerHTML);
    return a && i && !plus ? [i.src.split('?')[0].split('photo-')[1],
      [(i.alt || '').slice(0, 70), (who && who.innerText.trim()) || '?', 'https://unsplash.com' + a.getAttribute('href')].join(' | ')] : null;
  }).filter(Boolean)).entries()].map(([id, v]) => id + ' | ' + v).join('\n')
  ```

  Each line gives the photo id (for the image URL), alt text, photographer and photo page: everything CREDITS.md needs. Unsplash+ results are skipped.
- Useful queries: family church, kids church, sunday school, bible study group, small group living room, church potluck, worship band church, worship hands, gospel choir, pastor preaching, communion bread wine, church interior, stained glass, cathedral interior, small town church, white church steeple, catholic mass, candles church, baptism, teenagers friends, coffee conversation.

## Pexels

Similar licence (free, no credit required). Searching also needs the browser. Use when Unsplash lacks a subject.

## Open archives (place and history)

taste-skill's `assets.mjs` searches Wikimedia Commons, Openverse, the Art Institute of Chicago and the Met, keeping only licences that allow commercial use (CC0, public domain, CC BY, CC BY-SA), downloads into `assets/` and records credits:

```bash
node <taste-skill>/scripts/assets.mjs "<town> <state>" --source commons,openverse --limit 6
node <taste-skill>/scripts/assets.mjs --get commons:<id> --name <file-name>
node <taste-skill>/scripts/assets.mjs --credits
```

Use for: the town's courthouse or main street for a contact section, a historic photo of the church for a history timeline, the county on a map. If a search for the church's name finds nothing, try the town and state, the county, the street, or the building's architect; then ask the user for old photos (anniversary booklets and directories often have them). Archives are optional; skip them rather than force a weak match. Do not build a church homepage out of town archives; visitors want people and the church itself. CC BY and CC BY-SA need visible credit; CC BY-SA alterations must be shared alike.

## Never

- Images from Google Images, Facebook or other churches' sites (copyright belongs to someone else).
- AI-generated "photos" of the church's people or building presented as real.
- Photos with recognisable logos, sponsor names, readable signs of other organisations, or other churches' names.
