import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";
import { upsertUserGoals } from "../../../../backend/src/controllers/userController.js";

export async function POST(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(await upsertUserGoals(userId, payload), 201);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    return json(await upsertUserGoals(userId, payload));
  } catch (error) {
    return apiError(error);
  }
}
