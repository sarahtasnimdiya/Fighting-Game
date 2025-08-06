const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // your Firebase credentials
const leaderboardRoutes = require('./routes/leaderboard'); // notice: this will now be a function

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Pass `db` into the leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes(db));

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
