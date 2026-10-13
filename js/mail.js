/* ==========================================================================
   E-mail, offered properly
   --------------------------------------------------------------------------
   A bare mailto: link hands the click to the operating system, and on a
   machine with no mail app chosen that is a system dialog asking which app
   should open "mailto" — the opposite of a studio's front door. Every mailto
   link on the page opens this sheet instead: Gmail or Outlook in the browser
   (the message already written when it comes from the brief), the mail app
   on this device, or the address to copy.
   ========================================================================== */
(function () {
  "use strict";
  var t = function (s) { return window.LR ? window.LR.t(s) : s; };
  var html = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sheet = null, opener = null, mail = null, closeT = 0;

  var svg = function (body) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  };
  var ICON = {
    gmail: svg('<path d="M4 18.5V8.2a1.7 1.7 0 0 1 2.7-1.4L12 10.7l5.3-3.9A1.7 1.7 0 0 1 20 8.2v10.3"/><path d="M4 18.5h3.2v-7.4L12 14.6l4.8-3.5v7.4H20"/>'),
    outlook: svg('<rect x="3" y="6" width="10.5" height="12" rx="2"/><ellipse cx="8.25" cy="12" rx="2.2" ry="2.7"/><path d="M13.5 8.5H20a1 1 0 0 1 1 1V17a1.5 1.5 0 0 1-1.5 1.5h-6"/><path d="m13.5 10.5 3.75 2.6L21 10.5"/>'),
    app: svg('<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m3.8 7.2 8.2 5.9 8.2-5.9"/>'),
    copy: svg('<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.2"/><path d="M15.5 8.5V6.2A2.2 2.2 0 0 0 13.3 4H6.2A2.2 2.2 0 0 0 4 6.2v7.1a2.2 2.2 0 0 0 2.2 2.2h2.3"/>'),
    done: svg('<path d="m5 12.6 4.4 4.4L19 7.6"/>'),
    close: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
    out: svg('<path d="M8 16 16 8M9.5 8H16v6.5"/>'),
  };

  function parse(href) {
    var rest = href.replace(/^mailto:/i, ""), q = "", i = rest.indexOf("?");
    if (i >= 0) { q = rest.slice(i + 1); rest = rest.slice(0, i); }
    var p = new URLSearchParams(q);
    return { to: decodeURIComponent(rest), subject: p.get("subject") || "", body: p.get("body") || "", href: href };
  }

  function build() {
    sheet = document.createElement("div");
    sheet.className = "mail";
    sheet.hidden = true;
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "mail-title");
    sheet.innerHTML =
      '<div class="mail__scrim" data-close></div>' +
      '<div class="mail__panel">' +
        '<button class="mail__x" type="button" data-close data-l="Close">' + ICON.close + "</button>" +
        '<p class="label" data-t="E-mail"></p>' +
        '<h2 class="mail__title" id="mail-title" data-t="Write to us."></h2>' +
        '<p class="mail__addr" data-addr></p>' +
        '<p class="mail__lead" data-t="Where would you like to write from?"></p>' +
        '<ul class="mail__ways">' +
          '<li><a class="mail__way" data-way="gmail" target="_blank" rel="noopener"><span class="mail__ic">' + ICON.gmail + '</span><span class="mail__name">Gmail<small data-t="Opens in your browser"></small></span><span class="mail__go">' + ICON.out + "</span></a></li>" +
          '<li><a class="mail__way" data-way="outlook" target="_blank" rel="noopener"><span class="mail__ic">' + ICON.outlook + '</span><span class="mail__name">Outlook<small data-t="Opens in your browser"></small></span><span class="mail__go">' + ICON.out + "</span></a></li>" +
          '<li><a class="mail__way" data-way="app"><span class="mail__ic">' + ICON.app + '</span><span class="mail__name"><span data-t="Mail app"></span><small data-t="The app on this device"></small></span><span class="mail__go">' + ICON.out + "</span></a></li>" +
        "</ul>" +
        '<div class="mail__copy"><span class="mail__copy-addr" data-addr></span>' +
          '<button class="mail__copy-btn" type="button"><span class="mail__copy-ic">' + ICON.copy + '</span><span data-t="Copy"></span></button></div>' +
        '<p class="mail__note" data-t="Your brief is already in the message." hidden></p>' +
      "</div>";
    document.body.appendChild(sheet);
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { close(); return; }
      var way = e.target.closest(".mail__way");
      if (way) setTimeout(close, way.getAttribute("data-way") === "app" ? 400 : 120);   /* the choice is made: the sheet steps aside */
    });
    sheet.querySelector(".mail__copy-btn").addEventListener("click", copy);
    sheet.addEventListener("keydown", trap);
    if (window.LR) window.LR.on(function () { if (!sheet.hidden) label(); });
  }

  /* words in the page's language, the links written for this message */
  function label() {
    sheet.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.getAttribute("data-t")); });
    sheet.querySelectorAll("[data-l]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-l"))); });
    sheet.querySelectorAll("[data-addr]").forEach(function (el) { el.textContent = mail.to; });
    var to = encodeURIComponent(mail.to), su = encodeURIComponent(mail.subject), bo = encodeURIComponent(mail.body);
    sheet.querySelector('[data-way="gmail"]').href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + to + (su ? "&su=" + su : "") + (bo ? "&body=" + bo : "");
    sheet.querySelector('[data-way="outlook"]').href = "https://outlook.live.com/mail/0/deeplink/compose?to=" + to + (su ? "&subject=" + su : "") + (bo ? "&body=" + bo : "");
    sheet.querySelector('[data-way="app"]').href = mail.href;
    sheet.querySelector(".mail__note").hidden = !mail.body;
  }

  function open(m, from) {
    if (!sheet) build();
    clearTimeout(closeT);
    mail = m; opener = from;
    label();
    resetCopy();
    sheet.hidden = false;
    html.classList.add("has-modal");
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add("is-open"); }); });
    setTimeout(function () { var first = sheet.querySelector(".mail__way"); if (first) first.focus({ preventScroll: true }); }, reduced ? 0 : 120);
    document.addEventListener("keydown", onKey);
  }
  function close() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove("is-open");
    html.classList.remove("has-modal");
    document.removeEventListener("keydown", onKey);
    closeT = setTimeout(function () { sheet.hidden = true; }, reduced ? 0 : 460);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  function onKey(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
  /* Tab stays inside the sheet while it is open */
  function trap(e) {
    if (e.key !== "Tab") return;
    var f = [].slice.call(sheet.querySelectorAll("a[href], button:not([disabled])"));
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function resetCopy() {
    var b = sheet.querySelector(".mail__copy-btn");
    b.classList.remove("is-done");
    b.querySelector(".mail__copy-ic").innerHTML = ICON.copy;
    b.querySelector("[data-t]").setAttribute("data-t", "Copy");
    b.querySelector("[data-t]").textContent = t("Copy");
  }
  function copy() {
    var done = function () {
      var b = sheet.querySelector(".mail__copy-btn");
      b.classList.add("is-done");
      b.querySelector(".mail__copy-ic").innerHTML = ICON.done;
      var s = b.querySelector("[data-t]"); s.setAttribute("data-t", "Copied"); s.textContent = t("Copied");
      setTimeout(function () { if (!sheet.hidden) resetCopy(); }, 2400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail.to).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = mail.to; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) { /* the address is on screen to select by hand */ }
      ta.remove();
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || a.closest(".mail") || e.defaultPrevented) return;
    e.preventDefault();
    open(parse(a.getAttribute("href")), a);
  });
})();
