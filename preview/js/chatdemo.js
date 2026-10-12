/* ==========================================================================
   The order bot, playable — a Telegram chat on the page
   --------------------------------------------------------------------------
   The visitor orders the armchair the way the shop's customers do: the bot
   asks, the visitor taps an answer, every step is checked and priced with the
   configurator's own prices, and the order lands with a number. Nothing is
   sent anywhere; it is the bot's real flow, played in the browser.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.querySelector("[data-chat]");
  if (!root) return;
  var log = root.querySelector(".chat__log");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t = function (s) { return window.LR ? window.LR.t(s) : s; };
  var money = function (v) { return "$" + v.toLocaleString("en-US"); };

  /* the configurator's prices (3d-konfigurator-kreslo: PRICE_BASE + options) */
  var BASE = 1290;
  var FABRIC = [["Sand", 0], ["Graphite", 70], ["Terracotta", 95]];
  var FRAME = [["Oak", 0], ["Walnut", 110], ["Brass", 280]];
  var SIZE = [["Standard", 0], ["XL", 230]];
  var order = {};
  var busy = false, timers = [];

  function later(fn, ms) { var id = setTimeout(fn, reduced ? 0 : ms); timers.push(id); }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function bubble(who, html) {
    var b = document.createElement("div");
    b.className = "msg msg--" + who;
    b.innerHTML = html;
    log.appendChild(b);
    requestAnimationFrame(function () { b.classList.add("is-in"); scroll(); });
    return b;
  }
  function typing(then, ms) {
    var d = bubble("bot", '<span class="dots"><i></i><i></i><i></i></span>');
    d.classList.add("msg--typing");
    later(function () { d.remove(); then(); }, ms || 900);
  }
  function ask(text, options, onPick) {
    typing(function () {
      var b = bubble("bot", "<p>" + text + "</p>");
      var kb = document.createElement("div"); kb.className = "kb";
      options.forEach(function (o) {
        var btn = document.createElement("button");
        btn.type = "button"; btn.className = "kb__btn";
        btn.textContent = t(o[0]) + (o[1] ? "  +" + money(o[1]) : "");
        btn.addEventListener("click", function () {
          if (busy) return;
          busy = true;
          kb.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          btn.classList.add("is-picked");
          bubble("me", "<p>" + t(o[0]) + "</p>");
          later(function () { busy = false; onPick(o); }, 350);
        });
        kb.appendChild(btn);
      });
      b.appendChild(kb);
      scroll();
    });
  }

  function total() { return BASE + order.fabric[1] + order.frame[1] + order.size[1]; }

  function start() {
    timers.forEach(clearTimeout); timers = [];
    log.innerHTML = ""; order = {}; busy = false;
    typing(function () {
      bubble("bot", "<p>" + t("Hello! I take orders for the Larisel workshop. Shall we build your armchair?") + "</p>");
      ask(t("First, the fabric:"), FABRIC, function (o) {
        order.fabric = o;
        ask(t("Now the frame:"), FRAME, function (o2) {
          order.frame = o2;
          ask(t("And the size?"), SIZE, function (o3) {
            order.size = o3;
            typing(function () {
              var b = bubble("bot",
                "<p><b>" + t("Your order") + "</b><br>" +
                t("Larisel Armchair") + " — " + t(order.fabric[0]).toLowerCase() + ", " + t(order.frame[0]).toLowerCase() + ", " + t(order.size[0]) + "<br>" +
                t("Made to order in 14 days") + "</p><p class=\"msg__total\">" + money(total()) + "</p>");
              var kb = document.createElement("div"); kb.className = "kb";
              var ok = document.createElement("button"); ok.type = "button"; ok.className = "kb__btn kb__btn--main"; ok.textContent = t("Confirm the order");
              var again = document.createElement("button"); again.type = "button"; again.className = "kb__btn"; again.textContent = t("Start again");
              ok.addEventListener("click", function () {
                if (busy) return; busy = true;
                ok.disabled = again.disabled = true; ok.classList.add("is-picked");
                bubble("me", "<p>" + t("Confirm the order") + "</p>");
                typing(function () {
                  var n = 128 + Math.floor(Math.random() * 60);
                  bubble("bot", "<p>" + t("Done — order") + " <b>#" + n + "</b> " + t("is with the workshop. You will get a message here when it ships.") + "</p>");
                  later(function () {
                    var note = bubble("note", "<p>" + t("The shop sees the same order in its admin panel, and can export the day's orders to Excel.") + "</p>");
                    var re = document.createElement("button"); re.type = "button"; re.className = "chat__again"; re.textContent = t("Order another");
                    re.addEventListener("click", start); note.appendChild(re); busy = false;
                  }, 900);
                }, 1100);
              });
              again.addEventListener("click", function () { if (!busy) start(); });
              kb.appendChild(ok); kb.appendChild(again); b.appendChild(kb); scroll();
            }, 1100);
          });
        });
      });
    }, 700);
  }

  /* begin when the phone comes into view; again in the new language if it changes */
  var begun = false;
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting && !begun) { begun = true; start(); }
  }, { threshold: 0.35 }).observe(root);
  if (window.LR) window.LR.on(function () { if (begun) start(); });
})();
