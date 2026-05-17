import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_8T7uokCbstVd@ep-empty-queen-aosquhye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log("DB connected successfully");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(40),
        email VARCHAR(25) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    client.release();
  } catch (err) {
    console.error("DB init failed:", err);
  }
};