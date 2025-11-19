import express from "express";
import { Op } from "sequelize";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import User from "../models/User.js";
import Note from "../models/Note.js";
import Algorithm from "../models/Algorithm.js";
import Request from "../models/Request.js";
import Message from "../models/Message.js";

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
  const students = await User.findAll({
    where: { role: "student" },
    attributes: ["id", "username", "streak", "totalEngagement"],
  });
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

// Message a particular student
router.post("/messages", async (req, res) => {
  const { studentId, studentIdentifier, subject, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content is required" });
  }

  let student = null;

  if (studentId) {
    student = await User.findOne({ where: { id: studentId, role: "student" } });
  }

  if (!student && studentIdentifier) {
    const identifier = studentIdentifier.trim();
    const orConditions = [];

    if (identifier.includes("@")) {
      orConditions.push({ email: { [Op.iLike]: identifier } });
    }

    orConditions.push({ username: { [Op.iLike]: identifier } });

    student = await User.findOne({
      where: {
        role: "student",
        [Op.or]: orConditions,
      },
    });
  }

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const savedMessage = await Message.create({
    subject: subject && subject.trim() ? subject.trim().slice(0, 150) : "Message from your educator",
    body: message.trim().slice(0, 5000),
    educatorId: req.user.id,
    studentId: student.id,
  });

  res.json({
    message: "Message queued for delivery",
    data: {
      id: savedMessage.id,
      student: {
        id: student.id,
        username: student.username,
        email: student.email,
      },
    },
  });
});

// Manage educator notes (CRUD simplified)
router.get("/notes", async (_req, res) => {
  const notes = await Note.findAll({
    where: { userId: null },
    include: [{ model: Algorithm, attributes: ["id", "title", "slug"] }],
    limit: 50,
    order: [["createdAt", "DESC"]],
  });
  res.json({ notes });
});

router.post("/notes", async (req, res) => {
  try {
    const { title, content, algorithmSlug } = req.body || {};

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    let algorithmId = null;
    if (algorithmSlug) {
      const algorithm = await Algorithm.findOne({ where: { slug: algorithmSlug } });
      if (!algorithm) {
        return res.status(404).json({ error: "Algorithm not found for provided slug" });
      }
      algorithmId = algorithm.id;
    }

    const note = await Note.create({
      title: title?.trim().slice(0, 150) || null,
      content: content.trim(),
      algorithmId,
      userId: null,
    });

    const created = await Note.findByPk(note.id, {
      include: [{ model: Algorithm, attributes: ["id", "title", "slug"] }],
    });

    res.status(201).json({ note: created });
  } catch (error) {
    console.error("Error creating educator note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

export default router;


