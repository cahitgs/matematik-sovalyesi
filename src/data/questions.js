// MEB ilkokul matematik müfredatına göre soru havuzu (1-4. sınıf)
// Her soru: { metin, secenekler: [4], dogru: index (0-3) }

export const QUESTIONS = {
  // === 1. SINIF — 0-20 arası toplama/çıkarma, ritmik sayma, geometrik şekiller ===
  1: [
    { metin: '3 + 4 = ?',     secenekler: ['5','6','7','8'],     dogru: 2 },
    { metin: '5 + 2 = ?',     secenekler: ['6','7','8','9'],     dogru: 1 },
    { metin: '8 - 3 = ?',     secenekler: ['3','4','5','6'],     dogru: 2 },
    { metin: '9 - 4 = ?',     secenekler: ['3','4','5','6'],     dogru: 2 },
    { metin: '6 + 3 = ?',     secenekler: ['7','8','9','10'],    dogru: 2 },
    { metin: '10 - 6 = ?',    secenekler: ['2','3','4','5'],     dogru: 2 },
    { metin: '7 + 2 = ?',     secenekler: ['8','9','10','11'],   dogru: 1 },
    { metin: '4 + 4 = ?',     secenekler: ['6','7','8','9'],     dogru: 2 },
    { metin: '12 - 5 = ?',    secenekler: ['6','7','8','9'],     dogru: 1 },
    { metin: '5 + 5 = ?',     secenekler: ['8','9','10','11'],   dogru: 2 },
    { metin: '15 - 7 = ?',    secenekler: ['6','7','8','9'],     dogru: 2 },
    { metin: '6 + 6 = ?',     secenekler: ['10','11','12','13'], dogru: 2 },
    { metin: '13 - 4 = ?',    secenekler: ['7','8','9','10'],    dogru: 2 },
    { metin: '2 + 7 = ?',     secenekler: ['8','9','10','11'],   dogru: 1 },
    { metin: '11 - 3 = ?',    secenekler: ['7','8','9','10'],    dogru: 1 },
    { metin: '10 + 5 = ?',    secenekler: ['13','14','15','16'], dogru: 2 },
    { metin: '20 - 5 = ?',    secenekler: ['13','14','15','16'], dogru: 2 },
    { metin: '8 + 8 = ?',     secenekler: ['14','15','16','17'], dogru: 2 },
    { metin: '4 üçgenin köşe sayısı toplam?', secenekler: ['9','10','11','12'], dogru: 3 },
    { metin: 'Bir karenin kaç köşesi var?', secenekler: ['3','4','5','6'], dogru: 1 },
    { metin: 'Bir dairenin kaç köşesi var?', secenekler: ['0','1','2','3'], dogru: 0 },
    { metin: 'İkişer sayalım: 2, 4, 6, ... ?',  secenekler: ['7','8','9','10'], dogru: 1 },
    { metin: 'Beşer sayalım: 5, 10, 15, ... ?', secenekler: ['16','18','20','25'], dogru: 2 },
    { metin: '1 elma + 2 elma = ?',   secenekler: ['2','3','4','5'], dogru: 1 },
    { metin: 'Hangisi en büyük?',     secenekler: ['7','9','5','8'], dogru: 1 },
  ],

  // === 2. SINIF — 100'e kadar toplama/çıkarma (elde, onluk), basit çarpma (2,3,5,10) ===
  2: [
    { metin: '24 + 13 = ?',  secenekler: ['35','37','38','40'],  dogru: 1 },
    { metin: '45 - 18 = ?',  secenekler: ['25','27','28','37'],  dogru: 1 },
    { metin: '36 + 27 = ?',  secenekler: ['53','61','63','73'],  dogru: 2 },
    { metin: '60 - 35 = ?',  secenekler: ['15','25','35','45'],  dogru: 1 },
    { metin: '5 × 3 = ?',    secenekler: ['10','13','15','20'],  dogru: 2 },
    { metin: '2 × 7 = ?',    secenekler: ['12','14','16','18'],  dogru: 1 },
    { metin: '10 × 4 = ?',   secenekler: ['14','24','40','44'],  dogru: 2 },
    { metin: '3 × 6 = ?',    secenekler: ['12','15','18','21'],  dogru: 2 },
    { metin: '50 + 25 = ?',  secenekler: ['65','70','75','80'],  dogru: 2 },
    { metin: '92 - 47 = ?',  secenekler: ['35','45','55','65'],  dogru: 1 },
    { metin: '5 × 8 = ?',    secenekler: ['30','35','40','45'],  dogru: 2 },
    { metin: '10 × 9 = ?',   secenekler: ['80','89','90','99'],  dogru: 2 },
    { metin: '78 + 12 = ?',  secenekler: ['80','88','90','92'],  dogru: 2 },
    { metin: '100 - 25 = ?', secenekler: ['65','70','75','85'],  dogru: 2 },
    { metin: '3 × 9 = ?',    secenekler: ['18','24','27','30'],  dogru: 2 },
    { metin: '2 × 9 = ?',    secenekler: ['16','18','19','20'],  dogru: 1 },
    { metin: '4 onluk + 5 birlik = ?',  secenekler: ['9','45','54','450'], dogru: 1 },
    { metin: '7 onluk = ?',  secenekler: ['7','17','70','77'],   dogru: 2 },
    { metin: '15 + 15 = ?',  secenekler: ['25','30','35','40'],  dogru: 1 },
    { metin: '40 - 13 = ?',  secenekler: ['23','27','33','37'],  dogru: 1 },
    { metin: '100 cm = ? metre', secenekler: ['1','10','100','1000'], dogru: 0 },
    { metin: '1 kg = ? gram',    secenekler: ['10','100','1000','10000'], dogru: 2 },
    { metin: 'Çift sayı hangisi?', secenekler: ['7','9','12','15'], dogru: 2 },
    { metin: 'Tek sayı hangisi?',  secenekler: ['4','6','8','11'],  dogru: 3 },
    { metin: 'Saat 3\'ten 2 saat sonra?', secenekler: ['4','5','6','7'], dogru: 1 },
  ],

  // === 3. SINIF — 1000'e kadar sayılar, çarpım tablosu, basit kesir (1/2, 1/4), bölme ===
  3: [
    { metin: '124 + 235 = ?',  secenekler: ['339','349','359','369'], dogru: 2 },
    { metin: '500 - 175 = ?',  secenekler: ['275','325','335','425'], dogru: 1 },
    { metin: '6 × 7 = ?',      secenekler: ['36','42','48','54'],     dogru: 1 },
    { metin: '8 × 6 = ?',      secenekler: ['42','46','48','54'],     dogru: 2 },
    { metin: '7 × 9 = ?',      secenekler: ['56','62','63','72'],     dogru: 2 },
    { metin: '36 ÷ 4 = ?',     secenekler: ['7','8','9','12'],        dogru: 2 },
    { metin: '24 ÷ 3 = ?',     secenekler: ['6','7','8','9'],         dogru: 2 },
    { metin: '40 ÷ 5 = ?',     secenekler: ['7','8','9','10'],        dogru: 1 },
    { metin: '8 × 8 = ?',      secenekler: ['56','62','64','72'],     dogru: 2 },
    { metin: '9 × 9 = ?',      secenekler: ['72','79','81','89'],     dogru: 2 },
    { metin: '348 + 152 = ?',  secenekler: ['400','450','500','550'], dogru: 2 },
    { metin: '7 × 8 = ?',      secenekler: ['54','56','58','60'],     dogru: 1 },
    { metin: '999 + 1 = ?',    secenekler: ['100','999','1000','1100'], dogru: 2 },
    { metin: '600 ÷ 6 = ?',    secenekler: ['10','60','100','600'],   dogru: 2 },
    { metin: '1/2 sayısı kaç?',     secenekler: ['Yarım','Çeyrek','Tam','Üçte bir'], dogru: 0 },
    { metin: 'Bir pastanın 1/4\'ü?', secenekler: ['Yarım','Çeyrek','Üçte iki','Tam'], dogru: 1 },
    { metin: '1 saat = ? dakika',   secenekler: ['30','45','60','90'], dogru: 2 },
    { metin: '1 hafta = ? gün',     secenekler: ['5','6','7','8'],     dogru: 2 },
    { metin: '5 × 7 + 5 = ?',  secenekler: ['30','35','40','45'],     dogru: 2 },
    { metin: '63 ÷ 9 = ?',     secenekler: ['6','7','8','9'],         dogru: 1 },
    { metin: '3 × 12 = ?',     secenekler: ['33','36','39','42'],     dogru: 1 },
    { metin: '2 × 15 = ?',     secenekler: ['25','30','35','40'],     dogru: 1 },
    { metin: '720 - 320 = ?',  secenekler: ['300','350','400','450'], dogru: 2 },
    { metin: 'Bir düzine kaç tanedir?', secenekler: ['10','11','12','13'], dogru: 2 },
    { metin: '100 TL\'lik bir oyuncak ve 50 TL ödendi, kalan?', secenekler: ['25','40','50','75'], dogru: 2 },
  ],

  // === 4. SINIF — 5 basamağa kadar, çarpma/bölme (3 bas. ile 1 bas.), kesirlerde toplama-çıkarma ===
  4: [
    { metin: '1234 + 5678 = ?', secenekler: ['6802','6812','6912','7912'], dogru: 2 },
    { metin: '4500 - 1875 = ?', secenekler: ['2525','2625','2725','3625'], dogru: 1 },
    { metin: '125 × 4 = ?',     secenekler: ['450','480','500','520'],    dogru: 2 },
    { metin: '243 × 3 = ?',     secenekler: ['629','729','829','929'],    dogru: 1 },
    { metin: '648 ÷ 8 = ?',     secenekler: ['71','81','82','91'],        dogru: 1 },
    { metin: '720 ÷ 9 = ?',     secenekler: ['70','75','80','90'],        dogru: 2 },
    { metin: '1/4 + 1/4 = ?',   secenekler: ['1/8','2/8','1/2','2/4 değil'], dogru: 2 },
    { metin: '3/5 + 1/5 = ?',   secenekler: ['3/10','4/10','4/5','3/5'],  dogru: 2 },
    { metin: '5/6 - 2/6 = ?',   secenekler: ['1/6','2/6','3/6','5/12'],   dogru: 2 },
    { metin: '15 × 12 = ?',     secenekler: ['170','180','190','200'],    dogru: 1 },
    { metin: '24 × 5 = ?',      secenekler: ['100','110','120','130'],    dogru: 2 },
    { metin: '999 ÷ 9 = ?',     secenekler: ['99','100','101','111'],     dogru: 3 },
    { metin: '12 × 11 = ?',     secenekler: ['121','122','132','142'],    dogru: 2 },
    { metin: 'Bir karenin alanı: kenar 6 cm', secenekler: ['12','24','30','36'], dogru: 3 },
    { metin: 'Bir karenin çevresi: kenar 7 cm', secenekler: ['14','21','28','35'], dogru: 2 },
    { metin: '90° açı ne tür?', secenekler: ['Dar','Dik','Geniş','Doğru'], dogru: 1 },
    { metin: '9999 + 1 = ?',    secenekler: ['9990','10000','10009','10999'], dogru: 1 },
    { metin: '500 × 4 = ?',     secenekler: ['1500','2000','2500','5000'], dogru: 1 },
    { metin: '8 × 125 = ?',     secenekler: ['800','900','1000','1100'],  dogru: 2 },
    { metin: '36 ÷ 6 + 4 = ?',  secenekler: ['8','9','10','11'],          dogru: 2 },
    { metin: '7 × 8 + 14 = ?',  secenekler: ['60','65','70','75'],        dogru: 2 },
    { metin: '1 km = ? m',      secenekler: ['10','100','1000','10000'],  dogru: 2 },
    { metin: '1 ton = ? kg',    secenekler: ['10','100','1000','10000'],  dogru: 2 },
    { metin: 'Beşgenin kaç kenarı var?', secenekler: ['3','4','5','6'], dogru: 2 },
    { metin: 'Altıgenin kaç kenarı var?', secenekler: ['4','5','6','8'], dogru: 2 },
  ],
};

// Soru sıralaması: her sınıfın havuzunda ilk sorular daha kolay (temel hesap),
// son sorular daha zor (problem cümleleri, geometri, ölçü dönüştürme vb.).
// Level'a göre uygun alt-aralık seçilir.

const LEVEL_ARALIK = {
  1: { baslangicOran: 0.00, bitisOran: 0.45, etiket: 'KOLAY' },   // ilk %0-45
  2: { baslangicOran: 0.30, bitisOran: 0.75, etiket: 'ORTA' },    // %30-75
  3: { baslangicOran: 0.55, bitisOran: 1.00, etiket: 'ZOR' },     // son %55-100
};

export function levelZorlukEtiket(levelNo) {
  return (LEVEL_ARALIK[levelNo] || LEVEL_ARALIK[1]).etiket;
}

// Rastgele soru seç. level=1|2|3 verildiğinde havuzun ilgili alt-aralığından çeker.
export function rastgeleSoru(sinif, kullanilmis = new Set(), levelNo = 1) {
  const havuz = QUESTIONS[sinif] || QUESTIONS[1];
  const aralik = LEVEL_ARALIK[levelNo] || LEVEL_ARALIK[1];

  const ilk = Math.floor(havuz.length * aralik.baslangicOran);
  const son = Math.max(ilk + 1, Math.floor(havuz.length * aralik.bitisOran));

  // Level alt-aralığındaki orijinal indeksleri topla
  const altIndeks = [];
  for (let i = ilk; i < son; i++) altIndeks.push(i);

  // Bu aralıkta kullanılmamış sorular
  const aday = altIndeks.filter(i => !kullanilmis.has(i));
  const liste = aday.length ? aday : altIndeks; // hepsi kullanılmışsa aralığı sıfırla

  const orijinalIdx = liste[Math.floor(Math.random() * liste.length)];
  return { soru: havuz[orijinalIdx], idx: orijinalIdx };
}
