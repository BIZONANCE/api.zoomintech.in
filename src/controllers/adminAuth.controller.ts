import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const result = await pool.query(
    "SELECT * FROM admin_users WHERE username = $1",
    [username]
  );

  const admin = result.rows[0];
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return res.json({ token });
};
