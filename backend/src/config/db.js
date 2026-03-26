import { Pool } from "pg";
import { env } from "./env.js";

let pool;

export function getPool() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

export async function query(text, params = []) {
  const client = getPool();
  return client.query(text, params);
}
