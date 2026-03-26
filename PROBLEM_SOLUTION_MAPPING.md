# Problem and Solution Mapping

## Identified Problem
People trying to improve their life and career direction often have goals that are too broad, too scattered, or too difficult to turn into daily execution. They may know they want better career outcomes, stronger habits, and more structured progress, but they lack:

- a clear long-term roadmap,
- a daily prioritization system,
- and a way to connect AI guidance to real measurable progress.

From a technical perspective, many projects also lack a reliable deployment pipeline, which makes demos and releases inconsistent and risky.

## Solution Features
### 1. AI-Powered Roadmap Generation
BrightPath converts user goals into a structured multi-year plan.

How it solves the problem:
- turns vague ambitions into milestones,
- provides clear direction over time,
- uses AI to explain and personalize the plan.

Relevant implementation:
- `backend/src/services/roadmapEngine.js`
- `backend/src/controllers/roadmapController.js`
- `app/roadmap/page.js`

### 2. Daily Task Prioritization
BrightPath generates daily tasks based on roadmap context and current weak areas in progress scoring.

How it solves the problem:
- converts strategy into immediate action,
- prioritizes the lowest-performing category,
- helps the user focus on the next highest-value work instead of guessing.

Relevant implementation:
- `backend/src/services/taskEngine.js`
- `backend/src/services/progressEngine.js`
- `backend/src/controllers/taskController.js`
- `app/tasks/page.js`
- `app/dashboard/page.js`

### 3. Automated DevOps Pipeline
The project includes containerization and CI/CD workflow support for build, test, and deployment.

How it solves the problem:
- reduces manual deployment risk,
- creates a repeatable demo and release process,
- improves confidence that code changes can move safely from development to deployment.

Relevant implementation:
- `Dockerfile`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `README.md`

## Short Problem-Solution Summary
BrightPath addresses the gap between high-level goals and daily execution by combining structured backend planning logic, AI-generated guidance, and a deployment pipeline that keeps the application reproducible and demo-ready.
