import { query } from "../config/db.js";
import { generateLongTermPlan } from "../services/roadmapEngine.js";
import { askAI } from "../services/aiRouter.js";

function normalizeRoadmapDescription(description) {
  if (!description || typeof description !== "string") {
    return description;
  }

  const trimmed = description.trim();

  if (!trimmed.startsWith("{")) {
    return description;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return parsed?.content || description;
  } catch {
    return description;
  }
}

export async function generateRoadmap(userId, userGoals) {
  const plan = generateLongTermPlan(userGoals);
  const enriched = await askAI(
    `Create an encouraging but direct description for this roadmap and each milestone: ${JSON.stringify(plan)}`,
  );

  const { rows } = await query(
    `INSERT INTO roadmaps (user_id, title, start_date, end_date, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, plan.title, plan.startDate, plan.endDate, enriched.content],
  );

  const roadmap = rows[0];
  const steps = [];

  for (const step of plan.steps) {
    const stepResult = await query(
      `INSERT INTO roadmap_steps (roadmap_id, month, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [roadmap.id, step.month, step.title, step.description],
    );
    steps.push(stepResult.rows[0]);
  }

  return {
    ...roadmap,
    description: normalizeRoadmapDescription(roadmap.description),
    steps,
  };
}

export async function getCurrentRoadmap(userId) {
  const { rows } = await query(
    "SELECT * FROM roadmaps WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId],
  );
  const roadmap = rows[0];

  if (!roadmap) {
    return null;
  }

  const steps = await query("SELECT * FROM roadmap_steps WHERE roadmap_id = $1 ORDER BY month ASC", [roadmap.id]);
  return {
    ...roadmap,
    description: normalizeRoadmapDescription(roadmap.description),
    steps: steps.rows,
  };
}

export async function getRoadmapById(userId, roadmapId) {
  const { rows } = await query("SELECT * FROM roadmaps WHERE user_id = $1 AND id = $2 LIMIT 1", [userId, roadmapId]);
  const roadmap = rows[0];
  if (!roadmap) {
    return null;
  }
  const steps = await query("SELECT * FROM roadmap_steps WHERE roadmap_id = $1 ORDER BY month ASC", [roadmap.id]);
  return {
    ...roadmap,
    description: normalizeRoadmapDescription(roadmap.description),
    steps: steps.rows,
  };
}
