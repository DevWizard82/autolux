import pg from "pg";
import dotenv from "dotenv";
import {
  mockLocations,
  mockCars,
  mockClients,
  mockCarUnits,
  mockModels,
  mockCarParts,
  mockRentals,
} from "./mockData.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes("YOUR_NEON_PASSWORD")) {
  console.error("❌ [Seeder] DATABASE_URL is not set or still contains a placeholder. Please configure it in your .env file.");
  process.exit(1);
}

console.log("⚡ [Seeder] Connecting to Neon PostgreSQL Database...");
const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  try {
    await client.connect();
    console.log("🟢 [Seeder] Connected successfully. Starting schema setup...");

    // 1. Drop existing tables in reverse dependency order
    await client.query(`
      DROP TABLE IF EXISTS rentals CASCADE;
      DROP TABLE IF EXISTS car_parts CASCADE;
      DROP TABLE IF EXISTS models CASCADE;
      DROP TABLE IF EXISTS car_units CASCADE;
      DROP TABLE IF EXISTS clients CASCADE;
      DROP TABLE IF EXISTS cars CASCADE;
      DROP TABLE IF EXISTS locations CASCADE;
    `);
    console.log("🗑️ [Seeder] Dropped old tables (if any).");

    // 2. Create tables with pristine schemas
    console.log("🛠️ [Seeder] Creating table structures...");

    await client.query(`
      CREATE TABLE locations (
        id SERIAL PRIMARY KEY,
        city_name VARCHAR(100) NOT NULL,
        map_embed_url TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        make VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image VARCHAR(255),
        category VARCHAR(50) DEFAULT 'custom',
        description JSONB,
        locations JSONB,
        engine_code VARCHAR(50),
        displacement VARCHAR(50),
        horsepower INTEGER,
        zero_to_hundred NUMERIC(4, 2),
        top_speed INTEGER,
        drivetrain VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE clients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE car_units (
        id SERIAL PRIMARY KEY,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        color VARCHAR(100) NOT NULL,
        vin VARCHAR(100) UNIQUE NOT NULL,
        mileage INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE models (
        id SERIAL PRIMARY KEY,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        file_path VARCHAR(255) NOT NULL,
        scale_x NUMERIC(5, 2) DEFAULT 1.00,
        rot_y NUMERIC(5, 2) DEFAULT 0.00
      );
    `);

    await client.query(`
      CREATE TABLE car_parts (
        id SERIAL PRIMARY KEY,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        part_name VARCHAR(100) NOT NULL,
        part_type VARCHAR(50) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE rentals (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        car_id INTEGER, -- Not strictly constrained because of direct lookup variations
        rental_start TIMESTAMP NOT NULL,
        rental_end TIMESTAMP NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'rented',
        location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ [Seeder] Tables created successfully.");

    // 3. Populate mockLocations
    console.log("🌱 [Seeder] Seeding locations...");
    for (const loc of mockLocations) {
      await client.query(
        "INSERT INTO locations (id, city_name, map_embed_url) VALUES ($1, $2, $3)",
        [loc.id, loc.city_name, loc.map_embed_url]
      );
    }

    // 4. Populate mockCars
    console.log("🌱 [Seeder] Seeding cars fleet...");
    for (const car of mockCars) {
      await client.query(
        `INSERT INTO cars (
          id, name, make, price, image, category, description, locations,
          engine_code, displacement, horsepower, zero_to_hundred, top_speed, drivetrain
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          car.id,
          car.name,
          car.make,
          car.price,
          car.image,
          car.category,
          JSON.stringify(car.description),
          JSON.stringify(car.locations),
          car.engine_code,
          car.displacement,
          car.horsepower,
          car.zero_to_hundred,
          car.top_speed,
          car.drivetrain,
        ]
      );
    }

    // 5. Populate mockClients
    console.log("🌱 [Seeder] Seeding clients & administrators...");
    for (const clientObj of mockClients) {
      const passwordHash = clientObj.password || "$2b$10$wEHLKq2wIqC6XkLh/Wl5eOq6XJocX769VzC/fM9R.J73XyD6s0V9e";
      await client.query(
        "INSERT INTO clients (id, first_name, last_name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          clientObj.id,
          clientObj.first_name,
          clientObj.last_name,
          clientObj.email,
          passwordHash,
          clientObj.role,
          clientObj.phone,
        ]
      );
    }

    // 6. Populate mockCarUnits
    console.log("🌱 [Seeder] Seeding physical vehicle units...");
    for (const unit of mockCarUnits) {
      await client.query(
        "INSERT INTO car_units (id, car_id, color, vin, mileage, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [unit.id, unit.car_id, unit.color, unit.vin, unit.mileage, unit.status]
      );
    }

    // 7. Populate mockModels
    console.log("🌱 [Seeder] Seeding 3D glb model configs...");
    for (const model of mockModels) {
      await client.query(
        "INSERT INTO models (id, car_id, file_path, scale_x, rot_y) VALUES ($1, $2, $3, $4, $5)",
        [model.id, model.car_id, model.file_path, model.scale_x, model.rot_y]
      );
    }

    // 8. Populate mockCarParts
    console.log("🌱 [Seeder] Seeding customized car parts...");
    for (const part of mockCarParts) {
      await client.query(
        "INSERT INTO car_parts (id, car_id, part_name, part_type) VALUES ($1, $2, $3, $4)",
        [part.id, part.car_id, part.part_name, part.part_type]
      );
    }

    // 9. Populate mockRentals
    console.log("🌱 [Seeder] Seeding historic & active rentals...");
    for (const rental of mockRentals) {
      await client.query(
        "INSERT INTO rentals (id, client_id, car_id, rental_start, rental_end, price, status, location_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          rental.id,
          rental.client_id,
          rental.car_id,
          rental.rental_start,
          rental.rental_end,
          rental.price,
          rental.status,
          rental.location_id,
        ]
      );
    }

    // 10. CRITICAL: Reset the PostgreSQL Serial auto-incrementing ID sequences
    console.log("⚙️ [Seeder] Synchronizing table serial sequence generators...");
    await client.query("SELECT setval('locations_id_seq', COALESCE((SELECT MAX(id)+1 FROM locations), 1), false);");
    await client.query("SELECT setval('cars_id_seq', COALESCE((SELECT MAX(id)+1 FROM cars), 1), false);");
    await client.query("SELECT setval('clients_id_seq', COALESCE((SELECT MAX(id)+1 FROM clients), 1), false);");
    await client.query("SELECT setval('car_units_id_seq', COALESCE((SELECT MAX(id)+1 FROM car_units), 1), false);");
    await client.query("SELECT setval('models_id_seq', COALESCE((SELECT MAX(id)+1 FROM models), 1), false);");
    await client.query("SELECT setval('car_parts_id_seq', COALESCE((SELECT MAX(id)+1 FROM car_parts), 1), false);");
    await client.query("SELECT setval('rentals_id_seq', COALESCE((SELECT MAX(id)+1 FROM rentals), 1), false);");

    console.log("🎉 [Seeder] Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ [Seeder] Error executing database seed:", err);
  } finally {
    await client.end();
    console.log("🔌 [Seeder] Disconnected from Neon.");
  }
}

seed();
