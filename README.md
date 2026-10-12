# larisel.com

The site of Larisel, a 3D and web studio.

Live: https://larisel.com

## What it is

A static site, no build step and no framework. The home page is one long
scroll film: an opening written in light, then one chapter per project — the
café, the armchair, the interior, the Larisel Group building and the order
bot — each rendered in Blender and played frame by frame as the reader scrolls,
with a stop after each chapter about the real site behind it.

- `index.html` — the home page, written in English
- `css/home.css` — the home page's styles (`css/tokens.css` and `css/base.css`
  are shared with `/ic-mekan/`)
- `js/film.js` — the scroll film player: WebGL, frames in packs, two quality
  tiers, memory released for films off screen
- `js/plate.js` — a chapter's last frame held behind its stop, with labels
- `js/cupstop.js` — the café chapter hands over to the live 3D cup
- `js/chatdemo.js` — the order bot's flow, playable
- `js/brief.js` — "Start a project": a brief written from four answers
- `js/i18n.js` — Turkish and Russian, applied at the text-node level
- `js/home.js` — loader, recordings, header state
- `film/` — the encoded chapters (`film*.json` describe each film)
- `media/` — screen recordings of the project sites
- `ic-mekan/` — the interior material configurator

## Notes

**Translation** keeps the HTML in English so crawlers and a JS-less visitor get
the page as written. Turkish and Russian are dictionaries in `js/i18n.js`; the
English original is parked on each text node, so switching TR → RU translates
from English rather than from whatever is currently on screen.

**Fonts** are self-hosted and split by script (latin, latin-ext, cyrillic), so
a glyph set only downloads when the page actually uses it.

**Reduced motion**: with `prefers-reduced-motion` every film shows a still and
every stop its own frame.

## Local

```bash
python -m http.server 8899
```

ES modules need HTTP — opening `index.html` from the filesystem will not load
the films or the 3D cup.
