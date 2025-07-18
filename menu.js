function startGame() {
  const name1 = document.getElementById('player1Name').value.trim();
  const name2 = document.getElementById('player2Name').value.trim();

  if (!name1 || !name2) {
    alert('Please enter names for both players!');
    return;
  }

  localStorage.setItem('player1Name', name1);
  localStorage.setItem('player2Name', name2);

  // Redirect to game page
  window.location.href = 'index.html';
}
function viewLeaderboard() {
  window.location.href = 'leaderboard.html'
}
