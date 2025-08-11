const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const matchesRef = db.collection("matches");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /api/leaderboard
 * Returns all matches ordered by time (newest first)
 */
app.get("/api/leaderboard", async (req, res) => {
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
app.post("/api/leaderboard", async (req, res) => {
  const { winner, loser } = req.body;

  // Basic validation
  if (!winner || !loser) {
    return res.status(400).json({ error: "Winner and loser are required" });
  }

  try {
    const matchData = {
      winner,
      loser,
      time: admin.firestore.Timestamp.now() // server timestamp
    };
    const newDoc = await matchesRef.add(matchData);
    res.status(201).json({ message: "Match saved", id: newDoc.id });
  } catch (error) {
    console.error("Error saving match:", error);
    res.status(500).json({ error: "Failed to save match" });
  }
});

module.exports = app;
