import express from "express";
import Algorithm from "../models/Algorithm.js";
import Note from "../models/Note.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user?.role !== "educator") {
      return res.status(403).json({ error: "Educator access required" });
    }

    const {
      title,
      category,
      description,
      complexity,
      slug: providedSlug,
      material,
      visualizationUrl,
      visualizationCode,
    } = req.body;

    if (!title || !category || !description || !complexity) {
      return res.status(400).json({ error: "Title, category, description, and complexity are required" });
    }

    const slug = providedSlug ? slugify(providedSlug) : slugify(title);
    if (!slug) return res.status(400).json({ error: "Invalid slug or title" });

    const existing = await Algorithm.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "An algorithm with this slug already exists" });
    }

    const algorithm = await Algorithm.create({
      title,
      category,
      description,
      complexity,
      slug,
      material: material || null,
      visualizationUrl: visualizationUrl || null,
      visualizationCode: visualizationCode || null,
    });

    res.status(201).json({ message: "Algorithm created", algorithm });
  } catch (error) {
    console.error("Error creating algorithm:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const algorithms = await Algorithm.findAll({
      order: [["category", "ASC"], ["title", "ASC"]],
    });
    res.json(algorithms);
  } catch (error) {
    console.error("Error fetching algorithms:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const algorithm = await Algorithm.findOne({
      where: { slug: req.params.slug },
    });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }
    res.json(algorithm);
  } catch (error) {
    console.error("Error fetching algorithm:", error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:slug", authenticate, async (req, res) => {
  try {
    if (req.user?.role !== "educator") {
      return res.status(403).json({ error: "Educator access required" });
    }

    const algorithm = await Algorithm.findOne({ where: { slug: req.params.slug } });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    const {
      title,
      category,
      description,
      complexity,
      slug: newSlug,
      material,
      visualizationUrl,
      visualizationCode,
    } = req.body;

    // If slug is being changed, check if new slug is available
    if (newSlug && newSlug !== req.params.slug) {
      const slugified = slugify(newSlug);
      if (!slugified) {
        return res.status(400).json({ error: "Invalid slug" });
      }
      const existing = await Algorithm.findOne({ where: { slug: slugified } });
      if (existing && existing.id !== algorithm.id) {
        return res.status(400).json({ error: "An algorithm with this slug already exists" });
      }
      algorithm.slug = slugified;
    }

    // Update fields
    if (title !== undefined) algorithm.title = title;
    if (category !== undefined) algorithm.category = category;
    if (description !== undefined) algorithm.description = description;
    if (complexity !== undefined) algorithm.complexity = complexity;
    if (material !== undefined) algorithm.material = material || null;
    if (visualizationUrl !== undefined) algorithm.visualizationUrl = visualizationUrl || null;
    if (visualizationCode !== undefined) algorithm.visualizationCode = visualizationCode || null;

    await algorithm.save();

    res.json({ message: "Algorithm updated", algorithm });
  } catch (error) {
    console.error("Error updating algorithm:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:slug", authenticate, async (req, res) => {
  try {
    if (req.user?.role !== "educator") {
      return res.status(403).json({ error: "Educator access required" });
    }

    const algorithm = await Algorithm.findOne({ where: { slug: req.params.slug } });
    if (!algorithm) {
      return res.status(404).json({ error: "Algorithm not found" });
    }

    // Delete the algorithm (cascading deletes will handle related records)
    await algorithm.destroy();

    res.json({ message: "Algorithm deleted successfully" });
  } catch (error) {
    console.error("Error deleting algorithm:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug/resources", async (req, res) => {
  try {
    const algorithm = await Algorithm.findOne({ where: { slug: req.params.slug } });
    if (!algorithm) return res.status(404).json({ error: "Algorithm not found" });
    const resources = await Note.findAll({
      where: { algorithmId: algorithm.id, userId: null },
      attributes: ["id", "title", "content", "link", "filePath", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.json({ resources });
  } catch (error) {
    console.error("Error fetching algorithm resources:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

