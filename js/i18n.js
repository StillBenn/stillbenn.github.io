/* ==========================================================================
   Language: English (source) · Türkçe · Русский
   --------------------------------------------------------------------------
   The HTML stays English, so crawlers and a JS-less visitor get the English
   page as written. Other languages are applied at the text-node level: any
   string with an entry in the dictionary is swapped, anything without one
   (names, stack labels, an email address) is left exactly as it is.

   Why this and not /tr/ /ru/ subdirectories: the site is a single static file
   with no build step. Adding a line to the dictionary is the whole cost of
   translating a new sentence.

   The original English is parked on the node itself (__src) rather than in a
   parallel array, so switching TR → RU still translates from English and not
   from the Turkish that is currently on screen.
   ========================================================================== */
(function () {
  "use strict";

  var STORE = "bk-lang";
  var DEFAULT_LANG = "en";

  var DICT = {
    tr: {
      /* head */
      "Bünyamin Katkat — 3D & Web Developer": "Bünyamin Katkat — 3B ve Web Geliştirici",
      "I build interactive 3D websites, product configurators and Telegram bots with Three.js, WebGL and Python — running code, not mockups.":
        "Three.js, WebGL ve Python ile interaktif 3B web siteleri, ürün yapılandırıcıları ve Telegram botları geliştiriyorum — maket değil, çalışan kod.",

      /* chrome */
      "Skip to content": "İçeriğe geç",
      "Work": "İşler",
      "Services": "Hizmetler",
      "About": "Hakkımda",
      "Contact": "İletişim",
      "Language": "Dil",

      /* hero */
      "3D & Web Developer": "3B ve Web Geliştirici",
      "Real-time 3D,": "Gerçek zamanlı 3B,",
      "on the open web.": "doğrudan tarayıcıda.",
      "I build interactive 3D websites, product configurators and Telegram bots. Not videos, not mockups — running code you can open on your phone right now.":
        "İnteraktif 3B web siteleri, ürün yapılandırıcıları ve Telegram botları geliştiriyorum. Video değil, maket değil — şu anda telefonunuzdan açabileceğiniz çalışan kod.",
      "See the work": "İşleri gör",
      "Start a project": "Proje başlat",
      "Scroll": "Kaydır",

      /* work */
      "Selected work": "Seçilmiş işler",
      "Things that actually run.": "Gerçekten çalışan işler.",
      "Every project below is live. Open it, rotate it, break it — that is the point.":
        "Aşağıdaki her proje canlı. Açın, döndürün, zorlayın — amaç tam olarak bu.",

      "02 — Interactive site": "02 — İnteraktif site",
      "A cafe site where the product is the interface. One 3D cup is driven by both the page scroll and a live configurator — size, colour, sleeve and lid, with the price following along. Drag to turn it.":
        "Ürünün kendisinin arayüz olduğu bir kafe sitesi. Tek bir 3B bardağı hem sayfa kaydırması hem canlı yapılandırıcı sürüyor — ölçü, renk, kolluk ve kapak; fiyat da anında güncelleniyor. Sürükleyerek döndürebilirsiniz.",
      "01 — Product configurator": "01 — Ürün yapılandırıcı",
      "Armchair configurator": "Koltuk yapılandırıcı",
      "A real-time 3D configurator: six fabrics, four frame finishes, two sizes, with the price and lead time recalculating as the customer builds the product. Runs in the browser, no plugin, works on a phone.":
        "Gerçek zamanlı 3B yapılandırıcı: altı kumaş, dört gövde kaplaması, iki ölçü; müşteri ürünü kurdukça fiyat ve teslim süresi anında güncelleniyor. Tarayıcıda çalışır, eklenti istemez, telefonda da açılır.",

      "03 — Corporate site": "03 — Kurumsal site",
      "A corporate site for a fictional holding working across retail, construction and energy. Three languages from a single set of pages, a 3D building model on the construction section, and a design system built on tokens rather than one-off values.":
        "Market, inşaat ve enerji alanlarında çalışan kurgusal bir holding için kurumsal site. Tek sayfa takımından üç dil, inşaat bölümünde 3B bina modeli ve tek seferlik değerler yerine token'lara dayanan bir tasarım sistemi.",

      "04 — Automation": "04 — Otomasyon",
      "Furniture shop order bot": "Mobilya mağazası sipariş botu",
      "A Telegram bot that carries a catalog, a cart and a five-step checkout, with an admin panel and Excel export behind it. Built so an order can never be silently lost — every step is validated and persisted.":
        "Katalog, sepet ve beş adımlı sipariş akışı taşıyan; arkasında yönetici paneli ve Excel dışa aktarımı olan bir Telegram botu. Hiçbir sipariş sessizce kaybolmasın diye kuruldu — her adım doğrulanır ve kaydedilir.",

      "Open live": "Canlı aç",
      "Source": "Kaynak kod",

      /* services */
      "What I do": "Ne yapıyorum",
      "Three things, done properly.": "Üç iş, hakkıyla.",
      "Interactive 3D websites": "İnteraktif 3B web siteleri",
      "A live WebGL scene that reacts to the cursor and animates on scroll — the kind of site people remember. Performance-budgeted so it still loads fast on a mid-range phone.":
        "İmlece tepki veren, kaydırdıkça canlanan gerçek bir WebGL sahnesi — akılda kalan türden bir site. Orta seviye bir telefonda da hızlı açılsın diye performans bütçesiyle kurulur.",
      "3D product configurators": "3B ürün yapılandırıcıları",
      "Let customers build your product themselves — colour, material, size — and watch the price update live. People who try a product on buy it more often.":
        "Müşteriniz ürünü kendisi kursun — renk, malzeme, ölçü — ve fiyatın anında güncellendiğini görsün. Ürünü \"üzerinde deneyen\" müşteri daha sık satın alır.",
      "Telegram bots & automation": "Telegram botları ve otomasyon",
      "Order flows, catalogs, notifications and admin panels in Python. The unglamorous work that quietly removes hours from your week.":
        "Python ile sipariş akışları, kataloglar, bildirimler ve yönetici panelleri. Gösterişli olmayan ama haftanızdan sessizce saatler kazandıran iş.",

      /* about */
      "I work where 3D meets the web.": "3B ile web'in kesiştiği yerde çalışıyorum.",
      "Most developers pick one side. I sit on the seam: enough graphics to build a scene that looks like a product render, enough web engineering to ship it as a fast, accessible, maintainable site.":
        "Çoğu geliştirici bir tarafı seçer. Ben tam ortasında duruyorum: ürün render'ı gibi görünen bir sahne kuracak kadar grafik, onu hızlı, erişilebilir ve bakımı kolay bir site olarak yayına alacak kadar web mühendisliği.",
      "I hand over": "Size",
      "full source code": "kaynak kodun tamamını",
      "and stay reachable after delivery. I also study information security, so the code I write is not the thing that gets you breached.":
        "teslim ediyorum ve teslimattan sonra da ulaşılabilir kalıyorum. Ayrıca bilgi güvenliği çalışıyorum; yazdığım kod sizi açık veren taraf yapmaz.",
      "Fixed scope, fixed price, and a live preview link before final delivery — you judge the work on your own phone, not on a screenshot.":
        "Sabit kapsam, sabit fiyat ve son teslimattan önce canlı önizleme linki — işi ekran görüntüsünden değil, kendi telefonunuzdan değerlendirirsiniz.",

      "Based in": "Konum",
      "Moscow · Türkiye": "Moskova · Türkiye",
      "Languages": "Diller",
      "Core stack": "Ana teknoloji",
      "Also": "Ayrıca",
      "Delivery": "Teslimat",
      "Source code included": "Kaynak kod dahil",

      /* contact */
      "Tell me what you want to build.": "Ne kurmak istediğinizi anlatın.",
      "Send the idea in a couple of sentences. I will tell you honestly whether it fits, roughly what it takes, and what it would cost — before you commit to anything.":
        "Fikri birkaç cümleyle yazın. Size dürüstçe söyleyeyim: uygun mu, kabaca ne kadar sürer ve ne kadara mal olur — hiçbir şeye söz vermeden önce.",

      /* footer */
      "Bünyamin Katkat — 3D & Web Developer ": "Bünyamin Katkat — 3B ve Web Geliştirici ",
      "Built with Three.js, by hand.": "Three.js ile, elle yazıldı.",
      /* WhatsApp and Telegram are brand names and stay as they are in every
         language; only the generic label needs translating. */
      "Email": "E-posta",

      /* alt text */
      "3D armchair configurator rendered in sand fabric on an oak frame":
        "Meşe gövde üzerinde kum rengi kumaşla render alınmış 3B koltuk yapılandırıcı",
      "Tarven Group corporate website home page": "Tarven Group kurumsal web sitesi ana sayfası",
      "Telegram order bot interface showing a furniture catalog":
        "Mobilya kataloğunu gösteren Telegram sipariş botu arayüzü",
      "Bünyamin Katkat — home": "Bünyamin Katkat — ana sayfa",
      "Primary": "Ana menü"
    },

    ru: {
      /* head */
      "Bünyamin Katkat — 3D & Web Developer": "Бюнямин Каткат — 3D и веб-разработчик",
      "I build interactive 3D websites, product configurators and Telegram bots with Three.js, WebGL and Python — running code, not mockups.":
        "Создаю интерактивные 3D-сайты, конфигураторы товаров и Telegram-ботов на Three.js, WebGL и Python — работающий код, а не макеты.",

      /* chrome */
      "Skip to content": "Перейти к содержанию",
      "Work": "Работы",
      "Services": "Услуги",
      "About": "Обо мне",
      "Contact": "Контакты",
      "Language": "Язык",

      /* hero */
      "3D & Web Developer": "3D и веб-разработчик",
      "Real-time 3D,": "3D в реальном времени,",
      "on the open web.": "прямо в браузере.",
      "I build interactive 3D websites, product configurators and Telegram bots. Not videos, not mockups — running code you can open on your phone right now.":
        "Делаю интерактивные 3D-сайты, конфигураторы товаров и Telegram-ботов. Не видео и не макеты — работающий код, который можно открыть с телефона прямо сейчас.",
      "See the work": "Смотреть работы",
      "Start a project": "Начать проект",
      "Scroll": "Листайте",

      /* work */
      "Selected work": "Избранные работы",
      "Things that actually run.": "То, что действительно работает.",
      "Every project below is live. Open it, rotate it, break it — that is the point.":
        "Каждый проект ниже — живой. Откройте, покрутите, попробуйте сломать: в этом и смысл.",

      "02 — Interactive site": "02 — Интерактивный сайт",
      "A cafe site where the product is the interface. One 3D cup is driven by both the page scroll and a live configurator — size, colour, sleeve and lid, with the price following along. Drag to turn it.":
        "Сайт кофейни, где интерфейсом служит сам товар. Один 3D-стакан ведут и прокрутка страницы, и живой конфигуратор — размер, цвет, держатель и крышка, а цена меняется следом. Стакан можно крутить мышью.",
      "01 — Product configurator": "01 — Конфигуратор товара",
      "Armchair configurator": "Конфигуратор кресла",
      "A real-time 3D configurator: six fabrics, four frame finishes, two sizes, with the price and lead time recalculating as the customer builds the product. Runs in the browser, no plugin, works on a phone.":
        "3D-конфигуратор в реальном времени: шесть тканей, четыре отделки каркаса, два размера, а цена и срок пересчитываются прямо по ходу сборки. Работает в браузере, без плагинов, в том числе на телефоне.",

      "03 — Corporate site": "03 — Корпоративный сайт",
      "A corporate site for a fictional holding working across retail, construction and energy. Three languages from a single set of pages, a 3D building model on the construction section, and a design system built on tokens rather than one-off values.":
        "Корпоративный сайт вымышленного холдинга, работающего в ритейле, строительстве и энергетике. Три языка на одном наборе страниц, 3D-модель здания в разделе строительства и дизайн-система на токенах вместо разовых значений.",

      "04 — Automation": "04 — Автоматизация",
      "Furniture shop order bot": "Бот заказов мебельного магазина",
      "A Telegram bot that carries a catalog, a cart and a five-step checkout, with an admin panel and Excel export behind it. Built so an order can never be silently lost — every step is validated and persisted.":
        "Telegram-бот с каталогом, корзиной и оформлением заказа в пять шагов, с админ-панелью и выгрузкой в Excel. Сделан так, чтобы заказ не терялся молча: каждый шаг проверяется и сохраняется.",

      "Open live": "Открыть",
      "Source": "Исходный код",

      /* services */
      "What I do": "Чем занимаюсь",
      "Three things, done properly.": "Три направления, сделанных как следует.",
      "Interactive 3D websites": "Интерактивные 3D-сайты",
      "A live WebGL scene that reacts to the cursor and animates on scroll — the kind of site people remember. Performance-budgeted so it still loads fast on a mid-range phone.":
        "Живая WebGL-сцена, которая реагирует на курсор и оживает при прокрутке, — такой сайт запоминают. Собирается с бюджетом производительности, чтобы быстро открываться и на среднем телефоне.",
      "3D product configurators": "3D-конфигураторы товаров",
      "Let customers build your product themselves — colour, material, size — and watch the price update live. People who try a product on buy it more often.":
        "Пусть клиент соберёт товар сам — цвет, материал, размер — и увидит, как цена меняется в реальном времени. Тот, кто «примерил» товар, покупает чаще.",
      "Telegram bots & automation": "Telegram-боты и автоматизация",
      "Order flows, catalogs, notifications and admin panels in Python. The unglamorous work that quietly removes hours from your week.":
        "Оформление заказов, каталоги, уведомления и админ-панели на Python. Неэффектная работа, которая тихо освобождает часы каждую неделю.",

      /* about */
      "I work where 3D meets the web.": "Работаю на стыке 3D и веба.",
      "Most developers pick one side. I sit on the seam: enough graphics to build a scene that looks like a product render, enough web engineering to ship it as a fast, accessible, maintainable site.":
        "Большинство разработчиков выбирают одну сторону. Я стою на шве: достаточно графики, чтобы собрать сцену уровня продуктового рендера, и достаточно веб-инженерии, чтобы выпустить её быстрым, доступным и поддерживаемым сайтом.",
      "I hand over": "Передаю",
      "full source code": "полный исходный код",
      "and stay reachable after delivery. I also study information security, so the code I write is not the thing that gets you breached.":
        "и остаюсь на связи после сдачи. Я также изучаю информационную безопасность, поэтому мой код не станет причиной утечки.",
      "Fixed scope, fixed price, and a live preview link before final delivery — you judge the work on your own phone, not on a screenshot.":
        "Фиксированный объём, фиксированная цена и живая ссылка на предпросмотр до финальной сдачи — вы оцениваете работу со своего телефона, а не по скриншоту.",

      "Based in": "Локация",
      "Moscow · Türkiye": "Москва · Турция",
      "Languages": "Языки",
      "Core stack": "Основной стек",
      "Also": "Также",
      "Delivery": "Передача",
      "Source code included": "Исходный код included",

      /* contact */
      "Tell me what you want to build.": "Расскажите, что хотите построить.",
      "Send the idea in a couple of sentences. I will tell you honestly whether it fits, roughly what it takes, and what it would cost — before you commit to anything.":
        "Опишите идею в паре предложений. Честно скажу, подходит ли она, сколько примерно займёт и сколько будет стоить, — до того как вы на что-то подпишетесь.",

      /* footer */
      "Bünyamin Katkat — 3D & Web Developer ": "Бюнямин Каткат — 3D и веб-разработчик ",
      "Built with Three.js, by hand.": "Собрано на Three.js, вручную.",
      "Email": "Почта",

      /* alt text */
      "3D armchair configurator rendered in sand fabric on an oak frame":
        "3D-конфигуратор кресла: песочная ткань на дубовом каркасе",
      "Tarven Group corporate website home page": "Главная страница корпоративного сайта Tarven Group",
      "Telegram order bot interface showing a furniture catalog":
        "Интерфейс Telegram-бота заказов с каталогом мебели",
      "Bünyamin Katkat — home": "Бюнямин Каткат — главная",
      "Primary": "Основное меню"
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
  }

  function current() {
    try { return localStorage.getItem(STORE) || DEFAULT_LANG; }
    catch (e) { return DEFAULT_LANG; }
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
