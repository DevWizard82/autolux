import pg from "pg";
import dotenv from "dotenv";
import {
  mockCars,
  mockClients,
  mockCarUnits,
  mockLocations,
  mockModels,
  mockCarParts,
  mockRentals
} from "./mockData.js";

dotenv.config();

// Mutable in-memory database arrays
let cars = [...mockCars];
let clients = [...mockClients].map(c => ({
  ...c,
  password_hash: c.password || "$2b$10$wEHLKq2wIqC6XkLh/Wl5eOq6XJocX769VzC/fM9R.J73XyD6s0V9e"
}));
let carUnits = [...mockCarUnits];
let locations = [...mockLocations];
let models = [...mockModels];
let carParts = [...mockCarParts];
let rentals = [...mockRentals];

console.log("⚡ [Mock DB] Initializing polished premium in-memory database driver.");

const equals = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

class MockClient {
  async query(text, params = []) {
    const queryStr = text.replace(/\s+/g, " ").trim();
    // console.log(`🔍 [Mock DB Query]`, queryStr, params);

    // 1. Transaction Handlers
    if (queryStr === "BEGIN" || queryStr === "COMMIT" || queryStr === "ROLLBACK") {
      return { rows: [], rowCount: 0 };
    }

    // 2. Cars Enquiries
    if (queryStr.includes("SELECT * FROM cars ORDER BY created_at DESC LIMIT 3")) {
      return { rows: cars.slice(0, 3), rowCount: Math.min(cars.length, 3) };
    }
    if (queryStr.includes("SELECT * FROM cars WHERE LOWER(make) = LOWER($1) AND LOWER(name) = LOWER($2)")) {
      const match = cars.find(c => equals(c.make, params[0]) && equals(c.name, params[1]));
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT * FROM cars")) {
      return { rows: cars, rowCount: cars.length };
    }
    if (queryStr.includes("SELECT price FROM cars WHERE id = $1")) {
      const match = cars.find(c => c.id === parseInt(params[0]));
      return { rows: match ? [{ price: match.price }] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT make, name FROM cars WHERE id = $1")) {
      const match = cars.find(c => c.id === parseInt(params[0]));
      return { rows: match ? [{ make: match.make, name: match.name }] : [], rowCount: match ? 1 : 0 };
    }

    // 3. Models
    if (queryStr.includes("SELECT m.*, c.name as car_name, c.make as car_make FROM models m JOIN cars c ON m.car_id = c.id")) {
      const joined = models.map(m => {
        const car = cars.find(c => c.id === m.car_id);
        return {
          ...m,
          car_name: car ? car.name : "Model",
          car_make: car ? car.make : "Luxury"
        };
      });
      return { rows: joined, rowCount: joined.length };
    }
    if (queryStr.includes("SELECT * FROM models WHERE id = $1")) {
      const match = models.find(m => m.id === parseInt(params[0]));
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }

    // 4. Car Parts
    if (queryStr.includes("SELECT DISTINCT part_type FROM car_parts WHERE car_id = $1")) {
      const filtered = carParts.filter(p => p.car_id === parseInt(params[0]));
      const uniqueTypes = [...new Set(filtered.map(p => p.part_type))].map(type => ({ part_type: type }));
      return { rows: uniqueTypes, rowCount: uniqueTypes.length };
    }
    if (queryStr.includes("SELECT c.id AS car_id, m.file_path AS car_file_path, cp.id AS part_id, cp.part_name, cp.part_type")) {
      const result = [];
      carParts.filter(cp => cp.car_id === parseInt(params[0])).forEach(cp => {
        const model = models.find(m => m.car_id === cp.car_id);
        result.push({
          car_id: cp.car_id,
          car_file_path: model ? model.file_path : null,
          part_id: cp.id,
          part_name: cp.part_name,
          part_type: cp.part_type
        });
      });
      return { rows: result, rowCount: result.length };
    }

    // 5. Locations
    if (queryStr.includes("SELECT distinct city_name FROM locations")) {
      const distinct = [...new Set(locations.map(l => l.city_name))].map(city => ({ city_name: city }));
      return { rows: distinct, rowCount: distinct.length };
    }
    if (queryStr.includes("SELECT id, city_name, map_embed_url FROM locations")) {
      return { rows: locations, rowCount: locations.length };
    }
    if (queryStr.includes("SELECT city_name, json_agg(json_build_object('id', id, 'map_embed_url', map_embed_url)) as locations")) {
      const grouped = {};
      locations.forEach(loc => {
        if (!grouped[loc.city_name]) grouped[loc.city_name] = [];
        grouped[loc.city_name].push({ id: loc.id, map_embed_url: loc.map_embed_url });
      });
      const rows = Object.keys(grouped).map(city => ({
        city_name: city,
        locations: grouped[city]
      }));
      return { rows, rowCount: rows.length };
    }
    if (queryStr.includes("SELECT COUNT(*) FROM locations;")) {
      return { rows: [{ count: String(locations.length) }], rowCount: 1 };
    }

    // 6. Clients & Authentication
    if (queryStr.includes("SELECT id FROM clients WHERE email = $1")) {
      const match = clients.find(c => equals(c.email, params[0]));
      return { rows: match ? [{ id: match.id }] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT * FROM clients WHERE email = $1")) {
      const match = clients.find(c => equals(c.email, params[0]));
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT * FROM clients WHERE id = $1")) {
      const match = clients.find(c => c.id === parseInt(params[0]));
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT id, first_name, last_name, email, phone FROM clients")) {
      const nonAdmins = clients.filter(c => c.role !== "admin");
      return { rows: nonAdmins, rowCount: nonAdmins.length };
    }
    if (queryStr.includes("SELECT count(id) from clients where role <> 'admin'")) {
      const nonAdmins = clients.filter(c => c.role !== "admin");
      return { rows: [{ count: String(nonAdmins.length) }], rowCount: 1 };
    }

    // 7. Car Units
    if (queryStr.includes("SELECT DISTINCT color FROM car_units WHERE car_id = $1 AND status = 'available'")) {
      const filtered = carUnits.filter(u => u.car_id === parseInt(params[0]) && u.status === "available");
      const uniqueColors = [...new Set(filtered.map(u => u.color))].map(color => ({ color }));
      return { rows: uniqueColors, rowCount: uniqueColors.length };
    }
    if (queryStr.includes("SELECT u.id, u.vin, u.color, c.name, c.make, c.price, c.image, u.status, u.car_id FROM car_units u JOIN cars c ON u.car_id = c.id")) {
      const joined = carUnits.map(u => {
        const car = cars.find(c => c.id === u.car_id);
        return {
          id: u.id,
          vin: u.vin,
          color: u.color,
          name: car ? car.name : "",
          make: car ? car.make : "",
          price: car ? car.price : 0,
          image: car ? car.image : "",
          status: u.status,
          car_id: u.car_id
        };
      });
      return { rows: joined, rowCount: joined.length };
    }
    if (queryStr.includes("SELECT COUNT(*) from car_units")) {
      if (queryStr.includes("status='available'")) {
        const av = carUnits.filter(u => u.status === "available").length;
        return { rows: [{ count: String(av) }], rowCount: 1 };
      }
      return { rows: [{ count: String(carUnits.length) }], rowCount: 1 };
    }
    if (queryStr.includes("SELECT car_id, c.image FROM car_units cu JOIN cars c ON cu.car_id = c.id WHERE cu.id = $1")) {
      const unit = carUnits.find(u => u.id === parseInt(params[0]));
      const car = unit ? cars.find(c => c.id === unit.car_id) : null;
      return {
        rows: unit && car ? [{ car_id: unit.car_id, image: car.image }] : [],
        rowCount: unit && car ? 1 : 0
      };
    }
    if (queryStr.includes("SELECT car_id FROM car_units WHERE id = $1")) {
      const unit = carUnits.find(u => u.id === parseInt(params[0]));
      return { rows: unit ? [{ car_id: unit.car_id }] : [], rowCount: unit ? 1 : 0 };
    }
    if (queryStr.includes("SELECT COUNT(*) as count FROM car_units WHERE car_id = $1")) {
      const count = carUnits.filter(u => u.car_id === parseInt(params[0])).length;
      return { rows: [{ count: String(count) }], rowCount: 1 };
    }
    if (queryStr.includes("SELECT id, car_id FROM car_units")) {
      // Find available units
      const avUnits = carUnits.filter(u => u.status === "available");
      return { rows: avUnits, rowCount: avUnits.length };
    }

    // 8. Rentals & Bookings
    if (queryStr.includes("SELECT count(*) FROM rentals WHERE status = 'rented'")) {
      const rented = rentals.filter(r => r.status === "rented").length;
      return { rows: [{ count: String(rented) }], rowCount: 1 };
    }
    if (queryStr.includes("SELECT SUM(price) FROM rentals WHERE status IN ('rented', 'completed')")) {
      const total = rentals
        .filter(r => r.status === "rented" || r.status === "completed")
        .reduce((sum, r) => sum + Number(r.price), 0);
      return { rows: [{ sum: String(total) }], rowCount: 1 };
    }
    if (queryStr.includes("FROM rentals r JOIN cars c ON r.car_id = c.id WHERE r.client_id = $1")) {
      const userId = parseInt(params[0]);
      const userRentals = rentals.filter(r => r.client_id === userId);
      const joined = userRentals.map(r => {
        const car = cars.find(c => c.id === r.car_id);
        return {
          ...r,
          car_name: car ? car.name : "Luxury Car",
          car_make: car ? car.make : "Brand",
          car_image: car ? car.image : ""
        };
      });
      return { rows: joined, rowCount: joined.length };
    }
    if (queryStr.includes("SELECT r.*, c.name as car_name, c.make as car_make, cl.first_name, cl.last_name FROM rentals r")) {
      const joined = rentals.map(r => {
        const unit = carUnits.find(u => u.id === r.car_id);
        const car = unit ? cars.find(c => c.id === unit.car_id) : null;
        const client = clients.find(cl => cl.id === r.client_id);
        return {
          ...r,
          car_name: car ? car.name : "Luxury Car",
          car_make: car ? car.make : "Brand",
          first_name: client ? client.first_name : "VIP",
          last_name: client ? client.last_name : "Client"
        };
      });
      return { rows: joined, rowCount: joined.length };
    }
    if (queryStr.includes("SELECT * FROM rentals WHERE id = $1")) {
      const match = rentals.find(r => r.id === parseInt(params[0]));
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("SELECT car_id, status FROM rentals WHERE id = $1")) {
      const match = rentals.find(r => r.id === parseInt(params[0]));
      return { rows: match ? [{ car_id: match.car_id, status: match.status }] : [], rowCount: match ? 1 : 0 };
    }

    // 9. Analytics Dashboard Queries
    if (queryStr.includes("SELECT c.first_name || ' ' || c.last_name as name, COUNT(r.id) as count FROM clients c")) {
      const leaders = clients
        .filter(c => c.role !== "admin")
        .map(c => {
          const count = rentals.filter(r => r.client_id === c.id).length;
          return { name: `${c.first_name} ${c.last_name}`, count: String(count) };
        })
        .sort((a, b) => Number(b.count) - Number(a.count))
        .slice(0, 10);
      return { rows: leaders, rowCount: leaders.length };
    }
    if (queryStr.includes("SELECT TO_CHAR(rental_start, 'Mon') as month, SUM(price) as total")) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonthIndex = new Date().getMonth();
      const rows = [];
      for (let i = 11; i >= 0; i--) {
        const idx = (currentMonthIndex - i + 12) % 12;
        rows.push({ month: months[idx], total: String(Math.floor(Math.random() * 4000 + 1000)) });
      }
      return { rows, rowCount: rows.length };
    }
    if (queryStr.includes("SELECT status, COUNT(*) as count FROM car_units")) {
      const counts = { available: 0, rented: 0, maintenance: 0 };
      carUnits.forEach(u => {
        if (counts[u.status] !== undefined) counts[u.status]++;
      });
      const rows = Object.keys(counts).map(status => ({ status, count: String(counts[status]) }));
      return { rows, rowCount: rows.length };
    }
    if (queryStr.includes("SELECT c.make, c.name, COUNT(r.id) as count FROM rentals r JOIN car_units cu ON r.car_id = cu.id JOIN cars c ON cu.car_id = c.id")) {
      const counts = {};
      rentals.forEach(r => {
        const unit = carUnits.find(u => u.id === r.car_id);
        const car = unit ? cars.find(c => c.id === unit.car_id) : null;
        if (car) {
          const key = `${car.make} ${car.name}`;
          if (!counts[key]) counts[key] = { make: car.make, name: car.name, count: 0 };
          counts[key].count++;
        }
      });
      const rows = Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => ({ make: item.make, name: item.name, count: String(item.count) }));
      return { rows, rowCount: rows.length };
    }
    if (queryStr.includes("SELECT c.name, AVG(r.rental_end - r.rental_start) as avg_days FROM rentals r")) {
      const avgs = [];
      cars.slice(0, 10).forEach(car => {
        avgs.push({ name: car.name, avg_days: "4.5" });
      });
      return { rows: avgs, rowCount: avgs.length };
    }

    // 10. INSERT Mutations (Persisted in Local Mock State)
    if (queryStr.includes("INSERT INTO clients")) {
      const id = clients.length + 1;
      const newClient = {
        id,
        email: params[0],
        password_hash: params[1],
        first_name: params[2],
        last_name: params[3],
        phone: params[4] || "",
        role: "client",
        created_at: new Date()
      };
      clients.push(newClient);
      return { rows: [newClient], rowCount: 1 };
    }

    if (queryStr.includes("INSERT INTO rentals")) {
      const id = rentals.length + 1;
      const newRental = {
        id,
        client_id: parseInt(params[0]),
        car_id: parseInt(params[1]),
        rental_start: new Date(params[2]),
        rental_end: new Date(params[3]),
        price: parseFloat(params[4]),
        status: "rented",
        location_id: parseInt(params[5]) || 1,
        created_at: new Date()
      };
      rentals.push(newRental);
      // Mark matching unit as rented
      const unit = carUnits.find(u => u.id === newRental.car_id);
      if (unit) unit.status = "rented";
      return { rows: [newRental], rowCount: 1 };
    }

    if (queryStr.includes("INSERT INTO cars")) {
      const id = cars.length + 1;
      const newCar = {
        id,
        name: params[0],
        make: params[1],
        price: parseFloat(params[2]),
        image: params[3],
        category: "custom",
        description: JSON.parse(params[4] || "{}"),
        locations: JSON.parse(params[5] || "{}")
      };
      cars.push(newCar);
      return { rows: [newCar], rowCount: 1 };
    }

    if (queryStr.includes("INSERT INTO car_units")) {
      const id = carUnits.length + 1;
      const newUnit = {
        id,
        car_id: parseInt(params[0]),
        color: params[1],
        vin: params[2],
        mileage: parseInt(params[3]) || 0,
        status: "available"
      };
      carUnits.push(newUnit);
      return { rows: [newUnit], rowCount: 1 };
    }

    if (queryStr.includes("INSERT INTO models")) {
      const id = models.length + 1;
      const newModel = {
        id,
        car_id: parseInt(params[0]),
        file_path: params[1],
        scale_x: parseFloat(params[2]) || 1.0,
        rot_y: parseFloat(params[3]) || 0.0
      };
      models.push(newModel);
      return { rows: [newModel], rowCount: 1 };
    }

    // UPDATE Queries
    if (queryStr.includes("UPDATE clients SET password = $1 WHERE id = $2")) {
      const match = clients.find(c => c.id === parseInt(params[1]));
      if (match) match.password_hash = params[0];
      return { rows: [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("UPDATE clients SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5") || queryStr.includes("UPDATE clients SET first_name = COALESCE($1")) {
      // Find client
      const idParam = params[4] || params[params.length - 1];
      const match = clients.find(c => c.id === parseInt(idParam));
      if (match) {
        match.first_name = params[0] || match.first_name;
        match.last_name = params[1] || match.last_name;
        match.email = params[2] || match.email;
        match.phone = params[3] || match.phone;
      }
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }
    if (queryStr.includes("UPDATE rentals SET status = $1 WHERE id = $2")) {
      const match = rentals.find(r => r.id === parseInt(params[1]));
      if (match) {
        match.status = params[0];
        if (params[0] === "completed" || params[0] === "cancelled") {
          const unit = carUnits.find(u => u.id === match.car_id);
          if (unit) unit.status = "available";
        }
      }
      return { rows: [], rowCount: match ? 1 : 0 };
    }

    // DELETE Queries
    if (queryStr.includes("DELETE FROM car_units WHERE id = $1")) {
      const initialLength = carUnits.length;
      carUnits = carUnits.filter(u => u.id !== parseInt(params[0]));
      return { rows: [], rowCount: initialLength - carUnits.length };
    }
    if (queryStr.includes("DELETE FROM cars WHERE id = $1")) {
      const initialLength = cars.length;
      cars = cars.filter(c => c.id !== parseInt(params[0]));
      return { rows: [], rowCount: initialLength - cars.length };
    }

    return { rows: [], rowCount: 0 };
  }

  release() {
    // No-op
  }
}

class MockPool {
  async query(text, params = []) {
    const client = new MockClient();
    return client.query(text, params);
  }

  async connect() {
    return new MockClient();
  }

  on(event, callback) {
    // No-op
  }
}

const isRealDbConfigured =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD") &&
  !process.env.DATABASE_URL.includes("dpg-d7gbqetckfvc73bci2d0-a");

let pool;

if (isRealDbConfigured) {
  console.log("⚡ [Database] Initializing real Neon PostgreSQL Connection Pool...");
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  pool.on("connect", () => {
    console.log("⚡ [Database] Successfully connected to live Neon PostgreSQL database.");
  });

  pool.on("error", (err) => {
    console.error("❌ [Database] Connection pool error:", err);
  });
} else {
  console.warn(
    "⚠️  [Database] DATABASE_URL is not configured with Neon credentials or contains placeholder text.\n" +
    "👉 Falling back to premium in-memory Mock database driver for local development."
  );
  pool = new MockPool();
}

export default pool;
