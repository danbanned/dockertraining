const categoryPriority = [
  "skills",
  "applications",
  "communication",
  "health",
  "environment",
  "consistency",
];

function buildTask(category, roadmapStep, user) {
  const catalog = {
    skills: {
      task: `Complete one focused skill block for ${user.career || "your target role"}`,
      reason: "Skills carry the largest BrightPath score weight.",
    },
    applications: {
      task: "Submit two high-quality job applications or networking outreaches",
      reason: "Applications directly move career opportunities forward.",
    },
    communication: {
      task: "Practice communication for 20 minutes with a mock intro or written pitch",
      reason: "Communication is a current bottleneck.",
    },
    health: {
      task: "Finish a 30-minute workout or mobility session",
      reason: "Health consistency supports long-term execution.",
    },
    environment: {
      task: "Improve your work environment for one uninterrupted deep-work block",
      reason: "Environment quality affects execution reliability.",
    },
    consistency: {
      task: "Close the day with a five-minute review and plan tomorrow",
      reason: "Consistency compounds small wins into durable progress.",
    },
  };

  return {
    category,
    task: catalog[category].task,
    reason: `${catalog[category].reason} ${roadmapStep ? `Linked roadmap focus: ${roadmapStep.title}.` : ""}`.trim(),
  };
}

export function generateDailyTasks(user, roadmap, progressMetrics) {
  const scores = {
    skills: Number(progressMetrics?.skills_score ?? progressMetrics?.skillsScore ?? 50),
    applications: Number(progressMetrics?.applications_score ?? progressMetrics?.applicationsScore ?? 50),
    communication: Number(progressMetrics?.communication_score ?? progressMetrics?.communicationScore ?? 50),
    health: Number(progressMetrics?.health_score ?? progressMetrics?.healthScore ?? 50),
    environment: Number(progressMetrics?.environment_score ?? progressMetrics?.environmentScore ?? 50),
    consistency: Number(progressMetrics?.consistency_score ?? progressMetrics?.consistencyScore ?? 50),
  };

  const sorted = [...categoryPriority].sort((a, b) => scores[a] - scores[b]);
  const roadmapStep = roadmap?.steps?.[0] || roadmap?.roadmap_steps?.[0];

  return sorted.slice(0, 5).map((category) => buildTask(category, roadmapStep, user));
}
