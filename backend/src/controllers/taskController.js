import { query } from "../config/db.js";
import { getCurrentRoadmap } from "./roadmapController.js";
import { calculateSuccessScore } from "../services/progressEngine.js";
import { generateDailyTasks } from "../services/taskEngine.js";

export async function getUserById(userId) {
  const { rows } = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [userId]);
  return rows[0];
}

export async function generateTasksForDate(userId, date) {
  const user = await getUserById(userId);
  const roadmap = await getCurrentRoadmap(userId);
  const progress = await calculateSuccessScore(userId);
  const tasks = generateDailyTasks(user, roadmap, progress);

  await query("DELETE FROM daily_tasks WHERE user_id = $1 AND date = $2", [userId, date]);

  const stored = [];
  for (const task of tasks) {
    const result = await query(
      `INSERT INTO daily_tasks (user_id, date, task, category, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, date, task.task, task.category, task.reason],
    );
    stored.push(result.rows[0]);
  }

  return stored;
}

export async function getTasksForDate(userId, date) {
  const { rows } = await query(
    "SELECT * FROM daily_tasks WHERE user_id = $1 AND date = $2 ORDER BY created_at ASC",
    [userId, date],
  );
  return rows;
}

export async function getTaskHistory(userId) {
  const { rows } = await query(
    "SELECT * FROM daily_tasks WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT 50",
    [userId],
  );
  return rows;
}

export async function completeTask(userId, taskId) {
  const { rows } = await query(
    "UPDATE daily_tasks SET completed = TRUE WHERE user_id = $1 AND id = $2 RETURNING *",
    [userId, taskId],
  );
  return rows[0] || null;
}
