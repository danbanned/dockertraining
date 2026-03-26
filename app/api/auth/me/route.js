import { getCurrentUser } from "../../../../backend/src/controllers/authController.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET() {
  try {
    const userId = await requireUserId();
    return json({ user: await getCurrentUser(userId) });
  } catch (error) {
    return apiError(error);
  }
}
