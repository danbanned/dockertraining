import { askAI } from "../services/aiRouter.js";
import { provideAdvice } from "../services/decisionEngine.js";
import { query } from "../config/db.js";
import { generateLongTermPlan } from "../services/roadmapEngine.js";
import { generateDailyTasks } from "../services/taskEngine.js";
import { calculateSuccessScore } from "../services/progressEngine.js";
import { getCurrentRoadmap } from "./roadmapController.js";
import { getUserById } from "./taskController.js";

async function logAI(userId, modelUsed, prompt, response, startedAt) {
  const durationMs = Date.now() - startedAt;
  await query(
    "INSERT INTO ai_logs (user_id, model_used, prompt, response, duration_ms) VALUES ($1, $2, $3, $4, $5)",
    [userId, modelUsed, prompt, response, durationMs],
  );
}

function ensureAIRequestReady(userId, payload) {
  if (!userId) {
    const error = new Error("");
    error.status = 401;
    throw error;
  }

  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is required for AI requests");
    error.status = 500;
    throw error;
  }

  if (!payload || (typeof payload === "object" && Object.keys(payload).length === 0)) {
    const error = new Error("Request payload is required");
    error.status = 400;
    throw error;
  }
}

export async function planWithAI(userId, payload) {
  ensureAIRequestReady(userId, payload);
  const startedAt = Date.now();
  const plan = generateLongTermPlan(payload);
  const prompt = `Turn this BrightPath roadmap skeleton into a motivating multi-year roadmap summary: ${JSON.stringify(plan)}`;
  const result = await askAI(prompt);
  await logAI(userId, result.provider, prompt, result.content, startedAt);
  return { plan, response: result.content, provider: result.provider, fallback: Boolean(result.fallback) };
}

export async function dailyTasksWithAI(userId, payload) {
  ensureAIRequestReady(userId, payload);
  const startedAt = Date.now();
  const user = await getUserById(userId);
  const roadmap = await getCurrentRoadmap(userId);
  const progress = await calculateSuccessScore(userId);
  const tasks = generateDailyTasks(user || {}, roadmap, progress);
  const prompt = `Explain these BrightPath daily tasks in plain language: ${JSON.stringify(tasks)}`;
  const result = await askAI(prompt);
  await logAI(userId, result.provider, prompt, result.content, startedAt);
  return { tasks, response: result.content, provider: result.provider, fallback: Boolean(result.fallback) };
}

export async function explainConcept(userId, concept) {
  ensureAIRequestReady(userId, { concept });
  const startedAt = Date.now();
  const prompt = `Explain this concept for a user improving their life and career through BrightPath: ${concept}`;
  const result = await askAI(prompt);
  await logAI(userId, result.provider, prompt, result.content, startedAt);
  return { explanation: result.content, provider: result.provider, fallback: Boolean(result.fallback) };
}

export async function weeklyReview(userId, payload) {
  ensureAIRequestReady(userId, payload);
  const startedAt = Date.now();
  const prompt = `Create a weekly review with wins, concerns, and next steps. Context: ${JSON.stringify(payload)}`;
  const result = await askAI(prompt);
  await logAI(userId, result.provider, prompt, result.content, startedAt);
  return { review: result.content, provider: result.provider, fallback: Boolean(result.fallback) };
}

export async function decisionAdvice(userId, payload) {
  ensureAIRequestReady(userId, payload);
  const startedAt = Date.now();
  if (!payload.decisionPrompt) {
    const error = new Error("decisionPrompt is required");
    error.status = 400;
    throw error;
  }
  const result = await provideAdvice(payload.userContext || {}, payload.decisionPrompt);
  await logAI(userId, result.provider, payload.decisionPrompt, result.content, startedAt);
  return { advice: result.content, provider: result.provider, fallback: Boolean(result.fallback) };
}

