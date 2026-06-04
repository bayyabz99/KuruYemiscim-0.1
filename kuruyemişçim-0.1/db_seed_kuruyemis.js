const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.resolve('c:/Users/AAAA/Desktop/Manset-main/Manset-0.4/data/manset.db');
const db = new DatabaseSync(dbPath);

function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Helper to run transaction
function runTx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    fn();
    db.exec('COMMIT');
    console.log('Transaction committed successfully.');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Transaction rolled back due to error:', err);
    throw err;
  }
}

const categoriesData = [
  { name: 'Taze Kuruyemişler', slug: 'kuruyemis', desc: 'Günlük taze kavrulan kuruyemiş çeşitleri.', order: 1 },
  { name: 'Kuru Meyveler', slug: 'kuru-meyve', desc: 'Güneşte kurutulmuş organik kuru meyveler.', order: 2 },
  { name: 'Organik Ürünler', slug: 'organik-urunler', desc: 'Katkısız ve doğal organik besinler.', order: 3 },
  { name: 'Lokum & Şekerleme', slug: 'lokum-sekerleme', desc: 'Geleneksel lokumlar, pestil ve şekerlemeler.', order: 4 },
  { name: 'Kahve & Çay', slug: 'kahve-cay', desc: 'Taze çekilmiş kahveler ve şifalı bitki çayları.', order: 5 },
  { name: 'Taze Baharatlar', slug: 'baharatlar', desc: 'Taze ve aromatik yemeklik baharatlar.', order: 6 },
  { name: 'Doğal Yağlar & Soslar', slug: 'yaglar-soslar', desc: 'Soğuk sıkım bitkisel yağlar ve doğal soslar.', order: 7 },
  { name: 'Ballar & Reçeller', slug: 'ballar-receller', desc: 'Halis yayla balları ve katkısız ev reçelleri.', order: 8 },
  { name: 'Draje & Çikolata', slug: 'draje-cikolata', desc: 'Çikolata kaplı kuruyemişler ve drajeler.', order: 9 },
  { name: 'Bitkisel Ürünler & Sirkeler', slug: 'bitkisel-urunler', desc: 'Doğal sirkeler ve şifalı bitkisel sular.', order: 10 }
];

const productsData = {
  'kuruyemis': [
    { title: 'Antep Fıstığı (Duble)', price: 650, sale_price: 590, stock: 85, desc: 'Yöre: Gaziantep, Mahsul Yılı: 2025, Kalori: 562 kcal. Çıtır çıtır taze kavrulmuş duble boy Antep fıstığı.', options: [{ name: 'Tuzlu', hex: '#d35400' }, { name: 'Çiğ', hex: '#f39c12' }] },
    { title: 'Çiğ Badem İçi', price: 420, sale_price: 380, stock: 120, desc: 'Yöre: Datça, Mahsul Yılı: 2025, Kalori: 579 kcal. Katkısız çiğ badem içi.', options: [{ name: 'Çiğ', hex: '#f39c12' }, { name: 'Kabuklu', hex: '#8e44ad' }] },
    { title: 'Kavrulmuş Fındık İçi', price: 450, sale_price: null, stock: 95, desc: 'Yöre: Giresun, Mahsul Yılı: 2025, Kalori: 628 kcal. Altın sarısı kavrulmuş Giresun fındığı.' },
    { title: 'Çiğ Kaju İçi', price: 490, sale_price: 450, stock: 70, desc: 'Menşei: Vietnam, Mahsul Yılı: 2025, Kalori: 553 kcal. Premium kalite çiğ kaju.' },
    { title: 'Lüks Karışık Kuruyemiş', price: 520, sale_price: 490, stock: 110, desc: 'Yöre: Karışık, Mahsul Yılı: 2025, Kalori: 580 kcal. Antep fıstığı, kaju, badem ve fındıktan oluşan lüks karışım.' },
    { title: 'Kabuklu Ceviz (Lüks)', price: 260, sale_price: null, stock: 150, desc: 'Yöre: Kahramanmaraş, Mahsul Yılı: 2025, Kalori: 654 kcal. İnce kabuklu, kolay kırılan lüks ceviz.' },
    { title: 'Tuzlu Sarı Leblebi', price: 160, sale_price: 140, stock: 200, desc: 'Yöre: Çorum, Mahsul Yılı: 2025, Kalori: 368 kcal. Meşhur Çorum leblebisi.' },
    { title: 'Çıtır Kabak Çekirdeği', price: 280, sale_price: null, stock: 130, desc: 'Yöre: Nevşehir, Mahsul Yılı: 2025, Kalori: 446 kcal. Sütle kavrulmuş Nevşehir kabak çekirdeği.' },
    { title: 'Soslu Mısır (Çerezlik)', price: 150, sale_price: 120, stock: 180, desc: 'Yöre: Adana, Mahsul Yılı: 2025, Kalori: 410 kcal. Özel sosuyla çıtır mısır çerezi.' },
    { title: 'Yer Fıstığı İçi (Tuzlu)', price: 180, sale_price: null, stock: 160, desc: 'Yöre: Osmaniye, Mahsul Yılı: 2025, Kalori: 567 kcal. Osmaniye\'nin meşhur iri boy tuzlu fıstığı.' }
  ],
  'kuru-meyve': [
    { title: 'Gün Kurusu Kayısı', price: 320, sale_price: 280, stock: 90, desc: 'Yöre: Malatya, Mahsul Yılı: 2025, Kalori: 241 kcal. Doğal güneşte kurutulmuş kükürtsüz Malatya kayısısı.' },
    { title: 'Sarı Kuru Kayısı', price: 290, sale_price: null, stock: 85, desc: 'Yöre: Malatya, Mahsul Yılı: 2025, Kalori: 241 kcal. Özenle seçilmiş tatlı sarı kayısı.' },
    { title: 'Doğal Kuru İncir', price: 380, sale_price: 340, stock: 60, desc: 'Yöre: Aydın, Mahsul Yılı: 2025, Kalori: 249 kcal. Bal damlası kıvamında doğal Aydın inciri.' },
    { title: 'Medine Hurması (Mebrum)', price: 480, sale_price: null, stock: 75, desc: 'Menşei: Suudi Arabistan, Mahsul Yılı: 2025, Kalori: 277 kcal. Orijinal Mebrum cinsi Medine hurması.' },
    { title: 'Çekirdeksiz İzmir Üzümü', price: 180, sale_price: 160, stock: 150, desc: 'Yöre: İzmir, Mahsul Yılı: 2025, Kalori: 299 kcal. Güneşte kurutulmuş tatlı İzmir üzümü.' },
    { title: 'Gün Kurusu Erik', price: 240, sale_price: null, stock: 110, desc: 'Yöre: Kastamonu, Mahsul Yılı: 2025, Kalori: 240 kcal. Doğal ekşi tatlı mürdüm eriği kurusu.' },
    { title: 'Kurutulmuş Vişne', price: 350, sale_price: 310, stock: 50, desc: 'Yöre: Afyon, Mahsul Yılı: 2025, Kalori: 290 kcal. Çekirdeksiz, doğal vişne kurusu.' },
    { title: 'Kurutulmuş Çilek Dilimleri', price: 420, sale_price: null, stock: 40, desc: 'Yöre: Aydın, Mahsul Yılı: 2025, Kalori: 320 kcal. Kokulu doğal çilek kurusu.' },
    { title: 'Tropikal Ananas Kurusu', price: 390, sale_price: 350, stock: 65, desc: 'Menşei: Kosta Rika, Mahsul Yılı: 2025, Kalori: 310 kcal. Katkısız, şeker ilavesiz ananas kurusu.' },
    { title: 'Doğal Kuru Dut', price: 210, sale_price: null, stock: 100, desc: 'Yöre: Elazığ, Mahsul Yılı: 2025, Kalori: 300 kcal. Elazığ yöresi meşhur tatlı beyaz dut kurusu.' }
  ],
  'organik-urunler': [
    { title: 'Soğuk Sıkım Sızma Zeytinyağı', price: 480, sale_price: 440, stock: 75, desc: 'Yöre: Edremit, Mahsul Yılı: 2025. Erken hasat, soğuk sıkım düşük asitli organik zeytinyağı.' },
    { title: 'Organik Üzüm Pekmezi', price: 220, sale_price: null, stock: 120, desc: 'Yöre: Tokat, Mahsul Yılı: 2025. Katkısız, geleneksel yöntemlerle kaynatılmış pekmez.' },
    { title: 'Çifte Kavrulmuş Tahin', price: 240, sale_price: 210, stock: 110, desc: 'Yöre: Antalya, Mahsul Yılı: 2025. Yerli susamlardan taş değirmende çekilmiş tahin.' },
    { title: 'Organik Keçiboynuzu Özü', price: 260, sale_price: null, stock: 90, desc: 'Yöre: Mersin, Mahsul Yılı: 2025. Soğuk pres yöntemiyle üretilmiş keçiboynuzu özü.' },
    { title: 'Hakiki Nar Ekşisi (%100)', price: 320, sale_price: 290, stock: 85, desc: 'Yöre: Hatay, Mahsul Yılı: 2025. Şeker içermeyen, %100 doğal Hatay nar ekşisi.' },
    { title: 'Ev Yapımı Tarhana', price: 190, sale_price: null, stock: 140, desc: 'Yöre: Uşak, Mahsul Yılı: 2025. Yoğurtlu ve bol sebzeli geleneksel Uşak tarhanası.' },
    { title: 'Organik Köy Bulguru', price: 95, sale_price: 80, stock: 250, desc: 'Yöre: Mardin, Mahsul Yılı: 2025. Taş değirmende kırılmış doğal sarı bulgur.' },
    { title: 'Glutensiz Yulaf Ezmesi', price: 140, sale_price: null, stock: 130, desc: 'Menşei: Türkiye, Mahsul Yılı: 2025. Lif zengini glutensiz ince öğütülmüş yulaf ezmesi.' },
    { title: 'Doğal Ev Yapımı Domates Salçası', price: 180, sale_price: 160, stock: 95, desc: 'Yöre: Çanakkale, Mahsul Yılı: 2025. Güneşte kurutulmuş koyu kıvamlı domates salçası.' },
    { title: 'Organik Karakılçık Unu', price: 110, sale_price: null, stock: 80, desc: 'Yöre: Seferihisar, Mahsul Yılı: 2025. Ata tohumu karakılçık buğdayından tam buğday unu.' }
  ],
  'lokum-sekerleme': [
    { title: 'Çifte Kavrulmuş Antep Fıstıklı Lokum', price: 350, sale_price: 310, stock: 65, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Bol fıstıklı, yumuşacık çifte kavrulmuş geleneksel lokum.' },
    { title: 'Gül Yapraklı Nar Aromalı Lokum', price: 320, sale_price: null, stock: 50, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Üzeri gerçek gül yapraklarıyla kaplı nar aromalı lokum.' },
    { title: 'Antep Fıstıklı Cezerye', price: 280, sale_price: 250, stock: 80, desc: 'Yöre: Mersin, Mahsul Yılı: 2025. Havuç, şeker ve bol Antep fıstığından yapılan Mersin cezeryesi.' },
    { title: 'Sade Cevizli Pestil', price: 240, sale_price: null, stock: 110, desc: 'Yöre: Gümüşhane, Mahsul Yılı: 2025. İncecik serilmiş cevizli Gümüşhane pestili.' },
    { title: 'Fındıklı Köme (Muska)', price: 260, sale_price: 230, stock: 90, desc: 'Yöre: Gümüşhane, Mahsul Yılı: 2025. Pekmezli ve fındıklı geleneksel köme sarması.' },
    { title: 'Karışık Akide Şekeri', price: 140, sale_price: null, stock: 150, desc: 'Yöre: İstanbul, Mahsul Yılı: 2025. Geleneksel akide şekeri çeşitleri.' },
    { title: 'Çikolata Kaplı Portakallı Lokum', price: 360, sale_price: 320, stock: 45, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Portakal dolgulu ve bitter çikolata kaplı özel lokum.' },
    { title: 'Geleneksel Nane Şekeri', price: 110, sale_price: null, stock: 130, desc: 'Yöre: Türkiye, Mahsul Yılı: 2025. Ferahlatıcı mentol aromalı sert şeker.' },
    { title: 'Premium Badem Ezmesi', price: 450, sale_price: 390, stock: 40, desc: 'Yöre: Edirne, Mahsul Yılı: 2025. Yoğun badem aromalı meşhur Edirne badem ezmesi.' },
    { title: 'Sultan Lokumu (Kaymaklı)', price: 340, sale_price: null, stock: 55, desc: 'Yöre: Afyon, Mahsul Yılı: 2025. Afyon kaymağı dolgulu saray usulü sultan lokumu.' }
  ],
  'kahve-cay': [
    { title: 'Taze Çekilmiş Türk Kahvesi', price: 360, sale_price: 320, stock: 150, desc: 'Yöre: Brezilya, Mahsul Yılı: 2025. Taş değirmende taze çekilmiş orta kavrulmuş Türk kahvesi.', options: [{ name: 'Orta Kavrulmuş', hex: '#8b5a2b' }, { name: 'Çok Kavrulmuş', hex: '#4a2f13' }] },
    { title: 'Özel Dibek Kahvesi', price: 380, sale_price: null, stock: 80, desc: 'Yöre: Ege, Mahsul Yılı: 2025. Kakule, menengiç ve salep aromalı yumuşak içimli dibek kahvesi.' },
    { title: 'Yöresel Menengiç Kahvesi', price: 290, sale_price: 260, stock: 100, desc: 'Yöre: Gaziantep, Mahsul Yılı: 2025. Kafeinsiz geleneksel menengiç kahvesi.' },
    { title: 'Organik Yeşil Çay', price: 220, sale_price: null, stock: 110, desc: 'Yöre: Rize, Mahsul Yılı: 2025. Rize Hemşin yöresi organik yeşil çay yaprakları.' },
    { title: 'Dağ Ihlamuru (Çiçekli)', price: 480, sale_price: 420, stock: 60, desc: 'Yöre: Karadeniz, Mahsul Yılı: 2025. Elle toplanmış mis kokulu yaprak ve çiçek ıhlamur.' },
    { title: 'Melisa Çayı (Oğul Otu)', price: 240, sale_price: null, stock: 95, desc: 'Yöre: Akdeniz, Mahsul Yılı: 2025. Sakinleştirici ve ferahlatıcı melisa yaprakları.' },
    { title: 'Yaylasal Adaçayı', price: 190, sale_price: 160, stock: 120, desc: 'Yöre: Muğla, Mahsul Yılı: 2025. Dağlardan toplanmış demet adaçayı.' },
    { title: 'Tıbbi Papatya Çayı', price: 260, sale_price: null, stock: 75, desc: 'Yöre: İç Anadolu, Mahsul Yılı: 2025. Kurutulmuş sarı papatya tomurcukları.' },
    { title: 'Premium Espresso Filtre Kahve', price: 490, sale_price: 450, stock: 85, desc: 'Menşei: Kolombiya, Mahsul Yılı: 2025. Orta sertlikte %100 Arabica çekirdek filtre kahve.' },
    { title: 'Kaçak Çay (Seylan Çayı)', price: 340, sale_price: null, stock: 140, desc: 'Menşei: Sri Lanka, Mahsul Yılı: 2025. İri yapraklı yüksek demli orijinal Seylan çayı.' }
  ],
  'baharatlar': [
    { title: 'Maraş İpek Pul Biber', price: 220, sale_price: 190, stock: 130, desc: 'Yöre: Kahramanmaraş, Mahsul Yılı: 2025. Çekirdeksiz ve yağlı tatlı-acı ipek pul biber.' },
    { title: 'Taze Çekilmiş Karabiber', price: 290, sale_price: null, stock: 120, desc: 'Menşei: Vietnam, Mahsul Yılı: 2025. Taze çekilmiş keskin kokulu siyah tane karabiber.' },
    { title: 'Halis Değirmen Kimyonu', price: 240, sale_price: 210, stock: 95, desc: 'Yöre: İç Anadolu, Mahsul Yılı: 2025. Taze çekilmiş kimyon.' },
    { title: 'Dağ Kekiği (Zahter)', price: 180, sale_price: null, stock: 150, desc: 'Yöre: Hatay, Mahsul Yılı: 2025. Yaylalardan toplanmış kokulu yabani dağ kekiği.' },
    { title: 'Nane Yaprağı Kurusu', price: 140, sale_price: 120, stock: 160, desc: 'Yöre: Ege, Mahsul Yılı: 2025. Güneşte kurutulmuş yeşil nane ufalaması.' },
    { title: 'Hakiki Hatay Sumağı', price: 260, sale_price: null, stock: 110, desc: 'Yöre: Hatay, Mahsul Yılı: 2025. Doğal ekşi tada sahip tane sumak öğütmesi.' },
    { title: 'Tane Zerdeçal', price: 230, sale_price: 195, stock: 85, desc: 'Menşei: Hindistan, Mahsul Yılı: 2025. Sağlık kaynağı kurutulmuş kök zerdeçal.' },
    { title: 'Toz Zencefil', price: 250, sale_price: null, stock: 90, desc: 'Menşei: Çin, Mahsul Yılı: 2025. Keskin ve aromatik kurutulmuş toz zencefil.' },
    { title: 'Rulo Seylan Tarçını', price: 490, sale_price: 440, stock: 65, desc: 'Menşei: Sri Lanka, Mahsul Yılı: 2025. Tatlı ve hafif aromalı hakiki rulo tarçın çubuğu.' },
    { title: 'Yerli Çörek Otu', price: 160, sale_price: null, stock: 180, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Hamur işlerine lezzet veren yerli çörek otu.' }
  ],
  'yaglar-soslar': [
    { title: 'Soğuk Sıkım Çörekotu Yağı', price: 380, sale_price: 340, stock: 90, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Isıl işlem görmeden sıkılmış şifalı çörek otu yağı.' },
    { title: 'Hakiki Sarı Kantaron Yağı', price: 290, sale_price: null, stock: 85, desc: 'Yöre: Kazdağları, Mahsul Yılı: 2025. Doğal zeytinyağında bekletilmiş kırmızı kantaron yağı.' },
    { title: 'Organik Hindistan Cevizi Yağı', price: 340, sale_price: 300, stock: 70, desc: 'Menşei: Sri Lanka, Mahsul Yılı: 2025. Soğuk sıkım organik hindistan cevizi yağı.' },
    { title: 'Tatlı Badem Yağı', price: 260, sale_price: null, stock: 95, desc: 'Yöre: Ege, Mahsul Yılı: 2025. Cilt ve saç bakımı için ideal doğal badem yağı.' },
    { title: 'Doğal Nar Ekşili Sos', price: 140, sale_price: 110, stock: 150, desc: 'Yöre: Hatay, Mahsul Yılı: 2025. Salatalar için lezzetli ve ekşi sos.' },
    { title: 'Acı Biber Sosu (Geleneksel)', price: 160, sale_price: null, stock: 100, desc: 'Yöre: Adana, Mahsul Yılı: 2025. Ev yapımı acı kırmızı biber sosu.' },
    { title: 'Ballı Hardal Sos', price: 180, sale_price: 150, stock: 80, desc: 'Yöre: Türkiye, Mahsul Yılı: 2025. Doğal çiçek balı ile tatlandırılmış hardal sosu.' },
    { title: 'Soğuk Sıkım Kabak Çekirdeği Yağı', price: 420, sale_price: null, stock: 65, desc: 'Yöre: Nevşehir, Mahsul Yılı: 2025. Kabak çekirdeği soğuk pres yağı.' },
    { title: 'Halis Susam Yağı', price: 290, sale_price: 260, stock: 90, desc: 'Yöre: Antalya, Mahsul Yılı: 2025. Doğal susam yağı.' },
    { title: 'Saf Kekik Yağı', price: 320, sale_price: null, stock: 75, desc: 'Yöre: Akdeniz, Mahsul Yılı: 2025. Distilasyon yöntemiyle elde edilmiş uçucu saf kekik yağı.' }
  ],
  'ballar-receller': [
    { title: 'Karakovan Süzme Çiçek Balı', price: 680, sale_price: 590, stock: 45, desc: 'Yöre: Hakkari, Mahsul Yılı: 2025. Yüksek yaylalardan katkısız karakovan süzme balı.' },
    { title: 'Organik Yayla Çiçek Balı', price: 480, sale_price: null, stock: 60, desc: 'Yöre: Erzurum, Mahsul Yılı: 2025. Binbir çiçek florasından gelen yayla balı.' },
    { title: 'Saf Muğla Çam Balı', price: 390, sale_price: 340, stock: 70, desc: 'Yöre: Muğla, Mahsul Yılı: 2025. Muğla çam ormanlarından toplanan doğal çam balı.' },
    { title: 'Ev Yapımı Çilek Reçeli', price: 160, sale_price: null, stock: 120, desc: 'Yöre: Afyon, Mahsul Yılı: 2025. Taneli koruyucusuz ev yapımı çilek reçeli.' },
    { title: 'Doğal Karadut Reçeli', price: 190, sale_price: 160, stock: 90, desc: 'Yöre: Tokat, Mahsul Yılı: 2025. Karadut tanelerinden nefis reçel.' },
    { title: 'Geleneksel İncir Reçeli', price: 170, sale_price: null, stock: 110, desc: 'Yöre: Aydın, Mahsul Yılı: 2025. Taze incirlerden üretilen tatlı reçel.' },
    { title: 'Mayhoş Vişne Reçeli', price: 160, sale_price: 135, stock: 130, desc: 'Yöre: Afyon, Mahsul Yılı: 2025. Bol vişneli ekşi-tatlı kahvaltılık reçel.' },
    { title: 'Köy Usulü Ayva Reçeli', price: 150, sale_price: null, stock: 100, desc: 'Yöre: Bursa, Mahsul Yılı: 2025. Karanfil aromalı ayva reçeli.' },
    { title: 'Doğal Kayısı Reçeli', price: 155, sale_price: 130, stock: 115, desc: 'Yöre: Malatya, Mahsul Yılı: 2025. Gün kurusu kayısılardan üretilmiş nefis kahvaltılık reçel.' },
    { title: 'Ev Yapımı Portakal Reçeli', price: 145, sale_price: null, stock: 95, desc: 'Yöre: Antalya, Mahsul Yılı: 2025. Portakal kabuğu dilimleriyle hazırlanan aromatik reçel.' }
  ],
  'draje-cikolata': [
    { title: 'Sütlü Çikolata Badem Şekeri', price: 320, sale_price: 280, stock: 140, desc: 'Yöre: Konya, Mahsul Yılı: 2025. İçi taze bademli, dışı sütlü çikolata kaplı çıtır draje.' },
    { title: 'Bitter Çikolatalı Fındık Draje', price: 340, sale_price: null, stock: 110, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Kavrulmuş fındık dolgulu bitter çikolata kaplı draje.' },
    { title: 'Renkli Çakıl Taşı Bonbon', price: 190, sale_price: 160, stock: 180, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Çakıl taşı şeklinde renkli sütlü çikolata drajeleri.' },
    { title: 'Çikolata Kaplı Kuru Kayısı', price: 380, sale_price: null, stock: 85, desc: 'Yöre: Malatya, Mahsul Yılı: 2025. İçi bütün gün kurusu kayısı, dışı çikolata kaplamalı özel lezzet.' },
    { title: 'Antep Fıstıklı Tablet Çikolata', price: 220, sale_price: 190, stock: 150, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Bol Antep fıstıklı sütlü tablet çikolata.' },
    { title: 'Beyaz Çikolatalı Kaju Draje', price: 390, sale_price: null, stock: 90, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Çıtır kajuların beyaz çikolata ile enfes buluşması.' },
    { title: 'Çikolatalı Portakal Kabuğu Draje', price: 310, sale_price: 270, stock: 100, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Bitter çikolatalı portakal kabuğu draje.' },
    { title: 'Çikolata Kaplı Kahve Çekirdeği', price: 360, sale_price: null, stock: 120, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Kıtır kahve çekirdekleri üzerine sütlü ve bitter çikolata kaplama.' },
    { title: 'Çilekli Yoğurtlu Draje', price: 380, sale_price: 330, stock: 80, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Kurutulmuş çilekler üzerine yoğurtlu beyaz çikolata kaplama.' },
    { title: 'Karamelli Yer Fıstığı Draje', price: 280, sale_price: null, stock: 110, desc: 'Yöre: Konya, Mahsul Yılı: 2025. Karamel dolgulu yer fıstıklı drajeler.' }
  ],
  'bitkisel-urunler': [
    { title: 'Doğal Alıç Sirkesi', price: 180, sale_price: 150, stock: 160, desc: 'Yöre: Kastamonu, Mahsul Yılı: 2025. Dağ alıçlarından üretilmiş sirke.' },
    { title: 'Saf Enginar Suyu', price: 160, sale_price: null, stock: 110, desc: 'Yöre: Aydın, Mahsul Yılı: 2025. Karaciğer dostu enginar yaprağı suyu.' },
    { title: 'Hakiki Isparta Gül Suyu', price: 220, sale_price: 190, stock: 140, desc: 'Yöre: Isparta, Mahsul Yılı: 2025. %100 saf tonik etkili gül suyu.' },
    { title: 'Saf Lavanta Yağı', price: 320, sale_price: null, stock: 80, desc: 'Yöre: Isparta, Mahsul Yılı: 2025. Saf lavanta uçucu yağı.' },
    { title: 'Tıbbi Nane Yağı', price: 190, sale_price: 160, stock: 95, desc: 'Yöre: Akdeniz, Mahsul Yılı: 2025. Saf nane yağı.' },
    { title: 'Doğal Biberiye Suyu', price: 150, sale_price: null, stock: 120, desc: 'Yöre: Ege, Mahsul Yılı: 2025. Saç ve cilt bakımı için biberiye suyu.' },
    { title: 'Organik Kekik Suyu', price: 140, sale_price: 110, stock: 130, desc: 'Yöre: Toroslar, Mahsul Yılı: 2025. Acı kekik suyu.' },
    { title: 'Kantaron Yağı (Mavi)', price: 310, sale_price: null, stock: 70, desc: 'Yöre: Kazdağları, Mahsul Yılı: 2025. Mavi kantaron çiçeği yağı.' },
    { title: 'Saf Çay Ağacı Yağı', price: 340, sale_price: 290, stock: 85, desc: 'Menşei: Avustralya, Mahsul Yılı: 2025. Cilt lekeleri ve sivilceler için saf çay ağacı özü.' },
    { title: 'Karabaş Otu Suyu', price: 160, sale_price: null, stock: 110, desc: 'Yöre: Ege, Mahsul Yılı: 2025. Geleneksel karabaş otu distilesi.' }
  ]
};

const organizationsData = [
  { title: 'Ahşap Hediyelik Kuruyemiş Kutusu', desc: 'Yöre: Karışık, Mahsul Yılı: 2025. Özel günler için lüks ahşap kutuda premium kuruyemiş sunumu.', path: '/uploads/kuruyemis.png' },
  { title: 'Organik Kahvaltı Paketi', desc: 'Yöre: Ege-Karadeniz, Mahsul Yılı: 2025. Karakovan balı, sızma zeytinyağı ve ev reçellerinden oluşan özel paket.', path: '/uploads/organik.png' },
  { title: 'Geleneksel Lokum Sunum Tepsisi', desc: 'Yöre: İç Anadolu, Mahsul Yılı: 2025. Kadife kaplı kutuda çifte kavrulmuş fıstıklı ve güllü lokum şöleni.', path: '/uploads/lokum.png' }
];

runTx(() => {
  // Truncate tables selectively
  db.prepare('DELETE FROM product_colors').run();
  db.prepare('DELETE FROM product_images').run();
  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM categories').run();
  db.prepare('DELETE FROM organization_images').run();
  db.prepare('DELETE FROM organizations').run();
  db.prepare('DELETE FROM organization_categories').run();
  db.prepare('DELETE FROM order_items').run();
  db.prepare('DELETE FROM orders').run();

  // Reset sqlite_sequence to reset autoincrements
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('categories', 'products', 'product_images', 'product_colors', 'organizations', 'organization_images', 'orders', 'order_items')").run();

  // Insert categories
  const insertCat = db.prepare('INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES (?, ?, ?, ?, 1)');
  const catSlugToId = {};
  
  categoriesData.forEach(c => {
    const res = insertCat.run(c.name, c.slug, c.desc, c.order);
    catSlugToId[c.slug] = res.lastInsertRowid;
  });

  console.log(`Seeded ${categoriesData.length} categories.`);

  // Insert products
  const insertProd = db.prepare(`
    INSERT INTO products (title, slug, description, price, sale_price, stock, category_id, discount_percent, is_featured, is_active, free_shipping)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);

  const insertImg = db.prepare(`
    INSERT INTO product_images (product_id, path, alt, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertColor = db.prepare(`
    INSERT INTO product_colors (product_id, name, hex)
    VALUES (?, ?, ?)
  `);

  let productCount = 0;
  for (const [slug, prods] of Object.entries(productsData)) {
    const categoryId = catSlugToId[slug];
    
    prods.forEach((p, idx) => {
      const prodSlug = createSlug(p.title);
      const isFeatured = idx < 2 ? 1 : 0; // First 2 products of each category are featured
      const freeShipping = p.price >= 400 ? 1 : 0; // Free shipping if price >= 400
      const discountPercent = p.sale_price ? Math.round(((p.price - p.sale_price) / p.price) * 100) : 0;

      const res = insertProd.run(
        p.title,
        prodSlug,
        p.desc,
        p.price,
        p.sale_price,
        p.stock,
        categoryId,
        discountPercent,
        isFeatured,
        freeShipping
      );

      const productId = res.lastInsertRowid;
      productCount++;

      // Use the category image name mapping
      let imgFilename = slug.replace('-', '_') + '.png';
      if (slug === 'kuruyemis') imgFilename = 'kuruyemis.png';
      else if (slug === 'kuru-meyve') imgFilename = 'kuru_meyve.png';
      else if (slug === 'organik-urunler') imgFilename = 'organik.png';
      else if (slug === 'lokum-sekerleme') imgFilename = 'lokum.png';
      else if (slug === 'kahve-cay') imgFilename = 'kahve_cay.png';
      else if (slug === 'baharatlar') imgFilename = 'baharat.png';
      else if (slug === 'yaglar-soslar') imgFilename = 'yag_sos.png';
      else if (slug === 'ballar-receller') imgFilename = 'bal_recel.png';
      else if (slug === 'draje-cikolata') imgFilename = 'draje.png';
      else if (slug === 'bitkisel-urunler') imgFilename = 'bitkisel.png';

      const imgPath = `/uploads/${imgFilename}`;
      insertImg.run(productId, imgPath, p.title, 0);

      // Seed options/colors
      if (p.options) {
        p.options.forEach(opt => {
          insertColor.run(productId, opt.name, opt.hex);
        });
      }
    });
  }

  console.log(`Seeded ${productCount} products.`);

  // Insert organization categories
  const resOrgCat = db.prepare('INSERT INTO organization_categories (name, slug, sort_order) VALUES (?, ?, ?)').run(
    'Özel Sunum & Paketler',
    'ozel-sunum-paketler',
    1
  );
  const orgCatId = resOrgCat.lastInsertRowid;

  // Insert organizations
  const insertOrg = db.prepare(`
    INSERT INTO organizations (title, slug, description, category_id, location, event_date, is_published, is_featured, sort_order)
    VALUES (?, ?, ?, ?, 'Konya, Türkiye', '2026-06-01', 1, 1, ?)
  `);

  const insertOrgImg = db.prepare(`
    INSERT INTO organization_images (organization_id, path, caption, sort_order)
    VALUES (?, ?, ?, 0)
  `);

  organizationsData.forEach((org, idx) => {
    const orgSlug = createSlug(org.title);
    const res = insertOrg.run(
      org.title,
      orgSlug,
      org.desc,
      orgCatId,
      idx + 1
    );
    const orgId = res.lastInsertRowid;
    insertOrgImg.run(orgId, org.path, org.title);
  });

  console.log(`Seeded ${organizationsData.length} organization items.`);

  // Update Settings
  const updateSetting = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
  updateSetting.run('Tazeci Kuruyemiş & Organik Ürünler', 'site_name');
  updateSetting.run('Taptaze, Doğal ve Kapınızda', 'site_tagline');
  updateSetting.run('destek@tazecikuruyemis.com', 'contact_email');
  updateSetting.run('Konya, Türkiye (42030)', 'contact_address');
  console.log('Settings updated for Tazeci theme.');
});
