import express from "express";
import pool from "./db/pool.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch car types" });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
