/* ==========================================================================
   "Contact us" — a brief in a few taps
   --------------------------------------------------------------------------
   Five plain questions and an optional note; the page writes the brief as a
   card the visitor can read (the dark sheet) and as a message it hands to
   WhatsApp, Telegram (copied, then the chat opens) or e-mail (js/mail.js
   offers Gmail, Outlook, the mail app or the address). No prices are shown:
   the studio answers with one within a day.

   "Something else" for the kind of business opens a field of its own: the
   visitor whose business is not on the list is exactly the one who needs to
   say a few sentences.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.querySelector("[data-brief]");
  if (!root) return;
  var t = function (s) { return window.LR ? window.LR.t(s) : s; };
  var QUESTIONS = ["what", "for", "lang", "when", "budget"];
  var LABELS = { what: "What", for: "For", lang: "Languages", when: "When", budget: "Budget" };
  var picks = {};
  var list = root.querySelector("[data-list]");
  var count = root.querySelector("[data-count]");
  var other = root.querySelector("[data-other-for]");
  var otherText = root.querySelector(".brief__other-text");
  var note = root.querySelector(".brief__note-in");

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
        picks[q] = [].slice.call(group.querySelectorAll('button[aria-pressed="true"]')).map(function (x) { return x.getAttribute("data-v"); });
        if (q === "for") toggleOther(b.hasAttribute("data-other") && b.getAttribute("aria-pressed") === "true");
        write();
      });
    });
  });

  function toggleOther(open) {
    if (!other) return;
    var was = other.classList.contains("is-open");
    other.classList.toggle("is-open", open);
    if (open && !was && otherText) setTimeout(function () { otherText.focus({ preventScroll: true }); }, 380);
  }

  /* one answer as words: "Something else" carries the visitor's own sentences */
  function answer(key) {
    var v = picks[key];
    if (!v || !v.length) return "";
    var words = v.map(t).join(", ");
    if (key === "for" && v[0] === "Something else" && otherText && otherText.value.trim()) words += " — " + otherText.value.trim();
    return words;
  }
  function message() {
    var lines = [t("Hello Larisel, a new project:")];
    QUESTIONS.forEach(function (k) { var a = answer(k); if (a) lines.push(t(LABELS[k]) + ": " + a); });
    if (note && note.value.trim()) lines.push(t("Notes") + ": " + note.value.trim());
    return lines.join("\n");
  }

  /* the card: every question has its row from the start, an answer fills it */
  function sheet() {
    if (!list) return;
    list.textContent = "";
    var rows = QUESTIONS.map(function (k) { return [t(LABELS[k]), answer(k)]; });
    if (note && note.value.trim()) rows.push([t("Notes"), note.value.trim()]);
    rows.forEach(function (r) {
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = r[0];
      dd.textContent = r[1] || "—";
      if (!r[1]) dd.className = "is-empty";
      list.appendChild(dt); list.appendChild(dd);
    });
  }

  function write() {
    var m = message();
    var answered = QUESTIONS.filter(function (k) { return picks[k] && picks[k].length; }).length;
    if (count) count.textContent = String(answered);
    root.style.setProperty("--p", (answered / QUESTIONS.length).toFixed(3));
    var ready = !!(picks.what && picks.what.length);
    root.classList.toggle("is-ready", ready);
    sheet();
    var wa = root.querySelector("[data-send=wa]"), mail = root.querySelector("[data-send=mail]");
    if (wa) wa.href = "https://wa.me/79031689536?text=" + encodeURIComponent(m);
    if (mail) mail.href = "mailto:studio@larisel.com?subject=" + encodeURIComponent(t("A new project")) + "&body=" + encodeURIComponent(m);
  }
  [note, otherText].forEach(function (el) { if (el) el.addEventListener("input", write); });
  var tg = root.querySelector("[data-send=tg]");
  if (tg) tg.addEventListener("click", function () {
    /* Telegram cannot pre-fill a message: copy it, say so, then open the chat */
    var m = message();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).catch(function () {});
    var hint = root.querySelector(".brief__copied");
    if (hint) { hint.hidden = false; setTimeout(function () { hint.hidden = true; }, 4000); }
  });
  if (window.LR) window.LR.on(write);
  write();
})();
