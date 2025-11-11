import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import User from "../models/User.js";
import Note from "../models/Note.js";
import Algorithm from "../models/Algorithm.js";
import Request from "../models/Request.js";

const router = express.Router();

// Ensure only educators
router.use(authenticate, (req, res, next) => {
  if (req.user?.role !== "educator") return res.status(403).json({ error: "Educator access required" });
  next();
});

// Query students (basic list, with streaks)
router.get("/students", async (_req, res) => {
  const students = await User.findAll({ where: { role: "student" }, attributes: ["id", "username", "email", "streak", "totalEngagement"] });
  res.json({ students });
});

// View all learning streaks (summary)
router.get("/streaks", async (_req, res) => {
  const students = await User.findAll({ where: { role: "student" }, attributes: ["id", "username", "streak"] });
  res.json({ students });
});

router.get("/requests", async (_req, res) => {
  const requests = await Request.findAll({ include: [{ model: User, as: "student", attributes: ["id","username","email"] }], order: [["createdAt","DESC"]] });
  res.json({ requests });
});

// Upload learning resources (pdf link, text, or file) - educator global resource note
router.post("/resources", upload.single("file"), async (req, res) => {
  try {
    const { title, link, content, algorithmSlug } = req.body;
    if (!algorithmSlug) return res.status(400).json({ error: "algorithmSlug is required" });
    if (!link && !content && !req.file) return res.status(400).json({ error: "Provide a link, content, or file" });
    
    const algorithm = await Algorithm.findOne({ where: { slug: algorithmSlug } });
    if (!algorithm) return res.status(404).json({ error: "Algorithm not found" });
    
    let filePath = null;
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }
    
    const saved = await Note.create({
      title: title ? title.slice(0, 150) : `${algorithm.title} Resource`,
      link: link || null,
      content: content || null,
      filePath: filePath,
      algorithmId: algorithm.id,
      userId: null,
    });
    res.json({ message: "Resource saved", id: saved.id, filePath: filePath });
  } catch (error) {
    console.error("Error uploading resource:", error);
    res.status(500).json({ error: error.message || "Failed to save resource" });
  }
});

// Message a particular student (placeholder)
router.post("/messages", async (req, res) => {
  const { studentId, message } = req.body;
  if (!studentId || !message) return res.status(400).json({ error: "studentId and message are required" });
  // Persist to a Message model in a real app; here we ack
  res.json({ message: "Message queued for delivery", studentId });
});

// Manage educator notes (CRUD simplified)
router.get("/notes", async (_req, res) => {
  const notes = await Note.findAll({ where: { userId: null }, include: [{ model: Algorithm, attributes: ["id","title","slug"] }], limit: 50, order: [["createdAt","DESC"]] });
  res.json({ notes });
});

export default router;


