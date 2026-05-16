import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();
const port = 5000;

app.use(express.json());
(app.use(express.text()), app.use(express.urlencoded({ extended: true })));

app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    message: "Now I have started new journey with express",
    author: "Haniful Islam",
  });
});

import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_8T7uokCbstVd@ep-empty-queen-aosquhye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log("DB connected successfully");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(40),
        email VARCHAR(25) NOT NULL,
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

initDb();

app.post("/", (req: Request, res: Response) => {
  const { name, age } = req.body;
  res.status(201).json({
    message: "Post request working",
    status: 201,
    data: name,
    age,
  });
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
