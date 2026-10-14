/* ==========================================================================
   Plates — a film's last frame, held behind its stop
   --------------------------------------------------------------------------
   Every project chapter of the home film ends on its product, standing on the
   page. The stop that follows talks about it while the product stays in view:
   this is that frame, the same render the film just showed, fixed behind the
   page and cover-fitted exactly as the film fits its frames, so the film fades
   out over it without a seam (film.json "handoff"). The next chapter starts
   on this very frame, so the take is never broken.

   Labels are pinned to points of the product. Their positions are fractions
   of the frame (measured in Blender at the last frame), per aspect:
     <p class="pin" data-at-wide="0.71,0.42" data-at-tall="0.52,0.31" data-side="l|r">
   ========================================================================== */
(function () {
  "use strict";
  var plates = [].slice.call(document.querySelectorAll("[data-plate]:not([data-pending])"));
  if (!plates.length) return;
  var tall = innerHeight > innerWidth;                 /* film.js picks its frames the same way */

  plates.forEach(function (stop) {
    var id = stop.getAttribute("data-plate");
    var img = document.querySelector('.plate[data-for="' + id + '"]');
    var shade = document.querySelector('.plate-shade[data-for="' + id + '"]');      /* night stops: a shade on the words' side */
    var pins = document.querySelector('.pins[data-for="' + id + '"]');
    if (!img) return;
    var fw = tall ? 1080 : 1920, fh = tall ? 1920 : 1080;
    var src = img.getAttribute(tall ? "data-tall" : "data-wide");
    var film = null, asleep = true, shown = -1;
    var lines = [];
    var svg = pins && pins.querySelector("svg");
    var pinEls = pins ? [].slice.call(pins.querySelectorAll(".pin")) : [];
    pinEls.forEach(function () {
      var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", "3"); svg.appendChild(l); svg.appendChild(c); lines.push([l, c]);
    });

    function rem() { return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16; }
    /* where a frame fraction lands on screen (object-fit: cover, centred) */
    function place() {
      if (!pins) return;
      /* the plate's own box (the large viewport, like the film's stage): innerHeight shrinks while a phone's toolbar shows */
      var W = img.clientWidth || innerWidth, H = img.clientHeight || innerHeight, s = Math.max(W / fw, H / fh);
      var ox = (W - fw * s) / 2, oy = (H - fh * s) / 2, r = rem(), m = r * 0.75;
      var hdr = document.querySelector(".hdr"), top = (hdr ? hdr.offsetHeight : 0) + m;
      /* the words scroll up through their column: a label there would be crossed by them */
      var words = !tall && stop.querySelector(".stop__text"), edge = words ? words.getBoundingClientRect().right + m : -1;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      pinEls.forEach(function (el, i) {
        var at = (el.getAttribute(tall ? "data-at-tall" : "data-at-wide") || "").split(",").map(Number);
        var off = (el.getAttribute(tall ? "data-off-tall" : "data-off-wide") || "").split(",").map(Number);
        var hide = function () { el.style.display = "none"; lines[i][0].style.display = lines[i][1].style.display = "none"; };
        if (at.length < 2 || off.length < 2 || isNaN(at[0])) { hide(); return; }
        el.style.display = lines[i][0].style.display = lines[i][1].style.display = "";
        var x = ox + at[0] * fw * s, y = oy + at[1] * fh * s;
        var left = off[0] < 0, w = el.offsetWidth, h = el.offsetHeight;
        var lx = left ? Math.min(W - m, Math.max(m + w, x + off[0] * r)) : Math.max(m, Math.min(W - m - w, x + off[0] * r));
        if ((left ? lx - w : lx) < edge || x < edge) { hide(); return; }
        var ly = Math.max(top, Math.min(H - m - h, y + off[1] * r));
        el.classList.toggle("is-left", left);
        el.style.transform = "translate3d(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px,0)";
        lines[i][0].setAttribute("x1", x.toFixed(1)); lines[i][0].setAttribute("y1", y.toFixed(1));
        lines[i][0].setAttribute("x2", lx.toFixed(1)); lines[i][0].setAttribute("y2", ly.toFixed(1));
        lines[i][1].setAttribute("cx", x.toFixed(1)); lines[i][1].setAttribute("cy", y.toFixed(1));
      });
    }

    function read() {
      var y = scrollY, vh = innerHeight;
      var live = film && film.handoff;
      asleep = !live || y < film.start - vh * 0.12;
      /* the labels arrive as the film fades onto the plate: from halfway
         through the hold, within a third of a screen — they waited for the
         end of the hold and took half a screen more, two flicks of the wheel
         past a chair that had already stopped */
      var k = live ? Math.min(1, Math.max(0, (y - (film.start + (film.end - film.start) * 0.5)) / (vh * 0.3))) : 0;
      var r = stop.getBoundingClientRect();
      var e = Math.min(1, Math.max(0, (r.bottom - vh * 0.5) / (vh * 0.5)));
      /* a still film (reduced motion, no WebGL) never "ends": every plate below
         would count as held, and the last one in the page sat behind all the
         stops. Still, a plate shows only while its own stop comes on screen. */
      var enter = film && film.still ? Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.25))) : 1;
      e *= enter;
      var o = asleep ? 0 : e;
      if (Math.abs(o - shown) > 0.002) { shown = o; img.style.opacity = o.toFixed(3); }
      if (shade) shade.style.opacity = (asleep ? 0 : Math.min(1, Math.max(0, (y - film.end) / (vh * 0.4))) * e).toFixed(3);
      if (pins) pins.style.opacity = (asleep ? 0 : k * k * (3 - 2 * k) * e).toFixed(3);
      if (!asleep && !img.getAttribute("src")) img.setAttribute("src", src);
    }
    addEventListener("film:layout", function (ev) {
      if ((ev.detail && ev.detail.id) !== id) return;
      film = ev.detail; read();
    });
    addEventListener("film:still", function (ev) {
      if ((ev.detail && ev.detail.id) !== id) return;
      film = { handoff: true, start: -1e9, end: -1e9, still: true }; img.setAttribute("src", src); read();
    });
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", function () { place(); read(); });
    if (window.LR) window.LR.on(place);
    /* the image is fetched ahead of the hold (a screen and a half away) */
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting) { img.setAttribute("src", src); io.disconnect(); }
    }, { rootMargin: "150% 0px" }).observe(stop);
    place(); read();
  });
})();
