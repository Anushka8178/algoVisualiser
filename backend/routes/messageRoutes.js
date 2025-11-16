import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authenticate);

// Students fetch their inbox
router.get("/", async (req, res) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Student access required" });
  }

  const messages = await Message.findAll({
    where: { studentId: req.user.id },
    include: [
      {
        model: User,
        as: "educator",
        attributes: ["id", "username", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({ messages });
});

// Mark message as read
router.patch("/:id/read", async (req, res) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Student access required" });
  }

  const message = await Message.findOne({
    where: { id: req.params.id, studentId: req.user.id },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (!message.isRead) {
    await message.update({ isRead: true, readAt: new Date() });
  }

  res.json({ message: "Message marked as read" });
});

// Unread count helper
router.get("/unread/count", async (req, res) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Student access required" });
  }

  const count = await Message.count({
    where: { studentId: req.user.id, isRead: false },
  });

  res.json({ count });
});

export default router;


