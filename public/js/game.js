const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
let gameOver = false;
let matchSaved = false;

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

function startGame() {
  decreaseTimer();
  document.getElementById("gameContainer").style.display = "inline-block";
}

animate();

// input events
window.addEventListener('keydown', (event) => {
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
        player.velocity.y = -20
        break
      case ' ':
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
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
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

    if (winnerName === 'No One') {
      winnerText.innerHTML = '<span class="tie">Tie!!</span>'
    } else {
      winnerText.innerHTML = `<span class="winner-name">${winnerName}</span> Wins!`
    }

  screen.classList.remove('hidden')

  const name1 = localStorage.getItem('player1Name') || 'Player 1'
  const name2 = localStorage.getItem('player2Name') || 'Player 2'

  // Save to leaderboard
  saveToLeaderboard(name1, name2, winnerName)

  setTimeout(() => {
    screen.classList.add('show')
  }, 100)
}

function restartGame() {
  window.location.reload()
}

function goToMenu() {
  window.location.href = '../index.html'
}

function viewLeaderboard() {
  window.location.href = '../leaderboard.html'
}
