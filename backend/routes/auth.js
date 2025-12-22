import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT into clients(email, password_hash, first_name, last_name, phone)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, email`,
      [email, hash, first_name, last_name, phone]
    );

    const token = jwt.sign(
      {
        id: result.rows[0].id,
        email: result.rows[0].email,
        first_name: result.rows[0].first_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM clients WHERE email = $1", [
    email,
  ]);

  if (!result.rows.length) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    id: user.id,
  });
});

export default router;
