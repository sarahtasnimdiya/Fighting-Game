// functions/leaderboard.js
const express = require("express");
const admin = require("firebase-admin");

module.exports = () => {
  const router = express.Router();
  const matchesRef = admin.firestore().collection("matches");

  /**
   * GET /api/leaderboard
   * Returns all matches ordered by time (newest first)
   */
  router.get("/", async (req, res) => {
    try {
      const snapshot = await matchesRef.orderBy("time", "desc").get();
      const leaderboard = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  /**
   * POST /api/leaderboard
   * Adds a new match result to Firestore
   */
  router.post("/", async (req, res) => {
    const { winner, loser } = req.body;

    // Basic validation
    if (!winner || !loser) {
      return res.status(400).json({ error: "Winner and loser are required" });
    }

    try {
      const matchData = {
        winner,
        loser,
        time: admin.firestore.Timestamp.now() // use server time
      };
      const newDoc = await matchesRef.add(matchData);
      res.status(201).json({ message: "Match saved", id: newDoc.id });
    } catch (error) {
      console.error("Error saving match:", error);
      res.status(500).json({ error: "Failed to save match" });
    }
  });

  return router;
};
