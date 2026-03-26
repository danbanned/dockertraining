import { cookies } from "next/headers";
import { registerUser } from "../../../../backend/src/controllers/authController.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await registerUser(payload);
    const cookieStore = await cookies();
    cookieStore.set("brightpath_token", result.token, { httpOnly: true, sameSite: "lax", path: "/" });
    return json(result, 201);
  } catch (error) {
    return apiError(error);
  }
}
