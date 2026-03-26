import { getUserProfileWithGoals } from "../../../../backend/src/controllers/userController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json(await getUserProfileWithGoals(userId));
  } catch (error) {
    return apiError(error);
  }
}
