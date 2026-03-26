import { query } from "../config/db.js";
import { buildWhereGoalRows } from "../utils/http.js";

export async function getUserProfileWithGoals(userId) {
  const userResult = await query(
    "SELECT id, email, career, income_goal, city_goal, fitness_goal, communication_goal, created_at FROM users WHERE id = $1 LIMIT 1",
    [userId],
  );
  const goalsResult = await query("SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

  return {
    profile: userResult.rows[0] || null,
    goals: goalsResult.rows,
  };
}

export async function upsertUserGoals(userId, payload) {
  await query(
    `UPDATE users
     SET career = COALESCE($2, career),
         income_goal = COALESCE($3, income_goal),
         city_goal = COALESCE($4, city_goal),
         fitness_goal = COALESCE($5, fitness_goal),
         communication_goal = COALESCE($6, communication_goal)
     WHERE id = $1`,
    [
      userId,
      payload.career || null,
      payload.incomeGoal || null,
      payload.cityGoal || null,
      payload.fitnessGoal || null,
      payload.communicationGoal || null,
    ],
  );

  if (payload.goalMap) {
    await query("DELETE FROM goals WHERE user_id = $1", [userId]);
    const rows = buildWhereGoalRows(payload.goalMap);
    for (const row of rows) {
      await query("INSERT INTO goals (user_id, type, target) VALUES ($1, $2, $3)", [userId, row.type, row.target]);
    }
  }

  return getUserProfileWithGoals(userId);
}
