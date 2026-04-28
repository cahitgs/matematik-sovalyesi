// Generic düşman: slime / goblin / ejderha
// Boss (ejderha) için: can > 1 → her doğru cevapta -1, can=0 olunca ölür.

const TUR_AYAR = {
  slime: {
    spriteKey: 'slime',
    animKey: 'slime-walk',
    bodyW: 28, bodyH: 22, offsetX: 10, offsetY: 22,
    olcek: 1.0, depth: 5,
  },
  goblin: {
    spriteKey: 'goblin',
    animKey: 'goblin-walk',
    bodyW: 32, bodyH: 46, offsetX: 16, offsetY: 14,
    olcek: 1.0, depth: 5,
  },
  ejderha: {
    spriteKey: 'ejderha',
    animKey: 'ejderha-walk',
    bodyW: 64, bodyH: 70, offsetX: 16, offsetY: 18,
    olcek: 1.4, depth: 5,
  },
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, tur, opts = {}) {
    const ayar = TUR_AYAR[tur] || TUR_AYAR.slime;
    super(scene, x, y, ayar.spriteKey, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0, 0);
    this.setSize(ayar.bodyW, ayar.bodyH);
    this.setOffset(ayar.offsetX, ayar.offsetY);
    this.setDepth(ayar.depth);
    this.setScale(ayar.olcek);

    this.scene = scene;
    this.tur = tur;
    this.canMax = opts.can || 1;
    this.can = this.canMax;
    this.hiz = opts.hiz || 50;
    this.menzil = opts.menzil || 80;
    this.boss = !!opts.boss;
    this.olu = false;

    this.yon = Phaser.Math.Between(0, 1) ? 1 : -1;
    this.baslangicX = x;

    if (scene.anims.exists(ayar.animKey)) this.play(ayar.animKey);

    // Boss başının üstünde can çubuğu
    if (this.boss) {
      this.canBarArka = scene.add.rectangle(x, y - 60, 80, 8, 0x000000, 0.6).setStrokeStyle(1, 0xffd9a0);
      this.canBar = scene.add.rectangle(x, y - 60, 76, 5, 0xff5566).setOrigin(0.5);
      this.canBarArka.setDepth(20);
      this.canBar.setDepth(21);
    }
  }

  guncelle() {
    if (this.olu) return;
    if (this.boss) {
      // Boss patrol etmesin, sadece can barını takip etsin
      if (this.canBarArka) { this.canBarArka.x = this.x; this.canBarArka.y = this.y - 60; }
      if (this.canBar)     { this.canBar.x = this.x;     this.canBar.y = this.y - 60; }
      return;
    }
    if (!this.body.blocked.down) return;

    if (this.x > this.baslangicX + this.menzil) this.yon = -1;
    if (this.x < this.baslangicX - this.menzil) this.yon = 1;
    this.setVelocityX(this.hiz * this.yon);
    this.setFlipX(this.yon === -1);
  }

  hasarAl() {
    if (this.olu) return;
    this.can -= 1;
    this.scene.tweens.add({
      targets: this, alpha: 0.3, duration: 80, yoyo: true, repeat: 2,
    });
    this.setTint(0xff8888);
    this.scene.time.delayedCall(280, () => { if (this.active) this.clearTint(); });

    if (this.canBar) {
      const oran = Math.max(0, this.can / this.canMax);
      this.scene.tweens.add({ targets: this.canBar, scaleX: oran, duration: 200, ease: 'Cubic.easeOut' });
    }
    if (this.can <= 0) this.oldur();
  }

  oldur() {
    if (this.olu) return;
    this.olu = true;
    if (this.body) this.body.enable = false;

    const fx = this.scene.add.sprite(this.x, this.y, 'fx_hasar').setScale(this.boss ? 4 : 2);
    fx.setDepth(this.depth + 1);
    fx.play('fx-hasar');
    fx.once('animationcomplete', () => fx.destroy());

    if (this.canBarArka) this.canBarArka.destroy();
    if (this.canBar)     this.canBar.destroy();

    this.scene.tweens.add({
      targets: this, alpha: 0, y: this.y - 20,
      duration: this.boss ? 700 : 380,
      ease: 'Cubic.easeOut',
      onComplete: () => { if (this.scene && this.active) this.destroy(); },
    });
  }
}
