document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      if (window.gameSounds.hover) {
        window.gameSounds.hover.currentTime = 0;
        window.gameSounds.hover.play();
      }
    });
  });
});


function openSettings() {

  if (window.gameSounds && window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }


  const modal = document.getElementById('settingsModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.add('show'), 50);
}

function closeSettings() {

  if (window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }

  const modal = document.getElementById('settingsModal');
  modal.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 400);
}



function buttonHover() {
      window.gameSounds.hover.currentTime = 0;
      window.gameSounds.hover.play();
    }

    function viewLeaderboard() {
      window.gameSounds.button.currentTime = 0;
      window.gameSounds.button.play();
      window.location.href = 'leaderboard.html';
    }

    function goToPlayerNames() {
      window.gameSounds.button.currentTime = 0;
      window.gameSounds.button.play();
      window.location.href = 'player-names.html';
    }
  
  
  document.addEventListener("DOMContentLoaded", () => {
  const soundToggle = document.getElementById("soundToggle");
  const musicToggle = document.getElementById("musicToggle");

  // --- Load persisted values ---
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false"; // default true
  const musicEnabled = localStorage.getItem("musicEnabled") === "true";  // default false

  if (soundToggle) soundToggle.checked = soundEnabled;
  if (musicToggle) musicToggle.checked = musicEnabled;

  // Apply immediately
  for (const key in window.gameSounds) {
    if (key !== "backgroundMusic") {
      window.gameSounds[key].muted = !soundEnabled;
    }
  }
  if (window.gameSounds.backgroundMusic) {
    if (musicEnabled) {
      window.gameSounds.backgroundMusic.play().catch(() => {});
    } else {
      window.gameSounds.backgroundMusic.pause();
    }
  }

  // --- Save on toggle ---
  soundToggle.addEventListener("change", () => {
    const enabled = soundToggle.checked;
    localStorage.setItem("soundEnabled", enabled);
    for (const key in window.gameSounds) {
      if (key !== "backgroundMusic") {
        window.gameSounds[key].muted = !enabled;
      }
    }
    if (enabled && window.gameSounds.button) {
      window.gameSounds.button.currentTime = 0;
      window.gameSounds.button.play();
    }
  });

  musicToggle.addEventListener("change", () => {
    const enabled = musicToggle.checked;
    localStorage.setItem("musicEnabled", enabled);
    
    if (window.gameSounds.button && soundToggle.checked) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }

    if (!window.gameSounds.backgroundMusic) return;
    if (enabled) {
      window.gameSounds.backgroundMusic.play().catch(() => {});
    } else {
      window.gameSounds.backgroundMusic.pause();
    }
  });
});
