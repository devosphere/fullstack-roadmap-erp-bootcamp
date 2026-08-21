# [EPIC] Application Foundation

<!-- GitHub title: [EPIC] Application Foundation
     Labels: epic, frontend, backend, database
     Milestone: Sprint 01 - Application Foundation
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 005-009 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: frontend, backend, database
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Purpose

Create the technical foundation required for ERP development: a running frontend, a running
backend API, a connected database, a reproducible Docker environment, and an automated CI
pipeline.

The focus is not ERP business features. The focus is creating a scalable foundation where
future modules can be developed consistently.

## Business Value

The architecture created here affects every future ERP module. Nine business modules across 15
remaining sprints will be built inside this structure. Conventions established now are either
inherited for free or paid for repeatedly in refactoring.

## Issues

- [ ] #5 Setup Frontend Application
- [ ] #6 Setup Backend Application
- [ ] #7 Configure Database Layer
- [ ] #8 Setup Docker Environment
- [ ] #9 Configure CI Pipeline

## Target Architecture

```text
                 User

                  ↓

              Next.js

                  ↓

              REST API

                  ↓

              NestJS

                  ↓

             PostgreSQL
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Frontend runs locally and serves a page
- [ ] Backend starts and exposes `GET /api/health`
- [ ] Database connected with a working migration
- [ ] Frontend successfully calls the backend
- [ ] `docker compose up` starts the full stack
- [ ] CI passes on Pull Requests
- [ ] Architecture and local setup documented
- [ ] Release v0.2.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` |
| Phase overview | `academy/08-sprints/phase-00-foundation/phase-overview.md` |
| Coding standards | `academy/04-development/` |
| Release | v0.2.0 |
