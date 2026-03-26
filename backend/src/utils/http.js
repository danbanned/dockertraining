export function parseJsonBody(request) {
  return request.json();
}

export function normalizeError(error) {
  return {
    message: error?.message || "Unexpected error",
    status: error?.status || 500,
    details: error?.details,
  };
}

export function buildWhereGoalRows(goalPayload = {}) {
  return Object.entries(goalPayload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([type, value]) => ({
      type,
      target: typeof value === "string" ? value : JSON.stringify(value),
    }));
}
