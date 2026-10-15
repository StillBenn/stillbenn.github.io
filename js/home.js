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

  /* Words arrive: each block of a stop, a recording's caption, the way we work
     and the brief rise into place once, part after part, as they come on
     screen — the stops used to slide in flat with the scroll. Off under
     reduced motion; without JS nothing is hidden (html.rv is set here). */
  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var groups = [].slice.call(document.querySelectorAll(".stop__text, .excerpt__caption, .start__how, .brief, .chat"));
  if (!reducedMotion && "IntersectionObserver" in window && groups.length) {
    html.classList.add("rv");
    groups.forEach(function (g) {
      var parts = [];
      [].slice.call(g.children).forEach(function (c) {
        /* a list rises item by item */
        if (c.matches("ol, ul")) parts = parts.concat([].slice.call(c.children));
        else parts.push(c);
      });
      parts.forEach(function (el, i) { el.classList.add("rv__p"); el.style.setProperty("--i", Math.min(i, 9)); });
    });
    var rvIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        rvIO.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    groups.forEach(function (g) { rvIO.observe(g); });
  }

  /* the reader has taken over */
  addEventListener("scroll", function once() {
    if (scrollY > 12) { html.classList.add("has-scrolled"); removeEventListener("scroll", once); }
  }, { passive: true });

  /* Excerpts: the real sites, recorded. A landscape clip on a wide screen, a
     phone recording on a tall one; nothing downloads until the reader is a
     screen away, and a clip only plays while it is on screen. The window
     settles into place as it arrives (--in, 0..1). */
  var tall = innerHeight > innerWidth;
  var excerpts = [].slice.call(document.querySelectorAll(".excerpt"));
  excerpts.forEach(function (ex) {
    var v = ex.querySelector("video");
    if (!v) return;
    var src = tall ? v.getAttribute("data-tall") : v.getAttribute("data-wide");
    var poster = tall ? v.getAttribute("data-tall-poster") : v.getAttribute("data-wide-poster");
    if (poster) v.setAttribute("poster", poster);
    var nearIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      nearIO.disconnect();
      if (src) { v.src = src; v.preload = "auto"; }
    }, { rootMargin: "100% 0px" });
    nearIO.observe(ex);
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }, { threshold: 0.3 }).observe(v);
  });
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function settle() {
    var vh = innerHeight;
    for (var i = 0; i < excerpts.length; i++) {
      var r = excerpts[i].getBoundingClientRect();
      var k = reduced ? 1 : Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
      k = 1 - Math.pow(1 - k, 3);
      excerpts[i].style.setProperty("--in", k.toFixed(3));
    }
  }
  addEventListener("scroll", settle, { passive: true });
  addEventListener("resize", settle);
  settle();

  /* the header gets its own ground only over the page, never over the film —
     a dark one over the night stops and recordings */
  var hdr = document.querySelector(".hdr");
  var nights = [].slice.call(document.querySelectorAll(".stop--night, .excerpt--night"));
  function stuck() {
    if (!hdr) return;
    var onFilm = html.dataset.film === "dark" || html.dataset.film === "light";
    var line = hdr.offsetHeight, night = false, under = false;
    for (var i = 0; i < nights.length; i++) {
      var r = nights[i].getBoundingClientRect();
      if (!r.height || r.bottom <= line) continue;
      /* a night stop's dark plate is behind the header as soon as the stop is on
         screen (the film hands its frame to the plate the moment it ends) */
      if (nights[i].classList.contains("stop") ? r.top < innerHeight : r.top <= line) night = true;
      /* something dark actually under the header wins even over a film's own
         tone: a light film whose top has not reached the header yet left ink
         type on the black recording above it (~0.4 of a screen) */
      if (r.top <= line) under = true;
    }
    hdr.classList.toggle("is-stuck", !onFilm && scrollY > 10);
    hdr.classList.toggle("is-night", (!onFilm && night) || under);
  }
  addEventListener("scroll", stuck, { passive: true });
  new MutationObserver(stuck).observe(html, { attributes: true, attributeFilter: ["data-film"] });
  stuck();

  /* "Skip the film": its ring fills with the film behind you */
  var skip = document.querySelector(".film__skip"), filmEl = skip && skip.closest(".film");
  if (skip && filmEl) {
    var ring = function () {
      var r = filmEl.getBoundingClientRect(), len = r.height - innerHeight;
      skip.style.setProperty("--skip-p", (len > 0 ? Math.min(1, Math.max(0, -r.top / len)) : 0).toFixed(3));
    };
    addEventListener("scroll", ring, { passive: true });
    addEventListener("resize", ring);
    ring();
  }
})();
