import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";
import { generateRoadmap } from "../../../../backend/src/controllers/roadmapController.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(await generateRoadmap(userId, payload), 201);
  } catch (error) {
    return apiError(error);
  }
}
