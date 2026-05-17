import { pool } from "../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;

  const result = await pool.query(
    `
          INSERT INTO users (name, email, password, age)
          VALUES ($1, $2, $3, $4)
          RETURNING *
          `,
    [name, email, password, age],
  );
  return result;
};

// get all user from db
const getAllUserFromDB = async () => {
  const result = await pool.query(`
        SELECT * FROM users
        ORDER BY id ASC
      `);
  return result;
};

// get user by id
const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// update user
const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
  const { name, email, password, age } = payload;
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

  return result;
};

// delete user
const deleteUserFromDB = async (id: string) => {
   const result = await pool.query(
     `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
     [id],
   );
   
   return result;
};

export const userService = {
  createUserIntoDB,
  getAllUserFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
