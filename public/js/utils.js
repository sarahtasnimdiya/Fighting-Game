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

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
    showGameOver('No One');
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    const name1 = localStorage.getItem('player1Name') || 'Player 1';
    showGameOver(name1);
  } else {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    const name2 = localStorage.getItem('player2Name') || 'Player 2';
    showGameOver(name2);
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  } else {
    // Time ran out
    const name1 = localStorage.getItem('player1Name') || 'Player 1'
    const name2 = localStorage.getItem('player2Name') || 'Player 2'

    if (player.health === enemy.health) {
      showGameOver("No One")  // ✅ show UI & save inside showGameOver()
    } else if (player.health > enemy.health) {
      showGameOver(name1)
    } else {
      showGameOver(name2)
    }
  }
}

