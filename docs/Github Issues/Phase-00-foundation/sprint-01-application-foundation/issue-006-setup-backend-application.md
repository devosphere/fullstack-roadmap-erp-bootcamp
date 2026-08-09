# [FEATURE] Setup Backend Application

<!-- GitHub title: [FEATURE] Setup Backend Application
     Labels: feature, backend, priority: high
     Milestone: Sprint 01 - Application Foundation
     Branch: feature/006-setup-backend-application
     Epic: Application Foundation
     Blocks: 007, 008, 009
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Summary

Create the backend service foundation in `backend/` using NestJS and TypeScript, with
environment configuration, a modular API structure, and a working `GET /api/health` endpoint
that the frontend can call.

## Background

`backend/` currently contains only a placeholder `README.md`.

Every ERP module from Sprint 02 onward is a NestJS module inside this application: `auth/`,
`users/`, `employees/`, `inventory/`, `sales/`, `procurement/`, `finance/`. The module layout,
configuration approach, and error handling conventions established here are inherited by all of
them.

The health endpoint is small but load-bearing: it is what proves the frontend-to-backend path
works, and it becomes the readiness probe used by Docker in Issue 008 and by production
deployment in Sprint 13.

## User Story

As a Backend Developer,
I want a configured NestJS application with a modular structure and a working endpoint,
So that ERP business modules can be added consistently and verified end to end.

## Acceptance Criteria

```gherkin
Given the repository is cloned and dependencies are installed
When the developer starts the backend
Then the application boots without errors and listens on the configured port
```

```gherkin
Given the backend is running
When a client requests GET /api/health
Then the response is 200 with body { "status": "healthy" }
```

```gherkin
Given a required environment variable is missing
When the application starts
Then it fails immediately with a clear message naming the missing variable
```

- [ ] NestJS application initialized inside `backend/`
- [ ] TypeScript configured with `strict` mode enabled (no `any`)
- [ ] Feature-based module structure created: `src/common/`, `src/config/`, `src/modules/`
- [ ] `GET /api/health` implemented and returning `{ "status": "healthy" }`
- [ ] Global API prefix `/api` configured
- [ ] Global validation pipe configured
- [ ] Global exception filter returning a consistent error shape
- [ ] Environment configuration loaded and validated at startup (`PORT`, `DATABASE_URL`)
- [ ] `.env.example` provided with no real values, `.env` git-ignored
- [ ] CORS configured to allow the frontend origin
- [ ] ESLint and Prettier configured, and lint runs clean
- [ ] Local setup steps documented in `backend/README.md`

## Expected Result

The developer can install dependencies, start the backend, and receive a healthy response from
`GET /api/health`. The frontend from Issue 005 can call it without CORS errors. Missing
configuration fails loudly at startup rather than silently at runtime.

---

## Scope

### Included

- NestJS + TypeScript project initialization
- Module folder structure per academy standards
- Health endpoint
- Global prefix, validation pipe, and exception filter
- Environment configuration and startup validation
- CORS configuration
- ESLint + Prettier
- Backend setup documentation

### Out of Scope

- Database connection and Prisma (Issue 007)
- Dockerization (Issue 008)
- CI pipeline wiring (Issue 009)
- Authentication (Sprint 02)
- Any business module

## Technical Requirements

**Stack**

| Concern | Choice |
|---------|--------|
| Runtime | Node.js LTS |
| Framework | NestJS |
| Language | TypeScript (strict) |
| API style | REST |

**Target structure**

```text
backend/
├── src/
│   ├── common/          filters, guards, interceptors, pipes
│   ├── config/          environment loading and validation
│   ├── modules/
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env.example
├── package.json
└── tsconfig.json
```

**Environment variables**

```text
PORT=
DATABASE_URL=
CORS_ORIGIN=
```

**Conventions**

- Controllers handle request, validation, and response only.
- Business logic lives in services.
- File naming is dot-separated: `health.controller.ts`, `health.service.ts`.
- Comments explain *why*, not *what*.

## Dependencies

None. This issue can start immediately alongside Issue 005.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit test for the health endpoint added
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` § 2, § 4 |
| Coding standards | `academy/04-development/` |
| Epic | Application Foundation |
| BRD / SRS | Not yet authored |
| Pull Request | _to be linked_ |
