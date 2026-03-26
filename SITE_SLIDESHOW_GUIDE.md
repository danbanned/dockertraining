# BrightPath Site Slideshow Guide

This guide is a slide-by-slide walkthrough of the BrightPath site. It is designed for a live demo, class presentation, or recorded walkthrough.

 Problem and Solution Mapping

## Identified Problem
People trying to improve their life and career direction often have goals that are too broad, too scattered, or too difficult to turn into daily execution. They may know what they want in terms of their career outcomes, stronger habits, and more structured progress, but they lack:

- a clear long-term roadmap,
- a daily prioritization system,
- and a way to connect AI guidance to real measurable progress.

From a technical perspective, many projects also lack a reliable deployment pipeline, which makes demos and releases inconsistent and risky.

## Slide 1: Title Slide
**Title:** BrightPath AI Platform  
**Subtitle:** Life and Career Acceleration Through Planning, Tracking, and AI

**What to say:**
BrightPath is a full-stack platform that helps users turn long-term goals into roadmaps, daily actions, progress tracking, and AI-supported decisions.

**Show on screen:**
- Landing page
- Site navigation


Hello, my name is Daniel. I’m a Launch Pad Associate and a Junior DevOps Engineer. Today, I’m excited to showcase my application, BrightPath.

So, what is BrightPath? BrightPath is your guide, your mentor, and your accountability partner. It helps you move from point A to point B, keeping you consistent, focused, and on track with your goals and career growth. Think of it as the tool that ensures you stay disciplined, make progress, and never lose sight of what you want to achieve.

## Slide 2: What the Site Does
**Title:** What BrightPath Solves

**What to say:**
Many people know what they want in theory, but they do not have a system for turning those goals into structured execution. BrightPath closes that gap by combining roadmap generation, daily task prioritization, job tracking, progress scoring, and AI support.

**Show on screen:**
- Landing page headline
- Quick overview of navigation

## Slide 3: Site Architecture at a Glance
**Title:** How the Site Is Structured

**What to say:**

our main interface is built with Next.js. The backend logic is organized into controllers and services. PostgreSQL stores user data, goals, tasks, and progress. The AI layer includes provider routing and fallback logic to ensure reliability.


**Show on screen:**
- `app/`
- `backend/src/`
- `prisma/schema.prisma`

## Slide 4: What Each Page Is For
**Title:** A Simple Tour of the Site

**What to say:**
Each page in BrightPath has a clear purpose for helping the user move from goals to action.

- The landing page introduces the platform and explains the overall purpose. The register and login options help users create an account and access their personal workspace.

- The onboarding page collects the goals that will shape the rest of the experience.

- The dashboard gives a quick summary of progress, priorities, and what to focus on next.

- The roadmap page shows the long-term plan and major milestones.

- The tasks page turns the bigger plan into specific daily actions.

- The jobs page helps users search for opportunities and track job applications.

- The skills page focuses on growth and learning over time.

- The fitness page supports habits and physical consistency.

- The progress page helps users see how they are improving across multiple areas.

- The weekly review page gives a summary of the past week and guidance for what to do next.

- The decisions page helps users think through important choices with AI support.

- The settings page is where account and configuration details live.

**Show on screen:**
- Main navigation and a quick scan through each page

## Slide 5: Authentication Flow
**Title:** Login and Registration

**What to say:**
Users register, log in, and receive a session cookie. Protected features such as AI routes and personal data views depend on authentication.

**Show on screen:**
- `/register`
- `/login`

**Key routes:**
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/me`

## Slide 6: Onboarding Experience
**Title:** Goal Capture and User Setup

**What to say:**
The onboarding flow collects the user’s career, income, city, fitness, and communication goals. These inputs drive the roadmap engine and the task prioritization system.

**Show on screen:**
- `/onboarding`

**Key idea:**
The app is not just asking questions. It is building the structured inputs needed for downstream planning logic.

## Slide 7: Dashboard Overview
**Title:** Central Control Panel

**What to say:**
The dashboard gives the user one place to see weighted progress, today’s top priorities, and the category that needs the most attention.

**Show on screen:**
- `/dashboard`

**Highlight:**
- progress score
- lowest-performing category
- task priorities

## Slide 8: Roadmap Page
**Title:** Multi-Year Roadmap

**What to say:**
The roadmap page shows the user’s generated long-term plan. The roadmap engine calculates milestones, and AI turns that structure into readable guidance.

**Show on screen:**
- `/roadmap`

**Key backend pieces:**
- `roadmapEngine`
- roadmap controller
- `/api/roadmap`
- `/api/roadmap/generate`

## Slide 9: Tasks Page
**Title:** Daily Execution

**What to say:**
BrightPath breaks long-term goals down into daily tasks. These tasks are generated based on roadmap context and current weak spots in the progress score.

**Show on screen:**
- `/tasks`

**Demo actions:**
- generate tasks
- mark one complete

## Slide 10: Job Tracker
**Title:** Application Tracking and Search

**What to say:**
The jobs area has two layers. First, it tracks manual applications and application status. Second, it now includes a Remotive-powered remote job search so users can discover roles and add them into their tracker.

**Show on screen:**
- `/jobs`

**Demo actions:**
- search remote roles
- click “Save to Tracker”
- show the log application form

## Slide 11: Skills and Fitness
**Title:** Broader Personal Development

**What to say:**
BrightPath is not only about job applications. It also supports skill development and habit or fitness tracking to reinforce long-term execution quality.

**Show on screen:**
- `/skills`
- `/fitness`

## Slide 12: Progress Dashboard
**Title:** Measuring Success

**What to say:**
The progress page visualizes the weighted score model that powers task prioritization. This gives the user measurable feedback instead of generic motivation.

**Show on screen:**
- `/progress`

**Key concept:**
Success is calculated from skills, applications, communication, health, environment, and consistency.

## Slide 13: Weekly Review
**Title:** AI Review Loop

**What to say:**
The weekly review uses AI to summarize performance, identify wins and blockers, and suggest next steps based on the user’s current context.

**Show on screen:**
- `/weekly-review`

**Demo actions:**
- enter sample wins and blockers
- generate review

## Slide 14: Decision Support
**Title:** AI-Powered Advice

**What to say:**
Users can ask BrightPath for help on a specific decision, such as a job move, timing choice, or tradeoff. The backend structures the prompt, then the AI router handles provider selection.

**Show on screen:**
- `/decisions`

## Slide 15: AI Health and Fallback Logic
**Title:** AI Reliability and Readiness

**What to say:**
The AI layer uses provider fallback logic. If Groq fails, the system attempts Gemini, then Ollama, then a local fallback response. This reduces hard failures and keeps the app usable.

**Show on screen:**
- `/api/ai/health`

**Explain:**
- provider readiness
- auth requirement
- database requirement
- fallback behavior

## Slide 16: Settings and Configuration
**Title:** Runtime Configuration

**What to say:**
The settings area and environment configuration tie together API providers, database connectivity, and runtime behavior.

**Show on screen:**
- `/settings`
- `.env` variables if appropriate for the audience

## Slide 17: Backend Logic Tour
**Title:** What Powers the Site

**What to say:**
The system is driven by backend services, not just UI pages. This includes roadmap generation, task generation, progress scoring, decision support, job search integration, and AI routing.

**Show on screen:**
- `backend/src/services/roadmapEngine.js`
- `backend/src/services/taskEngine.js`
- `backend/src/services/progressEngine.js`
- `backend/src/services/aiRouter.js`
- `backend/src/services/jobSearchService.js`

## Slide 18: API Surface
**Title:** Site Endpoints

**What to say:**
The app exposes routes for auth, user profile, roadmap generation, tasks, jobs, progress, and AI features. This shows a clear full-stack architecture where frontend pages depend on application APIs.

**Show on screen:**
- `app/api/auth/*`
- `app/api/roadmap/*`
- `app/api/tasks/*`
- `app/api/jobs/*`
- `app/api/progress/*`
- `app/api/ai/*`

## Slide 19: Demo Flow Summary
**Title:** End-to-End User Journey

**What to say:**
The full journey is:

1. Register or log in
2. Complete onboarding
3. Generate roadmap
4. Review dashboard
5. Generate tasks
6. Track applications
7. Review progress
8. Use AI for weekly review and decisions

## Slide 20: Technical Strengths
**Title:** Why This Site Matters

**What to say:**
This site demonstrates:
- full-stack app development
- backend-driven planning logic
- AI integration with fallback
- database-backed tracking
- authenticated user flows
- DevOps and deployment readiness

## Slide 21: Closing Slide
**Title:** BrightPath in One Sentence

**What to say:**
BrightPath is a planning and execution platform that helps users move from broad life goals to structured action using backend logic, AI support, tracking, and a deployment-ready engineering stack.

## Optional Presenter Notes
- Keep the walkthrough focused on user value first, then technical implementation.
- If time is limited, prioritize slides 1, 4, 5, 6, 7, 8, 9, 12, 13, 14, and 19.
- If the audience is more technical, spend more time on slides 3, 16, and 17.
