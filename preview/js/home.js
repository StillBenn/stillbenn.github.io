/* ==========================================================================
   Home — the loader, and the page's state around the film
   --------------------------------------------------------------------------
   The loader is a curtain the film lifts (js/film.js calls LRIntro): its
   counter is the opening's frames actually arriving, not a timer, and it
   lifts the moment the mark can be written without a stutter. Everything
   else here is state the CSS reads: is the mark written yet (the "Scroll"
   cue), has the reader scrolled, is the header over the page.
   ========================================================================== */
(function () {
  "use strict";
  var html = document.documentElement;
  var loader = document.querySelector(".loader");
  var bar = loader && loader.querySelector(".loader__bar");
  var count = loader && loader.querySelector(".loader__count");
  var shown = 0, lifted = false, t0 = performance.now();
  var MIN_MS = 700;                 /* a cached visit should still see the curtain, not a flash of it */
  var WRITE_MS = 4200;              /* film.json autoplayMs: the pen, start to finish */

  function paint(p) {
    shown = Math.max(shown, Math.min(1, p));
    if (bar) bar.style.setProperty("--p", shown.toFixed(3));
    if (count) count.textContent = String(Math.round(shown * 100)).padStart(3, "0");
  }
  function lift() {
    if (lifted) return;
    lifted = true;
    paint(1);
    var wait = Math.max(0, MIN_MS - (performance.now() - t0));
    setTimeout(function () {
      html.classList.remove("is-loading");
      dispatchEvent(new Event("intro:done"));
      setTimeout(function () { html.classList.add("is-written"); }, WRITE_MS);
    }, wait);
  }
  window.LRIntro = { progress: paint, done: lift };
  /* never trapped behind the curtain: if the film cannot start at all */
  setTimeout(lift, 12000);

  /* the reader has taken over */
  addEventListener("scroll", function once() {
    if (scrollY > 12) { html.classList.add("has-scrolled"); removeEventListener("scroll", once); }
  }, { passive: true });

  /* the header gets its own ground only over the page, never over the film */
  var hdr = document.querySelector(".hdr");
  function stuck() {
    var onFilm = html.dataset.film === "dark" || html.dataset.film === "light";
    if (hdr) hdr.classList.toggle("is-stuck", !onFilm && scrollY > 10);
  }
  addEventListener("scroll", stuck, { passive: true });
  new MutationObserver(stuck).observe(html, { attributes: true, attributeFilter: ["data-film"] });
  stuck();
})();
