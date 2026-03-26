import { askGemini, askGroq, askOllama } from "./aiProviders.js";

/**
 * Enhanced offline fallback with structured error context and helpful responses
 */
function offlineFallback(prompt, errors = {}) {
  const timestamp = new Date().toISOString();
  
  // Determine what kind of fallback response to provide based on the error types
  const isNetworkError = errors.groq?.includes("network") || errors.gemini?.includes("network") || errors.ollama?.includes("network");
  const isAuthError = errors.groq?.includes("401") || errors.groq?.includes("403") || errors.gemini?.includes("401") || errors.gemini?.includes("403");
  const isRateLimit = errors.groq?.includes("429") || errors.gemini?.includes("429");
  
  let fallbackMessage = "";
  let userGuidance = "";
  
  if (isNetworkError) {
    fallbackMessage = "Network connectivity issue detected. Using offline planning mode.";
    userGuidance = "Check your internet connection. Your data is safe and will sync when reconnected.";
  } else if (isAuthError) {
    fallbackMessage = "AI service authentication failed. Using emergency planning mode.";
    userGuidance = "Please contact support or check your API keys in the settings.";
  } else if (isRateLimit) {
    fallbackMessage = "AI service rate limit reached. Using cached planning mode.";
    userGuidance = "Try again in a few minutes. Your tasks are still being tracked locally.";
  } else {
    fallbackMessage = "All AI services unavailable. Using local planning engine.";
    userGuidance = "Your progress is saved locally and will sync when services are restored.";
  }
  
  const structuredResponse = {
    provider: "local-fallback",
    content: [
      "=".repeat(50),
      `🔄 BRIGHTPATH OFFLINE MODE`,
      "=".repeat(50),
      "",
      `⚠️  ${fallbackMessage}`,
      `💡 ${userGuidance}`,
      "",
      "📋 LOCAL PLANNING FRAMEWORK:",
      "─────────────────────────",
      "1. Define your primary goal for the next 90 days",
      "2. Break it into 3 monthly milestones",
      "3. Identify 3 weekly actions for the current month",
      "4. Choose 1 non-negotiable task to complete today",
      "",
      "🎯 SUCCESS PRINCIPLES:",
      "─────────────────────────",
      "• Direction > Motivation (systems beat willpower)",
      "• Consistency > Intensity (small daily actions compound)",
      "• Environment > Willpower (design your surroundings)",
      "• Lowest score first (focus on your weakest category)",
      "",
      "📊 PROGRESS TRACKING:",
      "─────────────────────────",
      "• Skills (30%) | Applications (25%) | Communication (15%)",
      "• Health (10%) | Environment (10%) | Consistency (10%)",
      "",
      `🔍 ORIGINAL QUERY CONTEXT:`,
      `─────────────────────────`,
      `${prompt.slice(0, 500)}${prompt.length > 500 ? "..." : ""}`,
      "",
      `🕐 TIMESTAMP: ${timestamp}`,
      "=".repeat(50),
    ].join("\n"),
    fallback: true,
    mode: "offline",
    timestamp,
    guidance: {
      message: fallbackMessage,
      action: userGuidance,
      errorType: isNetworkError ? "network" : isAuthError ? "auth" : isRateLimit ? "rate_limit" : "unknown"
    }
  };
  
  if (Object.keys(errors).length > 0) {
    structuredResponse.errors = errors;
  }
  
  return structuredResponse;
}

/**
 * Enhanced error wrapper with detailed logging and context
 */
function createDetailedError(provider, originalError, context = {}) {
  const errorDetails = {
    provider,
    timestamp: new Date().toISOString(),
    message: originalError.message,
    status: originalError.status || originalError.statusCode || null,
    code: originalError.code || null,
    type: originalError.type || originalError.name || "UnknownError",
    context: {
      promptLength: context.prompt?.length || 0,
      ...context
    }
  };
  
  // Add specific error details based on provider
  if (provider === "groq") {
    if (originalError.message?.includes("429")) {
      errorDetails.reason = "Rate limit exceeded";
      errorDetails.suggestion = "Reduce request frequency or upgrade your Groq plan";
    } else if (originalError.message?.includes("401") || originalError.message?.includes("403")) {
      errorDetails.reason = "Authentication failed";
      errorDetails.suggestion = "Check your GROQ_API_KEY in environment variables";
    } else if (originalError.message?.includes("network") || originalError.code === "ECONNREFUSED") {
      errorDetails.reason = "Network connection failed";
      errorDetails.suggestion = "Verify internet connection and Groq API endpoint";
    }
  } else if (provider === "gemini") {
    if (originalError.message?.includes("429")) {
      errorDetails.reason = "Rate limit exceeded";
      errorDetails.suggestion = "Reduce request frequency or wait before retrying";
    } else if (originalError.message?.includes("401") || originalError.message?.includes("403")) {
      errorDetails.reason = "Authentication failed";
      errorDetails.suggestion = "Check your GEMINI_API_KEY in environment variables";
    } else if (originalError.message?.includes("quota")) {
      errorDetails.reason = "Quota exceeded";
      errorDetails.suggestion = "Upgrade your Gemini plan or wait for quota reset";
    }
  } else if (provider === "ollama") {
    if (originalError.message?.includes("ECONNREFUSED")) {
      errorDetails.reason = "Ollama service not running";
      errorDetails.suggestion = "Run 'ollama serve' in terminal or check OLLAMA_URL";
    } else if (originalError.message?.includes("model not found")) {
      errorDetails.reason = "Model not available";
      errorDetails.suggestion = `Run 'ollama pull ${process.env.OLLAMA_MODEL || "llama3.1"}' to download the model`;
    } else if (originalError.message?.includes("timeout")) {
      errorDetails.reason = "Request timeout";
      errorDetails.suggestion = "Check if Ollama is responding or increase timeout settings";
    }
  }
  
  return errorDetails;
}

/**
 * Main AI router with comprehensive error handling and retry logic
 */
export async function askAI(prompt, options = {}) {
  const {
    maxRetries = 1,
    timeout = 30000,
    retryDelay = 1000
  } = options;
  
  const errors = {};
  const startTime = Date.now();
  
  // Helper for retry logic
  async function withRetry(fn, provider, retries = maxRetries) {
    let lastError;
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const detailedError = createDetailedError(provider, error, { prompt, attempt: i + 1 });
        console.warn(`${provider} attempt ${i + 1} failed:`, detailedError);
        
        if (i < retries) {
          const waitTime = retryDelay * Math.pow(2, i); // Exponential backoff
          console.log(`Retrying ${provider} in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    throw lastError;
  }
  
  try {
    // Attempt Groq (primary - fastest)
    console.log("🟢 Attempting Groq (primary AI)...");
    const groqResult = await withRetry(
      () => askGroq(prompt),
      "groq",
      maxRetries
    );
    const duration = Date.now() - startTime;
    console.log(`✅ Groq succeeded in ${duration}ms`);
    
    return {
      provider: "groq",
      content: groqResult.content || groqResult,
      fallback: false,
      duration,
      timestamp: new Date().toISOString()
    };
    
  } catch (groqError) {
    errors.groq = createDetailedError("groq", groqError, { prompt });
    console.warn("❌ Groq failed permanently:", errors.groq);
    
    try {
      // Attempt Gemini (backup)
      console.log("🟡 Falling back to Gemini...");
      const geminiResult = await withRetry(
        () => askGemini(prompt),
        "gemini",
        maxRetries
      );
      const duration = Date.now() - startTime;
      console.log(`✅ Gemini succeeded in ${duration}ms`);
      
      return {
        provider: "gemini",
        content: geminiResult.content || geminiResult,
        fallback: true,
        fallbackFrom: "groq",
        groqError: errors.groq,
        duration,
        timestamp: new Date().toISOString()
      };
      
    } catch (geminiError) {
      errors.gemini = createDetailedError("gemini", geminiError, { prompt });
      console.warn("❌ Gemini failed permanently:", errors.gemini);
      
      try {
        // Attempt Ollama (local/offline)
        console.log("🟠 Falling back to Ollama (local)...");
        const ollamaResult = await withRetry(
          () => askOllama(prompt),
          "ollama",
          maxRetries
        );
        const duration = Date.now() - startTime;
        console.log(`✅ Ollama succeeded in ${duration}ms`);
        
        return {
          provider: "ollama",
          content: ollamaResult.content || ollamaResult,
          fallback: true,
          fallbackFrom: ["groq", "gemini"],
          errors: {
            groq: errors.groq,
            gemini: errors.gemini
          },
          duration,
          timestamp: new Date().toISOString()
        };
        
      } catch (ollamaError) {
        errors.ollama = createDetailedError("ollama", ollamaError, { prompt });
        console.error("❌ All AI providers failed:", errors);
        
        // Final fallback - use offline planning
        console.log("🔧 Using offline fallback planner...");
        const fallback = offlineFallback(prompt, errors);
        fallback.duration = Date.now() - startTime;
        fallback.timestamp = new Date().toISOString();
        
        return fallback;
      }
    }
  }
}

/**
 * Utility function to check AI service health
 */
export async function checkAIHealth() {
  const health = {
    groq: { available: false, latency: null, error: null },
    gemini: { available: false, latency: null, error: null },
    ollama: { available: false, latency: null, error: null },
    timestamp: new Date().toISOString()
  };
  
  const testPrompt = "Health check: respond with 'OK'";
  
  // Test Groq
  try {
    const start = Date.now();
    await askGroq(testPrompt);
    health.groq.available = true;
    health.groq.latency = Date.now() - start;
  } catch (error) {
    health.groq.error = error.message;
  }
  
  // Test Gemini
  try {
    const start = Date.now();
    await askGemini(testPrompt);
    health.gemini.available = true;
    health.gemini.latency = Date.now() - start;
  } catch (error) {
    health.gemini.error = error.message;
  }
  
  // Test Ollama
  try {
    const start = Date.now();
    await askOllama(testPrompt);
    health.ollama.available = true;
    health.ollama.latency = Date.now() - start;
  } catch (error) {
    health.ollama.error = error.message;
  }
  
  return health;
}