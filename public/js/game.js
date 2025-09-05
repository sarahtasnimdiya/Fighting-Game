
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
let gameOver = false;
let shownGameOver = false;
let matchSaved = false;
let removedHidden = false;
let paused = false; 
let isRunSoundPlaying = false;


let timer = 60;
let timerId;

function decreaseTimer() {
  if (paused) {
    // retry check after 1s while paused
    timerId = setTimeout(decreaseTimer, 1000);
    return;
  }

  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  } else {
    // Time ran out
    const name1 = localStorage.getItem('player1Name') || 'Player 1';
    const name2 = localStorage.getItem('player2Name') || 'Player 2';

    if (player.health === enemy.health) {
      showGameOver('No One'); 
    } else if (player.health > enemy.health) {
      showGameOver(name1);
    } else {
      showGameOver(name2);
    }
  }
}


function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}




// generate sessionId once per browser session
let sessionId = sessionStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  sessionStorage.setItem("sessionId", sessionId);
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: '../img/background.png',
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: '../img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 50,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: '../img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: '../img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: '../img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: '../img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: '../img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: '../img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: '../img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: '../img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 60,
      y: 50
    },
    width: 160,
    height: 50
  }
})


const enemy = new Fighter({
  position: {
    x: 892,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: '../img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: '../img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: '../img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: '../img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: '../img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: '../img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: '../img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: '../img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -160,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}


function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

   if (paused) {
    player.switchSprite('idle');
    enemy.switchSprite('idle');
    return; // stop gameplay updates
  }

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement
  // Always face opponent
  player.facingLeft = player.position.x > enemy.position.x

  if (keys.a.pressed && player.lastKey === 'a'&& player.position.x > 0 ) {
    player.velocity.x = -5
    player.switchSprite('run')

    // Backpedaling if enemy is on the left but player is moving left (away)
    player.isBackpedaling = player.position.x < enemy.position.x
  } else if (keys.d.pressed && player.lastKey === 'd'&& player.position.x + player.width < canvas.width) {
    player.velocity.x = 5
    player.switchSprite('run')

    // Backpedaling if enemy is on the right but player is moving right (away)
    player.isBackpedaling = player.position.x > enemy.position.x
  } else {
    player.switchSprite('idle')
    player.isBackpedaling = false
  }


  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // enemy movement
  enemy.facingLeft = player.position.x > enemy.position.x
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width < canvas.width) {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // --- Running sound ---
if (
  (keys.a.pressed && player.lastKey === 'a') || 
  (keys.d.pressed && player.lastKey === 'd') ||
  (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') || 
  (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
) {
  playRunSound();
} else {
  stopRunSound();
}


  // player attack hits enemy
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // enemy attack hits player
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game - only trigger once
  if (!gameOver && (enemy.health <= 0 || player.health <= 0)) {
    gameOver = true; // ✅ prevent duplicates

    const name1 = localStorage.getItem('player1Name') || 'Player 1';
    const name2 = localStorage.getItem('player2Name') || 'Player 2';

    if (enemy.health <= 0 && player.health > 0) {
      showGameOver(name1);
    } else if (player.health <= 0 && enemy.health > 0) {
      showGameOver(name2);
    } else {
      showGameOver('No One');
    }
  }
  
}





function openSettings() {

  if (window.gameSounds && window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }


  const modal = document.getElementById('settingsModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.add('show'), 50);
  paused = true;
}

function closeSettings() {

  if (window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }

  const modal = document.getElementById('settingsModal');
  modal.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 400);
  paused = false; 
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



function startGame() {
  timer = 60; // reset
  decreaseTimer();
  document.getElementById("gameContainer").style.display = "inline-block";
}


animate();

// input events
window.addEventListener('keydown', (event) => {
  if (paused) return;
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.position.y + player.height >= canvas.height - 96) { 
          // Only jump if player is on the ground
          window.gameSounds.jump.currentTime = 0;
          window.gameSounds.jump.play();
          player.velocity.y = -20;
        }
        break
      case 's':
        window.gameSounds.attack.currentTime = 0;
        window.gameSounds.attack.play();
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.position.y + enemy.height >= canvas.height - 96) { 
          // Only jump if enemy is on the ground
          window.gameSounds.jump.currentTime = 0;
          window.gameSounds.jump.play();
          enemy.velocity.y = -20;
        }
        break
      case 'ArrowDown':
        window.gameSounds.attack.currentTime = 0;
        window.gameSounds.attack.play();
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  if (paused) return;
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})




  // save match to leaderboard
  async function saveToLeaderboard(player1, player2, winner) {
  if (matchSaved) return;   // ✅ prevent duplicate saves

  let match = {};
  const currentMatchTime = timer; 

  if (winner === "No One") {
    // --- Tie case ---
    match = {
      player1,
      player2,
      winner: "Tie",
      loser: "Tie",
      sessionId,
      matchTime: currentMatchTime,
    };
  } else {
    // --- Normal case ---
    const loser = winner === player1 ? player2 : player1;
    match = {
      player1,
      player2,
      winner,
      loser,
      sessionId,
      matchTime: currentMatchTime,
    };
  }

  console.log("Saving match:", match);

  try {
    const res = await fetch("https://fighting-game-backend.vercel.app/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Failed to save match. Server responded with:", res.status, err);
    } else {
      console.log("✅ Match saved to leaderboard");
      matchSaved = true; 
    }
  } catch (error) {
    console.error("❌ Failed to save match (network error):", error);
  }
}

// game over interface logic
function showGameOver(winnerName) {
  if (matchSaved) return;   // ✅ make extra sure
  
  const screen = document.getElementById('gameOverScreen')
  const winnerText = document.getElementById('winnerText')

  // Hide pause/settings when game over
  document.getElementById("pauseControl").style.display = "none";
  document.getElementById("settingsControl").style.display = "none";



    if (winnerName != 'No One') {
      // Check winner
      if (winnerName === (localStorage.getItem('player1Name'))) {
        window.gameSounds.win1.currentTime = 0;
        window.gameSounds.win1.play();
      } else if (winnerName === (localStorage.getItem('player2Name'))) {
        window.gameSounds.win2.currentTime = 0;
        window.gameSounds.win2.play();
      }

      winnerText.innerHTML = `<span class="winner-name">${winnerName}</span> Wins!`
      shownGameOver = true;

    } else {
      if(!shownGameOver){
      // Tie case
      window.gameSounds.tie.currentTime = 0;
      window.gameSounds.tie.play();
      winnerText.innerHTML = '<span class="tie">Tie!!</span>'
      }
    }

  screen.classList.remove('hidden')
  removedHidden = true;
  

  const name1 = localStorage.getItem('player1Name') 
  const name2 = localStorage.getItem('player2Name') 

  // Save to leaderboard
  saveToLeaderboard(name1, name2, winnerName)

  setTimeout(() => {
    screen.classList.add('show')
  }, 100)
}

function togglePause() {

  if (window.gameSounds && window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }


  paused = !paused;
  const pauseBtn = document.getElementById("pauseBtn").querySelector("img");
  const pauseScreen = document.getElementById("pauseScreen");
  pauseScreen.classList.remove("hidden");

  if (paused) {
    pauseBtn.src = "./img/icons/Play.png";
    pauseScreen.classList.remove("hidden");
    pauseScreen.classList.add("show");
  } else {
    pauseBtn.src = "./img/icons/Pause.png";
    pauseScreen.classList.remove("show");
    pauseScreen.classList.add("hidden");
  }
}

function restartGame() {
  if (removedHidden){window.gameSounds.button.currentTime = 0;
  window.gameSounds.button.play();}
  window.location.reload()
}

function goToMenu() {
  if (window.gameSounds && window.gameSounds.button){
  window.gameSounds.button.currentTime = 0;
  window.gameSounds.button.play();}
  window.location.href = '../index.html'
}

function viewLeaderboard() {
  if (removedHidden){window.gameSounds.button.currentTime = 0;
  window.gameSounds.button.play();}
  window.location.href = '../leaderboard.html'
}

function resumeGame() {
  if (window.gameSounds && window.gameSounds.button) {
    window.gameSounds.button.currentTime = 0;
    window.gameSounds.button.play();
  }
  togglePause();
}

function buttonHover() {
    if (window.gameSounds && window.gameSounds.hover){
    window.gameSounds.hover.currentTime = 0;
    window.gameSounds.hover.play();}
}

function playRunSound() {
  if (!window.gameSounds || !window.gameSounds.run) return;

  if (!isRunSoundPlaying) {
    window.gameSounds.run.loop = true;   // footsteps should loop
    window.gameSounds.run.playbackRate = 5.0;  // ✅ 5x speed
    window.gameSounds.run.currentTime = 0;
    window.gameSounds.run.play().catch(() => {}); // ignore autoplay errors
    isRunSoundPlaying = true;
  }
}


function stopRunSound() {
  if (!window.gameSounds || !window.gameSounds.run) return;

  if (isRunSoundPlaying) {
    window.gameSounds.run.pause();
    window.gameSounds.run.currentTime = 0;
    isRunSoundPlaying = false;
  }
}

// Make every button play hover sound once per entry
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    if (window.gameSounds.hover) {
      window.gameSounds.hover.currentTime = 0;
      window.gameSounds.hover.play();
    }
  });

  btn.addEventListener("click", () => {
    if (window.gameSounds.button) {
      window.gameSounds.button.currentTime = 0;
      window.gameSounds.button.play();
    }
  });
});


function playButtonSound() {
  if (!paused || removedHidden) {
    if (window.gameSounds && window.gameSounds.button) {
      window.gameSounds.button.currentTime = 0;
      window.gameSounds.button.play();
    }
  }
}



