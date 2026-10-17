# The homepage loop

Get the client reacting to real designs as fast as possible. Drafts are for choosing and steering, not for shipping: no checks, no critique rounds, no polishing passes. The quality gate comes once, when the approved design becomes the site.

## Files

```
drafts/
  home-v1a.html  home-v1b.html  home-v1c.html   round 1: three options
  home-v2.html   home-v3.html ...               one per later round
  assets/                                       photos the drafts share
  compare.html                                  made by scripts/compare.mjs
  FEEDBACK.md                                   every round: what was shown, what they said, what changed
```

Each draft is one self-contained file like the reference homepages in `examples/`: inline `<style>`, Google Fonts allowed, photos from `drafts/assets/` (copied from `brief-assets/`) or hotlinked stock. It carries `<meta name="draft-note" content="Small-Town Welcome · big church photo, times bar under it">` so the compare page can label it. Drafts are never edited after they are shown; the next round is a new file, so the client can always go back.

## Round 1: three options

**Which three.** From the themes the client liked (brief, "Themes liked"):

- Three or more liked: their top three, one draft each.
- Two liked: one draft of each, plus a second take on the favourite.
- One liked: three takes on it.

A "take" changes the first screen and the page's rhythm, not just colours, so the three really differ. Pick takes the tuning answers left open:

- **Photo-led:** one large photo of the church or its people fills the first screen, times and address in a band beneath it.
- **Schedule-led:** times, address and "Plan a Visit" are the first screen's main content, photo alongside.
- **Welcome-led:** a short note from the pastor (their real words, or a factual "Meet our pastor" block) and a portrait lead, times right under it.
- **Colour:** brand colour as the page's main field, or as accents on a light page.

If the client answered a tuning question (say, "big church photo first"), every draft honours it, and the takes vary something else.

**What every draft holds.** The real facts from the brief: service times and address in the first screen, the newcomer path, this week's events, kids and students, watch and give, the footer with phone, address and hours. Each draft addresses the audit's top fixes (a Plan a Visit button that goes somewhere, one set of times, 18px+ body text, a short menu). Use the church's own words for tagline and mission. Sample details are allowed and listed in FEEDBACK.md.

**Photos.** Use the church's own photos from `brief-assets/` first. For gaps, hotlink suitable stock photos of people (Unsplash or Pexels pages from `church-photo-direction/references/stock-sources.md`), noting each URL in FEEDBACK.md. Do not download, resize or credit yet: that happens when the site is built.

**Building them in parallel.** If you can hand work to parallel workers, build the three at once, one worker per draft, so round 1 takes the time of one draft. Give each a complete brief:

> Build one homepage draft for {church}, saved as `drafts/home-v1{a|b|c}.html`, a single self-contained HTML file (inline CSS, Google Fonts, no other dependencies). Read `church-brief.md` for every fact and word to use. Follow the direction `{skill}/directions/{NN-name}.md` and look at `{skill}/examples/{NN-name}.html` for structure; take the principles, not its copy. This draft's take: {photo-led / schedule-led / welcome-led, and colour use}. Every draft must: put service times and the address in the first screen at body size or larger; link "Plan a Visit"; use 18px+ body text with 4.5:1 contrast; keep the menu to 7 links plus Give; include {sections from the brief}. Photos: {list of files in drafts/assets and stock URLs}. Add `<meta name="draft-note" content="{theme} · {take in a few words}">`. Do not run any checks or screenshots; write the file and reply with one line on what is distinctive about it and any sample details you invented.

Otherwise build them one after another, quickly.

**Showing them.** Run `node <this skill>/scripts/compare.mjs drafts` (it photographs each draft and embeds the pictures, so the page works anywhere) and share `drafts/compare.html` with the user (attach it or save it where they can open it). Look at it yourself first, in your browser or from the screenshots in `drafts/.shots/`; if a draft is blank or broken, fix it before asking. In chat, give one line per option on what makes it different. Then ask, as numbered questions with lettered options:

1. **"Which one is closest?"** A, B, C, each described in a few words, or "a mix" (they say which parts).
2. **"What should change?"** (more than one allowed): offer the 3–4 likeliest changes for these drafts ("Bigger photo of the church", "Make the times stand out more", "Warmer colours", "Simpler, less on the page") and remind them they can describe anything in their own words.

## Later rounds: one new version

Build `drafts/home-v{n}.html` from the chosen draft plus every piece of feedback so far (read FEEDBACK.md: later feedback wins when two conflict). Change what was asked and anything it obviously implies; keep everything else. Log the round in FEEDBACK.md: what you changed, and anything you chose not to change and why. Re-run compare.mjs (the latest version shows alone, earlier ones are listed) and share it.

Ask:

- **"Is this the one?"** "Yes, this is it"; "Close, a few changes" (they describe them); "Go back to an earlier version" (which one, and what to keep).
- When they want changes, a multi-select of likely tweaks as in round 1.

Keep looping, one version per round, until they say yes. If they go back and forth between two ideas twice, show both side by side as `home-v{n}a.html` and `home-v{n}b.html` and let them choose.

## After approval

Record the approved file in the brief ("Approved homepage: drafts/home-v4.html") along with any decisions from FEEDBACK.md that matter for other pages. Then ask what to build next:

- **"Homepage plus 2–3 key pages" (recommended):** suggest the pages from the brief that matter most (usually Plan a Visit, Kids & Students, Watch).
- **"The whole site":** every page in the brief.
- **"Just the homepage for now":** build the homepage into `site/` and stop.

Then continue with "Build the site" in SKILL.md.
