import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "streak", "totalEngagement"],
      order: [
        ["streak", "DESC"],
        ["totalEngagement", "DESC"],
      ],
      limit: 100,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      email: user.email,
      streak: user.streak,
      engagement: user.totalEngagement,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

