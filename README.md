# BrightPath Tutoring

## Project Overview
BrightPath Tutoring is a student-focused educational platform designed to improve academic outcomes through personalized tutoring, structured lesson plans, and measurable progress tracking. The business problem it solves is inconsistent learning support across schools and households by giving families one reliable platform for scheduling, tutoring, and progress visibility.

## Quick Start
Single command to build and run:

```bash
docker build -t brightpath-app . && docker run --rm -p 3000:3000 brightpath-app
```

Open the app at `http://localhost:3000`.

## Architecture
- `Next.js` application containerized with a multistage Docker build.
- Builder stage (`node:20-alpine`) installs dependencies and compiles the Next.js app.
- Production stage (`node:20-alpine`) copies only standalone runtime artifacts (`server.js`, minimal dependencies, static assets).

Why this setup:
- Smaller final image size.
- Faster container startup and deployment.
- Reduced attack surface by excluding build-only files from runtime.

## Business Value
Containerization ensures every developer, QA tester, and instructor runs the exact same environment. For student-facing education apps, this prevents "works on my machine" failures that can disrupt tutoring sessions, assignment review, and family trust. Docker standardizes setup, lowers onboarding time, and improves release reliability.

## Tech Stack
- Next.js 14 (App Router)
- React 18
- Node.js 20
- Docker (multistage image)

## Why Containerization Matters for EdTech
Educational products serve users on fixed schedules (class periods, tutoring sessions, homework windows). When environments differ across machines, deployments become risky and downtime affects learning directly. Docker provides consistent builds and repeatable releases so tutoring workflows remain stable.

## Local Development (without Docker)
```bash
npm run dev
```

## Build/Run Commands
```bash
# Build production image
docker build -t brightpath-app .

# Run container on port 3000
docker run --rm -p 3000:3000 brightpath-app

# Verify image exists
docker images | grep brightpath-app
```
