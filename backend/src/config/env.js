export const env = {
  appName: process.env.APP_NAME || "BrightPath",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "brightpath-dev-secret",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  ollamaUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "llama3.1",
};
