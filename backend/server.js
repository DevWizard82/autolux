import express from "express";
import pool from "./db/pool.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

// Update password
app.put("/api/auth/update-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // 1. Get the user from the database
    const userRes = await pool.query("SELECT * FROM clients WHERE id = $1", [
      userId,
    ]);

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = userRes.rows[0];

    // 2. Verify the CURRENT password
    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect current password" });
    }

    // 3. Hash the NEW password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update database
    await pool.query("UPDATE clients SET password_hash = $1 WHERE id = $2", [
      newPasswordHash,
      userId,
    ]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Update profile
app.put("/api/auth/update-profile", async (req, res) => {
  const { userId, firstName, lastName, email } = req.body;

  if (!userId || !email) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const userRes = await pool.query(
      "UPDATE clients set first_name = $1, last_name = $2, email = $3 WHERE id = $4",
      [firstName, lastName, email, userId]
    );

    res.json({
      success: true,
      user: {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    });
  } catch (err) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Get Top 10 Customers (Rentals count)
app.get("/api/analytics/top-customers", async (req, res) => {
  const result = await pool.query(`
    SELECT c.first_name || ' ' || c.last_name as name, COUNT(r.id) as count
    FROM clients c
    JOIN rentals r ON c.id = r.client_id
    GROUP BY c.id having c.role <> 'admin'
    ORDER BY count DESC
    LIMIT 10
  `);
  res.json(result.rows);
});

// Get Revenue by Month for Current Year
app.get("/api/analytics/revenue-monthly", async (req, res) => {
  const result = await pool.query(`
    SELECT TO_CHAR(rental_start, 'Mon') as month, SUM(price) as total
    FROM rentals
    WHERE EXTRACT(YEAR FROM rental_start) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY month, EXTRACT(MONTH FROM rental_start)
    ORDER BY EXTRACT(MONTH FROM rental_start)
  `);
  res.json(result.rows);
});

// Get Fleet Status (Available vs Rented vs Maintenance)
app.get("/api/analytics/fleet-status", async (req, res) => {
  const result = await pool.query(`
    SELECT status, COUNT(*) as count 
    FROM car_units 
    GROUP BY status
  `);
  res.json(result.rows);
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

// ----- Cars count -----
app.get("/api/carscount", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) from car_units");
    res.json({ message: "cars count fetched successfully", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cars count" });
  }
});

// ----- Customers count -----
app.get("/api/clientscount", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(id) from clients where role <> 'admin'"
    );
    res.json({
      message: "clients count fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clients count" });
  }
});

// 1. GET CLIENTS LIST

app.get("/api/clients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, phone FROM clients WHERE (role <> 'admin' OR role IS NULL) ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// 2. GET FLEET DETAILS
app.get("/api/fleet", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.vin, u.color, c.name, c.make, c.price, u.status
      FROM car_units u
      JOIN cars c ON u.car_id = c.id
      ORDER BY u.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fleet" });
  }
});

// ----- rentals count -----
app.get("/api/rentalscount", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(*) FROM rentals WHERE status = 'rented';"
    );
    res.json({
      message: "rentals count fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rentals count" });
  }
});

// ----- revenue this year -----
app.get("/api/revenue", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(price) FROM rentals WHERE EXTRACT(YEAR FROM rental_start) = EXTRACT(YEAR FROM CURRENT_DATE)"
    );
    res.json({
      message: "this year's revenue fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch this year's revenue" });
  }
});

// ----- available cars -----
app.get("/api/cars/available", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) from car_units where status='available'"
    );
    res.json({
      message: "the available cars fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch the available cars" });
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

  const client = await pool.connect(); // Use a client for a transaction
  try {
    await client.query("BEGIN"); // Start transaction to ensure data integrity

    // 1. Get car price
    const carRes = await client.query("SELECT price FROM cars WHERE id = $1", [
      car_id,
    ]);
    if (!carRes.rowCount) throw new Error("Car not found");
    const dayPrice = carRes.rows[0].price;

    // 2. Find available unit by checking the NEW status column
    const unitRes = await client.query(
      `SELECT id FROM car_units 
       WHERE car_id = $1 AND status = 'available' 
       LIMIT 1 FOR UPDATE`, // "FOR UPDATE" prevents two people booking the same car at once
      [car_id]
    );

    if (!unitRes.rowCount) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ error: "No available vehicle at the moment" });
    }

    const carUnitId = unitRes.rows[0].id;

    // 3. Calculate price
    const days = Math.ceil(
      (new Date(rental_end) - new Date(rental_start)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * dayPrice;

    // 4. Insert the rental
    const rentalRes = await client.query(
      `INSERT INTO rentals (car_id, client_id, rental_start, rental_end, price, status)
       VALUES ($1, $2, $3, $4, $5, 'rented') RETURNING *`,
      [carUnitId, client_id, rental_start, rental_end, totalPrice]
    );

    // 5. UPDATE the status in car_units
    await client.query("UPDATE car_units SET status = 'rented' WHERE id = $1", [
      carUnitId,
    ]);

    await client.query("COMMIT"); // Save all changes
    res
      .status(201)
      .json({ message: "Booking confirmed", data: rentalRes.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK"); // Cancel everything if something fails
    console.error("Rental error:", err);
    res.status(500).json({ error: err.message || "Failed to process booking" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
