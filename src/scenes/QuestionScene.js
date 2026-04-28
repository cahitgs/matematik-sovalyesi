import { rastgeleSoru, levelZorlukEtiket } from '../data/questions.js?v=5';

export class QuestionScene extends Phaser.Scene {
  constructor() { super({ key: 'QuestionScene' }); }

  init(data) {
    this.sinif = data.sinif || 1;
    this.levelNo = data.levelNo || 1;
    this.kullanilmis = data.kullanilmis || new Set();
    this.bossModu = !!data.bossModu;
    this.bossCanKalan = data.bossCanKalan || 0;
    this.bossCanMax = data.bossCanMax || 0;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Karartma
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7);

    // Arka dekoratif çerçeve — AI question panel görseli (büyük + soluk parchment efekti)
    this.add.image(W / 2, H / 2 - 10, 'ui_question_panel')
      .setDisplaySize(820, 460)
      .setAlpha(0.32)
      .setTint(0xfff0c0);

    // Panel arkaplanı (primitive — üstte, okunaklı)
    const pW = 720, pH = 380;
    this.add.rectangle(W / 2, H / 2 - 10, pW + 10, pH + 10, 0x6b3a1a).setOrigin(0.5);
    this.add.rectangle(W / 2, H / 2 - 10, pW, pH, 0xf2dcb0).setOrigin(0.5).setStrokeStyle(3, 0x8b5a14);
    this.add.rectangle(W / 2, H / 2 - 10, pW - 24, pH - 24, 0xfff3d6).setOrigin(0.5);

    // Soru havuzundan seç (level'a göre alt-aralıktan)
    const { soru, idx } = rastgeleSoru(this.sinif, this.kullanilmis, this.levelNo);
    this.soru = soru;
    this.soruIdx = idx;
    this.dogruIdx = soru.dogru;

    // Başlık
    const zorluk = levelZorlukEtiket(this.levelNo);
    const zorlukRenk = this.levelNo === 1 ? '#2a8b2a' : (this.levelNo === 2 ? '#c97a2a' : '#cc2244');
    let baslik = `${this.sinif}. SINIF — ZORLUK: ${zorluk}`;
    if (this.bossModu) {
      baslik = `🐉 BOSS — KALAN CAN: ${this.bossCanKalan}/${this.bossCanMax}`;
    }
    this.add.text(W / 2, H / 2 - 150, baslik, {
      fontFamily: 'Trebuchet MS', fontSize: this.bossModu ? '22px' : '18px',
      color: this.bossModu ? '#cc2244' : zorlukRenk, fontStyle: 'bold',
    }).setOrigin(0.5);

    // Boss modunda sol-sağ köşelerde küçük ui_health_heart dekorları
    if (this.bossModu) {
      for (let i = 0; i < this.bossCanKalan; i++) {
        this.add.image(W / 2 - 280 + i * 32, H / 2 - 152, 'ui_health_heart').setDisplaySize(28, 28);
        this.add.image(W / 2 + 280 - i * 32, H / 2 - 152, 'ui_health_heart').setDisplaySize(28, 28);
      }
    }

    // Soru metni
    this.add.text(W / 2, H / 2 - 90, soru.metin, {
      fontFamily: 'Trebuchet MS', fontSize: '36px', color: '#2a1605', fontStyle: 'bold',
      align: 'center', wordWrap: { width: 620 },
    }).setOrigin(0.5);

    // 4 cevap butonu
    const btnW = 220, btnH = 64, gapX = 28, gapY = 18;
    const startX = W / 2 - btnW / 2 - gapX / 2;
    const startY = H / 2 + 20;
    this.cevapBtnlari = [];
    soru.secenekler.forEach((sec, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = startX + col * (btnW + gapX) + btnW / 2;
      const y = startY + row * (btnH + gapY) + btnH / 2;
      const btn = this.olusturCevapBtn(x, y, btnW, btnH, sec, i);
      this.cevapBtnlari.push(btn);
    });

    // İpucu / mesaj alanı
    this.altMesaj = this.add.text(W / 2, H - 28,
      'Doğru cevabı seç. Yanlış cevap 1 can götürür.',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#caa17a', align: 'center' }
    ).setOrigin(0.5);

    // Klavye 1-4
    this.input.keyboard.on('keydown-ONE',   () => this.cevapla(0));
    this.input.keyboard.on('keydown-TWO',   () => this.cevapla(1));
    this.input.keyboard.on('keydown-THREE', () => this.cevapla(2));
    this.input.keyboard.on('keydown-FOUR',  () => this.cevapla(3));

    this.cevaplandi = false;
  }

  olusturCevapBtn(x, y, w, h, label, idx) {
    const arka = this.add.rectangle(x, y, w, h, 0xc97a2a)
      .setStrokeStyle(3, 0x6b3a1a)
      .setInteractive({ useHandCursor: true });
    this.add.rectangle(x, y + 3, w, h, 0x6b3a1a, 0.3).setDepth(arka.depth - 1);

    const yazi = this.add.text(x, y, label, {
      fontFamily: 'Trebuchet MS', fontSize: '24px', color: '#ffffff', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 4,
    }).setOrigin(0.5);

    arka.on('pointerover', () => { if (!this.cevaplandi) arka.setFillStyle(0xe09140); });
    arka.on('pointerout',  () => { if (!this.cevaplandi) arka.setFillStyle(0xc97a2a); });
    arka.on('pointerdown', () => this.cevapla(idx));

    return { arka, yazi, idx };
  }

  cevapla(idx) {
    if (this.cevaplandi) return;
    this.cevaplandi = true;
    const dogru = idx === this.dogruIdx;

    // Seçilen butonu vurgula
    const sec = this.cevapBtnlari[idx];
    if (sec) sec.arka.setFillStyle(dogru ? 0x66cc55 : 0xdd4433);

    // Yanlışsa doğru cevabı yeşil göster
    if (!dogru) {
      const dogruBtn = this.cevapBtnlari[this.dogruIdx];
      if (dogruBtn) {
        dogruBtn.arka.setFillStyle(0x66cc55);
        dogruBtn.arka.setStrokeStyle(4, 0xffe9c2);
      }
      // Alt mesajı güncelle
      const dogruCevap = this.soru.secenekler[this.dogruIdx];
      this.altMesaj.setStyle({ color: '#cc2244', fontSize: '16px', fontStyle: 'bold' });
      this.altMesaj.setText(`Doğru cevap: ${dogruCevap}   (yeşil işaretli)`);
    } else {
      this.altMesaj.setStyle({ color: '#2a8b2a', fontSize: '16px', fontStyle: 'bold' });
      this.altMesaj.setText('✓ DOĞRU!');
    }

    // Yanlışsa daha uzun gecikme — oyuncu doğru cevabı görsün
    const gecikme = dogru ? 600 : 1700;
    this.time.delayedCall(gecikme, () => {
      const oyun = this.scene.get('GameScene');
      this.scene.resume('GameScene');
      this.scene.stop();
      oyun.events.emit('soru-cevaplandi', { dogru, soruIdx: this.soruIdx });
    });
  }
}
