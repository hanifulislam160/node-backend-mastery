import { Router, type Request, type Response } from "express";
import { pool } from "../db";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createUser );

router.get("/users", async (req: Request, res: Response) => {
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
router.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

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
router.put("/users/:id", async (req: Request, res: Response) => {
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
      [name, email, password, age, id],
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
router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
      [id],
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

export const userRoute = router;