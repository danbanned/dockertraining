import { updateProgress } from "../../../../backend/src/controllers/progressController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(await updateProgress(userId, payload), 201);
  } catch (error) {
    return apiError(error);
  }
}
