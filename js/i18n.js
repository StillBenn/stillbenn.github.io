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
      "About": "Hakkımızda",
      "A patient finds": "Hasta doğru hekimi",
      "the right doctor.": "bir dakikada bulur.",
      "A private hospital's website: say where it hurts, find the doctor, ask for an appointment — in a minute.": "Özel bir hastanenin web sitesi: nerenizin ağrıdığını yazın, hekimi bulun, randevu talep edin — bir dakikada.",
      "Out of the die, into the oil.": "Kalıptan çıkar, yağa düşer.",
      "A pasta-chips brand's website. Its film follows the snack from durum wheat to its seasoning — it plays as you scroll.": "Bir makarna cipsi markasının web sitesi. Filmi, atıştırmalığı durum buğdayından çeşnisine kadar izliyor — kaydırdıkça oynar.",
      "Golden in the oil": "Yağda altın rengi",
      "Heat puffs it up,": "Isıyla kabarır,",
      "the seasoning finishes it.": "çeşniyle tamamlanır.",
      "Four flavours — each with a page of its own on the site.": "Dört aroma — her birinin sitede kendi sayfası var.",
      "The four flavours, each opening a page of its own, and the koala dressed in each one's colour.": "Dört aroma, her biri kendi sayfasını açar; koala da her birinin rengine bürünür.",
      "Kıtlax, the snack brand": "Kıtlax, atıştırmalık markası",
      "— Snack brand": "— Atıştırmalık markası",
      "Poured, sealed, on the shelf.": "Döküldü, mühürlendi, rafta.",
      "A macaroni-crisp brand's website. Its film shows how the snack is made, from durum wheat to the sealed bag.": "Bir makarna cipsi markasının web sitesi. Filmi, atıştırmalığın durum buğdayından mühürlü poşete nasıl yapıldığını gösteriyor.",
      "Four flavours": "Dört aroma",
      "Four shapes,": "Dört şekil,",
      "four flavours.": "dört aroma.",
      "The film ends where the shop begins: every bag opens a page of its own.": "Film, satışın başladığı yerde biter: her poşet kendi sayfasını açar.",
      "Pasta at its crispiest.": "Makarnanın en çıtır hali.",
      "From the brand's homepage": "Markanın ana sayfasından",
      "A client project: a pasta-chips brand's new website — the snack's whole journey from wheat to sealed bag told as one cinematic film, and every flavour a tap away from its online shop.": "Müşteri projesi: bir makarna cipsi markasının yeni yüzü — buğdaydan mühürlü poşete bütün yolculuk tek bir sinematik filmde, her aroma online mağazasına bir dokunuş uzaklıkta.",
      "A film of the making": "Üretimin filmi",
      "From the wheat field to the sealed bag — the mill, the bronze die, the fryer, the seasoning — one continuous film that moves with the visitor's scroll.": "Buğday tarlasından mühürlü poşete — değirmen, bronz kalıp, kızartma, çeşni — ziyaretçinin kaydırmasıyla akan, kesintisiz tek bir film.",
      "A stage for every flavour": "Her aromaya bir sahne",
      "Four flavours, each with a page of its own: its colours, its ingredient and its full product sheet.": "Dört aroma; her birinin kendi renkleri, malzemesi ve eksiksiz ürün bilgileriyle ayrı bir sayfası.",
      "The Kıtlax site, recorded": "Kıtlax sitesi, kayıttan",
      "The film down to the sealed bag, then the four flavours, and the koala dressed in each one's colour.": "Film mühürlü poşete kadar; ardından dört aroma ve her birinin rengine bürünen koala.",
      "In four languages, straight to the shop": "Dört dilde, doğrudan mağazaya",
      "Turkish, English, Arabic and Spanish — and every flavour one tap from the brand's online shop.": "Türkçe, İngilizce, Arapça ve İspanyolca — her aroma, markanın online mağazasına bir dokunuş uzaklıkta.",
      "Hospital": "Hastane",
      "— Hospital": "— Hastane",
      "Emek Hospital": "Emek Hastanesi",
      "Health takes effort.": "Sağlık emek ister.",
      "From the hospital's homepage": "Hastanenin ana sayfasından",
      "A client project: a private hospital's website, in three languages, where a patient finds the right doctor and requests an appointment within a minute.": "Müşteri projesi: hastanın doğru hekimi bulup bir dakika içinde randevu talep ettiği, üç dilli bir özel hastane sitesi.",
      "Search that understands complaints": "Şikâyeti anlayan arama",
      "A patient types a complaint, a department or a doctor's name — the answer takes shape with every letter.": "Hasta bir şikâyet, bölüm ya da hekim adı yazar — cevap her harfle şekillenir.",
      "Appointments without the phone queue": "Telefon kuyruğu olmadan randevu",
      "Department, doctor, day — the request lands straight in the call centre, which calls back to confirm.": "Bölüm, hekim, gün — talep doğrudan çağrı merkezine düşer; hasta aranır, randevu kesinleşir.",
      "The hospital in command": "Kontrol hastanede",
      "A control panel of its own: staff follow every request and update doctors and pages themselves, without waiting on anyone.": "Hastaneye özel yönetim paneli: personel her talebi takip eder, hekimleri ve sayfaları kimseyi beklemeden kendisi günceller.",
      "The hospital site, recorded": "Hastane sitesi, kayıttan",
      "A complaint typed into the search — it finds the department and the doctor — then the departments, the doctors and the hospital in numbers.": "Aramaya bir şikâyet yazılır — bölümü ve hekimi bulur — ardından bölümler, hekimler ve rakamlarla hastane.",
      "Websites for cafés, furniture and interiors — films you scroll, 3D you can turn, and they open on a phone.": "Kafeler, mobilya ve iç mekân firmaları için web siteleri — kaydırdıkça oynayan filmler, çevrilebilen 3B, ve telefonda açılır.",
      "Project details": "Proje detayları",
      "in one place.": "tek yerde.",
      "Let's talk about": "Sitenizi",
      "your site.": "konuşalım.",
      "Pick what you need — your message is written for you. Send it by e-mail, WhatsApp or Telegram, and we will get back to you.": "İhtiyacınızı seçin — mesajınız sizin için yazılır. E‑posta, WhatsApp ya da Telegram'dan gönderin, size dönelim.",
      "Your project": "Projeniz",
      "Larisel — Films you scroll, 3D you can turn": "Larisel — Kaydırılan filmler, çevrilebilen 3B",
      "Larisel is a 3D and web studio. We turn products into films you scroll and 3D models you can turn — websites that open on a phone.": "Larisel bir 3B ve web stüdyosu. Ürünleri kaydırdıkça oynayan filmlere ve elle çevrilen 3B modellere dönüştürüyoruz — telefonda da açılan web siteleri.",
      "Skip to the work": "İşlere geç",
      "Larisel — home": "Larisel — ana sayfa",
      "Primary": "Ana menü",
      "Chapters": "Bölümler",
      "Work": "İşler",
      "Projects": "Projelerimiz",
      "Process": "Süreç",
      "Contact": "İletişim",
      "Language": "Dil",
      "Larisel — the studio's film": "Larisel — stüdyonun filmi",
      "Larisel — 3D & web studio": "Larisel — 3B ve web stüdyosu",
      "We turn your product": "Ürününüz:",
      "into a film you scroll": "kaydırdıkça oynayan film",
      "and": "ve",
      "3D you can turn.": "elinizde dönen 3B.",
      "Larisel Café.": "Larisel Kafe.",
      "A café you order from.": "Buradan sipariş verilir.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Bu bölüm kafenin kendi filmi ve kendi sitesinden oynuyor: kahve dökülür, kapak takılır, bardak aşağıdaki canlı bardağa dönüşür.",
      "Film chapters": "Film bölümleri",
      "Café": "Kafe",
      "Armchair": "Koltuk",
      "Furniture": "Mobilya",
      "Interiors": "İç mekân",
      "Corporate site": "Kurumsal site",
      "Order bot": "Sipariş botu",
      "Skip the film": "Filmi geç",
      "Scroll": "Kaydır",
      "Larisel Café": "Larisel Kafe",
      "Lid": "Kapak",
      "Sleeve": "Manşon",
      "02 — Product configurator": "02 — Ürün yapılandırıcı",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Filmin sonraki bölümü — siz koltuğu kurarken değişen kumaş, iskelet ve fiyat — yapım aşamasında.",
      "Tell us what you want to build.": "Ne yapmak istediğinizi anlatın.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Fikrinizi iki cümleyle yazın. Size uyup uymadığını, kabaca ne gerektirdiğini ve ne tutacağını — siz hiçbir şeye bağlanmadan — dürüstçe söyleriz.",
      "3D & web studio": "3B ve web stüdyosu",
      "— Café": "— Kafe",
      "Pick a coffee, design the cup.": "Kahveni seç, bardağı tasarla.",
      "From the café's homepage": "Kafenin ana sayfasından",
      "A café website that does everything the counter does — and a few things no counter can.": "Tezgâhın yaptığı her şeyi — ve hiçbir tezgâhın yapamayacağı birkaç şeyi daha — yapan bir kafe sitesi.",
      "A cup with their name on it": "Üstünde adı yazan bardak",
      "Drink, cup colour, sleeve and lid — chosen in seconds, with the guest's own name printed live on the cup.": "İçecek, bardak rengi, manşon ve kapak saniyeler içinde seçilir; misafirin adı anında bardağa basılır.",
      "Ordering from the table": "Masadan sipariş",
      "One scan of the table's code: the order goes in and the bill splits between friends — all from the seat.": "Masadaki kod bir kez okutulur: sipariş verilir, hesap arkadaşlar arasında bölünür — hepsi oturulan yerden.",
      "A coffee reading": "Kahve falı",
      "A photo of the empty cup, and a detailed reading of what the grounds have to say — the ritual guests come back for.": "Boş fincanın tek bir fotoğrafı ve telvenin anlattıklarının ayrıntılı yorumu — misafiri yeniden getiren ritüel.",
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
      "— Furniture": "— Mobilya",
      "Larisel Furniture.": "Larisel Mobilya.",
      "Built on screen.": "Ekranda kuruluyor.",
      "A furniture shop's page where the customer designs the sofa, the armchair or the coffee table — and sees it before it is made.": "Müşterinin kanepeyi, koltuğu ya da sehpayı kendisinin tasarladığı bir mobilya sayfası — üstelik yapılmadan önce görüyor.",
      "Fabric and frame": "Kumaş ve iskelet",
      "One tap,": "Bir dokunuş,",
      "a different chair.": "başka bir koltuk.",
      "Sand to graphite to terracotta, oak to brass to walnut. On the shop's page the chair changes the moment the customer chooses.": "Kumdan grafite, terakotaya; meşeden pirince, cevize. Mağazanın sayfasında koltuk, müşteri seçtiği an değişir.",
      "Larisel Armchair": "Larisel Koltuk",
      "Larisel Furniture": "Larisel Mobilya",
      "Two seats, three, or a corner with a chaise — in bouclé, velvet or linen, on the legs you choose.": "İkili, üçlü ya da şezlonglu köşe — bukle, kadife ya da keten, seçtiğiniz ayaklarla.",
      "From the shop's product page": "Mağazanın ürün sayfasından",
      "A furniture shop where every customer designs their own sofa, armchair or coffee table — and orders exactly what they saw.": "Her müşterinin kendi kanepesini, koltuğunu ya da sehpasını tasarladığı — ve tam olarak gördüğünü sipariş ettiği bir mobilya mağazası.",
      "Every shape, one screen": "Her form tek ekranda",
      "An armchair in two sizes; a sofa with two seats, three or a chaise; a round, oval or long table — switched in a tap.": "İki ölçüde koltuk; ikili, üçlü ya da şezlonglu kanepe; yuvarlak, oval ya da uzun sehpa — tek dokunuşla değişir.",
      "Materials you can almost touch": "Neredeyse dokunulan malzemeler",
      "Bouclé, velvet and linen in eight tones each; marble, travertine and solid wood — seen up close, with curated pairings that dress the whole piece at once.": "Her birinde sekiz tonla bukle, kadife ve keten; mermer, traverten ve masif ahşap — yakından görülür, özenle seçilmiş kombinler mobilyayı tek seferde giydirir.",
      "A complete shop around it": "Etrafında eksiksiz bir mağaza",
      "Dimensions drawn on the piece and two designs side by side — then cart, delivery, instalments, order tracking and a material library.": "Ölçüler mobilyanın üzerinde, iki tasarım yan yana — ardından sepet, teslimat, taksit, sipariş takibi ve malzeme kütüphanesi.",
      "Design your furniture": "Mobilyanı tasarla",
      "Price": "Fiyat",
      "Changes with every choice.": "Her seçimle değişir.",
      "Frame": "İskelet",
      "Four woods, four metals.": "Dört ahşap, dört metal.",
      "Fabric": "Kumaş",
      "Twelve colours to choose from.": "On iki renk seçeneği.",
      "Size": "Boyut",
      "Standard or XL.": "Standart ya da XL.",
      "The furniture site, recorded": "Mobilya sitesi, kayıttan",
      "The customer turns the sofa, tries ready pairings, then a cloth and a tone of their own — the sofa and its price change with every tap.": "Müşteri kanepeyi çeviriyor, hazır kombinleri deniyor, sonra kumaşı ve tonu kendisi seçiyor — kanepe de fiyatı da her dokunuşta değişiyor.",
      "The next chapter is being filmed: the room around this chair, a kitchen from morning to evening.": "Sonraki bölüm çekiliyor: bu koltuğun etrafındaki oda, sabahtan akşama bir mutfak.",
      "The interior": "İç mekân",
      "— Interiors": "— İç mekân",
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
      "One link puts the whole kitchen in the client's hands — and the client walks into the meeting already decided.": "Tek bir link bütün mutfağı müşterinin eline verir — müşteri toplantıya kararını vermiş olarak gelir.",
      "The whole room in their hands": "Bütün oda müşterinin elinde",
      "Six floors, six worktops, eight cabinet fronts and eight wall colours — every combination one tap away.": "Altı zemin, altı tezgâh, sekiz dolap kapağı ve sekiz duvar rengi — her kombinasyon bir dokunuş uzağında.",
      "Daylight and lamplight": "Gün ışığında ve lamba ışığında",
      "The same kitchen in daylight and under its own lamps — so nothing surprises the client after installation.": "Aynı mutfak gün ışığında ve kendi lambalarının altında — kurulumdan sonra müşteriyi hiçbir sürpriz beklemez.",
      "Opens anywhere, instantly": "Her yerde, anında açılır",
      "In any browser, on any phone — nothing to install, nothing to explain.": "Her tarayıcıda, her telefonda — ne kurulacak ne de anlatılacak bir şey var.",
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
      "— Corporate site": "— Kurumsal site",
      "Larisel Group.": "Larisel Group.",
      "Three sectors, one address.": "Üç sektör, tek adres.",
      "The website of a group working in retail, construction and energy — one set of pages, three languages.": "Perakende, inşaat ve enerjide çalışan bir grubun sitesi — tek sayfa seti, üç dil.",
      "Larisel Group": "Larisel Group",
      "Retail. Construction. Energy. One group.": "Perakende. İnşaat. Enerji. Tek grup.",
      "From the group's homepage": "Grubun ana sayfasından",
      "A corporate website that speaks for three companies at once, and stays calm while it does.": "Aynı anda üç şirket adına konuşan ve bunu yaparken sakin kalan bir kurumsal site.",
      "Three companies, one identity": "Üç şirket, tek kimlik",
      "Larisel Park, Larisel İnşaat and Larisel Enerji — each with its own story and colour, inside one coherent brand.": "Larisel Park, Larisel İnşaat ve Larisel Enerji — her biri kendi hikâyesi ve rengiyle, tek ve tutarlı bir markanın içinde.",
      "Three languages, one set of pages": "Üç dil, tek sayfa seti",
      "Turkish, English and Russian — every page in every language, always in step.": "Türkçe, İngilizce ve Rusça — her sayfa her dilde, her zaman eşzamanlı.",
      "The flagship, in 3D": "Amiral proje, 3B olarak",
      "The construction page presents the group's flagship building as a model visitors turn in their own hands.": "İnşaat sayfası, grubun amiral binasını ziyaretçinin kendi elinde çevirdiği bir model olarak sunar.",
      "Visit the group": "Grubu ziyaret et",
      "The corporate site, recorded": "Kurumsal site, kayıttan",
      "Scrolling the group's homepage: the relief behind the type, the flagship project, the sectors.": "Grubun ana sayfasında geziniyoruz: yazının ardındaki kabartma, amiral proje, sektörler.",
      "The order bot": "Sipariş botu",
      "— Order bot": "— Sipariş botu",
      "An order arrives": "Sipariş,",
      "the moment it is placed.": "verildiği an gelir.",
      "The shop's Telegram bot takes the order, checks every step and sends it to the workshop — the phone on the desk is where it lands.": "Mağazanın Telegram botu siparişi alır, her adımı kontrol eder ve atölyeye gönderir — masadaki telefon, siparişin düştüğü yer.",
      "Larisel Order Bot": "Larisel Sipariş Botu",
      "Choose, confirm, done — inside Telegram.": "Seç, onayla, bitti — Telegram'ın içinde.",
      "What the shop's customers see": "Mağazanın müşterilerinin gördüğü",
      "A complete shop inside Telegram — catalogue, cart and a five-step checkout, with an admin panel and Excel export behind it.": "Telegram'ın içinde eksiksiz bir mağaza — katalog, sepet ve beş adımlı ödeme; arkasında yönetim paneli ve Excel aktarımı.",
      "Ordering, inside the chat": "Sohbetin içinde sipariş",
      "No app, no sign-up: the customer orders right where they already talk.": "Uygulama yok, üyelik yok: müşteri zaten konuştuğu yerden sipariş verir.",
      "Not a single order lost": "Tek bir sipariş bile kaybolmaz",
      "Every step is checked and saved — no order is ever left half-taken.": "Her adım kontrol edilir ve kaydedilir — hiçbir sipariş yarım kalmaz.",
      "The whole day at a glance": "Bütün gün tek bakışta",
      "An admin panel for the day's orders — and an Excel file the moment the accountant asks.": "Günün siparişleri için yönetim paneli — muhasebeci istediği an Excel dosyası.",
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
      "One website speaking for three companies — equally clear to a customer, an investor and a future employee.": "Üç şirket adına tek sesle konuşan bir web sitesi — müşteriye, yatırımcıya ve geleceğin çalışanına aynı netlikte.",
      "$1,000 – $3,000": "1.000 – 3.000 $",
      "$3,000 – $5,000": "3.000 – 5.000 $",
      "Above $5,000": "5.000 $ üstü",
      "bot": "bot",
      "Contact us": "Bizimle iletişime geçin",
      "Your brief,": "Brifiniz",
      "in a few taps.": "birkaç dokunuşta hazır.",
      "Several can be chosen": "Birden çok seçilebilir",
      "Please tell us in a few sentences what you would like.": "Lütfen birkaç cümleyle ne istediğinizi anlatın.",
      "What you do, and what you would like us to build": "Ne iş yaptığınızı ve bizden ne istediğinizi yazın",
      "Optional": "İsteğe bağlı",
      "Choose what you need first — the rest can follow.": "Önce neye ihtiyacınız olduğunu seçin — gerisi sonra da olur.",
      "Write to us.": "Bize yazın.",
      "Where would you like to write from?": "Nereden yazmak istersiniz?",
      "Opens in your browser": "Tarayıcıda açılır",
      "Mail app": "Posta uygulaması",
      "The app on this device": "Bu cihazdaki uygulama",
      "Copy": "Kopyala",
      "Copied": "Kopyalandı",
      "Close": "Kapat",
      "Your brief is already in the message.": "Brifiniz mesaja yazıldı.",
      "Visit the site": "Siteyi ziyaret edin",
      "All work": "Tüm işler",
      "Every project we have built,": "Yaptığımız bütün işler,"
    },
    "ru": {
      "About": "О нас",
      "A patient finds": "Пациент находит",
      "the right doctor.": "нужного врача.",
      "A private hospital's website: say where it hurts, find the doctor, ask for an appointment — in a minute.": "Сайт частной больницы: напишите, что беспокоит, найдите врача, запишитесь на приём — за минуту.",
      "Out of the die, into the oil.": "Из матрицы — в масло.",
      "A pasta-chips brand's website. Its film follows the snack from durum wheat to its seasoning — it plays as you scroll.": "Сайт бренда макаронных чипсов. Его фильм ведёт снек от твёрдой пшеницы до приправы — и играет, пока вы листаете.",
      "Golden in the oil": "Золотой в масле",
      "Heat puffs it up,": "Жар его раздувает,",
      "the seasoning finishes it.": "приправа завершает.",
      "Four flavours — each with a page of its own on the site.": "Четыре вкуса — у каждого своя страница на сайте.",
      "The four flavours, each opening a page of its own, and the koala dressed in each one's colour.": "Четыре вкуса — у каждого своя страница — и коала в цвете каждого из них.",
      "Kıtlax, the snack brand": "Kıtlax, бренд снеков",
      "— Snack brand": "— Бренд снеков",
      "Poured, sealed, on the shelf.": "Насыпали, запечатали — на полку.",
      "A macaroni-crisp brand's website. Its film shows how the snack is made, from durum wheat to the sealed bag.": "Сайт бренда макаронных чипсов. Его фильм показывает, как делают снек — от твёрдой пшеницы до запечатанной пачки.",
      "Four flavours": "Четыре вкуса",
      "Four shapes,": "Четыре формы,",
      "four flavours.": "четыре вкуса.",
      "The film ends where the shop begins: every bag opens a page of its own.": "Фильм заканчивается там, где начинается магазин: каждая пачка открывает свою страницу.",
      "Pasta at its crispiest.": "Макароны в самом хрустящем виде.",
      "From the brand's homepage": "С главной страницы бренда",
      "A client project: a pasta-chips brand's new website — the snack's whole journey from wheat to sealed bag told as one cinematic film, and every flavour a tap away from its online shop.": "Проект для клиента: новый сайт бренда макаронных чипсов — весь путь от пшеницы до запаянной пачки в одном кинематографичном фильме, и каждый вкус в одном касании от интернет-магазина.",
      "A film of the making": "Фильм о производстве",
      "From the wheat field to the sealed bag — the mill, the bronze die, the fryer, the seasoning — one continuous film that moves with the visitor's scroll.": "От пшеничного поля до запаянной пачки — мельница, бронзовая матрица, фритюр, приправа — один непрерывный фильм, который движется вместе с прокруткой.",
      "A stage for every flavour": "Сцена для каждого вкуса",
      "Four flavours, each with a page of its own: its colours, its ingredient and its full product sheet.": "Четыре вкуса — у каждого своя страница: свои цвета, свой ингредиент и полное описание продукта.",
      "The Kıtlax site, recorded": "Сайт Kıtlax, запись",
      "The film down to the sealed bag, then the four flavours, and the koala dressed in each one's colour.": "Фильм до запечатанной пачки, затем четыре вкуса — и коала в цвете каждого из них.",
      "In four languages, straight to the shop": "На четырёх языках — сразу в магазин",
      "Turkish, English, Arabic and Spanish — and every flavour one tap from the brand's online shop.": "Турецкий, английский, арабский и испанский — и каждый вкус в одном касании от интернет-магазина бренда.",
      "Hospital": "Больница",
      "— Hospital": "— Больница",
      "Emek Hospital": "Больница Emek",
      "Health takes effort.": "Здоровье требует труда.",
      "From the hospital's homepage": "С главной страницы больницы",
      "A client project: a private hospital's website, in three languages, where a patient finds the right doctor and requests an appointment within a minute.": "Проект для клиента: сайт частной больницы на трёх языках, где пациент за минуту находит нужного врача и оставляет заявку на приём.",
      "Search that understands complaints": "Поиск, который понимает жалобы",
      "A patient types a complaint, a department or a doctor's name — the answer takes shape with every letter.": "Пациент вводит жалобу, отделение или имя врача — ответ складывается с каждой буквой.",
      "Appointments without the phone queue": "Запись без очереди на телефоне",
      "Department, doctor, day — the request lands straight in the call centre, which calls back to confirm.": "Отделение, врач, день — заявка сразу попадает в колл-центр, оттуда перезванивают и подтверждают приём.",
      "The hospital in command": "Управление — у больницы",
      "A control panel of its own: staff follow every request and update doctors and pages themselves, without waiting on anyone.": "Собственная панель управления: сотрудники отслеживают каждую заявку и сами обновляют врачей и страницы, ни от кого не завися.",
      "The hospital site, recorded": "Сайт больницы, запись",
      "A complaint typed into the search — it finds the department and the doctor — then the departments, the doctors and the hospital in numbers.": "В поиск вводят жалобу — он находит отделение и врача, — затем отделения, врачи и больница в цифрах.",
      "Websites for cafés, furniture and interiors — films you scroll, 3D you can turn, and they open on a phone.": "Сайты для кофеен, мебели и интерьеров — фильмы, которые листают, 3D, которое вращают, и всё открывается на телефоне.",
      "Project details": "Подробнее о проекте",
      "in one place.": "в одном месте.",
      "Let's talk about": "Давайте обсудим",
      "your site.": "ваш сайт.",
      "Pick what you need — your message is written for you. Send it by e-mail, WhatsApp or Telegram, and we will get back to you.": "Выберите, что вам нужно, — сообщение составится само. Отправьте его по почте, в WhatsApp или Telegram, и мы ответим.",
      "Your project": "Ваш проект",
      "Larisel — Films you scroll, 3D you can turn": "Larisel — фильмы, которые листают, и 3D, которое вращают",
      "Larisel is a 3D and web studio. We turn products into films you scroll and 3D models you can turn — websites that open on a phone.": "Larisel — студия 3D и веба. Превращаем продукт в фильм, который идёт при прокрутке, и в 3D-модель, которую вращают рукой, — сайты, которые открываются и на телефоне.",
      "Skip to the work": "К работам",
      "Larisel — home": "Larisel — главная",
      "Primary": "Основное меню",
      "Chapters": "Главы",
      "Work": "Работы",
      "Projects": "Проекты",
      "Process": "Процесс",
      "Contact": "Контакты",
      "Language": "Язык",
      "Larisel — the studio's film": "Larisel — фильм студии",
      "Larisel — 3D & web studio": "Larisel — студия 3D и веба",
      "We turn your product": "Ваш продукт —",
      "into a film you scroll": "фильм при прокрутке",
      "and": "и",
      "3D you can turn.": "3D в ваших руках.",
      "Larisel Café.": "Larisel Café.",
      "A café you order from.": "Здесь можно заказать.",
      "This chapter is the café's own film, playing from its own site: the coffee is poured, the lid goes on, and the cup becomes the live one below.": "Эта глава — фильм самой кофейни, он идёт с её сайта: кофе наливают, надевают крышку, и стакан становится живым — ниже.",
      "Film chapters": "Главы фильма",
      "Café": "Кафе",
      "Armchair": "Кресло",
      "Furniture": "Мебель",
      "Interiors": "Интерьер",
      "Corporate site": "Корпоративный сайт",
      "Order bot": "Бот заказов",
      "Skip the film": "Пропустить фильм",
      "Scroll": "Листайте",
      "Larisel Café": "Larisel Café",
      "Lid": "Крышка",
      "Sleeve": "Манжета",
      "02 — Product configurator": "02 — Конфигуратор товара",
      "The film's next chapter — fabric, frame and price changing as you build the chair — is in production.": "Следующая глава фильма — ткань, каркас и цена меняются, пока вы собираете кресло, — в производстве.",
      "Tell us what you want to build.": "Расскажите, что хотите сделать.",
      "Send the idea in a couple of sentences. We answer honestly whether it fits, roughly what it takes and what it would cost — before you commit to anything.": "Опишите идею в паре предложений. Честно скажем, подходит ли она нам, что примерно потребуется и сколько это будет стоить — до того, как вы что-то решите.",
      "3D & web studio": "студия 3D и веба",
      "— Café": "— Кофейня",
      "Pick a coffee, design the cup.": "Кофе на выбор, стакан — ваш.",
      "From the café's homepage": "С главной страницы кофейни",
      "A café website that does everything the counter does — and a few things no counter can.": "Сайт кофейни, который делает всё, что делает стойка, — и ещё кое-что, чего не умеет ни одна стойка.",
      "A cup with their name on it": "Стакан с именем гостя",
      "Drink, cup colour, sleeve and lid — chosen in seconds, with the guest's own name printed live on the cup.": "Напиток, цвет стакана, манжета и крышка — выбор за секунды, а имя гостя тут же печатается на стакане.",
      "Ordering from the table": "Заказ прямо со стола",
      "One scan of the table's code: the order goes in and the bill splits between friends — all from the seat.": "Один скан кода на столе: заказ оформлен, счёт разделён между друзьями — не вставая с места.",
      "A coffee reading": "Гадание на кофе",
      "A photo of the empty cup, and a detailed reading of what the grounds have to say — the ritual guests come back for.": "Фото пустой чашки — и подробное толкование того, что говорит гуща. Ритуал, ради которого возвращаются.",
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
      "— Furniture": "— Мебель",
      "Larisel Furniture.": "Мебель Larisel.",
      "Built on screen.": "Собирается на экране.",
      "A furniture shop's page where the customer designs the sofa, the armchair or the coffee table — and sees it before it is made.": "Страница мебельного магазина, где покупатель сам создаёт диван, кресло или журнальный столик — и видит их до того, как их сделают.",
      "Fabric and frame": "Ткань и каркас",
      "One tap,": "Одно касание —",
      "a different chair.": "и другое кресло.",
      "Sand to graphite to terracotta, oak to brass to walnut. On the shop's page the chair changes the moment the customer chooses.": "Песок, графит, терракота; дуб, латунь, орех. На странице магазина кресло меняется в ту же секунду, как покупатель выбирает.",
      "Larisel Armchair": "Кресло Larisel",
      "Larisel Furniture": "Мебель Larisel",
      "Two seats, three, or a corner with a chaise — in bouclé, velvet or linen, on the legs you choose.": "Двухместный, трёхместный или угловой с оттоманкой — в букле, бархате или льне, на выбранных ножках.",
      "From the shop's product page": "Со страницы товара в магазине",
      "A furniture shop where every customer designs their own sofa, armchair or coffee table — and orders exactly what they saw.": "Мебельный магазин, где каждый покупатель сам создаёт свой диван, кресло или журнальный столик — и заказывает ровно то, что увидел.",
      "Every shape, one screen": "Любая форма на одном экране",
      "An armchair in two sizes; a sofa with two seats, three or a chaise; a round, oval or long table — switched in a tap.": "Кресло в двух размерах; диван двухместный, трёхместный или с оттоманкой; круглый, овальный или длинный столик — смена одним касанием.",
      "Materials you can almost touch": "Материалы, которые почти можно потрогать",
      "Bouclé, velvet and linen in eight tones each; marble, travertine and solid wood — seen up close, with curated pairings that dress the whole piece at once.": "Букле, бархат и лён по восемь оттенков; мрамор, травертин и массив — вблизи, а продуманные сочетания одевают всю вещь сразу.",
      "A complete shop around it": "Полноценный магазин вокруг",
      "Dimensions drawn on the piece and two designs side by side — then cart, delivery, instalments, order tracking and a material library.": "Размеры прямо на мебели и два варианта рядом — затем корзина, доставка, рассрочка, отслеживание заказа и библиотека материалов.",
      "Design your furniture": "Создать свою мебель",
      "Price": "Цена",
      "Changes with every choice.": "Меняется с каждым выбором.",
      "Frame": "Каркас",
      "Four woods, four metals.": "Четыре дерева, четыре металла.",
      "Fabric": "Ткань",
      "Twelve colours to choose from.": "Двенадцать цветов на выбор.",
      "Size": "Размер",
      "Standard or XL.": "Стандарт или XL.",
      "The furniture site, recorded": "Сайт мебели, запись",
      "The customer turns the sofa, tries ready pairings, then a cloth and a tone of their own — the sofa and its price change with every tap.": "Клиент поворачивает диван, пробует готовые сочетания, потом сам выбирает ткань и оттенок — диван и цена меняются с каждым нажатием.",
      "The next chapter is being filmed: the room around this chair, a kitchen from morning to evening.": "Следующая глава снимается: комната вокруг этого кресла, кухня с утра до вечера.",
      "The interior": "Интерьер",
      "— Interiors": "— Интерьеры",
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
      "One link puts the whole kitchen in the client's hands — and the client walks into the meeting already decided.": "Одна ссылка отдаёт клиенту всю кухню в руки — и он приходит на встречу, уже приняв решение.",
      "The whole room in their hands": "Вся комната в руках клиента",
      "Six floors, six worktops, eight cabinet fronts and eight wall colours — every combination one tap away.": "Шесть полов, шесть столешниц, восемь фасадов и восемь цветов стен — любое сочетание в одном касании.",
      "Daylight and lamplight": "Днём и в свете ламп",
      "The same kitchen in daylight and under its own lamps — so nothing surprises the client after installation.": "Та же кухня при дневном свете и под собственными светильниками — после монтажа клиента не ждёт ни одного сюрприза.",
      "Opens anywhere, instantly": "Открывается везде и сразу",
      "In any browser, on any phone — nothing to install, nothing to explain.": "В любом браузере, на любом телефоне — ничего не нужно ни устанавливать, ни объяснять.",
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
      "— Corporate site": "— Корпоративный сайт",
      "Larisel Group.": "Larisel Group.",
      "Three sectors, one address.": "Три отрасли, один адрес.",
      "The website of a group working in retail, construction and energy — one set of pages, three languages.": "Сайт группы, работающей в рознице, строительстве и энергетике, — один набор страниц, три языка.",
      "Larisel Group": "Larisel Group",
      "Retail. Construction. Energy. One group.": "Ритейл. Строительство. Энергетика. Одна группа.",
      "From the group's homepage": "С главной страницы группы",
      "A corporate website that speaks for three companies at once, and stays calm while it does.": "Корпоративный сайт, который говорит сразу за три компании и остаётся спокойным.",
      "Three companies, one identity": "Три компании, одна идентичность",
      "Larisel Park, Larisel İnşaat and Larisel Enerji — each with its own story and colour, inside one coherent brand.": "Larisel Park, Larisel İnşaat и Larisel Enerji — у каждой своя история и свой цвет внутри одного цельного бренда.",
      "Three languages, one set of pages": "Три языка, один набор страниц",
      "Turkish, English and Russian — every page in every language, always in step.": "Турецкий, английский и русский — каждая страница на каждом языке, всегда синхронно.",
      "The flagship, in 3D": "Флагманский проект в 3D",
      "The construction page presents the group's flagship building as a model visitors turn in their own hands.": "Страница строительства представляет флагманское здание группы как модель, которую посетитель вращает сам.",
      "Visit the group": "Открыть сайт группы",
      "The corporate site, recorded": "Корпоративный сайт, запись",
      "Scrolling the group's homepage: the relief behind the type, the flagship project, the sectors.": "Листаем главную страницу группы: рельеф за текстом, флагманский проект, направления.",
      "The order bot": "Бот заказов",
      "— Order bot": "— Бот заказов",
      "An order arrives": "Заказ приходит",
      "the moment it is placed.": "в ту же секунду.",
      "The shop's Telegram bot takes the order, checks every step and sends it to the workshop — the phone on the desk is where it lands.": "Telegram-бот магазина принимает заказ, проверяет каждый шаг и отправляет его в мастерскую — телефон на столе и есть место, куда он приходит.",
      "Larisel Order Bot": "Бот заказов Larisel",
      "Choose, confirm, done — inside Telegram.": "Выбрать, подтвердить, готово — прямо в Telegram.",
      "What the shop's customers see": "Что видят покупатели магазина",
      "A complete shop inside Telegram — catalogue, cart and a five-step checkout, with an admin panel and Excel export behind it.": "Полноценный магазин внутри Telegram — каталог, корзина и оформление в пять шагов, а за ними админ-панель и выгрузка в Excel.",
      "Ordering, inside the chat": "Заказ прямо в чате",
      "No app, no sign-up: the customer orders right where they already talk.": "Ни приложения, ни регистрации: покупатель заказывает там, где и так общается.",
      "Not a single order lost": "Ни один заказ не теряется",
      "Every step is checked and saved — no order is ever left half-taken.": "Каждый шаг проверяется и сохраняется — ни один заказ не остаётся недооформленным.",
      "The whole day at a glance": "Весь день как на ладони",
      "An admin panel for the day's orders — and an Excel file the moment the accountant asks.": "Админ-панель с заказами за день — и файл Excel, как только попросит бухгалтер.",
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
      "One website speaking for three companies — equally clear to a customer, an investor and a future employee.": "Один сайт, который говорит от имени трёх компаний, — одинаково ясно для клиента, инвестора и будущего сотрудника.",
      "$1,000 – $3,000": "$1 000 – $3 000",
      "$3,000 – $5,000": "$3 000 – $5 000",
      "Above $5,000": "Больше $5 000",
      "bot": "бот",
      "Contact us": "Связаться с нами",
      "Your brief,": "Ваш бриф —",
      "in a few taps.": "в несколько касаний.",
      "Several can be chosen": "Можно несколько",
      "Please tell us in a few sentences what you would like.": "Расскажите в нескольких предложениях, что вам нужно.",
      "What you do, and what you would like us to build": "Чем вы занимаетесь и что хотите от нас",
      "Optional": "Необязательно",
      "Choose what you need first — the rest can follow.": "Сначала выберите, что вам нужно, — остальное можно позже.",
      "Write to us.": "Напишите нам.",
      "Where would you like to write from?": "Откуда вам удобнее написать?",
      "Opens in your browser": "Откроется в браузере",
      "Mail app": "Почтовое приложение",
      "The app on this device": "Приложение на этом устройстве",
      "Copy": "Копировать",
      "Copied": "Скопировано",
      "Close": "Закрыть",
      "Your brief is already in the message.": "Ваш бриф уже в письме.",
      "Visit the site": "Открыть сайт",
      "All work": "Все работы",
      "Every project we have built,": "Все наши проекты —"
    }
  };

  /* Pages beyond the home page (larisel.com/work) bring their own words: work/i18n-work.js,
     loaded first, sets window.LR_EXTRA = { tr: {...}, ru: {...} }. */
  if (window.LR_EXTRA) {
    for (var xl in window.LR_EXTRA) {
      DICT[xl] = DICT[xl] || {};
      for (var xk in window.LR_EXTRA[xl]) DICT[xl][xk] = window.LR_EXTRA[xl][xk];
    }
  }

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
