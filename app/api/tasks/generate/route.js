import { generateTasksForDate } from "../../../../backend/src/controllers/taskController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(
      { tasks: await generateTasksForDate(userId, payload.date || new Date().toISOString().split("T")[0]) },
      201,
    );
  } catch (error) {
    return apiError(error);
  }
}
