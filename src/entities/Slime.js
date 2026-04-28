export class Slime extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0, 0);
    // 48x48 sprite — slime gövdesi alt yarıda ~30x22
    this.setSize(28, 22);
    this.setOffset(10, 22);
    this.setDepth(5);

    this.scene = scene;
    this.hiz = 50;
    this.yon = Phaser.Math.Between(0, 1) ? 1 : -1;
    this.olu = false;
    this.play('slime-walk');

    // Patrol mesafesi
    this.baslangicX = x;
    this.menzil = 80;
  }

  guncelle() {
    if (this.olu) return;
    if (!this.body.blocked.down) return;

    // Basit patrol
    if (this.x > this.baslangicX + this.menzil) this.yon = -1;
    if (this.x < this.baslangicX - this.menzil) this.yon = 1;
    this.setVelocityX(this.hiz * this.yon);
    this.setFlipX(this.yon === -1);
  }

  oldur() {
    if (this.olu) return;
    this.olu = true;
    this.body.enable = false;
    this.setTint(0xffffff);

    // Hasar FX
    const fx = this.scene.add.sprite(this.x, this.y, 'fx_hasar').setScale(2);
    fx.setDepth(this.depth + 1);
    fx.play('fx-hasar');
    fx.once('animationcomplete', () => fx.destroy());

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y - 20,
      duration: 380,
      ease: 'Cubic.easeOut',
      onComplete: () => this.destroy(),
    });
  }
}
