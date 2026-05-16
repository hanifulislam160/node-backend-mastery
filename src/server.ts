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

initDb();

app.post("/user", async (req: Request, res: Response) => {
  const { name, email, password,  age,  } = req.body;

   if (!name || !email || !password || age === undefined) {
     return res.status(400).json({
       success: false,
       message: "All fields are required",
     });
   }

  try {
     const result = await pool.query(
       `
      INSERT INTO users (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
       [name, email, password, age],
     );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error:any) {
    
    console.error("Error creating user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});


app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      ORDER BY id ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);

     return res.status(500).json({
       success: false,
       statusCode: 500,
       message: "Failed to fetch users",
       error: error.message,
     });
  }
});


// Get User By ID
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});


// Update User By ID
app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET name = $1,
          email = $2,
          password = $3,
          age = $4
      WHERE id = $5
      RETURNING *
      `,
      [name, email, password, age, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to update user",
      error: error.message,
    });
  }
});


// Delete User By ID
app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
