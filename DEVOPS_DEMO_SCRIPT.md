# DevOps Demo Script

## Project Overview
Hello, my name is Person, and this is my BrightPath DevOps Pipeline Technical Demo for AI DevOps Pipeline Engineering.

BrightPath is a full-stack Next.js and PostgreSQL application that helps users generate roadmaps, track daily tasks, log job applications, and interact with AI-guided planning tools. The system is containerized with Docker, uses Prisma for the data layer, and is set up with a CI/CD workflow for automated testing, image build, and deployment.

## System Architecture Introduction
The system has four main parts:

1. Frontend
   - Built with Next.js App Router.
   - User-facing pages live in `app/`.
   - This includes dashboard, roadmap, tasks, jobs, progress, weekly review, and decisions.

2. Backend Logic
   - Core business logic lives in `backend/src/`.
   - Controllers manage auth, roadmap generation, tasks, jobs, progress, and AI requests.
   - Services include `roadmapEngine`, `taskEngine`, `progressEngine`, `decisionEngine`, and `aiRouter`.

3. Database
   - PostgreSQL is the primary database.
   - Prisma schema and migrations live in `prisma/`.
   - Key data models include users, goals, roadmaps, roadmap steps, daily tasks, job applications, progress metrics, and AI logs.

4. DevOps Pipeline
   - Dockerfile handles multi-stage build and production startup.
   - `docker-compose.yml` defines the app and database services.
   - GitHub Actions CI workflow runs tests, builds containers, scans images, and deploys to AWS.

## UI and AI Walkthrough
I will walk through the application in this order:

1. Landing page
   - Explain BrightPath as a life and career acceleration platform.
   - Show navigation to register and login.

2. Register and login
   - Show how a user account is created or how a session token is set.
   - Mention that protected AI routes require authentication.

3. Onboarding
   - Demonstrate the multi-step goals flow.
   - Explain how career, income, city, fitness, and communication goals feed the backend engines.

4. Dashboard
   - Show the weighted success score, weakest category, and today’s tasks.
   - Explain that the dashboard is driven by backend logic first, with AI used for explanation and guidance.

5. Roadmap page
   - Show the generated multi-year roadmap.
   - Explain that `roadmapEngine` calculates milestones and the AI layer turns them into readable guidance.

6. Tasks page
   - Generate daily tasks.
   - Show task completion behavior.
   - Explain how lower-scoring categories are prioritized by `taskEngine`.

7. Jobs page
   - Log a job application.
   - Update status to show CRUD flow and persistence.

8. AI integration
   - Show `AI Health` readiness endpoint.
   - Explain fallback order: Groq first, Gemini second, Ollama third, local fallback last.
   - Show one AI endpoint such as weekly review or decision support.

## AI Integration Talking Points
- The AI router is in `backend/src/services/aiRouter.js`.
- Provider-specific calls are in `backend/src/services/aiProviders.js`.
- The application supports fallback behavior instead of hard failure if one provider is unavailable.
- AI requests are logged in the `ai_logs` table for visibility and cost/governance awareness.
- The backend logic remains the primary decision-maker; AI is used for explanation, recommendation, and planning output.

## Push-to-Deploy Demo Plan
I will explain the deployment flow in this order:

1. Show the GitHub Actions workflow file.
   - Explain that push or pull request triggers the pipeline.
   - Highlight test, build, scan, and deploy stages.

2. Show Docker and Compose setup.
   - Explain how the app and PostgreSQL services are defined.
   - Mention health checks and environment-based configuration.

3. Make a small visible code change.
   - Example: update a heading or text on the landing page.

4. Push the change to the branch.
   - Show that the CI pipeline starts automatically.

5. Walk through pipeline stages.
   - Install dependencies.
   - Generate Prisma client.
   - Run tests.
   - Build Docker image.
   - Push image.
   - Deploy to AWS.

6. Verify deployment result.
   - Refresh the deployed app.
   - Confirm the visible change is live.

## Closing Statement
This project demonstrates application development, containerization, database-backed backend logic, AI service integration, and an automated DevOps pipeline from code change to deployment.
