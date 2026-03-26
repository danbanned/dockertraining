import { getCurrentRoadmap } from "../../../backend/src/controllers/roadmapController.js";
import { requireUserId } from "../../../lib/apiAuth.js";
import { apiError, json } from "../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json({ roadmap: await getCurrentRoadmap(userId) });
  } catch (error) {
    return apiError(error);
  }
}
