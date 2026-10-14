/* ==========================================================================
   Damped scrolling
   --------------------------------------------------------------------------
   A mouse wheel does not produce motion, it produces STEPS: one notch is a
   fixed jump, and on a page made of films those steps read as the film
   stuttering. The real scroll position follows a target on a critically
   damped spring instead: a notch becomes a short glide that gathers speed
   and settles without overshoot, and a run of notches one continuous
   movement. (An exponential ease — the first version, the café site's RATE 5 — leaps to full speed
   on the first frame of a notch; the spring's start is soft too.)

   The scroll POSITION is what gets eased, not a fake transform: the films,
   the plates, the header — everything that reads window.scrollY — follows the
   same eased value with no changes of its own.

   Deliberately limited:
   · Fine pointers only. Touch scrolling is already inertial and smooth.
   · Off entirely under prefers-reduced-motion.
   · Never a zoom gesture (ctrl + wheel), never a box that scrolls itself
     (the bot's chat, the brief's note): the wheel is theirs while they can
     still move.
   · Anything that scrolls the page without us — a scrollbar drag, find-in-
     page, a screen reader — is adopted rather than fought.
   A long way to an in-page link (past a film) is not glided: the page fades
   to its own colour, moves, and fades back — easing through it would play
   every film on the way at fast-forward.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var root = document.documentElement;

  /* the fade a long in-page jump passes through (every pointer, every motion setting) */
  var veil = document.createElement("div");
  veil.className = "veil";
  veil.setAttribute("aria-hidden", "true");
  document.body.appendChild(veil);
  var jumps = 0;
  function fadeJump(to, then) {
    if (reduced) { window.scrollTo(0, to); if (then) then(); return; }
    var mine = ++jumps;                  /* a second jump inside the first one's fade owns the veil from then on */
    veil.classList.add("is-on");
    setTimeout(function () {
      if (mine !== jumps) return;
      veil.classList.add("is-on");
      window.__filmSharpOf = {};
      window.scrollTo(0, to);
      if (then) then();
      /* landing inside a film: it has cut to the new moment under the veil, and the veil
         lifts once that moment is on screen sharp (film.js __filmSharpOf), or after 1.5 s.
         A film's word is only taken once it has run since the jump (__filmTickOf): a film
         that was asleep off screen still carries the state it was left in. */
      var t0 = performance.now(), frames = 0;
      (function lift() {
        if (mine !== jumps) return;
        /* the film whose stage fills the screen at the landing, if any (the page holds several) */
        var film = null, films = document.querySelectorAll("[data-film]:not([data-pending]):not(.is-still)");
        for (var i = 0; i < films.length; i++) {
          var r = films[i].getBoundingClientRect();
          if (r.top <= 1 && r.bottom >= window.innerHeight * 0.5) { film = films[i]; break; }
        }
        var id = film && (film.getAttribute("data-film") || "main");
        var fresh = film && ((window.__filmTickOf || {})[id] || 0) > t0;
        var ok = !film || (fresh && (film.classList.contains("is-faded") || (window.__filmSharpOf || {})[id]));
        if (++frames > 2 && (ok || performance.now() - t0 > 1500)) veil.classList.remove("is-on");
        else requestAnimationFrame(lift);
      })();
    }, 260);
  }

  /* the opening film's chapter list (film.js) crosses the page through the same fade */
  window.__fadeJump = function (to) {
    measure();
    to = clamp(to);
    current = target = written = to; vel = 0; running = false;   /* a glide still running would scroll there before the veil is up */
    fadeJump(to);
  };

  var OMEGA = 8;          /* the spring's stiffness: ~0.6 s to settle a notch */
  var SETTLE = 0.35;     /* px: below this (and slow) we snap and stop the loop */
  var target = window.scrollY, current = target, written = Math.round(current), vel = 0;
  var max = 0, running = false, last = 0;

  function measure() {
    max = Math.max(0, root.scrollHeight - window.innerHeight);
    if (target > max) target = max;
  }
  function clamp(v) { return v < 0 ? 0 : v > max ? max : v; }

  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    /* the spring solved exactly over dt: the same glide at 60, 144 and 300 Hz */
    var x0 = current - target, e = Math.exp(-OMEGA * dt), c = vel + OMEGA * x0;
    current = target + (x0 + c * dt) * e;
    vel = (vel - OMEGA * c * dt) * e;
    if (Math.abs(target - current) < SETTLE && Math.abs(vel) < 6) { current = target; vel = 0; running = false; }
    written = Math.round(current);
    window.scrollTo(0, current);
    if (running) requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  /* a box between the pointer and the page that can still scroll that way keeps the wheel */
  function ownsWheel(el, dy) {
    for (; el && el.nodeType === 1 && el !== document.body && el !== root; el = el.parentElement) {
      var oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
        if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      }
    }
    return false;
  }

  if (!reduced && fine) {
    root.style.scrollBehavior = "auto";          /* the CSS smooth-scroll would race this one */

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) return;                     /* pinch zoom is not a scroll */
      if (root.classList.contains("has-modal")) return;   /* a sheet is open (js/mail.js): the page holds still, the sheet scrolls itself */
      if (ownsWheel(e.target, e.deltaY)) return;
      e.preventDefault();
      /* deltaMode 1 is lines, 2 is pages — normalise both to pixels */
      var d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      measure();
      target = clamp(target + d);
      start();
    }, { passive: false });

    /* keys too, or the page would glide under the wheel and snap under the space bar */
    var KEYS = {
      PageDown: function () { return window.innerHeight * 0.9; },
      PageUp: function () { return -window.innerHeight * 0.9; },
      ArrowDown: function () { return 110; },
      ArrowUp: function () { return -110; },
      Home: function () { return -Infinity; },
      End: function () { return Infinity; },
      " ": function (e) { return window.innerHeight * (e.shiftKey ? -0.9 : 0.9); }
    };
    window.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (root.classList.contains("has-modal")) return;
      var step = KEYS[e.key];
      if (!step) return;
      /* space on a focused button or link presses it — it must not also scroll */
      if (e.key === " " && e.target.closest && e.target.closest("button, [role='button'], a, summary, select")) return;
      e.preventDefault();
      measure();
      var d = step(e);
      if (d === Infinity || d === -Infinity) {
        current = target = written = d === Infinity ? max : 0; vel = 0; running = false;
        fadeJump(target);
        return;
      }
      target = clamp(target + d);
      start();
    });

    /* Someone else moved the page: adopt it. Compared against the last
       position WE wrote — scroll events arrive late, and comparing with
       `current` cut fast glides short (measured). */
    window.addEventListener("scroll", function () {
      if (Math.abs(window.scrollY - written) > 2) { current = target = written = window.scrollY; vel = 0; }
    }, { passive: true });

    window.addEventListener("resize", measure);
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(document.body);
    measure();
  }

  /* In-page links: a short way glides, a long way fades through */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    measure();
    var to = clamp(el.getBoundingClientRect().top + window.scrollY);
    var focus = function () { if (a.classList.contains("skip-link")) { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); } };
    if (Math.abs(to - window.scrollY) > window.innerHeight * 2.5 || reduced) {
      current = target = written = to; vel = 0; running = false;
      fadeJump(to, focus);
    } else if (!fine) {
      window.scrollTo({ top: to, behavior: "smooth" });    /* a phone's own glide */
      focus();
    } else {
      target = to;
      start();
      focus();
    }
    /* (a page whose address holds its filter, Projects' #film…, keeps it) */
    if (history.replaceState && !document.querySelector(".work-filter")) history.replaceState(null, "", "#" + id);
  });
})();
