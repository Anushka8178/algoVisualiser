import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Algorithm from "../models/Algorithm.js";
import VisualizationState from "../models/VisualizationState.js";

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

router.post("/save", verifyToken, async (req, res) => {
  try {
    const { algorithmSlug, state } = req.body;

    if (!algorithmSlug || !state) {
      return res.status(400).json({ error: "Algorithm slug and state are required" });
    }

    const algorithm = await Algorithm.findOne({ where: { slug: algorithmSlug } });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const [visualizationState, created] = await VisualizationState.upsert({
      userId: req.userId,
      algorithmId: algorithm.id,
      state: state,
      lastSavedAt: new Date(),
    }, {
      returning: true,
    });

    res.json({
      message: created ? "Progress saved successfully" : "Progress updated successfully",
      savedAt: visualizationState.lastSavedAt,
    });
  } catch (error) {
    console.error("Error saving visualization state:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/load/:algorithmSlug", verifyToken, async (req, res) => {
  try {
    const { algorithmSlug } = req.params;

    const algorithm = await Algorithm.findOne({ where: { slug: algorithmSlug } });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const visualizationState = await VisualizationState.findOne({
      where: {
        userId: req.userId,
        algorithmId: algorithm.id,
      },
      order: [["lastSavedAt", "DESC"]],
    });

    if (!visualizationState) {
      return res.json({ state: null, hasSavedState: false });
    }

    res.json({
      state: visualizationState.state,
      hasSavedState: true,
      lastSavedAt: visualizationState.lastSavedAt,
    });
  } catch (error) {
    console.error("Error loading visualization state:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/clear/:algorithmSlug", verifyToken, async (req, res) => {
  try {
    const { algorithmSlug } = req.params;

    const algorithm = await Algorithm.findOne({ where: { slug: algorithmSlug } });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    await VisualizationState.destroy({
      where: {
        userId: req.userId,
        algorithmId: algorithm.id,
      },
    });

    res.json({ message: "Saved progress cleared successfully" });
  } catch (error) {
    console.error("Error clearing visualization state:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

