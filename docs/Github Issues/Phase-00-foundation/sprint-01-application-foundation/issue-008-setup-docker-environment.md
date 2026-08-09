# [TASK] Setup Docker Environment

<!-- GitHub title: [TASK] Setup Docker Environment
     Labels: task, backend, priority: medium
     Milestone: Sprint 01 - Application Foundation
     Branch: feature/008-setup-docker-environment
     Epic: Application Foundation
     Depends on: 005, 006, 007
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Summary

Create a reproducible local development environment using Docker Compose, so that a developer
can start the frontend, backend, and PostgreSQL with a single command.

## Background

Running the stack currently requires installing Node.js and PostgreSQL locally, matching
versions by hand, and starting three processes in the correct order. That works until the
versions drift, at which point "works on my machine" becomes a real cost.

Containerizing now also pays forward: the same images are used by CI in Issue 009, and the
production deployment in Sprint 13 is built on the same container definitions rather than a
separate, untested path.

## Acceptance Criteria

```gherkin
Given a machine with Docker installed and the repository cloned
When the developer runs docker compose up
Then the frontend, backend, and database all start and the application is reachable in a browser
```

```gherkin
Given the stack is running
When the developer edits a source file
Then the change is reflected without rebuilding the image
```

```gherkin
Given the stack is stopped and started again
When the developer queries the database
Then previously seeded data is still present
```

- [ ] `Dockerfile` created for the frontend
- [ ] `Dockerfile` created for the backend
- [ ] `docker-compose.yml` defining frontend, backend, and PostgreSQL services
- [ ] Service startup ordering handled so the backend waits for a healthy database
- [ ] Named volume configured so database data survives restarts
- [ ] Hot reload working for both frontend and backend in development
- [ ] Environment variables passed through Compose, with no secrets committed
- [ ] `docker compose up` starts the full stack successfully
- [ ] `docker compose down` stops it cleanly
- [ ] Migrations runnable inside the backend container
- [ ] `.dockerignore` files created
- [ ] Setup and common commands documented in the root `README.md`

## Expected Result

A developer with only Docker installed can clone the repository, copy `.env.example`, run one
command, and have a working full-stack environment with a seeded database.

---

## Scope

### Included

- Frontend and backend Dockerfiles
- `docker-compose.yml` for local development
- PostgreSQL service with a persistent volume
- Health-gated startup ordering
- Hot reload configuration
- `.dockerignore` files
- Documentation of the workflow

### Out of Scope

- Production images and orchestration (Sprint 13)
- Cache service container (Sprint 12)
- Background worker containers (Sprint 10)
- CI pipeline configuration (Issue 009)

## Technical Requirements

**Services**

| Service | Purpose | Port |
|---------|---------|------|
| `frontend` | Next.js application | 3000 |
| `backend` | NestJS API | 3001 |
| `database` | PostgreSQL | 5432 |

**Target files**

```text
docker-compose.yml
frontend/Dockerfile
frontend/.dockerignore
backend/Dockerfile
backend/.dockerignore
```

**Requirements**

- The backend depends on the database being healthy, not merely started.
- Source directories are bind-mounted in development so hot reload works.
- `node_modules` is not bind-mounted from the host.
- Database data uses a named volume.
- No secret values appear in `docker-compose.yml`; they come from `.env`.

## Dependencies

- Issue 005 — frontend application must exist.
- Issue 006 — backend application must exist.
- Issue 007 — database layer and migrations must exist.

## Definition of Done

- [ ] Verified on a clean machine by following the documented steps exactly
- [ ] Full stack starts with one command
- [ ] Data persists across restarts
- [ ] Hot reload verified for both applications
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` § 6 |
| DevOps guide | `academy/06-devops/` |
| Epic | Application Foundation |
| Pull Request | _to be linked_ |
