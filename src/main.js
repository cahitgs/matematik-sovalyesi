import { PreloadScene } from './scenes/PreloadScene.js?v=5';
import { MenuScene } from './scenes/MenuScene.js?v=5';
import { GameScene } from './scenes/GameScene.js?v=5';
import { QuestionScene } from './scenes/QuestionScene.js?v=5';
import { EndScene } from './scenes/EndScene.js?v=5';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1024,
  height: 576,
  backgroundColor: '#1a0e0a',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1100 },
      debug: false,
    },
  },
  scene: [PreloadScene, MenuScene, GameScene, QuestionScene, EndScene],
};

window.GAME = new Phaser.Game(config);

// Paylaşılan oyun durumu (sınıf seçimi vb.)
window.GAME_STATE = {
  sinif: 1,
  can: 5,
  skor: 0,
};

// Touch kontrolleri için global event yayını (GameScene dinler)
window.TOUCH_INPUT = { left: false, right: false, jump: false, attack: false };

function bindTouchButton(id, key, type = 'hold') {
  const el = document.getElementById(id);
  if (!el) return;
  const press = (e) => { e.preventDefault(); window.TOUCH_INPUT[key] = true; };
  const release = (e) => { e.preventDefault(); window.TOUCH_INPUT[key] = false; };
  el.addEventListener('touchstart', press, { passive: false });
  el.addEventListener('touchend', release, { passive: false });
  el.addEventListener('touchcancel', release, { passive: false });
  el.addEventListener('mousedown', press);
  el.addEventListener('mouseup', release);
  el.addEventListener('mouseleave', release);
}
bindTouchButton('btn-left', 'left');
bindTouchButton('btn-right', 'right');
bindTouchButton('btn-jump', 'jump');
bindTouchButton('btn-attack', 'attack');
