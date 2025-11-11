import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

const router = express.Router();

// Student creates a new algorithm request
router.post("/", authenticate, async (req, res) => {
  try {
    const { algorithmSlug, note } = req.body;
    if (!algorithmSlug) return res.status(400).json({ error: "algorithmSlug is required" });
    const saved = await Request.create({ algorithmSlug, note: note ?? null, studentId: req.user.id });
    res.status(201).json({ message: "Request submitted", id: saved.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Educator fetches all requests
router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user?.role !== "educator") return res.status(403).json({ error: "Educator access required" });
    const requests = await Request.findAll({
      include: [{ model: User, as: "student", attributes: ["id", "username", "email"] }],
      order: [["createdAt", "DESC"]],
      limit: 200
    });
    res.json({ requests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Educator updates request status/notes
router.patch("/:id", authenticate, async (req, res) => {
  try {
    if (req.user?.role !== "educator") return res.status(403).json({ error: "Educator access required" });

    const request = await Request.findByPk(req.params.id, {
      include: [{ model: User, as: "student", attributes: ["id", "username", "email"] }],
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    const { status, educatorNotes } = req.body;
    if (status) {
      const allowed = ["pending", "in_progress", "completed"];
      if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status value" });
      request.status = status;
    }
    if (educatorNotes !== undefined) {
      request.educatorNotes = educatorNotes;
    }
    await request.save();

    res.json({ message: "Request updated", request });
  } catch (e) {
    console.error("Error updating request:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;


