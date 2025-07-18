const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  winner: String,
  time: String
})

module.exports = mongoose.model('Match', matchSchema)
