import { Router, type Request, type Response } from "express";
import { pool } from "../db";
import { userController } from "./user.controller";

const router = Router();

// Create User
router.post("/", userController.createUser );

// Get All Users
router.get("/", userController.getAllUserFromDB);

// Get User By ID
router.get("/:id", userController.getUserByIdFromDB);

// Update User By ID
router.put("/:id", userController.updateUserIntoDB);

// Delete User By ID
router.delete("/:id", userController.deleteUserFromDB);

export const userRoute = router;