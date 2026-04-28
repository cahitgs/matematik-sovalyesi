export class Knight extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'yigit_idle', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    // 64x64 sprite — gerçek karakter merkezde ~32x52 piksel kaplıyor
    this.setSize(24, 46);
    this.setOffset(20, 16);
    this.setMaxVelocity(220, 800);

    this.scene = scene;
    this.hiz = 200;
    this.zipHizi = 540;
    this.saldiriyor = false;
    this.bakiyon = 'right'; // 'left' | 'right'
    this.kontrolKilitli = false; // soru sahnesi açıkken donar
    this.play('yigit-idle');
  }

  guncelle(cursors, touch) {
    if (this.kontrolKilitli) {
      this.setVelocityX(0);
      return;
    }

    const sol  = cursors.left.isDown  || touch.left;
    const sag  = cursors.right.isDown || touch.right;
    const zip  = Phaser.Input.Keyboard.JustDown(cursors.up) ||
                 Phaser.Input.Keyboard.JustDown(cursors.space) ||
                 (touch.jump && !this._touchJumpHeld);
    const sald = Phaser.Input.Keyboard.JustDown(this._zKey) ||
                 (touch.attack && !this._touchAttackHeld);

    this._touchJumpHeld = touch.jump;
    this._touchAttackHeld = touch.attack;

    // Yatay hareket
    if (sol) {
      this.setVelocityX(-this.hiz);
      this.bakiyon = 'left';
      if (this.body.blocked.down && !this.saldiriyor) this.play('yigit-walk-left', true);
      this.setFlipX(false);
    } else if (sag) {
      this.setVelocityX(this.hiz);
      this.bakiyon = 'right';
      if (this.body.blocked.down && !this.saldiriyor) this.play('yigit-walk-right', true);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
      if (this.body.blocked.down && !this.saldiriyor) this.play('yigit-idle', true);
    }

    // Zıplama
    if (zip && this.body.blocked.down) {
      this.setVelocityY(-this.zipHizi);
      this.play('yigit-jump', true);
      this.scene.sesCal('sfx_jump', 0.5);
    }

    // Havadayken jump anim
    if (!this.body.blocked.down && !this.saldiriyor) {
      if (this.anims.currentAnim?.key !== 'yigit-jump') this.play('yigit-jump', true);
    }

    // Saldırı
    if (sald && !this.saldiriyor) this.saldir();
  }

  klavyeBagla(zKey) {
    this._zKey = zKey;
  }

  saldir() {
    this.saldiriyor = true;
    this.play('yigit-attack', true);
    this.scene.sesCal('sfx_attack', 0.55);

    // Kılıç FX
    const fxX = this.x + (this.bakiyon === 'right' ? 36 : -36);
    const fx = this.scene.add.sprite(fxX, this.y - 4, 'fx_kilic');
    fx.setFlipX(this.bakiyon === 'left');
    fx.setDepth(this.depth + 1);
    fx.play('fx-kilic');
    fx.once('animationcomplete', () => fx.destroy());

    // Saldırı hitbox (kısa süreli)
    const hbW = 50, hbH = 40;
    const hb = this.scene.add.zone(fxX, this.y, hbW, hbH);
    this.scene.physics.add.existing(hb);
    hb.body.setAllowGravity(false);
    hb.body.setImmovable(true);
    this.scene.saldiriHitbox = hb;

    this.once('animationcomplete-yigit-attack', () => {
      this.saldiriyor = false;
      if (hb && hb.destroy) hb.destroy();
      this.scene.saldiriHitbox = null;
    });
  }

  hasarAl() {
    this.scene.cameras.main.shake(180, 0.008);
    this.setTint(0xff6655);
    this.scene.time.delayedCall(220, () => this.clearTint());
    // Kısa geri itme
    this.setVelocityY(-260);
    this.setVelocityX(this.bakiyon === 'right' ? -160 : 160);
  }
}
