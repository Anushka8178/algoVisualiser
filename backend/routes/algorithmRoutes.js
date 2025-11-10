import express from "express";
import Algorithm from "../models/Algorithm.js";

const router = express.Router();

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

export default router;

