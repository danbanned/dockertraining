import { completeTask } from "../../../../backend/src/controllers/taskController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json({ task: await completeTask(userId, payload.taskId) });
  } catch (error) {
    return apiError(error);
  }
}
