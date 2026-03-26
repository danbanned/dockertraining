import { cookies } from "next/headers";
import { loginUser } from "../../../../backend/src/controllers/authController.js";
import { signToken } from "../../../../backend/src/utils/auth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const payload = await request.json();
    const cookieStore = await cookies();

    if (payload?.userId) {
      const token = signToken({ userId: payload.userId });
      cookieStore.set("brightpath_token", token, { httpOnly: true, sameSite: "lax", path: "/" });
      return json({ success: true, userId: payload.userId });
    }

    const result = await loginUser(payload);
    cookieStore.set("brightpath_token", result.token, { httpOnly: true, sameSite: "lax", path: "/" });
    return json(result);
  } catch (error) {
    return apiError(error);
  }
}
