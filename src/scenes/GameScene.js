import { Knight } from '../entities/Knight.js?v=5';
import { Enemy } from '../entities/Enemy.js?v=5';
import { levelGetir, sinifSkala } from '../data/levels.js?v=5';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelNo = data?.levelNo || 1;
    this.devamSkor = data?.devamSkor;       // önceki leveldan gelen skor
    this.devamCan  = data?.devamCan;        // önceki leveldan gelen can
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    // Dokunmatik d-pad yalnızca aktif oynanışta görünsün (menü/soru/end ekranında değil)
    document.body.classList.add('oyun-sahnesi');
    document.body.classList.remove('soru-acik');
    this.kullanilmisSorular = new Set();
    this.aktifKarsilasma = null;
    this.bitisTetiklendi = false;

    const level = levelGetir(this.levelNo);
    const skala = sinifSkala(window.GAME_STATE.sinif);
    this.level = level;
    this.skala = skala;

    // Skor/can — devamlı gelirse onları kullan, yoksa skala başlangıç
    if (typeof this.devamSkor === 'number') {
      window.GAME_STATE.skor = this.devamSkor;
    } else {
      window.GAME_STATE.skor = 0;
    }
    if (typeof this.devamCan === 'number') {
      window.GAME_STATE.can = this.devamCan;
    } else {
      window.GAME_STATE.can = skala.canBaslangic;
    }
    window.GAME_STATE.canMax = skala.canBaslangic;

    // Dünya boyutu
    const dunyaW = 2200;

    // === Parallax arkaplan: uzak (yavaş) + yakın (hızlı) ===
    // Uzak katman — ana BG, scrollFactor = 0.3 (TileSprite ile yatay tekrar)
    const tex = this.textures.get(level.bgKey).getSourceImage();
    const bgScale = tex && tex.height ? H / tex.height : 1;

    const bgUzak = this.add.tileSprite(0, 0, dunyaW, H, level.bgKey).setOrigin(0, 0);
    bgUzak.setTileScale(bgScale * 0.95, bgScale);
    bgUzak.setScrollFactor(0.3, 0);
    bgUzak.setTint(0x9999bb); // uzak katman hafif soluk

    // Yakın katman — aynı BG, scrollFactor 1, hafif transparan, alt yarıya doğru
    const bgYakin = this.add.tileSprite(0, H * 0.35, dunyaW, H * 0.65, level.bgKey).setOrigin(0, 0);
    bgYakin.setTileScale(bgScale, bgScale);
    bgYakin.setScrollFactor(0.7, 0);
    bgYakin.setAlpha(0.55);

    // === Zemin ve platformlar (sabit dikdörtgenler — basit tilemap simülasyonu) ===
    this.platformlar = this.physics.add.staticGroup();
    this.tilesetOlustur(dunyaW, H);

    level.platformlar.forEach(p => {
      const renkler = this.platformRenkleri();
      const r = this.add.rectangle(p.x, p.y, p.w, 22, renkler.govde).setStrokeStyle(2, renkler.kenar);
      this.add.rectangle(p.x, p.y - 10, p.w, 4, renkler.ust);
      this.physics.add.existing(r, true);
      this.platformlar.add(r);
    });

    // Dünya/kamera
    this.physics.world.setBounds(0, 0, dunyaW, H);
    this.cameras.main.setBounds(0, 0, dunyaW, H);

    // === Şövalye ===
    this.sovalye = new Knight(this, 100, H - 120);
    this.cameras.main.startFollow(this.sovalye, true, 0.1, 0.1);
    this.physics.add.collider(this.sovalye, this.platformlar);

    // === Düşmanlar ===
    this.dusmanlar = this.physics.add.group();
    level.dusmanlar.forEach(p => {
      const e = new Enemy(this, p.x, p.y, level.dusmanTuru, {
        can: level.dusmanCanı,
        hiz: skala.dusmanHiz,
        menzil: skala.slimeMenzil,
        boss: level.boss,
      });
      this.dusmanlar.add(e);
    });
    this.physics.add.collider(this.dusmanlar, this.platformlar);

    // Çarpışma → soru
    this.physics.add.overlap(this.sovalye, this.dusmanlar, (sov, e) => {
      if (e.olu || this.aktifKarsilasma) return;
      this.soruyuBaslat(e);
    });

    // === Klavye ===
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zKey = this.input.keyboard.addKey('Z');
    this.sovalye.klavyeBagla(this.zKey);

    // === HUD ===
    this.hudOlustur();
    this.levelGirisYazi();

    // === Müzik ===
    if (this.cache.audio.exists(level.muzikKey)) {
      this.muzik = this.sound.add(level.muzikKey, { loop: true, volume: 0.4 });
      this.muzik.play();
    }

    this.events.on('soru-cevaplandi', (sonuc) => this.soruSonucIsle(sonuc));
    this.input.keyboard.on('keydown-ESC', () => this.menuyeDon());

    this.events.once('shutdown', () => {
      if (this.muzik) { this.muzik.stop(); this.muzik = null; }
      this.events.off('soru-cevaplandi');
      document.body.classList.remove('oyun-sahnesi', 'soru-acik');
    });
  }

  // Level temasına göre renk paleti
  platformRenkleri() {
    if (this.levelNo === 1) return { govde: 0x6b3a1a, kenar: 0x2a1605, ust: 0x8bbb3a };
    if (this.levelNo === 2) return { govde: 0x4a4055, kenar: 0x1f1a25, ust: 0x6b5a8a };
    return                    { govde: 0x5a5a72, kenar: 0x2a2a3c, ust: 0x9090b0 };
  }

  tilesetOlustur(dunyaW, H) {
    // Ana zemin: tile-vari blok desen (32px tile) + üst çim/kaya çizgisi
    const zeminY = H - 32;
    const ren = this.platformRenkleri();

    // Tileset doku katmanı (görsel) — zemin alanını AI tileset görseli ile döşe
    const dokulu = this.add.tileSprite(0, zeminY - 32, dunyaW, 64, 'tileset_platform').setOrigin(0, 0);
    dokulu.setTileScale(0.25, 0.25);
    dokulu.setAlpha(0.55);
    if (this.levelNo === 2) dokulu.setTint(0x8088aa);
    if (this.levelNo === 3) dokulu.setTint(0xa0a0c0);

    // Renkli zemin (fizik için) — tile dokusunun altında
    const ana = this.add.rectangle(dunyaW / 2, zeminY, dunyaW, 64, ren.govde).setOrigin(0.5);
    ana.setDepth(-1);
    this.physics.add.existing(ana, true);
    this.platformlar.add(ana);

    // Üst süs şerit
    this.add.rectangle(dunyaW / 2, zeminY - 26, dunyaW, 8, ren.ust).setOrigin(0.5);

    // Tile çizgileri (sadece görsel, 32px aralıklarla dikey çizgi)
    const g = this.add.graphics();
    g.lineStyle(1, ren.kenar, 0.25);
    for (let x = 0; x < dunyaW; x += 32) {
      g.lineBetween(x, zeminY - 30, x, zeminY + 30);
    }
    g.lineStyle(2, ren.kenar, 0.7);
    g.lineBetween(0, zeminY - 30, dunyaW, zeminY - 30);
    g.setDepth(0);
  }

  levelGirisYazi() {
    const W = this.scale.width;
    const yazi = this.add.text(W / 2, 100, this.level.girisYazi, {
      fontFamily: 'Trebuchet MS', fontSize: '40px', color: '#ffe9c2', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150).setAlpha(0);
    this.tweens.add({
      targets: yazi, alpha: 1, duration: 400,
      onComplete: () => {
        this.time.delayedCall(1400, () => {
          this.tweens.add({ targets: yazi, alpha: 0, duration: 600, onComplete: () => yazi.destroy() });
        });
      },
    });
  }

  hudOlustur() {
    const W = this.scale.width;
    this.hud = this.add.container(0, 0).setScrollFactor(0).setDepth(100);

    const serit = this.add.rectangle(W / 2, 26, W, 52, 0x000000, 0.55).setOrigin(0.5);
    this.hud.add(serit);

    // Kalpler — canMax kadar çiz
    this.kalpler = [];
    const canMax = window.GAME_STATE.canMax;
    for (let i = 0; i < canMax; i++) {
      const k = this.olusturKalp(24 + i * 30, 26);
      this.hud.add(k);
      this.kalpler.push(k);
    }

    const coinX = 24 + canMax * 30 + 14;
    // ui_coin küçük boyutta — baked yazı seçilemez kadar küçük
    const coin = this.add.image(coinX, 26, 'ui_coin').setDisplaySize(28, 28);
    this.hud.add(coin);
    // Üzerinde kontrast için koyu arka halka
    const halka = this.add.circle(coinX, 26, 14, 0x000000, 0).setStrokeStyle(2, 0xffd84a);
    this.hud.add(halka);

    this.skorYazi = this.add.text(coinX + 18, 26, '0', {
      fontFamily: 'Trebuchet MS', fontSize: '22px', color: '#ffe9c2', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 3,
    }).setOrigin(0, 0.5);
    this.hud.add(this.skorYazi);

    // Level + Sınıf
    this.levelYazi = this.add.text(W - 16, 14, `LEVEL ${this.levelNo} — ${this.level.ad.toUpperCase()}`, {
      fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#ffd9a0', fontStyle: 'bold',
      stroke: '#1a0a04', strokeThickness: 2,
    }).setOrigin(1, 0.5);
    this.sinifYazi = this.add.text(W - 16, 36, `${window.GAME_STATE.sinif}. SINIF`, {
      fontFamily: 'Trebuchet MS', fontSize: '14px', color: '#caa17a', fontStyle: 'bold',
    }).setOrigin(1, 0.5);
    this.hud.add(this.levelYazi); this.hud.add(this.sinifYazi);

    this.hudGuncelle();
  }

  olusturKalp(x, y) {
    const g = this.add.graphics();
    g.fillStyle(0xff5566, 1);
    g.fillCircle(x - 5, y - 2, 6);
    g.fillCircle(x + 5, y - 2, 6);
    g.fillTriangle(x - 10, y, x + 10, y, x, y + 11);
    g.fillStyle(0xffaab2, 1);
    g.fillCircle(x - 6, y - 4, 1.8);
    return g;
  }

  hudGuncelle() {
    if (!this.kalpler) return;
    const can = window.GAME_STATE.can;
    this.kalpler.forEach((k, i) => k.setAlpha(i < can ? 1 : 0.2));
    if (this.skorYazi) this.skorYazi.setText(`${window.GAME_STATE.skor}`);
  }

  soruyuBaslat(dusman) {
    if (this.aktifKarsilasma) return;
    this.aktifKarsilasma = dusman;
    // Soru açıkken d-pad'i gizle ki cevap butonlarıyla çakışmasın
    document.body.classList.add('soru-acik');
    this.sovalye.kontrolKilitli = true;
    this.sovalye.setVelocity(0, 0);
    if (this.muzik) this.muzik.setVolume(0.12);

    this.scene.launch('QuestionScene', {
      sinif: window.GAME_STATE.sinif,
      levelNo: this.levelNo,
      kullanilmis: this.kullanilmisSorular,
      bossModu: this.level.boss && dusman.canMax > 1,
      bossCanKalan: dusman.can,
      bossCanMax: dusman.canMax,
    });
    this.scene.pause();
  }

  soruSonucIsle({ dogru, soruIdx }) {
    if (typeof soruIdx === 'number') this.kullanilmisSorular.add(soruIdx);
    const dusman = this.aktifKarsilasma;
    this.aktifKarsilasma = null;
    document.body.classList.remove('soru-acik');
    this.sovalye.kontrolKilitli = false;
    if (this.muzik) this.muzik.setVolume(0.4);

    if (dogru) {
      window.GAME_STATE.skor += 10;
      if (dusman && dusman.hasarAl) dusman.hasarAl();
      this.sesCal('sfx_correct', 0.7);
      this.sesCal('sfx_coin', 0.5);
    } else {
      window.GAME_STATE.can -= 1;
      this.sesCal('sfx_wrong', 0.7);
      this.sesCal('sfx_hurt', 0.5);
      if (this.sovalye && this.sovalye.hasarAl) this.sovalye.hasarAl();
      // Düşmanı kısa süreliğine pasif yap
      if (dusman && dusman.body) {
        dusman.body.enable = false;
        this.time.delayedCall(900, () => { if (dusman.active && dusman.body) dusman.body.enable = true; });
      }
    }
    this.hudGuncelle();
    this.bitisKontrol();
  }

  bitisKontrol() {
    if (this.bitisTetiklendi) return;
    if (window.GAME_STATE.can <= 0) {
      this.bitisTetiklendi = true;
      this.time.delayedCall(700, () => this.oyunBitir(false));
      return;
    }
    const kalan = this.dusmanlar.getChildren().filter(e => !e.olu).length;
    if (kalan === 0) {
      this.bitisTetiklendi = true;
      this.sovalye.kontrolKilitli = true;
      this.sovalye.setVelocity(0, 0);
      this.time.delayedCall(900, () => this.oyunBitir(true));
    }
  }

  oyunBitir(kazandi) {
    if (this.muzik) { this.muzik.stop(); this.muzik = null; }
    this.scene.start('EndScene', {
      kazandi,
      skor: window.GAME_STATE.skor,
      sinif: window.GAME_STATE.sinif,
      can:   window.GAME_STATE.can,
      levelNo: this.levelNo,
      sonrakiLevel: this.level.sonraki,
    });
  }

  menuyeDon() {
    if (this.muzik) { this.muzik.stop(); this.muzik = null; }
    this.scene.start('MenuScene');
  }

  sesCal(key, volume = 0.6) {
    if (this.cache.audio.exists(key)) this.sound.play(key, { volume });
  }

  update() {
    if (!this.sovalye) return;
    this.sovalye.guncelle(this.cursors, window.TOUCH_INPUT);
    this.dusmanlar.getChildren().forEach(e => e.guncelle());

    if (this.saldiriHitbox && !this.aktifKarsilasma) {
      this.physics.overlap(this.saldiriHitbox, this.dusmanlar, (hb, e) => {
        if (!e.olu && !this.aktifKarsilasma) this.soruyuBaslat(e);
      });
    }
  }
}
