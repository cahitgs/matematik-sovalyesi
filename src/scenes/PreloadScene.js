export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  preload() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Yükleme barı
    const barW = 480, barH = 24;
    const bx = (W - barW) / 2, by = H / 2 - barH / 2;
    this.add.text(W / 2, by - 40, 'YÜKLENİYOR...', {
      fontFamily: 'Trebuchet MS', fontSize: '22px', color: '#ffd9a0', fontStyle: 'bold',
    }).setOrigin(0.5);
    const cerceve = this.add.rectangle(W / 2, H / 2, barW + 8, barH + 8, 0x000000).setStrokeStyle(2, 0xffd9a0);
    const dolgu = this.add.rectangle(bx, by, 1, barH, 0xffd9a0).setOrigin(0, 0);
    this.load.on('progress', (p) => { dolgu.width = barW * p; });

    // === Karakter sprite sheet'leri ===
    // Grid bilgisi: walk 4x4 64px, idle 1x4 64px, attack 1x6 64px, jump 1x4 64px
    this.load.spritesheet('yigit_walk',   'public/assets/sprites/characters/yigit_walk.png',   { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('yigit_idle',   'public/assets/sprites/characters/yigit_idle.png',   { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('yigit_attack', 'public/assets/sprites/characters/yigit_attack.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('yigit_jump',   'public/assets/sprites/characters/yigit_jump.png',   { frameWidth: 64, frameHeight: 64 });

    // === Düşmanlar ===
    this.load.spritesheet('slime',   'public/assets/sprites/enemies/slime.png',   { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('goblin',  'public/assets/sprites/enemies/goblin.png',  { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ejderha', 'public/assets/sprites/enemies/ejderha.png', { frameWidth: 96, frameHeight: 96 });

    // === FX ===
    this.load.spritesheet('fx_kilic', 'public/assets/sprites/fx/fx_kilic_swing.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('fx_hasar', 'public/assets/sprites/fx/fx_hasar.png',       { frameWidth: 32, frameHeight: 32 });

    // === Arkaplanlar ===
    this.load.image('bg_forest', 'public/assets/backgrounds/bg_forest.png');
    this.load.image('bg_cave',   'public/assets/backgrounds/bg_cave.png');
    this.load.image('bg_castle', 'public/assets/backgrounds/bg_castle.png');

    // === UI ===
    this.load.image('ui_heart',          'public/assets/ui/ui_health_heart.png');
    this.load.image('ui_question_panel', 'public/assets/ui/ui_question_panel.png');
    this.load.image('ui_button',         'public/assets/ui/ui_button_answer.png');
    this.load.image('ui_coin',           'public/assets/ui/ui_coin.png');
    this.load.image('ui_logo',           'public/assets/ui/ui_logo.png');

    // === Tileset ===
    this.load.image('tileset_platform', 'public/assets/tilesets/tileset_platform.png');

    // === Ses (üretim sırasında WAV olarak kaydedildi) ===
    this.load.audio('music_menu',   'public/assets/audio/music/music_menu.wav');
    this.load.audio('music_battle', 'public/assets/audio/music/music_battle.wav');
    this.load.audio('sfx_jump',     'public/assets/audio/sfx/sfx_jump.wav');
    this.load.audio('sfx_attack',   'public/assets/audio/sfx/sfx_attack.wav');
    this.load.audio('sfx_correct',  'public/assets/audio/sfx/sfx_correct.wav');
    this.load.audio('sfx_wrong',    'public/assets/audio/sfx/sfx_wrong.wav');
    this.load.audio('sfx_hurt',     'public/assets/audio/sfx/sfx_hurt.wav');
    this.load.audio('sfx_coin',     'public/assets/audio/sfx/sfx_coin.wav');

    // Ses yükleme hatası olursa oyunu kilitleme
    this.load.on('loaderror', (file) => {
      console.warn('Yüklenemedi:', file.key, file.src);
    });
  }

  create() {
    this.olusturAnimasyonlar();
    this.scene.start('MenuScene');
  }

  olusturAnimasyonlar() {
    const a = this.anims;

    // Şövalye yürüyüş (4x4 sheet — sağa yürüyüş satırı: frame 8-11; sola: 4-7)
    if (!a.exists('yigit-walk-right')) {
      a.create({ key: 'yigit-walk-right', frames: a.generateFrameNumbers('yigit_walk', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
      a.create({ key: 'yigit-walk-left',  frames: a.generateFrameNumbers('yigit_walk', { start: 4, end: 7 }),  frameRate: 10, repeat: -1 });
    }
    if (!a.exists('yigit-idle')) {
      a.create({ key: 'yigit-idle', frames: a.generateFrameNumbers('yigit_idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    }
    if (!a.exists('yigit-attack')) {
      a.create({ key: 'yigit-attack', frames: a.generateFrameNumbers('yigit_attack', { start: 0, end: 5 }), frameRate: 14, repeat: 0 });
    }
    if (!a.exists('yigit-jump')) {
      a.create({ key: 'yigit-jump', frames: a.generateFrameNumbers('yigit_jump', { start: 0, end: 3 }), frameRate: 8, repeat: 0 });
    }

    // Slime (8 frame, basit döngü)
    if (!a.exists('slime-walk')) {
      a.create({ key: 'slime-walk', frames: a.generateFrameNumbers('slime', { start: 0, end: 7 }), frameRate: 6, repeat: -1 });
    }
    // Goblin (8 frame)
    if (!a.exists('goblin-walk')) {
      a.create({ key: 'goblin-walk', frames: a.generateFrameNumbers('goblin', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    }
    // Ejderha (8 frame)
    if (!a.exists('ejderha-walk')) {
      a.create({ key: 'ejderha-walk', frames: a.generateFrameNumbers('ejderha', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });
    }

    // FX
    if (!a.exists('fx-kilic')) {
      a.create({ key: 'fx-kilic', frames: a.generateFrameNumbers('fx_kilic', { start: 0, end: 4 }), frameRate: 22, repeat: 0 });
    }
    if (!a.exists('fx-hasar')) {
      a.create({ key: 'fx-hasar', frames: a.generateFrameNumbers('fx_hasar', { start: 0, end: 3 }), frameRate: 18, repeat: 0 });
    }
  }
}
