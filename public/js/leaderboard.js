// public/js/leaderboard.js  (Frontend version)

// Replace with your deployed Vercel backend URL
const API_BASE = "https://fighting-game-e02r632mc-sarah-tasnim-diyas-projects.vercel.app/api/leaderboard";

// Fetch leaderboard data from Vercel API
export async function fetchLeaderboard() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

// Save match result to Vercel API
export async function saveMatch(winner, loser) {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ winner, loser })
    });

    if (!response.ok) throw new Error("Failed to save match");

    const result = await response.json();
    console.log("Match saved:", result);
  } catch (error) {
    console.error("Error saving match:", error);
  }
}
