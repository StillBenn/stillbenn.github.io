/* ==========================================================================
   "Start a project" — a brief in four taps
   --------------------------------------------------------------------------
   The visitor answers four plain questions; the page writes the brief as a
   message and hands it to WhatsApp, Telegram (copied, then the chat opens) or
   e-mail. No prices are shown: the studio answers with one within a day.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.querySelector("[data-brief]");
  if (!root) return;
  var t = function (s) { return window.LR ? window.LR.t(s) : s; };
  var out = root.querySelector(".brief__text");
  var picks = {};

  root.querySelectorAll("[data-q]").forEach(function (group) {
    var q = group.getAttribute("data-q");
    var multi = group.hasAttribute("data-multi");
    group.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (multi) {
          b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        } else {
          group.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        }
        var on = [].slice.call(group.querySelectorAll('button[aria-pressed="true"]'));
        picks[q] = on.map(function (x) { return x.getAttribute("data-v"); });
        write();
      });
    });
  });

  function line(key, label) {
    var v = picks[key];
    if (!v || !v.length) return "";
    return t(label) + ": " + v.map(t).join(", ");
  }
  function message() {
    var lines = [t("Hello Larisel, a new project:"),
      line("what", "What"), line("for", "For"), line("lang", "Languages"), line("when", "When"), line("budget", "Budget")
    ].filter(Boolean);
    var note = root.querySelector(".brief__note-in");
    if (note && note.value.trim()) lines.push(t("Notes") + ": " + note.value.trim());
    return lines.join("\n");
  }
  function write() {
    var m = message();
    out.textContent = m;
    var ready = !!(picks.what && picks.what.length);
    root.classList.toggle("is-ready", ready);
    var wa = root.querySelector("[data-send=wa]"), mail = root.querySelector("[data-send=mail]");
    if (wa) wa.href = "https://wa.me/79031689536?text=" + encodeURIComponent(m);
    if (mail) mail.href = "mailto:studio@larisel.com?subject=" + encodeURIComponent(t("A new project")) + "&body=" + encodeURIComponent(m);
  }
  var noteEl = root.querySelector(".brief__note-in");
  if (noteEl) noteEl.addEventListener("input", write);
  var tg = root.querySelector("[data-send=tg]");
  if (tg) tg.addEventListener("click", function (e) {
    /* Telegram cannot pre-fill a message: copy it, say so, then open the chat */
    var m = message();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).catch(function () {});
    var hint = root.querySelector(".brief__copied");
    if (hint) { hint.hidden = false; setTimeout(function () { hint.hidden = true; }, 4000); }
  });
  if (window.LR) window.LR.on(write);
  write();
})();
