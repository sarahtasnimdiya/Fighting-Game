const express = require('express')
const router = express.Router()
const Match = require('../models/Match')

// POST a new match
router.post('/', async (req, res) => {
  try {
    const match = new Match(req.body)
    const savedMatch = await match.save()
    res.status(201).json(savedMatch)
  } catch (err) {
    console.error('Error saving match:', err)
    res.status(500).json({ message: 'Server error saving match' })
  }
})

// GET all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ time: -1 })
    res.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    res.status(500).json({ message: 'Server error fetching matches' })
  }
})



module.exports = router
