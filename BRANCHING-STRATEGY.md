# Branching Strategy

## Overview
This project uses a lightweight Git Flow model that supports parallel teamwork while keeping production stable.

## Branch Types
- `main`: Production-ready code only. Protected branch, merges require review and passing checks.
- `develop`: Integration branch for completed features before release.
- `feature/*`: New work branches created from `develop` (example: `feature/docker-setup`).
- `hotfix/*`: Emergency production fixes created from `main` and merged back to both `main` and `develop`.

## Team Workflow
1. Create a feature branch from `develop`.
2. Commit small, clear changes and open a pull request into `develop`.
3. Validate tests and review before merge.
4. Merge `develop` into `main` during release windows.
5. For urgent incidents, patch from `hotfix/*` and sync both long-lived branches.

## Why This Supports Team Collaboration
- Keeps production safe by isolating unfinished work.
- Enables multiple contributors to deliver features in parallel.
- Makes emergency fixes fast without blocking ongoing development.
- Provides a clear path from development to release.
