import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "../../../../backend/src/config/env.js";

function maskConfigured(value) {
  return value ? "configured" : "missing";
}

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get("brightpath_token")?.value);

  const groqReady = Boolean(env.groqApiKey);
  const geminiReady = Boolean(env.geminiApiKey);
  const ollamaConfigured = Boolean(env.ollamaUrl && env.ollamaModel);

  let expectedProvider = "local-fallback";
  if (groqReady) {
    expectedProvider = "groq";
  } else if (geminiReady) {
    expectedProvider = "gemini";
  } else if (ollamaConfigured) {
    expectedProvider = "ollama";
  }

  return NextResponse.json({
    status: "ok",
    ai: {
      expectedProvider,
      fallbackPossible: true,
      providers: {
        groq: {
          apiKey: maskConfigured(env.groqApiKey),
          model: env.groqModel,
          ready: groqReady,
        },
        gemini: {
          apiKey: maskConfigured(env.geminiApiKey),
          model: env.geminiModel,
          ready: geminiReady,
        },
        ollama: {
          url: env.ollamaUrl,
          model: env.ollamaModel,
          configured: ollamaConfigured,
          note: "This endpoint does not verify that the Ollama server is actually running.",
        },
      },
    },
    appRequirements: {
      databaseUrl: maskConfigured(env.databaseUrl),
      jwtSecret: env.jwtSecret === "brightpath-dev-secret" ? "using-default-dev-secret" : "configured",
      authenticatedSession: hasSession ? "present" : "missing",
    },
    nextAction:
      expectedProvider === "local-fallback"
        ? "Add at least one AI provider configuration before expecting live model responses."
        : "Provider configuration exists. If requests still fail, check auth, database, and network reachability.",
  });
}
