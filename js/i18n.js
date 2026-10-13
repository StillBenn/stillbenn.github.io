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
      "Larisel — the studio's film": "Larisel — stüdyonun filmi",
      "Larisel — 3D & web studio": "Larisel — 3B ve web stüdyosu",
      "We turn your product": "Ürününüz:",
      "into a film you scroll": "kaydırdıkça oynayan film",
      "and": "ve",
      "3D you can turn.": "elinizde dönen 3B.",
      "Websites for cafés, furniture and interiors — rendered in Blender, built in three.js, and they open on a phone.": "Kafeler, mobilya ve iç mekân firmaları için web siteleri — Blender'da render edilir, three.js ile kodlanır ve telefonda açılır.",
      "Larisel Café.": "Larisel Kafe.",
      "A café you order from.": "Buradan sipariş verilir.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Bu bölüm kafenin kendi filmi ve kendi sitesinden oynuyor: kahve dökülür, kapak takılır, bardak aşağıdaki canlı bardağa dönüşür.",
      "Film chapters": "Film bölümleri",
      "01 Café": "01 Kafe",
      "02 Armchair": "02 Koltuk",
      "03 Interiors": "03 İç mekân",
      "04 Corporate site": "04 Kurumsal site",
      "05 Order bot": "05 Sipariş botu",
      "Skip the film": "Filmi geç",
      "Scroll": "Kaydır",
      "Larisel Café": "Larisel Kafe",
      "Lid": "Kapak",
      "Sleeve": "Manşon",
      "02 — Product configurator": "02 — Ürün yapılandırıcı",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Filmin sonraki bölümü — siz koltuğu kurarken değişen kumaş, iskelet ve fiyat — yapım aşamasında.",
      "Tell us what you want to build.": "Ne yapmak istediğinizi anlatın.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Fikrinizi iki cümleyle yazın. Size uyup uymadığını, kabaca ne gerektirdiğini ve ne tutacağını — siz hiçbir şeye bağlanmadan — dürüstçe söyleriz.",
      "3D & web studio · Moscow · Türkiye": "3B ve web stüdyosu · Moskova · Türkiye",
      "01 — Café": "01 — Kafe",
      "Pick a coffee, design the cup.": "Kahveni seç, bardağı tasarla.",
      "From the café's homepage": "Kafenin ana sayfasından",
      "A café website that guests use the way they use the counter — and then a little more.": "Misafirlerin tezgâhı kullanır gibi kullandığı bir kafe sitesi — üstelik biraz daha fazlası.",
      "Design the cup": "Bardağını tasarla",
      "Choose the drink, then the cup's colour, sleeve and lid — and see your name printed on it.": "Önce içeceği, sonra bardağın rengini, manşonunu ve kapağını seç — adın da üstüne basılsın.",
      "Order from the table": "Masadan sipariş ver",
      "Scan the code on the table, order, and split the bill with friends.": "Masadaki kodu okut, siparişini ver, hesabı arkadaşlarınla böl.",
      "A coffee reading": "Kahve falı",
      "Send a photo of the empty cup and read what the grounds say.": "Boş fincanın fotoğrafını gönder, telvenin ne dediğini oku.",
      "Visit the café": "Kafeyi ziyaret et",
      "Pick the lid — the clear one shows your coffee.": "Kapağı seç — şeffaf olan kahveni gösterir.",
      "Your name": "Adın",
      "Printed on the cup as you type it.": "Yazdıkça bardağa basılır.",
      "Kraft, linen, copper, cork — seven to choose from.": "Kraft, keten, bakır, mantar — yedi seçenek.",
      "Turn it": "Çevir",
      "Drag the cup — it is real 3D, not a photo.": "Bardağı sürükle — fotoğraf değil, gerçek 3B.",
      "The café site, recorded": "Kafe sitesi, kayıttan",
      "On the site": "Sitede",
      "A guest designs a cup: ink blue, a copper sleeve, and her name.": "Bir misafir bardağını tasarlıyor: mürekkep mavisi, bakır manşon ve kendi adı.",
      "The armchair": "Koltuk",
      "02 — Armchair": "02 — Koltuk",
      "Larisel Armchair.": "Larisel Koltuk.",
      "Built on screen.": "Ekranda kuruluyor.",
      "A furniture shop's product page where the customer puts the chair together — and sees it before it is made.": "Müşterinin koltuğu kendisinin kurduğu bir mobilya ürün sayfası — üstelik koltuğu yapılmadan önce görüyor.",
      "Fabric and frame": "Kumaş ve iskelet",
      "One tap,": "Bir dokunuş,",
      "a different chair.": "başka bir koltuk.",
      "Sand to graphite to terracotta, oak to brass to walnut. On the shop's page the chair changes the moment the customer chooses.": "Kumdan grafite, terakotaya; meşeden pirince, cevize. Mağazanın sayfasında koltuk, müşteri seçtiği an değişir.",
      "Larisel Armchair": "Larisel Koltuk",
      "Build the chair for your own room — the model and the price change as you go.": "Koltuğu kendi odanıza göre kurun — model ve fiyat anında değişir.",
      "From the shop's product page": "Mağazanın ürün sayfasından",
      "A furniture product page that sells by letting the customer build the chair.": "Müşteriye koltuğu kendisi kurdurarak satan bir mobilya ürün sayfası.",
      "Pick the fabric": "Kumaşı seç",
      "Twelve colours, and six ready pairings of chair, cushion and frame.": "On iki renk, bir de koltuk, yastık ve gövdeden oluşan altı hazır kombin.",
      "Pick the frame and the size": "İskeleti ve boyutu seç",
      "Four woods and four metals, from bleached oak to brass; standard or XL.": "Ağartılmış meşeden pirince dört ahşap, dört metal; standart ya da XL.",
      "See the price, then order": "Fiyatı gör, sonra sipariş ver",
      "The total follows every choice, and one tap sends the build to the workshop.": "Toplam her seçimle değişir; tek dokunuşla sipariş atölyeye gider.",
      "Build an armchair": "Bir koltuk kur",
      "Price": "Fiyat",
      "Changes with every choice.": "Her seçimle değişir.",
      "Frame": "İskelet",
      "Four woods, four metals.": "Dört ahşap, dört metal.",
      "Fabric": "Kumaş",
      "Twelve colours to choose from.": "On iki renk seçeneği.",
      "Size": "Boyut",
      "Standard or XL.": "Standart ya da XL.",
      "The armchair site, recorded": "Koltuk sitesi, kayıttan",
      "The customer tries ready pairings, then a frame and a colour of their own — the chair and its price change with every tap.": "Müşteri hazır kombinleri deniyor, sonra gövdeyi ve rengi kendisi seçiyor — koltuk da fiyatı da her dokunuşta değişiyor.",
      "The next chapter is being filmed: the room around this chair, a kitchen from morning to evening.": "Sonraki bölüm çekiliyor: bu koltuğun etrafındaki oda, sabahtan akşama bir mutfak.",
      "The interior": "İç mekân",
      "03 — Interiors": "03 — İç mekân",
      "Larisel Interiors.": "Larisel İç Mekân.",
      "The client chooses the room.": "Mekânı müşteri seçer.",
      "A tool for kitchen and interior studios: floor, worktop, fronts and wall colour, changed live while the client stands in the room.": "Mutfak ve iç mimarlık stüdyoları için bir araç: zemin, tezgâh, dolap kapakları ve duvar rengi, müşteri odanın içindeyken canlı değişir.",
      "Afternoon to evening": "Öğleden akşama",
      "The same kitchen,": "Aynı mutfak,",
      "after sunset.": "gün batınca.",
      "One switch shows the materials under evening light — before a single panel is ordered.": "Tek bir düğme malzemeleri akşam ışığında gösterir — daha tek bir panel sipariş edilmeden.",
      "Larisel Interiors": "Larisel İç Mekân",
      "Let the client choose the room.": "Mekânı müşteri kendi seçsin.",
      "From the configurator's homepage": "Yapılandırıcının ana sayfasından",
      "Instead of sending renders back and forth, the studio sends one link — and the client arrives at the meeting having decided.": "Stüdyo render gönderip durmak yerine tek bir link gönderir — müşteri toplantıya kararını vermiş olarak gelir.",
      "Try the materials": "Malzemeleri dene",
      "Six floors, six worktops, eight cabinet fronts and eight wall colours.": "Altı zemin, altı tezgâh, sekiz dolap kapağı ve sekiz duvar rengi.",
      "See it day and night": "Gündüz ve gece gör",
      "The same kitchen in daylight and with the lamps on.": "Aynı mutfak gün ışığında ve lambalar yanarken.",
      "Open it anywhere": "Her yerde aç",
      "It runs in the browser, on a phone too; nothing to install.": "Tarayıcıda, telefonda da çalışır; kurulacak bir şey yok.",
      "Open the room": "Odayı aç",
      "Light": "Işık",
      "Daylight or evening, one switch.": "Gündüz ya da akşam, tek düğme.",
      "Worktop": "Tezgâh",
      "Marble, granite, oak and more.": "Mermer, granit, meşe ve dahası.",
      "Fronts": "Kapaklar",
      "Eight finishes, gloss or matt.": "Parlak ya da mat, sekiz yüzey.",
      "The interior site, recorded": "İç mekân sitesi, kayıttan",
      "The client tries a walnut floor, a Calacatta worktop and ink-blue fronts — then switches to evening.": "Müşteri ceviz zemini, kalakata tezgâhı ve gece mavisi kapakları deniyor — sonra akşama geçiyor.",
      "The corporate site": "Kurumsal site",
      "04 — Corporate site": "04 — Kurumsal site",
      "Larisel Group.": "Larisel Group.",
      "Three sectors, one address.": "Üç sektör, tek adres.",
      "The website of a group working in retail, construction and energy — one set of pages, three languages.": "Perakende, inşaat ve enerjide çalışan bir grubun sitesi — tek sayfa seti, üç dil.",
      "Larisel Group": "Larisel Group",
      "Retail. Construction. Energy. One group.": "Perakende. İnşaat. Enerji. Tek grup.",
      "From the group's homepage": "Grubun ana sayfasından",
      "A corporate website that speaks for three companies at once, and stays calm while it does.": "Aynı anda üç şirket adına konuşan ve bunu yaparken sakin kalan bir kurumsal site.",
      "A page for each company": "Her şirkete bir sayfa",
      "Larisel Park, Larisel İnşaat and Larisel Enerji, each with its own story and colour.": "Larisel Park, Larisel İnşaat ve Larisel Enerji; her biri kendi hikâyesi ve rengiyle.",
      "Three languages": "Üç dil",
      "Turkish, English and Russian from a single set of pages.": "Tek sayfa setinden Türkçe, İngilizce ve Rusça.",
      "The building, in 3D": "Bina, 3B olarak",
      "The construction page shows the group's project as a model you can turn.": "İnşaat sayfası grubun projesini çevrilebilen bir model olarak gösterir.",
      "Visit the group": "Grubu ziyaret et",
      "The corporate site, recorded": "Kurumsal site, kayıttan",
      "Scrolling the group's homepage: the relief behind the type, the flagship project, the sectors.": "Grubun ana sayfasında geziniyoruz: yazının ardındaki kabartma, amiral proje, sektörler.",
      "The order bot": "Sipariş botu",
      "05 — Order bot": "05 — Sipariş botu",
      "An order arrives": "Sipariş,",
      "the moment it is placed.": "verildiği an gelir.",
      "The shop's Telegram bot takes the order, checks every step and sends it to the workshop — the phone on the desk is where it lands.": "Mağazanın Telegram botu siparişi alır, her adımı kontrol eder ve atölyeye gönderir — masadaki telefon, siparişin düştüğü yer.",
      "Larisel Order Bot": "Larisel Sipariş Botu",
      "Choose, confirm, done — inside Telegram.": "Seç, onayla, bitti — Telegram'ın içinde.",
      "What the shop's customers see": "Mağazanın müşterilerinin gördüğü",
      "A Telegram bot that carries a catalogue, a cart and a five-step checkout, with an admin panel and an Excel export behind it.": "Katalog, sepet ve beş adımlı ödeme taşıyan bir Telegram botu; arkasında yönetim paneli ve Excel dışa aktarımı.",
      "Order in a chat": "Sohbette sipariş",
      "No app to install: the customer orders where they already talk.": "Kurulacak uygulama yok: müşteri zaten konuştuğu yerden sipariş verir.",
      "Nothing gets lost": "Hiçbir şey kaybolmaz",
      "Every step is checked and saved; an order is never half-taken.": "Her adım kontrol edilir ve kaydedilir; hiçbir sipariş yarım kalmaz.",
      "The shop sees it all": "Mağaza her şeyi görür",
      "An admin panel for the day's orders, and Excel when the accountant asks.": "Günün siparişleri için yönetim paneli, muhasebeci isteyince de Excel.",
      "See the code": "Kodu gör",
      "A demo of the order bot": "Sipariş botunun demosu",
      "Tap the answers — this is the bot's real flow, played here. Nothing is sent.": "Cevaplara dokunun — bu, botun gerçek akışı; burada oynatılıyor. Hiçbir şey gönderilmez.",
      "Hello! I take orders for the Larisel workshop. Shall we build your armchair?": "Merhaba! Larisel atölyesinin siparişlerini alıyorum. Koltuğunu birlikte kuralım mı?",
      "First, the fabric:": "Önce kumaş:",
      "Now the frame:": "Şimdi iskelet:",
      "And the size?": "Boyut?",
      "Your order": "Siparişin",
      "Made to order in 14 days": "14 günde siparişe göre üretilir",
      "Confirm the order": "Siparişi onayla",
      "Start again": "Baştan başla",
      "Done — order": "Tamam — sipariş",
      "is with the workshop. You will get a message here when it ships.": "atölyeye iletildi. Kargoya verildiğinde buradan mesaj gelecek.",
      "The shop sees the same order in its admin panel, and can export the day's orders to Excel.": "Mağaza aynı siparişi yönetim panelinde görür, günün siparişlerini Excel'e aktarabilir.",
      "Order another": "Bir tane daha sipariş et",
      "Sand": "Kum",
      "Graphite": "Grafit",
      "Terracotta": "Terakota",
      "Oak": "Meşe",
      "Walnut": "Ceviz",
      "Brass": "Pirinç",
      "Standard": "Standart",
      "XL": "XL",
      "How we work": "Nasıl çalışıyoruz",
      "From a call to a site": "Bir görüşmeden",
      "you can scroll.": "kaydırılan bir siteye.",
      "A short call": "Kısa bir görüşme",
      "Fifteen minutes about the product, the audience and the deadline.": "Ürün, hedef kitle ve teslim tarihi üzerine on beş dakika.",
      "The first frame": "İlk kare",
      "Within a week you see the look — the light, the material, one shot — before anything is built.": "Bir hafta içinde görünümü görürsünüz — ışık, malzeme, tek bir çekim — daha hiçbir şey kurulmadan.",
      "Built on your phone": "Telefonunuzda kurulur",
      "You follow a live link as it grows, and judge it on your own screen.": "Büyüdükçe canlı bir linkten izler, kendi ekranınızda değerlendirirsiniz.",
      "Live, and yours": "Yayında ve sizin",
      "Launched on your domain, with the source code handed over.": "Kendi alan adınızda yayına alınır, kaynak kodu size teslim edilir.",
      "Start a project": "Proje başlat",
      "What do you need?": "Neye ihtiyacınız var?",
      "A website with a film": "Filmli bir web sitesi",
      "A product configurator": "Ürün yapılandırıcı",
      "A corporate website": "Kurumsal web sitesi",
      "A Telegram bot": "Telegram botu",
      "For what kind of business?": "Ne tür bir işletme için?",
      "Café or restaurant": "Kafe ya da restoran",
      "Furniture or interiors": "Mobilya ya da iç mekân",
      "Real estate or construction": "Gayrimenkul ya da inşaat",
      "Something else": "Başka bir şey",
      "Languages": "Diller",
      "One": "Bir",
      "Two": "İki",
      "Three": "Üç",
      "When?": "Ne zaman?",
      "Within a month": "Bir ay içinde",
      "In two or three months": "İki üç ay içinde",
      "No fixed date": "Belli bir tarih yok",
      "Budget": "Bütçe",
      "Still deciding": "Henüz karar vermedim",
      "Up to $3,000": "3.000 $'a kadar",
      "$3,000 – $10,000": "3.000 – 10.000 $",
      "Above $10,000": "10.000 $ üstü",
      "Anything else?": "Eklemek istediğiniz bir şey?",
      "(optional)": "(isteğe bağlı)",
      "A link, a deadline, a reference you like": "Bir link, bir tarih, beğendiğiniz bir örnek",
      "Your brief": "Brifiniz",
      "Send on WhatsApp": "WhatsApp ile gönder",
      "E-mail": "E-posta",
      "Copied — paste it into the chat.": "Kopyalandı — sohbete yapıştırın.",
      "We answer within a day — with a price.": "Bir gün içinde dönüyoruz — fiyatıyla birlikte.",
      "Hello Larisel, a new project:": "Merhaba Larisel, yeni bir proje:",
      "What": "Ne",
      "For": "Kimin için",
      "When": "Ne zaman",
      "Notes": "Notlar",
      "A new project": "Yeni bir proje",
      "One website for a group of three companies — clear to a customer, an investor and a job seeker alike.": "Üç şirketlik bir grup için tek web sitesi — müşteri, yatırımcı ve iş arayan için aynı ölçüde anlaşılır.",
      "$1,000 – $3,000": "1.000 – 3.000 $",
      "$3,000 – $5,000": "3.000 – 5.000 $",
      "Above $5,000": "5.000 $ üstü",
      "bot": "bot"
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
      "Larisel — the studio's film": "Larisel — фильм студии",
      "Larisel — 3D & web studio": "Larisel — студия 3D и веба",
      "We turn your product": "Ваш продукт —",
      "into a film you scroll": "фильм при прокрутке",
      "and": "и",
      "3D you can turn.": "3D в ваших руках.",
      "Websites for cafés, furniture and interiors — rendered in Blender, built in three.js, and they open on a phone.": "Сайты для кофеен, мебели и интерьеров — рендер в Blender, код на three.js, и всё открывается на телефоне.",
      "Larisel Café.": "Larisel Café.",
      "A café you order from.": "Здесь можно заказать.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Эта глава — фильм самой кофейни, он идёт с её сайта: кофе наливают, надевают крышку, и стакан становится живым — ниже.",
      "Film chapters": "Главы фильма",
      "01 Café": "01 Кафе",
      "02 Armchair": "02 Кресло",
      "03 Interiors": "03 Интерьер",
      "04 Corporate site": "04 Корпоративный сайт",
      "05 Order bot": "05 Бот заказов",
      "Skip the film": "Пропустить фильм",
      "Scroll": "Листайте",
      "Larisel Café": "Larisel Café",
      "Lid": "Крышка",
      "Sleeve": "Манжета",
      "02 — Product configurator": "02 — Конфигуратор товара",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Следующая глава фильма — ткань, каркас и цена меняются, пока вы собираете кресло, — в производстве.",
      "Tell us what you want to build.": "Расскажите, что хотите сделать.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Опишите идею в паре предложений. Честно скажем, подходит ли она нам, что примерно потребуется и сколько это будет стоить — до того, как вы что-то решите.",
      "3D & web studio · Moscow · Türkiye": "студия 3D и веба · Москва · Турция",
      "01 — Café": "01 — Кофейня",
      "Pick a coffee, design the cup.": "Кофе на выбор, стакан — ваш.",
      "From the café's homepage": "С главной страницы кофейни",
      "A café website that guests use the way they use the counter — and then a little more.": "Сайт кофейни, которым гости пользуются как стойкой, — и даже немного больше.",
      "Design the cup": "Оформите стакан",
      "Choose the drink, then the cup's colour, sleeve and lid — and see your name printed on it.": "Выберите напиток, затем цвет стакана, манжету и крышку — и увидите на нём своё имя.",
      "Order from the table": "Заказ со стола",
      "Scan the code on the table, order, and split the bill with friends.": "Отсканируйте код на столе, закажите и разделите счёт с друзьями.",
      "A coffee reading": "Гадание на кофе",
      "Send a photo of the empty cup and read what the grounds say.": "Пришлите фото пустой чашки и прочитайте, что говорит гуща.",
      "Visit the café": "Открыть кофейню",
      "Pick the lid — the clear one shows your coffee.": "Выберите крышку — прозрачная покажет кофе.",
      "Your name": "Ваше имя",
      "Printed on the cup as you type it.": "Печатается на стакане, пока вы его вводите.",
      "Kraft, linen, copper, cork — seven to choose from.": "Крафт, лён, медь, пробка — на выбор семь.",
      "Turn it": "Поверните",
      "Drag the cup — it is real 3D, not a photo.": "Потяните стакан — это настоящее 3D, а не фото.",
      "The café site, recorded": "Сайт кофейни, запись",
      "On the site": "На сайте",
      "A guest designs a cup: ink blue, a copper sleeve, and her name.": "Гостья оформляет стакан: чернильно-синий, медная манжета и её имя.",
      "The armchair": "Кресло",
      "02 — Armchair": "02 — Кресло",
      "Larisel Armchair.": "Кресло Larisel.",
      "Built on screen.": "Собирается на экране.",
      "A furniture shop's product page where the customer puts the chair together — and sees it before it is made.": "Страница мебельного магазина, где покупатель сам собирает кресло — и видит его до того, как его сделают.",
      "Fabric and frame": "Ткань и каркас",
      "One tap,": "Одно касание —",
      "a different chair.": "и другое кресло.",
      "Sand to graphite to terracotta, oak to brass to walnut. On the shop's page the chair changes the moment the customer chooses.": "Песок, графит, терракота; дуб, латунь, орех. На странице магазина кресло меняется в ту же секунду, как покупатель выбирает.",
      "Larisel Armchair": "Кресло Larisel",
      "Build the chair for your own room — the model and the price change as you go.": "Соберите кресло под свой интерьер — модель и цена меняются сразу.",
      "From the shop's product page": "Со страницы товара в магазине",
      "A furniture product page that sells by letting the customer build the chair.": "Страница товара, которая продаёт, позволяя покупателю самому собрать кресло.",
      "Pick the fabric": "Выберите ткань",
      "Twelve colours, and six ready pairings of chair, cushion and frame.": "Двенадцать цветов и шесть готовых сочетаний кресла, подушки и каркаса.",
      "Pick the frame and the size": "Выберите каркас и размер",
      "Four woods and four metals, from bleached oak to brass; standard or XL.": "Четыре породы дерева и четыре металла, от беленого дуба до латуни; стандарт или XL.",
      "See the price, then order": "Узнайте цену и закажите",
      "The total follows every choice, and one tap sends the build to the workshop.": "Итог меняется с каждым выбором, и одно касание отправляет заказ в мастерскую.",
      "Build an armchair": "Собрать кресло",
      "Price": "Цена",
      "Changes with every choice.": "Меняется с каждым выбором.",
      "Frame": "Каркас",
      "Four woods, four metals.": "Четыре дерева, четыре металла.",
      "Fabric": "Ткань",
      "Twelve colours to choose from.": "Двенадцать цветов на выбор.",
      "Size": "Размер",
      "Standard or XL.": "Стандарт или XL.",
      "The armchair site, recorded": "Сайт кресла, запись",
      "The customer tries ready pairings, then a frame and a colour of their own — the chair and its price change with every tap.": "Клиент пробует готовые сочетания, потом сам выбирает каркас и цвет — кресло и цена меняются с каждым нажатием.",
      "The next chapter is being filmed: the room around this chair, a kitchen from morning to evening.": "Следующая глава снимается: комната вокруг этого кресла, кухня с утра до вечера.",
      "The interior": "Интерьер",
      "03 — Interiors": "03 — Интерьеры",
      "Larisel Interiors.": "Интерьеры Larisel.",
      "The client chooses the room.": "Интерьер выбирает клиент.",
      "A tool for kitchen and interior studios: floor, worktop, fronts and wall colour, changed live while the client stands in the room.": "Инструмент для кухонных и интерьерных студий: пол, столешница, фасады и цвет стен меняются вживую, пока клиент стоит в комнате.",
      "Afternoon to evening": "С полудня до вечера",
      "The same kitchen,": "Та же кухня",
      "after sunset.": "после заката.",
      "One switch shows the materials under evening light — before a single panel is ordered.": "Один переключатель показывает материалы при вечернем свете — ещё до заказа первой панели.",
      "Larisel Interiors": "Интерьеры Larisel",
      "Let the client choose the room.": "Пусть клиент соберёт интерьер сам.",
      "From the configurator's homepage": "С главной страницы конфигуратора",
      "Instead of sending renders back and forth, the studio sends one link — and the client arrives at the meeting having decided.": "Вместо бесконечных рендеров студия отправляет одну ссылку — и клиент приходит на встречу, уже решив.",
      "Try the materials": "Пробуйте материалы",
      "Six floors, six worktops, eight cabinet fronts and eight wall colours.": "Шесть полов, шесть столешниц, восемь фасадов и восемь цветов стен.",
      "See it day and night": "Днём и вечером",
      "The same kitchen in daylight and with the lamps on.": "Та же кухня при дневном свете и с включёнными лампами.",
      "Open it anywhere": "Открывается везде",
      "It runs in the browser, on a phone too; nothing to install.": "Работает в браузере, и на телефоне тоже; ничего не нужно устанавливать.",
      "Open the room": "Открыть комнату",
      "Light": "Свет",
      "Daylight or evening, one switch.": "День или вечер — одним переключателем.",
      "Worktop": "Столешница",
      "Marble, granite, oak and more.": "Мрамор, гранит, дуб и не только.",
      "Fronts": "Фасады",
      "Eight finishes, gloss or matt.": "Восемь отделок, глянец или мат.",
      "The interior site, recorded": "Сайт интерьера, запись",
      "The client tries a walnut floor, a Calacatta worktop and ink-blue fronts — then switches to evening.": "Клиент пробует пол из ореха, столешницу калакатта и тёмно-синие фасады — и переключает на вечер.",
      "The corporate site": "Корпоративный сайт",
      "04 — Corporate site": "04 — Корпоративный сайт",
      "Larisel Group.": "Larisel Group.",
      "Three sectors, one address.": "Три отрасли, один адрес.",
      "The website of a group working in retail, construction and energy — one set of pages, three languages.": "Сайт группы, работающей в рознице, строительстве и энергетике, — один набор страниц, три языка.",
      "Larisel Group": "Larisel Group",
      "Retail. Construction. Energy. One group.": "Ритейл. Строительство. Энергетика. Одна группа.",
      "From the group's homepage": "С главной страницы группы",
      "A corporate website that speaks for three companies at once, and stays calm while it does.": "Корпоративный сайт, который говорит сразу за три компании и остаётся спокойным.",
      "A page for each company": "Своя страница у каждой компании",
      "Larisel Park, Larisel İnşaat and Larisel Enerji, each with its own story and colour.": "Larisel Park, Larisel İnşaat и Larisel Enerji — у каждой своя история и свой цвет.",
      "Three languages": "Три языка",
      "Turkish, English and Russian from a single set of pages.": "Турецкий, английский и русский из одного набора страниц.",
      "The building, in 3D": "Здание в 3D",
      "The construction page shows the group's project as a model you can turn.": "Страница строительства показывает проект группы как модель, которую можно вращать.",
      "Visit the group": "Открыть сайт группы",
      "The corporate site, recorded": "Корпоративный сайт, запись",
      "Scrolling the group's homepage: the relief behind the type, the flagship project, the sectors.": "Листаем главную страницу группы: рельеф за текстом, флагманский проект, направления.",
      "The order bot": "Бот заказов",
      "05 — Order bot": "05 — Бот заказов",
      "An order arrives": "Заказ приходит",
      "the moment it is placed.": "в ту же секунду.",
      "The shop's Telegram bot takes the order, checks every step and sends it to the workshop — the phone on the desk is where it lands.": "Telegram-бот магазина принимает заказ, проверяет каждый шаг и отправляет его в мастерскую — телефон на столе и есть место, куда он приходит.",
      "Larisel Order Bot": "Бот заказов Larisel",
      "Choose, confirm, done — inside Telegram.": "Выбрать, подтвердить, готово — прямо в Telegram.",
      "What the shop's customers see": "Что видят покупатели магазина",
      "A Telegram bot that carries a catalogue, a cart and a five-step checkout, with an admin panel and an Excel export behind it.": "Telegram-бот с каталогом, корзиной и оформлением в пять шагов, а за ним — админ-панель и выгрузка в Excel.",
      "Order in a chat": "Заказ в чате",
      "No app to install: the customer orders where they already talk.": "Ничего не нужно ставить: покупатель заказывает там, где и так общается.",
      "Nothing gets lost": "Ничего не теряется",
      "Every step is checked and saved; an order is never half-taken.": "Каждый шаг проверяется и сохраняется; заказ не остаётся недооформленным.",
      "The shop sees it all": "Магазин видит всё",
      "An admin panel for the day's orders, and Excel when the accountant asks.": "Админ-панель с заказами за день и Excel, когда спросит бухгалтер.",
      "See the code": "Посмотреть код",
      "A demo of the order bot": "Демо бота заказов",
      "Tap the answers — this is the bot's real flow, played here. Nothing is sent.": "Нажимайте на ответы — это настоящий сценарий бота, воспроизведённый здесь. Ничего не отправляется.",
      "Hello! I take orders for the Larisel workshop. Shall we build your armchair?": "Здравствуйте! Я принимаю заказы мастерской Larisel. Соберём ваше кресло?",
      "First, the fabric:": "Сначала ткань:",
      "Now the frame:": "Теперь каркас:",
      "And the size?": "А размер?",
      "Your order": "Ваш заказ",
      "Made to order in 14 days": "Изготовим за 14 дней",
      "Confirm the order": "Подтвердить заказ",
      "Start again": "Начать заново",
      "Done — order": "Готово — заказ",
      "is with the workshop. You will get a message here when it ships.": "передан в мастерскую. Когда отправим, придёт сообщение сюда.",
      "The shop sees the same order in its admin panel, and can export the day's orders to Excel.": "Магазин видит этот же заказ в админ-панели и может выгрузить заказы за день в Excel.",
      "Order another": "Заказать ещё",
      "Sand": "Песочный",
      "Graphite": "Графит",
      "Terracotta": "Терракота",
      "Oak": "Дуб",
      "Walnut": "Орех",
      "Brass": "Латунь",
      "Standard": "Стандарт",
      "XL": "XL",
      "How we work": "Как мы работаем",
      "From a call to a site": "От звонка до сайта,",
      "you can scroll.": "который листают.",
      "A short call": "Короткий звонок",
      "Fifteen minutes about the product, the audience and the deadline.": "Пятнадцать минут о продукте, аудитории и сроках.",
      "The first frame": "Первый кадр",
      "Within a week you see the look — the light, the material, one shot — before anything is built.": "Через неделю вы видите облик — свет, материал, один кадр — ещё до того, как что-то построено.",
      "Built on your phone": "Собирается у вас на телефоне",
      "You follow a live link as it grows, and judge it on your own screen.": "Вы следите за живой ссылкой и оцениваете результат на своём экране.",
      "Live, and yours": "В сети — и ваш",
      "Launched on your domain, with the source code handed over.": "Запускаем на вашем домене и передаём исходный код.",
      "Start a project": "Начать проект",
      "What do you need?": "Что вам нужно?",
      "A website with a film": "Сайт с фильмом",
      "A product configurator": "Конфигуратор товара",
      "A corporate website": "Корпоративный сайт",
      "A Telegram bot": "Telegram-бот",
      "For what kind of business?": "Для какого бизнеса?",
      "Café or restaurant": "Кафе или ресторан",
      "Furniture or interiors": "Мебель или интерьеры",
      "Real estate or construction": "Недвижимость или строительство",
      "Something else": "Другое",
      "Languages": "Языки",
      "One": "Один",
      "Two": "Два",
      "Three": "Три",
      "When?": "Когда?",
      "Within a month": "В течение месяца",
      "In two or three months": "Через два-три месяца",
      "No fixed date": "Без жёстких сроков",
      "Budget": "Бюджет",
      "Still deciding": "Ещё решаю",
      "Up to $3,000": "До $3 000",
      "$3,000 – $10,000": "$3 000 – $10 000",
      "Above $10,000": "Больше $10 000",
      "Anything else?": "Что-то ещё?",
      "(optional)": "(необязательно)",
      "A link, a deadline, a reference you like": "Ссылка, срок, пример, который нравится",
      "Your brief": "Ваш бриф",
      "Send on WhatsApp": "Отправить в WhatsApp",
      "E-mail": "Почта",
      "Copied — paste it into the chat.": "Скопировано — вставьте в чат.",
      "We answer within a day — with a price.": "Ответим в течение дня — с ценой.",
      "Hello Larisel, a new project:": "Здравствуйте, Larisel! Новый проект:",
      "What": "Что",
      "For": "Для кого",
      "When": "Когда",
      "Notes": "Заметки",
      "A new project": "Новый проект",
      "One website for a group of three companies — clear to a customer, an investor and a job seeker alike.": "Один сайт для группы из трёх компаний — одинаково понятный клиенту, инвестору и соискателю.",
      "$1,000 – $3,000": "$1 000 – $3 000",
      "$3,000 – $5,000": "$3 000 – $5 000",
      "Above $5,000": "Больше $5 000",
      "bot": "бот"
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
