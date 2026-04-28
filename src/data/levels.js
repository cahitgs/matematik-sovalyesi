// Level konfigürasyonu — her level: arkaplan, düşman türü/sayısı, platform yerleşimi
// Sınıfa göre zorluk skalası ayrıca uygulanır.

export const LEVELS = {
  1: {
    ad: 'Orman',
    bgKey: 'bg_forest',
    bgYakin: null,
    muzikKey: 'music_battle',
    dusmanTuru: 'slime',
    dusmanCanı: 1,
    boss: false,
    dusmanlar: [
      { x: 540, y: 200 },
      { x: 1080, y: 200 },
      { x: 1620, y: 200 },
      { x: 1880, y: 200 },
    ],
    platformlar: [
      { x: 280, y: 416, w: 140 },
      { x: 560, y: 336, w: 120 },
      { x: 820, y: 396, w: 140 },
      { x: 1080, y: 316, w: 140 },
      { x: 1340, y: 376, w: 160 },
      { x: 1620, y: 296, w: 140 },
      { x: 1880, y: 416, w: 160 },
    ],
    sonraki: 2,
    girisYazi: '🌲 LEVEL 1 — ORMAN',
  },
  2: {
    ad: 'Mağara',
    bgKey: 'bg_cave',
    bgYakin: null,
    muzikKey: 'music_battle',
    dusmanTuru: 'goblin',
    dusmanCanı: 1,
    boss: false,
    dusmanlar: [
      { x: 420, y: 200 },
      { x: 760, y: 200 },
      { x: 1100, y: 200 },
      { x: 1440, y: 200 },
      { x: 1820, y: 200 },
    ],
    platformlar: [
      { x: 250, y: 416, w: 130 },
      { x: 500, y: 320, w: 110 },
      { x: 760, y: 396, w: 140 },
      { x: 1020, y: 300, w: 130 },
      { x: 1300, y: 376, w: 160 },
      { x: 1560, y: 280, w: 120 },
      { x: 1820, y: 380, w: 160 },
    ],
    sonraki: 3,
    girisYazi: '🕳️ LEVEL 2 — MAĞARA',
  },
  3: {
    ad: 'Kale',
    bgKey: 'bg_castle',
    bgYakin: null,
    muzikKey: 'music_battle',
    dusmanTuru: 'ejderha',
    dusmanCanı: 3,         // Boss: 3 doğru cevapta yenilir
    boss: true,
    dusmanlar: [
      { x: 1500, y: 180 },  // Tek boss, sağda
    ],
    platformlar: [
      { x: 280, y: 416, w: 140 },
      { x: 560, y: 336, w: 140 },
      { x: 850, y: 376, w: 160 },
      { x: 1150, y: 316, w: 140 },
      { x: 1450, y: 396, w: 200 },  // boss arenası
    ],
    sonraki: null,
    girisYazi: '🏰 LEVEL 3 — KALE BOSS',
  },
};

// Sınıfa göre zorluk skalası — küçük sınıflara daha çok can, daha yavaş düşman
export const SINIF_SKALA = {
  1: { canBaslangic: 5, dusmanHiz: 30, slimeMenzil: 60 },
  2: { canBaslangic: 4, dusmanHiz: 40, slimeMenzil: 70 },
  3: { canBaslangic: 4, dusmanHiz: 50, slimeMenzil: 90 },
  4: { canBaslangic: 3, dusmanHiz: 65, slimeMenzil: 110 },
};

export function levelGetir(no) {
  return LEVELS[no] || LEVELS[1];
}

export function sinifSkala(sinif) {
  return SINIF_SKALA[sinif] || SINIF_SKALA[1];
}
