import express from "express";
import pool from "./db/pool.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://glowing-paletas-7e25a6.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Parse JSON & form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (images, css, js, etc.)
app.use(express.static("public"));

// --- MULTER CONFIGURATION ---

// 1. Define the Upload Directory using process.cwd() (Project Root)
let uploadDir;
let modelUploadDir;

if (process.env.NODE_ENV === "production") {
  // Use /tmp in Vercel (writable)
  uploadDir = "/tmp";
  modelUploadDir = "/tmp";

  // Ensure we don't crash if these don't exist (though /tmp always exists)
} else {
  // Local Development
  uploadDir = path.join(__dirname, "../frontend/public/assets/images");
  modelUploadDir = path.join(__dirname, "../frontend/public/assets/models");

  // Ensure directories exist locally
  if (!fs.existsSync(uploadDir)) {
    console.log(`Creating directory: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(modelUploadDir)) {
    console.log(`Creating directory: ${modelUploadDir}`);
    fs.mkdirSync(modelUploadDir, { recursive: true });
  }
}

// 3. Serve the 'public' folder
app.use(express.static("public"));
// Serve frontend public folder for assets
app.use(express.static(path.join(__dirname, "../frontend/public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = "car_" + uniqueSuffix + ext;
    console.log(`Saving file: ${filename}`);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpg, png, webp) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB
  fileFilter: fileFilter,
});

// --- MODEL MULTER CONFIGURATION ---
// modelUploadDir is already defined above

const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, modelUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Temp name, will be renamed in controller
    const filename = "temp_model_" + Date.now() + ext;
    cb(null, filename);
  },
});

const uploadModel = multer({
  storage: modelStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for 3D models
});

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
      user.password_hash,
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
      [firstName, lastName, email, userId],
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

// Get Revenue by Month (Last 12 Months)
app.get("/api/analytics/revenue-monthly", async (req, res) => {
  const result = await pool.query(`
    SELECT TO_CHAR(rental_start, 'Mon') as month, SUM(price) as total
    FROM rentals
    WHERE rental_start >= CURRENT_DATE - INTERVAL '11 months'
    GROUP BY month, EXTRACT(YEAR FROM rental_start), EXTRACT(MONTH FROM rental_start)
    ORDER BY EXTRACT(YEAR FROM rental_start), EXTRACT(MONTH FROM rental_start)
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

// Get Top 5 Rented Models
app.get("/api/analytics/top-models", async (req, res) => {
  const result = await pool.query(`
    SELECT c.make, c.name, COUNT(r.id) as count
    FROM rentals r
    JOIN car_units cu ON r.car_id = cu.id
    JOIN cars c ON cu.car_id = c.id
    GROUP BY c.id, c.make, c.name
    ORDER BY count DESC
    LIMIT 5
  `);
  res.json(result.rows);
});

// Get Average Rental Duration per Model
app.get("/api/analytics/avg-duration", async (req, res) => {
  const result = await pool.query(`
    SELECT c.name, AVG(r.rental_end - r.rental_start) as avg_days
    FROM rentals r
    JOIN car_units cu ON r.car_id = cu.id
    JOIN cars c ON cu.car_id = c.id
    GROUP BY c.id, c.name
    LIMIT 10
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

const createMultilingualData = (text) => {
  if (!text) return "{}";
  const languages = [
    "ar",
    "de",
    "en",
    "es",
    "fr",
    "it",
    "ja",
    "pt",
    "ru",
    "zh",
  ];
  const obj = {};
  languages.forEach((lang) => (obj[lang] = text.trim()));
  return JSON.stringify(obj);
};

// CREATE (Robust Smart Logic)
app.post("/api/cars", upload.single("image"), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      car_id_select,
      name,
      make,
      price,
      color,
      vin,
      mileage,
      description,
      location_text,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let finalCarId = car_id_select;

    // LOGIC: Determine if we need to CREATE a new model
    // 1. User explicitly selected "Create New" ('NEW')
    // 2. OR User didn't select anything (undefined) but provided Name & Make (Legacy/Fallback mode)
    const shouldCreateNew =
      finalCarId === "NEW" || (!finalCarId && name && make);

    if (shouldCreateNew) {
      // A. First, check if this model ALREADY exists to avoid duplicates
      // (e.g. User typed "BMW M5" but forgot to select it from dropdown)
      const checkExisting = await client.query(
        "SELECT id FROM cars WHERE LOWER(make) = LOWER($1) AND LOWER(name) = LOWER($2)",
        [make, name],
      );

      if (checkExisting.rows.length > 0) {
        // Found it! Use existing ID
        finalCarId = checkExisting.rows[0].id;
      } else {
        // B. Definitely New -> Insert into 'cars' table
        const descJson = createMultilingualData(
          description || `The ${make} ${name}`,
        );
        const locJson = createMultilingualData(
          location_text || "Casablanca, Rabat",
        );

        const nameStr = `${make} ${name}`;

        const insertModel = await client.query(
          `INSERT INTO cars (name, make, price, image, category, description, locations, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'custom', $5, $6, NOW(), NOW())
           RETURNING id`,
          [nameStr, make, price, image, descJson, locJson],
        );
        finalCarId = insertModel.rows[0].id;
      }
    }

    // SAFETY CHECK: If we still don't have an ID, stop here.
    if (!finalCarId) {
      throw new Error(
        "Car Model ID is missing. Please select a model or provide Name/Make to create a new one.",
      );
    }

    // 2. Create the Physical Unit
    await client.query(
      `INSERT INTO car_units (car_id, color, vin, mileage, status, created_at)
       VALUES ($1, $2, $3, $4, 'available', NOW())`,
      [finalCarId, color, vin, mileage || 0],
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Vehicle added successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Create Car Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});
// DELETE VEHICLE
app.delete("/api/cars/:unitId", async (req, res) => {
  const { unitId } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get the unit to find the car_id
    const unitRes = await client.query(
      "SELECT car_id FROM car_units WHERE id = $1",
      [unitId],
    );

    if (unitRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const carId = unitRes.rows[0].car_id;

    // Delete the car unit
    await client.query("DELETE FROM car_units WHERE id = $1", [unitId]);

    // Check if there are any other units for this car
    const otherUnitsRes = await client.query(
      "SELECT COUNT(*) as count FROM car_units WHERE car_id = $1",
      [carId],
    );

    // If no other units exist, optionally delete the car model too
    if (parseInt(otherUnitsRes.rows[0].count) === 0) {
      await client.query("DELETE FROM cars WHERE id = $1", [carId]);
    }

    await client.query("COMMIT");
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ----- Models -----
app.get("/api/models", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as car_name, c.make as car_make 
      FROM models m 
      JOIN cars c ON m.car_id = c.id 
      ORDER BY m.id ASC
    `);
    res.json({ message: "Models fetched successfully", data: result.rows });
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.post("/api/models", uploadModel.single("file"), async (req, res) => {
  const { car_id, scale_x, rot_y } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get Car Details for Naming
    const carRes = await client.query(
      "SELECT make, name FROM cars WHERE id = $1",
      [car_id],
    );
    if (carRes.rowCount === 0) {
      throw new Error("Car not found");
    }
    const { make, name } = carRes.rows[0];

    // 2. Process File
    let finalFileName = "";
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      // Construct new name: Make_Name.glb (sanitize spaces)
      const sanitizedMake = make.replace(/\s+/g, "_");
      const sanitizedName = name.replace(/\s+/g, "_");

      // Avoid redundancy if Name starts with Make
      if (sanitizedName.toLowerCase().startsWith(sanitizedMake.toLowerCase())) {
        finalFileName = `${sanitizedName}${ext}`;
      } else {
        finalFileName = `${sanitizedMake}_${sanitizedName}${ext}`;
      }

      const oldPath = req.file.path;
      const newPath = path.join(modelUploadDir, finalFileName);

      // Rename file
      fs.renameSync(oldPath, newPath);
    } else {
      throw new Error("File is required");
    }

    // 3. Insert into DB
    const result = await client.query(
      "INSERT INTO models (car_id, file_path, scale_x, rot_y) VALUES ($1, $2, $3, $4) RETURNING *",
      [car_id, finalFileName, scale_x || 1.0, rot_y || 0.0],
    );

    await client.query("COMMIT");
    // Return also car details so frontend table updates nicely
    const newModel = result.rows[0];
    newModel.car_make = make;
    newModel.car_name = name;

    res
      .status(201)
      .json({ message: "Model created successfully", data: newModel });
  } catch (err) {
    await client.query("ROLLBACK");
    // Cleanup temp file if it exists and we failed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create model" });
  } finally {
    client.release();
  }
});

app.put("/api/models/:id", uploadModel.single("file"), async (req, res) => {
  const { id } = req.params;
  const { car_id, scale_x, rot_y } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Processing PUT model:", id, req.body, req.file);

    // 1. Check if model exists
    const modelCheck = await client.query(
      "SELECT * FROM models WHERE id = $1",
      [id],
    );
    if (modelCheck.rowCount === 0) {
      throw new Error("Model not found");
    }

    // 2. Get Car Details (either from new car_id or existing)
    const targetCarId = car_id || modelCheck.rows[0].car_id;
    const carRes = await client.query(
      "SELECT make, name FROM cars WHERE id = $1",
      [targetCarId],
    );
    if (carRes.rowCount === 0) {
      throw new Error("Car not found");
    }
    const { make, name } = carRes.rows[0];

    // 3. Handle File Update
    let finalFileName = modelCheck.rows[0].file_path;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      // Construct new name
      const sanitizedMake = make.replace(/\s+/g, "_");
      const sanitizedName = name.replace(/\s+/g, "_");

      // Avoid redundancy
      if (sanitizedName.toLowerCase().startsWith(sanitizedMake.toLowerCase())) {
        finalFileName = `${sanitizedName}${ext}`;
      } else {
        finalFileName = `${sanitizedMake}_${sanitizedName}${ext}`;
      }

      const oldPath = req.file.path;
      const newPath = path.join(modelUploadDir, finalFileName);

      // Delete old file if it exists and is different?
      // Safe to overwrite or we implement smarter cleanup later.
      // For now, if we are renaming, we just move the temp file to the new name.
      fs.renameSync(oldPath, newPath);
    }
    // If no file uploaded, IF the car changed, we *could* rename the existing file,
    // but the requirement said "file_path when added or edited it should be... downloaded... and name should be Model name".
    // It's safer to only rename if a new file is uploaded OR (optional polish) if we really want to keep filenames synced with car names always.
    // For now, let's assume we rename only if a file is provided or stick to the existing one.
    // BUT the prompt says "file_path when added or edited ... should be Model name".
    // If user changes Car from "Porsche" to "BMW" but keeps same file (rare), we might want to rename it.
    // Let's stick to: If file is uploaded, rename it. If not, keep old path.

    // 4. Update DB
    const result = await client.query(
      "UPDATE models SET car_id = $1, file_path = $2, scale_x = $3, rot_y = $4 WHERE id = $5 RETURNING *",
      [targetCarId, finalFileName, scale_x, rot_y, id],
    );

    await client.query("COMMIT");

    // helper to return full data
    const updatedModel = result.rows[0];
    updatedModel.car_make = make;
    updatedModel.car_name = name;

    res.json({ message: "Model updated successfully", data: updatedModel });
  } catch (err) {
    await client.query("ROLLBACK");
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to update model" });
  } finally {
    client.release();
  }
});

app.delete("/api/models/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM models WHERE id = $1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Model not found" });
    res.json({ message: "Model deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete model" });
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
  getCarParts(req, res, "trim"),
);
app.get("/api/car-parts/body/:modelname", (req, res) =>
  getCarParts(req, res, "body"),
);
app.get("/api/car-parts/strip/:modelname", (req, res) =>
  getCarParts(req, res, "strip"),
);

// ----- Colors -----
app.get("/api/colors/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const result = await pool.query(
      "SELECT DISTINCT color FROM car_units WHERE car_id = $1 AND status = 'available'",
      [carId],
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
      [carId],
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
app.get("/api/locations/grouped", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT city_name, json_agg(json_build_object('id', id, 'map_embed_url', map_embed_url)) as locations 
      FROM locations 
      GROUP BY city_name 
      ORDER BY city_name ASC
    `);
    res.json({ message: "Grouped locations fetched", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch grouped locations" });
  }
});

app.get("/api/locations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, city_name, map_embed_url FROM locations ORDER BY city_name ASC",
    );
    res.json({ message: "Locations fetched successfully", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

app.get("/api/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT distinct city_name FROM locations");
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
      "SELECT count(id) from clients where role <> 'admin'",
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
      "SELECT id, first_name, last_name, email, phone FROM clients WHERE (role <> 'admin' OR role IS NULL) ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// add a new client

// Create a New Client
app.post("/api/clients", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    const userCheck = await pool.query(
      "SELECT * FROM clients WHERE email = $1",
      [email],
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const saltRounds = 10;
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const query = `
      INSERT INTO clients (first_name, last_name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, 'client')
      RETURNING *;
    `;

    const result = await pool.query(query, [
      first_name,
      last_name,
      email,
      phone,
      hashedPassword,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a client by ID
app.put("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  try {
    // 1. Check if the user exists first (optional but good practice)
    const checkUser = await pool.query("SELECT * FROM clients WHERE id = $1", [
      id,
    ]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    // 2. Perform the update
    // We use COALESCE to keep existing values if the new field is empty/null
    const query = `
      UPDATE clients 
      SET first_name = COALESCE($1, first_name), 
          last_name = COALESCE($2, last_name), 
          email = COALESCE($3, email), 
          phone = COALESCE($4, phone)
      WHERE id = $5
      RETURNING *;
    `;

    const result = await pool.query(query, [
      first_name,
      last_name,
      email,
      phone,
      id,
    ]);

    res.json({
      success: true,
      message: "Client updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
});

// Get detailed rentals for a specific user
app.get("/api/rentals/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // rentals links to cars (model) via car_id.
    // It does not link to specific car_units in the current schema.
    const query = `
      SELECT r.*, 
             c.name as car_name, c.make as car_make, c.image as car_image
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      WHERE r.client_id = $1
      ORDER BY r.rental_start DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user rentals:", err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

// Cancel a rental
app.post("/api/rentals/cancel/:id", async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if rental exists and is active
    const rentalRes = await client.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id],
    );
    if (rentalRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Rental not found" });
    }
    const rental = rentalRes.rows[0];

    if (["cancelled", "completed"].includes(rental.status)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Rental cannot be cancelled" });
    }

    // 2. Update rental status
    await client.query(
      "UPDATE rentals SET status = 'cancelled' WHERE id = $1",
      [id],
    );

    // Note: Since rentals are linked to 'cars' (models) and not specific 'car_units',
    // we cannot update a specific unit's status to 'available'.

    await client.query("COMMIT");
    res.json({ success: true, message: "Rental cancelled successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error cancelling rental:", err);
    res.status(500).json({ error: "Failed to cancel rental" });
  } finally {
    client.release();
  }
});

// Delete a client by ID
app.delete("/api/clients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Perform the delete operation
    const result = await pool.query(
      "DELETE FROM clients WHERE id = $1 RETURNING *",
      [id],
    );

    // 2. Check if a row was actually deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client:", err);

    // Check for foreign key violation (e.g., user has active rentals)
    if (err.code === "23503") {
      return res.status(400).json({
        error: "Cannot delete client: They have active rentals or history.",
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. GET FLEET DETAILS
app.get("/api/fleet", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.vin, u.color, c.name, c.make, c.price, c.image, u.status, u.car_id
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

// UPDATE CAR UNIT
app.put("/api/cars/:unitId", upload.single("image"), async (req, res) => {
  const { unitId } = req.params;
  const { color, vin, status } = req.body;

  try {
    // Get current car_id and image
    const currentCar = await pool.query(
      "SELECT car_id, c.image FROM car_units cu JOIN cars c ON cu.car_id = c.id WHERE cu.id = $1",
      [unitId],
    );

    if (currentCar.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const carId = currentCar.rows[0].car_id;
    const image = req.file ? req.file.filename : currentCar.rows[0].image;

    // Update car_units with unit-specific data
    await pool.query(
      "UPDATE car_units SET color = $1, vin = $2, status = $3 WHERE id = $4",
      [color, vin, status, unitId],
    );

    // Update cars table with image if provided
    if (req.file) {
      await pool.query("UPDATE cars SET image = $1 WHERE id = $2", [
        image,
        carId,
      ]);
    }

    res.json({ message: "Vehicle updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/locations", async (req, res) => {
  const { city_name, map_embed_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO locations (city_name, map_embed_url) VALUES ($1, $2) RETURNING *",
      [city_name, map_embed_url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create location" });
  }
});

app.put("/api/locations/:id", async (req, res) => {
  const { id } = req.params;
  const { city_name, map_embed_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE locations SET city_name = $1, map_embed_url = $2 WHERE id = $3 RETURNING *",
      [city_name, map_embed_url, id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Location not found" });
    res.json({
      message: "Location updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

app.delete("/api/locations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM locations WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

// ----- locations count -----
app.get("/api/locations/count", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM locations;");
    res.json({
      message: "locations count fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations count" });
  }
});

// ----- rentals count -----
app.get("/api/rentalscount", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT count(*) FROM rentals WHERE status = 'rented' AND rental_start <= NOW() AND rental_end >= NOW();",
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
      "SELECT SUM(price) FROM rentals WHERE status IN ('rented', 'completed') AND EXTRACT(YEAR FROM rental_start) = EXTRACT(YEAR FROM CURRENT_DATE)",
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
      "SELECT COUNT(*) from car_units where status='available'",
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
      "SELECT * FROM cars ORDER BY created_at DESC LIMIT 3",
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
      `SELECT id, car_id FROM car_units 
       WHERE car_id = $1 AND status = 'available' 
       LIMIT 1 FOR UPDATE`, // "FOR UPDATE" prevents two people booking the same car at once
      [car_id],
    );

    if (!unitRes.rowCount) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ error: "No available vehicle at the moment" });
    }

    const carUnitId = unitRes.rows[0].car_id;

    // 3. Calculate price
    const days = Math.ceil(
      (new Date(rental_end) - new Date(rental_start)) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = days * dayPrice;

    // 4. Insert the rental
    const rentalRes = await client.query(
      `INSERT INTO rentals (car_id, client_id, rental_start, rental_end, price, status)
       VALUES ($1, $2, $3, $4, $5, 'rented') RETURNING *`,
      [carUnitId, client_id, rental_start, rental_end, totalPrice],
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

// 1. GET ALL RENTALS (Detailed)
app.get("/api/admin/rentals", async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id, 
        r.client_id,
        r.rental_start, 
        r.rental_end, 
        r.status, 
        r.price, 
        r.created_at,
        c.first_name, 
        c.last_name, 
        c.email,
        cu.car_id AS car_model_id,
        ca.name as car_name, 
        ca.make as car_make,
        ca.image as car_image,
        cu.vin
      FROM rentals r
      JOIN clients c ON r.client_id = c.id
      JOIN car_units cu ON r.car_id = cu.id
      JOIN cars ca ON cu.car_id = ca.id
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

// 2. UPDATE RENTAL STATUS (Edit)
// 2. UPDATE RENTAL (Edit specific fields or Status)
app.put("/api/rentals/:id", async (req, res) => {
  const { id } = req.params;
  // Now accepts full update payload
  const { client_id, car_id, rental_start, rental_end, status } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Get current state to check if car changed
    const currentRes = await client.query(
      "SELECT car_id, status FROM rentals WHERE id = $1",
      [id],
    );
    if (currentRes.rows.length === 0) {
      throw new Error("Rental not found");
    }
    const oldRental = currentRes.rows[0];

    // 2. Calculate Price (if dates changed or car changed, strict logic would require fetching car price again)
    // For simplicity, we'll re-calculate price if car_id is provided.
    let newPrice = null;
    if (car_id && rental_start && rental_end) {
      const carRes = await client.query(
        "SELECT price FROM cars WHERE id = (SELECT car_id FROM car_units WHERE id = $1)",
        [car_id],
      );
      if (carRes.rows.length > 0) {
        const dayPrice = carRes.rows[0].price;
        const start = new Date(rental_start);
        const end = new Date(rental_end);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        newPrice = days * dayPrice;
      }
    }

    // 3. Update Rental Record
    // We maintain old values if new ones aren't sent (though frontend should send all for full edit)
    await client.query(
      `UPDATE rentals 
       SET client_id = COALESCE($1, client_id),
           car_id = COALESCE($2, car_id),
           rental_start = COALESCE($3, rental_start),
           rental_end = COALESCE($4, rental_end),
           status = COALESCE($5, status),
           price = COALESCE($6, price)
       WHERE id = $7`,
      [client_id, car_id, rental_start, rental_end, status, newPrice, id],
    );

    // 4. Handle Car Swaps (If car_id changed)
    if (car_id && parseInt(car_id) !== oldRental.car_id) {
      // Free up old car
      await client.query(
        "UPDATE car_units SET status = 'available' WHERE id = $1",
        [oldRental.car_id],
      );
      // Occupy new car (if status is active)
      if (status === "rented" || status === "active") {
        await client.query(
          "UPDATE car_units SET status = 'rented' WHERE id = $1",
          [car_id],
        );
      }
    }
    // 5. Handle Status Changes (Same car, but status changed e.g. Rented -> Completed)
    else if (status && status !== oldRental.status) {
      if (["cancelled", "completed"].includes(status)) {
        await client.query(
          "UPDATE car_units SET status = 'available' WHERE id = $1",
          [oldRental.car_id],
        );
      } else if (["rented", "active"].includes(status)) {
        await client.query(
          "UPDATE car_units SET status = 'rented' WHERE id = $1",
          [oldRental.car_id],
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true, message: "Rental updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Update failed: " + err.message });
  } finally {
    client.release();
  }
});

// 3. DELETE RENTAL
app.delete("/api/rentals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rentals WHERE id = $1", [id]);
    res.json({ success: true, message: "Rental record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
