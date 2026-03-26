import { listJobApplications } from "../../../backend/src/controllers/jobsController.js";
import { requireUserId } from "../../../lib/apiAuth.js";
import { apiError, json } from "../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json({ applications: await listJobApplications(userId) });
  } catch (error) {
    return apiError(error);
  }
}
