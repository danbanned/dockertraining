function asDate(date) {
  return date.toISOString().split("T")[0];
}

export function generateLongTermPlan(userGoals = {}) {
  const start = new Date();
  const horizons = [0, 6, 12, 18, 24, 30, 36];
  const focusAreas = [
    { key: "career", label: userGoals.career || "Career direction" },
    { key: "income", label: userGoals.incomeGoal || "Income target" },
    { key: "city", label: userGoals.cityGoal || "Location plan" },
    { key: "fitness", label: userGoals.fitnessGoal || "Fitness routine" },
    { key: "communication", label: userGoals.communicationGoal || "Communication growth" },
  ];

  const steps = horizons.slice(1).map((month, index) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + month);
    const focus = focusAreas[index % focusAreas.length];

    return {
      month,
      title: `Month ${month}: ${focus.label}`,
      description: `Build measurable momentum on ${focus.key} by completing a milestone that supports the 3-year BrightPath outcome.`,
      targetDate: asDate(date),
    };
  });

  const end = new Date(start);
  end.setMonth(end.getMonth() + 36);

  return {
    title: "BrightPath 3-Year Acceleration Plan",
    startDate: asDate(start),
    endDate: asDate(end),
    description: "A multi-year plan balancing career, income, health, environment, and communication growth.",
    steps,
  };
}
