// routes/leaderboard.js

const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const matchesRef = db.collection('matches');

  // GET /api/leaderboard — Get all match results (ordered by time DESC)
  router.get('/', async (req, res) => {
    try {
      const snapshot = await matchesRef.orderBy('time', 'desc').get();
      const leaderboard = snapshot.docs.map(doc => doc.data());
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  // POST /api/leaderboard — Add new match result
  router.post('/', async (req, res) => {
    const matchData = req.body;

    if (!matchData || !matchData.winner || !matchData.time) {
      return res.status(400).json({ error: 'Invalid match data' });
    }

    try {
      const newDoc = await matchesRef.add(matchData);
      res.status(201).json({ message: 'Match saved', id: newDoc.id });
    } catch (error) {
      console.error('Error saving match:', error);
      res.status(500).json({ error: 'Failed to save match' });
    }
  });

  return router;
};
