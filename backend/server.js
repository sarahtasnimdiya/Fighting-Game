const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const leaderboardRoutes = require('./routes/leaderboard') // ✅ relative to backend/

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/fighting-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use('/api/leaderboard', leaderboardRoutes)

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
