import express from "express";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";
import Algorithm from "../models/Algorithm.js";
import UserProgress from "../models/UserProgress.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// Get notes for logged-in user (optionally filtered by algorithmId)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { algorithmId } = req.query;
    const whereClause = { userId: req.userId };
    if (algorithmId) {
      whereClause.algorithmId = algorithmId;
    }
    
    const notes = await Note.findAll({
      where: whereClause,
      include: [
        {
          model: Algorithm,
          attributes: ["id", "title", "slug", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get notes by algorithm slug
router.get("/algorithm/:slug", verifyToken, async (req, res) => {
  try {
    const algorithm = await Algorithm.findOne({
      where: { slug: req.params.slug },
    });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const notes = await Note.findAll({
      where: { userId: req.userId, algorithmId: algorithm.id },
      include: [
        {
          model: Algorithm,
          attributes: ["id", "title", "slug", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a note
router.post("/", verifyToken, async (req, res) => {
  try {
    const { algorithmId, content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (!algorithmId) {
      return res.status(400).json({ error: "Algorithm ID is required" });
    }

    // Verify algorithm exists
    const algorithm = await Algorithm.findByPk(algorithmId);
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const note = await Note.create({
      userId: req.userId,
      algorithmId,
      content: content.trim(),
    });

    // Track note creation as engagement
    await UserProgress.create({
      userId: req.userId,
      algorithmId,
      activityType: "note_created",
    });

    // Update user engagement
    const user = await User.findByPk(req.userId);
    if (user) {
      await user.increment("totalEngagement");
    }

    const noteWithAlgorithm = await Note.findByPk(note.id, {
      include: [
        {
          model: Algorithm,
          attributes: ["id", "title", "slug", "category"],
        },
      ],
    });

    res.status(201).json(noteWithAlgorithm);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a note
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.content = content.trim();
    await note.save();

    const updatedNote = await Note.findByPk(note.id, {
      include: [
        {
          model: Algorithm,
          attributes: ["id", "title", "slug", "category"],
        },
      ],
    });

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Note.destroy({ where: { id: req.params.id, userId: req.userId } });
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

