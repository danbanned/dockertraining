import { query } from "../config/db.js";

const weights = {
  skills: 0.3,
  applications: 0.25,
  communication: 0.15,
  health: 0.1,
  environment: 0.1,
  consistency: 0.1,
};

export function computeScore(metrics = {}) {
  const normalized = {
    skills: Number(metrics.skills_score ?? metrics.skillsScore ?? 0),
    applications: Number(metrics.applications_score ?? metrics.applicationsScore ?? 0),
    communication: Number(metrics.communication_score ?? metrics.communicationScore ?? 0),
    health: Number(metrics.health_score ?? metrics.healthScore ?? 0),
    environment: Number(metrics.environment_score ?? metrics.environmentScore ?? 0),
    consistency: Number(metrics.consistency_score ?? metrics.consistencyScore ?? 0),
  };

  const totalScore =
    normalized.skills * weights.skills +
    normalized.applications * weights.applications +
    normalized.communication * weights.communication +
    normalized.health * weights.health +
    normalized.environment * weights.environment +
    normalized.consistency * weights.consistency;

  const lowestCategory = Object.entries(normalized).sort((a, b) => a[1] - b[1])[0]?.[0] || "skills";

  return {
    ...normalized,
    totalScore: Number(totalScore.toFixed(2)),
    lowestCategory,
  };
}

export async function calculateSuccessScore(userId) {
  const { rows } = await query(
    "SELECT * FROM progress_metrics WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT 1",
    [userId],
  );

  if (!rows[0]) {
    return computeScore({
      skillsScore: 35,
      applicationsScore: 25,
      communicationScore: 40,
      healthScore: 55,
      environmentScore: 50,
      consistencyScore: 45,
    });
  }

  return computeScore(rows[0]);
}
