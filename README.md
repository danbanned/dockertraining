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
```
