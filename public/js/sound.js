// 🎵 Sounds to preload
const soundsToLoad = {
  button: '../sound/button.mp3',
  hover: '../sound/hover-button.mp3',
  attack: '../sound/sword.mp3',
  hit: '../sound/sword-slash.mp3',
  jump: '../sound/jumping.mp3',
  done: '../sound/fall.mp3',
  win1: '../sound/win1.mp3',
  win2: '../sound/win2.mp3',
  tie: '../sound/tie.mp3',
  run: '../sound/run.mp3',
  backgroundMusic: '../sound/bgMusic.mp3'
};

// Store globally
if (!window.gameSounds) window.gameSounds = {};




// ✅ Only load once
if (!window.soundsLoaded) {
  Object.entries(soundsToLoad).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    if (key === "backgroundMusic") {
      audio.loop = true;
      audio.volume = 0.2;
    }
    window.gameSounds[key] = audio;
  });

  window.soundsLoaded = true;
}

// ✅ Unlock + start bg music on first user action
function unlockAudio() {
  for (const key in window.gameSounds) {
    const sound = window.gameSounds[key];
    sound.play().then(() => {
      sound.pause();
      // only reset non-music sounds
      if (key !== "backgroundMusic") {
        sound.currentTime = 0;
      }
    }).catch(() => {});
  }

  // Resume music if it was already playing on last page
  if (localStorage.getItem("bgMusicPlaying") === "true") {
    window.gameSounds.backgroundMusic.play().catch(() => {});
  }

  // Save play/pause state
  window.gameSounds.backgroundMusic.addEventListener("play", () => {
    localStorage.setItem("bgMusicPlaying", "true");
  });
  window.gameSounds.backgroundMusic.addEventListener("pause", () => {
    localStorage.setItem("bgMusicPlaying", "false");
  });

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}
