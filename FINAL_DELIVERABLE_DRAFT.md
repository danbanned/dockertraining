# Project Final Deliverables: DevOps Pipeline Technical Demo

**Due Date:** March 26, 2026  
**Associate:** Person  
**Course Context:** AI DevOps Pipeline Engineering

This document contains the written material for the BrightPath project milestone, including the DevOps demo script, technical skill alignment, and problem-solution mapping.

## I. DevOps Demo Script

### Introduction
Hello, my name is Person, and this is my BrightPath DevOps Pipeline Technical Demo.

BrightPath is a full-stack Next.js and PostgreSQL application designed to help users turn long-term life and career goals into structured roadmaps, daily execution plans, and measurable progress. The system combines backend planning logic, AI-assisted guidance, Docker-based deployment, and CI/CD automation.

### System Architecture
The application has four main layers:

1. Frontend
   - Built with Next.js App Router.
   - The user interface lives in `app/`.
   - Main screens include onboarding, dashboard, roadmap, tasks, jobs, progress, weekly review, decisions, and settings.

2. Backend Logic
   - Business logic lives in `backend/src/`.
   - Controllers handle auth, goals, roadmap generation, task generation, jobs, progress scoring, and AI routes.
   - Services include `roadmapEngine`, `taskEngine`, `progressEngine`, `decisionEngine`, and `aiRouter`.

3. Database
   - PostgreSQL stores users, goals, roadmaps, tasks, applications, progress metrics, and AI logs.
   - Prisma manages the schema and migrations through `prisma/schema.prisma` and the migrations folder.

4. DevOps Pipeline
   - Dockerfile defines the build and production runtime.
   - Docker Compose orchestrates the app and database locally.
   - GitHub Actions runs CI/CD tasks including testing, building, scanning, and deployment.

### User Interface and AI Walkthrough
I will present the application in this order:

1. Landing page
   - Explain the BrightPath concept.
   - Show entry points for registration and login.

2. Authentication
   - Explain that protected AI routes require a valid session token.
   - Show login behavior and session cookie handling.

3. Onboarding
   - Demonstrate how a user enters career, income, location, fitness, and communication goals.
   - Explain that these goals drive the roadmap and task engines.

4. Dashboard
   - Show the weighted progress score.
   - Show today’s tasks and the weakest category.
   - Explain that backend business rules determine what the user should focus on.

5. Roadmap
   - Show the multi-year roadmap output.
   - Explain that the roadmap engine determines milestones and AI helps explain them.

6. Tasks
   - Generate daily tasks.
   - Mark a task complete.
   - Explain how low-scoring categories are prioritized.

7. Jobs
   - Log a new job application.
   - Update application status.
   - Show how the app tracks career execution progress.

8. AI Integration
   - Show the AI health endpoint.
   - Explain fallback logic: Groq first, Gemini second, Ollama third, local fallback last.
   - Demonstrate one AI feature such as weekly review or decision support.

### Push-to-Deploy Demonstration Plan
For the push-to-deploy section, I will:

1. Show the GitHub Actions workflow file and explain the CI/CD stages.
2. Show Docker and Docker Compose setup.
3. Make a small visible UI change in the code.
4. Push the change to the branch.
5. Show the CI pipeline starting automatically.
6. Walk through the test, build, scan, and deployment stages.
7. Refresh the deployed application and verify the change is live.

### Closing
This project demonstrates full-stack development, database-backed backend logic, AI integration, containerization, automated CI/CD, and deployment readiness.

## II. Technical Skill Alignment

### TS.1 System Explanation
**Competency Area:** Clear communication of code and system architecture.  
**Application in This Project:** I can explain the relationship between frontend pages, backend controllers and services, the Prisma data model, and the CI/CD pipeline. The system is structured clearly enough to describe how data flows from the user interface to backend logic and persistence.

### TS.3 Pipeline and Cloud
**Competency Area:** Usage of Docker and CI/CD pipelines.  
**Application in This Project:** The application uses Docker and Docker Compose for reproducible local and production-style environments. GitHub Actions is used to automate testing, image build, and deployment workflow. The project is structured to support AWS deployment.

### TS.4 App Development
**Competency Area:** Building the functional Next.js and Prisma application.  
**Application in This Project:** I built a functional app using Next.js for the frontend, backend service/controller layers for logic, and Prisma/PostgreSQL for data persistence. Key features include onboarding, dashboard, roadmap, task tracking, jobs tracking, progress scoring, and AI routes.

### TS.5 Debugging
**Competency Area:** Identifying and resolving live deployment or database issues.  
**Application in This Project:** During implementation I diagnosed and corrected route import issues, auth flow issues, Prisma schema validation issues, and AI readiness issues. The app also includes health and validation endpoints to support troubleshooting.

### TS.6 AI Safety
**Competency Area:** AI handling and privacy-aware implementation.  
**Application in This Project:** AI provider calls are kept on the server side rather than exposed directly in the browser. Authentication is required for protected AI endpoints. Secrets are stored in environment variables, and AI requests are logged through controlled backend flows.

## III. Problem and Solution Mapping

### Identified Problem
Users often have long-term life and career goals but do not have a reliable system to break those goals into clear milestones, daily actions, and measurable progress. On the technical side, inconsistent deployment processes make demos and releases risky.

### Solution Features
1. AI-powered roadmap generation
   - Turns broad user goals into a structured multi-year plan.

2. Daily task prioritization
   - Uses roadmap context and progress scoring to decide what the user should do next.

3. Automated DevOps pipeline
   - Uses Docker and CI/CD workflow support to make builds, tests, and deployment repeatable.

### Short Mapping Summary
BrightPath solves both a user-planning problem and an engineering-delivery problem by combining structured backend planning, AI-generated guidance, and automated deployment workflow.
