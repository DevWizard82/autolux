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
  res.send("Server is running");
});

app.get("/api/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from cars");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/models", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM models
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.get("/api/car-parts/trims/:modelname", async (req, res) => {
  const { modelname } = req.params;

  modelname.replace("_", " ");
  modelname.replace(".glb", "");

  try {
    let query =
      "SELECT c.id AS car_id, m.file_path AS car_file_path, cp.id AS part_id, cp.part_name, cp.part_type FROM cars c JOIN car_parts cp ON c.id = cp.car_id JOIN models m ON m.car_id = c.id WHERE m.file_path = $1 and cp.part_type=$2";
    const params = [modelname, "trim"];

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/car-parts/body/:modelname", async (req, res) => {
  const { modelname } = req.params;

  modelname.replace("_", " ");
  modelname.replace(".glb", "");

  try {
    let query =
      "SELECT c.id AS car_id, m.file_path AS car_file_path, cp.id AS part_id, cp.part_name, cp.part_type FROM cars c JOIN car_parts cp ON c.id = cp.car_id JOIN models m ON m.car_id = c.id WHERE m.file_path = $1 and cp.part_type=$2";
    const params = [modelname, "body"];

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/car-parts/strip/:modelname", async (req, res) => {
  const { modelname } = req.params;

  modelname.replace("_", " ");
  modelname.replace(".glb", "");

  try {
    let query =
      "SELECT c.id AS car_id, m.file_path AS car_file_path, cp.id AS part_id, cp.part_name, cp.part_type FROM cars c JOIN car_parts cp ON c.id = cp.car_id JOIN models m ON m.car_id = c.id WHERE m.file_path = $1 and cp.part_type=$2";
    const params = [modelname, "strip"];

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/colors/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const result = await pool.query(
      "SELECT DISTINCT color FROM car_units where car_id = $1 AND status = 'available'",
      [carId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/types/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const result = await pool.query(
      `SELECT DISTINCT part_type from car_parts where car_id = $1`,
      [carId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch car types" });
  }
});

app.get("/api/locations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT city_name, map_embed_url FROM locations ORDER BY city_name ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/api/arrivals", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * from cars order by created_at desc LIMIT 3"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/locations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from locations");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/send-message", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anasberrqia25@gmail.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "anasberrqia25@gmail.com",
      to: "anasberrqia25@gmail.com",
      subject: subject || `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

app.post("/api/rentals", async (req, res) => {
  const { client_id, car_id, rental_start, rental_end } = req.body;

  if (!client_id || !car_id || !rental_start || !rental_end) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const start = new Date(rental_start);
  const end = new Date(rental_end);

  if (end <= start) {
    return res.status(400).json({ error: "Invalid rental dates" });
  }

  try {
    const carRes = await pool.query("SELECT price FROM cars WHERE id = $1", [
      car_id,
    ]);

    if (carRes.rowCount === 0) {
      return res.status(404).json({ error: "Car model not found" });
    }

    const dayPrice = carRes.rows[0].price;

    const unitRes = await pool.query(
      `
      SELECT cu.id
      FROM car_units cu
      WHERE cu.car_id = $1
      AND cu.id NOT IN (
        SELECT r.car_id
        FROM rentals r
        WHERE r.status = 'rented'
        AND r.rental_start <= $3
        AND r.rental_end >= $2
      )
      LIMIT 1
      `,
      [car_id, rental_start, rental_end]
    );

    if (unitRes.rowCount === 0) {
      return res.status(409).json({
        error: "No available vehicle for selected dates",
      });
    }

    const carUnitId = unitRes.rows[0].id;

    // 3️⃣ Calculate total price
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const totalPrice = days * dayPrice;

    // 4️⃣ Insert rental
    const rentalRes = await pool.query(
      `
      INSERT INTO rentals (
        car_id,
        client_id,
        rental_start,
        rental_end,
        price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'rented')
      RETURNING *
      `,
      [carUnitId, client_id, rental_start, rental_end, totalPrice]
    );

    res.status(201).json({
      message: "Booking confirmed",
      rental: rentalRes.rows[0],
    });
  } catch (err) {
    console.error("RENTAL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
