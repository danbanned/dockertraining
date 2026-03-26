import { askAI } from "./aiRouter.js";

export async function provideAdvice(userContext, decisionPrompt) {
  const prompt = [
    "You are BrightPath, a practical life and career strategist.",
    "Use the context to provide a direct recommendation, tradeoffs, and next best action.",
    "",
    `User context: ${JSON.stringify(userContext, null, 2)}`,
    `Decision: ${decisionPrompt}`,
  ].join("\n");

  return askAI(prompt);
}
