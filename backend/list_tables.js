
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: 'backend/.env' });

const pool = new pg.Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

async function listTables() {
    try {
        const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        let output = "Tables: " + JSON.stringify(res.rows.map(r => r.table_name)) + "\n";

        for (const name of ['rentals', 'bookings', 'orders', 'rental_orders']) { // added rental_orders just in case
            const check = res.rows.find(r => r.table_name === name);
            if (check) {
                const cols = await pool.query(`
           SELECT column_name, data_type 
           FROM information_schema.columns 
           WHERE table_name = '${name}'
         `);
                output += `Columns for ${name}: ` + JSON.stringify(cols.rows) + "\n";
            }
        }

        fs.writeFileSync('tables_utf8.txt', output, 'utf8');
        console.log("Done");

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

listTables();
