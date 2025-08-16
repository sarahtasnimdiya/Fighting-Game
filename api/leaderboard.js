// api/leaderboard.js (Vercel serverless function with CORS)

import admin from "firebase-admin";

// Ensure Firebase Admin is initialized only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      ),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  // --- 🔥 Add CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "https://fighting-game-4d09a.web.app");
  // For debugging you can temporarily allow all origins:
  // res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS request)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // --- 🔥 End CORS setup ---

    // --- GET Leaderboard ---
  if (req.method === "GET") {
    try {
      const { sessionId } = req.query;

      if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
      }

      let snapshot;
      try {
        snapshot = await db
          .collection("matches")
          .where("sessionId", "==", sessionId)
          .orderBy("time", "desc")
          .get();
      } catch (orderErr) {
        console.warn("⚠️ orderBy failed (likely because some docs have string times). Falling back without orderBy.");
        snapshot = await db
          .collection("matches")
          .where("sessionId", "==", sessionId)
          .get();
      }

      let leaderboard = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          player1: data.player1,
          player2: data.player2,
          winner: data.winner,
          loser: data.loser,
          time: data.time?.toDate ? data.time.toDate().toLocaleString() : data.time,
        };
      });

      // If no proper Firestore order, sort manually (newest first)
      leaderboard.sort((a, b) => new Date(b.time) - new Date(a.time));

      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }

  // --- POST Match Result ---
  if (req.method === "POST") {
    try {
      const { winner, loser, player1, player2, time, sessionId } = req.body;

      if (!winner || !loser || !player1 || !player2 || !sessionId) {
        return res
          .status(400)
          .json({ error: "Winner, loser, player1, player2, and sessionId are required" });
      }

      const matchData = {
        player1,
        player2,
        winner,
        loser,
        sessionId, // ✅ store session
        time: admin.firestore.Timestamp.now(), // always save as Timestamp
      };

      // Check if this sessionId already has a saved match
      const existing = await db
        .collection("matches")
        .where("sessionId", "==", sessionId)
        .get();

      if (!existing.empty) {
        return res.status(409).json({ error: "Match for this session already saved" });
      }

      // Save new match
      const newDoc = await db.collection("matches").add(matchData);
      return res.status(201).json({ message: "Match saved", id: newDoc.id });

    } catch (error) {
      console.error("Error saving match:", error);
      return res.status(500).json({ error: "Failed to save match" });
    }
  }

  // --- Method not allowed ---
  return res.status(405).json({ error: "Method not allowed" });
}
