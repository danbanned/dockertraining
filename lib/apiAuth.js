import { cookies } from "next/headers";
import { verifyToken } from "../backend/src/utils/auth.js";

export async function requireUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("brightpath_token")?.value;

  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  const payload = verifyToken(token);
  return payload.userId;
}
