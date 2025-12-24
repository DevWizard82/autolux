import express from "express";
import pool from "./db/pool.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// ----- Cars -----
app.get("/api/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars");
    res.json({ message: "Cars fetched successfully", data: result.rows });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// ----- Models -----
app.get("/api/models", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM models");
    res.json({ message: "Models fetched successfully", data: result.rows });
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

// ----- Car Parts (trim, body, strip) -----
const getCarParts = async (req, res, type) => {
  let { modelname } = req.params;
  modelname = modelname.replace("_", " ").replace(".glb", "");

  try {
    const query = `
      SELECT c.id AS car_id, m.file_path AS car_file_path, cp.id AS part_id, cp.part_name, cp.part_type
      FROM cars c
      JOIN car_parts cp ON c.id = cp.car_id
      JOIN models m ON m.car_id = c.id
      WHERE m.file_path = $1 AND cp.part_type = $2
    `;
    const params = [modelname, type];
    const { rows } = await pool.query(query, params);
    res.json({ message: `Car ${type} parts fetched successfully`, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch ${type} parts` });
  }
};

app.get("/api/car-parts/trims/:modelname", (req, res) =>
  getCarParts(req, res, "trim")
);
app.get("/api/car-parts/body/:modelname", (req, res) =>
  getCarParts(req, res, "body")
);
app.get("/api/car-parts/strip/:modelname", (req, res) =>
  getCarParts(req, res, "strip")
);

// ----- Colors -----
app.get("/api/colors/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const result = await pool.query(
      "SELECT DISTINCT color FROM car_units WHERE car_id = $1 AND status = 'available'",
      [carId]
    );
    res.json({
      message: "Available colors fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

// ----- Car Part Types -----
app.get("/api/types/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const result = await pool.query(
      "SELECT DISTINCT part_type FROM car_parts WHERE car_id = $1",
      [carId]
    );
    res.json({
      message: "Car part types fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch car part types" });
  }
});

// ----- Locations -----
app.get("/api/locations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT city_name, map_embed_url FROM locations ORDER BY city_name ASC"
    );
    res.json({ message: "Locations fetched successfully", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// ----- Latest Arrivals -----
app.get("/api/arrivals", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cars ORDER BY created_at DESC LIMIT 3"
    );
    res.json({
      message: "Latest arrivals fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest arrivals" });
  }
});

// ----- Contact / Send Message -----
app.post("/api/send-message", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: subject || `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ----- Rental / Booking -----
app.post("/api/rentals", async (req, res) => {
  const { client_id, car_id, rental_start, rental_end } = req.body;

  if (!client_id || !car_id || !rental_start || !rental_end) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const start = new Date(rental_start);
  const end = new Date(rental_end);

  if (end <= start) {
    return res
      .status(400)
      .json({ error: "Rental end date must be after start date" });
  }

  try {
    // Get car price
    const carRes = await pool.query("SELECT price FROM cars WHERE id = $1", [
      car_id,
    ]);
    if (!carRes.rowCount)
      return res.status(404).json({ error: "Car not found" });

    const dayPrice = carRes.rows[0].price;

    // Find available unit
    const unitRes = await pool.query(
      `
      SELECT cu.id FROM car_units cu
      WHERE cu.car_id = $1
      AND cu.id NOT IN (
        SELECT r.car_id FROM rentals r
        WHERE r.status = 'rented'
        AND r.rental_start <= $3
        AND r.rental_end >= $2
      )
      LIMIT 1
      `,
      [car_id, rental_start, rental_end]
    );

    if (!unitRes.rowCount) {
      return res
        .status(409)
        .json({ error: "No available vehicle for selected dates" });
    }

    const carUnitId = unitRes.rows[0].id;
    const days = (end - start) / (1000 * 60 * 60 * 24);
    const totalPrice = days * dayPrice;

    const rentalRes = await pool.query(
      `
      INSERT INTO rentals (car_id, client_id, rental_start, rental_end, price, status)
      VALUES ($1, $2, $3, $4, $5, 'rented')
      RETURNING *
      `,
      [carUnitId, client_id, rental_start, rental_end, totalPrice]
    );

    res
      .status(201)
      .json({ message: "Booking confirmed", data: rentalRes.rows[0] });
  } catch (err) {
    console.error("Rental error:", err);
    res.status(500).json({ error: "Failed to process booking" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
