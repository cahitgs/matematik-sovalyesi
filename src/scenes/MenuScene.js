export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Arkaplan (orman, hafif karartılmış)
    const bg = this.add.image(W / 2, H / 2, 'bg_forest');
    bg.setDisplaySize(W, H);
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a0a04, 0.35);

    // Tileset arkaplanı yatay şerit dekoru (alt kısımda hafif görsel)
    const tileBant = this.add.tileSprite(W / 2, H - 64, W, 96, 'tileset_platform').setOrigin(0.5);
    tileBant.setTileScale(0.18, 0.18);
    tileBant.setAlpha(0.22);

    // Logo arkasında AI logo görseli soluk dekor (parlama efekti gibi)
    const logoArka = this.add.image(W / 2, 130, 'ui_logo')
      .setDisplaySize(680, 200)
      .setAlpha(0.18)
      .setTint(0xffd84a);

    // Logo — AI görseli yerine metin (daha okunaklı + güvenilir)
    const logoGrup = this.add.container(W / 2, 130);
    const ust = this.add.text(0, -28, 'MATEMATİK', {
      fontFamily: 'Trebuchet MS', fontSize: '64px', color: '#ffd84a', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 8,
    }).setOrigin(0.5);
    const alt = this.add.text(0, 28, 'ŞÖVALYESİ', {
      fontFamily: 'Trebuchet MS', fontSize: '52px', color: '#ffe9c2', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 7,
    }).setOrigin(0.5);
    // Sol kılıç + sağ kalkan ikonları
    const kilic = this.add.text(-260, 0, '⚔', { fontSize: '64px', color: '#dadada' }).setOrigin(0.5);
    const kalkan = this.add.text(260, 0, '🛡', { fontSize: '54px' }).setOrigin(0.5);
    logoGrup.add([kilic, kalkan, ust, alt]);
    this.tweens.add({ targets: logoGrup, y: logoGrup.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Alt başlık
    this.add.text(W / 2, 240, 'Eğitsel Matematik Macerası', {
      fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#ffe9c2', fontStyle: 'italic',
    }).setOrigin(0.5);

    // Sınıf seçici
    this.add.text(W / 2, 290, 'Sınıfını Seç:', {
      fontFamily: 'Trebuchet MS', fontSize: '24px', color: '#ffd9a0', fontStyle: 'bold',
    }).setOrigin(0.5);

    const siniflar = [1, 2, 3, 4];
    const baseX = W / 2 - ((siniflar.length - 1) * 90) / 2;
    this.sinifBtnlari = {};
    siniflar.forEach((s, i) => {
      const x = baseX + i * 90;
      const btn = this.olusturSinifBtn(x, 350, s);
      this.sinifBtnlari[s] = btn;
    });
    this.secilenSinifGuncelle(window.GAME_STATE.sinif);

    // BAŞLA butonu (ui_button_answer arka olarak)
    const baslaBtn = this.olusturBuyukBtn(W / 2, 460, 'BAŞLA', () => {
      this.muzigiDurdur();
      this.scene.start('GameScene', { levelNo: 1 });
    });

    // Talimat
    this.add.text(W / 2, H - 36,
      'Ok tuşları: hareket   |   BOŞLUK: zıpla   |   Z: saldır',
      { fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#caa17a' }
    ).setOrigin(0.5);

    // Müzik
    this.muzikCal();
  }

  olusturSinifBtn(x, y, sinif) {
    const w = 70, h = 70;
    const arka = this.add.rectangle(x, y, w, h, 0x6b3a1a)
      .setStrokeStyle(3, 0xffd9a0)
      .setInteractive({ useHandCursor: true });
    const yazi = this.add.text(x, y, `${sinif}`, {
      fontFamily: 'Trebuchet MS', fontSize: '32px', color: '#ffe9c2', fontStyle: 'bold',
    }).setOrigin(0.5);
    arka.on('pointerover', () => arka.setFillStyle(0x8b4a22));
    arka.on('pointerout',  () => this.secilenSinifGuncelle(window.GAME_STATE.sinif));
    arka.on('pointerdown', () => {
      window.GAME_STATE.sinif = sinif;
      this.secilenSinifGuncelle(sinif);
    });
    return { arka, yazi, sinif };
  }

  secilenSinifGuncelle(sinif) {
    Object.values(this.sinifBtnlari || {}).forEach(b => {
      const aktif = b.sinif === sinif;
      b.arka.setFillStyle(aktif ? 0xc97a2a : 0x6b3a1a);
      b.arka.setStrokeStyle(3, aktif ? 0xffe9c2 : 0xffd9a0);
    });
  }

  olusturBuyukBtn(x, y, label, onClick) {
    const w = 280, h = 90;
    // ui_button_answer görselini buton arka planı yap
    const arka = this.add.image(x, y, 'ui_button_answer').setDisplaySize(w, h);
    // Üzerine yarı-saydam koyu katman (text okunaklığı için)
    const katman = this.add.rectangle(x, y, w - 12, h - 14, 0xc97a2a, 0.78)
      .setStrokeStyle(3, 0xffd9a0)
      .setInteractive({ useHandCursor: true });
    const yazi = this.add.text(x, y, label, {
      fontFamily: 'Trebuchet MS', fontSize: '32px', color: '#fff7e0', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 5,
    }).setOrigin(0.5);
    katman.on('pointerover', () => katman.setFillStyle(0xe09140, 0.85));
    katman.on('pointerout',  () => katman.setFillStyle(0xc97a2a, 0.78));
    katman.on('pointerdown', () => {
      katman.setFillStyle(0x8b4a22, 0.88);
      this.time.delayedCall(80, onClick);
    });
    return { arka, katman, yazi };
  }

  muzikCal() {
    if (window.MENU_MUSIC && window.MENU_MUSIC.isPlaying) return;
    if (this.cache.audio.exists('music_menu')) {
      window.MENU_MUSIC = this.sound.add('music_menu', { loop: true, volume: 0.45 });
      window.MENU_MUSIC.play();
    }
  }
  muzigiDurdur() {
    if (window.MENU_MUSIC) { window.MENU_MUSIC.stop(); window.MENU_MUSIC = null; }
  }
}
