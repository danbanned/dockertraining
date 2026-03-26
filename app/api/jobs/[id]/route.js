import { updateJobApplication } from "../../../../backend/src/controllers/jobsController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function PUT(request, { params }) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json({ application: await updateJobApplication(userId, Number(params.id), payload) });
  } catch (error) {
    return apiError(error);
  }
}
