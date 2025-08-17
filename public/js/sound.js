// 🎵 Sounds to preload
const soundsToLoad = {
  button: './sound/button.mp3',
  hover: './sound/hover-button.mp3',
  attack: './sound/sword.mp3',
  hit: './sound/sword-slash.mp3',
  jump: './sound/jumping.mp3',
  done: './sound/fall.mp3',
  win1: './sound/win1.mp3',
  win2: './sound/win2.mp3',
  tie: './sound/tie.mp3'
};

// Store preloaded sounds globally
window.gameSounds = {};

// ✅ Create Audio objects for each sound
Object.entries(soundsToLoad).forEach(([key, src]) => {
  const audio = new Audio(src);
  audio.preload = "auto";
  window.gameSounds[key] = audio;
});
