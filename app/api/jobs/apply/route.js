import { createJobApplication } from "../../../../backend/src/controllers/jobsController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json({ application: await createJobApplication(userId, payload) }, 201);
  } catch (error) {
    return apiError(error);
  }
}
