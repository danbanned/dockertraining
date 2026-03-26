import { env } from "../config/env.js";

async function postJson(url, body, headers = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Request failed with ${response.status}: ${details}`);
  }

  return response.json();
}

export async function askGroq(prompt) {
  if (!env.groqApiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const data = await postJson(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: env.groqModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    },
    {
      Authorization: `Bearer ${env.groqApiKey}`,
    },
  );

  return {
    provider: "groq",
    content: data.choices?.[0]?.message?.content || "No response from Groq",
  };
}

export async function askGemini(prompt) {
  if (!env.geminiApiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const data = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
  );

  return {
    provider: "gemini",
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini",
  };
}

export async function askOllama(prompt) {
  const data = await postJson(`${env.ollamaUrl}/api/generate`, {
    model: env.ollamaModel,
    prompt,
    stream: false,
  });

  return {
    provider: "ollama",
    content: data.response || "No response from Ollama",
  };
}
