import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({
      success: false,
      error: "All required fields must be filled.",
    });
  }

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM clients WHERE email = $1",
      [email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO clients (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name
      `,
      [email, hashedPassword, first_name, last_name, phone]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Unable to create account. Please try again later.",
    });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required.",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM clients WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: `Welcome back, ${user.first_name}!`,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Login failed. Please try again later.",
    });
  }
});

export default router;
