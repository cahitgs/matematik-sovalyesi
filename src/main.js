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

// === Mobil yönlendirme: dikeyde "çevir" uyarısı, yatayda dokunmatik kontroller ===
// Birincil işaretçi "coarse" olan cihazlar = telefon/tablet. (Dokunmatik laptoplar
// birincil işaretçiyi fare/trackpad sayar → masaüstü deneyiminde kalır.)
const dokunmatikMi = window.matchMedia('(pointer: coarse)').matches;
if (dokunmatikMi) document.body.classList.add('is-touch');

function girisleriSifirla() {
  if (!window.TOUCH_INPUT) return;
  window.TOUCH_INPUT.left = false;
  window.TOUCH_INPUT.right = false;
  window.TOUCH_INPUT.jump = false;
  window.TOUCH_INPUT.attack = false;
}

function yonGuncelle() {
  const dikey = window.innerHeight > window.innerWidth;
  // Yatay zorlamayı yalnızca telefon-boyu ekranlarda uygula; tabletler dikeyde de oynayabilir
  const kucukEkran = Math.min(window.innerWidth, window.innerHeight) < 600;
  const cevirGerek = dikey && kucukEkran;
  document.body.classList.toggle('force-rotate', cevirGerek);

  // Çevir uyarısı açıkken: bekleyen dokunma girişlerini temizle (takılı tuş önlemi) + sesi sustur
  if (cevirGerek) girisleriSifirla();
  if (window.GAME && window.GAME.sound) window.GAME.sound.mute = cevirGerek;

  // Yön/boyut değişince Phaser canvas'ını yeni ekrana uydur
  if (window.GAME && window.GAME.scale && window.GAME.scale.refresh) {
    window.GAME.scale.refresh();
  }
}
yonGuncelle();

// Sekme/uygulama arka plana alınınca da basılı tuşları bırak
document.addEventListener('visibilitychange', () => { if (document.hidden) girisleriSifirla(); });
window.addEventListener('blur', girisleriSifirla);

let _yonTimer;
function ekranDegisti() {
  // iOS yön değişiminde boyutları geç günceller — kısa gecikme ile yeniden ölç
  clearTimeout(_yonTimer);
  _yonTimer = setTimeout(yonGuncelle, 120);
}
window.addEventListener('resize', ekranDegisti);
window.addEventListener('orientationchange', ekranDegisti);

// === Mobil ses kilidi: AudioContext yalnızca kullanıcı dokunuşundan sonra başlar ===
// Phaser'ın kendi kilit açması bazı mobil tarayıcılarda/WebView'lerde güvenilmezdir;
// her etkileşimde context'i açıkça devam ettiririz (zaten açıksa ucuz no-op).
function sesKilidiniAc() {
  const sm = window.GAME && window.GAME.sound;
  if (!sm) return;
  if (sm.context && sm.context.state === 'suspended') {
    sm.context.resume().catch(() => {});
  }
  if (sm.locked && sm.unlock) sm.unlock();
}
['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'].forEach((ev) =>
  window.addEventListener(ev, sesKilidiniAc, { passive: true })
);
// Sekmeye geri dönünce context yeniden askıya alınmış olabilir → tekrar aç
document.addEventListener('visibilitychange', () => { if (!document.hidden) sesKilidiniAc(); });
