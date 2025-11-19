import express from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import Algorithm from "../models/Algorithm.js";
import UserProgress from "../models/UserProgress.js";
import { sendStreakNotification } from "../utils/emailService.js";

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

router.post("/complete", verifyToken, async (req, res) => {
  try {
    const { algorithmId, activityType = "completed" } = req.body;

    if (!algorithmId) {
      return res.status(400).json({ error: "Algorithm ID is required" });
    }

    const algorithm = await Algorithm.findByPk(algorithmId);
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;
    const startOfToday = new Date(`${todayDate}T00:00:00`);
    const previousStreak = user.streak || 0;
    let streakChanged = false;
    let newStreakValue = previousStreak;

    if (activityType === "completed") {
      const existingProgress = await UserProgress.findOne({
        where: {
          userId: req.userId,
          algorithmId,
          activityType: "completed",
          completedAt: {
            [Op.gte]: startOfToday,
          },
        },
      });

      if (existingProgress) {
        console.log(`[Progress] Duplicate completion blocked for user ${req.userId}, algorithm ${algorithmId}`);
        return res.json({
          message: "Already completed today",
          user: await User.findByPk(req.userId, {
            attributes: ["id", "username", "email", "streak", "totalEngagement", "lastActiveDate"],
          }),
        });
      }
    }

    await UserProgress.create({
      userId: req.userId,
      algorithmId,
      activityType,
    });

    await user.increment("totalEngagement");

    const getDateString = (value) => {
      if (!value) return null;
      if (value instanceof Date) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, "0");
        const d = String(value.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
      return String(value).split("T")[0];
    };

    const lastActive = getDateString(user.lastActiveDate);

    if (lastActive !== todayDate) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yYear = yesterday.getFullYear();
      const yMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
      const yDay = String(yesterday.getDate()).padStart(2, "0");
      const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

      if (lastActive === yesterdayStr) {
        await user.increment("streak");
        streakChanged = true;
        newStreakValue = previousStreak + 1;
      } else {
        await user.update({ streak: 1 });
        streakChanged = true;
        newStreakValue = 1;
      }

      await user.update({ lastActiveDate: todayDate });
    }

    const updatedUser = await User.findByPk(req.userId, {
      attributes: ["id", "username", "email", "streak", "totalEngagement", "lastActiveDate"],
    });

    if (streakChanged && activityType === "completed") {
      try {
        await sendStreakNotification({
          userEmail: updatedUser.email,
          username: updatedUser.username,
          previousStreak,
          newStreak: newStreakValue,
        });
      } catch (emailError) {
        console.warn("Failed to send streak email:", emailError.message);
      }
    }

    res.json({
      message: "Progress tracked successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error tracking progress:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Algorithm,
          attributes: ["id", "title", "slug", "category"],
        },
      ],
      order: [["completedAt", "DESC"]],
      limit: 50,
    });

    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "username", "email", "streak", "totalEngagement", "lastActiveDate"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const completedCount = await UserProgress.count({
      where: {
        userId: req.userId,
        activityType: "completed",
      },
      distinct: true,
      col: "algorithmId",
    });

    const totalActivities = await UserProgress.count({
      where: { userId: req.userId },
    });

    res.json({
      user,
      stats: {
        streak: user.streak,
        totalEngagement: user.totalEngagement,
        algorithmsCompleted: completedCount,
        totalActivities,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

