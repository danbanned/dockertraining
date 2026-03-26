# Technical Skill Alignment

This document maps the BrightPath project to the technical competencies required for the DevOps Pipeline Technical Demo.

## TS.1 System Explanation
### Competency Area
Clear communication of code and system architecture.

### Application in This Project
- The application is split into frontend pages in `app/`, backend logic in `backend/src/`, database schema in `prisma/`, and deployment configuration in Docker and GitHub Actions files.
- The architecture can be explained as UI layer, business-logic layer, database layer, and deployment pipeline.
- The AI system can be explained clearly because the router, provider clients, and API endpoints are separated by responsibility.

### Evidence
- `app/`
- `backend/src/`
- `prisma/schema.prisma`
- `README.md`

## TS.3 Pipeline and Cloud
### Competency Area
Usage of Docker and CI/CD pipelines.

### Application in This Project
- Dockerfile provides a multi-stage build for the application.
- Docker Compose provides local orchestration of app and database services.
- GitHub Actions workflow defines automated test, build, security scan, and deploy behavior.
- The README documents the intended CI/CD and AWS deployment flow.

### Evidence
- `Dockerfile`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `README.md`

### Current Note
Terraform is not present in this repository, so TS.3 alignment is strongest around Docker, Compose, GitHub Actions, and AWS deployment workflow rather than infrastructure-as-code.

## TS.4 App Development
### Competency Area
Building the functional Next.js and Prisma application.

### Application in This Project
- The frontend includes pages for onboarding, dashboard, roadmap, tasks, jobs, progress, weekly review, decisions, and settings.
- The backend includes controllers and services for authentication, user goals, roadmap generation, tasks, jobs, progress, and AI functionality.
- Prisma models support the BrightPath domain entities and persistence requirements.

### Evidence
- `app/dashboard/page.js`
- `app/roadmap/page.js`
- `app/tasks/page.js`
- `app/jobs/page.js`
- `backend/src/controllers/`
- `backend/src/services/`
- `prisma/schema.prisma`

## TS.5 Debugging
### Competency Area
Identifying and resolving live deployment or database issues.

### Application in This Project
- The project includes log validation scripts and health endpoints for troubleshooting startup and runtime problems.
- Prisma schema issues, route import issues, and auth path issues were diagnosed and corrected during development.
- Docker and CI flow are documented in a way that supports issue isolation across build, database, and deploy stages.

### Evidence
- `scripts/validate-logs.sh`
- `app/api/health/route.js`
- `app/api/ai/health/route.js`
- `README.md`

## TS.6 AI Safety
### Competency Area
Implementation of AI usage with privacy-aware boundaries.

### Application in This Project
- AI requests are routed through a backend service rather than exposing provider calls directly in the client.
- Authentication is required before using protected AI endpoints.
- AI activity is logged in a controlled server-side flow.
- Environment variables are used for provider keys instead of hardcoding secrets in application code.

### Evidence
- `backend/src/services/aiRouter.js`
- `backend/src/services/aiProviders.js`
- `app/api/ai/`
- `.env`

### Current Note
This repository currently uses Groq, Gemini, and Ollama rather than OpenAI. The privacy and safety framing should be presented as general AI handling practices unless the assignment specifically requires an OpenAI-only implementation.
