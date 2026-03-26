import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    return { userId: decoded.userId };
  } catch (error) {
    const authError = new Error("Authentication required");
    authError.status = 401;
    throw authError;
  }
}
