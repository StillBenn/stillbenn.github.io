/* ==========================================================================
   Controls — the vocabulary the client already uses
   --------------------------------------------------------------------------
   The option names are deliberately trade words, not 3D words: lake, membran,
   akrilik, kompakt lamine, mikrobeton, Calacatta. An interior firm reading
   this page should recognise its own quotation, not a graphics demo.

   Three languages because the same link goes to a kitchen firm in Gaziantep
   and to a studio in Moscow. The dictionary is plain JS: a handful of strings
   does not need a framework, and a build step would make the page harder to
   host.
   ========================================================================== */

import { createRoom } from "./scene.js";

const FLOORS = [
  { key: "oak",    sw: "linear-gradient(135deg,#c8a074,#a97f52)" },
  { key: "walnut", sw: "linear-gradient(135deg,#7b5236,#4a2c1a)" },
  { key: "smoked", sw: "linear-gradient(135deg,#5d4d40,#2e251c)" },
  { key: "marble", sw: "linear-gradient(135deg,#f2f0ec,#cfd1d4)" },
  { key: "traver", sw: "linear-gradient(135deg,#dccdb2,#b9a488)" },
  { key: "micro",  sw: "linear-gradient(135deg,#b4b0aa,#8e8b86)" }
];
const COUNTERS = [
  { key: "marble",    sw: "linear-gradient(135deg,#f4f3f0,#d2d4d7)" },
  { key: "calacatta", sw: "linear-gradient(135deg,#faf7f0,#c4a875)" },
  { key: "granite",   sw: "linear-gradient(135deg,#3a3a3e,#1d1d20)" },
  { key: "verde",     sw: "linear-gradient(135deg,#4a6a58,#22382c)" },
  { key: "oak",       sw: "linear-gradient(135deg,#c8a074,#a97f52)" },
  { key: "compact",   sw: "linear-gradient(135deg,#55555a,#3a3a3e)" }
];
const FRONTS = [
  { key: "lakeWhite",   sw: "linear-gradient(135deg,#ffffff,#e6e4e0)" },
  { key: "lakeAnthra",  sw: "linear-gradient(135deg,#45474b,#26282b)" },
  { key: "lakeSage",    sw: "linear-gradient(135deg,#83917e,#5a6657)" },
  { key: "lakeInk",     sw: "linear-gradient(135deg,#33405a,#1b2331)" },
  { key: "membraneWal", sw: "linear-gradient(135deg,#7b5236,#4a2c1a)" },
  { key: "membraneSmk", sw: "linear-gradient(135deg,#5d4d40,#2e251c)" },
  { key: "cashmere",    sw: "linear-gradient(135deg,#e6dcc9,#c9bda6)" },
  { key: "acrylicGrey", sw: "linear-gradient(135deg,#a0a3a9,#7b7e84)" }
];
const WALLS = [
  { key: "lime",     hex: 0xefeae2, sw: "#efeae2" },
  { key: "sand",     hex: 0xded3c2, sw: "#ded3c2" },
  { key: "cashmere", hex: 0xcfc3ad, sw: "#cfc3ad" },
  { key: "sage",     hex: 0xa9b5a4, sw: "#a9b5a4" },
  { key: "olive",    hex: 0x77795f, sw: "#77795f" },
  { key: "clay",     hex: 0xc08466, sw: "#c08466" },
  { key: "ink",      hex: 0x3c4657, sw: "#3c4657" },
  { key: "anthra",   hex: 0x55585c, sw: "#55585c" }
];

const DICT = {
  tr: {
    kicker: "İç mekân · malzeme konfigüratörü",
    title: "Mekânı müşteri kendi seçsin.",
    lead: "Render göndermek yerine linki gönderin. Müşteri zemini, tezgâhı, dolap kapağını ve duvar rengini kendi deneyip kararını verdikten sonra masaya otursun.",
    floor: "Zemin", counter: "Tezgâh", front: "Dolap kapağı", wall: "Duvar rengi", light: "Işık",
    day: "Gündüz", evening: "Akşam", reset: "Görünümü sıfırla",
    summary: "Seçilenler", drag: "Sürükleyerek çevirin",
    oak: "Meşe parke", walnut: "Ceviz parke", smoked: "Füme meşe",
    marble: "Mermer", traver: "Traverten", micro: "Mikrobeton",
    c_marble: "Carrara mermer", c_calacatta: "Calacatta", c_granite: "Siyah granit",
    c_verde: "Yeşil mermer", c_oak: "Masif meşe", c_compact: "Kompakt lamine",
    f_lakeWhite: "Lake beyaz", f_lakeAnthra: "Lake antrasit", f_lakeSage: "Lake adaçayı",
    f_lakeInk: "Lake gece mavisi", f_membraneWal: "Membran ceviz", f_membraneSmk: "Membran füme",
    f_cashmere: "Kaşmir mat", f_acrylicGrey: "Akrilik gri",
    w_lime: "Kireç beyazı", w_sand: "Kum", w_cashmere: "Kaşmir", w_sage: "Adaçayı",
    w_olive: "Zeytin", w_clay: "Kil", w_ink: "Gece mavisi", w_anthra: "Antrasit",
    cta: "Bu işi kendi projeniz için isteyin",
    note: "Bu sahne tarayıcıda gerçek zamanlı çiziliyor — video veya render değil. Sizin projenizde kendi modelinizle çalışır."
  },
  en: {
    kicker: "Interior · material configurator",
    title: "Let the client choose the room.",
    lead: "Send the link instead of a render. The client tries the floor, the worktop, the cabinet fronts and the wall colour, and comes to the meeting having already decided.",
    floor: "Floor", counter: "Worktop", front: "Cabinet fronts", wall: "Wall colour", light: "Light",
    day: "Daylight", evening: "Evening", reset: "Reset view",
    summary: "Selected", drag: "Drag to orbit",
    oak: "Oak boards", walnut: "Walnut boards", smoked: "Smoked oak",
    marble: "Marble", traver: "Travertine", micro: "Microcement",
    c_marble: "Carrara marble", c_calacatta: "Calacatta", c_granite: "Black granite",
    c_verde: "Verde marble", c_oak: "Solid oak", c_compact: "Compact laminate",
    f_lakeWhite: "Gloss white", f_lakeAnthra: "Gloss anthracite", f_lakeSage: "Gloss sage",
    f_lakeInk: "Gloss ink blue", f_membraneWal: "Matt walnut", f_membraneSmk: "Matt smoked oak",
    f_cashmere: "Cashmere matt", f_acrylicGrey: "Acrylic grey",
    w_lime: "Lime white", w_sand: "Sand", w_cashmere: "Cashmere", w_sage: "Sage",
    w_olive: "Olive", w_clay: "Clay", w_ink: "Ink blue", w_anthra: "Anthracite",
    cta: "Ask for this on your own project",
    note: "This scene is drawn in real time in your browser — not a video, not a render. On your project it runs with your own model."
  },
  ru: {
    kicker: "Интерьер · конфигуратор материалов",
    title: "Пусть клиент соберёт интерьер сам.",
    lead: "Вместо рендера отправьте ссылку. Клиент сам подбирает пол, столешницу, фасады и цвет стен — и приходит на встречу уже с решением.",
    floor: "Пол", counter: "Столешница", front: "Фасады", wall: "Цвет стен", light: "Свет",
    day: "День", evening: "Вечер", reset: "Сбросить вид",
    summary: "Выбрано", drag: "Тяните, чтобы повернуть",
    oak: "Дубовая доска", walnut: "Орех", smoked: "Дуб фьюме",
    marble: "Мрамор", traver: "Травертин", micro: "Микроцемент",
    c_marble: "Мрамор Каррара", c_calacatta: "Калакатта", c_granite: "Чёрный гранит",
    c_verde: "Зелёный мрамор", c_oak: "Массив дуба", c_compact: "Компакт-ламинат",
    f_lakeWhite: "Белый глянец", f_lakeAnthra: "Антрацит глянец", f_lakeSage: "Шалфей глянец",
    f_lakeInk: "Тёмно-синий глянец", f_membraneWal: "Орех матовый", f_membraneSmk: "Дуб фьюме матовый",
    f_cashmere: "Кашемир матовый", f_acrylicGrey: "Акрил серый",
    w_lime: "Извёстковый белый", w_sand: "Песок", w_cashmere: "Кашемир", w_sage: "Шалфей",
    w_olive: "Олива", w_clay: "Глина", w_ink: "Тёмно-синий", w_anthra: "Антрацит",
    cta: "Запросить такое для своего проекта",
    note: "Сцена рисуется в браузере в реальном времени — это не видео и не рендер. В вашем проекте работает с вашей моделью."
  }
};

const state = { floor: "oak", counter: "marble", front: "lakeWhite", wall: "lime", evening: false };
let lang = (localStorage.getItem("ic-lang") || (navigator.language || "en").slice(0, 2));
if (!DICT[lang]) lang = "en";

const $ = s => document.querySelector(s);
const t = k => DICT[lang][k] || k;

const canvas = $(".stage");
if (canvas) boot();

function boot() {
  const room = createRoom(canvas);

  buildSwatches($("#opt-floor"), FLOORS, "floor", k => room.setFloor(k), k => k);
  buildSwatches($("#opt-counter"), COUNTERS, "counter", k => room.setCounter(k), k => "c_" + k);
  buildSwatches($("#opt-front"), FRONTS, "front", k => room.setFront(k), k => "f_" + k);
  buildSwatches($("#opt-wall"), WALLS, "wall", k => {
    room.setWall(WALLS.find(w => w.key === k).hex);
  }, k => "w_" + k);

  document.querySelectorAll("[data-light]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.evening = btn.dataset.light === "evening";
      room.setEvening(state.evening);
      document.querySelectorAll("[data-light]").forEach(b =>
        b.setAttribute("aria-pressed", String(b === btn)));
      paintSummary();
    });
  });

  $("#reset").addEventListener("click", () => room.resetView());

  document.querySelectorAll(".lang__btn").forEach(b => {
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      localStorage.setItem("ic-lang", lang);
      document.documentElement.lang = lang;
      paintText();
    });
  });

  paintText();
}

function buildSwatches(host, list, role, apply, labelKey) {
  if (!host) return;
  host.innerHTML = "";
  list.forEach(o => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sw";
    b.dataset.key = o.key;
    b.dataset.labelKey = labelKey(o.key);
    b.setAttribute("aria-pressed", String(state[role] === o.key));
    b.innerHTML = '<span class="sw__chip" style="background:' + o.sw + '"></span><span class="sw__name"></span>';
    b.addEventListener("click", () => {
      state[role] = o.key;
      apply(o.key);
      [...host.children].forEach(c => c.setAttribute("aria-pressed", String(c === b)));
      paintSummary();
    });
    host.appendChild(b);
  });
}

function paintText() {
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll("[data-label-key]").forEach(el => {
    const n = el.querySelector(".sw__name");
    if (n) n.textContent = t(el.dataset.labelKey);
    el.setAttribute("aria-label", t(el.dataset.labelKey));
  });
  document.querySelectorAll(".lang__btn").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  paintSummary();
}

function paintSummary() {
  const el = $("#summary");
  if (!el) return;
  el.textContent = [
    t(state.floor),
    t("c_" + state.counter),
    t("f_" + state.front),
    t("w_" + state.wall),
    t(state.evening ? "evening" : "day")
  ].join(" · ");
}
