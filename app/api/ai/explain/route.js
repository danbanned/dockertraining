import { explainConcept } from "../../../../backend/src/controllers/aiController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(await explainConcept(userId, payload.concept || payload.prompt));
  } catch (error) {
    return apiError(error);
  }
}
