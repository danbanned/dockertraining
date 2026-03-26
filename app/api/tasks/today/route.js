import { getTasksForDate } from "../../../../backend/src/controllers/taskController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    const today = new Date().toISOString().split("T")[0];
    return json({ tasks: await getTasksForDate(userId, today) });
  } catch (error) {
    return apiError(error);
  }
}
