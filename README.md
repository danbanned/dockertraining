# WHAT CI WORKFLOW DOES 

1️⃣ Runs Automatically
The workflow runs when:
Code is pushed to main or develop
A pull request is opened for main

It also prevents multiple workflows running at the same time using concurrency control.

Job 1: Test and Lint

This job verifies that the application works correctly before building or deploying.

What it does

Downloads your repository code

Creates a .env file for testing

Installs Node.js and dependencies

Generates Prisma database client

Runs a linter to check code quality

Builds and starts Docker containers

Starts a PostgreSQL database

Waits for the database to become ready

Runs Prisma database migrations

Runs automated tests

Uploads test results as artifacts

Stops and removes containers

If any step fails, the workflow stops and does not continue.

Job 2: Build Docker Image

This job runs only if tests pass.

What it does

Builds your Docker image

Uses Docker layer caching to speed up builds

Logs into AWS ECR

Logs into GitHub Container Registry (GHCR)

Builds the image once

Tags the image

Pushes the image to two registries

Amazon ECR

GitHub Container Registry

Scans the image for security vulnerabilities using Trivy

Uploads vulnerability reports to GitHub

This ensures your container image is secure and stored in multiple registries.

Job 3: Deploy to AWS

This job runs only on pushes to the main branch.

What it does

Authenticates to AWS using OIDC (secure role-based auth)

Updates the ECS task definition with the new Docker image

Deploys the updated container to AWS ECS

Waits for the service to stabilize

Confirms the deployment succeeded

Your application is then running in AWS ECS.

Security Features in Your Workflow

Your pipeline includes several best practices:

OIDC authentication to AWS (no long-lived credentials)

Secret management through GitHub Secrets

Docker vulnerability scanning

Separate test database from production

Automatic cleanup of containers

Concurrency protection

Job timeouts to prevent stuck builds

End Result

When you push code:

Code is tested automatically

Docker containers are built and verified

A secure Docker image is created

The image is pushed to ECR and GHCR

The application is automatically deployed to AWS ECS

✅ In one sentence:
Your ci.yml creates a fully automated CI/CD pipeline that tests your code, builds a Docker image, scans it for vulnerabilities, pushes it to container registries, and deploys it to AWS ECS.

# BrightPath Tutoring

BrightPath Tutoring is a student-focused platform for tutor matching, session scheduling, and progress visibility.

## Business Reflection
Educational products run on fixed schedules (class periods and tutoring windows). Reproducible containerized deployments reduce operational risk during peak learning hours, which protects trust for families, tutors, and schools.

## Tech Stack
- Next.js 14 (App Router)
- React 18
- Node.js 20
- PostgreSQL 15
- Docker + Docker Compose
- GitHub Actions (CI)

## Deterministic Docker + Compose Rebuild
1. Remove local images/containers for this project.
2. Clone fresh and enter repo.
3. Copy env template:
   - `cp .env.production.example .env.production`
4. Rebuild from scratch:
   - `docker compose build --no-cache`
5. Start services:
   - `docker compose up -d`
6. Verify health:
   - `docker compose ps`
   - App: `http://localhost:3000`

## CI Build + Test Enforcement
CI workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

It enforces on push/PR:
- `npm ci`
- `npm test`
- `npm run build`

## Secret Injection Discipline
- Secrets are not hardcoded in `docker-compose.yml`.
- Runtime variables are injected from `.env.production`.
- Committed template file: `.env.production.example`.
- Required variables:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `DATABASE_URL`

## Failure Detection Using Logs
Use logs as a first-class validation signal:

```bash
docker compose logs --tail=120 app db
./scripts/validate-logs.sh
```

The script fails when it detects error markers and passes only when healthy startup markers are present.

## Branch + PR + Peer Review Workflow
- Branch model: [`BRANCHING-STRATEGY.md`](BRANCHING-STRATEGY.md)
- Contribution policy: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- PR template: [`.github/pull_request_template.md`](.github/pull_request_template.md)

Rules:
- No direct commits to `main`
- Open PR from feature branch
- Capture at least one peer review comment
- Merge only with green CI

## 10-Minute Validation Rehearsal (2/26 Deliverable)
1. Clone + `docker compose build`
2. `docker compose up -d` + app load check
3. Push trivial change and show CI running
4. Delete required secret in GitHub and push (expect red badge)
5. Restore secret and push (expect green badge)
6. Show PR + peer review comment

## Local Development (without Docker)
```bash
npm ci
npm run dev


# My App - Production-Ready Docker Application

A production-ready Node.js application containerized with Docker, optimized for AWS deployment.

## Features

- 🐳 Multi-stage Docker build for minimal image size
- 🔒 Security best practices (non-root user, helmet.js)
- 📊 Health checks and graceful shutdown
- 🔄 Database (PostgreSQL) and Redis integration
- 📝 Structured logging with Winston
- 🚦 CI/CD pipeline with GitHub Actions
- 🏥 Health check endpoint for container orchestration
- 🔐 Environment-based configuration

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- AWS CLI (for deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-app.git
   cd my-app
```

# My App - Production-Ready Docker Application for AWS

A production-ready Next.js application containerized with Docker, optimized for AWS deployment (ECS/EKS/Beanstalk).

## 🚀 Features

- **Next.js 14** with App Router support
- **Docker multi-stage builds** for minimal image size
- **Prisma ORM** for database management
- **AWS ECS Fargate** ready configuration
- **GitHub Actions CI/CD** pipeline
- **Health checks** and graceful shutdown
- **Non-root user** for security
- **Environment-based configuration**
- **PostgreSQL** and **Redis** integration

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- AWS CLI (for deployment)
- An AWS account with ECR and ECS configured

## 🏗️ Project Structure

ECR repository
ECS cluster
ECS service
Task definition
Networking
Security groups
IAM roles

- IAM ROLES REQIRMENTS!!!
   {
      "Version": "2012-10-17",
      "Statement": [
         {
               "Effect": "Allow",
               "Action": [
                  "ecr:GetAuthorizationToken",
                  "ecr:BatchCheckLayerAvailability",
                  "ecr:GetDownloadUrlForLayer",
                  "ecr:GetRepositoryPolicy",
                  "ecr:DescribeRepositories",
                  "ecr:ListImages",
                  "ecr:BatchGetImage",
                  "ecr:InitiateLayerUpload",
                  "ecr:UploadLayerPart",
                  "ecr:CompleteLayerUpload",
                  "ecr:PutImage"
               ],
               "Resource": "*"
         },
         {
               "Effect": "Allow",
               "Action": [
                  "ecs:DescribeServices",
                  "ecs:DescribeTaskDefinition",
                  "ecs:DescribeTasks",
                  "ecs:ListTasks",
                  "ecs:RegisterTaskDefinition",
                  "ecs:RunTask",
                  "ecs:StartTask",
                  "ecs:StopTask",
                  "ecs:UpdateService",
                  "ecs:ListClusters",
                  "ecs:ListServices",
                  "ecs:ListTaskDefinitions"
               ],
               "Resource": "*"
         },
         {
               "Effect": "Allow",
               "Action": [
                  "iam:PassRole"
               ],
               "Resource": "*"
         }
      ]
   }