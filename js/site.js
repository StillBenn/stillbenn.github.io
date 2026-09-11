/* ==========================================================================
   Site behaviour — scroll reveal and header state
   Progressive enhancement only: with JS off the page is fully readable, so
   every reveal target starts visible and is only hidden once we know we can
   bring it back.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Reveal on scroll --------------------------------------------------- */
  var targets = document.querySelectorAll(".reveal");

  if (!reduced && "IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* --- Header ------------------------------------------------------------
     Once past the hero the gradient alone stops separating the bar from the
     content, so it gains a solid ground and a hairline. */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      var past = window.scrollY > window.innerHeight * 0.6;
      header.style.background = past ? "rgba(8, 8, 10, 0.92)" : "";
      header.style.borderBottom = past ? "1px solid var(--c-line-soft)" : "";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
