# Contributing Workflow

## Branching Rules
- Never commit directly to `main`.
- Create feature branches from `develop` using `feature/<name>`.
- Open a PR into `develop`.
- Require at least one peer review comment before merge.

## Required Checks
- CI must be green (`npm test` + `npm run build`).
- Docker validation must pass locally before opening PR.

## Validation Commands
```bash
npm ci
npm test
npm run build
docker compose build
docker compose up -d
docker compose logs --tail=100 app db
```
