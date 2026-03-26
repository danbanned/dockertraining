import { query } from "../config/db.js";
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js";

export async function registerUser(payload) {
  const passwordHash = await hashPassword(payload.password);
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, career, income_goal, city_goal, fitness_goal, communication_goal)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, career, income_goal, city_goal, fitness_goal, communication_goal, created_at`,
    [
      payload.email,
      passwordHash,
      payload.career || null,
      payload.incomeGoal || null,
      payload.cityGoal || null,
      payload.fitnessGoal || null,
      payload.communicationGoal || null,
    ],
  );

  const user = rows[0];
  return {
    user,
    token: signToken({ userId: user.id, email: user.email }),
  };
}

export async function loginUser(payload) {
  const { rows } = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [payload.email]);
  const user = rows[0];

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const valid = await verifyPassword(payload.password, user.password_hash);
  if (!valid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      career: user.career,
      incomeGoal: user.income_goal,
      cityGoal: user.city_goal,
      fitnessGoal: user.fitness_goal,
      communicationGoal: user.communication_goal,
    },
    token: signToken({ userId: user.id, email: user.email }),
  };
}

export async function getCurrentUser(userId) {
  const { rows } = await query(
    "SELECT id, email, career, income_goal, city_goal, fitness_goal, communication_goal, created_at FROM users WHERE id = $1 LIMIT 1",
    [userId],
  );
  return rows[0] || null;
}
