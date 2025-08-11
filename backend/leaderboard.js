// api/leaderboard.js
import admin from "firebase-admin";

// Prevent re-initializing in Vercel hot reload
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch leaderboard (newest first)
    try {
      const snapshot = await db.collection("matches").orderBy("time", "desc").get();
      const leaderboard = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }

  if (req.method === "POST") {
    // Save a match result
    const { winner, loser } = req.body;

    if (!winner || !loser) {
      return res.status(400).json({ error: "Winner and loser are required" });
    }

    try {
      const matchData = {
        winner,
        loser,
        time: admin.firestore.Timestamp.now(),
      };
      const newDoc = await db.collection("matches").add(matchData);
      return res.status(201).json({ message: "Match saved", id: newDoc.id });
    } catch (error) {
      console.error("Error saving match:", error);
      return res.status(500).json({ error: "Failed to save match" });
    }
  }

  // If method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
