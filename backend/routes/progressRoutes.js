import express from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import Algorithm from "../models/Algorithm.js";
import UserProgress from "../models/UserProgress.js";

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
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    if (activityType === "completed") {
      const existingProgress = await UserProgress.findOne({
        where: {
          userId: req.userId,
          algorithmId,
          activityType: "completed",
          completedAt: {
            [Op.gte]: new Date(todayDate + "T00:00:00"),
          },
        },
      });

      if (existingProgress) {
        await user.increment("totalEngagement");
        
        await user.reload();
        const lastActiveRaw = user.lastActiveDate;
        let lastActive = null;
        if (lastActiveRaw) {
          if (lastActiveRaw instanceof Date) {
            const year = lastActiveRaw.getFullYear();
            const month = String(lastActiveRaw.getMonth() + 1).padStart(2, '0');
            const day = String(lastActiveRaw.getDate()).padStart(2, '0');
            lastActive = `${year}-${month}-${day}`;
          } else {
            const dateStr = String(lastActiveRaw).split("T")[0];
            lastActive = dateStr;
          }
        }

        console.log(`[Progress] User ${req.userId}, Activity: ${activityType} (duplicate), Today: ${todayDate}, LastActive: ${lastActive}, CurrentStreak: ${user.streak}`);

        if (lastActive !== todayDate) {
          if (lastActive) {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yYear = yesterday.getFullYear();
            const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
            const yDay = String(yesterday.getDate()).padStart(2, '0');
            const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

            console.log(`[Progress] Comparing lastActive (${lastActive}) with yesterday (${yesterdayStr})`);

            if (lastActive === yesterdayStr) {
              console.log(`[Progress] Incrementing streak from ${user.streak} to ${user.streak + 1}`);
              await user.increment("streak");
            } else {
              console.log(`[Progress] Resetting streak to 1 (gap detected)`);
              await user.update({ streak: 1 });
            }
          } else {
            console.log(`[Progress] First activity, setting streak to 1`);
            await user.update({ streak: 1 });
          }

          await user.update({ lastActiveDate: todayDate });
          console.log(`[Progress] Updated lastActiveDate to ${todayDate}`);
        } else {
          console.log(`[Progress] Already active today, no streak update needed`);
        }

        const updatedUser = await User.findByPk(req.userId, {
          attributes: ["id", "username", "streak", "totalEngagement", "lastActiveDate"],
        });

        return res.json({
          message: "Already completed today",
          user: updatedUser,
        });
      }
    } else if (activityType === "viewed") {
      console.log(`[Progress] Checking for existing 'viewed' activity for algorithm ${algorithmId} on ${todayDate}`);
      
      const existingViewed = await UserProgress.findOne({
        where: {
          userId: req.userId,
          algorithmId,
          activityType: "viewed",
          completedAt: {
            [Op.gte]: new Date(todayDate + "T00:00:00"),
          },
        },
        order: [["completedAt", "DESC"]],
      });

      if (existingViewed) {
        console.log(`[Progress] Found existing viewed activity (ID: ${existingViewed.id}) from today, updating timestamp`);
        await existingViewed.update({ completedAt: now });
        await existingViewed.reload();
        console.log(`[Progress] Updated viewed activity timestamp to: ${existingViewed.completedAt}`);
      } else {
        console.log(`[Progress] No existing viewed activity from today, will create new one`);
      }
      
      await user.increment("totalEngagement");
      
      await user.reload();
      const lastActiveRaw = user.lastActiveDate;
      let lastActive = null;
      if (lastActiveRaw) {
        if (lastActiveRaw instanceof Date) {
          const year = lastActiveRaw.getFullYear();
          const month = String(lastActiveRaw.getMonth() + 1).padStart(2, '0');
          const day = String(lastActiveRaw.getDate()).padStart(2, '0');
          lastActive = `${year}-${month}-${day}`;
        } else {
          const dateStr = String(lastActiveRaw).split("T")[0];
          lastActive = dateStr;
        }
      }

      console.log(`[Progress] User ${req.userId}, Activity: ${activityType}, Today: ${todayDate}, LastActive: ${lastActive}, CurrentStreak: ${user.streak}`);

      if (lastActive !== todayDate) {
        if (lastActive) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yYear = yesterday.getFullYear();
          const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
          const yDay = String(yesterday.getDate()).padStart(2, '0');
          const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

          console.log(`[Progress] Comparing lastActive (${lastActive}) with yesterday (${yesterdayStr})`);

          if (lastActive === yesterdayStr) {
            console.log(`[Progress] Incrementing streak from ${user.streak} to ${user.streak + 1}`);
            await user.increment("streak");
          } else {
            console.log(`[Progress] Resetting streak to 1 (gap detected)`);
            await user.update({ streak: 1 });
          }
        } else {
          console.log(`[Progress] First activity, setting streak to 1`);
          await user.update({ streak: 1 });
        }

        await user.update({ lastActiveDate: todayDate });
        console.log(`[Progress] Updated lastActiveDate to ${todayDate}`);
      } else {
        console.log(`[Progress] Already active today, no streak update needed`);
      }

      if (existingViewed) {
        const updatedUser = await User.findByPk(req.userId, {
          attributes: ["id", "username", "streak", "totalEngagement", "lastActiveDate"],
        });

        return res.json({
          message: "Progress updated (revisit)",
          user: updatedUser,
        });
      }
    }

    const newProgress = await UserProgress.create({
      userId: req.userId,
      algorithmId,
      activityType,
    });

    const createdDate = new Date(newProgress.completedAt);
    const createdYear = createdDate.getFullYear();
    const createdMonth = String(createdDate.getMonth() + 1).padStart(2, '0');
    const createdDay = String(createdDate.getDate()).padStart(2, '0');
    const createdDateStr = `${createdYear}-${createdMonth}-${createdDay}`;
    
    console.log(`[Progress] Created ${activityType} activity for algorithm ${algorithmId}, progress ID: ${newProgress.id}`);
    console.log(`[Progress] Activity date: ${createdDateStr} (server local time), Today: ${todayDate}`);

    await user.increment("totalEngagement");

    await user.reload();
    const lastActiveRaw = user.lastActiveDate;
    let lastActive = null;
    if (lastActiveRaw) {
      if (lastActiveRaw instanceof Date) {
        const year = lastActiveRaw.getFullYear();
        const month = String(lastActiveRaw.getMonth() + 1).padStart(2, '0');
        const day = String(lastActiveRaw.getDate()).padStart(2, '0');
        lastActive = `${year}-${month}-${day}`;
      } else {
        const dateStr = String(lastActiveRaw).split("T")[0];
        lastActive = dateStr;
      }
    }

    console.log(`[Progress] User ${req.userId}, Activity: ${activityType}, Today: ${todayDate}, LastActive: ${lastActive}, CurrentStreak: ${user.streak}`);

    if (lastActive !== todayDate) {
      if (lastActive) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yYear = yesterday.getFullYear();
        const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
        const yDay = String(yesterday.getDate()).padStart(2, '0');
        const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

        console.log(`[Progress] Comparing lastActive (${lastActive}) with yesterday (${yesterdayStr})`);

        if (lastActive === yesterdayStr) {
          console.log(`[Progress] Incrementing streak from ${user.streak} to ${user.streak + 1}`);
          await user.increment("streak");
        } else {
          console.log(`[Progress] Resetting streak to 1 (gap detected)`);
          await user.update({ streak: 1 });
        }
      } else {
        console.log(`[Progress] First activity, setting streak to 1`);
        await user.update({ streak: 1 });
      }

      await user.update({ lastActiveDate: todayDate });
      console.log(`[Progress] Updated lastActiveDate to ${todayDate}`);
    } else {
      console.log(`[Progress] Already active today, no streak update needed`);
    }

    const updatedUser = await User.findByPk(req.userId, {
      attributes: ["id", "username", "streak", "totalEngagement", "lastActiveDate"],
    });

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
          required: false,
        },
      ],
      order: [["completedAt", "DESC"]],
      limit: 50,
    });

    console.log(`[Progress] History request for user ${req.userId}: ${progress.length} activities`);
    progress.forEach((p, idx) => {
      const actDate = new Date(p.completedAt);
      const actYear = actDate.getFullYear();
      const actMonth = String(actDate.getMonth() + 1).padStart(2, '0');
      const actDay = String(actDate.getDate()).padStart(2, '0');
      const actDateStr = `${actYear}-${actMonth}-${actDay}`;
      console.log(`  [${idx}] ${p.activityType} - Algorithm: ${p.Algorithm?.title || 'NULL'} (ID: ${p.algorithmId}) - Date: ${actDateStr}`);
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

