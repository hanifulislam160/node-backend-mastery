import bcrypt from "bcrypt";
import { pool } from "../../db";

import jwt from "jsonwebtoken";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  // check if the user exists
  // compare the password
  // generate token
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
        `,
    [email],
  );
  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // console.log(user);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }
  // generate jwt token

  const result = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      is_active: user.is_active,
    },
  };
  const accessToken = jwt.sign(result, "secretKey", { expiresIn: "1d" });

  return accessToken;
};

export const authService = {
  loginUserIntoDB,
};
