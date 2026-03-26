import { searchRemoteJobs } from "../../../../backend/src/services/jobSearchService.js";
import { requireUserId } from "../../../../lib/apiAuth.js";
import { apiError, json } from "../../../../lib/apiResponse.js";

export async function GET(request) {
  try {
    await requireUserId();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    return json(await searchRemoteJobs(query));
  } catch (error) {
    return apiError(error);
  }
}
