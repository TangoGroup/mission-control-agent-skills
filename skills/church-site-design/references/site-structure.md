# Site structure

The build is a plain static site in `site/`. No framework and no build step, so it opens from the file system for review, deploys to Vercel (or any static host) unchanged, and stays easy to edit by hand or with natural-language edits later.

## Layout

```
site/
  index.html              Home
  visit.html              Plan a Visit
  kids.html               Kids & Students
  next-steps.html         Next Steps (or about.html, give.html, ... per the brief)
  assets/
    css/site.css          tokens, base, components, sections, responsive
    js/site.js            menu, next-service line, forms, language toggle
    img/                  photos, resized (see church-photo-direction)
  CREDITS.md              every photo: file, title, creator, licence, source URL
  README.md               how to edit, preview and deploy
  vercel.json             {"cleanUrls": true, "trailingSlash": false}
```

- One HTML file per page at the top level, linked as `visit.html`. With `cleanUrls`, Vercel serves them as `/visit` and redirects the `.html` form; from the file system the same links still work.
- Every page repeats the same header and footer markup. Mark them with comments (`<!-- header:start -->` … `<!-- header:end -->`) so they can be updated across pages with one find-and-replace.
- Mark facts that repeat across pages with `data-fact` attributes (`<span data-fact="sunday-times">`), so a later edit ("change the late service to 11:00") can find every copy.
- Each page: `<!doctype html>`, `lang`, charset, viewport, a specific `<title>` ("Plan a Visit · First Baptist Pine Ridge"), a meta description, Google Fonts link, `assets/css/site.css`, `<script>document.documentElement.classList.add('js')</script>` in the head, `assets/js/site.js` deferred at the end.
- Open Graph tags on the homepage (title, description, image) so links shared in texts and Facebook look right.

## site.css order

1. `:root` tokens: colour roles (`--bg`, `--surface`, `--ink`, `--ink-soft`, `--accent`, `--accent-ink`, plus direction fields), fonts, five type steps, spacing, radius, motion.
2. Reset and base (body size from the tokens, links, focus, selection). Always `img { max-width: 100%; height: auto; }`: without `height: auto` an image's `height` attribute overrides `aspect-ratio` crops and photos render far too tall.
3. Layout helpers (`.wrap` with a max width and gutters of at least 16px, `.section`, grids).
4. Components (buttons, header, footer, cards the direction uses, forms, details/summary).
5. Sections from the library, one block each, named after the section.
6. Motion, inside `prefers-reduced-motion: no-preference`.
7. Responsive overrides, phone last.

## site.js

Small and dependency-free: mobile menu toggle (aria-expanded), reveal-on-scroll that never leaves content hidden, the next-service line, form handling (preventDefault, build a mailto with the fields, show an inline confirmation), language toggle if the brief needs one, with `localStorage` in try/catch.

## README.md for the church

Plain-language instructions: open `index.html` to preview; where times, staff and events live in the files; how to change a photo; how to deploy:

1. Vercel: create a free account, "Add New Project", drag the `site` folder or connect a GitHub repo containing it, deploy. Or from a terminal: `npx vercel deploy site --prod`.
2. Point the church's domain at Vercel in the project's Domains settings.
3. Forms open an email for now; to receive them on the site later, add a form service (Formspree, Basin) or a Vercel function.

## Later: natural-language editing on Vercel

Keep the structure predictable so an AI editor can change it safely: one page per file, shared header/footer markers, `data-fact` attributes on repeated facts, tokens only in `:root`, sections as top-level `<section id="...">` blocks with clear ids. A later version of this pack may move facts into a `content/church.json` with a small build step; the markers make that migration mechanical.
