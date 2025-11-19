import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

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

    const trimmedName = username.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      return res.status(400).json({ error: "Name can only contain letters and spaces" });
    }

    if (/\s/.test(email)) {
      return res.status(400).json({ error: "Email cannot contain spaces" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Email must contain @" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[@$!%*?&]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one special character (@$!%*?&)" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password does not meet all requirements" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username: trimmedName, email: email.trim(), password: hashed, role });
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

router.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email: email.trim() } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[@$!%*?&]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one special character (@$!%*?&)" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password does not meet all requirements" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[@$!%*?&]/.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one special character (@$!%*?&)" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password does not meet all requirements" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
