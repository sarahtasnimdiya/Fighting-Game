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
  let winner = ''
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
    winner = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    winner = 'Player 1'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    winner = 'Player 2'
  }

  // Save match result with timer
  saveMatchResult(winner, timer)
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
    let winner = ''

    if (player.health === enemy.health) {
      showGameOver('No One')
      winner = 'Tie'
    } else if (player.health > enemy.health) {
      showGameOver(name1)
      winner = name1
    } else {
      showGameOver(name2)
      winner = name2
    }

    // Save match result with timer = 0
    saveMatchResult(winner, 0)
  }
}

function saveMatchResult(winner, timeLeft) {
  const name1 = localStorage.getItem('player1Name') || 'Player 1'
  const name2 = localStorage.getItem('player2Name') || 'Player 2'

  // Get existing matches
  let matches = JSON.parse(localStorage.getItem('matches')) || []

  // Push new match result
  matches.push({
    player1: name1,
    player2: name2,
    winner: winner,
    timeEnded: timeLeft   // show this in leaderboard instead of date
  })

  // Save back
  localStorage.setItem('matches', JSON.stringify(matches))
}
