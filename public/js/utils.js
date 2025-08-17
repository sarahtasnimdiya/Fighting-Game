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

    // Decide winner by health
    if (player.health === enemy.health) {
      showGameOver('No One') // It's a draw
    } else if (player.health > enemy.health) {
      showGameOver(name1)
    } else {
      showGameOver(name2)
    }
  }
}