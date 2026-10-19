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
  /* over a page's opening picture (a project's moment, the studio's mark) the header is light and has no
     ground; past it, its usual self. About is night all the way down. */
  var hero = document.querySelector(".case-hero, .about-hero"), night = document.body.classList.contains("pg-about");
  var stuck = function () {
    if (!hdr) return;
    var past = hero ? hero.getBoundingClientRect().bottom <= hdr.offsetHeight : true;
    hdr.classList.toggle("is-stuck", scrollY > 10 && past);
    hdr.classList.toggle("is-night", night || (hero && !past));
  };
  addEventListener("scroll", stuck, { passive: true }); stuck();

  /* ---- the opening picture plays: a project's moment loops; the studio's mark lights once and holds,
     its words arriving as the tube steadies. Reduced motion: the still pictures. ---- */
  var tall = innerHeight > innerWidth;
  [].forEach.call(document.querySelectorAll(".case-hero__video, .about-hero__video"), function (v) {
    var box = v.closest(".case-hero, .about"), mark = v.classList.contains("about-hero__video");
    var still = function () { box.classList.add("is-still", "is-lit"); };
    if (reduced) { still(); return; }
    v.addEventListener("playing", function () { v.classList.add("is-playing"); }, { once: true });
    if (mark) {
      v.addEventListener("timeupdate", function () { if (v.currentTime > 1.5) box.classList.add("is-lit"); });
      v.addEventListener("ended", function () { box.classList.add("is-lit"); });
      v.addEventListener("error", still);
      setTimeout(function () { if (!v.classList.contains("is-playing")) still(); }, 4000);
    }
    v.src = v.getAttribute(tall ? "data-tall" : "data-wide");
    var p = v.play(); if (p && p.catch) p.catch(function () { if (mark) still(); });
    if (!mark && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else v.pause();
      }).observe(box);
    }
  });

  /* ---- About: the room dims a little past the opening, so the second screen's words read easily ---- */
  var stage = document.querySelector(".about-stage");
  if (stage) {
    var who = document.querySelector(".about-who");
    var dim = function () {
      stage.style.setProperty("--dim", Math.min(1, Math.max(0, scrollY / (innerHeight * 0.75))).toFixed(3));
      /* once the last screen starts to leave, the sign fades out with it: the page meets the footer in night */
      var b = who ? who.getBoundingClientRect().bottom : innerHeight;
      stage.style.setProperty("--end", Math.min(1, Math.max(0, (innerHeight - b) / (innerHeight * 0.32))).toFixed(3));
    };
    addEventListener("scroll", dim, { passive: true }); addEventListener("resize", dim); dim();
  }

  /* ---- the filter ---- */
  var chips = [].slice.call(document.querySelectorAll(".chip[data-cat]"));
  var rows = [].slice.call(document.querySelectorAll(".show"));
  /* the rows on show alternate sides and count from 01 again (a filter showed "04" on its first row) */
  function sides() {
    var k = 0;
    rows.forEach(function (r) {
      if (r.classList.contains("is-out")) return;
      r.classList.toggle("is-flip", k % 2 === 1);
      var n = r.querySelector(".show__n");
      k++;
      if (n) n.textContent = (k < 10 ? "0" : "") + k;
    });
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
  /* (a project's opening picture is not among them: it is there from the first paint — a picture grows into it) */
  var groups = [].slice.call(document.querySelectorAll(".work-hero, .show__text, .show, .case-hero__in, .case-media, .case-story__card, .case-ask, .about-who__in"));
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
