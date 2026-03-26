import { getProgress } from "../../../backend/src/controllers/progressController.js";
import { requireUserId } from "../../../lib/apiAuth.js";
import { apiError, json } from "../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json(await getProgress(userId));
  } catch (error) {
    return apiError(error);
  }
}
