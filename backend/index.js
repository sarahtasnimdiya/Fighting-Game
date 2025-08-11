const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/leaderboard", async (req, res) => {
  try {
    const snapshot = await db.collection("matches").orderBy("time", "desc").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.post("/api/leaderboard", async (req, res) => {
  try {
    const matchData = req.body;
    matchData.time = admin.firestore.Timestamp.now();
    const newDoc = await db.collection("matches").add(matchData);
    res.status(201).json({ message: "Match saved", id: newDoc.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save match" });
  }
});

module.exports = app;
