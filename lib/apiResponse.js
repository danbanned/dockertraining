import { NextResponse } from "next/server";
import { normalizeError } from "../backend/src/utils/http.js";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(error) {
  const normalized = normalizeError(error);
  return json(
    {
      error: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
    normalized.status,
  );
}
