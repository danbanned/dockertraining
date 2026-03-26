import { getRoadmapById } from "../../../../backend/src/controllers/roadmapController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET(_request, { params }) {
  try {
    const userId = await requireUserId();
    return json({ roadmap: await getRoadmapById(userId, Number(params.id)) });
  } catch (error) {
    return apiError(error);
  }
}
