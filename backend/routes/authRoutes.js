import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, role = "student" } = req.body;
  try {
    console.log("Registration attempt:", { username, email, role });

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!["student", "educator"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed, role });
    console.log("User created successfully:", newUser.id, newUser.email);

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      streak: newUser.streak,
      totalEngagement: newUser.totalEngagement,
    };

    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    console.log("User lookup result:", user ? `Found user ID: ${user.id}` : "User not found");

    if (!user) {

      const userCount = await User.count();
      console.log("Total users in database:", userCount);
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    console.log("Login successful for user:", user.id);

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      streak: user.streak,
      totalEngagement: user.totalEngagement,
    };

    res.json({ message: "Login successful", token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
