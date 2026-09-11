# stillbenn.github.io

Personal portfolio — 3D & web development.

Live: https://stillbenn.github.io

## What it is

A single static page. No build step, no framework, no dependencies beyond a
vendored copy of Three.js.

- `index.html` — the whole page, written in English
- `css/tokens.css` — design tokens; nothing below this file hard-codes a value
- `css/base.css` — reset, fonts, typographic primitives
- `css/site.css` — layout and components
- `js/hero.js` — the live WebGL scene behind the title
- `js/i18n.js` — Turkish and Russian, applied at the text-node level
- `js/site.js` — scroll reveal and header state

## Notes

**The hero scene** generates its environment map from a canvas gradient rather
than loading an HDR file — it reflects convincingly on metal, weighs nothing,
and keeps a network request off the critical path. Rendering stops when the
hero scrolls out of view or the tab is hidden.

**Translation** keeps the HTML in English so crawlers and a JS-less visitor get
the page as written. Turkish and Russian are dictionaries in `js/i18n.js`; the
English original is parked on each text node, so switching TR → RU translates
from English rather than from whatever is currently on screen.

**Fonts** are self-hosted and split latin / latin-ext, so the Turkish glyphs
only download when a Turkish character actually appears.

## Local

```bash
python -m http.server 8899
```

ES modules need HTTP — opening `index.html` from the filesystem will not load
the 3D scene.
