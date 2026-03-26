import { query } from "../config/db.js";
import { calculateSuccessScore, computeScore } from "../services/progressEngine.js";

export async function getProgress(userId) {
  const score = await calculateSuccessScore(userId);
  const { rows } = await query(
    "SELECT * FROM progress_metrics WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT 1",
    [userId],
  );

  return {
    latest: rows[0] || null,
    score,
  };
}

export async function updateProgress(userId, payload = {}) {
  const computed = computeScore(payload);
  const { rows } = await query(
    `INSERT INTO progress_metrics (
      user_id, skills_score, applications_score, communication_score, health_score,
      environment_score, consistency_score, total_score, date
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9, CURRENT_DATE))
     RETURNING *`,
    [
      userId,
      payload.skillsScore ?? payload.skills_score ?? 0,
      payload.applicationsScore ?? payload.applications_score ?? 0,
      payload.communicationScore ?? payload.communication_score ?? 0,
      payload.healthScore ?? payload.health_score ?? 0,
      payload.environmentScore ?? payload.environment_score ?? 0,
      payload.consistencyScore ?? payload.consistency_score ?? 0,
      computed.totalScore,
      payload.date || null,
    ],
  );

  return {
    latest: rows[0],
    score: computed,
  };
}
