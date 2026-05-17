import type { Request, Response } from "express";
import { pool } from "../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
   const { name, email, password, age } = req.body;

   if (!name || !email || !password || age === undefined) {
     return res.status(400).json({
       success: false,
       message: "All fields are required",
     });
   }

   try {
    
    const result = await userService.createUserIntoDB(req.body)
    console.log("Result:", result);

    
     return res.status(201).json({
       success: true,
       message: "User created successfully",
       data: result.rows[0],
     });
   } catch (error: any) {
     console.error("Error creating user:", error.message);
     return res.status(500).json({
       success: false,
       message: "Failed to create user",
       error: error.message,
     });
   }
}

export const userController = {
  createUser,
};