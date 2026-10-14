/* ==========================================================================
   larisel.com/work — Projects: the filter, the clips, the header
   --------------------------------------------------------------------------
   · The header gets its ground once the page has moved (home.css .is-stuck).
   · The filter shows one kind of project; the choice is kept in the address
     (#film, #configurator…) so a link can open the page already filtered.
     The rows that stay take turns again: the site left, then right.
   · A project's clips (its site in the browser and on the phone) play while
     they are on screen and stop when they leave; nothing loads until a row is
     near. Reduced motion: the posters stay.
   · Words and pictures rise in once as they come on screen.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var hdr = document.querySelector(".hdr");
  var stuck = function () { if (hdr) hdr.classList.toggle("is-stuck", scrollY > 10); };
  addEventListener("scroll", stuck, { passive: true }); stuck();

  /* ---- the filter ---- */
  var chips = [].slice.call(document.querySelectorAll(".chip[data-cat]"));
  var rows = [].slice.call(document.querySelectorAll(".show"));
  function sides() {
    var k = 0;
    rows.forEach(function (r) { if (!r.classList.contains("is-out")) r.classList.toggle("is-flip", k++ % 2 === 1); });
  }
  function filter(cat) {
    if (!chips.some(function (c) { return c.getAttribute("data-cat") === cat; })) cat = "all";
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === cat)); });
    rows.forEach(function (r) { r.classList.toggle("is-out", cat !== "all" && r.getAttribute("data-cat") !== cat); });
    sides();
  }
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var cat = c.getAttribute("data-cat");
      filter(cat);
      if (history.replaceState) history.replaceState(null, "", cat === "all" ? location.pathname + location.search : "#" + cat);
    });
  });
  if (chips.length) filter(location.hash.slice(1) || "all"); else sides();

  /* ---- the clips ---- */
  function load(v) {
    if (!v.getAttribute("src") && v.getAttribute("data-src")) { v.src = v.getAttribute("data-src"); v.load(); }
  }
  function play(v) { if (reduced) return; load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var clips = [].slice.call(document.querySelectorAll(".show video, .case-media video"));
  if (clips.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) play(e.target); else e.target.pause(); });
    }, { rootMargin: "80px 0px", threshold: 0.2 });
    clips.forEach(function (v) { io.observe(v); });
  }

  /* ---- words arrive ---- */
  var groups = [].slice.call(document.querySelectorAll(".work-hero, .show__text, .show, .case-hero, .case-media, .case-body, .case-end"));
  if (!reduced && "IntersectionObserver" in window && groups.length) {
    document.documentElement.classList.add("rv");
    var parts = [];
    groups.forEach(function (g) {
      [].slice.call(g.children).forEach(function (el, i) {
        if (el.classList.contains("show__text")) return;           /* its own lines arrive one by one */
        el.classList.add("rv__p"); el.style.setProperty("--i", Math.min(i, 8)); parts.push(el);
      });
    });
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); rio.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    parts.forEach(function (el) { rio.observe(el); });
  }
})();
