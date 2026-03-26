import { getTaskHistory } from "../../../../backend/src/controllers/taskController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json({ tasks: await getTaskHistory(userId) });
  } catch (error) {
    return apiError(error);
  }
}
