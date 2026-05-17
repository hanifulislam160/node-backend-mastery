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

// get users

const getAllUserFromDB = async (req: Request, res: Response) => {
  
  try {
    
    const result = await userService.getAllUserFromDB();

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
};

// get user by id
const getUserByIdFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;

    try {
      
      const result = await userService.getUserByIdFromDB(id as string)
  
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
};

// user update
const updateUserIntoDB = async (req: Request, res: Response) => {

  const { id } = req.params;
  
    try {
      const result = await userService.updateUserIntoDB(id as string, req.body);

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
};

// delete user
const deleteUserFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
   const result = await userService.deleteUserFromDB(id as string)

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
};

export const userController = {
  createUser,
  getAllUserFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};