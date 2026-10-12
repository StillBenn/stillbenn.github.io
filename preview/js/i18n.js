/* ==========================================================================
   Language: English (source) · Türkçe · Русский — the home page
   --------------------------------------------------------------------------
   The engine is the site's own (../js/i18n.js): the HTML stays English for
   crawlers and a JS-less visitor, and every text node with an entry here is
   swapped in place; the English is parked on the node (__src), so TR -> RU
   still translates from English. Lines of a film headline are separate
   nodes, so each language gets its own line breaks.
   ========================================================================== */
(function () {
  "use strict";

  var STORE = "bk-lang";
  var DEFAULT_LANG = "en";

  var DICT = {
    "tr": {
      "Larisel — Films you scroll, 3D you can turn": "Larisel — Kaydırılan filmler, çevrilebilen 3B",
      "Larisel is a 3D and web studio. We turn products into films you scroll and 3D models you can turn — rendered in Blender, built in three.js, and they open on a phone.": "Larisel bir 3B ve web stüdyosu. Ürünleri kaydırdıkça oynayan filmlere ve elle çevrilen 3B modellere dönüştürüyoruz — Blender'da render, three.js ile kod, telefonda açılır.",
      "Skip to the work": "İşlere geç",
      "Larisel — home": "Larisel — ana sayfa",
      "Primary": "Ana menü",
      "Work": "İşler",
      "Process": "Süreç",
      "Contact": "İletişim",
      "Language": "Dil",
      "Start a project": "Proje başlat",
      "Larisel — the studio's film": "Larisel — stüdyonun filmi",
      "Larisel — 3D & web studio": "Larisel — 3B ve web stüdyosu",
      "We turn your product": "Ürününüz:",
      "into a film you scroll": "kaydırdıkça oynayan film",
      "and": "ve",
      "3D you can turn.": "elinizde dönen 3B.",
      "Websites for cafés, furniture and interiors — rendered in Blender, built in three.js, and they open on a phone.": "Kafeler, mobilya ve iç mekân firmaları için web siteleri — Blender'da render edilir, three.js ile kodlanır ve telefonda açılır.",
      "01 — Interactive site": "01 — İnteraktif site",
      "Larisel Café.": "Larisel Kafe.",
      "A café you order from.": "Buradan sipariş verilir.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Bu bölüm kafenin kendi filmi ve kendi sitesinden oynuyor: kahve dökülür, kapak takılır, bardak aşağıdaki canlı bardağa dönüşür.",
      "Film chapters": "Film bölümleri",
      "01 Café": "01 Kafe",
      "Skip the film": "Filmi geç",
      "Scroll": "Kaydır",
      "Larisel Café": "Larisel Kafe",
      "A café website where the product is the interface: a film from bean to cup that plays as you scroll, a 3D cup the customer designs — colour, print, their name — a printed order ticket, ordering from the table by QR with a split bill, and a coffee reading from a photo of their own cup.": "Ürünün arayüz olduğu bir kafe sitesi: kaydırdıkça oynayan, çekirdekten bardağa bir film; müşterinin rengini, baskısını ve adını seçtiği 3B bardak; basılı sipariş fişi; masadan QR ile sipariş ve hesap bölme; kendi fincanının fotoğrafından kahve falı.",
      "Film": "Film",
      "1,020 frames, rendered in Blender": "1.020 kare, Blender'da render",
      "Live 3D": "Canlı 3B",
      "three.js — the cup on this page": "three.js — bu sayfadaki bardak",
      "Ordering": "Sipariş",
      "QR table, split bill, ticket": "QR masa, hesap bölme, fiş",
      "Languages": "Diller",
      "Open the live site": "Canlı siteyi aç",
      "Source": "Kaynak kod",
      "Drag the cup to turn it": "Çevirmek için bardağı sürükleyin",
      "Swipe sideways on the cup to turn it": "Çevirmek için bardağı yana kaydırın",
      "Lid": "Kapak",
      "Six lids — the clear one shows the coffee.": "Altı kapak — şeffaf olan kahveyi gösterir.",
      "Print": "Baskı",
      "The customer's name, printed as they type.": "Müşterinin adı, yazdıkça basılır.",
      "Sleeve": "Manşon",
      "Seven sleeves; the ribs are drawn in code.": "Yedi manşon; oluklar kodla çiziliyor.",
      "Handoff": "Devir",
      "The film's last frame is this live model.": "Filmin son karesi bu canlı model.",
      "02 — Product configurator": "02 — Ürün yapılandırıcı",
      "Larisel Armchair": "Larisel Koltuk",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Filmin sonraki bölümü — siz koltuğu kurarken değişen kumaş, iskelet ve fiyat — yapım aşamasında.",
      "Tell us what you want to build.": "Ne yapmak istediğinizi anlatın.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Fikrinizi iki cümleyle yazın. Size uyup uymadığını, kabaca ne gerektirdiğini ve ne tutacağını — siz hiçbir şeye bağlanmadan — dürüstçe söyleriz.",
      "3D & web studio · Moscow · Türkiye": "3B ve web stüdyosu · Moskova · Türkiye"
    },
    "ru": {
      "Larisel — Films you scroll, 3D you can turn": "Larisel — фильмы, которые листают, и 3D, которое вращают",
      "Larisel is a 3D and web studio. We turn products into films you scroll and 3D models you can turn — rendered in Blender, built in three.js, and they open on a phone.": "Larisel — студия 3D и веба. Превращаем продукт в фильм, который идёт при прокрутке, и в 3D-модель, которую вращают рукой: рендер в Blender, код на three.js, всё открывается на телефоне.",
      "Skip to the work": "К работам",
      "Larisel — home": "Larisel — главная",
      "Primary": "Основное меню",
      "Work": "Работы",
      "Process": "Процесс",
      "Contact": "Контакты",
      "Language": "Язык",
      "Start a project": "Начать проект",
      "Larisel — the studio's film": "Larisel — фильм студии",
      "Larisel — 3D & web studio": "Larisel — студия 3D и веба",
      "We turn your product": "Ваш продукт —",
      "into a film you scroll": "фильм при прокрутке",
      "and": "и",
      "3D you can turn.": "3D в ваших руках.",
      "Websites for cafés, furniture and interiors — rendered in Blender, built in three.js, and they open on a phone.": "Сайты для кофеен, мебели и интерьеров — рендер в Blender, код на three.js, и всё открывается на телефоне.",
      "01 — Interactive site": "01 — Интерактивный сайт",
      "Larisel Café.": "Larisel Café.",
      "A café you order from.": "Здесь можно заказать.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Эта глава — фильм самой кофейни, он идёт с её сайта: кофе наливают, надевают крышку, и стакан становится живым — ниже.",
      "Film chapters": "Главы фильма",
      "01 Café": "01 Кафе",
      "Skip the film": "Пропустить фильм",
      "Scroll": "Листайте",
      "Larisel Café": "Larisel Café",
      "A café website where the product is the interface: a film from bean to cup that plays as you scroll, a 3D cup the customer designs — colour, print, their name — a printed order ticket, ordering from the table by QR with a split bill, and a coffee reading from a photo of their own cup.": "Сайт кофейни, где продукт — это интерфейс: фильм от зерна до стакана, который идёт при прокрутке; 3D-стакан, который гость оформляет сам — цвет, принт, своё имя; печатный чек; заказ со стола по QR с разделением счёта и гадание на кофейной гуще по фото своей чашки.",
      "Film": "Фильм",
      "1,020 frames, rendered in Blender": "1020 кадров, рендер в Blender",
      "Live 3D": "Живое 3D",
      "three.js — the cup on this page": "three.js — стакан на этой странице",
      "Ordering": "Заказ",
      "QR table, split bill, ticket": "QR со стола, деление счёта, чек",
      "Languages": "Языки",
      "Open the live site": "Открыть сайт",
      "Source": "Исходный код",
      "Drag the cup to turn it": "Потяните стакан, чтобы повернуть",
      "Swipe sideways on the cup to turn it": "Проведите по стакану вбок, чтобы повернуть",
      "Lid": "Крышка",
      "Six lids — the clear one shows the coffee.": "Шесть крышек — прозрачная показывает кофе.",
      "Print": "Печать",
      "The customer's name, printed as they type.": "Имя гостя печатается, пока он его вводит.",
      "Sleeve": "Манжета",
      "Seven sleeves; the ribs are drawn in code.": "Семь манжет; рёбра нарисованы кодом.",
      "Handoff": "Переход",
      "The film's last frame is this live model.": "Последний кадр фильма — эта живая модель.",
      "02 — Product configurator": "02 — Конфигуратор товара",
      "Larisel Armchair": "Кресло Larisel",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Следующая глава фильма — ткань, каркас и цена меняются, пока вы собираете кресло, — в производстве.",
      "Tell us what you want to build.": "Расскажите, что хотите сделать.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Опишите идею в паре предложений. Честно скажем, подходит ли она нам, что примерно потребуется и сколько это будет стоить — до того, как вы что-то решите.",
      "3D & web studio · Moscow · Türkiye": "студия 3D и веба · Москва · Турция"
    }
  };

  /* Dictionary keys are the English text with whitespace collapsed, so a
     string that wraps across lines in the HTML still matches. */
  function norm(s) {
    return String(s).replace(/\s+/g, " ").trim();
  }

  /* --- Text nodes --------------------------------------------------------- */
  var nodes = null;
  function collect() {
    if (nodes) return nodes;
    nodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!norm(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      if (n.__src === undefined) n.__src = n.nodeValue;
      nodes.push(n);
    }
    return nodes;
  }

  /* --- Translatable attributes -------------------------------------------- */
  var ATTRS = ["alt", "aria-label", "title", "placeholder"];
  var attrNodes = null;
  function collectAttrs() {
    if (attrNodes) return attrNodes;
    attrNodes = [];
    var all = document.querySelectorAll("[alt],[aria-label],[title],[placeholder]");
    for (var i = 0; i < all.length; i++) {
      for (var a = 0; a < ATTRS.length; a++) {
        var el = all[i], name = ATTRS[a], v = el.getAttribute(name);
        if (!v || !norm(v)) continue;
        var slot = "__src_" + name;
        if (el[slot] === undefined) el[slot] = v;
        attrNodes.push({ el: el, attr: name, src: el[slot] });
      }
    }
    return attrNodes;
  }

  var titleSrc = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var metaSrc = metaDesc ? metaDesc.getAttribute("content") : null;

  function translate(lang) {
    var dict = DICT[lang];

    var list = collect();
    for (var i = 0; i < list.length; i++) {
      var node = list[i], src = node.__src;
      var hit = dict ? dict[norm(src)] : undefined;
      if (hit === undefined) { node.nodeValue = src; continue; }
      /* Keep the surrounding whitespace so inline layout does not shift. */
      node.nodeValue = src.match(/^\s*/)[0] + hit + src.match(/\s*$/)[0];
    }

    var attrs = collectAttrs();
    for (var j = 0; j < attrs.length; j++) {
      var at = attrs[j];
      var av = dict ? dict[norm(at.src)] : undefined;
      at.el.setAttribute(at.attr, av === undefined ? at.src : av);
    }

    document.title = (dict && dict[norm(titleSrc)]) || titleSrc;
    if (metaDesc && metaSrc) {
      metaDesc.setAttribute("content", (dict && dict[norm(metaSrc)]) || metaSrc);
    }
    document.documentElement.setAttribute("lang", lang);
    shown = lang;
    for (var k = 0; k < listeners.length; k++) listeners[k](lang);
  }
  var shown = DEFAULT_LANG, listeners = [];
  /* for scripts that draw words of their own */
  window.LR = {
    t: function (s) { var d = DICT[shown]; return (d && d[norm(s)]) || s; },
    lang: function () { return shown; },
    on: function (fn) { listeners.push(fn); }
  };

  /* The remembered choice, else the browser's own language when we speak it.
     The page opts out of browser translation (translate="no"), so without
     this a Turkish or Russian browser would simply get English. */
  function browserLang() {
    var prefs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (code === "en") return "en";
      if (DICT[code]) return code;
    }
    return DEFAULT_LANG;
  }
  function current() {
    try { return localStorage.getItem(STORE) || browserLang(); }
    catch (e) { return browserLang(); }
  }
  function remember(lang) {
    try { localStorage.setItem(STORE, lang); } catch (e) { /* private window */ }
  }

  function setLang(lang) {
    if (!DICT[lang] && lang !== "en") lang = DEFAULT_LANG;
    translate(lang);
    remember(lang);
    var btns = document.querySelectorAll(".lang__btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", String(btns[i].dataset.lang === lang));
    }
  }

  function start() {
    var btns = document.querySelectorAll(".lang__btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        setLang(this.dataset.lang);
      });
    }
    var lang = current();
    if (lang !== DEFAULT_LANG) setLang(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
