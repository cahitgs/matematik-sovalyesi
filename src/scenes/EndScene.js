export class EndScene extends Phaser.Scene {
  constructor() { super({ key: 'EndScene' }); }

  init(data) {
    this.kazandi = !!data.kazandi;
    this.skor = data.skor || 0;
    this.sinif = data.sinif || 4;
    this.can = typeof data.can === 'number' ? data.can : 3;
    this.levelNo = data.levelNo || 1;
    this.sonrakiLevel = data.sonrakiLevel || null;
    this.maceraSonu = this.kazandi && !this.sonrakiLevel;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Arkaplan
    const bgKey = this.maceraSonu ? 'bg_castle' : (this.kazandi ? 'bg_forest' : 'bg_cave');
    const bg = this.add.image(W / 2, H / 2, bgKey);
    bg.setDisplaySize(W, H);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55);

    // Başlık
    let baslik, baslikRenk;
    if (this.maceraSonu) {
      baslik = 'MACERA TAMAMLANDI!';
      baslikRenk = '#ffd84a';
    } else if (this.kazandi) {
      baslik = 'LEVEL TAMAMLANDI!';
      baslikRenk = '#ffe9c2';
    } else {
      baslik = 'TEKRAR DENE';
      baslikRenk = '#ff9b8a';
    }
    this.add.text(W / 2, 110, baslik, {
      fontFamily: 'Trebuchet MS', fontSize: this.maceraSonu ? '52px' : '56px',
      color: baslikRenk, fontStyle: 'bold', stroke: '#1a0a04', strokeThickness: 6,
    }).setOrigin(0.5);

    // Alt başlık
    let altBaslik;
    if (this.maceraSonu) {
      altBaslik = `🏆 Tüm düşmanları yendin, ejderhayı bile!`;
    } else if (this.kazandi) {
      altBaslik = `Level ${this.levelNo} bitti — sıradaki seni bekliyor`;
    } else {
      altBaslik = 'Cesaretini kaybetme, bir kez daha dene!';
    }
    this.add.text(W / 2, 175, altBaslik, {
      fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#ffd9a0', align: 'center',
      wordWrap: { width: W - 100 },
    }).setOrigin(0.5);

    // İkon (primitive)
    this.cizIkon(W / 2, 270);

    // Skor + can kutusu
    const kutu = this.add.container(W / 2, 380);
    kutu.add(this.add.rectangle(0, 0, 360, 78, 0x000000, 0.55).setStrokeStyle(2, 0xffd9a0));
    kutu.add(this.add.text(-90, -14, 'SKOR', {
      fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#caa17a', fontStyle: 'bold',
    }).setOrigin(0.5));
    kutu.add(this.add.text(-90, 14, `${this.skor}`, {
      fontFamily: 'Trebuchet MS', fontSize: '26px', color: '#ffe9c2', fontStyle: 'bold',
    }).setOrigin(0.5));
    kutu.add(this.add.text(90, -14, 'CAN', {
      fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#caa17a', fontStyle: 'bold',
    }).setOrigin(0.5));
    kutu.add(this.add.text(90, 14, `${this.can}`, {
      fontFamily: 'Trebuchet MS', fontSize: '26px', color: '#ff7a8a', fontStyle: 'bold',
    }).setOrigin(0.5));

    // Butonlar
    if (this.kazandi && this.sonrakiLevel) {
      // Sonraki level + ana menü
      this.olusturBtn(W / 2 - 130, 480, 'SONRAKİ LEVEL', () => this.scene.start('GameScene', {
        levelNo: this.sonrakiLevel,
        devamSkor: this.skor,
        devamCan: Math.max(this.can, 2), // sonraki level'a en az 2 can ile başla
      }), 0x6bbb3a);
      this.olusturBtn(W / 2 + 130, 480, 'ANA MENÜ', () => this.scene.start('MenuScene'));
    } else if (this.maceraSonu) {
      this.olusturBtn(W / 2, 480, 'ANA MENÜYE DÖN', () => this.scene.start('MenuScene'), 0xffd84a, 320);
    } else {
      // Kaybetti
      this.olusturBtn(W / 2 - 130, 480, 'TEKRAR OYNA', () => this.scene.start('GameScene', {
        levelNo: this.levelNo,
      }));
      this.olusturBtn(W / 2 + 130, 480, 'ANA MENÜ', () => this.scene.start('MenuScene'));
    }

    // Ses
    if (this.kazandi && this.cache.audio.exists('sfx_correct')) {
      this.sound.play('sfx_correct', { volume: 0.7 });
    } else if (!this.kazandi && this.cache.audio.exists('sfx_wrong')) {
      this.sound.play('sfx_wrong', { volume: 0.6 });
    }
  }

  cizIkon(ix, iy) {
    const g = this.add.graphics();
    if (this.maceraSonu) {
      // Altın taç
      g.fillStyle(0xffd84a, 1);
      g.fillRect(ix - 32, iy + 8, 64, 14);
      g.fillTriangle(ix - 32, iy + 8, ix - 16, iy - 18, ix, iy + 8);
      g.fillTriangle(ix - 8,  iy + 8, ix,     iy - 26, ix + 8, iy + 8);
      g.fillTriangle(ix,      iy + 8, ix + 16, iy - 18, ix + 32, iy + 8);
      g.fillStyle(0xff5566, 1);
      g.fillCircle(ix - 16, iy - 16, 4);
      g.fillCircle(ix + 16, iy - 16, 4);
      g.fillStyle(0x66aaff, 1);
      g.fillCircle(ix, iy - 22, 4);
    } else if (this.kazandi) {
      // Kalp
      g.fillStyle(0xff5566, 1);
      g.fillCircle(ix - 18, iy - 8, 22);
      g.fillCircle(ix + 18, iy - 8, 22);
      g.fillTriangle(ix - 36, iy + 4, ix + 36, iy + 4, ix, iy + 42);
      g.fillStyle(0xffaab2, 1);
      g.fillCircle(ix - 22, iy - 14, 6);
    } else {
      // Gri kırık kalp
      g.fillStyle(0x666666, 1);
      g.fillCircle(ix - 18, iy - 8, 22);
      g.fillCircle(ix + 18, iy - 8, 22);
      g.fillTriangle(ix - 36, iy + 4, ix + 36, iy + 4, ix, iy + 42);
      // Kırık çizgi
      g.lineStyle(3, 0x1a0a04, 1);
      g.beginPath();
      g.moveTo(ix - 4, iy - 28);
      g.lineTo(ix + 6, iy - 8);
      g.lineTo(ix - 6, iy + 12);
      g.lineTo(ix + 4, iy + 32);
      g.strokePath();
    }
    this.tweens.add({
      targets: g, scaleX: 1.12, scaleY: 1.12, duration: 750, yoyo: true, repeat: -1, ease: 'Sine.inOut',
    });
  }

  olusturBtn(x, y, label, onClick, fillColor = 0xc97a2a, w = 220) {
    const h = 60;
    const arka = this.add.rectangle(x, y, w, h, fillColor)
      .setStrokeStyle(3, 0xffd9a0)
      .setInteractive({ useHandCursor: true });
    const yazi = this.add.text(x, y, label, {
      fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#1a0a04', fontStyle: 'bold',
    }).setOrigin(0.5);
    arka.on('pointerover', () => arka.setFillStyle(this.tonAyar(fillColor, 1.2)));
    arka.on('pointerout',  () => arka.setFillStyle(fillColor));
    arka.on('pointerdown', () => {
      arka.setFillStyle(this.tonAyar(fillColor, 0.7));
      this.time.delayedCall(80, onClick);
    });
  }

  tonAyar(hex, faktor) {
    const r = Math.min(255, Math.floor(((hex >> 16) & 0xff) * faktor));
    const g = Math.min(255, Math.floor(((hex >> 8)  & 0xff) * faktor));
    const b = Math.min(255, Math.floor(( hex        & 0xff) * faktor));
    return (r << 16) | (g << 8) | b;
  }
}
